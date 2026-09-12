import type { Metadata } from "next";
import {
  Plane, Car, Landmark, Database, ShieldCheck, Flame,
  Wrench, Building2, FlaskConical, Monitor, Pill, Cpu, Radio, HeartPulse,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Industries",
  description: "UmberCore delivers technology staffing and project delivery across 14+ industries including Banking, Healthcare, Cybersecurity, Aerospace, and more.",
};

const industries = [
  {
    icon: Plane,
    label: "Aerospace & Defense",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/15",
    desc: "Systems engineers, embedded software developers, and program managers for defense and aviation programs.",
  },
  {
    icon: Car,
    label: "Automotive & Transportation",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/15",
    desc: "ADAS engineers, firmware developers, and EV software specialists across OEMs and Tier 1 suppliers.",
  },
  {
    icon: Landmark,
    label: "Banking & Finance",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/15",
    desc: "Quant developers, compliance engineers, and fintech specialists for banks, trading firms, and payment platforms.",
  },
  {
    icon: Database,
    label: "Big Data & AI",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/15",
    desc: "ML engineers, data scientists, and AI platform builders for companies at every stage of AI adoption.",
  },
  {
    icon: ShieldCheck,
    label: "Cybersecurity",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/15",
    desc: "Security engineers, penetration testers, and SOC analysts across enterprise and government environments.",
  },
  {
    icon: Flame,
    label: "Energy, Oil & Gas",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/15",
    desc: "Control systems engineers, SCADA developers, and field technology specialists for energy infrastructure.",
  },
  {
    icon: Wrench,
    label: "Engineering",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/15",
    desc: "Mechanical, electrical, and systems engineers for R&D, manufacturing, and product development teams.",
  },
  {
    icon: Building2,
    label: "Government",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/15",
    desc: "Cleared and non-cleared technologists for federal, state, and local government technology programs.",
  },
  {
    icon: FlaskConical,
    label: "Life Sciences",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/15",
    desc: "Bioinformatics engineers, clinical data managers, and regulatory technology specialists.",
  },
  {
    icon: Monitor,
    label: "Information Technology",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/15",
    desc: "Full-stack engineers, DevOps, cloud architects, and IT project managers across all technology stacks.",
  },
  {
    icon: Pill,
    label: "Pharma",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/15",
    desc: "Validation engineers, QA specialists, and software developers for pharmaceutical manufacturing and R&D.",
  },
  {
    icon: Cpu,
    label: "Semiconductor",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/15",
    desc: "VLSI design engineers, verification specialists, and embedded software developers for chip design teams.",
  },
  {
    icon: Radio,
    label: "Telecom",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/15",
    desc: "Network engineers, 5G specialists, and software developers for telecom operators and equipment vendors.",
  },
  {
    icon: HeartPulse,
    label: "Healthcare & Biomedical",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/15",
    desc: "Medical device software engineers, HL7/FHIR developers, and healthcare IT specialists.",
  },
];

const gradientText = {
  background: "linear-gradient(115deg, hsl(160 56% 70%) 0%, hsl(196 80% 65%) 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-surface-default text-foreground">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-hero py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-green/8 blur-[120px]" />
          <div className="absolute right-1/3 bottom-0 h-72 w-72 rounded-full bg-brand-blue/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-4">Industries we serve</p>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-6xl">
            Deep expertise<br />
            <span style={gradientText}>across every sector.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/55">
            Our talent network spans 14+ verticals. We match your industry, your stack,
            and your team culture — not just a job title.
          </p>
        </div>
      </section>

      {/* ── Industries Grid ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {industries.map((ind) => (
              <div
                key={ind.label}
                className={`group relative overflow-hidden rounded-2xl border ${ind.border} bg-surface-elevated/40 p-6 backdrop-blur-sm transition-all hover:bg-surface-elevated/70`}
              >
                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 10% 20%, ${ind.bg.replace("bg-", "").replace("/10", "/ 0.15")}, transparent 70%)` }}
                />
                <div className={`relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${ind.bg} ${ind.color}`}>
                  <ind.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className={`relative font-heading text-base font-bold ${ind.color}`}>{ind.label}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-foreground/50">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/50 bg-surface-dark py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-3">Don't see your industry?</p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            We likely still have the talent you need.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/50">
            Our network spans hundreds of specialisations. If your vertical isn't listed,
            reach out — chances are we've placed engineers in your space before.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/#get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-semibold text-surface-dark transition-all hover:bg-brand-green/90"
            >
              Find Talent
            </a>
            <a
              href="/#get-started"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-foreground transition-all hover:bg-white/[0.08]"
            >
              Find Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
