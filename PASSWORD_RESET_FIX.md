# Fixing the "Failed to send password recovery" error

The error you see:

```
Failed to send password recovery: Failed to make POST request to
"https://kxirdoacrphluervussu.supabase.co/auth/v1/recover".
Check your project's Auth logs for more information.
Error message: Unable to process request
```

**What it is:** Supabase tried to send the recovery email and its email
delivery failed. `Unable to process request` is a generic 500 — every public
report of this exact error traces to the project's **SMTP email settings**
being broken (custom SMTP with bad credentials / blocked port, or the built-in
email service switched off). It is **not** your code, not Vercel, not a missing
account.

Your Supabase project ref: `kxirdoacrphluervussu`
(https://supabase.com/dashboard/project/kxirdoacrphluervussu)

---

## Step 1 — Get your password back RIGHT NOW (no email needed, ~1 minute)

1. Open https://supabase.com/dashboard/project/kxirdoacrphluervussu
2. Left sidebar → **Authentication → Users**
3. Find your email (e.g. `brainchildgamesin@gmail.com`) and click it
4. Click **Reset password** (top of the user page)
5. Enter your new password and save. Done — you can sign in with it.

This changes the password inside Supabase directly, so a broken email setup
cannot block you.

> ⚠️ If the account you're signing in with is the **admin console** account
> (the site's `/admin/login`), its password lives in the `admin_users` table,
> **not** in Supabase. For that one use the CLI instead:
>
> ```bash
> BRAINCHILD_ADMIN_PASSWORD=YourNewStrongPass123 npm run admin:set-password --prefix server
> ```
>
> (point `DATABASE_URL` at the production database first)

## Step 2 — Fix email sending so "Forgot password" works again (~2 minutes)

1. In the same project: **Project Settings → Auth → SMTP**
   (some dashboards: `Settings → Auth → Email / SMTP`)
2. **Turn OFF the custom SMTP provider** (uncheck "Use SMTP provider" /
   clear the host/user/password fields) so Supabase uses its **built-in
   email service** — that needs zero configuration.
3. Save.
4. If you *want* your own SMTP (SendGrid/Postmark/etc.), instead re-enter the
   credentials carefully: no leading/trailing spaces, correct port
   (`587` STARTTLS or `465` TLS), and verify the provider allows your IP.

Then test: open your app → **Forgot password** → enter your email → check
inbox **and Spam/Promotions**.

To see what failed before and after: **Logs → Auth** — the 500 is logged
there with the real internal reason (e.g. `SMTP authentication failed`,
`connection refused`, `TLS handshake failed`).

## Step 3 — Make sure reset links land on your site (~1 minute)

The link inside the email is opened with `?token=…`. For it to be accepted:

1. **Authentication → URL Configuration**
2. **Site URL** = `https://www.brainchildapp.com`
3. **Redirect URLs** — add:
   - `https://www.brainchildapp.com/**`
   - `https://brainchildapp.com/**`
   - `http://localhost:3000/**` (local dev)
4. Save.

## Step 4 — About the site in THIS repository

The Brainchild Games site in this repo **no longer uses Supabase for admin
password reset at all** — `/admin/forgot-password` goes through the site's own
API (`POST /api/auth/forgot-password`), so the Supabase 500 can never happen
in it. To put that version live on Vercel:

1. Push the latest `main` of this repo (or merge the open PR) so Vercel
   redeploys. The currently deployed build is **older** than the code in this
   repo — that's why you still see the Supabase error.
2. In Vercel → Settings → Environment Variables (Production + Preview) make
   sure these exist so the reset email actually goes out:

   | Variable | Value |
   | --- | --- |
   | `APP_BASE_URL` | `https://www.brainchildapp.com` |
   | `SMTP_HOST` / `SMTP_PORT` | e.g. `smtp.postmarkapp.com` / `587` |
   | `SMTP_USER` / `SMTP_PASSWORD` | provider credentials |
   | `MAIL_FROM` | `Brainchild Studio <no-reply@yourdomain>` |
   | `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_ORIGIN` | as before |

   If SMTP isn't set, the page tells you explicitly instead of promising an
   email that never arrives.

---

### TL;DR

1. **Now:** Supabase dashboard → Users → your email → **Reset password**.
2. **Next:** Settings → Auth → **SMTP → use built-in email service** (or fix
   custom SMTP), then test Forgot password and check Spam.
3. **Then:** redeploy this repo's `main` to Vercel so the site stops calling
   Supabase for admin resets at all.

Deeper background: `supabase/README.md` → "Troubleshooting: 'Unable to
process request' from Supabase Auth".
