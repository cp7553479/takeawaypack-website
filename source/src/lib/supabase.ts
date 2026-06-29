import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is OPTIONAL at runtime.
 *
 * - In production we use a server-side Route Handler (/api/inquiry) that
 *   inserts inquiry rows with the service role key.
 * - If the env vars are absent, the inquiry endpoint transparently falls back
 *   to "demo mode" (validate + echo) so local development never breaks.
 *
 * Keys:
 *   NEXT_PUBLIC_SUPABASE_URL       — project URL, safe to expose
 *   SUPABASE_SERVICE_ROLE_KEY      — server-only secret (preferred for inserts)
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  — public anon key (fallback if no service key)
 */

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  // Prefer the secret service role key on the server; fall back to anon key so a
  // minimal setup (URL + anon key + permissive RLS) still works.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const key = serviceKey || anonKey;
  const usingServiceRole = Boolean(serviceKey);
  return { url, key, configured: Boolean(url && key), usingServiceRole };
}

/**
 * Build a server Supabase client, or return null when not configured.
 * Never call this from a Client Component.
 */
export function getSupabaseServer(): SupabaseClient | null {
  const { url, key, configured } = getSupabaseEnv();
  if (!configured || !url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv().configured;
}
