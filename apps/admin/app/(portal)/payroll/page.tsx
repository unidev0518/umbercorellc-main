"use client";
import { useEffect, useState, useCallback } from "react";
import { Toast, useToast } from "@/components/Toast";
import { SkeletonTable } from "@/components/Skeleton";

interface Entry { id: string; date: string; hours: number; project: { name: string }; }
interface PaymentMethod {
  id: string; label: string; payment_type: string; percent: number;
  bank_name: string | null; account_holder_name: string | null;
  account_number: string | null; routing_number: string | null;
  iban: string | null; swift_bic: string | null;
  paypal_email: string | null; wise_email: string | null; other_details: string | null;
}
interface Payment { id: string; period_start: string; period_end: string; hours: number; amount: number; paid_date: string; status: string; }
interface DevRow {
  developer: { id: string; full_name: string; email: string };
  totalHours: number; suggestedAmount: number; entries: Entry[];
  paymentMethods: PaymentMethod[];
  paymentHistory: Payment[]; periodStart: string | null; periodEnd: string | null;
}

function mask(s: string | null) {
  if (!s) return "—";
  return s.length > 4 ? "••••" + s.slice(-4) : "••••";
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

const METHOD_LABEL: Record<string, string> = { bank_transfer: "Bank transfer", wise: "Wise", paypal: "PayPal", other: "Other" };

export default function PayrollPage() {
  const [developers, setDevelopers] = useState<DevRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [payModal, setPayModal] = useState<DevRow | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/payroll");
    const data = await res.json();
    setDevelopers(data.developers || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 max-w-5xl">
      {toast && <Toast message={toast.message} type={toast.type} onDone={clearToast} />}
      {payModal && (
        <PayModal
          dev={payModal}
          onClose={() => setPayModal(null)}
          onPaid={() => { setPayModal(null); showToast("Payment recorded"); load(); }}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll</h1>
          <p className="page-sub">Developers with hours pending payment</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="stat-card">
          <p className="stat-label">Awaiting payment</p>
          <p className="stat-value" style={{ color: developers.length > 0 ? "#fbbf24" : "var(--text-muted)" }}>
            {loading ? "—" : developers.length}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total unpaid hours</p>
          <p className="stat-value">{loading ? "—" : `${developers.reduce((s, d) => s + d.totalHours, 0).toFixed(1)}h`}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Developers with bank details</p>
          <p className="stat-value" style={{ color: "var(--green)" }}>
            {loading ? "—" : developers.filter(d => d.paymentMethods.length > 0).length} / {developers.length}
          </p>
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={4} cols={5} />
      ) : developers.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: "var(--green-bg)", border: "1px solid var(--green-border)" }}>
            <svg className="w-5 h-5" fill="none" stroke="var(--green)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>All caught up</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>No developers have unpaid hours.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {developers.map(d => {
            const isOpen = expanded === d.developer.id;
            const hasBank = d.paymentMethods.length > 0;

            return (
              <div key={d.developer.id} className="card overflow-hidden">
                {/* Row header */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: "var(--green-bg)", border: "1px solid var(--green-border)", color: "var(--green)" }}>
                      {d.developer.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{d.developer.full_name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{d.developer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{d.totalHours.toFixed(1)}h unpaid</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {fmtDate(d.periodStart)} — {fmtDate(d.periodEnd)}
                      </p>
                    </div>

                    {!hasBank && (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ color: "#fbbf24", background: "#1a1200", border: "0.5px solid #422d00" }}>
                        No bank details
                      </span>
                    )}

                    <button onClick={() => setPayModal(d)} className="btn-primary text-xs py-1.5 px-3">
                      Mark as paid
                    </button>

                    <button onClick={() => setExpanded(isOpen ? null : d.developer.id)} className="btn-ghost p-1.5">
                      <svg className="w-4 h-4 transition-transform" style={{ color: "var(--text-muted)", transform: isOpen ? "rotate(180deg)" : "none" }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ borderTop: "0.5px solid var(--border-subtle)" }}>
                    <div className="grid gap-0" style={{ gridTemplateColumns: "1fr 1fr" }}>

                      {/* Time entries */}
                      <div className="p-5" style={{ borderRight: "0.5px solid var(--border-subtle)" }}>
                        <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>APPROVED HOURS</p>
                        <table className="w-full">
                          <thead><tr style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
                            <th className="th text-left">Date</th>
                            <th className="th text-left">Project</th>
                            <th className="th text-right">Hours</th>
                          </tr></thead>
                          <tbody>
                            {d.entries.map(e => (
                              <tr key={e.id} className="tr">
                                <td className="td text-xs" style={{ color: "var(--text-muted)" }}>{fmtDate(e.date)}</td>
                                <td className="td text-xs" style={{ color: "var(--text-secondary)" }}>{e.project?.name}</td>
                                <td className="td text-right text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{e.hours}h</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot><tr style={{ borderTop: "0.5px solid var(--border-default)" }}>
                            <td colSpan={2} className="td text-xs font-semibold text-right" style={{ color: "var(--text-muted)" }}>Total</td>
                            <td className="td text-right font-bold" style={{ color: "var(--text-primary)" }}>{d.totalHours.toFixed(1)}h</td>
                          </tr></tfoot>
                        </table>
                      </div>

                      {/* Bank details + history */}
                      <div className="p-5 space-y-4">
                        <div>
                          <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>PAYMENT SPLIT</p>
                          {!hasBank ? (
                            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Developer has not added payment methods yet.</p>
                          ) : (
                            <div className="space-y-3">
                              {d.paymentMethods.map((m, i) => {
                                const splitAmount = d.suggestedAmount * (m.percent / 100);
                                const colors = ["var(--green)", "#60a5fa", "#a78bfa", "#fb923c"];
                                const color = colors[i % 4];
                                return (
                                  <div key={m.id} className="rounded-lg p-3" style={{ border: "0.5px solid var(--border-subtle)", background: "rgba(255,255,255,0.01)" }}>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                                        <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                                          {m.label || METHOD_LABEL[m.payment_type]}
                                        </span>
                                        <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: color + "20", color }}>
                                          {m.percent}%
                                        </span>
                                      </div>
                                      {d.suggestedAmount > 0 && (
                                        <span className="text-sm font-bold" style={{ color }}>{fmtMoney(splitAmount)}</span>
                                      )}
                                    </div>
                                    <div className="space-y-1">
                                      <BankRow label="Type" value={METHOD_LABEL[m.payment_type] || m.payment_type} />
                                      {m.payment_type === "bank_transfer" && (<>
                                        <BankRow label="Account holder" value={m.account_holder_name} />
                                        <BankRow label="Bank" value={m.bank_name} />
                                        <BankRow label="Account #" value={mask(m.account_number)} />
                                        <BankRow label="Routing #" value={m.routing_number} />
                                        {m.iban && <BankRow label="IBAN" value={m.iban} />}
                                        {m.swift_bic && <BankRow label="SWIFT" value={m.swift_bic} />}
                                      </>)}
                                      {m.payment_type === "wise" && <BankRow label="Wise email" value={m.wise_email} />}
                                      {m.payment_type === "paypal" && <BankRow label="PayPal email" value={m.paypal_email} />}
                                      {m.other_details && <BankRow label="Details" value={m.other_details} />}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {d.paymentHistory.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>PAYMENT HISTORY</p>
                            <div className="space-y-1">
                              {d.paymentHistory.slice(0, 4).map(p => (
                                <div key={p.id} className="flex items-center justify-between text-xs">
                                  <span style={{ color: "var(--text-muted)" }}>{fmtDate(p.period_start)} — {fmtDate(p.period_end)}</span>
                                  <div className="flex items-center gap-2">
                                    <span style={{ color: "var(--text-secondary)" }}>{p.hours}h</span>
                                    <span className="font-semibold" style={{ color: "var(--green)" }}>{fmtMoney(p.amount)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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

function BankRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{value || "—"}</span>
    </div>
  );
}

// ── Pay Modal ─────────────────────────────────────────────────────────────────
function PayModal({ dev, onClose, onPaid }: { dev: DevRow; onClose: () => void; onPaid: () => void }) {
  const [amount, setAmount] = useState(dev.suggestedAmount > 0 ? dev.suggestedAmount.toFixed(2) : "");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) { setError("Enter a valid amount"); return; }
    setSaving(true);
    const res = await fetch("/api/payroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        developer_id: dev.developer.id,
        period_start: dev.periodStart,
        period_end: dev.periodEnd,
        hours: dev.totalHours,
        amount: parseFloat(amount),
        notes,
      }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed"); setSaving(false); return; }
    onPaid();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="card p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <p className="section-title">Record payment — {dev.developer.full_name}</p>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="card p-3 mb-4 space-y-1" style={{ background: "var(--bg-page)" }}>
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--text-muted)" }}>Period</span>
            <span style={{ color: "var(--text-secondary)" }}>{fmtDate(dev.periodStart)} — {fmtDate(dev.periodEnd)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--text-muted)" }}>Hours</span>
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{dev.totalHours.toFixed(1)}h</span>
          </div>
          {dev.paymentMethods.length > 0 && (
            <div className="pt-1 mt-1" style={{ borderTop: "0.5px solid var(--border-subtle)" }}>
              {dev.paymentMethods.map((m, i) => {
                const colors = ["var(--green)", "#60a5fa", "#a78bfa", "#fb923c"];
                const splitAmt = parseFloat(amount || "0") * (m.percent / 100);
                return (
                  <div key={m.id} className="flex justify-between text-xs mt-1">
                    <span className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors[i % 4] }} />
                      {m.label || METHOD_LABEL[m.payment_type]} ({m.percent}%)
                    </span>
                    <span className="font-semibold" style={{ color: colors[i % 4] }}>
                      {fmtMoney(splitAmt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="field-label mb-0">Amount paid (USD)</label>
              {dev.suggestedAmount > 0 && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Suggested: <button className="font-semibold" style={{ color: "var(--green)" }}
                    onClick={() => setAmount(dev.suggestedAmount.toFixed(2))}>
                    {fmtMoney(dev.suggestedAmount)}
                  </button>
                </span>
              )}
            </div>
            <input type="number" value={amount} onChange={e => { setAmount(e.target.value); setError(""); }}
              className="input w-full" placeholder="0.00" min="0" step="0.01" required autoFocus />
            {dev.suggestedAmount === 0 && (
              <p className="text-xs mt-1" style={{ color: "#fbbf24" }}>
                No hourly rate set on project assignments — enter amount manually.
              </p>
            )}
          </div>
          <div>
            <label className="field-label">Notes (optional)</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} className="input w-full" placeholder="Wire reference, invoice #…" />
          </div>
          {error && <p className="error-box">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Confirm payment"}</button>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
