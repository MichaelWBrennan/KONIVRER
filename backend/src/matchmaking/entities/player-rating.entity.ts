import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { ObjectType, Field, ID, Float, Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";

@Entity("player_ratings")
@ObjectType()
@Index(["userId", "format"], { unique: true })
export class PlayerRating {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Rating entry ID" })
  id: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Player user ID" })
  userId: string;

  @Column({ type: "varchar", length: 50 })
  @Field()
  @ApiProperty({ description: "Game format (e.g., Standard, Modern, Limited)" })
  format: string;

  @Column({ type: "float", default: 25.0 })
  @Field(() => Float)
  @ApiProperty({ description: "Bayesian skill estimate (μ)" })
  skill: number;

  @Column({ type: "float", default: 8.333 })
  @Field(() => Float)
  @ApiProperty({ description: "Bayesian skill uncertainty (σ)" })
  uncertainty: number;

  @Column({ type: "float", default: 3.0 })
  @Field(() => Float)
  @ApiProperty({ description: "Confidence multiplier for conservative rating" })
  confidenceMultiplier: number;

  @Column({ type: "float" })
  @Field(() => Float)
  @ApiProperty({ description: "Conservative skill rating for matchmaking" })
  conservativeRating: number;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Total matches played in this format" })
  matchesPlayed: number;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Total wins in this format" })
  wins: number;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Total losses in this format" })
  losses: number;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Total draws in this format" })
  draws: number;

  @Column({ type: "float", nullable: true })
  @Field(() => Float, { nullable: true })
  @ApiProperty({
    description: "Peak conservative rating achieved",
    required: false,
  })
  peakRating?: number;

  @Column({ type: "timestamp", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Date when peak rating was achieved",
    required: false,
  })
  peakRatingDate?: Date;

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Recent rating history", required: false })
  ratingHistory?: {
    date: Date;
    skill: number;
    uncertainty: number;
    conservativeRating: number;
    matchOutcome: "win" | "loss" | "draw";
  }[];

  @Column({ type: "float", nullable: true })
  @Field(() => Float, { nullable: true })
  @ApiProperty({
    description: "Player percentile rank (0-100)",
    required: false,
  })
  percentileRank?: number;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Current win streak" })
  currentStreak: number;

  @Column({ type: "varchar", length: 10, default: "none" })
  @Field()
  @ApiProperty({ description: "Streak type: win, loss, or none" })
  streakType: "win" | "loss" | "none";

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Longest win streak achieved" })
  longestWinStreak: number;

  // Relations
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "userId" })
  @Field(() => User)
  @ApiProperty({ description: "Player user entity", type: () => User })
  user: User;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Rating creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Rating last updated timestamp" })
  updatedAt: Date;

  // Helper methods
  getWinRate(): number {
    const totalGames = this.wins + this.losses + this.draws;
    return totalGames > 0 ? (this.wins / totalGames) * 100 : 0;
  }

  getRatingTrend(): "rising" | "falling" | "stable" {
    if (!this.ratingHistory || this.ratingHistory.length < 5) {
      return "stable";
    }

    const recent = this.ratingHistory.slice(-5);
    const oldAvg =
      recent.slice(0, 2).reduce((sum, r) => sum + r.conservativeRating, 0) / 2;
    const newAvg =
      recent.slice(-2).reduce((sum, r) => sum + r.conservativeRating, 0) / 2;

    const threshold = 2.0; // Minimum rating change to consider trend
    if (newAvg > oldAvg + threshold) return "rising";
    if (newAvg < oldAvg - threshold) return "falling";
    return "stable";
  }

  isRatingStable(): boolean {
    // Rating is considered stable when uncertainty is low
    return this.uncertainty < 4.0 && this.matchesPlayed >= 10;
  }

  getExpectedPerformance(opponentRating: PlayerRating): number {
    // Calculate expected win probability against opponent
    const skillDiff = this.skill - opponentRating.skill;
    const totalUncertainty = Math.sqrt(
      this.uncertainty * this.uncertainty +
        opponentRating.uncertainty * opponentRating.uncertainty +
        2 * Math.pow(25.0 / 6.0, 2) // Beta squared
    );

    // Normal CDF approximation
    return 0.5 * (1 + this.erf(skillDiff / (totalUncertainty * Math.sqrt(2))));
  }

  private erf(x: number): number {
    // Error function approximation
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
