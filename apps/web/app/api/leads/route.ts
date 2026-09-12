import { NextResponse } from "next/server";
import {
  LeadService,
  contactLeadSchema,
  newsletterSchema,
} from "@umbercore/leads";
import { LeadRepository } from "@umbercore/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const type = body.type as string;

    if (type === "contact") {
      const parsed = contactLeadSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.flatten().fieldErrors },
          { status: 400 }
        );
      }

      await Promise.all([
        LeadService.createFromContact(parsed.data),
        LeadRepository.createContactLead(parsed.data),
      ]);

      return NextResponse.json({ success: true });
    }

    if (type === "newsletter") {
      const parsed = newsletterSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
      await Promise.all([
        LeadService.createFromNewsletter(parsed.data),
        LeadRepository.createNewsletterLead(parsed.data.email),
      ]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch (e) {
    console.error("[leads]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
