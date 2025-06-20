import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book,
  Search,
  Bookmark,
  Download,
  Share2,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const RulesCenter = () => {
  const [rulesData, setRulesData] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedRules, setBookmarkedRules] = useState(new Set());

  useEffect(() => {
    // Load rules data
    import('../data/rules.json')
      .then(data => setRulesData(data.default || data))
      .catch(err => console.error('Failed to load rules:', err));
  }, []);

  const toggleBookmark = ruleId => {
    const newBookmarks = new Set(bookmarkedRules);
    if (newBookmarks.has(ruleId)) {
      newBookmarks.delete(ruleId);
    } else {
      newBookmarks.add(ruleId);
    }
    setBookmarkedRules(newBookmarks);
  };

  // Define the recommended learning order
  const sectionOrder = [
    'overview',
    'setup', 
    'deckBuilding',
    'turnStructure',
    'playingCards',
    'combat',
    'elementsAndKeywords',
    'quickReference'
  ];

  const getCurrentSectionIndex = () => {
    return sectionOrder.indexOf(activeSection);
  };

  const goToNextSection = () => {
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex < sectionOrder.length - 1) {
      setActiveSection(sectionOrder[currentIndex + 1]);
    }
  };

  const goToPreviousSection = () => {
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex > 0) {
      setActiveSection(sectionOrder[currentIndex - 1]);
    }
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
      if (key === 'lastUpdated' || key === 'version') return false;
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        section.title?.toLowerCase().includes(searchLower) ||
        section.content?.toLowerCase().includes(searchLower) ||
        section.keywords?.some(keyword =>
          keyword.toLowerCase().includes(searchLower),
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
                {filteredSections.map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeSection === key
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>

              {/* Navigation Help */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-3">
                  Learning Path
                </h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <div className="text-xs text-gray-400">Recommended order for new players:</div>
                  <div className="space-y-1">
                    <div className="text-blue-300">1. Game Overview</div>
                    <div className="text-blue-300">2. Setup & Game Zones</div>
                    <div className="text-blue-300">3. Deck Building</div>
                    <div className="text-blue-300">4. Turn Structure</div>
                    <div className="text-blue-300">5. Playing Cards</div>
                    <div className="text-blue-300">6. Combat</div>
                    <div className="text-blue-300">7. Elements & Keywords</div>
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
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {rulesData[activeSection]?.icon}
                      </span>
                      <h2 className="text-3xl font-bold text-white">
                        {rulesData[activeSection]?.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => toggleBookmark(activeSection)}
                      className={`p-2 rounded-lg transition-colors ${
                        bookmarkedRules.has(activeSection)
                          ? 'text-yellow-400 bg-yellow-400/20'
                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Section Content */}
                  <div className="prose prose-invert max-w-none">
                    <div
                      className="text-gray-300 leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: rulesData[activeSection]?.content?.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="text-white font-semibold">$1</strong>',
                        ),
                      }}
                    />

                    {/* Keywords */}
                    {rulesData[activeSection]?.keywords && (
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <div className="text-sm text-blue-300 font-medium mb-3">
                          Related Keywords:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {rulesData[activeSection].keywords.map(keyword => (
                            <span
                              key={keyword}
                              className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-sm hover:bg-blue-600/40 transition-colors cursor-pointer"
                              onClick={() => setSearchTerm(keyword)}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center">
                      <button
                        onClick={goToPreviousSection}
                        disabled={getCurrentSectionIndex() === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          getCurrentSectionIndex() === 0
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-blue-300 hover:text-blue-200 hover:bg-blue-600/20'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      
                      <div className="text-sm text-gray-400">
                        {getCurrentSectionIndex() + 1} of {sectionOrder.length}
                      </div>
                      
                      <button
                        onClick={goToNextSection}
                        disabled={getCurrentSectionIndex() === sectionOrder.length - 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          getCurrentSectionIndex() === sectionOrder.length - 1
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-blue-300 hover:text-blue-200 hover:bg-blue-600/20'
                        }`}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
