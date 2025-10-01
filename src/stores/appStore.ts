import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { Card } from "../types";

export interface CardSearchFilters {
  search?: string;
  type?: string;
  element?: string;
  rarity?: string;
  minCost?: number;
  maxCost?: number;
  legalOnly?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

interface AppState {
  // Card management
  selectedCard: Card | null;
  searchFilters: CardSearchFilters;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Authentication state
  isLoggedIn: boolean;
  user: { username: string; level: number } | null;

  // Actions
  setSelectedCard: (card: Card | null) => void;
  setSearchFilters: (filters: CardSearchFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setUser: (user: { username: string; level: number } | null) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        selectedCard: null,
        searchFilters: {
          page: 1,
          limit: 20,
          sortBy: "name",
          sortOrder: "ASC",
        },
        isLoading: false,
        error: null,
        isLoggedIn: false,
        user: null,

        // Actions
        setSelectedCard: (card) =>
          set({ selectedCard: card }, false, "setSelectedCard"),

        setSearchFilters: (filters) =>
          set(
            (state) => {
              const previousPage = state.searchFilters.page;
              const nextFilters = { ...state.searchFilters, ...filters };
              const nextPage = nextFilters.page;
              if (
                typeof window !== "undefined" &&
                previousPage !== nextPage &&
                nextPage !== undefined
              ) {
                try {
                  window.dispatchEvent(new Event("search-page-change"));
                } catch {}
              }
              return { searchFilters: nextFilters };
            },
            false,
            "setSearchFilters",
          ),

        setLoading: (loading) =>
          set({ isLoading: loading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        clearError: () => set({ error: null }, false, "clearError"),

        setLoggedIn: (loggedIn) =>
          set({ isLoggedIn: loggedIn }, false, "setLoggedIn"),

        setUser: (user) => set({ user }, false, "setUser"),
      }),
      {
        name: "konivrer-app-store",
        partialize: (state) => ({
          searchFilters: state.searchFilters,
        }),
      },
    ),
    {
      name: "konivrer-store",
    },
  ),
);
