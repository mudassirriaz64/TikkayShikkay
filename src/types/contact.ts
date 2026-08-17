export type ContactAccent = "whatsapp" | "orange" | "peach" | "gold";

export interface ContactMethod {
  id: string;
  icon: "whatsapp" | "phone" | "map-pin";
  accent: ContactAccent;
  title: string;
  value: string;
  helper: string;
  href: string;
}

export interface OpeningDay {
  id: string;
  day: string;
  hours: string;
  isClosed?: boolean;
}

export interface MapDetails {
  restaurantName: string;
  description: string;
  address: string;
  mapsUrl: string;
}

export interface ContactHeroData {
  label: string;
  titleLead: string;
  titleAccent: string;
  availability: string;
}

export interface ContactFormData {
  heading: string;
  accent: string;
  description: string;
  responseTime: string;
}

export interface CateringData {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  menuLabel: string;
  quoteLabel: string;
  imageUrl: string;
  image_public_id?: string;
}

export interface FranchiseData {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  placeholder: string;
  notifyLabel: string;
  portalLabel: string;
}

export interface ContactPageData {
  hero: ContactHeroData;
  methods: ContactMethod[];
  openingHours: OpeningDay[];
  map: MapDetails;
  form: ContactFormData;
  catering: CateringData;
  franchise: FranchiseData;
}
