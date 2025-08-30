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
import {
  Tournament,
  TournamentMatch,
  TournamentStanding,
  TournamentFormat,
  TournamentType,
  TournamentStatus,
  TournamentVisibility,
} from "./entities/tournament.entity";
import { User, UserRole } from "../users/entities/user.entity";
import { Deck } from "../decks/entities/deck.entity";
import {
  CreateTournamentDto,
  UpdateTournamentDto,
  TournamentSearchFilters,
  RegisterForTournamentDto,
  SubmitMatchResultDto,
  PairingRequestDto,
} from "./dto/tournament.dto";
import { MatchmakingService } from "../matchmaking/matchmaking.service";
import { ProgressionService } from "../progression/progression.service";

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentMatch)
    private readonly matchRepository: Repository<TournamentMatch>,
    @InjectRepository(TournamentStanding)
    private readonly standingRepository: Repository<TournamentStanding>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
    private readonly matchmakingService: MatchmakingService,
    private readonly progressionService: ProgressionService
  ) {}

  async create(
    createTournamentDto: CreateTournamentDto,
    organizerId: string
  ): Promise<Tournament> {
    // Validate organizer has proper permissions
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
        "User does not have permission to organize tournaments"
      );
    }

    // Calculate total rounds based on tournament type and player count
    const totalRounds = this.calculateTotalRounds(
      createTournamentDto.type,
      createTournamentDto.settings.maxPlayers
    );

    const tournament = this.tournamentRepository.create({
      ...createTournamentDto,
      organizerId,
      totalRounds,
      status: TournamentStatus.SCHEDULED,
    });

    const savedTournament = await this.tournamentRepository.save(tournament);
    return this.findOneWithRelations(savedTournament.id);
  }

  async findAll(
    filters: TournamentSearchFilters,
    userId?: string
  ): Promise<{
    tournaments: Tournament[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      format,
      type,
      status,
      isOnline,
      startDateFrom,
      startDateTo,
      location,
      tags,
      search,
      sortBy = "startDate",
      sortOrder = "ASC",
    } = filters;

    const queryBuilder = this.tournamentRepository
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.organizer", "organizer")
      .leftJoinAndSelect("tournament.participants", "participants")
      .where("1 = 1");

    // Visibility filtering
    if (userId) {
      queryBuilder.andWhere(
        "(tournament.visibility = :public OR tournament.organizerId = :userId OR participants.id = :userId)",
        { public: TournamentVisibility.PUBLIC, userId }
      );
    } else {
      queryBuilder.andWhere("tournament.visibility = :public", {
        public: TournamentVisibility.PUBLIC,
      });
    }

    // Apply filters
    if (format) {
      queryBuilder.andWhere("tournament.format = :format", { format });
    }

    if (type) {
      queryBuilder.andWhere("tournament.type = :type", { type });
    }

    if (status) {
      queryBuilder.andWhere("tournament.status = :status", { status });
    }

    if (typeof isOnline === "boolean") {
      queryBuilder.andWhere("tournament.isOnline = :isOnline", { isOnline });
    }

    if (startDateFrom) {
      queryBuilder.andWhere("tournament.startDate >= :startDateFrom", {
        startDateFrom,
      });
    }

    if (startDateTo) {
      queryBuilder.andWhere("tournament.startDate <= :startDateTo", {
        startDateTo,
      });
    }

    if (location) {
      queryBuilder.andWhere("tournament.location ILIKE :location", {
        location: `%${location}%`,
      });
    }

    if (tags && tags.length > 0) {
      queryBuilder.andWhere("tournament.tags && :tags", { tags });
    }

    if (search) {
      queryBuilder.andWhere(
        "(tournament.name ILIKE :search OR tournament.description ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    const validSortFields = [
      "startDate",
      "createdAt",
      "name",
      "registeredPlayers",
    ];
    if (validSortFields.includes(sortBy)) {
      if (sortBy === "registeredPlayers") {
        queryBuilder
          .addSelect("COUNT(participants.id)", "participantCount")
          .groupBy("tournament.id, organizer.id")
          .orderBy("participantCount", sortOrder);
      } else {
        queryBuilder.orderBy(`tournament.${sortBy}`, sortOrder);
      }
    }

    // Pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [tournaments, total] = await queryBuilder.getManyAndCount();

    return {
      tournaments,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId?: string): Promise<Tournament> {
    const tournament = await this.findOneWithRelations(id);

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    // Check visibility permissions
    if (
      tournament.visibility === TournamentVisibility.PRIVATE &&
      tournament.organizerId !== userId &&
      !tournament.participants?.some((p) => p.id === userId)
    ) {
      throw new ForbiddenException("Access denied");
    }

    return tournament;
  }

  async update(
    id: string,
    updateTournamentDto: UpdateTournamentDto,
    userId: string
  ): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    if (tournament.organizerId !== userId) {
      throw new ForbiddenException(
        "Only the tournament organizer can update this tournament"
      );
    }

    // Prevent certain updates once tournament has started
    if (
      tournament.status === TournamentStatus.IN_PROGRESS &&
      updateTournamentDto.settings
    ) {
      throw new BadRequestException(
        "Cannot modify settings while tournament is in progress"
      );
    }

    await this.tournamentRepository.update(id, updateTournamentDto);
    return this.findOneWithRelations(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    if (tournament.organizerId !== userId) {
      throw new ForbiddenException(
        "Only the tournament organizer can delete this tournament"
      );
    }

    if (tournament.status === TournamentStatus.IN_PROGRESS) {
      throw new BadRequestException(
        "Cannot delete tournament while in progress"
      );
    }

    await this.tournamentRepository.remove(tournament);
  }

  async register(
    tournamentId: string,
    userId: string,
    registerDto: RegisterForTournamentDto
  ): Promise<void> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
      relations: ["participants"],
    });

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    if (tournament.status !== TournamentStatus.REGISTRATION_OPEN) {
      throw new BadRequestException(
        "Registration is not open for this tournament"
      );
    }

    // Check if already registered
    if (tournament.participants?.some((p) => p.id === userId)) {
      throw new ConflictException("Already registered for this tournament");
    }

    // Check maximum participants
    if (tournament.participants?.length >= tournament.settings.maxPlayers) {
      throw new BadRequestException("Tournament is full");
    }

    // Validate deck if required
    if (tournament.settings.requireDeckList && registerDto.deckId) {
      const deck = await this.deckRepository.findOne({
        where: { id: registerDto.deckId, userId },
      });

      if (!deck) {
        throw new NotFoundException("Deck not found");
      }

      // Validate deck format matches tournament
      if (deck.format.toString() !== tournament.format.toString()) {
        throw new BadRequestException(
          `Deck format must be ${tournament.format}`
        );
      }

      if (!deck.isLegal) {
        throw new BadRequestException("Deck is not legal for tournament play");
      }
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Add user to tournament participants
    if (!tournament.participants) {
      tournament.participants = [];
    }
    tournament.participants.push(user);
    await this.tournamentRepository.save(tournament);

    // Create initial standing entry
    const standing = this.standingRepository.create({
      tournamentId,
      playerId: userId,
      position: tournament.participants.length,
    });
    await this.standingRepository.save(standing);
  }

  async unregister(tournamentId: string, userId: string): Promise<void> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
      relations: ["participants"],
    });

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    if (tournament.status === TournamentStatus.IN_PROGRESS) {
      throw new BadRequestException(
        "Cannot unregister while tournament is in progress. Use drop instead."
      );
    }

    if (!tournament.participants?.some((p) => p.id === userId)) {
      throw new BadRequestException("Not registered for this tournament");
    }

    // Remove user from participants
    tournament.participants = tournament.participants.filter(
      (p) => p.id !== userId
    );
    await this.tournamentRepository.save(tournament);

    // Remove standing entry
    await this.standingRepository.delete({ tournamentId, playerId: userId });
  }

  async startTournament(id: string, userId: string): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
      relations: ["participants"],
    });

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    if (tournament.organizerId !== userId) {
      throw new ForbiddenException(
        "Only the tournament organizer can start this tournament"
      );
    }

    if (tournament.status !== TournamentStatus.REGISTRATION_CLOSED) {
      throw new BadRequestException(
        "Tournament must be in registration closed state to start"
      );
    }

    if (
      !tournament.participants ||
      tournament.participants.length < tournament.settings.minPlayers
    ) {
      throw new BadRequestException(
        `Need at least ${tournament.settings.minPlayers} players to start`
      );
    }

    // Update status and generate first round pairings
    tournament.status = TournamentStatus.IN_PROGRESS;
    tournament.currentRound = 1;
    await this.tournamentRepository.save(tournament);

    // Generate round 1 pairings
    await this.generatePairings(id, 1);

    return this.findOneWithRelations(id);
  }

  async generatePairings(
    tournamentId: string,
    round: number
  ): Promise<TournamentMatch[]> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
      relations: ["participants", "standings"],
    });

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    const participants = tournament.participants || [];
    let pairings: TournamentMatch[] = [];

    switch (tournament.type) {
      case TournamentType.SWISS:
        pairings = await this.generateSwissPairings(
          tournamentId,
          round,
          participants,
          tournament.standings || []
        );
        break;
      case TournamentType.SINGLE_ELIMINATION:
        pairings = await this.generateEliminationPairings(
          tournamentId,
          round,
          participants
        );
        break;
      case TournamentType.ROUND_ROBIN:
        pairings = await this.generateRoundRobinPairings(
          tournamentId,
          round,
          participants
        );
        break;
      default:
        throw new BadRequestException(
          "Unsupported tournament type for pairing generation"
        );
    }

    return this.matchRepository.save(pairings);
  }

  async submitMatchResult(
    matchId: string,
    result: SubmitMatchResultDto,
    userId: string
  ): Promise<TournamentMatch> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ["tournament", "player1", "player2"],
    });

    if (!match) {
      throw new NotFoundException("Match not found");
    }

    // Check if user can submit result (player or judge)
    const canSubmit =
      match.player1Id === userId ||
      match.player2Id === userId ||
      match.judgeId === userId ||
      match.tournament.organizerId === userId;

    if (!canSubmit) {
      throw new ForbiddenException(
        "Not authorized to submit result for this match"
      );
    }

    if (match.isComplete) {
      throw new BadRequestException("Match result already submitted");
    }

    // Update match with result
    match.player1Wins = result.player1Wins;
    match.player2Wins = result.player2Wins;
    match.draws = result.draws || 0;
    match.notes = result.notes;
    match.isComplete = true;
    match.endTime = new Date();

    // Determine winner
    if (result.player1Wins > result.player2Wins) {
      match.result = "player1";
    } else if (result.player2Wins > result.player1Wins) {
      match.result = "player2";
    } else {
      match.result = "draw";
    }

    const savedMatch = await this.matchRepository.save(match);

    // Update Bayesian ratings based on match result
    try {
      if (match.player1Id && match.player2Id) {
        const outcomes = [
          {
            playerId: match.player1Id,
            rank:
              match.result === "player1"
                ? 1
                : match.result === "player2"
                ? 2
                : 1, // Ties both get rank 1
          },
          {
            playerId: match.player2Id,
            rank:
              match.result === "player2"
                ? 1
                : match.result === "player1"
                ? 2
                : 1, // Ties both get rank 1
          },
        ];

        await this.matchmakingService.updateRatings({
          format: match.tournament.format.toString(),
          outcomes,
          tournamentId: match.tournamentId,
          matchId: match.id,
        });
      }
    } catch (error) {
      console.warn("Failed to update Bayesian ratings:", error);
      // Continue with tournament flow even if rating update fails
    }

    // Update standings
    await this.updateStandings(match.tournamentId);

    // Check if round is complete
    await this.checkRoundComplete(match.tournamentId, match.round);

    return savedMatch;
  }

  async getStandings(tournamentId: string): Promise<TournamentStanding[]> {
    return this.standingRepository.find({
      where: { tournamentId },
      relations: ["player"],
      order: { position: "ASC" },
    });
  }

  async getMatches(
    tournamentId: string,
    round?: number
  ): Promise<TournamentMatch[]> {
    const where: any = { tournamentId };
    if (round) {
      where.round = round;
    }

    return this.matchRepository.find({
      where,
      relations: ["player1", "player2", "player1Deck", "player2Deck", "judge"],
      order: { round: "ASC", matchNumber: "ASC" },
    });
  }

  async dropPlayer(
    tournamentId: string,
    playerId: string,
    userId: string
  ): Promise<void> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    // Check permissions (player dropping themselves or tournament organizer)
    if (playerId !== userId && tournament.organizerId !== userId) {
      throw new ForbiddenException("Not authorized to drop this player");
    }

    if (!tournament.settings.allowDrops) {
      throw new BadRequestException("Drops are not allowed in this tournament");
    }

    const standing = await this.standingRepository.findOne({
      where: { tournamentId, playerId },
    });

    if (!standing) {
      throw new NotFoundException("Player not found in tournament");
    }

    if (standing.hasDropped) {
      throw new BadRequestException("Player has already dropped");
    }

    standing.hasDropped = true;
    standing.droppedInRound = tournament.currentRound;
    await this.standingRepository.save(standing);
  }

  async getTournamentStatistics(tournamentId: string): Promise<any> {
    const tournament = await this.findOneWithRelations(tournamentId);
    const matches = await this.getMatches(tournamentId);
    const standings = await this.getStandings(tournamentId);

    const completedMatches = matches.filter((m) => m.isComplete);
    const avgMatchLength =
      completedMatches.length > 0
        ? completedMatches.reduce((sum, m) => sum + m.durationMinutes, 0) /
          completedMatches.length
        : 0;

    // Calculate archetype breakdown (would need deck data)
    const archetypeBreakdown = []; // TODO: Implement based on deck archetypes

    return {
      tournamentId,
      totalPlayers: tournament.participants?.length || 0,
      completedRounds: tournament.currentRound,
      totalMatches: matches.length,
      completedMatches: completedMatches.length,
      averageMatchLength: Math.round(avgMatchLength),
      archetypeBreakdown,
      standings: standings.slice(0, 8), // Top 8
    };
  }

  // Private helper methods
  private async findOneWithRelations(id: string): Promise<Tournament> {
    return this.tournamentRepository.findOne({
      where: { id },
      relations: ["organizer", "participants", "matches", "standings"],
    });
  }

  private calculateTotalRounds(
    type: TournamentType,
    maxPlayers: number
  ): number {
    switch (type) {
      case TournamentType.SWISS:
        // Standard Swiss rounds formula: ceil(log2(players))
        return Math.ceil(Math.log2(maxPlayers));
      case TournamentType.SINGLE_ELIMINATION:
        return Math.ceil(Math.log2(maxPlayers));
      case TournamentType.DOUBLE_ELIMINATION:
        return Math.ceil(Math.log2(maxPlayers)) * 2;
      case TournamentType.ROUND_ROBIN:
        return maxPlayers - 1;
      default:
        return 0;
    }
  }

  private async generateSwissPairings(
    tournamentId: string,
    round: number,
    participants: User[],
    standings: TournamentStanding[]
  ): Promise<TournamentMatch[]> {
    // Get tournament to determine format
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
    });
    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    // Get previous pairings to avoid repeats
    const previousMatches = await this.matchRepository.find({
      where: { tournamentId },
    });

    const previousPairings = previousMatches
      .map((match) => {
        const pairing: string[] = [];
        if (match.player1Id) pairing.push(match.player1Id);
        if (match.player2Id) pairing.push(match.player2Id);
        return pairing;
      })
      .filter((pairing) => pairing.length === 2);

    try {
      // Use Bayesian matchmaking for optimal pairings
      const pairingResponse = await this.matchmakingService.generatePairings({
        playerIds: participants.map((p) => p.id),
        format: tournament.format.toString(),
        previousPairings,
        tournamentId,
        round,
      });

      const pairings: TournamentMatch[] = [];
      let matchNumber = 1;

      // Convert Bayesian pairings to tournament matches
      for (const pairing of pairingResponse.pairings) {
        pairings.push(
          this.matchRepository.create({
            tournamentId,
            round,
            matchNumber: matchNumber++,
            player1Id: pairing.players[0],
            player2Id: pairing.players[1],
            // Store match quality data in notes for reference
            notes: `Match Quality: ${pairing.quality.quality.toFixed(3)} (${
              pairing.quality.balanceCategory
            })`,
          })
        );
      }

      // Handle byes if odd number of players
      if (participants.length % 2 !== 0) {
        // Find player with lowest Bayesian rating for bye
        const playerRatings = await Promise.all(
          participants.map(async (p) => ({
            userId: p.id,
            rating: await this.matchmakingService.getPlayerRating(
              p.id,
              tournament.format.toString()
            ),
          }))
        );

        const pairedPlayerIds = new Set(
          pairings.flatMap((p) => [p.player1Id, p.player2Id])
        );
        const unpairedPlayer = playerRatings
          .filter((p) => !pairedPlayerIds.has(p.userId))
          .sort(
            (a, b) => a.rating.conservativeRating - b.rating.conservativeRating
          )[0];

        if (unpairedPlayer) {
          pairings.push(
            this.matchRepository.create({
              tournamentId,
              round,
              matchNumber: matchNumber++,
              player1Id: unpairedPlayer.userId,
              player2Id: null,
              result: "bye",
              isComplete: true,
              notes: "Bye round",
            })
          );
        }
      }

      return pairings;
    } catch (error) {
      console.warn(
        "Bayesian pairing failed, falling back to traditional Swiss:",
        error
      );

      // Fallback to traditional Swiss pairing
      return this.generateTraditionalSwissPairings(
        tournamentId,
        round,
        participants,
        standings
      );
    }
  }

  private async generateTraditionalSwissPairings(
    tournamentId: string,
    round: number,
    participants: User[],
    standings: TournamentStanding[]
  ): Promise<TournamentMatch[]> {
    // Sort players by standings for Swiss pairing
    const sortedPlayers = [...participants].sort((a, b) => {
      const standingA = standings.find((s) => s.playerId === a.id);
      const standingB = standings.find((s) => s.playerId === b.id);

      if (!standingA && !standingB) return 0;
      if (!standingA) return 1;
      if (!standingB) return -1;

      return standingB.matchPoints - standingA.matchPoints;
    });

    const pairings: TournamentMatch[] = [];
    const paired = new Set<string>();
    let matchNumber = 1;

    for (let i = 0; i < sortedPlayers.length; i++) {
      if (paired.has(sortedPlayers[i].id)) continue;

      let opponent = null;
      for (let j = i + 1; j < sortedPlayers.length; j++) {
        if (!paired.has(sortedPlayers[j].id)) {
          opponent = sortedPlayers[j];
          break;
        }
      }

      if (opponent) {
        paired.add(sortedPlayers[i].id);
        paired.add(opponent.id);

        pairings.push(
          this.matchRepository.create({
            tournamentId,
            round,
            matchNumber: matchNumber++,
            player1Id: sortedPlayers[i].id,
            player2Id: opponent.id,
          })
        );
      } else {
        // Bye for odd number of players
        pairings.push(
          this.matchRepository.create({
            tournamentId,
            round,
            matchNumber: matchNumber++,
            player1Id: sortedPlayers[i].id,
            player2Id: null,
            result: "bye",
            isComplete: true,
          })
        );
      }
    }

    return pairings;
  }

  private async generateEliminationPairings(
    tournamentId: string,
    round: number,
    participants: User[]
  ): Promise<TournamentMatch[]> {
    // TODO: Implement elimination bracket logic
    return [];
  }

  private async generateRoundRobinPairings(
    tournamentId: string,
    round: number,
    participants: User[]
  ): Promise<TournamentMatch[]> {
    // TODO: Implement round robin logic
    return [];
  }

  private async updateStandings(tournamentId: string): Promise<void> {
    const matches = await this.matchRepository.find({
      where: { tournamentId, isComplete: true },
    });

    const standings = await this.standingRepository.find({
      where: { tournamentId },
    });

    // Calculate new standings based on match results
    for (const standing of standings) {
      const playerMatches = matches.filter(
        (m) =>
          m.player1Id === standing.playerId || m.player2Id === standing.playerId
      );

      let wins = 0,
        losses = 0,
        draws = 0;
      let gameWins = 0,
        gameLosses = 0;

      for (const match of playerMatches) {
        const isPlayer1 = match.player1Id === standing.playerId;

        if (match.result === "bye") {
          wins += 1;
          gameWins += 2; // Byes count as 2-0
        } else if (match.result === "draw") {
          draws += 1;
          gameWins += match.draws || 0;
          gameLosses += match.draws || 0;
        } else if (
          (isPlayer1 && match.result === "player1") ||
          (!isPlayer1 && match.result === "player2")
        ) {
          wins += 1;
          if (isPlayer1) {
            gameWins += match.player1Wins;
            gameLosses += match.player2Wins;
          } else {
            gameWins += match.player2Wins;
            gameLosses += match.player1Wins;
          }
        } else {
          losses += 1;
          if (isPlayer1) {
            gameWins += match.player1Wins;
            gameLosses += match.player2Wins;
          } else {
            gameWins += match.player2Wins;
            gameLosses += match.player1Wins;
          }
        }
      }

      standing.wins = wins;
      standing.losses = losses;
      standing.draws = draws;
      standing.matchPoints = wins * 3 + draws * 1;
      standing.gamePoints = gameWins * 3 + gameLosses * 0; // Games won count as 3 points
      standing.gameWinPercentage =
        gameWins + gameLosses > 0
          ? (gameWins / (gameWins + gameLosses)) * 100
          : 0;

      await this.standingRepository.save(standing);
    }

    // Re-sort standings by match points, then by tiebreakers
    const updatedStandings = await this.standingRepository.find({
      where: { tournamentId },
      order: {
        matchPoints: "DESC",
        gameWinPercentage: "DESC",
      },
    });

    // Update positions
    for (let i = 0; i < updatedStandings.length; i++) {
      updatedStandings[i].position = i + 1;
      await this.standingRepository.save(updatedStandings[i]);
    }
  }

  private async checkRoundComplete(
    tournamentId: string,
    round: number
  ): Promise<void> {
    const roundMatches = await this.matchRepository.find({
      where: { tournamentId, round },
    });

    const allComplete = roundMatches.every((m) => m.isComplete);

    if (allComplete) {
      const tournament = await this.tournamentRepository.findOne({
        where: { id: tournamentId },
        relations: ["participants"],
      });

      if (tournament && round >= tournament.totalRounds) {
        // Tournament complete
        tournament.status = TournamentStatus.COMPLETED;
        tournament.endDate = new Date();
        await this.tournamentRepository.save(tournament);

        // Auto-award progression points (best-effort, non-blocking)
        try {
          await this.awardCompletionPoints(tournament);
        } catch (err) {
          console.warn("Failed to auto-award progression points:", err);
        }
      } else if (tournament) {
        // Ready for next round
        tournament.currentRound = round + 1;
        await this.tournamentRepository.save(tournament);
      }
    }
  }

  // Awards regional/global/format points to players based on final placement
  private async awardCompletionPoints(tournament: Tournament): Promise<void> {
    if (!tournament?.id) return;

    // Avoid duplicate awards if already processed for this event
    const alreadyAwarded = await this.progressionService.hasEventAwards(
      tournament.id
    );
    if (alreadyAwarded) return;

    const standings = await this.getStandings(tournament.id);
    if (!standings || standings.length === 0) return;

    const totalPlayers =
      tournament.participants?.length || standings.length || 0;

    // Simple, configurable awarding scheme by placement brackets
    // 1st, 2nd, Top 4, Top 8 receive tiered awards; others get participation
    const awardForPlacement = (position: number) => {
      if (position === 1) return { regional: 20, global: 8, format: 5 };
      if (position === 2) return { regional: 12, global: 5, format: 4 };
      if (position <= 4) return { regional: 8, global: 3, format: 3 };
      if (position <= 8) return { regional: 4, global: 1, format: 2 };
      return { regional: 1, global: 0, format: 0 };
    };

    // Apply awards
    for (const s of standings) {
      const { regional, global, format } = awardForPlacement(s.position);

      if (regional > 0) {
        await this.progressionService.applyPointUpdate({
          userId: s.playerId,
          eventId: tournament.id,
          points: regional,
          pointType: "regional",
        });
      }

      if (global > 0) {
        await this.progressionService.applyPointUpdate({
          userId: s.playerId,
          eventId: tournament.id,
          points: global,
          pointType: "global",
        });
      }

      if (format > 0) {
        await this.progressionService.applyPointUpdate({
          userId: s.playerId,
          eventId: tournament.id,
          points: format,
          pointType: "format",
          formatKey: tournament.format.toString(),
        });
      }
    }
  }
}
