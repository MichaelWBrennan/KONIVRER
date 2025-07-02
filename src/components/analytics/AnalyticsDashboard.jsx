/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { usePhysicalMatchmaking } from '../../contexts/PhysicalMatchmakingContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Zap,
  Target,
  Users,
  Clock,
  Shuffle,
  AlertTriangle,
  Award,
  BarChart2,
} from 'lucide-react';

/**
 * Advanced Analytics Dashboard Component
 * Displays various analytics from the AnalyticsEngine
 */
const AnalyticsDashboard = ({ playerId, deckId }) => {
  const { analyticsEngine } = usePhysicalMatchmaking();
  const [activeTab, setActiveTab] = useState('performance');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for charts
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Fetch different analytics based on the active tab
        let data;

        switch (activeTab) {
          case 'performance':
            data = await analyticsEngine.getPerformanceAnalytics(playerId);
            break;
          case 'synergy':
            data = await analyticsEngine.getCardSynergyAnalysis(deckId);
            break;
          case 'decisions':
            data = await analyticsEngine.getDecisionPointAnalysis(playerId);
            break;
          case 'variance':
            data =
              await analyticsEngine.getPerformanceVarianceAnalysis(playerId);
            break;
          case 'metagame':
            data = await analyticsEngine.getMetagameCyclePrediction();
            break;
          case 'weakness':
            data =
              await analyticsEngine.getPersonalizedWeaknessDetection(playerId);
            break;
          default:
            data = await analyticsEngine.getPerformanceAnalytics(playerId);
        }

        setAnalyticsData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [analyticsEngine, playerId, deckId, activeTab]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // Render placeholder if no data
  if (!analyticsData) {
    return (
      <div
        className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">No analytics data available.</span>
      </div>
    );
  }

  // Render performance analytics
  const renderPerformanceAnalytics = () => {
    const { winRate, ratingTrend, matchHistory } = analyticsData;

    // Format data for line chart
    const ratingData = ratingTrend.map((point, index) => ({
      name: `Match ${index + 1}`,
      rating: point.rating,
      date: new Date(point.timestamp).toLocaleDateString(),
    }));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Win Rate</h3>
              <Target className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold mt-2">
              {(winRate * 100).toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Matches
              </h3>
              <Users className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold mt-2">{matchHistory.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Rating Trend
              </h3>
              <TrendingUp
                className={
                  ratingTrend[ratingTrend.length - 1]?.trend > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
                size={20}
              />
            </div>
            <p className="text-3xl font-bold mt-2">
              {ratingTrend[ratingTrend.length - 1]?.trend > 0 ? '+' : ''}
              {ratingTrend[ratingTrend.length - 1]?.trend.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Rating History
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ratingData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={value => [`${value}`, 'Rating']}
                  labelFormatter={label =>
                    `${label} (${ratingData.find(d => d.name === label)?.date})`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // Render card synergy analytics
  const renderCardSynergyAnalytics = () => {
    const { synergies, topCombinations } = analyticsData;

    // Format data for bar chart
    const synergyData = synergies.slice(0, 5).map(synergy => ({
      name: `${synergy.card1.name} + ${synergy.card2.name}`,
      value: synergy.synergyScore * 100,
    }));

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Top Card Synergies
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={synergyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={value => [`${value.toFixed(1)}%`, 'Synergy Score']}
                />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recommended Card Combinations
          </h3>
          <div className="space-y-4">
            {topCombinations.slice(0, 3).map((combo, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <Zap className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{combo.name}</h4>
                    <p className="text-sm text-gray-600">{combo.description}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {(combo.winRate * 100).toFixed(1)}% Win Rate
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render decision point analytics
  const renderDecisionPointAnalytics = () => {
    const { criticalTurns, keyDecisions } = analyticsData;

    // Format data for pie chart
    const decisionData = criticalTurns.map(turn => ({
      name: `Turn ${turn.turn}`,
      value: turn.impactScore * 100,
    }));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Critical Turn Impact
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={decisionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {decisionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={value => [
                      `${value.toFixed(1)}%`,
                      'Impact Score',
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Key Decision Points
            </h3>
            <div className="space-y-4">
              {keyDecisions.slice(0, 4).map((decision, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="bg-yellow-100 rounded-full p-2 mr-3">
                      <Clock className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        Turn {decision.turn}: {decision.description}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {decision.recommendation}
                      </p>
                      <div className="mt-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                          Optimal: {decision.optimalPlay}
                        </span>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Common Mistake: {decision.commonMistake}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render performance variance analytics
  const renderVarianceAnalytics = () => {
    const { consistency, matchupVariance } = analyticsData;

    // Format data for bar chart
    const matchupData = matchupVariance.slice(0, 5).map(matchup => ({
      name: matchup.archetype,
      winRate: matchup.winRate * 100,
      variance: matchup.variance * 100,
    }));

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Overall Consistency
            </h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div
                  className={`h-2.5 rounded-full ${
                    consistency >= 0.7
                      ? 'bg-green-600'
                      : consistency >= 0.4
                        ? 'bg-yellow-400'
                        : 'bg-red-600'
                  }`}
                  style={{ width: `${consistency * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {(consistency * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {consistency >= 0.7
              ? 'Your performance is highly consistent across different matchups and tournaments.'
              : consistency >= 0.4
                ? 'Your performance shows moderate consistency with some variance in specific matchups.'
                : 'Your performance shows high variance across different matchups and tournaments.'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Matchup Variance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={matchupData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="winRate" name="Win Rate %" fill="#82ca9d" />
                <Bar dataKey="variance" name="Variance %" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // Render metagame cycle prediction
  const renderMetagameAnalytics = () => {
    const {
      currentMeta,
      predictedTrends,
      risingArchetypes,
      decliningArchetypes,
    } = analyticsData;

    // Format data for line chart
    const trendData = predictedTrends.map((trend, index) => {
      const dataPoint = { name: `Week ${index + 1}` };
      trend.archetypes.forEach(archetype => {
        dataPoint[archetype.name] = archetype.prevalence * 100;
      });
      return dataPoint;
    });

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Current Metagame
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentMeta.slice(0, 3).map((archetype, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Award className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{archetype.name}</h4>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="h-2.5 rounded-full bg-blue-600"
                          style={{ width: `${archetype.prevalence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {(archetype.prevalence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Predicted Meta Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {currentMeta.slice(0, 5).map((archetype, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={archetype.name}
                    stroke={COLORS[index % COLORS.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Rising Archetypes
            </h3>
            <div className="space-y-3">
              {risingArchetypes.slice(0, 3).map((archetype, index) => (
                <div key={index} className="flex items-center">
                  <TrendingUp className="text-green-500 mr-2" size={16} />
                  <span className="font-medium">{archetype.name}</span>
                  <span className="ml-auto text-green-500">
                    +{(archetype.growthRate * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Declining Archetypes
            </h3>
            <div className="space-y-3">
              {decliningArchetypes.slice(0, 3).map((archetype, index) => (
                <div key={index} className="flex items-center">
                  <TrendingUp
                    className="text-red-500 transform rotate-180 mr-2"
                    size={16}
                  />
                  <span className="font-medium">{archetype.name}</span>
                  <span className="ml-auto text-red-500">
                    {(archetype.growthRate * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render personalized weakness detection
  const renderWeaknessAnalytics = () => {
    const { weaknesses, improvementAreas, strengthAreas } = analyticsData;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Matchup Weaknesses
          </h3>
          <div className="space-y-4">
            {weaknesses.slice(0, 3).map((weakness, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-start">
                  <div className="bg-red-100 rounded-full p-2 mr-3">
                    <AlertTriangle className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{weakness.archetype}</h4>
                    <p className="text-sm text-gray-600">
                      {weakness.description}
                    </p>
                    <div className="mt-2">
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {(weakness.winRate * 100).toFixed(1)}% Win Rate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {improvementAreas.map((area, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-yellow-100 rounded-full p-1 mr-2">
                    <BarChart2 className="text-yellow-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{area.name}</h4>
                    <p className="text-xs text-gray-600">
                      {area.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Strength Areas
            </h3>
            <div className="space-y-3">
              {strengthAreas.map((area, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-2">
                    <Award className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{area.name}</h4>
                    <p className="text-xs text-gray-600">{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'performance':
        return renderPerformanceAnalytics();
      case 'synergy':
        return renderCardSynergyAnalytics();
      case 'decisions':
        return renderDecisionPointAnalytics();
      case 'variance':
        return renderVarianceAnalytics();
      case 'metagame':
        return renderMetagameAnalytics();
      case 'weakness':
        return renderWeaknessAnalytics();
      default:
        return renderPerformanceAnalytics();
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Advanced Analytics</h2>
        <p className="text-gray-600">
          Gain deeper insights into your performance and the metagame
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === 'performance'
                ? 'bg-primary text-white'
                : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('performance')}
          >
            <TrendingUp size={16} className="mr-2" />
            Performance
          </button>

          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === 'synergy' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('synergy')}
          >
            <Zap size={16} className="mr-2" />
            Card Synergy
          </button>

          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === 'decisions'
                ? 'bg-primary text-white'
                : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('decisions')}
          >
            <Target size={16} className="mr-2" />
            Decision Points
          </button>

          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === 'variance' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('variance')}
          >
            <Shuffle size={16} className="mr-2" />
            Variance
          </button>

          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === 'metagame' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('metagame')}
          >
            <Users size={16} className="mr-2" />
            Metagame
          </button>

          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === 'weakness' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('weakness')}
          >
            <AlertTriangle size={16} className="mr-2" />
            Weaknesses
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default AnalyticsDashboard;
