import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";
import { EmailService } from "@umbercore/email";
import { getPortalUrl } from "@/lib/portal-url";

const SELECT = `
  *,
  project:projects!project_id(id, name),
  client:portal_users!client_id(id, full_name, company_name, email),
  items:invoice_items(*),
  creator:admin_users!created_by(id, full_name)
`;

export async function GET(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("invoices")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const project_id = searchParams.get("project_id");
  const client_id = searchParams.get("client_id");
  const status = searchParams.get("status");

  const db = adminClient();

  // Auto-mark overdue: sent invoices with a past due_date
  const today = new Date().toISOString().split("T")[0];
  await db.from("invoices")
    .update({ status: "overdue", updated_at: new Date().toISOString() })
    .eq("status", "sent")
    .lt("due_date", today)
    .not("due_date", "is", null);

  let query = db.from("invoices").select(SELECT).order("created_at", { ascending: false });
  if (project_id) query = query.eq("project_id", project_id);
  if (client_id) query = query.eq("client_id", client_id);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invoices: data });
}

export async function POST(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("invoices")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { project_id, client_id, invoice_number, status = "draft", amount, currency = "USD",
    issued_date, due_date, notes, items = [] } = body;

  if (!project_id || !invoice_number || amount == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = adminClient();
  const { data: { user } } = await db.auth.getUser(ctx.session);

  const { data: invoice, error } = await db.from("invoices").insert({
    project_id, client_id: client_id || null, invoice_number, status, amount,
    currency, issued_date: issued_date || null, due_date: due_date || null,
    notes: notes || null, created_by: user?.id || null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (items.length > 0) {
    const rows = items.map((it: any) => ({
      invoice_id: invoice.id,
      description: it.description,
      quantity: it.quantity ?? 1,
      unit_price: it.unit_price,
    }));
    await db.from("invoice_items").insert(rows);
  }

  const { data: full } = await db.from("invoices").select(SELECT).eq("id", invoice.id).single();
  return NextResponse.json({ invoice: full }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("invoices")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, items, status, invoice_number, amount, subtotal, currency, issued_date, due_date,
    notes, paid_date, period_start, period_end } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const invoiceUpdates: Record<string, unknown> = {};
  if (status !== undefined) invoiceUpdates.status = status;
  if (invoice_number !== undefined) invoiceUpdates.invoice_number = invoice_number;
  if (amount !== undefined) invoiceUpdates.amount = amount;
  if (subtotal !== undefined) invoiceUpdates.subtotal = subtotal;
  if (currency !== undefined) invoiceUpdates.currency = currency;
  if (issued_date !== undefined) invoiceUpdates.issued_date = issued_date;
  if (due_date !== undefined) invoiceUpdates.due_date = due_date;
  if (notes !== undefined) invoiceUpdates.notes = notes;
  if (paid_date !== undefined) invoiceUpdates.paid_date = paid_date;
  if (period_start !== undefined) invoiceUpdates.period_start = period_start;
  if (period_end !== undefined) invoiceUpdates.period_end = period_end;

  // Guard illegal status transitions
  if (status) {
    const db2 = adminClient();
    const { data: current } = await db2.from("invoices").select("status").eq("id", id).single();
    const from = current?.status;
    const to = status as string;
    const ALLOWED: Record<string, string[]> = {
      draft:     ["sent", "cancelled"],
      sent:      ["paid", "overdue", "cancelled"],
      overdue:   ["paid", "cancelled"],
      paid:      [],          // terminal — no transitions out
      cancelled: ["draft"],   // allow re-opening a cancelled draft
    };
    if (from && !(ALLOWED[from] || []).includes(to)) {
      return NextResponse.json({ error: `Cannot transition invoice from "${from}" to "${to}"` }, { status: 422 });
    }
  }

  if (invoiceUpdates.status === "paid" && !invoiceUpdates.paid_date) {
    invoiceUpdates.paid_date = new Date().toISOString().split("T")[0];
  }
  invoiceUpdates.updated_at = new Date().toISOString();

  const db = adminClient();
  const { error } = await db.from("invoices").update(invoiceUpdates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (items !== undefined) {
    await db.from("invoice_items").delete().eq("invoice_id", id);
    if (items.length > 0) {
      const rows = items.map((it: any) => ({
        invoice_id: id, description: it.description,
        quantity: it.quantity ?? 1, unit_price: it.unit_price,
      }));
      await db.from("invoice_items").insert(rows);
    }
  }

  const { data: full } = await db.from("invoices").select(SELECT).eq("id", id).single();

  // Send email when invoice is marked as sent
  if (invoiceUpdates.status === "sent" && full) {
    const inv = full as any;
    const clientEmail = inv.client?.email;
    if (clientEmail) {
      const portalUrl = getPortalUrl();
      const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: inv.currency || "USD" }).format(inv.amount);
      const dueDate = inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;
      EmailService.sendInvoice({
        to: clientEmail,
        clientName: inv.client.company_name || inv.client.full_name,
        invoiceNumber: inv.invoice_number,
        projectName: inv.project?.name || "—",
        amount,
        dueDate,
        portalUrl: `${portalUrl}/invoices`,
        notes: inv.notes,
      }).catch(err => console.error("[email] invoice email failed:", err));
    }
  }

  return NextResponse.json({ invoice: full });
}

export async function DELETE(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("invoices")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = adminClient();
  const { error } = await db.from("invoices").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
