import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Button,
  Badge,
  CardContent,
  FadeIn,
  AnimatedBackground,
  InteractiveCard,
  ProjectShowcase,
  ServiceTiers,
} from "@umbercore/ui";
import { getTiersForDisplay, services, type ServiceSlug } from "@/content/services";
import { caseStudies, caseStudiesForService } from "@/content/case-studies";

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services[slug as ServiceSlug];
  if (!service) notFound();

  const relatedProjects = caseStudiesForService(slug as ServiceSlug);
  const showcaseProjects =
    relatedProjects.length > 0 ? relatedProjects : caseStudies.slice(0, 2);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-hero py-20 text-foreground">
        <AnimatedBackground variant="dark" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-brand-green/40 bg-brand-green/10 text-brand-green">
                {service.delivery}
              </Badge>
              <Link
                href="/services"
                className="text-sm text-brand-blue hover:text-brand-green transition-colors"
              >
                ← All services
              </Link>
            </div>
            <h1 className="hero-title mt-4 font-heading text-4xl font-extrabold sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-4 text-xl text-foreground/85">{service.tagline}</p>
          </FadeIn>
        </div>
      </section>

      <ServiceTiers
        tiers={getTiersForDisplay(service.tiers)}
        serviceTitle={service.title}
        showPricing={false}
      />

      <ProjectShowcase
        projects={showcaseProjects}
        title="See the impact"
        subtitle="Illustrative engagement scenarios for this service area."
      />

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <FadeIn>
              <h2 className="font-heading text-2xl font-bold text-foreground">What you get</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <h3 className="mt-10 font-heading text-xl font-semibold">Every scope includes</h3>
              <ul className="mt-4 space-y-3">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-border bg-surface-elevated/50 px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-sm text-brand-green">
                      ✓
                    </span>
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button variant="accent" size="lg" asChild>
                  <Link href="/contact">Get in touch</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/services">All services</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.1}>
            <InteractiveCard className="glow-ring sticky top-24">
              <CardContent className="pt-6">
                <h3 className="font-heading font-semibold">Interested in this service?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tell us about your project or team needs and we&apos;ll get back to you within one business day.
                </p>
                <div className="mt-6">
                  <Button variant="accent" className="w-full" asChild>
                    <Link href="/contact">Contact us</Link>
                  </Button>
                </div>
              </CardContent>
            </InteractiveCard>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
