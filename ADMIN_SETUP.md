# Admin Setup — brainchildgamesin@gmail.com

Primary studio admin **brainchildgamesin@gmail.com** is always valid as `SUPER_ADMIN` across both auth systems.

## 1. Express + PostgreSQL (main admin API)

### How it works
- `server/src/config/env.ts` defaults `ADMIN_EMAIL` to `brainchildgamesin@gmail.com`
- `server/scripts/seed.ts` always ensures this email exists as `SUPER_ADMIN`:
  - If `ADMIN_EMAIL` env var is set to something else, both accounts are created
  - If `ADMIN_EMAIL` is `brainchildgamesin@gmail.com` (default), only one account is created
  - Password comes from `ADMIN_PASSWORD` env var, or `BRAINCHILD_ADMIN_PASSWORD`, or fallback `BrainchildStudio2026` in dev
- `server/db/migrations/0002_add_brainchild_admin.sql` inserts the account with a bcrypt hash for `BrainchildStudio2026` if it doesn't exist, and ensures role = `SUPER_ADMIN`, `is_active = true`

### Local dev
```bash
# in server/
npm run db:setup   # migrates + seeds, creates brainchildgamesin@gmail.com / BrainchildStudio2026
# or
ADMIN_EMAIL=brainchildgamesin@gmail.com ADMIN_PASSWORD=YourStrongPassword123 npm run seed
```

Sign in at `http://localhost:3000/admin/login` with:
- Email: `brainchildgamesin@gmail.com`
- Password: `BrainchildStudio2026` (dev) or whatever you set in `ADMIN_PASSWORD`

### Production (Vercel + Neon/Supabase Postgres)
Set in Vercel env:
- `ADMIN_EMAIL=brainchildgamesin@gmail.com`
- `ADMIN_PASSWORD=<strong 12+ chars>`
- `DATABASE_URL=...`

Then run from your machine:
```bash
DATABASE_URL="postgresql://..." ADMIN_EMAIL="brainchildgamesin@gmail.com" ADMIN_PASSWORD="strong-pass" npm run db:setup --prefix server
```

## 2. Supabase Auth (player auth + alternative admin)

### How it works
- `supabase/migrations/0005_add_brainchild_admin.sql`:
  - Auto-confirms `brainchildgamesin@gmail.com` in `auth.users`
  - Ensures `profiles` row exists with `display_name = Brainchild Games`
  - Ensures `admin_users` row exists with `role = SUPER_ADMIN`, `is_active = true`
  - Creates trigger `trg_auto_promote_primary_admin` that auto-promotes this email on any future INSERT into `auth.users`
- `supabase/0003_auth_email_setup.sql` does the same for password-reset flow
- `supabase/apply_now.sql` is a one-file setup that includes the trigger + promotion

### Setup steps (Supabase Dashboard → SQL Editor)
1. Run `supabase/migrations/0001_init_schema.sql` (or `apply_now.sql` for one-go)
2. Run `supabase/migrations/0002_seed.sql`
3. Run `supabase/migrations/0004_add_media_bucket.sql`
4. Run `supabase/migrations/0005_add_brainchild_admin.sql`
5. Create user `brainchildgamesin@gmail.com` in Authentication → Users → Add user
6. Verify:
```sql
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'brainchildgamesin@gmail.com';
SELECT id, name, role, is_active FROM admin_users WHERE id IN (SELECT id FROM auth.users WHERE email = 'brainchildgamesin@gmail.com');
```

### Password reset
If you created the Supabase user but forgot password, use `/admin/forgot-password` which calls `supabase.auth.resetPasswordForEmail` — Supabase sends reset email to Gmail (check Spam/Promotions).

## 3. Frontend

- `src/admin/pages/LoginPage.tsx` placeholder is `brainchildgamesin@gmail.com` and shows helper "Primary admin: brainchildgamesin@gmail.com is always valid"
- `src/admin/pages/ForgotPasswordPage.tsx` defaults to `brainchildgamesin@gmail.com`
- `.env.example` includes `VITE_ADMIN_EMAIL=brainchildgamesin@gmail.com`

## 4. Testing login

Express API test:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"brainchildgamesin@gmail.com","password":"BrainchildStudio2026"}' \
  -c cookies.txt
```

Supabase test:
```js
import { supabase } from './lib/supabase'
await supabase.auth.signInWithPassword({ email: 'brainchildgamesin@gmail.com', password: '...' })
```

## 5. Changing password

After first login, go to Team → your account → Set password, or use Forgot Password flow.

Never commit real passwords — use env vars.
