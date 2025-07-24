/**
 * Predictive Matchmaking Module
 * 
 * Uses machine learning techniques to predict match quality and outcomes
 */

/**
 * Predict match quality between two players
 * @param {Object} player1 - First player data
 * @param {Object} player2 - Second player data
 * @param {Object} options - Configuration options
 * @returns {Object} Match quality prediction
 */
export function predictMatchQuality(player1, player2, options = {}) {
  // In a real implementation, this would use a trained ML model
  // Here we'll use a simplified heuristic approach
  
  // Calculate base skill difference factor
  const skillDiff = Math.abs(player1.rating - player2.rating);
  const maxSkillDiff = 400;
  const skillFactor = Math.max(0, 1 - (skillDiff / maxSkillDiff));
  
  // Calculate confidence band compatibility
  const confidenceBandOrder = ['uncertain', 'developing', 'established', 'proven'];
  const confidenceBand1Index = confidenceBandOrder.indexOf(player1.confidenceBand);
  const confidenceBand2Index = confidenceBandOrder.indexOf(player2.confidenceBand);
  const confidenceDiff = Math.abs(confidenceBand1Index - confidenceBand2Index);
  const confidenceFactor = Math.max(0, 1 - (confidenceDiff / 3));
  
  // Calculate deck archetype compatibility
  let archetypeFactor = 0.5;
  if (player1.deckArchetype && player2.deckArchetype) {
    // Simple archetype matching (would be more sophisticated in real ML model)
    archetypeFactor = player1.deckArchetype === player2.deckArchetype ? 0.3 : 0.7;
  }
  
  // Calculate playstyle compatibility
  let playstyleFactor = 0.5;
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
    playstyleFactor = options.preferComplementaryPlaystyles ? 1 - similarity : similarity;
  }
  
  // Calculate historical matchup factor
  let historyFactor = 0.5;
  if (player1.matchHistory && player1.matchHistory[player2.id]) {
    const history = player1.matchHistory[player2.id];
    const totalMatches = history.wins + history.losses;
    
    if (totalMatches > 0) {
      const winRate = history.wins / totalMatches;
      // Closer to 50% win rate is better for competitive matches
      historyFactor = 1 - Math.abs(winRate - 0.5) * 2;
    }
  }
  
  // Calculate engagement factor (how likely players are to enjoy the match)
  const engagementFactors = {
    skillFactor: 0.3,
    confidenceFactor: 0.15,
    archetypeFactor: 0.2,
    playstyleFactor: 0.2,
    historyFactor: 0.15
  };
  
  const engagementScore = 
    (skillFactor * engagementFactors.skillFactor) +
    (confidenceFactor * engagementFactors.confidenceFactor) +
    (archetypeFactor * engagementFactors.archetypeFactor) +
    (playstyleFactor * engagementFactors.playstyleFactor) +
    (historyFactor * engagementFactors.historyFactor);
  
  // Calculate competitiveness factor (how close the match is likely to be)
  const winProbability = predictWinProbability(player1, player2);
  const competitivenessFactor = 1 - Math.abs(winProbability - 0.5) * 2;
  
  // Calculate overall match quality
  const matchQuality = (engagementScore * 0.6) + (competitivenessFactor * 0.4);
  
  return {
    quality: matchQuality,
    engagement: engagementScore,
    competitiveness: competitivenessFactor,
    winProbability,
    factors: {
      skill: skillFactor,
      confidence: confidenceFactor,
      archetype: archetypeFactor,
      playstyle: playstyleFactor,
      history: historyFactor
    }
  };
}

/**
 * Predict win probability for player1 against player2
 * @param {Object} player1 - First player data
 * @param {Object} player2 - Second player data
 * @returns {number} Win probability (0-1)
 */
export function predictWinProbability(player1, player2) {
  // In a real implementation, this would use a trained ML model
  // Here we'll use a simplified approach based on TrueSkill/Glicko
  
  const ratingDiff = player1.rating - player2.rating;
  const combinedUncertainty = Math.sqrt(
    Math.pow(player1.uncertainty || 100, 2) + 
    Math.pow(player2.uncertainty || 100, 2)
  );
  
  // Base probability from rating difference
  const baseProbability = 1 / (1 + Math.exp(-ratingDiff / (combinedUncertainty * 0.5)));
  
  // Adjust for deck matchup if available
  let matchupAdjustment = 0;
  if (player1.deckArchetype && player2.deckArchetype && player1.deckMatchups) {
    const matchupData = player1.deckMatchups[player1.deckArchetype]?.[player2.deckArchetype];
    if (matchupData) {
      // Convert matchup win rate to adjustment factor (-0.2 to 0.2)
      matchupAdjustment = (matchupData - 0.5) * 0.4;
    }
  }
  
  // Adjust for player form/momentum
  let momentumAdjustment = 0;
  if (player1.momentum !== undefined && player2.momentum !== undefined) {
    // Momentum difference (-1 to 1) scaled to smaller adjustment
    momentumAdjustment = (player1.momentum - player2.momentum) * 0.05;
  }
  
  // Adjust for experience in high-stakes matches
  let experienceAdjustment = 0;
  if (player1.experienceLevel !== undefined && player2.experienceLevel !== undefined) {
    const experienceDiff = player1.experienceLevel - player2.experienceLevel;
    // Small adjustment for experience difference
    experienceAdjustment = Math.max(-0.05, Math.min(0.05, experienceDiff * 0.001));
  }
  
  // Combine all factors
  let adjustedProbability = baseProbability + matchupAdjustment + momentumAdjustment + experienceAdjustment;
  
  // Ensure probability is between 0 and 1
  return Math.max(0.01, Math.min(0.99, adjustedProbability));
}

/**
 * Predict optimal matchups for a player from a pool of candidates
 * @param {Object} player - Player data
 * @param {Array} candidates - Array of candidate players
 * @param {Object} options - Configuration options
 * @returns {Array} Ranked list of potential matches
 */
export function predictOptimalMatchups(player, candidates, options = {}) {
  if (!candidates || candidates.length === 0) {
    return [];
  }
  
  const {
    minQuality = 0.6,
    maxResults = 10,
    prioritizeEngagement = true
  } = options;
  
  // Calculate match quality for each candidate
  const matches = candidates
    .filter(candidate => candidate.id !== player.id)
    .map(candidate => ({
      player: candidate,
      prediction: predictMatchQuality(player, candidate, options)
    }))
    .filter(match => match.prediction.quality >= minQuality);
  
  // Sort by match quality or engagement based on priority
  if (prioritizeEngagement) {
    matches.sort((a, b) => b.prediction.engagement - a.prediction.engagement);
  } else {
    matches.sort((a, b) => b.prediction.quality - a.prediction.quality);
  }
  
  // Return top matches
  return matches.slice(0, maxResults);
}

/**
 * Predict player churn risk
 * @param {Object} player - Player data
 * @param {Array} recentMatches - Recent match history
 * @returns {Object} Churn prediction
 */
export function predictChurnRisk(player, recentMatches) {
  if (!player || !recentMatches || recentMatches.length === 0) {
    return {
      risk: 0.5,
      confidence: 0,
      factors: {},
      recommendations: []
    };
  }
  
  // Calculate recent win rate
  const recentWins = recentMatches.filter(match => match.result === 'win').length;
  const recentWinRate = recentWins / recentMatches.length;
  
  // Calculate match quality trend
  const matchQualities = recentMatches.map(match => match.quality || 0.5);
  const recentQualityAvg = matchQualities.reduce((sum, q) => sum + q, 0) / matchQualities.length;
  
  // Calculate activity frequency
  const timestamps = recentMatches.map(match => new Date(match.timestamp).getTime());
  timestamps.sort((a, b) => a - b);
  
  let avgTimeBetweenMatches = 0;
  if (timestamps.length > 1) {
    let totalTime = 0;
    for (let i = 1; i < timestamps.length; i++) {
      totalTime += timestamps[i] - timestamps[i-1];
    }
    avgTimeBetweenMatches = totalTime / (timestamps.length - 1);
  }
  
  // Convert to days
  const daysBetweenMatches = avgTimeBetweenMatches / (1000 * 60 * 60 * 24);
  
  // Calculate time since last match
  const lastMatchTime = Math.max(...timestamps);
  const now = Date.now();
  const daysSinceLastMatch = (now - lastMatchTime) / (1000 * 60 * 60 * 24);
  
  // Calculate risk factors
  const winRateFactor = Math.max(0, 1 - recentWinRate * 1.5); // Lower win rate = higher risk
  const qualityFactor = Math.max(0, 1 - recentQualityAvg * 1.2); // Lower quality = higher risk
  const frequencyFactor = Math.min(1, daysBetweenMatches / 7); // More days between matches = higher risk
  const recencyFactor = Math.min(1, daysSinceLastMatch / 14); // More days since last match = higher risk
  
  // Calculate overall risk
  const riskFactors = {
    winRate: { value: winRateFactor, weight: 0.3 },
    matchQuality: { value: qualityFactor, weight: 0.25 },
    frequency: { value: frequencyFactor, weight: 0.2 },
    recency: { value: recencyFactor, weight: 0.25 }
  };
  
  let totalRisk = 0;
  let totalWeight = 0;
  
  Object.values(riskFactors).forEach(factor => {
    totalRisk += factor.value * factor.weight;
    totalWeight += factor.weight;
  });
  
  const overallRisk = totalWeight > 0 ? totalRisk / totalWeight : 0.5;
  
  // Generate recommendations based on highest risk factors
  const recommendations = [];
  
  if (winRateFactor > 0.6) {
    recommendations.push('Provide more balanced matchmaking to improve win rate');
    recommendations.push('Offer skill development resources or coaching');
  }
  
  if (qualityFactor > 0.6) {
    recommendations.push('Improve match quality by refining matchmaking algorithm');
    recommendations.push('Suggest decks or strategies that might be more enjoyable');
  }
  
  if (frequencyFactor > 0.6 || recencyFactor > 0.6) {
    recommendations.push('Send personalized re-engagement notification');
    recommendations.push('Offer special event or incentive to return');
  }
  
  // Calculate confidence based on data quantity
  const confidenceFactor = Math.min(1, recentMatches.length / 20);
  
  return {
    risk: overallRisk,
    confidence: confidenceFactor,
    factors: {
      winRate: winRateFactor,
      matchQuality: qualityFactor,
      frequency: frequencyFactor,
      recency: recencyFactor
    },
    recommendations
  };
}

/**
 * Predict deck performance against the current meta
 * @param {Object} deck - Deck data
 * @param {Array} metaData - Current meta data
 * @returns {Object} Performance prediction
 */
export function predictDeckPerformance(deck, metaData) {
  if (!deck || !metaData || !metaData.archetypes) {
    return {
      overallWinRate: 0.5,
      confidence: 0,
      matchups: {},
      metaPosition: 'Unknown',
      recommendations: []
    };
  }
  
  // Calculate expected win rate against each archetype in the meta
  const matchups = {};
  let weightedWinRate = 0;
  let totalWeight = 0;
  
  metaData.archetypes.forEach(archetype => {
    let expectedWinRate = 0.5; // Default to 50% if no data
    
    // If we have matchup data, use it
    if (deck.matchups && deck.matchups[archetype.name]) {
      expectedWinRate = deck.matchups[archetype.name];
    } else {
      // Otherwise make a prediction based on deck types
      const deckType = getDeckType(deck);
      const archetypeType = getDeckType({ archetype: archetype.name });
      
      expectedWinRate = predictArchetypeMatchup(deckType, archetypeType);
    }
    
    matchups[archetype.name] = {
      winRate: expectedWinRate,
      metaShare: archetype.metaShare,
      weightedImpact: expectedWinRate * archetype.metaShare
    };
    
    weightedWinRate += expectedWinRate * archetype.metaShare;
    totalWeight += archetype.metaShare;
  });
  
  // Calculate overall expected win rate against the meta
  const overallWinRate = totalWeight > 0 ? weightedWinRate / totalWeight : 0.5;
  
  // Determine meta position
  let metaPosition = 'Neutral';
  if (overallWinRate > 0.55) {
    metaPosition = 'Well Positioned';
  } else if (overallWinRate > 0.52) {
    metaPosition = 'Slightly Favored';
  } else if (overallWinRate < 0.45) {
    metaPosition = 'Poorly Positioned';
  } else if (overallWinRate < 0.48) {
    metaPosition = 'Slightly Unfavored';
  }
  
  // Generate recommendations
  const recommendations = [];
  
  // Find worst matchups
  const worstMatchups = Object.entries(matchups)
    .sort(([_, a], [__, b]) => a.winRate - b.winRate)
    .filter(([_, data]) => data.metaShare > 0.05) // Only consider relevant archetypes
    .slice(0, 2);
  
  if (worstMatchups.length > 0) {
    recommendations.push(`Improve against ${worstMatchups[0][0]} by adjusting your strategy or deck composition`);
  }
  
  // Suggest tech cards based on meta
  const topArchetype = Object.entries(matchups)
    .sort(([_, a], [__, b]) => b.metaShare - a.metaShare)[0];
  
  if (topArchetype && topArchetype[1].metaShare > 0.15) {
    recommendations.push(`Consider adding tech cards against ${topArchetype[0]}, the most common archetype`);
  }
  
  // Calculate confidence based on data quality
  const confidenceFactor = Math.min(1, Object.keys(deck.matchups || {}).length / 10);
  
  return {
    overallWinRate,
    confidence: confidenceFactor,
    matchups,
    metaPosition,
    recommendations
  };
}

/**
 * Get deck type from deck data
 * @param {Object} deck - Deck data
 * @returns {string} Deck type
 */
function getDeckType(deck) {
  if (!deck) return 'Unknown';
  
  const archetype = deck.archetype || '';
  
  if (archetype.includes('Aggro')) return 'Aggro';
  if (archetype.includes('Control')) return 'Control';
  if (archetype.includes('Combo')) return 'Combo';
  if (archetype.includes('Midrange')) return 'Midrange';
  if (archetype.includes('Tempo')) return 'Tempo';
  
  return 'Midrange'; // Default
}

/**
 * Predict matchup between two deck types
 * @param {string} deckType1 - First deck type
 * @param {string} deckType2 - Second deck type
 * @returns {number} Expected win rate for deck1
 */
function predictArchetypeMatchup(deckType1, deckType2) {
  // Simple archetype matchup matrix
  // These values would be learned from actual game data in a real ML model
  const matchupMatrix = {
    'Aggro': {
      'Aggro': 0.5,
      'Midrange': 0.4,
      'Control': 0.6,
      'Combo': 0.7,
      'Tempo': 0.55,
      'Unknown': 0.5
    },
    'Midrange': {
      'Aggro': 0.6,
      'Midrange': 0.5,
      'Control': 0.4,
      'Combo': 0.55,
      'Tempo': 0.5,
      'Unknown': 0.5
    },
    'Control': {
      'Aggro': 0.4,
      'Midrange': 0.6,
      'Control': 0.5,
      'Combo': 0.4,
      'Tempo': 0.55,
      'Unknown': 0.5
    },
    'Combo': {
      'Aggro': 0.3,
      'Midrange': 0.45,
      'Control': 0.6,
      'Combo': 0.5,
      'Tempo': 0.4,
      'Unknown': 0.5
    },
    'Tempo': {
      'Aggro': 0.45,
      'Midrange': 0.5,
      'Control': 0.45,
      'Combo': 0.6,
      'Tempo': 0.5,
      'Unknown': 0.5
    },
    'Unknown': {
      'Aggro': 0.5,
      'Midrange': 0.5,
      'Control': 0.5,
      'Combo': 0.5,
      'Tempo': 0.5,
      'Unknown': 0.5
    }
  };
  
  return matchupMatrix[deckType1]?.[deckType2] || 0.5;
}