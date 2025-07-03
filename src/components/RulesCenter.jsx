/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

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

  // Tournament Rules Data - Unified approach from MTG, Yu-Gi-Oh!, and Pokemon TCG
  const tournamentRulesData = {
    tournamentOverview: {
      title: "1. Tournament Overview",
      content: "KONIVRER tournaments are competitive events where players test their deck-building skills and strategic gameplay against other Conjurers.\n\n1.1 Tournament Types\n• Constructed - Players bring pre-built 40-card decks meeting format requirements\n• Limited Draft - Players build decks from booster packs during the event\n• Sealed Deck - Players build decks from a fixed pool of unopened product\n• Team Events - Multiple players compete as coordinated teams\n\n1.2 Tournament Structure\n• Swiss pairing system for preliminary rounds\n• Single-elimination playoffs for top performers\n• Match format: Best of 3 games with sideboarding between games\n• Time limits: 50 minutes per match plus additional turns\n\n1.3 Participation Requirements\n• Valid player registration with tournament organizer\n• Government-issued photo identification when requested\n• Compliance with all tournament policies and procedures\n• Players under suspension are prohibited from participation\n\n1.4 Tournament Roles\n• Tournament Organizer: Overall event management and logistics\n• Head Judge: Final authority on rules and penalty decisions\n• Floor Judges: Monitor matches and handle player questions\n• Scorekeeper: Maintain pairings, standings, and match results",
      keywords: ["tournament", "competitive", "constructed", "draft", "sealed", "swiss", "elimination"]
    },
    deckRegistration: {
      title: "2. Deck Registration and Verification",
      content: "2.1 Deck List Submission\n• Complete deck lists must be submitted before tournament begins\n• Include exact card names, quantities, and set information\n• Element Flag must be clearly identified and legal for format\n• Deck must conform to all construction restrictions\n• Lists must be legible with clear handwriting or typed format\n• Player name and tournament information required on all lists\n\n2.2 Deck Construction Verification\n• Random deck checks conducted between rounds by tournament staff\n• Players must present physical deck matching registered list exactly\n• Deck composition errors result in penalties up to disqualification\n• Players are solely responsible for deck legality and accuracy\n• Proxy cards prohibited except when authorized by head judge\n\n2.3 Sideboard Procedures\n• Standard tournaments: No sideboard permitted\n• Advanced formats: 15-card sideboard maximum when applicable\n• Sideboard cards must be clearly listed separately on deck registration\n• Between games, players may exchange cards between main deck and sideboard\n• Final deck configuration must match original main deck count\n\n2.4 Card Sleeves and Marking\n• Uniform card sleeves required for all tournaments\n• Sleeves must be opaque and in good condition without distinguishing marks\n• Marked or damaged sleeves must be replaced immediately\n• Tournament staff may require sleeve changes at any time",
      keywords: ["deck registration", "verification", "deck list", "sideboard", "sleeves", "construction"]
    },
    matchProcedures: {
      title: "3. Match Procedures",
      content: "3.1 Pre-Match Procedures\n• Players locate assigned seating and verify opponent identity\n• Present decks for opponent inspection and shuffling opportunity\n• Determine first player using random method (dice roll, coin flip)\n• Both players shuffle decks thoroughly and present to opponent\n• Draw opening hands and declare any mulligans\n• Begin game when both players are ready\n\n3.2 During Match Play\n• Maintain clear and organized game state at all times\n• Announce all game actions clearly and allow opponent response time\n• Call judge immediately for any rules questions or disputes\n• No outside assistance permitted from spectators or other players\n• Electronic devices must be silenced and face-down during matches\n• Note-taking permitted using pen and paper only\n\n3.3 Time Management\n• 50-minute rounds with official time announcements\n• When time expires, current turn completes plus 5 additional turns\n• Players must maintain reasonable pace of play throughout match\n• Slow play warnings issued for excessive delays\n• Judges monitor and may extend time for legitimate delays\n\n3.4 End-of-Match Procedures\n• Determine match winner based on games won\n• Complete match result slip with both player signatures\n• Report results to tournament staff immediately\n• Return to designated waiting area without discussing ongoing matches\n• Prepare for next round or elimination as directed",
      keywords: ["match procedures", "time limit", "game state", "judges", "shuffling", "pace"]
    },
    penalties: {
      title: "4. Penalties and Infractions",
      content: "4.1 Infraction Categories\n• Procedural Errors: Minor mistakes in game procedure or tournament rules\n• Tournament Errors: Deck problems, tardiness, or registration issues\n• Unsporting Conduct: Behavior that disrupts tournament environment\n• Cheating: Intentional rule violations or deceptive practices\n\n4.2 Penalty Guidelines\n• Warning: First offense for minor procedural errors, recorded officially\n• Game Loss: Serious procedural errors, deck problems, or repeated infractions\n• Match Loss: Significant unsporting conduct or major tournament violations\n• Disqualification: Cheating, severe misconduct, or repeated serious infractions\n\n4.3 Specific Infractions\n• Drawing Extra Cards: Warning for first offense, game loss for repeated\n• Marked Cards: Warning to game loss depending on pattern and advantage\n• Slow Play: Warning with instruction, escalating to game loss\n• Deck/Decklist Problems: Game loss, with deck corrected to match legal list\n• Tardiness: Warning at 5 minutes, game loss at 10 minutes, match loss at 15\n• Unsporting Conduct: Match loss to disqualification based on severity\n• Cheating: Immediate disqualification without prize eligibility\n\n4.4 Appeals Process\n• Players may appeal any penalty to the head judge immediately\n• Appeals must be made before continuing play or leaving tournament area\n• Head judge reviews circumstances and makes final determination\n• Appeals of disqualification are not permitted\n• Tournament organizer may review head judge decisions post-event",
      keywords: ["penalties", "infractions", "warnings", "disqualification", "appeals", "cheating"]
    },
    communication: {
      title: "5. Communication and Conduct",
      content: "5.1 Player Communication\n• Players must communicate clearly and honestly during matches\n• Game state information must be provided accurately when requested\n• Private information (hand contents, deck order) may not be revealed\n• Players may ask judges for clarification on rules or card interactions\n• Language barriers accommodated through judge assistance when possible\n\n5.2 Spectator Guidelines\n• Spectators must remain silent during active matches\n• No coaching, advice, or assistance to players permitted\n• Spectators may not point out missed triggers or game errors\n• Disruptive spectators will be removed from tournament area\n• Photography and recording subject to tournament organizer approval\n\n5.3 Judge Interactions\n• Players must follow all judge instructions immediately\n• Judges have authority to issue penalties and make rulings\n• Questions about rules or card interactions welcome at any time\n• Disputes with judge decisions may be appealed to head judge\n• Respectful communication required in all judge interactions\n\n5.4 Electronic Device Policy\n• Cell phones must be silenced and face-down during matches\n• No internet access permitted during tournament rounds\n• Calculators allowed for life point tracking only\n• Photography of opponent's cards or notes prohibited\n• Emergency communications handled through tournament staff",
      keywords: ["communication", "spectators", "judges", "electronic devices", "conduct"]
    },
    formats: {
      title: "6. Tournament Formats and Legality",
      content: "6.1 Constructed Formats\n• Standard: Current rotation sets with most recent banned/restricted list\n• Extended: Larger card pool spanning multiple years of releases\n• Legacy: All tournament-legal cards with comprehensive banned list\n• Pauper: Common cards only with format-specific restrictions\n\n6.2 Limited Formats\n• Booster Draft: Players draft from shared booster packs in pods\n• Sealed Deck: Players build from predetermined booster pack allocation\n• Team Draft: Teams of players draft and play coordinated matches\n• Cube Draft: Curated card pool designed for balanced draft environment\n\n6.3 Card Legality\n• Only tournament-legal cards permitted in sanctioned events\n• Cards must be in original language or approved translation\n• Promotional cards legal only when specifically authorized\n• Damaged cards may require replacement or judge approval\n• Counterfeit cards result in immediate disqualification\n\n6.4 Banned and Restricted Lists\n• Banned cards may not be included in any deck or sideboard\n• Restricted cards limited to specified quantities per deck\n• Lists updated periodically and effective on announced dates\n• Players responsible for checking current legality before events\n• Emergency bans may be implemented for tournament integrity",
      keywords: ["formats", "constructed", "limited", "legality", "banned", "restricted"]
    }
  };

  // Code of Conduct Data - Comprehensive standards from major TCG organizations
  const codeOfConductData = {
    sportsmanship: {
      title: "1. Sportsmanship and Fair Play",
      content: "1.1 Core Principles\n• Treat all participants with dignity, respect, and courtesy\n• Maintain the highest standards of competitive integrity\n• Accept victories and defeats with equal grace and composure\n• Foster a welcoming environment for players of all skill levels\n• Demonstrate exemplary behavior as a representative of the KONIVRER community\n\n1.2 Expected Conduct\n• Arrive punctually and prepared for all scheduled activities\n• Follow all tournament rules and procedures without exception\n• Communicate clearly and honestly with opponents and officials\n• Assist newer players in learning proper procedures when appropriate\n• Maintain focus and respect during matches and tournament activities\n\n1.3 Competitive Standards\n• Play to the best of your ability in every match\n• Make all decisions based on game strategy, not external factors\n• Acknowledge your own errors and rule violations promptly\n• Respect your opponent's right to think and make strategic decisions\n• Uphold the spirit of fair competition in all interactions\n\n1.4 Professional Behavior\n• Use appropriate language free from profanity or offensive content\n• Respect personal space and physical boundaries of all participants\n• Keep discussions focused on game-related topics during matches\n• Follow instructions from tournament staff immediately and completely\n• Represent yourself and the game positively at all times",
      keywords: ["sportsmanship", "respect", "fair play", "communication", "integrity", "professional"]
    },
    prohibitedBehavior: {
      title: "2. Prohibited Conduct and Violations",
      content: "2.1 Zero Tolerance Violations\n• Cheating, fraud, or any form of deceptive practice\n• Harassment, discrimination, or intimidation based on any personal characteristic\n• Threats of violence or actual physical confrontation\n• Theft, vandalism, or destruction of property\n• Bribery, collusion, or manipulation of tournament results\n• Impersonation of tournament officials or staff members\n\n2.2 Serious Misconduct\n• Intentional slow play or deliberate stalling tactics\n• Excessive celebration, taunting, or unsporting behavior toward opponents\n• Arguing with or showing disrespect toward judges and tournament staff\n• Disrupting other matches or tournament activities\n• Sharing strategic information about ongoing matches\n• Violating electronic device policies during competition\n\n2.3 Minor Infractions\n• Failure to maintain proper game state or follow tournament procedures\n• Using inappropriate language or engaging in disruptive conversation\n• Arriving late to scheduled matches or tournament activities\n• Failing to properly register or provide required documentation\n• Minor violations of dress code or tournament guidelines\n\n2.4 Consequences and Enforcement\n• Violations result in penalties ranging from warnings to permanent suspension\n• Serious misconduct may result in immediate removal from premises\n• Criminal behavior will be reported to appropriate law enforcement\n• Repeat offenders face escalating penalties and potential lifetime bans\n• All penalties are recorded and may affect future tournament eligibility",
      keywords: ["prohibited", "cheating", "harassment", "unsporting", "consequences", "violations"]
    },
    inclusivity: {
      title: "3. Diversity, Equity, and Inclusion",
      content: "3.1 Community Values\n• KONIVRER welcomes participants from all backgrounds and identities\n• Zero tolerance for discrimination based on race, gender, religion, sexual orientation, disability, or any other characteristic\n• Commitment to creating safe, inclusive spaces for all community members\n• Equal opportunities and treatment regardless of skill level or experience\n• Celebration of diversity as a strength of our gaming community\n\n3.2 Anti-Discrimination Policy\n• Discriminatory language, symbols, imagery, or behavior strictly prohibited\n• Offensive content on clothing, accessories, or personal items not permitted\n• Harassment or targeting of individuals based on personal characteristics forbidden\n• Retaliation against those reporting discrimination is itself a violation\n• All community members responsible for maintaining inclusive environment\n\n3.3 Accessibility and Accommodation\n• Reasonable accommodations provided for participants with disabilities\n• Alternative communication methods available when needed\n• Physical accessibility considerations addressed at all tournament venues\n• Assistance available for players requiring support during competition\n• Advance notice requested but not required for accommodation requests\n\n3.4 Reporting and Response\n• Multiple channels available for reporting discrimination or harassment\n• Anonymous reporting options provided when possible\n• Prompt investigation of all reported incidents\n• Appropriate corrective action taken based on investigation findings\n• Support resources available for affected community members",
      keywords: ["inclusivity", "diversity", "discrimination", "accessibility", "safe space", "accommodation"]
    },
    reporting: {
      title: "4. Reporting Procedures and Support",
      content: "4.1 Incident Reporting\n• Report violations immediately to any tournament judge or staff member\n• Anonymous reporting forms available at tournament registration\n• Direct contact with tournament organizers for serious concerns\n• Email conduct@konivrer.com for post-event reporting or ongoing issues\n• Emergency contact information prominently displayed at all events\n\n4.2 Investigation Process\n• All reports treated seriously and investigated thoroughly\n• Confidentiality maintained to the maximum extent possible\n• Fair and impartial hearing process for all parties involved\n• Evidence gathering and witness interviews conducted as appropriate\n• Timely resolution with clear communication of outcomes\n\n4.3 Appeals and Review\n• Appeals process available for disputed penalty decisions\n• Independent review board for serious disciplinary actions\n• Clear timeline and procedures for appeal submissions\n• Right to representation or advocacy during appeal process\n• Final decisions communicated in writing with reasoning provided\n\n4.4 Support Resources\n• Tournament staff trained in conflict resolution and crisis intervention\n• Mental health and counseling resources available upon request\n• Player advocates present at major tournaments and championship events\n• Follow-up support provided for participants affected by serious incidents\n• Referrals to external support services and resources when appropriate\n\n4.5 Community Education\n• Regular training sessions on conduct expectations and reporting procedures\n• Educational materials distributed at tournaments and online\n• Workshops on inclusive behavior and cultural competency\n• Mentorship programs pairing experienced players with newcomers\n• Ongoing dialogue about community standards and improvement opportunities",
      keywords: ["reporting", "enforcement", "investigation", "support", "resources", "appeals", "education"]
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
      <div className="container mx-auto px-4 py-4">
        {/* Search and Controls - Now on top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search rules and content..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </motion.div>

        {/* Tab Navigation - Now below search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-2 mb-4"
        >
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded-md transition-all font-medium text-sm ${
                activeTab === 'basic'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Basic Rules
            </button>
            <button
              onClick={() => setActiveTab('tournament')}
              className={`px-4 py-2 rounded-md transition-all font-medium text-sm ${
                activeTab === 'tournament'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Tournament Rules
            </button>
            <button
              onClick={() => setActiveTab('conduct')}
              className={`px-4 py-2 rounded-md transition-all font-medium text-sm ${
                activeTab === 'conduct'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Code of Conduct
            </button>
          </div>
        </motion.div>

        {/* Rules Sections as Dropdowns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          {filteredSections.map(([key, section]) => (
            <div
              key={key}
              className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden"
            >
              {/* Section Header - Clickable */}
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors border-b border-white/10"
              >
                <div className="flex items-center">
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    {section.title || 'Rules Section'}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {expandedSections.has(key) ? 'Collapse' : 'Expand'}
                  </span>
                  {expandedSections.has(key) ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
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
                    <div className="px-4 py-4 bg-white/5">
                      <div className="max-w-none">
                        {section?.content ? (
                          <div className="text-gray-200 leading-relaxed space-y-3 text-sm">
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
                                      className={`${headerLevel === 1 ? 'text-lg' : headerLevel === 2 ? 'text-base' : 'text-sm'} font-bold text-white mt-4 mb-2 first:mt-0`}
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
                                        className="list-disc list-inside space-y-1 ml-4 text-sm"
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
                                        className="list-decimal list-inside space-y-1 ml-4 text-sm"
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
                                    className="text-gray-200 leading-relaxed text-sm"
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
