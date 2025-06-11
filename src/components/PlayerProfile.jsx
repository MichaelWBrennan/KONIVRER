import React, { useState } from 'react';
import {
  User,
  Trophy,
  Star,
  Calendar,
  Target,
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Crown,
  Shield,
  Sword,
  Heart,
  Eye,
  Settings,
  Edit,
  Share2,
  Medal,
  Zap,
  Clock,
  MapPin,
  Flag,
  Percent
} from 'lucide-react';

const PlayerProfile = ({ playerId = 'player123' }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const playerData = {
    id: 'player123',
    username: 'ProPlayer123',
    displayName: 'Alex Chen',
    avatar: '/api/placeholder/120/120',
    joinDate: '2023-03-15',
    location: 'San Francisco, CA',
    favoriteHero: 'Zephyr',
    rank: 'Diamond',
    rankPoints: 2847,
    level: 42,
    stats: {
      totalGames: 1247,
      wins: 892,
      losses: 355,
      winRate: 71.5,
      tournamentWins: 23,
      topFinishes: 67,
      averageFinish: 3.2,
      favoriteFormat: 'Classic Constructed'
    },
    achievements: [
      { id: 1, name: 'Tournament Champion', description: 'Win a major tournament', icon: Trophy, rarity: 'legendary', earned: true },
      { id: 2, name: 'Win Streak Master', description: 'Win 10 games in a row', icon: Target, rarity: 'rare', earned: true },
      { id: 3, name: 'Meta Breaker', description: 'Win with an off-meta deck', icon: Star, rarity: 'epic', earned: true },
      { id: 4, name: 'Perfect Record', description: 'Go undefeated in a tournament', icon: Crown, rarity: 'legendary', earned: false },
      { id: 5, name: 'Deck Master', description: 'Create 50 unique decks', icon: Sword, rarity: 'rare', earned: true },
      { id: 6, name: 'Community Leader', description: 'Help 100 new players', icon: Users, rarity: 'epic', earned: false }
    ],
    recentMatches: [
      {
        id: 1,
        opponent: 'MetaKnight',
        result: 'win',
        score: '2-1',
        format: 'Classic Constructed',
        date: '2025-06-10',
        duration: '45m',
        deck: 'Elemental Storm Control',
        opponentDeck: 'Blazing Aggro Rush'
      },
      {
        id: 2,
        opponent: 'ShadowMaster',
        result: 'loss',
        score: '1-2',
        format: 'Blitz',
        date: '2025-06-09',
        duration: '32m',
        deck: 'Crystal Guardian',
        opponentDeck: 'Shadow Assassin'
      },
      {
        id: 3,
        opponent: 'NatureWarden',
        result: 'win',
        score: '2-0',
        format: 'Classic Constructed',
        date: '2025-06-08',
        duration: '38m',
        deck: 'Elemental Storm Control',
        opponentDeck: "Nature's Harmony"
      }
    ],
    tournamentHistory: [
      {
        id: 1,
        name: 'KONIVRER Championship Series #1',
        date: '2025-06-01',
        format: 'Classic Constructed',
        placement: 2,
        participants: 64,
        deck: 'Elemental Storm Control',
        record: '6-1',
        prizeWon: '$500'
      },
      {
        id: 2,
        name: 'Weekly Blitz Tournament',
        date: '2025-05-28',
        format: 'Blitz',
        placement: 1,
        participants: 16,
        deck: 'Lightning Rush',
        record: '4-0',
        prizeWon: '$100'
      },
      {
        id: 3,
        name: 'Draft Masters Cup',
        date: '2025-05-20',
        format: 'Booster Draft',
        placement: 5,
        participants: 24,
        deck: 'Draft Special',
        record: '3-2',
        prizeWon: '$25'
      }
    ],
    deckCollection: [
      {
        id: 1,
        name: 'Elemental Storm Control',
        hero: 'Zephyr',
        format: 'Classic Constructed',
        winRate: 73.2,
        gamesPlayed: 156,
        lastPlayed: '2025-06-10',
        isFavorite: true
      },
      {
        id: 2,
        name: 'Crystal Guardian',
        hero: 'Prism',
        format: 'Classic Constructed',
        winRate: 68.5,
        gamesPlayed: 89,
        lastPlayed: '2025-06-09',
        isFavorite: false
      },
      {
        id: 3,
        name: 'Lightning Rush',
        hero: 'Zephyr',
        format: 'Blitz',
        winRate: 75.8,
        gamesPlayed: 67,
        lastPlayed: '2025-05-28',
        isFavorite: true
      }
    ]
  };

  const getRankColor = (rank) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return 'from-amber-600 to-amber-700';
      case 'silver': return 'from-gray-400 to-gray-500';
      case 'gold': return 'from-yellow-400 to-yellow-500';
      case 'diamond': return 'from-blue-400 to-blue-500';
      case 'master': return 'from-purple-500 to-purple-600';
      case 'grandmaster': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getAchievementColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary border border-color rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{playerData.stats.totalGames}</div>
          <div className="text-sm text-secondary">Total Games</div>
        </div>
        <div className="bg-secondary border border-color rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-500 mb-1">{playerData.stats.winRate}%</div>
          <div className="text-sm text-secondary">Win Rate</div>
        </div>
        <div className="bg-secondary border border-color rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500 mb-1">{playerData.stats.tournamentWins}</div>
          <div className="text-sm text-secondary">Tournament Wins</div>
        </div>
        <div className="bg-secondary border border-color rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-500 mb-1">{playerData.stats.averageFinish}</div>
          <div className="text-sm text-secondary">Avg Finish</div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h3 className="text-xl font-bold text-primary mb-4">Recent Matches</h3>
        <div className="space-y-3">
          {playerData.recentMatches.map(match => (
            <div key={match.id} className="flex items-center justify-between p-3 border border-color rounded-lg hover:bg-tertiary transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${match.result === 'win' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <div className="font-medium text-primary">vs {match.opponent}</div>
                  <div className="text-sm text-secondary">{match.format} • {match.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-primary">{match.score}</div>
                <div className="text-sm text-secondary">{match.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h3 className="text-xl font-bold text-primary mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {playerData.achievements.map(achievement => {
            const Icon = achievement.icon;
            return (
              <div key={achievement.id} className={`border border-color rounded-lg p-4 ${achievement.earned ? 'bg-tertiary' : 'opacity-50'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${getAchievementColor(achievement.rarity)}`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h4 className="font-semibold text-primary mb-1">{achievement.name}</h4>
                <p className="text-sm text-secondary">{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="bg-secondary border border-color rounded-xl p-6">
      <h3 className="text-xl font-bold text-primary mb-6">Tournament History</h3>
      <div className="space-y-4">
        {playerData.tournamentHistory.map(tournament => (
          <div key={tournament.id} className="border border-color rounded-xl p-4 hover:bg-tertiary transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-primary">{tournament.name}</h4>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Calendar size={14} />
                  <span>{tournament.date}</span>
                  <span>•</span>
                  <span>{tournament.format}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${tournament.placement <= 3 ? 'text-yellow-500' : 'text-primary'}`}>
                  #{tournament.placement}
                </div>
                <div className="text-sm text-secondary">of {tournament.participants}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-secondary">Deck:</span>
                <div className="font-medium text-primary">{tournament.deck}</div>
              </div>
              <div>
                <span className="text-secondary">Record:</span>
                <div className="font-medium text-primary">{tournament.record}</div>
              </div>
              <div>
                <span className="text-secondary">Prize:</span>
                <div className="font-medium text-green-500">{tournament.prizeWon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDecks = () => (
    <div className="bg-secondary border border-color rounded-xl p-6">
      <h3 className="text-xl font-bold text-primary mb-6">Deck Collection</h3>
      <div className="space-y-4">
        {playerData.deckCollection.map(deck => (
          <div key={deck.id} className="border border-color rounded-xl p-4 hover:bg-tertiary transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-primary">{deck.name}</h4>
                {deck.isFavorite && <Star className="text-yellow-500" size={16} />}
              </div>
              <div className="text-sm text-secondary">{deck.format}</div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-secondary">Hero:</span>
                <div className="font-medium text-primary">{deck.hero}</div>
              </div>
              <div>
                <span className="text-secondary">Win Rate:</span>
                <div className="font-medium text-green-500">{deck.winRate}%</div>
              </div>
              <div>
                <span className="text-secondary">Games:</span>
                <div className="font-medium text-primary">{deck.gamesPlayed}</div>
              </div>
              <div>
                <span className="text-secondary">Last Played:</span>
                <div className="font-medium text-primary">{deck.lastPlayed}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary">
      <div className="container py-8">
        {/* Profile Header */}
        <div className="bg-secondary border border-color rounded-xl p-6 mb-8">
          <div className="flex items-center gap-6">
            <img 
              src={playerData.avatar} 
              alt={playerData.displayName}
              className="w-24 h-24 rounded-xl object-cover"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-primary">{playerData.displayName}</h1>
                <span className="text-lg text-secondary">@{playerData.username}</span>
                <div className={`px-3 py-1 rounded-lg text-sm font-medium text-white bg-gradient-to-r ${getRankColor(playerData.rank)}`}>
                  {playerData.rank}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-secondary mb-3">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{playerData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Joined {playerData.joinDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown size={14} />
                  <span>Level {playerData.level}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-sm text-secondary">Rank Points:</span>
                  <span className="ml-2 font-semibold text-primary">{playerData.rankPoints}</span>
                </div>
                <div>
                  <span className="text-sm text-secondary">Favorite Hero:</span>
                  <span className="ml-2 font-semibold text-primary">{playerData.favoriteHero}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2 text-secondary hover:text-primary hover:bg-tertiary rounded-lg transition-colors">
                <Share2 size={16} />
              </button>
              <button className="p-2 text-secondary hover:text-primary hover:bg-tertiary rounded-lg transition-colors">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-secondary border border-color rounded-xl p-2">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'tournaments', label: 'Tournaments', icon: Trophy },
            { id: 'decks', label: 'Decks', icon: Sword },
            { id: 'stats', label: 'Statistics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg'
                    : 'text-secondary hover:text-primary hover:bg-tertiary'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tournaments' && renderTournaments()}
        {activeTab === 'decks' && renderDecks()}
        {activeTab === 'stats' && (
          <div className="bg-secondary border border-color rounded-xl p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Detailed Statistics</h3>
            <p className="text-secondary">Advanced statistics and analytics coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;