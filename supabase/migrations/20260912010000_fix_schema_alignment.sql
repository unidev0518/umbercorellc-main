-- Align app code with live schema: permissions, assignment sync, payroll settlements

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS permissions text[] NOT NULL DEFAULT '{}';

INSERT INTO project_members (project_id, developer_id, hourly_rate, hours_allocated)
SELECT p.id, p.developer_id, p.developer_hourly_rate, p.developer_hours_allocated
FROM projects p
WHERE p.developer_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.project_id = p.id AND pm.developer_id = p.developer_id
  );

CREATE TABLE IF NOT EXISTS payroll_settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  hours numeric(10,2) NOT NULL,
  amount numeric(12,2) NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payroll_settlements_developer_idx
  ON payroll_settlements(developer_id, period_end DESC);

ALTER TABLE payroll_settlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_payroll_settlements" ON payroll_settlements;
CREATE POLICY "service_role_payroll_settlements" ON payroll_settlements
  USING (false) WITH CHECK (false);
