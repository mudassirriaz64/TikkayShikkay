"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_OUT_SOFT } from "@/lib/animations/easings";

const particles = [
  { className: "left-[8%] top-[66%] h-1 w-1 bg-[var(--accent-peach)]/40" },
  { className: "left-[16%] top-[52%] h-1.5 w-1.5 bg-[var(--accent-orange)]/35" },
  { className: "left-[26%] top-[78%] h-1 w-1 bg-[var(--accent-gold)]/40" },
  { className: "left-[40%] top-[68%] h-1 w-1 bg-[var(--accent-peach)]/30" },
  { className: "left-[56%] top-[56%] h-1.5 w-1.5 bg-[var(--accent-orange)]/35" },
  { className: "left-[68%] top-[74%] h-1 w-1 bg-[var(--accent-gold)]/35" },
  { className: "left-[76%] top-[48%] h-1 w-1 bg-[var(--accent-peach)]/40" },
  { className: "left-[86%] top-[62%] h-1.5 w-1.5 bg-[var(--accent-orange)]/30" },
  { className: "left-[92%] top-[80%] h-1 w-1 bg-[var(--accent-gold)]/40" },
  { className: "left-[32%] top-[86%] h-1 w-1 bg-[var(--accent-peach)]/30" },
];

export function MenuHero() {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(
          [".menu-hero-scrim", ".menu-hero-eyebrow", ".menu-hero-line", ".menu-hero-subtitle"],
          { opacity: 1, y: 0, yPercent: 0 },
        );
        gsap.set(".menu-hero-particle", { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT_SOFT } });

      tl.fromTo(".menu-hero-scrim", { opacity: 0 }, { opacity: 1, duration: 0.9 })
        .fromTo(
          ".menu-hero-eyebrow",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.6",
        )
        .fromTo(
          ".menu-hero-line",
          { yPercent: 115 },
          { yPercent: 0, duration: 1.1, stagger: 0.16 },
          "-=0.35",
        )
        .fromTo(
          ".menu-hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.7",
        );

      gsap.to(".menu-hero-smoke-a", {
        xPercent: 20,
        yPercent: -14,
        scale: 1.15,
        opacity: 0.14,
        duration: 16,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".menu-hero-smoke-b", {
        xPercent: -16,
        yPercent: 12,
        scale: 1.2,
        opacity: 0.12,
        duration: 20,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".menu-hero-particle", {
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
    <section ref={ref} className="relative overflow-hidden bg-[var(--bg-deep)]">
      <div className="absolute inset-0 scale-110">
        <Image
          src="/images/hero_image.png"
          alt="Charcoal skewers roasting over open fire"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="menu-hero-scrim absolute inset-0 bg-[var(--bg-deep)]/75" />
        <div className="menu-hero-scrim absolute inset-0 bg-gradient-to-b from-[var(--bg-deep)]/70 via-transparent to-[var(--bg-base)]" />
      </div>

      <div
        aria-hidden="true"
        className="menu-hero-smoke-a absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[var(--accent-ember)]/10 opacity-[0.08] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="menu-hero-smoke-b absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[var(--accent-peach)]/10 opacity-[0.06] blur-[120px]"
      />

      {particles.map((particle, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`menu-hero-particle absolute rounded-full ${particle.className}`}
        />
      ))}

      <div className="relative mx-auto flex min-h-[62vh] w-full max-w-[1280px] flex-col justify-center px-4 pb-16 pt-24 md:min-h-[70vh] lg:px-[64px]">
        <div className="max-w-4xl space-y-7">
          <span className="menu-hero-eyebrow inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent-peach)]">
            <span aria-hidden="true" className="h-px w-10 bg-[var(--accent-peach)]/50" />
            The Culinary Manuscript
          </span>

          <h1 className="font-[family:var(--font-serif)] text-4xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-[var(--text-primary)] md:text-7xl lg:text-[96px]">
            <span className="menu-hero-line block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="block will-change-transform">Mastering the Art of</span>
            </span>
            <span className="menu-hero-line block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="block text-[var(--accent-peach)] will-change-transform">
                Smoke &amp; Spice
              </span>
            </span>
          </h1>

          <p className="menu-hero-subtitle max-w-xl text-base leading-relaxed text-[var(--text-body)] md:text-lg">
            Charcoal fire, ancestral spice, and cuts handled by hand — a menu
            built around the open flame and the patience it demands.
          </p>
        </div>
      </div>
    </section>
  );
}
