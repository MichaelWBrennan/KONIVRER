import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Guild } from './guild.entity';

@Entity('guild_members')
export class GuildMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  guildId: string;

  @Column({
    type: 'enum',
    enum: ['member', 'officer', 'admin', 'leader'],
    default: 'member',
  })
  role: 'member' | 'officer' | 'admin' | 'leader';

  @Column({ type: 'json', default: '{}' })
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
    contribution: number;
    lastActive: Date;
    joinedAt: Date;
  };

  @Column({ type: 'json', default: '[]' })
  permissions: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  joinedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  leftAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Guild, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guildId' })
  guild: Guild;
}