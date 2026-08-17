"use client";

import { useState } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Field, NumberInput, TextArea, TextInput, Toggle } from "../ui/controls";
import { Notice, PageHeader, SectionCard } from "../ui/panel";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { SiteSettings } from "@/types";

export function SettingsModule() {
  const { data, updateSlice } = useAdminData();
  const [draft, setDraft] = useState<SiteSettings>(data.settings);
  const [saved, setSaved] = useState(false);

  function save() {
    updateSlice("settings", {
      ...draft,
      updated_at: new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Site Settings"
        description="Hero copy, live-cam status and fresh-batch counters that power the homepage."
      />

      <SectionCard
        title="Homepage Hero"
        description="Shown in the hero section on the landing page"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Field label="Hero Title">
            <TextInput
              value={draft.hero_title}
              onChange={(e) => setDraft({ ...draft, hero_title: e.target.value })}
            />
          </Field>
          <Field label="Hero Media URL">
            <TextInput
              value={draft.hero_media_url}
              onChange={(e) =>
                setDraft({ ...draft, hero_media_url: e.target.value })
              }
            />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Hero Subtitle">
            <TextArea
              value={draft.hero_subtitle}
              onChange={(e) =>
                setDraft({ ...draft, hero_subtitle: e.target.value })
              }
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Live Signals" description="Status badges shown across the site">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Live Cam
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Show the &quot;Live from the grill&quot; indicator
              </p>
            </div>
            <Toggle
              checked={draft.live_cam_active}
              onChange={(v) => setDraft({ ...draft, live_cam_active: v })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <Field
              label="Fresh Batch Count"
              hint="Number shown next to the fresh batch badge"
            >
              <NumberInput
                value={draft.fresh_batch_count}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    fresh_batch_count: Number(e.target.value) || 0,
                  })
                }
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      {saved ? (
        <Notice tone="success">
          <Check className="mr-1.5 inline h-4 w-4" /> Settings saved.
        </Notice>
      ) : null}

      <div className="flex items-center gap-4">
        <Button onClick={save}>Save Changes</Button>
        <span className="text-xs text-[var(--text-faint)]">
          Last updated:{" "}
          {new Date(data.settings.updated_at).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
