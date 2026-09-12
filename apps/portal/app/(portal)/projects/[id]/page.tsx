import { cookies } from "next/headers";
import { adminClient, browserClient } from "@/lib/supabase";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

const STATUS_STEPS = ["active", "paused", "completed"];
const STATUS_LABEL: Record<string, string> = {
  active: "Active", paused: "Paused", completed: "Completed", cancelled: "Cancelled",
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_session")?.value;
  if (!token) redirect("/login");

  const { data: { user } } = await browserClient().auth.getUser(token);
  if (!user) redirect("/login");

  const db = adminClient();
  const { data: project } = await db
    .from("projects")
    .select(`
      *,
      members:project_members(id, role_label, developer:portal_users!developer_id(full_name, email)),
      developer:portal_users!developer_id(id, full_name, email),
      account_manager:admin_users!account_manager_id(full_name, email)
    `)
    .eq("id", id)
    .eq("client_id", user.id)
    .single();

  if (!project) notFound();

  const team = [...((project.members as { id: string; role_label?: string; developer: { full_name: string; email: string } }[] | null) || [])];
  if (team.length === 0 && project.developer) {
    team.push({
      id: project.developer.id,
      role_label: "Developer",
      developer: project.developer,
    });
  }

  const statusIdx = STATUS_STEPS.indexOf(project.status);

  return (
    <div className="p-6 max-w-2xl">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm mb-4 transition-colors" style={{ color: "var(--text-muted)" }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Projects
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="page-title">{project.name}</h1>
          {project.description && <p className="page-sub mt-1">{project.description}</p>}
        </div>
        <span className={`badge badge-${project.status} ml-4 flex-shrink-0`}>{project.status}</span>
      </div>

      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="section-title" style={{ margin: 0 }}>Status</p>
          <span className="text-xs font-medium" style={{ color: "var(--green)" }}>{STATUS_LABEL[project.status] || project.status}</span>
        </div>
        <div className="flex items-center">
          {STATUS_STEPS.map((st, i) => {
            const done = i < statusIdx;
            const current = i === statusIdx;
            return (
              <div key={st} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 52 }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: current || done ? "var(--green-bg)" : "var(--bg-card)",
                      border: `1.5px solid ${current ? "var(--green)" : done ? "var(--green-border)" : "var(--border-default)"}`,
                    }}>
                    {done ? (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold" style={{ color: current ? "var(--green)" : "var(--text-muted)" }}>{i + 1}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: current ? "var(--green)" : "var(--text-muted)" }}>
                    {STATUS_LABEL[st]}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-1 mb-4" style={{ background: i < statusIdx ? "var(--green-border)" : "var(--border-subtle)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      {(project.start_date || project.end_date) && (
        <div className="card p-5 mb-4 flex gap-8">
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Start</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {project.start_date ? new Date(project.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>End</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {project.end_date ? new Date(project.end_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
            </p>
          </div>
        </div>
      )}

      {/* Team */}
      <div className="card p-5 mb-4">
        <p className="section-title">Your team</p>
        {!team.length ? (
          <p className="text-sm py-2" style={{ color: "var(--text-muted)" }}>Team members will appear here once assigned.</p>
        ) : (
          <div className="space-y-3 mt-1">
            {team.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "var(--green-bg)", border: "1px solid var(--green-border)", color: "var(--green)" }}>
                  {m.developer.full_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{m.developer.full_name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.role_label || "Developer"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UmberCore contact */}
      {project.account_manager && (
        <div className="card p-5 mb-4">
          <p className="section-title">Your UmberCore contact</p>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-default)", color: "var(--text-secondary)" }}>
              {(project.account_manager as any).full_name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{(project.account_manager as any).full_name}</p>
              <a href={`mailto:${(project.account_manager as any).email}`} className="text-xs" style={{ color: "var(--green)" }}>
                {(project.account_manager as any).email}
              </a>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
        Questions? Email{" "}
        <a href="mailto:support@umbercore.com" style={{ color: "var(--green)" }}>support@umbercore.com</a>
      </p>
    </div>
  );
}
