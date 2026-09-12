import type Stripe from "stripe";
import {
  MemberRepository,
  ProfileRepository,
  StripeEventRepository,
} from "@umbercore/database";
import type { MemberTier, SubStatus } from "@umbercore/database";
import { EmailService } from "@umbercore/email";
import { getStripe } from "./checkout";
import { getTierFromPriceId } from "./config";

export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ received: boolean }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET not set");

  const event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);

  if (await StripeEventRepository.wasProcessed(event.id)) {
    return { received: true };
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
  }

  await StripeEventRepository.markProcessed(event.id, event.type);
  return { received: true };
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription") return;

  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) return;

  const tier = (session.metadata?.tier as MemberTier) ?? "starter";
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  const subId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!customerId || !subId) return;

  const { createAdminClient } = await import("@umbercore/database");
  const admin = createAdminClient();

  const { data: authList } = await admin.auth.admin.listUsers();
  let userId = authList?.users?.find((u) => u.email === email)?.id;

  let passwordSetupUrl: string | undefined;

  if (!userId) {
    const { data: created, error } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        first_name: session.customer_details?.name?.split(" ")[0] ?? "Member",
        last_name:
          session.customer_details?.name?.split(" ").slice(1).join(" ") ?? "",
      },
    });
    if (error) throw error;
    userId = created.user.id;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { data: linkData } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${siteUrl}/login` },
    });
    passwordSetupUrl = linkData.properties?.action_link;
  }

  const firstName =
    session.customer_details?.name?.split(" ")[0] ?? "Member";
  const lastName =
    session.customer_details?.name?.split(" ").slice(1).join(" ") ?? "";

  await ProfileRepository.upsert(userId, email, "member", {
    first_name: firstName,
    last_name: lastName,
  });

  await MemberRepository.upsert({
    user_id: userId,
    first_name: firstName,
    last_name: lastName,
    tier,
    scenario: (session.metadata?.scenario as "freelancer" | "founder" | "employee") || null,
    stripe_customer_id: customerId,
    stripe_sub_id: subId,
    sub_status: "active",
  });

  await EmailService.sendWelcomeMember(email, firstName, tier, passwordSetupUrl);
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const priceId = sub.items.data[0]?.price.id;
  const tier = priceId ? getTierFromPriceId(priceId) : null;
  const statusMap: Record<string, SubStatus> = {
    active: "active",
    past_due: "past_due",
    canceled: "canceled",
    paused: "paused",
    unpaid: "past_due",
  };
  const subStatus = statusMap[sub.status] ?? "active";

  await MemberRepository.updateSubscription(sub.id, {
    ...(tier && { tier }),
    sub_status: subStatus,
    sub_end_date: sub.cancel_at
      ? new Date(sub.cancel_at * 1000).toISOString().split("T")[0]
      : null,
  });
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  await MemberRepository.updateSubscription(sub.id, {
    sub_status: "canceled",
    sub_end_date: new Date().toISOString().split("T")[0],
  });
}
