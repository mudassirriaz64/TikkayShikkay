import { MotionConfig } from "framer-motion";
import { getReviewsPageData } from "@/lib/data/getReviews";
import { ReviewsHero } from "@/components/sections/reviews/ReviewsHero";
import { ReviewStats } from "@/components/sections/reviews/ReviewStats";
import { FeaturedReview } from "@/components/sections/reviews/FeaturedReview";
import { ReviewHighlights } from "@/components/sections/reviews/ReviewHighlights";
import { ReviewsGrid } from "@/components/sections/reviews/ReviewsGrid";
import { VideoTestimonials } from "@/components/sections/reviews/VideoTestimonials";
import { CustomerGallery } from "@/components/sections/reviews/CustomerGallery";
import { ReviewCTA } from "@/components/sections/reviews/ReviewCTA";

export const metadata = {
  title: "Reviews - Tikkay Shikkay",
  description:
    "Read real reviews from Tikkay Shikkay guests — families, friends, corporate dinners and birthday nights at the coals.",
};

export default async function ReviewsPage() {
  const data = await getReviewsPageData();

  return (
    <div className="bg-[var(--bg-base)]">
      <MotionConfig reducedMotion="user">
        <ReviewsHero data={data.hero} />
        <ReviewStats statistics={data.statistics} />
        <FeaturedReview review={data.featured} />
        <ReviewHighlights reviews={data.highlights} />
        <ReviewsGrid reviews={data.reviews} categories={data.categories} />
        <VideoTestimonials videos={data.videos} />
        <CustomerGallery gallery={data.gallery} />
        <ReviewCTA data={data.cta} />
      </MotionConfig>
    </div>
  );
}
