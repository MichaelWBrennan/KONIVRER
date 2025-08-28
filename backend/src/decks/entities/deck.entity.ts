import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID, Int, Float } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import { Card } from "../../cards/entities/card.entity";

export enum DeckFormat {
  STANDARD = "Standard",
  CLASSIC = "Classic",
  DRAFT = "Draft",
  SEALED = "Sealed",
  COMMANDER = "Commander",
  PAUPER = "Pauper",
  LEGACY = "Legacy",
  MODERN = "Modern",
  PIONEER = "Pioneer",
}

export enum DeckVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
  UNLISTED = "unlisted",
  FRIENDS_ONLY = "friends_only",
}

export enum DeckArchetype {
  AGGRO = "Aggro",
  CONTROL = "Control",
  MIDRANGE = "Midrange",
  COMBO = "Combo",
  TEMPO = "Tempo",
  RAMP = "Ramp",
  BURN = "Burn",
  TRIBAL = "Tribal",
  TOOLBOX = "Toolbox",
  PRISON = "Prison",
}

export interface DeckStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  avgGameLength: number;
  popularMatchups: {
    archetype: string;
    games: number;
    wins: number;
    winRate: number;
  }[];
  metaPerformance: {
    tier: string;
    position: number;
    trending: "up" | "down" | "stable";
  };
}

interface DeckAnalytics {
  manaCurve: { cost: number; count: number }[];
  elementDistribution: { element: string; count: number; percentage: number }[];
  typeDistribution: { type: string; count: number; percentage: number }[];
  rarityDistribution: { rarity: string; count: number; percentage: number }[];
  avgManaCost: number;
  cardAdvantageRatio: number;
  removalCount: number;
  threatCount: number;
  consistencyScore: number;
  powerLevel: number;
}

interface DeckPricing {
  totalValue: number;
  currency: string;
  rareCount: number;
  mythicCount: number;
  priceHistory: {
    date: Date;
    price: number;
  }[];
  budgetAlternatives: {
    cardId: string;
    replacement: string;
    priceDifference: number;
  }[];
}

@Entity("decks")
@ObjectType()
@Index(["format", "visibility"]) // Composite index for common queries
@Index(["userId"]) // Index for user's decks
@Index(["archetype", "format"]) // Index for archetype searches
@Index(["metaRating"]) // Index for top decks
export class Deck {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Canonical deck ID (immutable UUID)" })
  id: string;

  @Column({ type: "varchar", length: 255 })
  @Field()
  @ApiProperty({ description: "Deck name" })
  name: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Deck description", required: false })
  description?: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Deck owner ID" })
  userId: string;

  @ManyToOne(() => User, (user) => user.decks)
  @JoinColumn({ name: "userId" })
  @Field(() => User)
  user: User;

  @Column({
    type: "enum",
    enum: DeckFormat,
    default: DeckFormat.STANDARD,
  })
  @Field()
  @ApiProperty({ enum: DeckFormat, description: "Tournament format" })
  format: DeckFormat;

  @Column({
    type: "enum",
    enum: DeckVisibility,
    default: DeckVisibility.PRIVATE,
  })
  @Field()
  @ApiProperty({ enum: DeckVisibility, description: "Deck visibility" })
  visibility: DeckVisibility;

  @Column({
    type: "enum",
    enum: DeckArchetype,
    nullable: true,
  })
  @Field({ nullable: true })
  @ApiProperty({
    enum: DeckArchetype,
    description: "Deck archetype",
    required: false,
  })
  archetype?: DeckArchetype;

  @Column({ type: "simple-json" })
  @Field(() => [DeckCard])
  @ApiProperty({
    description: "Mainboard cards with quantities",
    type: "array",
  })
  mainboard: DeckCard[];

  @Column({ type: "simple-json", nullable: true })
  @Field(() => [DeckCard], { nullable: true })
  @ApiProperty({
    description: "Sideboard cards with quantities",
    type: "array",
    required: false,
  })
  sideboard?: DeckCard[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Commander card ID (for Commander format)",
    required: false,
  })
  commanderId?: string;

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({
    description: "Primary colors/elements",
    type: [String],
    required: false,
  })
  colors?: string[];

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({
    description: "Deck tags and categories",
    type: [String],
    required: false,
  })
  tags?: string[];

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Deck statistics and performance",
    required: false,
  })
  stats?: DeckStats;

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Deck analytics and breakdown", required: false })
  analytics?: DeckAnalytics;

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Deck pricing information", required: false })
  pricing?: DeckPricing;

  @Column({ type: "float", default: 0 })
  @Field(() => Float)
  @ApiProperty({ description: "Meta rating (0-100)" })
  metaRating: number;

  @Column({ type: "float", default: 0 })
  @Field(() => Float)
  @ApiProperty({ description: "Power level rating (1-10)" })
  powerLevel: number;

  @Column({ type: "float", default: 0 })
  @Field(() => Float)
  @ApiProperty({ description: "Competitiveness score (0-100)" })
  competitivenessScore: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Number of likes/favorites" })
  likes: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Number of views" })
  views: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Number of copies made" })
  copies: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Number of comments" })
  commentCount: number;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether this is a featured/premium deck" })
  isFeatured: boolean;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether this deck is tournament legal" })
  isLegal: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Tournament this deck was used in",
    required: false,
  })
  tournamentId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Tournament placement", required: false })
  tournamentPlacement?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Original deck this was forked from",
    required: false,
  })
  parentDeckId?: string;

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({
    description: "Collaborators with edit access",
    type: [String],
    required: false,
  })
  collaborators?: string[];

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Version history", required: false })
  versionHistory?: {
    version: string;
    changes: string;
    date: Date;
    cardChanges: {
      added: { cardId: string; quantity: number }[];
      removed: { cardId: string; quantity: number }[];
      modified: { cardId: string; oldQuantity: number; newQuantity: number }[];
    };
  }[];

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Deck creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;

  // Computed fields
  @Field(() => Int)
  get totalCards(): number {
    return this.mainboard.reduce((total, card) => total + card.quantity, 0);
  }

  @Field(() => Int)
  get sideboardCount(): number {
    return (
      this.sideboard?.reduce((total, card) => total + card.quantity, 0) || 0
    );
  }

  @Field(() => Float)
  get averageManaCost(): number {
    if (!this.analytics) return 0;
    return this.analytics.avgManaCost;
  }

  @Field(() => String)
  get colorIdentity(): string {
    return this.colors?.join("") || "C";
  }

  @Field(() => Boolean)
  get isCommander(): boolean {
    return this.format === DeckFormat.COMMANDER && !!this.commanderId;
  }

  @Field(() => String)
  get deckHash(): string {
    // Generate a hash based on mainboard cards for duplicate detection
    const cardString = this.mainboard
      .sort((a, b) => a.cardId.localeCompare(b.cardId))
      .map((card) => `${card.cardId}:${card.quantity}`)
      .join("|");

    // Simple hash function - in production, use crypto
    let hash = 0;
    for (let i = 0; i < cardString.length; i++) {
      const char = cardString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
}

@ObjectType()
export class DeckCard {
  @Field(() => ID)
  @ApiProperty({ description: "Canonical card ID" })
  cardId: string;

  @Field(() => Int)
  @ApiProperty({ description: "Number of copies in deck (1-4 typically)" })
  quantity: number;

  @Field({ nullable: true })
  @ApiProperty({ description: "Card category/section", required: false })
  category?: string;

  @Field({ nullable: true })
  @ApiProperty({
    description: "Notes about this card inclusion",
    required: false,
  })
  notes?: string;

  @Field({ nullable: true })
  @ApiProperty({ description: "Price per card", required: false })
  price?: number;

  @Field({ nullable: true })
  @ApiProperty({
    description: "Whether this is a budget alternative",
    required: false,
  })
  isBudgetOption?: boolean;
}
