import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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
}

export interface ConnectedAccount {
  provider: string;
  connected: boolean;
  username?: string;
  lastUsed?: Date;
}

class SocialMediaService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/api/social`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Set auth token for requests
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Share content across multiple social media platforms
   */
  async shareContent(request: SocialShareRequest): Promise<SocialShareResult[]> {
    try {
      const response = await this.api.post('/share', request);
      return response.data;
    } catch (error) {
      console.error('Failed to share content:', error);
      throw error;
    }
  }

  /**
   * Start streaming to multiple platforms
   */
  async startStreaming(request: StreamRequest): Promise<StreamInfo[]> {
    try {
      const response = await this.api.post('/stream/start', request);
      return response.data;
    } catch (error) {
      console.error('Failed to start streaming:', error);
      throw error;
    }
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
    }
  ): Promise<void> {
    try {
      await this.api.post('/discord/presence', {
        userId,
        gameState,
      });
    } catch (error) {
      console.error('Failed to update Discord presence:', error);
      throw error;
    }
  }

  /**
   * Send tournament update to Discord webhook
   */
  async sendTournamentUpdate(
    tournamentId: string,
    update: {
      type: 'started' | 'round_complete' | 'finished' | 'player_eliminated';
      message: string;
      data?: any;
    }
  ): Promise<void> {
    try {
      await this.api.post(`/tournament/${tournamentId}/update`, update);
    } catch (error) {
      console.error('Failed to send tournament update:', error);
      throw error;
    }
  }

  /**
   * Share deck visualization across platforms
   */
  async shareDeckVisualization(
    userId: string,
    deckId: string,
    platforms: string[]
  ): Promise<SocialShareResult[]> {
    try {
      const response = await this.api.post(`/deck/${deckId}/share`, {
        userId,
        platforms,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to share deck visualization:', error);
      throw error;
    }
  }

  /**
   * Get social media analytics for a user
   */
  async getSocialAnalytics(userId: string): Promise<SocialAnalytics[]> {
    try {
      const response = await this.api.get(`/analytics/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get social analytics:', error);
      throw error;
    }
  }

  /**
   * Schedule content for later posting
   */
  async scheduleContent(
    request: SocialShareRequest,
    scheduledTime: Date
  ): Promise<string> {
    try {
      const response = await this.api.post('/schedule', {
        ...request,
        scheduledTime,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to schedule content:', error);
      throw error;
    }
  }

  /**
   * Get OAuth authorization URL for a provider
   */
  async getAuthUrl(provider: string, state?: string): Promise<string> {
    try {
      const response = await this.api.get(`/auth/${provider}/url`, {
        params: { state },
      });
      return response.data.url;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      throw error;
    }
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCode(
    provider: string,
    code: string,
    state?: string
  ): Promise<{
    provider: string;
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    userInfo?: any;
    error?: string;
  }> {
    try {
      const response = await this.api.post(`/auth/${provider}/callback`, {
        code,
        state,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to exchange code:', error);
      throw error;
    }
  }

  /**
   * Get user's connected social accounts
   */
  async getConnectedAccounts(userId: string): Promise<ConnectedAccount[]> {
    try {
      const response = await this.api.get(`/auth/accounts/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get connected accounts:', error);
      throw error;
    }
  }

  /**
   * Disconnect a social media account
   */
  async disconnectAccount(provider: string): Promise<void> {
    try {
      await this.api.delete(`/auth/${provider}/disconnect`);
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    provider: string,
    refreshToken: string
  ): Promise<{
    provider: string;
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }> {
    try {
      const response = await this.api.post(`/auth/${provider}/refresh`, {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }

  /**
   * Revoke access token
   */
  async revokeToken(provider: string, accessToken: string): Promise<boolean> {
    try {
      await this.api.post(`/auth/${provider}/revoke`, {
        accessToken,
      });
      return true;
    } catch (error) {
      console.error('Failed to revoke token:', error);
      return false;
    }
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
      const response = await this.api.post('/content/suggestions', {
        contentType,
        platform,
        data,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get content suggestions:', error);
      throw error;
    }
  }

  /**
   * Generate deck visualization image
   */
  async generateDeckVisualization(deckId: string): Promise<string> {
    try {
      const response = await this.api.get(`/deck/${deckId}/visualization`);
      return response.data.imageUrl;
    } catch (error) {
      console.error('Failed to generate deck visualization:', error);
      throw error;
    }
  }

  /**
   * Get trending hashtags for a platform
   */
  async getTrendingHashtags(platform: string): Promise<string[]> {
    try {
      const response = await this.api.get(`/trending/${platform}/hashtags`);
      return response.data;
    } catch (error) {
      console.error('Failed to get trending hashtags:', error);
      throw error;
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
      const response = await this.api.get(`/analytics/${platform}/optimal-times`);
      return response.data;
    } catch (error) {
      console.error('Failed to get optimal posting times:', error);
      throw error;
    }
  }
}

export const socialMediaService = new SocialMediaService();