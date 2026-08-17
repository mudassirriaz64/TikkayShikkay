"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, PencilLine, Trash2, X } from "lucide-react";
import { StarRating } from "@/components/ui/reviews/StarRating";
import { ContactInput } from "@/components/ui/contact/ContactInput";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";
import { AccountReview } from "@/types";

interface ReviewCardProps {
  review: AccountReview;
  onSave: (reviewId: string, text: string) => void;
  onDelete: (reviewId: string) => void;
}

export function ReviewCard({ review, onSave, onDelete }: ReviewCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(review.review_text);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(review.id, draft.trim() || review.review_text);
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <StarRating rating={review.rating} />
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                review.is_approved
                  ? "border-[var(--accent-peach)]/40 bg-[var(--accent-peach)]/10 text-[var(--accent-peach)]"
                  : "border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]",
              )}
            >
              {review.is_approved ? "Approved" : "Pending"}
            </span>
          </div>
          <h3 className="font-[family:var(--font-serif)] text-base font-bold text-[var(--text-primary)]">
            {review.dish}
          </h3>
          <p className="text-xs text-[var(--text-faint)]">
            Reviewed on {formatDate(review.created_at)}
          </p>
        </div>

        {!editing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDraft(review.review_text);
                setEditing(true);
              }}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-warm)] px-3 text-xs font-bold uppercase tracking-wider text-[var(--text-body)] transition-colors hover:bg-[var(--bg-surface-alt)] hover:text-[var(--accent-peach)]"
            >
              <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(review.id)}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-warm)] px-3 text-xs font-bold uppercase tracking-wider text-[var(--text-body)] transition-colors hover:bg-[var(--accent-ember)]/10 hover:text-[var(--accent-ember)]"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Delete
            </button>
          </div>
        ) : null}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              <ContactInput
                id={`review-edit-${review.id}`}
                label="Edit your review"
                textarea
                rows={4}
                value={draft}
                onChange={setDraft}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg"
                >
                  {saved ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Saved!
                    </>
                  ) : (
                    "Save review"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 rounded-lg"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm leading-relaxed text-[var(--text-body)]"
          >
            {review.review_text}
          </motion.p>
        )}
      </AnimatePresence>
    </article>
  );
}
