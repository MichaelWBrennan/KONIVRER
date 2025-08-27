import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
  IsUUID,
  ArrayMinSize,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  DeckFormat,
  DeckVisibility,
  DeckArchetype,
  DeckCard,
} from "../entities/deck.entity";

export class DeckCardDto {
  @ApiProperty({ description: "Card ID" })
  @IsUUID()
  cardId: string;

  @ApiProperty({ description: "Quantity of this card", minimum: 1, maximum: 4 })
  @IsNumber()
  @Min(1)
  @Max(4)
  quantity: number;

  @ApiPropertyOptional({ description: "Card category/section" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: "Notes about this card" })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateDeckDto {
  @ApiProperty({ description: "Deck name" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: "Deck description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DeckFormat, description: "Tournament format" })
  @IsEnum(DeckFormat)
  format: DeckFormat;

  @ApiProperty({ enum: DeckVisibility, description: "Deck visibility" })
  @IsEnum(DeckVisibility)
  visibility: DeckVisibility;

  @ApiPropertyOptional({ enum: DeckArchetype, description: "Deck archetype" })
  @IsOptional()
  @IsEnum(DeckArchetype)
  archetype?: DeckArchetype;

  @ApiProperty({ description: "Mainboard cards", type: [DeckCardDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeckCardDto)
  @ArrayMinSize(60) // Minimum deck size for most formats
  mainboard: DeckCardDto[];

  @ApiPropertyOptional({ description: "Sideboard cards", type: [DeckCardDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeckCardDto)
  sideboard?: DeckCardDto[];

  @ApiPropertyOptional({
    description: "Commander card ID (for Commander format)",
  })
  @IsOptional()
  @IsUUID()
  commanderId?: string;

  @ApiPropertyOptional({ description: "Deck tags", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: "Collaborators with edit access",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  collaborators?: string[];
}

export class UpdateDeckDto {
  @ApiPropertyOptional({ description: "Deck name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Deck description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: DeckVisibility, description: "Deck visibility" })
  @IsOptional()
  @IsEnum(DeckVisibility)
  visibility?: DeckVisibility;

  @ApiPropertyOptional({ enum: DeckArchetype, description: "Deck archetype" })
  @IsOptional()
  @IsEnum(DeckArchetype)
  archetype?: DeckArchetype;

  @ApiPropertyOptional({ description: "Mainboard cards", type: [DeckCardDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeckCardDto)
  mainboard?: DeckCardDto[];

  @ApiPropertyOptional({ description: "Sideboard cards", type: [DeckCardDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeckCardDto)
  sideboard?: DeckCardDto[];

  @ApiPropertyOptional({ description: "Commander card ID" })
  @IsOptional()
  @IsUUID()
  commanderId?: string;

  @ApiPropertyOptional({ description: "Deck tags", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: "Collaborators with edit access",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  collaborators?: string[];
}

export class DeckSearchFilters {
  @ApiPropertyOptional({ description: "Page number", minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: "Items per page",
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ enum: DeckFormat, description: "Filter by format" })
  @IsOptional()
  @IsEnum(DeckFormat)
  format?: DeckFormat;

  @ApiPropertyOptional({
    enum: DeckArchetype,
    description: "Filter by archetype",
  })
  @IsOptional()
  @IsEnum(DeckArchetype)
  archetype?: DeckArchetype;

  @ApiPropertyOptional({ description: "Filter by colors", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @ApiPropertyOptional({ description: "Power level range" })
  @IsOptional()
  powerLevel?: {
    min?: number;
    max?: number;
  };

  @ApiPropertyOptional({
    description: "Minimum meta rating",
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  metaRating?: number;

  @ApiPropertyOptional({ description: "Filter by tags", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: "Search in name, description, and tags" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Sort field",
    enum: [
      "createdAt",
      "updatedAt",
      "name",
      "metaRating",
      "powerLevel",
      "likes",
      "views",
    ],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: "Sort order",
    enum: ["ASC", "DESC"],
    default: "DESC",
  })
  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC";

  @ApiPropertyOptional({
    description: "Include private decks if user owns them",
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includePrivate?: boolean;
}

export class ImportDeckDto {
  @ApiProperty({ description: "Deck name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Deck list as text" })
  @IsString()
  deckList: string;

  @ApiProperty({
    description: "Import format",
    enum: ["mtgo", "arena", "text"],
  })
  @IsEnum(["mtgo", "arena", "text"])
  format: "mtgo" | "arena" | "text";

  @ApiPropertyOptional({ enum: DeckFormat, description: "Target format" })
  @IsOptional()
  @IsEnum(DeckFormat)
  deckFormat?: DeckFormat;
}

export class CloneDeckDto {
  @ApiPropertyOptional({ description: "Name for the cloned deck" })
  @IsOptional()
  @IsString()
  name?: string;
}

export class DeckAnalyticsDto {
  @ApiProperty({ description: "Deck ID" })
  deckId: string;

  @ApiProperty({ description: "Mana curve distribution" })
  manaCurve: { cost: number; count: number }[];

  @ApiProperty({ description: "Element distribution" })
  elementDistribution: { element: string; count: number; percentage: number }[];

  @ApiProperty({ description: "Card type distribution" })
  typeDistribution: { type: string; count: number; percentage: number }[];

  @ApiProperty({ description: "Rarity distribution" })
  rarityDistribution: { rarity: string; count: number; percentage: number }[];

  @ApiProperty({ description: "Average mana cost" })
  avgManaCost: number;

  @ApiProperty({ description: "Card advantage ratio" })
  cardAdvantageRatio: number;

  @ApiProperty({ description: "Number of removal spells" })
  removalCount: number;

  @ApiProperty({ description: "Number of threats" })
  threatCount: number;

  @ApiProperty({ description: "Consistency score (0-100)" })
  consistencyScore: number;

  @ApiProperty({ description: "Power level (1-10)" })
  powerLevel: number;

  @ApiProperty({ description: "Improvement suggestions" })
  suggestions: any[];

  @ApiProperty({ description: "Similar decks" })
  similarDecks: any[];

  @ApiProperty({ description: "Meta position" })
  metaPosition: any;
}
