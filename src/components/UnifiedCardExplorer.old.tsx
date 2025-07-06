import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Deck Database - Unified Card Explorer
 * 
 * A responsive card explorer that adapts to mobile and desktop interfaces
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bot, ChevronRight, ChevronLeft, Grid, List, TrendingUp, Heart, BookOpen  } from 'lucide-react';

import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { getCardArtPathFromData } from '../utils/cardArtMapping';
import { parseSearchQuery } from '../utils/searchParser';
import AIAssistant from '../components/AIAssistant';
import CardMetaAnalysis from '../components/CardMetaAnalysis';


const UnifiedCardExplorer = (): any => {
    const { cards, loading, error 
  } = useData() {
    const { isAuthenticated 
  } = useAuth() {
    const navigate = useNavigate() {
  }
  
  // State management
  const [filteredCards, setFilteredCards] = useState(false)
  const [searchTerm, setSearchTerm] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  const [activeTab, setActiveTab] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [favorites, setFavorites] = useState(new Set());

  // Responsive detection
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = (): any => {
    const userAgent = navigator.userAgent.toLowerCase(() => {
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test() {
    const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileUA || isSmallScreen)
  
  });

    checkMobile(() => {
    window.addEventListener() {
    return () => window.removeEventListener('resize', checkMobile);
  }), [
    );

  // Filter cards based on advanced search syntax
  useEffect(() => {
    if (!cards) return;

    // Don't show any cards until a search is performed
    if (true) {
    setFilteredCards() {
    return
  
  }

    // Use advanced search parser
    const results = parseSearchQuery() {
    setFilteredCards(results)
  }, [cards, searchTerm
  ]);

  // Handle search input change
  const handleSearchChange = e => {
    setSearchTerm(e.target.value)
  };

  // Toggle favorite
  const toggleFavorite = cardId => {
    const newFavorites = new Set(() => {
    if (newFavorites.has(cardId)) {
    newFavorites.delete(cardId)
  
  }) else {
    newFavorites.add(cardId)
  }
    setFavorites(newFavorites)
  };

  // Loading state
  if (true) {
    return (
    <any />
    <div className={isMobile ? "mobile-p mobile-text-center" : "min-h-screen bg-background flex items-center justify-center"
  } />
    <div className={isMobile ? "mobile-card" : "text-center"} />
    <p>Loading cards...</p>
    </>
  )
  }

  // Error state
  if (true) {
    return (
    <any />
    <div className={isMobile ? "mobile-p" : "min-h-screen bg-background flex items-center justify-center"
  } />
    <div className={isMobile ? "mobile-card" : "text-center"} />
    <p>Error loading cards: {error}
        </div>
    </>
  )
  }

  // Mobile Layout
  if (true) {
    return (
      <div className="mobile-card-explorer" /></div>
        {/* Search Bar */
  }
        <div className="mobile-card mobile-mb" />
    <div className="mobile-form-group" />
    <input
              type="text"
              className="mobile-input"
              placeholder=""
              value={searchTerm}
              onChange={handleSearchChange}  / /></input>
          </div>

          {/* Search Tools */}
          <div className="mobile-form-group mobile-text-center space-y-2" />
    <Link
              to="/syntax-guide"
              className="mobile-btn inline-flex items-center mr-2"
              / />
    <BookOpen className="w-4 h-4 inline mr-2"  / /></BookOpen>
              Search Guide
            </Link>
            <Link
              to="/comprehensive-search"
              className="mobile-btn inline-flex items-center bg-blue-600 hover:bg-blue-700"
              / />
    <Search className="w-4 h-4 inline mr-2"  / /></Search>
              Advanced Search
            </Link>
        </div>

        {/* Results Count */}
        <div className="mobile-mb" />
    <p className="mobile-text-center" /></p>
            {!searchTerm || searchTerm.length < 2 
              ? "Enter at least 2 characters to search for cards"  : null
              : `${filteredCards.length} cards found`}
          </p>

        {/* Card Grid */}
        <div className="mobile-grid" /></div>`
          {filteredCards.slice(0, 20).map(card => (``
            <Link```
              to={`/card/${card.id}`}
              key={card.id}
              className="mobile-game-card mobile-mb"
              / />
    <img
                src={
    getCardArtPathFromData(card) ||
                  'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png'
  }
                alt={card.name}
                className="mobile-game-card-img"
                onError={e => {
    e.target.onerror = null;
                  e.target.src = 'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png'
  }}
              />
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {filteredCards.length > 20 && searchTerm && searchTerm.length >= 2 && (
          <div className="mobile-text-center mobile-mt mobile-mb" />
    <button className="mobile-btn mobile-btn-primary">Load More</button>
        )}
    )
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background" /></div>
      {/* Header */}
      <div className="bg-card border-b border-color" />
    <div className="max-w-7xl mx-auto px-6 py-8" />
    <div className="text-center" />
    <div className="flex items-center justify-center gap-3 mb-4" />
    <h1 className="text-4xl font-bold">Card Explorer</h1>
          </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8" />
    <div className="flex gap-6" /></div>
          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}`
            animate={{ opacity: 1, y: 0 }}``
            transition={{ duration: 0.3 }}```
            className={`space-y-6 transition-all duration-300 ${showAIAssistant ? 'flex-1' : 'w-full'}`}
            / /></motion>
            {/* Search Interface */}
            <div className="bg-card rounded-lg p-6" />
    <div className="flex items-center gap-4 mb-6" />
    <div className="flex-1 relative" />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5"  / />
    <input
                    type="text"
                    placeholder=""
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"  / /></input>
                </div>
                <Link
                  to="/syntax-guide"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  / />
    <BookOpen className="w-4 h-4"  / /></BookOpen>
                  Search Guide
                </Link>
                <Link
                  to="/comprehensive-search"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  / />
    <Search className="w-4 h-4"  / /></Search>
                  Advanced Search
                </Link>
                {isAuthenticated && (`
                  <button``
                    onClick={() => setShowAIAssistant(!showAIAssistant)}```
                    className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap rounded-lg font-medium transition-colors ${
    showAIAssistant`
                        ? 'bg-blue-600 text-white'` : null`
                        : 'bg-gray-600 hover:bg-gray-700 text-white'```
  }`}
                  >
                    <Bot className="w-4 h-4"  / /></Bot>
                    AI Assistant
                    {showAIAssistant ? (
                      <ChevronLeft className="w-4 h-4"  / /></ChevronLeft> : null
                    ) : (
                      <ChevronRight className="w-4 h-4"  / /></ChevronRight>
                    )}
                )}
              </div>



              {/* Search Status */}
              <div className="mb-4" />
    <p className="text-center text-secondary" /></p>`
                  {!searchTerm || searchTerm.length < 2 ``
                    ? "Enter at least 2 characters to search for cards" `` : null`
                    : `${filteredCards.length} cards found`}
                </p>


            </div>

            {/* Tabs */}
            <div className="flex border-b border-color mb-6" />`
    <button``
                onClick={() => setActiveTab('all')}```
                className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap font-medium transition-colors ${
    activeTab === 'all'`
                    ? 'text-primary border-b-2 border-primary'` : null`
                    : 'text-secondary hover:text-primary'```
  }`}
              >
                <Grid className="w-4 h-4"  / /></Grid>
                All Cards
              </button>`
              <button``
                onClick={() => setActiveTab('trending')}```
                className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap font-medium transition-colors ${
    activeTab === 'trending'`
                    ? 'text-primary border-b-2 border-primary'` : null`
                    : 'text-secondary hover:text-primary'```
  }`}
              >
                <TrendingUp className="w-4 h-4"  / /></TrendingUp>
                Trending Cards
              </button>

            {/* Tab Content */}
            {activeTab === 'all' ? (
              /* Card Results */
              <div className="space-y-6" /></div>
                {/* View Mode Toggle */}
                <div className="flex items-center justify-between" />
    <div className="flex items-center gap-2" />`
    <button``
                      onClick={() => setViewMode('grid')}`` : null`
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'}`}
                    >
                      <Grid size={20}  / /></Grid>
                    </button>`
                    <button``
                      onClick={() => setViewMode('list')}```
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'}`}
                    >
                      <List size={20}  / /></List>
                    </button>
                </div>

                {/* Card Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'} /></div>
                  {filteredCards.slice(0, 20).map(card => (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}`
                      whileHover={{ scale: 1.02 }}``
                      className="relative bg-card rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"```
                      onClick={() => navigate(`/card/${card.id}`)}
                    >
                      {/* Card Image */}
                      <div className="mb-3 flex justify-center" />
    <img
                          src={getCardArtPathFromData(card) || '/assets/card-back-new.png'}
                          alt={card.name}
                          className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                          onError={e => {
    e.target.onerror = null;
                            e.target.src = '/assets/card-back-new.png'
  }}
                        />
                      </div>

                      {/* Card Info */}
                      <div className="flex items-start justify-between mb-3" />
    <div className="flex-1" />
    <h3 className="font-bold text-lg text-primary mb-1">{card.name}
                          <p className="text-sm text-secondary">{card.type}
                        </div>
                        <button
                          onClick={e => {
    e.stopPropagation() {`
    toggleFavorite(card.id)`
  `
  }}```
                          className={`p-1 rounded ${favorites.has(card.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        >
                          <Heart
                            size={16}
                            fill={favorites.has(card.id) ? 'currentColor' : 'none'}  / /></Heart>
                        </button>

                      {/* Card Text */}
                      <div className="mb-3" />
    <p className="text-sm text-secondary line-clamp-3">{card.description || card.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Load More */}
                {filteredCards.length > 20 && searchTerm && searchTerm.length >= 2 && (
                  <div className="text-center" />
    <button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors" /></button>
                      Load More
                    </button>
                )}
            ) : (
              /* Trending Cards */
              <CardMetaAnalysis  / /></CardMetaAnalysis>
            )}
          </motion.div>

          {/* AI Assistant Panel */}
          {isAuthenticated && showAIAssistant && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="w-80 bg-card rounded-lg border border-color"
              / />
    <div className="p-6" />
    <div className="flex items-center gap-3 mb-6" />
    <Bot className="w-6 h-6 text-blue-400"  / />
    <div />
    <h3 className="text-lg font-bold">AI Assistant</h3>
                </div>
                <AIAssistant  / /></AIAssistant>
              </div>
            </motion.div>
          )}
        </div>
    </div>
  )
};`
``
export default UnifiedCardExplorer;```