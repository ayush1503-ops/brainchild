import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authMiddleware, AuthRequest, requirePermission } from '../middleware/auth.js';
import { logActivity, createActivityLogger } from '../services/activity.js';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760');
const ALLOWED_MIME_TYPES = (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(',');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${randomUUID()}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, `File type not allowed. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

const router = Router();

router.post('/image', authMiddleware, requirePermission('upload:create'), upload.single('image'), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new AppError(400, 'No file uploaded');
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  const logger = createActivityLogger(req);
  logger('UPLOAD_IMAGE', 'upload', req.file.filename, {
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  });

  res.json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
}));

router.post('/images', authMiddleware, requirePermission('upload:create'), upload.array('images', 10), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError(400, 'No files uploaded');
  }

  const files = (req.files as Express.Multer.File[]).map(file => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype
  }));

  const logger = createActivityLogger(req);
  logger('UPLOAD_IMAGES', 'upload', undefined, { count: files.length });

  res.json({ files });
}));

router.delete('/:filename', authMiddleware, requirePermission('upload:delete'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(UPLOAD_DIR, filename);

  if (!fs.existsSync(filePath)) {
    throw new AppError(404, 'File not found');
  }

  fs.unlinkSync(filePath);

  const logger = createActivityLogger(req);
  logger('DELETE_UPLOAD', 'upload', filename);

  res.json({ success: true });
}));

export default router;