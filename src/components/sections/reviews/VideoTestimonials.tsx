import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoReviewCard } from "@/components/ui/reviews/VideoReviewCard";
import { Reveal } from "@/components/motion/Reveal";
import { VideoReview } from "@/types";

interface VideoTestimonialsProps {
  videos: VideoReview[];
}

export function VideoTestimonials({ videos }: VideoTestimonialsProps) {
  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="In Their Own Words"
            title="Hear It From The"
            accent="Guests"
          />
          <p className="mt-5 max-w-[60ch] text-[var(--text-body)]">
            Short video stories captured live at our tables, on the grill and
            in the celebration.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, index) => (
            <Reveal key={video.id} delay={index * 0.08}>
              <VideoReviewCard video={video} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
