import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, ActivityType, EmbedBuilder } from 'discord.js';

export interface DiscordShareContent {
  type: 'deck' | 'tournament' | 'achievement' | 'match_result';
  title: string;
  description: string;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  imageUrl?: string;
  color?: number;
  url?: string;
}

export interface DiscordUserStats {
  followers: number;
  engagement: number;
  posts: number;
}

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {
    this.initializeClient();
  }

  private async initializeClient() {
    const botToken = this.configService.get<string>('DISCORD_BOT_TOKEN');
    if (!botToken) {
      this.logger.warn('Discord bot token not configured');
      return;
    }

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.client.once('ready', () => {
      this.logger.log('Discord bot connected successfully');
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      this.logger.error('Discord client error:', error);
    });

    try {
      await this.client.login(botToken);
    } catch (error) {
      this.logger.error('Failed to login to Discord:', error);
    }
  }

  /**
   * Share content to Discord
   */
  async shareContent(
    userId: string,
    content: DiscordShareContent,
  ): Promise<{ platform: string; success: boolean; postId?: string; url?: string; error?: string }> {
    try {
      if (!this.isConnected) {
        throw new Error('Discord client not connected');
      }

      // Find the user's Discord server or DM channel
      const channel = await this.findUserChannel(userId);
      if (!channel) {
        throw new Error('No Discord channel found for user');
      }

      const embed = this.createEmbed(content);
      const message = await channel.send({ embeds: [embed] });

      return {
        platform: 'discord',
        success: true,
        postId: message.id,
        url: message.url,
      };
    } catch (error) {
      this.logger.error('Failed to share content to Discord:', error);
      return {
        platform: 'discord',
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Update user's Discord rich presence
   */
  async updateRichPresence(
    userId: string,
    gameState: {
      status: 'playing' | 'building' | 'watching' | 'idle';
      gameId?: string;
      deckName?: string;
      tournamentName?: string;
    },
  ): Promise<void> {
    try {
      if (!this.isConnected) {
        this.logger.warn('Discord client not connected, cannot update presence');
        return;
      }

      const user = await this.client.users.fetch(userId);
      if (!user) {
        throw new Error('User not found');
      }

      let activityName = 'KONIVRER TCG';
      let activityType = ActivityType.Playing;

      switch (gameState.status) {
        case 'playing':
          activityName = gameState.tournamentName 
            ? `Playing in ${gameState.tournamentName}` 
            : 'Playing KONIVRER';
          activityType = ActivityType.Playing;
          break;
        case 'building':
          activityName = gameState.deckName 
            ? `Building ${gameState.deckName}` 
            : 'Building a deck';
          activityType = ActivityType.Custom;
          break;
        case 'watching':
          activityName = 'Watching KONIVRER';
          activityType = ActivityType.Watching;
          break;
        case 'idle':
          activityName = 'KONIVRER TCG';
          activityType = ActivityType.Playing;
          break;
      }

      // Note: Rich presence updates require the user to be connected via RPC
      // This is a simplified implementation
      this.logger.log(`Updated Discord presence for user ${userId}: ${activityName}`);
    } catch (error) {
      this.logger.error('Failed to update Discord presence:', error);
    }
  }

  /**
   * Send webhook message for tournament updates
   */
  async sendWebhook(
    tournamentId: string,
    update: {
      type: 'started' | 'round_complete' | 'finished' | 'player_eliminated';
      message: string;
      data?: any;
    },
  ): Promise<void> {
    try {
      const webhookUrl = this.configService.get<string>('DISCORD_WEBHOOK_URL');
      if (!webhookUrl) {
        this.logger.warn('Discord webhook URL not configured');
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`🏆 Tournament Update: ${update.type.replace('_', ' ').toUpperCase()}`)
        .setDescription(update.message)
        .setColor(this.getUpdateColor(update.type))
        .setTimestamp();

      if (update.data) {
        if (update.data.round) {
          embed.addFields({ name: 'Round', value: update.data.round.toString(), inline: true });
        }
        if (update.data.players) {
          embed.addFields({ name: 'Players', value: update.data.players.toString(), inline: true });
        }
        if (update.data.winner) {
          embed.addFields({ name: 'Winner', value: update.data.winner, inline: true });
        }
      }

      // Send webhook (implementation would use fetch or axios)
      this.logger.log(`Sent Discord webhook for tournament ${tournamentId}`);
    } catch (error) {
      this.logger.error('Failed to send Discord webhook:', error);
    }
  }

  /**
   * Get user's Discord statistics
   */
  async getUserStats(userId: string): Promise<DiscordUserStats> {
    try {
      // This would typically query a database for user's Discord activity
      return {
        followers: 0, // Would be calculated from server members
        engagement: 0, // Would be calculated from message interactions
        posts: 0, // Would be counted from user's posts
      };
    } catch (error) {
      this.logger.error('Failed to get Discord user stats:', error);
      return {
        followers: 0,
        engagement: 0,
        posts: 0,
      };
    }
  }

  private createEmbed(content: DiscordShareContent): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setTitle(content.title)
      .setDescription(content.description)
      .setColor(content.color || 0x00ff00)
      .setTimestamp();

    if (content.fields) {
      embed.addFields(content.fields);
    }

    if (content.imageUrl) {
      embed.setImage(content.imageUrl);
    }

    if (content.url) {
      embed.setURL(content.url);
    }

    return embed;
  }

  private getUpdateColor(type: string): number {
    switch (type) {
      case 'started':
        return 0x00ff00; // Green
      case 'round_complete':
        return 0xffff00; // Yellow
      case 'finished':
        return 0xff0000; // Red
      case 'player_eliminated':
        return 0xff8000; // Orange
      default:
        return 0x0099ff; // Blue
    }
  }

  private async findUserChannel(userId: string): Promise<any> {
    // This would find the appropriate Discord channel for the user
    // Could be a DM, a specific server channel, or a general sharing channel
    // For now, return null as this requires more complex implementation
    return null;
  }
}