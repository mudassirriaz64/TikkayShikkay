"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] px-6 py-16 text-center",
        className,
      )}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--accent-peach)]/20 bg-[var(--accent-ember)]/10 text-[var(--accent-orange)]">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-[family:var(--font-serif)] text-xl font-bold text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-[var(--text-body)]">
          {description}
        </p>
      </div>
      {ctaLabel && ctaHref ? (
        <Link href={ctaHref}>
          <Button variant="primary" size="sm" className="rounded-xl">
            {ctaLabel}
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
