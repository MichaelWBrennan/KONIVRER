import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Award,
  Target,
  Clock,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  Hexagon,
  Shield,
  Crosshair,
  BarChart,
  PieChart
} from 'lucide-react';

import {
  calculateSkillDecomposition,
  identifyCriticalDecisionPoints,
  calculatePerformanceVariance,
  predictMetaCycles,
  detectPersonalWeaknesses
} from './PerformanceAnalytics';

/**
 * Advanced Analytics Dashboard Component
 */
const AnalyticsDashboard = ({ playerData, matchHistory, metaData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [skillDecomposition, setSkillDecomposition] = useState(null);
  const [performanceVariance, setPerformanceVariance] = useState(null);
  const [weaknessAnalysis, setWeaknessAnalysis] = useState(null);
  const [metaPrediction, setMetaPrediction] = useState(null);
  const [criticalPoints, setCriticalPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  
  // Calculate analytics on component mount
  useEffect(() => {
    const calculateAnalytics = async () => {
      setLoading(true);
      
      // Calculate skill decomposition
      const skillData = calculateSkillDecomposition(matchHistory);
      setSkillDecomposition(skillData);
      
      // Calculate performance variance
      const varianceData = calculatePerformanceVariance(matchHistory);
      setPerformanceVariance(varianceData);
      
      // Detect personal weaknesses
      const weaknessData = detectPersonalWeaknesses(matchHistory);
      setWeaknessAnalysis(weaknessData);
      
      // Predict meta cycles
      const metaPredictionData = predictMetaCycles(metaData);
      setMetaPrediction(metaPredictionData);
      
      // Identify critical decision points from recent games
      const recentGames = matchHistory.slice(0, 10).filter(match => match.gameData);
      const allCriticalPoints = [];
      
      recentGames.forEach(match => {
        if (match.gameData) {
          const points = identifyCriticalDecisionPoints(match.gameData);
          if (points.length > 0) {
            allCriticalPoints.push({
              matchId: match.id,
              opponent: match.opponentName,
              date: match.timestamp,
              result: match.result,
              points
            });
          }
        }
      });
      
      setCriticalPoints(allCriticalPoints);
      setLoading(false);
    };
    
    calculateAnalytics();
  }, [matchHistory, metaData]);
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  // Render skill radar chart
  const renderSkillRadar = () => {
    if (!skillDecomposition) return null;
    
    const skills = [
      { name: 'Technical Play', value: skillDecomposition.technicalPlay },
      { name: 'Deck Building', value: skillDecomposition.deckBuilding },
      { name: 'Adaptability', value: skillDecomposition.adaptability },
      { name: 'Mental Game', value: skillDecomposition.mentalGame },
      { name: 'Consistency', value: skillDecomposition.consistency }
    ];
    
    const size = 250;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    
    // Calculate points on the radar
    const points = skills.map((skill, i) => {
      const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
      const x = centerX + radius * skill.value * Math.cos(angle);
      const y = centerY + radius * skill.value * Math.sin(angle);
      return { x, y, skill };
    });
    
    // Create polygon points string
    const polygonPoints = points.map(point => `${point.x},${point.y}`).join(' ');
    
    return (
      <div className="flex justify-center my-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circles */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((level, i) => (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={radius * level}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Axis lines */}
          {skills.map((skill, i) => {
            const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Skill polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Skill points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
            />
          ))}
          
          {/* Skill labels */}
          {points.map((point, i) => {
            const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
            const labelRadius = radius * 1.15;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            
            // Adjust text anchor based on position
            let textAnchor = 'middle';
            if (angle > -Math.PI * 0.25 && angle < Math.PI * 0.25) textAnchor = 'start';
            if (angle > Math.PI * 0.75 || angle < -Math.PI * 0.75) textAnchor = 'end';
            
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="500"
                fill="#4b5563"
              >
                {point.skill.name}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };
  
  // Render performance trend chart
  const renderPerformanceTrend = () => {
    if (!matchHistory || matchHistory.length < 5) return null;
    
    const recentMatches = matchHistory.slice(0, 20).reverse();
    const width = 600;
    const height = 200;
    const padding = 30;
    
    // Calculate win rate for each point (rolling average)
    const windowSize = 5;
    const winRates = [];
    
    for (let i = windowSize - 1; i < recentMatches.length; i++) {
      const window = recentMatches.slice(i - windowSize + 1, i + 1);
      const wins = window.filter(match => match.result === 'win').length;
      winRates.push(wins / windowSize);
    }
    
    // Calculate points
    const points = winRates.map((winRate, i) => {
      const x = padding + (i / (winRates.length - 1)) * (width - padding * 2);
      const y = height - padding - winRate * (height - padding * 2);
      return { x, y };
    });
    
    // Create path string
    const pathData = points.map((point, i) => 
      (i === 0 ? 'M' : 'L') + `${point.x},${point.y}`
    ).join(' ');
    
    return (
      <div className="flex justify-center my-4 overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* X and Y axes */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
          
          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((level, i) => (
            <line
              key={i}
              x1={padding}
              y1={height - padding - level * (height - padding * 2)}
              x2={width - padding}
              y2={height - padding - level * (height - padding * 2)}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4"
            />
          ))}
          
          {/* Win rate line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#3b82f6"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((level, i) => (
            <text
              key={i}
              x={padding - 5}
              y={height - padding - level * (height - padding * 2)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {formatPercentage(level)}
            </text>
          ))}
          
          {/* X-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((pos, i) => {
            const matchIndex = Math.floor(pos * (recentMatches.length - 1));
            const match = recentMatches[matchIndex];
            if (!match) return null;
            
            const date = new Date(match.timestamp);
            const label = `${date.getMonth() + 1}/${date.getDate()}`;
            
            return (
              <text
                key={i}
                x={padding + pos * (width - padding * 2)}
                y={height - padding + 15}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };
  
  return (
    <div className="analytics-dashboard">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart2 className="w-4 h-4 inline-block mr-2" />
            Overview
          </button>
          
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'skills'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('skills')}
          >
            <Target className="w-4 h-4 inline-block mr-2" />
            Skill Analysis
          </button>
          
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'matchups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('matchups')}
          >
            <Shield className="w-4 h-4 inline-block mr-2" />
            Matchup Analysis
          </button>
          
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'meta'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('meta')}
          >
            <PieChart className="w-4 h-4 inline-block mr-2" />
            Meta Analysis
          </button>
          
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'decisions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('decisions')}
          >
            <Crosshair className="w-4 h-4 inline-block mr-2" />
            Decision Points
          </button>
        </nav>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Summary */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Performance Summary</h3>
                  <div className="text-sm text-gray-500">
                    Last {matchHistory.length} matches
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Win Rate */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium text-blue-800">Win Rate</div>
                        <Award className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {formatPercentage(playerData.winRate || 0)}
                      </div>
                      <div className="mt-2 text-sm text-blue-700">
                        {playerData.wins || 0} wins, {playerData.losses || 0} losses
                      </div>
                    </div>
                    
                    {/* Performance Stability */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium text-green-800">Performance Stability</div>
                        <BarChart className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {performanceVariance?.performanceStability || 'Unknown'}
                      </div>
                      <div className="mt-2 text-sm text-green-700">
                        Consistency: {formatPercentage(performanceVariance?.consistencyScore || 0)}
                      </div>
                    </div>
                    
                    {/* Recommended Focus */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium text-purple-800">Recommended Focus</div>
                        <Target className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="text-lg font-bold text-purple-900">
                        {weaknessAnalysis?.recommendedFocus || 'Keep practicing'}
                      </div>
                      <div className="mt-2 text-sm text-purple-700">
                        Based on your recent performance
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Trend */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-base font-medium text-gray-900">Performance Trend</h4>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-gray-500">Last 20 matches</span>
                      </div>
                    </div>
                    
                    {renderPerformanceTrend()}
                  </div>
                </div>
              </div>
              
              {/* Skill Breakdown */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('skillBreakdown')}
                >
                  <h3 className="text-lg font-medium text-gray-900">Skill Breakdown</h3>
                  {expandedSections.skillBreakdown ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                
                {expandedSections.skillBreakdown && (
                  <div className="p-6">
                    {renderSkillRadar()}
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                      {skillDecomposition && Object.entries(skillDecomposition).map(([skill, value]) => (
                        <div key={skill} className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            {skill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-600"
                              style={{ width: `${value * 100}%` }}
                            ></div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 text-right">
                            {formatPercentage(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Weakness Analysis */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('weaknessAnalysis')}
                >
                  <h3 className="text-lg font-medium text-gray-900">Weakness Analysis</h3>
                  {expandedSections.weaknessAnalysis ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                
                {expandedSections.weaknessAnalysis && weaknessAnalysis && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Weak Archetypes */}
                      <div>
                        <h4 className="text-base font-medium text-gray-900 mb-3">Challenging Matchups</h4>
                        
                        {weaknessAnalysis.weakArchetypes.length > 0 ? (
                          <div className="space-y-3">
                            {weaknessAnalysis.weakArchetypes.map((archetype, index) => (
                              <div key={index} className="bg-red-50 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-red-800">{archetype.archetype}</div>
                                  <div className="text-sm text-red-700">
                                    {formatPercentage(archetype.winRate)} win rate
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-red-600">
                                  Based on {archetype.games} games
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            No significant weaknesses detected
                          </div>
                        )}
                      </div>
                      
                      {/* Weak Patterns */}
                      <div>
                        <h4 className="text-base font-medium text-gray-900 mb-3">Loss Patterns</h4>
                        
                        {weaknessAnalysis.weakMatchupPatterns.length > 0 ? (
                          <div className="space-y-3">
                            {weaknessAnalysis.weakMatchupPatterns.map((pattern, index) => (
                              <div key={index} className="bg-orange-50 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-orange-800">{pattern.pattern}</div>
                                  <div className="text-sm text-orange-700">
                                    {formatPercentage(pattern.percentage)}
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-orange-600">
                                  Occurred in {pattern.frequency} losses
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            No significant patterns detected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Meta Prediction */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('metaPrediction')}
                >
                  <h3 className="text-lg font-medium text-gray-900">Meta Prediction</h3>
                  {expandedSections.metaPrediction ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                
                {expandedSections.metaPrediction && metaPrediction && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Rising Archetypes */}
                      <div>
                        <h4 className="text-base font-medium text-green-800 mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Rising Archetypes
                        </h4>
                        
                        {metaPrediction.risingArchetypes.length > 0 ? (
                          <div className="space-y-2">
                            {metaPrediction.risingArchetypes.map((archetype, index) => (
                              <div key={index} className="bg-green-50 rounded-lg p-2">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-green-800">{archetype.name}</div>
                                  <div className="text-sm text-green-700">
                                    +{formatPercentage(archetype.trend)}
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-green-600">
                                  Current share: {formatPercentage(archetype.share)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            No rising archetypes detected
                          </div>
                        )}
                      </div>
                      
                      {/* Declining Archetypes */}
                      <div>
                        <h4 className="text-base font-medium text-red-800 mb-3 flex items-center">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          Declining Archetypes
                        </h4>
                        
                        {metaPrediction.decliningArchetypes.length > 0 ? (
                          <div className="space-y-2">
                            {metaPrediction.decliningArchetypes.map((archetype, index) => (
                              <div key={index} className="bg-red-50 rounded-lg p-2">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-red-800">{archetype.name}</div>
                                  <div className="text-sm text-red-700">
                                    {formatPercentage(archetype.trend)}
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-red-600">
                                  Current share: {formatPercentage(archetype.share)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            No declining archetypes detected
                          </div>
                        )}
                      </div>
                      
                      {/* Meta Health */}
                      <div>
                        <h4 className="text-base font-medium text-blue-800 mb-3 flex items-center">
                          <Hexagon className="w-4 h-4 mr-1" />
                          Meta Health
                        </h4>
                        
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="mb-2">
                            <div className="text-sm text-blue-700 mb-1">Health Index</div>
                            <div className="w-full bg-blue-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  metaPrediction.metaHealthIndex > 0.7 ? 'bg-green-500' :
                                  metaPrediction.metaHealthIndex > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${metaPrediction.metaHealthIndex * 100}%` }}
                              ></div>
                            </div>
                            <div className="mt-1 text-xs text-blue-600 text-right">
                              {formatPercentage(metaPrediction.metaHealthIndex)}
                            </div>
                          </div>
                          
                          <div className="text-sm text-blue-700">
                            Diversity Trend: <span className="font-medium">{metaPrediction.diversityTrend}</span>
                          </div>
                          
                          {metaPrediction.predictedTopArchetype && (
                            <div className="mt-3 text-sm">
                              <div className="text-blue-700">Predicted Top Archetype:</div>
                              <div className="font-medium text-blue-800">
                                {metaPrediction.predictedTopArchetype.name}
                              </div>
                              <div className="text-xs text-blue-600">
                                Projected share: {formatPercentage(metaPrediction.predictedTopArchetype.projectedShare)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Skill Analysis Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Skill Radar */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Skill Decomposition</h3>
                </div>
                
                <div className="p-6">
                  {renderSkillRadar()}
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skill Descriptions */}
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-3">Skill Breakdown</h4>
                      
                      <div className="space-y-4">
                        {skillDecomposition && Object.entries(skillDecomposition).map(([skill, value]) => {
                          const skillName = skill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                          let description = '';
                          let icon = null;
                          
                          switch (skill) {
                            case 'technicalPlay':
                              description = 'Your ability to make optimal plays and technical decisions during games.';
                              icon = <Zap className="w-5 h-5 text-yellow-500" />;
                              break;
                            case 'deckBuilding':
                              description = 'Your skill in constructing effective decks and making good card choices.';
                              icon = <Shield className="w-5 h-5 text-blue-500" />;
                              break;
                            case 'adaptability':
                              description = 'How well you adjust your strategy based on the matchup and game state.';
                              icon = <RefreshCw className="w-5 h-5 text-green-500" />;
                              break;
                            case 'mentalGame':
                              description = 'Your focus, resilience, and ability to make good decisions under pressure.';
                              icon = <Target className="w-5 h-5 text-red-500" />;
                              break;
                            case 'consistency':
                              description = 'How reliably you perform at your skill level across different matches.';
                              icon = <BarChart className="w-5 h-5 text-purple-500" />;
                              break;
                            default:
                              icon = <Hexagon className="w-5 h-5 text-gray-500" />;
                          }
                          
                          return (
                            <div key={skill} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center mb-2">
                                {icon}
                                <div className="ml-2 font-medium text-gray-900">{skillName}</div>
                              </div>
                              
                              <div className="text-sm text-gray-600 mb-3">{description}</div>
                              
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="h-2.5 rounded-full bg-blue-600"
                                  style={{ width: `${value * 100}%` }}
                                ></div>
                              </div>
                              
                              <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                                <span>Needs Improvement</span>
                                <span className="font-medium text-blue-700">{formatPercentage(value)}</span>
                                <span>Excellent</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Skill Improvement Recommendations */}
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-3">Improvement Recommendations</h4>
                      
                      {skillDecomposition && (
                        <div className="space-y-4">
                          {Object.entries(skillDecomposition)
                            .sort(([_, valueA], [__, valueB]) => valueA - valueB)
                            .slice(0, 2)
                            .map(([skill, value]) => {
                              const skillName = skill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                              let recommendations = [];
                              
                              switch (skill) {
                                case 'technicalPlay':
                                  recommendations = [
                                    'Practice calculating probabilities during games',
                                    'Review your games to identify technical mistakes',
                                    'Study optimal play patterns for your deck'
                                  ];
                                  break;
                                case 'deckBuilding':
                                  recommendations = [
                                    'Analyze top-performing decklists in your archetype',
                                    'Test different card ratios to find optimal numbers',
                                    'Consider your local meta when making card choices'
                                  ];
                                  break;
                                case 'adaptability':
                                  recommendations = [
                                    'Practice with a wider variety of decks',
                                    'Develop specific plans for different matchups',
                                    'Be more willing to change your strategy mid-game'
                                  ];
                                  break;
                                case 'mentalGame':
                                  recommendations = [
                                    'Take short breaks between matches',
                                    'Develop a pre-game routine to improve focus',
                                    'Practice mindfulness to reduce tilt'
                                  ];
                                  break;
                                case 'consistency':
                                  recommendations = [
                                    'Stick with one deck for a longer period',
                                    'Create and follow a structured practice routine',
                                    'Take notes on common mistakes to avoid repeating them'
                                  ];
                                  break;
                                default:
                                  recommendations = ['Practice regularly', 'Study top players', 'Review your games'];
                              }
                              
                              return (
                                <div key={skill} className="bg-blue-50 rounded-lg p-4">
                                  <div className="font-medium text-blue-800 mb-2">
                                    Improve Your {skillName}
                                  </div>
                                  
                                  <ul className="space-y-2">
                                    {recommendations.map((rec, i) => (
                                      <li key={i} className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span className="text-sm text-blue-700">{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                        </div>
                      )}
                      
                      {/* Performance Variance */}
                      {performanceVariance && (
                        <div className="mt-6 bg-purple-50 rounded-lg p-4">
                          <div className="font-medium text-purple-800 mb-2">
                            Performance Stability: {performanceVariance.performanceStability}
                          </div>
                          
                          <div className="text-sm text-purple-700 mb-3">
                            {performanceVariance.consistencyScore > 0.7 ? (
                              'You perform very consistently across different matches.'
                            ) : performanceVariance.consistencyScore > 0.5 ? (
                              'Your performance is moderately consistent, with some variance.'
                            ) : (
                              'Your performance varies significantly from match to match.'
                            )}
                          </div>
                          
                          <div className="w-full bg-purple-200 rounded-full h-2.5 mb-2">
                            <div 
                              className="h-2.5 rounded-full bg-purple-600"
                              style={{ width: `${performanceVariance.consistencyScore * 100}%` }}
                            ></div>
                          </div>
                          
                          <div className="text-xs text-purple-600">
                            {performanceVariance.consistencyScore < 0.5 ? (
                              'Recommendation: Focus on developing a more consistent approach to your games.'
                            ) : (
                              'Your consistency is a strength - keep it up!'
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Matchup Analysis Tab */}
          {activeTab === 'matchups' && (
            <div className="space-y-6">
              {/* Archetype Performance */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Archetype Performance</h3>
                </div>
                
                <div className="p-6">
                  {weaknessAnalysis && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strong Matchups */}
                      <div>
                        <h4 className="text-base font-medium text-green-800 mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Strong Matchups
                        </h4>
                        
                        {/* This would be populated with actual data in a real implementation */}
                        <div className="space-y-2">
                          {[
                            { archetype: 'Control', winRate: 0.68, games: 25 },
                            { archetype: 'Midrange', winRate: 0.62, games: 18 },
                            { archetype: 'Combo', winRate: 0.58, games: 12 }
                          ].map((archetype, index) => (
                            <div key={index} className="bg-green-50 rounded-lg p-3">
                              <div className="flex justify-between items-center">
                                <div className="font-medium text-green-800">{archetype.archetype}</div>
                                <div className="text-sm text-green-700">
                                  {formatPercentage(archetype.winRate)} win rate
                                </div>
                              </div>
                              <div className="mt-1 text-xs text-green-600">
                                Based on {archetype.games} games
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Weak Matchups */}
                      <div>
                        <h4 className="text-base font-medium text-red-800 mb-3 flex items-center">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          Challenging Matchups
                        </h4>
                        
                        {weaknessAnalysis.weakArchetypes.length > 0 ? (
                          <div className="space-y-2">
                            {weaknessAnalysis.weakArchetypes.map((archetype, index) => (
                              <div key={index} className="bg-red-50 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-red-800">{archetype.archetype}</div>
                                  <div className="text-sm text-red-700">
                                    {formatPercentage(archetype.winRate)} win rate
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-red-600">
                                  Based on {archetype.games} games
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            No significant weaknesses detected
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Matchup Recommendations */}
                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h4 className="text-base font-medium text-blue-800 mb-3">Matchup Recommendations</h4>
                    
                    {weaknessAnalysis && weaknessAnalysis.weakArchetypes.length > 0 ? (
                      <div className="space-y-4">
                        {weaknessAnalysis.weakArchetypes.slice(0, 1).map((archetype, index) => (
                          <div key={index}>
                            <div className="font-medium text-blue-800 mb-2">
                              Against {archetype.archetype}:
                            </div>
                            
                            <ul className="space-y-2">
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span className="text-sm text-blue-700">
                                  Focus on resource management and don't overextend
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span className="text-sm text-blue-700">
                                  Consider sideboarding specific tech cards
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span className="text-sm text-blue-700">
                                  Study top players' approaches to this matchup
                                </span>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-blue-700 text-sm">
                        Continue with your current approach - no significant weaknesses detected.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Loss Patterns */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Loss Patterns</h3>
                </div>
                
                <div className="p-6">
                  {weaknessAnalysis && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pattern Analysis */}
                      <div>
                        <h4 className="text-base font-medium text-gray-900 mb-3">Common Patterns</h4>
                        
                        {weaknessAnalysis.weakMatchupPatterns.length > 0 ? (
                          <div className="space-y-3">
                            {weaknessAnalysis.weakMatchupPatterns.map((pattern, index) => (
                              <div key={index} className="bg-orange-50 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-orange-800">{pattern.pattern}</div>
                                  <div className="text-sm text-orange-700">
                                    {formatPercentage(pattern.percentage)}
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-orange-600">
                                  Occurred in {pattern.frequency} losses
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            No significant patterns detected
                          </div>
                        )}
                      </div>
                      
                      {/* Improvement Strategies */}
                      <div>
                        <h4 className="text-base font-medium text-gray-900 mb-3">Improvement Strategies</h4>
                        
                        {weaknessAnalysis && weaknessAnalysis.weakMatchupPatterns.length > 0 ? (
                          <div className="space-y-4">
                            {weaknessAnalysis.weakMatchupPatterns.slice(0, 2).map((pattern, index) => {
                              let strategies = [];
                              
                              if (pattern.pattern.includes('Early Game')) {
                                strategies = [
                                  'Review your mulligan decisions',
                                  'Consider adjusting your early game curve',
                                  'Practice more efficient resource use in early turns'
                                ];
                              } else if (pattern.pattern.includes('Mid Game')) {
                                strategies = [
                                  'Work on transition from early to mid-game',
                                  'Improve board state evaluation',
                                  'Practice identifying key turning points'
                                ];
                              } else if (pattern.pattern.includes('Late Game')) {
                                strategies = [
                                  'Improve resource management for the long game',
                                  'Practice identifying win conditions',
                                  'Consider adding more late-game options to your deck'
                                ];
                              } else if (pattern.pattern.includes('Aggressive')) {
                                strategies = [
                                  'Add more defensive options to your deck',
                                  'Practice identifying when to switch to defense',
                                  'Improve early game stabilization techniques'
                                ];
                              } else {
                                strategies = [
                                  'Review games with this pattern',
                                  'Practice specific scenarios',
                                  'Consult with more experienced players'
                                ];
                              }
                              
                              return (
                                <div key={index} className="bg-blue-50 rounded-lg p-3">
                                  <div className="font-medium text-blue-800 mb-2">
                                    For {pattern.pattern}:
                                  </div>
                                  
                                  <ul className="space-y-1">
                                    {strategies.map((strategy, i) => (
                                      <li key={i} className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span className="text-sm text-blue-700">{strategy}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            No specific improvement strategies needed at this time.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Meta Analysis Tab */}
          {activeTab === 'meta' && (
            <div className="space-y-6">
              {/* Meta Overview */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Meta Overview</h3>
                </div>
                
                <div className="p-6">
                  {metaPrediction && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Meta Health */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-blue-800">Meta Health</h4>
                          <Hexagon className="w-5 h-5 text-blue-500" />
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm text-blue-700 mb-1">Health Index</div>
                          <div className="w-full bg-blue-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                metaPrediction.metaHealthIndex > 0.7 ? 'bg-green-500' :
                                metaPrediction.metaHealthIndex > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${metaPrediction.metaHealthIndex * 100}%` }}
                            ></div>
                          </div>
                          <div className="mt-1 text-xs text-blue-600 text-right">
                            {formatPercentage(metaPrediction.metaHealthIndex)}
                          </div>
                        </div>
                        
                        <div className="text-sm text-blue-700">
                          <div className="mb-1">Diversity Trend: <span className="font-medium">{metaPrediction.diversityTrend}</span></div>
                          <div>
                            {metaPrediction.metaHealthIndex > 0.7 ? (
                              'The meta is diverse and balanced.'
                            ) : metaPrediction.metaHealthIndex > 0.4 ? (
                              'The meta is moderately diverse with some dominant strategies.'
                            ) : (
                              'The meta lacks diversity with a few dominant archetypes.'
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Predicted Top Archetype */}
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-purple-800">Predicted Top Archetype</h4>
                          <Award className="w-5 h-5 text-purple-500" />
                        </div>
                        
                        {metaPrediction.predictedTopArchetype ? (
                          <>
                            <div className="text-xl font-bold text-purple-900 mb-2">
                              {metaPrediction.predictedTopArchetype.name}
                            </div>
                            
                            <div className="text-sm text-purple-700 mb-3">
                              Projected meta share: {formatPercentage(metaPrediction.predictedTopArchetype.projectedShare)}
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <div className="text-purple-700 mr-2">Prediction confidence:</div>
                              <div className="w-16 bg-purple-200 rounded-full h-1.5">
                                <div 
                                  className="h-1.5 rounded-full bg-purple-600"
                                  style={{ width: `${metaPrediction.predictedTopArchetype.confidence * 100}%` }}
                                ></div>
                              </div>
                              <div className="ml-2 text-purple-800">
                                {formatPercentage(metaPrediction.predictedTopArchetype.confidence)}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-purple-700">
                            Insufficient data to predict top archetype
                          </div>
                        )}
                      </div>
                      
                      {/* Meta Cycle Position */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-green-800">Meta Cycle Position</h4>
                          <RefreshCw className="w-5 h-5 text-green-500" />
                        </div>
                        
                        {/* This would be calculated from actual data in a real implementation */}
                        <div className="text-sm text-green-700 mb-3">
                          The meta appears to be in a <span className="font-medium">transition phase</span>, with established archetypes being challenged by rising contenders.
                        </div>
                        
                        <div className="text-sm text-green-700">
                          {metaPrediction.risingArchetypes.length > 0 ? (
                            <>
                              <div className="font-medium mb-1">Key Indicator:</div>
                              <div>
                                {metaPrediction.risingArchetypes[0].name} is rising quickly, suggesting a shift toward {metaPrediction.risingArchetypes[0].name.includes('Aggro') ? 'faster' : 'more controlling'} strategies.
                              </div>
                            </>
                          ) : (
                            <div>The meta appears relatively stable at this time.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Meta Trends */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Meta Trends</h3>
                </div>
                
                <div className="p-6">
                  {metaPrediction && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Rising Archetypes */}
                      <div>
                        <h4 className="text-base font-medium text-green-800 mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Rising Archetypes
                        </h4>
                        
                        {metaPrediction.risingArchetypes.length > 0 ? (
                          <div className="space-y-3">
                            {metaPrediction.risingArchetypes.map((archetype, index) => (
                              <div key={index} className="bg-green-50 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-green-800">{archetype.name}</div>
                                  <div className="text-sm text-green-700">
                                    +{formatPercentage(archetype.trend)}
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-green-600">
                                  Current share: {formatPercentage(archetype.share)}
                                </div>
                                <div className="mt-2 text-xs text-green-700">
                                  Win rate: {formatPercentage(archetype.winRate)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            No rising archetypes detected
                          </div>
                        )}
                        
                        {metaPrediction.risingArchetypes.length > 0 && (
                          <div className="mt-4 bg-green-50 rounded-lg p-3">
                            <div className="font-medium text-green-800 mb-2">What This Means For You:</div>
                            <div className="text-sm text-green-700">
                              {weaknessAnalysis && weaknessAnalysis.weakArchetypes.some(
                                weak => metaPrediction.risingArchetypes.some(
                                  rising => rising.name === weak.archetype
                                )
                              ) ? (
                                <div className="flex items-start">
                                  <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1 flex-shrink-0 mt-0.5" />
                                  <span>
                                    One of your challenging matchups is becoming more popular. Consider adjusting your deck or strategy.
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  These rising archetypes don't significantly impact your current strategy.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Declining Archetypes */}
                      <div>
                        <h4 className="text-base font-medium text-red-800 mb-3 flex items-center">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          Declining Archetypes
                        </h4>
                        
                        {metaPrediction.decliningArchetypes.length > 0 ? (
                          <div className="space-y-3">
                            {metaPrediction.decliningArchetypes.map((archetype, index) => (
                              <div key={index} className="bg-red-50 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-red-800">{archetype.name}</div>
                                  <div className="text-sm text-red-700">
                                    {formatPercentage(archetype.trend)}
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-red-600">
                                  Current share: {formatPercentage(archetype.share)}
                                </div>
                                <div className="mt-2 text-xs text-red-700">
                                  Win rate: {formatPercentage(archetype.winRate)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            No declining archetypes detected
                          </div>
                        )}
                        
                        {metaPrediction.decliningArchetypes.length > 0 && (
                          <div className="mt-4 bg-blue-50 rounded-lg p-3">
                            <div className="font-medium text-blue-800 mb-2">Strategic Implications:</div>
                            <div className="text-sm text-blue-700">
                              {playerData.deckArchetype && metaPrediction.decliningArchetypes.some(
                                declining => declining.name === playerData.deckArchetype
                              ) ? (
                                <div className="flex items-start">
                                  <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1 flex-shrink-0 mt-0.5" />
                                  <span>
                                    Your current deck archetype is declining in popularity. This may be due to unfavorable matchups in the current meta.
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  As these archetypes decline, expect to see fewer of these matchups in tournaments and ladder play.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Meta Recommendations */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Strategic Recommendations</h3>
                </div>
                
                <div className="p-6">
                  {metaPrediction && (
                    <div className="space-y-4">
                      {/* Deck Positioning */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="font-medium text-blue-800 mb-3">Deck Positioning</div>
                        
                        <div className="text-sm text-blue-700">
                          {playerData.deckArchetype ? (
                            <>
                              <p className="mb-2">
                                Your current deck ({playerData.deckArchetype}) is 
                                {metaPrediction.risingArchetypes.some(a => a.name === playerData.deckArchetype)
                                  ? ' well-positioned in the current meta, as it\'s gaining popularity.'
                                  : metaPrediction.decliningArchetypes.some(a => a.name === playerData.deckArchetype)
                                    ? ' facing challenges in the current meta, as it\'s declining in popularity.'
                                    : ' in a stable position in the current meta.'}
                              </p>
                              
                              {metaPrediction.predictedTopArchetype && (
                                <div className="mt-3">
                                  <div className="font-medium mb-1">Preparing for the predicted meta:</div>
                                  <div className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    <span>
                                      {metaPrediction.predictedTopArchetype.name} is predicted to be the top archetype. 
                                      {weaknessAnalysis && weaknessAnalysis.weakArchetypes.some(
                                        weak => weak.archetype === metaPrediction.predictedTopArchetype.name
                                      )
                                        ? ' This is one of your challenging matchups - consider specific tech cards or strategy adjustments.'
                                        : ' Your current deck should perform well against this archetype.'}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <p>
                              Based on the current meta trends, archetypes with strong matchups against 
                              {metaPrediction.risingArchetypes.length > 0 
                                ? ` ${metaPrediction.risingArchetypes[0].name}` 
                                : ' the most popular decks'} 
                              are well-positioned.
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Tech Choices */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="font-medium text-green-800 mb-3">Recommended Tech Choices</div>
                        
                        <div className="text-sm text-green-700">
                          {metaPrediction.risingArchetypes.length > 0 ? (
                            <div className="space-y-3">
                              <p>
                                With {metaPrediction.risingArchetypes[0].name} on the rise, consider these tech options:
                              </p>
                              
                              <ul className="space-y-2">
                                <li className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  <span>
                                    {metaPrediction.risingArchetypes[0].name.includes('Aggro')
                                      ? 'Include more early game defensive options'
                                      : metaPrediction.risingArchetypes[0].name.includes('Control')
                                        ? 'Add cards that provide sustained value'
                                        : metaPrediction.risingArchetypes[0].name.includes('Combo')
                                          ? 'Include disruption effects'
                                          : 'Adjust your deck to improve this matchup'}
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  <span>
                                    {metaPrediction.risingArchetypes[0].name.includes('Aggro')
                                      ? 'Consider board clears and healing effects'
                                      : metaPrediction.risingArchetypes[0].name.includes('Control')
                                        ? 'Include cards that can't be easily answered'
                                        : metaPrediction.risingArchetypes[0].name.includes('Combo')
                                          ? 'Add pressure to prevent combo assembly'
                                          : 'Tech against the specific strengths of this archetype'}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          ) : (
                            <p>
                              The meta appears relatively balanced. Focus on general consistency rather than specific tech choices.
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Tournament Strategy */}
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="font-medium text-purple-800 mb-3">Tournament Strategy</div>
                        
                        <div className="text-sm text-purple-700">
                          <p className="mb-3">
                            {metaPrediction.metaHealthIndex > 0.7
                              ? 'The meta is diverse, so bring a deck you're comfortable with rather than trying to counter specific archetypes.'
                              : metaPrediction.metaHealthIndex > 0.4
                                ? 'The meta has some dominant strategies. Consider bringing a deck that performs well against the top archetypes.'
                                : 'The meta lacks diversity. Either play the top deck or bring something that specifically counters it.'}
                          </p>
                          
                          {metaPrediction.predictedTopArchetype && (
                            <div>
                              <div className="font-medium mb-1">Expected field:</div>
                              <ul className="space-y-1">
                                <li className="flex items-start">
                                  <span className="text-purple-500 mr-2">•</span>
                                  <span>
                                    {metaPrediction.predictedTopArchetype.name}: ~{formatPercentage(metaPrediction.predictedTopArchetype.projectedShare)} of the field
                                  </span>
                                </li>
                                {metaPrediction.risingArchetypes.length > 0 && (
                                  <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">•</span>
                                    <span>
                                      {metaPrediction.risingArchetypes[0].name}: Increasing presence
                                    </span>
                                  </li>
                                )}
                                {metaPrediction.decliningArchetypes.length > 0 && (
                                  <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">•</span>
                                    <span>
                                      {metaPrediction.decliningArchetypes[0].name}: Decreasing presence
                                    </span>
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Decision Points Tab */}
          {activeTab === 'decisions' && (
            <div className="space-y-6">
              {/* Critical Decision Points */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Critical Decision Points</h3>
                </div>
                
                <div className="p-6">
                  {criticalPoints.length > 0 ? (
                    <div className="space-y-6">
                      {criticalPoints.map((match, matchIndex) => (
                        <div key={matchIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className={`px-4 py-3 ${match.result === 'win' ? 'bg-green-50' : 'bg-red-50'}`}>
                            <div className="flex justify-between items-center">
                              <div className="font-medium">
                                <span className={match.result === 'win' ? 'text-green-800' : 'text-red-800'}>
                                  {match.result === 'win' ? 'Win' : 'Loss'}
                                </span>
                                <span className="text-gray-700"> vs {match.opponent}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(match.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="divide-y divide-gray-200">
                            {match.points.slice(0, 3).map((point, pointIndex) => (
                              <div key={pointIndex} className="p-4">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      point.winProbabilityAfter > point.winProbabilityBefore
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {point.turn}
                                    </div>
                                  </div>
                                  
                                  <div className="ml-3 flex-1">
                                    <div className="font-medium text-gray-900 mb-1">{point.description}</div>
                                    
                                    <div className="flex items-center text-sm mb-2">
                                      <div className="text-gray-500 mr-2">Win probability change:</div>
                                      <div className={`font-medium ${
                                        point.winProbabilityAfter > point.winProbabilityBefore
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                      }`}>
                                        {point.winProbabilityBefore !== null && point.winProbabilityAfter !== null ? (
                                          <>
                                            {formatPercentage(point.winProbabilityBefore)} → {formatPercentage(point.winProbabilityAfter)}
                                            {' '}
                                            ({point.winProbabilityAfter > point.winProbabilityBefore ? '+' : ''}
                                            {formatPercentage(point.winProbabilityAfter - point.winProbabilityBefore)})
                                          </>
                                        ) : (
                                          `Impact: ${formatPercentage(point.impact)}`
                                        )}
                                      </div>
                                    </div>
                                    
                                    {point.actions && point.actions.length > 0 && (
                                      <div className="text-sm text-gray-600">
                                        <div className="font-medium mb-1">Key actions:</div>
                                        <ul className="space-y-1">
                                          {point.actions.map((action, actionIndex) => (
                                            <li key={actionIndex} className="flex items-start">
                                              <span className="text-gray-400 mr-2">•</span>
                                              <span>{action.description}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crosshair className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No critical points found</h3>
                      <p className="text-gray-500">
                        We couldn't identify any significant decision points in your recent games.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Decision Making Patterns */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Decision Making Patterns</h3>
                </div>
                
                <div className="p-6">
                  {/* This would be populated with actual data in a real implementation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div>
                      <h4 className="text-base font-medium text-green-800 mb-3">Decision Strengths</h4>
                      
                      <div className="space-y-3">
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="font-medium text-green-800 mb-1">Resource Management</div>
                          <div className="text-sm text-green-700">
                            You consistently make good decisions about resource allocation in the mid-game.
                          </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="font-medium text-green-800 mb-1">Mulligan Decisions</div>
                          <div className="text-sm text-green-700">
                            Your opening hand decisions show good understanding of matchup priorities.
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Areas for Improvement */}
                    <div>
                      <h4 className="text-base font-medium text-blue-800 mb-3">Areas for Improvement</h4>
                      
                      <div className="space-y-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="font-medium text-blue-800 mb-1">Risk Assessment</div>
                          <div className="text-sm text-blue-700">
                            You sometimes take unnecessary risks when in a winning position.
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="font-medium text-blue-800 mb-1">Adapting to Opponent Signals</div>
                          <div className="text-sm text-blue-700">
                            Work on recognizing and responding to opponent's strategic shifts.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decision Making Recommendations */}
                  <div className="mt-6 bg-purple-50 rounded-lg p-4">
                    <h4 className="text-base font-medium text-purple-800 mb-3">Recommendations</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <div>
                          <span className="font-medium text-purple-800">Practice scenario analysis:</span>
                          <span className="text-sm text-purple-700 ml-1">
                            When facing critical decisions, take time to consider multiple possible outcomes.
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <div>
                          <span className="font-medium text-purple-800">Review critical turns:</span>
                          <span className="text-sm text-purple-700 ml-1">
                            After each match, identify the 2-3 most important decision points and analyze alternatives.
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <div>
                          <span className="font-medium text-purple-800">Study expert play:</span>
                          <span className="text-sm text-purple-700 ml-1">
                            Watch how top players handle similar situations and note their decision-making process.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;