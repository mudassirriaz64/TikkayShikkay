"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Truck,
  CreditCard,
  Banknote,
  Loader2,
  Gift,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactInput } from "@/components/ui/contact/ContactInput";
import { Reveal } from "@/components/motion/Reveal";
import { useCart } from "@/context/CartContext";
import { useAccount } from "@/providers/AccountProvider";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";

interface DeliveryFormValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  order_notes: string;
}

type DeliveryFormErrors = Partial<Record<keyof DeliveryFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{6,}$/;

export function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    cartItemCount,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    incrementItem,
    decrementItem,
    removeFromCart,
    placeOrder,
    orderStatus,
    lastOrderError,
    clearOrderStatus,
  } = useCart();

  const { profile, backendUser, isSignedIn } = useAccount();

  const [values, setValues] = useState<DeliveryFormValues>({
    name: "",
    phone: "",
    email: "",
    address: "",
    order_notes: "",
  });

  const [errors, setErrors] = useState<DeliveryFormErrors>({});
  const [showLoyaltyBanner, setShowLoyaltyBanner] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto pre-fill if user profile is available
  useEffect(() => {
    if (profile) {
      setValues((prev) => ({
        ...prev,
        name: prev.name || profile.name || "",
        phone: prev.phone || profile.phone || "",
        email: prev.email || profile.email || "",
        address: prev.address || profile.address || "",
      }));
    }
  }, [profile]);

  const setField =
    (field: keyof DeliveryFormValues) => (value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (lastOrderError) {
        clearOrderStatus();
      }
    };

  const validate = (): DeliveryFormErrors => {
    const errs: DeliveryFormErrors = {};

    if (!values.name.trim()) {
      errs.name = "Please enter your full name.";
    }

    if (!values.phone.trim()) {
      errs.phone = "Please enter your phone number.";
    } else if (!PHONE_PATTERN.test(values.phone.trim())) {
      errs.phone = "Please enter a valid phone number.";
    }

    if (!values.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!values.address.trim()) {
      errs.address = "Please enter your delivery / dining address.";
    } else if (values.address.trim().length < 5) {
      errs.address = "Please enter a complete delivery address.";
    }

    return errs;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // scroll to first error
      const firstErrorKey = Object.keys(nextErrors)[0];
      const el = document.getElementById(`checkout-${firstErrorKey}`);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await placeOrder({
        user_id: backendUser?.id,
        customer_name: values.name.trim(),
        customer_email: values.email.trim(),
        customer_phone: values.phone.trim(),
        customer_address: values.address.trim(),
        order_notes: values.order_notes.trim() || undefined,
        payment_method: "cash",
        deliveryFee,
      });

      if (res.success && res.order) {
        const orderId = (res.order as any)._id || res.order.id;
        router.push(`/order-confirmation/${orderId}`);
      }
    } catch {
      // error handled in CartContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty Cart State
  if (items.length === 0) {
    return (
      <section className="min-h-[75vh] flex items-center justify-center bg-[var(--bg-deep)] py-[88px] lg:py-[120px]">
        <div className="mx-auto max-w-[1280px] px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-md rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
          >
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--accent-orange)]/12 text-[var(--accent-orange)] mb-6">
              <ShoppingBag className="h-10 w-10" />
            </span>
            <h1 className="font-[family:var(--font-serif)] text-2xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
              Your Cart is Empty
            </h1>
            <p className="mt-3 text-sm text-[var(--text-body)] leading-relaxed">
              Looks like you haven&apos;t added any sizzling grills or platters yet. Explore our handcrafted menu to fill your table.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/menu">
                <Button variant="primary" className="w-full h-12 rounded-xl">
                  Explore Menu
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full h-12 rounded-xl">
                  Return to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        {/* Header Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--accent-peach)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Link>

          <span className="rounded-full border border-[var(--border-warm)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold text-[var(--text-body)]">
            {cartItemCount} {cartItemCount === 1 ? "Item" : "Items"} in Cart
          </span>
        </div>

        {/* Loyalty Club Guest Teaser Banner */}
        <AnimatePresence>
          {!isSignedIn && showLoyaltyBanner && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 relative overflow-hidden rounded-2xl border border-[var(--accent-orange)]/40 bg-gradient-to-r from-[var(--accent-orange)]/15 via-[var(--bg-surface)] to-[var(--bg-surface)] p-5 backdrop-blur-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_20px_rgba(255,86,42,0.4)]">
                    <Gift className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                        Join the Tikkay Shikkay Loyalty Club
                      </p>
                      <span className="rounded-full bg-[var(--accent-gold)]/20 px-2 py-0.5 text-[9px] font-extrabold uppercase text-[var(--accent-gold)]">
                        Perks
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      Sign in or create an account to save your address, earn loyalty points, and access WhatsApp VIP promos.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href="/accounts">
                    <Button variant="outline" size="sm" className="rounded-xl border-[var(--accent-orange)]/50 text-[var(--accent-peach)] hover:bg-[var(--accent-orange)]/10 text-xs">
                      Sign In / Join
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowLoyaltyBanner(false)}
                    className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label="Dismiss banner"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            {/* Left Column: Delivery & Payment Details Form */}
            <div className="space-y-8">
              {/* Delivery Details Card */}
              <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between border-b border-[var(--border-warm)]/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-orange)]/12 text-[var(--accent-orange)]">
                      <Truck className="h-5 w-5" />
                    </span>
                    <h2 className="font-[family:var(--font-serif)] text-xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                      Delivery Details
                    </h2>
                  </div>
                  {isSignedIn && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-peach)] font-semibold">
                      <ShieldCheck className="h-4 w-4" /> Logged In
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <ContactInput
                    id="checkout-name"
                    label="Full Name"
                    name="name"
                    value={values.name}
                    onChange={setField("name")}
                    error={errors.name}
                    required
                    autoComplete="name"
                  />
                  <ContactInput
                    id="checkout-phone"
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={setField("phone")}
                    error={errors.phone}
                    required
                    autoComplete="tel"
                  />
                </div>

                <ContactInput
                  id="checkout-email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={setField("email")}
                  error={errors.email}
                  required
                  autoComplete="email"
                />

                <ContactInput
                  id="checkout-address"
                  label="Delivery Address / Area"
                  name="address"
                  value={values.address}
                  onChange={setField("address")}
                  error={errors.address}
                  required
                  textarea
                  rows={3}
                  autoComplete="street-address"
                />

                <ContactInput
                  id="checkout-order_notes"
                  label="Order Notes / Special Requests (Optional)"
                  name="order_notes"
                  value={values.order_notes}
                  onChange={setField("order_notes")}
                  textarea
                  rows={2}
                />
              </div>

              {/* Payment Method Card */}
              <div className="rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 space-y-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-3 border-b border-[var(--border-warm)]/60 pb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-peach)]/12 text-[var(--accent-peach)]">
                    <Banknote className="h-5 w-5" />
                  </span>
                  <h2 className="font-[family:var(--font-serif)] text-xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Selected: Cash on Delivery / Pay at Counter */}
                  <div className="relative flex items-center justify-between rounded-2xl border-2 border-[var(--accent-orange)] bg-[var(--accent-orange)]/10 p-4 transition-all">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-orange)] text-[var(--text-on-orange)]">
                        <Banknote className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-bold text-sm text-[var(--text-primary)]">
                          Cash on Delivery / Pay at Counter
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          Pay directly upon doorstep delivery or when picking up your grill order.
                        </p>
                      </div>
                    </div>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-orange)] text-[var(--text-on-orange)]">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Disabled: Online Card / Digital Payments */}
                  <div className="relative flex items-center justify-between rounded-2xl border border-[var(--border-warm)]/50 bg-[var(--bg-surface-alt)]/40 p-4 opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface-raised)] text-[var(--text-faint)]">
                        <CreditCard className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-bold text-sm text-[var(--text-body)]">
                          Debit / Credit Card / Online Gateway
                        </p>
                        <p className="text-xs text-[var(--text-faint)]">
                          Online digital payment integration coming soon.
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[var(--bg-surface-raised)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
                      Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Review */}
            <div className="space-y-6">
              <div className="sticky top-28 rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                <h2 className="font-[family:var(--font-serif)] text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] border-b border-[var(--border-warm)]/60 pb-4">
                  Order Summary
                </h2>

                {/* Itemized List */}
                <ul className="divide-y divide-[var(--border-warm)]/40 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin my-4">
                  {items.map((cart) => (
                    <li
                      key={cart.item.id}
                      className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--border-warm)]">
                          <Image
                            src={cart.item.image_url || "/images/menu/default.jpg"}
                            alt={cart.item.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold uppercase tracking-wide text-[var(--text-primary)] truncate">
                            {cart.item.title}
                          </p>
                          {cart.item.description && (
                            <p className="text-xs text-[var(--text-faint)] line-clamp-1 mt-0.5">
                              {cart.item.description}
                            </p>
                          )}
                          <p className="text-xs font-semibold text-[var(--accent-peach)] mt-1">
                            {formatCurrency(cart.item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls & Delete */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-sm font-bold tabular-nums text-[var(--text-primary)]">
                          {formatCurrency(cart.item.price * cart.quantity)}
                        </span>
                        <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border-warm)] bg-[var(--bg-base)] p-0.5">
                          <button
                            type="button"
                            onClick={() => decrementItem(cart.item.id)}
                            aria-label={`Decrease ${cart.item.title}`}
                            className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-[var(--text-primary)]">
                            {cart.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => incrementItem(cart.item.id)}
                            aria-label={`Increase ${cart.item.title}`}
                            className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(cart.item.id)}
                            aria-label={`Remove ${cart.item.title}`}
                            className="flex h-6 w-6 items-center justify-center rounded text-rose-400 hover:text-rose-300 ml-1 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Price Breakdown */}
                <dl className="space-y-2.5 border-t border-[var(--border-warm)]/60 pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[var(--text-muted)]">Subtotal</dt>
                    <dd className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {formatCurrency(cartSubtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--text-muted)]">Delivery Fee</dt>
                    <dd className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {deliveryFee > 0 ? formatCurrency(deliveryFee) : "Free Delivery"}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-[var(--border-warm)]/60 pt-3">
                    <dt className="font-[family:var(--font-serif)] text-base font-bold text-[var(--text-primary)]">
                      Grand Total
                    </dt>
                    <dd className="font-[family:var(--font-serif)] text-2xl font-bold text-[var(--accent-orange)] tabular-nums">
                      {formatCurrency(cartTotal)}
                    </dd>
                  </div>
                </dl>

                {/* Error Banner */}
                {lastOrderError && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-left text-xs text-rose-400">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-bold">Failed to place order</p>
                      <p className="mt-0.5">{lastOrderError}</p>
                    </div>
                  </div>
                )}

                {/* Submit Order Button */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || orderStatus === "placing"}
                  className="mt-6 w-full h-14 rounded-2xl text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,86,42,0.35)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isSubmitting || orderStatus === "placing" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Placing Your Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Confirm & Place Order ({formatCurrency(cartTotal)})
                    </>
                  )}
                </Button>

                <p className="mt-3 text-center text-[11px] text-[var(--text-faint)] leading-relaxed">
                  By clicking Place Order, your grill ticket is dispatched immediately to our master pit crew.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
