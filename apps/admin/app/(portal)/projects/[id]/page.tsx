import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";
import { notFound, redirect } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { redirect("/login"); }
  if (!ctx.can("projects")) redirect("/no-access");

  const { id } = await params;
  const db = adminClient();

  const { data: project } = await db
    .from("projects")
    .select(`
      *,
      client:portal_users!client_id(id, full_name, company_name, email),
      developer:portal_users!developer_id(id, full_name, email),
      account_manager:admin_users!account_manager_id(id, full_name, email)
    `)
    .eq("id", id)
    .single();

  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
