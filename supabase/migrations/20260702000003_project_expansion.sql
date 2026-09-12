-- Phase 7: Project information expansion

ALTER TABLE projects
  ADD COLUMN engagement_type      text CHECK (engagement_type IN ('staffing','project','retainer')),
  ADD COLUMN phase                text NOT NULL DEFAULT 'discovery'
                                  CHECK (phase IN ('discovery','planning','active','review','delivered','maintenance')),
  ADD COLUMN priority             text NOT NULL DEFAULT 'medium'
                                  CHECK (priority IN ('high','medium','low')),
  ADD COLUMN billing_model        text CHECK (billing_model IN ('hourly','fixed','monthly_retainer')),
  ADD COLUMN contract_value       numeric(12,2),
  ADD COLUMN client_contact_name  text,
  ADD COLUMN client_contact_email text,
  ADD COLUMN client_contact_phone text,
  ADD COLUMN account_manager_id   uuid REFERENCES admin_users(id) ON DELETE SET NULL;

ALTER TABLE project_members
  ADD COLUMN hourly_rate      numeric(8,2),
  ADD COLUMN hours_allocated  integer;

CREATE INDEX ON projects(priority);
CREATE INDEX ON projects(phase);
CREATE INDEX ON projects(engagement_type);
