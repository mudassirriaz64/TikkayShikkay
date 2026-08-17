import { MenuItem } from "./menu";

export type OrderStatus =
  | "placed"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "delivered";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
}

export interface AccountOrderItem {
  itemId: string;
  title: string;
  quantity: number;
  price: number;
  image_url: string;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  timestamp: string;
}

export interface AccountOrder {
  id: string;
  placedAt: string;
  items: AccountOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  timeline: OrderTimelineStep[];
}

export interface AccountReview {
  id: string;
  dish: string;
  rating: number;
  review_text: string;
  created_at: string;
  is_approved: boolean;
}

export interface AccountsPageData {
  demoProfile: UserProfile;
  orders: AccountOrder[];
  reviews: AccountReview[];
  menuItems: MenuItem[];
}
