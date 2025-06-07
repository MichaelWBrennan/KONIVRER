import { useState, useEffect } from 'react';
import { 
  User, 
  Trophy, 
  Target, 
  Calendar, 
  Award, 
  TrendingUp, 
  Users, 
  Star,
  Edit,
  Settings,
  Share2,
  Medal,
  Zap,
  Clock,
  MapPin,
  Eye
} from 'lucide-react';
import { analytics } from '../utils/analytics';

const PlayerProfile = () => {
  const [player, setPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock player data
    const mockPlayer = {
      id: 1,
      username: 'DragonMaster2024',
      displayName: 'Alex Chen',
      avatar: '/api/placeholder/100/100',
      level: 42,
      xp: 8750,
      xpToNext: 1250,
      joinDate: '2023-03-15',
      location: 'San Francisco, CA',
      favoriteFormat: 'Standard',
      bio: 'Competitive KONIVRER player with a passion for elemental synergies. Always looking to improve and help others learn the game.',
      
      // Stats
      stats: {
        totalGames: 247,
        wins: 156,
        losses: 91,
        winRate: 63.2,
        tournamentsPlayed: 23,
        tournamentsWon: 4,
        bestFinish: '1st',
        currentRank: 'Diamond',
        peakRank: 'Master',
        favoriteCard: 'Brilliant Watcher'
      },

      // Achievements
      achievements: [
        { id: 1, name: 'First Victory', description: 'Win your first game', icon: '🏆', unlocked: true, date: '2023-03-16' },
        { id: 2, name: 'Tournament Champion', description: 'Win a tournament', icon: '👑', unlocked: true, date: '2023-06-22' },
        { id: 3, name: 'Deck Master', description: 'Create 10 decks', icon: '📚', unlocked: true, date: '2023-04-10' },
        { id: 4, name: 'Elemental Expert', description: 'Win with all element types', icon: '⚡', unlocked: true, date: '2023-08-15' },
        { id: 5, name: 'Streak Master', description: 'Win 10 games in a row', icon: '🔥', unlocked: true, date: '2023-09-03' },
        { id: 6, name: 'Community Helper', description: 'Help 50 new players', icon: '🤝', unlocked: false, progress: 32 },
        { id: 7, name: 'Perfect Score', description: 'Go undefeated in a tournament', icon: '💎', unlocked: false },
        { id: 8, name: 'Legendary', description: 'Reach Master rank', icon: '🌟', unlocked: false }
      ],

      // Recent matches
      recentMatches: [
        {
          id: 1,
          opponent: 'FireStorm99',
          result: 'win',
          format: 'Standard',
          duration: '23:45',
          date: '2024-06-07',
          tournament: 'Friday Night KONIVRER'
        },
        {
          id: 2,
          opponent: 'ElementalMage',
          result: 'loss',
          format: 'Standard',
          duration: '31:20',
          date: '2024-06-06',
          tournament: null
        },
        {
          id: 3,
          opponent: 'StormCaller',
          result: 'win',
          format: 'Draft',
          duration: '18:30',
          date: '2024-06-05',
          tournament: 'Draft Night'
        }
      ],

      // Tournament history
      tournaments: [
        {
          id: 1,
          name: 'KONIVRER Regional Championship',
          date: '2024-05-25',
          placement: '3rd',
          players: 64,
          format: 'Standard',
          points: 18
        },
        {
          id: 2,
          name: 'Spring Showdown',
          date: '2024-04-20',
          placement: '1st',
          players: 32,
          format: 'Standard',
          points: 25
        },
        {
          id: 3,
          name: 'Draft Masters',
          date: '2024-03-30',
          placement: '8th',
          players: 16,
          format: 'Draft',
          points: 12
        }
      ],

      // Favorite decks
      favoriteDecks: [
        {
          id: 1,
          name: 'Elemental Storm',
          format: 'Standard',
          wins: 23,
          losses: 8,
          lastPlayed: '2024-06-07'
        },
        {
          id: 2,
          name: 'Fire & Earth Synergy',
          format: 'Standard',
          wins: 18,
          losses: 12,
          lastPlayed: '2024-06-05'
        }
      ]
    };

    setTimeout(() => {
      setPlayer(mockPlayer);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    analytics.buttonClick('profile_tab', tab);
  };

  const getResultColor = (result) => {
    return result === 'win' ? 'text-green-400' : 'text-red-400';
  };

  const getPlacementColor = (placement) => {
    if (placement === '1st') return 'text-yellow-400';
    if (placement.includes('2nd') || placement.includes('3rd')) return 'text-gray-300';
    return 'text-secondary';
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
            <p className="text-muted mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={player.avatar}
              alt={player.displayName}
              className="w-24 h-24 rounded-lg bg-tertiary"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{player.displayName}</h1>
                <p className="text-secondary">@{player.username}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {player.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Joined {new Date(player.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="btn btn-secondary btn-sm">
                  <Share2 size={14} />
                  Share
                </button>
                <button className="btn btn-primary btn-sm">
                  <Edit size={14} />
                  Edit Profile
                </button>
              </div>
            </div>

            <p className="text-secondary mb-4">{player.bio}</p>

            {/* Level Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Level {player.level}</span>
                <span className="text-sm text-muted">{player.xp}/{player.xp + player.xpToNext} XP</span>
              </div>
              <div className="w-full bg-tertiary rounded-full h-2">
                <div 
                  className="bg-accent-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(player.xp / (player.xp + player.xpToNext)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-accent-primary">{player.stats.winRate}%</div>
                <div className="text-xs text-muted">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{player.stats.tournamentsWon}</div>
                <div className="text-xs text-muted">Tournaments Won</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">{player.stats.currentRank}</div>
                <div className="text-xs text-muted">Current Rank</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{player.stats.totalGames}</div>
                <div className="text-xs text-muted">Games Played</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-color">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'matches', label: 'Match History', icon: Target },
          { id: 'tournaments', label: 'Tournaments', icon: Trophy },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'decks', label: 'Decks', icon: Star }
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Stats */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Total Games:</span>
                    <span className="font-medium">{player.stats.totalGames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Wins:</span>
                    <span className="font-medium text-green-400">{player.stats.wins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Losses:</span>
                    <span className="font-medium text-red-400">{player.stats.losses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Win Rate:</span>
                    <span className="font-medium text-accent-primary">{player.stats.winRate}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Tournaments Played:</span>
                    <span className="font-medium">{player.stats.tournamentsPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Tournaments Won:</span>
                    <span className="font-medium text-yellow-400">{player.stats.tournamentsWon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Best Finish:</span>
                    <span className="font-medium text-yellow-400">{player.stats.bestFinish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Peak Rank:</span>
                    <span className="font-medium">{player.stats.peakRank}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
              <div className="space-y-3">
                {player.achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-tertiary rounded-lg">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-sm text-secondary">{achievement.description}</div>
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(achievement.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Rank Progress */}
            <div className="card">
              <h3 className="font-semibold mb-4">Rank Progress</h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-yellow-400 mb-1">{player.stats.currentRank}</div>
                <div className="text-sm text-muted">Current Rank</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Peak Rank:</span>
                  <span className="font-medium">{player.stats.peakRank}</span>
                </div>
                <div className="flex justify-between">
                  <span>Favorite Format:</span>
                  <span className="font-medium">{player.favoriteFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span>Favorite Card:</span>
                  <span className="font-medium text-accent-primary">{player.stats.favoriteCard}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="btn btn-primary w-full">
                  <Target size={16} />
                  Find Match
                </button>
                <button className="btn btn-secondary w-full">
                  <Trophy size={16} />
                  Join Tournament
                </button>
                <button className="btn btn-secondary w-full">
                  <Star size={16} />
                  Build Deck
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Match History</h2>
          {player.recentMatches.map(match => (
            <div key={match.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-lg font-bold ${getResultColor(match.result)}`}>
                    {match.result.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">vs {match.opponent}</div>
                    <div className="text-sm text-secondary">
                      {match.format} • {match.duration}
                      {match.tournament && ` • ${match.tournament}`}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-muted">
                  {new Date(match.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tournaments' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tournament History</h2>
          {player.tournaments.map(tournament => (
            <div key={tournament.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium mb-1">{tournament.name}</div>
                  <div className="text-sm text-secondary">
                    {tournament.format} • {tournament.players} players
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getPlacementColor(tournament.placement)}`}>
                    {tournament.placement}
                  </div>
                  <div className="text-sm text-muted">
                    {tournament.points} pts
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Achievements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {player.achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`card ${achievement.unlocked ? '' : 'opacity-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-sm text-secondary">{achievement.description}</div>
                    {achievement.unlocked ? (
                      <div className="text-xs text-green-400 mt-1">
                        Unlocked {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    ) : achievement.progress ? (
                      <div className="text-xs text-muted mt-1">
                        Progress: {achievement.progress}/50
                      </div>
                    ) : (
                      <div className="text-xs text-muted mt-1">Locked</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'decks' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Favorite Decks</h2>
          {player.favoriteDecks.map(deck => (
            <div key={deck.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium mb-1">{deck.name}</div>
                  <div className="text-sm text-secondary">
                    {deck.format} • {deck.wins}W-{deck.losses}L
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted mb-1">
                    Last played: {new Date(deck.lastPlayed).toLocaleDateString()}
                  </div>
                  <button className="btn btn-sm btn-secondary">
                    <Eye size={14} />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerProfile;