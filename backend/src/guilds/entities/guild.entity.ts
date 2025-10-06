import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { GuildMember } from './guild-member.entity';
import { GuildEvent } from './guild-event.entity';

@Entity('guilds')
export class Guild {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  tag: string; // Short guild tag (e.g., "KONIVRER")

  @Column({ nullable: true })
  banner: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'json', default: '{}' })
  settings: {
    isPublic: boolean;
    allowInvites: boolean;
    requireApproval: boolean;
    maxMembers: number;
    minRating: number;
    allowedElements: string[];
    preferredFormats: string[];
  };

  @Column({ type: 'json', default: '{}' })
  stats: {
    totalMembers: number;
    activeMembers: number;
    totalGames: number;
    totalWins: number;
    winRate: number;
    averageRating: number;
    totalTournaments: number;
    tournamentWins: number;
    lastActivity: Date;
  };

  @Column({ type: 'json', default: '[]' })
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  }>;

  @Column({ type: 'json', default: '{}' })
  socialLinks: {
    discord?: string;
    twitter?: string;
    youtube?: string;
    twitch?: string;
    website?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => GuildMember, member => member.guild)
  members: GuildMember[];

  @OneToMany(() => GuildEvent, event => event.guild)
  events: GuildEvent[];
}