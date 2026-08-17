"use client";

import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { EmptyState, ReviewCard } from "@/components/ui/accounts";
import { useAccount } from "@/providers/AccountProvider";

export function MyReviewsSection() {
  const { reviews, updateReview, removeReview } = useAccount();

  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="My Reviews"
            title="Reviews You"
            accent="Wrote"
          />
        </Reveal>

        {reviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No reviews yet"
            description="Share what you loved about your meal - your words help the whole city find great BBQ."
            ctaLabel="Write on the menu"
            ctaHref="/menu"
          />
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
    </section>
  );
}
