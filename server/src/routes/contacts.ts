import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, requirePermission } from '../middleware/auth.js';
import { contactUpdateSchema, paginationSchema } from '../validators/index.js';
import { logActivity, createActivityLogger } from '../services/activity.js';
import { z } from 'zod';

const router = Router();

router.get('/', authMiddleware, requirePermission('contacts:read'), asyncHandler(async (req, res) => {
  const query = paginationSchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, search } = query;

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } },
      { subject: { contains: search, mode: 'insensitive' as const } },
      { company: { contains: search, mode: 'insensitive' as const } }
    ];
  }

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy || 'createdAt']: sortOrder }
    }),
    prisma.contactMessage.count({ where })
  ]);

  res.json({
    messages,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}));

router.post('/', asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    company: z.string().max(100).optional(),
    subject: z.string().min(1).max(200),
    projectType: z.string().min(1).max(100),
    budget: z.string().max(50).optional(),
    message: z.string().min(1).max(5000)
  });
  const data = schema.parse(req.body);

  const message = await prisma.contactMessage.create({ data });

  res.status(201).json({ message });
}));

router.get('/:id', authMiddleware, requirePermission('contacts:read'), asyncHandler(async (req, res) => {
  const message = await prisma.contactMessage.findUnique({
    where: { id: req.params.id }
  });

  if (!message) {
    throw new AppError(404, 'Message not found');
  }

  res.json({ message });
}));

router.patch('/:id', authMiddleware, requirePermission('contacts:update'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = contactUpdateSchema.parse(req.body);

  const message = await prisma.contactMessage.update({
    where: { id },
    data
  });

  const logger = createActivityLogger(req);
  logger('UPDATE_CONTACT', 'contact_message', message.id, { status: data.status });

  res.json({ message });
}));

router.delete('/:id', authMiddleware, requirePermission('contacts:delete'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.contactMessage.delete({ where: { id } });

  const logger = createActivityLogger(req);
  logger('DELETE_CONTACT', 'contact_message', id);

  res.json({ success: true });
}));

export default router;