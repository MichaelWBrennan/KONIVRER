import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Sword,
  Crown,
  Star,
  Award,
  Zap,
  Users,
  Calendar,
  Trophy,
  Percent,
  Activity,
  Eye,
} from 'lucide-react';

const HeroMatchupAnalysis = ({ hero1, hero2, matches = [] }) => {
  const [timeframe, setTimeframe] = useState('all');
  const [format, setFormat] = useState('all');
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    if (hero1 && hero2) {
      calculateMatchupData();
    }
  }, [hero1, hero2, timeframe, format, matches]);

  const calculateMatchupData = () => {
    // Filter matches based on hero matchup and criteria
    const relevantMatches = matches.filter(match => {
      const hasHeroes =
        (match.player1.hero === hero1 && match.player2.hero === hero2) ||
        (match.player1.hero === hero2 && match.player2.hero === hero1);

      const matchesFormat =
        format === 'all' || match.tournament.format === format;

      let matchesTimeframe = true;
      if (timeframe !== 'all') {
        const matchDate = new Date(match.tournament.date);
        const now = new Date();
        const daysAgo =
          timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
        const cutoffDate = new Date(
          now.getTime() - daysAgo * 24 * 60 * 60 * 1000,
        );
        matchesTimeframe = matchDate >= cutoffDate;
      }

      return hasHeroes && matchesFormat && matchesTimeframe;
    });

    if (relevantMatches.length === 0) {
      setAnalysisData(null);
      return;
    }

    // Calculate statistics
    let hero1Wins = 0;
    let hero2Wins = 0;
    let totalGames = 0;
    let avgDuration = 0;
    const tournamentTypes = {};
    const recentTrend = [];

    relevantMatches.forEach(match => {
      const isHero1Player1 = match.player1.hero === hero1;
      const winner = match.result.winner;

      if (
        (isHero1Player1 && winner === 'player1') ||
        (!isHero1Player1 && winner === 'player2')
      ) {
        hero1Wins++;
      } else {
        hero2Wins++;
      }

      totalGames += match.result.games.length;

      // Convert duration to minutes
      const [minutes, seconds] = match.duration.split(':').map(Number);
      avgDuration += minutes + seconds / 60;

      // Track tournament types
      const tournamentType = match.tournament.format;
      tournamentTypes[tournamentType] =
        (tournamentTypes[tournamentType] || 0) + 1;

      // Add to recent trend (last 10 matches)
      recentTrend.push({
        date: match.tournament.date,
        winner:
          (isHero1Player1 && winner === 'player1') ||
          (!isHero1Player1 && winner === 'player2')
            ? hero1
            : hero2,
        tournament: match.tournament.name,
      });
    });

    // Sort recent trend by date
    recentTrend.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalMatches = relevantMatches.length;
    const hero1WinRate = (hero1Wins / totalMatches) * 100;
    const hero2WinRate = (hero2Wins / totalMatches) * 100;
    avgDuration = avgDuration / totalMatches;

    // Calculate recent form (last 5 matches)
    const recentForm = recentTrend.slice(0, 5);
    const recentHero1Wins = recentForm.filter(
      match => match.winner === hero1,
    ).length;
    const recentWinRate = (recentHero1Wins / recentForm.length) * 100;

    setAnalysisData({
      totalMatches,
      hero1Wins,
      hero2Wins,
      hero1WinRate,
      hero2WinRate,
      avgDuration,
      totalGames,
      tournamentTypes,
      recentTrend: recentTrend.slice(0, 10),
      recentForm,
      recentWinRate,
    });
  };

  const getHeroIcon = heroName => {
    const heroIcons = {
      'Vynnset, Iron Maiden': <Sword className="text-red-400" size={20} />,
      'Briar, Warden of Thorns': (
        <Shield className="text-green-400" size={20} />
      ),
      'Iyslander, Stormbind': <Zap className="text-blue-400" size={20} />,
      'Prism, Sculptor of Arc Light': (
        <Star className="text-yellow-400" size={20} />
      ),
      'Kano, Dracai of Aether': <Crown className="text-purple-400" size={20} />,
      'Rhinar, Reckless Rampage': (
        <Trophy className="text-orange-400" size={20} />
      ),
    };
    return (
      heroIcons[heroName] || <Target className="text-gray-400" size={20} />
    );
  };

  const getWinRateColor = winRate => {
    if (winRate >= 60) return 'text-green-400';
    if (winRate >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendIcon = (recentWinRate, overallWinRate) => {
    if (recentWinRate > overallWinRate + 5)
      return <TrendingUp className="text-green-400" size={16} />;
    if (recentWinRate < overallWinRate - 5)
      return <TrendingDown className="text-red-400" size={16} />;
    return <Activity className="text-gray-400" size={16} />;
  };

  if (!hero1 || !hero2) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <Target className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-xl font-bold text-white mb-2">
          Hero Matchup Analysis
        </h3>
        <p className="text-gray-400">
          Select two heroes to view detailed matchup statistics and analysis
        </p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
        <p className="text-gray-400">
          No matches found for this hero matchup with the current filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            Hero Matchup Analysis
          </h2>
          <div className="flex space-x-2">
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="365d">Last Year</option>
            </select>
            <select
              value={format}
              onChange={e => setFormat(e.target.value)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Formats</option>
              <option value="Classic Constructed">Classic Constructed</option>
              <option value="Blitz">Blitz</option>
              <option value="Draft">Draft</option>
              <option value="Sealed">Sealed</option>
            </select>
          </div>
        </div>

        {/* Hero Matchup Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hero 1 */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {getHeroIcon(hero1)}
              <h3 className="text-lg font-bold text-white">{hero1}</h3>
            </div>
            <div
              className={`text-3xl font-bold ${getWinRateColor(analysisData.hero1WinRate)}`}
            >
              {analysisData.hero1WinRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">
              {analysisData.hero1Wins} wins
            </div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">HEAD TO HEAD</div>
            <div className="text-2xl font-bold text-white mb-2">VS</div>
            <div className="text-sm text-gray-400">
              {analysisData.totalMatches} matches
            </div>
          </div>

          {/* Hero 2 */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {getHeroIcon(hero2)}
              <h3 className="text-lg font-bold text-white">{hero2}</h3>
            </div>
            <div
              className={`text-3xl font-bold ${getWinRateColor(analysisData.hero2WinRate)}`}
            >
              {analysisData.hero2WinRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">
              {analysisData.hero2Wins} wins
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Users className="text-blue-400" size={24} />
            <h3 className="font-medium text-white">Total Matches</h3>
          </div>
          <div className="text-2xl font-bold text-white">
            {analysisData.totalMatches}
          </div>
          <div className="text-sm text-gray-400">
            {analysisData.totalGames} total games
          </div>
        </motion.div>

        {/* Average Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="text-green-400" size={24} />
            <h3 className="font-medium text-white">Avg Duration</h3>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.floor(analysisData.avgDuration)}:
            {String(Math.round((analysisData.avgDuration % 1) * 60)).padStart(
              2,
              '0',
            )}
          </div>
          <div className="text-sm text-gray-400">per match</div>
        </motion.div>

        {/* Recent Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="text-purple-400" size={24} />
            <h3 className="font-medium text-white">Recent Form</h3>
            {getTrendIcon(
              analysisData.recentWinRate,
              analysisData.hero1WinRate,
            )}
          </div>
          <div
            className={`text-2xl font-bold ${getWinRateColor(analysisData.recentWinRate)}`}
          >
            {analysisData.recentWinRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">
            Last {analysisData.recentForm.length} matches
          </div>
        </motion.div>

        {/* Dominance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Award className="text-yellow-400" size={24} />
            <h3 className="font-medium text-white">Favored Hero</h3>
          </div>
          <div className="text-lg font-bold text-white">
            {analysisData.hero1WinRate > analysisData.hero2WinRate
              ? hero1
              : hero2}
          </div>
          <div className="text-sm text-gray-400">
            +
            {Math.abs(
              analysisData.hero1WinRate - analysisData.hero2WinRate,
            ).toFixed(1)}
            % advantage
          </div>
        </motion.div>
      </div>

      {/* Recent Matches */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Eye size={20} />
          <span>Recent Matches</span>
        </h3>
        <div className="space-y-3">
          {analysisData.recentTrend.map((match, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-gray-700 rounded"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${match.winner === hero1 ? 'bg-green-400' : 'bg-red-400'}`}
                />
                <span className="text-white font-medium">{match.winner}</span>
                <span className="text-gray-400">won</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-white">{match.tournament}</div>
                <div className="text-xs text-gray-400">{match.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tournament Breakdown */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <BarChart3 size={20} />
          <span>Format Breakdown</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(analysisData.tournamentTypes).map(
            ([format, count]) => (
              <div key={format} className="flex items-center justify-between">
                <span className="text-white">{format}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(count / analysisData.totalMatches) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-12 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Win Rate Visualization */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Percent size={20} />
          <span>Win Rate Comparison</span>
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white flex items-center space-x-2">
                {getHeroIcon(hero1)}
                <span>{hero1}</span>
              </span>
              <span
                className={`font-bold ${getWinRateColor(analysisData.hero1WinRate)}`}
              >
                {analysisData.hero1WinRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-500 to-green-500 h-3 rounded-full"
                style={{ width: `${analysisData.hero1WinRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white flex items-center space-x-2">
                {getHeroIcon(hero2)}
                <span>{hero2}</span>
              </span>
              <span
                className={`font-bold ${getWinRateColor(analysisData.hero2WinRate)}`}
              >
                {analysisData.hero2WinRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-500 to-green-500 h-3 rounded-full"
                style={{ width: `${analysisData.hero2WinRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroMatchupAnalysis;
