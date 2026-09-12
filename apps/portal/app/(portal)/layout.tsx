import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminClient, browserClient } from "@/lib/supabase";
import NavLink from "@/components/NavLink";
import LogoutButton from "@/components/LogoutButton";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("portal_session");
  const role = cookieStore.get("portal_role")?.value;
  if (!session) redirect("/login");

  let userName = "";
  try {
    const { data: { user } } = await browserClient().auth.getUser(session.value);
    if (user) {
      const { data } = await adminClient().from("portal_users").select("full_name").eq("id", user.id).single();
      if (data?.full_name) userName = data.full_name.split(" ")[0];
    }
  } catch {}

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ...(role === "client" ? [
      { href: "/projects",  label: "Projects",  icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
      { href: "/invoices",  label: "Invoices",  icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    ] : []),
    ...(role === "developer" ? [
      { href: "/assignments", label: "Assignments", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
      { href: "/time", label: "Time tracking", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    ] : []),
    { href: "/profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <aside className="w-52 flex-shrink-0 flex flex-col" style={{ background: "var(--bg-sidebar)", borderRight: "0.5px solid var(--border-subtle)" }}>
        <div className="px-5 py-5" style={{ borderBottom: "0.5px solid var(--border-subtle)" }}>
          <div className="text-base font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            <span style={{ color: "var(--green)" }}>Umber</span>Core
          </div>
          <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest capitalize" style={{ color: "var(--text-muted)" }}>
            {role} portal
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(item => (
            <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label} />
          ))}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: "0.5px solid var(--border-subtle)" }}>
          {userName && (
            <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: "var(--green-bg)", border: "1px solid var(--green-border)", color: "var(--green)" }}>
                {userName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{userName}</p>
                <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{role}</p>
              </div>
            </div>
          )}
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
