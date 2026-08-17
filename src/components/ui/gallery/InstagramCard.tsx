import Image from "next/image";
import { BadgeCheck, Heart, MessageCircle } from "lucide-react";
import { InstagramPost } from "@/types";

interface InstagramCardProps {
  post: InstagramPost;
}

export function InstagramCard({ post }: InstagramCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-peach)]/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
      <header className="flex items-center gap-3 p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-ember)] font-[family:var(--font-serif)] text-sm font-bold text-[var(--text-on-orange)]">
          TS
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--text-primary)]">
            tikkayshikkay
            <BadgeCheck className="h-4 w-4 text-[var(--accent-peach)]" aria-hidden="true" />
          </p>
          <p className="text-xs text-[var(--text-faint)]">Story highlight</p>
        </div>
      </header>

      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.caption}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4 text-[var(--text-primary)]">
          <span className="flex items-center gap-1.5 text-sm">
            <Heart
              className="h-4 w-4 text-[var(--accent-ember)] transition-transform duration-300 group-hover:scale-125"
              aria-hidden="true"
            />
            <span className="tabular-nums">{post.likes.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm text-[var(--text-faint)]">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span className="tabular-nums">{post.comments.toLocaleString()}</span>
          </span>
          <span className="ml-auto rounded-full border border-[var(--accent-peach)]/25 bg-[var(--accent-peach)]/10 px-2.5 py-1 text-[10px] font-bold text-[var(--accent-peach)]">
            {post.tag}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-body)]">
          {post.caption}{" "}
          <span className="font-bold text-[var(--accent-peach)]">#TikkayShikkay</span>
        </p>
      </div>
    </article>
  );
}
