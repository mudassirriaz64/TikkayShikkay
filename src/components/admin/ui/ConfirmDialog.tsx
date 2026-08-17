"use client";

import { useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onCancel}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 shadow-2xl shadow-black/50"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close dialog"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              tone === "danger"
                ? "bg-[var(--accent-red)]/12 text-[var(--accent-red)]"
                : "bg-[var(--accent-orange)]/12 text-[var(--accent-orange)]",
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
              {title}
            </p>
            {description ? (
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                {description}
              </p>
            ) : null}
            {children}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button size="md" variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            size="md"
            className={cn(
              tone === "danger"
                ? "bg-[var(--accent-red)] text-white hover:bg-[var(--accent-red)]/90"
                : "bg-[var(--accent-orange)] text-white hover:bg-[var(--accent-orange)]/90",
            )}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
