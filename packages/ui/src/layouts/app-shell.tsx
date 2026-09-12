"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  Users,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "../assets/logo";
import { cn } from "../lib/utils";
import { Badge } from "../primitives/badge";
import { Button } from "../primitives/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  locked?: boolean;
}

export function MemberShell({
  children,
  tier = "starter",
  userName = "Member",
}: {
  children: React.ReactNode;
  tier?: string;
  userName?: string;
}) {
  const pathname = usePathname();
  const nav: NavItem[] = [
    { href: "/member/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/member/briefs", label: "Briefs", icon: FileText, locked: tier === "starter" },
    { href: "/member/templates", label: "Templates", icon: FolderOpen, locked: tier === "starter" },
    { href: "/member/settings", label: "Settings", icon: Settings },
  ];

  return (
    <AppShellBase
      nav={nav}
      pathname={pathname}
      badge={<Badge variant="accent" className="capitalize">{tier}</Badge>}
      userName={userName}
      portalLabel="Member Portal"
    >
      {children}
    </AppShellBase>
  );
}

export function AdminShell({
  children,
  userName = "Admin",
}: {
  children: React.ReactNode;
  userName?: string;
}) {
  const pathname = usePathname();
  const nav: NavItem[] = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/leads", label: "Leads", icon: Users },
    { href: "/admin/members", label: "Members", icon: UserCircle },
  ];

  return (
    <AppShellBase
      nav={nav}
      pathname={pathname}
      badge={<Badge variant="secondary">Admin</Badge>}
      userName={userName}
      portalLabel="Admin"
    >
      {children}
    </AppShellBase>
  );
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const href = item.locked ? "/membership" : item.href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active && !item.locked
          ? "bg-brand-green/20 text-brand-green"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        item.locked && "opacity-80"
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
      {item.locked && (
        <span className="ml-auto text-xs text-brand-blue">Upgrade</span>
      )}
    </Link>
  );
}

function AppShellBase({
  children,
  nav,
  pathname,
  badge,
  userName,
  portalLabel,
}: {
  children: React.ReactNode;
  nav: NavItem[];
  pathname: string;
  badge: React.ReactNode;
  userName: string;
  portalLabel: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-default">
      <aside className="hidden w-64 flex-col border-r border-border bg-surface-elevated lg:flex">
        <div className="border-b border-border p-6">
          <Link href="/">
            <Logo />
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">{portalLabel}</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map((item) => (
            <NavLink key={item.href} item={item} active={pathname === item.href} />
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green/15 font-semibold text-brand-green">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{userName}</p>
              {badge}
            </div>
          </div>
          <form action="/api/auth/signout" method="POST" className="mt-4">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface-elevated px-4 lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            {badge}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 flex h-full w-72 flex-col border-l border-border bg-surface-elevated shadow-elevated">
              <div className="flex items-center justify-between border-b border-border p-4">
                <span className="text-sm font-semibold">{portalLabel}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                {nav.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={pathname === item.href}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
              </nav>
              <div className="border-t border-border p-4">
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
