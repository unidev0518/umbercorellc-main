"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface LinkInfo { role: "client" | "developer"; email: string; }

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);
  const [tokenError, setTokenError] = useState("");
  const [form, setForm] = useState({ full_name: "", password: "", confirm_password: "", company_name: "", job_title: "", skills: "", availability: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) { setTokenError("No invitation token provided."); return; }
    fetch(`/api/auth/validate-token?token=${token}`).then(r => r.json()).then(d => {
      if (d.error) setTokenError(d.error);
      else setLinkInfo({ role: d.role, email: d.email });
    });
  }, [token]);

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm_password) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, email: linkInfo!.email, password: form.password, full_name: form.full_name, company_name: form.company_name, job_title: form.job_title, skills: form.skills, availability: form.availability }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return; }
    router.push("/login?registered=1");
  }

  if (tokenError) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-page)" }}>
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#1a0808", border: "1px solid #7f1d1d" }}>
          <svg className="w-6 h-6" fill="none" stroke="#fca5a5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <h1 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Invalid invitation</h1>
        <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>{tokenError}</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Contact your UmberCore account manager for a new link.</p>
      </div>
    </div>
  );

  if (!linkInfo) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Validating invitation…</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg-page)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            <span style={{ color: "var(--green)" }}>Umber</span>Core
          </div>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Create your account</p>
        </div>

        {/* Invitation badge */}
        <div className="card p-4 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--green-bg)", border: "1px solid var(--green-border)" }}>
            <svg className="w-4 h-4" fill="none" stroke="#c4813a" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{linkInfo.email}</p>
            <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{linkInfo.role} invitation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Full name *</label>
            <input type="text" value={form.full_name} onChange={e => set("full_name", e.target.value)} required className="input" placeholder="Jane Smith" />
          </div>

          {linkInfo.role === "client" && <>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Company name</label>
              <input type="text" value={form.company_name} onChange={e => set("company_name", e.target.value)} className="input" placeholder="Acme Corp" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Job title</label>
              <input type="text" value={form.job_title} onChange={e => set("job_title", e.target.value)} className="input" placeholder="VP of Engineering" />
            </div>
          </>}

          {linkInfo.role === "developer" && <>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Skills</label>
              <input type="text" value={form.skills} onChange={e => set("skills", e.target.value)} className="input" placeholder="React, Node.js, TypeScript…" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Availability</label>
              <select value={form.availability} onChange={e => set("availability", e.target.value)} className="input">
                <option value="">Select…</option>
                <option value="immediate">Immediate</option>
                <option value="2_weeks">Within 2 weeks</option>
                <option value="1_month">Within 1 month</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </>}

          <div className="pt-2" style={{ borderTop: "0.5px solid var(--border-subtle)" }}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password *</label>
                <input type="password" value={form.password} onChange={e => set("password", e.target.value)} required className="input" placeholder="At least 8 characters" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Confirm password *</label>
                <input type="password" value={form.confirm_password} onChange={e => set("confirm_password", e.target.value)} required className="input" placeholder="••••••••" />
              </div>
            </div>
          </div>

          {error && <p className="error-box">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
          Already have an account? <a href="/login" style={{ color: "var(--green)" }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}
