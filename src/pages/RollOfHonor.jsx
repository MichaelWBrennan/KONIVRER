import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Star, Calendar, MapPin, Users, Award } from 'lucide-react';

const RollOfHonor = () => {
  const [activeCategory, setActiveCategory] = useState('champions');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [loading, setLoading] = useState(true);

  // Sample hall of fame data
  const honorData = {
    champions: [
      {
        id: 1,
        name: "Alexandra 'Storm Queen' Chen",
        title: "World Champion 2024",
        year: "2024",
        country: "US",
        achievement: "KONIVRER World Championship",
        hero: "Zara Stormcaller",
        winRate: "89.2%",
        totalTournaments: 24,
        majorWins: 8,
        description: "Dominated the 2024 season with innovative storm-based strategies and flawless execution.",
        achievements: [
          "World Champion 2024",
          "3x Regional Champion",
          "Player of the Year 2024",
          "Most Tournament Wins (2024)"
        ]
      },
      {
        id: 2,
        name: "Marcus 'The Forge' Ironwood",
        title: "World Champion 2023",
        year: "2023",
        country: "CA",
        achievement: "KONIVRER World Championship",
        hero: "Thane Ironforge",
        winRate: "87.5%",
        totalTournaments: 28,
        majorWins: 12,
        description: "Legendary craftsman who revolutionized elemental deck building and tournament strategy.",
        achievements: [
          "World Champion 2023",
          "5x Regional Champion",
          "Hall of Fame Inductee",
          "Deck Innovation Award"
        ]
      },
      {
        id: 3,
        name: "Elena 'Shadowblade' Nightfall",
        title: "World Champion 2022",
        year: "2022",
        country: "JP",
        achievement: "KONIVRER World Championship",
        hero: "Lyra Nightwhisper",
        winRate: "91.3%",
        totalTournaments: 19,
        majorWins: 15,
        description: "Master of shadow techniques whose precision and tactical brilliance set new standards.",
        achievements: [
          "World Champion 2022",
          "Highest Win Rate Record",
          "Perfect Season Achievement",
          "Shadow Master Title"
        ]
      }
    ],
    hallOfFame: [
      {
        id: 1,
        name: "Viktor 'The Legend' Dragonheart",
        inductionYear: "2024",
        country: "DE",
        yearsActive: "2019-2023",
        totalWins: 45,
        worldTitles: 2,
        description: "Pioneer of competitive KONIVRER who established many foundational strategies still used today.",
        legacy: "Created the 'Dragonheart Meta' that dominated early competitive play."
      },
      {
        id: 2,
        name: "Sarah 'Mystic' Moonweaver",
        inductionYear: "2023",
        country: "AU",
        yearsActive: "2020-2022",
        totalWins: 38,
        worldTitles: 1,
        description: "Innovative deck builder whose creative approaches changed how players think about card synergies.",
        legacy: "Developed the 'Moonweave Combo' archetype that influenced an entire generation of players."
      }
    ],
    records: [
      {
        category: "Tournament Wins",
        record: "45 Major Tournaments",
        holder: "Viktor Dragonheart",
        year: "2019-2023",
        description: "Most major tournament victories in competitive history."
      },
      {
        category: "Highest Win Rate",
        record: "91.3% (Season)",
        holder: "Elena Nightfall",
        year: "2022",
        description: "Highest single-season win rate in professional play."
      },
      {
        category: "Longest Win Streak",
        record: "23 Consecutive Wins",
        holder: "Marcus Ironwood",
        year: "2023",
        description: "Longest undefeated streak across multiple tournaments."
      },
      {
        category: "Most Regional Titles",
        record: "8 Regional Championships",
        holder: "Alexandra Chen",
        year: "2022-2024",
        description: "Most regional championship titles won by a single player."
      }
    ],
    achievements: [
      {
        title: "Perfect Season",
        description: "Win every tournament entered in a single season",
        holders: ["Elena Nightfall (2022)"],
        rarity: "Legendary"
      },
      {
        title: "Grand Slam",
        description: "Win World Championship, Regional Championship, and National Championship in the same year",
        holders: ["Alexandra Chen (2024)", "Marcus Ironwood (2023)"],
        rarity: "Epic"
      },
      {
        title: "Triple Crown",
        description: "Win three consecutive major tournaments",
        holders: ["Viktor Dragonheart (2021)", "Sarah Moonweaver (2022)", "Elena Nightfall (2022)"],
        rarity: "Rare"
      },
      {
        title: "Innovation Master",
        description: "Create a deck archetype that becomes tournament meta",
        holders: ["Sarah Moonweaver", "Viktor Dragonheart", "Marcus Ironwood"],
        rarity: "Epic"
      }
    ]
  };

  const categories = [
    { id: 'champions', name: 'World Champions', icon: Crown },
    { id: 'hallOfFame', name: 'Hall of Fame', icon: Star },
    { id: 'records', name: 'Records', icon: Trophy },
    { id: 'achievements', name: 'Achievements', icon: Award }
  ];

  const years = ['2025', '2024', '2023', '2022', '2021', '2020'];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getCountryFlag = (countryCode) => {
    const flags = {
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'JP': '🇯🇵',
      'DE': '🇩🇪',
      'AU': '🇦🇺',
      'GB': '🇬🇧',
      'FR': '🇫🇷',
      'KR': '🇰🇷'
    };
    return flags[countryCode] || '🌍';
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Legendary': 'from-yellow-500 to-orange-500',
      'Epic': 'from-purple-500 to-pink-500',
      'Rare': 'from-blue-500 to-cyan-500',
      'Common': 'from-gray-500 to-gray-600'
    };
    return colors[rarity] || colors['Common'];
  };

  const renderChampions = () => (
    <div className="space-y-8">
      {honorData.champions.map((champion, index) => (
        <div
          key={champion.id}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-8 border border-yellow-500/30"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Crown className="w-16 h-16 text-yellow-400" />
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  #{index + 1}
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{champion.name}</h3>
                <p className="text-yellow-400 text-xl font-semibold mb-1">{champion.title}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCountryFlag(champion.country)}</span>
                  <span className="text-gray-300">{champion.year}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg mb-2">
                Main Hero: {champion.hero}
              </div>
              <div className="text-gray-300 text-sm">
                Win Rate: <span className="text-green-400 font-semibold">{champion.winRate}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-6 text-lg">{champion.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{champion.totalTournaments}</div>
              <div className="text-gray-400">Total Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{champion.majorWins}</div>
              <div className="text-gray-400">Major Wins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{champion.winRate}</div>
              <div className="text-gray-400">Win Rate</div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Notable Achievements:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {champion.achievements.map((achievement, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Medal className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHallOfFame = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {honorData.hallOfFame.map(member => (
        <div
          key={member.id}
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-purple-300">Inducted {member.inductionYear}</p>
              </div>
            </div>
            <span className="text-2xl">{getCountryFlag(member.country)}</span>
          </div>

          <p className="text-gray-300 mb-4">{member.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{member.totalWins}</div>
              <div className="text-gray-400 text-sm">Total Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{member.worldTitles}</div>
              <div className="text-gray-400 text-sm">World Titles</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{member.yearsActive}</div>
              <div className="text-gray-400 text-sm">Years Active</div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Legacy:</h4>
            <p className="text-gray-300 text-sm">{member.legacy}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecords = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {honorData.records.map((record, index) => (
        <div
          key={index}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
              Record
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{record.category}</h3>
          <div className="text-3xl font-bold text-purple-400 mb-2">{record.record}</div>
          <div className="text-gray-300 mb-3">
            Held by <span className="text-white font-semibold">{record.holder}</span>
          </div>
          <div className="text-gray-400 text-sm mb-3">{record.year}</div>
          <p className="text-gray-300 text-sm">{record.description}</p>
        </div>
      ))}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      {honorData.achievements.map((achievement, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)}/20 rounded-xl p-6 border border-current/30`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-current" />
              <div>
                <h3 className="text-2xl font-bold text-white">{achievement.title}</h3>
                <span className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} bg-clip-text text-transparent font-semibold`}>
                  {achievement.rarity}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-4">{achievement.description}</p>

          <div>
            <h4 className="text-white font-semibold mb-2">Achievement Holders:</h4>
            <div className="space-y-1">
              {achievement.holders.map((holder, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Medal className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">{holder}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'champions':
        return renderChampions();
      case 'hallOfFame':
        return renderHallOfFame();
      case 'records':
        return renderRecords();
      case 'achievements':
        return renderAchievements();
      default:
        return renderChampions();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading hall of fame...</p>
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
          <h1 className="text-4xl font-bold text-white mb-4">Roll of Honor</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Celebrating the greatest champions, record holders, and legendary players who have shaped 
            the competitive landscape of KONIVRER. Their achievements inspire future generations.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg mx-2 mb-2 transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Year Filter (for champions) */}
        {activeCategory === 'champions' && (
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-gray-800/50 rounded-lg p-2">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedYear === year
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>

        {/* Nomination Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-8 border border-purple-500/30">
          <div className="text-center">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Nominate a Legend</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Know a player who deserves recognition for their contributions to competitive KONIVRER? 
              The community can nominate players for Hall of Fame consideration based on their achievements, 
              sportsmanship, and impact on the game.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors">
              Submit Nomination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RollOfHonor;