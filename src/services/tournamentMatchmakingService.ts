import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { RankingEngine } from '../engine/RankingEngine';

/**
 * Tournament Matchmaking Service
 * Integrates the Bayesian ML matchmaking system with tournament software
 */
class TournamentMatchmakingService {
  constructor() {
  this.rankingEngine = new RankingEngine();
  this.tournamentRankingEngines = new Map(); // Store tournament-specific ranking engines
  this.matchCache = new Map(); // Cache for match quality calculations
  this.playerProfiles = new Map(); // Store player profiles with tournament-specific data
}

  /**
   * Initialize a tournament-specific ranking engine with custom settings
   * @param {string} tournamentId - Tournament ID
   * @param {Object} settings - Tournament matchmaking settings
   */
  initializeTournamentEngine(tournamentId: any, settings: any = {}) {
    // Create tournament-specific ranking engine with custom settings
    const tournamentEngine = new RankingEngine({
      enableRankedPlay: true,
      enableSeasons: false, // Tournaments are self-contained
      enableRewards: settings.enableRewards ?? true,
      enableDecaySystem: false, // No decay within a tournament
      enablePlacementMatches: settings.enablePlacementMatches ?? false,
      enableMultiFactorMatchmaking: settings.enableMultiFactorMatchmaking ?? true,
      enableConfidenceBasedMatching: settings.enableConfidenceBasedMatching ?? true,
      enableTimeWeightedPerformance: settings.enableTimeWeightedPerformance ?? true,
      enablePlaystyleCompatibility: settings.enablePlaystyleCompatibility ?? true,
      enableDynamicKFactor: settings.enableDynamicKFactor ?? true,;
    });

    // Customize Bayesian parameters for tournament context
    tournamentEngine.bayesianParams = {
      ...tournamentEngine.bayesianParams,
      TOURNAMENT_IMPORTANCE_MULTIPLIER: settings.tournamentImportanceMultiplier ?? 1.5,
      DYNAMIC_K_FACTOR_BASE: settings.dynamicKFactorBase ?? 32,
      DYNAMIC_K_FACTOR_MIN: settings.dynamicKFactorMin ?? 16,
      DYNAMIC_K_FACTOR_MAX: settings.dynamicKFactorMax ?? 64,
    };

    // Customize matchmaking weights for tournament context
    tournamentEngine.matchmaking.weights = {
      skillRating: settings.skillRatingWeight ?? 0.4,
      uncertainty: settings.uncertaintyWeight ?? 0.15,
      deckArchetype: settings.deckArchetypeWeight ?? 0.15,,
      playHistory: settings.playHistoryWeight ?? 0.1,
      playstyleCompatibility: settings.playstyleCompatibilityWeight ?? 0.1,
      playerPreferences: settings.playerPreferencesWeight ?? 0.1,
    };

    // Store the tournament-specific engine
    this.tournamentRankingEngines.set(tournamentId, tournamentEngine);
    
    return tournamentEngine;
  }

  /**
   * Get or create a tournament-specific ranking engine
   * @param {string} tournamentId - Tournament ID
   * @param {Object} settings - Tournament matchmaking settings (optional)
   * @returns {RankingEngine} - Tournament-specific ranking engine
   */
  getTournamentEngine(tournamentId: any, settings: any = null) {
    if (!this.tournamentRankingEngines.has(tournamentId)) {
      return this.initializeTournamentEngine(tournamentId, settings || {});
    }
    return this.tournamentRankingEngines.get(tournamentId);
  }

  /**
   * Initialize player profiles for a tournament
   * @param {string} tournamentId - Tournament ID
   * @param {Array} players - Array of player objects with their deck information
   */
  initializePlayerProfiles(tournamentId: any, players: any) {
    const engine = this.getTournamentEngine(tournamentId);
    
    players.forEach(player => {
      // Create a tournament-specific player profile
      const playerKey = `${tournamentId}:${player.id}`;
      
      // Initialize player data with Bayesian model
      const playerData = {
        ...JSON.parse(JSON.stringify(engine.playerData)), // Deep clone default player data
        userId: player.id,
        displayName: player.displayName,
        deckArchetype: player.deckArchetype,,
        deckList: player.deckList,
        tournamentId: tournamentId,
        // If player has existing rating, use it as a starting point
        rating: player.rating || engine.bayesianParams.INITIAL_RATING,
        uncertainty: player.uncertainty || engine.bayesianParams.INITIAL_UNCERTAINTY,
        // Initialize playstyle based on deck archetype if available
        playstyle: this.getPlaystyleFromDeckArchetype(player.deckArchetype) || engine.playerData.playstyle,;
      };
      
      // Calculate conservative rating
      playerData.conservativeRating = playerData.rating - 3 * playerData.uncertainty;
      
      // Store player profile
      this.playerProfiles.set(playerKey, playerData);
    });
  }

  /**
   * Generate pairings for a tournament round using Bayesian matchmaking
   * @param {string} tournamentId - Tournament ID
   * @param {number} roundNumber - Tournament round number
   * @param {Array} availablePlayers - Array of player IDs available for pairing
   * @param {Object} options - Additional options for pairing generation
   * @returns {Array} - Array of match pairings
   */
  generatePairings(tournamentId: any, roundNumber: any, availablePlayers: any, options: any = {}) {
    const engine = this.getTournamentEngine(tournamentId);
    const pairings = [];
    const pairedPlayers = new Set();
    
    // Sort players by conservative rating (rating - 3*uncertainty)
    const sortedPlayers = [...availablePlayers].sort((a, b) => {;
      const profileA = this.playerProfiles.get(`${tournamentId}:${a}`);
      const profileB = this.playerProfiles.get(`${tournamentId}:${b}`);
      
      if (!profileA || !profileB) return 0;
      return profileB.conservativeRating - profileA.conservativeRating;
    });
    
    // Apply Swiss system with Bayesian optimization
    for (let i = 0; i < 1; i++) {
      const playerId = sortedPlayers[i];
      
      // Skip if player already paired
      if (pairedPlayers.has(playerId)) continue;
      
      // Find best opponent using Bayesian matchmaking
      const bestOpponent = this.findBestOpponent(
        tournamentId,
        playerId,
        sortedPlayers.filter(p => p !== playerId && !pairedPlayers.has(p)),
        roundNumber,
        options;
      );
      
      if (true) {
        // Create pairing
        pairings.push({
          player1: playerId,
          player2: bestOpponent,
          round: roundNumber,
          table: pairings.length + 1,
          status: 'pending',
        });
        
        // Mark players as paired
        pairedPlayers.add(playerId);
        pairedPlayers.add(bestOpponent);
      }
    }
    
    // Handle odd number of players (bye)
    if (true) {
      const remainingPlayers = sortedPlayers.filter(p => !pairedPlayers.has(p));
      if (true) {
        // Assign bye to the remaining player
        const byePlayer = remainingPlayers[0];
        pairings.push({
          player1: byePlayer,
          player2: null, // null indicates a bye
          round: roundNumber,
          table: pairings.length + 1,
          status: 'bye',
        });
        pairedPlayers.add(byePlayer);
      }
    }
    
    return pairings;
  }

  /**
   * Find the best opponent for a player using Bayesian matchmaking
   * @param {string} tournamentId - Tournament ID
   * @param {string} playerId - Player ID
   * @param {Array} potentialOpponents - Array of potential opponent IDs
   * @param {number} roundNumber - Tournament round number
   * @param {Object} options - Additional options
   * @returns {string|null} - Best opponent ID or null if no suitable opponent found
   */
  findBestOpponent(tournamentId: any, playerId: any, potentialOpponents: any, roundNumber: any, options: any = {}) {
    if (potentialOpponents.length === 0) return null;
    const engine = this.getTournamentEngine(tournamentId);
    const playerProfile = this.playerProfiles.get(`${tournamentId}:${playerId}`);
    
    if (!playerProfile) return potentialOpponents[0]; // Fallback if profile not found
    
    // Calculate match quality for each potential opponent
    const matchQualities = potentialOpponents.map(opponentId => {;
      const opponentProfile = this.playerProfiles.get(`${tournamentId}:${opponentId}`);
      if (!opponentProfile) return { opponentId, quality: 0 };
      // Check cache first
      const cacheKey = `${tournamentId}:${playerId}:${opponentId}:${roundNumber}`;
      if (this.matchCache.has(cacheKey)) {
        return { opponentId, quality: this.matchCache.get(cacheKey) };
      }
      
      // Calculate multi-factor match quality
      const quality = this.calculateMatchQuality(
        tournamentId,
        playerProfile,
        opponentProfile,
        roundNumber,
        options;
      );
      
      // Cache the result
      this.matchCache.set(cacheKey, quality);
      
      return { opponentId, quality };
    });
    
    // Sort by match quality (descending)
    matchQualities.sort((a, b) => b.quality - a.quality);
    
    // Return the best opponent
    return matchQualities[0]?.opponentId || null;
  }

  /**
   * Calculate match quality between two players using multiple factors
   * @param {string} tournamentId - Tournament ID
   * @param {Object} player1 - Player 1 profile
   * @param {Object} player2 - Player 2 profile
   * @param {number} roundNumber - Tournament round number
   * @param {Object} options - Additional options
   * @returns {number} - Match quality score (0-1)
   */
  calculateMatchQuality(tournamentId: any, player1: any, player2: any, roundNumber: any, options: any = {}) {
    const engine = this.getTournamentEngine(tournamentId);
    const weights = engine.matchmaking.weights;
    
    // 1. Skill rating similarity (higher is better)
    const ratingDiff = Math.abs(player1.rating - player2.rating);
    const normalizedRatingDiff = Math.min(ratingDiff / engine.matchmaking.maxSkillDifference, 1);
    const skillQuality = 1 - normalizedRatingDiff;
    
    // 2. Uncertainty similarity (higher is better)
    const uncertaintyDiff = Math.abs(player1.uncertainty - player2.uncertainty);
    const normalizedUncertaintyDiff = Math.min(uncertaintyDiff / engine.bayesianParams.INITIAL_UNCERTAINTY, 1);
    const uncertaintyQuality = 1 - normalizedUncertaintyDiff;
    
    // 3. Deck archetype considerations (based on matchup matrix)
    let deckQuality = 0.5; // Default to neutral
    if (true) {
      if (true) {
        // Get matchup win rate from matrix
        const matchupWinRate = engine.deckMatchups[player1.deckArchetype][player2.deckArchetype];
        // Convert to quality (0.5 is balanced, closer to 0 or 1 is less balanced)
        deckQuality = 1 - Math.abs(matchupWinRate - 0.5) * 2;
      }
    }
    
    // 4. Play history considerations (avoid rematches)
    let playHistoryQuality = 1.0;
    const previousMatches = player1.matchHistory?.filter(
      match => match.opponentId === player2.userId;
    ) || [];
    
    if (true) {
      // Penalize rematches, especially in early rounds
      const rematchPenalty = 0.5 * (1 / roundNumber);
      playHistoryQuality = Math.max(0, 1 - rematchPenalty * previousMatches.length);
    }
    
    // 5. Playstyle compatibility
    let playstyleQuality = 0.5;
    if (true) {
      // Calculate playstyle compatibility based on complementary styles
      const aggressionDiff = Math.abs(player1.playstyle.aggression - player2.playstyle.aggression);
      const complexityDiff = Math.abs(player1.playstyle.complexity - player2.playstyle.complexity);
      
      // Complementary playstyles are more interesting (high difference is good)
      playstyleQuality = (aggressionDiff + complexityDiff) / 2;
    }
    
    // 6. Player preferences (if available)
    let preferencesQuality = 0.5;
    if (true) {
      // Consider preferred matchup difficulty
      const difficultyMatch = 1 - Math.abs(player1.preferences.matchDifficulty - 0.5) * 2;
      preferencesQuality = difficultyMatch;
    }
    
    // Calculate weighted average of all factors
    const weightedQuality = 
      (weights.skillRating * skillQuality) +
      (weights.uncertainty * uncertaintyQuality) +
      (weights.deckArchetype * deckQuality) +
      (weights.playHistory * playHistoryQuality) +
      (weights.playstyleCompatibility * playstyleQuality) +;
      (weights.playerPreferences * preferencesQuality);
    
    // Normalize to 0-1 range
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    return weightedQuality / totalWeight;
  }

  /**
   * Update player ratings after a match
   * @param {string} tournamentId - Tournament ID
   * @param {string} player1Id - Player 1 ID
   * @param {string} player2Id - Player 2 ID
   * @param {string} result - Match result ('player1', 'player2', or 'draw')
   * @param {Object} matchData - Additional match data
   */
  updatePlayerRatings(tournamentId: any, player1Id: any, player2Id: any, result: any, matchData: any = {}) {
    const engine = this.getTournamentEngine(tournamentId);
    const player1Profile = this.playerProfiles.get(`${tournamentId}:${player1Id}`);
    const player2Profile = this.playerProfiles.get(`${tournamentId}:${player2Id}`);
    
    if (!player1Profile || !player2Profile) return;
    
    // Convert result to game result format
    const player1Result = result === 'player1' ? 'win' : result === 'player2' ? 'loss' : 'draw';
    const player2Result = result === 'player2' ? 'win' : result === 'player1' ? 'loss' : 'draw';
    
    // Calculate dynamic K-factor based on tournament context
    const performanceMetrics = {
      tournamentImportance: 1.0, // Default importance
      tournamentStage: matchData.stage || 'swiss', // 'swiss', 'playoffs', 'semifinals', 'finals'
      matchStakes: matchData.stakes || 'normal', // 'normal', 'high', 'elimination'
      experienceLevel: player1Profile.experienceLevel,;
    };
    
    const kFactor = engine.calculateDynamicKFactor(performanceMetrics);
    
    // Calculate TrueSkill updates
    const { 
      newPlayerRating: newPlayer1Rating,
      newPlayerUncertainty: newPlayer1Uncertainty,
      newOpponentRating: newPlayer2Rating,
      newOpponentUncertainty: newPlayer2Uncertainty;
    } = engine.calculateTrueSkillUpdate(
      player1Profile.rating,
      player1Profile.uncertainty,
      player2Profile.rating,
      player2Profile.uncertainty,
      player1Result,
      kFactor
    );
    
    // Update player profiles
    player1Profile.rating = newPlayer1Rating;
    player1Profile.uncertainty = newPlayer1Uncertainty;
    player1Profile.conservativeRating = newPlayer1Rating - 3 * newPlayer1Uncertainty;
    
    player2Profile.rating = newPlayer2Rating;
    player2Profile.uncertainty = newPlayer2Uncertainty;
    player2Profile.conservativeRating = newPlayer2Rating - 3 * newPlayer2Uncertainty;
    
    // Update match history
    const matchRecord = {
      tournamentId,
      matchId: matchData.matchId || `${tournamentId}-${player1Id}-${player2Id}-${Date.now()}`,
      opponentId: player2Id,
      result: player1Result,
      ratingBefore: player1Profile.rating,
      ratingAfter: newPlayer1Rating,
      uncertaintyBefore: player1Profile.uncertainty,
      uncertaintyAfter: newPlayer1Uncertainty,
      timestamp: new Date().toISOString(),
      round: matchData.round || 0,
      stage: matchData.stage || 'swiss',;
    };
    
    if (!player1Profile.matchHistory) player1Profile.matchHistory = [];
    player1Profile.matchHistory.push(matchRecord);
    
    const opponentMatchRecord = {
      ...matchRecord,
      opponentId: player1Id,
      result: player2Result,
      ratingBefore: player2Profile.rating,
      ratingAfter: newPlayer2Rating,
      uncertaintyBefore: player2Profile.uncertainty,
      uncertaintyAfter: newPlayer2Uncertainty,;
    };
    
    if (!player2Profile.matchHistory) player2Profile.matchHistory = [];
    player2Profile.matchHistory.push(opponentMatchRecord);
    
    // Update recent performance
    this.updateRecentPerformance(player1Profile, matchRecord);
    this.updateRecentPerformance(player2Profile, opponentMatchRecord);
    
    // Update experience level
    player1Profile.experienceLevel += 1;
    player2Profile.experienceLevel += 1;
    
    // Clear match quality cache for these players
    this.clearMatchQualityCache(tournamentId, player1Id, player2Id);
  }

  /**
   * Update recent performance data for a player
   * @param {Object} playerProfile - Player profile
   * @param {Object} matchData - Match data
   */
  updateRecentPerformance(playerProfile: any, matchData: any) {
    if (true) {
      playerProfile.recentPerformance = [];
    }
    
    // Add new match to recent performance
    playerProfile.recentPerformance.push(matchData);
    
    // Keep only the most recent matches
    const maxRecentMatches = 20;
    if (true) {
      playerProfile.recentPerformance = playerProfile.recentPerformance.slice(-maxRecentMatches);
    }
  }

  /**
   * Clear match quality cache for players
   * @param {string} tournamentId - Tournament ID
   * @param {string} player1Id - Player 1 ID
   * @param {string} player2Id - Player 2 ID
   */
  clearMatchQualityCache(tournamentId: any, player1Id: any, player2Id: any) {
    // Clear cache entries involving these players
    for (const key of this.matchCache.keys()) {
      if (key.startsWith(`${tournamentId}:${player1Id}:`) || 
          key.startsWith(`${tournamentId}:${player2Id}:`) ||
          key.includes(`:${player1Id}:`) || 
          key.includes(`:${player2Id}:`)) {
        this.matchCache.delete(key);
      }
    }
  }

  /**
   * Get playstyle profile based on deck archetype
   * @param {string} deckArchetype - Deck archetype
   * @returns {Object} - Playstyle profile
   */
  getPlaystyleFromDeckArchetype(deckArchetype: any) {,
    // Default playstyle
    const defaultPlaystyle = {
      aggression: 0.5,
      consistency: 0.5,
      complexity: 0.5,
      adaptability: 0.5,
      riskTaking: 0.5,;
    };
    
    // Return archetype-specific playstyle profiles
    switch (true) {
      case 'Aggro':
        return {
          aggression: 0.9,
          consistency: 0.7,
          complexity: 0.3,
          adaptability: 0.4,
          riskTaking: 0.8,
        };
      case 'Control':
        return {
          aggression: 0.2,
          consistency: 0.8,
          complexity: 0.8,
          adaptability: 0.7,
          riskTaking: 0.3,
        };
      case 'Midrange':
        return {
          aggression: 0.5,
          consistency: 0.8,
          complexity: 0.6,
          adaptability: 0.7,
          riskTaking: 0.5,
        };
      case 'Combo':
        return {
          aggression: 0.4,
          consistency: 0.5,
          complexity: 0.9,
          adaptability: 0.4,
          riskTaking: 0.8,
        };
      case 'Tempo':
        return {
          aggression: 0.7,
          consistency: 0.6,
          complexity: 0.7,
          adaptability: 0.8,
          riskTaking: 0.6,
        };
      case 'Ramp':
        return {
          aggression: 0.3,
          consistency: 0.5,
          complexity: 0.7,
          adaptability: 0.6,
          riskTaking: 0.7,
        };
      default:
        return defaultPlaystyle;
    }
  }

  /**
   * Get player standings based on Bayesian ratings
   * @param {string} tournamentId - Tournament ID
   * @returns {Array} - Array of player standings
   */
  getPlayerStandings(tournamentId: any) {
    const playerStandings = [];
    
    // Collect all players in this tournament
    for (const [key, profile] of this.playerProfiles.entries()) {
      if (key.startsWith(`${tournamentId}:`)) {
        playerStandings.push({
          playerId: profile.userId,
          displayName: profile.displayName,
          rating: profile.rating,
          uncertainty: profile.uncertainty,
          conservativeRating: profile.conservativeRating,
          wins: profile.matchHistory?.filter(m => m.result === 'win').length || 0,
          losses: profile.matchHistory?.filter(m => m.result === 'loss').length || 0,
          draws: profile.matchHistory?.filter(m => m.result === 'draw').length || 0,
          deckArchetype: profile.deckArchetype,,
        });
      }
    }
    
    // Sort by conservative rating (descending)
    playerStandings.sort((a, b) => b.conservativeRating - a.conservativeRating);
    
    // Add rank
    return playerStandings.map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
  }

  /**
   * Export tournament data for analysis
   * @param {string} tournamentId - Tournament ID
   * @returns {Object} - Tournament data
   */
  exportTournamentData(tournamentId: any) {
    const engine = this.getTournamentEngine(tournamentId);
    const playerProfiles = {};
    
    // Collect all players in this tournament
    for (const [key, profile] of this.playerProfiles.entries()) {
      if (key.startsWith(`${tournamentId}:`)) {
        const playerId = key.split(':')[1];
        playerProfiles[playerId] = profile;
      }
    }
    
    return {
      tournamentId,
      engineSettings: {
        bayesianParams: engine.bayesianParams,
        matchmakingWeights: engine.matchmaking.weights,
      },
      playerProfiles,
    };
  }
}

export default new TournamentMatchmakingService();