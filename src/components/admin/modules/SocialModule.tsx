"use client";

import Image from "next/image";
import { useState } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Badge, EmptyState, Notice, PageHeader, SectionCard } from "../ui/panel";
import { SubTabs } from "../ui/SubTabs";
import { Field, NumberInput, Select, TextArea, TextInput, Toggle } from "../ui/controls";
import { Button } from "@/components/ui/Button";
import { GoogleReview, InstagramPost } from "@/types";
import { Check, ChevronRight, Globe, Instagram, Trash2 } from "lucide-react";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { galleryService } from "@/lib/api";

type SocialTabKey = "instagram" | "google";

export function SocialModule() {
  const { data, updateSlice } = useAdminData();
  const [tab, setTab] = useState<SocialTabKey>("instagram");
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<
    | { kind: "instagram"; post: InstagramPost }
    | { kind: "google"; review: GoogleReview }
    | null
  >(null);

  // Instagram add state
  const [newInstagram, setNewInstagram] = useState<{
    imageUrl: string;
    caption: string;
    tag: string;
    likes: number;
    comments: number;
  }>({
    imageUrl: "",
    caption: "",
    tag: "#tikkayshikkay",
    likes: 500,
    comments: 25,
  });
  const [isAddingInstagram, setIsAddingInstagram] = useState(false);

  // Google review add state
  const [newGoogleReview, setNewGoogleReview] = useState<{
    customer_name: string;
    rating: number;
    visit_date: string;
    review_text: string;
    verified: boolean;
  }>({
    customer_name: "",
    rating: 5,
    visit_date: "Recent visit",
    review_text: "",
    verified: true,
  });
  const [isAddingGoogle, setIsAddingGoogle] = useState(false);

  const instagram = data.gallery.pageData.instagram || [];
  const googleReviews = data.gallery.pageData.googleReviews || [];

  function commitInstagram(next: InstagramPost[]) {
    updateSlice("gallery", {
      ...data.gallery,
      pageData: { ...data.gallery.pageData, instagram: next },
    });
  }

  function commitGoogle(next: GoogleReview[]) {
    updateSlice("gallery", {
      ...data.gallery,
      pageData: { ...data.gallery.pageData, googleReviews: next },
    });
  }

  async function handleAddInstagram() {
    if (!newInstagram.imageUrl) {
      alert("Please upload an image for the Instagram post");
      return;
    }
    try {
      const created = await galleryService.instagram.create({
        ...newInstagram,
        display_order: instagram.length + 1,
      });
      commitInstagram([...instagram, created]);
      setIsAddingInstagram(false);
      setNewInstagram({
        imageUrl: "",
        caption: "",
        tag: "#tikkayshikkay",
        likes: 500,
        comments: 25,
      });
      setNotice(true);
      setTimeout(() => setNotice(false), 2000);
    } catch (e: any) {
      alert(`Failed to add Instagram post: ${e?.message}`);
    }
  }

  async function handleAddGoogleReview() {
    if (!newGoogleReview.customer_name || !newGoogleReview.review_text) {
      alert("Please fill in the reviewer name and review text");
      return;
    }
    try {
      const created = await galleryService.googleReviews.create({
        ...newGoogleReview,
        source: "Google",
        display_order: googleReviews.length + 1,
      });
      commitGoogle([...googleReviews, created]);
      setIsAddingGoogle(false);
      setNewGoogleReview({
        customer_name: "",
        rating: 5,
        visit_date: "Recent visit",
        review_text: "",
        verified: true,
      });
      setNotice(true);
      setTimeout(() => setNotice(false), 2000);
    } catch (e: any) {
      alert(`Failed to add review: ${e?.message}`);
    }
  }

  async function toggleVerified(review: GoogleReview) {
    const updated = { ...review, verified: !review.verified };
    try {
      if (review.id) {
        await galleryService.googleReviews.update(review.id, { verified: updated.verified });
      }
      commitGoogle(googleReviews.map((r) => (r.id === review.id ? updated : r)));
    } catch (e: any) {
      alert(`Failed to update review: ${e?.message}`);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Social Proof Workspace"
        title="Social & Community"
        description="Manage live Instagram photo feeds and verified Google reviews across the site."
      />

      <SubTabs
        activeId={tab}
        onChange={(id) => setTab(id as SocialTabKey)}
        tabs={[
          { id: "instagram", label: "Instagram Feed", count: instagram.length },
          { id: "google", label: "Google Reviews", count: googleReviews.length },
        ]}
      />

      {notice ? <Notice tone="success">Social settings updated.</Notice> : null}

      {tab === "instagram" && (
        <div className="space-y-5">
          {isAddingInstagram ? (
            <SectionCard
              title="Add Instagram Post"
              description="Add a community post to the public grid"
              actions={
                <>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingInstagram(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddInstagram}>
                    <Check className="mr-1.5 h-3.5 w-3.5" /> Save Post
                  </Button>
                </>
              }
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <ImageUpload
                    label="Post Image"
                    value={newInstagram.imageUrl}
                    folder="gallery/social"
                    onChange={(url) => setNewInstagram({ ...newInstagram, imageUrl: url })}
                  />
                </div>
                <Field label="Caption">
                  <TextInput
                    value={newInstagram.caption}
                    onChange={(e) => setNewInstagram({ ...newInstagram, caption: e.target.value })}
                    placeholder="e.g. Weekend vibes at Tikkay Shikkay"
                  />
                </Field>
                <Field label="Tag / Hashtag">
                  <TextInput
                    value={newInstagram.tag}
                    onChange={(e) => setNewInstagram({ ...newInstagram, tag: e.target.value })}
                  />
                </Field>
                <Field label="Likes Count">
                  <NumberInput
                    value={newInstagram.likes}
                    onChange={(e) =>
                      setNewInstagram({ ...newInstagram, likes: Number(e.target.value) || 0 })
                    }
                  />
                </Field>
                <Field label="Comments Count">
                  <NumberInput
                    value={newInstagram.comments}
                    onChange={(e) =>
                      setNewInstagram({ ...newInstagram, comments: Number(e.target.value) || 0 })
                    }
                  />
                </Field>
              </div>
            </SectionCard>
          ) : null}

          <SectionCard
            title="Instagram Feed Posts"
            description="Manage social media posts shown on the public gallery"
            actions={
              <Button size="sm" variant="outline" onClick={() => setIsAddingInstagram(true)}>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Add Post
              </Button>
            }
          >
            {instagram.length === 0 ? (
              <EmptyState
                icon={Globe}
                title="No Instagram posts yet"
                description="Click Add Post to show off community tags."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {instagram.map((post) => (
                  <div
                    key={post.id}
                    className="overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)]"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={post.imageUrl}
                        alt={post.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="line-clamp-2 text-xs font-bold text-[var(--text-primary)]">
                        {post.caption}
                      </p>
                      <p className="text-xs text-[var(--accent-peach)]">{post.tag}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-warm)]/40 text-[10px] text-[var(--text-faint)]">
                        <span>❤️ {post.likes} likes</span>
                        <span>💬 {post.comments} comments</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPendingDelete({ kind: "instagram", post })}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-[var(--accent-coral)]" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {tab === "google" && (
        <div className="space-y-5">
          {isAddingGoogle ? (
            <SectionCard
              title="Add Google Review"
              description="Add a customer review quote"
              actions={
                <>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingGoogle(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddGoogleReview}>
                    <Check className="mr-1.5 h-3.5 w-3.5" /> Save Review
                  </Button>
                </>
              }
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Customer Name">
                  <TextInput
                    value={newGoogleReview.customer_name}
                    onChange={(e) =>
                      setNewGoogleReview({ ...newGoogleReview, customer_name: e.target.value })
                    }
                    placeholder="e.g. Saad Ahmed"
                  />
                </Field>
                <Field label="Star Rating (1-5)">
                  <NumberInput
                    value={newGoogleReview.rating}
                    onChange={(e) =>
                      setNewGoogleReview({ ...newGoogleReview, rating: Number(e.target.value) || 5 })
                    }
                  />
                </Field>
                <Field label="Visit Date Note">
                  <TextInput
                    value={newGoogleReview.visit_date}
                    onChange={(e) =>
                      setNewGoogleReview({ ...newGoogleReview, visit_date: e.target.value })
                    }
                  />
                </Field>
                <div className="flex items-center pt-6">
                  <Toggle
                    checked={newGoogleReview.verified}
                    onChange={() =>
                      setNewGoogleReview({ ...newGoogleReview, verified: !newGoogleReview.verified })
                    }
                    label="Verified Review"
                  />
                </div>
                <div className="md:col-span-2">
                  <Field label="Review Content">
                    <TextArea
                      value={newGoogleReview.review_text}
                      onChange={(e) =>
                        setNewGoogleReview({ ...newGoogleReview, review_text: e.target.value })
                      }
                      placeholder="e.g. Hands down the best BBQ in Lahore..."
                    />
                  </Field>
                </div>
              </div>
            </SectionCard>
          ) : null}

          <SectionCard
            title="Google Reviews"
            description="Verified customer reviews from Google Maps"
            actions={
              <Button size="sm" variant="outline" onClick={() => setIsAddingGoogle(true)}>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Add Review
              </Button>
            }
          >
            <ul className="divide-y divide-[var(--border-warm)]">
              {googleReviews.map((review) => (
                <li key={review.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        {review.customer_name}
                      </p>
                      {review.verified ? (
                        <Badge tone="green">Verified</Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-[var(--text-body)]">&ldquo;{review.review_text}&rdquo;</p>
                    <p className="text-xs text-[var(--accent-gold)]">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                      <span className="ml-2 text-[var(--text-faint)]">{review.visit_date}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Toggle
                      checked={review.verified}
                      onChange={() => toggleVerified(review)}
                      label="Verified"
                    />
                    <Button size="sm" variant="ghost" onClick={() => setPendingDelete({ kind: "google", review })}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={
          pendingDelete?.kind === "instagram"
            ? "Remove this Instagram post?"
            : "Remove this Google review?"
        }
        description={
          pendingDelete
            ? pendingDelete.kind === "instagram"
              ? "This post will no longer show in the Instagram feed. This cannot be undone."
              : `Review from ${pendingDelete.review.customer_name} will be removed from the gallery. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (pendingDelete?.kind === "instagram") {
            try {
              if (pendingDelete.post.id) await galleryService.instagram.delete(pendingDelete.post.id);
              commitInstagram(instagram.filter((p) => p.id !== pendingDelete.post.id));
            } catch (e: any) {
              alert(`Failed to delete post: ${e?.message}`);
            }
          } else if (pendingDelete?.kind === "google") {
            try {
              if (pendingDelete.review.id) await galleryService.googleReviews.delete(pendingDelete.review.id);
              commitGoogle(googleReviews.filter((r) => r.id !== pendingDelete.review.id));
            } catch (e: any) {
              alert(`Failed to delete review: ${e?.message}`);
            }
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
