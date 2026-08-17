import { getBlogPageData } from "@/lib/data/getBlog";
import { BlogHero, BlogPostCard } from "@/components/sections/blog";
import { Reveal } from "@/components/motion/Reveal";

export default async function BlogPage() {
  const data = await getBlogPageData();

  return (
    <>
      <BlogHero />
      <section className="bg-[var(--bg-base)] py-[88px] lg:py-[112px]">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((post, index) => (
              <Reveal key={post.id} delay={index * 0.1}>
                <BlogPostCard post={post} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
