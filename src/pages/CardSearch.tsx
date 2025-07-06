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
type SortDirection = 'asc' | 'desc';

interface FilterOption {
  type: FilterType;
  value: string | string[];
}

interface SearchCriteria {
  query: string;
  filters: FilterOption[];
  sort: SortOption;
  sortDirection: SortDirection;
  viewMode: ViewMode;
  page: number;
  pageSize: number;
}

interface CardSearchProps {
  initialCriteria?: Partial<SearchCriteria>;
  onCardSelect?: (card: Card) => void;
  showFavorites?: boolean;
  showHistory?: boolean;
  showAdvancedFilters?: boolean;
  className?: string;
}

// Card metadata for filters
interface CardMetadata {
  types: string[];
  elements: string[];
  keywords: string[];
  rarities: string[];
  sets: string[];
  artists: string[];
}

const CardSearch: React.FC<CardSearchProps> = ({
  initialCriteria,
  onCardSelect,
  showFavorites = true,
  showHistory = true,
  showAdvancedFilters = true,
  className = ''
}) => {
  // State for search criteria
  const [criteria, setCriteria] = useState<SearchCriteria>({
    query: '',
    filters: [],
    sort: 'name',
    sortDirection: 'asc',
    viewMode: 'grid',
    page: 1,
    pageSize: 20,
    ...initialCriteria
  });

  // State for UI
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Extract metadata from cards for filter options
  const metadata = useMemo<CardMetadata>(() => {
    const types = new Set<string>();
    const elements = new Set<string>();
    const keywords = new Set<string>();
    const rarities = new Set<string>();
    const sets = new Set<string>();
    const artists = new Set<string>();

    cardsData.forEach((card: Card) => {
      if (card.type) types.add(card.type);
      if (card.elements) card.elements.forEach(element => elements.add(element));
      if (card.keywords) card.keywords.forEach(keyword => keywords.add(keyword));
      if (card.rarity) rarities.add(card.rarity);
      if (card.set) sets.add(card.set);
      if (card.artist) artists.add(card.artist);
    });

    return {
      types: Array.from(types).sort(),
      elements: Array.from(elements).sort(),
      keywords: Array.from(keywords).sort(),
      rarities: Array.from(rarities).sort(),
      sets: Array.from(sets).sort(),
      artists: Array.from(artists).sort()
    };
  }, []);

  // Filter cards based on criteria
  const filteredCards = useMemo(() => {
    let results = [...cardsData];

    // Text search
    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      results = results.filter(card => 
        card.name.toLowerCase().includes(query) || 
        (card.text && card.text.toLowerCase().includes(query))
      );
    }

    // Apply filters
    criteria.filters.forEach(filter => {
      switch (filter.type) {
        case 'type':
          results = results.filter(card => card.type === filter.value);
          break;
        case 'element':
          if (Array.isArray(filter.value)) {
            results = results.filter(card => 
              filter.value.every(element => card.elements?.includes(element))
            );
          } else {
            results = results.filter(card => 
              card.elements?.includes(filter.value as string)
            );
          }
          break;
        case 'keyword':
          if (Array.isArray(filter.value)) {
            results = results.filter(card => 
              filter.value.every(keyword => card.keywords?.includes(keyword))
            );
          } else {
            results = results.filter(card => 
              card.keywords?.includes(filter.value as string)
            );
          }
          break;
        case 'rarity':
          results = results.filter(card => card.rarity === filter.value);
          break;
        case 'set':
          results = results.filter(card => card.set === filter.value);
          break;
        case 'artist':
          results = results.filter(card => card.artist === filter.value);
          break;
      }
    });

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (criteria.sort) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = (a.type || '').localeCompare(b.type || '');
          break;
        case 'rarity':
          // Custom rarity order: Common, Uncommon, Rare, Epic, Legendary
          const rarityOrder: Record<string, number> = {
            'Common': 1,
            'Uncommon': 2,
            'Rare': 3,
            'Epic': 4,
            'Legendary': 5
          };
          comparison = (rarityOrder[a.rarity || ''] || 0) - (rarityOrder[b.rarity || ''] || 0);
          break;
        case 'set':
          comparison = (a.set || '').localeCompare(b.set || '');
          break;
        case 'cost':
          comparison = (a.cost || 0) - (b.cost || 0);
          break;
      }

      return criteria.sortDirection === 'asc' ? comparison : -comparison;
    });

    return results;
  }, [criteria, cardsData]);

  // Pagination
  const paginatedCards = useMemo(() => {
    const startIndex = (criteria.page - 1) * criteria.pageSize;
    return filteredCards.slice(startIndex, startIndex + criteria.pageSize);
  }, [filteredCards, criteria.page, criteria.pageSize]);

  // Total pages
  const totalPages = useMemo(() => 
    Math.ceil(filteredCards.length / criteria.pageSize),
    [filteredCards.length, criteria.pageSize]
  );

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('cardFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem('cardFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save search history to localStorage when changed
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCriteria(prev => ({
      ...prev,
      query: e.target.value,
      page: 1 // Reset to first page on new search
    }));
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Add to search history if not empty
    if (criteria.query && !searchHistory.includes(criteria.query)) {
      setSearchHistory(prev => [criteria.query, ...prev].slice(0, 10));
    }

    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [criteria.query, searchHistory]);

  // Add or remove filter
  const handleFilterChange = useCallback((type: FilterType, value: string | string[]) => {
    setCriteria(prev => {
      // Check if filter already exists
      const filterIndex = prev.filters.findIndex(f => f.type === type);
      
      if (filterIndex >= 0) {
        // Update existing filter
        const newFilters = [...prev.filters];
        newFilters[filterIndex] = { type, value };
        return { ...prev, filters: newFilters, page: 1 };
      } else {
        // Add new filter
        return { 
          ...prev, 
          filters: [...prev.filters, { type, value }],
          page: 1
        };
      }
    });
  }, []);

  // Remove filter
  const handleRemoveFilter = useCallback((type: FilterType) => {
    setCriteria(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.type !== type),
      page: 1
    }));
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setCriteria(prev => ({
      ...prev,
      filters: [],
      page: 1
    }));
  }, []);

  // Change sort option
  const handleSortChange = useCallback((sort: SortOption) => {
    setCriteria(prev => ({
      ...prev,
      sort,
      // Toggle direction if selecting the same sort field
      sortDirection: prev.sort === sort 
        ? (prev.sortDirection === 'asc' ? 'desc' : 'asc') 
        : prev.sortDirection
    }));
  }, []);

  // Change view mode
  const handleViewModeChange = useCallback((viewMode: ViewMode) => {
    setCriteria(prev => ({
      ...prev,
      viewMode
    }));
  }, []);

  // Change page
  const handlePageChange = useCallback((page: number) => {
    setCriteria(prev => ({
      ...prev,
      page
    }));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Toggle favorite
  const handleToggleFavorite = useCallback((cardId: string) => {
    setFavorites(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      } else {
        return [...prev, cardId];
      }
    });
  }, []);

  // Handle card click
  const handleCardClick = useCallback((card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
    if (onCardSelect) {
      onCardSelect(card);
    }
  }, [onCardSelect]);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Use search from history
  const handleUseHistoryItem = useCallback((query: string) => {
    setCriteria(prev => ({
      ...prev,
      query,
      page: 1
    }));
  }, []);

  // Clear search history
  const handleClearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // Render filter badges
  const renderFilterBadges = () => {
    return criteria.filters.map((filter, index) => (
      <div 
        key={`${filter.type}-${index}`}
        className="inline-flex items-center px-3 py-1 mr-2 mb-2 text-sm bg-blue-100 text-blue-800 rounded-full"
      >
        <span className="mr-1 capitalize">{filter.type}:</span>
        <span className="font-medium">
          {Array.isArray(filter.value) 
            ? filter.value.join(', ') 
            : filter.value}
        </span>
        <button 
          onClick={() => handleRemoveFilter(filter.type)}
          className="ml-2 text-blue-600 hover:text-blue-800"
          aria-label={`Remove ${filter.type} filter`}
        >
          <X size={14} />
        </button>
      </div>
    ));
  };

  // Render filter panel
  const renderFilterPanel = () => {
    return (
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-gray-50 rounded-lg p-4 mb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Type filter */}
              <div>
                <h3 className="font-medium mb-2">Card Type</h3>
                <div className="space-y-1">
                  {metadata.types.map(type => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('type', type)}
                      className={`block px-3 py-1 text-sm rounded-full mr-2 mb-1 ${
                        criteria.filters.some(f => f.type === 'type' && f.value === type)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Element filter */}
              <div>
                <h3 className="font-medium mb-2">Elements</h3>
                <div className="space-y-1">
                  {metadata.elements.map(element => (
                    <button
                      key={element}
                      onClick={() => handleFilterChange('element', element)}
                      className={`block px-3 py-1 text-sm rounded-full mr-2 mb-1 ${
                        criteria.filters.some(f => f.type === 'element' && 
                          (Array.isArray(f.value) 
                            ? f.value.includes(element) 
                            : f.value === element))
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {element}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity filter */}
              <div>
                <h3 className="font-medium mb-2">Rarity</h3>
                <div className="space-y-1">
                  {metadata.rarities.map(rarity => (
                    <button
                      key={rarity}
                      onClick={() => handleFilterChange('rarity', rarity)}
                      className={`block px-3 py-1 text-sm rounded-full mr-2 mb-1 ${
                        criteria.filters.some(f => f.type === 'rarity' && f.value === rarity)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {rarity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Set filter */}
              {showAdvancedFilters && (
                <div>
                  <h3 className="font-medium mb-2">Set</h3>
                  <select
                    onChange={(e) => handleFilterChange('set', e.target.value)}
                    value={criteria.filters.find(f => f.type === 'set')?.value as string || ''}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">All Sets</option>
                    {metadata.sets.map(set => (
                      <option key={set} value={set}>{set}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Keywords filter */}
              {showAdvancedFilters && (
                <div>
                  <h3 className="font-medium mb-2">Keywords</h3>
                  <select
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    value={criteria.filters.find(f => f.type === 'keyword')?.value as string || ''}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">All Keywords</option>
                    {metadata.keywords.map(keyword => (
                      <option key={keyword} value={keyword}>{keyword}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Artist filter */}
              {showAdvancedFilters && (
                <div>
                  <h3 className="font-medium mb-2">Artist</h3>
                  <select
                    onChange={(e) => handleFilterChange('artist', e.target.value)}
                    value={criteria.filters.find(f => f.type === 'artist')?.value as string || ''}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">All Artists</option>
                    {metadata.artists.map(artist => (
                      <option key={artist} value={artist}>{artist}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Filter actions */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Render card grid
  const renderCardGrid = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading cards...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center py-12 text-red-500">
          <AlertCircle className="h-8 w-8 mr-2" />
          <span>{error}</span>
        </div>
      );
    }

    if (paginatedCards.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center py-12 text-gray-500">
          <Search className="h-12 w-12 mb-4" />
          <h3 className="text-xl font-medium mb-2">No cards found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      );
    }

    return (
      <div className={
        criteria.viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          : "space-y-4"
      }>
        {paginatedCards.map(card => (
          <div 
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={
              criteria.viewMode === 'grid'
                ? "bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                : "bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex"
            }
          >
            {criteria.viewMode === 'grid' ? (
              // Grid view
              <>
                <div className="relative pb-[140%]">
                  <img 
                    src={card.imageUrl || '/placeholder-card.jpg'} 
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Favorite button */}
                  {showFavorites && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(card.id);
                      }}
                      className="absolute top-2 right-2 p-1 bg-white bg-opacity-70 rounded-full"
                      aria-label={favorites.includes(card.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart 
                        size={20} 
                        className={favorites.includes(card.id) ? "fill-red-500 text-red-500" : "text-gray-500"} 
                      />
                    </button>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 truncate">{card.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="capitalize">{card.type}</span>
                    {card.cost !== undefined && (
                      <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {card.cost}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // List view
              <>
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src={card.imageUrl || '/placeholder-card.jpg'} 
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex-grow">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900">{card.name}</h3>
                    {card.cost !== undefined && (
                      <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm">
                        {card.cost}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="capitalize">{card.type}</span>
                    <span className="mx-1">•</span>
                    <span>{card.rarity}</span>
                    {card.elements && card.elements.length > 0 && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{card.elements.join(', ')}</span>
                      </>
                    )}
                  </div>
                  {criteria.viewMode === 'list' && card.text && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{card.text}</p>
                  )}
                </div>
                {/* Favorite button */}
                {showFavorites && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(card.id);
                    }}
                    className="p-3"
                    aria-label={favorites.includes(card.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart 
                      size={20} 
                      className={favorites.includes(card.id) ? "fill-red-500 text-red-500" : "text-gray-500"} 
                    />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(Math.max(1, criteria.page - 1))}
          disabled={criteria.page === 1}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          aria-label="Previous page"
        >
          &laquo;
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          // Show pages around current page
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (criteria.page <= 3) {
            pageNum = i + 1;
          } else if (criteria.page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = criteria.page - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded ${
                criteria.page === pageNum
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={() => handlePageChange(Math.min(totalPages, criteria.page + 1))}
          disabled={criteria.page === totalPages}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          aria-label="Next page"
        >
          &raquo;
        </button>
      </div>
    );
  };

  // Render card detail modal
  const renderCardModal = () => {
    if (!selectedCard) return null;

    return (
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-gray-100">
                  <img 
                    src={selectedCard.imageUrl || '/placeholder-card.jpg'} 
                    alt={selectedCard.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="md:w-1/2 p-6 overflow-y-auto max-h-[90vh] md:max-h-[600px]">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCard.name}</h2>
                    <button
                      onClick={handleCloseModal}
                      className="p-1 rounded-full hover:bg-gray-200"
                      aria-label="Close modal"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-2 text-gray-700">
                    <span className="capitalize font-medium">{selectedCard.type}</span>
                    {selectedCard.cost !== undefined && (
                      <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        Cost: {selectedCard.cost}
                      </span>
                    )}
                  </div>
                  
                  {selectedCard.elements && selectedCard.elements.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Elements</h3>
                      <div className="flex flex-wrap mt-1">
                        {selectedCard.elements.map(element => (
                          <span 
                            key={element}
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded mr-2 mb-2"
                          >
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedCard.keywords && selectedCard.keywords.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Keywords</h3>
                      <div className="flex flex-wrap mt-1">
                        {selectedCard.keywords.map(keyword => (
                          <span 
                            key={keyword}
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded mr-2 mb-2"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedCard.text && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Card Text</h3>
                      <p className="mt-1 text-gray-700 whitespace-pre-line">{selectedCard.text}</p>
                    </div>
                  )}
                  
                  {selectedCard.flavor && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Flavor Text</h3>
                      <p className="mt-1 text-gray-600 italic">{selectedCard.flavor}</p>
                    </div>
                  )}
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Rarity</h3>
                      <p className="mt-1 text-gray-700">{selectedCard.rarity}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Set</h3>
                      <p className="mt-1 text-gray-700">{selectedCard.set}</p>
                    </div>
                    {selectedCard.artist && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Artist</h3>
                        <p className="mt-1 text-gray-700">{selectedCard.artist}</p>
                      </div>
                    )}
                    {selectedCard.releaseDate && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Release Date</h3>
                        <p className="mt-1 text-gray-700">{selectedCard.releaseDate}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 flex space-x-4">
                    {showFavorites && (
                      <button
                        onClick={() => handleToggleFavorite(selectedCard.id)}
                        className={`flex items-center px-4 py-2 rounded-lg ${
                          favorites.includes(selectedCard.id)
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Heart 
                          size={18} 
                          className={`mr-2 ${favorites.includes(selectedCard.id) ? 'fill-red-500' : ''}`} 
                        />
                        {favorites.includes(selectedCard.id) ? 'Favorited' : 'Add to Favorites'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        // Share functionality would be implemented here
                        navigator.clipboard.writeText(window.location.origin + `/card/${selectedCard.id}`);
                        alert('Link copied to clipboard!');
                      }}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <Share2 size={18} className="mr-2" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className={`card-search ${className}`}>
      {/* Search header */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={criteria.query}
              onChange={handleSearchChange}
              placeholder="Search cards by name or text..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {showFilters ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
          <div className="ml-3 flex">
            <button
              type="button"
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 rounded-l-md border ${
                criteria.viewMode === 'grid'
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('list')}
              className={`p-2 rounded-r-md border-t border-b border-r ${
                criteria.viewMode === 'list'
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Filter badges */}
        {criteria.filters.length > 0 && (
          <div className="mt-3 flex flex-wrap">
            {renderFilterBadges()}
            {criteria.filters.length > 1 && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-3 py-1 mr-2 mb-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter panel */}
      {renderFilterPanel()}

      {/* Search history */}
      {showHistory && searchHistory.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
            <button
              onClick={handleClearHistory}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap">
            {searchHistory.map((query, index) => (
              <button
                key={index}
                onClick={() => handleUseHistoryItem(query)}
                className="flex items-center px-3 py-1 mr-2 mb-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
              >
                <History className="h-3 w-3 mr-1" />
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {isLoading ? (
            <span>Searching...</span>
          ) : (
            <span>
              Showing {paginatedCards.length > 0 ? (criteria.page - 1) * criteria.pageSize + 1 : 0}-
              {Math.min(criteria.page * criteria.pageSize, filteredCards.length)} of {filteredCards.length} cards
            </span>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Sort by:</span>
          <select
            value={criteria.sort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="text-sm border border-gray-300 rounded p-1"
          >
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="rarity">Rarity</option>
            <option value="set">Set</option>
            <option value="cost">Cost</option>
          </select>
          <button
            onClick={() => setCriteria(prev => ({
              ...prev,
              sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
            }))}
            className="ml-2 p-1 text-gray-500 hover:text-gray-700"
            aria-label={`Sort ${criteria.sortDirection === 'asc' ? 'descending' : 'ascending'}`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card grid */}
      {renderCardGrid()}

      {/* Pagination */}
      {renderPagination()}

      {/* Card detail modal */}
      {renderCardModal()}
    </div>
  );
};

export default CardSearch;