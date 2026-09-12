import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
};

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isPublic =
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname === "/register";

  let token = req.cookies.get("portal_session")?.value;
  const refreshToken = req.cookies.get("portal_refresh")?.value;

  if (!token && !refreshToken && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublic || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return NextResponse.next();

  try {
    const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    let userId: string | null = null;
    if (token) {
      const { data: { user } } = await db.auth.getUser(token);
      userId = user?.id ?? null;
    }
    if (userId) return NextResponse.next();
    if (!refreshToken) return NextResponse.redirect(new URL("/login", req.url));

    const { data } = await db.auth.refreshSession({ refresh_token: refreshToken });
    if (!data.session) return NextResponse.redirect(new URL("/login", req.url));

    const res = NextResponse.next();
    res.cookies.set("portal_session", data.session.access_token, COOKIE_OPTS);
    res.cookies.set("portal_refresh", data.session.refresh_token, COOKIE_OPTS);
    return res;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
