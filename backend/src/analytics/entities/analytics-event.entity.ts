import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum EventType {
  INSTALL = 'install',
  MERGE = 'merge',
  BILLING = 'billing',
  ONBOARDING = 'onboarding',
  USER_ACTION = 'user_action',
  SYSTEM = 'system',
}

export enum EventStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

@Entity('analytics_events')
@Index(['eventType', 'createdAt'])
@Index(['userId', 'eventType'])
@Index(['status', 'createdAt'])
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  eventType: EventType;

  @Column({ nullable: true })
  @Index()
  userId: string;

  @Column({ nullable: true })
  sessionId: string;

  @Column('jsonb')
  eventData: any;

  @Column('jsonb', { nullable: true })
  metadata: any;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  status: EventStatus;

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ default: 0 })
  retryCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;
}