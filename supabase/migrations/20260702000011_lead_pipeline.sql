-- Lead pipeline: stages, activities, next action, conversion tracking

-- Link magic links to portal users created during convert
ALTER TABLE magic_links
  ADD COLUMN IF NOT EXISTS portal_user_id uuid REFERENCES portal_users(id) ON DELETE SET NULL;


ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS pipeline_stage text,
  ADD COLUMN IF NOT EXISTS next_action_date date,
  ADD COLUMN IF NOT EXISTS next_action_note text,
  ADD COLUMN IF NOT EXISTS converted_at timestamptz,
  ADD COLUMN IF NOT EXISTS converted_user_id uuid REFERENCES portal_users(id) ON DELETE SET NULL;

-- Seed pipeline_stage from existing status for current rows
UPDATE leads SET pipeline_stage = status WHERE pipeline_stage IS NULL;

-- Activity log per lead
CREATE TABLE IF NOT EXISTS lead_activities (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    uuid        NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type       text        NOT NULL DEFAULT 'note',  -- note | call | email | stage_change
  content    text        NOT NULL,
  created_by uuid        REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_activities_lead_id ON lead_activities(lead_id);

ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_lead_activities" ON lead_activities
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
