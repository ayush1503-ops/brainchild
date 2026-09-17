import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { paginationSchema } from '../validators/index.js';
import { getRecentActivity, getActivityStats } from '../services/activity.js';

const router = Router();

router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = paginationSchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, search } = query;

  const where: any = {};
  if (search) {
    where.OR = [
      { action: { contains: search, mode: 'insensitive' } },
      { entityType: { contains: search, mode: 'insensitive' } },
      { adminUser: { name: { contains: search, mode: 'insensitive' } } },
      { adminUser: { email: { contains: search, mode: 'insensitive' } } }
    ];
  }

  const [activities, total] = await Promise.all([
    prisma.adminActivity.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy || 'createdAt']: sortOrder },
      include: {
        adminUser: {
          select: { id: true, name: true, email: true }
        }
      }
    }),
    prisma.adminActivity.count({ where })
  ]);

  res.json({
    activities,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}));

router.get('/stats', asyncHandler(async (_req: AuthRequest, res: Response) => {
  const stats = await getActivityStats();
  res.json({ stats });
}));

router.get('/recent', asyncHandler(async (_req: AuthRequest, res: Response) => {
  const activities = await getRecentActivity(20);
  res.json({ activities });
}));

export default router;