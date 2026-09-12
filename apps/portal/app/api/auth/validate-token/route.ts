import { NextRequest, NextResponse } from "next/server";
import { MagicLinkRepository } from "@umbercore/database";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "No token provided" }, { status: 400 });

  const link = await MagicLinkRepository.findByToken(token);
  if (!link) return NextResponse.json({ error: "Invalid or expired invitation link" }, { status: 400 });
  if (link.used) return NextResponse.json({ error: "This invitation link has already been used" }, { status: 400 });
  if (new Date(link.expires_at) < new Date()) return NextResponse.json({ error: "This invitation link has expired" }, { status: 400 });

  return NextResponse.json({ role: link.role, email: link.email });
}
