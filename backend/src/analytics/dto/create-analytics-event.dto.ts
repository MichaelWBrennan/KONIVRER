import { IsEnum, IsOptional, IsString, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '../entities/analytics-event.entity';

export class CreateAnalyticsEventDto {
  @ApiProperty({
    enum: EventType,
    description: 'Type of analytics event',
  })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiPropertyOptional({
    description: 'User ID associated with the event',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Session ID for grouping related events',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({
    description: 'Event-specific data',
    type: 'object',
  })
  @IsObject()
  data: any;

  @ApiPropertyOptional({
    description: 'Additional metadata about the event',
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}