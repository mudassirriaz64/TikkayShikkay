"use client";

import { useState } from "react";
import { Star, Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { EmptyState, ReviewCard } from "@/components/ui/accounts";
import { Button } from "@/components/ui/Button";
import { useAccount } from "@/providers/AccountProvider";
import { WriteReviewModal } from "./WriteReviewModal";

export function MyReviewsSection() {
  const { reviews, updateReview, removeReview } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow="My Reviews"
              title="Reviews You"
              accent="Wrote"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="rounded-xl px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Write a Review
            </Button>
          </Reveal>
        </div>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--accent-peach)]/20 bg-[var(--accent-ember)]/10 text-[var(--accent-orange)]">
              <Star className="h-7 w-7" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-[family:var(--font-serif)] text-xl font-bold text-[var(--text-primary)]">
                No reviews yet
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-[var(--text-body)]">
                Share what you loved about your meal — your words help the whole city find great BBQ.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="rounded-xl px-6 text-xs font-bold uppercase tracking-wider mt-2 flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Write Your First Review
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {reviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 0.06}>
                <ReviewCard
                  review={review}
                  onSave={(reviewId, text) =>
                    updateReview(reviewId, { review_text: text })
                  }
                  onDelete={removeReview}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <WriteReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
