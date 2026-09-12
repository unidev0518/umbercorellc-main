import { describe, it, expect } from "vitest";

// Extracted permission logic — mirrors getAdminContext() return shape
function makeCtx(role: string, permissions: string[]) {
  const isSuperAdmin = role === "super_admin";
  return {
    role,
    permissions,
    isSuperAdmin,
    can: (perm: string) => isSuperAdmin || permissions.includes(perm),
  };
}

describe("permission system", () => {
  describe("super_admin", () => {
    const ctx = makeCtx("super_admin", []);

    it("can access every module", () => {
      for (const perm of ["leads", "projects", "invoices", "payroll", "clients", "developers"]) {
        expect(ctx.can(perm)).toBe(true);
      }
    });

    it("isSuperAdmin is true", () => {
      expect(ctx.isSuperAdmin).toBe(true);
    });

    it("can access non-existent permission (super_admin bypasses all)", () => {
      expect(ctx.can("anything")).toBe(true);
    });
  });

  describe("staff with no permissions", () => {
    const ctx = makeCtx("staff", []);

    it("cannot access any module", () => {
      for (const perm of ["leads", "projects", "invoices", "payroll", "clients", "developers"]) {
        expect(ctx.can(perm)).toBe(false);
      }
    });

    it("isSuperAdmin is false", () => {
      expect(ctx.isSuperAdmin).toBe(false);
    });
  });

  describe("staff with specific permissions", () => {
    const ctx = makeCtx("staff", ["leads", "invoices"]);

    it("can access granted permissions", () => {
      expect(ctx.can("leads")).toBe(true);
      expect(ctx.can("invoices")).toBe(true);
    });

    it("cannot access ungranted permissions", () => {
      expect(ctx.can("projects")).toBe(false);
      expect(ctx.can("payroll")).toBe(false);
      expect(ctx.can("clients")).toBe(false);
      expect(ctx.can("developers")).toBe(false);
    });
  });

  describe("all 6 permission modules", () => {
    const ALL = ["leads", "projects", "invoices", "payroll", "clients", "developers"];

    it("each permission is independently grantable", () => {
      for (const perm of ALL) {
        const ctx = makeCtx("staff", [perm]);
        expect(ctx.can(perm)).toBe(true);
        // Should not bleed into others
        for (const other of ALL.filter(p => p !== perm)) {
          expect(ctx.can(other)).toBe(false);
        }
      }
    });
  });
});
