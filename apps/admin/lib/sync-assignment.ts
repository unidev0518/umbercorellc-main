import type { SupabaseClient } from "@supabase/supabase-js";

export async function syncProjectAssignment(
  db: SupabaseClient,
  projectId: string,
  developerId: string | null,
  hourlyRate?: number | null,
  hoursAllocated?: number | null
): Promise<void> {
  await db.from("project_members").delete().eq("project_id", projectId);
  if (!developerId) return;
  await db.from("project_members").insert({
    project_id: projectId,
    developer_id: developerId,
    hourly_rate: hourlyRate ?? null,
    hours_allocated: hoursAllocated ?? null,
  });
}
