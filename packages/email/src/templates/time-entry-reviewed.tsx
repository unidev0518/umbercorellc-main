import { Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

interface TimeEntryReviewedProps {
  developerName: string;
  action: "approved" | "rejected";
  entries: { project: string; date: string; hours: number }[];
  rejectReason?: string;
}

export function TimeEntryReviewedEmail({ developerName, action, entries, rejectReason }: TimeEntryReviewedProps) {
  const totalHours = entries.reduce((s, e) => s + e.hours, 0);
  const preview = action === "approved"
    ? `${totalHours}h approved — your time entries have been reviewed`
    : `Time entries rejected — action required`;

  return (
    <EmailLayout preview={preview} heading={action === "approved" ? "Time entries approved" : "Time entries rejected"}>
      <Text style={text}>Hi {developerName},</Text>
      <Text style={text}>
        {action === "approved"
          ? `Your time entries totalling ${totalHours}h have been approved.`
          : `The following time entries have been rejected and require your attention.`}
      </Text>

      <Section style={table}>
        <div style={tableHeader}>
          <span style={{ flex: 2 }}>Project</span>
          <span style={{ flex: 1 }}>Date</span>
          <span style={{ flex: 1, textAlign: "right" as const }}>Hours</span>
        </div>
        {entries.map((e, i) => (
          <div key={i} style={tableRow}>
            <span style={{ flex: 2, color: "#334155" }}>{e.project}</span>
            <span style={{ flex: 1, color: "#64748b" }}>{e.date}</span>
            <span style={{ flex: 1, textAlign: "right" as const, color: "#334155", fontWeight: "600" }}>{e.hours}h</span>
          </div>
        ))}
        <div style={{ ...tableRow, borderTop: "2px solid #e2e8f0", fontWeight: "600" as const }}>
          <span style={{ flex: 2, color: "#0f172a" }}>Total</span>
          <span style={{ flex: 1 }} />
          <span style={{ flex: 1, textAlign: "right" as const, color: "#0f172a" }}>{totalHours}h</span>
        </div>
      </Section>

      {action === "rejected" && rejectReason && (
        <Section style={reasonBox}>
          <Text style={{ ...text, margin: 0, color: "#7f1d1d", fontWeight: "600" }}>Reason:</Text>
          <Text style={{ ...text, margin: "4px 0 0", color: "#991b1b" }}>{rejectReason}</Text>
        </Section>
      )}

      {action === "rejected" && (
        <Text style={text}>Please log into your portal to resubmit the corrected entries.</Text>
      )}
    </EmailLayout>
  );
}

const text       = { color: "#334155", fontSize: "15px", lineHeight: "1.6", margin: "0 0 12px" };
const table      = { backgroundColor: "#f8fafc", borderRadius: "6px", padding: "12px", margin: "16px 0" };
const tableHeader= { display: "flex", gap: "8px", padding: "0 0 8px", borderBottom: "1px solid #e2e8f0", color: "#94a3b8", fontSize: "12px", fontWeight: "600" as const };
const tableRow   = { display: "flex", gap: "8px", padding: "8px 0", borderBottom: "1px solid #e2e8f0", fontSize: "14px" };
const reasonBox  = { backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "12px", margin: "12px 0" };
