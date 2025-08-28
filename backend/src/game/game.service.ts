import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Game,
  GameReplay,
  GameFormat,
  GameStatus,
  GameType,
  TurnPhase,
  Priority,
  GameState,
  GameAction,
  GamePermanent,
  AzothPool,
  StackEntry,
} from "./entities/game.entity";
import { User } from "../users/entities/user.entity";
import { Deck } from "../decks/entities/deck.entity";
import { Card } from "../cards/entities/card.entity";
import {
  CreateGameDto,
  JoinGameDto,
  GameActionDto,
  MulliganDecisionDto,
  GameSearchFilters,
} from "./dto/game.dto";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameReplay)
    private readonly replayRepository: Repository<GameReplay>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>
  ) {}

  async createGame(
    createGameDto: CreateGameDto,
    player1Id: string
  ): Promise<Game> {
    // Validate player 1 deck
    const player1Deck = await this.deckRepository.findOne({
      where: { id: createGameDto.player1DeckId, userId: player1Id },
    });

    if (!player1Deck) {
      throw new NotFoundException("Player 1 deck not found");
    }

    if (!player1Deck.isLegal) {
      throw new BadRequestException("Player 1 deck is not legal");
    }

    // Validate player 2 deck if provided
    let player2Deck = null;
    if (createGameDto.player2DeckId) {
      player2Deck = await this.deckRepository.findOne({
        where: { id: createGameDto.player2DeckId },
      });

      if (!player2Deck) {
        throw new NotFoundException("Player 2 deck not found");
      }
    }

    // Initialize game state
    const initialGameState: GameState = {
      currentTurn: 1,
      activePlayer: player1Id,
      priorityPlayer: player1Id,
      currentPhase: TurnPhase.START,
      stack: [],
      permanents: [],
      zones: {
        [player1Id]: {
          deck: this.shuffleDeck(
            player1Deck.mainboard.map((c) => c.cardId)
          ).slice(4), // Remove 4 life cards
          hand: [],
          field: [],
          combatRow: [],
          azothRow: [],
          lifeCards: this.shuffleDeck(
            player1Deck.mainboard.map((c) => c.cardId)
          ).slice(0, 4), // First 4 as life cards
          flag: player1Deck.commanderId || "", // Flag card (deck identity)
          removedFromPlay: [],
        },
        ...(createGameDto.player2Id && player2Deck
          ? {
              [createGameDto.player2Id]: {
                deck: this.shuffleDeck(
                  player2Deck.mainboard.map((c) => c.cardId)
                ).slice(4),
                hand: [],
                field: [],
                combatRow: [],
                azothRow: [],
                lifeCards: this.shuffleDeck(
                  player2Deck.mainboard.map((c) => c.cardId)
                ).slice(0, 4),
                flag: player2Deck.commanderId || "",
                removedFromPlay: [],
              },
            }
          : {}),
      },
      players: {
        [player1Id]: {
          lifeCardsRemaining: 4, // KONIVRER: Track remaining life cards
          azothPool: {
            fire: 0,
            water: 0,
            earth: 0,
            air: 0,
            aether: 0,
            nether: 0,
            generic: 0,
          },
          counters: {},
          temporaryEffects: [],
        },
        ...(createGameDto.player2Id
          ? {
              [createGameDto.player2Id]: {
                lifeCardsRemaining: 4,
                azothPool: {
                  fire: 0,
                  water: 0,
                  earth: 0,
                  air: 0,
                  aether: 0,
                  nether: 0,
                  generic: 0,
                },
                counters: {},
                temporaryEffects: [],
              },
            }
          : {}),
      },
      turnTimer: {
        [player1Id]: createGameDto.settings.timePerPlayer * 60, // Convert to seconds
        ...(createGameDto.player2Id
          ? {
              [createGameDto.player2Id]:
                createGameDto.settings.timePerPlayer * 60,
            }
          : {}),
      },
      gameActions: [],
    };

    const game = this.gameRepository.create({
      ...createGameDto,
      player1Id,
      gameState: initialGameState,
      status: createGameDto.player2Id
        ? GameStatus.MULLIGAN_PHASE
        : GameStatus.WAITING_FOR_PLAYERS,
    });

    const savedGame = await this.gameRepository.save(game);

    // Draw opening hands if both players are present
    if (createGameDto.player2Id) {
      await this.drawOpeningHands(savedGame.id);
    }

    return this.findOneWithRelations(savedGame.id);
  }

  async joinGame(
    gameId: string,
    userId: string,
    joinDto: JoinGameDto
  ): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    if (game.player2Id) {
      throw new BadRequestException("Game is already full");
    }

    if (game.player1Id === userId) {
      throw new BadRequestException("Cannot join your own game");
    }

    // Validate deck
    const deck = await this.deckRepository.findOne({
      where: { id: joinDto.deckId, userId },
    });

    if (!deck) {
      throw new NotFoundException("Deck not found");
    }

    if (!deck.isLegal) {
      throw new BadRequestException("Deck is not legal");
    }

    // Update game with player 2
    game.player2Id = userId;
    game.player2DeckId = joinDto.deckId;
    game.status = GameStatus.MULLIGAN_PHASE;

    // Add player 2 to game state
    game.gameState.zones[userId] = {
      deck: this.shuffleDeck(deck.mainboard.map((c) => c.cardId)).slice(4),
      hand: [],
      field: [],
      combatRow: [],
      azothRow: [],
      lifeCards: this.shuffleDeck(deck.mainboard.map((c) => c.cardId)).slice(
        0,
        4
      ),
      flag: deck.commanderId || "",
      removedFromPlay: [],
    };

    game.gameState.players[userId] = {
      lifeCardsRemaining: 4,
      azothPool: {
        fire: 0,
        water: 0,
        earth: 0,
        air: 0,
        aether: 0,
        nether: 0,
        generic: 0,
      },
      counters: {},
      temporaryEffects: [],
    };

    game.gameState.turnTimer[userId] = game.settings.timePerPlayer * 60;

    await this.gameRepository.save(game);
    await this.drawOpeningHands(gameId);

    return this.findOneWithRelations(gameId);
  }

  async findAll(
    filters: GameSearchFilters,
    userId?: string
  ): Promise<{ games: Game[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 20,
      format,
      type,
      playerId,
      spectatable,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = filters;

    const queryBuilder = this.gameRepository
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.player1", "player1")
      .leftJoinAndSelect("game.player2", "player2")
      .where("1 = 1");

    // Apply filters
    if (format) {
      queryBuilder.andWhere("game.format = :format", { format });
    }

    if (type) {
      queryBuilder.andWhere("game.type = :type", { type });
    }

    if (playerId) {
      queryBuilder.andWhere(
        "(game.player1Id = :playerId OR game.player2Id = :playerId)",
        { playerId }
      );
    }

    if (spectatable) {
      queryBuilder.andWhere("game.settings ->> 'enableSpectators' = 'true'");
      queryBuilder.andWhere("game.status = :inProgress", {
        inProgress: GameStatus.IN_PROGRESS,
      });
    }

    // Apply sorting
    const validSortFields = ["createdAt", "startedAt"];
    if (validSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`game.${sortBy}`, sortOrder as "ASC" | "DESC");
    }

    // Pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [games, total] = await queryBuilder.getManyAndCount();

    return {
      games,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId?: string): Promise<Game> {
    const game = await this.findOneWithRelations(id);

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    // Check if user can view this game
    const canView =
      game.player1Id === userId ||
      game.player2Id === userId ||
      (game.settings.enableSpectators && game.spectators?.includes(userId));

    if (!canView && userId) {
      throw new ForbiddenException("Access denied");
    }

    return game;
  }

  async performAction(
    gameId: string,
    userId: string,
    actionDto: GameActionDto
  ): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new BadRequestException("Game is not in progress");
    }

    // Validate player can perform action
    if (game.player1Id !== userId && game.player2Id !== userId) {
      throw new ForbiddenException("Not a player in this game");
    }

    // Validate it's the player's turn or they have priority
    if (
      game.gameState.priorityPlayer !== userId &&
      !this.canPerformActionOutOfTurn(actionDto.type, game.gameState)
    ) {
      throw new BadRequestException("Not your priority");
    }

    // Process the action based on type
    const updatedGameState = await this.processGameAction(
      game,
      userId,
      actionDto
    );
    game.gameState = updatedGameState;

    // Check for win conditions
    const winner = this.checkWinConditions(game);
    if (winner) {
      game.status = GameStatus.COMPLETED;
      game.winnerId = winner.playerId;
      game.winCondition = winner.condition;
      game.endedAt = new Date();
    }

    await this.gameRepository.save(game);

    return this.findOneWithRelations(gameId);
  }

  async submitMulliganDecision(
    gameId: string,
    userId: string,
    decision: MulliganDecisionDto
  ): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    if (game.status !== GameStatus.MULLIGAN_PHASE) {
      throw new BadRequestException("Not in mulligan phase");
    }

    if (game.player1Id !== userId && game.player2Id !== userId) {
      throw new ForbiddenException("Not a player in this game");
    }

    // Process mulligan decision
    if (!decision.keep) {
      // Mulligan: shuffle hand back, draw one less card
      const playerZone = game.gameState.zones[userId];
      const handSize = playerZone.hand.length;

      // Add hand back to deck and shuffle
      playerZone.deck = this.shuffleDeck([
        ...playerZone.deck,
        ...playerZone.hand,
      ]);
      playerZone.hand = [];

      // Draw new hand (one less card)
      const newHandSize = Math.max(0, handSize - 1);
      for (let i = 0; i < newHandSize; i++) {
        const card = playerZone.deck.shift();
        if (card) {
          playerZone.hand.push(card);
        }
      }
    }

    // Track mulligan decisions (simplified - would need proper tracking)
    const allPlayersDecided = true; // TODO: Implement proper mulligan tracking

    if (allPlayersDecided) {
      game.status = GameStatus.IN_PROGRESS;
      game.startedAt = new Date();

      // Start first turn
      await this.startTurn(game, game.player1Id);
    }

    await this.gameRepository.save(game);

    return this.findOneWithRelations(gameId);
  }

  async spectateGame(gameId: string, userId: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    if (!game.settings.enableSpectators) {
      throw new BadRequestException("Spectators not allowed");
    }

    if (game.player1Id === userId || game.player2Id === userId) {
      throw new BadRequestException("Players cannot spectate their own game");
    }

    if (!game.spectators) {
      game.spectators = [];
    }

    if (!game.spectators.includes(userId)) {
      game.spectators.push(userId);
      await this.gameRepository.save(game);
    }

    return this.findOneWithRelations(gameId);
  }

  async forfeit(gameId: string, userId: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    if (game.player1Id !== userId && game.player2Id !== userId) {
      throw new ForbiddenException("Not a player in this game");
    }

    if (game.status === GameStatus.COMPLETED) {
      throw new BadRequestException("Game is already complete");
    }

    // Determine winner (opponent)
    const winnerId =
      game.player1Id === userId ? game.player2Id : game.player1Id;

    game.status = GameStatus.COMPLETED;
    game.winnerId = winnerId;
    game.winCondition = "Forfeit";
    game.endedAt = new Date();

    await this.gameRepository.save(game);

    return this.findOneWithRelations(gameId);
  }

  async getGameHistory(playerId: string, limit: number = 10): Promise<Game[]> {
    return this.gameRepository.find({
      where: [{ player1Id: playerId }, { player2Id: playerId }],
      relations: ["player1", "player2", "player1Deck", "player2Deck"],
      order: { createdAt: "DESC" },
      take: limit,
    });
  }

  async createReplay(gameId: string): Promise<GameReplay> {
    const game = await this.findOneWithRelations(gameId);

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    if (game.status !== GameStatus.COMPLETED) {
      throw new BadRequestException("Game must be completed to create replay");
    }

    const replay = this.replayRepository.create({
      gameId,
      actions: game.gameState.gameActions,
      snapshots: [], // TODO: Implement state snapshots
      title: `${game.player1.username} vs ${game.player2?.username || "AI"}`,
    });

    return this.replayRepository.save(replay);
  }

  // Private helper methods
  private async findOneWithRelations(id: string): Promise<Game> {
    return this.gameRepository.findOne({
      where: { id },
      relations: ["player1", "player2", "player1Deck", "player2Deck"],
    });
  }

  private shuffleDeck(cards: string[]): string[] {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private async drawOpeningHands(gameId: string): Promise<void> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) return;

    const handSize = 2; // KONIVRER: Draw 2 cards on first turn only

    // Draw for player 1 (first turn only)
    for (let i = 0; i < handSize; i++) {
      const card = game.gameState.zones[game.player1Id].deck.shift();
      if (card) {
        game.gameState.zones[game.player1Id].hand.push(card);
      }
    }

    // Draw for player 2 if exists (first turn only)
    if (game.player2Id) {
      for (let i = 0; i < handSize; i++) {
        const card = game.gameState.zones[game.player2Id].deck.shift();
        if (card) {
          game.gameState.zones[game.player2Id].hand.push(card);
        }
      }
    }

    await this.gameRepository.save(game);
  }

  private async startTurn(game: Game, playerId: string): Promise<void> {
    game.gameState.activePlayer = playerId;
    game.gameState.priorityPlayer = playerId;
    game.gameState.currentPhase = TurnPhase.START;

    // KONIVRER: Refresh Azoth sources (untap them)
    game.gameState.permanents
      .filter((p) => p.controllerId === playerId && p.zone === "azothRow")
      .forEach((p) => (p.tapped = false));

    // KONIVRER: Clear Azoth pool at start of turn
    game.gameState.players[playerId].azothPool = {
      fire: 0,
      water: 0,
      earth: 0,
      air: 0,
      aether: 0,
      nether: 0,
      generic: 0,
    };

    this.addGameAction(
      game,
      playerId,
      "start_turn",
      {},
      `${playerId} starts turn ${game.gameState.currentTurn}`
    );
  }

  private async processGameAction(
    game: Game,
    playerId: string,
    action: GameActionDto
  ): Promise<GameState> {
    const newState = { ...game.gameState };

    switch (action.type) {
      case "play_card":
        return this.processPlayCard(newState, playerId, action);
      case "pass_priority":
        return this.processPassPriority(newState, playerId);
      case "activate_ability":
        return this.processActivateAbility(newState, playerId, action);
      case "declare_attackers":
        return this.processDeclareAttackers(newState, playerId, action);
      case "declare_blockers":
        return this.processDeclareBlockers(newState, playerId, action);
      default:
        throw new BadRequestException(`Unknown action type: ${action.type}`);
    }
  }

  private processPlayCard(
    gameState: GameState,
    playerId: string,
    action: GameActionDto
  ): GameState {
    // TODO: Implement card playing logic
    // - Validate card is in hand
    // - Check mana cost
    // - Apply mana payment
    // - Add to stack or battlefield
    // - Trigger abilities

    this.addGameActionToState(
      gameState,
      playerId,
      "play_card",
      action.data,
      `Played ${action.cardId}`
    );
    return gameState;
  }

  private processPassPriority(
    gameState: GameState,
    playerId: string
  ): GameState {
    // TODO: Implement priority passing logic
    // - Pass priority to next player
    // - If all players pass with empty stack, proceed to next phase
    // - Resolve stack if all players pass with non-empty stack

    this.addGameActionToState(
      gameState,
      playerId,
      "pass_priority",
      {},
      "Passed priority"
    );
    return gameState;
  }

  private processActivateAbility(
    gameState: GameState,
    playerId: string,
    action: GameActionDto
  ): GameState {
    // TODO: Implement ability activation
    this.addGameActionToState(
      gameState,
      playerId,
      "activate_ability",
      action.data,
      "Activated ability"
    );
    return gameState;
  }

  private processDeclareAttackers(
    gameState: GameState,
    playerId: string,
    action: GameActionDto
  ): GameState {
    // TODO: Implement attacker declaration
    this.addGameActionToState(
      gameState,
      playerId,
      "declare_attackers",
      action.data,
      "Declared attackers"
    );
    return gameState;
  }

  private processDeclareBlockers(
    gameState: GameState,
    playerId: string,
    action: GameActionDto
  ): GameState {
    // TODO: Implement blocker declaration
    this.addGameActionToState(
      gameState,
      playerId,
      "declare_blockers",
      action.data,
      "Declared blockers"
    );
    return gameState;
  }

  private canPerformActionOutOfTurn(
    actionType: string,
    gameState: GameState
  ): boolean {
    // Certain actions like instant spells or abilities can be performed at any time
    const instantActions = [
      "play_instant",
      "activate_ability",
      "respond_to_spell",
    ];
    return instantActions.includes(actionType);
  }

  private checkWinConditions(
    game: Game
  ): { playerId: string; condition: string } | null {
    // Check various win conditions
    for (const [playerId, playerState] of Object.entries(
      game.gameState.players
    )) {
      // KONIVRER: Life Cards instead of life total
      if (playerState.lifeCardsRemaining <= 0) {
        const winnerId =
          playerId === game.player1Id ? game.player2Id : game.player1Id;
        return { playerId: winnerId, condition: "Life Cards depleted" };
      }

      // Deck out - no cards left to draw
      const zone = game.gameState.zones[playerId];
      if (zone.deck.length === 0) {
        const winnerId =
          playerId === game.player1Id ? game.player2Id : game.player1Id;
        return { playerId: winnerId, condition: "Deck out" };
      }
    }

    return null;
  }

  private addGameAction(
    game: Game,
    playerId: string,
    type: string,
    data: any,
    description: string
  ): void {
    const action: GameAction = {
      id: `action_${Date.now()}_${Math.random()}`,
      playerId,
      type,
      timestamp: new Date(),
      data,
      description,
    };

    game.gameState.gameActions.push(action);
  }

  private addGameActionToState(
    gameState: GameState,
    playerId: string,
    type: string,
    data: any,
    description: string
  ): void {
    const action: GameAction = {
      id: `action_${Date.now()}_${Math.random()}`,
      playerId,
      type,
      timestamp: new Date(),
      data,
      description,
    };

    gameState.gameActions.push(action);
  }
}
