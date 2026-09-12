"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toast, useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";

type ProjectStatus = "active" | "paused" | "completed" | "cancelled";

interface DeveloperUser { id: string; full_name: string; email: string; }
interface Client { id: string; full_name: string; company_name: string | null; email: string; }
interface AdminUser { id: string; full_name: string; email: string; }
interface Project {
  id: string; name: string; status: ProjectStatus; description: string | null;
  notes: string | null; start_date: string | null; end_date: string | null;
  client: Client | null;
  developer: DeveloperUser | null;
  developer_hourly_rate: number | null;
  developer_hours_allocated: number | null;
  billing_model: string | null;
  contract_value: number | null;
  billing_frequency: string | null; billing_day_1: number | null; billing_day_2: number | null; billing_anchor_date: string | null;
  account_manager: AdminUser | null;
}

const BILLING_LABEL: Record<string, string> = { hourly: "Hourly", fixed: "Fixed price", monthly_retainer: "Monthly retainer" };
const PRICE_LABEL: Record<string, string> = { hourly: "Client rate ($/hr)", fixed: "Project price", monthly_retainer: "Monthly price" };

export default function ProjectDetailClient({ project: initial }: { project: Project }) {
  const router = useRouter();
  const [project, setProject] = useState(initial);
  const [notes, setNotes] = useState(initial.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const { toast, showToast, clearToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<{ id: string; full_name: string; company_name: string | null }[]>([]);
  const [developers, setDevelopers] = useState<{ id: string; full_name: string }[]>([]);
  const [admins, setAdmins] = useState<{ id: string; full_name: string }[]>([]);

  function openEdit() {
    setEditForm({
      name: project.name,
      description: project.description || "",
      billing_model: project.billing_model || "",
      billing_frequency: project.billing_frequency || "",
      billing_day_1: project.billing_day_1 ?? "",
      billing_day_2: project.billing_day_2 ?? "",
      billing_anchor_date: project.billing_anchor_date || "",
      contract_value: project.contract_value ?? "",
      developer_hourly_rate: project.developer_hourly_rate ?? "",
      developer_hours_allocated: project.developer_hours_allocated ?? "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      client_id: project.client?.id || "",
      developer_id: project.developer?.id || "",
      account_manager_id: project.account_manager?.id || "",
    });
    if (clients.length === 0) {
      fetch("/api/portal-users?role=client").then(r => r.json()).then(d => setClients(d.users || []));
      fetch("/api/portal-users?role=developer").then(r => r.json()).then(d => setDevelopers(d.users || []));
      fetch("/api/admin-users").then(r => r.json()).then(d => setAdmins(d.admins || []));
    }
    setEditing(true);
  }

  async function saveEdit() {
    setSaving(true);
    const payload: Record<string, any> = { ...editForm };
    if (!payload.billing_model) payload.billing_model = null;
    if (!payload.billing_frequency) payload.billing_frequency = null;
    if (payload.billing_day_1 === "" || payload.billing_day_1 === null) payload.billing_day_1 = null;
    else payload.billing_day_1 = parseInt(payload.billing_day_1);
    if (payload.billing_day_2 === "" || payload.billing_day_2 === null) payload.billing_day_2 = null;
    else payload.billing_day_2 = parseInt(payload.billing_day_2);
    if (!payload.billing_anchor_date) payload.billing_anchor_date = null;
    if (!payload.client_id) payload.client_id = null;
    if (!payload.developer_id) payload.developer_id = null;
    if (!payload.account_manager_id) payload.account_manager_id = null;
    if (!payload.start_date) payload.start_date = null;
    if (!payload.end_date) payload.end_date = null;
    payload.contract_value = payload.contract_value !== "" ? parseFloat(payload.contract_value) : null;
    payload.developer_hourly_rate = payload.developer_hourly_rate !== "" ? parseFloat(payload.developer_hourly_rate) : null;
    payload.developer_hours_allocated = payload.developer_hours_allocated !== "" ? parseInt(payload.developer_hours_allocated) : null;
    const ok = await patch(payload, "Project updated");
    setSaving(false);
    if (ok) setEditing(false);
  }

  interface TimeEntry { developer_id: string; hours: number; }
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  useEffect(() => {
    fetch(`/api/time-entries?project_id=${initial.id}`).then(r => r.json()).then(d => setTimeEntries(d.entries || []));
  }, [initial.id]);

  interface InvoiceSummary { id: string; invoice_number: string; status: string; amount: number; currency: string; due_date: string | null; }
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  useEffect(() => {
    fetch(`/api/invoices?project_id=${initial.id}`).then(r => r.json()).then(d => setInvoices(d.invoices || []));
  }, [initial.id]);

  const INV_STATUS_COLOR: Record<string, string> = { draft: "var(--text-muted)", sent: "#60a5fa", paid: "var(--green)", overdue: "#f87171", cancelled: "var(--text-muted)" };

  async function patch(updates: Record<string, unknown>, successMsg: string) {
    const res = await fetch("/api/projects", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: project.id, ...updates }) });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || "Failed to update", "error"); return false; }
    if (data.project) setProject(data.project);
    showToast(successMsg);
    return true;
  }

  async function saveNotes() {
    setSavingNotes(true);
    await patch({ notes }, "Notes saved");
    setSavingNotes(false);
  }

  async function deleteProject() {
    const res = await fetch("/api/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: project.id }) });
    if (res.ok) router.push("/projects");
    else showToast("Failed to delete project", "error");
  }

  // Profitability numbers
  const totalHours = timeEntries.reduce((s, e) => s + Number(e.hours), 0);
  const isFixed = project.billing_model !== "hourly";
  const revenue = isFixed ? (project.contract_value || 0) : (project.contract_value || 0) * totalHours;
  const devRate = project.developer_hourly_rate || 0;
  const cost = totalHours * devRate;
  const margin = revenue - cost;
  const marginPct = revenue > 0 ? (margin / revenue) * 100 : null;
  const marginColor = margin >= 0 ? "var(--green)" : "#f87171";
  const fmt = (v: number) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="p-6 max-w-5xl">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}
      <ConfirmModal
        open={confirmDelete}
        title="Delete project?"
        description="All time entries and invoices for this project will be permanently deleted. This cannot be undone."
        confirmLabel="Delete project"
        variant="danger"
        onConfirm={deleteProject}
        onCancel={() => setConfirmDelete(false)}
      />

      {/* Header */}
      <div className="mb-6">
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm mb-3 transition-colors" style={{ color: "var(--text-muted)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Projects
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="page-title" style={{ margin: 0 }}>{project.name}</h1>
              <span className={`badge badge-${project.status}`}>{project.status}</span>
            </div>
            <p className="page-sub">
              {project.client
                ? `${project.client.full_name}${project.client.company_name ? ` · ${project.client.company_name}` : ""}`
                : "No client assigned"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openEdit} className="btn-ghost text-xs">Edit</button>
            <button onClick={() => setConfirmDelete(true)}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ border: "0.5px solid #7f1d1d", color: "#f87171" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1c0a0a")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Top info row */}
      <div className="grid grid-cols-3 gap-4 mb-4">

        {/* Developer */}
        <div className="card p-5">
          <p className="section-title">Developer</p>
          {project.developer ? (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "var(--green-bg)", border: "1px solid var(--green-border)", color: "var(--green)" }}>
                  {project.developer.full_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{project.developer.full_name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{project.developer.email}</p>
                </div>
              </div>
              <dl className="space-y-2" style={{ borderTop: "0.5px solid var(--border-subtle)", paddingTop: 10 }}>
                <div className="flex justify-between">
                  <dt className="text-xs" style={{ color: "var(--text-muted)" }}>Rate</dt>
                  <dd className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {project.developer_hourly_rate ? `$${project.developer_hourly_rate}/hr` : <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs" style={{ color: "var(--text-muted)" }}>Hours allocated</dt>
                  <dd className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {project.developer_hours_allocated ? `${project.developer_hours_allocated}h` : <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No developer assigned</p>
          )}
        </div>

        {/* Billing */}
        <div className="card p-5">
          <p className="section-title">Billing</p>
          <dl className="space-y-2.5">
            <div className="flex justify-between">
              <dt className="text-xs" style={{ color: "var(--text-muted)" }}>Model</dt>
              <dd className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                {project.billing_model ? BILLING_LABEL[project.billing_model] : <span style={{ color: "var(--text-muted)" }}>—</span>}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-xs" style={{ color: "var(--text-muted)" }}>
                {project.billing_model ? PRICE_LABEL[project.billing_model] : "Price"}
              </dt>
              <dd className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                {project.contract_value
                  ? project.billing_model === "hourly"
                    ? `$${project.contract_value}/hr`
                    : `$${Number(project.contract_value).toLocaleString()}`
                  : <span style={{ color: "var(--text-muted)" }}>—</span>}
              </dd>
            </div>
            {project.billing_frequency && (
              <div className="flex justify-between">
                <dt className="text-xs" style={{ color: "var(--text-muted)" }}>Billing schedule</dt>
                <dd className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  {project.billing_frequency === "monthly" && `Monthly · day ${project.billing_day_1}`}
                  {project.billing_frequency === "semi_monthly" && `Semi-monthly · ${project.billing_day_1}th & ${project.billing_day_2}th`}
                  {project.billing_frequency === "bi_weekly" && `Bi-weekly`}
                </dd>
              </div>
            )}
            {project.account_manager && (
              <div className="flex justify-between">
                <dt className="text-xs" style={{ color: "var(--text-muted)" }}>Account mgr</dt>
                <dd className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{project.account_manager.full_name}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Timeline */}
        <div className="card p-5">
          <p className="section-title">Timeline</p>
          <dl className="space-y-2.5">
            <div>
              <dt className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Start</dt>
              <dd className="text-sm" style={{ color: "var(--text-primary)" }}>
                {project.start_date ? new Date(project.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>End</dt>
              <dd className="text-sm" style={{ color: "var(--text-primary)" }}>
                {project.end_date ? new Date(project.end_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">

          {project.description && (
            <div className="card p-5">
              <p className="section-title">Description</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{project.description}</p>
            </div>
          )}

          {/* Time summary */}
          {project.developer && timeEntries.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="section-title">Time summary</p>
                <a href="/time" className="text-xs" style={{ color: "var(--green)" }}>Review entries →</a>
              </div>
              {(() => {
                const logged = timeEntries.reduce((s, e) => s + Number(e.hours), 0);
                const allocated = project.developer_hours_allocated || 0;
                const pct = allocated > 0 ? Math.min(100, (logged / allocated) * 100) : null;
                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{project.developer.full_name}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span style={{ color: "var(--green)" }}>{logged}h logged</span>
                        {allocated > 0 && <span style={{ color: "var(--text-muted)" }}>/ {allocated}h</span>}
                      </div>
                    </div>
                    {pct !== null && (
                      <div className="rounded-full overflow-hidden" style={{ height: 4, background: "var(--border-subtle)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 100 ? "#f87171" : "var(--green)" }} />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Profitability */}
          {timeEntries.length > 0 && project.contract_value && (
            <div className="card p-5">
              <p className="section-title mb-4">Profitability</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: isFixed ? "Project price" : "Client billing", value: fmt(revenue), color: "#60a5fa" },
                  { label: "Developer cost", value: fmt(cost), color: "#fbbf24" },
                  { label: "Gross margin", value: fmt(margin), color: marginColor },
                ].map(s => (
                  <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: "var(--surface-2)" }}>
                    <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                    <p className="text-sm font-semibold" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
              {marginPct !== null && (
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "var(--text-muted)" }}>Margin</span>
                    <span style={{ color: marginColor, fontWeight: 600 }}>{marginPct.toFixed(1)}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 6, background: "var(--border-subtle)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, marginPct))}%`, background: marginColor }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                    <span>{totalHours.toFixed(1)} hrs logged</span>
                    {devRate > 0 && <span>${devRate}/hr developer rate</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Invoices */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="section-title">Invoices</p>
              <Link href="/invoices" className="text-xs" style={{ color: "var(--green)" }}>All invoices →</Link>
            </div>
            {invoices.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No invoices for this project</p>
            ) : (
              <div className="space-y-1">
                {invoices.map(inv => (
                  <Link key={inv.id} href={`/invoices/${inv.id}`}
                    className="flex items-center justify-between px-2 py-2 rounded-lg transition-colors hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs" style={{ color: "var(--text-primary)" }}>{inv.invoice_number}</span>
                      <span className="text-xs capitalize" style={{ color: INV_STATUS_COLOR[inv.status] || "var(--text-muted)" }}>{inv.status}</span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: inv.currency || "USD" }).format(inv.amount)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card p-5">
            <p className="section-title">Internal notes</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="input resize-none w-full" placeholder="Add notes…" />
            <div className="mt-3 flex justify-end">
              <button onClick={saveNotes} disabled={savingNotes} className="btn-primary">
                {savingNotes ? "Saving…" : "Save notes"}
              </button>
            </div>
          </div>
        </div>

        {/* Status sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">Status</p>
            <div className="space-y-1.5">
              {(["active", "paused", "completed", "cancelled"] as ProjectStatus[]).map(s => (
                <button key={s} onClick={() => patch({ status: s }, `Status set to ${s}`)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors"
                  style={project.status === s
                    ? { background: "#0d1527", border: "0.5px solid var(--border-default)", color: "var(--text-primary)", fontWeight: 500 }
                    : { border: "0.5px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-2">
                    {project.status === s && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--green)" }} />}
                    {s}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={e => { if (e.target === e.currentTarget) setEditing(false); }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl" style={{ background: "var(--surface-1)", border: "0.5px solid var(--border-default)" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Edit project</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{project.name}</p>
              </div>
              <button onClick={() => setEditing(false)} className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-default)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Basics */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Basics</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Project name <span style={{ color: "#f87171" }}>*</span></label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Description</label>
                    <textarea value={editForm.description} onChange={e => setEditForm((f: any) => ({ ...f, description: e.target.value }))} rows={2} className="input resize-none" placeholder="Brief description…" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Client</label>
                      <select value={editForm.client_id} onChange={e => setEditForm((f: any) => ({ ...f, client_id: e.target.value }))} className="input">
                        <option value="">No client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}{c.company_name ? ` — ${c.company_name}` : ""}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Account manager</label>
                      <select value={editForm.account_manager_id} onChange={e => setEditForm((f: any) => ({ ...f, account_manager_id: e.target.value }))} className="input">
                        <option value="">Unassigned</option>
                        {admins.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "0.5px solid var(--border-subtle)" }} />

              {/* Developer */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Developer</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Developer</label>
                    <select value={editForm.developer_id} onChange={e => setEditForm((f: any) => ({ ...f, developer_id: e.target.value }))} className="input">
                      <option value="">No developer</option>
                      {developers.map(d => <option key={d.id} value={d.id}>{d.full_name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Rate ($/hr)</label>
                      <input type="number" min="0" step="0.01" value={editForm.developer_hourly_rate} onChange={e => setEditForm((f: any) => ({ ...f, developer_hourly_rate: e.target.value }))} className="input" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Hours allocated</label>
                      <input type="number" min="0" value={editForm.developer_hours_allocated} onChange={e => setEditForm((f: any) => ({ ...f, developer_hours_allocated: e.target.value }))} className="input" placeholder="0" />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "0.5px solid var(--border-subtle)" }} />

              {/* Billing */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Billing</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Billing model</label>
                    <select value={editForm.billing_model} onChange={e => setEditForm((f: any) => ({ ...f, billing_model: e.target.value }))} className="input">
                      <option value="">None</option>
                      <option value="hourly">Hourly</option>
                      <option value="fixed">Fixed price</option>
                      <option value="monthly_retainer">Monthly retainer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      {editForm.billing_model === "hourly" ? "Client rate ($/hr)" : editForm.billing_model === "monthly_retainer" ? "Monthly price (USD)" : "Project price (USD)"}
                    </label>
                    <input type="number" min="0" step="0.01" value={editForm.contract_value} onChange={e => setEditForm((f: any) => ({ ...f, contract_value: e.target.value }))} className="input" placeholder="0.00" />
                  </div>
                  {editForm.billing_model === "hourly" && <>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Billing frequency</label>
                      <select value={editForm.billing_frequency} onChange={e => setEditForm((f: any) => ({ ...f, billing_frequency: e.target.value }))} className="input">
                        <option value="">None</option>
                        <option value="monthly">Monthly</option>
                        <option value="semi_monthly">Semi-monthly (twice a month)</option>
                        <option value="bi_weekly">Bi-weekly (every 2 weeks)</option>
                      </select>
                    </div>
                    {editForm.billing_frequency === "monthly" && (
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Billing day of month</label>
                        <input type="number" min="1" max="28" value={editForm.billing_day_1} onChange={e => setEditForm((f: any) => ({ ...f, billing_day_1: e.target.value }))} className="input" placeholder="e.g. 1" />
                      </div>
                    )}
                    {editForm.billing_frequency === "semi_monthly" && <>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>First billing day</label>
                        <input type="number" min="1" max="28" value={editForm.billing_day_1} onChange={e => setEditForm((f: any) => ({ ...f, billing_day_1: e.target.value }))} className="input" placeholder="e.g. 1" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Second billing day</label>
                        <input type="number" min="1" max="28" value={editForm.billing_day_2} onChange={e => setEditForm((f: any) => ({ ...f, billing_day_2: e.target.value }))} className="input" placeholder="e.g. 15" />
                      </div>
                    </>}
                    {editForm.billing_frequency === "bi_weekly" && (
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Anchor date (first pay date)</label>
                        <input type="date" value={editForm.billing_anchor_date} onChange={e => setEditForm((f: any) => ({ ...f, billing_anchor_date: e.target.value }))} className="input" />
                      </div>
                    )}
                  </>}
                </div>
              </div>

              <div style={{ borderTop: "0.5px solid var(--border-subtle)" }} />

              {/* Timeline */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Timeline</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Start date</label>
                    <input type="date" value={editForm.start_date} onChange={e => setEditForm((f: any) => ({ ...f, start_date: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>End date</label>
                    <input type="date" value={editForm.end_date} onChange={e => setEditForm((f: any) => ({ ...f, end_date: e.target.value }))} className="input" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "0.5px solid var(--border-subtle)" }}>
              <button onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="btn-primary">
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Inline billing rate editor ─────────────────────────────────────────────
function BillingRateRow({ label, value, onSave }: {
  label: string; value: number | null; onSave: (v: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value?.toString() || "");

  function save() {
    onSave(val ? parseFloat(val) : null);
    setEditing(false);
  }

  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</dt>
      <dd className="text-xs">
        {editing ? (
          <span className="flex items-center gap-1">
            <input type="number" value={val} onChange={e => setVal(e.target.value)}
              className="input text-xs w-20 py-0.5 px-1.5" placeholder="0.00" min="0" step="0.01"
              onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
              autoFocus />
            <button onClick={save} className="text-xs" style={{ color: "var(--green)" }}>✓</button>
            <button onClick={() => setEditing(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>✕</button>
          </span>
        ) : (
          <button onClick={() => { setVal(value?.toString() || ""); setEditing(true); }}
            className="font-semibold transition-colors"
            style={{ color: value ? "var(--text-primary)" : "var(--text-muted)" }}>
            {value ? `$${value}/hr` : "Set rate"}
          </button>
        )}
      </dd>
    </div>
  );
}

