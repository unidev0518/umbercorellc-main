import { cookies } from "next/headers";
import { adminClient, browserClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("portal_role")?.value;
  const token = cookieStore.get("portal_session")?.value;
  if (!token) redirect("/login");

  const { data: { user } } = await browserClient().auth.getUser(token);
  if (!user) redirect("/login");

  const { data: profile } = await adminClient().from("portal_users").select("full_name, company_name").eq("id", user.id).single();
  const firstName = profile?.full_name?.split(" ")[0] || "there";

  const steps = role === "client"
    ? ["Your account manager will schedule an onboarding call to understand your team needs.", "We will match you with pre-vetted engineers based on your requirements.", "Review candidate profiles and start your engagement within days."]
    : ["Your account manager will reach out to confirm your availability and preferences.", "We will match you with a client opportunity that fits your skills.", "Once matched, you will receive your engagement details here."];

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Welcome, {firstName}</h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
          {role === "client"
            ? "Your UmberCore team is ready to support your engineering goals."
            : "Your UmberCore account manager will be in touch with your first assignment details."}
        </p>
      </div>

      <div className="card p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--green-bg)", border: "1px solid var(--green-border)" }}>
            <svg className="w-5 h-5" fill="none" stroke="#c4813a" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Getting started</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>What happens next</p>
          </div>
        </div>

        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--green-bg)", color: "#c4813a", border: "1px solid var(--green-border)" }}>
                {i + 1}
              </span>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Questions? Email{" "}
        <a href="mailto:support@umbercore.com" style={{ color: "var(--green)" }}>support@umbercore.com</a>
      </p>
    </div>
  );
}
