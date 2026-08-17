import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPost } from "@/lib/data/getBlog";
import { Reveal } from "@/components/motion/Reveal";
import { CTABanner } from "@/components/ui/CTABanner";
import { ArrowLeft, Clock } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--bg-deep)]">
        <div className="absolute inset-0 scale-110">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[var(--bg-deep)]/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-deep)]/70 via-transparent to-[var(--bg-base)]" />
        </div>

        <div className="relative mx-auto flex min-h-[50vh] w-full max-w-[1280px] flex-col justify-end px-4 pb-16 pt-24 md:min-h-[56vh] lg:px-[64px]">
          <div className="max-w-3xl space-y-5">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-peach)] hover:text-[var(--accent-orange)] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to Blog
            </Link>

            <span className="inline-flex rounded-full border border-[var(--border-warm)] bg-[var(--bg-base)]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-peach)] backdrop-blur-sm">
              {post.category}
            </span>

            <h1 className="font-[family:var(--font-serif)] text-3xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-[var(--text-primary)] md:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span>{post.author}</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-base)] py-[88px] lg:py-[112px]">
        <div className="mx-auto max-w-[760px] px-4">
          <Reveal>
            <article className="prose prose-invert prose-p:leading-relaxed prose-p:text-[var(--text-body)] prose-headings:text-[var(--text-primary)] max-w-none">
              {post.content.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="font-[family:var(--font-serif)] text-base leading-relaxed text-[var(--text-body)] md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          </Reveal>
        </div>
      </section>

      <CTABanner
        data={{
          eyebrow: "Hungry Yet?",
          title: "Order from the Grill",
          description:
            "You've read the story. Now taste it. Hit us up on WhatsApp for a fresh order.",
          primaryLabel: "Order on WhatsApp",
          primaryHref: "https://wa.me/923001234567",
          secondaryLabel: "View Menu",
          secondaryHref: "/menu",
          imageUrl: "/images/hero_image.png",
        }}
      />
    </>
  );
}
