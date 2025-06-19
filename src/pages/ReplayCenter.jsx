import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Eye, 
  Download, 
  Share2, 
  Star,
  Clock,
  Users,
  Trophy,
  Filter,
  Search,
  Calendar,
  BarChart3,
  MessageSquare,
  Bookmark
} from 'lucide-react';

const ReplayCenter = () => {
  const [selectedReplay, setSelectedReplay] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [filters, setFilters] = useState({
    format: 'all',
    duration: 'all',
    featured: false,
    dateRange: '7d'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Sample replay data
  const replays = [
    {
      id: 1,
      title: 'World Championship Final - Game 3',
      players: ['Elena Vasquez', 'David Kim'],
      heroes: ['Vynnset, Iron Maiden', 'Briar, Warden of Thorns'],
      format: 'Classic Constructed',
      duration: '28:45',
      turns: 24,
      date: '2024-06-15',
      tournament: 'KONIVRER World Championship 2024',
      featured: true,
      views: 15420,
      likes: 892,
      comments: 156,
      thumbnail: '/api/placeholder/300/200',
      winner: 'Elena Vasquez',
      gameData: {
        turns: [
          { turn: 1, player: 'Elena Vasquez', action: 'Play Lightning Sprite', life: [20, 20] },
          { turn: 1, player: 'David Kim', action: 'Play Forest', life: [20, 20] },
          { turn: 2, player: 'Elena Vasquez', action: 'Attack with Lightning Sprite', life: [20, 18] },
          { turn: 2, player: 'David Kim', action: 'Play Elemental Warrior', life: [20, 18] },
          // ... more turns
        ]
      }
    },
    {
      id: 2,
      title: 'Pro Tour Semifinals - Aggro vs Control',
      players: ['Alex Chen', 'Sarah Johnson'],
      heroes: ['Kano, Dracai of Aether', 'Prism, Sculptor of Arc Light'],
      format: 'Classic Constructed',
      duration: '35:12',
      turns: 31,
      date: '2024-06-10',
      tournament: 'Pro Tour: Elemental Convergence',
      featured: false,
      views: 8930,
      likes: 445,
      comments: 89,
      thumbnail: '/api/placeholder/300/200',
      winner: 'Sarah Johnson'
    },
    {
      id: 3,
      title: 'Regional Qualifier - Innovative Combo Deck',
      players: ['Mike Rodriguez', 'Lisa Wang'],
      heroes: ['Iyslander, Stormbind', 'Lexi, Livewire'],
      format: 'Classic Constructed',
      duration: '22:18',
      turns: 18,
      date: '2024-06-08',
      tournament: 'Regional Qualifier - West Coast',
      featured: true,
      views: 12340,
      likes: 678,
      comments: 234,
      thumbnail: '/api/placeholder/300/200',
      winner: 'Mike Rodriguez'
    }
  ];

  const filteredReplays = replays.filter(replay => {
    const matchesSearch = replay.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         replay.players.some(player => player.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFormat = filters.format === 'all' || replay.format === filters.format;
    const matchesFeatured = !filters.featured || replay.featured;
    
    return matchesSearch && matchesFormat && matchesFeatured;
  });

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTurnChange = (direction) => {
    if (!selectedReplay) return;
    
    const maxTurns = selectedReplay.turns;
    if (direction === 'next' && currentTurn < maxTurns - 1) {
      setCurrentTurn(currentTurn + 1);
    } else if (direction === 'prev' && currentTurn > 0) {
      setCurrentTurn(currentTurn - 1);
    }
  };

  const handleReplaySelect = (replay) => {
    setSelectedReplay(replay);
    setCurrentTurn(0);
    setIsPlaying(false);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && selectedReplay) {
      const interval = setInterval(() => {
        setCurrentTurn(prev => {
          if (prev >= selectedReplay.turns - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / playbackSpeed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, selectedReplay, playbackSpeed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Replay Center
          </h1>
          <p className="text-xl text-gray-300">
            Watch and analyze professional matches
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Replay List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search and Filters */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search replays..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.format}
                    onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Formats</option>
                    <option value="Classic Constructed">Classic</option>
                    <option value="Blitz">Blitz</option>
                    <option value="Draft">Draft</option>
                  </select>
                  
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 3 months</option>
                    <option value="all">All time</option>
                  </select>
                </div>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Featured only</span>
                </label>
              </div>
            </div>

            {/* Replay List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredReplays.map((replay) => (
                <motion.div
                  key={replay.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleReplaySelect(replay)}
                  className={`
                    bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border cursor-pointer transition-all
                    ${selectedReplay?.id === replay.id 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-700 hover:border-gray-600'
                    }
                  `}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={replay.thumbnail}
                        alt={replay.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      {replay.featured && (
                        <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{replay.title}</h3>
                      <p className="text-xs text-gray-400 truncate">
                        {replay.players.join(' vs ')}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{replay.duration}</span>
                        <Eye className="w-3 h-3" />
                        <span>{replay.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Replay Viewer */}
          <div className="lg:col-span-2 space-y-6">
            {selectedReplay ? (
              <>
                {/* Video/Game Area */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                    {/* Game State Visualization */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-4">{selectedReplay.title}</h3>
                      <div className="grid grid-cols-2 gap-8 mb-6">
                        <div className="text-center">
                          <div className="bg-blue-600 rounded-lg p-4 mb-2">
                            <h4 className="font-semibold">{selectedReplay.players[0]}</h4>
                            <p className="text-sm opacity-75">{selectedReplay.heroes[0]}</p>
                          </div>
                          <div className="text-2xl font-bold">20</div>
                          <div className="text-sm text-gray-400">Life</div>
                        </div>
                        <div className="text-center">
                          <div className="bg-red-600 rounded-lg p-4 mb-2">
                            <h4 className="font-semibold">{selectedReplay.players[1]}</h4>
                            <p className="text-sm opacity-75">{selectedReplay.heroes[1]}</p>
                          </div>
                          <div className="text-2xl font-bold">18</div>
                          <div className="text-sm text-gray-400">Life</div>
                        </div>
                      </div>
                      <div className="text-lg">
                        Turn {currentTurn + 1} of {selectedReplay.turns}
                      </div>
                    </div>
                    
                    {/* Play Button Overlay */}
                    {!isPlaying && (
                      <button
                        onClick={handlePlayPause}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
                      >
                        <Play className="w-16 h-16 text-white" />
                      </button>
                    )}
                  </div>
                  
                  {/* Controls */}
                  <div className="p-4 bg-gray-900/50">
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={() => handleTurnChange('prev')}
                        className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={handlePlayPause}
                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleTurnChange('next')}
                        className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Speed:</span>
                        <select
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={1}>1x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>
                      </div>
                      
                      <div className="flex-1" />
                      
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${((currentTurn + 1) / selectedReplay.turns) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Replay Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Match Details */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4">Match Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tournament:</span>
                        <span>{selectedReplay.tournament}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Format:</span>
                        <span>{selectedReplay.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span>{selectedReplay.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Winner:</span>
                        <span className="text-green-400">{selectedReplay.winner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span>{new Date(selectedReplay.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4">Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{selectedReplay.views.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{selectedReplay.likes}</div>
                        <div className="text-xs text-gray-400">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{selectedReplay.comments}</div>
                        <div className="text-xs text-gray-400">Comments</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-12 text-center">
                <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Select a Replay</h3>
                <p className="text-gray-400">Choose a replay from the list to start watching</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplayCenter;