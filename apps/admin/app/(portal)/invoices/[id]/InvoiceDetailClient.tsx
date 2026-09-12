"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toast, useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";

interface LineItem { id: string; description: string; quantity: number; unit_price: number; amount: number; }
interface Invoice {
  id: string; invoice_number: string; status: string; amount: number; currency: string;
  issued_date: string | null; due_date: string | null; paid_date: string | null; notes: string | null;
  project: { id: string; name: string } | null;
  client: { id: string; full_name: string; company_name: string | null; email: string } | null;
  creator: { id: string; full_name: string } | null;
  items: LineItem[];
}

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  draft:     { color: "var(--text-muted)", bg: "transparent",     border: "var(--border-default)" },
  sent:      { color: "#60a5fa",           bg: "#0d1c2e",         border: "#1e3a5f" },
  paid:      { color: "var(--green)",      bg: "var(--green-bg)", border: "var(--green-border)" },
  overdue:   { color: "#f87171",           bg: "#1c0a0a",         border: "#7f1d1d" },
  cancelled: { color: "var(--text-muted)", bg: "transparent",     border: "var(--border-subtle)" },
};

function fmtMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function InvoiceDetailClient({ invoice: initial }: { invoice: Invoice }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState(initial);
  const [acting, setActing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"send" | "paid" | "cancel" | null>(null);
  const { toast, showToast, clearToast } = useToast();

  async function patch(updates: Record<string, unknown>, msg: string) {
    setActing(true);
    const res = await fetch("/api/invoices", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: invoice.id, ...updates }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || "Failed", "error"); }
    else { setInvoice(data.invoice); showToast(msg); }
    setActing(false);
  }

  const st = STATUS_STYLE[invoice.status] || STATUS_STYLE.draft;
  const subtotal = invoice.items.reduce((s, it) => s + Number(it.amount), 0);

  async function executeAction() {
    const a = confirmAction;
    setConfirmAction(null);
    if (a === "send") await patch({ status: "sent", issued_date: new Date().toISOString().split("T")[0] }, "Invoice sent");
    else if (a === "paid") await patch({ status: "paid" }, "Invoice marked as paid");
    else if (a === "cancel") await patch({ status: "cancelled" }, "Invoice cancelled");
  }

  const CONFIRM_CONFIG = {
    send:   { title: "Send invoice?", description: "This will mark the invoice as sent. The client will be notified.", label: "Send invoice", variant: "warning" as const },
    paid:   { title: "Mark as paid?", description: "This records the payment. Make sure you have received the funds before confirming.", label: "Mark as paid", variant: "primary" as const },
    cancel: { title: "Cancel invoice?", description: "This will mark the invoice as cancelled. This cannot be undone.", label: "Cancel invoice", variant: "danger" as const },
  };

  return (
    <div className="p-6 max-w-3xl">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}
      {confirmAction && (
        <ConfirmModal
          open={true}
          title={CONFIRM_CONFIG[confirmAction].title}
          description={CONFIRM_CONFIG[confirmAction].description}
          confirmLabel={CONFIRM_CONFIG[confirmAction].label}
          variant={CONFIRM_CONFIG[confirmAction].variant}
          loading={acting}
          onConfirm={executeAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/invoices" className="text-xs mb-2 flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: "var(--text-muted)" }}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Invoices
          </Link>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="page-title font-mono">{invoice.invoice_number}</h1>
            <span className="text-xs font-medium px-2.5 py-1 rounded capitalize"
              style={{ background: st.bg, color: st.color, border: `0.5px solid ${st.border}` }}>
              {invoice.status}
            </span>
          </div>
          <p className="page-sub mt-0.5">{invoice.project?.name || "—"}</p>
        </div>

        <div className="flex items-center gap-2">
          {invoice.status === "draft" && (
            <button onClick={() => setConfirmAction("send")}
              disabled={acting} className="btn-primary text-xs" style={{ background: "#0d1c2e", borderColor: "#1e3a5f", color: "#60a5fa" }}>
              Mark as sent
            </button>
          )}
          {(invoice.status === "sent" || invoice.status === "overdue") && (
            <button onClick={() => setConfirmAction("paid")} disabled={acting} className="btn-primary text-xs">
              Mark as paid
            </button>
          )}
          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
            <button onClick={() => setConfirmAction("cancel")} disabled={acting}
              className="btn-ghost text-xs" style={{ color: "var(--text-muted)" }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 220px" }}>
        {/* Main */}
        <div className="space-y-4">
          {/* Line items */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
              <p className="section-title">Line items</p>
            </div>
            {invoice.items.length === 0 ? (
              <p className="px-5 py-4 text-sm" style={{ color: "var(--text-muted)" }}>No line items</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
                    <th className="th text-left">Description</th>
                    <th className="th text-right">Qty</th>
                    <th className="th text-right">Unit price</th>
                    <th className="th text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map(it => (
                    <tr key={it.id} className="tr">
                      <td className="td text-sm" style={{ color: "var(--text-secondary)" }}>{it.description}</td>
                      <td className="td text-right text-sm" style={{ color: "var(--text-muted)" }}>{it.quantity}</td>
                      <td className="td text-right text-sm" style={{ color: "var(--text-muted)" }}>{fmtMoney(it.unit_price, invoice.currency)}</td>
                      <td className="td text-right text-sm font-medium" style={{ color: "var(--text-primary)" }}>{fmtMoney(it.amount, invoice.currency)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "0.5px solid var(--border-default)" }}>
                    <td colSpan={3} className="td text-right text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Total</td>
                    <td className="td text-right font-bold" style={{ color: "var(--text-primary)", fontSize: 15 }}>
                      {fmtMoney(invoice.amount, invoice.currency)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="card p-5">
              <p className="section-title mb-2">Notes</p>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Amount */}
          <div className="card p-5 text-center">
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Invoice total</p>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {fmtMoney(invoice.amount, invoice.currency)}
            </p>
          </div>

          {/* Details */}
          <div className="card p-5 space-y-3">
            <p className="section-title">Details</p>
            <Detail label="Client" value={invoice.client ? (invoice.client.company_name || invoice.client.full_name) : "—"} />
            {invoice.client?.email && <Detail label="Email" value={invoice.client.email} />}
            <Detail label="Project">
              {invoice.project
                ? <Link href={`/projects/${invoice.project.id}`} className="hover:underline" style={{ color: "var(--green)" }}>{invoice.project.name}</Link>
                : "—"}
            </Detail>
            <Detail label="Issued" value={fmtDate(invoice.issued_date)} />
            <Detail label="Due" value={fmtDate(invoice.due_date)} />
            {invoice.paid_date && <Detail label="Paid" value={fmtDate(invoice.paid_date)} />}
            {invoice.creator && <Detail label="Created by" value={invoice.creator.full_name} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{children || value}</p>
    </div>
  );
}
