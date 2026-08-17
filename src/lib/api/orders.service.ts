import { api } from './client';
import { AccountOrder, OrderStatus } from '@/types';

export interface OrderItemInput {
  itemId: string;
  title: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export interface CreateOrderInput {
  user_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  customer_address?: string;
  items: OrderItemInput[];
  subtotal: number;
  deliveryFee?: number;
  total: number;
  payment_method?: 'cash' | 'card' | 'online';
  order_notes?: string;
}

export interface OrderStats {
  total: number;
  byStatus: Record<OrderStatus, number>;
  today: number;
  todayRevenue: number;
}

export interface OrderQuery {
  status?: OrderStatus;
  limit?: number;
}

export const ordersService = {
  create(data: CreateOrderInput): Promise<AccountOrder> {
    return api.post<AccountOrder>('/orders', data);
  },

  getMyOrders(): Promise<AccountOrder[]> {
    return api.get<AccountOrder[]>('/orders/my');
  },

  getAll(query?: OrderQuery): Promise<AccountOrder[]> {
    return api.get<AccountOrder[]>('/orders', {
      query: query ? { status: query.status, limit: query.limit } : undefined,
    });
  },

  getById(id: string): Promise<AccountOrder> {
    return api.get<AccountOrder>(`/orders/${id}`);
  },

  updateStatus(id: string, status: OrderStatus): Promise<AccountOrder> {
    return api.patch<AccountOrder>(`/orders/${id}`, { status });
  },

  getStats(): Promise<OrderStats> {
    return api.get<OrderStats>('/orders/stats');
  },
};
