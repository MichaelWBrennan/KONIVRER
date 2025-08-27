import { IsOptional, IsString, IsEnum, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuditQueryDto {
  @ApiProperty({ required: false, description: "Filter by entity type" })
  @IsOptional()
  @IsString()
  entity?: string;

  @ApiProperty({ required: false, description: "Filter by agent ID" })
  @IsOptional()
  @IsString()
  "agent-id"?: string;

  @ApiProperty({ required: false, description: "Filter by prompt hash" })
  @IsOptional()
  @IsString()
  "prompt-hash"?: string;

  @ApiProperty({ required: false, description: "Filter by model version" })
  @IsOptional()
  @IsString()
  "model-version"?: string;

  @ApiProperty({ required: false, description: "Filter by action type" })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiProperty({
    required: false,
    description: "Start date for date range filter",
  })
  @IsOptional()
  @IsDateString()
  "date-from"?: string;

  @ApiProperty({
    required: false,
    description: "End date for date range filter",
  })
  @IsOptional()
  @IsDateString()
  "date-to"?: string;

  @ApiProperty({ required: false, description: "Page number", default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: "Items per page", default: 50 })
  @IsOptional()
  limit?: number;
}
