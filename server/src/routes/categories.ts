import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, requirePermission } from '../middleware/auth.js';
import { categorySchema } from '../validators/index.js';
import { logActivity, createActivityLogger } from '../services/activity.js';
import { z } from 'zod';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { newsPosts: true } } }
  });
  res.json({ categories });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { newsPosts: true } } }
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  res.json({ category });
}));

router.post('/', authMiddleware, requirePermission('categories:create'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = categorySchema.parse(req.body);

  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) {
    throw new AppError(409, 'Slug already exists');
  }

  const category = await prisma.category.create({ data });

  const logger = createActivityLogger(req);
  logger('CREATE_CATEGORY', 'category', category.id, { name: category.name });

  res.status(201).json({ category });
}));

router.patch('/:id', authMiddleware, requirePermission('categories:update'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = categorySchema.partial().parse(req.body);

  if (data.slug) {
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing && existing.id !== id) {
      throw new AppError(409, 'Slug already exists');
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data
  });

  const logger = createActivityLogger(req);
  logger('UPDATE_CATEGORY', 'category', category.id, data);

  res.json({ category });
}));

router.delete('/:id', authMiddleware, requirePermission('categories:delete'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const postsCount = await prisma.newsPost.count({ where: { categoryId: id } });
  if (postsCount > 0) {
    throw new AppError(400, 'Cannot delete category with existing posts');
  }

  await prisma.category.delete({ where: { id } });

  const logger = createActivityLogger(req);
  logger('DELETE_CATEGORY', 'category', id);

  res.json({ success: true });
}));

export default router;