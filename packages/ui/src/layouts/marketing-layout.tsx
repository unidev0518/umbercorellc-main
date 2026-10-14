"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { StickyBookCta } from "../marketing/sticky-cta";
import { cn } from "../lib/utils";

const navLinks: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "What We Offer" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const productLinks: { href: string; label: string }[] = [
  { href: "/products", label: "All products" },
  { href: "/products/consumer-drones", label: "Consumer drones" },
  { href: "/products/accessories", label: "Accessories" },
  { href: "/products/components", label: "Components" },
  { href: "/products/batteries", label: "Batteries & charging" },
  { href: "/products/related-electronics", label: "Related electronics" },
];

function ProductsDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent): void {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function closeOnEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);
  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-green"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((current) => !current)}
      >
        Products
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <div className={cn("absolute left-0 top-full z-50 pt-2", open ? "block" : "hidden")}>
        <div className="w-60 rounded-xl border border-border bg-white p-2 shadow-elevated">
          {productLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface-mid hover:text-brand-green"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src="/brand/travelguards-logo.png?v=2"
        alt="TravelGuards LLC"
        className="h-10 w-auto sm:h-12"
      />
    </span>
  );
}

export function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-surface-default text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-surface-default/90 backdrop-blur-xl">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-footer opacity-50" />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <BrandLogo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand-green">
              Home
            </Link>
            <ProductsDropdown />
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand-green"
              >
                {link.label}
              </Link>
            ))}
          </nav>
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
          <nav className="flex flex-col gap-1 p-4">
            <Link href="/" className="py-2 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <button
              type="button"
              className="flex items-center justify-between py-2 text-left text-sm font-medium text-foreground"
              aria-expanded={mobileProductsOpen}
              onClick={() => setMobileProductsOpen((current) => !current)}
            >
              Products
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileProductsOpen && "rotate-180")} aria-hidden />
            </button>
            {mobileProductsOpen && (
              <div className="mb-1 ml-3 flex flex-col border-l border-border pl-3">
                {productLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-2 text-sm text-foreground/80"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
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
                  Ask about a product<br className="hidden sm:block" /> or an order.
                </h3>
              </div>
              <a
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-brand-green/30 bg-brand-green/10 px-6 py-3 text-sm font-semibold text-brand-green transition-all hover:bg-brand-green/20 hover:border-brand-green/50"
              >
                Contact us <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">

            {/* Brand column */}
            <div>
              <BrandLogo />
              <p className="mt-5 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                A customer-focused retail business for drone products, accessories, and related merchandise.
              </p>
              <p className="mt-4 max-w-[280px] text-xs leading-relaxed text-muted-foreground">
                Registered office: 84 W Broadway, Ste 200, Derry, NH 03038. Not a walk-in store.
              </p>
            </div>

            {/* Services column */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-5">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/products" className="text-foreground/80 transition-colors hover:text-brand-green">Products</Link></li>
                <li><Link href="/services" className="text-foreground/80 transition-colors hover:text-brand-green">What We Offer</Link></li>
                <li><Link href="/contact" className="text-foreground/80 transition-colors hover:text-brand-green">Product inquiry</Link></li>
              </ul>
            </div>

            {/* Industries column */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-5">Products</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/products/consumer-drones", label: "Consumer drones" },
                  { href: "/products/accessories", label: "Accessories" },
                  { href: "/products/components", label: "Components" },
                  { href: "/products/batteries", label: "Batteries & charging" },
                  { href: "/products/related-electronics", label: "Related electronics" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-foreground/80 transition-colors hover:text-brand-green">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-5">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="text-foreground/80 transition-colors hover:text-brand-green">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-foreground/80 transition-colors hover:text-brand-green">Terms of Use</Link></li>
                <li><Link href="/about" className="text-foreground/80 transition-colors hover:text-brand-green">About Us</Link></li>
                <li><Link href="/contact" className="text-foreground/80 transition-colors hover:text-brand-green">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-14 border-t border-border/40 pt-10">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Registered office</h4>
                <p className="mt-2 text-sm text-foreground/80">84 W Broadway, Ste 200, Derry, NH 03038</p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=84+W+Broadway+Ste+200+Derry+NH+03038"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand-green hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
              <iframe
                title="Map of TravelGuards LLC registered office in Derry, New Hampshire"
                src="https://maps.google.com/maps?q=84%20W%20Broadway%20Ste%20200%20Derry%20NH%2003038&z=15&output=embed"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              This pin marks the registered office. It is not a walk-in store or showroom.
            </p>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center gap-3 border-t border-border/40 pt-8 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} TravelGuards LLC. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
              Drone products · Retail
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
