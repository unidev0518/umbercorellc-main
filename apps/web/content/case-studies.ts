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

/**
 * Illustrative engagement scenarios used on service detail pages.
 * Verify before presenting as named customer case studies.
 */
export const caseStudies: CaseStudy[] = [
  {
    id: "fintech-ai-platform",
    visual: "risk-dashboard",
    client: "Series B FinTech",
    industry: "Financial services",
    serviceSlug: "project-delivery",
    serviceLabel: "Project-Based Delivery",
    headline: "Fraud scoring model delivered as a managed project",
    insight:
      "The in-house team had domain knowledge but needed deeper ML and delivery support. A focused project team shipped a production-ready fraud scoring model with documentation and engineering handoff.",
    metrics: [
      { label: "Engagement model", value: "Managed delivery", highlight: true },
      { label: "Focus", value: "ML + backend" },
      { label: "Outcome", value: "Production handoff" },
    ],
  },
  {
    id: "healthcare-staff-aug",
    visual: "policy-shield",
    client: "Digital Health Platform",
    industry: "Healthcare",
    serviceSlug: "staff-augmentation",
    serviceLabel: "Engineering Support",
    headline: "Specialized engineering capacity for a critical launch window",
    insight:
      "Headcount was approved and a project start date was set, but specialist capacity was missing. UmberCore matched senior ML engineers to the stack and timeline so the initiative could proceed.",
    metrics: [
      { label: "Model", value: "Engineering support", highlight: true },
      { label: "Focus", value: "ML specialists" },
      { label: "Outcome", value: "Launch capacity" },
    ],
  },
  {
    id: "saas-discovery",
    visual: "compliance-map",
    client: "B2B SaaS Platform",
    industry: "HR tech",
    serviceSlug: "technical-discovery",
    serviceLabel: "Technical Discovery & Scoping",
    headline: "Large roadmap scoped and de-risked before build",
    insight:
      "A broad AI roadmap was about to be greenlit without a detailed spec. A discovery sprint surfaced integration risks and reduced initial phase scope — avoiding months of rework.",
    metrics: [
      { label: "Model", value: "Discovery sprint", highlight: true },
      { label: "Focus", value: "Scope & risk" },
      { label: "Outcome", value: "Phased plan" },
    ],
  },
];

export function caseStudiesForService(slug: ServiceSlug): CaseStudy[] {
  return caseStudies.filter((c) => c.serviceSlug === slug);
}
