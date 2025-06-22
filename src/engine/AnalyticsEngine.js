/**
 * Advanced Analytics Engine for KONIVRER
 * Implements card synergy analysis, decision point identification,
 * performance variance analysis, metagame cycle prediction, and personalized weakness detection
 */
export class AnalyticsEngine {
  constructor(options = {}) {
    this.options = {
      enableCardSynergyAnalysis: true,
      enableDecisionPointIdentification: true,
      enablePerformanceVarianceAnalysis: true,
      enableMetagameCyclePrediction: true,
      enablePersonalizedWeaknessDetection: true,
      ...options
    };
    
    // Initialize data structures
    this.cardSynergies = new Map();
    this.decisionPoints = new Map();
    this.performanceVariance = new Map();
    this.metagameCycles = [];
    this.playerWeaknesses = new Map();
    
    // Analysis parameters
    this.parameters = {
      // Card synergy analysis
      minSynergyConfidence: 0.6,
      minSynergySupport: 5,
      maxSynergyDistance: 3,
      
      // Decision point identification
      significantWinrateChange: 0.15,
      minDecisionSamples: 10,
      
      // Performance variance
      varianceWindowSize: 20,
      highVarianceThreshold: 0.2,
      lowVarianceThreshold: 0.05,
      
      // Metagame cycle prediction
      cycleDetectionWindow: 90, // days
      minCycleLength: 14, // days
      maxCycleLength: 60, // days
      
      // Weakness detection
      weaknessThreshold: 0.4, // win rate below this is a weakness
      strengthThreshold: 0.6, // win rate above this is a strength
      minMatchesForWeakness: 5
    };
  }
  
  /**
   * Card Synergy Analysis
   * Identifies unexpected card combinations that perform well together
   */
  analyzeCardSynergies(decks, matchResults) {
    if (!this.options.enableCardSynergyAnalysis) return [];
    
    // Initialize card pair data
    const cardPairs = new Map();
    const cardWinrates = new Map();
    const cardCounts = new Map();
    
    // Process each deck and its match results
    decks.forEach(deck => {
      const deckId = deck.id;
      const cards = deck.cards || [];
      const deckMatches = matchResults.filter(match => 
        match.deckId === deckId || match.opponentDeckId === deckId
      );
      
      // Skip decks with no matches
      if (deckMatches.length === 0) return;
      
      // Calculate win rate for this deck
      const wins = deckMatches.filter(match => 
        (match.deckId === deckId && match.result === 'win') ||
        (match.opponentDeckId === deckId && match.result === 'loss')
      ).length;
      
      const deckWinRate = wins / deckMatches.length;
      
      // Count cards and track their win rates
      cards.forEach(card => {
        // Update card count
        cardCounts.set(card.id, (cardCounts.get(card.id) || 0) + 1);
        
        // Update card win rate (weighted by number of matches)
        const currentWinData = cardWinrates.get(card.id) || { wins: 0, matches: 0 };
        cardWinrates.set(card.id, {
          wins: currentWinData.wins + (wins),
          matches: currentWinData.matches + deckMatches.length
        });
        
        // Analyze card pairs (for synergy)
        cards.forEach(otherCard => {
          if (card.id === otherCard.id) return; // Skip same card
          
          const pairKey = [card.id, otherCard.id].sort().join('_');
          const currentPairData = cardPairs.get(pairKey) || { 
            count: 0, 
            wins: 0, 
            matches: 0,
            card1: card.id,
            card2: otherCard.id
          };
          
          cardPairs.set(pairKey, {
            ...currentPairData,
            count: currentPairData.count + 1,
            wins: currentPairData.wins + wins,
            matches: currentPairData.matches + deckMatches.length
          });
        });
      });
    });
    
    // Calculate individual card win rates
    const individualWinRates = new Map();
    cardWinrates.forEach((data, cardId) => {
      if (data.matches >= this.parameters.minSynergySupport) {
        individualWinRates.set(cardId, data.wins / data.matches);
      }
    });
    
    // Calculate synergy scores
    const synergies = [];
    cardPairs.forEach((pairData, pairKey) => {
      // Skip pairs with insufficient data
      if (pairData.matches < this.parameters.minSynergySupport) return;
      
      const pairWinRate = pairData.wins / pairData.matches;
      const card1WinRate = individualWinRates.get(pairData.card1) || 0.5;
      const card2WinRate = individualWinRates.get(pairData.card2) || 0.5;
      
      // Expected win rate if cards were independent
      const expectedWinRate = (card1WinRate + card2WinRate) / 2;
      
      // Synergy score: how much better the pair performs than expected
      const synergyScore = pairWinRate - expectedWinRate;
      
      // Confidence based on sample size
      const confidence = 1 - (1 / Math.sqrt(pairData.matches));
      
      // Only include significant synergies
      if (synergyScore > 0 && confidence >= this.parameters.minSynergyConfidence) {
        synergies.push({
          card1: pairData.card1,
          card2: pairData.card2,
          synergyScore,
          confidence,
          pairWinRate,
          expectedWinRate,
          sampleSize: pairData.matches,
          occurrences: pairData.count
        });
      }
    });
    
    // Sort by synergy score (descending)
    synergies.sort((a, b) => b.synergyScore - a.synergyScore);
    
    // Store results
    this.cardSynergies.clear();
    synergies.forEach(synergy => {
      this.cardSynergies.set(`${synergy.card1}_${synergy.card2}`, synergy);
    });
    
    return synergies;
  }
  
  /**
   * Decision Point Identification
   * Highlights critical turns or decisions that most frequently determine match outcomes
   */
  identifyDecisionPoints(matches) {
    if (!this.options.enableDecisionPointIdentification) return [];
    
    // Group matches by turn count
    const matchesByTurnCount = new Map();
    matches.forEach(match => {
      const turnCount = match.turns?.length || 0;
      if (turnCount === 0) return; // Skip matches without turn data
      
      if (!matchesByTurnCount.has(turnCount)) {
        matchesByTurnCount.set(turnCount, []);
      }
      matchesByTurnCount.get(turnCount).push(match);
    });
    
    // Analyze win rates by turn
    const decisionPoints = [];
    
    matchesByTurnCount.forEach((matchGroup, turnCount) => {
      // Skip groups with insufficient data
      if (matchGroup.length < this.parameters.minDecisionSamples) return;
      
      // Calculate baseline win rate for player 1
      const player1Wins = matchGroup.filter(m => m.result === 'player1').length;
      const baselineWinRate = player1Wins / matchGroup.length;
      
      // Analyze each turn
      for (let turn = 1; turn <= turnCount; turn++) {
        // Get matches where specific actions occurred on this turn
        const actionsOnTurn = new Map();
        
        matchGroup.forEach(match => {
          if (!match.turns || !match.turns[turn - 1]) return;
          
          const turnData = match.turns[turn - 1];
          const actions = turnData.actions || [];
          
          actions.forEach(action => {
            const actionKey = `${action.type}_${action.target || 'none'}`;
            if (!actionsOnTurn.has(actionKey)) {
              actionsOnTurn.set(actionKey, { matches: [], wins: 0 });
            }
            
            actionsOnTurn.get(actionKey).matches.push(match);
            if (match.result === (turnData.player === 'player1' ? 'player1' : 'player2')) {
              actionsOnTurn.get(actionKey).wins++;
            }
          });
        });
        
        // Identify significant actions
        actionsOnTurn.forEach((data, actionKey) => {
          // Skip actions with insufficient data
          if (data.matches.length < this.parameters.minDecisionSamples) return;
          
          const actionWinRate = data.wins / data.matches.length;
          const winRateDifference = Math.abs(actionWinRate - baselineWinRate);
          
          // If this action significantly affects win rate, it's a decision point
          if (winRateDifference >= this.parameters.significantWinrateChange) {
            decisionPoints.push({
              turn,
              action: actionKey,
              winRate: actionWinRate,
              baselineWinRate,
              winRateDifference,
              sampleSize: data.matches.length,
              significance: winRateDifference * Math.sqrt(data.matches.length),
              isPositive: actionWinRate > baselineWinRate
            });
          }
        });
      }
    });
    
    // Sort by significance (descending)
    decisionPoints.sort((a, b) => b.significance - a.significance);
    
    // Store results
    this.decisionPoints.clear();
    decisionPoints.forEach(point => {
      this.decisionPoints.set(`${point.turn}_${point.action}`, point);
    });
    
    return decisionPoints;
  }
  
  /**
   * Performance Variance Analysis
   * Tracks consistency vs. high-variance performance to identify areas for improvement
   */
  analyzePerformanceVariance(players, matches) {
    if (!this.options.enablePerformanceVarianceAnalysis) return [];
    
    const playerVariance = [];
    
    players.forEach(player => {
      // Get matches for this player
      const playerMatches = matches.filter(match => 
        match.player1Id === player.id || match.player2Id === player.id
      );
      
      // Skip players with insufficient matches
      if (playerMatches.length < this.parameters.varianceWindowSize) return;
      
      // Sort matches by date
      const sortedMatches = [...playerMatches].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      // Calculate rolling win rate and variance
      const windowSize = Math.min(this.parameters.varianceWindowSize, sortedMatches.length);
      const rollingStats = [];
      
      for (let i = 0; i <= sortedMatches.length - windowSize; i++) {
        const windowMatches = sortedMatches.slice(i, i + windowSize);
        const windowWins = windowMatches.filter(match => 
          (match.player1Id === player.id && match.result === 'player1') ||
          (match.player2Id === player.id && match.result === 'player2')
        ).length;
        
        const windowWinRate = windowWins / windowSize;
        
        // Calculate variance within this window
        const matchResults = windowMatches.map(match => 
          (match.player1Id === player.id && match.result === 'player1') ||
          (match.player2Id === player.id && match.result === 'player2') ? 1 : 0
        );
        
        const mean = matchResults.reduce((sum, val) => sum + val, 0) / matchResults.length;
        const squaredDiffs = matchResults.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / matchResults.length;
        
        rollingStats.push({
          startMatch: i,
          endMatch: i + windowSize - 1,
          winRate: windowWinRate,
          variance,
          standardDeviation: Math.sqrt(variance)
        });
      }
      
      // Calculate overall stats
      const overallWinRate = rollingStats.reduce((sum, stat) => sum + stat.winRate, 0) / rollingStats.length;
      const overallVariance = rollingStats.reduce((sum, stat) => sum + stat.variance, 0) / rollingStats.length;
      const overallStdDev = Math.sqrt(overallVariance);
      
      // Identify high and low variance periods
      const highVariancePeriods = rollingStats.filter(stat => 
        stat.variance > this.parameters.highVarianceThreshold
      );
      
      const lowVariancePeriods = rollingStats.filter(stat => 
        stat.variance < this.parameters.lowVarianceThreshold
      );
      
      // Analyze deck archetypes during different variance periods
      const highVarianceArchetypes = this.getArchetypesInPeriods(player, sortedMatches, highVariancePeriods);
      const lowVarianceArchetypes = this.getArchetypesInPeriods(player, sortedMatches, lowVariancePeriods);
      
      // Store player variance data
      const playerData = {
        playerId: player.id,
        playerName: player.name,
        overallWinRate,
        overallVariance,
        overallStdDev,
        rollingStats,
        highVariancePeriods,
        lowVariancePeriods,
        highVarianceArchetypes,
        lowVarianceArchetypes,
        consistencyRating: 1 - overallVariance, // Higher is more consistent
        variabilityRating: overallVariance, // Higher is more variable
        matchCount: sortedMatches.length
      };
      
      playerVariance.push(playerData);
      this.performanceVariance.set(player.id, playerData);
    });
    
    // Sort by consistency (descending)
    playerVariance.sort((a, b) => b.consistencyRating - a.consistencyRating);
    
    return playerVariance;
  }
  
  /**
   * Helper method to get archetypes used during specific periods
   */
  getArchetypesInPeriods(player, matches, periods) {
    if (periods.length === 0) return [];
    
    // Collect matches from all periods
    const periodMatches = [];
    periods.forEach(period => {
      for (let i = period.startMatch; i <= period.endMatch; i++) {
        if (matches[i]) periodMatches.push(matches[i]);
      }
    });
    
    // Count archetypes
    const archetypeCounts = {};
    periodMatches.forEach(match => {
      let archetype = null;
      
      if (match.player1Id === player.id && match.player1Deck) {
        archetype = match.player1Deck;
      } else if (match.player2Id === player.id && match.player2Deck) {
        archetype = match.player2Deck;
      }
      
      if (archetype) {
        archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1;
      }
    });
    
    // Convert to array and sort
    return Object.entries(archetypeCounts)
      .map(([archetype, count]) => ({
        archetype,
        count,
        percentage: (count / periodMatches.length) * 100
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * Metagame Cycle Prediction
   * Forecasts meta shifts based on current trends and historical patterns
   */
  predictMetagameCycles(metaSnapshots) {
    if (!this.options.enableMetagameCyclePrediction) return [];
    
    // Ensure we have enough data
    if (metaSnapshots.length < 3) return [];
    
    // Sort snapshots by date
    const sortedSnapshots = [...metaSnapshots].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    // Extract archetype percentages over time
    const archetypeTimeSeries = {};
    
    sortedSnapshots.forEach(snapshot => {
      const date = new Date(snapshot.date);
      
      snapshot.archetypes.forEach(archetype => {
        if (!archetypeTimeSeries[archetype.name]) {
          archetypeTimeSeries[archetype.name] = [];
        }
        
        archetypeTimeSeries[archetype.name].push({
          date,
          percentage: archetype.percentage
        });
      });
    });
    
    // Analyze cycles for each archetype
    const cycles = [];
    
    Object.entries(archetypeTimeSeries).forEach(([archetype, dataPoints]) => {
      // Skip archetypes with insufficient data
      if (dataPoints.length < 5) return;
      
      // Find peaks and troughs
      const peaks = [];
      const troughs = [];
      
      for (let i = 1; i < dataPoints.length - 1; i++) {
        const prev = dataPoints[i - 1].percentage;
        const curr = dataPoints[i].percentage;
        const next = dataPoints[i + 1].percentage;
        
        if (curr > prev && curr > next) {
          peaks.push({ index: i, date: dataPoints[i].date, value: curr });
        } else if (curr < prev && curr < next) {
          troughs.push({ index: i, date: dataPoints[i].date, value: curr });
        }
      }
      
      // Calculate cycle lengths
      const cycleLengths = [];
      
      if (peaks.length >= 2) {
        for (let i = 1; i < peaks.length; i++) {
          const daysBetween = (peaks[i].date - peaks[i - 1].date) / (1000 * 60 * 60 * 24);
          cycleLengths.push(daysBetween);
        }
      }
      
      // Calculate average cycle length
      const avgCycleLength = cycleLengths.length > 0 
        ? cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length 
        : null;
      
      // Only include archetypes with detectable cycles
      if (avgCycleLength && 
          avgCycleLength >= this.parameters.minCycleLength && 
          avgCycleLength <= this.parameters.maxCycleLength) {
        
        // Predict next peak and trough
        let nextPeak = null;
        let nextTrough = null;
        
        if (peaks.length > 0) {
          const lastPeak = peaks[peaks.length - 1];
          const nextPeakDate = new Date(lastPeak.date);
          nextPeakDate.setDate(nextPeakDate.getDate() + avgCycleLength);
          nextPeak = { date: nextPeakDate, value: lastPeak.value };
        }
        
        if (troughs.length > 0) {
          const lastTrough = troughs[troughs.length - 1];
          const nextTroughDate = new Date(lastTrough.date);
          nextTroughDate.setDate(nextTroughDate.getDate() + avgCycleLength);
          nextTrough = { date: nextTroughDate, value: lastTrough.value };
        }
        
        cycles.push({
          archetype,
          peaks,
          troughs,
          cycleLengths,
          avgCycleLength,
          nextPeak,
          nextTrough,
          confidence: this.calculateCycleConfidence(cycleLengths),
          dataPoints
        });
      }
    });
    
    // Sort by confidence (descending)
    cycles.sort((a, b) => b.confidence - a.confidence);
    
    // Store results
    this.metagameCycles = cycles;
    
    return cycles;
  }
  
  /**
   * Calculate confidence in cycle prediction
   */
  calculateCycleConfidence(cycleLengths) {
    if (cycleLengths.length === 0) return 0;
    
    // More cycles = higher confidence
    const cycleCountFactor = Math.min(1, cycleLengths.length / 5);
    
    // More consistent cycle lengths = higher confidence
    const mean = cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length;
    const squaredDiffs = cycleLengths.map(len => Math.pow(len - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / cycleLengths.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / mean;
    const consistencyFactor = Math.max(0, 1 - coefficientOfVariation);
    
    // Combine factors
    return (cycleCountFactor * 0.6) + (consistencyFactor * 0.4);
  }
  
  /**
   * Personalized Weakness Detection
   * Identifies specific matchups or play patterns where a player underperforms
   */
  detectPlayerWeaknesses(player, matches) {
    if (!this.options.enablePersonalizedWeaknessDetection) return { weaknesses: [], strengths: [] };
    
    // Get matches for this player
    const playerMatches = matches.filter(match => 
      match.player1Id === player.id || match.player2Id === player.id
    );
    
    // Skip players with insufficient matches
    if (playerMatches.length < 10) return { weaknesses: [], strengths: [] };
    
    // Calculate overall win rate
    const wins = playerMatches.filter(match => 
      (match.player1Id === player.id && match.result === 'player1') ||
      (match.player2Id === player.id && match.result === 'player2')
    ).length;
    
    const overallWinRate = wins / playerMatches.length;
    
    // Analyze matchups
    const matchupStats = {};
    
    playerMatches.forEach(match => {
      let opponentDeck = null;
      
      if (match.player1Id === player.id) {
        opponentDeck = match.player2Deck;
      } else {
        opponentDeck = match.player1Deck;
      }
      
      if (!opponentDeck) return;
      
      if (!matchupStats[opponentDeck]) {
        matchupStats[opponentDeck] = { matches: 0, wins: 0 };
      }
      
      matchupStats[opponentDeck].matches++;
      
      if ((match.player1Id === player.id && match.result === 'player1') ||
          (match.player2Id === player.id && match.result === 'player2')) {
        matchupStats[opponentDeck].wins++;
      }
    });
    
    // Identify weaknesses and strengths
    const weaknesses = [];
    const strengths = [];
    
    Object.entries(matchupStats).forEach(([archetype, stats]) => {
      // Skip matchups with insufficient data
      if (stats.matches < this.parameters.minMatchesForWeakness) return;
      
      const winRate = stats.wins / stats.matches;
      const winRateDifference = winRate - overallWinRate;
      
      if (winRate < this.parameters.weaknessThreshold) {
        weaknesses.push({
          archetype,
          winRate,
          winRateDifference,
          matches: stats.matches,
          wins: stats.wins,
          severity: (this.parameters.weaknessThreshold - winRate) * Math.sqrt(stats.matches)
        });
      } else if (winRate > this.parameters.strengthThreshold) {
        strengths.push({
          archetype,
          winRate,
          winRateDifference,
          matches: stats.matches,
          wins: stats.wins,
          magnitude: (winRate - this.parameters.strengthThreshold) * Math.sqrt(stats.matches)
        });
      }
    });
    
    // Sort by severity/magnitude
    weaknesses.sort((a, b) => b.severity - a.severity);
    strengths.sort((a, b) => b.magnitude - a.magnitude);
    
    // Analyze play patterns
    const playPatternWeaknesses = this.analyzePlayPatternWeaknesses(player, playerMatches);
    
    // Store results
    const result = {
      playerId: player.id,
      playerName: player.name,
      overallWinRate,
      matchCount: playerMatches.length,
      weaknesses,
      strengths,
      playPatternWeaknesses
    };
    
    this.playerWeaknesses.set(player.id, result);
    
    return result;
  }
  
  /**
   * Analyze play pattern weaknesses
   */
  analyzePlayPatternWeaknesses(player, matches) {
    // Skip if matches don't have detailed play data
    if (!matches.some(m => m.turns && m.turns.length > 0)) return [];
    
    // Extract play patterns
    const patterns = {};
    
    matches.forEach(match => {
      if (!match.turns || match.turns.length === 0) return;
      
      const isPlayer1 = match.player1Id === player.id;
      const playerWon = (isPlayer1 && match.result === 'player1') || 
                        (!isPlayer1 && match.result === 'player2');
      
      // Analyze turns where this player acted
      match.turns.forEach((turn, turnIndex) => {
        if ((isPlayer1 && turn.player === 'player1') || 
            (!isPlayer1 && turn.player === 'player2')) {
          
          const actions = turn.actions || [];
          
          actions.forEach(action => {
            const patternKey = `${turnIndex + 1}_${action.type}_${action.target || 'none'}`;
            
            if (!patterns[patternKey]) {
              patterns[patternKey] = { matches: 0, wins: 0 };
            }
            
            patterns[patternKey].matches++;
            if (playerWon) {
              patterns[patternKey].wins++;
            }
          });
        }
      });
    });
    
    // Identify problematic patterns
    const weakPatterns = [];
    
    Object.entries(patterns).forEach(([pattern, stats]) => {
      // Skip patterns with insufficient data
      if (stats.matches < this.parameters.minMatchesForWeakness) return;
      
      const winRate = stats.wins / stats.matches;
      
      if (winRate < this.parameters.weaknessThreshold) {
        const [turn, actionType, target] = pattern.split('_');
        
        weakPatterns.push({
          turn: parseInt(turn),
          actionType,
          target,
          winRate,
          matches: stats.matches,
          wins: stats.wins,
          severity: (this.parameters.weaknessThreshold - winRate) * Math.sqrt(stats.matches)
        });
      }
    });
    
    // Sort by severity
    weakPatterns.sort((a, b) => b.severity - a.severity);
    
    return weakPatterns;
  }
  
  /**
   * Get card synergy recommendations for a deck
   */
  getCardSynergyRecommendations(deck, topN = 5) {
    const deckCards = deck.cards || [];
    const recommendations = [];
    
    // Skip if no synergy data or empty deck
    if (this.cardSynergies.size === 0 || deckCards.length === 0) return [];
    
    // Find synergies with cards in the deck
    deckCards.forEach(card => {
      this.cardSynergies.forEach((synergy, key) => {
        if (synergy.card1 === card.id || synergy.card2 === card.id) {
          const otherCardId = synergy.card1 === card.id ? synergy.card2 : synergy.card1;
          
          // Check if other card is already in the deck
          const alreadyInDeck = deckCards.some(c => c.id === otherCardId);
          
          if (!alreadyInDeck) {
            recommendations.push({
              cardId: otherCardId,
              synergyWith: card.id,
              synergyScore: synergy.synergyScore,
              confidence: synergy.confidence,
              expectedWinRate: synergy.pairWinRate
            });
          }
        }
      });
    });
    
    // Sort by synergy score and remove duplicates
    const uniqueRecommendations = [];
    const seenCards = new Set();
    
    recommendations
      .sort((a, b) => b.synergyScore - a.synergyScore)
      .forEach(rec => {
        if (!seenCards.has(rec.cardId)) {
          uniqueRecommendations.push(rec);
          seenCards.add(rec.cardId);
        }
      });
    
    return uniqueRecommendations.slice(0, topN);
  }
  
  /**
   * Get personalized improvement recommendations for a player
   */
  getPlayerImprovementRecommendations(playerId) {
    const weaknesses = this.playerWeaknesses.get(playerId);
    if (!weaknesses) return [];
    
    const recommendations = [];
    
    // Recommend based on matchup weaknesses
    weaknesses.weaknesses.forEach(weakness => {
      recommendations.push({
        type: 'matchup',
        archetype: weakness.archetype,
        winRate: weakness.winRate,
        recommendation: `Practice against ${weakness.archetype} decks to improve your ${weakness.winRate.toFixed(1)}% win rate in this matchup.`,
        priority: weakness.severity
      });
    });
    
    // Recommend based on play pattern weaknesses
    weaknesses.playPatternWeaknesses.forEach(pattern => {
      recommendations.push({
        type: 'playPattern',
        turn: pattern.turn,
        action: `${pattern.actionType} targeting ${pattern.target}`,
        winRate: pattern.winRate,
        recommendation: `Reconsider your strategy when ${pattern.actionType} on turn ${pattern.turn}. This play pattern has only a ${pattern.winRate.toFixed(1)}% win rate.`,
        priority: pattern.severity
      });
    });
    
    // Recommend based on variance analysis
    const variance = this.performanceVariance.get(playerId);
    if (variance) {
      if (variance.variabilityRating > 0.2) {
        recommendations.push({
          type: 'consistency',
          variability: variance.variabilityRating,
          recommendation: `Your performance is highly variable (${(variance.variabilityRating * 100).toFixed(1)}% variance). Consider using more consistent decks like ${variance.lowVarianceArchetypes.map(a => a.archetype).join(', ')}.`,
          priority: variance.variabilityRating * 5
        });
      }
    }
    
    // Sort by priority
    recommendations.sort((a, b) => b.priority - a.priority);
    
    return recommendations;
  }
  
  /**
   * Get meta prediction for upcoming tournaments
   */
  getMetaPrediction(daysInFuture = 14) {
    if (this.metagameCycles.length === 0) return [];
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysInFuture);
    
    const predictions = [];
    
    this.metagameCycles.forEach(cycle => {
      // Skip low confidence predictions
      if (cycle.confidence < 0.5) return;
      
      // Find most recent data point
      const lastDataPoint = cycle.dataPoints[cycle.dataPoints.length - 1];
      
      // Calculate days since last data point
      const daysSinceLastPoint = (futureDate - lastDataPoint.date) / (1000 * 60 * 60 * 24);
      
      // Calculate position in cycle
      const cyclePosition = (daysSinceLastPoint % cycle.avgCycleLength) / cycle.avgCycleLength;
      
      // Predict percentage based on cycle position
      let predictedPercentage = lastDataPoint.percentage;
      
      if (cycle.peaks.length > 0 && cycle.troughs.length > 0) {
        const lastPeak = cycle.peaks[cycle.peaks.length - 1];
        const lastTrough = cycle.troughs[cycle.troughs.length - 1];
        
        const amplitude = (lastPeak.value - lastTrough.value) / 2;
        const baseline = (lastPeak.value + lastTrough.value) / 2;
        
        // Simple sinusoidal model
        predictedPercentage = baseline + amplitude * Math.sin(2 * Math.PI * cyclePosition);
      }
      
      // Calculate trend (rising, falling, or stable)
      let trend = 'stable';
      if (cycle.nextPeak && cycle.nextTrough) {
        const daysToPeak = (cycle.nextPeak.date - futureDate) / (1000 * 60 * 60 * 24);
        const daysToTrough = (cycle.nextTrough.date - futureDate) / (1000 * 60 * 60 * 24);
        
        if (daysToPeak < daysToTrough && daysToPeak > 0) {
          trend = 'rising';
        } else if (daysToTrough < daysToPeak && daysToTrough > 0) {
          trend = 'falling';
        }
      }
      
      predictions.push({
        archetype: cycle.archetype,
        currentPercentage: lastDataPoint.percentage,
        predictedPercentage,
        percentageChange: predictedPercentage - lastDataPoint.percentage,
        trend,
        confidence: cycle.confidence,
        nextPeak: cycle.nextPeak,
        nextTrough: cycle.nextTrough
      });
    });
    
    // Sort by predicted percentage (descending)
    predictions.sort((a, b) => b.predictedPercentage - a.predictedPercentage);
    
    return predictions;
  }
}