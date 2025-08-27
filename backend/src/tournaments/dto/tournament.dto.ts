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
  IsDateString,
  IsUrl,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  TournamentFormat,
  TournamentType,
  TournamentStatus,
  TournamentVisibility,
} from "../entities/tournament.entity";

export class TournamentSettingsDto {
  @ApiProperty({
    description: "Maximum number of players",
    minimum: 4,
    maximum: 1024,
  })
  @IsNumber()
  @Min(4)
  @Max(1024)
  maxPlayers: number;

  @ApiProperty({
    description: "Minimum number of players",
    minimum: 2,
    maximum: 512,
  })
  @IsNumber()
  @Min(2)
  @Max(512)
  minPlayers: number;

  @ApiPropertyOptional({ description: "Number of Swiss rounds" })
  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfRounds?: number;

  @ApiPropertyOptional({ description: "Time limit per round in minutes" })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(180)
  timeLimit?: number;

  @ApiPropertyOptional({ description: "Registration deadline" })
  @IsOptional()
  @IsDateString()
  registrationDeadline?: Date;

  @ApiProperty({ description: "Allow players to drop from tournament" })
  @IsBoolean()
  allowDrops: boolean;

  @ApiProperty({ description: "Allow spectators to watch matches" })
  @IsBoolean()
  allowSpectators: boolean;

  @ApiProperty({ description: "Require deck lists from players" })
  @IsBoolean()
  requireDeckList: boolean;

  @ApiPropertyOptional({ description: "Deck list submission deadline" })
  @IsOptional()
  @IsDateString()
  deckListDeadline?: Date;

  @ApiProperty({ description: "Whether prizes are enabled" })
  @IsBoolean()
  prizesEnabled: boolean;

  @ApiPropertyOptional({ description: "Entry fee amount" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  entryFee?: number;

  @ApiPropertyOptional({ description: "Currency code (USD, EUR, etc.)" })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class PrizeDistributionDto {
  @ApiProperty({ description: "Placement (1st, 2nd, etc.)" })
  @IsNumber()
  @Min(1)
  place: number;

  @ApiProperty({ description: "Prize amount" })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: "Percentage of prize pool" })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}

export class TournamentPrizingDto {
  @ApiProperty({ description: "Total prize pool amount" })
  @IsNumber()
  @Min(0)
  totalPrizePool: number;

  @ApiProperty({ description: "Currency code" })
  @IsString()
  currency: string;

  @ApiProperty({
    description: "Prize distribution by place",
    type: [PrizeDistributionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrizeDistributionDto)
  distribution: PrizeDistributionDto[];
}

export class CreateTournamentDto {
  @ApiProperty({ description: "Tournament name" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: "Tournament description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TournamentFormat, description: "Tournament format" })
  @IsEnum(TournamentFormat)
  format: TournamentFormat;

  @ApiProperty({
    enum: TournamentType,
    description: "Tournament type/structure",
  })
  @IsEnum(TournamentType)
  type: TournamentType;

  @ApiProperty({
    enum: TournamentVisibility,
    description: "Tournament visibility",
  })
  @IsEnum(TournamentVisibility)
  visibility: TournamentVisibility;

  @ApiProperty({ description: "Tournament start date/time" })
  @IsDateString()
  startDate: Date;

  @ApiPropertyOptional({
    description: "Tournament location (for in-person events)",
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: "Tournament timezone" })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({ description: "Whether this is an online tournament" })
  @IsBoolean()
  isOnline: boolean;

  @ApiPropertyOptional({ description: "Stream/broadcast URL" })
  @IsOptional()
  @IsUrl()
  streamUrl?: string;

  @ApiPropertyOptional({ description: "Tournament banner image URL" })
  @IsOptional()
  @IsUrl()
  bannerUrl?: string;

  @ApiProperty({
    description: "Tournament settings",
    type: TournamentSettingsDto,
  })
  @ValidateNested()
  @Type(() => TournamentSettingsDto)
  settings: TournamentSettingsDto;

  @ApiPropertyOptional({
    description: "Prize structure",
    type: TournamentPrizingDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TournamentPrizingDto)
  prizing?: TournamentPrizingDto;

  @ApiPropertyOptional({ description: "Tournament tags", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: "Judge user IDs", type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  judges?: string[];
}

export class UpdateTournamentDto {
  @ApiPropertyOptional({ description: "Tournament name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Tournament description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: TournamentStatus,
    description: "Tournament status",
  })
  @IsOptional()
  @IsEnum(TournamentStatus)
  status?: TournamentStatus;

  @ApiPropertyOptional({
    enum: TournamentVisibility,
    description: "Tournament visibility",
  })
  @IsOptional()
  @IsEnum(TournamentVisibility)
  visibility?: TournamentVisibility;

  @ApiPropertyOptional({ description: "Tournament start date/time" })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: "Tournament location" })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: "Stream/broadcast URL" })
  @IsOptional()
  @IsUrl()
  streamUrl?: string;

  @ApiPropertyOptional({
    description: "Tournament settings",
    type: TournamentSettingsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TournamentSettingsDto)
  settings?: TournamentSettingsDto;

  @ApiPropertyOptional({
    description: "Prize structure",
    type: TournamentPrizingDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TournamentPrizingDto)
  prizing?: TournamentPrizingDto;

  @ApiPropertyOptional({ description: "Tournament tags", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: "Judge user IDs", type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  judges?: string[];
}

export class TournamentSearchFilters {
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

  @ApiPropertyOptional({
    enum: TournamentFormat,
    description: "Filter by format",
  })
  @IsOptional()
  @IsEnum(TournamentFormat)
  format?: TournamentFormat;

  @ApiPropertyOptional({ enum: TournamentType, description: "Filter by type" })
  @IsOptional()
  @IsEnum(TournamentType)
  type?: TournamentType;

  @ApiPropertyOptional({
    enum: TournamentStatus,
    description: "Filter by status",
  })
  @IsOptional()
  @IsEnum(TournamentStatus)
  status?: TournamentStatus;

  @ApiPropertyOptional({ description: "Filter by online/offline" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isOnline?: boolean;

  @ApiPropertyOptional({
    description: "Filter tournaments starting after this date",
  })
  @IsOptional()
  @IsDateString()
  startDateFrom?: Date;

  @ApiPropertyOptional({
    description: "Filter tournaments starting before this date",
  })
  @IsOptional()
  @IsDateString()
  startDateTo?: Date;

  @ApiPropertyOptional({ description: "Filter by location (partial match)" })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: "Filter by tags", type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: "Search in name and description" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Sort field",
    enum: ["startDate", "createdAt", "name", "registeredPlayers"],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: "Sort order",
    enum: ["ASC", "DESC"],
    default: "ASC",
  })
  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC";
}

export class RegisterForTournamentDto {
  @ApiPropertyOptional({ description: "Deck ID to use in tournament" })
  @IsOptional()
  @IsUUID()
  deckId?: string;
}

export class SubmitMatchResultDto {
  @ApiProperty({ description: "Player 1 wins" })
  @IsNumber()
  @Min(0)
  @Max(10)
  player1Wins: number;

  @ApiProperty({ description: "Player 2 wins" })
  @IsNumber()
  @Min(0)
  @Max(10)
  player2Wins: number;

  @ApiPropertyOptional({ description: "Number of draws" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  draws?: number;

  @ApiPropertyOptional({ description: "Match notes" })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class PairingRequestDto {
  @ApiProperty({ description: "Round number to generate pairings for" })
  @IsNumber()
  @Min(1)
  round: number;
}
