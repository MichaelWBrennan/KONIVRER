import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { PhysicalGameSimulationService } from "./physical-simulation.service";
import { JudgeToolkitService } from "./judge-toolkit.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@Controller("api/physical-simulation")
@UseGuards(JwtAuthGuard)
export class PhysicalSimulationController {
  constructor(
    private readonly simulationService: PhysicalGameSimulationService,
    private readonly judgeToolkitService: JudgeToolkitService
  ) {}

  /**
   * Run precise physical game simulation
   * POST /api/physical-simulation/simulate
   */
  @Post("simulate")
  async simulatePhysicalGame(
    // @CurrentUser() user: User,
    @Body()
    body: {
      userId?: string;
      deck1: string;
      deck2: string;
      iterations?: number;
      scenarioId?: string;
    }
  ) {
    return this.simulationService.simulatePhysicalGame(
      body.deck1,
      body.deck2,
      body.iterations || 1000
    );
  }

  /**
   * Create custom game scenario for testing
   * POST /api/physical-simulation/scenario
   */
  @Post("scenario")
  async createScenario(
    @CurrentUser() user: User,
    @Body()
    scenarioData: {
      name: string;
      description: string;
      player1Deck: string;
      player2Deck: string;
      customGameState?: any;
      expectedOutcomes: string[];
    }
  ) {
    return this.simulationService.createScenario(scenarioData);
  }

  /**
   * Run batch deck testing with millions of iterations
   * POST /api/physical-simulation/batch-test
   */
  @Post("batch-test")
  async runBatchTesting(
    @CurrentUser() user: User,
    @Body()
    body: {
      testDecks: string[];
      metaDecks: string[];
      iterations?: number;
    }
  ) {
    return this.simulationService.runBatchDeckTesting(
      body.testDecks,
      body.metaDecks,
      body.iterations || 1000000
    );
  }

  /**
   * Quick rule lookup for judges
   * POST /api/physical-simulation/rules/search
   */
  @Post("rules/search")
  async searchRules(
    @Body()
    query: {
      keywords: string[];
      scenario?: string;
      cardNames?: string[];
    }
  ) {
    return this.judgeToolkitService.searchRules(query);
  }

  /**
   * Interactive scenario simulation for judge training
   * GET /api/physical-simulation/judge/scenario/{scenarioId}
   */
  @Get("judge/scenario/:scenarioId")
  async simulateJudgeScenario(@Param("scenarioId") scenarioId: string) {
    return this.judgeToolkitService.simulateScenario(scenarioId);
  }

  /**
   * Calculate tournament penalties
   * POST /api/physical-simulation/judge/penalty
   */
  @Post("judge/penalty")
  async calculatePenalty(
    @Body()
    body: {
      infraction: string;
      context: {
        playerHistory?: string[];
        tournamentLevel?: "regular" | "competitive" | "professional";
        intent?: "accidental" | "negligent" | "intentional";
        impact?: "none" | "minor" | "significant" | "severe";
      };
    }
  ) {
    return this.judgeToolkitService.calculatePenalty(
      body.infraction,
      body.context
    );
  }

  /**
   * Resolve rules conflicts using formal logic
   * POST /api/physical-simulation/judge/resolve-conflict
   */
  @Post("judge/resolve-conflict")
  async resolveRulesConflict(
    @Body() body: { conflictDescription: string; involvedRules: string[] }
  ) {
    return this.judgeToolkitService.resolveRulesConflict(
      body.conflictDescription,
      body.involvedRules
    );
  }

  /**
   * Create custom judge training scenario
   * POST /api/physical-simulation/judge/create-scenario
   */
  @Post("judge/create-scenario")
  async createJudgeScenario(
    @CurrentUser() user: User,
    @Body()
    body: {
      title: string;
      gameState: any;
      question: string;
      tags?: string[];
    }
  ) {
    return this.judgeToolkitService.createCustomScenario(
      body.title,
      body.gameState,
      body.question,
      body.tags
    );
  }

  /**
   * Generate step-by-step walkthrough for scenarios
   * GET /api/physical-simulation/judge/walkthrough/{scenarioId}
   */
  @Get("judge/walkthrough/:scenarioId")
  async generateWalkthrough(@Param("scenarioId") scenarioId: string) {
    return this.judgeToolkitService.generateWalkthrough(scenarioId);
  }

  /**
   * Get deck testing analytics
   * GET /api/physical-simulation/analytics/{deckId}
   */
  @Get("analytics/:deckId")
  async getDeckAnalytics(
    @Param("deckId") deckId: string,
    @Query("format") format?: string,
    @Query("iterations") iterations?: number
  ) {
    // Run quick analytics simulation
    const testResult = await this.simulationService.simulatePhysicalGame(
      deckId,
      "meta_baseline_deck", // Would need a baseline meta deck
      parseInt(iterations as any) || 10000
    );

    return {
      deckId,
      format: format || "Standard",
      winRate: testResult.statistics.winRates.player1,
      averageGameLength: testResult.averageGameLength,
      cardPerformance: testResult.statistics.cardUsageStats,
      recommendations: this.generateDeckRecommendations(testResult),
      generatedAt: new Date().toISOString(),
    };
  }

  private generateDeckRecommendations(testResult: any): string[] {
    const recommendations = [];

    if (testResult.statistics.winRates.player1 < 45) {
      recommendations.push("Consider adding more efficient removal spells");
      recommendations.push("Review mana curve for consistency");
    }

    if (testResult.averageGameLength > 15) {
      recommendations.push("Add more aggressive threats to close games faster");
    }

    if (testResult.averageGameLength < 6) {
      recommendations.push("Consider adding card draw to maintain resources");
    }

    return recommendations;
  }
}
