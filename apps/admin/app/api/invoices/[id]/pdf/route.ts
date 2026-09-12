import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { createElement } from "react";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";
import { InvoicePDFDoc } from "@/components/InvoicePDF";

const SELECT = `
  *,
  project:projects!project_id(id, name),
  client:portal_users!client_id(id, full_name, company_name, email),
  items:invoice_items(*)
`;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("invoices")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = adminClient();

  const [{ data: invoice }, { data: settings }] = await Promise.all([
    db.from("invoices").select(SELECT).eq("id", id).single(),
    db.from("company_settings").select("*").limit(1).single(),
  ]);

  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const stream = await renderToStream(
    createElement(InvoicePDFDoc, { invoice: invoice as any, settings: settings as any }) as any
  );

  const chunks: Uint8Array[] = [];
  for await (const chunk of stream as any) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const pdf = Buffer.concat(chunks);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoice_number}.pdf"`,
    },
  });
}
