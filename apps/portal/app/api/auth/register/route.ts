import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { MagicLinkRepository } from "@umbercore/database";

export async function POST(req: NextRequest) {
  const { token, email, password, full_name, company_name, job_title, skills, availability } =
    await req.json();

  if (!token || !email || !password || !full_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate magic link
  const link = await MagicLinkRepository.findByToken(token);
  if (!link) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
  }
  if (link.used) {
    return NextResponse.json({ error: "This link has already been used" }, { status: 400 });
  }
  if (new Date(link.expires_at) < new Date()) {
    return NextResponse.json({ error: "This link has expired" }, { status: 400 });
  }
  if (link.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: "Email does not match invitation" }, { status: 400 });
  }

  const db = adminClient();

  // Create Supabase Auth user
  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    if (authError?.message?.includes("already registered")) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

  // Insert portal_users row
  const profileData: Record<string, unknown> = {
    id: authData.user.id,
    email,
    full_name,
    role: link.role,
  };
  if (link.role === "client") {
    profileData.company_name = company_name || null;
    profileData.job_title = job_title || null;
  }
  if (link.role === "developer") {
    profileData.skills = skills || null;
    profileData.availability = availability || null;
  }

  const { error: profileError } = await db.from("portal_users").insert(profileData);
  if (profileError) {
    // Rollback: delete the auth user
    await db.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }

  // Mark magic link as used
  await MagicLinkRepository.markUsed(link.id);

  return NextResponse.json({ ok: true });
}
