/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, FileText, Users, Shield } from 'lucide-react';

// Tournament Rules Component
const TournamentRules = () => {
  return (
    <div className="max-h-[800px] overflow-y-auto bg-white rounded-lg p-6">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">KONIVRER Tournament Rules</h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Tournament Structure</h2>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-3">1.1 Tournament Types</h3>
        <div className="mb-6">
          <p className="mb-4"><strong>Casual Events:</strong> Local store tournaments with relaxed enforcement and learning focus. Emphasis on fun, education, and community building. Ideal for new players learning tournament procedures.</p>
          
          <p className="mb-4"><strong>Competitive Events:</strong> Regional qualifiers and championship series with strict rule enforcement. Higher stakes competition with significant prizes and professional-level judging.</p>
          
          <p className="mb-4"><strong>Professional Events:</strong> Premier tournaments with highest level of competition and prizes. Invitation-only or qualification-required events with maximum prize support and championship recognition.</p>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">1.2 Match Structure</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Best of 3 games with optional sideboarding between games</li>
          <li>First player determined randomly for game 1</li>
          <li>Loser of previous game chooses who plays first in subsequent games</li>
          <li>Match winner determined by first player to win 2 games</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">1.3 Swiss Pairing System</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Preliminary rounds use Swiss pairing system ensuring balanced competition</li>
          <li>Players paired against opponents with similar records each round</li>
          <li>No player elimination during Swiss rounds - everyone plays all rounds</li>
          <li>Optimal number of rounds determined by attendance</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Time Limits</h2>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Swiss rounds:</strong> 50 minutes per match plus 5 additional turns after time expires</li>
          <li><strong>Playoff rounds:</strong> Extended time limits (70-90 minutes)</li>
          <li><strong>Championship finals:</strong> May be untimed at judge discretion</li>
          <li><strong>Deck construction:</strong> 30 minutes for sealed deck, 25 minutes for draft</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Tournament Roles</h2>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-3">3.1 Tournament Organizer</h3>
        <p className="mb-4">Overall event management, logistics, and final authority on all tournament matters. Responsible for venue, registration, prize support, and tournament scheduling.</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">3.2 Head Judge</h3>
        <p className="mb-4">Final authority on all rules interpretations and penalty decisions during tournament. Supervises floor judges and ensures consistent rule enforcement.</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">3.3 Floor Judges</h3>
        <p className="mb-4">Monitor matches and provide rules assistance to players during competition. Answer player questions about card interactions and game procedures.</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Deck Construction</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Constructed decks must contain exactly 40 cards</li>
          <li>Sideboard of up to 15 cards allowed for competitive events</li>
          <li>Deck lists must be submitted before tournament begins</li>
          <li>All cards must be legal for the tournament format</li>
          <li>Card sleeves must be uniform and unmarked</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Penalties</h2>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-3">5.1 Warning</h3>
        <p className="mb-4">Issued for minor procedural errors or first-time infractions. No game impact but serves as official notice.</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">5.2 Game Loss</h3>
        <p className="mb-4">Issued for significant rule violations or repeated infractions. Player loses the current game.</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">5.3 Match Loss</h3>
        <p className="mb-4">Issued for serious violations or multiple game losses. Player loses the entire match.</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">5.4 Disqualification</h3>
        <p className="mb-4">Issued for cheating, unsporting conduct, or severe rule violations. Player is removed from the tournament.</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Appeals Process</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Players may appeal judge decisions to the Head Judge</li>
          <li>Appeals must be made immediately after the ruling</li>
          <li>Head Judge's decision is final</li>
          <li>Players should remain respectful during appeals process</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Tiebreakers</h2>
        <ol className="list-decimal pl-6 mb-6">
          <li><strong>Match Win Percentage:</strong> Primary tiebreaker for Swiss standings</li>
          <li><strong>Opponent Match Win Percentage:</strong> Secondary tiebreaker</li>
          <li><strong>Game Win Percentage:</strong> Tertiary tiebreaker</li>
          <li><strong>Opponent Game Win Percentage:</strong> Final statistical tiebreaker</li>
        </ol>
      </div>
    </div>
  );
};

// Code of Conduct Component
const CodeOfConduct = () => {
  return (
    <div className="max-h-[800px] overflow-y-auto bg-white rounded-lg p-6">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">KONIVRER Code of Conduct</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-blue-800 font-semibold">KONIVRER is dedicated to creating the best and most inclusive play experiences for all participants.</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Core Principles</h2>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-3">1.1 Respect and Inclusion</h3>
        <p className="mb-4">All participants must treat fellow players, judges, staff, and spectators with respect and courtesy. KONIVRER communities include members of diverse identities, backgrounds, cultures, and orientations. All members are expected to interact without prejudice or bias.</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">1.2 Fair Play</h3>
        <p className="mb-4">Players must compete honestly and follow all game rules and tournament procedures. Cheating, collusion, or any attempt to gain unfair advantage is strictly prohibited.</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">1.3 Sportsmanship</h3>
        <p className="mb-4">Players should demonstrate good sportsmanship by being gracious in both victory and defeat, helping newer players learn, and contributing to a positive tournament atmosphere.</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Prohibited Behavior</h2>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-3">2.1 Harassment and Discrimination</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Hate speech, slurs, or discriminatory language</li>
          <li>Harassment based on race, gender, religion, sexual orientation, or other characteristics</li>
          <li>Bullying, intimidation, or threatening behavior</li>
          <li>Unwelcome physical contact or invasion of personal space</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">2.2 Unsporting Conduct</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Excessive arguing with judges or opponents</li>
          <li>Deliberately slow play to gain advantage</li>
          <li>Throwing cards or other displays of anger</li>
          <li>Inappropriate language or gestures</li>
          <li>Disruptive behavior that interferes with other matches</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">2.3 Cheating and Fraud</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Intentionally misrepresenting game state</li>
          <li>Using marked or altered cards</li>
          <li>Looking at hidden information without permission</li>
          <li>Collusion with opponents or spectators</li>
          <li>Bribery or wagering on match outcomes</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Player Responsibilities</h2>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-3">3.1 Match Etiquette</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Greet your opponent at the start and end of each match</li>
          <li>Clearly announce your actions and card effects</li>
          <li>Keep your play area organized and tidy</li>
          <li>Handle opponent's cards with care when examining them</li>
          <li>Ask permission before looking at opponent's cards</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">3.2 Communication</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Speak clearly and at appropriate volume</li>
          <li>Ask for clarification when rules questions arise</li>
          <li>Call a judge when needed rather than arguing</li>
          <li>Respond honestly to opponent's questions about public information</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">3.3 Personal Conduct</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Maintain appropriate personal hygiene</li>
          <li>Dress appropriately for the venue and event</li>
          <li>Keep personal belongings organized</li>
          <li>Follow venue rules and local laws</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Spectator Guidelines</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Observe matches silently without interfering</li>
          <li>Maintain appropriate distance from playing areas</li>
          <li>Do not provide assistance or advice to players</li>
          <li>Report rule violations to judges rather than intervening</li>
          <li>Respect player privacy and avoid photographing without permission</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Enforcement</h2>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-3">5.1 Reporting Violations</h3>
        <p className="mb-4">Any participant who witnesses or experiences a violation of this Code of Conduct should report it immediately to a judge or tournament official. All reports will be taken seriously and investigated promptly.</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">5.2 Consequences</h3>
        <p className="mb-4">Violations may result in warnings, game losses, match losses, disqualification from the event, or suspension from future events, depending on the severity and frequency of the violation.</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">5.3 Appeals</h3>
        <p className="mb-4">Players who receive penalties may appeal to the Head Judge. All appeals must be made respectfully and in a timely manner.</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Special Considerations</h2>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-3">6.1 Minors</h3>
        <p className="mb-4">Events may include participants under 18. All attendees must behave appropriately in the presence of minors, avoiding adult content or inappropriate behavior.</p>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">6.2 Accommodations</h3>
        <p className="mb-4">Reasonable accommodations will be made for players with disabilities, language barriers, or other special needs. Players should contact tournament organizers in advance to discuss requirements.</p>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
          <p className="text-green-800 font-semibold">Remember: We're all here to enjoy KONIVRER together. By following these guidelines, we create a welcoming environment where everyone can have fun and compete fairly.</p>
        </div>
      </div>
    </div>
  );
};

const PDFViewer = ({ pdfUrl = '/assets/konivrer-rules.pdf' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfExists, setPdfExists] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');
  const iframeRef = useRef(null);

  useEffect(() => {
    // Check if PDF file exists
    const checkPdfExists = async () => {
      try {
        const response = await fetch(pdfUrl, { method: 'HEAD' });
        if (response.ok) {
          setPdfExists(true);
          setError(null);
        } else {
          setPdfExists(false);
          setError('PDF file not found');
        }
      } catch (err) {
        setPdfExists(false);
        setError('Failed to load PDF file');
      } finally {
        setIsLoading(false);
      }
    };

    checkPdfExists();
  }, [pdfUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && iframeRef.current) {
      // For browsers that support it, we can try to search within the PDF
      try {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          // This is a basic implementation - actual PDF search would require PDF.js
          console.log('Searching for:', searchTerm);
        }
      } catch (err) {
        console.log('Search not available in this browser');
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'konivrer-rules.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error || !pdfExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-400" />
                <h1 className="text-3xl font-bold text-white">KONIVRER Rules</h1>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
          >
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              PDF Rules Document Not Available
            </h2>
            <p className="text-gray-300 mb-6">
              The KONIVRER rules PDF file is not currently available. Please contact the administrator to upload the rules document.
            </p>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-200 text-sm">
                <strong>For Administrators:</strong> Upload the rules PDF file to <code>/public/assets/konivrer-rules.pdf</code>
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Return to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rules':
        return (
          <div className="w-full h-[800px] bg-white rounded-lg overflow-hidden">
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#page=${currentPage}&zoom=${zoom * 100}`}
              className="w-full h-full border-0"
              title="KONIVRER Rules PDF"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        );
      case 'tournament':
        return <TournamentRules />;
      case 'conduct':
        return <CodeOfConduct />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">KONIVRER Rules & Guidelines</h1>
            </div>

            {/* Search Bar - Only show for rules tab */}
            {activeTab === 'rules' && (
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search rules..."
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Search
                </button>
              </form>
            )}
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'rules'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Game Rules</span>
            </button>
            <button
              onClick={() => setActiveTab('tournament')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'tournament'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Tournament Rules</span>
            </button>
            <button
              onClick={() => setActiveTab('conduct')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'conduct'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Code of Conduct</span>
            </button>
          </div>

          {/* Controls - Only show for rules tab */}
          {activeTab === 'rules' && (
            <div className="flex flex-wrap items-center justify-between mt-4 space-y-2 lg:space-y-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-white text-sm px-3 py-1 bg-white/10 rounded">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-white text-sm px-3 py-1 bg-white/10 rounded">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default PDFViewer;