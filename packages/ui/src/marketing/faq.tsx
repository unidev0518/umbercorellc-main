"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "../lib/motion";
import { cn } from "../lib/utils";

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your billing portal — no long-term contracts on monthly plans.",
  },
  {
    q: "What's the difference between membership and a full service?",
    a: "Membership is ongoing education and templates. Full services are fixed-scope deliverables like reports and policy packs.",
  },
  {
    q: "Is membership reimbursable by my employer?",
    a: "Many corporate members expense Insider tier as professional development. We provide receipts via Stripe.",
  },
  {
    q: "What if I need more than membership covers?",
    a: "Insider members get 20% off B2B services. Book a free call and we'll recommend the right engagement.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-3xl px-4">
        <FadeIn className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground">FAQ</h2>
        </FadeIn>
        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.05}>
              <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-heading font-semibold text-foreground transition-colors hover:bg-brand-blue/5"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  {item.q}
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-brand-blue transition-transform",
                      open === i && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-border/60 px-5 pb-5 pt-0 text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
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
