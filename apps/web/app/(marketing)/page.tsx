import {
  Hero,
  TrustBar,
  HowItWorks,
  AboutStrip,
  Industries,
  FadeIn,
  AnimatedBackground,
  LeadForm,
} from "@umbercore/ui";

const gallery = [
  { src: "/photos/drone-trees.jpg", alt: "Small drone flying outdoors", label: "In the air" },
  { src: "/photos/drone-studio.jpg", alt: "Drone with a controller and spare batteries", label: "Ready to pack" },
  { src: "/photos/kit-flatlay.jpg", alt: "Drones, controllers, batteries, and small parts laid out together", label: "Full kits" },
  { src: "/photos/controller-hands.jpg", alt: "Person holding a drone controller outdoors", label: "Controllers" },
  { src: "/photos/picnic-kit.jpg", alt: "Several drones, controllers, and batteries on a picnic table", label: "Out in the field" },
  { src: "/photos/charger-hub.jpg", alt: "Battery charging hub", label: "Charging" },
  { src: "/photos/case-kit.jpg", alt: "Organized case with batteries, cables, and a drone pouch", label: "Packed gear" },
  { src: "/photos/drone-table.jpg", alt: "Several folded drones and controllers on a work table", label: "Side by side" },
] as const;

function GallerySection() {
  return (
    <section className="border-t border-border bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="hero-eyebrow mb-3">A closer look</p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            The kinds of products we talk about
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            These photos show the types of drones, controllers, batteries, and accessories customers ask about.
            They are not a catalog, and they do not mean a specific model is in stock.
          </p>
        </FadeIn>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {gallery.map((photo) => (
            <figure key={photo.src} className="overflow-hidden rounded-2xl border border-border bg-surface-mid shadow-card">
              <img src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="px-3 py-2 text-xs font-medium text-muted-foreground">{photo.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetStartedSection() {
  return (
    <section id="get-started" className="relative py-24">
      <AnimatedBackground variant="light" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Ask about a product
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Tell us what you are looking for. We will reply with the availability and purchasing options we can confirm. This form is not a checkout.
          </p>
        </FadeIn>
        <FadeIn>
          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <LeadForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <AboutStrip />
      <GallerySection />
      <HowItWorks />
      <Industries />
      <GetStartedSection />
    </>
  );
}
