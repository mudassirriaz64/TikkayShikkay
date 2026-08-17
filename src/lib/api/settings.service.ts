import { api } from './client';
import { SiteSettings } from '@/types';

export const settingsService = {
  get(): Promise<SiteSettings> {
    return api.get<SiteSettings>('/settings');
  },

  update(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    return api.patch<SiteSettings>('/settings', patch);
  },
};
