import React, { useState, useEffect } from 'react';
import {
  Book,
  FileText,
  Scale,
  AlertTriangle,
  Download,
  Search,
  Calendar,
  ExternalLink,
} from 'lucide-react';

const RulesCenter = () => {
  const [activeSection, setActiveSection] = useState('comprehensive');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Sample rules data
  const rulesData = {
    comprehensive: {
      title: 'Comprehensive Rules',
      version: '3.2.1',
      lastUpdated: '2025-06-01',
      description:
        'The complete and authoritative rules for KONIVRER, covering all game mechanics, interactions, and edge cases.',
      sections: [
        {
          id: '1',
          title: 'Game Concepts',
          subsections: [
            '1.1 The Golden Rules',
            '1.2 Game Zones',
            '1.3 Card Types',
            '1.4 Game Actions',
          ],
        },
        {
          id: '2',
          title: 'Turn Structure',
          subsections: [
            '2.1 Beginning Phase',
            '2.2 Action Phase',
            '2.3 End Phase',
            '2.4 Cleanup',
          ],
        },
        {
          id: '3',
          title: 'Combat System',
          subsections: [
            '3.1 Attack Declaration',
            '3.2 Defense Assignment',
            '3.3 Damage Resolution',
            '3.4 Combat Modifiers',
          ],
        },
        {
          id: '4',
          title: 'Card Abilities',
          subsections: [
            '4.1 Triggered Abilities',
            '4.2 Activated Abilities',
            '4.3 Static Abilities',
            '4.4 Replacement Effects',
          ],
        },
      ],
    },
    tournament: {
      title: 'Tournament Rules & Policy',
      version: '2.1.0',
      lastUpdated: '2025-05-15',
      description:
        'Official tournament rules, policies, and procedures for competitive KONIVRER play.',
      sections: [
        {
          id: '1',
          title: 'Tournament Structure',
          subsections: [
            '1.1 Tournament Types',
            '1.2 Round Structure',
            '1.3 Pairing Procedures',
            '1.4 Time Limits',
          ],
        },
        {
          id: '2',
          title: 'Deck Construction',
          subsections: [
            '2.1 Format Requirements',
            '2.2 Card Legality',
            '2.3 Deck Registration',
            '2.4 Sideboard Rules',
          ],
        },
        {
          id: '3',
          title: 'Player Conduct',
          subsections: [
            '3.1 Sportsmanship',
            '3.2 Communication',
            '3.3 Penalties',
            '3.4 Appeals Process',
          ],
        },
      ],
    },
    penalties: {
      title: 'Penalty Guidelines',
      version: '1.8.2',
      lastUpdated: '2025-05-20',
      description:
        'Guidelines for judges on issuing penalties and handling infractions during tournaments.',
      sections: [
        {
          id: '1',
          title: 'Infraction Categories',
          subsections: [
            '1.1 Game Rule Violations',
            '1.2 Tournament Errors',
            '1.3 Unsporting Conduct',
            '1.4 Cheating',
          ],
        },
        {
          id: '2',
          title: 'Penalty Types',
          subsections: [
            '2.1 Warning',
            '2.2 Game Loss',
            '2.3 Match Loss',
            '2.4 Disqualification',
          ],
        },
      ],
    },
    formats: {
      title: 'Gameplay Formats',
      version: 'Current',
      lastUpdated: '2025-06-10',
      description:
        'Official formats for KONIVRER play, including constructed and limited formats.',
      sections: [
        {
          id: '1',
          title: 'Constructed Formats',
          subsections: [
            '1.1 Classic Constructed',
            '1.2 Blitz',
            '1.3 Legacy',
            '1.4 Premium',
          ],
        },
        {
          id: '2',
          title: 'Limited Formats',
          subsections: [
            '2.1 Sealed Deck',
            '2.2 Booster Draft',
            '2.3 Team Draft',
            '2.4 Cube Draft',
          ],
        },
      ],
    },
  };

  const sections = [
    { id: 'comprehensive', name: 'Comprehensive Rules', icon: Book },
    { id: 'tournament', name: 'Tournament Policy', icon: Scale },
    { id: 'penalties', name: 'Penalty Guidelines', icon: AlertTriangle },
    { id: 'formats', name: 'Game Formats', icon: FileText },
  ];

  const recentUpdates = [
    {
      date: '2025-06-10',
      title: 'Format Update: Premium Constructed',
      description:
        'New Premium Constructed format added with unique deck building restrictions.',
      type: 'Format Addition',
    },
    {
      date: '2025-06-01',
      title: 'Comprehensive Rules 3.2.1',
      description: 'Clarifications on combat timing and ability interactions.',
      type: 'Rules Update',
    },
    {
      date: '2025-05-20',
      title: 'Penalty Guidelines Update',
      description: 'Revised guidelines for handling communication infractions.',
      type: 'Policy Update',
    },
    {
      date: '2025-05-15',
      title: 'Tournament Policy 2.1.0',
      description:
        'Updated deck registration procedures and time limit adjustments.',
      type: 'Tournament Update',
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const currentSection = rulesData[activeSection];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading rules and policies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Rules & Policy Center
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Your comprehensive resource for KONIVRER rules, tournament policies,
            and official guidelines. Stay up to date with the latest rule
            changes and tournament procedures.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search rules, policies, or keywords..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg mx-2 mb-2 transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{section.name}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              {/* Section Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {currentSection.title}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {currentSection.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Version {currentSection.version}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Updated{' '}
                      {new Date(
                        currentSection.lastUpdated,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>

              {/* Table of Contents */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Table of Contents
                </h3>
                {currentSection.sections.map(section => (
                  <div
                    key={section.id}
                    className="border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors"
                  >
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {section.title}
                    </h4>
                    <ul className="space-y-1">
                      {section.subsections.map((subsection, index) => (
                        <li
                          key={index}
                          className="text-gray-300 hover:text-purple-400 cursor-pointer transition-colors"
                        >
                          {subsection}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Official FAQ</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Judge Resources</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Tournament Organizer Guide</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Player Education</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Updates */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Recent Updates
              </h3>
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-purple-500 pl-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">
                        {new Date(update.date).toLocaleDateString()}
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                        {update.type}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold mb-1">
                      {update.title}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {update.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Quick Access
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-left">
                  Download All Rules (PDF)
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-left">
                  Judge Certification
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-left">
                  Tournament Organizer Kit
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-left">
                  Rules Questions Forum
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Need Help?
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Have questions about the rules or need clarification on a
                specific interaction?
              </p>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                  Ask a Judge
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                  Rules Forum
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-12 bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-yellow-400 font-semibold mb-2">
                Important Notice
              </h3>
              <p className="text-gray-300 text-sm">
                These rules are the official and authoritative source for
                KONIVRER gameplay. In case of conflicts between different
                versions, the most recent version takes precedence. Tournament
                organizers and judges should always refer to the latest official
                documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesCenter;
