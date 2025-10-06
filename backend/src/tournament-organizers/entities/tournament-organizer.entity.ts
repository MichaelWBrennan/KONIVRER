import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tournament_organizers')
export class TournamentOrganizer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  organizationName: string;

  @Column({ nullable: true })
  organizationType: 'store' | 'club' | 'convention' | 'independent' | 'other';

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ type: 'json', default: '{}' })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected' | 'suspended';

  @Column({ type: 'json', default: '[]' })
  certifications: Array<{
    name: string;
    issuer: string;
    issuedDate: Date;
    expiryDate?: Date;
    certificateId: string;
  }>;

  @Column({ type: 'json', default: '[]' })
  permissions: Array<{
    feature: string;
    level: 'basic' | 'standard' | 'premium' | 'enterprise';
    grantedAt: Date;
    expiresAt?: Date;
  }>;

  @Column({ type: 'json', default: '{}' })
  stats: {
    tournamentsOrganized: number;
    totalParticipants: number;
    averageEventSize: number;
    rating: number;
    reviewCount: number;
    lastTournamentDate: Date;
  };

  @Column({ type: 'json', default: '{}' })
  settings: {
    maxTournamentSize: number;
    allowedFormats: string[];
    autoApproveParticipants: boolean;
    requireDeckSubmission: boolean;
    allowSpectators: boolean;
    enableLiveStreaming: boolean;
  };

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  lastActiveAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}