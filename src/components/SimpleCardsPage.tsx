import React, { useState, useEffect } from 'react';
import UnifiedCardSearch from './UnifiedCardSearch';
import { KONIVRER_CARDS } from '../data/cards';

// Types
interface Card {
  id: string;
  name: string;
  cost: number;
  type: 'Familiar' | 'Flag';
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  elements: string[];
  keywords: string[];
  strength?: number;
  artist?: string;
}

interface SearchResult {
  cards: Card[];
  totalCount: number;
  searchTime: number;
  warnings?: string[];
}

// Simple component to display when no search results
const NoSearchResults = () => (
  <div style={{
    marginTop: '20px',
    textAlign: 'center',
    color: '#ccc',
    padding: '15px',
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    fontSize: '14px'
  }}>
    <p>No cards found matching your search criteria.</p>
    <p style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>Try adjusting your filters or search terms.</p>
  </div>
);

const SimpleCardsPage: React.FC = () => {
  // Directly load cards to avoid any loading issues
  const allCards = KONIVRER_CARDS || [];
  
  const [searchResults, setSearchResults] = useState<SearchResult>({ 
    cards: [], 
    totalCount: 0, 
    searchTime: 0 
  });

  // Responsive design state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    // Run immediately
    checkDevice();
    
    // Set up event listener
    window.addEventListener('resize', checkDevice);
    
    // Clean up
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleSearchResults = (results: SearchResult) => {
    setSearchResults(results);
  };

  // Dynamic styling based on device
  const getContainerStyle = () => {
    if (isMobile) {
      return {
        padding: '10px',
        maxWidth: '100%',
        margin: '0'
      };
    } else if (isTablet) {
      return {
        padding: '15px',
        maxWidth: '100%',
        margin: '0 auto'
      };
    } else {
      return {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      };
    }
  };

  const getGridStyle = () => {
    if (isMobile) {
      return {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '15px'
      };
    } else if (isTablet) {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '18px'
      };
    } else {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      };
    }
  };

  const getCardStyle = () => {
    const basePadding = isMobile ? '12px' : '15px';
    const baseFontSize = isMobile ? '14px' : '16px';

    return {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '8px',
      padding: basePadding,
      transition: 'all 0.3s ease',
      fontSize: baseFontSize
    };
  };

  return (
    <div style={getContainerStyle()}>
      <UnifiedCardSearch 
        cards={allCards}
        onSearchResults={handleSearchResults}
        showAdvancedFilters={true}
        showSortOptions={true}
        showSearchHistory={true}
        initialMode="advanced"
        placeholder={isMobile ? "Search cards..." : "Search cards... (try: name:fire, cost:>=3, type:familiar)"}
      />
      
      {/* Show no results message only when search was performed but no results found */}
      {searchResults.totalCount === 0 && searchResults.searchTime > 0 && (
        <NoSearchResults />
      )}
      
      {/* Search Results Display */}
      {searchResults.totalCount > 0 && (
        <div style={{ marginTop: isMobile ? '20px' : '30px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isMobile ? '15px' : '20px',
            color: '#ccc',
            fontSize: isMobile ? '14px' : '16px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <span>
              Found {searchResults.totalCount} cards
              {searchResults.searchTime > 0 && ` in ${searchResults.searchTime}ms`}
            </span>
          </div>

          <div style={getGridStyle()}>
            {searchResults.cards.map(card => (
              <div
                key={card.id}
                style={getCardStyle()}
              >
                <h3 style={{
                  color: '#d4af37',
                  marginBottom: '10px',
                  fontSize: isMobile ? '16px' : '18px',
                  lineHeight: '1.2'
                }}>
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

export default SimpleCardsPage;