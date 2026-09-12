import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-green/60 mb-4">
        404
      </p>
      <h1 className="font-heading text-5xl font-extrabold tracking-[-0.03em] text-foreground sm:text-6xl">
        Page not found.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg text-foreground/50">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-6 py-3 font-semibold text-surface-dark transition-all hover:bg-brand-green/90"
        >
          Back to home
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 font-semibold text-foreground transition-all hover:bg-white/[0.08]"
        >
          View services
        </Link>
      </div>
    </div>
  );
}
