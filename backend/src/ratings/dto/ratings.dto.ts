import {
  IsArray,
  IsString,
  IsNumber,
  IsUUID,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class MatchResultDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: "Score: 1 for win, 0 for loss, 0.5 for draw" })
  @IsNumber()
  score: number;
}

export class UpdateRatingsDto {
  @ApiProperty()
  @IsUUID()
  matchId: string;

  @ApiProperty({ type: [MatchResultDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchResultDto)
  results: MatchResultDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timestamp?: string;
}

export class RatingResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  rating: {
    mu: number;
    sigma: number;
  };

  @ApiProperty({ type: [Object] })
  history: {
    matchId: string;
    prior: { mu: number; sigma: number };
    posterior: { mu: number; sigma: number };
    delta: number;
    timestamp: string;
  }[];
}
