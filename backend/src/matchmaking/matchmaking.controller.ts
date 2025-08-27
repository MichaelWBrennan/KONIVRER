import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { MatchmakingService } from "./matchmaking.service";
import {
  UpdateRatingsDto,
  GeneratePairingsDto,
  PlayerRatingResponseDto,
  MatchQualityResponseDto,
  GeneratePairingsResponseDto,
  SimulateMatchDto,
  SimulationResultDto,
} from "./dto/matchmaking.dto";

@ApiTags("matchmaking")
@Controller("matchmaking")
// @UseGuards(JwtAuthGuard) // Uncomment when auth is set up
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Post("ratings/update")
  @ApiOperation({ summary: "Update player ratings based on match results" })
  @ApiResponse({
    status: 200,
    description: "Ratings updated successfully",
    type: [PlayerRatingResponseDto],
  })
  async updateRatings(
    @Body(ValidationPipe) updateDto: UpdateRatingsDto
  ): Promise<PlayerRatingResponseDto[]> {
    return this.matchmakingService.updateRatings(updateDto);
  }

  @Post("pairings/generate")
  @ApiOperation({
    summary: "Generate optimal pairings using Bayesian matchmaking",
  })
  @ApiResponse({
    status: 200,
    description: "Pairings generated successfully",
    type: GeneratePairingsResponseDto,
  })
  async generatePairings(
    @Body(ValidationPipe) generateDto: GeneratePairingsDto
  ): Promise<GeneratePairingsResponseDto> {
    return this.matchmakingService.generatePairings(generateDto);
  }

  @Get("ratings/:userId/:format")
  @ApiOperation({ summary: "Get player rating for specific format" })
  @ApiParam({ name: "userId", description: "Player user ID" })
  @ApiParam({
    name: "format",
    description: "Game format (e.g., Standard, Modern)",
  })
  @ApiResponse({
    status: 200,
    description: "Player rating retrieved",
    type: PlayerRatingResponseDto,
  })
  async getPlayerRating(
    @Param("userId") userId: string,
    @Param("format") format: string
  ): Promise<PlayerRatingResponseDto> {
    return this.matchmakingService.getPlayerRating(userId, format);
  }

  @Get("match-quality/:player1Id/:player2Id/:format")
  @ApiOperation({ summary: "Calculate match quality between two players" })
  @ApiParam({ name: "player1Id", description: "First player ID" })
  @ApiParam({ name: "player2Id", description: "Second player ID" })
  @ApiParam({ name: "format", description: "Game format" })
  @ApiResponse({
    status: 200,
    description: "Match quality calculated",
    type: MatchQualityResponseDto,
  })
  async calculateMatchQuality(
    @Param("player1Id") player1Id: string,
    @Param("player2Id") player2Id: string,
    @Param("format") format: string
  ): Promise<MatchQualityResponseDto> {
    return this.matchmakingService.calculateMatchQuality(
      player1Id,
      player2Id,
      format
    );
  }

  @Post("simulate")
  @ApiOperation({ summary: "Simulate match outcomes based on player ratings" })
  @ApiResponse({
    status: 200,
    description: "Match simulation completed",
    type: SimulationResultDto,
  })
  async simulateMatch(
    @Body(ValidationPipe) simulateDto: SimulateMatchDto
  ): Promise<SimulationResultDto> {
    return this.matchmakingService.simulateMatch(simulateDto);
  }

  @Get("leaderboard/:format")
  @ApiOperation({ summary: "Get leaderboard for specific format" })
  @ApiParam({ name: "format", description: "Game format" })
  @ApiQuery({
    name: "limit",
    description: "Number of players to return",
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: "Leaderboard retrieved",
    type: [PlayerRatingResponseDto],
  })
  async getLeaderboard(
    @Param("format") format: string,
    @Query("limit") limit: number = 50
  ): Promise<PlayerRatingResponseDto[]> {
    return this.matchmakingService.getLeaderboard(format, limit);
  }

  @Get("insights/telemetry")
  @ApiOperation({ summary: "Get matchmaking telemetry insights" })
  @ApiResponse({ status: 200, description: "Telemetry insights retrieved" })
  async getTelemetryInsights(): Promise<any> {
    // This would integrate with the telemetry service
    return {
      matchmaking: {
        averageMatchQuality: 0.75,
        totalPairingsGenerated: 1500,
        ratingStability: 0.85,
      },
      prediction: {
        simulationAccuracy: 0.82,
        predictionConfidence: 0.78,
      },
      performance: {
        averageRatingUpdateTime: 15,
        pairingGenerationTime: 45,
      },
    };
  }
}
