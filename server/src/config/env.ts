import crypto from 'crypto';
import dotenv from 'dotenv';

// Loaded here (not only in the entrypoint) so every process — API, scripts and
// tests — reads the same environment before any config value is evaluated.
dotenv.config();

/**
 * Central, validated environment configuration.
 *
 * Security rules enforced here:
 *  - Production refuses to boot with missing/weak secrets (no silent fallbacks).
 *  - Development gets generated ephemeral secrets so the project runs out of the box.
 *  - Secrets are never logged; only a presence report is printed at startup.
 */

const isProduction = process.env.NODE_ENV === 'production';

function required(name: string, value: string | undefined, minLength = 1): string {
  if (!value || value.trim().length < minLength) {
    throw new Error(
      `[config] Missing or too short environment variable "${name}" (min ${minLength} chars). ` +
        `Copy server/.env.example to server/.env and set a strong value.`
    );
  }
  return value.trim();
}

function optional(value: string | undefined, fallback: string): string {
  return value && value.trim() !== '' ? value.trim() : fallback;
}

function devFallback(name: string, fallback: string): string {
  const provided = process.env[name]?.trim();
  if (provided) return provided;

  if (isProduction) {
    throw new Error(
      `[config] ${name} must be set in production. Generate one with: openssl rand -hex 32`
    );
  }
  // Ephemeral per-boot secret: fine for local development, never used in production.
  // eslint-disable-next-line no-console
  console.warn(`[config] ${name} is not set — using an ephemeral development secret.`);
  return crypto.randomBytes(32).toString('hex') || fallback;
}

const DEV_DATABASE_URL =
  'postgresql://brainchild:brainchild@127.0.0.1:55432/brainchild_games?schema=public';

export const config = {
  env: isProduction ? 'production' : optional(process.env.NODE_ENV, 'development'),
  isProduction,
  isTest: process.env.NODE_ENV === 'test',

  port: Number(optional(process.env.PORT, '3001')),
  host: optional(process.env.HOST, '0.0.0.0'),

  databaseUrl: isProduction
    ? required('DATABASE_URL', process.env.DATABASE_URL, 12)
    : optional(process.env.DATABASE_URL, DEV_DATABASE_URL),

  // --- crypto -------------------------------------------------------------
  jwtSecret: isProduction
    ? required('JWT_SECRET', process.env.JWT_SECRET, 32)
    : devFallback('JWT_SECRET', 'dev-jwt-secret'),
  jwtRefreshSecret: isProduction
    ? required('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET, 32)
    : devFallback('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
  accessTokenTtlMinutes: Number(optional(process.env.ACCESS_TOKEN_TTL_MINUTES, '30')),
  refreshTokenTtlDays: Number(optional(process.env.REFRESH_TOKEN_TTL_DAYS, '14')),
  resetTokenTtlMinutes: Number(optional(process.env.RESET_TOKEN_TTL_MINUTES, '30')),
  bcryptRounds: Number(optional(process.env.BCRYPT_ROUNDS, '12')),

  // --- network / cookies --------------------------------------------------
  frontendOrigins: optional(process.env.FRONTEND_ORIGIN, 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean),
  trustProxy: optional(process.env.TRUST_PROXY, '1'),
  forceHttps: optional(process.env.FORCE_HTTPS, isProduction ? 'true' : 'false') === 'true',
  cookieSecure: optional(process.env.COOKIE_SECURE, isProduction ? 'true' : 'false') === 'true',
  cookieDomain: process.env.COOKIE_DOMAIN?.trim() || undefined,

  // --- uploads ------------------------------------------------------------
  uploadDir: optional(process.env.UPLOAD_DIR, './uploads'),
  // 4 MB keeps single-image uploads under the 4.5 MB serverless request-body
  // limit on Vercel (and is plenty for CMS hero/cover images).
  maxUploadBytes: Number(optional(process.env.MAX_UPLOAD_BYTES, String(4 * 1024 * 1024))),

  /**
   * Media storage backend:
   *  - `local`    (default when no Supabase service-role key is present):
   *               files live on the API server's disk and are served from
   *               `/uploads`. Fine for development and single-server deploys.
   *  - `supabase`: files go to a Supabase Storage bucket via the service-role
   *               key and are served from the public storage CDN. This is the
   *               correct mode for serverless hosts (Vercel) where the local
   *               filesystem is ephemeral.
   *
   * Set STORAGE_DRIVER explicitly to override auto-detection.
   */
  storageDriver: optional(
    process.env.STORAGE_DRIVER,
    process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_URL ? 'supabase' : 'local'
  ),
  supabaseUrl: process.env.SUPABASE_URL?.trim() || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '',
  storageBucket: optional(process.env.STORAGE_BUCKET, 'media'),

  // --- mail ---------------------------------------------------------------
  mail: {
    transport: optional(process.env.MAIL_TRANSPORT, isProduction ? 'smtp' : 'console'),
    from: optional(process.env.MAIL_FROM, 'Brainchild Studio <no-reply@brainchild.games>'),
    smtpHost: process.env.SMTP_HOST?.trim(),
    smtpPort: Number(optional(process.env.SMTP_PORT, '587')),
    smtpUser: process.env.SMTP_USER?.trim(),
    smtpPassword: process.env.SMTP_PASSWORD,
    appBaseUrl: optional(process.env.APP_BASE_URL, 'http://localhost:3000').replace(/\/$/, ''),
  },

  // --- developer conveniences (never enabled in production) ----------------
  exposeResetLink: !isProduction && optional(process.env.DEV_EXPOSE_RESET_LINK, 'true') === 'true',
  logLevel: optional(process.env.LOG_LEVEL, isProduction ? 'info' : 'debug'),

  // --- serving ------------------------------------------------------------
  serveFrontend: optional(process.env.SERVE_FRONTEND, isProduction ? 'true' : 'false') === 'true',
  frontendDistDir: optional(process.env.FRONTEND_DIST_DIR, '../dist'),

  seed: {
    adminEmail: optional(process.env.ADMIN_EMAIL, 'brainchildgamesin@gmail.com'),
    adminPassword: process.env.ADMIN_PASSWORD,
    adminName: optional(process.env.ADMIN_NAME, 'Studio Admin'),
    // Always ensure this studio owner account exists as SUPER_ADMIN
    primaryAdminEmail: 'brainchildgamesin@gmail.com',
    primaryAdminName: 'Brainchild Games',
  },
};

export type AppConfig = typeof config;

/* Validate the storage driver up front so misconfiguration fails loudly. */
if (!['local', 'supabase'].includes(config.storageDriver)) {
  throw new Error(
    `[config] STORAGE_DRIVER must be "local" or "supabase", got "${config.storageDriver}".`
  );
}
if (isProduction && config.storageDriver === 'supabase' && (!config.supabaseUrl || !config.supabaseServiceRoleKey)) {
  throw new Error(
    '[config] STORAGE_DRIVER=supabase requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in production.'
  );
}

/** Startup checklist printed once so operators can spot insecure setups fast. */
export function configReport(): string[] {
  return [
    `environment: ${config.env}`,
    `database: ${config.databaseUrl.replace(/:\/\/[^@]*@/, '://***:***@')}`,
    `cookies secure: ${config.cookieSecure}`,
    `force https: ${config.forceHttps}`,
    `allowed origins: ${config.frontendOrigins.join(', ')}`,
    `mail transport: ${config.mail.transport}`,
    `reset link exposure: ${config.exposeResetLink ? 'DEV ONLY (enabled)' : 'disabled'}`,
  ];
}
