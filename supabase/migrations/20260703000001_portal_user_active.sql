-- Add active/inactive flag to portal users
ALTER TABLE portal_users
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS portal_users_is_active ON portal_users(is_active);
