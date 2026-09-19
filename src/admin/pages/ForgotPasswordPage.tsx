import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

/**
 * Forgot Password page — wired to Supabase Auth.
 *
 * When the user submits their email, Supabase sends a password-reset email
 * with a signed link that points back to /admin/reset-password (configured in
 * the Supabase dashboard under Authentication → URL Configuration, or via
 * supabase/0003_auth_email_setup.sql). The ResetPasswordPage detects the
 * recovery tokens in the URL and prompts for a new password.
 */
export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('brainchildgamesin@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!supabase) {
      setError('Authentication is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // redirectTo must be in the "Additional Redirect URLs" list in Supabase
      // Auth → URL Configuration.
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (resetError) {
        // Don't leak whether the email exists — same message either way to
        // prevent account enumeration. But surface real errors (network, etc.).
        const status = resetError.status;
        if (status === 429) {
          setError('Too many reset attempts. Please wait a minute and try again.');
        } else if (status && status >= 500) {
          // Supabase's auth service failed internally (e.g. "Unable to
          // process request" — its user lookup errored). Nothing is wrong
          // with this site; the fix is on the Supabase side.
          setError(
            'Supabase hit an internal error while sending the reset email' +
              (resetError.message ? ` (${resetError.message})` : '') +
              '. Please try again in a minute. If it keeps happening, you can reset your password directly in the Supabase dashboard: Authentication → Users → your email → “Reset password” — then log in here with the new password.'
          );
        } else {
          setError(resetError.message || 'Failed to send reset email');
        }
        return;
      }

      setSuccessMessage(
        `Check ${trimmed} for a password reset link. It may take a minute and could land in Promotions or Spam.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
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
              Reset Password
            </h1>
            <p className="mt-2 text-sm font-medium text-inksoft">
              Enter your admin email and we'll send a reset link to your inbox
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border-2 border-coral bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {successMessage ? (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-moss bg-moss/10 px-4 py-3 text-sm font-semibold text-moss">
                <CheckCircle2 size={18} />
                {successMessage}
              </div>
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-2 border-ink bg-grape px-6 py-3 text-sm font-extrabold uppercase text-white shadow-sticker"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-inksoft">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-inksoft" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-ink/15 bg-cream px-4 py-3 pl-11 text-sm font-semibold text-ink placeholder-inksoft/60 focus:border-grape focus:outline-none"
                    placeholder="brainchildgamesin@gmail.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-coral px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-sticker hover:bg-coraldeep cursor-pointer disabled:opacity-60"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link to Gmail'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-inksoft hover:text-ink"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
