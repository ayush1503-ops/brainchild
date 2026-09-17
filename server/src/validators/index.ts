import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const registerAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).optional()
});

export const gameSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(200).optional(),
  genre: z.string().min(1).max(100),
  categories: z.array(z.string()).default(['Indie']),
  rating: z.number().min(0).max(5).optional(),
  price: z.string().max(50).default('Wishlist free'),
  salePrice: z.string().max(50).optional(),
  currency: z.string().length(3).default('INR'),
  isFree: z.boolean().default(false),
  platforms: z.array(z.string()).default(['PC (Steam)']),
  status: z.enum(['IN_DEVELOPMENT', 'EARLY_ACCESS', 'WISHLIST_NOW', 'AVAILABLE_NOW']).default('IN_DEVELOPMENT'),
  releaseYear: z.string().max(20).default('2027'),
  description: z.string().min(1),
  longDescription: z.string().optional(),
  heroImage: z.string().url().optional().nullable(),
  secondaryImage: z.string().url().optional().nullable(),
  screenshots: z.array(z.string().url()).default([]),
  trailerUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  gameplayMechanics: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).default([]),
  devStory: z.string().optional(),
  storeLinks: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    badge: z.string().optional()
  })).default([]),
  awards: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  featuredOrder: z.number().int().positive().optional(),
  published: z.boolean().default(false)
});

export const gameUpdateSchema = gameSchema.partial();

export const newsSchema = z.object({
  slug: z.string().min(1).max(150).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(300),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  coverImage: z.string().url().optional().nullable(),
  categoryId: z.string().cuid(),
  authorName: z.string().max(100).default('Studio Team'),
  authorRole: z.string().max(100).default('Editor'),
  authorImage: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  featured: z.boolean().default(false)
});

export const newsUpdateSchema = newsSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#6C4CF1')
});

export const subscriberSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
  interests: z.array(z.string()).default([]),
  source: z.string().max(50).default('website')
});

export const contentSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.unknown(),
  section: z.string().min(1).max(50)
});

export const jobSchema = z.object({
  title: z.string().min(1).max(200),
  department: z.string().min(1).max(100),
  location: z.string().min(1).max(200),
  type: z.enum(['FULL_TIME', 'CONTRACT', 'FREELANCE', 'REMOTE_HYBRID']).default('FULL_TIME'),
  experience: z.string().min(1).max(50),
  description: z.string().min(1),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  niceToHave: z.array(z.string()).default([]),
  perks: z.array(z.string()).default([]),
  status: z.enum(['OPEN', 'CLOSED']).default('OPEN'),
  postedDate: z.string().max(50)
});

export const contactUpdateSchema = z.object({
  status: z.enum(['UNREAD', 'REVIEWED', 'ARCHIVED'])
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional()
});