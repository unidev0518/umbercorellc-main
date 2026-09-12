import type { Member, MemberScenario, MemberTier, SubStatus } from "../types";
import { createAdminClient } from "../client";

export interface UpsertMemberInput {
  user_id: string;
  first_name: string;
  last_name: string;
  tier: MemberTier;
  scenario?: MemberScenario | null;
  stripe_customer_id: string;
  stripe_sub_id: string;
  sub_status?: SubStatus;
}

export class MemberRepository {
  static async findByUserId(userId: string): Promise<Member | null> {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    return data as Member | null;
  }

  static async upsert(input: UpsertMemberInput): Promise<Member> {
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("members")
      .select("id")
      .eq("user_id", input.user_id)
      .maybeSingle();

    const payload = {
      user_id: input.user_id,
      first_name: input.first_name,
      last_name: input.last_name,
      tier: input.tier,
      scenario: input.scenario ?? null,
      stripe_customer_id: input.stripe_customer_id,
      stripe_sub_id: input.stripe_sub_id,
      sub_status: input.sub_status ?? "active",
      sub_start_date: new Date().toISOString().split("T")[0],
      billing_cycle: "monthly" as const,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { data, error } = await supabase
        .from("members")
        .update(payload)
        .eq("user_id", input.user_id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Member;
    }

    const { data, error } = await supabase
      .from("members")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Member;
  }

  static async updateSubscription(
    stripeSubId: string,
    updates: Partial<Pick<Member, "tier" | "sub_status" | "sub_end_date">>
  ): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("members")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("stripe_sub_id", stripeSubId);
    if (error) throw new Error(error.message);
  }

  static async listAll(): Promise<Member[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Member[];
  }
}
