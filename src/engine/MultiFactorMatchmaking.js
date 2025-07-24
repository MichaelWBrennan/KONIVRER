/**
 * Multi-Factor Matchmaking System
 * 
 * This module integrates multiple factors for matchmaking:
 * - Skill rating and confidence bands
 * - Deck archetypes and matchups
 * - Playstyle compatibility
 * - Time-weighted performance
 * - Player preferences
 */

import { 
  calculateTimeWeightedRating, 
  calculatePerformanceMomentum 
} from './TimeWeightedPerformance';

/**
 * Calculate multi-factor match quality score
 * @param {Object} player1 - First player data
 * @param {Object} player2 - Second player data
 * @param {Object} options - Configuration options
 * @returns {Object} Match quality metrics
 */
export function calculateMatchQuality(player1, player2, options = {}) {
  const {
    weights = {
      skill: 0.4,                 // Weight of skill rating similarity
      confidence: 0.15,           // Weight of confidence band similarity
      deckArchetype: 0.15,        // Weight of deck archetype compatibility
      playstyle: 0.15,            // Weight of playstyle compatibility
      momentum: 0.1,              // Weight of momentum compatibility
      preferences: 0.05           // Weight of player preferences
    },
    preferComplementaryPlaystyles = true,  // Whether to prefer complementary playstyles
    preferSimilarConfidence = true,        // Whether to prefer similar confidence bands
    preferBalancedMatchups = true          // Whether to prefer balanced deck matchups
  } = options;
  
  // Calculate skill rating compatibility (0-1, where 1 is perfect match)
  const skillDiff = Math.abs(player1.rating - player2.rating);
  const maxSkillDiff = 400; // Maximum reasonable skill difference
  const skillCompatibility = Math.max(0, 1 - (skillDiff / maxSkillDiff));
  
  // Calculate confidence band compatibility
  const confidenceBandOrder = ['uncertain', 'developing', 'established', 'proven'];
  const confidenceBand1Index = confidenceBandOrder.indexOf(player1.confidenceBand);
  const confidenceBand2Index = confidenceBandOrder.indexOf(player2.confidenceBand);
  const confidenceDiff = Math.abs(confidenceBand1Index - confidenceBand2Index);
  const confidenceCompatibility = preferSimilarConfidence 
    ? Math.max(0, 1 - (confidenceDiff / 3))
    : Math.max(0, confidenceDiff / 3);
  
  // Calculate deck archetype compatibility
  let deckArchetypeCompatibility = 0.5; // Default neutral value
  
  if (player1.deckArchetype && player2.deckArchetype) {
    // If we have matchup data, use it
    if (player1.deckMatchups && player1.deckMatchups[player1.deckArchetype] && 
        player1.deckMatchups[player1.deckArchetype][player2.deckArchetype]) {
      const expectedWinRate = player1.deckMatchups[player1.deckArchetype][player2.deckArchetype];
      // Convert win rate to compatibility (0.5 is perfectly balanced)
      const balanceFactor = 1 - Math.abs(expectedWinRate - 0.5) * 2;
      deckArchetypeCompatibility = preferBalancedMatchups ? balanceFactor : 1 - balanceFactor;
    } else {
      // Basic compatibility based on archetype categories
      const archetypeCategories = {
        'Aggro': 0,
        'Midrange': 1,
        'Control': 2,
        'Combo': 3
      };
      
      const getCategory = (archetype) => {
        for (const [category, value] of Object.entries(archetypeCategories)) {
          if (archetype.includes(category)) return value;
        }
        return 1; // Default to midrange
      };
      
      const category1 = getCategory(player1.deckArchetype);
      const category2 = getCategory(player2.deckArchetype);
      const categoryDiff = Math.abs(category1 - category2);
      
      // Different categories are more interesting matchups
      deckArchetypeCompatibility = categoryDiff > 0 ? 0.8 : 0.6;
    }
  }
  
  // Calculate playstyle compatibility
  let playstyleCompatibility = 0.5; // Default neutral value
  
  if (player1.playstyle && player2.playstyle) {
    // Calculate similarity between playstyles (0-1)
    const playstyleFactors = ['aggression', 'consistency', 'complexity', 'adaptability', 'riskTaking'];
    let totalDiff = 0;
    let factorCount = 0;
    
    playstyleFactors.forEach(factor => {
      if (player1.playstyle[factor] !== undefined && player2.playstyle[factor] !== undefined) {
        totalDiff += Math.abs(player1.playstyle[factor] - player2.playstyle[factor]);
        factorCount++;
      }
    });
    
    const avgDiff = factorCount > 0 ? totalDiff / factorCount : 0;
    const similarity = 1 - avgDiff;
    
    // If we prefer complementary playstyles, invert the similarity
    playstyleCompatibility = preferComplementaryPlaystyles ? 1 - similarity : similarity;
  }
  
  // Calculate momentum compatibility
  let momentumCompatibility = 0.5; // Default neutral value
  
  if (player1.momentum && player2.momentum) {
    // Similar momentum states are less interesting
    const momentumDiff = Math.abs(player1.momentum - player2.momentum);
    momentumCompatibility = momentumDiff;
  }
  
  // Calculate preference compatibility
  let preferenceCompatibility = 0.5; // Default neutral value
  
  if (player1.preferences && player2.preferences) {
    let preferenceScore = 0;
    let preferenceCount = 0;
    
    // Check if player1 prefers player2's deck archetype
    if (player1.preferences.preferredArchetypes && player1.preferences.preferredArchetypes.length > 0 && 
        player2.deckArchetype && player1.preferences.preferredArchetypes.includes(player2.deckArchetype)) {
      preferenceScore += 1;
      preferenceCount += 1;
    }
    
    // Check if player2 prefers player1's deck archetype
    if (player2.preferences.preferredArchetypes && player2.preferences.preferredArchetypes.length > 0 && 
        player1.deckArchetype && player2.preferences.preferredArchetypes.includes(player1.deckArchetype)) {
      preferenceScore += 1;
      preferenceCount += 1;
    }
    
    // Calculate average preference score
    preferenceCompatibility = preferenceCount > 0 ? preferenceScore / preferenceCount : 0.5;
  }
  
  // Calculate weighted match quality score
  const matchQuality = 
    (skillCompatibility * weights.skill) +
    (confidenceCompatibility * weights.confidence) +
    (deckArchetypeCompatibility * weights.deckArchetype) +
    (playstyleCompatibility * weights.playstyle) +
    (momentumCompatibility * weights.momentum) +
    (preferenceCompatibility * weights.preferences);
  
  return {
    overall: matchQuality,
    components: {
      skill: skillCompatibility,
      confidence: confidenceCompatibility,
      deckArchetype: deckArchetypeCompatibility,
      playstyle: playstyleCompatibility,
      momentum: momentumCompatibility,
      preferences: preferenceCompatibility
    }
  };
}

/**
 * Find optimal match for a player from a pool of candidates
 * @param {Object} player - Player data
 * @param {Array} candidates - Array of candidate players
 * @param {Object} options - Configuration options
 * @returns {Object} Best match and quality score
 */
export function findOptimalMatch(player, candidates, options = {}) {
  if (!candidates || candidates.length === 0) {
    return { match: null, quality: 0 };
  }
  
  let bestMatch = null;
  let bestQuality = -1;
  
  candidates.forEach(candidate => {
    // Skip self-matching
    if (candidate.id === player.id) return;
    
    const matchQuality = calculateMatchQuality(player, candidate, options);
    
    if (matchQuality.overall > bestQuality) {
      bestQuality = matchQuality.overall;
      bestMatch = {
        player: candidate,
        quality: matchQuality
      };
    }
  });
  
  return { match: bestMatch, quality: bestQuality };
}

/**
 * Calculate dynamic K-factor based on multiple factors
 * @param {Object} player - Player data
 * @param {Object} match - Match data
 * @param {Object} options - Configuration options
 * @returns {number} Dynamic K-factor
 */
export function calculateDynamicKFactor(player, match, options = {}) {
  const {
    baseKFactor = 32,
    minKFactor = 16,
    maxKFactor = 64,
    tournamentImportanceMultiplier = 1.5,
    highStakesMultiplier = 1.25,
    confidenceMultiplier = 1.2,
    experienceDivisor = 100
  } = options;
  
  let kFactor = baseKFactor;
  
  // Adjust based on match importance
  if (match.isImportant) {
    kFactor *= tournamentImportanceMultiplier;
  }
  
  // Adjust based on match stakes
  if (match.isHighStakes) {
    kFactor *= highStakesMultiplier;
  }
  
  // Adjust based on player confidence band
  const confidenceBandMultipliers = {
    'uncertain': 1.5,    // Higher K-factor for uncertain players
    'developing': 1.2,   // Slightly higher K-factor for developing players
    'established': 1.0,  // Normal K-factor for established players
    'proven': 0.8        // Lower K-factor for proven players
  };
  
  if (player.confidenceBand && confidenceBandMultipliers[player.confidenceBand]) {
    kFactor *= confidenceBandMultipliers[player.confidenceBand];
  }
  
  // Adjust based on player experience
  const experienceLevel = player.matches || 0;
  const experienceMultiplier = Math.max(0.5, 1.0 - (experienceLevel / experienceDivisor));
  kFactor *= experienceMultiplier;
  
  // Ensure K-factor is within bounds
  return Math.min(maxKFactor, Math.max(minKFactor, kFactor));
}

/**
 * Update player data with multi-factor analysis
 * @param {Object} player - Player data
 * @param {Array} matchHistory - Player's match history
 * @returns {Object} Updated player data
 */
export function updatePlayerWithMultiFactorAnalysis(player, matchHistory) {
  if (!player || !matchHistory) return player;
  
  // Calculate time-weighted performance
  const timeWeightedMetrics = calculateTimeWeightedRating(matchHistory);
  const momentumMetrics = calculatePerformanceMomentum(matchHistory);
  
  // Update player data
  return {
    ...player,
    timeWeightedRating: timeWeightedMetrics.rating || player.rating,
    confidence: Math.max(player.confidence || 0, timeWeightedMetrics.confidence || 0),
    momentum: momentumMetrics.momentum,
    trend: momentumMetrics.trend,
    form: {
      shortTermWinRate: momentumMetrics.shortTermWinRate,
      mediumTermWinRate: momentumMetrics.mediumTermWinRate,
      longTermWinRate: momentumMetrics.longTermWinRate,
      recentForm: timeWeightedMetrics.recentForm,
      streakFactor: timeWeightedMetrics.streakFactor
    }
  };
}