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
    private readonly cardRepository: Repository<Card>,
  ) {}

  async createGame(
    createGameDto: CreateGameDto,
    player1Id: string,
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
            player1Deck.mainboard.map((c) => c.cardId),
          ).slice(4), // Remove 4 life cards
          hand: [],
          field: [],
          combatRow: [],
          azothRow: [],
          lifeCards: this.shuffleDeck(
            player1Deck.mainboard.map((c) => c.cardId),
          ).slice(0, 4), // First 4 as life cards
          flag: player1Deck.commanderId || "", // Flag card (deck identity)
          removedFromPlay: [],
        },
        ...(createGameDto.player2Id && player2Deck
          ? {
              [createGameDto.player2Id]: {
                deck: this.shuffleDeck(
                  player2Deck.mainboard.map((c) => c.cardId),
                ).slice(4),
                hand: [],
                field: [],
                combatRow: [],
                azothRow: [],
                lifeCards: this.shuffleDeck(
                  player2Deck.mainboard.map((c) => c.cardId),
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
    joinDto: JoinGameDto,
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
        4,
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
    userId?: string,
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
        { playerId },
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
    actionDto: GameActionDto,
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
      actionDto,
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
    decision: MulliganDecisionDto,
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
      `${playerId} starts turn ${game.gameState.currentTurn}`,
    );
  }

  private async processGameAction(
    game: Game,
    playerId: string,
    action: GameActionDto,
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
    action: GameActionDto,
  ): GameState {
    const { cardId, playMode, targetId, additionalCosts } = action.data;
    
    // Validate card is in hand
    const playerZone = gameState.zones[playerId];
    const cardIndex = playerZone.hand.findIndex(card => card === cardId);
    if (cardIndex === -1) {
      throw new BadRequestException("Card not in hand");
    }

    // Get card data (would normally fetch from database)
    const card = await this.getCardById(cardId);
    if (!card) {
      throw new BadRequestException("Card not found");
    }

    // Validate play mode
    const validModes = this.getValidPlayModes(card, gameState, playerId);
    if (!validModes.includes(playMode)) {
      throw new BadRequestException(`Invalid play mode: ${playMode}`);
    }

    // Check and pay costs
    const cost = this.calculateCardCost(card, playMode, additionalCosts);
    if (!this.canPayCost(cost, gameState.players[playerId].azothPool)) {
      throw new BadRequestException("Cannot pay card cost");
    }

    // Pay costs
    this.payCost(cost, gameState.players[playerId].azothPool);

    // Remove card from hand
    playerZone.hand.splice(cardIndex, 1);

    // Process based on play mode
    switch (playMode) {
      case "summon":
        return this.processSummonCard(gameState, playerId, card, targetId);
      case "spell":
        return this.processSpellCard(gameState, playerId, card, targetId);
      case "azoth":
        return this.processAzothCard(gameState, playerId, card);
      case "tribute":
        return this.processTributeCard(gameState, playerId, card, targetId);
      case "burst":
        return this.processBurstCard(gameState, playerId, card, targetId);
      default:
        throw new BadRequestException(`Unknown play mode: ${playMode}`);
    }
  }

  private async getCardById(cardId: string): Promise<any> {
    // In production, this would fetch from database
    // For now, return mock card data
    return {
      id: cardId,
      name: "Sample Card",
      elements: ["fire"],
      azothCost: 2,
      playModes: ["summon", "spell", "azoth"],
      abilities: ["inferno"],
      power: 2,
      toughness: 2
    };
  }

  private getValidPlayModes(card: any, gameState: GameState, playerId: string): string[] {
    const modes = card.playModes || [];
    
    // Check game state restrictions
    if (gameState.currentPhase === "combat" && !modes.includes("instant")) {
      return modes.filter(mode => mode === "instant" || mode === "ability");
    }
    
    return modes;
  }

  private calculateCardCost(card: any, playMode: string, additionalCosts: any): any {
    const baseCost = {
      fire: 0,
      water: 0,
      earth: 0,
      air: 0,
      aether: 0,
      nether: 0,
      generic: card.azothCost || 0
    };

    // Add elemental costs based on card elements
    card.elements.forEach(element => {
      if (baseCost.hasOwnProperty(element.toLowerCase())) {
        baseCost[element.toLowerCase()]++;
      }
    });

    // Add additional costs
    if (additionalCosts) {
      Object.keys(additionalCosts).forEach(element => {
        baseCost[element] += additionalCosts[element];
      });
    }

    return baseCost;
  }

  private canPayCost(cost: any, azothPool: any): boolean {
    return Object.keys(cost).every(element => 
      azothPool[element] >= cost[element]
    );
  }

  private payCost(cost: any, azothPool: any): void {
    Object.keys(cost).forEach(element => {
      azothPool[element] -= cost[element];
    });
  }

  private processSummonCard(gameState: GameState, playerId: string, card: any, targetId?: string): GameState {
    // Add to field zone
    const playerZone = gameState.zones[playerId];
    const permanent = {
      id: `permanent_${Date.now()}_${Math.random()}`,
      cardId: card.id,
      controllerId: playerId,
      zone: "field",
      tapped: false,
      counters: {},
      abilities: card.abilities || []
    };

    gameState.permanents.push(permanent);
    playerZone.field.push(permanent.id);

    // Trigger enter the battlefield abilities
    this.triggerEnterTheBattlefield(gameState, permanent);

    this.addGameActionToState(
      gameState,
      playerId,
      "summon_card",
      { cardId: card.id, permanentId: permanent.id },
      `Summoned ${card.name}`
    );

    return gameState;
  }

  private processSpellCard(gameState: GameState, playerId: string, card: any, targetId?: string): GameState {
    // Add to stack (DRC)
    const stackEntry = {
      id: `spell_${Date.now()}_${Math.random()}`,
      cardId: card.id,
      controllerId: playerId,
      type: "spell",
      targetId,
      timestamp: new Date()
    };

    gameState.stack.push(stackEntry);

    this.addGameActionToState(
      gameState,
      playerId,
      "cast_spell",
      { cardId: card.id, stackId: stackEntry.id },
      `Cast ${card.name}`
    );

    return gameState;
  }

  private processAzothCard(gameState: GameState, playerId: string, card: any): GameState {
    // Add to azoth row
    const playerZone = gameState.zones[playerId];
    const azothSource = {
      id: `azoth_${Date.now()}_${Math.random()}`,
      cardId: card.id,
      controllerId: playerId,
      zone: "azothRow",
      tapped: false,
      produces: card.elements || ["generic"]
    };

    gameState.permanents.push(azothSource);
    playerZone.azothRow.push(azothSource.id);

    this.addGameActionToState(
      gameState,
      playerId,
      "play_azoth",
      { cardId: card.id, azothId: azothSource.id },
      `Played ${card.name} as Azoth`
    );

    return gameState;
  }

  private processTributeCard(gameState: GameState, playerId: string, card: any, targetId?: string): GameState {
    // Sacrifice target and play card
    if (targetId) {
      this.sacrificePermanent(gameState, targetId);
    }

    // Process as spell
    return this.processSpellCard(gameState, playerId, card);
  }

  private processBurstCard(gameState: GameState, playerId: string, card: any, targetId?: string): GameState {
    // Play from life cards (free)
    const playerZone = gameState.zones[playerId];
    const lifeCardIndex = playerZone.lifeCards.findIndex(id => id === card.id);
    
    if (lifeCardIndex === -1) {
      throw new BadRequestException("Card not in life cards");
    }

    // Remove from life cards
    playerZone.lifeCards.splice(lifeCardIndex, 1);
    gameState.players[playerId].lifeCardsRemaining--;

    // Process as spell
    return this.processSpellCard(gameState, playerId, card, targetId);
  }

  private triggerEnterTheBattlefield(gameState: GameState, permanent: any): void {
    // Process enter the battlefield abilities
    permanent.abilities.forEach(ability => {
      switch (ability) {
        case "inferno":
          this.processInfernoAbility(gameState, permanent);
          break;
        case "brilliance":
          this.processBrillianceAbility(gameState, permanent);
          break;
        case "gust":
          this.processGustAbility(gameState, permanent);
          break;
        case "steadfast":
          this.processSteadfastAbility(gameState, permanent);
          break;
        case "submerged":
          this.processSubmergedAbility(gameState, permanent);
          break;
        case "quintessence":
          this.processQuintessenceAbility(gameState, permanent);
          break;
        case "void":
          this.processVoidAbility(gameState, permanent);
          break;
        case "amalgam":
          this.processAmalgamAbility(gameState, permanent);
          break;
      }
    });
  }

  private processInfernoAbility(gameState: GameState, permanent: any): void {
    // Inferno: Deal damage equal to power to target player
    const damage = permanent.power || 1;
    const targetPlayer = this.getOpponent(gameState, permanent.controllerId);
    if (targetPlayer) {
      this.dealDamage(gameState, targetPlayer, damage);
    }
  }

  private processBrillianceAbility(gameState: GameState, permanent: any): void {
    // Brilliance: Place target with Strength ≤ Aether paid on bottom of owner's life cards
    // This is a triggered ability that requires targeting
    this.addTriggeredAbility(gameState, permanent, "brilliance");
  }

  private processGustAbility(gameState: GameState, permanent: any): void {
    // Gust: Return target with Strength ≤ Air paid to owner's hand
    this.addTriggeredAbility(gameState, permanent, "gust");
  }

  private processSteadfastAbility(gameState: GameState, permanent: any): void {
    // Steadfast: Redirect damage ≤ Earth used to pay for this card's Strength
    this.addTriggeredAbility(gameState, permanent, "steadfast");
  }

  private processSubmergedAbility(gameState: GameState, permanent: any): void {
    // Submerged: Place target Familiar with +1 Counters or Spell with Strength ≤ Water paid
    this.addTriggeredAbility(gameState, permanent, "submerged");
  }

  private processQuintessenceAbility(gameState: GameState, permanent: any): void {
    // Quintessence: This card can't be played as a Familiar. While in the Azoth row, it produces any Azoth type
    if (permanent.zone === "azothRow") {
      permanent.produces = ["fire", "water", "earth", "air", "aether", "nether", "generic"];
    }
  }

  private processVoidAbility(gameState: GameState, permanent: any): void {
    // Void: Remove target card from the game
    this.addTriggeredAbility(gameState, permanent, "void");
  }

  private processAmalgamAbility(gameState: GameState, permanent: any): void {
    // Amalgam: Choose one of two options when played
    // This is handled during card playing, not as a triggered ability
  }

  private addTriggeredAbility(gameState: GameState, permanent: any, abilityType: string): void {
    // Add to stack for resolution
    const stackEntry = {
      id: `ability_${Date.now()}_${Math.random()}`,
      permanentId: permanent.id,
      controllerId: permanent.controllerId,
      type: "ability",
      abilityType,
      timestamp: new Date()
    };

    gameState.stack.push(stackEntry);
  }

  // Keyword ability implementations
  private processBrillianceTarget(gameState: GameState, stackEntry: any, targetId: string): void {
    const permanent = gameState.permanents.find(p => p.id === targetId);
    if (!permanent) return;

    const targetPlayer = this.getPlayerByPermanentId(gameState, targetId);
    if (!targetPlayer) return;

    // Place on bottom of life cards
    const playerZone = gameState.zones[targetPlayer];
    playerZone.lifeCards.push(permanent.cardId);

    // Remove from current zone
    this.removePermanentFromZone(gameState, permanent);

    this.addGameActionToState(
      gameState,
      stackEntry.controllerId,
      "brilliance_effect",
      { targetId, abilityType: "brilliance" },
      "Brilliance effect resolved"
    );
  }

  private processGustTarget(gameState: GameState, stackEntry: any, targetId: string): void {
    const permanent = gameState.permanents.find(p => p.id === targetId);
    if (!permanent) return;

    const targetPlayer = this.getPlayerByPermanentId(gameState, targetId);
    if (!targetPlayer) return;

    // Return to hand
    const playerZone = gameState.zones[targetPlayer];
    playerZone.hand.push(permanent.cardId);

    // Remove from current zone
    this.removePermanentFromZone(gameState, permanent);

    this.addGameActionToState(
      gameState,
      stackEntry.controllerId,
      "gust_effect",
      { targetId, abilityType: "gust" },
      "Gust effect resolved"
    );
  }

  private processVoidTarget(gameState: GameState, stackEntry: any, targetId: string): void {
    const permanent = gameState.permanents.find(p => p.id === targetId);
    if (!permanent) return;

    // Remove from game permanently
    this.removePermanentFromZone(gameState, permanent);
    permanent.zone = "removedFromPlay";

    this.addGameActionToState(
      gameState,
      stackEntry.controllerId,
      "void_effect",
      { targetId, abilityType: "void" },
      "Void effect resolved"
    );
  }

  private removePermanentFromZone(gameState: GameState, permanent: any): void {
    const playerZone = gameState.zones[permanent.controllerId];
    const zoneArray = playerZone[permanent.zone];
    const index = zoneArray.indexOf(permanent.id);
    if (index > -1) {
      zoneArray.splice(index, 1);
    }
  }

  private sacrificePermanent(gameState: GameState, permanentId: string): void {
    const permanent = gameState.permanents.find(p => p.id === permanentId);
    if (permanent) {
      // Remove from zone
      const playerZone = gameState.zones[permanent.controllerId];
      const zoneArray = playerZone[permanent.zone];
      const index = zoneArray.indexOf(permanentId);
      if (index > -1) {
        zoneArray.splice(index, 1);
      }

      // Move to removed from play
      playerZone.removedFromPlay.push(permanentId);
      permanent.zone = "removedFromPlay";
    }
  }

  private dealDamage(gameState: GameState, playerId: string, damage: number): void {
    // Deal damage to life cards
    const playerZone = gameState.zones[playerId];
    const lifeCardsToRemove = Math.min(damage, playerZone.lifeCards.length);
    
    for (let i = 0; i < lifeCardsToRemove; i++) {
      const lifeCard = playerZone.lifeCards.shift();
      if (lifeCard) {
        playerZone.removedFromPlay.push(lifeCard);
      }
    }

    gameState.players[playerId].lifeCardsRemaining -= lifeCardsToRemove;
  }

  private processPassPriority(
    gameState: GameState,
    playerId: string,
  ): GameState {
    // Pass priority to next player
    const nextPlayer = this.getNextPlayer(gameState, playerId);
    gameState.priorityPlayer = nextPlayer;

    // If all players have passed priority
    if (this.allPlayersPassedPriority(gameState)) {
      if (gameState.stack.length > 0) {
        // Resolve stack (DRC)
        this.resolveStack(gameState);
      } else {
        // Proceed to next phase
        this.advancePhase(gameState);
      }
    }

    this.addGameActionToState(
      gameState,
      playerId,
      "pass_priority",
      {},
      "Passed priority",
    );
    return gameState;
  }

  private getNextPlayer(gameState: GameState, currentPlayer: string): string {
    const players = Object.keys(gameState.zones);
    const currentIndex = players.indexOf(currentPlayer);
    return players[(currentIndex + 1) % players.length];
  }

  private allPlayersPassedPriority(gameState: GameState): boolean {
    // Simplified: assume all players pass if current player passes
    // In production, track who has passed this round
    return true;
  }

  private resolveStack(gameState: GameState): void {
    // DRC: Last in, first out
    while (gameState.stack.length > 0) {
      const stackEntry = gameState.stack.pop();
      this.resolveStackEntry(gameState, stackEntry);
    }
  }

  private resolveStackEntry(gameState: GameState, stackEntry: any): void {
    // Resolve the spell or ability
    switch (stackEntry.type) {
      case "spell":
        this.resolveSpell(gameState, stackEntry);
        break;
      case "ability":
        this.resolveAbility(gameState, stackEntry);
        break;
      default:
        console.warn(`Unknown stack entry type: ${stackEntry.type}`);
    }
  }

  private resolveSpell(gameState: GameState, stackEntry: any): void {
    // Get card data
    const card = this.getCardById(stackEntry.cardId);
    
    // Process spell effect
    if (card.abilities.includes("inferno")) {
      this.processInfernoSpell(gameState, stackEntry);
    }
    // Add other spell types here

    // Move to bottom of deck (KONIVRER rule)
    const playerZone = gameState.zones[stackEntry.controllerId];
    playerZone.deck.push(stackEntry.cardId);

    this.addGameActionToState(
      gameState,
      stackEntry.controllerId,
      "resolve_spell",
      { cardId: stackEntry.cardId },
      `Resolved ${card.name}`
    );
  }

  private resolveAbility(gameState: GameState, stackEntry: any): void {
    // Process ability effect based on type
    switch (stackEntry.abilityType) {
      case "brilliance":
        this.processBrillianceTarget(gameState, stackEntry, stackEntry.targetId);
        break;
      case "gust":
        this.processGustTarget(gameState, stackEntry, stackEntry.targetId);
        break;
      case "void":
        this.processVoidTarget(gameState, stackEntry, stackEntry.targetId);
        break;
      case "steadfast":
        this.processSteadfastEffect(gameState, stackEntry);
        break;
      case "submerged":
        this.processSubmergedTarget(gameState, stackEntry, stackEntry.targetId);
        break;
      default:
        this.addGameActionToState(
          gameState,
          stackEntry.controllerId,
          "resolve_ability",
          { abilityId: stackEntry.abilityId, abilityType: stackEntry.abilityType },
          "Resolved ability"
        );
    }
  }

  private processSteadfastEffect(gameState: GameState, stackEntry: any): void {
    // Steadfast: Redirect damage to this permanent
    const permanent = gameState.permanents.find(p => p.id === stackEntry.permanentId);
    if (permanent) {
      // Set up damage redirection
      permanent.redirectDamage = true;
      
      this.addGameActionToState(
        gameState,
        stackEntry.controllerId,
        "steadfast_effect",
        { permanentId: permanent.id, abilityType: "steadfast" },
        "Steadfast protection active"
      );
    }
  }

  private processSubmergedTarget(gameState: GameState, stackEntry: any, targetId: string): void {
    const permanent = gameState.permanents.find(p => p.id === targetId);
    if (!permanent) return;

    const targetPlayer = this.getPlayerByPermanentId(gameState, targetId);
    if (!targetPlayer) return;

    // Place cards below the top of owner's deck
    const playerZone = gameState.zones[targetPlayer];
    const cardsToBury = permanent.counters?.["+1"] || 1;
    
    for (let i = 0; i < cardsToBury; i++) {
      if (playerZone.deck.length > 0) {
        const card = playerZone.deck.shift();
        playerZone.deck.splice(1, 0, card); // Insert at position 1 (below top)
      }
    }

    // Remove from current zone
    this.removePermanentFromZone(gameState, permanent);

    this.addGameActionToState(
      gameState,
      stackEntry.controllerId,
      "submerged_effect",
      { targetId, abilityType: "submerged" },
      "Submerged effect resolved"
    );
  }

  private processInfernoSpell(gameState: GameState, stackEntry: any): void {
    // Deal damage to target or opponent
    const targetPlayer = stackEntry.targetId ? 
      this.getPlayerByPermanentId(gameState, stackEntry.targetId) : 
      this.getOpponent(gameState, stackEntry.controllerId);
    
    if (targetPlayer) {
      this.dealDamage(gameState, targetPlayer, 2); // Default damage
    }
  }

  private getPlayerByPermanentId(gameState: GameState, permanentId: string): string | null {
    const permanent = gameState.permanents.find(p => p.id === permanentId);
    return permanent ? permanent.controllerId : null;
  }

  private getOpponent(gameState: GameState, playerId: string): string | null {
    const players = Object.keys(gameState.zones);
    return players.find(p => p !== playerId) || null;
  }

  private advancePhase(gameState: GameState): void {
    const phases = ["start", "main", "combat", "postCombat", "refresh"];
    const currentIndex = phases.indexOf(gameState.currentPhase);
    
    if (currentIndex < phases.length - 1) {
      gameState.currentPhase = phases[currentIndex + 1];
    } else {
      // End turn
      this.endTurn(gameState);
    }
  }

  private endTurn(gameState: GameState): void {
    // Switch to next player
    const nextPlayer = this.getNextPlayer(gameState, gameState.activePlayer);
    gameState.activePlayer = nextPlayer;
    gameState.priorityPlayer = nextPlayer;
    gameState.currentPhase = "start";
    gameState.currentTurn++;

    // Draw card (KONIVRER: draw every turn)
    this.drawCard(gameState, nextPlayer);

    // Refresh Azoth sources
    this.refreshAzothSources(gameState, nextPlayer);
  }

  private drawCard(gameState: GameState, playerId: string): void {
    const playerZone = gameState.zones[playerId];
    if (playerZone.deck.length > 0) {
      const card = playerZone.deck.shift();
      playerZone.hand.push(card);
      
      this.addGameActionToState(
        gameState,
        playerId,
        "draw_card",
        { cardId: card },
        "Drew a card"
      );
    }
  }

  private refreshAzothSources(gameState: GameState, playerId: string): void {
    // Untap all Azoth sources
    gameState.permanents
      .filter(p => p.controllerId === playerId && p.zone === "azothRow")
      .forEach(p => p.tapped = false);

    // Add Azoth to pool
    this.addAzothToPool(gameState, playerId);
  }

  private addAzothToPool(gameState: GameState, playerId: string): void {
    const playerZone = gameState.zones[playerId];
    const azothSources = gameState.permanents.filter(
      p => p.controllerId === playerId && p.zone === "azothRow" && !p.tapped
    );

    azothSources.forEach(source => {
      source.produces.forEach(element => {
        gameState.players[playerId].azothPool[element]++;
      });
      source.tapped = true;
    });
  }

  private processActivateAbility(
    gameState: GameState,
    playerId: string,
    action: GameActionDto,
  ): GameState {
    // TODO: Implement ability activation
    this.addGameActionToState(
      gameState,
      playerId,
      "activate_ability",
      action.data,
      "Activated ability",
    );
    return gameState;
  }

  private processDeclareAttackers(
    gameState: GameState,
    playerId: string,
    action: GameActionDto,
  ): GameState {
    const { attackers } = action.data;
    
    // Validate attackers
    const playerZone = gameState.zones[playerId];
    const validAttackers = attackers.filter(attackerId => 
      playerZone.field.includes(attackerId) && 
      !this.isTapped(gameState, attackerId)
    );

    // Tap attackers
    validAttackers.forEach(attackerId => {
      this.tapPermanent(gameState, attackerId);
    });

    // Store attack declaration
    gameState.attackers = validAttackers.map(attackerId => ({
      id: attackerId,
      controllerId: playerId,
      target: null // Will be set during combat resolution
    }));

    this.addGameActionToState(
      gameState,
      playerId,
      "declare_attackers",
      { attackers: validAttackers },
      `Declared ${validAttackers.length} attackers`,
    );
    return gameState;
  }

  private processDeclareBlockers(
    gameState: GameState,
    playerId: string,
    action: GameActionDto,
  ): GameState {
    const { blockers } = action.data;
    
    // Validate blockers
    const playerZone = gameState.zones[playerId];
    const validBlockers = blockers.filter(blocker => 
      playerZone.field.includes(blocker.blockerId) && 
      !this.isTapped(gameState, blocker.blockerId)
    );

    // Store block declarations
    gameState.blockers = validBlockers.map(blocker => ({
      blockerId: blocker.blockerId,
      attackerId: blocker.attackerId,
      controllerId: playerId
    }));

    // Resolve combat
    this.resolveCombat(gameState);

    this.addGameActionToState(
      gameState,
      playerId,
      "declare_blockers",
      { blockers: validBlockers },
      `Declared ${validBlockers.length} blockers`,
    );
    return gameState;
  }

  private resolveCombat(gameState: GameState): void {
    // Process each combat
    gameState.attackers.forEach(attacker => {
      const blockers = gameState.blockers.filter(b => b.attackerId === attacker.id);
      
      if (blockers.length === 0) {
        // Unblocked attack - deal damage to life cards
        this.dealCombatDamage(gameState, attacker, null);
      } else {
        // Blocked attack - resolve combat between attacker and blockers
        this.resolveBlockedCombat(gameState, attacker, blockers);
      }
    });

    // Clear combat state
    gameState.attackers = [];
    gameState.blockers = [];
  }

  private dealCombatDamage(gameState: GameState, attacker: any, blocker: any): void {
    const attackerPermanent = gameState.permanents.find(p => p.id === attacker.id);
    if (!attackerPermanent) return;

    const damage = attackerPermanent.power || 0;
    const targetPlayer = this.getOpponent(gameState, attacker.controllerId);
    
    if (targetPlayer) {
      this.dealDamage(gameState, targetPlayer, damage);
      
      this.addGameActionToState(
        gameState,
        attacker.controllerId,
        "combat_damage",
        { attackerId: attacker.id, damage, targetPlayer },
        `Dealt ${damage} combat damage`
      );
    }
  }

  private resolveBlockedCombat(gameState: GameState, attacker: any, blockers: any[]): void {
    const attackerPermanent = gameState.permanents.find(p => p.id === attacker.id);
    if (!attackerPermanent) return;

    const attackerPower = attackerPermanent.power || 0;
    const attackerToughness = attackerPermanent.toughness || 0;

    // Calculate total blocker stats
    let totalBlockerPower = 0;
    let totalBlockerToughness = 0;

    blockers.forEach(blocker => {
      const blockerPermanent = gameState.permanents.find(p => p.id === blocker.blockerId);
      if (blockerPermanent) {
        totalBlockerPower += blockerPermanent.power || 0;
        totalBlockerToughness += blockerPermanent.toughness || 0;
      }
    });

    // Attacker deals damage to blockers
    this.dealDamageToPermanents(gameState, attacker.id, blockers.map(b => b.blockerId), attackerPower);

    // Blockers deal damage to attacker
    this.dealDamageToPermanents(gameState, blockers[0].blockerId, [attacker.id], totalBlockerPower);

    this.addGameActionToState(
      gameState,
      attacker.controllerId,
      "combat_resolution",
      { attackerId: attacker.id, blockerIds: blockers.map(b => b.blockerId) },
      "Resolved combat"
    );
  }

  private dealDamageToPermanents(gameState: GameState, sourceId: string, targetIds: string[], damage: number): void {
    targetIds.forEach(targetId => {
      const permanent = gameState.permanents.find(p => p.id === targetId);
      if (permanent) {
        const currentDamage = permanent.damage || 0;
        const newDamage = currentDamage + damage;
        permanent.damage = newDamage;

        // Check if permanent is destroyed
        if (newDamage >= (permanent.toughness || 0)) {
          this.destroyPermanent(gameState, permanent);
        }
      }
    });
  }

  private destroyPermanent(gameState: GameState, permanent: any): void {
    // Remove from zone
    const playerZone = gameState.zones[permanent.controllerId];
    const zoneArray = playerZone[permanent.zone];
    const index = zoneArray.indexOf(permanent.id);
    if (index > -1) {
      zoneArray.splice(index, 1);
    }

    // Move to removed from play
    playerZone.removedFromPlay.push(permanent.id);
    permanent.zone = "removedFromPlay";

    this.addGameActionToState(
      gameState,
      permanent.controllerId,
      "destroy_permanent",
      { permanentId: permanent.id },
      "Permanent destroyed"
    );
  }

  private isTapped(gameState: GameState, permanentId: string): boolean {
    const permanent = gameState.permanents.find(p => p.id === permanentId);
    return permanent ? permanent.tapped : false;
  }

  private tapPermanent(gameState: GameState, permanentId: string): void {
    const permanent = gameState.permanents.find(p => p.id === permanentId);
    if (permanent) {
      permanent.tapped = true;
    }
  }

  private canPerformActionOutOfTurn(
    actionType: string,
    gameState: GameState,
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
    game: Game,
  ): { playerId: string; condition: string } | null {
    // Check various win conditions
    for (const [playerId, playerState] of Object.entries(
      game.gameState.players,
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
    description: string,
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
    description: string,
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
