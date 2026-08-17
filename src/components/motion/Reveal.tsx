"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_OUT_SOFT, DURATION_BASE } from "@/lib/animations/easings";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  duration = DURATION_BASE,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (reducedMotion) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: EASE_OUT_SOFT,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    },
    { scope: ref, dependencies: [reducedMotion, delay, y, duration] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
