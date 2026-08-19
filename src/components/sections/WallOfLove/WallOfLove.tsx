import Link from "next/link";
import { getReviews } from "@/lib/data/getReviews";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRight, Star } from "lucide-react";

export async function WallOfLove() {
  const reviews = await getReviews();
  const approvedReviews = reviews.filter((r) => r.is_approved).slice(0, 3);

  return (
    <section className="border-y border-[var(--border-warm)]/30 bg-[var(--bg-base)] py-[80px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Wall of Love"
            eyebrowColor="muted"
            title="Word on the street."
          />
          
          <Reveal delay={0.15}>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-peach)] hover:text-white transition-colors group"
            >
              <Star className="h-3.5 w-3.5 fill-current text-[var(--accent-gold)]" />
              <span>View All Customer Reviews ({reviews.filter((r) => r.is_approved).length})</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
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
