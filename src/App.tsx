import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CardSearch } from './components/CardSearch';
import { DeckSearch } from './components/DeckSearch';
import { CardSimulator } from './components/CardSimulator';
import { BubbleMenu } from './components/BubbleMenu';
import { DeckBuilderAdvanced } from './pages/DeckBuilderAdvanced';
import { Tournaments } from './pages/Tournaments';
import { Social } from './pages/Social';
import { Analytics } from './pages/Analytics';
import { Events } from './pages/Events';
import { Home } from './pages/Home';
import { MyDecks } from './pages/MyDecks';
import { Rules } from './pages/Rules';
import { useAppStore } from './stores/appStore';
import type { Card } from './stores/appStore';
import type { Deck } from './data/cards';
import './App.css';

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

type Page = 'home' | 'simulator' | 'cards' | 'decks' | 'deckbuilder' | 'tournaments' | 'social' | 'analytics' | 'events' | 'my-decks' | 'rules';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { selectedCard, setSelectedCard } = useAppStore();

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    console.log('Selected card:', card);
  };

  const handleDeckSelect = (deck: Deck) => {
    console.log('Selected deck:', deck);
    // TODO: Navigate to deck details or open in deck builder
  };

  const handleSearch = (query: string) => {
    // Context-sensitive search based on current page
    console.log('Search query:', query, 'on page:', currentPage);
    // TODO: Implement actual search functionality for each page
  };

  return (
    <div className="app">
      {/* Bubble Menu - only navigation system */}
      <BubbleMenu 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
      />

      <main>
        {currentPage === 'home' && (
          <Home />
        )}

        {currentPage === 'simulator' && (
          <CardSimulator />
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
        
        {currentPage === 'events' && (
          <Events />
        )}
        
        {currentPage === 'deckbuilder' && (
          <DeckBuilderAdvanced />
        )}
        
        {currentPage === 'tournaments' && (
          <Tournaments />
        )}
        
        {currentPage === 'social' && (
          <Social />
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
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
              {selectedCard.keywords && selectedCard.keywords.length > 0 && (
                <p><strong>Keywords:</strong> {selectedCard.keywords.join(', ')}</p>
              )}
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