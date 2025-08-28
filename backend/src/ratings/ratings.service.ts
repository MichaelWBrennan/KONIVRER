import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PlayerRating } from "./entities/rating.entity";
import { RatingHistory } from "./entities/rating-history.entity";
import { UpdateRatingsDto, RatingResponseDto } from "./dto/ratings.dto";
import { BayesianMatchmakingService } from "../matchmaking/bayesian-matchmaking.service";

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(PlayerRating)
    private ratingsRepository: Repository<PlayerRating>,
    @InjectRepository(RatingHistory)
    private historyRepository: Repository<RatingHistory>,
    private bayesianService: BayesianMatchmakingService,
    private eventEmitter: EventEmitter2
  ) {}

  async getPlayerRating(userId: string): Promise<RatingResponseDto> {
    // Get current rating (assuming 'Standard' format for now)
    let rating = await this.ratingsRepository.findOne({
      where: { userId, format: "Standard" },
    });

    if (!rating) {
      // Create default rating if none exists
      rating = this.ratingsRepository.create({
        userId,
        format: "Standard",
        mu: 25.0,
        sigma: 8.333,
        conservativeRating: 25.0 - 3 * 8.333,
        matchesPlayed: 0,
      });
      rating = await this.ratingsRepository.save(rating);
    }

    // Get rating history
    const history = await this.historyRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: 20,
    });

    return {
      userId,
      rating: {
        mu: rating.mu,
        sigma: rating.sigma,
      },
      history: history.map((h) => ({
        matchId: h.matchId,
        prior: h.prior,
        posterior: h.posterior,
        delta: h.delta,
        timestamp: h.createdAt.toISOString(),
      })),
    };
  }

  async updateRatings(updateDto: UpdateRatingsDto): Promise<any> {
    const updatedRatings = [];

    for (const result of updateDto.results) {
      // Get current rating
      let rating = await this.ratingsRepository.findOne({
        where: { userId: result.userId, format: "Standard" },
      });

      if (!rating) {
        rating = this.ratingsRepository.create({
          userId: result.userId,
          format: "Standard",
          mu: 25.0,
          sigma: 8.333,
          conservativeRating: 25.0 - 3 * 8.333,
          matchesPlayed: 0,
        });
        rating = await this.ratingsRepository.save(rating);
      }

      // Store prior rating
      const prior = { mu: rating.mu, sigma: rating.sigma };

      // Simulate Bayesian update (simplified TrueSkill-like update)
      const K = 32 / (1 + rating.matchesPlayed * 0.1); // Decreasing update factor
      const expectedScore = 0.5; // Simplified - in real TrueSkill this would be calculated
      const delta = K * (result.score - expectedScore);

      const newMu = rating.mu + delta;
      const newSigma = Math.max(0.5, rating.sigma * 0.99); // Slightly reduce uncertainty

      // Update rating
      await this.ratingsRepository.update(rating.id, {
        mu: newMu,
        sigma: newSigma,
        conservativeRating: newMu - 3 * newSigma,
        matchesPlayed: rating.matchesPlayed + 1,
      });

      // Record history
      await this.historyRepository.save({
        userId: result.userId,
        matchId: updateDto.matchId,
        prior,
        posterior: { mu: newMu, sigma: newSigma },
        delta,
      });

      updatedRatings.push({
        userId: result.userId,
        prior,
        posterior: { mu: newMu, sigma: newSigma },
        delta,
      });

      // Emit rating update event
      this.eventEmitter.emit("rating.updated", {
        userId: result.userId,
        prior,
        posterior: { mu: newMu, sigma: newSigma },
        delta,
        matchId: updateDto.matchId,
      });
    }

    return updatedRatings;
  }
}
