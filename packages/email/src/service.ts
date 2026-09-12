import { Resend } from "resend";
import { render } from "@react-email/components";
import { LeadNotificationEmail } from "./templates/lead-notification";
import { JoinUsNotificationEmail } from "./templates/join-us-notification";
import { MagicLinkEmail } from "./templates/magic-link";
import { TimeEntryReviewedEmail } from "./templates/time-entry-reviewed";
import { InvoiceSentEmail } from "./templates/invoice-sent";

let resend: Resend | null = null;

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  if (!resend) resend = new Resend(key);
  return resend;
}

const FROM = process.env.EMAIL_FROM ?? "UmberCore <support@umbercore.com>";

export type NewLeadPayload = {
  name: string;
  email: string;
  company: string;
  interest: string;
  availability?: string;
  message?: string;
};

export type JoinUsPayload =
  | {
      type: "candidate";
      name: string;
      email: string;
      phone: string;
      location: string;
      resume?: { filename: string; content: Buffer };
    }
  | {
      type: "client";
      name: string;
      email: string;
      phone: string;
      company: string;
    };

export class EmailService {
  static async notifyAdminNewLead(payload: NewLeadPayload): Promise<void> {
    const to = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!to || !process.env.RESEND_API_KEY) {
      console.log("[email] Lead notification skipped (no RESEND config):", payload.email);
      return;
    }
    const html = await render(LeadNotificationEmail(payload));
    await getResend().emails.send({
      from: FROM,
      to,
      subject: `New inquiry: ${payload.name} — ${payload.company}`,
      html,
    });
  }

  static async sendMagicLink(payload: {
    to: string; recipientName: string; role: "client" | "developer";
    registrationUrl: string; expiresHours?: number;
  }): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      console.log("[email] Magic link email skipped (no RESEND config). URL:", payload.registrationUrl);
      return;
    }
    const html = await render(MagicLinkEmail(payload));
    await getResend().emails.send({
      from: FROM, to: payload.to,
      subject: `Your UmberCore ${payload.role} portal invitation`,
      html,
    });
  }

  static async notifyTimeEntryReviewed(payload: {
    to: string; developerName: string; action: "approved" | "rejected";
    entries: { project: string; date: string; hours: number }[];
    rejectReason?: string;
  }): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      console.log("[email] Time review email skipped (no RESEND config):", payload.to);
      return;
    }
    const html = await render(TimeEntryReviewedEmail(payload));
    const totalHours = payload.entries.reduce((s, e) => s + e.hours, 0);
    await getResend().emails.send({
      from: FROM, to: payload.to,
      subject: payload.action === "approved"
        ? `${totalHours}h approved — UmberCore time entries`
        : `Time entries rejected — UmberCore`,
      html,
    });
  }

  static async sendInvoice(payload: {
    to: string; clientName: string; invoiceNumber: string; projectName: string;
    amount: string; dueDate: string | null; portalUrl: string; notes?: string | null;
  }): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      console.log("[email] Invoice email skipped (no RESEND config):", payload.to);
      return;
    }
    const html = await render(InvoiceSentEmail(payload));
    await getResend().emails.send({
      from: FROM, to: payload.to,
      subject: `Invoice ${payload.invoiceNumber} — ${payload.amount} due`,
      html,
    });
  }

  static async notifyJoinUs(payload: JoinUsPayload): Promise<void> {
    const to = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!to || !process.env.RESEND_API_KEY) {
      console.log("[email] Join Us notification skipped (no RESEND config):", payload.email);
      return;
    }
    const html = await render(JoinUsNotificationEmail(payload));
    const subject =
      payload.type === "candidate"
        ? `New candidate: ${payload.name} — ${payload.location}`
        : `New client inquiry: ${payload.name} — ${payload.company}`;
    const attachments =
      payload.type === "candidate" && payload.resume
        ? [{ filename: payload.resume.filename, content: payload.resume.content }]
        : undefined;
    await getResend().emails.send({ from: FROM, to, subject, html, attachments });
  }
}
