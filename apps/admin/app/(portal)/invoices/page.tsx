"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Toast, useToast } from "@/components/Toast";
import { SkeletonTable } from "@/components/Skeleton";
import { ConfirmModal } from "@/components/ConfirmModal";

interface Invoice {
  id: string; invoice_number: string; status: string; amount: number; currency: string;
  issued_date: string | null; due_date: string | null; paid_date: string | null;
  is_auto_generated: boolean;
  project: { id: string; name: string } | null;
  client: { id: string; full_name: string; company_name: string | null } | null;
  items: { id: string; description: string; quantity: number; unit_price: number; amount: number }[];
}

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  draft:     { color: "var(--text-muted)",  bg: "transparent",     border: "var(--border-default)" },
  sent:      { color: "#60a5fa",            bg: "#0d1c2e",         border: "#1e3a5f" },
  paid:      { color: "var(--green)",       bg: "var(--green-bg)", border: "var(--green-border)" },
  overdue:   { color: "#f87171",            bg: "#1c0a0a",         border: "#7f1d1d" },
  cancelled: { color: "var(--text-muted)",  bg: "transparent",     border: "var(--border-subtle)" },
};

const TABS = [
  { key: "needs_review", label: "Needs review",  statusFilter: "draft",     autoOnly: true  },
  { key: "draft",        label: "Draft",          statusFilter: "draft",     autoOnly: false },
  { key: "sent",         label: "Sent",           statusFilter: "sent",      autoOnly: false },
  { key: "overdue",      label: "Overdue",        statusFilter: "overdue",   autoOnly: false },
  { key: "paid",         label: "Paid",           statusFilter: "paid",      autoOnly: false },
  { key: "all",          label: "All",            statusFilter: "",          autoOnly: false },
] as const;

type TabKey = typeof TABS[number]["key"];

function fmtMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function InvoicesPage() {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("needs_review");
  const [showNew, setShowNew] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: string; num: string; action: "send" | "paid" | "delete" } | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/invoices");
    const data = await res.json();
    setAllInvoices(data.invoices || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/invoices", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) { showToast(`Invoice marked as ${status}`); await load(); }
    else showToast("Failed to update", "error");
  }

  async function executeAction() {
    if (!confirmAction) return;
    const { id, action } = confirmAction;
    setConfirmAction(null);
    if (action === "delete") {
      const res = await fetch("/api/invoices", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (res.ok) { showToast("Invoice deleted"); await load(); }
      else showToast("Failed to delete", "error");
    } else {
      const status = action === "send" ? "sent" : "paid";
      await updateStatus(id, status);
    }
  }

  function getTabInvoices(tab: typeof TABS[number]) {
    if (tab.key === "all") return allInvoices;
    if (tab.key === "needs_review") return allInvoices.filter(i => i.status === "draft" && i.is_auto_generated);
    if (tab.key === "draft") return allInvoices.filter(i => i.status === "draft" && !i.is_auto_generated);
    return allInvoices.filter(i => i.status === tab.statusFilter);
  }

  const tabCounts = TABS.reduce((acc, tab) => {
    acc[tab.key] = getTabInvoices(tab).length;
    return acc;
  }, {} as Record<string, number>);

  const invoices = getTabInvoices(TABS.find(t => t.key === activeTab)!);
  const totalPaid = allInvoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const totalOutstanding = allInvoices.filter(i => ["sent","overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0);
  const totalDraft = allInvoices.filter(i => i.status === "draft").reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}
      {showNew && <NewInvoiceModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); showToast("Invoice created"); }} />}
      <ConfirmModal
        open={!!confirmAction}
        title={
          confirmAction?.action === "send" ? `Send invoice ${confirmAction.num}?` :
          confirmAction?.action === "paid" ? `Mark ${confirmAction?.num} as paid?` :
          `Delete invoice ${confirmAction?.num}?`
        }
        description={
          confirmAction?.action === "send" ? "This will mark the invoice as sent. The client will be notified." :
          confirmAction?.action === "paid" ? "This records the payment. Make sure you have received the funds before confirming." :
          "This will permanently delete the invoice. This cannot be undone."
        }
        confirmLabel={
          confirmAction?.action === "send" ? "Send invoice" :
          confirmAction?.action === "paid" ? "Mark as paid" :
          "Delete"
        }
        variant={confirmAction?.action === "delete" ? "danger" : confirmAction?.action === "paid" ? "primary" : "warning"}
        onConfirm={executeAction}
        onCancel={() => setConfirmAction(null)}
      />

      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-sub">Track billing and payments</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary">New invoice</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="stat-card">
          <p className="stat-label">Paid (all time)</p>
          <p className="stat-value" style={{ color: "var(--green)" }}>{fmtMoney(totalPaid)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Outstanding</p>
          <p className="stat-value" style={{ color: "#60a5fa" }}>{fmtMoney(totalOutstanding)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Drafts</p>
          <p className="stat-value" style={{ color: "var(--text-muted)" }}>{fmtMoney(totalDraft)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1" style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
        {TABS.map(tab => {
          const count = tabCounts[tab.key];
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors relative"
              style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}>
              {tab.label}
              {count > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center leading-none"
                  style={tab.key === "needs_review" && count > 0
                    ? { background: "#1a1200", color: "#fbbf24", border: "0.5px solid #422d00" }
                    : tab.key === "overdue" && count > 0
                    ? { background: "#1c0a0a", color: "#f87171", border: "0.5px solid #7f1d1d" }
                    : { background: "var(--bg-card)", color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }}>
                  {count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t" style={{ background: "var(--green)" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Needs-review explainer */}
      {activeTab === "needs_review" && invoices.length > 0 && (
        <div className="flex items-start gap-3 p-3 rounded-lg mb-4" style={{ background: "#1a1200", border: "0.5px solid #422d00" }}>
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs" style={{ color: "#fbbf24" }}>
            These invoices were auto-generated from approved time entries. Review the amounts and click <strong>Send</strong> to deliver them to the client.
          </p>
        </div>
      )}

      {loading ? (
        <SkeletonTable rows={5} cols={8} />
      ) : invoices.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: "var(--border-subtle)" }}>
            <svg className="w-5 h-5" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            {activeTab === "needs_review" ? "No auto-generated invoices" : "No invoices"}
          </p>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            {activeTab === "needs_review"
              ? "Invoices will appear here when billing dates approach on projects with a billing cycle set."
              : "No invoices in this category yet."}
          </p>
          {activeTab !== "needs_review" && (
            <button onClick={() => setShowNew(true)} className="btn-primary text-xs">New invoice</button>
          )}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
                <th className="th">Invoice #</th>
                <th className="th">Project</th>
                <th className="th">Client</th>
                <th className="th">Amount</th>
                <th className="th">Issued</th>
                <th className="th">Due</th>
                <th className="th">Status</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => {
                const st = STATUS_STYLE[inv.status] || STATUS_STYLE.draft;
                const isOverdue = inv.status === "sent" && inv.due_date && new Date(inv.due_date) < new Date();
                return (
                  <tr key={inv.id} className="tr">
                    <td className="td-name">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/invoices/${inv.id}`} className="font-mono text-sm hover:underline" style={{ color: "var(--text-primary)" }}>
                          {inv.invoice_number}
                        </Link>
                        {inv.is_auto_generated && (
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: "#fbbf24", background: "#1a1200", border: "0.5px solid #422d00", fontSize: 10 }}>Auto</span>
                        )}
                      </div>
                    </td>
                    <td className="td" style={{ fontSize: 13 }}>{inv.project?.name || "—"}</td>
                    <td className="td" style={{ fontSize: 13 }}>
                      {inv.client ? (inv.client.company_name || inv.client.full_name) : "—"}
                    </td>
                    <td className="td">
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {fmtMoney(inv.amount, inv.currency)}
                      </span>
                    </td>
                    <td className="td text-xs" style={{ color: "var(--text-muted)" }}>{fmtDate(inv.issued_date)}</td>
                    <td className="td text-xs" style={{ color: isOverdue ? "#f87171" : "var(--text-muted)" }}>
                      {fmtDate(inv.due_date)}{isOverdue && " !"}
                    </td>
                    <td className="td">
                      <span className="text-xs font-medium px-2 py-0.5 rounded capitalize"
                        style={{ background: st.bg, color: st.color, border: `0.5px solid ${st.border}` }}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="td text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {inv.status === "draft" && (
                          <button onClick={() => setConfirmAction({ id: inv.id, num: inv.invoice_number, action: "send" })}
                            className="text-xs transition-colors" style={{ color: "#60a5fa" }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                            Send
                          </button>
                        )}
                        {(inv.status === "sent" || inv.status === "overdue") && (
                          <button onClick={() => setConfirmAction({ id: inv.id, num: inv.invoice_number, action: "paid" })}
                            className="text-xs transition-colors" style={{ color: "var(--green)" }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                            Mark paid
                          </button>
                        )}
                        <a href={`/api/invoices/${inv.id}/pdf`} target="_blank" rel="noopener"
                          className="text-xs transition-colors" style={{ color: "var(--text-muted)" }}>
                          View PDF
                        </a>
                        {inv.status === "draft" && (
                          <button onClick={() => setConfirmAction({ id: inv.id, num: inv.invoice_number, action: "delete" })}
                            className="text-xs transition-colors" style={{ color: "var(--text-muted)" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#fca5a5")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── New Invoice Modal ──────────────────────────────────────────────────────────
interface LineItem { description: string; quantity: string; unit_price: string; }

function NewInvoiceModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [projects, setProjects] = useState<{ id: string; name: string; client_rate: number | null; client: { id: string; full_name: string; company_name: string | null } | null }[]>([]);
  const [form, setForm] = useState({ project_id: "", invoice_number: "", status: "draft", issued_date: "", due_date: "", notes: "" });
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: "1", unit_price: "" }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => {
      setProjects((d.projects || []).map((p: any) => ({ id: p.id, name: p.name, client: p.client, client_rate: p.client_rate })));
    });
    const year = new Date().getFullYear();
    const rand = String(Math.floor(Math.random() * 9000) + 1000);
    setForm(f => ({ ...f, invoice_number: `UMC-${year}-${rand}` }));
  }, []);

  // Auto-fill rate when project changes
  function onProjectChange(id: string) {
    setForm(f => ({ ...f, project_id: id }));
    const proj = projects.find(p => p.id === id);
    if (proj?.client_rate) {
      setItems([{ description: "Development services", quantity: "1", unit_price: proj.client_rate.toString() }]);
    }
  }

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.unit_price) || 0), 0);
  const selectedProject = projects.find(p => p.id === form.project_id);
  const clientId = selectedProject?.client?.id || "";

  function setItem(i: number, field: keyof LineItem, value: string) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: value } : it));
  }

  async function submit() {
    if (!form.project_id || !form.invoice_number || subtotal <= 0) return;
    setSaving(true);
    const res = await fetch("/api/invoices", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form, client_id: clientId || null, amount: subtotal, subtotal,
        items: items.filter(it => it.description && parseFloat(it.unit_price) > 0).map(it => ({
          description: it.description, quantity: parseFloat(it.quantity) || 1, unit_price: parseFloat(it.unit_price),
        })),
      }),
    });
    if (res.ok) onCreated();
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="card p-6 w-full max-w-lg mx-4 overflow-y-auto" style={{ maxHeight: "90vh" }}>
        <div className="flex items-center justify-between mb-5">
          <p className="section-title">New invoice</p>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Project *</label>
              <select value={form.project_id} onChange={e => onProjectChange(e.target.value)} className="input text-sm w-full">
                <option value="">Select project…</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Invoice # *</label>
              <input value={form.invoice_number} onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))} className="input text-sm w-full font-mono" />
            </div>
          </div>

          {selectedProject?.client && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Client: {selectedProject.client.company_name || selectedProject.client.full_name}
              {selectedProject.client_rate && <span style={{ color: "var(--green)" }}> · ${selectedProject.client_rate}/hr</span>}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Issue date</label>
              <input type="date" value={form.issued_date} onChange={e => setForm(f => ({ ...f, issued_date: e.target.value }))} className="input text-sm w-full" />
            </div>
            <div>
              <label className="field-label">Due date</label>
              <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className="input text-sm w-full" />
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="field-label mb-0">Line items</label>
              <button onClick={() => setItems(i => [...i, { description: "", quantity: "1", unit_price: "" }])}
                className="text-xs" style={{ color: "var(--green)" }}>+ Add line</button>
            </div>
            <div className="space-y-1.5">
              <div className="grid text-xs px-1 mb-1" style={{ gridTemplateColumns: "1fr 60px 80px 24px", color: "var(--text-muted)" }}>
                <span>Description</span><span>Qty</span><span>Unit price</span><span></span>
              </div>
              {items.map((it, i) => (
                <div key={i} className="grid gap-1.5 items-center" style={{ gridTemplateColumns: "1fr 60px 80px 24px" }}>
                  <input value={it.description} onChange={e => setItem(i, "description", e.target.value)} placeholder="Service description" className="input text-xs" />
                  <input type="number" value={it.quantity} onChange={e => setItem(i, "quantity", e.target.value)} min="0" step="0.5" className="input text-xs text-center" />
                  <input type="number" value={it.unit_price} onChange={e => setItem(i, "unit_price", e.target.value)} min="0" step="0.01" placeholder="0.00" className="input text-xs" />
                  <button onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))} disabled={items.length === 1}
                    className="text-center" style={{ color: "var(--text-muted)", fontSize: 16, opacity: items.length === 1 ? 0.3 : 1 }}>×</button>
                </div>
              ))}
            </div>
            <div className="text-right mt-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Total: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(subtotal)}
            </div>
          </div>

          <div>
            <label className="field-label">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="input resize-none w-full text-sm" placeholder="Payment terms, references…" />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={submit} disabled={saving || !form.project_id || !form.invoice_number || subtotal <= 0} className="btn-primary">
            {saving ? "Creating…" : "Create invoice"}
          </button>
          <button onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  );
}
