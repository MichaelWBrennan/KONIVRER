/**
 * KONIVRER Card Search Page
 * 
 * A comprehensive card search interface with advanced filtering,
 * multiple view modes, and responsive design.
 * 
 * @version 3.0.0
 * @since 2024-07-06
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  History, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  AlertCircle, 
  Star,
  Zap,
  Users,
  Settings,
  ArrowUpDown,
  Eye,
  Heart,
  Share2
  } from 'lucide-react';

// Import types and data
import { Card } from '../types/card';
import cardsData from '../data/cards.json';

// Filter and search types
type FilterType = 'type' | 'element' | 'keyword' | 'rarity' | 'set' | 'artist';
type SortOption = 'name' | 'type' | 'rarity' | 'set' | 'cost';
type ViewMode = 'grid' | 'list' | 'compact';

interface Filter {
  type: FilterType;
  value: string | string[
    }

interface SearchCriteria {
  query: string;
  filters: Filter[
  ];
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  viewMode: ViewMode;
  currentPage: number;
  resultsPerPage: number
  
}

const CardSearch: React.FC = () => {
    // Search state
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    query: '',
    filters: [
    ,
    sortBy: 'name',
    sortOrder: 'asc',
    viewMode: 'grid',
    currentPage: 1,
    resultsPerPage: 24
  
  });

  // UI state
  const [showAdvancedFilters, setShowAdvancedFilters
  ] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<Card[
    >([
  ]);
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Card[
    >([
  ]);
  const [totalResults, setTotalResults] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[
    >([
  ]);
  const [showHistory, setShowHistory] = useState(false)

  // Get filter options from data
  const filterOptions = useMemo(() => {
    const cards = cardsData as Card[
    ;
    return {
    types: [...new Set(cards.map(card => card.type))
  ].filter(Boolean),
      elements: [...new Set(cards.flatMap(card => card.elements || [
    ))
  ].filter(Boolean),
      keywords: [...new Set(cards.flatMap(card => card.keywords || [
    ))
  ].filter(Boolean),
      rarities: [...new Set(cards.map(card => card.rarity))].filter(Boolean),
      sets: [...new Set(cards.map(card => card.set))].filter(Boolean),
      artists: [...new Set(cards.map(card => card.artist))].filter(Boolean)
  
  };
  }, [
    );

  // Search function
  const performSearch = useCallback((criteria: SearchCriteria) => {
    setIsSearching() {
    try {
  }
      const cards = cardsData as Card[
  ];
      let results = cards;

      // Apply text search
      if (criteria.query.trim()) {
    const query = criteria.query.toLowerCase() {
    results = results.filter(card => 
          card.name? .toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query) ||
          card.type?.toLowerCase().includes(query) ||
          card.keywords?.some(keyword => keyword.toLowerCase().includes(query)) ||
          card.elements?.some(element => element.toLowerCase().includes(query))
        )
  
  }

      // Apply filters
      criteria.filters.forEach(filter => {
    results = results.filter(card => {
    switch (filter.type) { : null
            case 'type':
              return Array.isArray(filter.value) 
                ? filter.value.includes(): card.type === filter.value { return null; 
  }
            case 'element':
              return Array.isArray(filter.value)
                ? filter.value.some(element => card.elements?.includes(element)) : null
                : card.elements? .includes() {
    : null
            case 'keyword':
              return Array.isArray(filter.value)
                ? filter.value.some(keyword => card.keywords?.includes(keyword)) : null
                : card.keywords? .includes() {
  } : null
            case 'rarity':
              return Array.isArray(filter.value)
                ? filter.value.includes(): card.rarity === filter.value { return null; }
            case 'set':
              return Array.isArray(filter.value)
                ? filter.value.includes(): card.set === filter.value { return null; }
            case 'artist':
              return Array.isArray(filter.value)
                ? filter.value.includes(): card.artist === filter.value { return null; }
            default:
              return true
          }
        })
      });

      // Apply sorting
      results.sort((a, b) => {
    let aValue: any, bValue: any;
        
        switch (criteria.sortBy) {
    case 'name':
            aValue = a.name || '';
            bValue = b.name || '';
            break;
          case 'type':
            aValue = a.type || '';
            bValue = b.type || '';
            break;
          case 'rarity':
            aValue = a.rarity || '';
            bValue = b.rarity || '';
            break;
          case 'set':
            aValue = a.set || '';
            bValue = b.set || '';
            break;
          case 'cost':
            aValue = a.cost? .length || 0;
            bValue = b.cost?.length || 0;
            break; : null
          default:
            aValue = a.name || '';
            bValue = b.name || ''
  
  }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
    return criteria.sortOrder === 'asc' 
            ? aValue.localeCompare(): bValue.localeCompare(aValue)
  }
        
        return criteria.sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }) { return null; }

      setTotalResults(() => {
    // Apply pagination
      const startIndex = (criteria.currentPage - 1) * criteria.resultsPerPage;
      const paginatedResults = results.slice() {
    setSearchResults(paginatedResults)
  }) catch (error) {
    console.error(() => {
    setSearchResults() {
    setTotalResults(0)
  
  }) finally {
    setIsSearching(false)
  }
  }, [
    );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchCriteria(prev => ({ ...prev, query: value, currentPage: 1 
  }));
    
    // Generate suggestions
    if (value.trim()) {
    const cards = cardsData as Card[
  ];
      const matchingSuggestions = cards
        .filter(card => card.name? .toLowerCase().includes(value.toLowerCase()))
        .slice(() => {
    setSuggestions() {
    setShowSuggestions(true)
  
  }) else {
    setSuggestions() {
    setShowSuggestions(false)
  
  }
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchCriteria.query.trim()) {
    // Add to history
      setSearchHistory(prev => {
    const newHistory = [searchCriteria.query, ...prev.filter(item => item !== searchCriteria.query)];
        return newHistory.slice() {
  
  } // Keep only last 10 searches
      })
    }
    
    setShowSuggestions(() => {
    setShowHistory() {
    performSearch(searchCriteria)
  });

  // Handle filter changes : null
  const addFilter = (type: FilterType, value: string) => {
    setSearchCriteria(prev => ({
    ...prev,
      filters: [...prev.filters, { type, value 
  }],
      currentPage: 1
    }))
  };

  const removeFilter = (index: number) => {
    setSearchCriteria(prev => ({
    ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
      currentPage: 1
  
  }))
  };

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setSearchCriteria(prev => ({ ...prev, viewMode: mode 
  }))
  };

  // Handle sort change
  const handleSortChange = (sortBy: SortOption) => {
    setSearchCriteria(prev => ({
    ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      currentPage: 1
  
  }))
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setSearchCriteria(prev => ({ ...prev, currentPage: page 
  }))
  };

  // Perform initial search
  useEffect(() => {
    performSearch(searchCriteria)
  }, [searchCriteria.filters, searchCriteria.sortBy, searchCriteria.sortOrder, searchCriteria.currentPage, performSearch]);

  // Calculate pagination
  const totalPages = Math.ceil() {
    return (
    <motion.div
      initial={{ opacity: 0, y: 20 
  }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
     />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" /></div>
        {/* Header */}
        <div className="text-center mb-8" />
    <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
           />
    <Search className="w-10 h-10 text-white"  / /></Search>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4" /></h1>
            KONIVRER Card Database
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" /></p>
            Search through the complete collection of KONIVRER cards with advanced filtering and sorting options.
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8" /></div>
          {/* Search Input */}
          <div className="relative mb-6" />
    <div className="relative" />
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"  / />
    <input
                type="text"
                value={searchCriteria.query}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search cards by name, text, type, or keywords..."
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
              {searchCriteria.query && (
                <button
                  onClick={() => {
    setSearchCriteria(prev => ({ ...prev, query: '' 
  }));
                    setSuggestions() {
    setShowSuggestions(false)
  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5"  / /></X>
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            <AnimatePresence /></AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 mt-2"
                 /></motion>
                  {suggestions.map((card, index) => (
                    <button
                      key={card.id}
                      onClick={() => {
    setSearchCriteria(prev => ({ ...prev, query: card.name 
  }));
                        setShowSuggestions() {
    handleSearch()
  }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{card.name}</div>
                      <div className="text-sm text-gray-500">{card.type} • {card.set}</div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search History */}
            <AnimatePresence /></AnimatePresence>
              {showHistory && searchHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 mt-2"
                 />
    <div className="px-4 py-2 border-b border-gray-100 text-sm font-medium text-gray-700" /></div>
                    Recent Searches
                  </div>
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
    setSearchCriteria(prev => ({ ...prev, query: item 
  }));
                        setShowHistory() {
    handleSearch()
  }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 last:rounded-b-xl"
                    >
                      <div className="flex items-center" />
    <History className="w-4 h-4 text-gray-400 mr-2"  / />
    <span className="text-gray-700">{item}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6" />
    <div className="flex items-center gap-4" />
    <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
               /></button>
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin"  / /></Loader2> : null
                ) : (
                  <Search className="w-4 h-4"  / /></Search>
                )}
                Search
              </button>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Filter className="w-4 h-4"  / /></Filter>
                Filters
                {showAdvancedFilters ? <ChevronUp className="w-4 h-4"  /> : <ChevronDown className="w-4 h-4"  />}
              </button>

              {searchHistory.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <History className="w-4 h-4"  / /></History>
                  History
                </button>
              )}
            </div>

            <div className="flex items-center gap-2" />
    <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
    searchCriteria.viewMode === 'grid' `
                    ? 'bg-blue-100 text-blue-600' ` : null`
                    : 'text-gray-400 hover:text-gray-600'```
  }`}
              >
                <Grid className="w-5 h-5"  / /></Grid>
              </button>`
              <button``
                onClick={() => handleViewModeChange('list')}```
                className={`p-2 rounded-lg transition-colors duration-200 ${
    searchCriteria.viewMode === 'list' `
                    ? 'bg-blue-100 text-blue-600' ` : null`
                    : 'text-gray-400 hover:text-gray-600'```
  }`}
              >
                <List className="w-5 h-5"  / /></List>
              </button>`
              <button``
                onClick={() => handleViewModeChange('compact')}```
                className={`p-2 rounded-lg transition-colors duration-200 ${
    searchCriteria.viewMode === 'compact' `
                    ? 'bg-blue-100 text-blue-600' ` : null`
                    : 'text-gray-400 hover:text-gray-600'```
  }`}
              >
                <Eye className="w-5 h-5"  / /></Eye>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence /></AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 pt-6"
               />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" /></div>
                  {/* Type Filter */}
                  <div />
    <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                    <select
                      onChange={(e) => e.target.value && addFilter('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select type...</option>
                      {filterOptions.types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Element Filter */}
                  <div />
    <label className="block text-sm font-medium text-gray-700 mb-2">Element</label>
                    <select
                      onChange={(e) => e.target.value && addFilter('element', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select element...</option>
                      {filterOptions.elements.map(element => (
                        <option key={element} value={element}>{element}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rarity Filter */}
                  <div />
    <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
                    <select
                      onChange={(e) => e.target.value && addFilter('rarity', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select rarity...</option>
                      {filterOptions.rarities.map(rarity => (
                        <option key={rarity} value={rarity}>{rarity}</option>
                      ))}
                    </select>
                  </div>

                  {/* Set Filter */}
                  <div />
    <label className="block text-sm font-medium text-gray-700 mb-2">Set</label>
                    <select
                      onChange={(e) => e.target.value && addFilter('set', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select set...</option>
                      {filterOptions.sets.map(set => (
                        <option key={set} value={set}>{set}</option>
                      ))}
                    </select>
                  </div>

                  {/* Keyword Filter */}
                  <div />
    <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                    <select
                      onChange={(e) => e.target.value && addFilter('keyword', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select keyword...</option>
                      {filterOptions.keywords.map(keyword => (
                        <option key={keyword} value={keyword}>{keyword}</option>
                      ))}
                    </select>
                  </div>

                  {/* Artist Filter */}
                  <div />
    <label className="block text-sm font-medium text-gray-700 mb-2">Artist</label>
                    <select
                      onChange={(e) => e.target.value && addFilter('artist', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select artist...</option>
                      {filterOptions.artists.map(artist => (
                        <option key={artist} value={artist}>{artist}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters */}
          {searchCriteria.filters.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200" />
    <div className="flex flex-wrap gap-2" />
    <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
                {searchCriteria.filters.map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                   /></span>
                    {filter.type}: {filter.value}
                    <button
                      onClick={() => removeFilter(index)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3"  / /></X>
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setSearchCriteria(prev => ({ ...prev, filters: [
    , currentPage: 1 }))}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6" /></div>
          {/* Results Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6" />
    <div className="flex items-center gap-4" />
    <h2 className="text-2xl font-bold text-gray-900" /></h2>
                Search Results
              </h2>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium" /></span>
                {totalResults} cards found
              </span>
            </div>

            <div className="flex items-center gap-4" />
    <div className="flex items-center gap-2" />
    <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={searchCriteria.sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="name">Name</option>
                  <option value="type">Type</option>
                  <option value="rarity">Rarity</option>
                  <option value="set">Set</option>
                  <option value="cost">Cost</option>
                </select>
                <button
                  onClick={() => setSearchCriteria(prev => ({
    ...prev,
                    sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
  }))}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <ArrowUpDown className="w-4 h-4"  / /></ArrowUpDown>
                </button>
              </div>

              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2" />
    <Download className="w-4 h-4"  / /></Download>
                Export
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isSearching && (
            <div className="flex items-center justify-center py-12" />
    <Loader2 className="w-8 h-8 animate-spin text-blue-600"  / />
    <span className="ml-2 text-gray-600">Searching cards...</span>
            </div>
          )}

          {/* No Results */}
          {!isSearching && totalResults === 0 && (
            <div className="text-center py-12" />
    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4"  / />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          )}

          {/* Results Grid */}
          {!isSearching && searchResults.length > 0 && (
            <any />`
    <motion.div``
                layout```
                className={`grid gap-6 ${
    searchCriteria.viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : searchCriteria.viewMode === 'list'`
                    ? 'grid-cols-1'` : null`
                    : 'grid-cols-1 sm:grid-cols-2'```
  }`}
               /></motion>
                {searchResults.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}`
                    animate={{ opacity: 1, y: 0 }}``
                    transition={{ delay: index * 0.05 }}``
                    className={null}`
                    }`}
                   /></motion>
                    {searchCriteria.viewMode === 'grid' ? (
                      // Grid View
                      <div className="text-center" />
    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center" />
    <div className="text-4xl font-bold text-blue-600" /></div>
                            {card.name.charAt(0)}
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{card.name}</h3>
                        <div className="space-y-1 text-sm text-gray-600" />
    <div className="flex items-center justify-center gap-2" />
    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs" /></span>
                              {card.type}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs" /></span>
                              {card.rarity}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">{card.set}</div>
                          {card.elements && card.elements.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1 mt-2" /></div>
                              {card.elements.slice(0, 3).map((element, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs" /></span>
                                  {element}
                                </span>
                              ))}
                              {card.elements.length > 3 && (
                                <span className="text-gray-500 text-xs">+{card.elements.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-4" /></div> : null
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" />
    <Heart className="w-4 h-4"  / /></Heart>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors" />
    <Share2 className="w-4 h-4"  / /></Share2>
                          </button>
                        </div>
                      </div>
                    ) : searchCriteria.viewMode === 'list' ? (
                      // List View
                      <div className="flex items-center gap-4" />
    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0" />
    <div className="text-xl font-bold text-blue-600" /></div>
                            {card.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0" />
    <h3 className="font-bold text-gray-900 truncate">{card.name}</h3>
                          <div className="flex items-center gap-2 mt-1" />
    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs" /></span>
                              {card.type}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs" /></span>
                              {card.rarity}
                            </span>
                            <span className="text-xs text-gray-500">{card.set}</span>
                          </div>
                          {card.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{card.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2" /></div> : null
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" />
    <Heart className="w-4 h-4"  / /></Heart>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors" />
    <Share2 className="w-4 h-4"  / /></Share2>
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Compact View
                      <div className="flex items-center gap-3" />
    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0" />
    <div className="text-lg font-bold text-blue-600" /></div>
                            {card.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0" />
    <h3 className="font-medium text-gray-900 truncate">{card.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500" />
    <span>{card.type}</span>
                            <span>•</span>
                            <span>{card.rarity}</span>
                            <span>•</span>
                            <span>{card.set}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8" />
    <button
                    onClick={() => handlePageChange(searchCriteria.currentPage - 1)}
                    disabled={searchCriteria.currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const page = i + 1;
                    return (
                      <button
                        key={page`
  }``
                        onClick={() => handlePageChange(page)}```
                        className={`px-4 py-2 rounded-lg font-medium ${
    searchCriteria.currentPage === page`
                            ? 'bg-blue-600 text-white'` : null`
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'```
  }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  
                  {totalPages > 5 && (
                    <any />
    <span className="px-2 text-gray-500">...</span>`
                      <button``
                        onClick={() => handlePageChange(totalPages)}```
                        className={`px-4 py-2 rounded-lg font-medium ${
    searchCriteria.currentPage === totalPages`
                            ? 'bg-blue-600 text-white'` : null`
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'```
  }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handlePageChange(searchCriteria.currentPage + 1)}
                    disabled={searchCriteria.currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6" />
    <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
           />
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4" />
    <Users className="w-6 h-6 text-blue-600"  / /></Users>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Cards</h3>
            <p className="text-3xl font-bold text-blue-600">{(cardsData as Card[
  ]).length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
           />
    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" />
    <Zap className="w-6 h-6 text-green-600"  / /></Zap>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sets Available</h3>
            <p className="text-3xl font-bold text-green-600">{filterOptions.sets.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
           />
    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4" />
    <Star className="w-6 h-6 text-purple-600"  / /></Star>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Types</h3>
            <p className="text-3xl font-bold text-purple-600">{filterOptions.types.length}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
};
`
export default CardSearch;``
```