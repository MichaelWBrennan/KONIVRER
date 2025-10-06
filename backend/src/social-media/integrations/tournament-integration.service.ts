import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { SocialMediaRealService } from '../social-media-real.service';

export interface TournamentSocialData {
  id: string;
  name: string;
  format: string;
  status: string;
  playerCount: number;
  prizePool?: string;
  entryFee?: string;
  startTime: string;
  endTime?: string;
  winner?: string;
  topPlayers?: Array<{ name: string; deck: string; placement: number }>;
  imageUrl: string;
  description: string;
  organizer: string;
}

@Injectable()
export class TournamentIntegrationService {
  private readonly logger = new Logger(TournamentIntegrationService.name);

  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    private readonly socialMediaService: SocialMediaRealService,
  ) {}

  /**
   * Get tournament data formatted for social media sharing
   */
  async getTournamentSocialData(tournamentId: string): Promise<TournamentSocialData> {
    try {
      const tournament = await this.tournamentRepository.findOne({
        where: { id: tournamentId },
        relations: ['participants', 'organizer'],
      });

      if (!tournament) {
        throw new Error(`Tournament ${tournamentId} not found`);
      }

      // Get top players
      const topPlayers = await this.getTopPlayers(tournamentId);
      
      // Generate tournament image
      const imageUrl = await this.generateTournamentImage(tournament);

      return {
        id: tournament.id,
        name: tournament.name,
        format: tournament.format || 'Standard',
        status: tournament.status || 'upcoming',
        playerCount: tournament.participants?.length || 0,
        prizePool: tournament.prizePool,
        entryFee: tournament.entryFee,
        startTime: tournament.startTime?.toISOString() || new Date().toISOString(),
        endTime: tournament.endTime?.toISOString(),
        winner: tournament.winner,
        topPlayers,
        imageUrl,
        description: tournament.description || '',
        organizer: tournament.organizer?.username || 'Unknown',
      };
    } catch (error) {
      this.logger.error(`Failed to get tournament social data for ${tournamentId}:`, error);
      throw error;
    }
  }

  /**
   * Share tournament to social media platforms
   */
  async shareTournament(
    tournamentId: string,
    platforms: string[],
    customMessage?: string
  ): Promise<any[]> {
    try {
      const tournamentData = await this.getTournamentSocialData(tournamentId);
      
      const results = await this.socialMediaService.shareContent({
        userId: 'system',
        content: {
          type: 'tournament',
          data: tournamentData,
        },
        platforms: platforms as any[],
        message: customMessage,
      });

      // Log the share event
      await this.logTournamentShare(tournamentId, platforms, results);

      return results;
    } catch (error) {
      this.logger.error(`Failed to share tournament ${tournamentId}:`, error);
      throw error;
    }
  }

  /**
   * Share tournament update when status changes
   */
  async shareTournamentUpdate(
    tournamentId: string,
    updateType: 'started' | 'round_complete' | 'finished' | 'player_eliminated',
    data?: any
  ): Promise<void> {
    try {
      const tournamentData = await this.getTournamentSocialData(tournamentId);
      
      let message = '';
      switch (updateType) {
        case 'started':
          message = `🏆 ${tournamentData.name} has started! ${tournamentData.playerCount} players competing in ${tournamentData.format}`;
          break;
        case 'round_complete':
          message = `⚡ Round ${data?.round || 'X'} complete in ${tournamentData.name}!`;
          break;
        case 'finished':
          message = `🏆 ${tournamentData.name} finished! Winner: ${tournamentData.winner || 'TBD'}`;
          break;
        case 'player_eliminated':
          message = `💪 ${data?.playerName || 'A player'} eliminated from ${tournamentData.name}`;
          break;
      }

      // Send to Discord webhook
      await this.socialMediaService.sendTournamentUpdate(tournamentId, {
        type: updateType,
        message,
        data: {
          ...data,
          format: tournamentData.format,
          players: tournamentData.playerCount,
          winner: tournamentData.winner,
        },
      });

      // Also share to other platforms
      await this.socialMediaService.shareContent({
        userId: 'system',
        content: {
          type: 'tournament',
          data: tournamentData,
        },
        platforms: ['twitter', 'reddit'],
        message,
      });
    } catch (error) {
      this.logger.error(`Failed to share tournament update for ${tournamentId}:`, error);
    }
  }

  /**
   * Get tournament analytics for social sharing
   */
  async getTournamentAnalytics(tournamentId: string): Promise<{
    totalShares: number;
    platformBreakdown: Record<string, number>;
    engagementRate: number;
    topPerformingPlatform: string;
    liveViewers?: number;
  }> {
    try {
      // This would query your analytics database
      // For now, return mock data
      return {
        totalShares: Math.floor(Math.random() * 200),
        platformBreakdown: {
          discord: Math.floor(Math.random() * 50),
          twitter: Math.floor(Math.random() * 80),
          reddit: Math.floor(Math.random() * 40),
          instagram: Math.floor(Math.random() * 30),
        },
        engagementRate: Math.random() * 15 + 10, // 10-25%
        topPerformingPlatform: 'twitter',
        liveViewers: Math.floor(Math.random() * 1000) + 100,
      };
    } catch (error) {
      this.logger.error(`Failed to get tournament analytics for ${tournamentId}:`, error);
      return {
        totalShares: 0,
        platformBreakdown: {},
        engagementRate: 0,
        topPerformingPlatform: 'none',
      };
    }
  }

  /**
   * Get upcoming tournaments for social promotion
   */
  async getUpcomingTournaments(limit: number = 5): Promise<TournamentSocialData[]> {
    try {
      const tournaments = await this.tournamentRepository.find({
        where: {
          status: 'upcoming',
        },
        order: {
          startTime: 'ASC',
        },
        take: limit,
        relations: ['organizer'],
      });

      const socialData: TournamentSocialData[] = [];

      for (const tournament of tournaments) {
        const data = await this.getTournamentSocialData(tournament.id);
        socialData.push(data);
      }

      return socialData;
    } catch (error) {
      this.logger.error('Failed to get upcoming tournaments:', error);
      return [];
    }
  }

  /**
   * Get live tournaments for streaming promotion
   */
  async getLiveTournaments(): Promise<TournamentSocialData[]> {
    try {
      const tournaments = await this.tournamentRepository.find({
        where: {
          status: 'live',
        },
        relations: ['organizer'],
      });

      const socialData: TournamentSocialData[] = [];

      for (const tournament of tournaments) {
        const data = await this.getTournamentSocialData(tournament.id);
        socialData.push(data);
      }

      return socialData;
    } catch (error) {
      this.logger.error('Failed to get live tournaments:', error);
      return [];
    }
  }

  /**
   * Get top players from tournament
   */
  private async getTopPlayers(tournamentId: string): Promise<Array<{ name: string; deck: string; placement: number }>> {
    try {
      // This would query your tournament results database
      // For now, return mock data
      return [
        { name: 'Player1', deck: 'Control Deck', placement: 1 },
        { name: 'Player2', deck: 'Aggro Deck', placement: 2 },
        { name: 'Player3', deck: 'Combo Deck', placement: 3 },
        { name: 'Player4', deck: 'Midrange Deck', placement: 4 },
        { name: 'Player5', deck: 'Tempo Deck', placement: 5 },
      ];
    } catch (error) {
      this.logger.error(`Failed to get top players for tournament ${tournamentId}:`, error);
      return [];
    }
  }

  /**
   * Generate tournament image using external service
   */
  private async generateTournamentImage(tournament: Tournament): Promise<string> {
    try {
      // This would call your image generation service
      // For now, return a placeholder URL
      return `https://konivrer.com/api/tournaments/${tournament.id}/image?t=${Date.now()}`;
    } catch (error) {
      this.logger.error(`Failed to generate tournament image for ${tournament.id}:`, error);
      return 'https://konivrer.com/assets/tournament-placeholder.png';
    }
  }

  /**
   * Log tournament share event for analytics
   */
  private async logTournamentShare(
    tournamentId: string,
    platforms: string[],
    results: any[]
  ): Promise<void> {
    try {
      // This would log to your analytics database
      this.logger.log(`Tournament ${tournamentId} shared to platforms: ${platforms.join(', ')}`);
      
      // Log successful shares
      const successfulShares = results.filter(r => r.success);
      if (successfulShares.length > 0) {
        this.logger.log(`Successful shares: ${successfulShares.map(r => r.platform).join(', ')}`);
      }
      
      // Log failed shares
      const failedShares = results.filter(r => !r.success);
      if (failedShares.length > 0) {
        this.logger.warn(`Failed shares: ${failedShares.map(r => `${r.platform}: ${r.error}`).join(', ')}`);
      }
    } catch (error) {
      this.logger.error('Failed to log tournament share:', error);
    }
  }

  /**
   * Get tournament recommendations for social sharing
   */
  async getTournamentRecommendations(userId: string): Promise<TournamentSocialData[]> {
    try {
      // This would analyze user's preferences and suggest tournaments
      // For now, return mock recommendations
      return [
        {
          id: 'rec-tournament-1',
          name: 'Weekly Championship',
          format: 'Standard',
          status: 'upcoming',
          playerCount: 32,
          prizePool: '$500',
          entryFee: 'Free',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: 'https://konivrer.com/assets/rec-tournament-1.png',
          description: 'Weekly championship tournament with great prizes',
          organizer: 'KONIVRER Official',
        },
      ];
    } catch (error) {
      this.logger.error('Failed to get tournament recommendations:', error);
      return [];
    }
  }

  /**
   * Schedule tournament promotion posts
   */
  async scheduleTournamentPromotion(tournamentId: string): Promise<void> {
    try {
      const tournamentData = await this.getTournamentSocialData(tournamentId);
      
      // Schedule pre-tournament promotion (1 day before)
      const prePromotionTime = new Date(tournamentData.startTime);
      prePromotionTime.setDate(prePromotionTime.getDate() - 1);
      
      await this.socialMediaService.scheduleContent({
        userId: 'system',
        content: {
          type: 'tournament',
          data: tournamentData,
        },
        platforms: ['discord', 'twitter', 'reddit'],
        message: `🏆 ${tournamentData.name} starts tomorrow! Don't miss out on this ${tournamentData.format} tournament.`,
        schedule: prePromotionTime,
      });

      // Schedule live promotion (when tournament starts)
      await this.socialMediaService.scheduleContent({
        userId: 'system',
        content: {
          type: 'tournament',
          data: tournamentData,
        },
        platforms: ['discord', 'twitter'],
        message: `🚀 ${tournamentData.name} is now LIVE! ${tournamentData.playerCount} players competing.`,
        schedule: new Date(tournamentData.startTime),
      });
    } catch (error) {
      this.logger.error(`Failed to schedule tournament promotion for ${tournamentId}:`, error);
    }
  }
}