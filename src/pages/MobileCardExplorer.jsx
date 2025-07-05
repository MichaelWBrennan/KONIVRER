/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { getCardArtPathFromData } from '../utils/cardArtMapping';
const MobileCardExplorer = () => {
  const { cards, loading, error } = useData();
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  // Filter cards based on search term and type
  useEffect(() => {
    if (!cards) return;
    // Don't show any cards until a search is performed
    if (!searchTerm || searchTerm.length < 2) {
      setFilteredCards([]);
      return;
    }
    let results = [...cards];
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        card =>
          card.name.toLowerCase().includes(term) ||
          (card.text && card.text.toLowerCase().includes(term)),
      );
    }
    // Apply type filter
    if (selectedType !== 'All') {
      results = results.filter(card => card.type === selectedType);
    }
    setFilteredCards(results);
  }, [cards, searchTerm, selectedType]);
  // Handle search input change
  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };
  // Handle type filter change
  const handleTypeChange = type => {
    setSelectedType(type);
    setShowFilters(false);
  };
  // Get unique card types
  const getCardTypes = () => {
    if (!cards) return ['All'];
    const types = new Set(cards.map(card => card.type));
    return ['All', ...Array.from(types)];
  };
  // Loading state
  if (loading) {
    return (
      <div className="mobile-p mobile-text-center">
        <div className="mobile-card">
          <p>Loading cards...</p>
        </div>
      </div>
    );
  }
  // Error state
  if (error) {
    return (
      <div className="mobile-p">
        <div className="mobile-card">
          <p>Error loading cards: {error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mobile-card-explorer">
      {/* Search Bar */}
      <div className="mobile-card mobile-mb">
        <div className="mobile-form-group">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="mobile-input pl-12"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="mobile-form-group mobile-text-center">
          <button
            className="mobile-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        {/* Advanced Search Links */}
        <div className="mobile-form-group mobile-text-center">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/advanced-search" className="mobile-link">
              Advanced Search ⟶
            </Link>
            <a 
              href="https://#/syntax-guide" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mobile-link"
            >
              KONIVRER Syntax Guide ⟶
            </a>
          </div>
        </div>
        {/* Filters */}
        {showFilters && (
          <div className="mobile-mt">
            <label className="mobile-label">Card Type</label>
            <div className="mobile-grid">
              {getCardTypes().map(type => (
                <button
                  key={type}
                  className={`mobile-btn ${selectedType === type ? 'mobile-btn-primary' : ''}`}
                  onClick={() => handleTypeChange(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Results Count */}
      <div className="mobile-mb">
        <p className="mobile-text-center">
          {!searchTerm || searchTerm.length < 2 
            ? "Enter at least 2 characters to search for cards" 
            : `${filteredCards.length} cards found`}
        </p>
      </div>
      {/* Card Grid */}
      <div className="mobile-grid">
        {filteredCards.slice(0, 20).map(card => (
          <Link
            to={`/card/${card.id}`}
            key={card.id}
            className="mobile-game-card mobile-mb"
          >
            <img
              src={
                getCardArtPathFromData(card) ||
                'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png'
              }
              alt={card.name}
              className="mobile-game-card-img"
              onError={e => {
                console.log(
                  `Failed to load image for ${card.name}: ${getCardArtPathFromData(card)}`,
                );
                e.target.onerror = null;
                e.target.src =
                  'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png';
              }}
              onLoad={e => {
                console.log(
                  `Successfully loaded image for ${card.name}: ${e.target.src}`,
                );
              }}
            />
          </Link>
        ))}
      </div>
      {/* Load More Button */}
      {filteredCards.length > 20 && searchTerm && searchTerm.length >= 2 && (
        <div className="mobile-text-center mobile-mt mobile-mb">
          <button className="mobile-btn mobile-btn-primary">Load More</button>
        </div>
      )}
    </div>
  );
};
export default MobileCardExplorer;
