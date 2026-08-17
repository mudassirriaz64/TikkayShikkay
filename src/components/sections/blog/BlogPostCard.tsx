import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { BlogPost } from "@/types";
import { Clock } from "lucide-react";

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
}

export function BlogPostCard({ post, index }: BlogPostCardProps) {
  const borderColors = [
    "border-l-[var(--accent-peach)]",
    "border-l-[var(--accent-gold)]",
    "border-l-[var(--accent-orange)]",
  ];
  const borderColor = borderColors[index % borderColors.length];

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card
        className={`flex h-full flex-col gap-4 border-l-4 rounded-r-2xl border-r border-y border-[var(--border-warm)] bg-[var(--bg-surface-alt)] overflow-hidden transition-colors group-hover:bg-[var(--bg-surface-hover)] ${borderColor}`}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/60 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-full border border-[var(--border-warm)] bg-[var(--bg-base)]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-peach)] backdrop-blur-sm">
            {post.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 pt-0">
          <h3 className="font-[family:var(--font-serif)] text-lg font-bold leading-tight text-[var(--text-primary)] group-hover:text-[var(--accent-peach)] transition-colors">
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-body)]">
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center gap-3 pt-3 border-t border-[var(--border-warm)]">
            <span className="text-xs text-[var(--text-muted)]">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {post.readTime}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
