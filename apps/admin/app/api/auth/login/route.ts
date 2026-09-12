import { NextRequest, NextResponse } from "next/server";
import { adminClient, browserClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const supabase = browserClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const db = adminClient();
  const { data: admin } = await db
    .from("admin_users")
    .select("id, role, permissions")
    .eq("id", data.user.id)
    .single();

  if (!admin) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const session = data.session!;
  const permissions: string[] = admin.role === "super_admin"
    ? ["leads", "projects", "invoices", "payroll", "clients", "developers"]
    : (admin.permissions || []);

  const res = NextResponse.json({ ok: true });
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };

  res.cookies.set("admin_session", session.access_token, cookieOpts);
  if (session.refresh_token) {
    res.cookies.set("admin_refresh", session.refresh_token, cookieOpts);
  }
  res.cookies.set("admin_role", admin.role, cookieOpts);
  res.cookies.set("admin_permissions", JSON.stringify(permissions), cookieOpts);

  return res;
}
