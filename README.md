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

- Root directory: `apps/web`
- Install command: `cd ../.. && pnpm install`
- Build command: `cd ../.. && pnpm build --filter=@umbercore/web`
- Add all env vars from `.env.example`
- Stripe webhook URL: `https://your-domain.com/api/stripe/webhook`
- Calendly webhook: `https://your-domain.com/api/calendly/webhook`

## Admin access

Set a user's `profiles.role` to `admin` in Supabase after signup.
