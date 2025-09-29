import { Suspense, lazy } from "react";
import type { Card } from "../types";

// Lazy load page components
const LazyCardSearch = lazy(() =>
  import("./CardSearch").then((m) => ({ default: m.CardSearch })),
);
const LazyDeckSearch = lazy(() =>
  import("./DeckSearch").then((m) => ({ default: m.DeckSearch })),
);
const LazyKonivrverSimulator = lazy(() =>
  import("./KonivrverSimulator").then((m) => ({
    default: m.KonivrverSimulator,
  })),
);
const LazyJudgePortal = lazy(() =>
  import("./JudgePortal").then((m) => ({ default: m.JudgePortal })),
);
const LazyAnalytics = lazy(() =>
  import("../pages/Analytics").then((m) => ({ default: m.Analytics })),
);
const LazyEvents = lazy(() =>
  import("../pages/Events").then((m) => ({ default: m.Events })),
);
const LazyTournamentHub = lazy(() =>
  import("../pages/TournamentHub").then((m) => ({ default: m.TournamentHub })),
);
const LazyMyDecks = lazy(() =>
  import("../pages/MyDecks").then((m) => ({ default: m.MyDecks })),
);
const LazyRules = lazy(() =>
  import("../pages/Rules").then((m) => ({ default: m.Rules })),
);
const LazySettings = lazy(() =>
  import("../pages/Settings").then((m) => ({ default: m.Settings })),
);
const LazyLore = lazy(() =>
  import("../pages/Lore").then((m) => ({ default: m.Lore })),
);

import { Home } from "../pages/Home";
import { Offline } from "../pages/Offline";
import { useAuth } from "../hooks/useAuth";
import * as overlay from "../appOverlay.css.ts";

export type Page =
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

interface PageRouterProps {
  currentPage: Page;
  onCardSelect: (card: Card) => void;
  isOnline: boolean;
}

export function PageRouter({
  currentPage,
  onCardSelect,
  isOnline,
}: PageRouterProps) {
  const { canAccessJudgePortal, isAuthenticated } = useAuth();

  if (!isOnline) {
    return <Offline />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;

      case "simulator":
        return (
          <Suspense fallback={<div>Loading Simulator...</div>}>
            <LazyKonivrverSimulator />
          </Suspense>
        );

      case "cards":
        return (
          <Suspense fallback={<div>Loading Cards...</div>}>
            <LazyCardSearch onCardSelect={onCardSelect} />
          </Suspense>
        );

      case "decks":
        return (
          <Suspense fallback={<div>Loading Decks...</div>}>
            <LazyDeckSearch onDeckSelect={() => {}} />
          </Suspense>
        );

      case "my-decks":
        return (
          <Suspense fallback={<div>Loading My Decks...</div>}>
            <LazyMyDecks />
          </Suspense>
        );

      case "rules":
        return (
          <Suspense fallback={<div>Loading Rules...</div>}>
            <LazyRules />
          </Suspense>
        );

      case "lore":
        return (
          <Suspense fallback={<div>Loading Lore...</div>}>
            <LazyLore />
          </Suspense>
        );

      case "judge":
        if (!canAccessJudgePortal()) {
          return (
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
          );
        }
        return (
          <Suspense fallback={<div>Loading Judge Portal...</div>}>
            <LazyJudgePortal />
          </Suspense>
        );

      case "events":
        return (
          <Suspense fallback={<div>Loading Events...</div>}>
            <LazyEvents />
          </Suspense>
        );

      case "event-archive":
        return (
          <Suspense fallback={<div>Loading Tournament Hub...</div>}>
            <LazyTournamentHub />
          </Suspense>
        );

      case "analytics":
        return (
          <Suspense fallback={<div>Loading Analytics...</div>}>
            <LazyAnalytics />
          </Suspense>
        );

      case "settings":
        return (
          <Suspense fallback={<div>Loading Settings...</div>}>
            <LazySettings />
          </Suspense>
        );

      default:
        return <Home />;
    }
  };

  return <>{renderPage()}</>;
}
