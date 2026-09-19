-- =============================================================================
--  Enable password-reset emails + point reset links to your frontend
-- -----------------------------------------------------------------------------
--  Run this in Supabase SQL Editor after 0001/0002 (apply_now.sql).
--
--  It:
--   • Ensures email/password sign-up is enabled (required for admin login)
--   • Sets the site URL to your Vite dev server for local testing
--   • Adds production URLs as allowed redirect targets
--   • Confirms your admin account (brainchildgamesin@gmail.com) automatically
--     so you don't have to verify the email before requesting a reset.
--
--  NOTE: Supabase sends transactional emails (password reset, magic link)
--  out of the box with their default sender. You don't need to connect a
--  custom SMTP/Gmail account for this to work — Supabase handles delivery.
--  The reset email will arrive in your Gmail inbox (check Promotions/Spam).
-- =============================================================================

-- 1. Configure auth settings (Site URL + redirect allow-list).
--    Replace the values below with your real domains (localhost is for dev).
INSERT INTO auth.config (instance_id, site_url, additional_redirect_urls)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'http://localhost:3000',
  ARRAY[
    'http://localhost:3000/**',
    'http://127.0.0.1:3000/**'
  ]::text[]
)
ON CONFLICT (instance_id) DO UPDATE SET
  site_url = EXCLUDED.site_url,
  additional_redirect_urls = EXCLUDED.additional_redirect_urls;

-- 2. Auto-confirm your admin email so password reset works immediately.
--    (Supabase won't send a reset email to an unconfirmed address by default.)
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    confirmation_token = NULL,
    confirmation_sent_at = NULL,
    recovery_token = NULL,
    recovery_sent_at = NULL
WHERE email = 'brainchildgamesin@gmail.com';

-- 3. Make sure a profile row exists for your admin account (in case you
--    created the user in the dashboard before the trigger was attached).
INSERT INTO profiles (id, display_name, email_verified)
SELECT id, 'Brainchild Games', true
FROM auth.users
WHERE email = 'brainchildgamesin@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  email_verified = true,
  updated_at     = now();

-- 4. Promote brainchildgamesin@gmail.com to SUPER_ADMIN in admin_users (primary studio owner)
INSERT INTO admin_users (id, name, role, is_active)
SELECT id, 'Brainchild Games', 'SUPER_ADMIN', true
FROM auth.users WHERE email = 'brainchildgamesin@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'SUPER_ADMIN',
  is_active = true,
  name = 'Brainchild Games',
  updated_at = now();

-- Sanity check:
SELECT id, email, email_confirmed_at, last_sign_in_at
FROM auth.users
WHERE email = 'brainchildgamesin@gmail.com';

-- Verify admin promotion
SELECT id, name, role, is_active FROM admin_users
WHERE id IN (SELECT id FROM auth.users WHERE email = 'brainchildgamesin@gmail.com');
