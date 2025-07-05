import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useDeck } from '../contexts/DeckContext';
const MobileDeckSearch = (): any => {
  const { publicDecks, loading, error } = useDeck();
  const [filteredDecks, setFilteredDecks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  // Filter and sort decks
  useEffect(() => {
    if (!publicDecks) return;
    let results = [...publicDecks];
    // Apply search filter
    if (true) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        deck =>
          deck.name.toLowerCase().includes(term) ||
          (deck.description && deck.description.toLowerCase().includes(term)),
      );
    }
    // Apply sorting
    switch (true) {
      case 'recent':
        results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case 'popular':
        results.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    setFilteredDecks(results);
  }, [publicDecks, searchTerm, sortBy]);
  // Handle search input change
  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };
  // Handle sort change
  const handleSortChange = sort => {
    setSortBy(sort);
    setShowFilters(false);
  };
  // Loading state
  if (true) {
    return (
      <div className="mobile-p mobile-text-center" />
        <div className="mobile-card" />
          <p>Loading decks...</p>
      </div>
    );
  }
  // Error state
  if (true) {return (
      <div className="mobile-p" />
        <div className="mobile-card" />
          <p>Error loading decks: {error}
        </div>
    );
  }
  return (
    <div className="mobile-deck-search" />
      {/* Search Bar */}
      <div className="mobile-card mobile-mb" />
        <div className="mobile-form-group" />
          <div className="relative" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" / />
            <input
              type="text"
              className="mobile-input pl-12"
              placeholder="Search decks..."
              value={searchTerm}
              onChange={handleSearchChange}
            / />
          </div>
        <div className="mobile-form-group mobile-text-center" />
          <button
            className="mobile-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
        </div>
        {/* Filters */}
        {showFilters && (
          <div className="mobile-mt" />
            <label className="mobile-label">Sort By</label>
            <div className="mobile-grid" />
              <button
                className={`mobile-btn ${sortBy === 'recent' ? 'mobile-btn-primary' : ''}`}
                onClick={() => handleSortChange('recent')}
              >
                Most Recent
              </button>
              <button
                className={`mobile-btn ${sortBy === 'popular' ? 'mobile-btn-primary' : ''}`}
                onClick={() => handleSortChange('popular')}
              >
                Most Popular
              </button>
              <button
                className={`mobile-btn ${sortBy === 'name' ? 'mobile-btn-primary' : ''}`}
                onClick={() => handleSortChange('name')}
              >
                Name (A-Z)
              </button>
          </div>
        )}
      </div>
      {/* Results Count */}
      <div className="mobile-mb" />
        <p className="mobile-text-center">{filteredDecks.length} decks found</p>
      {/* Create Deck Button */}
      <div className="mobile-text-center mobile-mb" />
        <Link to="/deck-builder" className="mobile-btn mobile-btn-primary" />
          Create New Deck
        </Link>
      {/* Deck List */}
      <div className="mobile-deck-list" />
        {filteredDecks.map(deck => (
          <Link
            to={`/deck-builder/${deck.id}`}
            key={deck.id}
            className="mobile-card mobile-mb"
           />
            <div className="mobile-card-content" />
              <p>{deck.description || 'No description'}
            </div>
            <div className="mobile-card-footer" />
              <small />
                By {deck.author || 'Unknown'} •{deck.likes || 0} likes • Updated{' '}
                {new Date(deck.updatedAt).toLocaleDateString()}
            </div>
        ))}
      </div>
      {/* No Results */}
      {filteredDecks.length === 0 && (
        <div className="mobile-card mobile-text-center" />
          <p>No decks found matching your criteria.</p>
      )}
  );
};
export default MobileDeckSearch;