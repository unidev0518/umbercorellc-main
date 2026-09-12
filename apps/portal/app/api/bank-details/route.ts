import { NextRequest, NextResponse } from "next/server";
import { adminClient, browserClient } from "@/lib/supabase";
import { cookies } from "next/headers";

async function getDeveloper() {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_session")?.value;
  if (!token) throw new Error("Unauthorized");
  const { data: { user } } = await browserClient().auth.getUser(token);
  if (!user) throw new Error("Unauthorized");
  // Verify role
  const { data } = await adminClient().from("portal_users").select("role").eq("id", user.id).single();
  if (data?.role !== "developer") throw new Error("Forbidden");
  return user;
}

export async function GET() {
  let user;
  try { user = await getDeveloper(); } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "Forbidden" ? 403 : 401 });
  }
  const { data } = await adminClient()
    .from("developer_bank_details")
    .select("*")
    .eq("developer_id", user.id)
    .single();
  return NextResponse.json({ details: data || null });
}

export async function PATCH(req: NextRequest) {
  let user;
  try { user = await getDeveloper(); } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "Forbidden" ? 403 : 401 });
  }

  const body = await req.json();
  const allowed = ["payment_method","bank_name","account_holder_name","account_number",
    "routing_number","iban","swift_bic","paypal_email","wise_email","notes"];
  const updates: Record<string, unknown> = { developer_id: user.id, updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) updates[key] = body[key] ?? null;
  }

  const db = adminClient();
  const { data, error } = await db
    .from("developer_bank_details")
    .upsert(updates, { onConflict: "developer_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ details: data });
}
