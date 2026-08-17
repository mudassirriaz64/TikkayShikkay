"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCart } from "@/context/CartContext";
import { AccountOrder, AccountReview, MenuItem, UserProfile } from "@/types";
import {
  authService,
  usersService,
  ClientApiError,
  isApiError,
  LoginInput,
  RegisterInput,
  AuthUser,
} from "@/lib/api";

type AuthStatus = "idle" | "checking" | "authenticated" | "guest";

interface AccountContextType {
  profile: UserProfile | null;
  backendUser: AuthUser | null;
  favorites: string[];
  reviews: AccountReview[];
  isSignedIn: boolean;
  authStatus: AuthStatus;
  authError: string | null;

  signIn: (profile: UserProfile) => void;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => void;
  removeReview: (reviewId: string) => void;
  updateReview: (reviewId: string, patch: Partial<AccountReview>) => void;
  reorder: (order: AccountOrder, menuItems: MenuItem[]) => void;
  deleteAccount: () => void;

  authenticate: (creds: LoginInput) => Promise<AuthUser>;
  createAccount: (input: RegisterInput) => Promise<AuthUser>;
  refreshSession: () => Promise<void>;
  clearAuthError: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

function backendUserToProfile(user: AuthUser): UserProfile {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    address: user.address ?? "",
    memberSince:
      (user as AuthUser & { createdAt?: string; memberSince?: string }).createdAt ||
      (user as AuthUser & { createdAt?: string; memberSince?: string }).memberSince ||
      new Date().toISOString().slice(0, 10),
  };
}

interface AccountProviderProps {
  children: React.ReactNode;
  initialReviews?: AccountReview[];
}

export function AccountProvider({
  children,
  initialReviews = [],
}: AccountProviderProps) {
  const { addToCart } = useCart();
  const [profile, setProfile] = useLocalStorage<UserProfile | null>(
    "tikkay-account-profile",
    null,
  );
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "tikkay-account-favorites",
    [],
  );
  const [reviews, setReviews] = useLocalStorage<AccountReview[]>(
    "tikkay-account-reviews",
    initialReviews,
  );
  const [backendUser, setBackendUser] = useState<AuthUser | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("idle");
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const hydrateFromBackend = useCallback(async () => {
    setAuthStatus("checking");
    try {
      const me = await authService.me();
      setBackendUser(me);
      const converted = backendUserToProfile(me);
      setProfile(converted);
      try {
        const [remoteFavs, remoteReviews] = await Promise.all([
          usersService.getFavorites().catch(() => [] as string[]),
          usersService.getMyReviews().catch(() => [] as AccountReview[]),
        ]);
        if (Array.isArray(remoteFavs) && remoteFavs.length > 0) {
          setFavorites(remoteFavs);
        }
        if (Array.isArray(remoteReviews) && remoteReviews.length > 0) {
          setReviews(remoteReviews);
        }
      } catch {
        /* ignore partial failures */
      }
      setAuthStatus("authenticated");
    } catch (err) {
      const apiErr = isApiError(err)
        ? err
        : ClientApiError.fromUnknown(err);
      if (apiErr.statusCode === 401 || apiErr.statusCode === 403) {
        setBackendUser(null);
        if (profile) {
          setAuthStatus("guest");
        } else {
          setAuthStatus("guest");
        }
      } else {
        setAuthStatus(profile ? "authenticated" : "guest");
      }
    }
  }, [profile, setProfile, setFavorites, setReviews]);

  useEffect(() => {
    void hydrateFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(
    (user: UserProfile) => {
      setProfile(user);
      setAuthStatus("authenticated");
    },
    [setProfile],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore network errors */
    }
    setBackendUser(null);
    setProfile(null);
    setAuthStatus("guest");
  }, [setProfile]);

  const authenticate = useCallback(
    async (creds: LoginInput): Promise<AuthUser> => {
      setAuthError(null);
      try {
        const res = await authService.login(creds);
        if (res.accessToken && typeof window !== "undefined") {
          localStorage.setItem("tikkay_access_token", res.accessToken);
        }
        setBackendUser(res.user);
        setProfile(backendUserToProfile(res.user));
        setAuthStatus("authenticated");
        try {
          const [remoteFavs, remoteReviews] = await Promise.all([
            usersService.getFavorites().catch(() => [] as string[]),
            usersService.getMyReviews().catch(() => [] as AccountReview[]),
          ]);
          if (Array.isArray(remoteFavs) && remoteFavs.length > 0) {
            setFavorites(remoteFavs);
          }
          if (Array.isArray(remoteReviews) && remoteReviews.length > 0) {
            setReviews(remoteReviews);
          }
        } catch {
          /* ignore */
        }
        return res.user;
      } catch (err) {
        const msg =
          (isApiError(err) ? err.message : undefined) ||
          "Login failed. Please try again.";
        setAuthError(msg);
        throw err;
      }
    },
    [setProfile, setFavorites, setReviews],
  );

  const createAccount = useCallback(
    async (input: RegisterInput): Promise<AuthUser> => {
      setAuthError(null);
      try {
        const res = await authService.register(input);
        if (res.accessToken && typeof window !== "undefined") {
          localStorage.setItem("tikkay_access_token", res.accessToken);
        }
        setBackendUser(res.user);
        setProfile(backendUserToProfile(res.user));
        setAuthStatus("authenticated");
        try {
          const [remoteFavs, remoteReviews] = await Promise.all([
            usersService.getFavorites().catch(() => [] as string[]),
            usersService.getMyReviews().catch(() => [] as AccountReview[]),
          ]);
          if (Array.isArray(remoteFavs) && remoteFavs.length > 0) {
            setFavorites(remoteFavs);
          }
          if (Array.isArray(remoteReviews) && remoteReviews.length > 0) {
            setReviews(remoteReviews);
          }
        } catch {
          /* ignore */
        }
        return res.user;
      } catch (err) {
        const msg =
          (isApiError(err) ? err.message : undefined) ||
          "Registration failed. Please try again.";
        setAuthError(msg);
        throw err;
      }
    },
    [setProfile, setFavorites, setReviews],
  );

  const refreshSession = useCallback(async () => {
    await hydrateFromBackend();
  }, [hydrateFromBackend]);

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      const allowedPatch: Partial<Pick<UserProfile, "name" | "phone" | "address">> = {};
      if (patch.name !== undefined) allowedPatch.name = patch.name;
      if (patch.phone !== undefined) allowedPatch.phone = patch.phone;
      if (patch.address !== undefined) allowedPatch.address = patch.address;

      let backendUpdated = false;
      try {
        if (Object.keys(allowedPatch).length > 0 && backendUser) {
          const updated = await usersService.updateProfile(allowedPatch);
          if (updated) {
            setBackendUser((prev) =>
              prev ? { ...prev, ...allowedPatch } : prev,
            );
            backendUpdated = true;
          }
        }
      } catch {
        /* ignore backend sync errors; still update local */
      }

      setProfile((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        if (
          backendUpdated &&
          backendUser &&
          !(patch as { email?: string }).email
        ) {
          next.email = backendUser.email;
        }
        return next;
      });
    },
    [backendUser, setProfile],
  );

  const isFavorite = useCallback(
    (itemId: string) => favorites.includes(itemId),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (itemId: string) => {
      const nextState = favorites.includes(itemId)
        ? favorites.filter((id) => id !== itemId)
        : [...favorites, itemId];
      setFavorites(nextState);
      if (backendUser) {
        usersService.toggleFavorite(itemId).catch(() => undefined);
      }
    },
    [favorites, backendUser, setFavorites],
  );

  const removeReview = useCallback(
    (reviewId: string) => {
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    },
    [setReviews],
  );

  const updateReview = useCallback(
    (reviewId: string, patch: Partial<AccountReview>) => {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, ...patch } : review,
        ),
      );
    },
    [setReviews],
  );

  const reorder = useCallback(
    (order: AccountOrder, menuItems: MenuItem[]) => {
      for (const line of order.items) {
        const menuItem = menuItems.find((item) => item.id === line.itemId);
        if (menuItem) {
          for (let i = 0; i < line.quantity; i += 1) {
            addToCart(menuItem);
          }
        }
      }
    },
    [addToCart],
  );

  const deleteAccount = useCallback(() => {
    setProfile(null);
    setFavorites([]);
    setReviews([]);
    setBackendUser(null);
    setAuthStatus("guest");
    void signOut().catch(() => undefined);
  }, [setProfile, setFavorites, setReviews, signOut]);

  const value = {
    profile,
    backendUser,
    favorites,
    reviews,
    isSignedIn: profile !== null,
    authStatus,
    authError,
    signIn,
    signOut,
    updateProfile,
    isFavorite,
    toggleFavorite,
    removeReview,
    updateReview,
    reorder,
    deleteAccount,
    authenticate,
    createAccount,
    refreshSession,
    clearAuthError,
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
