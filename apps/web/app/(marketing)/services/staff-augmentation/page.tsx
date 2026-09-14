import type { Metadata } from "next";
import {
  CheckCircle2, XCircle, Clock, ShieldCheck, TrendingUp,
  Users, Zap, Building2, ArrowRight, Globe2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Engineering Support & Staff Augmentation | UmberCore",
  description:
    "Flexible engineering support from specialized software, cloud, data, and AI professionals matched to project requirements — a consulting delivery option within UmberCore's broader technology services.",
};

const pros = [
  "Scale headcount up or down without long-term commitments",
  "Access specialised skills unavailable in your local market",
  "Reduce time-to-hire from months to days",
  "Maintain full control over how and where work gets done",
  "Pay only for the capacity you actually need",
  "Lower employer burden — no benefits, insurance, or training overhead",
];

const cons = [
  "Requires a ramp-up period before peak productivity",
  "May not be ideal for projects with highly sensitive IP",
  "Long-term projects may benefit more from a managed delivery model",
  "Requires clear internal onboarding and communication processes",
];

const types = [
  {
    icon: Zap,
    title: "Commodity Augmentation",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/20",
    desc: "High-volume, lower-complexity roles where speed and scale matter most. Ideal for large teams doing repeatable, trainable work.",
  },
  {
    icon: TrendingUp,
    title: "Skill-Based Augmentation",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/20",
    desc: "Mid-to-high complexity roles requiring a defined skill set — full-stack engineers, DevOps, QA automation, and similar profiles.",
  },
  {
    icon: Building2,
    title: "Expert Augmentation",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    desc: "Highly specialised talent — machine learning engineers, security architects, VLSI designers. Rarity drives value here, not volume.",
  },
];

const considerations = [
  {
    n: "01",
    title: "Project Length",
    color: "text-brand-green",
    body:
      "Staff augmentation works best for short-to-medium engagements where flexibility is critical. For multi-year, deeply embedded work, a managed delivery arrangement often makes more financial sense — though many augmentation providers (including UmberCore) will negotiate longer-term terms.",
  },
  {
    n: "02",
    title: "Ramp-Up Time",
    color: "text-brand-blue",
    body:
      "Every new engineer needs time to absorb context. For highly complex, domain-heavy projects, that ramp-up cost can erode value quickly. The more specialised the domain, the more important it is to work with a partner who pre-vets for both technical skill and domain familiarity.",
  },
  {
    n: "03",
    title: "Sensitive IP",
    color: "text-violet-400",
    body:
      "Concerns around intellectual property are valid but often overstated. A contractor agreement is legally as robust as a full-time employment contract. Proper NDAs and IP assignment clauses handle most scenarios. Proceed with caution on truly clandestine projects, but don't let perception override evidence.",
  },
];

const misunderstandings = [
  {
    title: "\"It's just cost avoidance.\"",
    body:
      "Trying to skip full-time benefits by using augmented staff is a false economy. Staffing providers build benefit costs into their rates. If you need someone long-term and benefits are the only driver, a direct hire will often be cheaper. Use augmentation for flexibility and speed — not to dodge payroll obligations.",
  },
  {
    title: "\"Augmented staff cost more.\"",
    body:
      "The hourly rate looks higher until you factor in employer burden. A $100,000 salary employee typically costs 23–50% more on top in benefits, matching, insurance, and training. A contract engineer's all-in cost is often comparable — with none of the long-term obligation.",
  },
  {
    title: "\"It's the same as managed services.\"",
    body:
      "These are meaningfully different models. Staff augmentation is time-and-materials: you direct the work, you own the outcome. Managed delivery is outcome-based: the provider owns a defined deliverable and is accountable to KPIs. Choosing the wrong model creates misaligned expectations on both sides.",
  },
];

const gradientText = {
  background: "linear-gradient(115deg, hsl(160 56% 70%) 0%, hsl(196 80% 65%) 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};

export default function StaffAugmentationPage() {
  return (
    <div className="min-h-screen bg-surface-default text-foreground">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-hero py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-green/8 blur-[120px]" />
          <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-brand-blue/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <a href="/services" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/40 transition-colors hover:text-brand-green">
            ← Back to Services
          </a>
          <p className="hero-eyebrow mb-4 mt-2">Engineering Support</p>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-6xl">
            Flexible engineering capacity —<br />
            <span style={gradientText}>what is staff augmentation?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/55">
            Staff augmentation is one way UmberCore provides specialized engineering support —
            embedding experienced technical professionals with your team on a flexible basis
            within a broader consulting and delivery model.
          </p>
        </div>
      </section>

      {/* ── What it is ── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-3">The basics</p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            What staff augmentation actually means.
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-foreground/60">
            <p>
              At its core, staff augmentation means bringing in external talent — on a
              temporary or project basis — to work alongside your existing team. You retain
              full control over direction, priorities, and how the work gets done. The augmented
              engineer functions as a member of your team, just without the long-term
              employment overhead.
            </p>
            <p>
              The practice is far from new, but its scale has grown dramatically. The global
              staffing industry — one of the primary channels for augmentation talent — supports
              an estimated $490 billion in annual spend. In the US alone, roughly 34% of workers
              engage in some form of contingent work, and that number continues to rise.
            </p>
            <p>
              The reason is straightforward: the pace of technology change makes it harder than
              ever to maintain every skillset in-house. Staff augmentation closes that gap —
              quickly, flexibly, and without a permanent commitment.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pros & Cons ── */}
      <section className="border-t border-border/50 bg-surface-dark py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="hero-eyebrow mb-3">Weigh it up</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              Pros & cons of staff augmentation.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Pros */}
            <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 p-8">
              <h3 className="mb-6 font-heading text-xl font-bold text-brand-green">Advantages</h3>
              <ul className="space-y-4">
                {pros.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={1.8} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            {/* Cons */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8">
              <h3 className="mb-6 font-heading text-xl font-bold text-rose-400">Limitations</h3>
              <ul className="space-y-4">
                {cons.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/70">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" strokeWidth={1.8} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Types ── */}
      <section className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="hero-eyebrow mb-3">Not one-size-fits-all</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              Types of staff augmentation.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-foreground/50">
              The right model depends on the complexity of the role, the scarcity of the skill,
              and how quickly you need to move.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {types.map((t) => (
              <div
                key={t.title}
                className={`rounded-2xl border ${t.border} bg-surface-elevated/40 p-7`}
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${t.bg} ${t.color}`}>
                  <t.icon className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <h3 className={`font-heading text-xl font-bold ${t.color}`}>{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/55">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Considerations ── */}
      <section className="border-t border-border/50 bg-surface-dark py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="hero-eyebrow mb-3">Before you decide</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              3 things to consider.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-foreground/50">
              Staff augmentation isn't the right model for every scenario.
              These three factors will help you decide.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {considerations.map((c) => (
              <div key={c.n} className="rounded-2xl border border-border/60 bg-surface-elevated/40 p-7">
                <p className={`font-mono text-4xl font-extrabold ${c.color} mb-4 opacity-40`}>{c.n}</p>
                <h3 className={`font-heading text-xl font-bold ${c.color} mb-3`}>{c.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/55">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Misunderstandings ── */}
      <section className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="hero-eyebrow mb-3">Setting the record straight</p>
            <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
              3 common misunderstandings.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {misunderstandings.map((m) => (
              <div
                key={m.title}
                className="rounded-2xl border border-white/[0.07] bg-surface-elevated/40 p-7"
              >
                <p className="mb-3 font-heading text-base font-bold text-foreground/80 italic">{m.title}</p>
                <p className="text-sm leading-relaxed text-foreground/55">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Staff Aug vs Managed Services callout ── */}
      <section className="border-t border-border/50 bg-surface-dark py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                <Users className="h-6 w-6" strokeWidth={1.6} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-brand-blue mb-2">Staff Augmentation</h3>
              <p className="text-sm text-foreground/50 mb-4">Time & materials. You direct the work.</p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" /> You set the priorities and own outcomes</li>
                <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" /> Billed on hours worked</li>
                <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" /> Engineer works within your existing team</li>
                <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" /> Best for ongoing capacity needs</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Globe2 className="h-6 w-6" strokeWidth={1.6} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-violet-400 mb-2">Managed Delivery</h3>
              <p className="text-sm text-foreground/50 mb-4">Outcome-based. We own the deliverable.</p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" /> UmberCore owns scope, timeline, and quality</li>
                <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" /> Billed on milestones or project completion</li>
                <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" /> Dedicated delivery lead included</li>
                <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" /> Best for defined projects with clear outputs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-3">Ready to extend your team?</p>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            Let's find the right model for you.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/50">
            Whether you need one specialist or an embedded team of ten, we'll help you
            scope the right engagement — no pressure, no commitment on day one.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/#get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 font-semibold text-surface-dark transition-all hover:bg-brand-green/90"
            >
              Start a Project
            </a>
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-foreground transition-all hover:bg-white/[0.08]"
            >
              View all services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
