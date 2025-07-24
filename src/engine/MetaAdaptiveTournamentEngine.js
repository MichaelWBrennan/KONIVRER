/**
 * Meta-Adaptive Tournament Engine
 * Industry-leading tournament management with dynamic adaptation
 */

export class MetaAdaptiveTournamentEngine {
  constructor(bayesianEngine) {
    this.bayesianEngine = bayesianEngine;
    this.metaData = new Map();
    this.tournamentHistory = [];
    this.adaptiveRules = new Map();
    this.balancingIncentives = new Map();
  }

  /**
   * Dynamic Swiss Pairings with Meta Considerations
   */
  generateDynamicSwissPairings(players, round, tournamentId) {
    const sortedPlayers = [...players].sort((a, b) => {
      // Primary sort by points
      const pointDiff = (b.points || 0) - (a.points || 0);
      if (pointDiff !== 0) return pointDiff;
      
      // Secondary sort by Bayesian rating
      return (b.rating || 1500) - (a.rating || 1500);
    });

    const pairings = [];
    const paired = new Set();
    const metaBalance = this.calculateMetaBalance(players);

    for (let i = 0; i < sortedPlayers.length; i++) {
      if (paired.has(sortedPlayers[i].id)) continue;

      const player1 = sortedPlayers[i];
      let bestOpponent = null;
      let bestScore = -Infinity;

      // Find optimal opponent considering multiple factors
      for (let j = i + 1; j < sortedPlayers.length; j++) {
        if (paired.has(sortedPlayers[j].id)) continue;

        const player2 = sortedPlayers[j];
        const pairingScore = this.calculatePairingScore(
          player1, 
          player2, 
          round, 
          tournamentId,
          metaBalance
        );

        if (pairingScore > bestScore) {
          bestScore = pairingScore;
          bestOpponent = player2;
        }
      }

      if (bestOpponent) {
        pairings.push({
          player1: player1.id,
          player2: bestOpponent.id,
          table: pairings.length + 1,
          round,
          expectedQuality: bestScore,
          metaMatchup: this.getMetaMatchup(player1, bestOpponent)
        });

        paired.add(player1.id);
        paired.add(bestOpponent.id);
      }
    }

    // Handle odd number of players with intelligent bye assignment
    if (sortedPlayers.length % 2 === 1) {
      const unpaired = sortedPlayers.find(p => !paired.has(p.id));
      if (unpaired) {
        pairings.push({
          player1: unpaired.id,
          player2: 'bye',
          table: 0,
          round,
          expectedQuality: 1.0,
          metaMatchup: 'bye'
        });
      }
    }

    return pairings;
  }

  /**
   * Calculate pairing quality score considering multiple factors
   */
  calculatePairingScore(player1, player2, round, tournamentId, metaBalance) {
    let score = 0;

    // 1. Rating proximity (closer ratings = better matches)
    const ratingDiff = Math.abs((player1.rating || 1500) - (player2.rating || 1500));
    const ratingScore = Math.max(0, 1 - (ratingDiff / 400)); // Normalize to 0-1
    score += ratingScore * 0.3;

    // 2. Avoid repeat pairings
    const hasPlayedBefore = this.havePlayersMetBefore(player1.id, player2.id, tournamentId);
    if (!hasPlayedBefore) {
      score += 0.25;
    }

    // 3. Meta diversity bonus
    const metaDiversityBonus = this.calculateMetaDiversityBonus(
      player1, 
      player2, 
      metaBalance
    );
    score += metaDiversityBonus * 0.2;

    // 4. Confidence level matching
    const confidenceMatch = this.calculateConfidenceMatch(player1, player2);
    score += confidenceMatch * 0.15;

    // 5. Playstyle compatibility
    const playstyleScore = this.calculatePlaystyleCompatibility(player1, player2);
    score += playstyleScore * 0.1;

    return score;
  }

  /**
   * Calculate meta balance across tournament
   */
  calculateMetaBalance(players) {
    const archetypeCounts = new Map();
    let totalPlayers = 0;

    players.forEach(player => {
      if (player.currentDeck && player.currentDeck.archetype) {
        const archetype = player.currentDeck.archetype;
        archetypeCounts.set(archetype, (archetypeCounts.get(archetype) || 0) + 1);
        totalPlayers++;
      }
    });

    const balance = new Map();
    archetypeCounts.forEach((count, archetype) => {
      balance.set(archetype, {
        count,
        percentage: (count / totalPlayers) * 100,
        isOverrepresented: (count / totalPlayers) > 0.15,
        isUnderrepresented: (count / totalPlayers) < 0.05
      });
    });

    return balance;
  }

  /**
   * Calculate meta diversity bonus for pairings
   */
  calculateMetaDiversityBonus(player1, player2, metaBalance) {
    if (!player1.currentDeck || !player2.currentDeck) return 0;

    const arch1 = player1.currentDeck.archetype;
    const arch2 = player2.currentDeck.archetype;

    if (arch1 === arch2) {
      // Mirror matches get penalty if archetype is overrepresented
      const archData = metaBalance.get(arch1);
      if (archData && archData.isOverrepresented) {
        return -0.3; // Discourage mirror matches of overrepresented decks
      }
      return 0;
    }

    // Bonus for interesting matchups
    const matchupInterest = this.getMatchupInterestLevel(arch1, arch2);
    return matchupInterest;
  }

  /**
   * Get matchup interest level based on historical data
   */
  getMatchupInterestLevel(arch1, arch2) {
    // This would be populated from historical match data
    const interestingMatchups = new Map([
      ['Control-Aggro', 0.8],
      ['Combo-Control', 0.7],
      ['Midrange-Aggro', 0.6],
      ['Tempo-Control', 0.7]
    ]);

    const matchupKey = `${arch1}-${arch2}`;
    const reverseKey = `${arch2}-${arch1}`;

    return interestingMatchups.get(matchupKey) || 
           interestingMatchups.get(reverseKey) || 
           0.5; // Default moderate interest
  }

  /**
   * Calculate confidence level matching
   */
  calculateConfidenceMatch(player1, player2) {
    const uncertainty1 = player1.uncertainty || 50;
    const uncertainty2 = player2.uncertainty || 50;
    
    const uncertaintyDiff = Math.abs(uncertainty1 - uncertainty2);
    return Math.max(0, 1 - (uncertaintyDiff / 100));
  }

  /**
   * Calculate playstyle compatibility
   */
  calculatePlaystyleCompatibility(player1, player2) {
    if (!player1.playstyle || !player2.playstyle) return 0.5;

    // Complementary playstyles create more interesting games
    const compatibilityMatrix = {
      'aggressive': { 'control': 0.9, 'midrange': 0.7, 'combo': 0.6, 'aggressive': 0.3 },
      'control': { 'aggressive': 0.9, 'combo': 0.8, 'midrange': 0.6, 'control': 0.4 },
      'combo': { 'control': 0.8, 'aggressive': 0.6, 'midrange': 0.5, 'combo': 0.2 },
      'midrange': { 'aggressive': 0.7, 'control': 0.6, 'combo': 0.5, 'midrange': 0.5 }
    };

    return compatibilityMatrix[player1.playstyle]?.[player2.playstyle] || 0.5;
  }

  /**
   * Check if players have met before in this tournament
   */
  havePlayersMetBefore(player1Id, player2Id, tournamentId) {
    // This would check tournament history
    return false; // Simplified for now
  }

  /**
   * Adaptive Tournament Structure Selection
   */
  selectOptimalTournamentStructure(participantCount, timeConstraint, skillVariance) {
    const structures = [
      {
        name: 'Swiss with Top Cut',
        minPlayers: 8,
        maxPlayers: 512,
        timePerRound: 50,
        rounds: Math.ceil(Math.log2(participantCount)),
        topCutSize: Math.max(4, Math.floor(participantCount / 8)),
        suitability: this.calculateStructureSuitability(
          'swiss', participantCount, timeConstraint, skillVariance
        )
      },
      {
        name: 'Double Elimination',
        minPlayers: 4,
        maxPlayers: 64,
        timePerRound: 50,
        rounds: Math.ceil(Math.log2(participantCount)) * 2 - 1,
        suitability: this.calculateStructureSuitability(
          'double_elim', participantCount, timeConstraint, skillVariance
        )
      },
      {
        name: 'Round Robin',
        minPlayers: 3,
        maxPlayers: 12,
        timePerRound: 50,
        rounds: participantCount - 1,
        suitability: this.calculateStructureSuitability(
          'round_robin', participantCount, timeConstraint, skillVariance
        )
      },
      {
        name: 'Adaptive Hybrid',
        minPlayers: 16,
        maxPlayers: 256,
        timePerRound: 45,
        rounds: Math.ceil(Math.log2(participantCount)) + 2,
        suitability: this.calculateStructureSuitability(
          'hybrid', participantCount, timeConstraint, skillVariance
        )
      }
    ];

    // Filter by constraints and sort by suitability
    const viableStructures = structures
      .filter(s => 
        participantCount >= s.minPlayers && 
        participantCount <= s.maxPlayers &&
        (s.rounds * s.timePerRound) <= timeConstraint
      )
      .sort((a, b) => b.suitability - a.suitability);

    return viableStructures[0] || structures[0]; // Return best or fallback
  }

  /**
   * Calculate structure suitability score
   */
  calculateStructureSuitability(structureType, participantCount, timeConstraint, skillVariance) {
    let score = 0;

    switch (structureType) {
      case 'swiss':
        // Swiss is great for large, diverse fields
        score += participantCount > 16 ? 0.8 : 0.5;
        score += skillVariance > 200 ? 0.7 : 0.4;
        break;
      
      case 'double_elim':
        // Double elim is good for smaller, competitive fields
        score += participantCount <= 32 ? 0.9 : 0.3;
        score += skillVariance < 150 ? 0.8 : 0.5;
        break;
      
      case 'round_robin':
        // Round robin for small, skill-matched groups
        score += participantCount <= 8 ? 1.0 : 0.1;
        score += skillVariance < 100 ? 0.9 : 0.3;
        break;
      
      case 'hybrid':
        // Hybrid adapts well to medium-sized events
        score += participantCount >= 16 && participantCount <= 64 ? 0.9 : 0.6;
        score += 0.7; // Generally versatile
        break;
    }

    return Math.min(1.0, score);
  }

  /**
   * Meta-Balancing Incentives System
   */
  calculateArchetypeIncentives(currentMeta, targetDiversity = 0.15) {
    const incentives = new Map();

    currentMeta.forEach((data, archetype) => {
      const currentPercentage = data.percentage / 100;
      let incentiveMultiplier = 1.0;

      if (currentPercentage > targetDiversity * 2) {
        // Overrepresented - apply penalty
        incentiveMultiplier = 0.8;
      } else if (currentPercentage < targetDiversity * 0.5) {
        // Underrepresented - apply bonus
        incentiveMultiplier = 1.3;
      }

      incentives.set(archetype, {
        multiplier: incentiveMultiplier,
        bonusPoints: Math.max(0, (targetDiversity - currentPercentage) * 10),
        reason: this.getIncentiveReason(currentPercentage, targetDiversity)
      });
    });

    return incentives;
  }

  /**
   * Get reason for incentive adjustment
   */
  getIncentiveReason(currentPercentage, targetPercentage) {
    if (currentPercentage > targetPercentage * 2) {
      return 'Overrepresented in meta - reduced rewards';
    } else if (currentPercentage < targetPercentage * 0.5) {
      return 'Underrepresented in meta - bonus rewards';
    }
    return 'Balanced representation';
  }

  /**
   * Dynamic K-Factor Calculation
   */
  calculateDynamicKFactor(player, match, tournament) {
    let baseFactor = 32; // Standard K-factor

    // Tournament importance modifier
    const importanceModifier = this.getTournamentImportanceModifier(tournament);
    baseFactor *= importanceModifier;

    // Player experience modifier
    const experienceModifier = this.getPlayerExperienceModifier(player);
    baseFactor *= experienceModifier;

    // Match stakes modifier
    const stakesModifier = this.getMatchStakesModifier(match, tournament);
    baseFactor *= stakesModifier;

    // Uncertainty modifier (higher uncertainty = higher K-factor)
    const uncertaintyModifier = 1 + ((player.uncertainty || 50) / 200);
    baseFactor *= uncertaintyModifier;

    return Math.max(8, Math.min(64, Math.round(baseFactor)));
  }

  /**
   * Get tournament importance modifier
   */
  getTournamentImportanceModifier(tournament) {
    const importanceMap = {
      'casual': 0.7,
      'local': 1.0,
      'regional': 1.3,
      'national': 1.6,
      'international': 2.0
    };

    return importanceMap[tournament.importance] || 1.0;
  }

  /**
   * Get player experience modifier
   */
  getPlayerExperienceModifier(player) {
    const matchesPlayed = player.matchHistory?.length || 0;
    
    if (matchesPlayed < 10) return 1.5; // New players
    if (matchesPlayed < 50) return 1.2; // Developing players
    if (matchesPlayed < 200) return 1.0; // Experienced players
    return 0.8; // Veteran players (more stable ratings)
  }

  /**
   * Get match stakes modifier
   */
  getMatchStakesModifier(match, tournament) {
    if (match.isElimination) return 1.4;
    if (match.round > (tournament.rounds * 0.75)) return 1.2; // Late rounds
    if (match.round <= 2) return 0.9; // Early rounds
    return 1.0;
  }

  /**
   * Parallel Bracket Management
   */
  createParallelBrackets(players, mainBracketSize = 0.5) {
    const sortedPlayers = [...players].sort((a, b) => (b.rating || 1500) - (a.rating || 1500));
    const mainSize = Math.floor(players.length * mainBracketSize);
    
    const mainBracket = sortedPlayers.slice(0, mainSize);
    const consolationBracket = sortedPlayers.slice(mainSize);

    return {
      main: {
        players: mainBracket,
        structure: this.selectOptimalTournamentStructure(
          mainBracket.length, 
          300, // 5 hours
          this.calculateSkillVariance(mainBracket)
        ),
        prizes: this.calculateMainBracketPrizes(mainBracket.length)
      },
      consolation: {
        players: consolationBracket,
        structure: this.selectOptimalTournamentStructure(
          consolationBracket.length,
          240, // 4 hours
          this.calculateSkillVariance(consolationBracket)
        ),
        prizes: this.calculateConsolationPrizes(consolationBracket.length)
      }
    };
  }

  /**
   * Calculate skill variance for a group of players
   */
  calculateSkillVariance(players) {
    if (players.length < 2) return 0;

    const ratings = players.map(p => p.rating || 1500);
    const mean = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    const variance = ratings.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / ratings.length;
    
    return Math.sqrt(variance);
  }

  /**
   * Calculate main bracket prizes
   */
  calculateMainBracketPrizes(playerCount) {
    const prizePool = playerCount * 10; // $10 per player
    const distribution = [0.4, 0.25, 0.15, 0.1, 0.05, 0.05]; // Top 6 places
    
    return distribution.map((percentage, index) => ({
      place: index + 1,
      amount: Math.round(prizePool * percentage),
      percentage: percentage * 100
    }));
  }

  /**
   * Calculate consolation bracket prizes
   */
  calculateConsolationPrizes(playerCount) {
    const prizePool = playerCount * 3; // $3 per player
    const distribution = [0.5, 0.3, 0.2]; // Top 3 places
    
    return distribution.map((percentage, index) => ({
      place: index + 1,
      amount: Math.round(prizePool * percentage),
      percentage: percentage * 100
    }));
  }

  /**
   * Get meta matchup information
   */
  getMetaMatchup(player1, player2) {
    if (!player1.currentDeck || !player2.currentDeck) return 'unknown';
    
    const arch1 = player1.currentDeck.archetype;
    const arch2 = player2.currentDeck.archetype;
    
    if (arch1 === arch2) return 'mirror';
    
    return `${arch1} vs ${arch2}`;
  }

  /**
   * Export tournament data for analysis
   */
  exportTournamentData(tournamentId) {
    const tournament = this.tournamentHistory.find(t => t.id === tournamentId);
    if (!tournament) return null;

    return {
      id: tournament.id,
      structure: tournament.structure,
      participants: tournament.participants,
      rounds: tournament.rounds,
      pairings: tournament.pairings,
      results: tournament.results,
      metaBreakdown: tournament.metaBreakdown,
      analytics: {
        averageMatchQuality: this.calculateAverageMatchQuality(tournament),
        metaDiversity: this.calculateMetaDiversity(tournament),
        competitiveBalance: this.calculateCompetitiveBalance(tournament)
      }
    };
  }

  /**
   * Calculate average match quality for tournament
   */
  calculateAverageMatchQuality(tournament) {
    if (!tournament.pairings || tournament.pairings.length === 0) return 0;
    
    const totalQuality = tournament.pairings.reduce(
      (sum, pairing) => sum + (pairing.expectedQuality || 0), 
      0
    );
    
    return totalQuality / tournament.pairings.length;
  }

  /**
   * Calculate meta diversity index
   */
  calculateMetaDiversity(tournament) {
    if (!tournament.metaBreakdown) return 0;
    
    // Shannon diversity index
    const total = tournament.participants.length;
    let diversity = 0;
    
    tournament.metaBreakdown.forEach(archetype => {
      const proportion = archetype.count / total;
      if (proportion > 0) {
        diversity -= proportion * Math.log2(proportion);
      }
    });
    
    return diversity;
  }

  /**
   * Calculate competitive balance
   */
  calculateCompetitiveBalance(tournament) {
    if (!tournament.results || tournament.results.length === 0) return 0;
    
    // Measure how evenly distributed wins are among participants
    const winCounts = new Map();
    
    tournament.results.forEach(result => {
      const winner = result.winner;
      winCounts.set(winner, (winCounts.get(winner) || 0) + 1);
    });
    
    const winDistribution = Array.from(winCounts.values());
    const mean = winDistribution.reduce((sum, wins) => sum + wins, 0) / winDistribution.length;
    const variance = winDistribution.reduce(
      (sum, wins) => sum + Math.pow(wins - mean, 2), 
      0
    ) / winDistribution.length;
    
    // Lower variance indicates better balance
    return Math.max(0, 1 - (Math.sqrt(variance) / mean));
  }
}

export default MetaAdaptiveTournamentEngine;