import React, { useState, useMemo } from 'react';
import type { Deck } from '../data/cards';
import './MyDecks.css';

interface DeckWithActions extends Deck {
  isPublic: boolean;
  lastPlayed?: Date;
  created: Date;
}

// User decks will be loaded from backend
const mockUserDecks: DeckWithActions[] = [];

export const MyDecks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'lastPlayed' | 'winRate'>('lastPlayed');
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private'>('all');

  // Filter and sort user decks
  const filteredDecks = useMemo(() => {
    let decks = mockUserDecks.filter(deck => {
      const matchesSearch = searchTerm === '' || 
        deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVisibility = filterBy === 'all' || 
        (filterBy === 'public' && deck.isPublic) ||
        (filterBy === 'private' && !deck.isPublic);

      return matchesSearch && matchesVisibility;
    });

    // Sort decks
    decks.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return b.created.getTime() - a.created.getTime();
        case 'lastPlayed':
          if (!a.lastPlayed && !b.lastPlayed) return 0;
          if (!a.lastPlayed) return 1;
          if (!b.lastPlayed) return -1;
          return b.lastPlayed.getTime() - a.lastPlayed.getTime();
        case 'winRate':
          return b.winRate - a.winRate;
        default:
          return 0;
      }
    });

    return decks;
  }, [searchTerm, sortBy, filterBy]);

  const handlePlayInSimulator = (deck: Deck) => {
    // Navigate to simulator with this deck loaded
    console.log('Playing deck in simulator:', deck.name);
    alert(`Loading "${deck.name}" in simulator... (Feature coming soon)`);
  };

  const handleEditDeck = (deck: Deck) => {
    // Navigate to deck builder with this deck loaded
    console.log('Editing deck:', deck.name);
    alert(`Opening "${deck.name}" in deck builder... (Feature coming soon)`);
  };

  const handleToggleVisibility = (deckId: string) => {
    // Update deck visibility in backend
    console.log('Toggling visibility for deck:', deckId);
    alert('Deck visibility toggle... (Feature coming soon)');
  };

  const handleDeleteDeck = (deckId: string) => {
    // Delete deck from backend
    console.log('Deleting deck:', deckId);
    if (confirm('Are you sure you want to delete this deck?')) {
      alert('Deck deletion... (Feature coming soon)');
    }
  };

  return (
    <div className="my-decks">
      <div className="my-decks-header">
        <h1>My Decks</h1>
        <p>Manage your personal deck collection</p>
      </div>

      <div className="my-decks-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search my decks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="lastPlayed">Last Played</option>
            <option value="name">Name</option>
            <option value="created">Date Created</option>
            <option value="winRate">Win Rate</option>
          </select>

          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Decks</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button 
          className="btn btn-primary new-deck-btn"
          onClick={() => alert('Create new deck... (Feature coming soon)')}
        >
          + New Deck
        </button>
      </div>

      <div className="decks-grid">
        {filteredDecks.map((deck) => (
          <div key={deck.id} className="deck-card">
            <div className="deck-header">
              <h3 className="deck-name">{deck.name}</h3>
              <div className="deck-visibility">
                {deck.isPublic ? (
                  <span className="visibility-badge public">🌐 Public</span>
                ) : (
                  <span className="visibility-badge private">🔒 Private</span>
                )}
              </div>
            </div>

            <div className="deck-info">
              <p className="deck-description">{deck.description}</p>
              <div className="deck-stats">
                <span className="stat">📊 Win Rate: {(deck.winRate * 100).toFixed(0)}%</span>
                <span className="stat">🎯 Format: {deck.format}</span>
                <span className="stat">⚡ Element: {deck.mainElement}</span>
              </div>
              <div className="deck-dates">
                <span className="date">Created: {deck.created.toLocaleDateString()}</span>
                {deck.lastPlayed && (
                  <span className="date">Last Played: {deck.lastPlayed.toLocaleDateString()}</span>
                )}
              </div>
            </div>

            <div className="deck-actions">
              <button 
                className="btn btn-primary action-btn"
                onClick={() => handlePlayInSimulator(deck)}
                title="Play in Simulator"
              >
                🎮 Play
              </button>
              <button 
                className="btn btn-secondary action-btn"
                onClick={() => handleEditDeck(deck)}
                title="Edit Deck"
              >
                ✏️ Edit
              </button>
              <button 
                className="btn btn-secondary action-btn"
                onClick={() => handleToggleVisibility(deck.id)}
                title="Toggle Visibility"
              >
                {deck.isPublic ? '🔒' : '🌐'}
              </button>
              <button 
                className="btn btn-danger action-btn"
                onClick={() => handleDeleteDeck(deck.id)}
                title="Delete Deck"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDecks.length === 0 && (
        <div className="empty-state">
          <h3>No decks found</h3>
          <p>
            {searchTerm ? 
              'Try adjusting your search or filters' : 
              'Create your first deck to get started!'
            }
          </p>
        </div>
      )}
    </div>
  );
};