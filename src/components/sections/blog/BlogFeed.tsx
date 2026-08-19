"use client";

import { useState } from "react";
import { Search, Flame, Sparkles } from "lucide-react";
import { BlogPost } from "@/types";
import { BlogPostCard } from "./BlogPostCard";
import { Reveal } from "@/components/motion/Reveal";

interface BlogFeedProps {
  initialPosts: BlogPost[];
}

const CATEGORIES = [
  "All Stories",
  "Spices & Masala",
  "Culinary Differences",
  "BBQ Tips",
  "Healthy Grilling",
  "Behind the Grill",
  "Our Story",
];

export function BlogFeed({ initialPosts }: BlogFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Stories");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = initialPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All Stories" ||
      post.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-[var(--bg-base)] py-[72px] lg:py-[96px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px] space-y-10">
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-warm)]/60 pb-6">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_20px_rgba(255,86,42,0.3)]"
                      : "bg-[var(--bg-surface)] border border-[var(--border-warm)] text-[var(--text-muted)] hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-faint)]" />
            <input
              type="text"
              placeholder="Search recipes, tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface)] pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <Reveal key={post.id || post.slug} delay={index * 0.08}>
                <BlogPostCard post={post} index={index} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <Flame className="mx-auto h-8 w-8 text-[var(--accent-orange)]/50" />
            <p className="text-base font-bold text-[var(--text-primary)]">No stories match your criteria</p>
            <p className="text-xs text-[var(--text-muted)]">Try selecting another category or resetting your search.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All Stories");
                setSearchQuery("");
              }}
              className="mt-2 text-xs font-bold text-[var(--accent-orange)] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
