import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const accessToken = response.data.accessToken;
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me'),
  register: (email: string, password: string, name?: string, role?: string) =>
    api.post('/auth/register', { email, password, name, role }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword })
};

export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data: any) => api.post('/settings', data),
  exportBackup: () => api.get('/settings/backup')
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getAdmins: () => api.get('/admin/admins'),
  createAdmin: (data: { email: string; password: string; name: string; role?: string }) =>
    api.post('/admin/admins', data),
  updateAdmin: (id: string, data: { name?: string; role?: string; isActive?: boolean }) =>
    api.patch(`/admin/admins/${id}`, data),
  deleteAdmin: (id: string) => api.delete(`/admin/admins/${id}`)
};

export const gamesApi = {
  getAll: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string; status?: string }) =>
    api.get('/games', { params }),
  getPublic: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string; status?: string }) =>
    api.get('/games/public', { params }),
  getFeatured: () => api.get('/games/featured'),
  getById: (id: string) => api.get(`/games/${id}`),
  getBySlug: (slug: string) => api.get(`/games/slug/${slug}`),
  create: (data: any) => api.post('/games', data),
  update: (id: string, data: any) => api.patch(`/games/${id}`, data),
  delete: (id: string) => api.delete(`/games/${id}`),
  publish: (id: string, published: boolean) => api.post(`/games/${id}/publish`, { published }),
  featured: (id: string, featured: boolean, featuredOrder?: number) =>
    api.post(`/games/${id}/featured`, { featured, featuredOrder }),
  reorderFeatured: (gameIds: string[]) => api.post('/games/reorder-featured', { gameIds }),
  duplicate: (id: string) => api.post(`/games/${id}/duplicate`)
};

export const newsApi = {
  getAll: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string; status?: string }) =>
    api.get('/news', { params }),
  getPublic: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string; status?: string }) =>
    api.get('/news/public', { params }),
  getFeatured: () => api.get('/news/featured'),
  getById: (id: string) => api.get(`/news/${id}`),
  getBySlug: (slug: string) => api.get(`/news/slug/${slug}`),
  create: (data: any) => api.post('/news', data),
  update: (id: string, data: any) => api.patch(`/news/${id}`, data),
  delete: (id: string) => api.delete(`/news/${id}`),
  publish: (id: string, published: boolean) => api.post(`/news/${id}/publish`, { published }),
  featured: (id: string, featured: boolean) => api.post(`/news/${id}/featured`, { featured })
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: { name: string; slug?: string; color?: string }) => api.post('/categories', data),
  update: (id: string, data: { name?: string; slug?: string; color?: string }) => api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`)
};

export const subscribersApi = {
  getAll: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string; status?: string }) =>
    api.get('/subscribers', { params }),
  create: (data: { email: string; name?: string; interests?: string[]; source?: string }) => api.post('/subscribers', data),
  exportCsv: () => api.get('/subscribers/export/csv', { responseType: 'blob' }),
  exportJson: () => api.get('/subscribers/export/json'),
  delete: (id: string) => api.delete(`/subscribers/${id}`),
  unsubscribe: (id: string) => api.post(`/subscribers/${id}/unsubscribe`)
};

export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string }) =>
    api.get('/users', { params }),
  getStats: () => api.get('/users/stats'),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: { name?: string; role?: string; isActive?: boolean }) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`)
};

export const contentApi = {
  getAll: () => api.get('/content'),
  getByKey: (key: string) => api.get(`/content/${key}`),
  create: (data: { key: string; value: unknown; section: string }) => api.post('/content', data),
  update: (key: string, data: { value?: unknown; section?: string }) => api.patch(`/content/${key}`, data),
  delete: (key: string) => api.delete(`/content/${key}`),
  bulkUpdate: (items: Array<{ key: string; value: unknown; section: string }>) => api.post('/content/bulk', items)
};

export const jobsApi = {
  getAll: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string }) =>
    api.get('/jobs', { params }),
  getAdmin: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string }) =>
    api.get('/jobs/admin', { params }),
  getById: (id: string) => api.get(`/jobs/${id}`),
  create: (data: any) => api.post('/jobs', data),
  update: (id: string, data: any) => api.patch(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`)
};

export const contactsApi = {
  getAll: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string }) =>
    api.get('/contacts', { params }),
  create: (data: any) => api.post('/contacts', data),
  getById: (id: string) => api.get(`/contacts/${id}`),
  update: (id: string, data: { status: 'UNREAD' | 'REVIEWED' | 'ARCHIVED' }) => api.patch(`/contacts/${id}`, data),
  delete: (id: string) => api.delete(`/contacts/${id}`)
};

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (filename: string) => api.delete(`/upload/${filename}`)
};

export const activityApi = {
  getAll: (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string }) =>
    api.get('/activity', { params }),
  getStats: () => api.get('/activity/stats'),
  getRecent: () => api.get('/activity/recent')
};