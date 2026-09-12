import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { cookies } from "next/headers";

async function getValidatedAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) throw new Error("Unauthorized");

  const db = adminClient();
  const { data: { user }, error } = await db.auth.getUser(session.value);
  if (error || !user) throw new Error("Unauthorized");

  const { data } = await db.from("admin_users").select("role").eq("id", user.id).single();
  return { user, role: data?.role || "staff", isSuperAdmin: data?.role === "super_admin" };
}

async function assertSuperAdmin() {
  const { isSuperAdmin } = await getValidatedAdmin();
  if (!isSuperAdmin) throw new Error("Unauthorized");
}

export async function GET() {
  try { await assertSuperAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const db = adminClient();
  const { data, error } = await db.from("admin_users").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ admins: data });
}

export async function POST(req: NextRequest) {
  try { await assertSuperAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { email, full_name, password, role } = await req.json();
  if (!email || !full_name || !password) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const db = adminClient();
  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message || "Failed to create user" }, { status: 500 });
  }

  const { data, error } = await db
    .from("admin_users")
    .insert({ id: authData.user.id, email, full_name, role: role || "staff", permissions: ["leads", "projects", "invoices", "payroll", "clients", "developers"] })
    .select()
    .single();

  if (error) {
    await db.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ admin: data });
}

export async function PATCH(req: NextRequest) {
  // Allow self-edit (any admin) or super_admin editing others
  let caller: { user: any; isSuperAdmin: boolean };
  try { caller = await getValidatedAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const db = adminClient();
  const body = await req.json();
  const { id, permissions, full_name, email, password } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const isSelf = caller.user.id === id;
  const isSuperAdmin = caller.isSuperAdmin;

  // Only super_admin can edit others; anyone can edit themselves
  if (!isSelf && !isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // Only super_admin can update permissions
  if (permissions !== undefined && !isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Update profile table
  const profileUpdates: Record<string, unknown> = {};
  if (full_name !== undefined) profileUpdates.full_name = full_name;
  if (email !== undefined) profileUpdates.email = email;
  if (permissions !== undefined) profileUpdates.permissions = permissions;

  if (Object.keys(profileUpdates).length > 0) {
    const query = db.from("admin_users").update(profileUpdates).eq("id", id);
    const { data, error } = await (permissions !== undefined && !full_name && !email
      ? query.eq("role", "staff").select().single()
      : query.select().single());
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Update auth email if changed
    if (email) {
      await db.auth.admin.updateUserById(id, { email });
    }

    // Update auth password if provided
    if (password && password.length >= 8) {
      const { error: pwErr } = await db.auth.admin.updateUserById(id, { password });
      if (pwErr) return NextResponse.json({ error: pwErr.message }, { status: 500 });
    }

    return NextResponse.json({ admin: data });
  }

  // Password-only update
  if (password) {
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    const { error } = await db.auth.admin.updateUserById(id, { password });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const { data } = await db.from("admin_users").select("*").eq("id", id).single();
    return NextResponse.json({ admin: data });
  }

  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  try { await assertSuperAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = adminClient();
  const { data: { user } } = await db.auth.getUser((await (await import("next/headers")).cookies()).get("admin_session")?.value || "");
  if (user?.id === id) return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });

  await db.from("admin_users").delete().eq("id", id);
  await db.auth.admin.deleteUser(id);
  return NextResponse.json({ ok: true });
}
