import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RankingEngine } from '../engine/RankingEngine';

const PhysicalMatchmakingContext = createContext();

export const usePhysicalMatchmaking = () => {
  const context = useContext(PhysicalMatchmakingContext);
  if (!context) {
    throw new Error('usePhysicalMatchmaking must be used within a PhysicalMatchmakingProvider');
  }
  return context;
};

export const PhysicalMatchmakingProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);
  const [rankingEngine] = useState(() => new RankingEngine());
  const navigate = useNavigate();

  // Load data from localStorage on initial load
  useEffect(() => {
    loadData();
    
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveData();
  }, [players, tournaments, matches]);

  const loadData = () => {
    try {
      const savedPlayers = JSON.parse(localStorage.getItem('konivrer_players') || '[]');
      const savedTournaments = JSON.parse(localStorage.getItem('konivrer_tournaments') || '[]');
      const savedMatches = JSON.parse(localStorage.getItem('konivrer_matches') || '[]');
      
      setPlayers(savedPlayers);
      setTournaments(savedTournaments);
      setMatches(savedMatches);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  };

  const saveData = () => {
    try {
      localStorage.setItem('konivrer_players', JSON.stringify(players));
      localStorage.setItem('konivrer_tournaments', JSON.stringify(tournaments));
      localStorage.setItem('konivrer_matches', JSON.stringify(matches));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };

  // Player management
  const addPlayer = (playerData) => {
    const newPlayer = {
      id: `player_${Date.now()}`,
      ...playerData,
      rating: parseInt(playerData.rating || rankingEngine.bayesianParams.INITIAL_RATING),
      uncertainty: parseInt(playerData.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY),
      conservativeRating: rankingEngine.getConservativeRating(
        parseInt(playerData.rating || rankingEngine.bayesianParams.INITIAL_RATING),
        parseInt(playerData.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY)
      ),
      tier: playerData.tier || 'bronze',
      division: parseInt(playerData.division || 1),
      wins: parseInt(playerData.wins || 0),
      losses: parseInt(playerData.losses || 0),
      draws: parseInt(playerData.draws || 0),
      deckArchetypes: playerData.deckArchetypes || [],
      matchHistory: playerData.matchHistory || [],
      createdAt: new Date()
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    return newPlayer;
  };

  const updatePlayer = (playerId, playerData) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, ...playerData } 
          : player
      )
    );
  };

  const deletePlayer = (playerId) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };
  
  // Bayesian matchmaking functions
  const calculateMatchQuality = (player1Id, player2Id) => {
    const player1 = players.find(p => p.id === player1Id);
    const player2 = players.find(p => p.id === player2Id);
    
    if (!player1 || !player2) return { score: 0, winProbability: 0.5, skillDifference: 0 };
    
    const winProbability = rankingEngine.calculateWinProbability(
      player1.rating, 
      player1.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY, 
      player2.rating, 
      player2.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY
    );
    
    const skillDifference = Math.abs(player1.rating - player2.rating);
    const uncertaintyFactor = ((player1.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY) + 
                              (player2.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY)) / 2;
    
    // Calculate match quality (1.0 = perfect match, 0.0 = terrible match)
    // Ideal match has similar skill and low uncertainty
    const skillMatchScore = Math.max(0, 1 - (skillDifference / 1000));
    const uncertaintyScore = Math.max(0, 1 - (uncertaintyFactor / 500));
    const balanceScore = 1 - Math.abs(winProbability - 0.5) * 2;
    
    const score = (skillMatchScore * 0.4) + (uncertaintyScore * 0.3) + (balanceScore * 0.3);
    
    return {
      score,
      winProbability,
      skillDifference,
      player1Rating: player1.rating,
      player2Rating: player2.rating,
      player1Uncertainty: player1.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY,
      player2Uncertainty: player2.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY
    };
  };
  
  const recordMatchResult = (player1Id, player2Id, result, matchDetails = {}) => {
    const player1 = players.find(p => p.id === player1Id);
    const player2 = players.find(p => p.id === player2Id);
    
    if (!player1 || !player2) return null;
    
    // Calculate rating updates using Bayesian TrueSkill
    const skillUpdate = rankingEngine.calculateTrueSkillUpdate(
      player1.rating,
      player1.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY,
      player2.rating,
      player2.uncertainty || rankingEngine.bayesianParams.INITIAL_UNCERTAINTY,
      result === 'player1' ? 'win' : result === 'draw' ? 'draw' : 'loss'
    );
    
    // Update player1
    const updatedPlayer1 = {
      ...player1,
      rating: skillUpdate.player.newRating,
      uncertainty: skillUpdate.player.newUncertainty,
      conservativeRating: rankingEngine.getConservativeRating(
        skillUpdate.player.newRating,
        skillUpdate.player.newUncertainty
      ),
      wins: result === 'player1' ? player1.wins + 1 : player1.wins,
      losses: result === 'player2' ? player1.losses + 1 : player1.losses,
      draws: result === 'draw' ? player1.draws + 1 : player1.draws
    };
    
    // Update player2
    const updatedPlayer2 = {
      ...player2,
      rating: skillUpdate.opponent.newRating,
      uncertainty: skillUpdate.opponent.newUncertainty,
      conservativeRating: rankingEngine.getConservativeRating(
        skillUpdate.opponent.newRating,
        skillUpdate.opponent.newUncertainty
      ),
      wins: result === 'player2' ? player2.wins + 1 : player2.wins,
      losses: result === 'player1' ? player2.losses + 1 : player2.losses,
      draws: result === 'draw' ? player2.draws + 1 : player2.draws
    };
    
    // Update deck archetype performance if available
    if (matchDetails.player1Deck && matchDetails.player2Deck) {
      updatedPlayer1.deckArchetypes = updateDeckArchetype(
        updatedPlayer1.deckArchetypes || [],
        matchDetails.player1Deck,
        result === 'player1' ? 'win' : result === 'draw' ? 'draw' : 'loss'
      );
      
      updatedPlayer2.deckArchetypes = updateDeckArchetype(
        updatedPlayer2.deckArchetypes || [],
        matchDetails.player2Deck,
        result === 'player2' ? 'win' : result === 'draw' ? 'draw' : 'loss'
      );
    }
    
    // Create match record
    const match = {
      id: `match_${Date.now()}`,
      player1Id,
      player2Id,
      result,
      date: new Date().toISOString(),
      player1: {
        name: player1.name,
        oldRating: player1.rating,
        newRating: updatedPlayer1.rating,
        ratingChange: skillUpdate.player.ratingChange
      },
      player2: {
        name: player2.name,
        oldRating: player2.rating,
        newRating: updatedPlayer2.rating,
        ratingChange: skillUpdate.opponent.ratingChange
      },
      winProbability: skillUpdate.winProbability,
      surpriseFactor: skillUpdate.surpriseFactor,
      ...matchDetails
    };
    
    // Update players and add match
    setPlayers(prev => 
      prev.map(p => 
        p.id === player1Id ? updatedPlayer1 : 
        p.id === player2Id ? updatedPlayer2 : p
      )
    );
    
    setMatches(prev => [...prev, match]);
    
    return {
      match,
      player1Update: {
        oldRating: player1.rating,
        newRating: updatedPlayer1.rating,
        ratingChange: skillUpdate.player.ratingChange
      },
      player2Update: {
        oldRating: player2.rating,
        newRating: updatedPlayer2.rating,
        ratingChange: skillUpdate.opponent.ratingChange
      }
    };
  };
  
  const updateDeckArchetype = (deckArchetypes, archetype, result) => {
    const existingDeck = deckArchetypes.find(d => d.archetype === archetype);
    
    if (existingDeck) {
      return deckArchetypes.map(d => {
        if (d.archetype === archetype) {
          return {
            ...d,
            gamesPlayed: (d.gamesPlayed || 0) + 1,
            wins: result === 'win' ? (d.wins || 0) + 1 : (d.wins || 0),
            losses: result === 'loss' ? (d.losses || 0) + 1 : (d.losses || 0),
            draws: result === 'draw' ? (d.draws || 0) + 1 : (d.draws || 0),
            lastPlayed: new Date().toISOString()
          };
        }
        return d;
      });
    } else {
      return [
        ...deckArchetypes,
        {
          archetype,
          gamesPlayed: 1,
          wins: result === 'win' ? 1 : 0,
          losses: result === 'loss' ? 1 : 0,
          draws: result === 'draw' ? 1 : 0,
          lastPlayed: new Date().toISOString()
        }
      ];
    }
  };
  
  const getPlayerTier = (conservativeRating) => {
    const tiers = rankingEngine.tiers;
    for (const [tierKey, tierData] of Object.entries(tiers)) {
      const [min, max] = tierData.skillRange;
      if (conservativeRating >= min && conservativeRating <= max) {
        // Calculate division within tier
        const tierRange = max - min;
        const divisionSize = tierRange / tierData.divisions;
        const division = tierData.divisions - Math.floor((conservativeRating - min) / divisionSize);
        
        return {
          tier: tierKey,
          division: Math.max(1, Math.min(division, tierData.divisions)),
          name: tierData.name,
          color: tierData.color
        };
      }
    }
    
    // Default to bronze if no match
    return { tier: 'bronze', division: 4, name: 'Bronze', color: '#CD7F32' };
  };

  // Tournament management with Bayesian matchmaking
  const createTournament = (tournamentData) => {
    const newTournament = {
      id: `tournament_${Date.now()}`,
      ...tournamentData,
      players: tournamentData.players || [],
      matches: [],
      rounds: [],
      status: tournamentData.status || 'registration',
      createdAt: new Date(),
      useBayesianPairings: tournamentData.useBayesianPairings !== false, // Default to true
      bayesianSettings: {
        prioritizeMatchQuality: tournamentData.bayesianSettings?.prioritizeMatchQuality || 0.7,
        avoidRematches: tournamentData.bayesianSettings?.avoidRematches || 0.9,
        balanceWhiteBlack: tournamentData.bayesianSettings?.balanceWhiteBlack || 0.5
      }
    };
    
    setTournaments(prev => [...prev, newTournament]);
    return newTournament;
  };
  
  // Generate optimal pairings for a tournament round using Bayesian matchmaking
  const generateTournamentPairings = (tournamentId) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return null;
    
    // Get tournament players
    const tournamentPlayers = tournament.players.map(playerId => 
      players.find(p => p.id === playerId)
    ).filter(Boolean);
    
    if (tournamentPlayers.length < 2) return [];
    
    // Different pairing strategies based on tournament type
    switch (tournament.format) {
      case 'swiss':
        return generateSwissPairings(tournament, tournamentPlayers);
      case 'singleElimination':
        return generateEliminationPairings(tournament, tournamentPlayers, false);
      case 'doubleElimination':
        return generateEliminationPairings(tournament, tournamentPlayers, true);
      case 'roundRobin':
        return generateRoundRobinPairings(tournament, tournamentPlayers);
      default:
        return generateSwissPairings(tournament, tournamentPlayers);
    }
  };
  
  // Generate Swiss tournament pairings
  const generateSwissPairings = (tournament, tournamentPlayers) => {
    // Sort players by points, then by tiebreakers
    const sortedPlayers = [...tournamentPlayers].sort((a, b) => {
      // First by points
      const aPoints = getPlayerTournamentPoints(a.id, tournament.id);
      const bPoints = getPlayerTournamentPoints(b.id, tournament.id);
      
      if (aPoints !== bPoints) return bPoints - aPoints;
      
      // Then by rating
      return b.rating - a.rating;
    });
    
    const pairings = [];
    const paired = new Set();
    
    // Try to pair players with same points first
    const pointGroups = {};
    sortedPlayers.forEach(player => {
      const points = getPlayerTournamentPoints(player.id, tournament.id);
      if (!pointGroups[points]) pointGroups[points] = [];
      pointGroups[points].push(player);
    });
    
    // For each point group, pair players optimally
    Object.values(pointGroups).forEach(group => {
      // Skip already paired players
      const availablePlayers = group.filter(p => !paired.has(p.id));
      
      // If odd number, move lowest rated player to next group
      if (availablePlayers.length % 2 === 1 && Object.keys(pointGroups).length > 1) {
        const lowestRated = availablePlayers.sort((a, b) => a.rating - b.rating)[0];
        availablePlayers.splice(availablePlayers.indexOf(lowestRated), 1);
      }
      
      // Generate all possible pairings in this group
      const possiblePairings = [];
      for (let i = 0; i < availablePlayers.length; i++) {
        for (let j = i + 1; j < availablePlayers.length; j++) {
          const player1 = availablePlayers[i];
          const player2 = availablePlayers[j];
          
          // Check if they've already played
          const alreadyPlayed = tournament.matches.some(match => 
            (match.player1Id === player1.id && match.player2Id === player2.id) ||
            (match.player1Id === player2.id && match.player2Id === player1.id)
          );
          
          // Calculate match quality
          const quality = calculateMatchQuality(player1.id, player2.id);
          
          // Score this pairing (higher is better)
          let score = quality.score;
          
          // Penalize rematches if tournament settings prioritize avoiding them
          if (alreadyPlayed) {
            score *= (1 - tournament.bayesianSettings.avoidRematches);
          }
          
          possiblePairings.push({
            player1Id: player1.id,
            player2Id: player2.id,
            quality: quality.score,
            score
          });
        }
      }
      
      // Sort by score (best pairings first)
      possiblePairings.sort((a, b) => b.score - a.score);
      
      // Create pairings greedily
      while (possiblePairings.length > 0 && paired.size < sortedPlayers.length) {
        const bestPairing = possiblePairings.shift();
        
        // Skip if either player already paired
        if (paired.has(bestPairing.player1Id) || paired.has(bestPairing.player2Id)) {
          continue;
        }
        
        // Add this pairing
        pairings.push({
          player1Id: bestPairing.player1Id,
          player2Id: bestPairing.player2Id,
          quality: bestPairing.quality,
          round: tournament.rounds.length + 1
        });
        
        paired.add(bestPairing.player1Id);
        paired.add(bestPairing.player2Id);
      }
    });
    
    // Handle odd number of players with a bye
    if (sortedPlayers.length % 2 === 1) {
      // Find player with lowest points who hasn't had a bye yet
      const playersWithoutBye = sortedPlayers
        .filter(p => !paired.has(p.id))
        .filter(p => !tournament.matches.some(m => 
          (m.player1Id === p.id || m.player2Id === p.id) && m.result === 'bye'
        ))
        .sort((a, b) => {
          const aPoints = getPlayerTournamentPoints(a.id, tournament.id);
          const bPoints = getPlayerTournamentPoints(b.id, tournament.id);
          return aPoints - bPoints;
        });
      
      if (playersWithoutBye.length > 0) {
        const byePlayer = playersWithoutBye[0];
        pairings.push({
          player1Id: byePlayer.id,
          result: 'bye',
          round: tournament.rounds.length + 1
        });
        paired.add(byePlayer.id);
      }
    }
    
    return pairings;
  };
  
  // Generate elimination tournament pairings
  const generateEliminationPairings = (tournament, tournamentPlayers, isDouble) => {
    // If this is the first round, seed players by rating
    if (tournament.rounds.length === 0) {
      const seededPlayers = [...tournamentPlayers].sort((a, b) => 
        b.conservativeRating - a.conservativeRating
      );
      
      // Create balanced bracket pairings (1 vs 16, 8 vs 9, etc.)
      const pairings = [];
      const n = seededPlayers.length;
      
      // Calculate number of byes needed to get to next power of 2
      const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(n)));
      const numByes = nextPowerOf2 - n;
      
      // Create first round pairings with byes
      for (let i = 0; i < nextPowerOf2 / 2; i++) {
        const highSeed = i;
        const lowSeed = nextPowerOf2 - 1 - i;
        
        // If lowSeed >= n, highSeed gets a bye
        if (lowSeed >= n) {
          pairings.push({
            player1Id: seededPlayers[highSeed].id,
            result: 'bye',
            round: 1,
            bracket: 'winners'
          });
        } else {
          pairings.push({
            player1Id: seededPlayers[highSeed].id,
            player2Id: seededPlayers[lowSeed].id,
            round: 1,
            bracket: 'winners'
          });
        }
      }
      
      return pairings;
    } else {
      // For subsequent rounds, pair winners against winners
      const pairings = [];
      const lastRound = tournament.rounds[tournament.rounds.length - 1];
      
      // Get winners from last round
      const winners = lastRound
        .filter(match => match.result && match.result !== 'pending')
        .map(match => {
          if (match.result === 'player1') return match.player1Id;
          if (match.result === 'player2') return match.player2Id;
          if (match.result === 'bye') return match.player1Id;
          return null;
        })
        .filter(Boolean);
      
      // Pair winners
      for (let i = 0; i < winners.length; i += 2) {
        if (i + 1 < winners.length) {
          pairings.push({
            player1Id: winners[i],
            player2Id: winners[i + 1],
            round: tournament.rounds.length + 1,
            bracket: 'winners'
          });
        } else {
          // Odd number of winners, give bye to the last one
          pairings.push({
            player1Id: winners[i],
            result: 'bye',
            round: tournament.rounds.length + 1,
            bracket: 'winners'
          });
        }
      }
      
      // For double elimination, also handle losers bracket
      if (isDouble) {
        // Get losers from last round
        const losers = lastRound
          .filter(match => match.result && match.result !== 'pending' && match.result !== 'bye')
          .map(match => {
            if (match.result === 'player1') return match.player2Id;
            if (match.result === 'player2') return match.player1Id;
            return null;
          })
          .filter(Boolean);
        
        // Pair losers
        for (let i = 0; i < losers.length; i += 2) {
          if (i + 1 < losers.length) {
            pairings.push({
              player1Id: losers[i],
              player2Id: losers[i + 1],
              round: tournament.rounds.length + 1,
              bracket: 'losers'
            });
          } else {
            // Odd number of losers, give bye to the last one
            pairings.push({
              player1Id: losers[i],
              result: 'bye',
              round: tournament.rounds.length + 1,
              bracket: 'losers'
            });
          }
        }
      }
      
      return pairings;
    }
  };
  
  // Generate round robin tournament pairings
  const generateRoundRobinPairings = (tournament, tournamentPlayers) => {
    const n = tournamentPlayers.length;
    const pairings = [];
    
    // Round robin algorithm (circle method)
    // For each round, player 0 stays fixed and others rotate
    const currentRound = tournament.rounds.length + 1;
    
    // Create a copy of players that we can rotate
    let rotatingPlayers = [...tournamentPlayers];
    if (n % 2 === 1) {
      // Add a dummy player for bye if odd number
      rotatingPlayers.push({ id: 'bye' });
    }
    
    // Rotate players for the current round
    // In round 1, no rotation
    // In round 2, rotate once, etc.
    for (let i = 0; i < currentRound - 1; i++) {
      rotatingPlayers = [
        rotatingPlayers[0],
        ...rotatingPlayers.slice(2),
        rotatingPlayers[1]
      ];
    }
    
    // Create pairings for this round
    for (let i = 0; i < rotatingPlayers.length / 2; i++) {
      const player1 = rotatingPlayers[i];
      const player2 = rotatingPlayers[rotatingPlayers.length - 1 - i];
      
      // Skip if either player is the dummy bye player
      if (player1.id === 'bye') {
        pairings.push({
          player1Id: player2.id,
          result: 'bye',
          round: currentRound
        });
      } else if (player2.id === 'bye') {
        pairings.push({
          player1Id: player1.id,
          result: 'bye',
          round: currentRound
        });
      } else {
        // Calculate match quality for these players
        const quality = calculateMatchQuality(player1.id, player2.id);
        
        pairings.push({
          player1Id: player1.id,
          player2Id: player2.id,
          quality: quality.score,
          round: currentRound
        });
      }
    }
    
    return pairings;
  };
  
  // Get player's points in a tournament
  const getPlayerTournamentPoints = (playerId, tournamentId) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return 0;
    
    let points = 0;
    
    // Count points from matches
    tournament.matches.forEach(match => {
      if (match.player1Id === playerId) {
        if (match.result === 'player1') points += 3; // Win
        else if (match.result === 'draw') points += 1; // Draw
        else if (match.result === 'bye') points += 3; // Bye
      } else if (match.player2Id === playerId) {
        if (match.result === 'player2') points += 3; // Win
        else if (match.result === 'draw') points += 1; // Draw
      }
    });
    
    return points;
  };

  const updateTournament = (tournamentId, tournamentData) => {
    setTournaments(prev => 
      prev.map(tournament => 
        tournament.id === tournamentId 
          ? { ...tournament, ...tournamentData } 
          : tournament
      )
    );
  };

  const deleteTournament = (tournamentId) => {
    setTournaments(prev => prev.filter(tournament => tournament.id !== tournamentId));
  };

  // Match management
  const createMatch = (matchData) => {
    const newMatch = {
      id: `match_${Date.now()}`,
      ...matchData,
      status: matchData.status || 'active',
      startTime: new Date(),
      games: matchData.games || []
    };
    
    setMatches(prev => [...prev, newMatch]);
    return newMatch;
  };

  const updateMatch = (matchId, matchData) => {
    setMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { ...match, ...matchData } 
          : match
      )
    );
  };

  const deleteMatch = (matchId) => {
    setMatches(prev => prev.filter(match => match.id !== matchId));
  };

  // QR code generation
  const generateMatchQRData = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return null;
    
    return {
      type: 'match',
      id: match.id,
      player1: match.player1.id,
      player2: match.player2.id,
      format: match.format,
      maxRounds: match.maxRounds,
      timestamp: new Date().toISOString()
    };
  };

  const generateTournamentQRData = (tournamentId) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return null;
    
    return {
      type: 'tournament',
      id: tournament.id,
      name: tournament.name,
      format: tournament.format,
      type: tournament.type,
      timestamp: new Date().toISOString()
    };
  };

  // Data import/export
  const exportData = () => {
    const exportData = {
      players,
      tournaments,
      matches,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(exportData);
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.players) setPlayers(data.players);
      if (data.tournaments) setTournaments(data.tournaments);
      if (data.matches) setMatches(data.matches);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  // Navigation
  const goToPhysicalMatchmaking = () => {
    navigate('/physical-matchmaking');
  };

  const value = {
    // State
    players,
    tournaments,
    matches,
    isOfflineMode,
    rankingEngine,
    
    // Player methods
    addPlayer,
    updatePlayer,
    deletePlayer,
    
    // Tournament methods
    createTournament,
    updateTournament,
    deleteTournament,
    generateTournamentPairings,
    getPlayerTournamentPoints,
    
    // Match methods
    createMatch,
    updateMatch,
    deleteMatch,
    
    // QR code methods
    generateMatchQRData,
    generateTournamentQRData,
    
    // Data methods
    exportData,
    importData,
    
    // Bayesian matchmaking methods
    calculateMatchQuality,
    recordMatchResult,
    getPlayerTier,
    
    // Navigation
    goToPhysicalMatchmaking
  };

  return (
    <PhysicalMatchmakingContext.Provider value={value}>
      {children}
    </PhysicalMatchmakingContext.Provider>
  );
};