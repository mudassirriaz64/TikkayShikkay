import { MenuItem } from "./menu";

export type OrderStatus =
  | "placed"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "delivered";

export interface UserProfile {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  is_loyalty_member?: boolean;
  loyalty_joined_at?: string;
  loyalty_points?: number;
  birthday?: string;
  whatsapp_opt_in?: boolean;
}

export interface AccountOrderItem {
  itemId?: string;
  title: string;
  quantity: number;
  price: number;
  image_url: string;
  breakdown?: string;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  timestamp: string;
}

export interface AccountOrder {
  id: string;
  placedAt: string;
  user_id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  customer_address?: string;
  payment_method?: string;
  payment_status?: string;
  order_notes?: string;
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
