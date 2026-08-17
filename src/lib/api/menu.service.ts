import { api } from './client';
import { MenuCategory, MenuItem, MenuPageData } from '@/types';

export interface MenuPageConfig {
  tabs?: unknown;
  platter?: unknown;
  boti_featured_item_id?: string;
  boti_compact_ids?: string[];
}

export interface MenuItemQuery {
  category_id?: string;
  available?: boolean;
  bestseller?: boolean;
  section?: 'featured' | 'boti' | 'sides' | 'regular';
}

export const menuService = {
  getPageData(): Promise<MenuPageData> {
    return api.get<MenuPageData>('/menu/page-data');
  },

  getPageConfig(): Promise<MenuPageConfig> {
    return api.get<MenuPageConfig>('/menu/page-config');
  },

  updatePageConfig(data: Partial<MenuPageConfig> | Record<string, unknown>): Promise<MenuPageConfig> {
    return api.patch<MenuPageConfig>('/menu/page-config', data);
  },

  getCategories(): Promise<MenuCategory[]> {
    return api.get<MenuCategory[]>('/menu/categories');
  },

  createCategory(data: Partial<MenuCategory>): Promise<MenuCategory> {
    return api.post<MenuCategory>('/menu/categories', data);
  },

  updateCategory(id: string, data: Partial<MenuCategory>): Promise<MenuCategory> {
    return api.patch<MenuCategory>(`/menu/categories/${id}`, data);
  },

  deleteCategory(id: string): Promise<void> {
    return api.delete<void>(`/menu/categories/${id}`);
  },

  getItems(query?: MenuItemQuery): Promise<MenuItem[]> {
    return api.get<MenuItem[]>('/menu/items', {
      query: query
        ? {
            category_id: query.category_id,
            available: query.available ? 'true' : undefined,
            bestseller: query.bestseller ? 'true' : undefined,
            section: query.section,
          }
        : undefined,
    });
  },

  getItem(id: string): Promise<MenuItem> {
    return api.get<MenuItem>(`/menu/items/${id}`);
  },

  createItem(data: Partial<MenuItem> & { category_id: string }): Promise<MenuItem> {
    return api.post<MenuItem>('/menu/items', data);
  },

  updateItem(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    return api.patch<MenuItem>(`/menu/items/${id}`, data);
  },

  deleteItem(id: string): Promise<void> {
    return api.delete<void>(`/menu/items/${id}`);
  },
};
