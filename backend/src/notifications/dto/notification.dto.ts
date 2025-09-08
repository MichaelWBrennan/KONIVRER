import {
  IsEnum,
  IsString,
  IsUUID,
  IsOptional,
  IsObject,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  NotificationType,
  NotificationChannel,
} from "../entities/notification.entity";

export class CreateNotificationDto {
  @IsUUID()
  @ApiProperty({ description: "User ID to send notification to" })
  userId: string;

  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType, description: "Notification type" })
  type: NotificationType;

  @IsEnum(NotificationChannel)
  @ApiProperty({
    enum: NotificationChannel,
    description: "Notification channel",
  })
  channel: NotificationChannel;

  @IsString()
  @ApiProperty({ description: "Notification title" })
  title: string;

  @IsString()
  @ApiProperty({ description: "Notification message" })
  message: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({ description: "Additional notification data", required: false })
  data?: any;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: "Related event ID", required: false })
  eventId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: "Related tournament ID", required: false })
  tournamentId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: "Related match ID", required: false })
  matchId?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: "When notification should be sent",
    required: false,
  })
  scheduledFor?: Date;
}

export class UpdateNotificationStatusDto {
  @IsEnum(["pending", "sent", "failed", "read"])
  @ApiProperty({
    enum: ["pending", "sent", "failed", "read"],
    description: "New notification status",
  })
  status: "pending" | "sent" | "failed" | "read";

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Error message if failed", required: false })
  errorMessage?: string;
}

export class NotificationFiltersDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: "Filter by user ID", required: false })
  userId?: string;

  @IsEnum(NotificationType)
  @IsOptional()
  @ApiProperty({
    enum: NotificationType,
    description: "Filter by notification type",
    required: false,
  })
  type?: NotificationType;

  @IsEnum(["pending", "sent", "failed", "read"])
  @IsOptional()
  @ApiProperty({
    enum: ["pending", "sent", "failed", "read"],
    description: "Filter by status",
    required: false,
  })
  status?: "pending" | "sent" | "failed" | "read";

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Page number for pagination", required: false })
  page?: number = 1;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Items per page", required: false })
  limit?: number = 20;
}
