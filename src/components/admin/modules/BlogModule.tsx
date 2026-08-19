"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  X,
  Check,
  Flame,
  Clock,
  Tag,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, Badge } from "../ui/panel";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/formatDate";
import { blogService, CreateBlogPostInput } from "@/lib/api/blog.service";
import { BlogPost } from "@/types";

const CATEGORIES = [
  "Spices & Masala",
  "Culinary Differences",
  "BBQ Tips",
  "Healthy Grilling",
  "Behind the Grill",
  "Our Story",
];

export function BlogModule() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Spices & Masala");
  const [author, setAuthor] = useState("Tikkay Shikkay Pitmasters");
  const [imageUrl, setImageUrl] = useState("/images/hero_image.png");
  const [readTime, setReadTime] = useState("5 min");
  const [tagsInput, setTagsInput] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogService.getAll({ include_unpublished: true });
      setPosts(res.posts || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("Spices & Masala");
    setAuthor("Tikkay Shikkay Pitmasters");
    setImageUrl("/images/hero_image.png");
    setReadTime("5 min");
    setTagsInput("Masala, BBQ, Grilling");
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setAuthor(post.author || "Tikkay Shikkay Pitmasters");
    setImageUrl(post.imageUrl || "/images/hero_image.png");
    setReadTime(post.readTime || "5 min");
    setTagsInput((post.tags || []).join(", "));
    setIsPublished((post as any).is_published !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: CreateBlogPostInput = {
      title,
      excerpt,
      content,
      category,
      author,
      imageUrl,
      readTime,
      tags,
      is_published: isPublished,
    };

    try {
      if (editingPost) {
        const id = editingPost.id || (editingPost as any)._id;
        const updated = await blogService.update(id, payload);
        setPosts((prev) =>
          prev.map((p) => (p.id === id || (p as any)._id === id ? updated : p))
        );
      } else {
        const created = await blogService.create(payload);
        setPosts((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err?.message || "Failed to save story");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    const id = post.id || (post as any)._id;
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;

    try {
      await blogService.delete(id);
      setPosts((prev) => prev.filter((p) => (p.id || (p as any)._id) !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete post");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      categoryFilter === "all" ||
      post.category.toLowerCase().includes(categoryFilter.toLowerCase());

    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content & Storytelling Engine"
        title="Blog & SEO Stories"
        description="Publish culinary insights, BBQ recipes, spice science, and healthy grilling guides to rank organically on search engines."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPosts}
              className="flex items-center gap-2 rounded-xl text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-xl text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Write New Story
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Total Articles"
          value={String(posts.length)}
          sub="Live and draft stories"
        />
        <StatCard
          icon={Flame}
          label="Masala & Prep"
          value={String(posts.filter((p) => p.category.includes("Masala") || p.category.includes("Spices")).length)}
          sub="Spice blend deep dives"
        />
        <StatCard
          icon={Sparkles}
          label="Grill Guides & Tips"
          value={String(posts.filter((p) => p.category.includes("Tips") || p.category.includes("Grill")).length)}
          sub="Techniques & differences"
        />
        <StatCard
          icon={Tag}
          label="Categories"
          value={String(new Set(posts.map((p) => p.category)).size)}
          sub="Active culinary topics"
        />
      </div>

      <SectionCard
        title="Story Directory"
        description="Edit stories, manage markdown content, update hero images, and toggle publishing status"
      >
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[var(--border-warm)]/60 pb-5 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-faint)]" />
            <input
              type="text"
              placeholder="Search by title, excerpt, topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
            >
              <option value="all">All Topics ({posts.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({posts.filter((p) => p.category.includes(cat)).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stories List */}
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-[var(--border-warm)]/60">
            {filteredPosts.map((post) => {
              const id = post.id || (post as any)._id;
              return (
                <div
                  key={id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      <Image
                        src={post.imageUrl || "/images/hero_image.png"}
                        alt={post.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </span>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[var(--accent-orange)]/15 border border-[var(--accent-orange)]/30 px-2 py-0.5 text-[9px] font-extrabold uppercase text-[var(--accent-peach)]">
                          {post.category}
                        </span>
                        <span className="text-[11px] text-[var(--text-faint)] flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {post.readTime}
                        </span>
                        <span className="text-[11px] text-[var(--text-faint)]">
                          · {formatDate(post.publishedAt)}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">
                        {post.title}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                      title="View Article Live"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => openEditModal(post)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                      title="Edit Article"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-faint)] space-y-2">
            <BookOpen className="mx-auto h-8 w-8 text-[var(--text-faint)]/40" />
            <p className="font-semibold text-sm text-[var(--text-muted)]">No articles found</p>
            <p className="text-xs text-[var(--text-faint)]">
              {loading ? "Loading articles..." : "Write a new story or adjust your filter."}
            </p>
          </div>
        )}
      </SectionCard>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/10 bg-[#161616] text-[#e5e2e1] shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#121212] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-orange)] text-white">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {editingPost ? "Edit Story" : "Write New Story"}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Craft SEO-optimized culinary articles with real-time preview
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="max-h-[72vh] overflow-y-auto p-6 space-y-4 scrollbar-none">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Science Behind Charcoal Heat Zones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Category Topic *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Short Excerpt / SEO Meta Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="1-2 sentences summarizing the story for search results..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Full Story Content (Markdown supported) *
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write your article in markdown (use ### for headings, bullet points, bold text)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs font-mono text-white focus:border-[var(--accent-orange)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Author Attribution
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Masala, Tikka, Grilling Tips"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 bg-[#121212] -mx-6 -mb-6 px-6 py-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={saving}
                  className="rounded-xl px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  {saving ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  {editingPost ? "Save Changes" : "Publish Story"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
