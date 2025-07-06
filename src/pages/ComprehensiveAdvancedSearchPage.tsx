/**
 * KONIVRER Deck Database - Comprehensive Advanced Search Page
 * Full-featured search page with all Advanced functionality
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import cardsData from '../data/cards.json';
import ComprehensiveAdvancedSearch from '../components/ComprehensiveAdvancedSearch';
import { searchCards } from '../utils/comprehensiveSearchEngine';
import { Search, Grid, List, Filter, SortAsc, Eye, Download } from 'lucide-react';
const ComprehensiveAdvancedSearchPage = (): any => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  // Parse URL parameters for initial search
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const initialCriteria = {};
    // Parse common URL parameters
    if (urlParams.get('q')) initialCriteria.cardName = urlParams.get('q');
    if (urlParams.get('type')) initialCriteria.typeLine = urlParams.get('type');
    if (urlParams.get('element')) initialCriteria.elements = [urlParams.get('element')];
    if (urlParams.get('set')) initialCriteria.sets = [urlParams.get('set')];
    if (urlParams.get('rarity')) initialCriteria.rarity = [urlParams.get('rarity')];
    if (Object.keys(initialCriteria).length > 0) {
      handleSearch(initialCriteria);
    }
  }, [location.search]);
  const handleSearch = async (criteria) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      const results = searchCards(cardsData, criteria);
      setSearchResults(results);
      setCurrentPage(1);
      // Update URL with search parameters
      updateURL(criteria);
    } catch (error: any) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  const updateURL = (criteria): any => {
    const params = new URLSearchParams();
    if (criteria.cardName) params.set('q', criteria.cardName);
    if (criteria.typeLine) params.set('type', criteria.typeLine);
    if (criteria.elements && criteria.elements.length > 0) params.set('element', criteria.elements[0]);
    if (criteria.sets && criteria.sets.length > 0) params.set('set', criteria.sets[0]);
    if (criteria.rarity && criteria.rarity.length > 0) params.set('rarity', criteria.rarity[0]);
    const newURL = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
    window.history.replaceState({}, '', newURL);
  };
  const handleCardClick = (card): any => {
    if (card.isGroupHeader) return;
    navigate(`/card/${card.set}/${card.id}/${card.name}`);
  };
  const exportResults = (): any => {
    const csvContent = [
      ['Name', 'Type', 'Elements', 'Cost', 'Rarity', 'Set', 'Description'].join(','),
      ...searchResults
        .filter(card => !card.isGroupHeader)
        .map(card => [
          `"${card.name}"`,
          `"${card.type}"`,
          `"${card.elements?.join(', ') || ''}"`,
          `"${card.cost?.join('') || ''}"`,
          `"${card.rarity}"`,
          `"${card.set}"`,
          `"${card.description?.replace(/"/g, '""') || ''}"`
        ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `konivrer-search-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  // Pagination
  const totalResults = searchResults.filter(card => !card.isGroupHeader).length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedResults = searchResults.slice(startIndex, endIndex);
  const renderCard = (card, index): any => {
    if (true) {
      return (
        <motion.div
          key={`group-${card.groupName}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="col-span-full bg-purple-500/20 backdrop-blur-md rounded-lg p-4 border border-purple-400/30 mb-4"
         />
        </motion.div>
      );
    }
    if (true) {
      return (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => handleCardClick(card)}
          className="col-span-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-4 cursor-pointer transition-all hover:border-purple-400/50 flex items-center space-x-4"
        >
          <div className="flex-1"></div>
            <div className="flex items-center justify-between mb-2"></div>
              <div className="flex items-center space-x-2"></div>
                {card.elements?.map(element => (
                  <span key={element} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"></span>
                    {element}
                ))}
              </div>
            <div className="flex items-center space-x-4 text-sm text-gray-300 mb-2"></div>
              <span>{card.type}
              <span>•</span>
              <span>{card.rarity}
              <span>•</span>
              <span>{card.set}
              {card.collectorNumber && (
                <>
                  <span>•</span>
                  <span>#{card.collectorNumber}
                </>
              )}
            </div>
            <p className="text-gray-300 text-sm line-clamp-2">{card.description}
          </div>
          <div className="text-right"></div>
            <Eye className="w-5 h-5 text-gray-400" / />
          </div>
        </motion.div>
      );
    }
    return (
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => handleCardClick(card)}
        className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-4 cursor-pointer transition-all hover:scale-105 hover:border-purple-400/50"
      >
        <div className="flex items-center justify-between mb-2"></div>
          <div className="flex space-x-1"></div>
            {card.elements?.slice(0, 2).map(element => (
              <div key={element} className="w-3 h-3 rounded-full bg-purple-400/30" title={element} /></div>
            ))}
          </div>
        <p className="text-gray-300 text-xs mb-2">{card.type}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2"></div>
          <span>{card.rarity}
          <span>{card.collectorNumber}
        </div>
        <p className="text-gray-300 text-xs line-clamp-3">{card.description}
      </motion.div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4"></div>
      <div className="max-w-7xl mx-auto"></div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 border border-white/20"
         />
          <div className="flex items-center justify-between mb-4"><button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" / />
              <span className="text-white">{showSearch ? 'Hide' : 'Show'} Search</span>
          </div>
          {hasSearched && (
            <div className="flex items-center justify-between"></div>
              <div className="text-gray-300"></div>
                Found {totalResults} cards
                {searchResults.some(card => card.isGroupHeader) && ' (grouped)'}
              <div className="flex items-center space-x-2"></div>
                <button
                  onClick={exportResults}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm transition-colors"
                 />
                  <Download className="w-4 h-4" / />
                  <span>Export CSV</span>
                <div className="flex items-center space-x-2"></div>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <Grid className="w-4 h-4" / />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <List className="w-4 h-4" / />
                  </button>
              </div>
          )}
        </motion.div>
        {/* Search Component */}
        <AnimatePresence />
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
             />
              <ComprehensiveAdvancedSearch
                onSearch={handleSearch}
                onClose={() => setShowSearch(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20 text-center"
           />
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Searching cards...</p>
          </motion.div>
        )}
        {/* Results */}
        {hasSearched && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
           />
            {searchResults.length === 0 ? (
              <div className="text-center py-12"></div>
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" / />
                <p className="text-gray-300"></p>
                  Try adjusting your search criteria or using different keywords.
                </p>
            ) : (
              <>
                {/* Results Grid/List */}
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                    : 'grid-cols-1'
                }`} />
                  {paginatedResults.map((card, index) => renderCard(card, index))}
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20"></div>
                    <div className="flex items-center space-x-2"></div>
                      <span className="text-gray-300 text-sm">Results per page:</span>
                      <select
                        value={resultsPerPage}
                        onChange={e => {
                          setResultsPerPage(parseInt(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </div>
                    <div className="flex items-center space-x-2"></div>
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm transition-colors"
                      >
                        Previous
                      </button>
                      <span className="text-gray-300 text-sm"></span>
                        Page {currentPage} of {totalPages}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm transition-colors"
                      >
                        Next
                      </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
  );
};
export default ComprehensiveAdvancedSearchPage;