import { useCallback } from "react";
import { useAppStore, type CardSearchFilters } from "../stores/appStore";
import type { Page } from "../components/PageRouter";

export function useSearchHandler(currentPage: Page) {
  const { setSearchFilters } = useAppStore();

  const handleGlobalSearch = useCallback(
    (query: string) => {
      if (currentPage === "cards") {
        setSearchFilters({ search: query, page: 1 });
      } else if (currentPage === "decks") {
        setSearchFilters({ search: query, page: 1 });
      } else if (currentPage === "events" || currentPage === "event-archive") {
        const ev = new CustomEvent("pairings-search", { detail: query });
        window.dispatchEvent(ev);
      } else if (currentPage === "home") {
        const ev = new CustomEvent("home-search", { detail: query });
        window.dispatchEvent(ev);
      } else if (currentPage === "lore") {
        const ev = new CustomEvent("lore-search", { detail: query });
        window.dispatchEvent(ev);
      }
    },
    [currentPage, setSearchFilters],
  );

  const handleAdvancedSearch = useCallback(
    (filters: {
      timeFrame: { start: string; end: string };
      geolocation: {
        lat: number | null;
        lng: number | null;
        maxDistance: number;
      };
      selectedStore: string;
      searchFilters: {
        format: string;
        status: string;
        venueType: string;
        priceRange: { min: number; max: number };
        dateRange: { start: string; end: string };
        sortBy: string;
        sortOrder: "asc" | "desc";
      };
    }) => {
      // Apply advanced search filters based on current page
      if (currentPage === "events" || currentPage === "event-archive") {
        const ev = new CustomEvent("advanced-search", { detail: filters });
        window.dispatchEvent(ev);
      } else if (currentPage === "cards") {
        // Apply card-specific filters
        setSearchFilters({
          ...filters.searchFilters,
          sortOrder: filters.searchFilters.sortOrder?.toUpperCase() as
            | "ASC"
            | "DESC",
        } as CardSearchFilters);
      } else if (currentPage === "decks" || currentPage === "my-decks") {
        // Apply deck-specific filters
        setSearchFilters({
          ...filters.searchFilters,
          sortOrder: filters.searchFilters.sortOrder?.toUpperCase() as
            | "ASC"
            | "DESC",
        } as CardSearchFilters);
      } else if (currentPage === "lore" || currentPage === "rules") {
        // Apply content-specific filters
        setSearchFilters({
          ...filters.searchFilters,
          sortOrder: filters.searchFilters.sortOrder?.toUpperCase() as
            | "ASC"
            | "DESC",
        } as CardSearchFilters);
      } else if (currentPage === "analytics") {
        // Apply analytics-specific filters
        setSearchFilters({
          ...filters.searchFilters,
          sortOrder: filters.searchFilters.sortOrder?.toUpperCase() as
            | "ASC"
            | "DESC",
        } as CardSearchFilters);
      } else {
        // Apply general filters for other pages
        setSearchFilters({
          ...filters.searchFilters,
          sortOrder: filters.searchFilters.sortOrder?.toUpperCase() as
            | "ASC"
            | "DESC",
        } as CardSearchFilters);
      }
    },
    [currentPage, setSearchFilters],
  );

  const handleBuildDeck = useCallback(() => {
    // This will be handled by the DeckSearch component
    window.dispatchEvent(new CustomEvent("build-deck"));
  }, []);

  return {
    handleGlobalSearch,
    handleAdvancedSearch,
    handleBuildDeck,
  };
}
