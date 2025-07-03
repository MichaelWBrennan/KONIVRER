/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Bot,
  ChevronRight,
  ChevronLeft,
  Grid,
  TrendingUp,
} from 'lucide-react';
import CardDatabase from '../components/CardDatabase';
import AdvancedSearch from '../components/AdvancedSearch';
import AIAssistant from '../components/AIAssistant';
import CardMetaAnalysis from '../components/CardMetaAnalysis';
import { useAuth } from '../contexts/AuthContext';

const CardExplorer = () => {
  const { isAuthenticated } = useAuth();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [activeSearchCriteria, setActiveSearchCriteria] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'trending'

  const handleAdvancedSearch = criteria => {
    setActiveSearchCriteria(criteria);
    setShowAdvancedSearch(false);
    // Mock search results
    setSearchResults([
      { id: 1, name: 'Lightning Bolt', type: 'Spell', rarity: 'Common' },
      { id: 2, name: 'Forest Guardian', type: 'Familiar', rarity: 'Rare' },
    ]);
  };

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
                    placeholder=""
                    className="w-full pl-10 pr-4 py-3 border border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowAdvancedSearch(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 px-2 py-0 whitespace-nowrap text-sm font-medium"
                >
                  <Filter className="w-4 h-4" />
                </button>
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

              {activeSearchCriteria && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">
                      Active search: {JSON.stringify(activeSearchCriteria)}
                    </span>
                    <button
                      onClick={() => {
                        setActiveSearchCriteria(null);
                        setSearchResults(null);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
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
              /* Card Database */
              <CardDatabase
                cards={searchResults}
                searchCriteria={activeSearchCriteria}
                showSearchInterface={true}
              />
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

        {/* Advanced Search Modal */}
        {showAdvancedSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAdvancedSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <AdvancedSearch
                onSearch={handleAdvancedSearch}
                onClose={() => setShowAdvancedSearch(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CardExplorer;
