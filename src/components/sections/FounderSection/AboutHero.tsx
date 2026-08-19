"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_OUT_SOFT, EYEBROW_TRACKING } from "@/lib/animations/easings";

const embers = [
  { className: "left-[10%] top-[68%] h-1 w-1 bg-[var(--accent-peach)]/40" },
  { className: "left-[18%] top-[54%] h-1.5 w-1.5 bg-[var(--accent-orange)]/35" },
  { className: "left-[28%] top-[80%] h-1 w-1 bg-[var(--accent-gold)]/40" },
  { className: "left-[42%] top-[70%] h-1 w-1 bg-[var(--accent-peach)]/30" },
  { className: "left-[58%] top-[58%] h-1.5 w-1.5 bg-[var(--accent-orange)]/35" },
  { className: "left-[70%] top-[76%] h-1 w-1 bg-[var(--accent-gold)]/35" },
  { className: "left-[78%] top-[50%] h-1 w-1 bg-[var(--accent-peach)]/40" },
  { className: "left-[88%] top-[64%] h-1.5 w-1.5 bg-[var(--accent-orange)]/30" },
  { className: "left-[94%] top-[82%] h-1 w-1 bg-[var(--accent-gold)]/40" },
  { className: "left-[34%] top-[88%] h-1 w-1 bg-[var(--accent-peach)]/30" },
];

export function AboutHero() {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(
          [
            ".about-hero-scrim",
            ".about-hero-eyebrow",
            ".about-hero-line",
          ],
          { opacity: 1, y: 0, yPercent: 0 }
        );
        gsap.set(".about-hero-ember", { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT_SOFT } });

      tl.fromTo(
        ".about-hero-scrim",
        { opacity: 0 },
        { opacity: 1, duration: 0.9 }
      )
        .fromTo(
          ".about-hero-eyebrow",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.6"
        )
        .fromTo(
          ".about-hero-line",
          { yPercent: 115 },
          { yPercent: 0, duration: 1.1, stagger: 0.16 },
          "-=0.35"
        );

      gsap.to(".about-hero-smoke-a", {
        xPercent: 20,
        yPercent: -14,
        scale: 1.15,
        opacity: 0.14,
        duration: 16,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".about-hero-smoke-b", {
        xPercent: -16,
        yPercent: 12,
        scale: 1.2,
        opacity: 0.12,
        duration: 20,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".about-hero-ember", {
        y: -90,
        opacity: 0,
        duration: (i) => 7 + (i % 5) * 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1.1,
      });
    },
    { scope: ref, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--bg-deep)] h-[65vh] min-h-[480px] w-full flex items-center"
    >
      <div className="absolute inset-0 scale-110">
        <Image
          src="/images/hero_image.png"
          alt="Skewers roasting over hot red coals"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="about-hero-scrim absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/65 to-black/30 pointer-events-none" />
      </div>

      <div
        aria-hidden="true"
        className="about-hero-smoke-a absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[var(--accent-ember)]/10 opacity-[0.08] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="about-hero-smoke-b absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[var(--accent-peach)]/10 opacity-[0.06] blur-[120px]"
      />

      {embers.map((ember, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`about-hero-ember absolute rounded-full ${ember.className}`}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-[1280px] w-full px-4 lg:px-[64px]">
        <div className="max-w-4xl space-y-4">
          <span className={`about-hero-eyebrow inline-flex items-center gap-3 text-xs font-bold uppercase ${EYEBROW_TRACKING} text-[var(--accent-peach)]`}>
            <span aria-hidden="true" className="h-px w-10 bg-[var(--accent-peach)]/50" />
            Since 2012
          </span>
          <h1 className="font-[family:var(--font-serif)] text-[64px] md:text-[102.4px] font-bold uppercase tracking-tight leading-[0.9] text-white select-none">
            <span className="about-hero-line block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="block will-change-transform">Our Story</span>
            </span>
          </h1>
        </div>
      </div>

      {/* Decorative Vertical Rotated Tagline */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] uppercase tracking-[0.3em] text-[var(--text-faint)] opacity-40 select-none hidden lg:block whitespace-nowrap">
        The grill doesn't lie • Real smoke daily
      </div>
    </section>
  );
}
