import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export interface ActivityLogInput {
  adminUserId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity(input: ActivityLogInput): Promise<void> {
  try {
    await prisma.adminActivity.create({
      data: {
        adminUserId: input.adminUserId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: (input.metadata as any) || undefined,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export function createActivityLogger(req: AuthRequest) {
  return (action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>) => {
    logActivity({
      adminUserId: req.admin!.id,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
  };
}

export async function getRecentActivity(limit = 20) {
  return prisma.adminActivity.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      adminUser: {
        select: { id: true, name: true, email: true }
      }
    }
  });
}

export async function getActivityStats() {
  const [total, today, thisWeek] = await Promise.all([
    prisma.adminActivity.count(),
    prisma.adminActivity.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.adminActivity.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })
  ]);

  const byAction = await prisma.adminActivity.groupBy({
    by: ['action'],
    _count: { action: true },
    orderBy: { _count: { action: 'desc' } },
    take: 10
  });

  return { total, today, thisWeek, byAction };
}