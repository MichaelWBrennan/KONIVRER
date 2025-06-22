import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      rating: parseInt(playerData.rating || 1500),
      wins: parseInt(playerData.wins || 0),
      losses: parseInt(playerData.losses || 0),
      draws: parseInt(playerData.draws || 0),
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

  // Tournament management
  const createTournament = (tournamentData) => {
    const newTournament = {
      id: `tournament_${Date.now()}`,
      ...tournamentData,
      players: tournamentData.players || [],
      matches: [],
      rounds: [],
      status: tournamentData.status || 'registration',
      createdAt: new Date()
    };
    
    setTournaments(prev => [...prev, newTournament]);
    return newTournament;
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
    
    // Player methods
    addPlayer,
    updatePlayer,
    deletePlayer,
    
    // Tournament methods
    createTournament,
    updateTournament,
    deleteTournament,
    
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
    
    // Navigation
    goToPhysicalMatchmaking
  };

  return (
    <PhysicalMatchmakingContext.Provider value={value}>
      {children}
    </PhysicalMatchmakingContext.Provider>
  );
};