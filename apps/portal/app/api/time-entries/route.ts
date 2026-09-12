import { NextRequest, NextResponse } from "next/server";
import { adminClient, browserClient } from "@/lib/supabase";
import { cookies } from "next/headers";

async function getPortalUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_session")?.value;
  if (!token) throw new Error("Unauthorized");
  const { data: { user } } = await browserClient().auth.getUser(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function GET(req: NextRequest) {
  let user;
  try { user = await getPortalUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { searchParams } = req.nextUrl;
  const week_start = searchParams.get("week_start"); // YYYY-MM-DD Monday

  const db = adminClient();
  let query = db
    .from("time_entries")
    .select(`*, project:projects!project_id(id, name)`)
    .eq("developer_id", user.id);

  if (week_start) {
    const weekEnd = new Date(week_start);
    weekEnd.setDate(weekEnd.getDate() + 6);
    query = query.gte("date", week_start).lte("date", weekEnd.toISOString().split("T")[0]);
  }

  const { data, error } = await query.order("date", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data });
}

export async function POST(req: NextRequest) {
  let user;
  try { user = await getPortalUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { entries } = await req.json();
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ error: "No entries provided" }, { status: 400 });
  }

  // Verify developer is assigned to each project they're logging against
  const db = adminClient();
  const projectIds = [...new Set(entries.map((e: { project_id: string }) => e.project_id))];
  const [{ data: memberRows }, { data: ownedRows }] = await Promise.all([
    db.from("project_members").select("project_id").eq("developer_id", user.id).in("project_id", projectIds),
    db.from("projects").select("id").eq("developer_id", user.id).in("id", projectIds),
  ]);

  const assignedIds = new Set([
    ...(memberRows || []).map((a: { project_id: string }) => a.project_id),
    ...(ownedRows || []).map((p: { id: string }) => p.id),
  ]);
  const unauthorized = projectIds.filter(id => !assignedIds.has(id));
  if (unauthorized.length > 0) {
    return NextResponse.json({ error: "Not assigned to one or more projects" }, { status: 403 });
  }

  const rows = entries.map((e: { project_id: string; date: string; hours: number; description?: string }) => ({
    project_id: e.project_id,
    developer_id: user.id,
    date: e.date,
    hours: e.hours,
    description: e.description || null,
  }));

  for (const row of rows) {
    await db.from("time_entries")
      .delete()
      .eq("developer_id", user.id)
      .eq("project_id", row.project_id)
      .eq("date", row.date);
  }

  const { data, error } = await db.from("time_entries").insert(rows).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data });
}

export async function DELETE(req: NextRequest) {
  let user;
  try { user = await getPortalUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = adminClient();
  const { error } = await db
    .from("time_entries")
    .delete()
    .eq("id", id)
    .eq("developer_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
