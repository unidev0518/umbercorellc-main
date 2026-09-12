"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Rocket, Users, Code, Briefcase } from "lucide-react";
import { Button } from "../primitives/button";
import { HeroReveal } from "../lib/motion";
import { AnimatedBackground } from "./animated-background";

const HeroVisual = dynamic(
  () => import("./hero-visual").then((mod) => mod.HeroVisual),
  {
    ssr: false,
    loading: () => (
      <div
        className="hero-visual-panel mx-auto aspect-[2/1] w-full max-w-2xl rounded-2xl border border-white/10 bg-[hsl(24_22%_6%)]"
        aria-hidden
      />
    ),
  }
);

const capabilities = [
  { icon: Rocket, label: "Project delivery" },
  { icon: Users, label: "Staff augmentation" },
  { icon: Code, label: "Software engineering" },
  { icon: Briefcase, label: "Tech consulting" },
] as const;

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-gradient-hero text-foreground">
      {/* Background photo */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: `url('/images/hero-studio.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
        }}
      />
      <AnimatedBackground variant="dark" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-green/50 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-28 lg:px-8">
        <HeroReveal className="order-2 lg:order-1">
          <h1 className="hero-title mt-6 font-heading leading-[1.05]">
            <span className="block text-[1.9rem] font-bold text-foreground/70 sm:text-[2.6rem] lg:text-[3rem]">
              Your next project,
            </span>
            <span className="hero-highlight mt-1 block text-[2.6rem] font-extrabold sm:text-[3.5rem] lg:text-[4.5rem]">
              fully staffed.
            </span>
          </h1>

          <p className="hero-lead mt-7 max-w-lg text-lg text-muted-foreground">
            We source, place, and embed engineers in your team — so you can focus on
            shipping, not hiring.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button variant="accent" size="lg" className="shadow-glow hover:scale-[1.02]" asChild>
              <a href="#get-started">Find Talent</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/10 bg-white/[0.03] text-foreground hover:border-brand-blue/40 hover:bg-brand-blue/10"
              asChild
            >
              <a href="#get-started">Find Work</a>
            </Button>
          </div>

          <div className="hero-cap-panel mt-10">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              How we help
            </p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {capabilities.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-surface-mid/40 px-3 py-2.5 text-sm text-foreground/90"
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
          <HeroVisual />
        </HeroReveal>
      </div>
    </section>
  );
}
