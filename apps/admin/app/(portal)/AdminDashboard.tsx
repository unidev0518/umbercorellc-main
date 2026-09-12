"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalLeads: number; newLeads: number; activeProjects: number;
  totalClients: number; totalDevs: number; pendingTimeEntries: number;
  invPaid: number; invOutstanding: number; devCosts: number; netIncome: number;
}
interface Lead { id: string; first_name: string; last_name: string; email: string; type: string; status: string; created_at: string; }
interface Project { id: string; name: string; status: string; client: { full_name: string; company_name: string | null } | null; }

const STATUS_ORDER = ["active", "paused", "completed", "cancelled"];
const STATUS_LEAD: Record<string, { color: string }> = {
  new: { color: "#60a5fa" }, contacted: { color: "#fbbf24" },
  qualified: { color: "var(--green)" }, rejected: { color: "var(--text-muted)" },
};

function fmtMoney(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n); }
function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AdminDashboard({ firstName }: { firstName: string }) {
  const [data, setData] = useState<{ stats: Stats; phaseCount: Record<string, number>; recentLeads: Lead[]; recentProjects: Project[] } | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(setData);
  }, []);

  const stats = data?.stats;
  const phases = data?.phaseCount || {};
  const totalActive = stats?.activeProjects || 0;

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-7">
        <h1 className="page-title">Good {greeting()}, {firstName}</h1>
        <p className="page-sub">Here's what's happening at UmberCore</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard label="New leads" value={stats?.newLeads ?? "—"} sub={`${stats?.totalLeads ?? 0} total`} href="/leads" accent="#60a5fa" />
        <StatCard label="Active projects" value={stats?.activeProjects ?? "—"} href="/projects" accent="var(--green)" />
        <StatCard label="Clients" value={stats?.totalClients ?? "—"} href="/clients" />
        <StatCard label="Developers" value={stats?.totalDevs ?? "—"} href="/developers" />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Hours logged (7d)" value={stats?.pendingTimeEntries ?? "—"} href="/time" accent={stats?.pendingTimeEntries ? "#fbbf24" : undefined} />
        <StatCard label="Outstanding invoices" value={stats ? fmtMoney(stats.invOutstanding) : "—"} href="/invoices" accent="#60a5fa" />
        <StatCard label="Awaiting payroll" value={stats ? fmtMoney(stats.devCosts > 0 ? stats.devCosts : 0) : "—"} href="/payroll" />
      </div>

      {/* Financials */}
      <div className="card p-5 mb-6">
        <p className="section-title mb-4">Financials (all time)</p>
        <div className="grid grid-cols-3 gap-6">
          <FinanceItem label="Revenue" value={stats ? fmtMoney(stats.invPaid) : "—"} color="var(--green)" note="Paid invoices (excl. tax)" />
          <FinanceItem label="Dev costs" value={stats ? fmtMoney(stats.devCosts) : "—"} color="#f87171" note="Developer payments made" />
          <FinanceItem
            label="Net income"
            value={stats ? fmtMoney(stats.netIncome) : "—"}
            color={stats && stats.netIncome >= 0 ? "var(--green)" : "#f87171"}
            note="Revenue − dev costs"
            large
          />
        </div>
        {stats && stats.invPaid > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Margin</span>
              <span className="text-xs font-semibold" style={{ color: "var(--green)" }}>
                {((stats.netIncome / stats.invPaid) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 5, background: "var(--border-subtle)" }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${Math.max(0, Math.min(100, (stats.netIncome / stats.invPaid) * 100))}%`, background: "var(--green)" }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: "#f87171" }}>Dev costs {stats.invPaid > 0 ? ((stats.devCosts / stats.invPaid) * 100).toFixed(1) : 0}%</span>
              <span className="text-xs" style={{ color: "var(--green)" }}>Margin {stats.invPaid > 0 ? ((stats.netIncome / stats.invPaid) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Active project phases */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Projects by status</p>
            <Link href="/projects" className="text-xs" style={{ color: "var(--green)" }}>View all →</Link>
          </div>
          {!data ? (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading…</p>
          ) : totalActive === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No active projects</p>
          ) : (
            <div className="space-y-2.5">
              {STATUS_ORDER.filter(p => phases[p]).map(phase => {
                const count = phases[phase] || 0;
                const pct = totalActive > 0 ? (count / totalActive) * 100 : 0;
                return (
                  <div key={phase}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs capitalize" style={{ color: "var(--text-secondary)" }}>{phase}</span>
                      <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{count}</span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 4, background: "var(--border-subtle)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--green)", transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent leads */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Recent leads</p>
            <Link href="/leads" className="text-xs" style={{ color: "var(--green)" }}>View all →</Link>
          </div>
          {!data ? (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading…</p>
          ) : (data.recentLeads.length === 0) ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No leads yet</p>
          ) : (
            <div className="space-y-2">
              {data.recentLeads.map(lead => (
                <div key={lead.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{lead.first_name} {lead.last_name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className="text-xs capitalize px-1.5 py-0.5 rounded" style={{
                      color: STATUS_LEAD[lead.status]?.color || "var(--text-muted)",
                      background: "rgba(255,255,255,0.04)",
                    }}>{lead.status}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{timeAgo(lead.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent projects */}
        <div className="card p-5" style={{ gridColumn: "1 / -1" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Recent projects</p>
            <Link href="/projects" className="text-xs" style={{ color: "var(--green)" }}>View all →</Link>
          </div>
          {!data ? (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading…</p>
          ) : (data.recentProjects.length === 0) ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No projects yet</p>
          ) : (
            <table className="w-full">
              <thead><tr style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
                <th className="th text-left">Project</th>
                <th className="th">Client</th>
                <th className="th">Status</th>
              </tr></thead>
              <tbody>
                {data.recentProjects.map(p => (
                  <tr key={p.id} className="tr">
                    <td className="td-name">
                      <Link href={`/projects/${p.id}`} className="hover:underline" style={{ color: "var(--text-primary)", fontSize: 13 }}>{p.name}</Link>
                    </td>
                    <td className="td text-center text-xs" style={{ color: "var(--text-muted)" }}>
                      {p.client ? (p.client.company_name || p.client.full_name) : "—"}
                    </td>
                    <td className="td text-center">
                      <span className="text-xs capitalize px-1.5 py-0.5 rounded" style={{
                        color: p.status === "active" ? "var(--green)" : "var(--text-muted)",
                        background: p.status === "active" ? "var(--green-bg)" : "transparent",
                      }}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, href, accent }: { label: string; value: string | number; sub?: string; href?: string; accent?: string }) {
  const content = (
    <div className="stat-card h-full transition-colors hover:border-opacity-60">
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={accent ? { color: accent } : {}}>{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>}
    </div>
  );
  return href ? <Link href={href} className="block">{content}</Link> : <div>{content}</div>;
}

function FinanceItem({ label, value, color, note, large }: { label: string; value: string; color: string; note: string; large?: boolean }) {
  return (
    <div>
      <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className={large ? "text-2xl font-bold" : "text-xl font-bold"} style={{ color }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{note}</p>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
