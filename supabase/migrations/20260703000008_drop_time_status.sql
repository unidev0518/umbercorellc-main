-- Remove approval workflow from time entries
ALTER TABLE time_entries
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS reject_reason,
  DROP COLUMN IF EXISTS reviewed_at,
  DROP COLUMN IF EXISTS reviewed_by;
