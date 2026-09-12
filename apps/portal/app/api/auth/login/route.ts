import { NextRequest, NextResponse } from "next/server";
import { browserClient, adminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const supabase = browserClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Verify user has a portal role (client or developer)
  const db = adminClient();
  const { data: profile } = await db
    .from("portal_users")
    .select("id, role, is_active")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (profile.is_active === false) {
    return NextResponse.json({ error: "Your account has been deactivated. Please contact UmberCore." }, { status: 403 });
  }

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };

  const res = NextResponse.json({ ok: true, role: profile.role });
  res.cookies.set("portal_session", data.session!.access_token, cookieOpts);
  if (data.session?.refresh_token) {
    res.cookies.set("portal_refresh", data.session.refresh_token, cookieOpts);
  }
  res.cookies.set("portal_role", profile.role, cookieOpts);

  return res;
}
