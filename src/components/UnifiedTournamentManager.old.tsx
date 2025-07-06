import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Unified Tournament Manager
 * 
 * A unified tournament management component that combines functionality from:
 * - TournamentManager
 * - EnhancedTournamentManager
 * - LiveTournamentBracket
 * - TournamentBrowser
 * - TournamentNotifications
 * - MobileJudgeTools
 * - RegistrationCodes
 * - TournamentTemplates
 * 
 * Features:
 * - Tournament creation and management
 * - Live tournament brackets
 * - Registration and check-in
 * - Judge tools and admin controls
 * - Tournament templates
 * - Mobile-friendly interface
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuth } from '../contexts/AuthContext';

// Import icons
import { Calendar, Users, Award, Clock, MapPin, Edit, Trash, Plus, Check, X, ChevronDown, ChevronUp, ChevronRight, Search, Filter, Settings, Copy, Download, RefreshCw, AlertCircle, CheckCircle, Info, Zap, Trophy, Printer, FileText, User, UserPlus, UserCheck, UserX, Loader } from 'lucide-react';

// Tournament types
type TournamentFormat = 'swiss' | 'single-elimination' | 'double-elimination' | 'round-robin' | 'custom';
type TournamentStatus = 'upcoming' | 'registration' | 'check-in' | 'in-progress' | 'completed' | 'cancelled';

interface Player {
  id: string;
  name: string;,
  displayName?: string;
  avatar?: string;
  confirmed?: boolean;
  checkedIn?: boolean;
  seed?: number;
  dropped?: boolean;
  disqualified?: boolean;
  standing?: number;
  record?: {
    wins: number;
    losses: number;
    draws: number;
  };
  tiebreakers?: {
    opponentMatchWinPercentage?: number;
    gameWinPercentage?: number;
    opponentGameWinPercentage?: number;
  };
  decklist?: any;
}

interface Match {
  id: string;
  roundNumber: number;
  tableNumber?: number;
  player1Id: string;
  player2Id: string;
  winner?: string;
  result?: string;
  scores?: {
    player1: number;
    player2: number;
  };
  status: 'scheduled' | 'in-progress' | 'completed' | 'reported' | 'verified';
  startTime?: Date;
  endTime?: Date;
  timeExtension?: number;
}

interface Round {
  number: number;
  status: 'scheduled' | 'in-progress' | 'completed';
  startTime?: Date;
  endTime?: Date;
  matches: Match[];
  pairings?: any[];
}

interface Tournament {
  id: string;
  name: string;,
  format: TournamentFormat;
  status: TournamentStatus;
  description?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  maxPlayers?: number;
  currentPlayers: number;
  rounds?: number;
  currentRound?: number;
  registrationDeadline?: Date;
  checkInStart?: Date;
  checkInEnd?: Date;
  organizer: {
    id: string;
    name: string;,
  };
  judges?: {
    id: string;
    name: string;,
  }[];
  players: Player[];
  rounds?: Round[];
  prizes?: string;
  rules?: string;
  registrationCode?: string;
  isPublic: boolean;
  tags?: string[];
  image?: string;
}

interface TournamentTemplate {
  id: string;
  name: string;,
  format: TournamentFormat;
  description?: string;
  rounds?: number;
  rules?: string;
  prizes?: string;
  tags?: string[];
}

interface RegistrationCode {
  code: string;
  tournamentId: string;
  tournamentName: string;
  expiresAt?: Date;
  maxUses?: number;
  currentUses: number;
  createdBy: string;
}

interface UnifiedTournamentManagerProps {
  variant?: 'standard' | 'enhanced' | 'mobile' | 'judge' | 'browser' | 'live';
  tournamentId?: string;
  isAdmin?: boolean;
  isJudge?: boolean;
  onTournamentSelect?: (tournament: Tournament) => void;
  onCreateTournament?: (tournament: any) => void;
  onUpdateTournament?: (tournament: any) => void;
  onDeleteTournament?: (tournamentId: string) => void;
  className?: string;
}

const UnifiedTournamentManager: React.FC<UnifiedTournamentManagerProps> = ({
  variant = 'standard',
  tournamentId,
  isAdmin = false,
  isJudge = false,
  onTournamentSelect,
  onCreateTournament,
  onUpdateTournament,
  onDeleteTournament,
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
  
  // State
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    format?: TournamentFormat;
    status?: TournamentStatus;
    timeFrame?: 'today' | 'this-week' | 'this-month' | 'upcoming' | 'past' | 'all';
  }>({
    timeFrame: 'upcoming'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [templates, setTemplates] = useState<TournamentTemplate[]>([]);
  const [registrationCodes, setRegistrationCodes] = useState<RegistrationCode[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',,
    format: 'swiss' as TournamentFormat,
    description: '',
    location: '',
    startDate: new Date(),
    maxPlayers: 32,
    rounds: 0,
    registrationDeadline: new Date(),
    checkInStart: new Date(),
    checkInEnd: new Date(),
    prizes: '',
    rules: '',
    isPublic: true,
    tags: [] as string[]
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'rounds' | 'standings' | 'bracket' | 'admin'>('overview');
  const [showPlayerDetails, setShowPlayerDetails] = useState<string | null>(null);
  const [showMatchDetails, setShowMatchDetails] = useState<string | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [matchResult, setMatchResult] = useState({
    player1Score: 0,
    player2Score: 0,
    winner: '',
    draws: 0
  });
  const [showConfirmation, setShowConfirmation] = useState<{
    type: 'delete-tournament' | 'drop-player' | 'disqualify-player' | 'cancel-tournament' | 'finalize-tournament';,
    id: string;
    message: string;
  } | null>(null);
  
  // Fetch tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // This would be an API call in a real implementation
        // For now, we'll use mock data
        const mockTournaments: Tournament[] = [
          {
            id: '1',
            name: 'KONIVRER Championship Series',,
            format: 'swiss',
            status: 'upcoming',
            description: 'The premier KONIVRER tournament series',
            location: 'Online',
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            maxPlayers: 128,
            currentPlayers: 64,
            organizer: {
              id: '1',
              name: 'KONIVRER Official',
            },
            players: [],
            isPublic: true,
            tags: ['official', 'championship']
          },
          {
            id: '2',
            name: 'Local Game Store Weekly',,
            format: 'single-elimination',
            status: 'registration',
            description: 'Weekly tournament at your local game store',
            location: 'Card Kingdom, Seattle',
            startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            maxPlayers: 32,
            currentPlayers: 12,
            organizer: {
              id: '2',
              name: 'Card Kingdom',
            },
            players: [],
            isPublic: true,
            tags: ['weekly', 'casual']
          },
          {
            id: '3',
            name: 'KONIVRER Online Cup',,
            format: 'double-elimination',
            status: 'in-progress',
            description: 'Monthly online cup with prizes',
            location: 'Online',
            startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            maxPlayers: 64,
            currentPlayers: 64,
            currentRound: 3,
            organizer: {
              id: '1',
              name: 'KONIVRER Official',
            },
            players: [],
            isPublic: true,
            tags: ['online', 'competitive']
          }
        ];
        
        setTournaments(mockTournaments);
        
        // If tournamentId is provided, select that tournament
        if (tournamentId) {
          const tournament = mockTournaments.find(t => t.id === tournamentId);
          if (tournament) {
            setSelectedTournament(tournament);
          } else {
            setError(`Tournament with ID ${tournamentId} not found`);
          }
        }
      } catch (err) {
        console.error('Error fetching tournaments:', err);
        setError('Failed to fetch tournaments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTournaments();
  }, [tournamentId]);
  
  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // This would be an API call in a real implementation
        // For now, we'll use mock data
        const mockTemplates: TournamentTemplate[] = [
          {
            id: '1',
            name: 'Standard Swiss',,
            format: 'swiss',
            description: 'Standard Swiss tournament with top 8 cut',
            rounds: 5,
            rules: 'Standard KONIVRER rules apply',
            prizes: 'Prizes for top 8 finishers',
            tags: ['standard', 'swiss']
          },
          {
            id: '2',
            name: 'Single Elimination',,
            format: 'single-elimination',
            description: 'Single elimination bracket',
            rules: 'Standard KONIVRER rules apply',
            prizes: 'Prizes for top 4 finishers',
            tags: ['standard', 'elimination']
          },
          {
            id: '3',
            name: 'Double Elimination',,
            format: 'double-elimination',
            description: 'Double elimination bracket',
            rules: 'Standard KONIVRER rules apply',
            prizes: 'Prizes for top 4 finishers',
            tags: ['standard', 'elimination']
          }
        ];
        
        setTemplates(mockTemplates);
      } catch (err) {
        console.error('Error fetching templates:', err);
      }
    };
    
    if (isAdmin || isJudge) {
      fetchTemplates();
    }
  }, [isAdmin, isJudge]);
  
  // Fetch registration codes
  useEffect(() => {
    const fetchRegistrationCodes = async () => {
      try {
        // This would be an API call in a real implementation
        // For now, we'll use mock data
        const mockCodes: RegistrationCode[] = [
          {
            code: 'KONIVRER2024',
            tournamentId: '1',
            tournamentName: 'KONIVRER Championship Series',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            maxUses: 100,
            currentUses: 64,
            createdBy: 'KONIVRER Official'
          },
          {
            code: 'WEEKLY123',
            tournamentId: '2',
            tournamentName: 'Local Game Store Weekly',
            expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            maxUses: 32,
            currentUses: 12,
            createdBy: 'Card Kingdom'
          }
        ];
        
        setRegistrationCodes(mockCodes);
      } catch (err) {
        console.error('Error fetching registration codes:', err);
      }
    };
    
    if (isAdmin || isJudge) {
      fetchRegistrationCodes();
    }
  }, [isAdmin, isJudge]);
  
  // Filter tournaments
  const filteredTournaments = useMemo(() => {
    return tournaments.filter(tournament => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = tournament.name.toLowerCase().includes(query);
        const matchesDescription = tournament.description?.toLowerCase().includes(query) || false;
        const matchesLocation = tournament.location?.toLowerCase().includes(query) || false;
        const matchesOrganizer = tournament.organizer.name.toLowerCase().includes(query);
        const matchesTags = tournament.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
        
        if (!(matchesName || matchesDescription || matchesLocation || matchesOrganizer || matchesTags)) {
          return false;
        }
      }
      
      // Format filter
      if (filters.format && tournament.format !== filters.format) {
        return false;
      }
      
      // Status filter
      if (filters.status && tournament.status !== filters.status) {
        return false;
      }
      
      // Time frame filter
      if (filters.timeFrame) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        switch (filters.timeFrame) {
          case 'today':
            if (tournament.startDate < today || tournament.startDate >= new Date(today.getTime() + 24 * 60 * 60 * 1000)) {
              return false;
            }
            break;
          case 'this-week':
            if (tournament.startDate < weekStart || tournament.startDate >= new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)) {
              return false;
            }
            break;
          case 'this-month':
            if (tournament.startDate < monthStart || tournament.startDate >= new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1)) {
              return false;
            }
            break;
          case 'upcoming':
            if (tournament.startDate < now) {
              return false;
            }
            break;
          case 'past':
            if (tournament.startDate > now) {
              return false;
            }
            break;
        }
      }
      
      return true;
    });
  }, [tournaments, searchQuery, filters]);
  
  // Handle tournament selection
  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    
    if (onTournamentSelect) {
      onTournamentSelect(tournament);
    }
    
    // If we're in browser variant, navigate to tournament page
    if (actualVariant === 'browser') {
      navigate(`/tournaments/${tournament.id}`);
    }
  };
  
  // Handle tournament creation
  const handleCreateTournament = async () => {
    try {
      // This would be an API call in a real implementation
      // For now, we'll just add to the local state
      const newTournament: Tournament = {
        id: Math.random().toString(36).substring(2, 9),
        ...formData,
        status: 'upcoming',
        currentPlayers: 0,
        organizer: {
          id: user?.uid || '0',
          name: user?.displayName || 'Unknown',
        },
        players: [],
        isPublic: formData.isPublic
      };
      
      setTournaments(prev => [...prev, newTournament]);
      setShowCreateForm(false);
      setFormData({
        name: '',,
        format: 'swiss',
        description: '',
        location: '',
        startDate: new Date(),
        maxPlayers: 32,
        rounds: 0,
        registrationDeadline: new Date(),
        checkInStart: new Date(),
        checkInEnd: new Date(),
        prizes: '',
        rules: '',
        isPublic: true,
        tags: []
      });
      
      if (onCreateTournament) {
        onCreateTournament(newTournament);
      }
    } catch (err) {
      console.error('Error creating tournament:', err);
      setError('Failed to create tournament. Please try again later.');
    }
  };
  
  // Handle tournament update
  const handleUpdateTournament = async (updatedData: Partial<Tournament>) => {
    if (!selectedTournament) return;
    
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const updatedTournament = {
        ...selectedTournament,
        ...updatedData
      };
      
      setTournaments(prev => prev.map(t => t.id === selectedTournament.id ? updatedTournament : t));
      setSelectedTournament(updatedTournament);
      
      if (onUpdateTournament) {
        onUpdateTournament(updatedTournament);
      }
    } catch (err) {
      console.error('Error updating tournament:', err);
      setError('Failed to update tournament. Please try again later.');
    }
  };
  
  // Handle tournament deletion
  const handleDeleteTournament = async () => {
    if (!selectedTournament) return;
    
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      setTournaments(prev => prev.filter(t => t.id !== selectedTournament.id));
      setSelectedTournament(null);
      setShowConfirmation(null);
      
      if (onDeleteTournament) {
        onDeleteTournament(selectedTournament.id);
      }
      
      // If we're in browser variant, navigate back to tournaments list
      if (actualVariant === 'browser') {
        navigate('/tournaments');
      }
    } catch (err) {
      console.error('Error deleting tournament:', err);
      setError('Failed to delete tournament. Please try again later.');
    }
  };
  
  // Handle player registration
  const handleRegisterPlayer = async () => {
    if (!selectedTournament || !user) return;
    
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const newPlayer: Player = {
        id: user.uid,
        name: user.displayName || 'Unknown',,
        avatar: user.photoURL || undefined,
        confirmed: true,
        checkedIn: false
      };
      
      const updatedTournament = {
        ...selectedTournament,
        players: [...selectedTournament.players, newPlayer],
        currentPlayers: selectedTournament.currentPlayers + 1
      };
      
      setTournaments(prev => prev.map(t => t.id === selectedTournament.id ? updatedTournament : t));
      setSelectedTournament(updatedTournament);
    } catch (err) {
      console.error('Error registering player:', err);
      setError('Failed to register for tournament. Please try again later.');
    }
  };
  
  // Handle player check-in
  const handlePlayerCheckIn = async (playerId: string) => {
    if (!selectedTournament) return;
    
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const updatedPlayers = selectedTournament.players.map(player => {
        if (player.id === playerId) {
          return {
            ...player,
            checkedIn: true
          };
        }
        return player;
      });
      
      const updatedTournament = {
        ...selectedTournament,
        players: updatedPlayers
      };
      
      setTournaments(prev => prev.map(t => t.id === selectedTournament.id ? updatedTournament : t));
      setSelectedTournament(updatedTournament);
    } catch (err) {
      console.error('Error checking in player:', err);
      setError('Failed to check in. Please try again later.');
    }
  };
  
  // Handle player drop
  const handlePlayerDrop = async (playerId: string) => {
    if (!selectedTournament) return;
    
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const updatedPlayers = selectedTournament.players.map(player => {
        if (player.id === playerId) {
          return {
            ...player,
            dropped: true
          };
        }
        return player;
      });
      
      const updatedTournament = {
        ...selectedTournament,
        players: updatedPlayers
      };
      
      setTournaments(prev => prev.map(t => t.id === selectedTournament.id ? updatedTournament : t));
      setSelectedTournament(updatedTournament);
      setShowConfirmation(null);
    } catch (err) {
      console.error('Error dropping player:', err);
      setError('Failed to drop player. Please try again later.');
    }
  };
  
  // Handle player disqualification
  const handlePlayerDisqualify = async (playerId: string) => {
    if (!selectedTournament) return;
    
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const updatedPlayers = selectedTournament.players.map(player => {
        if (player.id === playerId) {
          return {
            ...player,
            disqualified: true
          };
        }
        return player;
      });
      
      const updatedTournament = {
        ...selectedTournament,
        players: updatedPlayers
      };
      
      setTournaments(prev => prev.map(t => t.id === selectedTournament.id ? updatedTournament : t));
      setSelectedTournament(updatedTournament);
      setShowConfirmation(null);
    } catch (err) {
      console.error('Error disqualifying player:', err);
      setError('Failed to disqualify player. Please try again later.');
    }
  };
  
  // Handle match result submission
  const handleSubmitMatchResult = async () => {
    if (!selectedTournament || !editingMatch) return;
    
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const updatedMatch: Match = {
        ...editingMatch,
        scores: {
          player1: matchResult.player1Score,
          player2: matchResult.player2Score
        },
        winner: matchResult.winner,
        result: matchResult.winner 
          ? `${matchResult.player1Score}-${matchResult.player2Score}${matchResult.draws > 0 ? `-${matchResult.draws}` : ''}`
          : 'Draw',
        status: 'reported'
      };
      
      // Update the match in the rounds
      const updatedRounds = selectedTournament.rounds?.map(round => {
        if (round.number === updatedMatch.roundNumber) {
          return {
            ...round,
            matches: round.matches.map(match => match.id === updatedMatch.id ? updatedMatch : match)
          };
        }
        return round;
      });
      
      const updatedTournament = {
        ...selectedTournament,
        rounds: updatedRounds
      };
      
      setTournaments(prev => prev.map(t => t.id === selectedTournament.id ? updatedTournament : t));
      setSelectedTournament(updatedTournament);
      setEditingMatch(null);
      setMatchResult({
        player1Score: 0,
        player2Score: 0,
        winner: '',
        draws: 0
      });
    } catch (err) {
      console.error('Error submitting match result:', err);
      setError('Failed to submit match result. Please try again later.');
    }
  };
  
  // Handle tournament start
  const handleStartTournament = async () => {
    if (!selectedTournament) return;
    
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const updatedTournament = {
        ...selectedTournament,
        status: 'in-progress' as TournamentStatus,
        currentRound: 1
      };
      
      setTournaments(prev => prev.map(t => t.id === selectedTournament.id ? updatedTournament : t));
      setSelectedTournament(updatedTournament);
    } catch (err) {
      console.error('Error starting tournament:', err);
      setError('Failed to start tournament. Please try again later.');
    }
  };
  
  // Handle tournament finalization
  const handleFinalizeTournament = async () => {
    if (!selectedTournament) return;
    
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const updatedTournament = {
        ...selectedTournament,
        status: 'completed' as TournamentStatus
      };
      
      setTournaments(prev => prev.map(t => t.id === selectedTournament.id ? updatedTournament : t));
      setSelectedTournament(updatedTournament);
      setShowConfirmation(null);
    } catch (err) {
      console.error('Error finalizing tournament:', err);
      setError('Failed to finalize tournament. Please try again later.');
    }
  };
  
  // Handle tournament cancellation
  const handleCancelTournament = async () => {
    if (!selectedTournament) return;
    
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const updatedTournament = {
        ...selectedTournament,
        status: 'cancelled' as TournamentStatus
      };
      
      setTournaments(prev => prev.map(t => t.id === selectedTournament.id ? updatedTournament : t));
      setSelectedTournament(updatedTournament);
      setShowConfirmation(null);
    } catch (err) {
      console.error('Error cancelling tournament:', err);
      setError('Failed to cancel tournament. Please try again later.');
    }
  };
  
  // Handle registration code generation
  const handleGenerateRegistrationCode = async (tournamentId: string, maxUses?: number, expiresAt?: Date) => {
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const tournament = tournaments.find(t => t.id === tournamentId);
      if (!tournament) return;
      
      const newCode: RegistrationCode = {
        code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        tournamentId,
        tournamentName: tournament.name,
        expiresAt,
        maxUses,
        currentUses: 0,
        createdBy: user?.displayName || 'Unknown'
      };
      
      setRegistrationCodes(prev => [...prev, newCode]);
    } catch (err) {
      console.error('Error generating registration code:', err);
      setError('Failed to generate registration code. Please try again later.');
    }
  };
  
  // Handle template creation
  const handleCreateTemplate = async (templateData: Omit<TournamentTemplate, 'id'>) => {
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      const newTemplate: TournamentTemplate = {
        id: Math.random().toString(36).substring(2, 9),
        ...templateData
      };
      
      setTemplates(prev => [...prev, newTemplate]);
    } catch (err) {
      console.error('Error creating template:', err);
      setError('Failed to create template. Please try again later.');
    }
  };
  
  // Handle template deletion
  const handleDeleteTemplate = async (templateId: string) => {
    try {
      // This would be an API call in a real implementation
      // For now, we'll just update the local state
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('Failed to delete template. Please try again later.');
    }
  };
  
  // Render tournament browser
  const renderTournamentBrowser = () => {
    return (
      <div className="tournament-browser">
        {/* Search and filters */}
        <div className="tournament-browser-header">
          <h2>Tournaments</h2>
          
          <div className="tournament-search">
            <div className="search-input-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tournaments..."
                className="search-input"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="clear-button"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="filter-button"
            >
              <Filter size={20} />
              <span>Filters</span>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {isAdmin && (
              <button 
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="create-button"
              >
                <Plus size={20} />
                <span>Create</span>
              </button>
            )}
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="tournament-filters">
              <div className="filter-group">
                <label>Format</label>
                <select
                  value={filters.format || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value as TournamentFormat || undefined }))}
                >
                  <option value="">All Formats</option>
                  <option value="swiss">Swiss</option>
                  <option value="single-elimination">Single Elimination</option>
                  <option value="double-elimination">Double Elimination</option>
                  <option value="round-robin">Round Robin</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as TournamentStatus || undefined }))}
                >
                  <option value="">All Statuses</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="registration">Registration Open</option>
                  <option value="check-in">Check-in Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Time Frame</label>
                <select
                  value={filters.timeFrame || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, timeFrame: e.target.value as typeof filters.timeFrame || undefined }))}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
              
              <button 
                type="button"
                onClick={() => setFilters({ timeFrame: 'upcoming' })}
                className="clear-filters-button"
              >
                <RefreshCw size={16} />
                <span>Clear Filters</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Tournament list */}
        {loading ? (
          <div className="loading-container">
            <Loader size={32} className="animate-spin" />
            <p>Loading tournaments...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <AlertCircle size={32} />
            <p>{error}</p>
            <button 
              type="button"
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="empty-container">
            <Calendar size={32} />
            <p>No tournaments found matching your criteria.</p>
            {Object.keys(filters).length > 1 && (
              <button 
                type="button"
                onClick={() => setFilters({ timeFrame: 'upcoming' })}
                className="clear-filters-button"
              >
                <RefreshCw size={16} />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="tournament-list">
            {filteredTournaments.map(tournament => (
              <div 
                key={tournament.id}
                className={`tournament-card ${selectedTournament?.id === tournament.id ? 'selected' : ''}`}
                onClick={() => handleTournamentSelect(tournament)}
              >
                <div className="tournament-card-header">
                  <h3>{tournament.name}</h3>
                  <div className={`tournament-status ${tournament.status}`}>
                    {tournament.status === 'upcoming' && <Calendar size={16} />}
                    {tournament.status === 'registration' && <UserPlus size={16} />}
                    {tournament.status === 'check-in' && <UserCheck size={16} />}
                    {tournament.status === 'in-progress' && <Zap size={16} />}
                    {tournament.status === 'completed' && <Trophy size={16} />}
                    {tournament.status === 'cancelled' && <X size={16} />}
                    <span>
                      {tournament.status === 'upcoming' && 'Upcoming'}
                      {tournament.status === 'registration' && 'Registration Open'}
                      {tournament.status === 'check-in' && 'Check-in Open'}
                      {tournament.status === 'in-progress' && 'In Progress'}
                      {tournament.status === 'completed' && 'Completed'}
                      {tournament.status === 'cancelled' && 'Cancelled'}
                    </span>
                  </div>
                </div>
                
                <div className="tournament-card-details">
                  <div className="tournament-detail">
                    <Calendar size={16} />
                    <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="tournament-detail">
                    <MapPin size={16} />
                    <span>{tournament.location || 'Online'}</span>
                  </div>
                  
                  <div className="tournament-detail">
                    <Users size={16} />
                    <span>{tournament.currentPlayers}/{tournament.maxPlayers || '∞'} Players</span>
                  </div>
                  
                  <div className="tournament-detail">
                    <Award size={16} />
                    <span>{tournament.format.replace('-', ' ')}</span>
                  </div>
                </div>
                
                {tournament.description && (
                  <div className="tournament-card-description">
                    <p>{tournament.description}</p>
                  </div>
                )}
                
                {tournament.tags && tournament.tags.length > 0 && (
                  <div className="tournament-card-tags">
                    {tournament.tags.map(tag => (
                      <span key={tag} className="tournament-tag">{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="tournament-card-footer">
                  <div className="tournament-organizer">
                    <User size={16} />
                    <span>Organized by {tournament.organizer.name}</span>
                  </div>
                  
                  <button 
                    type="button"
                    className="view-details-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTournamentSelect(tournament);
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Create tournament form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setShowCreateForm(false)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Create Tournament</h2>
                  <button 
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="close-button"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="modal-body">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateTournament();
                  }}>
                    <div className="form-group">
                      <label htmlFor="name">Tournament Name</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))},
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="format">Format</label>
                      <select
                        id="format"
                        value={formData.format}
                        onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as TournamentFormat }))}
                        required
                      >
                        <option value="swiss">Swiss</option>
                        <option value="single-elimination">Single Elimination</option>
                        <option value="double-elimination">Double Elimination</option>
                        <option value="round-robin">Round Robin</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                          type="text"
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Online or physical location"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="maxPlayers">Max Players</label>
                        <input
                          type="number"
                          id="maxPlayers"
                          value={formData.maxPlayers}
                          onChange={(e) => setFormData(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                          min={2}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                          type="datetime-local"
                          id="startDate"
                          value={formData.startDate.toISOString().slice(0, 16)}
                          onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="registrationDeadline">Registration Deadline</label>
                        <input
                          type="datetime-local"
                          id="registrationDeadline"
                          value={formData.registrationDeadline.toISOString().slice(0, 16)}
                          onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: new Date(e.target.value) }))}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="rounds">Number of Rounds (0 for automatic)</label>
                      <input
                        type="number"
                        id="rounds"
                        value={formData.rounds}
                        onChange={(e) => setFormData(prev => ({ ...prev, rounds: parseInt(e.target.value) }))}
                        min={0}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="prizes">Prizes</label>
                      <textarea
                        id="prizes"
                        value={formData.prizes}
                        onChange={(e) => setFormData(prev => ({ ...prev, prizes: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="rules">Rules</label>
                      <textarea
                        id="rules"
                        value={formData.rules}
                        onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="tags">Tags (comma separated)</label>
                      <input
                        type="text"
                        id="tags"
                        value={formData.tags.join(', ')}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))}
                      />
                    </div>
                    
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      />
                      <label htmlFor="isPublic">Public Tournament</label>
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="create-button"
                      >
                        Create Tournament
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  // Render tournament details
  const renderTournamentDetails = () => {
    if (!selectedTournament) return null;
    
    return (
      <div className="tournament-details">
        {/* Tournament header */}
        <div className="tournament-header">
          <div className="tournament-title">
            <h2>{selectedTournament.name}</h2>
            <div className={`tournament-status ${selectedTournament.status}`}>
              {selectedTournament.status === 'upcoming' && <Calendar size={16} />}
              {selectedTournament.status === 'registration' && <UserPlus size={16} />}
              {selectedTournament.status === 'check-in' && <UserCheck size={16} />}
              {selectedTournament.status === 'in-progress' && <Zap size={16} />}
              {selectedTournament.status === 'completed' && <Trophy size={16} />}
              {selectedTournament.status === 'cancelled' && <X size={16} />}
              <span>
                {selectedTournament.status === 'upcoming' && 'Upcoming'}
                {selectedTournament.status === 'registration' && 'Registration Open'}
                {selectedTournament.status === 'check-in' && 'Check-in Open'}
                {selectedTournament.status === 'in-progress' && 'In Progress'}
                {selectedTournament.status === 'completed' && 'Completed'}
                {selectedTournament.status === 'cancelled' && 'Cancelled'}
              </span>
            </div>
          </div>
          
          <div className="tournament-actions">
            {/* Registration button */}
            {(selectedTournament.status === 'upcoming' || selectedTournament.status === 'registration') && 
             user && 
             !selectedTournament.players.some(p => p.id === user.uid) && (
              <button 
                type="button"
                onClick={handleRegisterPlayer}
                className="register-button"
                disabled={selectedTournament.currentPlayers >= (selectedTournament.maxPlayers || Infinity)}
              >
                <UserPlus size={20} />
                <span>Register</span>
              </button>
            )}
            
            {/* Check-in button */}
            {selectedTournament.status === 'check-in' && 
             user && 
             selectedTournament.players.some(p => p.id === user.uid && !p.checkedIn) && (
              <button 
                type="button"
                onClick={() => handlePlayerCheckIn(user.uid)}
                className="check-in-button"
              >
                <UserCheck size={20} />
                <span>Check In</span>
              </button>
            )}
            
            {/* Admin actions */}
            {(isAdmin || isJudge || selectedTournament.organizer.id === user?.uid) && (
              <div className="admin-actions">
                {selectedTournament.status === 'upcoming' && (
                  <button 
                    type="button"
                    onClick={() => handleUpdateTournament({ status: 'registration' })}
                    className="open-registration-button"
                  >
                    <UserPlus size={20} />
                    <span>Open Registration</span>
                  </button>
                )}
                
                {selectedTournament.status === 'registration' && (
                  <button 
                    type="button"
                    onClick={() => handleUpdateTournament({ status: 'check-in' })}
                    className="open-check-in-button"
                  >
                    <UserCheck size={20} />
                    <span>Open Check-in</span>
                  </button>
                )}
                
                {selectedTournament.status === 'check-in' && (
                  <button 
                    type="button"
                    onClick={handleStartTournament}
                    className="start-tournament-button"
                  >
                    <Zap size={20} />
                    <span>Start Tournament</span>
                  </button>
                )}
                
                {selectedTournament.status === 'in-progress' && (
                  <button 
                    type="button"
                    onClick={() => setShowConfirmation({
                      type: 'finalize-tournament',,
                      id: selectedTournament.id,
                      message: 'Are you sure you want to finalize this tournament? This action cannot be undone.'
                    })}
                    className="finalize-tournament-button"
                  >
                    <Trophy size={20} />
                    <span>Finalize Tournament</span>
                  </button>
                )}
                
                {selectedTournament.status !== 'completed' && selectedTournament.status !== 'cancelled' && (
                  <button 
                    type="button"
                    onClick={() => setShowConfirmation({
                      type: 'cancel-tournament',,
                      id: selectedTournament.id,
                      message: 'Are you sure you want to cancel this tournament? This action cannot be undone.'
                    })}
                    className="cancel-tournament-button"
                  >
                    <X size={20} />
                    <span>Cancel Tournament</span>
                  </button>
                )}
                
                <button 
                  type="button"
                  onClick={() => setShowConfirmation({
                    type: 'delete-tournament',,
                    id: selectedTournament.id,
                    message: 'Are you sure you want to delete this tournament? This action cannot be undone.'
                  })}
                  className="delete-tournament-button"
                >
                  <Trash size={20} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Tournament tabs */}
        <div className="tournament-tabs">
          <button 
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <Info size={16} />
            <span>Overview</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab('players')}
            className={`tab-button ${activeTab === 'players' ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Players</span>
          </button>
          
          {selectedTournament.status === 'in-progress' && (
            <>
              <button 
                type="button"
                onClick={() => setActiveTab('rounds')}
                className={`tab-button ${activeTab === 'rounds' ? 'active' : ''}`}
              >
                <Clock size={16} />
                <span>Rounds</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setActiveTab('standings')}
                className={`tab-button ${activeTab === 'standings' ? 'active' : ''}`}
              >
                <Award size={16} />
                <span>Standings</span>
              </button>
            </>
          )}
          
          {(selectedTournament.status === 'in-progress' || selectedTournament.status === 'completed') && 
           (selectedTournament.format === 'single-elimination' || selectedTournament.format === 'double-elimination') && (
            <button 
              type="button"
              onClick={() => setActiveTab('bracket')}
              className={`tab-button ${activeTab === 'bracket' ? 'active' : ''}`}
            >
              <Trophy size={16} />
              <span>Bracket</span>
            </button>
          )}
          
          {(isAdmin || isJudge || selectedTournament.organizer.id === user?.uid) && (
            <button 
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
            >
              <Settings size={16} />
              <span>Admin</span>
            </button>
          )}
        </div>
        
        {/* Tab content */}
        <div className="tab-content">
          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="tournament-info">
                <div className="info-section">
                  <h3>Tournament Details</h3>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <Calendar size={16} />
                      <div>
                        <span className="info-label">Date</span>
                        <span className="info-value">{new Date(selectedTournament.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <Clock size={16} />
                      <div>
                        <span className="info-label">Time</span>
                        <span className="info-value">{new Date(selectedTournament.startDate).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <MapPin size={16} />
                      <div>
                        <span className="info-label">Location</span>
                        <span className="info-value">{selectedTournament.location || 'Online'}</span>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <Award size={16} />
                      <div>
                        <span className="info-label">Format</span>
                        <span className="info-value">{selectedTournament.format.replace('-', ' ')}</span>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <Users size={16} />
                      <div>
                        <span className="info-label">Players</span>
                        <span className="info-value">{selectedTournament.currentPlayers}/{selectedTournament.maxPlayers || '∞'}</span>
                      </div>
                    </div>
                    
                    {selectedTournament.rounds && (
                      <div className="info-item">
                        <Clock size={16} />
                        <div>
                          <span className="info-label">Rounds</span>
                          <span className="info-value">{selectedTournament.rounds}</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedTournament.registrationDeadline && (
                      <div className="info-item">
                        <UserPlus size={16} />
                        <div>
                          <span className="info-label">Registration Deadline</span>
                          <span className="info-value">{new Date(selectedTournament.registrationDeadline).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="info-item">
                      <User size={16} />
                      <div>
                        <span className="info-label">Organizer</span>
                        <span className="info-value">{selectedTournament.organizer.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedTournament.description && (
                  <div className="info-section">
                    <h3>Description</h3>
                    <p>{selectedTournament.description}</p>
                  </div>
                )}
                
                {selectedTournament.prizes && (
                  <div className="info-section">
                    <h3>Prizes</h3>
                    <p>{selectedTournament.prizes}</p>
                  </div>
                )}
                
                {selectedTournament.rules && (
                  <div className="info-section">
                    <h3>Rules</h3>
                    <p>{selectedTournament.rules}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Players tab */}
          {activeTab === 'players' && (
            <div className="players-tab">
              <h3>Registered Players ({selectedTournament.players.length}/{selectedTournament.maxPlayers || '∞'})</h3>
              
              {selectedTournament.players.length === 0 ? (
                <div className="empty-container">
                  <Users size={32} />
                  <p>No players registered yet.</p>
                </div>
              ) : (
                <div className="players-list">
                  {selectedTournament.players.map(player => (
                    <div 
                      key={player.id}
                      className={`player-card ${player.dropped ? 'dropped' : ''} ${player.disqualified ? 'disqualified' : ''}`}
                      onClick={() => setShowPlayerDetails(player.id === showPlayerDetails ? null : player.id)}
                    >
                      <div className="player-info">
                        <div className="player-avatar">
                          {player.avatar ? (
                            <img src={player.avatar} alt={player.name} />
                          ) : (
                            <User size={24} />
                          )}
                        </div>
                        
                        <div className="player-details">
                          <div className="player-name">{player.name}</div>
                          
                          {player.record && (
                            <div className="player-record">
                              {player.record.wins}-{player.record.losses}{player.record.draws > 0 ? `-${player.record.draws}` : ''}
                            </div>
                          )}
                        </div>
                        
                        <div className="player-status">
                          {player.confirmed && (
                            <div className="status-indicator confirmed">
                              <Check size={16} />
                              <span>Confirmed</span>
                            </div>
                          )}
                          
                          {player.checkedIn && (
                            <div className="status-indicator checked-in">
                              <UserCheck size={16} />
                              <span>Checked In</span>
                            </div>
                          )}
                          
                          {player.dropped && (
                            <div className="status-indicator dropped">
                              <UserX size={16} />
                              <span>Dropped</span>
                            </div>
                          )}
                          
                          {player.disqualified && (
                            <div className="status-indicator disqualified">
                              <X size={16} />
                              <span>Disqualified</span>
                            </div>
                          )}
                        </div>
                        
                        {(isAdmin || isJudge) && (
                          <div className="player-actions">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirmation({
                                  type: 'drop-player',,
                                  id: player.id,
                                  message: `Are you sure you want to drop ${player.name} from the tournament?`
                                });
                              }}
                              className="drop-player-button"
                              disabled={player.dropped || player.disqualified}
                            >
                              <UserX size={16} />
                            </button>
                            
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirmation({
                                  type: 'disqualify-player',,
                                  id: player.id,
                                  message: `Are you sure you want to disqualify ${player.name} from the tournament?`
                                });
                              }}
                              className="disqualify-player-button"
                              disabled={player.disqualified}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {showPlayerDetails === player.id && (
                        <div className="player-details-expanded">
                          {player.standing && (
                            <div className="detail-item">
                              <Trophy size={16} />
                              <span>Standing: {player.standing}</span>
                            </div>
                          )}
                          
                          {player.tiebreakers && (
                            <div className="tiebreakers">
                              <h4>Tiebreakers</h4>
                              
                              {player.tiebreakers.opponentMatchWinPercentage !== undefined && (
                                <div className="detail-item">
                                  <span>Opponent Match Win %:</span>
                                  <span>{(player.tiebreakers.opponentMatchWinPercentage * 100).toFixed(2)}%</span>
                                </div>
                              )}
                              
                              {player.tiebreakers.gameWinPercentage !== undefined && (
                                <div className="detail-item">
                                  <span>Game Win %:</span>
                                  <span>{(player.tiebreakers.gameWinPercentage * 100).toFixed(2)}%</span>
                                </div>
                              )}
                              
                              {player.tiebreakers.opponentGameWinPercentage !== undefined && (
                                <div className="detail-item">
                                  <span>Opponent Game Win %:</span>
                                  <span>{(player.tiebreakers.opponentGameWinPercentage * 100).toFixed(2)}%</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {player.decklist && (
                            <div className="decklist">
                              <h4>Decklist</h4>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // View decklist
                                }}
                                className="view-decklist-button"
                              >
                                <FileText size={16} />
                                <span>View Decklist</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Rounds tab */}
          {activeTab === 'rounds' && (
            <div className="rounds-tab">
              <h3>Rounds</h3>
              
              {!selectedTournament.rounds || selectedTournament.rounds.length === 0 ? (
                <div className="empty-container">
                  <Clock size={32} />
                  <p>No rounds have been created yet.</p>
                </div>
              ) : (
                <div className="rounds-list">
                  {selectedTournament.rounds.map(round => (
                    <div key={round.number} className="round-card">
                      <div className="round-header">
                        <h4>Round {round.number}</h4>
                        <div className={`round-status ${round.status}`}>
                          {round.status === 'scheduled' && <Calendar size={16} />}
                          {round.status === 'in-progress' && <Clock size={16} />}
                          {round.status === 'completed' && <Check size={16} />}
                          <span>
                            {round.status === 'scheduled' && 'Scheduled'}
                            {round.status === 'in-progress' && 'In Progress'}
                            {round.status === 'completed' && 'Completed'}
                          </span>
                        </div>
                      </div>
                      
                      {round.matches.length === 0 ? (
                        <div className="empty-container">
                          <p>No matches in this round.</p>
                        </div>
                      ) : (
                        <div className="matches-list">
                          {round.matches.map(match => {
                            const player1 = selectedTournament.players.find(p => p.id === match.player1Id);
                            const player2 = selectedTournament.players.find(p => p.id === match.player2Id);
                            
                            return (
                              <div 
                                key={match.id}
                                className={`match-card ${match.status}`}
                                onClick={() => setShowMatchDetails(match.id === showMatchDetails ? null : match.id)}
                              >
                                <div className="match-header">
                                  {match.tableNumber && (
                                    <div className="table-number">Table {match.tableNumber}</div>
                                  )}
                                  
                                  <div className="match-status">
                                    {match.status === 'scheduled' && <Calendar size={16} />}
                                    {match.status === 'in-progress' && <Clock size={16} />}
                                    {match.status === 'reported' && <CheckCircle size={16} />}
                                    {match.status === 'verified' && <Check size={16} />}
                                    <span>
                                      {match.status === 'scheduled' && 'Scheduled'}
                                      {match.status === 'in-progress' && 'In Progress'}
                                      {match.status === 'reported' && 'Reported'}
                                      {match.status === 'verified' && 'Verified'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="match-players">
                                  <div className={`match-player ${match.winner === match.player1Id ? 'winner' : ''}`}>
                                    <div className="player-avatar">
                                      {player1?.avatar ? (
                                        <img src={player1.avatar} alt={player1.name} />
                                      ) : (
                                        <User size={24} />
                                      )}
                                    </div>
                                    <div className="player-name">{player1?.name || 'Unknown'}</div>
                                    {match.scores && (
                                      <div className="player-score">{match.scores.player1}</div>
                                    )}
                                  </div>
                                  
                                  <div className="match-vs">vs</div>
                                  
                                  <div className={`match-player ${match.winner === match.player2Id ? 'winner' : ''}`}>
                                    <div className="player-avatar">
                                      {player2?.avatar ? (
                                        <img src={player2.avatar} alt={player2.name} />
                                      ) : (
                                        <User size={24} />
                                      )}
                                    </div>
                                    <div className="player-name">{player2?.name || 'Unknown'}</div>
                                    {match.scores && (
                                      <div className="player-score">{match.scores.player2}</div>
                                    )}
                                  </div>
                                </div>
                                
                                {showMatchDetails === match.id && (
                                  <div className="match-details">
                                    {match.result && (
                                      <div className="match-result">
                                        <span>Result:</span>
                                        <span>{match.result}</span>
                                      </div>
                                    )}
                                    
                                    {match.startTime && (
                                      <div className="match-time">
                                        <span>Start Time:</span>
                                        <span>{new Date(match.startTime).toLocaleTimeString()}</span>
                                      </div>
                                    )}
                                    
                                    {match.endTime && (
                                      <div className="match-time">
                                        <span>End Time:</span>
                                        <span>{new Date(match.endTime).toLocaleTimeString()}</span>
                                      </div>
                                    )}
                                    
                                    {match.timeExtension && (
                                      <div className="match-time-extension">
                                        <span>Time Extension:</span>
                                        <span>{match.timeExtension} minutes</span>
                                      </div>
                                    )}
                                    
                                    {(isAdmin || isJudge || user?.uid === match.player1Id || user?.uid === match.player2Id) && 
                                     match.status === 'scheduled' && (
                                      <div className="match-actions">
                                        <button 
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingMatch(match);
                                          }}
                                          className="report-result-button"
                                        >
                                          <CheckCircle size={16} />
                                          <span>Report Result</span>
                                        </button>
                                      </div>
                                    )}
                                    
                                    {(isAdmin || isJudge) && match.status === 'reported' && (
                                      <div className="match-actions">
                                        <button 
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Verify result
                                            const updatedMatch = {
                                              ...match,
                                              status: 'verified' as const
                                            };
                                            
                                            // Update the match in the rounds
                                            const updatedRounds = selectedTournament.rounds?.map(r => {
                                              if (r.number === updatedMatch.roundNumber) {
                                                return {
                                                  ...r,
                                                  matches: r.matches.map(m => m.id === updatedMatch.id ? updatedMatch : m)
                                                };
                                              }
                                              return r;
                                            });
                                            
                                            handleUpdateTournament({ rounds: updatedRounds });
                                          }}
                                          className="verify-result-button"
                                        >
                                          <Check size={16} />
                                          <span>Verify Result</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Report match result modal */}
              <AnimatePresence>
                {editingMatch && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="modal-overlay"
                    onClick={() => setEditingMatch(null)}
                  >
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      className="modal-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="modal-header">
                        <h2>Report Match Result</h2>
                        <button 
                          type="button"
                          onClick={() => setEditingMatch(null)}
                          className="close-button"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div className="modal-body">
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmitMatchResult();
                        }}>
                          <div className="match-players">
                            <div className="match-player">
                              <div className="player-name">
                                {selectedTournament.players.find(p => p.id === editingMatch.player1Id)?.name || 'Unknown'}
                              </div>
                              <div className="player-score-input">
                                <label>Wins</label>
                                <input
                                  type="number"
                                  value={matchResult.player1Score}
                                  onChange={(e) => setMatchResult(prev => ({ ...prev, player1Score: parseInt(e.target.value) }))}
                                  min={0}
                                  max={2}
                                />
                              </div>
                            </div>
                            
                            <div className="match-vs">vs</div>
                            
                            <div className="match-player">
                              <div className="player-name">
                                {selectedTournament.players.find(p => p.id === editingMatch.player2Id)?.name || 'Unknown'}
                              </div>
                              <div className="player-score-input">
                                <label>Wins</label>
                                <input
                                  type="number"
                                  value={matchResult.player2Score}
                                  onChange={(e) => setMatchResult(prev => ({ ...prev, player2Score: parseInt(e.target.value) }))}
                                  min={0}
                                  max={2}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <label>Draws</label>
                            <input
                              type="number"
                              value={matchResult.draws}
                              onChange={(e) => setMatchResult(prev => ({ ...prev, draws: parseInt(e.target.value) }))}
                              min={0}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Winner</label>
                            <select
                              value={matchResult.winner}
                              onChange={(e) => setMatchResult(prev => ({ ...prev, winner: e.target.value }))}
                            >
                              <option value="">Draw</option>
                              <option value={editingMatch.player1Id}>
                                {selectedTournament.players.find(p => p.id === editingMatch.player1Id)?.name || 'Unknown'}
                              </option>
                              <option value={editingMatch.player2Id}>
                                {selectedTournament.players.find(p => p.id === editingMatch.player2Id)?.name || 'Unknown'}
                              </option>
                            </select>
                          </div>
                          
                          <div className="form-actions">
                            <button 
                              type="button"
                              onClick={() => setEditingMatch(null)}
                              className="cancel-button"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              className="submit-button"
                            >
                              Submit Result
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Standings tab */}
          {activeTab === 'standings' && (
            <div className="standings-tab">
              <h3>Standings</h3>
              
              {!selectedTournament.players || selectedTournament.players.length === 0 ? (
                <div className="empty-container">
                  <Award size={32} />
                  <p>No standings available yet.</p>
                </div>
              ) : (
                <div className="standings-table">
                  <div className="standings-header">
                    <div className="standing-rank">#</div>
                    <div className="standing-player">Player</div>
                    <div className="standing-record">Record</div>
                    {selectedTournament.format === 'swiss' && (
                      <>
                        <div className="standing-tiebreaker">OMW%</div>
                        <div className="standing-tiebreaker">GW%</div>
                        <div className="standing-tiebreaker">OGW%</div>
                      </>
                    )}
                  </div>
                  
                  <div className="standings-body">
                    {selectedTournament.players
                      .filter(player => !player.dropped && !player.disqualified)
                      .sort((a, b) => {
                        // Sort by standing if available
                        if (a.standing && b.standing) {
                          return a.standing - b.standing;
                        }
                        
                        // Sort by record
                        if (a.record && b.record) {
                          const aPoints = a.record.wins * 3 + a.record.draws;
                          const bPoints = b.record.wins * 3 + b.record.draws;
                          
                          if (aPoints !== bPoints) {
                            return bPoints - aPoints;
                          }
                          
                          // Sort by tiebreakers
                          if (a.tiebreakers && b.tiebreakers) {
                            if (a.tiebreakers.opponentMatchWinPercentage !== b.tiebreakers.opponentMatchWinPercentage) {
                              return (b.tiebreakers.opponentMatchWinPercentage || 0) - (a.tiebreakers.opponentMatchWinPercentage || 0);
                            }
                            
                            if (a.tiebreakers.gameWinPercentage !== b.tiebreakers.gameWinPercentage) {
                              return (b.tiebreakers.gameWinPercentage || 0) - (a.tiebreakers.gameWinPercentage || 0);
                            }
                            
                            if (a.tiebreakers.opponentGameWinPercentage !== b.tiebreakers.opponentGameWinPercentage) {
                              return (b.tiebreakers.opponentGameWinPercentage || 0) - (a.tiebreakers.opponentGameWinPercentage || 0);
                            }
                          }
                        }
                        
                        // Sort by name as last resort
                        return a.name.localeCompare(b.name);
                      })
                      .map((player, index) => (
                        <div key={player.id} className="standing-row">
                          <div className="standing-rank">{index + 1}</div>
                          <div className="standing-player">
                            <div className="player-avatar">
                              {player.avatar ? (
                                <img src={player.avatar} alt={player.name} />
                              ) : (
                                <User size={20} />
                              )}
                            </div>
                            <div className="player-name">{player.name}</div>
                          </div>
                          <div className="standing-record">
                            {player.record 
                              ? `${player.record.wins}-${player.record.losses}${player.record.draws > 0 ? `-${player.record.draws}` : ''}`
                              : '-'}
                          </div>
                          {selectedTournament.format === 'swiss' && player.tiebreakers && (
                            <>
                              <div className="standing-tiebreaker">
                                {player.tiebreakers.opponentMatchWinPercentage !== undefined 
                                  ? (player.tiebreakers.opponentMatchWinPercentage * 100).toFixed(2) + '%'
                                  : '-'}
                              </div>
                              <div className="standing-tiebreaker">
                                {player.tiebreakers.gameWinPercentage !== undefined 
                                  ? (player.tiebreakers.gameWinPercentage * 100).toFixed(2) + '%'
                                  : '-'}
                              </div>
                              <div className="standing-tiebreaker">
                                {player.tiebreakers.opponentGameWinPercentage !== undefined 
                                  ? (player.tiebreakers.opponentGameWinPercentage * 100).toFixed(2) + '%'
                                  : '-'}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Bracket tab */}
          {activeTab === 'bracket' && (
            <div className="bracket-tab">
              <h3>Tournament Bracket</h3>
              
              {/* This would be a more complex component in a real implementation */}
              <div className="bracket-container">
                <div className="empty-container">
                  <Trophy size={32} />
                  <p>Bracket visualization not available in this demo.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Admin tab */}
          {activeTab === 'admin' && (isAdmin || isJudge || selectedTournament.organizer.id === user?.uid) && (
            <div className="admin-tab">
              <h3>Tournament Administration</h3>
              
              <div className="admin-sections">
                <div className="admin-section">
                  <h4>Tournament Settings</h4>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      // Edit tournament
                    }}
                    className="admin-button"
                  >
                    <Edit size={16} />
                    <span>Edit Tournament</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      // Print pairings
                    }}
                    className="admin-button"
                  >
                    <Printer size={16} />
                    <span>Print Pairings</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      // Export results
                    }}
                    className="admin-button"
                  >
                    <Download size={16} />
                    <span>Export Results</span>
                  </button>
                </div>
                
                <div className="admin-section">
                  <h4>Registration Codes</h4>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      handleGenerateRegistrationCode(selectedTournament.id, 100, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
                    }}
                    className="admin-button"
                  >
                    <Plus size={16} />
                    <span>Generate Code</span>
                  </button>
                  
                  {registrationCodes.filter(code => code.tournamentId === selectedTournament.id).length > 0 ? (
                    <div className="registration-codes-list">
                      {registrationCodes
                        .filter(code => code.tournamentId === selectedTournament.id)
                        .map(code => (
                          <div key={code.code} className="registration-code">
                            <div className="code-value">{code.code}</div>
                            <div className="code-details">
                              <div className="code-usage">
                                {code.currentUses}/{code.maxUses || '∞'} uses
                              </div>
                              {code.expiresAt && (
                                <div className="code-expiry">
                                  Expires: {new Date(code.expiresAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(code.code);
                              }}
                              className="copy-code-button"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="empty-container">
                      <p>No registration codes generated yet.</p>
                    </div>
                  )}
                </div>
                
                <div className="admin-section">
                  <h4>Judge Tools</h4>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      // Add time extension
                    }}
                    className="admin-button"
                  >
                    <Clock size={16} />
                    <span>Add Time Extension</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      // Issue penalty
                    }}
                    className="admin-button"
                  >
                    <AlertCircle size={16} />
                    <span>Issue Penalty</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      // View judge log
                    }}
                    className="admin-button"
                  >
                    <FileText size={16} />
                    <span>Judge Log</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render tournament templates
  const renderTournamentTemplates = () => {
    return (
      <div className="tournament-templates">
        <h3>Tournament Templates</h3>
        
        {templates.length === 0 ? (
          <div className="empty-container">
            <FileText size={32} />
            <p>No templates available.</p>
          </div>
        ) : (
          <div className="templates-list">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <h4>{template.name}</h4>
                  <div className="template-format">{template.format.replace('-', ' ')}</div>
                </div>
                
                {template.description && (
                  <div className="template-description">
                    <p>{template.description}</p>
                  </div>
                )}
                
                <div className="template-details">
                  {template.rounds && (
                    <div className="template-detail">
                      <Clock size={16} />
                      <span>{template.rounds} Rounds</span>
                    </div>
                  )}
                </div>
                
                <div className="template-actions">
                  <button 
                    type="button"
                    onClick={() => {
                      // Use template
                      setFormData(prev => ({
                        ...prev,
                        format: template.format,
                        rounds: template.rounds || 0,
                        rules: template.rules || '',
                        prizes: template.prizes || '',
                        tags: template.tags || []
                      }));
                      setShowCreateForm(true);
                    }}
                    className="use-template-button"
                  >
                    <Copy size={16} />
                    <span>Use Template</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="delete-template-button"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render mobile judge tools
  const renderMobileJudgeTools = () => {
    return (
      <div className="mobile-judge-tools">
        <h3>Judge Tools</h3>
        
        <div className="judge-tools-grid">
          <button 
            type="button"
            onClick={() => {
              // View pairings
            }}
            className="judge-tool-button"
          >
            <Users size={24} />
            <span>Pairings</span>
          </button>
          
          <button 
            type="button"
            onClick={() => {
              // View standings
            }}
            className="judge-tool-button"
          >
            <Award size={24} />
            <span>Standings</span>
          </button>
          
          <button 
            type="button"
            onClick={() => {
              // Add time extension
            }}
            className="judge-tool-button"
          >
            <Clock size={24} />
            <span>Time Extension</span>
          </button>
          
          <button 
            type="button"
            onClick={() => {
              // Issue penalty
            }}
            className="judge-tool-button"
          >
            <AlertCircle size={24} />
            <span>Issue Penalty</span>
          </button>
          
          <button 
            type="button"
            onClick={() => {
              // Player drop
            }}
            className="judge-tool-button"
          >
            <UserX size={24} />
            <span>Player Drop</span>
          </button>
          
          <button 
            type="button"
            onClick={() => {
              // Result entry
            }}
            className="judge-tool-button"
          >
            <CheckCircle size={24} />
            <span>Result Entry</span>
          </button>
          
          <button 
            type="button"
            onClick={() => {
              // Judge log
            }}
            className="judge-tool-button"
          >
            <FileText size={24} />
            <span>Judge Log</span>
          </button>
          
          <button 
            type="button"
            onClick={() => {
              // Tournament settings
            }}
            className="judge-tool-button"
          >
            <Settings size={24} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    );
  };
  
  // Render live tournament bracket
  const renderLiveTournamentBracket = () => {
    return (
      <div className="live-tournament-bracket">
        <h3>Live Tournament Bracket</h3>
        
        {/* This would be a more complex component in a real implementation */}
        <div className="bracket-container">
          <div className="empty-container">
            <Trophy size={32} />
            <p>Bracket visualization not available in this demo.</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Render confirmation modal
  const renderConfirmationModal = () => {
    if (!showConfirmation) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={() => setShowConfirmation(null)}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Confirmation</h2>
            <button 
              type="button"
              onClick={() => setShowConfirmation(null)}
              className="close-button"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="confirmation-message">
              <AlertCircle size={24} className="confirmation-icon" />
              <p>{showConfirmation.message}</p>
            </div>
            
            <div className="confirmation-actions">
              <button 
                type="button"
                onClick={() => setShowConfirmation(null)}
                className="cancel-button"
              >
                Cancel
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  switch (showConfirmation.type) {
                    case 'delete-tournament':
                      handleDeleteTournament();
                      break;
                    case 'drop-player':
                      handlePlayerDrop(showConfirmation.id);
                      break;
                    case 'disqualify-player':
                      handlePlayerDisqualify(showConfirmation.id);
                      break;
                    case 'cancel-tournament':
                      handleCancelTournament();
                      break;
                    case 'finalize-tournament':
                      handleFinalizeTournament();
                      break;
                  }
                }}
                className="confirm-button"
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  // Render the appropriate variant
  switch (actualVariant) {
    case 'browser':
      return (
        <div className={`unified-tournament-manager browser-variant ${className}`}>
          {selectedTournament ? renderTournamentDetails() : renderTournamentBrowser()}
          <AnimatePresence>
            {showConfirmation && renderConfirmationModal()}
          </AnimatePresence>
        </div>
      );
    case 'enhanced':
      return (
        <div className={`unified-tournament-manager enhanced-variant ${className}`}>
          {selectedTournament ? renderTournamentDetails() : renderTournamentBrowser()}
          <AnimatePresence>
            {showConfirmation && renderConfirmationModal()}
          </AnimatePresence>
        </div>
      );
    case 'mobile':
      return (
        <div className={`unified-tournament-manager mobile-variant ${className}`}>
          {selectedTournament ? renderTournamentDetails() : renderTournamentBrowser()}
          <AnimatePresence>
            {showConfirmation && renderConfirmationModal()}
          </AnimatePresence>
        </div>
      );
    case 'judge':
      return (
        <div className={`unified-tournament-manager judge-variant ${className}`}>
          {renderMobileJudgeTools()}
        </div>
      );
    case 'live':
      return (
        <div className={`unified-tournament-manager live-variant ${className}`}>
          {renderLiveTournamentBracket()}
        </div>
      );
    default:
      return (
        <div className={`unified-tournament-manager standard-variant ${className}`}>
          {selectedTournament ? renderTournamentDetails() : renderTournamentBrowser()}
          <AnimatePresence>
            {showConfirmation && renderConfirmationModal()}
          </AnimatePresence>
        </div>
      );
  }
};

export default UnifiedTournamentManager;