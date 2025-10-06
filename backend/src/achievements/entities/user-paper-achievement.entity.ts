import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PaperAchievement } from './paper-achievement.entity';

@Entity('user_paper_achievements')
export class UserPaperAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  achievementId: string;

  @Column({ type: 'json', default: '{}' })
  progress: {
    current: number;
    target: number;
    percentage: number;
    lastUpdated: Date;
  };

  @Column({ default: false })
  isUnlocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  unlockedAt: Date;

  @Column({ type: 'json', default: '{}' })
  unlockData: {
    eventId?: string;
    storeId?: string;
    tournamentId?: string;
    gameId?: string;
    notes?: string;
  };

  @Column({ default: false })
  isClaimed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  claimedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => PaperAchievement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'achievementId' })
  achievement: PaperAchievement;
}