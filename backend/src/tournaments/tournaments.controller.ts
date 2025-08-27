import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { TournamentsService } from "./tournaments.service";
import {
  CreateTournamentDto,
  UpdateTournamentDto,
  TournamentSearchFilters,
  RegisterForTournamentDto,
  SubmitMatchResultDto,
  PairingRequestDto,
} from "./dto/tournament.dto";
import {
  Tournament,
  TournamentMatch,
  TournamentStanding,
  TournamentFormat,
  TournamentType,
  TournamentStatus,
} from "./entities/tournament.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@ApiTags("Tournaments")
@Controller("api/v1/tournaments")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.TOURNAMENT_ORGANIZER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new tournament" })
  @ApiResponse({
    status: 201,
    description: "Tournament created successfully",
    type: Tournament,
  })
  @ApiResponse({ status: 400, description: "Invalid tournament data" })
  @ApiResponse({ status: 403, description: "Insufficient permissions" })
  async create(
    @Body() createTournamentDto: CreateTournamentDto,
    @Request() req
  ) {
    return this.tournamentsService.create(createTournamentDto, req.user.id);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: "Get all tournaments with filtering and pagination",
  })
  @ApiResponse({
    status: 200,
    description: "Tournaments retrieved successfully",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 20)",
  })
  @ApiQuery({
    name: "format",
    required: false,
    enum: TournamentFormat,
    description: "Filter by format",
  })
  @ApiQuery({
    name: "type",
    required: false,
    enum: TournamentType,
    description: "Filter by type",
  })
  @ApiQuery({
    name: "status",
    required: false,
    enum: TournamentStatus,
    description: "Filter by status",
  })
  @ApiQuery({
    name: "isOnline",
    required: false,
    type: Boolean,
    description: "Filter by online/offline",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search in name and description",
  })
  async findAll(@Query() filters: TournamentSearchFilters, @Request() req) {
    const userId = req.user?.id;
    return this.tournamentsService.findAll(filters, userId);
  }

  @Get("featured")
  @Public()
  @ApiOperation({ summary: "Get featured tournaments" })
  @ApiResponse({
    status: 200,
    description: "Featured tournaments retrieved successfully",
  })
  async getFeatured(@Query("limit") limit: number = 5) {
    const filters: TournamentSearchFilters = {
      limit,
      sortBy: "startDate",
      sortOrder: "ASC",
    };
    const result = await this.tournamentsService.findAll(filters);

    // Filter to featured tournaments (would add isFeatured field check)
    return {
      tournaments: result.tournaments.filter((t) => t.isFeatured),
      total: result.tournaments.filter((t) => t.isFeatured).length,
    };
  }

  @Get("upcoming")
  @Public()
  @ApiOperation({ summary: "Get upcoming tournaments" })
  @ApiResponse({
    status: 200,
    description: "Upcoming tournaments retrieved successfully",
  })
  async getUpcoming(@Query("limit") limit: number = 10) {
    const filters: TournamentSearchFilters = {
      limit,
      startDateFrom: new Date(),
      status: TournamentStatus.REGISTRATION_OPEN,
      sortBy: "startDate",
      sortOrder: "ASC",
    };
    return this.tournamentsService.findAll(filters);
  }

  @Get("live")
  @Public()
  @ApiOperation({ summary: "Get live tournaments" })
  @ApiResponse({
    status: 200,
    description: "Live tournaments retrieved successfully",
  })
  async getLive(@Query("limit") limit: number = 10) {
    const filters: TournamentSearchFilters = {
      limit,
      status: TournamentStatus.IN_PROGRESS,
      sortBy: "startDate",
      sortOrder: "ASC",
    };
    return this.tournamentsService.findAll(filters);
  }

  @Get("my-tournaments")
  @ApiOperation({ summary: "Get tournaments organized by current user" })
  @ApiResponse({
    status: 200,
    description: "User tournaments retrieved successfully",
  })
  async getMyTournaments(
    @Query() filters: TournamentSearchFilters,
    @Request() req
  ) {
    // TODO: Add organizerId filter to service
    return this.tournamentsService.findAll(filters, req.user.id);
  }

  @Get("my-registrations")
  @ApiOperation({ summary: "Get tournaments current user is registered for" })
  @ApiResponse({
    status: 200,
    description: "User registrations retrieved successfully",
  })
  async getMyRegistrations(
    @Query() filters: TournamentSearchFilters,
    @Request() req
  ) {
    // TODO: Add participantId filter to service
    return this.tournamentsService.findAll(filters, req.user.id);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get tournament by ID" })
  @ApiResponse({
    status: 200,
    description: "Tournament retrieved successfully",
    type: Tournament,
  })
  @ApiResponse({ status: 404, description: "Tournament not found" })
  @ApiResponse({
    status: 403,
    description: "Access denied (private tournament)",
  })
  async findOne(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user?.id;
    return this.tournamentsService.findOne(id, userId);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.TOURNAMENT_ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: "Update tournament" })
  @ApiResponse({
    status: 200,
    description: "Tournament updated successfully",
    type: Tournament,
  })
  @ApiResponse({ status: 404, description: "Tournament not found" })
  @ApiResponse({ status: 403, description: "Access denied" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
    @Request() req
  ) {
    return this.tournamentsService.update(id, updateTournamentDto, req.user.id);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.TOURNAMENT_ORGANIZER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete tournament" })
  @ApiResponse({ status: 204, description: "Tournament deleted successfully" })
  @ApiResponse({ status: 404, description: "Tournament not found" })
  @ApiResponse({ status: 403, description: "Access denied" })
  async remove(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    await this.tournamentsService.remove(id, req.user.id);
  }

  @Post(":id/register")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Register for tournament" })
  @ApiResponse({ status: 200, description: "Successfully registered" })
  @ApiResponse({ status: 400, description: "Registration failed" })
  @ApiResponse({ status: 404, description: "Tournament not found" })
  async register(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() registerDto: RegisterForTournamentDto,
    @Request() req
  ) {
    await this.tournamentsService.register(id, req.user.id, registerDto);
    return { message: "Successfully registered for tournament" };
  }

  @Delete(":id/register")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Unregister from tournament" })
  @ApiResponse({ status: 200, description: "Successfully unregistered" })
  @ApiResponse({ status: 400, description: "Unregistration failed" })
  @ApiResponse({ status: 404, description: "Tournament not found" })
  async unregister(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    await this.tournamentsService.unregister(id, req.user.id);
    return { message: "Successfully unregistered from tournament" };
  }

  @Post(":id/start")
  @UseGuards(RolesGuard)
  @Roles(UserRole.TOURNAMENT_ORGANIZER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Start tournament" })
  @ApiResponse({
    status: 200,
    description: "Tournament started successfully",
    type: Tournament,
  })
  @ApiResponse({ status: 400, description: "Cannot start tournament" })
  @ApiResponse({ status: 403, description: "Access denied" })
  async start(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    return this.tournamentsService.startTournament(id, req.user.id);
  }

  @Post(":id/pairings")
  @UseGuards(RolesGuard)
  @Roles(UserRole.TOURNAMENT_ORGANIZER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Generate round pairings" })
  @ApiResponse({
    status: 201,
    description: "Pairings generated successfully",
    type: [TournamentMatch],
  })
  @ApiResponse({ status: 400, description: "Cannot generate pairings" })
  @ApiResponse({ status: 403, description: "Access denied" })
  async generatePairings(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() pairingDto: PairingRequestDto,
    @Request() req
  ) {
    return this.tournamentsService.generatePairings(id, pairingDto.round);
  }

  @Get(":id/standings")
  @Public()
  @ApiOperation({ summary: "Get tournament standings" })
  @ApiResponse({
    status: 200,
    description: "Standings retrieved successfully",
    type: [TournamentStanding],
  })
  @ApiResponse({ status: 404, description: "Tournament not found" })
  async getStandings(@Param("id", ParseUUIDPipe) id: string) {
    return this.tournamentsService.getStandings(id);
  }

  @Get(":id/matches")
  @Public()
  @ApiOperation({ summary: "Get tournament matches" })
  @ApiResponse({
    status: 200,
    description: "Matches retrieved successfully",
    type: [TournamentMatch],
  })
  @ApiResponse({ status: 404, description: "Tournament not found" })
  @ApiQuery({
    name: "round",
    required: false,
    type: Number,
    description: "Filter by round",
  })
  async getMatches(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("round") round?: number
  ) {
    return this.tournamentsService.getMatches(id, round);
  }

  @Post(":id/matches/:matchId/result")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Submit match result" })
  @ApiResponse({
    status: 200,
    description: "Match result submitted successfully",
    type: TournamentMatch,
  })
  @ApiResponse({ status: 400, description: "Invalid match result" })
  @ApiResponse({ status: 403, description: "Access denied" })
  @ApiResponse({ status: 404, description: "Match not found" })
  async submitMatchResult(
    @Param("id", ParseUUIDPipe) tournamentId: string,
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Body() resultDto: SubmitMatchResultDto,
    @Request() req
  ) {
    return this.tournamentsService.submitMatchResult(
      matchId,
      resultDto,
      req.user.id
    );
  }

  @Post(":id/drop")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Drop from tournament" })
  @ApiResponse({
    status: 200,
    description: "Successfully dropped from tournament",
  })
  @ApiResponse({ status: 400, description: "Cannot drop from tournament" })
  @ApiResponse({ status: 404, description: "Tournament not found" })
  async drop(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    await this.tournamentsService.dropPlayer(id, req.user.id, req.user.id);
    return { message: "Successfully dropped from tournament" };
  }

  @Post(":id/drop/:playerId")
  @UseGuards(RolesGuard)
  @Roles(UserRole.TOURNAMENT_ORGANIZER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Drop player from tournament (TO only)" })
  @ApiResponse({ status: 200, description: "Player dropped successfully" })
  @ApiResponse({ status: 403, description: "Access denied" })
  async dropPlayer(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("playerId", ParseUUIDPipe) playerId: string,
    @Request() req
  ) {
    await this.tournamentsService.dropPlayer(id, playerId, req.user.id);
    return { message: "Player dropped successfully" };
  }

  @Get(":id/statistics")
  @Public()
  @ApiOperation({ summary: "Get tournament statistics" })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Tournament not found" })
  async getStatistics(@Param("id", ParseUUIDPipe) id: string) {
    return this.tournamentsService.getTournamentStatistics(id);
  }

  @Get(":id/export")
  @Public()
  @ApiOperation({ summary: "Export tournament data" })
  @ApiResponse({ status: 200, description: "Tournament data exported" })
  @ApiQuery({
    name: "format",
    required: false,
    enum: ["json", "csv", "pdf"],
    description: "Export format",
  })
  async exportTournament(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("format") format: string = "json",
    @Request() req
  ) {
    const userId = req.user?.id;
    const tournament = await this.tournamentsService.findOne(id, userId);
    const standings = await this.tournamentsService.getStandings(id);
    const matches = await this.tournamentsService.getMatches(id);
    const statistics = await this.tournamentsService.getTournamentStatistics(
      id
    );

    // TODO: Implement actual export format conversion
    return {
      tournament,
      standings,
      matches,
      statistics,
      exportFormat: format,
      exportedAt: new Date(),
      message: `Tournament exported in ${format} format`,
    };
  }

  @Get(":id/bracket")
  @Public()
  @ApiOperation({ summary: "Get tournament bracket visualization data" })
  @ApiResponse({
    status: 200,
    description: "Bracket data retrieved successfully",
  })
  async getBracket(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user?.id;
    const tournament = await this.tournamentsService.findOne(id, userId);
    const matches = await this.tournamentsService.getMatches(id);

    // TODO: Format bracket data for visualization
    return {
      tournamentId: id,
      type: tournament.type,
      rounds: tournament.totalRounds,
      currentRound: tournament.currentRound,
      matches,
      bracketStructure: "Bracket visualization coming soon",
    };
  }

  @Post(":id/stream")
  @UseGuards(RolesGuard)
  @Roles(UserRole.TOURNAMENT_ORGANIZER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update stream settings" })
  @ApiResponse({ status: 200, description: "Stream settings updated" })
  async updateStream(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() streamData: { streamUrl?: string; isLive?: boolean },
    @Request() req
  ) {
    const updateDto: UpdateTournamentDto = {
      streamUrl: streamData.streamUrl,
    };

    const tournament = await this.tournamentsService.update(
      id,
      updateDto,
      req.user.id
    );

    return {
      tournamentId: id,
      streamUrl: tournament.streamUrl,
      message: "Stream settings updated successfully",
    };
  }

  @Get(":id/leaderboard")
  @Public()
  @ApiOperation({ summary: "Get real-time tournament leaderboard" })
  @ApiResponse({
    status: 200,
    description: "Leaderboard retrieved successfully",
  })
  async getLeaderboard(@Param("id", ParseUUIDPipe) id: string) {
    const standings = await this.tournamentsService.getStandings(id);

    return {
      tournamentId: id,
      lastUpdate: new Date(),
      standings: standings.slice(0, 16), // Top 16
      updatedAt: new Date(),
    };
  }
}
