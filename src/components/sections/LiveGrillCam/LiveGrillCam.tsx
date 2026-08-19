"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Video,
  Radio,
  Flame,
  ThermometerSun,
  Users,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Utensils,
  Clock,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

interface LiveGrillCamProps {
  branchName?: string;
  initialTemp?: string;
  initialViewers?: number;
}

export function LiveGrillCam({
  branchName = "DHA Phase 5 Flagship Pit",
  initialTemp = "465°F",
  initialViewers = 48,
}: LiveGrillCamProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [viewers, setViewers] = useState(initialViewers);
  const [pitTemp, setPitTemp] = useState(initialTemp);
  const [activeItem, setActiveItem] = useState("Chicken Malai Boti & Seekh Kebabs on Coals");

  // Subtle live viewer count variation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(32, prev + delta);
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[var(--bg-base)] py-[88px] lg:py-[112px] border-b border-[var(--border-warm)]/40 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <Reveal>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                Live Grill Cam
              </span>
              <h2 className="font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-5xl">
                Real Smoke. Real Coals. <br />
                <span className="text-[var(--accent-peach)]">Watch Live from the Pit</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-sm text-[var(--text-muted)] max-w-sm">
              We have nothing to hide. Stream the iron skewers sizzling over raw acacia charcoal in real-time.
            </p>
          </Reveal>
        </div>

        {/* Live Stream Viewport Card */}
        <Reveal delay={0.2}>
          <div className="relative rounded-[28px] overflow-hidden border border-white/15 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
            {/* Aspect Ratio Box */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
              {/* Pit Visual */}
              <Image
                src="/images/hero_image.png"
                alt="Live Pit Cam - Skewers roasting over red charcoal coals"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center brightness-95 filter contrast-105 scale-105 transition-transform duration-1000"
              />

              {/* Ambient Smoke & Heat Haze Simulation */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,86,42,0.18),transparent_65%)] pointer-events-none animate-pulse"
              />

              {/* Stream Overlays: Top Bar */}
              <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 z-20">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full bg-rose-600/90 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                    <Radio className="h-3.5 w-3.5 animate-pulse" />
                    LIVE COALS
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    <Flame className="h-3.5 w-3.5 text-[var(--accent-orange)]" />
                    <span>{branchName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{viewers} Foodies Watching</span>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md">
                    <ThermometerSun className="h-3.5 w-3.5" />
                    <span>{pitTemp} Pit Temp</span>
                  </div>
                </div>
              </div>

              {/* Stream Overlays: Bottom Action Bar */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20">
                <div className="flex items-center gap-2 rounded-xl bg-black/75 px-4 py-2 border border-white/15 backdrop-blur-md">
                  <Utensils className="h-4 w-4 text-[var(--accent-orange)]" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400">Currently on the Grill</p>
                    <p className="text-xs font-bold text-white">{activeItem}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/60 text-white backdrop-blur-md hover:bg-white/15"
                    title={isMuted ? "Unmute Sizzle Audio" : "Mute Audio"}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
                  </button>

                  <a href="/menu">
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-xl px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Order What You See
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
