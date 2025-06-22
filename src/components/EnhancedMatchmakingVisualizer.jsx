import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

/**
 * Enhanced Matchmaking Visualizer Component
 * Provides visualization of the advanced Bayesian matchmaking system
 */
const EnhancedMatchmakingVisualizer = ({ rankingEngine, matchData }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('rating');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState(null);
  
  // Visualization state
  const [visualizationData, setVisualizationData] = useState({
    ratingDistribution: [],
    matchQualityFactors: {},
    playstyleCompatibility: {},
    contextualFactors: {},
    metaAdaptation: {}
  });

  // Process match data for visualization
  useEffect(() => {
    if (!matchData) return;
    
    // Process rating distribution
    const ratingDistribution = processRatingDistribution(matchData);
    
    // Process match quality factors
    const matchQualityFactors = matchData.matchFactors || {};
    
    // Process playstyle compatibility
    const playstyleCompatibility = matchData.playstyleCompatibility || {};
    
    // Process contextual factors
    const contextualFactors = matchData.contextualFactors || {};
    
    // Process meta adaptation
    const metaAdaptation = matchData.metaAdaptation || {};
    
    setVisualizationData({
      ratingDistribution,
      matchQualityFactors,
      playstyleCompatibility,
      contextualFactors,
      metaAdaptation
    });
  }, [matchData]);

  // Draw visualization on canvas
  useEffect(() => {
    if (!canvasRef.current || !visualizationData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw based on active tab
    switch (activeTab) {
      case 'rating':
        drawRatingDistribution(ctx, canvas, visualizationData.ratingDistribution);
        break;
      case 'factors':
        drawMatchFactors(ctx, canvas, visualizationData.matchQualityFactors);
        break;
      case 'playstyle':
        drawPlaystyleCompatibility(ctx, canvas, visualizationData.playstyleCompatibility);
        break;
      case 'contextual':
        drawContextualFactors(ctx, canvas, visualizationData.contextualFactors);
        break;
      case 'meta':
        drawMetaAdaptation(ctx, canvas, visualizationData.metaAdaptation);
        break;
      default:
        drawRatingDistribution(ctx, canvas, visualizationData.ratingDistribution);
    }
  }, [activeTab, visualizationData, canvasRef]);

  // Process rating distribution data
  const processRatingDistribution = (matchData) => {
    if (!matchData || !matchData.player || !matchData.opponent) {
      return [];
    }
    
    const playerRating = matchData.player.rating || 1500;
    const playerUncertainty = matchData.player.uncertainty || 350;
    const opponentRating = matchData.opponent.rating || 1500;
    const opponentUncertainty = matchData.opponent.uncertainty || 350;
    
    // Generate normal distribution points
    const playerDistribution = generateNormalDistribution(playerRating, playerUncertainty);
    const opponentDistribution = generateNormalDistribution(opponentRating, opponentUncertainty);
    
    return {
      player: playerDistribution,
      opponent: opponentDistribution,
      playerRating,
      playerUncertainty,
      opponentRating,
      opponentUncertainty,
      winProbability: matchData.winProbability || 0.5
    };
  };

  // Generate normal distribution points
  const generateNormalDistribution = (mean, stdDev) => {
    const points = [];
    const range = stdDev * 4; // 4 standard deviations
    
    for (let x = mean - range; x <= mean + range; x += range / 50) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      points.push({ x, y });
    }
    
    return points;
  };

  // Draw rating distribution
  const drawRatingDistribution = (ctx, canvas, data) => {
    if (!data || !data.player || !data.opponent) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Find min and max x values
    const allPoints = [...data.player, ...data.opponent];
    const minX = Math.min(...allPoints.map(p => p.x));
    const maxX = Math.max(...allPoints.map(p => p.x));
    const maxY = Math.max(...allPoints.map(p => p.y));
    
    // Scale functions
    const scaleX = (x) => padding + ((x - minX) / (maxX - minX)) * (width - 2 * padding);
    const scaleY = (y) => height - padding - (y / maxY) * (height - 2 * padding);
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw player distribution
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.player.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(scaleX(point.x), scaleY(point.y));
      } else {
        ctx.lineTo(scaleX(point.x), scaleY(point.y));
      }
    });
    ctx.stroke();
    
    // Fill player distribution
    ctx.fillStyle = 'rgba(78, 205, 196, 0.2)';
    ctx.beginPath();
    data.player.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(scaleX(point.x), scaleY(point.y));
      } else {
        ctx.lineTo(scaleX(point.x), scaleY(point.y));
      }
    });
    ctx.lineTo(scaleX(data.player[data.player.length - 1].x), scaleY(0));
    ctx.lineTo(scaleX(data.player[0].x), scaleY(0));
    ctx.closePath();
    ctx.fill();
    
    // Draw opponent distribution
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.opponent.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(scaleX(point.x), scaleY(point.y));
      } else {
        ctx.lineTo(scaleX(point.x), scaleY(point.y));
      }
    });
    ctx.stroke();
    
    // Fill opponent distribution
    ctx.fillStyle = 'rgba(255, 107, 107, 0.2)';
    ctx.beginPath();
    data.opponent.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(scaleX(point.x), scaleY(point.y));
      } else {
        ctx.lineTo(scaleX(point.x), scaleY(point.y));
      }
    });
    ctx.lineTo(scaleX(data.opponent[data.opponent.length - 1].x), scaleY(0));
    ctx.lineTo(scaleX(data.opponent[0].x), scaleY(0));
    ctx.closePath();
    ctx.fill();
    
    // Draw player rating line
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(scaleX(data.playerRating), height - padding);
    ctx.lineTo(scaleX(data.playerRating), padding);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw opponent rating line
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(scaleX(data.opponentRating), height - padding);
    ctx.lineTo(scaleX(data.opponentRating), padding);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw win probability
    const midPoint = (data.playerRating + data.opponentRating) / 2;
    ctx.fillStyle = '#9B59B6';
    ctx.font = '14px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Win Probability: ${Math.round(data.winProbability * 100)}%`, scaleX(midPoint), padding - 10);
    
    // Draw labels
    ctx.fillStyle = '#4ECDC4';
    ctx.textAlign = 'center';
    ctx.fillText(`You: ${Math.round(data.playerRating)} ±${Math.round(data.playerUncertainty)}`, scaleX(data.playerRating), height - padding + 20);
    
    ctx.fillStyle = '#FF6B6B';
    ctx.fillText(`Opponent: ${Math.round(data.opponentRating)} ±${Math.round(data.opponentUncertainty)}`, scaleX(data.opponentRating), height - padding + 40);
  };

  // Draw match factors
  const drawMatchFactors = (ctx, canvas, factors) => {
    if (!factors || Object.keys(factors).length === 0) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - padding;
    
    // Draw radar chart background
    const factorKeys = Object.keys(factors);
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
    ctx.font = '12px "Open Dyslexic", sans-serif';
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
      const value = factors[factor];
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
      const value = factors[factor];
      const valueRadius = radius * value;
      
      const x = centerX + valueRadius * Math.cos(angle);
      const y = centerY + valueRadius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw overall match quality
    const overallQuality = Object.values(factors).reduce((sum, val) => sum + val, 0) / numFactors;
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Match Quality: ${Math.round(overallQuality * 100)}%`, centerX, centerY - radius - 30);
  };

  // Draw playstyle compatibility
  const drawPlaystyleCompatibility = (ctx, canvas, data) => {
    if (!data || !data.player || !data.opponent) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const barHeight = 30;
    const barSpacing = 50;
    const startY = padding;
    
    // Draw playstyle factors
    const factors = [
      { name: 'Aggression', player: data.player.aggression, opponent: data.opponent.aggression },
      { name: 'Consistency', player: data.player.consistency, opponent: data.opponent.consistency },
      { name: 'Complexity', player: data.player.complexity, opponent: data.opponent.complexity },
      { name: 'Adaptability', player: data.player.adaptability, opponent: data.opponent.adaptability },
      { name: 'Risk Taking', player: data.player.riskTaking, opponent: data.opponent.riskTaking }
    ];
    
    // Draw factor bars
    factors.forEach((factor, i) => {
      const y = startY + i * barSpacing;
      
      // Draw factor name
      ctx.fillStyle = '#ccc';
      ctx.font = '14px "Open Dyslexic", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(factor.name, padding - 10, y);
      
      // Draw player bar
      const playerBarWidth = (width - 2 * padding) * factor.player;
      ctx.fillStyle = '#4ECDC4';
      ctx.fillRect(padding, y - barHeight / 2, playerBarWidth, barHeight / 2);
      
      // Draw opponent bar
      const opponentBarWidth = (width - 2 * padding) * factor.opponent;
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(padding, y, opponentBarWidth, barHeight / 2);
      
      // Draw labels
      ctx.fillStyle = '#4ECDC4';
      ctx.textAlign = 'left';
      ctx.fillText(`You: ${Math.round(factor.player * 100)}%`, padding + playerBarWidth + 10, y - barHeight / 4);
      
      ctx.fillStyle = '#FF6B6B';
      ctx.fillText(`Opponent: ${Math.round(factor.opponent * 100)}%`, padding + opponentBarWidth + 10, y + barHeight / 4);
    });
    
    // Draw compatibility score
    const compatibility = data.compatibility || 0.5;
    const compatY = startY + factors.length * barSpacing + 30;
    
    ctx.fillStyle = '#9B59B6';
    ctx.textAlign = 'center';
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.fillText(`Playstyle Compatibility: ${Math.round(compatibility * 100)}%`, width / 2, compatY);
    
    // Draw compatibility bar
    const compatBarWidth = (width - 2 * padding) * compatibility;
    const compatBarY = compatY + 20;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(padding, compatBarY, width - 2 * padding, barHeight);
    
    ctx.fillStyle = '#9B59B6';
    ctx.fillRect(padding, compatBarY, compatBarWidth, barHeight);
    
    // Draw advantage indicator
    const advantage = data.advantage || 0;
    const advantageY = compatBarY + barHeight + 30;
    
    ctx.fillStyle = '#ccc';
    ctx.textAlign = 'center';
    ctx.fillText('Playstyle Advantage', width / 2, advantageY);
    
    // Draw advantage scale
    const scaleWidth = width - 2 * padding;
    const scaleY = advantageY + 20;
    const centerX = padding + scaleWidth / 2;
    
    // Draw scale line
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, scaleY);
    ctx.lineTo(padding + scaleWidth, scaleY);
    ctx.stroke();
    
    // Draw center line
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, scaleY - 10);
    ctx.lineTo(centerX, scaleY + 10);
    ctx.stroke();
    
    // Draw advantage marker
    const markerX = centerX + (advantage * scaleWidth / 2);
    ctx.fillStyle = advantage > 0 ? '#4ECDC4' : '#FF6B6B';
    ctx.beginPath();
    ctx.arc(markerX, scaleY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw advantage labels
    ctx.fillStyle = '#FF6B6B';
    ctx.textAlign = 'left';
    ctx.fillText('Opponent Advantage', padding, scaleY + 25);
    
    ctx.fillStyle = '#4ECDC4';
    ctx.textAlign = 'right';
    ctx.fillText('Your Advantage', padding + scaleWidth, scaleY + 25);
    
    // Draw advantage value
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(Math.abs(Math.round(advantage * 100)) + '%', markerX, scaleY - 20);
  };

  // Draw contextual factors
  const drawContextualFactors = (ctx, canvas, data) => {
    if (!data || Object.keys(data).length === 0) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const chartHeight = height - 2 * padding;
    const chartWidth = width - 2 * padding;
    
    // Draw time of day performance
    if (data.timeOfDay) {
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
      
      // Draw bars
      for (let hour = 0; hour < 24; hour++) {
        const hourData = timeData[hour] || { winRate: 0.5, games: 0 };
        const barHeight = chartHeight * hourData.winRate;
        const x = padding + hour * barWidth;
        const y = padding + chartHeight - barHeight;
        
        // Draw bar
        ctx.fillStyle = hourData.winRate > 0.5 ? 'rgba(78, 205, 196, 0.7)' : 'rgba(255, 107, 107, 0.7)';
        ctx.fillRect(x, y, barWidth - 2, barHeight);
        
        // Draw game count indicator (bar width)
        const maxGames = Math.max(...Object.values(timeData).map(d => d.games || 0));
        const normalizedGames = maxGames > 0 ? (hourData.games || 0) / maxGames : 0;
        const gameWidth = Math.max(1, (barWidth - 4) * normalizedGames);
        
        ctx.fillStyle = 'rgba(155, 89, 182, 0.9)';
        ctx.fillRect(x + (barWidth - gameWidth) / 2, y, gameWidth, barHeight);
      }
      
      // Draw hour labels
      ctx.fillStyle = '#ccc';
      ctx.font = '10px "Open Dyslexic", sans-serif';
      ctx.textAlign = 'center';
      
      for (let hour = 0; hour < 24; hour += 3) {
        const x = padding + hour * barWidth + barWidth / 2;
        ctx.fillText(`${hour}:00`, x, padding + chartHeight + 15);
      }
      
      // Draw title
      ctx.fillStyle = '#fff';
      ctx.font = '16px "Open Dyslexic", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Performance by Time of Day', width / 2, padding - 20);
      
      // Draw legend
      ctx.fillStyle = '#ccc';
      ctx.font = '12px "Open Dyslexic", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Bar height = Win rate', padding, padding - 20);
      ctx.fillText('Bar width = Games played', padding + 150, padding - 20);
    }
  };

  // Draw meta adaptation
  const drawMetaAdaptation = (ctx, canvas, data) => {
    if (!data || !data.archetypes || data.archetypes.length === 0) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const chartHeight = height - 2 * padding;
    const chartWidth = width - 2 * padding;
    
    // Sort archetypes by frequency
    const sortedArchetypes = [...data.archetypes].sort((a, b) => b.frequency - a.frequency);
    const barWidth = chartWidth / sortedArchetypes.length;
    
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
    sortedArchetypes.forEach((archetype, i) => {
      const x = padding + i * barWidth;
      
      // Draw frequency bar
      const freqHeight = chartHeight * archetype.frequency;
      const freqY = padding + chartHeight - freqHeight;
      
      ctx.fillStyle = 'rgba(155, 89, 182, 0.5)';
      ctx.fillRect(x, freqY, barWidth - 2, freqHeight);
      
      // Draw win rate marker
      const winRateY = padding + chartHeight * (1 - archetype.winRate);
      
      ctx.fillStyle = archetype.winRate > 0.5 ? '#4ECDC4' : '#FF6B6B';
      ctx.beginPath();
      ctx.arc(x + barWidth / 2, winRateY, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw trend arrow
      if (archetype.trend) {
        const arrowLength = 10;
        const arrowX = x + barWidth / 2;
        const arrowY = freqY - 15;
        
        ctx.strokeStyle = archetype.trend > 0 ? '#4ECDC4' : '#FF6B6B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        if (archetype.trend > 0) {
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
    });
    
    // Draw archetype labels
    ctx.fillStyle = '#ccc';
    ctx.font = '10px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    sortedArchetypes.forEach((archetype, i) => {
      const x = padding + i * barWidth + barWidth / 2;
      ctx.fillText(archetype.name, x, padding + chartHeight + 5);
    });
    
    // Draw title
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('Meta Adaptation', width / 2, padding - 20);
    
    // Draw legend
    ctx.fillStyle = '#ccc';
    ctx.font = '12px "Open Dyslexic", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Bar height = Frequency', padding, padding - 20);
    ctx.fillText('Dot position = Win rate', padding + 150, padding - 20);
    ctx.fillText('Arrow = Trend', padding + 300, padding - 20);
  };

  // Format factor name for display
  const formatFactorName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  // Render match details
  const renderMatchDetails = () => {
    if (!matchData) return null;
    
    return (
      <div className="mobile-match-details esoteric-card">
        <h3 className="esoteric-rune">Match Details</h3>
        
        <div className="mobile-match-stats">
          <div className="mobile-stat-group">
            <span className="mobile-stat-label esoteric-text-muted">Match Quality:</span>
            <span className="mobile-stat-value esoteric-text-accent">
              {Math.round((matchData.matchQuality || 0.5) * 100)}%
            </span>
          </div>
          
          <div className="mobile-stat-group">
            <span className="mobile-stat-label esoteric-text-muted">Win Probability:</span>
            <span className="mobile-stat-value esoteric-text-accent">
              {Math.round((matchData.winProbability || 0.5) * 100)}%
            </span>
          </div>
          
          <div className="mobile-stat-group">
            <span className="mobile-stat-label esoteric-text-muted">Rating Difference:</span>
            <span className="mobile-stat-value esoteric-text-accent">
              {matchData.player && matchData.opponent 
                ? Math.abs(Math.round((matchData.player.rating || 1500) - (matchData.opponent.rating || 1500)))
                : 0}
            </span>
          </div>
          
          <div className="mobile-stat-group">
            <span className="mobile-stat-label esoteric-text-muted">Playstyle Compatibility:</span>
            <span className="mobile-stat-value esoteric-text-accent">
              {Math.round((matchData.playstyleCompatibility?.compatibility || 0.5) * 100)}%
            </span>
          </div>
        </div>
        
        {selectedFactor && (
          <div className="mobile-factor-details">
            <h4 className="esoteric-rune">{formatFactorName(selectedFactor)} Details</h4>
            <p className="esoteric-text-muted">
              {getFactorDescription(selectedFactor)}
            </p>
            <p className="esoteric-text-accent">
              Value: {Math.round((matchData.matchFactors?.[selectedFactor] || 0.5) * 100)}%
            </p>
          </div>
        )}
      </div>
    );
  };

  // Get factor description
  const getFactorDescription = (factor) => {
    const descriptions = {
      skill: "How closely matched the players are in skill level.",
      uncertainty: "How similar the confidence levels are in both players' ratings.",
      playstyle: "How well the players' playstyles complement each other.",
      deckMatchup: "How balanced the deck archetype matchup is.",
      metaDiversity: "How this match contributes to meta diversity.",
      timeOfDay: "How well both players perform at this time of day.",
      recentPerformance: "How similar the players' recent performance has been."
    };
    
    return descriptions[factor] || "No description available.";
  };

  return (
    <div className="mobile-matchmaking-visualizer">
      <div className="mobile-card-header esoteric-card-header">
        <h2 className="mobile-card-title esoteric-rune">Matchmaking Visualizer</h2>
        <button 
          className="mobile-btn-icon esoteric-btn-icon"
          onClick={() => setShowDetails(!showDetails)}
          aria-label={showDetails ? "Hide details" : "Show details"}
        >
          {showDetails ? "−" : "+"}
        </button>
      </div>
      
      <div className="mobile-tabs esoteric-tabs">
        <button
          className={`mobile-tab-button ${activeTab === 'rating' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('rating')}
        >
          Rating
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'factors' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('factors')}
        >
          Factors
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'playstyle' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('playstyle')}
        >
          Playstyle
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'contextual' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('contextual')}
        >
          Context
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
      
      {showDetails && renderMatchDetails()}
      
      {activeTab === 'factors' && (
        <div className="mobile-factor-selector">
          <p className="esoteric-text-muted">Select a factor for details:</p>
          <div className="mobile-factor-buttons">
            {matchData && matchData.matchFactors && Object.keys(matchData.matchFactors).map(factor => (
              <button
                key={factor}
                className={`mobile-btn esoteric-btn ${selectedFactor === factor ? 'active esoteric-btn-active' : ''}`}
                onClick={() => setSelectedFactor(factor)}
              >
                {formatFactorName(factor)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMatchmakingVisualizer;