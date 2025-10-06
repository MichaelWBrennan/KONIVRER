import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SocialMediaRealService } from './social-media-real.service';
import { DeckIntegrationService } from './integrations/deck-integration.service';
import { TournamentIntegrationService } from './integrations/tournament-integration.service';

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

@Controller('api/social/real')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Social Media Integration (Real APIs)')
export class SocialMediaRealController {
  constructor(
    private readonly socialMediaService: SocialMediaRealService,
    private readonly deckIntegrationService: DeckIntegrationService,
    private readonly tournamentIntegrationService: TournamentIntegrationService,
  ) {}

  @Post('share')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Share content across social media platforms (Real APIs)' })
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
  @ApiOperation({ summary: 'Start streaming to social media platforms (Real APIs)' })
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
  @ApiOperation({ summary: 'Update Discord rich presence (Real API)' })
  @ApiResponse({ status: 200, description: 'Discord presence updated successfully' })
  async updateDiscordPresence(@Body() presenceRequest: UpdatePresenceDto) {
    return this.socialMediaService.updateDiscordPresence(
      presenceRequest.userId,
      presenceRequest.gameState,
    );
  }

  @Post('tournament/:tournamentId/update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send tournament update to Discord webhook (Real API)' })
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
  @ApiOperation({ summary: 'Share deck visualization across platforms (Real APIs)' })
  @ApiResponse({ status: 200, description: 'Deck shared successfully' })
  async shareDeckVisualization(
    @Param('deckId') deckId: string,
    @Body() request: { userId: string; platforms: string[]; message?: string },
  ) {
    return this.deckIntegrationService.shareDeck(
      deckId,
      request.userId,
      request.platforms,
      request.message,
    );
  }

  @Get('deck/:deckId/data')
  @ApiOperation({ summary: 'Get deck data formatted for social media' })
  @ApiResponse({ status: 200, description: 'Deck social data retrieved successfully' })
  async getDeckSocialData(@Param('deckId') deckId: string) {
    return this.deckIntegrationService.getDeckSocialData(deckId);
  }

  @Get('deck/:deckId/analytics')
  @ApiOperation({ summary: 'Get deck social media analytics' })
  @ApiResponse({ status: 200, description: 'Deck analytics retrieved successfully' })
  async getDeckAnalytics(@Param('deckId') deckId: string) {
    return this.deckIntegrationService.getDeckAnalytics(deckId);
  }

  @Get('deck/trending')
  @ApiOperation({ summary: 'Get trending decks for social media' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of trending decks to return' })
  @ApiResponse({ status: 200, description: 'Trending decks retrieved successfully' })
  async getTrendingDecks(@Query('limit') limit?: number) {
    return this.deckIntegrationService.getTrendingDecks(limit || 10);
  }

  @Get('deck/recommendations/:userId')
  @ApiOperation({ summary: 'Get deck recommendations for social sharing' })
  @ApiResponse({ status: 200, description: 'Deck recommendations retrieved successfully' })
  async getDeckRecommendations(@Param('userId') userId: string) {
    return this.deckIntegrationService.getDeckRecommendations(userId);
  }

  @Post('tournament/:tournamentId/share')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Share tournament across platforms (Real APIs)' })
  @ApiResponse({ status: 200, description: 'Tournament shared successfully' })
  async shareTournament(
    @Param('tournamentId') tournamentId: string,
    @Body() request: { platforms: string[]; message?: string },
  ) {
    return this.tournamentIntegrationService.shareTournament(
      tournamentId,
      request.platforms,
      request.message,
    );
  }

  @Get('tournament/:tournamentId/data')
  @ApiOperation({ summary: 'Get tournament data formatted for social media' })
  @ApiResponse({ status: 200, description: 'Tournament social data retrieved successfully' })
  async getTournamentSocialData(@Param('tournamentId') tournamentId: string) {
    return this.tournamentIntegrationService.getTournamentSocialData(tournamentId);
  }

  @Get('tournament/:tournamentId/analytics')
  @ApiOperation({ summary: 'Get tournament social media analytics' })
  @ApiResponse({ status: 200, description: 'Tournament analytics retrieved successfully' })
  async getTournamentAnalytics(@Param('tournamentId') tournamentId: string) {
    return this.tournamentIntegrationService.getTournamentAnalytics(tournamentId);
  }

  @Get('tournament/upcoming')
  @ApiOperation({ summary: 'Get upcoming tournaments for social promotion' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of tournaments to return' })
  @ApiResponse({ status: 200, description: 'Upcoming tournaments retrieved successfully' })
  async getUpcomingTournaments(@Query('limit') limit?: number) {
    return this.tournamentIntegrationService.getUpcomingTournaments(limit || 5);
  }

  @Get('tournament/live')
  @ApiOperation({ summary: 'Get live tournaments for streaming promotion' })
  @ApiResponse({ status: 200, description: 'Live tournaments retrieved successfully' })
  async getLiveTournaments() {
    return this.tournamentIntegrationService.getLiveTournaments();
  }

  @Post('tournament/:tournamentId/promote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Schedule tournament promotion posts' })
  @ApiResponse({ status: 200, description: 'Tournament promotion scheduled successfully' })
  async scheduleTournamentPromotion(@Param('tournamentId') tournamentId: string) {
    return this.tournamentIntegrationService.scheduleTournamentPromotion(tournamentId);
  }

  @Get('analytics/:userId')
  @ApiOperation({ summary: 'Get social media analytics for user (Real APIs)' })
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
          growth: { type: 'number' },
        },
      },
    },
  })
  async getSocialAnalytics(@Param('userId') userId: string) {
    return this.socialMediaService.getSocialAnalytics(userId);
  }

  @Get('trending/:platform')
  @ApiOperation({ summary: 'Get trending hashtags for platform (Real APIs)' })
  @ApiResponse({ status: 200, description: 'Trending hashtags retrieved successfully' })
  async getTrendingHashtags(@Param('platform') platform: string) {
    return this.socialMediaService.getTrendingHashtags(platform);
  }

  @Get('optimal-times/:platform')
  @ApiOperation({ summary: 'Get optimal posting times for platform' })
  @ApiResponse({ status: 200, description: 'Optimal posting times retrieved successfully' })
  async getOptimalPostingTimes(@Param('platform') platform: string) {
    return this.socialMediaService.getOptimalPostingTimes(platform);
  }

  @Post('bulk-share')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk share content to multiple platforms with rate limiting' })
  @ApiResponse({ status: 200, description: 'Bulk sharing completed successfully' })
  async bulkShareContent(
    @Body() request: {
      requests: ShareContentDto[];
      delayMs?: number;
    },
  ) {
    return this.socialMediaService.bulkShareContent(
      request.requests,
      request.delayMs || 1000,
    );
  }

  @Get('content-suggestions')
  @ApiOperation({ summary: 'Get platform-specific content suggestions' })
  @ApiQuery({ name: 'contentType', required: true, type: String })
  @ApiQuery({ name: 'platform', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Content suggestions retrieved successfully' })
  async getContentSuggestions(
    @Query('contentType') contentType: string,
    @Query('platform') platform: string,
    @Body() data: any,
  ) {
    return this.socialMediaService.getContentSuggestions(
      contentType as any,
      platform,
      data,
    );
  }

  @Get('health')
  @ApiOperation({ summary: 'Get platform health status' })
  @ApiResponse({ status: 200, description: 'Platform health retrieved successfully' })
  async getPlatformHealth() {
    return this.socialMediaService.getPlatformHealth();
  }

  @Post('schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Schedule content for later posting (Real scheduling)' })
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