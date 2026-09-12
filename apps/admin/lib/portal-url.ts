export function getPortalUrl(): string {
  const raw = process.env.PORTAL_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") return "http://localhost:3002";
  return "https://portal.umbercore.com";
}

export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
