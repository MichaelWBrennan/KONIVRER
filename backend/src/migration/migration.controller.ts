import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MigrationService } from "./migration.service";

@ApiTags("migration")
@Controller("migration")
export class MigrationController {
  constructor(private migrationService: MigrationService) {}

  @Post("seed-konivrer-cards")
  @ApiOperation({ summary: "Seed database with KONIVRER cards from assets" })
  @ApiResponse({ status: 201, description: "Cards seeded successfully" })
  async seedKonivrrerCards() {
    const cards = this.migrationService.generateKonivrrerCards();
    // This would normally import through the cardsService, but for now just return the data
    return {
      message: "Generated KONIVRER cards data",
      count: cards.length,
      cards: cards.slice(0, 5), // Show first 5 as sample
    };
  }
}
