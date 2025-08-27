import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import { Deck } from "../../decks/entities/deck.entity";

export enum GameFormat {
  STANDARD = "Standard",
  CLASSIC = "Classic",
  DRAFT = "Draft",
  SEALED = "Sealed",
  COMMANDER = "Commander",
  CASUAL = "Casual",
}

export enum GameStatus {
  WAITING_FOR_PLAYERS = "Waiting for Players",
  MULLIGAN_PHASE = "Mulligan Phase",
  IN_PROGRESS = "In Progress",
  PAUSED = "Paused",
  COMPLETED = "Completed",
  ABANDONED = "Abandoned",
}

export enum GameType {
  RANKED = "Ranked",
  CASUAL = "Casual",
  TOURNAMENT = "Tournament",
  PRACTICE = "Practice",
}

export enum TurnPhase {
  START = "Start", // KONIVRER: Draw 2 cards first turn, place 1 Azoth
  MAIN = "Main", // KONIVRER: Play cards, resolve keywords
  COMBAT = "Combat", // KONIVRER: Attack with Familiars
  POST_COMBAT_MAIN = "Post-Combat Main", // KONIVRER: Play more cards
  REFRESH = "Refresh", // KONIVRER: Refresh Azoth sources
}

export enum Priority {
  PLAYER1 = "player1",
  PLAYER2 = "player2",
  NONE = "none",
}

interface GameSettings {
  timePerPlayer: number; // in minutes
  enableSpectators: boolean;
  enableChat: boolean;
  autoPassPriority: boolean;
  showHands: boolean; // for casual/practice games
  allowTakebacks: boolean;
  maxTakebacks: number;
}

interface GameState {
  currentTurn: number;
  activePlayer: string; // player ID
  priorityPlayer: string; // player ID
  currentPhase: TurnPhase;
  stack: StackEntry[];
  permanents: GamePermanent[];
  zones: {
    [playerId: string]: {
      deck: string[]; // KONIVRER: 40-card deck
      hand: string[]; // Cards in hand
      field: string[]; // KONIVRER: Main battlefield
      combatRow: string[]; // KONIVRER: Combat area
      azothRow: string[]; // KONIVRER: Resource area
      lifeCards: string[]; // KONIVRER: 4 life cards for damage
      flag: string; // KONIVRER: Single flag card (deck identity)
      removedFromPlay: string[]; // KONIVRER: Void zone
    };
  };
  players: {
    [playerId: string]: {
      lifeCardsRemaining: number; // KONIVRER: Damage tracking via life cards
      azothPool: AzothPool; // KONIVRER: Azoth resources
      counters: { [type: string]: number }; // +1 counters, etc.
      temporaryEffects: TemporaryEffect[];
    };
  };
  turnTimer: {
    [playerId: string]: number; // remaining time in seconds
  };
  gameActions: GameAction[]; // complete game history
}

interface StackEntry {
  id: string;
  cardId: string;
  controllerId: string;
  targets: string[];
  modes?: number[];
  xValue?: number;
  additionalCosts?: any[];
  timestamp: Date;
}

interface GamePermanent {
  id: string;
  cardId: string;
  controllerId: string;
  ownerId: string;
  tapped: boolean;
  summoned: boolean; // summoning sickness
  strength: number; // KONIVRER: Current strength
  baseStrength: number; // KONIVRER: Base strength
  plusOneCounters: number; // KONIVRER: +1 counters from Summon
  damage: number;
  attachedTo?: string; // for auras/equipment
  abilities: string[];
  konivrKeywords: string[]; // KONIVRER-specific keywords
  zone: "field" | "combatRow" | "azothRow"; // KONIVRER zones
}

interface AzothPool {
  fire: number; // 🜂
  water: number; // 🜄
  earth: number; // 🜃
  air: number; // 🜁
  aether: number; // ⭘
  nether: number; // ▢
  generic: number; // ✡⃝
}

interface TemporaryEffect {
  id: string;
  sourceId: string;
  effect: string;
  duration:
    | "end_of_turn"
    | "until_end_of_combat"
    | "permanent"
    | "until_leaves_battlefield";
  expiresAt?: Date;
}

interface GameAction {
  id: string;
  playerId: string;
  type: string;
  timestamp: Date;
  data: any;
  description: string;
}

@Entity("games")
@ObjectType()
@Index(["status"])
@Index(["createdAt"])
export class Game {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Game ID" })
  id: string;

  @Column({
    type: "enum",
    enum: GameFormat,
    default: GameFormat.CASUAL,
  })
  @Field()
  @ApiProperty({ enum: GameFormat, description: "Game format" })
  format: GameFormat;

  @Column({
    type: "enum",
    enum: GameStatus,
    default: GameStatus.WAITING_FOR_PLAYERS,
  })
  @Field()
  @ApiProperty({ enum: GameStatus, description: "Game status" })
  status: GameStatus;

  @Column({
    type: "enum",
    enum: GameType,
    default: GameType.CASUAL,
  })
  @Field()
  @ApiProperty({ enum: GameType, description: "Game type" })
  type: GameType;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Player 1 ID" })
  player1Id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "player1Id" })
  @Field(() => User)
  player1: User;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({ description: "Player 2 ID", required: false })
  player2Id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "player2Id" })
  @Field(() => User, { nullable: true })
  player2?: User;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({ description: "Player 1 deck ID", required: false })
  player1DeckId?: string;

  @ManyToOne(() => Deck)
  @JoinColumn({ name: "player1DeckId" })
  @Field(() => Deck, { nullable: true })
  player1Deck?: Deck;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({ description: "Player 2 deck ID", required: false })
  player2DeckId?: string;

  @ManyToOne(() => Deck)
  @JoinColumn({ name: "player2DeckId" })
  @Field(() => Deck, { nullable: true })
  player2Deck?: Deck;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Winner player ID", required: false })
  winnerId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "How the game ended", required: false })
  winCondition?: string;

  @Column({ type: "json" })
  @Field()
  @ApiProperty({ description: "Game settings" })
  settings: GameSettings;

  @Column({ type: "json" })
  @Field()
  @ApiProperty({ description: "Current game state" })
  gameState: GameState;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Game start time", required: false })
  startedAt?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Game end time", required: false })
  endedAt?: Date;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({
    description: "Associated tournament match ID",
    required: false,
  })
  tournamentMatchId?: string;

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({
    description: "Spectator user IDs",
    type: [String],
    required: false,
  })
  spectators?: string[];

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Game creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;

  // Computed fields
  @Field(() => Int)
  get currentTurn(): number {
    return this.gameState?.currentTurn || 0;
  }

  @Field(() => String)
  get currentPhase(): string {
    return this.gameState?.currentPhase || TurnPhase.START;
  }

  @Field(() => String)
  get activePlayer(): string {
    return this.gameState?.activePlayer || this.player1Id;
  }

  @Field(() => Int)
  get durationMinutes(): number {
    if (!this.startedAt) return 0;
    const endTime = this.endedAt || new Date();
    return Math.floor(
      (endTime.getTime() - this.startedAt.getTime()) / (1000 * 60)
    );
  }

  @Field(() => Boolean)
  get isComplete(): boolean {
    return this.status === GameStatus.COMPLETED;
  }

  @Field(() => Int)
  get spectatorCount(): number {
    return this.spectators?.length || 0;
  }
}

@Entity("game_replays")
@ObjectType()
@Index(["gameId"])
export class GameReplay {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Replay ID" })
  id: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Game ID" })
  gameId: string;

  @ManyToOne(() => Game)
  @JoinColumn({ name: "gameId" })
  @Field(() => Game)
  game: Game;

  @Column({ type: "json" })
  @Field()
  @ApiProperty({ description: "Complete game action history" })
  actions: GameAction[];

  @Column({ type: "json" })
  @Field()
  @ApiProperty({ description: "Game state snapshots at key moments" })
  snapshots: any[];

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Number of times this replay has been viewed" })
  views: number;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether this replay is featured" })
  isFeatured: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Replay title/description", required: false })
  title?: string;

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({ description: "Replay tags", type: [String], required: false })
  tags?: string[];

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Replay creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;
}

// Export types for use in other modules
export type {
  GameSettings,
  GameState,
  StackEntry,
  GamePermanent,
  AzothPool,
  TemporaryEffect,
  GameAction,
};

export { TurnPhase, Priority };
