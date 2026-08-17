import { GalleryPageData } from "@/types";
import { galleryService } from "@/lib/api/gallery.service";
import { tryOrFallback } from "@/lib/api/client";
import {
  mockGalleryHero,
  mockGalleryTabs,
  mockVideoTestimonials,
  mockInstagramPosts,
  mockGoogleReviews,
  mockCustomerStories,
  mockKitchenProcesses,
  mockJourneyMilestones,
  mockGalleryImages,
  mockGalleryCategories,
  mockGalleryCta,
  mockGalleryItems,
} from "@/lib/mock/gallery";

const mockGalleryPageData: GalleryPageData = {
  hero: mockGalleryHero,
  tabs: mockGalleryTabs,
  videos: mockVideoTestimonials,
  instagram: mockInstagramPosts,
  googleReviews: mockGoogleReviews,
  stories: mockCustomerStories,
  kitchen: mockKitchenProcesses,
  journey: mockJourneyMilestones,
  gallery: mockGalleryImages,
  galleryCategories: mockGalleryCategories,
  cta: mockGalleryCta,
};

export async function getGalleryPageData(): Promise<GalleryPageData> {
  return tryOrFallback(
    () => galleryService.getPageData(),
    mockGalleryPageData,
  );
}

export async function getGalleryItems(): Promise<any[]> {
  return tryOrFallback(
    () => galleryService.images.getAll() as any,
    mockGalleryItems as any,
  );
}
