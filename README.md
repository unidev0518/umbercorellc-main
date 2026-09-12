# UmberCore Platform

AI security consulting platform — modular monorepo with Next.js, Supabase, and Stripe.

## Structure

```
apps/web          Next.js 15 marketing site + member/admin portals
packages/ui       Design system & components
packages/config   Tailwind preset & brand tokens
packages/database Supabase client, types, migrations
packages/leads    Lead capture service
packages/stripe   Checkout & webhooks
packages/email    Resend + React Email templates
```

## Quick start

1. Copy `.env.example` to `apps/web/.env.local` and fill in values.
2. Run Supabase migration: `packages/database/supabase/migrations/001_initial_schema.sql`
3. Create Stripe products and set price IDs in env.
4. Install and run:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

This is a monorepo with **three Next.js apps**. Create one Vercel project per app (do not deploy from the repo root).

| App | Root Directory | Filter |
|-----|----------------|--------|
| Marketing site | `apps/web` | `@umbercore/web` |
| Admin | `apps/admin` | `@umbercore/admin` |
| Client/developer portal | `apps/portal` | `@umbercore/portal` |

For each project in **Settings → General / Build & Development Settings**:

1. **Root Directory** → the app path above (e.g. `apps/web`)
2. **Framework Preset** → `Next.js` (not Other)
3. **Output Directory** → leave **empty** (do not set `public`)
4. Install / Build are already in each app’s `vercel.json`; if you override them:
   - Install: `cd ../.. && pnpm install`
   - Build: `cd ../.. && pnpm build --filter=@umbercore/<app>`

Also set:

- Package Manager: `pnpm`
- Node.js: `20.x` or newer
- Env vars from `.env.example` (per app as needed)

Stripe webhook URL: `https://your-domain.com/api/stripe/webhook`  
Calendly webhook: `https://your-domain.com/api/calendly/webhook`

## Admin access

Set a user's `profiles.role` to `admin` in Supabase after signup.
