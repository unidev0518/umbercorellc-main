-- portal_users: clients and developers who access the portal
-- Must run BEFORE phase456 migration which references this table
CREATE TABLE IF NOT EXISTS portal_users (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text NOT NULL UNIQUE,
  full_name     text NOT NULL,
  role          text NOT NULL CHECK (role IN ('client', 'developer')),
  company_name  text,
  job_title     text,
  skills        text,
  availability  text,
  phone         text,
  location      text,
  linkedin_url  text,
  bio           text,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portal_users_role_idx ON portal_users(role);
CREATE INDEX IF NOT EXISTS portal_users_email_idx ON portal_users(email);

ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON portal_users USING (false) WITH CHECK (false);
