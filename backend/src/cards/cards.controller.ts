import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto, CardFilterDto } from './dto/card.dto';
import { Card } from './entities/card.entity';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: 201, description: 'Card created successfully', type: Card })
  @ApiResponse({ status: 400, description: 'Invalid card data or card name already exists' })
  async create(@Body() createCardDto: CreateCardDto): Promise<Card> {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cards with optional filters' })
  @ApiResponse({ status: 200, description: 'Cards retrieved successfully' })
  @ApiQuery({ name: 'search', required: false, description: 'Search in name, description, keywords' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by card type' })
  @ApiQuery({ name: 'element', required: false, description: 'Filter by card element' })
  @ApiQuery({ name: 'rarity', required: false, description: 'Filter by card rarity' })
  @ApiQuery({ name: 'minCost', required: false, description: 'Minimum cost filter' })
  @ApiQuery({ name: 'maxCost', required: false, description: 'Maximum cost filter' })
  @ApiQuery({ name: 'legalOnly', required: false, description: 'Tournament legal cards only' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (1-100)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (ASC/DESC)' })
  async findAll(@Query() filterDto: CardFilterDto) {
    return this.cardsService.findAll(filterDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get card database statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics() {
    return this.cardsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific card by ID' })
  @ApiResponse({ status: 200, description: 'Card retrieved successfully', type: Card })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async findOne(@Param('id') id: string): Promise<Card> {
    return this.cardsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a card' })
  @ApiResponse({ status: 200, description: 'Card updated successfully', type: Card })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  async update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<Card> {
    return this.cardsService.update(id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.cardsService.remove(id);
    return { message: 'Card deleted successfully' };
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple cards at once' })
  @ApiResponse({ status: 201, description: 'Cards created successfully' })
  async bulkCreate(@Body() cards: CreateCardDto[]): Promise<Card[]> {
    return this.cardsService.bulkCreate(cards);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get a card by name' })
  @ApiResponse({ status: 200, description: 'Card retrieved successfully', type: Card })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async findByName(@Param('name') name: string): Promise<Card> {
    return this.cardsService.findByName(name);
  }
}