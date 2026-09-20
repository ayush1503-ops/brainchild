<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Brainchild Games — website + studio CMS

A Vite + React site (public studio website) with a secure Express + PostgreSQL
admin/CMS API (`server/`) and Supabase for player-facing auth, content and
storage.

## Architecture

| Piece | Tech | Where it runs on Vercel |
| --- | --- | --- |
| Public site + admin console | Vite + React 19 + Tailwind 4 | Static output (`dist/`), SPA fallback via `vercel.json` |
| Studio API (`/api/*`) | Express + Drizzle + PostgreSQL | Serverless function (`api/[...path].ts`) |
| Media uploads | Local disk (dev) / **Supabase Storage** (prod) | Storage bucket `media` (public) |
| Player auth / wishlists / newsletter / contact | Supabase (anon key, RLS) | Browser SDK (no server needed) |

## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```bash
   npm install                  # site + API runtime + dev tooling (one lockfile)
   npm install --prefix server  # optional: embedded Postgres (local dev DB) + nodemailer (SMTP)
   ```
   The second install is only needed for the local dev database
   (`npm run db:up --prefix server`) and local SMTP delivery — the API
   runs fine without it.
2. Start the dev database (embedded PostgreSQL, port 55432):
   ```bash
   npm run db:up --prefix server     # or: npm run db:setup (migrate + seed in one go)
   ```
3. Create `server/.env` from `server/.env.example` (the defaults work for dev).
4. Optionally create `.env.local` with your Supabase project (see
   `supabase/README.md`):
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-PUBLISHABLE-ANON-KEY
   ```
5. Run the API and the site:
   ```bash
   npm run dev:server                # Express API on :3001
   npm run dev                       # Vite on :3000 (proxies /api + /uploads)
   ```
   Sign in at `http://localhost:3000/admin/login`
   - **Email:** `brainchildgamesin@gmail.com` (always valid SUPER_ADMIN)
   - **Password:** `BrainchildStudio2026` in dev (or `ADMIN_PASSWORD` / `BRAINCHILD_ADMIN_PASSWORD` env var)
   - After first login, change password in **Settings → Change Your Password** (min 12 chars). Other sessions are revoked automatically.

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run db:setup --prefix server` | Migrate + seed the database (creates brainchildgamesin@gmail.com) |
| `npm run seed --prefix server` | Re-seed content (idempotent) |
| `npm run admin:reset-brainchild --prefix server` | Reset password for brainchildgamesin@gmail.com to env or dev default |
| `npm run build` | Build API (`server/dist`) + site (`dist`) |
| `npm run lint` | Typecheck the frontend |
| `npm run lint:all` | Typecheck frontend **and** API |
| `npx tsx scripts/vercel-sim.ts` | Simulate the Vercel serverless runtime locally (after `npm run build`) |

## Deploy to Vercel

The repo is wired for a single Vercel project: static site + API function.
Open `vercel.json` — no Vercel dashboard configuration is required beyond
environment variables.

### 1. Provision the database

Vercel has no persistent local disk, so the API needs a managed Postgres.
Any of these works (Neon is the smoothest fit):

- **Neon** (recommended) — create a project/database, use the **pooled
  endpoint** for `DATABASE_URL` (add `?pgbouncer=true` is *not* needed for the
  `pg` driver; the pooled host is enough).
- **Supabase** — use the Postgres URL from *Project Settings → Database*
  (the same Supabase project you use for auth/storage is fine).

Apply the schema + seed from your machine:

```bash
# in server/
DATABASE_URL="postgresql://..." ADMIN_EMAIL="you@example.com" \
  ADMIN_PASSWORD="something-strong" ADMIN_NAME="Studio Admin" \
  npm run db:setup --prefix server
```

### 2. Configure Supabase (already in your stack)

1. If you haven't set the project up yet, follow `supabase/README.md`
   (runs `0001_init_schema.sql` + `0002_seed.sql`).
2. Run **`supabase/migrations/0004_add_media_bucket.sql`** in the SQL Editor —
   it creates the public `media` bucket the API uploads into.
3. After deployment, add your Vercel URL to Supabase
   *Authentication → URL Configuration* (Site URL + redirect allow-list) so
   OAuth / password-reset links land on your domain.

### 3. Vercel environment variables

Project → Settings → Environment Variables (Production **and** Preview):

**Frontend (build-time, embedded in the bundle)**

`vercel.json` → `build.env` includes the public URL and anon key for the
Brainchild Supabase project (`kxirdoacrphluervussu`), so Vercel builds have
browser authentication configured. These are public browser credentials, not
administrator credentials; keep Row Level Security enabled on exposed tables.
If switching projects, update both values together. Local development still
uses `.env.local` as described above.

Redeploy after changing these values: Vite embeds them at build time.

Password recovery for the **admin console** is handled by this project's own
API, not by Supabase Auth — so no Supabase redirect URL is required for it.
Set `APP_BASE_URL` to your deployed origin instead; that is what the reset link
is built from. (Supabase's redirect allow-list only matters for player OAuth /
magic links on the public site.)

Never commit `DATABASE_URL`, database passwords, or service-role/secret keys.
Set those only in Vercel's environment settings (server-side, without `VITE_`).

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | publishable/anon key (safe to expose) |

**API (serverless runtime)**

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | your Postgres connection string |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | 32+ chars (`openssl rand -hex 32`) |
| `JWT_REFRESH_SECRET` | 32+ chars (different from above) |
| `FRONTEND_ORIGIN` | your Vercel URL (same-origin, but CSRF/origin checks use it) |
| `STORAGE_DRIVER` | `supabase` |
| `SUPABASE_URL` | same project URL as `VITE_SUPABASE_URL` |
| `SUPABASE_SERVICE_ROLE_KEY` | **service-role key — server-side only, never a `VITE_` var** |
| `STORAGE_BUCKET` | `media` (default) |
| `SERVE_FRONTEND` | `false` (Vercel serves the static build itself) |

**Required in production for password-reset emails** (the admin reset link is
sent by this API over SMTP; without these the form still replies "a reset link
is on its way" while nothing is sent, so the page now surfaces
`emailDeliveryEnabled: false` instead):

| Variable | Value |
| --- | --- |
| `APP_BASE_URL` | your deployed origin, e.g. `https://brainchild.vercel.app` |
| `SMTP_HOST` | e.g. `smtp.postmarkapp.com` |
| `SMTP_PORT` | `587` (STARTTLS) or `465` (implicit TLS) |
| `SMTP_USER` / `SMTP_PASSWORD` | provider credentials |
| `MAIL_FROM` | `Brainchild Studio <no-reply@yourdomain>` |

`nodemailer` is a normal root dependency, so `npm ci` installs it and Vercel's
function tracing ships it — SMTP works on Vercel, not just in a VM. If the
transport is misconfigured the API logs `Password reset email was not
delivered` with the reason, and returns `emailDeliveryEnabled: false`.

### 4. Deploy

```bash
npm i -g vercel
vercel            # first time: link the project, answer "Yes" to the prompts
vercel --prod
```

The build (see `vercel.json`) runs:

1. `npm ci` — installs everything from the single root lockfile. The
   local-dev-only optional packages (`embedded-postgres`, `nodemailer`)
   live in `server/` and are never installed on Vercel, so no native
   Postgres binary is downloaded in the build sandbox.
2. `npm run build:server && vite build` — compiles the API to
   `server/dist` and the site to `dist`.

Everything else is automatic:

- `dist/` → static site; the SPA fallback rewrites non-API paths to `index.html`
- `api/[...path].ts` → serverless function for every `/api/*` request (the SPA fallback explicitly excludes `/api` so it cannot swallow API calls)
  (the API's runtime dependencies are traced from the root `node_modules`,
  so no `includeFiles` are needed)
- security headers (CSP, X-Frame-Options, …) are set in `vercel.json`

**Function duration:** `vercel.json` sets `maxDuration: 60` for the API
function — the highest value accepted on every Vercel plan (Hobby caps
serverless functions at 60 s; a higher value in `vercel.json` fails the
build). If you're on Pro or Enterprise and need longer-running requests
(large backup exports), raise the project's Function Max Duration and bump
`maxDuration` in `vercel.json` to match (300 s max on Pro).

### 5. Verify

- `GET https://<your-project>.vercel.app/api/public/site` → JSON with games/news/jobs
- `GET .../api/health` → `{"status":"ok","database":"connected"}`
- Open `.../admin/login` and sign in with the admin you seeded.

### Vercel notes & trade-offs

- **Uploads**: with `STORAGE_DRIVER=supabase` (the setup above) images are
  stored in the public `media` bucket and served from Supabase's CDN — the
  right fit for serverless, where the local filesystem is ephemeral.
- **Body limit**: Vercel caps request bodies at 4.5 MB; the API caps single
  images at 4 MB (`MAX_UPLOAD_BYTES`) so uploads never trip the platform limit.
- **Rate limiting**: `express-rate-limit` uses in-memory counters, so limits
  are per function instance, not global. The login limiter (per IP + email)
  still blunts credential stuffing; for global limits add a shared store
  (e.g. Upstash Redis) when you outgrow it.
- **DB connections**: the pool is module-scoped and reused across warm
  invocations; idle connections are released after 30 s. Keep
  `DB_POOL_MAX` modest (≤ 10) so many instances don't exhaust a small
  database.
- **Function timeout** is set to 300 s (the platform maximum), which covers
  even large backup exports.

## Security model (short version)

- Admin auth: bcrypt (12 rounds) + HttpOnly `SameSite=Lax` JWT cookies +
  rotating refresh tokens, double-submit CSRF, origin checks, per-route RBAC,
  lockout after repeated failures.
- Content: parameterized SQL (Drizzle), HTML sanitized server-side, uploads
  validated by magic bytes with dimension checks.
- Supabase: everything player-facing is RLS-gated (see
  `supabase/migrations/0001_init_schema.sql`); the service-role key is used
  server-side only for media uploads.
- Full details in `SECURITY.md`.
