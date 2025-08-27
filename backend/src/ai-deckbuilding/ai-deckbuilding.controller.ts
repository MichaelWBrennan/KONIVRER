import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AiDeckbuildingService } from "./ai-deckbuilding.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@Controller("api/ai-deckbuilding")
@UseGuards(JwtAuthGuard)
export class AiDeckbuildingController {
  constructor(private readonly aiDeckbuildingService: AiDeckbuildingService) {}

  /**
   * Generate AI-driven deck suggestions for a player
   * POST /api/ai-deckbuilding/suggestions
   */
  @Post("suggestions")
  async generateDeckSuggestions(
    // @CurrentUser() user: User,
    @Body()
    body: {
      userId?: string;
      format: string;
      playstyle?: "aggressive" | "midrange" | "control" | "combo";
      targetWinRate?: number;
    }
  ) {
    return this.aiDeckbuildingService.generateDeckSuggestions(
      body.userId || "default-user",
      body.format,
      body
    );
  }

  /**
   * Get comprehensive meta analysis with personalized recommendations
   * GET /api/ai-deckbuilding/meta-analysis/{format}
   */
  @Get("meta-analysis/:format")
  async getMetaAnalysis(
    // @CurrentUser() user: User,
    @Param("format") format: string,
    @Query("userId") userId?: string
  ) {
    return this.aiDeckbuildingService.generateMetaAnalysis(
      userId || "default-user",
      format
    );
  }

  /**
   * Optimize an existing deck based on AI analysis
   * POST /api/ai-deckbuilding/optimize
   */
  @Post("optimize")
  async optimizeDeck(
    @CurrentUser() user: User,
    @Body()
    body: {
      format: string;
      currentDeckList: string[];
      targetWinRate?: number;
      playstyle?: "aggressive" | "midrange" | "control" | "combo";
    }
  ) {
    return this.aiDeckbuildingService.optimizeDeck({
      userId: user.id,
      format: body.format,
      currentDeckList: body.currentDeckList,
      targetWinRate: body.targetWinRate,
      playstyle: body.playstyle,
    });
  }

  /**
   * Get skill-tier based archetype recommendations
   * GET /api/ai-deckbuilding/recommendations/{format}
   */
  @Get("recommendations/:format")
  async getSkillBasedRecommendations(
    @CurrentUser() user: User,
    @Param("format") format: string,
    @Query("playstyle") playstyle?: string
  ) {
    const suggestions =
      await this.aiDeckbuildingService.generateDeckSuggestions(
        user.id,
        format,
        { playstyle: playstyle as any }
      );

    return {
      format,
      userId: user.id,
      recommendations: suggestions,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get format meta snapshot with trending cards
   * GET /api/ai-deckbuilding/meta-snapshot/{format}
   */
  @Get("meta-snapshot/:format")
  async getFormatMetaSnapshot(@Param("format") format: string) {
    const analysis = await this.aiDeckbuildingService.generateMetaAnalysis(
      "system", // Use system user for public meta data
      format
    );

    return {
      format,
      dominantArchetypes: analysis.dominantArchetypes,
      emergingCards: analysis.emergingCards,
      lastUpdated: new Date().toISOString(),
    };
  }
}
