import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ProgressionService } from "./progression.service";
import {
  PointUpdateDto,
  TournamentProfileResponseDto,
  UpdateTournamentPreferencesDto,
} from "./dto/progression.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("tournament-progression")
@Controller("api/v1/progression")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Get(":userId/profile")
  @ApiOperation({ summary: "Get tournament profile for user" })
  @ApiResponse({ status: 200, type: TournamentProfileResponseDto })
  async getProfile(
    @Param("userId") userId: string
  ): Promise<TournamentProfileResponseDto> {
    return this.progressionService.getProfile(userId);
  }

  @Put(":userId/preferences")
  @ApiOperation({ summary: "Update tournament preferences for user" })
  @ApiResponse({ status: 200, type: TournamentProfileResponseDto })
  async updatePreferences(
    @Param("userId") userId: string,
    @Body(ValidationPipe) body: { preferences: Record<string, any> }
  ): Promise<TournamentProfileResponseDto> {
    return this.progressionService.updatePreferences({
      userId,
      preferences: body.preferences,
    });
  }

  @Post("points/update")
  @ApiOperation({ summary: "Apply point update for a user" })
  @ApiResponse({ status: 200, type: TournamentProfileResponseDto })
  async updatePoints(
    @Body(ValidationPipe) dto: PointUpdateDto
  ): Promise<TournamentProfileResponseDto> {
    return this.progressionService.applyPointUpdate(dto);
  }

  @Get(":userId/history")
  @ApiOperation({ summary: "Get point history for a user" })
  @ApiResponse({ status: 200, description: "History returned" })
  async getHistory(@Param("userId") userId: string) {
    return this.progressionService.getHistory(userId);
  }

  @Post(":userId/decay/run")
  @ApiOperation({ summary: "Run point decay for user (manual trigger)" })
  @ApiResponse({
    status: 200,
    description: "Decay executed; returns affected count",
  })
  async runDecay() {
    const affected = await this.progressionService.decayExpiredPoints();
    return { affected };
  }
}
