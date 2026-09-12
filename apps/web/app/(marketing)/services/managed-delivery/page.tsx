import type { Metadata } from "next";
import {
  Target, Users, ShieldCheck, BarChart3, CheckCircle2,
  ArrowRight, Clock, TrendingUp, Layers, MessageSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "What Is Managed Delivery? | UmberCore",
  description:
    "Managed Delivery is a software development model where UmberCore takes full ownership of project outcomes — scope, team, timeline, budget, and quality.",
};

const howItWorks = [
  {
    n: "01",
    icon: Target,
    title: "Clear Scope & Objectives",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/20",
    desc: "We begin by defining the project scope, deliverables, and key milestones in close collaboration with you. Aligned expectations from day one prevent scope creep and misaligned outcomes down the line.",
  },
  {
    n: "02",
    icon: Users,
    title: "Team Allocation & Management",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/20",
    desc: "We assemble and manage a dedicated team — project managers, engineers, QA specialists, and any domain experts the project requires. Day-to-day operations are fully handled by us.",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Risk Management",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    desc: "We identify and mitigate technical and business risks early. Regular assessments and contingency planning keep issues from escalating and protect timeline, quality, and budget.",
  },
  {
    n: "04",
    icon: BarChart3,
    title: "Continuous Monitoring & Reporting",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    desc: "You receive regular progress updates with full transparency into KPIs, milestones, and blockers. Real-time reporting means you're always informed — without being in the weeds.",
  },
  {
    n: "05",
    icon: CheckCircle2,
    title: "Quality Assurance",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    desc: "Testing is built into every phase — not bolted on at the end. Automated testing, continuous integration, and dedicated QA specialists ensure every delivery meets a high standard.",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Risk Reduction",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    desc: "Proactive risk management prevents delays, overruns, and quality failures before they happen. Compliance with industry standards is handled as part of the process.",
  },
  {
    icon: TrendingUp,
    title: "Consistent Quality",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
    desc: "Dedicated teams and continuous testing guarantee that deliverables meet high standards at every phase — not just at handoff.",
  },
  {
    icon: Clock,
    title: "On Time, On Budget",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    desc: "Structured planning and careful monitoring keep projects on schedule and within budget. You can plan around delivery dates with confidence.",
  },
  {
    icon: Layers,
    title: "Full Accountability",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    desc: "We own the outcome — not just the effort. If something needs adjusting, we adjust it. You focus on business decisions; we handle execution.",
  },
];

const dmResponsibilities = [
  { icon: MessageSquare, title: "Client Communication", desc: "Transparent, regular updates between you and the team. Your feedback is integrated into the process continuously." },
  { icon: Target,        title: "Project Oversight",   desc: "Monitoring progress, resolving blockers, and keeping scope, timeline, and budget on track at every stage." },
  { icon: ShieldCheck,   title: "Risk Management",     desc: "Identifying issues early, managing incidents, and running root cause analysis to prevent recurrence." },
  { icon: CheckCircle2,  title: "Quality Assurance",   desc: "Reviewing deliverables against agreed quality standards and ensuring consistency across all communications." },
  { icon: Users,         title: "Resource Management", desc: "Allocating time, staff, and tools efficiently — and coordinating cross-functional resources when the project demands it." },
  { icon: BarChart3,     title: "SLA Adherence",       desc: "Ensuring delivery meets agreed service levels and continuously developing KPIs to improve performance and outcomes." },
];

const gradientText = {
  background: "linear-gradient(115deg, hsl(160 56% 70%) 0%, hsl(196 80% 65%) 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};

export default function ManagedDeliveryPage() {
  return (
    <div className="min-h-screen bg-surface-default text-foreground">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-hero py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-green/8 blur-[120px]" />
          <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-brand-blue/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <a href="/services" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/40 transition-colors hover:text-brand-green">
            ← Back to Services
          </a>
          <p className="hero-eyebrow mb-4 mt-2">Managed Delivery</p>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-6xl">
            We own the outcome —<br />
            <span style={gradientText}>not just the effort.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/55">
            Managed Delivery is a software development model where UmberCore takes
            full responsibility for delivering your project — scope, team, timeline,
            budget, and quality. You define the goal; we handle everything else.
          </p>
        </div>
      </section>

      {/* ── What it is ── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-3">The model explained</p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            What is Managed Delivery?
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-foreground/60">
            <p>
              Traditional delivery models — Waterfall, Agile, DevOps — differ in approach,
              but they all share one thing: they require strong internal management to succeed.
              Managed Delivery removes that burden from your team entirely.
            </p>
            <p>
              In a Managed Delivery engagement, a specialized UmberCore team takes full
              ownership of your project. We plan it, staff it, manage it, test it, and
              deliver it — with complete transparency at every step. Projects meet
              deadlines, stay within scope, and adhere to budget, because accountability
              sits with us, not fragmented across your internal resources.
            </p>
            <p>
              This model is especially valuable for companies that want high-quality,
              predictable software delivery without building — or stretching — an in-house
              engineering management function to do it.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-border/50 bg-surface-dark py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="hero-eyebrow mb-3">The process</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              How Managed Delivery works.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-foreground/50">
              Five structured stages — from scoping to final handoff — with full
              accountability at each one.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((step) => (
              <div
                key={step.n}
                className={`relative rounded-2xl border ${step.border} bg-surface-elevated/40 p-7`}
              >
                <p className={`font-mono text-3xl font-extrabold ${step.color} opacity-30 mb-4`}>{step.n}</p>
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${step.bg} ${step.color}`}>
                  <step.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className={`font-heading text-lg font-bold ${step.color} mb-2`}>{step.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/55">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="hero-eyebrow mb-3">Why it works</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              Benefits of Managed Delivery.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/[0.07] bg-surface-elevated/40 p-7"
              >
                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${b.bg} ${b.color}`}>
                  <b.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className={`font-heading text-lg font-bold ${b.color} mb-2`}>{b.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/55">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Delivery Manager ── */}
      <section className="border-t border-border/50 bg-surface-dark py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="hero-eyebrow mb-3">The person accountable</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              The role of the Delivery Manager.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-foreground/50">
              Every Managed Delivery engagement is led by a dedicated Delivery Manager —
              your single point of contact and the person ultimately accountable for
              project outcomes.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dmResponsibilities.map((r) => (
              <div
                key={r.title}
                className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-surface-elevated/40 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                  <r.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-heading font-bold text-foreground">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/50">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="hero-eyebrow mb-3">Choosing the right model</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              Managed Delivery vs. Staff Augmentation.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/50">
              Both models deliver results — the difference is who owns the process.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Managed Delivery */}
            <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 p-8">
              <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-green/60">Managed Delivery</p>
              <h3 className="font-heading text-2xl font-bold text-brand-green mb-1">We own the outcome.</h3>
              <p className="mb-6 text-sm text-foreground/45">Outcome-based · Milestone billing · UmberCore accountable</p>
              <ul className="space-y-3">
                {[
                  "You define goals — we manage everything else",
                  "Dedicated delivery lead included",
                  "Billed against milestones or project completion",
                  "Best for defined projects with clear deliverables",
                  "Ideal when internal PM bandwidth is limited",
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-foreground/65">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            {/* Staff Augmentation */}
            <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-8">
              <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-blue/60">Staff Augmentation</p>
              <h3 className="font-heading text-2xl font-bold text-brand-blue mb-1">You direct the work.</h3>
              <p className="mb-6 text-sm text-foreground/45">Time & materials · You accountable · Engineers embedded</p>
              <ul className="space-y-3">
                {[
                  "You set priorities and own outcomes",
                  "Engineers integrate into your existing team",
                  "Billed on hours worked",
                  "Best for ongoing capacity and skill gaps",
                  "Ideal when you have strong internal leadership",
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-foreground/65">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                    {pt}
                  </li>
                ))}
              </ul>
              <a
                href="/services/staff-augmentation"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
              >
                Learn more about Staff Augmentation <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/50 bg-surface-dark py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-3">Let's scope it together</p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            Ready for a team that owns the outcome?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/50">
            Tell us what you're trying to build. We'll recommend the right delivery
            model, team structure, and timeline — no commitment required on day one.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/#get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-semibold text-surface-dark transition-all hover:bg-brand-green/90"
            >
              Start a conversation
            </a>
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-foreground transition-all hover:bg-white/[0.08]"
            >
              View all services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
