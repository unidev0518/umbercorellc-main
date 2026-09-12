import Stripe from "stripe";
import type { MemberScenario, MemberTier } from "@umbercore/database";
import { getPriceIdForTier } from "./config";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripe;
}

export interface CreateCheckoutParams {
  tier: MemberTier;
  email?: string;
  scenario?: MemberScenario;
  utmSource?: string;
  utmCampaign?: string;
}

export async function createMembershipCheckout(
  params: CreateCheckoutParams
): Promise<string> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const priceId = getPriceIdForTier(params.tier);

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: params.email,
    success_url: `${siteUrl}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/membership`,
    metadata: {
      tier: params.tier,
      scenario: params.scenario ?? "",
      utm_source: params.utmSource ?? "",
      utm_campaign: params.utmCampaign ?? "",
    },
    subscription_data: {
      metadata: { tier: params.tier },
    },
  });

  if (!session.url) throw new Error("Failed to create checkout session");
  return session.url;
}

export async function createBillingPortalSession(
  customerId: string
): Promise<string> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/member/settings`,
  });
  return session.url;
}
