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
export class TournamentEngine {
  constructor(options = {}) {
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
        description: 'Players are paired based on their record, with no eliminations',
        minPlayers: 8,
        maxPlayers: 256,
        recommendedRounds: (playerCount) => Math.ceil(Math.log2(playerCount)) + 1,
        pairingMethod: 'record',
        eliminationType: 'none'
      },
      singleElimination: {
        name: 'Single Elimination',
        description: 'Players are eliminated after a single loss',
        minPlayers: 4,
        maxPlayers: 128,
        recommendedRounds: (playerCount) => Math.ceil(Math.log2(playerCount)),
        pairingMethod: 'bracket',
        eliminationType: 'single'
      },
      doubleElimination: {
        name: 'Double Elimination',
        description: 'Players are eliminated after two losses',
        minPlayers: 4,
        maxPlayers: 64,
        recommendedRounds: (playerCount) => Math.ceil(Math.log2(playerCount)) * 2 - 1,
        pairingMethod: 'bracket',
        eliminationType: 'double'
      },
      roundRobin: {
        name: 'Round Robin',
        description: 'Every player plays against every other player',
        minPlayers: 4,
        maxPlayers: 16,
        recommendedRounds: (playerCount) => playerCount - 1,
        pairingMethod: 'roundRobin',
        eliminationType: 'none'
      },
      hybrid: {
        name: 'Hybrid',
        description: 'Swiss rounds followed by single elimination top cut',
        minPlayers: 8,
        maxPlayers: 128,
        recommendedRounds: (playerCount) => ({
          swiss: Math.ceil(Math.log2(playerCount)),
          elimination: Math.log2(Math.min(8, playerCount / 4))
        }),
        pairingMethod: 'hybrid',
        eliminationType: 'hybrid'
      },
      adaptiveSwiss: {
        name: 'Adaptive Swiss',
        description: 'Swiss rounds with dynamic pairings based on meta diversity',
        minPlayers: 8,
        maxPlayers: 256,
        recommendedRounds: (playerCount) => Math.ceil(Math.log2(playerCount)) + 1,
        pairingMethod: 'adaptiveSwiss',
        eliminationType: 'none'
      },
      parallelBrackets: {
        name: 'Parallel Brackets',
        description: 'Main and consolation brackets run simultaneously',
        minPlayers: 8,
        maxPlayers: 64,
        recommendedRounds: (playerCount) => Math.ceil(Math.log2(playerCount)) * 1.5,
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
        description: 'Tournament that adapts to player count and time constraints'
      },
      parallelEvent: {
        name: 'Parallel Event',
        format: 'parallelBrackets',
        rounds: 'auto',
        topCut: 0,
        timePerRound: 45,
        description: 'Event with main and consolation brackets running in parallel'
      }
    };
    
    // Meta-balancing incentives
    this.metaIncentives = {
      underrepresentedBonus: 0.2, // 20% bonus points for underrepresented archetypes
      diversityBonus: 0.1, // 10% bonus for each unique archetype in top 8
      innovationBonus: 0.15, // 15% bonus for new/innovative decks
      thresholdForUnderrepresented: 0.1 // Archetypes below 10% of meta are underrepresented
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
  createTournament(options) {
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
    let calculatedRounds = rounds;
    if (rounds === 'auto') {
      const formatInfo = this.formats[format];
      if (typeof formatInfo.recommendedRounds === 'function') {
        calculatedRounds = formatInfo.recommendedRounds(players.length);
      } else {
        calculatedRounds = 3; // Default fallback
      }
    }
    
    // Create tournament object
    const tournament = {
      id: `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
        tiebreakers: {},
        metaBonus: 0
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
      metaBreakdown: {},
      timeConstraints: {
        estimatedEndTime: new Date(startTime.getTime() + (timePerRound * calculatedRounds * 60 * 1000)),
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
  adaptTournamentStructure(tournament) {
    const playerCount = tournament.players.length;
    
    // Adjust format based on player count
    if (playerCount < 8) {
      // For very small tournaments, use round robin
      tournament.format = 'roundRobin';
      tournament.rounds.main = playerCount - 1;
    } else if (playerCount < 16) {
      // For small tournaments, use Swiss with no top cut
      tournament.format = 'swiss';
      tournament.rounds.main = Math.ceil(Math.log2(playerCount)) + 1;
      tournament.topCut = 0;
    } else if (playerCount < 32) {
      // For medium tournaments, use Swiss with top 4
      tournament.format = 'swiss';
      tournament.rounds.main = Math.ceil(Math.log2(playerCount)) + 1;
      tournament.topCut = 4;
    } else if (playerCount < 64) {
      // For large tournaments, use Swiss with top 8
      tournament.format = 'swiss';
      tournament.rounds.main = Math.ceil(Math.log2(playerCount)) + 1;
      tournament.topCut = 8;
    } else {
      // For very large tournaments, use hybrid with top 8
      tournament.format = 'hybrid';
      tournament.rounds = {
        swiss: Math.ceil(Math.log2(playerCount)),
        elimination: 3 // Top 8
      };
      tournament.topCut = 8;
    }
    
    // Adjust based on time constraints
    if (tournament.timeConstraints.isTimeLimited) {
      const availableMinutes = (tournament.timeConstraints.estimatedEndTime - tournament.startTime) / (60 * 1000);
      const maxRounds = Math.floor(availableMinutes / tournament.timePerRound);
      
      if (maxRounds < tournament.rounds.main) {
        // Reduce rounds if time is limited
        tournament.rounds.main = maxRounds;
        
        // Adjust top cut based on reduced rounds
        if (tournament.topCut > 0) {
          tournament.topCut = Math.min(tournament.topCut, Math.pow(2, Math.floor(maxRounds / 2)));
        }
      }
    }
    
    // Enable parallel brackets for medium to large tournaments if time is limited
    if (tournament.parallelBracketsEnabled && playerCount >= 16 && tournament.timeConstraints.isTimeLimited) {
      tournament.format = 'parallelBrackets';
    }
    
    return tournament;
  }
  
  /**
   * Calculate meta breakdown from player decks
   */
  calculateMetaBreakdown(players) {
    const deckCounts = {};
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
        isUnderrepresented: percentage < (this.metaIncentives.thresholdForUnderrepresented * 100)
      };
    });
    
    // Sort by percentage (descending)
    metaBreakdown.sort((a, b) => b.percentage - a.percentage);
    
    return metaBreakdown;
  }
  
  /**
   * Start the tournament
   */
  startTournament() {
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
  createPairings() {
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
    
    let pairings = [];
    
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
        if (round <= tournament.rounds.swiss) {
          pairings = this.createSwissPairings(activePlayers, round);
        } else {
          // Create top cut bracket
          if (round === tournament.rounds.swiss + 1) {
            // First elimination round - create the bracket
            const topPlayers = this.getTopPlayers(activePlayers, tournament.topCut);
            pairings = this.createBracketPairings(topPlayers, 1, 'single');
          } else {
            // Continue elimination rounds
            pairings = this.createBracketPairings(null, round - tournament.rounds.swiss, 'single');
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
        metaBonus: this.calculateMetaBonus(pairing.player1, pairing.player2)
      };
    });
    
    // Add matches to tournament
    tournament.matches = [...tournament.matches, ...matches];
    
    // Add matches to appropriate bracket
    matches.forEach(match => {
      if (match.bracket === 'main') {
        tournament.brackets.main.matches.push(match);
      } else if (match.bracket === 'consolation' && tournament.brackets.consolation) {
        tournament.brackets.consolation.matches.push(match);
      }
    });
    
    return matches;
  }
  
  /**
   * Create Swiss pairings based on record
   */
  createSwissPairings(players, round) {
    // First round is random
    if (round === 1) {
      return this.createRandomPairings(players);
    }
    
    // Sort players by match points (wins * 3 + draws * 1)
    const sortedPlayers = [...players].sort((a, b) => {
      // Primary sort: match points
      const aPoints = a.matchPoints || (a.wins * 3 + a.draws);
      const bPoints = b.matchPoints || (b.wins * 3 + b.draws);
      if (aPoints !== bPoints) return bPoints - aPoints;
      
      // Secondary sort: opponent match win percentage
      if (a.opponentMatchWinPercentage !== b.opponentMatchWinPercentage) {
        return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
      }
      
      // Tertiary sort: game win percentage
      return b.gameWinPercentage - a.gameWinPercentage;
    });
    
    // Group players by match points
    const playerGroups = {};
    sortedPlayers.forEach(player => {
      const points = player.matchPoints || (player.wins * 3 + player.draws);
      if (!playerGroups[points]) playerGroups[points] = [];
      playerGroups[points].push(player);
    });
    
    // Create pairings within each group
    const pairings = [];
    Object.keys(playerGroups)
      .sort((a, b) => Number(b) - Number(a)) // Sort point groups descending
      .forEach(points => {
        const group = playerGroups[points];
        const groupPairings = this.pairPlayersInGroup(group);
        pairings.push(...groupPairings);
      });
    
    // Handle odd number of players (give bye to lowest ranked player without a bye)
    if (players.length % 2 !== 0) {
      // Find lowest ranked player without a previous bye
      const playersWithoutBye = sortedPlayers
        .reverse() // Start from lowest ranked
        .filter(p => !p.matches.some(m => m.isBye));
      
      if (playersWithoutBye.length > 0) {
        const byePlayer = playersWithoutBye[0];
        pairings.push({
          player1: byePlayer,
          player2: null,
          isBye: true
        });
        
        // Remove this player from any existing pairing
        const pairingIndex = pairings.findIndex(p => 
          p.player1.id === byePlayer.id || (p.player2 && p.player2.id === byePlayer.id)
        );
        
        if (pairingIndex !== -1) {
          const pairing = pairings[pairingIndex];
          if (pairing.player1.id === byePlayer.id) {
            // If this player is player1, replace with a new pairing for player2
            if (pairing.player2) {
              const orphanedPlayer = pairing.player2;
              pairings.splice(pairingIndex, 1);
              
              // Find another orphaned player or create a bye
              const otherOrphanIndex = pairings.findIndex(p => p.isBye && p.player1.id !== byePlayer.id);
              if (otherOrphanIndex !== -1) {
                const otherOrphan = pairings[otherOrphanIndex].player1;
                pairings[otherOrphanIndex] = {
                  player1: otherOrphan,
                  player2: orphanedPlayer,
                  isBye: false
                };
              } else {
                pairings.push({
                  player1: orphanedPlayer,
                  player2: null,
                  isBye: true
                });
              }
            }
          } else {
            // If this player is player2, just remove them from the pairing
            pairing.player2 = null;
            pairing.isBye = true;
          }
        }
      }
    }
    
    return pairings;
  }
  
  /**
   * Create dynamic Swiss pairings that maximize interesting matchups
   */
  createAdaptiveSwissPairings(players, round) {
    // First round uses meta-aware pairings
    if (round === 1) {
      return this.createMetaAwarePairings(players);
    }
    
    // Sort players by record
    const sortedPlayers = [...players].sort((a, b) => {
      // Primary sort: match points
      const aPoints = a.matchPoints || (a.wins * 3 + a.draws);
      const bPoints = b.matchPoints || (b.wins * 3 + b.draws);
      if (aPoints !== bPoints) return bPoints - aPoints;
      
      // Secondary sort: opponent match win percentage
      if (a.opponentMatchWinPercentage !== b.opponentMatchWinPercentage) {
        return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
      }
      
      // Tertiary sort: game win percentage
      return b.gameWinPercentage - a.gameWinPercentage;
    });
    
    // Group players by record
    const playerGroups = {};
    sortedPlayers.forEach(player => {
      const record = `${player.wins}-${player.losses}-${player.draws}`;
      if (!playerGroups[record]) playerGroups[record] = [];
      playerGroups[record].push(player);
    });
    
    // Create pairings with preference for diverse matchups
    const pairings = [];
    const recordGroups = Object.keys(playerGroups).sort((a, b) => {
      const [aWins, aLosses] = a.split('-').map(Number);
      const [bWins, bLosses] = b.split('-').map(Number);
      // Sort by wins descending, then losses ascending
      return bWins - aWins || aLosses - bLosses;
    });
    
    // Process each record group
    recordGroups.forEach(record => {
      const group = playerGroups[record];
      
      // If odd number in this group, try to pair with adjacent group
      if (group.length % 2 !== 0) {
        const recordParts = record.split('-').map(Number);
        const adjacentRecords = recordGroups.filter(r => {
          if (r === record) return false;
          const [wins, losses] = r.split('-').map(Number);
          // Consider adjacent if within 1 win/loss
          return Math.abs(wins - recordParts[0]) <= 1 && Math.abs(losses - recordParts[1]) <= 1;
        });
        
        // Find closest adjacent group with odd count
        const adjacentGroup = adjacentRecords.find(r => playerGroups[r].length % 2 !== 0);
        
        if (adjacentGroup) {
          // Move one player from adjacent group to this group
          const playerToMove = playerGroups[adjacentGroup].pop();
          group.push(playerToMove);
        }
      }
      
      // Create optimized pairings within group
      const optimizedPairings = this.createOptimizedPairings(group);
      pairings.push(...optimizedPairings);
    });
    
    // Handle odd number of players overall
    if (players.length % 2 !== 0) {
      // Find lowest ranked player without a previous bye
      const playersWithoutBye = sortedPlayers
        .reverse() // Start from lowest ranked
        .filter(p => !p.matches.some(m => m.isBye));
      
      if (playersWithoutBye.length > 0) {
        const byePlayer = playersWithoutBye[0];
        
        // Remove this player from any existing pairing
        const pairingIndex = pairings.findIndex(p => 
          p.player1.id === byePlayer.id || (p.player2 && p.player2.id === byePlayer.id)
        );
        
        if (pairingIndex !== -1) {
          const pairing = pairings[pairingIndex];
          if (pairing.player1.id === byePlayer.id && pairing.player2) {
            // If this player is player1, create a bye and leave player2
            const orphanedPlayer = pairing.player2;
            pairings[pairingIndex] = {
              player1: orphanedPlayer,
              player2: null,
              isBye: true
            };
          } else if (pairing.player2 && pairing.player2.id === byePlayer.id) {
            // If this player is player2, just remove them
            pairing.player2 = null;
            pairing.isBye = true;
          }
        }
        
        // Add bye for the selected player
        pairings.push({
          player1: byePlayer,
          player2: null,
          isBye: true
        });
      }
    }
    
    return pairings;
  }
  
  /**
   * Create meta-aware pairings for the first round
   * Tries to match different archetypes against each other
   */
  createMetaAwarePairings(players) {
    // Group players by deck archetype
    const archetypeGroups = {};
    players.forEach(player => {
      const archetype = player.deckArchetype || 'Unknown';
      if (!archetypeGroups[archetype]) archetypeGroups[archetype] = [];
      archetypeGroups[archetype].push(player);
    });
    
    // Shuffle players within each archetype group
    Object.values(archetypeGroups).forEach(group => {
      this.shuffleArray(group);
    });
    
    // Sort archetypes by size (descending)
    const sortedArchetypes = Object.keys(archetypeGroups).sort(
      (a, b) => archetypeGroups[b].length - archetypeGroups[a].length
    );
    
    const pairings = [];
    const pairedPlayers = new Set();
    
    // First, try to pair different archetypes against each other
    for (let i = 0; i < sortedArchetypes.length; i++) {
      const archetype1 = sortedArchetypes[i];
      const players1 = archetypeGroups[archetype1].filter(p => !pairedPlayers.has(p.id));
      
      if (players1.length === 0) continue;
      
      for (let j = i + 1; j < sortedArchetypes.length; j++) {
        const archetype2 = sortedArchetypes[j];
        const players2 = archetypeGroups[archetype2].filter(p => !pairedPlayers.has(p.id));
        
        if (players2.length === 0) continue;
        
        // Pair as many players as possible between these two archetypes
        const pairsToCreate = Math.min(players1.length, players2.length);
        
        for (let k = 0; k < pairsToCreate; k++) {
          const player1 = players1[k];
          const player2 = players2[k];
          
          pairings.push({
            player1,
            player2,
            isBye: false
          });
          
          pairedPlayers.add(player1.id);
          pairedPlayers.add(player2.id);
        }
        
        // Update players1 to remove paired players
        players1.splice(0, pairsToCreate);
        if (players1.length === 0) break;
      }
    }
    
    // Pair any remaining players within their archetype groups
    sortedArchetypes.forEach(archetype => {
      const remainingPlayers = archetypeGroups[archetype].filter(p => !pairedPlayers.has(p.id));
      
      for (let i = 0; i < remainingPlayers.length; i += 2) {
        if (i + 1 < remainingPlayers.length) {
          pairings.push({
            player1: remainingPlayers[i],
            player2: remainingPlayers[i + 1],
            isBye: false
          });
          
          pairedPlayers.add(remainingPlayers[i].id);
          pairedPlayers.add(remainingPlayers[i + 1].id);
        } else {
          // Odd player gets a bye
          pairings.push({
            player1: remainingPlayers[i],
            player2: null,
            isBye: true
          });
          
          pairedPlayers.add(remainingPlayers[i].id);
        }
      }
    });
    
    // Handle any players not yet paired (should be rare)
    const unpaired = players.filter(p => !pairedPlayers.has(p.id));
    for (let i = 0; i < unpaired.length; i += 2) {
      if (i + 1 < unpaired.length) {
        pairings.push({
          player1: unpaired[i],
          player2: unpaired[i + 1],
          isBye: false
        });
      } else {
        pairings.push({
          player1: unpaired[i],
          player2: null,
          isBye: true
        });
      }
    }
    
    return pairings;
  }
  
  /**
   * Create optimized pairings that maximize interesting matchups
   * and minimize repeat pairings
   */
  createOptimizedPairings(players) {
    if (players.length === 0) return [];
    
    // Create a copy of players to work with
    const availablePlayers = [...players];
    this.shuffleArray(availablePlayers); // Add some randomness
    
    const pairings = [];
    
    while (availablePlayers.length >= 2) {
      const player1 = availablePlayers.shift();
      
      // Score potential opponents based on multiple factors
      const scoredOpponents = availablePlayers.map(player2 => {
        // Check if they've played before
        const hasPlayed = player1.matches.some(match => {
          const opponentId = match.player1Id === player1.id ? match.player2Id : match.player1Id;
          return opponentId === player2.id;
        });
        
        // Calculate archetype matchup score
        let archetypeScore = 0.5; // Default neutral score
        if (player1.deckArchetype && player2.deckArchetype) {
          // Prefer different archetypes
          archetypeScore = player1.deckArchetype === player2.deckArchetype ? 0.3 : 0.7;
        }
        
        // Calculate rating similarity score (prefer closer ratings)
        const ratingDifference = Math.abs((player1.rating || 1500) - (player2.rating || 1500));
        const ratingScore = Math.max(0, 1 - (ratingDifference / 500)); // 0-1 score, higher for closer ratings
        
        // Calculate playstyle compatibility score
        let playstyleScore = 0.5; // Default neutral score
        if (player1.playstyle && player2.playstyle) {
          // Calculate complementary playstyles
          const aggressionDiff = Math.abs(player1.playstyle.aggression - player2.playstyle.aggression);
          playstyleScore = 1 - (aggressionDiff / 2); // Higher score for different playstyles
        }
        
        // Heavily penalize repeat pairings
        const repeatPenalty = hasPlayed ? 0.2 : 1.0;
        
        // Combine scores with weights
        const totalScore = (
          (archetypeScore * 0.4) +
          (ratingScore * 0.3) +
          (playstyleScore * 0.3)
        ) * repeatPenalty;
        
        return {
          player: player2,
          score: totalScore,
          hasPlayed
        };
      });
      
      // Sort by score (descending)
      scoredOpponents.sort((a, b) => b.score - a.score);
      
      // Select best opponent
      const bestMatch = scoredOpponents[0];
      const player2 = bestMatch.player;
      
      // Remove selected opponent from available players
      const index = availablePlayers.findIndex(p => p.id === player2.id);
      if (index !== -1) {
        availablePlayers.splice(index, 1);
      }
      
      // Create pairing
      pairings.push({
        player1,
        player2,
        isBye: false,
        matchupScore: bestMatch.score
      });
    }
    
    // Handle odd player (bye)
    if (availablePlayers.length === 1) {
      pairings.push({
        player1: availablePlayers[0],
        player2: null,
        isBye: true
      });
    }
    
    return pairings;
  }
  
  /**
   * Create bracket pairings for elimination rounds
   */
  createBracketPairings(players, round, eliminationType) {
    const tournament = this.currentTournament;
    
    // For first elimination round, seed players
    if (round === 1 && players) {
      // Sort players by standings
      const seededPlayers = [...players].sort((a, b) => {
        // Primary sort: match points
        const aPoints = a.matchPoints || (a.wins * 3 + a.draws);
        const bPoints = b.matchPoints || (b.wins * 3 + b.draws);
        if (aPoints !== bPoints) return bPoints - aPoints;
        
        // Secondary sort: opponent match win percentage
        if (a.opponentMatchWinPercentage !== b.opponentMatchWinPercentage) {
          return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
        }
        
        // Tertiary sort: game win percentage
        return b.gameWinPercentage - a.gameWinPercentage;
      });
      
      // Create bracket matchups (1 vs 8, 4 vs 5, 2 vs 7, 3 vs 6 for top 8)
      const pairings = [];
      const bracketSize = seededPlayers.length;
      
      for (let i = 0; i < bracketSize / 2; i++) {
        const highSeed = seededPlayers[i];
        const lowSeed = seededPlayers[bracketSize - 1 - i];
        
        pairings.push({
          player1: highSeed,
          player2: lowSeed,
          isBye: false,
          bracketPosition: i + 1
        });
      }
      
      return pairings;
    } 
    // For subsequent rounds, pair winners from previous round
    else {
      const previousRound = round - 1;
      const previousMatches = tournament.matches.filter(m => 
        m.roundNumber === previousRound && 
        (eliminationType === 'single' || m.bracket === 'winners')
      );
      
      const pairings = [];
      
      // Group matches by bracket position
      const matchesByPosition = {};
      previousMatches.forEach(match => {
        const position = Math.ceil(match.bracketPosition / 2);
        if (!matchesByPosition[position]) matchesByPosition[position] = [];
        matchesByPosition[position].push(match);
      });
      
      // Create pairings from winners
      Object.keys(matchesByPosition).forEach(position => {
        const matches = matchesByPosition[position];
        if (matches.length === 2) {
          const winner1 = this.getMatchWinner(matches[0]);
          const winner2 = this.getMatchWinner(matches[1]);
          
          if (winner1 && winner2) {
            pairings.push({
              player1: winner1,
              player2: winner2,
              isBye: false,
              bracketPosition: parseInt(position)
            });
          }
        }
      });
      
      return pairings;
    }
  }
  
  /**
   * Create round robin pairings
   */
  createRoundRobinPairings(players, round) {
    const n = players.length;
    
    // Round robin algorithm for even number of players
    // For odd number, add a "bye" player
    const isOdd = n % 2 === 1;
    const adjustedPlayers = isOdd ? [...players, null] : [...players];
    const adjustedN = adjustedPlayers.length;
    
    // In round robin, each player plays exactly once against every other player
    // For n players, we need n-1 rounds if n is even, or n rounds if n is odd
    const totalRounds = isOdd ? n : n - 1;
    
    if (round > totalRounds) {
      throw new Error(`Round ${round} exceeds maximum rounds (${totalRounds}) for round robin`);
    }
    
    const pairings = [];
    
    // Create pairings for this round
    // Using circle method: fix player 0, rotate others clockwise
    const rotated = [...adjustedPlayers];
    
    // Rotate players based on current round (except player 0)
    for (let i = 0; i < round - 1; i++) {
      const temp = rotated[1];
      for (let j = 1; j < adjustedN - 1; j++) {
        rotated[j] = rotated[j + 1];
      }
      rotated[adjustedN - 1] = temp;
    }
    
    // Create pairings
    for (let i = 0; i < adjustedN / 2; i++) {
      const player1 = rotated[i];
      const player2 = rotated[adjustedN - 1 - i];
      
      // Skip if this is a bye (null player)
      if (player1 === null || player2 === null) continue;
      
      pairings.push({
        player1,
        player2,
        isBye: false
      });
    }
    
    return pairings;
  }
  
  /**
   * Create parallel bracket pairings (main and consolation brackets)
   */
  createParallelBracketPairings(players, round) {
    const tournament = this.currentTournament;
    
    // First round - create initial pairings
    if (round === 1) {
      // Sort players by rating or random if no ratings
      const sortedPlayers = [...players].sort((a, b) => {
        if (a.rating && b.rating) {
          return b.rating - a.rating;
        }
        return Math.random() - 0.5;
      });
      
      // Create main bracket pairings
      const pairings = [];
      for (let i = 0; i < sortedPlayers.length; i += 2) {
        if (i + 1 < sortedPlayers.length) {
          pairings.push({
            player1: sortedPlayers[i],
            player2: sortedPlayers[i + 1],
            isBye: false,
            bracket: 'main',
            bracketPosition: Math.floor(i / 2) + 1
          });
        } else {
          // Odd player gets a bye
          pairings.push({
            player1: sortedPlayers[i],
            player2: null,
            isBye: true,
            bracket: 'main',
            bracketPosition: Math.floor(i / 2) + 1
          });
        }
      }
      
      return pairings;
    } 
    // Subsequent rounds - pair winners in main bracket, losers in consolation
    else {
      const previousRound = round - 1;
      const previousMainMatches = tournament.matches.filter(m => 
        m.roundNumber === previousRound && m.bracket === 'main'
      );
      
      const previousConsolationMatches = tournament.matches.filter(m => 
        m.roundNumber === previousRound && m.bracket === 'consolation'
      );
      
      const pairings = [];
      
      // Main bracket - pair winners
      const mainPairings = this.pairBracketWinners(previousMainMatches, 'main');
      pairings.push(...mainPairings);
      
      // Consolation bracket - for round 2, add first-round losers
      if (round === 2) {
        const firstRoundLosers = this.getBracketLosers(
          tournament.matches.filter(m => m.roundNumber === 1 && m.bracket === 'main')
        );
        
        // Pair losers
        for (let i = 0; i < firstRoundLosers.length; i += 2) {
          if (i + 1 < firstRoundLosers.length) {
            pairings.push({
              player1: firstRoundLosers[i],
              player2: firstRoundLosers[i + 1],
              isBye: false,
              bracket: 'consolation',
              bracketPosition: Math.floor(i / 2) + 1
            });
          } else {
            // Odd player gets a bye
            pairings.push({
              player1: firstRoundLosers[i],
              player2: null,
              isBye: true,
              bracket: 'consolation',
              bracketPosition: Math.floor(i / 2) + 1
            });
          }
        }
      } 
      // For later rounds, pair consolation bracket winners
      else if (previousConsolationMatches.length > 0) {
        const consolationPairings = this.pairBracketWinners(previousConsolationMatches, 'consolation');
        pairings.push(...consolationPairings);
      }
      
      return pairings;
    }
  }
  
  /**
   * Pair winners from previous bracket matches
   */
  pairBracketWinners(previousMatches, bracket) {
    const pairings = [];
    
    // Group matches by bracket position
    const matchesByPosition = {};
    previousMatches.forEach(match => {
      const position = Math.ceil(match.bracketPosition / 2);
      if (!matchesByPosition[position]) matchesByPosition[position] = [];
      matchesByPosition[position].push(match);
    });
    
    // Create pairings from winners
    Object.keys(matchesByPosition).forEach(position => {
      const matches = matchesByPosition[position];
      if (matches.length === 2) {
        const winner1 = this.getMatchWinner(matches[0]);
        const winner2 = this.getMatchWinner(matches[1]);
        
        if (winner1 && winner2) {
          pairings.push({
            player1: winner1,
            player2: winner2,
            isBye: false,
            bracket,
            bracketPosition: parseInt(position)
          });
        }
      } else if (matches.length === 1) {
        // Handle bye or single match in previous round
        const winner = this.getMatchWinner(matches[0]);
        if (winner) {
          pairings.push({
            player1: winner,
            player2: null,
            isBye: true,
            bracket,
            bracketPosition: parseInt(position)
          });
        }
      }
    });
    
    return pairings;
  }
  
  /**
   * Get losers from bracket matches
   */
  getBracketLosers(matches) {
    const losers = [];
    
    matches.forEach(match => {
      // Skip byes
      if (match.isBye) return;
      
      const loser = this.getMatchLoser(match);
      if (loser) {
        losers.push(loser);
      }
    });
    
    return losers;
  }
  
  /**
   * Get winner of a match
   */
  getMatchWinner(match) {
    if (!match || !match.result) return null;
    
    if (match.result === 'player1') {
      return match.player1;
    } else if (match.result === 'player2') {
      return match.player2;
    }
    
    return null;
  }
  
  /**
   * Get loser of a match
   */
  getMatchLoser(match) {
    if (!match || !match.result) return null;
    
    if (match.result === 'player1') {
      return match.player2;
    } else if (match.result === 'player2') {
      return match.player1;
    }
    
    return null;
  }
  
  /**
   * Create random pairings
   */
  createRandomPairings(players) {
    // Shuffle players
    const shuffledPlayers = [...players];
    this.shuffleArray(shuffledPlayers);
    
    // Create pairings
    const pairings = [];
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        pairings.push({
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
          isBye: false
        });
      } else {
        // Odd player gets a bye
        pairings.push({
          player1: shuffledPlayers[i],
          player2: null,
          isBye: true
        });
      }
    }
    
    return pairings;
  }
  
  /**
   * Pair players within a group (for Swiss pairings)
   */
  pairPlayersInGroup(players) {
    // Shuffle players to add some randomness
    const shuffledPlayers = [...players];
    this.shuffleArray(shuffledPlayers);
    
    const pairings = [];
    const pairedPlayers = new Set();
    
    // Try to pair players who haven't played each other yet
    for (let i = 0; i < shuffledPlayers.length; i++) {
      if (pairedPlayers.has(shuffledPlayers[i].id)) continue;
      
      let foundOpponent = false;
      
      for (let j = i + 1; j < shuffledPlayers.length; j++) {
        if (pairedPlayers.has(shuffledPlayers[j].id)) continue;
        
        // Check if these players have played each other before
        const havePlayed = this.havePlayed(shuffledPlayers[i], shuffledPlayers[j]);
        
        if (!havePlayed) {
          pairings.push({
            player1: shuffledPlayers[i],
            player2: shuffledPlayers[j],
            isBye: false
          });
          
          pairedPlayers.add(shuffledPlayers[i].id);
          pairedPlayers.add(shuffledPlayers[j].id);
          foundOpponent = true;
          break;
        }
      }
      
      // If no unpaired opponent was found, pair with someone who has played before
      if (!foundOpponent && !pairedPlayers.has(shuffledPlayers[i].id)) {
        for (let j = i + 1; j < shuffledPlayers.length; j++) {
          if (pairedPlayers.has(shuffledPlayers[j].id)) continue;
          
          pairings.push({
            player1: shuffledPlayers[i],
            player2: shuffledPlayers[j],
            isBye: false
          });
          
          pairedPlayers.add(shuffledPlayers[i].id);
          pairedPlayers.add(shuffledPlayers[j].id);
          break;
        }
      }
    }
    
    // Handle any unpaired players (should be at most 1 in a group)
    const unpaired = shuffledPlayers.filter(p => !pairedPlayers.has(p.id));
    if (unpaired.length === 1) {
      pairings.push({
        player1: unpaired[0],
        player2: null,
        isBye: true
      });
    } else if (unpaired.length > 1) {
      // This shouldn't happen in a well-formed algorithm, but handle it anyway
      for (let i = 0; i < unpaired.length; i += 2) {
        if (i + 1 < unpaired.length) {
          pairings.push({
            player1: unpaired[i],
            player2: unpaired[i + 1],
            isBye: false
          });
        } else {
          pairings.push({
            player1: unpaired[i],
            player2: null,
            isBye: true
          });
        }
      }
    }
    
    return pairings;
  }
  
  /**
   * Check if two players have played each other before
   */
  havePlayed(player1, player2) {
    if (!player1.matches || !player2.matches) return false;
    
    return player1.matches.some(match => {
      const opponentId = match.player1Id === player1.id ? match.player2Id : match.player1Id;
      return opponentId === player2.id;
    });
  }
  
  /**
   * Get top N players by standings
   */
  getTopPlayers(players, n) {
    return [...players]
      .sort((a, b) => {
        // Primary sort: match points
        const aPoints = a.matchPoints || (a.wins * 3 + a.draws);
        const bPoints = b.matchPoints || (b.wins * 3 + b.draws);
        if (aPoints !== bPoints) return bPoints - aPoints;
        
        // Secondary sort: opponent match win percentage
        if (a.opponentMatchWinPercentage !== b.opponentMatchWinPercentage) {
          return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
        }
        
        // Tertiary sort: game win percentage
        return b.gameWinPercentage - a.gameWinPercentage;
      })
      .slice(0, n);
  }
  
  /**
   * Calculate meta bonus for underrepresented archetypes
   */
  calculateMetaBonus(player1, player2) {
    if (!this.currentTournament.metaBalancingEnabled) return 0;
    if (!player1 || !player2) return 0;
    
    const metaBreakdown = this.currentTournament.metaBreakdown;
    let bonus = 0;
    
    // Check if either player is using an underrepresented archetype
    if (player1.deckArchetype) {
      const archetype1Data = metaBreakdown.find(a => a.archetype === player1.deckArchetype);
      if (archetype1Data && archetype1Data.isUnderrepresented) {
        bonus += this.metaIncentives.underrepresentedBonus;
      }
    }
    
    if (player2.deckArchetype) {
      const archetype2Data = metaBreakdown.find(a => a.archetype === player2.deckArchetype);
      if (archetype2Data && archetype2Data.isUnderrepresented) {
        bonus += this.metaIncentives.underrepresentedBonus;
      }
    }
    
    // Bonus for diverse matchup (different archetypes)
    if (player1.deckArchetype && player2.deckArchetype && 
        player1.deckArchetype !== player2.deckArchetype) {
      bonus += this.metaIncentives.diversityBonus;
    }
    
    return bonus;
  }
  
  /**
   * Record match result
   */
  recordMatchResult(matchId, result, gameResults = []) {
    const tournament = this.currentTournament;
    if (!tournament) {
      throw new Error('No tournament has been created');
    }
    
    // Find the match
    const matchIndex = tournament.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      throw new Error(`Match ${matchId} not found`);
    }
    
    const match = tournament.matches[matchIndex];
    
    // Update match result
    match.result = result;
    match.games = gameResults;
    match.status = 'completed';
    match.endTime = new Date();
    
    // Update player records
    if (result === 'player1') {
      this.updatePlayerRecord(match.player1Id, 'win', match);
      if (match.player2Id) {
        this.updatePlayerRecord(match.player2Id, 'loss', match);
      }
    } else if (result === 'player2') {
      this.updatePlayerRecord(match.player2Id, 'win', match);
      this.updatePlayerRecord(match.player1Id, 'loss', match);
    } else if (result === 'draw') {
      this.updatePlayerRecord(match.player1Id, 'draw', match);
      this.updatePlayerRecord(match.player2Id, 'draw', match);
    }
    
    // Update tournament matches
    tournament.matches[matchIndex] = match;
    
    // Update bracket matches
    if (match.bracket === 'main') {
      const bracketMatchIndex = tournament.brackets.main.matches.findIndex(m => m.id === matchId);
      if (bracketMatchIndex !== -1) {
        tournament.brackets.main.matches[bracketMatchIndex] = match;
      }
    } else if (match.bracket === 'consolation' && tournament.brackets.consolation) {
      const bracketMatchIndex = tournament.brackets.consolation.matches.findIndex(m => m.id === matchId);
      if (bracketMatchIndex !== -1) {
        tournament.brackets.consolation.matches[bracketMatchIndex] = match;
      }
    }
    
    // Check if round is complete
    this.checkRoundCompletion();
    
    return match;
  }
  
  /**
   * Update player record
   */
  updatePlayerRecord(playerId, result, match) {
    const tournament = this.currentTournament;
    const playerIndex = tournament.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;
    
    const player = tournament.players[playerIndex];
    
    // Update wins/losses/draws
    if (result === 'win') {
      player.wins += 1;
      player.matchPoints = (player.wins * 3) + player.draws;
    } else if (result === 'loss') {
      player.losses += 1;
    } else if (result === 'draw') {
      player.draws += 1;
      player.matchPoints = (player.wins * 3) + player.draws;
    }
    
    // Add match to player's match history
    player.matches.push({
      matchId: match.id,
      roundNumber: match.roundNumber,
      opponentId: match.player1Id === playerId ? match.player2Id : match.player1Id,
      result,
      isBye: match.isBye
    });
    
    // Apply meta bonus if applicable
    if (tournament.metaBalancingEnabled && match.metaBonus > 0) {
      if (result === 'win') {
        player.metaBonus += match.metaBonus;
      }
    }
    
    // Update player in tournament
    tournament.players[playerIndex] = player;
  }
  
  /**
   * Check if current round is complete
   */
  checkRoundCompletion() {
    const tournament = this.currentTournament;
    const currentRound = tournament.currentRound;
    
    // Get matches for current round
    const roundMatches = tournament.matches.filter(m => m.roundNumber === currentRound);
    const completedMatches = roundMatches.filter(m => m.status === 'completed');
    
    // If all matches are complete, update standings and prepare for next round
    if (roundMatches.length > 0 && completedMatches.length === roundMatches.length) {
      // Update standings
      this.updateStandings();
      
      // Check if tournament is complete
      const isLastRound = this.isLastRound();
      if (isLastRound) {
        this.finishTournament();
      } else {
        // Advance to next round
        tournament.currentRound += 1;
      }
    }
  }
  
  /**
   * Check if current round is the last round
   */
  isLastRound() {
    const tournament = this.currentTournament;
    const format = tournament.format;
    const currentRound = tournament.currentRound;
    
    if (format === 'hybrid') {
      return currentRound >= (tournament.rounds.swiss + tournament.rounds.elimination);
    } else {
      return currentRound >= tournament.rounds.main;
    }
  }
  
  /**
   * Update player standings
   */
  updateStandings() {
    const tournament = this.currentTournament;
    
    // Calculate tiebreakers for each player
    tournament.players.forEach(player => {
      // Skip dropped players
      if (player.dropped) return;
      
      // Calculate opponent match win percentage (OMW%)
      let totalOpponentWinPercentage = 0;
      let opponentCount = 0;
      
      player.matches.forEach(match => {
        // Skip byes
        if (match.isBye) return;
        
        const opponentIndex = tournament.players.findIndex(p => p.id === match.opponentId);
        if (opponentIndex === -1) return;
        
        const opponent = tournament.players[opponentIndex];
        const opponentMatches = opponent.wins + opponent.losses + opponent.draws;
        
        if (opponentMatches > 0) {
          const winPercentage = Math.max(0.33, opponent.wins / opponentMatches);
          totalOpponentWinPercentage += winPercentage;
          opponentCount++;
        }
      });
      
      player.opponentMatchWinPercentage = opponentCount > 0 ? 
        totalOpponentWinPercentage / opponentCount : 0;
      
      // Calculate game win percentage (GW%)
      const playerMatches = tournament.matches.filter(m => 
        (m.player1Id === player.id || m.player2Id === player.id) && !m.isBye
      );
      
      let gameWins = 0;
      let gameLosses = 0;
      
      playerMatches.forEach(match => {
        match.games.forEach(game => {
          if (game.winnerId === player.id) {
            gameWins++;
          } else if (game.winnerId) {
            gameLosses++;
          }
        });
      });
      
      player.gameWinPercentage = (gameWins + gameLosses) > 0 ? 
        gameWins / (gameWins + gameLosses) : 0;
      
      // Store tiebreakers
      player.tiebreakers = {
        matchPoints: player.matchPoints,
        opponentMatchWinPercentage: player.opponentMatchWinPercentage,
        gameWinPercentage: player.gameWinPercentage,
        metaBonus: player.metaBonus || 0
      };
    });
    
    // Sort players by standings
    const sortedPlayers = [...tournament.players]
      .filter(p => !p.dropped)
      .sort((a, b) => {
        // Primary sort: match points + meta bonus
        const aPoints = (a.matchPoints || 0) + (a.metaBonus || 0);
        const bPoints = (b.matchPoints || 0) + (b.metaBonus || 0);
        if (aPoints !== bPoints) return bPoints - aPoints;
        
        // Secondary sort: opponent match win percentage
        if (a.opponentMatchWinPercentage !== b.opponentMatchWinPercentage) {
          return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
        }
        
        // Tertiary sort: game win percentage
        return b.gameWinPercentage - a.gameWinPercentage;
      });
    
    // Update player standings
    sortedPlayers.forEach((player, index) => {
      const playerIndex = tournament.players.findIndex(p => p.id === player.id);
      if (playerIndex !== -1) {
        tournament.players[playerIndex].standing = index + 1;
      }
    });
  }
  
  /**
   * Finish tournament
   */
  finishTournament() {
    const tournament = this.currentTournament;
    
    // Update final standings
    this.updateStandings();
    
    // Set tournament status to completed
    tournament.status = 'completed';
    tournament.endTime = new Date();
    
    return tournament;
  }
  
  /**
   * Drop player from tournament
   */
  dropPlayer(playerId) {
    const tournament = this.currentTournament;
    if (!tournament) {
      throw new Error('No tournament has been created');
    }
    
    const playerIndex = tournament.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error(`Player ${playerId} not found`);
    }
    
    // Mark player as dropped
    tournament.players[playerIndex].dropped = true;
    
    // If current round has active matches with this player, mark them as losses
    const activeMatches = tournament.matches.filter(m => 
      m.roundNumber === tournament.currentRound && 
      m.status === 'pending' &&
      (m.player1Id === playerId || m.player2Id === playerId)
    );
    
    activeMatches.forEach(match => {
      if (match.player1Id === playerId) {
        this.recordMatchResult(match.id, 'player2');
      } else {
        this.recordMatchResult(match.id, 'player1');
      }
    });
    
    return tournament.players[playerIndex];
  }
  
  /**
   * Get tournament standings
   */
  getStandings() {
    const tournament = this.currentTournament;
    if (!tournament) {
      throw new Error('No tournament has been created');
    }
    
    // Sort players by standing
    return [...tournament.players]
      .sort((a, b) => a.standing - b.standing)
      .map(player => ({
        id: player.id,
        name: player.name,
        standing: player.standing,
        record: `${player.wins}-${player.losses}-${player.draws}`,
        matchPoints: player.matchPoints,
        opponentMatchWinPercentage: player.opponentMatchWinPercentage,
        gameWinPercentage: player.gameWinPercentage,
        metaBonus: player.metaBonus || 0,
        deckArchetype: player.deckArchetype,
        dropped: player.dropped
      }));
  }
  
  /**
   * Get tournament brackets
   */
  getBrackets() {
    const tournament = this.currentTournament;
    if (!tournament) {
      throw new Error('No tournament has been created');
    }
    
    return {
      main: this.formatBracket(tournament.brackets.main),
      consolation: tournament.brackets.consolation ? 
        this.formatBracket(tournament.brackets.consolation) : null
    };
  }
  
  /**
   * Format bracket for display
   */
  formatBracket(bracket) {
    if (!bracket) return null;
    
    // Group matches by round
    const matchesByRound = {};
    bracket.matches.forEach(match => {
      if (!matchesByRound[match.roundNumber]) {
        matchesByRound[match.roundNumber] = [];
      }
      matchesByRound[match.roundNumber].push(match);
    });
    
    // Sort matches within each round by bracket position
    Object.keys(matchesByRound).forEach(round => {
      matchesByRound[round].sort((a, b) => a.bracketPosition - b.bracketPosition);
    });
    
    return {
      rounds: Object.keys(matchesByRound).map(round => ({
        roundNumber: parseInt(round),
        matches: matchesByRound[round].map(match => ({
          id: match.id,
          player1: match.player1 ? {
            id: match.player1.id,
            name: match.player1.name,
            deckArchetype: match.player1.deckArchetype
          } : null,
          player2: match.player2 ? {
            id: match.player2.id,
            name: match.player2.name,
            deckArchetype: match.player2.deckArchetype
          } : null,
          result: match.result,
          isBye: match.isBye,
          status: match.status,
          bracketPosition: match.bracketPosition
        }))
      })).sort((a, b) => a.roundNumber - b.roundNumber)
    };
  }
  
  /**
   * Utility function to shuffle an array
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}