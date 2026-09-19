# Supabase setup for Brainchild Games

This directory contains the Supabase integration that powers the **public
site** (newsletter signup, contact form, player auth, wishlists, and live
reads of published content). The Express + Drizzle backend in `server/`
continues to handle the admin/CMS API unchanged.

## 1. Configure env

Your publishable key is already written to `/.env.local`:

```
VITE_SUPABASE_URL=https://h6m5jo2yd75st3tw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_h6m5Jo2yd75st3tw_VcOMg_XXiDu9d3
```

> ⚠️ Never put the **service-role** key in a `VITE_` variable — that key
> bypasses RLS and must stay on the server.

## 2. Apply the SQL migrations

Open your Supabase project dashboard → **SQL Editor**, and run, in order:

1. `supabase/migrations/0001_init_schema.sql` — tables, functions, RLS, storage buckets
2. `supabase/migrations/0002_seed.sql` — starter categories, settings, one sample job

If you use the Supabase CLI you can instead run `supabase db push`.

## 3. Create your first admin

Primary studio admin `brainchildgamesin@gmail.com` is always valid as SUPER_ADMIN (auto-promoted by migrations).

1. In **Authentication → Users**, click *Add user* and create `brainchildgamesin@gmail.com` with a strong password (or your own email).
2. Back in the SQL Editor, promote yourself to SUPER_ADMIN (if you used a different email, or to ensure primary admin):

   ```sql
   -- Primary admin (always valid)
   INSERT INTO admin_users (id, name, role, is_active)
   SELECT id, 'Brainchild Games', 'SUPER_ADMIN', true
   FROM auth.users WHERE email = 'brainchildgamesin@gmail.com'
   ON CONFLICT (id) DO UPDATE SET role = 'SUPER_ADMIN', is_active = true;

   -- Additional admin (example)
   INSERT INTO admin_users (id, name, role, is_active)
   SELECT id, 'Studio Admin', 'SUPER_ADMIN', true
   FROM auth.users WHERE email = 'you@brainchild.games';
   ```

## 4. (Optional) Enable OAuth providers

In **Authentication → Providers**, enable Google / GitHub / Discord / Apple
as desired — the frontend already supports them through
`useSupabaseAuth().signInWithOAuth('google')`.

## What's in the frontend

| File | Purpose |
| --- | --- |
| `src/lib/supabase.ts` | Singleton browser Supabase client (anon key). Safe no-op if env is missing. |
| `src/context/SupabaseAuthContext.tsx` | React context: `useSupabaseAuth()` exposes `user`, `session`, `signIn`, `signUp`, `signOut`, `signInWithOAuth`, `resetPasswordForEmail`, `updatePassword`. Mounted at the root in `App.tsx`. |
| `src/lib/supabase-public.ts` | Helpers for the public site: `subscribeNewsletter()`, `submitContactMessage()`, `fetchPublishedNews()`, `fetchPublishedGames()`. |

### Quick example

```tsx
import { useSupabaseAuth } from './context/SupabaseAuthContext';
import { subscribeNewsletter } from './lib/supabase-public';

function SignupBox() {
  const { user, signInWithOAuth, signOut } = useSupabaseAuth();
  return user ? (
    <button onClick={signOut}>Sign out</button>
  ) : (
    <button onClick={() => signInWithOAuth('google')}>Sign in with Google</button>
  );
}
```

## RLS summary (built into 0001_init_schema.sql)

| Role | Can do |
| --- | --- |
| `anon` (not logged in) | Read published games/news, open jobs, categories, public content blocks, media. Insert into `subscribers`, `contact_messages`. Call `increment_view`, `unsubscribe`. |
| Authenticated player | All anon permissions. Read/update their own `profiles` row, manage their `wishlists`, upload their own avatar. |
| Studio editor / admin / super-admin | Full CRUD on every table plus upload/delete in all storage buckets. |

## Admin password reset does not use Supabase Auth

This is the most important thing to know before debugging a broken reset link.

| Flow | Credential store | Endpoints |
| --- | --- | --- |
| **Admin console** (`/admin/login`) | `admin_users.password_hash` (bcrypt), managed by the Express API | `POST /api/auth/forgot-password` → `GET /admin/reset-password?token=…` → `POST /api/auth/reset-password` |
| Public site / players | Supabase `auth.users` | `supabase.auth.*` from the browser |

`ForgotPasswordPage` and `ResetPasswordPage` used to call
`supabase.auth.resetPasswordForEmail`, which writes to `auth.users` — a
*different* store from the one `/api/auth/login` checks. A Supabase reset link
could therefore succeed and still leave you unable to sign in. Both pages now
talk to the Express API, and `useSupabaseAuth()` has no callers.

Supabase is still used by this project for the public site (newsletter,
contact form, published content, storage), so the rest of this file still
applies.

## Troubleshooting: "Unable to process request" from Supabase Auth

The full client-side error looks like this:

```
AuthApiError: Unable to process request
status: 500, code: 'unexpected_failure'
Failed to make POST request to "https://<ref>.supabase.co/auth/v1/recover"
```

The response body is `{"code":500,"error_code":"unexpected_failure",
"msg":"Unable to process request","error_id":"…"}`.

**It is a generic, redacted 500 — not a diagnosis.** The string is hard-coded in
`supabase/auth` at `internal/api/recover.go`, and in the versions that were live
throughout 2024 (refs `4392a08d68`, `285c290adf`) *two* different branches
returned it:

1. `models.FindUserByEmailAndAudience` returned an error other than
   "not found" — a real database error while reading `auth.users` (the query is
   `tx.Eager().Q().Where(...).First(obj)`, so an eagerly loaded association such
   as `auth.identities` failing also lands here).
2. **The recovery-email transaction failed — i.e. SMTP delivery blew up.**
   `sendPasswordRecovery` errors were swallowed by a blanket
   `return internalServerError("Unable to process request")`.

Since ref `f3a28d182d` (Sept 2024) branch 2 returns the underlying error, so
newer projects report SMTP problems as `Error sending recovery email` instead.
Which string you see therefore depends on the GoTrue build your project runs.

### What it is NOT

- **Not a missing account.** If the email does not exist, `recover.go` returns
  `200 OK` with `{}` — the request *succeeds*. "The user is in a different
  Supabase project" cannot produce this error.
- **Not duplicate rows.** `findUser` (`internal/models/user.go`) uses
  `.First()`, which returns the first match and does not error when several
  rows share an address. The query is also `LOWER(email) = ?`, so letter case
  is irrelevant.
- **Not Vercel, CSP or this repo's API.** The browser talks to
  `*.supabase.co` directly; `vercel.json` only allows it via
  `connect-src https://*.supabase.co`.

### How to find the real cause

1. **Supabase dashboard → Logs → Auth logs.** The 500 is logged with the
   internal error attached (`observability.LogEntrySetField(r, "error", …)`).
   That one line tells you definitively whether it was SMTP or the database.
2. **Project Settings → Auth → SMTP.** If a custom SMTP host is configured,
   this is by far the most common cause: rejected credentials, a leading space
   in the username, a blocked port, or an expired TLS certificate on the
   provider. Temporarily switch back to Supabase's built-in email service — if
   the reset starts working, the custom SMTP is the problem.
3. **Auth → Email Templates → Reset Password.** A broken template also fails
   the send.
4. **Retry once or twice** before assuming a config problem; transient
   infrastructure errors do occur.

### Getting back in right now

Reset the password directly in the dashboard: **Authentication → Users → your
email → Reset password**. No email is involved, so a broken SMTP setup cannot
block it. Note that this changes the **Supabase** password — it will not change
the admin console password, which lives in `admin_users`. For that, use
`npm run admin:set-password --prefix server`.

## Site URL and redirect allow-list

These are set from the dashboard (**Authentication → URL Configuration**) or
from `supabase/config.toml` when you use config-as-code. See
`0003_auth_email_setup.sql` for the SQL that *is* safe to run.
