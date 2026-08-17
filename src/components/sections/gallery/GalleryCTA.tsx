import { CTABanner } from "@/components/ui/CTABanner";
import { GalleryCtaData } from "@/types";

interface GalleryCTAProps {
  data: GalleryCtaData;
}

export function GalleryCTA({ data }: GalleryCTAProps) {
  return (
    <CTABanner
      data={{
        eyebrow: "The Story Continues",
        title: data.title,
        description: data.description,
        primaryLabel: data.primaryLabel,
        primaryHref: data.primaryHref,
        secondaryLabel: data.secondaryLabel,
        secondaryHref: data.secondaryHref,
        imageUrl: data.imageUrl,
      }}
    />
  );
}
