import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const RulesCenter = () => {
  const [rulesData, setRulesData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']));

  useEffect(() => {
    // Load rules data
    const loadRulesData = async () => {
      try {
        const data = await import('../data/rules.json');
        console.log('Rules data loaded in component:', data);

        // Check if data is valid
        if (
          !data ||
          (typeof data === 'object' && Object.keys(data).length === 0)
        ) {
          console.error('Rules data is empty or invalid');
          setRulesData({
            overview: {
              title: 'Game Overview',
              icon: '📖',
              content:
                'Rules data is currently unavailable. Please check back later.',
              keywords: ['overview'],
            },
          });
          return;
        }

        setRulesData(data.default || data);
      } catch (err) {
        console.error('Failed to load rules:', err);
        // Set fallback data
        setRulesData({
          overview: {
            title: 'Game Overview',
            icon: '📖',
            content:
              'Rules data is currently unavailable. Please check back later.',
            keywords: ['overview'],
          },
        });
      }
    };

    loadRulesData();
  }, []);

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (!rulesData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredSections = rulesData
    ? Object.entries(rulesData).filter(([key, section]) => {
        try {
          // Skip metadata fields
          if (key === 'lastUpdated' || key === 'version') return false;

          // If no search term, include all sections
          if (!searchTerm) return true;

          // Search in title and content for any word
          const searchLower = searchTerm.toLowerCase();
          return (
            (section.title &&
              section.title.toLowerCase().includes(searchLower)) ||
            (section.content &&
              section.content.toLowerCase().includes(searchLower))
          );
        } catch (error) {
          console.error(`Error filtering section ${key}:`, error);
          return false;
        }
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">


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
                placeholder="Search rules and content..."
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

        {/* Rules Sections as Dropdowns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredSections.map(([key, section]) => (
            <div key={key} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
              {/* Section Header - Clickable */}
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors border-b border-white/10"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl" aria-hidden="true">
                    {section.icon || '📖'}
                  </span>
                  <h2 className="text-2xl font-bold text-white tracking-wide">
                    {section.title || 'Rules Section'}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 hidden sm:block">
                    {expandedSections.has(key) ? 'Collapse' : 'Expand'}
                  </span>
                  {expandedSections.has(key) ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Section Content - Collapsible */}
              <AnimatePresence>
                {expandedSections.has(key) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 py-6 bg-white/5">
                      <div className="max-w-none">
                        {section?.content ? (
                          <div className="text-gray-200 leading-relaxed space-y-6">
                            {section.content.split('\n\n').map((paragraph, index) => {
                              // Skip empty paragraphs
                              if (!paragraph.trim()) return null;
                              
                              // Handle headers (lines that start with #)
                              if (paragraph.startsWith('#')) {
                                const headerLevel = paragraph.match(/^#+/)[0].length;
                                const headerText = paragraph.replace(/^#+\s*/, '');
                                const HeaderTag = `h${Math.min(headerLevel + 2, 6)}`;
                                
                                return (
                                  <div key={index} className={`${headerLevel === 1 ? 'text-2xl' : headerLevel === 2 ? 'text-xl' : 'text-lg'} font-bold text-white mt-8 mb-4 first:mt-0`}>
                                    {headerText}
                                  </div>
                                );
                              }
                              
                              // Handle lists (lines that start with - or *)
                              if (paragraph.includes('\n-') || paragraph.includes('\n*') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
                                const listItems = paragraph.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
                                if (listItems.length > 0) {
                                  return (
                                    <ul key={index} className="list-disc list-inside space-y-3 ml-6 text-base">
                                      {listItems.map((item, itemIndex) => (
                                        <li key={itemIndex} className="text-gray-200 leading-relaxed">
                                          <span dangerouslySetInnerHTML={{
                                            __html: item.replace(/^[-*]\s*/, '').replace(
                                              /\*\*(.*?)\*\*/g,
                                              '<strong class="text-white font-semibold">$1</strong>'
                                            )
                                          }} />
                                        </li>
                                      ))}
                                    </ul>
                                  );
                                }
                              }
                              
                              // Handle numbered lists
                              if (paragraph.match(/^\d+\./)) {
                                const listItems = paragraph.split('\n').filter(line => line.trim().match(/^\d+\./));
                                if (listItems.length > 0) {
                                  return (
                                    <ol key={index} className="list-decimal list-inside space-y-3 ml-6 text-base">
                                      {listItems.map((item, itemIndex) => (
                                        <li key={itemIndex} className="text-gray-200 leading-relaxed">
                                          <span dangerouslySetInnerHTML={{
                                            __html: item.replace(/^\d+\.\s*/, '').replace(
                                              /\*\*(.*?)\*\*/g,
                                              '<strong class="text-white font-semibold">$1</strong>'
                                            )
                                          }} />
                                        </li>
                                      ))}
                                    </ol>
                                  );
                                }
                              }
                              
                              // Regular paragraphs
                              return (
                                <p key={index} className="text-gray-200 leading-relaxed text-base">
                                  <span dangerouslySetInnerHTML={{
                                    __html: paragraph.replace(
                                      /\*\*(.*?)\*\*/g,
                                      '<strong class="text-white font-semibold">$1</strong>'
                                    )
                                  }} />
                                </p>
                              );
                            }).filter(Boolean)}
                          </div>
                        ) : (
                          <div className="text-gray-300 leading-relaxed">
                            <p>Content for this section is not available.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>


      </div>
    </div>
  );
};

export default RulesCenter;
