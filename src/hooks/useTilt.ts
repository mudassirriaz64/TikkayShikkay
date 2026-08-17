"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

export function useTilt<T extends HTMLElement = HTMLDivElement>(
  maxTilt = 5,
) {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const rx = gsap.quickTo(el, "rotationX", {
      duration: 0.5,
      ease: "power3.out",
    });
    const ry = gsap.quickTo(el, "rotationY", {
      duration: 0.5,
      ease: "power3.out",
    });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      ry(px * maxTilt * 2);
      rx(-py * maxTilt * 2);
    };

    const onLeave = () => {
      rx(0);
      ry(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion, maxTilt]);

  return ref;
}
