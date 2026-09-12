CREATE TABLE time_entries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  developer_id uuid NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  date         date NOT NULL,
  hours        numeric(4,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  description  text,
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','approved','rejected')),
  reject_reason text,
  reviewed_by  uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  reviewed_at  timestamptz,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX ON time_entries(project_id);
CREATE INDEX ON time_entries(developer_id);
CREATE INDEX ON time_entries(status);
CREATE INDEX ON time_entries(date);

ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON time_entries USING (false) WITH CHECK (false);
