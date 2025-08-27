import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { DecksService } from "./decks.service";
import {
  CreateDeckDto,
  UpdateDeckDto,
  DeckSearchFilters,
  ImportDeckDto,
  CloneDeckDto,
  DeckAnalyticsDto,
} from "./dto/deck.dto";
import { Deck, DeckFormat, DeckArchetype } from "./entities/deck.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("Decks")
@Controller("api/decks")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new deck" })
  @ApiResponse({
    status: 201,
    description: "Deck created successfully",
    type: Deck,
  })
  @ApiResponse({ status: 400, description: "Invalid deck data" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async create(@Body() createDeckDto: CreateDeckDto, @Request() req) {
    return this.decksService.create(createDeckDto, req.user.id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all decks with filtering and pagination" })
  @ApiResponse({ status: 200, description: "Decks retrieved successfully" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 20)",
  })
  @ApiQuery({
    name: "format",
    required: false,
    enum: DeckFormat,
    description: "Filter by format",
  })
  @ApiQuery({
    name: "archetype",
    required: false,
    enum: DeckArchetype,
    description: "Filter by archetype",
  })
  @ApiQuery({
    name: "colors",
    required: false,
    type: [String],
    description: "Filter by colors",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search in name and description",
  })
  @ApiQuery({
    name: "sortBy",
    required: false,
    type: String,
    description: "Sort field",
  })
  @ApiQuery({
    name: "sortOrder",
    required: false,
    enum: ["ASC", "DESC"],
    description: "Sort order",
  })
  async findAll(@Query() filters: DeckSearchFilters, @Request() req) {
    const userId = req.user?.id;
    return this.decksService.findAll(filters, userId);
  }

  @Get("top")
  @Public()
  @ApiOperation({ summary: "Get top-performing decks" })
  @ApiResponse({ status: 200, description: "Top decks retrieved successfully" })
  @ApiQuery({
    name: "format",
    required: false,
    enum: DeckFormat,
    description: "Filter by format",
  })
  @ApiQuery({
    name: "archetype",
    required: false,
    enum: DeckArchetype,
    description: "Filter by archetype",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of decks to return",
  })
  async getTopDecks(
    @Query("format") format?: DeckFormat,
    @Query("archetype") archetype?: DeckArchetype,
    @Query("limit") limit?: number
  ) {
    return this.decksService.getTopDecks(format, archetype, limit);
  }

  @Get("meta/:format")
  @Public()
  @ApiOperation({ summary: "Get meta snapshot for a format" })
  @ApiResponse({
    status: 200,
    description: "Meta snapshot retrieved successfully",
  })
  async getMetaSnapshot(@Param("format") format: DeckFormat) {
    return this.decksService.getMetaSnapshot(format);
  }

  @Get("my-decks")
  @ApiOperation({ summary: "Get current user's decks" })
  @ApiResponse({
    status: 200,
    description: "User decks retrieved successfully",
  })
  async getMyDecks(@Query() filters: DeckSearchFilters, @Request() req) {
    const userFilters = { ...filters, includePrivate: true };
    return this.decksService.findAll(userFilters, req.user.id);
  }

  @Post("import")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Import deck from various formats" })
  @ApiResponse({
    status: 201,
    description: "Deck imported successfully",
    type: Deck,
  })
  @ApiResponse({ status: 400, description: "Invalid import format or data" })
  async importDeck(@Body() importDto: ImportDeckDto, @Request() req) {
    return this.decksService.importDeck(importDto, req.user.id);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get deck by ID" })
  @ApiResponse({
    status: 200,
    description: "Deck retrieved successfully",
    type: Deck,
  })
  @ApiResponse({ status: 404, description: "Deck not found" })
  @ApiResponse({ status: 403, description: "Access denied (private deck)" })
  async findOne(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user?.id;
    return this.decksService.findOne(id, userId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deck" })
  @ApiResponse({
    status: 200,
    description: "Deck updated successfully",
    type: Deck,
  })
  @ApiResponse({ status: 404, description: "Deck not found" })
  @ApiResponse({ status: 403, description: "Access denied" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDeckDto: UpdateDeckDto,
    @Request() req
  ) {
    return this.decksService.update(id, updateDeckDto, req.user.id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete deck" })
  @ApiResponse({ status: 204, description: "Deck deleted successfully" })
  @ApiResponse({ status: 404, description: "Deck not found" })
  @ApiResponse({ status: 403, description: "Access denied" })
  async remove(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    await this.decksService.remove(id, req.user.id);
  }

  @Post(":id/clone")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Clone/copy a deck" })
  @ApiResponse({
    status: 201,
    description: "Deck cloned successfully",
    type: Deck,
  })
  @ApiResponse({ status: 404, description: "Deck not found" })
  @ApiResponse({ status: 403, description: "Cannot clone private deck" })
  async cloneDeck(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() cloneDto: CloneDeckDto,
    @Request() req
  ) {
    return this.decksService.clone(id, req.user.id, cloneDto.name);
  }

  @Post(":id/assign")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Assign deck to user account" })
  @ApiResponse({ status: 200, description: "Deck assigned successfully" })
  @ApiResponse({ status: 404, description: "Deck not found" })
  async assignDeck(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: { userId?: string },
    @Request() req
  ) {
    const userId = body.userId || req.user.id;
    return this.decksService.assignToUser(id, userId);
  }

  @Post(":id/like")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Like/unlike a deck" })
  @ApiResponse({ status: 200, description: "Like status updated" })
  @ApiResponse({ status: 404, description: "Deck not found" })
  async likeDeck(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    return this.decksService.like(id, req.user.id);
  }

  @Get(":id/analytics")
  @Public()
  @ApiOperation({ summary: "Get detailed deck analytics" })
  @ApiResponse({
    status: 200,
    description: "Deck analytics retrieved successfully",
    type: DeckAnalyticsDto,
  })
  @ApiResponse({ status: 404, description: "Deck not found" })
  @ApiResponse({ status: 403, description: "Access denied (private deck)" })
  async getDeckAnalytics(
    @Param("id", ParseUUIDPipe) id: string,
    @Request() req
  ) {
    const userId = req.user?.id;
    return this.decksService.getAnalytics(id, userId);
  }

  @Get(":id/export")
  @Public()
  @ApiOperation({ summary: "Export deck in various formats" })
  @ApiResponse({ status: 200, description: "Deck exported successfully" })
  @ApiQuery({
    name: "format",
    required: false,
    enum: ["mtgo", "arena", "text", "json"],
    description: "Export format",
  })
  async exportDeck(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("format") format: string = "text",
    @Request() req
  ) {
    const userId = req.user?.id;
    const deck = await this.decksService.findOne(id, userId);

    // TODO: Implement export format conversion
    return {
      deckId: deck.id,
      name: deck.name,
      format: deck.format,
      exportFormat: format,
      data: "Export functionality coming soon",
    };
  }

  @Get(":id/similar")
  @Public()
  @ApiOperation({ summary: "Find similar decks" })
  @ApiResponse({ status: 200, description: "Similar decks found" })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of similar decks to return",
  })
  async getSimilarDecks(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("limit") limit: number = 10,
    @Request() req
  ) {
    const userId = req.user?.id;
    // TODO: Implement similarity search
    return {
      deckId: id,
      similarDecks: [],
      message: "Similar deck search coming soon",
    };
  }

  @Get(":id/matchups")
  @Public()
  @ApiOperation({ summary: "Get deck matchup data" })
  @ApiResponse({
    status: 200,
    description: "Matchup data retrieved successfully",
  })
  async getMatchups(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user?.id;
    // TODO: Implement matchup analysis
    return {
      deckId: id,
      matchups: [],
      message: "Matchup analysis coming soon",
    };
  }

  @Get(":id/price-history")
  @Public()
  @ApiOperation({ summary: "Get deck price history" })
  @ApiResponse({
    status: 200,
    description: "Price history retrieved successfully",
  })
  async getPriceHistory(
    @Param("id", ParseUUIDPipe) id: string,
    @Request() req
  ) {
    const userId = req.user?.id;
    // TODO: Implement price tracking
    return {
      deckId: id,
      priceHistory: [],
      currentPrice: 0,
      currency: "USD",
      message: "Price tracking coming soon",
    };
  }

  @Post(":id/playtest")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Start a playtest session" })
  @ApiResponse({ status: 201, description: "Playtest session started" })
  async startPlaytest(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user?.id;
    // TODO: Implement playtest functionality
    return {
      deckId: id,
      playtestId: "generated-id",
      message: "Playtest functionality coming soon",
    };
  }

  @Get(":id/statistics")
  @Public()
  @ApiOperation({ summary: "Get deck performance statistics" })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getStatistics(
    @Param("id", ParseUUIDPipe) id: string,
    @Request() req
  ): Promise<any> {
    const userId = req.user?.id;
    const deck = await this.decksService.findOne(id, userId);

    return {
      deckId: deck.id,
      views: deck.views,
      likes: deck.likes,
      copies: deck.copies,
      metaRating: deck.metaRating,
      powerLevel: deck.powerLevel,
      competitivenessScore: deck.competitivenessScore,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
      stats: deck.stats || {
        totalGames: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
      },
    };
  }
}
