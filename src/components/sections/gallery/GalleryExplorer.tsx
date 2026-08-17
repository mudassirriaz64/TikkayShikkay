"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GalleryNavigation } from "@/components/sections/gallery/GalleryNavigation";
import { CustomerStories } from "@/components/sections/gallery/CustomerStories";
import { KitchenStories } from "@/components/sections/gallery/KitchenStories";
import { BrandJourney } from "@/components/sections/gallery/BrandJourney";
import { PhotoGallery } from "@/components/sections/gallery/PhotoGallery";
import {
  CustomerStory,
  GalleryCategoryFilter,
  GalleryImage,
  GalleryTab,
  GoogleReview,
  InstagramPost,
  JourneyMilestone,
  KitchenProcess,
  VideoTestimonial,
} from "@/types";

interface GalleryExplorerProps {
  tabs: GalleryTab[];
  videos: VideoTestimonial[];
  instagram: InstagramPost[];
  googleReviews: GoogleReview[];
  stories: CustomerStory[];
  kitchen: KitchenProcess[];
  journey: JourneyMilestone[];
  gallery: GalleryImage[];
  categories: GalleryCategoryFilter[];
}

export function GalleryExplorer({
  tabs,
  videos,
  instagram,
  googleReviews,
  stories,
  kitchen,
  journey,
  gallery,
  categories,
}: GalleryExplorerProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.sectionId ?? "customers");
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    contentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [activeId]);

  return (
    <>
      <GalleryNavigation
        tabs={tabs}
        activeId={activeId}
        onChange={setActiveId}
      />

      <div ref={contentRef} className="scroll-mt-[124px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeId === "customers" && (
              <CustomerStories
                videos={videos}
                instagram={instagram}
                googleReviews={googleReviews}
                stories={stories}
              />
            )}
            {activeId === "behind-scenes" && (
              <KitchenStories kitchen={kitchen} />
            )}
            {activeId === "journey" && <BrandJourney journey={journey} />}
            {activeId === "gallery" && (
              <PhotoGallery gallery={gallery} categories={categories} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
