import { api } from './client';
import {
  GalleryImage,
  GalleryPageData,
  VideoTestimonial,
  InstagramPost,
  GoogleReview,
  CustomerStory,
  KitchenProcess,
  JourneyMilestone,
} from '@/types';

export interface GalleryPageConfig {
  hero?: unknown;
  tabs?: unknown;
  galleryCategories?: unknown;
  cta?: unknown;
}

type CreateUpdate<T> = Partial<T>;
type CrudService<T> = {
  getAll: () => Promise<T[]>;
  create: (data: CreateUpdate<T>) => Promise<T>;
  getById: (id: string) => Promise<T>;
  update: (id: string, data: CreateUpdate<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
};

function crudFor<T>(path: string, singularName: string): CrudService<T> {
  void singularName;
  return {
    getAll: () => api.get<T[]>(`/gallery/${path}`),
    create: (data) => api.post<T>(`/gallery/${path}`, data),
    getById: (id) => api.get<T>(`/gallery/${path}/${id}`),
    update: (id, data) => api.patch<T>(`/gallery/${path}/${id}`, data),
    delete: (id) => api.delete<void>(`/gallery/${path}/${id}`),
  };
}

export const galleryService = {
  getPageData(): Promise<GalleryPageData> {
    return api.get<GalleryPageData>('/gallery/page-data');
  },

  getPageConfig(): Promise<GalleryPageConfig> {
    return api.get<GalleryPageConfig>('/gallery/page-config');
  },

  updatePageConfig(data: Partial<GalleryPageConfig>): Promise<GalleryPageConfig> {
    return api.patch<GalleryPageConfig>('/gallery/page-config', data);
  },

  images: crudFor<GalleryImage>('images', 'Gallery Image'),
  videos: crudFor<VideoTestimonial>('videos', 'Video Testimonial'),
  instagram: crudFor<InstagramPost>('instagram', 'Instagram Post'),
  googleReviews: crudFor<GoogleReview>('google-reviews', 'Google Review'),
  customerStories: crudFor<CustomerStory>('customer-stories', 'Customer Story'),
  kitchenProcesses: crudFor<KitchenProcess>('kitchen-processes', 'Kitchen Process'),
  journeyMilestones: crudFor<JourneyMilestone>('journey-milestones', 'Journey Milestone'),
};
