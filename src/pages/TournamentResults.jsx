import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Target,
  Filter,
  Search,
  Medal,
  MapPin,
  Clock,
  TrendingUp,
  Eye,
  ExternalLink
} from 'lucide-react';

const TournamentResults = () => {
  const [selectedFormat, setSelectedFormat] = useState('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('week');
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Mock tournament data
  const tournaments = {
    standard: [
      {
        id: 1,
        name: "Pro Tour Thunder Junction",
        date: "2025-06-15",
        location: "Las Vegas, NV",
        format: "Standard",
        players: 512,
        rounds: 15,
        prizePool: "$250,000",
        winner: {
          name: "Alex Chen",
          deck: "Izzet Prowess",
          record: "13-2"
        },
        topDecks: [
          {
            position: 1,
            player: "Alex Chen",
            deck: "Izzet Prowess",
            record: "13-2",
            mainboard: [
              { name: "Slickshot Show-Off", count: 4 },
              { name: "Stormchaser's Talent", count: 4 },
              { name: "Lightning Bolt", count: 4 }
            ]
          },
          {
            position: 2,
            player: "Sarah Johnson", 
            deck: "Mono-Red Aggro",
            record: "12-3",
            mainboard: [
              { name: "Monstrous Rage", count: 4 },
              { name: "Screaming Nemesis", count: 4 },
              { name: "Emberheart Challenger", count: 4 }
            ]
          }
        ],
        metagame: [
          { deck: "Izzet Prowess", percentage: 22.5, count: 115 },
          { deck: "Mono-Red Aggro", percentage: 18.7, count: 96 },
          { deck: "Azorius Control", percentage: 15.2, count: 78 },
          { deck: "Golgari Midrange", percentage: 12.1, count: 62 }
        ]
      },
      {
        id: 2,
        name: "Regional Championship Qualifier",
        date: "2025-06-12",
        location: "Online",
        format: "Standard",
        players: 256,
        rounds: 9,
        prizePool: "$10,000",
        winner: {
          name: "Mike Rodriguez",
          deck: "Azorius Control",
          record: "9-0"
        },
        topDecks: [],
        metagame: []
      }
    ],
    modern: [
      {
        id: 3,
        name: "Modern Challenge",
        date: "2025-06-14",
        location: "Online",
        format: "Modern",
        players: 128,
        rounds: 7,
        prizePool: "$5,000",
        winner: {
          name: "Emma Wilson",
          deck: "Burn",
          record: "7-0"
        },
        topDecks: [],
        metagame: []
      }
    ]
  };

  const formats = [
    { id: 'standard', name: 'Standard', icon: '⚡' },
    { id: 'modern', name: 'Modern', icon: '🔥' },
    { id: 'pioneer', name: 'Pioneer', icon: '🚀' },
    { id: 'legacy', name: 'Legacy', icon: '👑' },
    { id: 'commander', name: 'Commander', icon: '⚔️' }
  ];

  const timeFilters = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' }
  ];

  const filteredTournaments = useMemo(() => {
    const tournamentList = tournaments[selectedFormat] || [];
    
    return tournamentList.filter(tournament => {
      const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tournament.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tournament.winner.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Simple time filtering (in real app, would use proper date logic)
      return matchesSearch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedFormat, searchTerm, timeFilter]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${position}`;
    }
  };

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
            <Trophy className="text-yellow-400" />
            Tournament Results
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Track major tournament results, winning decks, and metagame trends across all formats
          </p>
        </motion.div>

        {/* Format Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedFormat === format.id
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
                }`}
              >
                <span className="mr-2">{format.icon}</span>
                {format.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tournaments, players, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {timeFilters.map(filter => (
                <option key={filter.id} value={filter.id}>{filter.name}</option>
              ))}
            </select>

            <div className="flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3">
              <span className="text-white">{filteredTournaments.length} Tournaments</span>
              <Calendar className="text-purple-400 w-5 h-5" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tournament List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Medal className="text-yellow-400" />
              Recent Tournaments
            </h2>
            
            <div className="space-y-4 max-h-[800px] overflow-y-auto">
              {filteredTournaments.map((tournament) => (
                <motion.div
                  key={tournament.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTournament(tournament)}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 cursor-pointer border-2 transition-all ${
                    selectedTournament?.id === tournament.id
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1">{tournament.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(tournament.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{tournament.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Users className="w-4 h-4" />
                        <span>{tournament.players} players</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl mb-1">🏆</div>
                      <div className="text-xs text-gray-400">{tournament.prizePool}</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-gray-400 mb-1">Winner</div>
                    <div className="font-semibold text-white">{tournament.winner.name}</div>
                    <div className="text-sm text-purple-300">{tournament.winner.deck}</div>
                    <div className="text-sm text-green-400">{tournament.winner.record}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tournament Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedTournament ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Target className="text-green-400" />
                    {selectedTournament.name}
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    View Full Results
                  </button>
                </div>

                {/* Tournament Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="text-blue-400 w-5 h-5" />
                      <span className="text-sm text-gray-400">Date</span>
                    </div>
                    <div className="text-lg font-bold text-white">{formatDate(selectedTournament.date)}</div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="text-green-400 w-5 h-5" />
                      <span className="text-sm text-gray-400">Players</span>
                    </div>
                    <div className="text-lg font-bold text-white">{selectedTournament.players}</div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-yellow-400 w-5 h-5" />
                      <span className="text-sm text-gray-400">Rounds</span>
                    </div>
                    <div className="text-lg font-bold text-white">{selectedTournament.rounds}</div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="text-purple-400 w-5 h-5" />
                      <span className="text-sm text-gray-400">Prize Pool</span>
                    </div>
                    <div className="text-lg font-bold text-white">{selectedTournament.prizePool}</div>
                  </div>
                </div>

                {/* Top 8 */}
                {selectedTournament.topDecks.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Medal className="text-yellow-400" />
                      Top Finishers
                    </h3>
                    <div className="space-y-3">
                      {selectedTournament.topDecks.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl">{getPositionIcon(result.position)}</div>
                              <div>
                                <div className="font-bold text-white">{result.player}</div>
                                <div className="text-purple-300">{result.deck}</div>
                                <div className="text-sm text-gray-400">Record: {result.record}</div>
                              </div>
                            </div>
                            <button className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded text-sm hover:bg-purple-600/50 transition-colors">
                              View Deck
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metagame Breakdown */}
                {selectedTournament.metagame.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="text-green-400" />
                      Metagame Breakdown
                    </h3>
                    <div className="space-y-3">
                      {selectedTournament.metagame.map((deck, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-bold text-white">{deck.deck}</div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-400">{deck.percentage}%</div>
                              <div className="text-sm text-gray-400">{deck.count} decks</div>
                            </div>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${deck.percentage}%` }}
                            ></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-600">
                <div className="text-center">
                  <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">Select a Tournament</h3>
                  <p className="text-gray-500">Choose a tournament from the list to see detailed results and metagame data</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TournamentResults;