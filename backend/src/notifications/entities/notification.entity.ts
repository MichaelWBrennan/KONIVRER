import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";

export enum NotificationType {
  ROUND_START = "round_start",
  REGISTRATION_ACCEPTED = "registration_accepted",
  SEATING_ASSIGNMENT = "seating_assignment",
  TOURNAMENT_UPDATE = "tournament_update",
  MATCH_RESULT = "match_result",
  SYSTEM = "system",
}

export enum NotificationChannel {
  PUSH = "push",
  EMAIL = "email",
  IN_APP = "in_app",
  SMS = "sms",
}

export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
  READ = "read",
}

@Entity("notifications")
@ObjectType()
@Index(["userId", "status"])
@Index(["type", "createdAt"])
@Index(["eventId", "userId"])
@Index(["eventId", "type", "userId"])
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Notification ID" })
  id: string;

  @Column()
  @Field()
  @ApiProperty({ description: "User ID" })
  userId: string;

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  @Field()
  @ApiProperty({ enum: NotificationType, description: "Notification type" })
  type: NotificationType;

  @Column({
    type: "enum",
    enum: NotificationChannel,
  })
  @Field()
  @ApiProperty({
    enum: NotificationChannel,
    description: "Notification channel",
  })
  channel: NotificationChannel;

  @Column({
    type: "enum",
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  @Field()
  @ApiProperty({ enum: NotificationStatus, description: "Notification status" })
  status: NotificationStatus;

  @Column({ type: "varchar", length: 255 })
  @Field()
  @ApiProperty({ description: "Notification title" })
  title: string;

  @Column({ type: "text" })
  @Field()
  @ApiProperty({ description: "Notification message" })
  message: string;

  @Column({ type: "json", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Additional notification data", required: false })
  data?: any;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Related event ID", required: false })
  eventId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Related tournament ID", required: false })
  tournamentId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Related match ID", required: false })
  matchId?: string;

  @Column({ type: "timestamp", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "When notification was sent", required: false })
  sentAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "When notification was read", required: false })
  readAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({
    description: "When notification should be sent",
    required: false,
  })
  scheduledFor?: Date;

  @Column({ type: "text", nullable: true })
  @ApiProperty({
    description: "Error message if sending failed",
    required: false,
  })
  errorMessage?: string;

  @Column({ type: "int", default: 0 })
  @ApiProperty({ description: "Number of retry attempts" })
  retryCount: number;

  // Relations
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  @Field(() => User, { nullable: true })
  @ApiProperty({
    description: "User who receives this notification",
    type: () => User,
    required: false,
  })
  user?: User;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Last updated timestamp" })
  updatedAt: Date;
}
