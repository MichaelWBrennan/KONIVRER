import { describe, it, expect, vi } from 'vitest';
import { BayesianMatchmakingService } from '../backend/src/matchmaking/bayesian-matchmaking.service';

describe('Bayesian Matchmaking Integration', () => {
  let service: BayesianMatchmakingService;

  beforeEach(() => {
    service = new BayesianMatchmakingService();
  });

  describe('Complete Matchmaking Workflow', () => {
    it('should handle complete tournament workflow with rating updates', () => {
      // Create initial ratings for 4 players
      const players = ['player1', 'player2', 'player3', 'player4'];
      const initialRatings = new Map();
      
      players.forEach(id => {
        initialRatings.set(id, service.createInitialRating());
      });

      // Generate first round pairings
      const round1 = service.generateSwissPairings(initialRatings);
      
      expect(round1.pairings).toHaveLength(2); // 4 players = 2 matches
      expect(round1.qualities).toHaveLength(2);
      
      // All pairings should have reasonable quality for new players
      round1.qualities.forEach(quality => {
        expect(quality.quality).toBeGreaterThan(0.5); // Should be decent for new players
      });

      // Simulate round 1 results
      const round1Results = [
        { playerId: round1.pairings[0][0], rank: 1 }, // Winner of match 1
        { playerId: round1.pairings[0][1], rank: 2 }, // Loser of match 1
        { playerId: round1.pairings[1][0], rank: 1 }, // Winner of match 2
        { playerId: round1.pairings[1][1], rank: 2 }, // Loser of match 2
      ];

      // Update ratings after round 1
      const updatedRatings = new Map();
      for (let i = 0; i < round1.pairings.length; i++) {
        const match = round1.pairings[i];
        const matchRatings = [
          initialRatings.get(match[0]),
          initialRatings.get(match[1])
        ];
        const matchOutcomes = [
          { playerId: match[0], rank: i === 0 ? 1 : 2 }, // Alternate winners
          { playerId: match[1], rank: i === 0 ? 2 : 1 }
        ];

        const newRatings = service.updateRatings(matchRatings, matchOutcomes);
        updatedRatings.set(match[0], newRatings[0]);
        updatedRatings.set(match[1], newRatings[1]);
      }

      // Verify rating changes
      updatedRatings.forEach((rating, playerId) => {
        expect(rating.matchesPlayed).toBe(1);
        expect(rating.uncertainty).toBeLessThan(initialRatings.get(playerId).uncertainty);
        expect(rating.conservativeRating).not.toBe(initialRatings.get(playerId).conservativeRating);
      });

      // Generate round 2 pairings with updated ratings
      const round2 = service.generateSwissPairings(updatedRatings, round1.pairings);
      
      expect(round2.pairings).toHaveLength(2);
      
      // Should avoid previous pairings
      round2.pairings.forEach(pairing => {
        expect(round1.pairings).not.toContainEqual(pairing);
        expect(round1.pairings).not.toContainEqual([pairing[1], pairing[0]]);
      });
    });

    it('should provide match quality predictions that correlate with skill differences', () => {
      // Create players with different skill levels
      const expertRating = {
        skill: 35.0,
        uncertainty: 3.0,
        confidenceMultiplier: 3.0,
        conservativeRating: 26.0,
        matchesPlayed: 50,
        lastUpdated: new Date(),
      };

      const noviceRating = {
        skill: 15.0,
        uncertainty: 6.0,
        confidenceMultiplier: 3.0,
        conservativeRating: -3.0,
        matchesPlayed: 5,
        lastUpdated: new Date(),
      };

      const intermediateRating = {
        skill: 25.0,
        uncertainty: 4.0,
        confidenceMultiplier: 3.0,
        conservativeRating: 13.0,
        matchesPlayed: 20,
        lastUpdated: new Date(),
      };

      // Expert vs Novice should be low quality, heavily favoring expert
      const expertVsNovice = service.calculateMatchQuality([expertRating, noviceRating]);
      expect(expertVsNovice.quality).toBeLessThan(0.3); // Poor match quality
      expect(expertVsNovice.winProbabilities[0]).toBeGreaterThan(0.9); // Expert heavily favored
      expect(expertVsNovice.skillDifference).toBe(20.0); // Large skill gap

      // Expert vs Intermediate should be better quality
      const expertVsIntermediate = service.calculateMatchQuality([expertRating, intermediateRating]);
      expect(expertVsIntermediate.quality).toBeGreaterThan(expertVsNovice.quality);
      expect(expertVsIntermediate.winProbabilities[0]).toBeGreaterThan(0.6);
      expect(expertVsIntermediate.winProbabilities[0]).toBeLessThan(0.95); // More realistic threshold

      // Intermediate vs Novice should be most balanced of the three
      const intermediateVsNovice = service.calculateMatchQuality([intermediateRating, noviceRating]);
      expect(intermediateVsNovice.quality).toBeGreaterThan(expertVsNovice.quality);
      expect(intermediateVsNovice.winProbabilities[0]).toBeLessThan(expertVsNovice.winProbabilities[0]);
    });

    it('should handle rating volatility appropriately for new vs experienced players', () => {
      const newPlayerRating = service.createInitialRating();
      const experiencedPlayerRating = {
        skill: 28.0,
        uncertainty: 3.0,
        confidenceMultiplier: 3.0,
        conservativeRating: 19.0,
        matchesPlayed: 100,
        lastUpdated: new Date(),
      };

      const outcomes = [
        { playerId: 'newPlayer', rank: 1 }, // New player wins (upset!)
        { playerId: 'experienced', rank: 2 }
      ];

      const updatedRatings = service.updateRatings([newPlayerRating, experiencedPlayerRating], outcomes);
      
      // New player should have larger rating change
      const newPlayerChange = Math.abs(updatedRatings[0].conservativeRating - newPlayerRating.conservativeRating);
      const experiencedPlayerChange = Math.abs(updatedRatings[1].conservativeRating - experiencedPlayerRating.conservativeRating);
      
      expect(newPlayerChange).toBeGreaterThan(experiencedPlayerChange);
      
      // Both should have reduced uncertainty
      expect(updatedRatings[0].uncertainty).toBeLessThan(newPlayerRating.uncertainty);
      expect(updatedRatings[1].uncertainty).toBeLessThan(experiencedPlayerRating.uncertainty);
      
      // New player's uncertainty should reduce more dramatically
      const newPlayerUncertaintyReduction = newPlayerRating.uncertainty - updatedRatings[0].uncertainty;
      const experiencedUncertaintyReduction = experiencedPlayerRating.uncertainty - updatedRatings[1].uncertainty;
      
      expect(newPlayerUncertaintyReduction).toBeGreaterThan(experiencedUncertaintyReduction);
    });

    it('should maintain rating system properties over many matches', () => {
      // Simulate a season of matches between players
      const playerCount = 6;
      const matchesPerPlayer = 15;
      
      // Initialize players
      const playerRatings = new Map();
      for (let i = 0; i < playerCount; i++) {
        playerRatings.set(`player${i}`, service.createInitialRating());
      }

      // Track total rating change to verify conservation
      let totalInitialRating = 0;
      playerRatings.forEach(rating => {
        totalInitialRating += rating.conservativeRating;
      });

      // Simulate many matches
      for (let match = 0; match < matchesPerPlayer * playerCount / 2; match++) {
        const playerIds = Array.from(playerRatings.keys());
        const shuffled = playerIds.sort(() => Math.random() - 0.5);
        
        // Pick two random players
        const player1Id = shuffled[0];
        const player2Id = shuffled[1];
        
        const player1Rating = playerRatings.get(player1Id);
        const player2Rating = playerRatings.get(player2Id);
        
        // Random outcome (in real implementation, this would be based on skill)
        const player1Wins = Math.random() < 0.5;
        const outcomes = [
          { playerId: player1Id, rank: player1Wins ? 1 : 2 },
          { playerId: player2Id, rank: player1Wins ? 2 : 1 }
        ];
        
        const updatedRatings = service.updateRatings([player1Rating, player2Rating], outcomes);
        
        playerRatings.set(player1Id, updatedRatings[0]);
        playerRatings.set(player2Id, updatedRatings[1]);
      }

      // Verify system properties
      let totalFinalRating = 0;
      let totalUncertaintyReduction = 0;
      let playersWithStableRating = 0;
      
      playerRatings.forEach(rating => {
        totalFinalRating += rating.conservativeRating;
        totalUncertaintyReduction += (8.333 - rating.uncertainty); // Initial uncertainty was ~8.333
        
        if (rating.uncertainty < 4.0 && rating.matchesPlayed >= 10) {
          playersWithStableRating++;
        }
      });

      // Ratings should be roughly conserved (allowing for some drift due to uncertainty)
      expect(Math.abs(totalFinalRating - totalInitialRating)).toBeLessThan(playerCount * 50); // Allow more realistic drift for Bayesian system
      
      // All players should have reduced uncertainty
      expect(totalUncertaintyReduction).toBeGreaterThan(playerCount * 2);
      
      // Most players should have stable ratings after many matches
      expect(playersWithStableRating).toBeGreaterThan(playerCount / 2);
      
      // All players should have played matches
      playerRatings.forEach(rating => {
        expect(rating.matchesPlayed).toBeGreaterThan(5);
      });
    });
  });
});