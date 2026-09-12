import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";

export async function GET() {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (ctx.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = adminClient();
  const { data } = await db.from("company_settings").select("*").limit(1).single();
  return NextResponse.json({ settings: data || null });
}

export async function PATCH(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (ctx.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const allowed = [
    "company_name","logo_url","address","city","state","zip","country",
    "phone","email","website","bank_name","account_holder","account_number",
    "routing_number","iban","swift_bic","paypal_email",
    "tax_id","payment_terms","invoice_notes","invoice_footer",
  ];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) updates[key] = body[key] ?? null;
  }

  const db = adminClient();
  const { data: existing } = await db.from("company_settings").select("id").limit(1).single();

  let result;
  if (existing) {
    const { data } = await db.from("company_settings").update(updates).eq("id", existing.id).select().single();
    result = data;
  } else {
    const { data } = await db.from("company_settings").insert(updates).select().single();
    result = data;
  }
  return NextResponse.json({ settings: result });
}
