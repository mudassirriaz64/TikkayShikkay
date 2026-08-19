"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Database } from "@/lib/data/defaults";
import {
  settingsService,
  menuService,
  reviewsService,
  galleryService,
  contactService,
  aboutService,
  ClientApiError,
  isApiError,
} from "@/lib/api";

const STORAGE_KEY = "tikkay-shikkay-admin-db-v1";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface AdminDataContextValue {
  data: Database;
  updateSlice: <K extends keyof Database>(key: K, value: Database[K]) => void;
  resetAll: () => void;
  isHydrated: boolean;

  saveStatus: SaveStatus;
  lastSaveError: string | null;
  persistNow: () => Promise<void>;
  clearSaveStatus: () => void;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void | Promise<void>,
  ms: number,
) {
  let id: ReturnType<typeof setTimeout> | null = null;
  return (...args: Args) => {
    if (id) clearTimeout(id);
    id = setTimeout(() => {
      void fn(...args);
      id = null;
    }, ms);
  };
}

async function persistSingletonsToBackend(
  data: Database,
): Promise<{ ok: boolean; errors: string[] }> {
  const errors: string[] = [];
  const settled = await Promise.allSettled([
    (async () => {
      try {
        await settingsService.update(data.settings);
      } catch (e) {
        throw new Error(
          `settings: ${isApiError(e) ? e.message : (e as Error).message}`,
        );
      }
    })(),
    (async () => {
      try {
        await menuService.updatePageConfig(
          (data.menu as unknown as { platter: unknown; tabs: unknown; boti_featured_item_id: unknown; boti_compact_ids: unknown }) || {},
        );
      } catch (e) {
        throw new Error(
          `menu.pageConfig: ${isApiError(e) ? e.message : (e as Error).message}`,
        );
      }
    })(),
    (async () => {
      try {
        await reviewsService.updatePageConfig(
          ((data.reviews as unknown as { hero: unknown; cta: unknown; categories: unknown }) || {}) as {},
        );
      } catch (e) {
        throw new Error(
          `reviews.pageConfig: ${isApiError(e) ? e.message : (e as Error).message}`,
        );
      }
    })(),
    (async () => {
      try {
        await galleryService.updatePageConfig(
          ((data.gallery.pageData as unknown as { hero: unknown; tabs: unknown; galleryCategories: unknown; cta: unknown }) || {}) as {},
        );
      } catch (e) {
        throw new Error(
          `gallery.pageConfig: ${isApiError(e) ? e.message : (e as Error).message}`,
        );
      }
    })(),
    (async () => {
      try {
        await contactService.updatePageConfig(
          ((data.contact as unknown as { hero: unknown; map: unknown; form: unknown; catering: unknown; franchise: unknown }) || {}) as {},
        );
      } catch (e) {
        throw new Error(
          `contact.pageConfig: ${isApiError(e) ? e.message : (e as Error).message}`,
        );
      }
    })(),
    (async () => {
      try {
        await aboutService.updateFounder(data.about.founder || {});
        await aboutService.updatePageConfig(
          ((data.about as unknown as { hero: unknown }) || { hero: undefined }) as {},
        );
      } catch (e) {
        throw new Error(
          `about: ${isApiError(e) ? e.message : (e as Error).message}`,
        );
      }
    })(),
  ]);

  for (const result of settled) {
    if (result.status === "rejected") {
      const msg =
        (result.reason as Error)?.message || String(result.reason);
      if (msg && !msg.includes("401") && !msg.includes("403")) {
        errors.push(msg);
      }
    }
  }
  return { ok: errors.length === 0, errors };
}

export function AdminDataProvider({
  initialData,
  children,
}: {
  initialData: Database;
  children: ReactNode;
}) {
  const [data, setData] = useState<Database>(initialData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaveError, setLastSaveError] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    // If initialData has live orders from database, sync to state
    if (initialData?.orders?.orders && initialData.orders.orders.length > 0) {
      setData((prev) => ({
        ...prev,
        orders: initialData.orders,
      }));
    }
  }, [initialData]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        /* storage may be unavailable */
      }
    }
  }, [data, isHydrated]);

  const runPersist = useCallback(async () => {
    setSaveStatus("saving");
    setLastSaveError(null);
    try {
      const result = await persistSingletonsToBackend(data);
      if (result.ok) {
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
        setLastSaveError(result.errors.join("; "));
      }
    } catch (err) {
      setSaveStatus("error");
      const msg = err instanceof ClientApiError
        ? err.message
        : (err as Error).message || "Unknown save error";
      setLastSaveError(msg);
    } finally {
      setTimeout(() => {
        setSaveStatus((prev) => (prev === "saved" ? "idle" : prev));
      }, 2000);
    }
  }, [data]);

  const debouncedPersist = useMemo(
    () => debounce(() => runPersist(), 800),
    [runPersist],
  );

  const updateSlice = useCallback(
    <K extends keyof Database>(key: K, value: Database[K]) => {
      setData((prev) => {
        const next = { ...prev, [key]: value };
        debouncedPersist();
        return next;
      });
    },
    [debouncedPersist],
  );

  const resetAll = useCallback(() => {
    setData(initialData);
  }, [initialData]);

  const persistNow = useCallback(async () => {
    await runPersist();
  }, [runPersist]);

  const clearSaveStatus = useCallback(() => {
    setSaveStatus("idle");
    setLastSaveError(null);
  }, []);

  const value = useMemo(
    () => ({
      data,
      updateSlice,
      resetAll,
      isHydrated,
      saveStatus,
      lastSaveError,
      persistNow,
      clearSaveStatus,
    }),
    [
      data,
      updateSlice,
      resetAll,
      isHydrated,
      saveStatus,
      lastSaveError,
      persistNow,
      clearSaveStatus,
    ],
  );

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return ctx;
}

export { persistSingletonsToBackend };
