"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Minus, Plus, ShoppingBag, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/menu/PriceTag";
import { ProteinBadge } from "@/components/ui/menu/ProteinBadge";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";
import { MenuCategory, MenuItem, PlatterData } from "@/types";
import { useCart } from "@/context/CartContext";

interface ItemStepperRowProps {
  item: MenuItem;
  qty: number;
  onQtyChange: (qty: number) => void;
}

function ItemStepperRow({ item, qty, onQtyChange }: ItemStepperRowProps) {
  const isSelected = qty > 0;
  const isOutOfStock = !item.is_available;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-all duration-300",
        isOutOfStock
          ? "opacity-50 border-[var(--border-warm)]/40 bg-[var(--bg-surface-alt)]/30 cursor-not-allowed"
          : isSelected
          ? "border-[var(--accent-orange)]/70 bg-[var(--accent-orange)]/10 shadow-[0_0_20px_rgba(255,86,42,0.15)]"
          : "border-[var(--border-warm)] bg-[var(--bg-surface)] hover:border-[var(--accent-peach)]/40"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Dish Thumbnail */}
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[var(--border-warm)]">
          <Image
            src={item.image_url || "/images/menu/default.jpg"}
            alt={item.title}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold uppercase tracking-[0.06em] text-[var(--text-primary)] truncate">
              {item.title}
            </p>
            {item.is_bestseller && (
              <span className="shrink-0 rounded-full bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] px-1.5 py-0.2 text-[9px] font-extrabold uppercase">
                ★ Best
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-[var(--accent-peach)] font-semibold">
              Rs {item.price.toLocaleString()}
            </p>
            {item.spice_level && (
              <span className="text-[10px] text-[var(--text-faint)] flex items-center gap-0.5">
                <Flame className="h-2.5 w-2.5 text-amber-500" /> {item.spice_level}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Stepper (0 to 5) */}
      <div className="flex items-center gap-2 shrink-0">
        {isOutOfStock ? (
          <span className="text-[11px] font-semibold text-rose-400">Sold Out</span>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onQtyChange(Math.max(0, qty - 1))}
              disabled={qty === 0}
              aria-label={`Decrease ${item.title}`}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg border transition-all",
                qty > 0
                  ? "border-[var(--border-warm)] bg-[var(--bg-base)] text-[var(--text-primary)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]"
                  : "border-[var(--border-warm)]/40 bg-transparent text-[var(--text-faint)] opacity-40 cursor-not-allowed"
              )}
            >
              <Minus className="h-3 w-3" />
            </button>

            <span
              className={cn(
                "w-5 text-center text-sm font-bold",
                qty > 0 ? "text-[var(--accent-orange)]" : "text-[var(--text-faint)]"
              )}
            >
              {qty}
            </span>

            <button
              type="button"
              onClick={() => onQtyChange(Math.min(5, qty + 1))}
              disabled={qty >= 5}
              aria-label={`Increase ${item.title}`}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg border transition-all",
                qty < 5
                  ? "border-[var(--border-warm)] bg-[var(--bg-base)] text-[var(--text-primary)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]"
                  : "border-[var(--border-warm)]/40 bg-transparent text-[var(--text-faint)] opacity-40 cursor-not-allowed"
              )}
            >
              <Plus className="h-3 w-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface BuildPlatterProps {
  data?: PlatterData;
  categories?: MenuCategory[];
  items?: MenuItem[];
  embedded?: boolean;
}

export function BuildPlatter({
  data,
  categories = [],
  items = [],
  embedded = false,
}: BuildPlatterProps) {
  // Filter out Platters category so users don't nest a full pre-built platter into a build
  const eligibleCategories = useMemo(() => {
    const valid = categories.filter(
      (c) => c.slug !== "platters" && !c.name.toLowerCase().includes("platter")
    );
    if (valid.length > 0) return valid;
    // Fallback default categories if categories list is empty
    return [
      { id: "cat-tikka", name: "Tikka", slug: "tikka", display_order: 1 },
      { id: "cat-boti", name: "Boti", slug: "boti", display_order: 2 },
      { id: "cat-sides", name: "Sides & Bread", slug: "sides", display_order: 3 },
      { id: "cat-drinks", name: "Drinks", slug: "drinks", display_order: 4 },
    ];
  }, [categories]);

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    eligibleCategories[0]?.id || ""
  );

  // Quantities mapped by item id: Record<itemId, quantity>
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState(false);
  const { addToCart } = useCart();
  const reducedMotion = useReducedMotion();

  function setItemQty(id: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  }

  // Active items currently selected
  const selectedItemsList = useMemo(() => {
    return items
      .filter((item) => (quantities[item.id] || 0) > 0)
      .map((item) => ({ ...item, qty: quantities[item.id] }));
  }, [items, quantities]);

  const totalItemCount = selectedItemsList.reduce((acc, i) => acc + i.qty, 0);

  // Active category's items
  const currentCategoryItems = useMemo(() => {
    const selectedCat = eligibleCategories.find((c) => c.id === activeCategoryId);
    if (!selectedCat) return [];

    return items.filter(
      (item) =>
        item.category_id === selectedCat.id ||
        (item as any).category_id?._id === selectedCat.id ||
        item.slug?.includes(selectedCat.slug)
    );
  }, [eligibleCategories, activeCategoryId, items]);

  // Total price calculation: Rs 0 if nothing selected, otherwise sum of chosen items
  const total = useMemo(() => {
    if (selectedItemsList.length === 0) return 0;
    const itemsSum = selectedItemsList.reduce((acc, i) => acc + i.price * i.qty, 0);
    return itemsSum;
  }, [selectedItemsList]);

  // Validation: At least one item chosen
  const isValid = totalItemCount > 0;

  function handleAddToCart() {
    if (!isValid) return;

    // Generate descriptive breakdown title
    const breakdown = selectedItemsList.map((i) => `${i.qty}x ${i.title}`).join(", ");

    const platterCartItem: MenuItem = {
      id: `custom-platter-${Date.now()}`,
      category_id: "platters",
      title: `Custom Platter (${totalItemCount} Items)`,
      slug: `custom-platter-${Date.now()}`,
      description: `Included: ${breakdown}`,
      price: total,
      spice_level: "Medium",
      is_bestseller: false,
      is_available: true,
      image_url: data?.imageUrl || "/images/menu/platter-biryani.jpg",
    };

    addToCart(platterCartItem);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  }

  const content = (
    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      {/* Left Column: Category Filter Pills & Items Stepper List */}
      <div>
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent-peach)] mb-2">
            Step 1 — Browse Menu Categories
          </p>
          {/* Category Filter Pills */}
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
            {eligibleCategories.map((cat) => {
              const countInCat = items
                .filter(
                  (item) =>
                    item.category_id === cat.id ||
                    (item as any).category_id?._id === cat.id ||
                    item.slug?.includes(cat.slug)
                )
                .reduce((sum, item) => sum + (quantities[item.id] || 0), 0);

              const isActive = activeCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                    isActive
                      ? "border-[var(--accent-orange)] bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_15px_rgba(255,86,42,0.3)]"
                      : "border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-body)] hover:border-[var(--accent-peach)]/40 hover:text-[var(--text-primary)]"
                  )}
                >
                  <span>{cat.name}</span>
                  {countInCat > 0 && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.2 text-[9px] font-black",
                        isActive
                          ? "bg-black/25 text-white"
                          : "bg-[var(--accent-orange)] text-white"
                      )}
                    >
                      {countInCat}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Items in Selected Category */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Step 2 — Set Quantities (0 to 5)
            </p>
            <span className="text-xs font-semibold text-[var(--accent-orange)]">
              {totalItemCount} Total Items in Platter
            </span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {currentCategoryItems.length > 0 ? (
              currentCategoryItems.map((item) => (
                <ItemStepperRow
                  key={item.id}
                  item={item}
                  qty={quantities[item.id] || 0}
                  onQtyChange={(qty) => setItemQty(item.id, qty)}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--border-warm)] p-6 text-center text-xs text-[var(--text-muted)]">
                No items available in this category.
              </div>
            )}
          </div>
        </div>

        {/* Selected Composition Live Summary */}
        {selectedItemsList.length > 0 && (
          <div className="mt-6 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface-alt)]/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Current Platter Composition:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedItemsList.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-warm)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)]"
                >
                  <span className="text-[var(--accent-orange)] font-bold">{item.qty}x</span>
                  <span>{item.title}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Estimated Total & Add to Cart */}
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Estimated Total
              </p>
              <motion.span
                key={total}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="block"
              >
                <PriceTag price={total} className="text-3xl" />
              </motion.span>
              {!isValid && (
                <p className="text-xs text-amber-400 mt-1 font-semibold">
                  Select at least 1 menu item to build your platter
                </p>
              )}
            </div>

            <Button
              variant="primary"
              onClick={handleAddToCart}
              disabled={!isValid}
              className={cn(
                "h-12 gap-2 rounded-xl px-7 transition-all duration-300",
                isValid
                  ? "hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(255,86,42,0.4)] cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              {addedNotice ? (
                <>
                  <Check className="h-4 w-4" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Lock In Platter
                </>
              )}
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Right Column: Visual Photo & Live Protein Badge */}
      <Reveal delay={0.1} className="h-full">
        <div className="group relative sticky top-28">
          <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-warm)] shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
            <motion.div
              animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-[4/5]"
            >
              <Image
                src={data?.imageUrl || "/images/menu/platter-biryani.jpg"}
                alt="Signature Tikkay Shikkay platter"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                loading="lazy"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/75 via-transparent to-transparent" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 top-0 h-full w-28 rotate-[18deg] bg-white/5 blur-2xl"
            />
          </div>

          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute -right-2 top-8 md:-right-5"
          >
            <ProteinBadge
              value={totalItemCount > 0 ? `${totalItemCount} Items` : "Custom Spread"}
              label="Live Grill Feast"
            />
          </motion.div>
        </div>
      </Reveal>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <section
      id="platters"
      className="scroll-mt-[140px] bg-[var(--bg-deep)] py-[88px] lg:py-[112px]"
    >
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        {content}
      </div>
    </section>
  );
}
