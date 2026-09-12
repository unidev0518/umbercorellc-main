import type { Profile, UserRole } from "../types";
import { createAdminClient } from "../client";

export class ProfileRepository {
  static async findById(id: string): Promise<Profile | null> {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data as Profile | null;
  }

  static async upsert(
    id: string,
    email: string,
    role: UserRole,
    names?: { first_name?: string; last_name?: string }
  ): Promise<Profile> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id,
        email: email.toLowerCase(),
        role,
        first_name: names?.first_name ?? null,
        last_name: names?.last_name ?? null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Profile;
  }
}
