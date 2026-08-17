import { CTABanner } from "@/components/ui/CTABanner";
import { CareersCtaData } from "@/types";

interface CareersPageCtaProps {
  data: CareersCtaData;
}

export function CareersPageCta({ data }: CareersPageCtaProps) {
  return (
    <CTABanner
      data={{
        eyebrow: "Join the Team",
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
