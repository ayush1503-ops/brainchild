import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, requirePermission } from '../middleware/auth.js';
import { superAdminOnly } from '../middleware/rbac.js';
import { registerAdminSchema } from '../validators/index.js';
import { logActivity, createActivityLogger } from '../services/activity.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const router = Router();

router.get('/stats', authMiddleware, requirePermission('games:read'), asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [
    totalGames,
    publishedGames,
    draftGames,
    totalUsers,
    subscribers,
    totalNews,
    recentGames,
    recentUsers,
    recentActivity
  ] = await Promise.all([
    prisma.game.count(),
    prisma.game.count({ where: { published: true } }),
    prisma.game.count({ where: { published: false } }),
    prisma.adminUser.count(),
    prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
    prisma.newsPost.count(),
    prisma.game.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, status: true, published: true, createdAt: true, heroImage: true }
    }),
    prisma.adminUser.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    }),
    prisma.adminActivity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        adminUser: { select: { id: true, name: true, email: true } }
      }
    })
  ]);

  res.json({
    stats: {
      totalGames,
      publishedGames,
      draftGames,
      totalUsers,
      subscribers,
      totalNews
    },
    recentGames,
    recentUsers,
    recentActivity
  });
}));

router.get('/admins', authMiddleware, superAdminOnly, asyncHandler(async (_req: AuthRequest, res: Response) => {
  const admins = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true }
  });
  res.json({ admins });
}));

router.post('/admins', authMiddleware, superAdminOnly, asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = registerAdminSchema.parse(req.body);

  const existing = await prisma.adminUser.findUnique({
    where: { email: data.email.toLowerCase() }
  });

  if (existing) {
    throw new AppError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const admin = await prisma.adminUser.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: data.role || 'EDITOR'
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true }
  });

  const logger = createActivityLogger(req);
  logger('CREATE_ADMIN', 'admin_user', admin.id, { email: admin.email, role: admin.role });

  res.status(201).json({ admin });
}));

router.patch('/admins/:id', authMiddleware, superAdminOnly, asyncHandler(async (req: AuthRequest, res: Response) => {
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

  const admin = await prisma.adminUser.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, isActive: true, updatedAt: true }
  });

  const logger = createActivityLogger(req);
  logger('UPDATE_ADMIN', 'admin_user', admin.id, data);

  res.json({ admin });
}));

router.delete('/admins/:id', authMiddleware, superAdminOnly, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (id === req.admin!.id) {
    throw new AppError(400, 'Cannot delete yourself');
  }

  await prisma.adminUser.delete({ where: { id } });

  const logger = createActivityLogger(req);
  logger('DELETE_ADMIN', 'admin_user', id);

  res.json({ success: true });
}));

export default router;