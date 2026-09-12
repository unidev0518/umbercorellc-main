-- Projects
CREATE TABLE projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  client_id   uuid REFERENCES portal_users(id) ON DELETE SET NULL,
  status      text NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  description text,
  start_date  date,
  end_date    date,
  notes       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Developers assigned to projects
CREATE TABLE project_members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  developer_id uuid NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  role_label   text,
  start_date   date,
  end_date     date,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (project_id, developer_id)
);

-- Indexes
CREATE INDEX ON projects(client_id);
CREATE INDEX ON projects(status);
CREATE INDEX ON project_members(project_id);
CREATE INDEX ON project_members(developer_id);

-- Updated_at trigger
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only" ON projects USING (false) WITH CHECK (false);
CREATE POLICY "service role only" ON project_members USING (false) WITH CHECK (false);

-- Admin users table (already exists but add it here for completeness if missing)
-- portal_users already created in previous migration
