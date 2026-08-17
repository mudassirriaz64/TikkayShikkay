import { CTABanner } from "@/components/ui/CTABanner";
import { ReviewsCtaData } from "@/types";

interface ReviewCTAProps {
  data: ReviewsCtaData;
}

export function ReviewCTA({ data }: ReviewCTAProps) {
  return (
    <CTABanner
      data={{
        eyebrow: "Your Turn To Be Heard",
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
