import { Flame } from "lucide-react";
import { JourneyPost } from "@/types";

export function TimelineHorizontal({ posts }: { posts: JourneyPost[] }) {
  return (
    <div className="mt-8 overflow-x-auto scrollbar-hide">
      <ol className="relative flex min-w-max gap-8 pb-6 md:min-w-0 md:gap-12">
        <li
          aria-hidden="true"
          className="absolute top-[32px] left-0 right-0 h-[1px] bg-stone-800"
        />
        {posts.map((post, index) => (
          <li
            key={post.id}
            className="flex w-[260px] shrink-0 flex-col items-start md:w-auto md:flex-1"
          >
            <div className="flex h-6 w-full items-start">
              <span className="text-xs font-mono text-stone-500">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="relative z-10 flex h-4 w-full">
              <span className="mx-auto block h-4 w-4 rounded-full border-2 border-stone-900 bg-[#E5A93C] shadow-sm" />
            </div>

            <span className="my-4 flex h-8 w-8 items-center justify-center rounded-full border border-stone-800 text-[#E5A93C]">
              <Flame className="h-4 w-4" aria-hidden="true" />
            </span>

            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">
              {post.title}
            </h3>
            <p className="max-w-[260px] text-xs leading-relaxed text-stone-400">
              {post.content}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
