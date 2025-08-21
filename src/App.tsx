import { useState, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CardSearch } from './components/CardSearch';
import { DeckSearch } from './components/DeckSearch';
import { KonivrverSimulator } from './components/KonivrverSimulator';
// import { BubbleMenu } from './components/BubbleMenu';

import JudgePortal from './components/JudgePortal';
import NotificationCenter from './components/NotificationCenter';
import { DeckBuilderAdvanced } from './pages/DeckBuilderAdvanced';

import { Analytics } from './pages/Analytics';
// import { Events } from './pages/Events';
import { TournamentHub } from './pages/TournamentHub';
import { Home } from './pages/Home';
import { MyDecks } from './pages/MyDecks';
import { Rules } from './pages/Rules';
import { PdfViewer } from './pages/PdfViewer';
import { Offline } from './pages/Offline';
import { useAppStore } from './stores/appStore';
import { useAuth } from './hooks/useAuth';
import { NotificationService } from './services/notifications';
import type { Card } from './data/cards';  // Use our local Card type
import * as appStyles from './app.css.ts';
import * as overlay from './appOverlay.css.ts';
import { MobileShell } from './mobile/MobileShell';

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

type Page = 'home' | 'simulator' | 'cards' | 'decks' | 'deckbuilder' | 'analytics' | 'events' | 'my-decks' | 'rules' | 'judge' | 'pdf';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { selectedCard, setSelectedCard } = useAppStore();
  const { canAccessJudgePortal, isAuthenticated } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Initialize notifications on app start
  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    notificationService.initialize();
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  const handlePageChange = (page: Page) => {
    if (page === 'judge' && !canAccessJudgePortal()) {
      return;
    }
    setCurrentPage(page);
  };

  const title = useMemo(() => {
    switch (currentPage) {
      case 'home': return 'Home';
      case 'cards': return 'Card Search';
      case 'decks': return 'Deck Search';
      case 'my-decks': return 'My Decks';
      case 'deckbuilder': return 'Deckbuilder';
      case 'simulator': return 'Play';
      case 'analytics': return 'Analytics';
      case 'events': return 'Tournament Hub';
      case 'rules': return 'Rules';
      case 'judge': return 'Judge Portal';
      case 'pdf': return 'PDF Viewer';
      default: return 'KONIVRER';
    }
  }, [currentPage]);

  if (!isOnline) {
    return <Offline />;
  }

  return (
    <div className={appStyles.app}>
      <div className={overlay.topRight}>
        <NotificationCenter />
      </div>

      <MobileShell current={currentPage} title={title} onNavigate={(p) => handlePageChange(p as Page)}>
        {currentPage === 'home' && (<Home />)}
        {currentPage === 'simulator' && (<KonivrverSimulator />)}
        {currentPage === 'cards' && (<CardSearch onCardSelect={handleCardSelect} />)}
        {currentPage === 'decks' && (<DeckSearch onDeckSelect={() => {}} />)}
        {currentPage === 'my-decks' && (<MyDecks />)}
        {currentPage === 'rules' && (<Rules />)}
        {currentPage === 'judge' && (
          canAccessJudgePortal() ? (<JudgePortal />) : (
            <div className={overlay.restrictNotice}>
              <h2 className={overlay.restrictTitle}>🔒 Access Restricted</h2>
              <p>The Judge Portal is only accessible to certified KONIVRER judges and administrators.</p>
              {!isAuthenticated ? (
                <p className={overlay.restrictMuted}>Please log in with your judge credentials to access this portal.</p>
              ) : (
                <p className={overlay.restrictMuted}>Your account does not have judge certification. Contact an administrator if you believe you should have access.</p>
              )}
            </div>
          )
        )}
        {currentPage === 'events' && (<TournamentHub />)}
        {currentPage === 'deckbuilder' && (<DeckBuilderAdvanced />)}
        {currentPage === 'analytics' && (<Analytics />)}
        {currentPage === 'pdf' && (<PdfViewer />)}
      </MobileShell>

      {selectedCard && (
        <div className={overlay.modalMask} onClick={() => setSelectedCard(null)}>
          <div className={overlay.modal} onClick={(e) => e.stopPropagation()}>
            <button className={overlay.modalClose} onClick={() => setSelectedCard(null)} aria-label="Close">✕</button>
            <h2>{selectedCard.name}</h2>
            <img src={selectedCard.webpUrl} alt={selectedCard.name} className={overlay.modalImg} onError={(e) => { (e.target as HTMLImageElement).src = selectedCard.imageUrl || '/placeholder-card.png'; }} />
            <div className={overlay.modalBody}>
              <p><strong>Type:</strong> {selectedCard.type}</p>
              <p><strong>Element:</strong> {selectedCard.element}</p>
              <p><strong>Rarity:</strong> {selectedCard.rarity}</p>
              <p><strong>Cost:</strong> {selectedCard.cost}</p>
              {selectedCard.power !== undefined && (<p><strong>Power/Toughness:</strong> {selectedCard.power}/{selectedCard.toughness}</p>)}
              <p>{selectedCard.description}</p>
            </div>
            <button className={overlay.modalPrimary} onClick={() => setSelectedCard(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;