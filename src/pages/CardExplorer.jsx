import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Search,
  Filter,
  Bot,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import CardDatabase from '../components/CardDatabase';
import AdvancedSearch from '../components/AdvancedSearch';
import AIAssistant from '../components/AIAssistant';

const CardExplorer = () => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [activeSearchCriteria, setActiveSearchCriteria] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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
              <Database className="w-8 h-8 text-blue-500" />
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
                    placeholder="Quick search cards, decks, players... or use Advanced Search for detailed filtering"
                    className="w-full pl-10 pr-4 py-3 border border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowAdvancedSearch(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Advanced Search
                </button>
                <button
                  onClick={() => setShowAIAssistant(!showAIAssistant)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
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

            {/* Card Database */}
            <CardDatabase
              cards={searchResults}
              searchCriteria={activeSearchCriteria}
              showSearchInterface={true}
            />
          </motion.div>

          {/* AI Assistant Panel */}
          {showAIAssistant && (
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
                    <p className="text-secondary text-sm">
                      Get card recommendations and insights
                    </p>
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
