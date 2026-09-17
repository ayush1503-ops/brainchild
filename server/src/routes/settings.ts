import { Router, Response } from 'express';
import prisma from '../utils/prisma.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { superAdminOnly } from '../middleware/rbac.js';
import { createActivityLogger } from '../services/activity.js';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware, superAdminOnly);

// Get studio settings & security overview
router.get('/', asyncHandler(async (_req: AuthRequest, res: Response) => {
  const settings = await prisma.websiteContent.findMany({
    where: { section: 'settings' }
  });

  const settingsMap: Record<string, any> = {};
  settings.forEach((item) => {
    settingsMap[item.key] = item.value;
  });

  const [totalAdmins, totalGames, totalNews, totalSubscribers, recentLogs] = await Promise.all([
    prisma.adminUser.count(),
    prisma.game.count(),
    prisma.newsPost.count(),
    prisma.subscriber.count(),
    prisma.adminActivity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        adminUser: {
          select: { email: true, name: true, role: true }
        }
      }
    })
  ]);

  res.json({
    settings: {
      siteName: settingsMap['settings.siteName'] || 'Brainchild Games',
      contactEmail: settingsMap['settings.contactEmail'] || 'hello@brainchild.games',
      maintenanceMode: settingsMap['settings.maintenanceMode'] || false,
      enableRegistrations: settingsMap['settings.enableRegistrations'] || false,
      requireMfa: settingsMap['settings.requireMfa'] || false
    },
    systemOverview: {
      totalAdmins,
      totalGames,
      totalNews,
      totalSubscribers,
      databaseProvider: 'PostgreSQL / Relational',
      securityStatus: 'ACTIVE',
      lastBackupAt: new Date().toISOString()
    },
    recentLogs
  });
}));

// Update settings
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    siteName: z.string().min(1).max(100).optional(),
    contactEmail: z.string().email().optional(),
    maintenanceMode: z.boolean().optional(),
    enableRegistrations: z.boolean().optional(),
    requireMfa: z.boolean().optional()
  });

  const data = schema.parse(req.body);

  const updates = Object.entries(data).map(([key, val]) =>
    prisma.websiteContent.upsert({
      where: { key: `settings.${key}` },
      update: { value: val as any, section: 'settings' },
      create: { key: `settings.${key}`, value: val as any, section: 'settings' }
    })
  );

  await Promise.all(updates);

  const logger = createActivityLogger(req);
  logger('UPDATE_SETTINGS', 'settings', 'global', data);

  res.json({ success: true, message: 'Settings updated successfully' });
}));

// Database backup export endpoint
router.get('/backup', asyncHandler(async (req: AuthRequest, res: Response) => {
  const [games, news, categories, subscribers, websiteContent, jobs, adminUsers] = await Promise.all([
    prisma.game.findMany({ include: { storeLinks: true, gameplayMechanics: true } }),
    prisma.newsPost.findMany({ include: { category: true } }),
    prisma.category.findMany(),
    prisma.subscriber.findMany(),
    prisma.websiteContent.findMany(),
    prisma.job.findMany(),
    prisma.adminUser.findMany({
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true }
    })
  ]);

  const backupData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    exportedBy: req.admin?.email,
    data: {
      games,
      news,
      categories,
      subscribers,
      websiteContent,
      jobs,
      adminUsers
    }
  };

  const logger = createActivityLogger(req);
  logger('EXPORT_BACKUP', 'system', 'database');

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=brainchild_db_backup_${Date.now()}.json`);
  res.send(JSON.stringify(backupData, null, 2));
}));

export default router;
