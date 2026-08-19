export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
  readTime: string;
  tags?: string[];
  is_published?: boolean;
}

export interface BlogPageData {
  posts: BlogPost[];
}
