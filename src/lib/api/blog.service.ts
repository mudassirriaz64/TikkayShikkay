import { api } from './client';
import { BlogPost, BlogPageData } from '@/types';

export interface CreateBlogPostInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author?: string;
  imageUrl?: string;
  readTime?: string;
  tags?: string[];
  is_published?: boolean;
}

export interface BlogApiResponse {
  posts: BlogPost[];
  total: number;
}

export const blogService = {
  getAll(params?: { category?: string; search?: string; include_unpublished?: boolean }): Promise<BlogApiResponse> {
    return api.get<BlogApiResponse>('/blog', { query: params });
  },

  getBySlug(slug: string): Promise<BlogPost> {
    return api.get<BlogPost>(`/blog/${slug}`);
  },

  create(data: CreateBlogPostInput): Promise<BlogPost> {
    return api.post<BlogPost>('/blog', data);
  },

  update(id: string, data: Partial<CreateBlogPostInput>): Promise<BlogPost> {
    return api.patch<BlogPost>(`/blog/id/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return api.delete<void>(`/blog/id/${id}`);
  },
};
