export type AdminRole = "super_admin" | "staff";

export type LeadType = "client" | "developer" | "contact";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "rejected";

export type MagicLinkRole = "client" | "developer";

export type UserRole = "admin" | "client" | "developer";

export interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  job_type: string | null;
  message: string | null;
  location: string | null;
  service_interest: string | null;
  availability: string | null;
  source: string | null;
  source_detail: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateClientLeadInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  job_type?: string | null;
  message?: string | null;
}

export interface CreateDeveloperLeadInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
}

export interface CreateContactLeadInput {
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  service_interest?: string | null;
  availability?: string | null;
  message?: string | null;
  source?: string | null;
  source_detail?: string | null;
}

export interface MagicLink {
  id: string;
  token: string;
  lead_id: string;
  role: MagicLinkRole;
  email: string;
  used: boolean;
  expires_at: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  created_at: string;
}
