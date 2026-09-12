import { EmailService } from "@umbercore/email";
import type { ContactLeadInput, NewsletterInput, JoinUsCandidateInput, JoinUsClientInput } from "./schemas";

export class LeadService {
  static async createFromContact(input: ContactLeadInput): Promise<void> {
    await EmailService.notifyAdminNewLead({
      name: `${input.first_name} ${input.last_name}`,
      email: input.email,
      company: input.company_name,
      interest: input.service_interest,
      availability: input.availability ?? undefined,
      message: input.message ?? undefined,
    });
  }

  static async createFromNewsletter(input: NewsletterInput): Promise<void> {
    await EmailService.notifyAdminNewLead({
      name: "Newsletter subscriber",
      email: input.email,
      company: "N/A",
      interest: "newsletter",
    });
  }

  static async createJoinUsCandidate(
    input: JoinUsCandidateInput,
    resume?: { filename: string; content: Buffer }
  ): Promise<void> {
    await EmailService.notifyJoinUs({
      type: "candidate",
      name: `${input.first_name} ${input.last_name}`,
      email: input.email,
      phone: input.phone,
      location: input.location,
      resume,
    });
  }

  static async createJoinUsClient(input: JoinUsClientInput): Promise<void> {
    await EmailService.notifyJoinUs({
      type: "client",
      name: `${input.first_name} ${input.last_name}`,
      email: input.email,
      phone: input.phone,
      company: input.company_name,
    });
  }
}
