"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonTable } from "@/components/Skeleton";

type LeadType = "client" | "developer" | "contact";
type LeadStatus = "new" | "contacted" | "qualified" | "rejected";

interface Lead {
  id: string; type: LeadType; status: LeadStatus; pipeline_stage: string | null;
  first_name: string; last_name: string; email: string;
  company_name: string | null; job_type: string | null; source: string | null;
  location: string | null; service_interest: string | null;
  next_action_date: string | null; converted_at: string | null;
  created_at: string;
}

const TABS: { label: string; value: LeadType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Clients", value: "client" },
  { label: "Developers", value: "developer" },
  { label: "Contact", value: "contact" },
];

const STAGE_LABELS: Record<string, string> = {
  new: "New", contacted: "Contacted", discovery_call: "Discovery",
  proposal_sent: "Proposal", negotiating: "Negotiating", won: "Won", lost: "Lost",
  screening: "Screening", interview: "Interview", tech_test: "Tech test",
  offer_sent: "Offer sent", hired: "Hired", rejected: "Rejected",
  qualified: "Qualified", closed: "Closed",
};

const STAGE_COLORS: Record<string, { text: string; bg: string }> = {
  won:      { text: "#c4813a", bg: "#c4813a15" },
  hired:    { text: "#c4813a", bg: "#c4813a15" },
  lost:     { text: "#f87171", bg: "#f8717115" },
  rejected: { text: "#f87171", bg: "#f8717115" },
  new:      { text: "#60a5fa", bg: "#60a5fa15" },
  contacted:{ text: "#fbbf24", bg: "#fbbf2415" },
  screening:    { text: "#a78bfa", bg: "#a78bfa15" },
  interview:    { text: "#a78bfa", bg: "#a78bfa15" },
  tech_test:    { text: "#a78bfa", bg: "#a78bfa15" },
  offer_sent:   { text: "#fb923c", bg: "#fb923c15" },
  discovery_call: { text: "#fbbf24", bg: "#fbbf2415" },
  proposal_sent:  { text: "#fbbf24", bg: "#fbbf2415" },
  negotiating:    { text: "#fb923c", bg: "#fb923c15" },
};

const TYPE_ICONS: Record<string, string> = {
  client: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  developer: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  contact: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
};

const STAT_CONFIG = [
  { key: "new",       label: "New",       color: "#60a5fa" },
  { key: "contacted", label: "Contacted", color: "#fbbf24" },
  { key: "qualified", label: "Qualified", color: "#c4813a" },
  { key: "rejected",  label: "Rejected",  color: "#6b7280" },
];

function isOverdue(date: string | null) {
  if (!date) return false;
  return new Date(date) < new Date();
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tab, setTab] = useState<LeadType | "all">("all");
  const [loading, setLoading] = useState(true);
  const [showConverted, setShowConverted] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (tab !== "all") params.set("type", tab);
    const res = await fetch(`/api/leads?${params}`);
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  }, [tab]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const visibleLeads = showConverted ? leads : leads.filter(l => !l.converted_at);
  const convertedCount = leads.filter(l => l.converted_at).length;
  const counts = leads.filter(l => !l.converted_at).reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-sub">Manage your pipeline from first contact to conversion</p>
        </div>
        {convertedCount > 0 && (
          <button onClick={() => setShowConverted(v => !v)}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{
              border: "0.5px solid var(--border-subtle)",
              color: showConverted ? "var(--green)" : "var(--text-muted)",
              background: showConverted ? "var(--green-bg)" : "transparent",
            }}>
            {showConverted ? "✓ Showing converted" : `Show converted (${convertedCount})`}
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {STAT_CONFIG.map(s => (
          <div key={s.key} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{counts[s.key] || 0}</p>
          </div>
        ))}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Converted</p>
            <svg className="w-3.5 h-3.5" fill="none" stroke="var(--green)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--green)" }}>{convertedCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-5" style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
        {TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{
              borderBottom: tab === t.value ? "2px solid var(--green)" : "2px solid transparent",
              color: tab === t.value ? "var(--green)" : "var(--text-muted)",
              marginBottom: "-0.5px",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonTable rows={6} cols={6} />
      ) : visibleLeads.length === 0 ? (
        <EmptyState
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          title={tab === "all" ? "No leads yet" : `No ${tab} leads`}
          subtitle="Leads submitted through the website will appear here."
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border-subtle)", background: "rgba(255,255,255,0.01)" }}>
                <th className="th text-left px-4 py-3">Person</th>
                <th className="th px-4 py-3">Type</th>
                <th className="th px-4 py-3">Stage</th>
                <th className="th px-4 py-3">Source</th>
                <th className="th px-4 py-3">Next action</th>
                <th className="th px-4 py-3">Added</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeads.map((lead, i) => {
                const stage = lead.pipeline_stage || lead.status;
                const sc = STAGE_COLORS[stage] || { text: "var(--text-muted)", bg: "transparent" };
                const actionOverdue = isOverdue(lead.next_action_date);
                const isLast = i === visibleLeads.length - 1;
                return (
                  <tr key={lead.id} style={{ borderBottom: isLast ? "none" : "0.5px solid var(--border-subtle)" }}
                    className="transition-colors hover:bg-white/[0.02]">
                    {/* Person */}
                    <td className="px-4 py-3">
                      <Link href={`/leads/${lead.id}`} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ background: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                          {lead.first_name[0]}{lead.last_name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium group-hover:text-emerald-400 transition-colors" style={{ color: "var(--text-primary)" }}>
                            {lead.first_name} {lead.last_name}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                            {lead.email}
                          </p>
                        </div>
                      </Link>
                    </td>
                    {/* Type */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md"
                        style={{ background: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={TYPE_ICONS[lead.type] || TYPE_ICONS.contact} />
                        </svg>
                        <span className="capitalize">{lead.type}</span>
                      </span>
                    </td>
                    {/* Stage */}
                    <td className="px-4 py-3 text-center">
                      {lead.converted_at ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "var(--green-bg)", color: "var(--green)" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          Converted
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ color: sc.text, background: sc.bg }}>
                          {STAGE_LABELS[stage] || stage}
                        </span>
                      )}
                    </td>
                    {/* Source */}
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs" style={{ color: lead.source ? "var(--text-secondary)" : "var(--border-default)" }}>
                        {lead.source || "—"}
                      </span>
                    </td>
                    {/* Next action */}
                    <td className="px-4 py-3 text-center">
                      {lead.next_action_date ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium"
                          style={{ color: actionOverdue ? "#f87171" : "var(--text-secondary)" }}>
                          {actionOverdue && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                          {new Date(lead.next_action_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--border-default)" }}>—</span>
                      )}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
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
