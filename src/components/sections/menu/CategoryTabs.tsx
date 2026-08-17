"use client";

import { useEffect, useState } from "react";
import { CategoryButton } from "@/components/ui/menu/CategoryButton";
import { MenuTab } from "@/types/menu";

interface CategoryTabsProps {
  tabs: MenuTab[];
}

export function CategoryTabs({ tabs }: CategoryTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.sectionId ?? "");

  useEffect(() => {
    const handleScroll = () => {
      const pos = window.scrollY + 160;
      let current = tabs[0].sectionId;
      let currentTop = -Infinity;

      for (const tab of tabs) {
        const el = document.getElementById(tab.sectionId);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= pos && top > currentTop) {
          currentTop = top;
          current = tab.sectionId;
        }
      }

      setActiveId(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [tabs]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-[60px] z-30 border-y border-[var(--border-warm)]/40 bg-[var(--bg-base)]/95 backdrop-blur-md"
    >
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 py-4 lg:mx-0 lg:px-0 lg:justify-center lg:py-5">
          {tabs.map((tab) => (
            <CategoryButton
              key={tab.id}
              label={tab.label}
              active={activeId === tab.sectionId}
              onClick={() => scrollToSection(tab.sectionId)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
