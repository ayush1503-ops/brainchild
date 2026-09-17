import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, requirePermission } from '../middleware/auth.js';
import { gameSchema, gameUpdateSchema, paginationSchema } from '../validators/index.js';
import { logActivity, createActivityLogger } from '../services/activity.js';
import { z } from 'zod';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const query = paginationSchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, search } = query;

  const where = search ? {
    OR: [
      { title: { contains: search, mode: 'insensitive' as const } },
      { slug: { contains: search, mode: 'insensitive' as const } },
      { genre: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy || 'createdAt']: sortOrder },
      include: {
        gameplayMechanics: true,
        storeLinks: true
      }
    }),
    prisma.game.count({ where })
  ]);

  res.json({
    games,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}));

router.get('/public', asyncHandler(async (req, res) => {
  const query = paginationSchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, search } = query;

  const where: any = { published: true };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { genre: { contains: search, mode: 'insensitive' } },
      { tags: { hasSome: search.split(' ') } }
    ];
  }

  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy || 'createdAt']: sortOrder },
      include: {
        gameplayMechanics: true,
        storeLinks: true
      }
    }),
    prisma.game.count({ where })
  ]);

  res.json({
    games,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}));

router.get('/featured', asyncHandler(async (_req, res) => {
  const games = await prisma.game.findMany({
    where: { published: true, featured: true },
    orderBy: { featuredOrder: 'asc' },
    include: {
      gameplayMechanics: true,
      storeLinks: true
    }
  });
  res.json({ games });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const game = await prisma.game.findUnique({
    where: { id: req.params.id },
    include: {
      gameplayMechanics: true,
      storeLinks: true
    }
  });

  if (!game) {
    throw new AppError(404, 'Game not found');
  }

  res.json({ game });
}));

router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const game = await prisma.game.findUnique({
    where: { slug: req.params.slug },
    include: {
      gameplayMechanics: true,
      storeLinks: true
    }
  });

  if (!game) {
    throw new AppError(404, 'Game not found');
  }

  res.json({ game });
}));

router.post('/', authMiddleware, requirePermission('games:create'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = gameSchema.parse(req.body);

  const existing = await prisma.game.findUnique({ where: { slug: data.slug } });
  if (existing) {
    throw new AppError(409, 'Slug already exists');
  }

  const game = await prisma.game.create({
    data: {
      ...data,
      gameplayMechanics: data.gameplayMechanics ? { create: data.gameplayMechanics as any } : undefined,
      storeLinks: data.storeLinks ? { create: data.storeLinks as any } : undefined
    },
    include: {
      gameplayMechanics: true,
      storeLinks: true
    }
  });

  const logger = createActivityLogger(req);
  logger('CREATE_GAME', 'game', game.id, { title: game.title, slug: game.slug });

  res.status(201).json({ game });
}));

router.patch('/:id', authMiddleware, requirePermission('games:update'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = gameUpdateSchema.parse(req.body);

  const existing = await prisma.game.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Game not found');
  }

  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.game.findUnique({ where: { slug: data.slug } });
    if (slugExists) {
      throw new AppError(409, 'Slug already exists');
    }
  }

  const updateData: any = { ...data };
  if (data.gameplayMechanics) {
    await prisma.gameplayMechanic.deleteMany({ where: { gameId: id } });
    updateData.gameplayMechanics = { create: data.gameplayMechanics };
    delete updateData.gameplayMechanics;
  }
  if (data.storeLinks) {
    await prisma.storeLink.deleteMany({ where: { gameId: id } });
    updateData.storeLinks = { create: data.storeLinks };
    delete updateData.storeLinks;
  }

  const game = await prisma.game.update({
    where: { id },
    data: updateData,
    include: {
      gameplayMechanics: true,
      storeLinks: true
    }
  });

  const logger = createActivityLogger(req);
  logger('UPDATE_GAME', 'game', game.id, { title: game.title, changes: Object.keys(data) });

  res.json({ game });
}));

router.delete('/:id', authMiddleware, requirePermission('games:delete'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.game.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Game not found');
  }

  await prisma.game.delete({ where: { id } });

  const logger = createActivityLogger(req);
  logger('DELETE_GAME', 'game', id, { title: existing.title });

  res.json({ success: true });
}));

router.post('/:id/publish', authMiddleware, requirePermission('games:publish'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { published } = z.object({ published: z.boolean() }).parse(req.body);

  const game = await prisma.game.update({
    where: { id },
    data: {
      published,
      publishedAt: published ? new Date() : null
    }
  });

  const logger = createActivityLogger(req);
  logger(published ? 'PUBLISH_GAME' : 'UNPUBLISH_GAME', 'game', game.id, { title: game.title });

  res.json({ game });
}));

router.post('/:id/featured', authMiddleware, requirePermission('games:featured'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { featured, featuredOrder } = z.object({
    featured: z.boolean(),
    featuredOrder: z.number().int().positive().optional()
  }).parse(req.body);

  if (featured) {
    const maxOrder = await prisma.game.aggregate({
      where: { featured: true },
      _max: { featuredOrder: true }
    });
    const order = featuredOrder || (maxOrder._max.featuredOrder || 0) + 1;

    await prisma.game.update({
      where: { id },
      data: { featured: true, featuredOrder: order }
    });
  } else {
    await prisma.game.update({
      where: { id },
      data: { featured: false, featuredOrder: null }
    });
  }

  const logger = createActivityLogger(req);
  logger(featured ? 'FEATURE_GAME' : 'UNFEATURE_GAME', 'game', id, { featuredOrder });

  res.json({ success: true });
}));

router.post('/reorder-featured', authMiddleware, requirePermission('games:featured'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { gameIds } = z.object({ gameIds: z.array(z.string().cuid()) }).parse(req.body);

  await prisma.$transaction(
    gameIds.map((id, index) =>
      prisma.game.update({
        where: { id },
        data: { featuredOrder: index + 1 }
      })
    )
  );

  const logger = createActivityLogger(req);
  logger('REORDER_FEATURED', 'game', undefined, { gameIds });

  res.json({ success: true });
}));

router.post('/:id/duplicate', authMiddleware, requirePermission('games:create'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const original = await prisma.game.findUnique({
    where: { id },
    include: { gameplayMechanics: true, storeLinks: true }
  });

  if (!original) {
    throw new AppError(404, 'Game not found');
  }

  const baseSlug = original.slug.replace(/-\d+$/, '');
  let newSlug = `${baseSlug}-copy`;
  let counter = 1;
  while (await prisma.game.findUnique({ where: { slug: newSlug } })) {
    newSlug = `${baseSlug}-copy-${counter++}`;
  }

  const game = await prisma.game.create({
    data: {
      slug: newSlug,
      title: `${original.title} (Copy)`,
      subtitle: original.subtitle,
      genre: original.genre,
      categories: original.categories,
      rating: original.rating,
      price: original.price,
      salePrice: original.salePrice,
      currency: original.currency,
      isFree: original.isFree,
      platforms: original.platforms,
      status: original.status,
      releaseYear: original.releaseYear,
      description: original.description,
      longDescription: original.longDescription,
      heroImage: original.heroImage,
      secondaryImage: original.secondaryImage,
      screenshots: original.screenshots,
      trailerUrl: original.trailerUrl,
      tags: original.tags,
      features: original.features,
      devStory: original.devStory,
      awards: original.awards,
      featured: false,
      published: false,
      gameplayMechanics: { create: original.gameplayMechanics },
      storeLinks: { create: original.storeLinks }
    },
    include: {
      gameplayMechanics: true,
      storeLinks: true
    }
  });

  const logger = createActivityLogger(req);
  logger('DUPLICATE_GAME', 'game', game.id, { originalId: id, title: game.title });

  res.status(201).json({ game });
}));

export default router;