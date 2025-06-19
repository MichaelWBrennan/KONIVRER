import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Upload,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Crown,
  Shield,
  Sword,
  Clock,
  DollarSign,
  FileText,
  Download,
  Info,
} from 'lucide-react';

const PowerLevelCalculator = () => {
  const [deckList, setDeckList] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock power level calculation
  const calculatePowerLevel = async () => {
    setIsAnalyzing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockAnalysis = {
      overallPowerLevel: 7.2,
      confidence: 85,
      bracket: 'High Power',
      categories: {
        fastMana: {
          score: 8.5,
          weight: 20,
          description: 'Mana acceleration and ramp',
        },
        interaction: {
          score: 6.8,
          weight: 15,
          description: 'Removal and counterspells',
        },
        cardAdvantage: {
          score: 7.5,
          weight: 15,
          description: 'Card draw and tutors',
        },
        winConditions: {
          score: 7.0,
          weight: 20,
          description: 'Ways to win the game',
        },
        consistency: {
          score: 6.5,
          weight: 10,
          description: 'Deck reliability',
        },
        resilience: {
          score: 6.2,
          weight: 10,
          description: 'Recovery from setbacks',
        },
        speed: {
          score: 8.0,
          weight: 10,
          description: 'How fast the deck operates',
        },
      },
      powerCards: [
        { name: 'Mana Crypt', impact: 9.5, category: 'Fast Mana' },
        { name: 'Sol Ring', impact: 8.0, category: 'Fast Mana' },
        { name: 'Rhystic Study', impact: 8.5, category: 'Card Advantage' },
        { name: 'Cyclonic Rift', impact: 8.8, category: 'Interaction' },
        { name: 'Demonic Tutor', impact: 8.2, category: 'Card Advantage' },
      ],
      recommendations: [
        {
          type: 'upgrade',
          priority: 'high',
          title: 'Add More Fast Mana',
          description:
            'Your deck could benefit from additional mana acceleration',
          suggestions: ['Mana Vault', 'Chrome Mox', 'Mox Diamond'],
        },
        {
          type: 'balance',
          priority: 'medium',
          title: 'Improve Interaction Suite',
          description: 'Consider adding more removal and counterspells',
          suggestions: [
            'Force of Will',
            'Swords to Plowshares',
            'Counterspell',
          ],
        },
        {
          type: 'consistency',
          priority: 'low',
          title: 'Add More Tutors',
          description: 'Increase deck consistency with additional tutors',
          suggestions: [
            'Vampiric Tutor',
            'Mystical Tutor',
            'Enlightened Tutor',
          ],
        },
      ],
      comparison: {
        casual: { min: 1, max: 4, description: 'Precon level, very casual' },
        focused: {
          min: 4,
          max: 6,
          description: 'Upgraded precons, focused strategy',
        },
        optimized: {
          min: 6,
          max: 8,
          description: 'Highly tuned, competitive cards',
        },
        competitive: {
          min: 8,
          max: 10,
          description: 'cEDH level, maximum optimization',
        },
      },
      avgTurnWin: 8.5,
      totalPrice: 1250.75,
      saltScore: 3.2,
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getPowerLevelColor = level => {
    if (level >= 8) return 'text-red-400 bg-red-900/20 border-red-500';
    if (level >= 6) return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
    if (level >= 4) return 'text-blue-400 bg-blue-900/20 border-blue-500';
    return 'text-green-400 bg-green-900/20 border-green-500';
  };

  const getPowerLevelLabel = level => {
    if (level >= 8) return 'Competitive';
    if (level >= 6) return 'Optimized';
    if (level >= 4) return 'Focused';
    return 'Casual';
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-900/20 border-red-500';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
      case 'low':
        return 'text-blue-400 bg-blue-900/20 border-blue-500';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Calculator className="text-purple-400" />
            Power Level Calculator
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Analyze your deck's power level with our comprehensive algorithm
            based on competitive data
          </p>
        </motion.div>

        {!analysis ? (
          /* Upload Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Power Level Guide */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-600">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Info className="text-blue-400" />
                Power Level Guide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-900/20 border border-green-500 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    1-4
                  </div>
                  <div className="text-green-400 font-medium mb-2">Casual</div>
                  <div className="text-sm text-gray-300">
                    Precon level, very casual play
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    4-6
                  </div>
                  <div className="text-blue-400 font-medium mb-2">Focused</div>
                  <div className="text-sm text-gray-300">
                    Upgraded precons, clear strategy
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">
                    6-8
                  </div>
                  <div className="text-yellow-400 font-medium mb-2">
                    Optimized
                  </div>
                  <div className="text-sm text-gray-300">
                    Highly tuned, competitive cards
                  </div>
                </div>
                <div className="text-center p-4 bg-red-900/20 border border-red-500 rounded-lg">
                  <div className="text-2xl font-bold text-red-400 mb-2">
                    8-10
                  </div>
                  <div className="text-red-400 font-medium mb-2">
                    Competitive
                  </div>
                  <div className="text-sm text-gray-300">
                    cEDH level, maximum optimization
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-600">
              <div className="text-center mb-6">
                <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Calculate Power Level
                </h2>
                <p className="text-gray-300">
                  Paste your deck list below to get a comprehensive power level
                  analysis
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Deck List (one card per line)
                  </label>
                  <textarea
                    value={deckList}
                    onChange={e => setDeckList(e.target.value)}
                    placeholder="1 Atraxa, Praetors' Voice
1 Sol Ring
1 Command Tower
1 Mana Crypt
1 Rhystic Study
..."
                    className="w-full h-64 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={calculatePowerLevel}
                    disabled={!deckList.trim() || isAnalyzing}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5" />
                        Calculate Power Level
                      </>
                    )}
                  </button>

                  <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Import from URL
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Analysis Results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`backdrop-blur-sm rounded-xl p-8 border-2 ${getPowerLevelColor(analysis.overallPowerLevel)}`}
            >
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">
                  {analysis.overallPowerLevel}
                </div>
                <div className="text-2xl font-bold mb-2">
                  {getPowerLevelLabel(analysis.overallPowerLevel)}
                </div>
                <div className="text-lg opacity-90 mb-4">
                  {analysis.bracket}
                </div>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{analysis.confidence}% Confidence</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Turn {analysis.avgTurnWin} Average Win</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${analysis.totalPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="text-blue-400" />
                Category Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(analysis.categories).map(([category, data]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-gray-400 text-sm ml-2">
                          ({data.weight}% weight)
                        </span>
                      </div>
                      <span className="text-white font-bold">
                        {data.score}/10
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.score * 10}%` }}
                        transition={{ delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      />
                    </div>
                    <p className="text-gray-400 text-sm">{data.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Power Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" />
                High Impact Cards
              </h3>
              <div className="space-y-3">
                {analysis.powerCards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-bold text-white">{card.name}</h4>
                      <div className="text-sm text-gray-400">
                        {card.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">
                        {card.impact}/10
                      </div>
                      <div className="text-sm text-gray-400">Impact</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-green-400" />
                Improvement Recommendations
              </h3>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 ${getPriorityColor(rec.priority)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold">{rec.title}</h4>
                          <span className="px-2 py-1 bg-slate-700/50 rounded text-xs uppercase">
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm opacity-90 mb-3">
                          {rec.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {rec.suggestions.map((suggestion, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-slate-700/50 rounded text-xs"
                            >
                              {suggestion}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Power Level Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="text-purple-400" />
                Power Level Comparison
              </h3>
              <div className="relative">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-green-400">1 - Casual</span>
                  <span className="text-blue-400">4 - Focused</span>
                  <span className="text-yellow-400">6 - Optimized</span>
                  <span className="text-red-400">8 - Competitive</span>
                  <span className="text-red-400">10</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 via-yellow-500 to-red-500 rounded-full" />
                  <motion.div
                    initial={{ left: 0 }}
                    animate={{
                      left: `${(analysis.overallPowerLevel / 10) * 100}%`,
                    }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="absolute top-0 w-1 h-full bg-white shadow-lg"
                    style={{ transform: 'translateX(-50%)' }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-white font-bold">
                    Your Deck: {analysis.overallPowerLevel}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Analysis
              </button>
              <button
                onClick={() => setAnalysis(null)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculate Another Deck
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PowerLevelCalculator;
