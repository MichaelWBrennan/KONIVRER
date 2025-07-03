/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Share2, ChevronDown, ChevronUp } from 'lucide-react';

const RulesCenter = () => {
  const [rulesData, setRulesData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState(
    new Set(['overview']),
  );
  const [activeTab, setActiveTab] = useState('basic');

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
              title: '1. Game Overview',
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
            title: '1. Game Overview',
            content:
              'Rules data is currently unavailable. Please check back later.',
            keywords: ['overview'],
          },
        });
      }
    };

    loadRulesData();
  }, []);

  // Reset expanded sections when switching tabs
  useEffect(() => {
    if (activeTab === 'basic') {
      setExpandedSections(new Set(['overview']));
    } else if (activeTab === 'tournament') {
      setExpandedSections(new Set(['tournamentOverview']));
    } else if (activeTab === 'conduct') {
      setExpandedSections(new Set(['sportsmanship']));
    }
    setSearchTerm(''); // Clear search when switching tabs
  }, [activeTab]);

  // Tournament Rules Data
  const tournamentRulesData = {
    tournamentOverview: {
      title: "1. Tournament Overview",
      content: "KONIVRER tournaments are competitive events where players test their deck-building skills and strategic gameplay against other Conjurers.\n\n1.1 Tournament Types\n• Constructed - Players bring pre-built 40-card decks\n• Draft - Players build decks from booster packs during the event\n• Sealed - Players build decks from a fixed pool of cards\n\n1.2 Tournament Structure\n• Swiss rounds followed by single-elimination top cut\n• Match length: Best of 3 games\n• Time limit: 50 minutes per match\n\n1.3 Eligibility\n• All players must register before the tournament begins\n• Players must present valid identification when requested\n• Suspended players are prohibited from participation",
      keywords: ["tournament", "competitive", "constructed", "draft", "sealed"]
    },
    deckRegistration: {
      title: "2. Deck Registration and Verification",
      content: "2.1 Deck List Requirements\n• Must be submitted before the tournament begins\n• Include exact card names and quantities\n• Flag must be clearly identified\n• Deck must meet all construction rules\n• Legible handwriting or typed lists required\n\n2.2 Deck Verification\n• Random deck checks may occur between rounds\n• Players must present their deck exactly as registered\n• Illegal decks result in immediate disqualification\n• Players are responsible for deck legality\n\n2.3 Sideboard Rules\n• No sideboard allowed in standard tournaments\n• Special formats may allow 15-card sideboards\n• Sideboard cards must be clearly marked on deck list",
      keywords: ["deck registration", "verification", "deck list", "sideboard"]
    },
    matchProcedures: {
      title: "3. Match Procedures",
      content: "3.1 Pre-Game Procedures\n• Players present decks for opponent inspection\n• Determine who goes first using random method\n• Both players shuffle and present decks\n• Players draw opening hands\n\n3.2 During Games\n• Players must maintain clear game state\n• Announce all actions clearly\n• Call a judge for any disputes immediately\n• No outside assistance permitted\n\n3.3 Time Management\n• 50-minute rounds with 5 additional turns after time\n• Players must play at reasonable pace\n• Slow play warnings may be issued\n• Judges monitor pace of play\n\n3.4 End of Match\n• Report results to tournament staff immediately\n• Return to assigned seating area\n• No discussion of ongoing matches",
      keywords: ["match procedures", "time limit", "game state", "judges"]
    },
    penalties: {
      title: "4. Penalties and Infractions",
      content: "4.1 Warning Level\n• Minor procedural errors\n• First instance of looking at extra cards\n• Failure to maintain clear game state\n• Insufficient shuffling\n\n4.2 Game Loss\n• Deck or decklist problems\n• Drawing extra cards (repeated offense)\n• Marked cards\n• Tardiness (10+ minutes)\n\n4.3 Match Loss\n• Aggressive behavior toward opponents or staff\n• Intentional rule violations\n• Bribery or collusion\n• Unsporting conduct\n\n4.4 Disqualification\n• Cheating in any form\n• Serious unsporting conduct\n• Theft or destruction of property\n• Threatening behavior\n\n4.5 Appeals Process\n• Players may appeal penalties to head judge\n• Appeals must be made immediately\n• Head judge's decision is final\n• No appeals for disqualification",
      keywords: ["penalties", "infractions", "warnings", "disqualification", "appeals"]
    }
  };

  // Code of Conduct Data
  const codeOfConductData = {
    sportsmanship: {
      title: "1. Sportsmanship Standards",
      content: "1.1 Expected Behavior\n• Treat all players, judges, and staff with respect\n• Maintain a positive and welcoming environment\n• Accept wins and losses gracefully\n• Help new players learn the game\n• Arrive on time and prepared for matches\n\n1.2 Communication Standards\n• Use clear, respectful language at all times\n• Avoid profanity or offensive content\n• Keep discussions game-related during matches\n• Respect personal space and boundaries\n• Listen to and follow judge instructions\n\n1.3 Fair Play Principles\n• Play to the best of your ability\n• Do not intentionally mislead opponents\n• Call attention to your own mistakes\n• Respect the spirit of competition\n• Maintain integrity in all interactions",
      keywords: ["sportsmanship", "respect", "fair play", "communication"]
    },
    prohibitedBehavior: {
      title: "2. Prohibited Behavior",
      content: "2.1 Strictly Forbidden Actions\n• Cheating in any form\n• Harassment or discrimination of any kind\n• Threatening or violent behavior\n• Theft or destruction of property\n• Bribery or match fixing\n• Impersonation of tournament officials\n\n2.2 Unsporting Conduct\n• Intentional slow play or stalling\n• Excessive celebration or taunting\n• Arguing with judges or staff decisions\n• Disrupting other matches or events\n• Using electronic devices during matches without permission\n• Sharing information about ongoing matches\n\n2.3 Consequences for Violations\n• Violations may result in warnings, game losses, or disqualification\n• Serious violations may lead to suspension from future events\n• Criminal behavior will be reported to appropriate authorities\n• Repeat offenders face escalating penalties",
      keywords: ["prohibited", "cheating", "harassment", "unsporting", "consequences"]
    },
    inclusivity: {
      title: "3. Inclusivity and Diversity Policy",
      content: "3.1 Our Commitment\n• KONIVRER welcomes players of all backgrounds\n• Zero tolerance policy for discrimination\n• Safe and inclusive environment for all participants\n• Accommodations available for players with disabilities\n• Equal treatment regardless of skill level\n\n3.2 Anti-Discrimination Policy\n• No discrimination based on race, gender, religion, sexual orientation, or disability\n• Offensive language, symbols, or imagery are prohibited\n• Report incidents to tournament staff immediately\n• All reports will be investigated thoroughly\n\n3.3 Accessibility Support\n• Reasonable accommodations will be provided when requested\n• Contact tournament organizers in advance for special needs\n• Alternative formats available when possible\n• Assistance available for players who require it\n• Interpreters available upon request",
      keywords: ["inclusivity", "diversity", "discrimination", "accessibility", "safe space"]
    },
    reporting: {
      title: "4. Reporting and Enforcement",
      content: "4.1 How to Report Violations\n• Speak to any judge or tournament staff member immediately\n• Use anonymous reporting forms when available\n• Contact tournament organizers directly\n• Email conduct@konivrer.com for serious issues\n• Emergency contact information posted at all events\n\n4.2 Investigation Process\n• All reports taken seriously and investigated promptly\n• Confidentiality maintained to the extent possible\n• Fair hearing provided for all parties involved\n• Appropriate action taken based on investigation findings\n• Appeals process available for disputed decisions\n\n4.3 Support Resources\n• Tournament staff trained in conflict resolution\n• Mental health resources available upon request\n• Player advocates available at major events\n• Follow-up support provided when needed\n• Referrals to external support services when appropriate",
      keywords: ["reporting", "enforcement", "investigation", "support", "resources"]
    }
  };

  const toggleSection = sectionId => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (!rulesData && activeTab === 'basic') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'tournament':
        return tournamentRulesData;
      case 'conduct':
        return codeOfConductData;
      default:
        return rulesData;
    }
  };

  const currentData = getCurrentData();

  const filteredSections = currentData
    ? Object.entries(currentData).filter(([key, section]) => {
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
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mb-6"
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-3 rounded-lg transition-all font-medium ${
                activeTab === 'basic'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Basic Rules
            </button>
            <button
              onClick={() => setActiveTab('tournament')}
              className={`px-6 py-3 rounded-lg transition-all font-medium ${
                activeTab === 'tournament'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Tournament Rules
            </button>
            <button
              onClick={() => setActiveTab('conduct')}
              className={`px-6 py-3 rounded-lg transition-all font-medium ${
                activeTab === 'conduct'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Code of Conduct
            </button>
          </div>
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
            <div
              key={key}
              className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden"
            >
              {/* Section Header - Clickable */}
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors border-b border-white/10"
              >
                <div className="flex items-center">
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
                            {section.content
                              .split('\n\n')
                              .map((paragraph, index) => {
                                // Skip empty paragraphs
                                if (!paragraph.trim()) return null;

                                // Handle headers (lines that start with #)
                                if (paragraph.startsWith('#')) {
                                  const headerLevel =
                                    paragraph.match(/^#+/)[0].length;
                                  const headerText = paragraph.replace(
                                    /^#+\s*/,
                                    '',
                                  );
                                  const HeaderTag = `h${Math.min(headerLevel + 2, 6)}`;

                                  return (
                                    <div
                                      key={index}
                                      className={`${headerLevel === 1 ? 'text-2xl' : headerLevel === 2 ? 'text-xl' : 'text-lg'} font-bold text-white mt-8 mb-4 first:mt-0`}
                                    >
                                      {headerText}
                                    </div>
                                  );
                                }

                                // Handle lists (lines that start with - or *)
                                if (
                                  paragraph.includes('\n-') ||
                                  paragraph.includes('\n*') ||
                                  paragraph.startsWith('-') ||
                                  paragraph.startsWith('*')
                                ) {
                                  const listItems = paragraph
                                    .split('\n')
                                    .filter(
                                      line =>
                                        line.trim().startsWith('-') ||
                                        line.trim().startsWith('*'),
                                    );
                                  if (listItems.length > 0) {
                                    return (
                                      <ul
                                        key={index}
                                        className="list-disc list-inside space-y-3 ml-6 text-base"
                                      >
                                        {listItems.map((item, itemIndex) => (
                                          <li
                                            key={itemIndex}
                                            className="text-gray-200 leading-relaxed"
                                          >
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html: item
                                                  .replace(/^[-*]\s*/, '')
                                                  .replace(
                                                    /\*\*(.*?)\*\*/g,
                                                    '<strong class="text-white font-semibold">$1</strong>',
                                                  ),
                                              }}
                                            />
                                          </li>
                                        ))}
                                      </ul>
                                    );
                                  }
                                }

                                // Handle numbered lists
                                if (paragraph.match(/^\d+\./)) {
                                  const listItems = paragraph
                                    .split('\n')
                                    .filter(line =>
                                      line.trim().match(/^\d+\./),
                                    );
                                  if (listItems.length > 0) {
                                    return (
                                      <ol
                                        key={index}
                                        className="list-decimal list-inside space-y-3 ml-6 text-base"
                                      >
                                        {listItems.map((item, itemIndex) => (
                                          <li
                                            key={itemIndex}
                                            className="text-gray-200 leading-relaxed"
                                          >
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html: item
                                                  .replace(/^\d+\.\s*/, '')
                                                  .replace(
                                                    /\*\*(.*?)\*\*/g,
                                                    '<strong class="text-white font-semibold">$1</strong>',
                                                  ),
                                              }}
                                            />
                                          </li>
                                        ))}
                                      </ol>
                                    );
                                  }
                                }

                                // Regular paragraphs
                                return (
                                  <p
                                    key={index}
                                    className="text-gray-200 leading-relaxed text-base"
                                  >
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: paragraph.replace(
                                          /\*\*(.*?)\*\*/g,
                                          '<strong class="text-white font-semibold">$1</strong>',
                                        ),
                                      }}
                                    />
                                  </p>
                                );
                              })
                              .filter(Boolean)}
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
