export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Extra Spicy';

export interface MenuItem {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  spice_level: SpiceLevel;
  is_bestseller: boolean;
  is_available: boolean;
  image_url: string;
}

export type MenuRibbon = "Legendary" | "Chef's Choice";

export interface MenuTab {
  id: string;
  label: string;
  sectionId: string;
}

export interface FeaturedItem extends MenuItem {
  ribbon?: MenuRibbon;
  tags?: string[];
}

export interface PlatterOption {
  id: string;
  name: string;
  price: number;
}

export interface PlatterData {
  baseLabel: string;
  basePrice: number;
  imageUrl: string;
  meats: PlatterOption[];
  sides: PlatterOption[];
}

export interface BotiItem extends MenuItem {
  ribbon?: MenuRibbon;
}

export interface BotiData {
  featured: BotiItem;
  compact: BotiItem[];
}

export interface SideItem extends MenuItem {
  isSignature?: boolean;
}

export interface MenuPageData {
  categories: MenuCategory[];
  items: MenuItem[];
  tabs: MenuTab[];
  featured: FeaturedItem[];
  platter: PlatterData;
  boti: BotiData;
  sides: SideItem[];
}
