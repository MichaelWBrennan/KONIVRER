import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('paper_achievements')
export class PaperAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common',
  })
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  @Column({
    type: 'enum',
    enum: ['tournament', 'store', 'community', 'milestone', 'special'],
    default: 'milestone',
  })
  category: 'tournament' | 'store' | 'community' | 'milestone' | 'special';

  @Column({ type: 'json' })
  requirements: {
    type: 'games_played' | 'tournaments_entered' | 'tournaments_won' | 'store_visits' | 'community_events' | 'specific_achievement' | 'custom';
    value: number;
    description: string;
    conditions?: {
      minPlayers?: number;
      storeId?: string;
      eventType?: string;
      consecutive?: boolean;
      timeLimit?: number; // in days
      element?: string;
      format?: string;
    };
  };

  @Column({ type: 'json', default: '{}' })
  rewards: {
    points: number;
    title?: string;
    badge?: string;
    specialPrivileges?: string[];
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}