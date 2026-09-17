import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, requirePermission } from '../middleware/auth.js';
import { jobSchema, paginationSchema } from '../validators/index.js';
import { logActivity, createActivityLogger } from '../services/activity.js';
import { z } from 'zod';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const query = paginationSchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, search } = query;

  const where: any = { status: 'OPEN' };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { department: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy || 'createdAt']: sortOrder }
    }),
    prisma.job.count({ where })
  ]);

  res.json({
    jobs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}));

router.get('/admin', authMiddleware, requirePermission('jobs:read'), asyncHandler(async (req, res) => {
  const query = paginationSchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, search } = query;

  const where = search ? {
    OR: [
      { title: { contains: search, mode: 'insensitive' as const } },
      { department: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy || 'createdAt']: sortOrder }
    }),
    prisma.job.count({ where })
  ]);

  res.json({
    jobs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });

  if (!job) {
    throw new AppError(404, 'Job not found');
  }

  res.json({ job });
}));

router.post('/', authMiddleware, requirePermission('jobs:create'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = jobSchema.parse(req.body);

  const job = await prisma.job.create({ data: data as any });

  const logger = createActivityLogger(req);
  logger('CREATE_JOB', 'job', job.id, { title: job.title });

  res.status(201).json({ job });
}));

router.patch('/:id', authMiddleware, requirePermission('jobs:update'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = jobSchema.partial().parse(req.body);

  const job = await prisma.job.update({
    where: { id },
    data
  });

  const logger = createActivityLogger(req);
  logger('UPDATE_JOB', 'job', job.id, data);

  res.json({ job });
}));

router.delete('/:id', authMiddleware, requirePermission('jobs:delete'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.job.delete({ where: { id } });

  const logger = createActivityLogger(req);
  logger('DELETE_JOB', 'job', id);

  res.json({ success: true });
}));

export default router;