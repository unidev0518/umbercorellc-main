"use client";
import { useEffect, useState, useCallback } from "react";
import { Toast, useToast } from "@/components/Toast";
import { SkeletonTable, SkeletonStatCards } from "@/components/Skeleton";
import { ConfirmModal } from "@/components/ConfirmModal";

interface Entry {
  id: string;
  date: string;
  hours: number;
  description: string | null;
  developer: { id: string; full_name: string; email: string };
  project: { id: string; name: string };
}

export default function TimeReviewPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ project_id: "", developer_id: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.project_id) params.set("project_id", filters.project_id);
    if (filters.developer_id) params.set("developer_id", filters.developer_id);
    const res = await fetch(`/api/time-entries?${params}`);
    const data = await res.json();
    setEntries(data.entries || []);
    setLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  async function remove(id: string) {
    setActing(true);
    const res = await fetch("/api/time-entries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      showToast("Entry removed");
      await load();
    } else {
      const data = await res.json();
      showToast(data.error || "Failed", "error");
    }
    setActing(false);
    setDeleteId(null);
  }

  const totalHours = entries.reduce((s, e) => s + Number(e.hours), 0);

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}
      <ConfirmModal
        open={!!deleteId}
        title="Remove this time entry?"
        description="This cannot be undone."
        confirmLabel="Remove"
        variant="danger"
        loading={acting}
        onConfirm={() => deleteId && remove(deleteId)}
        onCancel={() => setDeleteId(null)}
      />

      <div className="page-header">
        <div>
          <h1 className="page-title">Time log</h1>
          <p className="page-sub">Hours submitted by developers — used for invoices and payroll</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="stat-card">
          <p className="stat-label">Shown entries</p>
          <p className="stat-value">{loading ? "—" : entries.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total hours</p>
          <p className="stat-value" style={{ color: "var(--green)" }}>{totalHours.toFixed(1)}h</p>
        </div>
      </div>

      {loading ? (
        <>
          <SkeletonStatCards />
          <SkeletonTable rows={8} cols={6} />
        </>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>No entries found</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Developers log hours from the portal.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
                <th className="th">Developer</th>
                <th className="th">Project</th>
                <th className="th">Date</th>
                <th className="th">Hours</th>
                <th className="th">Description</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} className="tr">
                  <td className="td-name">
                    <p>{e.developer.full_name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{e.developer.email}</p>
                  </td>
                  <td className="td" style={{ fontSize: 13 }}>{e.project.name}</td>
                  <td className="td" style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="td">
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{e.hours}h</span>
                  </td>
                  <td className="td" style={{ maxWidth: 200 }}>
                    <span className="text-xs truncate block" style={{ color: "var(--text-secondary)" }}>
                      {e.description || <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </span>
                  </td>
                  <td className="td text-right">
                    <button onClick={() => setDeleteId(e.id)} disabled={acting}
                      className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Remove
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
