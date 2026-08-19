import { BlogPageData, BlogPost } from "@/types";
import { mockBlogPageData } from "@/lib/mock/blog";
import { blogService } from "@/lib/api/blog.service";

export async function getBlogPageData(category?: string): Promise<BlogPageData> {
  try {
    const res = await blogService.getAll(category ? { category } : undefined);
    if (res && Array.isArray(res.posts) && res.posts.length > 0) {
      return { posts: res.posts };
    }
  } catch {
    // ignore
  }

  if (category && category !== "all") {
    return {
      posts: mockBlogPageData.posts.filter((p) =>
        p.category.toLowerCase().includes(category.toLowerCase())
      ),
    };
  }

  return mockBlogPageData;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await blogService.getBySlug(slug);
    if (res) return res;
  } catch {
    // ignore
  }

  const data = await getBlogPageData();
  return data.posts.find((post) => post.slug === slug) ?? null;
}

