import { cn } from "@/lib/utils/cn";
import { CardProps } from "./Card.types";
import { forwardRef } from "react";

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-warm)] overflow-hidden transition-all duration-300 hover:border-[var(--accent-peach)]/35 hover:-translate-y-0.5",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
