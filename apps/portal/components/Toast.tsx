"use client";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  onDone: () => void;
}

export function Toast({ message, type, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => setVisible(false), 2800);
    const done = setTimeout(onDone, 3200);
    return () => { clearTimeout(show); clearTimeout(hide); clearTimeout(done); };
  }, [onDone]);

  const isSuccess = type === "success";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 8,
        background: isSuccess ? "var(--green-bg)" : "#1c0a0a",
        border: `0.5px solid ${isSuccess ? "var(--green-border)" : "#7f1d1d"}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        pointerEvents: "none",
        minWidth: 220,
      }}
    >
      {isSuccess ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="7" cy="7" r="6.5" stroke="var(--green)" />
          <path d="M4 7l2 2 4-4" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="7" cy="7" r="6.5" stroke="#f87171" />
          <path d="M7 4v3.5M7 9.5v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      <span style={{ fontSize: 13, color: isSuccess ? "var(--green)" : "#fca5a5", fontWeight: 500 }}>
        {message}
      </span>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  function showToast(message: string, type: ToastType = "success") {
    setToast({ message, type });
  }

  function clearToast() {
    setToast(null);
  }

  return { toast, showToast, clearToast };
}
