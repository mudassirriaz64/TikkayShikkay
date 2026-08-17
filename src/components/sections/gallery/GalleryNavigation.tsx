"use client";

import { motion, useScroll } from "framer-motion";
import { Camera, ChefHat, Flame, Users } from "lucide-react";
import { GalleryTab } from "@/components/ui/gallery/GalleryTab";
import { cn } from "@/lib/utils/cn";
import { GalleryTab as GalleryTabType, GalleryTabIcon } from "@/types";

const ICONS: Record<GalleryTabIcon, typeof Users> = {
  users: Users,
  "chef-hat": ChefHat,
  flame: Flame,
  camera: Camera,
};

interface GalleryNavigationProps {
  tabs: GalleryTabType[];
  activeId: string;
  onChange: (id: string) => void;
}

export function GalleryNavigation({
  tabs,
  activeId,
  onChange,
}: GalleryNavigationProps) {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <section
        aria-label="Explore the gallery"
        className="bg-[var(--bg-deep)]"
      >
        <div className="mx-auto max-w-[1280px] px-4 pb-4 lg:px-[64px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tabs.map((tab, index) => (
              <GalleryTab
                key={tab.id}
                tab={tab}
                index={index}
                active={activeId === tab.sectionId}
                onClick={() => onChange(tab.sectionId)}
              />
            ))}
          </div>
        </div>
      </section>

      <nav
        aria-label="Gallery sections"
        className="sticky top-[60px] z-30 border-y border-[var(--border-warm)]/40 bg-[var(--bg-base)]/95 backdrop-blur-md"
      >
        <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
          <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-3 lg:mx-0 lg:justify-center lg:px-0">
            {tabs.map((tab) => {
              const Icon = ICONS[tab.icon];
              const active = activeId === tab.sectionId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange(tab.sectionId)}
                  className={cn(
                    "relative inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60",
                    active
                      ? "text-[var(--accent-peach)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {tab.shortLabel}
                  {active ? (
                    <motion.span
                      layoutId="gallery-nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-[var(--accent-peach)]/30 bg-[var(--accent-peach)]/10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="h-0.5 w-full overflow-hidden bg-[var(--border-warm)]/40">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full origin-left bg-[var(--accent-orange)]"
            />
          </div>
        </div>
      </nav>
    </>
  );
}
