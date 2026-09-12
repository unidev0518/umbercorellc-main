import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PERMISSION_MAP: { prefix: string; permission: string }[] = [
  { prefix: "/leads",      permission: "leads" },
  { prefix: "/projects",   permission: "projects" },
  { prefix: "/time",       permission: "projects" },
  { prefix: "/invoices",   permission: "invoices" },
  { prefix: "/payroll",    permission: "payroll" },
  { prefix: "/clients",    permission: "clients" },
  { prefix: "/developers", permission: "developers" },
  { prefix: "/admins",     permission: "super_admin" },
  { prefix: "/settings",   permission: "super_admin" },
];

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/api/auth") || pathname === "/login";
  let token = req.cookies.get("admin_session")?.value;
  const refreshToken = req.cookies.get("admin_refresh")?.value;

  if (!token && !refreshToken && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const match = PERMISSION_MAP.find(r => pathname.startsWith(r.prefix));
  if (!match && token) return NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  try {
    const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    let accessToken = token;
    let newRefresh = refreshToken;
    let userId: string | null = null;

    if (accessToken) {
      const { data: { user } } = await db.auth.getUser(accessToken);
      userId = user?.id ?? null;
    }

    if (!userId && refreshToken) {
      const { data } = await db.auth.refreshSession({ refresh_token: refreshToken });
      if (!data.session) return NextResponse.redirect(new URL("/login", req.url));
      accessToken = data.session.access_token;
      newRefresh = data.session.refresh_token;
      userId = data.session.user.id;
    }

    if (!userId || !accessToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { data: admin } = await db
      .from("admin_users")
      .select("role, permissions")
      .eq("id", userId)
      .single();

    if (!admin) return NextResponse.redirect(new URL("/login", req.url));

    const isSuperAdmin = admin.role === "super_admin";
    let response = NextResponse.next();
    if (newRefresh && newRefresh !== req.cookies.get("admin_refresh")?.value) {
      response.cookies.set("admin_session", accessToken, COOKIE_OPTS);
      response.cookies.set("admin_refresh", newRefresh, COOKIE_OPTS);
    } else if (accessToken !== token && accessToken) {
      response.cookies.set("admin_session", accessToken, COOKIE_OPTS);
      if (newRefresh) response.cookies.set("admin_refresh", newRefresh, COOKIE_OPTS);
    }

    if (!match) return response;
    if (isSuperAdmin) return response;
    if (match.permission === "super_admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const permissions: string[] = admin.permissions || [];
    if (!permissions.includes(match.permission)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png).*)"],
};
