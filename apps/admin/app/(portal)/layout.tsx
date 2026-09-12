import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminClient } from "@/lib/supabase";
import NavLink from "@/components/NavLink";
import LogoutButton from "@/components/LogoutButton";

const ALL_NAV = [
  { href: "/leads", label: "Leads", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", permission: "leads" },
  { href: "/projects", label: "Projects", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z", permission: "projects" },
  { href: "/time", label: "Time", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", permission: "projects" },
  { href: "/invoices", label: "Invoices", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", permission: "invoices" },
  { href: "/payroll", label: "Payroll", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z", permission: "payroll" },
  { href: "/clients", label: "Clients", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", permission: "clients" },
  { href: "/developers", label: "Developers", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", permission: "developers" },
];

const ADMIN_NAV = { href: "/admins", label: "Admin users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", permission: "admin" };
const SETTINGS_NAV = { href: "/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", permission: "admin" };

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) redirect("/login");

  const db = adminClient();

  // Always read from DB so permission changes are reflected immediately on refresh
  let role = "staff";
  let permissions: string[] = [];
  let adminName = "Admin";

  try {
    const { data: { user } } = await db.auth.getUser(session.value);
    if (!user) redirect("/login");

    const { data } = await db
      .from("admin_users")
      .select("full_name, role, permissions")
      .eq("id", user.id)
      .single();

    if (data) {
      role = data.role || "staff";
      permissions = data.permissions || [];
      if (data.full_name) adminName = data.full_name.split(" ")[0];
    }
  } catch {}

  // Payroll badge: projects with hours since last paid invoice
  let payrollCount = 0;
  if (role === "super_admin" || permissions.includes("payroll")) {
    try {
      const { data: unpaidProjects } = await db
        .from("projects")
        .select("id")
        .eq("status", "active")
        .not("developer_id", "is", null);
      payrollCount = unpaidProjects?.length || 0;
    } catch {}
  }

  const nav = ALL_NAV.filter(item =>
    role === "super_admin" || permissions.includes(item.permission)
  );
  const uniqueNav = nav.filter((item, i, arr) => arr.findIndex(x => x.href === item.href) === i);
  if (role === "super_admin") {
    uniqueNav.unshift({ href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", permission: "admin" });
    uniqueNav.push(ADMIN_NAV);
    uniqueNav.push(SETTINGS_NAV);
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <aside className="w-52 flex-shrink-0 flex flex-col" style={{ background: "var(--bg-sidebar)", borderRight: "0.5px solid var(--border-subtle)" }}>
        <div className="px-5 py-5" style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
          <div className="text-base font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            <span style={{ color: "var(--green)" }}>Umber</span>Core
          </div>
          <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Admin</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {uniqueNav.map((item) => (
            <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label}
              badge={item.href === "/payroll" ? payrollCount : undefined} />
          ))}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: "0.5px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "var(--green-bg)", border: "1px solid var(--green-border)", color: "var(--green)" }}>
              {adminName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{adminName}</p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {role === "super_admin" ? "Super admin" : "Staff"}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
