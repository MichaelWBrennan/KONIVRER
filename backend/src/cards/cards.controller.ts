import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { CardsService } from "./cards.service";
import { CreateCardDto, UpdateCardDto, CardFilterDto } from "./dto/card.dto";
import { Card } from "./entities/card.entity";

@ApiTags("cards")
@Controller("api/cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new card" })
  @ApiResponse({
    status: 201,
    description: "Card created successfully",
    type: Card,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid card data or card name already exists",
  })
  async create(@Body() createCardDto: CreateCardDto): Promise<Card> {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all cards with optional filters" })
  @ApiResponse({ status: 200, description: "Cards retrieved successfully" })
  @ApiQuery({
    name: "q",
    required: false,
    description: "Search query (alias: search)",
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search query (alias of q)",
  })
  @ApiQuery({
    name: "type",
    required: false,
    description: "Filter by card type",
  })
  @ApiQuery({
    name: "cost_min",
    required: false,
    description: "Minimum cost filter",
  })
  @ApiQuery({
    name: "cost_max",
    required: false,
    description: "Maximum cost filter",
  })
  @ApiQuery({
    name: "faction",
    required: false,
    description: "Filter by faction",
  })
  @ApiQuery({
    name: "element",
    required: false,
    description: "Filter by element (alias of faction)",
  })
  @ApiQuery({
    name: "rarity",
    required: false,
    description: "Filter by rarity",
  })
  @ApiQuery({ name: "set", required: false, description: "Filter by set" })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (1-based)",
  })
  @ApiQuery({
    name: "pageSize",
    required: false,
    description: "Items per page (1-100)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page (alias of pageSize)",
  })
  @ApiQuery({
    name: "sort",
    required: false,
    description: "Sort field (alias: sortBy)",
  })
  @ApiQuery({
    name: "sortBy",
    required: false,
    description: "Sort field (alias of sort)",
  })
  @ApiQuery({
    name: "sortOrder",
    required: false,
    description: "Sort order ASC|DESC",
  })
  @ApiQuery({
    name: "legalOnly",
    required: false,
    description: "Only tournament legal cards",
  })
  async findAll(@Query() filters: any) {
    // Convert API spec query params to internal format
    const internalFilters = {
      search: filters.search ?? filters.q,
      type: filters.type,
      element: filters.element ?? filters.faction, // Support both element and faction
      rarity: filters.rarity,
      minCost: filters.minCost ?? filters.cost_min,
      maxCost: filters.maxCost ?? filters.cost_max,
      legalOnly:
        filters.legalOnly === undefined
          ? undefined
          : [true, "true", 1, "1"].includes(filters.legalOnly),
      page: Number(filters.page) || 1,
      limit: Number(filters.limit ?? filters.pageSize) || 20,
      sortBy: filters.sort ?? filters.sortBy,
      sortOrder: (filters.sortOrder?.toUpperCase?.() === "DESC"
        ? "DESC"
        : "ASC") as "ASC" | "DESC",
    };

    const result = await this.cardsService.findAll(internalFilters);

    // Return in API spec format
    return {
      total: result.total,
      page: result.page,
      pageSize: result.limit,
      cards: (result.items || []).map((card) => ({
        id: card.id,
        name: card.name,
        type: card.type,
        cost: card.cost,
        faction: card.element, // Map element to faction (legacy)
        element: card.element, // Include element for modern clients
        rarity: card.rarity,
        text: card.description,
        imageUrl: card.imageUrl,
        webpUrl: card.webpUrl,
        metadata: {
          rarity: card.rarity,
          set: filters.set || "S1", // Default set
        },
      })),
    };
  }

  @Get("statistics")
  @ApiOperation({ summary: "Get card database statistics" })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getStatistics() {
    return this.cardsService.getStatistics();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific card by ID" })
  @ApiResponse({
    status: 200,
    description: "Card retrieved successfully",
    type: Card,
  })
  @ApiResponse({ status: 404, description: "Card not found" })
  async findOne(@Param("id") id: string): Promise<Card> {
    return this.cardsService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a card" })
  @ApiResponse({
    status: 200,
    description: "Card updated successfully",
    type: Card,
  })
  @ApiResponse({ status: 404, description: "Card not found" })
  @ApiResponse({ status: 400, description: "Invalid update data" })
  async update(
    @Param("id") id: string,
    @Body() updateCardDto: UpdateCardDto
  ): Promise<Card> {
    return this.cardsService.update(id, updateCardDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a card" })
  @ApiResponse({ status: 200, description: "Card deleted successfully" })
  @ApiResponse({ status: 404, description: "Card not found" })
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.cardsService.remove(id);
    return { message: "Card deleted successfully" };
  }

  @Post("bulk")
  @ApiOperation({ summary: "Create multiple cards at once" })
  @ApiResponse({ status: 201, description: "Cards created successfully" })
  async bulkCreate(@Body() cards: CreateCardDto[]): Promise<Card[]> {
    return this.cardsService.bulkCreate(cards);
  }

  @Get("name/:name")
  @ApiOperation({ summary: "Get a card by name" })
  @ApiResponse({
    status: 200,
    description: "Card retrieved successfully",
    type: Card,
  })
  @ApiResponse({ status: 404, description: "Card not found" })
  async findByName(@Param("name") name: string): Promise<Card> {
    return this.cardsService.findByName(name);
  }
}
