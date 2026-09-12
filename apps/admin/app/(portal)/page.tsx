import { redirect } from "next/navigation";
import { adminClient } from "@/lib/supabase";
import { getAdminContext } from "@/lib/permissions";
import AdminDashboard from "./AdminDashboard";

const PERM_ROUTES = [
  { permission: "leads",      href: "/leads" },
  { permission: "projects",   href: "/projects" },
  { permission: "invoices",   href: "/invoices" },
  { permission: "payroll",    href: "/payroll" },
  { permission: "clients",    href: "/clients" },
  { permission: "developers", href: "/developers" },
];

export default async function PortalRoot() {
  let ctx;
  try { ctx = await getAdminContext(); } catch { redirect("/login"); }

  if (ctx.isSuperAdmin) {
    const db = adminClient();
    const { data: adminUser } = await db.from("admin_users").select("full_name").eq("id", ctx.userId).single();
    const firstName = adminUser?.full_name?.split(" ")[0] || "Admin";
    return <AdminDashboard firstName={firstName} />;
  }

  // Staff: redirect to first permitted section
  const first = PERM_ROUTES.find(r => ctx.permissions.includes(r.permission));
  if (first) redirect(first.href);
  redirect("/no-access");
}
