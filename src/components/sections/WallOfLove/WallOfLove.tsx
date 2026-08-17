import { getReviews } from "@/lib/data/getReviews";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export async function WallOfLove() {
  const reviews = await getReviews();
  const approvedReviews = reviews.filter((r) => r.is_approved);

  return (
    <section className="border-y border-[var(--border-warm)]/30 bg-[var(--bg-base)] py-[80px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Wall of Love"
            eyebrowColor="muted"
            title="Word on the street."
          />
          <Reveal delay={0.15}>
            <p className="hidden max-w-sm text-right text-[var(--text-body)] md:block">
              Don&rsquo;t just take our word for it. Here&rsquo;s what our
              community has to say.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {approvedReviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 0.08} className="h-full">
              <TestimonialCard review={review} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
