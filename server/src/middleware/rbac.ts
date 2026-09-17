import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export function adminOnly(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.admin) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  if (req.admin.role === 'EDITOR') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}

export function superAdminOnly(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.admin) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  if (req.admin.role !== 'SUPER_ADMIN') {
    res.status(403).json({ error: 'Super admin access required' });
    return;
  }
  next();
}