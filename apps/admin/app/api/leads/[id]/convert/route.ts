import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";
import { EmailService } from "@umbercore/email";
import { getPortalUrl } from "@/lib/portal-url";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("leads")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { role } = await req.json(); // "client" | "developer"
  if (!["client", "developer"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const db = adminClient();

  const { data: lead } = await db.from("leads").select("*").eq("id", id).single();
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  if (lead.converted_at) return NextResponse.json({ error: "Lead already converted" }, { status: 409 });

  // Delete any existing unused links for this lead first
  await db.from("magic_links").delete().eq("lead_id", id).eq("used", false);

  // Generate magic link token
  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const { error: linkError } = await db.from("magic_links").insert({
    token,
    email: lead.email,
    role,
    lead_id: id,
    expires_at: expiresAt,
  });

  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 });

  // Mark lead as converted
  const finalStage = role === "client" ? "won" : "hired";
  await db.from("leads").update({
    converted_at: new Date().toISOString(),
    pipeline_stage: finalStage,
    status: "qualified",
  }).eq("id", id);

  // Log activity
  const { data: { user: authUser } } = await db.auth.getUser(ctx.session);
  const { data: adminUser } = await db.from("admin_users").select("id").eq("email", authUser?.email || "").single();
  await db.from("lead_activities").insert({
    lead_id: id,
    type: "stage_change",
    content: `Converted to ${role} — registration link generated`,
    created_by: adminUser?.id || null,
  });

  const baseUrl = getPortalUrl();
  const magicUrl = `${baseUrl}/register?token=${token}`;

  EmailService.sendMagicLink({
    to: lead.email,
    recipientName: `${lead.first_name} ${lead.last_name}`.trim() || lead.email,
    role,
    registrationUrl: magicUrl,
  }).catch(err => console.error("[email] Failed to send convert magic link:", err));

  return NextResponse.json({ magicUrl }, { status: 201 });
}
