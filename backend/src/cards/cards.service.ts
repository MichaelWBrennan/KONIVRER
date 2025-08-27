import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, Between, FindManyOptions } from "typeorm";
import { Card } from "./entities/card.entity";
import { CreateCardDto, UpdateCardDto, CardFilterDto } from "./dto/card.dto";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    // Check if card name already exists
    const existingCard = await this.cardsRepository.findOne({
      where: { name: createCardDto.name },
    });

    if (existingCard) {
      throw new BadRequestException(
        `Card with name "${createCardDto.name}" already exists`
      );
    }

    const card = this.cardsRepository.create(createCardDto);
    return await this.cardsRepository.save(card);
  }

  async findAll(filterDto?: CardFilterDto): Promise<PaginatedResult<Card>> {
    const {
      search,
      type,
      element,
      rarity,
      minCost,
      maxCost,
      legalOnly,
      page = 1,
      limit = 20,
      sortBy = "name",
      sortOrder = "ASC",
    } = filterDto || {};

    const query = this.cardsRepository.createQueryBuilder("card");

    // Apply filters
    if (search) {
      query.andWhere(
        "(LOWER(card.name) LIKE LOWER(:search) OR " +
          "LOWER(card.description) LIKE LOWER(:search) OR " +
          "LOWER(card.keywords) LIKE LOWER(:search) OR " +
          "LOWER(card.rawOcrText) LIKE LOWER(:search))",
        { search: `%${search}%` }
      );
    }

    if (type) {
      query.andWhere("card.type = :type", { type });
    }

    if (element) {
      query.andWhere("card.element = :element", { element });
    }

    if (rarity) {
      query.andWhere("card.rarity = :rarity", { rarity });
    }

    if (minCost !== undefined) {
      query.andWhere("card.cost >= :minCost", { minCost });
    }

    if (maxCost !== undefined) {
      query.andWhere("card.cost <= :maxCost", { maxCost });
    }

    if (legalOnly) {
      query.andWhere("card.isLegal = :isLegal", { isLegal: true });
    }

    // Apply sorting
    const validSortFields = [
      "name",
      "cost",
      "power",
      "metaRating",
      "createdAt",
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "name";
    query.orderBy(`card.${sortField}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    query.skip(offset).take(limit);

    const [items, total] = await query.getManyAndCount();
    const pages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      pages,
    };
  }

  async findOne(id: string): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID "${id}" not found`);
    }

    return card;
  }

  async findByName(name: string): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      where: { name },
    });

    if (!card) {
      throw new NotFoundException(`Card with name "${name}" not found`);
    }

    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.findOne(id);

    // Check if new name already exists (if name is being updated)
    if (updateCardDto.name && updateCardDto.name !== card.name) {
      const existingCard = await this.cardsRepository.findOne({
        where: { name: updateCardDto.name },
      });

      if (existingCard) {
        throw new BadRequestException(
          `Card with name "${updateCardDto.name}" already exists`
        );
      }
    }

    Object.assign(card, updateCardDto);
    return await this.cardsRepository.save(card);
  }

  async remove(id: string): Promise<void> {
    const card = await this.findOne(id);
    await this.cardsRepository.remove(card);
  }

  async bulkCreate(cards: CreateCardDto[]): Promise<Card[]> {
    const createdCards: Card[] = [];

    for (const cardDto of cards) {
      try {
        const card = await this.create(cardDto);
        createdCards.push(card);
      } catch (error) {
        // Log error but continue with other cards
        console.warn(
          `Failed to create card "${cardDto.name}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    return createdCards;
  }

  async getStatistics() {
    const totalCards = await this.cardsRepository.count();

    const [typeStats, elementStats, rarityStats, costStats] = await Promise.all(
      [
        // Cards by type
        this.cardsRepository
          .createQueryBuilder("card")
          .select("card.type", "type")
          .addSelect("COUNT(*)", "count")
          .groupBy("card.type")
          .getRawMany(),

        // Cards by element
        this.cardsRepository
          .createQueryBuilder("card")
          .select("card.element", "element")
          .addSelect("COUNT(*)", "count")
          .groupBy("card.element")
          .getRawMany(),

        // Cards by rarity
        this.cardsRepository
          .createQueryBuilder("card")
          .select("card.rarity", "rarity")
          .addSelect("COUNT(*)", "count")
          .groupBy("card.rarity")
          .getRawMany(),

        // Cost distribution
        this.cardsRepository
          .createQueryBuilder("card")
          .select("card.cost", "cost")
          .addSelect("COUNT(*)", "count")
          .groupBy("card.cost")
          .orderBy("card.cost", "ASC")
          .getRawMany(),
      ]
    );

    return {
      totalCards,
      typeDistribution: typeStats,
      elementDistribution: elementStats,
      rarityDistribution: rarityStats,
      costDistribution: costStats,
    };
  }
}
