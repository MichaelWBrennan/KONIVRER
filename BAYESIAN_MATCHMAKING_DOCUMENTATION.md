# Bayesian Matchmaking System Documentation

## Overview

KONIVRER implements a sophisticated Bayesian skill rating system based on the TrueSkill algorithm, providing accurate player skill assessment and optimal matchmaking for competitive play. This system goes far beyond traditional ELO ratings by modeling skill uncertainty and providing probabilistic match quality predictions.

## Core Components

### 1. Bayesian Rating System (TrueSkill Implementation)

**Mathematical Foundation:**

- **Skill (μ)**: Player's estimated true skill level
- **Uncertainty (σ)**: Confidence interval around skill estimate
- **Conservative Rating**: μ - 3σ (used for matchmaking to avoid overconfident matches)
- **Dynamic Updates**: Ratings update after each match using Bayesian inference

**Key Features:**

- Initial rating: 25.0 skill, 8.33 uncertainty
- Uncertainty decreases with more matches (rating stabilizes)
- Skill updates based on expected vs actual performance
- Handles both wins/losses and draws appropriately

### 2. Match Quality Assessment

**Quality Score (0-1):**

- 0.8+: Excellent match (very close skill levels)
- 0.6-0.8: Good match (competitive but not perfect)
- 0.4-0.6: Fair match (noticeable skill difference)
- 0.0-0.4: Poor match (significant skill mismatch)

**Win Probability Calculation:**

```typescript
// Normal CDF based on skill difference and total uncertainty
winProbability = 0.5 * (1 + erf(skillDiff / (totalUncertainty * sqrt(2))));
```

### 3. Swiss Tournament Integration

**Enhanced Pairing Algorithm:**

1. Sort players by current tournament standing
2. Generate potential pairings within standing groups
3. Calculate match quality for each potential pairing
4. Optimize for highest overall match quality while avoiding repeats
5. Fall back to traditional Swiss if Bayesian pairing fails

**Benefits:**

- More competitive matches throughout tournament
- Better player experience with balanced opponents
- Automatic skill assessment and improvement over time

## API Reference

### Core Endpoints

#### `POST /api/matchmaking/ratings/update`

Update player ratings after match completion.

**Request Body:**

```json
{
  "format": "Standard",
  "outcomes": [
    { "playerId": "player1", "rank": 1 },
    { "playerId": "player2", "rank": 2 }
  ],
  "tournamentId": "optional-tournament-id",
  "matchId": "optional-match-id"
}
```

**Response:** Array of updated `PlayerRatingResponseDto`

#### `POST /api/matchmaking/pairings/generate`

Generate optimal pairings for tournament or casual play.

**Request Body:**

```json
{
  "playerIds": ["player1", "player2", "player3", "player4"],
  "format": "Standard",
  "previousPairings": [["player1", "player2"]],
  "tournamentId": "optional-tournament-id",
  "round": 2
}
```

**Response:** `GeneratePairingsResponseDto` with match quality metrics

#### `GET /api/matchmaking/ratings/{userId}/{format}`

Get player rating for specific format.

**Response:**

```json
{
  "id": "rating-id",
  "userId": "user-id",
  "format": "Standard",
  "skill": 28.5,
  "uncertainty": 4.2,
  "conservativeRating": 15.9,
  "matchesPlayed": 25,
  "winRate": 64.0,
  "trend": "rising",
  "isStable": true,
  "percentileRank": 75.5,
  "currentStreak": 3,
  "streakType": "win",
  "peakRating": 18.2
}
```

#### `GET /api/matchmaking/match-quality/{player1Id}/{player2Id}/{format}`

Calculate match quality between two players.

**Response:**

```json
{
  "quality": 0.82,
  "winProbabilities": [0.58, 0.42],
  "skillDifference": 2.3,
  "uncertaintyFactor": 8.7,
  "balanceCategory": "excellent"
}
```

#### `POST /api/matchmaking/simulate`

Simulate match outcomes for analysis and testing.

**Request Body:**

```json
{
  "player1Id": "player1",
  "player2Id": "player2",
  "format": "Standard",
  "numberOfGames": 1000,
  "includeDetailedLogs": false
}
```

**Response:** `SimulationResultDto` with win rates and statistics

#### `GET /api/matchmaking/leaderboard/{format}?limit=50`

Get format-specific leaderboard.

**Response:** Array of top-rated players with full rating information

## Frontend Components

### Mobile-First UI Components

All components are designed with mobile-first responsive principles and touch-optimized interfaces.

#### `PlayerRatingCard`

Displays comprehensive player rating information with visual indicators.

**Features:**

- Skill rating with confidence visualization
- Win rate and match history
- Rating trend indicators (rising/falling/stable)
- Streak tracking with emoji indicators
- Detailed stats in expandable view

**Props:**

```typescript
interface PlayerRatingCardProps {
  rating: PlayerRating;
  playerName?: string;
  showDetailed?: boolean;
  className?: string;
}
```

#### `MatchQualityIndicator`

Shows match balance and expected outcomes between players.

**Features:**

- Quality score visualization with color coding
- Win probability bars for each player
- Balance category (excellent/good/fair/poor)
- Skill difference and uncertainty metrics
- Compact mode for space-constrained layouts

#### `Leaderboard`

Format-specific player rankings with real-time updates.

**Features:**

- Top player rankings with medal indicators
- Mobile-optimized layout with key stats
- Real-time refresh capability
- Responsive design for all screen sizes
- Loading states and error handling

#### `MatchmakingPage`

Complete matchmaking interface with tabbed navigation.

**Features:**

- Personal rating view with insights
- Leaderboard integration
- Match finding with quality preview
- Format selection and switching
- Mobile-first tab navigation
- Progressive enhancement for larger screens

## Game Simulator Integration

### Enhanced Simulation Engine

The game simulator now incorporates Bayesian skill modeling for realistic match prediction and outcome generation.

**Simulation Features:**

- Skill-based outcome prediction using Bayesian ratings
- Randomness factors (mana screw, card draw luck, critical topdecks)
- Tournament simulation with rating progression
- Match duration estimation based on skill levels
- Detailed telemetry and accuracy tracking

**Simulation Parameters:**

```typescript
interface SimulationParameters {
  players: SimulationPlayer[];
  format: string;
  numberOfGames: number;
  includeSkillProgression?: boolean;
  includeDetailedLogs?: boolean;
  tournamentMode?: boolean;
  rounds?: number;
}
```

**Tournament Simulation:**

- Multi-round Swiss tournaments with dynamic pairings
- Real-time rating updates between rounds
- Final standings with rating changes
- Simulation insights and accuracy metrics

## Integration with Tournament System

### Automatic Rating Updates

When tournament matches are completed, the system automatically:

1. **Extracts match outcome** from submitted results
2. **Updates Bayesian ratings** for both players based on outcome
3. **Records telemetry** for system performance analysis
4. **Updates player statistics** including streaks and percentiles
5. **Falls back gracefully** if rating update fails

### Enhanced Swiss Pairings

Tournament organizers benefit from:

- **Higher quality matches** throughout the tournament
- **Reduced blowouts** with better skill matching
- **Improved player satisfaction** through competitive games
- **Automatic skill discovery** for new players
- **Historical pairing data** to avoid repeats optimally

## Database Schema

### PlayerRating Entity

```sql
CREATE TABLE player_ratings (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  format VARCHAR(50) NOT NULL,
  skill FLOAT DEFAULT 25.0,
  uncertainty FLOAT DEFAULT 8.333,
  confidence_multiplier FLOAT DEFAULT 3.0,
  conservative_rating FLOAT,
  matches_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  draws INT DEFAULT 0,
  peak_rating FLOAT,
  peak_rating_date TIMESTAMP,
  rating_history JSONB,
  percentile_rank FLOAT,
  current_streak INT DEFAULT 0,
  streak_type VARCHAR(10) DEFAULT 'none',
  longest_win_streak INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, format),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_player_ratings_format ON player_ratings(format);
CREATE INDEX idx_player_ratings_conservative ON player_ratings(conservative_rating DESC);
```

## Performance Considerations

### Optimization Strategies

1. **Database Indexing**: Indexes on format and conservative_rating for fast queries
2. **Caching**: Player ratings cached in memory for active tournaments
3. **Batch Updates**: Multiple rating updates processed together
4. **Fallback Systems**: Traditional pairing algorithms as backup
5. **Telemetry Buffering**: Non-blocking telemetry collection

### Scalability

- **Horizontal scaling**: Stateless services with database persistence
- **Load balancing**: API endpoints can be load balanced across instances
- **Database optimization**: Separate read replicas for leaderboards
- **Caching layers**: Redis for frequently accessed rating data

## Testing Strategy

### Test Coverage

1. **Unit Tests**: Mathematical accuracy of TrueSkill implementation
2. **Integration Tests**: Complete workflow from match to rating update
3. **Mobile UI Tests**: Responsive design and touch optimization
4. **Performance Tests**: Load testing with high concurrent usage
5. **Accuracy Tests**: Long-term simulation accuracy validation

### Current Test Suite

- **28 Mobile UI Tests**: All responsive design components
- **8 Bayesian Algorithm Tests**: Core mathematical functions
- **4 Integration Tests**: End-to-end workflow validation
- **Continuous Testing**: Automated test runs on all commits

## Usage Examples

### Basic Rating Retrieval

```typescript
// Get player's current rating
const rating = await matchmakingService.getPlayerRating("user123", "Standard");

console.log(`Player skill: ${rating.skill.toFixed(1)}`);
console.log(`Rating confidence: ${100 - rating.uncertainty * 10}%`);
console.log(`Win rate: ${rating.winRate}%`);
```

### Tournament Pairing Generation

```typescript
// Generate optimal pairings for tournament round
const pairingResult = await matchmakingService.generatePairings({
  playerIds: tournamentPlayers.map((p) => p.id),
  format: tournament.format,
  previousPairings: getPreviousPairings(tournament.id),
  tournamentId: tournament.id,
  round: currentRound,
});

console.log(`Generated ${pairingResult.pairings.length} pairings`);
console.log(
  `Average match quality: ${pairingResult.overallQuality.toFixed(2)}`
);
```

### Match Result Processing

```typescript
// Update ratings after match completion
const updatedRatings = await matchmakingService.updateRatings({
  format: "Standard",
  outcomes: [
    { playerId: winnerId, rank: 1 },
    { playerId: loserId, rank: 2 },
  ],
  matchId: match.id,
});

console.log(
  `Winner rating change: ${updatedRatings[0].conservativeRating - oldRating}`
);
```

## Advanced Features

### Simulation and Analysis

The system provides powerful simulation capabilities for:

- **Match outcome prediction** based on current ratings
- **Tournament bracket simulation** with rating progression
- **What-if analysis** for potential rating changes
- **System accuracy measurement** over time
- **Player development tracking** and insights

### Telemetry and Insights

Comprehensive telemetry collection enables:

- **Match quality optimization** through data analysis
- **Player engagement metrics** and retention analysis
- **System performance monitoring** and optimization
- **Prediction accuracy tracking** for continuous improvement
- **Automated anomaly detection** for potential issues

### Future Enhancements

The Bayesian matchmaking system is designed for extension:

- **Team-based ratings** for multiplayer formats
- **Format-specific adjustments** for different game types
- **Seasonal resets** with rating decay mechanisms
- **Advanced analytics dashboard** for tournament organizers
- **Machine learning integration** for enhanced predictions

## Conclusion

The KONIVRER Bayesian matchmaking system represents a significant advancement in competitive gaming infrastructure, providing mathematically rigorous skill assessment with intuitive mobile-first interfaces. The system delivers superior match quality, enhanced player engagement, and comprehensive analytics while maintaining backwards compatibility and graceful degradation.

Through careful integration with existing tournament systems and extensive testing, the platform now offers industry-leading matchmaking capabilities that will scale with the growing competitive community.
