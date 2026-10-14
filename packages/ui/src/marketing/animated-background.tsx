"use client";

export function AnimatedBackground({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isLight = variant !== "dark";
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? "radial-gradient(at 30% 20%, hsl(199 88% 62% / 0.16) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(207 70% 70% / 0.14) 0px, transparent 46%)"
            : undefined,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: isLight ? 0.35 : 0.04,
          backgroundImage: `linear-gradient(hsl(207 45% 78% / 0.35) 1px, transparent 1px), linear-gradient(90deg, hsl(207 45% 78% / 0.35) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-brand-green/15 blur-[100px] animate-float" />
      <div className="absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-brand-blue/12 blur-[100px] animate-float-delayed" />
      <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-danger/5 blur-[80px] animate-pulse-glow" />
    </div>
  );
}
