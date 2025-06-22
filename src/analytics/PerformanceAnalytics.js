/**
 * Performance Analytics Module
 * 
 * Provides advanced analytics functions for player performance
 */

/**
 * Calculate skill decomposition
 * @param {Array} matchHistory - Player's match history
 * @param {Object} options - Configuration options
 * @returns {Object} Skill decomposition metrics
 */
export function calculateSkillDecomposition(matchHistory, options = {}) {
  if (!matchHistory || matchHistory.length === 0) {
    return {
      technicalPlay: 0.5,
      deckBuilding: 0.5,
      adaptability: 0.5,
      mentalGame: 0.5,
      consistency: 0.5
    };
  }
  
  // Extract performance metrics from match history
  const technicalMetrics = matchHistory.map(match => match.metrics?.technicalPlay || 0.5);
  const deckBuildingMetrics = matchHistory.map(match => match.metrics?.deckBuilding || 0.5);
  const adaptabilityMetrics = matchHistory.map(match => match.metrics?.adaptability || 0.5);
  const mentalGameMetrics = matchHistory.map(match => match.metrics?.mentalGame || 0.5);
  
  // Calculate average metrics
  const technicalPlay = calculateWeightedAverage(technicalMetrics);
  const deckBuilding = calculateWeightedAverage(deckBuildingMetrics);
  const adaptability = calculateWeightedAverage(adaptabilityMetrics);
  const mentalGame = calculateWeightedAverage(mentalGameMetrics);
  
  // Calculate consistency (inverse of standard deviation)
  const results = matchHistory.map(match => match.result === 'win' ? 1 : 0);
  const consistency = 1 - calculateStandardDeviation(results);
  
  return {
    technicalPlay,
    deckBuilding,
    adaptability,
    mentalGame,
    consistency
  };
}

/**
 * Calculate weighted average
 * @param {Array} values - Array of values
 * @param {Array} weights - Array of weights (optional)
 * @returns {number} Weighted average
 */
function calculateWeightedAverage(values, weights = null) {
  if (!values || values.length === 0) return 0.5;
  
  if (!weights) {
    // If no weights provided, use recency weighting
    weights = values.map((_, index) => Math.pow(0.9, values.length - index - 1));
  }
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const weightedSum = values.reduce((sum, value, index) => sum + value * weights[index], 0);
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
}

/**
 * Calculate standard deviation
 * @param {Array} values - Array of values
 * @returns {number} Standard deviation
 */
function calculateStandardDeviation(values) {
  if (!values || values.length <= 1) return 0;
  
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / values.length;
  
  return Math.sqrt(variance);
}

/**
 * Identify critical decision points
 * @param {Array} gameData - Detailed game data
 * @returns {Array} Critical decision points
 */
export function identifyCriticalDecisionPoints(gameData) {
  if (!gameData || !gameData.turns) return [];
  
  const criticalPoints = [];
  
  // Analyze each turn for critical decisions
  gameData.turns.forEach((turn, turnIndex) => {
    // Calculate turn impact (how much this turn affected win probability)
    const prevWinProb = turnIndex > 0 ? gameData.turns[turnIndex - 1].winProbability : 0.5;
    const currentWinProb = turn.winProbability;
    const impact = Math.abs(currentWinProb - prevWinProb);
    
    // If impact is significant, this is a critical turn
    if (impact > 0.15) {
      criticalPoints.push({
        turn: turnIndex + 1,
        impact,
        description: turn.description || `Turn ${turnIndex + 1}`,
        winProbabilityBefore: prevWinProb,
        winProbabilityAfter: currentWinProb,
        actions: turn.actions || []
      });
    }
    
    // Also check individual actions within the turn
    if (turn.actions) {
      turn.actions.forEach((action, actionIndex) => {
        if (action.winProbabilityChange && Math.abs(action.winProbabilityChange) > 0.1) {
          criticalPoints.push({
            turn: turnIndex + 1,
            action: actionIndex + 1,
            impact: Math.abs(action.winProbabilityChange),
            description: action.description || `Turn ${turnIndex + 1}, Action ${actionIndex + 1}`,
            winProbabilityBefore: action.winProbabilityBefore || null,
            winProbabilityAfter: action.winProbabilityAfter || null
          });
        }
      });
    }
  });
  
  // Sort by impact (descending)
  return criticalPoints.sort((a, b) => b.impact - a.impact);
}

/**
 * Calculate performance variance
 * @param {Array} matchHistory - Player's match history
 * @returns {Object} Variance metrics
 */
export function calculatePerformanceVariance(matchHistory) {
  if (!matchHistory || matchHistory.length < 5) {
    return {
      overallVariance: 0,
      shortTermVariance: 0,
      longTermTrend: 0,
      consistencyScore: 0.5,
      performanceStability: 'Unknown'
    };
  }
  
  // Convert match results to numerical values (1 for win, 0 for loss)
  const results = matchHistory.map(match => match.result === 'win' ? 1 : 0);
  
  // Calculate overall variance
  const overallVariance = calculateStandardDeviation(results);
  
  // Calculate short-term variance (last 10 matches)
  const recentResults = results.slice(0, Math.min(10, results.length));
  const shortTermVariance = calculateStandardDeviation(recentResults);
  
  // Calculate long-term trend (slope of linear regression)
  const longTermTrend = calculateTrendSlope(results);
  
  // Calculate consistency score (inverse of variance, normalized to 0-1)
  const consistencyScore = Math.max(0, Math.min(1, 1 - overallVariance));
  
  // Determine performance stability
  let performanceStability = 'Moderate';
  if (consistencyScore > 0.8) {
    performanceStability = 'Very Stable';
  } else if (consistencyScore > 0.6) {
    performanceStability = 'Stable';
  } else if (consistencyScore < 0.3) {
    performanceStability = 'Highly Volatile';
  } else if (consistencyScore < 0.5) {
    performanceStability = 'Volatile';
  }
  
  return {
    overallVariance,
    shortTermVariance,
    longTermTrend,
    consistencyScore,
    performanceStability
  };
}

/**
 * Calculate trend slope using linear regression
 * @param {Array} values - Array of values
 * @returns {number} Slope of trend line
 */
function calculateTrendSlope(values) {
  if (!values || values.length <= 1) return 0;
  
  const n = values.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  
  const sumX = indices.reduce((sum, x) => sum + x, 0);
  const sumY = values.reduce((sum, y) => sum + y, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
  const sumXX = indices.reduce((sum, x) => sum + x * x, 0);
  
  // Calculate slope of linear regression line
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  return slope;
}

/**
 * Predict metagame cycles
 * @param {Array} metaData - Historical meta data
 * @returns {Object} Meta predictions
 */
export function predictMetaCycles(metaData) {
  if (!metaData || metaData.length === 0) {
    return {
      risingArchetypes: [],
      decliningArchetypes: [],
      stableArchetypes: [],
      predictedTopArchetype: null,
      metaHealthIndex: 0.5,
      diversityTrend: 'Neutral'
    };
  }
  
  // Get current meta snapshot
  const currentMeta = metaData[metaData.length - 1];
  
  // Get previous meta snapshot for comparison
  const previousMeta = metaData.length > 1 ? metaData[metaData.length - 2] : null;
  
  // Calculate trends for each archetype
  const archetypeTrends = {};
  
  currentMeta.archetypes.forEach(archetype => {
    const name = archetype.name;
    const currentShare = archetype.metaShare;
    
    // Find archetype in previous meta
    const previousArchetype = previousMeta?.archetypes.find(a => a.name === name);
    const previousShare = previousArchetype?.metaShare || 0;
    
    // Calculate trend
    const trend = currentShare - previousShare;
    
    archetypeTrends[name] = {
      name,
      currentShare,
      previousShare,
      trend,
      winRate: archetype.winRate || 0.5
    };
  });
  
  // Identify rising, declining, and stable archetypes
  const risingArchetypes = Object.values(archetypeTrends)
    .filter(a => a.trend > 0.02)
    .sort((a, b) => b.trend - a.trend);
  
  const decliningArchetypes = Object.values(archetypeTrends)
    .filter(a => a.trend < -0.02)
    .sort((a, b) => a.trend - b.trend);
  
  const stableArchetypes = Object.values(archetypeTrends)
    .filter(a => Math.abs(a.trend) <= 0.02)
    .sort((a, b) => b.currentShare - a.currentShare);
  
  // Predict top archetype for next meta
  // Consider both current share and trend
  const predictedTopArchetype = Object.values(archetypeTrends)
    .sort((a, b) => (b.currentShare + b.trend * 2) - (a.currentShare + a.trend * 2))[0];
  
  // Calculate meta health index (0-1, higher is healthier)
  // Based on diversity and win rate balance
  const archetypes = currentMeta.archetypes;
  const metaShareSum = archetypes.reduce((sum, a) => sum + Math.pow(a.metaShare, 2), 0);
  const herfindahlIndex = metaShareSum; // Measure of concentration (higher = less diverse)
  
  const winRateDeviation = calculateStandardDeviation(archetypes.map(a => a.winRate || 0.5));
  
  const diversityScore = 1 - herfindahlIndex;
  const balanceScore = 1 - winRateDeviation * 2; // Lower deviation = better balance
  
  const metaHealthIndex = (diversityScore * 0.6) + (balanceScore * 0.4);
  
  // Determine diversity trend
  let diversityTrend = 'Neutral';
  if (previousMeta) {
    const previousShareSum = previousMeta.archetypes.reduce((sum, a) => sum + Math.pow(a.metaShare, 2), 0);
    const previousDiversity = 1 - previousShareSum;
    
    if (diversityScore > previousDiversity + 0.05) {
      diversityTrend = 'Increasing';
    } else if (diversityScore < previousDiversity - 0.05) {
      diversityTrend = 'Decreasing';
    }
  }
  
  return {
    risingArchetypes: risingArchetypes.map(a => ({
      name: a.name,
      trend: a.trend,
      share: a.currentShare,
      winRate: a.winRate
    })),
    decliningArchetypes: decliningArchetypes.map(a => ({
      name: a.name,
      trend: a.trend,
      share: a.currentShare,
      winRate: a.winRate
    })),
    stableArchetypes: stableArchetypes.map(a => ({
      name: a.name,
      share: a.currentShare,
      winRate: a.winRate
    })),
    predictedTopArchetype: predictedTopArchetype ? {
      name: predictedTopArchetype.name,
      projectedShare: Math.min(0.3, predictedTopArchetype.currentShare + predictedTopArchetype.trend * 2),
      confidence: calculatePredictionConfidence(metaData, predictedTopArchetype.name)
    } : null,
    metaHealthIndex,
    diversityTrend
  };
}

/**
 * Calculate prediction confidence
 * @param {Array} metaData - Historical meta data
 * @param {string} archetypeName - Archetype name
 * @returns {number} Confidence score (0-1)
 */
function calculatePredictionConfidence(metaData, archetypeName) {
  if (!metaData || metaData.length < 3) return 0.5;
  
  // More historical data = higher confidence
  const historyFactor = Math.min(1, metaData.length / 10);
  
  // Check consistency of archetype's presence in meta
  let appearanceCount = 0;
  metaData.forEach(meta => {
    if (meta.archetypes.some(a => a.name === archetypeName)) {
      appearanceCount++;
    }
  });
  
  const consistencyFactor = appearanceCount / metaData.length;
  
  // Calculate trend stability
  const trends = [];
  for (let i = 1; i < metaData.length; i++) {
    const currentArchetype = metaData[i].archetypes.find(a => a.name === archetypeName);
    const previousArchetype = metaData[i-1].archetypes.find(a => a.name === archetypeName);
    
    if (currentArchetype && previousArchetype) {
      trends.push(currentArchetype.metaShare - previousArchetype.metaShare);
    }
  }
  
  const trendStability = 1 - (calculateStandardDeviation(trends) * 5);
  
  // Combine factors
  return (historyFactor * 0.3) + (consistencyFactor * 0.3) + (Math.max(0, trendStability) * 0.4);
}

/**
 * Detect personal weaknesses
 * @param {Array} matchHistory - Player's match history
 * @returns {Object} Weakness analysis
 */
export function detectPersonalWeaknesses(matchHistory) {
  if (!matchHistory || matchHistory.length < 5) {
    return {
      weakArchetypes: [],
      weakMatchupPatterns: [],
      skillGaps: {},
      recommendedFocus: null
    };
  }
  
  // Group matches by opponent archetype
  const archetypePerformance = {};
  
  matchHistory.forEach(match => {
    if (!match.opponentDeckArchetype) return;
    
    const archetype = match.opponentDeckArchetype;
    if (!archetypePerformance[archetype]) {
      archetypePerformance[archetype] = {
        wins: 0,
        losses: 0,
        total: 0
      };
    }
    
    archetypePerformance[archetype].total++;
    if (match.result === 'win') {
      archetypePerformance[archetype].wins++;
    } else {
      archetypePerformance[archetype].losses++;
    }
  });
  
  // Calculate win rates and identify weak matchups
  const archetypeWinRates = {};
  Object.entries(archetypePerformance).forEach(([archetype, data]) => {
    if (data.total >= 3) { // Minimum sample size
      archetypeWinRates[archetype] = data.wins / data.total;
    }
  });
  
  const weakArchetypes = Object.entries(archetypeWinRates)
    .filter(([_, winRate]) => winRate < 0.4)
    .sort(([_, winRateA], [__, winRateB]) => winRateA - winRateB)
    .map(([archetype, winRate]) => ({
      archetype,
      winRate,
      games: archetypePerformance[archetype].total
    }));
  
  // Identify patterns in losses
  const lossPatterns = {};
  matchHistory.filter(match => match.result !== 'win').forEach(match => {
    // Check for patterns in game length
    const gameLengthCategory = categorizeGameLength(match.turns || 0);
    lossPatterns[gameLengthCategory] = (lossPatterns[gameLengthCategory] || 0) + 1;
    
    // Check for patterns in opponent play style
    if (match.opponentPlaystyle) {
      const playstyle = categorizePlaystyle(match.opponentPlaystyle);
      lossPatterns[playstyle] = (lossPatterns[playstyle] || 0) + 1;
    }
    
    // Check for patterns in game phase
    if (match.lossReason) {
      lossPatterns[match.lossReason] = (lossPatterns[match.lossReason] || 0) + 1;
    }
  });
  
  // Sort patterns by frequency
  const weakMatchupPatterns = Object.entries(lossPatterns)
    .sort(([_, countA], [__, countB]) => countB - countA)
    .filter(([_, count]) => count >= 3)
    .map(([pattern, count]) => ({
      pattern,
      frequency: count,
      percentage: count / matchHistory.filter(match => match.result !== 'win').length
    }));
  
  // Analyze skill gaps
  const skillMetrics = matchHistory.map(match => match.metrics || {});
  const skillGaps = {};
  
  if (skillMetrics.length > 0) {
    const skillCategories = ['technicalPlay', 'deckBuilding', 'adaptability', 'mentalGame', 'consistency'];
    
    skillCategories.forEach(skill => {
      const values = skillMetrics.map(metrics => metrics[skill] || 0.5);
      skillGaps[skill] = 1 - calculateWeightedAverage(values);
    });
  }
  
  // Determine recommended focus area
  let recommendedFocus = null;
  
  if (weakArchetypes.length > 0) {
    recommendedFocus = `Practice against ${weakArchetypes[0].archetype} decks`;
  } else if (Object.keys(skillGaps).length > 0) {
    const worstSkill = Object.entries(skillGaps)
      .sort(([_, gapA], [__, gapB]) => gapB - gapA)[0];
    
    if (worstSkill[1] > 0.3) {
      recommendedFocus = `Improve ${formatSkillName(worstSkill[0])}`;
    }
  }
  
  return {
    weakArchetypes,
    weakMatchupPatterns,
    skillGaps,
    recommendedFocus
  };
}

/**
 * Categorize game length
 * @param {number} turns - Number of turns
 * @returns {string} Game length category
 */
function categorizeGameLength(turns) {
  if (turns <= 5) return 'Early Game Losses';
  if (turns <= 10) return 'Mid Game Losses';
  return 'Late Game Losses';
}

/**
 * Categorize playstyle
 * @param {Object} playstyle - Playstyle metrics
 * @returns {string} Playstyle category
 */
function categorizePlaystyle(playstyle) {
  if (playstyle.aggression > 0.7) return 'Aggressive Opponents';
  if (playstyle.complexity > 0.7) return 'Complex Decks';
  if (playstyle.consistency > 0.7) return 'Consistent Opponents';
  return 'Balanced Opponents';
}

/**
 * Format skill name for display
 * @param {string} skillName - Skill name in camelCase
 * @returns {string} Formatted skill name
 */
function formatSkillName(skillName) {
  return skillName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}