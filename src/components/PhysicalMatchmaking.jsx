import React, { useState, useEffect } from 'react';
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
  AlertTriangle
} from 'lucide-react';

const PhysicalMatchmaking = () => {
  const [activeTab, setActiveTab] = useState('quickMatch');
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [currentMatches, setCurrentMatches] = useState([]);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  useEffect(() => {
    loadData();
    
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadData = () => {
    // Load from localStorage for offline functionality
    const savedPlayers = JSON.parse(localStorage.getItem('konivrer_players') || '[]');
    const savedTournaments = JSON.parse(localStorage.getItem('konivrer_tournaments') || '[]');
    const savedMatches = JSON.parse(localStorage.getItem('konivrer_matches') || '[]');
    
    setPlayers(savedPlayers);
    setTournaments(savedTournaments);
    setCurrentMatches(savedMatches);
  };

  const saveData = () => {
    localStorage.setItem('konivrer_players', JSON.stringify(players));
    localStorage.setItem('konivrer_tournaments', JSON.stringify(tournaments));
    localStorage.setItem('konivrer_matches', JSON.stringify(currentMatches));
  };

  useEffect(() => {
    saveData();
  }, [players, tournaments, currentMatches]);

  const QuickMatchTab = () => {
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [matchFormat, setMatchFormat] = useState('standard');
    const [rounds, setRounds] = useState(1);

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
          pairs.push({
            id: `match_${Date.now()}_${i}`,
            player1: players.find(p => p.id === shuffled[i]),
            player2: players.find(p => p.id === shuffled[i + 1]),
            format: matchFormat,
            status: 'active',
            round: 1,
            maxRounds: rounds,
            startTime: new Date(),
            winner: null,
            games: []
          });
        }
      }

      setCurrentMatches(prev => [...prev, ...pairs]);
      setSelectedPlayers([]);
      alert(`Created ${pairs.length} matches!`);
    };

    return (
      <div className="space-y-6">
        {/* Player Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Players</h3>
            <span className="text-sm text-gray-500">
              {selectedPlayers.length} selected
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {players.map(player => (
              <div
                key={player.id}
                onClick={() => togglePlayerSelection(player.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPlayers.includes(player.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
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
              </div>
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
              <button
                onClick={createQuickMatch}
                disabled={selectedPlayers.length < 2}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Matches
              </button>
            </div>
          </div>
        </div>

        {/* Active Matches */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Matches</h3>
          
          {currentMatches.filter(m => m.status === 'active').length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active matches. Create some matches above!
            </div>
          ) : (
            <div className="space-y-3">
              {currentMatches.filter(m => m.status === 'active').map(match => (
                <MatchCard key={match.id} match={match} onUpdate={updateMatch} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const TournamentTab = () => {
    const [selectedTournament, setSelectedTournament] = useState(null);

    const createTournament = () => {
      setShowTournamentModal(true);
    };

    return (
      <div className="space-y-6">
        {/* Tournament Creation */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tournaments</h3>
            <button
              onClick={createTournament}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Tournament</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map(tournament => (
              <TournamentCard 
                key={tournament.id} 
                tournament={tournament} 
                onClick={() => setSelectedTournament(tournament)}
              />
            ))}
          </div>
        </div>

        {/* Tournament Details */}
        {selectedTournament && (
          <TournamentDetails 
            tournament={selectedTournament} 
            onClose={() => setSelectedTournament(null)}
          />
        )}
      </div>
    );
  };

  const PlayersTab = () => {
    const addPlayer = () => {
      setPlayerProfile(null);
      setShowPlayerModal(true);
    };

    const editPlayer = (player) => {
      setPlayerProfile(player);
      setShowPlayerModal(true);
    };

    const deletePlayer = (playerId) => {
      if (confirm('Are you sure you want to delete this player?')) {
        setPlayers(prev => prev.filter(p => p.id !== playerId));
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Player Management</h3>
            <button
              onClick={addPlayer}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Player</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Player</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Record</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Win Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map(player => (
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
                          onClick={() => deletePlayer(player.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
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

  const MatchCard = ({ match, onUpdate }) => {
    const recordGame = (winner) => {
      const newGame = {
        id: `game_${Date.now()}`,
        winner: winner,
        timestamp: new Date()
      };

      const updatedMatch = {
        ...match,
        games: [...match.games, newGame]
      };

      // Update scores
      const p1Wins = updatedMatch.games.filter(g => g.winner === match.player1.id).length;
      const p2Wins = updatedMatch.games.filter(g => g.winner === match.player2.id).length;

      // Check if match is complete
      const requiredWins = Math.ceil(match.maxRounds / 2);
      if (p1Wins >= requiredWins || p2Wins >= requiredWins) {
        updatedMatch.status = 'completed';
        updatedMatch.winner = p1Wins > p2Wins ? match.player1.id : match.player2.id;
        updatedMatch.endTime = new Date();
      }

      onUpdate(updatedMatch);
    };

    const p1Wins = match.games.filter(g => g.winner === match.player1.id).length;
    const p2Wins = match.games.filter(g => g.winner === match.player2.id).length;

    return (
      <div className="border border-gray-200 rounded-lg p-4">
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
            <button
              onClick={() => recordGame(match.player1.id)}
              className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded font-medium hover:bg-blue-200 transition-colors"
            >
              {match.player1.name} Wins
            </button>
            <button
              onClick={() => recordGame(match.player2.id)}
              className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded font-medium hover:bg-red-200 transition-colors"
            >
              {match.player2.name} Wins
            </button>
          </div>
        )}

        {match.status === 'completed' && (
          <div className="text-center py-2 bg-green-100 text-green-700 rounded font-medium">
            Winner: {players.find(p => p.id === match.winner)?.name}
          </div>
        )}
      </div>
    );
  };

  const TournamentCard = ({ tournament, onClick }) => (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
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
      <div className="text-sm text-gray-600">
        <div>{tournament.players.length} players</div>
        <div>{tournament.format} • {tournament.type}</div>
        <div>{new Date(tournament.startDate).toLocaleDateString()}</div>
      </div>
    </div>
  );

  const TournamentDetails = ({ tournament, onClose }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Tournament Info</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Format: {tournament.format}</div>
            <div>Type: {tournament.type}</div>
            <div>Players: {tournament.players.length}</div>
            <div>Status: {tournament.status}</div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Participants</h4>
          <div className="space-y-1">
            {tournament.players.map(playerId => {
              const player = players.find(p => p.id === playerId);
              return player ? (
                <div key={playerId} className="text-sm text-gray-600">
                  {player.name} ({player.rating})
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const updateMatch = (updatedMatch) => {
    setCurrentMatches(prev => 
      prev.map(match => 
        match.id === updatedMatch.id ? updatedMatch : match
      )
    );
  };

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
      
      const playerData = {
        id: playerProfile?.id || `player_${Date.now()}`,
        ...formData,
        rating: parseInt(formData.rating),
        wins: parseInt(formData.wins),
        losses: parseInt(formData.losses),
        draws: parseInt(formData.draws)
      };

      if (playerProfile) {
        setPlayers(prev => prev.map(p => p.id === playerProfile.id ? playerData : p));
      } else {
        setPlayers(prev => [...prev, playerData]);
      }

      setShowPlayerModal(false);
      setPlayerProfile(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {playerProfile ? 'Edit Player' : 'Add Player'}
            </h2>
            <button
              onClick={() => setShowPlayerModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
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
              <button
                type="button"
                onClick={() => setShowPlayerModal(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {playerProfile ? 'Update' : 'Add'} Player
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
      
      const tournamentData = {
        id: `tournament_${Date.now()}`,
        ...formData,
        players: [],
        status: 'registration',
        createdAt: new Date()
      };

      setTournaments(prev => [...prev, tournamentData]);
      setShowTournamentModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Create Tournament</h2>
            <button
              onClick={() => setShowTournamentModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
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
              <button
                type="button"
                onClick={() => setShowTournamentModal(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Tournament
              </button>
            </div>
          </form>
        </div>
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
              <button className="text-gray-600 hover:text-gray-900">
                <QrCode className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
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
              { id: 'players', label: 'Players', icon: <Users className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'quickMatch' && <QuickMatchTab />}
        {activeTab === 'tournaments' && <TournamentTab />}
        {activeTab === 'players' && <PlayersTab />}
      </div>

      {/* Modals */}
      {showPlayerModal && <PlayerModal />}
      {showTournamentModal && <TournamentModal />}
    </div>
  );
};

export default PhysicalMatchmaking;