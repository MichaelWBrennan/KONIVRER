import { Suspense, lazy } from "react";
import { MobileShell } from "../mobile/MobileShell";
import { SearchBar } from "../mobile/SearchBar";
import { LoginModal } from "./LoginModal";
import { CardModal } from "./CardModal";
import { PageRouter, type Page } from "./PageRouter";
import type { Card } from "../types";
import * as appStyles from "../app.css.ts";
import * as overlay from "../appOverlay.css.ts";

interface AdvancedSearchFilters {
  timeFrame: { start: string; end: string };
  geolocation: { lat: number | null; lng: number | null; maxDistance: number };
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
}

// Lazy load notification center
const LazyNotificationCenter = lazy(() => import("./NotificationCenter"));

interface AppShellProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onCardSelect: (card: Card | null) => void;
  onGlobalSearch: (query: string) => void;
  onAdvancedSearch: (filters: AdvancedSearchFilters) => void;
  onBuildDeck: () => void;
  selectedCard: Card | null;
  isOnline: boolean;
  loginOpen: boolean;
  onLoginClose: () => void;
}

export function AppShell({
  currentPage,
  onPageChange,
  onCardSelect,
  onGlobalSearch,
  onAdvancedSearch,
  onBuildDeck,
  selectedCard,
  isOnline,
  loginOpen,
  onLoginClose,
}: AppShellProps) {
  return (
    <div className={appStyles.app}>
      {/* Notification Center */}
      <div className={overlay.topRight}>
        <Suspense fallback={null}>
          <LazyNotificationCenter />
        </Suspense>
      </div>

      {/* Search Bar - hidden on settings and simulator pages */}
      {!(currentPage === "settings" || currentPage === "simulator") && (
        <SearchBar
          current={currentPage}
          onSearch={onGlobalSearch}
          onAdvancedSearch={onAdvancedSearch}
          onBuildDeck={onBuildDeck}
        />
      )}

      {/* Main Content */}
      <MobileShell
        current={currentPage}
        onNavigate={(page) => onPageChange(page as Page)}
      >
        <PageRouter
          currentPage={currentPage}
          onCardSelect={onCardSelect}
          isOnline={isOnline}
        />
      </MobileShell>

      {/* Login Modal */}
      <LoginModal isOpen={loginOpen} onClose={onLoginClose} />

      {/* Card Detail Modal */}
      <CardModal card={selectedCard} onClose={() => onCardSelect(null)} />
    </div>
  );
}
