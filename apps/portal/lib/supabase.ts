import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const browserClient = () => createClient(url, anon);

export const adminClient = () =>
  createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
