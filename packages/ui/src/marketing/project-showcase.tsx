"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { FadeIn } from "../lib/motion";
import { Badge } from "../primitives/badge";
import { Button } from "../primitives/button";
import { AnimatedBackground } from "./animated-background";
import { CaseStudyVisual, type CaseStudyVisualType } from "./case-study-visual";
import { cn } from "../lib/utils";

export interface ShowcaseProject {
  id: string;
  visual: CaseStudyVisualType;
  client: string;
  industry: string;
  serviceSlug: string;
  serviceLabel: string;
  headline: string;
  insight: string;
  metrics: { label: string; value: string; highlight?: boolean }[];
}

export function ProjectShowcase({
  projects,
  title = "Projects that prove our value",
  subtitle = "Real outcomes from AI security engagements — see what you get before you book.",
  showAllLink,
}: {
  projects: ShowcaseProject[];
  title?: string;
  subtitle?: string;
  showAllLink?: string;
}) {
  if (projects.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-border py-24">
      <AnimatedBackground variant="dark" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <Badge variant="green" className="mb-4 gap-1">
            <Sparkles className="h-3 w-3" />
            Client outcomes
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        </FadeIn>

        <div className="mt-16 space-y-24">
          {projects.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.08}>
              <article
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-14",
                  i % 2 === 1 && "lg:[&>*:first-child]:order-2"
                )}
              >
                <CaseStudyVisual type={project.visual} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-brand-blue/30 text-brand-blue">
                      {project.serviceLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{project.industry}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-brand-green">
                    {project.client}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-bold leading-snug text-foreground md:text-3xl">
                    {project.headline}
                  </h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{project.insight}</p>
                  <dl className="mt-8 grid grid-cols-3 gap-4">
                    {project.metrics.map((m) => (
                      <div
                        key={m.label}
                        className={cn(
                          "rounded-xl border px-3 py-3 text-center",
                          m.highlight
                            ? "border-brand-green/40 bg-brand-green/10"
                            : "border-border bg-surface-elevated"
                        )}
                      >
                        <dt className="text-xs text-muted-foreground">{m.label}</dt>
                        <dd
                          className={cn(
                            "mt-1 font-heading text-sm font-bold",
                            m.highlight ? "text-brand-green" : "text-foreground"
                          )}
                        >
                          {m.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Button variant="link" className="mt-6 h-auto p-0 text-brand-blue" asChild>
                    <Link href={`/services/${project.serviceSlug}`}>
                      How we deliver this <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        {showAllLink && (
          <FadeIn className="mt-14 text-center">
            <Button variant="outline" asChild>
              <Link href={showAllLink}>Explore all consulting services</Link>
            </Button>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
