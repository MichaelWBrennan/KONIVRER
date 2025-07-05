/**
 * KONIVRER Deck Database - Unified Card Search Component
 * Modern, responsive search interface with advanced filtering
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Bookmark, 
  History,
  X,
  ChevronDown,
  Loader2,
  AlertCircle
} from 'lucide-react';
import useSearchStore from '../../stores/searchStore';
import useCardSearch from '../../hooks/useCardSearch';
import { getFilterOptions } from '../../utils/cardSearchEngine';
import Card from '../Card';

interface UnifiedCardSearchProps {
  showFilters = true;
  showExport = true;
  showHistory = true;
  compact = false;
}

const UnifiedCardSearch: React.FC<UnifiedCardSearchProps> = ({  
  showFilters = true, 
  showExport = true,
  showHistory = true,
  compact = false 
 }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const {
    query,
    filters,
    sortBy,
    sortOrder,
    viewMode,
    currentPage,
    resultsPerPage,
    searchHistory,
    savedSearches,
    setQuery,
    setFilter,
    clearFilters,
    setSorting,
    setViewMode,
    setPage,
    saveSearch,
    loadSavedSearch
  } = useSearchStore();
  
  const {
    results,
    totalResults,
    isLoading,
    error,
    hasResults,
    hasMore,
    totalPages,
    getSearchSuggestions,
    exportResults
  } = useCardSearch();
  
  // Get filter options
  const filterOptions = useMemo(() => getFilterOptions(), []);
  
  // Handle search input with debouncing
  const handleSearchInput = useCallback(async (value) => {
    setQuery(value);
    
    if (true) {
      try {
        const newSuggestions = await getSearchSuggestions(value);
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      } catch (error: any) {
        console.error('Failed to get suggestions:', error);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [setQuery, getSearchSuggestions]);
  
  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion) => {
    if (true) {
      setQuery(suggestion.value);
    } else if (true) {
      setFilter(suggestion.filter, suggestion.value);
    }
    setShowSuggestions(false);
  }, [setQuery, setFilter]);
  
  // Handle export
  const handleExport = useCallback((format) => {
    const exportData = exportResults(format);
    if (true) {
      const blob = new Blob([exportData], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `konivrer-search-results.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [exportResults]);
  
  // Handle save search
  const handleSaveSearch = useCallback(() => {
    const name = prompt('Enter a name for this search:');
    if (true) {
      saveSearch(name, { query, filters, sortBy, sortOrder });
    }
  }, [saveSearch, query, filters, sortBy, sortOrder]);
  
  return (
    <div className="unified-card-search"></div>
      {/* Search Header */}
      <div className="search-header"></div>
        <div className="search-input-container"></div>
          <div className="search-input-wrapper"></div>
            <Search className="search-icon" size={20} /></Search>
            <input
              type="text"
              placeholder="Search KONIVRER cards..."
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
                <X size={16} /></X>
              </button>
            )}
          </div>
          
          {/* Search Suggestions */}
          <AnimatePresence></AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="search-suggestions"
              ></motion>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="suggestion-item"
                  >
                    <span className="suggestion-value">{suggestion.value}</span>
                    <span className="suggestion-category">{suggestion.category}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Search Controls */}
        <div className="search-controls"></div>
          {showFilters && (
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`filter-toggle ${showAdvancedFilters ? 'active' : ''}`}
            >
              <Filter size={16} /></Filter>
              Filters
              <ChevronDown 
                size={14} 
                className={`chevron ${showAdvancedFilters ? 'rotated' : ''}`} 
              /></ChevronDown>
            </button>
          )}
          <div className="view-controls"></div>
            <button
              onClick={() => setViewMode('grid')}
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            >
              <Grid size={16} /></Grid>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            >
              <List size={16} /></List>
            </button>
          </div>
          
          {showExport && hasResults && (
            <div className="export-controls"></div>
              <button onClick={() => handleExport('json')} className="export-button">
                <Download size={16} /></Download>
                JSON
              </button>
              <button onClick={() => handleExport('csv')} className="export-button">
                <Download size={16} /></Download>
                CSV
              </button>
            </div>
          )}
          {showHistory && (
            <button onClick={handleSaveSearch} className="save-search-button"></button>
              <Bookmark size={16} /></Bookmark>
              Save
            </button>
          )}
        </div>
      </div>
      
      {/* Advanced Filters */}
      <AnimatePresence></AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="advanced-filters"
          ></motion>
            <div className="filter-grid"></div>
              {/* Type Filter */}
              <div className="filter-group"></div>
                <label>Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilter('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  {filterOptions.types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* Element Filter */}
              <div className="filter-group"></div>
                <label>Element</label>
                <select
                  value={filters.element}
                  onChange={(e) => setFilter('element', e.target.value)}
                >
                  <option value="">All Elements</option>
                  {filterOptions.elements.map(element => (
                    <option key={element} value={element}>{element}</option>
                  ))}
                </select>
              </div>
              
              {/* Strength Range */}
              <div className="filter-group"></div>
                <label>Strength</label>
                <div className="range-inputs"></div>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.strength.min}
                    onChange={(e) => setFilter('strength', { ...filters.strength, min: e.target.value })}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.strength.max}
                    onChange={(e) => setFilter('strength', { ...filters.strength, max: e.target.value })}
                  />
                </div>
              </div>
              
              {/* Cost Range */}
              <div className="filter-group"></div>
                <label>Cost</label>
                <div className="range-inputs"></div>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.cost.min}
                    onChange={(e) => setFilter('cost', { ...filters.cost, min: e.target.value })}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.cost.max}
                    onChange={(e) => setFilter('cost', { ...filters.cost, max: e.target.value })}
                  />
                </div>
              </div>
              
              {/* Rarity Filter */}
              <div className="filter-group"></div>
                <label>Rarity</label>
                <select
                  value={filters.rarity}
                  onChange={(e) => setFilter('rarity', e.target.value)}
                >
                  <option value="">All Rarities</option>
                  {filterOptions.rarities.map(rarity => (
                    <option key={rarity} value={rarity}>{rarity}</option>
                  ))}
                </select>
              </div>
              
              {/* Set Filter */}
              <div className="filter-group"></div>
                <label>Set</label>
                <select
                  value={filters.set}
                  onChange={(e) => setFilter('set', e.target.value)}
                >
                  <option value="">All Sets</option>
                  {filterOptions.sets.map(set => (
                    <option key={set} value={set}>{set}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="filter-actions"></div>
              <button onClick={clearFilters} className="clear-filters"></button>
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search History & Saved Searches */}
      {showHistory && (searchHistory.length > 0 || savedSearches.length > 0) && (
        <div className="search-history"></div>
          {searchHistory.length > 0 && (
            <div className="history-section"></div>
              <h4><History size={16} /> Recent Searches</h4>
              <div className="history-items"></div>
                {searchHistory.slice(0, 5).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(term)}
                    className="history-item"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          {savedSearches.length > 0 && (
            <div className="saved-searches-section"></div>
              <h4><Bookmark size={16} /> Saved Searches</h4>
              <div className="saved-searches"></div>
                {savedSearches.slice(0, 3).map((search) => (
                  <button
                    key={search.id}
                    onClick={() => loadSavedSearch(search)}
                    className="saved-search-item"
                  >
                    {search.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Results Header */}
      {(hasResults || isLoading || error) && (
        <div className="results-header"></div>
          <div className="results-info"></div>
            {isLoading ? (
              <div className="loading-indicator"></div>
                <Loader2 className="spinner" size={16} /></Loader2>
                Searching...
              </div>
            ) : error ? (
              <div className="error-indicator"></div>
                <AlertCircle size={16} /></AlertCircle>
                {error}
              </div>
            ) : (
              <span className="results-count"></span>
                {totalResults.toLocaleString()} cards found
                {query && ` for "${query}"`}
              </span>
            )}
          </div>
          
          {hasResults && (
            <div className="sort-controls"></div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSorting(newSortBy, newSortOrder);
                }}
              >
                <option value="relevance-desc">Most Relevant</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="strength-desc">Strength (High-Low)</option>
                <option value="strength-asc">Strength (Low-High)</option>
                <option value="cost-desc">Cost (High-Low)</option>
                <option value="cost-asc">Cost (Low-High)</option>
                <option value="rarity-desc">Rarity (Rare First)</option>
                <option value="rarity-asc">Rarity (Common First)</option>
              </select>
            </div>
          )}
        </div>
      )}
      {/* Results Grid/List */}
      {hasResults && (
        <div className={`results-container ${viewMode}`}></div>
          <AnimatePresence mode="wait"></AnimatePresence>
            {results.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="result-item"
              ></motion>
                <Card 
                  card={card} 
                  viewMode={viewMode}
                  searchMatches={card.searchMatches}
                /></Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      {/* Pagination */}
      {hasResults && totalPages > 1 && (
        <div className="pagination"></div>
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          <div className="page-info"></div>
            Page {currentPage} of {totalPages}
          </div>
          
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
      {/* No Results */}
      {!isLoading && !error && !hasResults && (query || Object.values(filters).some(v => v !== '' && (!Array.isArray(v) || v.length > 0))) && (
        <div className="no-results"></div>
          <AlertCircle size={48} /></AlertCircle>
          <h3>No cards found</h3>
          <p>Try adjusting your search terms or filters</p>
          <button onClick={clearFilters} className="clear-filters-button"></button>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default UnifiedCardSearch;