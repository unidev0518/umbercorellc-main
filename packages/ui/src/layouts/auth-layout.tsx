"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Logo } from "../assets/logo";
import { AnimatedBackground } from "../marketing/animated-background";

const HeroVisual = dynamic(
  () => import("../marketing/hero-visual").then((mod) => mod.HeroVisual),
  {
    ssr: false,
    loading: () => (
      <div
        className="hero-visual-panel mx-auto aspect-[2/1] w-full max-w-lg rounded-2xl border border-white/10 bg-[hsl(222_40%_8%)]"
        aria-hidden
      />
    ),
  }
);

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:flex lg:flex-col lg:justify-between lg:p-12">
        <AnimatedBackground variant="dark" />
        <div className="relative">
          <Logo className="[&_span]:text-white" />
        </div>
        <div className="relative flex flex-1 flex-col justify-center">
          <HeroVisual />
        </div>
        <p className="relative text-sm text-slate-500">© UmberCore</p>
      </div>
      <div className="relative flex flex-col justify-center bg-surface-default px-4 py-12 sm:px-6 lg:px-16">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <AnimatedBackground variant="dark" />
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          )}
          <div className="mt-8 rounded-2xl border border-border/80 bg-surface-elevated p-8 shadow-elevated">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
