import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { SocialMediaRealService } from '../social-media-real.service';
import { DiscordRealService } from '../services/discord-real.service';
import { TwitterRealService } from '../services/twitter-real.service';
import { DeckIntegrationService } from '../integrations/deck-integration.service';
import { TournamentIntegrationService } from '../integrations/tournament-integration.service';

describe('SocialMediaRealService Integration', () => {
  let service: SocialMediaRealService;
  let discordService: DiscordRealService;
  let twitterService: TwitterRealService;
  let deckIntegration: DeckIntegrationService;
  let tournamentIntegration: TournamentIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test', '.env'],
        }),
      ],
      providers: [
        SocialMediaRealService,
        DiscordRealService,
        TwitterRealService,
        DeckIntegrationService,
        TournamentIntegrationService,
      ],
    }).compile();

    service = module.get<SocialMediaRealService>(SocialMediaRealService);
    discordService = module.get<DiscordRealService>(DiscordRealService);
    twitterService = module.get<TwitterRealService>(TwitterRealService);
    deckIntegration = module.get<DeckIntegrationService>(DeckIntegrationService);
    tournamentIntegration = module.get<TournamentIntegrationService>(TournamentIntegrationService);
  });

  describe('Content Sharing', () => {
    it('should share deck content to multiple platforms', async () => {
      const shareRequest = {
        userId: 'test-user',
        content: {
          type: 'deck' as const,
          data: {
            id: 'test-deck',
            name: 'Test Deck',
            format: 'Standard',
            winRate: 65,
            strategy: 'Control',
            topCards: ['Card A', 'Card B'],
          },
        },
        platforms: ['discord', 'twitter'] as const,
        message: 'Check out my new deck!',
      };

      const results = await service.shareContent(shareRequest);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);

      results.forEach((result) => {
        expect(result.platform).toBeOneOf(['discord', 'twitter']);
        expect(result.success).toBeDefined();
        if (result.success) {
          expect(result.postId).toBeDefined();
          expect(result.url).toBeDefined();
        }
      });
    });

    it('should handle sharing errors gracefully', async () => {
      const shareRequest = {
        userId: 'test-user',
        content: {
          type: 'deck' as const,
          data: {
            id: 'invalid-deck',
            name: 'Invalid Deck',
            format: 'Standard',
            winRate: 0,
          },
        },
        platforms: ['discord', 'twitter'] as const,
      };

      const results = await service.shareContent(shareRequest);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      
      // Should not throw errors even if individual platforms fail
      results.forEach((result) => {
        expect(result.platform).toBeDefined();
        expect(typeof result.success).toBe('boolean');
      });
    });
  });

  describe('Streaming', () => {
    it('should start streaming to multiple platforms', async () => {
      const streamRequest = {
        userId: 'test-user',
        platforms: ['twitch', 'youtube'] as const,
        title: 'Test Stream',
        description: 'Testing streaming functionality',
        gameId: 'test-game',
      };

      const results = await service.startStreaming(streamRequest);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(2);

      results.forEach((result) => {
        expect(result.platform).toBeOneOf(['twitch', 'youtube']);
        expect(result.streamId).toBeDefined();
        expect(result.streamUrl).toBeDefined();
      });
    });
  });

  describe('Analytics', () => {
    it('should get social media analytics for user', async () => {
      const userId = 'test-user';
      const analytics = await service.getSocialAnalytics(userId);

      expect(analytics).toBeDefined();
      expect(Array.isArray(analytics)).toBe(true);

      analytics.forEach((platform) => {
        expect(platform.platform).toBeDefined();
        expect(typeof platform.followers).toBe('number');
        expect(typeof platform.engagement).toBe('number');
        expect(typeof platform.posts).toBe('number');
      });
    });
  });

  describe('Platform Health', () => {
    it('should check platform health status', async () => {
      const health = await service.getPlatformHealth();

      expect(health).toBeDefined();
      expect(typeof health).toBe('object');

      Object.entries(health).forEach(([platform, isHealthy]) => {
        expect(typeof platform).toBe('string');
        expect(typeof isHealthy).toBe('boolean');
      });
    });
  });

  describe('Content Suggestions', () => {
    it('should get content suggestions for platform', async () => {
      const suggestions = await service.getContentSuggestions(
        'deck',
        'twitter',
        { name: 'Test Deck', format: 'Standard' }
      );

      expect(suggestions).toBeDefined();
      expect(suggestions.title).toBeDefined();
      expect(suggestions.description).toBeDefined();
      expect(Array.isArray(suggestions.hashtags)).toBe(true);
    });
  });

  describe('Trending Hashtags', () => {
    it('should get trending hashtags for platform', async () => {
      const hashtags = await service.getTrendingHashtags('twitter');

      expect(hashtags).toBeDefined();
      expect(Array.isArray(hashtags)).toBe(true);
    });
  });

  describe('Optimal Posting Times', () => {
    it('should get optimal posting times for platform', async () => {
      const times = await service.getOptimalPostingTimes('twitter');

      expect(times).toBeDefined();
      expect(times.bestTimes).toBeDefined();
      expect(Array.isArray(times.bestTimes)).toBe(true);
      expect(times.timezone).toBeDefined();
    });
  });

  describe('Bulk Sharing', () => {
    it('should handle bulk sharing with rate limiting', async () => {
      const requests = [
        {
          userId: 'test-user',
          content: {
            type: 'deck' as const,
            data: { id: 'deck1', name: 'Deck 1' },
          },
          platforms: ['discord'] as const,
        },
        {
          userId: 'test-user',
          content: {
            type: 'deck' as const,
            data: { id: 'deck2', name: 'Deck 2' },
          },
          platforms: ['twitter'] as const,
        },
      ];

      const results = await service.bulkShareContent(requests, 500);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);

      results.forEach((platformResults) => {
        expect(Array.isArray(platformResults)).toBe(true);
      });
    });
  });
});

describe('DeckIntegrationService Integration', () => {
  let service: DeckIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [DeckIntegrationService],
    }).compile();

    service = module.get<DeckIntegrationService>(DeckIntegrationService);
  });

  describe('Deck Social Data', () => {
    it('should get deck social data', async () => {
      const deckId = 'test-deck';
      const data = await service.getDeckSocialData(deckId);

      expect(data).toBeDefined();
      expect(data.id).toBe(deckId);
      expect(data.name).toBeDefined();
      expect(data.format).toBeDefined();
      expect(typeof data.cardCount).toBe('number');
      expect(typeof data.winRate).toBe('number');
      expect(Array.isArray(data.topCards)).toBe(true);
      expect(data.imageUrl).toBeDefined();
    });
  });

  describe('Deck Analytics', () => {
    it('should get deck analytics', async () => {
      const deckId = 'test-deck';
      const analytics = await service.getDeckAnalytics(deckId);

      expect(analytics).toBeDefined();
      expect(typeof analytics.totalShares).toBe('number');
      expect(typeof analytics.engagementRate).toBe('number');
      expect(analytics.platformBreakdown).toBeDefined();
      expect(analytics.topPerformingPlatform).toBeDefined();
    });
  });

  describe('Trending Decks', () => {
    it('should get trending decks', async () => {
      const decks = await service.getTrendingDecks(5);

      expect(decks).toBeDefined();
      expect(Array.isArray(decks)).toBe(true);
      expect(decks.length).toBeLessThanOrEqual(5);

      decks.forEach((deck) => {
        expect(deck.id).toBeDefined();
        expect(deck.name).toBeDefined();
        expect(deck.format).toBeDefined();
      });
    });
  });
});

describe('TournamentIntegrationService Integration', () => {
  let service: TournamentIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [TournamentIntegrationService],
    }).compile();

    service = module.get<TournamentIntegrationService>(TournamentIntegrationService);
  });

  describe('Tournament Social Data', () => {
    it('should get tournament social data', async () => {
      const tournamentId = 'test-tournament';
      const data = await service.getTournamentSocialData(tournamentId);

      expect(data).toBeDefined();
      expect(data.id).toBe(tournamentId);
      expect(data.name).toBeDefined();
      expect(data.format).toBeDefined();
      expect(data.status).toBeDefined();
      expect(typeof data.playerCount).toBe('number');
      expect(data.imageUrl).toBeDefined();
    });
  });

  describe('Tournament Analytics', () => {
    it('should get tournament analytics', async () => {
      const tournamentId = 'test-tournament';
      const analytics = await service.getTournamentAnalytics(tournamentId);

      expect(analytics).toBeDefined();
      expect(typeof analytics.totalShares).toBe('number');
      expect(typeof analytics.engagementRate).toBe('number');
      expect(analytics.platformBreakdown).toBeDefined();
      expect(analytics.topPerformingPlatform).toBeDefined();
    });
  });

  describe('Upcoming Tournaments', () => {
    it('should get upcoming tournaments', async () => {
      const tournaments = await service.getUpcomingTournaments(5);

      expect(tournaments).toBeDefined();
      expect(Array.isArray(tournaments)).toBe(true);
      expect(tournaments.length).toBeLessThanOrEqual(5);

      tournaments.forEach((tournament) => {
        expect(tournament.id).toBeDefined();
        expect(tournament.name).toBeDefined();
        expect(tournament.format).toBeDefined();
        expect(tournament.status).toBe('upcoming');
      });
    });
  });

  describe('Live Tournaments', () => {
    it('should get live tournaments', async () => {
      const tournaments = await service.getLiveTournaments();

      expect(tournaments).toBeDefined();
      expect(Array.isArray(tournaments)).toBe(true);

      tournaments.forEach((tournament) => {
        expect(tournament.id).toBeDefined();
        expect(tournament.name).toBeDefined();
        expect(tournament.status).toBe('live');
      });
    });
  });
});