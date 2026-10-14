import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "TravelGuards LLC is a New Hampshire retail business focused on drone products, accessories, and related merchandise.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="hero-eyebrow mb-3">About</p>
      <h1 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
        About TravelGuards LLC
      </h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-foreground/60">
        <p>
          TravelGuards LLC is a New Hampshire retail and commerce company focused on drone
          products, accessories, and related merchandise.
        </p>
        <p>
          We support customers with product information, purchasing coordination, and direct
          communication. The business emphasizes practical product selection and straightforward
          retail operations.
        </p>
        <p>
          The name does not describe a travel agency, a security service, or a drone manufacturer.
          We sell and help source products. We do not provide flight training, aerial photography,
          or defense services.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <img src="/photos/drone-forest.jpg" alt="White consumer drone in flight" className="h-64 w-full rounded-2xl border border-border object-cover shadow-card" />
        <img src="/photos/drone-studio.jpg" alt="Drone, controller, and batteries on a white background" className="h-64 w-full rounded-2xl border border-border object-cover shadow-card" />
      </div>
      <p className="mt-8 text-sm leading-relaxed text-foreground/45">
        Registered office: 84 W Broadway, Ste 200, Derry, NH 03038. Please do not treat this
        address as a storefront. Product questions go through the contact form.
      </p>
      <Link href="/contact" className="mt-8 inline-flex rounded-xl bg-brand-green px-6 py-3 font-semibold text-white">
        Contact us
      </Link>
    </div>
  );
}
