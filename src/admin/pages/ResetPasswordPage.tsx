import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

/**
 * Reset Password page — handles two flows:
 *
 *   1. Supabase recovery link flow (email link). When a user clicks the
 *      "Reset your password" link in the email from Gmail, Supabase appends
 *      ?access_token=...&refresh_token=...&expires_in=...&token_type=bearer&type=recovery
 *      to the URL. We detect this on mount and exchange the tokens for a
 *      session (supabase.auth.initialize does this automatically when
 *      detectSessionInUrl is true), then show the new-password form.
 *
 *   2. Old express-backend flow: ?token=XXX for a signed JWT from the local
 *      dev backend. Still supported so the existing backend keeps working if
 *      you use it in parallel.
 */
export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Legacy Express token (when coming from the old email link).
  const legacyToken = searchParams.get('token') || '';
  // Supabase recovery flow is detected automatically by the Supabase client
  // (detectSessionInUrl: true). After the client boots, a recovery session
  // exists if the URL had a valid access_token with type=recovery.

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // For Supabase flow, we must verify that a recovery session is present
  // before allowing the user to set a new password.
  const [supabaseReady, setSupabaseReady] = useState<boolean>(!!legacyToken);
  const [supabaseChecking, setSupabaseChecking] = useState<boolean>(!legacyToken && !!supabase);

  useEffect(() => {
    if (!supabase) {
      setSupabaseReady(!!legacyToken);
      setSupabaseChecking(false);
      return;
    }

    // If there's no recovery-looking URL, nothing to initialize.
    const hasRecoveryHash =
      searchParams.get('type') === 'recovery' ||
      searchParams.has('access_token') ||
      window.location.hash.includes('access_token');

    if (!hasRecoveryHash) {
      setSupabaseReady(!!legacyToken);
      setSupabaseChecking(false);
      return;
    }

    // Give the Supabase client one tick to initialize the session from the
    // URL fragment (it reads #access_token=... automatically on startup in
    // our supabase.ts client).
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          const isRecovery =
            data.session?.user !== null &&
            // Supabase sets amr/recovery when the session came from a recovery link
            (searchParams.get('type') === 'recovery' ||
              window.location.hash.includes('type=recovery'));
          setSupabaseReady(isRecovery || !!legacyToken);
          if (!isRecovery && !legacyToken) {
            setError('This reset link is invalid or has expired. Please request a new one.');
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError('Unable to verify reset link. Please request a new one.');
        }
      } finally {
        if (!cancelled) setSupabaseChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [legacyToken, searchParams, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (supabase && supabaseReady && !legacyToken) {
        // Supabase recovery flow — updates the current user's password using
        // the recovery session already established from the email link.
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (updateError) throw updateError;
        // Sign out the recovery session so the user logs in fresh.
        await supabase.auth.signOut();
      } else if (legacyToken) {
        // Legacy Express backend flow — POST to the REST API.
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ token: legacyToken, password: newPassword }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || data.error || 'Failed to reset password');
        }
      } else {
        throw new Error('No active reset session. Please request a new reset link.');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <img src="/src/assets/images/mascot_pix.png" alt="Pix" className="h-24 w-24 object-cover rounded-2xl border-2 border-ink shadow-lift" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 rounded-[28px] border-2 border-ink bg-cream p-8 shadow-lift"
        >
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
              Create New Password
            </h1>
            <p className="mt-2 text-sm font-medium text-inksoft">
              Set a secure password for your admin account
            </p>
          </div>

          {supabaseChecking ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm font-semibold text-inksoft">
              <Loader2 className="animate-spin" size={18} /> Verifying reset link…
            </div>
          ) : error ? (
            <div className="mb-4 flex items-center gap-2 rounded-xl border-2 border-coral bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
              <AlertCircle size={16} />
              {error}
            </div>
          ) : null}

          {isSuccess ? (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-moss bg-moss/10 px-4 py-3 text-sm font-semibold text-moss">
                <CheckCircle2 size={18} />
                Password reset successful!
              </div>
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full rounded-xl border-2 border-ink bg-coral px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-sticker hover:bg-coraldeep cursor-pointer"
              >
                Go to Sign In
              </button>
            </div>
          ) : supabaseReady || legacyToken ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-inksoft">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-inksoft" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-ink/15 bg-cream px-4 py-3 pl-11 pr-11 text-sm font-semibold text-ink placeholder-inksoft/60 focus:border-grape focus:outline-none"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-inksoft hover:text-ink cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-inksoft">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-inksoft" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-ink/15 bg-cream px-4 py-3 pl-11 text-sm font-semibold text-ink placeholder-inksoft/60 focus:border-grape focus:outline-none"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-coral px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-sticker hover:bg-coraldeep cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Resetting…
                  </>
                ) : (
                  'Set New Password'
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/admin/login"
                  className="text-xs font-bold uppercase tracking-wider text-inksoft hover:text-ink"
                >
                  Cancel &amp; Return to Login
                </Link>
              </div>
            </form>
          ) : (
            !error && (
              <div className="text-center pt-2">
                <Link
                  to="/admin/forgot-password"
                  className="text-xs font-bold uppercase tracking-wider text-inksoft hover:text-ink"
                >
                  Request a new reset link
                </Link>
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};
