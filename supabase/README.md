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

1. In **Authentication → Users**, click *Add user* and create yourself with a
   real email/password.
2. Back in the SQL Editor, promote yourself to SUPER_ADMIN:

   ```sql
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
