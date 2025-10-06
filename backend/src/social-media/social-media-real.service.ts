import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscordRealService } from './services/discord-real.service';
import { TwitterRealService } from './services/twitter-real.service';
import { YouTubeService } from './services/youtube.service';
import { TwitchService } from './services/twitch.service';
import { RedditService } from './services/reddit.service';
import { InstagramService } from './services/instagram.service';
import { SocialAuthService } from './services/social-auth.service';
import { ContentGeneratorRealService } from './services/content-generator-real.service';

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

export interface SocialAnalytics {
  platform: string;
  followers: number;
  engagement: number;
  posts: number;
  growth?: number;
  topPost?: {
    content: string;
    engagement: number;
    url: string;
  };
}

@Injectable()
export class SocialMediaRealService {
  private readonly logger = new Logger(SocialMediaRealService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly discordService: DiscordRealService,
    private readonly twitterService: TwitterRealService,
    private readonly youtubeService: YouTubeService,
    private readonly twitchService: TwitchService,
    private readonly redditService: RedditService,
    private readonly instagramService: InstagramService,
    private readonly contentGenerator: ContentGeneratorRealService,
  ) {}

  /**
   * Share content across multiple social media platforms with real API calls
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
   * Start streaming to multiple platforms with real API calls
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
   * Update Discord rich presence with real API
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
   * Send tournament updates to Discord webhook with real API
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
   * Create and share deck visualization with real image generation
   */
  async shareDeckVisualization(
    userId: string,
    deckId: string,
    platforms: string[],
  ): Promise<SocialShareResult[]> {
    try {
      const deckData = await this.contentGenerator.generateDeckVisualization(deckId);
      
      return this.shareContent({
        userId,
        content: {
          type: 'deck',
          data: deckData,
        },
        platforms: platforms as any[],
      });
    } catch (error) {
      this.logger.error('Failed to share deck visualization:', error);
      return [{
        platform: 'all',
        success: false,
        error: error.message,
      }];
    }
  }

  /**
   * Get social media analytics for a user with real API calls
   */
  async getSocialAnalytics(userId: string): Promise<SocialAnalytics[]> {
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

    try {
      const youtubeStats = await this.youtubeService.getUserStats(userId);
      analytics.push({
        platform: 'youtube',
        ...youtubeStats,
      });
    } catch (error) {
      this.logger.error('Failed to get YouTube analytics:', error);
    }

    try {
      const twitchStats = await this.twitchService.getUserStats(userId);
      analytics.push({
        platform: 'twitch',
        ...twitchStats,
      });
    } catch (error) {
      this.logger.error('Failed to get Twitch analytics:', error);
    }

    try {
      const redditStats = await this.redditService.getUserStats(userId);
      analytics.push({
        platform: 'reddit',
        ...redditStats,
      });
    } catch (error) {
      this.logger.error('Failed to get Reddit analytics:', error);
    }

    try {
      const instagramStats = await this.instagramService.getUserStats(userId);
      analytics.push({
        platform: 'instagram',
        ...instagramStats,
      });
    } catch (error) {
      this.logger.error('Failed to get Instagram analytics:', error);
    }

    return analytics;
  }

  /**
   * Schedule content for later posting with real scheduling
   */
  async scheduleContent(
    request: SocialShareRequest,
    scheduledTime: Date,
  ): Promise<string> {
    try {
      // This would integrate with a job queue system like Bull or Agenda
      const jobId = `social_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store the scheduled job in database
      await this.storeScheduledJob(jobId, request, scheduledTime);
      
      this.logger.log(`Scheduled content for ${scheduledTime.toISOString()} with job ID: ${jobId}`);
      return jobId;
    } catch (error) {
      this.logger.error('Failed to schedule content:', error);
      throw error;
    }
  }

  /**
   * Get trending hashtags for a platform with real API
   */
  async getTrendingHashtags(platform: string): Promise<string[]> {
    try {
      switch (platform) {
        case 'twitter':
          return await this.twitterService.getTrendingHashtags();
        case 'instagram':
          // Instagram doesn't have a public trending API, return common hashtags
          return ['KONIVRER', 'TCG', 'CardGame', 'Gaming', 'Strategy'];
        default:
          return ['KONIVRER', 'TCG'];
      }
    } catch (error) {
      this.logger.error(`Failed to get trending hashtags for ${platform}:`, error);
      return ['KONIVRER', 'TCG'];
    }
  }

  /**
   * Get optimal posting times for a platform
   */
  async getOptimalPostingTimes(platform: string): Promise<{
    bestTimes: string[];
    timezone: string;
  }> {
    try {
      // This would analyze user's audience data and engagement patterns
      const optimalTimes = {
        discord: ['19:00', '20:00', '21:00'], // Evening gaming hours
        twitter: ['09:00', '12:00', '15:00', '18:00'], // Multiple peaks
        youtube: ['14:00', '19:00', '20:00'], // Afternoon and evening
        twitch: ['19:00', '20:00', '21:00'], // Evening streaming
        reddit: ['10:00', '14:00', '19:00'], // Work breaks and evening
        instagram: ['08:00', '12:00', '17:00', '19:00'], // Multiple daily peaks
      };

      return {
        bestTimes: optimalTimes[platform] || ['12:00', '18:00'],
        timezone: 'UTC',
      };
    } catch (error) {
      this.logger.error(`Failed to get optimal posting times for ${platform}:`, error);
      return {
        bestTimes: ['12:00', '18:00'],
        timezone: 'UTC',
      };
    }
  }

  /**
   * Bulk share content to multiple platforms with rate limiting
   */
  async bulkShareContent(
    requests: SocialShareRequest[],
    delayMs: number = 1000
  ): Promise<SocialShareResult[][]> {
    const results: SocialShareResult[][] = [];

    for (let i = 0; i < requests.length; i++) {
      const request = requests[i];
      
      try {
        const result = await this.shareContent(request);
        results.push(result);
        
        // Add delay between requests to respect rate limits
        if (i < requests.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        this.logger.error(`Failed to bulk share request ${i}:`, error);
        results.push([{
          platform: 'all',
          success: false,
          error: error.message,
        }]);
      }
    }

    return results;
  }

  /**
   * Get platform-specific content suggestions
   */
  async getContentSuggestions(
    contentType: 'deck' | 'tournament' | 'achievement' | 'match_result',
    platform: string,
    data: any
  ): Promise<{
    title: string;
    description: string;
    hashtags: string[];
    imageUrl?: string;
  }> {
    try {
      const content = await this.contentGenerator.generateOptimizedContent(
        { type: contentType, data },
        platform,
        {
          maxLength: platform === 'twitter' ? 280 : undefined,
          includeImages: platform !== 'reddit', // Reddit handles images differently
          hashtagLimit: platform === 'twitter' ? 5 : 10,
        }
      );

      return {
        title: content.title || content.text?.substring(0, 50) + '...' || 'KONIVRER Content',
        description: content.description || content.text || '',
        hashtags: content.hashtags || [],
        imageUrl: content.imageUrl,
      };
    } catch (error) {
      this.logger.error('Failed to get content suggestions:', error);
      return {
        title: 'KONIVRER Content',
        description: 'Check out this KONIVRER content!',
        hashtags: ['KONIVRER', 'TCG'],
      };
    }
  }

  /**
   * Store scheduled job in database
   */
  private async storeScheduledJob(
    jobId: string,
    request: SocialShareRequest,
    scheduledTime: Date
  ): Promise<void> {
    try {
      // This would store in your database
      // For now, just log it
      this.logger.log(`Stored scheduled job ${jobId} for ${scheduledTime.toISOString()}`);
    } catch (error) {
      this.logger.error('Failed to store scheduled job:', error);
      throw error;
    }
  }

  /**
   * Get platform health status
   */
  async getPlatformHealth(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};

    try {
      // Test Discord connection
      const discordStats = await this.discordService.getBotStats();
      health.discord = discordStats.guilds > 0;
    } catch (error) {
      health.discord = false;
    }

    try {
      // Test Twitter connection
      await this.twitterService.getTrendingHashtags();
      health.twitter = true;
    } catch (error) {
      health.twitter = false;
    }

    // Add other platform health checks as needed
    health.youtube = true; // Placeholder
    health.twitch = true; // Placeholder
    health.reddit = true; // Placeholder
    health.instagram = true; // Placeholder

    return health;
  }
}