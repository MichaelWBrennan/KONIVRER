/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { RankingEngine } from '../engine/RankingEngine';

// Types for Tournament Matchmaking Service
interface MatchmakingSettings {
  tournamentImportanceMultiplier?: number;
  dynamicKFactorBase?: number;
  dynamicKFactorMin?: number;
  dynamicKFactorMax?: number;
  skillRatingWeight?: number;
  uncertaintyWeight?: number;
  waitTimeWeight?: number;
  geographicWeight?: number;
  historyWeight?: number;
  deckTypeWeight?: number;
  pingWeight?: number;
  preferenceWeight?: number;
  maxSkillGap?: number;
  maxWaitTime?: number;
  minMatchQuality?: number;
  roundRobinGroups?: number;
  swissRounds?: number;
  eliminationFormat?: 'single' | 'double' | 'modified';
  seedingMethod?: 'random' | 'skill' | 'performance' | 'hybrid';
  [key: string]: any;
}

interface PlayerProfile {
  id: string;
  name: string;
  skillRating: number;
  uncertainty: number;
  deckTypes: string[];
  preferredOpponents?: string[];
  blockedOpponents?: string[];
  waitTime: number;
  location?: {
    latitude: number;
    longitude: number;
    region: string;
  };
  ping?: number;
  matchHistory: string[];
  tournamentHistory: Record<string, {
    wins: number;
    losses: number;
    draws: number;
    opponents: string[];
    performance: number;
    seed?: number;
    eliminated?: boolean;
  }>;
  [key: string]: any;
}

interface MatchQuality {
  quality: number;
  factors: {
    skillFactor: number;
    uncertaintyFactor: number;
    waitTimeFactor: number;
    geographicFactor: number;
    historyFactor: number;
    deckTypeFactor: number;
    pingFactor: number;
    preferenceFactor: number;
  };
}

interface Match {
  id: string;
  tournamentId: string;
  round: number;
  player1: string;
  player2: string;
  quality: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  result?: {
    winner?: string;
    player1Score: number;
    player2Score: number;
    draws: number;
  };
  startTime?: Date;
  endTime?: Date;
  [key: string]: any;
}

interface Tournament {
  id: string;
  name: string;
  format: 'swiss' | 'single-elimination' | 'double-elimination' | 'round-robin' | 'custom';
  rounds: number;
  currentRound: number;
  players: string[];
  matches: Match[];
  standings: Array<{
    playerId: string;
    wins: number;
    losses: number;
    draws: number;
    matchPoints: number;
    gamePoints: number;
    opponentMatchWinPercentage: number;
    gameWinPercentage: number;
    opponentGameWinPercentage: number;
  }>;
  settings: MatchmakingSettings;
  [key: string]: any;
}

/**
 * Tournament Matchmaking Service
 * Integrates the Bayesian ML matchmaking system with tournament software
 */
class TournamentMatchmakingService {
  private rankingEngine: RankingEngine;
  private tournamentRankingEngines: Map<string, RankingEngine>;
  private matchCache: Map<string, MatchQuality>;
  private playerProfiles: Map<string, PlayerProfile>;
  private tournaments: Map<string, Tournament>;
  private defaultSettings: MatchmakingSettings;

  constructor() {
    this.rankingEngine = new RankingEngine();
    this.tournamentRankingEngines = new Map(); // Store tournament-specific ranking engines
    this.matchCache = new Map(); // Cache for match quality calculations
    this.playerProfiles = new Map(); // Store player profiles with tournament-specific data
    this.tournaments = new Map(); // Store tournament data
    
    // Default matchmaking settings
    this.defaultSettings = {
      tournamentImportanceMultiplier: 1.5,
      dynamicKFactorBase: 32,
      dynamicKFactorMin: 16,
      dynamicKFactorMax: 64,
      skillRatingWeight: 0.4,
      uncertaintyWeight: 0.15,
      waitTimeWeight: 0.15,
      geographicWeight: 0.05,
      historyWeight: 0.1,
      deckTypeWeight: 0.05,
      pingWeight: 0.05,
      preferenceWeight: 0.05,
      maxSkillGap: 400,
      maxWaitTime: 300, // 5 minutes in seconds
      minMatchQuality: 0.6,
      roundRobinGroups: 4,
      swissRounds: 5,
      eliminationFormat: 'single',
      seedingMethod: 'skill'
    };
  }

  /**
   * Initialize a tournament-specific ranking engine with custom settings
   * @param tournamentId - Tournament ID
   * @param settings - Tournament matchmaking settings
   */
  initializeTournamentEngine(tournamentId: string, settings: Partial<MatchmakingSettings> = {}): RankingEngine {
    // Create tournament-specific ranking engine with custom settings
    const tournamentEngine = new RankingEngine();
    
    // Customize Bayesian parameters for tournament context
    tournamentEngine.setBayesianParams({
      TOURNAMENT_IMPORTANCE_MULTIPLIER: settings.tournamentImportanceMultiplier ?? 1.5,
      DYNAMIC_K_FACTOR_BASE: settings.dynamicKFactorBase ?? 32,
      DYNAMIC_K_FACTOR_MIN: settings.dynamicKFactorMin ?? 16,
      DYNAMIC_K_FACTOR_MAX: settings.dynamicKFactorMax ?? 64
    });

    // Customize matchmaking weights for tournament context
    tournamentEngine.setMatchmakingWeights({
      skillRating: settings.skillRatingWeight ?? 0.4,
      uncertainty: settings.uncertaintyWeight ?? 0.15,
      waitTime: settings.waitTimeWeight ?? 0.15,
      geographic: settings.geographicWeight ?? 0.05,
      history: settings.historyWeight ?? 0.1,
      deckType: settings.deckTypeWeight ?? 0.05,
      ping: settings.pingWeight ?? 0.05,
      preference: settings.preferenceWeight ?? 0.05
    });

    // Store the tournament engine
    this.tournamentRankingEngines.set(tournamentId, tournamentEngine);
    
    // Create tournament entry if it doesn't exist
    if (!this.tournaments.has(tournamentId)) {
      this.tournaments.set(tournamentId, {
        id: tournamentId,
        name: `Tournament ${tournamentId}`,
        format: settings.eliminationFormat === 'double' ? 'double-elimination' : 
                settings.eliminationFormat === 'modified' ? 'custom' : 'single-elimination',
        rounds: settings.swissRounds ?? 5,
        currentRound: 0,
        players: [],
        matches: [],
        standings: [],
        settings: { ...this.defaultSettings, ...settings }
      });
    }
    
    return tournamentEngine;
  }

  /**
   * Get tournament-specific ranking engine
   * @param tournamentId - Tournament ID
   */
  getTournamentEngine(tournamentId: string): RankingEngine {
    // Get existing engine or create a new one with default settings
    if (!this.tournamentRankingEngines.has(tournamentId)) {
      return this.initializeTournamentEngine(tournamentId);
    }
    
    return this.tournamentRankingEngines.get(tournamentId)!;
  }

  /**
   * Register a player for a tournament
   * @param tournamentId - Tournament ID
   * @param player - Player profile
   */
  registerPlayer(tournamentId: string, player: Partial<PlayerProfile>): PlayerProfile {
    if (!player.id) {
      throw new Error('Player ID is required');
    }
    
    // Get or create player profile
    let playerProfile = this.playerProfiles.get(player.id);
    
    if (!playerProfile) {
      // Create new player profile
      playerProfile = {
        id: player.id,
        name: player.name || `Player ${player.id}`,
        skillRating: player.skillRating || 1500,
        uncertainty: player.uncertainty || 350,
        deckTypes: player.deckTypes || [],
        waitTime: 0,
        matchHistory: [],
        tournamentHistory: {}
      };
      
      this.playerProfiles.set(player.id, playerProfile);
    }
    
    // Initialize tournament history for this player if not exists
    if (!playerProfile.tournamentHistory[tournamentId]) {
      playerProfile.tournamentHistory[tournamentId] = {
        wins: 0,
        losses: 0,
        draws: 0,
        opponents: [],
        performance: playerProfile.skillRating
      };
    }
    
    // Add player to tournament
    const tournament = this.tournaments.get(tournamentId);
    if (tournament && !tournament.players.includes(player.id)) {
      tournament.players.push(player.id);
      
      // Initialize standings entry
      tournament.standings.push({
        playerId: player.id,
        wins: 0,
        losses: 0,
        draws: 0,
        matchPoints: 0,
        gamePoints: 0,
        opponentMatchWinPercentage: 0,
        gameWinPercentage: 0,
        opponentGameWinPercentage: 0
      });
    }
    
    return playerProfile;
  }

  /**
   * Create tournament pairings for the current round
   * @param tournamentId - Tournament ID
   */
  createPairings(tournamentId: string): Match[] {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament ${tournamentId} not found`);
    }
    
    // Increment round
    tournament.currentRound++;
    const currentRound = tournament.currentRound;
    
    // Get active players (not eliminated)
    const activePlayers = tournament.players.filter(playerId => {
      const playerTournamentHistory = this.playerProfiles.get(playerId)?.tournamentHistory[tournamentId];
      return !playerTournamentHistory?.eliminated;
    });
    
    // Different pairing strategies based on tournament format
    let pairings: Array<[string, string]> = [];
    
    switch (tournament.format) {
      case 'swiss':
        pairings = this.createSwissPairings(tournamentId, activePlayers);
        break;
      case 'single-elimination':
      case 'double-elimination':
        pairings = this.createEliminationPairings(tournamentId, activePlayers, tournament.format);
        break;
      case 'round-robin':
        pairings = this.createRoundRobinPairings(tournamentId, activePlayers, currentRound);
        break;
      default:
        pairings = this.createCustomPairings(tournamentId, activePlayers);
    }
    
    // Create match objects
    const matches: Match[] = pairings.map(([player1, player2], index) => {
      const matchId = `${tournamentId}_R${currentRound}_M${index + 1}`;
      const quality = this.calculateMatchQuality(tournamentId, player1, player2).quality;
      
      const match: Match = {
        id: matchId,
        tournamentId,
        round: currentRound,
        player1,
        player2,
        quality,
        status: 'pending',
        result: {
          player1Score: 0,
          player2Score: 0,
          draws: 0
        }
      };
      
      return match;
    });
    
    // Add matches to tournament
    tournament.matches.push(...matches);
    
    return matches;
  }

  /**
   * Create Swiss tournament pairings
   * @param tournamentId - Tournament ID
   * @param players - List of player IDs
   */
  private createSwissPairings(tournamentId: string, players: string[]): Array<[string, string]> {
    const tournament = this.tournaments.get(tournamentId)!;
    
    // Sort players by match points, then by tiebreakers
    const sortedPlayers = [...players].sort((a, b) => {
      const standingA = tournament.standings.find(s => s.playerId === a)!;
      const standingB = tournament.standings.find(s => s.playerId === b)!;
      
      // Primary sort by match points
      if (standingA.matchPoints !== standingB.matchPoints) {
        return standingB.matchPoints - standingA.matchPoints;
      }
      
      // Secondary sort by opponent match win percentage (strength of schedule)
      if (standingA.opponentMatchWinPercentage !== standingB.opponentMatchWinPercentage) {
        return standingB.opponentMatchWinPercentage - standingA.opponentMatchWinPercentage;
      }
      
      // Tertiary sort by game win percentage
      if (standingA.gameWinPercentage !== standingB.gameWinPercentage) {
        return standingB.gameWinPercentage - standingA.gameWinPercentage;
      }
      
      // Final sort by opponent game win percentage
      return standingB.opponentGameWinPercentage - standingA.opponentGameWinPercentage;
    });
    
    const pairings: Array<[string, string]> = [];
    const paired = new Set<string>();
    
    // Group players by match points
    const pointGroups: Record<number, string[]> = {};
    
    sortedPlayers.forEach(playerId => {
      const standing = tournament.standings.find(s => s.playerId === playerId)!;
      const points = standing.matchPoints;
      
      if (!pointGroups[points]) {
        pointGroups[points] = [];
      }
      
      pointGroups[points].push(playerId);
    });
    
    // Pair within each point group, starting from the top
    const pointValues = Object.keys(pointGroups).map(Number).sort((a, b) => b - a);
    
    for (const points of pointValues) {
      const group = pointGroups[points].filter(p => !paired.has(p));
      
      // If odd number of players, move one to next group
      if (group.length % 2 !== 0) {
        const lastPlayer = group.pop()!;
        
        // Find next point group
        const nextPointIndex = pointValues.indexOf(points) + 1;
        if (nextPointIndex < pointValues.length) {
          const nextPoints = pointValues[nextPointIndex];
          pointGroups[nextPoints].unshift(lastPlayer);
          continue;
        } else {
          // No next group, this player gets a bye
          paired.add(lastPlayer);
          continue;
        }
      }
      
      // Pair players within the group
      while (group.length >= 2) {
        const player1 = group[0];
        
        // Find best opponent who hasn't played against player1 yet
        let bestOpponentIndex = -1;
        let bestQuality = -1;
        
        for (let i = 1; i < group.length; i++) {
          const player2 = group[i];
          
          // Check if they've already played
          const alreadyPlayed = this.havePlayedInTournament(tournamentId, player1, player2);
          
          if (!alreadyPlayed) {
            const quality = this.calculateMatchQuality(tournamentId, player1, player2).quality;
            
            if (quality > bestQuality) {
              bestQuality = quality;
              bestOpponentIndex = i;
            }
          }
        }
        
        // If no valid opponent found, pick the first available
        if (bestOpponentIndex === -1) {
          bestOpponentIndex = 1;
        }
        
        const player2 = group[bestOpponentIndex];
        
        // Create pairing
        pairings.push([player1, player2]);
        paired.add(player1);
        paired.add(player2);
        
        // Remove paired players from group
        group.splice(bestOpponentIndex, 1);
        group.splice(0, 1);
      }
    }
    
    // Handle any remaining unpaired player (should only happen with odd total)
    const unpaired = sortedPlayers.filter(p => !paired.has(p));
    if (unpaired.length === 1) {
      // Give a bye (no opponent)
      const playerId = unpaired[0];
      
      // Record a bye as a win
      const standing = tournament.standings.find(s => s.playerId === playerId)!;
      standing.wins += 1;
      standing.matchPoints += 3;
      
      const playerHistory = this.playerProfiles.get(playerId)!.tournamentHistory[tournamentId];
      playerHistory.wins += 1;
    }
    
    return pairings;
  }

  /**
   * Create elimination tournament pairings
   * @param tournamentId - Tournament ID
   * @param players - List of player IDs
   * @param format - Elimination format
   */
  private createEliminationPairings(
    tournamentId: string, 
    players: string[], 
    format: 'single-elimination' | 'double-elimination'
  ): Array<[string, string]> {
    const tournament = this.tournaments.get(tournamentId)!;
    const currentRound = tournament.currentRound;
    
    // First round: seed players
    if (currentRound === 1) {
      return this.createSeededPairings(tournamentId, players);
    }
    
    // Subsequent rounds: pair winners against winners
    const pairings: Array<[string, string]> = [];
    const previousRoundMatches = tournament.matches.filter(m => m.round === currentRound - 1);
    
    // Get winners from previous round
    const winners = previousRoundMatches
      .filter(m => m.status === 'completed' && m.result?.winner)
      .map(m => m.result!.winner!);
    
    // Pair winners
    for (let i = 0; i < winners.length; i += 2) {
      if (i + 1 < winners.length) {
        pairings.push([winners[i], winners[i + 1]]);
      }
    }
    
    // For double elimination, handle losers bracket
    if (format === 'double-elimination') {
      // Get losers from previous round
      const losers = previousRoundMatches
        .filter(m => m.status === 'completed' && m.result?.winner)
        .map(m => m.result!.winner === m.player1 ? m.player2 : m.player1);
      
      // Pair losers
      for (let i = 0; i < losers.length; i += 2) {
        if (i + 1 < losers.length) {
          pairings.push([losers[i], losers[i + 1]]);
        }
      }
    }
    
    return pairings;
  }

  /**
   * Create seeded pairings for the first round of elimination tournaments
   * @param tournamentId - Tournament ID
   * @param players - List of player IDs
   */
  private createSeededPairings(tournamentId: string, players: string[]): Array<[string, string]> {
    const tournament = this.tournaments.get(tournamentId)!;
    const seedingMethod = tournament.settings.seedingMethod || 'skill';
    
    // Sort players based on seeding method
    let seededPlayers: string[];
    
    switch (seedingMethod) {
      case 'random':
        seededPlayers = this.shuffleArray([...players]);
        break;
      case 'skill':
        seededPlayers = [...players].sort((a, b) => {
          const profileA = this.playerProfiles.get(a)!;
          const profileB = this.playerProfiles.get(b)!;
          return profileB.skillRating - profileA.skillRating;
        });
        break;
      case 'performance':
        seededPlayers = [...players].sort((a, b) => {
          const historyA = this.playerProfiles.get(a)!.tournamentHistory[tournamentId];
          const historyB = this.playerProfiles.get(b)!.tournamentHistory[tournamentId];
          return historyB.performance - historyA.performance;
        });
        break;
      case 'hybrid':
        seededPlayers = [...players].sort((a, b) => {
          const profileA = this.playerProfiles.get(a)!;
          const profileB = this.playerProfiles.get(b)!;
          const historyA = profileA.tournamentHistory[tournamentId];
          const historyB = profileB.tournamentHistory[tournamentId];
          
          // Combine skill rating and tournament performance
          const scoreA = (profileA.skillRating * 0.7) + (historyA.performance * 0.3);
          const scoreB = (profileB.skillRating * 0.7) + (historyB.performance * 0.3);
          
          return scoreB - scoreA;
        });
        break;
      default:
        seededPlayers = [...players];
    }
    
    // Assign seeds
    seededPlayers.forEach((playerId, index) => {
      const playerHistory = this.playerProfiles.get(playerId)!.tournamentHistory[tournamentId];
      playerHistory.seed = index + 1;
    });
    
    // Create optimal bracket pairings (1 vs 16, 8 vs 9, 5 vs 12, etc.)
    const pairings: Array<[string, string]> = [];
    const n = seededPlayers.length;
    
    // Ensure we have a power of 2 number of players
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(n)));
    
    // Give byes to top seeds if needed
    if (n < nextPowerOf2) {
      const byesNeeded = nextPowerOf2 - n;
      
      // Mark top seeds with byes
      for (let i = 0; i < byesNeeded; i++) {
        const playerId = seededPlayers[i];
        
        // Record a bye as a win
        const standing = tournament.standings.find(s => s.playerId === playerId)!;
        standing.wins += 1;
        standing.matchPoints += 3;
        
        const playerHistory = this.playerProfiles.get(playerId)!.tournamentHistory[tournamentId];
        playerHistory.wins += 1;
      }
      
      // Remove players with byes from seeding
      seededPlayers = seededPlayers.slice(byesNeeded);
    }
    
    // Create pairings using standard bracket ordering
    for (let i = 0; i < seededPlayers.length / 2; i++) {
      const highSeed = seededPlayers[i];
      const lowSeed = seededPlayers[seededPlayers.length - 1 - i];
      pairings.push([highSeed, lowSeed]);
    }
    
    return pairings;
  }

  /**
   * Create round-robin tournament pairings
   * @param tournamentId - Tournament ID
   * @param players - List of player IDs
   * @param round - Current round
   */
  private createRoundRobinPairings(
    tournamentId: string, 
    players: string[], 
    round: number
  ): Array<[string, string]> {
    // Ensure even number of players (add dummy if needed)
    const n = players.length;
    const adjustedPlayers = [...players];
    
    if (n % 2 !== 0) {
      adjustedPlayers.push('BYE');
    }
    
    const pairings: Array<[string, string]> = [];
    const m = adjustedPlayers.length;
    
    // Use circle method for round robin scheduling
    // Keep first player fixed, rotate all others
    const fixed = adjustedPlayers[0];
    const rotating = adjustedPlayers.slice(1);
    
    // Calculate rotation for current round
    // For round r, rotate r-1 positions
    for (let i = 0; i < round - 1; i++) {
      rotating.unshift(rotating.pop()!);
    }
    
    // Create pairings
    pairings.push([fixed, rotating[0]]);
    
    for (let i = 1; i < m / 2; i++) {
      pairings.push([rotating[i], rotating[m - 1 - i]]);
    }
    
    // Filter out pairings with BYE
    return pairings.filter(([p1, p2]) => p1 !== 'BYE' && p2 !== 'BYE') as Array<[string, string]>;
  }

  /**
   * Create custom pairings for non-standard tournament formats
   * @param tournamentId - Tournament ID
   * @param players - List of player IDs
   */
  private createCustomPairings(tournamentId: string, players: string[]): Array<[string, string]> {
    // Default to skill-based matchmaking
    const pairings: Array<[string, string]> = [];
    const paired = new Set<string>();
    
    // Sort players by skill rating
    const sortedPlayers = [...players].sort((a, b) => {
      const profileA = this.playerProfiles.get(a)!;
      const profileB = this.playerProfiles.get(b)!;
      return profileB.skillRating - profileA.skillRating;
    });
    
    // Create pairings
    for (let i = 0; i < sortedPlayers.length; i++) {
      if (paired.has(sortedPlayers[i])) continue;
      
      const player1 = sortedPlayers[i];
      paired.add(player1);
      
      // Find best opponent
      let bestOpponent = '';
      let bestQuality = -1;
      
      for (let j = 0; j < sortedPlayers.length; j++) {
        if (i === j || paired.has(sortedPlayers[j])) continue;
        
        const player2 = sortedPlayers[j];
        const quality = this.calculateMatchQuality(tournamentId, player1, player2).quality;
        
        if (quality > bestQuality) {
          bestQuality = quality;
          bestOpponent = player2;
        }
      }
      
      if (bestOpponent) {
        pairings.push([player1, bestOpponent]);
        paired.add(bestOpponent);
      }
    }
    
    return pairings;
  }

  /**
   * Calculate match quality between two players
   * @param tournamentId - Tournament ID
   * @param player1Id - First player ID
   * @param player2Id - Second player ID
   */
  calculateMatchQuality(tournamentId: string, player1Id: string, player2Id: string): MatchQuality {
    // Check cache first
    const cacheKey = `${tournamentId}|${player1Id}|${player2Id}`;
    const reverseCacheKey = `${tournamentId}|${player2Id}|${player1Id}`;
    
    if (this.matchCache.has(cacheKey)) {
      return this.matchCache.get(cacheKey)!;
    }
    
    if (this.matchCache.has(reverseCacheKey)) {
      return this.matchCache.get(reverseCacheKey)!;
    }
    
    // Get player profiles
    const player1 = this.playerProfiles.get(player1Id);
    const player2 = this.playerProfiles.get(player2Id);
    
    if (!player1 || !player2) {
      throw new Error(`Player profiles not found for ${player1Id} or ${player2Id}`);
    }
    
    // Get tournament engine
    const engine = this.getTournamentEngine(tournamentId);
    
    // Get tournament settings
    const tournament = this.tournaments.get(tournamentId);
    const settings = tournament?.settings || this.defaultSettings;
    
    // Calculate factors
    
    // 1. Skill factor - how close are the players in skill
    const skillDiff = Math.abs(player1.skillRating - player2.skillRating);
    const maxSkillGap = settings.maxSkillGap || 400;
    const skillFactor = Math.max(0, 1 - (skillDiff / maxSkillGap));
    
    // 2. Uncertainty factor - prefer matches that reduce uncertainty
    const combinedUncertainty = player1.uncertainty + player2.uncertainty;
    const maxUncertainty = 700; // Two new players
    const uncertaintyFactor = combinedUncertainty / maxUncertainty;
    
    // 3. Wait time factor - players waiting longer get priority
    const combinedWaitTime = player1.waitTime + player2.waitTime;
    const maxWaitTime = settings.maxWaitTime || 300; // 5 minutes
    const waitTimeFactor = Math.min(1, combinedWaitTime / maxWaitTime);
    
    // 4. Geographic factor - prefer players in same region
    let geographicFactor = 0.5; // Default if location not available
    
    if (player1.location && player2.location) {
      if (player1.location.region === player2.location.region) {
        geographicFactor = 1.0;
      } else {
        // Calculate distance-based factor
        const distance = this.calculateDistance(
          player1.location.latitude, player1.location.longitude,
          player2.location.latitude, player2.location.longitude
        );
        
        // Max distance considered is 5000km
        geographicFactor = Math.max(0, 1 - (distance / 5000));
      }
    }
    
    // 5. History factor - prefer players who haven't played each other recently
    const history1 = player1.tournamentHistory[tournamentId];
    const history2 = player2.tournamentHistory[tournamentId];
    
    let historyFactor = 1.0;
    
    if (history1 && history2) {
      // Check if they've played each other in this tournament
      const hasPlayed = history1.opponents.includes(player2Id) || history2.opponents.includes(player1Id);
      
      if (hasPlayed) {
        historyFactor = 0.2; // Strong preference against rematches
      } else {
        // Check recent matches in general
        const recentOpponents1 = player1.matchHistory.slice(-5);
        const recentOpponents2 = player2.matchHistory.slice(-5);
        
        if (recentOpponents1.includes(player2Id) || recentOpponents2.includes(player1Id)) {
          historyFactor = 0.5; // Some preference against recent matches
        }
      }
    }
    
    // 6. Deck type factor - prefer variety in deck matchups
    let deckTypeFactor = 0.5; // Default
    
    if (player1.deckTypes.length > 0 && player2.deckTypes.length > 0) {
      // Check for deck type variety
      const player1MainDeck = player1.deckTypes[0];
      const player2MainDeck = player2.deckTypes[0];
      
      if (player1MainDeck !== player2MainDeck) {
        deckTypeFactor = 1.0; // Different deck types preferred
      } else {
        deckTypeFactor = 0.3; // Same deck types less preferred
      }
    }
    
    // 7. Ping factor - prefer lower ping for better gameplay
    let pingFactor = 0.5; // Default
    
    if (player1.ping !== undefined && player2.ping !== undefined) {
      const avgPing = (player1.ping + player2.ping) / 2;
      // Lower ping is better (max considered is 300ms)
      pingFactor = Math.max(0, 1 - (avgPing / 300));
    }
    
    // 8. Preference factor - consider player preferences
    let preferenceFactor = 0.5; // Default
    
    // Check preferred/blocked opponents
    if (player1.preferredOpponents?.includes(player2Id) || player2.preferredOpponents?.includes(player1Id)) {
      preferenceFactor = 1.0;
    } else if (player1.blockedOpponents?.includes(player2Id) || player2.blockedOpponents?.includes(player1Id)) {
      preferenceFactor = 0.0;
    }
    
    // Calculate weighted quality
    const weights = {
      skillFactor: settings.skillRatingWeight || 0.4,
      uncertaintyFactor: settings.uncertaintyWeight || 0.15,
      waitTimeFactor: settings.waitTimeWeight || 0.15,
      geographicFactor: settings.geographicWeight || 0.05,
      historyFactor: settings.historyWeight || 0.1,
      deckTypeFactor: settings.deckTypeWeight || 0.05,
      pingFactor: settings.pingWeight || 0.05,
      preferenceFactor: settings.preferenceWeight || 0.05
    };
    
    const factors = {
      skillFactor,
      uncertaintyFactor,
      waitTimeFactor,
      geographicFactor,
      historyFactor,
      deckTypeFactor,
      pingFactor,
      preferenceFactor
    };
    
    let quality = 0;
    let totalWeight = 0;
    
    for (const [factor, value] of Object.entries(factors)) {
      const weight = weights[factor as keyof typeof weights];
      quality += value * weight;
      totalWeight += weight;
    }
    
    // Normalize quality
    quality = totalWeight > 0 ? quality / totalWeight : 0.5;
    
    // Cache the result
    const result: MatchQuality = { quality, factors };
    this.matchCache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Record match result
   * @param tournamentId - Tournament ID
   * @param matchId - Match ID
   * @param result - Match result
   */
  recordMatchResult(
    tournamentId: string, 
    matchId: string, 
    result: { 
      player1Score: number; 
      player2Score: number; 
      draws: number;
    }
  ): void {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament ${tournamentId} not found`);
    }
    
    // Find the match
    const matchIndex = tournament.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      throw new Error(`Match ${matchId} not found in tournament ${tournamentId}`);
    }
    
    const match = tournament.matches[matchIndex];
    
    // Update match result
    match.result = {
      ...result,
      winner: result.player1Score > result.player2Score ? match.player1 : 
              result.player2Score > result.player1Score ? match.player2 : 
              undefined
    };
    
    match.status = 'completed';
    match.endTime = new Date();
    
    // Update player tournament history
    const player1 = this.playerProfiles.get(match.player1);
    const player2 = this.playerProfiles.get(match.player2);
    
    if (player1 && player2) {
      // Update match history
      player1.matchHistory.push(match.player2);
      player2.matchHistory.push(match.player1);
      
      // Update tournament history
      const history1 = player1.tournamentHistory[tournamentId];
      const history2 = player2.tournamentHistory[tournamentId];
      
      if (history1 && history2) {
        // Record opponents
        if (!history1.opponents.includes(match.player2)) {
          history1.opponents.push(match.player2);
        }
        
        if (!history2.opponents.includes(match.player1)) {
          history2.opponents.push(match.player1);
        }
        
        // Update win/loss/draw records
        if (result.player1Score > result.player2Score) {
          history1.wins++;
          history2.losses++;
        } else if (result.player2Score > result.player1Score) {
          history1.losses++;
          history2.wins++;
        } else {
          history1.draws++;
          history2.draws++;
        }
      }
      
      // Update tournament standings
      const standing1 = tournament.standings.find(s => s.playerId === match.player1);
      const standing2 = tournament.standings.find(s => s.playerId === match.player2);
      
      if (standing1 && standing2) {
        // Update win/loss/draw records
        if (result.player1Score > result.player2Score) {
          standing1.wins++;
          standing2.losses++;
          standing1.matchPoints += 3;
        } else if (result.player2Score > result.player1Score) {
          standing1.losses++;
          standing2.wins++;
          standing2.matchPoints += 3;
        } else {
          standing1.draws++;
          standing2.draws++;
          standing1.matchPoints += 1;
          standing2.matchPoints += 1;
        }
        
        // Update game points
        standing1.gamePoints += result.player1Score;
        standing2.gamePoints += result.player2Score;
      }
      
      // Update Bayesian ratings
      const tournamentEngine = this.getTournamentEngine(tournamentId);
      
      tournamentEngine.updateRatings(
        match.player1,
        match.player2,
        result.player1Score > result.player2Score ? 1 :
        result.player2Score > result.player1Score ? 0 :
        0.5
      );
      
      // Get updated ratings
      const ratings = tournamentEngine.getRatings();
      
      // Update player profiles with new ratings
      if (ratings[match.player1]) {
        player1.skillRating = ratings[match.player1].rating;
        player1.uncertainty = ratings[match.player1].uncertainty;
        history1.performance = player1.skillRating;
      }
      
      if (ratings[match.player2]) {
        player2.skillRating = ratings[match.player2].rating;
        player2.uncertainty = ratings[match.player2].uncertainty;
        history2.performance = player2.skillRating;
      }
    }
    
    // Update tournament
    tournament.matches[matchIndex] = match;
    
    // Update tiebreakers
    this.updateTournamentTiebreakers(tournamentId);
    
    // Clear match cache as ratings have changed
    this.matchCache.clear();
  }

  /**
   * Update tournament tiebreakers
   * @param tournamentId - Tournament ID
   */
  private updateTournamentTiebreakers(tournamentId: string): void {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return;
    
    // Calculate tiebreakers for each player
    tournament.standings.forEach(standing => {
      const playerId = standing.playerId;
      
      // Calculate match win percentage
      const matches = standing.wins + standing.losses + standing.draws;
      const matchWinPercentage = matches > 0 ? 
        (standing.wins + (standing.draws * 0.5)) / matches : 0;
      
      // Calculate game win percentage
      const totalGames = standing.gamePoints + 
        tournament.matches
          .filter(m => m.status === 'completed' && (m.player1 === playerId || m.player2 === playerId))
          .reduce((sum, match) => {
            if (match.player1 === playerId) {
              return sum + (match.result?.player2Score || 0);
            } else {
              return sum + (match.result?.player1Score || 0);
            }
          }, 0);
      
      const gameWinPercentage = totalGames > 0 ? standing.gamePoints / totalGames : 0;
      
      // Calculate opponent match win percentage
      const opponents = tournament.matches
        .filter(m => m.status === 'completed' && (m.player1 === playerId || m.player2 === playerId))
        .map(m => m.player1 === playerId ? m.player2 : m.player1);
      
      let opponentMatchWinPercentage = 0;
      
      if (opponents.length > 0) {
        const opponentWinPercentages = opponents.map(opponentId => {
          const opponentStanding = tournament.standings.find(s => s.playerId === opponentId);
          if (!opponentStanding) return 0;
          
          const opponentMatches = opponentStanding.wins + opponentStanding.losses + opponentStanding.draws;
          return opponentMatches > 0 ? 
            (opponentStanding.wins + (opponentStanding.draws * 0.5)) / opponentMatches : 0;
        });
        
        opponentMatchWinPercentage = opponentWinPercentages.reduce((sum, pct) => sum + pct, 0) / opponents.length;
      }
      
      // Calculate opponent game win percentage
      let opponentGameWinPercentage = 0;
      
      if (opponents.length > 0) {
        const opponentGameWinPercentages = opponents.map(opponentId => {
          const opponentStanding = tournament.standings.find(s => s.playerId === opponentId);
          if (!opponentStanding) return 0;
          
          const opponentTotalGames = opponentStanding.gamePoints + 
            tournament.matches
              .filter(m => m.status === 'completed' && (m.player1 === opponentId || m.player2 === opponentId))
              .reduce((sum, match) => {
                if (match.player1 === opponentId) {
                  return sum + (match.result?.player2Score || 0);
                } else {
                  return sum + (match.result?.player1Score || 0);
                }
              }, 0);
          
          return opponentTotalGames > 0 ? opponentStanding.gamePoints / opponentTotalGames : 0;
        });
        
        opponentGameWinPercentage = opponentGameWinPercentages.reduce((sum, pct) => sum + pct, 0) / opponents.length;
      }
      
      // Update standing
      standing.gameWinPercentage = gameWinPercentage;
      standing.opponentMatchWinPercentage = opponentMatchWinPercentage;
      standing.opponentGameWinPercentage = opponentGameWinPercentage;
    });
  }

  /**
   * Get tournament standings
   * @param tournamentId - Tournament ID
   */
  getTournamentStandings(tournamentId: string): Array<{
    playerId: string;
    playerName: string;
    wins: number;
    losses: number;
    draws: number;
    matchPoints: number;
    gamePoints: number;
    opponentMatchWinPercentage: number;
    gameWinPercentage: number;
    opponentGameWinPercentage: number;
    rank: number;
  }> {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament ${tournamentId} not found`);
    }
    
    // Sort standings by match points, then by tiebreakers
    const sortedStandings = [...tournament.standings].sort((a, b) => {
      // Primary sort by match points
      if (a.matchPoints !== b.matchPoints) {
        return b.matchPoints - a.matchPoints;
      }
      
      // Secondary sort by opponent match win percentage
      if (a.opponentMatchWinPercentage !== b.opponentMatchWinPercentage) {
        return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
      }
      
      // Tertiary sort by game win percentage
      if (a.gameWinPercentage !== b.gameWinPercentage) {
        return b.gameWinPercentage - a.gameWinPercentage;
      }
      
      // Final sort by opponent game win percentage
      return b.opponentGameWinPercentage - a.opponentGameWinPercentage;
    });
    
    // Add player names and ranks
    return sortedStandings.map((standing, index) => {
      const player = this.playerProfiles.get(standing.playerId);
      
      return {
        ...standing,
        playerName: player?.name || `Player ${standing.playerId}`,
        rank: index + 1
      };
    });
  }

  /**
   * Get tournament matches
   * @param tournamentId - Tournament ID
   * @param round - Optional round filter
   */
  getTournamentMatches(tournamentId: string, round?: number): Match[] {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament ${tournamentId} not found`);
    }
    
    let matches = [...tournament.matches];
    
    // Filter by round if specified
    if (round !== undefined) {
      matches = matches.filter(m => m.round === round);
    }
    
    return matches;
  }

  /**
   * Get player tournament history
   * @param tournamentId - Tournament ID
   * @param playerId - Player ID
   */
  getPlayerTournamentHistory(tournamentId: string, playerId: string): {
    wins: number;
    losses: number;
    draws: number;
    opponents: string[];
    performance: number;
    seed?: number;
    eliminated?: boolean;
    matches: Match[];
  } {
    const player = this.playerProfiles.get(playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }
    
    const history = player.tournamentHistory[tournamentId];
    if (!history) {
      throw new Error(`Player ${playerId} has no history in tournament ${tournamentId}`);
    }
    
    // Get player's matches
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament ${tournamentId} not found`);
    }
    
    const matches = tournament.matches.filter(
      m => m.player1 === playerId || m.player2 === playerId
    );
    
    return {
      ...history,
      matches
    };
  }

  /**
   * Check if two players have played each other in a tournament
   * @param tournamentId - Tournament ID
   * @param player1Id - First player ID
   * @param player2Id - Second player ID
   */
  havePlayedInTournament(tournamentId: string, player1Id: string, player2Id: string): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return false;
    }
    
    return tournament.matches.some(
      m => m.status === 'completed' && 
           ((m.player1 === player1Id && m.player2 === player2Id) || 
            (m.player1 === player2Id && m.player2 === player1Id))
    );
  }

  /**
   * Calculate distance between two geographic points
   * @param lat1 - Latitude of first point
   * @param lon1 - Longitude of first point
   * @param lat2 - Latitude of second point
   * @param lon2 - Longitude of second point
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    
    return distance;
  }

  /**
   * Convert degrees to radians
   * @param deg - Degrees
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   * @param array - Array to shuffle
   */
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result;
  }

  /**
   * Clear match cache
   */
  clearMatchCache(): void {
    this.matchCache.clear();
  }

  /**
   * Get tournament by ID
   * @param tournamentId - Tournament ID
   */
  getTournament(tournamentId: string): Tournament | undefined {
    return this.tournaments.get(tournamentId);
  }

  /**
   * Get all tournaments
   */
  getAllTournaments(): Tournament[] {
    return Array.from(this.tournaments.values());
  }

  /**
   * Update tournament settings
   * @param tournamentId - Tournament ID
   * @param settings - New settings
   */
  updateTournamentSettings(tournamentId: string, settings: Partial<MatchmakingSettings>): void {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament ${tournamentId} not found`);
    }
    
    tournament.settings = {
      ...tournament.settings,
      ...settings
    };
    
    // Update tournament engine if it exists
    if (this.tournamentRankingEngines.has(tournamentId)) {
      this.initializeTournamentEngine(tournamentId, tournament.settings);
    }
  }

  /**
   * End tournament and finalize results
   * @param tournamentId - Tournament ID
   */
  endTournament(tournamentId: string): void {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament ${tournamentId} not found`);
    }
    
    // Mark any incomplete matches as cancelled
    tournament.matches.forEach(match => {
      if (match.status === 'pending' || match.status === 'active') {
        match.status = 'cancelled';
      }
    });
    
    // Calculate final standings
    this.updateTournamentTiebreakers(tournamentId);
    
    // Clean up resources
    this.tournamentRankingEngines.delete(tournamentId);
  }
}

// Create singleton instance
const tournamentMatchmakingService = new TournamentMatchmakingService();

export default tournamentMatchmakingService;