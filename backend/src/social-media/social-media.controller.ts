import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SocialMediaService, SocialShareRequest, StreamRequest } from './social-media.service';

export class ShareContentDto {
  userId: string;
  content: {
    type: 'deck' | 'tournament' | 'achievement' | 'match_result';
    data: any;
  };
  platforms: ('discord' | 'twitter' | 'youtube' | 'twitch' | 'reddit' | 'instagram')[];
  message?: string;
  schedule?: Date;
}

export class StartStreamDto {
  userId: string;
  platforms: ('twitch' | 'youtube')[];
  title: string;
  description?: string;
  gameId?: string;
  deckId?: string;
}

export class UpdatePresenceDto {
  userId: string;
  gameState: {
    status: 'playing' | 'building' | 'watching' | 'idle';
    gameId?: string;
    deckName?: string;
    tournamentName?: string;
  };
}

@Controller('api/social')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Social Media Integration')
export class SocialMediaController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  @Post('share')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Share content across social media platforms' })
  @ApiResponse({
    status: 200,
    description: 'Content shared successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          platform: { type: 'string' },
          success: { type: 'boolean' },
          postId: { type: 'string' },
          url: { type: 'string' },
          error: { type: 'string' },
        },
      },
    },
  })
  async shareContent(@Body() shareRequest: ShareContentDto) {
    return this.socialMediaService.shareContent(shareRequest);
  }

  @Post('stream/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start streaming to social media platforms' })
  @ApiResponse({
    status: 200,
    description: 'Streaming started successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          platform: { type: 'string' },
          streamId: { type: 'string' },
          streamUrl: { type: 'string' },
          chatUrl: { type: 'string' },
          overlayUrl: { type: 'string' },
        },
      },
    },
  })
  async startStreaming(@Body() streamRequest: StartStreamDto) {
    return this.socialMediaService.startStreaming(streamRequest);
  }

  @Post('discord/presence')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Discord rich presence' })
  @ApiResponse({ status: 200, description: 'Discord presence updated successfully' })
  async updateDiscordPresence(@Body() presenceRequest: UpdatePresenceDto) {
    return this.socialMediaService.updateDiscordPresence(
      presenceRequest.userId,
      presenceRequest.gameState,
    );
  }

  @Post('tournament/:tournamentId/update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send tournament update to Discord webhook' })
  @ApiResponse({ status: 200, description: 'Tournament update sent successfully' })
  async sendTournamentUpdate(
    @Param('tournamentId') tournamentId: string,
    @Body() update: {
      type: 'started' | 'round_complete' | 'finished' | 'player_eliminated';
      message: string;
      data?: any;
    },
  ) {
    return this.socialMediaService.sendTournamentUpdate(tournamentId, update);
  }

  @Post('deck/:deckId/share')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Share deck visualization across platforms' })
  @ApiResponse({ status: 200, description: 'Deck shared successfully' })
  async shareDeckVisualization(
    @Param('deckId') deckId: string,
    @Body() request: { userId: string; platforms: string[] },
  ) {
    return this.socialMediaService.shareDeckVisualization(
      request.userId,
      deckId,
      request.platforms,
    );
  }

  @Get('analytics/:userId')
  @ApiOperation({ summary: 'Get social media analytics for user' })
  @ApiResponse({
    status: 200,
    description: 'Social media analytics retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          platform: { type: 'string' },
          followers: { type: 'number' },
          engagement: { type: 'number' },
          posts: { type: 'number' },
        },
      },
    },
  })
  async getSocialAnalytics(@Param('userId') userId: string) {
    return this.socialMediaService.getSocialAnalytics(userId);
  }

  @Post('schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Schedule content for later posting' })
  @ApiResponse({ status: 200, description: 'Content scheduled successfully' })
  async scheduleContent(
    @Body() request: ShareContentDto & { scheduledTime: Date },
  ) {
    return this.socialMediaService.scheduleContent(
      request,
      request.scheduledTime,
    );
  }
}