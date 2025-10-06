import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiOpponent } from './entities/ai-opponent.entity';
import { AiGame } from './entities/ai-game.entity';
import { User } from '../users/entities/user.entity';
import { AiGameplayService } from './services/ai-gameplay.service';
import { AiStrategyService } from './services/ai-strategy.service';

interface CreateAiOpponentDto {
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  personality: {
    aggression: number;
    riskTolerance: number;
    adaptability: number;
    bluffing: number;
    patience: number;
    creativity: number;
  };
  preferredElements: string[];
  preferredStrategies: string[];
  deckPreferences: {
    minCards: number;
    maxCards: number;
    preferredTypes: string[];
    preferredRarities: string[];
    maxCost: number;
  };
  unlockRequirements?: {
    type: 'win_streak' | 'games_played' | 'achievement' | 'rating';
    value: number;
    description: string;
  };
}

interface GameResult {
  success: boolean;
  gameId?: string;
  message: string;
  gameState?: any;
}

@Injectable()
export class AiOpponentService {
  private readonly logger = new Logger(AiOpponentService.name);

  constructor(
    @InjectRepository(AiOpponent)
    private readonly aiOpponentRepository: Repository<AiOpponent>,
    @InjectRepository(AiGame)
    private readonly aiGameRepository: Repository<AiGame>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly aiGameplayService: AiGameplayService,
    private readonly aiStrategyService: AiStrategyService,
  ) {}

  async createAiOpponent(dto: CreateAiOpponentDto): Promise<AiOpponent> {
    const aiOpponent = this.aiOpponentRepository.create({
      name: dto.name,
      description: dto.description,
      difficulty: dto.difficulty,
      personality: dto.personality,
      preferredElements: dto.preferredElements,
      preferredStrategies: dto.preferredStrategies,
      deckPreferences: dto.deckPreferences,
      unlockRequirements: dto.unlockRequirements,
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        winRate: 0,
        averageGameLength: 0,
        favoriteCards: [],
        mostUsedStrategies: [],
        lastPlayed: new Date(),
      },
      isActive: true,
      isUnlocked: !dto.unlockRequirements,
    });

    return this.aiOpponentRepository.save(aiOpponent);
  }

  async getAvailableOpponents(userId: string): Promise<AiOpponent[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Get all active AI opponents
    const opponents = await this.aiOpponentRepository.find({
      where: { isActive: true },
      order: { difficulty: 'ASC' },
    });

    // Filter based on unlock requirements
    const availableOpponents = [];
    for (const opponent of opponents) {
      if (opponent.isUnlocked) {
        availableOpponents.push(opponent);
      } else if (opponent.unlockRequirements) {
        const isUnlocked = await this.checkUnlockRequirements(
          userId,
          opponent.unlockRequirements
        );
        if (isUnlocked) {
          opponent.isUnlocked = true;
          await this.aiOpponentRepository.save(opponent);
          availableOpponents.push(opponent);
        }
      }
    }

    return availableOpponents;
  }

  async getOpponentById(id: string): Promise<AiOpponent | null> {
    return this.aiOpponentRepository.findOne({ where: { id } });
  }

  async startGame(
    userId: string,
    aiOpponentId: string,
    playerDeck: any
  ): Promise<GameResult> {
    try {
      const aiOpponent = await this.getOpponentById(aiOpponentId);
      if (!aiOpponent) {
        return {
          success: false,
          message: 'AI Opponent not found',
        };
      }

      if (!aiOpponent.isUnlocked) {
        return {
          success: false,
          message: 'AI Opponent is locked',
        };
      }

      const game = await this.aiGameplayService.createAiGame(
        userId,
        aiOpponentId,
        playerDeck
      );

      this.logger.log(`Started AI game: ${game.id} vs ${aiOpponent.name}`);

      return {
        success: true,
        gameId: game.id,
        message: `Game started against ${aiOpponent.name}`,
        gameState: game.gameState,
      };
    } catch (error) {
      this.logger.error('Failed to start AI game', error);
      return {
        success: false,
        message: 'Failed to start game',
      };
    }
  }

  async makeMove(
    gameId: string,
    action: {
      type: 'play_card' | 'attack' | 'defend' | 'pass' | 'special';
      cardId?: string;
      target?: string;
      details?: any;
    }
  ): Promise<GameResult> {
    try {
      const result = await this.aiGameplayService.processPlayerAction(
        gameId,
        action
      );

      if (result.success) {
        this.logger.log(`Move processed in game ${gameId}: ${action.type}`);
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to process move', error);
      return {
        success: false,
        message: 'Failed to process move',
      };
    }
  }

  async getGameState(gameId: string): Promise<any> {
    const game = await this.aiGameRepository.findOne({
      where: { id: gameId },
      relations: ['aiOpponent'],
    });

    if (!game) {
      throw new Error('Game not found');
    }

    return {
      gameId: game.id,
      status: game.status,
      currentTurn: game.currentTurn,
      gameState: game.gameState,
      aiOpponent: {
        id: game.aiOpponent.id,
        name: game.aiOpponent.name,
        difficulty: game.aiOpponent.difficulty,
        personality: game.aiOpponent.personality,
      },
      gameLog: game.gameLog,
      startedAt: game.startedAt,
      completedAt: game.completedAt,
    };
  }

  async getPlayerGames(userId: string, limit = 10): Promise<AiGame[]> {
    return this.aiGameRepository.find({
      where: { userId },
      relations: ['aiOpponent'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getOpponentStats(aiOpponentId: string): Promise<any> {
    const opponent = await this.getOpponentById(aiOpponentId);
    if (!opponent) {
      throw new Error('AI Opponent not found');
    }

    const games = await this.aiGameRepository.find({
      where: { aiOpponentId, status: 'completed' },
    });

    const stats = {
      ...opponent.stats,
      totalGames: games.length,
      recentGames: games.slice(0, 5).map(game => ({
        id: game.id,
        result: game.gameResult?.winner,
        duration: game.gameResult?.duration,
        completedAt: game.completedAt,
      })),
    };

    return stats;
  }

  async updateOpponentStats(
    aiOpponentId: string,
    gameResult: {
      winner: 'player' | 'ai' | 'draw';
      duration: number;
      turns: number;
    }
  ): Promise<void> {
    const opponent = await this.getOpponentById(aiOpponentId);
    if (!opponent) return;

    opponent.stats.gamesPlayed++;
    if (gameResult.winner === 'ai') {
      opponent.stats.gamesWon++;
    }
    opponent.stats.winRate = (opponent.stats.gamesWon / opponent.stats.gamesPlayed) * 100;
    opponent.stats.averageGameLength = 
      (opponent.stats.averageGameLength * (opponent.stats.gamesPlayed - 1) + gameResult.duration) / 
      opponent.stats.gamesPlayed;
    opponent.stats.lastPlayed = new Date();

    await this.aiOpponentRepository.save(opponent);
  }

  private async checkUnlockRequirements(
    userId: string,
    requirements: {
      type: 'win_streak' | 'games_played' | 'achievement' | 'rating';
      value: number;
    }
  ): Promise<boolean> {
    // This would integrate with user stats and achievements
    // For now, return false as placeholder
    return false;
  }

  async seedDefaultOpponents(): Promise<void> {
    const defaultOpponents = [
      {
        name: 'Novice Trainer',
        description: 'A friendly opponent perfect for learning the basics.',
        difficulty: 'beginner' as const,
        personality: {
          aggression: 30,
          riskTolerance: 20,
          adaptability: 40,
          bluffing: 10,
          patience: 80,
          creativity: 20,
        },
        preferredElements: ['Neutral'],
        preferredStrategies: ['defensive'],
        deckPreferences: {
          minCards: 40,
          maxCards: 40,
          preferredTypes: ['Creature'],
          preferredRarities: ['common', 'uncommon'],
          maxCost: 4,
        },
        isUnlocked: true,
      },
      {
        name: 'Elemental Master',
        description: 'A skilled opponent who specializes in elemental magic.',
        difficulty: 'intermediate' as const,
        personality: {
          aggression: 60,
          riskTolerance: 50,
          adaptability: 70,
          bluffing: 40,
          patience: 50,
          creativity: 80,
        },
        preferredElements: ['Fire', 'Water', 'Earth', 'Air'],
        preferredStrategies: ['combo', 'control'],
        deckPreferences: {
          minCards: 40,
          maxCards: 40,
          preferredTypes: ['Creature', 'Spell'],
          preferredRarities: ['uncommon', 'rare'],
          maxCost: 6,
        },
        unlockRequirements: {
          type: 'games_played',
          value: 5,
          description: 'Play 5 games to unlock',
        },
      },
      {
        name: 'Chaos Lord',
        description: 'An unpredictable opponent who thrives on chaos and risk.',
        difficulty: 'advanced' as const,
        personality: {
          aggression: 90,
          riskTolerance: 90,
          adaptability: 60,
          bluffing: 80,
          patience: 20,
          creativity: 95,
        },
        preferredElements: ['Chaos', 'Dark'],
        preferredStrategies: ['aggressive', 'combo'],
        deckPreferences: {
          minCards: 40,
          maxCards: 40,
          preferredTypes: ['Creature', 'Instant'],
          preferredRarities: ['rare', 'mythic'],
          maxCost: 8,
        },
        unlockRequirements: {
          type: 'win_streak',
          value: 3,
          description: 'Win 3 games in a row to unlock',
        },
      },
      {
        name: 'Grandmaster Azoth',
        description: 'The ultimate challenge - a master of all elements.',
        difficulty: 'master' as const,
        personality: {
          aggression: 70,
          riskTolerance: 80,
          adaptability: 95,
          bluffing: 70,
          patience: 90,
          creativity: 100,
        },
        preferredElements: ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark', 'Chaos'],
        preferredStrategies: ['control', 'combo', 'aggressive'],
        deckPreferences: {
          minCards: 40,
          maxCards: 40,
          preferredTypes: ['Creature', 'Spell', 'Artifact'],
          preferredRarities: ['rare', 'mythic'],
          maxCost: 10,
        },
        unlockRequirements: {
          type: 'achievement',
          value: 1,
          description: 'Complete all other achievements to unlock',
        },
      },
    ];

    for (const opponentData of defaultOpponents) {
      const existing = await this.aiOpponentRepository.findOne({
        where: { name: opponentData.name },
      });

      if (!existing) {
        await this.createAiOpponent(opponentData);
        this.logger.log(`Created default AI opponent: ${opponentData.name}`);
      }
    }
  }
}