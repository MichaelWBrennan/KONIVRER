import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchmakingService } from '../matchmaking.service';
import { BayesianMatchmakingService } from '../bayesian-matchmaking.service';
import { TelemetryService } from '../telemetry-integration.service';
import { PlayerRating } from '../entities/player-rating.entity';
import { User } from '../../users/entities/user.entity';

describe('MatchmakingService', () => {
  let service: MatchmakingService;
  let ratingRepository: Repository<PlayerRating>;
  let userRepository: Repository<User>;
  let bayesianService: BayesianMatchmakingService;
  let telemetryService: TelemetryService;

  const mockUser: User = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
    eloRating: 1200,
    peakEloRating: 1200,
    // Add other required User properties with default values
  } as User;

  const mockPlayerRating: PlayerRating = {
    id: 'rating1',
    userId: 'user1',
    format: 'Standard',
    skill: 25.0,
    uncertainty: 8.333,
    confidenceMultiplier: 3.0,
    conservativeRating: 0.0,
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    currentStreak: 0,
    streakType: 'none',
    longestWinStreak: 0,
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
    getWinRate: () => 0,
    getRatingTrend: () => 'stable',
    isRatingStable: () => false,
    getExpectedPerformance: () => 0.5,
  } as PlayerRating;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchmakingService,
        BayesianMatchmakingService,
        TelemetryService,
        {
          provide: getRepositoryToken(PlayerRating),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchmakingService>(MatchmakingService);
    ratingRepository = module.get<Repository<PlayerRating>>(getRepositoryToken(PlayerRating));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    bayesianService = module.get<BayesianMatchmakingService>(BayesianMatchmakingService);
    telemetryService = module.get<TelemetryService>(TelemetryService);
  });

  describe('getOrCreatePlayerRating', () => {
    it('should return existing rating if found', async () => {
      jest.spyOn(ratingRepository, 'findOne').mockResolvedValue(mockPlayerRating);

      const result = await service.getOrCreatePlayerRating('user1', 'Standard');

      expect(result).toBe(mockPlayerRating);
      expect(ratingRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user1', format: 'Standard' },
        relations: ['user'],
      });
    });

    it('should create new rating if not found', async () => {
      jest.spyOn(ratingRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(ratingRepository, 'create').mockReturnValue(mockPlayerRating);
      jest.spyOn(ratingRepository, 'save').mockResolvedValue(mockPlayerRating);

      const result = await service.getOrCreatePlayerRating('user1', 'Standard');

      expect(result).toBe(mockPlayerRating);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'user1' } });
      expect(ratingRepository.create).toHaveBeenCalled();
      expect(ratingRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(ratingRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getOrCreatePlayerRating('user1', 'Standard')).rejects.toThrow('User not found');
    });
  });

  describe('updateRatings', () => {
    it('should update ratings for match outcome', async () => {
      const player1Rating = { ...mockPlayerRating, userId: 'player1' };
      const player2Rating = { ...mockPlayerRating, userId: 'player2' };

      jest.spyOn(service, 'getOrCreatePlayerRating')
        .mockResolvedValueOnce(player1Rating)
        .mockResolvedValueOnce(player2Rating);

      jest.spyOn(ratingRepository, 'save')
        .mockResolvedValueOnce(player1Rating)
        .mockResolvedValueOnce(player2Rating);

      jest.spyOn(service as any, 'updatePercentileRanks').mockResolvedValue(undefined);
      jest.spyOn(service as any, 'recordMatchTelemetry').mockResolvedValue(undefined);

      const updateDto = {
        format: 'Standard',
        outcomes: [
          { playerId: 'player1', rank: 1 }, // Winner
          { playerId: 'player2', rank: 2 }, // Loser
        ],
      };

      const result = await service.updateRatings(updateDto);

      expect(result).toHaveLength(2);
      expect(service.getOrCreatePlayerRating).toHaveBeenCalledTimes(2);
      expect(ratingRepository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('generatePairings', () => {
    it('should generate optimal pairings', async () => {
      const player1Rating = { ...mockPlayerRating, userId: 'player1' };
      const player2Rating = { ...mockPlayerRating, userId: 'player2' };

      jest.spyOn(service, 'getOrCreatePlayerRating')
        .mockResolvedValueOnce(player1Rating)
        .mockResolvedValueOnce(player2Rating);

      jest.spyOn(service as any, 'recordPairingTelemetry').mockResolvedValue(undefined);

      const generateDto = {
        playerIds: ['player1', 'player2'],
        format: 'Standard',
        previousPairings: [],
      };

      const result = await service.generatePairings(generateDto);

      expect(result.pairings).toHaveLength(1);
      expect(result.pairings[0].players).toEqual(['player1', 'player2']);
      expect(result.overallQuality).toBeGreaterThan(0);
      expect(result.algorithm).toBe('TrueSkill Bayesian Swiss');
    });

    it('should handle odd number of players with byes', async () => {
      const player1Rating = { ...mockPlayerRating, userId: 'player1' };
      const player2Rating = { ...mockPlayerRating, userId: 'player2' };
      const player3Rating = { ...mockPlayerRating, userId: 'player3' };

      jest.spyOn(service, 'getOrCreatePlayerRating')
        .mockResolvedValueOnce(player1Rating)
        .mockResolvedValueOnce(player2Rating)
        .mockResolvedValueOnce(player3Rating);

      jest.spyOn(service as any, 'recordPairingTelemetry').mockResolvedValue(undefined);

      const generateDto = {
        playerIds: ['player1', 'player2', 'player3'],
        format: 'Standard',
      };

      const result = await service.generatePairings(generateDto);

      expect(result.byes).toBe(1);
      expect(result.pairings).toHaveLength(1); // One pairing + one bye
    });
  });

  describe('calculateMatchQuality', () => {
    it('should calculate match quality between two players', async () => {
      const player1Rating = { ...mockPlayerRating, userId: 'player1', skill: 25.0 };
      const player2Rating = { ...mockPlayerRating, userId: 'player2', skill: 24.0 };

      jest.spyOn(service, 'getOrCreatePlayerRating')
        .mockResolvedValueOnce(player1Rating)
        .mockResolvedValueOnce(player2Rating);

      const result = await service.calculateMatchQuality('player1', 'player2', 'Standard');

      expect(result.quality).toBeGreaterThan(0);
      expect(result.quality).toBeLessThanOrEqual(1);
      expect(result.winProbabilities).toHaveLength(2);
      expect(result.skillDifference).toBe(1.0);
      expect(result.balanceCategory).toMatch(/excellent|good|fair|poor/);
    });
  });

  describe('simulateMatch', () => {
    it('should simulate match with correct statistics', async () => {
      const mockQuality = {
        quality: 0.8,
        winProbabilities: [0.6, 0.4],
        skillDifference: 2.0,
        uncertaintyFactor: 10.0,
        balanceCategory: 'good' as const,
      };

      jest.spyOn(service, 'calculateMatchQuality').mockResolvedValue(mockQuality);

      const simulateDto = {
        player1Id: 'player1',
        player2Id: 'player2',
        format: 'Standard',
        numberOfGames: 100,
        includeDetailedLogs: false,
      };

      const result = await service.simulateMatch(simulateDto);

      expect(result.totalGames).toBe(100);
      expect(result.player1WinRate + result.player2WinRate + result.drawRate).toBeCloseTo(100, 1);
      expect(result.averageGameLength).toBeGreaterThan(0);
      expect(result.confidenceInterval).toBeDefined();
      expect(result.confidenceInterval!.confidence).toBe(0.95);
      expect(result.detailedLogs).toBeUndefined(); // Not requested
    });

    it('should include detailed logs when requested', async () => {
      const mockQuality = {
        quality: 0.7,
        winProbabilities: [0.5, 0.5],
        skillDifference: 0.5,
        uncertaintyFactor: 8.0,
        balanceCategory: 'good' as const,
      };

      jest.spyOn(service, 'calculateMatchQuality').mockResolvedValue(mockQuality);

      const simulateDto = {
        player1Id: 'player1',
        player2Id: 'player2',
        format: 'Standard',
        numberOfGames: 10,
        includeDetailedLogs: true,
      };

      const result = await service.simulateMatch(simulateDto);

      expect(result.detailedLogs).toBeDefined();
      expect(result.detailedLogs).toHaveLength(10);
      expect(result.detailedLogs![0]).toHaveProperty('gameNumber');
      expect(result.detailedLogs![0]).toHaveProperty('outcome');
      expect(result.detailedLogs![0]).toHaveProperty('turns');
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard for format', async () => {
      const ratings = [mockPlayerRating];
      
      jest.spyOn(ratingRepository, 'find').mockResolvedValue(ratings);

      const result = await service.getLeaderboard('Standard', 10);

      expect(result).toHaveLength(1);
      expect(result[0].format).toBe('Standard');
      expect(ratingRepository.find).toHaveBeenCalledWith({
        where: { format: 'Standard' },
        relations: ['user'],
        order: { conservativeRating: 'DESC' },
        take: 10,
      });
    });
  });
});