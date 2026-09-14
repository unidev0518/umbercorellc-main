"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "../assets/logo";
import { Button } from "../primitives/button";
import { StickyBookCta } from "../marketing/sticky-cta";
import { cn } from "../lib/utils";

const navLinks: { href: string; label: string }[] = [
  { href: "/about",      label: "About" },
  { href: "/services",   label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/find-work",  label: "Find Work" },
];

export function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-surface-default text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-surface-default/90 backdrop-blur-xl">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-footer opacity-50" />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand-green"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <Button variant="accent" size="sm" asChild>
              <a href="/#get-started">Get started</a>
            </Button>
          </div>
          <button
            type="button"
            className="text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        <div className={cn("border-t border-border bg-surface-elevated md:hidden", mobileOpen ? "block" : "hidden")}>
          <nav className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="accent" className="mt-2" asChild>
              <a href="/#get-started">Get started</a>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <StickyBookCta />
      <footer className="relative overflow-hidden border-t border-border/50 bg-surface-dark text-foreground">
        {/* Animated top rule */}
        <div className="h-px bg-gradient-footer bg-[length:200%_100%] animate-gradient-x opacity-60" />

        {/* Ambient blobs */}
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-brand-green/5 blur-[100px]" />
        <div className="pointer-events-none absolute right-1/4 top-0 h-64 w-64 rounded-full bg-brand-blue/5 blur-[100px]" />

        {/* CTA band */}
        <div className="relative border-b border-border/40">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-green/70 mb-2">
                  Ready to get started?
                </p>
                <h3 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  Ready to discuss your next<br className="hidden sm:block" /> software or data initiative?
                </h3>
              </div>
              <a
                href="/#get-started"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-brand-green/30 bg-brand-green/10 px-6 py-3 text-sm font-semibold text-brand-green transition-all hover:bg-brand-green/20 hover:border-brand-green/50"
              >
                Get started <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">

            {/* Brand column */}
            <div>
              <Logo />
              <p className="mt-5 max-w-[280px] text-sm leading-relaxed text-foreground/45">
                Software and technology consulting — helping businesses design, build, integrate, host, and operate modern systems.
              </p>
            </div>

            {/* Services column */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/40 mb-5">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/services" className="text-foreground/55 transition-colors hover:text-brand-green">All Services</Link></li>
                <li><Link href="/services/project-delivery" className="text-foreground/55 transition-colors hover:text-brand-green">Project Delivery</Link></li>
                <li><Link href="/services/managed-delivery" className="text-foreground/55 transition-colors hover:text-brand-green">Managed Delivery</Link></li>
                <li><Link href="/services/staff-augmentation" className="text-foreground/55 transition-colors hover:text-brand-green">Engineering Support</Link></li>
                <li><a href="/#get-started" className="text-foreground/55 transition-colors hover:text-brand-green">Start a Project</a></li>
              </ul>
            </div>

            {/* Industries column */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/40 mb-5">Industries</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/industries" className="text-foreground/55 transition-colors hover:text-brand-green">All Industries</Link></li>
                {["Banking & Finance", "Healthcare", "Big Data & AI", "Cybersecurity"].map((item) => (
                  <li key={item}>
                    <span className="text-foreground/30">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/40 mb-5">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="text-foreground/55 transition-colors hover:text-brand-green">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-foreground/55 transition-colors hover:text-brand-green">Terms of Use</Link></li>
                <li><a href="mailto:support@umbercore.com" className="text-foreground/55 transition-colors hover:text-brand-green">support@umbercore.com</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col items-center gap-3 border-t border-border/40 pt-8 sm:flex-row sm:justify-between">
            <p className="text-xs text-foreground/30">
              © {new Date().getFullYear()} UmberCore. All rights reserved.
            </p>
            <p className="text-xs text-foreground/20 font-mono tracking-widest uppercase">
              Software · Data · Cloud · AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
