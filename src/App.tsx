import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CardSearch } from "./components/CardSearch";
import { DeckSearch } from "./components/DeckSearch";
import { KonivrverSimulator } from "./components/KonivrverSimulator";
// import { BubbleMenu } from './components/BubbleMenu';

import JudgePortal from "./components/JudgePortal";
import NotificationCenter from "./components/NotificationCenter";
import { DeckBuilderAdvanced } from "./pages/DeckBuilderAdvanced";

import { Analytics } from "./pages/Analytics";
import { Events } from "./pages/Events";
import { TournamentHub } from "./pages/TournamentHub";
import { Home } from "./pages/Home";
import { MyDecks } from "./pages/MyDecks";
import { Rules } from "./pages/Rules";
import { Settings } from "./pages/Settings";
import { Offline } from "./pages/Offline";
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
const queryClient: any : any : any : any = new QueryClient({
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
  | "deckbuilder"
  | "analytics"
  | "events"
  | "event-archive"
  | "my-decks"
  | "rules"
  | "judge"
  | "settings";

function AppContent(): any {
  const [currentPage, setCurrentPage]: any : any : any : any = useState<Page>("home");
  const { selectedCard, setSelectedCard, setSearchFilters }: any : any : any : any =
    useAppStore();
  const { canAccessJudgePortal, isAuthenticated }: any : any : any : any = useAuth();
  const [isOnline, setIsOnline]: any : any : any : any = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [loginOpen, setLoginOpen]: any : any : any : any = useState(false);

  // Initialize notifications on app start
  useEffect(() => {
    const notificationService: any : any : any : any = NotificationService.getInstance();
    notificationService.initialize();

    const handleOnline: any : any : any : any = async () => {
      setIsOnline(true);
      try {
        await EventService.syncQueuedReports();
      } catch {}
    };
    const handleOffline: any : any : any : any = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const openLogin: any : any : any : any = () => setLoginOpen(true);
    window.addEventListener("open-login", openLogin as any);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("open-login", openLogin as any);
    };
  }, []);

  const handleCardSelect: any : any : any : any = (card: Card) => {
    setSelectedCard(card);
  };

  const handlePageChange: any : any : any : any = (page: Page) => {
    if (page === "judge" && !canAccessJudgePortal()) {
      return;
    }
    setCurrentPage(page);
  };

  const handleGlobalSearch: any : any : any : any = (q: string) => {
    if (currentPage === "cards") setSearchFilters({ search: q, page: 1 });
    else if (currentPage === "decks") setSearchFilters({ search: q, page: 1 });
    else if (currentPage === "events" || currentPage === "event-archive") {
      const ev: any : any : any : any = new CustomEvent("pairings-search", { detail: q });
      window.dispatchEvent(ev);
    } else if (currentPage === "home") {
      const ev: any : any : any : any = new CustomEvent("home-search", { detail: q });
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

      <SearchBar current={currentPage} onSearch={handleGlobalSearch} />

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
        {currentPage === "deckbuilder" && <DeckBuilderAdvanced />}
        {currentPage === "analytics" && <Analytics />}
        {currentPage === "settings" && <Settings />}
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
