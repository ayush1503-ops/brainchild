import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, requirePermission } from '../middleware/auth.js';
import { contentSchema } from '../validators/index.js';
import { logActivity, createActivityLogger } from '../services/activity.js';
import { z } from 'zod';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const content = await prisma.websiteContent.findMany({
    orderBy: { section: 'asc' }
  });
  res.json({ content });
}));

router.get('/:key', asyncHandler(async (req, res) => {
  const item = await prisma.websiteContent.findUnique({
    where: { key: req.params.key }
  });

  if (!item) {
    throw new AppError(404, 'Content not found');
  }

  res.json({ content: item });
}));

router.post('/', authMiddleware, requirePermission('content:update'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = contentSchema.parse(req.body);

  const existing = await prisma.websiteContent.findUnique({ where: { key: data.key } });

  let content;
  if (existing) {
    content = await prisma.websiteContent.update({
      where: { key: data.key },
      data: { value: data.value as any, section: data.section }
    });
  } else {
    content = await prisma.websiteContent.create({ data: data as any });
  }

  const logger = createActivityLogger(req);
  logger(existing ? 'UPDATE_CONTENT' : 'CREATE_CONTENT', 'website_content', content.id, { key: content.key });

  res.status(existing ? 200 : 201).json({ content });
}));

router.patch('/:key', authMiddleware, requirePermission('content:update'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { key } = req.params;
  const data = contentSchema.partial().parse(req.body);

  const content = await prisma.websiteContent.update({
    where: { key },
    data: data as any
  });

  const logger = createActivityLogger(req);
  logger('UPDATE_CONTENT', 'website_content', content.id, data);

  res.json({ content });
}));

router.delete('/:key', authMiddleware, requirePermission('content:update'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { key } = req.params;

  await prisma.websiteContent.delete({ where: { key } });

  const logger = createActivityLogger(req);
  logger('DELETE_CONTENT', 'website_content', key);

  res.json({ success: true });
}));

router.post('/bulk', authMiddleware, requirePermission('content:update'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const schema = z.array(contentSchema);
  const items = schema.parse(req.body);

  const results = await prisma.$transaction(
    items.map(item =>
      prisma.websiteContent.upsert({
        where: { key: item.key },
        update: { value: item.value as any, section: item.section },
        create: item as any
      })
    )
  );

  const logger = createActivityLogger(req);
  logger('BULK_UPDATE_CONTENT', 'website_content', undefined, { keys: items.map(i => i.key) });

  res.json({ content: results });
}));

export default router;