import { CustomerReview, ReviewsPageData } from "@/types";
import { reviewsService } from "@/lib/api/reviews.service";
import { tryOrFallback } from "@/lib/api/client";
import {
  mockReviews,
  mockReviewStatistics,
  mockReviewCategories,
  mockReviewFeatured,
  mockReviewHighlights,
  mockVideoReviews,
  mockGalleryImages,
  mockReviewsHero,
  mockReviewsCta,
} from "@/lib/mock/reviews";

const mockReviewsPageData: ReviewsPageData = {
  hero: mockReviewsHero,
  statistics: mockReviewStatistics,
  categories: mockReviewCategories,
  featured: mockReviewFeatured,
  highlights: mockReviewHighlights,
  reviews: mockReviews,
  videos: mockVideoReviews,
  gallery: mockGalleryImages,
  cta: mockReviewsCta,
};

export async function getReviews(): Promise<CustomerReview[]> {
  return tryOrFallback(
    () => reviewsService.getApproved(),
    mockReviews,
  );
}

export async function getReviewsPageData(): Promise<ReviewsPageData> {
  return tryOrFallback(
    () => reviewsService.getPageData(),
    mockReviewsPageData,
  );
}
