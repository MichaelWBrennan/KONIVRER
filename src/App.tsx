import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CardSearch } from './components/CardSearch';
import { DeckSearch } from './components/DeckSearch';
import { KonivrverSimulator } from './components/KonivrverSimulator';
import { BubbleMenu } from './components/BubbleMenu';

import JudgePortal from './components/JudgePortal';
import NotificationCenter from './components/NotificationCenter';
import { DeckBuilderAdvanced } from './pages/DeckBuilderAdvanced';

import { Analytics } from './pages/Analytics';
import { Events } from './pages/Events';
import { Home } from './pages/Home';
import { MyDecks } from './pages/MyDecks';
import { Rules } from './pages/Rules';
import { useAppStore } from './stores/appStore';
import { useAuth } from './hooks/useAuth';
import { NotificationService } from './services/notifications';
import type { Card } from './data/cards';  // Use our local Card type
import type { Deck } from './data/cards';
import * as appStyles from './app.css.ts';

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

type Page = 'home' | 'simulator' | 'cards' | 'decks' | 'deckbuilder' | 'analytics' | 'events' | 'my-decks' | 'rules' | 'judge';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { selectedCard, setSelectedCard } = useAppStore();
  const { canAccessJudgePortal, isAuthenticated } = useAuth();

  // Initialize notifications on app start
  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    notificationService.initialize();
    
    // Set up WebSocket for real-time notifications if available
    // This would connect to your backend WebSocket
    // const socket = io('/events', {
    //   auth: { token: localStorage.getItem('authToken') }
    // });
    // notificationService.setupWebSocketNotifications(socket);
  }, []);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    console.log('Selected card:', card);
  };

  const handleDeckSelect = (deck: Deck) => {
    console.log('Selected deck:', deck);
    // Navigate to deck details or open in deck builder
  };

  const handleSearch = (query: string) => {
    // Context-sensitive search based on current page
    console.log('Search query:', query, 'on page:', currentPage);
    // Implement search functionality for each page
  };

  const handlePageChange = (page: Page) => {
    // Prevent navigation to judge portal if user doesn't have access
    if (page === 'judge' && !canAccessJudgePortal()) {
      console.warn('Access denied to judge portal');
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className={appStyles.app}>
      {/* Notification Center - positioned in top right */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
      }}>
        <NotificationCenter />
      </div>

      {/* Bubble Menu - only navigation system */}
      <BubbleMenu 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />

      <main>
        {currentPage === 'home' && (
          <Home />
        )}

        {currentPage === 'simulator' && (
          <KonivrverSimulator />
        )}
        
        {currentPage === 'cards' && (
          <CardSearch onCardSelect={handleCardSelect} />
        )}
        
        {currentPage === 'decks' && (
          <DeckSearch onDeckSelect={handleDeckSelect} />
        )}
        
        {currentPage === 'my-decks' && (
          <MyDecks />
        )}
        
        {currentPage === 'rules' && (
          <Rules />
        )}
        
        {currentPage === 'judge' && (
          canAccessJudgePortal() ? (
            <JudgePortal />
          ) : (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '2rem auto',
              backgroundColor: 'var(--secondary-bg)',
              borderRadius: '8px',
              border: '2px solid #ff6b6b'
            }}>
              <h2 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>
                🔒 Access Restricted
              </h2>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                The Judge Portal is only accessible to certified KONIVRER judges and administrators.
              </p>
              {!isAuthenticated ? (
                <p style={{ color: '#666' }}>
                  Please log in with your judge credentials to access this portal.
                </p>
              ) : (
                <p style={{ color: '#666' }}>
                  Your account does not have judge certification. Contact an administrator 
                  if you believe you should have access.
                </p>
              )}
            </div>
          )
        )}
        
        {currentPage === 'events' && (
          <Events />
        )}
        
        {currentPage === 'deckbuilder' && (
          <DeckBuilderAdvanced />
        )}
        
        {currentPage === 'analytics' && (
          <Analytics />
        )}
      </main>

      {/* Selected card details modal */}
      {selectedCard && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedCard(null)}
        >
          <div 
            style={{
              background: 'var(--secondary-bg)',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                color: 'var(--text-color)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                lineHeight: '1',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => setSelectedCard(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <h2>{selectedCard.name}</h2>
            <img 
              src={selectedCard.webpUrl} 
              alt={selectedCard.name}
              style={{ width: '100%', maxWidth: '300px', marginTop: '1rem' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = selectedCard.imageUrl || '/placeholder-card.png';
              }}
            />
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Type:</strong> {selectedCard.type}</p>
              <p><strong>Element:</strong> {selectedCard.element}</p>
              <p><strong>Rarity:</strong> {selectedCard.rarity}</p>
              <p><strong>Cost:</strong> {selectedCard.cost}</p>
              {selectedCard.power !== undefined && (
                <p><strong>Power/Toughness:</strong> {selectedCard.power}/{selectedCard.toughness}</p>
              )}
              <p style={{ marginTop: '1rem' }}>{selectedCard.description}</p>
            </div>
            <button 
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: 'var(--accent-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;