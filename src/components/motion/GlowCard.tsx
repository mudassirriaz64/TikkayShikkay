"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className,
  glowColor = "rgba(244, 190, 84, 0.12)",
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn("group/glow relative overflow-hidden", className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          background: `radial-gradient(240px circle at var(--gx, 50%) var(--gy, 50%), ${glowColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
