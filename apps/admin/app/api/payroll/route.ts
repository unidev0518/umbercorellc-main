import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";

export async function GET() {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("payroll")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = adminClient();

  type Developer = { id: string; full_name: string; email: string };
  type ProjectRow = {
    id: string;
    name: string;
    developer_hourly_rate: number;
    developer: Developer | null;
  };

  const { data: projectsRaw } = await db
    .from("projects")
    .select(`
      id, name, developer_hourly_rate,
      developer:portal_users!developer_id(id, full_name, email)
    `)
    .eq("status", "active")
    .not("developer_id", "is", null)
    .not("developer_hourly_rate", "is", null);

  const projects: ProjectRow[] = (projectsRaw || []).map((p) => {
    const raw = p.developer as Developer | Developer[] | null;
    const developer = Array.isArray(raw) ? raw[0] ?? null : raw;
    return {
      id: p.id as string,
      name: p.name as string,
      developer_hourly_rate: Number(p.developer_hourly_rate),
      developer,
    };
  });

  if (!projects.length) return NextResponse.json({ developers: [], pendingCount: 0 });

  const projectIds = projects.map((p) => p.id);
  const developerIds = [...new Set(projects.map((p) => p.developer?.id).filter(Boolean))] as string[];

  const [{ data: lastSettled }, { data: entries }, { data: methods }, { data: history }] = await Promise.all([
    db.from("payroll_settlements").select("developer_id, period_end").in("developer_id", developerIds).order("period_end", { ascending: false }),
    db.from("time_entries").select("id, date, hours, developer_id, project_id").in("project_id", projectIds).order("date", { ascending: true }),
    db.from("developer_payment_methods").select("*").in("developer_id", developerIds),
    db.from("payroll_settlements").select("id, developer_id, period_start, period_end, hours, amount, created_at").in("developer_id", developerIds).order("created_at", { ascending: false }),
  ]);

  const lastPaidMap: Record<string, string> = {};
  for (const row of lastSettled || []) {
    if (!lastPaidMap[row.developer_id]) lastPaidMap[row.developer_id] = row.period_end;
  }

  const methodsByDev = new Map<string, unknown[]>();
  for (const method of methods || []) {
    const list = methodsByDev.get(method.developer_id) || [];
    list.push(method);
    methodsByDev.set(method.developer_id, list);
  }

  const historyByDev = new Map<string, unknown[]>();
  for (const row of history || []) {
    const list = historyByDev.get(row.developer_id) || [];
    list.push({
      id: row.id,
      period_start: row.period_start,
      period_end: row.period_end,
      hours: row.hours,
      amount: row.amount,
      paid_date: row.created_at,
      status: "paid",
    });
    historyByDev.set(row.developer_id, list);
  }

  const devMap = new Map<string, {
    developer: { id: string; full_name: string; email: string };
    totalHours: number;
    suggestedAmount: number;
    entries: { id: string; date: string; hours: number; project: { name: string } }[];
    projects: { id: string; name: string; hours: number; rate: number }[];
    periodStart: string | null;
    periodEnd: string | null;
  }>();

  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

  for (const e of entries || []) {
    const project = projectById[e.project_id];
    if (!project?.developer?.id) continue;

    const lastPeriodEnd = lastPaidMap[project.developer.id];
    if (lastPeriodEnd && e.date <= lastPeriodEnd) continue;

    const devId = project.developer.id;
    const rate = Number(project.developer_hourly_rate) || 0;
    const hours = Number(e.hours);

    if (!devMap.has(devId)) {
      devMap.set(devId, {
        developer: project.developer,
        totalHours: 0,
        suggestedAmount: 0,
        entries: [],
        projects: [],
        periodStart: e.date,
        periodEnd: e.date,
      });
    }

    const row = devMap.get(devId)!;
    row.totalHours += hours;
    row.suggestedAmount += hours * rate;
    row.entries.push({ id: e.id, date: e.date, hours, project: { name: project.name } });
    if (!row.periodStart || e.date < row.periodStart) row.periodStart = e.date;
    if (!row.periodEnd || e.date > row.periodEnd) row.periodEnd = e.date;

    const projRow = row.projects.find(p => p.id === e.project_id);
    if (projRow) {
      projRow.hours += hours;
    } else {
      row.projects.push({ id: e.project_id, name: project.name, hours, rate });
    }
  }

  const result = Array.from(devMap.values()).map(d => ({
    developer: d.developer,
    totalHours: Math.round(d.totalHours * 100) / 100,
    suggestedAmount: Math.round(d.suggestedAmount * 100) / 100,
    entries: d.entries,
    projects: d.projects,
    periodStart: d.periodStart,
    periodEnd: d.periodEnd,
    paymentMethods: methodsByDev.get(d.developer.id) || [],
    paymentHistory: historyByDev.get(d.developer.id) || [],
  }));

  return NextResponse.json({ developers: result, pendingCount: result.length });
}

export async function POST(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("payroll")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { invoice_id, paid_date, developer_id, period_start, period_end, hours, amount, notes } = await req.json();
  const db = adminClient();

  if (invoice_id) {
    const { data, error } = await db
      .from("invoices")
      .update({
        status: "paid",
        paid_date: paid_date || new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoice_id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ invoice: data });
  }

  if (!developer_id || !period_start || !period_end || amount == null) {
    return NextResponse.json({ error: "Missing developer_id, period, or amount" }, { status: 400 });
  }

  const { data, error } = await db
    .from("payroll_settlements")
    .insert({
      developer_id,
      period_start,
      period_end,
      hours: hours ?? 0,
      amount,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settlement: data });
}
