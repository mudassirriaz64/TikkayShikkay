"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_OUT_SOFT } from "@/lib/animations/easings";

const particles = [
  { className: "left-[8%] top-[68%] h-1 w-1 bg-[var(--accent-peach)]/40" },
  { className: "left-[14%] top-[52%] h-1.5 w-1.5 bg-[var(--accent-orange)]/35" },
  { className: "left-[22%] top-[80%] h-1 w-1 bg-[var(--accent-gold)]/40" },
  { className: "left-[38%] top-[70%] h-1 w-1 bg-[var(--accent-peach)]/30" },
  { className: "left-[54%] top-[58%] h-1.5 w-1.5 bg-[var(--accent-orange)]/35" },
  { className: "left-[64%] top-[76%] h-1 w-1 bg-[var(--accent-gold)]/35" },
  { className: "left-[72%] top-[50%] h-1 w-1 bg-[var(--accent-peach)]/40" },
  { className: "left-[84%] top-[64%] h-1.5 w-1.5 bg-[var(--accent-orange)]/30" },
  { className: "left-[90%] top-[80%] h-1 w-1 bg-[var(--accent-gold)]/40" },
  { className: "left-[30%] top-[86%] h-1 w-1 bg-[var(--accent-peach)]/30" },
];

export function BlogHero() {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(
          [".blog-scrim", ".blog-eyebrow", ".blog-line", ".blog-subtitle"],
          { opacity: 1, y: 0, yPercent: 0 },
        );
        gsap.set(".blog-particle", { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT_SOFT } });

      tl.fromTo(".blog-scrim", { opacity: 0 }, { opacity: 1, duration: 0.9 })
        .fromTo(
          ".blog-eyebrow",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.6",
        )
        .fromTo(
          ".blog-line",
          { yPercent: 115 },
          { yPercent: 0, duration: 1.1, stagger: 0.16 },
          "-=0.35",
        )
        .fromTo(
          ".blog-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.7",
        );

      gsap.to(".blog-smoke-a", {
        xPercent: 22,
        yPercent: -16,
        scale: 1.15,
        opacity: 0.13,
        duration: 16,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".blog-smoke-b", {
        xPercent: -18,
        yPercent: 14,
        scale: 1.2,
        opacity: 0.11,
        duration: 20,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".blog-particle", {
        y: -90,
        opacity: 0,
        duration: (i) => 7 + (i % 5) * 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1.1,
      });
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--bg-deep)]"
    >
      <div
        aria-hidden="true"
        className="blog-scrim absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,56,30,0.16),transparent_55%)]"
      />

      <div
        aria-hidden="true"
        className="blog-smoke-a absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[var(--accent-ember)]/10 opacity-[0.08] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="blog-smoke-b absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[var(--accent-peach)]/10 opacity-[0.06] blur-[120px]"
      />

      {particles.map((particle, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`blog-particle absolute rounded-full ${particle.className}`}
        />
      ))}

      <div className="relative mx-auto flex min-h-[50vh] w-full max-w-[1280px] flex-col justify-center px-4 pb-16 pt-24 md:min-h-[56vh] lg:px-[64px]">
        <div className="max-w-4xl space-y-7">
          <span className="blog-eyebrow inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
            <span aria-hidden="true" className="h-px w-10 bg-[var(--accent-peach)]/50" />
            From the Grill
          </span>

          <h1 className="font-[family:var(--font-serif)] text-[54px] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-[var(--text-primary)] md:text-[96px] lg:text-[112px]">
            <span className="blog-line block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="block will-change-transform">Stories &</span>
            </span>
            <span className="blog-line block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="block text-[var(--accent-peach)] will-change-transform">
                Smoke
              </span>
            </span>
          </h1>

          <p className="blog-subtitle max-w-xl text-base leading-relaxed text-[var(--text-body)] md:text-lg">
            Stories from behind the grill, spice insights, and the culture
            that fuels Tikkay Shikkay.
          </p>
        </div>
      </div>
    </section>
  );
}
