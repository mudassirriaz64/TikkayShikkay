import { api } from './client';
import { AccountsPageData, AccountReview, UserProfile } from '@/types';
import type { AuthUser } from './auth.service';

export interface AdminUser extends AuthUser {
  id: string;
}

export const usersService = {
  getProfile(): Promise<UserProfile> {
    return api.get<UserProfile>('/users/profile');
  },

  updateProfile(patch: Partial<Pick<UserProfile, 'name' | 'phone' | 'address'>>): Promise<UserProfile> {
    return api.patch<UserProfile>('/users/profile', patch);
  },

  getAccountsPage(): Promise<AccountsPageData> {
    return api.get<AccountsPageData>('/users/accounts-page');
  },

  getFavorites(): Promise<string[]> {
    return api.get<string[]>('/users/favorites');
  },

  addToFavorites(itemId: string): Promise<void> {
    return api.post<void>('/users/favorites', { itemId });
  },

  toggleFavorite(itemId: string): Promise<void> {
    return api.post<void>('/users/favorites', { itemId, toggle: true });
  },

  getMyReviews(): Promise<AccountReview[]> {
    return api.get<AccountReview[]>('/users/my-reviews');
  },

  getAll(): Promise<AdminUser[]> {
    return api.get<AdminUser[]>('/users');
  },

  getById(id: string): Promise<AdminUser> {
    return api.get<AdminUser>(`/users/${id}`);
  },

  updateRole(id: string, role: 'user' | 'admin'): Promise<AdminUser> {
    return api.patch<AdminUser>(`/users/${id}`, { role });
  },

  delete(id: string): Promise<void> {
    return api.delete<void>(`/users/${id}`);
  },

  joinLoyalty(data: { birthday?: string; whatsapp_opt_in?: boolean }): Promise<{ user: AuthUser; whatsapp_community_url: string }> {
    return api.post<{ user: AuthUser; whatsapp_community_url: string }>('/users/loyalty/join', data);
  },

  getLoyaltyStatus(): Promise<{
    is_loyalty_member: boolean;
    loyalty_points: number;
    loyalty_joined_at?: string;
    birthday?: string;
    whatsapp_opt_in?: boolean;
    whatsapp_community_url: string;
  }> {
    return api.get('/users/loyalty/status');
  },

  getLoyaltyCount(): Promise<{ count: number; rawCount: number }> {
    return api.get<{ count: number; rawCount: number }>('/users/loyalty/count');
  },
};
