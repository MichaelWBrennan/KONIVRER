import React, { useState, useMemo } from 'react';
import type { Deck } from '../data/cards';
import * as s from './myDecks.css.ts';

interface DeckWithActions extends Deck {
  isPublic: boolean;
  lastPlayed?: Date;
  created: Date;
}

// User decks will be loaded from backend
const mockUserDecks: DeckWithActions[]   : any : any = [];

export const MyDecks: React.FC  : any : any = () => {
  const [searchTerm, setSearchTerm]   : any : any = useState('');
  const [sortBy, setSortBy]   : any : any = useState<'name' | 'created' | 'lastPlayed' | 'winRate'>('lastPlayed');
  const [filterBy, setFilterBy]   : any : any = useState<'all' | 'public' | 'private'>('all');

  // Filter and sort user decks
  const filteredDecks   : any : any = useMemo(() => {
    let decks = mockUserDecks.filter(deck => {
      const matchesSearch   : any : any = searchTerm === '' || 
        deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVisibility   : any : any = filterBy === 'all' || 
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

  const handlePlayInSimulator   : any : any = (deck: Deck) => {
    // Navigate to simulator with this deck loaded
    console.log('Playing deck in simulator:', deck.name);
    alert(`Loading "${deck.name}" in simulator... (Feature coming soon)`);
  };

  const handleEditDeck   : any : any = (deck: Deck) => {
    // Navigate to deck builder with this deck loaded
    console.log('Editing deck:', deck.name);
    alert(`Opening "${deck.name}" in deck builder... (Feature coming soon)`);
  };

  const handleToggleVisibility   : any : any = (deckId: string) => {
    // Update deck visibility in backend
    console.log('Toggling visibility for deck:', deckId);
    alert('Deck visibility toggle... (Feature coming soon)');
  };

  const handleDeleteDeck   : any : any = (deckId: string) => {
    // Delete deck from backend
    console.log('Deleting deck:', deckId);
    if (confirm('Are you sure you want to delete this deck?')) {
      alert('Deck deletion... (Feature coming soon)');
    }
  };

  return (
    <div className={s.root}>
      <div className={s.header}>
        <h1>My Decks</h1>
        <p>Manage your personal deck collection</p>
      </div>

      <div className={s.controls}>
        <div className={s.searchSection}>
          <input
            type="text"
            placeholder="Search my decks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={s.searchInput}
          />
        </div>

        <div className={s.filterSection}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className={s.select}
          >
            <option value="lastPlayed">Last Played</option>
            <option value="name">Name</option>
            <option value="created">Date Created</option>
            <option value="winRate">Win Rate</option>
          </select>

          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value as any)}
            className={s.select}
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

      <div className={s.decksGrid}>
        {filteredDecks.map((deck) => (
          <div key={deck.id} className={s.deckCard}>
            <div className={s.deckHeader}>
              <h3 className={s.deckName}>{deck.name}</h3>
              <div>
                {deck.isPublic ? (
                  <span className={`${s.visibilityBadge} ${s.visibilityPublic}`}>🌐 Public</span>
                ) : (
                  <span className={`${s.visibilityBadge} ${s.visibilityPrivate}`}>🔒 Private</span>
                )}
              </div>
            </div>

            <div className={s.deckInfo}>
              <p className={s.deckDescription}>{deck.description}</p>
              <div className={s.deckStats}>
                <span className={s.stat}>📊 Win Rate: {(deck.winRate * 100).toFixed(0)}%</span>
                <span className={s.stat}>🎯 Format: {deck.format}</span>
                <span className={s.stat}>⚡ Element: {deck.mainElement}</span>
              </div>
              <div className={s.deckDates}>
                <span className={s.date}>Created: {deck.created.toLocaleDateString()}</span>
                {deck.lastPlayed && (
                  <span className={s.date}>Last Played: {deck.lastPlayed.toLocaleDateString()}</span>
                )}
              </div>
            </div>

            <div className={s.deckActions}>
              <button 
                className={`btn btn-primary ${s.actionBtn}`}
                onClick={() => handlePlayInSimulator(deck)}
                title="Play in Simulator"
              >
                🎮 Play
              </button>
              <button 
                className={`btn btn-secondary ${s.actionBtn}`}
                onClick={() => handleEditDeck(deck)}
                title="Edit Deck"
              >
                ✏️ Edit
              </button>
              <button 
                className={`btn btn-secondary ${s.actionBtn}`}
                onClick={() => handleToggleVisibility(deck.id)}
                title="Toggle Visibility"
              >
                {deck.isPublic ? '🔒' : '🌐'}
              </button>
              <button 
                className={`btn btn-danger ${s.actionBtn}`}
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
        <div className={s.emptyState}>
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