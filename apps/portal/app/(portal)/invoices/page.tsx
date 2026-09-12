"use client";
import { useEffect, useState } from "react";

interface LineItem { id: string; description: string; quantity: number; unit_price: number; amount: number; }
interface Invoice {
  id: string; invoice_number: string; status: string; amount: number; currency: string;
  issued_date: string | null; due_date: string | null; paid_date: string | null; notes: string | null;
  project: { id: string; name: string } | null;
  items: LineItem[];
}

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  draft:     { color: "var(--text-muted)",  bg: "transparent",     border: "var(--border-default)" },
  sent:      { color: "#60a5fa",            bg: "#0d1c2e",         border: "#1e3a5f" },
  paid:      { color: "var(--green)",       bg: "var(--green-bg)", border: "var(--green-border)" },
  overdue:   { color: "#f87171",            bg: "#1c0a0a",         border: "#7f1d1d" },
  cancelled: { color: "var(--text-muted)",  bg: "transparent",     border: "var(--border-subtle)" },
};

function fmtMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PortalInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/invoices").then(r => r.json()).then(d => {
      setInvoices(d.invoices || []);
      setLoading(false);
    });
  }, []);

  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const totalOutstanding = invoices.filter(i => ["sent", "overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="page-title">Invoices</h1>
        <p className="page-sub">Your billing history with UmberCore</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="stat-card">
          <p className="stat-label">Outstanding</p>
          <p className="stat-value" style={{ color: totalOutstanding > 0 ? "#60a5fa" : "var(--text-muted)" }}>
            {fmtMoney(totalOutstanding)}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total paid</p>
          <p className="stat-value" style={{ color: "var(--green)" }}>{fmtMoney(totalPaid)}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>
      ) : invoices.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>No invoices yet</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Invoices will appear here once your engagement is billed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => {
            const st = STATUS_STYLE[inv.status] || STATUS_STYLE.draft;
            const isExpanded = expanded === inv.id;
            const isOverdue = inv.status === "overdue";

            return (
              <div key={inv.id} className="card overflow-hidden">
                {/* Row */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : inv.id)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-semibold font-mono" style={{ color: "var(--text-primary)" }}>
                        {inv.invoice_number}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {inv.project?.name || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {fmtMoney(inv.amount, inv.currency)}
                      </p>
                      {inv.due_date && inv.status !== "paid" && (
                        <p className="text-xs" style={{ color: isOverdue ? "#f87171" : "var(--text-muted)" }}>
                          Due {fmtDate(inv.due_date)}{isOverdue ? " — overdue" : ""}
                        </p>
                      )}
                      {inv.status === "paid" && inv.paid_date && (
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Paid {fmtDate(inv.paid_date)}</p>
                      )}
                    </div>

                    <span className="text-xs font-medium px-2.5 py-1 rounded capitalize flex-shrink-0"
                      style={{ background: st.bg, color: st.color, border: `0.5px solid ${st.border}` }}>
                      {inv.status}
                    </span>

                    <svg className="w-4 h-4 flex-shrink-0 transition-transform" style={{ color: "var(--text-muted)", transform: isExpanded ? "rotate(180deg)" : "none" }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ borderTop: "0.5px solid var(--border-subtle)" }}>
                    {inv.items.length > 0 && (
                      <div className="px-5 py-4">
                        <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>LINE ITEMS</p>
                        <table className="w-full">
                          <thead><tr style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
                            <th className="th text-left">Description</th>
                            <th className="th text-right">Qty</th>
                            <th className="th text-right">Unit</th>
                            <th className="th text-right">Amount</th>
                          </tr></thead>
                          <tbody>
                            {inv.items.map(it => (
                              <tr key={it.id} className="tr">
                                <td className="td text-sm" style={{ color: "var(--text-secondary)" }}>{it.description}</td>
                                <td className="td text-right text-xs" style={{ color: "var(--text-muted)" }}>{it.quantity}</td>
                                <td className="td text-right text-xs" style={{ color: "var(--text-muted)" }}>
                                  {fmtMoney(it.unit_price, inv.currency)}
                                </td>
                                <td className="td text-right text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                  {fmtMoney(it.amount, inv.currency)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr style={{ borderTop: "0.5px solid var(--border-default)" }}>
                              <td colSpan={3} className="td text-right text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Total</td>
                              <td className="td text-right font-bold" style={{ color: "var(--text-primary)", fontSize: 15 }}>
                                {fmtMoney(inv.amount, inv.currency)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}

                    {inv.notes && (
                      <div className="px-5 pb-4">
                        <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>NOTES</p>
                        <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{inv.notes}</p>
                      </div>
                    )}

                    <div className="px-5 pb-4 flex gap-6 text-xs" style={{ color: "var(--text-muted)" }}>
                      {inv.issued_date && <span>Issued: <span style={{ color: "var(--text-secondary)" }}>{fmtDate(inv.issued_date)}</span></span>}
                      {inv.due_date    && <span>Due: <span style={{ color: isOverdue ? "#f87171" : "var(--text-secondary)" }}>{fmtDate(inv.due_date)}</span></span>}
                      {inv.paid_date  && <span>Paid: <span style={{ color: "var(--green)" }}>{fmtDate(inv.paid_date)}</span></span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
