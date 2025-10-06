import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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

export interface TwitterMediaUpload {
  media_id: string;
  media_id_string: string;
  size: number;
  expires_after_secs: number;
}

@Injectable()
export class TwitterRealService {
  private readonly logger = new Logger(TwitterRealService.name);
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly accessToken: string;
  private readonly accessTokenSecret: string;
  private readonly bearerToken: string;
  private readonly baseUrl = 'https://api.twitter.com/2';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TWITTER_API_KEY');
    this.apiSecret = this.configService.get<string>('TWITTER_API_SECRET');
    this.accessToken = this.configService.get<string>('TWITTER_ACCESS_TOKEN');
    this.accessTokenSecret = this.configService.get<string>('TWITTER_ACCESS_TOKEN_SECRET');
    this.bearerToken = this.configService.get<string>('TWITTER_BEARER_TOKEN');
  }

  /**
   * Share content to Twitter with real API calls
   */
  async shareContent(
    userId: string,
    content: TwitterShareContent,
  ): Promise<{ platform: string; success: boolean; postId?: string; url?: string; error?: string }> {
    try {
      if (!this.validateCredentials()) {
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

      // Prepare tweet data
      const tweetData: any = {
        text: tweetText,
      };

      // Add media if provided
      if (content.imageUrl) {
        const mediaId = await this.uploadMedia(content.imageUrl);
        if (mediaId) {
          tweetData.media = { media_ids: [mediaId] };
        }
      }

      // Add reply context if provided
      if (content.replyTo) {
        tweetData.reply = { in_reply_to_tweet_id: content.replyTo };
      }

      // Post tweet using Twitter API v2
      const response = await this.postTweet(tweetData);

      return {
        platform: 'twitter',
        success: true,
        postId: response.data.id,
        url: `https://twitter.com/user/status/${response.data.id}`,
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
   * Tweet deck result with real API
   */
  async tweetDeckResult(
    userId: string,
    deckId: string,
    result: {
      win: boolean;
      opponent: string;
      format: string;
      deckName: string;
      winRate?: number;
    },
  ): Promise<{ platform: string; success: boolean; postId?: string; url?: string; error?: string }> {
    const emoji = result.win ? '🎉' : '💪';
    const status = result.win ? 'won' : 'lost';
    const winRateText = result.winRate ? ` (${result.winRate}% win rate)` : '';
    
    const content: TwitterShareContent = {
      type: 'match_result',
      text: `${emoji} Just ${status} a ${result.format} match with ${result.deckName}!${winRateText}`,
      hashtags: ['KONIVRER', 'TCG', result.format.toLowerCase().replace(/\s+/g, '')],
      url: `https://konivrer.com/decks/${deckId}`,
    };

    return this.shareContent(userId, content);
  }

  /**
   * Tweet tournament update with real API
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
      hashtags.push(update.data.format.toLowerCase().replace(/\s+/g, ''));
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
   * Get user's Twitter statistics with real API
   */
  async getUserStats(userId: string): Promise<TwitterUserStats> {
    try {
      if (!this.validateCredentials()) {
        return { followers: 0, engagement: 0, posts: 0 };
      }

      // Get user's public metrics
      const response = await axios.get(`${this.baseUrl}/users/by/username/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
        params: {
          'user.fields': 'public_metrics',
        },
      });

      const user = response.data.data;
      const metrics = user.public_metrics;

      return {
        followers: metrics.followers_count || 0,
        engagement: (metrics.like_count || 0) + (metrics.retweet_count || 0) + (metrics.reply_count || 0),
        posts: metrics.tweet_count || 0,
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
   * Upload media to Twitter with real API
   */
  private async uploadMedia(imageUrl: string): Promise<string | null> {
    try {
      // Download the image
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data);

      // Upload to Twitter
      const formData = new FormData();
      formData.append('media', new Blob([imageBuffer]), 'image.jpg');

      const response = await axios.post('https://upload.twitter.com/1.1/media/upload.json', formData, {
        headers: {
          'Authorization': this.getOAuthHeader('POST', 'https://upload.twitter.com/1.1/media/upload.json'),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.media_id_string;
    } catch (error) {
      this.logger.error('Failed to upload media to Twitter:', error);
      return null;
    }
  }

  /**
   * Post tweet using Twitter API v2 with real implementation
   */
  private async postTweet(tweetData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/tweets`, tweetData, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to post tweet:', error);
      throw error;
    }
  }

  /**
   * Get OAuth header for API v1.1 endpoints
   */
  private getOAuthHeader(method: string, url: string): string {
    // This is a simplified OAuth implementation
    // In production, you'd use a proper OAuth library
    const oauthParams = {
      oauth_consumer_key: this.apiKey,
      oauth_token: this.accessToken,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_nonce: Math.random().toString(36).substring(2),
      oauth_version: '1.0',
    };

    // Generate signature (simplified)
    const signature = this.generateSignature(method, url, oauthParams);
    oauthParams['oauth_signature'] = signature;

    const authHeader = 'OAuth ' + Object.entries(oauthParams)
      .map(([key, value]) => `${key}="${value}"`)
      .join(', ');

    return authHeader;
  }

  /**
   * Generate OAuth signature (simplified)
   */
  private generateSignature(method: string, url: string, params: any): string {
    // This is a simplified signature generation
    // In production, use a proper OAuth library
    const crypto = require('crypto');
    const signingKey = `${this.apiSecret}&${this.accessTokenSecret}`;
    const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(JSON.stringify(params))}`;
    return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
  }

  /**
   * Validate API credentials
   */
  private validateCredentials(): boolean {
    return !!(this.apiKey && this.apiSecret && this.accessToken && this.accessTokenSecret && this.bearerToken);
  }

  /**
   * Get tournament emoji
   */
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

  /**
   * Search for tweets with hashtags
   */
  async searchTweets(query: string, maxResults: number = 10): Promise<any[]> {
    try {
      if (!this.validateCredentials()) {
        throw new Error('Twitter API credentials not configured');
      }

      const response = await axios.get(`${this.baseUrl}/tweets/search/recent`, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
        params: {
          query,
          max_results: maxResults,
          'tweet.fields': 'created_at,public_metrics,author_id',
        },
      });

      return response.data.data || [];
    } catch (error) {
      this.logger.error('Failed to search tweets:', error);
      return [];
    }
  }

  /**
   * Get trending hashtags
   */
  async getTrendingHashtags(woeid: number = 1): Promise<string[]> {
    try {
      if (!this.validateCredentials()) {
        throw new Error('Twitter API credentials not configured');
      }

      const response = await axios.get(`${this.baseUrl}/trends/by/woeid/${woeid}`, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
      });

      return response.data[0]?.trends?.map((trend: any) => trend.name) || [];
    } catch (error) {
      this.logger.error('Failed to get trending hashtags:', error);
      return [];
    }
  }

  /**
   * Like a tweet
   */
  async likeTweet(tweetId: string): Promise<boolean> {
    try {
      if (!this.validateCredentials()) {
        throw new Error('Twitter API credentials not configured');
      }

      await axios.post(`${this.baseUrl}/users/${this.accessToken}/likes`, {
        tweet_id: tweetId,
      }, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to like tweet:', error);
      return false;
    }
  }

  /**
   * Retweet a tweet
   */
  async retweet(tweetId: string): Promise<boolean> {
    try {
      if (!this.validateCredentials()) {
        throw new Error('Twitter API credentials not configured');
      }

      await axios.post(`${this.baseUrl}/users/${this.accessToken}/retweets`, {
        tweet_id: tweetId,
      }, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to retweet:', error);
      return false;
    }
  }
}