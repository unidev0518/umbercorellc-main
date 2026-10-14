import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What We Offer",
  description:
    "TravelGuards LLC offers drone product sales, accessories, product sourcing help, order coordination, and customer assistance.",
};

const offers = [
  {
    title: "Drone products",
    image: "/photos/drone-trees.jpg",
    alt: "Drone flying among trees",
    body: "Explore drone products for personal and recreational use, with information to support a purchasing decision.",
  },
  {
    title: "Drone accessories",
    image: "/photos/accessory-case.jpg",
    alt: "Labeled pouches for cables, tools, and small accessories",
    body: "Accessories and related items that support everyday drone ownership, confirmed against the product you need.",
  },
  {
    title: "Product sourcing",
    image: "/photos/kit-flatlay.jpg",
    alt: "Assortment of drones, controllers, and batteries",
    body: "Help with availability inquiries, supplier coordination, and purchasing arrangements. We do not claim exclusive supplier access.",
  },
  {
    title: "Order coordination",
    image: "/photos/case-kit.jpg",
    alt: "Packed case with batteries and a drone pouch",
    body: "Support with order details and fulfillment-related communication after a purchase is agreed.",
  },
  {
    title: "Customer assistance",
    image: "/photos/controller-hands.jpg",
    alt: "Hands holding a drone controller outdoors",
    body: "Clear answers on product inquiries, availability, ordering, and follow-up questions.",
  },
  {
    title: "Related retail products",
    image: "/photos/controller-pair.jpg",
    alt: "Two handheld controllers on a vehicle hood",
    body: "Additional consumer electronics and merchandise when they are part of what the business can offer.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <p className="hero-eyebrow mb-3">What we offer</p>
      <h1 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
        Retail help around the product
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground/60">
        TravelGuards LLC is a retail and commerce business. Purchasing starts with an inquiry.
        We confirm availability and coordinate the order. Shipping terms, returns, and warranties
        are discussed for the specific order — they are not published as blanket policies here.
      </p>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {offers.map((item) => (
          <article key={item.title} className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
            <img src={item.image} alt={item.alt} className="aspect-[16/9] w-full object-cover" />
            <div className="p-6">
              <h2 className="font-heading text-xl font-bold text-foreground">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/60">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
      <Link href="/contact" className="mt-10 inline-flex rounded-xl bg-brand-green px-6 py-3 font-semibold text-white">
        Start an inquiry
      </Link>
    </div>
  );
}
