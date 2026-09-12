import { NextRequest, NextResponse } from "next/server";
import { adminClient, browserClient } from "@/lib/supabase";
import { cookies } from "next/headers";

async function getDeveloper() {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_session")?.value;
  if (!token) throw new Error("Unauthorized");
  const { data: { user } } = await browserClient().auth.getUser(token);
  if (!user) throw new Error("Unauthorized");
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
    .from("developer_payment_methods")
    .select("*")
    .eq("developer_id", user.id)
    .order("created_at", { ascending: true });
  return NextResponse.json({ methods: data || [] });
}

// POST — add a new payment method
export async function POST(req: NextRequest) {
  let user;
  try { user = await getDeveloper(); } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "Forbidden" ? 403 : 401 });
  }

  const body = await req.json();
  const { label, payment_type, percent, bank_name, account_holder_name,
    account_number, routing_number, iban, swift_bic, paypal_email, wise_email, other_details } = body;

  if (!percent || percent <= 0 || percent > 100) {
    return NextResponse.json({ error: "Percent must be between 1 and 100" }, { status: 400 });
  }

  // Check total percent won't exceed 100
  const db = adminClient();
  const { data: existing } = await db
    .from("developer_payment_methods")
    .select("percent")
    .eq("developer_id", user.id);

  const totalExisting = (existing || []).reduce((s, m) => s + Number(m.percent), 0);
  if (totalExisting + Number(percent) > 100) {
    return NextResponse.json({
      error: `Adding ${percent}% would exceed 100%. Currently at ${totalExisting}%.`
    }, { status: 400 });
  }

  const { data, error } = await db.from("developer_payment_methods").insert({
    developer_id: user.id,
    label: label || "Primary",
    payment_type: payment_type || "bank_transfer",
    percent: Number(percent),
    bank_name: bank_name || null,
    account_holder_name: account_holder_name || null,
    account_number: account_number || null,
    routing_number: routing_number || null,
    iban: iban || null,
    swift_bic: swift_bic || null,
    paypal_email: paypal_email || null,
    wise_email: wise_email || null,
    other_details: other_details || null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ method: data }, { status: 201 });
}

// PATCH — update a method
export async function PATCH(req: NextRequest) {
  let user;
  try { user = await getDeveloper(); } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "Forbidden" ? 403 : 401 });
  }

  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = adminClient();

  // If updating percent, verify total won't exceed 100
  if (updates.percent !== undefined) {
    const { data: existing } = await db
      .from("developer_payment_methods")
      .select("percent")
      .eq("developer_id", user.id)
      .neq("id", id);
    const totalOthers = (existing || []).reduce((s, m) => s + Number(m.percent), 0);
    if (totalOthers + Number(updates.percent) > 100) {
      return NextResponse.json({
        error: `${updates.percent}% would exceed 100%. Others total ${totalOthers}%.`
      }, { status: 400 });
    }
  }

  const { data, error } = await db
    .from("developer_payment_methods")
    .update(updates)
    .eq("id", id)
    .eq("developer_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ method: data });
}

// DELETE — remove a method
export async function DELETE(req: NextRequest) {
  let user;
  try { user = await getDeveloper(); } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "Forbidden" ? 403 : 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = adminClient();
  const { error } = await db
    .from("developer_payment_methods")
    .delete()
    .eq("id", id)
    .eq("developer_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
