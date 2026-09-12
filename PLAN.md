# UmberCore Platform — Implementation Plan

> Last updated: 2026-07-02
> Stack: Turborepo · Next.js 15 · Supabase · Tailwind CSS
> Apps: `apps/web` (marketing) · `apps/admin` (port 3001) · `apps/portal` (port 3002)

---

## Current State

### ✅ Completed
- Admin portal: login, leads list + detail, magic link generation, projects CRUD, project detail, clients, developers, admin users
- Portal: magic link registration, login, dashboard, client projects, developer assignments
- Permission system: 4 toggles per staff member (leads / projects / clients / developers)
- Toast notifications: lead detail, project detail, admin users
- Empty states: all admin list pages
- Design system: dark theme tokens, consistent across both apps

### ❌ Not Started
- Project info expansion (fields missing for real agency use)
- Time tracking
- Payment / invoice status
- Developer profile editing
- Admin dashboard with stats
- Portal: profile page for clients and developers
- Portal: time entry for developers
- Email notifications

---

## Phase 7 — Project Information Expansion

### 7A — SQL Migration
Run in Supabase SQL Editor:

```sql
-- Projects: add agency-standard fields
ALTER TABLE projects
  ADD COLUMN engagement_type  text CHECK (engagement_type IN ('staffing','project','retainer')),
  ADD COLUMN phase            text NOT NULL DEFAULT 'discovery'
                              CHECK (phase IN ('discovery','planning','active','review','delivered','maintenance')),
  ADD COLUMN priority         text NOT NULL DEFAULT 'medium'
                              CHECK (priority IN ('high','medium','low')),
  ADD COLUMN billing_model    text CHECK (billing_model IN ('hourly','fixed','monthly_retainer')),
  ADD COLUMN contract_value   numeric(12,2),
  ADD COLUMN client_contact_name  text,
  ADD COLUMN client_contact_email text,
  ADD COLUMN client_contact_phone text;

-- Project members: add rate and hours
ALTER TABLE project_members
  ADD COLUMN hourly_rate      numeric(8,2),
  ADD COLUMN hours_allocated  integer;
```

### 7B — API: projects route
- `GET /api/projects` — include all new fields
- `POST /api/projects` — accept all new fields
- `PATCH /api/projects` — already generic, no change needed

### 7C — API: project-members route
- `POST /api/project-members` — accept `hourly_rate`, `hours_allocated`
- `PATCH /api/project-members` — new endpoint: update rate/hours for a member

### 7D — Admin: New Project Form
Reorganise into 3 labelled sections:

**Basics**
- Project name (required)
- Client (dropdown)
- Description
- Priority — radio: High · Medium · Low

**Engagement**
- Engagement type — Staffing / Project-based / Retainer
- Billing model — Hourly / Fixed / Monthly retainer
- Contract value — USD input
- Phase — starts at Discovery, dropdown

**Timeline & Contact**
- Start date / End date (side by side)
- Client contact name
- Client contact email
- Client contact phone (optional)

### 7E — Admin: Projects List Page
Add columns: Priority badge · Phase · Engagement type
Add filter bar: Status · Engagement type · Priority

Priority badge colours:
- High → red dot
- Medium → yellow dot
- Low → green dot

Phase shown as text label.

### 7F — Admin: Project Detail Page
Redesign layout:

**Header**
Name · Client · Priority badge · Status badge · Delete button

**Top row (3 equal cards)**
1. Engagement — type, billing model, phase (clickable steps: Discovery → Planning → Active → Review → Delivered)
2. Contract — value (USD), client contact name / email / phone
3. Timeline — start date, end date

**Main area (col-span-2 + sidebar)**
- Team card — developer list with rate + hours; assign form adds rate + hours fields
- Status sidebar — existing status selector

**Bottom**
- Internal notes — existing

### 7G — Portal: Client Project Detail
Add to the client-facing project view:
- Phase progress bar (Discovery → Planning → Active → Review → Delivered) — read only
- Your UmberCore contact — show account manager name + email (sourced from admin_users via a new `account_manager_id` field on projects, optional)
- Developer cards show role + start date (no rate — internal only)

---

## Phase 8 — Time Tracking

### 8A — SQL Migration

```sql
CREATE TABLE time_entries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  developer_id uuid NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  date         date NOT NULL,
  hours        numeric(4,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  description  text,
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','approved','rejected')),
  reviewed_by  uuid REFERENCES admin_users(id),
  reviewed_at  timestamptz,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX ON time_entries(project_id);
CREATE INDEX ON time_entries(developer_id);
CREATE INDEX ON time_entries(status);
CREATE INDEX ON time_entries(date);

ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON time_entries USING (false) WITH CHECK (false);
```

### 8B — API Routes

| Route | Method | Permission | Purpose |
|-------|--------|------------|---------|
| `/api/time-entries` | GET | projects | List entries (filter by project, developer, status, date range) |
| `/api/time-entries` | POST | — (portal) | Developer submits a time entry |
| `/api/time-entries` | PATCH | projects | Admin approves or rejects an entry |
| `/api/time-entries` | DELETE | projects | Admin deletes an entry |

Portal time entry POST uses `portal_session` cookie (not admin cookie).

### 8C — Portal: Developer Time Entry

New page: `/time` in developer portal

**Nav addition:** Time (developers only)

**Page layout:**
- Week selector (current week default, navigate back/forward)
- Grid: Mon–Sun columns, row per project the developer is assigned to
- Each cell: hours input (blank = 0)
- "Submit week" button — creates time_entries rows for all filled cells
- Status indicators: pending (gray) · approved (green) · rejected (red)
- Rejected entries show admin's reason and allow resubmission

### 8D — Admin: Time Review Page

New page: `/time` in admin portal (requires `projects` permission)

**Nav addition:** Time

**Page layout:**
- Filter bar: Project · Developer · Status · Date range
- Table: Date · Developer · Project · Hours · Description · Status · Actions
- Approve / Reject buttons per row
- Bulk approve checkbox + button
- Summary row: total pending hours, total approved hours

### 8E — Admin: Project Detail — Time Summary

Add to project detail page (below team section):
- Total approved hours per developer (table)
- Total hours vs allocated hours (progress bar per developer)
- Total project hours vs budget (if contract_value + billing_model are set)

---

## Phase 9 — Payment & Invoice Tracking

> Full payment processing (Stripe) is out of scope for V1.
> Track invoice status manually — enough for early-stage operations.

### 9A — SQL Migration

```sql
CREATE TABLE invoices (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  amount         numeric(12,2) NOT NULL,
  currency       text NOT NULL DEFAULT 'USD',
  issued_date    date NOT NULL,
  due_date       date,
  paid_date      date,
  status         text NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','sent','paid','overdue','void')),
  notes          text,
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX ON invoices(project_id);
CREATE INDEX ON invoices(status);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON invoices USING (false) WITH CHECK (false);
```

### 9B — API Routes

| Route | Method | Permission | Purpose |
|-------|--------|------------|---------|
| `/api/invoices` | GET | projects | List invoices (filter by project, status) |
| `/api/invoices` | POST | projects | Create invoice |
| `/api/invoices` | PATCH | projects | Update status / mark paid |
| `/api/invoices` | DELETE | projects | Delete draft invoice |

### 9C — Admin: Project Detail — Invoices Section

Add below time summary:

- Invoice list: number · amount · issued · due · status badge
- "Add invoice" inline form: invoice number, amount, issued date, due date
- Status update: one-click Draft → Sent → Paid
- Overdue calculated automatically (due_date < today and status = sent)

### 9D — Admin: Invoices List Page (optional, Phase 9 stretch)

New page: `/invoices` (requires `projects` permission)
- All invoices across all projects
- Filter by status, project, date range
- Summary stats: total invoiced, total paid, total outstanding, overdue count

---

## Phase 10 — Profile Editing (Portal Users)

### 10A — Portal: Developer Profile Page

New page: `/profile` in developer portal

Fields editable:
- Full name
- Skills (text or tags)
- Availability (dropdown: Immediate / 2 weeks / 1 month / Flexible)
- LinkedIn URL
- GitHub URL
- Bio / About (short text)
- Timezone

### 10B — Portal: Client Profile Page

New page: `/profile` in client portal

Fields editable:
- Full name
- Job title
- Company name
- Phone
- Timezone

### 10C — API Route

`PATCH /api/portal-profile` — authenticated via `portal_session` cookie, updates the logged-in user's own `portal_users` row only.

---

## Phase 11 — Admin Dashboard

Replace the current blank `/` page (redirects to leads) with a real stats dashboard.

### 11A — Stats to show

**Pipeline**
- Total leads (new / contacted / qualified / rejected counts) — with sparkline
- Conversion rate: leads → qualified
- Magic links generated this month

**Operations**
- Active projects count
- Projects by phase (bar chart)
- Developers currently assigned vs total registered
- Clients with active projects vs total registered

**Time & Revenue** (once Phase 8 + 9 exist)
- Hours logged this month (pending + approved)
- Invoiced this month
- Outstanding balance

### 11B — Implementation

All stats fetched server-side in the dashboard page component.
No external charting library needed — use CSS-based bars and counters.

---

## Phase 12 — Email Notifications

Low priority but important for production use.

| Trigger | Recipient | Content |
|---------|-----------|---------|
| Magic link generated | Lead (client or developer) | Registration link + instructions |
| Time entry approved | Developer | "Your X hours on [project] were approved" |
| Time entry rejected | Developer | "Your X hours on [project] were rejected" + reason |
| Invoice sent | Client contact email | Invoice details |
| Invoice overdue | Admin (super_admin) | List of overdue invoices |

### Implementation
Use Resend (already likely wired in `@umbercore/leads` via LeadService).
Add `sendEmail()` helper in `packages/database` or a new `packages/email` package.
Each trigger fires from the relevant API route after the DB write succeeds.

---

## Build Order

```
Phase 7  →  Phase 8  →  Phase 9  →  Phase 10  →  Phase 11  →  Phase 12
Project      Time         Invoices    Profiles      Dashboard     Emails
info         tracking     & billing   editing       & stats       notifs
```

Phases 10 and 11 can be built in parallel with Phase 9.
Phase 12 can be built incrementally — start with magic link email (most critical).

---

## SQL Migrations Checklist

| Migration | File | Status |
|-----------|------|--------|
| Phase 1–3 (leads, magic links, portal users) | `20260702000001_*` | ✅ Done |
| Phase 4–6 (projects, project_members) | `20260702000002_*` | ✅ Done |
| Phase 7 (project info expansion) | `20260702000003_project_expansion.sql` | ⬜ |
| Phase 8 (time_entries) | `20260702000004_time_tracking.sql` | ⬜ |
| Phase 9 (invoices) | `20260702000005_invoices.sql` | ⬜ |

---

## Known Gaps (Not Planned)

| Gap | Notes |
|-----|-------|
| Social links on web (LinkedIn, X) | Still point to `#` on marketing site |
| Google Search Console | Sitemap not submitted |
| Stripe payment processing | Out of scope for V1 — use invoice tracking only |
| File uploads (contracts, SOW) | Not planned — use external drive link in notes for now |
| In-app messaging | Not planned — use client contact email |
| Mobile-responsive portal | Not tested on mobile — low priority for B2B tool |
