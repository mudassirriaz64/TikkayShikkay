import { MenuPageData } from "@/types";
import { menuService } from "@/lib/api/menu.service";
import { tryOrFallback } from "@/lib/api/client";
import {
  mockMenuCategories,
  mockMenuItems,
  mockMenuTabs,
  mockFeaturedItems,
  mockPlatterData,
  mockBotiData,
  mockSideItems,
} from "@/lib/mock/menu";

const mockMenuPageData: MenuPageData = {
  categories: mockMenuCategories,
  items: mockMenuItems,
  tabs: mockMenuTabs,
  featured: mockFeaturedItems,
  platter: mockPlatterData,
  boti: mockBotiData,
  sides: mockSideItems,
};

export async function getMenu(): Promise<MenuPageData> {
  return tryOrFallback(
    () => menuService.getPageData(),
    mockMenuPageData,
  );
}
