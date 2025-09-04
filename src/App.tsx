import { useState, useEffect, Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BubbleMenu } from './components/BubbleMenu';

const LazyCardSearch = lazy(() =>
  import("./components/CardSearch").then((m) => ({ default: m.CardSearch }))
);
const LazyDeckSearch = lazy(() =>
  import("./components/DeckSearch").then((m) => ({ default: m.DeckSearch }))
);
const LazyKonivrverSimulator = lazy(() =>
  import("./components/KonivrverSimulator").then((m) => ({ default: m.KonivrverSimulator }))
);
const LazyJudgePortal = lazy(() =>
  import("./components/JudgePortal").then((m) => ({ default: m.JudgePortal }))
);
const LazyNotificationCenter = lazy(() => import("./components/NotificationCenter"));
// Deckbuilder is accessed from Decks page; keep import only where used directly

const LazyAnalytics = lazy(() =>
  import("./pages/Analytics").then((m) => ({ default: m.Analytics }))
);
const LazyEvents = lazy(() =>
  import("./pages/Events").then((m) => ({ default: m.Events }))
);
const LazyTournamentHub = lazy(() =>
  import("./pages/TournamentHub").then((m) => ({ default: m.TournamentHub }))
);
import { Home } from "./pages/Home";
const LazyMyDecks = lazy(() =>
  import("./pages/MyDecks").then((m) => ({ default: m.MyDecks }))
);
const LazyRules = lazy(() =>
  import("./pages/Rules").then((m) => ({ default: m.Rules }))
);
const LazySettings = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.Settings }))
);
import { Offline } from "./pages/Offline";
const LazyLore = lazy(() =>
  import("./pages/Lore").then((m) => ({ default: m.Lore }))
);
import { useAppStore } from "./stores/appStore";
import { useAuth } from "./hooks/useAuth";
import { NotificationService } from "./services/notifications";
import { EventService } from "./services/eventService";
import type { Card } from "./data/cards"; // Use our local Card type
import * as appStyles from "./app.css.ts";
import * as overlay from "./appOverlay.css.ts";
import { MobileShell } from "./mobile/MobileShell";
// import { BubbleMenu } from './components/BubbleMenu';
import { LoginModal } from "./components/LoginModal";
import { SearchBar } from "./mobile/SearchBar";

const Devtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    )
  : null;

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
  | "lore";

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
    } else if (currentPage === "lore") {
      const ev = new CustomEvent("lore-search", { detail: q });
      window.dispatchEvent(ev);
    }
  };

  if (!isOnline) {
    return <Offline />;
  }

  return (
    <div className={appStyles.app}>
      <div className={overlay.topRight}>
        <Suspense fallback={null}>
          <LazyNotificationCenter />
        </Suspense>
      </div>

      {!(currentPage === "settings" || currentPage === "simulator") && (
        <SearchBar current={currentPage} onSearch={handleGlobalSearch} />
      )}

      <MobileShell
        current={currentPage}
        onNavigate={(p) => handlePageChange(p as Page)}
      >
        {currentPage === "home" && <Home />}
        {currentPage === "simulator" && (
          <Suspense fallback={null}>
            <LazyKonivrverSimulator />
          </Suspense>
        )}
        {currentPage === "cards" && (
          <Suspense fallback={null}>
            <LazyCardSearch onCardSelect={handleCardSelect} />
          </Suspense>
        )}
        {currentPage === "decks" && (
          <Suspense fallback={null}>
            <LazyDeckSearch onDeckSelect={() => {}} />
          </Suspense>
        )}
        {currentPage === "my-decks" && (
          <Suspense fallback={null}>
            <LazyMyDecks />
          </Suspense>
        )}
        {currentPage === "rules" && (
          <Suspense fallback={null}>
            <LazyRules />
          </Suspense>
        )}
        {currentPage === "lore" && (
          <Suspense fallback={null}>
            <LazyLore />
          </Suspense>
        )}
        {currentPage === "judge" &&
          (canAccessJudgePortal() ? (
            <Suspense fallback={null}>
              <LazyJudgePortal />
            </Suspense>
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
        {currentPage === "events" && (
          <Suspense fallback={null}>
            <LazyEvents />
          </Suspense>
        )}
        {currentPage === "event-archive" && (
          <Suspense fallback={null}>
            <LazyTournamentHub />
          </Suspense>
        )}
        {/* Deckbuilder merged into Decks page via button */}
        {currentPage === "analytics" && (
          <Suspense fallback={null}>
            <LazyAnalytics />
          </Suspense>
        )}
        {currentPage === "settings" && (
          <Suspense fallback={null}>
            <LazySettings />
          </Suspense>
        )}
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
      {Devtools && (
        <Suspense fallback={null}>
          <Devtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
