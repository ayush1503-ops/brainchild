import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, requirePermission } from '../middleware/auth.js';
import { loginSchema, registerAdminSchema } from '../validators/index.js';
import { logActivity, createActivityLogger } from '../services/activity.js';

const router = Router();

router.post('/login', asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = loginSchema.parse(req.body);

  const admin = await prisma.adminUser.findUnique({
    where: { email: data.email.toLowerCase() }
  });

  if (!admin || !admin.isActive) {
    throw new AppError(401, 'Invalid credentials');
  }

  const validPassword = await bcrypt.compare(data.password, admin.passwordHash);
  if (!validPassword) {
    throw new AppError(401, 'Invalid credentials');
  }

  const payload = { id: admin.id, email: admin.email, role: admin.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() }
  });

  await logActivity({
    adminUserId: admin.id,
    action: 'LOGIN',
    entityType: 'auth',
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  });
}));

router.post('/logout', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  await logActivity({
    adminUserId: req.admin!.id,
    action: 'LOGOUT',
    entityType: 'auth',
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
}));

router.post('/refresh', asyncHandler(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new AppError(401, 'Refresh token required');
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new AppError(401, 'Invalid refresh token');
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, role: true, isActive: true }
  });

  if (!admin || !admin.isActive) {
    throw new AppError(401, 'Admin not found or inactive');
  }

  const newPayload = { id: admin.id, email: admin.email, role: admin.role };
  const accessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({ success: true });
}));

router.get('/me', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const admin = await prisma.adminUser.findUnique({
    where: { id: req.admin!.id },
    select: { id: true, email: true, name: true, role: true, createdAt: true, lastLoginAt: true }
  });

  if (!admin) {
    throw new AppError(404, 'Admin not found');
  }

  res.json({ admin });
}));

router.post('/register', authMiddleware, requirePermission('admin:create'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = registerAdminSchema.parse(req.body);

  const existing = await prisma.adminUser.findUnique({
    where: { email: data.email.toLowerCase() }
  });

  if (existing) {
    throw new AppError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const admin = await prisma.adminUser.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: data.role || 'EDITOR'
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true }
  });

  const logger = createActivityLogger(req);
  logger('CREATE_ADMIN', 'admin_user', admin.id, { email: admin.email, role: admin.role });

  res.status(201).json({ admin });
}));

router.post('/change-password', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8)
  });
  const data = schema.parse(req.body);

  const admin = await prisma.adminUser.findUnique({
    where: { id: req.admin!.id }
  });

  if (!admin) {
    throw new AppError(404, 'Admin not found');
  }

  const valid = await bcrypt.compare(data.currentPassword, admin.passwordHash);
  if (!valid) {
    throw new AppError(401, 'Current password is incorrect');
  }

  const passwordHash = await bcrypt.hash(data.newPassword, 12);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash }
  });

  const logger = createActivityLogger(req);
  logger('CHANGE_PASSWORD', 'admin_user', admin.id);

  res.json({ message: 'Password changed successfully' });
}));

// Forgot Password - Generates a secure reset token
router.post('/forgot-password', asyncHandler(async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    email: z.string().email()
  });
  const { email } = schema.parse(req.body);

  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() }
  });

  // Always return success message even if admin doesn't exist to prevent email enumeration
  if (!admin || !admin.isActive) {
    res.json({ message: 'If that email is registered, password reset instructions have been created.' });
    return;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      adminUserId: admin.id,
      tokenHash,
      expiresAt
    }
  });

  await logActivity({
    adminUserId: admin.id,
    action: 'FORGOT_PASSWORD_REQUEST',
    entityType: 'auth',
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });

  // Return reset token in development mode for easy testing
  res.json({
    message: 'If that email is registered, password reset instructions have been created.',
    resetToken: process.env.NODE_ENV !== 'production' ? rawToken : undefined
  });
}));

// Reset Password - Accepts reset token and new password
router.post('/reset-password', asyncHandler(async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    token: z.string().min(1),
    newPassword: z.string().min(8)
  });
  const { token, newPassword } = schema.parse(req.body);

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { adminUser: true }
  });

  if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
    throw new AppError(400, 'Invalid or expired password reset token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.adminUser.update({
      where: { id: resetRecord.adminUserId },
      data: { passwordHash }
    }),
    prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() }
    })
  ]);

  await logActivity({
    adminUserId: resetRecord.adminUserId,
    action: 'RESET_PASSWORD_SUCCESS',
    entityType: 'auth',
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });

  res.json({ message: 'Password reset successful. You can now log in with your new password.' });
}));

export default router;