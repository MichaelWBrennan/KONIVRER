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
    navigate(`/card/${card.id}`);
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search cards by name, text, or type..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          onBlur={handleBlur}
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-lg"
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {searchResults.map(card => (
            <div
              key={card.id}
              className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
              onClick={() => handleCardSelect(card)}
            >
              <div className="font-medium text-white">{card.name}</div>
              <div className="text-sm text-gray-400">{card.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardSearchBar;