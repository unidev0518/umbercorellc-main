"use client";
import { useEffect, useState, useCallback } from "react";
import { Toast, useToast } from "@/components/Toast";
import { SkeletonTable } from "@/components/Skeleton";

interface Project { id: string; name: string; }
interface Entry {
  id: string; date: string; hours: number; description: string | null;
  project: { id: string; name: string };
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fmt(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TimePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayOf(new Date()));
  const [grid, setGrid] = useState<Record<string, Record<string, { hours: string; desc: string }>>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekStartISO = toISO(weekStart);

  // Load projects (developer's assignments)
  useEffect(() => {
    fetch("/api/portal-projects").then(r => r.json()).then(d => setProjects(d.projects || []));
  }, []);

  // Load entries for current week
  const loadEntries = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/time-entries?week_start=${weekStartISO}`);
    const data = await res.json();
    setEntries(data.entries || []);

    // Build grid from existing entries
    const g: Record<string, Record<string, { hours: string; desc: string }>> = {};
    for (const e of (data.entries || []) as Entry[]) {
      if (!g[e.project.id]) g[e.project.id] = {};
      g[e.project.id][e.date] = { hours: String(e.hours), desc: e.description || "" };
    }
    setGrid(g);
    setLoading(false);
  }, [weekStartISO]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  function setCell(projectId: string, date: string, field: "hours" | "desc", value: string) {
    setGrid(g => ({
      ...g,
      [projectId]: { ...(g[projectId] || {}), [date]: { ...(g[projectId]?.[date] ?? { hours: "", desc: "" }), [field]: value } },
    }));
  }

  async function submit() {
    const toSubmit: { project_id: string; date: string; hours: number; description: string }[] = [];
    for (const [projectId, days] of Object.entries(grid)) {
      for (const [date, { hours, desc }] of Object.entries(days)) {
        const h = parseFloat(hours);
        if (!isNaN(h) && h > 0) {
          toSubmit.push({ project_id: projectId, date, hours: h, description: desc });
        }
      }
    }
    if (toSubmit.length === 0) { showToast("No hours entered", "error"); return; }

    setSubmitting(true);
    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries: toSubmit }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || "Failed to submit", "error"); }
    else {
      showToast(`${toSubmit.length} entr${toSubmit.length === 1 ? "y" : "ies"} submitted`);
      await loadEntries();
    }
    setSubmitting(false);
  }

  async function deleteEntry(id: string) {
    const res = await fetch("/api/time-entries", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) { showToast("Entry removed"); await loadEntries(); }
    else showToast("Failed to remove", "error");
  }

  const totalHours = entries.reduce((s, e) => s + Number(e.hours), 0);

  return (
    <div className="p-6 max-w-5xl">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Time tracking</h1>
          <p className="page-sub">Log your hours for the week</p>
        </div>

        {/* Week navigator */}
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekStart(d => addDays(d, -7))} className="btn-ghost px-2.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium px-2" style={{ color: "var(--text-primary)", minWidth: 160, textAlign: "center" }}>
            {fmt(weekStart)} — {fmt(addDays(weekStart, 6))}
          </span>
          <button onClick={() => setWeekStart(d => addDays(d, 7))} className="btn-ghost px-2.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button onClick={() => setWeekStart(getMondayOf(new Date()))} className="btn-ghost text-xs">Today</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-3 mb-5">
        <div className="stat-card">
          <p className="stat-label">Logged this week</p>
          <p className="stat-value" style={{ color: "var(--green)" }}>{totalHours.toFixed(1)}h</p>
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={4} cols={9} />
      ) : projects.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>No projects assigned</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>You'll be able to log time once you're assigned to a project.</p>
        </div>
      ) : (
        <>
          {/* Time grid */}
          <div className="card overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 700 }}>
                <thead>
                  <tr style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
                    <th className="th text-left" style={{ minWidth: 160 }}>Project</th>
                    {weekDays.map((d, i) => (
                      <th key={i} className="th text-center" style={{ minWidth: 80, fontSize: 11 }}>
                        <div>{DAYS[i]}</div>
                        <div style={{ color: "var(--text-muted)", fontWeight: 400 }}>{fmt(d)}</div>
                      </th>
                    ))}
                    <th className="th text-center" style={{ minWidth: 60, fontSize: 11 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => {
                    const rowTotal = weekDays.reduce((s, d) => {
                      const h = parseFloat(grid[p.id]?.[toISO(d)]?.hours || "0");
                      return s + (isNaN(h) ? 0 : h);
                    }, 0);
                    return (
                      <tr key={p.id} className="tr">
                        <td className="td-name" style={{ fontSize: 13 }}>{p.name}</td>
                        {weekDays.map((d, i) => {
                          const iso = toISO(d);
                          const cell = grid[p.id]?.[iso];
                          const existing = entries.find(e => e.project.id === p.id && e.date === iso);
                          return (
                            <td key={i} className="td p-1">
                              <div className="flex flex-col gap-1">
                                <input
                                  type="number" min="0" max="24" step="0.5"
                                  value={cell?.hours || ""}
                                  onChange={e => setCell(p.id, iso, "hours", e.target.value)}
                                  placeholder="0"
                                  className="input text-center text-sm px-1"
                                  style={{ height: 30, fontSize: 13 }}
                                />
                                {existing && (
                                  <button onClick={() => deleteEntry(existing.id)}
                                    className="text-xs text-center transition-colors" style={{ color: "var(--text-muted)", fontSize: 10 }}
                                    onMouseEnter={e => (e.currentTarget.style.color = "#fca5a5")}
                                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                                    remove
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}
                        <td className="td text-center">
                          <span className="text-sm font-semibold" style={{ color: rowTotal > 0 ? "var(--text-primary)" : "var(--text-muted)" }}>
                            {rowTotal > 0 ? `${rowTotal}h` : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Day totals row */}
                  <tr style={{ borderTop: "0.5px solid var(--border-default)" }}>
                    <td className="td text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Daily total</td>
                    {weekDays.map((d, i) => {
                      const iso = toISO(d);
                      const total = projects.reduce((s, p) => {
                        const h = parseFloat(grid[p.id]?.[iso]?.hours || "0");
                        return s + (isNaN(h) ? 0 : h);
                      }, 0);
                      return (
                        <td key={i} className="td text-center">
                          <span className="text-xs font-semibold" style={{ color: total > 0 ? "var(--text-primary)" : "var(--text-muted)" }}>
                            {total > 0 ? `${total}h` : "—"}
                          </span>
                        </td>
                      );
                    })}
                    <td className="td" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button onClick={submit} disabled={submitting} className="btn-primary">
              {submitting ? "Submitting…" : "Submit week"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
