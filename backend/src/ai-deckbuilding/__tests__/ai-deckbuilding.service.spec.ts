import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AiDeckbuildingService } from '../ai-deckbuilding.service';
import { MatchmakingService } from '../../matchmaking/matchmaking.service';
import { User } from '../../users/entities/user.entity';
import { Deck } from '../../decks/entities/deck.entity';
import { Card } from '../../cards/entities/card.entity';

describe('AiDeckbuildingService', () => {
  let service: AiDeckbuildingService;
  let mockUserRepository: any;
  let mockDeckRepository: any;
  let mockCardRepository: any;
  let mockMatchmakingService: any;

  beforeEach(async () => {
    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockDeckRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { archetype: 'Aggro', count: '50' },
          { archetype: 'Control', count: '30' },
          { archetype: 'Midrange', count: '20' },
        ]),
      })),
    };

    mockCardRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        having: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          { id: 'card1', name: 'Lightning Bolt' },
          { id: 'card2', name: 'Counterspell' },
        ]),
      })),
    };

    mockMatchmakingService = {
      getPlayerRating: jest.fn().mockResolvedValue({
        skill: 25.0,
        uncertainty: 8.33,
        conservativeRating: 12.5,
        isStable: false,
        winRate: 48.5,
        matchesPlayed: 15,
      }),
      getFormatLeaderboard: jest.fn().mockResolvedValue([
        { conservativeRating: 8.2 },
        { conservativeRating: 15.7 },
        { conservativeRating: 22.1 },
        { conservativeRating: 31.5 },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiDeckbuildingService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Deck),
          useValue: mockDeckRepository,
        },
        {
          provide: getRepositoryToken(Card),
          useValue: mockCardRepository,
        },
        {
          provide: MatchmakingService,
          useValue: mockMatchmakingService,
        },
      ],
    }).compile();

    service = module.get<AiDeckbuildingService>(AiDeckbuildingService);
  });

  describe('generateDeckSuggestions', () => {
    it('should generate deck suggestions based on player rating and meta', async () => {
      // Mock deck history
      mockDeckRepository.find.mockResolvedValueOnce([
        {
          id: 'deck1',
          archetype: 'Aggro',
          cards: [],
          matches: [],
        },
      ]);

      const suggestions = await service.generateDeckSuggestions('user123', 'Standard');

      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
      
      // Check suggestion structure
      expect(suggestions[0]).toHaveProperty('cardName');
      expect(suggestions[0]).toHaveProperty('synergy');
      expect(suggestions[0]).toHaveProperty('confidenceScore');
      expect(suggestions[0]).toHaveProperty('reasoning');

      expect(mockMatchmakingService.getPlayerRating).toHaveBeenCalledWith('user123', 'Standard');
    });

    it('should adjust suggestions based on skill tier', async () => {
      // Mock novice player rating
      mockMatchmakingService.getPlayerRating.mockResolvedValueOnce({
        skill: 25.0,
        uncertainty: 8.33,
        conservativeRating: 5.0, // Novice tier
        isStable: false,
        winRate: 35.0,
      });

      mockDeckRepository.find.mockResolvedValueOnce([]);

      const suggestions = await service.generateDeckSuggestions('novice_user', 'Standard');

      expect(suggestions).toBeDefined();
      
      // Should include suggestions appropriate for novice players
      const reasonings = suggestions.map(s => s.reasoning);
      expect(reasonings.some(r => r.includes('novice'))).toBe(true);
    });

    it('should consider playstyle in suggestions', async () => {
      mockDeckRepository.find.mockResolvedValueOnce([]);

      const aggressiveSuggestions = await service.generateDeckSuggestions('user123', 'Standard', {
        playstyle: 'aggressive'
      });

      expect(aggressiveSuggestions).toBeDefined();
      expect(Array.isArray(aggressiveSuggestions)).toBe(true);
    });
  });

  describe('generateMetaAnalysis', () => {
    it('should provide comprehensive meta analysis', async () => {
      const analysis = await service.generateMetaAnalysis('user123', 'Standard');

      expect(analysis).toBeDefined();
      expect(analysis.format).toBe('Standard');
      expect(Array.isArray(analysis.dominantArchetypes)).toBe(true);
      expect(analysis.dominantArchetypes.length).toBeGreaterThan(0);
      expect(analysis.personalizedMeta.playerSkillTier).toBe('intermediate');
      
      expect(mockMatchmakingService.getPlayerRating).toHaveBeenCalledWith('user123', 'Standard');
      expect(mockMatchmakingService.getFormatLeaderboard).toHaveBeenCalledWith('Standard', 1000);
    });

    it('should identify skill-based meta recommendations', async () => {
      const analysis = await service.generateMetaAnalysis('user123', 'Standard');

      expect(analysis.skillBasedRecommendations).toBeDefined();
      expect(Array.isArray(analysis.skillBasedRecommendations)).toBe(true);
      
      if (analysis.skillBasedRecommendations.length > 0) {
        const recommendation = analysis.skillBasedRecommendations[0];
        expect(recommendation).toHaveProperty('synergy');
        expect(recommendation).toHaveProperty('confidenceScore');
        expect(recommendation).toHaveProperty('reasoning');
        expect(recommendation.reasoning).toContain('intermediate');
      }
    });

    it('should provide improvement suggestions', async () => {
      const analysis = await service.generateMetaAnalysis('user123', 'Standard');

      expect(analysis.personalizedMeta.improvementSuggestions).toBeDefined();
      expect(Array.isArray(analysis.personalizedMeta.improvementSuggestions)).toBe(true);
      expect(analysis.personalizedMeta.improvementSuggestions.length).toBeGreaterThan(0);
    });
  });

  describe('optimizeDeck', () => {
    it('should optimize deck based on player rating and strategy', async () => {
      const request = {
        userId: 'user123',
        format: 'Standard',
        currentDeckList: ['card1', 'card2', 'card3'],
        playstyle: 'midrange' as const,
      };

      const result = await service.optimizeDeck(request);

      expect(result).toBeDefined();
      expect(result.originalDeck).toEqual(request.currentDeckList);
      expect(result.optimizedDeck).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.changes.reasoning).toBeDefined();
      expect(typeof result.expectedWinRateImprovement).toBe('number');

      expect(mockMatchmakingService.getPlayerRating).toHaveBeenCalledWith('user123', 'Standard');
    });

    it('should provide different optimization strategies based on skill level', async () => {
      // Test expert player
      mockMatchmakingService.getPlayerRating.mockResolvedValueOnce({
        skill: 35.0,
        uncertainty: 2.1,
        conservativeRating: 32.7, // Expert tier
        isStable: true,
        winRate: 68.5,
      });

      const expertRequest = {
        userId: 'expert_user',
        format: 'Standard',
        currentDeckList: ['card1', 'card2'],
      };

      const expertResult = await service.optimizeDeck(expertRequest);
      
      expect(expertResult.changes.reasoning).toContain('innovation');
    });
  });

  describe('skill tier calculation', () => {
    it('should correctly categorize skill tiers', () => {
      // Access private method through service instance
      const getSkillTier = (service as any).getSkillTier.bind(service);

      expect(getSkillTier(5)).toBe('novice');
      expect(getSkillTier(15)).toBe('intermediate');
      expect(getSkillTier(25)).toBe('advanced');
      expect(getSkillTier(35)).toBe('expert');
    });
  });

  describe('meta analysis accuracy', () => {
    it('should identify emerging cards based on recent play data', async () => {
      const analysis = await service.generateMetaAnalysis('user123', 'Standard');

      expect(analysis.emergingCards).toBeDefined();
      expect(Array.isArray(analysis.emergingCards)).toBe(true);
      
      // Should call the card repository to find trending cards
      expect(mockCardRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should provide format-specific dominant archetypes', async () => {
      const analysis = await service.generateMetaAnalysis('user123', 'Standard');

      expect(analysis.dominantArchetypes).toContain('Aggro');
      expect(analysis.dominantArchetypes).toContain('Control');
      expect(analysis.dominantArchetypes).toContain('Midrange');
      
      // Should query deck repository for archetype data
      expect(mockDeckRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});