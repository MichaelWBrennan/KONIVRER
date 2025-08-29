import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { PlayerRating } from "./entities/player-rating.entity";
import { User } from "../users/entities/user.entity";
import {
  BayesianMatchmakingService,
  BayesianRating,
  MatchOutcome,
  MatchQuality,
} from "./bayesian-matchmaking.service";
import { TelemetryService } from "./telemetry-integration.service";
import {
  UpdateRatingsDto,
  GeneratePairingsDto,
  PlayerRatingResponseDto,
  MatchQualityResponseDto,
  PairingResponseDto,
  GeneratePairingsResponseDto,
  SimulateMatchDto,
  SimulationResultDto,
} from "./dto/matchmaking.dto";

@Injectable()
export class MatchmakingService {
  constructor(
    @InjectRepository(PlayerRating)
    private readonly ratingRepository: Repository<PlayerRating>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bayesianService: BayesianMatchmakingService,
    private readonly telemetryService: TelemetryService
  ) {}

  /**
   * Get or create player rating for a specific format
   */
  async getOrCreatePlayerRating(
    userId: string,
    format: string
  ): Promise<PlayerRating> {
    let rating = await this.ratingRepository.findOne({
      where: { userId, format },
      relations: ["user"],
    });

    if (!rating) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException("User not found");
      }

      const initialBayesianRating = this.bayesianService.createInitialRating();

      rating = this.ratingRepository.create({
        userId,
        format,
        skill: initialBayesianRating.skill,
        uncertainty: initialBayesianRating.uncertainty,
        confidenceMultiplier: initialBayesianRating.confidenceMultiplier,
        conservativeRating: initialBayesianRating.conservativeRating,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        currentStreak: 0,
        streakType: "none",
        longestWinStreak: 0,
        user,
      });

      rating = await this.ratingRepository.save(rating);
    }

    return rating;
  }

  /**
   * Update player ratings based on match results
   */
  async updateRatings(
    updateDto: UpdateRatingsDto
  ): Promise<PlayerRatingResponseDto[]> {
    const { format, outcomes } = updateDto;

    // Get all player ratings
    const playerIds = outcomes.map((o) => o.playerId);
    const ratings = await Promise.all(
      playerIds.map((id) => this.getOrCreatePlayerRating(id, format))
    );

    // Convert to Bayesian rating format
    const bayesianRatings: BayesianRating[] = ratings.map((r) => ({
      skill: r.skill,
      uncertainty: r.uncertainty,
      confidenceMultiplier: r.confidenceMultiplier,
      conservativeRating: r.conservativeRating,
      matchesPlayed: r.matchesPlayed,
      lastUpdated: r.updatedAt,
    }));

    // Convert outcomes to Bayesian format
    const bayesianOutcomes: MatchOutcome[] = outcomes.map((o) => ({
      playerId: o.playerId,
      rank: o.rank,
      performance: o.performance,
    }));

    // Update ratings using Bayesian algorithm
    const updatedBayesianRatings = this.bayesianService.updateRatings(
      bayesianRatings,
      bayesianOutcomes
    );

    // Apply updates to database entities
    const updatedRatings = await Promise.all(
      ratings.map(async (rating, index) => {
        const updated = updatedBayesianRatings[index];
        const outcome = outcomes[index];

        // Update Bayesian values
        rating.skill = updated.skill;
        rating.uncertainty = updated.uncertainty;
        rating.conservativeRating = updated.conservativeRating;
        rating.matchesPlayed = updated.matchesPlayed;

        // Update win/loss/draw counts and streaks
        this.updateMatchOutcomeStats(rating, outcome.rank, outcomes.length);

        // Update peak rating if improved
        if (
          !rating.peakRating ||
          rating.conservativeRating > rating.peakRating
        ) {
          rating.peakRating = rating.conservativeRating;
          rating.peakRatingDate = new Date();
        }

        // Update rating history
        this.updateRatingHistory(
          rating,
          outcome.rank === 1
            ? "win"
            : outcome.rank === outcomes.length
            ? "loss"
            : "draw"
        );

        return await this.ratingRepository.save(rating);
      })
    );

    // Update percentile ranks for all players in this format
    await this.updatePercentileRanks(format);

    // Record telemetry
    await this.recordMatchTelemetry(updateDto, updatedRatings);

    return updatedRatings.map(this.toResponseDto);
  }

  /**
   * Generate optimal pairings using Bayesian matchmaking
   */
  async generatePairings(
    generateDto: GeneratePairingsDto
  ): Promise<GeneratePairingsResponseDto> {
    const {
      playerIds,
      format,
      previousPairings = [],
      tournamentId,
      round,
    } = generateDto;

    if (playerIds.length < 2) {
      throw new BadRequestException("At least 2 players required for pairings");
    }

    // Get all player ratings
    const ratings = await Promise.all(
      playerIds.map((id) => this.getOrCreatePlayerRating(id, format))
    );

    // Convert to map for Bayesian service
    const ratingMap = new Map<string, BayesianRating>();
    ratings.forEach((rating) => {
      ratingMap.set(rating.userId, {
        skill: rating.skill,
        uncertainty: rating.uncertainty,
        confidenceMultiplier: rating.confidenceMultiplier,
        conservativeRating: rating.conservativeRating,
        matchesPlayed: rating.matchesPlayed,
        lastUpdated: rating.updatedAt,
      });
    });

    // Generate pairings using Bayesian algorithm
    const { pairings, qualities } = this.bayesianService.generateSwissPairings(
      ratingMap,
      previousPairings
    );

    // Convert to response format
    const pairingResponses: PairingResponseDto[] = pairings.map(
      (pairing, index) => {
        const quality = qualities[index];
        const balanceCategory = this.getBalanceCategory(quality.quality);

        return {
          players: pairing,
          quality: {
            quality: quality.quality,
            winProbabilities: quality.winProbabilities,
            skillDifference: quality.skillDifference,
            uncertaintyFactor: quality.uncertaintyFactor,
            balanceCategory,
          },
          priority: Math.round(quality.quality * 10),
          expectedDuration: this.estimateMatchDuration(quality),
        };
      }
    );

    // Calculate overall quality metrics
    const overallQuality =
      qualities.reduce((sum, q) => sum + q.quality, 0) / qualities.length;
    const byes = playerIds.length % 2;

    const response: GeneratePairingsResponseDto = {
      pairings: pairingResponses,
      overallQuality,
      byes,
      tournamentId,
      round,
      algorithm: "TrueSkill Bayesian Swiss",
      generatedAt: new Date(),
    };

    // Record pairing telemetry
    await this.recordPairingTelemetry(response);

    return response;
  }

  /**
   * Calculate match quality between specific players
   */
  async calculateMatchQuality(
    player1Id: string,
    player2Id: string,
    format: string
  ): Promise<MatchQualityResponseDto> {
    const [rating1, rating2] = await Promise.all([
      this.getOrCreatePlayerRating(player1Id, format),
      this.getOrCreatePlayerRating(player2Id, format),
    ]);

    const bayesianRatings: BayesianRating[] = [
      {
        skill: rating1.skill,
        uncertainty: rating1.uncertainty,
        confidenceMultiplier: rating1.confidenceMultiplier,
        conservativeRating: rating1.conservativeRating,
        matchesPlayed: rating1.matchesPlayed,
        lastUpdated: rating1.updatedAt,
      },
      {
        skill: rating2.skill,
        uncertainty: rating2.uncertainty,
        confidenceMultiplier: rating2.confidenceMultiplier,
        conservativeRating: rating2.conservativeRating,
        matchesPlayed: rating2.matchesPlayed,
        lastUpdated: rating2.updatedAt,
      },
    ];

    const quality = this.bayesianService.calculateMatchQuality(bayesianRatings);

    return {
      quality: quality.quality,
      winProbabilities: quality.winProbabilities,
      skillDifference: quality.skillDifference,
      uncertaintyFactor: quality.uncertaintyFactor,
      balanceCategory: this.getBalanceCategory(quality.quality),
    };
  }

  /**
   * Simulate match outcome based on player ratings
   */
  async simulateMatch(
    simulateDto: SimulateMatchDto
  ): Promise<SimulationResultDto> {
    const {
      player1Id,
      player2Id,
      format,
      numberOfGames,
      includeDetailedLogs = false,
    } = simulateDto;

    const matchQuality = await this.calculateMatchQuality(
      player1Id,
      player2Id,
      format
    );
    const [winProb1, winProb2] = matchQuality.winProbabilities;

    let player1Wins = 0;
    let player2Wins = 0;
    let draws = 0;
    let totalTurns = 0;
    const detailedLogs: any[] = [];

    // Run simulations
    for (let i = 0; i < numberOfGames; i++) {
      const random = Math.random();
      const drawThreshold = 0.1; // 10% draw rate

      let outcome: "player1" | "player2" | "draw";
      let gameTurns: number;

      if (random < drawThreshold) {
        outcome = "draw";
        draws++;
        gameTurns = Math.floor(Math.random() * 10) + 15; // 15-25 turns for draws
      } else {
        const adjustedRandom = (random - drawThreshold) / (1 - drawThreshold);
        if (adjustedRandom < winProb1) {
          outcome = "player1";
          player1Wins++;
        } else {
          outcome = "player2";
          player2Wins++;
        }
        gameTurns = Math.floor(Math.random() * 15) + 8; // 8-22 turns for decisive games
      }

      totalTurns += gameTurns;

      if (includeDetailedLogs) {
        detailedLogs.push({
          gameNumber: i + 1,
          outcome,
          turns: gameTurns,
          winProbabilities: [winProb1, winProb2],
          timestamp: new Date(),
        });
      }
    }

    // Calculate confidence interval for win rate
    const p1WinRate = player1Wins / numberOfGames;
    const se = Math.sqrt((p1WinRate * (1 - p1WinRate)) / numberOfGames);
    const z = 1.96; // 95% confidence
    const confidenceInterval = {
      lower: Math.max(0, p1WinRate - z * se),
      upper: Math.min(1, p1WinRate + z * se),
      confidence: 0.95,
    };

    return {
      player1WinRate: (player1Wins / numberOfGames) * 100,
      player2WinRate: (player2Wins / numberOfGames) * 100,
      drawRate: (draws / numberOfGames) * 100,
      totalGames: numberOfGames,
      averageGameLength: totalTurns / numberOfGames,
      confidenceInterval,
      detailedLogs: includeDetailedLogs ? detailedLogs : undefined,
    };
  }

  /**
   * Get player leaderboard for a format
   */
  async getLeaderboard(
    format: string,
    limit: number = 50
  ): Promise<PlayerRatingResponseDto[]> {
    const ratings = await this.ratingRepository.find({
      where: { format },
      relations: ["user"],
      order: { conservativeRating: "DESC" },
      take: limit,
    });

    return ratings.map(this.toResponseDto);
  }

  /**
   * Get player rating for specific format
   */
  async getPlayerRating(
    userId: string,
    format: string
  ): Promise<PlayerRatingResponseDto> {
    const rating = await this.getOrCreatePlayerRating(userId, format);
    return this.toResponseDto(rating);
  }

  // Private helper methods
  private updateMatchOutcomeStats(
    rating: PlayerRating,
    rank: number,
    totalPlayers: number
  ): void {
    const isWin = rank === 1;
    const isLoss = rank === totalPlayers;
    const isDraw = !isWin && !isLoss;

    if (isWin) {
      rating.wins++;
      if (rating.streakType === "win") {
        rating.currentStreak++;
      } else {
        rating.currentStreak = 1;
        rating.streakType = "win";
      }
      if (rating.currentStreak > rating.longestWinStreak) {
        rating.longestWinStreak = rating.currentStreak;
      }
    } else if (isLoss) {
      rating.losses++;
      if (rating.streakType === "loss") {
        rating.currentStreak++;
      } else {
        rating.currentStreak = 1;
        rating.streakType = "loss";
      }
    } else if (isDraw) {
      rating.draws++;
      rating.currentStreak = 0;
      rating.streakType = "none";
    }
  }

  private updateRatingHistory(
    rating: PlayerRating,
    outcome: "win" | "loss" | "draw"
  ): void {
    if (!rating.ratingHistory) {
      rating.ratingHistory = [];
    }

    rating.ratingHistory.push({
      date: new Date(),
      skill: rating.skill,
      uncertainty: rating.uncertainty,
      conservativeRating: rating.conservativeRating,
      matchOutcome: outcome,
    });

    // Keep only last 50 entries
    if (rating.ratingHistory.length > 50) {
      rating.ratingHistory = rating.ratingHistory.slice(-50);
    }
  }

  private async updatePercentileRanks(format: string): Promise<void> {
    const allRatings = await this.ratingRepository.find({
      where: { format },
      order: { conservativeRating: "ASC" },
    });

    for (let i = 0; i < allRatings.length; i++) {
      allRatings[i].percentileRank = (i / allRatings.length) * 100;
      await this.ratingRepository.save(allRatings[i]);
    }
  }

  private getBalanceCategory(
    quality: number
  ): "excellent" | "good" | "fair" | "poor" {
    if (quality >= 0.8) return "excellent";
    if (quality >= 0.6) return "good";
    if (quality >= 0.4) return "fair";
    return "poor";
  }

  private estimateMatchDuration(quality: MatchQuality): number {
    // Closer skill levels tend to result in longer games
    const baseMinutes = 45;
    const skillFactor = 1 - quality.skillDifference / 20; // Normalize skill difference
    return Math.round(baseMinutes + skillFactor * 15); // 45-60 minutes
  }

  // Tournament practice/qualification helpers could be implemented here in the future.

  private toResponseDto(rating: PlayerRating): PlayerRatingResponseDto {
    return {
      id: rating.id,
      userId: rating.userId,
      format: rating.format,
      skill: rating.skill,
      uncertainty: rating.uncertainty,
      conservativeRating: rating.conservativeRating,
      matchesPlayed: rating.matchesPlayed,
      winRate: rating.getWinRate(),
      trend: rating.getRatingTrend(),
      isStable: rating.isRatingStable(),
      percentileRank: rating.percentileRank,
      currentStreak: rating.currentStreak,
      streakType: rating.streakType,
      peakRating: rating.peakRating,
    };
  }

  private async recordMatchTelemetry(
    updateDto: UpdateRatingsDto,
    ratings: PlayerRating[]
  ): Promise<void> {
    try {
      await this.telemetryService.recordMatchResult({
        format: updateDto.format,
        playerCount: ratings.length,
        averageSkill:
          ratings.reduce((sum, r) => sum + r.skill, 0) / ratings.length,
        averageUncertainty:
          ratings.reduce((sum, r) => sum + r.uncertainty, 0) / ratings.length,
        ratingChanges: ratings.map((r) => ({
          userId: r.userId,
          skillChange: 0, // Would need before/after comparison
          uncertaintyChange: 0,
        })),
        timestamp: new Date(),
      });
    } catch (error) {
      console.warn("Failed to record match telemetry:", error);
    }
  }

  private async recordPairingTelemetry(
    response: GeneratePairingsResponseDto
  ): Promise<void> {
    try {
      await this.telemetryService.recordPairingGeneration({
        tournamentId: response.tournamentId,
        round: response.round,
        pairingCount: response.pairings.length,
        overallQuality: response.overallQuality,
        algorithm: response.algorithm,
        qualityDistribution: response.pairings.map((p) => p.quality.quality),
        timestamp: new Date(),
      });
    } catch (error) {
      console.warn("Failed to record pairing telemetry:", error);
    }
  }
}
