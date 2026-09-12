"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Users2, TrendingUp } from "lucide-react";

function useDelayed(ms = 80) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return ready;
}

function FloatCard({ delay, className, children }: { delay: number; className: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const profiles = [
  { initials: "RS", bg: "from-brand-green/30 to-brand-blue/20" },
  { initials: "AM", bg: "from-brand-blue/30 to-violet-500/20" },
  { initials: "TK", bg: "from-violet-500/30 to-brand-green/20" },
];

const gradientStyle = (from: string, to: string) => ({
  background: `linear-gradient(115deg, ${from} 0%, ${to} 100%)`,
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
});

export function HeroVisual() {
  const anim = useDelayed(200);

  if (!anim) {
    return (
      <div className="relative mx-auto w-full max-w-[520px]">
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-elevated/20" style={{ height: 360 }} />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      {/* Outer ambient glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-brand-green/6 blur-3xl" />
      <div className="pointer-events-none absolute -inset-6 right-0 rounded-3xl bg-brand-blue/6 blur-3xl" />

      {/* Main photo card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-elevated">
        <img
          src="/images/hero-team.jpg"
          alt="Team working together"
          className="h-[360px] w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/95 via-surface-dark/40 to-surface-dark/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/60 via-transparent to-transparent" />

        {/* Bottom match bar */}
        <FloatCard delay={0.6} className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.1] bg-surface-dark/80 p-3.5 backdrop-blur-md">
            <div className="flex -space-x-2">
              {profiles.map((p) => (
                <div
                  key={p.initials}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br text-[10px] font-bold text-white ${p.bg}`}
                >
                  {p.initials}
                </div>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-foreground/90">3 engineers matched</p>
              <p className="text-[10px] text-foreground/45">FinTech project · New York</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-brand-green/25 bg-brand-green/10 px-2.5 py-1 text-[10px] font-semibold text-brand-green">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-green" />
              Live
            </span>
          </div>
        </FloatCard>
      </div>

      {/* Top-right: placement speed */}
      <FloatCard delay={0.35} className="absolute -right-4 -top-4 sm:-right-6 sm:-top-5">
        <div className="rounded-xl border border-white/[0.1] bg-surface-elevated/90 p-4 shadow-elevated backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green/15">
              <Clock3 className="h-4 w-4 text-brand-green" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-heading text-xl font-extrabold leading-none" style={gradientStyle("hsl(32 70% 68%)", "hsl(38 42% 62%)")}>
                48h
              </p>
              <p className="mt-0.5 text-[10px] text-foreground/45">Avg. first match</p>
            </div>
          </div>
        </div>
      </FloatCard>

      {/* Left: retention */}
      <FloatCard delay={0.5} className="absolute -left-4 top-1/3 sm:-left-8">
        <div className="rounded-xl border border-white/[0.1] bg-surface-elevated/90 p-4 shadow-elevated backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/15">
              <TrendingUp className="h-4 w-4 text-brand-blue" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-heading text-xl font-extrabold leading-none" style={gradientStyle("hsl(38 42% 62%)", "hsl(28 62% 52%)")}>
                95%
              </p>
              <p className="mt-0.5 text-[10px] text-foreground/45">Client retention</p>
            </div>
          </div>
        </div>
      </FloatCard>

      {/* Right-bottom: engineers placed */}
      <FloatCard delay={0.65} className="absolute -right-4 bottom-24 sm:-right-6">
        <div className="rounded-xl border border-white/[0.1] bg-surface-elevated/90 p-4 shadow-elevated backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green/15">
              <Users2 className="h-4 w-4 text-brand-green" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-heading text-xl font-extrabold leading-none" style={gradientStyle("hsl(22 48% 62%)", "hsl(38 42% 62%)")}>
                200+
              </p>
              <p className="mt-0.5 text-[10px] text-foreground/45">Engineers placed</p>
            </div>
          </div>
        </div>
      </FloatCard>

      {/* Top-left: verified badge */}
      <FloatCard delay={0.3} className="absolute left-4 top-4">
        <div className="flex items-center gap-2 rounded-full border border-brand-green/20 bg-surface-dark/80 px-3 py-1.5 backdrop-blur-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-brand-green" strokeWidth={2} />
          <span className="text-[11px] font-semibold text-foreground/70">Vetted talent only</span>
        </div>
      </FloatCard>
    </div>
  );
}
