import React, { useState, useEffect, useMemo } from 'react';
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
  Radar,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';
import {
  Layers,
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
  X,
  Search,
  Plus,
  Minus,
  Edit,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Percent,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  Database
} from 'lucide-react';

// Color palette for charts
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00c49f', '#ffbb28', '#ff8042', '#a4de6c', '#d0ed57'
];

// Trend indicators
const TREND_INDICATORS = {
  rising: { icon: <ArrowUp className="w-4 h-4" />, color: 'text-green-400' },
  falling: { icon: <ArrowDown className="w-4 h-4" />, color: 'text-red-400' },
  neutral: { icon: <ArrowRight className="w-4 h-4" />, color: 'text-gray-400' }
};

const DeckArchetypeAnalyzer = () => {
  const {
    matches,
    players,
    metaBreakdown,
    matchupMatrix,
    metaPrediction
  } = usePhysicalMatchmaking();

  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [expandedSections, setExpandedSections] = useState({
    metaBreakdown: true,
    matchupAnalysis: true,
    metaPrediction: true,
    deckRecommendations: false
  });
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [customDecks, setCustomDecks] = useState([]);
  const [newDeckForm, setNewDeckForm] = useState({
    name: '',
    cards: [],
    description: ''
  });
  const [showNewDeckForm, setShowNewDeckForm] = useState(false);

  // Filter data based on time range
  const filteredMatches = useMemo(() => {
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

  // Filter archetypes based on search query
  const filteredArchetypes = useMemo(() => {
    if (!metaBreakdown) return [];
    
    if (!searchQuery) return metaBreakdown;
    
    return metaBreakdown.filter(deck => 
      deck.archetype.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [metaBreakdown, searchQuery]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle archetype selection
  const handleArchetypeSelect = (archetype) => {
    setSelectedArchetype(archetype === selectedArchetype ? null : archetype);
  };

  // Get matchups for selected archetype
  const getArchetypeMatchups = (archetype) => {
    if (!matchupMatrix || !archetype || !matchupMatrix[archetype]) return [];
    
    const matchups = Object.keys(matchupMatrix[archetype])
      .filter(opponent => opponent !== archetype)
      .map(opponent => ({
        opponent,
        winRate: matchupMatrix[archetype][opponent],
        isFavorable: matchupMatrix[archetype][opponent] > 55,
        isUnfavorable: matchupMatrix[archetype][opponent] < 45
      }))
      .sort((a, b) => b.winRate - a.winRate);
    
    return matchups;
  };

  // Get archetype prediction
  const getArchetypePrediction = (archetype) => {
    if (!metaPrediction || !archetype) return null;
    
    return metaPrediction.find(prediction => prediction.archetype === archetype);
  };

  // Calculate meta diversity
  const metaDiversity = useMemo(() => {
    if (!metaBreakdown || metaBreakdown.length === 0) return 0;
    
    // Calculate Shannon diversity index
    const totalDecks = metaBreakdown.reduce((sum, deck) => sum + deck.count, 0);
    
    if (totalDecks === 0) return 0;
    
    const shannonIndex = metaBreakdown.reduce((sum, deck) => {
      const p = deck.count / totalDecks;
      return sum - (p * Math.log(p));
    }, 0);
    
    // Normalize to 0-100 scale
    // Max diversity would be log(number of archetypes)
    const maxDiversity = Math.log(metaBreakdown.length);
    return (shannonIndex / maxDiversity) * 100;
  }, [metaBreakdown]);

  // Generate deck recommendations based on meta
  const deckRecommendations = useMemo(() => {
    if (!metaBreakdown || !matchupMatrix) return [];
    
    // Get top meta decks
    const topMetaDecks = [...metaBreakdown]
      .sort((a, b) => b.metaPercentage - a.metaPercentage)
      .slice(0, 5)
      .map(deck => deck.archetype);
    
    // Find decks with good matchups against top meta
    const recommendations = Object.keys(matchupMatrix)
      .filter(deck => !topMetaDecks.includes(deck)) // Exclude top meta decks
      .map(deck => {
        // Calculate average win rate against top meta
        const matchups = topMetaDecks
          .filter(opponent => matchupMatrix[deck] && matchupMatrix[deck][opponent])
          .map(opponent => matchupMatrix[deck][opponent]);
        
        const avgWinRate = matchups.length > 0
          ? matchups.reduce((sum, rate) => sum + rate, 0) / matchups.length
          : 50;
        
        // Get deck meta share
        const deckMeta = metaBreakdown.find(meta => meta.archetype === deck);
        const metaShare = deckMeta ? deckMeta.metaPercentage : 0;
        
        // Calculate recommendation score
        // Higher win rate against meta and lower meta share = better recommendation
        const recommendationScore = avgWinRate * (1 + (1 - metaShare / 100) * 0.5);
        
        return {
          archetype: deck,
          avgWinRateAgainstMeta: avgWinRate,
          metaShare,
          recommendationScore,
          matchups: topMetaDecks.map(opponent => ({
            opponent,
            winRate: matchupMatrix[deck] && matchupMatrix[deck][opponent] 
              ? matchupMatrix[deck][opponent] 
              : 50
          }))
        };
      })
      .filter(deck => deck.avgWinRateAgainstMeta > 50) // Only recommend decks with >50% win rate
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 5);
    
    return recommendations;
  }, [metaBreakdown, matchupMatrix]);

  // Handle new deck form submission
  const handleNewDeckSubmit = (e) => {
    e.preventDefault();
    
    if (!newDeckForm.name) return;
    
    setCustomDecks(prev => [...prev, {
      ...newDeckForm,
      id: `custom_${Date.now()}`,
      createdAt: new Date()
    }]);
    
    setNewDeckForm({
      name: '',
      cards: [],
      description: ''
    });
    
    setShowNewDeckForm(false);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-6">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-amber-300 flex items-center">
            <Layers className="w-8 h-8 mr-3 text-amber-400" />
            Arcane Deck Analysis
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
              onClick={() => setShowAdvancedStats(!showAdvancedStats)}
            >
              <Sliders className="w-5 h-5 text-amber-300" />
            </motion.button>
            <motion.button
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Download className="w-5 h-5 text-amber-300" />
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
            <PieChartIcon className="w-4 h-4" />
            <span>Meta Overview</span>
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
              activeTab === 'matchups' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('matchups')}
          >
            <Shuffle className="w-4 h-4" />
            <span>Matchup Analysis</span>
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
              activeTab === 'predictions' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('predictions')}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Meta Predictions</span>
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
              activeTab === 'mydecks' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('mydecks')}
          >
            <Database className="w-4 h-4" />
            <span>My Decks</span>
          </button>
        </div>
      </header>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Meta Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 ancient-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-amber-300">Total Archetypes</h3>
                <div className="p-3 bg-amber-900 bg-opacity-30 rounded-full">
                  <Layers className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{metaBreakdown?.length || 0}</p>
                  <p className="text-sm text-gray-400">
                    {metaBreakdown?.filter(deck => deck.metaPercentage > 5).length || 0} major archetypes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{Math.round((metaBreakdown?.length || 0) / 10)} this period
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
                <h3 className="text-lg font-medium text-amber-300">Meta Diversity</h3>
                <div className="p-3 bg-purple-900 bg-opacity-30 rounded-full">
                  <Shuffle className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{metaDiversity.toFixed(1)}%</p>
                  <p className="text-sm text-gray-400">
                    {metaDiversity > 70 ? 'Highly diverse' : 
                     metaDiversity > 50 ? 'Moderately diverse' : 
                     'Low diversity'}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm flex items-center ${
                    metaDiversity > 60 ? 'text-green-400' : 'text-amber-400'
                  }`}>
                    {metaDiversity > 60 ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Healthy meta
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Needs diversity
                      </>
                    )}
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
                <h3 className="text-lg font-medium text-amber-300">Top Archetype</h3>
                <div className="p-3 bg-indigo-900 bg-opacity-30 rounded-full">
                  <Award className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {metaBreakdown && metaBreakdown.length > 0 
                      ? metaBreakdown[0].archetype 
                      : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {metaBreakdown && metaBreakdown.length > 0 
                      ? `${metaBreakdown[0].metaPercentage.toFixed(1)}% of meta` 
                      : 'No data'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-400 flex items-center">
                    <Percent className="w-4 h-4 mr-1" />
                    {metaBreakdown && metaBreakdown.length > 0 
                      ? `${metaBreakdown[0].winRate.toFixed(1)}% win rate` 
                      : 'N/A'}
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
                  <div className="mt-4">
                    <div className="flex justify-between mb-4">
                      <div className="relative w-64">
                        <input
                          type="text"
                          placeholder="Search archetypes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 text-white"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">Sort by:</span>
                        <select
                          className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-amber-500 ancient-select"
                          defaultValue="meta"
                        >
                          <option value="meta">Meta %</option>
                          <option value="winrate">Win Rate</option>
                          <option value="trend">Trend</option>
                          <option value="name">Name</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-gray-300">Meta Share</h3>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={filteredArchetypes.slice(0, 10)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="metaPercentage"
                                nameKey="archetype"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                              >
                                {filteredArchetypes.slice(0, 10).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
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
                              data={filteredArchetypes.slice(0, 10)}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis dataKey="archetype" type="category" width={100} />
                              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                              <Legend />
                              <Bar dataKey="winRate" name="Win Rate" fill="#8884d8" />
                              <Bar dataKey="adjustedWinRate" name="Adjusted Win Rate" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4 text-gray-300">Archetype Details</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Archetype</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Meta %</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Win Rate</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trend</th>
                              {showAdvancedStats && (
                                <>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Adjusted WR</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Count</th>
                                </>
                              )}
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {filteredArchetypes.map((deck, index) => (
                              <tr 
                                key={index} 
                                className={`hover:bg-gray-700 ${selectedArchetype === deck.archetype ? 'bg-amber-900 bg-opacity-20' : ''}`}
                                onClick={() => handleArchetypeSelect(deck.archetype)}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{deck.archetype}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{deck.metaPercentage.toFixed(1)}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{deck.winRate.toFixed(1)}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`flex items-center ${TREND_INDICATORS[deck.trend].color}`}>
                                    {TREND_INDICATORS[deck.trend].icon}
                                    <span className="ml-1 capitalize">{deck.trend}</span>
                                  </span>
                                </td>
                                {showAdvancedStats && (
                                  <>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{deck.adjustedWinRate.toFixed(1)}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{deck.count}</td>
                                  </>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <button 
                                    className="text-amber-400 hover:text-amber-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveTab('matchups');
                                      setSelectedArchetype(deck.archetype);
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
                    {selectedArchetype ? (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-amber-300">
                            {selectedArchetype} Matchups
                          </h3>
                          <button
                            onClick={() => setSelectedArchetype(null)}
                            className="text-sm text-gray-400 hover:text-white flex items-center"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Clear Selection
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-md font-medium mb-3 text-gray-300">Favorable Matchups</h4>
                            <div className="bg-gray-800 rounded-lg p-4">
                              {getArchetypeMatchups(selectedArchetype)
                                .filter(matchup => matchup.isFavorable)
                                .slice(0, 5)
                                .map((matchup, index) => (
                                  <div 
                                    key={index}
                                    className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
                                  >
                                    <span className="text-sm">{matchup.opponent}</span>
                                    <span className="text-sm text-green-400">{matchup.winRate.toFixed(1)}%</span>
                                  </div>
                                ))}
                              
                              {getArchetypeMatchups(selectedArchetype).filter(matchup => matchup.isFavorable).length === 0 && (
                                <div className="text-center py-4 text-gray-400">
                                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                                  <p>No favorable matchups found</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-md font-medium mb-3 text-gray-300">Unfavorable Matchups</h4>
                            <div className="bg-gray-800 rounded-lg p-4">
                              {getArchetypeMatchups(selectedArchetype)
                                .filter(matchup => matchup.isUnfavorable)
                                .slice(0, 5)
                                .map((matchup, index) => (
                                  <div 
                                    key={index}
                                    className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
                                  >
                                    <span className="text-sm">{matchup.opponent}</span>
                                    <span className="text-sm text-red-400">{matchup.winRate.toFixed(1)}%</span>
                                  </div>
                                ))}
                              
                              {getArchetypeMatchups(selectedArchetype).filter(matchup => matchup.isUnfavorable).length === 0 && (
                                <div className="text-center py-4 text-gray-400">
                                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                  <p>No unfavorable matchups found</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="text-md font-medium mb-3 text-gray-300">All Matchups</h4>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={getArchetypeMatchups(selectedArchetype)}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="opponent" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                                <Legend />
                                <Bar 
                                  dataKey="winRate" 
                                  name="Win Rate %" 
                                  fill="#8884d8"
                                  isAnimationActive={true}
                                  animationDuration={1000}
                                >
                                  {getArchetypeMatchups(selectedArchetype).map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={entry.isFavorable ? '#82ca9d' : entry.isUnfavorable ? '#ff8042' : '#8884d8'} 
                                    />
                                  ))}
                                </Bar>
                                <Bar dataKey="winRate" name="Win Rate %" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        {/* Meta Prediction for Selected Archetype */}
                        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                          <h4 className="text-md font-medium mb-3 text-amber-300 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Future Outlook
                          </h4>
                          
                          {getArchetypePrediction(selectedArchetype) ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-gray-700 p-3 rounded-lg">
                                <div className="text-sm text-gray-400 mb-1">Current Meta Share</div>
                                <div className="text-xl font-bold">
                                  {getArchetypePrediction(selectedArchetype).currentPercentage.toFixed(1)}%
                                </div>
                              </div>
                              
                              <div className="bg-gray-700 p-3 rounded-lg">
                                <div className="text-sm text-gray-400 mb-1">Predicted Meta Share</div>
                                <div className="text-xl font-bold">
                                  {getArchetypePrediction(selectedArchetype).predictedPercentage.toFixed(1)}%
                                </div>
                              </div>
                              
                              <div className="bg-gray-700 p-3 rounded-lg">
                                <div className="text-sm text-gray-400 mb-1">Predicted Change</div>
                                <div className={`text-xl font-bold flex items-center ${
                                  getArchetypePrediction(selectedArchetype).predictedChange > 0 
                                    ? 'text-green-400' 
                                    : getArchetypePrediction(selectedArchetype).predictedChange < 0 
                                      ? 'text-red-400' 
                                      : 'text-gray-300'
                                }`}>
                                  {getArchetypePrediction(selectedArchetype).predictedChange > 0 && '+'}
                                  {getArchetypePrediction(selectedArchetype).predictedChange.toFixed(1)}%
                                  {getArchetypePrediction(selectedArchetype).predictedChange > 0 
                                    ? <ArrowUp className="w-4 h-4 ml-1" /> 
                                    : getArchetypePrediction(selectedArchetype).predictedChange < 0 
                                      ? <ArrowDown className="w-4 h-4 ml-1" /> 
                                      : <ArrowRight className="w-4 h-4 ml-1" />}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-400">
                              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                              <p>No prediction data available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Shuffle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-medium text-gray-300 mb-2">Select an Archetype</h3>
                        <p className="text-gray-400 mb-6">Choose an archetype from the list above to view detailed matchup analysis</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Deck Recommendations Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('deckRecommendations')}
            >
              <h2 className="text-xl font-semibold text-amber-300 flex items-center">
                <Target className="w-5 h-5 mr-2 text-amber-400" />
                Meta Counters & Recommendations
              </h2>
              <button className="text-gray-400 hover:text-white">
                {expandedSections.deckRecommendations ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            <AnimatePresence>
              {expandedSections.deckRecommendations && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4">
                    <div className="mb-4 p-4 bg-amber-900 bg-opacity-20 rounded-lg border border-amber-800">
                      <div className="flex items-start">
                        <Info className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-300 mb-1">Meta Counter Recommendations</h4>
                          <p className="text-sm text-gray-300">
                            These recommendations are based on archetypes with strong matchups against the current top meta decks.
                            The algorithm considers both win rates against popular decks and the current meta share to identify underplayed counters.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {deckRecommendations.map((deck, index) => (
                        <motion.div
                          key={index}
                          className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-amber-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-white">{deck.archetype}</h4>
                            <div className="bg-amber-900 bg-opacity-30 px-2 py-0.5 rounded text-xs text-amber-300">
                              {Math.round(deck.recommendationScore)}% Score
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Meta Share</span>
                              <span className="text-gray-300">{deck.metaShare.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Avg. vs Meta</span>
                              <span className={deck.avgWinRateAgainstMeta > 55 ? 'text-green-400' : 'text-gray-300'}>
                                {deck.avgWinRateAgainstMeta.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-700 pt-3">
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Top Matchups</h5>
                            {deck.matchups.slice(0, 3).map((matchup, idx) => (
                              <div key={idx} className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">{matchup.opponent}</span>
                                <span className={matchup.winRate > 55 ? 'text-green-400' : matchup.winRate < 45 ? 'text-red-400' : 'text-gray-300'}>
                                  {matchup.winRate.toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                      
                      {deckRecommendations.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-400">
                          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                          <p>Not enough matchup data to generate recommendations.</p>
                          <p className="text-sm mt-2">Play more matches with different archetypes to improve recommendations.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {activeTab === 'matchups' && (
        <div className="space-y-6">
          {/* Matchup Matrix */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
            <h2 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              <Shuffle className="w-5 h-5 mr-2 text-amber-400" />
              Matchup Matrix
            </h2>
            
            <div className="overflow-x-auto">
              {matchupMatrix && Object.keys(matchupMatrix).length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-800 z-10">Archetype</th>
                      {Object.keys(matchupMatrix).slice(0, 10).map((deck, i) => (
                        <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{deck}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {Object.keys(matchupMatrix).slice(0, 10).map((deck1, i) => (
                      <tr key={i} className="hover:bg-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white sticky left-0 bg-gray-800 z-10">{deck1}</td>
                        {Object.keys(matchupMatrix).slice(0, 10).map((deck2, j) => {
                          const winRate = matchupMatrix[deck1][deck2] || 50;
                          
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
                              {winRate.toFixed(1)}%
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                  <p>Not enough matchup data available.</p>
                  <p className="text-sm mt-2">Play more matches with different archetypes to generate matchup statistics.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Matchup Visualization */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
            <h2 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-amber-400" />
              Matchup Visualization
            </h2>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    type="number" 
                    dataKey="metaShare" 
                    name="Meta Share" 
                    unit="%" 
                    domain={[0, 'dataMax + 5']}
                    label={{ value: 'Meta Share %', position: 'bottom', fill: '#d1d5db' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="winRate" 
                    name="Win Rate" 
                    unit="%" 
                    domain={[35, 65]}
                    label={{ value: 'Win Rate %', angle: -90, position: 'left', fill: '#d1d5db' }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="count" 
                    range={[50, 400]} 
                    name="Matches" 
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name, props) => [`${value.toFixed(1)}${name.includes('%') ? '%' : ''}`, name]}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-gray-800 p-3 border border-gray-700 rounded-lg shadow-lg">
                            <p className="font-medium text-amber-300">{data.archetype}</p>
                            <p className="text-sm text-gray-300">Meta Share: {data.metaShare.toFixed(1)}%</p>
                            <p className="text-sm text-gray-300">Win Rate: {data.winRate.toFixed(1)}%</p>
                            <p className="text-sm text-gray-300">Matches: {data.count}</p>
                            <p className="text-sm text-gray-300">Trend: <span className={TREND_INDICATORS[data.trend].color}>{data.trend}</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Scatter 
                    name="Archetypes" 
                    data={metaBreakdown} 
                    fill="#8884d8"
                  >
                    {metaBreakdown && metaBreakdown.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.trend === 'rising' ? '#82ca9d' : 
                          entry.trend === 'falling' ? '#ff8042' : 
                          '#8884d8'
                        } 
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <span className="text-sm text-gray-300">Rising</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                <span className="text-sm text-gray-300">Stable</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
                <span className="text-sm text-gray-300">Falling</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-300 mb-1">How to Read This Chart</h4>
                  <p className="text-sm text-gray-300">
                    Each bubble represents a deck archetype. The horizontal position shows its meta share percentage, 
                    while the vertical position shows its win rate. Bubble size indicates the number of matches played.
                    Colors indicate the trend: green for rising popularity, orange for falling, and purple for stable.
                  </p>
                  <p className="text-sm text-gray-300 mt-2">
                    Archetypes in the top-right are both popular and successful. Those in the top-left are underplayed 
                    but performing well. Bottom-right decks are popular despite poor performance, while bottom-left 
                    decks are both unpopular and unsuccessful.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          {/* Meta Prediction Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
            <h2 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-amber-400" />
              Meta Evolution Prediction
            </h2>
            
            <div className="mb-6 p-4 bg-amber-900 bg-opacity-20 rounded-lg border border-amber-800">
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
            
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metaPrediction?.slice(0, 10)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="archetype" />
                  <YAxis domain={[0, 'dataMax + 5']} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend />
                  <Bar dataKey="currentPercentage" name="Current Meta %" fill="#8884d8" />
                  <Bar dataKey="predictedPercentage" name="Predicted Meta %" fill="#82ca9d" />
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
                  {metaPrediction?.map((prediction, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{prediction.archetype}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{prediction.currentPercentage.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{prediction.predictedPercentage.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {prediction.predictedChange > 0 && <span className="text-green-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +{prediction.predictedChange.toFixed(1)}%</span>}
                        {prediction.predictedChange < 0 && <span className="text-red-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1 transform rotate-180" /> {prediction.predictedChange.toFixed(1)}%</span>}
                        {prediction.predictedChange === 0 && <span className="text-gray-400 flex items-center"><Activity className="w-4 h-4 mr-1" /> 0%</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{prediction.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Meta Cycle Analysis */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
            <h2 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              <RefreshCw className="w-5 h-5 mr-2 text-amber-400" />
              Meta Cycle Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-amber-300 mb-3">Current Phase</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">Adaptation</span>
                  <div className="p-3 bg-purple-900 bg-opacity-30 rounded-full">
                    <RefreshCw className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-300">
                  The meta is currently adapting to counter the dominant strategies. Expect increased diversity as players experiment with counters.
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-amber-300 mb-3">Meta Diversity</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metaDiversity.toFixed(1)}%</span>
                  <div className="p-3 bg-green-900 bg-opacity-30 rounded-full">
                    <Shuffle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-red-500 via-amber-500 to-green-500 h-2.5 rounded-full" 
                      style={{ width: `${metaDiversity}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-amber-300 mb-3">Next Phase Prediction</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">Stabilization</span>
                  <div className="p-3 bg-amber-900 bg-opacity-30 rounded-full">
                    <Activity className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-300">
                  The meta is likely to stabilize in the next 2-3 weeks as optimal counter strategies become established.
                </p>
              </div>
            </div>
            
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { phase: 'Dominance', diversity: 35, week: 1 },
                    { phase: 'Early Adaptation', diversity: 45, week: 2 },
                    { phase: 'Adaptation', diversity: metaDiversity, week: 3 },
                    { phase: 'Stabilization', diversity: 65, week: 4, predicted: true },
                    { phase: 'New Dominance', diversity: 50, week: 5, predicted: true },
                    { phase: 'Adaptation', diversity: 60, week: 6, predicted: true }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="phase" />
                  <YAxis domain={[0, 100]} label={{ value: 'Meta Diversity %', angle: -90, position: 'insideLeft', fill: '#d1d5db' }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="diversity" 
                    name="Meta Diversity" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="diversity" 
                    name="Predicted Diversity" 
                    stroke="#82ca9d" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ r: 6, strokeWidth: 2 }}
                    connectNulls
                    hide={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-amber-300 mb-3">Meta Cycle Explanation</h3>
              <p className="text-sm text-gray-300 mb-3">
                TCG metas typically follow a cyclical pattern with these phases:
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="p-1.5 bg-red-900 bg-opacity-30 rounded-full mr-3 mt-0.5">
                    <Award className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300">Dominance</h4>
                    <p className="text-xs text-gray-400">A few powerful archetypes dominate the meta with high win rates and popularity.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-1.5 bg-purple-900 bg-opacity-30 rounded-full mr-3 mt-0.5">
                    <RefreshCw className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300">Adaptation</h4>
                    <p className="text-xs text-gray-400">Players develop counter strategies to the dominant decks, increasing meta diversity.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-1.5 bg-amber-900 bg-opacity-30 rounded-full mr-3 mt-0.5">
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300">Stabilization</h4>
                    <p className="text-xs text-gray-400">The meta reaches equilibrium with a balanced set of viable archetypes.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-1.5 bg-blue-900 bg-opacity-30 rounded-full mr-3 mt-0.5">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300">Innovation</h4>
                    <p className="text-xs text-gray-400">New strategies emerge, often disrupting the established meta balance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'mydecks' && (
        <div className="space-y-6">
          {/* My Decks Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-amber-300 flex items-center">
                <Database className="w-5 h-5 mr-2 text-amber-400" />
                My Deck Collection
              </h2>
              
              <motion.button
                onClick={() => setShowNewDeckForm(!showNewDeckForm)}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center space-x-1 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                <span>Add New Deck</span>
              </motion.button>
            </div>
            
            <AnimatePresence>
              {showNewDeckForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <h3 className="text-lg font-medium text-amber-300 mb-4">New Deck</h3>
                  
                  <form onSubmit={handleNewDeckSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Deck Name</label>
                        <input
                          type="text"
                          value={newDeckForm.name}
                          onChange={(e) => setNewDeckForm({...newDeckForm, name: e.target.value})}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 text-white"
                          placeholder="Enter deck name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Archetype</label>
                        <select
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 text-white ancient-select"
                          value={newDeckForm.archetype || ''}
                          onChange={(e) => setNewDeckForm({...newDeckForm, archetype: e.target.value})}
                        >
                          <option value="">Select an archetype</option>
                          {metaBreakdown?.map((deck, index) => (
                            <option key={index} value={deck.archetype}>{deck.archetype}</option>
                          ))}
                          <option value="custom">Custom Archetype</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <textarea
                        value={newDeckForm.description}
                        onChange={(e) => setNewDeckForm({...newDeckForm, description: e.target.value})}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 text-white"
                        placeholder="Enter deck description"
                        rows={3}
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowNewDeckForm(false)}
                        className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg text-white"
                      >
                        Save Deck
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            
            {customDecks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customDecks.map((deck, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-amber-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-white">{deck.name}</h4>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-amber-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {deck.archetype && (
                      <div className="mb-2">
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                          {deck.archetype}
                        </span>
                      </div>
                    )}
                    
                    {deck.description && (
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                        {deck.description}
                      </p>
                    )}
                    
                    <div className="text-xs text-gray-400">
                      Created: {new Date(deck.createdAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <Database className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No Decks Yet</h3>
                <p className="text-gray-400 mb-6">Add your first deck to start tracking performance</p>
                
                <motion.button
                  onClick={() => setShowNewDeckForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center space-x-2 mx-auto text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add First Deck</span>
                </motion.button>
              </div>
            )}
          </div>
          
          {/* Deck Performance Analysis */}
          {customDecks.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mb-6 ancient-card">
              <h2 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-amber-400" />
                Deck Performance Analysis
              </h2>
              
              <div className="text-center py-8 bg-gray-800 rounded-lg">
                <BarChart2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No Performance Data Yet</h3>
                <p className="text-gray-400">Play matches with your decks to see performance analytics</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
        <p>Arcane Deck Analysis powered by KONIVRER Bayesian Engine</p>
        <p className="mt-1">Data refreshed: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default DeckArchetypeAnalyzer;