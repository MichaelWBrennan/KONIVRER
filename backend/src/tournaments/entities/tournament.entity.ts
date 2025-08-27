import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { ObjectType, Field, ID, Int, Float } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import { Deck } from "../../decks/entities/deck.entity";

export enum TournamentFormat {
  STANDARD = "Standard",
  CLASSIC = "Classic",
  DRAFT = "Draft",
  SEALED = "Sealed",
  COMMANDER = "Commander",
  PAUPER = "Pauper",
  LEGACY = "Legacy",
  MODERN = "Modern",
}

export enum TournamentType {
  SWISS = "Swiss",
  SINGLE_ELIMINATION = "Single Elimination",
  DOUBLE_ELIMINATION = "Double Elimination",
  ROUND_ROBIN = "Round Robin",
  SEALED_DECK = "Sealed Deck",
  DRAFT_PODS = "Draft Pods",
}

export enum TournamentStatus {
  SCHEDULED = "Scheduled",
  REGISTRATION_OPEN = "Registration Open",
  REGISTRATION_CLOSED = "Registration Closed",
  IN_PROGRESS = "In Progress",
  PAUSED = "Paused",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum TournamentVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
  INVITE_ONLY = "invite_only",
}

interface TournamentSettings {
  maxPlayers: number;
  minPlayers: number;
  numberOfRounds?: number;
  swissRounds?: number;
  playoffRounds?: number;
  timeLimit?: number; // in minutes
  registrationDeadline?: Date;
  allowDrops: boolean;
  allowSpectators: boolean;
  requireDeckList: boolean;
  deckListDeadline?: Date;
  prizesEnabled: boolean;
  entryFee?: number;
  currency?: string;
}

interface TournamentPrizing {
  totalPrizePool: number;
  currency: string;
  distribution: {
    place: number;
    amount: number;
    percentage: number;
  }[];
  sponsorships: {
    sponsor: string;
    contribution: number;
    benefits: string[];
  }[];
}

interface TournamentStats {
  totalPlayers: number;
  completedRounds: number;
  averageMatchLength: number;
  archetypeBreakdown: {
    archetype: string;
    count: number;
    percentage: number;
    winRate: number;
  }[];
  popularCards: {
    cardId: string;
    count: number;
    playRate: number;
  }[];
}

@Entity("tournaments")
@ObjectType()
@Index(["format", "status"])
@Index(["startDate"])
@Index(["organizerId"])
export class Tournament {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Tournament ID" })
  id: string;

  @Column()
  @Field()
  @ApiProperty({ description: "Tournament name" })
  name: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Tournament description", required: false })
  description?: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Tournament organizer ID" })
  organizerId: string;

  @ManyToOne(() => User, (user) => user.organizedTournaments)
  @JoinColumn({ name: "organizerId" })
  @Field(() => User)
  @ApiProperty({ description: "Tournament organizer" })
  organizer: User;

  @Column({
    type: "enum",
    enum: TournamentFormat,
  })
  @Field()
  @ApiProperty({ enum: TournamentFormat, description: "Tournament format" })
  format: TournamentFormat;

  @Column({
    type: "enum",
    enum: TournamentType,
  })
  @Field()
  @ApiProperty({
    enum: TournamentType,
    description: "Tournament type/structure",
  })
  type: TournamentType;

  @Column({
    type: "enum",
    enum: TournamentStatus,
    default: TournamentStatus.SCHEDULED,
  })
  @Field()
  @ApiProperty({ enum: TournamentStatus, description: "Tournament status" })
  status: TournamentStatus;

  @Column({
    type: "enum",
    enum: TournamentVisibility,
    default: TournamentVisibility.PUBLIC,
  })
  @Field()
  @ApiProperty({
    enum: TournamentVisibility,
    description: "Tournament visibility",
  })
  visibility: TournamentVisibility;

  @Column({ type: "timestamp" })
  @Field()
  @ApiProperty({ description: "Tournament start date/time" })
  startDate: Date;

  @Column({ type: "timestamp", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Tournament end date/time", required: false })
  endDate?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Tournament location (for in-person events)",
    required: false,
  })
  location?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Timezone for the tournament", required: false })
  timezone?: string;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether this is an online tournament" })
  isOnline: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Stream/broadcast URL", required: false })
  streamUrl?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Tournament banner image URL", required: false })
  bannerUrl?: string;

  @Column({ type: "json" })
  @Field()
  @ApiProperty({ description: "Tournament settings and rules" })
  settings: TournamentSettings;

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Prize structure", required: false })
  prizing?: TournamentPrizing;

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Tournament statistics", required: false })
  stats?: TournamentStats;

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({
    description: "Tournament tags",
    type: [String],
    required: false,
  })
  tags?: string[];

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({
    description: "Judge user IDs",
    type: [String],
    required: false,
  })
  judges?: string[];

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Current round number" })
  currentRound: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Total number of rounds" })
  totalRounds: number;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether the tournament is featured" })
  isFeatured: boolean;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether the tournament is sanctioned/official" })
  isSanctioned: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Sanctioning organization", required: false })
  sanctioningOrg?: string;

  // Relations
  @ManyToMany(() => User, (user) => user.tournaments)
  @JoinTable({
    name: "tournament_participants",
    joinColumn: { name: "tournamentId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  @Field(() => [User], { nullable: true })
  @ApiProperty({
    description: "Tournament participants",
    type: () => [User],
    required: false,
  })
  participants?: User[];

  @OneToMany(() => TournamentMatch, (match) => match.tournament)
  @Field(() => [TournamentMatch], { nullable: true })
  @ApiProperty({
    description: "Tournament matches",
    type: () => [TournamentMatch],
    required: false,
  })
  matches?: TournamentMatch[];

  @OneToMany(() => TournamentStanding, (standing) => standing.tournament)
  @Field(() => [TournamentStanding], { nullable: true })
  @ApiProperty({
    description: "Tournament standings",
    type: () => [TournamentStanding],
    required: false,
  })
  standings?: TournamentStanding[];

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Tournament creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;

  // Computed fields
  @Field(() => Int)
  get registeredPlayers(): number {
    return this.participants?.length || 0;
  }

  @Field(() => Boolean)
  get isRegistrationOpen(): boolean {
    return this.status === TournamentStatus.REGISTRATION_OPEN;
  }

  @Field(() => Boolean)
  get hasStarted(): boolean {
    return [TournamentStatus.IN_PROGRESS, TournamentStatus.COMPLETED].includes(
      this.status
    );
  }

  @Field(() => Boolean)
  get isComplete(): boolean {
    return this.status === TournamentStatus.COMPLETED;
  }

  @Field(() => String)
  get durationEstimate(): string {
    if (!this.settings.timeLimit || !this.totalRounds) return "TBD";

    const estimatedMinutes =
      this.totalRounds * this.settings.timeLimit + (this.totalRounds - 1) * 10; // 10 min between rounds
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;

    return `${hours}h ${minutes}m`;
  }
}

@Entity("tournament_matches")
@ObjectType()
@Index(["tournamentId", "round"])
export class TournamentMatch {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Match ID" })
  id: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Tournament ID" })
  tournamentId: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  @JoinColumn({ name: "tournamentId" })
  @Field(() => Tournament)
  tournament: Tournament;

  @Column()
  @Field(() => Int)
  @ApiProperty({ description: "Round number" })
  round: number;

  @Column()
  @Field(() => Int)
  @ApiProperty({ description: "Match number within round" })
  matchNumber: number;

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
  @ApiProperty({ description: "Player 2 ID (null for bye)", required: false })
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

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Player 1 wins" })
  player1Wins: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Player 2 wins" })
  player2Wins: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Number of draws" })
  draws: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Match result (winner)", required: false })
  result?: string; // 'player1' | 'player2' | 'draw' | 'bye'

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether the match is complete" })
  isComplete: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Match start time", required: false })
  startTime?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Match end time", required: false })
  endTime?: Date;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({ description: "Assigned judge ID", required: false })
  judgeId?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "judgeId" })
  @Field(() => User, { nullable: true })
  judge?: User;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Match notes or judge comments",
    required: false,
  })
  notes?: string;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Match creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;

  // Computed fields
  @Field(() => String)
  get matchResult(): string {
    if (!this.isComplete) return "In Progress";
    if (this.result === "bye") return "Bye";
    if (this.result === "draw") return "Draw";
    return this.result === "player1"
      ? `${this.player1.username} wins ${this.player1Wins}-${this.player2Wins}`
      : `${this.player2?.username} wins ${this.player2Wins}-${this.player1Wins}`;
  }

  @Field(() => Int)
  get durationMinutes(): number {
    if (!this.startTime || !this.endTime) return 0;
    return Math.floor(
      (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60)
    );
  }
}

@Entity("tournament_standings")
@ObjectType()
@Index(["tournamentId", "position"])
export class TournamentStanding {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Standing ID" })
  id: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Tournament ID" })
  tournamentId: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.standings)
  @JoinColumn({ name: "tournamentId" })
  @Field(() => Tournament)
  tournament: Tournament;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Player ID" })
  playerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "playerId" })
  @Field(() => User)
  player: User;

  @Column()
  @Field(() => Int)
  @ApiProperty({ description: "Current position/rank" })
  position: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Match points (wins * 3 + draws * 1)" })
  matchPoints: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Game points" })
  gamePoints: number;

  @Column({ type: "float", default: 0 })
  @Field(() => Float)
  @ApiProperty({ description: "Opponent match win percentage (OMW%)" })
  opponentMatchWinPercentage: number;

  @Column({ type: "float", default: 0 })
  @Field(() => Float)
  @ApiProperty({ description: "Game win percentage (GW%)" })
  gameWinPercentage: number;

  @Column({ type: "float", default: 0 })
  @Field(() => Float)
  @ApiProperty({ description: "Opponent game win percentage (OGW%)" })
  opponentGameWinPercentage: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Number of wins" })
  wins: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Number of losses" })
  losses: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Number of draws" })
  draws: number;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether player has dropped" })
  hasDropped: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Round when player dropped", required: false })
  droppedInRound?: number;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Standing creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;

  // Computed fields
  @Field(() => String)
  get record(): string {
    return `${this.wins}-${this.losses}-${this.draws}`;
  }

  @Field(() => Float)
  get winPercentage(): number {
    const totalMatches = this.wins + this.losses + this.draws;
    if (totalMatches === 0) return 0;
    return ((this.wins + this.draws * 0.5) / totalMatches) * 100;
  }
}
