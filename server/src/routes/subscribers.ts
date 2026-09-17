import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, requirePermission } from '../middleware/auth.js';
import { subscriberSchema, paginationSchema } from '../validators/index.js';
import { logActivity, createActivityLogger } from '../services/activity.js';
import { z } from 'zod';

const router = Router();

router.get('/', authMiddleware, requirePermission('subscribers:read'), asyncHandler(async (req, res) => {
  const query = paginationSchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, search } = query;

  const where = search ? {
    OR: [
      { email: { contains: search, mode: 'insensitive' as const } },
      { name: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [subscribers, total] = await Promise.all([
    prisma.subscriber.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy || 'subscribedAt']: sortOrder }
    }),
    prisma.subscriber.count({ where })
  ]);

  res.json({
    subscribers,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}));

router.post('/', asyncHandler(async (req, res) => {
  const data = subscriberSchema.parse(req.body);

  const existing = await prisma.subscriber.findUnique({
    where: { email: data.email.toLowerCase() }
  });

  if (existing) {
    if (existing.status === 'UNSUBSCRIBED') {
      await prisma.subscriber.update({
        where: { id: existing.id },
        data: { status: 'ACTIVE', unsubscribedAt: null, interests: data.interests }
      });
    }
    res.json({ subscriber: existing, message: 'Already subscribed' });
    return;
  }

  const subscriber = await prisma.subscriber.create({
    data: { ...data, email: data.email.toLowerCase() }
  });

  res.status(201).json({ subscriber, message: 'Subscribed successfully' });
}));

router.get('/export/csv', authMiddleware, requirePermission('subscribers:export'), asyncHandler(async (_req, res) => {
  const subscribers = await prisma.subscriber.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { subscribedAt: 'desc' }
  });

  const headers = ['ID', 'Email', 'Name', 'Interests', 'Status', 'Subscribed At', 'Source'];
  const rows = subscribers.map(s => [
    s.id,
    s.email,
    s.name || '',
    s.interests.join('; '),
    s.status,
    s.subscribedAt.toISOString().split('T')[0],
    s.source
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=subscribers_${Date.now()}.csv`);
  res.send(csvContent);
}));

router.get('/export/json', authMiddleware, requirePermission('subscribers:export'), asyncHandler(async (_req, res) => {
  const subscribers = await prisma.subscriber.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { subscribedAt: 'desc' }
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=subscribers_${Date.now()}.json`);
  res.json(subscribers);
}));

router.delete('/:id', authMiddleware, requirePermission('subscribers:delete'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const subscriber = await prisma.subscriber.findUnique({ where: { id } });
  if (!subscriber) {
    throw new AppError(404, 'Subscriber not found');
  }

  await prisma.subscriber.delete({ where: { id } });

  const logger = createActivityLogger(req);
  logger('DELETE_SUBSCRIBER', 'subscriber', id, { email: subscriber.email });

  res.json({ success: true });
}));

router.post('/:id/unsubscribe', authMiddleware, requirePermission('subscribers:update'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const subscriber = await prisma.subscriber.update({
    where: { id },
    data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() }
  });

  const logger = createActivityLogger(req);
  logger('UNSUBSCRIBE', 'subscriber', id, { email: subscriber.email });

  res.json({ subscriber });
}));

export default router;