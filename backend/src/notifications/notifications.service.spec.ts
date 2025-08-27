import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationsService } from "./notifications.service";
import { Notification } from "./entities/notification.entity";
import { User } from "../users/entities/user.entity";
import { EventRegistration } from "../events/entities/event.entity";

describe("NotificationsService - Event-Specific Notifications", () => {
  let service: NotificationsService;
  let mockNotificationRepo: any;
  let mockUserRepo: any;
  let mockEventRegistrationRepo: any;
  let mockEventEmitter: any;

  beforeEach(async () => {
    // Mock repositories
    mockNotificationRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        orderBy: jest.fn().mockReturnThis(),
      })),
    };

    mockUserRepo = {
      findOne: jest.fn(),
    };

    mockEventRegistrationRepo = {
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      })),
    };

    mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(EventRegistration),
          useValue: mockEventRegistrationRepo,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  describe("Event-specific notification targeting", () => {
    it("should only send notifications to registered participants", async () => {
      // Mock event participants query
      const mockParticipants = [{ userId: "user-1" }, { userId: "user-2" }];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockParticipants),
      };
      mockEventRegistrationRepo.createQueryBuilder.mockReturnValue(
        mockQueryBuilder
      );

      // Mock user lookup
      mockUserRepo.findOne.mockResolvedValue({
        id: "user-1",
        preferences: { notifications: { push: true, tournament: true } },
      });

      // Mock notification creation
      const mockNotification = { id: "notif-1", userId: "user-1" };
      mockNotificationRepo.create.mockReturnValue(mockNotification);
      mockNotificationRepo.save.mockResolvedValue(mockNotification);

      // Mock duplicate check (no duplicates)
      const mockNotifQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockNotificationRepo.createQueryBuilder.mockReturnValue(
        mockNotifQueryBuilder
      );

      const eventData = {
        eventId: "event-123",
        eventName: "Test Tournament",
        format: "Standard",
        round: 1,
        venue: { location: "Test Location" },
      };

      await service.handleRoundStarted(eventData);

      // Verify participants were fetched for correct event
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        "registration.eventId = :eventId",
        { eventId: "event-123" }
      );

      // Verify notification was created with event-specific details
      expect(mockNotificationRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-1",
          eventId: "event-123",
          type: "round_start",
          title: "Round Started",
          message: "Round 1 has started for Test Tournament",
          data: expect.objectContaining({
            round: 1,
            eventName: "Test Tournament",
            eventFormat: "Standard",
            eventLocation: "Test Location",
          }),
        })
      );
    });

    it("should prevent duplicate notifications", async () => {
      // Mock participants
      const mockParticipants = [{ userId: "user-1" }];
      const mockParticipantsQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockParticipants),
      };
      mockEventRegistrationRepo.createQueryBuilder.mockReturnValue(
        mockParticipantsQueryBuilder
      );

      // Mock existing notification (duplicate)
      const mockNotifQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: "existing-notif" }),
      };
      mockNotificationRepo.createQueryBuilder.mockReturnValue(
        mockNotifQueryBuilder
      );

      const eventData = {
        eventId: "event-123",
        eventName: "Test Tournament",
        round: 1,
      };

      await service.handleRoundStarted(eventData);

      // Should not create notification due to duplicate
      expect(mockNotificationRepo.create).not.toHaveBeenCalled();
      expect(mockNotificationRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("Event-specific notification data", () => {
    it("should include comprehensive event details in seating assignment", async () => {
      const mockParticipants = [{ userId: "user-1" }];
      const mockParticipantsQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockParticipants),
      };
      mockEventRegistrationRepo.createQueryBuilder.mockReturnValue(
        mockParticipantsQueryBuilder
      );

      mockUserRepo.findOne.mockResolvedValue({
        id: "user-1",
        preferences: { notifications: { push: true, tournament: true } },
      });

      const mockNotification = { id: "notif-1" };
      mockNotificationRepo.create.mockReturnValue(mockNotification);
      mockNotificationRepo.save.mockResolvedValue(mockNotification);

      const mockNotifQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockNotificationRepo.createQueryBuilder.mockReturnValue(
        mockNotifQueryBuilder
      );

      const eventData = {
        eventId: "event-456",
        eventName: "Modern Masters",
        format: "Modern",
        round: 2,
        assignments: [
          {
            playerId: "user-1",
            table: 5,
            opponent: { name: "Alice" },
          },
        ],
      };

      await service.handleSeatingAssigned(eventData);

      expect(mockNotificationRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-1",
          eventId: "event-456",
          type: "seating_assignment",
          title: "Seating Assignment",
          message: "Table 5: You're paired against Alice in Modern Masters",
          data: expect.objectContaining({
            table: 5,
            opponent: { name: "Alice" },
            round: 2,
            eventName: "Modern Masters",
            eventFormat: "Modern",
            estimatedStartTime: expect.any(Date),
          }),
        })
      );
    });
  });

  describe("User event notification filtering", () => {
    it("should retrieve notifications for specific event", async () => {
      const mockNotifications = [
        { id: "notif-1", eventId: "event-123", type: "round_start" },
        { id: "notif-2", eventId: "event-123", type: "seating_assignment" },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockNotifications),
      };
      mockNotificationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getUserEventNotifications(
        "user-1",
        "event-123",
        false
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "notification.eventId = :eventId",
        { eventId: "event-123" }
      );
    });

    it("should group notifications by event", async () => {
      const mockNotifications = [
        { id: "notif-1", eventId: "event-123", type: "round_start" },
        { id: "notif-2", eventId: "event-456", type: "registration_accepted" },
        { id: "notif-3", eventId: "event-123", type: "seating_assignment" },
        { id: "notif-4", eventId: null, type: "system" },
      ];

      // Mock the getUserNotifications call
      jest
        .spyOn(service, "getUserNotifications")
        .mockResolvedValue(mockNotifications as any);

      const result = await service.getUserNotificationsByEvent("user-1");

      expect(result).toEqual({
        "event-123": [mockNotifications[0], mockNotifications[2]],
        "event-456": [mockNotifications[1]],
        general: [mockNotifications[3]],
      });
    });
  });
});
