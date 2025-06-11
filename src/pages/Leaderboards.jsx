import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  Calendar,
  Award,
} from 'lucide-react';

const Leaderboards = () => {
  const [activeTab, setActiveTab] = useState('worldTour');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [timeframe, setTimeframe] = useState('current');
  const [loading, setLoading] = useState(true);

  // Sample leaderboard data
  const leaderboardData = {
    worldTour: [
      {
        rank: 1,
        name: 'DragonMaster',
        playerId: '78449312',
        country: 'US',
        points: 89,
        change: 5,
        tournaments: 12,
        winRate: 78.5,
      },
      {
        rank: 2,
        name: 'ElementalForce',
        playerId: '34331578',
        country: 'CA',
        points: 62,
        change: -2,
        tournaments: 8,
        winRate: 72.3,
      },
      {
        rank: 3,
        name: 'ShadowWeaver',
        playerId: '52582252',
        country: 'GB',
        points: 57,
        change: 3,
        tournaments: 10,
        winRate: 69.8,
      },
      {
        rank: 4,
        name: 'IronWill',
        playerId: '42541471',
        country: 'AU',
        points: 57,
        change: 0,
        tournaments: 9,
        winRate: 71.2,
      },
      {
        rank: 5,
        name: 'MysticBlade',
        playerId: '69775991',
        country: 'JP',
        points: 55,
        change: 1,
        tournaments: 11,
        winRate: 68.9,
      },
    ],
    elo: [
      {
        rank: 1,
        name: 'ChampionSlayer',
        playerId: '12345678',
        country: 'US',
        rating: 2847,
        change: 23,
        matches: 156,
        winRate: 82.1,
      },
      {
        rank: 2,
        name: 'VoidWalker',
        playerId: '23456789',
        country: 'KR',
        rating: 2821,
        change: -8,
        matches: 203,
        winRate: 79.8,
      },
      {
        rank: 3,
        name: 'StormCaller',
        playerId: '34567890',
        country: 'DE',
        rating: 2798,
        change: 15,
        matches: 178,
        winRate: 77.5,
      },
    ],
    xp90: [
      {
        rank: 1,
        name: 'GrindMaster',
        playerId: '45678901',
        country: 'CA',
        xp: 4250,
        change: 12,
        events: 28,
        avgPlacement: 3.2,
      },
      {
        rank: 2,
        name: 'TourneyKing',
        playerId: '56789012',
        country: 'US',
        xp: 3890,
        change: 5,
        events: 24,
        avgPlacement: 4.1,
      },
    ],
    xpLifetime: [
      {
        rank: 1,
        name: 'LegendaryPlayer',
        playerId: '67890123',
        country: 'JP',
        xp: 45670,
        change: 8,
        events: 312,
        yearsActive: 5,
      },
    ],
  };

  const regions = [
    { code: 'global', name: 'Global' },
    { code: 'americas', name: 'Americas' },
    { code: 'europe', name: 'Europe' },
    { code: 'asia-pacific', name: 'Asia-Pacific' },
  ];

  const tabs = [
    { id: 'worldTour', name: 'World Tour Points', icon: Trophy },
    { id: 'elo', name: 'ELO Rating', icon: Star },
    { id: 'xp90', name: 'XP (90 Days)', icon: TrendingUp },
    { id: 'xpLifetime', name: 'XP (Lifetime)', icon: Award },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getCountryFlag = countryCode => {
    const flags = {
      US: '🇺🇸',
      CA: '🇨🇦',
      GB: '🇬🇧',
      AU: '🇦🇺',
      JP: '🇯🇵',
      KR: '🇰🇷',
      DE: '🇩🇪',
    };
    return flags[countryCode] || '🌍';
  };

  const getRankIcon = rank => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return (
      <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">
        {rank}
      </span>
    );
  };

  const getChangeIndicator = change => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-400">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-400">
          <TrendingDown className="w-4 h-4 mr-1" />
          <span>{change}</span>
        </div>
      );
    }
    return <span className="text-gray-400">-</span>;
  };

  const renderLeaderboardContent = () => {
    const data = leaderboardData[activeTab] || [];

    if (activeTab === 'worldTour') {
      return (
        <div className="space-y-4">
          {/* Prize Pool Info */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30 mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Player of the Year Prize Pool
            </h3>
            <p className="text-gray-300 mb-4">
              The KONIVRER Player of the Year boasts a $100,000 USD prize pool
              for the 2024/2025 season.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  $25,000
                </div>
                <div className="text-gray-300">1st Place</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">$15,000</div>
                <div className="text-gray-300">Regional Champions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">$10,000</div>
                <div className="text-gray-300">2nd Place Regional</div>
              </div>
            </div>
          </div>

          {data.map((player, index) => (
            <div
              key={player.playerId}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:transform hover:scale-105 ${
                player.rank <= 3
                  ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10'
                  : 'border-gray-700 hover:border-purple-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getRankIcon(player.rank)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-white">
                        {player.name}
                      </span>
                      <span className="text-2xl">
                        {getCountryFlag(player.country)}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      ID: {player.playerId}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">
                    {player.points}
                  </div>
                  <div className="text-gray-400 text-sm">World Tour Points</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-white font-semibold">
                    {player.tournaments}
                  </div>
                  <div className="text-gray-400 text-sm">Tournaments</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">
                    {player.winRate}%
                  </div>
                  <div className="text-gray-400 text-sm">Win Rate</div>
                </div>
                <div className="text-center">
                  {getChangeIndicator(player.change)}
                  <div className="text-gray-400 text-sm">Change</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.map((player, index) => (
          <div
            key={player.playerId}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getRankIcon(player.rank)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-white">
                      {player.name}
                    </span>
                    <span className="text-2xl">
                      {getCountryFlag(player.country)}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    ID: {player.playerId}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">
                  {activeTab === 'elo' ? player.rating : player.xp}
                </div>
                <div className="text-gray-400 text-sm">
                  {activeTab === 'elo' ? 'ELO Rating' : 'XP'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <div className="text-white font-semibold">
                  {activeTab === 'elo' ? player.matches : player.events}
                </div>
                <div className="text-gray-400 text-sm">
                  {activeTab === 'elo' ? 'Matches' : 'Events'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">
                  {activeTab === 'elo'
                    ? `${player.winRate}%`
                    : activeTab === 'xpLifetime'
                      ? `${player.yearsActive}y`
                      : player.avgPlacement}
                </div>
                <div className="text-gray-400 text-sm">
                  {activeTab === 'elo'
                    ? 'Win Rate'
                    : activeTab === 'xpLifetime'
                      ? 'Years Active'
                      : 'Avg Placement'}
                </div>
              </div>
              <div className="text-center">
                {getChangeIndicator(player.change)}
                <div className="text-gray-400 text-sm">Change</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading leaderboards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Leaderboards</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            How do you match up against fellow KONIVRER players in your region
            and around the world? Participate in tournaments to earn XP and ELO
            points.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg mx-2 mb-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Region Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-gray-800/50 rounded-lg p-2">
            {regions.map(region => (
              <button
                key={region.code}
                onClick={() => setSelectedRegion(region.code)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedRegion === region.code
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="max-w-4xl mx-auto">{renderLeaderboardContent()}</div>

        {/* Footer Info */}
        <div className="text-center mt-12 p-6 bg-gray-800/30 rounded-xl">
          <p className="text-gray-400 mb-2">
            <strong className="text-white">Note:</strong> All you need is a
            KONIVRER Player ID to participate in our organized play programs.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
            Register for Player ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;
