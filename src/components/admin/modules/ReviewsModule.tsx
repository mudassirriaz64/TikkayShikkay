"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Badge, EmptyState, PageHeader, SectionCard, StatCard } from "../ui/panel";
import { Button } from "@/components/ui/Button";
import { Toggle } from "../ui/controls";
import { cn } from "@/lib/utils/cn";
import { CustomerReview } from "@/types";
import { reviewsService } from "@/lib/api/reviews.service";
import {
  Crown,
  MessageSquareQuote,
  Star,
  ThumbsUp,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export function ReviewsModule() {
  const { data, updateSlice } = useAdminData();
  const [filter, setFilter] = useState("all");
  const [liveReviews, setLiveReviews] = useState<CustomerReview[]>(data.reviews.reviews || []);
  const [loading, setLoading] = useState(false);

  const fetchLiveReviews = useCallback(async () => {
    setLoading(true);
    try {
      const pageData = await reviewsService.getPageData();
      if (pageData?.reviews) {
        setLiveReviews(pageData.reviews);
        updateSlice("reviews", { ...data.reviews, reviews: pageData.reviews });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [data.reviews, updateSlice]);

  useEffect(() => {
    void fetchLiveReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reviews = liveReviews.length > 0 ? liveReviews : data.reviews.reviews;
  const filtered =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.category?.toLowerCase() === filter);

  const avgRating =
    data.reviews.statistics.find((s) => s.label === "Average Rating")?.value ?? 4.9;
  const visible = reviews.filter((r) => r.is_approved).length;

  async function toggleApproved(review: CustomerReview) {
    const nextApproved = !review.is_approved;
    const updated = reviews.map((r) =>
      r.id === review.id ? { ...r, is_approved: nextApproved } : r
    );
    setLiveReviews(updated);
    updateSlice("reviews", { ...data.reviews, reviews: updated });

    try {
      if (nextApproved) {
        await reviewsService.approve(review.id);
      } else {
        await reviewsService.update(review.id, { is_approved: false });
      }
    } catch {
      // rollback if needed
    }
  }

  async function toggleVerified(review: CustomerReview) {
    const nextVerified = !review.verified;
    const updated = reviews.map((r) =>
      r.id === review.id ? { ...r, verified: nextVerified } : r
    );
    setLiveReviews(updated);
    updateSlice("reviews", { ...data.reviews, reviews: updated });

    try {
      await reviewsService.update(review.id, { verified: nextVerified });
    } catch {
      // ignore
    }
  }

  function setFeatured(review: CustomerReview) {
    updateSlice("reviews", { ...data.reviews, featured: review });
  }

  const filters = ["all", ...data.reviews.categories
    .filter((c) => c.id !== "all")
    .map((c) => c.id)];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Guest Voice"
        title="Reviews"
        description="Approve, verify and feature the words that fill your tables."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={MessageSquareQuote}
          label="Total Reviews"
          value={String(reviews.length)}
          sub="In the moderation queue"
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={String(avgRating)}
          sub="Across all reviews"
        />
        <StatCard
          icon={CheckCircle2}
          label="Publicly Visible"
          value={String(visible)}
          sub="Approved & live on the site"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300",
              filter === id
                ? "border-[var(--accent-orange)]/40 bg-[var(--accent-orange)]/12 text-[var(--accent-orange)]"
                : "border-[var(--border-warm)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            )}
          >
            {id === "all" ? "All" : id}
          </button>
        ))}
      </div>

      <SectionCard title="Moderation Queue" description="Review each guest's story before it goes live">
        {filtered.length === 0 ? (
          <EmptyState
            icon={MessageSquareQuote}
            title="Nothing here"
            description="No reviews match this filter yet."
          />
        ) : (
          <ul className="divide-y divide-[var(--border-warm)]">
            {filtered.map((review) => {
              const isFeatured = data.reviews.featured.id === review.id;
              return (
                <li key={review.id} className="py-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
                          {review.customer_name}
                        </p>
                        <Badge tone="neutral">{review.location}</Badge>
                        <Badge tone="peach">{review.category}</Badge>
                        <Badge tone="gold">{review.source}</Badge>
                        {isFeatured ? (
                          <Badge tone="orange">
                            <Crown className="h-3 w-3" /> Featured
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-[var(--accent-gold)]" aria-label={`${review.rating} out of 5 stars`}>
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </p>
                      <p className="mt-2 text-sm font-bold text-[var(--text-primary)]">
                        {review.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                        {review.review_text}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {review.helpful_count} found this helpful · {review.visit_date}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-3 lg:w-56">
                      <Toggle
                        checked={review.is_approved}
                        onChange={() => toggleApproved(review)}
                        label="Approved"
                        description="Visible on the public site"
                      />
                      <Toggle
                        checked={review.verified}
                        onChange={() => toggleVerified(review)}
                        label="Verified"
                        description="Confirmed guest badge"
                      />
                      {isFeatured ? (
                        <p className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-orange)]">
                          Currently featured
                        </p>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setFeatured(review)}
                        >
                          <Crown className="mr-1.5 h-3.5 w-3.5" /> Set Featured
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
