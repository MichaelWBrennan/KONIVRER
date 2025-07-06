/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Advanced Competitive Ranking Engine for KONIVRER
 * Handles Bayesian TrueSkill system, seasonal rankings, matchmaking, and rewards
 * Includes multi-factor matchmaking, confidence-based matching, and time-weighted performance
 */

interface RankingEngineOptions {
  enableRankedPlay?: boolean;
  enableSeasons?: boolean;
  enableRewards?: boolean;
  enableDecaySystem?: boolean;
  enablePlacementMatches?: boolean;
  enableMultiFactorMatchmaking?: boolean;
  enableConfidenceBasedMatching?: boolean;
  enableTimeWeightedPerformance?: boolean;
  enablePlaystyleCompatibility?: boolean;
  enableDynamicKFactor?: boolean;
  [key: string]: any;
}

interface RankTier {
  name: string;
  minRating: number;
  maxRating: number;
  color: string;
  icon: string;
  description: string;
  rewards: any[];
}

interface BayesianParams {
  initialMu: number;
  initialSigma: number;
  beta: number;
  tau: number;
  drawProbability: number;
}

interface PlayerRankData {
  id: string;
  name: string;
  mu: number;
  sigma: number;
  rating: number;
  tier: string;
  division: number;
  rank: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  streakCurrent: number;
  streakBest: number;
  lastPlayed: Date | null;
  seasonHighestRating: number;
  seasonHighestTier: string;
  placementMatchesRemaining: number;
  isProvisional: boolean;
  confidence: number;
  decayProtection: number;
  rewardPoints: number;
  matchHistory: MatchRecord[];
  deckPerformance: Record<string, DeckPerformance>;
  playstyleFactors: PlaystyleFactors;
}

interface MatchRecord {
  id: string;
  timestamp: Date;
  opponentId: string;
  opponentName: string;
  opponentRating: number;
  playerDeck: string;
  opponentDeck: string;
  result: 'win' | 'loss' | 'draw';
  ratingChange: number;
  gameTimeMinutes: number;
}

interface DeckPerformance {
  deckId: string;
  deckName: string;
  archetype: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  averageGameTime: number;
  lastPlayed: Date | null;
}

interface PlaystyleFactors {
  aggression: number;
  consistency: number;
  adaptability: number;
  riskTaking: number;
  patience: number;
  preferredGameLength: number;
  preferredArchetypes: string[];
}

interface SeasonData {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  theme: string;
  rewards: any[];
  leaderboard: string[];
  rankDistribution: Record<string, number>;
}

interface MatchmakingParams {
  maxRatingDifference: number;
  preferredRatingDifference: number;
  maxWaitTime: number;
  confidenceWeight: number;
  playstyleWeight: number;
  queuePriority: 'speed' | 'quality' | 'balanced';
  regionPriority: boolean;
  pingThreshold: number;
}

interface DeckMatchupData {
  archetype1: string;
  archetype2: string;
  matchesPlayed: number;
  archetype1WinRate: number;
  averageGameLength: number;
  favoredSide: 'first' | 'second' | 'balanced';
}

interface PlaystyleCompatibility {
  factor1: keyof PlaystyleFactors;
  factor2: keyof PlaystyleFactors;
  compatibilityScore: number;
  matchQualityImpact: number;
}

interface RewardTier {
  id: string;
  name: string;
  pointsRequired: number;
  rewards: any[];
  icon: string;
}

export class RankingEngine {
  private options: RankingEngineOptions;
  private tiers: Record<string, RankTier>;
  private bayesianParams: BayesianParams;
  private playerData: Map<string, PlayerRankData>;
  private season: SeasonData;
  private matchmaking: MatchmakingParams;
  private deckMatchups: DeckMatchupData[];
  private playstyleCompatibility: PlaystyleCompatibility[];
  private rewards: RewardTier[];

  constructor(options: RankingEngineOptions = {}) {
    this.options = {
      enableRankedPlay: true,
      enableSeasons: true,
      enableRewards: true,
      enableDecaySystem: true,
      enablePlacementMatches: true,
      enableMultiFactorMatchmaking: true,
      enableConfidenceBasedMatching: true,
      enableTimeWeightedPerformance: true,
      enablePlaystyleCompatibility: true,
      enableDynamicKFactor: true,
      ...options
    };

    // Initialize ranking tiers
    this.tiers = {
      bronze: {
        name: 'Bronze',
        minRating: 0,
        maxRating: 1199,
        color: '#CD7F32',
        icon: 'bronze_icon.png',
        description: 'Beginning of the competitive journey',
        rewards: [{ type: 'card_back', id: 'bronze_season_1' }]
      },
      silver: {
        name: 'Silver',
        minRating: 1200,
        maxRating: 1499,
        color: '#C0C0C0',
        icon: 'silver_icon.png',
        description: 'Developing competitive skills',
        rewards: [
          { type: 'card_back', id: 'silver_season_1' },
          { type: 'avatar_frame', id: 'silver_frame_1' }
        ]
      },
      gold: {
        name: 'Gold',
        minRating: 1500,
        maxRating: 1799,
        color: '#FFD700',
        icon: 'gold_icon.png',
        description: 'Skilled competitive player',
        rewards: [
          { type: 'card_back', id: 'gold_season_1' },
          { type: 'avatar_frame', id: 'gold_frame_1' },
          { type: 'avatar', id: 'gold_avatar_1' }
        ]
      },
      platinum: {
        name: 'Platinum',
        minRating: 1800,
        maxRating: 2099,
        color: '#E5E4E2',
        icon: 'platinum_icon.png',
        description: 'Expert competitive player',
        rewards: [
          { type: 'card_back', id: 'platinum_season_1' },
          { type: 'avatar_frame', id: 'platinum_frame_1' },
          { type: 'avatar', id: 'platinum_avatar_1' },
          { type: 'emote_set', id: 'platinum_emotes_1' }
        ]
      },
      diamond: {
        name: 'Diamond',
        minRating: 2100,
        maxRating: 2399,
        color: '#B9F2FF',
        icon: 'diamond_icon.png',
        description: 'Elite competitive player',
        rewards: [
          { type: 'card_back', id: 'diamond_season_1' },
          { type: 'avatar_frame', id: 'diamond_frame_1' },
          { type: 'avatar', id: 'diamond_avatar_1' },
          { type: 'emote_set', id: 'diamond_emotes_1' },
          { type: 'card_style', id: 'diamond_style_1' }
        ]
      },
      master: {
        name: 'Master',
        minRating: 2400,
        maxRating: 2699,
        color: '#9678D3',
        icon: 'master_icon.png',
        description: 'Master of competitive play',
        rewards: [
          { type: 'card_back', id: 'master_season_1' },
          { type: 'avatar_frame', id: 'master_frame_1' },
          { type: 'avatar', id: 'master_avatar_1' },
          { type: 'emote_set', id: 'master_emotes_1' },
          { type: 'card_style', id: 'master_style_1' },
          { type: 'battlefield', id: 'master_battlefield_1' }
        ]
      },
      grandmaster: {
        name: 'Grandmaster',
        minRating: 2700,
        maxRating: Infinity,
        color: '#FF4500',
        icon: 'grandmaster_icon.png',
        description: 'Pinnacle of competitive excellence',
        rewards: [
          { type: 'card_back', id: 'grandmaster_season_1' },
          { type: 'avatar_frame', id: 'grandmaster_frame_1' },
          { type: 'avatar', id: 'grandmaster_avatar_1' },
          { type: 'emote_set', id: 'grandmaster_emotes_1' },
          { type: 'card_style', id: 'grandmaster_style_1' },
          { type: 'battlefield', id: 'grandmaster_battlefield_1' },
          { type: 'title', id: 'grandmaster_title_1' }
        ]
      }
    };

    // Initialize Bayesian TrueSkill parameters
    this.bayesianParams = {
      initialMu: 1500, // Initial mean skill
      initialSigma: 350, // Initial standard deviation
      beta: 200, // Skill difference needed for 76% win probability
      tau: 10, // Dynamic factor for skill evolution
      drawProbability: 0.05 // Base probability of draws
    };

    // Initialize player data storage
    this.playerData = new Map();

    // Initialize current season
    this.season = {
      id: 1,
      name: 'Season of Discovery',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-04-01'),
      isActive: true,
      theme: 'discovery',
      rewards: [],
      leaderboard: [],
      rankDistribution: {}
    };

    // Initialize matchmaking parameters
    this.matchmaking = {
      maxRatingDifference: 400,
      preferredRatingDifference: 200,
      maxWaitTime: 180, // seconds
      confidenceWeight: 0.3,
      playstyleWeight: 0.2,
      queuePriority: 'balanced',
      regionPriority: true,
      pingThreshold: 150 // ms
    };

    // Initialize deck matchup data
    this.deckMatchups = [];

    // Initialize playstyle compatibility matrix
    this.playstyleCompatibility = [];

    // Initialize rewards system
    this.rewards = [
      {
        id: 'bronze_rewards',
        name: 'Bronze Rewards',
        pointsRequired: 1000,
        rewards: [{ type: 'card_pack', id: 'standard_pack', quantity: 1 }],
        icon: 'bronze_rewards.png'
      },
      {
        id: 'silver_rewards',
        name: 'Silver Rewards',
        pointsRequired: 2500,
        rewards: [
          { type: 'card_pack', id: 'standard_pack', quantity: 2 },
          { type: 'currency', id: 'gems', quantity: 100 }
        ],
        icon: 'silver_rewards.png'
      },
      {
        id: 'gold_rewards',
        name: 'Gold Rewards',
        pointsRequired: 5000,
        rewards: [
          { type: 'card_pack', id: 'standard_pack', quantity: 3 },
          { type: 'currency', id: 'gems', quantity: 250 },
          { type: 'card_style', id: 'rare_style', quantity: 1 }
        ],
        icon: 'gold_rewards.png'
      },
      {
        id: 'platinum_rewards',
        name: 'Platinum Rewards',
        pointsRequired: 10000,
        rewards: [
          { type: 'card_pack', id: 'standard_pack', quantity: 5 },
          { type: 'currency', id: 'gems', quantity: 500 },
          { type: 'card_style', id: 'rare_style', quantity: 2 },
          { type: 'avatar', id: 'season_avatar', quantity: 1 }
        ],
        icon: 'platinum_rewards.png'
      }
    ];
  }

  /**
   * Create or update a player's ranking data
   */
  registerPlayer(playerId: string, playerName: string): PlayerRankData {
    let player = this.playerData.get(playerId);
    
    if (!player) {
      // Create new player data
      player = {
        id: playerId,
        name: playerName,
        mu: this.bayesianParams.initialMu,
        sigma: this.bayesianParams.initialSigma,
        rating: this.calculateRating(this.bayesianParams.initialMu, this.bayesianParams.initialSigma),
        tier: 'bronze',
        division: 4,
        rank: 0,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        streakCurrent: 0,
        streakBest: 0,
        lastPlayed: null,
        seasonHighestRating: this.calculateRating(this.bayesianParams.initialMu, this.bayesianParams.initialSigma),
        seasonHighestTier: 'bronze',
        placementMatchesRemaining: this.options.enablePlacementMatches ? 10 : 0,
        isProvisional: true,
        confidence: 0,
        decayProtection: 28, // Days of protection from decay
        rewardPoints: 0,
        matchHistory: [],
        deckPerformance: {},
        playstyleFactors: {
          aggression: 0.5,
          consistency: 0.5,
          adaptability: 0.5,
          riskTaking: 0.5,
          patience: 0.5,
          preferredGameLength: 10, // minutes
          preferredArchetypes: []
        }
      };
      
      this.playerData.set(playerId, player);
    } else {
      // Update existing player's name if changed
      player.name = playerName;
    }
    
    return player;
  }

  /**
   * Calculate a player's display rating from their Bayesian parameters
   */
  calculateRating(mu: number, sigma: number): number {
    // Conservative rating estimate (mu - 3*sigma)
    return Math.max(0, Math.round(mu - 3 * sigma));
  }

  /**
   * Update player rankings after a match
   */
  updateRankings(
    player1Id: string,
    player2Id: string,
    result: 'player1' | 'player2' | 'draw',
    matchDetails: {
      player1Deck: string;
      player2Deck: string;
      gameTimeMinutes: number;
      player1DeckArchetype?: string;
      player2DeckArchetype?: string;
    }
  ): { player1: PlayerRankData; player2: PlayerRankData; ratingChanges: { player1: number; player2: number } } {
    const player1 = this.playerData.get(player1Id);
    const player2 = this.playerData.get(player2Id);
    
    if (!player1 || !player2) {
      throw new Error('One or both players not found');
    }
    
    // Store original ratings for change calculation
    const originalRating1 = player1.rating;
    const originalRating2 = player2.rating;
    
    // Convert match result to numerical outcome
    let outcome: number;
    if (result === 'player1') outcome = 1;
    else if (result === 'player2') outcome = 0;
    else outcome = 0.5;
    
    // Apply TrueSkill update
    const { mu: newMu1, sigma: newSigma1, mu: newMu2, sigma: newSigma2 } = 
      this.calculateBayesianUpdate(player1, player2, outcome);
    
    // Update player 1
    player1.mu = newMu1;
    player1.sigma = newSigma1;
    player1.rating = this.calculateRating(newMu1, newSigma1);
    player1.matchesPlayed++;
    player1.lastPlayed = new Date();
    
    // Update player 2
    player2.mu = newMu2;
    player2.sigma = newSigma2;
    player2.rating = this.calculateRating(newMu2, newSigma2);
    player2.matchesPlayed++;
    player2.lastPlayed = new Date();
    
    // Update win/loss records
    if (result === 'player1') {
      player1.wins++;
      player2.losses++;
      player1.streakCurrent = Math.max(0, player1.streakCurrent) + 1;
      player2.streakCurrent = Math.min(0, player2.streakCurrent) - 1;
    } else if (result === 'player2') {
      player1.losses++;
      player2.wins++;
      player1.streakCurrent = Math.min(0, player1.streakCurrent) - 1;
      player2.streakCurrent = Math.max(0, player2.streakCurrent) + 1;
    } else {
      player1.draws++;
      player2.draws++;
      player1.streakCurrent = 0;
      player2.streakCurrent = 0;
    }
    
    // Update best streaks
    player1.streakBest = Math.max(player1.streakBest, player1.streakCurrent);
    player2.streakBest = Math.max(player2.streakBest, player2.streakCurrent);
    
    // Update win rates
    player1.winRate = player1.matchesPlayed > 0 ? player1.wins / player1.matchesPlayed : 0;
    player2.winRate = player2.matchesPlayed > 0 ? player2.wins / player2.matchesPlayed : 0;
    
    // Update season highest ratings
    if (player1.rating > player1.seasonHighestRating) {
      player1.seasonHighestRating = player1.rating;
      player1.seasonHighestTier = this.getTierForRating(player1.rating);
    }
    
    if (player2.rating > player2.seasonHighestRating) {
      player2.seasonHighestRating = player2.rating;
      player2.seasonHighestTier = this.getTierForRating(player2.rating);
    }
    
    // Update placement matches
    if (player1.placementMatchesRemaining > 0) player1.placementMatchesRemaining--;
    if (player2.placementMatchesRemaining > 0) player2.placementMatchesRemaining--;
    
    // Update provisional status
    player1.isProvisional = player1.placementMatchesRemaining > 0;
    player2.isProvisional = player2.placementMatchesRemaining > 0;
    
    // Update confidence
    player1.confidence = this.calculateConfidence(player1);
    player2.confidence = this.calculateConfidence(player2);
    
    // Update tiers and divisions
    player1.tier = this.getTierForRating(player1.rating);
    player2.tier = this.getTierForRating(player2.rating);
    
    player1.division = this.getDivisionForRating(player1.rating, player1.tier);
    player2.division = this.getDivisionForRating(player2.rating, player2.tier);
    
    // Update reward points
    player1.rewardPoints += this.calculateRewardPoints(player1, result === 'player1' ? 'win' : result === 'draw' ? 'draw' : 'loss');
    player2.rewardPoints += this.calculateRewardPoints(player2, result === 'player2' ? 'win' : result === 'draw' ? 'draw' : 'loss');
    
    // Update match history
    const matchId = `match_${Date.now()}_${player1Id}_${player2Id}`;
    const timestamp = new Date();
    
    player1.matchHistory.push({
      id: matchId,
      timestamp,
      opponentId: player2Id,
      opponentName: player2.name,
      opponentRating: originalRating2,
      playerDeck: matchDetails.player1Deck,
      opponentDeck: matchDetails.player2Deck,
      result: result === 'player1' ? 'win' : result === 'player2' ? 'loss' : 'draw',
      ratingChange: player1.rating - originalRating1,
      gameTimeMinutes: matchDetails.gameTimeMinutes
    });
    
    player2.matchHistory.push({
      id: matchId,
      timestamp,
      opponentId: player1Id,
      opponentName: player1.name,
      opponentRating: originalRating1,
      playerDeck: matchDetails.player2Deck,
      opponentDeck: matchDetails.player1Deck,
      result: result === 'player2' ? 'win' : result === 'player1' ? 'loss' : 'draw',
      ratingChange: player2.rating - originalRating2,
      gameTimeMinutes: matchDetails.gameTimeMinutes
    });
    
    // Update deck performance
    this.updateDeckPerformance(player1, matchDetails.player1Deck, matchDetails.player1DeckArchetype || 'unknown', 
      result === 'player1' ? 'win' : result === 'player2' ? 'loss' : 'draw', matchDetails.gameTimeMinutes);
    
    this.updateDeckPerformance(player2, matchDetails.player2Deck, matchDetails.player2DeckArchetype || 'unknown', 
      result === 'player2' ? 'win' : result === 'player1' ? 'loss' : 'draw', matchDetails.gameTimeMinutes);
    
    // Update playstyle factors
    this.updatePlaystyleFactors(player1, player2, matchDetails, result);
    
    // Update deck matchups data
    if (matchDetails.player1DeckArchetype && matchDetails.player2DeckArchetype) {
      this.updateDeckMatchupData(
        matchDetails.player1DeckArchetype,
        matchDetails.player2DeckArchetype,
        result,
        matchDetails.gameTimeMinutes
      );
    }
    
    return {
      player1,
      player2,
      ratingChanges: {
        player1: player1.rating - originalRating1,
        player2: player2.rating - originalRating2
      }
    };
  }

  /**
   * Calculate Bayesian TrueSkill update
   */
  private calculateBayesianUpdate(
    player1: PlayerRankData,
    player2: PlayerRankData,
    outcome: number
  ): { mu1: number; sigma1: number; mu2: number; sigma2: number } {
    // Simplified TrueSkill implementation
    const { mu: mu1, sigma: sigma1 } = player1;
    const { mu: mu2, sigma: sigma2 } = player2;
    const { beta, tau } = this.bayesianParams;
    
    // Calculate match quality
    const c = Math.sqrt(2 * beta * beta + sigma1 * sigma1 + sigma2 * sigma2);
    
    // Calculate expected outcome
    const expectedOutcome = 1 / (1 + Math.exp((mu2 - mu1) / c));
    
    // Calculate K-factor (dynamic if enabled)
    let kFactor = 32;
    if (this.options.enableDynamicKFactor) {
      // Higher K-factor for provisional players, lower for established players
      const provisionalFactor = player1.isProvisional || player2.isProvisional ? 2 : 1;
      const confidenceFactor = (2 - (player1.confidence + player2.confidence) / 2);
      kFactor = 32 * provisionalFactor * confidenceFactor;
    }
    
    // Calculate rating updates
    const update1 = kFactor * (outcome - expectedOutcome);
    const update2 = kFactor * (expectedOutcome - outcome);
    
    // Calculate new mu values
    const newMu1 = mu1 + update1;
    const newMu2 = mu2 + update2;
    
    // Calculate new sigma values (uncertainty decreases with each match)
    const sigmaDelta1 = Math.max(sigma1 * 0.94, 25); // Minimum uncertainty
    const sigmaDelta2 = Math.max(sigma2 * 0.94, 25);
    
    // Add dynamic factor tau to allow for skill evolution over time
    const newSigma1 = Math.sqrt(sigmaDelta1 * sigmaDelta1 + tau * tau);
    const newSigma2 = Math.sqrt(sigmaDelta2 * sigmaDelta2 + tau * tau);
    
    return { mu1: newMu1, sigma1: newSigma1, mu2: newMu2, sigma2: newSigma2 };
  }

  /**
   * Get the tier for a given rating
   */
  private getTierForRating(rating: number): string {
    for (const [tierKey, tierData] of Object.entries(this.tiers)) {
      if (rating >= tierData.minRating && rating <= tierData.maxRating) {
        return tierKey;
      }
    }
    return 'bronze'; // Default fallback
  }

  /**
   * Get the division for a rating within a tier
   */
  private getDivisionForRating(rating: number, tier: string): number {
    const tierData = this.tiers[tier];
    if (!tierData) return 4; // Default to lowest division
    
    const tierRange = tierData.maxRating - tierData.minRating;
    const divisionSize = tierRange / 4;
    
    // Division 1 is highest, 4 is lowest
    if (rating >= tierData.minRating + divisionSize * 3) return 1;
    if (rating >= tierData.minRating + divisionSize * 2) return 2;
    if (rating >= tierData.minRating + divisionSize) return 3;
    return 4;
  }

  /**
   * Calculate confidence in a player's rating
   */
  private calculateConfidence(player: PlayerRankData): number {
    // Confidence increases with more matches and lower sigma
    const matchFactor = Math.min(1, player.matchesPlayed / 50);
    const sigmaFactor = Math.max(0, 1 - (player.sigma - 25) / (this.bayesianParams.initialSigma - 25));
    
    return (matchFactor + sigmaFactor) / 2;
  }

  /**
   * Calculate reward points for a match
   */
  private calculateRewardPoints(player: PlayerRankData, result: 'win' | 'loss' | 'draw'): number {
    if (!this.options.enableRewards) return 0;
    
    // Base points by tier
    const tierMultipliers: Record<string, number> = {
      bronze: 1,
      silver: 1.2,
      gold: 1.5,
      platinum: 1.8,
      diamond: 2.2,
      master: 2.5,
      grandmaster: 3
    };
    
    const tierMultiplier = tierMultipliers[player.tier] || 1;
    
    // Base points by result
    let basePoints = 0;
    if (result === 'win') basePoints = 100;
    else if (result === 'draw') basePoints = 50;
    else basePoints = 25; // Loss still gives some points
    
    // Streak bonus
    let streakBonus = 0;
    if (result === 'win' && player.streakCurrent > 2) {
      streakBonus = Math.min(50, player.streakCurrent * 10);
    }
    
    // Daily first win bonus
    const firstWinBonus = result === 'win' && this.isFirstWinOfDay(player) ? 150 : 0;
    
    return Math.round((basePoints * tierMultiplier) + streakBonus + firstWinBonus);
  }

  /**
   * Check if this is the player's first win of the day
   */
  private isFirstWinOfDay(player: PlayerRankData): boolean {
    if (!player.matchHistory.length) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const winsToday = player.matchHistory.filter(match => {
      const matchDate = new Date(match.timestamp);
      matchDate.setHours(0, 0, 0, 0);
      return match.result === 'win' && matchDate.getTime() === today.getTime();
    });
    
    return winsToday.length === 1;
  }

  /**
   * Update a player's deck performance
   */
  private updateDeckPerformance(
    player: PlayerRankData,
    deckId: string,
    archetype: string,
    result: 'win' | 'loss' | 'draw',
    gameTimeMinutes: number
  ): void {
    // Initialize deck performance if not exists
    if (!player.deckPerformance[deckId]) {
      player.deckPerformance[deckId] = {
        deckId,
        deckName: deckId, // Would be replaced with actual name in a real implementation
        archetype,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        averageGameTime: 0,
        lastPlayed: null
      };
    }
    
    const deckPerf = player.deckPerformance[deckId];
    
    // Update stats
    deckPerf.matchesPlayed++;
    if (result === 'win') deckPerf.wins++;
    else if (result === 'loss') deckPerf.losses++;
    else deckPerf.draws++;
    
    deckPerf.winRate = deckPerf.wins / deckPerf.matchesPlayed;
    
    // Update average game time
    deckPerf.averageGameTime = 
      (deckPerf.averageGameTime * (deckPerf.matchesPlayed - 1) + gameTimeMinutes) / 
      deckPerf.matchesPlayed;
    
    deckPerf.lastPlayed = new Date();
    
    // Update archetype (in case it changed)
    deckPerf.archetype = archetype;
  }

  /**
   * Update playstyle factors based on match results
   */
  private updatePlaystyleFactors(
    player1: PlayerRankData,
    player2: PlayerRankData,
    matchDetails: any,
    result: 'player1' | 'player2' | 'draw'
  ): void {
    if (!this.options.enablePlaystyleCompatibility) return;
    
    // This would be a complex implementation in reality
    // For now, just update preferred game length and archetypes
    
    // Update preferred game length (moving average)
    player1.playstyleFactors.preferredGameLength = 
      (player1.playstyleFactors.preferredGameLength * 0.8) + (matchDetails.gameTimeMinutes * 0.2);
    
    player2.playstyleFactors.preferredGameLength = 
      (player2.playstyleFactors.preferredGameLength * 0.8) + (matchDetails.gameTimeMinutes * 0.2);
    
    // Update preferred archetypes
    if (matchDetails.player1DeckArchetype && result === 'player1') {
      this.addPreferredArchetype(player1, matchDetails.player1DeckArchetype);
    }
    
    if (matchDetails.player2DeckArchetype && result === 'player2') {
      this.addPreferredArchetype(player2, matchDetails.player2DeckArchetype);
    }
  }

  /**
   * Add an archetype to a player's preferred archetypes
   */
  private addPreferredArchetype(player: PlayerRankData, archetype: string): void {
    if (!player.playstyleFactors.preferredArchetypes.includes(archetype)) {
      player.playstyleFactors.preferredArchetypes.push(archetype);
      
      // Keep list to a reasonable size
      if (player.playstyleFactors.preferredArchetypes.length > 5) {
        player.playstyleFactors.preferredArchetypes.shift();
      }
    }
  }

  /**
   * Update deck matchup data
   */
  private updateDeckMatchupData(
    archetype1: string,
    archetype2: string,
    result: 'player1' | 'player2' | 'draw',
    gameTimeMinutes: number
  ): void {
    // Ensure archetypes are in consistent order
    let [arch1, arch2] = [archetype1, archetype2].sort();
    let resultAdjusted = result;
    
    // If we swapped the order, adjust the result
    if (arch1 !== archetype1) {
      resultAdjusted = result === 'player1' ? 'player2' : result === 'player2' ? 'player1' : 'draw';
    }
    
    // Find existing matchup data or create new
    let matchup = this.deckMatchups.find(m => m.archetype1 === arch1 && m.archetype2 === arch2);
    
    if (!matchup) {
      matchup = {
        archetype1: arch1,
        archetype2: arch2,
        matchesPlayed: 0,
        archetype1WinRate: 0.5,
        averageGameLength: 0,
        favoredSide: 'balanced'
      };
      this.deckMatchups.push(matchup);
    }
    
    // Update matchup data
    matchup.matchesPlayed++;
    
    // Update win rate
    let arch1Wins = matchup.archetype1WinRate * (matchup.matchesPlayed - 1);
    if (resultAdjusted === 'player1') arch1Wins += 1;
    else if (resultAdjusted === 'draw') arch1Wins += 0.5;
    
    matchup.archetype1WinRate = arch1Wins / matchup.matchesPlayed;
    
    // Update average game length
    matchup.averageGameLength = 
      (matchup.averageGameLength * (matchup.matchesPlayed - 1) + gameTimeMinutes) / 
      matchup.matchesPlayed;
    
    // Update favored side
    if (matchup.archetype1WinRate > 0.55) matchup.favoredSide = 'first';
    else if (matchup.archetype1WinRate < 0.45) matchup.favoredSide = 'second';
    else matchup.favoredSide = 'balanced';
  }

  /**
   * Find a match for a player in the queue
   */
  findMatch(
    playerId: string,
    queuedPlayers: { id: string; waitTime: number; region: string; ping: number; deckArchetype?: string }[]
  ): string | null {
    if (!this.options.enableRankedPlay || queuedPlayers.length === 0) return null;
    
    const player = this.playerData.get(playerId);
    if (!player) return null;
    
    let bestMatch: { id: string; score: number } | null = null;
    
    for (const queuedPlayer of queuedPlayers) {
      if (queuedPlayer.id === playerId) continue;
      
      const opponent = this.playerData.get(queuedPlayer.id);
      if (!opponent) continue;
      
      // Calculate match score based on multiple factors
      const score = this.calculateMatchScore(player, opponent, queuedPlayer);
      
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { id: queuedPlayer.id, score };
      }
    }
    
    // Only match if score is above threshold or wait time is long enough
    const playerQueueInfo = queuedPlayers.find(p => p.id === playerId);
    const waitTime = playerQueueInfo ? playerQueueInfo.waitTime : 0;
    
    if (bestMatch && (bestMatch.score > 0.7 || waitTime > this.matchmaking.maxWaitTime / 2)) {
      return bestMatch.id;
    }
    
    return null;
  }

  /**
   * Calculate match score between two players
   */
  private calculateMatchScore(
    player1: PlayerRankData,
    player2: PlayerRankData,
    queueInfo: { waitTime: number; region: string; ping: number; deckArchetype?: string }
  ): number {
    // Rating difference factor (closer is better)
    const ratingDiff = Math.abs(player1.rating - player2.rating);
    const ratingFactor = Math.max(0, 1 - ratingDiff / this.matchmaking.maxRatingDifference);
    
    // Wait time factor (longer wait = more lenient matching)
    const waitFactor = Math.min(1, queueInfo.waitTime / this.matchmaking.maxWaitTime);
    
    // Region/ping factor
    const pingFactor = this.matchmaking.regionPriority ? 
      Math.max(0, 1 - queueInfo.ping / this.matchmaking.pingThreshold) : 1;
    
    // Confidence factor (if enabled)
    let confidenceFactor = 1;
    if (this.options.enableConfidenceBasedMatching) {
      // Prefer matching players with similar confidence levels
      const confidenceDiff = Math.abs(player1.confidence - player2.confidence);
      confidenceFactor = Math.max(0.5, 1 - confidenceDiff);
    }
    
    // Playstyle compatibility factor (if enabled)
    let playstyleFactor = 1;
    if (this.options.enablePlaystyleCompatibility) {
      // Calculate playstyle compatibility
      playstyleFactor = this.calculatePlaystyleCompatibility(player1, player2, queueInfo.deckArchetype);
    }
    
    // Combine factors with appropriate weights
    let score = 0;
    
    switch (this.matchmaking.queuePriority) {
      case 'speed':
        // Prioritize wait time
        score = (ratingFactor * 0.6) + (waitFactor * 0.3) + (pingFactor * 0.1);
        break;
      case 'quality':
        // Prioritize close matches
        score = (ratingFactor * 0.7) + (waitFactor * 0.1) + (pingFactor * 0.2);
        break;
      case 'balanced':
      default:
        // Balance all factors
        score = (ratingFactor * 0.5) + (waitFactor * 0.2) + (pingFactor * 0.1);
        break;
    }
    
    // Add confidence and playstyle factors if enabled
    if (this.options.enableConfidenceBasedMatching) {
      score = (score * (1 - this.matchmaking.confidenceWeight)) + 
        (confidenceFactor * this.matchmaking.confidenceWeight);
    }
    
    if (this.options.enablePlaystyleCompatibility) {
      score = (score * (1 - this.matchmaking.playstyleWeight)) + 
        (playstyleFactor * this.matchmaking.playstyleWeight);
    }
    
    return score;
  }

  /**
   * Calculate playstyle compatibility between two players
   */
  private calculatePlaystyleCompatibility(
    player1: PlayerRankData,
    player2: PlayerRankData,
    deckArchetype?: string
  ): number {
    // Game length preference compatibility
    const timeDiff = Math.abs(
      player1.playstyleFactors.preferredGameLength - 
      player2.playstyleFactors.preferredGameLength
    );
    const timeCompatibility = Math.max(0, 1 - timeDiff / 15); // 15 minutes difference = 0 compatibility
    
    // Archetype compatibility
    let archetypeCompatibility = 0.5; // Neutral default
    
    if (deckArchetype) {
      // Check if opponent has experience against this archetype
      const hasExperience = player2.matchHistory.some(match => 
        match.opponentDeck === deckArchetype || match.playerDeck === deckArchetype
      );
      
      // Slightly prefer matching against experienced opponents
      archetypeCompatibility = hasExperience ? 0.7 : 0.5;
    }
    
    // Playstyle factors compatibility
    const factorKeys: (keyof PlaystyleFactors)[] = [
      'aggression', 'consistency', 'adaptability', 'riskTaking', 'patience'
    ];
    
    let factorCompatibility = 0;
    
    for (const key of factorKeys) {
      // For some factors, similarity is good; for others, difference is good
      const diff = Math.abs(player1.playstyleFactors[key] - player2.playstyleFactors[key]);
      
      if (key === 'adaptability' || key === 'consistency') {
        // For these, higher values are always better for match quality
        factorCompatibility += (player1.playstyleFactors[key] + player2.playstyleFactors[key]) / 2;
      } else {
        // For others, some difference creates interesting matches
        factorCompatibility += 1 - Math.abs(diff - 0.3);
      }
    }
    
    factorCompatibility /= factorKeys.length;
    
    // Combine all compatibility factors
    return (timeCompatibility * 0.3) + (archetypeCompatibility * 0.3) + (factorCompatibility * 0.4);
  }

  /**
   * Apply rating decay for inactive players
   */
  applyRatingDecay(): void {
    if (!this.options.enableDecaySystem) return;
    
    const now = new Date();
    const decayThresholdDays = 28; // Start decay after 28 days of inactivity
    
    this.playerData.forEach(player => {
      if (!player.lastPlayed) return;
      
      const daysSinceLastPlayed = Math.floor(
        (now.getTime() - player.lastPlayed.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Skip if within protection period or threshold
      if (daysSinceLastPlayed <= player.decayProtection || daysSinceLastPlayed <= decayThresholdDays) {
        return;
      }
      
      // Calculate decay amount (increases with inactivity and rating)
      const excessDays = daysSinceLastPlayed - decayThresholdDays;
      const decayRate = 0.01; // 1% per week after threshold
      const weeksPastThreshold = Math.floor(excessDays / 7);
      
      if (weeksPastThreshold <= 0) return;
      
      // Higher ratings decay faster
      const ratingFactor = player.rating / 2000;
      const decayAmount = Math.ceil(player.rating * decayRate * weeksPastThreshold * ratingFactor);
      
      // Apply decay
      player.mu = Math.max(this.bayesianParams.initialMu - 500, player.mu - decayAmount);
      player.rating = this.calculateRating(player.mu, player.sigma);
      
      // Update tier and division
      player.tier = this.getTierForRating(player.rating);
      player.division = this.getDivisionForRating(player.rating, player.tier);
    });
  }

  /**
   * Get player ranking data
   */
  getPlayerRanking(playerId: string): PlayerRankData | null {
    return this.playerData.get(playerId) || null;
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(options: { tier?: string; limit?: number; offset?: number } = {}): PlayerRankData[] {
    const { tier, limit = 100, offset = 0 } = options;
    
    let players = Array.from(this.playerData.values());
    
    // Filter by tier if specified
    if (tier) {
      players = players.filter(p => p.tier === tier);
    }
    
    // Sort by rating
    players.sort((a, b) => b.rating - a.rating);
    
    // Apply pagination
    return players.slice(offset, offset + limit);
  }

  /**
   * Get rank distribution statistics
   */
  getRankDistribution(): Record<string, { count: number; percentage: number }> {
    const distribution: Record<string, { count: number; percentage: number }> = {};
    const totalPlayers = this.playerData.size;
    
    // Initialize with zero counts
    Object.keys(this.tiers).forEach(tier => {
      distribution[tier] = { count: 0, percentage: 0 };
    });
    
    // Count players in each tier
    this.playerData.forEach(player => {
      if (distribution[player.tier]) {
        distribution[player.tier].count++;
      }
    });
    
    // Calculate percentages
    if (totalPlayers > 0) {
      Object.keys(distribution).forEach(tier => {
        distribution[tier].percentage = (distribution[tier].count / totalPlayers) * 100;
      });
    }
    
    return distribution;
  }

  /**
   * Start a new season
   */
  startNewSeason(seasonData: Partial<SeasonData>): SeasonData {
    if (!this.options.enableSeasons) {
      throw new Error('Seasons are not enabled');
    }
    
    // End current season if active
    if (this.season.isActive) {
      this.endSeason();
    }
    
    // Create new season
    this.season = {
      id: (this.season.id || 0) + 1,
      name: seasonData.name || `Season ${(this.season.id || 0) + 1}`,
      startDate: new Date(),
      endDate: seasonData.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true,
      theme: seasonData.theme || 'default',
      rewards: seasonData.rewards || [],
      leaderboard: [],
      rankDistribution: {}
    };
    
    // Soft reset ratings for all players
    this.softResetRatings();
    
    return this.season;
  }

  /**
   * End the current season
   */
  endSeason(): SeasonData {
    if (!this.options.enableSeasons) {
      throw new Error('Seasons are not enabled');
    }
    
    if (!this.season.isActive) {
      throw new Error('No active season to end');
    }
    
    // Update season data
    this.season.isActive = false;
    this.season.endDate = new Date();
    
    // Generate final leaderboard
    this.season.leaderboard = Array.from(this.playerData.values())
      .sort((a, b) => b.rating - a.rating)
      .map(p => p.id);
    
    // Generate final rank distribution
    this.season.rankDistribution = Object.fromEntries(
      Object.entries(this.getRankDistribution()).map(([tier, data]) => [tier, data.count])
    );
    
    // Distribute season rewards
    this.distributeSeasonRewards();
    
    return this.season;
  }

  /**
   * Soft reset ratings for a new season
   */
  private softResetRatings(): void {
    this.playerData.forEach(player => {
      // Store season highest data
      player.seasonHighestRating = player.rating;
      player.seasonHighestTier = player.tier;
      
      // Reset to a rating between current and initial
      const resetPoint = this.bayesianParams.initialMu;
      const compressionFactor = 0.5; // How much to compress toward the reset point
      
      player.mu = player.mu - (player.mu - resetPoint) * compressionFactor;
      player.sigma = Math.min(player.sigma * 1.5, this.bayesianParams.initialSigma * 0.8);
      player.rating = this.calculateRating(player.mu, player.sigma);
      
      // Update tier and division
      player.tier = this.getTierForRating(player.rating);
      player.division = this.getDivisionForRating(player.rating, player.tier);
      
      // Reset season-specific stats
      player.seasonHighestRating = player.rating;
      player.seasonHighestTier = player.tier;
      
      // Reset placement matches for inactive players
      if (!player.lastPlayed || 
          (new Date().getTime() - player.lastPlayed.getTime()) > 60 * 24 * 60 * 60 * 1000) {
        player.placementMatchesRemaining = 10;
        player.isProvisional = true;
      }
    });
  }

  /**
   * Distribute season rewards
   */
  private distributeSeasonRewards(): void {
    if (!this.options.enableRewards) return;
    
    // This would connect to a rewards system in a real implementation
    // For now, just log that rewards would be distributed
    console.log('Distributing season rewards for season', this.season.id);
  }

  /**
   * Get player reward progress
   */
  getRewardProgress(playerId: string): { 
    currentPoints: number; 
    nextReward: RewardTier | null;
    progress: number;
    claimedRewards: string[];
  } {
    const player = this.playerData.get(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    
    // Find next reward tier
    const sortedRewards = [...this.rewards].sort((a, b) => a.pointsRequired - b.pointsRequired);
    const nextReward = sortedRewards.find(r => r.pointsRequired > player.rewardPoints) || null;
    
    // Calculate progress percentage
    let progress = 0;
    if (nextReward) {
      const prevReward = sortedRewards[sortedRewards.indexOf(nextReward) - 1];
      const prevPoints = prevReward ? prevReward.pointsRequired : 0;
      progress = (player.rewardPoints - prevPoints) / (nextReward.pointsRequired - prevPoints);
    } else {
      progress = 1; // All rewards claimed
    }
    
    // In a real implementation, we would track claimed rewards
    const claimedRewards: string[] = [];
    
    return {
      currentPoints: player.rewardPoints,
      nextReward,
      progress,
      claimedRewards
    };
  }
}