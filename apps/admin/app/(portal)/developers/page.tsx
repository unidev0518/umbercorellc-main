"use client";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Toast, useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";

interface PortalUser {
  id: string; full_name: string; email: string;
  skills: string | null; availability: string | null;
  is_active: boolean; created_at: string;
}

const AVAIL: Record<string, string> = {
  immediate: "Immediate", "2_weeks": "2 weeks", "1_month": "1 month", flexible: "Flexible",
};

export default function DevelopersPage() {
  const [devs, setDevs] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ user: PortalUser; next: boolean } | null>(null);
  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    fetch("/api/portal-users?role=developer")
      .then(r => r.json())
      .then(d => { setDevs(d.users || []); setLoading(false); });
  }, []);

  async function toggleActive(user: PortalUser) {
    setConfirm({ user, next: !user.is_active });
  }

  async function confirmToggle() {
    if (!confirm) return;
    const { user, next } = confirm;
    setConfirm(null);
    setToggling(user.id);
    const res = await fetch("/api/portal-users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, is_active: next }),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Failed to update", "error");
    else {
      setDevs(ds => ds.map(d => d.id === user.id ? { ...d, is_active: next } : d));
      showToast(next ? `${user.full_name} activated` : `${user.full_name} deactivated`);
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
          ? "They will be able to log in to the developer portal again."
          : "They will immediately lose access to the developer portal. This affects their ability to log time and receive payments."}
        confirmLabel={confirm?.next ? "Activate" : "Deactivate"}
        variant={confirm?.next ? "primary" : "warning"}
        onConfirm={confirmToggle}
        onCancel={() => setConfirm(null)}
      />
      <div className="page-header">
        <div>
          <h1 className="page-title">Developers</h1>
          <p className="page-sub">Registered developer portal users</p>
        </div>
        <div className="flex gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{devs.filter(d => d.is_active).length} active</span>
          <span>{devs.filter(d => !d.is_active).length} inactive</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>
      ) : devs.length === 0 ? (
        <EmptyState
          icon="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          title="No developers registered"
          subtitle="Developers will appear here once they complete registration via a magic link."
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border-subtle)", background: "rgba(255,255,255,0.01)" }}>
                <th className="th text-left px-4 py-3">Developer</th>
                <th className="th px-4 py-3">Skills</th>
                <th className="th px-4 py-3">Availability</th>
                <th className="th px-4 py-3">Joined</th>
                <th className="th px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {devs.map((d, i) => (
                <tr key={d.id}
                  style={{
                    borderBottom: i < devs.length - 1 ? "0.5px solid var(--border-subtle)" : "none",
                    opacity: d.is_active ? 1 : 0.5,
                  }}
                  className="transition-opacity hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                        {d.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{d.full_name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{d.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center" style={{ maxWidth: 200 }}>
                    <span className="text-xs truncate block" style={{ color: "var(--text-secondary)" }}>
                      {d.skills || <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs" style={{ color: "var(--text-secondary)" }}>
                    {d.availability ? (AVAIL[d.availability] || d.availability) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(d)} disabled={toggling === d.id}
                      className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={d.is_active
                        ? { background: "var(--green-bg)", color: "var(--green)", border: "0.5px solid var(--green)" }
                        : { background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }
                      }>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: d.is_active ? "var(--green)" : "var(--text-muted)" }} />
                      {toggling === d.id ? "…" : d.is_active ? "Active" : "Inactive"}
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
