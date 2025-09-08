import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { ObjectType, Field, ID, Int, Float } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

export enum CardType {
  FAMILIAR = "Familiar", // KONIVRER creatures
  CREATURE = "Familiar", // Alias for KONIVRER creatures
  SPELL = "Spell",
  FLAG = "Flag", // KONIVRER deck anchor
}

export enum CardElement {
  FIRE = "🜂", // Fire
  WATER = "🜄", // Water
  EARTH = "🜃", // Earth
  AIR = "🜁", // Air
  AETHER = "⭘", // Aether
  NETHER = "▢", // Nether
  GENERIC = "✡⃝", // Generic
  NEUTRAL = "✡⃝", // Alias for Generic
}

export enum CardRarity {
  COMMON = "🜠", // Common
  UNCOMMON = "☽", // Uncommon
  RARE = "☉", // Rare
  MYTHIC = "✠", // Mythic
}

@Entity("cards")
@ObjectType()
@Index(["element", "type", "rarity"]) // Composite index for common queries
@Index(["name"], { unique: true }) // Unique index on card name
export class Card {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Canonical card ID (immutable UUID)" })
  id: string;

  @Column({ type: "varchar", unique: true })
  @Field()
  @ApiProperty({ description: "Card name (unique)" })
  name: string;

  @Column({
    type: "enum",
    enum: CardType,
  })
  @Field()
  @ApiProperty({ enum: CardType, description: "Card type" })
  type: CardType;

  @Column({
    type: "enum",
    enum: CardElement,
  })
  @Field()
  @ApiProperty({ enum: CardElement, description: "Card element" })
  element: CardElement;

  @Column({
    type: "enum",
    enum: CardRarity,
  })
  @Field()
  @ApiProperty({ enum: CardRarity, description: "Card rarity" })
  rarity: CardRarity;

  @Column({ type: "int" })
  @Field(() => Int)
  @ApiProperty({ description: "Mana/Azoth cost to play the card" })
  cost: number;

  @Column({ type: "int", nullable: true })
  @Field(() => Int, { nullable: true })
  @ApiProperty({ description: "Power value (creatures only)", required: false })
  power?: number;

  @Column({ type: "int", nullable: true })
  @Field(() => Int, { nullable: true })
  @ApiProperty({
    description: "Toughness value (creatures only)",
    required: false,
  })
  toughness?: number;

  @Column({ type: "text" })
  @Field()
  @ApiProperty({ description: "Card description/rules text" })
  description: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Primary image URL", required: false })
  imageUrl?: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "WebP optimized image URL", required: false })
  webpUrl?: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Flavor text", required: false })
  flavorText?: string;

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({
    description: "Keywords/abilities",
    type: [String],
    required: false,
  })
  keywords?: string[];

  // KONIVRER-specific fields
  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Base strength for KONIVRER mechanics" })
  baseStrength: number;

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({
    description: "Secondary elements for Amalgam cards",
    type: [String],
    required: false,
  })
  secondaryElements?: string[];

  @Column({ type: "boolean", default: false })
  @Field()
  @ApiProperty({ description: "Whether this card has Quintessence keyword" })
  hasQuintessence: boolean;

  @Column({ type: "simple-json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "KONIVRER keyword effects and parameters",
    required: false,
  })
  konivrKeywords?: Record<string, any>;

  @Column({ type: "simple-json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Additional metadata as JSON", required: false })
  metadata?: Record<string, any>;

  @Column({ type: "boolean", default: true })
  @Field()
  @ApiProperty({ description: "Whether the card is tournament legal" })
  isLegal: boolean;

  @Column({ type: "float", default: 0 })
  @Field(() => Float)
  @ApiProperty({ description: "Meta rating based on tournament performance" })
  metaRating: number;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Card creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;

  @Column({ type: "text", nullable: true })
  @Index()
  @Field({ nullable: true })
  @ApiProperty({
    description: "Raw OCR text for full-text search",
    required: false,
  })
  rawOcrText?: string;

  // Computed field for search indexing
  @Field(() => String)
  get searchText(): string {
    return [
      this.name,
      this.type,
      this.element,
      this.rarity,
      this.description,
      this.flavorText,
      ...(this.keywords || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }
}
