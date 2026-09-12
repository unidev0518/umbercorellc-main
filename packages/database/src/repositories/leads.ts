import type {
  Lead,
  CreateClientLeadInput,
  CreateDeveloperLeadInput,
  CreateContactLeadInput,
  MagicLink,
} from "../types";
import { createAdminClient, isSupabaseConfigured } from "../client";

function warn(method: string, email: string) {
  console.warn(`[leads:${method}] Supabase not configured — skipping DB save for ${email}`);
}

export class LeadRepository {
  static async createClientLead(input: CreateClientLeadInput): Promise<Lead | null> {
    if (!isSupabaseConfigured()) { warn("createClientLead", input.email); return null; }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        type: "client",
        status: "new",
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        company_name: input.company_name,
        job_type: input.job_type ?? null,
        message: input.message ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Lead;
  }

  static async createDeveloperLead(input: CreateDeveloperLeadInput): Promise<Lead | null> {
    if (!isSupabaseConfigured()) { warn("createDeveloperLead", input.email); return null; }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        type: "developer",
        status: "new",
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        location: input.location,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Lead;
  }

  static async createContactLead(input: CreateContactLeadInput): Promise<Lead | null> {
    if (!isSupabaseConfigured()) { warn("createContactLead", input.email); return null; }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        type: "contact",
        status: "new",
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email.toLowerCase(),
        company_name: input.company_name,
        service_interest: input.service_interest ?? null,
        availability: input.availability ?? null,
        message: input.message ?? null,
        source: input.source ?? null,
        source_detail: input.source_detail ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Lead;
  }

  static async createNewsletterLead(email: string): Promise<Lead | null> {
    if (!isSupabaseConfigured()) { warn("createNewsletterLead", email); return null; }
    const supabase = createAdminClient();
    const local = email.split("@")[0] || "subscriber";
    const { data, error } = await supabase
      .from("leads")
      .insert({
        type: "contact",
        status: "new",
        first_name: local,
        last_name: "newsletter",
        email: email.toLowerCase(),
        company_name: "N/A",
        source: "direct",
        source_detail: "newsletter",
        message: "Newsletter signup",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Lead;
  }

  static async listAll(): Promise<Lead[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Lead[];
  }

  static async listByType(type: Lead["type"]): Promise<Lead[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("type", type)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Lead[];
  }

  static async updateStatus(id: string, status: Lead["status"], notes?: string): Promise<Lead> {
    const supabase = createAdminClient();
    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) update.notes = notes;
    const { data, error } = await supabase
      .from("leads")
      .update(update)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Lead;
  }

  static async findById(id: string): Promise<Lead | null> {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data as Lead | null;
  }
}

export class MagicLinkRepository {
  static async create(leadId: string, email: string, role: MagicLink["role"]): Promise<MagicLink> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("magic_links")
      .insert({
        lead_id: leadId,
        email: email.toLowerCase(),
        role,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as MagicLink;
  }

  static async findByToken(token: string): Promise<MagicLink | null> {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("magic_links")
      .select("*")
      .eq("token", token)
      .maybeSingle();
    return data as MagicLink | null;
  }

  static async markUsed(id: string): Promise<void> {
    const supabase = createAdminClient();
    await supabase.from("magic_links").update({ used: true }).eq("id", id);
  }
}
