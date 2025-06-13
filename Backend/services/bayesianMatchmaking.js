const PlayerRating = require('../models/PlayerRating');
const Match = require('../models/Match');

class BayesianMatchmakingService {
  constructor() {
    // TrueSkill parameters
    this.BETA = 200; // Skill class width (half the default uncertainty)
    this.TAU = 6; // Additive dynamics factor
    this.DRAW_PROBABILITY = 0.1; // Probability of a draw
    
    // Deck archetype matchup matrix (win rates)
    this.DECK_MATCHUPS = {
      'Aggro': { 'Aggro': 0.5, 'Control': 0.65, 'Midrange': 0.55, 'Combo': 0.7, 'Tempo': 0.45, 'Ramp': 0.75 },
      'Control': { 'Aggro': 0.35, 'Control': 0.5, 'Midrange': 0.6, 'Combo': 0.4, 'Tempo': 0.55, 'Ramp': 0.45 },
      'Midrange': { 'Aggro': 0.45, 'Control': 0.4, 'Midrange': 0.5, 'Combo': 0.65, 'Tempo': 0.6, 'Ramp': 0.5 },
      'Combo': { 'Aggro': 0.3, 'Control': 0.6, 'Midrange': 0.35, 'Combo': 0.5, 'Tempo': 0.4, 'Ramp': 0.8 },
      'Tempo': { 'Aggro': 0.55, 'Control': 0.45, 'Midrange': 0.4, 'Combo': 0.6, 'Tempo': 0.5, 'Ramp': 0.65 },
      'Ramp': { 'Aggro': 0.25, 'Control': 0.55, 'Midrange': 0.5, 'Combo': 0.2, 'Tempo': 0.35, 'Ramp': 0.5 }
    };
  }

  /**
   * Generate optimal pairings for a tournament round using Bayesian matchmaking
   */
  async generatePairings(tournamentId, players, settings, format, round = 1) {
    try {
      // Get player ratings
      const playerRatings = await this.getPlayerRatings(players, format);
      
      // Get previous matches to avoid rematches
      const previousMatches = await this.getPreviousMatches(tournamentId, players);
      
      // Generate all possible pairings
      const possiblePairings = this.generateAllPairings(players, previousMatches);
      
      // Score each pairing set using Bayesian criteria
      const scoredPairings = await this.scorePairings(
        possiblePairings, 
        playerRatings, 
        settings, 
        format
      );
      
      // Select the best pairing set
      const bestPairings = this.selectBestPairings(scoredPairings);
      
      // Create match objects
      const matches = await this.createMatches(
        tournamentId, 
        bestPairings, 
        playerRatings, 
        settings, 
        format, 
        round
      );
      
      return matches;
    } catch (error) {
      console.error('Error generating Bayesian pairings:', error);
      throw error;
    }
  }

  /**
   * Get player ratings for all players
   */
  async getPlayerRatings(players, format) {
    const ratings = new Map();
    
    for (const playerId of players) {
      let playerRating = await PlayerRating.findOne({ userId: playerId });
      
      if (!playerRating) {
        // Create new rating for new player
        playerRating = new PlayerRating({ userId: playerId });
        await playerRating.save();
      }
      
      // Apply inactivity penalty
      playerRating.applyInactivityPenalty();
      
      ratings.set(playerId.toString(), playerRating);
    }
    
    return ratings;
  }

  /**
   * Get previous matches to avoid rematches
   */
  async getPreviousMatches(tournamentId, players) {
    const matches = await Match.find({
      tournamentId: tournamentId,
      $or: [
        { player1: { $in: players } },
        { player2: { $in: players } }
      ]
    }).select('player1 player2');
    
    const previousPairings = new Set();
    matches.forEach(match => {
      const pair = [match.player1.toString(), match.player2.toString()].sort().join('-');
      previousPairings.add(pair);
    });
    
    return previousPairings;
  }

  /**
   * Generate all possible pairings
   */
  generateAllPairings(players, previousMatches) {
    const playerList = [...players];
    const pairings = [];
    
    // Handle odd number of players (bye)
    if (playerList.length % 2 === 1) {
      // Find player who hasn't had a bye yet (simplified for now)
      const byePlayer = playerList.pop();
      pairings.push({ player1: byePlayer, player2: null, isBye: true });
    }
    
    // Generate pairings using recursive approach
    const generatePairingsRecursive = (remainingPlayers, currentPairing = []) => {
      if (remainingPlayers.length === 0) {
        return [currentPairing];
      }
      
      if (remainingPlayers.length === 2) {
        const pair = {
          player1: remainingPlayers[0],
          player2: remainingPlayers[1],
          isBye: false
        };
        return [currentPairing.concat([pair])];
      }
      
      const allPairings = [];
      const firstPlayer = remainingPlayers[0];
      
      for (let i = 1; i < remainingPlayers.length; i++) {
        const secondPlayer = remainingPlayers[i];
        const pairKey = [firstPlayer.toString(), secondPlayer.toString()].sort().join('-');
        
        // Skip if they've played before
        if (previousMatches.has(pairKey)) continue;
        
        const newRemaining = remainingPlayers.slice(1).filter((_, idx) => idx !== i - 1);
        const newPairing = currentPairing.concat([{
          player1: firstPlayer,
          player2: secondPlayer,
          isBye: false
        }]);
        
        const subPairings = generatePairingsRecursive(newRemaining, newPairing);
        allPairings.push(...subPairings);
      }
      
      return allPairings;
    };
    
    const generatedPairings = generatePairingsRecursive(playerList);
    
    // Add bye pairing if exists
    if (pairings.length > 0) {
      return generatedPairings.map(pairing => pairing.concat(pairings));
    }
    
    return generatedPairings;
  }

  /**
   * Score pairings based on Bayesian criteria
   */
  async scorePairings(possiblePairings, playerRatings, settings, format) {
    const scoredPairings = [];
    
    for (const pairingSet of possiblePairings) {
      let totalScore = 0;
      const pairingDetails = [];
      
      for (const pairing of pairingSet) {
        if (pairing.isBye) {
          pairingDetails.push({
            ...pairing,
            score: 0.5, // Neutral score for bye
            qualityMetrics: { isBye: true }
          });
          continue;
        }
        
        const player1Rating = playerRatings.get(pairing.player1.toString());
        const player2Rating = playerRatings.get(pairing.player2.toString());
        
        const pairingScore = this.calculatePairingScore(
          player1Rating, 
          player2Rating, 
          settings, 
          format
        );
        
        totalScore += pairingScore.score;
        pairingDetails.push({
          ...pairing,
          score: pairingScore.score,
          qualityMetrics: pairingScore.metrics
        });
      }
      
      scoredPairings.push({
        pairings: pairingDetails,
        totalScore: totalScore / pairingSet.length, // Average score
        averageQuality: totalScore / pairingSet.length
      });
    }
    
    return scoredPairings.sort((a, b) => b.totalScore - a.totalScore);
  }

  /**
   * Calculate quality score for a single pairing
   */
  calculatePairingScore(player1Rating, player2Rating, settings, format) {
    // Get format-specific ratings
    const p1Rating = this.getFormatRating(player1Rating, format);
    const p2Rating = this.getFormatRating(player2Rating, format);
    
    // Calculate skill difference
    const skillDifference = Math.abs(p1Rating.rating - p2Rating.rating);
    const maxAllowedDifference = settings.maxSkillDifference || 500;
    const minDesiredDifference = settings.minSkillDifference || 100;
    
    // Skill balance score (prefer closer matches)
    let skillScore = 1.0;
    if (skillDifference > maxAllowedDifference) {
      skillScore = 0.1; // Heavily penalize mismatched skills
    } else if (skillDifference < minDesiredDifference) {
      skillScore = 0.8; // Slightly penalize too-close matches
    } else {
      // Optimal range
      skillScore = 1.0 - (skillDifference / maxAllowedDifference) * 0.5;
    }
    
    // Uncertainty consideration (prefer matches with lower combined uncertainty)
    const combinedUncertainty = p1Rating.uncertainty + p2Rating.uncertainty;
    const uncertaintyScore = Math.max(0.1, 1.0 - (combinedUncertainty / 700));
    
    // Win probability (prefer matches close to 50/50)
    const winProbability = player1Rating.calculateWinProbability(player2Rating, format);
    const balanceScore = 1.0 - Math.abs(0.5 - winProbability);
    
    // Deck diversity score (if deck archetypes are available)
    let diversityScore = 1.0;
    const p1Archetype = this.getPreferredArchetype(player1Rating);
    const p2Archetype = this.getPreferredArchetype(player2Rating);
    
    if (p1Archetype && p2Archetype) {
      // Prefer diverse matchups
      if (p1Archetype === p2Archetype) {
        diversityScore = 0.7; // Same archetype penalty
      } else {
        // Check matchup balance
        const matchupWinRate = this.DECK_MATCHUPS[p1Archetype]?.[p2Archetype] || 0.5;
        diversityScore = 1.0 - Math.abs(0.5 - matchupWinRate);
      }
    }
    
    // Combine scores with weights from settings
    const skillWeight = 1.0 - (settings.skillVariance || 0.3);
    const diversityWeight = settings.deckDiversityWeight || 0.4;
    const uncertaintyWeight = 0.3;
    const balanceWeight = 0.4;
    
    const totalWeight = skillWeight + diversityWeight + uncertaintyWeight + balanceWeight;
    
    const finalScore = (
      skillScore * skillWeight +
      diversityScore * diversityWeight +
      uncertaintyScore * uncertaintyWeight +
      balanceScore * balanceWeight
    ) / totalWeight;
    
    return {
      score: finalScore,
      metrics: {
        skillDifference,
        skillScore,
        uncertaintyScore,
        balanceScore,
        diversityScore,
        winProbability,
        combinedUncertainty,
        p1Archetype,
        p2Archetype
      }
    };
  }

  /**
   * Get format-specific rating
   */
  getFormatRating(playerRating, format) {
    if (format && playerRating.formatRatings[format]) {
      return playerRating.formatRatings[format];
    }
    return {
      rating: playerRating.overallRating,
      uncertainty: playerRating.overallUncertainty,
      gamesPlayed: playerRating.totalGames
    };
  }

  /**
   * Get player's preferred/most played archetype
   */
  getPreferredArchetype(playerRating) {
    if (playerRating.deckArchetypes.length === 0) return null;
    
    // Return archetype with most games played
    return playerRating.deckArchetypes.reduce((prev, current) => 
      (prev.gamesPlayed > current.gamesPlayed) ? prev : current
    ).archetype;
  }

  /**
   * Select the best pairing set
   */
  selectBestPairings(scoredPairings) {
    if (scoredPairings.length === 0) {
      throw new Error('No valid pairings found');
    }
    
    return scoredPairings[0].pairings;
  }

  /**
   * Create match objects from pairings
   */
  async createMatches(tournamentId, pairings, playerRatings, settings, format, round) {
    const matches = [];
    
    for (let i = 0; i < pairings.length; i++) {
      const pairing = pairings[i];
      
      const match = new Match({
        tournamentId,
        round,
        table: i + 1,
        player1: pairing.player1,
        player2: pairing.player2,
        status: pairing.isBye ? 'bye' : 'pending',
        matchmakingData: {
          qualityScore: pairing.score,
          algorithm: settings.algorithm || 'bayesian',
          ...pairing.qualityMetrics
        }
      });
      
      // Set predicted win probability and other metrics
      if (!pairing.isBye) {
        const player1Rating = playerRatings.get(pairing.player1.toString());
        const player2Rating = playerRatings.get(pairing.player2.toString());
        
        match.matchmakingData.predictedWinProbability = 
          player1Rating.calculateWinProbability(player2Rating, format);
        match.matchmakingData.skillDifference = pairing.qualityMetrics.skillDifference;
        match.matchmakingData.deckMatchupFactor = pairing.qualityMetrics.diversityScore;
      }
      
      matches.push(match);
    }
    
    return matches;
  }

  /**
   * Update player ratings after a match using Bayesian update
   */
  async updateRatingsAfterMatch(match) {
    if (match.status !== 'completed' || match.isBye()) {
      return;
    }
    
    const player1Rating = await PlayerRating.findOne({ userId: match.player1 });
    const player2Rating = await PlayerRating.findOne({ userId: match.player2 });
    
    if (!player1Rating || !player2Rating) {
      throw new Error('Player ratings not found');
    }
    
    // Determine actual outcome
    let actualOutcome;
    if (match.winner?.toString() === match.player1.toString()) {
      actualOutcome = 1.0;
    } else if (match.winner?.toString() === match.player2.toString()) {
      actualOutcome = 0.0;
    } else {
      actualOutcome = 0.5; // Draw
    }
    
    // Get tournament format
    const tournament = await require('../models/Tournament').findById(match.tournamentId);
    const format = tournament?.format;
    
    // Update ratings using TrueSkill algorithm
    const ratingUpdates = this.calculateTrueSkillUpdate(
      player1Rating, 
      player2Rating, 
      actualOutcome, 
      format
    );
    
    // Store rating changes in match
    match.matchmakingData.actualOutcome = actualOutcome;
    match.ratingChanges = {
      player1: {
        ratingBefore: ratingUpdates.player1.oldRating,
        ratingAfter: ratingUpdates.player1.newRating,
        uncertaintyBefore: ratingUpdates.player1.oldUncertainty,
        uncertaintyAfter: ratingUpdates.player1.newUncertainty,
        change: ratingUpdates.player1.newRating - ratingUpdates.player1.oldRating
      },
      player2: {
        ratingBefore: ratingUpdates.player2.oldRating,
        ratingAfter: ratingUpdates.player2.newRating,
        uncertaintyBefore: ratingUpdates.player2.oldUncertainty,
        uncertaintyAfter: ratingUpdates.player2.newUncertainty,
        change: ratingUpdates.player2.newRating - ratingUpdates.player2.oldRating
      }
    };
    
    // Calculate surprise factor
    match.matchmakingData.surpriseFactor = match.calculateSurpriseFactor();
    
    // Apply rating updates
    await this.applyRatingUpdates(player1Rating, ratingUpdates.player1, format, match);
    await this.applyRatingUpdates(player2Rating, ratingUpdates.player2, format, match);
    
    await match.save();
  }

  /**
   * Calculate TrueSkill rating updates
   */
  calculateTrueSkillUpdate(player1Rating, player2Rating, actualOutcome, format) {
    // Get current ratings
    const p1Current = this.getFormatRating(player1Rating, format);
    const p2Current = this.getFormatRating(player2Rating, format);
    
    // TrueSkill calculations
    const c = Math.sqrt(2 * this.BETA * this.BETA + p1Current.uncertainty * p1Current.uncertainty + p2Current.uncertainty * p2Current.uncertainty);
    
    const winProbability = this.normalCDF((p1Current.rating - p2Current.rating) / c);
    const drawProbability = this.DRAW_PROBABILITY;
    
    // Calculate v and w functions
    const v = this.vFunction(winProbability, drawProbability, actualOutcome);
    const w = this.wFunction(winProbability, drawProbability, actualOutcome);
    
    // Update ratings
    const p1NewRating = p1Current.rating + (p1Current.uncertainty * p1Current.uncertainty / c) * v;
    const p2NewRating = p2Current.rating - (p2Current.uncertainty * p2Current.uncertainty / c) * v;
    
    // Update uncertainties
    const p1NewUncertainty = Math.sqrt(Math.max(
      p1Current.uncertainty * p1Current.uncertainty * (1 - (p1Current.uncertainty * p1Current.uncertainty / (c * c)) * w),
      1 // Minimum uncertainty
    ));
    const p2NewUncertainty = Math.sqrt(Math.max(
      p2Current.uncertainty * p2Current.uncertainty * (1 - (p2Current.uncertainty * p2Current.uncertainty / (c * c)) * w),
      1 // Minimum uncertainty
    ));
    
    return {
      player1: {
        oldRating: p1Current.rating,
        newRating: p1NewRating,
        oldUncertainty: p1Current.uncertainty,
        newUncertainty: p1NewUncertainty
      },
      player2: {
        oldRating: p2Current.rating,
        newRating: p2NewRating,
        oldUncertainty: p2Current.uncertainty,
        newUncertainty: p2NewUncertainty
      }
    };
  }

  /**
   * Normal cumulative distribution function
   */
  normalCDF(x) {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  /**
   * Error function approximation
   */
  erf(x) {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  /**
   * TrueSkill v function
   */
  vFunction(winProb, drawProb, outcome) {
    if (outcome === 1.0) {
      return this.normalPDF(winProb) / (1 - drawProb);
    } else if (outcome === 0.0) {
      return -this.normalPDF(winProb) / (1 - drawProb);
    } else {
      return 0; // Draw case simplified
    }
  }

  /**
   * TrueSkill w function
   */
  wFunction(winProb, drawProb, outcome) {
    const v = this.vFunction(winProb, drawProb, outcome);
    if (outcome === 1.0 || outcome === 0.0) {
      return v * (v + winProb);
    } else {
      return v * v; // Draw case simplified
    }
  }

  /**
   * Normal probability density function
   */
  normalPDF(x) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  }

  /**
   * Apply rating updates to player
   */
  async applyRatingUpdates(playerRating, updates, format, match) {
    // Update overall rating
    playerRating.overallRating = updates.newRating;
    playerRating.overallUncertainty = updates.newUncertainty;
    
    // Update format-specific rating
    if (format && playerRating.formatRatings[format]) {
      playerRating.formatRatings[format].rating = updates.newRating;
      playerRating.formatRatings[format].uncertainty = updates.newUncertainty;
      playerRating.formatRatings[format].gamesPlayed += 1;
    }
    
    // Update game counts
    playerRating.totalGames += 1;
    const result = match.didPlayerWin(playerRating.userId) ? 'win' : 
                  (match.winner ? 'loss' : 'draw');
    
    if (result === 'win') {
      playerRating.totalWins += 1;
      playerRating.currentWinStreak += 1;
      playerRating.currentLossStreak = 0;
      playerRating.longestWinStreak = Math.max(playerRating.longestWinStreak, playerRating.currentWinStreak);
    } else if (result === 'loss') {
      playerRating.totalLosses += 1;
      playerRating.currentLossStreak += 1;
      playerRating.currentWinStreak = 0;
      playerRating.longestLossStreak = Math.max(playerRating.longestLossStreak, playerRating.currentLossStreak);
    } else {
      playerRating.totalDraws += 1;
      playerRating.currentWinStreak = 0;
      playerRating.currentLossStreak = 0;
    }
    
    // Update deck archetype performance
    const playerDeck = match.player1.toString() === playerRating.userId.toString() ? 
                      match.player1Deck : match.player2Deck;
    if (playerDeck?.archetype) {
      playerRating.updateDeckArchetype(
        playerDeck.archetype, 
        updates.newRating, 
        updates.newUncertainty, 
        result
      );
    }
    
    // Add to match history
    const opponent = match.getOpponent(playerRating.userId);
    const opponentDeck = match.player1.toString() === playerRating.userId.toString() ? 
                        match.player2Deck : match.player1Deck;
    
    playerRating.matchHistory.push({
      tournamentId: match.tournamentId,
      matchId: match._id,
      opponentId: opponent,
      result: result,
      playerDeck: playerDeck?.archetype || 'Unknown',
      opponentDeck: opponentDeck?.archetype || 'Unknown',
      ratingBefore: updates.oldRating,
      ratingAfter: updates.newRating,
      uncertaintyBefore: updates.oldUncertainty,
      uncertaintyAfter: updates.newUncertainty,
      date: new Date()
    });
    
    // Keep only last 100 matches in history
    if (playerRating.matchHistory.length > 100) {
      playerRating.matchHistory = playerRating.matchHistory.slice(-100);
    }
    
    // Update activity
    playerRating.lastActive = new Date();
    playerRating.inactivityPenalty = 0;
    
    // Update confidence metrics
    playerRating.ratingConfidence = Math.min(0.95, playerRating.ratingConfidence + 0.01);
    
    await playerRating.save();
  }
}

module.exports = new BayesianMatchmakingService();