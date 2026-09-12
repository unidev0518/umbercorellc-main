-- Replace single billing_cycle_day with full frequency support
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS billing_frequency text CHECK (billing_frequency IN ('monthly', 'semi_monthly', 'bi_weekly')),
  ADD COLUMN IF NOT EXISTS billing_day_1 integer CHECK (billing_day_1 BETWEEN 1 AND 28),
  ADD COLUMN IF NOT EXISTS billing_day_2 integer CHECK (billing_day_2 BETWEEN 1 AND 28),
  ADD COLUMN IF NOT EXISTS billing_anchor_date date;

-- Migrate existing billing_cycle_day to new fields
UPDATE projects
SET billing_frequency = 'monthly', billing_day_1 = billing_cycle_day
WHERE billing_cycle_day IS NOT NULL;

ALTER TABLE projects
  DROP COLUMN IF EXISTS billing_cycle_day,
  DROP COLUMN IF EXISTS generate_days_before;

-- Add period tracking and paid_at to invoices
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS period_start date,
  ADD COLUMN IF NOT EXISTS period_end date,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;
