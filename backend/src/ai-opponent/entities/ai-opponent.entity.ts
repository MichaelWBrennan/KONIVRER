import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ai_opponents')
export class AiOpponent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ['beginner', 'intermediate', 'advanced', 'expert', 'master'],
    default: 'beginner',
  })
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';

  @Column({ type: 'json', default: '{}' })
  personality: {
    aggression: number; // 0-100, how aggressive the AI plays
    riskTolerance: number; // 0-100, how much risk the AI takes
    adaptability: number; // 0-100, how well AI adapts to opponent strategy
    bluffing: number; // 0-100, how often AI bluffs
    patience: number; // 0-100, how patient AI is with plays
    creativity: number; // 0-100, how creative AI is with combos
  };

  @Column({ type: 'json', default: '[]' })
  preferredElements: string[];

  @Column({ type: 'json', default: '[]' })
  preferredStrategies: string[];

  @Column({ type: 'json', default: '{}' })
  deckPreferences: {
    minCards: number;
    maxCards: number;
    preferredTypes: string[];
    preferredRarities: string[];
    maxCost: number;
  };

  @Column({ type: 'json', default: '{}' })
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
    averageGameLength: number;
    favoriteCards: string[];
    mostUsedStrategies: string[];
    lastPlayed: Date;
  };

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isUnlocked: boolean;

  @Column({ type: 'json', nullable: true })
  unlockRequirements: {
    type: 'win_streak' | 'games_played' | 'achievement' | 'rating';
    value: number;
    description: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}