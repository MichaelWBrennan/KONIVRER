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
import { ObjectType, Field, ID, Int, Float } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";

export enum EventFormat {
  STANDARD = "Standard",
  CLASSIC = "Classic",
  DRAFT = "Draft",
  SEALED = "Sealed",
  COMMANDER = "Commander",
  PAUPER = "Pauper",
  LEGACY = "Legacy",
  MODERN = "Modern",
}

export enum PairingType {
  SWISS = "Swiss",
  SINGLE_ELIMINATION = "Single-Elimination",
  ROUND_ROBIN = "Round-Robin",
  ROUND_ROBIN_TOP_X = "Round-Robin→Top-X",
}

export enum EventStatus {
  SCHEDULED = "Scheduled",
  REGISTRATION_OPEN = "Registration Open",
  REGISTRATION_CLOSED = "Registration Closed",
  IN_PROGRESS = "In Progress",
  PAUSED = "Paused",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum VenueType {
  ONLINE = "online",
  OFFLINE = "offline",
  HYBRID = "hybrid",
}

interface EventSettings {
  maxPlayers: number;
  minPlayers: number;
  registrationWindow: {
    start: Date;
    end: Date;
  };
  buyIn?: number;
  currency?: string;
  rulesetVersion: string;
  rounds?: number;
  timeControl?: number; // minutes per round
  tieBreakRules: string[];
  allowDrops: boolean;
  allowSpectators: boolean;
  requireDeckList: boolean;
  deckListDeadline?: Date;
  lateRegistration: boolean;
  judgeNotifications: boolean;
  streamEnabled: boolean;
}

interface VenueInfo {
  type: VenueType;
  location?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  onlineUrl?: string;
  streamUrl?: string;
  capacity?: number;
  amenities?: string[];
}

@Entity("events")
@ObjectType()
@Index(["format", "status"])
@Index(["startAt"])
@Index(["organizerId"])
@Index(["venue.type"])
export class Event {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Event ID" })
  id: string;

  @Column({ type: "varchar", length: 255 })
  @Field()
  @ApiProperty({ description: "Event name" })
  name: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Event description", required: false })
  description?: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Event organizer ID" })
  organizerId: string;

  @ManyToOne(() => User, (user) => user.organizedEvents)
  @JoinColumn({ name: "organizerId" })
  @Field(() => User)
  @ApiProperty({ description: "Event organizer" })
  organizer: User;

  @Column({
    type: "enum",
    enum: EventFormat,
  })
  @Field()
  @ApiProperty({ enum: EventFormat, description: "Event format" })
  format: EventFormat;

  @Column({
    type: "enum",
    enum: PairingType,
  })
  @Field()
  @ApiProperty({ enum: PairingType, description: "Pairing type/algorithm" })
  pairingType: PairingType;

  @Column({
    type: "enum",
    enum: EventStatus,
    default: EventStatus.SCHEDULED,
  })
  @Field()
  @ApiProperty({ enum: EventStatus, description: "Event status" })
  status: EventStatus;

  @Column({ type: "timestamp" })
  @Field()
  @ApiProperty({ description: "Event start date/time" })
  startAt: Date;

  @Column({ type: "timestamp", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Event end date/time", required: false })
  endAt?: Date;

  @Column({ type: "jsonb" })
  @Field()
  @ApiProperty({ description: "Venue information" })
  venue: VenueInfo;

  @Column({ type: "jsonb" })
  @Field()
  @ApiProperty({ description: "Event settings and configuration" })
  settings: EventSettings;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Current round number" })
  currentRound: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Total number of rounds" })
  totalRounds: number;

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({
    description: "Judge user IDs",
    type: [String],
    required: false,
  })
  judges?: string[];

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether the event is featured" })
  isFeatured: boolean;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether the event is sanctioned/official" })
  isSanctioned: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Sanctioning organization", required: false })
  sanctioningOrg?: string;

  // Relations
  @OneToMany(() => EventRegistration, (registration) => registration.event)
  @Field(() => [EventRegistration], { nullable: true })
  @ApiProperty({
    description: "Event registrations",
    type: () => [EventRegistration],
    required: false,
  })
  registrations?: EventRegistration[];

  @OneToMany(() => Pairing, (pairing) => pairing.event)
  @Field(() => [Pairing], { nullable: true })
  @ApiProperty({
    description: "Event pairings",
    type: () => [Pairing],
    required: false,
  })
  pairings?: Pairing[];

  @OneToMany(() => Match, (match) => match.event)
  @Field(() => [Match], { nullable: true })
  @ApiProperty({
    description: "Event matches",
    type: () => [Match],
    required: false,
  })
  matches?: Match[];

  @OneToMany(() => AuditLog, (log) => log.event)
  @Field(() => [AuditLog], { nullable: true })
  @ApiProperty({
    description: "Event audit logs",
    type: () => [AuditLog],
    required: false,
  })
  auditLogs?: AuditLog[];

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Event creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;

  // Computed fields
  @Field(() => Int)
  get registeredPlayers(): number {
    return this.registrations?.filter((r) => !r.isWaitlisted).length || 0;
  }

  @Field(() => Int)
  get waitlistedPlayers(): number {
    return this.registrations?.filter((r) => r.isWaitlisted).length || 0;
  }

  @Field(() => Boolean)
  get isRegistrationOpen(): boolean {
    const now = new Date();
    return (
      this.status === EventStatus.REGISTRATION_OPEN &&
      now >= this.settings.registrationWindow.start &&
      now <= this.settings.registrationWindow.end
    );
  }

  @Field(() => Boolean)
  get hasStarted(): boolean {
    return [EventStatus.IN_PROGRESS, EventStatus.COMPLETED].includes(
      this.status
    );
  }

  @Field(() => Boolean)
  get isComplete(): boolean {
    return this.status === EventStatus.COMPLETED;
  }
}

@Entity("event_registrations")
@ObjectType()
@Index(["eventId", "userId"], { unique: true })
@Index(["eventId", "checkedInAt"])
export class EventRegistration {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Registration ID" })
  id: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Event ID" })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.registrations)
  @JoinColumn({ name: "eventId" })
  @Field(() => Event)
  event: Event;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "User ID" })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  @Field(() => User)
  user: User;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({ description: "Team ID (for team events)", required: false })
  teamId?: string;

  @Column({ type: "timestamp", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Check-in timestamp", required: false })
  checkedInAt?: Date;

  @Column({ type: "float", default: 0 })
  @Field(() => Float)
  @ApiProperty({ description: "Seed value for initial pairings" })
  seedValue: number;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether player is on waitlist" })
  isWaitlisted: boolean;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({
    description: "Deck ID (if deck list required)",
    required: false,
  })
  deckId?: string;

  @Column({ type: "jsonb", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Additional registration metadata",
    required: false,
  })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Registration timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;

  // Computed fields
  @Field(() => Boolean)
  get isCheckedIn(): boolean {
    return !!this.checkedInAt;
  }
}

@Entity("pairings")
@ObjectType()
@Index(["eventId", "roundNumber"])
@Index(["eventId", "publishedAt"])
export class Pairing {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Pairing ID" })
  id: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Event ID" })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.pairings)
  @JoinColumn({ name: "eventId" })
  @Field(() => Event)
  event: Event;

  @Column()
  @Field(() => Int)
  @ApiProperty({ description: "Round number" })
  roundNumber: number;

  @Column()
  @Field(() => Int)
  @ApiProperty({ description: "Table number" })
  tableNumber: number;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Player A ID" })
  playerAId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "playerAId" })
  @Field(() => User)
  playerA: User;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({ description: "Player B ID (null for bye)", required: false })
  playerBId?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "playerBId" })
  @Field(() => User, { nullable: true })
  playerB?: User;

  @Column({ type: "jsonb", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Pairing metadata (match quality, etc.)",
    required: false,
  })
  pairingMetadata?: Record<string, any>;

  @Column({ type: "timestamp", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "When pairing was published to players",
    required: false,
  })
  publishedAt?: Date;

  @OneToMany(() => Match, (match) => match.pairing)
  @Field(() => [Match], { nullable: true })
  @ApiProperty({
    description: "Matches for this pairing",
    type: () => [Match],
    required: false,
  })
  matches?: Match[];

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Pairing creation timestamp" })
  createdAt: Date;

  // Computed fields
  @Field(() => Boolean)
  get isPublished(): boolean {
    return !!this.publishedAt;
  }

  @Field(() => Boolean)
  get isBye(): boolean {
    return !this.playerBId;
  }
}

export enum MatchResult {
  WIN = "win",
  LOSS = "loss",
  DRAW = "draw",
  CONCESSION = "concession",
  TIMEOUT = "timeout",
  BYE = "bye",
  PENALTY = "penalty",
}

export enum MatchStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  DISPUTED = "disputed",
  CANCELLED = "cancelled",
}

@Entity("matches")
@ObjectType()
@Index(["eventId", "round"])
@Index(["pairingId"])
@Index(["status"])
export class Match {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Match ID" })
  id: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Pairing ID" })
  pairingId: string;

  @ManyToOne(() => Pairing, (pairing) => pairing.matches)
  @JoinColumn({ name: "pairingId" })
  @Field(() => Pairing)
  pairing: Pairing;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Event ID" })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.matches)
  @JoinColumn({ name: "eventId" })
  @Field(() => Event)
  event: Event;

  @Column()
  @Field(() => Int)
  @ApiProperty({ description: "Round number" })
  round: number;

  @Column({
    type: "enum",
    enum: MatchResult,
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  @ApiProperty({
    enum: MatchResult,
    description: "Player A result",
    required: false,
  })
  playerAResult?: MatchResult;

  @Column({
    type: "enum",
    enum: MatchResult,
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  @ApiProperty({
    enum: MatchResult,
    description: "Player B result",
    required: false,
  })
  playerBResult?: MatchResult;

  @Column({
    type: "enum",
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  @Field()
  @ApiProperty({ enum: MatchStatus, description: "Match status" })
  status: MatchStatus;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({ description: "User who reported the result", required: false })
  reportedBy?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "reportedBy" })
  @Field(() => User, { nullable: true })
  reporter?: User;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({
    description: "Judge who confirmed the result",
    required: false,
  })
  confirmedByJudge?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "confirmedByJudge" })
  @Field(() => User, { nullable: true })
  confirmingJudge?: User;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({ description: "Simulator replay ID", required: false })
  replayId?: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Match notes", required: false })
  notes?: string;

  @Column({ type: "jsonb", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Additional match metadata", required: false })
  metadata?: Record<string, any>;

  @OneToMany(() => Judging, (judging) => judging.match)
  @Field(() => [Judging], { nullable: true })
  @ApiProperty({
    description: "Judge rulings for this match",
    type: () => [Judging],
    required: false,
  })
  judgings?: Judging[];

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Match creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;

  // Computed fields
  @Field(() => Boolean)
  get isComplete(): boolean {
    return this.status === MatchStatus.COMPLETED;
  }

  @Field(() => Boolean)
  get isDisputed(): boolean {
    return this.status === MatchStatus.DISPUTED;
  }
}

@Entity("judgings")
@ObjectType()
@Index(["matchId"])
@Index(["judgeId"])
export class Judging {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Judging ID" })
  id: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Match ID" })
  matchId: string;

  @ManyToOne(() => Match, (match) => match.judgings)
  @JoinColumn({ name: "matchId" })
  @Field(() => Match)
  match: Match;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Judge ID" })
  judgeId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "judgeId" })
  @Field(() => User)
  judge: User;

  @Column({ type: "text" })
  @Field()
  @ApiProperty({ description: "Ruling text and explanation" })
  rulingText: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Penalty applied (if any)", required: false })
  penalty?: string;

  @Column({ type: "simple-array", nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({
    description: "Attachment URLs (screenshots, etc.)",
    type: [String],
    required: false,
  })
  attachments?: string[];

  @Column({ type: "jsonb", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Additional ruling metadata", required: false })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Judging creation timestamp" })
  createdAt: Date;
}

export enum AuditAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  REGISTER = "register",
  UNREGISTER = "unregister",
  CHECKIN = "checkin",
  GENERATE_PAIRINGS = "generate_pairings",
  PUBLISH_PAIRINGS = "publish_pairings",
  REPORT_RESULT = "report_result",
  CONFIRM_RESULT = "confirm_result",
  APPLY_RULING = "apply_ruling",
  DROP_PLAYER = "drop_player",
}

@Entity("audit_logs")
@ObjectType()
@Index(["entityType", "entityId"])
@Index(["actorId"])
@Index(["timestamp"])
@Index(["provenanceHash"])
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Audit log ID" })
  id: string;

  @Column()
  @Field()
  @ApiProperty({ description: "Type of entity being audited" })
  entityType: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "ID of entity being audited" })
  entityId: string;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({ description: "Event ID (if applicable)", required: false })
  eventId?: string;

  @ManyToOne(() => Event, (event) => event.auditLogs)
  @JoinColumn({ name: "eventId" })
  @Field(() => Event, { nullable: true })
  event?: Event;

  @Column({
    type: "enum",
    enum: AuditAction,
  })
  @Field()
  @ApiProperty({ enum: AuditAction, description: "Action performed" })
  action: AuditAction;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Actor who performed the action" })
  actorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "actorId" })
  @Field(() => User)
  actor: User;

  @Column({ type: "jsonb" })
  @Field()
  @ApiProperty({ description: "Action metadata and details" })
  metadataJson: Record<string, any>;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Field()
  @ApiProperty({ description: "Action timestamp" })
  timestamp: Date;

  @Column()
  @Field()
  @ApiProperty({ description: "Provenance hash for integrity verification" })
  provenanceHash: string;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Log creation timestamp" })
  createdAt: Date;
}
