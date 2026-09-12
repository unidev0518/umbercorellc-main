import { NextResponse } from "next/server";
import {
  LeadService,
  joinUsCandidateSchema,
  joinUsClientSchema,
} from "@umbercore/leads";
import { LeadRepository } from "@umbercore/database";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const type = formData.get("type") as string;

      if (type === "candidate") {
        const fields = {
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          location: formData.get("location"),
        };
        const parsed = joinUsCandidateSchema.safeParse(fields);
        if (!parsed.success) {
          return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }
        const file = formData.get("resume") as File | null;
        let resume: { filename: string; content: Buffer } | undefined;
        if (file && file.size > 0) {
          const bytes = await file.arrayBuffer();
          resume = { filename: file.name, content: Buffer.from(bytes) };
        }

        await Promise.all([
          LeadService.createJoinUsCandidate(parsed.data, resume),
          LeadRepository.createDeveloperLead(parsed.data),
        ]);

        return NextResponse.json({ success: true });
      }
    }

    const body = await request.json();
    const type = body.type as string;

    if (type === "client") {
      const parsed = joinUsClientSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
      }

      await Promise.all([
        LeadService.createJoinUsClient(parsed.data),
        LeadRepository.createClientLead(parsed.data),
      ]);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch (e) {
    console.error("[join-us]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
