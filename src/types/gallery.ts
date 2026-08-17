export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  tag: string;
}

export type GalleryTabId = "customers" | "behind-scenes" | "journey" | "gallery";

export type GalleryTabIcon = "users" | "chef-hat" | "flame" | "camera";

export interface GalleryTab {
  id: GalleryTabId;
  sectionId: string;
  label: string;
  shortLabel: string;
  title: string;
  description: string;
  icon: GalleryTabIcon;
}

export type GalleryCategoryId = "food" | "grill" | "customers" | "atmosphere";

export interface GalleryCategoryFilter {
  id: GalleryCategoryId | "all";
  label: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  location: string;
  category: GalleryCategoryId;
  alt: string;
  tag?: string;
}

export interface VideoTestimonial {
  id: string;
  customer_name: string;
  title: string;
  duration: string;
  thumbnail: string;
  source: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  tag: string;
  likes: number;
  comments: number;
}

export interface GoogleReview {
  id: string;
  customer_name: string;
  rating: number;
  visit_date: string;
  review_text: string;
  verified: boolean;
  source: string;
}

export interface CustomerVisit {
  year: string;
  label: string;
  note: string;
}

export interface CustomerStory {
  id: string;
  customer_name: string;
  imageUrl: string;
  favorite_meal: string;
  years_visiting: number;
  visits: number;
  quote: string;
  timeline: CustomerVisit[];
}

export interface KitchenProcess {
  id: string;
  step: number;
  title: string;
  imageUrl: string;
  story: string;
  fact: string;
  time: string;
}

export type JourneyType =
  | "milestone"
  | "achievement"
  | "challenge"
  | "lesson"
  | "future";

export interface JourneyMilestone {
  id: string;
  year: string;
  title: string;
  imageUrl: string;
  story: string;
  badge: string;
  type: JourneyType;
  stat?: { value: number; suffix: string; label: string };
}

export interface GalleryHeroData {
  label: string;
  titleLead: string;
  titleMid: string;
  titleAccent: string;
  description: string;
  imageUrl: string;
}

export interface GalleryCtaData {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  imageUrl: string;
}

export interface GalleryPageData {
  hero: GalleryHeroData;
  tabs: GalleryTab[];
  videos: VideoTestimonial[];
  instagram: InstagramPost[];
  googleReviews: GoogleReview[];
  stories: CustomerStory[];
  kitchen: KitchenProcess[];
  journey: JourneyMilestone[];
  gallery: GalleryImage[];
  galleryCategories: GalleryCategoryFilter[];
  cta: GalleryCtaData;
}
