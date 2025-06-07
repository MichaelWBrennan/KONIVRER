import { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Search,
  Calendar,
  Users,
  Target,
  Star,
  Award,
  Zap,
} from 'lucide-react';
import { analytics } from '../utils/analytics';

const Leaderboards = () => {
  const [activeBoard, setActiveBoard] = useState('overall');
  const [timeframe, setTimeframe] = useState('all');
  const [format, setFormat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboards, setLeaderboards] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock leaderboard data
    const mockLeaderboards = {
      overall: [
        {
          rank: 1,
          player: 'DragonMaster2024',
          displayName: 'Alex Chen',
          points: 2847,
          wins: 156,
          losses: 91,
          winRate: 63.2,
          change: 'up',
          changeValue: 2,
          tournaments: 23,
          avatar: '/api/placeholder/40/40',
        },
        {
          rank: 2,
          player: 'ElementalMage',
          displayName: 'Sarah Wilson',
          points: 2756,
          wins: 142,
          losses: 98,
          winRate: 59.2,
          change: 'down',
          changeValue: 1,
          tournaments: 19,
          avatar: '/api/placeholder/40/40',
        },
        {
          rank: 3,
          player: 'StormCaller',
          displayName: 'Mike Johnson',
          points: 2698,
          wins: 134,
          losses: 89,
          winRate: 60.1,
          change: 'up',
          changeValue: 3,
          tournaments: 21,
          avatar: '/api/placeholder/40/40',
        },
        {
          rank: 4,
          player: 'FireStorm99',
          displayName: 'Emma Davis',
          points: 2634,
          wins: 128,
          losses: 95,
          winRate: 57.4,
          change: 'same',
          changeValue: 0,
          tournaments: 18,
          avatar: '/api/placeholder/40/40',
        },
        {
          rank: 5,
          player: 'EarthShaker',
          displayName: 'Jordan Smith',
          points: 2589,
          wins: 119,
          losses: 87,
          winRate: 57.8,
          change: 'up',
          changeValue: 1,
          tournaments: 16,
          avatar: '/api/placeholder/40/40',
        },
      ],
      tournaments: [
        {
          rank: 1,
          player: 'DragonMaster2024',
          displayName: 'Alex Chen',
          tournamentsWon: 4,
          tournamentsPlayed: 23,
          winRate: 17.4,
          topFinishes: 8,
          change: 'same',
          changeValue: 0,
          avatar: '/api/placeholder/40/40',
        },
        {
          rank: 2,
          player: 'StormCaller',
          displayName: 'Mike Johnson',
          tournamentsWon: 3,
          tournamentsPlayed: 21,
          winRate: 14.3,
          topFinishes: 7,
          change: 'up',
          changeValue: 1,
          avatar: '/api/placeholder/40/40',
        },
        {
          rank: 3,
          player: 'ElementalMage',
          displayName: 'Sarah Wilson',
          tournamentsWon: 3,
          tournamentsPlayed: 19,
          winRate: 15.8,
          topFinishes: 6,
          change: 'down',
          changeValue: 1,
          avatar: '/api/placeholder/40/40',
        },
      ],
      monthly: [
        {
          rank: 1,
          player: 'FireStorm99',
          displayName: 'Emma Davis',
          points: 234,
          wins: 18,
          losses: 7,
          winRate: 72.0,
          change: 'up',
          changeValue: 5,
          gamesPlayed: 25,
          avatar: '/api/placeholder/40/40',
        },
        {
          rank: 2,
          player: 'DragonMaster2024',
          displayName: 'Alex Chen',
          points: 198,
          wins: 15,
          losses: 8,
          winRate: 65.2,
          change: 'down',
          changeValue: 1,
          gamesPlayed: 23,
          avatar: '/api/placeholder/40/40',
        },
      ],
    };

    setTimeout(() => {
      setLeaderboards(mockLeaderboards);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBoardChange = board => {
    setActiveBoard(board);
    analytics.buttonClick('leaderboard_tab', board);
  };

  const getRankIcon = rank => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={20} />;
      case 2:
        return <Medal className="text-gray-300" size={20} />;
      case 3:
        return <Medal className="text-yellow-600" size={20} />;
      default:
        return <span className="text-muted font-bold">{rank}</span>;
    }
  };

  const getChangeIcon = (change, value) => {
    if (change === 'up')
      return <TrendingUp className="text-green-400" size={16} />;
    if (change === 'down')
      return <TrendingDown className="text-red-400" size={16} />;
    return <Minus className="text-muted" size={16} />;
  };

  const getChangeText = (change, value) => {
    if (change === 'up') return `+${value}`;
    if (change === 'down') return `-${value}`;
    return '—';
  };

  const filteredData =
    leaderboards[activeBoard]?.filter(
      player =>
        player.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-tertiary rounded-lg mx-auto mb-4"></div>
              <div className="h-4 bg-tertiary rounded w-32 mx-auto"></div>
            </div>
            <p className="text-muted mt-4">Loading leaderboards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Leaderboards</h1>
        <p className="text-secondary text-lg">
          See how you rank against the best KONIVRER players
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-color">
        {[
          { id: 'overall', label: 'Overall Rankings', icon: Trophy },
          { id: 'tournaments', label: 'Tournament Champions', icon: Award },
          { id: 'monthly', label: 'This Month', icon: Calendar },
          { id: 'weekly', label: 'This Week', icon: Zap },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleBoardChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeBoard === tab.id
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
            size={16}
          />
          <input
            type="text"
            placeholder="Search players..."
            className="input pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="input"
            value={timeframe}
            onChange={e => setTimeframe(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>

          <select
            className="input"
            value={format}
            onChange={e => setFormat(e.target.value)}
          >
            <option value="all">All Formats</option>
            <option value="standard">Standard</option>
            <option value="draft">Draft</option>
            <option value="sealed">Sealed</option>
            <option value="legacy">Legacy</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium */}
      {activeBoard === 'overall' && filteredData.length >= 3 && (
        <div className="mb-8">
          <div className="flex justify-center items-end gap-4 mb-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg p-6 mb-4 relative">
                <img
                  src={filteredData[1].avatar}
                  alt={filteredData[1].displayName}
                  className="w-16 h-16 rounded-full mx-auto mb-3 bg-tertiary"
                />
                <div className="absolute -top-2 -right-2">
                  <Medal className="text-gray-300" size={24} />
                </div>
                <h3 className="font-bold text-white">
                  {filteredData[1].displayName}
                </h3>
                <p className="text-gray-200 text-sm">
                  @{filteredData[1].player}
                </p>
                <p className="text-white font-bold text-lg mt-2">
                  {filteredData[1].points} pts
                </p>
              </div>
              <div className="text-2xl font-bold text-gray-300">2nd</div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-8 mb-4 relative transform scale-110">
                <img
                  src={filteredData[0].avatar}
                  alt={filteredData[0].displayName}
                  className="w-20 h-20 rounded-full mx-auto mb-3 bg-tertiary"
                />
                <div className="absolute -top-3 -right-3">
                  <Crown className="text-yellow-200" size={32} />
                </div>
                <h3 className="font-bold text-white text-lg">
                  {filteredData[0].displayName}
                </h3>
                <p className="text-yellow-100 text-sm">
                  @{filteredData[0].player}
                </p>
                <p className="text-white font-bold text-xl mt-2">
                  {filteredData[0].points} pts
                </p>
              </div>
              <div className="text-3xl font-bold text-yellow-400">1st</div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg p-6 mb-4 relative">
                <img
                  src={filteredData[2].avatar}
                  alt={filteredData[2].displayName}
                  className="w-16 h-16 rounded-full mx-auto mb-3 bg-tertiary"
                />
                <div className="absolute -top-2 -right-2">
                  <Medal className="text-yellow-600" size={24} />
                </div>
                <h3 className="font-bold text-white">
                  {filteredData[2].displayName}
                </h3>
                <p className="text-yellow-200 text-sm">
                  @{filteredData[2].player}
                </p>
                <p className="text-white font-bold text-lg mt-2">
                  {filteredData[2].points} pts
                </p>
              </div>
              <div className="text-2xl font-bold text-yellow-600">3rd</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-color">
                <th className="text-left py-3 px-4">Rank</th>
                <th className="text-left py-3 px-4">Player</th>
                {activeBoard === 'overall' && (
                  <>
                    <th className="text-right py-3 px-4">Points</th>
                    <th className="text-right py-3 px-4">W/L</th>
                    <th className="text-right py-3 px-4">Win Rate</th>
                    <th className="text-right py-3 px-4">Tournaments</th>
                  </>
                )}
                {activeBoard === 'tournaments' && (
                  <>
                    <th className="text-right py-3 px-4">Wins</th>
                    <th className="text-right py-3 px-4">Played</th>
                    <th className="text-right py-3 px-4">Win Rate</th>
                    <th className="text-right py-3 px-4">Top 8s</th>
                  </>
                )}
                {activeBoard === 'monthly' && (
                  <>
                    <th className="text-right py-3 px-4">Points</th>
                    <th className="text-right py-3 px-4">W/L</th>
                    <th className="text-right py-3 px-4">Win Rate</th>
                    <th className="text-right py-3 px-4">Games</th>
                  </>
                )}
                <th className="text-right py-3 px-4">Change</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((player, index) => (
                <tr
                  key={player.player}
                  className={`border-b border-color hover:bg-tertiary transition-colors ${
                    player.rank <= 3 ? 'bg-tertiary/30' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(player.rank)}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={player.avatar}
                        alt={player.displayName}
                        className="w-8 h-8 rounded-full bg-tertiary"
                      />
                      <div>
                        <div className="font-medium">{player.displayName}</div>
                        <div className="text-sm text-muted">
                          @{player.player}
                        </div>
                      </div>
                    </div>
                  </td>

                  {activeBoard === 'overall' && (
                    <>
                      <td className="py-4 px-4 text-right font-bold text-accent-primary">
                        {player.points.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-green-400">{player.wins}</span>
                        <span className="text-muted">/</span>
                        <span className="text-red-400">{player.losses}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {player.winRate}%
                      </td>
                      <td className="py-4 px-4 text-right">
                        {player.tournaments}
                      </td>
                    </>
                  )}

                  {activeBoard === 'tournaments' && (
                    <>
                      <td className="py-4 px-4 text-right font-bold text-yellow-400">
                        {player.tournamentsWon}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {player.tournamentsPlayed}
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {player.winRate}%
                      </td>
                      <td className="py-4 px-4 text-right">
                        {player.topFinishes}
                      </td>
                    </>
                  )}

                  {activeBoard === 'monthly' && (
                    <>
                      <td className="py-4 px-4 text-right font-bold text-accent-primary">
                        {player.points}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-green-400">{player.wins}</span>
                        <span className="text-muted">/</span>
                        <span className="text-red-400">{player.losses}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {player.winRate}%
                      </td>
                      <td className="py-4 px-4 text-right">
                        {player.gamesPlayed}
                      </td>
                    </>
                  )}

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(player.change, player.changeValue)}
                      <span
                        className={`text-sm ${
                          player.change === 'up'
                            ? 'text-green-400'
                            : player.change === 'down'
                              ? 'text-red-400'
                              : 'text-muted'
                        }`}
                      >
                        {getChangeText(player.change, player.changeValue)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Trophy size={48} className="text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No players found</h3>
          <p className="text-secondary">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid md:grid-cols-4 gap-4 mt-8">
        <div className="card text-center">
          <Users className="mx-auto text-accent-primary mb-2" size={24} />
          <div className="text-2xl font-bold">{filteredData.length}</div>
          <div className="text-sm text-muted">Ranked Players</div>
        </div>

        <div className="card text-center">
          <Target className="mx-auto text-green-400 mb-2" size={24} />
          <div className="text-2xl font-bold">
            {filteredData.length > 0
              ? Math.round(
                  filteredData.reduce((acc, p) => acc + (p.winRate || 0), 0) /
                    filteredData.length,
                )
              : 0}
            %
          </div>
          <div className="text-sm text-muted">Avg Win Rate</div>
        </div>

        <div className="card text-center">
          <Trophy className="mx-auto text-yellow-400 mb-2" size={24} />
          <div className="text-2xl font-bold">
            {activeBoard === 'overall'
              ? filteredData.reduce((acc, p) => acc + (p.tournaments || 0), 0)
              : activeBoard === 'tournaments'
                ? filteredData.reduce(
                    (acc, p) => acc + (p.tournamentsWon || 0),
                    0,
                  )
                : filteredData.reduce(
                    (acc, p) => acc + (p.gamesPlayed || 0),
                    0,
                  )}
          </div>
          <div className="text-sm text-muted">
            {activeBoard === 'overall'
              ? 'Total Tournaments'
              : activeBoard === 'tournaments'
                ? 'Total Wins'
                : 'Total Games'}
          </div>
        </div>

        <div className="card text-center">
          <Star className="mx-auto text-purple-400 mb-2" size={24} />
          <div className="text-2xl font-bold">
            {filteredData.length > 0
              ? activeBoard === 'overall'
                ? Math.round(
                    filteredData.reduce((acc, p) => acc + p.points, 0) /
                      filteredData.length,
                  )
                : activeBoard === 'tournaments'
                  ? Math.round(
                      filteredData.reduce(
                        (acc, p) => acc + p.tournamentsPlayed,
                        0,
                      ) / filteredData.length,
                    )
                  : Math.round(
                      filteredData.reduce((acc, p) => acc + p.points, 0) /
                        filteredData.length,
                    )
              : 0}
          </div>
          <div className="text-sm text-muted">
            {activeBoard === 'overall'
              ? 'Avg Points'
              : activeBoard === 'tournaments'
                ? 'Avg Tournaments'
                : 'Avg Points'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;
