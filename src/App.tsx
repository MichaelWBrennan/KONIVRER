import { useState, useEffect, Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppShell } from "./components/AppShell";
import { useAppStore } from "./stores/appStore";
import { useAuth } from "./hooks/useAuth";
import { useSearchHandler } from "./hooks/useSearchHandler";
import { NotificationService } from "./services/notifications";
import { EventService } from "./services/eventService";
import type { Card } from "./types";
import type { Page } from "./components/PageRouter";

const Devtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtools,
      })),
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

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const { selectedCard, setSelectedCard } = useAppStore();
  const { canAccessJudgePortal } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [loginOpen, setLoginOpen] = useState(false);

  const { handleGlobalSearch, handleAdvancedSearch, handleBuildDeck } =
    useSearchHandler(currentPage);

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
    window.addEventListener("open-login", openLogin as EventListener);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("open-login", openLogin as EventListener);
    };
  }, []);

  const handleCardSelect = (card: Card | null) => {
    setSelectedCard(card);
  };

  const handlePageChange = (page: Page) => {
    if (page === "judge" && !canAccessJudgePortal()) {
      return;
    }
    setCurrentPage(page);
  };

  return (
    <AppShell
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onCardSelect={handleCardSelect}
      onGlobalSearch={handleGlobalSearch}
      onAdvancedSearch={handleAdvancedSearch}
      onBuildDeck={handleBuildDeck}
      selectedCard={selectedCard}
      isOnline={isOnline}
      loginOpen={loginOpen}
      onLoginClose={() => setLoginOpen(false)}
    />
  );
}

function App(): React.JSX.Element {
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
