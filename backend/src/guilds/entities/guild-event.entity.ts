import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guild } from './guild.entity';

@Entity('guild_events')
export class GuildEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  guildId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ['tournament', 'meeting', 'training', 'social', 'other'],
    default: 'other',
  })
  type: 'tournament' | 'meeting' | 'training' | 'social' | 'other';

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'json', default: '{}' })
  settings: {
    maxParticipants: number;
    isPublic: boolean;
    requireApproval: boolean;
    allowedFormats: string[];
    entryFee: number;
    prizePool: number;
  };

  @Column({
    type: 'enum',
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled',
  })
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';

  @Column({ type: 'json', default: '[]' })
  participants: Array<{
    userId: string;
    joinedAt: Date;
    status: 'registered' | 'confirmed' | 'attended' | 'no_show';
  }>;

  @Column({ type: 'json', default: '{}' })
  results: {
    winner?: string;
    runnerUp?: string;
    participants: Array<{
      userId: string;
      position: number;
      score: number;
    }>;
  };

  @Column({ type: 'json', default: '[]' })
  chat: Array<{
    userId: string;
    message: string;
    timestamp: Date;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Guild, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guildId' })
  guild: Guild;
}