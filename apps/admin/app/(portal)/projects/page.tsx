"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonTable } from "@/components/Skeleton";

type ProjectStatus = "active" | "paused" | "completed" | "cancelled";

interface Project {
  id: string; name: string; status: ProjectStatus;
  description: string | null; start_date: string | null; end_date: string | null;
  billing_model: string | null;
  contract_value: number | null;
  developer_hourly_rate: number | null;
  current_period_hours: number;
  last_paid_at: string | null;
  daily_hours: Record<string, number>;
  client: { id: string; full_name: string; company_name: string | null } | null;
  developer: { id: string; full_name: string } | null;
}

function fmtDate(d: string | null) {
  if (!d) return <span style={{ color: "var(--text-muted)" }}>—</span>;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function HoursSparkline({ dailyHours, lastPaidAt }: { dailyHours: Record<string, number>; lastPaidAt: string | null }) {
  // Build array of the last 30 days (or since last payment, whichever is shorter)
  const today = new Date();
  const since = lastPaidAt ? new Date(lastPaidAt) : new Date(today.getTime() - 29 * 86400000);
  const diffDays = Math.min(30, Math.ceil((today.getTime() - since.getTime()) / 86400000) + 1);
  const days: { date: string; hours: number }[] = [];
  for (let i = diffDays - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, hours: dailyHours[key] || 0 });
  }

  const maxHours = Math.max(...days.map(d => d.hours), 1);
  const W = 120;
  const H = 28;
  const barW = Math.max(2, Math.floor((W - days.length) / days.length));
  const gap = Math.floor((W - barW * days.length) / Math.max(days.length - 1, 1));

  if (days.every(d => d.hours === 0)) {
    return <span style={{ color: "var(--text-muted)", fontSize: 11 }}>No hours</span>;
  }

  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      {days.map((d, i) => {
        const barH = Math.max(2, Math.round((d.hours / maxHours) * (H - 4)));
        const x = i * (barW + gap);
        const y = H - barH;
        const isToday = d.date === today.toISOString().slice(0, 10);
        return (
          <rect key={d.date} x={x} y={y} width={barW} height={barH} rx={1}
            fill={d.hours > 0 ? (isToday ? "#c4813a" : "var(--green)") : "var(--border-subtle)"}
            opacity={d.hours > 0 ? 1 : 0.4}>
            <title>{d.date}: {d.hours}h</title>
          </rect>
        );
      })}
    </svg>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("active");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    fetch(`/api/projects?${params}`).then(r => r.json()).then(d => { setProjects(d.projects || []); setLoading(false); });
  }, [status]);

  return (
    <div className="p-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-sub">Manage active client engagements</p>
        </div>
        <Link href="/projects/new" className="btn-primary">New project</Link>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs font-medium mr-1" style={{ color: "var(--text-muted)" }}>Filter:</span>
        {(["active","paused","completed","cancelled"] as ProjectStatus[]).map(s => (
          <button key={s} onClick={() => setStatus(v => v === s ? "" : s)}
            className="px-2.5 py-1 rounded text-xs font-medium transition-all capitalize"
            style={{
              background: status === s ? "var(--green-bg)" : "transparent",
              border: `0.5px solid ${status === s ? "var(--green-border)" : "var(--border-default)"}`,
              color: status === s ? "var(--green)" : "var(--text-muted)",
            }}>{s}</button>
        ))}
        {status && (
          <button onClick={() => setStatus("")} className="text-xs ml-1 transition-colors" style={{ color: "var(--text-muted)" }}>
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <SkeletonTable rows={6} cols={10} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          title="No projects found"
          subtitle={status ? "Try adjusting your filter." : "Create your first project to start tracking client engagements."}
          action={!status ? <Link href="/projects/new" className="btn-primary text-sm">New project</Link> : undefined}
        />
      ) : (
        <div className="table-wrap">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
                <th className="th">Company</th>
                <th className="th">Project</th>
                <th className="th">Price</th>
                <th className="th">Developer</th>
                <th className="th">Dev rate</th>
                <th className="th">Start date</th>
                <th className="th">End date</th>
                <th className="th">This period</th>
                <th className="th">Activity</th>
                <th className="th">Status</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="tr">
                  <td className="td-name">
                    {p.client?.company_name || p.client?.full_name || <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td className="td text-xs" style={{ color: "var(--text-secondary)" }}>
                    <Link href={`/projects/${p.id}`} className="hover:text-emerald-400 transition-colors" style={{ color: "inherit" }}>
                      {p.name}
                    </Link>
                  </td>
                  <td className="td text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    {p.contract_value ? `$${Number(p.contract_value).toLocaleString()}` : <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td className="td text-xs" style={{ color: "var(--text-secondary)" }}>
                    {p.developer?.full_name || <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td className="td text-xs" style={{ color: "var(--text-secondary)" }}>
                    {p.developer_hourly_rate ? `$${p.developer_hourly_rate}/hr` : <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td className="td text-xs" style={{ color: "var(--text-secondary)" }}>{fmtDate(p.start_date)}</td>
                  <td className="td text-xs" style={{ color: "var(--text-secondary)" }}>{fmtDate(p.end_date)}</td>
                  <td className="td text-xs font-medium"
                    title={p.last_paid_at ? `Since: ${new Date(p.last_paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "Since project start (never paid)"}
                    style={{ color: p.current_period_hours > 0 ? "var(--green)" : "var(--text-muted)" }}>
                    {p.current_period_hours > 0 ? `${p.current_period_hours}h` : "—"}
                  </td>
                  <td className="td">
                    <HoursSparkline dailyHours={p.daily_hours} lastPaidAt={p.last_paid_at} />
                  </td>
                  <td className="td"><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td className="td text-right">
                    <Link href={`/projects/${p.id}`}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                      style={{ color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-default)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </Link>
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
