import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { superAdminOnly } from '../middleware/rbac.js';
import { paginationSchema } from '../validators/index.js';
import { logActivity, createActivityLogger } from '../services/activity.js';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware, superAdminOnly);

router.get('/', asyncHandler(async (req, res) => {
  const query = paginationSchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, search } = query;

  const where = search ? {
    OR: [
      { email: { contains: search, mode: 'insensitive' as const } },
      { name: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [users, total] = await Promise.all([
    prisma.adminUser.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy || 'createdAt']: sortOrder },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true
      }
    }),
    prisma.adminUser.count({ where })
  ]);

  res.json({
    users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}));

router.get('/stats', asyncHandler(async (_req, res) => {
  const [total, active, byRole, recent] = await Promise.all([
    prisma.adminUser.count(),
    prisma.adminUser.count({ where: { isActive: true } }),
    prisma.adminUser.groupBy({ by: ['role'], _count: { role: true } }),
    prisma.adminUser.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    })
  ]);

  res.json({ total, active, byRole, recent });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await prisma.adminUser.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      activities: {
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: { action: true, entityType: true, entityId: true, createdAt: true }
      }
    }
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  res.json({ user });
}));

router.patch('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const schema = z.object({
    name: z.string().max(100).optional(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).optional(),
    isActive: z.boolean().optional()
  });
  const data = schema.parse(req.body);

  if (id === req.admin!.id && data.isActive === false) {
    throw new AppError(400, 'Cannot deactivate yourself');
  }

  const user = await prisma.adminUser.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, isActive: true, updatedAt: true }
  });

  const logger = createActivityLogger(req);
  logger('UPDATE_USER', 'admin_user', user.id, data);

  res.json({ user });
}));

router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (id === req.admin!.id) {
    throw new AppError(400, 'Cannot delete yourself');
  }

  await prisma.adminUser.delete({ where: { id } });

  const logger = createActivityLogger(req);
  logger('DELETE_USER', 'admin_user', id);

  res.json({ success: true });
}));

export default router;