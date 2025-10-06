import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SocialAuthProvider {
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export interface SocialAuthResult {
  provider: string;
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  userInfo?: {
    id: string;
    username: string;
    email?: string;
    avatar?: string;
    displayName?: string;
  };
  error?: string;
}

@Injectable()
export class SocialAuthService {
  private readonly logger = new Logger(SocialAuthService.name);
  private readonly providers: Map<string, SocialAuthProvider> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Discord OAuth
    this.providers.set('discord', {
      name: 'discord',
      clientId: this.configService.get<string>('DISCORD_CLIENT_ID'),
      clientSecret: this.configService.get<string>('DISCORD_CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('DISCORD_REDIRECT_URI'),
      scope: ['identify', 'email', 'guilds'],
    });

    // Twitter OAuth
    this.providers.set('twitter', {
      name: 'twitter',
      clientId: this.configService.get<string>('TWITTER_CLIENT_ID'),
      clientSecret: this.configService.get<string>('TWITTER_CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('TWITTER_REDIRECT_URI'),
      scope: ['tweet.read', 'tweet.write', 'users.read'],
    });

    // YouTube OAuth
    this.providers.set('youtube', {
      name: 'youtube',
      clientId: this.configService.get<string>('YOUTUBE_CLIENT_ID'),
      clientSecret: this.configService.get<string>('YOUTUBE_CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('YOUTUBE_REDIRECT_URI'),
      scope: ['https://www.googleapis.com/auth/youtube.upload'],
    });

    // Twitch OAuth
    this.providers.set('twitch', {
      name: 'twitch',
      clientId: this.configService.get<string>('TWITCH_CLIENT_ID'),
      clientSecret: this.configService.get<string>('TWITCH_CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('TWITCH_REDIRECT_URI'),
      scope: ['user:read:email', 'channel:manage:broadcast'],
    });

    // Reddit OAuth
    this.providers.set('reddit', {
      name: 'reddit',
      clientId: this.configService.get<string>('REDDIT_CLIENT_ID'),
      clientSecret: this.configService.get<string>('REDDIT_CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('REDDIT_REDIRECT_URI'),
      scope: ['identity', 'submit', 'read'],
    });

    // Instagram OAuth
    this.providers.set('instagram', {
      name: 'instagram',
      clientId: this.configService.get<string>('INSTAGRAM_CLIENT_ID'),
      clientSecret: this.configService.get<string>('INSTAGRAM_CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('INSTAGRAM_REDIRECT_URI'),
      scope: ['user_profile', 'user_media'],
    });
  }

  /**
   * Get OAuth authorization URL for a provider
   */
  getAuthUrl(provider: string, state?: string): string {
    const providerConfig = this.providers.get(provider);
    if (!providerConfig) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    const params = new URLSearchParams({
      client_id: providerConfig.clientId,
      redirect_uri: providerConfig.redirectUri,
      scope: providerConfig.scope.join(' '),
      response_type: 'code',
      ...(state && { state }),
    });

    const baseUrls = {
      discord: 'https://discord.com/api/oauth2/authorize',
      twitter: 'https://twitter.com/i/oauth2/authorize',
      youtube: 'https://accounts.google.com/o/oauth2/v2/auth',
      twitch: 'https://id.twitch.tv/oauth2/authorize',
      reddit: 'https://www.reddit.com/api/v1/authorize',
      instagram: 'https://api.instagram.com/oauth/authorize',
    };

    const baseUrl = baseUrls[provider];
    if (!baseUrl) {
      throw new Error(`No OAuth URL configured for provider: ${provider}`);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCode(
    provider: string,
    code: string,
    state?: string,
  ): Promise<SocialAuthResult> {
    try {
      const providerConfig = this.providers.get(provider);
      if (!providerConfig) {
        throw new Error(`Unsupported OAuth provider: ${provider}`);
      }

      // Exchange code for tokens (implementation would use provider-specific OAuth flow)
      const tokenData = await this.exchangeCodeForTokens(provider, code, providerConfig);

      // Get user information
      const userInfo = await this.getUserInfo(provider, tokenData.accessToken);

      return {
        provider,
        success: true,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        userInfo,
      };
    } catch (error) {
      this.logger.error(`Failed to exchange code for ${provider}:`, error);
      return {
        provider,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    provider: string,
    refreshToken: string,
  ): Promise<SocialAuthResult> {
    try {
      const providerConfig = this.providers.get(provider);
      if (!providerConfig) {
        throw new Error(`Unsupported OAuth provider: ${provider}`);
      }

      // Refresh token (implementation would use provider-specific refresh flow)
      const tokenData = await this.refreshAccessToken(provider, refreshToken, providerConfig);

      return {
        provider,
        success: true,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
      };
    } catch (error) {
      this.logger.error(`Failed to refresh token for ${provider}:`, error);
      return {
        provider,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Revoke access token
   */
  async revokeToken(provider: string, accessToken: string): Promise<boolean> {
    try {
      // Revoke token (implementation would use provider-specific revoke endpoint)
      await this.revokeAccessToken(provider, accessToken);
      return true;
    } catch (error) {
      this.logger.error(`Failed to revoke token for ${provider}:`, error);
      return false;
    }
  }

  /**
   * Get user's connected social accounts
   */
  async getConnectedAccounts(userId: string): Promise<{
    provider: string;
    connected: boolean;
    username?: string;
    lastUsed?: Date;
  }[]> {
    try {
      // This would query the database for user's connected social accounts
      // For now, return placeholder data
      return [
        { provider: 'discord', connected: true, username: 'konivrer_user', lastUsed: new Date() },
        { provider: 'twitter', connected: false },
        { provider: 'youtube', connected: false },
        { provider: 'twitch', connected: true, username: 'konivrer_streamer', lastUsed: new Date() },
        { provider: 'reddit', connected: false },
        { provider: 'instagram', connected: false },
      ];
    } catch (error) {
      this.logger.error('Failed to get connected accounts:', error);
      return [];
    }
  }

  private async exchangeCodeForTokens(
    provider: string,
    code: string,
    providerConfig: SocialAuthProvider,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    // Implementation would use provider-specific OAuth token exchange
    this.logger.log(`Exchanging code for tokens for ${provider}`);
    return {
      accessToken: `${provider}_access_token_placeholder`,
      refreshToken: `${provider}_refresh_token_placeholder`,
    };
  }

  private async getUserInfo(provider: string, accessToken: string): Promise<{
    id: string;
    username: string;
    email?: string;
    avatar?: string;
    displayName?: string;
  }> {
    // Implementation would use provider-specific user info API
    this.logger.log(`Getting user info for ${provider}`);
    return {
      id: `${provider}_user_id_placeholder`,
      username: `${provider}_username_placeholder`,
      email: `${provider}_email_placeholder@example.com`,
      avatar: `https://example.com/avatar.png`,
      displayName: `${provider} User`,
    };
  }

  private async refreshAccessToken(
    provider: string,
    refreshToken: string,
    providerConfig: SocialAuthProvider,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    // Implementation would use provider-specific token refresh
    this.logger.log(`Refreshing token for ${provider}`);
    return {
      accessToken: `${provider}_refreshed_access_token_placeholder`,
      refreshToken: `${provider}_refreshed_refresh_token_placeholder`,
    };
  }

  private async revokeAccessToken(provider: string, accessToken: string): Promise<void> {
    // Implementation would use provider-specific token revocation
    this.logger.log(`Revoking token for ${provider}`);
  }
}