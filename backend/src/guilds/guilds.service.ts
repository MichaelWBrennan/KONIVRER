import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guild } from './entities/guild.entity';
import { GuildMember } from './entities/guild-member.entity';
import { GuildInvite } from './entities/guild-invite.entity';
import { GuildEvent } from './entities/guild-event.entity';
import { User } from '../users/entities/user.entity';

interface CreateGuildDto {
  name: string;
  description: string;
  tag?: string;
  settings?: {
    isPublic: boolean;
    allowInvites: boolean;
    requireApproval: boolean;
    maxMembers: number;
    minRating: number;
    allowedElements: string[];
    preferredFormats: string[];
  };
  socialLinks?: {
    discord?: string;
    twitter?: string;
    youtube?: string;
    twitch?: string;
    website?: string;
  };
}

interface UpdateGuildDto {
  name?: string;
  description?: string;
  tag?: string;
  banner?: string;
  logo?: string;
  settings?: Partial<Guild['settings']>;
  socialLinks?: Partial<Guild['socialLinks']>;
}

interface InviteToGuildDto {
  userId?: string;
  email?: string;
  message?: string;
  expiresInDays?: number;
}

@Injectable()
export class GuildsService {
  private readonly logger = new Logger(GuildsService.name);

  constructor(
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
    @InjectRepository(GuildMember)
    private readonly guildMemberRepository: Repository<GuildMember>,
    @InjectRepository(GuildInvite)
    private readonly guildInviteRepository: Repository<GuildInvite>,
    @InjectRepository(GuildEvent)
    private readonly guildEventRepository: Repository<GuildEvent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createGuild(userId: string, dto: CreateGuildDto): Promise<Guild> {
    // Check if user is already in a guild
    const existingMembership = await this.guildMemberRepository.findOne({
      where: { userId, isActive: true },
    });

    if (existingMembership) {
      throw new BadRequestException('User is already a member of a guild');
    }

    // Create guild
    const guild = this.guildRepository.create({
      name: dto.name,
      description: dto.description,
      tag: dto.tag,
      settings: {
        isPublic: true,
        allowInvites: true,
        requireApproval: false,
        maxMembers: 50,
        minRating: 0,
        allowedElements: [],
        preferredFormats: [],
        ...dto.settings,
      },
      socialLinks: dto.socialLinks || {},
      stats: {
        totalMembers: 0,
        activeMembers: 0,
        totalGames: 0,
        totalWins: 0,
        winRate: 0,
        averageRating: 0,
        totalTournaments: 0,
        tournamentWins: 0,
        lastActivity: new Date(),
      },
      achievements: [],
      isActive: true,
    });

    const savedGuild = await this.guildRepository.save(guild);

    // Add creator as leader
    await this.addMember(savedGuild.id, userId, 'leader');

    this.logger.log(`Guild created: ${savedGuild.name} by user ${userId}`);
    return savedGuild;
  }

  async getGuildById(id: string): Promise<Guild> {
    const guild = await this.guildRepository.findOne({
      where: { id },
      relations: ['members', 'members.user', 'events'],
    });

    if (!guild) {
      throw new NotFoundException('Guild not found');
    }

    return guild;
  }

  async getGuilds(filters?: {
    isPublic?: boolean;
    minRating?: number;
    maxMembers?: number;
    search?: string;
  }): Promise<Guild[]> {
    const query = this.guildRepository.createQueryBuilder('guild')
      .leftJoinAndSelect('guild.members', 'members')
      .leftJoinAndSelect('members.user', 'user')
      .where('guild.isActive = :isActive', { isActive: true });

    if (filters?.isPublic !== undefined) {
      query.andWhere('guild.settings->isPublic = :isPublic', { isPublic: filters.isPublic });
    }

    if (filters?.minRating) {
      query.andWhere('guild.stats->averageRating >= :minRating', { minRating: filters.minRating });
    }

    if (filters?.maxMembers) {
      query.andWhere('guild.stats->totalMembers <= :maxMembers', { maxMembers: filters.maxMembers });
    }

    if (filters?.search) {
      query.andWhere('(guild.name ILIKE :search OR guild.description ILIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    return query.getMany();
  }

  async updateGuild(guildId: string, userId: string, dto: UpdateGuildDto): Promise<Guild> {
    const guild = await this.getGuildById(guildId);
    const membership = await this.getGuildMembership(guildId, userId);

    if (!membership || !['admin', 'leader'].includes(membership.role)) {
      throw new ForbiddenException('Insufficient permissions to update guild');
    }

    Object.assign(guild, dto);
    return this.guildRepository.save(guild);
  }

  async addMember(guildId: string, userId: string, role: 'member' | 'officer' | 'admin' | 'leader' = 'member'): Promise<GuildMember> {
    const guild = await this.getGuildById(guildId);
    
    // Check if user is already a member
    const existingMembership = await this.guildMemberRepository.findOne({
      where: { guildId, userId, isActive: true },
    });

    if (existingMembership) {
      throw new BadRequestException('User is already a member of this guild');
    }

    // Check guild capacity
    if (guild.stats.totalMembers >= guild.settings.maxMembers) {
      throw new BadRequestException('Guild is at maximum capacity');
    }

    const member = this.guildMemberRepository.create({
      guildId,
      userId,
      role,
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        winRate: 0,
        contribution: 0,
        lastActive: new Date(),
        joinedAt: new Date(),
      },
      permissions: this.getDefaultPermissions(role),
      isActive: true,
      joinedAt: new Date(),
    });

    const savedMember = await this.guildMemberRepository.save(member);

    // Update guild stats
    await this.updateGuildStats(guildId);

    this.logger.log(`User ${userId} added to guild ${guild.name} as ${role}`);
    return savedMember;
  }

  async removeMember(guildId: string, userId: string, removedBy: string): Promise<void> {
    const membership = await this.getGuildMembership(guildId, userId);
    const removerMembership = await this.getGuildMembership(guildId, removedBy);

    if (!membership) {
      throw new NotFoundException('User is not a member of this guild');
    }

    if (!removerMembership || !['admin', 'leader'].includes(removerMembership.role)) {
      throw new ForbiddenException('Insufficient permissions to remove member');
    }

    // Can't remove the last leader
    if (membership.role === 'leader') {
      const leaderCount = await this.guildMemberRepository.count({
        where: { guildId, role: 'leader', isActive: true },
      });
      if (leaderCount <= 1) {
        throw new BadRequestException('Cannot remove the last leader');
      }
    }

    membership.isActive = false;
    membership.leftAt = new Date();
    await this.guildMemberRepository.save(membership);

    // Update guild stats
    await this.updateGuildStats(guildId);

    this.logger.log(`User ${userId} removed from guild ${guildId} by ${removedBy}`);
  }

  async inviteToGuild(guildId: string, inviterId: string, dto: InviteToGuildDto): Promise<GuildInvite> {
    const guild = await this.getGuildById(guildId);
    const inviterMembership = await this.getGuildMembership(guildId, inviterId);

    if (!inviterMembership || !['officer', 'admin', 'leader'].includes(inviterMembership.role)) {
      throw new ForbiddenException('Insufficient permissions to invite members');
    }

    if (!guild.settings.allowInvites) {
      throw new BadRequestException('Guild does not allow invites');
    }

    // Check if user is already a member
    if (dto.userId) {
      const existingMembership = await this.guildMemberRepository.findOne({
        where: { guildId, userId: dto.userId, isActive: true },
      });
      if (existingMembership) {
        throw new BadRequestException('User is already a member of this guild');
      }
    }

    const invite = this.guildInviteRepository.create({
      guildId,
      invitedBy: inviterId,
      invitedUser: dto.userId,
      email: dto.email,
      code: this.generateInviteCode(),
      message: dto.message,
      expiresAt: new Date(Date.now() + (dto.expiresInDays || 7) * 24 * 60 * 60 * 1000),
    });

    return this.guildInviteRepository.save(invite);
  }

  async acceptInvite(inviteId: string, userId: string): Promise<GuildMember> {
    const invite = await this.guildInviteRepository.findOne({
      where: { id: inviteId },
      relations: ['guild'],
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status !== 'pending') {
      throw new BadRequestException('Invite is no longer valid');
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      invite.status = 'expired';
      await this.guildInviteRepository.save(invite);
      throw new BadRequestException('Invite has expired');
    }

    if (invite.invitedUser && invite.invitedUser !== userId) {
      throw new ForbiddenException('This invite is not for you');
    }

    // Add user to guild
    const member = await this.addMember(invite.guildId, userId, 'member');

    // Update invite status
    invite.status = 'accepted';
    invite.respondedAt = new Date();
    await this.guildInviteRepository.save(invite);

    this.logger.log(`User ${userId} accepted invite to guild ${invite.guildId}`);
    return member;
  }

  async getGuildMembership(guildId: string, userId: string): Promise<GuildMember | null> {
    return this.guildMemberRepository.findOne({
      where: { guildId, userId, isActive: true },
      relations: ['user', 'guild'],
    });
  }

  async getGuildMembers(guildId: string): Promise<GuildMember[]> {
    return this.guildMemberRepository.find({
      where: { guildId, isActive: true },
      relations: ['user'],
      order: { role: 'ASC', createdAt: 'ASC' },
    });
  }

  async getGuildEvents(guildId: string): Promise<GuildEvent[]> {
    return this.guildEventRepository.find({
      where: { guildId },
      order: { startDate: 'ASC' },
    });
  }

  private async updateGuildStats(guildId: string): Promise<void> {
    const members = await this.getGuildMembers(guildId);
    const activeMembers = members.filter(m => m.stats.lastActive > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    const totalGames = members.reduce((sum, m) => sum + m.stats.gamesPlayed, 0);
    const totalWins = members.reduce((sum, m) => sum + m.stats.gamesWon, 0);
    const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
    const averageRating = members.length > 0 
      ? members.reduce((sum, m) => sum + (m.user.rating || 1000), 0) / members.length 
      : 0;

    await this.guildRepository.update(guildId, {
      stats: {
        totalMembers: members.length,
        activeMembers: activeMembers.length,
        totalGames,
        totalWins,
        winRate,
        averageRating,
        totalTournaments: 0, // Would need to calculate from tournament data
        tournamentWins: 0,
        lastActivity: new Date(),
      },
    });
  }

  private getDefaultPermissions(role: string): string[] {
    const permissions = {
      member: ['view_guild', 'participate_events'],
      officer: ['view_guild', 'participate_events', 'invite_members', 'manage_events'],
      admin: ['view_guild', 'participate_events', 'invite_members', 'manage_events', 'manage_members', 'update_guild'],
      leader: ['view_guild', 'participate_events', 'invite_members', 'manage_events', 'manage_members', 'update_guild', 'delete_guild'],
    };
    return permissions[role] || permissions.member;
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}