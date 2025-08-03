import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ContextualSearchBarProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SearchContext {
  type: string;
  placeholder: string;
  description: string;
  suggestions: string[];
}

const ContextualSearchBar: React.FC<ContextualSearchBarProps> = ({ isVisible, onClose }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchContext, setSearchContext] = useState<SearchContext>({
    type: 'general',
    placeholder: 'Search...',
    description: 'General search',
    suggestions: []
  });

  // Determine search context based on current route
  useEffect(() => {
    const path = location.pathname;
    
    let context: SearchContext;
    
    switch (path) {
      case '/cards':
        context = {
          type: 'cards',
          placeholder: 'Search cards by name, type, element...',
          description: 'Search through 65+ mystical cards',
          suggestions: ['Fire', 'Water', 'Earth', 'Air', 'Familiar', 'Flag', 'Common', 'Rare']
        };
        break;
      
      case '/decks':
        context = {
          type: 'decks',
          placeholder: 'Search your decks...',
          description: 'Find your deck collections',
          suggestions: ['My Deck', 'Tournament', 'Practice', 'Favorite']
        };
        break;
      
      case '/events':
        context = {
          type: 'events',
          placeholder: 'Search tournaments and events...',
          description: 'Find competitions and gatherings',
          suggestions: ['Championship', 'Beginner', 'Arena', 'Tournament', 'Weekly']
        };
        break;
      
      case '/play':
        context = {
          type: 'game',
          placeholder: 'Search game modes, opponents...',
          description: 'Find ways to play KONIVRER',
          suggestions: ['Practice', 'Ranked', 'Quick Match', 'Tournament']
        };
        break;
      
      case '/':
        context = {
          type: 'blog',
          placeholder: 'Search blog posts and news...',
          description: 'Search chronicles and updates',
          suggestions: ['News', 'Updates', 'Strategy', 'Chronicles']
        };
        break;
      
      default:
        context = {
          type: 'general',
          placeholder: 'Search KONIVRER...',
          description: 'Search across all content',
          suggestions: ['Cards', 'Decks', 'Events', 'Help']
        };
    }
    
    setSearchContext(context);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Implement search logic based on context
    console.log(`Searching for "${searchTerm}" in context: ${searchContext.type}`);
    
    // For demonstration, we'll show an alert with search info
    // In a real app, this would trigger actual search functionality
    alert(`Searching for "${searchTerm}" in ${searchContext.description}`);
    
    // Close the popup after search
    onClose();
    setSearchTerm('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder={searchContext.placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </form>
      
      <div className="search-context">
        {searchContext.description}
      </div>
      
      {searchContext.suggestions.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ 
            fontSize: '12px', 
            color: '#888', 
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            Quick searches:
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '6px' 
          }}>
            {searchContext.suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  color: '#d4af37',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ 
        marginTop: '12px', 
        fontSize: '11px', 
        color: '#666',
        fontStyle: 'italic'
      }}>
        Press Enter to search, Escape to close
      </div>
    </div>
  );
};

export default ContextualSearchBar;