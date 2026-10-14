import type { Metadata } from "next";
import Link from "next/link";
import { productCategories } from "@/content/product-categories";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Product categories from TravelGuards LLC: consumer drones, accessories, replacement components, batteries and charging items, and related electronics.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-border shadow-card">
        <img
          src="/photos/hero-flight.jpg"
          alt="Drone flying over open water"
          className="h-56 w-full object-cover sm:h-72"
        />
      </div>
      <p className="hero-eyebrow mb-3 mt-10">Products</p>
      <h1 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
        Drone products &amp; accessories
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground/60">
        These categories describe the kinds of products TravelGuards LLC can discuss with you.
        They are not a live inventory, and this site does not list models, prices, or stock counts.
      </p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {productCategories.map((item) => (
          <Link key={item.slug} href={`/products/${item.slug}`} className="overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-colors hover:border-brand-blue/40">
            <img src={item.hero.src} alt={item.hero.alt} className="aspect-[16/10] w-full object-cover" />
            <div className="p-6">
              <h2 className="font-heading text-xl font-bold text-foreground">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/60">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link href="/contact" className="mt-10 inline-flex rounded-xl bg-brand-green px-6 py-3 font-semibold text-white">
        Ask what is available
      </Link>
    </div>
  );
}
