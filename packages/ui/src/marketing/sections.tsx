"use client";

import type React from "react";
import Link from "next/link";
import {
  Clock,
  Users,
  MapPin,
  Briefcase,
  Rocket,
  Search,
  Plane,
  Car,
  Landmark,
  Database,
  ShieldCheck,
  Flame,
  Wrench,
  Building2,
  FlaskConical,
  Monitor,
  Pill,
  Cpu,
  Radio,
  HeartPulse,
} from "lucide-react";
import { Button } from "../primitives/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  InteractiveCard,
} from "../primitives/card";
import { AnimatedBackground } from "./animated-background";
import { Badge } from "../primitives/badge";
import { FadeIn } from "../lib/motion";

export function TrustBar() {
  const items = [
    { icon: Clock, label: "Practical delivery" },
    { icon: Users, label: "Specialized engineers" },
    { icon: MapPin, label: "US-based operations" },
    { icon: Briefcase, label: "Consulting & projects" },
  ];

  return (
    <section className="relative border-y border-border/60 bg-surface-elevated/80 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4">
        {items.map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-2.5 text-sm font-semibold text-muted-foreground"
          >
            {item.icon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10">
                <item.icon className="h-4 w-4 text-brand-green" />
              </span>
            )}
            {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}

export function ProblemCards() {
  const cards = [
    {
      icon: Search,
      title: "Software initiatives stall without the right expertise",
      desc: "Architecture, data, cloud, and delivery require specialized skills. We bring the consulting and engineering support to move work forward.",
    },
    {
      icon: Rocket,
      title: "Build, integrate, and operate — not just plan",
      desc: "We help design and ship software systems, then support hosting, data pipelines, and ongoing technical delivery.",
    },
    {
      icon: Users,
      title: "You need outcomes, not just headcount",
      desc: "Strategy without execution is worthless. We combine technology consulting with specialized engineering resources matched to project needs.",
    },
  ];

  return (
    <section className="relative py-24">
      <AnimatedBackground variant="dark" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Modern software needs more than a hiring pipeline.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We bridge strategy and delivery — software, data, cloud, and AI-assisted engineering.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.1}>
              <InteractiveCard className="h-full overflow-hidden border-border bg-gradient-card">
                <div className="h-1 w-full bg-gradient-to-r from-brand-danger via-brand-blue to-brand-green opacity-0 transition-opacity group-hover:opacity-100" />
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-green/20 to-brand-blue/15 ring-1 ring-brand-blue/25">
                    <card.icon className="h-7 w-7 text-brand-blue" />
                  </div>
                  <CardTitle className="mt-4">{card.title}</CardTitle>
                  <CardDescription>{card.desc}</CardDescription>
                </CardHeader>
              </InteractiveCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export type ServiceGridItem = {
  slug: string;
  title: string;
  price: string;
  priceRange: string;
  desc: string;
  tierCount?: number;
};

export function ServiceGrid({
  items,
  showPricing = false,
}: {
  items: ServiceGridItem[];
  showPricing?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-y border-border py-24">
      <AnimatedBackground variant="dark" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            What we do
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Software consulting, data, cloud hosting, and AI-assisted delivery — scoped to where you are.
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <FadeIn key={s.slug} delay={i * 0.04}>
              <InteractiveCard className="flex h-full flex-col border-border bg-gradient-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-snug">{s.title}</CardTitle>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {showPricing ? (
                      <Badge variant="gradient" className="text-[10px]">
                        {s.price}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] border-brand-blue/30 text-brand-blue">
                        Contact for scope
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-2 text-sm">{s.desc}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <Button variant="link" className="h-auto p-0 text-brand-blue" asChild>
                    <Link href={`/services/${s.slug}`}>Learn more →</Link>
                  </Button>
                </CardContent>
              </InteractiveCard>
            </FadeIn>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/services">All services</Link>
          </Button>
          <Button variant="accent" asChild>
            <Link href="/join-us">Get in touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: "1", title: "Tell us what you need", desc: "Share your software, data, cloud, or AI initiative — we'll scope it with you" },
    { n: "2", title: "We assemble the right expertise", desc: "Specialists matched to project requirements across consulting and delivery" },
    { n: "3", title: "You get results", desc: "Build, integrate, host, and hand off with clear documentation" },
  ];

  return (
    <section className="border-t border-border bg-surface-elevated py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            How it works
          </h2>
        </FadeIn>
        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-7 hidden h-0.5 bg-gradient-to-r from-brand-green/0 via-brand-blue/60 to-brand-green/0 md:block" />
          {steps.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.12} className="relative text-center">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-green to-brand-blue text-xl font-bold text-surface-dark shadow-glow">
                {step.n}
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-brand" />
      <AnimatedBackground variant="dark" />
      <div className="relative mx-auto max-w-3xl px-4 text-center text-white">
        <FadeIn>
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us about your software, data, or cloud initiative — we respond within one business day.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="accent" className="shadow-glow-lg hover:scale-[1.02]" asChild>
              <Link href="/#get-started">Start a Project</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link href="/#get-started">Join Our Network</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function AboutStrip() {
  return (
    <section className="relative overflow-hidden border-t border-border py-24">
      <AnimatedBackground variant="dark" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Photo side */}
          <FadeIn className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-elevated">
              <img
                src="/images/about-collab.jpg"
                alt="Team collaborating in a modern office"
                className="h-[420px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-dark/80 via-surface-dark/20 to-transparent" />
            </div>
          </FadeIn>

          {/* Text side */}
          <FadeIn delay={0.1}>
            <p className="hero-eyebrow mb-4">Who we are</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Technology consulting that ships.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              UmberCore is a software and technology consulting company. We help businesses
              design, build, integrate, host, and operate modern software systems using
              experienced engineers, cloud technologies, data platforms, and AI-assisted workflows.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Software, data, cloud, and AI-enabled engineering",
                "Flexible delivery — consulting, projects, or specialized support",
                "US-based operations with an engineering network matched to need",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/20">
                    <svg className="h-3 w-3 text-brand-green" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

const gradientText: React.CSSProperties = {
  background: "linear-gradient(115deg, hsl(32 70% 68%) 0%, hsl(38 42% 62%) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const capabilities = [
  { value: "Build", label: "Software & APIs" },
  { value: "Data", label: "Processing & pipelines" },
  { value: "Host", label: "Cloud workloads" },
];

export function TeamPhotos() {
  return (
    <section className="relative border-t border-border/50 bg-surface-dark py-24 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-brand-green/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn className="mb-16 max-w-2xl">
          <p className="hero-eyebrow mb-3">Our approach</p>
          <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
            Delivery shaped<br />around your work.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/55">
            Engagements are led by experienced technical professionals —<br className="hidden lg:block" />
            with specialists matched to project requirements.
          </p>
        </FadeIn>

        {/* Main grid: 2 cols desktop */}
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

          {/* Left: large primary photo */}
          <FadeIn className="group relative overflow-hidden rounded-2xl border border-white/[0.06] min-h-[480px]">
            <img
              src="/images/delivery-workshop.jpg"
              alt="Engineering team at work"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 via-surface-dark/30 to-transparent" />
            {/* Bottom-left label */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40 mb-2">Trusted by teams at</p>
              <div className="flex flex-wrap gap-3">
                {["Startups", "Scale-ups", "Enterprise"].map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-foreground/70 backdrop-blur-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right column: stacked photo + stat cards */}
          <div className="flex flex-col gap-6">
            {/* Secondary photo */}
            <FadeIn delay={0.08} className="group relative overflow-hidden rounded-2xl border border-white/[0.06] h-[220px]">
              <img
                src="/images/strategy-session.jpg"
                alt="Team strategy session"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-dark/80 via-surface-dark/30 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <span className="rounded-full border border-brand-green/25 bg-brand-green/10 px-3 py-1 text-[11px] font-semibold text-brand-green backdrop-blur-sm">
                  End-to-end delivery
                </span>
              </div>
            </FadeIn>

            {/* Capability grid */}
            <FadeIn delay={0.14} className="grid grid-cols-3 gap-3">
              {capabilities.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[0.07] bg-surface-elevated/80 px-3 py-5 text-center backdrop-blur-sm"
                >
                  <span className="font-heading text-2xl font-extrabold" style={gradientText}>
                    {s.value}
                  </span>
                  <span className="text-[10px] font-medium leading-tight text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </FadeIn>

            {/* Delivery model card */}
            <FadeIn delay={0.2} className="rounded-xl border border-white/[0.07] bg-surface-elevated/60 p-6 backdrop-blur-sm">
              <p className="text-sm leading-relaxed text-foreground/60">
                UmberCore uses a flexible delivery model that combines technical consulting
                with specialized engineering resources selected according to project needs.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
                Consulting · Projects · Engineering support
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

const industries = [
  { icon: Plane,         label: "Aerospace & Defense",      color: "text-brand-blue",  glow: "hsl(38 42% 58% / 0.14)" },
  { icon: Car,           label: "Automotive & Transport",   color: "text-orange-300",  glow: "hsl(28 62% 48% / 0.14)" },
  { icon: Landmark,      label: "Banking & Finance",        color: "text-brand-blue",  glow: "hsl(38 42% 58% / 0.14)" },
  { icon: Database,      label: "Big Data & AI",            color: "text-brand-green", glow: "hsl(28 62% 48% / 0.14)" },
  { icon: ShieldCheck,   label: "Cybersecurity",            color: "text-rose-400",    glow: "hsl(8 68% 52% / 0.12)"  },
  { icon: Flame,         label: "Energy, Oil & Gas",        color: "text-orange-400",  glow: "hsl(28 70% 48% / 0.14)" },
  { icon: Wrench,        label: "Engineering",              color: "text-amber-400",   glow: "hsl(38 70% 50% / 0.14)" },
  { icon: Building2,     label: "Government",               color: "text-brand-blue",  glow: "hsl(38 42% 58% / 0.14)" },
  { icon: FlaskConical,  label: "Life Sciences",            color: "text-amber-300",   glow: "hsl(32 50% 50% / 0.12)" },
  { icon: Monitor,       label: "Information Technology",   color: "text-brand-green", glow: "hsl(28 62% 48% / 0.14)" },
  { icon: Pill,          label: "Pharma",                   color: "text-orange-300",  glow: "hsl(22 55% 50% / 0.12)" },
  { icon: Cpu,           label: "Semiconductor",            color: "text-brand-blue",  glow: "hsl(38 42% 58% / 0.14)" },
  { icon: Radio,         label: "Telecom",                  color: "text-amber-400",   glow: "hsl(32 60% 50% / 0.12)" },
  { icon: HeartPulse,    label: "Healthcare & Biomedical",  color: "text-rose-400",    glow: "hsl(8 68% 52% / 0.12)"  },
];

export function Industries() {
  return (
    <section className="relative border-t border-border/50 py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-green/5 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 translate-y-1/2 rounded-full bg-brand-blue/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn className="mb-14">
          <p className="hero-eyebrow mb-3">Industries we serve</p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
              Deep expertise<br />across every sector.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-foreground/50 lg:text-right">
              Software, data, and cloud work across many industries — so we match domain context, not just a job title.
            </p>
          </div>
        </FadeIn>

        {/* Industry grid — safe responsive cols */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {industries.map((ind, i) => (
            <FadeIn key={ind.label} delay={i * 0.035}>
              <div
                className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.07] bg-surface-elevated/50 px-4 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.14] hover:bg-surface-elevated cursor-default"
              >
                {/* Hover radial glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `radial-gradient(ellipse at 0% 50%, ${ind.glow}, transparent 70%)` }}
                />
                {/* Icon */}
                <span className={`relative shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-surface-dark/70 ${ind.color} transition-colors`}>
                  <ind.icon className="h-[15px] w-[15px]" strokeWidth={1.6} />
                </span>
                {/* Label */}
                <span className="relative min-w-0 text-[13px] font-medium leading-snug text-foreground/65 transition-colors group-hover:text-foreground/90">
                  {ind.label}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ContactAside } from "./book-section";

const focusAreas = [
  {
    title: "Software & systems",
    desc: "Architecture, implementation, modernization, and technical project delivery for web, backend, and enterprise applications.",
    color: "from-brand-green/40 to-brand-blue/40",
  },
  {
    title: "Data & hosting",
    desc: "Data processing, integration, pipelines, and cloud application hosting — so systems can run reliably in production.",
    color: "from-brand-blue/40 to-violet-400/40",
  },
  {
    title: "AI-assisted delivery",
    desc: "Modern AI development workflows to accelerate prototyping, coding, testing, documentation, and modernization — with human oversight.",
    color: "from-violet-400/40 to-brand-green/40",
  },
];

export function Testimonials() {
  return (
    <section className="relative border-t border-border/50 bg-surface-dark py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-0 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-green/5 blur-[100px]" />
        <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-brand-blue/5 blur-[90px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-14 text-center">
          <p className="hero-eyebrow mb-3">What we deliver</p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
            Broad technology consulting.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/50">
            From software engineering to data processing and cloud hosting — scoped to practical business outcomes.
          </p>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-3">
          {focusAreas.map((t, i) => (
            <FadeIn key={t.title} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.07] bg-surface-elevated/40 p-7 backdrop-blur-sm">
                <div className={`mb-5 h-1.5 w-12 rounded-full bg-gradient-to-r ${t.color}`} />
                <h3 className="font-heading text-xl font-bold text-foreground/90">{t.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/65">
                  {t.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
