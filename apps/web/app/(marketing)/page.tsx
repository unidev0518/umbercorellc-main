"use client";

import { useState } from "react";
import {
  Hero,
  TrustBar,
  HowItWorks,
  AboutStrip,
  TeamPhotos,
  Industries,
  Testimonials,
  FadeIn,
  AnimatedBackground,
  Card,
  CardContent,
  CandidateForm,
  ClientForm,
} from "@umbercore/ui";

const tabs = ["Find Talent", "Find Work"] as const;
type Tab = (typeof tabs)[number];

function GetStartedSection() {
  const [active, setActive] = useState<Tab>("Find Talent");

  return (
    <section id="get-started" className="relative py-24">
      <AnimatedBackground variant="dark" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Get started
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Tell us who you are — we respond within 1 business day.
          </p>
        </FadeIn>

        <FadeIn>
          <div className="mx-auto max-w-xl">
            <div className="flex gap-2 rounded-xl border border-border bg-surface-elevated p-1 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActive(tab)}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    active === tab
                      ? "bg-brand-blue/20 text-brand-blue"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <Card className="border-border bg-gradient-card shadow-elevated glow-ring">
              <CardContent className="pt-6">
                {active === "Find Talent" ? (
                  <>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                      Find Talent
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      We have a pool of talent for almost any technology. Give us as much information as you can and we will respond within 1 business day.
                    </p>
                    <ClientForm />
                  </>
                ) : (
                  <>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                      Find Work
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      We work with tech professionals across all disciplines. We&apos;ll be in touch when there&apos;s a fit.
                    </p>
                    <CandidateForm />
                  </>
                )}
              </CardContent>
            </Card>
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
      <TeamPhotos />
      <HowItWorks />
      <Industries />
      <Testimonials />
      <GetStartedSection />
    </>
  );
}
