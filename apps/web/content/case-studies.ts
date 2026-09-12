import type { ServiceSlug } from "./services";

export type CaseStudyVisual = "risk-dashboard" | "policy-shield" | "compliance-map";

export interface CaseStudy {
  id: string;
  visual: CaseStudyVisual;
  client: string;
  industry: string;
  serviceSlug: ServiceSlug;
  serviceLabel: string;
  headline: string;
  insight: string;
  metrics: { label: string; value: string; highlight?: boolean }[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "fintech-ai-platform",
    visual: "risk-dashboard",
    client: "Series B FinTech",
    industry: "Financial services · 80 employees",
    serviceSlug: "project-delivery",
    serviceLabel: "Project-Based Delivery",
    headline: "AI-powered fraud detection shipped in 10 weeks",
    insight:
      "Their in-house team had the domain knowledge but lacked AI engineering depth. We embedded a 4-person team, delivered a production-ready fraud scoring model, and handed off with full documentation and onboarding for their engineers.",
    metrics: [
      { label: "Time to production", value: "10 weeks", highlight: true },
      { label: "Team placed", value: "4 engineers" },
      { label: "False positive rate", value: "↓ 62%" },
    ],
  },
  {
    id: "healthcare-staff-aug",
    visual: "policy-shield",
    client: "Digital Health Platform",
    industry: "Healthcare · 45 employees",
    serviceSlug: "staff-augmentation",
    serviceLabel: "Staff Augmentation",
    headline: "3 senior AI engineers placed in 2 weeks",
    insight:
      "The team had headcount approved and a project starting in 30 days but no candidates. We sourced, screened, and placed three senior ML engineers — all cleared their 90-day check-in.",
    metrics: [
      { label: "Placement speed", value: "2 weeks", highlight: true },
      { label: "Engineers placed", value: "3 seniors" },
      { label: "Retention", value: "100% @ 90 days" },
    ],
  },
  {
    id: "saas-discovery",
    visual: "compliance-map",
    client: "B2B SaaS Platform",
    industry: "HR tech · 120 employees",
    serviceSlug: "technical-discovery",
    serviceLabel: "Technical Discovery & Scoping",
    headline: "6-month project scoped and de-risked in 5 days",
    insight:
      "They were about to greenlight a large AI roadmap without a detailed spec. Our discovery sprint surfaced two major integration risks and cut the initial phase scope by 40% — saving months of rework.",
    metrics: [
      { label: "Discovery time", value: "5 days", highlight: true },
      { label: "Scope reduction", value: "40% phase 1" },
      { label: "Risks surfaced", value: "6 critical" },
    ],
  },
];

export function caseStudiesForService(slug: ServiceSlug): CaseStudy[] {
  return caseStudies.filter((c) => c.serviceSlug === slug);
}
