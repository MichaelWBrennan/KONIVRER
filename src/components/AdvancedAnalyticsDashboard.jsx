import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Brain,
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  Shuffle,
  Target,
  Maximize,
  Minimize,
  Download,
  Share2,
  Filter,
  Calendar,
  Clock,
  Sliders,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

// Color palette for charts
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00c49f', '#ffbb28', '#ff8042', '#a4de6c', '#d0ed57'
];

const AdvancedAnalyticsDashboard = () => {
  const {
    players,
    matches,
    tournaments,
    metaBreakdown,
    matchupMatrix,
    playerPerformance,
    metaPrediction,
    tournamentRecommendations
  } = usePhysicalMatchmaking();

  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [expandedSections, setExpandedSections] = useState({
    metaBreakdown: true,
    playerInsights: true,
    matchupAnalysis: false,
    tournamentStats: false,
    predictions: false
  });

  // Filter data based on time range
  const filteredMatches = React.useMemo(() => {
    if (timeRange === 'all') return matches;
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return matches;
    }
    
    return matches.filter(match => new Date(match.date) >= cutoffDate);
  }, [matches, timeRange]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate overall stats
  const overallStats = React.useMemo(() => {
    const totalMatches = matches.length;
    const totalPlayers = players.length;
    const totalTournaments = tournaments.length;
    
    const completedMatches = matches.filter(m => m.result && m.result !== 'pending').length;
    const completionRate = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;
    
    const averageRating = players.length > 0 
      ? players.reduce((sum, p) => sum + p.rating, 0) / players.length 
      : 0;
    
    return {
      totalMatches,
      totalPlayers,
      totalTournaments,
      completedMatches,
      completionRate,
      averageRating
    };
  }, [matches, players, tournaments]);

  // Prepare meta breakdown data for charts
  const metaChartData = React.useMemo(() => {
    if (!metaBreakdown || !metaBreakdown.length) return [];
    
    return metaBreakdown
      .slice(0, 10) // Top 10 archetypes
      .map(deck => ({
        name: deck.archetype,
        metaShare: parseFloat(deck.metaPercentage.toFixed(1)),
        winRate: parseFloat(deck.winRate.toFixed(1)),
        adjustedWinRate: parseFloat(deck.adjustedWinRate.toFixed(1)),
        trend: deck.trend
      }));
  }, [metaBreakdown]);

  // Prepare player performance data for charts
  const playerPerformanceData = React.useMemo(() => {
    if (!playerPerformance) return [];
    
    return Object.values(playerPerformance)
      .filter(player => player.matches >= 5) // Only players with enough matches
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 10) // Top 10 players
      .map(player => ({
        name: player.name,
        winRate: parseFloat(player.winRate.toFixed(1)),
        consistency: parseFloat(player.consistency.toFixed(1)),
        improvementRate: parseFloat(player.improvementRate.toFixed(1)),
        matches: player.matches,
        rating: Math.round(player.rating)
      }));
  }, [playerPerformance]);

  // Prepare matchup data for heatmap
  const matchupData = React.useMemo(() => {
    if (!matchupMatrix) return [];
    
    const archetypes = Object.keys(matchupMatrix).slice(0, 8); // Limit to top 8 archetypes
    const data = [];
    
    archetypes.forEach(deck1 => {
      archetypes.forEach(deck2 => {
        if (matchupMatrix[deck1] && matchupMatrix[deck1][deck2] !== undefined) {
          data.push({
            deck1,
            deck2,
            winRate: parseFloat(matchupMatrix[deck1][deck2].toFixed(1))
          });
        }
      });
    });
    
    return { archetypes, data };
  }, [matchupMatrix]);

  // Prepare meta prediction data for charts
  const predictionChartData = React.useMemo(() => {
    if (!metaPrediction || !metaPrediction.length) return [];
    
    return metaPrediction
      .slice(0, 8) // Top 8 archetypes
      .map(prediction => ({
        name: prediction.archetype,
        current: parseFloat(prediction.currentPercentage.toFixed(1)),
        predicted: parseFloat(prediction.predictedPercentage.toFixed(1)),
        change: parseFloat(prediction.predictedChange.toFixed(1)),
        reason: prediction.reason
      }));
  }, [metaPrediction]);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-6">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-amber-300 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-amber-400" />
            Arcane Analytics Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-amber-500 ancient-select"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="quarter">Past Quarter</option>
            </select>
            <motion.button
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Download className="w-5 h-5 text-amber-300" />
            </motion.button>
            <motion.button
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-5 h-5 text-amber-300" />
            </motion.button>
          </div>
        </div>
        
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
              activeTab === 'overview' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
              activeTab === 'meta' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('meta')}
          >
            <PieChartIcon className="w-4 h-4" />
            <span>Meta Analysis</span>
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
              activeTab === 'players' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('players')}
          >
            <Users className="w-4 h-4" />
            <span>Player Insights</span>
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
              activeTab === 'matchups' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('matchups')}
          >
            <Shuffle className="w-4 h-4" />
            <span>Matchups</span>
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
              activeTab === 'predictions' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('predictions')}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Predictions</span>
          </button>
        </div>
      </header>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 ancient-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-amber-300">Total Matches</h3>
                <div className="p-3 bg-amber-900 bg-opacity-30 rounded-full">
                  <Activity className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{overallStats.totalMatches}</p>
                  <p className="text-sm text-gray-400">
                    {overallStats.completedMatches} completed ({overallStats.completionRate.toFixed(1)}%)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{Math.round(filteredMatches.length / 10)} this period
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 ancient-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-amber-300">Active Players</h3>
                <div className="p-3 bg-purple-900 bg-opacity-30 rounded-full">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{overallStats.totalPlayers}</p>
                  <p className="text-sm text-gray-400">
                    Avg. Rating: {Math.round(overallStats.averageRating)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{Math.round(players.length / 20)} this period
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 ancient-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-amber-300">Tournaments</h3>
                <div className="p-3 bg-indigo-900 bg-opacity-30 rounded-full">
                  <Award className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{overallStats.totalTournaments}</p>
                  <p className="text-sm text-gray-400">
                    {tournaments.filter(t => t.status === 'completed').length} completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{Math.round(tournaments.length / 5)} this period
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Meta Breakdown Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('metaBreakdown')}
            >
              <h2 className="text-xl font-semibold text-amber-300 flex items-center">
                <PieChartIcon className="w-5 h-5 mr-2 text-amber-400" />
                Meta Breakdown
              </h2>
              <button className="text-gray-400 hover:text-white">
                {expandedSections.metaBreakdown ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            <AnimatePresence>
              {expandedSections.metaBreakdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-300">Meta Share</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={metaChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="metaShare"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            >
                              {metaChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-300">Win Rates</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={metaChartData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                            <Bar dataKey="winRate" name="Win Rate" fill="#8884d8" />
                            <Bar dataKey="adjustedWinRate" name="Adjusted Win Rate" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-300">Trending Archetypes</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Archetype</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Meta %</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Win Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trend</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {metaChartData.map((deck, index) => (
                            <tr key={index} className="hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{deck.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{deck.metaShare}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{deck.winRate}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {deck.trend === 'rising' && <span className="text-green-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> Rising</span>}
                                {deck.trend === 'falling' && <span className="text-red-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1 transform rotate-180" /> Falling</span>}
                                {deck.trend === 'neutral' && <span className="text-gray-400 flex items-center"><Activity className="w-4 h-4 mr-1" /> Stable</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Player Insights Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('playerInsights')}
            >
              <h2 className="text-xl font-semibold text-amber-300 flex items-center">
                <Users className="w-5 h-5 mr-2 text-amber-400" />
                Player Insights
              </h2>
              <button className="text-gray-400 hover:text-white">
                {expandedSections.playerInsights ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            <AnimatePresence>
              {expandedSections.playerInsights && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-300">Top Players by Win Rate</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={playerPerformanceData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                            <Bar dataKey="winRate" name="Win Rate %" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-300">Player Consistency</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={90} data={playerPerformanceData.slice(0, 5)}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis domain={[0, 100]} />
                            <Radar name="Win Rate" dataKey="winRate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Radar name="Consistency" dataKey="consistency" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                            <Legend />
                            <Tooltip formatter={(value) => `${value}%`} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-300">Player Performance</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Win Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Consistency</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Improvement</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Matches</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {playerPerformanceData.map((player, index) => (
                            <tr key={index} className="hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{player.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.rating}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.winRate}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.consistency}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {player.improvementRate > 10 && <span className="text-green-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> {player.improvementRate}%</span>}
                                {player.improvementRate < -10 && <span className="text-red-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1 transform rotate-180" /> {player.improvementRate}%</span>}
                                {player.improvementRate >= -10 && player.improvementRate <= 10 && <span className="text-gray-400 flex items-center"><Activity className="w-4 h-4 mr-1" /> {player.improvementRate}%</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.matches}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Matchup Analysis Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('matchupAnalysis')}
            >
              <h2 className="text-xl font-semibold text-amber-300 flex items-center">
                <Shuffle className="w-5 h-5 mr-2 text-amber-400" />
                Matchup Analysis
              </h2>
              <button className="text-gray-400 hover:text-white">
                {expandedSections.matchupAnalysis ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            <AnimatePresence>
              {expandedSections.matchupAnalysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-4 text-gray-300">Matchup Win Rates</h3>
                    
                    {matchupData.archetypes && matchupData.archetypes.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Archetype</th>
                              {matchupData.archetypes.map((deck, i) => (
                                <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{deck}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {matchupData.archetypes.map((deck1, i) => (
                              <tr key={i} className="hover:bg-gray-700">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{deck1}</td>
                                {matchupData.archetypes.map((deck2, j) => {
                                  const matchup = matchupData.data.find(m => m.deck1 === deck1 && m.deck2 === deck2);
                                  const winRate = matchup ? matchup.winRate : 50;
                                  
                                  let bgColor = 'bg-gray-800';
                                  let textColor = 'text-gray-300';
                                  
                                  if (deck1 === deck2) {
                                    bgColor = 'bg-gray-700';
                                    textColor = 'text-gray-400';
                                  } else if (winRate > 60) {
                                    bgColor = 'bg-green-900 bg-opacity-40';
                                    textColor = 'text-green-300';
                                  } else if (winRate < 40) {
                                    bgColor = 'bg-red-900 bg-opacity-40';
                                    textColor = 'text-red-300';
                                  } else if (winRate > 55) {
                                    bgColor = 'bg-green-900 bg-opacity-20';
                                    textColor = 'text-green-400';
                                  } else if (winRate < 45) {
                                    bgColor = 'bg-red-900 bg-opacity-20';
                                    textColor = 'text-red-400';
                                  }
                                  
                                  return (
                                    <td key={j} className={`px-4 py-4 whitespace-nowrap text-sm ${bgColor} ${textColor}`}>
                                      {winRate}%
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                        <p>Not enough matchup data available.</p>
                        <p className="text-sm mt-2">Play more matches with different archetypes to generate matchup statistics.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Predictions Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('predictions')}
            >
              <h2 className="text-xl font-semibold text-amber-300 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-amber-400" />
                Meta Predictions
              </h2>
              <button className="text-gray-400 hover:text-white">
                {expandedSections.predictions ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            <AnimatePresence>
              {expandedSections.predictions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-4 text-gray-300">Predicted Meta Evolution</h3>
                    
                    <div className="h-80 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={predictionChartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 'dataMax + 5']} />
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                          <Bar dataKey="current" name="Current Meta %" fill="#8884d8" />
                          <Bar dataKey="predicted" name="Predicted Meta %" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Archetype</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current %</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Predicted %</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {predictionChartData.map((prediction, index) => (
                            <tr key={index} className="hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{prediction.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{prediction.current}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{prediction.predicted}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {prediction.change > 0 && <span className="text-green-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +{prediction.change}%</span>}
                                {prediction.change < 0 && <span className="text-red-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1 transform rotate-180" /> {prediction.change}%</span>}
                                {prediction.change === 0 && <span className="text-gray-400 flex items-center"><Activity className="w-4 h-4 mr-1" /> 0%</span>}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">{prediction.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6 p-4 bg-amber-900 bg-opacity-20 rounded-lg border border-amber-800">
                      <div className="flex items-start">
                        <Info className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-300 mb-1">Prediction Methodology</h4>
                          <p className="text-sm text-gray-300">
                            These predictions are based on Bayesian analysis of current meta trends, win rates, and player behavior patterns. 
                            The model considers deck performance, popularity trends, and the tendency of the meta to adapt to dominant strategies.
                            Predictions become more accurate as more match data is collected.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {/* Other tabs would be implemented here */}
      
      <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
        <p>Advanced Analytics Dashboard powered by KONIVRER Bayesian Engine</p>
        <p className="mt-1">Data refreshed: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;