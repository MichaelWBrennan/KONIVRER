/**
 * Adaptive Tournament System
 * 
 * Provides functionality for creating and managing tournaments that
 * automatically adapt to participant count, time constraints, and skill distribution
 */

/**
 * Determine optimal tournament format based on parameters
 * @param {Object} params - Tournament parameters
 * @returns {Object} Optimal tournament format
 */
export function determineOptimalFormat(params) {
  const {
    participantCount,
    timeConstraint, // in minutes
    skillDistribution = 'unknown', // 'narrow', 'wide', 'bimodal', 'unknown'
    formatPreference = null, // optional preference
    previousFormats = [], // previously used formats
    goals = { // weighted goals for optimization
      competitiveness: 1,
      timeEfficiency: 1,
      playerExperience: 1,
      variety: 0.5
    }
  } = params;
  
  // Available format types
  const formatTypes = [
    'single_elimination',
    'double_elimination',
    'swiss',
    'round_robin',
    'swiss_to_top_cut',
    'groups_to_bracket',
    'gauntlet',
    'ladder'
  ];
  
  // Calculate scores for each format
  const formatScores = formatTypes.map(format => {
    const score = calculateFormatScore(format, params);
    return { format, score };
  });
  
  // Sort by score (descending)
  formatScores.sort((a, b) => b.score - a.score);
  
  // Get top format
  const topFormat = formatScores[0].format;
  
  // Generate specific format details
  return generateFormatDetails(topFormat, params);
}

/**
 * Calculate score for a tournament format based on parameters
 * @param {string} format - Tournament format
 * @param {Object} params - Tournament parameters
 * @returns {number} Format score
 */
function calculateFormatScore(format, params) {
  const {
    participantCount,
    timeConstraint,
    skillDistribution,
    previousFormats,
    goals
  } = params;
  
  // Base scores for each format type
  const baseScores = {
    // Competitiveness scores (how well format identifies true skill)
    competitiveness: {
      'single_elimination': 0.6,
      'double_elimination': 0.8,
      'swiss': 0.85,
      'round_robin': 0.95,
      'swiss_to_top_cut': 0.9,
      'groups_to_bracket': 0.75,
      'gauntlet': 0.7,
      'ladder': 0.8
    },
    
    // Time efficiency scores (how quickly format completes)
    timeEfficiency: {
      'single_elimination': 0.9,
      'double_elimination': 0.7,
      'swiss': 0.6,
      'round_robin': 0.3,
      'swiss_to_top_cut': 0.65,
      'groups_to_bracket': 0.6,
      'gauntlet': 0.8,
      'ladder': 0.75
    },
    
    // Player experience scores (how enjoyable format is for players)
    playerExperience: {
      'single_elimination': 0.5,
      'double_elimination': 0.7,
      'swiss': 0.8,
      'round_robin': 0.7,
      'swiss_to_top_cut': 0.85,
      'groups_to_bracket': 0.8,
      'gauntlet': 0.6,
      'ladder': 0.75
    }
  };
  
  // Adjust scores based on participant count
  let participantFactor = 1.0;
  
  if (format === 'round_robin' && participantCount > 16) {
    participantFactor = 0.5; // Round robin is poor for large groups
  } else if (format === 'single_elimination' && participantCount < 8) {
    participantFactor = 0.7; // Single elim is poor for small groups
  } else if (format === 'swiss' && participantCount < 8) {
    participantFactor = 0.8; // Swiss is suboptimal for very small groups
  } else if (format === 'groups_to_bracket' && participantCount < 12) {
    participantFactor = 0.8; // Groups format needs enough participants
  }
  
  // Adjust scores based on time constraint
  let timeFactor = 1.0;
  
  if (timeConstraint < 120) { // Less than 2 hours
    if (format === 'round_robin' || format === 'double_elimination') {
      timeFactor = 0.6; // These formats take longer
    } else if (format === 'single_elimination') {
      timeFactor = 1.2; // Single elim is fast
    }
  } else if (timeConstraint > 300) { // More than 5 hours
    if (format === 'round_robin' || format === 'swiss') {
      timeFactor = 1.2; // These formats work well with more time
    }
  }
  
  // Adjust scores based on skill distribution
  let skillFactor = 1.0;
  
  if (skillDistribution === 'wide') {
    if (format === 'single_elimination') {
      skillFactor = 0.7; // Single elim can lead to mismatches with wide skill gaps
    } else if (format === 'swiss') {
      skillFactor = 1.2; // Swiss works well to match similar skill levels
    }
  } else if (skillDistribution === 'bimodal') {
    if (format === 'groups_to_bracket') {
      skillFactor = 1.2; // Groups can separate skill tiers effectively
    }
  }
  
  // Variety factor (lower score if format was recently used)
  let varietyFactor = 1.0;
  if (previousFormats.includes(format)) {
    const recencyIndex = previousFormats.lastIndexOf(format);
    const recency = (previousFormats.length - recencyIndex) / previousFormats.length;
    varietyFactor = 1.0 - (recency * 0.3); // Up to 30% penalty for recent use
  }
  
  // Calculate weighted score
  const competitivenessScore = baseScores.competitiveness[format] * goals.competitiveness;
  const timeEfficiencyScore = baseScores.timeEfficiency[format] * goals.timeEfficiency;
  const playerExperienceScore = baseScores.playerExperience[format] * goals.playerExperience;
  const varietyScore = varietyFactor * goals.variety;
  
  const totalWeight = goals.competitiveness + goals.timeEfficiency + goals.playerExperience + goals.variety;
  
  const baseScore = (
    competitivenessScore + 
    timeEfficiencyScore + 
    playerExperienceScore + 
    varietyScore
  ) / totalWeight;
  
  // Apply adjustment factors
  return baseScore * participantFactor * timeFactor * skillFactor;
}

/**
 * Generate detailed format configuration
 * @param {string} format - Tournament format
 * @param {Object} params - Tournament parameters
 * @returns {Object} Format details
 */
function generateFormatDetails(format, params) {
  const { participantCount, timeConstraint } = params;
  
  // Base configuration
  const config = {
    format,
    rounds: 0,
    matchesPerRound: 0,
    estimatedDuration: 0,
    playersAdvancing: 0,
    roundDurations: [],
    description: '',
    specialRules: []
  };
  
  // Average match duration in minutes
  const avgMatchDuration = 30;
  
  switch (format) {
    case 'single_elimination':
      config.rounds = Math.ceil(Math.log2(participantCount));
      config.matchesPerRound = Math.floor(participantCount / 2);
      config.estimatedDuration = config.rounds * avgMatchDuration;
      config.description = 'Single elimination bracket where losers are eliminated';
      break;
      
    case 'double_elimination':
      config.rounds = Math.ceil(Math.log2(participantCount)) * 2;
      config.matchesPerRound = Math.floor(participantCount / 2);
      config.estimatedDuration = config.rounds * avgMatchDuration;
      config.description = 'Double elimination bracket where players must lose twice to be eliminated';
      break;
      
    case 'swiss':
      config.rounds = Math.min(
        Math.ceil(Math.log2(participantCount)) + 1,
        Math.floor(timeConstraint / avgMatchDuration)
      );
      config.matchesPerRound = Math.floor(participantCount / 2);
      config.estimatedDuration = config.rounds * avgMatchDuration;
      config.description = 'Swiss format where players are paired against others with similar records';
      break;
      
    case 'round_robin':
      if (participantCount <= 8) {
        // Full round robin
        config.rounds = participantCount - 1;
        config.matchesPerRound = Math.floor(participantCount / 2);
      } else {
        // Split into groups
        const groupCount = Math.ceil(participantCount / 8);
        const groupSize = Math.ceil(participantCount / groupCount);
        config.rounds = groupSize - 1;
        config.matchesPerRound = Math.floor(participantCount / 2);
        config.specialRules.push(`Split into ${groupCount} groups of ${groupSize} players`);
      }
      config.estimatedDuration = config.rounds * avgMatchDuration;
      config.description = 'Round robin format where each player faces every other player';
      break;
      
    case 'swiss_to_top_cut':
      // Swiss rounds
      const swissRounds = Math.min(
        Math.ceil(Math.log2(participantCount)),
        Math.floor((timeConstraint * 0.7) / avgMatchDuration)
      );
      
      // Top cut size (power of 2)
      const topCutSize = Math.pow(2, Math.floor(Math.log2(participantCount * 0.25)));
      
      // Bracket rounds
      const bracketRounds = Math.log2(topCutSize);
      
      config.rounds = swissRounds + bracketRounds;
      config.matchesPerRound = Math.floor(participantCount / 2);
      config.playersAdvancing = topCutSize;
      config.estimatedDuration = config.rounds * avgMatchDuration;
      config.description = `${swissRounds} Swiss rounds followed by Top ${topCutSize} single elimination bracket`;
      break;
      
    case 'groups_to_bracket':
      // Calculate group count and size
      const groupCount = Math.ceil(participantCount / 6);
      const groupSize = Math.ceil(participantCount / groupCount);
      const advancingPerGroup = Math.min(2, Math.floor(groupSize / 2));
      const totalAdvancing = groupCount * advancingPerGroup;
      
      // Group rounds
      const groupRounds = groupSize - 1;
      
      // Bracket rounds
      const bracketRounds = Math.ceil(Math.log2(totalAdvancing));
      
      config.rounds = groupRounds + bracketRounds;
      config.matchesPerRound = Math.floor(participantCount / 2);
      config.playersAdvancing = totalAdvancing;
      config.estimatedDuration = config.rounds * avgMatchDuration;
      config.description = `${groupCount} groups of ${groupSize} players, top ${advancingPerGroup} from each advance to bracket`;
      break;
      
    case 'gauntlet':
      config.rounds = Math.min(
        participantCount - 1,
        Math.floor(timeConstraint / avgMatchDuration)
      );
      config.matchesPerRound = 1;
      config.estimatedDuration = config.rounds * avgMatchDuration;
      config.description = 'Gauntlet format where the winner stays and faces new challengers';
      break;
      
    case 'ladder':
      config.rounds = Math.floor(timeConstraint / avgMatchDuration);
      config.matchesPerRound = Math.floor(participantCount / 4); // Assuming 25% active at once
      config.estimatedDuration = timeConstraint;
      config.description = 'Ladder format where players challenge others near their position';
      break;
  }
  
  // Calculate round durations
  for (let i = 0; i < config.rounds; i++) {
    config.roundDurations.push(avgMatchDuration);
  }
  
  return config;
}

/**
 * Generate optimal pairings for a tournament round
 * @param {Array} players - Array of player data
 * @param {Object} options - Pairing options
 * @returns {Array} Optimal pairings
 */
export function generateOptimalPairings(players, options = {}) {
  const {
    format = 'swiss',
    round = 1,
    standings = [],
    previousMatches = [],
    maximizeInterestingMatchups = true,
    minimizeRepeatPairings = true
  } = options;
  
  // Different pairing strategies based on format
  switch (format) {
    case 'swiss':
      return generateSwissPairings(players, standings, previousMatches, {
        maximizeInterestingMatchups,
        minimizeRepeatPairings
      });
      
    case 'single_elimination':
    case 'double_elimination':
      return generateBracketPairings(players, standings, round);
      
    case 'round_robin':
      return generateRoundRobinPairings(players, round, previousMatches);
      
    default:
      return generateSwissPairings(players, standings, previousMatches, {
        maximizeInterestingMatchups,
        minimizeRepeatPairings
      });
  }
}

/**
 * Generate Swiss pairings
 * @param {Array} players - Array of player data
 * @param {Array} standings - Current standings
 * @param {Array} previousMatches - Previous match data
 * @param {Object} options - Pairing options
 * @returns {Array} Pairings
 */
function generateSwissPairings(players, standings, previousMatches, options) {
  const {
    maximizeInterestingMatchups,
    minimizeRepeatPairings
  } = options;
  
  // Group players by record
  const playersByRecord = {};
  
  standings.forEach(player => {
    const record = `${player.wins}-${player.losses}`;
    if (!playersByRecord[record]) {
      playersByRecord[record] = [];
    }
    playersByRecord[record].push(player);
  });
  
  // Sort records by wins (descending)
  const sortedRecords = Object.keys(playersByRecord).sort((a, b) => {
    const [winsA] = a.split('-').map(Number);
    const [winsB] = b.split('-').map(Number);
    return winsB - winsA;
  });
  
  // Generate pairings
  const pairings = [];
  const pairedPlayers = new Set();
  
  // First try to pair within same record groups
  sortedRecords.forEach(record => {
    const recordPlayers = playersByRecord[record].filter(p => !pairedPlayers.has(p.id));
    
    // Randomize players within record group
    const shuffledPlayers = [...recordPlayers].sort(() => Math.random() - 0.5);
    
    // Pair players within record group
    for (let i = 0; i < shuffledPlayers.length - 1; i += 2) {
      const player1 = shuffledPlayers[i];
      const player2 = shuffledPlayers[i + 1];
      
      // Skip if already paired
      if (pairedPlayers.has(player1.id) || pairedPlayers.has(player2.id)) {
        continue;
      }
      
      // Check if they've played before
      const havePlayed = previousMatches.some(match => 
        (match.player1Id === player1.id && match.player2Id === player2.id) ||
        (match.player1Id === player2.id && match.player2Id === player1.id)
      );
      
      // If minimizing repeats and they've played before, skip for now
      if (minimizeRepeatPairings && havePlayed) {
        continue;
      }
      
      // Add pairing
      pairings.push({ player1, player2 });
      pairedPlayers.add(player1.id);
      pairedPlayers.add(player2.id);
    }
  });
  
  // Handle remaining players by pairing across record groups
  const remainingPlayers = players.filter(p => !pairedPlayers.has(p.id));
  
  // Sort by record
  remainingPlayers.sort((a, b) => {
    const aRecord = standings.find(s => s.id === a.id) || { wins: 0, losses: 0 };
    const bRecord = standings.find(s => s.id === b.id) || { wins: 0, losses: 0 };
    return bRecord.wins - aRecord.wins;
  });
  
  // Pair remaining players
  for (let i = 0; i < remainingPlayers.length - 1; i += 2) {
    const player1 = remainingPlayers[i];
    const player2 = remainingPlayers[i + 1];
    
    pairings.push({ player1, player2 });
    pairedPlayers.add(player1.id);
    pairedPlayers.add(player2.id);
  }
  
  // Handle odd number of players with bye
  if (remainingPlayers.length % 2 === 1) {
    const byePlayer = remainingPlayers[remainingPlayers.length - 1];
    pairings.push({ player1: byePlayer, player2: null, isBye: true });
  }
  
  // If maximizing interesting matchups, sort pairings by interest level
  if (maximizeInterestingMatchups) {
    // Calculate interest score for each pairing
    pairings.forEach(pairing => {
      if (pairing.isBye) {
        pairing.interestScore = 0;
        return;
      }
      
      // Factors that make a matchup interesting
      const ratingDiff = Math.abs((pairing.player1.rating || 1500) - (pairing.player2.rating || 1500));
      const recordDiff = Math.abs(
        (standings.find(s => s.id === pairing.player1.id)?.wins || 0) - 
        (standings.find(s => s.id === pairing.player2.id)?.wins || 0)
      );
      
      // Different archetypes are more interesting
      const archetypeFactor = pairing.player1.deckArchetype === pairing.player2.deckArchetype ? 0.5 : 1.0;
      
      // Calculate interest score (higher is more interesting)
      pairing.interestScore = (
        (1 - Math.min(1, ratingDiff / 400)) * 0.4 + // Close ratings (40%)
        (1 - Math.min(1, recordDiff / 3)) * 0.3 + // Close records (30%)
        archetypeFactor * 0.3 // Different archetypes (30%)
      );
    });
    
    // Sort by interest score (descending)
    pairings.sort((a, b) => b.interestScore - a.interestScore);
  }
  
  return pairings;
}

/**
 * Generate bracket pairings
 * @param {Array} players - Array of player data
 * @param {Array} standings - Current standings
 * @param {number} round - Current round
 * @returns {Array} Pairings
 */
function generateBracketPairings(players, standings, round) {
  // For first round, seed players based on rating
  if (round === 1) {
    // Sort players by rating (descending)
    const seededPlayers = [...players].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    // Generate pairings (1 vs 16, 2 vs 15, etc.)
    const pairings = [];
    const n = seededPlayers.length;
    
    for (let i = 0; i < Math.floor(n / 2); i++) {
      const player1 = seededPlayers[i];
      const player2 = seededPlayers[n - i - 1];
      pairings.push({ player1, player2 });
    }
    
    // Handle odd number of players with bye
    if (n % 2 === 1) {
      const byePlayer = seededPlayers[Math.floor(n / 2)];
      pairings.push({ player1: byePlayer, player2: null, isBye: true });
    }
    
    return pairings;
  } else {
    // For subsequent rounds, pair winners from previous round
    // This would require bracket tracking which is beyond this example
    // In a real implementation, this would use the bracket state
    return [];
  }
}

/**
 * Generate round robin pairings
 * @param {Array} players - Array of player data
 * @param {number} round - Current round
 * @param {Array} previousMatches - Previous match data
 * @returns {Array} Pairings
 */
function generateRoundRobinPairings(players, round, previousMatches) {
  // Use circle method for round robin scheduling
  const n = players.length;
  const pairings = [];
  
  // If odd number of players, add a dummy player for byes
  const effectivePlayers = n % 2 === 0 ? players : [...players, null];
  const effectiveN = effectivePlayers.length;
  
  // Create a copy of players array
  const rotatingPlayers = [...effectivePlayers];
  
  // First player stays fixed, others rotate
  const fixedPlayer = rotatingPlayers[0];
  const rotating = rotatingPlayers.slice(1);
  
  // Rotate for the current round
  for (let i = 0; i < round - 1; i++) {
    rotating.unshift(rotating.pop());
  }
  
  // Generate pairings
  for (let i = 0; i < Math.floor(effectiveN / 2); i++) {
    const player1 = i === 0 ? fixedPlayer : rotating[i - 1];
    const player2 = rotating[rotating.length - i];
    
    // Skip if one player is the dummy (bye)
    if (player1 === null || player2 === null) {
      const nonNullPlayer = player1 || player2;
      pairings.push({ player1: nonNullPlayer, player2: null, isBye: true });
    } else {
      pairings.push({ player1, player2 });
    }
  }
  
  return pairings;
}

/**
 * Adjust tournament structure based on time constraints
 * @param {Object} tournament - Tournament data
 * @param {Object} timeConstraints - Time constraint data
 * @returns {Object} Adjusted tournament structure
 */
export function adjustForTimeConstraints(tournament, timeConstraints) {
  const {
    currentRound,
    totalRounds,
    remainingTime, // in minutes
    averageRoundDuration,
    format,
    players
  } = tournament;
  
  const {
    mustFinishBy, // boolean
    maxRounds = null
  } = timeConstraints;
  
  // Calculate expected remaining duration
  const remainingRounds = totalRounds - currentRound + 1;
  const expectedDuration = remainingRounds * averageRoundDuration;
  
  // If we have enough time, no adjustment needed
  if (expectedDuration <= remainingTime) {
    return tournament;
  }
  
  // We need to adjust the tournament structure
  const adjustedTournament = { ...tournament };
  
  // Strategies for adjustment
  if (format === 'swiss' || format === 'swiss_to_top_cut') {
    // Reduce number of Swiss rounds
    const maxPossibleRounds = Math.floor(remainingTime / averageRoundDuration);
    const newTotalRounds = currentRound - 1 + maxPossibleRounds;
    
    adjustedTournament.totalRounds = Math.min(
      newTotalRounds,
      maxRounds || Infinity
    );
    
    // If this is swiss_to_top_cut, we might need to adjust the cut size
    if (format === 'swiss_to_top_cut') {
      const swissRounds = adjustedTournament.swissRounds;
      const remainingSwissRounds = swissRounds - currentRound + 1;
      
      if (remainingSwissRounds > maxPossibleRounds) {
        // Reduce swiss rounds
        adjustedTournament.swissRounds = currentRound - 1 + maxPossibleRounds;
        
        // Adjust top cut size if needed
        if (mustFinishBy) {
          const bracketRounds = adjustedTournament.totalRounds - adjustedTournament.swissRounds;
          const newTopCutSize = Math.pow(2, bracketRounds);
          adjustedTournament.topCutSize = newTopCutSize;
        }
      }
    }
  } else if (format === 'round_robin') {
    // For round robin, we might need to split into more groups
    const currentGroups = adjustedTournament.groups || [{ players }];
    const totalMatches = currentGroups.reduce((sum, group) => {
      const n = group.players.length;
      return sum + (n * (n - 1)) / 2;
    }, 0);
    
    const matchesPerRound = totalMatches / remainingRounds;
    const maxPossibleMatches = Math.floor(remainingTime / (averageRoundDuration / matchesPerRound));
    
    if (maxPossibleMatches < totalMatches) {
      // Need to reduce matches - split into more groups
      const currentGroupCount = currentGroups.length;
      const newGroupCount = Math.ceil(currentGroupCount * (totalMatches / maxPossibleMatches));
      
      // Reorganize groups
      const newGroups = [];
      const playersPerGroup = Math.ceil(players.length / newGroupCount);
      
      for (let i = 0; i < newGroupCount; i++) {
        const start = i * playersPerGroup;
        const end = Math.min(start + playersPerGroup, players.length);
        newGroups.push({
          players: players.slice(start, end)
        });
      }
      
      adjustedTournament.groups = newGroups;
      
      // Recalculate rounds
      const maxGroupSize = Math.max(...newGroups.map(g => g.players.length));
      adjustedTournament.totalRounds = maxGroupSize - 1;
    }
  } else if (format === 'double_elimination') {
    // For double elimination, we could convert to single elimination
    if (mustFinishBy) {
      adjustedTournament.format = 'single_elimination';
      
      // Recalculate rounds
      adjustedTournament.totalRounds = Math.ceil(Math.log2(players.length));
    }
  }
  
  return adjustedTournament;
}

/**
 * Generate balanced brackets for a tournament
 * @param {Array} players - Array of player data
 * @param {Object} options - Bracket options
 * @returns {Object} Bracket structure
 */
export function generateBalancedBrackets(players, options = {}) {
  const {
    format = 'single_elimination',
    seedMethod = 'rating', // 'rating', 'random', 'standings'
    balanceMethod = 'standard', // 'standard', 'regional', 'archetype'
    standings = [],
    regions = [],
    minimizeRematches = true,
    previousMatches = []
  } = options;
  
  // Seed players
  let seededPlayers = [];
  
  switch (seedMethod) {
    case 'rating':
      seededPlayers = [...players].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
      
    case 'standings':
      seededPlayers = [...players].sort((a, b) => {
        const aStanding = standings.find(s => s.id === a.id) || { wins: 0, losses: 0 };
        const bStanding = standings.find(s => s.id === b.id) || { wins: 0, losses: 0 };
        return bStanding.wins - aStanding.wins;
      });
      break;
      
    case 'random':
      seededPlayers = [...players].sort(() => Math.random() - 0.5);
      break;
  }
  
  // Apply balance method
  let balancedPlayers = [];
  
  switch (balanceMethod) {
    case 'regional':
      // Balance by region to avoid regional matchups in early rounds
      balancedPlayers = balanceByAttribute(seededPlayers, player => 
        regions.find(r => r.id === player.regionId)?.name || 'Unknown'
      );
      break;
      
    case 'archetype':
      // Balance by deck archetype to avoid mirror matches in early rounds
      balancedPlayers = balanceByAttribute(seededPlayers, player => 
        player.deckArchetype || 'Unknown'
      );
      break;
      
    case 'standard':
    default:
      // Standard bracket seeding (1 vs 16, 8 vs 9, etc.)
      balancedPlayers = standardBracketSeeding(seededPlayers);
      break;
  }
  
  // If minimizing rematches, adjust bracket to avoid early rematches
  if (minimizeRematches && previousMatches.length > 0) {
    balancedPlayers = minimizeEarlyRematches(balancedPlayers, previousMatches);
  }
  
  // Generate bracket structure
  const bracket = generateBracketStructure(balancedPlayers, format);
  
  return bracket;
}

/**
 * Balance players by attribute to avoid early matchups with same attribute
 * @param {Array} players - Seeded players
 * @param {Function} getAttributeFn - Function to get attribute from player
 * @returns {Array} Balanced players
 */
function balanceByAttribute(players, getAttributeFn) {
  // Count occurrences of each attribute
  const attributeCounts = {};
  players.forEach(player => {
    const attr = getAttributeFn(player);
    attributeCounts[attr] = (attributeCounts[attr] || 0) + 1;
  });
  
  // Group players by attribute
  const playersByAttribute = {};
  players.forEach(player => {
    const attr = getAttributeFn(player);
    if (!playersByAttribute[attr]) {
      playersByAttribute[attr] = [];
    }
    playersByAttribute[attr].push(player);
  });
  
  // Calculate bracket size (next power of 2)
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(players.length)));
  
  // Distribute players across bracket
  const result = new Array(bracketSize).fill(null);
  
  // Sort attributes by frequency (descending)
  const sortedAttributes = Object.keys(attributeCounts).sort(
    (a, b) => attributeCounts[b] - attributeCounts[a]
  );
  
  // Standard bracket positions (1, 16, 8, 9, 4, 13, etc.)
  const positions = standardBracketPositions(bracketSize);
  
  // Assign players to positions
  let positionIndex = 0;
  
  // First, distribute the most common attributes
  sortedAttributes.forEach(attr => {
    const attrPlayers = playersByAttribute[attr];
    
    // Skip if no players with this attribute
    if (!attrPlayers || attrPlayers.length === 0) return;
    
    // Distribute players of this attribute evenly
    for (let i = 0; i < attrPlayers.length; i++) {
      // Find next available position
      while (positionIndex < positions.length && result[positions[positionIndex]] !== null) {
        positionIndex++;
      }
      
      // If we've run out of positions, break
      if (positionIndex >= positions.length) break;
      
      // Assign player to position
      result[positions[positionIndex]] = attrPlayers[i];
      positionIndex++;
    }
  });
  
  // Fill any remaining positions with null (byes)
  for (let i = 0; i < result.length; i++) {
    if (result[i] === null) {
      result[i] = { isBye: true };
    }
  }
  
  return result.filter(p => !p.isBye);
}

/**
 * Generate standard bracket seeding positions
 * @param {number} size - Bracket size
 * @returns {Array} Bracket positions
 */
function standardBracketPositions(size) {
  const positions = [];
  
  // Generate positions recursively
  function generatePositions(start, end, positions) {
    if (start === end) {
      positions.push(start);
      return;
    }
    
    const mid = Math.floor((start + end) / 2);
    generatePositions(start, mid, positions);
    generatePositions(mid + 1, end, positions);
  }
  
  generatePositions(0, size - 1, positions);
  return positions;
}

/**
 * Apply standard bracket seeding
 * @param {Array} players - Seeded players
 * @returns {Array} Balanced players
 */
function standardBracketSeeding(players) {
  const n = players.length;
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(n)));
  const result = new Array(bracketSize).fill(null);
  
  // Standard bracket positions
  const positions = standardBracketPositions(bracketSize);
  
  // Assign players to positions
  for (let i = 0; i < n; i++) {
    result[positions[i]] = players[i];
  }
  
  // Fill remaining positions with byes
  for (let i = 0; i < result.length; i++) {
    if (result[i] === null) {
      result[i] = { isBye: true };
    }
  }
  
  return result.filter(p => !p.isBye);
}

/**
 * Minimize early rematches in bracket
 * @param {Array} players - Balanced players
 * @param {Array} previousMatches - Previous match data
 * @returns {Array} Adjusted players
 */
function minimizeEarlyRematches(players, previousMatches) {
  // Create a map of previous matchups
  const matchupMap = {};
  
  previousMatches.forEach(match => {
    const id1 = match.player1Id;
    const id2 = match.player2Id;
    
    if (!matchupMap[id1]) matchupMap[id1] = new Set();
    if (!matchupMap[id2]) matchupMap[id2] = new Set();
    
    matchupMap[id1].add(id2);
    matchupMap[id2].add(id1);
  });
  
  // Check for potential early rematches
  const n = players.length;
  const rounds = Math.ceil(Math.log2(n));
  
  // For first 2 rounds, check if opponents have played before
  for (let round = 1; round <= Math.min(2, rounds); round++) {
    const matchesInRound = Math.pow(2, rounds - round);
    
    for (let i = 0; i < matchesInRound; i++) {
      const idx1 = i * 2;
      const idx2 = i * 2 + 1;
      
      // Skip if out of bounds
      if (idx1 >= n || idx2 >= n) continue;
      
      const player1 = players[idx1];
      const player2 = players[idx2];
      
      // Skip if either is a bye
      if (player1.isBye || player2.isBye) continue;
      
      // Check if they've played before
      if (matchupMap[player1.id]?.has(player2.id)) {
        // Try to swap with another player in the same half of the bracket
        const halfSize = Math.pow(2, rounds - 1);
        const isFirstHalf = i < halfSize / 2;
        const swapRange = isFirstHalf ? [0, halfSize - 1] : [halfSize, n - 1];
        
        // Find a valid swap
        for (let j = swapRange[0]; j <= swapRange[1]; j++) {
          // Skip the current players
          if (j === idx1 || j === idx2) continue;
          
          const potentialSwap = players[j];
          
          // Skip byes
          if (potentialSwap.isBye) continue;
          
          // Check if swapping would create a new rematch
          const wouldCreateRematch = (
            (j % 2 === 0 && j + 1 < n && matchupMap[potentialSwap.id]?.has(players[j + 1].id)) ||
            (j % 2 === 1 && matchupMap[potentialSwap.id]?.has(players[j - 1].id))
          );
          
          if (!wouldCreateRematch) {
            // Swap players
            [players[idx2], players[j]] = [players[j], players[idx2]];
            break;
          }
        }
      }
    }
  }
  
  return players;
}

/**
 * Generate bracket structure
 * @param {Array} players - Balanced players
 * @param {string} format - Tournament format
 * @returns {Object} Bracket structure
 */
function generateBracketStructure(players, format) {
  const n = players.length;
  const rounds = Math.ceil(Math.log2(n));
  
  // Generate matches for first round
  const firstRoundMatches = [];
  
  for (let i = 0; i < Math.floor(n / 2); i++) {
    const player1 = players[i * 2];
    const player2 = i * 2 + 1 < n ? players[i * 2 + 1] : { isBye: true };
    
    firstRoundMatches.push({
      player1,
      player2,
      round: 1,
      matchNumber: i + 1,
      isBye: player2.isBye
    });
  }
  
  // Generate bracket structure
  const bracket = {
    format,
    rounds,
    matches: firstRoundMatches
  };
  
  // For double elimination, add losers bracket
  if (format === 'double_elimination') {
    bracket.losersBracket = {
      rounds: rounds,
      matches: []
    };
  }
  
  return bracket;
}