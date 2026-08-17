"use client";

import { useState } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Badge, BadgeTone, PageHeader, SectionCard, StatCard } from "../ui/panel";
import { Select, Toggle } from "../ui/controls";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { AccountOrder, AccountReview, OrderStatus } from "@/types";
import {
  Mail,
  MapPin,
  Package,
  Phone,
  PencilLine,
  Receipt,
  ShoppingBag,
  Star,
  UserRound,
  Wallet,
} from "lucide-react";

const ORDER_STATUSES: OrderStatus[] = [
  "placed",
  "preparing",
  "ready",
  "out-for-delivery",
  "delivered",
];

const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: BadgeTone }> = {
  placed: { label: "Placed", tone: "neutral" },
  preparing: { label: "In The Kitchen", tone: "orange" },
  ready: { label: "Ready", tone: "gold" },
  "out-for-delivery": { label: "Out For Delivery", tone: "peach" },
  delivered: { label: "Delivered", tone: "green" },
};

export function OrdersModule() {
  const { data, updateSlice } = useAdminData();
  const [showAllOrders, setShowAllOrders] = useState(false);

  const profile = data.orders.profile ?? { name: "Admin", email: "", phone: "", address: "", memberSince: "" };
  const orders = data.orders.orders;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const active = orders.filter((o) => o.status !== "delivered").length;

  function toggleReviewApproved(review: AccountReview) {
    updateSlice("orders", {
      ...data.orders,
      reviews: data.orders.reviews.map((r) =>
        r.id === review.id ? { ...r, is_approved: !r.is_approved } : r,
      ),
    });
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    updateSlice("orders", {
      ...data.orders,
      orders: orders.map((o) => (o.id === id ? { ...o, status } : o)),
    });
  }

  function orderItemsLabel(order: AccountOrder) {
    return order.items.map((i) => `${i.title} ×${i.quantity}`).join(", ");
  }

  const profileFields = [
    { icon: UserRound, label: "Name", value: profile.name },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: MapPin, label: "Address", value: profile.address },
  ];

  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fulfilment"
        title="Orders"
        description="One guest account powers the demo experience. Manage the profile shown on the accounts page and moderate this guest's reviews."
        actions={
          <Button
            variant={showAllOrders ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowAllOrders((s) => !s)}
            className="flex items-center gap-2 rounded-xl"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {showAllOrders ? "Hide All Orders" : `All Orders (${orders.length})`}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={String(orders.length)}
          sub="All channels"
        />
        <StatCard
          icon={Package}
          label="Active"
          value={String(active)}
          sub="Not yet delivered"
        />
        <StatCard
          icon={Receipt}
          label="Delivered"
          value={String(delivered)}
          sub="Completed"
        />
        <StatCard
          icon={Wallet}
          label="Revenue"
          value={formatCurrency(revenue)}
          sub="Across all orders"
        />
      </div>

      {showAllOrders ? (
        <SectionCard
          title="All Orders"
          description="Every order placed by the guest - update any status directly"
        >
          <ul className="divide-y divide-[var(--border-warm)]">
            {orders.map((order) => {
              const meta = ORDER_STATUS_META[order.status];
              return (
                <li
                  key={order.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        {order.id}
                      </p>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </div>
                    <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
                      {orderItemsLabel(order)}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                      {new Date(order.placedAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {formatCurrency(order.total)}
                    </p>
                    <div className="flex items-center gap-2">
                      <PencilLine
                        className="h-3.5 w-3.5 text-[var(--text-faint)]"
                        aria-hidden="true"
                      />
                      <Select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        aria-label={`Update status for ${order.id}`}
                        className="h-9 w-48 py-1.5 text-xs"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {ORDER_STATUS_META[s].label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      ) : null}

      {!showAllOrders ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <SectionCard
          title="Guest Profile"
          description="Demo account shown on the accounts page"
          className="xl:col-span-2"
        >
          <div className="flex items-center gap-4 border-b border-[var(--border-warm)] pb-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-orange)]/25 bg-[var(--accent-orange)]/10 font-[family:var(--font-serif)] text-lg font-bold text-[var(--accent-orange)]">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
                {profile.name}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                Member since {formatDate(profile.memberSince)}
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-4">
            {profileFields.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-surface-raised)] text-[var(--accent-orange)]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    {label}
                  </dt>
                  <dd className="mt-0.5 break-words text-sm font-semibold text-[var(--text-primary)]">
                    {value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </SectionCard>

        <SectionCard
          title="Customer Reviews"
          description="Reviews written from this account"
          className="xl:col-span-3"
        >
          <ul className="divide-y divide-[var(--border-warm)]">
            {data.orders.reviews.map((review) => (
              <li
                key={review.id}
                className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {review.dish}
                    </p>
                    <span
                      className="inline-flex items-center gap-0.5 text-xs text-[var(--accent-gold)]"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                      {review.rating}.0
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
                    {review.review_text}
                  </p>
                  <p className="mt-1.5 text-xs text-[var(--text-faint)]">
                    {formatDate(review.created_at)}
                  </p>
                </div>
                <div className="shrink-0">
                  <Toggle
                    checked={review.is_approved}
                    onChange={() => toggleReviewApproved(review)}
                    label="Approved"
                    description="Visible on the public site"
                  />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
        </div>
      ) : null}
    </div>
  );
}
