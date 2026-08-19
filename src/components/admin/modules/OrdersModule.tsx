"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge, BadgeTone, PageHeader, SectionCard, StatCard } from "../ui/panel";
import { Select } from "../ui/controls";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { AccountOrder, OrderStatus } from "@/types";
import { ordersService } from "@/lib/api";
import { OrderDetailModal } from "./OrderDetailModal";
import {
  Mail,
  MapPin,
  Package,
  Phone,
  PencilLine,
  Receipt,
  ShoppingBag,
  UserRound,
  Wallet,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
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
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerTypeFilter, setCustomerTypeFilter] = useState<"all" | "guest" | "registered">("all");
  const [selectedOrder, setSelectedOrder] = useState<AccountOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersService.getAll({ limit: 100 });
      setOrders(data || []);
      // If modal is open, keep selected order updated
      if (selectedOrder) {
        const fresh = data.find((o) => (o.id || (o as any)._id) === (selectedOrder.id || (selectedOrder as any)._id));
        if (fresh) setSelectedOrder(fresh);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [selectedOrder]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const active = orders.filter((o) => o.status !== "delivered").length;
  const guestOrdersCount = orders.filter((o) => !o.user_id && !(o as any).user_id).length;
  const registeredOrdersCount = orders.length - guestOrdersCount;

  async function handleUpdateOrderStatus(id: string, status: OrderStatus) {
    setUpdatingId(id);
    try {
      await ordersService.updateStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id || (o as any)._id === id ? { ...o, status } : o))
      );
      if (selectedOrder && (selectedOrder.id === id || (selectedOrder as any)._id === id)) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleOpenDetails(order: AccountOrder) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  function orderItemsLabel(order: AccountOrder) {
    if (!order.items || !Array.isArray(order.items)) return "No items";
    return order.items.map((i) => `${i.title} ×${i.quantity}`).join(", ");
  }

  const filteredOrders = orders.filter((order) => {
    const orderId = order.id || (order as any)._id || "";
    const customer = (order as any).customer_name || (order as any).customer_phone || "";
    const matchesSearch =
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && order.status !== statusFilter) return false;

    const isRegistered = Boolean(order.user_id || (order as any).user_id);
    if (customerTypeFilter === "guest" && isRegistered) return false;
    if (customerTypeFilter === "registered" && !isRegistered) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fulfilment & Kitchen"
        title="Orders Pipeline"
        description="Monitor real-time incoming orders, update live kitchen & delivery statuses, view invoices, and track fulfillment revenue."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-xl text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Orders
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={String(orders.length)}
          sub={`${guestOrdersCount} Guest · ${registeredOrdersCount} Account`}
        />
        <StatCard
          icon={Package}
          label="Active Orders"
          value={String(active)}
          sub="In preparation & delivery"
        />
        <StatCard
          icon={Receipt}
          label="Delivered"
          value={String(delivered)}
          sub="Successfully completed"
        />
        <StatCard
          icon={Wallet}
          label="Total Revenue"
          value={formatCurrency(revenue)}
          sub="Live order sales"
        />
      </div>

      <SectionCard
        title="Live Orders Directory"
        description="Search orders, filter by customer type, print invoices, and manage pipeline progression"
      >
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[var(--border-warm)]/60 pb-5 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-faint)]" />
            <input
              type="text"
              placeholder="Search by Order ID, customer, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Customer Type Filter */}
            <select
              value={customerTypeFilter}
              onChange={(e) => setCustomerTypeFilter(e.target.value as any)}
              className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            >
              <option value="all">All Customers ({orders.length})</option>
              <option value="registered">Registered Accounts ({registeredOrdersCount})</option>
              <option value="guest">Guest Checkouts ({guestOrdersCount})</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            >
              <option value="all">All Statuses ({orders.length})</option>
              <option value="placed">Placed ({orders.filter((o) => o.status === "placed").length})</option>
              <option value="preparing">In Kitchen ({orders.filter((o) => o.status === "preparing").length})</option>
              <option value="ready">Ready ({orders.filter((o) => o.status === "ready").length})</option>
              <option value="out-for-delivery">Out for Delivery ({orders.filter((o) => o.status === "out-for-delivery").length})</option>
              <option value="delivered">Delivered ({orders.filter((o) => o.status === "delivered").length})</option>
            </select>
          </div>
        </div>

        {/* Orders list */}
        {filteredOrders.length > 0 ? (
          <ul className="divide-y divide-[var(--border-warm)]">
            {filteredOrders.map((order) => {
              const orderId = order.id || (order as any)._id;
              const meta = ORDER_STATUS_META[order.status] || { label: order.status, tone: "neutral" };
              const custName = (order as any).customer_name || "Customer";
              const custPhone = (order as any).customer_phone;
              const custAddress = (order as any).customer_address;
              const isRegistered = Boolean(order.user_id || (order as any).user_id);

              return (
                <li
                  key={orderId}
                  className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between hover:bg-[var(--bg-surface-alt)]/30 -mx-4 px-4 rounded-xl transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1.5 cursor-pointer" onClick={() => handleOpenDetails(order)}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent-orange)] transition-colors">
                        #{orderId}
                      </p>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                      
                      {/* Customer Type Tag */}
                      {isRegistered ? (
                        <span className="rounded-full bg-[var(--accent-peach)]/15 border border-[var(--accent-peach)]/30 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[var(--accent-peach)] flex items-center gap-1">
                          <UserRound className="h-3 w-3" /> Account
                        </span>
                      ) : (
                        <span className="rounded-full bg-[var(--bg-surface-raised)] border border-[var(--border-warm)] px-2.5 py-0.5 text-[10px] font-bold uppercase text-[var(--text-faint)]">
                          Guest Order
                        </span>
                      )}

                      <span className="rounded-full bg-[var(--bg-surface-raised)] border border-[var(--border-warm)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--text-faint)]">
                        {(order as any).payment_method || "Cash"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
                        <UserRound className="h-3.5 w-3.5 text-[var(--accent-orange)]" />
                        {custName}
                      </span>
                      {custPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-[var(--text-faint)]" />
                          {custPhone}
                        </span>
                      )}
                      {custAddress && (
                        <span className="flex items-center gap-1 max-w-[280px] truncate">
                          <MapPin className="h-3 w-3 text-[var(--text-faint)]" />
                          {custAddress}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--text-body)]">
                      <strong>Items:</strong> {orderItemsLabel(order)}
                    </p>

                    <p className="text-[11px] text-[var(--text-faint)] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date((order as any).placedAt || (order as any).createdAt || Date.now()).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-2.5 lg:items-end">
                    <p className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--accent-orange)]">
                      {formatCurrency(order.total)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetails(order)}
                        className="h-9 px-3 rounded-xl text-xs flex items-center gap-1.5 font-bold"
                      >
                        <FileText className="h-3.5 w-3.5 text-[var(--accent-peach)]" />
                        <span>Invoice / Details</span>
                      </Button>

                      <Select
                        value={order.status}
                        disabled={updatingId === orderId}
                        onChange={(e) =>
                          handleUpdateOrderStatus(orderId, e.target.value as OrderStatus)
                        }
                        aria-label={`Update status for ${orderId}`}
                        className="h-9 w-40 py-1.5 text-xs font-bold"
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
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-faint)] space-y-2">
            <ShoppingBag className="mx-auto h-8 w-8 text-[var(--text-faint)]/40" />
            <p className="font-semibold text-sm text-[var(--text-muted)]">No orders found</p>
            <p className="text-xs text-[var(--text-faint)]">
              {loading ? "Loading live orders from database..." : "Orders placed via checkout will appear here live."}
            </p>
          </div>
        )}
      </SectionCard>

      {/* Full-fledged Order Detail & Invoice Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleUpdateOrderStatus}
      />
    </div>
  );
}

