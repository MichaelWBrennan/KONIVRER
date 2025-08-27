import {
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SimulationConfigDto {
  @ApiProperty({ description: "Deck A configuration" })
  @IsObject()
  deckA: { deckId: string };

  @ApiProperty({ description: "Deck B configuration" })
  @IsObject()
  deckB: { deckId: string };

  @ApiProperty({
    description: "Random seed for deterministic results",
    required: false,
  })
  @IsOptional()
  @IsString()
  seed?: string;

  @ApiProperty({
    description: "Number of iterations to run",
    minimum: 1,
    maximum: 10000,
    default: 1000,
  })
  @IsNumber()
  @Min(1)
  @Max(10000)
  iterations: number;

  @ApiProperty({ description: "Simulation options", required: false })
  @IsOptional()
  @IsObject()
  options?: {
    startingPlayer?: "random" | "A" | "B";
    timeLimitSeconds?: number;
  };
}

export class SimulationResponseDto {
  @ApiProperty()
  simId: string;

  @ApiProperty({ enum: ["queued", "running", "completed", "failed"] })
  status: string;

  @ApiProperty({ required: false })
  summary?: {
    iterations: number;
    winRateA: number;
    avgTurnLength: number;
    statBreakdown: Record<string, any>;
    skillUpdates?: any[];
  };
}
