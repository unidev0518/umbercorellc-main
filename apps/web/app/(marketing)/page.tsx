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

const tabs = ["Start a Project", "Join Our Network"] as const;
type Tab = (typeof tabs)[number];

function GetStartedSection() {
  const [active, setActive] = useState<Tab>("Start a Project");

  return (
    <section id="get-started" className="relative py-24">
      <AnimatedBackground variant="dark" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Get started
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Tell us about your initiative — we respond within 1 business day.
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
                {active === "Start a Project" ? (
                  <>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                      Start a Project
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Share your software, data, cloud, or AI initiative. We&apos;ll recommend the right consulting and delivery approach.
                    </p>
                    <ClientForm />
                  </>
                ) : (
                  <>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                      Join Our Network
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      We work with experienced technical professionals across software, data, cloud, and AI. We&apos;ll reach out when there&apos;s a fit.
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
