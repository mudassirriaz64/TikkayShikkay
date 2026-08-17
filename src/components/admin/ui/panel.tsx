"use client";

import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";
import { HTMLAttributes, ReactNode } from "react";

export type BadgeTone =
  | "orange"
  | "gold"
  | "green"
  | "peach"
  | "red"
  | "neutral";

const badgeTones: Record<BadgeTone, string> = {
  orange:
    "bg-[var(--accent-orange)]/12 text-[var(--accent-orange)] border-[var(--accent-orange)]/30",
  gold: "bg-[var(--accent-gold)]/12 text-[var(--accent-gold)] border-[var(--accent-gold)]/30",
  green:
    "bg-[var(--whatsapp-green)]/12 text-[var(--whatsapp-green)] border-[var(--whatsapp-green)]/30",
  peach:
    "bg-[var(--accent-peach)]/12 text-[var(--accent-peach)] border-[var(--accent-peach)]/30",
  red: "bg-[var(--accent-ember)]/15 text-[var(--accent-coral)] border-[var(--accent-ember)]/40",
  neutral:
    "bg-[var(--bg-surface-raised)] text-[var(--text-muted)] border-[var(--border-warm)]",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em]",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 font-[family:var(--font-serif)] text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

interface SectionCardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)]",
        className,
      )}
    >
      {title || actions ? (
        <header className="flex flex-col gap-3 border-b border-[var(--border-warm)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title ? (
              <h3 className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : null}
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-orange)]/25 bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 font-[family:var(--font-serif)] text-3xl font-bold text-[var(--text-primary)]">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </p>
      {sub ? <p className="mt-1 text-xs text-[var(--text-faint)]">{sub}</p> : null}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-warm)] bg-[var(--bg-deep)] px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-surface-raised)] text-[var(--text-faint)]">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-4 font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
        {title}
      </p>
      <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">{description}</p>
    </div>
  );
}

export function Notice({
  tone = "success",
  children,
  className,
}: {
  tone?: "success" | "info" | "danger";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    success: "border-[var(--whatsapp-green)]/30 bg-[var(--whatsapp-green)]/10 text-[var(--whatsapp-green)]",
    info: "border-[var(--accent-peach)]/30 bg-[var(--accent-peach)]/10 text-[var(--accent-peach)]",
    danger: "border-[var(--accent-ember)]/40 bg-[var(--accent-ember)]/15 text-[var(--accent-coral)]",
  } as const;
  return (
    <p
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-bold",
        tones[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}
