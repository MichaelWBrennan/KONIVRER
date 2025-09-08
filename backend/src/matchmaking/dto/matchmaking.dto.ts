import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsUUID,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";

export class MatchOutcomeDto {
  @ApiProperty({ description: "Player ID" })
  @IsUUID()
  playerId: string;

  @ApiProperty({
    description:
      "Player rank in match (1 = winner, 2 = loser, ties have same rank)",
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  rank: number;

  @ApiProperty({ description: "Optional performance metric", required: false })
  @IsOptional()
  @IsNumber()
  performance?: number;
}

export class UpdateRatingsDto {
  @ApiProperty({ description: "Game format" })
  @IsString()
  format: string;

  @ApiProperty({ description: "Match outcomes", type: [MatchOutcomeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchOutcomeDto)
  outcomes: MatchOutcomeDto[];

  @ApiProperty({
    description: "Tournament ID if match is part of tournament",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  tournamentId?: string;

  @ApiProperty({ description: "Match ID for reference", required: false })
  @IsOptional()
  @IsUUID()
  matchId?: string;
}

export class GeneratePairingsDto {
  @ApiProperty({ description: "Player IDs to pair up" })
  @IsArray()
  @IsUUID(4, { each: true })
  playerIds: string[];

  @ApiProperty({ description: "Game format" })
  @IsString()
  format: string;

  @ApiProperty({ description: "Previous pairings to avoid", required: false })
  @IsOptional()
  @IsArray()
  previousPairings?: string[][];

  @ApiProperty({
    description: "Tournament ID if pairings are for tournament",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  tournamentId?: string;

  @ApiProperty({ description: "Round number", required: false, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  round?: number;
}

export class PlayerRatingResponseDto {
  @ApiProperty({ description: "Rating ID" })
  id: string;

  @ApiProperty({ description: "Player ID" })
  userId: string;

  @ApiProperty({ description: "Game format" })
  format: string;

  @ApiProperty({ description: "Bayesian skill estimate" })
  skill: number;

  @ApiProperty({ description: "Bayesian skill uncertainty" })
  uncertainty: number;

  @ApiProperty({ description: "Conservative rating for matchmaking" })
  conservativeRating: number;

  @ApiProperty({ description: "Total matches played" })
  matchesPlayed: number;

  @ApiProperty({ description: "Win rate percentage" })
  winRate: number;

  @ApiProperty({ description: "Rating trend" })
  trend: "rising" | "falling" | "stable";

  @ApiProperty({ description: "Whether rating is stable" })
  isStable: boolean;

  @ApiProperty({ description: "Player percentile rank", required: false })
  percentileRank?: number;

  @ApiProperty({ description: "Current streak count" })
  currentStreak: number;

  @ApiProperty({ description: "Streak type" })
  streakType: "win" | "loss" | "none";

  @ApiProperty({ description: "Peak rating achieved", required: false })
  peakRating?: number;
}

export class MatchQualityResponseDto {
  @ApiProperty({ description: "Match quality score (0-1)" })
  quality: number;

  @ApiProperty({ description: "Win probabilities for each player" })
  winProbabilities: number[];

  @ApiProperty({ description: "Expected skill difference" })
  skillDifference: number;

  @ApiProperty({ description: "Uncertainty factor" })
  uncertaintyFactor: number;

  @ApiProperty({ description: "Match balance category" })
  balanceCategory: "excellent" | "good" | "fair" | "poor";
}

export class PairingResponseDto {
  @ApiProperty({ description: "Paired player IDs" })
  players: string[];

  @ApiProperty({ description: "Match quality metrics" })
  quality: MatchQualityResponseDto;

  @ApiProperty({
    description: "Expected match duration in minutes",
    required: false,
  })
  expectedDuration?: number;

  @ApiProperty({
    description: "Recommended pairing priority",
    minimum: 1,
    maximum: 10,
  })
  priority: number;
}

export class GeneratePairingsResponseDto {
  @ApiProperty({
    description: "Generated pairings",
    type: [PairingResponseDto],
  })
  pairings: PairingResponseDto[];

  @ApiProperty({ description: "Overall pairing quality score (0-1)" })
  overallQuality: number;

  @ApiProperty({ description: "Number of players with byes" })
  byes: number;

  @ApiProperty({ description: "Tournament ID if applicable", required: false })
  tournamentId?: string;

  @ApiProperty({ description: "Round number if applicable", required: false })
  round?: number;

  @ApiProperty({ description: "Pairing algorithm used" })
  algorithm: string;

  @ApiProperty({ description: "Generation timestamp" })
  generatedAt: Date;
}

export class SimulateMatchDto {
  @ApiProperty({ description: "Player 1 ID" })
  @IsUUID()
  player1Id: string;

  @ApiProperty({ description: "Player 2 ID" })
  @IsUUID()
  player2Id: string;

  @ApiProperty({ description: "Game format" })
  @IsString()
  format: string;

  @ApiProperty({
    description: "Number of games to simulate",
    minimum: 1,
    maximum: 1000,
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
  numberOfGames: number;

  @ApiProperty({
    description: "Include detailed simulation logs",
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  includeDetailedLogs?: boolean;
}

export class SimulationResultDto {
  @ApiProperty({ description: "Player 1 win percentage" })
  player1WinRate: number;

  @ApiProperty({ description: "Player 2 win percentage" })
  player2WinRate: number;

  @ApiProperty({ description: "Draw percentage" })
  drawRate: number;

  @ApiProperty({ description: "Number of simulated games" })
  totalGames: number;

  @ApiProperty({ description: "Average game duration in turns" })
  averageGameLength: number;

  @ApiProperty({
    description: "Confidence interval for win rate",
    required: false,
  })
  confidenceInterval?: {
    lower: number;
    upper: number;
    confidence: number;
  };

  @ApiProperty({ description: "Detailed simulation logs", required: false })
  detailedLogs?: any[];
}
