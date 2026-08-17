import { GalleryImage } from "./gallery";

export type ReviewSource = "Google" | "Instagram" | "Direct";

export type ReviewCategory =
  | "Families"
  | "Friends"
  | "Corporate"
  | "Birthday"
  | "Couples";

export interface CustomerReview {
  id: string;
  customer_name: string;
  location: string;
  rating: number;
  title: string;
  review_text: string;
  source: ReviewSource;
  category: ReviewCategory;
  visit_date: string;
  favorite_meal: string;
  verified: boolean;
  helpful_count: number;
  image_url: string;
  customerImageUrl?: string;
  is_approved: boolean;
}

export type StatisticIcon = "star" | "users" | "repeat" | "thumbs-up";

export interface Statistic {
  id: string;
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  icon: StatisticIcon;
}

export interface ReviewCategoryFilter {
  id: string;
  label: string;
}

export interface VideoReview {
  id: string;
  customer_name: string;
  title: string;
  duration: string;
  thumbnail: string;
  category: ReviewCategory;
}

export interface ReviewsHeroData {
  label: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  imageUrl: string;
}

export interface ReviewsCtaData {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  imageUrl: string;
}

export interface ReviewsPageData {
  hero: ReviewsHeroData;
  statistics: Statistic[];
  categories: ReviewCategoryFilter[];
  featured: CustomerReview;
  highlights: CustomerReview[];
  reviews: CustomerReview[];
  videos: VideoReview[];
  gallery: GalleryImage[];
  cta: ReviewsCtaData;
}
