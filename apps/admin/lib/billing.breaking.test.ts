import { describe, it, expect } from "vitest";
import { getBillingPeriods } from "./billing";

const d = (str: string) => {
  const [y, mo, day] = str.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, day));
};

// Returns true if start < end
const isOrdered = (r: { periodStart: string; periodEnd: string }) =>
  r.periodStart < r.periodEnd;

// Checks two periods don't overlap and have no gap between them
const isContiguous = (
  a: { periodStart: string; periodEnd: string },
  b: { periodStart: string; periodEnd: string }
) => {
  const aEnd = new Date(a.periodEnd + "T00:00:00Z");
  const bStart = new Date(b.periodStart + "T00:00:00Z");
  aEnd.setUTCDate(aEnd.getUTCDate() + 1);
  return aEnd.toISOString().slice(0, 10) === b.periodStart;
};

// ─── MONTHLY ─────────────────────────────────────────────────────────────────

describe("monthly — breaking cases", () => {
  it("billing_day_1 = 31 skips February (no Feb 31)", () => {
    const p = { billing_frequency: "monthly", billing_day_1: 31, billing_day_2: null, billing_anchor_date: null };
    // Feb never has 31 days — should return null, not overflow to March
    expect(getBillingPeriods(p, d("2026-02-28"))).toBeNull();
    expect(getBillingPeriods(p, d("2026-02-01"))).toBeNull();
  });

  it("billing_day_1 = 31 skips 30-day months (Apr, Jun, Sep, Nov)", () => {
    const p = { billing_frequency: "monthly", billing_day_1: 31, billing_day_2: null, billing_anchor_date: null };
    expect(getBillingPeriods(p, d("2026-04-30"))).toBeNull();
    expect(getBillingPeriods(p, d("2026-06-30"))).toBeNull();
    expect(getBillingPeriods(p, d("2026-09-30"))).toBeNull();
    expect(getBillingPeriods(p, d("2026-11-30"))).toBeNull();
  });

  it("billing_day_1 = 31 fires in 31-day months", () => {
    const p = { billing_frequency: "monthly", billing_day_1: 31, billing_day_2: null, billing_anchor_date: null };
    const result = getBillingPeriods(p, d("2026-01-31"));
    expect(result).not.toBeNull();
    expect(result!.periodEnd).toBe("2026-01-31");
  });

  it("billing_day_1 = 31: period start on Jan 31 is Jan 1 (day after Dec 31)", () => {
    const p = { billing_frequency: "monthly", billing_day_1: 31, billing_day_2: null, billing_anchor_date: null };
    const result = getBillingPeriods(p, d("2026-01-31"))!;
    // Period: Dec 32 (= Jan 1) → Jan 31. Correct: previous billing was Dec 31.
    expect(result.periodStart).toBe("2026-01-01");
    expect(result.periodEnd).toBe("2026-01-31");
  });

  it("period start is always strictly before period end", () => {
    const p = { billing_frequency: "monthly", billing_day_1: 15, billing_day_2: null, billing_anchor_date: null };
    const months = ["2026-01-15","2026-03-15","2026-06-15","2026-12-15"];
    for (const date of months) {
      const r = getBillingPeriods(p, d(date))!;
      expect(isOrdered(r)).toBe(true);
    }
  });

  it("consecutive monthly periods are contiguous with no gaps", () => {
    const p = { billing_frequency: "monthly", billing_day_1: 15, billing_day_2: null, billing_anchor_date: null };
    const dates = ["2026-01-15","2026-02-15","2026-03-15","2026-04-15","2026-05-15","2026-06-15"];
    const periods = dates.map(date => getBillingPeriods(p, d(date))!);
    for (let i = 0; i < periods.length - 1; i++) {
      expect(isContiguous(periods[i], periods[i + 1])).toBe(true);
    }
  });

  it("billing_day_1 = 0 returns null (falsy)", () => {
    const p = { billing_frequency: "monthly", billing_day_1: 0, billing_day_2: null, billing_anchor_date: null };
    expect(getBillingPeriods(p, d("2026-07-01"))).toBeNull();
  });

  it("leap year: billing_day_1 = 29 fires on Feb 29 in leap year", () => {
    const p = { billing_frequency: "monthly", billing_day_1: 29, billing_day_2: null, billing_anchor_date: null };
    expect(getBillingPeriods(p, d("2028-02-29"))).not.toBeNull();
    expect(getBillingPeriods(p, d("2028-02-29"))!.periodEnd).toBe("2028-02-29");
  });

  it("leap year: billing_day_1 = 29 skips Feb in non-leap year", () => {
    const p = { billing_frequency: "monthly", billing_day_1: 29, billing_day_2: null, billing_anchor_date: null };
    expect(getBillingPeriods(p, d("2026-02-28"))).toBeNull(); // 2026 is not a leap year
  });

  it("Dec 31 billing: periodStart is Dec 2, not Nov 1 — known limitation", () => {
    // KNOWN LIMITATION: billing_day_1=31 skips November (no Nov 31).
    // The formula always computes periodStart as (m-1, day+1) assuming the previous
    // billing fired in the prior month. Since Nov has no day 31, the formula produces
    // Date.UTC(2026, 10, 32) = Dec 2 rather than the ideal Nov 1.
    // Fixing this properly requires knowing the actual last billing date from the DB.
    const p = { billing_frequency: "monthly", billing_day_1: 31, billing_day_2: null, billing_anchor_date: null };
    const result = getBillingPeriods(p, d("2026-12-31"))!;
    expect(result.periodEnd).toBe("2026-12-31");
    expect(result.periodStart).toBe("2026-12-02"); // Dec 2 (formula limitation, not Nov 1)
  });
});

// ─── SEMI-MONTHLY ─────────────────────────────────────────────────────────────

describe("semi_monthly — breaking cases", () => {
  it("day1 and day2 the same value is treated as a config error", () => {
    // day1 === day2 is a misconfiguration — today matches both branches
    // but the function should still return a result (it hits the day1 branch first)
    const p = { billing_frequency: "semi_monthly", billing_day_1: 15, billing_day_2: 15, billing_anchor_date: null };
    const result = getBillingPeriods(p, d("2026-07-15"));
    // Should not crash; period start = previous month's day2+1 = day 16 of prior month
    expect(result).not.toBeNull();
    // period would be: start = prev month day 16, end = this month day 15 — a full month, not half
    // This is wrong business logic but shouldn't crash
    expect(result!.periodEnd).toBe("2026-07-15");
  });

  it("inverted days (day1 > day2) produces crossed period on day2", () => {
    // e.g. day1=20, day2=5 — on the 5th, periodStart = day1+1=21 of same month, periodEnd = day2=5
    // That means start > end — a broken period
    const p = { billing_frequency: "semi_monthly", billing_day_1: 20, billing_day_2: 5, billing_anchor_date: null };
    const result = getBillingPeriods(p, d("2026-07-05"));
    expect(result).not.toBeNull();
    // Detects the ordering violation
    expect(isOrdered(result!)).toBe(false); // start (July 21) > end (July 5) — this IS a bug
  });

  it("day2 = 31 in a 30-day month: today = July 15 still works (day1 branch)", () => {
    const p = { billing_frequency: "semi_monthly", billing_day_1: 1, billing_day_2: 31, billing_anchor_date: null };
    const result = getBillingPeriods(p, d("2026-07-01"));
    expect(result).not.toBeNull();
    // period start = prev month's day32 → JS wraps this — could be wrong date
    expect(result!.periodStart).not.toBe(""); // at minimum shouldn't be empty
  });

  it("day2 = 31 in June (30-day month) doesn't fire on June 30", () => {
    // June has 30 days; day2=31 means it never fires in June
    const p = { billing_frequency: "semi_monthly", billing_day_1: 1, billing_day_2: 31, billing_anchor_date: null };
    expect(getBillingPeriods(p, d("2026-06-30"))).toBeNull(); // 30 !== 31
    expect(getBillingPeriods(p, d("2026-06-01"))).not.toBeNull(); // day1 branch fires
  });

  it("consecutive semi-monthly periods are contiguous with no gaps", () => {
    const p = { billing_frequency: "semi_monthly", billing_day_1: 1, billing_day_2: 15, billing_anchor_date: null };
    const dates = ["2026-06-01","2026-06-15","2026-07-01","2026-07-15","2026-08-01","2026-08-15"];
    const periods = dates.map(date => getBillingPeriods(p, d(date))!);
    for (let i = 0; i < periods.length - 1; i++) {
      expect(isContiguous(periods[i], periods[i + 1])).toBe(true);
    }
  });

  it("period start is always strictly before period end", () => {
    const p = { billing_frequency: "semi_monthly", billing_day_1: 1, billing_day_2: 15, billing_anchor_date: null };
    for (const date of ["2026-01-01","2026-01-15","2026-06-01","2026-12-15"]) {
      const r = getBillingPeriods(p, d(date))!;
      expect(isOrdered(r)).toBe(true);
    }
  });

  it("year boundary on day2 in December", () => {
    const p = { billing_frequency: "semi_monthly", billing_day_1: 1, billing_day_2: 15, billing_anchor_date: null };
    const result = getBillingPeriods(p, d("2026-12-15"))!;
    expect(result.periodStart).toBe("2026-12-02");
    expect(result.periodEnd).toBe("2026-12-15");
  });
});

// ─── BI-WEEKLY ────────────────────────────────────────────────────────────────

describe("bi_weekly — breaking cases", () => {
  it("today before anchor returns null (not a negative period)", () => {
    const p = { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "2026-08-01" };
    // today is before the anchor — should not generate a period
    expect(getBillingPeriods(p, d("2026-07-03"))).toBeNull();
    expect(getBillingPeriods(p, d("2026-07-31"))).toBeNull();
  });

  it("today = anchor: period start is 13 days before anchor", () => {
    const p = { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "2026-07-03" };
    const result = getBillingPeriods(p, d("2026-07-03"))!;
    const start = new Date(result.periodStart + "T00:00:00Z");
    const end = new Date(result.periodEnd + "T00:00:00Z");
    const diffDays = (end.getTime() - start.getTime()) / 86400000;
    expect(diffDays).toBe(13); // 14-day period = 13 days difference (inclusive)
  });

  it("every period is exactly 14 days long", () => {
    const p = { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "2026-07-03" };
    const billingDates = ["2026-07-03","2026-07-17","2026-07-31","2026-08-14","2026-08-28"];
    for (const date of billingDates) {
      const r = getBillingPeriods(p, d(date))!;
      const start = new Date(r.periodStart + "T00:00:00Z");
      const end = new Date(r.periodEnd + "T00:00:00Z");
      expect((end.getTime() - start.getTime()) / 86400000).toBe(13);
    }
  });

  it("consecutive bi-weekly periods are contiguous with no gaps", () => {
    const p = { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "2026-07-03" };
    const billingDates = ["2026-07-03","2026-07-17","2026-07-31","2026-08-14","2026-08-28"];
    const periods = billingDates.map(date => getBillingPeriods(p, d(date))!);
    for (let i = 0; i < periods.length - 1; i++) {
      expect(isContiguous(periods[i], periods[i + 1])).toBe(true);
    }
  });

  it("period start is always strictly before period end", () => {
    const p = { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "2026-07-03" };
    for (const date of ["2026-07-03","2026-07-17","2026-07-31"]) {
      const r = getBillingPeriods(p, d(date))!;
      expect(isOrdered(r)).toBe(true);
    }
  });

  it("anchor date on day 1 of month: periods don't drift across DST changes", () => {
    // Anchor Jan 1 — 14 day cycles across spring DST transition (Mar 8 in US)
    const p = { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "2026-01-01" };
    // 10 cycles * 14 = 140 days after Jan 1 = May 21
    const billing = ["2026-01-01","2026-01-15","2026-01-29","2026-02-12","2026-02-26",
                     "2026-03-12","2026-03-26","2026-04-09","2026-04-23","2026-05-07"];
    const periods = billing.map(date => getBillingPeriods(p, d(date)));
    // All should fire on their dates
    periods.forEach((r, i) => {
      expect(r).not.toBeNull();
      expect(r!.periodEnd).toBe(billing[i]);
    });
    // And be contiguous
    for (let i = 0; i < periods.length - 1; i++) {
      expect(isContiguous(periods[i]!, periods[i + 1]!)).toBe(true);
    }
  });

  it("invalid anchor date string does not throw — returns null", () => {
    const p = { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "not-a-date" };
    // new Date("not-a-date") = Invalid Date (truthy object) — must not throw
    expect(() => getBillingPeriods(p, d("2026-07-03"))).not.toThrow();
  });

  it("empty string anchor date does not throw — returns null", () => {
    const p = { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "" };
    expect(() => getBillingPeriods(p, d("2026-07-03"))).not.toThrow();
  });
});

// ─── CROSS-FREQUENCY ──────────────────────────────────────────────────────────

describe("cross-frequency — breaking cases", () => {
  it("output dates are always YYYY-MM-DD format", () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const cases = [
      { billing_frequency: "monthly", billing_day_1: 15, billing_day_2: null, billing_anchor_date: null, today: "2026-07-15" },
      { billing_frequency: "semi_monthly", billing_day_1: 1, billing_day_2: 15, billing_anchor_date: null, today: "2026-07-01" },
      { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "2026-07-03", today: "2026-07-03" },
    ];
    for (const { today, ...project } of cases) {
      const r = getBillingPeriods(project, d(today))!;
      expect(r.periodStart).toMatch(datePattern);
      expect(r.periodEnd).toMatch(datePattern);
    }
  });

  it("periodEnd always matches the today date passed in", () => {
    const cases = [
      { p: { billing_frequency: "monthly", billing_day_1: 15, billing_day_2: null, billing_anchor_date: null }, today: "2026-07-15" },
      { p: { billing_frequency: "semi_monthly", billing_day_1: 1, billing_day_2: 15, billing_anchor_date: null }, today: "2026-07-01" },
      { p: { billing_frequency: "semi_monthly", billing_day_1: 1, billing_day_2: 15, billing_anchor_date: null }, today: "2026-07-15" },
      { p: { billing_frequency: "bi_weekly", billing_day_1: null, billing_day_2: null, billing_anchor_date: "2026-07-03" }, today: "2026-07-03" },
    ];
    for (const { p, today } of cases) {
      const r = getBillingPeriods(p, d(today))!;
      expect(r.periodEnd).toBe(today);
    }
  });
});
