import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ParseIntPipe,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { EventsService } from "./events.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import {
  Provenance,
  ProvenanceData,
} from "../common/decorators/provenance.decorator";
import { UserRole } from "../users/entities/user.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ThrottlerGuard } from "@nestjs/throttler";
import { UseGuards as UseThrottlerGuard } from "@nestjs/common";
import {
  CreateEventDto,
  UpdateEventDto,
  EventSearchFiltersDto,
  RegisterForEventDto,
  CheckInPlayerDto,
  GeneratePairingsDto,
  ReportMatchResultDto,
  ConfirmMatchResultDto,
  ApplyRulingDto,
  EventExportDto,
} from "./dto/event.dto";
import {
  Event,
  EventRegistration,
  Pairing,
  Match,
  Judging,
} from "./entities/event.entity";

@ApiTags("events")
@Controller("api/events")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  // Event Management Endpoints
  @Post()
  @ApiOperation({ summary: "Create a new event" })
  @ApiResponse({
    status: 201,
    description: "Event created successfully",
    type: Event,
  })
  @ApiResponse({ status: 400, description: "Invalid event data" })
  @ApiResponse({ status: 403, description: "Insufficient permissions" })
  @UseGuards(RolesGuard)
  @Roles(UserRole.TOURNAMENT_ORGANIZER, UserRole.ADMIN)
  async create(
    @Body() createEventDto: CreateEventDto,
    @Request() req
  ): Promise<Event> {
    return this.eventsService.create(createEventDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: "Get all events with filtering and pagination" })
  @ApiResponse({ status: 200, description: "Events retrieved successfully" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "format", required: false })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "search", required: false })
  async findAll(
    @Query() filters: EventSearchFiltersDto,
    @Request() req
  ): Promise<{
    events: Event[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.eventsService.findAll(filters, req.user?.userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get event by ID" })
  @ApiResponse({
    status: 200,
    description: "Event retrieved successfully",
    type: Event,
  })
  @ApiResponse({ status: 404, description: "Event not found" })
  async findOne(
    @Param("id", ParseUUIDPipe) id: string,
    @Request() req
  ): Promise<Event> {
    return this.eventsService.findOne(id, req.user?.userId);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update event" })
  @ApiResponse({
    status: 200,
    description: "Event updated successfully",
    type: Event,
  })
  @ApiResponse({ status: 403, description: "Only event organizer can update" })
  @ApiResponse({ status: 404, description: "Event not found" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto, req.user.userId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete event" })
  @ApiResponse({ status: 204, description: "Event deleted successfully" })
  @ApiResponse({ status: 403, description: "Only event organizer can delete" })
  @ApiResponse({ status: 404, description: "Event not found" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param("id", ParseUUIDPipe) id: string,
    @Request() req
  ): Promise<void> {
    await this.eventsService.remove(id, req.user.userId);
  }

  // Registration Endpoints
  @Post(":id/register")
  @ApiOperation({ summary: "Register for event" })
  @ApiResponse({
    status: 201,
    description: "Registration successful",
    type: EventRegistration,
  })
  @ApiResponse({
    status: 400,
    description: "Registration not available or invalid",
  })
  @ApiResponse({ status: 409, description: "Already registered" })
  @UseThrottlerGuard(ThrottlerGuard)
  async register(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Body() registerDto: RegisterForEventDto,
    @Request() req
  ): Promise<EventRegistration> {
    return this.eventsService.register(eventId, req.user.userId, registerDto);
  }

  @Delete(":id/register")
  @ApiOperation({ summary: "Unregister from event" })
  @ApiResponse({ status: 204, description: "Unregistration successful" })
  @ApiResponse({ status: 400, description: "Cannot unregister at this time" })
  @ApiResponse({ status: 404, description: "Registration not found" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unregister(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Request() req
  ): Promise<void> {
    await this.eventsService.unregister(eventId, req.user.userId);
  }

  @Post(":id/checkin")
  @ApiOperation({ summary: "Check in player for event" })
  @ApiResponse({
    status: 200,
    description: "Check-in successful",
    type: EventRegistration,
  })
  @ApiResponse({ status: 400, description: "Check-in not available" })
  @ApiResponse({
    status: 403,
    description: "Only organizers and judges can check in players",
  })
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.TOURNAMENT_ORGANIZER,
    UserRole.JUDGE_L1,
    UserRole.JUDGE_L2,
    UserRole.JUDGE_L3,
    UserRole.ADMIN
  )
  async checkIn(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Body() checkInDto: CheckInPlayerDto,
    @Request() req
  ): Promise<EventRegistration> {
    return this.eventsService.checkIn(eventId, checkInDto, req.user.userId);
  }

  // Pairing Endpoints
  @Get(":id/pairings")
  @ApiOperation({ summary: "Get event pairings" })
  @ApiResponse({
    status: 200,
    description: "Pairings retrieved successfully",
    type: [Pairing],
  })
  @ApiQuery({ name: "round", required: false, type: Number })
  async getPairings(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Query("round", new ParseIntPipe({ optional: true })) round?: number
  ): Promise<Pairing[]> {
    return this.eventsService.getPairings(eventId, round);
  }

  @Post(":id/pairings/generate")
  @ApiOperation({ summary: "Generate pairings for next round" })
  @ApiResponse({ status: 201, description: "Pairings generated successfully" })
  @ApiResponse({ status: 400, description: "Cannot generate pairings" })
  @ApiResponse({
    status: 403,
    description: "Only organizers and judges can generate pairings",
  })
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.TOURNAMENT_ORGANIZER,
    UserRole.JUDGE_L1,
    UserRole.JUDGE_L2,
    UserRole.JUDGE_L3,
    UserRole.ADMIN
  )
  async generatePairings(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Body() generateDto: GeneratePairingsDto,
    @Request() req,
    @Provenance() provenance: ProvenanceData
  ): Promise<any> {
    // Set event context
    generateDto.eventId = eventId;

    return this.eventsService.generatePairings(
      eventId,
      generateDto,
      req.user.userId,
      provenance
    );
  }

  @Post(":id/pairings/publish")
  @ApiOperation({ summary: "Publish pairings to players" })
  @ApiResponse({ status: 200, description: "Pairings published successfully" })
  @ApiResponse({ status: 404, description: "No pairings found for round" })
  @ApiResponse({
    status: 403,
    description: "Only organizers can publish pairings",
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.TOURNAMENT_ORGANIZER, UserRole.ADMIN)
  async publishPairings(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Query("round", ParseIntPipe) round: number,
    @Request() req
  ): Promise<{ success: boolean; message: string }> {
    await this.eventsService.publishPairings(eventId, round, req.user.userId);
    return { success: true, message: "Pairings published successfully" };
  }

  // Match Management Endpoints
  @Get(":id/matches")
  @ApiOperation({ summary: "Get event matches" })
  @ApiResponse({
    status: 200,
    description: "Matches retrieved successfully",
    type: [Match],
  })
  @ApiQuery({ name: "round", required: false, type: Number })
  async getMatches(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Query("round", new ParseIntPipe({ optional: true })) round?: number
  ): Promise<Match[]> {
    const pairings = await this.eventsService.getPairings(eventId, round);
    const matches: Match[] = [];

    for (const pairing of pairings) {
      if (pairing.matches) {
        matches.push(...pairing.matches);
      }
    }

    return matches;
  }

  @Post("pairings/:pairingId/report")
  @ApiOperation({ summary: "Report match result" })
  @ApiResponse({
    status: 200,
    description: "Result reported successfully",
    type: Match,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid result or match already complete",
  })
  @ApiResponse({ status: 403, description: "Not authorized to report result" })
  async reportResult(
    @Param("pairingId", ParseUUIDPipe) pairingId: string,
    @Body() resultDto: ReportMatchResultDto,
    @Request() req
  ): Promise<Match> {
    // Find the match for this pairing
    const matches = await this.getMatchesForPairing(pairingId);
    if (!matches.length) {
      throw new NotFoundException("No match found for this pairing");
    }

    const match = matches[0]; // Get the active match
    return this.eventsService.reportResult(
      match.id,
      resultDto,
      req.user.userId
    );
  }

  @Post("matches/:matchId/confirm")
  @ApiOperation({ summary: "Judge confirms match result" })
  @ApiResponse({
    status: 200,
    description: "Result confirmed successfully",
    type: Match,
  })
  @ApiResponse({ status: 403, description: "Only judges can confirm results" })
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.JUDGE_L1,
    UserRole.JUDGE_L2,
    UserRole.JUDGE_L3,
    UserRole.TOURNAMENT_ORGANIZER,
    UserRole.ADMIN
  )
  async confirmResult(
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Body() confirmDto: ConfirmMatchResultDto,
    @Request() req
  ): Promise<Match> {
    confirmDto.matchId = matchId;
    return this.eventsService.confirmResult(confirmDto, req.user.userId);
  }

  @Post("matches/:matchId/simulate")
  @ApiOperation({ summary: "Simulate match outcome" })
  @ApiResponse({
    status: 200,
    description: "Simulation completed successfully",
  })
  @ApiResponse({ status: 400, description: "Cannot simulate this match" })
  async simulateMatch(
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Request() req
  ): Promise<any> {
    return this.eventsService.simulateMatch(matchId, req.user.userId);
  }

  // Judge Tools Endpoints
  @Post("matches/:matchId/ruling")
  @ApiOperation({ summary: "Apply judge ruling" })
  @ApiResponse({
    status: 201,
    description: "Ruling applied successfully",
    type: Judging,
  })
  @ApiResponse({ status: 403, description: "Only judges can apply rulings" })
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.JUDGE_L1,
    UserRole.JUDGE_L2,
    UserRole.JUDGE_L3,
    UserRole.TOURNAMENT_ORGANIZER,
    UserRole.ADMIN
  )
  async applyRuling(
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Body() rulingDto: ApplyRulingDto,
    @Request() req
  ): Promise<Judging> {
    rulingDto.matchId = matchId;
    return this.eventsService.applyRuling(rulingDto, req.user.userId);
  }

  // Standings and Statistics Endpoints
  @Get(":id/standings")
  @ApiOperation({ summary: "Get event standings" })
  @ApiResponse({ status: 200, description: "Standings retrieved successfully" })
  async getStandings(
    @Param("id", ParseUUIDPipe) eventId: string
  ): Promise<any[]> {
    return this.eventsService.getStandings(eventId);
  }

  @Get(":id/statistics")
  @ApiOperation({ summary: "Get event statistics and analytics" })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getStatistics(
    @Param("id", ParseUUIDPipe) eventId: string
  ): Promise<any> {
    const event = await this.eventsService.findOne(eventId);
    const standings = await this.eventsService.getStandings(eventId);
    const pairings = await this.eventsService.getPairings(eventId);

    const completedMatches = pairings
      .flatMap((p) => p.matches || [])
      .filter((m) => m.isComplete);

    return {
      eventId,
      totalParticipants: event.registeredPlayers,
      completedRounds: event.currentRound,
      totalMatches: pairings.length,
      completedMatches: completedMatches.length,
      topStandings: standings.slice(0, 8),
      eventDuration: event.endAt
        ? Math.round(
            (event.endAt.getTime() - event.startAt.getTime()) / (1000 * 60 * 60)
          ) + " hours"
        : "In progress",
    };
  }

  // Export and Reporting Endpoints
  @Get(":id/export")
  @ApiOperation({ summary: "Export event data" })
  @ApiResponse({ status: 200, description: "Data exported successfully" })
  @ApiQuery({ name: "format", required: false, enum: ["csv", "json"] })
  @ApiQuery({
    name: "data",
    required: false,
    enum: ["participants", "pairings", "results", "standings", "all"],
  })
  @ApiQuery({ name: "round", required: false, type: Number })
  async exportData(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Query("format") format: "csv" | "json" = "json",
    @Query("data")
    data: "participants" | "pairings" | "results" | "standings" | "all" = "all",
    @Query("round", new ParseIntPipe({ optional: true })) round?: number
  ): Promise<any> {
    const exportDto: EventExportDto = {
      format,
      data,
      round,
    };

    return this.eventsService.exportEventData(eventId, exportDto);
  }

  // Real-time Updates Endpoints (for WebSocket alternative)
  @Get(":id/updates/:lastUpdate")
  @ApiOperation({
    summary: "Get updates since timestamp (polling fallback for WebSocket)",
  })
  @ApiResponse({ status: 200, description: "Updates retrieved successfully" })
  async getUpdates(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Param("lastUpdate") lastUpdateTimestamp: string
  ): Promise<any> {
    const lastUpdate = new Date(lastUpdateTimestamp);

    // Get recent updates (simplified implementation)
    const event = await this.eventsService.findOne(eventId);
    const recentPairings = await this.eventsService.getPairings(eventId);

    return {
      eventId,
      timestamp: new Date().toISOString(),
      updates: {
        event: event.updatedAt > lastUpdate ? event : null,
        pairings: recentPairings.filter(
          (p) => p.publishedAt && p.publishedAt > lastUpdate
        ),
        standings:
          event.updatedAt > lastUpdate
            ? await this.eventsService.getStandings(eventId)
            : null,
      },
    };
  }

  // Player Drop Endpoint
  @Post(":id/drop")
  @ApiOperation({ summary: "Drop player from event" })
  @ApiResponse({ status: 200, description: "Player dropped successfully" })
  @ApiResponse({ status: 400, description: "Cannot drop player" })
  async dropPlayer(
    @Param("id", ParseUUIDPipe) eventId: string,
    @Query("playerId", ParseUUIDPipe) playerId: string,
    @Request() req
  ): Promise<{ success: boolean; message: string }> {
    // This would need to be implemented in the service
    // For now, return a placeholder
    return {
      success: true,
      message: "Drop functionality to be implemented",
    };
  }

  // Private helper methods
  private async getMatchesForPairing(pairingId: string): Promise<Match[]> {
    // This would need access to match repository or service method
    // For now, return empty array - would need proper implementation
    return [];
  }
}
