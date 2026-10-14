import type { Metadata } from "next";
import { LeadForm } from "@umbercore/ui";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact TravelGuards LLC about drone products, accessories, availability, and purchasing options.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div>
        <p className="hero-eyebrow mb-3">Contact</p>
        <h1 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
          Product and order inquiries
        </h1>
        <p className="mt-4 text-lg text-foreground/60">
          Use this form for product questions, availability, and purchasing coordination.
          TravelGuards LLC does not take payment through this website.
        </p>
        <img
          src="/photos/contact-station.jpg"
          alt="Controller and charging gear set up outdoors"
          className="mt-8 hidden aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-card lg:block"
        />
        <p className="mt-8 text-sm leading-relaxed text-foreground/45">
          Registered office: 84 W Broadway, Ste 200, Derry, NH 03038. This is a registered
          business address, not a walk-in store or showroom.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-surface-elevated p-6">
        <LeadForm />
      </div>
    </section>
  );
}
