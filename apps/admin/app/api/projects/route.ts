import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";
import { syncProjectAssignment } from "@/lib/sync-assignment";

const PROJECT_FIELDS = `
  *,
  client:portal_users!client_id(id, full_name, company_name, email),
  developer:portal_users!developer_id(id, full_name, email),
  account_manager:admin_users!account_manager_id(id, full_name, email)
`;

export async function GET(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("projects")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");

  const db = adminClient();
  let query = db.from("projects").select(PROJECT_FIELDS).order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get last paid invoice's period_end per project — defines current pay round start
  const projectIds = (data || []).map(p => p.id);
  const { data: lastPayments } = await db
    .from("invoices")
    .select("project_id, period_end, paid_date")
    .eq("status", "paid")
    .not("period_end", "is", null)
    .in("project_id", projectIds.length ? projectIds : ["00000000-0000-0000-0000-000000000000"])
    .order("period_end", { ascending: false });

  // Build map: project_id -> last period_end (pay round starts the day after)
  const lastPaidMap: Record<string, string> = {};
  for (const p of lastPayments || []) {
    if (!lastPaidMap[p.project_id]) lastPaidMap[p.project_id] = p.period_end;
  }

  // Fetch approved time entries after last payment for each project
  const { data: timeData } = await db
    .from("time_entries")
    .select("project_id, hours, date")
    .in("project_id", projectIds.length ? projectIds : ["00000000-0000-0000-0000-000000000000"]);

  // Build daily hours map per project for the current pay round
  const hoursMap: Record<string, number> = {};
  const dailyMap: Record<string, Record<string, number>> = {};

  for (const t of timeData || []) {
    const lastPeriodEnd = lastPaidMap[t.project_id];
    if (!lastPeriodEnd || new Date(t.date) > new Date(lastPeriodEnd)) {
      hoursMap[t.project_id] = (hoursMap[t.project_id] || 0) + Number(t.hours);
      if (!dailyMap[t.project_id]) dailyMap[t.project_id] = {};
      dailyMap[t.project_id][t.date] = (dailyMap[t.project_id][t.date] || 0) + Number(t.hours);
    }
  }

  const projects = (data || []).map(p => ({
    ...p,
    current_period_hours: hoursMap[p.id] || 0,
    last_paid_at: lastPaidMap[p.id] || null,
    daily_hours: dailyMap[p.id] || {},
  }));
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("projects")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const {
    name, client_id, developer_id, description, start_date, end_date, status,
    billing_model, contract_value, developer_hourly_rate, developer_hours_allocated,
    account_manager_id,
  } = body;
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const db = adminClient();
  const { data, error } = await db
    .from("projects")
    .insert({
      name,
      client_id: client_id || null,
      developer_id: developer_id || null,
      description: description || null,
      start_date: start_date || null,
      end_date: end_date || null,
      status: status || "active",
      billing_model: billing_model || null,
      contract_value: contract_value || null,
      developer_hourly_rate: developer_hourly_rate || null,
      developer_hours_allocated: developer_hours_allocated || null,
      account_manager_id: account_manager_id || null,
    })
    .select(PROJECT_FIELDS)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await syncProjectAssignment(
    db,
    data.id,
    developer_id || null,
    developer_hourly_rate || null,
    developer_hours_allocated || null
  );
  return NextResponse.json({ project: data });
}

export async function PATCH(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("projects")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const {
    id, name, description, status, notes, start_date, end_date,
    developer_id, developer_hourly_rate, developer_hours_allocated,
    billing_model, contract_value, billing_frequency, billing_day_1, billing_day_2,
    billing_anchor_date, account_manager_id,
  } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  if (start_date !== undefined) updates.start_date = start_date;
  if (end_date !== undefined) updates.end_date = end_date;
  if (developer_id !== undefined) updates.developer_id = developer_id;
  if (developer_hourly_rate !== undefined) updates.developer_hourly_rate = developer_hourly_rate;
  if (developer_hours_allocated !== undefined) updates.developer_hours_allocated = developer_hours_allocated;
  if (billing_model !== undefined) updates.billing_model = billing_model;
  if (contract_value !== undefined) updates.contract_value = contract_value;
  if (billing_frequency !== undefined) updates.billing_frequency = billing_frequency;
  if (billing_day_1 !== undefined) updates.billing_day_1 = billing_day_1;
  if (billing_day_2 !== undefined) updates.billing_day_2 = billing_day_2;
  if (billing_anchor_date !== undefined) updates.billing_anchor_date = billing_anchor_date;
  if (account_manager_id !== undefined) updates.account_manager_id = account_manager_id;

  const db = adminClient();
  const { data, error } = await db.from("projects").update(updates).eq("id", id).select(PROJECT_FIELDS).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (developer_id !== undefined) {
    await syncProjectAssignment(
      db,
      id,
      developer_id || null,
      developer_hourly_rate,
      developer_hours_allocated
    );
  }
  return NextResponse.json({ project: data });
}

export async function DELETE(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("projects")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = adminClient();
  const { error } = await db.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
