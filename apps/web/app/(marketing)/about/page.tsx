import type { Metadata } from "next";
import { Target, Users, TrendingUp, Handshake, ShieldCheck, Star, Zap, Cloud } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "UmberCore is a software and technology consulting company helping businesses design, build, integrate, host, and operate modern software systems.",
};

const pillars = [
  {
    icon: Target,
    name: "Purpose",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/20",
    desc: "We exist to help organizations deliver practical software outcomes — from design and development through data processing, hosting, and ongoing technical delivery.",
  },
  {
    icon: Users,
    name: "People",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/20",
    desc: "We invest in understanding clients and specialized engineers alike — goals, constraints, and culture — so engagements are built on fit, not just availability.",
  },
  {
    icon: TrendingUp,
    name: "Performance",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    desc: "We measure ourselves by outcomes, not activity. Systems that ship. Data that moves. Hosted workloads that stay reliable. If it doesn't perform, we haven't done our job.",
  },
  {
    icon: Handshake,
    name: "Partnerships",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    desc: "We build long-term relationships, not one-off transactions. Clients return because we treat their initiatives as our own — invested beyond the first delivery.",
  },
];

const values = [
  { icon: ShieldCheck, label: "Integrity", sub: "Transparent. Accountable. Trusted." },
  { icon: Star, label: "Excellence", sub: "We don't cut corners on engineering or delivery." },
  { icon: Zap, label: "Agility", sub: "Fast without sacrificing quality." },
  { icon: Cloud, label: "Modern stack", sub: "Cloud, data platforms, and AI-assisted workflows." },
];

const gradientText = {
  background: "linear-gradient(115deg, hsl(32 70% 68%) 0%, hsl(38 42% 62%) 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-default text-foreground">
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-hero py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-green/8 blur-[120px]" />
          <div className="absolute right-1/4 bottom-0 h-96 w-96 translate-y-1/2 rounded-full bg-brand-blue/8 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-4">About UmberCore</p>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-6xl">
            Software &amp; technology consulting<br />
            <span style={gradientText}>built for delivery.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/55">
            UmberCore helps businesses design, build, integrate, host, and operate modern software
            systems. Our services span software engineering, AI-assisted development, data processing,
            cloud infrastructure, backend systems, and technical project delivery.
          </p>
        </div>
      </section>

      <section className="border-b border-border/50 bg-surface-elevated/40">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "Software", label: "Consulting & delivery" },
              { value: "Data", label: "Processing & pipelines" },
              { value: "Cloud", label: "Hosting & infrastructure" },
              { value: "AI", label: "Assisted engineering" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-heading text-3xl font-extrabold sm:text-4xl" style={gradientText}>{s.value}</p>
                <p className="mt-1 text-sm text-foreground/45">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="hero-eyebrow mb-3">Our mission</p>
              <h2 className="font-heading text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-foreground">
                Practical expertise.<br />Flexible delivery.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-foreground/55">
                We work with organizations that need practical engineering expertise, flexible
                technical resources, or help delivering software and data initiatives — without
                the overhead of building every capability in-house overnight.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-foreground/55">
                Depending on project requirements, UmberCore can provide consulting, project-based
                engineering, or specialized technical resources from our engineering network.
              </p>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/[0.07]">
                <img
                  src="/images/about-collab.jpg"
                  alt="UmberCore collaboration"
                  className="h-[400px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-surface-dark/70 via-surface-dark/20 to-transparent rounded-2xl" />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-white/[0.1] bg-surface-elevated/90 p-4 backdrop-blur-md shadow-elevated">
                <p className="text-xs font-mono font-semibold uppercase tracking-widest text-foreground/40 mb-1">Founded on</p>
                <p className="font-heading text-lg font-bold text-foreground">Purpose · People<br />Performance · Partnerships</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-surface-dark py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="hero-eyebrow mb-3">The pillars of UmberCore</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
              Built on four core values.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground/50">
              These pillars define who we are — framing how we work with clients, engineering
              partners, and our community.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div
                key={p.name}
                className={`relative overflow-hidden rounded-2xl border ${p.border} bg-surface-elevated/50 p-7 backdrop-blur-sm`}
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${p.bg} ${p.color}`}>
                  <p.icon className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <h3 className={`font-heading text-2xl font-extrabold ${p.color} mb-3`}>{p.name}</h3>
                <p className="text-sm leading-relaxed text-foreground/55">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="hero-eyebrow mb-3">How we operate</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              Our operating values.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.label}
                className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-surface-elevated/40 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                  <v.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-heading font-bold text-foreground">{v.label}</p>
                  <p className="mt-1 text-sm text-foreground/50">{v.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-surface-dark py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            Ready to build something?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/50">
            Whether you need consulting, project delivery, or specialized engineering support —
            we&apos;re here to help.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/#get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-semibold text-surface-dark transition-all hover:bg-brand-green/90"
            >
              Start a Project
            </a>
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-foreground transition-all hover:bg-white/[0.08]"
            >
              View Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
