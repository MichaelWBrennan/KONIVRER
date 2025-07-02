import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks';
import { calculateBayesianRating, generateId } from '../utils';
import {
  STORAGE_KEYS,
  APP_VERSION,
  DEFAULT_RATING,
  QR_CODE_TYPES,
  MATCH_STATUS,
  TOURNAMENT_STATUS,
  MATCH_FORMATS,
  TOURNAMENT_FORMATS,
  TOURNAMENT_TYPES,
} from '../utils/constants';

// Create context
const PhysicalMatchmakingContext = createContext();

// Custom hook to use the context
export const usePhysicalMatchmaking = () =>
  useContext(PhysicalMatchmakingContext);

// Initial data
const initialPlayers = [
  { id: '1', name: 'Player 1', rating: 1500 },
  { id: '2', name: 'Player 2', rating: 1450 },
  { id: '3', name: 'Player 3', rating: 1600 },
];

const initialTournaments = [
  {
    id: '1',
    name: 'Weekend Tournament',
    format: TOURNAMENT_FORMATS.SWISS,
    type: TOURNAMENT_TYPES.STANDARD,
    players: ['1', '2', '3'],
    rounds: 3,
    status: TOURNAMENT_STATUS.ACTIVE,
  },
];

const initialMatches = [
  {
    id: '1',
    player1: { id: '1', name: 'Player 1' },
    player2: { id: '2', name: 'Player 2' },
    format: MATCH_FORMATS.BEST_OF_3,
    maxRounds: 3,
    status: MATCH_STATUS.SCHEDULED,
  },
];

// Provider component
export const PhysicalMatchmakingProvider = ({ children }) => {
  // State for players, tournaments, and matches with localStorage persistence
  const [players, setPlayers] = useLocalStorage(
    STORAGE_KEYS.PLAYERS,
    initialPlayers,
  );
  const [tournaments, setTournaments] = useLocalStorage(
    STORAGE_KEYS.TOURNAMENTS,
    initialTournaments,
  );
  const [matches, setMatches] = useLocalStorage(
    STORAGE_KEYS.MATCHES,
    initialMatches,
  );

  // Generate QR code data for matches - memoized with useCallback
  const generateMatchQRData = useCallback(
    matchId => {
      const match = matches.find(m => m.id === matchId);
      if (!match) return null;

      // Get player information
      const player1 = players.find(p => p.id === match.player1.id);
      const player2 = players.find(p => p.id === match.player2.id);

      return {
        type: QR_CODE_TYPES.MATCH,
        id: match.id,
        player1: {
          id: match.player1.id,
          name: player1?.name || 'Unknown',
          rating: player1
            ? calculateBayesianRating(player1, matches)
            : DEFAULT_RATING,
        },
        player2: {
          id: match.player2.id,
          name: player2?.name || 'Unknown',
          rating: player2
            ? calculateBayesianRating(player2, matches)
            : DEFAULT_RATING,
        },
        format: match.format,
        maxRounds: match.maxRounds,
        status: match.status,
        timestamp: new Date().toISOString(),
        appVersion: APP_VERSION,
      };
    },
    [matches, players],
  );

  // Generate tournament QR code - memoized with useCallback
  const generateTournamentQRData = useCallback(
    tournamentId => {
      const tournament = tournaments.find(t => t.id === tournamentId);
      if (!tournament) return null;

      // Get participants information with Bayesian ratings
      const participantDetails =
        tournament.players?.map(playerId => {
          const player = players.find(p => p.id === playerId);
          return {
            id: playerId,
            name: player?.name || 'Unknown',
            rating: player
              ? calculateBayesianRating(player, matches)
              : DEFAULT_RATING,
          };
        }) || [];

      return {
        type: QR_CODE_TYPES.TOURNAMENT,
        id: tournament.id,
        name: tournament.name,
        format: tournament.format,
        tournamentType: tournament.type,
        participants: participantDetails,
        rounds: tournament.rounds || 0,
        status: tournament.status || TOURNAMENT_STATUS.REGISTRATION,
        timestamp: new Date().toISOString(),
        appVersion: APP_VERSION,
      };
    },
    [tournaments, players, matches],
  );

  // Add a player with validation
  const addPlayer = useCallback(
    player => {
      if (!player.name) return false;

      setPlayers(prev => [
        ...prev,
        {
          ...player,
          id: generateId(),
          rating: player.rating || DEFAULT_RATING,
          createdAt: new Date().toISOString(),
        },
      ]);
      return true;
    },
    [setPlayers],
  );

  // Update a player
  const updatePlayer = useCallback(
    (playerId, updates) => {
      if (!playerId) return false;

      setPlayers(prev =>
        prev.map(player =>
          player.id === playerId
            ? { ...player, ...updates, updatedAt: new Date().toISOString() }
            : player,
        ),
      );
      return true;
    },
    [setPlayers],
  );

  // Remove a player
  const removePlayer = useCallback(
    playerId => {
      if (!playerId) return false;

      setPlayers(prev => prev.filter(player => player.id !== playerId));
      return true;
    },
    [setPlayers],
  );

  // Add a tournament with validation
  const addTournament = useCallback(
    tournament => {
      if (!tournament.name || !tournament.format) return false;

      setTournaments(prev => [
        ...prev,
        {
          ...tournament,
          id: generateId(),
          players: tournament.players || [],
          status: tournament.status || TOURNAMENT_STATUS.REGISTRATION,
          createdAt: new Date().toISOString(),
        },
      ]);
      return true;
    },
    [setTournaments],
  );

  // Update a tournament
  const updateTournament = useCallback(
    (tournamentId, updates) => {
      if (!tournamentId) return false;

      setTournaments(prev =>
        prev.map(tournament =>
          tournament.id === tournamentId
            ? { ...tournament, ...updates, updatedAt: new Date().toISOString() }
            : tournament,
        ),
      );
      return true;
    },
    [setTournaments],
  );

  // Remove a tournament
  const removeTournament = useCallback(
    tournamentId => {
      if (!tournamentId) return false;

      setTournaments(prev =>
        prev.filter(tournament => tournament.id !== tournamentId),
      );
      return true;
    },
    [setTournaments],
  );

  // Add a match with validation
  const addMatch = useCallback(
    match => {
      if (!match.player1?.id || !match.player2?.id) return false;

      setMatches(prev => [
        ...prev,
        {
          ...match,
          id: generateId(),
          status: match.status || MATCH_STATUS.SCHEDULED,
          createdAt: new Date().toISOString(),
        },
      ]);
      return true;
    },
    [setMatches],
  );

  // Update a match
  const updateMatch = useCallback(
    (matchId, updates) => {
      if (!matchId) return false;

      setMatches(prev =>
        prev.map(match =>
          match.id === matchId
            ? { ...match, ...updates, updatedAt: new Date().toISOString() }
            : match,
        ),
      );
      return true;
    },
    [setMatches],
  );

  // Remove a match
  const removeMatch = useCallback(
    matchId => {
      if (!matchId) return false;

      setMatches(prev => prev.filter(match => match.id !== matchId));
      return true;
    },
    [setMatches],
  );

  // Get player by ID
  const getPlayerById = useCallback(
    playerId => {
      return players.find(player => player.id === playerId) || null;
    },
    [players],
  );

  // Get tournament by ID
  const getTournamentById = useCallback(
    tournamentId => {
      return (
        tournaments.find(tournament => tournament.id === tournamentId) || null
      );
    },
    [tournaments],
  );

  // Get match by ID
  const getMatchById = useCallback(
    matchId => {
      return matches.find(match => match.id === matchId) || null;
    },
    [matches],
  );

  // Selection state with localStorage persistence
  const [selectedMatchId, setSelectedMatchId] = useLocalStorage(
    STORAGE_KEYS.SELECTED_MATCH_ID,
    null,
  );
  const [selectedTournamentId, setSelectedTournamentId] = useLocalStorage(
    STORAGE_KEYS.SELECTED_TOURNAMENT_ID,
    null,
  );

  // Context value - memoized to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      // Data
      players,
      tournaments,
      matches,

      // Selection state
      selectedMatchId,
      selectedTournamentId,
      setSelectedMatchId,
      setSelectedTournamentId,

      // Player methods
      addPlayer,
      updatePlayer,
      removePlayer,
      getPlayerById,

      // Tournament methods
      addTournament,
      updateTournament,
      removeTournament,
      getTournamentById,

      // Match methods
      addMatch,
      updateMatch,
      removeMatch,
      getMatchById,

      // QR code methods
      generateMatchQRData,
      generateTournamentQRData,
    }),
    [
      // Data
      players,
      tournaments,
      matches,

      // Selection state
      selectedMatchId,
      selectedTournamentId,
      setSelectedMatchId,
      setSelectedTournamentId,

      // Player methods
      addPlayer,
      updatePlayer,
      removePlayer,
      getPlayerById,

      // Tournament methods
      addTournament,
      updateTournament,
      removeTournament,
      getTournamentById,

      // Match methods
      addMatch,
      updateMatch,
      removeMatch,
      getMatchById,

      // QR code methods
      generateMatchQRData,
      generateTournamentQRData,
    ],
  );

  return (
    <PhysicalMatchmakingContext.Provider value={value}>
      {children}
    </PhysicalMatchmakingContext.Provider>
  );
};
