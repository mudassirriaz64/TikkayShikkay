import { SiteSettings } from "@/types";

export const mockSiteSettings: SiteSettings = {
  id: "mock-settings-1",
  hero_title: "Fire-Grilled. Fresh Daily. Made With Pride.",
  hero_subtitle:
    "Experience the raw, untamed flavor of Pakistani street BBQ. No shortcuts, no gas grills - just pure charcoal heat and ancestral spice blends.",
  hero_media_url: "/images/hero_image.png",
  live_cam_active: false,
  fresh_batch_count: 124,
  address: {
    street: "123 Spice Street",
    city: "Food District",
    full: "123 Spice Street, Food District",
    mapsUrl: "https://maps.google.com/?q=123+Spice+Street+Food+District",
  },
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
  contact: {
    whatsapp: "+92 300 1234567",
    phone: "+92 300 1234567",
    email: "hello@tikkayshikkay.com",
  },
  updated_at: new Date().toISOString(),
};
