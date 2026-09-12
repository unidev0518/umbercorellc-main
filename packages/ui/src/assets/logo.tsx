import { cn } from "../lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Mark */}
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-green to-brand-blue opacity-25 blur-lg" />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-green via-brand-blue to-brand-blue shadow-glow">
          <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none">
            <polygon
              points="10,2 18,6.5 18,13.5 10,18 2,13.5 2,6.5"
              fill="none"
              stroke="hsl(24 22% 8%)"
              strokeWidth="1.5"
            />
            <polygon
              points="10,5.5 15,8.25 15,13.75 10,16.5 5,13.75 5,8.25"
              fill="hsl(24 22% 8% / 0.5)"
              stroke="hsl(24 22% 8%)"
              strokeWidth="1"
            />
            <circle cx="10" cy="10" r="2" fill="hsl(24 22% 8%)" />
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col gap-[3px] leading-none">
        <span
          className="font-heading text-[1.2rem] font-extrabold tracking-[-0.03em]"
          style={{
            background: "linear-gradient(110deg, hsl(32 70% 74%) 0%, hsl(28 62% 52%) 42%, hsl(38 48% 64%) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          UmberCore
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
          Technology Agency
        </span>
      </div>
    </div>
  );
}
