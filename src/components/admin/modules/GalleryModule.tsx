"use client";

import Image from "next/image";
import { useState } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Badge, EmptyState, Notice, PageHeader, SectionCard } from "../ui/panel";
import { SubTabs } from "../ui/SubTabs";
import { Field, NumberInput, Select, TextArea, TextInput, Toggle } from "../ui/controls";
import { Button } from "@/components/ui/Button";
import {
  CustomerStory,
  GalleryCategoryId,
  GalleryImage,
  JourneyMilestone,
  JourneyType,
  KitchenProcess,
} from "@/types";
import {
  Check,
  ChevronRight,
  Clock,
  Film,
  Images as ImagesIcon,
  MapPin,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { galleryService, uploadService } from "@/lib/api";

export type GalleryTabKey = "customers" | "kitchen" | "journey" | "media";

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

interface GalleryModuleProps {
  initialSubTab?: GalleryTabKey;
  onSubTabChange?: (tab: GalleryTabKey) => void;
}

export function GalleryModule({ initialSubTab = "media", onSubTabChange }: GalleryModuleProps) {
  const { data } = useAdminData();
  const [tab, setTab] = useState<GalleryTabKey>(initialSubTab);

  function handleTabChange(next: string) {
    const key = next as GalleryTabKey;
    setTab(key);
    onSubTabChange?.(key);
  }

  const storiesCount = (data.gallery.pageData.stories || []).length;
  const kitchenCount = (data.gallery.pageData.kitchen || []).length;
  const journeyCount = (data.gallery.pageData.journey || []).length;
  const mediaCount = (data.gallery.pageData.gallery || []).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visual Workspace"
        title="Gallery"
        description="Customer stories, kitchen craftsmanship, brand journey, and the unified Moments in Smoke media grid."
      />

      <SubTabs
        activeId={tab}
        onChange={handleTabChange}
        tabs={[
          { id: "customers", label: "Customers", count: storiesCount },
          { id: "kitchen", label: "Kitchen", count: kitchenCount },
          { id: "journey", label: "Journey", count: journeyCount },
          { id: "media", label: "Gallery Media", count: mediaCount },
        ]}
      />

      {tab === "customers" && <CustomerStoriesManager />}
      {tab === "kitchen" && <KitchenManager />}
      {tab === "journey" && <JourneyManager />}
      {tab === "media" && <GalleryMediaManager />}
    </div>
  );
}

// ----------------------------------------------------------------------
// 1. Unified Gallery Media Manager (Photos + Videos for "Moments in Smoke")
// ----------------------------------------------------------------------
export function GalleryMediaManager() {
  const { data, updateSlice } = useAdminData();
  const [notice, setNotice] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<GalleryImage | null>(null);

  // Add Form State
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<GalleryCategoryId>("food");
  const [location, setLocation] = useState("Main Outlet");
  const [alt, setAlt] = useState("");
  const [tag, setTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState<string | undefined>(undefined);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatusText, setUploadStatusText] = useState<string>("");

  const gallery = data.gallery.pageData.gallery || [];

  function commit(next: GalleryImage[]) {
    updateSlice("gallery", {
      ...data.gallery,
      pageData: { ...data.gallery.pageData, gallery: next },
    });
  }

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  }

  function resetForm() {
    setIsAdding(false);
    setMediaType("image");
    setCaption("");
    setCategory("food");
    setLocation("Main Outlet");
    setAlt("");
    setTag("");
    setImageUrl("");
    setImagePublicId(undefined);
    setSelectedVideoFile(null);
    setUploadProgress(null);
    setUploadStatusText("");
  }

  async function handleSaveMedia() {
    if (!caption.trim()) {
      alert("Please enter a caption for this media item");
      return;
    }

    try {
      if (mediaType === "image") {
        if (!imageUrl) {
          alert("Please upload an image file");
          return;
        }

        const created = await galleryService.images.create({
          media_type: "image",
          imageUrl,
          image_public_id: imagePublicId,
          caption: caption.trim(),
          category,
          location: location.trim(),
          alt: alt.trim() || caption.trim(),
          tag: tag.trim() || undefined,
          display_order: gallery.length + 1,
        });

        commit([...gallery, created]);
        flash("Photo added to the Moments in Smoke gallery!");
        resetForm();
      } else {
        // Video upload path
        if (!selectedVideoFile) {
          alert("Please select a video file to upload");
          return;
        }

        const config = await uploadService.getVideoConfig();

        if (config.mode === "vps") {
          // VPS Mode: in-process FFmpeg
          setUploadStatusText("Uploading video to server for compression...");
          await uploadService.uploadVideoVPS(selectedVideoFile, {
            title: caption.trim(),
            customer_name: location.trim(),
            description: tag.trim(),
          });

          const all = await galleryService.images.getAll();
          commit(all);
          flash("Video uploaded! Server-side FFmpeg compression queued.");
          resetForm();
        } else {
          // Vercel Mode: Direct signed browser upload to Cloudinary
          setUploadStatusText("Requesting signed upload token...");
          const sig = await uploadService.getVideoSignature();

          setUploadStatusText("Uploading directly to Cloudinary...");
          setUploadProgress(1);

          const result = await uploadService.uploadVideoDirect(selectedVideoFile, sig, (p) => {
            setUploadProgress(p);
            setUploadStatusText(`Uploading video... ${p}%`);
          });

          const durSec = Math.round(result.duration || 0);
          const durStr = `${Math.floor(durSec / 60)}:${(durSec % 60).toString().padStart(2, "0")}`;
          const posterUrl = result.secure_url.replace(/\.[^/.]+$/, ".jpg");

          setUploadStatusText("Saving gallery video item...");
          const created = await galleryService.images.create({
            media_type: "video",
            imageUrl: posterUrl,
            video_url: result.secure_url,
            video_public_id: result.public_id,
            duration: durStr,
            caption: caption.trim(),
            category,
            location: location.trim(),
            alt: alt.trim() || caption.trim(),
            tag: tag.trim() || undefined,
            display_order: gallery.length + 1,
          });

          commit([...gallery, created]);
          flash("Video added to the Moments in Smoke gallery!");
          resetForm();
        }
      }
    } catch (err: any) {
      alert(`Failed to save media item: ${err?.message || "Unknown error"}`);
    } finally {
      setUploadProgress(null);
      setUploadStatusText("");
    }
  }

  async function handleDelete(item: GalleryImage) {
    try {
      await galleryService.images.delete(item.id);
      commit(gallery.filter((img) => img.id !== item.id));
      flash("Media item removed from the gallery.");
    } catch (e: any) {
      alert(`Failed to delete media: ${e?.message}`);
    }
    setPendingDelete(null);
  }

  function patchCategory(id: string, newCat: GalleryCategoryId) {
    commit(gallery.map((img) => (img.id === id ? { ...img, category: newCat } : img)));
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">{notice}</Notice> : null}

      {isAdding ? (
        <SectionCard
          title="Add Media to Moments in Smoke"
          description="Add a photo or a video clip with automatic poster generation"
          actions={
            <>
              <Button size="sm" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveMedia}
                disabled={uploadProgress !== null && uploadProgress < 100}
              >
                <Check className="mr-1.5 h-3.5 w-3.5" /> Save Media
              </Button>
            </>
          }
        >
          <div className="space-y-6">
            {/* Premium Segmented Mode Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2.5">
                Select Media Type
              </label>
              <div className="inline-flex rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-1.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setMediaType("image")}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    mediaType === "image"
                      ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_2px_12px_rgba(255,86,42,0.35)] scale-[1.02]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                  }`}
                >
                  <ImagesIcon className="h-4 w-4" />
                  Photo
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("video")}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    mediaType === "video"
                      ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_2px_12px_rgba(255,86,42,0.35)] scale-[1.02]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                  }`}
                >
                  <Film className="h-4 w-4" />
                  Video Clip
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Caption / Title">
                <TextInput
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Master Pitmaster at the Charcoal Grill"
                  autoFocus
                />
              </Field>

              <Field label="Category Filter">
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GalleryCategoryId)}
                >
                  {(Object.keys(categoryLabels) as GalleryCategoryId[]).map((c) => (
                    <option key={c} value={c}>
                      {categoryLabels[c]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Location Tag">
                <TextInput
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Grill Station, Main Hall"
                />
              </Field>

              <Field label="Tag / Badge (Optional)">
                <TextInput
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Popular, Chef Choice, Special"
                />
              </Field>

              {mediaType === "image" ? (
                <div className="md:col-span-2">
                  <ImageUpload
                    label="Photo File (JPG, PNG, WebP)"
                    value={imageUrl}
                    folder="gallery/photos"
                    onChange={(url, publicId) => {
                      setImageUrl(url);
                      setImagePublicId(publicId);
                    }}
                  />
                </div>
              ) : (
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    Video File (MP4, WebM, MOV — up to 100MB)
                  </label>

                  {selectedVideoFile ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-deep)]/90 p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-orange)]/12 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                          <Film className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                            {selectedVideoFile.name}
                          </p>
                          <p className="text-xs text-[var(--text-faint)]">
                            {(selectedVideoFile.size / (1024 * 1024)).toFixed(1)} MB · Ready to upload &amp; compress
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-surface)] text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] hover:bg-[var(--bg-surface-alt)] transition-all cursor-pointer">
                          Change
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                            onChange={(e) => {
                              if (e.target.files?.[0]) setSelectedVideoFile(e.target.files[0]);
                            }}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setSelectedVideoFile(null)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-8 text-center cursor-pointer transition-all duration-200 hover:border-[var(--accent-orange)]/70 hover:bg-[var(--bg-surface)] group">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] transition-transform duration-300 group-hover:scale-110">
                        <Film className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-peach)] transition-colors">
                          Click to select a video clip
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-faint)]">
                          MP4, MOV, WebM up to 100MB · Automatic poster thumbnail generation
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setSelectedVideoFile(e.target.files[0]);
                        }}
                        className="hidden"
                      />
                    </label>
                  )}

                  {uploadStatusText ? (
                    <div className="space-y-2 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-4">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[var(--accent-peach)]">{uploadStatusText}</span>
                        {uploadProgress !== null ? (
                          <span className="text-[var(--text-primary)] tabular-nums">{uploadProgress}%</span>
                        ) : null}
                      </div>
                      {uploadProgress !== null ? (
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface-raised)]">
                          <div
                            className="h-full bg-[var(--accent-orange)] transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Moments in Smoke Media Grid"
        description="Unified photo and video grid shown on the public Gallery page"
        actions={
          <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Media
          </Button>
        }
      >
        {gallery.length === 0 ? (
          <EmptyState
            icon={ImagesIcon}
            title="No media in gallery yet"
            description="Click Add Media to upload photos or videos."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gallery.map((item) => {
              const isVideo = item.media_type === "video";

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] flex flex-col"
                >
                  <div className="relative h-40 w-full bg-black/50">
                    <Image
                      src={item.imageUrl}
                      alt={item.alt || item.caption}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />

                    {isVideo ? (
                      <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                        <Clock className="h-3 w-3 text-[var(--accent-peach)]" />
                        {item.duration || "Video"}
                      </span>
                    ) : null}

                    {isVideo ? (
                      <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-md">
                          <Play className="ml-0.5 h-4 w-4 fill-current" />
                        </span>
                      </span>
                    ) : null}

                    <span className="absolute right-2.5 top-2.5 rounded-full bg-[var(--accent-gold)]/90 px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3 p-4 flex flex-col justify-between">
                    <div>
                      <p className="line-clamp-1 text-sm font-bold text-[var(--text-primary)]">
                        {item.caption}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-faint)]">
                        <MapPin className="h-3 w-3 text-[var(--accent-peach)]" />
                        {item.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-warm)]/40">
                      <Select
                        value={item.category}
                        onChange={(e) =>
                          patchCategory(item.id, e.target.value as GalleryCategoryId)
                        }
                        className="h-8 py-1 text-[11px]"
                      >
                        {(Object.keys(categoryLabels) as GalleryCategoryId[]).map((c) => (
                          <option key={c} value={c}>
                            {categoryLabels[c]}
                          </option>
                        ))}
                      </Select>
                      <Button size="sm" variant="ghost" onClick={() => setPendingDelete(item)}>
                        <Trash2 className="h-3.5 w-3.5 text-[var(--accent-coral)]" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove this media item?"
        description={
          pendingDelete
            ? `"${pendingDelete.caption}" will be removed from the gallery and its assets cleaned up. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            handleDelete(pendingDelete);
          }
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. Customer Stories Manager (under Gallery -> Customers)
// ----------------------------------------------------------------------
export function CustomerStoriesManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<CustomerStory | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CustomerStory | null>(null);

  const stories = data.gallery.pageData.stories || [];

  function commit(next: CustomerStory[]) {
    updateSlice("gallery", {
      ...data.gallery,
      pageData: { ...data.gallery.pageData, stories: next },
    });
  }

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  }

  async function save() {
    if (!editing) return;
    if (!editing.customer_name.trim() || !editing.quote.trim()) {
      alert("Please enter a customer name and their quote");
      return;
    }

    try {
      const isEdit = stories.some((s) => s.id === editing.id && !editing.id.startsWith("story-new-"));
      if (isEdit) {
        await galleryService.customerStories.update(editing.id, editing);
        commit(stories.map((s) => (s.id === editing.id ? editing : s)));
        flash("Customer story updated successfully!");
      } else {
        const created = await galleryService.customerStories.create({
          ...editing,
          display_order: stories.length + 1,
        });
        commit([...stories, created || editing]);
        flash("Customer story created successfully!");
      }
      setEditing(null);
    } catch (e: any) {
      alert(`Failed to save customer story: ${e?.message}`);
    }
  }

  async function handleDelete(story: CustomerStory) {
    try {
      if (story.id) {
        await galleryService.customerStories.delete(story.id);
      }
      commit(stories.filter((s) => s.id !== story.id));
      flash("Customer story removed.");
    } catch (e: any) {
      alert(`Failed to delete customer story: ${e?.message}`);
    }
    setPendingDelete(null);
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">{notice}</Notice> : null}

      {editing ? (
        <SectionCard
          title={stories.some((s) => s.id === editing.id && !editing.id.startsWith("story-new-")) ? `Edit — ${editing.customer_name}` : "Add Customer Story"}
          description="Feature a family or regular customer review story on the public gallery"
          actions={
            <>
              <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={save}>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Save Story
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Customer / Family Name">
              <TextInput
                value={editing.customer_name}
                onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })}
                placeholder="e.g. Khan Family, Ahmed & Friends"
                autoFocus
              />
            </Field>
            <Field label="Favorite Meal">
              <TextInput
                value={editing.favorite_meal}
                onChange={(e) => setEditing({ ...editing, favorite_meal: e.target.value })}
                placeholder="e.g. Grand Feast Platter, Bharli Boti"
              />
            </Field>
            <Field label="Years Visiting">
              <NumberInput
                value={editing.years_visiting}
                onChange={(e) =>
                  setEditing({ ...editing, years_visiting: Number(e.target.value) || 0 })
                }
              />
            </Field>
            <Field label="Total Visits">
              <NumberInput
                value={editing.visits}
                onChange={(e) => setEditing({ ...editing, visits: Number(e.target.value) || 0 })}
              />
            </Field>
            <div className="md:col-span-2">
              <ImageUpload
                label="Customer / Story Image"
                value={editing.imageUrl}
                folder="gallery/customers"
                onChange={(url, publicId) =>
                  setEditing({ ...editing, imageUrl: url, image_public_id: publicId })
                }
              />
            </div>
            <div className="md:col-span-2">
              <Field label="Customer Quote / Memory">
                <TextArea
                  value={editing.quote}
                  onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                  placeholder="e.g. Tikkay Shikkay has become our go-to spot for every family celebration..."
                />
              </Field>
            </div>

            {/* Dynamic Customer Timeline / Milestones */}
            <div className="md:col-span-2 space-y-3 pt-3 border-t border-[var(--border-warm)]/50">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                    Customer Visit Timeline &amp; Milestones
                  </label>
                  <p className="text-xs text-[var(--text-faint)]">
                    Add memorable moments across their years of dining (e.g., 2021: First Visit, 2024: Eid Dinner)
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const currentTimeline = editing.timeline || [];
                    setEditing({
                      ...editing,
                      timeline: [
                        ...currentTimeline,
                        { year: new Date().getFullYear().toString(), label: "Memorable Dinner", note: "Celebrated with family" },
                      ],
                    });
                  }}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Timeline Point
                </Button>
              </div>

              {(!editing.timeline || editing.timeline.length === 0) ? (
                <div className="rounded-xl border border-dashed border-[var(--border-warm)] p-4 text-center text-xs text-[var(--text-muted)]">
                  No timeline milestones added yet. Click &quot;Add Timeline Point&quot; to show their visit history.
                </div>
              ) : (
                <div className="space-y-3">
                  {editing.timeline.map((point, pIdx) => (
                    <div
                      key={pIdx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-3"
                    >
                      <div className="sm:col-span-2">
                        <TextInput
                          value={point.year}
                          onChange={(e) => {
                            const updated = [...editing.timeline];
                            updated[pIdx] = { ...updated[pIdx], year: e.target.value };
                            setEditing({ ...editing, timeline: updated });
                          }}
                          placeholder="Year (2021)"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <TextInput
                          value={point.label}
                          onChange={(e) => {
                            const updated = [...editing.timeline];
                            updated[pIdx] = { ...updated[pIdx], label: e.target.value };
                            setEditing({ ...editing, timeline: updated });
                          }}
                          placeholder="Label (e.g. First Visit)"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <TextInput
                          value={point.note}
                          onChange={(e) => {
                            const updated = [...editing.timeline];
                            updated[pIdx] = { ...updated[pIdx], note: e.target.value };
                            setEditing({ ...editing, timeline: updated });
                          }}
                          placeholder="Note (e.g. Tried Malai Tikka - instant love!)"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editing.timeline.filter((_, idx) => idx !== pIdx);
                            setEditing({ ...editing, timeline: updated });
                          }}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Customer Stories (Our Regulars)"
        description="Featured stories from families and long-time guests"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditing({
                id: newId("story-new"),
                customer_name: "",
                imageUrl: "/images/gallery/customer-1.jpg",
                favorite_meal: "Grand Feast Platter",
                years_visiting: 1,
                visits: 10,
                quote: "",
                timeline: [],
                display_order: stories.length + 1,
              } as any)
            }
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Story
          </Button>
        }
      >
        {stories.length === 0 ? (
          <EmptyState
            icon={ImagesIcon}
            title="No customer stories yet"
            description="Click Add Story to feature regular guests."
          />
        ) : (
          <ul className="divide-y divide-[var(--border-warm)]">
            {stories.map((story) => (
              <li key={story.id} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-deep)]">
                    <Image src={story.imageUrl} alt={story.customer_name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {story.customer_name}
                    </p>
                    <p className="text-xs text-[var(--text-faint)] truncate">
                      Favorite: {story.favorite_meal} · {story.visits} visits · {story.years_visiting} yrs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => setEditing({ ...story })}>
                    <ChevronRight className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPendingDelete(story)}>
                    <Trash2 className="h-3.5 w-3.5 text-[var(--accent-coral)]" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete customer story?"
        description={
          pendingDelete
            ? `"${pendingDelete.customer_name}" story will be removed from the gallery. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            handleDelete(pendingDelete);
          }
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. Kitchen Manager (under Gallery -> Kitchen)
// ----------------------------------------------------------------------
export function KitchenManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<KitchenProcess | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<KitchenProcess | null>(null);

  // Video state for Kitchen Process
  const [kitchenVideoFile, setKitchenVideoFile] = useState<File | null>(null);
  const [kitchenVideoProgress, setKitchenVideoProgress] = useState<number | null>(null);
  const [kitchenVideoStatus, setKitchenVideoStatus] = useState<string>("");

  // Tag input buffer
  const [newTagInput, setNewTagInput] = useState("");

  const kitchen = data.gallery.pageData.kitchen || [];

  function commit(next: KitchenProcess[]) {
    updateSlice("gallery", {
      ...data.gallery,
      pageData: { ...data.gallery.pageData, kitchen: next },
    });
  }

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  }

  function handleAddTag() {
    if (!newTagInput.trim() || !editing) return;
    const currentTags = editing.technique_tags || [];
    if (!currentTags.includes(newTagInput.trim())) {
      setEditing({ ...editing, technique_tags: [...currentTags, newTagInput.trim()] });
    }
    setNewTagInput("");
  }

  function handleRemoveTag(tagToRemove: string) {
    if (!editing) return;
    const currentTags = editing.technique_tags || [];
    setEditing({ ...editing, technique_tags: currentTags.filter((t) => t !== tagToRemove) });
  }

  async function save() {
    if (!editing) return;
    if (!editing.title.trim() || !editing.story.trim()) {
      alert("Please enter a step title and process story");
      return;
    }

    try {
      let finalEditing = { ...editing };

      // Handle video upload if a new video file was selected
      if (kitchenVideoFile) {
        const config = await uploadService.getVideoConfig();
        if (config.mode === "vps") {
          setKitchenVideoStatus("Uploading video to server for compression...");
          await uploadService.uploadVideoVPS(kitchenVideoFile, {
            title: editing.title,
            customer_name: "Kitchen Craft",
            description: editing.fact || "",
          });
        } else {
          setKitchenVideoStatus("Requesting upload signature...");
          const sig = await uploadService.getVideoSignature();
          setKitchenVideoStatus("Uploading directly to Cloudinary...");
          const res = await uploadService.uploadVideoDirect(kitchenVideoFile, sig, (p) => {
            setKitchenVideoProgress(p);
            setKitchenVideoStatus(`Uploading video... ${p}%`);
          });
          finalEditing.video_url = res.secure_url;
          finalEditing.video_public_id = res.public_id;
        }
      }

      const isEdit = kitchen.some((k) => k.id === finalEditing.id && !finalEditing.id.startsWith("step-new-"));
      if (isEdit) {
        await galleryService.kitchenProcesses.update(finalEditing.id, finalEditing);
        commit(kitchen.map((k) => (k.id === finalEditing.id ? finalEditing : k)));
        flash("Kitchen process step updated!");
      } else {
        const created = await galleryService.kitchenProcesses.create({
          ...finalEditing,
          display_order: kitchen.length + 1,
        });
        commit([...kitchen, created || finalEditing]);
        flash("Kitchen process step added!");
      }
      setEditing(null);
      setKitchenVideoFile(null);
      setKitchenVideoProgress(null);
      setKitchenVideoStatus("");
    } catch (e: any) {
      alert(`Failed to save kitchen process: ${e?.message}`);
    }
  }

  async function handleDelete(step: KitchenProcess) {
    try {
      if (step.id) {
        await galleryService.kitchenProcesses.delete(step.id);
      }
      commit(kitchen.filter((k) => k.id !== step.id));
      flash("Kitchen process step removed.");
    } catch (e: any) {
      alert(`Failed to delete kitchen process: ${e?.message}`);
    }
    setPendingDelete(null);
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">{notice}</Notice> : null}

      {editing ? (
        <SectionCard
          title={kitchen.some((k) => k.id === editing.id && !editing.id.startsWith("step-new-")) ? `Edit — Step ${editing.step}: ${editing.title}` : "Add Kitchen Process Step"}
          description="Behind the scenes craftsmanship, flame techniques, and culinary secrets"
          actions={
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(null);
                  setKitchenVideoFile(null);
                  setKitchenVideoProgress(null);
                  setKitchenVideoStatus("");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={save} disabled={kitchenVideoProgress !== null && kitchenVideoProgress < 100}>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Save Step
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Step Number">
              <NumberInput
                value={editing.step}
                onChange={(e) => setEditing({ ...editing, step: Number(e.target.value) || 1 })}
              />
            </Field>

            <Field label="Step Title">
              <TextInput
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="e.g. The Ancestral Marination"
                autoFocus
              />
            </Field>

            <Field label="Duration / Timeframe">
              <TextInput
                value={editing.time}
                onChange={(e) => setEditing({ ...editing, time: e.target.value })}
                placeholder="e.g. 8+ hours, 15 minutes, 30 min to heat"
              />
            </Field>

            <Field label="Temperature / Heat Reading (Optional)">
              <TextInput
                value={editing.temperature || ""}
                onChange={(e) => setEditing({ ...editing, temperature: e.target.value })}
                placeholder="e.g. 800°C Radiant Charcoal Heat, 4°C Cold Soak"
              />
            </Field>

            <Field label="Key Fact / 'THE DETAIL' Callout">
              <TextInput
                value={editing.fact || ""}
                onChange={(e) => setEditing({ ...editing, fact: e.target.value })}
                placeholder="e.g. 42 secret spices go into each batch"
              />
            </Field>

            <Field label="Key Ingredients / Tools (Optional)">
              <TextInput
                value={editing.ingredients_highlight || ""}
                onChange={(e) => setEditing({ ...editing, ingredients_highlight: e.target.value })}
                placeholder="e.g. Mustard Oil, Raw Papaya, Babool Hardwood Charcoal"
              />
            </Field>

            <div className="flex items-center pt-2">
              <Toggle
                checked={editing.is_featured || false}
                onChange={() => setEditing({ ...editing, is_featured: !editing.is_featured })}
                label="Highlight as Signature Step (Ember Glow)"
              />
            </div>

            {/* Technique Tags Chip List */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Technique Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editing.technique_tags || []).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-orange)]/15 border border-[var(--accent-orange)]/30 px-3 py-1 text-xs font-bold text-[var(--accent-orange)]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <TextInput
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type a technique (e.g. Slow Smoked, Hand-Skewered) and click Add"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddTag}>
                  Add Tag
                </Button>
              </div>
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <ImageUpload
                label="Process Step Image (Primary Visual)"
                value={editing.imageUrl}
                folder="gallery/kitchen"
                onChange={(url, publicId) =>
                  setEditing({ ...editing, imageUrl: url, image_public_id: publicId })
                }
              />
            </div>

            {/* Optional Video Clip Upload */}
            <div className="md:col-span-2 space-y-3 pt-3 border-t border-[var(--border-warm)]/50">
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Add Ambient Video Clip (Optional — replaces photo with looping background clip)
              </label>

              {editing.video_url && !kitchenVideoFile ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-deep)]/90 p-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-orange)]/12 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                      <Film className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[var(--text-primary)]">
                        Active Video Clip
                      </p>
                      <p className="text-xs text-[var(--accent-peach)] font-mono truncate max-w-md">
                        {editing.video_url}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing({ ...editing, video_url: undefined, video_public_id: undefined });
                      setKitchenVideoFile(null);
                      setKitchenVideoProgress(null);
                      setKitchenVideoStatus("");
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove Video
                  </button>
                </div>
              ) : kitchenVideoFile ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-deep)]/90 p-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-orange)]/12 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30">
                      <Film className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                        {kitchenVideoFile.name}
                      </p>
                      <p className="text-xs text-[var(--text-faint)]">
                        {(kitchenVideoFile.size / (1024 * 1024)).toFixed(1)} MB · Ready to upload
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setKitchenVideoFile(null);
                      setKitchenVideoProgress(null);
                      setKitchenVideoStatus("");
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Cancel Video
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-[var(--border-warm)] bg-[var(--bg-surface-alt)] p-6 text-center cursor-pointer transition-all duration-200 hover:border-[var(--accent-orange)]/70 hover:bg-[var(--bg-surface)] group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] transition-transform duration-300 group-hover:scale-110">
                    <Film className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">
                      Click to add a short ambient video clip for this step
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">
                      MP4, MOV, WebM up to 100MB (e.g. fire turning, smoke sizzle)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setKitchenVideoFile(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </label>
              )}

              {kitchenVideoStatus ? (
                <div className="space-y-2 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[var(--accent-peach)]">{kitchenVideoStatus}</span>
                    {kitchenVideoProgress !== null ? (
                      <span className="text-[var(--text-primary)] tabular-nums">{kitchenVideoProgress}%</span>
                    ) : null}
                  </div>
                  {kitchenVideoProgress !== null ? (
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface-raised)]">
                      <div
                        className="h-full bg-[var(--accent-orange)] transition-all duration-300"
                        style={{ width: `${kitchenVideoProgress}%` }}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Chef Secret */}
            <div className="md:col-span-2">
              <Field label="Chef's Secret / Insider Tip (Optional)">
                <TextArea
                  value={editing.chef_secret || ""}
                  onChange={(e) => setEditing({ ...editing, chef_secret: e.target.value })}
                  placeholder="e.g. Always rest the skewers for 60 seconds over hickory smoke before serving to lock in the juices..."
                />
              </Field>
            </div>

            {/* Detailed Story */}
            <div className="md:col-span-2">
              <Field label="Detailed Story (Main Narrative)">
                <TextArea
                  value={editing.story}
                  onChange={(e) => setEditing({ ...editing, story: e.target.value })}
                  placeholder="Describe what happens at this stage of the kitchen craft..."
                />
              </Field>
            </div>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Kitchen Processes"
        description="Behind the scenes preparation stages"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditing({
                id: newId("step-new"),
                step: kitchen.length + 1,
                title: "",
                time: "Daily",
                fact: "",
                imageUrl: "/images/gallery/kitchen-grilling.jpg",
                story: "",
                display_order: kitchen.length + 1,
              } as any)
            }
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Step
          </Button>
        }
      >
        {kitchen.length === 0 ? (
          <EmptyState
            icon={ImagesIcon}
            title="No kitchen processes yet"
            description="Click Add Step to highlight kitchen craftsmanship."
          />
        ) : (
          <ul className="divide-y divide-[var(--border-warm)]">
            {kitchen.map((step) => (
              <li key={step.id} className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-deep)]">
                    <Image src={step.imageUrl} alt={step.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      Step {step.step}: {step.title}
                      <span className="ml-2 text-xs font-normal text-[var(--text-faint)]">({step.time})</span>
                    </p>
                    <p className="line-clamp-1 text-xs text-[var(--text-body)]">{step.story}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing({ ...step })}>
                    <ChevronRight className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPendingDelete(step)}>
                    <Trash2 className="h-3.5 w-3.5 text-[var(--accent-coral)]" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete kitchen step?"
        description={
          pendingDelete
            ? `Step ${pendingDelete.step} ("${pendingDelete.title}") will be removed from the kitchen story. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            handleDelete(pendingDelete);
          }
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. Journey Manager (under Gallery -> Journey)
// ----------------------------------------------------------------------
export function JourneyManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<JourneyMilestone | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JourneyMilestone | null>(null);

  const journey = data.gallery.pageData.journey || [];

  function commit(next: JourneyMilestone[]) {
    updateSlice("gallery", {
      ...data.gallery,
      pageData: { ...data.gallery.pageData, journey: next },
    });
  }

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  }

  async function save() {
    if (!editing) return;
    if (!editing.title.trim() || !editing.year.trim()) {
      alert("Please enter a title and year for the milestone");
      return;
    }

    try {
      const isExisting = journey.some((m) => m.id === editing.id && !editing.id.startsWith("mile-new-"));
      if (isExisting) {
        await galleryService.journeyMilestones.update(editing.id, editing);
        commit(journey.map((m) => (m.id === editing.id ? editing : m)));
        flash("Journey moment updated!");
      } else {
        const { id, ...createPayload } = editing;
        const created = await galleryService.journeyMilestones.create({
          ...createPayload,
          display_order: journey.length + 1,
        });
        commit([...journey, created || editing]);
        flash("Journey moment added!");
      }
      setEditing(null);
    } catch (e: any) {
      alert(`Failed to save milestone: ${e?.message}`);
    }
  }

  async function handleDelete(milestone: JourneyMilestone) {
    try {
      if (milestone.id) {
        await galleryService.journeyMilestones.delete(milestone.id);
      }
      commit(journey.filter((m) => m.id !== milestone.id));
      flash("Journey moment removed.");
    } catch (e: any) {
      alert(`Failed to delete milestone: ${e?.message}`);
    }
    setPendingDelete(null);
  }

  const typeTone: Record<JourneyType, "orange" | "green" | "gold" | "red" | "neutral"> = {
    milestone: "orange",
    achievement: "green",
    challenge: "gold",
    lesson: "red",
    future: "neutral",
  };

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">{notice}</Notice> : null}

      {editing ? (
        <SectionCard
          title={journey.some((m) => m.id === editing.id && !editing.id.startsWith("mile-new-")) ? `Edit — ${editing.title}` : "Add Journey Moment"}
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
            <Field label="Year">
              <TextInput value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} placeholder="e.g. 2027" autoFocus />
            </Field>
            <Field label="Title">
              <TextInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. International Expansion" />
            </Field>
            <Field label="Badge Text">
              <TextInput value={editing.badge} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} placeholder="e.g. Milestone, Expansion, Global" />
            </Field>
            <Field label="Moment Type">
              <Select
                value={editing.type}
                onChange={(e) => setEditing({ ...editing, type: e.target.value as JourneyType })}
              >
                {journeyTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="md:col-span-2">
              <ImageUpload
                label="Milestone Image"
                value={editing.imageUrl}
                folder="gallery/journey"
                onChange={(url, publicId) =>
                  setEditing({ ...editing, imageUrl: url, image_public_id: publicId })
                }
              />
            </div>
            <div className="md:col-span-2">
              <Field label="Story">
                <TextArea
                  value={editing.story}
                  onChange={(e) => setEditing({ ...editing, story: e.target.value })}
                  placeholder="Describe this milestone in the brand journey..."
                />
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
                id: newId("mile-new"),
                year: (new Date().getFullYear() + 1).toString(),
                title: "",
                imageUrl: "/images/gallery/journey-future.jpg",
                story: "",
                badge: "Future",
                type: "milestone",
                display_order: journey.length + 1,
              })
            }
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Moment
          </Button>
        }
      >
        <ul className="divide-y divide-[var(--border-warm)]">
          {[...journey]
            .sort((a, b) => (parseInt(a.year, 10) || 0) - (parseInt(b.year, 10) || 0))
            .map((moment) => (
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
                <Button size="sm" variant="ghost" onClick={() => setPendingDelete(moment)}>
                  <Trash2 className="h-3.5 w-3.5 text-[var(--accent-coral)]" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete journey moment?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" (${pendingDelete.year}) will be removed from the brand journey. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            handleDelete(pendingDelete);
          }
        }}
      />
    </div>
  );
}
