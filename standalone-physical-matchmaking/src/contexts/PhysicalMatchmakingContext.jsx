import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const PhysicalMatchmakingContext = createContext();

// Custom hook to use the context
export const usePhysicalMatchmaking = () => {
  return useContext(PhysicalMatchmakingContext);
};

// Provider component
export const PhysicalMatchmakingProvider = ({ children }) => {
  // State for players, tournaments, and matches
  const [players, setPlayers] = useState([
    { id: '1', name: 'Player 1', rating: 1500 },
    { id: '2', name: 'Player 2', rating: 1450 },
    { id: '3', name: 'Player 3', rating: 1600 }
  ]);
  
  const [tournaments, setTournaments] = useState([
    { 
      id: '1', 
      name: 'Weekend Tournament', 
      format: 'Swiss', 
      type: 'Standard',
      players: ['1', '2', '3'],
      rounds: 3,
      status: 'active'
    }
  ]);
  
  const [matches, setMatches] = useState([
    { 
      id: '1', 
      player1: { id: '1', name: 'Player 1' }, 
      player2: { id: '2', name: 'Player 2' },
      format: 'Best of 3',
      maxRounds: 3,
      status: 'scheduled'
    }
  ]);

  // Generate QR code data for matches
  const generateMatchQRData = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return null;
    
    // Get player information
    const player1 = players.find(p => p.id === match.player1.id);
    const player2 = players.find(p => p.id === match.player2.id);
    
    return {
      type: 'match',
      id: match.id,
      player1: {
        id: match.player1.id,
        name: player1?.name || 'Unknown',
        rating: player1?.rating || 1500
      },
      player2: {
        id: match.player2.id,
        name: player2?.name || 'Unknown',
        rating: player2?.rating || 1500
      },
      format: match.format,
      maxRounds: match.maxRounds,
      status: match.status,
      timestamp: new Date().toISOString(),
      appVersion: '1.0.0'
    };
  };

  // Generate tournament QR code
  const generateTournamentQRData = (tournamentId) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return null;
    
    // Get participants information
    const participantDetails = tournament.players?.map(playerId => {
      const player = players.find(p => p.id === playerId);
      return {
        id: playerId,
        name: player?.name || 'Unknown',
        rating: player?.rating || 1500
      };
    }) || [];
    
    return {
      type: 'tournament',
      id: tournament.id,
      name: tournament.name,
      format: tournament.format,
      tournamentType: tournament.type,
      participants: participantDetails,
      rounds: tournament.rounds || 0,
      status: tournament.status || 'registration',
      timestamp: new Date().toISOString(),
      appVersion: '1.0.0'
    };
  };

  // Add a player
  const addPlayer = (player) => {
    setPlayers(prev => [...prev, { ...player, id: Date.now().toString() }]);
  };

  // Add a tournament
  const addTournament = (tournament) => {
    setTournaments(prev => [...prev, { ...tournament, id: Date.now().toString() }]);
  };

  // Add a match
  const addMatch = (match) => {
    setMatches(prev => [...prev, { ...match, id: Date.now().toString() }]);
  };

  // Context value
  const value = {
    // State
    players,
    tournaments,
    matches,
    
    // Player methods
    addPlayer,
    
    // Tournament methods
    addTournament,
    
    // Match methods
    addMatch,
    
    // QR code methods
    generateMatchQRData,
    generateTournamentQRData
  };

  return (
    <PhysicalMatchmakingContext.Provider value={value}>
      {children}
    </PhysicalMatchmakingContext.Provider>
  );
};