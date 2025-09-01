import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CardSearch } from "./components/CardSearch";
import { DeckSearch } from "./components/DeckSearch";
import { KonivrverSimulator } from "./components/KonivrverSimulator";
// import { BubbleMenu } from './components/BubbleMenu';

import JudgePortal from "./components/JudgePortal";
import NotificationCenter from "./components/NotificationCenter";
// Deckbuilder is accessed from Decks page; keep import only where used directly

import { Analytics } from "./pages/Analytics";
import { Events } from "./pages/Events";
import { TournamentHub } from "./pages/TournamentHub";
import { Home } from "./pages/Home";
import { MyDecks } from "./pages/MyDecks";
import { Rules } from "./pages/Rules";
import { Settings } from "./pages/Settings";
import { Offline } from "./pages/Offline";
import { Lore } from "./pages/Lore";
import { Profile } from "./pages/Profile";
import { useAppStore } from "./stores/appStore";
import { useAuth } from "./hooks/useAuth";
import { NotificationService } from "./services/notifications";
import { EventService } from "./services/eventService";
import type { Card } from "./data/cards"; // Use our local Card type
import * as appStyles from "./app.css.ts";
import * as overlay from "./appOverlay.css.ts";
import { MobileShell } from "./mobile/MobileShell";
import { LoginModal } from "./components/LoginModal";
import { SearchBar } from "./mobile/SearchBar";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

type Page =
  | "home"
  | "simulator"
  | "cards"
  | "decks"
  | "analytics"
  | "events"
  | "event-archive"
  | "my-decks"
  | "rules"
  | "judge"
  | "settings"
  | "lore"
  | "profile";

function AppContent(): any {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const { selectedCard, setSelectedCard, setSearchFilters } = useAppStore();
  const { canAccessJudgePortal, isAuthenticated } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [loginOpen, setLoginOpen] = useState(false);

  // Initialize notifications on app start
  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    notificationService.initialize();

    const handleOnline = async () => {
      setIsOnline(true);
      try {
        await EventService.syncQueuedReports();
      } catch (error) {
        console.warn("Failed to sync queued reports:", error);
      }
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const openLogin = () => setLoginOpen(true);
    window.addEventListener("open-login", openLogin as any);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("open-login", openLogin as any);
    };
  }, []);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  const handlePageChange = (page: Page) => {
    if (page === "judge" && !canAccessJudgePortal()) {
      return;
    }
    setCurrentPage(page);
  };

  const handleGlobalSearch = (q: string) => {
    if (currentPage === "cards") setSearchFilters({ search: q, page: 1 });
    else if (currentPage === "decks") setSearchFilters({ search: q, page: 1 });
    else if (currentPage === "events" || currentPage === "event-archive") {
      const ev = new CustomEvent("pairings-search", { detail: q });
      window.dispatchEvent(ev);
    } else if (currentPage === "home") {
      const ev = new CustomEvent("home-search", { detail: q });
      window.dispatchEvent(ev);
    }
  };

  if (!isOnline) {
    return <Offline />;
  }

  return (
    <div className={appStyles.app}>
      <div className={overlay.topRight}>
        <NotificationCenter />
      </div>

      {!(currentPage === "settings" || currentPage === "simulator") && (
        <SearchBar current={currentPage} onSearch={handleGlobalSearch} />
      )}

      <MobileShell
        current={currentPage}
        onNavigate={(p) => handlePageChange(p as Page)}
      >
        {currentPage === "home" && <Home />}
        {currentPage === "simulator" && <KonivrverSimulator />}
        {currentPage === "cards" && (
          <CardSearch onCardSelect={handleCardSelect} />
        )}
        {currentPage === "decks" && <DeckSearch onDeckSelect={() => {}} />}
        {currentPage === "my-decks" && <MyDecks />}
        {currentPage === "rules" && <Rules />}
        {currentPage === "lore" && <Lore />}
        {currentPage === "judge" &&
          (canAccessJudgePortal() ? (
            <JudgePortal />
          ) : (
            <div className={overlay.restrictNotice}>
              <h2 className={overlay.restrictTitle}>Access Restricted</h2>
              <p>
                The Judge Portal is only accessible to certified KONIVRER judges
                and administrators.
              </p>
              {!isAuthenticated ? (
                <p className={overlay.restrictMuted}>
                  Please log in with your judge credentials to access this
                  portal.
                </p>
              ) : (
                <p className={overlay.restrictMuted}>
                  Your account does not have judge certification. Contact an
                  administrator if you believe you should have access.
                </p>
              )}
            </div>
          ))}
        {currentPage === "events" && <Events />}
        {currentPage === "event-archive" && <TournamentHub />}
        {/* Deckbuilder merged into Decks page via button */}
        {currentPage === "analytics" && <Analytics />}
        {currentPage === "settings" && <Settings />}
        {currentPage === "profile" && <Profile />}
      </MobileShell>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      {selectedCard && (
        <div
          className={overlay.modalMask}
          onClick={() => setSelectedCard(null)}
        >
          <div className={overlay.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={overlay.modalClose}
              onClick={() => setSelectedCard(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <h2>{selectedCard.name}</h2>
            <img
              src={selectedCard.webpUrl}
              alt={selectedCard.name}
              className={overlay.modalImg}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  selectedCard.imageUrl || "/placeholder-card.png";
              }}
            />
            <div className={overlay.modalBody}>
              <p>
                <strong>Type:</strong> {selectedCard.type}
              </p>
              <p>
                <strong>Element:</strong> {selectedCard.element}
              </p>
              <p>
                <strong>Rarity:</strong> {selectedCard.rarity}
              </p>
              <p>
                <strong>Cost:</strong> {selectedCard.cost}
              </p>
              {selectedCard.power !== undefined && (
                <p>
                  <strong>Power/Toughness:</strong> {selectedCard.power}/
                  {selectedCard.toughness}
                </p>
              )}
              <p>{selectedCard.description}</p>
            </div>
            <button
              className={overlay.modalPrimary}
              onClick={() => setSelectedCard(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App(): any {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
