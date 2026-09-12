import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("projects")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const project_id = req.nextUrl.searchParams.get("project_id");
  if (!project_id) return NextResponse.json({ error: "Missing project_id" }, { status: 400 });

  const db = adminClient();
  const { data, error } = await db
    .from("project_members")
    .select(`*, developer:portal_users!developer_id(id, full_name, email, skills, availability)`)
    .eq("project_id", project_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ members: data });
}

export async function POST(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("projects")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { project_id, developer_id, role_label, start_date, end_date, hourly_rate, hours_allocated } = await req.json();
  if (!project_id || !developer_id) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const db = adminClient();
  const { data, error } = await db
    .from("project_members")
    .insert({
      project_id, developer_id,
      role_label: role_label || null,
      start_date: start_date || null,
      end_date: end_date || null,
      hourly_rate: hourly_rate || null,
      hours_allocated: hours_allocated || null,
    })
    .select(`*, developer:portal_users!developer_id(id, full_name, email, skills, availability)`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ member: data });
}

export async function PATCH(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("projects")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, role_label, start_date, end_date, hourly_rate, hours_allocated } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (role_label !== undefined) updates.role_label = role_label;
  if (start_date !== undefined) updates.start_date = start_date;
  if (end_date !== undefined) updates.end_date = end_date;
  if (hourly_rate !== undefined) updates.hourly_rate = hourly_rate;
  if (hours_allocated !== undefined) updates.hours_allocated = hours_allocated;

  const db = adminClient();
  const { data, error } = await db
    .from("project_members")
    .update(updates)
    .eq("id", id)
    .select(`*, developer:portal_users!developer_id(id, full_name, email, skills, availability)`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ member: data });
}

export async function DELETE(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("projects")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = adminClient();
  const { error } = await db.from("project_members").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
