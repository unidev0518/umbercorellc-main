interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-default)" }}>
        <svg className="w-5 h-5" fill="none" stroke="var(--text-muted)" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>{title}</p>
      {subtitle && <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
