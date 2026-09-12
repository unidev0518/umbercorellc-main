import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";

export async function GET() {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = adminClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().slice(0, 10);

  const [
    { count: totalLeads },
    { count: newLeads },
    { count: activeProjects },
    { count: totalClients },
    { count: totalDevs },
    { data: recentLeads },
    { data: projectsByStatus },
    { count: recentTimeCount },
    { data: invoiceStats },
    { data: recentProjects },
    { data: settlements },
  ] = await Promise.all([
    db.from("leads").select("*", { count: "exact", head: true }),
    db.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    db.from("projects").select("*", { count: "exact", head: true }).eq("status", "active"),
    db.from("portal_users").select("*", { count: "exact", head: true }).eq("role", "client"),
    db.from("portal_users").select("*", { count: "exact", head: true }).eq("role", "developer"),
    db.from("leads").select("id, first_name, last_name, email, type, status, created_at").order("created_at", { ascending: false }).limit(5),
    db.from("projects").select("status").eq("status", "active"),
    db.from("time_entries").select("*", { count: "exact", head: true }).gte("date", weekAgoStr),
    db.from("invoices").select("status, amount, subtotal"),
    db.from("projects").select("id, name, status, client:portal_users!client_id(full_name, company_name)").order("created_at", { ascending: false }).limit(5),
    db.from("payroll_settlements").select("amount"),
  ]);

  const invPaid = (invoiceStats || []).filter((i: { status: string }) => i.status === "paid").reduce((s: number, i: { subtotal?: number; amount: number }) => s + Number(i.subtotal ?? i.amount), 0);
  const invOutstanding = (invoiceStats || []).filter((i: { status: string }) => ["sent", "overdue"].includes(i.status)).reduce((s: number, i: { amount: number }) => s + Number(i.amount), 0);
  const devCosts = (settlements || []).reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0);
  const netIncome = invPaid - devCosts;

  const statusCount: Record<string, number> = {};
  for (const p of (projectsByStatus || []) as { status: string }[]) {
    statusCount[p.status] = (statusCount[p.status] || 0) + 1;
  }

  return NextResponse.json({
    stats: {
      totalLeads: totalLeads ?? 0,
      newLeads: newLeads ?? 0,
      activeProjects: activeProjects ?? 0,
      totalClients: totalClients ?? 0,
      totalDevs: totalDevs ?? 0,
      pendingTimeEntries: recentTimeCount ?? 0,
      invPaid,
      invOutstanding,
      devCosts,
      netIncome,
    },
    phaseCount: statusCount,
    recentLeads: recentLeads ?? [],
    recentProjects: recentProjects ?? [],
  });
}
