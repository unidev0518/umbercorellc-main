import {
  CONTACT_FOR_QUOTE,
  SCOPED_LABEL,
  SHOW_PUBLIC_PRICING,
} from "./site";

export interface ServiceTier {
  id: string;
  name: string;
  priceFrom: number;
  priceTo: number;
  priceLabel: string;
  bestFor: string;
  highlights: string[];
}

export interface ServiceDefinition {
  title: string;
  tagline: string;
  category: "consulting" | "staffing" | "delivery" | "advisory";
  delivery: string;
  description: string;
  includes: string[];
  tiers: ServiceTier[];
  priceFrom: string;
  priceRange: string;
  priceMin: number;
  priceMax: number;
}

function tier(
  id: string,
  name: string,
  from: number,
  to: number,
  bestFor: string,
  highlights: string[]
): ServiceTier {
  const fmt = (n: number) =>
    n >= 1000 ? `$${n.toLocaleString("en-US")}` : `$${n}`;
  return {
    id,
    name,
    priceFrom: from,
    priceTo: to,
    priceLabel: `${fmt(from)} – ${fmt(to)}`,
    bestFor,
    highlights,
  };
}

function buildService(
  slug: string,
  data: Omit<ServiceDefinition, "priceFrom" | "priceRange" | "priceMin" | "priceMax"> & {
    tiers: ServiceTier[];
  }
): ServiceDefinition & { slug: string } {
  const mins = data.tiers.map((t) => t.priceFrom);
  const maxs = data.tiers.map((t) => t.priceTo);
  const priceMin = Math.min(...mins);
  const priceMax = Math.max(...maxs);
  const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;
  return {
    ...data,
    slug,
    priceMin,
    priceMax,
    priceFrom: `from ${fmt(priceMin)}`,
    priceRange: `${fmt(priceMin)} – ${fmt(priceMax)}`,
  };
}

const catalog = {
  "ai-consulting": buildService("ai-consulting", {
    title: "AI Solution Consulting",
    tagline: "Turn your AI idea into a scoped, deliverable plan",
    category: "consulting",
    delivery: "1–2 weeks",
    description:
      "We work with your team to define the right AI approach for your use case — architecture, tooling, build-vs-buy decisions, and a delivery roadmap you can execute.",
    includes: [
      "Current-state assessment",
      "AI architecture recommendation",
      "Build-vs-buy analysis",
      "Delivery roadmap with milestones",
    ],
    tiers: [
      tier("starter", "Starter", 3000, 5000, "SMBs & early-stage teams", [
        "1 use case scoped",
        "Architecture options doc",
        "2-week delivery",
      ]),
      tier("growth", "Growth", 5000, 10000, "Mid-size companies", [
        "Up to 3 use cases",
        "Vendor evaluation included",
        "Stakeholder presentation",
      ]),
      tier("enterprise", "Enterprise", 10000, 20000, "Enterprise programs", [
        "Multi-team coordination",
        "Phased rollout plan",
        "Executive briefing",
      ]),
    ],
  }),

  "staff-augmentation": buildService("staff-augmentation", {
    title: "Staff Augmentation",
    tagline: "Vetted AI and tech talent — on your team, fast",
    category: "staffing",
    delivery: "Ongoing",
    description:
      "We source, vet, and place AI engineers, data scientists, and tech leads into your team. You get skilled professionals who hit the ground running, without months of recruiting.",
    includes: [
      "Candidate sourcing & screening",
      "Technical skills assessment",
      "Culture and team fit review",
      "Onboarding support",
    ],
    tiers: [
      tier("single", "Single Placement", 5000, 8000, "One key hire", [
        "1 candidate placed",
        "2-week SLA",
        "30-day placement guarantee",
      ]),
      tier("team", "Small Team (2–4)", 12000, 20000, "Building a team fast", [
        "2–4 candidates placed",
        "Role definition assistance",
        "60-day guarantee",
      ]),
      tier("program", "Ongoing Program", 20000, 40000, "Continuous hiring pipeline", [
        "Dedicated talent sourcing",
        "Monthly candidate pipeline",
        "Priority placements",
      ]),
    ],
  }),

  "project-delivery": buildService("project-delivery", {
    title: "Project-Based Delivery",
    tagline: "We own the outcome, not just the hours",
    category: "delivery",
    delivery: "4–16 weeks",
    description:
      "Hand us a well-defined project and we'll deliver it end-to-end. We assemble a focused team of AI engineers and technical leads, manage the work, and ship.",
    includes: [
      "Project scoping and kickoff",
      "Dedicated delivery team",
      "Weekly progress reporting",
      "Final handoff with documentation",
    ],
    tiers: [
      tier("small", "Small Project", 15000, 30000, "Proof-of-concept or MVP", [
        "4–6 week engagement",
        "2–3 person team",
        "Fixed-scope deliverable",
      ]),
      tier("medium", "Medium Project", 30000, 70000, "Production-ready build", [
        "8–12 week engagement",
        "3–5 person team",
        "Testing and QA included",
      ]),
      tier("large", "Large Project", 70000, 150000, "Complex platform build", [
        "12–16 week engagement",
        "5–8 person team",
        "Phased milestones with reviews",
      ]),
    ],
  }),

  "technical-discovery": buildService("technical-discovery", {
    title: "Technical Discovery & Scoping",
    tagline: "Clarity before commitment — scope it right the first time",
    category: "consulting",
    delivery: "1–2 weeks",
    description:
      "A structured discovery sprint to define requirements, identify risks, and produce a scoped brief your team or ours can execute against. Stops projects from going sideways before they start.",
    includes: [
      "Stakeholder interviews",
      "Technical requirements document",
      "Risk and dependency map",
      "Scoped project brief with estimates",
    ],
    tiers: [
      tier("rapid", "Rapid", 2500, 4000, "Single-team projects", [
        "3-day sprint",
        "Requirements doc",
        "High-level estimate",
      ]),
      tier("standard", "Standard", 4000, 7000, "Multi-team initiatives", [
        "Full 1-week discovery",
        "Detailed scoping doc",
        "Vendor options if relevant",
      ]),
      tier("extended", "Extended", 7000, 12000, "Enterprise programs", [
        "2-week deep discovery",
        "Architecture recommendations",
        "Phased roadmap",
      ]),
    ],
  }),

  "team-enablement": buildService("team-enablement", {
    title: "Team Enablement & Ramp-up",
    tagline: "Get your team up to speed on AI — fast",
    category: "advisory",
    delivery: "1–4 weeks",
    description:
      "Hands-on coaching and workshops to bring your existing engineers and product teams up to speed on AI tooling, best practices, and delivery patterns.",
    includes: [
      "Skills gap assessment",
      "Customized workshop content",
      "Hands-on labs and exercises",
      "Reference materials and guides",
    ],
    tiers: [
      tier("workshop", "Single Workshop", 3000, 5000, "One-day team session", [
        "Half or full-day format",
        "Up to 15 attendees",
        "Hands-on exercises",
      ]),
      tier("program", "3-Week Program", 8000, 15000, "Deep team upskilling", [
        "3 weekly sessions",
        "Capstone project",
        "Follow-up Q&A",
      ]),
      tier("embedded", "Embedded Coach", 12000, 25000, "Continuous team support", [
        "Monthly embedded coaching",
        "Code review and mentorship",
        "On-call async support",
      ]),
    ],
  }),

  "advisory-retainer": buildService("advisory-retainer", {
    title: "Ongoing Tech Advisory",
    tagline: "Your outsourced CTO and AI strategy partner",
    category: "advisory",
    delivery: "Monthly",
    description:
      "Monthly strategic guidance on AI adoption, hiring decisions, architecture choices, and vendor selection. A senior technical advisor in your corner — without the full-time cost.",
    includes: [
      "Monthly strategy session",
      "Async question support",
      "Vendor and tooling reviews",
      "Quarterly roadmap review",
    ],
    tiers: [
      tier("light", "Light", 2000, 3500, "Early-stage companies", [
        "2hr/month advisory",
        "Async support",
        "Monthly brief",
      ]),
      tier("standard-monthly", "Standard", 3500, 6000, "Growing teams", [
        "4hr/month advisory",
        "Slack access",
        "Vendor review included",
      ]),
      tier("intensive", "Intensive", 6000, 10000, "Companies scaling AI fast", [
        "8hr/month advisory",
        "Priority response",
        "Quarterly planning session",
      ]),
    ],
  }),
} as const;

export const services = catalog;

export type ServiceSlug = keyof typeof services;

export function getServiceSummaries() {
  return (Object.entries(services) as [ServiceSlug, (typeof services)[ServiceSlug]][]).map(
    ([slug, s]) => ({
      slug,
      title: s.title,
      tagline: s.tagline,
      price: SHOW_PUBLIC_PRICING ? s.priceFrom : CONTACT_FOR_QUOTE,
      priceRange: SHOW_PUBLIC_PRICING ? s.priceRange : SCOPED_LABEL,
      priceMin: s.priceMin,
      priceMax: s.priceMax,
      desc: s.tagline,
      tierCount: s.tiers.length,
      category: s.category,
    })
  );
}

export function getTiersForDisplay(tiers: ServiceTier[]) {
  return tiers.map((t) => ({
    ...t,
    priceLabel: SHOW_PUBLIC_PRICING ? t.priceLabel : CONTACT_FOR_QUOTE,
  }));
}
