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

1. Install dependencies (frontend **and** API):
   ```bash
   npm install
   npm install --prefix server
   ```
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
   (seeded: `brainchildgamesin@gmail.com` / `BrainchildStudio2026` — always valid SUPER_ADMIN, change password after first login).

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run db:setup --prefix server` | Migrate + seed the database |
| `npm run seed --prefix server` | Re-seed content (idempotent) |
| `npm run build` | Build API (`server/dist`) + site (`dist`) |
| `npm run lint` | Typecheck everything |
| `cd server && npx tsx ../scripts/vercel-sim.ts` | Simulate the Vercel serverless runtime locally (after `npm run build`) |

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

Optional (password-reset emails via SMTP — note: the serverless bundle keeps
`nodemailer` out, so on Vercel the mailer degrades gracefully; set these when
running the API in a VM/container for real SMTP delivery):
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`,
`APP_BASE_URL`.

### 4. Deploy

```bash
npm i -g vercel
vercel            # first time: link the project, answer "Yes" to the prompts
vercel --prod
```

The build runs `npm ci --prefix server && npm run build --prefix server &&
vite build` (see `vercel.json`). Everything else is automatic:

- `dist/` → static site, `/(.*)` rewrites to `index.html` for client routing
- `api/[...path].ts` → serverless function for every `/api/*` request
- security headers (CSP, X-Frame-Options, …) are set in `vercel.json`

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
