"use client";

import { useState } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Notice, PageHeader, SectionCard } from "../ui/panel";
import { SubTabs } from "../ui/SubTabs";
import { Field, Select, TextArea, TextInput } from "../ui/controls";
import { Button } from "@/components/ui/Button";
import {
  CateringData,
  ContactAccent,
  ContactMethod,
  FranchiseData,
  MapDetails,
  OpeningDay,
} from "@/types/contact";
import { Check, MapPin, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { contactService } from "@/lib/api";

type ContactTabKey = "methods" | "hours" | "map" | "ctas";

const newId = (prefix: string) => `${prefix}-${Date.now()}`;

export function ContactModule() {
  const { data } = useAdminData();
  const [tab, setTab] = useState<ContactTabKey>("methods");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Connections Workspace"
        title="Contact"
        description="Contact methods, opening hours, the map and the marketing CTAs on the contact page."
      />

      <SubTabs
        activeId={tab}
        onChange={(id) => setTab(id as ContactTabKey)}
        tabs={[
          { id: "methods", label: "Methods", count: data.contact.methods.length },
          { id: "hours", label: "Hours", count: data.contact.openingHours.length },
          { id: "map", label: "Map" },
          { id: "ctas", label: "CTAs" },
        ]}
      />

      {tab === "methods" && <MethodsManager />}
      {tab === "hours" && <HoursManager />}
      {tab === "map" && <MapManager />}
      {tab === "ctas" && <CtasManager />}
    </div>
  );
}

function MethodsManager() {
  const { data, updateSlice } = useAdminData();
  const [draft, setDraft] = useState<ContactMethod[]>(data.contact.methods);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContactMethod | null>(null);

  const accents: ContactAccent[] = ["whatsapp", "orange", "peach", "gold"];
  const icons: ContactMethod["icon"][] = ["whatsapp", "phone", "map-pin"];

  async function save() {
    try {
      await contactService.saveMethods(draft);
      updateSlice("contact", { ...data.contact, methods: draft });
      setNotice("Contact methods saved and updated!");
      setTimeout(() => setNotice(null), 3000);
    } catch (e: any) {
      alert(`Failed to save contact methods: ${e?.message}`);
    }
  }
  function handleValueChange(method: ContactMethod, val: string) {
    const isWhatsapp =
      method.icon === "whatsapp" ||
      method.accent === "whatsapp" ||
      method.title.toLowerCase().includes("whatsapp");

    const isVisitUs =
      method.icon === "map-pin" ||
      method.title.toLowerCase().includes("visit");

    if (isWhatsapp) {
      const cleanDigits = val.replace(/\D/g, "");
      const autoHref = cleanDigits ? `https://wa.me/${cleanDigits}` : "";
      patch(method.id, { value: val, href: autoHref });
    } else if (isVisitUs) {
      const autoHref = val.trim() ? `https://maps.google.com/?q=${encodeURIComponent(val.trim())}` : method.href;
      patch(method.id, { value: val, href: autoHref });
    } else {
      patch(method.id, { value: val });
    }
  }

  function patch(id: string, patch: Partial<ContactMethod>) {
    setDraft(draft.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Contact methods saved.</Notice> : null}

      <SectionCard
        title="Contact Methods"
        description="The cards guests tap to reach you"
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => setDraft([...draft, { id: newId("method"), icon: "phone", accent: "orange", title: "New Method", value: "", helper: "", href: "#" }])}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Method
            </Button>
            <Button size="sm" onClick={save}>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Save
            </Button>
          </>
        }
      >
        <ul className="space-y-3">
          {draft.map((method) => {
            const isWhatsapp =
              method.icon === "whatsapp" ||
              method.accent === "whatsapp" ||
              method.title.toLowerCase().includes("whatsapp");

            return (
              <li key={method.id} className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <TextInput value={method.title} onChange={(e) => patch(method.id, { title: e.target.value })} />
                  </Field>
                  <Field label={isWhatsapp ? "WhatsApp Number (e.g. +92 300 123 456)" : "Value (number / handle / address)"}>
                    <TextInput
                      value={method.value}
                      onChange={(e) => handleValueChange(method, e.target.value)}
                    />
                  </Field>
                  <Field label={isWhatsapp ? "Href (Auto-generated from WhatsApp Number)" : "Href (Link Target)"}>
                    <TextInput
                      value={method.href}
                      onChange={(e) => patch(method.id, { href: e.target.value })}
                      placeholder={isWhatsapp ? "https://wa.me/..." : "tel:... or https://..."}
                    />
                  </Field>
                  <Field label="Icon">
                    <Select value={method.icon} onChange={(e) => patch(method.id, { icon: e.target.value as ContactMethod["icon"] })}>
                      {icons.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Accent">
                    <Select value={method.accent} onChange={(e) => patch(method.id, { accent: e.target.value as ContactAccent })}>
                      {accents.map((accent) => (
                        <option key={accent} value={accent}>{accent}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Helper" className="md:col-span-2">
                    <TextInput value={method.helper} onChange={(e) => patch(method.id, { helper: e.target.value })} />
                  </Field>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setPendingDelete(method)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove this contact method?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will no longer appear on the Contact page. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            setDraft(draft.filter((m) => m.id !== pendingDelete.id));
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function HoursManager() {
  const { data, updateSlice } = useAdminData();
  const [draft, setDraft] = useState<OpeningDay[]>(data.contact.openingHours);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<OpeningDay | null>(null);

  async function save() {
    try {
      await contactService.saveOpeningHours(draft);
      updateSlice("contact", { ...data.contact, openingHours: draft });
      setNotice("Opening hours saved and updated!");
      setTimeout(() => setNotice(null), 3000);
    } catch (e: any) {
      alert(`Failed to save opening hours: ${e?.message}`);
    }
  }
  function patch(id: string, patch: Partial<OpeningDay>) {
    setDraft(draft.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">{notice}</Notice> : null}

      <SectionCard
        title="Opening Hours"
        description="Weekly timetable shown next to the map"
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => setDraft([...draft, { id: newId("hours"), day: "New Day", hours: "12PM — 11PM" }])}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Day
            </Button>
            <Button size="sm" onClick={save}>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Save
            </Button>
          </>
        }
      >
        <ul className="space-y-2">
          {draft.map((entry) => (
            <li key={entry.id} className="flex items-center gap-2">
              <TextInput value={entry.day} onChange={(e) => patch(entry.id, { day: e.target.value })} className="flex-1" />
              <TextInput value={entry.hours} onChange={(e) => patch(entry.id, { hours: e.target.value })} className="w-full sm:w-64" />
              <Button size="sm" variant="ghost" onClick={() => setPendingDelete(entry)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove this opening day?"
        description={
          pendingDelete
            ? `"${pendingDelete.day}" will no longer show on the Contact page. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            setDraft(draft.filter((h) => h.id !== pendingDelete.id));
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function MapManager() {
  const { data, updateSlice } = useAdminData();
  const [draft, setDraft] = useState<MapDetails>(data.contact.map);
  const [notice, setNotice] = useState<string | null>(null);

  function handleAddressChange(newAddress: string) {
    const autoMapsUrl = newAddress.trim()
      ? `https://maps.google.com/?q=${encodeURIComponent(newAddress.trim())}`
      : draft.mapsUrl;
    setDraft({ ...draft, address: newAddress, mapsUrl: autoMapsUrl });
  }

  async function save() {
    try {
      await contactService.updatePageConfig({ map: draft });
      updateSlice("contact", { ...data.contact, map: draft });
      setNotice("Map & address details saved and updated!");
      setTimeout(() => setNotice(null), 3000);
    } catch (e: any) {
      alert(`Failed to save map details: ${e?.message}`);
    }
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">{notice}</Notice> : null}

      <SectionCard
        title="Location & Map"
        description="The address guests navigate to and the directions pin"
        actions={
          <>
            <Button size="sm" variant="ghost" onClick={() => setDraft(data.contact.map)}>
              Discard
            </Button>
            <Button size="sm" onClick={save}>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Save Map
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Restaurant Name / Location Heading">
            <TextInput value={draft.restaurantName} onChange={(e) => setDraft({ ...draft, restaurantName: e.target.value })} />
          </Field>
          <Field label="Address (Auto-generates Maps URL)">
            <TextInput value={draft.address} onChange={(e) => handleAddressChange(e.target.value)} />
          </Field>
          <Field label="Maps URL (Google Maps Link)" className="md:col-span-2">
            <TextInput value={draft.mapsUrl} onChange={(e) => setDraft({ ...draft, mapsUrl: e.target.value })} />
          </Field>
          <Field label="Description / Subtitle" className="md:col-span-2">
            <TextArea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-[var(--text-faint)]">
          <MapPin className="h-4 w-4 text-[var(--accent-orange)]" />
          The 'Get Directions' button on the Contact page opens this exact Maps URL.
        </p>
      </SectionCard>
    </div>
  );
}

function CtasManager() {
  const { data, updateSlice } = useAdminData();
  const [form, setForm] = useState(data.contact.form);
  const [catering, setCatering] = useState<CateringData>(data.contact.catering);
  const [franchise, setFranchise] = useState<FranchiseData>(data.contact.franchise);
  const [notice, setNotice] = useState<string | null>(null);

  async function save() {
    try {
      await contactService.updatePageConfig({ form, catering, franchise });
      updateSlice("contact", { ...data.contact, form, catering, franchise });
      setNotice("Contact CTAs saved and updated!");
      setTimeout(() => setNotice(null), 3000);
    } catch (e: any) {
      alert(`Failed to save CTAs: ${e?.message}`);
    }
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">{notice}</Notice> : null}

      <SectionCard title="Contact Form" description="Copy around the message form">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Heading">
            <TextInput value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
          </Field>
          <Field label="Accent">
            <TextInput value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} />
          </Field>
          <Field label="Response Time Note" className="md:col-span-2">
            <TextInput value={form.responseTime} onChange={(e) => setForm({ ...form, responseTime: e.target.value })} />
          </Field>
          <Field label="Description" className="md:col-span-2">
            <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Catering CTA" description="Private & corporate events banner">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Eyebrow">
            <TextInput value={catering.eyebrow} onChange={(e) => setCatering({ ...catering, eyebrow: e.target.value })} />
          </Field>
          <Field label="Menu Label">
            <TextInput value={catering.menuLabel} onChange={(e) => setCatering({ ...catering, menuLabel: e.target.value })} />
          </Field>
          <Field label="Title Lead">
            <TextInput value={catering.titleLead} onChange={(e) => setCatering({ ...catering, titleLead: e.target.value })} />
          </Field>
          <Field label="Title Accent">
            <TextInput value={catering.titleAccent} onChange={(e) => setCatering({ ...catering, titleAccent: e.target.value })} />
          </Field>
          <Field label="Quote Label">
            <TextInput value={catering.quoteLabel} onChange={(e) => setCatering({ ...catering, quoteLabel: e.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <ImageUpload
              label="Catering Banner Image"
              value={catering.imageUrl}
              folder="contact/catering"
              onChange={(url, publicId) =>
                setCatering({
                  ...catering,
                  imageUrl: url,
                  image_public_id: publicId,
                })
              }
            />
          </div>
          <Field label="Description" className="md:col-span-2">
            <TextArea value={catering.description} onChange={(e) => setCatering({ ...catering, description: e.target.value })} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Franchise CTA" description="Open a franchise banner">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Eyebrow">
            <TextInput value={franchise.eyebrow} onChange={(e) => setFranchise({ ...franchise, eyebrow: e.target.value })} />
          </Field>
          <Field label="Title">
            <TextInput value={franchise.title} onChange={(e) => setFranchise({ ...franchise, title: e.target.value })} />
          </Field>
          <Field label="Title Accent">
            <TextInput value={franchise.titleAccent} onChange={(e) => setFranchise({ ...franchise, titleAccent: e.target.value })} />
          </Field>
          <Field label="Placeholder">
            <TextInput value={franchise.placeholder} onChange={(e) => setFranchise({ ...franchise, placeholder: e.target.value })} />
          </Field>
          <Field label="Notify Label">
            <TextInput value={franchise.notifyLabel} onChange={(e) => setFranchise({ ...franchise, notifyLabel: e.target.value })} />
          </Field>
          <Field label="Portal Label">
            <TextInput value={franchise.portalLabel} onChange={(e) => setFranchise({ ...franchise, portalLabel: e.target.value })} />
          </Field>
          <Field label="Description" className="md:col-span-2">
            <TextArea value={franchise.description} onChange={(e) => setFranchise({ ...franchise, description: e.target.value })} />
          </Field>
        </div>
      </SectionCard>

      <Button onClick={save}>
        <Check className="mr-1.5 h-4 w-4" /> Save All CTAs
      </Button>
    </div>
  );
}
