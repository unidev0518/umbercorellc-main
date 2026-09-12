import { cookies } from "next/headers";
import { adminClient } from "./supabase";

export async function getAdminContext() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) throw new Error("Unauthorized");

  const db = adminClient();
  const { data: { user }, error } = await db.auth.getUser(session.value);
  if (error || !user) throw new Error("Unauthorized");

  const { data } = await db
    .from("admin_users")
    .select("role, permissions")
    .eq("id", user.id)
    .single();

  const role = data?.role || "staff";
  const permissions: string[] = data?.permissions || [];
  const isSuperAdmin = role === "super_admin";

  return {
    session: session.value,
    userId: user.id,
    role,
    permissions,
    isSuperAdmin,
    can: (perm: string) => isSuperAdmin || permissions.includes(perm),
  };
}
