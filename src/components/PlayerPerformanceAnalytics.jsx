import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

/**
 * Player Performance Analytics Component
 * Provides comprehensive visualization and analysis of player performance
 */
const PlayerPerformanceAnalytics = ({ rankingEngine, playerData }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  
  // Analytics state
  const [analyticsData, setAnalyticsData] = useState({
    overallStats: {},
    archetypePerformance: [],
    contextualPerformance: {},
    playstyleAnalysis: {},
    skillProgression: {},
    metaPositioning: {}
  });

  // Process player data for analytics
  useEffect(() => {
    if (!playerData) return;
    
    // Process overall stats
    const overallStats = processOverallStats(playerData);
    
    // Process archetype performance
    const archetypePerformance = processArchetypePerformance(playerData);
    
    // Process contextual performance
    const contextualPerformance = processContextualPerformance(playerData);
    
    // Process playstyle analysis
    const playstyleAnalysis = processPlaystyleAnalysis(playerData);
    
    // Process skill progression
    const skillProgression = processSkillProgression(playerData, timeRange);
    
    // Process meta positioning
    const metaPositioning = processMetaPositioning(playerData);
    
    setAnalyticsData({
      overallStats,
      archetypePerformance,
      contextualPerformance,
      playstyleAnalysis,
      skillProgression,
      metaPositioning
    });
    
    // Set default selected archetype
    if (archetypePerformance.length > 0 && !selectedArchetype) {
      setSelectedArchetype(archetypePerformance[0].archetype);
    }
  }, [playerData, timeRange]);

  // Draw visualization on canvas
  useEffect(() => {
    if (!canvasRef.current || !analyticsData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw based on active tab
    switch (activeTab) {
      case 'overview':
        drawOverviewChart(ctx, canvas, analyticsData.overallStats);
        break;
      case 'archetypes':
        drawArchetypeChart(ctx, canvas, analyticsData.archetypePerformance, selectedArchetype);
        break;
      case 'contextual':
        drawContextualChart(ctx, canvas, analyticsData.contextualPerformance);
        break;
      case 'playstyle':
        drawPlaystyleChart(ctx, canvas, analyticsData.playstyleAnalysis);
        break;
      case 'progression':
        drawProgressionChart(ctx, canvas, analyticsData.skillProgression);
        break;
      case 'meta':
        drawMetaChart(ctx, canvas, analyticsData.metaPositioning);
        break;
      default:
        drawOverviewChart(ctx, canvas, analyticsData.overallStats);
    }
  }, [activeTab, analyticsData, selectedArchetype, canvasRef]);

  // Process overall stats
  const processOverallStats = (data) => {
    if (!data) return {};
    
    const totalGames = (data.wins || 0) + (data.losses || 0) + (data.draws || 0);
    const winRate = totalGames > 0 ? (data.wins || 0) / totalGames : 0;
    
    return {
      rating: data.rating || 1500,
      uncertainty: data.uncertainty || 350,
      conservativeRating: data.conservativeRating || 1200,
      tier: data.tier || 'bronze',
      division: data.division || 1,
      wins: data.wins || 0,
      losses: data.losses || 0,
      draws: data.draws || 0,
      winRate,
      peakRating: data.peakRating || 1500,
      confidence: 1 - ((data.uncertainty || 350) / 350)
    };
  };

  // Process archetype performance
  const processArchetypePerformance = (data) => {
    if (!data || !data.deckArchetypes) return [];
    
    return data.deckArchetypes.map(deck => ({
      archetype: deck.archetype || 'Unknown',
      gamesPlayed: deck.gamesPlayed || 0,
      winRate: deck.gamesPlayed > 0 ? (deck.wins || 0) / deck.gamesPlayed : 0,
      rating: deck.rating || 1500,
      uncertainty: deck.uncertainty || 350,
      lastPlayed: deck.lastPlayed ? new Date(deck.lastPlayed) : new Date(),
      matchups: Object.entries(deck.matchups || {}).map(([opponent, data]) => ({
        opponent,
        gamesPlayed: data.gamesPlayed || 0,
        winRate: data.winRate || 0
      }))
    })).sort((a, b) => b.gamesPlayed - a.gamesPlayed);
  };

  // Process contextual performance
  const processContextualPerformance = (data) => {
    if (!data || !data.contextualFactors) return {};
    
    return {
      timeOfDay: Object.entries(data.contextualFactors.timeOfDay || {}).map(([hour, data]) => ({
        hour: parseInt(hour),
        gamesPlayed: data.games || 0,
        winRate: data.games > 0 ? (data.wins || 0) / data.games : 0
      })),
      dayOfWeek: Object.entries(data.contextualFactors.dayOfWeek || {}).map(([day, data]) => ({
        day: parseInt(day),
        gamesPlayed: data.games || 0,
        winRate: data.games > 0 ? (data.wins || 0) / data.games : 0
      })),
      sessionLength: Object.entries(data.contextualFactors.sessionLength || {}).map(([bucket, data]) => ({
        lengthMinutes: parseInt(bucket) * 30,
        gamesPlayed: data.games || 0,
        winRate: data.games > 0 ? (data.wins || 0) / data.games : 0
      }))
    };
  };

  // Process playstyle analysis
  const processPlaystyleAnalysis = (data) => {
    if (!data || !data.playstyleFactors) return {};
    
    return {
      factors: {
        aggression: data.playstyleFactors.aggression || 0.5,
        consistency: data.playstyleFactors.consistency || 0.5,
        complexity: data.playstyleFactors.complexity || 0.5,
        adaptability: data.playstyleFactors.adaptability || 0.5,
        riskTaking: data.playstyleFactors.riskTaking || 0.5
      },
      strengths: data.playstyleFactors.strengths || [],
      weaknesses: data.playstyleFactors.weaknesses || [],
      recommendations: data.playstyleFactors.recommendations || []
    };
  };

  // Process skill progression
  const processSkillProgression = (data, timeRange) => {
    if (!data || !data.matchHistory) return {};
    
    // Filter match history by time range
    const now = new Date();
    let cutoffDate;
    
    switch (timeRange) {
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'season':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        cutoffDate = new Date(0); // Beginning of time
        break;
      default:
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to month
    }
    
    const filteredHistory = data.matchHistory
      .filter(match => new Date(match.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate rating progression
    const ratingHistory = filteredHistory.map(match => ({
      date: new Date(match.date),
      rating: match.ratingAfter || 1500,
      uncertainty: match.uncertaintyAfter || 350,
      result: match.gameResult || 'unknown'
    }));
    
    // Calculate skill growth rate
    let skillGrowthRate = 0;
    if (ratingHistory.length >= 2) {
      const firstRating = ratingHistory[0].rating;
      const lastRating = ratingHistory[ratingHistory.length - 1].rating;
      const daysDifference = (ratingHistory[ratingHistory.length - 1].date.getTime() - 
                             ratingHistory[0].date.getTime()) / (24 * 60 * 60 * 1000);
      
      if (daysDifference > 0) {
        skillGrowthRate = (lastRating - firstRating) / daysDifference;
      }
    }
    
    // Calculate win rate over time
    const winRateHistory = [];
    const windowSize = Math.max(5, Math.floor(ratingHistory.length / 10)); // Moving average window
    
    for (let i = windowSize - 1; i < ratingHistory.length; i++) {
      const window = ratingHistory.slice(i - windowSize + 1, i + 1);
      const wins = window.filter(match => match.result === 'win').length;
      const winRate = wins / windowSize;
      
      winRateHistory.push({
        date: ratingHistory[i].date,
        winRate
      });
    }
    
    return {
      ratingHistory,
      winRateHistory,
      skillGrowthRate,
      projectedRating: (data.rating || 1500) + (skillGrowthRate * 30), // Projected 30 days ahead
      timeRange
    };
  };

  // Process meta positioning
  const processMetaPositioning = (data) => {
    if (!data || !data.deckArchetypes) return {};
    
    // Get player's preferred archetypes
    const preferredArchetypes = data.deckArchetypes
      .filter(deck => deck.gamesPlayed >= 5)
      .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
      .slice(0, 3)
      .map(deck => deck.archetype);
    
    // Mock meta data (in a real implementation, this would come from the ranking engine)
    const mockMeta = {
      archetypeFrequency: {
        'Aggro': 0.25,
        'Control': 0.20,
        'Midrange': 0.15,
        'Combo': 0.15,
        'Tempo': 0.15,
        'Ramp': 0.10
      },
      archetypeTrends: {
        'Aggro': 0.05,
        'Control': -0.03,
        'Midrange': 0.01,
        'Combo': 0.02,
        'Tempo': -0.02,
        'Ramp': -0.03
      }
    };
    
    // Calculate positioning for each preferred archetype
    const archetypePositioning = {};
    
    for (const archetype of preferredArchetypes) {
      const matchups = {};
      let overallWinRate = 0;
      let totalWeight = 0;
      
      // Get matchup data from player's deck or from mock data
      const deckData = data.deckArchetypes.find(d => d.archetype === archetype);
      
      for (const metaArchetype in mockMeta.archetypeFrequency) {
        const frequency = mockMeta.archetypeFrequency[metaArchetype];
        
        // Try to get actual matchup data from player history
        let expectedWinRate = 0.5; // Default to 50%
        
        if (deckData && deckData.matchups && deckData.matchups[metaArchetype]) {
          expectedWinRate = deckData.matchups[metaArchetype].winRate;
        } else {
          // Use mock matchup data
          const mockMatchups = {
            'Aggro': { 'Aggro': 0.5, 'Control': 0.65, 'Midrange': 0.55, 'Combo': 0.7, 'Tempo': 0.45, 'Ramp': 0.75 },
            'Control': { 'Aggro': 0.35, 'Control': 0.5, 'Midrange': 0.6, 'Combo': 0.4, 'Tempo': 0.55, 'Ramp': 0.45 },
            'Midrange': { 'Aggro': 0.45, 'Control': 0.4, 'Midrange': 0.5, 'Combo': 0.65, 'Tempo': 0.6, 'Ramp': 0.5 },
            'Combo': { 'Aggro': 0.3, 'Control': 0.6, 'Midrange': 0.35, 'Combo': 0.5, 'Tempo': 0.4, 'Ramp': 0.8 },
            'Tempo': { 'Aggro': 0.55, 'Control': 0.45, 'Midrange': 0.4, 'Combo': 0.6, 'Tempo': 0.5, 'Ramp': 0.65 },
            'Ramp': { 'Aggro': 0.25, 'Control': 0.55, 'Midrange': 0.5, 'Combo': 0.2, 'Tempo': 0.35, 'Ramp': 0.5 }
          };
          
          expectedWinRate = mockMatchups[archetype]?.[metaArchetype] || 0.5;
        }
        
        matchups[metaArchetype] = {
          frequency,
          expectedWinRate,
          trend: mockMeta.archetypeTrends[metaArchetype] || 0
        };
        
        overallWinRate += expectedWinRate * frequency;
        totalWeight += frequency;
      }
      
      // Normalize overall win rate
      if (totalWeight > 0) {
        overallWinRate /= totalWeight;
      }
      
      archetypePositioning[archetype] = {
        matchups,
        overallWinRate,
        metaPosition: overallWinRate > 0.55 ? 'favorable' : 
                     overallWinRate < 0.45 ? 'unfavorable' : 'neutral'
      };
    }
    
    // Generate recommended archetypes
    const recommendedArchetypes = [];
    const allArchetypes = ['Aggro', 'Control', 'Midrange', 'Combo', 'Tempo', 'Ramp'];
    
    for (const archetype of allArchetypes) {
      if (!preferredArchetypes.includes(archetype)) {
        let overallWinRate = 0;
        let totalWeight = 0;
        
        for (const metaArchetype in mockMeta.archetypeFrequency) {
          const frequency = mockMeta.archetypeFrequency[metaArchetype];
          const mockMatchups = {
            'Aggro': { 'Aggro': 0.5, 'Control': 0.65, 'Midrange': 0.55, 'Combo': 0.7, 'Tempo': 0.45, 'Ramp': 0.75 },
            'Control': { 'Aggro': 0.35, 'Control': 0.5, 'Midrange': 0.6, 'Combo': 0.4, 'Tempo': 0.55, 'Ramp': 0.45 },
            'Midrange': { 'Aggro': 0.45, 'Control': 0.4, 'Midrange': 0.5, 'Combo': 0.65, 'Tempo': 0.6, 'Ramp': 0.5 },
            'Combo': { 'Aggro': 0.3, 'Control': 0.6, 'Midrange': 0.35, 'Combo': 0.5, 'Tempo': 0.4, 'Ramp': 0.8 },
            'Tempo': { 'Aggro': 0.55, 'Control': 0.45, 'Midrange': 0.4, 'Combo': 0.6, 'Tempo': 0.5, 'Ramp': 0.65 },
            'Ramp': { 'Aggro': 0.25, 'Control': 0.55, 'Midrange': 0.5, 'Combo': 0.2, 'Tempo': 0.35, 'Ramp': 0.5 }
          };
          
          const expectedWinRate = mockMatchups[archetype]?.[metaArchetype] || 0.5;
          
          overallWinRate += expectedWinRate * frequency;
          totalWeight += frequency;
        }
        
        if (totalWeight > 0) {
          overallWinRate /= totalWeight;
        }
        
        // Get player experience with this archetype
        const deckData = data.deckArchetypes.find(d => d.archetype === archetype);
        const experience = deckData 
          ? { gamesPlayed: deckData.gamesPlayed, winRate: deckData.gamesPlayed > 0 ? deckData.wins / deckData.gamesPlayed : 0 }
          : { gamesPlayed: 0, winRate: 0 };
        
        recommendedArchetypes.push({
          archetype,
          expectedWinRate: overallWinRate,
          metaPosition: overallWinRate > 0.55 ? 'favorable' : 
                       overallWinRate < 0.45 ? 'unfavorable' : 'neutral',
          experience
        });
      }
    }
    
    // Sort recommended archetypes by expected win rate
    recommendedArchetypes.sort((a, b) => b.expectedWinRate - a.expectedWinRate);
    
    return {
      preferredArchetypes,
      archetypePositioning,
      recommendedArchetypes: recommendedArchetypes.slice(0, 3), // Top 3 recommendations
      metaHealth: 0.7, // Mock meta health index
      metaDiversity: 0.8 // Mock meta diversity index
    };
  };

  // Draw overview chart
  const drawOverviewChart = (ctx, canvas, data) => {
    if (!data) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - padding;
    
    // Draw rating gauge
    drawRatingGauge(ctx, centerX, centerY - radius / 2, radius, data.rating, data.uncertainty);
    
    // Draw win rate pie chart
    drawWinRatePie(ctx, centerX, centerY + radius / 2, radius / 2, data.wins, data.losses, data.draws);
    
    // Draw tier badge
    drawTierBadge(ctx, padding + 60, centerY, 60, data.tier, data.division);
    
    // Draw confidence meter
    drawConfidenceMeter(ctx, width - padding - 60, centerY, 60, data.confidence);
  };

  // Draw rating gauge
  const drawRatingGauge = (ctx, x, y, radius, rating, uncertainty) => {
    // Draw gauge background
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI, 2 * Math.PI);
    ctx.stroke();
    
    // Calculate rating position on gauge
    const minRating = 1000;
    const maxRating = 3000;
    const ratingRange = maxRating - minRating;
    const ratingAngle = Math.PI + (rating - minRating) / ratingRange * Math.PI;
    
    // Draw rating arc
    const gradient = ctx.createLinearGradient(x - radius, y, x + radius, y);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.5, '#FFD700');
    gradient.addColorStop(1, '#4ECDC4');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI, ratingAngle);
    ctx.stroke();
    
    // Draw uncertainty range
    ctx.strokeStyle = 'rgba(155, 89, 182, 0.5)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    const lowerAngle = Math.PI + (rating - uncertainty - minRating) / ratingRange * Math.PI;
    const upperAngle = Math.PI + (rating + uncertainty - minRating) / ratingRange * Math.PI;
    ctx.arc(x, y, radius + 5, lowerAngle, upperAngle);
    ctx.stroke();
    
    // Draw rating needle
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + (radius - 15) * Math.cos(ratingAngle),
      y + (radius - 15) * Math.sin(ratingAngle)
    );
    ctx.stroke();
    
    // Draw rating value
    ctx.fillStyle = '#fff';
    ctx.font = '24px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(rating), x, y - 20);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '14px "Open Dyslexic", sans-serif';
    ctx.fillText(`±${Math.round(uncertainty)}`, x, y + 10);
    
    // Draw min/max labels
    ctx.fillStyle = '#ccc';
    ctx.font = '12px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(minRating, x - radius, y + 30);
    
    ctx.textAlign = 'right';
    ctx.fillText(maxRating, x + radius, y + 30);
  };

  // Draw win rate pie chart
  const drawWinRatePie = (ctx, x, y, radius, wins, losses, draws) => {
    const total = wins + losses + draws;
    if (total === 0) return;
    
    const winAngle = wins / total * Math.PI * 2;
    const lossAngle = losses / total * Math.PI * 2;
    const drawAngle = draws / total * Math.PI * 2;
    
    // Draw win slice
    ctx.fillStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, 0, winAngle);
    ctx.closePath();
    ctx.fill();
    
    // Draw loss slice
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, winAngle, winAngle + lossAngle);
    ctx.closePath();
    ctx.fill();
    
    // Draw draw slice
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, winAngle + lossAngle, winAngle + lossAngle + drawAngle);
    ctx.closePath();
    ctx.fill();
    
    // Draw center circle
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x, y, radius / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw win rate text
    ctx.fillStyle = '#fff';
    ctx.font = '20px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(wins / total * 100)}%`, x, y - 10);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px "Open Dyslexic", sans-serif';
    ctx.fillText('Win Rate', x, y + 10);
    
    // Draw legend
    const legendY = y + radius + 30;
    const legendSpacing = 80;
    
    // Win legend
    ctx.fillStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.rect(x - legendSpacing, legendY, 15, 15);
    ctx.fill();
    
    ctx.fillStyle = '#ccc';
    ctx.textAlign = 'left';
    ctx.fillText(`Wins: ${wins}`, x - legendSpacing + 20, legendY + 7);
    
    // Loss legend
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.rect(x, legendY, 15, 15);
    ctx.fill();
    
    ctx.fillStyle = '#ccc';
    ctx.fillText(`Losses: ${losses}`, x + 20, legendY + 7);
    
    // Draw legend
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.rect(x + legendSpacing, legendY, 15, 15);
    ctx.fill();
    
    ctx.fillStyle = '#ccc';
    ctx.fillText(`Draws: ${draws}`, x + legendSpacing + 20, legendY + 7);
  };

  // Draw tier badge
  const drawTierBadge = (ctx, x, y, radius, tier, division) => {
    // Tier colors
    const tierColors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      platinum: '#E5E4E2',
      diamond: '#B9F2FF',
      master: '#FF6B6B',
      grandmaster: '#4ECDC4',
      mythic: '#9B59B6'
    };
    
    const color = tierColors[tier] || '#CD7F32';
    
    // Draw badge background
    const gradient = ctx.createRadialGradient(x, y, radius / 3, x, y, radius);
    gradient.addColorStop(0, '#222');
    gradient.addColorStop(1, '#111');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw badge border
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw tier text
    ctx.fillStyle = color;
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tier.charAt(0).toUpperCase() + tier.slice(1), x, y - 10);
    
    // Draw division
    if (tier !== 'master' && tier !== 'grandmaster' && tier !== 'mythic') {
      ctx.fillStyle = '#fff';
      ctx.font = '20px "Open Dyslexic", sans-serif';
      ctx.fillText(division, x, y + 15);
    }
  };

  // Draw confidence meter
  const drawConfidenceMeter = (ctx, x, y, radius, confidence) => {
    // Draw meter background
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw confidence arc
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (confidence * Math.PI * 2);
    
    const gradient = ctx.createLinearGradient(x - radius, y, x + radius, y);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.5, '#FFD700');
    gradient.addColorStop(1, '#4ECDC4');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(x, y, radius - 5, startAngle, endAngle);
    ctx.stroke();
    
    // Draw confidence text
    ctx.fillStyle = '#fff';
    ctx.font = '20px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(confidence * 100)}%`, x, y - 10);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px "Open Dyslexic", sans-serif';
    ctx.fillText('Confidence', x, y + 10);
  };

  // Draw archetype chart
  const drawArchetypeChart = (ctx, canvas, archetypes, selectedArchetype) => {
    if (!archetypes || archetypes.length === 0) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Find selected archetype data
    const selected = archetypes.find(a => a.archetype === selectedArchetype) || archetypes[0];
    
    // Draw archetype win rates
    const barWidth = chartWidth / archetypes.length;
    const maxGames = Math.max(...archetypes.map(a => a.gamesPlayed));
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Draw 50% win rate line
    ctx.strokeStyle = '#999';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight / 2);
    ctx.lineTo(padding + chartWidth, padding + chartHeight / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw bars
    archetypes.forEach((archetype, i) => {
      const x = padding + i * barWidth;
      const barHeight = chartHeight * archetype.winRate;
      const y = padding + chartHeight - barHeight;
      
      // Calculate bar width based on games played
      const normalizedGames = maxGames > 0 ? archetype.gamesPlayed / maxGames : 0;
      const actualBarWidth = Math.max(10, barWidth - 10) * normalizedGames;
      
      // Draw bar
      ctx.fillStyle = archetype.archetype === selectedArchetype 
        ? '#9B59B6' 
        : (archetype.winRate > 0.5 ? '#4ECDC4' : '#FF6B6B');
      
      ctx.fillRect(x + (barWidth - actualBarWidth) / 2, y, actualBarWidth, barHeight);
      
      // Draw archetype name
      ctx.fillStyle = archetype.archetype === selectedArchetype ? '#fff' : '#ccc';
      ctx.font = '12px "Open Dyslexic", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(archetype.archetype, x + barWidth / 2, padding + chartHeight + 5);
      
      // Draw win rate
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`${Math.round(archetype.winRate * 100)}%`, x + barWidth / 2, y - 5);
    });
    
    // Draw selected archetype details
    if (selected) {
      const detailsY = padding + chartHeight + 30;
      
      ctx.fillStyle = '#fff';
      ctx.font = '16px "Open Dyslexic", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${selected.archetype} Details`, width / 2, detailsY);
      
      ctx.fillStyle = '#ccc';
      ctx.font = '14px "Open Dyslexic", sans-serif';
      ctx.fillText(`Games: ${selected.gamesPlayed} | Rating: ${Math.round(selected.rating)} ±${Math.round(selected.uncertainty)}`, width / 2, detailsY + 25);
      
      // Draw matchups if available
      if (selected.matchups && selected.matchups.length > 0) {
        const matchupsY = detailsY + 50;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('Matchups', width / 2, matchupsY);
        
        // Draw top 3 and bottom 3 matchups
        const sortedMatchups = [...selected.matchups].sort((a, b) => b.winRate - a.winRate);
        const bestMatchups = sortedMatchups.slice(0, 3);
        const worstMatchups = sortedMatchups.slice(-3).reverse();
        
        // Draw best matchups
        ctx.fillStyle = '#4ECDC4';
        ctx.textAlign = 'left';
        ctx.fillText('Best Matchups:', padding, matchupsY + 25);
        
        bestMatchups.forEach((matchup, i) => {
          ctx.fillText(`${matchup.opponent}: ${Math.round(matchup.winRate * 100)}% (${matchup.gamesPlayed} games)`, padding + 20, matchupsY + 50 + i * 20);
        });
        
        // Draw worst matchups
        ctx.fillStyle = '#FF6B6B';
        ctx.textAlign = 'right';
        ctx.fillText('Worst Matchups:', width - padding, matchupsY + 25);
        
        worstMatchups.forEach((matchup, i) => {
          ctx.fillText(`${matchup.opponent}: ${Math.round(matchup.winRate * 100)}% (${matchup.gamesPlayed} games)`, width - padding - 20, matchupsY + 50 + i * 20);
        });
      }
    }
  };

  // Draw contextual chart
  const drawContextualChart = (ctx, canvas, data) => {
    if (!data || !data.timeOfDay) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const chartHeight = (height - 2 * padding - 40) / 2;
    const chartWidth = width - 2 * padding;
    
    // Draw time of day performance
    const timeData = data.timeOfDay;
    const barWidth = chartWidth / 24;
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Draw 50% win rate line
    ctx.strokeStyle = '#999';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight / 2);
    ctx.lineTo(padding + chartWidth, padding + chartHeight / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw time of day bars
    for (let hour = 0; hour < 24; hour++) {
      const hourData = timeData.find(d => d.hour === hour) || { gamesPlayed: 0, winRate: 0.5 };
      const barHeight = chartHeight * hourData.winRate;
      const x = padding + hour * barWidth;
      const y = padding + chartHeight - barHeight;
      
      // Draw bar
      ctx.fillStyle = hourData.winRate > 0.5 ? 'rgba(78, 205, 196, 0.7)' : 'rgba(255, 107, 107, 0.7)';
      ctx.fillRect(x, y, barWidth - 2, barHeight);
      
      // Draw game count indicator (bar width)
      const maxGames = Math.max(...timeData.map(d => d.gamesPlayed));
      const normalizedGames = maxGames > 0 ? hourData.gamesPlayed / maxGames : 0;
      const gameWidth = Math.max(1, (barWidth - 4) * normalizedGames);
      
      ctx.fillStyle = 'rgba(155, 89, 182, 0.9)';
      ctx.fillRect(x + (barWidth - gameWidth) / 2, y, gameWidth, barHeight);
    }
    
    // Draw hour labels
    ctx.fillStyle = '#ccc';
    ctx.font = '10px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    for (let hour = 0; hour < 24; hour += 3) {
      const x = padding + hour * barWidth + barWidth / 2;
      ctx.fillText(`${hour}:00`, x, padding + chartHeight + 5);
    }
    
    // Draw title
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Performance by Time of Day', width / 2, padding - 20);
    
    // Draw day of week performance
    const dayData = data.dayOfWeek;
    const dayY = padding + chartHeight + 40;
    const dayBarWidth = chartWidth / 7;
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, dayY);
    ctx.lineTo(padding, dayY + chartHeight);
    ctx.lineTo(padding + chartWidth, dayY + chartHeight);
    ctx.stroke();
    
    // Draw 50% win rate line
    ctx.strokeStyle = '#999';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, dayY + chartHeight / 2);
    ctx.lineTo(padding + chartWidth, dayY + chartHeight / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw day of week bars
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let day = 0; day < 7; day++) {
      const dayInfo = dayData.find(d => d.day === day) || { gamesPlayed: 0, winRate: 0.5 };
      const barHeight = chartHeight * dayInfo.winRate;
      const x = padding + day * dayBarWidth;
      const y = dayY + chartHeight - barHeight;
      
      // Draw bar
      ctx.fillStyle = dayInfo.winRate > 0.5 ? 'rgba(78, 205, 196, 0.7)' : 'rgba(255, 107, 107, 0.7)';
      ctx.fillRect(x, y, dayBarWidth - 2, barHeight);
      
      // Draw game count indicator (bar width)
      const maxGames = Math.max(...dayData.map(d => d.gamesPlayed));
      const normalizedGames = maxGames > 0 ? dayInfo.gamesPlayed / maxGames : 0;
      const gameWidth = Math.max(1, (dayBarWidth - 4) * normalizedGames);
      
      ctx.fillStyle = 'rgba(155, 89, 182, 0.9)';
      ctx.fillRect(x + (dayBarWidth - gameWidth) / 2, y, gameWidth, barHeight);
      
      // Draw day name
      ctx.fillStyle = '#ccc';
      ctx.font = '12px "Open Dyslexic", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(dayNames[day], x + dayBarWidth / 2, dayY + chartHeight + 5);
    }
    
    // Draw title
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Performance by Day of Week', width / 2, dayY - 20);
    
    // Draw legend
    ctx.fillStyle = '#ccc';
    ctx.font = '12px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Bar height = Win rate', padding, height - 20);
    ctx.fillText('Bar width = Games played', padding + 150, height - 20);
  };

  // Draw playstyle chart
  const drawPlaystyleChart = (ctx, canvas, data) => {
    if (!data || !data.factors) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - padding;
    
    // Draw radar chart background
    const factorKeys = Object.keys(data.factors);
    const numFactors = factorKeys.length;
    const angleStep = (Math.PI * 2) / numFactors;
    
    // Draw radar grid
    ctx.strokeStyle = '#444';
    ctx.fillStyle = 'rgba(30, 30, 40, 0.5)';
    
    // Draw concentric circles
    for (let i = 1; i <= 5; i++) {
      const levelRadius = radius * (i / 5);
      ctx.beginPath();
      ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw factor lines
    factorKeys.forEach((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.stroke();
    });
    
    // Draw factor labels
    ctx.fillStyle = '#ccc';
    ctx.font = '14px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    factorKeys.forEach((factor, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = radius + 20;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      
      // Adjust text alignment based on position
      if (angle < -Math.PI / 4 && angle > -3 * Math.PI / 4) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
      } else if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
      } else if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
      } else {
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
      }
      
      ctx.fillText(formatFactorName(factor), x, y);
    });
    
    // Draw factor values
    ctx.fillStyle = 'rgba(155, 89, 182, 0.5)';
    ctx.strokeStyle = '#9B59B6';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    factorKeys.forEach((factor, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = data.factors[factor];
      const valueRadius = radius * value;
      
      const x = centerX + valueRadius * Math.cos(angle);
      const y = centerY + valueRadius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw factor points
    ctx.fillStyle = '#9B59B6';
    factorKeys.forEach((factor, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = data.factors[factor];
      const valueRadius = radius * value;
      
      const x = centerX + valueRadius * Math.cos(angle);
      const y = centerY + valueRadius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw value text
      ctx.fillStyle = '#fff';
      ctx.font = '12px "Open Dyslexic", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const textRadius = valueRadius + 15;
      const textX = centerX + textRadius * Math.cos(angle);
      const textY = centerY + textRadius * Math.sin(angle);
      
      ctx.fillText(`${Math.round(value * 100)}%`, textX, textY);
    });
    
    // Draw strengths and weaknesses
    const strengthsY = centerY + radius + 40;
    const weaknessesY = strengthsY + 60;
    
    // Draw strengths
    ctx.fillStyle = '#4ECDC4';
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Strengths', centerX, strengthsY);
    
    if (data.strengths && data.strengths.length > 0) {
      ctx.font = '14px "Open Dyslexic", sans-serif';
      ctx.fillText(data.strengths.map(formatFactorName).join(', '), centerX, strengthsY + 25);
    } else {
      ctx.fillStyle = '#ccc';
      ctx.font = '14px "Open Dyslexic", sans-serif';
      ctx.fillText('No significant strengths identified', centerX, strengthsY + 25);
    }
    
    // Draw weaknesses
    ctx.fillStyle = '#FF6B6B';
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.fillText('Weaknesses', centerX, weaknessesY);
    
    if (data.weaknesses && data.weaknesses.length > 0) {
      ctx.font = '14px "Open Dyslexic", sans-serif';
      ctx.fillText(data.weaknesses.map(formatFactorName).join(', '), centerX, weaknessesY + 25);
    } else {
      ctx.fillStyle = '#ccc';
      ctx.font = '14px "Open Dyslexic", sans-serif';
      ctx.fillText('No significant weaknesses identified', centerX, weaknessesY + 25);
    }
  };

  // Draw progression chart
  const drawProgressionChart = (ctx, canvas, data) => {
    if (!data || !data.ratingHistory || data.ratingHistory.length === 0) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const chartHeight = height - 2 * padding;
    const chartWidth = width - 2 * padding;
    
    const ratingHistory = data.ratingHistory;
    const winRateHistory = data.winRateHistory || [];
    
    // Find min and max values
    const minDate = ratingHistory[0].date;
    const maxDate = ratingHistory[ratingHistory.length - 1].date;
    const minRating = Math.min(...ratingHistory.map(r => r.rating - r.uncertainty));
    const maxRating = Math.max(...ratingHistory.map(r => r.rating + r.uncertainty));
    const ratingRange = maxRating - minRating;
    
    // Scale functions
    const scaleX = (date) => {
      const timeRange = maxDate.getTime() - minDate.getTime();
      return padding + ((date.getTime() - minDate.getTime()) / timeRange) * chartWidth;
    };
    
    const scaleRatingY = (rating) => {
      return padding + chartHeight - ((rating - minRating) / ratingRange) * chartHeight;
    };
    
    const scaleWinRateY = (winRate) => {
      return padding + chartHeight - winRate * chartHeight;
    };
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Draw rating uncertainty area
    ctx.fillStyle = 'rgba(155, 89, 182, 0.2)';
    ctx.beginPath();
    
    // Draw upper bound
    ratingHistory.forEach((point, i) => {
      const x = scaleX(point.date);
      const y = scaleRatingY(point.rating + point.uncertainty);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // Draw lower bound (in reverse)
    for (let i = ratingHistory.length - 1; i >= 0; i--) {
      const point = ratingHistory[i];
      const x = scaleX(point.date);
      const y = scaleRatingY(point.rating - point.uncertainty);
      ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Draw rating line
    ctx.strokeStyle = '#9B59B6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    ratingHistory.forEach((point, i) => {
      const x = scaleX(point.date);
      const y = scaleRatingY(point.rating);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw win rate line if available
    if (winRateHistory.length > 0) {
      ctx.strokeStyle = '#4ECDC4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      winRateHistory.forEach((point, i) => {
        const x = scaleX(point.date);
        const y = scaleWinRateY(point.winRate);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }
    
    // Draw 50% win rate line
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, scaleWinRateY(0.5));
    ctx.lineTo(padding + chartWidth, scaleWinRateY(0.5));
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw date labels
    ctx.fillStyle = '#ccc';
    ctx.font = '12px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Draw 3-5 date labels
    const numLabels = Math.min(5, ratingHistory.length);
    const labelStep = Math.max(1, Math.floor(ratingHistory.length / numLabels));
    
    for (let i = 0; i < ratingHistory.length; i += labelStep) {
      const point = ratingHistory[i];
      const x = scaleX(point.date);
      ctx.fillText(formatDate(point.date), x, padding + chartHeight + 5);
    }
    
    // Draw rating labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    const ratingStep = 200;
    const minLabelRating = Math.floor(minRating / ratingStep) * ratingStep;
    const maxLabelRating = Math.ceil(maxRating / ratingStep) * ratingStep;
    
    for (let rating = minLabelRating; rating <= maxLabelRating; rating += ratingStep) {
      const y = scaleRatingY(rating);
      ctx.fillText(rating.toString(), padding - 10, y);
    }
    
    // Draw win rate labels on the right
    ctx.textAlign = 'left';
    
    for (let winRate = 0; winRate <= 1; winRate += 0.25) {
      const y = scaleWinRateY(winRate);
      ctx.fillText(`${Math.round(winRate * 100)}%`, padding + chartWidth + 10, y);
    }
    
    // Draw legend
    const legendY = padding - 20;
    
    // Rating legend
    ctx.fillStyle = '#9B59B6';
    ctx.beginPath();
    ctx.rect(padding, legendY, 15, 15);
    ctx.fill();
    
    ctx.fillStyle = '#ccc';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Rating', padding + 20, legendY + 7);
    
    // Win rate legend
    ctx.fillStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.rect(padding + 100, legendY, 15, 15);
    ctx.fill();
    
    ctx.fillStyle = '#ccc';
    ctx.fillText('Win Rate', padding + 120, legendY + 7);
    
    // Draw title
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Skill Progression (${formatTimeRange(data.timeRange)})`, width / 2, padding - 30);
    
    // Draw skill growth rate
    const growthY = height - 20;
    ctx.fillStyle = data.skillGrowthRate > 0 ? '#4ECDC4' : '#FF6B6B';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Skill Growth Rate: ${data.skillGrowthRate > 0 ? '+' : ''}${Math.round(data.skillGrowthRate * 10) / 10} points/day`,
      width / 2,
      growthY
    );
    
    // Draw projected rating
    if (data.projectedRating) {
      ctx.fillStyle = '#FFD700';
      ctx.fillText(
        `Projected Rating (30 days): ${Math.round(data.projectedRating)}`,
        width / 2,
        growthY - 20
      );
    }
  };

  // Draw meta chart
  const drawMetaChart = (ctx, canvas, data) => {
    if (!data || !data.archetypePositioning) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const chartHeight = height - 2 * padding - 100;
    const chartWidth = width - 2 * padding;
    
    // Draw meta positioning chart
    const preferredArchetypes = data.preferredArchetypes || [];
    const positioning = data.archetypePositioning || {};
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Draw frequency axis (y) and win rate axis (x)
    ctx.fillStyle = '#ccc';
    ctx.font = '12px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Expected Win Rate', padding + chartWidth / 2, padding + chartHeight + 5);
    
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('Meta Frequency', padding - 10, padding + chartHeight / 2);
    
    // Draw 50% win rate line
    ctx.strokeStyle = '#999';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding + chartWidth / 2, padding);
    ctx.lineTo(padding + chartWidth / 2, padding + chartHeight);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw meta archetypes
    const metaArchetypes = [];
    
    // Collect all meta archetypes from positioning data
    for (const archetype in positioning) {
      const archetypeData = positioning[archetype];
      
      for (const metaArchetype in archetypeData.matchups) {
        if (!metaArchetypes.includes(metaArchetype)) {
          metaArchetypes.push(metaArchetype);
        }
      }
    }
    
    // Draw meta archetype bubbles
    metaArchetypes.forEach((metaArchetype, i) => {
      // Calculate average position across all preferred archetypes
      let totalWinRate = 0;
      let totalFrequency = 0;
      let count = 0;
      
      for (const archetype in positioning) {
        const archetypeData = positioning[archetype];
        const matchup = archetypeData.matchups[metaArchetype];
        
        if (matchup) {
          totalWinRate += matchup.expectedWinRate;
          totalFrequency += matchup.frequency;
          count++;
        }
      }
      
      if (count > 0) {
        const avgWinRate = totalWinRate / count;
        const avgFrequency = totalFrequency / count;
        
        // Scale to chart coordinates
        const x = padding + chartWidth * avgWinRate;
        const y = padding + chartHeight * (1 - avgFrequency);
        
        // Draw bubble
        const bubbleRadius = Math.max(5, Math.min(20, avgFrequency * 40));
        
        ctx.fillStyle = avgWinRate > 0.5 ? 'rgba(78, 205, 196, 0.7)' : 'rgba(255, 107, 107, 0.7)';
        ctx.beginPath();
        ctx.arc(x, y, bubbleRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw archetype name
        ctx.fillStyle = '#fff';
        ctx.font = '10px "Open Dyslexic", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(metaArchetype, x, y);
        
        // Draw trend arrow if available
        const trend = positioning[preferredArchetypes[0]]?.matchups[metaArchetype]?.trend;
        
        if (trend) {
          const arrowLength = 10;
          const arrowX = x;
          const arrowY = y - bubbleRadius - 5;
          
          ctx.strokeStyle = trend > 0 ? '#4ECDC4' : '#FF6B6B';
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          if (trend > 0) {
            // Up arrow
            ctx.moveTo(arrowX, arrowY + arrowLength);
            ctx.lineTo(arrowX, arrowY - arrowLength);
            ctx.lineTo(arrowX - arrowLength / 2, arrowY - arrowLength / 2);
            ctx.moveTo(arrowX, arrowY - arrowLength);
            ctx.lineTo(arrowX + arrowLength / 2, arrowY - arrowLength / 2);
          } else {
            // Down arrow
            ctx.moveTo(arrowX, arrowY - arrowLength);
            ctx.lineTo(arrowX, arrowY + arrowLength);
            ctx.lineTo(arrowX - arrowLength / 2, arrowY + arrowLength / 2);
            ctx.moveTo(arrowX, arrowY + arrowLength);
            ctx.lineTo(arrowX + arrowLength / 2, arrowY + arrowLength / 2);
          }
          
          ctx.stroke();
        }
      }
    });
    
    // Draw preferred archetypes positioning
    const preferredY = padding + chartHeight + 30;
    
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Your Archetypes vs. Meta', width / 2, preferredY);
    
    // Draw preferred archetype stats
    const statsY = preferredY + 30;
    const statsHeight = 60;
    const statsWidth = chartWidth / preferredArchetypes.length;
    
    preferredArchetypes.forEach((archetype, i) => {
      const archetypeData = positioning[archetype];
      if (!archetypeData) return;
      
      const x = padding + i * statsWidth;
      const y = statsY;
      
      // Draw archetype name
      ctx.fillStyle = '#ccc';
      ctx.font = '14px "Open Dyslexic", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(archetype, x + statsWidth / 2, y);
      
      // Draw win rate
      ctx.fillStyle = archetypeData.overallWinRate > 0.5 ? '#4ECDC4' : '#FF6B6B';
      ctx.font = '16px "Open Dyslexic", sans-serif';
      ctx.fillText(`${Math.round(archetypeData.overallWinRate * 100)}%`, x + statsWidth / 2, y + 25);
      
      // Draw position
      ctx.fillStyle = archetypeData.metaPosition === 'favorable' ? '#4ECDC4' : 
                     archetypeData.metaPosition === 'unfavorable' ? '#FF6B6B' : '#FFD700';
      ctx.font = '12px "Open Dyslexic", sans-serif';
      ctx.fillText(archetypeData.metaPosition, x + statsWidth / 2, y + 50);
    });
    
    // Draw recommended archetypes
    const recommendedY = statsY + statsHeight + 20;
    
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Recommended Archetypes for Current Meta', width / 2, recommendedY);
    
    // Draw recommendations
    const recommendations = data.recommendedArchetypes || [];
    const recY = recommendedY + 30;
    const recWidth = chartWidth / recommendations.length;
    
    recommendations.forEach((rec, i) => {
      const x = padding + i * recWidth;
      const y = recY;
      
      // Draw archetype name
      ctx.fillStyle = '#ccc';
      ctx.font = '14px "Open Dyslexic", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(rec.archetype, x + recWidth / 2, y);
      
      // Draw expected win rate
      ctx.fillStyle = rec.expectedWinRate > 0.5 ? '#4ECDC4' : '#FF6B6B';
      ctx.font = '16px "Open Dyslexic", sans-serif';
      ctx.fillText(`${Math.round(rec.expectedWinRate * 100)}%`, x + recWidth / 2, y + 25);
      
      // Draw experience level
      ctx.fillStyle = '#FFD700';
      ctx.font = '12px "Open Dyslexic", sans-serif';
      ctx.fillText(
        rec.experience ? `Experience: ${rec.experience.experienceLevel}` : 'New archetype',
        x + recWidth / 2,
        y + 50
      );
    });
  };

  // Format factor name for display
  const formatFactorName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Format time range for display
  const formatTimeRange = (range) => {
    switch (range) {
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return 'Last 30 Days';
      case 'season':
        return 'Current Season';
      case 'year':
        return 'Last 12 Months';
      case 'all':
        return 'All Time';
      default:
        return 'Last 30 Days';
    }
  };

  // Render recommendations
  const renderRecommendations = () => {
    if (!analyticsData.playstyleAnalysis || !analyticsData.playstyleAnalysis.recommendations) {
      return null;
    }
    
    const recommendations = analyticsData.playstyleAnalysis.recommendations;
    
    if (recommendations.length === 0) {
      return null;
    }
    
    return (
      <div className="mobile-recommendations esoteric-card">
        <h3 className="esoteric-rune">Improvement Recommendations</h3>
        <ul className="mobile-recommendation-list">
          {recommendations.map((rec, index) => (
            <li key={index} className="mobile-recommendation-item">
              <span className="esoteric-text-accent">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="mobile-performance-analytics">
      <div className="mobile-card-header esoteric-card-header">
        <h2 className="mobile-card-title esoteric-rune">Performance Analytics</h2>
      </div>
      
      <div className="mobile-tabs esoteric-tabs">
        <button
          className={`mobile-tab-button ${activeTab === 'overview' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'archetypes' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('archetypes')}
        >
          Archetypes
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'contextual' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('contextual')}
        >
          Context
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'playstyle' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('playstyle')}
        >
          Playstyle
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'progression' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('progression')}
        >
          Progress
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'meta' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('meta')}
        >
          Meta
        </button>
      </div>
      
      <div className="mobile-visualization-container">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400}
          className="mobile-visualization-canvas"
        />
      </div>
      
      {activeTab === 'archetypes' && analyticsData.archetypePerformance && (
        <div className="mobile-archetype-selector">
          <p className="esoteric-text-muted">Select an archetype:</p>
          <div className="mobile-archetype-buttons">
            {analyticsData.archetypePerformance.map(archetype => (
              <button
                key={archetype.archetype}
                className={`mobile-btn esoteric-btn ${selectedArchetype === archetype.archetype ? 'active esoteric-btn-active' : ''}`}
                onClick={() => setSelectedArchetype(archetype.archetype)}
              >
                {archetype.archetype}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'progression' && (
        <div className="mobile-time-range-selector">
          <p className="esoteric-text-muted">Time range:</p>
          <div className="mobile-time-range-buttons">
            <button
              className={`mobile-btn esoteric-btn ${timeRange === 'week' ? 'active esoteric-btn-active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button
              className={`mobile-btn esoteric-btn ${timeRange === 'month' ? 'active esoteric-btn-active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button
              className={`mobile-btn esoteric-btn ${timeRange === 'season' ? 'active esoteric-btn-active' : ''}`}
              onClick={() => setTimeRange('season')}
            >
              Season
            </button>
            <button
              className={`mobile-btn esoteric-btn ${timeRange === 'year' ? 'active esoteric-btn-active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
            <button
              className={`mobile-btn esoteric-btn ${timeRange === 'all' ? 'active esoteric-btn-active' : ''}`}
              onClick={() => setTimeRange('all')}
            >
              All
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'playstyle' && renderRecommendations()}
    </div>
  );
};

export default PlayerPerformanceAnalytics;