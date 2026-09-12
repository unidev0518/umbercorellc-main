"use client";
import { useEffect, useState } from "react";
import { Toast, useToast } from "@/components/Toast";

interface Settings {
  company_name: string; logo_url: string | null;
  address: string | null; city: string | null; state: string | null; zip: string | null; country: string;
  phone: string | null; email: string | null; website: string | null;
  bank_name: string | null; account_holder: string | null; account_number: string | null;
  routing_number: string | null; iban: string | null; swift_bic: string | null; paypal_email: string | null;
  tax_id: string | null; payment_terms: string; invoice_notes: string | null; invoice_footer: string | null;
}

const BLANK: Settings = {
  company_name: "UmberCore", logo_url: null, address: null, city: null, state: null, zip: null, country: "US",
  phone: null, email: null, website: null, bank_name: null, account_holder: null, account_number: null,
  routing_number: null, iban: null, swift_bic: null, paypal_email: null,
  tax_id: null, payment_terms: "Net 30", invoice_notes: null, invoice_footer: null,
};

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.settings) setForm({ ...BLANK, ...d.settings });
      setLoading(false);
    });
  }, []);

  function set(field: keyof Settings, value: string) {
    setForm(f => ({ ...f, [field]: value || null }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Failed to save", "error");
    else { if (data.settings) setForm({ ...BLANK, ...data.settings }); showToast("Settings saved"); }
    setSaving(false);
  }

  if (loading) return <div className="p-6 text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>;

  return (
    <div className="p-6 max-w-2xl">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}

      <div className="mb-6">
        <h1 className="page-title">Company Settings</h1>
        <p className="page-sub">Used on invoices and client communications</p>
      </div>

      <form onSubmit={save} className="space-y-4">

        {/* Company info */}
        <div className="card p-5 space-y-3">
          <p className="section-title">Company info</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="field-label">Company name *</label>
              <input value={form.company_name} onChange={e => set("company_name", e.target.value)}
                className="input w-full" required />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input type="email" value={form.email || ""} onChange={e => set("email", e.target.value)}
                className="input w-full" placeholder="billing@umbercore.com" />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input value={form.phone || ""} onChange={e => set("phone", e.target.value)}
                className="input w-full" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="col-span-2">
              <label className="field-label">Website</label>
              <input value={form.website || ""} onChange={e => set("website", e.target.value)}
                className="input w-full" placeholder="https://umbercore.com" />
            </div>
            <div>
              <label className="field-label">Tax ID / EIN</label>
              <input value={form.tax_id || ""} onChange={e => set("tax_id", e.target.value)}
                className="input w-full" placeholder="XX-XXXXXXX" />
            </div>
            <div>
              <label className="field-label">Logo URL</label>
              <input value={form.logo_url || ""} onChange={e => set("logo_url", e.target.value)}
                className="input w-full" placeholder="https://…/logo.png" />
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Upload to Supabase Storage, paste URL here</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card p-5 space-y-3">
          <p className="section-title">Business address</p>
          <div>
            <label className="field-label">Street address</label>
            <input value={form.address || ""} onChange={e => set("address", e.target.value)}
              className="input w-full" placeholder="123 Main St, Suite 100" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="field-label">City</label>
              <input value={form.city || ""} onChange={e => set("city", e.target.value)} className="input w-full" placeholder="Los Angeles" />
            </div>
            <div>
              <label className="field-label">State</label>
              <input value={form.state || ""} onChange={e => set("state", e.target.value)} className="input w-full" placeholder="CA" />
            </div>
            <div>
              <label className="field-label">ZIP</label>
              <input value={form.zip || ""} onChange={e => set("zip", e.target.value)} className="input w-full" placeholder="90001" />
            </div>
          </div>
        </div>

        {/* Bank details */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <p className="section-title mb-0">Bank details</p>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--green-bg)", color: "var(--green)", border: "0.5px solid var(--green-border)" }}>
              Shown on invoices
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Clients will see these details to know where to send payment.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Account holder name</label>
              <input value={form.account_holder || ""} onChange={e => set("account_holder", e.target.value)}
                className="input w-full" placeholder="UmberCore LLC" />
            </div>
            <div>
              <label className="field-label">Bank name</label>
              <input value={form.bank_name || ""} onChange={e => set("bank_name", e.target.value)}
                className="input w-full" placeholder="Chase, Wells Fargo…" />
            </div>
            <div>
              <label className="field-label">Account number</label>
              <input value={form.account_number || ""} onChange={e => set("account_number", e.target.value)}
                className="input w-full" placeholder="••••••••" />
            </div>
            <div>
              <label className="field-label">Routing number</label>
              <input value={form.routing_number || ""} onChange={e => set("routing_number", e.target.value)}
                className="input w-full" placeholder="9 digits" />
            </div>
            <div>
              <label className="field-label">IBAN (international)</label>
              <input value={form.iban || ""} onChange={e => set("iban", e.target.value)}
                className="input w-full" placeholder="US…" />
            </div>
            <div>
              <label className="field-label">SWIFT / BIC</label>
              <input value={form.swift_bic || ""} onChange={e => set("swift_bic", e.target.value)}
                className="input w-full" placeholder="CHASUS33" />
            </div>
            <div className="col-span-2">
              <label className="field-label">PayPal email (alternative)</label>
              <input type="email" value={form.paypal_email || ""} onChange={e => set("paypal_email", e.target.value)}
                className="input w-full" placeholder="payments@umbercore.com" />
            </div>
          </div>
        </div>

        {/* Invoice defaults */}
        <div className="card p-5 space-y-3">
          <p className="section-title">Invoice defaults</p>
          <div>
            <label className="field-label">Payment terms</label>
            <select value={form.payment_terms} onChange={e => set("payment_terms", e.target.value)} className="input w-full">
              <option value="Due on receipt">Due on receipt</option>
              <option value="Net 7">Net 7</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
            </select>
          </div>
          <div>
            <label className="field-label">Default invoice notes</label>
            <textarea value={form.invoice_notes || ""} onChange={e => set("invoice_notes", e.target.value)}
              rows={3} className="input resize-none w-full"
              placeholder="Please include the invoice number in your payment reference." />
          </div>
          <div>
            <label className="field-label">Invoice footer</label>
            <input value={form.invoice_footer || ""} onChange={e => set("invoice_footer", e.target.value)}
              className="input w-full" placeholder="Thank you for your business." />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
