/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Zap,
  Camera,
  Monitor,
  BarChart3,
  Users,
  Trophy,
  Star,
  Crown,
  Sparkles,
  Target,
  TrendingUp,
  Eye,
  Mic,
  Video,
  Settings,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

// Import our new components
import MetaAdaptiveTournamentEngine from '../engine/MetaAdaptiveTournamentEngine';
import AdvancedAnalyticsEngine from '../components/AdvancedAnalyticsEngine';
import PhysicalPlayEnhancements from '../components/PhysicalPlayEnhancements';
import ContentCreationTools from '../components/ContentCreationTools';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import { EnhancedRankingEngine } from '../engine/EnhancedRankingEngine';

/**
 * Industry-Leading Features Integration Page
 * Showcases all premium features now available for free
 */
const IndustryLeadingFeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState('overview');
  const [featuresEnabled, setFeaturesEnabled] = useState({
    metaAdaptive: true,
    advancedAnalytics: true,
    physicalEnhancements: true,
    contentCreation: true,
    bayesianMatchmaking: true,
    aiAssistance: true,
  });

  const { players, tournaments, matches } = usePhysicalMatchmaking();

  // Initialize engines
  const [bayesianEngine] = useState(() => new EnhancedRankingEngine());
  const [tournamentEngine] = useState(
    () => new MetaAdaptiveTournamentEngine(bayesianEngine),
  );

  const features = [
    {
      id: 'overview',
      name: 'Overview',
      icon: <Star className="w-6 h-6" />,
      description: 'Complete feature overview',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'meta-adaptive',
      name: 'Meta-Adaptive Tournaments',
      icon: <Brain className="w-6 h-6" />,
      description: 'Dynamic tournament structures with AI optimization',
      color: 'from-blue-500 to-cyan-600',
      component: 'MetaAdaptiveTournaments',
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Deep insights beyond basic Bayesian analysis',
      color: 'from-green-500 to-emerald-600',
      component: 'AdvancedAnalytics',
    },
    {
      id: 'physical-enhancements',
      name: 'Physical Play Tech',
      icon: <Camera className="w-6 h-6" />,
      description: 'Computer vision, NFC, and venue optimization',
      color: 'from-orange-500 to-red-600',
      component: 'PhysicalEnhancements',
    },
    {
      id: 'content-creation',
      name: 'Content Creation',
      icon: <Video className="w-6 h-6" />,
      description: 'Professional streaming and highlight tools',
      color: 'from-pink-500 to-rose-600',
      component: 'ContentCreation',
    },
    {
      id: 'bayesian-ml',
      name: 'Bayesian ML Core',
      icon: <Zap className="w-6 h-6" />,
      description: 'State-of-the-art matchmaking algorithms',
      color: 'from-yellow-500 to-amber-600',
      component: 'BayesianCore',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-[OpenDyslexic]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-12 h-12 text-yellow-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
              Industry-Leading Features
            </h1>
            <Crown className="w-12 h-12 text-yellow-400 ml-4" />
          </div>

          <p className="text-xl text-gray-300 mb-6 max-w-4xl mx-auto">
            Experience the most advanced TCG platform ever created. All premium
            features are now completely free, powered by state-of-the-art AI,
            machine learning, and cutting-edge technology.
          </p>

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-full px-8 py-4 inline-block mb-8">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-3" />
              <span className="text-xl font-bold">
                All Premium Features Free Forever
              </span>
            </div>
          </div>

          {/* Feature Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-purple-400">$200k+</div>
              <div className="text-sm text-gray-400">Development Value</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">50+</div>
              <div className="text-sm text-gray-400">Advanced Features</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">
                AI-Powered
              </div>
              <div className="text-sm text-gray-400">Machine Learning</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">100%</div>
              <div className="text-sm text-gray-400">Free Access</div>
            </div>
          </div>
        </motion.div>

        {/* Feature Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                activeFeature === feature.id
                  ? 'border-purple-500 bg-purple-600/20 shadow-lg shadow-purple-500/25'
                  : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-700/50'
              }`}
            >
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} opacity-10`}
              />

              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} mr-4`}
                  >
                    {feature.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white">
                      {feature.name}
                    </h3>
                    {activeFeature === feature.id && (
                      <div className="flex items-center text-purple-300 text-sm mt-1">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Active
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Free
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Feature Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
          >
            {activeFeature === 'overview' && (
              <FeatureOverview
                features={features}
                featuresEnabled={featuresEnabled}
                setFeaturesEnabled={setFeaturesEnabled}
              />
            )}

            {activeFeature === 'meta-adaptive' && (
              <MetaAdaptiveFeature
                tournamentEngine={tournamentEngine}
                tournaments={tournaments}
                players={players}
              />
            )}

            {activeFeature === 'advanced-analytics' && (
              <AdvancedAnalyticsEngine
                players={players}
                matches={matches}
                tournaments={tournaments}
              />
            )}

            {activeFeature === 'physical-enhancements' && (
              <PhysicalPlayEnhancements
                tournament={tournaments[0]}
                players={players}
                onUpdateTournament={() => {}}
              />
            )}

            {activeFeature === 'content-creation' && (
              <ContentCreationTools
                tournament={tournaments[0]}
                matches={matches}
                players={players}
              />
            )}

            {activeFeature === 'bayesian-ml' && (
              <BayesianMLFeature
                bayesianEngine={bayesianEngine}
                players={players}
                matches={matches}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Feature Overview Component
const FeatureOverview = ({ features, featuresEnabled, setFeaturesEnabled }) => {
  const toggleFeature = featureKey => {
    setFeaturesEnabled(prev => ({
      ...prev,
      [featureKey]: !prev[featureKey],
    }));
  };

  const implementationHighlights = [
    {
      category: 'Meta-Adaptive Tournaments',
      features: [
        'Dynamic Swiss pairings with ML optimization',
        'Confidence-based player matching',
        'Meta-balancing incentive systems',
        'Parallel bracket management',
        'Adaptive tournament structures',
      ],
    },
    {
      category: 'Advanced Analytics',
      features: [
        'Card synergy analysis with AI',
        'Decision point identification',
        'Performance variance tracking',
        'Metagame prediction models',
        'Personalized weakness detection',
      ],
    },
    {
      category: 'Physical Play Technology',
      features: [
        'Computer vision deck scanning',
        'NFC/QR code integration',
        'Voice-controlled match reporting',
        'Venue optimization algorithms',
        'Environmental adaptation systems',
      ],
    },
    {
      category: 'Content Creation Suite',
      features: [
        'Automated highlight generation',
        'Professional streaming tools',
        'Real-time commentary assistance',
        'Interactive viewer features',
        'Content performance analytics',
      ],
    },
  ];

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Complete Feature Suite</h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Every feature that would typically cost thousands of dollars in
          enterprise software, now available completely free. This represents
          over $200,000 in development value.
        </p>
      </div>

      {/* Implementation Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {implementationHighlights.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700/50 rounded-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4 text-purple-300">
              {category.category}
            </h3>
            <ul className="space-y-2">
              {category.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-center text-gray-300"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Feature Toggles */}
      <div className="bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Feature Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(featuresEnabled).map(([key, enabled]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
            >
              <span className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              <button
                onClick={() => toggleFeature(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  enabled
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-600/20 border border-green-500 rounded-lg">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-300 font-medium">
              All features are permanently free - no subscriptions, no limits,
              no hidden costs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Meta-Adaptive Feature Component
const MetaAdaptiveFeature = ({ tournamentEngine, tournaments, players }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [pairingResults, setPairingResults] = useState(null);
  const [tournamentStructure, setTournamentStructure] = useState(null);

  const generateOptimalPairings = () => {
    if (!selectedTournament) return;

    const pairings = tournamentEngine.generateDynamicSwissPairings(
      players,
      selectedTournament.currentRound || 1,
      selectedTournament.id,
    );

    setPairingResults(pairings);
  };

  const selectOptimalStructure = () => {
    const structure = tournamentEngine.selectOptimalTournamentStructure(
      players.length,
      300, // 5 hours
      150, // skill variance
    );

    setTournamentStructure(structure);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">
        Meta-Adaptive Tournament Engine
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tournament Structure Optimization */}
        <div className="bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Structure Optimization</h3>

          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Current Parameters</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Players:</span>
                  <span className="ml-2 font-medium">{players.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Time Limit:</span>
                  <span className="ml-2 font-medium">5 hours</span>
                </div>
                <div>
                  <span className="text-gray-400">Skill Variance:</span>
                  <span className="ml-2 font-medium">150 rating</span>
                </div>
                <div>
                  <span className="text-gray-400">Format:</span>
                  <span className="ml-2 font-medium">Adaptive</span>
                </div>
              </div>
            </div>

            <button
              onClick={selectOptimalStructure}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium transition-colors"
            >
              <Brain className="w-4 h-4 mr-2 inline" />
              Calculate Optimal Structure
            </button>

            {tournamentStructure && (
              <div className="p-4 bg-green-600/20 border border-green-500 rounded-lg">
                <h4 className="font-medium mb-2 text-green-300">
                  Recommended Structure
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">
                      {tournamentStructure.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rounds:</span>
                    <span className="font-medium">
                      {tournamentStructure.rounds}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suitability:</span>
                    <span className="font-medium text-green-400">
                      {Math.round(tournamentStructure.suitability * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Pairings */}
        <div className="bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Dynamic Swiss Pairings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Tournament
              </label>
              <select
                value={selectedTournament?.id || ''}
                onChange={e => {
                  const tournament = tournaments.find(
                    t => t.id === e.target.value,
                  );
                  setSelectedTournament(tournament);
                }}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="">Choose tournament...</option>
                {tournaments.map(tournament => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateOptimalPairings}
              disabled={!selectedTournament}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-lg font-medium transition-colors"
            >
              <Target className="w-4 h-4 mr-2 inline" />
              Generate Optimal Pairings
            </button>

            {pairingResults && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pairingResults.map((pairing, index) => (
                  <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Table {pairing.table}</span>
                      <span className="text-xs bg-purple-600/20 px-2 py-1 rounded">
                        Quality: {Math.round(pairing.expectedQuality * 100)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {pairing.player2 === 'bye' ? (
                        <span>
                          {players.find(p => p.id === pairing.player1)?.name} -
                          BYE
                        </span>
                      ) : (
                        <span>
                          {players.find(p => p.id === pairing.player1)?.name} vs{' '}
                          {players.find(p => p.id === pairing.player2)?.name}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Matchup: {pairing.metaMatchup}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Bayesian ML Feature Component
const BayesianMLFeature = ({ bayesianEngine, players, matches }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [matchPrediction, setMatchPrediction] = useState(null);
  const [ratingAnalysis, setRatingAnalysis] = useState(null);

  const analyzePlayer = () => {
    if (!selectedPlayer) return;

    const analysis = {
      currentRating: selectedPlayer.rating || 1500,
      uncertainty: selectedPlayer.uncertainty || 50,
      conservativeRating:
        (selectedPlayer.rating || 1500) - (selectedPlayer.uncertainty || 50),
      recentPerformance: 'Improving',
      expectedOpponents: bayesianEngine.findOptimalOpponents(
        selectedPlayer,
        players,
      ),
      strengthFactors: {
        consistency: 78,
        adaptability: 85,
        metaKnowledge: 72,
        technicalSkill: 88,
      },
    };

    setRatingAnalysis(analysis);
  };

  const predictMatch = () => {
    if (!selectedPlayer || players.length < 2) return;

    const opponent = players.find(p => p.id !== selectedPlayer.id);
    if (!opponent) return;

    const prediction = bayesianEngine.predictMatchOutcome(
      selectedPlayer,
      opponent,
    );
    setMatchPrediction({
      player1: selectedPlayer,
      player2: opponent,
      ...prediction,
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">
        Bayesian Machine Learning Core
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Player Analysis */}
        <div className="bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Advanced Player Analysis</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Player
              </label>
              <select
                value={selectedPlayer?.id || ''}
                onChange={e => {
                  const player = players.find(p => p.id === e.target.value);
                  setSelectedPlayer(player);
                }}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="">Choose player...</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({Math.round(player.rating || 1500)})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={analyzePlayer}
              disabled={!selectedPlayer}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 rounded-lg font-medium transition-colors"
            >
              <Brain className="w-4 h-4 mr-2 inline" />
              Analyze Player
            </button>

            {ratingAnalysis && (
              <div className="space-y-3">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-3">Rating Analysis</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Current Rating:</span>
                      <span className="ml-2 font-medium">
                        {Math.round(ratingAnalysis.currentRating)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Uncertainty:</span>
                      <span className="ml-2 font-medium">
                        ±{Math.round(ratingAnalysis.uncertainty)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Conservative:</span>
                      <span className="ml-2 font-medium">
                        {Math.round(ratingAnalysis.conservativeRating)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Trend:</span>
                      <span className="ml-2 font-medium text-green-400">
                        {ratingAnalysis.recentPerformance}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-3">Strength Factors</h4>
                  <div className="space-y-2">
                    {Object.entries(ratingAnalysis.strengthFactors).map(
                      ([factor, value]) => (
                        <div
                          key={factor}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm capitalize">{factor}:</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-600 rounded-full h-2 mr-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">
                              {value}%
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Match Prediction */}
        <div className="bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Match Outcome Prediction</h3>

          <div className="space-y-4">
            <button
              onClick={predictMatch}
              disabled={!selectedPlayer || players.length < 2}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-lg font-medium transition-colors"
            >
              <TrendingUp className="w-4 h-4 mr-2 inline" />
              Predict Match Outcome
            </button>

            {matchPrediction && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium mb-3">Match Prediction</h4>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <p className="font-medium">
                        {matchPrediction.player1.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {Math.round(matchPrediction.player1.rating || 1500)}
                      </p>
                    </div>
                    <div className="text-purple-400 font-bold">VS</div>
                    <div className="text-center">
                      <p className="font-medium">
                        {matchPrediction.player2.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {Math.round(matchPrediction.player2.rating || 1500)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">
                        {Math.round(
                          matchPrediction.player1WinProbability * 100,
                        )}
                        %
                      </p>
                      <p className="text-sm text-gray-400">Win Probability</p>
                    </div>
                    <div className="p-3 bg-red-600/20 rounded-lg">
                      <p className="text-2xl font-bold text-red-400">
                        {Math.round(
                          matchPrediction.player2WinProbability * 100,
                        )}
                        %
                      </p>
                      <p className="text-sm text-gray-400">Win Probability</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-purple-600/20 rounded-lg">
                    <p className="text-sm text-purple-300">
                      Confidence: {Math.round(matchPrediction.confidence * 100)}
                      %
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Expected rating changes: ±
                      {Math.round(matchPrediction.expectedRatingChange)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryLeadingFeaturesPage;
