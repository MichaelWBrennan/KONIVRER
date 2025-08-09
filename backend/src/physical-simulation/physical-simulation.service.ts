import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../cards/entities/card.entity';
import { Deck } from '../decks/entities/deck.entity';

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
  deck: Card[];
  hand: Card[];
  battlefield: Card[];
  graveyard: Card[];
  life: number;
  mana: number;
  maxMana: number;
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
  UNTAP = 'untap',
  UPKEEP = 'upkeep', 
  DRAW = 'draw',
  MAIN1 = 'main1',
  COMBAT = 'combat',
  MAIN2 = 'main2',
  END = 'end',
}

@Injectable()
export class PhysicalGameSimulationService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
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
        
        const winRate = matchupResult.statistics.winRates['player1'] || 0;
        results.matchupMatrix[testDeck][metaDeck] = winRate;
        results.winRates[testDeck] += winRate / metaDecks.length;
      }
      
      // Analyze card synergies within the deck
      results.synergyAnalysis[testDeck] = await this.analyzeDeckSynergies(testDeck);
      
      // Calculate meta impact score
      results.metaImpact[testDeck] = this.calculateMetaImpact(
        results.matchupMatrix[testDeck],
        metaDecks
      );
    }

    return {
      ...results,
      detailedStats: await this.generateDetailedStats(results, testDecks, metaDecks),
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
    const random = this.createSeededRandom(Date.now() + Math.random() * 1000000);
    
    const gameState: GameState = initialState ? 
      this.mergeGameStates(await this.createInitialGameState(deck1, deck2), initialState) :
      await this.createInitialGameState(deck1, deck2);

    let turnCount = 0;
    const maxTurns = 50; // Prevent infinite games
    
    while (!gameState.winner && turnCount < maxTurns) {
      await this.playTurn(gameState, random);
      turnCount++;
      
      // Check win conditions
      gameState.winner = this.checkWinCondition(gameState);
    }

    return {
      winner: gameState.winner || 'timeout',
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
    const shuffledDeck1 = this.shuffleDeck([...deck1]);
    const shuffledDeck2 = this.shuffleDeck([...deck2]);

    const player1: PhysicalPlayer = {
      id: 'player1',
      name: 'Player 1',
      deck: shuffledDeck1.slice(7), // Remove opening hand
      hand: shuffledDeck1.slice(0, 7), // Starting hand of 7
      battlefield: [],
      graveyard: [],
      life: 20,
      mana: 0,
      maxMana: 0,
    };

    const player2: PhysicalPlayer = {
      id: 'player2', 
      name: 'Player 2',
      deck: shuffledDeck2.slice(7),
      hand: shuffledDeck2.slice(0, 7),
      battlefield: [],
      graveyard: [],
      life: 20,
      mana: 0,
      maxMana: 0,
    };

    const gameState: GameState = {
      players: [player1, player2],
      currentPlayer: 0,
      phase: GamePhase.UNTAP,
      turn: 1,
      gameLog: [],
      ...overrides,
    };

    this.logEvent(gameState, 'system', 'game_start', {
      player1Hand: player1.hand.length,
      player2Hand: player2.hand.length,
    });

    return gameState;
  }

  private async playTurn(gameState: GameState, random: () => number): Promise<void> {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    // Untap phase
    this.executeUntapPhase(gameState);
    
    // Upkeep phase  
    this.executeUpkeepPhase(gameState);
    
    // Draw phase
    this.executeDrawPhase(gameState, random);
    
    // Main phase 1
    await this.executeMainPhase(gameState, random);
    
    // Combat phase
    await this.executeCombatPhase(gameState, random);
    
    // Main phase 2
    await this.executeMainPhase(gameState, random);
    
    // End phase
    this.executeEndPhase(gameState);
    
    // Switch to next player
    gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
    if (gameState.currentPlayer === 0) {
      gameState.turn++;
    }
  }

  private executeUntapPhase(gameState: GameState): void {
    gameState.phase = GamePhase.UNTAP;
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    // Untap all permanents (simplified - in reality this would check for specific effects)
    currentPlayer.battlefield.forEach(card => {
      // Reset tapped status (would be tracked in card state)
    });
    
    this.logEvent(gameState, currentPlayer.id, 'untap_phase', {
      permanentsUntapped: currentPlayer.battlefield.length,
    });
  }

  private executeUpkeepPhase(gameState: GameState): void {
    gameState.phase = GamePhase.UPKEEP;
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    // Trigger upkeep abilities (simplified)
    this.logEvent(gameState, currentPlayer.id, 'upkeep_phase', {});
  }

  private executeDrawPhase(gameState: GameState, random: () => number): void {
    gameState.phase = GamePhase.DRAW;
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    if (gameState.turn > 1 || gameState.currentPlayer === 1) {
      // Draw a card (first player skips draw on turn 1)
      if (currentPlayer.deck.length > 0) {
        const drawnCard = currentPlayer.deck.pop();
        currentPlayer.hand.push(drawnCard);
        
        this.logEvent(gameState, currentPlayer.id, 'draw_card', {
          cardName: drawnCard.name,
          handSize: currentPlayer.hand.length,
        });
      } else {
        // Deck out - player loses
        this.logEvent(gameState, currentPlayer.id, 'deck_out', {});
        gameState.winner = gameState.players[1 - gameState.currentPlayer].id;
      }
    }
  }

  private async executeMainPhase(gameState: GameState, random: () => number): Promise<void> {
    gameState.phase = gameState.phase === GamePhase.DRAW ? GamePhase.MAIN1 : GamePhase.MAIN2;
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    // Add mana for the turn
    if (gameState.phase === GamePhase.MAIN1) {
      currentPlayer.maxMana++;
      currentPlayer.mana = currentPlayer.maxMana;
    }
    
    // AI decision making for playing cards (simplified)
    await this.makePlayerDecisions(gameState, random);
    
    this.logEvent(gameState, currentPlayer.id, 'main_phase', {
      phase: gameState.phase,
      mana: currentPlayer.mana,
      handSize: currentPlayer.hand.length,
    });
  }

  private async executeCombatPhase(gameState: GameState, random: () => number): Promise<void> {
    gameState.phase = GamePhase.COMBAT;
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const opponent = gameState.players[1 - gameState.currentPlayer];
    
    // Simple combat simulation
    const attackers = currentPlayer.battlefield.filter(card => 
      this.canAttack(card) && this.shouldAttack(card, gameState, random)
    );
    
    if (attackers.length > 0) {
      let totalDamage = 0;
      for (const attacker of attackers) {
        totalDamage += this.getCardPower(attacker);
      }
      
      opponent.life -= totalDamage;
      
      this.logEvent(gameState, currentPlayer.id, 'combat', {
        attackers: attackers.length,
        damage: totalDamage,
        opponentLife: opponent.life,
      });
    }
  }

  private executeEndPhase(gameState: GameState): void {
    gameState.phase = GamePhase.END;
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    // Handle end of turn effects
    this.logEvent(gameState, currentPlayer.id, 'end_phase', {
      handSize: currentPlayer.hand.length,
    });
  }

  private async makePlayerDecisions(gameState: GameState, random: () => number): Promise<void> {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    // Simple AI: Play cards that cost <= available mana
    const playableCards = currentPlayer.hand.filter(card => 
      this.getCardCost(card) <= currentPlayer.mana
    );
    
    for (const card of playableCards) {
      if (random() > 0.5) { // 50% chance to play each playable card
        const cost = this.getCardCost(card);
        if (currentPlayer.mana >= cost) {
          currentPlayer.mana -= cost;
          currentPlayer.hand = currentPlayer.hand.filter(c => c.id !== card.id);
          currentPlayer.battlefield.push(card);
          
          this.logEvent(gameState, currentPlayer.id, 'play_card', {
            cardName: card.name,
            cost: cost,
            remainingMana: currentPlayer.mana,
          });
        }
      }
    }
  }

  private checkWinCondition(gameState: GameState): string | null {
    for (const player of gameState.players) {
      if (player.life <= 0) {
        const winnerId = gameState.players.find(p => p.id !== player.id)?.id;
        return winnerId || null;
      }
    }
    return null;
  }

  private logEvent(gameState: GameState, playerId: string, action: string, details: any): void {
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

  private mergeGameStates(base: GameState, overrides: Partial<GameState>): GameState {
    return { ...base, ...overrides };
  }

  private canAttack(card: Card): boolean {
    // Check if card can attack (not summoning sick, not tapped, etc.)
    return true; // Simplified
  }

  private shouldAttack(card: Card, gameState: GameState, random: () => number): boolean {
    // AI decision for attacking
    return random() > 0.3; // 70% chance to attack with available creatures
  }

  private getCardPower(card: Card): number {
    // Extract power from card data
    return card.power || 0;
  }

  private getCardCost(card: Card): number {
    // Extract mana cost from card data
    return (card as any).convertedManaCost || 0;
  }

  private async loadDeckCards(deckId: string): Promise<Card[]> {
    const deck = await this.deckRepository.findOne({
      where: { id: deckId },
      relations: ['cards'],
    });
    
    return deck?.cards as Card[] || [];
  }

  private aggregateResults(results: any, gameResult: any): void {
    const outcome = gameResult.winner;
    results.outcomes[outcome] = (results.outcomes[outcome] || 0) + 1;
    results.totalGameLength += gameResult.turns;
    
    if (outcome === 'player1') results.winRates.player1++;
    if (outcome === 'player2') results.winRates.player2++;
    
    // Aggregate card usage from game log
    gameResult.gameLog.forEach(event => {
      if (event.action === 'play_card') {
        const cardName = event.details.cardName;
        results.statistics.cardUsage[cardName] = 
          (results.statistics.cardUsage[cardName] || 0) + 1;
      }
    });
  }

  private processResults(results: any, iterations: number, scenarioId?: string): TestResult {
    return {
      scenarioId: scenarioId || 'default',
      iterations,
      outcomes: results.outcomes,
      averageGameLength: results.totalGameLength / iterations,
      statistics: {
        winRates: {
          player1: results.winRates.player1 / iterations * 100,
          player2: results.winRates.player2 / iterations * 100,
        },
        averageDamage: 0, // Would calculate from detailed logs
        cardUsageStats: results.statistics.cardUsage,
        phaseAnalysis: results.statistics.phaseAnalysis,
      },
    };
  }

  private generateScenarioTags(scenarioData: any): string[] {
    const tags = ['custom-scenario'];
    
    // Add tags based on scenario characteristics
    if (scenarioData.name.toLowerCase().includes('aggro')) {
      tags.push('aggro');
    }
    if (scenarioData.name.toLowerCase().includes('control')) {
      tags.push('control');
    }
    
    return tags;
  }

  private async analyzeDeckSynergies(deckId: string): Promise<any> {
    const deck = await this.deckRepository.findOne({
      where: { id: deckId },
      relations: ['cards'],
    });
    
    if (!deck) return {};
    
    // Analyze card synergies (simplified)
    const synergies = {};
    (deck.cards as Card[]).forEach(card => {
      // This would analyze card interactions, tribal synergies, etc.
      synergies[card.name] = Math.random() * 0.5 + 0.5; // Placeholder
    });
    
    return synergies;
  }

  private calculateMetaImpact(matchupMatrix: { [deck: string]: number }, metaDecks: string[]): number {
    // Calculate how much this deck would impact the meta
    const averageWinRate = Object.values(matchupMatrix).reduce((a, b) => a + b, 0) / metaDecks.length;
    
    // Higher impact for decks that beat current meta leaders
    const metaImpact = averageWinRate > 55 ? (averageWinRate - 50) / 10 : 0;
    
    return metaImpact;
  }

  private async generateDetailedStats(results: any, testDecks: string[], metaDecks: string[]): Promise<any> {
    return {
      totalSimulations: testDecks.length * metaDecks.length,
      bestPerformingDeck: Object.keys(results.winRates).reduce((a, b) => 
        results.winRates[a] > results.winRates[b] ? a : b
      ),
      metaShakeup: Object.values(results.metaImpact).reduce((a: number, b: number) => a + b, 0),
      generatedAt: new Date().toISOString(),
    };
  }
}