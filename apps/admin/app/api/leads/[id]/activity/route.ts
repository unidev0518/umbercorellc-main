import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("leads")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = adminClient();

  const { data, error } = await db
    .from("lead_activities")
    .select("*, admin:admin_users!created_by(full_name)")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activities: data || [] });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("leads")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { type, content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const db = adminClient();

  const { data: { user: authUser } } = await db.auth.getUser(ctx.session);
  const { data: adminUser } = await db
    .from("admin_users")
    .select("id")
    .eq("email", authUser?.email || "")
    .single();

  const { data, error } = await db
    .from("lead_activities")
    .insert({ lead_id: id, type: type || "note", content: content.trim(), created_by: adminUser?.id || null })
    .select("*, admin:admin_users!created_by(full_name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activity: data }, { status: 201 });
}
