"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Receipt,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderStatusTracker } from "@/components/ui/accounts/OrderStatusTracker";
import { ordersService } from "@/lib/api";
import { useAccount } from "@/providers/AccountProvider";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { AccountOrder } from "@/types";

interface OrderConfirmationPageProps {
  orderId: string;
}

export function OrderConfirmationPage({ orderId }: OrderConfirmationPageProps) {
  const { isSignedIn } = useAccount();
  const [order, setOrder] = useState<AccountOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    ordersService
      .getById(orderId)
      .then((data) => {
        if (isMounted) {
          setOrder(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Failed to retrieve order confirmation details.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-[var(--bg-deep)] py-[88px]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--accent-orange)]" />
          <p className="mt-4 text-sm text-[var(--text-faint)]">
            Loading your grill order receipt...
          </p>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-[var(--bg-deep)] py-[88px] lg:py-[120px]">
        <div className="mx-auto max-w-[500px] px-4 text-center">
          <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-8 shadow-2xl">
            <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h1 className="font-[family:var(--font-serif)] text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
              Order Details
            </h1>
            <p className="mt-3 text-sm text-[var(--text-body)] leading-relaxed">
              Order #{orderId} has been placed into our kitchen pipeline.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/menu">
                <Button variant="primary" className="w-full h-11 rounded-xl">
                  Back to Menu
                </Button>
              </Link>
              {isSignedIn && (
                <Link href="/accounts">
                  <Button variant="outline" className="w-full h-11 rounded-xl">
                    View in My Orders
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const rawOrderId = (order as any)._id || order.id || orderId;
  const whatsAppMessage = encodeURIComponent(
    `Hi Tikkay Shikkay! I just placed Order #${rawOrderId}. Could you please confirm my grill status?`
  );

  return (
    <section className="relative bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1000px] px-4 lg:px-[48px]">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_40px_rgba(255,86,42,0.5)] mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
            Order Confirmed
          </span>
          <h1 className="mt-3 font-[family:var(--font-serif)] text-3xl md:text-4xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
            The Charcoal is Fired Up!
          </h1>
          <p className="mt-3 max-w-[50ch] mx-auto text-sm text-[var(--text-body)] leading-relaxed">
            Thank you, <strong className="text-[var(--text-primary)]">{order.customer_name}</strong>. Your ticket is in the kitchen queue. We are grilling everything fresh to order.
          </p>
        </motion.div>

        {/* Live Status Tracker Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.25)] mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-warm)]/60 pb-5 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Order Reference
              </p>
              <p className="font-[family:var(--font-serif)] text-xl font-bold text-[var(--text-primary)] mt-0.5">
                #{rawOrderId}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Calendar className="h-4 w-4 text-[var(--accent-peach)]" />
              <span>Placed {formatDate(order.placedAt || new Date().toISOString())}</span>
            </div>
          </div>

          <div className="py-2">
            <OrderStatusTracker status={order.status} timeline={order.timeline || []} />
          </div>
        </motion.div>

        {/* Invoice & Order Summary Details */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8 mb-10">
          {/* Itemized list */}
          <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-6">
            <h2 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)] border-b border-[var(--border-warm)]/60 pb-3 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-[var(--accent-orange)]" />
              Items Ordered
            </h2>

            <ul className="divide-y divide-[var(--border-warm)]/40">
              {order.items.map((item, idx) => (
                <li
                  key={`${item.itemId || idx}-${idx}`}
                  className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image_url ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[var(--border-warm)]">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                        {item.title}
                      </p>
                      {item.breakdown && (
                        <p className="text-[11px] text-[var(--text-faint)] truncate">
                          {item.breakdown}
                        </p>
                      )}
                      <p className="text-xs text-[var(--text-muted)]">
                        {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-[var(--text-primary)]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 border-t border-[var(--border-warm)]/60 pt-4 text-sm">
              <div className="flex justify-between text-[var(--text-muted)]">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-[var(--text-primary)] tabular-nums">
                  {formatCurrency(order.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <dt>Delivery Fee</dt>
                <dd className="font-semibold text-[var(--text-primary)] tabular-nums">
                  {order.deliveryFee > 0 ? formatCurrency(order.deliveryFee) : "Free Delivery"}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[var(--border-warm)]/60 pt-2 font-bold text-base">
                <dt className="text-[var(--text-primary)]">Total Amount</dt>
                <dd className="font-[family:var(--font-serif)] text-xl text-[var(--accent-orange)] tabular-nums">
                  {formatCurrency(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Delivery destination & WhatsApp Assistance */}
          <div className="space-y-6">
            <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-4">
              <h2 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)] border-b border-[var(--border-warm)]/60 pb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--accent-peach)]" />
                Delivery Information
              </h2>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Customer Name
                  </p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                    {order.customer_name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                    {order.customer_phone}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Delivery Address
                  </p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                    {order.customer_address}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Payment Method
                  </p>
                  <p className="text-sm font-semibold text-[var(--accent-peach)] mt-0.5">
                    Cash on Delivery / Pay at Counter
                  </p>
                </div>
                {order.order_notes && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Notes
                    </p>
                    <p className="text-xs text-[var(--text-body)] mt-0.5">
                      {order.order_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Pitmaster Direct Help */}
            <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface-alt)]/50 p-6 text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Have a question about your order?
              </p>
              <a
                href={`https://wa.me/923001234567?text=${whatsAppMessage}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block w-full"
              >
                <Button variant="whatsapp" className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-xs">
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-[var(--border-warm)]/40">
          <Link href="/menu" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto h-12 px-8 rounded-xl flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Explore More Dishes
            </Button>
          </Link>
          {isSignedIn ? (
            <Link href="/accounts" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl flex items-center justify-center gap-2">
                <span>View in My Orders</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/accounts" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--accent-gold)]" />
                <span>Join Loyalty Club</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
