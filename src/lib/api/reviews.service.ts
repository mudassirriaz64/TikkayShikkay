import { api } from './client';
import { CustomerReview, ReviewsPageData, Statistic, VideoReview } from '@/types';

export interface ReviewsPageConfig {
  hero?: unknown;
  cta?: unknown;
  categories?: unknown;
}

export const reviewsService = {
  getPageData(): Promise<ReviewsPageData> {
    return api.get<ReviewsPageData>('/reviews/page-data');
  },

  getApproved(): Promise<CustomerReview[]> {
    return api.get<CustomerReview[]>('/reviews');
  },

  create(data: Partial<CustomerReview>): Promise<CustomerReview> {
    return api.post<CustomerReview>('/reviews', data);
  },

  getPending(): Promise<CustomerReview[]> {
    return api.get<CustomerReview[]>('/reviews/pending');
  },

  approve(id: string): Promise<CustomerReview> {
    return api.patch<CustomerReview>(`/reviews/${id}/approve`);
  },

  update(id: string, data: Partial<CustomerReview>): Promise<CustomerReview> {
    return api.patch<CustomerReview>(`/reviews/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return api.delete<void>(`/reviews/${id}`);
  },

  getStatistics(): Promise<Statistic[]> {
    return api.get<Statistic[]>('/reviews/statistics');
  },

  createStatistic(data: Partial<Statistic>): Promise<Statistic> {
    return api.post<Statistic>('/reviews/statistics', data);
  },

  updateStatistic(id: string, data: Partial<Statistic>): Promise<Statistic> {
    return api.patch<Statistic>(`/reviews/statistics/${id}`, data);
  },

  deleteStatistic(id: string): Promise<void> {
    return api.delete<void>(`/reviews/statistics/${id}`);
  },

  getVideos(): Promise<VideoReview[]> {
    return api.get<VideoReview[]>('/reviews/videos');
  },

  createVideo(data: Partial<VideoReview>): Promise<VideoReview> {
    return api.post<VideoReview>('/reviews/videos', data);
  },

  updateVideo(id: string, data: Partial<VideoReview>): Promise<VideoReview> {
    return api.patch<VideoReview>(`/reviews/videos/${id}`, data);
  },

  deleteVideo(id: string): Promise<void> {
    return api.delete<void>(`/reviews/videos/${id}`);
  },

  getPageConfig(): Promise<ReviewsPageConfig> {
    return api.get<ReviewsPageConfig>('/reviews/page-config');
  },

  updatePageConfig(data: Partial<ReviewsPageConfig>): Promise<ReviewsPageConfig> {
    return api.patch<ReviewsPageConfig>('/reviews/page-config', data);
  },
};
