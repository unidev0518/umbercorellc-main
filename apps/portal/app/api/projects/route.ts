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

export async function GET(req: NextRequest) {
  let user;
  try { user = await getUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const cookieStore = await cookies();
  const role = cookieStore.get("portal_role")?.value;
  const db = adminClient();

  if (role === "client") {
    const { data, error } = await db
      .from("projects")
      .select(`*, members:project_members(id, role_label, developer:portal_users!developer_id(full_name, email))`)
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ projects: data });
  }

  if (role === "developer") {
    const { data, error } = await db
      .from("project_members")
      .select(`*, project:projects(id, name, status, description, start_date, end_date, client:portal_users!client_id(full_name, company_name))`)
      .eq("developer_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ assignments: data });
  }

  return NextResponse.json({ error: "Unknown role" }, { status: 400 });
}
