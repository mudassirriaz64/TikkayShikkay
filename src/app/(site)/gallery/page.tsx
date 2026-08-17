import { MotionConfig } from "framer-motion";
import { getGalleryPageData } from "@/lib/data/getGallery";
import { GalleryHero } from "@/components/sections/gallery/GalleryHero";
import { GalleryExplorer } from "@/components/sections/gallery/GalleryExplorer";
import { GalleryCTA } from "@/components/sections/gallery/GalleryCTA";

export const metadata = {
  title: "Gallery & Stories - Tikkay Shikkay",
  description:
    "Step inside Tikkay Shikkay - customer stories, behind the scenes, the journey of Pakistan's first BBQ brand, and a gallery of every memory made at the coals.",
};

export default async function GalleryPage() {
  const data = await getGalleryPageData();

  return (
    <div className="bg-[var(--bg-base)]">
      <MotionConfig reducedMotion="user">
        <GalleryHero data={data.hero} />
        <GalleryExplorer
          tabs={data.tabs}
          videos={data.videos}
          instagram={data.instagram}
          googleReviews={data.googleReviews}
          stories={data.stories}
          kitchen={data.kitchen}
          journey={data.journey}
          gallery={data.gallery}
          categories={data.galleryCategories}
        />
        <GalleryCTA data={data.cta} />
      </MotionConfig>
    </div>
  );
}
