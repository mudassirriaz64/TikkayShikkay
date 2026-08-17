import { CTABanner } from "@/components/ui/CTABanner";
import { CateringCtaData } from "@/types";

interface CateringPageCtaProps {
  data: CateringCtaData;
}

export function CateringPageCta({ data }: CateringPageCtaProps) {
  return (
    <CTABanner
      data={{
        eyebrow: "Your Event, Our Fire",
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
