import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AnomalyType {
  SPIKE = 'spike',
  DROP = 'drop',
  UNUSUAL_PATTERN = 'unusual_pattern',
  THRESHOLD_BREACH = 'threshold_breach',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  SUPPRESSED = 'suppressed',
}

@Entity('anomaly_alerts')
@Index(['alertType', 'severity'])
@Index(['status', 'createdAt'])
@Index(['metric', 'createdAt'])
export class AnomalyAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AnomalyType,
  })
  alertType: AnomalyType;

  @Column()
  metric: string;

  @Column('decimal', { precision: 10, scale: 2 })
  currentValue: number;

  @Column('decimal', { precision: 10, scale: 2 })
  expectedValue: number;

  @Column('decimal', { precision: 10, scale: 2 })
  deviationPercentage: number;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
  })
  severity: AlertSeverity;

  @Column({
    type: 'enum',
    enum: AlertStatus,
    default: AlertStatus.ACTIVE,
  })
  status: AlertStatus;

  @Column()
  description: string;

  @Column('jsonb')
  detectionData: any;

  @Column('jsonb', { nullable: true })
  context: any;

  @Column({ nullable: true })
  acknowledgedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ default: false })
  slackNotified: boolean;

  @Column({ default: false })
  emailNotified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}