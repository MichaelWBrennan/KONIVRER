import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { TournamentOrganizer } from '../../tournament-organizers/entities/tournament-organizer.entity';
import { TournamentBracket } from './tournament-bracket.entity';

@Entity('advanced_tournaments')
export class AdvancedTournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizerId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ['swiss', 'elimination', 'round_robin', 'hybrid', 'custom'],
    default: 'swiss',
  })
  format: 'swiss' | 'elimination' | 'round_robin' | 'hybrid' | 'custom';

  @Column({
    type: 'enum',
    enum: ['constructed', 'limited', 'draft', 'sealed', 'commander', 'other'],
    default: 'constructed',
  })
  type: 'constructed' | 'limited' | 'draft' | 'sealed' | 'commander' | 'other';

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'timestamp' })
  registrationDeadline: Date;

  @Column({ type: 'json', default: '{}' })
  settings: {
    maxPlayers: number;
    minPlayers: number;
    entryFee: number;
    prizePool: number;
    prizeDistribution: Array<{
      position: number;
      percentage: number;
      fixedAmount?: number;
    }>;
    timePerRound: number; // in minutes
    timePerGame: number; // in minutes
    allowTies: boolean;
    tiebreakerMethod: 'opponent_match_win' | 'game_win_percentage' | 'opponent_game_win_percentage' | 'custom';
    deckSubmissionRequired: boolean;
    deckSubmissionDeadline: Date;
    allowDeckChanges: boolean;
    spectatorMode: 'none' | 'delayed' | 'live';
    streamingAllowed: boolean;
    requireStreaming: boolean;
    customRules: string;
  };

  @Column({
    type: 'enum',
    enum: ['draft', 'registration', 'active', 'completed', 'cancelled'],
    default: 'draft',
  })
  status: 'draft' | 'registration' | 'active' | 'completed' | 'cancelled';

  @Column({ type: 'json', default: '[]' })
  participants: Array<{
    userId: string;
    username: string;
    deckId?: string;
    deckName?: string;
    registeredAt: Date;
    status: 'registered' | 'confirmed' | 'dropped' | 'disqualified';
    seed?: number;
  }>;

  @Column({ type: 'json', default: '{}' })
  standings: {
    currentRound: number;
    totalRounds: number;
    standings: Array<{
      userId: string;
      username: string;
      wins: number;
      losses: number;
      draws: number;
      points: number;
      tiebreakers: {
        opponentMatchWin: number;
        gameWinPercentage: number;
        opponentGameWinPercentage: number;
      };
      position: number;
    }>;
  };

  @Column({ type: 'json', default: '{}' })
  liveData: {
    currentRound: number;
    activeMatches: Array<{
      matchId: string;
      player1: string;
      player2: string;
      table: number;
      status: 'waiting' | 'active' | 'completed';
      startTime?: Date;
      endTime?: Date;
    }>;
    completedMatches: Array<{
      matchId: string;
      player1: string;
      player2: string;
      result: string;
      duration: number;
      completedAt: Date;
    }>;
    nextRoundStartTime?: Date;
  };

  @Column({ type: 'json', default: '[]' })
  announcements: Array<{
    id: string;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: Date;
    createdBy: string;
  }>;

  @Column({ type: 'json', default: '{}' })
  streaming: {
    enabled: boolean;
    streamUrl?: string;
    delay: number; // in seconds
    quality: '720p' | '1080p' | '4k';
    commentary: boolean;
    commentators: string[];
  };

  @Column({ type: 'json', default: '{}' })
  analytics: {
    totalViewers: number;
    peakViewers: number;
    averageViewers: number;
    engagement: number;
    socialMediaMentions: number;
    streamDuration: number;
  };

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  verifiedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TournamentOrganizer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizerId' })
  organizer: TournamentOrganizer;

  @OneToMany(() => TournamentBracket, bracket => bracket.tournament)
  brackets: TournamentBracket[];
}