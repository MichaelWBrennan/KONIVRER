import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Unified Card Search Component
 * 
 * A unified card search component that combines functionality from:
 * - AdvancedCardSearch
 * - AdvancedSearch
 * - CardSearchBar
 * - UnifiedCardSearch
 * 
 * Features:
 * - Basic and advanced search options
 * - Responsive design
 * - Multiple view modes
 * - Search history
 * - Export functionality
 * - Comprehensive filtering
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Import components
import UnifiedCard from './UnifiedCard';

// Import data and utilities
import cardsData from '../data/cards.json';
import { getFilterOptions } from '../utils/cardSearchEngine';
import useCardSearch from '../hooks/useCardSearch';
import useSearchStore from '../stores/searchStore';

// Import icons
import { Search, Filter, Grid, List, Download, History, X, ChevronDown, ChevronUp, Loader2, AlertCircle, Type, Palette, Calendar, Star, Trash, RefreshCw, ArrowUpDown, ArrowDown, ArrowUp, FileText } from 'lucide-react';

// Define filter types
type FilterType = 'type' | 'element' | 'keyword' | 'rarity' | 'set' | 'artist' | 'power' | 'toughness' | 'cost';
type SortOption = 'name' | 'type' | 'element' | 'rarity' | 'set' | 'power' | 'toughness' | 'cost' | 'releaseDate';
type ViewMode = 'grid' | 'list' | 'compact' | 'detailed';
type ComparisonType = 'including' | 'exactly' | 'at-most' | 'at-least' | 'equal' | 'less-than' | 'greater-than';

// Define filter interfaces
interface Filter {
  type: FilterType;
  value: string | number | string[] | number[];
  comparison?: ComparisonType;
}

interface SearchCriteria {
  query: string;
  filters: Filter[];
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  viewMode: ViewMode;
  currentPage: number;
  resultsPerPage: number;
}

interface UnifiedCardSearchProps {
  variant?: 'standard' | 'advanced' | 'simple' | 'mobile';
  showFilters?: boolean;
  showExport?: boolean;
  showHistory?: boolean;
  initialQuery?: string;
  initialFilters?: Filter[];
  onSearch?: (results: any[], criteria: SearchCriteria) => void;
  onCardSelect?: (card: any) => void;
  onClose?: () => void;
  className?: string;
}

const UnifiedCardSearch: React.FC<UnifiedCardSearchProps> = ({
  variant = 'standard',
  showFilters = true,
  showExport = true,
  showHistory = true,
  initialQuery = '',
  initialFilters = [],
  onSearch,
  onCardSelect,
  onClose,
  className = ''
}) => {
  // Detect if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const actualVariant = variant === 'standard' && isMobile ? 'mobile' : variant;
  
  // Navigation and location
  const navigate = useNavigate();
  const location = useLocation();
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // State from search store (if available)
  const searchStore = typeof useSearchStore === 'function' ? useSearchStore() : null;
  
  // Local state (used if store is not available)
  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [localFilters, setLocalFilters] = useState<Filter[]>(initialFilters);
  const [localSortBy, setLocalSortBy] = useState<SortOption>('name');
  const [localSortOrder, setLocalSortOrder] = useState<'asc' | 'desc'>('asc');
  const [localViewMode, setLocalViewMode] = useState<ViewMode>('grid');
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [localResultsPerPage, setLocalResultsPerPage] = useState(24);
  
  // UI state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFilterType, setSelectedFilterType] = useState<FilterType | null>(null);
  
  // Get actual state values (from store or local state)
  const query = searchStore?.query ?? localQuery;
  const filters = searchStore?.filters ?? localFilters;
  const sortBy = searchStore?.sortBy ?? localSortBy;
  const sortOrder = searchStore?.sortOrder ?? localSortOrder;
  const viewMode = searchStore?.viewMode ?? localViewMode;
  const currentPage = searchStore?.currentPage ?? localCurrentPage;
  const resultsPerPage = searchStore?.resultsPerPage ?? localResultsPerPage;
  
  // Search results
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  
  // Filter options
  const filterOptions = useMemo(() => {
    return typeof getFilterOptions === 'function' 
      ? getFilterOptions() 
      : {
          types: ['Familiar', 'Spell', 'Flag', 'Azoth'],
          elements: ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark', 'Generic'],
          keywords: ['Haste', 'Shield', 'Flying', 'Stealth', 'Regenerate', 'Drain'],
          rarities: ['Common', 'Uncommon', 'Rare', 'Mythic', 'Legendary'],
          sets: ['Core Set', 'Elemental Convergence', 'Mystic Horizons', 'Eternal Conflict']
        };
  }, []);
  
  // Use the search hook if available
  const searchHook = typeof useCardSearch === 'function' ? useCardSearch() : null;
  
  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q');
    
    if (queryParam) {
      // Update query from URL
      if (searchStore) {
        searchStore.setQuery(queryParam);
      } else {
        setLocalQuery(queryParam);
      }
      
      // Perform search
      handleSearch(queryParam);
    }
  }, [location.search]);
  
  // Update URL when search criteria changes
  useEffect(() => {
    // Only update URL if we're not in a modal
    if (onClose) return;
    
    const params = new URLSearchParams();
    
    if (query) {
      params.set('q', query);
    }
    
    // Add filters to URL
    filters.forEach((filter, index) => {
      if (typeof filter.value === 'string' || typeof filter.value === 'number') {
        params.set(`filter_${filter.type}`, String(filter.value));
      } else if (Array.isArray(filter.value)) {
        filter.value.forEach(val => {
          params.append(`filter_${filter.type}`, String(val));
        });
      }
      
      if (filter.comparison) {
        params.set(`filter_${filter.type}_comp`, filter.comparison);
      }
    });
    
    // Add sort and pagination
    params.set('sort', sortBy);
    params.set('order', sortOrder);
    params.set('page', String(currentPage));
    params.set('per_page', String(resultsPerPage));
    
    // Update URL without triggering navigation
    const newUrl = `${location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [query, filters, sortBy, sortOrder, currentPage, resultsPerPage, onClose]);
  
  // Handle search
  const handleSearch = useCallback((searchQuery: string = query, searchFilters: Filter[] = filters) => {
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // Use search hook if available
      if (searchHook) {
        const results = searchHook.search(searchQuery, searchFilters, sortBy, sortOrder);
        setSearchResults(results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage));
        setTotalResults(results.length);
        
        // Call onSearch callback if provided
        if (onSearch) {
          onSearch(results, {
            query: searchQuery,
            filters: searchFilters,
            sortBy,
            sortOrder,
            viewMode,
            currentPage,
            resultsPerPage
          });
        }
      } else {
        // Fallback to basic search implementation
        const results = cardsData.filter(card => {
          // Basic text search
          const matchesQuery = searchQuery 
            ? (card.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
               card.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               card.type?.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;
          
          // Filter matching
          const matchesFilters = searchFilters.length > 0
            ? searchFilters.every(filter => {
                switch (filter.type) {
                  case 'type':
                    return Array.isArray(filter.value)
                      ? filter.value.some(type => card.type === type)
                      : card.type === filter.value;
                  case 'element':
                    return Array.isArray(filter.value)
                      ? filter.value.some(element => card.elements && card.elements[element] > 0)
                      : card.elements && card.elements[filter.value as string] > 0;
                  case 'keyword':
                    return Array.isArray(filter.value)
                      ? filter.value.some(keyword => card.keywords && card.keywords.includes(keyword))
                      : card.keywords && card.keywords.includes(filter.value);
                  case 'rarity':
                    return Array.isArray(filter.value)
                      ? filter.value.includes(card.rarity)
                      : card.rarity === filter.value;
                  case 'set':
                    return Array.isArray(filter.value)
                      ? filter.value.includes(card.set)
                      : card.set === filter.value;
                  case 'artist':
                    return card.artist === filter.value;
                  case 'power':
                    if (card.type !== 'Familiar') return false;
                    
                    if (filter.comparison === 'equal') {
                      return card.strength === filter.value;
                    } else if (filter.comparison === 'less-than') {
                      return card.strength < filter.value;
                    } else if (filter.comparison === 'greater-than') {
                      return card.strength > filter.value;
                    }
                    return true;
                  case 'toughness':
                    if (card.type !== 'Familiar') return false;
                    
                    if (filter.comparison === 'equal') {
                      return card.health === filter.value;
                    } else if (filter.comparison === 'less-than') {
                      return card.health < filter.value;
                    } else if (filter.comparison === 'greater-than') {
                      return card.health > filter.value;
                    }
                    return true;
                  case 'cost':
                    if (!card.elements) return false;
                    
                    const totalCost = Object.values(card.elements).reduce((sum, val) => sum + (val as number), 0);
                    
                    if (filter.comparison === 'equal') {
                      return totalCost === filter.value;
                    } else if (filter.comparison === 'less-than') {
                      return totalCost < filter.value;
                    } else if (filter.comparison === 'greater-than') {
                      return totalCost > filter.value;
                    }
                    return true;
                  default:
                    return true;
                }
              })
            : true;
          
          return matchesQuery && matchesFilters;
        });
        
        // Sort results
        const sortedResults = [...results].sort((a, b) => {
          let valueA, valueB;
          
          switch (sortBy) {
            case 'name':
              valueA = a.name || '';
              valueB = b.name || '';
              break;
            case 'type':
              valueA = a.type || '';
              valueB = b.type || '';
              break;
            case 'rarity':
              // Sort by rarity order
              const rarityOrder = { Common: 0, Uncommon: 1, Rare: 2, Mythic: 3, Legendary: 4 };
              valueA = rarityOrder[a.rarity] || 0;
              valueB = rarityOrder[b.rarity] || 0;
              break;
            case 'power':
              valueA = a.type === 'Familiar' ? a.strength : -1;
              valueB = b.type === 'Familiar' ? b.strength : -1;
              break;
            case 'toughness':
              valueA = a.type === 'Familiar' ? a.health : -1;
              valueB = b.type === 'Familiar' ? b.health : -1;
              break;
            case 'cost':
              valueA = a.elements ? Object.values(a.elements).reduce((sum, val) => sum + (val as number), 0) : 0;
              valueB = b.elements ? Object.values(b.elements).reduce((sum, val) => sum + (val as number), 0) : 0;
              break;
            case 'releaseDate':
              valueA = a.releaseDate || '';
              valueB = b.releaseDate || '';
              break;
            default:
              valueA = a.name || '';
              valueB = b.name || '';
          }
          
          // Apply sort order
          if (sortOrder === 'asc') {
            return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
          } else {
            return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
          }
        });
        
        setSearchResults(sortedResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage));
        setTotalResults(sortedResults.length);
        
        // Call onSearch callback if provided
        if (onSearch) {
          onSearch(sortedResults, {
            query: searchQuery,
            filters: searchFilters,
            sortBy,
            sortOrder,
            viewMode,
            currentPage,
            resultsPerPage
          });
        }
      }
      
      // Add to search history if not already present
      if (searchQuery && !searchHistory.includes(searchQuery)) {
        setSearchHistory(prev => [searchQuery, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred while searching. Please try again.');
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
      setShowSuggestions(false);
    }
  }, [query, filters, sortBy, sortOrder, currentPage, resultsPerPage, viewMode, searchHook, onSearch, searchHistory]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update query
    if (searchStore) {
      searchStore.setQuery(value);
    } else {
      setLocalQuery(value);
    }
    
    // Show suggestions if value is not empty
    if (value.trim()) {
      // Generate suggestions
      const matchingSuggestions = cardsData
        .filter(card => {
          const cardName = (card.name || '').toLowerCase();
          const cardText = (card.text || '').toLowerCase();
          const cardType = (card.type || '').toLowerCase();
          const searchLower = value.toLowerCase();
          
          return cardName.includes(searchLower) || 
                 cardText.includes(searchLower) || 
                 cardType.includes(searchLower);
        })
        .slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(matchingSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    // Update query
    if (searchStore) {
      searchStore.setQuery(suggestion.name);
    } else {
      setLocalQuery(suggestion.name);
    }
    
    // Hide suggestions
    setShowSuggestions(false);
    
    // Perform search
    handleSearch(suggestion.name);
    
    // Select card if callback provided
    if (onCardSelect) {
      onCardSelect(suggestion);
    }
  };
  
  // Handle history item click
  const handleHistoryClick = (historyItem: string) => {
    // Update query
    if (searchStore) {
      searchStore.setQuery(historyItem);
    } else {
      setLocalQuery(historyItem);
    }
    
    // Hide history
    setShowHistory(false);
    
    // Perform search
    handleSearch(historyItem);
  };
  
  // Handle clear history
  const handleClearHistory = () => {
    setSearchHistory([]);
    setShowHistory(false);
  };
  
  // Handle add filter
  const handleAddFilter = (type: FilterType, value: string | number | string[] | number[], comparison?: ComparisonType) => {
    const newFilter: Filter = { type, value, comparison };
    
    // Add filter
    if (searchStore) {
      searchStore.addFilter(newFilter);
    } else {
      setLocalFilters(prev => [...prev, newFilter]);
    }
    
    // Reset selected filter type
    setSelectedFilterType(null);
    
    // Perform search with new filter
    handleSearch(query, [...filters, newFilter]);
  };
  
  // Handle remove filter
  const handleRemoveFilter = (index: number) => {
    // Remove filter
    if (searchStore) {
      searchStore.removeFilter(index);
    } else {
      setLocalFilters(prev => prev.filter((_, i) => i !== index));
    }
    
    // Perform search with updated filters
    const updatedFilters = filters.filter((_, i) => i !== index);
    handleSearch(query, updatedFilters);
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    // Clear filters
    if (searchStore) {
      searchStore.clearFilters();
    } else {
      setLocalFilters([]);
    }
    
    // Perform search with no filters
    handleSearch(query, []);
  };
  
  // Handle sort change
  const handleSortChange = (newSortBy: SortOption) => {
    // If clicking the same sort option, toggle order
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    
    // Update sort
    if (searchStore) {
      searchStore.setSort(newSortBy, newSortOrder);
    } else {
      setLocalSortBy(newSortBy);
      setLocalSortOrder(newSortOrder);
    }
    
    // Perform search with new sort
    handleSearch();
  };
  
  // Handle view mode change
  const handleViewModeChange = (newViewMode: ViewMode) => {
    // Update view mode
    if (searchStore) {
      searchStore.setViewMode(newViewMode);
    } else {
      setLocalViewMode(newViewMode);
    }
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    // Update page
    if (searchStore) {
      searchStore.setCurrentPage(newPage);
    } else {
      setLocalCurrentPage(newPage);
    }
    
    // Perform search with new page
    handleSearch();
  };
  
  // Handle results per page change
  const handleResultsPerPageChange = (newResultsPerPage: number) => {
    // Update results per page
    if (searchStore) {
      searchStore.setResultsPerPage(newResultsPerPage);
    } else {
      setLocalResultsPerPage(newResultsPerPage);
    }
    
    // Reset to first page
    if (searchStore) {
      searchStore.setCurrentPage(1);
    } else {
      setLocalCurrentPage(1);
    }
    
    // Perform search with new results per page
    handleSearch();
  };
  
  // Handle export results
  const handleExportResults = (format: 'csv' | 'json' | 'txt') => {
    // Get all results (not just current page)
    let allResults = [];
    
    if (searchHook) {
      allResults = searchHook.search(query, filters, sortBy, sortOrder);
    } else {
      // This would need to be implemented based on the same logic as handleSearch
      allResults = searchResults;
    }
    
    // Format data
    let exportData = '';
    
    switch (format) {
      case 'csv':
        // CSV header
        exportData = 'Name,Type,Rarity,Set,Elements,Keywords,Power,Toughness\n';
        
        // CSV rows
        allResults.forEach(card => {
          const elements = card.elements 
            ? Object.entries(card.elements)
                .filter(([_, count]) => (count as number) > 0)
                .map(([element, count]) => `${element}:${count}`)
                .join(';')
            : '';
          
          const keywords = card.keywords ? card.keywords.join(';') : '';
          const power = card.type === 'Familiar' ? card.strength : '';
          const toughness = card.type === 'Familiar' ? card.health : '';
          
          exportData += `"${card.name}","${card.type}","${card.rarity}","${card.set}","${elements}","${keywords}","${power}","${toughness}"\n`;
        });
        break;
        
      case 'json':
        exportData = JSON.stringify(allResults, null, 2);
        break;
        
      case 'txt':
        allResults.forEach(card => {
          exportData += `${card.name} (${card.type})\n`;
          exportData += `${card.rarity} - ${card.set}\n`;
          
          if (card.elements) {
            const elements = Object.entries(card.elements)
              .filter(([_, count]) => (count as number) > 0)
              .map(([element, count]) => `${element}: ${count}`)
              .join(', ');
            
            exportData += `Elements: ${elements}\n`;
          }
          
          if (card.keywords && card.keywords.length > 0) {
            exportData += `Keywords: ${card.keywords.join(', ')}\n`;
          }
          
          if (card.type === 'Familiar') {
            exportData += `Power/Toughness: ${card.strength}/${card.health}\n`;
          }
          
          if (card.text) {
            exportData += `Text: ${card.text}\n`;
          }
          
          exportData += '\n';
        });
        break;
    }
    
    // Create download link
    const blob = new Blob([exportData], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `konivrer-search-results.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Render filter badge
  const renderFilterBadge = (filter: Filter, index: number) => {
    let displayValue = '';
    
    if (typeof filter.value === 'string' || typeof filter.value === 'number') {
      displayValue = String(filter.value);
    } else if (Array.isArray(filter.value)) {
      displayValue = filter.value.join(', ');
    }
    
    let comparisonText = '';
    if (filter.comparison) {
      switch (filter.comparison) {
        case 'equal':
          comparisonText = '=';
          break;
        case 'less-than':
          comparisonText = '<';
          break;
        case 'greater-than':
          comparisonText = '>';
          break;
        case 'at-least':
          comparisonText = '>=';
          break;
        case 'at-most':
          comparisonText = '<=';
          break;
        default:
          comparisonText = '';
      }
    }
    
    return (
      <div 
        key={`${filter.type}-${index}`}
        className="filter-badge"
      >
        <span className="filter-type">{filter.type}</span>
        {comparisonText && <span className="filter-comparison">{comparisonText}</span>}
        <span className="filter-value">{displayValue}</span>
        <button 
          className="filter-remove"
          onClick={() => handleRemoveFilter(index)}
        >
          <X size={14} />
        </button>
      </div>
    );
  };
  
  // Render standard search
  const renderStandardSearch = () => {
    return (
      <div className={`standard-search ${className}`}>
        {/* Search form */}
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search cards by name, text, or type..."
              className="search-input"
            />
            {query && (
              <button 
                type="button"
                onClick={() => {
                  if (searchStore) {
                    searchStore.setQuery('');
                  } else {
                    setLocalQuery('');
                  }
                  setSuggestions([]);
                  setShowSuggestions(false);
                  searchInputRef.current?.focus();
                }}
                className="clear-button"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="search-actions">
            <button 
              type="submit"
              className="search-button"
              disabled={isSearching}
            >
              {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              <span>Search</span>
            </button>
            
            {showFilters && (
              <button 
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="filter-button"
              >
                <Filter size={20} />
                <span>Filters</span>
                {showAdvancedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
            
            {showHistory && (
              <button 
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="history-button"
              >
                <History size={20} />
                <span>History</span>
              </button>
            )}
          </div>
        </form>
        
        {/* Search suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="search-suggestions"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  <div className="suggestion-name">{suggestion.name}</div>
                  <div className="suggestion-type">{suggestion.type}</div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Search history */}
        <AnimatePresence>
          {showHistory && searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="search-history"
            >
              <div className="history-header">
                <h3>Recent Searches</h3>
                <button 
                  onClick={handleClearHistory}
                  className="clear-history-button"
                >
                  <Trash size={16} />
                  <span>Clear</span>
                </button>
              </div>
              <div className="history-items">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(item)}
                    className="history-item"
                  >
                    <History size={16} />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Advanced filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="advanced-filters"
            >
              <div className="filters-header">
                <h3>Advanced Filters</h3>
                {filters.length > 0 && (
                  <button 
                    onClick={handleClearFilters}
                    className="clear-filters-button"
                  >
                    <RefreshCw size={16} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
              
              {/* Active filters */}
              {filters.length > 0 && (
                <div className="active-filters">
                  <div className="filters-label">Active Filters:</div>
                  <div className="filter-badges">
                    {filters.map((filter, index) => renderFilterBadge(filter, index))}
                  </div>
                </div>
              )}
              
              {/* Filter controls */}
              <div className="filter-controls">
                <div className="filter-selector">
                  <label>Add Filter:</label>
                  <div className="filter-dropdown">
                    <button 
                      onClick={() => setSelectedFilterType(selectedFilterType ? null : 'type')}
                      className="filter-dropdown-button"
                    >
                      <Type size={16} />
                      <span>Card Type</span>
                      {selectedFilterType === 'type' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    <AnimatePresence>
                      {selectedFilterType === 'type' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="filter-options"
                        >
                          {filterOptions.types.map((type, index) => (
                            <button
                              key={index}
                              onClick={() => handleAddFilter('type', type)}
                              className="filter-option"
                            >
                              {type}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="filter-dropdown">
                    <button 
                      onClick={() => setSelectedFilterType(selectedFilterType ? null : 'element')}
                      className="filter-dropdown-button"
                    >
                      <Palette size={16} />
                      <span>Element</span>
                      {selectedFilterType === 'element' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    <AnimatePresence>
                      {selectedFilterType === 'element' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="filter-options"
                        >
                          {filterOptions.elements.map((element, index) => (
                            <button
                              key={index}
                              onClick={() => handleAddFilter('element', element)}
                              className="filter-option"
                            >
                              {element}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="filter-dropdown">
                    <button 
                      onClick={() => setSelectedFilterType(selectedFilterType ? null : 'rarity')}
                      className="filter-dropdown-button"
                    >
                      <Star size={16} />
                      <span>Rarity</span>
                      {selectedFilterType === 'rarity' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    <AnimatePresence>
                      {selectedFilterType === 'rarity' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="filter-options"
                        >
                          {filterOptions.rarities.map((rarity, index) => (
                            <button
                              key={index}
                              onClick={() => handleAddFilter('rarity', rarity)}
                              className="filter-option"
                            >
                              {rarity}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="filter-dropdown">
                    <button 
                      onClick={() => setSelectedFilterType(selectedFilterType ? null : 'set')}
                      className="filter-dropdown-button"
                    >
                      <Calendar size={16} />
                      <span>Set</span>
                      {selectedFilterType === 'set' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    <AnimatePresence>
                      {selectedFilterType === 'set' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="filter-options"
                        >
                          {filterOptions.sets.map((set, index) => (
                            <button
                              key={index}
                              onClick={() => handleAddFilter('set', set)}
                              className="filter-option"
                            >
                              {set}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Search results */}
        <div className="search-results-container">
          {/* Results header */}
          {searchResults.length > 0 && (
            <div className="results-header">
              <div className="results-count">
                {totalResults} {totalResults === 1 ? 'result' : 'results'} found
              </div>
              
              <div className="results-actions">
                {/* Sort options */}
                <div className="sort-options">
                  <label>Sort by:</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="sort-select"
                  >
                    <option value="name">Name</option>
                    <option value="type">Type</option>
                    <option value="rarity">Rarity</option>
                    <option value="cost">Mana Cost</option>
                    <option value="power">Power</option>
                    <option value="toughness">Toughness</option>
                    <option value="releaseDate">Release Date</option>
                  </select>
                  
                  <button 
                    onClick={() => {
                      if (searchStore) {
                        searchStore.setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setLocalSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }
                      handleSearch();
                    }}
                    className="sort-direction-button"
                  >
                    {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </button>
                </div>
                
                {/* View mode */}
                <div className="view-mode-options">
                  <button 
                    onClick={() => handleViewModeChange('grid')}
                    className={`view-mode-button ${viewMode === 'grid' ? 'active' : ''}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button 
                    onClick={() => handleViewModeChange('list')}
                    className={`view-mode-button ${viewMode === 'list' ? 'active' : ''}`}
                  >
                    <List size={16} />
                  </button>
                </div>
                
                {/* Export options */}
                {showExport && (
                  <div className="export-options">
                    <button 
                      onClick={() => handleExportResults('csv')}
                      className="export-button"
                    >
                      <Download size={16} />
                      <span>CSV</span>
                    </button>
                    <button 
                      onClick={() => handleExportResults('json')}
                      className="export-button"
                    >
                      <Download size={16} />
                      <span>JSON</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Results content */}
          {isSearching ? (
            <div className="loading-container">
              <Loader2 size={32} className="animate-spin" />
              <p>Searching...</p>
            </div>
          ) : searchError ? (
            <div className="error-container">
              <AlertCircle size={32} />
              <p>{searchError}</p>
              <button 
                onClick={() => handleSearch()}
                className="retry-button"
              >
                <RefreshCw size={16} />
                <span>Retry</span>
              </button>
            </div>
          ) : searchResults.length === 0 ? (
            query || filters.length > 0 ? (
              <div className="no-results-container">
                <FileText size={32} />
                <p>No cards found matching your search criteria.</p>
                <p>Try adjusting your search terms or filters.</p>
              </div>
            ) : (
              <div className="empty-search-container">
                <Search size={32} />
                <p>Enter a search term or apply filters to find cards.</p>
              </div>
            )
          ) : (
            <div className={`results-grid ${viewMode}`}>
              {searchResults.map((card, index) => (
                <div 
                  key={index}
                  className="card-result-item"
                  onClick={() => onCardSelect && onCardSelect(card)}
                >
                  <UnifiedCard 
                    card={card}
                    variant={viewMode === 'list' ? 'standard' : 'konivrer'}
                    size={viewMode === 'compact' ? 'small' : 'normal'}
                    showDetails={viewMode === 'detailed'}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalResults > resultsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                First
              </button>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {Math.ceil(totalResults / resultsPerPage)}
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalResults / resultsPerPage)}
                className="pagination-button"
              >
                Next
              </button>
              <button 
                onClick={() => handlePageChange(Math.ceil(totalResults / resultsPerPage))}
                disabled={currentPage >= Math.ceil(totalResults / resultsPerPage)}
                className="pagination-button"
              >
                Last
              </button>
              
              <div className="results-per-page">
                <label>Show:</label>
                <select 
                  value={resultsPerPage}
                  onChange={(e) => handleResultsPerPageChange(Number(e.target.value))}
                  className="per-page-select"
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                  <option value="96">96</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render mobile search
  const renderMobileSearch = () => {
    return (
      <div className={`mobile-search ${className}`}>
        {/* Search form */}
        <form onSubmit={handleSubmit} className="mobile-search-form">
          <div className="mobile-search-input-container">
            <Search className="mobile-search-icon" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search cards..."
              className="mobile-search-input"
            />
            {query && (
              <button 
                type="button"
                onClick={() => {
                  if (searchStore) {
                    searchStore.setQuery('');
                  } else {
                    setLocalQuery('');
                  }
                  setSuggestions([]);
                  setShowSuggestions(false);
                  searchInputRef.current?.focus();
                }}
                className="mobile-clear-button"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="mobile-search-actions">
            <button 
              type="submit"
              className="mobile-search-button"
              disabled={isSearching}
            >
              {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            </button>
            
            {showFilters && (
              <button 
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="mobile-filter-button"
              >
                <Filter size={20} />
                {filters.length > 0 && (
                  <span className="filter-count">{filters.length}</span>
                )}
              </button>
            )}
          </div>
        </form>
        
        {/* Search suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mobile-search-suggestions"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="mobile-suggestion-item"
                >
                  <div className="mobile-suggestion-name">{suggestion.name}</div>
                  <div className="mobile-suggestion-type">{suggestion.type}</div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Advanced filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mobile-advanced-filters"
            >
              <div className="mobile-filters-header">
                <h3>Filters</h3>
                {filters.length > 0 && (
                  <button 
                    onClick={handleClearFilters}
                    className="mobile-clear-filters-button"
                  >
                    <RefreshCw size={16} />
                    <span>Clear All</span>
                  </button>
                )}
                <button 
                  onClick={() => setShowAdvancedFilters(false)}
                  className="mobile-close-filters-button"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Active filters */}
              {filters.length > 0 && (
                <div className="mobile-active-filters">
                  <div className="mobile-filters-label">Active Filters:</div>
                  <div className="mobile-filter-badges">
                    {filters.map((filter, index) => renderFilterBadge(filter, index))}
                  </div>
                </div>
              )}
              
              {/* Filter controls */}
              <div className="mobile-filter-controls">
                <div className="mobile-filter-section">
                  <h4>Card Type</h4>
                  <div className="mobile-filter-options">
                    {filterOptions.types.map((type, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddFilter('type', type)}
                        className="mobile-filter-option"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mobile-filter-section">
                  <h4>Elements</h4>
                  <div className="mobile-filter-options">
                    {filterOptions.elements.map((element, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddFilter('element', element)}
                        className="mobile-filter-option"
                      >
                        {element}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mobile-filter-section">
                  <h4>Rarity</h4>
                  <div className="mobile-filter-options">
                    {filterOptions.rarities.map((rarity, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddFilter('rarity', rarity)}
                        className="mobile-filter-option"
                      >
                        {rarity}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mobile-filter-section">
                  <h4>Set</h4>
                  <div className="mobile-filter-options">
                    {filterOptions.sets.map((set, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddFilter('set', set)}
                        className="mobile-filter-option"
                      >
                        {set}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Search results */}
        <div className="mobile-search-results-container">
          {/* Results header */}
          {searchResults.length > 0 && (
            <div className="mobile-results-header">
              <div className="mobile-results-count">
                {totalResults} {totalResults === 1 ? 'result' : 'results'}
              </div>
              
              <div className="mobile-results-actions">
                {/* Sort options */}
                <button 
                  onClick={() => {
                    if (searchStore) {
                      searchStore.setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setLocalSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }
                    handleSearch();
                  }}
                  className="mobile-sort-button"
                >
                  <ArrowUpDown size={16} />
                </button>
                
                {/* View mode */}
                <button 
                  onClick={() => handleViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
                  className="mobile-view-mode-button"
                >
                  {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
                </button>
              </div>
            </div>
          )}
          
          {/* Results content */}
          {isSearching ? (
            <div className="mobile-loading-container">
              <Loader2 size={32} className="animate-spin" />
              <p>Searching...</p>
            </div>
          ) : searchError ? (
            <div className="mobile-error-container">
              <AlertCircle size={32} />
              <p>{searchError}</p>
              <button 
                onClick={() => handleSearch()}
                className="mobile-retry-button"
              >
                <RefreshCw size={16} />
                <span>Retry</span>
              </button>
            </div>
          ) : searchResults.length === 0 ? (
            query || filters.length > 0 ? (
              <div className="mobile-no-results-container">
                <FileText size={32} />
                <p>No cards found matching your search criteria.</p>
              </div>
            ) : (
              <div className="mobile-empty-search-container">
                <Search size={32} />
                <p>Enter a search term or apply filters to find cards.</p>
              </div>
            )
          ) : (
            <div className={`mobile-results-grid ${viewMode}`}>
              {searchResults.map((card, index) => (
                <div 
                  key={index}
                  className="mobile-card-result-item"
                  onClick={() => onCardSelect && onCardSelect(card)}
                >
                  <UnifiedCard 
                    card={card}
                    variant={viewMode === 'list' ? 'standard' : 'konivrer'}
                    size="small"
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalResults > resultsPerPage && (
            <div className="mobile-pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="mobile-pagination-button"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="mobile-pagination-info">
                {currentPage} / {Math.ceil(totalResults / resultsPerPage)}
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalResults / resultsPerPage)}
                className="mobile-pagination-button"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render simple search
  const renderSimpleSearch = () => {
    return (
      <div className={`simple-search ${className}`}>
        {/* Search form */}
        <form onSubmit={handleSubmit} className="simple-search-form">
          <div className="simple-search-input-container">
            <Search className="simple-search-icon" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search cards..."
              className="simple-search-input"
            />
            {query && (
              <button 
                type="button"
                onClick={() => {
                  if (searchStore) {
                    searchStore.setQuery('');
                  } else {
                    setLocalQuery('');
                  }
                  setSuggestions([]);
                  setShowSuggestions(false);
                  searchInputRef.current?.focus();
                }}
                className="simple-clear-button"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <button 
            type="submit"
            className="simple-search-button"
            disabled={isSearching}
          >
            {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            <span>Search</span>
          </button>
        </form>
        
        {/* Search suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="simple-search-suggestions"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="simple-suggestion-item"
                >
                  <div className="simple-suggestion-name">{suggestion.name}</div>
                  <div className="simple-suggestion-type">{suggestion.type}</div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  // Render advanced search
  const renderAdvancedSearch = () => {
    return (
      <div className={`advanced-search ${className}`}>
        {/* Header */}
        <div className="advanced-search-header">
          <h2>Advanced Card Search</h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="advanced-search-close"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Search form */}
        <form onSubmit={handleSubmit} className="advanced-search-form">
          <div className="advanced-search-section">
            <h3>Basic Search</h3>
            <div className="advanced-search-fields">
              <div className="advanced-search-field">
                <label>Card Name</label>
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Enter card name..."
                  className="advanced-search-input"
                />
              </div>
              
              <div className="advanced-search-field">
                <label>Card Text</label>
                <input
                  type="text"
                  placeholder="Search card text..."
                  className="advanced-search-input"
                />
              </div>
            </div>
          </div>
          
          <div className="advanced-search-section">
            <h3>Type & Mechanics</h3>
            <div className="advanced-search-fields">
              <div className="advanced-search-field">
                <label>Card Type</label>
                <div className="advanced-search-checkboxes">
                  {filterOptions.types.map((type, index) => (
                    <label key={index} className="advanced-search-checkbox">
                      <input 
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleAddFilter('type', type);
                          } else {
                            const filterIndex = filters.findIndex(f => 
                              f.type === 'type' && (
                                f.value === type || 
                                (Array.isArray(f.value) && f.value.includes(type))
                              )
                            );
                            if (filterIndex !== -1) {
                              handleRemoveFilter(filterIndex);
                            }
                          }
                        }}
                        checked={filters.some(f => 
                          f.type === 'type' && (
                            f.value === type || 
                            (Array.isArray(f.value) && f.value.includes(type))
                          )
                        )}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="advanced-search-field">
                <label>Keywords</label>
                <div className="advanced-search-checkboxes">
                  {filterOptions.keywords.map((keyword, index) => (
                    <label key={index} className="advanced-search-checkbox">
                      <input 
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleAddFilter('keyword', keyword);
                          } else {
                            const filterIndex = filters.findIndex(f => 
                              f.type === 'keyword' && (
                                f.value === keyword || 
                                (Array.isArray(f.value) && f.value.includes(keyword))
                              )
                            );
                            if (filterIndex !== -1) {
                              handleRemoveFilter(filterIndex);
                            }
                          }
                        }}
                        checked={filters.some(f => 
                          f.type === 'keyword' && (
                            f.value === keyword || 
                            (Array.isArray(f.value) && f.value.includes(keyword))
                          )
                        )}
                      />
                      <span>{keyword}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="advanced-search-section">
            <h3>Elements & Rarity</h3>
            <div className="advanced-search-fields">
              <div className="advanced-search-field">
                <label>Elements</label>
                <div className="advanced-search-checkboxes">
                  {filterOptions.elements.map((element, index) => (
                    <label key={index} className="advanced-search-checkbox">
                      <input 
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleAddFilter('element', element);
                          } else {
                            const filterIndex = filters.findIndex(f => 
                              f.type === 'element' && (
                                f.value === element || 
                                (Array.isArray(f.value) && f.value.includes(element))
                              )
                            );
                            if (filterIndex !== -1) {
                              handleRemoveFilter(filterIndex);
                            }
                          }
                        }}
                        checked={filters.some(f => 
                          f.type === 'element' && (
                            f.value === element || 
                            (Array.isArray(f.value) && f.value.includes(element))
                          )
                        )}
                      />
                      <span>{element}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="advanced-search-field">
                <label>Rarity</label>
                <div className="advanced-search-checkboxes">
                  {filterOptions.rarities.map((rarity, index) => (
                    <label key={index} className="advanced-search-checkbox">
                      <input 
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleAddFilter('rarity', rarity);
                          } else {
                            const filterIndex = filters.findIndex(f => 
                              f.type === 'rarity' && (
                                f.value === rarity || 
                                (Array.isArray(f.value) && f.value.includes(rarity))
                              )
                            );
                            if (filterIndex !== -1) {
                              handleRemoveFilter(filterIndex);
                            }
                          }
                        }}
                        checked={filters.some(f => 
                          f.type === 'rarity' && (
                            f.value === rarity || 
                            (Array.isArray(f.value) && f.value.includes(rarity))
                          )
                        )}
                      />
                      <span>{rarity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="advanced-search-section">
            <h3>Stats & Cost</h3>
            <div className="advanced-search-fields">
              <div className="advanced-search-field">
                <label>Power</label>
                <div className="advanced-search-range">
                  <select 
                    className="advanced-search-comparison"
                    onChange={(e) => {
                      const filterIndex = filters.findIndex(f => f.type === 'power');
                      if (filterIndex !== -1) {
                        handleRemoveFilter(filterIndex);
                      }
                      
                      if (e.target.value !== 'any') {
                        const value = document.getElementById('power-value') as HTMLInputElement;
                        handleAddFilter('power', parseInt(value.value), e.target.value as ComparisonType);
                      }
                    }}
                  >
                    <option value="any">Any</option>
                    <option value="equal">=</option>
                    <option value="less-than">&lt;</option>
                    <option value="greater-than">&gt;</option>
                  </select>
                  <input 
                    id="power-value"
                    type="number" 
                    min="0" 
                    max="20"
                    defaultValue="1"
                    className="advanced-search-number"
                  />
                </div>
              </div>
              
              <div className="advanced-search-field">
                <label>Toughness</label>
                <div className="advanced-search-range">
                  <select 
                    className="advanced-search-comparison"
                    onChange={(e) => {
                      const filterIndex = filters.findIndex(f => f.type === 'toughness');
                      if (filterIndex !== -1) {
                        handleRemoveFilter(filterIndex);
                      }
                      
                      if (e.target.value !== 'any') {
                        const value = document.getElementById('toughness-value') as HTMLInputElement;
                        handleAddFilter('toughness', parseInt(value.value), e.target.value as ComparisonType);
                      }
                    }}
                  >
                    <option value="any">Any</option>
                    <option value="equal">=</option>
                    <option value="less-than">&lt;</option>
                    <option value="greater-than">&gt;</option>
                  </select>
                  <input 
                    id="toughness-value"
                    type="number" 
                    min="0" 
                    max="20"
                    defaultValue="1"
                    className="advanced-search-number"
                  />
                </div>
              </div>
              
              <div className="advanced-search-field">
                <label>Total Cost</label>
                <div className="advanced-search-range">
                  <select 
                    className="advanced-search-comparison"
                    onChange={(e) => {
                      const filterIndex = filters.findIndex(f => f.type === 'cost');
                      if (filterIndex !== -1) {
                        handleRemoveFilter(filterIndex);
                      }
                      
                      if (e.target.value !== 'any') {
                        const value = document.getElementById('cost-value') as HTMLInputElement;
                        handleAddFilter('cost', parseInt(value.value), e.target.value as ComparisonType);
                      }
                    }}
                  >
                    <option value="any">Any</option>
                    <option value="equal">=</option>
                    <option value="less-than">&lt;</option>
                    <option value="greater-than">&gt;</option>
                  </select>
                  <input 
                    id="cost-value"
                    type="number" 
                    min="0" 
                    max="20"
                    defaultValue="3"
                    className="advanced-search-number"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="advanced-search-actions">
            <button 
              type="button"
              onClick={handleClearFilters}
              className="advanced-search-clear"
            >
              <RefreshCw size={16} />
              <span>Clear All</span>
            </button>
            
            <button 
              type="submit"
              className="advanced-search-submit"
              disabled={isSearching}
            >
              {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  // Render the appropriate variant
  switch (actualVariant) {
    case 'mobile':
      return renderMobileSearch();
    case 'simple':
      return renderSimpleSearch();
    case 'advanced':
      return renderAdvancedSearch();
    default:
      return renderStandardSearch();
  }
};

export default UnifiedCardSearch;