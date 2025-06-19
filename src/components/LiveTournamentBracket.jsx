import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Clock, 
  Play, 
  Pause, 
  Eye,
  Crown,
  Star,
  Zap,
  RefreshCw,
  Settings,
  Download,
  Share2
} from 'lucide-react';

const LiveTournamentBracket = ({ tournamentId, isLive = true }) => {
  const [bracketData, setBracketData] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [viewMode, setViewMode] = useState('bracket'); // bracket, standings, schedule
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Sample tournament data
  const sampleTournament = {
    id: tournamentId,
    name: "KONIVRER World Championship 2024",
    format: "Classic Constructed",
    status: "live",
    currentRound: 3,
    totalRounds: 4,
    participants: 8,
    prizePool: 50000,
    startTime: "2024-06-19T10:00:00Z",
    rounds: [
      {
        round: 1,
        name: "Quarterfinals",
        matches: [
          {
            id: 1,
            player1: { name: "Elena Vasquez", seed: 1, hero: "Vynnset", country: "ES", avatar: "/api/placeholder/40/40" },
            player2: { name: "Marcus Chen", seed: 8, hero: "Briar", country: "US", avatar: "/api/placeholder/40/40" },
            status: "completed",
            winner: "player1",
            score: "2-1",
            startTime: "10:00",
            duration: "28:45"
          },
          {
            id: 2,
            player1: { name: "David Kim", seed: 4, hero: "Kano", country: "KR", avatar: "/api/placeholder/40/40" },
            player2: { name: "Sarah Johnson", seed: 5, hero: "Prism", country: "CA", avatar: "/api/placeholder/40/40" },
            status: "completed",
            winner: "player2",
            score: "2-0",
            startTime: "10:00",
            duration: "22:18"
          },
          {
            id: 3,
            player1: { name: "Alex Rodriguez", seed: 2, hero: "Iyslander", country: "MX", avatar: "/api/placeholder/40/40" },
            player2: { name: "Lisa Wang", seed: 7, hero: "Lexi", country: "CN", avatar: "/api/placeholder/40/40" },
            status: "completed",
            winner: "player1",
            score: "2-1",
            startTime: "10:30",
            duration: "35:12"
          },
          {
            id: 4,
            player1: { name: "Mike Thompson", seed: 3, hero: "Oldhim", country: "AU", avatar: "/api/placeholder/40/40" },
            player2: { name: "Emma Wilson", seed: 6, hero: "Katsu", country: "GB", avatar: "/api/placeholder/40/40" },
            status: "completed",
            winner: "player2",
            score: "2-0",
            startTime: "10:30",
            duration: "19:33"
          }
        ]
      },
      {
        round: 2,
        name: "Semifinals",
        matches: [
          {
            id: 5,
            player1: { name: "Elena Vasquez", seed: 1, hero: "Vynnset", country: "ES", avatar: "/api/placeholder/40/40" },
            player2: { name: "Sarah Johnson", seed: 5, hero: "Prism", country: "CA", avatar: "/api/placeholder/40/40" },
            status: "completed",
            winner: "player1",
            score: "2-1",
            startTime: "14:00",
            duration: "42:15"
          },
          {
            id: 6,
            player1: { name: "Alex Rodriguez", seed: 2, hero: "Iyslander", country: "MX", avatar: "/api/placeholder/40/40" },
            player2: { name: "Emma Wilson", seed: 6, hero: "Katsu", country: "GB", avatar: "/api/placeholder/40/40" },
            status: "live",
            winner: null,
            score: "1-1",
            startTime: "14:00",
            duration: "25:30"
          }
        ]
      },
      {
        round: 3,
        name: "Finals",
        matches: [
          {
            id: 7,
            player1: { name: "Elena Vasquez", seed: 1, hero: "Vynnset", country: "ES", avatar: "/api/placeholder/40/40" },
            player2: null, // TBD
            status: "pending",
            winner: null,
            score: null,
            startTime: "16:00",
            duration: null
          }
        ]
      }
    ]
  };

  useEffect(() => {
    setBracketData(sampleTournament);
  }, [tournamentId]);

  useEffect(() => {
    if (autoRefresh && isLive) {
      const interval = setInterval(() => {
        // Simulate live updates
        setBracketData(prev => ({ ...prev, lastUpdate: Date.now() }));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, isLive]);

  const getMatchStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-500/10';
      case 'live': return 'border-yellow-500 bg-yellow-500/10 animate-pulse';
      case 'pending': return 'border-gray-500 bg-gray-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getPlayerDisplay = (player, isWinner) => {
    if (!player) return <div className="text-gray-500 italic">TBD</div>;
    
    return (
      <div className={`flex items-center gap-2 ${isWinner ? 'text-yellow-400 font-bold' : ''}`}>
        <img src={player.avatar} alt={player.name} className="w-6 h-6 rounded-full" />
        <span className="truncate">{player.name}</span>
        {isWinner && <Crown className="w-4 h-4" />}
      </div>
    );
  };

  const MatchCard = ({ match, roundIndex }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedMatch(match)}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all
        ${getMatchStatusColor(match.status)}
        ${selectedMatch?.id === match.id ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {/* Match Status Badge */}
      <div className="absolute -top-2 -right-2">
        {match.status === 'live' && (
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        )}
        {match.status === 'completed' && (
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            DONE
          </div>
        )}
      </div>

      {/* Players */}
      <div className="space-y-2 mb-3">
        {getPlayerDisplay(match.player1, match.winner === 'player1')}
        <div className="text-center text-gray-400 text-sm">vs</div>
        {getPlayerDisplay(match.player2, match.winner === 'player2')}
      </div>

      {/* Match Info */}
      <div className="text-center text-sm text-gray-400">
        {match.score && <div className="font-semibold">{match.score}</div>}
        {match.startTime && <div>{match.startTime}</div>}
        {match.duration && <div>{match.duration}</div>}
      </div>

      {/* Live Indicator */}
      {match.status === 'live' && (
        <div className="absolute inset-0 border-2 border-red-500 rounded-lg animate-pulse pointer-events-none" />
      )}
    </motion.div>
  );

  if (!bracketData) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{bracketData.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-blue-100">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{bracketData.participants} players</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>${bracketData.prizePool.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Round {bracketData.currentRound}/{bracketData.totalRounds}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isLive && (
              <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            )}
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex border-b border-gray-700">
        {['bracket', 'standings', 'schedule'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {viewMode === 'bracket' && (
            <motion.div
              key="bracket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Bracket Visualization */}
              <div className="space-y-8">
                {bracketData.rounds.map((round, roundIndex) => (
                  <div key={round.round} className="space-y-4">
                    <h3 className="text-xl font-bold text-center">{round.name}</h3>
                    <div className={`grid gap-4 ${
                      round.matches.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                      round.matches.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                      'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                    }`}>
                      {round.matches.map((match) => (
                        <MatchCard key={match.id} match={match} roundIndex={roundIndex} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {viewMode === 'standings' && (
            <motion.div
              key="standings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold">Current Standings</h3>
              <div className="bg-gray-700/50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left">Rank</th>
                      <th className="px-4 py-3 text-left">Player</th>
                      <th className="px-4 py-3 text-left">Record</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-600">
                      <td className="px-4 py-3">1st</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src="/api/placeholder/32/32" alt="Elena" className="w-8 h-8 rounded-full" />
                          Elena Vasquez
                        </div>
                      </td>
                      <td className="px-4 py-3">2-0</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Finals</span>
                      </td>
                    </tr>
                    {/* More standings rows... */}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {viewMode === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold">Tournament Schedule</h3>
              <div className="space-y-3">
                {bracketData.rounds.map((round) => (
                  <div key={round.round} className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{round.name}</h4>
                    <div className="space-y-2">
                      {round.matches.map((match) => (
                        <div key={match.id} className="flex items-center justify-between text-sm">
                          <div>
                            {match.player1?.name || 'TBD'} vs {match.player2?.name || 'TBD'}
                          </div>
                          <div className="text-gray-400">
                            {match.startTime} {match.status === 'live' && '(LIVE)'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Match Details Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
            >
              <h3 className="text-xl font-bold mb-4">Match Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <img src={selectedMatch.player1?.avatar} alt="" className="w-16 h-16 rounded-full mx-auto mb-2" />
                    <div className="font-semibold">{selectedMatch.player1?.name}</div>
                    <div className="text-sm text-gray-400">{selectedMatch.player1?.hero}</div>
                  </div>
                  <div className="text-center">
                    <img src={selectedMatch.player2?.avatar} alt="" className="w-16 h-16 rounded-full mx-auto mb-2" />
                    <div className="font-semibold">{selectedMatch.player2?.name || 'TBD'}</div>
                    <div className="text-sm text-gray-400">{selectedMatch.player2?.hero || ''}</div>
                  </div>
                </div>
                
                {selectedMatch.score && (
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedMatch.score}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Start Time:</span>
                    <div>{selectedMatch.startTime}</div>
                  </div>
                  {selectedMatch.duration && (
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <div>{selectedMatch.duration}</div>
                    </div>
                  )}
                </div>
                
                {selectedMatch.status === 'live' && (
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      Watch Live
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveTournamentBracket;