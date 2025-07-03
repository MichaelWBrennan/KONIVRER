/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import cardsData from '../../data/cards.json';

const CardSearchBar = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results = cardsData
      .filter(card => {
        const cardName = (card.name || '').toLowerCase();
        const cardText = (card.description || '').toLowerCase();
        const cardType = (card.type || '').toLowerCase();
        const searchLower = query.toLowerCase();

        return cardName.includes(searchLower) || 
               cardText.includes(searchLower) || 
               cardType.includes(searchLower);
      })
      .slice(0, 5); // Limit to 5 results

    setSearchResults(results);
    setShowResults(true);
  };

  const handleCardSelect = (card) => {
    // Use the new URL format with set, id, and name
    const cardSet = card.set || 'prima-materia';
    const cardName = card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    navigate(`/card/${cardSet}/${card.id}/${cardName}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500/80 w-5 h-5" />
        <input
          type="text"
          placeholder="Search the ancient archives..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          onBlur={handleBlur}
          className="w-full pl-12 pr-4 py-3 bg-amber-950/30 border border-amber-800/40 rounded-lg text-amber-100 placeholder-amber-500/60 focus:border-amber-600 focus:outline-none text-lg shadow-inner"
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-amber-950/90 border border-amber-800/40 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {searchResults.map(card => (
            <div
              key={card.id}
              className="p-3 hover:bg-amber-900/50 cursor-pointer border-b border-amber-800/30 last:border-b-0"
              onClick={() => handleCardSelect(card)}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur event from hiding results before click
                handleCardSelect(card);
              }}
            >
              <div className="font-medium text-amber-100">{card.name}</div>
              <div className="text-sm text-amber-300/70">{card.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardSearchBar;