import { NextResponse } from "next/server";
import { adminClient, browserClient } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await browserClient().auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = adminClient();

  // Auto-mark overdue
  const today = new Date().toISOString().split("T")[0];
  await db.from("invoices")
    .update({ status: "overdue", updated_at: new Date().toISOString() })
    .eq("status", "sent")
    .lt("due_date", today)
    .not("due_date", "is", null)
    .eq("client_id", user.id);

  const { data, error } = await db
    .from("invoices")
    .select(`
      id, invoice_number, status, amount, currency,
      issued_date, due_date, paid_date, notes,
      project:projects!project_id(id, name),
      items:invoice_items(id, description, quantity, unit_price, amount)
    `)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invoices: data });
}
