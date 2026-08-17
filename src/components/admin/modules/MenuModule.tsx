"use client";

import { ReactNode, useState } from "react";
import { useAdminData } from "@/providers/AdminDataProvider";
import { Field, NumberInput, Select, TextArea, TextInput, Toggle } from "../ui/controls";
import { Badge, EmptyState, Notice, PageHeader, SectionCard } from "../ui/panel";
import { SubTabs } from "../ui/SubTabs";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { SPICE_LEVELS } from "@/config/constants";
import {
  BotiData,
  BotiItem,
  FeaturedItem,
  MenuCategory,
  MenuItem,
  MenuRibbon,
  PlatterData,
  PlatterOption,
  SideItem,
  SpiceLevel,
} from "@/types";
import { Check, Filter, Layers, Pencil, Plus, Search, Trash2, UtensilsCrossed, X } from "lucide-react";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { menuService } from "@/lib/api";

type MenuTabKey = "items" | "categories" | "featured" | "platter" | "boti" | "sides";

const newId = (prefix: string) => `${prefix}-${Date.now()}`;

const spiceTone: Record<SpiceLevel, "neutral" | "gold" | "orange" | "red"> = {
  Mild: "neutral",
  Medium: "gold",
  Hot: "orange",
  "Extra Spicy": "red",
};

function MenuItemForm({
  value,
  categories,
  onChange,
  onAddCategory,
  extra,
}: {
  value: MenuItem;
  categories: MenuCategory[];
  onChange: (next: MenuItem) => void;
  onAddCategory?: (categoryName: string) => void;
  extra?: ReactNode;
}) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const set = <K extends keyof MenuItem>(key: K, val: MenuItem[K]) =>
    onChange({ ...value, [key]: val });

  function handleCreateCategory() {
    const trimmed = newCatName.trim();
    if (!trimmed || !onAddCategory) return;
    onAddCategory(trimmed);
    setNewCatName("");
    setIsAddingCategory(false);
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Field label="Title">
        <TextInput value={value.title} onChange={(e) => set("title", e.target.value)} />
      </Field>

      <Field label="Price (PKR)">
        <NumberInput
          value={value.price === 0 ? "" : value.price}
          placeholder="0"
          onChange={(e) => {
            const val = e.target.value === "" ? 0 : Number(e.target.value);
            set("price", isNaN(val) ? 0 : val);
          }}
        />
      </Field>

      <Field label="Spice Level">
        <Select
          value={value.spice_level}
          onChange={(e) => set("spice_level", e.target.value as SpiceLevel)}
        >
          {SPICE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Category">
        {isAddingCategory ? (
          <div className="flex items-center gap-2">
            <TextInput
              placeholder="New Category Name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateCategory();
                }
              }}
              autoFocus
              className="flex-1"
            />
            <Button size="sm" onClick={handleCreateCategory} disabled={!newCatName.trim()}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setIsAddingCategory(false); setNewCatName(""); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                value={value.category_id}
                onChange={(e) => set("category_id", e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>
            {onAddCategory ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsAddingCategory(true)}
                title="Add new category"
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" /> Category
              </Button>
            ) : null}
          </div>
        )}
      </Field>

      <div className="md:col-span-2">
        <ImageUpload
          label="Item Image"
          value={value.image_url}
          folder={`menu/${categories.find((c) => c.id === value.category_id)?.slug || "tikka"}`}
          onChange={(url, publicId) => {
            onChange({
              ...value,
              image_url: url,
              image_public_id: publicId,
            });
          }}
        />
      </div>

      <div className="md:col-span-2">
        <Field label="Description">
          <TextArea
            value={value.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-8 md:col-span-2">
        <Toggle
          checked={value.is_bestseller}
          onChange={(v) => set("is_bestseller", v)}
          label="Bestseller"
        />
        <Toggle
          checked={value.is_available}
          onChange={(v) => set("is_available", v)}
          label="Available"
        />
      </div>
      {extra}
    </div>
  );
}

function RibbonField({
  value,
  onChange,
}: {
  value: MenuRibbon | undefined;
  onChange: (value: MenuRibbon | undefined) => void;
}) {
  return (
    <Field label="Ribbon">
      <Select
        value={value ?? ""}
        onChange={(e) => onChange((e.target.value || undefined) as MenuRibbon | undefined)}
      >
        <option value="">No ribbon</option>
        <option value="Legendary">Legendary</option>
        <option value="Chef's Choice">Chef&apos;s Choice</option>
      </Select>
    </Field>
  );
}

function EditorHeader({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
      <Button size="sm" onClick={onSave}>
        <Check className="mr-1.5 h-3.5 w-3.5" /> Save
      </Button>
    </>
  );
}

export function MenuModule() {
  const { data } = useAdminData();
  const [tab, setTab] = useState<MenuTabKey>("items");

  const counts = {
    items: data.menu.items.length,
    categories: data.menu.categories.length,
    featured: data.menu.featured.length,
    platter: undefined,
    boti: data.menu.boti.compact.length + 1,
    sides: data.menu.sides.length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Food Workspace"
        title="Menu"
        description="Every dish, platter option, spice level and availability flag on the menu."
      />

      <SubTabs
        activeId={tab}
        onChange={(id) => setTab(id as MenuTabKey)}
        tabs={[
          { id: "items", label: "Menu Items", count: counts.items },
          { id: "categories", label: "Categories", count: counts.categories },
          { id: "featured", label: "Featured", count: counts.featured },
          { id: "platter", label: "Build Platter" },
          { id: "boti", label: "Boti", count: counts.boti },
          { id: "sides", label: "Sides", count: counts.sides },
        ]}
      />

      {tab === "items" && <ItemsManager />}
      {tab === "categories" && <CategoriesManager />}
      {tab === "featured" && <FeaturedManager />}
      {tab === "platter" && <PlatterManager />}
      {tab === "boti" && <BotiManager />}
      {tab === "sides" && <SidesManager />}
    </div>
  );
}

function ItemsManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [notice, setNotice] = useState<"saved" | "deleted" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MenuItem | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSpice, setSelectedSpice] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const items = data.menu.items;
  const categories = data.menu.categories;

  function commit(next: MenuItem[]) {
    updateSlice("menu", { ...data.menu, items: next });
  }
  function flash(type: "saved" | "deleted") {
    setNotice(type);
    setTimeout(() => setNotice(null), 2000);
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function save() {
    if (!editing) return;
    const finalItem: MenuItem = {
      ...editing,
      slug: slugify(editing.title) || `dish-${Date.now()}`,
    };
    const isEdit = items.some((i) => i.id === finalItem.id);

    try {
      if (isEdit) {
        const updated = await menuService.updateItem(finalItem.id, finalItem);
        commit(items.map((i) => (i.id === finalItem.id ? { ...finalItem, ...updated } : i)));
      } else {
        const created = await menuService.createItem(finalItem as any);
        commit([created || finalItem, ...items]);
      }
      setEditing(null);
      flash("saved");
    } catch (e: any) {
      alert(`Save failed: ${e?.message || "Could not save item to backend"}`);
    }
  }

  async function toggle(item: MenuItem, key: "is_bestseller" | "is_available") {
    const updatedVal = !item[key];
    const patch = { [key]: updatedVal };
    try {
      await menuService.updateItem(item.id, patch);
      commit(items.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));
    } catch (e: any) {
      alert(`Failed to update status: ${e?.message}`);
    }
  }

  async function handleDelete(item: MenuItem) {
    try {
      await menuService.deleteItem(item.id);
      commit(items.filter((i) => i.id !== item.id));
      flash("deleted");
    } catch (e: any) {
      alert(`Failed to delete item: ${e?.message}`);
    }
    setPendingDelete(null);
  }

  async function handleAddCategory(categoryName: string) {
    const slug = slugify(categoryName);
    try {
      const created = await menuService.createCategory({
        name: categoryName,
        slug,
        display_order: categories.length + 1,
      });
      const newCategory: MenuCategory = created || {
        id: newId("cat"),
        name: categoryName,
        slug,
        display_order: categories.length + 1,
      };
      const updatedCategories = [...categories, newCategory];
      updateSlice("menu", { ...data.menu, categories: updatedCategories });
      if (editing) {
        setEditing({ ...editing, category_id: newCategory.id });
      }
    } catch (e: any) {
      alert(`Failed to create category: ${e?.message}`);
    }
  }

  // Filtered items computation
  const filteredItems = items.filter((item) => {
    // Search query matches title, description, or slug
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchSlug = item.slug.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSlug) return false;
    }
    // Category filter
    if (selectedCategory !== "all" && item.category_id !== selectedCategory) {
      return false;
    }
    // Spice level filter
    if (selectedSpice !== "all" && item.spice_level !== selectedSpice) {
      return false;
    }
    // Status filter
    if (selectedStatus === "available" && !item.is_available) return false;
    if (selectedStatus === "unavailable" && item.is_available) return false;
    if (selectedStatus === "bestseller" && !item.is_bestseller) return false;

    return true;
  });

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedSpice !== "all" ||
    selectedStatus !== "all";

  return (
    <div className="space-y-5">
      {notice ? (
        <Notice tone={notice === "saved" ? "success" : "danger"}>
          {notice === "saved" ? "Menu item saved." : "Menu item removed."}
        </Notice>
      ) : null}

      {editing ? (
        <SectionCard
          title={items.some((i) => i.id === editing.id) ? `Edit — ${editing.title}` : "Add Menu Item"}
          actions={
            <EditorHeader
              onSave={save}
              onCancel={() => setEditing(null)}
            />
          }
        >
          <MenuItemForm
            value={editing}
            categories={categories}
            onChange={(next) => setEditing(next)}
            onAddCategory={handleAddCategory}
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Menu Items"
        description="Full catalogue served on the menu page"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditing({
                id: newId("menu"),
                category_id: data.menu.categories[0]?.id ?? "cat-1",
                title: "New Dish",
                slug: "new-dish",
                description: "",
                price: 0,
                spice_level: "Medium",
                is_bestseller: false,
                is_available: true,
                image_url: "/images/menu/reshmi-tikka.jpg",
              })
            }
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Item
          </Button>
        }
      >
        {/* Interactive Category Pills Row */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {/* All items pill */}
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_15px_rgba(255,86,42,0.3)] ring-2 ring-[var(--accent-orange)]/40"
                : "border border-[var(--border-warm)] bg-[var(--bg-deep)] text-[var(--text-muted)] hover:border-[var(--accent-peach)]/50 hover:text-[var(--text-primary)]"
            }`}
          >
            <span>All Dishes</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                selectedCategory === "all"
                  ? "bg-[var(--bg-deep)]/25 text-[var(--text-on-orange)]"
                  : "bg-[var(--bg-surface-raised)] text-[var(--text-faint)]"
              }`}
            >
              {items.length}
            </span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((cat) => {
            const count = items.filter((i) => i.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? "all" : cat.id)}
                className={`group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
                  isSelected
                    ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_15px_rgba(255,86,42,0.3)] ring-2 ring-[var(--accent-orange)]/40"
                    : "border border-[var(--border-warm)] bg-[var(--bg-deep)] text-[var(--text-muted)] hover:border-[var(--accent-peach)]/50 hover:text-[var(--text-primary)]"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isSelected
                      ? "bg-[var(--bg-deep)]/25 text-[var(--text-on-orange)]"
                      : "bg-[var(--bg-surface-raised)] text-[var(--text-faint)]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters Bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)] p-3">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              type="text"
              placeholder="Search dishes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-warm)] bg-[var(--bg-surface)] py-1.5 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--accent-peach)]/60"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text-primary)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          {/* Spice Level Filter */}
          <div className="w-36">
            <Select
              value={selectedSpice}
              onChange={(e) => setSelectedSpice(e.target.value)}
              className="py-1.5 text-xs"
            >
              <option value="all">All Spice Levels</option>
              {SPICE_LEVELS.map((spice) => (
                <option key={spice} value={spice}>
                  {spice}
                </option>
              ))}
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1.5 text-xs"
            >
              <option value="all">All Status</option>
              <option value="available">Live (Available)</option>
              <option value="unavailable">Unavailable</option>
              <option value="bestseller">Bestseller</option>
            </Select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedSpice("all");
                setSelectedStatus("all");
              }}
              className="h-8 text-xs text-[var(--accent-coral)]"
            >
              <Filter className="mr-1 h-3 w-3" /> Reset
            </Button>
          ) : null}
        </div>

        {filteredItems.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title={hasActiveFilters ? "No matching menu items" : "No menu items"}
            description={
              hasActiveFilters
                ? "Try clearing some filters to see dishes."
                : "Add your first dish to get the grill started."
            }
          />
        ) : (
          <ul className="divide-y divide-[var(--border-warm)]">
            {filteredItems.map((item) => {
              const category = data.menu.categories.find((c) => c.id === item.category_id);
              return (
                <li key={item.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--text-faint)]">{item.slug}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">{category?.name ?? "Uncategorised"}</Badge>
                      <Badge tone={spiceTone[item.spice_level]}>
                        {item.spice_level}
                      </Badge>
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Toggle
                        checked={item.is_bestseller}
                        onChange={() => toggle(item, "is_bestseller")}
                        label="Best"
                      />
                      <Toggle
                        checked={item.is_available}
                        onChange={() => toggle(item, "is_available")}
                        label="Live"
                      />
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => setEditing({ ...item })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setPendingDelete(item)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this menu item?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the menu catalogue. This cannot be undone.`
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

function CategoriesManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<MenuCategory | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [notice, setNotice] = useState<"saved" | "deleted" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MenuCategory | null>(null);

  const categories = data.menu.categories;
  const items = data.menu.items;

  function commit(next: MenuCategory[]) {
    updateSlice("menu", { ...data.menu, categories: next });
  }

  function flash(type: "saved" | "deleted") {
    setNotice(type);
    setTimeout(() => setNotice(null), 2000);
  }

  async function handleCreate() {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    const slug = trimmed.toLowerCase().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, "");
    try {
      const created = await menuService.createCategory({
        name: trimmed,
        slug,
        display_order: categories.length + 1,
      });
      const newCategory: MenuCategory = created || {
        id: newId("cat"),
        name: trimmed,
        slug,
        display_order: categories.length + 1,
      };
      commit([...categories, newCategory]);
      setNewCatName("");
      setIsAdding(false);
      flash("saved");
    } catch (e: any) {
      alert(`Failed to create category: ${e?.message}`);
    }
  }

  async function handleSaveEditing() {
    if (!editing) return;
    const trimmed = editing.name.trim();
    if (!trimmed) return;
    const slug = trimmed.toLowerCase().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, "");
    const updated = { ...editing, name: trimmed, slug };
    try {
      await menuService.updateCategory(editing.id, { name: trimmed, slug });
      commit(categories.map((c) => (c.id === updated.id ? updated : c)));
      setEditing(null);
      flash("saved");
    } catch (e: any) {
      alert(`Failed to update category: ${e?.message}`);
    }
  }

  async function handleDelete(cat: MenuCategory) {
    try {
      await menuService.deleteCategory(cat.id);
      commit(categories.filter((c) => c.id !== cat.id));
      flash("deleted");
    } catch (e: any) {
      alert(`Failed to delete category: ${e?.message}`);
    }
    setPendingDelete(null);
  }

  return (
    <div className="space-y-5">
      {notice ? (
        <Notice tone={notice === "saved" ? "success" : "danger"}>
          {notice === "saved" ? "Category saved successfully." : "Category removed."}
        </Notice>
      ) : null}

      {isAdding ? (
        <SectionCard
          title="Add New Category"
          actions={
            <>
              <Button size="sm" variant="ghost" onClick={() => { setIsAdding(false); setNewCatName(""); }}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreate} disabled={!newCatName.trim()}>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Save Category
              </Button>
            </>
          }
        >
          <div className="max-w-md">
            <Field label="Category Name">
              <TextInput
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Karahi, Platters, Desserts"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreate();
                  }
                }}
                autoFocus
              />
            </Field>
          </div>
        </SectionCard>
      ) : null}

      {editing ? (
        <SectionCard
          title={`Edit Category — ${editing.name}`}
          actions={
            <>
              <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEditing} disabled={!editing.name.trim()}>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Save Changes
              </Button>
            </>
          }
        >
          <div className="max-w-md">
            <Field label="Category Name">
              <TextInput
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveEditing();
                  }
                }}
                autoFocus
              />
            </Field>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Menu Categories"
        description="All categories displayed across the menu and items filter"
        actions={
          <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Category
          </Button>
        }
      >
        {categories.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No categories found"
            description="Create categories to organize your dishes on the menu."
          />
        ) : (
          <ul className="divide-y divide-[var(--border-warm)]">
            {categories.map((cat) => {
              const count = items.filter((i) => i.category_id === cat.id).length;
              return (
                <li key={cat.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        {cat.name}
                      </p>
                      <p className="text-xs text-[var(--text-faint)]">{cat.slug}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone="neutral">{count} {count === 1 ? "item" : "items"}</Badge>
                      <Button size="sm" variant="outline" onClick={() => setEditing({ ...cat })}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setPendingDelete(cat)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this category?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" will be removed. Items in this category might need reassignment.`
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

function FeaturedManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<FeaturedItem | null>(null);
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<FeaturedItem | null>(null);

  const featured = data.menu.featured;
  const categories = data.menu.categories;

  function commit(next: FeaturedItem[]) {
    updateSlice("menu", { ...data.menu, featured: next });
  }
  function save() {
    if (!editing) return;
    const finalItem: FeaturedItem = {
      ...editing,
      slug: editing.slug || editing.title.toLowerCase().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, ""),
    };
    const exists = featured.some((i) => i.id === finalItem.id);
    commit(exists ? featured.map((i) => (i.id === finalItem.id ? finalItem : i)) : [finalItem, ...featured]);
    setEditing(null);
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }

  function handleAddCategory(categoryName: string) {
    const slug = categoryName.toLowerCase().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, "");
    const newCategory: MenuCategory = {
      id: newId("cat"),
      name: categoryName,
      slug,
      display_order: categories.length + 1,
    };
    const updatedCategories = [...categories, newCategory];
    updateSlice("menu", { ...data.menu, categories: updatedCategories });
    if (editing) {
      setEditing({ ...editing, category_id: newCategory.id });
    }
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Featured item saved.</Notice> : null}

      {editing ? (
        <SectionCard
          title={featured.some((i) => i.id === editing.id) ? `Edit — ${editing.title}` : "Add Featured Item"}
          actions={<EditorHeader onSave={save} onCancel={() => setEditing(null)} />}
        >
          <MenuItemForm
            value={editing}
            categories={categories}
            onChange={(next) => setEditing((d) => (d ? { ...d, ...next } : d))}
            onAddCategory={handleAddCategory}
            extra={
              <div className="grid grid-cols-1 gap-5 md:col-span-2 md:grid-cols-2">
                <RibbonField
                  value={editing.ribbon}
                  onChange={(ribbon) => setEditing((d) => (d ? { ...d, ribbon } : d))}
                />
                <Field label="Tags (comma separated)">
                  <TextInput
                    value={editing.tags?.join(", ") ?? ""}
                    onChange={(e) =>
                      setEditing((d) =>
                        d
                          ? {
                              ...d,
                              tags: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            }
                          : d,
                      )
                    }
                  />
                </Field>
              </div>
            }
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Featured Items"
        description="The hero dishes shown first on the menu page"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditing({
                id: newId("featured"),
                category_id: data.menu.categories[0]?.id ?? "cat-1",
                title: "New Featured",
                slug: `new-featured-${Date.now()}`,
                description: "",
                price: 0,
                spice_level: "Medium",
                is_bestseller: false,
                is_available: true,
                image_url: "/images/menu/reshmi-tikka.jpg",
                tags: [],
              })
            }
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Featured
          </Button>
        }
      >
        <ul className="divide-y divide-[var(--border-warm)]">
          {featured.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">{item.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {item.ribbon ? <Badge tone="gold">{item.ribbon}</Badge> : null}
                  {item.tags?.map((tag) => (
                    <Badge key={tag} tone="peach">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {formatCurrency(item.price)}
                </span>
                <Toggle
                  checked={item.is_available}
                  onChange={(v) =>
                    commit(featured.map((i) => (i.id === item.id ? { ...i, is_available: v } : i)))
                  }
                  label="Live"
                />
                <Button size="sm" variant="outline" onClick={() => setEditing({ ...item, tags: [...(item.tags ?? [])] })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPendingDelete(item)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this featured item?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the menu highlights. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            commit(featured.filter((i) => i.id !== pendingDelete.id));
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function PlatterManager() {
  const { data, updateSlice } = useAdminData();
  const [draft, setDraft] = useState<PlatterData>(data.menu.platter);
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<
    { list: "meats" | "sides"; option: PlatterOption } | null
  >(null);

  function save() {
    updateSlice("menu", { ...data.menu, platter: draft });
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }

  function addOption(list: "meats" | "sides") {
    setDraft({
      ...draft,
      [list]: [...draft[list], { id: newId(list), name: "New Option", price: 0 }],
    });
  }
  function patchOption(list: "meats" | "sides", id: string, patch: Partial<PlatterOption>) {
    setDraft({
      ...draft,
      [list]: draft[list].map((o) => (o.id === id ? { ...o, ...patch } : o)),
    });
  }

  function renderOptions(list: "meats" | "sides") {
    return (
      <ul className="space-y-2">
        {draft[list].map((option) => (
          <li key={option.id} className="flex items-center gap-2">
            <TextInput
              value={option.name}
              onChange={(e) => patchOption(list, option.id, { name: e.target.value })}
              className="flex-1"
            />
            <NumberInput
              value={option.price}
              onChange={(e) => patchOption(list, option.id, { price: Number(e.target.value) || 0 })}
              className="w-32"
            />
            <Button size="sm" variant="ghost" onClick={() => setPendingDelete({ list, option })}>
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Platter configuration saved.</Notice> : null}

      <SectionCard
        title="Build Your Platter"
        description="Base price and the meat / side options customers can add"
        actions={
          <>
            <Button size="sm" variant="ghost" onClick={() => setDraft(data.menu.platter)}>
              Discard
            </Button>
            <Button size="sm" onClick={save}>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Save Platter
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Field label="Base Label">
            <TextInput value={draft.baseLabel} onChange={(e) => setDraft({ ...draft, baseLabel: e.target.value })} />
          </Field>
          <Field label="Base Price (PKR)">
            <NumberInput value={draft.basePrice} onChange={(e) => setDraft({ ...draft, basePrice: Number(e.target.value) || 0 })} />
          </Field>
        </div>
        <div className="mt-5">
          <ImageUpload
            label="Platter Hero Image"
            value={draft.imageUrl}
            folder="menu/platters"
            onChange={(url, publicId) =>
              setDraft({ ...draft, imageUrl: url, image_public_id: publicId })
            }
          />
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard
          title="Meats"
          actions={
            <Button size="sm" variant="outline" onClick={() => addOption("meats")}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Meat
            </Button>
          }
        >
          {renderOptions("meats")}
        </SectionCard>
        <SectionCard
          title="Sides"
          actions={
            <Button size="sm" variant="outline" onClick={() => addOption("sides")}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Side
            </Button>
          }
        >
          {renderOptions("sides")}
        </SectionCard>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove this platter option?"
        description={
          pendingDelete
            ? `"${pendingDelete.option.name}" will no longer be available to platter builders. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            setDraft({
              ...draft,
              [pendingDelete.list]: draft[pendingDelete.list].filter(
                (o) => o.id !== pendingDelete.option.id,
              ),
            });
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function BotiManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<BotiItem | null>(null);
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<BotiItem | null>(null);

  const boti = data.menu.boti;

  function commit(next: BotiData) {
    updateSlice("menu", { ...data.menu, boti: next });
  }
  function saveFeatured() {
    if (!editing) return;
    commit({ ...boti, featured: editing });
    setEditing(null);
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }
  function patchCompact(id: string, patch: Partial<BotiItem>) {
    commit({
      ...boti,
      compact: boti.compact.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    });
  }
  function addCompact() {
    commit({
      ...boti,
      compact: [
        {
          id: newId("boti"),
          category_id: boti.featured.category_id,
          title: "New Boti",
          slug: `new-boti-${Date.now()}`,
          description: "",
          price: 0,
          spice_level: "Medium",
          is_bestseller: false,
          is_available: true,
          image_url: "/images/menu/bharli-boti.jpg",
        },
        ...boti.compact,
      ],
    });
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Featured boti saved.</Notice> : null}

      {editing ? (
        <SectionCard
          title={`Edit — ${editing.title}`}
          actions={<EditorHeader onSave={saveFeatured} onCancel={() => setEditing(null)} />}
        >
          <MenuItemForm
            value={editing}
            categories={data.menu.categories}
            onChange={(next) => setEditing((d) => (d ? { ...d, ...next } : d))}
            extra={
              <div className="md:col-span-2 md:max-w-xs">
                <RibbonField
                  value={editing.ribbon}
                  onChange={(ribbon) => setEditing((d) => (d ? { ...d, ribbon } : d))}
                />
              </div>
            }
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Featured Boti"
        description="The flagship bharli boti shown on the menu page"
        actions={
          <Button size="sm" variant="outline" onClick={() => setEditing({ ...boti.featured })}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit Featured
          </Button>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
              {boti.featured.title}
            </p>
            {boti.featured.ribbon ? (
              <Badge tone="gold" className="mt-1">{boti.featured.ribbon}</Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-[var(--text-primary)]">
              {formatCurrency(boti.featured.price)}
            </span>
            <Badge tone={spiceTone[boti.featured.spice_level]}>
              {boti.featured.spice_level}
            </Badge>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Compact Boti"
        description="Secondary boti variants listed under the featured dish"
        actions={
          <Button size="sm" variant="outline" onClick={addCompact}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Boti
          </Button>
        }
      >
        <ul className="divide-y divide-[var(--border-warm)]">
          {boti.compact.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">{item.title}</p>
                <p className="text-xs text-[var(--text-faint)]">{item.slug}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={spiceTone[item.spice_level]}>{item.spice_level}</Badge>
                <NumberInput
                  value={item.price}
                  onChange={(e) => patchCompact(item.id, { price: Number(e.target.value) || 0 })}
                  className="w-28"
                />
                <Toggle
                  checked={item.is_available}
                  onChange={(v) => patchCompact(item.id, { is_available: v })}
                  label="Live"
                />
                <Button size="sm" variant="outline" onClick={() => setEditing({ ...item })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPendingDelete(item)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this boti?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the boti list. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            commit({ ...boti, compact: boti.compact.filter((b) => b.id !== pendingDelete.id) });
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function SidesManager() {
  const { data, updateSlice } = useAdminData();
  const [editing, setEditing] = useState<SideItem | null>(null);
  const [notice, setNotice] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<SideItem | null>(null);

  const sides = data.menu.sides;

  function commit(next: SideItem[]) {
    updateSlice("menu", { ...data.menu, sides: next });
  }
  function save() {
    if (!editing) return;
    const exists = sides.some((i) => i.id === editing.id);
    commit(exists ? sides.map((i) => (i.id === editing.id ? editing : i)) : [editing, ...sides]);
    setEditing(null);
    setNotice(true);
    setTimeout(() => setNotice(false), 2000);
  }
  function toggleSignature(item: SideItem) {
    commit(sides.map((i) => (i.id === item.id ? { ...i, isSignature: !i.isSignature } : i)));
  }

  return (
    <div className="space-y-5">
      {notice ? <Notice tone="success">Side saved.</Notice> : null}

      {editing ? (
        <SectionCard
          title={sides.some((i) => i.id === editing.id) ? `Edit — ${editing.title}` : "Add Side"}
          actions={<EditorHeader onSave={save} onCancel={() => setEditing(null)} />}
        >
          <MenuItemForm
            value={editing}
            categories={data.menu.categories}
            onChange={(next) => setEditing((d) => (d ? { ...d, ...next } : d))}
            extra={
              <div className="md:col-span-2">
                <Toggle
                  checked={!!editing.isSignature}
                  onChange={(v) => setEditing((d) => (d ? { ...d, isSignature: v } : d))}
                  label="Signature item"
                  description="Highlights this side across the menu"
                />
              </div>
            }
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Sides & Sauces"
        description="Garlic naan, masala fries and the rest"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditing({
                id: newId("side"),
                category_id: "cat-4",
                title: "New Side",
                slug: `new-side-${Date.now()}`,
                description: "",
                price: 0,
                spice_level: "Mild",
                is_bestseller: false,
                is_available: true,
                image_url: "/images/menu/garlic-naan.jpg",
                isSignature: false,
              })
            }
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Side
          </Button>
        }
      >
        <ul className="divide-y divide-[var(--border-warm)]">
          {sides.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {item.title}
                  {item.isSignature ? (
                    <span className="ml-2"><Badge tone="gold">Signature</Badge></span>
                  ) : null}
                </p>
                <p className="text-xs text-[var(--text-faint)]">{item.slug}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={spiceTone[item.spice_level]}>{item.spice_level}</Badge>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {formatCurrency(item.price)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Toggle checked={!!item.isSignature} onChange={() => toggleSignature(item)} label="Sig" />
                <Toggle
                  checked={item.is_available}
                  onChange={(v) => commit(sides.map((i) => (i.id === item.id ? { ...i, is_available: v } : i)))}
                  label="Live"
                />
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => setEditing({ ...item })}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPendingDelete(item)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this side?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed from the sides & sauces list. This cannot be undone.`
            : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            commit(sides.filter((i) => i.id !== pendingDelete.id));
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
