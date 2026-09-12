"use client";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Toast, useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";

interface PortalUser {
  id: string; full_name: string; email: string;
  company_name: string | null; job_title: string | null;
  is_active: boolean; created_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ user: PortalUser; next: boolean } | null>(null);
  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    fetch("/api/portal-users?role=client")
      .then(r => r.json())
      .then(d => { setClients(d.users || []); setLoading(false); });
  }, []);

  async function toggleActive(user: PortalUser) {
    const next = !user.is_active;
    setConfirm({ user, next });
  }

  async function confirmToggle() {
    if (!confirm) return;
    const { user, next } = confirm;
    setConfirm(null);
    setToggling(user.id);
    const next2 = next;
    const res = await fetch("/api/portal-users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, is_active: next2 }),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Failed to update", "error");
    else {
      setClients(cs => cs.map(c => c.id === user.id ? { ...c, is_active: next2 } : c));
      showToast(next2 ? `${user.full_name} activated` : `${user.full_name} deactivated`);
    }
    setToggling(null);
  }

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}
      <ConfirmModal
        open={!!confirm}
        title={confirm?.next ? `Activate ${confirm.user.full_name}?` : `Deactivate ${confirm?.user.full_name}?`}
        description={confirm?.next
          ? "They will be able to log in to the client portal again."
          : "They will immediately lose access to the client portal."}
        confirmLabel={confirm?.next ? "Activate" : "Deactivate"}
        variant={confirm?.next ? "primary" : "warning"}
        onConfirm={confirmToggle}
        onCancel={() => setConfirm(null)}
      />
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-sub">Registered client portal users</p>
        </div>
        <div className="flex gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{clients.filter(c => c.is_active).length} active</span>
          <span>{clients.filter(c => !c.is_active).length} inactive</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          title="No clients registered"
          subtitle="Clients will appear here once they complete registration via a magic link."
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border-subtle)", background: "rgba(255,255,255,0.01)" }}>
                <th className="th text-left px-4 py-3">Client</th>
                <th className="th px-4 py-3">Company</th>
                <th className="th px-4 py-3">Title</th>
                <th className="th px-4 py-3">Joined</th>
                <th className="th px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c, i) => (
                <tr key={c.id}
                  style={{
                    borderBottom: i < clients.length - 1 ? "0.5px solid var(--border-subtle)" : "none",
                    opacity: c.is_active ? 1 : 0.5,
                  }}
                  className="transition-opacity hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                        {c.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.full_name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
                    {c.company_name || <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
                    {c.job_title || <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(c)} disabled={toggling === c.id}
                      className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={c.is_active
                        ? { background: "var(--green-bg)", color: "var(--green)", border: "0.5px solid var(--green)" }
                        : { background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }
                      }>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: c.is_active ? "var(--green)" : "var(--text-muted)" }} />
                      {toggling === c.id ? "…" : c.is_active ? "Active" : "Inactive"}
                    </button>
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
