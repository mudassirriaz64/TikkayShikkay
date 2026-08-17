import { settingsService } from "@/lib/api/settings.service";
import { menuService } from "@/lib/api/menu.service";
import { reviewsService } from "@/lib/api/reviews.service";
import { galleryService } from "@/lib/api/gallery.service";
import { contactService } from "@/lib/api/contact.service";
import { aboutService } from "@/lib/api/about.service";
import { ordersService } from "@/lib/api";

export async function getAdminPageData() {
  const [settings, menu, reviews, gallery, contact, about] = await Promise.all([
    settingsService.get(),
    menuService.getPageData(),
    reviewsService.getPageData(),
    galleryService.getPageData(),
    contactService.getPageData(),
    aboutService.getPageData(),
  ]);

  const orders = await ordersService.getAll({ limit: 20 }).catch(() => []);

  return {
    settings,
    menu,
    reviews,
    gallery: { pageData: gallery, galleryItems: (gallery.gallery || []) as any[] },
    contact,
    about,
    orders: {
      profile: null,
      orders: orders as any[],
      reviews: [],
      menuItems: menu.items,
    },
  };
}
