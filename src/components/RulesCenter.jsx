import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book,
  Search,
  ChevronRight,
  ChevronDown,
  Bookmark,
  ExternalLink,
  Filter,
  Download,
  Share2,
  Lightbulb,
  Zap,
  Shield,
  Target,
  Layers,
  Settings,
} from 'lucide-react';

const RulesCenter = () => {
  const [rulesData, setRulesData] = useState(null);
  const [activeSection, setActiveSection] = useState('basicRules');
  const [expandedSections, setExpandedSections] = useState(new Set(['setup']));
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedRules, setBookmarkedRules] = useState(new Set());

  useEffect(() => {
    // Load rules data
    import('../data/rules.json')
      .then(data => setRulesData(data.default || data))
      .catch(err => console.error('Failed to load rules:', err));
  }, []);

  const toggleSection = sectionId => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleBookmark = ruleId => {
    const newBookmarks = new Set(bookmarkedRules);
    if (newBookmarks.has(ruleId)) {
      newBookmarks.delete(ruleId);
    } else {
      newBookmarks.add(ruleId);
    }
    setBookmarkedRules(newBookmarks);
  };

  const sectionIcons = {
    gameBasics: Book,
    deckBuilding: Settings,
    setup: Layers,
    gameplay: Target,
    elements: Zap,
    keywords: Lightbulb,
    cardTypes: Shield,
    alphabet: ExternalLink,
  };

  const elementSymbols = {
    Quintessence: '⚪',
    Inferno: '🔥',
    Submerged: '💧',
    Steadfast: '🌱',
    Brilliance: '⚡',
    Void: '🌑',
  };

  if (!rulesData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredSections = Object.entries(rulesData).filter(
    ([key, section]) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        section.title?.toLowerCase().includes(searchLower) ||
        (section.sections &&
          Object.values(section.sections).some(
            s =>
              s.title?.toLowerCase().includes(searchLower) ||
              s.content?.toLowerCase().includes(searchLower),
          )) ||
        section.elements?.some(
          e =>
            e.name?.toLowerCase().includes(searchLower) ||
            e.description?.toLowerCase().includes(searchLower),
        ) ||
        section.keywords?.some(
          k =>
            k.name?.toLowerCase().includes(searchLower) ||
            k.description?.toLowerCase().includes(searchLower),
        )
      );
    },
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Book className="text-blue-400" />
            KONIVRER Rules Center
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Complete rules reference for the KONIVRER trading card game
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search rules, keywords, or mechanics..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-4">Sections</h3>
              <nav className="space-y-2">
                {Object.entries(rulesData).map(([key, section]) => {
                  const Icon = sectionIcons[key] || Book;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                        activeSection === key
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Reference */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-3">
                  Quick Reference
                </h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">
                    <div className="font-medium mb-1">Elements:</div>
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(elementSymbols).map(([name, symbol]) => (
                        <div key={name} className="flex items-center gap-1">
                          <span>{symbol}</span>
                          <span className="text-xs">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Section Header */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {rulesData[activeSection]?.title}
                    </h2>
                    {rulesData[activeSection]?.description && (
                      <p className="text-gray-300">
                        {rulesData[activeSection].description}
                      </p>
                    )}
                  </div>

                  {/* Regular Sections */}
                  {rulesData[activeSection]?.sections && (
                    <div className="space-y-6">
                      {Object.entries(rulesData[activeSection].sections).map(
                        ([sectionId, section]) => (
                          <div
                            key={sectionId}
                            className="border border-white/20 rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleSection(sectionId)}
                              className="w-full px-6 py-4 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                            >
                              <h3 className="text-xl font-semibold text-white text-left">
                                {section.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    toggleBookmark(sectionId);
                                  }}
                                  className={`p-1 rounded ${
                                    bookmarkedRules.has(sectionId)
                                      ? 'text-yellow-400'
                                      : 'text-gray-400 hover:text-yellow-400'
                                  }`}
                                >
                                  <Bookmark className="w-4 h-4" />
                                </button>
                                {expandedSections.has(sectionId) ? (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </button>
                            <AnimatePresence>
                              {expandedSections.has(sectionId) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-6 py-4 text-gray-300 leading-relaxed">
                                    {section.content}
                                    {section.keywords && (
                                      <div className="mt-4">
                                        <div className="text-sm text-blue-300 font-medium mb-2">
                                          Keywords:
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {section.keywords.map(keyword => (
                                            <span
                                              key={keyword}
                                              className="px-2 py-1 bg-blue-600/30 text-blue-200 rounded text-xs"
                                            >
                                              {keyword}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
              <Lightbulb className="w-5 h-5" />
              <span>Need help understanding a rule?</span>
            </div>
            <p className="text-sm text-gray-400">
              Join our community Discord or check out the tutorial videos for
              detailed explanations.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RulesCenter;
