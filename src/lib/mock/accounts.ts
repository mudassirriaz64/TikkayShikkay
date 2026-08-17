import {
  AccountOrder,
  AccountOrderItem,
  AccountReview,
  OrderStatus,
  OrderTimelineStep,
  UserProfile,
} from "@/types";

const STATUS_ORDER: OrderStatus[] = [
  "placed",
  "preparing",
  "ready",
  "out-for-delivery",
  "delivered",
];

const STEP_LABELS: Record<OrderStatus, string> = {
  placed: "Order Placed",
  preparing: "In The Kitchen",
  ready: "Ready For Pickup",
  "out-for-delivery": "Out For Delivery",
  delivered: "Delivered",
};

function buildTimeline(startISO: string, status: OrderStatus): OrderTimelineStep[] {
  const start = new Date(startISO).getTime();
  const reached = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER.map((s, i) => ({
    status: s,
    label: STEP_LABELS[s],
    timestamp:
      i <= reached
        ? new Date(start + i * 45 * 60 * 1000).toISOString()
        : "",
  }));
}

export const mockDemoProfile: UserProfile = {
  name: "Ali Raza",
  email: "ali.raza@example.com",
  phone: "+92 300 1234567",
  address: "House 21, Street 5, Gulberg, Lahore",
  memberSince: "2024-03-14T00:00:00",
};

const ORDER_ITEMS_1: AccountOrderItem[] = [
  {
    itemId: "menu-1",
    title: "Reshmi Boti",
    quantity: 2,
    price: 850,
    image_url: "/images/menu/reshmi-tikka.jpg",
  },
  {
    itemId: "menu-2",
    title: "Bharli Tikka",
    quantity: 1,
    price: 1320,
    image_url: "/images/menu/bharli-boti.jpg",
  },
  {
    itemId: "menu-4",
    title: "Nuktaan Chops",
    quantity: 1,
    price: 1830,
    image_url: "/images/menu/grill-mix.jpg",
  },
];

const ORDER_ITEMS_2: AccountOrderItem[] = [
  {
    itemId: "menu-3",
    title: "The Grand Feast",
    quantity: 1,
    price: 4500,
    image_url: "/images/menu/platter-biryani.jpg",
  },
];

const ORDER_ITEMS_3: AccountOrderItem[] = [
  {
    itemId: "menu-1",
    title: "Reshmi Boti",
    quantity: 3,
    price: 850,
    image_url: "/images/menu/reshmi-tikka.jpg",
  },
  {
    itemId: "menu-2",
    title: "Bharli Tikka",
    quantity: 1,
    price: 1320,
    image_url: "/images/menu/bharli-boti.jpg",
  },
];

const ORDER_ITEMS_4: AccountOrderItem[] = [
  {
    itemId: "menu-4",
    title: "Nuktaan Chops",
    quantity: 2,
    price: 1830,
    image_url: "/images/menu/grill-mix.jpg",
  },
  {
    itemId: "menu-3",
    title: "The Grand Feast",
    quantity: 1,
    price: 4500,
    image_url: "/images/menu/platter-biryani.jpg",
  },
];

const ORDER_ITEMS_5: AccountOrderItem[] = [
  {
    itemId: "menu-1",
    title: "Reshmi Boti",
    quantity: 1,
    price: 850,
    image_url: "/images/menu/reshmi-tikka.jpg",
  },
];

function buildOrder(
  id: string,
  placedAt: string,
  status: OrderStatus,
  items: AccountOrderItem[],
  deliveryFee = 0,
): AccountOrder {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    id,
    placedAt,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    status,
    timeline: buildTimeline(placedAt, status),
  };
}

export const mockAccountOrders: AccountOrder[] = [
  buildOrder(
    "TS-1042",
    "2026-08-01T19:10:00",
    "delivered",
    ORDER_ITEMS_1,
  ),
  buildOrder(
    "TS-1041",
    "2026-08-09T20:05:00",
    "out-for-delivery",
    ORDER_ITEMS_2,
    150,
  ),
  buildOrder(
    "TS-1040",
    "2026-08-10T21:30:00",
    "ready",
    ORDER_ITEMS_3,
  ),
  buildOrder(
    "TS-1039",
    "2026-08-11T12:45:00",
    "preparing",
    ORDER_ITEMS_4,
    150,
  ),
  buildOrder(
    "TS-1018",
    "2026-07-12T19:00:00",
    "delivered",
    ORDER_ITEMS_5,
  ),
];

export const mockMyReviews: AccountReview[] = [
  {
    id: "my-review-1",
    dish: "Bharli Tikka",
    rating: 5,
    review_text:
      "The char on the beef bhary tikka is unreal. Easily the best BBQ bite in the city - smoky, juicy, and perfectly spiced.",
    created_at: "2026-07-15T18:00:00",
    is_approved: true,
  },
  {
    id: "my-review-2",
    dish: "The Grand Feast",
    rating: 4,
    review_text:
      "Fed a whole table of friends for a birthday. Portions are generous and everything arrived piping hot off the coals.",
    created_at: "2026-08-02T21:00:00",
    is_approved: true,
  },
  {
    id: "my-review-3",
    dish: "Reshmi Boti",
    rating: 5,
    review_text:
      "Silky smooth chicken, kissed by charcoal. I order this almost every week now - it never misses.",
    created_at: "2026-08-09T22:00:00",
    is_approved: false,
  },
];
