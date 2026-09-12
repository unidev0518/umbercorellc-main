import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";
import { notFound, redirect } from "next/navigation";
import LeadDetailClient from "./LeadDetailClient";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { redirect("/login"); }
  if (!ctx.can("leads")) redirect("/no-access");

  const { id } = await params;
  const db = adminClient();

  const [{ data: lead }, { data: links }] = await Promise.all([
    db.from("leads").select("*").eq("id", id).single(),
    db.from("magic_links").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
  ]);

  if (!lead) notFound();

  return <LeadDetailClient lead={lead} magicLinks={links || []} />;
}
