export interface CateringEventType {
  id: string;
  title: string;
  description: string;
  capacity: string;
  icon: "utensils" | "building" | "cake" | "graduation";
}

export interface CateringHeroData {
  label: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  imageUrl: string;
}

export interface CateringCtaData {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  imageUrl: string;
}

export interface CateringPageData {
  hero: CateringHeroData;
  eventTypes: CateringEventType[];
  menuComingSoon: boolean;
  cta: CateringCtaData;
}
