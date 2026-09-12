export interface BillingProject {
  billing_frequency: string | null;
  billing_day_1: number | null;
  billing_day_2: number | null;
  billing_anchor_date: string | null;
}

export interface BillingPeriod {
  periodStart: string;
  periodEnd: string;
}

const fmt = (d: Date) => d.toISOString().slice(0, 10);

export function getBillingPeriods(project: BillingProject, today: Date): BillingPeriod | null {
  const y = today.getUTCFullYear();
  const m = today.getUTCMonth(); // 0-indexed
  const dayOfMonth = today.getUTCDate();

  if (project.billing_frequency === "monthly") {
    const day = project.billing_day_1;
    if (!day) return null;
    if (dayOfMonth !== day) return null;
    const periodEnd = new Date(Date.UTC(y, m, day));
    const periodStart = new Date(Date.UTC(y, m - 1, day + 1));
    return { periodStart: fmt(periodStart), periodEnd: fmt(periodEnd) };
  }

  if (project.billing_frequency === "semi_monthly") {
    const day1 = project.billing_day_1;
    const day2 = project.billing_day_2;
    if (!day1 || !day2) return null;

    if (dayOfMonth === day1) {
      const periodStart = new Date(Date.UTC(y, m - 1, day2 + 1));
      const periodEnd = new Date(Date.UTC(y, m, day1));
      return { periodStart: fmt(periodStart), periodEnd: fmt(periodEnd) };
    }
    if (dayOfMonth === day2) {
      const periodStart = new Date(Date.UTC(y, m, day1 + 1));
      const periodEnd = new Date(Date.UTC(y, m, day2));
      return { periodStart: fmt(periodStart), periodEnd: fmt(periodEnd) };
    }
    return null;
  }

  if (project.billing_frequency === "bi_weekly") {
    const anchor = project.billing_anchor_date ? new Date(project.billing_anchor_date) : null;
    if (!anchor || isNaN(anchor.getTime())) return null;
    const diffMs = today.getTime() - anchor.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const periodsSinceAnchor = Math.floor(diffDays / 14);
    const periodEnd = new Date(anchor.getTime() + periodsSinceAnchor * 14 * 86400000);
    if (fmt(periodEnd) !== fmt(today)) return null;
    const periodStart = new Date(periodEnd.getTime() - 13 * 86400000);
    return { periodStart: fmt(periodStart), periodEnd: fmt(periodEnd) };
  }

  return null;
}
