"use client";
import { useEffect, useState } from "react";
import { Toast, useToast } from "@/components/Toast";

interface PaymentMethod {
  id: string;
  label: string;
  payment_type: string;
  percent: number;
  bank_name: string | null; account_holder_name: string | null;
  account_number: string | null; routing_number: string | null;
  iban: string | null; swift_bic: string | null;
  paypal_email: string | null; wise_email: string | null; other_details: string | null;
}

interface Profile {
  id: string; full_name: string; email: string; role: string;
  phone: string | null; location: string | null; linkedin_url: string | null; bio: string | null;
  company_name: string | null; job_title: string | null;
  skills: string | null; availability: string | null;
}

const AVAILABILITY_OPTIONS = [
  { value: "immediate", label: "Immediately" },
  { value: "2_weeks", label: "In 2 weeks" },
  { value: "1_month", label: "In 1 month" },
  { value: "flexible", label: "Flexible" },
];

const PAYMENT_TYPES = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "wise", label: "Wise" },
  { value: "paypal", label: "PayPal" },
  { value: "other", label: "Other" },
];

const TYPE_ICONS: Record<string, string> = {
  bank_transfer: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  wise: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  paypal: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  other: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
};

const BLANK_METHOD = {
  label: "", payment_type: "bank_transfer", percent: 100,
  bank_name: "", account_holder_name: "", account_number: "",
  routing_number: "", iban: "", swift_bic: "",
  paypal_email: "", wise_email: "", other_details: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({ ...BLANK_METHOD });
  const [addingMethod, setAddingMethod] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PaymentMethod>>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(d => {
      if (d.profile) { setProfile(d.profile); setForm(d.profile); }
      setLoading(false);
    });
    fetch("/api/payment-methods").then(r => r.json()).then(d => {
      setMethods(d.methods || []);
    });
  }, []);

  function set(field: keyof Profile, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Failed to save", "error");
    else { setProfile(data.profile); setForm(data.profile); showToast("Profile saved"); }
    setSaving(false);
  }

  async function addMethod(e: React.FormEvent) {
    e.preventDefault();
    setAddingMethod(true);
    const res = await fetch("/api/payment-methods", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMethod),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Failed to add", "error");
    else {
      setMethods(m => [...m, data.method]);
      setNewMethod({ ...BLANK_METHOD });
      setShowAddMethod(false);
      showToast("Payment method added");
    }
    setAddingMethod(false);
  }

  async function deleteMethod(id: string) {
    if (!confirm("Remove this payment method?")) return;
    setDeletingId(id);
    const res = await fetch("/api/payment-methods", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) showToast("Failed to remove", "error");
    else { setMethods(m => m.filter(x => x.id !== id)); showToast("Removed"); }
    setDeletingId(null);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    setSavingEdit(true);
    const res = await fetch("/api/payment-methods", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...editForm }),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Failed to save", "error");
    else {
      setMethods(m => m.map(x => x.id === editingId ? data.method : x));
      setEditingId(null);
      showToast("Updated");
    }
    setSavingEdit(false);
  }

  const totalPercent = methods.reduce((s, m) => s + Number(m.percent), 0);
  const remaining = 100 - totalPercent;

  if (loading) return <div className="p-6 text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>;
  if (!profile) return null;

  const isClient = profile.role === "client";
  const isDev = profile.role === "developer";
  const initials = profile.full_name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="p-6 max-w-xl">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}

      <div className="mb-6">
        <h1 className="page-title">Profile</h1>
        <p className="page-sub">Manage your account information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6 card p-5">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
          style={{ background: "var(--green-bg)", border: "2px solid var(--green-border)", color: "var(--green)" }}>
          {initials}
        </div>
        <div>
          <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{profile.full_name}</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{profile.email}</p>
          <p className="text-xs mt-0.5 capitalize font-medium" style={{ color: "var(--green)" }}>{profile.role}</p>
        </div>
      </div>

      <form onSubmit={save} className="space-y-4">
        {/* Basic info */}
        <div className="card p-5 space-y-3">
          <p className="section-title">Basic info</p>
          <div>
            <label className="field-label">Full name</label>
            <input value={form.full_name || ""} onChange={e => set("full_name", e.target.value)} className="input w-full" required />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input value={profile.email} disabled className="input w-full opacity-50 cursor-not-allowed" />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Email cannot be changed here</p>
          </div>
          <div>
            <label className="field-label">Phone</label>
            <input value={form.phone || ""} onChange={e => set("phone", e.target.value)} className="input w-full" placeholder="+1 555 000 0000" />
          </div>
          <div>
            <label className="field-label">Location</label>
            <input value={form.location || ""} onChange={e => set("location", e.target.value)} className="input w-full" placeholder="City, Country" />
          </div>
        </div>

        {isClient && (
          <div className="card p-5 space-y-3">
            <p className="section-title">Company</p>
            <div>
              <label className="field-label">Company name</label>
              <input value={form.company_name || ""} onChange={e => set("company_name", e.target.value)} className="input w-full" placeholder="Acme Corp" />
            </div>
            <div>
              <label className="field-label">Job title</label>
              <input value={form.job_title || ""} onChange={e => set("job_title", e.target.value)} className="input w-full" placeholder="CTO, VP Engineering…" />
            </div>
          </div>
        )}

        {isDev && (
          <div className="card p-5 space-y-3">
            <p className="section-title">Professional</p>
            <div>
              <label className="field-label">Skills</label>
              <input value={form.skills || ""} onChange={e => set("skills", e.target.value)} className="input w-full" placeholder="React, Node.js, Python…" />
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Comma-separated list</p>
            </div>
            <div>
              <label className="field-label">Availability</label>
              <select value={form.availability || ""} onChange={e => set("availability", e.target.value)} className="input w-full">
                <option value="">Not specified</option>
                {AVAILABILITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">LinkedIn</label>
              <input value={form.linkedin_url || ""} onChange={e => set("linkedin_url", e.target.value)} className="input w-full" placeholder="https://linkedin.com/in/yourname" />
            </div>
          </div>
        )}

        <div className="card p-5">
          <p className="section-title mb-3">Bio</p>
          <textarea value={form.bio || ""} onChange={e => set("bio", e.target.value)} rows={4}
            className="input resize-none w-full"
            placeholder={isClient ? "Tell us about your company…" : "Your background and expertise…"} />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      {/* Payment methods — developers only */}
      {isDev && (
        <div className="mt-6 space-y-3">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <p className="section-title mb-0">Payment methods</p>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--green-bg)", color: "var(--green)", border: "0.5px solid var(--green-border)" }}>
                  Private
                </span>
              </div>
              {remaining > 0 && (
                <button onClick={() => { setShowAddMethod(v => !v); setNewMethod({ ...BLANK_METHOD, percent: remaining }); }}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                  style={{ background: "var(--green-bg)", color: "var(--green)", border: "0.5px solid var(--green-border)" }}>
                  + Add method
                </button>
              )}
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Split your payment across multiple methods. Must total 100%.
            </p>

            {/* Percent bar */}
            {methods.length > 0 && (
              <div className="mb-4">
                <div className="flex rounded-full overflow-hidden h-2 mb-1.5" style={{ background: "var(--border-subtle)" }}>
                  {methods.map((m, i) => (
                    <div key={m.id} className="h-full transition-all"
                      style={{
                        width: `${m.percent}%`,
                        background: ["var(--green)", "#60a5fa", "#a78bfa", "#fb923c"][i % 4],
                      }} />
                  ))}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {methods.map((m, i) => (
                    <div key={m.id} className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: ["var(--green)", "#60a5fa", "#a78bfa", "#fb923c"][i % 4] }} />
                      {m.label || m.payment_type} — {m.percent}%
                    </div>
                  ))}
                  {remaining > 0 && (
                    <span className="text-xs" style={{ color: "#f87171" }}>
                      {remaining}% unallocated
                    </span>
                  )}
                </div>
              </div>
            )}

            {methods.length === 0 && !showAddMethod && (
              <p className="text-sm py-2" style={{ color: "var(--text-muted)" }}>No payment methods added yet.</p>
            )}

            {/* Method cards */}
            <div className="space-y-3">
              {methods.map((m, i) => (
                <div key={m.id} className="rounded-xl p-4" style={{ border: "0.5px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
                  {editingId === m.id ? (
                    <form onSubmit={saveEdit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="field-label">Label</label>
                          <input value={editForm.label || ""} onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))}
                            className="input w-full text-sm" placeholder="e.g. Main bank" />
                        </div>
                        <div>
                          <label className="field-label">Percent (%)</label>
                          <input type="number" min={1} max={100} value={editForm.percent ?? m.percent}
                            onChange={e => setEditForm(f => ({ ...f, percent: Number(e.target.value) }))}
                            className="input w-full text-sm" />
                        </div>
                      </div>
                      <PaymentFields
                        type={editForm.payment_type || m.payment_type}
                        values={editForm}
                        onChange={(k, v) => setEditForm(f => ({ ...f, [k]: v }))}
                      />
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setEditingId(null)}
                          className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }}>
                          Cancel
                        </button>
                        <button type="submit" disabled={savingEdit} className="btn-primary text-xs px-3 py-1.5">
                          {savingEdit ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: ["var(--green-bg)", "#60a5fa18", "#a78bfa18", "#fb923c18"][i % 4], border: "0.5px solid var(--border-subtle)" }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            style={{ color: ["var(--green)", "#60a5fa", "#a78bfa", "#fb923c"][i % 4] }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={TYPE_ICONS[m.payment_type] || TYPE_ICONS.other} />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                              {m.label || PAYMENT_TYPES.find(t => t.value === m.payment_type)?.label}
                            </p>
                            <span className="text-xs px-1.5 py-0.5 rounded font-semibold"
                              style={{ background: ["var(--green-bg)", "#60a5fa18", "#a78bfa18", "#fb923c18"][i % 4],
                                color: ["var(--green)", "#60a5fa", "#a78bfa", "#fb923c"][i % 4] }}>
                              {m.percent}%
                            </span>
                          </div>
                          <p className="text-xs mt-0.5 capitalize" style={{ color: "var(--text-muted)" }}>
                            {m.payment_type.replace(/_/g, " ")}
                            {m.account_holder_name && ` · ${m.account_holder_name}`}
                            {m.paypal_email && ` · ${m.paypal_email}`}
                            {m.wise_email && ` · ${m.wise_email}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => { setEditingId(m.id); setEditForm(m); }}
                          className="text-xs px-2 py-1 rounded transition-colors" style={{ color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }}>
                          Edit
                        </button>
                        <button onClick={() => deleteMethod(m.id)} disabled={deletingId === m.id}
                          className="text-xs px-2 py-1 rounded transition-colors" style={{ color: "#f87171", border: "0.5px solid var(--border-subtle)" }}>
                          {deletingId === m.id ? "…" : "Remove"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add method form */}
            {showAddMethod && (
              <form onSubmit={addMethod} className="mt-3 rounded-xl p-4 space-y-3"
                style={{ border: "0.5px solid var(--green-border)", background: "var(--green-bg)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--green)" }}>New payment method</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="field-label">Label</label>
                    <input value={newMethod.label} onChange={e => setNewMethod(m => ({ ...m, label: e.target.value }))}
                      className="input w-full text-sm" placeholder="e.g. Main bank" />
                  </div>
                  <div>
                    <label className="field-label">Percent (%) — {remaining}% remaining</label>
                    <input type="number" min={1} max={remaining} value={newMethod.percent}
                      onChange={e => setNewMethod(m => ({ ...m, percent: Number(e.target.value) }))}
                      className="input w-full text-sm" required />
                  </div>
                </div>
                <div>
                  <label className="field-label">Type</label>
                  <select value={newMethod.payment_type} onChange={e => setNewMethod(m => ({ ...m, payment_type: e.target.value }))}
                    className="input w-full text-sm">
                    {PAYMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <PaymentFields
                  type={newMethod.payment_type}
                  values={newMethod}
                  onChange={(k, v) => setNewMethod(m => ({ ...m, [k]: v }))}
                />
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddMethod(false)}
                    className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={addingMethod} className="btn-primary text-xs px-3 py-1.5">
                    {addingMethod ? "Adding…" : "Add method"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentFields({ type, values, onChange }: {
  type: string;
  values: Record<string, any>;
  onChange: (key: string, value: string) => void;
}) {
  if (type === "bank_transfer") return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="field-label">Account holder name</label>
          <input value={values.account_holder_name || ""} onChange={e => onChange("account_holder_name", e.target.value)}
            className="input w-full text-sm" placeholder="Full legal name" />
        </div>
        <div>
          <label className="field-label">Bank name</label>
          <input value={values.bank_name || ""} onChange={e => onChange("bank_name", e.target.value)}
            className="input w-full text-sm" placeholder="Chase, Wells Fargo…" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="field-label">Account number</label>
          <input value={values.account_number || ""} onChange={e => onChange("account_number", e.target.value)}
            className="input w-full text-sm" placeholder="••••••••" />
        </div>
        <div>
          <label className="field-label">Routing number</label>
          <input value={values.routing_number || ""} onChange={e => onChange("routing_number", e.target.value)}
            className="input w-full text-sm" placeholder="9 digits" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="field-label">IBAN</label>
          <input value={values.iban || ""} onChange={e => onChange("iban", e.target.value)}
            className="input w-full text-sm" placeholder="GB29 NWBK…" />
        </div>
        <div>
          <label className="field-label">SWIFT / BIC</label>
          <input value={values.swift_bic || ""} onChange={e => onChange("swift_bic", e.target.value)}
            className="input w-full text-sm" placeholder="NWBKGB2L" />
        </div>
      </div>
    </div>
  );
  if (type === "wise") return (
    <div>
      <label className="field-label">Wise email</label>
      <input type="email" value={values.wise_email || ""} onChange={e => onChange("wise_email", e.target.value)}
        className="input w-full text-sm" placeholder="your@email.com" />
    </div>
  );
  if (type === "paypal") return (
    <div>
      <label className="field-label">PayPal email</label>
      <input type="email" value={values.paypal_email || ""} onChange={e => onChange("paypal_email", e.target.value)}
        className="input w-full text-sm" placeholder="your@paypal.com" />
    </div>
  );
  return (
    <div>
      <label className="field-label">Details</label>
      <input value={values.other_details || ""} onChange={e => onChange("other_details", e.target.value)}
        className="input w-full text-sm" placeholder="Payment instructions…" />
    </div>
  );
}
