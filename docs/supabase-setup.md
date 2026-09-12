# Supabase Setup Guide

## Step 1 — Create account

1. Go to https://supabase.com
2. Click **Start your project**
3. Sign up with GitHub or Google (recommended — faster)

---

## Step 2 — Create project

1. Click **New project**
2. Fill in:
   - **Name:** `umbercore`
   - **Database password:** generate a strong one and save it somewhere safe
   - **Region:** pick the closest to your users (e.g. `US East` for North America)
3. Click **Create new project**
4. Wait ~2 minutes for provisioning

---

## Step 3 — Get your API keys

1. Go to **Project Settings** → **API**
2. Copy these two values — you'll need them shortly:
   - `Project URL` (looks like `https://xxxx.supabase.co`)
   - `anon / public` key (long string starting with `eyJ...`)
   - `service_role` key (keep this secret — never expose in frontend)

---

## Step 4 — Add env vars to Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service_role key |

---

## Step 5 — Add env vars locally

Create or update `.env.local` in `apps/portal` (do not commit this file):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## Step 6 — Create the first super_admin

After the project is live, come back here — I'll walk you through seeding the first admin account directly in the Supabase dashboard. No signup form needed.

---

## Done — share with me:
- Your `Project URL`
- Confirm env vars are added to Vercel

Then I start building Phase 1.
