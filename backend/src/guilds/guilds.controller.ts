import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GuildsService } from './guilds.service';

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
  settings?: any;
  socialLinks?: any;
}

interface InviteToGuildDto {
  userId?: string;
  email?: string;
  message?: string;
  expiresInDays?: number;
}

@ApiTags('Guilds')
@Controller('guilds')
export class GuildsController {
  constructor(private readonly guildsService: GuildsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new guild' })
  @ApiResponse({ status: 201, description: 'Guild created successfully' })
  async createGuild(
    @Body() createGuildDto: CreateGuildDto,
    @Query('userId') userId: string
  ) {
    try {
      const guild = await this.guildsService.createGuild(userId, createGuildDto);

      return {
        success: true,
        data: guild,
        message: 'Guild created successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create guild',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get guilds with filters' })
  @ApiResponse({ status: 200, description: 'Guilds retrieved successfully' })
  @ApiQuery({ name: 'isPublic', description: 'Filter by public status', required: false })
  @ApiQuery({ name: 'minRating', description: 'Minimum average rating', required: false })
  @ApiQuery({ name: 'maxMembers', description: 'Maximum member count', required: false })
  @ApiQuery({ name: 'search', description: 'Search term', required: false })
  async getGuilds(
    @Query('isPublic') isPublic?: boolean,
    @Query('minRating') minRating?: number,
    @Query('maxMembers') maxMembers?: number,
    @Query('search') search?: string
  ) {
    try {
      const guilds = await this.guildsService.getGuilds({
        isPublic,
        minRating,
        maxMembers,
        search,
      });

      return {
        success: true,
        data: guilds,
        total: guilds.length,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get guilds',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guild by ID' })
  @ApiResponse({ status: 200, description: 'Guild retrieved successfully' })
  @ApiParam({ name: 'id', description: 'Guild ID' })
  async getGuildById(@Param('id') id: string) {
    try {
      const guild = await this.guildsService.getGuildById(id);

      return {
        success: true,
        data: guild,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get guild',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update guild' })
  @ApiResponse({ status: 200, description: 'Guild updated successfully' })
  @ApiParam({ name: 'id', description: 'Guild ID' })
  async updateGuild(
    @Param('id') id: string,
    @Body() updateGuildDto: UpdateGuildDto,
    @Query('userId') userId: string
  ) {
    try {
      const guild = await this.guildsService.updateGuild(id, userId, updateGuildDto);

      return {
        success: true,
        data: guild,
        message: 'Guild updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update guild',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get guild members' })
  @ApiResponse({ status: 200, description: 'Guild members retrieved successfully' })
  @ApiParam({ name: 'id', description: 'Guild ID' })
  async getGuildMembers(@Param('id') id: string) {
    try {
      const members = await this.guildsService.getGuildMembers(id);

      return {
        success: true,
        data: members,
        total: members.length,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get guild members',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to guild' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiParam({ name: 'id', description: 'Guild ID' })
  async addMember(
    @Param('id') id: string,
    @Body() body: { userId: string; role?: string }
  ) {
    try {
      const member = await this.guildsService.addMember(
        id,
        body.userId,
        body.role as any || 'member'
      );

      return {
        success: true,
        data: member,
        message: 'Member added successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to add member',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove member from guild' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiParam({ name: 'id', description: 'Guild ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Query('removedBy') removedBy: string
  ) {
    try {
      await this.guildsService.removeMember(id, userId, removedBy);

      return {
        success: true,
        message: 'Member removed successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to remove member',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':id/invites')
  @ApiOperation({ summary: 'Invite user to guild' })
  @ApiResponse({ status: 201, description: 'Invite sent successfully' })
  @ApiParam({ name: 'id', description: 'Guild ID' })
  async inviteToGuild(
    @Param('id') id: string,
    @Body() inviteDto: InviteToGuildDto,
    @Query('inviterId') inviterId: string
  ) {
    try {
      const invite = await this.guildsService.inviteToGuild(id, inviterId, inviteDto);

      return {
        success: true,
        data: invite,
        message: 'Invite sent successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to send invite',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('invites/:inviteId/accept')
  @ApiOperation({ summary: 'Accept guild invite' })
  @ApiResponse({ status: 200, description: 'Invite accepted successfully' })
  @ApiParam({ name: 'inviteId', description: 'Invite ID' })
  async acceptInvite(
    @Param('inviteId') inviteId: string,
    @Query('userId') userId: string
  ) {
    try {
      const member = await this.guildsService.acceptInvite(inviteId, userId);

      return {
        success: true,
        data: member,
        message: 'Invite accepted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to accept invite',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id/events')
  @ApiOperation({ summary: 'Get guild events' })
  @ApiResponse({ status: 200, description: 'Guild events retrieved successfully' })
  @ApiParam({ name: 'id', description: 'Guild ID' })
  async getGuildEvents(@Param('id') id: string) {
    try {
      const events = await this.guildsService.getGuildEvents(id);

      return {
        success: true,
        data: events,
        total: events.length,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get guild events',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}