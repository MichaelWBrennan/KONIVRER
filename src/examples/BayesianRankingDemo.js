/**
 * Demonstration of the new Bayesian TrueSkill ranking system
 * Shows the differences between ELO and Bayesian approaches
 */

import { RankingEngine } from '../engine/RankingEngine.js';

export class BayesianRankingDemo {
  constructor() {
    this.rankingEngine = new RankingEngine();
  }

  async runDemo() {
    console.log('🧠 Bayesian TrueSkill Ranking System Demo');
    console.log('==========================================');
    
    // Initialize the ranking engine
    await this.rankingEngine.init();
    
    // Show initial player state
    this.showPlayerState('Initial State');
    
    // Simulate a series of matches
    console.log('\n📊 Simulating Match Results...\n');
    
    // Match 1: Win against similar opponent
    const opponent1 = { rating: 1500, uncertainty: 350 };
    const result1 = this.rankingEngine.processGameResult(opponent1, 'win', 600, {
      deckArchetype: 'Aggro',
      damageDealt: 20,
      damageReceived: 15,
      optimalPlays: 8,
      totalPlays: 10
    });
    this.showMatchResult(1, opponent1, 'win', result1);
    
    // Match 2: Loss against stronger opponent
    const opponent2 = { rating: 1800, uncertainty: 200 };
    const result2 = this.rankingEngine.processGameResult(opponent2, 'loss', 450, {
      deckArchetype: 'Aggro',
      damageDealt: 12,
      damageReceived: 20,
      optimalPlays: 6,
      totalPlays: 10
    });
    this.showMatchResult(2, opponent2, 'loss', result2);
    
    // Match 3: Win against weaker opponent
    const opponent3 = { rating: 1200, uncertainty: 300 };
    const result3 = this.rankingEngine.processGameResult(opponent3, 'win', 300, {
      deckArchetype: 'Control',
      damageDealt: 20,
      damageReceived: 8,
      optimalPlays: 9,
      totalPlays: 10
    });
    this.showMatchResult(3, opponent3, 'win', result3);
    
    // Show final state
    this.showPlayerState('Final State');
    
    // Demonstrate match quality calculation
    this.demonstrateMatchQuality();
    
    // Show deck archetype performance
    this.showDeckArchetypePerformance();
    
    console.log('\n🎯 Key Advantages of Bayesian TrueSkill:');
    console.log('- Uncertainty tracking provides more accurate skill assessment');
    console.log('- Conservative rating prevents premature tier promotions');
    console.log('- Surprise factor helps identify upsets and skill improvements');
    console.log('- Deck archetype tracking enables meta analysis');
    console.log('- Better matchmaking through win probability prediction');
  }

  showPlayerState(title) {
    const rank = this.rankingEngine.getPlayerRank();
    console.log(`\n${title}:`);
    console.log(`Rating (μ): ${rank.rating.toFixed(1)}`);
    console.log(`Uncertainty (σ): ${rank.uncertainty.toFixed(1)}`);
    console.log(`Conservative Rating: ${rank.conservativeRating.toFixed(1)}`);
    console.log(`Tier: ${rank.tier.toUpperCase()} ${rank.division}`);
    console.log(`Confidence: ${(rank.confidence * 100).toFixed(1)}%`);
    console.log(`Record: ${rank.wins}W-${rank.losses}L-${rank.draws}D`);
  }

  showMatchResult(matchNumber, opponent, result, matchResult) {
    console.log(`Match ${matchNumber} vs Rating ${opponent.rating} (${result.toUpperCase()})`);
    console.log(`  Rating Change: ${matchResult.ratingChange > 0 ? '+' : ''}${matchResult.ratingChange.toFixed(1)}`);
    console.log(`  New Rating: ${matchResult.newRating.toFixed(1)} ± ${matchResult.newUncertainty.toFixed(1)}`);
    console.log(`  Win Probability: ${(matchResult.winProbability * 100).toFixed(1)}%`);
    console.log(`  Surprise Factor: ${(matchResult.surpriseFactor * 100).toFixed(1)}%`);
    console.log(`  Conservative Rating: ${matchResult.conservativeRating.toFixed(1)}`);
    console.log('');
  }

  demonstrateMatchQuality() {
    console.log('\n🎯 Match Quality Examples:');
    
    const opponents = [
      { rating: 1500, uncertainty: 100, name: 'Similar Skill, Low Uncertainty' },
      { rating: 1600, uncertainty: 350, name: 'Slightly Higher, High Uncertainty' },
      { rating: 1200, uncertainty: 50, name: 'Lower Skill, Very Confident' },
      { rating: 2000, uncertainty: 200, name: 'Much Higher Skill' }
    ];
    
    opponents.forEach(opponent => {
      const quality = this.rankingEngine.calculateMatchQuality(opponent);
      console.log(`${opponent.name}:`);
      console.log(`  Overall Quality: ${(quality.score * 100).toFixed(1)}%`);
      console.log(`  Win Probability: ${(quality.winProbability * 100).toFixed(1)}%`);
      console.log(`  Skill Difference: ${quality.skillDifference.toFixed(0)}`);
      console.log('');
    });
  }

  showDeckArchetypePerformance() {
    const playerData = this.rankingEngine.getBayesianPlayerData();
    
    if (playerData.deckArchetypes.length > 0) {
      console.log('\n🃏 Deck Archetype Performance:');
      playerData.deckArchetypes.forEach(deck => {
        const winRate = deck.wins / (deck.wins + deck.losses + deck.draws) * 100;
        console.log(`${deck.archetype}:`);
        console.log(`  Rating: ${deck.rating.toFixed(1)} ± ${deck.uncertainty.toFixed(1)}`);
        console.log(`  Games: ${deck.gamesPlayed} (${deck.wins}W-${deck.losses}L-${deck.draws}D)`);
        console.log(`  Win Rate: ${winRate.toFixed(1)}%`);
        console.log('');
      });
    }
  }

  // Compare ELO vs Bayesian for educational purposes
  compareWithELO(playerRating, opponentRating, result) {
    // Simple ELO calculation for comparison
    const kFactor = 32;
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const actualScore = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
    const eloChange = Math.round(kFactor * (actualScore - expectedScore));
    
    // Bayesian calculation
    const bayesianResult = this.rankingEngine.calculateTrueSkillUpdate(
      playerRating, 350, opponentRating, 350, result
    );
    
    console.log('\n📊 ELO vs Bayesian Comparison:');
    console.log(`ELO Change: ${eloChange > 0 ? '+' : ''}${eloChange}`);
    console.log(`Bayesian Change: ${bayesianResult.player.ratingChange > 0 ? '+' : ''}${bayesianResult.player.ratingChange.toFixed(1)}`);
    console.log(`Bayesian also tracks uncertainty: ${bayesianResult.player.newUncertainty.toFixed(1)}`);
    console.log(`Win Probability: ${(bayesianResult.winProbability * 100).toFixed(1)}%`);
  }
}

// Example usage:
// const demo = new BayesianRankingDemo();
// demo.runDemo();