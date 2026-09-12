-- Add single developer fields to projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS developer_id uuid REFERENCES portal_users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS developer_hourly_rate numeric(10,2),
  ADD COLUMN IF NOT EXISTS developer_hours_allocated integer;

-- Migrate existing project_members data (take first member per project)
UPDATE projects p
SET
  developer_id = pm.developer_id,
  developer_hourly_rate = pm.hourly_rate,
  developer_hours_allocated = pm.hours_allocated
FROM (
  SELECT DISTINCT ON (project_id) project_id, developer_id, hourly_rate, hours_allocated
  FROM project_members
  ORDER BY project_id, created_at ASC
) pm
WHERE p.id = pm.project_id;

-- Drop old columns no longer used
ALTER TABLE projects
  DROP COLUMN IF EXISTS priority,
  DROP COLUMN IF EXISTS engagement_type,
  DROP COLUMN IF EXISTS phase,
  DROP COLUMN IF EXISTS client_contact_name,
  DROP COLUMN IF EXISTS client_contact_email,
  DROP COLUMN IF EXISTS client_contact_phone;
