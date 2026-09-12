import { NextResponse } from "next/server";
import { adminClient, browserClient } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await browserClient().auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = adminClient();
  const [{ data: members, error: memberError }, { data: owned, error: ownedError }] = await Promise.all([
    db.from("project_members").select("project:projects!project_id(id, name, status)").eq("developer_id", user.id),
    db.from("projects").select("id, name, status").eq("developer_id", user.id),
  ]);

  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });
  if (ownedError) return NextResponse.json({ error: ownedError.message }, { status: 500 });

  type ProjectRow = { id: string; name: string; status: string };
  const byId = new Map<string, ProjectRow>();
  for (const row of members || []) {
    const raw = (row as { project: ProjectRow | ProjectRow[] | null }).project;
    const project = Array.isArray(raw) ? raw[0] ?? null : raw;
    if (project) byId.set(project.id, project);
  }
  for (const project of owned || []) {
    byId.set(project.id, project);
  }

  return NextResponse.json({ projects: [...byId.values()] });
}
