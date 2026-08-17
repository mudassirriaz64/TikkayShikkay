import { api } from './client';
import { JourneyPost, FounderDetails, StatItem, MilestoneStat } from '@/types';

export interface AboutPageData {
  hero: unknown;
  founder: FounderDetails;
  stats: StatItem[];
  journeyPosts: JourneyPost[];
  milestones: MilestoneStat[];
}

export interface AboutPageConfig {
  hero?: unknown;
}

export const aboutService = {
  getPageData(): Promise<AboutPageData> {
    return api.get<AboutPageData>('/about/page-data');
  },

  getPageConfig(): Promise<AboutPageConfig> {
    return api.get<AboutPageConfig>('/about/page-config');
  },

  updatePageConfig(data: Partial<AboutPageConfig>): Promise<AboutPageConfig> {
    return api.patch<AboutPageConfig>('/about/page-config', data);
  },

  getFounder(): Promise<FounderDetails> {
    return api.get<FounderDetails>('/about/founder');
  },

  updateFounder(data: Partial<FounderDetails>): Promise<FounderDetails> {
    return api.patch<FounderDetails>('/about/founder', data);
  },

  getStats(): Promise<StatItem[]> {
    return api.get<StatItem[]>('/about/stats');
  },

  createStat(data: Partial<StatItem>): Promise<StatItem> {
    return api.post<StatItem>('/about/stats', data);
  },

  getStat(id: string): Promise<StatItem> {
    return api.get<StatItem>(`/about/stats/${id}`);
  },

  updateStat(id: string, data: Partial<StatItem>): Promise<StatItem> {
    return api.patch<StatItem>(`/about/stats/${id}`, data);
  },

  deleteStat(id: string): Promise<void> {
    return api.delete<void>(`/about/stats/${id}`);
  },

  getMilestones(): Promise<MilestoneStat[]> {
    return api.get<MilestoneStat[]>('/about/milestones');
  },

  createMilestone(data: Partial<MilestoneStat>): Promise<MilestoneStat> {
    return api.post<MilestoneStat>('/about/milestones', data);
  },

  getMilestone(id: string): Promise<MilestoneStat> {
    return api.get<MilestoneStat>(`/about/milestones/${id}`);
  },

  updateMilestone(id: string, data: Partial<MilestoneStat>): Promise<MilestoneStat> {
    return api.patch<MilestoneStat>(`/about/milestones/${id}`, data);
  },

  deleteMilestone(id: string): Promise<void> {
    return api.delete<void>(`/about/milestones/${id}`);
  },

  getJourneyPosts(): Promise<JourneyPost[]> {
    return api.get<JourneyPost[]>('/about/journey-posts');
  },

  createJourneyPost(data: Partial<JourneyPost>): Promise<JourneyPost> {
    return api.post<JourneyPost>('/about/journey-posts', data);
  },

  getJourneyPost(id: string): Promise<JourneyPost> {
    return api.get<JourneyPost>(`/about/journey-posts/${id}`);
  },

  updateJourneyPost(id: string, data: Partial<JourneyPost>): Promise<JourneyPost> {
    return api.patch<JourneyPost>(`/about/journey-posts/${id}`, data);
  },

  deleteJourneyPost(id: string): Promise<void> {
    return api.delete<void>(`/about/journey-posts/${id}`);
  },
};
