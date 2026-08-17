"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

interface UseCounterOptions {
  duration?: number;
  delay?: number;
  decimals?: number;
  suffix?: string;
}

export function useCounter<T extends HTMLElement = HTMLSpanElement>(
  target: number,
  options: UseCounterOptions = {},
) {
  const { duration = 1.6, delay = 0, decimals = 0, suffix = "" } = options;
  const reducedMotion = useReducedMotion();
  const ref = useRef<T | null>(null);
  const [display, setDisplay] = useState("0");

  const formatter = useCallback(
    (value: number) =>
      `${decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}${suffix}`,
    [decimals, suffix],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      setDisplay(formatter(target));
      return;
    }

    let tween: gsap.core.Tween | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        const proxy = { value: 0 };
        tween = gsap.to(proxy, {
          value: target,
          duration,
          delay,
          ease: "power2.out",
          onUpdate: () => setDisplay(formatter(proxy.value)),
          onComplete: () => setDisplay(formatter(target)),
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [target, duration, delay, reducedMotion, formatter]);

  return { ref, display };
}
