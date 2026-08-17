"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ContactButtonProps extends ComponentPropsWithoutRef<"button"> {
  showArrow?: boolean;
  children: ReactNode;
}

export function ContactButton({
  children,
  className,
  showArrow = true,
  ...props
}: ContactButtonProps) {
  return (
    <button
      type="submit"
      className={cn(
        "group/contact inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[var(--accent-orange)] px-8 font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.12em] text-[var(--text-on-orange)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(255,86,42,0.4)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/70 disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
      {showArrow ? (
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover/contact:translate-x-1"
        />
      ) : null}
    </button>
  );
}
