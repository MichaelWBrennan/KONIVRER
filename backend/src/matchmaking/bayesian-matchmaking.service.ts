/**
 * Bayesian Rating System (TrueSkill Implementation)
 *
 * This implements a Bayesian skill rating system based on the TrueSkill algorithm
 * for dynamic player skill assessment and matchmaking quality optimization.
 */

export interface BayesianRating {
  /** Skill estimate (μ - mu) */
  skill: number;
  /** Uncertainty (σ - sigma) */
  uncertainty: number;
  /** Confidence interval multiplier */
  confidenceMultiplier: number;
  /** Conservative skill estimate for matchmaking */
  conservativeRating: number;
  /** Total matches played */
  matchesPlayed: number;
  /** Last updated timestamp */
  lastUpdated: Date;
}

export interface MatchOutcome {
  playerId: string;
  rank: number; // 1 = winner, 2 = loser, ties have same rank
  performance?: number; // Optional performance metric
}

export interface MatchQuality {
  /** Match quality score (0-1, higher is better) */
  quality: number;
  /** Predicted win probabilities for each player */
  winProbabilities: number[];
  /** Expected skill difference */
  skillDifference: number;
  /** Uncertainty factor */
  uncertaintyFactor: number;
}

export class BayesianMatchmakingService {
  // TrueSkill default parameters
  private readonly DEFAULT_SKILL = 25.0;
  private readonly DEFAULT_UNCERTAINTY = 25.0 / 3.0;
  private readonly BETA = 25.0 / 6.0; // Performance variance
  private readonly TAU = 25.0 / 300.0; // Dynamics factor
  private readonly DRAW_PROBABILITY = 0.1; // 10% chance of draw

  constructor(
    private readonly defaultSkill: number = 25.0,
    private readonly defaultUncertainty: number = 25.0 / 3.0,
    private readonly beta: number = 25.0 / 6.0,
    private readonly tau: number = 25.0 / 300.0,
    private readonly drawProbability: number = 0.1
  ) {}

  /**
   * Create initial Bayesian rating for new player
   */
  createInitialRating(): BayesianRating {
    const uncertainty = this.defaultUncertainty;
    const skill = this.defaultSkill;

    return {
      skill,
      uncertainty,
      confidenceMultiplier: 3.0,
      conservativeRating: skill - 3.0 * uncertainty,
      matchesPlayed: 0,
      lastUpdated: new Date(),
    };
  }

  /**
   * Calculate match quality between players
   */
  calculateMatchQuality(ratings: BayesianRating[]): MatchQuality {
    if (ratings.length !== 2) {
      throw new Error(
        "Match quality calculation currently supports only 2 players"
      );
    }

    const [rating1, rating2] = ratings;

    // Calculate skill difference
    const skillDiff = Math.abs(rating1.skill - rating2.skill);

    // Calculate total uncertainty
    const totalUncertainty = Math.sqrt(
      rating1.uncertainty * rating1.uncertainty +
        rating2.uncertainty * rating2.uncertainty +
        2 * this.beta * this.beta
    );

    // Match quality based on skill difference and uncertainty
    const quality = Math.exp(
      -(skillDiff * skillDiff) / (2 * totalUncertainty * totalUncertainty)
    );

    // Calculate win probabilities using normal CDF approximation
    const winProb1 = this.normalCDF(
      (rating1.skill - rating2.skill) / totalUncertainty
    );
    const winProb2 = 1 - winProb1;

    return {
      quality,
      winProbabilities: [winProb1, winProb2],
      skillDifference: skillDiff,
      uncertaintyFactor: totalUncertainty,
    };
  }

  /**
   * Update ratings based on match outcome
   */
  updateRatings(
    ratings: BayesianRating[],
    outcomes: MatchOutcome[]
  ): BayesianRating[] {
    if (ratings.length !== outcomes.length) {
      throw new Error("Ratings and outcomes arrays must have same length");
    }

    // For 2-player matches, use simplified TrueSkill update
    if (ratings.length === 2) {
      return this.updateTwoPlayerRatings(ratings, outcomes);
    }

    // For multiplayer, would need full TrueSkill factor graph
    throw new Error("Multiplayer rating updates not yet implemented");
  }

  /**
   * Find optimal pairings for Swiss tournament
   */
  generateSwissPairings(
    playerRatings: Map<string, BayesianRating>,
    previousPairings: string[][] = []
  ): { pairings: string[][]; qualities: MatchQuality[] } {
    const playerIds = Array.from(playerRatings.keys());
    const n = playerIds.length;

    if (n % 2 !== 0) {
      throw new Error("Odd number of players not supported yet");
    }

    // Sort players by conservative rating for initial ordering
    playerIds.sort((a, b) => {
      const ratingA = playerRatings.get(a)!.conservativeRating;
      const ratingB = playerRatings.get(b)!.conservativeRating;
      return ratingB - ratingA; // Descending order
    });

    // Simple greedy pairing for now - can be enhanced with optimization
    const pairings: string[][] = [];
    const qualities: MatchQuality[] = [];
    const used = new Set<string>();

    for (let i = 0; i < playerIds.length; i++) {
      if (used.has(playerIds[i])) continue;

      let bestOpponent = "";
      let bestQuality = -1;

      for (let j = i + 1; j < playerIds.length; j++) {
        if (used.has(playerIds[j])) continue;

        // Check if this pairing was used before
        const hasPlayedBefore = previousPairings.some(
          (pairing) =>
            (pairing[0] === playerIds[i] && pairing[1] === playerIds[j]) ||
            (pairing[0] === playerIds[j] && pairing[1] === playerIds[i])
        );

        if (hasPlayedBefore) continue;

        const quality = this.calculateMatchQuality([
          playerRatings.get(playerIds[i])!,
          playerRatings.get(playerIds[j])!,
        ]);

        if (quality.quality > bestQuality) {
          bestQuality = quality.quality;
          bestOpponent = playerIds[j];
        }
      }

      if (bestOpponent) {
        used.add(playerIds[i]);
        used.add(bestOpponent);

        const pairing = [playerIds[i], bestOpponent];
        pairings.push(pairing);

        qualities.push(
          this.calculateMatchQuality([
            playerRatings.get(playerIds[i])!,
            playerRatings.get(bestOpponent)!,
          ])
        );
      }
    }

    return { pairings, qualities };
  }

  /**
   * Get player strength percentile
   */
  getPlayerPercentile(
    rating: BayesianRating,
    allRatings: BayesianRating[]
  ): number {
    const playerRating = rating.conservativeRating;
    const belowCount = allRatings.filter(
      (r) => r.conservativeRating < playerRating
    ).length;
    return (belowCount / allRatings.length) * 100;
  }

  // Private helper methods
  private updateTwoPlayerRatings(
    ratings: BayesianRating[],
    outcomes: MatchOutcome[]
  ): BayesianRating[] {
    const [rating1, rating2] = ratings;
    const [outcome1, outcome2] = outcomes;

    // Determine winner (rank 1 = winner, rank 2 = loser)
    const player1Won = outcome1.rank < outcome2.rank;
    const isDraw = outcome1.rank === outcome2.rank;

    // Calculate performance difference
    const skillDiff = rating1.skill - rating2.skill;
    const c = Math.sqrt(
      rating1.uncertainty * rating1.uncertainty +
        rating2.uncertainty * rating2.uncertainty +
        2 * this.beta * this.beta
    );

    let v: number, w: number;

    if (isDraw) {
      // Draw case
      v = this.vDraw(skillDiff / c, this.drawProbability);
      w = this.wDraw(skillDiff / c, this.drawProbability);
    } else {
      // Win/loss case
      const t = player1Won ? skillDiff / c : -skillDiff / c;
      v = this.vWin(t);
      w = this.wWin(t);
    }

    // Update player 1
    const newUncertainty1 = Math.sqrt(
      rating1.uncertainty *
        rating1.uncertainty *
        Math.max(
          1 - (w * rating1.uncertainty * rating1.uncertainty) / (c * c),
          0.0001
        )
    );

    const skillUpdate1 = ((rating1.uncertainty * rating1.uncertainty) / c) * v;
    const newSkill1 =
      rating1.skill + (player1Won || isDraw ? skillUpdate1 : -skillUpdate1);

    // Add dynamics uncertainty
    const finalUncertainty1 = Math.sqrt(
      newUncertainty1 * newUncertainty1 + this.tau * this.tau
    );

    // Update player 2
    const newUncertainty2 = Math.sqrt(
      rating2.uncertainty *
        rating2.uncertainty *
        Math.max(
          1 - (w * rating2.uncertainty * rating2.uncertainty) / (c * c),
          0.0001
        )
    );

    const skillUpdate2 = ((rating2.uncertainty * rating2.uncertainty) / c) * v;
    const newSkill2 =
      rating2.skill + (!player1Won || isDraw ? skillUpdate2 : -skillUpdate2);

    const finalUncertainty2 = Math.sqrt(
      newUncertainty2 * newUncertainty2 + this.tau * this.tau
    );

    return [
      {
        ...rating1,
        skill: newSkill1,
        uncertainty: finalUncertainty1,
        conservativeRating: newSkill1 - 3.0 * finalUncertainty1,
        matchesPlayed: rating1.matchesPlayed + 1,
        lastUpdated: new Date(),
      },
      {
        ...rating2,
        skill: newSkill2,
        uncertainty: finalUncertainty2,
        conservativeRating: newSkill2 - 3.0 * finalUncertainty2,
        matchesPlayed: rating2.matchesPlayed + 1,
        lastUpdated: new Date(),
      },
    ];
  }

  // TrueSkill mathematical functions
  private normalCDF(x: number): number {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  private normalPDF(x: number): number {
    return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
  }

  private vWin(t: number): number {
    const nt = this.normalPDF(t);
    const ct = this.normalCDF(t);
    return nt / (1 - ct);
  }

  private wWin(t: number): number {
    const nt = this.normalPDF(t);
    const ct = this.normalCDF(t);
    const v = nt / (1 - ct);
    return v * (v + t);
  }

  private vDraw(t: number, drawMargin: number): number {
    const abs_t = Math.abs(t);
    const a = drawMargin - abs_t;
    const b = -drawMargin - abs_t;
    const denom = this.normalCDF(a) - this.normalCDF(b);
    const numer = this.normalPDF(b) - this.normalPDF(a);
    return (t < 0 ? -numer : numer) / denom;
  }

  private wDraw(t: number, drawMargin: number): number {
    const abs_t = Math.abs(t);
    const a = drawMargin - abs_t;
    const b = -drawMargin - abs_t;
    const denom = this.normalCDF(a) - this.normalCDF(b);

    return (
      (a * this.normalPDF(a) - b * this.normalPDF(b)) / denom -
      Math.pow((this.normalPDF(a) - this.normalPDF(b)) / denom, 2)
    );
  }

  // Error function approximation
  private erf(x: number): number {
    // Abramowitz and Stegun approximation
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
