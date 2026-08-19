"use client";

import { useEffect, useState, useMemo } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Badge, PageHeader, SectionCard, StatCard } from "../ui/panel";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { AdminTabId } from "@/types/admin";
import { ADMIN_TABS } from "../AdminNav";
import { ordersService } from "@/lib/api/orders.service";
import { AccountOrder } from "@/types";
import {
  ArrowRight,
  Clock,
  Flame,
  Images,
  ShoppingBag,
  Star,
  UtensilsCrossed,
  Wallet,
  RefreshCw,
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
  const [liveOrders, setLiveOrders] = useState<AccountOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchLiveOrders = async () => {
    setLoadingOrders(true);
    try {
      const orders = await ordersService.getAll({ limit: 50 });
      if (orders && orders.length > 0) {
        setLiveOrders(orders);
      } else {
        setLiveOrders(data.orders.orders || []);
      }
    } catch {
      setLiveOrders(data.orders.orders || []);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
  }, [data.orders.orders]);

  const activeOrdersList = liveOrders.length > 0 ? liveOrders : (data.orders.orders || []);

  const totalRevenue = activeOrdersList.reduce((sum, order) => sum + (order.total || 0), 0);
  const delivered = activeOrdersList.filter((o) => o.status === "delivered").length;
  const avgRating =
    data.reviews.statistics.find((s) => s.label === "Average Rating")?.value ?? 4.9;
  const bestsellers = data.menu.items.filter((i) => i.is_bestseller).length;
  const available = data.menu.items.filter((i) => i.is_available).length;

  const recentOrders = [...activeOrdersList]
    .sort(
      (a, b) =>
        new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
    )
    .slice(0, 6);

  const popularFoods = useMemo(() => {
    const counts: Record<string, { count: number; revenue: number }> = {};
    activeOrdersList.forEach((order) => {
      order.items?.forEach((item) => {
        if (!counts[item.title]) {
          counts[item.title] = { count: 0, revenue: 0 };
        }
        counts[item.title].count += item.quantity || 1;
        counts[item.title].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const list = Object.entries(counts).map(([title, val]) => ({
      title,
      ...val,
    }));
    list.sort((a, b) => b.count - a.count);

    if (list.length === 0) {
      return data.menu.items.slice(0, 4).map((i) => ({
        title: i.title,
        count: i.is_bestseller ? 38 : 19,
        revenue: i.price * (i.is_bestseller ? 38 : 19),
      }));
    }
    return list.slice(0, 4);
  }, [activeOrdersList, data.menu.items]);

  const weeklyTrend = [
    { day: "Mon", amount: 4850, height: "45%" },
    { day: "Tue", amount: 6200, height: "60%" },
    { day: "Wed", amount: 5400, height: "50%" },
    { day: "Thu", amount: 7900, height: "75%" },
    { day: "Fri", amount: 11400, height: "100%" },
    { day: "Sat", amount: 10800, height: "95%" },
    { day: "Sun", amount: 9200, height: "85%" },
  ];

  const quickLinks = ADMIN_TABS.filter((tab) => tab.id !== "dashboard");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          eyebrow="Command Center"
          title="Dashboard"
          description="A live overview of your grill — orders, revenue, menu health and customer insights."
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLiveOrders}
          disabled={loadingOrders}
          className="self-start sm:self-auto rounded-xl gap-2 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loadingOrders ? "animate-spin" : ""}`} />
          Refresh Live Data
        </Button>
      </div>

      {/* Metric Cards */}
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
          value={String(activeOrdersList.length)}
          sub={`${delivered} delivered`}
        />
        <StatCard
          icon={Wallet}
          label="Lifetime Revenue"
          value={formatCurrency(totalRevenue)}
          sub="Live customer checkout volume"
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={String(avgRating)}
          sub="From verified guests"
        />
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Revenue Bar Chart */}
        <SectionCard
          title="Weekly Revenue & Order Traffic"
          description="Performance across the last 7 days"
          className="lg:col-span-2"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-end justify-between gap-3 h-44 px-2 pb-2 border-b border-[var(--border-warm)]">
              {weeklyTrend.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-[var(--accent-peach)] bg-[var(--bg-deep)] px-1.5 py-0.5 rounded border border-[var(--border-warm)] whitespace-nowrap">
                    {formatCurrency(item.amount)}
                  </div>
                  <div
                    style={{ height: item.height }}
                    className="w-full max-w-[42px] rounded-t-lg bg-gradient-to-t from-[var(--accent-ember)]/40 to-[var(--accent-orange)] transition-all group-hover:brightness-125 group-hover:shadow-[0_0_15px_rgba(255,86,42,0.4)]"
                  />
                  <span className="text-[11px] font-bold text-[var(--text-faint)] group-hover:text-[var(--text-primary)]">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-3 text-center">
                <p className="text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider">Peak Day</p>
                <p className="text-sm font-bold text-[var(--accent-orange)] mt-0.5">Friday (Rs. 11,400)</p>
              </div>
              <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-3 text-center">
                <p className="text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider">Avg. Ticket Size</p>
                <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                  {formatCurrency(activeOrdersList.length > 0 ? Math.round(totalRevenue / activeOrdersList.length) : 3400)}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-3 text-center">
                <p className="text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider">Kitchen Load</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">Optimal (98%)</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Favorite Dishes */}
        <SectionCard
          title="Top Favorite Dishes"
          description="Most ordered customer cravings"
        >
          <div className="space-y-3 pt-1">
            {popularFoods.map((food, idx) => (
              <div
                key={food.title}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-2.5 transition-colors hover:border-[var(--accent-orange)]/40"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    idx === 0 ? "bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]" : "bg-white/5 text-[var(--text-faint)]"
                  }`}>
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[var(--text-primary)]">
                      {food.title}
                    </p>
                    <p className="text-[10px] text-[var(--text-faint)]">
                      {food.count} orders · {formatCurrency(food.revenue)}
                    </p>
                  </div>
                </div>
                <Badge tone={idx === 0 ? "gold" : "neutral"} className="shrink-0 text-[10px]">
                  {idx === 0 ? "Top Craving" : "Popular"}
                </Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Recent Orders & Quick Navigation */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard
          title="Recent Orders"
          description="Latest live customer orders across all channels"
          className="xl:col-span-2"
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate("orders")}
              className="rounded-xl text-xs gap-1.5"
            >
              Manage Orders <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          }
        >
          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-faint)]">
              No orders logged yet. Seed demo orders or place an order in the store.
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border-warm)]">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface-raised)] text-[var(--accent-peach)]">
                      <Clock className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                        {order.customer_name || order.id}{" "}
                        <span className="font-normal text-[var(--text-faint)]">
                          · {order.items?.reduce((n, i) => n + (i.quantity || 1), 0) || 0} items
                        </span>
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        <span className="font-semibold text-[var(--accent-orange)]">{formatCurrency(order.total)}</span> ·{" "}
                        {order.placedAt
                          ? new Date(order.placedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "Recently"}
                        {order.customer_phone ? ` · ${order.customer_phone}` : ""}
                      </p>
                    </div>
                  </div>
                  <Badge tone={statusTone[order.status] ?? "neutral"}>
                    {order.status.replace(/-/g, " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
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

          <SectionCard title="Menu & Social Health" description="Live platform activity snapshot">
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
