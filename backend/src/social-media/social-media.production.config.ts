import { ConfigService } from '@nestjs/config';

export interface SocialMediaProductionConfig {
  discord: {
    botToken: string;
    clientId: string;
    clientSecret: string;
    webhookUrl: string;
    enabled: boolean;
  };
  twitter: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
    bearerToken: string;
    enabled: boolean;
  };
  youtube: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    enabled: boolean;
  };
  twitch: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
    enabled: boolean;
  };
  reddit: {
    clientId: string;
    clientSecret: string;
    userAgent: string;
    enabled: boolean;
  };
  instagram: {
    accessToken: string;
    appId: string;
    enabled: boolean;
  };
  upload: {
    url: string;
    apiKey: string;
    enabled: boolean;
  };
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
    burstLimit: number;
  };
  monitoring: {
    enabled: boolean;
    metricsEndpoint: string;
    healthCheckInterval: number;
  };
  caching: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
}

export class SocialMediaProductionConfigService {
  constructor(private readonly configService: ConfigService) {}

  getConfig(): SocialMediaProductionConfig {
    return {
      discord: {
        botToken: this.configService.get<string>('DISCORD_BOT_TOKEN', ''),
        clientId: this.configService.get<string>('DISCORD_CLIENT_ID', ''),
        clientSecret: this.configService.get<string>('DISCORD_CLIENT_SECRET', ''),
        webhookUrl: this.configService.get<string>('DISCORD_WEBHOOK_URL', ''),
        enabled: this.configService.get<boolean>('DISCORD_ENABLED', false),
      },
      twitter: {
        apiKey: this.configService.get<string>('TWITTER_API_KEY', ''),
        apiSecret: this.configService.get<string>('TWITTER_API_SECRET', ''),
        accessToken: this.configService.get<string>('TWITTER_ACCESS_TOKEN', ''),
        accessTokenSecret: this.configService.get<string>('TWITTER_ACCESS_TOKEN_SECRET', ''),
        bearerToken: this.configService.get<string>('TWITTER_BEARER_TOKEN', ''),
        enabled: this.configService.get<boolean>('TWITTER_ENABLED', false),
      },
      youtube: {
        clientId: this.configService.get<string>('YOUTUBE_CLIENT_ID', ''),
        clientSecret: this.configService.get<string>('YOUTUBE_CLIENT_SECRET', ''),
        refreshToken: this.configService.get<string>('YOUTUBE_REFRESH_TOKEN', ''),
        enabled: this.configService.get<boolean>('YOUTUBE_ENABLED', false),
      },
      twitch: {
        clientId: this.configService.get<string>('TWITCH_CLIENT_ID', ''),
        clientSecret: this.configService.get<string>('TWITCH_CLIENT_SECRET', ''),
        accessToken: this.configService.get<string>('TWITCH_ACCESS_TOKEN', ''),
        enabled: this.configService.get<boolean>('TWITCH_ENABLED', false),
      },
      reddit: {
        clientId: this.configService.get<string>('REDDIT_CLIENT_ID', ''),
        clientSecret: this.configService.get<string>('REDDIT_CLIENT_SECRET', ''),
        userAgent: this.configService.get<string>('REDDIT_USER_AGENT', 'KONIVRER-TCG-Platform/1.0'),
        enabled: this.configService.get<boolean>('REDDIT_ENABLED', false),
      },
      instagram: {
        accessToken: this.configService.get<string>('INSTAGRAM_ACCESS_TOKEN', ''),
        appId: this.configService.get<string>('INSTAGRAM_APP_ID', ''),
        enabled: this.configService.get<boolean>('INSTAGRAM_ENABLED', false),
      },
      upload: {
        url: this.configService.get<string>('UPLOAD_URL', 'https://konivrer.com/uploads'),
        apiKey: this.configService.get<string>('UPLOAD_API_KEY', ''),
        enabled: this.configService.get<boolean>('UPLOAD_ENABLED', true),
      },
      rateLimiting: {
        enabled: this.configService.get<boolean>('SOCIAL_RATE_LIMITING_ENABLED', true),
        requestsPerMinute: this.configService.get<number>('SOCIAL_RATE_LIMIT_RPM', 60),
        burstLimit: this.configService.get<number>('SOCIAL_BURST_LIMIT', 10),
      },
      monitoring: {
        enabled: this.configService.get<boolean>('SOCIAL_MONITORING_ENABLED', true),
        metricsEndpoint: this.configService.get<string>('SOCIAL_METRICS_ENDPOINT', '/metrics'),
        healthCheckInterval: this.configService.get<number>('SOCIAL_HEALTH_CHECK_INTERVAL', 30000),
      },
      caching: {
        enabled: this.configService.get<boolean>('SOCIAL_CACHING_ENABLED', true),
        ttl: this.configService.get<number>('SOCIAL_CACHE_TTL', 300), // 5 minutes
        maxSize: this.configService.get<number>('SOCIAL_CACHE_MAX_SIZE', 1000),
      },
    };
  }

  validateConfig(): { valid: boolean; errors: string[] } {
    const config = this.getConfig();
    const errors: string[] = [];

    // Check Discord configuration
    if (config.discord.enabled) {
      if (!config.discord.botToken) {
        errors.push('Discord bot token is required when Discord is enabled');
      }
      if (!config.discord.clientId) {
        errors.push('Discord client ID is required when Discord is enabled');
      }
    }

    // Check Twitter configuration
    if (config.twitter.enabled) {
      if (!config.twitter.apiKey) {
        errors.push('Twitter API key is required when Twitter is enabled');
      }
      if (!config.twitter.apiSecret) {
        errors.push('Twitter API secret is required when Twitter is enabled');
      }
      if (!config.twitter.bearerToken) {
        errors.push('Twitter bearer token is required when Twitter is enabled');
      }
    }

    // Check YouTube configuration
    if (config.youtube.enabled) {
      if (!config.youtube.clientId) {
        errors.push('YouTube client ID is required when YouTube is enabled');
      }
      if (!config.youtube.clientSecret) {
        errors.push('YouTube client secret is required when YouTube is enabled');
      }
    }

    // Check Twitch configuration
    if (config.twitch.enabled) {
      if (!config.twitch.clientId) {
        errors.push('Twitch client ID is required when Twitch is enabled');
      }
      if (!config.twitch.clientSecret) {
        errors.push('Twitch client secret is required when Twitch is enabled');
      }
    }

    // Check Reddit configuration
    if (config.reddit.enabled) {
      if (!config.reddit.clientId) {
        errors.push('Reddit client ID is required when Reddit is enabled');
      }
      if (!config.reddit.clientSecret) {
        errors.push('Reddit client secret is required when Reddit is enabled');
      }
    }

    // Check Instagram configuration
    if (config.instagram.enabled) {
      if (!config.instagram.accessToken) {
        errors.push('Instagram access token is required when Instagram is enabled');
      }
      if (!config.instagram.appId) {
        errors.push('Instagram app ID is required when Instagram is enabled');
      }
    }

    // Check upload configuration
    if (config.upload.enabled) {
      if (!config.upload.url) {
        errors.push('Upload URL is required when upload is enabled');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  getEnabledPlatforms(): string[] {
    const config = this.getConfig();
    const platforms: string[] = [];

    if (config.discord.enabled) platforms.push('discord');
    if (config.twitter.enabled) platforms.push('twitter');
    if (config.youtube.enabled) platforms.push('youtube');
    if (config.twitch.enabled) platforms.push('twitch');
    if (config.reddit.enabled) platforms.push('reddit');
    if (config.instagram.enabled) platforms.push('instagram');

    return platforms;
  }

  isPlatformEnabled(platform: string): boolean {
    const config = this.getConfig();
    
    switch (platform) {
      case 'discord':
        return config.discord.enabled;
      case 'twitter':
        return config.twitter.enabled;
      case 'youtube':
        return config.youtube.enabled;
      case 'twitch':
        return config.twitch.enabled;
      case 'reddit':
        return config.reddit.enabled;
      case 'instagram':
        return config.instagram.enabled;
      default:
        return false;
    }
  }

  getRateLimitConfig() {
    const config = this.getConfig();
    return config.rateLimiting;
  }

  getMonitoringConfig() {
    const config = this.getConfig();
    return config.monitoring;
  }

  getCachingConfig() {
    const config = this.getConfig();
    return config.caching;
  }
}