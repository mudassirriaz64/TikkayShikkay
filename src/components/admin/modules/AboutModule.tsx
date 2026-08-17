"use client";

import { useState } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Badge, Notice, PageHeader, SectionCard } from "../ui/panel";
import { SubTabs } from "../ui/SubTabs";
import { Field, NumberInput, Select, TextArea, TextInput } from "../ui/controls";
import { Button } from "@/components/ui/Button";
import { FounderDetails, StatItem, MilestoneStat } from "@/types";
import { JourneyPost, MediaType } from "@/types";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Check, ChevronRight, Plus, Trash2 } from "lucide-react";

type AboutTabKey = "founder" | "stats" | "journey" | "milestones";

const newId = (prefix: string) => `${prefix}-${Date.now()}`;

export function AboutModule() {
  const { data } = useAdminData();
  const [tab, setTab] = useState<AboutTabKey>("founder");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Legacy Workspace"
        title="About"
        description="The founder's story, brand statistics, journey posts and milestones that build trust."
      />

      <SubTabs
        activeId={tab}
        onChange={(id) => setTab(id as AboutTabKey)}
        tabs={[
          { id: "founder", label: "Founder" },
          { id: "stats", label: "Stats", count: data.about.stats.length },
          { id: "journey", label: "Journey Posts", count: data.about.journeyPosts.length },
          { id: "milestones", label: "Milestones", count: data.about.milestones.length },
        ]}
      />

      {tab === "founder" && <FounderManager />}
      {tab === "stats" && <StatsManager />}
      {tab === "journey" && <JourneyPostsManager />}
      {tab === "milestones" && <MilestonesManager />}
    </div>
  );
}

function FounderManager() {
  const { data, updateSlice } = useAdminData();
  const [draft, setDraft] = useState<FounderDetails>(data.about.founder);
  const [notice, setNotice] = useState(false);

  function save() {
    updateSlice("about", { ...data.about, founder: draft });
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }

  const set = <K extends keyof FounderDetails>(key: K, val: FounderDetails[K]) =>
    setDraft({ ...draft, [key]: val });

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Founder details saved.</Notice> : null}

      <SectionCard
        title="Founder Profile"
        description="Ahmed Raza — the pitmaster behind the brand"
        actions={
          <>
            <Button size="sm" variant="ghost" onClick={() => setDraft(data.about.founder)}>
              Discard
            </Button>
            <Button size="sm" onClick={save}>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Save Founder
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Portrait URL">
            <TextInput value={draft.portraitUrl} onChange={(e) => set("portraitUrl", e.target.value)} />
          </Field>
          <Field label="Quote Author">
            <TextInput value={draft.quoteAuthor} onChange={(e) => set("quoteAuthor", e.target.value)} />
          </Field>
          <Field label="Eyebrow">
            <TextInput value={draft.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
          </Field>
          <Field label="Title">
            <TextInput value={draft.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Quote Role">
            <TextInput value={draft.quoteRole} onChange={(e) => set("quoteRole", e.target.value)} />
          </Field>
          <Field label="Caption">
            <TextInput value={draft.caption} onChange={(e) => set("caption", e.target.value)} />
          </Field>
        </div>

        <div className="mt-5 space-y-5">
          <Field label="Signature Quote">
            <TextArea value={draft.quote} onChange={(e) => set("quote", e.target.value)} />
          </Field>
          <Field label="Bio">
            <TextArea value={draft.bio} onChange={(e) => set("bio", e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Mission">
              <TextArea value={draft.mission} onChange={(e) => set("mission", e.target.value)} />
            </Field>
            <Field label="Vision">
              <TextArea value={draft.vision} onChange={(e) => set("vision", e.target.value)} />
            </Field>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function StatsManager() {
  const { data, updateSlice } = useAdminData();
  const [draft, setDraft] = useState<StatItem[]>(data.about.stats);
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  function save() {
    updateSlice("about", { ...data.about, stats: draft });
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }
  function patch(index: number, patch: Partial<StatItem>) {
    setDraft(draft.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Statistics saved.</Notice> : null}

      <SectionCard
        title="Brand Statistics"
        description="The numbers band shown on the About page"
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => setDraft([...draft, { value: "0", label: "New Stat" }])}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Stat
            </Button>
            <Button size="sm" onClick={save}>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Save Stats
            </Button>
          </>
        }
      >
        <ul className="space-y-2">
          {draft.map((stat, index) => (
            <li key={index} className="flex items-center gap-2">
              <TextInput
                value={stat.value}
                onChange={(e) => patch(index, { value: e.target.value })}
                className="w-32"
              />
              <TextInput
                value={stat.label}
                onChange={(e) => patch(index, { label: e.target.value })}
                className="flex-1"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPendingDelete(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this statistic?"
        description={
          pendingDelete !== null
            ? `"${draft[pendingDelete]?.label}" will be removed from the About page. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete !== null) {
            setDraft(draft.filter((_, i) => i !== pendingDelete));
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function JourneyPostsManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<JourneyPost | null>(null);
  const [notice, setNotice] = useState(false);

  const posts = data.about.journeyPosts;

  function commit(next: JourneyPost[]) {
    updateSlice("about", { ...data.about, journeyPosts: next });
  }
  function save() {
    if (!editing) return;
    const exists = posts.some((p) => p.id === editing.id);
    commit(exists ? posts.map((p) => (p.id === editing.id ? editing : p)) : [...posts, editing]);
    setEditing(null);
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Journey post saved.</Notice> : null}

      {editing ? (
        <SectionCard
          title={posts.some((p) => p.id === editing.id) ? `Edit — ${editing.title}` : "Add Journey Post"}
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
            <Field label="Day Number">
              <NumberInput value={editing.day_number} onChange={(e) => setEditing({ ...editing, day_number: Number(e.target.value) || 0 })} />
            </Field>
            <Field label="Title">
              <TextInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Media Type">
              <Select value={editing.media_type} onChange={(e) => setEditing({ ...editing, media_type: e.target.value as MediaType })}>
                <option value="Image">Image</option>
                <option value="Video">Video</option>
              </Select>
            </Field>
            <Field label="Media URL">
              <TextInput value={editing.media_url} onChange={(e) => setEditing({ ...editing, media_url: e.target.value })} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Content">
                <TextArea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
              </Field>
            </div>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Journey Posts"
        description="Timeline entries that tell the story of the brand"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditing({
                id: newId("journey"),
                day_number: posts.length + 1,
                title: "New Chapter",
                content: "",
                media_type: "Image",
                media_url: "https://picsum.photos/1000/700",
                created_at: new Date().toISOString(),
              })
            }
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Post
          </Button>
        }
      >
        <ul className="divide-y divide-[var(--border-warm)]">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  Day {post.day_number} — {post.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-muted)]">
                  {post.content}
                </p>
                <p className="mt-1 text-xs text-[var(--text-faint)]">
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone="peach">{post.media_type}</Badge>
                <Button size="sm" variant="outline" onClick={() => setEditing({ ...post })}>
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

function MilestonesManager() {
  const { data, updateSlice } = useAdminData();
  const [draft, setDraft] = useState<MilestoneStat[]>(data.about.milestones);
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  function save() {
    updateSlice("about", { ...data.about, milestones: draft });
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }
  function patch(index: number, patch: Partial<MilestoneStat>) {
    setDraft(draft.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Milestones saved.</Notice> : null}

      <SectionCard
        title="Company Milestones"
        description="Key facts about the brand's growth"
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => setDraft([...draft, { number: "0", label: "New Milestone" }])}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
            </Button>
            <Button size="sm" onClick={save}>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Save Milestones
            </Button>
          </>
        }
      >
        <ul className="space-y-2">
          {draft.map((milestone, index) => (
            <li key={index} className="flex items-center gap-2">
              <TextInput
                value={milestone.number}
                onChange={(e) => patch(index, { number: e.target.value })}
                className="w-32"
              />
              <TextInput
                value={milestone.label}
                onChange={(e) => patch(index, { label: e.target.value })}
                className="flex-1"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPendingDelete(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this milestone?"
        description={
          pendingDelete !== null
            ? `"${draft[pendingDelete]?.label}" will be removed from the About page. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete !== null) {
            setDraft(draft.filter((_, i) => i !== pendingDelete));
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
