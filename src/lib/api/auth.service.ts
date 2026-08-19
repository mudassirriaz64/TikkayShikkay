import { api } from './client';

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  is_loyalty_member?: boolean;
  loyalty_joined_at?: string;
  loyalty_points?: number;
  birthday?: string;
  whatsapp_opt_in?: boolean;
  createdAt?: string;
  updatedAt?: string;
  memberSince?: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export const authService = {
  register(data: RegisterInput): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
    return api.post<{ user: AuthUser; accessToken: string; refreshToken: string }>('/auth/register', data);
  },

  login(data: LoginInput): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
    return api.post<{ user: AuthUser; accessToken: string; refreshToken: string }>('/auth/login', data);
  },

  logout(): Promise<void> {
    return api.post<void>('/auth/logout');
  },

  refreshAccessToken(refreshToken?: string): Promise<{ accessToken: string; refreshToken: string }> {
    const body = refreshToken ? { refreshToken } : undefined;
    return api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', body);
  },

  changePassword(data: ChangePasswordInput): Promise<void> {
    return api.post<void>('/auth/change-password', data);
  },

  forgotPassword(email: string): Promise<{ email?: string }> {
    return api.post<{ email?: string }>('/auth/forgot-password', { email });
  },

  resetPassword(data: { email: string; otp: string; newPassword: string }): Promise<void> {
    return api.post<void>('/auth/reset-password', data);
  },

  me(): Promise<AuthUser> {
    return api.get<AuthUser>('/auth/me');
  },
};
