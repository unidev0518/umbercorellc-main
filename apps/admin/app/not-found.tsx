import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg-page)" }}>
      <div className="text-center max-w-sm px-6">
        <p className="text-6xl font-bold mb-4" style={{ color: "var(--border-default)", letterSpacing: "-0.05em" }}>404</p>
        <h1 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Page not found</h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--green-bg)", border: "0.5px solid var(--green-border)", color: "var(--green)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  );
}
