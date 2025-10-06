import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscordService } from './services/discord.service';
import { TwitterService } from './services/twitter.service';
import { YouTubeService } from './services/youtube.service';
import { TwitchService } from './services/twitch.service';
import { RedditService } from './services/reddit.service';
import { InstagramService } from './services/instagram.service';
import { ContentGeneratorService } from './services/content-generator.service';

export interface SocialShareRequest {
  userId: string;
  content: {
    type: 'deck' | 'tournament' | 'achievement' | 'match_result';
    data: any;
  };
  platforms: ('discord' | 'twitter' | 'youtube' | 'twitch' | 'reddit' | 'instagram')[];
  message?: string;
  schedule?: Date;
}

export interface SocialShareResult {
  platform: string;
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export interface StreamRequest {
  userId: string;
  platforms: ('twitch' | 'youtube')[];
  title: string;
  description?: string;
  gameId?: string;
  deckId?: string;
}

export interface StreamInfo {
  platform: string;
  streamId: string;
  streamUrl: string;
  chatUrl?: string;
  overlayUrl?: string;
}

@Injectable()
export class SocialMediaService {
  private readonly logger = new Logger(SocialMediaService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly discordService: DiscordService,
    private readonly twitterService: TwitterService,
    private readonly youtubeService: YouTubeService,
    private readonly twitchService: TwitchService,
    private readonly redditService: RedditService,
    private readonly instagramService: InstagramService,
    private readonly contentGenerator: ContentGeneratorService,
  ) {}

  /**
   * Share content across multiple social media platforms
   */
  async shareContent(request: SocialShareRequest): Promise<SocialShareResult[]> {
    const results: SocialShareResult[] = [];

    // Generate content for each platform
    const contentPromises = request.platforms.map(async (platform) => {
      try {
        const platformContent = await this.contentGenerator.generateContent(
          request.content,
          platform,
        );

        let result: SocialShareResult;

        switch (platform) {
          case 'discord':
            result = await this.discordService.shareContent(
              request.userId,
              platformContent,
            );
            break;
          case 'twitter':
            result = await this.twitterService.shareContent(
              request.userId,
              platformContent,
            );
            break;
          case 'youtube':
            result = await this.youtubeService.shareContent(
              request.userId,
              platformContent,
            );
            break;
          case 'twitch':
            result = await this.twitchService.shareContent(
              request.userId,
              platformContent,
            );
            break;
          case 'reddit':
            result = await this.redditService.shareContent(
              request.userId,
              platformContent,
            );
            break;
          case 'instagram':
            result = await this.instagramService.shareContent(
              request.userId,
              platformContent,
            );
            break;
          default:
            result = {
              platform,
              success: false,
              error: 'Unsupported platform',
            };
        }

        return result;
      } catch (error) {
        this.logger.error(`Failed to share to ${platform}:`, error);
        return {
          platform,
          success: false,
          error: error.message,
        };
      }
    });

    const platformResults = await Promise.allSettled(contentPromises);
    
    platformResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          platform: request.platforms[index],
          success: false,
          error: result.reason?.message || 'Unknown error',
        });
      }
    });

    return results;
  }

  /**
   * Start streaming to multiple platforms
   */
  async startStreaming(request: StreamRequest): Promise<StreamInfo[]> {
    const streams: StreamInfo[] = [];

    for (const platform of request.platforms) {
      try {
        let streamInfo: StreamInfo;

        switch (platform) {
          case 'twitch':
            streamInfo = await this.twitchService.startStream(
              request.userId,
              request.title,
              request.description,
              request.gameId,
            );
            break;
          case 'youtube':
            streamInfo = await this.youtubeService.startStream(
              request.userId,
              request.title,
              request.description,
              request.gameId,
            );
            break;
          default:
            throw new Error(`Unsupported streaming platform: ${platform}`);
        }

        streams.push(streamInfo);
      } catch (error) {
        this.logger.error(`Failed to start stream on ${platform}:`, error);
      }
    }

    return streams;
  }

  /**
   * Update Discord rich presence
   */
  async updateDiscordPresence(
    userId: string,
    gameState: {
      status: 'playing' | 'building' | 'watching' | 'idle';
      gameId?: string;
      deckName?: string;
      tournamentName?: string;
    },
  ): Promise<void> {
    try {
      await this.discordService.updateRichPresence(userId, gameState);
    } catch (error) {
      this.logger.error('Failed to update Discord presence:', error);
    }
  }

  /**
   * Send tournament updates to Discord webhook
   */
  async sendTournamentUpdate(
    tournamentId: string,
    update: {
      type: 'started' | 'round_complete' | 'finished' | 'player_eliminated';
      message: string;
      data?: any;
    },
  ): Promise<void> {
    try {
      await this.discordService.sendWebhook(tournamentId, update);
    } catch (error) {
      this.logger.error('Failed to send tournament update:', error);
    }
  }

  /**
   * Create and share deck visualization
   */
  async shareDeckVisualization(
    userId: string,
    deckId: string,
    platforms: string[],
  ): Promise<SocialShareResult[]> {
    const deckData = await this.contentGenerator.generateDeckVisualization(deckId);
    
    return this.shareContent({
      userId,
      content: {
        type: 'deck',
        data: deckData,
      },
      platforms: platforms as any[],
    });
  }

  /**
   * Get social media analytics for a user
   */
  async getSocialAnalytics(userId: string): Promise<{
    platform: string;
    followers: number;
    engagement: number;
    posts: number;
  }[]> {
    const analytics = [];

    try {
      const discordStats = await this.discordService.getUserStats(userId);
      analytics.push({
        platform: 'discord',
        ...discordStats,
      });
    } catch (error) {
      this.logger.error('Failed to get Discord analytics:', error);
    }

    try {
      const twitterStats = await this.twitterService.getUserStats(userId);
      analytics.push({
        platform: 'twitter',
        ...twitterStats,
      });
    } catch (error) {
      this.logger.error('Failed to get Twitter analytics:', error);
    }

    return analytics;
  }

  /**
   * Schedule content for later posting
   */
  async scheduleContent(
    request: SocialShareRequest,
    scheduledTime: Date,
  ): Promise<string> {
    // Implementation would use a job queue (Bull, Agenda, etc.)
    // For now, return a placeholder
    this.logger.log(`Scheduling content for ${scheduledTime.toISOString()}`);
    return 'scheduled_job_id';
  }
}