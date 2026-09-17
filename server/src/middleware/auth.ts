import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { db } from '../db/index.js';
import { adminSessions, adminUsers } from '../db/schema.js';
import { config } from '../config/env.js';
import { ACCESS_COOKIE } from '../utils/cookies.js';
import { AppError } from './errors.js';
import { permissionsForRole, Role } from '../services/permissions.js';

export interface SessionAdmin {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  sessionId: string;
  permissions: string[];
}

export interface AuthRequest extends Request {
  admin?: SessionAdmin;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Role;
  sid: string;
  typ: 'access';
}

export function signAccessToken(payload: Omit<AccessTokenPayload, 'typ'>): string {
  return jwt.sign({ ...payload, typ: 'access' }, config.jwtSecret, {
    expiresIn: `${config.accessTokenTtlMinutes}m`,
    issuer: 'brainchild-studio',
    audience: 'brainchild-admin',
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      issuer: 'brainchild-studio',
      audience: 'brainchild-admin',
    }) as AccessTokenPayload;
    return decoded.typ === 'access' ? decoded : null;
  } catch {
    return null;
  }
}

async function loadAdmin(adminId: string, sessionId: string): Promise<SessionAdmin | null> {
  const [admin] = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
    })
    .from(adminUsers)
    .where(eq(adminUsers.id, adminId))
    .limit(1);

  if (!admin || !admin.isActive) return null;

  if (sessionId) {
    // A session row must exist, still be live, and not have been revoked:
    // signing out elsewhere or a password change kills access immediately.
    const [session] = await db
      .select({ id: adminSessions.id })
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.id, sessionId),
          isNull(adminSessions.revokedAt),
          gt(adminSessions.expiresAt, new Date())
        )
      )
      .limit(1);
    if (!session) return null;
  }

  const role = admin.role as Role;
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role,
    sessionId,
    permissions: permissionsForRole(role),
  };
}

/** Reads the access cookie, validates the session, and loads the live admin row. */
export async function authenticate(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.[ACCESS_COOKIE];
    if (!token || typeof token !== 'string') {
      throw new AppError(401, 'Please sign in to continue.', 'unauthenticated');
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      throw new AppError(401, 'Your session has expired. Please sign in again.', 'session_expired');
    }

    const admin = await loadAdmin(payload.sub, payload.sid);
    if (!admin) {
      throw new AppError(401, 'Your session has ended. Please sign in again.', 'session_revoked');
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
}

/** Same as authenticate but never blocks the request. */
export async function optionalAuthenticate(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token || typeof token !== 'string') return next();

  const payload = verifyAccessToken(token);
  if (!payload) return next();

  const admin = await loadAdmin(payload.sub, payload.sid);
  if (admin) req.admin = admin;
  next();
}
