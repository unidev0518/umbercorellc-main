import LogoutButton from "@/components/LogoutButton";

export default function NoAccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-32 text-center px-6">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-default)" }}>
        <svg className="w-5 h-5" fill="none" stroke="var(--text-muted)" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>No access</p>
      <p className="text-xs max-w-xs mb-6" style={{ color: "var(--text-muted)" }}>
        You don't have permission to access any section. Ask a super admin to assign you permissions.
      </p>
      <LogoutButton />
    </div>
  );
}
