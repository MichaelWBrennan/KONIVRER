import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TwitterShareContent {
  type: 'deck' | 'tournament' | 'achievement' | 'match_result';
  text: string;
  hashtags?: string[];
  imageUrl?: string;
  url?: string;
  replyTo?: string;
}

export interface TwitterUserStats {
  followers: number;
  engagement: number;
  posts: number;
}

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly accessToken: string;
  private readonly accessTokenSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TWITTER_API_KEY');
    this.apiSecret = this.configService.get<string>('TWITTER_API_SECRET');
    this.accessToken = this.configService.get<string>('TWITTER_ACCESS_TOKEN');
    this.accessTokenSecret = this.configService.get<string>('TWITTER_ACCESS_TOKEN_SECRET');
  }

  /**
   * Share content to Twitter
   */
  async shareContent(
    userId: string,
    content: TwitterShareContent,
  ): Promise<{ platform: string; success: boolean; postId?: string; url?: string; error?: string }> {
    try {
      if (!this.apiKey || !this.apiSecret || !this.accessToken || !this.accessTokenSecret) {
        throw new Error('Twitter API credentials not configured');
      }

      // Format the tweet text with hashtags
      let tweetText = content.text;
      if (content.hashtags && content.hashtags.length > 0) {
        const hashtagString = content.hashtags.map(tag => `#${tag}`).join(' ');
        tweetText += ` ${hashtagString}`;
      }

      // Add URL if provided
      if (content.url) {
        tweetText += ` ${content.url}`;
      }

      // Ensure tweet is within character limit
      if (tweetText.length > 280) {
        tweetText = tweetText.substring(0, 277) + '...';
      }

      // Post tweet (implementation would use Twitter API v2)
      const tweetData = {
        text: tweetText,
        media: content.imageUrl ? { media_ids: [await this.uploadMedia(content.imageUrl)] } : undefined,
        reply: content.replyTo ? { in_reply_to_tweet_id: content.replyTo } : undefined,
      };

      // Simulate API call
      const response = await this.postTweet(tweetData);

      return {
        platform: 'twitter',
        success: true,
        postId: response.id,
        url: `https://twitter.com/user/status/${response.id}`,
      };
    } catch (error) {
      this.logger.error('Failed to share content to Twitter:', error);
      return {
        platform: 'twitter',
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Tweet deck result
   */
  async tweetDeckResult(
    userId: string,
    deckId: string,
    result: {
      win: boolean;
      opponent: string;
      format: string;
      deckName: string;
    },
  ): Promise<{ platform: string; success: boolean; postId?: string; url?: string; error?: string }> {
    const emoji = result.win ? '🎉' : '💪';
    const status = result.win ? 'won' : 'lost';
    
    const content: TwitterShareContent = {
      type: 'match_result',
      text: `${emoji} Just ${status} a match in ${result.format} with ${result.deckName}!`,
      hashtags: ['KONIVRER', 'TCG', result.format.toLowerCase()],
      url: `https://konivrer.com/decks/${deckId}`,
    };

    return this.shareContent(userId, content);
  }

  /**
   * Tweet tournament update
   */
  async tweetTournamentUpdate(
    tournamentId: string,
    update: {
      type: 'started' | 'round_complete' | 'finished';
      message: string;
      data?: any;
    },
  ): Promise<{ platform: string; success: boolean; postId?: string; url?: string; error?: string }> {
    const emoji = this.getTournamentEmoji(update.type);
    const hashtags = ['KONIVRER', 'Tournament', 'TCG'];
    
    if (update.data?.format) {
      hashtags.push(update.data.format.toLowerCase());
    }

    const content: TwitterShareContent = {
      type: 'tournament',
      text: `${emoji} ${update.message}`,
      hashtags,
      url: `https://konivrer.com/tournaments/${tournamentId}`,
    };

    return this.shareContent('system', content);
  }

  /**
   * Get user's Twitter statistics
   */
  async getUserStats(userId: string): Promise<TwitterUserStats> {
    try {
      // This would query Twitter API for user statistics
      // For now, return placeholder data
      return {
        followers: 0,
        engagement: 0,
        posts: 0,
      };
    } catch (error) {
      this.logger.error('Failed to get Twitter user stats:', error);
      return {
        followers: 0,
        engagement: 0,
        posts: 0,
      };
    }
  }

  /**
   * Upload media to Twitter
   */
  private async uploadMedia(imageUrl: string): Promise<string> {
    try {
      // Implementation would download the image and upload to Twitter
      // For now, return a placeholder media ID
      this.logger.log(`Uploading media: ${imageUrl}`);
      return 'media_id_placeholder';
    } catch (error) {
      this.logger.error('Failed to upload media to Twitter:', error);
      throw error;
    }
  }

  /**
   * Post tweet using Twitter API
   */
  private async postTweet(tweetData: any): Promise<{ id: string }> {
    try {
      // Implementation would use Twitter API v2
      // For now, return a mock response
      this.logger.log('Posting tweet:', tweetData);
      return { id: 'tweet_id_placeholder' };
    } catch (error) {
      this.logger.error('Failed to post tweet:', error);
      throw error;
    }
  }

  private getTournamentEmoji(type: string): string {
    switch (type) {
      case 'started':
        return '🚀';
      case 'round_complete':
        return '⚡';
      case 'finished':
        return '🏆';
      default:
        return '🎮';
    }
  }
}