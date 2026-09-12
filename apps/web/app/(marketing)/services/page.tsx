import type { Metadata } from "next";
import { UserCheck, FileCode2, RefreshCw, Clock, Users, PackageCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "UmberCore offers technology staffing and delivery services including direct placement, contract staffing, staff augmentation, and managed delivery.",
};

const services = [
  {
    icon: UserCheck,
    slug: "direct-placement",
    title: "Direct Placement",
    tagline: "The right hire, permanently.",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/20",
    desc: "We find, vet, and permanently place the right engineer for your role. Our screening process goes deep — technical skills, culture fit, and long-term alignment — so you hire once and hire right.",
    points: [
      "Fully vetted candidates only",
      "Technical and cultural fit assessment",
      "Replacement guarantee on all placements",
      "Typical time to offer: 1–2 weeks",
    ],
  },
  {
    icon: FileCode2,
    slug: "contract-staffing",
    title: "Contract Staffing",
    tagline: "Flexible talent, on your terms.",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/20",
    desc: "Skilled engineers on flexible contract terms — scale up or down as your project demands. From 3-month sprints to multi-year engagements, we match the right contractor to your exact stack and timeline.",
    points: [
      "Short or long-term contracts",
      "Fast deployment — often within 48 hours",
      "Full compliance and payroll handled",
      "VMS-compatible programme support",
    ],
  },
  {
    icon: RefreshCw,
    slug: "right-to-hire",
    title: "Right to Hire",
    tagline: "Try before you commit.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    desc: "Trial a contractor before converting to full-time. Reduce hiring risk without sacrificing speed — evaluate fit in a real environment before making a permanent commitment.",
    points: [
      "Contract-to-permanent conversion",
      "Risk-free evaluation period",
      "No double-billing on conversion",
      "Flexible conversion timeline",
    ],
  },
  {
    icon: Clock,
    slug: "temporary-project",
    title: "Temporary / Project",
    tagline: "Specialists for defined deliverables.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    desc: "Short-term specialists for defined deliverables. Get the expertise you need, exactly when you need it — without long-term overhead. Perfect for launches, migrations, and time-bound projects.",
    points: [
      "Project-scoped engagements",
      "Rapid mobilisation",
      "Temporary-to-hire options available",
      "Delivery milestone tracking",
    ],
  },
  {
    icon: Users,
    slug: "staff-augmentation",
    title: "Staff Augmentation",
    href: "/services/staff-augmentation",
    tagline: "Your team, extended.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    desc: "Embed vetted engineers directly into your existing team — they work alongside you, in your stack, on your schedule. Full integration without the full-time overhead.",
    points: [
      "Engineers embedded in your workflow",
      "Works within your existing tools and processes",
      "Scales up or down as needed",
      "Ongoing performance oversight",
    ],
  },
  {
    icon: PackageCheck,
    slug: "managed-delivery",
    title: "Managed Delivery",
    href: "/services/managed-delivery",
    tagline: "We own the outcome.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    desc: "End-to-end project ownership. We staff, manage, and deliver — you focus on business outcomes. Dedicated project managers, defined milestones, and full accountability from brief to handoff.",
    points: [
      "Dedicated delivery leads",
      "Defined scope, timeline, and milestones",
      "Full documentation and handoff",
      "Post-delivery support included",
    ],
  },
];

const gradientText = {
  background: "linear-gradient(115deg, hsl(160 56% 70%) 0%, hsl(196 80% 65%) 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-surface-default text-foreground">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-hero py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-green/8 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-72 w-72 rounded-full bg-brand-blue/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-4">What we offer</p>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-6xl">
            Staffing and delivery —<br />
            <span style={gradientText}>scoped to your needs.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/55">
            From permanent hires to full project delivery — we offer six engagement models
            so you get exactly the support your business requires, at exactly the right time.
          </p>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.slug}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border ${s.border} bg-surface-elevated/40 p-7 backdrop-blur-sm transition-all hover:bg-surface-elevated/70`}
              >
                {/* Icon */}
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                  <s.icon className="h-6 w-6" strokeWidth={1.6} />
                </div>

                {/* Title */}
                <h2 className={`font-heading text-xl font-bold ${s.color}`}>{s.title}</h2>
                <p className="mt-0.5 text-sm font-medium text-foreground/40">{s.tagline}</p>

                {/* Description */}
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">{s.desc}</p>

                {/* Key points */}
                <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-5">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-foreground/55">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${s.bg} ${s.color} flex items-center justify-center`}>
                        <span className="h-1 w-1 rounded-full bg-current" />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={"href" in s ? (s as { href: string }).href : "/#get-started"}
                  className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${s.color} opacity-0 transition-opacity group-hover:opacity-100`}
                >
                  {"href" in s ? "Learn more" : "Get started"} <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Delivery models note ── */}
      <section className="border-t border-border/50 bg-surface-dark py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="hero-eyebrow mb-3">Not sure which model fits?</p>
              <h2 className="font-heading text-3xl font-extrabold tracking-[-0.03em] text-foreground">
                We'll scope it with you.
              </h2>
              <p className="mt-4 text-lg text-foreground/50">
                Most engagements start with a 30-minute call. Tell us what you're trying to
                achieve — we'll recommend the right model, the right team size, and the right timeline.
                No commitment required on day one.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <a
                href="/#get-started"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-semibold text-surface-dark transition-all hover:bg-brand-green/90"
              >
                Find Talent
              </a>
              <a
                href="/#get-started"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-foreground transition-all hover:bg-white/[0.08]"
              >
                Find Work
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
