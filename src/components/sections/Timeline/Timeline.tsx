import { getJourneyPosts } from "@/lib/data/getJourneyPosts";
import { getMilestones } from "@/lib/data/getMilestones";
import { TimelineHorizontal } from "./TimelineHorizontal";
import { Reveal } from "@/components/motion/Reveal";

export async function Timeline() {
  const [posts, milestones] = await Promise.all([
    getJourneyPosts(),
    getMilestones(),
  ]);

  return (
    <section className="overflow-hidden bg-[var(--bg-deep)] py-[80px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal>
          <p className="text-xs font-semibold tracking-widest text-[#E5A93C]">
            {"\u2022"} THE TIMELINE
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold uppercase leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)] md:text-5xl">
            From Zero to Brand
          </h2>
        </Reveal>
      </div>

      <div className="mx-auto mt-8 max-w-[1280px] px-4 lg:px-[64px]">
        <TimelineHorizontal posts={posts} />
      </div>

      <div className="mx-auto mt-12 max-w-[1280px] px-4 lg:px-[64px]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {milestones.map((milestone, index) => (
            <Reveal key={milestone.label} delay={index * 0.08}>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-800/80 bg-[#181818] p-8 text-center transition-all hover:border-stone-700">
                <p className="mb-2 font-serif text-3xl font-bold text-[#E5A93C] md:text-4xl">
                  {milestone.number}
                </p>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-stone-300 uppercase">
                  {milestone.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
