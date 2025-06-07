import { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  Play, 
  Pause, 
  SkipForward, 
  Settings, 
  FileText, 
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Timer,
  Trophy,
  Target,
  Shuffle,
  RotateCcw
} from 'lucide-react';
import { analytics } from '../utils/analytics';

const TournamentManagement = () => {
  const [tournament, setTournament] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [players, setPlayers] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock tournament data
    const mockTournament = {
      id: 1,
      name: 'Friday Night KONIVRER',
      format: 'Standard',
      type: 'swiss',
      status: 'active',
      currentRound: 2,
      totalRounds: 4,
      timeLimit: 50,
      timeRemaining: '00:23:45',
      registeredPlayers: 16,
      maxPlayers: 16,
      startTime: '2024-06-07 19:00:00',
      organizer: 'GameHub Store',
      judge: 'Mike Wilson'
    };

    const mockPlayers = [
      { id: 1, name: 'Alex Chen', username: 'DragonMaster2024', status: 'active', wins: 2, losses: 0, draws: 0, points: 6, deckSubmitted: true },
      { id: 2, name: 'Sarah Wilson', username: 'ElementalMage', status: 'active', wins: 1, losses: 1, draws: 0, points: 3, deckSubmitted: true },
      { id: 3, name: 'Mike Johnson', username: 'StormCaller', status: 'active', wins: 1, losses: 1, draws: 0, points: 3, deckSubmitted: true },
      { id: 4, name: 'Emma Davis', username: 'FireStorm99', status: 'active', wins: 2, losses: 0, draws: 0, points: 6, deckSubmitted: true },
      { id: 5, name: 'Jordan Smith', username: 'EarthShaker', status: 'active', wins: 0, losses: 2, draws: 0, points: 0, deckSubmitted: true },
      { id: 6, name: 'Chris Lee', username: 'WindWalker', status: 'active', wins: 1, losses: 1, draws: 0, points: 3, deckSubmitted: false },
      { id: 7, name: 'Taylor Brown', username: 'FlameKeeper', status: 'dropped', wins: 0, losses: 1, draws: 0, points: 0, deckSubmitted: true },
      { id: 8, name: 'Morgan White', username: 'StoneGuard', status: 'active', wins: 1, losses: 1, draws: 0, points: 3, deckSubmitted: true }
    ];

    const mockPairings = [
      { id: 1, round: 2, table: 1, player1: 'Alex Chen', player2: 'Sarah Wilson', status: 'playing', result: null },
      { id: 2, round: 2, table: 2, player1: 'Emma Davis', player2: 'Mike Johnson', status: 'completed', result: '2-1', winner: 'Emma Davis' },
      { id: 3, round: 2, table: 3, player1: 'Jordan Smith', player2: 'Chris Lee', status: 'playing', result: null },
      { id: 4, round: 2, table: 4, player1: 'Morgan White', player2: 'BYE', status: 'completed', result: '2-0', winner: 'Morgan White' }
    ];

    const mockStandings = mockPlayers
      .filter(p => p.status !== 'dropped')
      .sort((a, b) => b.points - a.points || (b.wins - b.losses) - (a.wins - a.losses))
      .map((player, index) => ({ ...player, rank: index + 1 }));

    setTimeout(() => {
      setTournament(mockTournament);
      setPlayers(mockPlayers);
      setPairings(mockPairings);
      setStandings(mockStandings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    analytics.buttonClick('tournament_mgmt_tab', tab);
  };

  const handleStartRound = () => {
    analytics.buttonClick('tournament_start_round', tournament.currentRound + 1);
    // In a real app, this would start the next round
    alert('Starting next round...');
  };

  const handlePauseRound = () => {
    analytics.buttonClick('tournament_pause_round', tournament.currentRound);
    // In a real app, this would pause the current round
    alert('Pausing current round...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'dropped': return 'text-red-400';
      case 'playing': return 'text-yellow-400';
      case 'completed': return 'text-green-400';
      default: return 'text-muted';
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-tertiary rounded-lg mx-auto mb-4"></div>
              <div className="h-4 bg-tertiary rounded w-32 mx-auto"></div>
            </div>
            <p className="text-muted mt-4">Loading tournament...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Tournament Header */}
      <div className="card mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{tournament.name}</h1>
            <div className="flex items-center gap-4 text-sm text-secondary">
              <span>{tournament.format}</span>
              <span>•</span>
              <span>Round {tournament.currentRound}/{tournament.totalRounds}</span>
              <span>•</span>
              <span>{tournament.registeredPlayers} players</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Timer size={14} />
                {tournament.timeRemaining}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="btn btn-secondary"
              onClick={handlePauseRound}
            >
              <Pause size={16} />
              Pause Round
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleStartRound}
            >
              <SkipForward size={16} />
              Next Round
            </button>
            <button className="btn btn-ghost">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-color">
        {[
          { id: 'overview', label: 'Overview', icon: Target },
          { id: 'players', label: 'Players', icon: Users },
          { id: 'pairings', label: 'Pairings', icon: Shuffle },
          { id: 'standings', label: 'Standings', icon: Trophy },
          { id: 'reports', label: 'Reports', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Tournament Status */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Tournament Status</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Current Round:</span>
                    <span className="font-medium">{tournament.currentRound}/{tournament.totalRounds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Time Remaining:</span>
                    <span className="font-medium text-accent-primary">{tournament.timeRemaining}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Active Players:</span>
                    <span className="font-medium">{players.filter(p => p.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Dropped Players:</span>
                    <span className="font-medium text-red-400">{players.filter(p => p.status === 'dropped').length}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Format:</span>
                    <span className="font-medium">{tournament.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Type:</span>
                    <span className="font-medium">{tournament.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Judge:</span>
                    <span className="font-medium">{tournament.judge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Started:</span>
                    <span className="font-medium">{new Date(tournament.startTime).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Round Matches */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Current Round Matches</h2>
              <div className="space-y-3">
                {pairings.filter(p => p.round === tournament.currentRound).map(pairing => (
                  <div key={pairing.id} className="flex items-center justify-between p-3 bg-tertiary rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">Table {pairing.table}</span>
                      <span>{pairing.player1} vs {pairing.player2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getStatusColor(pairing.status)}`}>
                        {pairing.status === 'completed' ? pairing.result : pairing.status}
                      </span>
                      {pairing.status === 'playing' && (
                        <button className="btn btn-sm btn-secondary">
                          <Edit size={14} />
                          Enter Result
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="btn btn-primary w-full">
                  <Play size={16} />
                  Start Timer
                </button>
                <button className="btn btn-secondary w-full">
                  <Shuffle size={16} />
                  Generate Pairings
                </button>
                <button className="btn btn-secondary w-full">
                  <FileText size={16} />
                  Export Results
                </button>
                <button className="btn btn-secondary w-full">
                  <Download size={16} />
                  Download Report
                </button>
              </div>
            </div>

            {/* Alerts */}
            <div className="card">
              <h3 className="font-semibold mb-4">Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-2 bg-yellow-900/20 border border-yellow-600/30 rounded">
                  <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-sm">
                    <div className="font-medium">Missing Decklist</div>
                    <div className="text-muted">Chris Lee hasn't submitted their decklist</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-green-900/20 border border-green-600/30 rounded">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-sm">
                    <div className="font-medium">Round 1 Complete</div>
                    <div className="text-muted">All matches finished on time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Players Tab */}
      {activeTab === 'players' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Player Management</h2>
            <div className="flex gap-2">
              <button className="btn btn-secondary">
                <Upload size={16} />
                Import Players
              </button>
              <button className="btn btn-primary">
                <Plus size={16} />
                Add Player
              </button>
            </div>
          </div>

          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-color">
                    <th className="text-left py-3 px-4">Player</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-center py-3 px-4">Record</th>
                    <th className="text-center py-3 px-4">Points</th>
                    <th className="text-center py-3 px-4">Decklist</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => (
                    <tr key={player.id} className="border-b border-color hover:bg-tertiary transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-muted">@{player.username}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          player.status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {player.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-green-400">{player.wins}</span>
                        <span className="text-muted">-</span>
                        <span className="text-red-400">{player.losses}</span>
                        <span className="text-muted">-</span>
                        <span className="text-yellow-400">{player.draws}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        {player.points}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {player.deckSubmitted ? (
                          <CheckCircle className="text-green-400 mx-auto" size={16} />
                        ) : (
                          <AlertTriangle className="text-yellow-400 mx-auto" size={16} />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-1">
                          <button className="btn btn-sm btn-ghost">
                            <Eye size={14} />
                          </button>
                          <button className="btn btn-sm btn-ghost">
                            <Edit size={14} />
                          </button>
                          <button className="btn btn-sm btn-ghost text-red-400">
                            <Trash2 size={14} />
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
      )}

      {/* Pairings Tab */}
      {activeTab === 'pairings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Round Pairings</h2>
            <div className="flex gap-2">
              <select className="input">
                <option value={tournament.currentRound}>Round {tournament.currentRound}</option>
                {Array.from({ length: tournament.currentRound - 1 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Round {i + 1}</option>
                ))}
              </select>
              <button className="btn btn-secondary">
                <Shuffle size={16} />
                Generate Pairings
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pairings.filter(p => p.round === tournament.currentRound).map(pairing => (
              <div key={pairing.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Table {pairing.table}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pairing.status === 'completed' ? 'bg-green-600 text-white' : 
                    pairing.status === 'playing' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {pairing.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{pairing.player1}</span>
                    <span className="text-muted">vs</span>
                    <span className="font-medium">{pairing.player2}</span>
                  </div>
                  
                  {pairing.status === 'completed' && (
                    <div className="text-center p-2 bg-tertiary rounded">
                      <div className="text-sm text-muted">Result</div>
                      <div className="font-bold">{pairing.result}</div>
                      <div className="text-sm text-accent-primary">Winner: {pairing.winner}</div>
                    </div>
                  )}
                  
                  {pairing.status === 'playing' && (
                    <button className="btn btn-primary w-full">
                      <Edit size={16} />
                      Enter Result
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Standings Tab */}
      {activeTab === 'standings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Current Standings</h2>
            <button className="btn btn-secondary">
              <Download size={16} />
              Export Standings
            </button>
          </div>

          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-color">
                    <th className="text-left py-3 px-4">Rank</th>
                    <th className="text-left py-3 px-4">Player</th>
                    <th className="text-center py-3 px-4">Points</th>
                    <th className="text-center py-3 px-4">Record</th>
                    <th className="text-center py-3 px-4">Win %</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map(player => (
                    <tr key={player.id} className="border-b border-color hover:bg-tertiary transition-colors">
                      <td className="py-3 px-4">
                        <span className={`font-bold ${
                          player.rank === 1 ? 'text-yellow-400' : 
                          player.rank === 2 ? 'text-gray-300' : 
                          player.rank === 3 ? 'text-yellow-600' : ''
                        }`}>
                          {player.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-muted">@{player.username}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-accent-primary">
                        {player.points}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-green-400">{player.wins}</span>
                        <span className="text-muted">-</span>
                        <span className="text-red-400">{player.losses}</span>
                        <span className="text-muted">-</span>
                        <span className="text-yellow-400">{player.draws}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {player.wins + player.losses > 0 ? 
                          Math.round((player.wins / (player.wins + player.losses)) * 100) : 0}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={getStatusColor(player.status)}>
                          {player.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Tournament Reports</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Export Options</h3>
              <div className="space-y-3">
                <button className="btn btn-secondary w-full">
                  <Download size={16} />
                  Export Player List
                </button>
                <button className="btn btn-secondary w-full">
                  <Download size={16} />
                  Export Pairings
                </button>
                <button className="btn btn-secondary w-full">
                  <Download size={16} />
                  Export Standings
                </button>
                <button className="btn btn-primary w-full">
                  <Download size={16} />
                  Export Full Report
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Tournament Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Total Players:</span>
                  <span>{tournament.registeredPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Rounds Completed:</span>
                  <span>{tournament.currentRound - 1}/{tournament.totalRounds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Active Players:</span>
                  <span>{players.filter(p => p.status === 'active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Dropped Players:</span>
                  <span>{players.filter(p => p.status === 'dropped').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Average Games per Round:</span>
                  <span>{Math.ceil(players.filter(p => p.status === 'active').length / 2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentManagement;