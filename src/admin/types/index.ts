export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  genre: string;
  categories: string[];
  rating: number | null;
  price: string;
  salePrice: string | null;
  currency: string;
  isFree: boolean;
  platforms: string[];
  status: 'IN_DEVELOPMENT' | 'EARLY_ACCESS' | 'WISHLIST_NOW' | 'AVAILABLE_NOW';
  releaseYear: string;
  description: string;
  longDescription: string;
  heroImage: string | null;
  secondaryImage: string | null;
  screenshots: string[];
  trailerUrl: string | null;
  tags: string[];
  features: string[];
  devStory: string;
  awards: string[];
  featured: boolean;
  featuredOrder: number | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  gameplayMechanics: GameplayMechanic[];
  storeLinks: StoreLink[];
}

export interface GameplayMechanic {
  id: string;
  gameId: string;
  title: string;
  description: string;
}

export interface StoreLink {
  id: string;
  gameId: string;
  name: string;
  url: string;
  badge: string | null;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  categoryId: string;
  category: Category;
  authorName: string;
  authorRole: string;
  authorImage: string | null;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  _count?: { newsPosts: number };
}

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  interests: string[];
  status: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED';
  subscribedAt: string;
  unsubscribedAt: string | null;
  source: string;
  metadata: Record<string, unknown> | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  projectType: string;
  budget: string | null;
  message: string;
  status: 'UNREAD' | 'REVIEWED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'FULL_TIME' | 'CONTRACT' | 'FREELANCE' | 'REMOTE_HYBRID';
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  perks: string[];
  status: 'OPEN' | 'CLOSED';
  postedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteContent {
  id: string;
  key: string;
  value: unknown;
  section: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminActivity {
  id: string;
  adminUserId: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  adminUser: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface DashboardStats {
  totalGames: number;
  publishedGames: number;
  draftGames: number;
  totalUsers: number;
  subscribers: number;
  totalNews: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}