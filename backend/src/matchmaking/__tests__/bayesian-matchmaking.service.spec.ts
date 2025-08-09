import { BayesianMatchmakingService, BayesianRating, MatchOutcome } from '../bayesian-matchmaking.service';

describe('BayesianMatchmakingService', () => {
  let service: BayesianMatchmakingService;

  beforeEach(() => {
    service = new BayesianMatchmakingService();
  });

  describe('createInitialRating', () => {
    it('should create initial rating with correct defaults', () => {
      const rating = service.createInitialRating();
      
      expect(rating.skill).toBe(25.0);
      expect(rating.uncertainty).toBeCloseTo(8.333, 2);
      expect(rating.confidenceMultiplier).toBe(3.0);
      expect(rating.conservativeRating).toBeCloseTo(0.0, 1); // 25 - 3*8.333
      expect(rating.matchesPlayed).toBe(0);
      expect(rating.lastUpdated).toBeInstanceOf(Date);
    });
  });

  describe('calculateMatchQuality', () => {
    it('should calculate high quality for evenly matched players', () => {
      const ratings: BayesianRating[] = [
        {
          skill: 25.0,
          uncertainty: 5.0,
          confidenceMultiplier: 3.0,
          conservativeRating: 10.0,
          matchesPlayed: 10,
          lastUpdated: new Date(),
        },
        {
          skill: 24.5,
          uncertainty: 5.2,
          confidenceMultiplier: 3.0,
          conservativeRating: 9.0,
          matchesPlayed: 12,
          lastUpdated: new Date(),
        },
      ];

      const quality = service.calculateMatchQuality(ratings);
      
      expect(quality.quality).toBeGreaterThan(0.8); // High quality for close match
      expect(quality.winProbabilities).toHaveLength(2);
      expect(quality.winProbabilities[0] + quality.winProbabilities[1]).toBeCloseTo(1.0, 2);
      expect(quality.skillDifference).toBeCloseTo(0.5, 1);
      expect(quality.uncertaintyFactor).toBeGreaterThan(0);
    });

    it('should calculate low quality for mismatched players', () => {
      const ratings: BayesianRating[] = [
        {
          skill: 35.0,
          uncertainty: 3.0,
          confidenceMultiplier: 3.0,
          conservativeRating: 26.0,
          matchesPlayed: 50,
          lastUpdated: new Date(),
        },
        {
          skill: 15.0,
          uncertainty: 3.0,
          confidenceMultiplier: 3.0,
          conservativeRating: 6.0,
          matchesPlayed: 50,
          lastUpdated: new Date(),
        },
      ];

      const quality = service.calculateMatchQuality(ratings);
      
      expect(quality.quality).toBeLessThan(0.3); // Low quality for mismatched players
      expect(quality.skillDifference).toBe(20.0);
      expect(quality.winProbabilities[0]).toBeGreaterThan(0.8); // Stronger player heavily favored
      expect(quality.winProbabilities[1]).toBeLessThan(0.2);
    });
  });

  describe('updateRatings', () => {
    it('should update ratings after a win/loss', () => {
      const initialRatings: BayesianRating[] = [
        {
          skill: 25.0,
          uncertainty: 8.0,
          confidenceMultiplier: 3.0,
          conservativeRating: 1.0,
          matchesPlayed: 0,
          lastUpdated: new Date(),
        },
        {
          skill: 25.0,
          uncertainty: 8.0,
          confidenceMultiplier: 3.0,
          conservativeRating: 1.0,
          matchesPlayed: 0,
          lastUpdated: new Date(),
        },
      ];

      const outcomes: MatchOutcome[] = [
        { playerId: 'player1', rank: 1 }, // Winner
        { playerId: 'player2', rank: 2 }, // Loser
      ];

      const updatedRatings = service.updateRatings(initialRatings, outcomes);
      
      expect(updatedRatings).toHaveLength(2);
      
      // Winner should gain skill
      expect(updatedRatings[0].skill).toBeGreaterThan(initialRatings[0].skill);
      expect(updatedRatings[0].uncertainty).toBeLessThan(initialRatings[0].uncertainty);
      expect(updatedRatings[0].matchesPlayed).toBe(1);
      
      // Loser should lose skill
      expect(updatedRatings[1].skill).toBeLessThan(initialRatings[1].skill);
      expect(updatedRatings[1].uncertainty).toBeLessThan(initialRatings[1].uncertainty);
      expect(updatedRatings[1].matchesPlayed).toBe(1);
    });

    it('should handle draws correctly', () => {
      const initialRatings: BayesianRating[] = [
        {
          skill: 25.0,
          uncertainty: 6.0,
          confidenceMultiplier: 3.0,
          conservativeRating: 7.0,
          matchesPlayed: 5,
          lastUpdated: new Date(),
        },
        {
          skill: 25.0,
          uncertainty: 6.0,
          confidenceMultiplier: 3.0,
          conservativeRating: 7.0,
          matchesPlayed: 5,
          lastUpdated: new Date(),
        },
      ];

      const outcomes: MatchOutcome[] = [
        { playerId: 'player1', rank: 1 }, // Draw (same rank)
        { playerId: 'player2', rank: 1 }, // Draw (same rank)
      ];

      const updatedRatings = service.updateRatings(initialRatings, outcomes);
      
      expect(updatedRatings).toHaveLength(2);
      
      // Both players should have minimal skill changes for draw
      expect(Math.abs(updatedRatings[0].skill - initialRatings[0].skill)).toBeLessThan(1.0);
      expect(Math.abs(updatedRatings[1].skill - initialRatings[1].skill)).toBeLessThan(1.0);
      
      // Uncertainty should still decrease
      expect(updatedRatings[0].uncertainty).toBeLessThan(initialRatings[0].uncertainty);
      expect(updatedRatings[1].uncertainty).toBeLessThan(initialRatings[1].uncertainty);
    });
  });

  describe('generateSwissPairings', () => {
    it('should generate optimal pairings for even number of players', () => {
      const playerRatings = new Map<string, BayesianRating>([
        ['player1', {
          skill: 30.0,
          uncertainty: 4.0,
          confidenceMultiplier: 3.0,
          conservativeRating: 18.0,
          matchesPlayed: 20,
          lastUpdated: new Date(),
        }],
        ['player2', {
          skill: 28.0,
          uncertainty: 4.5,
          confidenceMultiplier: 3.0,
          conservativeRating: 14.5,
          matchesPlayed: 18,
          lastUpdated: new Date(),
        }],
        ['player3', {
          skill: 22.0,
          uncertainty: 5.0,
          confidenceMultiplier: 3.0,
          conservativeRating: 7.0,
          matchesPlayed: 15,
          lastUpdated: new Date(),
        }],
        ['player4', {
          skill: 20.0,
          uncertainty: 5.5,
          confidenceMultiplier: 3.0,
          conservativeRating: 3.5,
          matchesPlayed: 12,
          lastUpdated: new Date(),
        }],
      ]);

      const { pairings, qualities } = service.generateSwissPairings(playerRatings);
      
      expect(pairings).toHaveLength(2); // 4 players = 2 pairings
      expect(qualities).toHaveLength(2);
      
      // Each pairing should have 2 players
      pairings.forEach(pairing => {
        expect(pairing).toHaveLength(2);
      });
      
      // All players should be paired exactly once
      const allPairedPlayers = pairings.flat();
      expect(allPairedPlayers).toHaveLength(4);
      expect(new Set(allPairedPlayers).size).toBe(4); // No duplicates
    });

    it('should avoid previous pairings', () => {
      const playerRatings = new Map<string, BayesianRating>([
        ['player1', service.createInitialRating()],
        ['player2', service.createInitialRating()],
        ['player3', service.createInitialRating()],
        ['player4', service.createInitialRating()],
      ]);

      const previousPairings = [
        ['player1', 'player2'],
        ['player3', 'player4'],
      ];

      const { pairings } = service.generateSwissPairings(playerRatings, previousPairings);
      
      // Should not repeat previous pairings
      expect(pairings).not.toContainEqual(['player1', 'player2']);
      expect(pairings).not.toContainEqual(['player2', 'player1']);
      expect(pairings).not.toContainEqual(['player3', 'player4']);
      expect(pairings).not.toContainEqual(['player4', 'player3']);
    });
  });

  describe('getPlayerPercentile', () => {
    it('should calculate correct percentile', () => {
      const playerRating: BayesianRating = {
        skill: 25.0,
        uncertainty: 5.0,
        confidenceMultiplier: 3.0,
        conservativeRating: 10.0,
        matchesPlayed: 10,
        lastUpdated: new Date(),
      };

      const allRatings: BayesianRating[] = [
        { ...service.createInitialRating(), conservativeRating: 5.0 },
        { ...service.createInitialRating(), conservativeRating: 8.0 },
        playerRating, // 10.0
        { ...service.createInitialRating(), conservativeRating: 12.0 },
        { ...service.createInitialRating(), conservativeRating: 15.0 },
      ];

      const percentile = service.getPlayerPercentile(playerRating, allRatings);
      expect(percentile).toBe(40); // 2 out of 5 players below = 40th percentile
    });
  });
});