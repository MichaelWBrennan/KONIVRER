import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from './store.entity';

@Entity('paper_events')
export class PaperEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  storeId: string;

  @Column()
  eventName: string;

  @Column()
  eventType: 'tournament' | 'casual_play' | 'draft' | 'sealed' | 'commander' | 'other';

  @Column({ type: 'timestamp' })
  eventDate: Date;

  @Column({ type: 'json' })
  gameResults: Array<{
    opponentName: string;
    opponentId?: string;
    result: 'win' | 'loss' | 'draw';
    gameLength: number; // in minutes
    notes?: string;
  }>;

  @Column({ type: 'json', default: '{}' })
  tournamentData: {
    tournamentId?: string;
    format?: string;
    entryFee?: number;
    prize?: number;
    position?: number;
    totalPlayers?: number;
    rounds?: number;
  };

  @Column({ type: 'json', default: '[]' })
  deckUsed: Array<{
    cardId: string;
    cardName: string;
    quantity: number;
  }>;

  @Column({ type: 'json', default: '[]' })
  achievementsEarned: Array<{
    achievementId: string;
    achievementName: string;
    unlockedAt: Date;
  }>;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedBy: string; // Store staff or tournament organizer

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'json', nullable: true })
  verificationData: {
    method: 'store_verification' | 'tournament_organizer' | 'peer_verification';
    verifiedBy: string;
    notes?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Store;
}