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

interface Tournament {
  id: string;
  name: string;
  format: string;
  players: Player[];
  rounds: { main: number } | { swiss: number; elimination: number };
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
    main: { matches: any[]; currentRound: number };
    consolation: { matches: any[]; currentRound: number } | null;
  };
  metaBreakdown?: any;
  timeConstraints?: {
    estimatedEndTime: Date;
    roundTimeRemaining: number;
    isTimeLimited: boolean;
  };
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
  createTournament(options: {
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
  }): Tournament {
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
      parallelBracketsEnabled = this.options.enableParallelBracketSystems
    } = options;

    // Validate format
    if (!this.formats[format]) {
      throw new Error(`Invalid tournament format: ${format}`);
    }

    // Calculate recommended rounds if auto
    let calculatedRounds: any = rounds;
    if (rounds === 'auto') {
      const formatInfo = this.formats[format];
      if (typeof formatInfo.recommendedRounds === 'function') {
        calculatedRounds = formatInfo.recommendedRounds(players.length);
      } else {
        calculatedRounds = 3; // Default fallback
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
      rounds: typeof calculatedRounds === 'object' ? calculatedRounds : { main: calculatedRounds },
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
            calculatedRounds.swiss + calculatedRounds.elimination : 
            calculatedRounds) * 60 * 1000
        ),
        roundTimeRemaining: timePerRound * 60, // in seconds
        isTimeLimited: options.timeLimited || false
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

      if (maxRounds < (tournament.rounds as any).main) {
        // Reduce rounds if time is limited
        (tournament.rounds as any).main = maxRounds;

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
      throw new Error(`Cannot create pairings for ${tournament.status} tournament`);
    }

    const round = tournament.currentRound;
    const format = tournament.format;
    const activePlayers = tournament.players.filter(p => !p.dropped);
    let pairings: any[] = [];

    // Choose pairing method based on format
    switch (this.formats[format].pairingMethod) {
      case 'record':
        pairings = this.createSwissPairings(activePlayers, round);
        break;
      case 'bracket':
        pairings = this.createBracketPairings(activePlayers, round, this.formats[format].eliminationType);
        break;
      case 'roundRobin':
        pairings = this.createRoundRobinPairings(activePlayers, round);
        break;
      case 'hybrid':
        if (round <= (tournament.rounds as any).swiss) {
          pairings = this.createSwissPairings(activePlayers, round);
        } else {
          // Create top cut bracket
          if (round === (tournament.rounds as any).swiss + 1) {
            // First elimination round - create the bracket
            const topPlayers = this.getTopPlayers(tournament.topCut);
            pairings = this.createBracketPairings(topPlayers, 1, 'single');
          } else {
            // Continue elimination rounds
            pairings = this.createBracketPairings(
              null,
              round - (tournament.rounds as any).swiss,
              'single'
            );
          }
        }
        break;
      case 'adaptiveSwiss':
        pairings = this.createAdaptiveSwissPairings(activePlayers, round);
        break;
      case 'parallelBrackets':
        pairings = this.createParallelBracketPairings(activePlayers, round);
        break;
      default:
        pairings = this.createSwissPairings(activePlayers, round);
    }

    // Create match objects
    const matches = pairings.map((pairing, index) => {
      return {
        id: `match_${tournament.id}_R${round}_${index}`,
        roundNumber: round,
        player1Id: pairing.player1.id,
        player2Id: pairing.player2 ? pairing.player2.id : null, // Handle byes
        player1: pairing.player1,
        player2: pairing.player2,
        result: null,
        games: [],
        isBye: !pairing.player2,
        bracket: pairing.bracket || 'main',
        table: index + 1,
        status: 'pending',
        startTime: null,
        endTime: null,
        metaBonus: this.calculateMetaBonus(pairing.player1, pairing.player2),
      };
    });

    // Add matches to tournament
    tournament.matches = [...tournament.matches, ...matches];

    // Add matches to appropriate bracket
    matches.forEach(match => {
      if (match.bracket === 'main') {
        tournament.brackets.main.matches.push(match);
      } else if (tournament.brackets.consolation) {
        tournament.brackets.consolation.matches.push(match);
      }
    });

    return matches;
  }

  /**
   * Create Swiss pairings based on record
   */
  createSwissPairings(players: Player[], round: number): any[] {
    // First round is random
    if (round === 1) {
      return this.createRandomPairings(players);
    }

    // Sort players by match points (wins * 3 + draws * 1)
    const sortedPlayers = [...players].sort((a, b) => {
      // Primary sort: match points
      const aPoints = a.matchPoints || (a.wins || 0) * 3 + (a.draws || 0);
      const bPoints = b.matchPoints || (b.wins || 0) * 3 + (b.draws || 0);
      if (aPoints !== bPoints) return bPoints - aPoints;
      
      // Secondary sort: opponent match win percentage
      if (a.opponentMatchWinPercentage !== b.opponentMatchWinPercentage) {
        return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
      }

      // Tertiary sort: game win percentage
      return b.gameWinPercentage - a.gameWinPercentage;
    });

    // Group players by match points
    const playerGroups: Record<number, Player[]> = {};
    sortedPlayers.forEach(player => {
      const points = player.matchPoints || (player.wins || 0) * 3 + (player.draws || 0);
      if (!playerGroups[points]) playerGroups[points] = [];
      playerGroups[points].push(player);
    });

    // Create pairings within each group
    const pairings: any[] = [];
    const pointGroups = Object.keys(playerGroups).map(Number).sort((a, b) => b - a);
    
    // Stub implementation - would be more complex in reality
    // For now, just pair players within each point group
    pointGroups.forEach(points => {
      const group = playerGroups[points];
      for (let i = 0; i < group.length; i += 2) {
        if (i + 1 < group.length) {
          pairings.push({
            player1: group[i],
            player2: group[i + 1],
            bracket: 'main'
          });
        } else {
          // Odd player gets paired down to next group
          const nextGroup = pointGroups.find(p => p < points);
          if (nextGroup !== undefined && playerGroups[nextGroup].length > 0) {
            pairings.push({
              player1: group[i],
              player2: playerGroups[nextGroup].shift(),
              bracket: 'main'
            });
          } else {
            // No next group or empty next group, give a bye
            pairings.push({
              player1: group[i],
              player2: null,
              bracket: 'main'
            });
          }
        }
      }
    });

    return pairings;
  }

  /**
   * Create random pairings for the first round
   */
  createRandomPairings(players: Player[]): any[] {
    // Shuffle players
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    
    const pairings: any[] = [];
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        pairings.push({
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
          bracket: 'main'
        });
      } else {
        // Odd player gets a bye
        pairings.push({
          player1: shuffledPlayers[i],
          player2: null,
          bracket: 'main'
        });
      }
    }
    
    return pairings;
  }

  /**
   * Create bracket pairings for elimination rounds
   */
  createBracketPairings(players: Player[] | null, round: number, eliminationType: string): any[] {
    // Stub implementation - would be more complex in reality
    return [];
  }

  /**
   * Create round robin pairings
   */
  createRoundRobinPairings(players: Player[], round: number): any[] {
    // Stub implementation - would be more complex in reality
    return [];
  }

  /**
   * Create adaptive Swiss pairings that consider meta diversity
   */
  createAdaptiveSwissPairings(players: Player[], round: number): any[] {
    // Stub implementation - would be more complex in reality
    return this.createSwissPairings(players, round);
  }

  /**
   * Create parallel bracket pairings for main and consolation brackets
   */
  createParallelBracketPairings(players: Player[], round: number): any[] {
    // Stub implementation - would be more complex in reality
    return [];
  }

  /**
   * Get top players for elimination rounds
   */
  getTopPlayers(count: number): Player[] {
    if (!this.currentTournament) {
      throw new Error('No tournament has been created');
    }
    
    // Sort players by standing
    const sortedPlayers = [...this.currentTournament.players]
      .filter(p => !p.dropped)
      .sort((a, b) => (a.standing || 0) - (b.standing || 0));
    
    return sortedPlayers.slice(0, count);
  }

  /**
   * Calculate meta bonus for a match
   */
  calculateMetaBonus(player1: Player, player2: Player | null): number {
    if (!this.currentTournament || !this.currentTournament.metaBalancingEnabled) {
      return 0;
    }
    
    // No bonus for byes
    if (!player2) return 0;
    
    // No bonus if either player doesn't have a deck archetype
    if (!player1.deckArchetype || !player2.deckArchetype) return 0;
    
    let bonus = 0;
    
    // Check if either deck is underrepresented
    const metaBreakdown = this.currentTournament.metaBreakdown || [];
    const player1Meta = metaBreakdown.find(m => m.archetype === player1.deckArchetype);
    const player2Meta = metaBreakdown.find(m => m.archetype === player2.deckArchetype);
    
    if (player1Meta && player1Meta.isUnderrepresented) {
      bonus += this.metaIncentives.underrepresentedBonus;
    }
    
    if (player2Meta && player2Meta.isUnderrepresented) {
      bonus += this.metaIncentives.underrepresentedBonus;
    }
    
    return bonus;
  }

  /**
   * Submit a match result
   */
  submitResult(matchId: string, result: {
    winner: string;
    games: { winner: string; score?: { player1: number; player2: number } }[];
  }): Tournament {
    if (!this.currentTournament) {
      throw new Error('No tournament has been created');
    }
    
    // Find the match
    const match = this.currentTournament.matches.find(m => m.id === matchId);
    if (!match) {
      throw new Error(`Match ${matchId} not found`);
    }
    
    // Update match result
    match.result = result;
    match.status = 'completed';
    match.endTime = new Date();
    
    // Update player records
    const player1 = this.currentTournament.players.find(p => p.id === match.player1Id);
    const player2 = this.currentTournament.players.find(p => p.id === match.player2Id);
    
    if (player1) {
      if (result.winner === player1.id) {
        player1.wins = (player1.wins || 0) + 1;
      } else if (result.winner === 'draw') {
        player1.draws = (player1.draws || 0) + 1;
      } else {
        player1.losses = (player1.losses || 0) + 1;
      }
      player1.matchPoints = (player1.wins || 0) * 3 + (player1.draws || 0);
    }
    
    if (player2) {
      if (result.winner === player2.id) {
        player2.wins = (player2.wins || 0) + 1;
      } else if (result.winner === 'draw') {
        player2.draws = (player2.draws || 0) + 1;
      } else {
        player2.losses = (player2.losses || 0) + 1;
      }
      player2.matchPoints = (player2.wins || 0) * 3 + (player2.draws || 0);
    }
    
    // Check if all matches in the round are completed
    const roundMatches = this.currentTournament.matches.filter(
      m => m.roundNumber === this.currentTournament!.currentRound
    );
    
    const allCompleted = roundMatches.every(m => m.status === 'completed');
    
    if (allCompleted) {
      // Update standings
      this.updateStandings();
      
      // Check if tournament is complete
      if (this.isTournamentComplete()) {
        this.finishTournament();
      } else {
        // Advance to next round
        this.currentTournament.currentRound++;
      }
    }
    
    return this.currentTournament;
  }

  /**
   * Update player standings
   */
  updateStandings(): void {
    if (!this.currentTournament) return;
    
    // Calculate tiebreakers
    this.calculateTiebreakers();
    
    // Sort players by match points and tiebreakers
    const sortedPlayers = [...this.currentTournament.players].sort((a, b) => {
      // Primary sort: match points
      const aPoints = a.matchPoints || (a.wins || 0) * 3 + (a.draws || 0);
      const bPoints = b.matchPoints || (b.wins || 0) * 3 + (b.draws || 0);
      if (aPoints !== bPoints) return bPoints - aPoints;
      
      // Secondary sort: opponent match win percentage
      if (a.opponentMatchWinPercentage !== b.opponentMatchWinPercentage) {
        return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
      }
      
      // Tertiary sort: game win percentage
      if (a.gameWinPercentage !== b.gameWinPercentage) {
        return b.gameWinPercentage - a.gameWinPercentage;
      }
      
      // Fourth sort: meta bonus
      const aMetaBonus = a.tiebreakers?.metaBonus || 0;
      const bMetaBonus = b.tiebreakers?.metaBonus || 0;
      return bMetaBonus - aMetaBonus;
    });
    
    // Assign standings
    sortedPlayers.forEach((player, index) => {
      player.standing = index + 1;
    });
  }

  /**
   * Calculate tiebreakers for all players
   */
  calculateTiebreakers(): void {
    if (!this.currentTournament) return;
    
    this.currentTournament.players.forEach(player => {
      // Calculate opponent match win percentage
      const opponents = this.getPlayerOpponents(player.id);
      if (opponents.length > 0) {
        const opponentWinPercentages = opponents.map(opp => {
          const totalMatches = (opp.wins || 0) + (opp.losses || 0) + (opp.draws || 0);
          if (totalMatches === 0) return 0.33; // Default for no matches
          return ((opp.wins || 0) + (opp.draws || 0) * 0.5) / totalMatches;
        });
        
        player.opponentMatchWinPercentage = opponentWinPercentages.reduce((sum, pct) => sum + pct, 0) / 
          opponentWinPercentages.length;
      } else {
        player.opponentMatchWinPercentage = 0;
      }
      
      // Calculate game win percentage
      const playerMatches = this.getPlayerMatches(player.id);
      let gamesWon = 0;
      let gamesPlayed = 0;
      
      playerMatches.forEach(match => {
        if (match.result && match.result.games) {
          match.result.games.forEach(game => {
            gamesPlayed++;
            if (game.winner === player.id) {
              gamesWon++;
            }
          });
        }
      });
      
      player.gameWinPercentage = gamesPlayed > 0 ? gamesWon / gamesPlayed : 0;
      
      // Calculate meta bonus
      if (this.currentTournament.metaBalancingEnabled && player.deckArchetype) {
        const metaBreakdown = this.currentTournament.metaBreakdown || [];
        const playerMeta = metaBreakdown.find(m => m.archetype === player.deckArchetype);
        
        if (playerMeta && playerMeta.isUnderrepresented) {
          player.tiebreakers = player.tiebreakers || {};
          player.tiebreakers.metaBonus = this.metaIncentives.underrepresentedBonus;
        }
      }
    });
  }

  /**
   * Get all opponents a player has faced
   */
  getPlayerOpponents(playerId: string): Player[] {
    if (!this.currentTournament) return [];
    
    const opponents: Player[] = [];
    const playerMatches = this.getPlayerMatches(playerId);
    
    playerMatches.forEach(match => {
      if (match.player1Id === playerId && match.player2) {
        const opponent = this.currentTournament!.players.find(p => p.id === match.player2Id);
        if (opponent) opponents.push(opponent);
      } else if (match.player2Id === playerId) {
        const opponent = this.currentTournament!.players.find(p => p.id === match.player1Id);
        if (opponent) opponents.push(opponent);
      }
    });
    
    return opponents;
  }

  /**
   * Get all matches a player has played
   */
  getPlayerMatches(playerId: string): any[] {
    if (!this.currentTournament) return [];
    
    return this.currentTournament.matches.filter(
      m => (m.player1Id === playerId || m.player2Id === playerId) && m.status === 'completed'
    );
  }

  /**
   * Check if the tournament is complete
   */
  isTournamentComplete(): boolean {
    if (!this.currentTournament) return false;
    
    const format = this.currentTournament.format;
    const currentRound = this.currentTournament.currentRound;
    
    if (format === 'hybrid') {
      // For hybrid, check if we've completed all Swiss and elimination rounds
      return currentRound >= (this.currentTournament.rounds as any).swiss + 
        (this.currentTournament.rounds as any).elimination;
    } else {
      // For other formats, check if we've completed all main rounds
      return currentRound >= (this.currentTournament.rounds as any).main;
    }
  }

  /**
   * Finish the tournament
   */
  finishTournament(): Tournament {
    if (!this.currentTournament) {
      throw new Error('No tournament has been created');
    }
    
    this.currentTournament.status = 'completed';
    this.currentTournament.endTime = new Date();
    
    // Final standings update
    this.updateStandings();
    
    return this.currentTournament;
  }

  /**
   * Drop a player from the tournament
   */
  dropPlayer(playerId: string): Player {
    if (!this.currentTournament) {
      throw new Error('No tournament has been created');
    }
    
    const player = this.currentTournament.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }
    
    player.dropped = true;
    
    return player;
  }

  /**
   * Get tournament standings
   */
  getStandings(): Player[] {
    if (!this.currentTournament) {
      throw new Error('No tournament has been created');
    }
    
    // Make sure standings are up to date
    this.updateStandings();
    
    // Return players sorted by standing
    return [...this.currentTournament.players].sort((a, b) => 
      (a.standing || 0) - (b.standing || 0)
    );
  }
}