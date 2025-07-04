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
import { motion } from 'framer-motion';
import {
  Search,
  Bot,
  ChevronRight,
  ChevronLeft,
  Grid,
  List,
  TrendingUp,
  Heart,
  Eye,
  Plus,
  BookOpen,
} from 'lucide-react';

import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { getCardArtPathFromData } from '../utils/cardArtMapping';
import { parseSearchQuery } from '../utils/searchParser';
import AIAssistant from '../components/AIAssistant';
import CardMetaAnalysis from '../components/CardMetaAnalysis';
import KonivrERSyntaxGuide from '../components/KonivrERSyntaxGuide';

const UnifiedCardExplorer = () => {
  const { cards, loading, error } = useData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showSyntaxGuide, setShowSyntaxGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());

  // Responsive detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileUA || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter cards based on advanced search syntax
  useEffect(() => {
    if (!cards) return;

    // Don't show any cards until a search is performed
    if (!searchTerm || searchTerm.length < 2) {
      setFilteredCards([]);
      return;
    }

    // Use advanced search parser
    const results = parseSearchQuery(searchTerm, cards);
    setFilteredCards(results);
  }, [cards, searchTerm]);

  // Handle search input change
  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  // Toggle favorite
  const toggleFavorite = cardId => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(cardId)) {
      newFavorites.delete(cardId);
    } else {
      newFavorites.add(cardId);
    }
    setFavorites(newFavorites);
  };

  // Loading state
  if (loading) {
    return (
      <div className={isMobile ? "mobile-p mobile-text-center" : "min-h-screen bg-background flex items-center justify-center"}>
        <div className={isMobile ? "mobile-card" : "text-center"}>
          <p>Loading cards...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={isMobile ? "mobile-p" : "min-h-screen bg-background flex items-center justify-center"}>
        <div className={isMobile ? "mobile-card" : "text-center"}>
          <p>Error loading cards: {error}</p>
        </div>
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="mobile-card-explorer">
        {/* Search Bar */}
        <div className="mobile-card mobile-mb">
          <div className="mobile-form-group">
            <input
              type="text"
              className="mobile-input"
              placeholder="Search cards using advanced syntax (e.g., t:familiar e:brilliance)..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Syntax Guide Toggle */}
          <div className="mobile-form-group mobile-text-center">
            <button
              className="mobile-btn"
              onClick={() => setShowSyntaxGuide(!showSyntaxGuide)}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              {showSyntaxGuide ? 'Hide' : 'Show'} Search Guide
            </button>
          </div>

          {/* Syntax Guide */}
          {showSyntaxGuide && (
            <div className="mobile-mt">
              <KonivrERSyntaxGuide 
                isExpanded={showSyntaxGuide} 
                onToggle={() => setShowSyntaxGuide(!showSyntaxGuide)} 
              />
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mobile-mb">
          <p className="mobile-text-center">
            {!searchTerm || searchTerm.length < 2 
              ? "Enter at least 2 characters to search for cards" 
              : `${filteredCards.length} cards found`}
          </p>
        </div>

        {/* Card Grid */}
        <div className="mobile-grid">
          {filteredCards.slice(0, 20).map(card => (
            <Link
              to={`/card/${card.id}`}
              key={card.id}
              className="mobile-game-card mobile-mb"
            >
              <img
                src={
                  getCardArtPathFromData(card) ||
                  'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png'
                }
                alt={card.name}
                className="mobile-game-card-img"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://raw.githubusercontent.com/MichaelWBrennan/KONIVRER-deck-database/main/public/assets/card-back-new.png';
                }}
              />
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {filteredCards.length > 20 && searchTerm && searchTerm.length >= 2 && (
          <div className="mobile-text-center mobile-mt mobile-mb">
            <button className="mobile-btn mobile-btn-primary">Load More</button>
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl font-bold">Card Explorer</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`space-y-6 transition-all duration-300 ${showAIAssistant ? 'flex-1' : 'w-full'}`}
          >
            {/* Search Interface */}
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search cards using advanced syntax (e.g., t:familiar e:brilliance cmc:3)..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <KonivrERSyntaxGuide 
                  isExpanded={showSyntaxGuide} 
                  onToggle={() => setShowSyntaxGuide(!showSyntaxGuide)} 
                />
                {isAuthenticated && (
                  <button
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap rounded-lg font-medium transition-colors ${
                      showAIAssistant
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    AI Assistant
                    {showAIAssistant ? (
                      <ChevronLeft className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {/* Syntax Guide */}
              {showSyntaxGuide && (
                <div className="mb-6">
                  <KonivrERSyntaxGuide 
                    isExpanded={showSyntaxGuide} 
                    onToggle={() => setShowSyntaxGuide(!showSyntaxGuide)} 
                  />
                </div>
              )}

              {/* Search Status */}
              <div className="mb-4">
                <p className="text-center text-secondary">
                  {!searchTerm || searchTerm.length < 2 
                    ? "Enter at least 2 characters to search for cards" 
                    : `${filteredCards.length} cards found`}
                </p>
              </div>


            </div>

            {/* Tabs */}
            <div className="flex border-b border-color mb-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Grid className="w-4 h-4" />
                All Cards
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap font-medium transition-colors ${
                  activeTab === 'trending'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Trending Cards
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'all' ? (
              /* Card Results */
              <div className="space-y-6">
                {/* View Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'}`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'}`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>

                {/* Card Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                  {filteredCards.slice(0, 20).map(card => (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      className="relative bg-card rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
                      onClick={() => navigate(`/card/${card.id}`)}
                    >
                      {/* Card Image */}
                      <div className="mb-3 flex justify-center">
                        <img
                          src={getCardArtPathFromData(card) || '/assets/card-back-new.png'}
                          alt={card.name}
                          className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src = '/assets/card-back-new.png';
                          }}
                        />
                      </div>

                      {/* Card Info */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-primary mb-1">{card.name}</h3>
                          <p className="text-sm text-secondary">{card.type}</p>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleFavorite(card.id);
                          }}
                          className={`p-1 rounded ${favorites.has(card.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        >
                          <Heart
                            size={16}
                            fill={favorites.has(card.id) ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>

                      {/* Card Text */}
                      <div className="mb-3">
                        <p className="text-sm text-secondary line-clamp-3">{card.description || card.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Load More */}
                {filteredCards.length > 20 && searchTerm && searchTerm.length >= 2 && (
                  <div className="text-center">
                    <button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg transition-colors">
                      Load More
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Trending Cards */
              <CardMetaAnalysis />
            )}
          </motion.div>

          {/* AI Assistant Panel */}
          {isAuthenticated && showAIAssistant && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="w-80 bg-card rounded-lg border border-color"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bot className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-bold">AI Assistant</h3>
                  </div>
                </div>
                <AIAssistant />
              </div>
            </motion.div>
          )}
        </div>


      </div>
    </div>
  );
};

export default UnifiedCardExplorer;