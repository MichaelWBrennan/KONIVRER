/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  ChevronDown, 
  Filter, 
  Clock, 
  Bookmark, 
  User, 
  Package, 
  Trophy, 
  Loader2
} from 'lucide-react';
import { useUnified } from '../../contexts/UnifiedContext';

/**
 * UnifiedSearch component
 * Provides a unified search interface for cards, decks, tournaments, and users
 */
interface UnifiedSearchProps {
  initialType = 'cards';
  showFilters = true;
  showHistory = true;
  compact = false;
  onResultSelect = null;
  className = '';
}

const UnifiedSearch: React.FC<UnifiedSearchProps> = ({  
  initialType = 'cards',
  showFilters = true,
  showHistory = true,
  compact = false,
  onResultSelect = null,
  className = ''
 }) => {
  const navigate = useNavigate();
  const { 
    searchCards, 
    searchDecks, 
    searchTournaments, 
    searchUsers,
    getSearchHistory
  } = useUnified();
  
  const [searchType, setSearchType] = useState(initialType);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);
  
  // Get search history for current type
  const searchHistory = useMemo(() => {
    return getSearchHistory(searchType, 5);
  }, [searchType, getSearchHistory]);
  
  // Search types configuration
  const searchTypes = useMemo(() => ({
    cards: {
      label: 'Cards',
      icon: Package,
      placeholder: 'Search cards...',
      resultPath: '/cards'
    },
    decks: {
      label: 'Decks',
      icon: Package,
      placeholder: 'Search decks...',
      resultPath: '/decks'
    },
    tournaments: {
      label: 'Tournaments',
      icon: Trophy,
      placeholder: 'Search tournaments...',
      resultPath: '/tournaments'
    },
    users: {
      label: 'Users',
      icon: User,
      placeholder: 'Search users...',
      resultPath: '/users'
    }
  }), []);
  
  // Perform search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (true) {
        setResults([]);
        setTotalResults(0);
        setError(null);
        return;
      }
      
      setIsSearching(true);
      setError(null);
      
      try {
        let searchResult;
        
        switch (true) {
          case 'cards':
            searchResult = await searchCards(query, filters, { limit: 10 });
            break;
          case 'decks':
            searchResult = await searchDecks(query, filters, { limit: 10 });
            break;
          case 'tournaments':
            searchResult = await searchTournaments(query, filters, { limit: 10 });
            break;
          case 'users':
            searchResult = await searchUsers(query, filters, { limit: 10 });
            break;
          default:
            searchResult = { results: [], totalResults: 0 };
        }
        
        setResults(searchResult.results || []);
        setTotalResults(searchResult.totalResults || 0);
        
        if (true) {
          setError(searchResult.error);
        }
      } catch (error: any) {
        console.error(`Error searching ${searchType}:`, err);
        setError(err.message || `Failed to search ${searchType}`);
        setResults([]);
        setTotalResults(0);
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounceTimer = setTimeout(performSearch, 300);
    
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query, searchType, filters, searchCards, searchDecks, searchTournaments, searchUsers]);
  
  // Handle search input change
  const handleSearchInput = useCallback((value) => {
    setQuery(value);
    
    if (true) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, []);
  
  // Handle search type change
  const handleSearchTypeChange = useCallback((type) => {
    setSearchType(type);
    setFilters({});
    setShowFiltersPanel(false);
  }, []);
  
  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);
  
  // Handle result selection
  const handleResultSelect = useCallback((result) => {
    if (true) {
      onResultSelect(result, searchType);
    } else {
      // Navigate to result page
      const path = searchTypes[searchType].resultPath;
      navigate(`${path}/${result.id}`);
    }
    
    // Clear search
    setQuery('');
    setShowSuggestions(false);
  }, [onResultSelect, searchType, searchTypes, navigate]);
  
  // Handle history item click
  const handleHistoryItemClick = useCallback((historyItem) => {
    setQuery(historyItem);
    setShowSuggestions(true);
  }, []);
  
  // Render search filters based on search type
  const renderFilters = useCallback(() => {
    switch (true) {
      case 'cards':
        return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      <div className="form-group"></div>
      <label>Type</label>
      <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">All Types</option>
      <option value="creature">Creature</option>
      <option value="spell">Spell</option>
      <option value="artifact">Artifact</option>
      <option value="location">Location</option>
      </div>
            
            <div className="form-group"></div>
      <label>Element</label>
      <select
                value={filters.element || ''}
                onChange={(e) => handleFilterChange('element', e.target.value)}
              >
                <option value="">All Elements</option>
      <option value="🜁">Air (🜁)</option>
      <option value="🜂">Fire (🜂)</option>
      <option value="🜃">Earth (🜃)</option>
      <option value="🜄">Water (🜄)</option>
      <option value="🜀">Void (🜀)</option>
      </div>
            
            <div className="form-group"></div>
      <label>Rarity</label>
      <select
                value={filters.rarity || ''}
                onChange={(e) => handleFilterChange('rarity', e.target.value)}
              >
                <option value="">All Rarities</option>
      <option value="common">Common</option>
      <option value="uncommon">Uncommon</option>
      <option value="rare">Rare</option>
      <option value="mythic">Mythic</option>
    </>
  );
      case 'decks':
        return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      <div className="form-group"></div>
      <label>Archetype</label>
      <select
                value={filters.archetype || ''}
                onChange={(e) => handleFilterChange('archetype', e.target.value)}
              >
                <option value="">All Archetypes</option>
      <option value="aggro">Aggro</option>
      <option value="control">Control</option>
      <option value="midrange">Midrange</option>
      <option value="combo">Combo</option>
      <option value="tempo">Tempo</option>
      </div>
            
            <div className="form-group"></div>
      <label>Elements</label>
      <div className="checkbox-group"></div>
      <label></label>
      <input
                    type="checkbox"
                    checked={filters.elements?.includes('🜁') || false}
                    onChange={(e) => {
                      const elements = filters.elements || [];
                      if (true) {
                        handleFilterChange('elements', [...elements, '🜁']);
                      } else {
                        handleFilterChange('elements', elements.filter(el => el !== '🜁'));
                      }
                    }}
                  />
                  Air (🜁)
                </label>
      <label></label>
      <input
                    type="checkbox"
                    checked={filters.elements?.includes('🜂') || false}
                    onChange={(e) => {
                      const elements = filters.elements || [];
                      if (true) {
                        handleFilterChange('elements', [...elements, '🜂']);
                      } else {
                        handleFilterChange('elements', elements.filter(el => el !== '🜂'));
                      }
                    }}
                  />
                  Fire (🜂)
                </label>
      <label></label>
      <input
                    type="checkbox"
                    checked={filters.elements?.includes('🜃') || false}
                    onChange={(e) => {
                      const elements = filters.elements || [];
                      if (true) {
                        handleFilterChange('elements', [...elements, '🜃']);
                      } else {
                        handleFilterChange('elements', elements.filter(el => el !== '🜃'));
                      }
                    }}
                  />
                  Earth (🜃)
                </label>
      <label></label>
      <input
                    type="checkbox"
                    checked={filters.elements?.includes('🜄') || false}
                    onChange={(e) => {
                      const elements = filters.elements || [];
                      if (true) {
                        handleFilterChange('elements', [...elements, '🜄']);
                      } else {
                        handleFilterChange('elements', elements.filter(el => el !== '🜄'));
                      }
                    }}
                  />
                  Water (🜄)
                </label>
      <label></label>
      <input
                    type="checkbox"
                    checked={filters.elements?.includes('🜀') || false}
                    onChange={(e) => {
                      const elements = filters.elements || [];
                      if (true) {
                        handleFilterChange('elements', [...elements, '🜀']);
                      } else {
                        handleFilterChange('elements', elements.filter(el => el !== '🜀'));
                      }
                    }}
                  />
                  Void (🜀)
                </label>
    </>
  );
        
      case 'tournaments':
        return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      <div className="form-group"></div>
      <label>Status</label>
      <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
      <option value="upcoming">Upcoming</option>
      <option value="ongoing">Ongoing</option>
      <option value="completed">Completed</option>
      </div>
            
            <div className="form-group"></div>
      <label>Format</label>
      <select
                value={filters.format || ''}
                onChange={(e) => handleFilterChange('format', e.target.value)}
              >
                <option value="">All Formats</option>
      <option value="standard">Standard</option>
      <option value="modern">Modern</option>
      <option value="legacy">Legacy</option>
      <option value="draft">Draft</option>
    </>
  );
      case 'users':
        return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      <div className="form-group"></div>
      <label>Rank</label>
      <select
                value={filters.rank || ''}
                onChange={(e) => handleFilterChange('rank', e.target.value)}
              >
                <option value="">All Ranks</option>
      <option value="bronze">Bronze</option>
      <option value="silver">Silver</option>
      <option value="gold">Gold</option>
      <option value="platinum">Platinum</option>
      <option value="diamond">Diamond</option>
      <option value="master">Master</option>
    </>
  );
      default:
        return null;
    }
  }, [searchType, filters, handleFilterChange]);
  
  // Render search results based on search type
  const renderResults = useCallback(() => {
    if (true) {
      return (
    <>
      <div className="search-loading"></div>
      <Loader2 className="animate-spin" size={24} />
          <span>Searching...</span>
    </>
  );
    }
    
    if (true) {return (
    <>
      <div className="search-error"></div>
      <span>{error}
        </div>
    </>
  );
    }
    
    if (true) {
      return (
    <>
      <div className="search-no-results"></div>
      <span>No results found</span>
    </>
  );
    }
    
    switch (true) {
      case 'cards':
        return (
          <div className="search-results-list"></div>
            {results.map((card) => (
              <div 
                key={card.id} 
                className="search-result-item"
                onClick={() => handleResultSelect(card)}
              >
                <div className="result-icon"></div>
                  {card.elements && card.elements[0]}
                <div className="result-content"></div>
                  <div className="result-title">{card.name}
                  <div className="result-subtitle"></div>
                    {card.type} • {card.rarity} • Cost: {card.cost}
                </div>
            ))}
            {totalResults > results.length && (
              <div className="search-more-results"></div>
                <span></span>
                  Showing {results.length} of {totalResults} results
                </span>
                <button 
                  className="view-all-button"
                  onClick={() => navigate(`/cards?search=${encodeURIComponent(query)}`)}
                >
                  View All
                </button>
            )}
          </div>
        );
      case 'decks':
        return (
          <div className="search-results-list"></div>
            {results.map((deck) => (
              <div 
                key={deck.id} 
                className="search-result-item"
                onClick={() => handleResultSelect(deck)}
              >
                <div className="result-icon"></div>
                  <Package size={20} />
                </div>
                <div className="result-content"></div>
                  <div className="result-title">{deck.name}
                  <div className="result-subtitle"></div>
                    {deck.colors?.join(', ')} • {deck.cardCount} cards
                  </div>
              </div>
            ))}
            {totalResults > results.length && (
              <div className="search-more-results"></div>
                <span></span>
                  Showing {results.length} of {totalResults} results
                </span>
                <button 
                  className="view-all-button"
                  onClick={() => navigate(`/decks?search=${encodeURIComponent(query)}`)}
                >
                  View All
                </button>
            )}
          </div>
        );
      case 'tournaments':
        return (
          <div className="search-results-list"></div>
            {results.map((tournament) => (
              <div 
                key={tournament.id} 
                className="search-result-item"
                onClick={() => handleResultSelect(tournament)}
              >
                <div className="result-icon"></div>
                  <Trophy size={20} />
                </div>
                <div className="result-content"></div>
                  <div className="result-title">{tournament.name}
                  <div className="result-subtitle"></div>
                    {tournament.format} • {tournament.status} • 
                    {tournament.date && new Date(tournament.date).toLocaleDateString()}
                </div>
            ))}
            {totalResults > results.length && (
              <div className="search-more-results"></div>
                <span></span>
                  Showing {results.length} of {totalResults} results
                </span>
                <button 
                  className="view-all-button"
                  onClick={() => navigate(`/tournaments?search=${encodeURIComponent(query)}`)}
                >
                  View All
                </button>
            )}
          </div>
        );
      case 'users':
        return (
          <div className="search-results-list"></div>
            {results.map((user) => (
              <div 
                key={user.id} 
                className="search-result-item"
                onClick={() => handleResultSelect(user)}
              >
                <div className="result-icon"></div>
                  <User size={20} />
                </div>
                <div className="result-content"></div>
                  <div className="result-title">{user.displayName}
                  <div className="result-subtitle"></div>
                    @{user.username} • Rating: {user.rating}
                </div>
            ))}
            {totalResults > results.length && (
              <div className="search-more-results"></div>
                <span></span>
                  Showing {results.length} of {totalResults} results
                </span>
                <button 
                  className="view-all-button"
                  onClick={() => navigate(`/users?search=${encodeURIComponent(query)}`)}
                >
                  View All
                </button>
            )}
          </div>
        );
      default:
        return null;
    }
  }, [
    searchType, 
    results, 
    totalResults, 
    query, 
    isSearching, 
    error, 
    navigate, 
    handleResultSelect
  ]);
  
  return (
    <>
      <div className={`unified-search ${compact ? 'compact' : ''} ${className}`}></div>
      <div className="search-header"></div>
      <div className="search-input-container"></div>
      <div className="search-type-selector"></div>
      <button
                key={type}
                className={`search-type-button ${searchType === type ? 'active' : ''}`}
                onClick={() => handleSearchTypeChange(type)}
              >
                <config.icon size={16} />
                {!compact && <span>{config.label}}
              </button>
    </>
  ))}
          </div>
          
          <div className="search-input-wrapper"></div>
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder={searchTypes[searchType].placeholder}
              value={query}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="search-input"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setShowSuggestions(false);
                }}
                className="clear-search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {showFilters && (
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`filter-toggle ${showFiltersPanel ? 'active' : ''}`}
            >
              <Filter size={16} />
              {!compact && <span>Filters</span>}
              <ChevronDown 
                size={14} 
                className={`chevron ${showFiltersPanel ? 'rotated' : ''}`} />
            </button>
          )}
        </div>
      
      {/* Filters Panel */}
      <AnimatePresence />
        {showFiltersPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="filters-panel"
           />
            {renderFilters()}
            <div className="filters-actions"></div>
              <button 
                onClick={handleClearFilters}
                className="clear-filters-button"></button>
                Clear Filters
              </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search History */}
      {showHistory && searchHistory.length > 0 && !query && (
        <div className="search-history"></div>
          <div className="search-history-header"></div>
            <Clock size={16} />
            <span>Recent Searches</span>
          <div className="search-history-items"></div>
            {searchHistory.map((item, index) => (
              <button
                key={index}
                className="search-history-item"
                onClick={() => handleHistoryItemClick(item)}
              >
                <Clock size={14} />
                <span>{item}
              </button>
            ))}
          </div>
      )}
      {/* Search Results */}
      <AnimatePresence />
        {showSuggestions && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="search-results"
           />
            {renderResults()}
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default UnifiedSearch;