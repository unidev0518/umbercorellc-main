"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Toast, useToast } from "@/components/Toast";

type LeadStatus = "new" | "contacted" | "qualified" | "rejected";
type MagicLinkRole = "client" | "developer";

interface Lead {
  id: string; type: string; status: LeadStatus; pipeline_stage: string | null;
  first_name: string; last_name: string; email: string;
  phone: string | null; company_name: string | null; job_type: string | null;
  message: string | null; location: string | null; service_interest: string | null;
  availability: string | null; source: string | null; notes: string | null;
  next_action_date: string | null; next_action_note: string | null;
  converted_at: string | null; converted_user_id: string | null;
  created_at: string;
}
interface MagicLink {
  id: string; role: MagicLinkRole; email: string; used: boolean;
  expires_at: string; created_at: string;
}
interface Activity {
  id: string; type: string; content: string;
  admin: { full_name: string } | null;
  created_at: string;
}

const CLIENT_STAGES = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "discovery_call", label: "Discovery" },
  { key: "proposal_sent", label: "Proposal" },
  { key: "negotiating", label: "Negotiating" },
  { key: "won", label: "Won" },
];
const CLIENT_TERMINAL = [{ key: "lost", label: "Lost" }];

const DEV_STAGES = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "screening", label: "Screening" },
  { key: "interview", label: "Interview" },
  { key: "tech_test", label: "Tech test" },
  { key: "offer_sent", label: "Offer sent" },
  { key: "hired", label: "Hired" },
];
const DEV_TERMINAL = [{ key: "rejected", label: "Rejected" }];

const CONTACT_STAGES = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "closed", label: "Closed" },
];

function getStages(type: string) {
  if (type === "client") return { main: CLIENT_STAGES, terminal: CLIENT_TERMINAL };
  if (type === "developer") return { main: DEV_STAGES, terminal: DEV_TERMINAL };
  return { main: CONTACT_STAGES, terminal: [] };
}

function isConvertible(type: string, stage: string | null) {
  if (type === "client") return stage === "won";
  if (type === "developer") return stage === "hired";
  return false;
}

const ACTIVITY_ICONS: Record<string, { icon: string; color: string }> = {
  note:         { icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color: "#60a5fa" },
  call:         { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", color: "#c4813a" },
  email:        { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "#a78bfa" },
  stage_change: { icon: "M13 7l5 5m0 0l-5 5m5-5H6", color: "#fbbf24" },
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function LeadDetailClient({ lead: initial, magicLinks: initialLinks }: { lead: Lead; magicLinks: MagicLink[] }) {
  const [lead, setLead] = useState(initial);
  const [links, setLinks] = useState(initialLinks);
  const [notes, setNotes] = useState(lead.notes || "");
  const [saving, setSaving] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityText, setActivityText] = useState("");
  const [activityType, setActivityType] = useState<"note" | "call" | "email">("note");
  const [addingActivity, setAddingActivity] = useState(false);
  const [nextActionDate, setNextActionDate] = useState(lead.next_action_date || "");
  const [nextActionNote, setNextActionNote] = useState(lead.next_action_note || "");
  const [savingNextAction, setSavingNextAction] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    fetch(`/api/leads/${lead.id}/activity`)
      .then(r => r.json())
      .then(d => setActivities(d.activities || []));
  }, [lead.id]);

  async function setStage(stage: string) {
    const prev = lead.pipeline_stage;
    setLead(l => ({ ...l, pipeline_stage: stage }));
    const res = await fetch("/api/leads", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, pipeline_stage: stage }),
    });
    if (!res.ok) {
      setLead(l => ({ ...l, pipeline_stage: prev }));
      showToast("Failed to update stage", "error");
    } else {
      const actRes = await fetch(`/api/leads/${lead.id}/activity`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "stage_change", content: `Moved to "${stage.replace(/_/g, " ")}"` }),
      });
      if (actRes.ok) { const d = await actRes.json(); setActivities(a => [d.activity, ...a]); }
    }
  }

  async function saveNotes() {
    setSaving(true);
    const res = await fetch("/api/leads", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, notes }),
    });
    const data = await res.json();
    if (!res.ok) showToast("Failed to save notes", "error");
    else { if (data.lead) setLead(data.lead); showToast("Notes saved"); }
    setSaving(false);
  }

  async function saveNextAction() {
    setSavingNextAction(true);
    const res = await fetch("/api/leads", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, next_action_date: nextActionDate || null, next_action_note: nextActionNote || null }),
    });
    const data = await res.json();
    if (!res.ok) showToast("Failed to save", "error");
    else { if (data.lead) setLead(data.lead); showToast("Saved"); }
    setSavingNextAction(false);
  }

  async function addActivity() {
    if (!activityText.trim()) return;
    setAddingActivity(true);
    const res = await fetch(`/api/leads/${lead.id}/activity`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: activityType, content: activityText.trim() }),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Failed", "error");
    else { setActivities(a => [data.activity, ...a]); setActivityText(""); }
    setAddingActivity(false);
  }

  async function generateLink() {
    setGeneratingLink(true);
    setGeneratedUrl(null);
    const role: MagicLinkRole = lead.type === "developer" ? "developer" : "client";
    const res = await fetch("/api/magic-links", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id: lead.id, email: lead.email, role }),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Failed", "error");
    else if (data.url) {
      setGeneratedUrl(data.url);
      const lr = await fetch(`/api/magic-links?lead_id=${lead.id}`).then(r => r.json());
      if (lr.links) setLinks(lr.links);
    }
    setGeneratingLink(false);
  }

  async function convertLead() {
    const role = lead.type === "client" ? "client" : "developer";
    if (!confirm(`Create a ${role} portal account for ${lead.first_name} ${lead.last_name}?\n\nA setup link will be generated for them.`)) return;
    setConverting(true);
    const res = await fetch(`/api/leads/${lead.id}/convert`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Conversion failed", "error");
    else {
      setConvertedUrl(data.magicUrl);
      setLead(l => ({ ...l, converted_at: new Date().toISOString(), pipeline_stage: role === "client" ? "won" : "hired" }));
      const actRes = await fetch(`/api/leads/${lead.id}/activity`).then(r => r.json());
      setActivities(actRes.activities || []);
      showToast(`${lead.first_name} converted to ${role}`);
    }
    setConverting(false);
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const { main: mainStages, terminal: terminalStages } = getStages(lead.type);
  const currentStage = lead.pipeline_stage || "new";
  const currentStageIdx = mainStages.findIndex(s => s.key === currentStage);
  const isConverted = !!lead.converted_at;
  const canConvert = isConvertible(lead.type, currentStage) && !isConverted;

  const infoFields = [
    { label: "Email", value: lead.email, icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "Phone", value: lead.phone, icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
    { label: "Company", value: lead.company_name, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { label: "Job type", value: lead.job_type, icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "Location", value: lead.location, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
    { label: "Service", value: lead.service_interest, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Availability", value: lead.availability, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Source", value: lead.source, icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
  ].filter(f => f.value);

  return (
    <div className="p-6 max-w-5xl">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}

      {/* Back */}
      <Link href="/leads" className="inline-flex items-center gap-1.5 text-xs mb-5 transition-colors"
        style={{ color: "var(--text-muted)" }}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to leads
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "var(--border-subtle)", color: "var(--text-primary)" }}>
            {lead.first_name[0]}{lead.last_name[0]}
          </div>
          <div>
            <h1 className="page-title mb-0.5">{lead.first_name} {lead.last_name}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs capitalize px-2 py-0.5 rounded"
                style={{ background: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                {lead.type}
              </span>
              {lead.source && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>via {lead.source}</span>
              )}
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(lead.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              {isConverted && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "var(--green-bg)", color: "var(--green)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  Converted
                </span>
              )}
            </div>
          </div>
        </div>
        {canConvert && (
          <button onClick={convertLead} disabled={converting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
            style={{ background: "var(--green)", color: "#000", opacity: converting ? 0.7 : 1 }}>
            {converting ? (
              "Converting…"
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Convert to {lead.type}
              </>
            )}
          </button>
        )}
      </div>

      {/* Pipeline */}
      {lead.type !== "contact" && (
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Pipeline</p>
            <div className="flex gap-2">
              {terminalStages.map(s => (
                <button key={s.key} onClick={() => setStage(s.key)}
                  className="text-xs px-2.5 py-1 rounded-lg transition-colors font-medium"
                  style={currentStage === s.key
                    ? { background: "#f8717118", color: "#f87171", border: "0.5px solid #f87171" }
                    : { color: "#f87171", border: "0.5px solid var(--border-subtle)" }
                  }>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative flex items-start">
            {/* Connector line */}
            <div className="absolute top-3 left-3 right-3 h-px" style={{ background: "var(--border-subtle)" }} />
            <div className="relative flex justify-between w-full">
              {mainStages.map((s, idx) => {
                const isActive = currentStage === s.key;
                const isPast = currentStageIdx > idx;
                return (
                  <button key={s.key} onClick={() => setStage(s.key)}
                    className="flex flex-col items-center gap-2 group"
                    style={{ minWidth: 0 }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center transition-all z-10 relative"
                      style={isActive
                        ? { background: "var(--green)", border: "2px solid var(--green)", boxShadow: "0 0 0 3px var(--green-bg)" }
                        : isPast
                        ? { background: "var(--green)", border: "2px solid var(--green)" }
                        : { background: "var(--bg-page)", border: "2px solid var(--border-subtle)" }
                      }>
                      {isPast && (
                        <svg className="w-3 h-3" fill="none" stroke="#000" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {isActive && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <span className="text-xs font-medium"
                      style={{
                        color: isActive ? "var(--green)" : isPast ? "var(--text-secondary)" : "var(--text-muted)",
                        fontSize: 10,
                        whiteSpace: "nowrap",
                      }}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Converted setup link banner */}
      {convertedUrl && (
        <div className="card p-4 mb-5" style={{ border: "0.5px solid var(--green)" }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--green-bg)" }}>
              <svg className="w-4 h-4" fill="none" stroke="var(--green)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--green)" }}>Portal account ready</p>
              <p className="text-xs font-mono break-all mb-2" style={{ color: "var(--text-muted)" }}>{convertedUrl}</p>
              <button onClick={() => copyText(convertedUrl, "converted")}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ background: "var(--green)", color: "#000" }}>
                {copied === "converted" ? "Copied!" : "Copy setup link"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Left: main content */}
        <div className="col-span-2 space-y-4">
          {/* Contact info */}
          <div className="card p-5">
            <p className="section-title mb-4">Contact information</p>
            <div className="grid grid-cols-2 gap-3">
              {infoFields.map(f => (
                <div key={f.label} className="flex items-start gap-2.5">
                  <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    style={{ color: "var(--text-muted)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{f.label}</p>
                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {lead.message && (
            <div className="card p-5">
              <p className="section-title mb-3">Message</p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-secondary)" }}>{lead.message}</p>
            </div>
          )}

          {/* Activity log */}
          <div className="card p-5">
            <p className="section-title mb-4">Activity</p>

            {/* Add activity */}
            <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid var(--border-subtle)" }}>
              <div className="flex gap-1.5 mb-3">
                {(["note", "call", "email"] as const).map(t => {
                  const cfg = ACTIVITY_ICONS[t];
                  return (
                    <button key={t} onClick={() => setActivityType(t)}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg capitalize transition-colors font-medium"
                      style={activityType === t
                        ? { background: cfg.color + "20", color: cfg.color, border: `0.5px solid ${cfg.color}40` }
                        : { color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }
                      }>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cfg.icon} />
                      </svg>
                      {t}
                    </button>
                  );
                })}
              </div>
              <textarea value={activityText} onChange={e => setActivityText(e.target.value)}
                rows={2} placeholder={`Log a ${activityType}…`}
                className="input resize-none w-full text-sm mb-2" />
              <div className="flex justify-end">
                <button onClick={addActivity} disabled={addingActivity || !activityText.trim()}
                  className="btn-primary text-xs px-3 py-1.5">
                  {addingActivity ? "Logging…" : "Add"}
                </button>
              </div>
            </div>

            {/* Timeline */}
            {activities.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>No activity yet</p>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: "var(--border-subtle)" }} />
                <div className="space-y-4">
                  {activities.map(act => {
                    const cfg = ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS.note;
                    return (
                      <div key={act.id} className="flex gap-4 relative">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                          style={{ background: "var(--bg-page)", border: `1.5px solid ${cfg.color}` }}>
                          <svg className="w-3 h-3" fill="none" stroke={cfg.color} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cfg.icon} />
                          </svg>
                        </div>
                        <div className="flex-1 pt-0.5 pb-1">
                          <p className="text-sm" style={{ color: "var(--text-primary)" }}>{act.content}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {act.admin?.full_name || "Admin"} · {timeAgo(act.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card p-5">
            <p className="section-title mb-3">Internal notes</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
              placeholder="Private notes about this lead…"
              className="input resize-none w-full text-sm" />
            <div className="mt-3 flex justify-end">
              <button onClick={saveNotes} disabled={saving} className="btn-primary text-sm">
                {saving ? "Saving…" : "Save notes"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-4">
          {/* Next action */}
          <div className="card p-4">
            <p className="section-title mb-3">Next action</p>
            <div className="space-y-2">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Date</label>
                <input type="date" value={nextActionDate} onChange={e => setNextActionDate(e.target.value)} className="input w-full text-sm" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>What to do</label>
                <input type="text" value={nextActionNote} onChange={e => setNextActionNote(e.target.value)}
                  placeholder="e.g. Send proposal" className="input w-full text-sm" />
              </div>
              <button onClick={saveNextAction} disabled={savingNextAction}
                className="w-full text-xs py-2 rounded-lg font-medium transition-colors mt-1"
                style={{ background: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                {savingNextAction ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          {/* Stage selector for contact type */}
          {lead.type === "contact" && (
            <div className="card p-4">
              <p className="section-title mb-3">Stage</p>
              <div className="space-y-1.5">
                {CONTACT_STAGES.map(s => (
                  <button key={s.key} onClick={() => setStage(s.key)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors"
                    style={currentStage === s.key
                      ? { background: "var(--green-bg)", border: "0.5px solid var(--green)", color: "var(--green)", fontWeight: 500 }
                      : { border: "0.5px solid var(--border-subtle)", color: "var(--text-muted)" }
                    }>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: currentStage === s.key ? "var(--green)" : "var(--border-default)" }} />
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Registration link */}
          <div className="card p-4">
            <p className="section-title mb-1">Registration link</p>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>48-hour invite — old link deleted on regenerate</p>
            <button onClick={generateLink} disabled={generatingLink}
              className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: "var(--border-subtle)", color: "var(--text-secondary)", border: "0.5px solid var(--border-subtle)" }}>
              {generatingLink ? "Generating…" : "Generate new link"}
            </button>

            {generatedUrl && (
              <div className="mt-3">
                <div className="rounded-lg px-3 py-2 text-xs break-all mb-2 font-mono"
                  style={{ background: "rgba(255,255,255,0.03)", color: "var(--text-muted)", border: "0.5px solid var(--border-subtle)" }}>
                  {generatedUrl}
                </div>
                <button onClick={() => copyText(generatedUrl, "generated")}
                  className="btn-primary w-full text-sm">
                  {copied === "generated" ? "Copied!" : "Copy link"}
                </button>
              </div>
            )}

            {links.filter(l => !l.used).length > 0 && !generatedUrl && (
              <div className="mt-3 pt-3" style={{ borderTop: "0.5px solid var(--border-subtle)" }}>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Active link</p>
                {links.filter(l => !l.used).slice(0, 1).map(link => (
                  <div key={link.id} className="text-xs" style={{ color: "var(--text-muted)" }}>
                    <span style={{ color: "var(--green)" }}>Active</span>
                    {" · "}Expires {new Date(link.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
