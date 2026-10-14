"use client";

import Link from "next/link";
import { ShoppingBag, Package, MessagesSquare, ClipboardList } from "lucide-react";
import { Button } from "../primitives/button";
import { HeroReveal } from "../lib/motion";
import { HeroScene } from "./hero-scene";

const capabilities = [
  { icon: ShoppingBag, label: "Drone products" },
  { icon: Package, label: "Accessories" },
  { icon: ClipboardList, label: "Order coordination" },
  { icon: MessagesSquare, label: "Product inquiries" },
] as const;

export function Hero() {
  return (
    <section
      className="relative overflow-hidden text-foreground"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 15% 0%, hsl(199 88% 62% / 0.28), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 0%, hsl(207 78% 58% / 0.18), transparent 50%), linear-gradient(180deg, hsl(204 80% 98%) 0%, hsl(204 55% 96%) 100%)",
      }}
    >
      <HeroScene />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-green/50 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16 lg:py-20 lg:px-8">
        <HeroReveal className="order-2 lg:order-1">
          <p className="hero-eyebrow">Drone products. Simple shopping.</p>
          <h1 className="hero-title mt-6 font-heading leading-[1.05]">
            <span className="block text-[1.9rem] font-bold text-foreground/70 sm:text-[2.4rem] lg:text-[2.8rem]">
              Drone products &amp; accessories
            </span>
            <span className="hero-highlight mt-1 block text-[2.3rem] font-extrabold sm:text-[3rem] lg:text-[3.6rem]">
              for everyday needs.
            </span>
          </h1>

          <p className="hero-lead mt-7 max-w-lg text-lg text-muted-foreground">
            TravelGuards LLC focuses on sourcing and selling drone products and related
            accessories. We help customers explore options and coordinate purchases through
            straightforward communication.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button variant="accent" size="lg" className="shadow-glow hover:scale-[1.02]" asChild>
              <Link href="/contact">Ask about a product</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border bg-white text-foreground hover:border-brand-blue/40 hover:bg-brand-blue/10"
              asChild
            >
              <Link href="/products">View categories</Link>
            </Button>
          </div>

          <div className="hero-cap-panel mt-10">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              What we help with
            </p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {capabilities.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-white/70 px-3 py-2.5 text-sm text-foreground/90"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-green/10 ring-1 ring-brand-green/20">
                    <Icon className="h-4 w-4 text-brand-green" aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </HeroReveal>

        <HeroReveal delay={0.12} className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-lg">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-elevated">
              <img
                src="/photos/drone-overhead.jpg"
                alt="Consumer drone beside a remote controller"
                className="aspect-[5/4] w-full object-cover"
              />
              <img
                src="/photos/battery.jpg"
                alt="Drone battery"
                className="absolute bottom-4 left-4 h-20 w-28 rounded-xl border border-white object-cover shadow-card sm:h-24 sm:w-32"
              />
              <img
                src="/photos/controller-table.jpg"
                alt="Drone remote controller"
                className="absolute right-4 top-4 hidden h-28 w-24 rounded-xl border border-white object-cover shadow-card sm:block"
              />
            </div>
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}
