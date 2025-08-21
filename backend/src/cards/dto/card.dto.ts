import { IsString, IsEnum, IsInt, IsOptional, IsBoolean, IsArray, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CardType, CardElement, CardRarity } from '../entities/card.entity';

export class CreateCardDto {
  @ApiProperty({ description: 'Card name (must be unique)' })
  @IsString()
  name: string;

  @ApiProperty({ enum: CardType, description: 'Card type' })
  @IsEnum(CardType)
  type: CardType;

  @ApiProperty({ enum: CardElement, description: 'Card element' })
  @IsEnum(CardElement)
  element: CardElement;

  @ApiProperty({ enum: CardRarity, description: 'Card rarity' })
  @IsEnum(CardRarity)
  rarity: CardRarity;

  @ApiProperty({ description: 'Mana/Azoth cost (0-20)', minimum: 0, maximum: 20 })
  @IsInt()
  @Min(0)
  @Max(20)
  cost: number;

  @ApiProperty({ description: 'Power value for creatures', required: false, minimum: 0, maximum: 20 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  power?: number;

  @ApiProperty({ description: 'Toughness value for creatures', required: false, minimum: 0, maximum: 20 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  toughness?: number;

  @ApiProperty({ description: 'Card description/rules text' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Primary image URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'WebP optimized image URL', required: false })
  @IsOptional()
  @IsString()
  webpUrl?: string;

  @ApiProperty({ description: 'Flavor text', required: false })
  @IsOptional()
  @IsString()
  flavorText?: string;

  @ApiProperty({ description: 'Keywords/abilities', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiProperty({ description: 'Whether the card is tournament legal', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isLegal?: boolean;

  @ApiProperty({ description: 'Additional metadata as JSON', required: false })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Raw OCR text for full-text search', required: false })
  @IsOptional()
  @IsString()
  rawOcrText?: string;
}

export class UpdateCardDto {
  @ApiProperty({ description: 'Card name (must be unique)', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: CardType, description: 'Card type', required: false })
  @IsOptional()
  @IsEnum(CardType)
  type?: CardType;

  @ApiProperty({ enum: CardElement, description: 'Card element', required: false })
  @IsOptional()
  @IsEnum(CardElement)
  element?: CardElement;

  @ApiProperty({ enum: CardRarity, description: 'Card rarity', required: false })
  @IsOptional()
  @IsEnum(CardRarity)
  rarity?: CardRarity;

  @ApiProperty({ description: 'Mana/Azoth cost (0-20)', required: false, minimum: 0, maximum: 20 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  cost?: number;

  @ApiProperty({ description: 'Power value for creatures', required: false, minimum: 0, maximum: 20 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  power?: number;

  @ApiProperty({ description: 'Toughness value for creatures', required: false, minimum: 0, maximum: 20 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  toughness?: number;

  @ApiProperty({ description: 'Card description/rules text', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Primary image URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'WebP optimized image URL', required: false })
  @IsOptional()
  @IsString()
  webpUrl?: string;

  @ApiProperty({ description: 'Flavor text', required: false })
  @IsOptional()
  @IsString()
  flavorText?: string;

  @ApiProperty({ description: 'Keywords/abilities', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiProperty({ description: 'Whether the card is tournament legal', required: false })
  @IsOptional()
  @IsBoolean()
  isLegal?: boolean;
}

export class CardFilterDto {
  @ApiProperty({ description: 'Search query for name, description, keywords', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: CardType, description: 'Filter by card type', required: false })
  @IsOptional()
  @IsEnum(CardType)
  type?: CardType;

  @ApiProperty({ enum: CardElement, description: 'Filter by card element', required: false })
  @IsOptional()
  @IsEnum(CardElement)
  element?: CardElement;

  @ApiProperty({ enum: CardRarity, description: 'Filter by card rarity', required: false })
  @IsOptional()
  @IsEnum(CardRarity)
  rarity?: CardRarity;

  @ApiProperty({ description: 'Minimum cost filter', required: false, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minCost?: number;

  @ApiProperty({ description: 'Maximum cost filter', required: false, maximum: 20 })
  @IsOptional()
  @IsInt()
  @Max(20)
  @Type(() => Number)
  maxCost?: number;

  @ApiProperty({ description: 'Filter tournament legal cards only', required: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  legalOnly?: boolean;

  @ApiProperty({ description: 'Page number (1-based)', required: false, minimum: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({ description: 'Sort field', required: false, enum: ['name', 'cost', 'power', 'metaRating', 'createdAt'], default: 'name' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'name';

  @ApiProperty({ description: 'Sort direction', required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}