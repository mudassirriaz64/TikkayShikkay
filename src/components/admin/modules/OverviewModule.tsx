"use client";

import { useAdminData } from "@/providers/AdminDataProvider";
import { Badge, PageHeader, SectionCard, StatCard } from "../ui/panel";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { AdminTabId } from "@/types/admin";
import { ADMIN_TABS } from "../AdminNav";
import {
  ArrowRight,
  Clock,
  Flame,
  Images,
  ShoppingBag,
  Star,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

const statusTone: Record<
  string,
  "orange" | "gold" | "green" | "peach" | "neutral" | "red"
> = {
  placed: "neutral",
  preparing: "orange",
  ready: "gold",
  "out-for-delivery": "peach",
  delivered: "green",
};

export function OverviewModule({
  onNavigate,
}: {
  onNavigate: (tab: AdminTabId) => void;
}) {
  const { data } = useAdminData();

  const totalRevenue = data.orders.orders.reduce((sum, order) => sum + order.total, 0);
  const delivered = data.orders.orders.filter((o) => o.status === "delivered").length;
  const avgRating =
    data.reviews.statistics.find((s) => s.label === "Average Rating")?.value ?? 4.9;
  const bestsellers = data.menu.items.filter((i) => i.is_bestseller).length;
  const available = data.menu.items.filter((i) => i.is_available).length;

  const recentOrders = [...data.orders.orders]
    .sort(
      (a, b) =>
        new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
    )
    .slice(0, 5);

  const quickLinks = ADMIN_TABS.filter((tab) => tab.id !== "dashboard");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Command Center"
        title="Dashboard"
        description="A live overview of your grill — orders, revenue, menu health and the voice of your customers."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={UtensilsCrossed}
          label="Menu Items"
          value={String(data.menu.items.length)}
          sub={`${available} available · ${bestsellers} bestsellers`}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={String(data.orders.orders.length)}
          sub={`${delivered} delivered`}
        />
        <StatCard
          icon={Wallet}
          label="Lifetime Revenue"
          value={formatCurrency(totalRevenue)}
          sub="Across demo orders"
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={String(avgRating)}
          sub="From verified guests"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard
          title="Recent Orders"
          description="Latest activity across all channels"
          className="xl:col-span-2"
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate("orders")}
            >
              View All <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          }
        >
          <ul className="divide-y divide-[var(--border-warm)]">
            {recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-surface-raised)] text-[var(--accent-peach)]">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {order.id}{" "}
                      <span className="font-normal text-[var(--text-faint)]">
                        · {order.items.reduce((n, i) => n + i.quantity, 0)} items
                      </span>
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {formatCurrency(order.total)} ·{" "}
                      {new Date(order.placedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <Badge tone={statusTone[order.status] ?? "neutral"}>
                  {order.status.replace(/-/g, " ")}
                </Badge>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Quick Actions" description="Jump into a workspace">
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(tab.id)}
                      className="flex w-full items-center gap-2.5 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] px-3 py-2.5 text-left text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-orange)]/40 hover:text-[var(--accent-orange)]"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </SectionCard>

          <SectionCard title="Menu Health" description="Availability snapshot">
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Flame className="h-4 w-4 text-[var(--accent-orange)]" />
                  Bestsellers
                </span>
                <span className="font-bold text-[var(--text-primary)]">{bestsellers}</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--text-muted)]">
                  <UtensilsCrossed className="h-4 w-4 text-[var(--accent-peach)]" />
                  Available items
                </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {available}/{data.menu.items.length}
                </span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Images className="h-4 w-4 text-[var(--accent-gold)]" />
                  Gallery photos
                </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {data.gallery.pageData.gallery.length}
                </span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Star className="h-4 w-4 text-[var(--accent-gold)]" />
                  Customer reviews
                </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {data.reviews.reviews.length}
                </span>
              </li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
