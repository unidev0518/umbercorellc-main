"use client";

import Link from "next/link";
import { Phone, ClipboardList, FileCheck, ArrowRight } from "lucide-react";
import { FadeIn } from "../lib/motion";
import { Button } from "../primitives/button";
import { Badge } from "../primitives/badge";
import {
  InteractiveCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../primitives/card";
import { AnimatedBackground } from "./animated-background";

const flow = [
  {
    step: "01",
    icon: Phone,
    title: "Discovery & scope",
    desc: "We align on your AI stack, stakeholders, and timeline — usually starting with a free call.",
    color: "text-brand-blue",
    border: "border-brand-blue/40",
    bg: "bg-brand-blue/10",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Assessment",
    desc: "Structured review against NIST AI RMF and OWASP LLM Top 10 with your engineering team.",
    color: "text-brand-green",
    border: "border-brand-green/40",
    bg: "bg-brand-green/10",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "Report & roadmap",
    desc: "You receive prioritized findings, owner assignments, and investor-ready documentation.",
    color: "text-brand-green",
    border: "border-brand-green/40",
    bg: "bg-brand-green/10",
  },
];

const products = [
  {
    slug: "health-check",
    challenge: "Unknown AI risk posture",
    outcome: "Scored report + remediation roadmap",
  },
  {
    slug: "prompt-audit",
    challenge: "Production LLM exposure",
    outcome: "Test scenarios + engineering fixes",
  },
  {
    slug: "policy-pack",
    challenge: "No documented AI policy",
    outcome: "Policies and runbooks delivered",
  },
  {
    slug: "compliance",
    challenge: "Regulatory questions",
    outcome: "US AI law alignment snapshot",
  },
  {
    slug: "penetration-test",
    challenge: "Unvalidated agent workflows",
    outcome: "Red-team evidence pack",
  },
  {
    slug: "vendor-review",
    challenge: "New AI vendor adoption",
    outcome: "Adopt / hold / reject recommendation",
  },
];

export function ThreatStory({ showPricing = false }: { showPricing?: boolean }) {
  void showPricing;

  return (
    <section className="relative overflow-hidden border-y border-border bg-surface-mid py-24">
      <AnimatedBackground variant="dark" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <Badge
            variant="accent"
            className="mb-4 border-brand-blue/30 bg-brand-blue/10 text-brand-blue"
          >
            Consulting engagements
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            How we work with your team
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Fixed-scope projects with clear deliverables — not a software platform or 24/7
            monitoring service.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {flow.map((f, i) => (
            <FadeIn key={f.step} delay={i * 0.1}>
              <div className={`rounded-2xl border ${f.border} ${f.bg} p-6 h-full`}>
                <span className={`font-mono text-sm font-bold ${f.color}`}>{f.step}</span>
                <f.icon className={`mt-4 h-10 w-10 ${f.color}`} />
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-center font-heading text-xl font-semibold text-foreground">
            Consulting services
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <FadeIn key={p.slug} delay={i * 0.08}>
                <InteractiveCard className="h-full border-border bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="capitalize text-lg">
                      {p.slug.replace(/-/g, " ")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="rounded-lg border border-border bg-surface-mid/50 px-3 py-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Typical challenge
                      </span>
                      <p className="mt-1 text-foreground/90">{p.challenge}</p>
                    </div>
                    <div className="rounded-lg border border-brand-green/20 bg-brand-green/5 px-3 py-2">
                      <span className="text-xs font-semibold text-brand-green">You receive</span>
                      <p className="mt-1 text-muted-foreground">{p.outcome}</p>
                    </div>
                    <Button variant="link" className="h-auto p-0 text-brand-blue" asChild>
                      <Link href={`/services/${p.slug}`}>
                        View engagement <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </InteractiveCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
