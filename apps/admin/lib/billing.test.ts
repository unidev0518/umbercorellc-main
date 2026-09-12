import { describe, it, expect } from "vitest";
import { getBillingPeriods } from "./billing";

// Create a UTC midnight date matching how the cron builds `today`
const d = (str: string) => {
  const [y, mo, day] = str.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, day));
};

describe("getBillingPeriods", () => {
  describe("monthly", () => {
    const project = { billing_frequency: "monthly", billing_day_1: 15, billing_day_2: null, billing_anchor_date: null };

    it("returns period on billing day", () => {
      const result = getBillingPeriods(project, d("2026-07-15"));
      expect(result).toEqual({ periodStart: "2026-06-16", periodEnd: "2026-07-15" });
    });

    it("returns null on non-billing day", () => {
      expect(getBillingPeriods(project, d("2026-07-14"))).toBeNull();
      expect(getBillingPeriods(project, d("2026-07-16"))).toBeNull();
    });

    it("returns null when billing_day_1 is missing", () => {
      expect(getBillingPeriods({ ...project, billing_day_1: null }, d("2026-07-15"))).toBeNull();
    });

    it("handles month boundary correctly (day 1)", () => {
      const p = { ...project, billing_day_1: 1 };
      const result = getBillingPeriods(p, d("2026-07-01"));
      expect(result).toEqual({ periodStart: "2026-06-02", periodEnd: "2026-07-01" });
    });

    it("handles year boundary (January billing day)", () => {
      const result = getBillingPeriods(project, d("2026-01-15"));
      expect(result).toEqual({ periodStart: "2025-12-16", periodEnd: "2026-01-15" });
    });
  });

  describe("semi_monthly", () => {
    const project = { billing_frequency: "semi_monthly", billing_day_1: 1, billing_day_2: 15, billing_anchor_date: null };

    it("returns first-half period on day1", () => {
      const result = getBillingPeriods(project, d("2026-07-01"));
      expect(result).toEqual({ periodStart: "2026-06-16", periodEnd: "2026-07-01" });
    });

    it("returns second-half period on day2", () => {
      const result = getBillingPeriods(project, d("2026-07-15"));
      expect(result).toEqual({ periodStart: "2026-07-02", periodEnd: "2026-07-15" });
    });

    it("returns null on non-billing days", () => {
      expect(getBillingPeriods(project, d("2026-07-10"))).toBeNull();
      expect(getBillingPeriods(project, d("2026-07-16"))).toBeNull();
    });

    it("returns null when day1 or day2 is missing", () => {
      expect(getBillingPeriods({ ...project, billing_day_1: null }, d("2026-07-15"))).toBeNull();
      expect(getBillingPeriods({ ...project, billing_day_2: null }, d("2026-07-01"))).toBeNull();
    });

    it("handles year boundary on day1 in January", () => {
      const result = getBillingPeriods(project, d("2026-01-01"));
      expect(result).toEqual({ periodStart: "2025-12-16", periodEnd: "2026-01-01" });
    });
  });

  describe("bi_weekly", () => {
    // Anchor: 2026-07-03 (a Friday). Periods end every 14 days: 07-03, 07-17, 07-31, ...
    const project = { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "2026-07-03" };

    it("returns period on anchor date (first period)", () => {
      const result = getBillingPeriods(project, d("2026-07-03"));
      expect(result).toEqual({ periodStart: "2026-06-20", periodEnd: "2026-07-03" });
    });

    it("returns period on next billing date (anchor + 14 days)", () => {
      const result = getBillingPeriods(project, d("2026-07-17"));
      expect(result).toEqual({ periodStart: "2026-07-04", periodEnd: "2026-07-17" });
    });

    it("returns period on anchor + 28 days", () => {
      const result = getBillingPeriods(project, d("2026-07-31"));
      expect(result).toEqual({ periodStart: "2026-07-18", periodEnd: "2026-07-31" });
    });

    it("returns null on non-billing days", () => {
      expect(getBillingPeriods(project, d("2026-07-04"))).toBeNull();
      expect(getBillingPeriods(project, d("2026-07-10"))).toBeNull();
      expect(getBillingPeriods(project, d("2026-07-16"))).toBeNull();
    });

    it("returns null when anchor date is missing", () => {
      expect(getBillingPeriods({ ...project, billing_anchor_date: null }, d("2026-07-03"))).toBeNull();
    });
  });

  describe("unknown frequency", () => {
    it("returns null for unrecognised frequency", () => {
      const project = { billing_frequency: "weekly", billing_day_1: 1, billing_day_2: null, billing_anchor_date: null };
      expect(getBillingPeriods(project, d("2026-07-03"))).toBeNull();
    });

    it("returns null when frequency is null", () => {
      const project = { billing_frequency: null, billing_day_1: 1, billing_day_2: null, billing_anchor_date: null };
      expect(getBillingPeriods(project, d("2026-07-03"))).toBeNull();
    });
  });
});
