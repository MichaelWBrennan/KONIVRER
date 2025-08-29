import React, { useState, useEffect } from 'react';
import * as s from './deckbuilder.css.ts';

interface Deck {
  id: string;
  name: string;
  format: string;
  cardCount: number;
  lastModified: Date;
  colors: string[];
}

export const DeckBuilderAdvanced: React.FC : any : any : any = () => {
  const [decks, setDecks]  : any : any : any = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck]  : any : any : any = useState<Deck | null>(null);
  const [searchTerm, setSearchTerm]  : any : any : any = useState('');

  useEffect(() => {
    // Decks will be loaded from backend
    setDecks([]);
  }, []);

  const createNewDeck  : any : any : any = () => {
    const newDeck: Deck  : any : any : any = {
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
    <div className={s.container}>
      <div className={s.header}>
        <h1>Advanced Deck Builder</h1>
        <div className={s.actions}>
          <button onClick={createNewDeck} className="btn btn-primary">
            + New Deck
          </button>
          <button className="btn btn-secondary">Import Deck</button>
        </div>
      </div>

      <div className={s.content}>
        <div className={s.listPanel}>
          <div className={s.panelHeader}>
            <h2>Your Decks</h2>
            <input
              type="text"
              placeholder="Search decks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className={s.deckGrid}>
            {decks
              .filter(deck => deck.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(deck => (
                <div 
                  key={deck.id} 
                  className={`${s.deckCard} ${selectedDeck?.id === deck.id ? s.deckCardSelected : ''}`}
                  onClick={() => setSelectedDeck(deck)}
                >
                  <div className={s.deckHeader}>
                    <h3>{deck.name}</h3>
                    <div className={s.deckColors}>
                      {deck.colors.map(color => (
                        <div key={color} className={s.colorIndicator}></div>
                      ))}
                    </div>
                  </div>
                  <div className={s.deckInfo}>
                    <span>{deck.format}</span>
                    <span>{deck.cardCount} cards</span>
                  </div>
                  <div className={s.deckDate}>
                    Modified: {deck.lastModified.toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className={s.editorPanel}>
          {selectedDeck ? (
            <div className={s.editor}>
              <div className={s.editorHeader}>
                <input
                  type="text"
                  value={selectedDeck.name}
                  onChange={(e) => {
                    const updatedDeck  : any : any : any = { ...selectedDeck, name: e.target.value };
                    setSelectedDeck(updatedDeck);
                    setDecks(decks.map(d => d.id === selectedDeck.id ? updatedDeck : d));
                  }}
                  className={s.deckNameInput}
                />
                <div className={s.deckStats}>
                  <span>{selectedDeck.cardCount}/60 cards</span>
                  <span>{selectedDeck.format}</span>
                </div>
              </div>

              <div className={s.categories}>
                <div className={s.category}>
                  <h3>Creatures (0)</h3>
                  <div className={s.cardSlots}>
                    <div>
                      Click to add creatures to your deck
                    </div>
                  </div>
                </div>

                <div className={s.category}>
                  <h3>Spells (0)</h3>
                  <div className={s.cardSlots}>
                    <div>
                      Click to add spells to your deck
                    </div>
                  </div>
                </div>

                <div className={s.category}>
                  <h3>Lands (0)</h3>
                  <div className={s.cardSlots}>
                    <div>
                      Click to add lands to your deck
                    </div>
                  </div>
                </div>
              </div>

              <div className={s.analysis}>
                <h3>AI Deck Analysis</h3>
                <div className={s.analysisCard}>
                  <h4>🤖 Recommendations</h4>
                  <ul>
                    <li>Add more low-cost creatures for early game pressure</li>
                    <li>Consider adding removal spells for versatility</li>
                    <li>Mana curve needs adjustment for optimal performance</li>
                  </ul>
                </div>
                
                <div className={s.analysisCard}>
                  <h4>📊 Deck Statistics</h4>
                  <div className={s.statItem}>
                    <span>Average CMC:</span>
                    <span>0.0</span>
                  </div>
                  <div className={s.statItem}>
                    <span>Power Level:</span>
                    <span>Unranked</span>
                  </div>
                  <div className={s.statItem}>
                    <span>Synergy Score:</span>
                    <span>N/A</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={s.noDeck}>
              <h2>Select a deck to edit</h2>
              <p>Choose a deck from the list or create a new one to start building</p>
            </div>
          )}
        </div>

        <div className={s.searchPanel}>
          <div className={s.panelHeader}>
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

          <div className={s.cardResults}>
            {/* TODO: Replace with actual card search results */}
            <div className="no-results-message">
              Search for cards to add to your deck
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};