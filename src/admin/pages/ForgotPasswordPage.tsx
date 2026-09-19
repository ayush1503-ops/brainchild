import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { ApiError, authApi } from '../utils/api';

/**
 * Forgot Password — wired to the studio API (`POST /api/auth/forgot-password`).
 *
 * WHY THIS DOES NOT CALL SUPABASE:
 * `LoginPage` signs in through `authApi.login()` → `POST /api/auth/login`,
 * which checks a bcrypt hash in the `admin_users` table. Supabase's
 * `auth.resetPasswordForEmail` writes a completely different credential store
 * (`auth.users`), so a Supabase reset link would have let you set a password
 * that the login form could never check. Both endpoints now sit on the same
 * credential store, and the token this issues is consumed by
 * `ResetPasswordPage` at `/admin/reset-password?token=…`.
 *
 * The API never says whether the address exists — it returns the same message
 * for known and unknown emails so the form can't be used to enumerate studio
 * accounts. `devResetUrl` is only ever populated when `EXPOSE_RESET_LINK` is
 * enabled on a non-production server.
 */
export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [deliveryWarning, setDeliveryWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setDevResetUrl(null);
    setDeliveryWarning(null);

    try {
      const result = await authApi.forgotPassword(trimmed);

      setSuccessMessage(
        result.message ||
          `If ${trimmed} belongs to a studio account, a reset link is on its way. It may take a minute and could land in Promotions or Spam.`
      );
      setDevResetUrl(result.devResetUrl ?? null);

      // The server can't tell us the email failed for *this* address without
      // leaking account existence — but it can tell us it is not sending any
      // mail at all, which is a deployment problem the operator must fix.
      if (result.emailDeliveryEnabled === false) {
        setDeliveryWarning(
          `This deployment cannot send email (${result.emailDeliveryReason ?? 'mail transport not configured'}). ` +
            'Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD and MAIL_FROM, or reset the password on the ' +
            'server with `npm run admin:set-password --prefix server`.'
        );
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429) {
          setError('Too many reset attempts. Please wait a minute and try again.');
        } else if (err.status === 400 && err.fields.length > 0) {
          setError(err.fields.map((field) => field.message).join(' '));
        } else if (err.status === 0) {
          setError('Cannot reach the studio server. Check your connection and try again.');
        } else {
          setError(err.message || 'Failed to send the reset link. Please try again.');
        }
      } else {
        setError('Failed to send the reset link. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <img src="/images/mascot_pix.png" alt="Pix" className="h-24 w-24 object-cover rounded-2xl border-2 border-ink shadow-lift" />
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
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-xl border-2 border-coral bg-coral/10 px-4 py-3 text-sm font-semibold text-coral"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {successMessage ? (
            <div className="space-y-4 text-center">
              <div className="flex items-start justify-center gap-2 rounded-xl border-2 border-moss bg-moss/10 px-4 py-3 text-sm font-semibold text-moss">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                {successMessage}
              </div>

              {deliveryWarning && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border-2 border-grape bg-grape/10 px-4 py-3 text-left text-xs font-semibold text-ink"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-grape" />
                  {deliveryWarning}
                </div>
              )}

              {devResetUrl && (
                <a
                  href={devResetUrl}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-2 border-ink bg-grape px-6 py-3 text-sm font-extrabold uppercase text-white shadow-sticker"
                >
                  Open reset link <ExternalLink size={14} />
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  setSuccessMessage(null);
                  setDevResetUrl(null);
                  setDeliveryWarning(null);
                }}
                className="w-full text-xs font-bold uppercase tracking-wider text-inksoft hover:text-ink cursor-pointer"
              >
                Use a different email
              </button>

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
                <label htmlFor="forgot-email" className="text-[11px] font-extrabold uppercase tracking-widest text-inksoft">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-inksoft" aria-hidden="true" />
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-ink/15 bg-cream px-4 py-3 pl-11 text-sm font-semibold text-ink placeholder-inksoft/60 focus:border-grape focus:outline-none"
                    placeholder="you@brainchild.games"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-coral px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-sticker hover:bg-coraldeep cursor-pointer disabled:opacity-60"
              >
                {isLoading ? 'Sending…' : 'Send Reset Link'}
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
