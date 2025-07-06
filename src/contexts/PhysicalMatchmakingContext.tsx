/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode
} from 'react';
import { useNavigate } from 'react-router-dom';
import { RankingEngine } from '../engine/RankingEngine';
import { TournamentEngine } from '../engine/TournamentEngine';
import { AnalyticsEngine } from '../engine/AnalyticsEngine';

// Types for physical matchmaking
interface Player {
  id: string;
  name: string;
  rank: number;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  decks: Deck[];
  currentDeck?: Deck;
  tournamentResults: TournamentResult[];
  lastActive: Date;
  [key: string]: any;
}

interface Deck {
  id: string;
  name: string;
  archetype: string;
  cards: Card[];
  mainColors: string[];
  owner: string;
  wins: number;
  losses: number;
  draws: number;
  [key: string]: any;
}

interface Card {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
}

interface Match {
  id: string;
  player1: string;
  player2: string;
  player1Deck: string;
  player2Deck: string;
  winner: string | null;
  rounds: Round[];
  status: 'pending' | 'active' | 'completed' | 'dropped';
  startTime: Date;
  endTime?: Date;
  tournamentId?: string;
  [key: string]: any;
}

interface Round {
  winner: string | null;
  player1Score: number;
  player2Score: number;
  notes?: string;
  [key: string]: any;
}

interface Tournament {
  id: string;
  name: string;
  format: string;
  players: string[];
  matches: string[];
  rounds: number;
  currentRound: number;
  status: 'pending' | 'active' | 'completed';
  startDate: Date;
  endDate?: Date;
  standings: TournamentStanding[];
  [key: string]: any;
}

interface TournamentStanding {
  playerId: string;
  rank: number;
  wins: number;
  losses: number;
  draws: number;
  matchPoints: number;
  tiebreakers: {
    opponentMatchWinPercentage: number;
    gameWinPercentage: number;
    opponentGameWinPercentage: number;
    [key: string]: number;
  };
  [key: string]: any;
}

interface TournamentResult {
  tournamentId: string;
  tournamentName: string;
  placement: number;
  wins: number;
  losses: number;
  draws: number;
  [key: string]: any;
}

interface MetaBreakdown {
  archetypes: Record<string, {
    count: number;
    percentage: number;
    winRate: number;
    popularity: number[];
    matchups: Record<string, {
      wins: number;
      losses: number;
      draws: number;
      winRate: number;
    }>;
  }>;
  mostPopular: string[];
  highestWinRate: string[];
  [key: string]: any;
}

interface PlayerPerformance {
  rankings: Record<string, {
    rank: number;
    elo: number;
    winRate: number;
    recentResults: {
      wins: number;
      losses: number;
      draws: number;
    };
    bestDeck: string;
    worstMatchup: string;
  }>;
  topPlayers: string[];
  mostImproved: string[];
  [key: string]: any;
}

interface MatchupMatrix {
  data: Record<string, Record<string, {
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    games: number;
  }>>;
  favorableMatchups: Record<string, string[]>;
  unfavorableMatchups: Record<string, string[]>;
  [key: string]: any;
}

interface ConfidenceIntervals {
  deckWinRates: Record<string, {
    mean: number;
    lower95: number;
    upper95: number;
    sampleSize: number;
  }>;
  playerWinRates: Record<string, {
    mean: number;
    lower95: number;
    upper95: number;
    sampleSize: number;
  }>;
  [key: string]: any;
}

interface TrendData {
  metaShifts: {
    date: Date;
    archetypes: Record<string, number>;
  }[];
  playerRankings: {
    date: Date;
    rankings: Record<string, number>;
  }[];
  [key: string]: any;
}

// Advanced analytics and ML utilities
class AdvancedAnalytics {
  private metaBreakdown: MetaBreakdown;
  private playerPerformance: PlayerPerformance;
  private matchupMatrix: MatchupMatrix;
  private confidenceIntervals: ConfidenceIntervals;
  private trendData: TrendData;

  constructor() {
    this.metaBreakdown = {
      archetypes: {},
      mostPopular: [],
      highestWinRate: []
    };
    
    this.playerPerformance = {
      rankings: {},
      topPlayers: [],
      mostImproved: []
    };
    
    this.matchupMatrix = {
      data: {},
      favorableMatchups: {},
      unfavorableMatchups: {}
    };
    
    this.confidenceIntervals = {
      deckWinRates: {},
      playerWinRates: {}
    };
    
    this.trendData = {
      metaShifts: [],
      playerRankings: []
    };
  }

  // Analyze meta breakdown by deck archetype
  analyzeMetaBreakdown(matches: Match[], players: Player[]): MetaBreakdown {
    const deckCounts: Record<string, number> = {};
    const deckWins: Record<string, number> = {};
    const deckLosses: Record<string, number> = {};
    let totalDecks = 0;

    // Count deck occurrences and results
    matches.forEach(match => {
      if (match.status !== 'completed') return;
      
      // Get player decks
      const player1 = players.find(p => p.id === match.player1);
      const player2 = players.find(p => p.id === match.player2);
      
      if (!player1 || !player2) return;
      
      const deck1 = player1.decks.find(d => d.id === match.player1Deck);
      const deck2 = player2.decks.find(d => d.id === match.player2Deck);
      
      if (!deck1 || !deck2) return;
      
      // Count archetypes
      const archetype1 = deck1.archetype;
      const archetype2 = deck2.archetype;
      
      deckCounts[archetype1] = (deckCounts[archetype1] || 0) + 1;
      deckCounts[archetype2] = (deckCounts[archetype2] || 0) + 1;
      totalDecks += 2;
      
      // Count wins/losses
      if (match.winner === match.player1) {
        deckWins[archetype1] = (deckWins[archetype1] || 0) + 1;
        deckLosses[archetype2] = (deckLosses[archetype2] || 0) + 1;
      } else if (match.winner === match.player2) {
        deckWins[archetype2] = (deckWins[archetype2] || 0) + 1;
        deckLosses[archetype1] = (deckLosses[archetype1] || 0) + 1;
      }
    });
    
    // Calculate percentages and win rates
    const archetypes: Record<string, {
      count: number;
      percentage: number;
      winRate: number;
      popularity: number[];
      matchups: Record<string, {
        wins: number;
        losses: number;
        draws: number;
        winRate: number;
      }>;
    }> = {};
    
    Object.keys(deckCounts).forEach(archetype => {
      const count = deckCounts[archetype];
      const wins = deckWins[archetype] || 0;
      const losses = deckLosses[archetype] || 0;
      const totalGames = wins + losses;
      const winRate = totalGames > 0 ? wins / totalGames : 0;
      
      archetypes[archetype] = {
        count,
        percentage: totalDecks > 0 ? count / totalDecks : 0,
        winRate,
        popularity: [count], // Will be expanded with historical data
        matchups: {}
      };
    });
    
    // Calculate matchups
    matches.forEach(match => {
      if (match.status !== 'completed') return;
      
      const player1 = players.find(p => p.id === match.player1);
      const player2 = players.find(p => p.id === match.player2);
      
      if (!player1 || !player2) return;
      
      const deck1 = player1.decks.find(d => d.id === match.player1Deck);
      const deck2 = player2.decks.find(d => d.id === match.player2Deck);
      
      if (!deck1 || !deck2) return;
      
      const archetype1 = deck1.archetype;
      const archetype2 = deck2.archetype;
      
      // Initialize matchup data if needed
      if (!archetypes[archetype1].matchups[archetype2]) {
        archetypes[archetype1].matchups[archetype2] = {
          wins: 0,
          losses: 0,
          draws: 0,
          winRate: 0
        };
      }
      
      if (!archetypes[archetype2].matchups[archetype1]) {
        archetypes[archetype2].matchups[archetype1] = {
          wins: 0,
          losses: 0,
          draws: 0,
          winRate: 0
        };
      }
      
      // Update matchup data
      if (match.winner === match.player1) {
        archetypes[archetype1].matchups[archetype2].wins++;
        archetypes[archetype2].matchups[archetype1].losses++;
      } else if (match.winner === match.player2) {
        archetypes[archetype2].matchups[archetype1].wins++;
        archetypes[archetype1].matchups[archetype2].losses++;
      } else {
        archetypes[archetype1].matchups[archetype2].draws++;
        archetypes[archetype2].matchups[archetype1].draws++;
      }
    });
    
    // Calculate matchup win rates
    Object.keys(archetypes).forEach(archetype => {
      Object.keys(archetypes[archetype].matchups).forEach(opponent => {
        const matchup = archetypes[archetype].matchups[opponent];
        const totalGames = matchup.wins + matchup.losses + matchup.draws;
        matchup.winRate = totalGames > 0 ? 
          (matchup.wins + matchup.draws * 0.5) / totalGames : 0;
      });
    });
    
    // Find most popular archetypes
    const mostPopular = Object.keys(archetypes)
      .sort((a, b) => archetypes[b].count - archetypes[a].count)
      .slice(0, 5);
    
    // Find highest win rate archetypes (minimum 10 matches)
    const highestWinRate = Object.keys(archetypes)
      .filter(archetype => (deckWins[archetype] || 0) + (deckLosses[archetype] || 0) >= 10)
      .sort((a, b) => archetypes[b].winRate - archetypes[a].winRate)
      .slice(0, 5);
    
    this.metaBreakdown = {
      archetypes,
      mostPopular,
      highestWinRate
    };
    
    return this.metaBreakdown;
  }

  // Analyze player performance
  analyzePlayerPerformance(players: Player[], matches: Match[]): PlayerPerformance {
    const rankings: Record<string, {
      rank: number;
      elo: number;
      winRate: number;
      recentResults: {
        wins: number;
        losses: number;
        draws: number;
      };
      bestDeck: string;
      worstMatchup: string;
    }> = {};
    
    // Calculate player stats
    players.forEach(player => {
      // Get player matches
      const playerMatches = matches.filter(
        m => (m.player1 === player.id || m.player2 === player.id) && m.status === 'completed'
      );
      
      // Calculate win rate
      const wins = playerMatches.filter(
        m => m.winner === player.id
      ).length;
      
      const totalMatches = playerMatches.length;
      const winRate = totalMatches > 0 ? wins / totalMatches : 0;
      
      // Calculate recent results (last 10 matches)
      const recentMatches = [...playerMatches]
        .sort((a, b) => new Date(b.endTime || 0).getTime() - new Date(a.endTime || 0).getTime())
        .slice(0, 10);
      
      const recentWins = recentMatches.filter(m => m.winner === player.id).length;
      const recentLosses = recentMatches.filter(
        m => m.winner !== null && m.winner !== player.id
      ).length;
      const recentDraws = recentMatches.filter(m => m.winner === null).length;
      
      // Find best deck
      const deckPerformance: Record<string, { wins: number; total: number }> = {};
      
      playerMatches.forEach(match => {
        const deckId = match.player1 === player.id ? match.player1Deck : match.player2Deck;
        
        if (!deckPerformance[deckId]) {
          deckPerformance[deckId] = { wins: 0, total: 0 };
        }
        
        deckPerformance[deckId].total++;
        
        if (match.winner === player.id) {
          deckPerformance[deckId].wins++;
        }
      });
      
      let bestDeck = '';
      let bestDeckWinRate = 0;
      
      Object.keys(deckPerformance).forEach(deckId => {
        const { wins, total } = deckPerformance[deckId];
        if (total >= 5) { // Minimum 5 matches
          const deckWinRate = wins / total;
          if (deckWinRate > bestDeckWinRate) {
            bestDeckWinRate = deckWinRate;
            bestDeck = deckId;
          }
        }
      });
      
      // Find worst matchup
      const opponentPerformance: Record<string, { losses: number; total: number }> = {};
      
      playerMatches.forEach(match => {
        const opponentId = match.player1 === player.id ? match.player2 : match.player1;
        
        if (!opponentPerformance[opponentId]) {
          opponentPerformance[opponentId] = { losses: 0, total: 0 };
        }
        
        opponentPerformance[opponentId].total++;
        
        if (match.winner !== null && match.winner !== player.id) {
          opponentPerformance[opponentId].losses++;
        }
      });
      
      let worstMatchup = '';
      let worstMatchupLossRate = 0;
      
      Object.keys(opponentPerformance).forEach(opponentId => {
        const { losses, total } = opponentPerformance[opponentId];
        if (total >= 3) { // Minimum 3 matches
          const lossRate = losses / total;
          if (lossRate > worstMatchupLossRate) {
            worstMatchupLossRate = lossRate;
            worstMatchup = opponentId;
          }
        }
      });
      
      // Store player performance data
      rankings[player.id] = {
        rank: player.rank,
        elo: player.elo,
        winRate,
        recentResults: {
          wins: recentWins,
          losses: recentLosses,
          draws: recentDraws
        },
        bestDeck: bestDeck || 'Unknown',
        worstMatchup: worstMatchup || 'Unknown'
      };
    });
    
    // Find top players by Elo
    const topPlayers = Object.keys(rankings)
      .sort((a, b) => rankings[b].elo - rankings[a].elo)
      .slice(0, 10);
    
    // Find most improved players (would need historical data)
    const mostImproved: string[] = [];
    
    this.playerPerformance = {
      rankings,
      topPlayers,
      mostImproved
    };
    
    return this.playerPerformance;
  }

  // Create matchup matrix
  createMatchupMatrix(matches: Match[], players: Player[]): MatchupMatrix {
    const data: Record<string, Record<string, {
      wins: number;
      losses: number;
      draws: number;
      winRate: number;
      games: number;
    }>> = {};
    
    // Initialize matrix with all archetypes
    const archetypes = new Set<string>();
    
    players.forEach(player => {
      player.decks.forEach(deck => {
        archetypes.add(deck.archetype);
      });
    });
    
    archetypes.forEach(archetype1 => {
      data[archetype1] = {};
      
      archetypes.forEach(archetype2 => {
        data[archetype1][archetype2] = {
          wins: 0,
          losses: 0,
          draws: 0,
          winRate: 0,
          games: 0
        };
      });
    });
    
    // Populate matrix with match data
    matches.forEach(match => {
      if (match.status !== 'completed') return;
      
      const player1 = players.find(p => p.id === match.player1);
      const player2 = players.find(p => p.id === match.player2);
      
      if (!player1 || !player2) return;
      
      const deck1 = player1.decks.find(d => d.id === match.player1Deck);
      const deck2 = player2.decks.find(d => d.id === match.player2Deck);
      
      if (!deck1 || !deck2) return;
      
      const archetype1 = deck1.archetype;
      const archetype2 = deck2.archetype;
      
      // Update matchup data
      data[archetype1][archetype2].games++;
      data[archetype2][archetype1].games++;
      
      if (match.winner === match.player1) {
        data[archetype1][archetype2].wins++;
        data[archetype2][archetype1].losses++;
      } else if (match.winner === match.player2) {
        data[archetype2][archetype1].wins++;
        data[archetype1][archetype2].losses++;
      } else {
        data[archetype1][archetype2].draws++;
        data[archetype2][archetype1].draws++;
      }
    });
    
    // Calculate win rates
    archetypes.forEach(archetype1 => {
      archetypes.forEach(archetype2 => {
        const matchup = data[archetype1][archetype2];
        const totalGames = matchup.wins + matchup.losses + matchup.draws;
        
        if (totalGames > 0) {
          matchup.winRate = (matchup.wins + matchup.draws * 0.5) / totalGames;
        }
      });
    });
    
    // Find favorable and unfavorable matchups
    const favorableMatchups: Record<string, string[]> = {};
    const unfavorableMatchups: Record<string, string[]> = {};
    
    archetypes.forEach(archetype => {
      favorableMatchups[archetype] = [];
      unfavorableMatchups[archetype] = [];
      
      archetypes.forEach(opponent => {
        if (archetype === opponent) return;
        
        const matchup = data[archetype][opponent];
        
        if (matchup.games >= 5) { // Minimum 5 games
          if (matchup.winRate >= 0.6) {
            favorableMatchups[archetype].push(opponent);
          } else if (matchup.winRate <= 0.4) {
            unfavorableMatchups[archetype].push(opponent);
          }
        }
      });
    });
    
    this.matchupMatrix = {
      data,
      favorableMatchups,
      unfavorableMatchups
    };
    
    return this.matchupMatrix;
  }

  // Calculate confidence intervals
  calculateConfidenceIntervals(matches: Match[], players: Player[]): ConfidenceIntervals {
    const deckWinRates: Record<string, {
      mean: number;
      lower95: number;
      upper95: number;
      sampleSize: number;
    }> = {};
    
    const playerWinRates: Record<string, {
      mean: number;
      lower95: number;
      upper95: number;
      sampleSize: number;
    }> = {};
    
    // Calculate deck win rates
    const deckStats: Record<string, { wins: number; games: number }> = {};
    
    matches.forEach(match => {
      if (match.status !== 'completed') return;
      
      const player1 = players.find(p => p.id === match.player1);
      const player2 = players.find(p => p.id === match.player2);
      
      if (!player1 || !player2) return;
      
      const deck1 = player1.decks.find(d => d.id === match.player1Deck);
      const deck2 = player2.decks.find(d => d.id === match.player2Deck);
      
      if (!deck1 || !deck2) return;
      
      // Update deck stats
      if (!deckStats[deck1.id]) {
        deckStats[deck1.id] = { wins: 0, games: 0 };
      }
      
      if (!deckStats[deck2.id]) {
        deckStats[deck2.id] = { wins: 0, games: 0 };
      }
      
      deckStats[deck1.id].games++;
      deckStats[deck2.id].games++;
      
      if (match.winner === match.player1) {
        deckStats[deck1.id].wins++;
      } else if (match.winner === match.player2) {
        deckStats[deck2.id].wins++;
      }
    });
    
    // Calculate confidence intervals for decks
    Object.keys(deckStats).forEach(deckId => {
      const { wins, games } = deckStats[deckId];
      
      if (games >= 10) { // Minimum 10 games for statistical significance
        const mean = wins / games;
        const standardError = Math.sqrt((mean * (1 - mean)) / games);
        const z = 1.96; // 95% confidence
        
        deckWinRates[deckId] = {
          mean,
          lower95: Math.max(0, mean - z * standardError),
          upper95: Math.min(1, mean + z * standardError),
          sampleSize: games
        };
      }
    });
    
    // Calculate player win rates
    const playerStats: Record<string, { wins: number; games: number }> = {};
    
    matches.forEach(match => {
      if (match.status !== 'completed') return;
      
      // Update player stats
      if (!playerStats[match.player1]) {
        playerStats[match.player1] = { wins: 0, games: 0 };
      }
      
      if (!playerStats[match.player2]) {
        playerStats[match.player2] = { wins: 0, games: 0 };
      }
      
      playerStats[match.player1].games++;
      playerStats[match.player2].games++;
      
      if (match.winner === match.player1) {
        playerStats[match.player1].wins++;
      } else if (match.winner === match.player2) {
        playerStats[match.player2].wins++;
      }
    });
    
    // Calculate confidence intervals for players
    Object.keys(playerStats).forEach(playerId => {
      const { wins, games } = playerStats[playerId];
      
      if (games >= 10) { // Minimum 10 games for statistical significance
        const mean = wins / games;
        const standardError = Math.sqrt((mean * (1 - mean)) / games);
        const z = 1.96; // 95% confidence
        
        playerWinRates[playerId] = {
          mean,
          lower95: Math.max(0, mean - z * standardError),
          upper95: Math.min(1, mean + z * standardError),
          sampleSize: games
        };
      }
    });
    
    this.confidenceIntervals = {
      deckWinRates,
      playerWinRates
    };
    
    return this.confidenceIntervals;
  }

  // Analyze meta trends over time
  analyzeMetaTrends(matches: Match[], players: Player[]): TrendData {
    // This would require historical data
    // For now, we'll just return the current structure
    return this.trendData;
  }

  // Get all analytics data
  getAllAnalytics(): {
    metaBreakdown: MetaBreakdown;
    playerPerformance: PlayerPerformance;
    matchupMatrix: MatchupMatrix;
    confidenceIntervals: ConfidenceIntervals;
    trendData: TrendData;
  } {
    return {
      metaBreakdown: this.metaBreakdown,
      playerPerformance: this.playerPerformance,
      matchupMatrix: this.matchupMatrix,
      confidenceIntervals: this.confidenceIntervals,
      trendData: this.trendData
    };
  }
}

// Context types
interface PhysicalMatchmakingContextType {
  players: Player[];
  matches: Match[];
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  loading: boolean;
  error: string | null;
  analytics: AdvancedAnalytics;
  // Actions
  createMatch: (player1Id: string, player2Id: string, player1DeckId: string, player2DeckId: string) => Promise<Match>;
  updateMatchResult: (matchId: string, winner: string | null, rounds: Round[]) => Promise<Match>;
  createTournament: (name: string, format: string, playerIds: string[]) => Promise<Tournament>;
  joinTournament: (tournamentId: string, playerId: string) => Promise<boolean>;
  startTournament: (tournamentId: string) => Promise<boolean>;
  advanceTournament: (tournamentId: string) => Promise<boolean>;
  getPlayerStats: (playerId: string) => {
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    bestDeck: string | null;
    recentMatches: Match[];
  };
  getDeckStats: (deckId: string) => {
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    favorableMatchups: string[];
    unfavorableMatchups: string[];
  };
  refreshData: () => Promise<void>;
}

// Create context
const PhysicalMatchmakingContext = createContext<PhysicalMatchmakingContextType | null>(null);

// Provider component
interface PhysicalMatchmakingProviderProps {
  children: ReactNode;
}

export const PhysicalMatchmakingProvider: React.FC<PhysicalMatchmakingProviderProps> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  // Initialize analytics
  const analytics = useMemo(() => new AdvancedAnalytics(), []);
  
  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch players
        const playersResponse = await fetch('/api/physical/players');
        const playersData = await playersResponse.json();
        setPlayers(playersData);
        
        // Fetch matches
        const matchesResponse = await fetch('/api/physical/matches');
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);
        
        // Fetch tournaments
        const tournamentsResponse = await fetch('/api/physical/tournaments');
        const tournamentsData = await tournamentsResponse.json();
        setTournaments(tournamentsData);
        
        // Check for active tournament
        const activeTournament = tournamentsData.find((t: Tournament) => t.status === 'active');
        if (activeTournament) {
          setCurrentTournament(activeTournament);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // Update analytics when data changes
  useEffect(() => {
    if (players.length > 0 && matches.length > 0) {
      analytics.analyzeMetaBreakdown(matches, players);
      analytics.analyzePlayerPerformance(players, matches);
      analytics.createMatchupMatrix(matches, players);
      analytics.calculateConfidenceIntervals(matches, players);
    }
  }, [players, matches, analytics]);
  
  // Create a new match
  const createMatch = async (
    player1Id: string,
    player2Id: string,
    player1DeckId: string,
    player2DeckId: string
  ): Promise<Match> => {
    try {
      const response = await fetch('/api/physical/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          player1: player1Id,
          player2: player2Id,
          player1Deck: player1DeckId,
          player2Deck: player2DeckId,
          status: 'pending',
          startTime: new Date(),
          rounds: []
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create match');
      }
      
      const newMatch = await response.json();
      
      // Update local state
      setMatches(prevMatches => [...prevMatches, newMatch]);
      
      return newMatch;
    } catch (err) {
      console.error('Error creating match:', err);
      throw err;
    }
  };
  
  // Update match result
  const updateMatchResult = async (
    matchId: string,
    winner: string | null,
    rounds: Round[]
  ): Promise<Match> => {
    try {
      const response = await fetch(`/api/physical/matches/${matchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          winner,
          rounds,
          status: 'completed',
          endTime: new Date()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update match');
      }
      
      const updatedMatch = await response.json();
      
      // Update local state
      setMatches(prevMatches => 
        prevMatches.map(match => 
          match.id === matchId ? updatedMatch : match
        )
      );
      
      // Update player stats
      if (winner) {
        const match = matches.find(m => m.id === matchId);
        if (match) {
          // Update player stats
          setPlayers(prevPlayers => 
            prevPlayers.map(player => {
              if (player.id === winner) {
                return {
                  ...player,
                  wins: player.wins + 1
                };
              } else if (player.id === (match.player1 === winner ? match.player2 : match.player1)) {
                return {
                  ...player,
                  losses: player.losses + 1
                };
              }
              return player;
            })
          );
          
          // Update deck stats
          const winnerDeckId = match.player1 === winner ? match.player1Deck : match.player2Deck;
          const loserDeckId = match.player1 === winner ? match.player2Deck : match.player1Deck;
          
          setPlayers(prevPlayers => 
            prevPlayers.map(player => {
              const updatedDecks = player.decks.map(deck => {
                if (deck.id === winnerDeckId) {
                  return {
                    ...deck,
                    wins: deck.wins + 1
                  };
                } else if (deck.id === loserDeckId) {
                  return {
                    ...deck,
                    losses: deck.losses + 1
                  };
                }
                return deck;
              });
              
              return {
                ...player,
                decks: updatedDecks
              };
            })
          );
        }
      }
      
      return updatedMatch;
    } catch (err) {
      console.error('Error updating match:', err);
      throw err;
    }
  };
  
  // Create a tournament
  const createTournament = async (
    name: string,
    format: string,
    playerIds: string[]
  ): Promise<Tournament> => {
    try {
      const response = await fetch('/api/physical/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          format,
          players: playerIds,
          matches: [],
          rounds: 0,
          currentRound: 0,
          status: 'pending',
          startDate: new Date(),
          standings: playerIds.map(playerId => ({
            playerId,
            rank: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            matchPoints: 0,
            tiebreakers: {
              opponentMatchWinPercentage: 0,
              gameWinPercentage: 0,
              opponentGameWinPercentage: 0
            }
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create tournament');
      }
      
      const newTournament = await response.json();
      
      // Update local state
      setTournaments(prevTournaments => [...prevTournaments, newTournament]);
      
      return newTournament;
    } catch (err) {
      console.error('Error creating tournament:', err);
      throw err;
    }
  };
  
  // Join tournament
  const joinTournament = async (tournamentId: string, playerId: string): Promise<boolean> => {
    try {
      const tournament = tournaments.find(t => t.id === tournamentId);
      
      if (!tournament || tournament.status !== 'pending') {
        return false;
      }
      
      const response = await fetch(`/api/physical/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to join tournament');
      }
      
      const updatedTournament = await response.json();
      
      // Update local state
      setTournaments(prevTournaments => 
        prevTournaments.map(t => 
          t.id === tournamentId ? updatedTournament : t
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error joining tournament:', err);
      return false;
    }
  };
  
  // Start tournament
  const startTournament = async (tournamentId: string): Promise<boolean> => {
    try {
      const tournament = tournaments.find(t => t.id === tournamentId);
      
      if (!tournament || tournament.status !== 'pending') {
        return false;
      }
      
      const response = await fetch(`/api/physical/tournaments/${tournamentId}/start`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to start tournament');
      }
      
      const updatedTournament = await response.json();
      
      // Update local state
      setTournaments(prevTournaments => 
        prevTournaments.map(t => 
          t.id === tournamentId ? updatedTournament : t
        )
      );
      
      setCurrentTournament(updatedTournament);
      
      return true;
    } catch (err) {
      console.error('Error starting tournament:', err);
      return false;
    }
  };
  
  // Advance tournament to next round
  const advanceTournament = async (tournamentId: string): Promise<boolean> => {
    try {
      const tournament = tournaments.find(t => t.id === tournamentId);
      
      if (!tournament || tournament.status !== 'active') {
        return false;
      }
      
      const response = await fetch(`/api/physical/tournaments/${tournamentId}/advance`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to advance tournament');
      }
      
      const updatedTournament = await response.json();
      
      // Update local state
      setTournaments(prevTournaments => 
        prevTournaments.map(t => 
          t.id === tournamentId ? updatedTournament : t
        )
      );
      
      setCurrentTournament(updatedTournament);
      
      return true;
    } catch (err) {
      console.error('Error advancing tournament:', err);
      return false;
    }
  };
  
  // Get player stats
  const getPlayerStats = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    
    if (!player) {
      return {
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        bestDeck: null,
        recentMatches: []
      };
    }
    
    // Get player matches
    const playerMatches = matches.filter(
      m => m.player1 === playerId || m.player2 === playerId
    );
    
    // Get recent matches
    const recentMatches = [...playerMatches]
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 5);
    
    // Calculate win rate
    const winRate = player.wins + player.losses > 0 
      ? player.wins / (player.wins + player.losses) 
      : 0;
    
    // Find best deck
    let bestDeck = null;
    let bestWinRate = 0;
    
    player.decks.forEach(deck => {
      if (deck.wins + deck.losses >= 5) { // Minimum 5 matches
        const deckWinRate = deck.wins / (deck.wins + deck.losses);
        if (deckWinRate > bestWinRate) {
          bestWinRate = deckWinRate;
          bestDeck = deck.id;
        }
      }
    });
    
    return {
      wins: player.wins,
      losses: player.losses,
      draws: player.draws,
      winRate,
      bestDeck,
      recentMatches
    };
  };
  
  // Get deck stats
  const getDeckStats = (deckId: string) => {
    // Find the deck
    let deck: Deck | null = null;
    
    for (const player of players) {
      const foundDeck = player.decks.find(d => d.id === deckId);
      if (foundDeck) {
        deck = foundDeck;
        break;
      }
    }
    
    if (!deck) {
      return {
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        favorableMatchups: [],
        unfavorableMatchups: []
      };
    }
    
    // Calculate win rate
    const winRate = deck.wins + deck.losses > 0 
      ? deck.wins / (deck.wins + deck.losses) 
      : 0;
    
    // Get matchup data from analytics
    const { matchupMatrix } = analytics.getAllAnalytics();
    
    const favorableMatchups = matchupMatrix.favorableMatchups[deck.archetype] || [];
    const unfavorableMatchups = matchupMatrix.unfavorableMatchups[deck.archetype] || [];
    
    return {
      wins: deck.wins,
      losses: deck.losses,
      draws: deck.draws,
      winRate,
      favorableMatchups,
      unfavorableMatchups
    };
  };
  
  // Refresh data
  const refreshData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Fetch players
      const playersResponse = await fetch('/api/physical/players');
      const playersData = await playersResponse.json();
      setPlayers(playersData);
      
      // Fetch matches
      const matchesResponse = await fetch('/api/physical/matches');
      const matchesData = await matchesResponse.json();
      setMatches(matchesData);
      
      // Fetch tournaments
      const tournamentsResponse = await fetch('/api/physical/tournaments');
      const tournamentsData = await tournamentsResponse.json();
      setTournaments(tournamentsData);
      
      // Check for active tournament
      const activeTournament = tournamentsData.find((t: Tournament) => t.status === 'active');
      if (activeTournament) {
        setCurrentTournament(activeTournament);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to refresh data');
      setLoading(false);
      console.error('Error refreshing data:', err);
    }
  };
  
  // Context value
  const value: PhysicalMatchmakingContextType = {
    players,
    matches,
    tournaments,
    currentTournament,
    loading,
    error,
    analytics,
    createMatch,
    updateMatchResult,
    createTournament,
    joinTournament,
    startTournament,
    advanceTournament,
    getPlayerStats,
    getDeckStats,
    refreshData
  };
  
  return (
    <PhysicalMatchmakingContext.Provider value={value}>
      {children}
    </PhysicalMatchmakingContext.Provider>
  );
};

// Custom hook to use the context
export const usePhysicalMatchmaking = (): PhysicalMatchmakingContextType => {
  const context = useContext(PhysicalMatchmakingContext);
  
  if (!context) {
    throw new Error('usePhysicalMatchmaking must be used within a PhysicalMatchmakingProvider');
  }
  
  return context;
};

export default PhysicalMatchmakingContext;