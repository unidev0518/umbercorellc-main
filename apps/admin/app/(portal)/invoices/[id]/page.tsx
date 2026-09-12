import { adminClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import InvoiceDetailClient from "./InvoiceDetailClient";

const SELECT = `
  *,
  project:projects!project_id(id, name),
  client:portal_users!client_id(id, full_name, company_name, email),
  items:invoice_items(*),
  creator:admin_users!created_by(id, full_name)
`;

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) redirect("/login");

  const db = adminClient();
  const { data: invoice } = await db.from("invoices").select(SELECT).eq("id", id).single();
  if (!invoice) notFound();

  return <InvoiceDetailClient invoice={invoice} />;
}
