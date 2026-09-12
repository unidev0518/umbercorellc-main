"use client";

import { Badge } from "../primitives/badge";
import { Button } from "../primitives/button";
import { FadeIn } from "../lib/motion";
import Link from "next/link";
import { cn } from "../lib/utils";

export interface TierDisplay {
  id: string;
  name: string;
  priceLabel: string;
  bestFor: string;
  highlights: string[];
}

export function ServiceTiers({
  tiers,
  serviceTitle,
  showPricing = false,
}: {
  tiers: TierDisplay[];
  serviceTitle: string;
  showPricing?: boolean;
}) {
  return (
    <section className="border-y border-border bg-surface-mid py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            {serviceTitle} — choose your scope
          </h2>
          <p className="mt-2 text-muted-foreground">
            {showPricing
              ? "Multiple tiers from $1,500 to $7,500 — scoped to your stage and depth."
              : "Essential, Professional, and Enterprise scopes — pick the depth that fits your stage."}
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.08}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-2xl border bg-gradient-card p-6 transition-all hover:border-brand-green/40 hover:shadow-glow/30",
                  i === 1 ? "border-brand-green/40 ring-1 ring-brand-green/20" : "border-border"
                )}
              >
                {i === 1 && (
                  <Badge variant="green" className="mb-3 w-fit">
                    Most popular
                  </Badge>
                )}
                <h3 className="font-heading text-lg font-bold text-foreground">{t.name}</h3>
                {showPricing ? (
                  <p className="mt-2 text-xl font-semibold text-brand-blue">{t.priceLabel}</p>
                ) : (
                  <p className="mt-2 text-sm font-medium text-brand-blue">Contact for quote</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">{t.bestFor}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                  {t.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="text-brand-green">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
                <Button variant={i === 1 ? "accent" : "outline"} className="mt-6 w-full" asChild>
                  <Link href="/join-us">Get a quote</Link>
                </Button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingRangeBanner({ showPricing = false }: { showPricing?: boolean }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-brand-green/25 bg-gradient-to-r from-brand-green/10 via-transparent to-brand-blue/10 px-6 py-4 text-center">
        {showPricing ? (
          <>
            <span className="text-sm font-medium text-muted-foreground">Engagement range</span>
            <span className="font-heading text-2xl font-bold text-brand-green">$1,500</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-heading text-2xl font-bold text-brand-blue">$7,500</span>
            <span className="text-xs text-muted-foreground">· 10 services · multiple tiers each</span>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-muted-foreground">Engagements</span>
            <span className="font-heading text-lg font-bold text-brand-green">Tiered scopes</span>
            <span className="text-xs text-muted-foreground">
              · 10 services · Essential / Professional / Enterprise · pricing on request
            </span>
          </>
        )}
      </div>
    </div>
  );
}
