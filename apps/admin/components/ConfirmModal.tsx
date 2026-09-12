"use client";
import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  variant?: "danger" | "warning" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLE = {
  danger:  { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)", color: "#f87171", hover: "rgba(248,113,113,0.2)" },
  warning: { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)",  color: "#fbbf24", hover: "rgba(251,191,36,0.2)" },
  primary: { bg: "var(--green-bg)",         border: "var(--green-border)",   color: "var(--green)", hover: "rgba(52,211,153,0.2)" },
};

export function ConfirmModal({
  open, title, description, confirmLabel = "Confirm",
  variant = "danger", loading = false, onConfirm, onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onCancel(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const s = VARIANT_STYLE[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="card p-6 w-full max-w-sm" style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
        {/* Icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ background: s.bg, border: `1px solid ${s.border}` }}>
          {variant === "danger" ? (
            <svg className="w-5 h-5" fill="none" stroke={s.color} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          ) : variant === "warning" ? (
            <svg className="w-5 h-5" fill="none" stroke={s.color} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke={s.color} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <h2 className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>{title}</h2>
        {description && <p className="text-xs leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>{description}</p>}

        <div className="flex gap-2 mt-5">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{ background: s.bg, border: `0.5px solid ${s.border}`, color: s.color }}
            onMouseEnter={e => (e.currentTarget.style.background = s.hover)}
            onMouseLeave={e => (e.currentTarget.style.background = s.bg)}>
            {loading ? "Please wait…" : confirmLabel}
          </button>
          <button ref={cancelRef} onClick={onCancel} disabled={loading} className="flex-1 btn-ghost text-xs">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
