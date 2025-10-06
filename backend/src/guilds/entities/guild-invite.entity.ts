import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Guild } from './guild.entity';

@Entity('guild_invites')
export class GuildInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  guildId: string;

  @Column()
  invitedBy: string; // User ID who sent the invite

  @Column({ nullable: true })
  invitedUser: string; // User ID who was invited (if specific)

  @Column({ nullable: true })
  email: string; // Email if inviting by email

  @Column({ nullable: true })
  code: string; // Unique invite code

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'declined' | 'expired';

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column({ type: 'json', nullable: true })
  message: string; // Optional message from inviter

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Guild, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guildId' })
  guild: Guild;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitedBy' })
  inviter: User;
}