"use client";
import { useEffect, useState } from "react";
import { Toast, useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";

const ALL_PERMS = ["leads", "projects", "invoices", "payroll", "clients", "developers"] as const;
type Perm = typeof ALL_PERMS[number];

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "staff";
  permissions: Perm[];
  created_at: string;
}

function PermissionToggle({ perm, checked, disabled, onChange }: { perm: Perm; checked: boolean; disabled: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all"
      style={{
        background: checked ? "var(--green-bg)" : "transparent",
        border: `0.5px solid ${checked ? "var(--green-border)" : "var(--border-default)"}`,
        color: checked ? "var(--green)" : "var(--text-muted)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {perm.charAt(0).toUpperCase() + perm.slice(1)}
    </button>
  );
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", full_name: "", password: "", role: "staff" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingPerms, setUpdatingPerms] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    fetch("/api/admin-users").then(r => r.json()).then(d => { setAdmins(d.admins || []); setLoading(false); });
  }, []);

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })); }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setFormError("");
    const res = await fetch("/api/admin-users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setFormError(data.error || "Failed to add admin"); setSaving(false); return; }
    setAdmins(a => [data.admin, ...a]);
    setForm({ email: "", full_name: "", password: "", role: "staff" });
    setShowForm(false); setSaving(false);
    showToast(`${data.admin.full_name} added successfully`);
  }

  async function handleDelete(admin: AdminUser) {
    setDeleteTarget(admin);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { id, full_name } = deleteTarget;
    setDeleteTarget(null);
    const res = await fetch("/api/admin-users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) {
      setAdmins(a => a.filter(x => x.id !== id));
      showToast(`${full_name} removed`);
    } else {
      showToast("Failed to remove admin", "error");
    }
  }

  async function handlePermChange(userId: string, perm: Perm, val: boolean) {
    const admin = admins.find(a => a.id === userId);
    if (!admin) return;
    const prev = admin.permissions || [];
    const next = val ? [...prev, perm] : prev.filter(p => p !== perm);
    setAdmins(a => a.map(x => x.id === userId ? { ...x, permissions: next } : x));
    setUpdatingPerms(userId);
    const res = await fetch("/api/admin-users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, permissions: next }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAdmins(a => a.map(x => x.id === userId ? { ...x, permissions: prev } : x));
      showToast(data.error || "Failed to update permissions", "error");
    } else {
      showToast("Permissions updated");
    }
    setUpdatingPerms(null);
  }

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}
      <ConfirmModal
        open={!!deleteTarget}
        title={`Remove ${deleteTarget?.full_name}?`}
        description="They will immediately lose access to the admin portal. This cannot be undone."
        confirmLabel="Remove admin"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      {editTarget && (
        <EditAdminModal
          admin={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={(updated) => {
            setAdmins(a => a.map(x => x.id === updated.id ? { ...x, ...updated } : x));
            setEditTarget(null);
            showToast("Profile updated");
          }}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Admin users</h1>
          <p className="page-sub">Manage who has access to this portal</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">Add admin</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card p-5 mb-5 space-y-4">
          <p className="section-title">New admin user</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Full name</label>
              <input type="text" value={form.full_name} onChange={e => set("full_name", e.target.value)} required className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)} required className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <input type="password" value={form.password} onChange={e => set("password", e.target.value)} required className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Role</label>
              <select value={form.role} onChange={e => set("role", e.target.value)} className="input">
                <option value="staff">Staff</option>
                <option value="super_admin">Super admin</option>
              </select>
            </div>
          </div>
          {formError && <p className="error-box">{formError}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Adding…" : "Add admin"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-16 text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>
      ) : (
        <div className="table-wrap">
          <table className="w-full">
            <thead><tr style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
              <th className="th">Name</th>
              <th className="th">Email</th>
              <th className="th">Role</th>
              <th className="th">Access</th>
              <th className="th">Added</th>
              <th className="th"></th>
            </tr></thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id} className="tr">
                  <td className="td-name">{a.full_name}</td>
                  <td className="td">{a.email}</td>
                  <td className="td">
                    <span className={`badge badge-${a.role}`}>{a.role === "super_admin" ? "Super admin" : "Staff"}</span>
                  </td>
                  <td className="td">
                    {a.role === "super_admin" ? (
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>Full access</span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {ALL_PERMS.map(perm => (
                          <PermissionToggle
                            key={perm}
                            perm={perm}
                            checked={(a.permissions || []).includes(perm)}
                            disabled={updatingPerms === a.id}
                            onChange={(val) => handlePermChange(a.id, perm, val)}
                          />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="td" style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="td text-right">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => setEditTarget(a)} className="text-xs transition-colors" style={{ color: "var(--text-muted)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                        Edit
                      </button>
                      {a.role !== "super_admin" && (
                        <button onClick={() => handleDelete(a)} className="text-xs transition-colors" style={{ color: "var(--text-muted)" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#fca5a5")}
                          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Edit Admin Modal ───────────────────────────────────────────────────────────
function EditAdminModal({ admin, onClose, onSaved }: {
  admin: AdminUser;
  onClose: () => void;
  onSaved: (updated: Partial<AdminUser>) => void;
}) {
  const [form, setForm] = useState({ full_name: admin.full_name, email: admin.email, password: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); setError(""); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match"); return;
    }
    if (form.password && form.password.length < 8) {
      setError("Password must be at least 8 characters"); return;
    }
    setSaving(true);
    const payload: Record<string, string> = { id: admin.id, full_name: form.full_name, email: form.email };
    if (form.password) payload.password = form.password;
    const res = await fetch("/api/admin-users", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to save"); setSaving(false); return; }
    onSaved(data.admin);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="card p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-5">
          <p className="section-title">Edit {admin.full_name}</p>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="field-label">Full name</label>
            <input value={form.full_name} onChange={e => set("full_name", e.target.value)} required className="input w-full" />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} required className="input w-full" />
          </div>
          <div style={{ borderTop: "0.5px solid var(--border-subtle)", paddingTop: 12, marginTop: 4 }}>
            <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Leave blank to keep current password</p>
            <div>
              <label className="field-label">New password</label>
              <input type="password" value={form.password} onChange={e => set("password", e.target.value)} className="input w-full" placeholder="8+ characters" />
            </div>
          </div>
          {form.password && (
            <div>
              <label className="field-label">Confirm password</label>
              <input type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} className="input w-full" placeholder="Repeat new password" />
            </div>
          )}
          {error && <p className="error-box">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save changes"}</button>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
