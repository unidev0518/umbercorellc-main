import { NextRequest, NextResponse } from "next/server";
import { adminClient, browserClient } from "@/lib/supabase";
import { cookies } from "next/headers";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_session")?.value;
  if (!token) throw new Error("Unauthorized");
  const { data: { user } } = await browserClient().auth.getUser(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function GET() {
  let user;
  try { user = await getUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { data, error } = await adminClient()
    .from("portal_users")
    .select("id, full_name, email, role, company_name, job_title, skills, availability, location, phone, linkedin_url, bio")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

export async function PATCH(req: NextRequest) {
  let user;
  try { user = await getUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const body = await req.json();

  // Whitelist updatable fields — never allow role or id to be patched
  const allowed = ["full_name", "phone", "company_name", "job_title", "skills", "availability", "location", "linkedin_url", "bio"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key] ?? null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await adminClient()
    .from("portal_users")
    .update(updates)
    .eq("id", user.id)
    .select("id, full_name, email, role, company_name, job_title, skills, availability, location, phone, linkedin_url, bio")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
