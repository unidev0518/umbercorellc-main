import { describe, it, expect } from "vitest";

function makeCtx(role: string, permissions: string[]) {
  const isSuperAdmin = role === "super_admin";
  return {
    role,
    permissions,
    isSuperAdmin,
    can: (perm: string) => isSuperAdmin || permissions.includes(perm),
  };
}

const ALL_PERMS = ["leads", "projects", "invoices", "payroll", "clients", "developers"];

// ─── ROLE SPOOFING ATTEMPTS ───────────────────────────────────────────────────

describe("role spoofing — breaking cases", () => {
  it("'SUPER_ADMIN' (uppercase) is not treated as super_admin", () => {
    const ctx = makeCtx("SUPER_ADMIN", []);
    expect(ctx.isSuperAdmin).toBe(false);
    for (const p of ALL_PERMS) expect(ctx.can(p)).toBe(false);
  });

  it("'Super_Admin' (mixed case) is not treated as super_admin", () => {
    const ctx = makeCtx("Super_Admin", []);
    expect(ctx.isSuperAdmin).toBe(false);
  });

  it("' super_admin' (leading space) is not treated as super_admin", () => {
    const ctx = makeCtx(" super_admin", []);
    expect(ctx.isSuperAdmin).toBe(false);
  });

  it("'super_admin ' (trailing space) is not treated as super_admin", () => {
    const ctx = makeCtx("super_admin ", []);
    expect(ctx.isSuperAdmin).toBe(false);
  });

  it("empty string role is not super_admin", () => {
    const ctx = makeCtx("", []);
    expect(ctx.isSuperAdmin).toBe(false);
    expect(ctx.can("leads")).toBe(false);
  });

  it("'admin' (without super_ prefix) is not super_admin", () => {
    const ctx = makeCtx("admin", []);
    expect(ctx.isSuperAdmin).toBe(false);
    for (const p of ALL_PERMS) expect(ctx.can(p)).toBe(false);
  });
});

// ─── PERMISSION SPOOFING ATTEMPTS ─────────────────────────────────────────────

describe("permission spoofing — breaking cases", () => {
  it("'LEADS' (uppercase) does not grant leads access", () => {
    const ctx = makeCtx("staff", ["LEADS"]);
    expect(ctx.can("leads")).toBe(false);
  });

  it("'Leads' (mixed case) does not grant leads access", () => {
    const ctx = makeCtx("staff", ["Leads"]);
    expect(ctx.can("leads")).toBe(false);
  });

  it("'leads ' (trailing space) does not grant leads access", () => {
    const ctx = makeCtx("staff", ["leads "]);
    expect(ctx.can("leads")).toBe(false);
  });

  it("' leads' (leading space) does not grant leads access", () => {
    const ctx = makeCtx("staff", [" leads"]);
    expect(ctx.can("leads")).toBe(false);
  });

  it("'*' wildcard does not grant all permissions", () => {
    const ctx = makeCtx("staff", ["*"]);
    for (const p of ALL_PERMS) expect(ctx.can(p)).toBe(false);
  });

  it("empty string permission in array does not grant access", () => {
    const ctx = makeCtx("staff", [""]);
    for (const p of ALL_PERMS) expect(ctx.can(p)).toBe(false);
    expect(ctx.can("")).toBe(true); // but can("") returns true — an empty check
  });

  it("'super_admin' in permissions array does not elevate role", () => {
    const ctx = makeCtx("staff", ["super_admin"]);
    expect(ctx.isSuperAdmin).toBe(false);
    // can("super_admin") would return true but that's not a real permission
    for (const p of ALL_PERMS) expect(ctx.can(p)).toBe(false);
  });

  it("prototype pollution attempt: '__proto__' key does not grant access", () => {
    const ctx = makeCtx("staff", ["__proto__", "constructor"]);
    for (const p of ALL_PERMS) expect(ctx.can(p)).toBe(false);
  });

  it("duplicate permissions in array don't cause issues", () => {
    const ctx = makeCtx("staff", ["leads", "leads", "leads"]);
    expect(ctx.can("leads")).toBe(true);
    expect(ctx.can("projects")).toBe(false);
  });

  it("very long permission string is not granted", () => {
    const ctx = makeCtx("staff", ["leads"]);
    expect(ctx.can("leads" + "x".repeat(1000))).toBe(false);
  });
});

// ─── PERMISSION ISOLATION ─────────────────────────────────────────────────────

describe("permission isolation — breaking cases", () => {
  it("having all 6 permissions as staff is not the same as super_admin", () => {
    const ctx = makeCtx("staff", ALL_PERMS);
    expect(ctx.isSuperAdmin).toBe(false);
    // All perms pass
    for (const p of ALL_PERMS) expect(ctx.can(p)).toBe(true);
    // But unknown perms do NOT pass (unlike super_admin who bypasses all)
    expect(ctx.can("admin")).toBe(false);
    expect(ctx.can("settings")).toBe(false);
    expect(ctx.can("anything")).toBe(false);
  });

  it("super_admin with empty permissions still has full access", () => {
    const ctx = makeCtx("super_admin", []);
    for (const p of ALL_PERMS) expect(ctx.can(p)).toBe(true);
    expect(ctx.can("anything")).toBe(true);
  });

  it("super_admin ignores the permissions array entirely", () => {
    // Even if the DB permissions array is corrupted or empty, super_admin still gets full access
    const ctxEmpty = makeCtx("super_admin", []);
    const ctxFull  = makeCtx("super_admin", ALL_PERMS);
    for (const p of ALL_PERMS) {
      expect(ctxEmpty.can(p)).toBe(ctxFull.can(p));
    }
  });

  it("no permission bleeds into adjacent permission in the ALL_PERMS array", () => {
    for (let i = 0; i < ALL_PERMS.length - 1; i++) {
      const ctx = makeCtx("staff", [ALL_PERMS[i]]);
      expect(ctx.can(ALL_PERMS[i + 1])).toBe(false);
    }
  });

  it("revoking a permission (removing from array) is immediately effective", () => {
    // Simulate: permission granted then revoked by re-calling makeCtx with new perms
    const ctxBefore = makeCtx("staff", ["leads", "invoices"]);
    const ctxAfter  = makeCtx("staff", ["leads"]); // invoices revoked
    expect(ctxBefore.can("invoices")).toBe(true);
    expect(ctxAfter.can("invoices")).toBe(false);
    expect(ctxAfter.can("leads")).toBe(true); // other perms unaffected
  });
});

// ─── BOUNDARY / EDGE ──────────────────────────────────────────────────────────

describe("boundary checks — breaking cases", () => {
  it("can() with empty string does not accidentally grant access to a real perm", () => {
    const ctx = makeCtx("staff", ["leads"]);
    expect(ctx.can("")).toBe(false);
  });

  it("can() check is not confused by substring matches", () => {
    const ctx = makeCtx("staff", ["lead"]); // 'lead' not 'leads'
    expect(ctx.can("leads")).toBe(false);

    const ctx2 = makeCtx("staff", ["invoices"]);
    expect(ctx2.can("invoice")).toBe(false); // singular
  });

  it("permissions list is treated as exact-match, not prefix/suffix", () => {
    const ctx = makeCtx("staff", ["dev"]);
    expect(ctx.can("developers")).toBe(false);

    const ctx2 = makeCtx("staff", ["developerss"]); // typo
    expect(ctx2.can("developers")).toBe(false);
  });
});
