"use client";

import { useCounter } from "@/hooks/useCounter";

interface CounterProps {
  target: number;
  className?: string;
  duration?: number;
  decimals?: number;
  suffix?: string;
}

export function Counter({
  target,
  className,
  duration,
  decimals,
  suffix,
}: CounterProps) {
  const { ref, display } = useCounter<HTMLSpanElement>(target, {
    duration,
    decimals,
    suffix,
  });

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
