import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";

const SELECT = `
  *,
  developer:portal_users!developer_id(id, full_name, email),
  project:projects!project_id(id, name)
`;

export async function GET(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("projects")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const project_id = searchParams.get("project_id");
  const developer_id = searchParams.get("developer_id");
  const date_from = searchParams.get("date_from");
  const date_to = searchParams.get("date_to");

  const db = adminClient();
  let query = db.from("time_entries").select(SELECT).order("date", { ascending: false });
  if (project_id) query = query.eq("project_id", project_id);
  if (developer_id) query = query.eq("developer_id", developer_id);
  if (date_from) query = query.gte("date", date_from);
  if (date_to) query = query.lte("date", date_to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data });
}

export async function DELETE(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("projects")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = adminClient();
  const { error } = await db.from("time_entries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
