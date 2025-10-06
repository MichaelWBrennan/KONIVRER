import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AiOpponent } from './ai-opponent.entity';

@Entity('ai_games')
export class AiGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  aiOpponentId: string;

  @Column({ type: 'json' })
  gameState: {
    currentPhase: string;
    turn: number;
    playerLife: number;
    aiLife: number;
    playerHand: string[];
    aiHand: string[];
    playerField: string[];
    aiField: string[];
    playerDeck: string[];
    aiDeck: string[];
    playerGraveyard: string[];
    aiGraveyard: string[];
  };

  @Column({ type: 'json' })
  playerDeck: {
    id: string;
    name: string;
    cards: string[];
  };

  @Column({ type: 'json' })
  aiDeck: {
    id: string;
    name: string;
    cards: string[];
  };

  @Column({
    type: 'enum',
    enum: ['waiting', 'active', 'paused', 'completed', 'abandoned'],
    default: 'waiting',
  })
  status: 'waiting' | 'active' | 'paused' | 'completed' | 'abandoned';

  @Column({
    type: 'enum',
    enum: ['player_turn', 'ai_turn', 'resolving'],
    default: 'player_turn',
  })
  currentTurn: 'player_turn' | 'ai_turn' | 'resolving';

  @Column({ type: 'json', nullable: true })
  gameResult: {
    winner: 'player' | 'ai' | 'draw';
    reason: string;
    turns: number;
    duration: number; // in seconds
    playerScore: number;
    aiScore: number;
  };

  @Column({ type: 'json', default: '[]' })
  gameLog: Array<{
    timestamp: Date;
    player: 'player' | 'ai' | 'system';
    action: string;
    details: any;
  }>;

  @Column({ type: 'json', default: '{}' })
  aiDecisions: {
    strategy: string;
    confidence: number;
    reasoning: string;
    alternatives: Array<{
      action: string;
      confidence: number;
      reasoning: string;
    }>;
  };

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => AiOpponent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aiOpponentId' })
  aiOpponent: AiOpponent;
}