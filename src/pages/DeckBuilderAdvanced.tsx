import React, { useState, useEffect } from 'react';

interface Deck {
  id: string;
  name: string;
  format: string;
  cardCount: number;
  lastModified: Date;
  colors: string[];
}

export const DeckBuilderAdvanced: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Decks will be loaded from backend
    setDecks([]);
  }, []);

  const createNewDeck = () => {
    const newDeck: Deck = {
      id: Date.now().toString(),
      name: `New Deck ${decks.length + 1}`,
      format: 'Standard',
      cardCount: 0,
      lastModified: new Date(),
      colors: []
    };
    setDecks([...decks, newDeck]);
    setSelectedDeck(newDeck);
  };

  return (
    <div className="deckbuilder-container">
      <div className="deckbuilder-header">
        <h1>Advanced Deck Builder</h1>
        <div className="header-actions">
          <button onClick={createNewDeck} className="btn btn-primary">
            + New Deck
          </button>
          <button className="btn btn-secondary">Import Deck</button>
        </div>
      </div>

      <div className="deckbuilder-content">
        <div className="deck-list-panel">
          <div className="panel-header">
            <h2>Your Decks</h2>
            <input
              type="text"
              placeholder="Search decks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="deck-grid">
            {decks
              .filter(deck => deck.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(deck => (
                <div 
                  key={deck.id} 
                  className={`deck-card ${selectedDeck?.id === deck.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDeck(deck)}
                >
                  <div className="deck-header">
                    <h3>{deck.name}</h3>
                    <div className="deck-colors">
                      {deck.colors.map(color => (
                        <div key={color} className={`color-indicator ${color}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="deck-info">
                    <span className="format">{deck.format}</span>
                    <span className="card-count">{deck.cardCount} cards</span>
                  </div>
                  <div className="deck-date">
                    Modified: {deck.lastModified.toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="deck-editor-panel">
          {selectedDeck ? (
            <div className="deck-editor">
              <div className="deck-editor-header">
                <input
                  type="text"
                  value={selectedDeck.name}
                  onChange={(e) => {
                    const updatedDeck = { ...selectedDeck, name: e.target.value };
                    setSelectedDeck(updatedDeck);
                    setDecks(decks.map(d => d.id === selectedDeck.id ? updatedDeck : d));
                  }}
                  className="deck-name-input"
                />
                <div className="deck-stats">
                  <span>{selectedDeck.cardCount}/60 cards</span>
                  <span>{selectedDeck.format}</span>
                </div>
              </div>

              <div className="card-categories">
                <div className="category">
                  <h3>Creatures (0)</h3>
                  <div className="card-slots">
                    <div className="add-card-prompt">
                      Click to add creatures to your deck
                    </div>
                  </div>
                </div>

                <div className="category">
                  <h3>Spells (0)</h3>
                  <div className="card-slots">
                    <div className="add-card-prompt">
                      Click to add spells to your deck
                    </div>
                  </div>
                </div>

                <div className="category">
                  <h3>Lands (0)</h3>
                  <div className="card-slots">
                    <div className="add-card-prompt">
                      Click to add lands to your deck
                    </div>
                  </div>
                </div>
              </div>

              <div className="deck-analysis">
                <h3>AI Deck Analysis</h3>
                <div className="analysis-card">
                  <h4>🤖 Recommendations</h4>
                  <ul>
                    <li>Add more low-cost creatures for early game pressure</li>
                    <li>Consider adding removal spells for versatility</li>
                    <li>Mana curve needs adjustment for optimal performance</li>
                  </ul>
                </div>
                
                <div className="analysis-card">
                  <h4>📊 Deck Statistics</h4>
                  <div className="stat-item">
                    <span>Average CMC:</span>
                    <span>0.0</span>
                  </div>
                  <div className="stat-item">
                    <span>Power Level:</span>
                    <span>Unranked</span>
                  </div>
                  <div className="stat-item">
                    <span>Synergy Score:</span>
                    <span>N/A</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-deck-selected">
              <h2>Select a deck to edit</h2>
              <p>Choose a deck from the list or create a new one to start building</p>
            </div>
          )}
        </div>

        <div className="card-search-panel">
          <div className="panel-header">
            <h2>Card Database</h2>
            <input
              type="text"
              placeholder="Search for cards..."
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <select className="filter-select">
              <option>All Colors</option>
              <option>White</option>
              <option>Blue</option>
              <option>Black</option>
              <option>Red</option>
              <option>Green</option>
            </select>
            
            <select className="filter-select">
              <option>All Types</option>
              <option>Creature</option>
              <option>Instant</option>
              <option>Sorcery</option>
              <option>Artifact</option>
              <option>Land</option>
            </select>
          </div>

          <div className="card-results">
            <div className="card-result">
              <div className="card-preview">
                <div className="card-image-placeholder">🃏</div>
              </div>
              <div className="card-details">
                <h4>Lightning Bolt</h4>
                <p>Instant - Deal 3 damage</p>
                <div className="card-cost">1R</div>
              </div>
              <button className="add-to-deck-btn">+</button>
            </div>
            
            <div className="card-result">
              <div className="card-preview">
                <div className="card-image-placeholder">🃏</div>
              </div>
              <div className="card-details">
                <h4>Serra Angel</h4>
                <p>Creature - Angel (4/4)</p>
                <div className="card-cost">3WW</div>
              </div>
              <button className="add-to-deck-btn">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};