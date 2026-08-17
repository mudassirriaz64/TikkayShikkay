"use client";

import Image from "next/image";
import { useState } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Badge, EmptyState, Notice, PageHeader, SectionCard } from "../ui/panel";
import { SubTabs } from "../ui/SubTabs";
import { Field, NumberInput, Select, TextArea, TextInput, Toggle } from "../ui/controls";
import { Button } from "@/components/ui/Button";
import {
  GalleryCategoryId,
  GalleryImage,
  GoogleReview,
  InstagramPost,
  JourneyMilestone,
  JourneyType,
  KitchenProcess,
} from "@/types";
import {
  Check,
  ChevronRight,
  Images as ImagesIcon,
  Instagram,
  Trash2,
} from "lucide-react";
import { ConfirmDialog } from "../ui/ConfirmDialog";

type GalleryTabKey = "photos" | "kitchen" | "journey" | "social";

const categoryLabels: Record<GalleryCategoryId, string> = {
  food: "Food",
  grill: "Grill",
  customers: "Customers",
  atmosphere: "Atmosphere",
};

const journeyTypes: JourneyType[] = [
  "milestone",
  "achievement",
  "challenge",
  "lesson",
  "future",
];

const newId = (prefix: string) => `${prefix}-${Date.now()}`;

export function GalleryModule() {
  const { data } = useAdminData();
  const [tab, setTab] = useState<GalleryTabKey>("photos");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visual Workspace"
        title="Gallery"
        description="Every photo, kitchen story and journey moment that shows the fire behind the brand."
      />

      <SubTabs
        activeId={tab}
        onChange={(id) => setTab(id as GalleryTabKey)}
        tabs={[
          { id: "photos", label: "Photos", count: data.gallery.pageData.gallery.length },
          { id: "kitchen", label: "Kitchen", count: data.gallery.pageData.kitchen.length },
          { id: "journey", label: "Journey", count: data.gallery.pageData.journey.length },
          { id: "social", label: "Social", count: data.gallery.pageData.instagram.length },
        ]}
      />

      {tab === "photos" && <PhotosManager />}
      {tab === "kitchen" && <KitchenManager />}
      {tab === "journey" && <JourneyManager />}
      {tab === "social" && <SocialManager />}
    </div>
  );
}

function PhotosManager() {
  const { data, updateSlice } = useAdminData();
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<GalleryImage | null>(null);

  const gallery = data.gallery.pageData.gallery;

  function commit(next: GalleryImage[]) {
    updateSlice("gallery", {
      ...data.gallery,
      pageData: { ...data.gallery.pageData, gallery: next },
    });
  }
  function patchCategory(id: string, category: GalleryCategoryId) {
    commit(gallery.map((img) => (img.id === id ? { ...img, category } : img)));
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="danger">Photo removed from the gallery.</Notice> : null}

      {gallery.length === 0 ? (
        <EmptyState
          icon={ImagesIcon}
          title="No photos yet"
          description="Gallery images will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gallery.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)]"
            >
              <div className="relative h-32 w-full">
                <Image
                  src={img.imageUrl}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-4">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {img.caption}
                </p>
                <p className="text-xs text-[var(--text-faint)]">{img.location}</p>
                <div className="flex items-center justify-between gap-2">
                  <Select
                    value={img.category}
                    onChange={(e) =>
                      patchCategory(img.id, e.target.value as GalleryCategoryId)
                    }
                    className="h-9 py-1.5 text-xs"
                  >
                    {(Object.keys(categoryLabels) as GalleryCategoryId[]).map((c) => (
                      <option key={c} value={c}>
                        {categoryLabels[c]}
                      </option>
                    ))}
                  </Select>
                  <Button size="sm" variant="ghost" onClick={() => setPendingDelete(img)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove this photo?"
        description={
          pendingDelete
            ? `"${pendingDelete.caption}" will be removed from the gallery. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            commit(gallery.filter((img) => img.id !== pendingDelete.id));
            setNotice(true);
            setTimeout(() => setNotice(false), 2000);
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function KitchenManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<KitchenProcess | null>(null);
  const [notice, setNotice] = useState(false);

  const kitchen = data.gallery.pageData.kitchen;

  function commit(next: KitchenProcess[]) {
    updateSlice("gallery", {
      ...data.gallery,
      pageData: { ...data.gallery.pageData, kitchen: next },
    });
  }
  function save() {
    if (!editing) return;
    commit(kitchen.map((k) => (k.id === editing.id ? editing : k)));
    setEditing(null);
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Kitchen story saved.</Notice> : null}

      {editing ? (
        <SectionCard
          title={`Edit — Step ${editing.step}: ${editing.title}`}
          actions={
            <>
              <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={save}>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Save
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Step Number">
              <NumberInput
                value={editing.step}
                onChange={(e) => setEditing({ ...editing, step: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Title">
              <TextInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Time">
              <TextInput value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} />
            </Field>
            <Field label="Image URL">
              <TextInput value={editing.imageUrl} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Story">
                <TextArea value={editing.story} onChange={(e) => setEditing({ ...editing, story: e.target.value })} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Fact">
                <TextInput value={editing.fact} onChange={(e) => setEditing({ ...editing, fact: e.target.value })} />
              </Field>
            </div>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Kitchen Stories" description="The five-step process told on the gallery page">
        <ul className="divide-y divide-[var(--border-warm)]">
          {kitchen.map((step) => (
            <li key={step.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  <span className="text-[var(--accent-orange)]">{step.step}.</span>{" "}
                  {step.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-muted)]">
                  {step.fact}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone="peach">{step.time}</Badge>
                <Button size="sm" variant="outline" onClick={() => setEditing({ ...step })}>
                  <ChevronRight className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function JourneyManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<JourneyMilestone | null>(null);
  const [notice, setNotice] = useState(false);

  const journey = data.gallery.pageData.journey;

  function commit(next: JourneyMilestone[]) {
    updateSlice("gallery", {
      ...data.gallery,
      pageData: { ...data.gallery.pageData, journey: next },
    });
  }
  function save() {
    if (!editing) return;
    const exists = journey.some((m) => m.id === editing.id);
    commit(exists ? journey.map((m) => (m.id === editing.id ? editing : m)) : [...journey, editing]);
    setEditing(null);
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }

  const typeTone: Record<JourneyType, "orange" | "gold" | "peach" | "neutral" | "red"> = {
    milestone: "orange",
    achievement: "gold",
    challenge: "red",
    lesson: "peach",
    future: "neutral",
  };

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Journey moment saved.</Notice> : null}

      {editing ? (
        <SectionCard
          title={editing.id.startsWith("new") ? "Add Journey Moment" : `Edit — ${editing.title}`}
          actions={
            <>
              <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={save}>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Save
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Year">
              <TextInput value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
            </Field>
            <Field label="Title">
              <TextInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Badge">
              <TextInput value={editing.badge} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} />
            </Field>
            <Field label="Type">
              <Select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as JourneyType })}>
                {journeyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Image URL" className="md:col-span-2">
              <TextInput value={editing.imageUrl} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} />
            </Field>
            <div className="md:col-span-3">
              <Field label="Story">
                <TextArea value={editing.story} onChange={(e) => setEditing({ ...editing, story: e.target.value })} />
              </Field>
            </div>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Brand Journey"
        description="From the first flame to the road ahead"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditing({
                id: newId("mile"),
                year: "2026",
                title: "New Moment",
                imageUrl: "/images/gallery/journey-future.jpg",
                story: "",
                badge: "New",
                type: "milestone",
              })
            }
          >
            <Check className="mr-1.5 h-3.5 w-3.5" /> Add Moment
          </Button>
        }
      >
        <ul className="divide-y divide-[var(--border-warm)]">
          {journey.map((moment) => (
            <li key={moment.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {moment.title}
                  <span className="ml-2 text-xs font-normal text-[var(--text-faint)]">
                    {moment.year}
                  </span>
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge tone={typeTone[moment.type]}>{moment.type}</Badge>
                  <Badge tone="neutral">{moment.badge}</Badge>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing({ ...moment })}>
                  <ChevronRight className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function SocialManager() {
  const { data, updateSlice } = useAdminData();
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<
    | { kind: "instagram"; post: InstagramPost }
    | { kind: "google"; review: GoogleReview }
    | null
  >(null);

  const instagram = data.gallery.pageData.instagram;
  const googleReviews = data.gallery.pageData.googleReviews;

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
  function toggleVerified(review: GoogleReview) {
    commitGoogle(
      googleReviews.map((r) =>
        r.id === review.id ? { ...r, verified: !r.verified } : r,
      ),
    );
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="danger">Social post removed.</Notice> : null}

      <SectionCard title="Instagram Feed" description="Reposted guest content from the feed">
        {instagram.length === 0 ? (
          <EmptyState icon={Instagram} title="No posts" description="Instagram posts appear here." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instagram.map((post) => (
              <div
                key={post.id}
                className="overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-deep)]"
              >
                <div className="relative h-28 w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <p className="line-clamp-2 text-sm text-[var(--text-primary)]">
                    {post.caption}
                  </p>
                  <p className="text-xs font-bold text-[var(--accent-peach)]">{post.tag}</p>
                  <p className="text-xs text-[var(--text-faint)]">
                    ♥ {post.likes.toLocaleString()} · 💬 {post.comments}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setPendingDelete({ kind: "instagram", post })}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Google Reviews" description="External ratings pulled into the gallery">
        <ul className="divide-y divide-[var(--border-warm)]">
          {googleReviews.map((review) => (
            <li key={review.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {review.customer_name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">
                  {review.review_text}
                </p>
                <p className="mt-1 text-xs text-[var(--accent-gold)]">
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
        onConfirm={() => {
          if (pendingDelete?.kind === "instagram") {
            commitInstagram(instagram.filter((p) => p.id !== pendingDelete.post.id));
          } else if (pendingDelete?.kind === "google") {
            commitGoogle(googleReviews.filter((r) => r.id !== pendingDelete.review.id));
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
