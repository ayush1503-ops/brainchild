import { Router, Response } from 'express';
import { and, eq, gt, isNull, ne, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db/index.js';
import { adminActivity, adminSessions, adminUsers, passwordResetTokens } from '../db/schema.js';
import { config } from '../config/env.js';
import { AppError, asyncHandler } from '../middleware/errors.js';
import { AuthRequest, authenticate, signAccessToken, verifyAccessToken } from '../middleware/auth.js';
import {
  clearCsrfCookie,
  clearSessionCookies,
  CSRF_COOKIE,
  REFRESH_COOKIE,
  setCsrfCookie,
  setSessionCookies,
} from '../utils/cookies.js';
import {
  burnPasswordTime,
  checkPasswordPolicy,
  hashPassword,
  randomToken,
  sha256,
  verifyPassword,
} from '../utils/crypto.js';
import { audit } from '../services/activity.js';
import { loginLimiter, passwordResetLimiter } from '../middleware/security.js';
import { emailSchema } from '../middleware/validate.js';
import { passwordResetEmail, sendMail } from '../services/mailer.js';
import { logger } from '../utils/logger.js';
import { permissionsForRole } from '../services/permissions.js';

const router = Router();

const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;

const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, 'Enter your password').max(200),
  })
  .strict();

const passwordSchema = z
  .string()
  .min(12, 'Use at least 12 characters')
  .max(200, 'Password is too long');

const findByEmail = (email: string) =>
  sql`lower(${adminUsers.email}) = ${email}`;

async function issueSession(
  res: Response,
  admin: { id: string; email: string; role: string },
  meta: { ip?: string; userAgent?: string }
): Promise<void> {
  const refreshToken = randomToken(48);

  const [session] = await db
    .insert(adminSessions)
    .values({
      adminUserId: admin.id,
      tokenHash: sha256(refreshToken),
      ipAddress: meta.ip ?? null,
      userAgent: meta.userAgent?.slice(0, 400) ?? null,
      expiresAt: new Date(Date.now() + config.refreshTokenTtlDays * 24 * 60 * 60 * 1000),
    })
    .returning({ id: adminSessions.id });

  const accessToken = signAccessToken({
    sub: admin.id,
    email: admin.email,
    role: admin.role as never,
    sid: session.id,
  });

  setSessionCookies(res, { accessToken, refreshToken });
  // The double-submit token is deliberately NOT rotated here: a client that
  // already fetched /api/auth/csrf must keep working after signing in.
}

/** POST /api/auth/login */
router.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    const [admin] = await db.select().from(adminUsers).where(findByEmail(email)).limit(1);

    // Uniform failure for unknown users, wrong passwords and lockouts.
    const genericFailure = () =>
      new AppError(401, 'Email or password is incorrect.', 'invalid_credentials');

    if (!admin) {
      await burnPasswordTime(password);
      throw genericFailure();
    }

    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const minutes = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000);
      throw new AppError(
        423,
        `Too many failed attempts. This account is locked for ${minutes} more minute(s).`,
        'account_locked'
      );
    }

    if (!admin.isActive) {
      await burnPasswordTime(password);
      throw new AppError(403, 'This account has been deactivated. Contact a studio owner.', 'account_inactive');
    }

    const valid = await verifyPassword(password, admin.passwordHash);

    if (!valid) {
      const failedCount = admin.failedLoginCount + 1;
      const shouldLock = failedCount >= MAX_FAILED_LOGINS;

      await db
        .update(adminUsers)
        .set({
          failedLoginCount: shouldLock ? 0 : failedCount,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) : null,
        })
        .where(eq(adminUsers.id, admin.id));

      await db.insert(adminActivity).values({
        adminUserId: admin.id,
        actorEmail: admin.email,
        action: shouldLock ? 'LOGIN_LOCKED' : 'LOGIN_FAILED',
        entityType: 'auth',
        ipAddress: req.ip,
        userAgent: req.get('user-agent')?.slice(0, 400),
        requestId: (req as AuthRequest & { id?: string }).id,
      });

      if (shouldLock) {
        throw new AppError(
          423,
          `Too many failed attempts. This account is locked for ${LOCKOUT_MINUTES} minutes.`,
          'account_locked'
        );
      }
      throw genericFailure();
    }

    await db
      .update(adminUsers)
      .set({
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: req.ip ?? null,
      })
      .where(eq(adminUsers.id, admin.id));

    await issueSession(res, admin, { ip: req.ip, userAgent: req.get('user-agent') });

    audit(req)('LOGIN', 'auth', {
      adminUserId: admin.id,
      actorEmail: admin.email,
      summary: `${admin.name ?? admin.email} signed in`,
    });

    res.json({
      csrfToken: typeof req.cookies?.[CSRF_COOKIE] === 'string' ? req.cookies[CSRF_COOKIE] : undefined,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: permissionsForRole(admin.role as never),
        lastLoginAt: admin.lastLoginAt,
      },
    });
  })
);

/** GET /api/auth/csrf — issues a CSRF token before the first mutation. */
router.get('/csrf', (req, res) => {
  const existing = req.cookies?.[CSRF_COOKIE];
  const token = typeof existing === 'string' && existing.length >= 20 ? existing : randomToken(24);
  setCsrfCookie(res, token);
  res.json({ csrfToken: token });
});

/** POST /api/auth/refresh — rotates the refresh token (replay is blocked). */
router.post(
  '/refresh',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const raw = req.cookies?.[REFRESH_COOKIE];
    if (!raw || typeof raw !== 'string') throw new AppError(401, 'Session expired.', 'session_expired');

    const session = await db.query.adminSessions.findFirst({
      where: eq(adminSessions.tokenHash, sha256(raw)),
      with: {
        adminUser: { columns: { id: true, email: true, role: true, isActive: true } },
      },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      clearSessionCookies(res);
      throw new AppError(401, 'Session expired. Please sign in again.', 'session_expired');
    }

    if (!session.adminUser?.isActive) {
      clearSessionCookies(res);
      throw new AppError(403, 'This account is no longer active.', 'account_inactive');
    }

    // Rotate: the presented token becomes invalid immediately.
    const nextToken = randomToken(48);
    await db
      .update(adminSessions)
      .set({
        tokenHash: sha256(nextToken),
        lastUsedAt: new Date(),
        expiresAt: new Date(Date.now() + config.refreshTokenTtlDays * 24 * 60 * 60 * 1000),
      })
      .where(eq(adminSessions.id, session.id));

    const accessToken = signAccessToken({
      sub: session.adminUser.id,
      email: session.adminUser.email,
      role: session.adminUser.role as never,
      sid: session.id,
    });

    setSessionCookies(res, { accessToken, refreshToken: nextToken });
    res.json({ ok: true, expiresInMinutes: config.accessTokenTtlMinutes });
  })
);

/** GET /api/auth/me */
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const [admin] = await db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
        lastLoginAt: adminUsers.lastLoginAt,
        passwordChangedAt: adminUsers.passwordChangedAt,
        createdAt: adminUsers.createdAt,
      })
      .from(adminUsers)
      .where(eq(adminUsers.id, req.admin!.id))
      .limit(1);

    if (!admin) throw new AppError(404, 'Account not found.', 'not_found');
    res.json({ admin: { ...admin, permissions: req.admin!.permissions } });
  })
);

/** POST /api/auth/logout */
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.admin?.sessionId) {
      await db
        .update(adminSessions)
        .set({ revokedAt: new Date(), revokedReason: 'logout' })
        .where(eq(adminSessions.id, req.admin.sessionId));
    }
    audit(req)('LOGOUT', 'auth', { summary: 'Signed out' });
    clearSessionCookies(res);
    clearCsrfCookie(res);
    res.json({ ok: true });
  })
);

/** POST /api/auth/logout-all */
router.post(
  '/logout-all',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const ended = await db
      .update(adminSessions)
      .set({ revokedAt: new Date(), revokedReason: 'logout_all' })
      .where(and(eq(adminSessions.adminUserId, req.admin!.id), isNull(adminSessions.revokedAt)))
      .returning({ id: adminSessions.id });

    audit(req)('LOGOUT_ALL', 'auth', { summary: `Ended ${ended.length} session(s)` });
    clearSessionCookies(res);
    clearCsrfCookie(res);
    res.json({ ok: true, ended: ended.length });
  })
);

/** GET /api/auth/sessions — active devices for the signed-in admin. */
router.get(
  '/sessions',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const sessions = await db
      .select({
        id: adminSessions.id,
        ipAddress: adminSessions.ipAddress,
        userAgent: adminSessions.userAgent,
        createdAt: adminSessions.createdAt,
        lastUsedAt: adminSessions.lastUsedAt,
        expiresAt: adminSessions.expiresAt,
      })
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.adminUserId, req.admin!.id),
          isNull(adminSessions.revokedAt),
          gt(adminSessions.expiresAt, new Date())
        )
      )
      .orderBy(sql`${adminSessions.lastUsedAt} desc`);

    res.json({
      sessions: sessions.map((session) => ({
        ...session,
        current: session.id === req.admin!.sessionId,
        device: describeUserAgent(session.userAgent),
      })),
    });
  })
);

/** DELETE /api/auth/sessions/:id — ownership is enforced server-side. */
router.delete(
  '/sessions/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = z.string().uuid().parse(req.params.id);

    const [session] = await db
      .select({ id: adminSessions.id, adminUserId: adminSessions.adminUserId })
      .from(adminSessions)
      .where(eq(adminSessions.id, id))
      .limit(1);

    // A missing session and somebody else's session are indistinguishable,
    // which prevents probing for valid session ids.
    if (!session || session.adminUserId !== req.admin!.id) {
      throw new AppError(404, 'Session not found.', 'not_found');
    }

    await db
      .update(adminSessions)
      .set({ revokedAt: new Date(), revokedReason: 'revoked_by_user' })
      .where(eq(adminSessions.id, id));

    audit(req)('SESSION_REVOKED', 'auth', { entityId: id, summary: 'Ended a device session' });
    res.json({ ok: true });
  })
);

/** POST /api/auth/change-password */
router.post(
  '/change-password',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const schema = z
      .object({
        currentPassword: z.string().min(1).max(200),
        newPassword: passwordSchema,
      })
      .strict();
    const { currentPassword, newPassword } = schema.parse(req.body);

    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, req.admin!.id)).limit(1);
    if (!admin) throw new AppError(404, 'Account not found.', 'not_found');

    if (!(await verifyPassword(currentPassword, admin.passwordHash))) {
      throw new AppError(400, 'Your current password is incorrect.', 'invalid_password');
    }

    const policy = checkPasswordPolicy(newPassword, [admin.email, admin.name ?? '']);
    if (!policy.ok) throw new AppError(400, policy.problems.join(' '), 'weak_password', policy.problems);
    if (await verifyPassword(newPassword, admin.passwordHash)) {
      throw new AppError(400, 'Choose a password you have not used here before.', 'reused_password');
    }

    await db
      .update(adminUsers)
      .set({ passwordHash: await hashPassword(newPassword), passwordChangedAt: new Date() })
      .where(eq(adminUsers.id, admin.id));

    // Keep the current device signed in, drop every other one.
    await db
      .update(adminSessions)
      .set({ revokedAt: new Date(), revokedReason: 'password_changed' })
      .where(
        and(eq(adminSessions.adminUserId, admin.id), ne(adminSessions.id, req.admin!.sessionId))
      );

    audit(req)('PASSWORD_CHANGED', 'auth', { summary: 'Changed account password' });
    res.json({ ok: true });
  })
);

/** POST /api/auth/forgot-password */
router.post(
  '/forgot-password',
  passwordResetLimiter,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email } = z.object({ email: emailSchema }).strict().parse(req.body);

    const genericResponse = {
      message: 'If that email belongs to a studio account, a reset link is on its way.',
    };

    const [admin] = await db.select().from(adminUsers).where(findByEmail(email)).limit(1);
    if (!admin || !admin.isActive) {
      await burnPasswordTime(email);
      res.json(genericResponse);
      return;
    }

    // Invalidate outstanding tokens before issuing a new one.
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(and(eq(passwordResetTokens.adminUserId, admin.id), isNull(passwordResetTokens.usedAt)));

    const rawToken = randomToken(48);
    await db.insert(passwordResetTokens).values({
      adminUserId: admin.id,
      tokenHash: sha256(rawToken),
      expiresAt: new Date(Date.now() + config.resetTokenTtlMinutes * 60 * 1000),
      requestedIp: req.ip ?? null,
    });

    const resetUrl = `${config.mail.appBaseUrl}/admin/reset-password?token=${rawToken}`;
    const delivery = await sendMail({ to: admin.email, ...passwordResetEmail(resetUrl, config.resetTokenTtlMinutes) });

    audit(req)('PASSWORD_RESET_REQUESTED', 'auth', {
      adminUserId: admin.id,
      actorEmail: admin.email,
      summary: `Reset link generated for ${admin.email}`,
      metadata: { delivered: delivery.delivered },
    });

    logger.info('Password reset requested', { adminId: admin.id, delivered: delivery.delivered });

    res.json({
      ...genericResponse,
      // Development-only convenience; hard-disabled in production.
      ...(config.exposeResetLink ? { devResetUrl: resetUrl } : {}),
    });
  })
);

/** POST /api/auth/reset-password */
router.post(
  '/reset-password',
  passwordResetLimiter,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const schema = z
      .object({ token: z.string().min(20).max(200), newPassword: passwordSchema })
      .strict();
    const { token, newPassword } = schema.parse(req.body);

    const record = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.tokenHash, sha256(token)),
      with: { adminUser: { columns: { id: true, email: true, name: true, isActive: true } } },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new AppError(400, 'That reset link is invalid or has expired.', 'invalid_reset_token');
    }

    const policy = checkPasswordPolicy(newPassword, [record.adminUser?.email ?? '', record.adminUser?.name ?? '']);
    if (!policy.ok) throw new AppError(400, policy.problems.join(' '), 'weak_password', policy.problems);

    const passwordHash = await hashPassword(newPassword);

    await db.transaction(async (tx) => {
      await tx
        .update(adminUsers)
        .set({ passwordHash, passwordChangedAt: new Date(), failedLoginCount: 0, lockedUntil: null })
        .where(eq(adminUsers.id, record.adminUserId));

      await tx.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, record.id));

      // Every existing session dies with the old password.
      await tx
        .update(adminSessions)
        .set({ revokedAt: new Date(), revokedReason: 'password_reset' })
        .where(and(eq(adminSessions.adminUserId, record.adminUserId), isNull(adminSessions.revokedAt)));

      await tx.insert(adminActivity).values({
        adminUserId: record.adminUserId,
        actorEmail: record.adminUser?.email ?? null,
        action: 'PASSWORD_RESET_COMPLETED',
        entityType: 'auth',
        ipAddress: req.ip,
        userAgent: req.get('user-agent')?.slice(0, 400),
      });
    });

    clearSessionCookies(res);
    res.json({ ok: true, message: 'Password updated. You can sign in now.' });
  })
);

/** POST /api/auth/verify-session — lets the SPA check a token without side effects. */
router.post(
  '/verify-session',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const token = req.cookies?.bc_at;
    const payload = typeof token === 'string' ? verifyAccessToken(token) : null;
    res.json({ valid: Boolean(payload) });
  })
);

function describeUserAgent(userAgent: string | null): string {
  if (!userAgent) return 'Unknown device';
  const ua = userAgent.toLowerCase();
  const platform =
    ua.includes('iphone') || ua.includes('android')
      ? 'Mobile'
      : ua.includes('mac os')
        ? 'macOS'
        : ua.includes('windows')
          ? 'Windows'
          : ua.includes('linux')
            ? 'Linux'
            : 'Device';
  const browser = ua.includes('edg/')
    ? 'Edge'
    : ua.includes('chrome')
      ? 'Chrome'
      : ua.includes('safari') && !ua.includes('chrome')
        ? 'Safari'
        : ua.includes('firefox')
          ? 'Firefox'
          : 'Browser';
  return `${browser} · ${platform}`;
}

export default router;
