import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface RedditShareContent {
  type: 'deck' | 'tournament' | 'achievement' | 'match_result';
  title: string;
  text: string;
  subreddit: string;
  flair?: string;
  imageUrl?: string;
}

export interface RedditUserStats {
  followers: number;
  engagement: number;
  posts: number;
}

@Injectable()
export class RedditService {
  private readonly logger = new Logger(RedditService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly userAgent: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('REDDIT_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('REDDIT_CLIENT_SECRET');
    this.userAgent = this.configService.get<string>('REDDIT_USER_AGENT') || 'KONIVRER-TCG-Platform/1.0';
  }

  /**
   * Share content to Reddit
   */
  async shareContent(
    userId: string,
    content: RedditShareContent,
  ): Promise<{ platform: string; success: boolean; postId?: string; url?: string; error?: string }> {
    try {
      if (!this.clientId || !this.clientSecret) {
        throw new Error('Reddit API credentials not configured');
      }

      // Submit post to Reddit (implementation would use Reddit API)
      const postData = {
        title: content.title,
        text: content.text,
        subreddit: content.subreddit,
        flair: content.flair,
        imageUrl: content.imageUrl,
      };

      const response = await this.submitPost(postData);

      return {
        platform: 'reddit',
        success: true,
        postId: response.id,
        url: `https://reddit.com/r/${content.subreddit}/comments/${response.id}`,
      };
    } catch (error) {
      this.logger.error('Failed to share content to Reddit:', error);
      return {
        platform: 'reddit',
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Post deck guide to Reddit
   */
  async postDeckGuide(
    userId: string,
    deckId: string,
    deckData: any,
  ): Promise<{ platform: string; success: boolean; postId?: string; url?: string; error?: string }> {
    const content: RedditShareContent = {
      type: 'deck',
      title: `[${deckData.format}] ${deckData.name} - ${deckData.winRate}% Win Rate`,
      text: this.generateDeckGuideText(deckData, deckId),
      subreddit: 'konivrer',
      flair: 'Deck Guide',
    };

    return this.shareContent(userId, content);
  }

  /**
   * Post tournament results to Reddit
   */
  async postTournamentResults(
    tournamentId: string,
    tournamentData: any,
  ): Promise<{ platform: string; success: boolean; postId?: string; url?: string; error?: string }> {
    const content: RedditShareContent = {
      type: 'tournament',
      title: `🏆 ${tournamentData.name} - ${tournamentData.format} Tournament Results`,
      text: this.generateTournamentResultsText(tournamentData, tournamentId),
      subreddit: 'konivrer',
      flair: 'Tournament',
    };

    return this.shareContent('system', content);
  }

  /**
   * Get user's Reddit statistics
   */
  async getUserStats(userId: string): Promise<RedditUserStats> {
    try {
      // This would query Reddit API for user statistics
      return {
        followers: 0,
        engagement: 0,
        posts: 0,
      };
    } catch (error) {
      this.logger.error('Failed to get Reddit user stats:', error);
      return {
        followers: 0,
        engagement: 0,
        posts: 0,
      };
    }
  }

  /**
   * Submit post to Reddit
   */
  private async submitPost(postData: any): Promise<{ id: string }> {
    try {
      // Implementation would use Reddit API
      this.logger.log('Submitting Reddit post:', postData);
      return { id: 'reddit_post_id_placeholder' };
    } catch (error) {
      this.logger.error('Failed to submit Reddit post:', error);
      throw error;
    }
  }

  /**
   * Generate deck guide text for Reddit
   */
  private generateDeckGuideText(deckData: any, deckId: string): string {
    return `# Deck Overview

**Format:** ${deckData.format}
**Win Rate:** ${deckData.winRate}%
**Strategy:** ${deckData.strategy || 'N/A'}

## Top Cards
${deckData.topCards?.map((card: string) => `- ${card}`).join('\n') || 'N/A'}

## Deck List
[View full deck list](https://konivrer.com/decks/${deckId})

## Strategy
${deckData.strategy || 'No strategy provided'}

## Matchups
${deckData.matchups || 'No matchup data available'}

## Discussion
What do you think about this deck? Any suggestions for improvements?

---
*Posted via KONIVRER TCG Platform*`;
  }

  /**
   * Generate tournament results text for Reddit
   */
  private generateTournamentResultsText(tournamentData: any, tournamentId: string): string {
    return `# Tournament Results

**Format:** ${tournamentData.format}
**Players:** ${tournamentData.playerCount}
**Status:** ${tournamentData.status}

## Top Players
${tournamentData.topPlayers?.map((player: any, index: number) => 
  `${index + 1}. ${player.name} - ${player.deck}`
).join('\n') || 'Results pending'}

## Prize Pool
${tournamentData.prizePool || 'No prize pool information'}

## Discussion
How did your tournament go? Share your experiences!

---
*Posted via KONIVRER TCG Platform*`;
  }
}