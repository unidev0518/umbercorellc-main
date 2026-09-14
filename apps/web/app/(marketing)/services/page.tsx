import type { Metadata } from "next";
import {
  Code2, Sparkles, Database, Cloud, Server, GitBranch,
  Workflow, ArrowRightLeft, ClipboardList, Users, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "UmberCore offers software development consulting, AI-assisted engineering, data processing, cloud hosting, backend APIs, integration, and technical project delivery.",
};

const services = [
  {
    icon: Code2,
    title: "Software Development Consulting",
    tagline: "Design, build, modernize.",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/20",
    href: "/services/technical-discovery",
    desc: "Design, architecture, implementation, modernization, and technical guidance for web, backend, cloud, and enterprise applications.",
    points: [
      "Architecture and delivery planning",
      "Application modernization",
      "Implementation guidance",
      "Scoped technical discovery",
    ],
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Software Development",
    tagline: "Accelerate with oversight.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    href: "/services/ai-assisted-development",
    desc: "Use modern AI tools and engineering workflows to accelerate prototyping, development, testing, documentation, and application modernization — with human engineering oversight.",
    points: [
      "AI-enabled developer workflows",
      "Faster prototyping and iteration",
      "Testing and documentation support",
      "Legacy modernization assistance",
    ],
  },
  {
    icon: Database,
    title: "Data Processing & Integration",
    tagline: "Ingest, transform, move.",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/20",
    href: "/services/data-processing",
    desc: "Build systems that ingest, transform, validate, process, and move data between applications, databases, APIs, and cloud platforms.",
    points: [
      "ETL / ELT and workflow processing",
      "Validation and aggregation",
      "API and system integration",
      "Structured and unstructured workflows",
    ],
  },
  {
    icon: Cloud,
    title: "Cloud & Application Hosting",
    tagline: "Deploy and operate.",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
    href: "/services/cloud-hosting",
    desc: "Deploy and operate applications, APIs, backend services, databases, and workloads using modern cloud infrastructure — not owned physical data centers.",
    points: [
      "Application and API hosting",
      "Managed cloud workloads",
      "Deployment environments",
      "Operational support",
    ],
  },
  {
    icon: Server,
    title: "Backend & API Engineering",
    tagline: "Services that scale.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    href: "/services/project-delivery",
    desc: "Build scalable services and APIs that power applications, integrations, workflows, and digital products.",
    points: [
      "API design and implementation",
      "Service architecture",
      "Integration endpoints",
      "Reliability-minded delivery",
    ],
  },
  {
    icon: GitBranch,
    title: "Data Platforms & Pipelines",
    tagline: "Operational and analytical.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    href: "/services/data-processing",
    desc: "Design data pipelines, databases, processing workflows, and platform components for operational and analytical use cases.",
    points: [
      "Pipeline design",
      "Database and storage patterns",
      "Batch and streaming workflows",
      "Platform components",
    ],
  },
  {
    icon: Workflow,
    title: "Cloud Infrastructure & DevOps",
    tagline: "Automate the path to production.",
    color: "text-orange-300",
    bg: "bg-orange-300/10",
    border: "border-orange-300/20",
    href: "/services/cloud-hosting",
    desc: "Support deployment, automation, CI/CD, infrastructure configuration, monitoring, and cloud operations.",
    points: [
      "CI/CD and deployment automation",
      "Infrastructure configuration",
      "Monitoring and maintenance",
      "Migration support",
    ],
  },
  {
    icon: ArrowRightLeft,
    title: "System Integration & Migration",
    tagline: "Connect what you already have.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    href: "/services/project-delivery",
    desc: "Connect applications, platforms, APIs, databases, and legacy systems while supporting data and application migrations.",
    points: [
      "Application and API connectivity",
      "Legacy system integration",
      "Data and app migrations",
      "Cutover planning",
    ],
  },
  {
    icon: ClipboardList,
    title: "Technical Project Delivery",
    tagline: "We own the outcome.",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/20",
    href: "/services/managed-delivery",
    desc: "Help organizations plan and execute software initiatives using experienced engineers and specialized technical resources.",
    points: [
      "Scoped project ownership",
      "Milestone-based delivery",
      "Documentation and handoff",
      "Flexible team composition",
    ],
  },
  {
    icon: Users,
    title: "Engineering Support",
    tagline: "Capacity when you need it.",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/20",
    href: "/services/staff-augmentation",
    desc: "Provide flexible engineering capacity for projects that require specialized software, cloud, data, or AI expertise.",
    points: [
      "Specialists matched to requirements",
      "Project-based engineering teams",
      "Embedded or delivery-led models",
      "Software, cloud, data, and AI skills",
    ],
  },
];

const gradientText = {
  background: "linear-gradient(115deg, hsl(160 56% 70%) 0%, hsl(196 80% 65%) 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-surface-default text-foreground">
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-hero py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-green/8 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-72 w-72 rounded-full bg-brand-blue/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-4">What we offer</p>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-6xl">
            Technology consulting —<br />
            <span style={gradientText}>software, data, cloud &amp; AI.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/55">
            From software development and AI-assisted engineering to data processing, application
            hosting, and technical project delivery — scoped to what your business needs.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border ${s.border} bg-surface-elevated/40 p-7 backdrop-blur-sm transition-all hover:bg-surface-elevated/70`}
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                  <s.icon className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <h2 className={`font-heading text-xl font-bold ${s.color}`}>{s.title}</h2>
                <p className="mt-0.5 text-sm font-medium text-foreground/40">{s.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">{s.desc}</p>
                <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-5">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-foreground/55">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${s.bg}`}>
                        <span className="sr-only">•</span>
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <a
                  href={s.href}
                  className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${s.color} opacity-0 transition-opacity group-hover:opacity-100`}
                >
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-surface-dark py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="hero-eyebrow mb-3">Not sure where to start?</p>
              <h2 className="font-heading text-3xl font-extrabold tracking-[-0.03em] text-foreground">
                We&apos;ll scope it with you.
              </h2>
              <p className="mt-4 text-lg text-foreground/50">
                Most engagements start with a short conversation. Tell us what you&apos;re trying
                to achieve — we&apos;ll recommend the right mix of consulting, delivery, and
                specialized engineering support.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <a
                href="/#get-started"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-semibold text-surface-dark transition-all hover:bg-brand-green/90"
              >
                Start a Project
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-foreground transition-all hover:bg-white/[0.08]"
              >
                About UmberCore
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
