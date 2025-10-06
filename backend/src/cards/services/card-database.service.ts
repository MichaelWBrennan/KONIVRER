import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../entities/card.entity';
import { readFileSync } from 'fs';
import { join } from 'path';

interface CardData {
  id: string;
  name: string;
  elements: string[];
  lesserType: string;
  azothCost: number;
  power?: number;
  toughness?: number;
  rulesText: string;
  flavorText?: string;
  rarity: string;
  setCode: string;
  setNumber: number;
  imageUrl: string;
  webpUrl: string;
  keywords?: string[];
  manaCost: number;
  color: string;
  text: string;
  description: string;
  type: string;
  element: string;
  cost: number;
}

interface CardDatabase {
  cards: CardData[];
  sets: Array<{
    code: string;
    name: string;
    releaseDate: string;
    type: string;
    description: string;
  }>;
  rarities: Array<{
    name: string;
    displayName: string;
    color: string;
    dropRate: number;
  }>;
  elements: Array<{
    name: string;
    displayName: string;
    color: string;
    description: string;
  }>;
  types: Array<{
    name: string;
    displayName: string;
    description: string;
  }>;
  keywords: Array<{
    name: string;
    description: string;
  }>;
}

@Injectable()
export class CardDatabaseService {
  private readonly logger = new Logger(CardDatabaseService.name);
  private cardDatabase: CardDatabase | null = null;

  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async loadCardDatabase(): Promise<CardDatabase> {
    if (this.cardDatabase) {
      return this.cardDatabase;
    }

    try {
      const dataPath = join(process.cwd(), 'data', 'konivrer-cards.json');
      const fileContent = readFileSync(dataPath, 'utf8');
      this.cardDatabase = JSON.parse(fileContent);
      
      this.logger.log(`Loaded card database with ${this.cardDatabase.cards.length} cards`);
      return this.cardDatabase;
    } catch (error) {
      this.logger.error('Failed to load card database', error);
      throw error;
    }
  }

  async syncCardsToDatabase(): Promise<void> {
    try {
      const database = await this.loadCardDatabase();
      
      this.logger.log('Starting card database sync...');
      
      for (const cardData of database.cards) {
        const existingCard = await this.cardRepository.findOne({
          where: { id: cardData.id },
        });

        if (existingCard) {
          // Update existing card
          await this.cardRepository.update(cardData.id, {
            name: cardData.name,
            elements: cardData.elements,
            lesserType: cardData.lesserType,
            azothCost: cardData.azothCost,
            power: cardData.power,
            toughness: cardData.toughness,
            rulesText: cardData.rulesText,
            flavorText: cardData.flavorText,
            rarity: cardData.rarity,
            setCode: cardData.setCode,
            setNumber: cardData.setNumber,
            imageUrl: cardData.imageUrl,
            webpUrl: cardData.webpUrl,
            keywords: cardData.keywords || [],
            manaCost: cardData.manaCost,
            color: cardData.color,
            text: cardData.text,
            description: cardData.description,
            type: cardData.type,
            element: cardData.element,
            cost: cardData.cost,
          });
          
          this.logger.log(`Updated card: ${cardData.name}`);
        } else {
          // Create new card
          const card = this.cardRepository.create({
            id: cardData.id,
            name: cardData.name,
            elements: cardData.elements,
            lesserType: cardData.lesserType,
            azothCost: cardData.azothCost,
            power: cardData.power,
            toughness: cardData.toughness,
            rulesText: cardData.rulesText,
            flavorText: cardData.flavorText,
            rarity: cardData.rarity,
            setCode: cardData.setCode,
            setNumber: cardData.setNumber,
            imageUrl: cardData.imageUrl,
            webpUrl: cardData.webpUrl,
            keywords: cardData.keywords || [],
            manaCost: cardData.manaCost,
            color: cardData.color,
            text: cardData.text,
            description: cardData.description,
            type: cardData.type,
            element: cardData.element,
            cost: cardData.cost,
          });

          await this.cardRepository.save(card);
          this.logger.log(`Created card: ${cardData.name}`);
        }
      }

      this.logger.log('Card database sync completed successfully');
    } catch (error) {
      this.logger.error('Failed to sync cards to database', error);
      throw error;
    }
  }

  async getCardById(id: string): Promise<Card | null> {
    return this.cardRepository.findOne({ where: { id } });
  }

  async getCardsByElement(element: string): Promise<Card[]> {
    return this.cardRepository
      .createQueryBuilder('card')
      .where('card.elements @> :element', { element: [element] })
      .getMany();
  }

  async getCardsByType(type: string): Promise<Card[]> {
    return this.cardRepository.find({ where: { lesserType: type } });
  }

  async getCardsByRarity(rarity: string): Promise<Card[]> {
    return this.cardRepository.find({ where: { rarity } });
  }

  async searchCards(query: string): Promise<Card[]> {
    return this.cardRepository
      .createQueryBuilder('card')
      .where('card.name ILIKE :query', { query: `%${query}%` })
      .orWhere('card.rulesText ILIKE :query', { query: `%${query}%` })
      .orWhere('card.flavorText ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async getCardsByCostRange(minCost: number, maxCost: number): Promise<Card[]> {
    return this.cardRepository
      .createQueryBuilder('card')
      .where('card.azothCost >= :minCost', { minCost })
      .andWhere('card.azothCost <= :maxCost', { maxCost })
      .getMany();
  }

  async getCardsByPowerRange(minPower: number, maxPower: number): Promise<Card[]> {
    return this.cardRepository
      .createQueryBuilder('card')
      .where('card.power >= :minPower', { minPower })
      .andWhere('card.power <= :maxPower', { maxPower })
      .andWhere('card.power IS NOT NULL')
      .getMany();
  }

  async getRandomCard(): Promise<Card | null> {
    const count = await this.cardRepository.count();
    if (count === 0) return null;

    const randomIndex = Math.floor(Math.random() * count);
    return this.cardRepository
      .createQueryBuilder('card')
      .offset(randomIndex)
      .limit(1)
      .getOne();
  }

  async getCardStatistics(): Promise<{
    totalCards: number;
    cardsByElement: Record<string, number>;
    cardsByType: Record<string, number>;
    cardsByRarity: Record<string, number>;
    averageCost: number;
    averagePower: number;
    averageToughness: number;
  }> {
    const totalCards = await this.cardRepository.count();
    
    const cards = await this.cardRepository.find();
    
    const cardsByElement: Record<string, number> = {};
    const cardsByType: Record<string, number> = {};
    const cardsByRarity: Record<string, number> = {};
    
    let totalCost = 0;
    let totalPower = 0;
    let totalToughness = 0;
    let powerCount = 0;
    let toughnessCount = 0;

    for (const card of cards) {
      // Count by element
      for (const element of card.elements) {
        cardsByElement[element] = (cardsByElement[element] || 0) + 1;
      }

      // Count by type
      cardsByType[card.lesserType] = (cardsByType[card.lesserType] || 0) + 1;

      // Count by rarity
      cardsByRarity[card.rarity] = (cardsByRarity[card.rarity] || 0) + 1;

      // Calculate averages
      totalCost += card.azothCost;
      
      if (card.power !== null && card.power !== undefined) {
        totalPower += card.power;
        powerCount++;
      }
      
      if (card.toughness !== null && card.toughness !== undefined) {
        totalToughness += card.toughness;
        toughnessCount++;
      }
    }

    return {
      totalCards,
      cardsByElement,
      cardsByType,
      cardsByRarity,
      averageCost: totalCards > 0 ? totalCost / totalCards : 0,
      averagePower: powerCount > 0 ? totalPower / powerCount : 0,
      averageToughness: toughnessCount > 0 ? totalToughness / toughnessCount : 0,
    };
  }

  async getCardRecommendations(cardId: string, limit = 5): Promise<Card[]> {
    const card = await this.getCardById(cardId);
    if (!card) return [];

    // Find cards with similar elements, type, or cost
    const recommendations = await this.cardRepository
      .createQueryBuilder('card')
      .where('card.id != :cardId', { cardId })
      .andWhere(
        '(card.elements && :elements OR card.lesserType = :type OR ABS(card.azothCost - :cost) <= 2)',
        {
          elements: card.elements,
          type: card.lesserType,
          cost: card.azothCost,
        }
      )
      .orderBy('ABS(card.azothCost - :cost)', 'ASC')
      .limit(limit)
      .getMany();

    return recommendations;
  }

  async getCardDatabase(): Promise<CardDatabase> {
    return this.loadCardDatabase();
  }

  async getSets(): Promise<CardDatabase['sets']> {
    const database = await this.loadCardDatabase();
    return database.sets;
  }

  async getRarities(): Promise<CardDatabase['rarities']> {
    const database = await this.loadCardDatabase();
    return database.rarities;
  }

  async getElements(): Promise<CardDatabase['elements']> {
    const database = await this.loadCardDatabase();
    return database.elements;
  }

  async getTypes(): Promise<CardDatabase['types']> {
    const database = await this.loadCardDatabase();
    return database.types;
  }

  async getKeywords(): Promise<CardDatabase['keywords']> {
    const database = await this.loadCardDatabase();
    return database.keywords;
  }
}