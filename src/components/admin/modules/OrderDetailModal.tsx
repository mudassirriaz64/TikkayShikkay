"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  X,
  Printer,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Flame,
  FileText,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { AccountOrder, OrderStatus } from "@/types";

interface OrderDetailModalProps {
  order: AccountOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (orderId: string, status: OrderStatus) => Promise<void>;
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Order Placed",
  preparing: "In The Kitchen",
  ready: "Ready For Pickup",
  "out-for-delivery": "Out For Delivery",
  delivered: "Delivered & Paid",
};

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  placed: "bg-neutral-800 text-neutral-300 border-neutral-700",
  preparing: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  ready: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "out-for-delivery": "bg-rose-500/15 text-rose-300 border-rose-500/30",
  delivered: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const orderId = order.id || (order as any)._id || "N/A";
  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
  const statusColor = ORDER_STATUS_COLORS[order.status] || "bg-neutral-800 text-neutral-300 border-neutral-700";
  const custName = (order as any).customer_name || "Customer";
  const custEmail = (order as any).customer_email || "N/A";
  const custPhone = (order as any).customer_phone || "N/A";
  const custAddress = (order as any).customer_address || "Dine-in / Pickup";
  const paymentMethod = (order as any).payment_method || "cash";
  const paymentStatus = (order as any).payment_status || "pending";
  const orderNotes = (order as any).order_notes;
  const placedDate = (order as any).placedAt || (order as any).createdAt || new Date().toISOString();
  const isRegistered = Boolean(order.user_id || (order as any).user_id);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppCustomer = () => {
    const cleanPhone = custPhone.replace(/[^0-9]/g, "");
    if (!cleanPhone) return;
    const msg = encodeURIComponent(
      `Hello ${custName}! Update regarding your Tikkay Shikkay order #${orderId}: Your order is currently ${statusLabel}. Thank you!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Main Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[24px] border border-white/10 bg-[#161616] text-[#e5e2e1] shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#121212] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9381E] text-white shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-white">
                  Order #{orderId}
                </h2>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                  {statusLabel}
                </span>
                {isRegistered ? (
                  <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 text-[9px] font-extrabold uppercase text-orange-300">
                    Account
                  </span>
                ) : (
                  <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-bold uppercase text-neutral-400">
                    Guest
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="h-3.5 w-3.5 text-neutral-500" />
                Placed on {formatDate(placedDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-neutral-200 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-h-[72vh] overflow-y-auto p-6 space-y-6 scrollbar-none">
          {/* Customer & Fulfillment 2-Col Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffb4a2] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#ffb4a2]" /> Customer Details
                </p>
              </div>
              <div>
                <p className="text-base font-bold text-white">{custName}</p>
                <p className="text-xs text-neutral-300 flex items-center gap-1.5 mt-1.5">
                  <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" /> {custPhone}
                </p>
                <p className="text-xs text-neutral-300 flex items-center gap-1.5 mt-1">
                  <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" /> {custEmail}
                </p>
              </div>
              {custPhone && custPhone !== "N/A" && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleWhatsAppCustomer}
                    className="w-full h-8 text-[11px] font-bold rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/25 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Message Customer via WhatsApp
                  </button>
                </div>
              )}
            </div>

            {/* Delivery & Payment Box */}
            <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffb4a2] flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-[#ffb4a2]" /> Fulfillment & Payment
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-1.5 text-neutral-300">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <span className="text-neutral-200 break-words">{custAddress}</span>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <span className="text-neutral-400 font-medium">Payment Method:</span>
                  <span className="font-bold uppercase text-white tracking-wider">{paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-medium">Payment Status:</span>
                  <span className={`font-bold uppercase tracking-wider ${paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] overflow-hidden">
            <div className="bg-[#242424] px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5 text-[#D9381E]" />
                Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
              </p>
            </div>
            <div className="divide-y divide-white/5">
              {order.items.map((item, idx) => (
                <div
                  key={`${item.itemId || item.title}-${idx}`}
                  className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image_url ? (
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/40 border border-white/10 text-orange-400">
                        <Flame className="h-5 w-5" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {item.title}
                      </p>
                      {item.breakdown && (
                        <p className="text-[11px] text-[#ffb4a2] truncate">
                          {item.breakdown}
                        </p>
                      )}
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Qty: <span className="font-bold text-neutral-200">{item.quantity}</span> × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="font-[family:var(--font-serif)] text-sm font-bold text-white tabular-nums shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Notes (if any) */}
          {orderNotes && (
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffb4a2]">
                Special Order Notes
              </p>
              <p className="text-xs text-neutral-300 italic">&ldquo;{orderNotes}&rdquo;</p>
            </div>
          )}

          {/* Invoice Summary Total */}
          <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 space-y-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Items Subtotal</span>
              <span className="font-semibold text-neutral-200">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Delivery Fee</span>
              <span className="font-semibold text-neutral-200">
                {order.deliveryFee > 0 ? formatCurrency(order.deliveryFee) : "Free Delivery"}
              </span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2.5 text-base font-bold">
              <span className="text-white">Grand Total</span>
              <span className="font-[family:var(--font-serif)] text-2xl text-[#D9381E] tabular-nums font-extrabold">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#121212] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            Close
          </button>

          {onStatusChange && (
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Update Status:</span>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(orderId, e.target.value as OrderStatus)}
                className="rounded-xl border border-white/20 bg-[#222] px-3 py-2 text-xs font-bold text-white focus:border-[#D9381E] focus:outline-none cursor-pointer"
              >
                <option value="placed">Placed</option>
                <option value="preparing">In The Kitchen</option>
                <option value="ready">Ready For Pickup</option>
                <option value="out-for-delivery">Out For Delivery</option>
                <option value="delivered">Delivered & Paid</option>
              </select>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

