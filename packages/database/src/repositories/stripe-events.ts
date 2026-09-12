import { createAdminClient } from "../client";

export class StripeEventRepository {
  static async wasProcessed(eventId: string): Promise<boolean> {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("stripe_events")
      .select("id")
      .eq("event_id", eventId)
      .maybeSingle();
    return !!data;
  }

  static async markProcessed(eventId: string, eventType: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase.from("stripe_events").insert({
      event_id: eventId,
      event_type: eventType,
    });
    if (error && !error.message.includes("duplicate")) {
      throw new Error(error.message);
    }
  }
}
