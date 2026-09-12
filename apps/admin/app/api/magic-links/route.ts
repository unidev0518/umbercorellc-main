import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { MagicLinkRepository } from "@umbercore/database";
import { getAdminContext } from "@/lib/permissions";
import { EmailService } from "@umbercore/email";
import { getPortalUrl } from "@/lib/portal-url";

export async function POST(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("leads")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { lead_id, email, role } = await req.json();
  if (!lead_id || !email || !role) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  if (!["client", "developer"].includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  const db = adminClient();

  // Delete any existing unused links for this lead so there's only one active at a time
  await db.from("magic_links").delete().eq("lead_id", lead_id).eq("used", false);

  const link = await MagicLinkRepository.create(lead_id, email, role);
  if (!link) return NextResponse.json({ error: "Failed to create magic link" }, { status: 500 });

  const baseUrl = getPortalUrl();
  const registrationUrl = `${baseUrl}/register?token=${link.token}`;

  // Fetch lead name for the email
  const { data: lead } = await db.from("leads").select("first_name, last_name").eq("id", lead_id).single();
  const recipientName = lead ? `${lead.first_name} ${lead.last_name}`.trim() : email;

  // Fire-and-forget — don't fail the request if email fails
  EmailService.sendMagicLink({ to: email, recipientName, role, registrationUrl }).catch(err =>
    console.error("[email] Failed to send magic link email:", err)
  );

  return NextResponse.json({ url: registrationUrl, expires_at: link.expires_at });
}

export async function GET(req: NextRequest) {
  let ctx;
  try { ctx = await getAdminContext(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  if (!ctx.can("leads")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const lead_id = req.nextUrl.searchParams.get("lead_id");
  if (!lead_id) return NextResponse.json({ error: "Missing lead_id" }, { status: 400 });

  const db = adminClient();
  const { data, error } = await db.from("magic_links").select("*").eq("lead_id", lead_id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ links: data });
}
