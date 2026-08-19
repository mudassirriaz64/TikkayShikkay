"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { FeaturedMenuCard } from "@/components/ui/menu/FeaturedMenuCard";
import { BuildPlatter } from "./BuildPlatter";
import { MenuCategory, MenuItem, PlatterData } from "@/types";
import { cn } from "@/lib/utils/cn";
import { UtensilsCrossed, Sparkles } from "lucide-react";

interface PlattersSectionProps {
  curatedItems: MenuItem[];
  categories?: MenuCategory[];
  allItems?: MenuItem[];
  platterData?: PlatterData;
  stepNumber?: string;
}

type PlatterTab = "curated" | "builder";

export function PlattersSection({
  curatedItems,
  categories = [],
  allItems = [],
  platterData,
  stepNumber = "03 / 05",
}: PlattersSectionProps) {
  const [activeTab, setActiveTab] = useState<PlatterTab>("curated");
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="platters"
      className="scroll-mt-[140px] bg-[var(--bg-deep)] py-10 lg:py-14 border-t border-[var(--border-warm)]/40"
    >
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        {/* Section Header */}
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
              For Every Gathering
            </span>
            <h2 className="mt-3 font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-5xl">
              Signature &amp; Custom{" "}
              <em className="font-normal italic text-[var(--accent-peach)]">Platters</em>
            </h2>
            <p className="mt-3 max-w-[60ch] text-sm text-[var(--text-body)]">
              Choose from our chef-curated family feasts or build your own custom combination off the live coals.
            </p>
          </div>
          <span className="font-[family:var(--font-serif)] text-sm font-bold tracking-[0.2em] text-[var(--text-muted)]">
            {stepNumber}
          </span>
        </Reveal>

        {/* Section Sub-Navigation Tabs */}
        <Reveal delay={0.05} className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)]/80 p-1.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab("curated")}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300",
                activeTab === "curated"
                  ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_20px_rgba(255,86,42,0.3)]"
                  : "text-[var(--text-body)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)]"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Platters</span>
              {curatedItems.length > 0 && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                    activeTab === "curated"
                      ? "bg-black/20 text-white"
                      : "bg-[var(--bg-surface-alt)] text-[var(--text-muted)]"
                  )}
                >
                  {curatedItems.length}
                </span>
              )}
            </button>

            {platterData ? (
              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300",
                  activeTab === "builder"
                    ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_20px_rgba(255,86,42,0.3)]"
                    : "text-[var(--text-body)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)]"
                )}
              >
                <UtensilsCrossed className="h-3.5 w-3.5" />
                <span>Build Your Own</span>
              </button>
            ) : null}
          </div>
        </Reveal>

        {/* Tab Content Panes with AnimatePresence */}
        <AnimatePresence mode="wait">
          {activeTab === "curated" && (
            <motion.div
              key="curated-tab"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {curatedItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {curatedItems.map((item, index) => (
                    <Reveal key={item.id} delay={index * 0.08} className="h-full">
                      <FeaturedMenuCard item={item} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-12 text-center">
                  <p className="text-sm text-[var(--text-muted)]">
                    No pre-built group platters currently listed. Check out the &quot;Build Your Own&quot; tab to customize your own feast!
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "builder" && (
            <motion.div
              key="builder-tab"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <BuildPlatter
                data={platterData}
                categories={categories}
                items={allItems}
                embedded
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
