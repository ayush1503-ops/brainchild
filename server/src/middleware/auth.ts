import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.js';
import prisma from '../utils/prisma.js';

export interface AuthRequest extends Request {
  admin?: TokenPayload & { permissions: string[] };
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });

    if (!admin || !admin.isActive) {
      res.status(401).json({ error: 'Admin user not found or inactive' });
      return;
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      permissions: getPermissions(admin.role)
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
}

export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const accessToken = req.cookies?.accessToken;
  if (accessToken) {
    const payload = verifyAccessToken(accessToken);
    if (payload) {
      req.admin = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        permissions: getPermissions(payload.role)
      };
    }
  }
  next();
}

function getPermissions(role: string): string[] {
  const permissions: Record<string, string[]> = {
    SUPER_ADMIN: [
      'games:create', 'games:read', 'games:update', 'games:delete', 'games:publish', 'games:featured',
      'news:create', 'news:read', 'news:update', 'news:delete', 'news:publish', 'news:featured',
      'categories:create', 'categories:read', 'categories:update', 'categories:delete',
      'users:read', 'users:update', 'users:delete',
      'subscribers:read', 'subscribers:export', 'subscribers:delete',
      'contacts:read', 'contacts:update', 'contacts:delete',
      'content:read', 'content:update',
      'jobs:create', 'jobs:read', 'jobs:update', 'jobs:delete',
      'activity:read',
      'admin:create', 'admin:read', 'admin:update', 'admin:delete',
      'upload:create', 'upload:delete'
    ],
    ADMIN: [
      'games:create', 'games:read', 'games:update', 'games:delete', 'games:publish', 'games:featured',
      'news:create', 'news:read', 'news:update', 'news:delete', 'news:publish', 'news:featured',
      'categories:create', 'categories:read', 'categories:update', 'categories:delete',
      'users:read', 'users:update',
      'subscribers:read', 'subscribers:export', 'subscribers:delete',
      'contacts:read', 'contacts:update',
      'content:read', 'content:update',
      'jobs:create', 'jobs:read', 'jobs:update', 'jobs:delete',
      'activity:read',
      'upload:create', 'upload:delete'
    ],
    EDITOR: [
      'games:create', 'games:read', 'games:update', 'games:publish', 'games:featured',
      'news:create', 'news:read', 'news:update', 'news:publish', 'news:featured',
      'categories:read',
      'subscribers:read',
      'contacts:read',
      'content:read', 'content:update',
      'jobs:read',
      'upload:create'
    ]
  };
  return permissions[role] || [];
}

export function requirePermission(permission: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    if (!req.admin.permissions.includes(permission)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}