import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, requirePermission } from '../middleware/auth.js';
import { newsSchema, newsUpdateSchema, paginationSchema } from '../validators/index.js';
import { logActivity, createActivityLogger } from '../services/activity.js';
import { z } from 'zod';

const router = Router();

router.get('/', authMiddleware, requirePermission('news:read'), asyncHandler(async (req, res) => {
  const query = paginationSchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, search } = query;

  const where = search ? {
    OR: [
      { title: { contains: search, mode: 'insensitive' as const } },
      { slug: { contains: search, mode: 'insensitive' as const } },
      { excerpt: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [posts, total] = await Promise.all([
    prisma.newsPost.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy || 'createdAt']: sortOrder },
      include: { category: true }
    }),
    prisma.newsPost.count({ where })
  ]);

  res.json({
    posts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}));

router.get('/public', asyncHandler(async (req, res) => {
  const query = paginationSchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, search } = query;

  const where: any = { status: 'PUBLISHED' };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { tags: { hasSome: search.split(' ') } }
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.newsPost.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy || 'publishedAt']: sortOrder },
      include: { category: true }
    }),
    prisma.newsPost.count({ where })
  ]);

  res.json({
    posts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}));

router.get('/featured', asyncHandler(async (_req, res) => {
  const posts = await prisma.newsPost.findMany({
    where: { status: 'PUBLISHED', featured: true },
    orderBy: { publishedAt: 'desc' },
    take: 5,
    include: { category: true }
  });
  res.json({ posts });
}));

router.get('/:id', authMiddleware, requirePermission('news:read'), asyncHandler(async (req, res) => {
  const post = await prisma.newsPost.findUnique({
    where: { id: req.params.id },
    include: { category: true }
  });

  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  res.json({ post });
}));

router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const post = await prisma.newsPost.findUnique({
    where: { slug: req.params.slug },
    include: { category: true }
  });

  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  res.json({ post });
}));

router.post('/', authMiddleware, requirePermission('news:create'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = newsSchema.parse(req.body);

  const existing = await prisma.newsPost.findUnique({ where: { slug: data.slug } });
  if (existing) {
    throw new AppError(409, 'Slug already exists');
  }

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) {
    throw new AppError(400, 'Invalid category');
  }

  const post = await prisma.newsPost.create({
    data: {
      ...data,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : null
    } as any,
    include: { category: true }
  });

  const logger = createActivityLogger(req);
  logger('CREATE_NEWS', 'news_post', post.id, { title: post.title, slug: post.slug });

  res.status(201).json({ post });
}));

router.patch('/:id', authMiddleware, requirePermission('news:update'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = newsUpdateSchema.parse(req.body);

  const existing = await prisma.newsPost.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Post not found');
  }

  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.newsPost.findUnique({ where: { slug: data.slug } });
    if (slugExists) {
      throw new AppError(409, 'Slug already exists');
    }
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      throw new AppError(400, 'Invalid category');
    }
  }

  const updateData: any = { ...data };
  if (data.status === 'PUBLISHED' && existing.status === 'DRAFT') {
    updateData.publishedAt = new Date();
  } else if (data.status === 'DRAFT' && existing.status === 'PUBLISHED') {
    updateData.publishedAt = null;
  }

  const post = await prisma.newsPost.update({
    where: { id },
    data: updateData,
    include: { category: true }
  });

  const logger = createActivityLogger(req);
  logger('UPDATE_NEWS', 'news_post', post.id, { title: post.title, changes: Object.keys(data) });

  res.json({ post });
}));

router.delete('/:id', authMiddleware, requirePermission('news:delete'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.newsPost.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Post not found');
  }

  await prisma.newsPost.delete({ where: { id } });

  const logger = createActivityLogger(req);
  logger('DELETE_NEWS', 'news_post', id, { title: existing.title });

  res.json({ success: true });
}));

router.post('/:id/publish', authMiddleware, requirePermission('news:publish'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { published } = z.object({ published: z.boolean() }).parse(req.body);

  const post = await prisma.newsPost.update({
    where: { id },
    data: {
      status: published ? 'PUBLISHED' : 'DRAFT',
      publishedAt: published ? new Date() : null
    },
    include: { category: true }
  });

  const logger = createActivityLogger(req);
  logger(published ? 'PUBLISH_NEWS' : 'UNPUBLISH_NEWS', 'news_post', post.id, { title: post.title });

  res.json({ post });
}));

router.post('/:id/featured', authMiddleware, requirePermission('news:featured'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { featured } = z.object({ featured: z.boolean() }).parse(req.body);

  const post = await prisma.newsPost.update({
    where: { id },
    data: { featured },
    include: { category: true }
  });

  const logger = createActivityLogger(req);
  logger(featured ? 'FEATURE_NEWS' : 'UNFEATURE_NEWS', 'news_post', post.id, { title: post.title });

  res.json({ post });
}));

export default router;