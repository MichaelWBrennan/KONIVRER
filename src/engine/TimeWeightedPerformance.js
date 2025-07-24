/**
 * Enhanced Time-Weighted Performance System
 * 
 * This module provides functions to calculate time-weighted performance metrics
 * that give more weight to recent matches and incorporate recency bias.
 */

/**
 * Calculate time-weighted rating based on match history
 * @param {Array} matchHistory - Array of match results with timestamps
 * @param {Object} options - Configuration options
 * @returns {Object} Time-weighted performance metrics
 */
export function calculateTimeWeightedRating(matchHistory, options = {}) {
  const {
    decayFactor = 0.95,        // Base decay factor (per day)
    recentWindow = 14,         // Recent window in days
    recentBoost = 1.5,         // Boost factor for very recent matches
    minWeight = 0.1,           // Minimum weight for old matches
    maxDays = 90               // Maximum days to consider
  } = options;
  
  if (!matchHistory || matchHistory.length === 0) {
    return {
      rating: null,
      confidence: 0,
      recentForm: 0,
      streakFactor: 0,
      matchCount: 0
    };
  }
  
  const now = new Date();
  let totalWeight = 0;
  let weightedRatingSum = 0;
  let recentWins = 0;
  let recentMatches = 0;
  let streakDirection = null;
  let currentStreak = 0;
  let maxStreak = 0;
  
  // Sort matches by date (newest first)
  const sortedMatches = [...matchHistory].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  // Calculate weighted sum
  sortedMatches.forEach((match, index) => {
    const matchDate = new Date(match.timestamp);
    const daysDiff = Math.max(0, Math.floor((now - matchDate) / (1000 * 60 * 60 * 24)));
    
    // Skip matches older than maxDays
    if (daysDiff > maxDays) return;
    
    // Calculate time decay weight
    let timeWeight = Math.pow(decayFactor, daysDiff);
    
    // Apply boost for very recent matches
    if (daysDiff < recentWindow) {
      const recentFactor = 1 + (recentBoost - 1) * (1 - daysDiff / recentWindow);
      timeWeight *= recentFactor;
    }
    
    // Ensure minimum weight
    timeWeight = Math.max(minWeight, timeWeight);
    
    // Track recent form (last 10 matches)
    if (index < 10) {
      recentMatches++;
      if (match.result === 'win') {
        recentWins++;
      }
      
      // Track streak
      const isWin = match.result === 'win';
      if (streakDirection === null) {
        streakDirection = isWin;
        currentStreak = 1;
      } else if (streakDirection === isWin) {
        currentStreak++;
      } else {
        streakDirection = isWin;
        currentStreak = 1;
      }
      
      maxStreak = Math.max(maxStreak, currentStreak);
    }
    
    // Add to weighted sum
    weightedRatingSum += match.rating * timeWeight;
    totalWeight += timeWeight;
  });
  
  // Calculate time-weighted rating
  const timeWeightedRating = totalWeight > 0 ? weightedRatingSum / totalWeight : null;
  
  // Calculate recent form (-1 to 1, where 1 is all wins, -1 is all losses)
  const recentForm = recentMatches > 0 ? (recentWins / recentMatches) * 2 - 1 : 0;
  
  // Calculate streak factor (0 to 1)
  const streakFactor = Math.min(1, maxStreak / 10);
  
  // Calculate confidence based on recency and quantity of matches
  const recencyConfidence = Math.min(1, sortedMatches.length / 20);
  const timeSpanConfidence = Math.min(1, sortedMatches.length > 0 ? 
    Math.min(maxDays, (now - new Date(sortedMatches[sortedMatches.length - 1].timestamp)) / (1000 * 60 * 60 * 24 * maxDays)) : 0);
  
  const confidence = recencyConfidence * 0.7 + timeSpanConfidence * 0.3;
  
  return {
    rating: timeWeightedRating,
    confidence,
    recentForm,
    streakFactor,
    matchCount: sortedMatches.length
  };
}

/**
 * Calculate performance momentum based on recent match results
 * @param {Array} matchHistory - Array of match results with timestamps
 * @param {Object} options - Configuration options
 * @returns {Object} Momentum metrics
 */
export function calculatePerformanceMomentum(matchHistory, options = {}) {
  const {
    shortTermWindow = 5,      // Number of matches for short-term trend
    mediumTermWindow = 15,    // Number of matches for medium-term trend
    longTermWindow = 30       // Number of matches for long-term trend
  } = options;
  
  if (!matchHistory || matchHistory.length === 0) {
    return {
      momentum: 0,
      trend: 'neutral',
      shortTermWinRate: 0,
      mediumTermWinRate: 0,
      longTermWinRate: 0
    };
  }
  
  // Sort matches by date (newest first)
  const sortedMatches = [...matchHistory].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  // Calculate win rates for different time windows
  const calculateWinRate = (matches) => {
    if (matches.length === 0) return 0;
    const wins = matches.filter(m => m.result === 'win').length;
    return wins / matches.length;
  };
  
  const shortTermMatches = sortedMatches.slice(0, shortTermWindow);
  const mediumTermMatches = sortedMatches.slice(0, mediumTermWindow);
  const longTermMatches = sortedMatches.slice(0, longTermWindow);
  
  const shortTermWinRate = calculateWinRate(shortTermMatches);
  const mediumTermWinRate = calculateWinRate(mediumTermMatches);
  const longTermWinRate = calculateWinRate(longTermMatches);
  
  // Calculate momentum (difference between short and long term performance)
  // Range: -1 to 1, where positive values indicate upward momentum
  let momentum = 0;
  
  if (shortTermMatches.length > 0 && longTermMatches.length > 0) {
    momentum = shortTermWinRate - longTermWinRate;
  } else if (shortTermMatches.length > 0 && mediumTermMatches.length > 0) {
    momentum = shortTermWinRate - mediumTermWinRate;
  }
  
  // Determine trend
  let trend = 'neutral';
  if (momentum > 0.15) trend = 'strong_upward';
  else if (momentum > 0.05) trend = 'upward';
  else if (momentum < -0.15) trend = 'strong_downward';
  else if (momentum < -0.05) trend = 'downward';
  
  return {
    momentum,
    trend,
    shortTermWinRate,
    mediumTermWinRate,
    longTermWinRate
  };
}

/**
 * Adjust rating based on time-weighted performance
 * @param {number} baseRating - Base rating
 * @param {Object} timeWeightedMetrics - Time-weighted performance metrics
 * @param {Object} options - Configuration options
 * @returns {number} Adjusted rating
 */
export function adjustRatingWithTimeWeight(baseRating, timeWeightedMetrics, options = {}) {
  const {
    momentumWeight = 0.1,     // Weight of momentum in rating adjustment
    formWeight = 0.05,        // Weight of recent form in rating adjustment
    streakWeight = 0.05       // Weight of streak in rating adjustment
  } = options;
  
  if (!timeWeightedMetrics) return baseRating;
  
  const { momentum = 0, recentForm = 0, streakFactor = 0 } = timeWeightedMetrics;
  
  // Calculate adjustment factors
  const momentumAdjustment = momentum * momentumWeight * 100; // Scale to rating points
  const formAdjustment = recentForm * formWeight * 50;        // Scale to rating points
  const streakAdjustment = streakFactor * streakWeight * 30;  // Scale to rating points
  
  // Apply adjustments
  return baseRating + momentumAdjustment + formAdjustment + streakAdjustment;
}

/**
 * Get player form description based on momentum and recent performance
 * @param {Object} timeWeightedMetrics - Time-weighted performance metrics
 * @returns {Object} Form description
 */
export function getPlayerFormDescription(timeWeightedMetrics) {
  if (!timeWeightedMetrics) {
    return {
      status: 'unknown',
      description: 'Not enough data',
      icon: '❓'
    };
  }
  
  const { momentum, trend, recentForm, streakFactor } = timeWeightedMetrics;
  
  // Determine form status
  let status = 'neutral';
  let description = 'Stable performance';
  let icon = '➡️';
  
  if (trend === 'strong_upward') {
    status = 'hot';
    description = 'On fire! Performing exceptionally well';
    icon = '🔥';
  } else if (trend === 'upward') {
    status = 'improving';
    description = 'Improving performance';
    icon = '📈';
  } else if (trend === 'strong_downward') {
    status = 'slumping';
    description = 'In a slump';
    icon = '📉';
  } else if (trend === 'downward') {
    status = 'declining';
    description = 'Performance declining';
    icon = '⬇️';
  }
  
  // Adjust based on streak
  if (streakFactor > 0.5 && recentForm > 0.5) {
    status = 'hot_streak';
    description = 'On a hot streak!';
    icon = '🔥';
  } else if (streakFactor > 0.5 && recentForm < -0.5) {
    status = 'cold_streak';
    description = 'On a cold streak';
    icon = '❄️';
  }
  
  return {
    status,
    description,
    icon
  };
}