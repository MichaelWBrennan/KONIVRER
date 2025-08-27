import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import {
  Notification,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from "./entities/notification.entity";
import {
  CreateNotificationDto,
  UpdateNotificationStatusDto,
  NotificationFiltersDto,
} from "./dto/notification.dto";
import { User, UserPreferences } from "../users/entities/user.entity";
import { EventRegistration } from "../events/entities/event.entity";

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  eventId?: string;
  tournamentId?: string;
  matchId?: string;
  scheduledFor?: Date;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(EventRegistration)
    private eventRegistrationRepository: Repository<EventRegistration>,
    private eventEmitter: EventEmitter2
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto
  ): Promise<Notification> {
    const notification = this.notificationRepository.create(
      createNotificationDto
    );
    const saved = await this.notificationRepository.save(notification);

    // Emit event for real-time delivery
    this.eventEmitter.emit("notification.created", saved);

    return saved;
  }

  async findAll(filters: NotificationFiltersDto = {}): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { userId, type, status, page = 1, limit = 20 } = filters;

    const queryBuilder = this.notificationRepository
      .createQueryBuilder("notification")
      .leftJoinAndSelect("notification.user", "user")
      .orderBy("notification.createdAt", "DESC");

    if (userId) {
      queryBuilder.andWhere("notification.userId = :userId", { userId });
    }

    if (type) {
      queryBuilder.andWhere("notification.type = :type", { type });
    }

    if (status) {
      queryBuilder.andWhere("notification.status = :status", { status });
    }

    const [notifications, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      notifications,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Notification> {
    return await this.notificationRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async updateStatus(
    id: string,
    updateDto: UpdateNotificationStatusDto
  ): Promise<Notification> {
    await this.notificationRepository.update(id, {
      status: updateDto.status as NotificationStatus,
      errorMessage: updateDto.errorMessage,
      sentAt: updateDto.status === "sent" ? new Date() : undefined,
      readAt: updateDto.status === "read" ? new Date() : undefined,
    });

    return await this.findOne(id);
  }

  async markAsRead(id: string): Promise<Notification> {
    return await this.updateStatus(id, { status: "read" });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, status: NotificationStatus.SENT },
      { status: NotificationStatus.READ, readAt: new Date() }
    );
  }

  async getUserNotifications(
    userId: string,
    unreadOnly: boolean = false
  ): Promise<Notification[]> {
    const query = this.notificationRepository
      .createQueryBuilder("notification")
      .where("notification.userId = :userId", { userId })
      .orderBy("notification.createdAt", "DESC");

    if (unreadOnly) {
      query.andWhere("notification.status IN (:...statuses)", {
        statuses: [NotificationStatus.PENDING, NotificationStatus.SENT],
      });
    }

    return await query.getMany();
  }

  // Event handlers for automatic notifications
  @OnEvent("event.round.started")
  async handleRoundStarted(eventData: any) {
    this.logger.log(`Round started for event ${eventData.eventId}`);

    // Get verified registered and checked-in players for this specific event
    const registeredPlayers = await this.getEventParticipants(
      eventData.eventId
    );

    for (const playerId of registeredPlayers) {
      // Check for duplicate notification prevention
      if (
        await this.hasPendingNotification(
          playerId,
          NotificationType.ROUND_START,
          eventData.eventId,
          eventData.round
        )
      ) {
        continue;
      }

      const user = await this.userRepository.findOne({
        where: { id: playerId },
      });

      if (
        user &&
        this.shouldSendNotification(user, NotificationType.ROUND_START)
      ) {
        await this.create({
          userId: playerId,
          type: NotificationType.ROUND_START,
          channel: NotificationChannel.PUSH,
          title: "Round Started",
          message: `Round ${eventData.round} has started for ${eventData.eventName}`,
          data: {
            round: eventData.round,
            eventName: eventData.eventName,
            eventFormat: eventData.format,
            startTime: new Date(),
            eventLocation: eventData.venue?.location || "Online",
          },
          eventId: eventData.eventId,
        });
      }
    }
  }

  @OnEvent("event.registration.accepted")
  async handleRegistrationAccepted(eventData: any) {
    this.logger.log(
      `Registration accepted for user ${eventData.userId} in event ${eventData.eventId}`
    );

    // Prevent duplicate registration notifications
    if (
      await this.hasPendingNotification(
        eventData.userId,
        NotificationType.REGISTRATION_ACCEPTED,
        eventData.eventId
      )
    ) {
      return;
    }

    const user = await this.userRepository.findOne({
      where: { id: eventData.userId },
    });

    if (
      user &&
      this.shouldSendNotification(user, NotificationType.REGISTRATION_ACCEPTED)
    ) {
      await this.create({
        userId: eventData.userId,
        type: NotificationType.REGISTRATION_ACCEPTED,
        channel: NotificationChannel.PUSH,
        title: "Registration Accepted",
        message: `Your registration for ${eventData.eventName} has been accepted!`,
        data: {
          eventName: eventData.eventName,
          eventFormat: eventData.format,
          startTime: eventData.startTime,
          venue: eventData.venue,
          registrationDate: new Date(),
        },
        eventId: eventData.eventId,
      });
    }
  }

  @OnEvent("event.seating.assigned")
  async handleSeatingAssigned(eventData: any) {
    this.logger.log(`Seating assigned for event ${eventData.eventId}`);

    // Process each seating assignment - only send to participants of this specific event
    for (const assignment of eventData.assignments || []) {
      // Prevent duplicate seating notifications for the same round
      if (
        await this.hasPendingNotification(
          assignment.playerId,
          NotificationType.SEATING_ASSIGNMENT,
          eventData.eventId,
          eventData.round
        )
      ) {
        continue;
      }

      const user = await this.userRepository.findOne({
        where: { id: assignment.playerId },
      });

      if (
        user &&
        this.shouldSendNotification(user, NotificationType.SEATING_ASSIGNMENT)
      ) {
        const opponentName = assignment.opponent
          ? assignment.opponent.name
          : "TBD";

        await this.create({
          userId: assignment.playerId,
          type: NotificationType.SEATING_ASSIGNMENT,
          channel: NotificationChannel.PUSH,
          title: "Seating Assignment",
          message: `Table ${assignment.table}: You're paired against ${opponentName} in ${eventData.eventName}`,
          data: {
            table: assignment.table,
            opponent: assignment.opponent,
            round: eventData.round,
            eventName: eventData.eventName,
            eventFormat: eventData.format,
            estimatedStartTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
          },
          eventId: eventData.eventId,
        });
      }
    }
  }

  // Helper method to check user notification preferences
  private shouldSendNotification(user: User, type: NotificationType): boolean {
    if (!user.preferences) return true; // Default to sending notifications

    const preferences = user.preferences as UserPreferences;

    // Check if push notifications are enabled
    if (!preferences.notifications?.push) return false;

    // Check specific notification types
    switch (type) {
      case NotificationType.ROUND_START:
      case NotificationType.SEATING_ASSIGNMENT:
        return preferences.notifications?.tournament ?? true;
      case NotificationType.REGISTRATION_ACCEPTED:
        return preferences.notifications?.tournament ?? true;
      default:
        return true;
    }
  }

  // Method to send pending notifications (would be called by a background job)
  async processPendingNotifications(): Promise<void> {
    const pendingNotifications = await this.notificationRepository.find({
      where: { status: NotificationStatus.PENDING },
      relations: ["user"],
    });

    for (const notification of pendingNotifications) {
      try {
        await this.sendNotification(notification);
        await this.updateStatus(notification.id, { status: "sent" });
      } catch (error) {
        this.logger.error(
          `Failed to send notification ${notification.id}:`,
          error
        );
        await this.updateStatus(notification.id, {
          status: "failed",
          errorMessage: error.message,
        });
      }
    }
  }

  // Simulate sending push notification (in real implementation, would use service like Firebase)
  private async sendNotification(notification: Notification): Promise<void> {
    this.logger.log(
      `Sending ${notification.channel} notification to user ${notification.userId}: ${notification.title}`
    );

    // Emit real-time event for WebSocket delivery
    this.eventEmitter.emit("notification.push", {
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      type: notification.type,
    });

    // Here you would integrate with actual push notification services:
    // - Firebase Cloud Messaging (FCM) for mobile
    // - Web Push API for web browsers
    // - Apple Push Notification Service (APNS) for iOS
    // - etc.

    // For now, we'll just simulate the send
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Utility method to send immediate notification
  async sendImmediate(payload: NotificationPayload): Promise<void> {
    const notification = await this.create({
      userId: payload.userId,
      type: payload.type,
      channel: NotificationChannel.PUSH,
      title: payload.title,
      message: payload.message,
      data: payload.data,
      eventId: payload.eventId,
      tournamentId: payload.tournamentId,
      matchId: payload.matchId,
      scheduledFor: payload.scheduledFor,
    });

    try {
      await this.sendNotification(notification);
      await this.updateStatus(notification.id, { status: "sent" });
    } catch (error) {
      this.logger.error(`Failed to send immediate notification:`, error);
      await this.updateStatus(notification.id, {
        status: "failed",
        errorMessage: error.message,
      });
    }
  }

  // Helper method to get participants for a specific event (registered and checked-in)
  private async getEventParticipants(eventId: string): Promise<string[]> {
    const registrations = await this.eventRegistrationRepository
      .createQueryBuilder("registration")
      .where("registration.eventId = :eventId", { eventId })
      .andWhere("registration.isWaitlisted = false")
      .andWhere("registration.checkedInAt IS NOT NULL")
      .select(["registration.userId"])
      .getMany();

    return registrations.map((r) => r.userId);
  }

  // Helper method to prevent duplicate notifications
  private async hasPendingNotification(
    userId: string,
    type: NotificationType,
    eventId: string,
    round?: number
  ): Promise<boolean> {
    const query = this.notificationRepository
      .createQueryBuilder("notification")
      .where("notification.userId = :userId", { userId })
      .andWhere("notification.type = :type", { type })
      .andWhere("notification.eventId = :eventId", { eventId })
      .andWhere("notification.status IN (:...statuses)", {
        statuses: [NotificationStatus.PENDING, NotificationStatus.SENT],
      })
      .andWhere("notification.createdAt > :since", {
        since: new Date(Date.now() - 5 * 60 * 1000), // Within last 5 minutes
      });

    // For round-specific notifications, also check round data
    if (round !== undefined) {
      query.andWhere("notification.data->>'round' = :round", {
        round: round.toString(),
      });
    }

    const existing = await query.getOne();
    return !!existing;
  }

  // Enhanced method to get user notifications with event filtering
  async getUserEventNotifications(
    userId: string,
    eventId?: string,
    unreadOnly: boolean = false
  ): Promise<Notification[]> {
    const query = this.notificationRepository
      .createQueryBuilder("notification")
      .where("notification.userId = :userId", { userId })
      .orderBy("notification.createdAt", "DESC");

    if (eventId) {
      query.andWhere("notification.eventId = :eventId", { eventId });
    }

    if (unreadOnly) {
      query.andWhere("notification.status IN (:...statuses)", {
        statuses: [NotificationStatus.PENDING, NotificationStatus.SENT],
      });
    }

    return await query.getMany();
  }

  // Method to get notifications grouped by event
  async getUserNotificationsByEvent(
    userId: string
  ): Promise<Record<string, Notification[]>> {
    const notifications = await this.getUserNotifications(userId);

    return notifications.reduce((acc, notification) => {
      const eventId = notification.eventId || "general";
      if (!acc[eventId]) {
        acc[eventId] = [];
      }
      acc[eventId].push(notification);
      return acc;
    }, {} as Record<string, Notification[]>);
  }
}
