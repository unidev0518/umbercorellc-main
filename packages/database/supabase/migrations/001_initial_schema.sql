-- UmberCore initial schema

CREATE TYPE user_role AS ENUM ('visitor', 'member', 'client', 'admin');
CREATE TYPE member_tier AS ENUM ('starter', 'pro', 'insider');
CREATE TYPE member_scenario AS ENUM ('freelancer', 'founder', 'employee');
CREATE TYPE sub_status AS ENUM ('active', 'past_due', 'canceled', 'paused');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'annual');
CREATE TYPE lead_stage AS ENUM (
  'new', 'contacted', 'call_booked', 'proposal_sent', 'won', 'lost'
);
CREATE TYPE service_interest AS ENUM (
  'health_check', 'policy_pack', 'advisor', 'compliance',
  'vendor_review', 'membership', 'not_sure'
);
CREATE TYPE lead_source AS ENUM (
  'linkedin', 'google', 'referral', 'blog', 'calendly', 'direct', 'other'
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'visitor',
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  job_title TEXT,
  company_name TEXT,
  scenario member_scenario,
  tier member_tier NOT NULL DEFAULT 'starter',
  billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
  stripe_customer_id TEXT,
  stripe_sub_id TEXT,
  sub_status sub_status NOT NULL DEFAULT 'active',
  sub_start_date DATE,
  sub_end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT,
  service_interest service_interest NOT NULL DEFAULT 'not_sure',
  message TEXT,
  source lead_source NOT NULL DEFAULT 'direct',
  source_detail TEXT,
  stage lead_stage NOT NULL DEFAULT 'new',
  possible_duplicate BOOLEAN NOT NULL DEFAULT FALSE,
  calendly_event_id TEXT,
  call_scheduled_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX leads_email_idx ON leads(email);
CREATE INDEX leads_stage_idx ON leads(stage);

CREATE TABLE stripe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'visitor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Members read own record"
  ON members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access members"
  ON members FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access leads"
  ON leads FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access stripe_events"
  ON stripe_events FOR ALL
  USING (auth.role() = 'service_role');
