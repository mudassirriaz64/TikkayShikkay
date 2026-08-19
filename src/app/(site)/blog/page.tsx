import { getBlogPageData } from "@/lib/data/getBlog";
import { BlogHero, BlogFeed } from "@/components/sections/blog";

export default async function BlogPage() {
  const data = await getBlogPageData();

  return (
    <>
      <BlogHero />
      <BlogFeed initialPosts={data.posts} />
    </>
  );
}

