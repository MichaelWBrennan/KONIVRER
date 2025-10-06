import { Injectable, Logger } from '@nestjs/common';

export interface ContentData {
  type: 'deck' | 'tournament' | 'achievement' | 'match_result';
  data: any;
}

export interface PlatformContent {
  platform: string;
  content: any;
}

@Injectable()
export class ContentGeneratorService {
  private readonly logger = new Logger(ContentGeneratorService.name);

  /**
   * Generate platform-specific content from generic content data
   */
  async generateContent(
    contentData: ContentData,
    platform: string,
  ): Promise<any> {
    switch (platform) {
      case 'discord':
        return this.generateDiscordContent(contentData);
      case 'twitter':
        return this.generateTwitterContent(contentData);
      case 'youtube':
        return this.generateYouTubeContent(contentData);
      case 'twitch':
        return this.generateTwitchContent(contentData);
      case 'reddit':
        return this.generateRedditContent(contentData);
      case 'instagram':
        return this.generateInstagramContent(contentData);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Generate Discord embed content
   */
  private generateDiscordContent(contentData: ContentData): any {
    const { type, data } = contentData;

    switch (type) {
      case 'deck':
        return {
          type: 'deck',
          title: `🃏 ${data.name || 'Deck'}`,
          description: `**Format:** ${data.format}\n**Cards:** ${data.cardCount}\n**Win Rate:** ${data.winRate}%`,
          fields: [
            { name: 'Top Cards', value: data.topCards?.join(', ') || 'N/A', inline: true },
            { name: 'Strategy', value: data.strategy || 'N/A', inline: true },
            { name: 'Last Updated', value: new Date(data.lastUpdated).toLocaleDateString(), inline: true },
          ],
          color: 0x00ff00,
          imageUrl: data.imageUrl,
          url: `https://konivrer.com/decks/${data.id}`,
        };

      case 'tournament':
        return {
          type: 'tournament',
          title: `🏆 ${data.name}`,
          description: `**Format:** ${data.format}\n**Players:** ${data.playerCount}\n**Status:** ${data.status}`,
          fields: [
            { name: 'Prize Pool', value: data.prizePool || 'N/A', inline: true },
            { name: 'Entry Fee', value: data.entryFee || 'Free', inline: true },
            { name: 'Start Time', value: new Date(data.startTime).toLocaleString(), inline: true },
          ],
          color: 0xff8000,
          url: `https://konivrer.com/tournaments/${data.id}`,
        };

      case 'achievement':
        return {
          type: 'achievement',
          title: `🎖️ Achievement Unlocked!`,
          description: `**${data.name}**\n${data.description}`,
          fields: [
            { name: 'Points Earned', value: data.points?.toString() || '0', inline: true },
            { name: 'Rarity', value: data.rarity || 'Common', inline: true },
            { name: 'Unlocked At', value: new Date(data.unlockedAt).toLocaleString(), inline: true },
          ],
          color: this.getAchievementColor(data.rarity),
          imageUrl: data.imageUrl,
        };

      case 'match_result':
        return {
          type: 'match_result',
          title: data.win ? '🎉 Victory!' : '💪 Good Game!',
          description: `**${data.win ? 'Won' : 'Lost'}** against ${data.opponent}`,
          fields: [
            { name: 'Format', value: data.format, inline: true },
            { name: 'Deck', value: data.deckName, inline: true },
            { name: 'Duration', value: data.duration || 'N/A', inline: true },
          ],
          color: data.win ? 0x00ff00 : 0xff8000,
          url: `https://konivrer.com/matches/${data.matchId}`,
        };

      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
  }

  /**
   * Generate Twitter content
   */
  private generateTwitterContent(contentData: ContentData): any {
    const { type, data } = contentData;

    switch (type) {
      case 'deck':
        return {
          type: 'deck',
          text: `🃏 Check out my ${data.format} deck: ${data.name}! Win rate: ${data.winRate}%`,
          hashtags: ['KONIVRER', 'TCG', data.format.toLowerCase()],
          imageUrl: data.imageUrl,
          url: `https://konivrer.com/decks/${data.id}`,
        };

      case 'tournament':
        return {
          type: 'tournament',
          text: `🏆 ${data.name} is ${data.status.toLowerCase()}! ${data.playerCount} players, ${data.format} format`,
          hashtags: ['KONIVRER', 'Tournament', data.format.toLowerCase()],
          url: `https://konivrer.com/tournaments/${data.id}`,
        };

      case 'achievement':
        return {
          type: 'achievement',
          text: `🎖️ Just unlocked: ${data.name}! ${data.description}`,
          hashtags: ['KONIVRER', 'Achievement', data.rarity?.toLowerCase()],
          imageUrl: data.imageUrl,
        };

      case 'match_result':
        return {
          type: 'match_result',
          text: `${data.win ? '🎉' : '💪'} ${data.win ? 'Won' : 'Lost'} a ${data.format} match with ${data.deckName}!`,
          hashtags: ['KONIVRER', 'TCG', data.format.toLowerCase()],
          url: `https://konivrer.com/matches/${data.matchId}`,
        };

      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
  }

  /**
   * Generate YouTube content
   */
  private generateYouTubeContent(contentData: ContentData): any {
    const { type, data } = contentData;

    switch (type) {
      case 'deck':
        return {
          type: 'deck',
          title: `KONIVRER Deck Guide: ${data.name} (${data.format})`,
          description: `In this video, I'll show you how to play ${data.name} in ${data.format} format.\n\nDeck List: https://konivrer.com/decks/${data.id}\n\nTimestamps:\n00:00 - Introduction\n00:30 - Deck Overview\n02:00 - Key Cards\n04:00 - Gameplay Examples\n06:00 - Matchups\n08:00 - Conclusion\n\n#KONIVRER #TCG #${data.format}`,
          tags: ['KONIVRER', 'TCG', data.format, 'Deck Guide', 'Card Game'],
          categoryId: '20', // Gaming category
          privacyStatus: 'public',
        };

      case 'tournament':
        return {
          type: 'tournament',
          title: `${data.name} - KONIVRER Tournament`,
          description: `Live coverage of ${data.name} tournament in ${data.format} format.\n\nTournament Info: https://konivrer.com/tournaments/${data.id}\n\n#KONIVRER #Tournament #${data.format}`,
          tags: ['KONIVRER', 'Tournament', data.format, 'Live', 'Card Game'],
          categoryId: '20',
          privacyStatus: 'public',
        };

      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
  }

  /**
   * Generate Twitch content
   */
  private generateTwitchContent(contentData: ContentData): any {
    const { type, data } = contentData;

    switch (type) {
      case 'deck':
        return {
          type: 'deck',
          title: `Building ${data.name} - ${data.format} Deck Guide`,
          gameId: 'KONIVRER',
          tags: ['KONIVRER', 'Deck Building', data.format, 'Card Game'],
          description: `Live deck building session for ${data.name} in ${data.format} format. Deck list: https://konivrer.com/decks/${data.id}`,
        };

      case 'tournament':
        return {
          type: 'tournament',
          title: `Live: ${data.name} Tournament`,
          gameId: 'KONIVRER',
          tags: ['KONIVRER', 'Tournament', data.format, 'Live'],
          description: `Live coverage of ${data.name} tournament. Tournament info: https://konivrer.com/tournaments/${data.id}`,
        };

      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
  }

  /**
   * Generate Reddit content
   */
  private generateRedditContent(contentData: ContentData): any {
    const { type, data } = contentData;

    switch (type) {
      case 'deck':
        return {
          type: 'deck',
          title: `[${data.format}] ${data.name} - ${data.winRate}% Win Rate`,
          text: `# Deck Overview\n\n**Format:** ${data.format}\n**Win Rate:** ${data.winRate}%\n**Strategy:** ${data.strategy || 'N/A'}\n\n## Top Cards\n${data.topCards?.map(card => `- ${card}`).join('\n') || 'N/A'}\n\n## Deck List\n[View full deck list](https://konivrer.com/decks/${data.id})\n\n## Discussion\nWhat do you think about this deck? Any suggestions for improvements?\n\n---\n*Posted via KONIVRER TCG Platform*`,
          subreddit: 'konivrer',
          flair: 'Deck Guide',
        };

      case 'tournament':
        return {
          type: 'tournament',
          title: `🏆 ${data.name} - ${data.format} Tournament Results`,
          text: `# Tournament Results\n\n**Format:** ${data.format}\n**Players:** ${data.playerCount}\n**Status:** ${data.status}\n\n## Top Players\n${data.topPlayers?.map((player, index) => `${index + 1}. ${player.name} - ${player.deck}`).join('\n') || 'Results pending'}\n\n## Discussion\nHow did your tournament go? Share your experiences!\n\n---\n*Posted via KONIVRER TCG Platform*`,
          subreddit: 'konivrer',
          flair: 'Tournament',
        };

      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
  }

  /**
   * Generate Instagram content
   */
  private generateInstagramContent(contentData: ContentData): any {
    const { type, data } = contentData;

    switch (type) {
      case 'deck':
        return {
          type: 'deck',
          caption: `🃏 ${data.name} - ${data.format} Deck\n\nWin Rate: ${data.winRate}%\nStrategy: ${data.strategy || 'N/A'}\n\n#KONIVRER #TCG #${data.format} #DeckGuide #CardGame`,
          imageUrl: data.imageUrl,
          hashtags: ['KONIVRER', 'TCG', data.format.toLowerCase(), 'DeckGuide', 'CardGame'],
        };

      case 'achievement':
        return {
          type: 'achievement',
          caption: `🎖️ Achievement Unlocked!\n\n${data.name}\n${data.description}\n\n#KONIVRER #Achievement #${data.rarity} #TCG`,
          imageUrl: data.imageUrl,
          hashtags: ['KONIVRER', 'Achievement', data.rarity?.toLowerCase(), 'TCG'],
        };

      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
  }

  /**
   * Generate deck visualization
   */
  async generateDeckVisualization(deckId: string): Promise<any> {
    // This would generate a beautiful deck image
    // For now, return placeholder data
    return {
      id: deckId,
      name: 'Sample Deck',
      format: 'Standard',
      cardCount: 40,
      winRate: 65,
      strategy: 'Aggro Control',
      topCards: ['Card A', 'Card B', 'Card C'],
      imageUrl: `https://konivrer.com/api/decks/${deckId}/visualization`,
      lastUpdated: new Date().toISOString(),
    };
  }

  private getAchievementColor(rarity: string): number {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 0x808080; // Gray
      case 'uncommon':
        return 0x00ff00; // Green
      case 'rare':
        return 0x0080ff; // Blue
      case 'epic':
        return 0x8000ff; // Purple
      case 'legendary':
        return 0xff8000; // Orange
      default:
        return 0x808080; // Gray
    }
  }
}