import { BlogPageData, BlogPost } from "@/types";
import { mockBlogPageData } from "@/lib/mock/blog";
import { tryOrFallback } from "@/lib/api/client";

export async function getBlogPageData(): Promise<BlogPageData> {
  return tryOrFallback(
    async () => {
      const { api } = await import("@/lib/api/client");
      return api.get<BlogPageData>("/blog");
    },
    mockBlogPageData,
  );
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const data = await getBlogPageData();
  return data.posts.find((post) => post.slug === slug) ?? null;
}
