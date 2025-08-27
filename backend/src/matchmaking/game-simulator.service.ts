import { Injectable } from "@nestjs/common";
import { MatchmakingService } from "../matchmaking/matchmaking.service";
import { TelemetryService } from "../matchmaking/telemetry-integration.service";

export interface SimulationPlayer {
  id: string;
  name: string;
  deckId: string;
  skill: number;
  uncertainty: number;
  conservativeRating: number;
}

export interface SimulationParameters {
  players: SimulationPlayer[];
  format: string;
  numberOfGames: number;
  includeSkillProgression?: boolean;
  includeDetailedLogs?: boolean;
  tournamentMode?: boolean;
  rounds?: number;
}

export interface GameSimulationResult {
  gameNumber: number;
  winner: string;
  loser: string;
  turns: number;
  winMethod: "damage" | "mill" | "alternate" | "concede";
  duration: number; // in minutes
  skillFactorInfluence: number; // How much skill affected the outcome (0-1)
  randomnessFactors: {
    mulliganQuality: number;
    manaScrew: boolean;
    cardDraw: number; // luck factor for draws
    topdecks: number; // critical topdecks
  };
}

export interface TournamentSimulationResult {
  rounds: RoundResult[];
  finalStandings: PlayerStanding[];
  ratingChanges: RatingChange[];
  insights: SimulationInsights;
}

export interface RoundResult {
  roundNumber: number;
  pairings: { player1: string; player2: string; quality: number }[];
  results: GameSimulationResult[];
}

export interface PlayerStanding {
  playerId: string;
  wins: number;
  losses: number;
  matchPoints: number;
  gameWinPercentage: number;
  opponentWinPercentage: number;
  finalRating: number;
  ratingChange: number;
}

export interface RatingChange {
  playerId: string;
  oldRating: number;
  newRating: number;
  oldUncertainty: number;
  newUncertainty: number;
  matchesPlayed: number;
}

export interface SimulationInsights {
  skillPredictionAccuracy: number; // How well skill predicted outcomes
  upsetRate: number; // Percentage of games won by lower-rated player
  averageGameLength: number;
  mostInfluentialFactors: string[];
  ratingStabilization: {
    playersImproved: number;
    playersDeclined: number;
    averageUncertaintyReduction: number;
  };
}

@Injectable()
export class GameSimulatorService {
  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly telemetryService: TelemetryService
  ) {}

  /**
   * Simulate a single game between two players using their Bayesian ratings
   */
  async simulateGame(
    player1: SimulationPlayer,
    player2: SimulationPlayer,
    gameNumber: number = 1
  ): Promise<GameSimulationResult> {
    // Calculate win probability based on skill difference
    const skillDiff = player1.skill - player2.skill;
    const totalUncertainty = Math.sqrt(
      player1.uncertainty * player1.uncertainty +
        player2.uncertainty * player2.uncertainty +
        2 * Math.pow(25.0 / 6.0, 2) // Beta squared
    );

    const winProbabilityP1 =
      0.5 * (1 + this.erf(skillDiff / (totalUncertainty * Math.sqrt(2))));

    // Simulate random factors
    const randomFactors = this.simulateRandomFactors();

    // Determine winner based on skill + randomness
    const skillInfluence = 0.7; // 70% skill, 30% randomness
    const randomInfluence = 1 - skillInfluence;

    const combinedProbability =
      winProbabilityP1 * skillInfluence + Math.random() * randomInfluence;

    const player1Wins = Math.random() < combinedProbability;
    const winner = player1Wins ? player1.id : player2.id;
    const loser = player1Wins ? player2.id : player1.id;

    // Simulate game characteristics
    const baseTurns = 12 + Math.floor(Math.random() * 16); // 12-28 turns
    const turns = randomFactors.manaScrew
      ? Math.floor(baseTurns * 0.7)
      : baseTurns;

    const baseDuration = 8 + Math.floor(Math.random() * 25); // 8-33 minutes
    const duration = Math.max(
      3,
      baseDuration - (randomFactors.manaScrew ? 5 : 0)
    );

    const winMethod = this.determineWinMethod(turns, randomFactors);

    return {
      gameNumber,
      winner,
      loser,
      turns,
      winMethod,
      duration,
      skillFactorInfluence: skillInfluence,
      randomnessFactors: randomFactors,
    };
  }

  /**
   * Simulate multiple games and track rating changes
   */
  async simulateMatchSeries(parameters: SimulationParameters): Promise<{
    games: GameSimulationResult[];
    finalRatings: RatingChange[];
    insights: SimulationInsights;
  }> {
    const games: GameSimulationResult[] = [];
    let currentRatings = [...parameters.players];

    // Simulate each game
    for (let i = 0; i < parameters.numberOfGames; i++) {
      const player1 = currentRatings[0];
      const player2 = currentRatings[1];

      const gameResult = await this.simulateGame(player1, player2, i + 1);
      games.push(gameResult);

      // Update ratings if skill progression is enabled
      if (parameters.includeSkillProgression) {
        const updatedRatings = await this.updateSimulatedRatings(
          [player1, player2],
          gameResult,
          parameters.format
        );

        currentRatings[0] = updatedRatings[0];
        currentRatings[1] = updatedRatings[1];
      }
    }

    // Calculate final rating changes
    const finalRatings: RatingChange[] = parameters.players.map(
      (original, index) => {
        const current = currentRatings[index];
        return {
          playerId: original.id,
          oldRating: original.conservativeRating,
          newRating: current.conservativeRating,
          oldUncertainty: original.uncertainty,
          newUncertainty: current.uncertainty,
          matchesPlayed: parameters.numberOfGames,
        };
      }
    );

    // Generate insights
    const insights = this.generateMatchInsights(
      games,
      parameters.players,
      finalRatings
    );

    // Record telemetry
    await this.recordSimulationTelemetry(parameters, games, insights);

    return { games, finalRatings, insights };
  }

  /**
   * Simulate a full Swiss tournament
   */
  async simulateTournament(
    parameters: SimulationParameters
  ): Promise<TournamentSimulationResult> {
    if (!parameters.tournamentMode || !parameters.rounds) {
      throw new Error("Tournament mode requires rounds to be specified");
    }

    let currentPlayers = [...parameters.players];
    const rounds: RoundResult[] = [];
    const allRatingChanges: RatingChange[] = [];

    // Simulate each round
    for (let round = 1; round <= parameters.rounds; round++) {
      const roundResult = await this.simulateSwissRound(
        currentPlayers,
        round,
        parameters.format
      );

      rounds.push(roundResult);

      // Update player ratings based on round results
      const ratingUpdates = await this.updateTournamentRatings(
        currentPlayers,
        roundResult.results,
        parameters.format
      );

      currentPlayers = ratingUpdates.players;
      allRatingChanges.push(...ratingUpdates.changes);
    }

    // Calculate final standings
    const finalStandings = this.calculateFinalStandings(rounds);
    const insights = this.generateTournamentInsights(rounds, allRatingChanges);

    return {
      rounds,
      finalStandings,
      ratingChanges: allRatingChanges,
      insights,
    };
  }

  // Private helper methods
  private async simulateSwissRound(
    players: SimulationPlayer[],
    roundNumber: number,
    format: string
  ): Promise<RoundResult> {
    // Generate pairings using Bayesian matchmaking
    const playerRatings = new Map();
    players.forEach((player) => {
      playerRatings.set(player.id, {
        skill: player.skill,
        uncertainty: player.uncertainty,
        confidenceMultiplier: 3.0,
        conservativeRating: player.conservativeRating,
        matchesPlayed: roundNumber - 1,
        lastUpdated: new Date(),
      });
    });

    const { pairings, qualities } = await this.matchmakingService[
      "bayesianService"
    ].generateSwissPairings(playerRatings);

    const roundPairings = pairings.map((pairing, index) => ({
      player1: pairing[0],
      player2: pairing[1],
      quality: qualities[index].quality,
    }));

    // Simulate each match
    const results: GameSimulationResult[] = [];
    for (const pairing of roundPairings) {
      const player1 = players.find((p) => p.id === pairing.player1)!;
      const player2 = players.find((p) => p.id === pairing.player2)!;

      const gameResult = await this.simulateGame(player1, player2);
      results.push(gameResult);
    }

    return {
      roundNumber,
      pairings: roundPairings,
      results,
    };
  }

  private async updateSimulatedRatings(
    players: SimulationPlayer[],
    gameResult: GameSimulationResult,
    format: string
  ): Promise<SimulationPlayer[]> {
    try {
      const outcomes = [
        {
          playerId: gameResult.winner,
          rank: 1,
        },
        {
          playerId: gameResult.loser,
          rank: 2,
        },
      ];

      const updatedRatings = await this.matchmakingService.updateRatings({
        format,
        outcomes,
      });

      return players.map((player) => {
        const updated = updatedRatings.find((r) => r.userId === player.id);
        if (updated) {
          return {
            ...player,
            skill: updated.skill,
            uncertainty: updated.uncertainty,
            conservativeRating: updated.conservativeRating,
          };
        }
        return player;
      });
    } catch (error) {
      console.warn("Failed to update simulated ratings:", error);
      return players; // Return unchanged if update fails
    }
  }

  private async updateTournamentRatings(
    players: SimulationPlayer[],
    roundResults: GameSimulationResult[],
    format: string
  ): Promise<{ players: SimulationPlayer[]; changes: RatingChange[] }> {
    const originalPlayers = [...players];
    let updatedPlayers = [...players];
    const changes: RatingChange[] = [];

    for (const result of roundResults) {
      const outcomes = [
        { playerId: result.winner, rank: 1 },
        { playerId: result.loser, rank: 2 },
      ];

      try {
        const updatedRatings = await this.matchmakingService.updateRatings({
          format,
          outcomes,
        });

        // Update players with new ratings
        updatedPlayers = updatedPlayers.map((player) => {
          const updated = updatedRatings.find((r) => r.userId === player.id);
          if (updated) {
            const original = originalPlayers.find((p) => p.id === player.id)!;
            changes.push({
              playerId: player.id,
              oldRating: original.conservativeRating,
              newRating: updated.conservativeRating,
              oldUncertainty: original.uncertainty,
              newUncertainty: updated.uncertainty,
              matchesPlayed: updated.matchesPlayed,
            });

            return {
              ...player,
              skill: updated.skill,
              uncertainty: updated.uncertainty,
              conservativeRating: updated.conservativeRating,
            };
          }
          return player;
        });
      } catch (error) {
        console.warn("Failed to update tournament ratings:", error);
      }
    }

    return { players: updatedPlayers, changes };
  }

  private simulateRandomFactors() {
    return {
      mulliganQuality: Math.random(), // 0-1, how good the opening hand was
      manaScrew: Math.random() < 0.15, // 15% chance of mana issues
      cardDraw: Math.random(), // 0-1, luck in drawing the right cards
      topdecks: Math.floor(Math.random() * 3), // 0-2 critical topdecks
    };
  }

  private determineWinMethod(
    turns: number,
    factors: any
  ): GameSimulationResult["winMethod"] {
    if (factors.manaScrew) return "damage"; // Quick games due to mana issues
    if (turns > 20) return Math.random() < 0.3 ? "mill" : "alternate";
    if (turns < 8) return "damage";
    return Math.random() < 0.1 ? "concede" : "damage";
  }

  private calculateFinalStandings(rounds: RoundResult[]): PlayerStanding[] {
    const standings = new Map<string, PlayerStanding>();

    // Initialize standings
    rounds[0].pairings.forEach((pairing) => {
      [pairing.player1, pairing.player2].forEach((playerId) => {
        standings.set(playerId, {
          playerId,
          wins: 0,
          losses: 0,
          matchPoints: 0,
          gameWinPercentage: 0,
          opponentWinPercentage: 0,
          finalRating: 0,
          ratingChange: 0,
        });
      });
    });

    // Calculate standings from all rounds
    rounds.forEach((round) => {
      round.results.forEach((result) => {
        const winner = standings.get(result.winner)!;
        const loser = standings.get(result.loser)!;

        winner.wins++;
        winner.matchPoints += 3;
        loser.losses++;
      });
    });

    // Calculate percentages
    standings.forEach((standing) => {
      const totalGames = standing.wins + standing.losses;
      standing.gameWinPercentage =
        totalGames > 0 ? (standing.wins / totalGames) * 100 : 0;
    });

    return Array.from(standings.values()).sort(
      (a, b) => b.matchPoints - a.matchPoints
    );
  }

  private generateMatchInsights(
    games: GameSimulationResult[],
    players: SimulationPlayer[],
    ratings: RatingChange[]
  ): SimulationInsights {
    const totalGames = games.length;
    const upsets = games.filter((game) => {
      const winner = players.find((p) => p.id === game.winner)!;
      const loser = players.find((p) => p.id === game.loser)!;
      return winner.conservativeRating < loser.conservativeRating;
    });

    const avgGameLength =
      games.reduce((sum, game) => sum + game.turns, 0) / totalGames;
    const avgSkillInfluence =
      games.reduce((sum, game) => sum + game.skillFactorInfluence, 0) /
      totalGames;

    return {
      skillPredictionAccuracy: (1 - upsets.length / totalGames) * 100,
      upsetRate: (upsets.length / totalGames) * 100,
      averageGameLength: avgGameLength,
      mostInfluentialFactors: ["skill", "randomness", "deck_quality"],
      ratingStabilization: {
        playersImproved: ratings.filter((r) => r.newRating > r.oldRating)
          .length,
        playersDeclined: ratings.filter((r) => r.newRating < r.oldRating)
          .length,
        averageUncertaintyReduction:
          ratings.reduce(
            (sum, r) => sum + (r.oldUncertainty - r.newUncertainty),
            0
          ) / ratings.length,
      },
    };
  }

  private generateTournamentInsights(
    rounds: RoundResult[],
    changes: RatingChange[]
  ): SimulationInsights {
    const allGames = rounds.flatMap((r) => r.results);
    return this.generateMatchInsights(allGames, [], changes);
  }

  private async recordSimulationTelemetry(
    parameters: SimulationParameters,
    games: GameSimulationResult[],
    insights: SimulationInsights
  ): Promise<void> {
    try {
      await this.telemetryService.recordSimulation({
        player1Id: parameters.players[0].id,
        player2Id: parameters.players[1].id,
        format: parameters.format,
        numberOfGames: parameters.numberOfGames,
        predictedWinRate: 0.5, // Would calculate from initial ratings
        actualWinRate:
          games.filter((g) => g.winner === parameters.players[0].id).length /
          games.length,
        accuracy: insights.skillPredictionAccuracy / 100,
        timestamp: new Date(),
      });
    } catch (error) {
      console.warn("Failed to record simulation telemetry:", error);
    }
  }

  // Error function approximation
  private erf(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y =
      1.0 -
      ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }
}
