import { z } from "zod";

export const contactLeadSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  company_name: z.string().min(1).max(200),
  service_interest: z.enum([
    "ai-consulting",
    "staff-augmentation",
    "project-delivery",
    "technical-discovery",
    "team-enablement",
    "advisory-retainer",
    "not_sure",
  ]),
  availability: z.string().max(500).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  source: z.enum([
    "linkedin",
    "google",
    "referral",
    "direct",
    "other",
  ]),
  source_detail: z.string().max(500).optional().nullable(),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const joinUsCandidateSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(1).max(30),
  location: z.string().min(1).max(200),
});

export const joinUsClientSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(1).max(30),
  company_name: z.string().min(1).max(200),
  job_type: z.enum(["direct_placement", "contract", "right_to_hire", "temporary_project"]).optional(),
  message: z.string().max(2000).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "You must accept to continue." }) }),
});

export type ContactLeadInput = z.infer<typeof contactLeadSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type JoinUsCandidateInput = z.infer<typeof joinUsCandidateSchema>;
export type JoinUsClientInput = z.infer<typeof joinUsClientSchema>;
