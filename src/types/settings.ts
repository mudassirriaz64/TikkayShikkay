export interface SiteSocials {
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface SiteAddress {
  street: string;
  city: string;
  full: string;
  mapsUrl: string;
}

export interface SiteContactInfo {
  whatsapp: string;
  phone: string;
  email: string;
}

export interface SiteSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_media_url: string;
  hero_media_public_id?: string;
  live_cam_active: boolean;
  fresh_batch_count: number;
  address: SiteAddress;
  socials: SiteSocials;
  contact: SiteContactInfo;
  updated_at: string;
}
