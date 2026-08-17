"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SIZE_MAP = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

interface StarRatingProps {
  rating: number;
  size?: keyof typeof SIZE_MAP;
  className?: string;
  label?: string;
}

export function StarRating({
  rating,
  size = "sm",
  className,
  label,
}: StarRatingProps) {
  const [hovering, setHovering] = useState(false);
  const fillLevel = hovering ? 5 : rating;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      role="img"
      aria-label={label ?? `${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
        >
          <Star
            className={cn(
              SIZE_MAP[size],
              "transition-colors duration-300",
              i < fillLevel
                ? "fill-[var(--accent-peach)] text-[var(--accent-peach)]"
                : "fill-transparent text-[var(--text-muted)] opacity-40",
            )}
          />
        </motion.span>
      ))}
    </div>
  );
}
