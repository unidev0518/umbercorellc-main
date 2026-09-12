import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getBillingPeriods } from "@/lib/billing";

// Vercel cron: runs daily at 08:00 UTC
export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = adminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  const { data: projects } = await db
    .from("projects")
    .select(`
      id, name, billing_frequency, billing_day_1, billing_day_2, billing_anchor_date,
      contract_value, developer_hourly_rate,
      client:portal_users!client_id(id)
    `)
    .eq("status", "active")
    .eq("billing_model", "hourly")
    .not("billing_frequency", "is", null);

  if (!projects?.length) return NextResponse.json({ generated: 0 });

  let generated = 0;

  for (const project of projects as any[]) {
    const periods = getBillingPeriods(project, today);
    if (!periods) continue;

    const { periodStart, periodEnd } = periods;
    // Only generate on the day the period ends
    if (periodEnd !== todayStr) continue;

    // Check if invoice already exists for this period
    const { data: existing } = await db
      .from("invoices")
      .select("id")
      .eq("project_id", project.id)
      .eq("period_start", periodStart)
      .eq("period_end", periodEnd)
      .limit(1);

    if (existing?.length) continue;

    // Fetch approved time entries in this period
    const { data: entries } = await db
      .from("time_entries")
      .select("hours")
      .eq("project_id", project.id)
      .gte("date", periodStart)
      .lte("date", periodEnd);

    if (!entries?.length) continue;

    const totalHours = entries.reduce((s: number, e: { hours: number }) => s + Number(e.hours), 0);
    const rate = Number(project.contract_value) || Number(project.developer_hourly_rate) || 0;
    if (rate === 0) continue;

    const subtotal = totalHours * rate;
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 30);
    const invNum = `UMC-${today.getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const { data: invoice, error } = await db.from("invoices").insert({
      project_id: project.id,
      client_id: project.client?.id || null,
      invoice_number: invNum,
      status: "draft",
      amount: subtotal,
      subtotal,
      currency: "USD",
      issued_date: todayStr,
      due_date: dueDate.toISOString().slice(0, 10),
      period_start: periodStart,
      period_end: periodEnd,
      is_auto_generated: true,
    }).select("id").single();

    if (error || !invoice) continue;

    await db.from("invoice_items").insert({
      invoice_id: invoice.id,
      description: `Development services ${periodStart} – ${periodEnd} (${totalHours}h)`,
      quantity: totalHours,
      unit_price: rate,
    });

    generated++;
  }

  return NextResponse.json({ generated, timestamp: todayStr });
}
