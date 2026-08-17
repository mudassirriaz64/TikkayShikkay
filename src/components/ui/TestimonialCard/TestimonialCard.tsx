import { Card } from "../Card";
import { TestimonialCardProps } from "./TestimonialCard.types";
import { cn } from "@/lib/utils/cn";
import { initialsAvatar } from "@/lib/utils/avatar";
import { Star } from "lucide-react";
import Image from "next/image";

export function TestimonialCard({
  review,
  index,
  className,
  ...props
}: TestimonialCardProps) {
  const borderColors = [
    "border-l-[var(--accent-peach)]",
    "border-l-[var(--accent-gold)]",
    "border-l-[var(--text-muted)]",
  ];
  const borderColor = borderColors[index % borderColors.length];

  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-4 border-l-4 rounded-r-2xl border-r border-y border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-6",
        borderColor,
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[var(--bg-surface-hover)] bg-[var(--bg-surface)]">
          <Image
            src={initialsAvatar(review.customer_name, index)}
            alt={review.customer_name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-[family:var(--font-serif)] font-bold text-[var(--text-primary)]">
            {review.customer_name}
          </h4>
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < review.rating
                    ? "fill-[var(--accent-peach)] text-[var(--accent-peach)]"
                    : "fill-transparent text-[var(--text-muted)] opacity-30",
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm italic leading-relaxed text-[var(--text-body)]">
        "{review.review_text}"
      </p>
      <div className="mt-auto pt-4 border-t border-[var(--border-warm)]">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          via {review.source}
        </span>
      </div>
    </Card>
  );
}
