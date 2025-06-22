import React, { useState, useEffect } from 'react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode.react';
import '../styles/ancient-esoteric-theme.css';
import {
  Users,
  Trophy,
  Zap,
  Settings,
  X,
  Wifi,
  WifiOff,
  Plus,
  Edit,
  Trash2,
  QrCode,
  Share2,
  Clock,
  Target,
  Crown,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  FileText,
  Clipboard,
  Printer,
  BarChart2,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  RefreshCw,
  Brain,
  Award,
  TrendingUp,
  Gauge,
  Sparkles,
  Dices,
  Swords,
  Shield
} from 'lucide-react';

const EnhancedPhysicalMatchmaking = () => {
  const {
    players,
    tournaments,
    matches,
    isOfflineMode,
    rankingEngine,
    addPlayer,
    updatePlayer,
    deletePlayer,
    createTournament,
    updateTournament,
    deleteTournament,
    createMatch,
    updateMatch,
    deleteMatch,
    generateMatchQRData,
    generateTournamentQRData,
    exportData,
    importData,
    calculateMatchQuality,
    recordMatchResult,
    getPlayerTier
  } = usePhysicalMatchmaking();

  const [activeTab, setActiveTab] = useState('quickMatch');
  const [playerProfile, setPlayerProfile] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [matchQuality, setMatchQuality] = useState(null);
  const [showBayesianDetails, setShowBayesianDetails] = useState(false);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    format: 'all',
    status: 'all',
    sortBy: 'date'
  });
  
  // Bayesian matchmaking functions
  useEffect(() => {
    if (selectedPlayers.length === 2) {
      const quality = calculateMatchQuality(selectedPlayers[0], selectedPlayers[1]);
      setMatchQuality(quality);
    } else {
      setMatchQuality(null);
    }
  }, [selectedPlayers, calculateMatchQuality]);
  
  const togglePlayerSelection = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      // If already have 2 players, replace the second one
      if (selectedPlayers.length >= 2) {
        setSelectedPlayers([selectedPlayers[0], playerId]);
      } else {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    }
  };
  
  const handleRecordMatch = (result, matchDetails = {}) => {
    if (selectedPlayers.length !== 2) return;
    
    const matchResult = recordMatchResult(
      selectedPlayers[0],
      selectedPlayers[1],
      result,
      matchDetails
    );
    
    // Reset selection after recording
    setSelectedPlayers([]);
    setMatchQuality(null);
    
    return matchResult;
  };
  
  const getPlayerTierDisplay = (player) => {
    if (!player || !player.conservativeRating) return { tier: 'bronze', division: 4, name: 'Bronze', color: '#CD7F32' };
    return getPlayerTier(player.conservativeRating);
  };

  // QR Code generation
  const openQRModal = (type, id) => {
    let data;
    if (type === 'match') {
      data = generateMatchQRData(id);
    } else if (type === 'tournament') {
      data = generateTournamentQRData(id);
    }
    
    if (data) {
      setQrData({
        type,
        id,
        data: JSON.stringify(data)
      });
      setShowQRModal(true);
    }
  };

  // Import/Export
  const handleExport = () => {
    const dataStr = exportData();
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `konivrer_matchmaking_export_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = () => {
    if (!importText.trim()) {
      alert('Please paste exported data first');
      return;
    }
    
    const success = importData(importText);
    if (success) {
      alert('Data imported successfully!');
      setImportText('');
      setShowImportExportModal(false);
    } else {
      alert('Error importing data. Please check the format and try again.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Quick Match Tab
  const QuickMatchTab = () => {
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [matchFormat, setMatchFormat] = useState('standard');
    const [rounds, setRounds] = useState(3);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);

    useEffect(() => {
      setFilteredMatches(
        matches.filter(match => 
          showCompleted ? true : match.status === 'active'
        )
      );
    }, [matches, showCompleted]);

    const togglePlayerSelection = (playerId) => {
      setSelectedPlayers(prev => 
        prev.includes(playerId) 
          ? prev.filter(id => id !== playerId)
          : [...prev, playerId]
      );
    };

    const createQuickMatch = () => {
      if (selectedPlayers.length < 2) {
        alert('Please select at least 2 players');
        return;
      }

      const pairs = [];
      const shuffled = [...selectedPlayers].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < shuffled.length - 1; i += 2) {
        if (shuffled[i + 1]) {
          const matchData = {
            player1: players.find(p => p.id === shuffled[i]),
            player2: players.find(p => p.id === shuffled[i + 1]),
            format: matchFormat,
            status: 'active',
            round: 1,
            maxRounds: rounds,
            winner: null,
            games: []
          };
          
          const newMatch = createMatch(matchData);
          pairs.push(newMatch);
        }
      }

      setSelectedPlayers([]);
      alert(`Created ${pairs.length} matches!`);
    };

    const recordGame = (match, winnerId) => {
      const newGame = {
        id: `game_${Date.now()}`,
        winner: winnerId,
        timestamp: new Date()
      };

      const updatedGames = [...match.games, newGame];
      
      // Update scores
      const p1Wins = updatedGames.filter(g => g.winner === match.player1.id).length;
      const p2Wins = updatedGames.filter(g => g.winner === match.player2.id).length;

      // Check if match is complete
      const requiredWins = Math.ceil(match.maxRounds / 2);
      let updatedStatus = match.status;
      let winner = match.winner;
      let endTime = match.endTime;
      
      if (p1Wins >= requiredWins || p2Wins >= requiredWins) {
        updatedStatus = 'completed';
        winner = p1Wins > p2Wins ? match.player1.id : match.player2.id;
        endTime = new Date();
        
        // Update player stats
        const winningPlayer = p1Wins > p2Wins ? match.player1 : match.player2;
        const losingPlayer = p1Wins > p2Wins ? match.player2 : match.player1;
        
        updatePlayer(winningPlayer.id, {
          wins: (winningPlayer.wins || 0) + 1,
          rating: (winningPlayer.rating || 1500) + 15
        });
        
        updatePlayer(losingPlayer.id, {
          losses: (losingPlayer.losses || 0) + 1,
          rating: Math.max(1000, (losingPlayer.rating || 1500) - 10)
        });
      }

      updateMatch(match.id, {
        games: updatedGames,
        status: updatedStatus,
        winner,
        endTime
      });
    };

    const filteredPlayers = players.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        {/* Player Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Players</h3>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <span className="text-sm text-gray-500">
                {selectedPlayers.length} selected
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {filteredPlayers.map(player => (
              <motion.div
                key={player.id}
                onClick={() => togglePlayerSelection(player.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPlayers.includes(player.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {player.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{player.name}</div>
                    <div className="text-sm text-gray-500">
                      Rating: {player.rating} • {player.wins}W-{player.losses}L
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Match Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                value={matchFormat}
                onChange={(e) => setMatchFormat(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">Standard</option>
                <option value="extended">Extended</option>
                <option value="legacy">Legacy</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best of
              </label>
              <select
                value={rounds}
                onChange={(e) => setRounds(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Best of 1</option>
                <option value={3}>Best of 3</option>
                <option value={5}>Best of 5</option>
              </select>
            </div>

            <div className="flex items-end">
              <motion.button
                onClick={createQuickMatch}
                disabled={selectedPlayers.length < 2}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Matches
              </motion.button>
            </div>
          </div>
        </div>

        {/* Matches */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Matches</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showCompleted"
                  checked={showCompleted}
                  onChange={() => setShowCompleted(!showCompleted)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showCompleted" className="text-sm text-gray-600">
                  Show completed
                </label>
              </div>
              <button
                onClick={() => setFilteredMatches([])}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {filteredMatches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No matches found. Create some matches above!
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMatches.map(match => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onRecordGame={(winnerId) => recordGame(match, winnerId)}
                  onGenerateQR={() => openQRModal('match', match.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tournament Tab
  const TournamentTab = () => {
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [filteredTournaments, setFilteredTournaments] = useState([]);

    useEffect(() => {
      filterTournaments();
    }, [tournaments, filterOptions, searchTerm]);

    const filterTournaments = () => {
      let filtered = [...tournaments];
      
      // Apply search
      if (searchTerm) {
        filtered = filtered.filter(t => 
          t.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply format filter
      if (filterOptions.format !== 'all') {
        filtered = filtered.filter(t => t.format === filterOptions.format);
      }
      
      // Apply status filter
      if (filterOptions.status !== 'all') {
        filtered = filtered.filter(t => t.status === filterOptions.status);
      }
      
      // Apply sorting
      if (filterOptions.sortBy === 'date') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filterOptions.sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (filterOptions.sortBy === 'players') {
        filtered.sort((a, b) => b.players.length - a.players.length);
      }
      
      setFilteredTournaments(filtered);
    };

    const handleCreateTournament = () => {
      setShowTournamentModal(true);
    };

    const handleDeleteTournament = (tournamentId) => {
      if (confirm('Are you sure you want to delete this tournament?')) {
        deleteTournament(tournamentId);
        if (selectedTournament?.id === tournamentId) {
          setSelectedTournament(null);
        }
      }
    };

    const handleStartTournament = (tournament) => {
      if (tournament.players.length < 4) {
        alert('Tournament needs at least 4 players to start');
        return;
      }
      
      updateTournament(tournament.id, { status: 'active' });
      
      // Generate first round of matches
      const shuffledPlayers = [...tournament.players].sort(() => Math.random() - 0.5);
      const tournamentMatches = [];
      
      for (let i = 0; i < shuffledPlayers.length - 1; i += 2) {
        if (shuffledPlayers[i + 1]) {
          const matchData = {
            tournamentId: tournament.id,
            round: 1,
            player1: players.find(p => p.id === shuffledPlayers[i]),
            player2: players.find(p => p.id === shuffledPlayers[i + 1]),
            format: tournament.format,
            status: 'active',
            maxRounds: 3,
            games: []
          };
          
          const newMatch = createMatch(matchData);
          tournamentMatches.push(newMatch.id);
        }
      }
      
      updateTournament(tournament.id, {
        matches: tournamentMatches,
        rounds: [{ number: 1, matches: tournamentMatches, completed: false }]
      });
    };

    const handleAddPlayerToTournament = (tournament, playerId) => {
      if (tournament.status !== 'registration') {
        alert('Cannot add players after tournament has started');
        return;
      }
      
      if (tournament.players.includes(playerId)) {
        alert('Player already in tournament');
        return;
      }
      
      if (tournament.players.length >= tournament.maxPlayers) {
        alert('Tournament is full');
        return;
      }
      
      updateTournament(tournament.id, {
        players: [...tournament.players, playerId]
      });
    };

    const handleRemovePlayerFromTournament = (tournament, playerId) => {
      if (tournament.status !== 'registration') {
        alert('Cannot remove players after tournament has started');
        return;
      }
      
      updateTournament(tournament.id, {
        players: tournament.players.filter(id => id !== playerId)
      });
    };

    return (
      <div className="space-y-6">
        {/* Tournament Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tournaments</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <motion.button
                onClick={handleCreateTournament}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span>New Tournament</span>
              </motion.button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Format</label>
              <select
                value={filterOptions.format}
                onChange={(e) => setFilterOptions({...filterOptions, format: e.target.value})}
                className="text-sm p-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Formats</option>
                <option value="standard">Standard</option>
                <option value="extended">Extended</option>
                <option value="legacy">Legacy</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterOptions.status}
                onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
                className="text-sm p-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="registration">Registration</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filterOptions.sortBy}
                onChange={(e) => setFilterOptions({...filterOptions, sortBy: e.target.value})}
                className="text-sm p-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="players">Players</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTournaments.map(tournament => (
              <TournamentCard 
                key={tournament.id} 
                tournament={tournament} 
                onClick={() => setSelectedTournament(tournament)}
                onDelete={() => handleDeleteTournament(tournament.id)}
                onGenerateQR={() => openQRModal('tournament', tournament.id)}
              />
            ))}
          </div>
        </div>

        {/* Tournament Details */}
        {selectedTournament && (
          <TournamentDetails 
            tournament={selectedTournament} 
            onClose={() => setSelectedTournament(null)}
            onStart={() => handleStartTournament(selectedTournament)}
            onAddPlayer={(playerId) => handleAddPlayerToTournament(selectedTournament, playerId)}
            onRemovePlayer={(playerId) => handleRemovePlayerFromTournament(selectedTournament, playerId)}
            availablePlayers={players.filter(p => !selectedTournament.players.includes(p.id))}
          />
        )}
      </div>
    );
  };

  // Players Tab
  const PlayersTab = () => {
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'rating', direction: 'desc' });

    useEffect(() => {
      let sorted = [...players];
      
      // Apply search filter
      if (searchTerm) {
        sorted = sorted.filter(player => 
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply sorting
      if (sortConfig.key) {
        sorted.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      setFilteredPlayers(sorted);
    }, [players, searchTerm, sortConfig]);

    const requestSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
      if (sortConfig.key !== key) return null;
      return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    const addPlayer = () => {
      setPlayerProfile(null);
      setShowPlayerModal(true);
    };

    const editPlayer = (player) => {
      setPlayerProfile(player);
      setShowPlayerModal(true);
    };

    const handleDeletePlayer = (playerId) => {
      if (confirm('Are you sure you want to delete this player?')) {
        deletePlayer(playerId);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Player Management</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <motion.button
                onClick={addPlayer}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span>Add Player</span>
              </motion.button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <button 
                      className="flex items-center space-x-1" 
                      onClick={() => requestSort('name')}
                    >
                      <span>Player</span>
                      {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <button 
                      className="flex items-center space-x-1" 
                      onClick={() => requestSort('rating')}
                    >
                      <span>Rating</span>
                      {getSortIcon('rating')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <button 
                      className="flex items-center space-x-1" 
                      onClick={() => requestSort('wins')}
                    >
                      <span>Record</span>
                      {getSortIcon('wins')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Win Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map(player => (
                  <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {player.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-500">{player.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{player.rating}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span>{player.wins}W-{player.losses}L-{player.draws}D</span>
                    </td>
                    <td className="py-3 px-4">
                      <span>{((player.wins / (player.wins + player.losses + player.draws)) * 100 || 0).toFixed(1)}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editPlayer(player)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openQRModal('player', player.id)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Stats Tab
  const StatsTab = () => {
    const [statsPeriod, setStatsPeriod] = useState('all');
    
    // Calculate stats
    const totalMatches = matches.length;
    const completedMatches = matches.filter(m => m.status === 'completed').length;
    const totalTournaments = tournaments.length;
    const activeTournaments = tournaments.filter(t => t.status === 'active').length;
    
    // Top players by rating
    const topPlayersByRating = [...players]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    
    // Top players by win rate (minimum 5 matches)
    const topPlayersByWinRate = [...players]
      .filter(p => (p.wins + p.losses) >= 5)
      .sort((a, b) => {
        const aWinRate = a.wins / (a.wins + a.losses) || 0;
        const bWinRate = b.wins / (b.wins + b.losses) || 0;
        return bWinRate - aWinRate;
      })
      .slice(0, 5);
    
    // Most active players
    const mostActivePlayers = [...players]
      .sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses))
      .slice(0, 5);
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Statistics Dashboard</h3>
            <select
              value={statsPeriod}
              onChange={(e) => setStatsPeriod(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="week">Last Week</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-600 mb-1">Total Players</div>
              <div className="text-2xl font-bold">{players.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-600 mb-1">Matches Played</div>
              <div className="text-2xl font-bold">{completedMatches}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-600 mb-1">Tournaments</div>
              <div className="text-2xl font-bold">{totalTournaments}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-orange-600 mb-1">Active Tournaments</div>
              <div className="text-2xl font-bold">{activeTournaments}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Players by Rating</h4>
              <div className="space-y-2">
                {topPlayersByRating.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      <span>{player.name}</span>
                    </div>
                    <span className="font-medium">{player.rating}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Win Rates (min. 5 matches)</h4>
              <div className="space-y-2">
                {topPlayersByWinRate.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      <span>{player.name}</span>
                    </div>
                    <span className="font-medium">
                      {((player.wins / (player.wins + player.losses)) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Most Active Players</h4>
              <div className="space-y-2">
                {mostActivePlayers.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      <span>{player.name}</span>
                    </div>
                    <span className="font-medium">
                      {player.wins + player.losses} matches
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Match Card Component
  const MatchCard = ({ match, onRecordGame, onGenerateQR }) => {
    const p1Wins = match.games.filter(g => g.winner === match.player1.id).length;
    const p2Wins = match.games.filter(g => g.winner === match.player2.id).length;

    return (
      <motion.div 
        className="border border-gray-200 rounded-lg p-4"
        whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="font-medium">{match.player1.name}</div>
              <div className="text-2xl font-bold text-blue-600">{p1Wins}</div>
            </div>
            <div className="text-gray-400">VS</div>
            <div className="text-center">
              <div className="font-medium">{match.player2.name}</div>
              <div className="text-2xl font-bold text-red-600">{p2Wins}</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">{match.format}</div>
            <div className="text-sm text-gray-500">Best of {match.maxRounds}</div>
          </div>
        </div>

        {match.status === 'active' && (
          <div className="flex space-x-2">
            <motion.button
              onClick={() => onRecordGame(match.player1.id)}
              className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded font-medium hover:bg-blue-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {match.player1.name} Wins
            </motion.button>
            <motion.button
              onClick={() => onRecordGame(match.player2.id)}
              className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded font-medium hover:bg-red-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {match.player2.name} Wins
            </motion.button>
          </div>
        )}

        {match.status === 'completed' && (
          <div className="text-center py-2 bg-green-100 text-green-700 rounded font-medium">
            Winner: {players.find(p => p.id === match.winner)?.name}
          </div>
        )}
        
        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {match.startTime ? new Date(match.startTime).toLocaleString() : ''}
          </div>
          <motion.button
            onClick={onGenerateQR}
            className="text-gray-600 hover:text-gray-900"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <QrCode className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Tournament Card Component
  const TournamentCard = ({ tournament, onClick, onDelete, onGenerateQR }) => (
    <motion.div
      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
      whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{tournament.name}</h4>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          tournament.status === 'active' ? 'bg-green-100 text-green-700' :
          tournament.status === 'completed' ? 'bg-gray-100 text-gray-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {tournament.status}
        </span>
      </div>
      <div className="text-sm text-gray-600 mb-3">
        <div>{tournament.players.length} players</div>
        <div>{tournament.format} • {tournament.type}</div>
        <div>{new Date(tournament.startDate).toLocaleDateString()}</div>
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="text-sm text-blue-600 hover:text-blue-800"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Details
        </motion.button>
        
        <div className="flex space-x-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onGenerateQR();
            }}
            className="text-gray-600 hover:text-gray-900"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <QrCode className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-600 hover:text-red-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Tournament Details Component
  const TournamentDetails = ({ 
    tournament, 
    onClose, 
    onStart, 
    onAddPlayer, 
    onRemovePlayer,
    availablePlayers 
  }) => {
    const [searchPlayerTerm, setSearchPlayerTerm] = useState('');
    
    const filteredAvailablePlayers = availablePlayers.filter(player => 
      player.name.toLowerCase().includes(searchPlayerTerm.toLowerCase())
    );
    
    const tournamentMatches = matches.filter(match => match.tournamentId === tournament.id);
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              tournament.status === 'active' ? 'bg-green-100 text-green-700' :
              tournament.status === 'completed' ? 'bg-gray-100 text-gray-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {tournament.status}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Tournament Info</h4>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <div>Format: {tournament.format}</div>
              <div>Type: {tournament.type}</div>
              <div>Max Players: {tournament.maxPlayers}</div>
              <div>Start Date: {new Date(tournament.startDate).toLocaleDateString()}</div>
              <div>Status: {tournament.status}</div>
            </div>
            
            {tournament.status === 'registration' && (
              <motion.button
                onClick={onStart}
                disabled={tournament.players.length < 4}
                className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Tournament
              </motion.button>
            )}
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Participants ({tournament.players.length}/{tournament.maxPlayers})</h4>
            <div className="max-h-48 overflow-y-auto mb-4">
              {tournament.players.map(playerId => {
                const player = players.find(p => p.id === playerId);
                return player ? (
                  <div key={playerId} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {player.name[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-900">{player.name}</span>
                    </div>
                    
                    {tournament.status === 'registration' && (
                      <motion.button
                        onClick={() => onRemovePlayer(playerId)}
                        className="text-red-600 hover:text-red-800"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                ) : null;
              })}
            </div>
            
            {tournament.status === 'registration' && tournament.players.length < tournament.maxPlayers && (
              <div>
                <div className="relative mb-2">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search players to add..."
                    value={searchPlayerTerm}
                    onChange={(e) => setSearchPlayerTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                  />
                </div>
                
                <div className="max-h-32 overflow-y-auto">
                  {filteredAvailablePlayers.map(player => (
                    <div key={player.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {player.name[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-900">{player.name}</span>
                      </div>
                      
                      <motion.button
                        onClick={() => onAddPlayer(player.id)}
                        className="text-blue-600 hover:text-blue-800"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {tournament.status !== 'registration' && tournamentMatches.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Tournament Matches</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tournamentMatches.map(match => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onRecordGame={(winnerId) => {
                    const newGame = {
                      id: `game_${Date.now()}`,
                      winner: winnerId,
                      timestamp: new Date()
                    };

                    const updatedGames = [...match.games, newGame];
                    
                    // Update scores
                    const p1Wins = updatedGames.filter(g => g.winner === match.player1.id).length;
                    const p2Wins = updatedGames.filter(g => g.winner === match.player2.id).length;

                    // Check if match is complete
                    const requiredWins = Math.ceil(match.maxRounds / 2);
                    let updatedStatus = match.status;
                    let winner = match.winner;
                    let endTime = match.endTime;
                    
                    if (p1Wins >= requiredWins || p2Wins >= requiredWins) {
                      updatedStatus = 'completed';
                      winner = p1Wins > p2Wins ? match.player1.id : match.player2.id;
                      endTime = new Date();
                      
                      // Update player stats
                      const winningPlayer = p1Wins > p2Wins ? match.player1 : match.player2;
                      const losingPlayer = p1Wins > p2Wins ? match.player2 : match.player1;
                      
                      updatePlayer(winningPlayer.id, {
                        wins: (winningPlayer.wins || 0) + 1,
                        rating: (winningPlayer.rating || 1500) + 15
                      });
                      
                      updatePlayer(losingPlayer.id, {
                        losses: (losingPlayer.losses || 0) + 1,
                        rating: Math.max(1000, (losingPlayer.rating || 1500) - 10)
                      });
                      
                      // Check if all matches in the current round are completed
                      const currentRound = tournament.rounds.find(r => !r.completed);
                      if (currentRound) {
                        const roundMatches = matches.filter(m => currentRound.matches.includes(m.id));
                        const allCompleted = roundMatches.every(m => 
                          m.id === match.id ? true : m.status === 'completed'
                        );
                        
                        if (allCompleted) {
                          // Update the round status
                          const updatedRounds = tournament.rounds.map(r => 
                            r.number === currentRound.number ? { ...r, completed: true } : r
                          );
                          
                          // Generate next round if tournament not complete
                          if (currentRound.number < Math.log2(tournament.maxPlayers)) {
                            // Get winners from current round
                            const winners = roundMatches.map(m => {
                              const p1Wins = m.games.filter(g => g.winner === m.player1.id).length;
                              const p2Wins = m.games.filter(g => g.winner === m.player2.id).length;
                              return p1Wins > p2Wins ? m.player1 : m.player2;
                            });
                            
                            // Create matches for next round
                            const nextRoundMatches = [];
                            for (let i = 0; i < winners.length; i += 2) {
                              if (winners[i + 1]) {
                                const matchData = {
                                  tournamentId: tournament.id,
                                  round: currentRound.number + 1,
                                  player1: winners[i],
                                  player2: winners[i + 1],
                                  format: tournament.format,
                                  status: 'active',
                                  maxRounds: 3,
                                  games: []
                                };
                                
                                const newMatch = createMatch(matchData);
                                nextRoundMatches.push(newMatch.id);
                              }
                            }
                            
                            // Add new round to tournament
                            updatedRounds.push({
                              number: currentRound.number + 1,
                              matches: nextRoundMatches,
                              completed: false
                            });
                            
                            // Update tournament with new matches and rounds
                            updateTournament(tournament.id, {
                              matches: [...tournament.matches, ...nextRoundMatches],
                              rounds: updatedRounds
                            });
                          } else {
                            // Tournament is complete
                            updateTournament(tournament.id, {
                              status: 'completed',
                              rounds: updatedRounds
                            });
                          }
                        }
                      }
                    }

                    updateMatch(match.id, {
                      games: updatedGames,
                      status: updatedStatus,
                      winner,
                      endTime
                    });
                  }}
                  onGenerateQR={() => openQRModal('match', match.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Player Modal Component
  const PlayerModal = () => {
    const [formData, setFormData] = useState({
      name: playerProfile?.name || '',
      email: playerProfile?.email || '',
      rating: playerProfile?.rating || 1500,
      wins: playerProfile?.wins || 0,
      losses: playerProfile?.losses || 0,
      draws: playerProfile?.draws || 0
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      if (playerProfile) {
        updatePlayer(playerProfile.id, formData);
      } else {
        addPlayer(formData);
      }

      setShowPlayerModal(false);
      setPlayerProfile(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div 
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {playerProfile ? 'Edit Player' : 'Add Player'}
            </h2>
            <motion.button
              onClick={() => setShowPlayerModal(false)}
              className="text-gray-400 hover:text-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wins
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.wins}
                  onChange={(e) => setFormData(prev => ({ ...prev, wins: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Losses
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.losses}
                  onChange={(e) => setFormData(prev => ({ ...prev, losses: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Draws
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.draws}
                  onChange={(e) => setFormData(prev => ({ ...prev, draws: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button
                type="button"
                onClick={() => setShowPlayerModal(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {playerProfile ? 'Update' : 'Add'} Player
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  // Tournament Modal Component
  const TournamentModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      format: 'standard',
      type: 'single-elimination',
      maxPlayers: 8,
      startDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      createTournament({
        ...formData,
        players: [],
        status: 'registration'
      });
      
      setShowTournamentModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div 
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Create Tournament</h2>
            <motion.button
              onClick={() => setShowTournamentModal(false)}
              className="text-gray-400 hover:text-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tournament Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="extended">Extended</option>
                  <option value="legacy">Legacy</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single-elimination">Single Elimination</option>
                  <option value="double-elimination">Double Elimination</option>
                  <option value="swiss">Swiss</option>
                  <option value="round-robin">Round Robin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Players
                </label>
                <select
                  value={formData.maxPlayers}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={4}>4 Players</option>
                  <option value={8}>8 Players</option>
                  <option value={16}>16 Players</option>
                  <option value={32}>32 Players</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button
                type="button"
                onClick={() => setShowTournamentModal(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Tournament
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  // QR Code Modal Component
  const QRModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div 
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">QR Code</h2>
            <motion.button
              onClick={() => setShowQRModal(false)}
              className="text-gray-400 hover:text-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCode 
                value={qrData?.data || ''}
                size={200}
                level="H"
                includeMargin={true}
                renderAs="svg"
              />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Scan this QR code to access {qrData?.type} information
              </p>
              
              <div className="flex justify-center space-x-3">
                <motion.button
                  onClick={() => copyToClipboard(qrData?.data || '')}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Clipboard className="w-4 h-4" />
                  <span>Copy Data</span>
                </motion.button>
                
                <motion.button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Import/Export Modal Component
  const ImportExportModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div 
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Import/Export Data</h2>
            <motion.button
              onClick={() => setShowImportExportModal(false)}
              className="text-gray-400 hover:text-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Export Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Export all your matchmaking data to a file that you can save and import later.
              </p>
              <motion.button
                onClick={handleExport}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </motion.button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Import Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Paste previously exported data below to import it.
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste exported JSON data here..."
                className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <motion.button
                onClick={handleImport}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">KONIVRER Matchmaking</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {isOfflineMode ? (
                  <>
                    <WifiOff className="w-4 h-4 text-orange-500" />
                    <span>Offline Mode</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span>Online</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button 
                onClick={() => setShowImportExportModal(true)}
                className="text-gray-600 hover:text-gray-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Import/Export Data"
              >
                <FileText className="w-5 h-5" />
              </motion.button>
              <motion.button 
                className="text-gray-600 hover:text-gray-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              <motion.button 
                className="text-gray-600 hover:text-gray-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'quickMatch', label: 'Quick Match', icon: <Zap className="w-4 h-4" /> },
              { id: 'tournaments', label: 'Tournaments', icon: <Trophy className="w-4 h-4" /> },
              { id: 'players', label: 'Players', icon: <Users className="w-4 h-4" /> },
              { id: 'stats', label: 'Statistics', icon: <BarChart2 className="w-4 h-4" /> }
            ].map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'quickMatch' && <QuickMatchTab />}
        {activeTab === 'tournaments' && <TournamentTab />}
        {activeTab === 'players' && <PlayersTab />}
        {activeTab === 'stats' && <StatsTab />}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPlayerModal && <PlayerModal />}
        {showTournamentModal && <TournamentModal />}
        {showQRModal && <QRModal />}
        {showImportExportModal && <ImportExportModal />}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedPhysicalMatchmaking;