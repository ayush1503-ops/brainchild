import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * React context that wraps the Supabase Auth client.
 *
 * Gives every component in the tree access to:
 *   - current Supabase user/session (null when signed out or not configured)
 *   - loading state (true while initial session is being resolved)
 *   - helpers: signIn, signUp, signOut, signInWithOAuth, resetPasswordForEmail
 *
 * When Supabase is not configured (missing env vars) the provider renders as a
 * safe no-op: `user`/`session` are null, helpers are no-ops that reject with a
 * descriptive error, and the rest of the app keeps working.
 */

export interface SupabaseAuthContextValue {
  /** True once we've finished reading the initial session from storage. */
  loading: boolean;
  /** Currently signed-in Supabase user, or null. */
  user: User | null;
  /** Current Supabase session (access token, refresh token, etc.), or null. */
  session: Session | null;
  /** True if VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set. */
  configured: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithOAuth: (
    provider: 'google' | 'github' | 'discord' | 'apple',
    redirectTo?: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPasswordForEmail: (email: string, redirectTo?: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

const NotConfiguredError = new Error(
  'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
);

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | null>(null);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(configured);
  const [user, setUser] = useState<User | null>(null);

  // First mount: pull initial session, then subscribe to auth state changes.
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback<SupabaseAuthContextValue['signUp']>(
    async (email, password, metadata) => {
      if (!supabase) return { data: { user: null, session: null }, error: NotConfiguredError as AuthError };
      return supabase.auth.signUp({
        email,
        password,
        options: { data: metadata, emailRedirectTo: window.location.origin },
      });
    },
    []
  );

  const signIn = useCallback<SupabaseAuthContextValue['signIn']>(
    async (email, password) => {
      if (!supabase) return { data: { user: null, session: null }, error: NotConfiguredError as AuthError };
      return supabase.auth.signInWithPassword({ email, password });
    },
    []
  );

  const signInWithOAuth = useCallback<SupabaseAuthContextValue['signInWithOAuth']>(
    async (provider, redirectTo) => {
      if (!supabase) return { error: NotConfiguredError as AuthError };
      return supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectTo ?? window.location.origin },
      });
    },
    []
  );

  const signOut = useCallback<SupabaseAuthContextValue['signOut']>(async () => {
    if (!supabase) return { error: NotConfiguredError as AuthError };
    const result = await supabase.auth.signOut();
    return result;
  }, []);

  const resetPasswordForEmail = useCallback<SupabaseAuthContextValue['resetPasswordForEmail']>(
    async (email, redirectTo) => {
      if (!supabase) return { error: NotConfiguredError as AuthError };
      return supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo ?? `${window.location.origin}/reset-password`,
      });
    },
    []
  );

  const updatePassword = useCallback<SupabaseAuthContextValue['updatePassword']>(async (newPassword) => {
    if (!supabase) return { error: NotConfiguredError as AuthError };
    return supabase.auth.updateUser({ password: newPassword });
  }, []);

  const value = useMemo<SupabaseAuthContextValue>(
    () => ({
      loading,
      user,
      session,
      configured,
      signUp,
      signIn,
      signInWithOAuth,
      signOut,
      resetPasswordForEmail,
      updatePassword,
    }),
    [loading, user, session, configured, signUp, signIn, signInWithOAuth, signOut, resetPasswordForEmail, updatePassword]
  );

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
}

/** Hook for components to read the Supabase auth context. */
export function useSupabaseAuth(): SupabaseAuthContextValue {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx) {
    throw new Error('useSupabaseAuth must be used within a <SupabaseAuthProvider>');
  }
  return ctx;
}

/** Convenience hook: returns the current access token (for attaching to API calls). */
export function useSupabaseAccessToken(): string | null {
  const { session } = useSupabaseAuth();
  return session?.access_token ?? null;
}
