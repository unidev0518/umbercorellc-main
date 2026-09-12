import { cookies } from "next/headers";
import { adminClient, browserClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_session")?.value;
  if (!token) redirect("/login");

  const { data: { user } } = await browserClient().auth.getUser(token);
  if (!user) redirect("/login");

  const db = adminClient();
  const { data: projects } = await db
    .from("projects")
    .select(`*, members:project_members(id, role_label, developer:portal_users!developer_id(full_name))`)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="page-title">Projects</h1>
        <p className="page-sub">Your active engagements with UmberCore</p>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="card p-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--bg-page)", border: "0.5px solid var(--border-default)" }}>
            <svg className="w-5 h-5" fill="none" stroke="var(--text-muted)" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>No projects yet</p>
          <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>Your account manager will set up your first project after onboarding.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(projects as any[]).map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`}
              className="block card p-5 transition-colors"
              style={{ textDecoration: "none" }}
              onMouseEnter={undefined}>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{p.name}</h2>
                <span className={`badge badge-${p.status} ml-3 flex-shrink-0`}>{p.status}</span>
              </div>
              {p.description && <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{p.description}</p>}
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>{p.members?.length || 0} developer{p.members?.length !== 1 ? "s" : ""}</span>
                {p.start_date && (
                  <span>Started {new Date(p.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
