import {
  AccountOrder,
  AccountReview,
  ContactPageData,
  GalleryPageData,
  JourneyPost,
  MenuItem,
  MenuPageData,
  ReviewsPageData,
  SiteSettings,
  UserProfile,
} from "@/types";
import { mockSiteSettings } from "../mock/settings";
import { mockContactPageData } from "../mock/contact";
import {
  FounderDetails,
  StatItem,
  mockAboutStats,
  mockFounderDetails,
} from "../mock/about";
import { mockJourneyPosts } from "../mock/journey";
import { MilestoneStat, mockMilestones } from "../mock/milestones";
import {
  mockBotiData,
  mockFeaturedItems,
  mockMenuCategories,
  mockMenuItems,
  mockMenuTabs,
  mockPlatterData,
  mockSideItems,
} from "../mock/menu";
import {
  mockGalleryImages as mockReviewGalleryImages,
  mockReviewCategories,
  mockReviewFeatured,
  mockReviewHighlights,
  mockReviews,
  mockReviewStatistics,
  mockReviewsCta,
  mockReviewsHero,
  mockVideoReviews,
} from "../mock/reviews";
import {
  GalleryItem,
  mockCustomerStories,
  mockGalleryCategories,
  mockGalleryCta,
  mockGalleryHero,
  mockGalleryImages,
  mockGalleryItems,
  mockGalleryTabs,
  mockGoogleReviews,
  mockInstagramPosts,
  mockJourneyMilestones,
  mockKitchenProcesses,
  mockVideoTestimonials,
} from "../mock/gallery";
import { mockAccountOrders, mockDemoProfile, mockMyReviews } from "../mock/accounts";

export interface AdminAboutData {
  founder: FounderDetails;
  stats: StatItem[];
  journeyPosts: JourneyPost[];
  milestones: MilestoneStat[];
}

export interface AdminOrdersData {
  profile: UserProfile | null;
  orders: AccountOrder[];
  reviews: AccountReview[];
  menuItems: MenuItem[];
}

export interface GallerySliceData {
  pageData: GalleryPageData;
  galleryItems: GalleryItem[];
}

export interface Database {
  settings: SiteSettings;
  menu: MenuPageData;
  reviews: ReviewsPageData;
  gallery: GallerySliceData;
  contact: ContactPageData;
  about: AdminAboutData;
  orders: AdminOrdersData;
}

export const db: Database = {
  settings: mockSiteSettings,
  menu: {
    categories: mockMenuCategories,
    items: mockMenuItems,
    tabs: mockMenuTabs,
    featured: mockFeaturedItems,
    platter: mockPlatterData,
    boti: mockBotiData,
    sides: mockSideItems,
  },
  reviews: {
    hero: mockReviewsHero,
    statistics: mockReviewStatistics,
    categories: mockReviewCategories,
    featured: mockReviewFeatured,
    highlights: mockReviewHighlights,
    reviews: mockReviews.filter((review) => review.is_approved),
    videos: mockVideoReviews,
    gallery: mockReviewGalleryImages,
    cta: mockReviewsCta,
  },
  gallery: {
    pageData: {
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
    },
    galleryItems: mockGalleryItems,
  },
  contact: mockContactPageData,
  about: {
    founder: mockFounderDetails,
    stats: mockAboutStats,
    journeyPosts: mockJourneyPosts,
    milestones: mockMilestones,
  },
  orders: {
    profile: mockDemoProfile,
    orders: mockAccountOrders,
    reviews: mockMyReviews,
    menuItems: mockMenuItems,
  },
};
