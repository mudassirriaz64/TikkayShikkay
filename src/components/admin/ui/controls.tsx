"use client";

import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";
import {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const inputBase =
  "w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors duration-300 placeholder:text-[var(--text-faint)] focus:border-[var(--accent-peach)]/60 focus:ring-2 focus:ring-[var(--accent-peach)]/15";

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, children, className }: FieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-xs text-[var(--text-faint)]">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function NumberInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      className={cn(inputBase, "tabular-nums", className)}
      {...props}
    />
  );
}

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(inputBase, "min-h-[96px] resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(inputBase, "cursor-pointer appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "group inline-flex items-start gap-3 text-left disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <span
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300",
          checked
            ? "border-[var(--accent-orange)] bg-[var(--accent-orange)]"
            : "border-[var(--border-warm)] bg-[var(--bg-surface-raised)]",
        )}
      >
        <span
          className={cn(
            "inline-block h-[18px] w-[18px] rounded-full transition-transform duration-300",
            checked
              ? "translate-x-[22px] bg-[var(--bg-deep)]"
              : "translate-x-1 bg-[var(--text-faint)]",
          )}
        />
      </span>
      {label || description ? (
        <span>
          {label ? (
            <span className="block text-sm font-bold text-[var(--text-primary)]">
              {label}
            </span>
          ) : null}
          {description ? (
            <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </button>
  );
}
