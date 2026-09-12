import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

interface InvoiceSentProps {
  clientName: string;
  invoiceNumber: string;
  projectName: string;
  amount: string;
  dueDate: string | null;
  portalUrl: string;
  notes?: string | null;
}

export function InvoiceSentEmail({ clientName, invoiceNumber, projectName, amount, dueDate, portalUrl, notes }: InvoiceSentProps) {
  const preview = `Invoice ${invoiceNumber} for ${amount} — ${projectName}`;

  return (
    <EmailLayout preview={preview} heading={`Invoice ${invoiceNumber}`}>
      <Text style={text}>Hi {clientName},</Text>
      <Text style={text}>
        Please find your invoice for <strong>{projectName}</strong> attached below.
      </Text>

      <Section style={invoiceBox}>
        <div style={row}>
          <span style={label}>Invoice #</span>
          <span style={value}>{invoiceNumber}</span>
        </div>
        <div style={row}>
          <span style={label}>Project</span>
          <span style={value}>{projectName}</span>
        </div>
        <div style={row}>
          <span style={label}>Amount due</span>
          <span style={{ ...value, fontWeight: "700", fontSize: "18px", color: "#0f172a" }}>{amount}</span>
        </div>
        {dueDate && (
          <div style={row}>
            <span style={label}>Due date</span>
            <span style={value}>{dueDate}</span>
          </div>
        )}
      </Section>

      {notes && (
        <Section style={notesBox}>
          <Text style={{ ...text, margin: 0, fontSize: "13px", color: "#334155" }}>{notes}</Text>
        </Section>
      )}

      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button href={portalUrl} style={btn}>View in portal</Button>
      </Section>

      <Text style={small}>
        Questions about this invoice? Reply to this email or contact your account manager.
      </Text>
    </EmailLayout>
  );
}

const text      = { color: "#334155", fontSize: "15px", lineHeight: "1.6", margin: "0 0 12px" };
const small     = { color: "#94a3b8", fontSize: "12px", lineHeight: "1.6", margin: "12px 0 0" };
const invoiceBox= { backgroundColor: "#f8fafc", borderRadius: "6px", padding: "16px", margin: "16px 0" };
const row       = { display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e2e8f0" };
const label     = { color: "#64748b", fontSize: "13px" };
const value     = { color: "#334155", fontSize: "14px", fontWeight: "500" as const };
const notesBox  = { backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", padding: "12px", margin: "0 0 12px" };
const btn       = { backgroundColor: "#b56a28", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", fontSize: "15px", fontWeight: "600", textDecoration: "none", display: "inline-block" };
