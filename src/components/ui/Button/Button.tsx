import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { ButtonProps } from "./Button.types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref,
  ) => {
    const baseStyles =
      "group/btn relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-transparent font-bold font-[family:var(--font-serif)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60 active:translate-y-[1px]";

    const variants = {
      primary:
        "bg-[var(--accent-orange)] text-[var(--text-on-orange)] hover:brightness-110",
      secondary:
        "bg-[var(--bg-surface-raised)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]",
      outline:
        "border-[var(--border-warm)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)]",
      ghost:
        "bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)]",
      whatsapp: "bg-[var(--whatsapp-green)] text-black hover:brightness-110",
      flame:
        "bg-[var(--accent-ember)] text-[var(--text-on-orange)] hover:brightness-110",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-full" />
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
