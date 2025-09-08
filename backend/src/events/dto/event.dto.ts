import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsDate,
  IsBoolean,
  IsNumber,
  IsObject,
  IsArray,
  ValidateNested,
  Min,
  Max,
  ArrayMinSize,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { InputType, Field, ID, Int, Float } from "@nestjs/graphql";
import {
  EventFormat,
  PairingType,
  EventStatus,
  VenueType,
  MatchResult,
  MatchStatus,
} from "../entities/event.entity";

// Event Management DTOs
@InputType()
export class EventSettingsDto {
  @Field(() => Int)
  @ApiProperty({ description: "Maximum number of players" })
  @IsNumber()
  @Min(2)
  @Max(1024)
  maxPlayers: number;

  @Field(() => Int)
  @ApiProperty({ description: "Minimum number of players" })
  @IsNumber()
  @Min(2)
  minPlayers: number;

  @Field()
  @ApiProperty({ description: "Registration window start time" })
  @IsDate()
  @Type(() => Date)
  registrationWindowStart: Date;

  @Field()
  @ApiProperty({ description: "Registration window end time" })
  @IsDate()
  @Type(() => Date)
  registrationWindowEnd: Date;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Entry fee amount" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  buyIn?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Currency for entry fee" })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field()
  @ApiProperty({ description: "Ruleset version" })
  @IsString()
  rulesetVersion: string;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ description: "Number of rounds (if fixed)" })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  rounds?: number;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ description: "Time control per round in minutes" })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(180)
  timeControl?: number;

  @Field(() => [String])
  @ApiProperty({
    description: "Tie-break rules in order of precedence",
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tieBreakRules: string[];

  @Field()
  @ApiProperty({ description: "Whether players can drop from the event" })
  @IsBoolean()
  allowDrops: boolean;

  @Field()
  @ApiProperty({ description: "Whether spectators are allowed" })
  @IsBoolean()
  allowSpectators: boolean;

  @Field()
  @ApiProperty({ description: "Whether deck lists are required" })
  @IsBoolean()
  requireDeckList: boolean;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Deck list submission deadline" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deckListDeadline?: Date;

  @Field()
  @ApiProperty({ description: "Whether late registration is allowed" })
  @IsBoolean()
  lateRegistration: boolean;

  @Field()
  @ApiProperty({ description: "Whether to send judge notifications" })
  @IsBoolean()
  judgeNotifications: boolean;

  @Field()
  @ApiProperty({ description: "Whether streaming is enabled" })
  @IsBoolean()
  streamEnabled: boolean;
}

@InputType()
export class VenueInfoDto {
  @Field()
  @ApiProperty({ enum: VenueType, description: "Venue type" })
  @IsEnum(VenueType)
  type: VenueType;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Venue location name" })
  @IsOptional()
  @IsString()
  location?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Venue address" })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Latitude coordinate" })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Longitude coordinate" })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Online event URL" })
  @IsOptional()
  @IsString()
  onlineUrl?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Stream URL" })
  @IsOptional()
  @IsString()
  streamUrl?: string;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ description: "Venue capacity" })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @Field(() => [String], { nullable: true })
  @ApiPropertyOptional({ description: "Venue amenities", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}

@InputType()
export class CreateEventDto {
  @Field()
  @ApiProperty({ description: "Event name" })
  @IsString()
  name: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Event description" })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @ApiProperty({ enum: EventFormat, description: "Event format" })
  @IsEnum(EventFormat)
  format: EventFormat;

  @Field()
  @ApiProperty({ enum: PairingType, description: "Pairing algorithm" })
  @IsEnum(PairingType)
  pairingType: PairingType;

  @Field()
  @ApiProperty({ description: "Event start time" })
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Event end time" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endAt?: Date;

  @Field()
  @ApiProperty({ description: "Venue information" })
  @ValidateNested()
  @Type(() => VenueInfoDto)
  venue: VenueInfoDto;

  @Field()
  @ApiProperty({ description: "Event settings" })
  @ValidateNested()
  @Type(() => EventSettingsDto)
  settings: EventSettingsDto;

  @Field(() => [String], { nullable: true })
  @ApiPropertyOptional({ description: "Judge user IDs", type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  judges?: string[];

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Sanctioning organization" })
  @IsOptional()
  @IsString()
  sanctioningOrg?: string;
}

@InputType()
export class UpdateEventDto {
  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Event name" })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Event description" })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ enum: EventStatus, description: "Event status" })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Event start time" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startAt?: Date;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Event end time" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endAt?: Date;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Venue information" })
  @IsOptional()
  @ValidateNested()
  @Type(() => VenueInfoDto)
  venue?: VenueInfoDto;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Event settings" })
  @IsOptional()
  @ValidateNested()
  @Type(() => EventSettingsDto)
  settings?: EventSettingsDto;

  @Field(() => [String], { nullable: true })
  @ApiPropertyOptional({ description: "Judge user IDs", type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  judges?: string[];
}

// Registration DTOs
@InputType()
export class RegisterForEventDto {
  @Field(() => ID, { nullable: true })
  @ApiPropertyOptional({ description: "Team ID (for team events)" })
  @IsOptional()
  @IsUUID("4")
  teamId?: string;

  @Field(() => ID, { nullable: true })
  @ApiPropertyOptional({ description: "Deck ID (if deck list required)" })
  @IsOptional()
  @IsUUID("4")
  deckId?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Additional registration metadata" })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

@InputType()
export class CheckInPlayerDto {
  @Field(() => ID)
  @ApiProperty({ description: "User ID to check in" })
  @IsUUID("4")
  userId: string;

  @Field(() => Float, { nullable: true })
  @ApiPropertyOptional({ description: "Manual seed value" })
  @IsOptional()
  @IsNumber()
  seedValue?: number;
}

// Pairing DTOs
@InputType()
export class GeneratePairingsDto {
  @Field(() => [ID])
  @ApiProperty({ description: "Player IDs to pair", type: [String] })
  @IsArray()
  @ArrayMinSize(2)
  @IsUUID("4", { each: true })
  playerIds: string[];

  @Field()
  @ApiProperty({ description: "Event format for matchmaking" })
  @IsString()
  format: string;

  @Field(() => [[String]], { nullable: true })
  @ApiPropertyOptional({
    description: "Previous pairings to avoid",
    type: [[String]],
  })
  @IsOptional()
  @IsArray()
  previousPairings?: string[][];

  @Field(() => ID, { nullable: true })
  @ApiPropertyOptional({ description: "Event ID" })
  @IsOptional()
  @IsUUID("4")
  eventId?: string;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ description: "Round number" })
  @IsOptional()
  @IsNumber()
  @Min(1)
  round?: number;
}

// Match Result DTOs
@InputType()
export class ReportMatchResultDto {
  @Field()
  @ApiProperty({ enum: MatchResult, description: "Player A result" })
  @IsEnum(MatchResult)
  playerAResult: MatchResult;

  @Field({ nullable: true })
  @ApiPropertyOptional({ enum: MatchResult, description: "Player B result" })
  @IsOptional()
  @IsEnum(MatchResult)
  playerBResult?: MatchResult;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Match notes" })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Additional metadata" })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

@InputType()
export class ConfirmMatchResultDto {
  @Field(() => ID)
  @ApiProperty({ description: "Match ID" })
  @IsUUID("4")
  matchId: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Judge notes" })
  @IsOptional()
  @IsString()
  judgeNotes?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Applied penalty" })
  @IsOptional()
  @IsString()
  penalty?: string;
}

// Judge Tools DTOs
@InputType()
export class ApplyRulingDto {
  @Field(() => ID)
  @ApiProperty({ description: "Match ID" })
  @IsUUID("4")
  matchId: string;

  @Field()
  @ApiProperty({ description: "Ruling text and explanation" })
  @IsString()
  rulingText: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Penalty applied" })
  @IsOptional()
  @IsString()
  penalty?: string;

  @Field(() => [String], { nullable: true })
  @ApiPropertyOptional({ description: "Attachment URLs", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Additional metadata" })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// Search and Filter DTOs
@InputType()
export class EventSearchFiltersDto {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @ApiPropertyOptional({ description: "Page number", default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @ApiPropertyOptional({ description: "Items per page", default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @Field({ nullable: true })
  @ApiPropertyOptional({ enum: EventFormat, description: "Filter by format" })
  @IsOptional()
  @IsEnum(EventFormat)
  format?: EventFormat;

  @Field({ nullable: true })
  @ApiPropertyOptional({
    enum: PairingType,
    description: "Filter by pairing type",
  })
  @IsOptional()
  @IsEnum(PairingType)
  pairingType?: PairingType;

  @Field({ nullable: true })
  @ApiPropertyOptional({ enum: EventStatus, description: "Filter by status" })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @Field({ nullable: true })
  @ApiPropertyOptional({ enum: VenueType, description: "Filter by venue type" })
  @IsOptional()
  @IsEnum(VenueType)
  venueType?: VenueType;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Filter by start date from" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDateFrom?: Date;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Filter by start date to" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDateTo?: Date;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Filter by location" })
  @IsOptional()
  @IsString()
  location?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ description: "Search query" })
  @IsOptional()
  @IsString()
  search?: string;

  @Field({ nullable: true, defaultValue: "startAt" })
  @ApiPropertyOptional({ description: "Sort field", default: "startAt" })
  @IsOptional()
  @IsString()
  sortBy?: string = "startAt";

  @Field({ nullable: true, defaultValue: "ASC" })
  @ApiPropertyOptional({ description: "Sort order", default: "ASC" })
  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC" = "ASC";
}

// Response DTOs
export class PairingQualityDto {
  @ApiProperty({ description: "Match quality score (0-1)" })
  quality: number;

  @ApiProperty({
    description: "Win probabilities for each player",
    type: [Number],
  })
  winProbabilities: number[];

  @ApiProperty({ description: "Skill difference between players" })
  skillDifference: number;

  @ApiProperty({ description: "Uncertainty factor" })
  uncertaintyFactor: number;

  @ApiProperty({ description: "Balance category" })
  balanceCategory: string;
}

export class PairingDto {
  @ApiProperty({ description: "Paired player IDs", type: [String] })
  players: string[];

  @ApiProperty({ description: "Match quality information" })
  quality: PairingQualityDto;

  @ApiProperty({ description: "Table number" })
  tableNumber: number;
}

export class GeneratePairingsResponseDto {
  @ApiProperty({ description: "Generated pairings", type: [PairingDto] })
  pairings: PairingDto[];

  @ApiProperty({ description: "Overall pairing quality score" })
  overallQuality: number;

  @ApiProperty({ description: "Number of players paired" })
  playersPaired: number;

  @ApiProperty({ description: "Number of byes" })
  byes: number;

  @ApiProperty({ description: "Computation time in milliseconds" })
  computationTimeMs: number;
}

export class EventStandingDto {
  @ApiProperty({ description: "Player position" })
  position: number;

  @ApiProperty({ description: "Player ID" })
  playerId: string;

  @ApiProperty({ description: "Player display name" })
  playerName: string;

  @ApiProperty({ description: "Match points" })
  matchPoints: number;

  @ApiProperty({ description: "Game points" })
  gamePoints: number;

  @ApiProperty({ description: "Win-loss-draw record" })
  record: string;

  @ApiProperty({ description: "Opponent match win percentage" })
  opponentMatchWinPercentage: number;

  @ApiProperty({ description: "Game win percentage" })
  gameWinPercentage: number;

  @ApiProperty({ description: "Whether player has dropped" })
  hasDropped: boolean;
}

export class EventExportDto {
  @ApiProperty({ description: "Export format" })
  @IsEnum(["csv", "json"])
  format: "csv" | "json";

  @ApiProperty({ description: "Data to export" })
  @IsEnum(["participants", "pairings", "results", "standings", "all"])
  data: "participants" | "pairings" | "results" | "standings" | "all";

  @ApiProperty({ description: "Round number (optional)" })
  @IsOptional()
  @IsNumber()
  round?: number;
}
