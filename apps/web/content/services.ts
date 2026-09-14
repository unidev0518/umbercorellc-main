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
  category: "consulting" | "staffing" | "delivery" | "advisory" | "data" | "cloud";
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
    title: "Software & AI Consulting",
    tagline: "Turn your initiative into a scoped, deliverable plan",
    category: "consulting",
    delivery: "1–2 weeks",
    description:
      "We work with your team to define the right approach for software, data, cloud, or AI initiatives — architecture, tooling, build-vs-buy decisions, and a delivery roadmap you can execute.",
    includes: [
      "Current-state assessment",
      "Architecture recommendation",
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

  "ai-assisted-development": buildService("ai-assisted-development", {
    title: "AI-Assisted Software Development",
    tagline: "Accelerate delivery with modern AI workflows — and human oversight",
    category: "consulting",
    delivery: "2–8 weeks",
    description:
      "We help teams use modern AI development tools and workflows to accelerate software design, implementation, testing, documentation, and modernization while maintaining human engineering oversight.",
    includes: [
      "AI-enabled developer workflow setup",
      "Rapid prototyping and iteration",
      "Testing and documentation acceleration",
      "Legacy modernization support",
    ],
    tiers: [
      tier("pilot", "Pilot", 5000, 10000, "Single team or product area", [
        "Workflow assessment",
        "Tooling recommendations",
        "Hands-on enablement",
      ]),
      tier("delivery", "Delivery Sprint", 12000, 25000, "Scoped feature or MVP", [
        "AI-assisted build sprint",
        "Engineering review gates",
        "Handoff documentation",
      ]),
      tier("program", "Enablement Program", 20000, 40000, "Multi-team adoption", [
        "Playbooks and standards",
        "Coaching across teams",
        "Ongoing advisory",
      ]),
    ],
  }),

  "data-processing": buildService("data-processing", {
    title: "Data Processing & Integration",
    tagline: "Ingest, transform, validate, and move business data",
    category: "data",
    delivery: "4–12 weeks",
    description:
      "Build systems that ingest, transform, validate, process, and move data between applications, databases, APIs, and cloud platforms — including ETL/ELT and operational workflows.",
    includes: [
      "Data ingestion and transformation",
      "Validation and aggregation",
      "API and system integration",
      "Pipeline design and handoff",
    ],
    tiers: [
      tier("foundation", "Foundation", 8000, 15000, "Single pipeline or integration", [
        "Source-to-target mapping",
        "Core transformation logic",
        "Basic monitoring",
      ]),
      tier("platform", "Platform", 20000, 45000, "Multi-source processing", [
        "Multiple pipelines",
        "Quality checks",
        "Operational runbooks",
      ]),
      tier("program", "Program", 45000, 90000, "Broader data initiative", [
        "Phased delivery",
        "Cross-system integration",
        "Ongoing support option",
      ]),
    ],
  }),

  "cloud-hosting": buildService("cloud-hosting", {
    title: "Cloud & Application Hosting",
    tagline: "Deploy and operate apps, APIs, and workloads in the cloud",
    category: "cloud",
    delivery: "Ongoing / project",
    description:
      "Deploy and operate applications, APIs, backend services, databases, and workloads using modern cloud infrastructure. We support managed cloud hosting — we do not operate physical data centers.",
    includes: [
      "Application and API hosting setup",
      "Deployment environments",
      "Managed cloud workloads",
      "Monitoring and operational support",
    ],
    tiers: [
      tier("launch", "Launch", 5000, 12000, "Single app or API", [
        "Environment setup",
        "Deployment pipeline",
        "Baseline monitoring",
      ]),
      tier("operate", "Operate", 8000, 20000, "Production workloads", [
        "Hardening and scaling guidance",
        "Ops runbooks",
        "Ongoing support hours",
      ]),
      tier("migrate", "Migrate", 15000, 40000, "Migration or modernization", [
        "Migration plan",
        "Cutover support",
        "Post-migration stabilization",
      ]),
    ],
  }),

  "staff-augmentation": buildService("staff-augmentation", {
    title: "Engineering Support",
    tagline: "Specialized engineers matched to project requirements",
    category: "staffing",
    delivery: "Ongoing",
    description:
      "Provide flexible engineering capacity for projects that need specialized software, cloud, data, or AI expertise. Specialists are matched to requirements and can work embedded with your team or as part of a delivery-led engagement.",
    includes: [
      "Requirements and role scoping",
      "Specialist matching",
      "Technical skills assessment",
      "Onboarding support",
    ],
    tiers: [
      tier("single", "Single Specialist", 5000, 8000, "One key capability", [
        "1 specialist engaged",
        "Scoped onboarding",
        "30-day fit review",
      ]),
      tier("team", "Small Team (2–4)", 12000, 20000, "Focused delivery capacity", [
        "2–4 specialists",
        "Role definition assistance",
        "Ongoing coordination",
      ]),
      tier("program", "Ongoing Program", 20000, 40000, "Continuous capacity", [
        "Dedicated sourcing support",
        "Monthly capability pipeline",
        "Priority matching",
      ]),
    ],
  }),

  "project-delivery": buildService("project-delivery", {
    title: "Project-Based Delivery",
    tagline: "We own the outcome, not just the hours",
    category: "delivery",
    delivery: "4–16 weeks",
    description:
      "Hand us a well-defined project and we'll deliver it end-to-end. We assemble a focused project-based engineering team, manage the work, and ship — software, data, cloud, or AI-assisted initiatives.",
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
    tagline: "Get your team productive on modern tooling — fast",
    category: "advisory",
    delivery: "1–4 weeks",
    description:
      "Hands-on coaching and workshops to bring your existing engineers and product teams up to speed on AI-assisted development, cloud practices, and delivery patterns.",
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
    tagline: "Senior technical guidance without full-time overhead",
    category: "advisory",
    delivery: "Monthly",
    description:
      "Monthly strategic guidance on software, data, cloud, and AI adoption — architecture choices, hiring decisions, and vendor selection. A senior technical advisor in your corner.",
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
      tier("intensive", "Intensive", 6000, 10000, "Companies scaling fast", [
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
