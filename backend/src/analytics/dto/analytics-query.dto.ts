import {
  IsDateString,
  IsOptional,
  IsEnum,
  IsArray,
  IsString,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '../entities/analytics-event.entity';

export class AnalyticsQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for the query range',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'End date for the query range',
    example: '2024-01-31T23:59:59.999Z',
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    enum: EventType,
    isArray: true,
    description: 'Filter by event types',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(EventType, { each: true })
  eventTypes?: EventType[];

  @ApiPropertyOptional({
    description: 'Filter by specific user ID',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    enum: ['hour', 'day', 'week', 'month'],
    description: 'Time period grouping',
    default: 'day',
  })
  @IsOptional()
  @IsIn(['hour', 'day', 'week', 'month'])
  groupBy?: string;

  @ApiPropertyOptional({
    isArray: true,
    description: 'Metrics to calculate',
    default: ['count'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  metrics?: string[];
}