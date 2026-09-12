import type { Metadata } from "next";
import {
  FileText, Search, Handshake, CheckCircle2,
  ArrowRight, Clock, Globe2, Users, Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Find Work | UmberCore",
  description:
    "Looking for your next technology role? UmberCore matches engineers, developers, and tech specialists with top companies across 14+ industries worldwide.",
};

const steps = [
  {
    n: "01",
    icon: FileText,
    title: "Submit your profile",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/20",
    desc: "Tell us about your skills, experience, preferred role types, and availability. Takes less than 5 minutes — no account required.",
  },
  {
    n: "02",
    icon: Search,
    title: "We find your match",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/20",
    desc: "Our team reviews your profile and matches you against current and upcoming openings across our client network. We only reach out when there's a genuine fit.",
  },
  {
    n: "03",
    icon: Handshake,
    title: "We make the introduction",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    desc: "When there's a match, we introduce you to the client and manage the entire process — briefings, interviews, and negotiations — on your behalf.",
  },
  {
    n: "04",
    icon: CheckCircle2,
    title: "You get placed",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    desc: "We handle the paperwork, ensure a smooth onboarding, and stay in contact throughout your engagement. You focus on the work — we handle the rest.",
  },
];

const roleTypes = [
  { label: "Direct Placement", sub: "Permanent roles at top employers", href: "/services/staff-augmentation" },
  { label: "Contract", sub: "Flexible engagements, 3–24+ months", href: "/services/staff-augmentation" },
  { label: "Right to Hire", sub: "Contract with a path to permanent", href: "/services/staff-augmentation" },
  { label: "Temporary / Project", sub: "Short-term, defined deliverables", href: "/services/staff-augmentation" },
  { label: "Staff Augmentation", sub: "Embedded in a client's team", href: "/services/staff-augmentation" },
  { label: "Managed Delivery", sub: "Project-based with full team", href: "/services/managed-delivery" },
];

const whyUs = [
  { icon: Clock,  title: "Fast matching",      desc: "Most candidates hear from us within 48 hours of submitting their profile." },
  { icon: Globe2, title: "Global reach",       desc: "Clients across North America, Europe, and beyond — remote and on-site." },
  { icon: Users,  title: "Real relationships", desc: "We learn your goals, not just your CV. You'll speak to a person, not a portal." },
  { icon: Zap,    title: "No fees. Ever.",     desc: "Our service is free for candidates. We're paid by the client when you're placed." },
];

const gradientText = {
  background: "linear-gradient(115deg, hsl(160 56% 70%) 0%, hsl(196 80% 65%) 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};

export default function FindWorkPage() {
  return (
    <div className="min-h-screen bg-surface-default text-foreground">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-hero py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-green/8 blur-[120px]" />
          <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-brand-blue/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-4">For candidates</p>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-6xl">
            Your next role is<br />
            <span style={gradientText}>closer than you think.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/55">
            UmberCore matches technology professionals with top employers across 14+ industries.
            Submit your profile once — we do the searching, vetting, and negotiating for you.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/#get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-semibold text-surface-dark transition-all hover:bg-brand-green/90"
            >
              Submit your profile
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-foreground transition-all hover:bg-white/[0.08]"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ── Why us ── */}
      <section className="border-b border-border/50 bg-surface-elevated/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w) => (
              <div key={w.title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                  <w.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-heading font-bold text-foreground">{w.title}</p>
                  <p className="mt-1 text-sm text-foreground/50">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="hero-eyebrow mb-3">The process</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              How it works for candidates.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/50">
              Simple, transparent, and built around you — not the other way around.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className={`relative rounded-2xl border ${s.border} bg-surface-elevated/40 p-7`}
              >
                <p className={`font-mono text-3xl font-extrabold ${s.color} opacity-25 mb-4`}>{s.n}</p>
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                  <s.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className={`font-heading text-lg font-bold ${s.color} mb-2`}>{s.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/55">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role types ── */}
      <section className="border-t border-border/50 bg-surface-dark py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="hero-eyebrow mb-3">Engagement models</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              We place across every model.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-foreground/50">
              Whether you're looking for a permanent role, a contract, or something in between
              — we have openings across all engagement types.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roleTypes.map((r) => (
              <a
                key={r.label}
                href={r.href}
                className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-surface-elevated/40 p-5 transition-all hover:border-brand-green/30 hover:bg-surface-elevated/70"
              >
                <div>
                  <p className="font-heading font-bold text-foreground">{r.label}</p>
                  <p className="mt-0.5 text-sm text-foreground/45">{r.sub}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-foreground/20 transition-colors group-hover:text-brand-green" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section className="border-t border-border/50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-3">Where we place</p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            14+ industries. One network.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/50">
            From Banking & Finance to Aerospace, Cybersecurity to Healthcare — our client
            network spans the full breadth of the technology sector.
          </p>
          <a
            href="/industries"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline"
          >
            View all industries <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/50 bg-surface-dark py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-3">Ready to find your next role?</p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            Submit your profile today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/50">
            Free for candidates. No spam. We'll only reach out when there's a genuine match.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/#get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-semibold text-surface-dark transition-all hover:bg-brand-green/90"
            >
              Get started
            </a>
            <a
              href="mailto:support@umbercore.com"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-foreground transition-all hover:bg-white/[0.08]"
            >
              Email us directly
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
