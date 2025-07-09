import React, { useState } from 'react';
import UnifiedCardSearch, { Card, SearchResult } from './UnifiedCardSearch';
import { KONIVRER_CARDS } from '../data/cards';

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult>({ 
    cards: [], 
    totalCount: 0, 
    searchTime: 0 
  });

  const handleSearchResults = (results: SearchResult) => {
    setSearchResults(results);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#d4af37', marginBottom: '30px', textAlign: 'center' }}>
        Advanced Card Search
      </h1>
      
      <UnifiedCardSearch 
        cards={KONIVRER_CARDS}
        onSearchResults={handleSearchResults}
        showAdvancedFilters={true}
        showSortOptions={true}
        showSearchHistory={true}
        initialMode="advanced"
        placeholder="Search KONIVRER cards... (try: name:fire, cost:>=3, type:familiar)"
      />
      
      {/* Search Results Display */}
      {searchResults.totalCount > 0 && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            color: '#ccc'
          }}>
            <span>
              Found {searchResults.totalCount} cards 
              {searchResults.searchTime > 0 && ` in ${searchResults.searchTime}ms`}
            </span>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {searchResults.cards.map(card => (
              <div
                key={card.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  padding: '15px',
                  transition: 'all 0.3s ease'
                }}
              >
                <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
                  {card.name}
                </h3>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#ccc' }}>Type: </span>
                  <span style={{ color: '#fff' }}>{card.type}</span>
                  <span style={{ color: '#ccc', marginLeft: '15px' }}>Cost: </span>
                  <span style={{ color: '#fff' }}>{card.cost}</span>
                </div>
                {card.strength && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#ccc' }}>Strength: </span>
                    <span style={{ color: '#fff' }}>{card.strength}</span>
                  </div>
                )}
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#ccc' }}>Rarity: </span>
                  <span style={{ 
                    color: card.rarity === 'Rare' ? '#FFD700' : 
                          card.rarity === 'Uncommon' ? '#C0C0C0' : '#CD7F32'
                  }}>
                    {card.rarity}
                  </span>
                </div>
                {card.elements.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#ccc' }}>Elements: </span>
                    <span style={{ color: '#fff' }}>{card.elements.join(', ')}</span>
                  </div>
                )}
                <p style={{ 
                  color: '#ddd', 
                  fontSize: '14px', 
                  lineHeight: '1.4',
                  marginBottom: '8px'
                }}>
                  {card.description}
                </p>
                {card.keywords.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#ccc' }}>Keywords: </span>
                    <span style={{ color: '#d4af37' }}>{card.keywords.join(', ')}</span>
                  </div>
                )}
                {card.artist && (
                  <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                    Art by {card.artist}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Warnings */}
      {searchResults.warnings && searchResults.warnings.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: 'rgba(255, 165, 0, 0.1)',
          border: '1px solid rgba(255, 165, 0, 0.3)',
          borderRadius: '4px',
          color: '#FFA500'
        }}>
          {searchResults.warnings.map((warning, index) => (
            <div key={index}>{warning}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;