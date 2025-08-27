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
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { GameFormat, GameType, TurnPhase } from "../entities/game.entity";

export class GameSettingsDto {
  @ApiProperty({
    description: "Time per player in minutes",
    minimum: 5,
    maximum: 120,
  })
  @IsNumber()
  @Min(5)
  @Max(120)
  timePerPlayer: number;

  @ApiProperty({ description: "Enable spectators" })
  @IsBoolean()
  enableSpectators: boolean;

  @ApiProperty({ description: "Enable in-game chat" })
  @IsBoolean()
  enableChat: boolean;

  @ApiProperty({ description: "Auto-pass priority when no actions available" })
  @IsBoolean()
  autoPassPriority: boolean;

  @ApiPropertyOptional({
    description: "Show hands to all players (practice mode)",
  })
  @IsOptional()
  @IsBoolean()
  showHands?: boolean;

  @ApiProperty({ description: "Allow takebacks/undos" })
  @IsBoolean()
  allowTakebacks: boolean;

  @ApiPropertyOptional({
    description: "Maximum takebacks per player",
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  maxTakebacks?: number;
}

export class CreateGameDto {
  @ApiProperty({ enum: GameFormat, description: "Game format" })
  @IsEnum(GameFormat)
  format: GameFormat;

  @ApiProperty({ enum: GameType, description: "Game type" })
  @IsEnum(GameType)
  type: GameType;

  @ApiProperty({ description: "Player 1 deck ID" })
  @IsUUID()
  player1DeckId: string;

  @ApiPropertyOptional({
    description: "Player 2 user ID (for direct challenge)",
  })
  @IsOptional()
  @IsUUID()
  player2Id?: string;

  @ApiPropertyOptional({
    description: "Player 2 deck ID (for direct challenge)",
  })
  @IsOptional()
  @IsUUID()
  player2DeckId?: string;

  @ApiProperty({ description: "Game settings", type: GameSettingsDto })
  @ValidateNested()
  @Type(() => GameSettingsDto)
  settings: GameSettingsDto;

  @ApiPropertyOptional({
    description: "Tournament match ID if this is a tournament game",
  })
  @IsOptional()
  @IsUUID()
  tournamentMatchId?: string;
}

export class JoinGameDto {
  @ApiProperty({ description: "Deck to use in the game" })
  @IsUUID()
  deckId: string;
}

export class GameActionDto {
  @ApiProperty({ description: "Action type (play_card, pass_priority, etc.)" })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: "Card ID being played/targeted" })
  @IsOptional()
  @IsUUID()
  cardId?: string;

  @ApiPropertyOptional({ description: "Target IDs for spells/abilities" })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targets?: string[];

  @ApiPropertyOptional({ description: "Additional data for the action" })
  @IsOptional()
  data?: any;

  @ApiPropertyOptional({ description: "Mana payment for spells" })
  @IsOptional()
  manaPayment?: {
    fire?: number;
    water?: number;
    earth?: number;
    air?: number;
    light?: number;
    dark?: number;
    chaos?: number;
    neutral?: number;
  };
}

export class MulliganDecisionDto {
  @ApiProperty({ description: "Whether to keep the hand" })
  @IsBoolean()
  keep: boolean;
}

export class GameSearchFilters {
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

  @ApiPropertyOptional({ enum: GameFormat, description: "Filter by format" })
  @IsOptional()
  @IsEnum(GameFormat)
  format?: GameFormat;

  @ApiPropertyOptional({ enum: GameType, description: "Filter by type" })
  @IsOptional()
  @IsEnum(GameType)
  type?: GameType;

  @ApiPropertyOptional({ description: "Filter by player ID" })
  @IsOptional()
  @IsUUID()
  playerId?: string;

  @ApiPropertyOptional({ description: "Show only spectatable games" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  spectatable?: boolean;

  @ApiPropertyOptional({
    description: "Sort field",
    enum: ["createdAt", "startedAt", "duration"],
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
}

export class SpectateRequestDto {
  @ApiPropertyOptional({ description: "Request spectator privileges" })
  @IsOptional()
  @IsBoolean()
  requestSpectate?: boolean;
}
