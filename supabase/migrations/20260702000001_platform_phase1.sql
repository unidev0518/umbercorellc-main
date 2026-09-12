-- ============================================================
-- Axovernet Platform — Phase 1 Migration
-- Creates: leads, magic_links, admin_users tables
-- ============================================================

-- leads table: stores all form submissions from the marketing site
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  type          text not null check (type in ('client', 'developer', 'contact')),
  status        text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'rejected')),

  -- common fields
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  phone         text,

  -- client fields
  company_name  text,
  job_type      text,
  message       text,

  -- developer fields
  location      text,

  -- contact form fields
  service_interest text,
  availability  text,
  source        text,
  source_detail text,

  -- admin-only fields
  notes         text,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- magic_links table: time-limited registration links sent to qualified leads
create table if not exists magic_links (
  id          uuid primary key default gen_random_uuid(),
  token       text unique not null default encode(gen_random_bytes(32), 'hex'),
  lead_id     uuid references leads(id) on delete cascade,
  role        text not null check (role in ('client', 'developer')),
  email       text not null,
  used        boolean not null default false,
  expires_at  timestamptz not null default now() + interval '48 hours',
  created_at  timestamptz not null default now()
);

-- admin_users table: tracks admin team members and their roles
create table if not exists admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text,
  role        text not null default 'staff' check (role in ('super_admin', 'staff')),
  created_at  timestamptz not null default now()
);

-- indexes for common queries
create index if not exists leads_type_idx       on leads(type);
create index if not exists leads_status_idx     on leads(status);
create index if not exists leads_email_idx      on leads(email);
create index if not exists leads_created_at_idx on leads(created_at desc);
create index if not exists magic_links_token_idx on magic_links(token);
create index if not exists magic_links_email_idx on magic_links(email);

-- auto-update updated_at on leads
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

-- Row Level Security
alter table leads       enable row level security;
alter table magic_links enable row level security;
alter table admin_users enable row level security;

-- Only service_role (server) can access all tables
-- Admin portal uses service_role key — no RLS policies needed for server access
-- This blocks all direct client-side access to sensitive data
create policy "service role only" on leads
  for all using (false);

create policy "service role only" on magic_links
  for all using (false);

create policy "service role only" on admin_users
  for all using (false);
