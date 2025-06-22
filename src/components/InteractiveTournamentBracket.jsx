import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Maximize,
  Minimize,
  Download,
  Share2,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Award,
  Shield,
  Star,
  AlertTriangle,
  Info,
  HelpCircle,
  X,
  Check,
  Shuffle,
  Filter,
  Settings,
  Sliders,
  BarChart2,
  PieChart,
  TrendingUp
} from 'lucide-react';
import QRCode from 'qrcode.react';

// Tournament bracket visualization component with advanced features
const InteractiveTournamentBracket = ({ tournamentId }) => {
  const {
    tournaments,
    players,
    matches,
    generateTournamentPairings,
    updateTournament,
    updateMatch,
    createMatch,
    calculateMatchQuality,
    getPlayerTier,
    metaBreakdown,
    playerPerformance
  } = usePhysicalMatchmaking();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRound, setActiveRound] = useState(1);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState('bracket'); // bracket, standings, stats
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [autoAdvanceInterval, setAutoAdvanceInterval] = useState(null);
  const [highlightedMatch, setHighlightedMatch] = useState(null);
  const [showPredictions, setShowPredictions] = useState(false);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [bracketZoom, setBracketZoom] = useState(100);
  const [showMatchQuality, setShowMatchQuality] = useState(true);
  
  const containerRef = useRef(null);

  // Load tournament data
  useEffect(() => {
    if (!tournamentId) {
      setError('No tournament ID provided');
      setLoading(false);
      return;
    }

    const tournamentData = tournaments.find(t => t.id === tournamentId);
    if (!tournamentData) {
      setError('Tournament not found');
      setLoading(false);
      return;
    }

    setTournament(tournamentData);
    setActiveRound(tournamentData.rounds?.length || 1);
    setLoading(false);
  }, [tournamentId, tournaments]);

  // Auto-advance functionality
  useEffect(() => {
    if (autoAdvance && tournament) {
      const interval = setInterval(() => {
        // Simulate match progress
        const pendingMatches = tournament.matches.filter(m => m.result === 'pending');
        if (pendingMatches.length > 0) {
          const randomMatch = pendingMatches[Math.floor(Math.random() * pendingMatches.length)];
          const result = Math.random() > 0.5 ? 'player1' : 'player2';
          updateMatch(randomMatch.id, { ...randomMatch, result });
        } else {
          // All matches complete, move to next round
          if (activeRound < tournament.rounds?.length) {
            setActiveRound(prev => prev + 1);
          } else {
            // Tournament complete
            setAutoAdvance(false);
          }
        }
      }, 3000);
      
      setAutoAdvanceInterval(interval);
      return () => clearInterval(interval);
    } else if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval);
      setAutoAdvanceInterval(null);
    }
  }, [autoAdvance, tournament, activeRound, updateMatch]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Generate QR code for match
  const generateMatchQR = (match) => {
    const matchData = {
      id: match.id,
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      round: match.round,
      player1: match.player1,
      player2: match.player2,
      timestamp: new Date().toISOString()
    };
    
    setQrData(JSON.stringify(matchData));
    setShowQRCode(true);
  };

  // Start next round
  const startNextRound = () => {
    if (!tournament) return;
    
    const nextRound = tournament.rounds?.length + 1 || 1;
    const pairings = generateTournamentPairings(tournament.id);
    
    if (pairings && pairings.length > 0) {
      // Create matches from pairings
      pairings.forEach(pairing => {
        const matchData = {
          tournamentId: tournament.id,
          round: nextRound,
          status: 'active',
          result: pairing.result || 'pending',
          bracket: pairing.bracket || 'main'
        };
        
        if (pairing.player1Id) {
          matchData.player1 = {
            id: pairing.player1Id,
            name: players.find(p => p.id === pairing.player1Id)?.name || 'Unknown'
          };
        }
        
        if (pairing.player2Id) {
          matchData.player2 = {
            id: pairing.player2Id,
            name: players.find(p => p.id === pairing.player2Id)?.name || 'Unknown'
          };
        }
        
        if (pairing.quality) {
          matchData.matchQuality = pairing.quality;
        }
        
        createMatch(matchData);
      });
      
      // Update tournament
      updateTournament(tournament.id, {
        ...tournament,
        rounds: [...(tournament.rounds || []), pairings],
        status: 'active'
      });
      
      setActiveRound(nextRound);
    }
  };

  // Record match result
  const recordResult = (match, result) => {
    updateMatch(match.id, { ...match, result });
  };

  // Get player details
  const getPlayerDetails = (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return null;
    
    const tier = getPlayerTier(player.conservativeRating);
    const performance = playerPerformance?.[playerId];
    
    return {
      ...player,
      tier,
      performance
    };
  };

  // Calculate match win probability
  const calculateWinProbability = (player1Id, player2Id) => {
    if (!player1Id || !player2Id) return { player1: 0.5, player2: 0.5 };
    
    const quality = calculateMatchQuality(player1Id, player2Id);
    return {
      player1: quality.winProbability,
      player2: 1 - quality.winProbability
    };
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4 text-red-300">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 mr-3" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!tournament) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-medium text-gray-300 mb-2">No Tournament Selected</h3>
        <p className="text-gray-400">Select a tournament to view its bracket</p>
      </div>
    );
  }

  // Get tournament rounds and matches
  const rounds = tournament.rounds || [];
  const tournamentMatches = matches.filter(m => m.tournamentId === tournament.id);
  const currentRoundMatches = tournamentMatches.filter(m => m.round === activeRound);
  
  // Get tournament players
  const tournamentPlayers = players.filter(p => tournament.players.includes(p.id));
  
  // Calculate tournament stats
  const completedMatches = tournamentMatches.filter(m => m.result && m.result !== 'pending').length;
  const totalMatches = tournamentMatches.length;
  const completionPercentage = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;
  
  // Get standings
  const standings = tournamentPlayers.map(player => {
    const playerMatches = tournamentMatches.filter(m => 
      (m.player1?.id === player.id || m.player2?.id === player.id) && 
      m.result && m.result !== 'pending'
    );
    
    const wins = playerMatches.filter(m => 
      (m.player1?.id === player.id && m.result === 'player1') || 
      (m.player2?.id === player.id && m.result === 'player2')
    ).length;
    
    const losses = playerMatches.filter(m => 
      (m.player1?.id === player.id && m.result === 'player2') || 
      (m.player2?.id === player.id && m.result === 'player1')
    ).length;
    
    const draws = playerMatches.filter(m => m.result === 'draw').length;
    const byes = playerMatches.filter(m => m.result === 'bye' && m.player1?.id === player.id).length;
    
    const points = (wins * 3) + (draws * 1) + (byes * 3);
    const matchesPlayed = wins + losses + draws + byes;
    const winPercentage = matchesPlayed > 0 ? (wins / matchesPlayed) * 100 : 0;
    
    return {
      id: player.id,
      name: player.name,
      points,
      wins,
      losses,
      draws,
      byes,
      matchesPlayed,
      winPercentage,
      rating: player.rating,
      tier: getPlayerTier(player.conservativeRating)
    };
  }).sort((a, b) => b.points - a.points || b.winPercentage - a.winPercentage);

  return (
    <div 
      ref={containerRef}
      className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-xl overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Tournament Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-300 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-amber-400" />
              {tournament.name}
            </h1>
            <div className="flex items-center mt-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="mr-4">
                {new Date(tournament.createdAt).toLocaleDateString()}
              </span>
              <Users className="w-4 h-4 mr-1" />
              <span className="mr-4">
                {tournament.players.length} Players
              </span>
              <span className={`px-2 py-0.5 rounded text-xs ${
                tournament.status === 'completed' ? 'bg-green-900 text-green-300' :
                tournament.status === 'active' ? 'bg-blue-900 text-blue-300' :
                'bg-amber-900 text-amber-300'
              }`}>
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-amber-500 ancient-select"
            >
              <option value="bracket">Bracket View</option>
              <option value="standings">Standings</option>
              <option value="stats">Tournament Stats</option>
            </select>
            
            <motion.button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5 text-amber-300" /> : <Maximize className="w-5 h-5 text-amber-300" />}
            </motion.button>
            
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Settings"
            >
              <Settings className="w-5 h-5 text-amber-300" />
            </motion.button>
          </div>
        </div>
        
        {/* Tournament Progress */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Tournament Progress</span>
            <span className="text-sm text-gray-300">{completedMatches} / {totalMatches} matches</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Round Navigation */}
        {rounds.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setActiveRound(prev => Math.max(1, prev - 1))}
                disabled={activeRound === 1}
                className="p-1 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-amber-300" />
              </button>
              
              <select
                value={activeRound}
                onChange={(e) => setActiveRound(parseInt(e.target.value))}
                className="mx-2 bg-gray-800 border border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-amber-500 ancient-select"
              >
                {Array.from({ length: rounds.length }, (_, i) => i + 1).map(round => (
                  <option key={round} value={round}>
                    Round {round}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setActiveRound(prev => Math.min(rounds.length, prev + 1))}
                disabled={activeRound === rounds.length}
                className="p-1 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-amber-300" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              {tournament.status !== 'completed' && (
                <>
                  <motion.button
                    onClick={() => setAutoAdvance(!autoAdvance)}
                    className={`p-2 rounded-lg flex items-center space-x-1 ${
                      autoAdvance ? 'bg-amber-600 text-white' : 'bg-gray-700 text-amber-300 hover:bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {autoAdvance ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{autoAdvance ? 'Pause' : 'Auto Advance'}</span>
                  </motion.button>
                  
                  {activeRound === rounds.length && (
                    <motion.button
                      onClick={startNextRound}
                      className="p-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center space-x-1 text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={tournament.status === 'completed'}
                    >
                      <Zap className="w-4 h-4" />
                      <span>Next Round</span>
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <h3 className="text-lg font-medium text-amber-300 mb-3 flex items-center">
                <Sliders className="w-5 h-5 mr-2" />
                Display Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={showMatchQuality}
                      onChange={() => setShowMatchQuality(!showMatchQuality)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Show Match Quality</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={showPredictions}
                      onChange={() => setShowPredictions(!showPredictions)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Show Win Predictions</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={showPlayerStats}
                      onChange={() => setShowPlayerStats(!showPlayerStats)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Show Player Stats</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Bracket Zoom</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={bracketZoom}
                  onChange={(e) => setBracketZoom(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>50%</span>
                  <span>100%</span>
                  <span>150%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Main Content */}
      <div className="p-6">
        {viewMode === 'bracket' && (
          <div 
            className="overflow-x-auto"
            style={{ 
              transform: `scale(${bracketZoom / 100})`,
              transformOrigin: 'top left',
              minHeight: `${bracketZoom}vh`
            }}
          >
            {rounds.length > 0 ? (
              <div className="flex space-x-8">
                {rounds.map((round, roundIndex) => (
                  <div 
                    key={roundIndex} 
                    className={`flex flex-col space-y-6 ${roundIndex + 1 !== activeRound ? 'opacity-60' : ''}`}
                  >
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-medium text-amber-300">Round {roundIndex + 1}</h3>
                      <p className="text-sm text-gray-400">
                        {round.length} {round.length === 1 ? 'match' : 'matches'}
                      </p>
                    </div>
                    
                    {tournamentMatches
                      .filter(match => match.round === roundIndex + 1)
                      .map((match, matchIndex) => {
                        const player1 = match.player1?.id ? getPlayerDetails(match.player1.id) : null;
                        const player2 = match.player2?.id ? getPlayerDetails(match.player2.id) : null;
                        const winProbability = showPredictions && player1 && player2 
                          ? calculateWinProbability(player1.id, player2.id)
                          : null;
                        
                        const isHighlighted = highlightedMatch === match.id;
                        
                        return (
                          <motion.div
                            key={match.id}
                            className={`w-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg border ${
                              isHighlighted ? 'border-amber-500' : 'border-gray-700'
                            } ancient-card`}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setHighlightedMatch(match.id)}
                          >
                            {/* Match Header */}
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-medium text-gray-400">Match {matchIndex + 1}</span>
                              {match.matchQuality && showMatchQuality && (
                                <div className="flex items-center space-x-1 bg-amber-900 bg-opacity-30 px-2 py-0.5 rounded text-xs text-amber-300">
                                  <Zap className="w-3 h-3" />
                                  <span>{Math.round(match.matchQuality * 100)}% Quality</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Player 1 */}
                            <div className={`p-3 rounded-lg mb-2 ${
                              match.result === 'player1' ? 'bg-green-900 bg-opacity-30 border border-green-800' :
                              match.result === 'player2' ? 'bg-gray-800' :
                              'bg-gray-800'
                            }`}>
                              {player1 ? (
                                <div>
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                      <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: player1.tier.color }}
                                      ></div>
                                      <span className="font-medium">{player1.name}</span>
                                    </div>
                                    {match.result === 'player1' && (
                                      <Check className="w-4 h-4 text-green-400" />
                                    )}
                                  </div>
                                  
                                  {showPlayerStats && player1.performance && (
                                    <div className="mt-1 grid grid-cols-3 gap-1 text-xs text-gray-400">
                                      <div>
                                        <span className="block">Rating</span>
                                        <span className="text-white">{Math.round(player1.rating)}</span>
                                      </div>
                                      <div>
                                        <span className="block">Win %</span>
                                        <span className="text-white">{Math.round(player1.performance.winRate)}%</span>
                                      </div>
                                      <div>
                                        <span className="block">Matches</span>
                                        <span className="text-white">{player1.performance.matches}</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {winProbability && (
                                    <div className="mt-2">
                                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                                        <div 
                                          className="bg-amber-500 h-1.5 rounded-full" 
                                          style={{ width: `${winProbability.player1 * 100}%` }}
                                        ></div>
                                      </div>
                                      <div className="text-right text-xs text-amber-300 mt-0.5">
                                        {Math.round(winProbability.player1 * 100)}% win chance
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center text-gray-500 py-2">
                                  {match.result === 'bye' ? 'BYE' : 'TBD'}
                                </div>
                              )}
                            </div>
                            
                            {/* Player 2 */}
                            <div className={`p-3 rounded-lg ${
                              match.result === 'player2' ? 'bg-green-900 bg-opacity-30 border border-green-800' :
                              match.result === 'player1' ? 'bg-gray-800' :
                              'bg-gray-800'
                            }`}>
                              {player2 ? (
                                <div>
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                      <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: player2.tier.color }}
                                      ></div>
                                      <span className="font-medium">{player2.name}</span>
                                    </div>
                                    {match.result === 'player2' && (
                                      <Check className="w-4 h-4 text-green-400" />
                                    )}
                                  </div>
                                  
                                  {showPlayerStats && player2.performance && (
                                    <div className="mt-1 grid grid-cols-3 gap-1 text-xs text-gray-400">
                                      <div>
                                        <span className="block">Rating</span>
                                        <span className="text-white">{Math.round(player2.rating)}</span>
                                      </div>
                                      <div>
                                        <span className="block">Win %</span>
                                        <span className="text-white">{Math.round(player2.performance.winRate)}%</span>
                                      </div>
                                      <div>
                                        <span className="block">Matches</span>
                                        <span className="text-white">{player2.performance.matches}</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {winProbability && (
                                    <div className="mt-2">
                                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                                        <div 
                                          className="bg-amber-500 h-1.5 rounded-full" 
                                          style={{ width: `${winProbability.player2 * 100}%` }}
                                        ></div>
                                      </div>
                                      <div className="text-right text-xs text-amber-300 mt-0.5">
                                        {Math.round(winProbability.player2 * 100)}% win chance
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center text-gray-500 py-2">
                                  {match.result === 'bye' ? 'BYE' : 'TBD'}
                                </div>
                              )}
                            </div>
                            
                            {/* Match Actions */}
                            {match.result === 'pending' && (
                              <div className="mt-3 flex justify-between">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    recordResult(match, 'player1');
                                  }}
                                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                                  disabled={!player1 || !player2}
                                >
                                  {player1?.name || 'P1'} Wins
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    recordResult(match, 'player2');
                                  }}
                                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                                  disabled={!player1 || !player2}
                                >
                                  {player2?.name || 'P2'} Wins
                                </button>
                              </div>
                            )}
                            
                            {/* QR Code Button */}
                            <div className="mt-3 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  generateMatchQR(match);
                                }}
                                className="text-xs text-amber-400 hover:text-amber-300 flex items-center justify-center"
                              >
                                <QRCode className="w-3 h-3 mr-1" />
                                <span>Generate QR</span>
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">Tournament Not Started</h3>
                <p className="text-gray-400 mb-6">Start the first round to generate the bracket</p>
                
                <motion.button
                  onClick={startNextRound}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center space-x-2 mx-auto text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  <span>Start Tournament</span>
                </motion.button>
              </div>
            )}
          </div>
        )}
        
        {viewMode === 'standings' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">W-L-D</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Win %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {standings.map((player, index) => (
                  <tr 
                    key={player.id} 
                    className={`hover:bg-gray-700 ${
                      index === 0 ? 'bg-amber-900 bg-opacity-20' : 
                      index === 1 ? 'bg-gray-700 bg-opacity-40' : 
                      index === 2 ? 'bg-amber-800 bg-opacity-20' : ''
                    }`}
                    onClick={() => setSelectedPlayer(player.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {index === 0 ? (
                        <span className="flex items-center text-amber-300">
                          <Trophy className="w-4 h-4 mr-1" />
                          1st
                        </span>
                      ) : index === 1 ? (
                        <span className="flex items-center text-gray-300">
                          <Award className="w-4 h-4 mr-1" />
                          2nd
                        </span>
                      ) : index === 2 ? (
                        <span className="flex items-center text-amber-700">
                          <Shield className="w-4 h-4 mr-1" />
                          3rd
                        </span>
                      ) : (
                        <span>{index + 1}th</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: player.tier.color }}
                        ></div>
                        <span>{player.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{player.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {player.wins}-{player.losses}-{player.draws} {player.byes > 0 ? `(${player.byes} byes)` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{player.winPercentage.toFixed(1)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{Math.round(player.rating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {viewMode === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 ancient-card">
              <h3 className="text-lg font-medium text-amber-300 mb-4 flex items-center">
                <BarChart2 className="w-5 h-5 mr-2" />
                Tournament Statistics
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Total Matches</span>
                    <span className="text-sm font-medium">{totalMatches}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Completed Matches</span>
                    <span className="text-sm font-medium">{completedMatches}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Completion Rate</span>
                    <span className="text-sm font-medium">{completionPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Average Match Quality</span>
                    <span className="text-sm font-medium">
                      {tournamentMatches.filter(m => m.matchQuality).length > 0 
                        ? (tournamentMatches.reduce((sum, m) => sum + (m.matchQuality || 0), 0) / 
                           tournamentMatches.filter(m => m.matchQuality).length * 100).toFixed(1)
                        : 'N/A'}%
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-md font-medium text-gray-300 mb-2">Format Details</h4>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Tournament Type</span>
                    <span className="text-sm font-medium capitalize">{tournament.format || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Rounds</span>
                    <span className="text-sm font-medium">{rounds.length} / {Math.ceil(Math.log2(tournament.players.length))}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Players</span>
                    <span className="text-sm font-medium">{tournament.players.length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 ancient-card">
              <h3 className="text-lg font-medium text-amber-300 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Meta Breakdown
              </h3>
              
              {metaBreakdown && metaBreakdown.length > 0 ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Archetype</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Count</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Win Rate</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {metaBreakdown.slice(0, 5).map((deck, index) => (
                          <tr key={index} className="hover:bg-gray-700">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{deck.archetype}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{deck.count}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{deck.winRate.toFixed(1)}%</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {deck.trend === 'rising' && <span className="text-green-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> Rising</span>}
                              {deck.trend === 'falling' && <span className="text-red-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1 transform rotate-180" /> Falling</span>}
                              {deck.trend === 'neutral' && <span className="text-gray-400 flex items-center"><Activity className="w-4 h-4 mr-1" /> Stable</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                  <p>Not enough data to analyze meta breakdown.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && qrData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQRCode(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-md w-full shadow-lg border border-amber-700 ancient-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-amber-300">Match QR Code</h3>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCode value={qrData} size={200} />
                </div>
                
                <p className="text-sm text-gray-300 text-center mb-4">
                  Scan this QR code to access match details on a mobile device.
                </p>
                
                <div className="flex space-x-3">
                  <motion.button
                    className="px-4 py-2 bg-gray-700 rounded-lg text-white flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                  
                  <motion.button
                    className="px-4 py-2 bg-gray-700 rounded-lg text-white flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveTournamentBracket;