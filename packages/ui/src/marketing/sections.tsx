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
    { icon: Clock, label: "Fast delivery" },
    { icon: Users, label: "Vetted talent network" },
    { icon: MapPin, label: "US-based operations" },
    { icon: Briefcase, label: "Project or retainer" },
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
      title: "Finding AI talent is slow",
      desc: "Hiring AI engineers takes months. Projects can't wait. We place vetted candidates in weeks.",
    },
    {
      icon: Rocket,
      title: "Projects stall without the right team",
      desc: "Good ideas die in planning. We staff projects end-to-end and take ownership of delivery.",
    },
    {
      icon: Users,
      title: "You need guidance, not just headcount",
      desc: "Strategy without execution is worthless. We bring both — advisory and the people to act on it.",
    },
  ];

  return (
    <section className="relative py-24">
      <AnimatedBackground variant="dark" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            AI adoption is fast. Building the right team isn&apos;t.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We bridge the gap — between the idea and the engineers who deliver it.
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
            Consulting, staffing, and delivery — scoped to where you are.
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
    { n: "1", title: "Tell us what you need", desc: "Share your project or hiring goal — we'll scope it with you" },
    { n: "2", title: "We build the team", desc: "We source and vet the right talent for your specific needs" },
    { n: "3", title: "You get results", desc: "Delivery on time, with full handoff and documentation" },
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
            Submit your project or share your profile — we respond within one business day.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="accent" className="shadow-glow-lg hover:scale-[1.02]" asChild>
              <Link href="/join-us">I have a project</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link href="/join-us">I&apos;m a candidate</Link>
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
              A team that treats your project like their own.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              UmberCore is a technology staffing and delivery agency. We work with companies
              to find the right engineers and ensure projects get shipped — not just started.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Vetted engineers across all tech disciplines",
                "End-to-end project ownership — not just CVs",
                "US-based operations, global talent network",
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

const stats = [
  { value: "48h", label: "Avg. time to first candidate" },
  { value: "200+", label: "Engineers placed globally" },
  { value: "95%", label: "Client retention rate" },
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
            People behind<br />the delivery.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/55">
            Every engagement is led by experienced practitioners —<br className="hidden lg:block" />
            not account managers or sales teams.
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

            {/* Stats grid */}
            <FadeIn delay={0.14} className="grid grid-cols-3 gap-3">
              {stats.map((s, i) => (
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

            {/* Quote card */}
            <FadeIn delay={0.2} className="rounded-xl border border-white/[0.07] bg-surface-elevated/60 p-6 backdrop-blur-sm">
              <p className="text-sm leading-relaxed text-foreground/60 italic">
                &ldquo;UmberCore had our team fully onboarded in under two weeks.
                The quality of talent and the speed of delivery exceeded every expectation.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-green/40 to-brand-blue/40 flex items-center justify-center text-xs font-bold text-foreground/80">
                  JM
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/80">James M.</p>
                  <p className="text-[10px] text-muted-foreground">CTO, Series B SaaS</p>
                </div>
              </div>
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
              Our talent network spans 14+ verticals — so we match your industry, not just your job title.
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

const testimonials = [
  {
    quote: "UmberCore had our team fully onboarded in under two weeks. The quality of talent and the speed of delivery exceeded every expectation.",
    name: "James M.",
    title: "CTO",
    company: "Series B SaaS",
    initials: "JM",
    color: "from-brand-green/40 to-brand-blue/40",
  },
  {
    quote: "We've worked with a lot of staffing firms. UmberCore is the only one that felt like a genuine partner — they understood our tech stack and our culture before sending a single candidate.",
    name: "Sarah K.",
    title: "VP of Engineering",
    company: "Fintech Scale-up",
    initials: "SK",
    color: "from-brand-blue/40 to-violet-400/40",
  },
  {
    quote: "Three contract engineers placed within 48 hours. All three are still with us 18 months later. That's the kind of result that keeps us coming back.",
    name: "David R.",
    title: "Head of Technology",
    company: "Healthcare Platform",
    initials: "DR",
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
          <p className="hero-eyebrow mb-3">Client stories</p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
            What our clients say.
          </h2>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.07] bg-surface-elevated/40 p-7 backdrop-blur-sm">
                {/* Stars */}
                <div className="mb-5 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="h-4 w-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-foreground/65 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  <div className={`h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-foreground/80`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.title}, {t.company}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
