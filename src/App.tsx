import { useState } from 'react';
import { CardSearch } from './components/CardSearch';
import { DeckSearch } from './components/DeckSearch';
import { Card, Deck } from './data/cards';

type Page = 'cards' | 'decks' | 'deckbuilder';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('cards');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    console.log('Selected card:', card);
  };

  const handleDeckSelect = (deck: Deck) => {
    console.log('Selected deck:', deck);
    // TODO: Navigate to deck details or open in deck builder
  };

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-title">KONIVRER Deck Database</div>
        <a 
          href="#" 
          className={`nav-link ${currentPage === 'cards' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentPage('cards'); }}
        >
          Card Search
        </a>
        <a 
          href="#" 
          className={`nav-link ${currentPage === 'decks' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentPage('decks'); }}
        >
          Deck Search
        </a>
        <a 
          href="#" 
          className={`nav-link ${currentPage === 'deckbuilder' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setCurrentPage('deckbuilder'); }}
        >
          Deck Builder
        </a>
      </nav>

      <main>
        {currentPage === 'cards' && (
          <CardSearch onCardSelect={handleCardSelect} />
        )}
        
        {currentPage === 'decks' && (
          <DeckSearch onDeckSelect={handleDeckSelect} />
        )}
        
        {currentPage === 'deckbuilder' && (
          <div className="search-container">
            <h1 className="nav-title">Deck Builder</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Advanced deck building interface - Coming Soon!
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>
              This will integrate with the existing Godot game engine for interactive deck building.
            </p>
          </div>
        )}
      </main>

      {/* Selected card/deck details modal placeholder */}
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
                (e.target as HTMLImageElement).src = selectedCard.imageUrl;
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

export default App;