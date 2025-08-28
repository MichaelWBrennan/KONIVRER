import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Card } from "../cards/entities/card.entity";
import { Deck } from "../decks/entities/deck.entity";

interface GameState {
  players: PhysicalPlayer[];
  currentPlayer: number;
  phase: GamePhase;
  turn: number;
  winner?: string;
  gameLog: GameEvent[];
}

interface PhysicalPlayer {
  id: string;
  name: string;
  deck: Card[]; // KONIVRER: 40-card deck
  hand: Card[];
  field: Card[]; // KONIVRER: Main battlefield
  combatRow: Card[]; // KONIVRER: Combat area
  azothRow: Card[]; // KONIVRER: Resource cards
  lifeCards: Card[]; // KONIVRER: 4 life cards for damage
  flag: Card; // KONIVRER: Single flag card (deck identity)
  removedFromPlay: Card[]; // KONIVRER: Void zone
  lifeCardsRemaining: number;
  azothPool: Record<string, number>; // Available Azoth
}

interface GameEvent {
  timestamp: Date;
  playerId: string;
  action: string;
  details: any;
  gameState?: Partial<GameState>;
}

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  initialGameState: GameState;
  expectedOutcomes: string[];
  tags: string[];
}

interface TestResult {
  scenarioId: string;
  iterations: number;
  outcomes: {
    [outcome: string]: number;
  };
  averageGameLength: number;
  statistics: {
    winRates: { [playerId: string]: number };
    averageDamage: number;
    cardUsageStats: { [cardId: string]: number };
    phaseAnalysis: { [phase: string]: number };
  };
}

enum GamePhase {
  START = "start", // KONIVRER: Draw 2 cards first turn, place Azoth
  MAIN = "main", // KONIVRER: Play cards, resolve keywords
  COMBAT = "combat", // KONIVRER: Attack with Familiars
  POST_COMBAT_MAIN = "post_combat_main", // KONIVRER: Play more cards
  REFRESH = "refresh", // KONIVRER: Refresh Azoth sources
}

@Injectable()
export class PhysicalGameSimulationService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>
  ) {}

  /**
   * Create and run precise physical game simulation
   * Replicates physical game rules, timing, and interactions
   */
  async simulatePhysicalGame(
    deck1: string,
    deck2: string,
    iterations: number = 1000,
    scenario?: SimulationScenario
  ): Promise<TestResult> {
    const deck1Cards = await this.loadDeckCards(deck1);
    const deck2Cards = await this.loadDeckCards(deck2);

    const results = {
      outcomes: {},
      totalGameLength: 0,
      winRates: { player1: 0, player2: 0 },
      statistics: {
        cardUsage: {},
        phaseAnalysis: {},
        averageDamage: 0,
      },
    };

    for (let i = 0; i < iterations; i++) {
      const gameResult = await this.runSingleGame(
        deck1Cards,
        deck2Cards,
        scenario?.initialGameState
      );

      this.aggregateResults(results, gameResult);
    }

    return this.processResults(results, iterations, scenario?.id);
  }

  /**
   * Create custom game scenarios for targeted testing
   */
  async createScenario(scenarioData: {
    name: string;
    description: string;
    player1Deck: string;
    player2Deck: string;
    customGameState?: Partial<GameState>;
    expectedOutcomes: string[];
  }): Promise<SimulationScenario> {
    const player1Cards = await this.loadDeckCards(scenarioData.player1Deck);
    const player2Cards = await this.loadDeckCards(scenarioData.player2Deck);

    const initialState = await this.createInitialGameState(
      player1Cards,
      player2Cards,
      scenarioData.customGameState
    );

    const scenario: SimulationScenario = {
      id: `scenario_${Date.now()}`,
      name: scenarioData.name,
      description: scenarioData.description,
      initialGameState: initialState,
      expectedOutcomes: scenarioData.expectedOutcomes,
      tags: this.generateScenarioTags(scenarioData),
    };

    return scenario;
  }

  /**
   * Run batch deck testing across millions of iterations
   * Provides detailed win-rate, synergy, and meta impact analysis
   */
  async runBatchDeckTesting(
    testDecks: string[],
    metaDecks: string[],
    iterations: number = 1000000
  ): Promise<{
    winRates: { [deckId: string]: number };
    matchupMatrix: { [deck1: string]: { [deck2: string]: number } };
    synergyAnalysis: { [deckId: string]: any };
    metaImpact: { [deckId: string]: number };
    detailedStats: any;
  }> {
    const results = {
      winRates: {},
      matchupMatrix: {},
      synergyAnalysis: {},
      metaImpact: {},
    };

    // Test each deck against the meta
    for (const testDeck of testDecks) {
      results.winRates[testDeck] = 0;
      results.matchupMatrix[testDeck] = {};

      for (const metaDeck of metaDecks) {
        const matchupResult = await this.simulatePhysicalGame(
          testDeck,
          metaDeck,
          Math.floor(iterations / (testDecks.length * metaDecks.length))
        );

        const winRate = matchupResult.statistics.winRates["player1"] || 0;
        results.matchupMatrix[testDeck][metaDeck] = winRate;
        results.winRates[testDeck] += winRate / metaDecks.length;
      }

      // Analyze card synergies within the deck
      results.synergyAnalysis[testDeck] = await this.analyzeDeckSynergies(
        testDeck
      );

      // Calculate meta impact score
      results.metaImpact[testDeck] = this.calculateMetaImpact(
        results.matchupMatrix[testDeck],
        metaDecks
      );
    }

    return {
      ...results,
      detailedStats: await this.generateDetailedStats(
        results,
        testDecks,
        metaDecks
      ),
    };
  }

  /**
   * Replicate randomness factors like dice, shuffles with seeded PRNGs
   */
  private createSeededRandom(seed: number): () => number {
    let s = seed;
    return () => {
      s = Math.imul(s, 0x12345678) + 0x12345678;
      return (s >>> 0) / 0x100000000;
    };
  }

  private async runSingleGame(
    deck1: Card[],
    deck2: Card[],
    initialState?: Partial<GameState>
  ): Promise<any> {
    // Create seeded random for reproducible results
    const random = this.createSeededRandom(
      Date.now() + Math.random() * 1000000
    );

    const gameState: GameState = initialState
      ? this.mergeGameStates(
          await this.createInitialGameState(deck1, deck2),
          initialState
        )
      : await this.createInitialGameState(deck1, deck2);

    let turnCount = 0;
    const maxTurns = 50; // Prevent infinite games

    while (!gameState.winner && turnCount < maxTurns) {
      await this.playTurn(gameState, random);
      turnCount++;

      // Check win conditions
      gameState.winner = this.checkWinCondition(gameState);
    }

    return {
      winner: gameState.winner || "timeout",
      turns: turnCount,
      gameLog: gameState.gameLog,
      finalState: gameState,
    };
  }

  private async createInitialGameState(
    deck1: Card[],
    deck2: Card[],
    overrides?: Partial<GameState>
  ): Promise<GameState> {
    // KONIVRER: Separate life cards from main deck
    const shuffledDeck1 = this.shuffleDeck([...deck1]);
    const shuffledDeck2 = this.shuffleDeck([...deck2]);

    const player1: PhysicalPlayer = {
      id: "player1",
      name: "Player 1",
      deck: shuffledDeck1.slice(4), // Remove 4 life cards
      hand: [], // KONIVRER: Start with empty hand, draw 2 on first turn
      field: [],
      combatRow: [],
      azothRow: [],
      lifeCards: shuffledDeck1.slice(0, 4), // First 4 cards as life cards
      flag: shuffledDeck1[shuffledDeck1.length - 1], // Flag is last card (or separate)
      removedFromPlay: [],
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
    };

    const player2: PhysicalPlayer = {
      id: "player2",
      name: "Player 2",
      deck: shuffledDeck2.slice(4),
      hand: [],
      field: [],
      combatRow: [],
      azothRow: [],
      lifeCards: shuffledDeck2.slice(0, 4),
      flag: shuffledDeck2[shuffledDeck2.length - 1],
      removedFromPlay: [],
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
    };

    const gameState: GameState = {
      players: [player1, player2],
      currentPlayer: 0,
      phase: GamePhase.START,
      turn: 1,
      gameLog: [],
      ...overrides,
    };

    this.logEvent(gameState, "system", "game_start", {
      player1LifeCards: player1.lifeCards.length,
      player2LifeCards: player2.lifeCards.length,
    });

    return gameState;
  }

  private async playTurn(
    gameState: GameState,
    random: () => number
  ): Promise<void> {
    const currentPlayer = gameState.players[gameState.currentPlayer];

    // Start phase - KONIVRER specific
    this.executeStartPhase(gameState, random);

    // Main phase - play cards, resolve keywords
    await this.executeMainPhase(gameState, random);

    // Combat phase - attack with Familiars
    await this.executeCombatPhase(gameState, random);

    // Post-Combat Main phase - play more cards
    await this.executePostCombatMainPhase(gameState, random);

    // Refresh phase - refresh Azoth sources
    this.executeRefreshPhase(gameState);

    // Switch to next player
    gameState.currentPlayer =
      (gameState.currentPlayer + 1) % gameState.players.length;
    if (gameState.currentPlayer === 0) {
      gameState.turn++;
    }
  }

  private executeStartPhase(gameState: GameState, random: () => number): void {
    gameState.phase = GamePhase.START;
    const currentPlayer = gameState.players[gameState.currentPlayer];

    // KONIVRER: Draw 2 cards only on first turn
    if (gameState.turn === 1) {
      for (let i = 0; i < 2; i++) {
        if (currentPlayer.deck.length > 0) {
          const drawnCard = currentPlayer.deck.pop();
          currentPlayer.hand.push(drawnCard);

          this.logEvent(gameState, currentPlayer.id, "draw_card", {
            cardName: drawnCard.name,
            handSize: currentPlayer.hand.length,
          });
        }
      }
    }

    // KONIVRER: Optionally place 1 card as Azoth resource
    if (currentPlayer.hand.length > 0 && random() > 0.3) {
      // 70% chance to place Azoth
      const azothCard = currentPlayer.hand.pop();
      currentPlayer.azothRow.push(azothCard);

      this.logEvent(gameState, currentPlayer.id, "place_azoth", {
        cardName: azothCard.name,
        azothCount: currentPlayer.azothRow.length,
      });
    }

    this.logEvent(gameState, currentPlayer.id, "start_phase", {});
  }

  private async executePostCombatMainPhase(
    gameState: GameState,
    random: () => number
  ): Promise<void> {
    gameState.phase = GamePhase.POST_COMBAT_MAIN;
    const currentPlayer = gameState.players[gameState.currentPlayer];

    // Additional card playing opportunity
    await this.makePlayerDecisions(gameState, random);

    this.logEvent(gameState, currentPlayer.id, "post_combat_main_phase", {
      handSize: currentPlayer.hand.length,
    });
  }

  private executeRefreshPhase(gameState: GameState): void {
    gameState.phase = GamePhase.REFRESH;
    const currentPlayer = gameState.players[gameState.currentPlayer];

    // KONIVRER: Refresh (untap) all Azoth sources
    currentPlayer.azothRow.forEach((card) => {
      // Reset tapped status (would be tracked in card state)
      // Generate Azoth based on card element
      const element = this.getCardElement(card);
      if (element && currentPlayer.azothPool[element] !== undefined) {
        currentPlayer.azothPool[element]++;
      }
    });

    this.logEvent(gameState, currentPlayer.id, "refresh_phase", {
      azothGenerated: Object.values(currentPlayer.azothPool).reduce(
        (a, b) => a + b,
        0
      ),
    });
  }

  private async executeMainPhase(
    gameState: GameState,
    random: () => number
  ): Promise<void> {
    gameState.phase = GamePhase.MAIN;
    const currentPlayer = gameState.players[gameState.currentPlayer];

    // KONIVRER: Generate Azoth from sources in Azoth Row
    this.generateAzothFromSources(currentPlayer);

    // AI decision making for playing cards (KONIVRER mechanics)
    await this.makePlayerDecisions(gameState, random);

    this.logEvent(gameState, currentPlayer.id, "main_phase", {
      azothAvailable: Object.values(currentPlayer.azothPool).reduce(
        (a, b) => a + b,
        0
      ),
      handSize: currentPlayer.hand.length,
    });
  }

  private async executeCombatPhase(
    gameState: GameState,
    random: () => number
  ): Promise<void> {
    gameState.phase = GamePhase.COMBAT;
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const opponent = gameState.players[1 - gameState.currentPlayer];

    // KONIVRER: Attack with Familiars from Field and Combat Row
    const attackers = [
      ...currentPlayer.field,
      ...currentPlayer.combatRow,
    ].filter(
      (card) =>
        this.canAttack(card) && this.shouldAttack(card, gameState, random)
    );

    if (attackers.length > 0) {
      let totalDamage = 0;
      for (const attacker of attackers) {
        totalDamage += this.getCardStrength(attacker);
      }

      // KONIVRER: Damage removes life cards instead of reducing life total
      this.dealLifeCardDamage(opponent, totalDamage);

      this.logEvent(gameState, currentPlayer.id, "combat", {
        attackers: attackers.length,
        damage: totalDamage,
        opponentLifeCards: opponent.lifeCardsRemaining,
      });
    }
  }

  private async makePlayerDecisions(
    gameState: GameState,
    random: () => number
  ): Promise<void> {
    const currentPlayer = gameState.players[gameState.currentPlayer];

    // KONIVRER: Play cards using Azoth cost system
    const playableCards = currentPlayer.hand.filter((card) =>
      this.canAffordCard(card, currentPlayer.azothPool)
    );

    for (const card of playableCards) {
      if (random() > 0.5) {
        // 50% chance to play each playable card
        const cost = this.getCardAzothCost(card);

        // KONIVRER: Different play modes
        const playMode = this.choosePlayMode(card, currentPlayer, random());

        switch (playMode) {
          case "summon":
            this.playSummon(currentPlayer, card, cost);
            break;
          case "spell":
            this.playSpell(currentPlayer, card, cost);
            break;
          case "azoth":
            this.playAsAzoth(currentPlayer, card);
            break;
        }

        this.logEvent(gameState, currentPlayer.id, "play_card", {
          cardName: card.name,
          playMode: playMode,
          cost: cost,
        });
      }
    }
  }

  private generateAzothFromSources(player: PhysicalPlayer): void {
    // Generate Azoth from cards in Azoth Row
    for (const azothCard of player.azothRow) {
      const element = this.getCardElement(azothCard);
      if (element && player.azothPool[element] !== undefined) {
        player.azothPool[element]++;
      }
    }
  }

  private dealLifeCardDamage(player: PhysicalPlayer, damage: number): void {
    // KONIVRER: Damage removes life cards
    const cardsToRemove = Math.min(damage, player.lifeCards.length);

    for (let i = 0; i < cardsToRemove; i++) {
      const removedCard = player.lifeCards.pop();
      if (removedCard) {
        // KONIVRER: Burst ability can trigger when drawn from life cards
        // Implementation would check for Burst keyword
        player.removedFromPlay.push(removedCard);
      }
    }

    player.lifeCardsRemaining = player.lifeCards.length;
  }

  private choosePlayMode(
    card: Card,
    player: PhysicalPlayer,
    randomValue: number
  ): string {
    // KONIVRER: AI chooses between Summon, Spell, or Azoth modes
    if (card.type === "Familiar") {
      return "summon"; // Familiars are usually summoned
    } else if (card.type === "Spell") {
      return randomValue > 0.7 ? "spell" : "azoth"; // 30% chance to play as spell
    }
    return "azoth"; // Default to placing as Azoth resource
  }

  private playSummon(
    player: PhysicalPlayer,
    card: Card,
    cost: Record<string, number>
  ): void {
    // Remove from hand and pay cost
    player.hand = player.hand.filter((c) => c.id !== card.id);
    this.payAzothCost(player, cost);

    // Add to field as Familiar with +1 counters
    player.field.push(card);
  }

  private playSpell(
    player: PhysicalPlayer,
    card: Card,
    cost: Record<string, number>
  ): void {
    // Remove from hand and pay cost
    player.hand = player.hand.filter((c) => c.id !== card.id);
    this.payAzothCost(player, cost);

    // Resolve spell effect, then put on bottom of deck
    player.deck.unshift(card); // Add to bottom of deck
  }

  private playAsAzoth(player: PhysicalPlayer, card: Card): void {
    // Remove from hand and place in Azoth Row
    player.hand = player.hand.filter((c) => c.id !== card.id);
    player.azothRow.push(card);
  }

  private getCardElement(card: Card): string | null {
    // Extract element from KONIVRER card
    return card.element || null;
  }

  private getCardStrength(card: Card): number {
    // KONIVRER: Get card strength instead of power
    return (card as any).strength || (card as any).baseStrength || 0;
  }

  private canAffordCard(
    card: Card,
    azothPool: Record<string, number>
  ): boolean {
    const cost = this.getCardAzothCost(card);

    for (const [element, amount] of Object.entries(cost)) {
      if ((azothPool[element] || 0) < amount) {
        return false;
      }
    }
    return true;
  }

  private getCardAzothCost(card: Card): Record<string, number> {
    // Extract KONIVRER Azoth cost from card
    const baseCost = card.cost || 0;
    const element = card.element || "generic";

    return { [element]: baseCost };
  }

  private payAzothCost(
    player: PhysicalPlayer,
    cost: Record<string, number>
  ): void {
    for (const [element, amount] of Object.entries(cost)) {
      if (player.azothPool[element] !== undefined) {
        player.azothPool[element] = Math.max(
          0,
          player.azothPool[element] - amount
        );
      }
    }
  }

  private checkWinCondition(gameState: GameState): string | null {
    for (const player of gameState.players) {
      // KONIVRER: Win when opponent's life cards are depleted
      if (player.lifeCardsRemaining <= 0) {
        const winnerId = gameState.players.find((p) => p.id !== player.id)?.id;
        return winnerId || null;
      }

      // Deck out condition
      if (player.deck.length === 0) {
        const winnerId = gameState.players.find((p) => p.id !== player.id)?.id;
        return winnerId || null;
      }
    }
    return null;
  }

  private logEvent(
    gameState: GameState,
    playerId: string,
    action: string,
    details: any
  ): void {
    gameState.gameLog.push({
      timestamp: new Date(),
      playerId,
      action,
      details,
      gameState: {
        turn: gameState.turn,
        phase: gameState.phase,
        currentPlayer: gameState.currentPlayer,
      },
    });
  }

  private shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private mergeGameStates(
    base: GameState,
    overrides: Partial<GameState>
  ): GameState {
    return { ...base, ...overrides };
  }

  private canAttack(card: Card): boolean {
    // Check if card can attack (not summoning sick, not tapped, etc.)
    return true; // Simplified
  }

  private shouldAttack(
    card: Card,
    gameState: GameState,
    random: () => number
  ): boolean {
    // AI decision for attacking
    return random() > 0.3; // 70% chance to attack with available creatures
  }

  private getCardPower(card: Card): number {
    // KONIVRER: Use strength instead of power
    return this.getCardStrength(card);
  }

  private getCardCost(card: Card): number {
    // Extract cost from card data (keeping for compatibility)
    return card.cost || 0;
  }

  private async loadDeckCards(deckId: string): Promise<Card[]> {
    const deck = await this.deckRepository.findOne({
      where: { id: deckId },
      relations: ["cards"],
    });

    return (deck?.cards as Card[]) || [];
  }

  private aggregateResults(results: any, gameResult: any): void {
    const outcome = gameResult.winner;
    results.outcomes[outcome] = (results.outcomes[outcome] || 0) + 1;
    results.totalGameLength += gameResult.turns;

    if (outcome === "player1") results.winRates.player1++;
    if (outcome === "player2") results.winRates.player2++;

    // Aggregate card usage from game log
    gameResult.gameLog.forEach((event) => {
      if (event.action === "play_card") {
        const cardName = event.details.cardName;
        results.statistics.cardUsage[cardName] =
          (results.statistics.cardUsage[cardName] || 0) + 1;
      }
    });
  }

  private processResults(
    results: any,
    iterations: number,
    scenarioId?: string
  ): TestResult {
    return {
      scenarioId: scenarioId || "default",
      iterations,
      outcomes: results.outcomes,
      averageGameLength: results.totalGameLength / iterations,
      statistics: {
        winRates: {
          player1: (results.winRates.player1 / iterations) * 100,
          player2: (results.winRates.player2 / iterations) * 100,
        },
        averageDamage: 0, // Would calculate from detailed logs
        cardUsageStats: results.statistics.cardUsage,
        phaseAnalysis: results.statistics.phaseAnalysis,
      },
    };
  }

  private generateScenarioTags(scenarioData: any): string[] {
    const tags = ["custom-scenario"];

    // Add tags based on scenario characteristics
    if (scenarioData.name.toLowerCase().includes("aggro")) {
      tags.push("aggro");
    }
    if (scenarioData.name.toLowerCase().includes("control")) {
      tags.push("control");
    }

    return tags;
  }

  private async analyzeDeckSynergies(deckId: string): Promise<any> {
    const deck = await this.deckRepository.findOne({
      where: { id: deckId },
      relations: ["cards"],
    });

    if (!deck) return {};

    // Analyze card synergies (simplified)
    const synergies = {};
    (deck.cards as Card[]).forEach((card) => {
      // This would analyze card interactions, tribal synergies, etc.
      synergies[card.name] = Math.random() * 0.5 + 0.5; // Placeholder
    });

    return synergies;
  }

  private calculateMetaImpact(
    matchupMatrix: { [deck: string]: number },
    metaDecks: string[]
  ): number {
    // Calculate how much this deck would impact the meta
    const averageWinRate =
      Object.values(matchupMatrix).reduce((a, b) => a + b, 0) /
      metaDecks.length;

    // Higher impact for decks that beat current meta leaders
    const metaImpact = averageWinRate > 55 ? (averageWinRate - 50) / 10 : 0;

    return metaImpact;
  }

  private async generateDetailedStats(
    results: any,
    testDecks: string[],
    metaDecks: string[]
  ): Promise<any> {
    return {
      totalSimulations: testDecks.length * metaDecks.length,
      bestPerformingDeck: Object.keys(results.winRates).reduce((a, b) =>
        results.winRates[a] > results.winRates[b] ? a : b
      ),
      metaShakeup: Object.values(results.metaImpact).reduce(
        (a: number, b: number) => a + b,
        0
      ),
      generatedAt: new Date().toISOString(),
    };
  }
}
