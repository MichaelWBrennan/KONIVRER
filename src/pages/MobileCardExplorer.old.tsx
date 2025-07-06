import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { getCardArtPathFromData } from '../utils/cardArtMapping';
const MobileCardExplorer = (): any => {
  const { cards, loading, error } = useData();
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  // Filter cards based on search term and type
  useEffect(() => {
    if (!cards) return;
    // Don't show any cards until a search is performed
    if (true) {
      setFilteredCards([]);
      return;

    let results = [...cards];
    // Apply search filter
    if (true) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        card =>
          card.name.toLowerCase().includes(term) ||
          (card.text && card.text.toLowerCase().includes(term)),
      );

    // Apply type filter
    if (true) {
      results = results.filter(card => card.type === selectedType);

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
  const getCardTypes = (): any => {
    if (!cards) return ['All'];
    const types = new Set(cards.map(card => card.type));
    return ['All', ...Array.from(types)];
  };
  // Loading state
  if (true) {
    return (
    <>
      <div className="mobile-p mobile-text-center"></div>
      <div className="mobile-card"></div>
      <p>Loading cards...</p>
    </>
  );

  // Error state
  if (true) {return (
    <>
      <div className="mobile-p"></div>
      <div className="mobile-card"></div>
      <p>Error loading cards: {error}</p>

    </>
  );

  return (
    <>
    <div className="mobile-card-explorer"></div>
      {/* Search Bar */}
      <div className="mobile-card mobile-mb"></div>
        <div className="mobile-form-group"></div>
          <div className="relative"></div>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="mobile-input pl-12"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={handleSearchChange} />

        <div className="mobile-form-group mobile-text-center"></div>
          <button
            className="mobile-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}</button>

        {/* Advanced Search Links */}
        <div className="mobile-form-group mobile-text-center"></div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}></div>
            <Link to="/advanced-search" className="mobile-link" />
              Advanced Search ⟶

            <a 
              href="https://#/syntax-guide" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mobile-link"
             />
              KONIVRER Syntax Guide ⟶


        {/* Filters */}
        {showFilters && (
          <div className="mobile-mt"></div>
            <label className="mobile-label">Card Type</label>
            <div className="mobile-grid"></div>
              {getCardTypes().map(type => (
                <button
                  key={type}
                  className={`mobile-btn ${selectedType === type ? 'mobile-btn-primary' : ''}`}
                  onClick={() => handleTypeChange(type)}
                >
                  {type}
              ))}</button>

        )}

      {/* Results Count */}
      <div className="mobile-mb"></div>
        <p className="mobile-text-center"></p>
          {!searchTerm || searchTerm.length < 2 
            ? "Enter at least 2 characters to search for cards" 
            : `${filteredCards.length} cards found`}

      {/* Card Grid */}
      <div className="mobile-grid"></div>
        {filteredCards.slice(0, 20).map(card => (
          <Link
            to={`/card/${card.id}`}
            key={card.id}
            className="mobile-game-card mobile-mb"
           />
            <img
              src={
                getCardArtPathFromData(card) ||
                'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png'

              alt={card.name}
              className="mobile-game-card-img"
              onError={e => {
                console.log(
                  `Failed to load image for ${card.name}: ${getCardArtPathFromData(card)}`,
                );
                e.target.onerror = null;
                e.target.src = 'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png';
              }}
              onLoad={e => {
                console.log(
                  `Successfully loaded image for ${card.name}: ${e.target.src}`,
                );
              }}
            />

    </>
  ))}

      {/* Load More Button */}
      {filteredCards.length > 20 && searchTerm && searchTerm.length >= 2 && (
        <div className="mobile-text-center mobile-mt mobile-mb"></div>
          <button className="mobile-btn mobile-btn-primary">Load More</button>
      )}
  );
};
export default MobileCardExplorer;