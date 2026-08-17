"use client";

import { type ReactNode } from "react";
import { useTilt } from "@/hooks/useTilt";
import { cn } from "@/lib/utils/cn";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({ children, className, maxTilt = 5 }: TiltCardProps) {
  const ref = useTilt<HTMLDivElement>(maxTilt);

  return (
    <div className={cn("relative [perspective:1200px]", className)}>
      <div
        ref={ref}
        className="h-full will-change-transform [transform-style:preserve-3d]"
      >
        {children}
      </div>
    </div>
  );
}
