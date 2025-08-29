import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsOptional, IsInt, IsString, IsObject } from "class-validator";

export class TournamentProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  currentPoints: number;

  @ApiProperty()
  regionalPoints: number;

  @ApiProperty()
  globalPoints: number;

  @ApiProperty({ required: false })
  formatSpecificPoints?: Record<string, number>;

  @ApiProperty({ required: false })
  qualificationStatus?: Record<string, any>;

  @ApiProperty()
  lastPointUpdate: Date;

  @ApiProperty({ required: false })
  preferences?: Record<string, any>;
}

export class UpdateTournamentPreferencesDto {
  @ApiProperty({ description: "User ID" })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: "Preferences payload" })
  @IsObject()
  preferences: Record<string, any>;
}

export class PointUpdateDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @ApiProperty()
  @IsInt()
  points: number;

  @ApiProperty({ enum: ["regional", "global", "format"] })
  @IsString()
  pointType: "regional" | "global" | "format";

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  formatKey?: string;
}

