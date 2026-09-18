import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client (browser-side, publishable/anon key only).
 *
 * Configuration is read from Vite environment variables:
 *   VITE_SUPABASE_URL      – the project URL, e.g. https://h6m5jo2yd75st3tw.supabase.co
 *   VITE_SUPABASE_ANON_KEY – the publishable/anon key (safe to expose)
 *
 * Both are validated at import time so misconfiguration is loud, not silent.
 */

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

if (!url) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] VITE_SUPABASE_URL is not set. Supabase features (auth, player data, wishlist) will be disabled.'
  );
}
if (!anonKey) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] VITE_SUPABASE_ANON_KEY is not set. Supabase features will be disabled.');
}

/**
 * Singleton client. When credentials are missing we export `null` so UI code
 * can gracefully fall back rather than crashing the bundle.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          // Use local storage by default for SPA sessions.
          storageKey: 'brainchild-supabase-auth-token',
        },
        realtime: {
          params: { eventsPerSecond: 10 },
        },
      })
    : null;

/** Type guard: returns true if Supabase is configured and safe to call. */
export const isSupabaseConfigured = (): boolean => supabase !== null;

export default supabase;
