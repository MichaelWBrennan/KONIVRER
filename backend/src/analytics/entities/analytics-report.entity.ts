import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ReportType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  CUSTOM = 'custom',
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DISTRIBUTED = 'distributed',
}

@Entity('analytics_reports')
@Index(['reportType', 'createdAt'])
@Index(['status', 'createdAt'])
export class AnalyticsReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  reportType: ReportType;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('date')
  periodStart: Date;

  @Column('date')
  periodEnd: Date;

  @Column('jsonb')
  reportData: any;

  @Column('jsonb', { nullable: true })
  configuration: any;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ nullable: true })
  s3Url: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ type: 'bigint', nullable: true })
  fileSize: number;

  @Column('simple-array', { nullable: true })
  recipients: string[];

  @Column({ type: 'timestamp', nullable: true })
  generatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  distributedAt: Date;

  @Column({ nullable: true })
  generatedBy: string;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}