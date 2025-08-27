import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Repository,
  FindManyOptions,
  MoreThan,
  LessThan,
  Between,
} from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  Event,
  EventRegistration,
  Pairing,
  Match,
  Judging,
  AuditLog,
  EventStatus,
  MatchStatus,
  MatchResult,
  AuditAction,
  PairingType,
} from "./entities/event.entity";
import { User, UserRole } from "../users/entities/user.entity";
import { Deck } from "../decks/entities/deck.entity";
import { MatchmakingService } from "../matchmaking/matchmaking.service";
import { GameSimulatorService } from "../matchmaking/game-simulator.service";
import { AuditService } from "../audit/audit.service";
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
  GeneratePairingsResponseDto,
  EventStandingDto,
  EventExportDto,
} from "./dto/event.dto";
import * as crypto from "crypto";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventRegistration)
    private readonly registrationRepository: Repository<EventRegistration>,
    @InjectRepository(Pairing)
    private readonly pairingRepository: Repository<Pairing>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Judging)
    private readonly judgingRepository: Repository<Judging>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
    private readonly matchmakingService: MatchmakingService,
    private readonly gameSimulatorService: GameSimulatorService,
    private readonly eventEmitter: EventEmitter2,
    private readonly auditService: AuditService
  ) {}

  // Event Management
  async create(
    createEventDto: CreateEventDto,
    organizerId: string
  ): Promise<Event> {
    // Validate organizer permissions
    const organizer = await this.userRepository.findOne({
      where: { id: organizerId },
    });
    if (!organizer) {
      throw new NotFoundException("Organizer not found");
    }

    if (
      ![UserRole.TOURNAMENT_ORGANIZER, UserRole.ADMIN].includes(organizer.role)
    ) {
      throw new ForbiddenException(
        "User does not have permission to organize events"
      );
    }

    // Calculate total rounds based on pairing type and max players
    const totalRounds = this.calculateTotalRounds(
      createEventDto.pairingType,
      createEventDto.settings.maxPlayers
    );

    const event = this.eventRepository.create({
      ...createEventDto,
      organizerId,
      totalRounds,
      status: EventStatus.SCHEDULED,
      venue: createEventDto.venue,
      settings: {
        ...createEventDto.settings,
        registrationWindow: {
          start: createEventDto.settings.registrationWindowStart,
          end: createEventDto.settings.registrationWindowEnd,
        },
      },
    });

    const savedEvent = await this.eventRepository.save(event);

    // Log audit event
    await this.logAuditEvent({
      entityType: "Event",
      entityId: savedEvent.id,
      eventId: savedEvent.id,
      action: AuditAction.CREATE,
      actorId: organizerId,
      metadata: { eventData: createEventDto },
    });

    // Emit event created
    this.eventEmitter.emit("event.created", { event: savedEvent, organizerId });

    return this.findOneWithRelations(savedEvent.id);
  }

  async findAll(
    filters: EventSearchFiltersDto,
    userId?: string
  ): Promise<{ events: Event[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 20,
      format,
      pairingType,
      status,
      venueType,
      startDateFrom,
      startDateTo,
      location,
      search,
      sortBy = "startAt",
      sortOrder = "ASC",
    } = filters;

    const queryBuilder = this.eventRepository
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.organizer", "organizer")
      .leftJoinAndSelect("event.registrations", "registrations")
      .where("1 = 1");

    // Apply filters
    if (format) {
      queryBuilder.andWhere("event.format = :format", { format });
    }

    if (pairingType) {
      queryBuilder.andWhere("event.pairingType = :pairingType", {
        pairingType,
      });
    }

    if (status) {
      queryBuilder.andWhere("event.status = :status", { status });
    }

    if (venueType) {
      queryBuilder.andWhere("event.venue->>'type' = :venueType", { venueType });
    }

    if (startDateFrom) {
      queryBuilder.andWhere("event.startAt >= :startDateFrom", {
        startDateFrom,
      });
    }

    if (startDateTo) {
      queryBuilder.andWhere("event.startAt <= :startDateTo", { startDateTo });
    }

    if (location) {
      queryBuilder.andWhere(
        "(event.venue->>'location' ILIKE :location OR event.venue->>'address' ILIKE :location)",
        { location: `%${location}%` }
      );
    }

    if (search) {
      queryBuilder.andWhere(
        "(event.name ILIKE :search OR event.description ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    if (sortBy === "registeredPlayers") {
      queryBuilder
        .addSelect("COUNT(registrations.id)", "registrationCount")
        .groupBy("event.id, organizer.id")
        .orderBy("registrationCount", sortOrder);
    } else if (["startAt", "createdAt", "name"].includes(sortBy)) {
      queryBuilder.orderBy(`event.${sortBy}`, sortOrder);
    }

    // Pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();

    return {
      events,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId?: string): Promise<Event> {
    const event = await this.findOneWithRelations(id);

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string
  ): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException(
        "Only the event organizer can update this event"
      );
    }

    // Prevent certain updates once event has started
    if (event.status === EventStatus.IN_PROGRESS && updateEventDto.settings) {
      throw new BadRequestException(
        "Cannot modify settings while event is in progress"
      );
    }

    await this.eventRepository.update(id, updateEventDto);

    // Log audit event
    await this.logAuditEvent({
      entityType: "Event",
      entityId: id,
      eventId: id,
      action: AuditAction.UPDATE,
      actorId: userId,
      metadata: { changes: updateEventDto },
    });

    const updatedEvent = await this.findOneWithRelations(id);
    this.eventEmitter.emit("event.updated", { event: updatedEvent, userId });

    return updatedEvent;
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException(
        "Only the event organizer can delete this event"
      );
    }

    if (event.status === EventStatus.IN_PROGRESS) {
      throw new BadRequestException("Cannot delete event while in progress");
    }

    await this.logAuditEvent({
      entityType: "Event",
      entityId: id,
      eventId: id,
      action: AuditAction.DELETE,
      actorId: userId,
      metadata: { eventData: event },
    });

    await this.eventRepository.remove(event);
    this.eventEmitter.emit("event.deleted", { eventId: id, userId });
  }

  // Registration Management
  async register(
    eventId: string,
    userId: string,
    registerDto: RegisterForEventDto
  ): Promise<EventRegistration> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ["registrations"],
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (!event.isRegistrationOpen) {
      throw new BadRequestException("Registration is not open for this event");
    }

    // Check if already registered
    const existingRegistration = await this.registrationRepository.findOne({
      where: { eventId, userId },
    });

    if (existingRegistration) {
      throw new ConflictException("Already registered for this event");
    }

    // Validate deck if required
    if (event.settings.requireDeckList && registerDto.deckId) {
      const deck = await this.deckRepository.findOne({
        where: { id: registerDto.deckId, userId },
      });

      if (!deck) {
        throw new NotFoundException("Deck not found");
      }

      if (deck.format.toString() !== event.format.toString()) {
        throw new BadRequestException(`Deck format must be ${event.format}`);
      }

      if (!deck.isLegal) {
        throw new BadRequestException("Deck is not legal for event play");
      }
    }

    // Check if event is full (waitlist if needed)
    const registeredCount =
      event.registrations?.filter((r) => !r.isWaitlisted).length || 0;
    const isWaitlisted = registeredCount >= event.settings.maxPlayers;

    const registration = this.registrationRepository.create({
      eventId,
      userId,
      teamId: registerDto.teamId,
      deckId: registerDto.deckId,
      isWaitlisted,
      metadata: registerDto.metadata,
      seedValue: await this.calculateSeedValue(userId, event.format.toString()),
    });

    const savedRegistration = await this.registrationRepository.save(
      registration
    );

    // Log audit event
    await this.logAuditEvent({
      entityType: "EventRegistration",
      entityId: savedRegistration.id,
      eventId,
      action: AuditAction.REGISTER,
      actorId: userId,
      metadata: { isWaitlisted, registration: registerDto },
    });

    // Emit registration event
    this.eventEmitter.emit("event.registration", {
      eventId,
      userId,
      registration: savedRegistration,
      isWaitlisted,
    });

    // Emit notification event for accepted registration
    if (!isWaitlisted) {
      this.eventEmitter.emit("event.registration.accepted", {
        userId,
        eventId,
        eventName: event.name,
        format: event.format,
        startTime: event.startAt,
        venue: event.venue,
      });
    }

    // Auto-activate from waitlist if someone drops
    if (isWaitlisted) {
      await this.processWaitlist(eventId);
    }

    return this.registrationRepository.findOne({
      where: { id: savedRegistration.id },
      relations: ["user", "event"],
    });
  }

  async unregister(eventId: string, userId: string): Promise<void> {
    const registration = await this.registrationRepository.findOne({
      where: { eventId, userId },
    });

    if (!registration) {
      throw new NotFoundException("Registration not found");
    }

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (event.status === EventStatus.IN_PROGRESS) {
      throw new BadRequestException(
        "Cannot unregister while event is in progress. Use drop instead."
      );
    }

    await this.logAuditEvent({
      entityType: "EventRegistration",
      entityId: registration.id,
      eventId,
      action: AuditAction.UNREGISTER,
      actorId: userId,
      metadata: { registration },
    });

    await this.registrationRepository.remove(registration);

    // Process waitlist to fill the slot
    await this.processWaitlist(eventId);

    this.eventEmitter.emit("event.unregistration", { eventId, userId });
  }

  async checkIn(
    eventId: string,
    checkInDto: CheckInPlayerDto,
    actorId: string
  ): Promise<EventRegistration> {
    const registration = await this.registrationRepository.findOne({
      where: { eventId, userId: checkInDto.userId },
      relations: ["event"],
    });

    if (!registration) {
      throw new NotFoundException("Registration not found");
    }

    if (
      registration.event.status !== EventStatus.REGISTRATION_CLOSED &&
      registration.event.status !== EventStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        "Check-in not available for this event status"
      );
    }

    if (registration.checkedInAt) {
      throw new BadRequestException("Player already checked in");
    }

    if (registration.isWaitlisted) {
      throw new BadRequestException("Cannot check in waitlisted player");
    }

    registration.checkedInAt = new Date();
    if (checkInDto.seedValue !== undefined) {
      registration.seedValue = checkInDto.seedValue;
    }

    const savedRegistration = await this.registrationRepository.save(
      registration
    );

    await this.logAuditEvent({
      entityType: "EventRegistration",
      entityId: registration.id,
      eventId,
      action: AuditAction.CHECKIN,
      actorId,
      metadata: { seedValue: checkInDto.seedValue },
    });

    this.eventEmitter.emit("event.checkin", {
      eventId,
      userId: checkInDto.userId,
      actorId,
    });

    return savedRegistration;
  }

  // Pairing Management
  async generatePairings(
    eventId: string,
    generateDto: GeneratePairingsDto,
    actorId: string,
    provenance?: any
  ): Promise<GeneratePairingsResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ["registrations"],
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (event.organizerId !== actorId && !event.judges?.includes(actorId)) {
      throw new ForbiddenException(
        "Only event organizers and judges can generate pairings"
      );
    }

    // Get checked-in players
    const checkedInPlayers =
      event.registrations
        ?.filter((r) => !r.isWaitlisted && r.checkedInAt)
        .map((r) => r.userId) || [];

    if (checkedInPlayers.length < 2) {
      throw new BadRequestException(
        "Need at least 2 checked-in players to generate pairings"
      );
    }

    const startTime = Date.now();
    let pairingsResponse: GeneratePairingsResponseDto;

    try {
      // Use Bayesian matchmaking for optimal pairings
      const pairingResult = await this.matchmakingService.generatePairings({
        playerIds: checkedInPlayers,
        format: event.format.toString(),
        previousPairings: generateDto.previousPairings || [],
        tournamentId: eventId, // Use eventId as tournamentId for compatibility
        round: event.currentRound + 1,
      });

      // Convert to our format
      const pairings: any[] = [];
      let tableNumber = 1;

      for (const pairing of pairingResult.pairings) {
        pairings.push({
          players: pairing.players,
          quality: pairing.quality,
          tableNumber: tableNumber++,
        });
      }

      pairingsResponse = {
        pairings,
        overallQuality: pairingResult.overallQuality || 0,
        playersPaired: pairingResult.pairings.length * 2,
        byes: checkedInPlayers.length % 2,
        computationTimeMs: Date.now() - startTime,
      };
    } catch (error) {
      console.warn("Bayesian pairing failed, using fallback:", error);
      pairingsResponse = await this.generateFallbackPairings(
        checkedInPlayers,
        generateDto.previousPairings || []
      );
      pairingsResponse.computationTimeMs = Date.now() - startTime;
    }

    // Save pairings to database
    await this.savePairings(
      eventId,
      event.currentRound + 1,
      pairingsResponse.pairings
    );

    // Log audit event
    await this.logAuditEvent({
      entityType: "Pairing",
      entityId: eventId,
      eventId,
      action: AuditAction.GENERATE_PAIRINGS,
      actorId,
      metadata: {
        round: event.currentRound + 1,
        pairingCount: pairingsResponse.pairings.length,
        quality: pairingsResponse.overallQuality,
      },
    });

    return pairingsResponse;
  }

  async publishPairings(
    eventId: string,
    round: number,
    actorId: string
  ): Promise<void> {
    const pairings = await this.pairingRepository.find({
      where: { eventId, roundNumber: round },
    });

    if (!pairings.length) {
      throw new NotFoundException("No pairings found for this round");
    }

    const publishedAt = new Date();
    for (const pairing of pairings) {
      pairing.publishedAt = publishedAt;
      await this.pairingRepository.save(pairing);

      // Create match entries
      const match = this.matchRepository.create({
        pairingId: pairing.id,
        eventId,
        round,
        status: MatchStatus.SCHEDULED,
      });
      await this.matchRepository.save(match);
    }

    await this.logAuditEvent({
      entityType: "Pairing",
      entityId: eventId,
      eventId,
      action: AuditAction.PUBLISH_PAIRINGS,
      actorId,
      metadata: { round, pairingCount: pairings.length },
    });

    // Emit real-time update
    this.eventEmitter.emit("event.pairings.published", {
      eventId,
      round,
      pairings: pairings.map((p) => ({
        id: p.id,
        tableNumber: p.tableNumber,
        playerAId: p.playerAId,
        playerBId: p.playerBId,
        isBye: p.isBye,
      })),
    });

    // Get event details and registered players for notifications
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ["registrations", "registrations.user"],
    });

    if (event) {
      const registeredPlayerIds =
        event.registrations
          ?.filter((r) => r.isCheckedIn && !r.isWaitlisted)
          .map((r) => r.userId) || [];

      // Emit round started notification
      this.eventEmitter.emit("event.round.started", {
        eventId,
        eventName: event.name,
        format: event.format,
        round,
        registeredPlayers: registeredPlayerIds,
        venue: event.venue,
      });

      // Emit seating assignments notification
      const assignments = pairings
        .map((p) => ({
          playerId: p.playerAId,
          table: p.tableNumber,
          opponent:
            event.registrations?.find((r) => r.userId === p.playerBId)?.user ||
            null,
        }))
        .concat(
          pairings.map((p) => ({
            playerId: p.playerBId,
            table: p.tableNumber,
            opponent:
              event.registrations?.find((r) => r.userId === p.playerAId)
                ?.user || null,
          }))
        )
        .filter((a) => a.playerId); // Remove null players from byes

      this.eventEmitter.emit("event.seating.assigned", {
        eventId,
        eventName: event.name,
        format: event.format,
        round,
        assignments,
        venue: event.venue,
      });
    }
  }

  async getPairings(eventId: string, round?: number): Promise<Pairing[]> {
    const where: any = { eventId };
    if (round) {
      where.roundNumber = round;
    }

    return this.pairingRepository.find({
      where,
      relations: ["playerA", "playerB", "matches"],
      order: { roundNumber: "ASC", tableNumber: "ASC" },
    });
  }

  // Match Management
  async reportResult(
    matchId: string,
    resultDto: ReportMatchResultDto,
    reporterId: string
  ): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ["pairing", "pairing.playerA", "pairing.playerB", "event"],
    });

    if (!match) {
      throw new NotFoundException("Match not found");
    }

    // Check if reporter is authorized
    const canReport =
      match.pairing.playerAId === reporterId ||
      match.pairing.playerBId === reporterId ||
      match.event.judges?.includes(reporterId) ||
      match.event.organizerId === reporterId;

    if (!canReport) {
      throw new ForbiddenException(
        "Not authorized to report result for this match"
      );
    }

    if (match.status === MatchStatus.COMPLETED) {
      throw new BadRequestException("Match result already submitted");
    }

    // Update match with result
    match.playerAResult = resultDto.playerAResult;
    match.playerBResult =
      resultDto.playerBResult ||
      this.getOppositeResult(resultDto.playerAResult);
    match.notes = resultDto.notes;
    match.metadata = resultDto.metadata;
    match.status = MatchStatus.COMPLETED;
    match.reportedBy = reporterId;

    const savedMatch = await this.matchRepository.save(match);

    // Update Bayesian ratings
    try {
      if (match.pairing.playerAId && match.pairing.playerBId) {
        const outcomes = [
          {
            playerId: match.pairing.playerAId,
            rank:
              resultDto.playerAResult === MatchResult.WIN
                ? 1
                : resultDto.playerAResult === MatchResult.DRAW
                ? 1
                : 2,
          },
          {
            playerId: match.pairing.playerBId,
            rank:
              match.playerBResult === MatchResult.WIN
                ? 1
                : match.playerBResult === MatchResult.DRAW
                ? 1
                : 2,
          },
        ];

        await this.matchmakingService.updateRatings({
          format: match.event.format.toString(),
          outcomes,
          tournamentId: match.eventId,
          matchId: match.id,
        });
      }
    } catch (error) {
      console.warn("Failed to update Bayesian ratings:", error);
    }

    // Log audit event
    await this.logAuditEvent({
      entityType: "Match",
      entityId: matchId,
      eventId: match.eventId,
      action: AuditAction.REPORT_RESULT,
      actorId: reporterId,
      metadata: { result: resultDto },
    });

    // Check if round is complete
    await this.checkRoundComplete(match.eventId, match.round);

    // Emit real-time update
    this.eventEmitter.emit("event.match.result", {
      eventId: match.eventId,
      matchId,
      result: resultDto,
      reporterId,
    });

    return savedMatch;
  }

  async confirmResult(
    confirmDto: ConfirmMatchResultDto,
    judgeId: string
  ): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id: confirmDto.matchId },
      relations: ["event"],
    });

    if (!match) {
      throw new NotFoundException("Match not found");
    }

    // Check if user is authorized judge
    if (
      !match.event.judges?.includes(judgeId) &&
      match.event.organizerId !== judgeId
    ) {
      throw new ForbiddenException(
        "Only judges and organizers can confirm results"
      );
    }

    match.confirmedByJudge = judgeId;
    if (confirmDto.judgeNotes) {
      match.notes =
        (match.notes || "") + `\n[Judge Notes: ${confirmDto.judgeNotes}]`;
    }

    const savedMatch = await this.matchRepository.save(match);

    await this.logAuditEvent({
      entityType: "Match",
      entityId: confirmDto.matchId,
      eventId: match.eventId,
      action: AuditAction.CONFIRM_RESULT,
      actorId: judgeId,
      metadata: {
        judgeNotes: confirmDto.judgeNotes,
        penalty: confirmDto.penalty,
      },
    });

    return savedMatch;
  }

  async applyRuling(
    rulingDto: ApplyRulingDto,
    judgeId: string
  ): Promise<Judging> {
    const match = await this.matchRepository.findOne({
      where: { id: rulingDto.matchId },
      relations: ["event"],
    });

    if (!match) {
      throw new NotFoundException("Match not found");
    }

    // Verify judge permissions
    const judge = await this.userRepository.findOne({ where: { id: judgeId } });
    if (!judge?.isJudge && match.event.organizerId !== judgeId) {
      throw new ForbiddenException("Only judges can apply rulings");
    }

    const judging = this.judgingRepository.create({
      matchId: rulingDto.matchId,
      judgeId,
      rulingText: rulingDto.rulingText,
      penalty: rulingDto.penalty,
      attachments: rulingDto.attachments,
      metadata: rulingDto.metadata,
    });

    const savedJudging = await this.judgingRepository.save(judging);

    // Mark match as disputed if not already resolved
    if (match.status !== MatchStatus.COMPLETED) {
      match.status = MatchStatus.DISPUTED;
      await this.matchRepository.save(match);
    }

    await this.logAuditEvent({
      entityType: "Judging",
      entityId: savedJudging.id,
      eventId: match.eventId,
      action: AuditAction.APPLY_RULING,
      actorId: judgeId,
      metadata: { ruling: rulingDto },
    });

    this.eventEmitter.emit("event.judge.ruling", {
      eventId: match.eventId,
      matchId: rulingDto.matchId,
      judging: savedJudging,
    });

    return this.judgingRepository.findOne({
      where: { id: savedJudging.id },
      relations: ["judge", "match"],
    });
  }

  // Simulator Integration
  async simulateMatch(matchId: string, userId: string): Promise<any> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ["pairing", "pairing.playerA", "pairing.playerB", "event"],
    });

    if (!match) {
      throw new NotFoundException("Match not found");
    }

    if (!match.pairing.playerAId || !match.pairing.playerBId) {
      throw new BadRequestException("Cannot simulate match with bye");
    }

    try {
      const simulationResult =
        await this.gameSimulatorService.simulateMatchSeries({
          players: [
            {
              id: match.pairing.playerAId,
              name: "Player A",
              deckId: "",
              skill: 1200,
              uncertainty: 100,
              conservativeRating: 1100,
            },
            {
              id: match.pairing.playerBId,
              name: "Player B",
              deckId: "",
              skill: 1200,
              uncertainty: 100,
              conservativeRating: 1100,
            },
          ],
          format: match.event.format.toString(),
          numberOfGames: 1000,
          includeDetailedLogs: false,
        });

      return {
        matchId,
        simulationResult,
        disclaimer:
          "This is a sandbox simulation and does not affect actual ratings",
      };
    } catch (error) {
      throw new BadRequestException(
        "Simulation failed: " + ((error as Error).message || "Unknown error")
      );
    }
  }

  // Standing and Statistics
  async getStandings(eventId: string): Promise<EventStandingDto[]> {
    const matches = await this.matchRepository.find({
      where: { eventId, status: MatchStatus.COMPLETED },
      relations: ["pairing", "pairing.playerA", "pairing.playerB"],
    });

    const registrations = await this.registrationRepository.find({
      where: { eventId, isWaitlisted: false },
      relations: ["user"],
    });

    const standings = new Map<string, EventStandingDto>();

    // Initialize standings
    for (const registration of registrations) {
      standings.set(registration.userId, {
        position: 0,
        playerId: registration.userId,
        playerName: registration.user.displayName,
        matchPoints: 0,
        gamePoints: 0,
        record: "0-0-0",
        opponentMatchWinPercentage: 0,
        gameWinPercentage: 0,
        hasDropped: false,
      });
    }

    // Calculate standings from match results
    for (const match of matches) {
      if (!match.pairing.playerAId || !match.pairing.playerBId) continue;

      const playerAStanding = standings.get(match.pairing.playerAId);
      const playerBStanding = standings.get(match.pairing.playerBId);

      if (playerAStanding && playerBStanding) {
        // Update match points and records based on results
        if (match.playerAResult === MatchResult.WIN) {
          playerAStanding.matchPoints += 3;
          playerBStanding.matchPoints += 0;
        } else if (match.playerAResult === MatchResult.DRAW) {
          playerAStanding.matchPoints += 1;
          playerBStanding.matchPoints += 1;
        } else {
          playerAStanding.matchPoints += 0;
          playerBStanding.matchPoints += 3;
        }

        // Update game points (simplified - would need actual game counts)
        playerAStanding.gamePoints +=
          match.playerAResult === MatchResult.WIN ? 3 : 0;
        playerBStanding.gamePoints +=
          match.playerBResult === MatchResult.WIN ? 3 : 0;
      }
    }

    // Sort by match points
    const sortedStandings = Array.from(standings.values()).sort(
      (a, b) => b.matchPoints - a.matchPoints
    );

    // Update positions
    sortedStandings.forEach((standing, index) => {
      standing.position = index + 1;
    });

    return sortedStandings;
  }

  async exportEventData(
    eventId: string,
    exportDto: EventExportDto
  ): Promise<any> {
    const event = await this.findOneWithRelations(eventId);

    let data: any = {};

    switch (exportDto.data) {
      case "participants":
        data.participants =
          event.registrations?.map((r) => ({
            userId: r.userId,
            username: r.user?.username,
            checkedIn: !!r.checkedInAt,
            isWaitlisted: r.isWaitlisted,
            registeredAt: r.createdAt,
          })) || [];
        break;

      case "pairings":
        const pairings = await this.getPairings(eventId, exportDto.round);
        data.pairings = pairings.map((p) => ({
          round: p.roundNumber,
          table: p.tableNumber,
          playerA: p.playerA?.username,
          playerB: p.playerB?.username,
          isBye: p.isBye,
          publishedAt: p.publishedAt,
        }));
        break;

      case "results":
        const matches = await this.matchRepository.find({
          where: { eventId, status: MatchStatus.COMPLETED },
          relations: ["pairing", "pairing.playerA", "pairing.playerB"],
        });
        data.results = matches.map((m) => ({
          round: m.round,
          playerA: m.pairing.playerA?.username,
          playerAResult: m.playerAResult,
          playerB: m.pairing.playerB?.username,
          playerBResult: m.playerBResult,
          reportedBy: m.reportedBy,
          confirmedBy: m.confirmedByJudge,
        }));
        break;

      case "standings":
        data.standings = await this.getStandings(eventId);
        break;

      case "all":
        data = {
          event: {
            id: event.id,
            name: event.name,
            format: event.format,
            status: event.status,
            startAt: event.startAt,
            organizer: event.organizer?.username,
          },
          participants:
            event.registrations?.map((r) => ({
              userId: r.userId,
              username: r.user?.username,
              checkedIn: !!r.checkedInAt,
              isWaitlisted: r.isWaitlisted,
            })) || [],
          standings: await this.getStandings(eventId),
        };
        break;
    }

    if (exportDto.format === "csv") {
      // Convert to CSV format (simplified)
      return this.convertToCSV(data);
    }

    return data;
  }

  // Private Helper Methods
  private async findOneWithRelations(id: string): Promise<Event> {
    return this.eventRepository.findOne({
      where: { id },
      relations: [
        "organizer",
        "registrations",
        "registrations.user",
        "pairings",
        "pairings.playerA",
        "pairings.playerB",
        "matches",
        "auditLogs",
      ],
    });
  }

  private calculateTotalRounds(
    pairingType: PairingType,
    maxPlayers: number
  ): number {
    switch (pairingType) {
      case PairingType.SWISS:
        return Math.ceil(Math.log2(maxPlayers));
      case PairingType.SINGLE_ELIMINATION:
        return Math.ceil(Math.log2(maxPlayers));
      case PairingType.ROUND_ROBIN:
        return maxPlayers - 1;
      case PairingType.ROUND_ROBIN_TOP_X:
        return maxPlayers - 1 + Math.ceil(Math.log2(8)); // RR + Top 8 bracket
      default:
        return 0;
    }
  }

  private async calculateSeedValue(
    userId: string,
    format: string
  ): Promise<number> {
    try {
      const rating = await this.matchmakingService.getPlayerRating(
        userId,
        format
      );
      return rating.conservativeRating;
    } catch (error) {
      return 0; // Default seed for new players
    }
  }

  private async processWaitlist(eventId: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ["registrations"],
    });

    if (!event) return;

    const registeredCount =
      event.registrations?.filter((r) => !r.isWaitlisted).length || 0;
    const availableSlots = event.settings.maxPlayers - registeredCount;

    if (availableSlots > 0) {
      const waitlistedPlayers =
        event.registrations
          ?.filter((r) => r.isWaitlisted)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .slice(0, availableSlots) || [];

      for (const registration of waitlistedPlayers) {
        registration.isWaitlisted = false;
        await this.registrationRepository.save(registration);

        this.eventEmitter.emit("event.waitlist.activated", {
          eventId,
          userId: registration.userId,
        });
      }
    }
  }

  private async generateFallbackPairings(
    playerIds: string[],
    previousPairings: string[][]
  ): Promise<GeneratePairingsResponseDto> {
    const shuffledPlayers = [...playerIds].sort(() => Math.random() - 0.5);
    const pairings: any[] = [];
    let tableNumber = 1;

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        pairings.push({
          players: [shuffledPlayers[i], shuffledPlayers[i + 1]],
          quality: {
            quality: 0.5,
            winProbabilities: [0.5, 0.5],
            skillDifference: 0,
            uncertaintyFactor: 1,
            balanceCategory: "unknown",
          },
          tableNumber: tableNumber++,
        });
      }
    }

    return {
      pairings,
      overallQuality: 0.5,
      playersPaired: pairings.length * 2,
      byes: playerIds.length % 2,
      computationTimeMs: 0,
    };
  }

  private async savePairings(
    eventId: string,
    round: number,
    pairings: any[]
  ): Promise<void> {
    for (const pairingData of pairings) {
      const pairing = this.pairingRepository.create({
        eventId,
        roundNumber: round,
        tableNumber: pairingData.tableNumber,
        playerAId: pairingData.players[0],
        playerBId: pairingData.players[1] || null,
        pairingMetadata: pairingData.quality,
      });

      await this.pairingRepository.save(pairing);
    }
  }

  private getOppositeResult(result: MatchResult): MatchResult {
    switch (result) {
      case MatchResult.WIN:
        return MatchResult.LOSS;
      case MatchResult.LOSS:
        return MatchResult.WIN;
      case MatchResult.DRAW:
        return MatchResult.DRAW;
      case MatchResult.CONCESSION:
        return MatchResult.WIN;
      case MatchResult.TIMEOUT:
        return MatchResult.WIN;
      default:
        return MatchResult.LOSS;
    }
  }

  private async checkRoundComplete(
    eventId: string,
    round: number
  ): Promise<void> {
    const roundMatches = await this.matchRepository.find({
      where: { eventId, round },
    });

    const allComplete = roundMatches.every(
      (m) => m.status === MatchStatus.COMPLETED
    );

    if (allComplete) {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
      });

      if (event && round >= event.totalRounds) {
        // Event complete
        event.status = EventStatus.COMPLETED;
        event.endAt = new Date();
        await this.eventRepository.save(event);

        this.eventEmitter.emit("event.completed", { eventId });
      } else if (event) {
        // Ready for next round
        event.currentRound = round;
        await this.eventRepository.save(event);

        this.eventEmitter.emit("event.round.completed", { eventId, round });
      }
    }
  }

  private async logAuditEvent(auditData: {
    entityType: string;
    entityId: string;
    eventId?: string;
    action: AuditAction;
    actorId: string;
    metadata: any;
  }): Promise<void> {
    const provenanceHash = crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          ...auditData,
          timestamp: new Date().toISOString(),
        })
      )
      .digest("hex");

    const auditLog = this.auditLogRepository.create({
      ...auditData,
      metadataJson: auditData.metadata,
      provenanceHash,
    });

    await this.auditLogRepository.save(auditLog);
  }

  private convertToCSV(data: any): string {
    // Simplified CSV conversion - would need proper implementation
    if (Array.isArray(data.participants)) {
      const headers = Object.keys(data.participants[0] || {});
      const rows = data.participants.map((p: any) =>
        headers.map((h) => p[h]).join(",")
      );
      return [headers.join(","), ...rows].join("\n");
    }

    return JSON.stringify(data);
  }
}
