import { cookies } from "next/headers";
import { adminClient, browserClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

type AssignmentProject = {
  name: string;
  status: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  client?: { full_name: string; company_name: string | null };
};

type Assignment = {
  id: string;
  role_label?: string;
  project: AssignmentProject | null;
};

function hasProject(a: Assignment): a is Assignment & { project: AssignmentProject } {
  return a.project != null;
}

export default async function AssignmentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_session")?.value;
  if (!token) redirect("/login");

  const { data: { user } } = await browserClient().auth.getUser(token);
  if (!user) redirect("/login");

  const db = adminClient();
  const [{ data: memberRows }, { data: ownedProjects }] = await Promise.all([
    db.from("project_members")
      .select(`*, project:projects(id, name, status, description, start_date, end_date, client:portal_users!client_id(full_name, company_name))`)
      .eq("developer_id", user.id),
    db.from("projects")
      .select(`id, name, status, description, start_date, end_date, client:portal_users!client_id(full_name, company_name)`)
      .eq("developer_id", user.id),
  ]);

  const assignments = [
    ...(memberRows || []).map((row: { id: string; role_label?: string; project: Record<string, unknown> }) => ({
      id: row.id,
      role_label: row.role_label,
      project: row.project,
    })),
  ];
  const seen = new Set(assignments.map(a => (a.project as { id: string } | null)?.id).filter(Boolean));
  for (const project of ownedProjects || []) {
    if (seen.has(project.id)) continue;
    assignments.push({ id: project.id, role_label: "Developer", project });
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="page-title">Assignments</h1>
        <p className="page-sub">Your current and past engagements</p>
      </div>

      {!assignments || assignments.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: "var(--border-subtle)" }}>
            <svg className="w-5 h-5" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>No assignments yet</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Your account manager will notify you when a match is found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(assignments as Assignment[]).filter(hasProject).map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{a.project.name}</h2>
                  {a.project.client && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {a.project.client.company_name || a.project.client.full_name}
                    </p>
                  )}
                </div>
                <span className={`badge badge-${a.project.status} ml-3 flex-shrink-0`}>{a.project.status}</span>
              </div>
              {a.project.description && <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{a.project.description}</p>}
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                {a.role_label && <span>{a.role_label}</span>}
                {a.project.start_date && <span>Started {new Date(a.project.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>}
                {a.project.end_date && <span>Until {new Date(a.project.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>
        Questions? Email <a href="mailto:support@umbercore.com" style={{ color: "var(--green)" }}>support@umbercore.com</a>
      </p>
    </div>
  );
}
