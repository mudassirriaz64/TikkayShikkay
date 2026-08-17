"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import { FilterButton } from "@/components/ui/reviews/FilterButton";
import { ReviewCard } from "@/components/ui/reviews/ReviewCard";
import { Reveal } from "@/components/motion/Reveal";
import { CustomerReview, ReviewCategoryFilter } from "@/types";

interface ReviewsGridProps {
  reviews: CustomerReview[];
  categories: ReviewCategoryFilter[];
}

export function ReviewsGrid({ reviews, categories }: ReviewsGridProps) {
  const [activeId, setActiveId] = useState("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: reviews.length };
    for (const category of categories) {
      if (category.id === "all") continue;
      map[category.id] = reviews.filter(
        (review) => review.category.toLowerCase() === category.id,
      ).length;
    }
    return map;
  }, [reviews, categories]);

  const visibleReviews = useMemo(() => {
    if (activeId === "all") return reviews;
    return reviews.filter(
      (review) => review.category.toLowerCase() === activeId,
    );
  }, [reviews, activeId]);

  return (
    <section
      id="reviews"
      className="scroll-mt-[140px] bg-[var(--bg-base)] py-[88px] lg:py-[112px]"
    >
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
            From The Community
          </span>
          <h2 className="mt-3 font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-5xl">
            What The Table{" "}
            <em className="font-normal italic text-[var(--accent-peach)]">
              Says
            </em>
          </h2>
        </Reveal>
      </div>

      <div className="sticky top-[60px] z-30 border-y border-[var(--border-warm)]/40 bg-[var(--bg-base)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
          <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 py-4 lg:mx-0 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 lg:py-5">
            {categories.map((category) => (
              <FilterButton
                key={category.id}
                label={category.label}
                count={counts[category.id] ?? 0}
                active={activeId === category.id}
                onClick={() => setActiveId(category.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pt-12 lg:px-[64px]">
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleReviews.map((review, index) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <ReviewCard review={review} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visibleReviews.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-ember)]/15 text-[var(--accent-orange)]">
              <Flame className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-5 font-[family:var(--font-serif)] text-xl font-bold text-[var(--text-primary)]">
              No stories here yet
            </p>
            <p className="mt-2 text-sm text-[var(--text-body)]">
              Be the first to leave a review in this category.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
