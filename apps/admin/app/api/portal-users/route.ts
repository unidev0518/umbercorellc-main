import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const role = req.nextUrl.searchParams.get("role");

  // Check permission based on which role is being queried
  const requiredPerm = role === "developer" ? "developers" : role === "client" ? "clients" : null;
  if (requiredPerm && !ctx.can(requiredPerm)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!requiredPerm && !ctx.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = adminClient();
  let query = db.from("portal_users").select("*").order("created_at", { ascending: false });
  if (role) query = query.eq("role", role);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}

export async function PATCH(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.isSuperAdmin && !ctx.can("clients") && !ctx.can("developers")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, is_active } = await req.json();
  if (!id || typeof is_active !== "boolean") {
    return NextResponse.json({ error: "Missing id or is_active" }, { status: 400 });
  }

  const db = adminClient();

  // Verify caller has permission for the target user's role
  const { data: target } = await db.from("portal_users").select("role").eq("id", id).single();
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.role === "developer" && !ctx.isSuperAdmin && !ctx.can("developers")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (target.role === "client" && !ctx.isSuperAdmin && !ctx.can("clients")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await db
    .from("portal_users")
    .update({ is_active })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user: data });
}
