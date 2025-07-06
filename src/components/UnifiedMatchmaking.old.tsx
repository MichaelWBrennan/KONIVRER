import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Unified Matchmaking Component
 * 
 * A unified matchmaking component that combines functionality from:
 * - MatchmakingSystem
 * - EnhancedMatchmakingVisualizer
 * - PhysicalMatchmaking
 * - EnhancedPhysicalMatchmaking
 * - StandaloneMatchmaking
 * - Various matchmaking subcomponents
 * 
 * Features:
 * - Online matchmaking
 * - Physical matchmaking
 * - Player profiles and statistics
 * - Match history
 * - Leaderboards
 * - Format and region selection
 * - Deck selection
 * - Matchmaking preferences
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuth } from '../contexts/AuthContext';

// Import contexts
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';

// Import components
import UnifiedCard from './UnifiedCard';

// Import icons
import { Users, User, UserPlus, UserX, Settings, Clock, MapPin, Trophy, Star, Sword, Play, X, Check, ChevronDown, ChevronUp, Plus, RefreshCw, AlertCircle, CheckCircle, MessageSquare, Loader, Wifi, Bluetooth, BluetoothOff, Smartphone } from 'lucide-react';

// Types
type MatchmakingMode = 'online' | 'physical' | 'tournament';
type GameFormat = 'standard' | 'draft' | 'sealed' | 'casual' | 'ranked' | 'competitive' | 'custom';
type Region = 'global' | 'na' | 'eu' | 'asia' | 'sa' | 'oce';
type PlayerRank = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'legend';
type MatchmakingStatus = 'idle' | 'searching' | 'match_found' | 'in_game' | 'completed';

interface Player {
  id: string;
  name: string;,
  displayName?: string;
  avatar?: string;
  rank?: PlayerRank;
  level?: number;
  experience?: number;
  winRate?: number;
  region?: Region;
  online?: boolean;
  lastActive?: Date;
  isFriend?: boolean;
  isBlocked?: boolean;
  stats?: {
    wins: number;
    losses: number;
    draws: number;
    winStreak: number;
    bestWinStreak: number;
    gamesPlayed: number;
    tournamentWins: number;
    favoriteDecks: string[];
    favoriteCards: string[];
    averageGameLength: number;
  };
}

interface Deck {
  id: string;
  name: string;,
  format: GameFormat;
  cards: any[];
  colors: string[];
  archetype?: string;
  winRate?: number;
  gamesPlayed?: number;
  lastPlayed?: Date;
  isFavorite?: boolean;
}

interface Match {
  id: string;
  player1: Player;
  player2: Player;
  winner?: string;
  result?: string;
  format: GameFormat;
  date: Date;
  duration?: number;
  decks?: {
    player1: Deck;
    player2: Deck;
  };
  stats?: {
    player1Score: number;
    player2Score: number;
    turns: number;
    cardsPlayed: number;
  };
}

interface MatchmakingPreference {
  key: string;
  label: string;
  value: boolean | string | number;
  type: 'boolean' | 'select' | 'range';,
  options?: string[];
  min?: number;
  max?: number;
}

interface PhysicalMatchmakingSession {
  id: string;
  location: string;
  players: Player[];
  matches: Match[];
  status: 'active' | 'completed';
  startTime: Date;
  endTime?: Date;
  format: GameFormat;
  organizer: Player;
}

interface UnifiedMatchmakingProps {
  variant?: 'standard' | 'enhanced' | 'mobile' | 'physical' | 'standalone';
  mode?: MatchmakingMode;
  initialFormat?: GameFormat;
  initialRegion?: Region;
  onMatchFound?: (match: Match) => void;
  onMatchAccepted?: (match: Match) => void;
  onMatchDeclined?: (match: Match) => void;
  onMatchCompleted?: (match: Match) => void;
  className?: string;
}

const UnifiedMatchmaking: React.FC<UnifiedMatchmakingProps> = ({
  variant = 'standard',
  mode = 'online',
  initialFormat = 'standard',
  initialRegion = 'global',
  onMatchFound,
  onMatchAccepted,
  onMatchDeclined,
  onMatchCompleted,
  className = ''
}) => {
  // Detect if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const actualVariant = variant === 'standard' && isMobile ? 'mobile' : variant;
  
  // Navigation and location
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auth context
  const { user } = useAuth();
  
  // Physical matchmaking context
  const physicalMatchmaking = usePhysicalMatchmaking?.();
  
  // Refs
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const matchFoundAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // State
  const [matchmakingMode, setMatchmakingMode] = useState<MatchmakingMode>(mode);
  const [selectedFormat, setSelectedFormat] = useState<GameFormat>(initialFormat);
  const [selectedRegion, setSelectedRegion] = useState<Region>(initialRegion);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [availableDecks, setAvailableDecks] = useState<Deck[]>([]);
  const [matchmakingStatus, setMatchmakingStatus] = useState<MatchmakingStatus>('idle');
  const [searchTime, setSearchTime] = useState(0);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);
  const [matchmakingPreferences, setMatchmakingPreferences] = useState<MatchmakingPreference[]>([
    {
      key: 'skill_based',
      label: 'Skill-based Matchmaking',
      value: true,
      type: 'boolean',
    },
    {
      key: 'deck_strength',
      label: 'Consider Deck Strength',
      value: true,
      type: 'boolean',
    },
    {
      key: 'connection_quality',
      label: 'Connection Quality',
      value: 'balanced',
      type: 'select',,
      options: ['low_latency', 'balanced', 'stable']
    },
    {
      key: 'search_range',
      label: 'Search Range',
      value: 5,
      type: 'range',,
      min: 1,
      max: 10
    }
  ]);
  const [playerProfile, setPlayerProfile] = useState<Player | null>(null);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [friends, setFriends] = useState<Player[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showMatchFound, setShowMatchFound] = useState(false);
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Physical matchmaking state
  const [physicalSessions, setPhysicalSessions] = useState<PhysicalMatchmakingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<PhysicalMatchmakingSession | null>(null);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [sessionFormData, setSessionFormData] = useState({
    location: '',
    format: 'standard' as GameFormat
  });
  const [showJoinSession, setShowJoinSession] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [nearbyPlayers, setNearbyPlayers] = useState<Player[]>([]);
  const [showNearbyPlayers, setShowNearbyPlayers] = useState(false);
  
  // Load player profile
  useEffect(() => {
    const loadPlayerProfile = async () => {
      try {
        // This would be an API call in a real implementation
        // For now, we'll use mock data
        const mockProfile: Player = {
          id: user?.uid || '1',
          name: user?.displayName || 'Player',,
          avatar: user?.photoURL || undefined,
          rank: 'gold',
          level: 42,
          experience: 12500,
          winRate: 0.58,
          region: 'na',
          online: true,
          stats: {
            wins: 250,
            losses: 180,
            draws: 20,
            winStreak: 3,
            bestWinStreak: 12,
            gamesPlayed: 450,
            tournamentWins: 5,
            favoriteDecks: ['Fire Aggro', 'Water Control'],
            favoriteCards: ['Flame Elemental', 'Water Guardian'],
            averageGameLength: 12.5
          }
        };
        
        setPlayerProfile(mockProfile);
      } catch (err) {
        console.error('Error loading player profile:', err);
        setError('Failed to load player profile');
      }
    };
    
    if (user) {
      loadPlayerProfile();
    }
  }, [user]);
  
  // Load available decks
  useEffect(() => {
    const loadDecks = async () => {
      try {
        // This would be an API call in a real implementation
        // For now, we'll use mock data
        const mockDecks: Deck[] = [
          {
            id: '1',
            name: 'Fire Aggro',,
            format: 'standard',
            cards: [],
            colors: ['fire'],
            archetype: 'Aggro',,
            winRate: 0.65,
            gamesPlayed: 120,
            lastPlayed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            isFavorite: true
          },
          {
            id: '2',
            name: 'Water Control',,
            format: 'standard',
            cards: [],
            colors: ['water'],
            archetype: 'Control',,
            winRate: 0.55,
            gamesPlayed: 85,
            lastPlayed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            isFavorite: true
          },
          {
            id: '3',
            name: 'Earth Midrange',,
            format: 'standard',
            cards: [],
            colors: ['earth'],
            archetype: 'Midrange',,
            winRate: 0.48,
            gamesPlayed: 65,
            lastPlayed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            isFavorite: false
          }
        ];
        
        setAvailableDecks(mockDecks);
        setSelectedDeck(mockDecks[0]);
      } catch (err) {
        console.error('Error loading decks:', err);
        setError('Failed to load decks');
      }
    };
    
    loadDecks();
  }, []);
  
  // Load match history
  useEffect(() => {
    const loadMatchHistory = async () => {
      try {
        // This would be an API call in a real implementation
        // For now, we'll use mock data
        const mockHistory: Match[] = [
          {
            id: '1',
            player1: {
              id: user?.uid || '1',
              name: user?.displayName || 'Player',
            },
            player2: {
              id: '2',
              name: 'Opponent 1',
            },
            winner: user?.uid || '1',
            result: '2-1',
            format: 'standard',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            duration: 15.5,
            stats: {
              player1Score: 2,
              player2Score: 1,
              turns: 12,
              cardsPlayed: 25
            }
          },
          {
            id: '2',
            player1: {
              id: user?.uid || '1',
              name: user?.displayName || 'Player',
            },
            player2: {
              id: '3',
              name: 'Opponent 2',
            },
            winner: '3',
            result: '0-2',
            format: 'standard',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            duration: 10.2,
            stats: {
              player1Score: 0,
              player2Score: 2,
              turns: 8,
              cardsPlayed: 18
            }
          },
          {
            id: '3',
            player1: {
              id: '4',
              name: 'Opponent 3',
            },
            player2: {
              id: user?.uid || '1',
              name: user?.displayName || 'Player',
            },
            winner: user?.uid || '1',
            result: '1-2',
            format: 'draft',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            duration: 22.8,
            stats: {
              player1Score: 1,
              player2Score: 2,
              turns: 18,
              cardsPlayed: 35
            }
          }
        ];
        
        setMatchHistory(mockHistory);
      } catch (err) {
        console.error('Error loading match history:', err);
        setError('Failed to load match history');
      }
    };
    
    loadMatchHistory();
  }, [user]);
  
  // Load leaderboard
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        // This would be an API call in a real implementation
        // For now, we'll use mock data
        const mockLeaderboard: Player[] = Array.from({ length: 20 }, (_, i) => ({
          id: `leaderboard-${i + 1}`,
          name: `Top Player ${i + 1}`,,
          rank: i < 3 ? 'legend' : i < 8 ? 'grandmaster' : i < 15 ? 'master' : 'diamond',
          winRate: 0.9 - (i * 0.02),
          stats: {
            wins: 500 - (i * 15),
            losses: 100 + (i * 10),
            draws: 10 + i,
            winStreak: 0,
            bestWinStreak: 30 - i,
            gamesPlayed: 610 - (i * 5),
            tournamentWins: 20 - i,
            favoriteDecks: [],
            favoriteCards: [],
            averageGameLength: 0
          }
        }));
        
        setLeaderboard(mockLeaderboard);
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError('Failed to load leaderboard');
      }
    };
    
    loadLeaderboard();
  }, []);
  
  // Load friends
  useEffect(() => {
    const loadFriends = async () => {
      try {
        // This would be an API call in a real implementation
        // For now, we'll use mock data
        const mockFriends: Player[] = Array.from({ length: 10 }, (_, i) => ({
          id: `friend-${i + 1}`,
          name: `Friend ${i + 1}`,,
          rank: ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master'][Math.floor(Math.random() * 6)] as PlayerRank,
          online: Math.random() > 0.3,
          lastActive: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
          isFriend: true
        }));
        
        setFriends(mockFriends);
        setOnlinePlayers(mockFriends.filter(friend => friend.online));
      } catch (err) {
        console.error('Error loading friends:', err);
        setError('Failed to load friends');
      }
    };
    
    loadFriends();
  }, []);
  
  // Load physical sessions
  useEffect(() => {
    const loadPhysicalSessions = async () => {
      try {
        // This would be an API call in a real implementation
        // For now, we'll use mock data
        const mockSessions: PhysicalMatchmakingSession[] = [
          {
            id: '1',
            location: 'Card Kingdom, Seattle',
            players: Array.from({ length: 8 }, (_, i) => ({
              id: `session-1-player-${i + 1}`,
              name: `Player ${i + 1}`,
            })),
            matches: [],
            status: 'active',
            startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
            format: 'standard',
            organizer: {
              id: 'organizer-1',
              name: 'Store Owner',
            }
          },
          {
            id: '2',
            location: 'Game Store, Portland',
            players: Array.from({ length: 12 }, (_, i) => ({
              id: `session-2-player-${i + 1}`,
              name: `Player ${i + 1}`,
            })),
            matches: [],
            status: 'active',
            startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
            format: 'draft',
            organizer: {
              id: 'organizer-2',
              name: 'Tournament Organizer',
            }
          }
        ];
        
        setPhysicalSessions(mockSessions);
      } catch (err) {
        console.error('Error loading physical sessions:', err);
        setError('Failed to load physical sessions');
      }
    };
    
    if (matchmakingMode === 'physical') {
      loadPhysicalSessions();
    }
  }, [matchmakingMode]);
  
  // Initialize match found audio
  useEffect(() => {
    matchFoundAudioRef.current = new Audio('/assets/match-found.mp3');
    
    return () => {
      if (matchFoundAudioRef.current) {
        matchFoundAudioRef.current.pause();
        matchFoundAudioRef.current = null;
      }
    };
  }, []);
  
  // Handle search timer
  useEffect(() => {
    if (matchmakingStatus === 'searching') {
      searchTimerRef.current = setInterval(() => {
        setSearchTime(prev => prev + 1);
        
        // Simulate finding a match after a random time between 5-15 seconds
        if (searchTime > 0 && Math.random() < 0.1 && searchTime > 5) {
          handleMatchFound();
        }
      }, 1000);
    } else {
      if (searchTimerRef.current) {
        clearInterval(searchTimerRef.current);
        searchTimerRef.current = null;
      }
      
      if (matchmakingStatus !== 'match_found') {
        setSearchTime(0);
      }
    }
    
    return () => {
      if (searchTimerRef.current) {
        clearInterval(searchTimerRef.current);
      }
    };
  }, [matchmakingStatus, searchTime]);
  
  // Format search time
  const formattedSearchTime = useMemo(() => {
    const minutes = Math.floor(searchTime / 60);
    const seconds = searchTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [searchTime]);
  
  // Start matchmaking
  const handleStartMatchmaking = () => {
    if (!selectedDeck) {
      setError('Please select a deck');
      return;
    }
    
    setMatchmakingStatus('searching');
    setError(null);
  };
  
  // Cancel matchmaking
  const handleCancelMatchmaking = () => {
    setMatchmakingStatus('idle');
  };
  
  // Handle match found
  const handleMatchFound = () => {
    // Generate a mock opponent
    const mockOpponent: Player = {
      id: `opponent-${Math.floor(Math.random() * 1000)}`,
      name: `Opponent ${Math.floor(Math.random() * 100)}`,,
      rank: ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master'][Math.floor(Math.random() * 6)] as PlayerRank,
      winRate: 0.4 + (Math.random() * 0.2)
    };
    
    // Create a mock match
    const mockMatch: Match = {
      id: `match-${Math.floor(Math.random() * 1000)}`,
      player1: playerProfile || {
        id: user?.uid || '1',
        name: user?.displayName || 'Player',
      },
      player2: mockOpponent,
      format: selectedFormat,
      date: new Date()
    };
    
    setCurrentMatch(mockMatch);
    setMatchmakingStatus('match_found');
    setShowMatchFound(true);
    
    // Play sound
    if (matchFoundAudioRef.current) {
      matchFoundAudioRef.current.play().catch(err => console.error('Error playing match found audio:', err));
    }
    
    // Call callback
    if (onMatchFound) {
      onMatchFound(mockMatch);
    }
  };
  
  // Accept match
  const handleAcceptMatch = () => {
    if (!currentMatch) return;
    
    setMatchmakingStatus('in_game');
    setShowMatchFound(false);
    
    // Call callback
    if (onMatchAccepted) {
      onMatchAccepted(currentMatch);
    }
    
    // In a real implementation, this would navigate to the game page
    // For now, we'll simulate a completed match after 3 seconds
    setTimeout(() => {
      handleMatchCompleted();
    }, 3000);
  };
  
  // Decline match
  const handleDeclineMatch = () => {
    if (!currentMatch) return;
    
    setMatchmakingStatus('idle');
    setShowMatchFound(false);
    setCurrentMatch(null);
    
    // Call callback
    if (onMatchDeclined) {
      onMatchDeclined(currentMatch);
    }
  };
  
  // Complete match
  const handleMatchCompleted = () => {
    if (!currentMatch) return;
    
    // Simulate match result
    const isWinner = Math.random() > 0.5;
    const player1Score = isWinner ? 2 : Math.floor(Math.random() * 2);
    const player2Score = isWinner ? Math.floor(Math.random() * 2) : 2;
    
    const completedMatch: Match = {
      ...currentMatch,
      winner: isWinner ? currentMatch.player1.id : currentMatch.player2.id,
      result: `${player1Score}-${player2Score}`,
      duration: 5 + Math.floor(Math.random() * 20),
      stats: {
        player1Score,
        player2Score,
        turns: 5 + Math.floor(Math.random() * 15),
        cardsPlayed: 10 + Math.floor(Math.random() * 30)
      }
    };
    
    // Update match history
    setMatchHistory(prev => [completedMatch, ...prev]);
    
    // Reset matchmaking state
    setMatchmakingStatus('completed');
    setCurrentMatch(completedMatch);
    
    // Call callback
    if (onMatchCompleted) {
      onMatchCompleted(completedMatch);
    }
    
    // After 5 seconds, reset to idle
    setTimeout(() => {
      setMatchmakingStatus('idle');
      setCurrentMatch(null);
    }, 5000);
  };
  
  // Create physical session
  const handleCreatePhysicalSession = () => {
    if (!sessionFormData.location) {
      setError('Please enter a location');
      return;
    }
    
    // Create a new session
    const newSession: PhysicalMatchmakingSession = {
      id: `session-${Math.floor(Math.random() * 1000)}`,
      location: sessionFormData.location,
      players: [{
        id: user?.uid || '1',
        name: user?.displayName || 'Player',
      }],
      matches: [],
      status: 'active',
      startTime: new Date(),
      format: sessionFormData.format,
      organizer: {
        id: user?.uid || '1',
        name: user?.displayName || 'Player',
      }
    };
    
    setPhysicalSessions(prev => [...prev, newSession]);
    setSelectedSession(newSession);
    setShowCreateSession(false);
    setSessionFormData({
      location: '',
      format: 'standard'
    });
  };
  
  // Join physical session
  const handleJoinPhysicalSession = () => {
    if (!sessionCode) {
      setError('Please enter a session code');
      return;
    }
    
    // Find the session
    const session = physicalSessions.find(s => s.id === sessionCode);
    
    if (!session) {
      setError('Invalid session code');
      return;
    }
    
    // Add player to session
    const updatedSession = {
      ...session,
      players: [...session.players, {
        id: user?.uid || '1',
        name: user?.displayName || 'Player',
      }]
    };
    
    setPhysicalSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
    setSelectedSession(updatedSession);
    setShowJoinSession(false);
    setSessionCode('');
  };
  
  // Leave physical session
  const handleLeavePhysicalSession = () => {
    if (!selectedSession) return;
    
    // Remove player from session
    const updatedSession = {
      ...selectedSession,
      players: selectedSession.players.filter(p => p.id !== (user?.uid || '1'))
    };
    
    setPhysicalSessions(prev => prev.map(s => s.id === selectedSession.id ? updatedSession : s));
    setSelectedSession(null);
  };
  
  // Toggle Bluetooth
  const handleToggleBluetooth = () => {
    setBluetoothEnabled(prev => !prev);
    
    if (!bluetoothEnabled) {
      // Simulate finding nearby players
      setTimeout(() => {
        const mockNearbyPlayers: Player[] = Array.from({ length: 5 }, (_, i) => ({
          id: `nearby-${i + 1}`,
          name: `Nearby Player ${i + 1}`,,
          rank: ['bronze', 'silver', 'gold', 'platinum', 'diamond'][Math.floor(Math.random() * 5)] as PlayerRank
        }));
        
        setNearbyPlayers(mockNearbyPlayers);
        setShowNearbyPlayers(true);
      }, 2000);
    } else {
      setNearbyPlayers([]);
      setShowNearbyPlayers(false);
    }
  };
  
  // Render online matchmaking
  const renderOnlineMatchmaking = () => {
    return (
      <div className="online-matchmaking">
        {/* Matchmaking header */}
        <div className="matchmaking-header">
          <h2>Online Matchmaking</h2>
          
          <div className="matchmaking-controls">
            {/* Format selector */}
            <div className="format-selector">
              <label>Format</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as GameFormat)}
                disabled={matchmakingStatus !== 'idle'}
              >
                <option value="standard">Standard</option>
                <option value="draft">Draft</option>
                <option value="sealed">Sealed</option>
                <option value="casual">Casual</option>
                <option value="ranked">Ranked</option>
                <option value="competitive">Competitive</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            {/* Region selector */}
            <div className="region-selector">
              <label>Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region)}
                disabled={matchmakingStatus !== 'idle'}
              >
                <option value="global">Global</option>
                <option value="na">North America</option>
                <option value="eu">Europe</option>
                <option value="asia">Asia</option>
                <option value="sa">South America</option>
                <option value="oce">Oceania</option>
              </select>
            </div>
            
            {/* Preferences button */}
            <button 
              type="button"
              onClick={() => setShowPreferences(!showPreferences)}
              className="preferences-button"
              disabled={matchmakingStatus !== 'idle'}
            >
              <Settings size={20} />
              <span>Preferences</span>
              {showPreferences ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
        
        {/* Preferences panel */}
        <AnimatePresence>
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="preferences-panel"
            >
              <h3>Matchmaking Preferences</h3>
              
              <div className="preferences-list">
                {matchmakingPreferences.map(pref => (
                  <div key={pref.key} className="preference-item">
                    <div className="preference-label">{pref.label}</div>
                    
                    {pref.type === 'boolean' && (
                      <div className="preference-toggle">
                        <input
                          type="checkbox"
                          id={`pref-${pref.key}`}
                          checked={pref.value as boolean}
                          onChange={(e) => {
                            setMatchmakingPreferences(prev => prev.map(p => 
                              p.key === pref.key ? { ...p, value: e.target.checked } : p
                            ));
                          }}
                        />
                        <label htmlFor={`pref-${pref.key}`} className="toggle-label"></label>
                      </div>
                    )}
                    
                    {pref.type === 'select' && pref.options && (
                      <select
                        value={pref.value as string}
                        onChange={(e) => {
                          setMatchmakingPreferences(prev => prev.map(p => 
                            p.key === pref.key ? { ...p, value: e.target.value } : p
                          ));
                        }}
                        className="preference-select"
                      >
                        {pref.options.map(option => (
                          <option key={option} value={option}>
                            {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {pref.type === 'range' && pref.min !== undefined && pref.max !== undefined && (
                      <div className="preference-range">
                        <input
                          type="range"
                          min={pref.min}
                          max={pref.max}
                          value={pref.value as number}
                          onChange={(e) => {
                            setMatchmakingPreferences(prev => prev.map(p => 
                              p.key === pref.key ? { ...p, value: parseInt(e.target.value) } : p
                            ));
                          }}
                          className="range-slider"
                        />
                        <span className="range-value">{pref.value}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Deck selection */}
        <div className="deck-selection">
          <h3>Select Deck</h3>
          
          {availableDecks.length === 0 ? (
            <div className="empty-decks">
              <p>You don't have any decks for this format.</p>
              <button 
                type="button"
                onClick={() => {
                  // Navigate to deck builder
                  navigate('/decks/new');
                }}
                className="create-deck-button"
              >
                <Plus size={16} />
                <span>Create Deck</span>
              </button>
            </div>
          ) : (
            <div className="decks-list">
              {availableDecks
                .filter(deck => deck.format === selectedFormat || selectedFormat === 'casual')
                .map(deck => (
                  <div 
                    key={deck.id}
                    className={`deck-card ${selectedDeck?.id === deck.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDeck(deck)}
                  >
                    <div className="deck-header">
                      <h4>{deck.name}</h4>
                      {deck.isFavorite && (
                        <Star size={16} className="favorite-icon" />
                      )}
                    </div>
                    
                    <div className="deck-colors">
                      {deck.colors.map(color => (
                        <div key={color} className={`color-icon ${color}`}></div>
                      ))}
                    </div>
                    
                    {deck.archetype && (
                      <div className="deck-archetype">{deck.archetype}</div>
                    )}
                    
                    {deck.winRate !== undefined && (
                      <div className="deck-stats">
                        <div className="win-rate">
                          <span>Win Rate:</span>
                          <span className={deck.winRate >= 0.5 ? 'positive' : 'negative'}>
                            {(deck.winRate * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        {deck.gamesPlayed !== undefined && (
                          <div className="games-played">
                            <span>Games:</span>
                            <span>{deck.gamesPlayed}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {deck.lastPlayed && (
                      <div className="last-played">
                        Last played: {new Date(deck.lastPlayed).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
        
        {/* Matchmaking status */}
        <div className="matchmaking-status">
          {matchmakingStatus === 'idle' && (
            <button 
              type="button"
              onClick={handleStartMatchmaking}
              disabled={!selectedDeck}
              className="start-matchmaking-button"
            >
              <Play size={20} />
              <span>Find Match</span>
            </button>
          )}
          
          {matchmakingStatus === 'searching' && (
            <div className="searching-status">
              <div className="search-info">
                <Loader size={24} className="searching-icon" />
                <div className="search-text">
                  <div>Searching for opponent...</div>
                  <div className="search-time">{formattedSearchTime}</div>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={handleCancelMatchmaking}
                className="cancel-search-button"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            </div>
          )}
          
          {matchmakingStatus === 'completed' && currentMatch && (
            <div className="match-completed">
              <div className="match-result">
                <div className={`result-header ${currentMatch.winner === currentMatch.player1.id ? 'victory' : 'defeat'}`}>
                  {currentMatch.winner === currentMatch.player1.id ? (
                    <>
                      <Trophy size={24} />
                      <span>Victory!</span>
                    </>
                  ) : (
                    <>
                      <X size={24} />
                      <span>Defeat</span>
                    </>
                  )}
                </div>
                
                <div className="result-score">
                  {currentMatch.result}
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setMatchmakingStatus('idle')}
                className="find-new-match-button"
              >
                <RefreshCw size={20} />
                <span>Find New Match</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Match history and stats */}
        <div className="matchmaking-extras">
          <div className="extras-buttons">
            <button 
              type="button"
              onClick={() => setShowMatchHistory(!showMatchHistory)}
              className="history-button"
            >
              <Clock size={20} />
              <span>Match History</span>
            </button>
            
            <button 
              type="button"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="leaderboard-button"
            >
              <Trophy size={20} />
              <span>Leaderboard</span>
            </button>
            
            <button 
              type="button"
              onClick={() => setShowFriends(!showFriends)}
              className="friends-button"
            >
              <Users size={20} />
              <span>Friends</span>
              {onlinePlayers.length > 0 && (
                <span className="online-count">{onlinePlayers.length}</span>
              )}
            </button>
          </div>
          
          {/* Match history panel */}
          <AnimatePresence>
            {showMatchHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="match-history-panel"
              >
                <div className="panel-header">
                  <h3>Recent Matches</h3>
                  <button 
                    type="button"
                    onClick={() => setShowMatchHistory(false)}
                    className="close-panel-button"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {matchHistory.length === 0 ? (
                  <div className="empty-history">
                    <Clock size={32} />
                    <p>No match history available.</p>
                  </div>
                ) : (
                  <div className="match-list">
                    {matchHistory.map(match => {
                      const isPlayer1 = match.player1.id === (user?.uid || '1');
                      const player = isPlayer1 ? match.player1 : match.player2;
                      const opponent = isPlayer1 ? match.player2 : match.player1;
                      const playerScore = isPlayer1 ? match.stats?.player1Score : match.stats?.player2Score;
                      const opponentScore = isPlayer1 ? match.stats?.player2Score : match.stats?.player1Score;
                      const isWinner = match.winner === player.id;
                      
                      return (
                        <div key={match.id} className={`match-item ${isWinner ? 'victory' : 'defeat'}`}>
                          <div className="match-header">
                            <div className="match-format">{match.format}</div>
                            <div className="match-date">{new Date(match.date).toLocaleDateString()}</div>
                          </div>
                          
                          <div className="match-players">
                            <div className="match-player">
                              <div className="player-avatar">
                                {player.avatar ? (
                                  <img src={player.avatar} alt={player.name} />
                                ) : (
                                  <User size={20} />
                                )}
                              </div>
                              <div className="player-name">{player.name}</div>
                              {playerScore !== undefined && (
                                <div className="player-score">{playerScore}</div>
                              )}
                            </div>
                            
                            <div className="match-vs">vs</div>
                            
                            <div className="match-player">
                              <div className="player-avatar">
                                {opponent.avatar ? (
                                  <img src={opponent.avatar} alt={opponent.name} />
                                ) : (
                                  <User size={20} />
                                )}
                              </div>
                              <div className="player-name">{opponent.name}</div>
                              {opponentScore !== undefined && (
                                <div className="player-score">{opponentScore}</div>
                              )}
                            </div>
                          </div>
                          
                          {match.duration && (
                            <div className="match-duration">
                              <Clock size={16} />
                              <span>{match.duration.toFixed(1)} min</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Leaderboard panel */}
          <AnimatePresence>
            {showLeaderboard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="leaderboard-panel"
              >
                <div className="panel-header">
                  <h3>Leaderboard</h3>
                  <button 
                    type="button"
                    onClick={() => setShowLeaderboard(false)}
                    className="close-panel-button"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="leaderboard-list">
                  {leaderboard.map((player, index) => (
                    <div 
                      key={player.id}
                      className="leaderboard-item"
                      onClick={() => {
                        setSelectedPlayer(player);
                        setShowPlayerProfile(true);
                      }}
                    >
                      <div className="leaderboard-rank">
                        {index + 1}
                      </div>
                      
                      <div className="leaderboard-player">
                        <div className="player-avatar">
                          {player.avatar ? (
                            <img src={player.avatar} alt={player.name} />
                          ) : (
                            <User size={20} />
                          )}
                        </div>
                        <div className="player-info">
                          <div className="player-name">{player.name}</div>
                          <div className="player-rank">{player.rank}</div>
                        </div>
                      </div>
                      
                      <div className="leaderboard-stats">
                        <div className="win-rate">
                          {(player.winRate! * 100).toFixed(1)}%
                        </div>
                        <div className="record">
                          {player.stats?.wins}-{player.stats?.losses}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Friends panel */}
          <AnimatePresence>
            {showFriends && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="friends-panel"
              >
                <div className="panel-header">
                  <h3>Friends</h3>
                  <button 
                    type="button"
                    onClick={() => setShowFriends(false)}
                    className="close-panel-button"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {friends.length === 0 ? (
                  <div className="empty-friends">
                    <Users size={32} />
                    <p>No friends found.</p>
                    <button 
                      type="button"
                      className="add-friend-button"
                    >
                      <UserPlus size={16} />
                      <span>Add Friend</span>
                    </button>
                  </div>
                ) : (
                  <div className="friends-list">
                    {friends.map(friend => (
                      <div 
                        key={friend.id}
                        className="friend-item"
                        onClick={() => {
                          setSelectedPlayer(friend);
                          setShowPlayerProfile(true);
                        }}
                      >
                        <div className="friend-avatar">
                          {friend.avatar ? (
                            <img src={friend.avatar} alt={friend.name} />
                          ) : (
                            <User size={20} />
                          )}
                          <div className={`status-indicator ${friend.online ? 'online' : 'offline'}`}></div>
                        </div>
                        
                        <div className="friend-info">
                          <div className="friend-name">{friend.name}</div>
                          <div className="friend-status">
                            {friend.online ? (
                              <span className="online-status">Online</span>
                            ) : (
                              <span className="offline-status">
                                Last online: {new Date(friend.lastActive!).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="friend-actions">
                          {friend.online && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Challenge friend
                              }}
                              className="challenge-button"
                            >
                              <Sword size={16} />
                            </button>
                          )}
                          
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Message friend
                            }}
                            className="message-button"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Match found modal */}
        <AnimatePresence>
          {showMatchFound && currentMatch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="match-found-modal"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="match-found-content"
              >
                <div className="match-found-header">
                  <h2>Match Found!</h2>
                </div>
                
                <div className="match-players">
                  <div className="match-player">
                    <div className="player-avatar">
                      {currentMatch.player1.avatar ? (
                        <img src={currentMatch.player1.avatar} alt={currentMatch.player1.name} />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                    <div className="player-name">{currentMatch.player1.name}</div>
                    {currentMatch.player1.rank && (
                      <div className="player-rank">{currentMatch.player1.rank}</div>
                    )}
                  </div>
                  
                  <div className="match-vs">vs</div>
                  
                  <div className="match-player">
                    <div className="player-avatar">
                      {currentMatch.player2.avatar ? (
                        <img src={currentMatch.player2.avatar} alt={currentMatch.player2.name} />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                    <div className="player-name">{currentMatch.player2.name}</div>
                    {currentMatch.player2.rank && (
                      <div className="player-rank">{currentMatch.player2.rank}</div>
                    )}
                  </div>
                </div>
                
                <div className="match-info">
                  <div className="match-format">
                    <span>Format:</span>
                    <span>{currentMatch.format}</span>
                  </div>
                </div>
                
                <div className="match-actions">
                  <button 
                    type="button"
                    onClick={handleDeclineMatch}
                    className="decline-match-button"
                  >
                    <X size={20} />
                    <span>Decline</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={handleAcceptMatch}
                    className="accept-match-button"
                  >
                    <Check size={20} />
                    <span>Accept</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Player profile modal */}
        <AnimatePresence>
          {showPlayerProfile && selectedPlayer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="player-profile-modal"
              onClick={() => setShowPlayerProfile(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="player-profile-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="profile-header">
                  <h2>Player Profile</h2>
                  <button 
                    type="button"
                    onClick={() => setShowPlayerProfile(false)}
                    className="close-profile-button"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="profile-info">
                  <div className="profile-avatar">
                    {selectedPlayer.avatar ? (
                      <img src={selectedPlayer.avatar} alt={selectedPlayer.name} />
                    ) : (
                      <User size={64} />
                    )}
                  </div>
                  
                  <div className="profile-details">
                    <h3>{selectedPlayer.name}</h3>
                    
                    {selectedPlayer.rank && (
                      <div className="profile-rank">
                        <span>Rank:</span>
                        <span className={`rank ${selectedPlayer.rank}`}>{selectedPlayer.rank}</span>
                      </div>
                    )}
                    
                    {selectedPlayer.level && (
                      <div className="profile-level">
                        <span>Level:</span>
                        <span>{selectedPlayer.level}</span>
                      </div>
                    )}
                    
                    {selectedPlayer.winRate && (
                      <div className="profile-win-rate">
                        <span>Win Rate:</span>
                        <span className={selectedPlayer.winRate >= 0.5 ? 'positive' : 'negative'}>
                          {(selectedPlayer.winRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                    
                    {selectedPlayer.region && (
                      <div className="profile-region">
                        <span>Region:</span>
                        <span>{selectedPlayer.region.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedPlayer.stats && (
                  <div className="profile-stats">
                    <h3>Statistics</h3>
                    
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span>Games Played:</span>
                        <span>{selectedPlayer.stats.gamesPlayed}</span>
                      </div>
                      
                      <div className="stat-item">
                        <span>Record:</span>
                        <span>{selectedPlayer.stats.wins}-{selectedPlayer.stats.losses}{selectedPlayer.stats.draws > 0 ? `-${selectedPlayer.stats.draws}` : ''}</span>
                      </div>
                      
                      <div className="stat-item">
                        <span>Win Streak:</span>
                        <span>{selectedPlayer.stats.winStreak}</span>
                      </div>
                      
                      <div className="stat-item">
                        <span>Best Streak:</span>
                        <span>{selectedPlayer.stats.bestWinStreak}</span>
                      </div>
                      
                      <div className="stat-item">
                        <span>Tournament Wins:</span>
                        <span>{selectedPlayer.stats.tournamentWins}</span>
                      </div>
                      
                      {selectedPlayer.stats.averageGameLength > 0 && (
                        <div className="stat-item">
                          <span>Avg. Game Length:</span>
                          <span>{selectedPlayer.stats.averageGameLength.toFixed(1)} min</span>
                        </div>
                      )}
                    </div>
                    
                    {selectedPlayer.stats.favoriteDecks && selectedPlayer.stats.favoriteDecks.length > 0 && (
                      <div className="favorite-decks">
                        <h4>Favorite Decks</h4>
                        <div className="favorites-list">
                          {selectedPlayer.stats.favoriteDecks.map((deck, index) => (
                            <div key={index} className="favorite-item">{deck}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedPlayer.stats.favoriteCards && selectedPlayer.stats.favoriteCards.length > 0 && (
                      <div className="favorite-cards">
                        <h4>Favorite Cards</h4>
                        <div className="favorites-list">
                          {selectedPlayer.stats.favoriteCards.map((card, index) => (
                            <div key={index} className="favorite-item">{card}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="profile-actions">
                  {!selectedPlayer.isFriend && (
                    <button 
                      type="button"
                      className="add-friend-button"
                    >
                      <UserPlus size={16} />
                      <span>Add Friend</span>
                    </button>
                  )}
                  
                  {selectedPlayer.online && (
                    <button 
                      type="button"
                      className="challenge-button"
                    >
                      <Sword size={16} />
                      <span>Challenge</span>
                    </button>
                  )}
                  
                  <button 
                    type="button"
                    className="message-button"
                  >
                    <MessageSquare size={16} />
                    <span>Message</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  // Render physical matchmaking
  const renderPhysicalMatchmaking = () => {
    return (
      <div className="physical-matchmaking">
        {/* Physical matchmaking header */}
        <div className="matchmaking-header">
          <h2>Physical Matchmaking</h2>
          
          <div className="matchmaking-controls">
            {/* Bluetooth toggle */}
            <button 
              type="button"
              onClick={handleToggleBluetooth}
              className={`bluetooth-button ${bluetoothEnabled ? 'enabled' : 'disabled'}`}
            >
              {bluetoothEnabled ? <Bluetooth size={20} /> : <BluetoothOff size={20} />}
              <span>{bluetoothEnabled ? 'Bluetooth On' : 'Bluetooth Off'}</span>
            </button>
            
            {/* QR code button */}
            <button 
              type="button"
              onClick={() => setShowQRCode(!showQRCode)}
              className="qr-code-button"
            >
              <Smartphone size={20} />
              <span>Show QR Code</span>
            </button>
          </div>
        </div>
        
        {/* Session management */}
        {!selectedSession ? (
          <div className="session-management">
            <div className="session-actions">
              <button 
                type="button"
                onClick={() => setShowCreateSession(true)}
                className="create-session-button"
              >
                <Plus size={20} />
                <span>Create Session</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setShowJoinSession(true)}
                className="join-session-button"
              >
                <UserPlus size={20} />
                <span>Join Session</span>
              </button>
            </div>
            
            {/* Available sessions */}
            {physicalSessions.length > 0 && (
              <div className="available-sessions">
                <h3>Available Sessions</h3>
                
                <div className="sessions-list">
                  {physicalSessions.map(session => (
                    <div 
                      key={session.id}
                      className="session-card"
                      onClick={() => setSelectedSession(session)}
                    >
                      <div className="session-header">
                        <div className="session-location">
                          <MapPin size={16} />
                          <span>{session.location}</span>
                        </div>
                        <div className="session-format">{session.format}</div>
                      </div>
                      
                      <div className="session-details">
                        <div className="session-players">
                          <Users size={16} />
                          <span>{session.players.length} Players</span>
                        </div>
                        
                        <div className="session-time">
                          <Clock size={16} />
                          <span>Started {new Date(session.startTime).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      
                      <div className="session-organizer">
                        <User size={16} />
                        <span>Organized by {session.organizer.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="active-session">
            <div className="session-header">
              <h3>{selectedSession.location}</h3>
              
              <div className="session-info">
                <div className="session-format">{selectedSession.format}</div>
                <div className="session-time">
                  <Clock size={16} />
                  <span>Started {new Date(selectedSession.startTime).toLocaleTimeString()}</span>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={handleLeavePhysicalSession}
                className="leave-session-button"
              >
                <UserX size={16} />
                <span>Leave Session</span>
              </button>
            </div>
            
            <div className="session-content">
              <div className="session-players">
                <h4>Players ({selectedSession.players.length})</h4>
                
                <div className="players-list">
                  {selectedSession.players.map(player => (
                    <div key={player.id} className="player-item">
                      <div className="player-avatar">
                        {player.avatar ? (
                          <img src={player.avatar} alt={player.name} />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div className="player-name">{player.name}</div>
                      {player.id === selectedSession.organizer.id && (
                        <div className="organizer-badge">Organizer</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="session-matches">
                <h4>Matches</h4>
                
                {selectedSession.matches.length === 0 ? (
                  <div className="empty-matches">
                    <p>No matches have been created yet.</p>
                    {selectedSession.organizer.id === (user?.uid || '1') && (
                      <button 
                        type="button"
                        className="create-match-button"
                      >
                        <Plus size={16} />
                        <span>Create Match</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="matches-list">
                    {selectedSession.matches.map(match => (
                      <div key={match.id} className="match-item">
                        <div className="match-players">
                          <div className="match-player">
                            <div className="player-avatar">
                              {match.player1.avatar ? (
                                <img src={match.player1.avatar} alt={match.player1.name} />
                              ) : (
                                <User size={20} />
                              )}
                            </div>
                            <div className="player-name">{match.player1.name}</div>
                          </div>
                          
                          <div className="match-vs">vs</div>
                          
                          <div className="match-player">
                            <div className="player-avatar">
                              {match.player2.avatar ? (
                                <img src={match.player2.avatar} alt={match.player2.name} />
                              ) : (
                                <User size={20} />
                              )}
                            </div>
                            <div className="player-name">{match.player2.name}</div>
                          </div>
                        </div>
                        
                        {match.result ? (
                          <div className="match-result">{match.result}</div>
                        ) : (
                          <button 
                            type="button"
                            className="report-result-button"
                          >
                            <CheckCircle size={16} />
                            <span>Report Result</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Nearby players */}
        <AnimatePresence>
          {showNearbyPlayers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="nearby-players-panel"
            >
              <div className="panel-header">
                <h3>Nearby Players</h3>
                <button 
                  type="button"
                  onClick={() => setShowNearbyPlayers(false)}
                  className="close-panel-button"
                >
                  <X size={16} />
                </button>
              </div>
              
              {nearbyPlayers.length === 0 ? (
                <div className="empty-nearby">
                  <Bluetooth size={32} />
                  <p>Searching for nearby players...</p>
                  <Loader size={24} className="searching-icon" />
                </div>
              ) : (
                <div className="nearby-list">
                  {nearbyPlayers.map(player => (
                    <div key={player.id} className="nearby-player">
                      <div className="player-avatar">
                        {player.avatar ? (
                          <img src={player.avatar} alt={player.name} />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      
                      <div className="player-info">
                        <div className="player-name">{player.name}</div>
                        {player.rank && (
                          <div className="player-rank">{player.rank}</div>
                        )}
                      </div>
                      
                      <button 
                        type="button"
                        className="challenge-button"
                      >
                        <Sword size={16} />
                        <span>Challenge</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Create session modal */}
        <AnimatePresence>
          {showCreateSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setShowCreateSession(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Create Session</h2>
                  <button 
                    type="button"
                    onClick={() => setShowCreateSession(false)}
                    className="close-button"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="modal-body">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreatePhysicalSession();
                  }}>
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        value={sessionFormData.location}
                        onChange={(e) => setSessionFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter location name"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="format">Format</label>
                      <select
                        id="format"
                        value={sessionFormData.format}
                        onChange={(e) => setSessionFormData(prev => ({ ...prev, format: e.target.value as GameFormat }))}
                      >
                        <option value="standard">Standard</option>
                        <option value="draft">Draft</option>
                        <option value="sealed">Sealed</option>
                        <option value="casual">Casual</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button"
                        onClick={() => setShowCreateSession(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="create-button"
                      >
                        Create Session
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Join session modal */}
        <AnimatePresence>
          {showJoinSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setShowJoinSession(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Join Session</h2>
                  <button 
                    type="button"
                    onClick={() => setShowJoinSession(false)}
                    className="close-button"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="modal-body">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleJoinPhysicalSession();
                  }}>
                    <div className="form-group">
                      <label htmlFor="sessionCode">Session Code</label>
                      <input
                        type="text"
                        id="sessionCode"
                        value={sessionCode}
                        onChange={(e) => setSessionCode(e.target.value)}
                        placeholder="Enter session code"
                        required
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button"
                        onClick={() => setShowJoinSession(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="join-button"
                      >
                        Join Session
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* QR code modal */}
        <AnimatePresence>
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setShowQRCode(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>QR Code</h2>
                  <button 
                    type="button"
                    onClick={() => setShowQRCode(false)}
                    className="close-button"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="qr-code-container">
                    {/* This would be an actual QR code in a real implementation */}
                    <div className="qr-code-placeholder">
                      <div className="qr-code-grid">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div key={i} className="qr-code-row">
                            {Array.from({ length: 10 }, (_, j) => (
                              <div 
                                key={j} 
                                className={`qr-code-cell ${Math.random() > 0.5 ? 'filled' : ''}`}
                              ></div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <p className="qr-code-info">
                      Scan this code with the KONIVRER app to join your session.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  // Render tournament matchmaking
  const renderTournamentMatchmaking = () => {
    return (
      <div className="tournament-matchmaking">
        <h2>Tournament Matchmaking</h2>
        <p>Tournament matchmaking is not available in this demo.</p>
      </div>
    );
  };
  
  // Render mobile matchmaking
  const renderMobileMatchmaking = () => {
    return (
      <div className="mobile-matchmaking">
        {/* Mode tabs */}
        <div className="mode-tabs">
          <button 
            type="button"
            onClick={() => setMatchmakingMode('online')}
            className={`mode-tab ${matchmakingMode === 'online' ? 'active' : ''}`}
          >
            <Wifi size={20} />
            <span>Online</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setMatchmakingMode('physical')}
            className={`mode-tab ${matchmakingMode === 'physical' ? 'active' : ''}`}
          >
            <Users size={20} />
            <span>Physical</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setMatchmakingMode('tournament')}
            className={`mode-tab ${matchmakingMode === 'tournament' ? 'active' : ''}`}
          >
            <Trophy size={20} />
            <span>Tournament</span>
          </button>
        </div>
        
        {/* Content based on mode */}
        <div className="mobile-content">
          {matchmakingMode === 'online' && renderOnlineMatchmaking()}
          {matchmakingMode === 'physical' && renderPhysicalMatchmaking()}
          {matchmakingMode === 'tournament' && renderTournamentMatchmaking()}
        </div>
      </div>
    );
  };
  
  // Render standalone matchmaking
  const renderStandaloneMatchmaking = () => {
    return (
      <div className="standalone-matchmaking">
        <div className="standalone-header">
          <h2>KONIVRER Matchmaking</h2>
          
          <div className="mode-selector">
            <button 
              type="button"
              onClick={() => setMatchmakingMode('online')}
              className={`mode-button ${matchmakingMode === 'online' ? 'active' : ''}`}
            >
              <Wifi size={20} />
              <span>Online</span>
            </button>
            
            <button 
              type="button"
              onClick={() => setMatchmakingMode('physical')}
              className={`mode-button ${matchmakingMode === 'physical' ? 'active' : ''}`}
            >
              <Users size={20} />
              <span>Physical</span>
            </button>
          </div>
        </div>
        
        <div className="standalone-content">
          {matchmakingMode === 'online' ? (
            <div className="quick-matchmaking">
              <div className="format-buttons">
                {['standard', 'draft', 'sealed', 'casual', 'ranked'].map(format => (
                  <button 
                    key={format}
                    type="button"
                    onClick={() => setSelectedFormat(format as GameFormat)}
                    className={`format-button ${selectedFormat === format ? 'active' : ''}`}
                    disabled={matchmakingStatus !== 'idle'}
                  >
                    {format.charAt(0).toUpperCase() + format.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="deck-selector">
                <h3>Select Deck</h3>
                
                <div className="quick-decks">
                  {availableDecks
                    .filter(deck => deck.format === selectedFormat || selectedFormat === 'casual')
                    .map(deck => (
                      <button 
                        key={deck.id}
                        type="button"
                        onClick={() => setSelectedDeck(deck)}
                        className={`deck-button ${selectedDeck?.id === deck.id ? 'active' : ''}`}
                        disabled={matchmakingStatus !== 'idle'}
                      >
                        <div className="deck-name">{deck.name}</div>
                        <div className="deck-colors">
                          {deck.colors.map(color => (
                            <div key={color} className={`color-dot ${color}`}></div>
                          ))}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
              
              <div className="matchmaking-controls">
                {matchmakingStatus === 'idle' && (
                  <button 
                    type="button"
                    onClick={handleStartMatchmaking}
                    disabled={!selectedDeck}
                    className="start-matchmaking-button"
                  >
                    <Play size={24} />
                    <span>Find Match</span>
                  </button>
                )}
                
                {matchmakingStatus === 'searching' && (
                  <div className="searching-status">
                    <div className="search-info">
                      <Loader size={24} className="searching-icon" />
                      <div className="search-text">
                        <div>Searching for opponent...</div>
                        <div className="search-time">{formattedSearchTime}</div>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={handleCancelMatchmaking}
                      className="cancel-search-button"
                    >
                      <X size={24} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
                
                {matchmakingStatus === 'completed' && currentMatch && (
                  <div className="match-completed">
                    <div className="match-result">
                      <div className={`result-header ${currentMatch.winner === currentMatch.player1.id ? 'victory' : 'defeat'}`}>
                        {currentMatch.winner === currentMatch.player1.id ? (
                          <>
                            <Trophy size={24} />
                            <span>Victory!</span>
                          </>
                        ) : (
                          <>
                            <X size={24} />
                            <span>Defeat</span>
                          </>
                        )}
                      </div>
                      
                      <div className="result-score">
                        {currentMatch.result}
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => setMatchmakingStatus('idle')}
                      className="find-new-match-button"
                    >
                      <RefreshCw size={24} />
                      <span>Find New Match</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="quick-physical">
              <div className="bluetooth-section">
                <button 
                  type="button"
                  onClick={handleToggleBluetooth}
                  className={`bluetooth-button ${bluetoothEnabled ? 'enabled' : 'disabled'}`}
                >
                  {bluetoothEnabled ? <Bluetooth size={24} /> : <BluetoothOff size={24} />}
                  <span>{bluetoothEnabled ? 'Bluetooth On' : 'Bluetooth Off'}</span>
                </button>
                
                {bluetoothEnabled && (
                  <div className="nearby-status">
                    <Loader size={20} className="searching-icon" />
                    <span>Searching for nearby players...</span>
                  </div>
                )}
              </div>
              
              <div className="session-buttons">
                <button 
                  type="button"
                  onClick={() => setShowCreateSession(true)}
                  className="create-session-button"
                >
                  <Plus size={20} />
                  <span>Create Session</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowJoinSession(true)}
                  className="join-session-button"
                >
                  <UserPlus size={20} />
                  <span>Join Session</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowQRCode(true)}
                  className="qr-code-button"
                >
                  <Smartphone size={20} />
                  <span>Show QR Code</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render enhanced matchmaking
  const renderEnhancedMatchmaking = () => {
    return (
      <div className="enhanced-matchmaking">
        {/* Mode tabs */}
        <div className="mode-tabs">
          <button 
            type="button"
            onClick={() => setMatchmakingMode('online')}
            className={`mode-tab ${matchmakingMode === 'online' ? 'active' : ''}`}
          >
            <Wifi size={20} />
            <span>Online</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setMatchmakingMode('physical')}
            className={`mode-tab ${matchmakingMode === 'physical' ? 'active' : ''}`}
          >
            <Users size={20} />
            <span>Physical</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setMatchmakingMode('tournament')}
            className={`mode-tab ${matchmakingMode === 'tournament' ? 'active' : ''}`}
          >
            <Trophy size={20} />
            <span>Tournament</span>
          </button>
        </div>
        
        {/* Content based on mode */}
        <div className="enhanced-content">
          {matchmakingMode === 'online' && renderOnlineMatchmaking()}
          {matchmakingMode === 'physical' && renderPhysicalMatchmaking()}
          {matchmakingMode === 'tournament' && renderTournamentMatchmaking()}
        </div>
        
        {/* Player profile sidebar */}
        {playerProfile && (
          <div className="player-sidebar">
            <div className="sidebar-header">
              <h3>Your Profile</h3>
            </div>
            
            <div className="sidebar-profile">
              <div className="profile-avatar">
                {playerProfile.avatar ? (
                  <img src={playerProfile.avatar} alt={playerProfile.name} />
                ) : (
                  <User size={48} />
                )}
              </div>
              
              <div className="profile-info">
                <div className="profile-name">{playerProfile.name}</div>
                
                {playerProfile.rank && (
                  <div className="profile-rank">
                    <span className={`rank ${playerProfile.rank}`}>{playerProfile.rank}</span>
                  </div>
                )}
                
                {playerProfile.level && (
                  <div className="profile-level">
                    <span>Level {playerProfile.level}</span>
                  </div>
                )}
              </div>
            </div>
            
            {playerProfile.stats && (
              <div className="sidebar-stats">
                <div className="stat-item">
                  <span>Record:</span>
                  <span>{playerProfile.stats.wins}-{playerProfile.stats.losses}{playerProfile.stats.draws > 0 ? `-${playerProfile.stats.draws}` : ''}</span>
                </div>
                
                <div className="stat-item">
                  <span>Win Rate:</span>
                  <span className={playerProfile.winRate! >= 0.5 ? 'positive' : 'negative'}>
                    {(playerProfile.winRate! * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="stat-item">
                  <span>Win Streak:</span>
                  <span>{playerProfile.stats.winStreak}</span>
                </div>
              </div>
            )}
            
            <div className="sidebar-actions">
              <button 
                type="button"
                onClick={() => {
                  setSelectedPlayer(playerProfile);
                  setShowPlayerProfile(true);
                }}
                className="view-profile-button"
              >
                <User size={16} />
                <span>View Full Profile</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setShowMatchHistory(!showMatchHistory)}
                className="history-button"
              >
                <Clock size={16} />
                <span>Match History</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render error message
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="error-message">
        <AlertCircle size={20} />
        <span>{error}</span>
        <button 
          type="button"
          onClick={() => setError(null)}
          className="close-error-button"
        >
          <X size={16} />
        </button>
      </div>
    );
  };
  
  // Render the appropriate variant
  switch (actualVariant) {
    case 'mobile':
      return (
        <div className={`unified-matchmaking mobile-variant ${className}`}>
          {renderError()}
          {renderMobileMatchmaking()}
        </div>
      );
    case 'physical':
      return (
        <div className={`unified-matchmaking physical-variant ${className}`}>
          {renderError()}
          {renderPhysicalMatchmaking()}
        </div>
      );
    case 'standalone':
      return (
        <div className={`unified-matchmaking standalone-variant ${className}`}>
          {renderError()}
          {renderStandaloneMatchmaking()}
        </div>
      );
    case 'enhanced':
      return (
        <div className={`unified-matchmaking enhanced-variant ${className}`}>
          {renderError()}
          {renderEnhancedMatchmaking()}
        </div>
      );
    default:
      return (
        <div className={`unified-matchmaking standard-variant ${className}`}>
          {renderError()}
          <div className="mode-selector">
            <button 
              type="button"
              onClick={() => setMatchmakingMode('online')}
              className={`mode-button ${matchmakingMode === 'online' ? 'active' : ''}`}
            >
              <Wifi size={20} />
              <span>Online</span>
            </button>
            
            <button 
              type="button"
              onClick={() => setMatchmakingMode('physical')}
              className={`mode-button ${matchmakingMode === 'physical' ? 'active' : ''}`}
            >
              <Users size={20} />
              <span>Physical</span>
            </button>
            
            <button 
              type="button"
              onClick={() => setMatchmakingMode('tournament')}
              className={`mode-button ${matchmakingMode === 'tournament' ? 'active' : ''}`}
            >
              <Trophy size={20} />
              <span>Tournament</span>
            </button>
          </div>
          
          {matchmakingMode === 'online' && renderOnlineMatchmaking()}
          {matchmakingMode === 'physical' && renderPhysicalMatchmaking()}
          {matchmakingMode === 'tournament' && renderTournamentMatchmaking()}
        </div>
      );
  }
};

export default UnifiedMatchmaking;