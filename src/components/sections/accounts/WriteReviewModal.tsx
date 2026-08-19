"use client";

import { useState, type FormEvent } from "react";
import { Star, X, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { reviewsService } from "@/lib/api/reviews.service";
import { useAccount } from "@/providers/AccountProvider";
import { CustomerReview, ReviewCategory } from "@/types";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newReview: CustomerReview) => void;
}

const CATEGORIES: ReviewCategory[] = [
  "Families",
  "Friends",
  "Corporate",
  "Birthday",
  "Couples",
];

export function WriteReviewModal({
  isOpen,
  onClose,
  onSuccess,
}: WriteReviewModalProps) {
  const { profile } = useAccount();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState(profile?.name || "");
  const [location, setLocation] = useState(profile?.address || "Islamabad");
  const [favoriteMeal, setFavoriteMeal] = useState("Chicken Malai Boti");
  const [category, setCategory] = useState<ReviewCategory>("Families");
  const [reviewText, setReviewText] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError("Please write a few words about your experience.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await reviewsService.create({
        customer_name: customerName.trim() || "BBQ Lover",
        location: location.trim() || "Islamabad",
        rating,
        title: favoriteMeal.trim() || "Dining Experience",
        favorite_meal: favoriteMeal.trim() || "Mixed Grill Platter",
        category,
        review_text: reviewText.trim(),
        source: "Direct",
      });

      setSubmitted(true);
      if (onSuccess) onSuccess(created);
    } catch (err: any) {
      setError(err?.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => !submitting && onClose()}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#161616] text-[#e5e2e1] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#121212] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-orange)]/15 text-[var(--accent-orange)]">
              <Star className="h-4 w-4 fill-current" />
            </span>
            <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase text-white">
              Write a Review
            </h3>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="font-[family:var(--font-serif)] text-xl font-bold uppercase text-white">
              Thank You for Your Feedback!
            </h4>
            <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
              Your review has been submitted and shared with the pitmasters. It will appear on the Wall of Love and Reviews feed shortly.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
                className="rounded-xl px-6 text-xs font-bold uppercase"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Interactive Star Rating */}
            <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#1c1c1c] p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Rate Your Experience
              </span>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating ?? rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          filled
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-600"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-amber-300 mt-1">
                {rating === 5
                  ? "5.0 - Absolute Perfection 🔥"
                  : rating === 4
                  ? "4.0 - Great Meal & Atmosphere"
                  : rating === 3
                  ? "3.0 - Good Standard"
                  : rating === 2
                  ? "2.0 - Below Expectations"
                  : "1.0 - Needs Improvement"}
              </span>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mudassir Riaz"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  City / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Islamabad, Lahore, Karachi"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Favorite Dish / Ordered Item
                </label>
                <input
                  type="text"
                  placeholder="e.g. Malai Boti, Seekh Kebabs"
                  value={favoriteMeal}
                  onChange={(e) => setFavoriteMeal(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Experience Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReviewCategory)}
                  className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Your Review & Story *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Tell us what you enjoyed about the charcoal char, flavor, chutneys, or team service..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none resize-none"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between border-t border-white/10 bg-[#121212] -mx-6 -mb-6 px-6 py-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={submitting}
                className="rounded-xl px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
