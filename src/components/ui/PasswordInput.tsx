"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  error,
  required,
  autoComplete,
  placeholder = " ",
  className,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const fieldClasses = cn(
    "peer w-full rounded-xl border bg-[var(--bg-surface-alt)] pr-12 pl-4 text-[var(--text-primary)] outline-none transition-all duration-300 placeholder-transparent h-14 pb-2 pt-6",
    error
      ? "border-[var(--accent-ember)]/70 focus:border-[var(--accent-ember)] focus:shadow-[0_0_0_4px_rgba(217,56,30,0.12)]"
      : "border-[var(--border-warm)] focus:border-[var(--accent-peach)]/70 focus:shadow-[0_0_0_4px_rgba(255,180,162,0.08)]",
    className,
  );

  const labelClasses = cn(
    "pointer-events-none absolute left-4 text-[var(--text-muted)] transition-all duration-300 top-3 text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm",
    error ? "text-[var(--accent-ember)]" : "peer-focus:text-[var(--accent-peach)]",
  );

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder={placeholder}
          className={cn(fieldClasses, "appearance-none")}
        />
        <label htmlFor={id} className={labelClasses}>
          {label}
          {required ? (
            <span aria-hidden="true" className="text-[var(--accent-ember)]">
              {" "}*
            </span>
          ) : null}
        </label>
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text-faint)] transition-colors hover:text-[var(--text-primary)]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs text-[var(--accent-ember)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
