import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Deck } from "../../decks/entities/deck.entity";
import { Tournament } from "../../tournaments/entities/tournament.entity";
import { TournamentProfile } from "../../progression/entities/tournament-profile.entity";

export enum UserRole {
  PLAYER = "player",
  JUDGE_L1 = "judge_l1",
  JUDGE_L2 = "judge_l2",
  JUDGE_L3 = "judge_l3",
  ADMIN = "admin",
  TOURNAMENT_ORGANIZER = "tournament_organizer",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  BANNED = "banned",
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  notifications: {
    email: boolean;
    push: boolean;
    tournament: boolean;
    deck: boolean;
    newCard: boolean;
    meta: boolean;
  };
  privacy: {
    showProfile: boolean;
    showDecks: boolean;
    showStats: boolean;
    showTournaments: boolean;
  };
  gameplay: {
    autoPassPriority: boolean;
    showStopWarnings: boolean;
    cardPreviewDelay: number;
    playSpeed: "slow" | "normal" | "fast";
  };
}

export interface UserStats {
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
  tournamentWins: number;
  tournamentTop8s: number;
  favoriteArchetype?: string;
  currentRank: number;
  peakRank: number;
  seasonalStats: {
    season: string;
    games: number;
    wins: number;
    rank: number;
  }[];
}

@Entity("users")
@ObjectType()
@Index(["email"], { unique: true })
@Index(["username"], { unique: true })
@Index(["role"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "User ID (UUID)" })
  id: string;

  @Column({ unique: true })
  @Field()
  @ApiProperty({ description: "Email address" })
  email: string;

  @Column({ unique: true })
  @Field()
  @ApiProperty({ description: "Username" })
  username: string;

  @Column()
  @ApiProperty({ description: "Hashed password" })
  passwordHash: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "First name", required: false })
  firstName?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Last name", required: false })
  lastName?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Avatar URL", required: false })
  avatarUrl?: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  @Field()
  @ApiProperty({ enum: UserRole, description: "User role" })
  role: UserRole;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @Field()
  @ApiProperty({ enum: UserStatus, description: "User status" })
  status: UserStatus;

  @Column({ default: true })
  @Field()
  @ApiProperty({ description: "Whether the account is active" })
  isActive: boolean;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: "Whether the email is verified" })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: "Email verification token" })
  emailVerificationToken?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: "Password reset token" })
  passwordResetToken?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: "Password reset expiry" })
  passwordResetExpiry?: Date;

  @Column({ default: 0 })
  @ApiProperty({ description: "Token version for invalidating tokens" })
  tokenVersion: number;

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "User preferences", required: false })
  preferences?: UserPreferences;

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "User statistics", required: false })
  stats?: UserStats;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Last login timestamp", required: false })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Discord user ID for linking", required: false })
  discordId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Google user ID for linking", required: false })
  googleId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Twitch username for streaming",
    required: false,
  })
  twitchUsername?: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "User bio/description", required: false })
  bio?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "User location", required: false })
  location?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "User timezone", required: false })
  timezone?: string;

  // Current ELO rating for matchmaking
  @Column({ type: "int", default: 1200 })
  @Field(() => Int)
  @ApiProperty({ description: "Current ELO rating" })
  eloRating: number;

  // Peak ELO rating achieved
  @Column({ type: "int", default: 1200 })
  @Field(() => Int)
  @ApiProperty({ description: "Peak ELO rating" })
  peakEloRating: number;

  // Judge certification level and expiry
  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Judge certification expiry", required: false })
  judgeCertificationExpiry?: Date;

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "Judge exam scores and history",
    required: false,
  })
  judgeExamHistory?: {
    level: string;
    score: number;
    date: Date;
    passed: boolean;
  }[];

  // Relations
  @OneToMany(() => Deck, (deck) => deck.user)
  @Field(() => [Deck], { nullable: true })
  @ApiProperty({
    description: "User decks",
    type: () => [Deck],
    required: false,
  })
  decks?: Deck[];

  @ManyToMany(() => Tournament, (tournament) => tournament.participants)
  @Field(() => [Tournament], { nullable: true })
  @ApiProperty({
    description: "Tournaments participated in",
    type: () => [Tournament],
    required: false,
  })
  tournaments?: Tournament[];

  @OneToMany(() => Tournament, (tournament) => tournament.organizer)
  @Field(() => [Tournament], { nullable: true })
  @ApiProperty({
    description: "Tournaments organized",
    type: () => [Tournament],
    required: false,
  })
  organizedTournaments?: Tournament[];

  // Tournament progression profile
  @Field(() => TournamentProfile, { nullable: true })
  tournamentProfile?: TournamentProfile;

  // Event-related relations
  organizedEvents?: any[];

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Account creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;

  // Computed fields
  @Field(() => String)
  get displayName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.username;
  }

  @Field(() => String)
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.username;
  }

  @Field(() => Boolean)
  get isJudge(): boolean {
    return [UserRole.JUDGE_L1, UserRole.JUDGE_L2, UserRole.JUDGE_L3].includes(
      this.role
    );
  }

  @Field(() => Int)
  get judgeLevel(): number {
    switch (this.role) {
      case UserRole.JUDGE_L1:
        return 1;
      case UserRole.JUDGE_L2:
        return 2;
      case UserRole.JUDGE_L3:
        return 3;
      default:
        return 0;
    }
  }

  @Field(() => String)
  get rankTier(): string {
    if (this.eloRating >= 2200) return "Mythic";
    if (this.eloRating >= 2000) return "Diamond";
    if (this.eloRating >= 1800) return "Platinum";
    if (this.eloRating >= 1600) return "Gold";
    if (this.eloRating >= 1400) return "Silver";
    return "Bronze";
  }
}
