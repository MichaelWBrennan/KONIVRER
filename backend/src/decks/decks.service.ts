import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions, ILike, In } from "typeorm";
import {
  Deck,
  DeckFormat,
  DeckVisibility,
  DeckArchetype,
} from "./entities/deck.entity";
import {
  Card,
  CardElement,
  CardType,
  CardRarity,
} from "../cards/entities/card.entity";
import { User } from "../users/entities/user.entity";
import {
  CreateDeckDto,
  UpdateDeckDto,
  DeckSearchFilters,
  DeckAnalyticsDto,
  ImportDeckDto,
} from "./dto/deck.dto";

@Injectable()
export class DecksService {
  constructor(
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createDeckDto: CreateDeckDto, userId: string): Promise<Deck> {
    // Validate cards exist
    const cardIds = createDeckDto.mainboard.map((card) => card.cardId);
    const cards = await this.cardRepository.findBy({ id: In(cardIds) });

    if (cards.length !== cardIds.length) {
      throw new BadRequestException("One or more cards not found");
    }

    // Validate deck construction rules
    await this.validateDeckConstruction(
      createDeckDto.mainboard,
      createDeckDto.format
    );

    // Calculate analytics
    const analytics = await this.calculateDeckAnalytics(
      createDeckDto.mainboard,
      cards
    );
    const archetype = this.detectArchetype(createDeckDto.mainboard, cards);
    const colors = this.extractColors(cards);

    const deck = this.deckRepository.create({
      ...createDeckDto,
      userId,
      archetype,
      colors,
      analytics,
      powerLevel: this.calculatePowerLevel(cards),
      competitivenessScore: this.calculateCompetitivenessScore(cards),
      isLegal: await this.checkLegality(
        createDeckDto.mainboard,
        createDeckDto.format
      ),
    });

    const savedDeck = await this.deckRepository.save(deck);
    return this.findOneWithRelations(savedDeck.id);
  }

  async findAll(
    filters: DeckSearchFilters,
    userId?: string
  ): Promise<{ decks: Deck[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 20,
      format,
      archetype,
      colors,
      powerLevel,
      metaRating,
      tags,
      search,
      sortBy = "createdAt",
      sortOrder = "DESC",
      includePrivate = false,
    } = filters;

    const queryBuilder = this.deckRepository
      .createQueryBuilder("deck")
      .leftJoinAndSelect("deck.user", "user")
      .where("1 = 1");

    // Visibility filtering
    if (includePrivate && userId) {
      queryBuilder.andWhere(
        "(deck.visibility != :private OR deck.userId = :userId)",
        {
          private: DeckVisibility.PRIVATE,
          userId,
        }
      );
    } else {
      queryBuilder.andWhere("deck.visibility = :public", {
        public: DeckVisibility.PUBLIC,
      });
    }

    // Apply filters
    if (format) {
      queryBuilder.andWhere("deck.format = :format", { format });
    }

    if (archetype) {
      queryBuilder.andWhere("deck.archetype = :archetype", { archetype });
    }

    if (colors && colors.length > 0) {
      queryBuilder.andWhere("deck.colors && :colors", { colors });
    }

    if (powerLevel) {
      queryBuilder.andWhere("deck.powerLevel BETWEEN :minPower AND :maxPower", {
        minPower: powerLevel.min || 0,
        maxPower: powerLevel.max || 10,
      });
    }

    if (metaRating) {
      queryBuilder.andWhere("deck.metaRating >= :metaRating", { metaRating });
    }

    if (tags && tags.length > 0) {
      queryBuilder.andWhere("deck.tags && :tags", { tags });
    }

    if (search) {
      queryBuilder.andWhere(
        "(deck.name ILIKE :search OR deck.description ILIKE :search OR deck.tags::text ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    const validSortFields = [
      "createdAt",
      "updatedAt",
      "name",
      "metaRating",
      "powerLevel",
      "likes",
      "views",
    ];
    if (validSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`deck.${sortBy}`, sortOrder as "ASC" | "DESC");
    }

    // Pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [decks, total] = await queryBuilder.getManyAndCount();

    return {
      decks,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId?: string): Promise<Deck> {
    const deck = await this.findOneWithRelations(id);

    if (!deck) {
      throw new NotFoundException("Deck not found");
    }

    // Check visibility permissions
    if (deck.visibility === DeckVisibility.PRIVATE && deck.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    // Increment view count (but not for owner)
    if (deck.userId !== userId) {
      await this.deckRepository.increment({ id }, "views", 1);
    }

    return deck;
  }

  async update(
    id: string,
    updateDeckDto: UpdateDeckDto,
    userId: string
  ): Promise<Deck> {
    const deck = await this.deckRepository.findOne({ where: { id } });

    if (!deck) {
      throw new NotFoundException("Deck not found");
    }

    if (deck.userId !== userId && !deck.collaborators?.includes(userId)) {
      throw new ForbiddenException("Access denied");
    }

    // If cards are being updated, recalculate analytics
    if (updateDeckDto.mainboard) {
      const cardIds = updateDeckDto.mainboard.map((card) => card.cardId);
      const cards = await this.cardRepository.findBy({ id: In(cardIds) });

      if (cards.length !== cardIds.length) {
        throw new BadRequestException("One or more cards not found");
      }

      await this.validateDeckConstruction(updateDeckDto.mainboard, deck.format);

      const analytics = await this.calculateDeckAnalytics(
        updateDeckDto.mainboard,
        cards
      );
      const archetype = this.detectArchetype(updateDeckDto.mainboard, cards);
      const colors = this.extractColors(cards);

      Object.assign(updateDeckDto, {
        analytics,
        archetype,
        colors,
        powerLevel: this.calculatePowerLevel(cards),
        competitivenessScore: this.calculateCompetitivenessScore(cards),
        isLegal: await this.checkLegality(updateDeckDto.mainboard, deck.format),
      });
    }

    await this.deckRepository.update(id, updateDeckDto);
    return this.findOneWithRelations(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const deck = await this.deckRepository.findOne({ where: { id } });

    if (!deck) {
      throw new NotFoundException("Deck not found");
    }

    if (deck.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    await this.deckRepository.remove(deck);
  }

  async clone(id: string, userId: string, name?: string): Promise<Deck> {
    const originalDeck = await this.findOne(id, userId);

    if (
      originalDeck.visibility === DeckVisibility.PRIVATE &&
      originalDeck.userId !== userId
    ) {
      throw new ForbiddenException("Cannot clone private deck");
    }

    const clonedDeck = this.deckRepository.create({
      ...originalDeck,
      id: undefined, // Let TypeORM generate new ID
      name: name || `${originalDeck.name} (Copy)`,
      userId,
      parentDeckId: originalDeck.id,
      visibility: DeckVisibility.PRIVATE,
      likes: 0,
      views: 0,
      copies: 0,
      commentCount: 0,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedDeck = await this.deckRepository.save(clonedDeck);

    // Increment copy count on original
    await this.deckRepository.increment({ id: originalDeck.id }, "copies", 1);

    return this.findOneWithRelations(savedDeck.id);
  }

  async like(
    id: string,
    userId: string
  ): Promise<{ liked: boolean; likes: number }> {
    const deck = await this.deckRepository.findOne({ where: { id } });

    if (!deck) {
      throw new NotFoundException("Deck not found");
    }

    // TODO: Implement user-deck likes relationship table
    // For now, just increment/decrement likes count
    // In production, you'd want to track which users liked which decks

    await this.deckRepository.increment({ id }, "likes", 1);

    return {
      liked: true,
      likes: deck.likes + 1,
    };
  }

  async getAnalytics(id: string, userId?: string): Promise<DeckAnalyticsDto> {
    const deck = await this.findOne(id, userId);

    if (!deck.analytics) {
      // Recalculate analytics if missing
      const cardIds = deck.mainboard.map((card) => card.cardId);
      const cards = await this.cardRepository.findBy({ id: In(cardIds) });
      deck.analytics = await this.calculateDeckAnalytics(deck.mainboard, cards);
      await this.deckRepository.save(deck);
    }

    return {
      deckId: deck.id,
      ...deck.analytics,
      suggestions: await this.generateDeckSuggestions(deck),
      similarDecks: await this.findSimilarDecks(deck.id, 5),
      metaPosition: await this.calculateMetaPosition(deck),
    };
  }

  async importDeck(importDto: ImportDeckDto, userId: string): Promise<Deck> {
    let parsedDeck;

    switch (importDto.format) {
      case "mtgo":
        parsedDeck = this.parseMTGOFormat(importDto.deckList);
        break;
      case "arena":
        parsedDeck = this.parseArenaFormat(importDto.deckList);
        break;
      case "text":
        parsedDeck = this.parseTextFormat(importDto.deckList);
        break;
      default:
        throw new BadRequestException("Unsupported import format");
    }

    return this.create(
      {
        name: importDto.name || "Imported Deck",
        format: importDto.deckFormat || DeckFormat.STANDARD,
        visibility: DeckVisibility.PRIVATE,
        ...parsedDeck,
      },
      userId
    );
  }

  async getTopDecks(
    format?: DeckFormat,
    archetype?: DeckArchetype,
    limit: number = 10
  ): Promise<Deck[]> {
    const query = this.deckRepository
      .createQueryBuilder("deck")
      .leftJoinAndSelect("deck.user", "user")
      .where("deck.visibility = :visibility", {
        visibility: DeckVisibility.PUBLIC,
      })
      .andWhere("deck.isLegal = true")
      .orderBy("deck.metaRating", "DESC")
      .take(limit);

    if (format) {
      query.andWhere("deck.format = :format", { format });
    }

    if (archetype) {
      query.andWhere("deck.archetype = :archetype", { archetype });
    }

    return query.getMany();
  }

  async getMetaSnapshot(format: DeckFormat): Promise<any> {
    // Get top decks by archetype
    const archetypeStats = await this.deckRepository
      .createQueryBuilder("deck")
      .select("deck.archetype")
      .addSelect("COUNT(*)", "count")
      .addSelect("AVG(deck.metaRating)", "avgRating")
      .addSelect("AVG(deck.powerLevel)", "avgPowerLevel")
      .where("deck.format = :format", { format })
      .andWhere("deck.visibility = :visibility", {
        visibility: DeckVisibility.PUBLIC,
      })
      .andWhere("deck.isLegal = true")
      .groupBy("deck.archetype")
      .orderBy("avgRating", "DESC")
      .getRawMany();

    // Get trending decks (most viewed/liked recently)
    const trendingDecks = await this.deckRepository
      .createQueryBuilder("deck")
      .leftJoinAndSelect("deck.user", "user")
      .where("deck.format = :format", { format })
      .andWhere("deck.visibility = :visibility", {
        visibility: DeckVisibility.PUBLIC,
      })
      .andWhere("deck.createdAt > :date", {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }) // Last 7 days
      .orderBy("(deck.likes + deck.views)", "DESC")
      .take(10)
      .getMany();

    return {
      format,
      archetypeBreakdown: archetypeStats,
      trendingDecks,
      totalDecks: await this.deckRepository.count({
        where: { format, visibility: DeckVisibility.PUBLIC, isLegal: true },
      }),
      generatedAt: new Date(),
    };
  }

  // Private helper methods
  private async findOneWithRelations(id: string): Promise<Deck> {
    return this.deckRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  private async validateDeckConstruction(
    mainboard: any[],
    format: DeckFormat
  ): Promise<void> {
    const cardCounts = mainboard.reduce((counts, card) => {
      counts[card.cardId] = (counts[card.cardId] || 0) + card.quantity;
      return counts;
    }, {});

    // Check deck size
    const totalCards = mainboard.reduce(
      (total, card) => total + card.quantity,
      0
    );
    const minSize = format === DeckFormat.COMMANDER ? 100 : 60;

    if (totalCards < minSize) {
      throw new BadRequestException(
        `Deck must have at least ${minSize} cards for ${format} format`
      );
    }

    // Check card limits (4 copies max, except basic lands)
    for (const [cardId, count] of Object.entries(cardCounts)) {
      const cardCount = count as number;
      if (cardCount > 4) {
        const card = await this.cardRepository.findOne({
          where: { id: cardId },
        });
        // TODO: Check if it's a basic land or has special rules
        if (!card?.keywords?.includes("Basic")) {
          throw new BadRequestException(
            `Cannot have more than 4 copies of ${card?.name || "card"}`
          );
        }
      }
    }
  }

  private async calculateDeckAnalytics(
    mainboard: any[],
    cards: Card[]
  ): Promise<any> {
    const cardMap = new Map(cards.map((card) => [card.id, card]));

    // Calculate mana curve
    const manaCurve = Array(10)
      .fill(0)
      .map((_, i) => ({ cost: i, count: 0 }));
    let totalManaCost = 0;
    let totalCards = 0;

    // Element distribution
    const elementCounts = {};
    const typeCounts = {};
    const rarityCounts = {};

    for (const deckCard of mainboard) {
      const card = cardMap.get(deckCard.cardId);
      if (!card) continue;

      const quantity = deckCard.quantity;
      totalCards += quantity;
      totalManaCost += card.cost * quantity;

      // Mana curve
      const costIndex = Math.min(card.cost, 9);
      manaCurve[costIndex].count += quantity;

      // Element distribution
      elementCounts[card.element] =
        (elementCounts[card.element] || 0) + quantity;

      // Type distribution
      typeCounts[card.type] = (typeCounts[card.type] || 0) + quantity;

      // Rarity distribution
      rarityCounts[card.rarity] = (rarityCounts[card.rarity] || 0) + quantity;
    }

    const elementDistribution = Object.entries(elementCounts).map(
      ([element, count]) => ({
        element,
        count: count as number,
        percentage: Math.round(((count as number) / totalCards) * 100),
      })
    );

    const typeDistribution = Object.entries(typeCounts).map(
      ([type, count]) => ({
        type,
        count: count as number,
        percentage: Math.round(((count as number) / totalCards) * 100),
      })
    );

    const rarityDistribution = Object.entries(rarityCounts).map(
      ([rarity, count]) => ({
        rarity,
        count: count as number,
        percentage: Math.round(((count as number) / totalCards) * 100),
      })
    );

    return {
      manaCurve,
      elementDistribution,
      typeDistribution,
      rarityDistribution,
      avgManaCost: totalCards > 0 ? totalManaCost / totalCards : 0,
      cardAdvantageRatio: this.calculateCardAdvantageRatio(mainboard, cards),
      removalCount: this.countRemovalSpells(mainboard, cards),
      threatCount: this.countThreats(mainboard, cards),
      consistencyScore: this.calculateConsistencyScore(mainboard, cards),
      powerLevel: this.calculatePowerLevel(cards),
    };
  }

  private detectArchetype(
    mainboard: any[],
    cards: Card[]
  ): DeckArchetype | null {
    // Simple archetype detection based on card types and mana curve
    const creatureCount = cards.filter(
      (card) => card.type === CardType.CREATURE
    ).length;
    const spellCount = cards.filter(
      (card) => card.type === CardType.SPELL
    ).length;
    const avgManaCost =
      cards.reduce((sum, card) => sum + card.cost, 0) / cards.length;

    if (creatureCount > spellCount * 1.5 && avgManaCost < 3) {
      return DeckArchetype.AGGRO;
    }

    if (spellCount > creatureCount && avgManaCost > 4) {
      return DeckArchetype.CONTROL;
    }

    if (avgManaCost >= 3 && avgManaCost <= 4) {
      return DeckArchetype.MIDRANGE;
    }

    // TODO: Implement more sophisticated archetype detection
    return null;
  }

  private extractColors(cards: Card[]): string[] {
    const colors = new Set<string>();
    cards.forEach((card) => {
      if (card.element && card.element !== CardElement.NEUTRAL) {
        colors.add(card.element);
      }
    });
    return Array.from(colors);
  }

  private calculatePowerLevel(cards: Card[]): number {
    // Simple power level calculation based on rarity and meta ratings
    const totalRating = cards.reduce((sum, card) => {
      let rating = card.metaRating || 0;

      // Bonus for rarity
      switch (card.rarity) {
        case CardRarity.MYTHIC:
          rating += 2;
          break;
        case CardRarity.RARE:
          rating += 1;
          break;
      }

      return sum + rating;
    }, 0);

    return Math.min(10, totalRating / cards.length);
  }

  private calculateCompetitivenessScore(cards: Card[]): number {
    // Calculate based on tournament performance and meta ratings
    const avgMetaRating =
      cards.reduce((sum, card) => sum + (card.metaRating || 0), 0) /
      cards.length;
    return Math.min(100, avgMetaRating * 10);
  }

  private async checkLegality(
    mainboard: any[],
    format: DeckFormat
  ): Promise<boolean> {
    // TODO: Implement format-specific legality checks
    return true;
  }

  private calculateCardAdvantageRatio(mainboard: any[], cards: Card[]): number {
    // TODO: Implement card advantage calculation
    return 0;
  }

  private countRemovalSpells(mainboard: any[], cards: Card[]): number {
    // TODO: Implement removal spell counting
    return 0;
  }

  private countThreats(mainboard: any[], cards: Card[]): number {
    return cards.filter((card) => card.type === CardType.CREATURE).length;
  }

  private calculateConsistencyScore(mainboard: any[], cards: Card[]): number {
    // TODO: Implement consistency score calculation
    return 0;
  }

  private async generateDeckSuggestions(deck: Deck): Promise<any[]> {
    // TODO: Implement AI-powered deck suggestions
    return [];
  }

  private async findSimilarDecks(
    deckId: string,
    limit: number
  ): Promise<Deck[]> {
    // TODO: Implement similarity algorithm
    return [];
  }

  private async calculateMetaPosition(deck: Deck): Promise<any> {
    // TODO: Implement meta position calculation
    return { tier: "T3", position: 0, trending: "stable" };
  }

  private parseMTGOFormat(deckList: string): any {
    // TODO: Implement MTGO format parser
    throw new BadRequestException("MTGO format parsing not implemented");
  }

  private parseArenaFormat(deckList: string): any {
    // TODO: Implement Arena format parser
    throw new BadRequestException("Arena format parsing not implemented");
  }

  private parseTextFormat(deckList: string): any {
    // TODO: Implement text format parser
    throw new BadRequestException("Text format parsing not implemented");
  }

  async assignToUser(deckId: string, userId: string): Promise<Deck> {
    const deck = await this.deckRepository.findOne({
      where: { id: deckId },
    });

    if (!deck) {
      throw new NotFoundException("Deck not found");
    }

    // Check if deck is public or user already owns it
    if (deck.visibility === DeckVisibility.PRIVATE && deck.userId !== userId) {
      throw new ForbiddenException("Cannot assign private deck");
    }

    // Create a copy of the deck for the user
    const clonedDeck = this.deckRepository.create({
      ...deck,
      id: undefined, // Let TypeORM generate new ID
      userId,
      name: `${deck.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      copies: deck.copies + 1,
    });

    const savedDeck = await this.deckRepository.save(clonedDeck);

    // Increment copy count on original
    await this.deckRepository.update(deck.id, { copies: deck.copies + 1 });

    return this.findOneWithRelations(savedDeck.id);
  }
}
