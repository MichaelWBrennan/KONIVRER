import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import {
  CreateNotificationDto,
  UpdateNotificationStatusDto,
  NotificationFiltersDto,
} from "./dto/notification.dto";
import { Notification } from "./entities/notification.entity";

@ApiTags("notifications")
@Controller("api/notifications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new notification (admin only)" })
  @ApiResponse({
    status: 201,
    description: "Notification created successfully",
    type: Notification,
  })
  @ApiResponse({ status: 403, description: "Insufficient permissions" })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TOURNAMENT_ORGANIZER)
  async create(
    @Body() createNotificationDto: CreateNotificationDto
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all notifications (admin only)" })
  @ApiResponse({
    status: 200,
    description: "Notifications retrieved successfully",
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(@Query() filters: NotificationFiltersDto): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.notificationsService.findAll(filters);
  }

  @Get("my/events")
  @ApiOperation({ summary: "Get current user notifications grouped by event" })
  @ApiResponse({
    status: 200,
    description: "User notifications grouped by event retrieved successfully",
  })
  async getMyNotificationsByEvent(
    @Request() req
  ): Promise<Record<string, Notification[]>> {
    return this.notificationsService.getUserNotificationsByEvent(
      req.user.userId
    );
  }

  @Get("my/events/:eventId")
  @ApiOperation({
    summary: "Get current user notifications for a specific event",
  })
  @ApiResponse({
    status: 200,
    description: "User event notifications retrieved successfully",
    type: [Notification],
  })
  async getMyEventNotifications(
    @Request() req,
    @Param("eventId", ParseUUIDPipe) eventId: string,
    @Query("unreadOnly") unreadOnly: string = "false"
  ): Promise<Notification[]> {
    return this.notificationsService.getUserEventNotifications(
      req.user.userId,
      eventId,
      unreadOnly === "true"
    );
  }

  @Get("my")
  @ApiOperation({ summary: "Get current user notifications" })
  @ApiResponse({
    status: 200,
    description: "User notifications retrieved successfully",
    type: [Notification],
  })
  async getMyNotifications(
    @Request() req,
    @Query("unreadOnly") unreadOnly: string = "false"
  ): Promise<Notification[]> {
    return this.notificationsService.getUserNotifications(
      req.user.userId,
      unreadOnly === "true"
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get notification by ID" })
  @ApiResponse({
    status: 200,
    description: "Notification retrieved successfully",
    type: Notification,
  })
  @ApiResponse({ status: 404, description: "Notification not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Put(":id/status")
  @ApiOperation({ summary: "Update notification status" })
  @ApiResponse({
    status: 200,
    description: "Status updated successfully",
    type: Notification,
  })
  @ApiResponse({ status: 404, description: "Notification not found" })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TOURNAMENT_ORGANIZER)
  async updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateNotificationStatusDto
  ): Promise<Notification> {
    return this.notificationsService.updateStatus(id, updateStatusDto);
  }

  @Put(":id/read")
  @ApiOperation({ summary: "Mark notification as read" })
  @ApiResponse({
    status: 200,
    description: "Notification marked as read",
    type: Notification,
  })
  @ApiResponse({ status: 404, description: "Notification not found" })
  async markAsRead(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Put("my/read-all")
  @ApiOperation({ summary: "Mark all user notifications as read" })
  @ApiResponse({ status: 204, description: "All notifications marked as read" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@Request() req): Promise<void> {
    await this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Post("process-pending")
  @ApiOperation({ summary: "Process pending notifications (admin only)" })
  @ApiResponse({ status: 200, description: "Pending notifications processed" })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async processPending(): Promise<{ message: string }> {
    await this.notificationsService.processPendingNotifications();
    return { message: "Pending notifications processed" };
  }
}
