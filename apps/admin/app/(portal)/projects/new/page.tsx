"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Client { id: string; full_name: string; company_name: string | null; }
interface Developer { id: string; full_name: string; }
interface AdminUser { id: string; full_name: string; }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="section-title mb-3">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}{required && <span style={{ color: "#f87171" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function RadioGroup({ name, value, options, onChange }: { name: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: value === o.value ? "var(--green-bg)" : "transparent",
            border: `0.5px solid ${value === o.value ? "var(--green-border)" : "var(--border-default)"}`,
            color: value === o.value ? "var(--green)" : "var(--text-muted)",
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function NewProjectPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", client_id: "", developer_id: "", description: "",
    start_date: "", end_date: "",
    billing_model: "", contract_value: "",
    developer_hourly_rate: "", developer_hours_allocated: "",
    account_manager_id: "",
  });

  useEffect(() => {
    fetch("/api/portal-users?role=client").then(r => r.json()).then(d => setClients(d.users || []));
    fetch("/api/portal-users?role=developer").then(r => r.json()).then(d => setDevelopers(d.users || []));
    fetch("/api/admin-users").then(r => r.json()).then(d => setAdmins(d.admins || []));
  }, []);

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const payload = {
      ...form,
      client_id: form.client_id || null,
      developer_id: form.developer_id || null,
      account_manager_id: form.account_manager_id || null,
      billing_model: form.billing_model || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      contract_value: form.contract_value ? parseFloat(form.contract_value) : null,
      developer_hourly_rate: form.developer_hourly_rate ? parseFloat(form.developer_hourly_rate) : null,
      developer_hours_allocated: form.developer_hours_allocated ? parseInt(form.developer_hours_allocated) : null,
    };
    const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to create project"); setLoading(false); return; }
    router.push(`/projects/${data.project.id}`);
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm mb-3 transition-colors" style={{ color: "var(--text-muted)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Projects
        </Link>
        <h1 className="page-title">New project</h1>
        <p className="page-sub">Fill in the details to create a new client engagement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basics */}
        <div className="card p-5">
          <Section title="Basics">
            <Field label="Project name" required>
              <input type="text" value={form.name} onChange={e => set("name", e.target.value)} required className="input" placeholder="e.g. AI Backend Integration" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Client">
                <select value={form.client_id} onChange={e => set("client_id", e.target.value)} className="input">
                  <option value="">No client assigned</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}{c.company_name ? ` — ${c.company_name}` : ""}</option>
                  ))}
                </select>
              </Field>
              <Field label="Developer">
                <select value={form.developer_id} onChange={e => set("developer_id", e.target.value)} className="input">
                  <option value="">No developer assigned</option>
                  {developers.map(d => <option key={d.id} value={d.id}>{d.full_name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Description">
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className="input resize-none" placeholder="Brief description of the engagement" />
            </Field>
          </Section>
        </div>

        {/* Billing */}
        <div className="card p-5">
          <Section title="Billing">
            <Field label="Billing model">
              <RadioGroup name="billing_model" value={form.billing_model}
                options={[{ value: "hourly", label: "Hourly" }, { value: "fixed", label: "Fixed" }, { value: "monthly_retainer", label: "Monthly retainer" }]}
                onChange={v => set("billing_model", v)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={form.billing_model === "hourly" ? "Client rate ($/hr)" : form.billing_model === "monthly_retainer" ? "Monthly price (USD)" : "Project price (USD)"}>
                <input type="number" min="0" step="0.01" value={form.contract_value} onChange={e => set("contract_value", e.target.value)} className="input" placeholder="0.00" />
              </Field>
              <Field label="Developer rate ($/hr)">
                <input type="number" min="0" step="0.01" value={form.developer_hourly_rate} onChange={e => set("developer_hourly_rate", e.target.value)} className="input" placeholder="0.00" />
              </Field>
              <Field label="Hours allocated">
                <input type="number" min="0" value={form.developer_hours_allocated} onChange={e => set("developer_hours_allocated", e.target.value)} className="input" placeholder="0" />
              </Field>
              <Field label="Account manager">
                <select value={form.account_manager_id} onChange={e => set("account_manager_id", e.target.value)} className="input">
                  <option value="">Unassigned</option>
                  {admins.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                </select>
              </Field>
            </div>
          </Section>
        </div>

        {/* Timeline */}
        <div className="card p-5">
          <Section title="Timeline">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start date">
                <input type="date" value={form.start_date} onChange={e => set("start_date", e.target.value)} className="input" />
              </Field>
              <Field label="End date">
                <input type="date" value={form.end_date} onChange={e => set("end_date", e.target.value)} className="input" />
              </Field>
            </div>
          </Section>
        </div>

        {error && <p className="error-box">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">{loading ? "Creating…" : "Create project"}</button>
          <Link href="/projects" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
