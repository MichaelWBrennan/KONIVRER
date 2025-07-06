/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Advanced Tournament Engine for KONIVRER
 * Implements dynamic Swiss pairings, adaptive tournament structures,
 * meta-balancing incentives, tiered entry systems, and parallel bracket systems
 */

interface TournamentOptions {
  enableDynamicSwissPairings?: boolean;
  enableAdaptiveTournamentStructures?: boolean;
  enableMetaBalancingIncentives?: boolean;
  enableTieredEntrySystems?: boolean;
  enableParallelBracketSystems?: boolean;
}

interface TournamentFormat {
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  recommendedRounds: (playerCount: number) => number | { swiss: number; elimination: number };
  pairingMethod: string;
  eliminationType: string;
}

interface TournamentTemplate {
  name: string;
  format: string;
  rounds: number | { swiss: number; elimination: number } | 'auto';
  topCut: number;
  timePerRound: number;
  description: string;
}

interface EntryTier {
  name: string;
  requirements: any;
  description: string;
}

interface MetaIncentives {
  underrepresentedBonus: number;
  diversityBonus: number;
  innovationBonus: number;
  thresholdForUnderrepresented: number;
}

interface Player {
  id: string;
  name: string;
  deckArchetype?: string;
  matches?: any[];
  wins?: number;
  losses?: number;
  draws?: number;
  matchPoints?: number;
  opponentMatchWinPercentage?: number;
  gameWinPercentage?: number;
  dropped?: boolean;
  standing?: number;
  tiebreakers?: {
    metaBonus?: number;
  };
}

interface TournamentRounds {
  main: number;
  swiss?: number;
  elimination?: number;
}

interface Bracket {
  matches: any[];
  currentRound: number;
}

interface TimeConstraints {
  estimatedEndTime: Date;
  roundTimeRemaining: number;
  isTimeLimited: boolean;
}

interface Tournament {
  id: string;
  name: string;
  format: string;
  players: Player[];
  rounds: TournamentRounds;
  currentRound: number;
  matches: any[];
  topCut: number;
  timePerRound: number;
  startTime: Date;
  endTime: Date | null;
  location: string;
  organizer: string;
  description: string;
  status: 'created' | 'in_progress' | 'completed';
  entryRequirements: any;
  metaBalancingEnabled: boolean;
  adaptiveStructureEnabled: boolean;
  parallelBracketsEnabled: boolean;
  brackets: {
    main: Bracket;
    consolation: Bracket | null;
  };
  metaBreakdown?: any[];
  timeConstraints?: TimeConstraints;
}

interface TournamentCreateOptions {
  name: string;
  format?: string;
  players?: Player[];
  rounds?: number | { swiss: number; elimination: number } | 'auto';
  topCut?: number;
  timePerRound?: number;
  startTime?: Date;
  location?: string;
  organizer?: string;
  description?: string;
  entryRequirements?: any;
  metaBalancingEnabled?: boolean;
  adaptiveStructureEnabled?: boolean;
  parallelBracketsEnabled?: boolean;
  timeLimited?: boolean;
}

export class TournamentEngine {
  private options: TournamentOptions;
  private formats: Record<string, TournamentFormat>;
  private templates: Record<string, TournamentTemplate>;
  private metaIncentives: MetaIncentives;
  private entryTiers: Record<string, EntryTier>;
  private currentTournament: Tournament | null;

  constructor(options: TournamentOptions = {}) {
    this.options = {
      enableDynamicSwissPairings: true,
      enableAdaptiveTournamentStructures: true,
      enableMetaBalancingIncentives: true,
      enableTieredEntrySystems: true,
      enableParallelBracketSystems: true,
      ...options
    };

    // Tournament formats
    this.formats = {
      swiss: {
        name: 'Swiss',
        description:
          'Players are paired based on their record, with no eliminations',
        minPlayers: 8,
        maxPlayers: 256,
        recommendedRounds: playerCount => Math.ceil(Math.log2(playerCount)) + 1,
        pairingMethod: 'record',
        eliminationType: 'none'
      },
      singleElimination: {
        name: 'Single Elimination',
        description: 'Players are eliminated after a single loss',
        minPlayers: 4,
        maxPlayers: 128,
        recommendedRounds: playerCount => Math.ceil(Math.log2(playerCount)),
        pairingMethod: 'bracket',
        eliminationType: 'single'
      },
      doubleElimination: {
        name: 'Double Elimination',
        description: 'Players are eliminated after two losses',
        minPlayers: 4,
        maxPlayers: 64,
        recommendedRounds: playerCount => Math.ceil(Math.log2(playerCount)) * 2 - 1,
        pairingMethod: 'bracket',
        eliminationType: 'double'
      },
      roundRobin: {
        name: 'Round Robin',
        description: 'Every player plays against every other player',
        minPlayers: 4,
        maxPlayers: 16,
        recommendedRounds: playerCount => playerCount - 1,
        pairingMethod: 'roundRobin',
        eliminationType: 'none'
      },
      hybrid: {
        name: 'Hybrid',
        description: 'Swiss rounds followed by single elimination top cut',
        minPlayers: 8,
        maxPlayers: 128,
        recommendedRounds: playerCount => ({
          swiss: Math.ceil(Math.log2(playerCount)),
          elimination: Math.log2(Math.min(8, playerCount / 4))
        }),
        pairingMethod: 'hybrid',
        eliminationType: 'hybrid'
      },
      adaptiveSwiss: {
        name: 'Adaptive Swiss',
        description:
          'Swiss rounds with dynamic pairings based on meta diversity',
        minPlayers: 8,
        maxPlayers: 256,
        recommendedRounds: playerCount => Math.ceil(Math.log2(playerCount)) + 1,
        pairingMethod: 'adaptiveSwiss',
        eliminationType: 'none'
      },
      parallelBrackets: {
        name: 'Parallel Brackets',
        description: 'Main and consolation brackets run simultaneously',
        minPlayers: 8,
        maxPlayers: 64,
        recommendedRounds: playerCount => Math.ceil(Math.log2(playerCount)) * 1.5,
        pairingMethod: 'parallelBrackets',
        eliminationType: 'parallel'
      }
    };

    // Tournament templates
    this.templates = {
      localTournament: {
        name: 'Local Tournament',
        format: 'swiss',
        rounds: 4,
        topCut: 8,
        timePerRound: 50, // minutes
        description: 'Standard local tournament with Swiss rounds and top cut'
      },
      quickDraft: {
        name: 'Quick Draft',
        format: 'singleElimination',
        rounds: 3,
        topCut: 0,
        timePerRound: 40,
        description: 'Quick draft tournament with single elimination'
      },
      championshipSeries: {
        name: 'Championship Series',
        format: 'hybrid',
        rounds: { swiss: 6, elimination: 3 },
        topCut: 8,
        timePerRound: 60,
        description: 'Championship series with Swiss rounds and top cut'
      },
      casualLeague: {
        name: 'Casual League',
        format: 'roundRobin',
        rounds: 'auto',
        topCut: 0,
        timePerRound: 45,
        description: 'Casual league with round robin pairings'
      },
      adaptiveTournament: {
        name: 'Adaptive Tournament',
        format: 'adaptiveSwiss',
        rounds: 'auto',
        topCut: 4,
        timePerRound: 50,
        description:
          'Tournament that adapts to player count and time constraints'
      },
      parallelEvent: {
        name: 'Parallel Event',
        format: 'parallelBrackets',
        rounds: 'auto',
        topCut: 0,
        timePerRound: 45,
        description:
          'Event with main and consolation brackets running in parallel'
      }
    };

    // Meta-balancing incentives
    this.metaIncentives = {
      underrepresentedBonus: 0.2, // 20% bonus points for underrepresented archetypes
      diversityBonus: 0.1, // 10% bonus for each unique archetype in top 8
      innovationBonus: 0.15, // 15% bonus for new/innovative decks
      thresholdForUnderrepresented: 0.1, // Archetypes below 10% of meta are underrepresented
    };

    // Tiered entry system
    this.entryTiers = {
      open: {
        name: 'Open Entry',
        requirements: null,
        description: 'Open to all players'
      },
      bronze: {
        name: 'Bronze Qualifier',
        requirements: { rating: 1200 },
        description: 'For bronze tier players and above'
      },
      silver: {
        name: 'Silver Qualifier',
        requirements: { rating: 1600 },
        description: 'For silver tier players and above'
      },
      gold: {
        name: 'Gold Qualifier',
        requirements: { rating: 2000 },
        description: 'For gold tier players and above'
      },
      invitational: {
        name: 'Invitational',
        requirements: { invitation: true },
        description: 'By invitation only'
      }
    };

    // Current tournament data
    this.currentTournament = null;
  }

  /**
   * Create a new tournament with the specified options
   */
  createTournament(options: TournamentCreateOptions): Tournament {
    const {
      name,
      format = 'swiss',
      players = [],
      rounds = 'auto',
      topCut = 0,
      timePerRound = 50,
      startTime = new Date(),
      location = 'Local',
      organizer = 'Tournament Organizer',
      description = '',
      entryRequirements = null,
      metaBalancingEnabled = this.options.enableMetaBalancingIncentives,
      adaptiveStructureEnabled = this.options.enableAdaptiveTournamentStructures,
      parallelBracketsEnabled = this.options.enableParallelBracketSystems,
      timeLimited = false
    } = options;

    // Validate format
    if (!this.formats[format]) {
      throw new Error(`Invalid tournament format: ${format}`);
    }

    // Calculate recommended rounds if auto
    let calculatedRounds: number | { swiss: number; elimination: number } = 
      typeof rounds === 'string' && rounds === 'auto' ? 3 : rounds;
    
    if (rounds === 'auto') {
      const formatInfo = this.formats[format];
      if (typeof formatInfo.recommendedRounds === 'function') {
        calculatedRounds = formatInfo.recommendedRounds(players.length);
      }
    }

    // Create tournament object
    const tournament: Tournament = {
      id: `tournament_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      format,
      players: players.map(player => ({
        ...player,
        matches: [],
        wins: 0,
        losses: 0,
        draws: 0,
        matchPoints: 0,
        opponentMatchWinPercentage: 0,
        gameWinPercentage: 0,
        dropped: false,
        standing: 0,
        tiebreakers: {
          metaBonus: 0
        }
      })),
      rounds: typeof calculatedRounds === 'object' 
        ? { main: 0, ...calculatedRounds } 
        : { main: calculatedRounds },
      currentRound: 0,
      matches: [],
      topCut,
      timePerRound,
      startTime,
      endTime: null,
      location,
      organizer,
      description,
      status: 'created',
      entryRequirements,
      metaBalancingEnabled,
      adaptiveStructureEnabled,
      parallelBracketsEnabled,
      brackets: {
        main: { matches: [], currentRound: 0 },
        consolation: parallelBracketsEnabled ? { matches: [], currentRound: 0 } : null
      },
      timeConstraints: {
        estimatedEndTime: new Date(
          startTime.getTime() + timePerRound * (typeof calculatedRounds === 'object' ? 
            (calculatedRounds.swiss || 0) + (calculatedRounds.elimination || 0) : 
            calculatedRounds) * 60 * 1000
        ),
        roundTimeRemaining: timePerRound * 60, // in seconds
        isTimeLimited: timeLimited
      }
    };

    // Apply adaptive structure if enabled
    if (adaptiveStructureEnabled) {
      this.adaptTournamentStructure(tournament);
    }

    // Calculate meta breakdown if meta balancing is enabled
    if (metaBalancingEnabled) {
      tournament.metaBreakdown = this.calculateMetaBreakdown(tournament.players);
    }

    this.currentTournament = tournament;
    return tournament;
  }

  /**
   * Adapt tournament structure based on player count and time constraints
   */
  adaptTournamentStructure(tournament: Tournament): Tournament {
    const playerCount = tournament.players.length;

    // Adjust format based on player count
    if (playerCount <= 8) {
      // For very small tournaments, use round robin
      tournament.format = 'roundRobin';
      tournament.rounds = { main: playerCount - 1 };
    } else if (playerCount <= 16) {
      // For small tournaments, use Swiss with no top cut
      tournament.format = 'swiss';
      tournament.rounds = { main: Math.ceil(Math.log2(playerCount)) + 1 };
      tournament.topCut = 0;
    } else if (playerCount <= 32) {
      // For medium tournaments, use Swiss with top 4
      tournament.format = 'swiss';
      tournament.rounds = { main: Math.ceil(Math.log2(playerCount)) + 1 };
      tournament.topCut = 4;
    } else if (playerCount <= 64) {
      // For large tournaments, use Swiss with top 8
      tournament.format = 'swiss';
      tournament.rounds = { main: Math.ceil(Math.log2(playerCount)) + 1 };
      tournament.topCut = 8;
    } else {
      // For very large tournaments, use hybrid with top 8
      tournament.format = 'hybrid';
      tournament.rounds = {
        main: 0,
        swiss: Math.ceil(Math.log2(playerCount)),
        elimination: 3, // Top 8
      };
      tournament.topCut = 8;
    }

    // Adjust based on time constraints
    if (tournament.timeConstraints && tournament.timeConstraints.isTimeLimited) {
      const availableMinutes =
        (tournament.timeConstraints.estimatedEndTime.getTime() - tournament.startTime.getTime()) /
        (60 * 1000);
      const maxRounds = Math.floor(availableMinutes / tournament.timePerRound);

      if (maxRounds < tournament.rounds.main) {
        // Reduce rounds if time is limited
        tournament.rounds.main = maxRounds;

        // Adjust top cut based on reduced rounds
        if (tournament.topCut > 0) {
          tournament.topCut = Math.min(
            tournament.topCut,
            Math.pow(2, Math.floor(maxRounds / 2))
          );
        }
      }
    }

    // Enable parallel brackets for medium to large tournaments if time is limited
    if (playerCount >= 32 && tournament.timeConstraints && tournament.timeConstraints.isTimeLimited) {
      tournament.format = 'parallelBrackets';
    }

    return tournament;
  }

  /**
   * Calculate meta breakdown from player decks
   */
  calculateMetaBreakdown(players: Player[]): any[] {
    const deckCounts: Record<string, number> = {};
    let totalDecks = 0;

    // Count deck archetypes
    players.forEach(player => {
      if (player.deckArchetype) {
        deckCounts[player.deckArchetype] = (deckCounts[player.deckArchetype] || 0) + 1;
        totalDecks++;
      }
    });

    // Calculate percentages
    const metaBreakdown = Object.keys(deckCounts).map(archetype => {
      const count = deckCounts[archetype];
      const percentage = (count / totalDecks) * 100;

      return {
        archetype,
        count,
        percentage,
        isUnderrepresented:
          percentage < this.metaIncentives.thresholdForUnderrepresented * 100
      };
    });

    // Sort by percentage (descending)
    metaBreakdown.sort((a, b) => b.percentage - a.percentage);

    return metaBreakdown;
  }

  /**
   * Start the tournament
   */
  startTournament(): Tournament {
    if (!this.currentTournament) {
      throw new Error('No tournament has been created');
    }

    if (this.currentTournament.status !== 'created') {
      throw new Error(`Tournament is already ${this.currentTournament.status}`);
    }

    // Update tournament status
    this.currentTournament.status = 'in_progress';
    this.currentTournament.currentRound = 1;

    // Create pairings for the first round
    this.createPairings();
    
    return this.currentTournament;
  }

  /**
   * Create pairings for the current round
   */
  createPairings(): any[] {
    const tournament = this.currentTournament;
    if (!tournament) {
      throw new Error('No tournament has been created');
    }

    if (tournament.status !== 'in_progress') {
      throw new Error(`Cannot create pairings for a tournament that is ${tournament.status}`);
    }

    // Get active players (not dropped)
    const activePlayers = tournament.players.filter(player => !player.dropped);

    // Different pairing methods based on format
    let pairings: any[] = [];
    
    switch (tournament.format) {
      case 'swiss':
        pairings = this.createSwissPairings(activePlayers, tournament.currentRound);
        break;
        
      case 'singleElimination':
      case 'doubleElimination':
        pairings = this.createEliminationPairings(activePlayers, tournament);
        break;
        
      case 'roundRobin':
        pairings = this.createRoundRobinPairings(activePlayers, tournament.currentRound);
        break;
        
      case 'hybrid':
        // Swiss rounds first, then elimination
        if (tournament.currentRound <= (tournament.rounds.swiss || 0)) {
          pairings = this.createSwissPairings(activePlayers, tournament.currentRound);
        } else {
          // Create top cut for elimination rounds
          pairings = this.createEliminationPairings(
            this.getTopPlayers(tournament.players, tournament.topCut),
            tournament
          );
        }
        break;
        
      case 'adaptiveSwiss':
        pairings = this.createAdaptiveSwissPairings(activePlayers, tournament);
        break;
        
      case 'parallelBrackets':
        // Create pairings for both main and consolation brackets
        const mainBracketPairings = this.createEliminationPairings(
          this.getTopPlayers(tournament.players, tournament.players.length / 2),
          tournament,
          'main'
        );
        
        const consolationBracketPairings = this.createEliminationPairings(
          tournament.players.filter(p => !this.getTopPlayers(tournament.players, tournament.players.length / 2).includes(p)),
          tournament,
          'consolation'
        );
        
        pairings = [...mainBracketPairings, ...consolationBracketPairings];
        break;
        
      default:
        throw new Error(`Unsupported tournament format: ${tournament.format}`);
    }

    // Add pairings to tournament
    tournament.matches.push(...pairings);
    
    // Add to appropriate bracket
    if (tournament.format === 'parallelBrackets') {
      // Split pairings between main and consolation brackets
      const mainPairings = pairings.filter(p => p.bracket === 'main');
      const consolationPairings = pairings.filter(p => p.bracket === 'consolation');
      
      tournament.brackets.main.matches.push(...mainPairings);
      if (tournament.brackets.consolation) {
        tournament.brackets.consolation.matches.push(...consolationPairings);
      }
    } else if (tournament.format === 'hybrid' && tournament.currentRound > (tournament.rounds.swiss || 0)) {
      // Add to main bracket for elimination rounds
      tournament.brackets.main.matches.push(...pairings);
      tournament.brackets.main.currentRound = tournament.currentRound - (tournament.rounds.swiss || 0);
    } else {
      // Add to main bracket for all other formats
      tournament.brackets.main.matches.push(...pairings);
      tournament.brackets.main.currentRound = tournament.currentRound;
    }

    return pairings;
  }

  /**
   * Create Swiss pairings
   */
  private createSwissPairings(players: Player[], round: number): any[] {
    // First round is random
    if (round === 1) {
      return this.createRandomPairings(players);
    }
    
    // Sort players by match points (wins * 3 + draws)
    const sortedPlayers = [...players].sort((a, b) => {
      const aPoints = (a.matchPoints || 0);
      const bPoints = (b.matchPoints || 0);
      
      if (aPoints !== bPoints) {
        return bPoints - aPoints; // Higher points first
      }
      
      // Tiebreakers
      const aTiebreaker = (a.opponentMatchWinPercentage || 0);
      const bTiebreaker = (b.opponentMatchWinPercentage || 0);
      
      return bTiebreaker - aTiebreaker;
    });
    
    // Create pairings by matching players with similar records
    const pairings: any[] = [];
    const paired: Set<string> = new Set();
    
    for (let i = 0; i < sortedPlayers.length; i++) {
      const player = sortedPlayers[i];
      
      if (paired.has(player.id)) continue;
      
      // Find the next unpaired player with the same record if possible
      let opponent = null;
      for (let j = i + 1; j < sortedPlayers.length; j++) {
        const potentialOpponent = sortedPlayers[j];
        
        if (!paired.has(potentialOpponent.id) && 
            !this.havePlayedBefore(player, potentialOpponent)) {
          opponent = potentialOpponent;
          break;
        }
      }
      
      // If no suitable opponent found, pair with the next available player
      if (!opponent && i + 1 < sortedPlayers.length) {
        for (let j = i + 1; j < sortedPlayers.length; j++) {
          if (!paired.has(sortedPlayers[j].id)) {
            opponent = sortedPlayers[j];
            break;
          }
        }
      }
      
      // Create pairing if opponent found
      if (opponent) {
        paired.add(player.id);
        paired.add(opponent.id);
        
        pairings.push({
          id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          round,
          player1: player,
          player2: opponent,
          result: null,
          status: 'pending',
          bracket: 'main'
        });
      } else if (!paired.has(player.id)) {
        // Player gets a bye
        paired.add(player.id);
        
        pairings.push({
          id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          round,
          player1: player,
          player2: null, // Bye
          result: { winner: player.id, player1Score: 2, player2Score: 0 },
          status: 'completed',
          bracket: 'main'
        });
        
        // Award points for bye
        player.wins = (player.wins || 0) + 1;
        player.matchPoints = (player.matchPoints || 0) + 3;
      }
    }
    
    return pairings;
  }

  /**
   * Create random pairings (for first round)
   */
  private createRandomPairings(players: Player[]): any[] {
    // Shuffle players
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    
    // Create pairings
    const pairings: any[] = [];
    
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        // Regular pairing
        pairings.push({
          id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          round: 1,
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
          result: null,
          status: 'pending',
          bracket: 'main'
        });
      } else {
        // Odd number of players, last player gets a bye
        pairings.push({
          id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          round: 1,
          player1: shuffledPlayers[i],
          player2: null, // Bye
          result: { winner: shuffledPlayers[i].id, player1Score: 2, player2Score: 0 },
          status: 'completed',
          bracket: 'main'
        });
        
        // Award points for bye
        shuffledPlayers[i].wins = (shuffledPlayers[i].wins || 0) + 1;
        shuffledPlayers[i].matchPoints = (shuffledPlayers[i].matchPoints || 0) + 3;
      }
    }
    
    return pairings;
  }

  /**
   * Create elimination bracket pairings
   */
  private createEliminationPairings(players: Player[], tournament: Tournament, bracket: string = 'main'): any[] {
    // Implementation would depend on the specific tournament structure
    // This is a simplified version
    
    // For the first elimination round, seed players based on Swiss results
    if ((bracket === 'main' && tournament.brackets.main.currentRound === 0) ||
        (bracket === 'consolation' && tournament.brackets.consolation && tournament.brackets.consolation.currentRound === 0)) {
      
      // Sort players by standings
      const seededPlayers = [...players].sort((a, b) => (a.standing || 0) - (b.standing || 0));
      
      // Create pairings (1 vs 8, 2 vs 7, etc. for 8 players)
      const pairings: any[] = [];
      const numPlayers = seededPlayers.length;
      
      for (let i = 0; i < numPlayers / 2; i++) {
        pairings.push({
          id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          round: 1,
          player1: seededPlayers[i],
          player2: seededPlayers[numPlayers - 1 - i],
          result: null,
          status: 'pending',
          bracket
        });
      }
      
      return pairings;
    }
    
    // For subsequent rounds, pair winners from previous round
    // This would require tracking winners from previous rounds
    // Simplified implementation
    return [];
  }

  /**
   * Create round robin pairings
   */
  private createRoundRobinPairings(players: Player[], round: number): any[] {
    // Round robin algorithm (circle method)
    // For n players, each player plays n-1 rounds
    const numPlayers = players.length;
    
    // If odd number of players, add a "bye" player
    const effectivePlayers = numPlayers % 2 === 1 ? [...players, null] : [...players];
    const numEffectivePlayers = effectivePlayers.length;
    
    // Create pairings for this round
    const pairings: any[] = [];
    
    // In the circle method, player 0 stays fixed and others rotate
    const fixedPlayer = effectivePlayers[0];
    const rotatingPlayers = effectivePlayers.slice(1);
    
    // Rotate players based on the round
    for (let i = 1; i < round; i++) {
      rotatingPlayers.unshift(rotatingPlayers.pop() as Player);
    }
    
    // Create pairings
    pairings.push({
      id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      round,
      player1: fixedPlayer,
      player2: rotatingPlayers[0],
      result: null,
      status: 'pending',
      bracket: 'main'
    });
    
    for (let i = 1; i < numEffectivePlayers / 2; i++) {
      const player1 = rotatingPlayers[i];
      const player2 = rotatingPlayers[numEffectivePlayers - 1 - i];
      
      if (player1 && player2) {
        pairings.push({
          id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          round,
          player1,
          player2,
          result: null,
          status: 'pending',
          bracket: 'main'
        });
      }
    }
    
    return pairings;
  }

  /**
   * Create adaptive Swiss pairings that consider meta diversity
   */
  private createAdaptiveSwissPairings(players: Player[], tournament: Tournament): any[] {
    // Base pairings on Swiss algorithm
    const basePairings = this.createSwissPairings(players, tournament.currentRound);
    
    // If meta balancing is not enabled, return base pairings
    if (!tournament.metaBalancingEnabled) {
      return basePairings;
    }
    
    // Try to avoid pairing same archetypes if possible
    // This would be more complex in a real implementation
    return basePairings;
  }

  /**
   * Check if two players have played before
   */
  private havePlayedBefore(player1: Player, player2: Player): boolean {
    if (!player1.matches || !player2.matches) return false;
    
    return player1.matches.some((match: any) => 
      match.player1Id === player2.id || match.player2Id === player2.id
    );
  }

  /**
   * Get top N players by standings
   */
  private getTopPlayers(players: Player[], count: number): Player[] {
    return [...players]
      .sort((a, b) => {
        // Sort by match points first
        const aPoints = (a.matchPoints || 0);
        const bPoints = (b.matchPoints || 0);
        
        if (aPoints !== bPoints) {
          return bPoints - aPoints;
        }
        
        // Then by tiebreakers
        const aTiebreaker = (a.opponentMatchWinPercentage || 0);
        const bTiebreaker = (b.opponentMatchWinPercentage || 0);
        
        return bTiebreaker - aTiebreaker;
      })
      .slice(0, count);
  }

  /**
   * Record a match result
   */
  recordMatchResult(matchId: string, result: { winner: string; player1Score: number; player2Score: number }): Tournament {
    if (!this.currentTournament) {
      throw new Error('No tournament has been created');
    }
    
    // Find the match
    const match = this.currentTournament.matches.find(m => m.id === matchId);
    if (!match) {
      throw new Error(`Match not found: ${matchId}`);
    }
    
    // Update match result
    match.result = result;
    match.status = 'completed';
    
    // Update player records
    const player1 = this.currentTournament.players.find(p => p.id === match.player1.id);
    const player2 = match.player2 ? this.currentTournament.players.find(p => p.id === match.player2.id) : null;
    
    if (player1 && player2) {
      // Regular match
      if (result.winner === player1.id) {
        player1.wins = (player1.wins || 0) + 1;
        player1.matchPoints = (player1.matchPoints || 0) + 3;
        player2.losses = (player2.losses || 0) + 1;
      } else if (result.winner === player2.id) {
        player2.wins = (player2.wins || 0) + 1;
        player2.matchPoints = (player2.matchPoints || 0) + 3;
        player1.losses = (player1.losses || 0) + 1;
      } else {
        // Draw
        player1.draws = (player1.draws || 0) + 1;
        player2.draws = (player2.draws || 0) + 1;
        player1.matchPoints = (player1.matchPoints || 0) + 1;
        player2.matchPoints = (player2.matchPoints || 0) + 1;
      }
      
      // Update match history
      if (player1.matches) {
        player1.matches.push({
          matchId,
          round: match.round,
          player1Id: player1.id,
          player2Id: player2.id,
          result
        });
      }
      
      if (player2.matches) {
        player2.matches.push({
          matchId,
          round: match.round,
          player1Id: player2.id,
          player2Id: player1.id,
          result: {
            winner: result.winner,
            player1Score: result.player2Score,
            player2Score: result.player1Score
          }
        });
      }
    } else if (player1) {
      // Bye
      // Points already awarded when creating the pairing
    }
    
    // Check if all matches in the current round are completed
    const currentRoundMatches = this.currentTournament.matches.filter(
      m => m.round === this.currentTournament!.currentRound
    );
    
    const allMatchesCompleted = currentRoundMatches.every(m => m.status === 'completed');
    
    if (allMatchesCompleted) {
      // Update tiebreakers
      this.updateTiebreakers();
      
      // Check if tournament is complete
      if (this.isTournamentComplete()) {
        this.completeTournament();
      }
    }
    
    return this.currentTournament;
  }

  /**
   * Update tiebreakers for all players
   */
  private updateTiebreakers(): void {
    if (!this.currentTournament) return;
    
    // Calculate opponent match win percentage (OMW%)
    this.currentTournament.players.forEach(player => {
      if (!player.matches) return;
      
      const opponents = player.matches.map(match => 
        match.player1Id === player.id ? match.player2Id : match.player1Id
      );
      
      const opponentWinPercentages = opponents.map(opponentId => {
        const opponent = this.currentTournament!.players.find(p => p.id === opponentId);
        if (!opponent) return 0;
        
        const totalMatches = (opponent.wins || 0) + (opponent.losses || 0) + (opponent.draws || 0);
        if (totalMatches === 0) return 0;
        
        return ((opponent.wins || 0) + (opponent.draws || 0) * 0.5) / totalMatches;
      });
      
      // Average of opponent win percentages
      player.opponentMatchWinPercentage = opponentWinPercentages.length > 0 
        ? opponentWinPercentages.reduce((sum, pct) => sum + pct, 0) / opponentWinPercentages.length
        : 0;
      
      // Apply meta bonus if enabled
      if (this.currentTournament.metaBalancingEnabled && player.deckArchetype && this.currentTournament.metaBreakdown) {
        const archetypeInfo = this.currentTournament.metaBreakdown.find(
          meta => meta.archetype === player.deckArchetype
        );
        
        if (archetypeInfo && archetypeInfo.isUnderrepresented && player.tiebreakers) {
          player.tiebreakers.metaBonus = this.metaIncentives.underrepresentedBonus;
        }
      }
    });
    
    // Update standings
    this.updateStandings();
  }

  /**
   * Update player standings
   */
  private updateStandings(): void {
    if (!this.currentTournament) return;
    
    // Sort players by match points, then tiebreakers
    const sortedPlayers = [...this.currentTournament.players].sort((a, b) => {
      // Match points (3 for win, 1 for draw)
      const aPoints = (a.matchPoints || 0);
      const bPoints = (b.matchPoints || 0);
      
      if (aPoints !== bPoints) {
        return bPoints - aPoints;
      }
      
      // Opponent match win percentage
      const aOMW = (a.opponentMatchWinPercentage || 0);
      const bOMW = (b.opponentMatchWinPercentage || 0);
      
      if (aOMW !== bOMW) {
        return bOMW - aOMW;
      }
      
      // Game win percentage
      const aGWP = (a.gameWinPercentage || 0);
      const bGWP = (b.gameWinPercentage || 0);
      
      if (aGWP !== bGWP) {
        return bGWP - aGWP;
      }
      
      // Meta bonus (if applicable)
      const aMetaBonus = (a.tiebreakers?.metaBonus || 0);
      const bMetaBonus = (b.tiebreakers?.metaBonus || 0);
      
      return bMetaBonus - aMetaBonus;
    });
    
    // Assign standings
    sortedPlayers.forEach((player, index) => {
      player.standing = index + 1;
    });
  }

  /**
   * Check if the tournament is complete
   */
  private isTournamentComplete(): boolean {
    if (!this.currentTournament) return false;
    
    const format = this.currentTournament.format;
    const currentRound = this.currentTournament.currentRound;
    
    // Check if we've reached the final round
    if (format === 'hybrid') {
      return currentRound >= (this.currentTournament.rounds.swiss || 0) + (this.currentTournament.rounds.elimination || 0);
    } else {
      return currentRound >= this.currentTournament.rounds.main;
    }
  }

  /**
   * Complete the tournament
   */
  private completeTournament(): void {
    if (!this.currentTournament) return;
    
    this.currentTournament.status = 'completed';
    this.currentTournament.endTime = new Date();
    
    // Final standings are already calculated in updateStandings
  }

  /**
   * Advance to the next round
   */
  advanceToNextRound(): Tournament {
    if (!this.currentTournament) {
      throw new Error('No tournament has been created');
    }
    
    if (this.currentTournament.status !== 'in_progress') {
      throw new Error(`Cannot advance a tournament that is ${this.currentTournament.status}`);
    }
    
    // Check if all matches in the current round are completed
    const currentRoundMatches = this.currentTournament.matches.filter(
      m => m.round === this.currentTournament!.currentRound
    );
    
    const allMatchesCompleted = currentRoundMatches.every(m => m.status === 'completed');
    
    if (!allMatchesCompleted) {
      throw new Error('Cannot advance to next round until all matches are completed');
    }
    
    // Increment round
    this.currentTournament.currentRound++;
    
    // Check if tournament is complete
    if (this.isTournamentComplete()) {
      this.completeTournament();
      return this.currentTournament;
    }
    
    // Create pairings for the next round
    this.createPairings();
    
    return this.currentTournament;
  }

  /**
   * Drop a player from the tournament
   */
  dropPlayer(playerId: string): Tournament {
    if (!this.currentTournament) {
      throw new Error('No tournament has been created');
    }
    
    const player = this.currentTournament.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player not found: ${playerId}`);
    }
    
    player.dropped = true;
    
    // If there are pending matches for this player, mark them as completed
    const pendingMatches = this.currentTournament.matches.filter(
      m => m.status === 'pending' && 
          ((m.player1 && m.player1.id === playerId) || 
           (m.player2 && m.player2.id === playerId))
    );
    
    pendingMatches.forEach(match => {
      if (match.player1 && match.player1.id === playerId) {
        // Player 1 dropped, player 2 wins
        this.recordMatchResult(match.id, {
          winner: match.player2 ? match.player2.id : '',
          player1Score: 0,
          player2Score: 2
        });
      } else if (match.player2 && match.player2.id === playerId) {
        // Player 2 dropped, player 1 wins
        this.recordMatchResult(match.id, {
          winner: match.player1.id,
          player1Score: 2,
          player2Score: 0
        });
      }
    });
    
    return this.currentTournament;
  }

  /**
   * Get the current tournament
   */
  getCurrentTournament(): Tournament | null {
    return this.currentTournament;
  }

  /**
   * Get available tournament formats
   */
  getAvailableFormats(): Record<string, TournamentFormat> {
    return this.formats;
  }

  /**
   * Get tournament templates
   */
  getTournamentTemplates(): Record<string, TournamentTemplate> {
    return this.templates;
  }

  /**
   * Get entry tiers
   */
  getEntryTiers(): Record<string, EntryTier> {
    return this.entryTiers;
  }
}

export default TournamentEngine;