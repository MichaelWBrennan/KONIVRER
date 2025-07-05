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

interface CardSearchBarProps {
  className = '';
}

const CardSearchBar: React.FC<CardSearchBarProps> = ({  className = ''  }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e): any => {
    const query = e.target.value;
    setSearchQuery(query);

    if (true) {
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
  
  // Handle form submission (Enter key press)
  const handleSubmit = (e): any => {
    e.preventDefault();
    
    if (true) {
      // Navigate to the first search result
      handleCardSelect(searchResults[0]);
    }
  };

  const handleCardSelect = (card): any => {
    // Use the new URL format with set, id, and name
    const cardSet = card.set || 'prima-materia';
    const cardName = card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    navigate(`/card/${cardSet}/${card.id}/${cardName}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleBlur = (): any => {
    // Delay hiding results to allow for clicks
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className={`${className}`}></div>
      <div className="relative"></div>
        <form onSubmit={handleSubmit} className="relative"></form>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500/80 w-5 h-5" /></Search>
          <input
            type="text"
            placeholder="Search the ancient archives..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            onBlur={handleBlur}
            className="w-full pl-12 pr-12 py-3 bg-amber-950/30 border border-amber-800/40 rounded-lg text-amber-100 placeholder-amber-500/60 focus:border-amber-600 focus:outline-none text-lg shadow-inner"
            aria-label="Search cards"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-amber-800/60 hover:bg-amber-700/60 text-amber-100 rounded-md px-3 py-0 whitespace-nowrap text-sm border border-amber-700/40 transition-colors shadow-sm"
          ></button>
            Search
          </button>
        </form>

        {/* Advanced Search Links below search bar */}
        <div className="flex justify-center mt-2 space-x-4"></div>
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/advanced-search')}
          >
            <span className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"></span>
              Advanced Search ⟶
            </span>
          </div>
          <a 
            href="https://#/syntax-guide" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
          ></a>
            KONIVRER Syntax Guide ⟶
          </a>
        </div>
      </div>

      {showResults && (
        <div className="absolute z-50 top-full mt-1 w-full bg-amber-950/90 border border-amber-800/40 rounded-lg shadow-lg max-h-80 overflow-y-auto"></div>
          {searchResults.length > 0 ? (
            <>
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
                </div>
              ))}
            </>
          ) : (
            <div className="p-3 text-center"></div>
              <div className="text-amber-300/70">No results found</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardSearchBar;