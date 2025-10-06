import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiGame } from '../entities/ai-game.entity';
import { AiOpponent } from '../entities/ai-opponent.entity';
import { AiStrategyService } from './ai-strategy.service';
import { Card } from '../../cards/entities/card.entity';

interface GameAction {
  type: 'play_card' | 'attack' | 'defend' | 'pass' | 'special';
  cardId?: string;
  target?: string;
  details?: any;
}

interface GameResult {
  success: boolean;
  newGameState: any;
  message: string;
  aiResponse?: GameAction;
}

@Injectable()
export class AiGameplayService {
  private readonly logger = new Logger(AiGameplayService.name);

  constructor(
    @InjectRepository(AiGame)
    private readonly aiGameRepository: Repository<AiGame>,
    @InjectRepository(AiOpponent)
    private readonly aiOpponentRepository: Repository<AiOpponent>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly aiStrategyService: AiStrategyService,
  ) {}

  async processPlayerAction(
    gameId: string,
    action: GameAction
  ): Promise<GameResult> {
    const game = await this.aiGameRepository.findOne({
      where: { id: gameId },
      relations: ['aiOpponent'],
    });

    if (!game) {
      throw new Error('Game not found');
    }

    if (game.status !== 'active') {
      throw new Error('Game is not active');
    }

    if (game.currentTurn !== 'player_turn') {
      throw new Error('Not player turn');
    }

    // Process player action
    const playerResult = await this.executeAction(game, action, 'player');
    
    if (!playerResult.success) {
      return playerResult;
    }

    // Update game state
    game.gameState = playerResult.newGameState;
    game.currentTurn = 'ai_turn';
    game.gameLog.push({
      timestamp: new Date(),
      player: 'player',
      action: action.type,
      details: action,
    });

    // Check for game end conditions
    const gameEndResult = this.checkGameEnd(game.gameState);
    if (gameEndResult.gameEnded) {
      game.status = 'completed';
      game.gameResult = gameEndResult.result;
      game.completedAt = new Date();
      await this.aiGameRepository.save(game);
      
      return {
        success: true,
        newGameState: game.gameState,
        message: gameEndResult.message,
      };
    }

    // AI turn
    const aiAction = await this.generateAiAction(game);
    const aiResult = await this.executeAction(game, aiAction, 'ai');
    
    if (aiResult.success) {
      game.gameState = aiResult.newGameState;
      game.currentTurn = 'player_turn';
      game.gameLog.push({
        timestamp: new Date(),
        player: 'ai',
        action: aiAction.type,
        details: aiAction,
      });
    }

    // Check for game end after AI action
    const finalGameEndResult = this.checkGameEnd(game.gameState);
    if (finalGameEndResult.gameEnded) {
      game.status = 'completed';
      game.gameResult = finalGameEndResult.result;
      game.completedAt = new Date();
    }

    await this.aiGameRepository.save(game);

    return {
      success: true,
      newGameState: game.gameState,
      message: 'Action processed successfully',
      aiResponse: aiAction,
    };
  }

  private async executeAction(
    game: AiGame,
    action: GameAction,
    player: 'player' | 'ai'
  ): Promise<GameResult> {
    const gameState = { ...game.gameState };
    
    try {
      switch (action.type) {
        case 'play_card':
          return await this.playCard(gameState, action, player);
        case 'attack':
          return await this.attack(gameState, action, player);
        case 'defend':
          return await this.defend(gameState, action, player);
        case 'pass':
          return await this.passTurn(gameState, player);
        default:
          return {
            success: false,
            newGameState: gameState,
            message: 'Invalid action type',
          };
      }
    } catch (error) {
      this.logger.error(`Error executing action: ${error.message}`, error);
      return {
        success: false,
        newGameState: gameState,
        message: 'Action failed to execute',
      };
    }
  }

  private async playCard(
    gameState: any,
    action: GameAction,
    player: 'player' | 'ai'
  ): Promise<GameResult> {
    if (!action.cardId) {
      return {
        success: false,
        newGameState: gameState,
        message: 'No card specified',
      };
    }

    const card = await this.cardRepository.findOne({
      where: { id: action.cardId },
    });

    if (!card) {
      return {
        success: false,
        newGameState: gameState,
        message: 'Card not found',
      };
    }

    const handKey = player === 'player' ? 'playerHand' : 'aiHand';
    const fieldKey = player === 'player' ? 'playerField' : 'aiField';
    
    // Check if card is in hand
    if (!gameState[handKey].includes(action.cardId)) {
      return {
        success: false,
        newGameState: gameState,
        message: 'Card not in hand',
      };
    }

    // Check if player has enough mana
    const availableMana = this.calculateAvailableMana(gameState, player);
    if (availableMana < card.azothCost) {
      return {
        success: false,
        newGameState: gameState,
        message: 'Not enough mana',
      };
    }

    // Move card from hand to field
    gameState[handKey] = gameState[handKey].filter(id => id !== action.cardId);
    gameState[fieldKey].push(action.cardId);

    // Apply card effects
    const cardEffectResult = await this.applyCardEffects(gameState, card, player);
    if (!cardEffectResult.success) {
      return cardEffectResult;
    }

    return {
      success: true,
      newGameState: gameState,
      message: `Played ${card.name}`,
    };
  }

  private async attack(
    gameState: any,
    action: GameAction,
    player: 'player' | 'ai'
  ): Promise<GameResult> {
    const fieldKey = player === 'player' ? 'playerField' : 'aiField';
    const opponentLifeKey = player === 'player' ? 'aiLife' : 'playerLife';
    
    if (gameState[fieldKey].length === 0) {
      return {
        success: false,
        newGameState: gameState,
        message: 'No creatures to attack with',
      };
    }

    // Calculate total attack power
    const attackPower = await this.calculateAttackPower(gameState[fieldKey]);
    
    // Apply damage
    gameState[opponentLifeKey] = Math.max(0, gameState[opponentLifeKey] - attackPower);

    return {
      success: true,
      newGameState: gameState,
      message: `Attacked for ${attackPower} damage`,
    };
  }

  private async defend(
    gameState: any,
    action: GameAction,
    player: 'player' | 'ai'
  ): Promise<GameResult> {
    // Implement defensive actions
    return {
      success: true,
      newGameState: gameState,
      message: 'Defensive action taken',
    };
  }

  private async passTurn(
    gameState: any,
    player: 'player' | 'ai'
  ): Promise<GameResult> {
    // End turn logic
    return {
      success: true,
      newGameState: gameState,
      message: 'Turn passed',
    };
  }

  private async applyCardEffects(
    gameState: any,
    card: Card,
    player: 'player' | 'ai'
  ): Promise<GameResult> {
    // Apply card-specific effects based on rules text
    // This would need to parse the rules text and apply effects
    
    return {
      success: true,
      newGameState: gameState,
      message: 'Card effects applied',
    };
  }

  private calculateAvailableMana(gameState: any, player: 'player' | 'ai'): number {
    // Calculate available mana based on field and hand
    // This is simplified - in reality would need to track mana sources
    return 10; // Placeholder
  }

  private async calculateAttackPower(cardIds: string[]): Promise<number> {
    let totalPower = 0;
    
    for (const cardId of cardIds) {
      const card = await this.cardRepository.findOne({ where: { id: cardId } });
      if (card && card.power) {
        totalPower += card.power;
      }
    }
    
    return totalPower;
  }

  private checkGameEnd(gameState: any): {
    gameEnded: boolean;
    result?: any;
    message: string;
  } {
    if (gameState.playerLife <= 0) {
      return {
        gameEnded: true,
        result: {
          winner: 'ai',
          reason: 'Player life reached 0',
          playerScore: 0,
          aiScore: 1,
        },
        message: 'AI wins!',
      };
    }
    
    if (gameState.aiLife <= 0) {
      return {
        gameEnded: true,
        result: {
          winner: 'player',
          reason: 'AI life reached 0',
          playerScore: 1,
          aiScore: 0,
        },
        message: 'Player wins!',
      };
    }
    
    return {
      gameEnded: false,
      message: 'Game continues',
    };
  }

  private async generateAiAction(game: AiGame): Promise<GameAction> {
    const context = {
      currentPhase: game.gameState.currentPhase,
      turn: game.gameState.turn,
      playerLife: game.gameState.playerLife,
      aiLife: game.gameState.aiLife,
      playerHand: game.gameState.playerHand,
      aiHand: game.gameState.aiHand,
      playerField: game.gameState.playerField,
      aiField: game.gameState.aiField,
      playerGraveyard: game.gameState.playerGraveyard,
      aiGraveyard: game.gameState.aiGraveyard,
      availableMana: 10, // Simplified
      playerThreats: game.gameState.playerField, // Simplified
      aiThreats: game.gameState.aiField, // Simplified
    };

    const strategy = await this.aiStrategyService.getOptimalStrategy(
      game.aiOpponentId,
      context
    );

    // Convert strategy to action
    const action: GameAction = {
      type: strategy.strategy as any,
      reasoning: strategy.reasoning,
    };

    // Add specific details based on strategy
    if (strategy.nextMoves.length > 0) {
      const topMove = strategy.nextMoves[0];
      action.cardId = topMove.cardId;
      action.target = topMove.target;
    }

    return action;
  }

  async createAiGame(
    userId: string,
    aiOpponentId: string,
    playerDeck: any
  ): Promise<AiGame> {
    const aiOpponent = await this.aiOpponentRepository.findOne({
      where: { id: aiOpponentId },
    });

    if (!aiOpponent) {
      throw new Error('AI Opponent not found');
    }

    // Generate AI deck
    const aiDeck = await this.generateAiDeck(aiOpponent);

    // Initialize game state
    const gameState = {
      currentPhase: 'draw',
      turn: 1,
      playerLife: 20,
      aiLife: 20,
      playerHand: playerDeck.cards.slice(0, 7),
      aiHand: aiDeck.cards.slice(0, 7),
      playerField: [],
      aiField: [],
      playerDeck: playerDeck.cards.slice(7),
      aiDeck: aiDeck.cards.slice(7),
      playerGraveyard: [],
      aiGraveyard: [],
    };

    const game = this.aiGameRepository.create({
      userId,
      aiOpponentId,
      gameState,
      playerDeck,
      aiDeck,
      status: 'active',
      currentTurn: 'player_turn',
      startedAt: new Date(),
    });

    return this.aiGameRepository.save(game);
  }

  private async generateAiDeck(aiOpponent: AiOpponent): Promise<any> {
    // Generate deck based on AI opponent preferences
    const cards = await this.cardRepository.find({
      where: aiOpponent.preferredElements.length > 0 
        ? { elements: { $in: aiOpponent.preferredElements } }
        : {},
      take: 40,
    });

    return {
      id: `ai_deck_${aiOpponent.id}`,
      name: `${aiOpponent.name}'s Deck`,
      cards: cards.map(card => card.id),
    };
  }
}