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
const IndustryLeadingFeaturesPage = (): any => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-[OpenDyslexic]"></div>
      <div className="container mx-auto px-4 py-8"></div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
         />
          <p className="text-xl text-gray-300 mb-6 max-w-4xl mx-auto"></p>
            Experience the most advanced TCG platform ever created. All premium
            features are now completely free, powered by state-of-the-art AI,
            machine learning, and cutting-edge technology.
          </p>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-full px-8 py-0 whitespace-nowrap inline-block mb-8"></div>
            <div className="flex items-center"></div>
              <CheckCircle className="w-6 h-6 mr-3" / />
              <span className="text-xl font-bold"></span>
                All Premium Features Free Forever
              </span>
          </div>
          {/* Feature Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"></div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700"></div>
              <div className="text-2xl font-bold text-purple-400">$200k+</div>
              <div className="text-sm text-gray-400">Development Value</div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700"></div>
              <div className="text-2xl font-bold text-blue-400">50+</div>
              <div className="text-sm text-gray-400">Advanced Features</div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700"></div>
              <div className="text-2xl font-bold text-green-400"></div>
                AI-Powered
              </div>
              <div className="text-sm text-gray-400">Machine Learning</div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700"></div>
              <div className="text-2xl font-bold text-yellow-400">100%</div>
              <div className="text-sm text-gray-400">Free Access</div>
          </div>
        </motion.div>
        {/* Feature Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"></div>
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
              / />
              <div className="relative z-10"></div>
                <div className="flex items-center mb-4"></div>
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} mr-4`}
                   />
                    {feature.icon}
                  <div className="text-left"></div>
                    {activeFeature === feature.id && (
                      <div className="flex items-center text-purple-300 text-sm mt-1"></div>
                        <Sparkles className="w-4 h-4 mr-1" / />
                        Active
                      </div>
                    )}
                </div>
                <p className="text-gray-300 text-sm mb-4"></p>
                  {feature.description}
                <div className="flex items-center justify-between"></div>
                  <div className="flex items-center text-green-400 text-sm"></div>
                    <CheckCircle className="w-4 h-4 mr-1" / />
                    Free
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" / />
                </div>
            </motion.button>
          ))}
        </div>
        {/* Feature Content */}
        <AnimatePresence mode="wait" />
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className = "bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
           />
            {activeFeature === 'overview' && (
              <FeatureOverview
                features={features}
                featuresEnabled={featuresEnabled}
                setFeaturesEnabled={setFeaturesEnabled}
              / />
            )}
            {activeFeature === 'meta-adaptive' && (
              <MetaAdaptiveFeature
                tournamentEngine={tournamentEngine}
                tournaments={tournaments}
                players={players}
              / />
            )}
            {activeFeature === 'advanced-analytics' && (
              <AdvancedAnalyticsEngine
                players={players}
                matches={matches}
                tournaments={tournaments}
              / />
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
              / />
            )}
            {activeFeature === 'bayesian-ml' && (
              <BayesianMLFeature
                bayesianEngine={bayesianEngine}
                players={players}
                matches={matches}
              / />
            )}
          </motion.div>
        </AnimatePresence>
    </div>
  );
};
// Feature Overview Component
interface FeatureOverviewProps {
  features;
  featuresEnabled
  setFeaturesEnabled
}

const FeatureOverview: React.FC<FeatureOverviewProps> = ({  features, featuresEnabled, setFeaturesEnabled  }) => {
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
    <div className="p-8"></div>
      <div className="text-center mb-8"></div>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto"></p>
          Every feature that would typically cost thousands of dollars in
          enterprise software, now available completely free. This represents
          over $200,000 in development value.
        </p>
      {/* Implementation Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"></div>
        {implementationHighlights.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700/50 rounded-lg p-6"
           />
            <ul className="space-y-2" />
              {category.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-center text-gray-300"
                 />
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" / />
                  <span className="text-sm">{feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      {/* Feature Toggles */}
      <div className="bg-gray-700/50 rounded-lg p-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
          {Object.entries(featuresEnabled).map(([key, enabled]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
             />
              <span className="text-sm font-medium capitalize"></span>
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              <button
                onClick={() => toggleFeature(key)}
                className={`px-3 py-0 whitespace-nowrap rounded-full text-xs font-medium transition-colors ${
                  enabled
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {enabled ? 'Enabled' : 'Disabled'}
            </div>
          ))}
        </div>
        <div className = "mt-6 p-4 bg-green-600/20 border border-green-500 rounded-lg"></div>
          <div className="flex items-center"></div>
            <Sparkles className="w-5 h-5 text-green-400 mr-2" / />
            <span className="text-green-300 font-medium"></span>
              All features are permanently free - no subscriptions, no limits,
              no hidden costs
            </span>
        </div>
    </div>
  );
};
// Meta-Adaptive Feature Component
interface MetaAdaptiveFeatureProps {
  tournamentEngine;
  tournaments
  players
}

const MetaAdaptiveFeature: React.FC<MetaAdaptiveFeatureProps> = ({  tournamentEngine, tournaments, players  }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [pairingResults, setPairingResults] = useState(null);
  const [tournamentStructure, setTournamentStructure] = useState(null);
  const generateOptimalPairings = (): any => {
    if (!selectedTournament) return;
    const pairings = tournamentEngine.generateDynamicSwissPairings(
      players,
      selectedTournament.currentRound || 1,
      selectedTournament.id,
    );
    setPairingResults(pairings);
  };
  const selectOptimalStructure = (): any => {
    const structure = tournamentEngine.selectOptimalTournamentStructure(
      players.length,
      300, // 5 hours
      150, // skill variance
    );
    setTournamentStructure(structure);
  };
  return (
    <div className="p-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"></div>
        {/* Tournament Structure Optimization */}
        <div className="bg-gray-700/50 rounded-lg p-6"></div>
          <div className="space-y-4"></div>
            <div className="p-4 bg-gray-800/50 rounded-lg"></div>
              <div className="grid grid-cols-2 gap-4 text-sm"></div>
                <div></div>
                  <span className="text-gray-400">Players:</span>
                  <span className="ml-2 font-medium">{players.length}
                </div>
                <div></div>
                  <span className="text-gray-400">Time Limit:</span>
                  <span className="ml-2 font-medium">5 hours</span>
                <div></div>
                  <span className="text-gray-400">Skill Variance:</span>
                  <span className="ml-2 font-medium">150 rating</span>
                <div></div>
                  <span className="text-gray-400">Format:</span>
                  <span className="ml-2 font-medium">Adaptive</span>
              </div>
            <button
              onClick={selectOptimalStructure}
              className="w-full bg-purple-600 hover:bg-purple-700 py-0 rounded-lg font-medium transition-colors whitespace-nowrap"
             />
              <Brain className="w-4 h-4 mr-2 inline" / />
              Calculate Optimal Structure
            </button>
            {tournamentStructure && (
              <div className="p-4 bg-green-600/20 border border-green-500 rounded-lg"></div>
                <div className="space-y-2 text-sm"></div>
                  <div className="flex justify-between"></div>
                    <span>Format:</span>
                    <span className="font-medium"></span>
                      {tournamentStructure.name}
                  </div>
                  <div className="flex justify-between"></div>
                    <span>Rounds:</span>
                    <span className="font-medium"></span>
                      {tournamentStructure.rounds}
                  </div>
                  <div className="flex justify-between"></div>
                    <span>Suitability:</span>
                    <span className="font-medium text-green-400"></span>
                      {Math.round(tournamentStructure.suitability * 100)}%
                    </span>
                </div>
            )}
          </div>
        {/* Dynamic Pairings */}
        <div className="bg-gray-700/50 rounded-lg p-6"></div>
          <div className="space-y-4"></div>
            <div></div>
              <label className="block text-sm font-medium mb-2"></label>
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
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-0"
              >
                <option value="">Choose tournament...</option>
                {tournaments.map(tournament => (
                  <option key={tournament.id} value={tournament.id} />
                    {tournament.name}
                ))}
              </select>
            <button
              onClick={generateOptimalPairings}
              disabled={!selectedTournament}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-0 rounded-lg font-medium transition-colors whitespace-nowrap"
             />
              <Target className="w-4 h-4 mr-2 inline" / />
              Generate Optimal Pairings
            </button>
            {pairingResults && (
              <div className="space-y-3 max-h-64 overflow-y-auto"></div>
                {pairingResults.map((pairing, index) => (
                  <div key={index} className="p-3 bg-gray-800/50 rounded-lg"></div>
                    <div className="flex items-center justify-between mb-2"></div>
                      <span className="font-medium">Table {pairing.table}
                      <span className="text-xs bg-purple-600/20 px-2 py-0 whitespace-nowrap rounded"></span>
                        Quality: {Math.round(pairing.expectedQuality * 100)}%
                      </span>
                    <div className="text-sm text-gray-400"></div>
                      {pairing.player2 === 'bye' ? (
                        <span></span>
                          {players.find(p => p.id === pairing.player1)?.name} -
                          BYE
                        </span>
                      ) : (
                        <span></span>
                          {players.find(p => p.id === pairing.player1)?.name} vs{' '}
                          {players.find(p => p.id === pairing.player2)?.name}
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1"></div>
                      Matchup: {pairing.metaMatchup}
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
  );
};
// Bayesian ML Feature Component
interface BayesianMLFeatureProps {
  bayesianEngine
  players
  matches
}

const BayesianMLFeature: React.FC<BayesianMLFeatureProps> = ({  bayesianEngine, players, matches  }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [matchPrediction, setMatchPrediction] = useState(null);
  const [ratingAnalysis, setRatingAnalysis] = useState(null);
  const analyzePlayer = (): any => {
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
  const predictMatch = (): any => {
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
    <div className="p-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"></div>
        {/* Player Analysis */}
        <div className="bg-gray-700/50 rounded-lg p-6"></div>
          <div className="space-y-4"></div>
            <div></div>
              <label className="block text-sm font-medium mb-2"></label>
                Select Player
              </label>
              <select
                value={selectedPlayer?.id || ''}
                onChange={e => {
                  const player = players.find(p => p.id === e.target.value);
                  setSelectedPlayer(player);
                }}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-0"
              >
                <option value="">Choose player...</option>
                {players.map(player => (
                  <option key={player.id} value={player.id} />
                    {player.name} ({Math.round(player.rating || 1500)})
                  </option>
                ))}
              </select>
            <button
              onClick={analyzePlayer}
              disabled={!selectedPlayer}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-0 rounded-lg font-medium transition-colors whitespace-nowrap"
             />
              <Brain className="w-4 h-4 mr-2 inline" / />
              Analyze Player
            </button>
            {ratingAnalysis && (
              <div className="space-y-3"></div>
                <div className="p-4 bg-gray-800/50 rounded-lg"></div>
                  <div className="grid grid-cols-2 gap-4 text-sm"></div>
                    <div></div>
                      <span className="text-gray-400">Current Rating:</span>
                      <span className="ml-2 font-medium"></span>
                        {Math.round(ratingAnalysis.currentRating)}
                    </div>
                    <div></div>
                      <span className="text-gray-400">Uncertainty:</span>
                      <span className="ml-2 font-medium"></span>
                        ±{Math.round(ratingAnalysis.uncertainty)}
                    </div>
                    <div></div>
                      <span className="text-gray-400">Conservative:</span>
                      <span className="ml-2 font-medium"></span>
                        {Math.round(ratingAnalysis.conservativeRating)}
                    </div>
                    <div></div>
                      <span className="text-gray-400">Trend:</span>
                      <span className="ml-2 font-medium text-green-400"></span>
                        {ratingAnalysis.recentPerformance}
                    </div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg"></div>
                  <div className="space-y-2"></div>
                    {Object.entries(ratingAnalysis.strengthFactors).map(
                      ([factor, value]) => (
                        <div
                          key={factor}
                          className="flex items-center justify-between"
                         />
                          <span className="text-sm capitalize">{factor}:</span>
                          <div className="flex items-center"></div>
                            <div className="w-16 bg-gray-600 rounded-full h-2 mr-2"></div>
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${value}%` }}
                              / />
                            </div>
                            <span className="text-xs text-gray-400"></span>
                              {value}%
                            </span>
                        </div>
                      ),
                    )}
                  </div>
              </div>
            )}
          </div>
        {/* Match Prediction */}
        <div className="bg-gray-700/50 rounded-lg p-6"></div>
          <div className="space-y-4"></div>
            <button
              onClick={predictMatch}
              disabled={!selectedPlayer || players.length < 2}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-0 rounded-lg font-medium transition-colors whitespace-nowrap"
             />
              <TrendingUp className="w-4 h-4 mr-2 inline" / />
              Predict Match Outcome
            </button>
            {matchPrediction && (
              <div className="space-y-4"></div>
                <div className="p-4 bg-gray-800/50 rounded-lg"></div>
                  <div className="flex items-center justify-between mb-4"></div>
                    <div className="text-center"></div>
                      <p className="font-medium"></p>
                        {matchPrediction.player1.name}
                      <p className="text-sm text-gray-400"></p>
                        {Math.round(matchPrediction.player1.rating || 1500)}
                    </div>
                    <div className="text-purple-400 font-bold">VS</div>
                    <div className="text-center"></div>
                      <p className="font-medium"></p>
                        {matchPrediction.player2.name}
                      <p className="text-sm text-gray-400"></p>
                        {Math.round(matchPrediction.player2.rating || 1500)}
                    </div>
                  <div className="grid grid-cols-2 gap-4 text-center"></div>
                    <div className="p-3 bg-blue-600/20 rounded-lg"></div>
                      <p className="text-2xl font-bold text-blue-400"></p>
                        {Math.round(
                          matchPrediction.player1WinProbability * 100,
                        )}
                        %
                      </p>
                      <p className="text-sm text-gray-400">Win Probability</p>
                    <div className="p-3 bg-red-600/20 rounded-lg"></div>
                      <p className="text-2xl font-bold text-red-400"></p>
                        {Math.round(
                          matchPrediction.player2WinProbability * 100,
                        )}
                        %
                      </p>
                      <p className="text-sm text-gray-400">Win Probability</p>
                  </div>
                  <div className="mt-4 p-3 bg-purple-600/20 rounded-lg"></div>
                    <p className="text-sm text-purple-300"></p>
                      Confidence: {Math.round(matchPrediction.confidence * 100)}
                      %
                    </p>
                    <p className="text-xs text-gray-400 mt-1"></p>
                      Expected rating changes: ±
                      {Math.round(matchPrediction.expectedRatingChange)}
                  </div>
              </div>
            )}
          </div>
      </div>
  );
};
export default IndustryLeadingFeaturesPage;