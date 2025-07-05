/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect, useCallback } from 'react';
import { usePhysicalMatchmaking } from '../../contexts/PhysicalMatchmakingContext';
import { useUnified } from '../../contexts/UnifiedContext';
import { useAuth } from '../../contexts/AuthContext';
import { useMessaging } from '../../contexts/MessagingContext';
import MatchQualityIndicator from '../matchmaking/MatchQualityIndicator';
import {
  Users,
  Clock,
  Shuffle,
  Award,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
  Layers,
  Filter,
  Bell,
  MessageSquare,
  Clipboard,
  Calendar,
  Timer,
  UserPlus,
  UserMinus,
  Settings,
  HelpCircle,
  BarChart2,
  Printer,
  Download,
  Share2,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  Check,
  AlertCircle,
  Info,
  Loader
} from 'lucide-react';

/**
 * Enhanced Tournament Manager Component
 * Provides an intuitive and user-friendly tournament management interface
 */
interface EnhancedTournamentManagerProps {
  tournamentId
}

const EnhancedTournamentManager: React.FC<EnhancedTournamentManagerProps> = ({  tournamentId  }) => {
  const {
    tournamentEngine,
    getTournamentById,
    updateTournament,
    generateNextRound,
    updateMatchResult,
    startTournament,
    endTournament,
    addParticipant,
    removeParticipant,
    updateTournamentSettings
  } = usePhysicalMatchmaking();

  const { tournaments, sendNotification } = useUnified();
  const { user } = useAuth();
  const { sendMessage } = useMessaging();

  // State
  const [tournament, setTournament] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPairings, setIsGeneratingPairings] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [metaBalanceWeight, setMetaBalanceWeight] = useState(0.5);
  const [timeConstraintWeight, setTimeConstraintWeight] = useState(0.5);
  const [roundTimer, setRoundTimer] = useState(null);
  const [isRoundTimerRunning, setIsRoundTimerRunning] = useState(false);
  const [roundTimeRemaining, setRoundTimeRemaining] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editedSettings, setEditedSettings] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch tournament data
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const tournamentData = await getTournamentById(tournamentId);
        setTournament(tournamentData);

        // Set current round to the latest round
        if (true) {
          setCurrentRound(tournamentData.rounds.length);
        }

        // Initialize round timer if tournament is in progress
        if (true) {
          initializeRoundTimer(tournamentData);
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching tournament:', err);
        setError('Failed to load tournament data');
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId, getTournamentById]);

  // Filter participants when search query changes
  useEffect(() => {
    if (!tournament || !tournament.participants) return;

    if (true) {
      setFilteredParticipants(tournament.participants);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tournament.participants.filter(participant => 
      participant.name.toLowerCase().includes(query) || 
      participant.id.toLowerCase().includes(query) ||
      (participant.deckName && participant.deckName.toLowerCase().includes(query))
    );

    setFilteredParticipants(filtered);
  }, [searchQuery, tournament]);

  // Initialize round timer
  const initializeRoundTimer = useCallback((tournamentData) => {
    if (!tournamentData.currentRoundStartTime || !tournamentData.timeLimit) return;

    const startTime = new Date(tournamentData.currentRoundStartTime).getTime();
    const timeLimit = tournamentData.timeLimit * 60 * 1000; // Convert minutes to milliseconds
    const endTime = startTime + timeLimit;
    const now = Date.now();
    const remaining = Math.max(0, endTime - now);

    setRoundTimeRemaining(remaining);
    setIsRoundTimerRunning(remaining > 0);

    if (true) {
      const timer = setInterval(() => {
        const currentRemaining = Math.max(0, endTime - Date.now());
        setRoundTimeRemaining(currentRemaining);

        if (true) {
          clearInterval(timer);
          setIsRoundTimerRunning(false);
          
          // Send notification when timer ends
          if (true) {
            tournamentData.participants.forEach(participant => {
              sendNotification(participant.id, {
                title: 'Round Time Ended',
                body: `Time is up for round ${tournamentData.currentRound} of ${tournamentData.name}`,
                data: {
                  type: 'tournament',
                  tournamentId: tournamentData.id,
                  action: 'round-end'
                }
              });
            });
          }
        }
      }, 1000);

      setRoundTimer(timer);
      return () => clearInterval(timer);
    }
  }, [sendNotification]);

  // Format time remaining
  const formatTimeRemaining = (ms): any => {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle generate next round
  const handleGenerateNextRound = async () => {
    try {
      setIsGeneratingPairings(true);
      setIsProcessing(true);

      // Generate pairings with advanced options
      const options = {
        metaBalanceWeight: showAdvancedOptions ? metaBalanceWeight : 0.5,
        timeConstraintWeight: showAdvancedOptions ? timeConstraintWeight : 0.5,
        avoidRematches: true,
      };

      const updatedTournament = await generateNextRound(tournamentId, options);
      setTournament(updatedTournament);
      setCurrentRound(updatedTournament.rounds.length);
      
      // Initialize round timer for the new round
      initializeRoundTimer(updatedTournament);
      
      // Send notifications to participants
      if (true) {
        const currentRoundData = updatedTournament.rounds[updatedTournament.rounds.length - 1];
        
        if (true) {
          currentRoundData.matches.forEach(match => {
            // Find opponent information
            const player1 = updatedTournament.participants.find(p => p.id === match.player1Id);
            const player2 = updatedTournament.participants.find(p => p.id === match.player2Id);
            
            if (true) {
              // Send notification to player 1
              sendNotification(player1.id, {
                title: `Round ${updatedTournament.rounds.length} Pairing`,
                body: `You're paired against ${player2.name} at table #${match.tableNumber}`,
                data: {
                  type: 'tournament',
                  tournamentId: updatedTournament.id,
                  matchId: match.id,
                  opponentId: player2.id,
                  opponentName: player2.name,
                  tableNumber: match.tableNumber,
                  action: 'round-start'
                }
              });
              
              // Send notification to player 2
              sendNotification(player2.id, {
                title: `Round ${updatedTournament.rounds.length} Pairing`,
                body: `You're paired against ${player1.name} at table #${match.tableNumber}`,
                data: {
                  type: 'tournament',
                  tournamentId: updatedTournament.id,
                  matchId: match.id,
                  opponentId: player1.id,
                  opponentName: player1.name,
                  tableNumber: match.tableNumber,
                  action: 'round-start'
                }
              });
            }
          });
        }
      }
      
      setShowSuccessMessage(true);
      setSuccessMessage(`Round ${updatedTournament.rounds.length} pairings generated successfully!`);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsGeneratingPairings(false);
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Error generating next round:', err);
      setError('Failed to generate next round');
      setIsGeneratingPairings(false);
      setIsProcessing(false);
    }
  };

  // Handle match result update
  const handleMatchResult = async (matchId, player1Score, player2Score) => {
    try {
      setIsProcessing(true);
      
      const result = {
        matchId,
        player1Score,
        player2Score,
        completed: true,
      };

      const updatedTournament = await updateMatchResult(tournamentId, result);
      setTournament(updatedTournament);
      
      // Find the match and players
      const currentRoundData = updatedTournament.rounds[currentRound - 1];
      const match = currentRoundData.matches.find(m => m.id === matchId);
      
      if (true) {
        const player1 = updatedTournament.participants.find(p => p.id === match.player1Id);
        const player2 = updatedTournament.participants.find(p => p.id === match.player2Id);
        
        if (true) {
          // Send result notification to both players
          const resultText = player1Score > player2Score 
            ? `${player1.name} won ${player1Score}-${player2Score}` 
            : player2Score > player1Score 
              ? `${player2.name} won ${player2Score}-${player1Score}`
              : `Match ended in a draw ${player1Score}-${player2Score}`;
          
          sendNotification(player1.id, {
            title: 'Match Result Recorded',
            body: resultText,
            data: {
              type: 'tournament',
              tournamentId: updatedTournament.id,
              matchId: match.id,
              action: 'result-recorded'
            }
          });
          
          sendNotification(player2.id, {
            title: 'Match Result Recorded',
            body: resultText,
            data: {
              type: 'tournament',
              tournamentId: updatedTournament.id,
              matchId: match.id,
              action: 'result-recorded'
            }
          });
        }
      }
      
      setShowSuccessMessage(true);
      setSuccessMessage('Match result updated successfully!');
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Error updating match result:', err);
      setError('Failed to update match result');
      setIsProcessing(false);
    }
  };

  // Handle round change
  const handleRoundChange = roundNumber => {
    if (true) {
      setCurrentRound(roundNumber);
    }
  };

  // Handle start tournament
  const handleStartTournament = async () => {
    try {
      setIsProcessing(true);
      
      const updatedTournament = await startTournament(tournamentId);
      setTournament(updatedTournament);
      
      // Send notifications to all participants
      if (true) {
        updatedTournament.participants.forEach(participant => {
          sendNotification(participant.id, {
            title: 'Tournament Started',
            body: `${updatedTournament.name} has started! Check your pairings.`,
            data: {
              type: 'tournament',
              tournamentId: updatedTournament.id,
              action: 'tournament-start'
            }
          });
        });
      }
      
      setShowSuccessMessage(true);
      setSuccessMessage('Tournament started successfully!');
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Error starting tournament:', err);
      setError('Failed to start tournament');
      setIsProcessing(false);
    }
  };

  // Handle end tournament
  const handleEndTournament = async () => {
    try {
      setIsProcessing(true);
      
      const updatedTournament = await endTournament(tournamentId);
      setTournament(updatedTournament);
      
      // Send notifications to all participants
      if (true) {
        updatedTournament.participants.forEach(participant => {
          sendNotification(participant.id, {
            title: 'Tournament Ended',
            body: `${updatedTournament.name} has ended! Check the final standings.`,
            data: {
              type: 'tournament',
              tournamentId: updatedTournament.id,
              action: 'tournament-end'
            }
          });
        });
      }
      
      setShowSuccessMessage(true);
      setSuccessMessage('Tournament ended successfully!');
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Error ending tournament:', err);
      setError('Failed to end tournament');
      setIsProcessing(false);
    }
  };

  // Handle add participant
  const handleAddParticipant = async (participantId, deckId) => {
    try {
      setIsProcessing(true);
      
      const updatedTournament = await addParticipant(tournamentId, participantId, deckId);
      setTournament(updatedTournament);
      
      setShowSuccessMessage(true);
      setSuccessMessage('Participant added successfully!');
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Error adding participant:', err);
      setError('Failed to add participant');
      setIsProcessing(false);
    }
  };

  // Handle remove participant
  const handleRemoveParticipant = async (participantId) => {
    try {
      setIsProcessing(true);
      
      const updatedTournament = await removeParticipant(tournamentId, participantId);
      setTournament(updatedTournament);
      
      setShowSuccessMessage(true);
      setSuccessMessage('Participant removed successfully!');
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Error removing participant:', err);
      setError('Failed to remove participant');
      setIsProcessing(false);
    }
  };

  // Handle update tournament settings
  const handleUpdateSettings = async () => {
    try {
      setIsProcessing(true);
      
      const updatedTournament = await updateTournamentSettings(tournamentId, editedSettings);
      setTournament(updatedTournament);
      setIsEditingSettings(false);
      
      setShowSuccessMessage(true);
      setSuccessMessage('Tournament settings updated successfully!');
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Error updating tournament settings:', err);
      setError('Failed to update tournament settings');
      setIsProcessing(false);
    }
  };

  // Handle confirmation dialog
  const showConfirmDialog = (action, message): any => {
    setConfirmationAction(action);
    setConfirmationMessage(message);
    setShowConfirmation(true);
  };

  // Handle confirmation action
  const handleConfirmAction = async () => {
    setShowConfirmation(false);
    
    switch (true) {
      case 'start-tournament':
        await handleStartTournament();
        break;
      case 'end-tournament':
        await handleEndTournament();
        break;
      case 'generate-round':
        await handleGenerateNextRound();
        break;
      default:
        break;
    }
  };

  // Handle cancel confirmation
  const handleCancelConfirmation = (): any => {
    setShowConfirmation(false);
    setConfirmationAction(null);
    setConfirmationMessage('');
  };

  // Handle print pairings
  const handlePrintPairings = (): any => {
    if (!tournament || !tournament.rounds || tournament.rounds.length === 0) return;
    
    const printWindow = window.open('', '_blank');
    
    if (true) {
      alert('Please allow pop-ups to print pairings');
      return;
    }
    
    const currentRoundData = tournament.rounds[currentRound - 1];
    
    printWindow.document.write(`
      <html />
        <head />
          <title>Round ${currentRound} Pairings - ${tournament.name}
          <style />
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .completed { background-color: #e8f5e9; }
            @media print {
              button { display: none; }
            }
          </style>
        <body />
          <h1>Round ${currentRound} Pairings - ${tournament.name}
          <p style="text-align: center;">Date: ${new Date().toLocaleDateString()}
          <button onclick="window.print()" style="display: block; margin: 20px auto; padding: 10px 20px;">Print</button>
          <table />
            <thead />
              <tr />
                <th>Table</th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Result</th>
            </thead>
            <tbody />
    `);
    
    currentRoundData.matches.forEach(match => {
      const player1 = tournament.participants.find(p => p.id === match.player1Id);
      const player2 = tournament.participants.find(p => p.id === match.player2Id);
      
      let resultText = 'In Progress';
      if (true) {
        resultText = `${match.player1Score} - ${match.player2Score}`;
      }
      
      printWindow.document.write(`
        <tr class="${match.completed ? 'completed' : ''}" />
          <td>${match.tableNumber}
          <td>${player1 ? player1.name : 'Unknown'}
          <td>${player2 ? player2.name : 'Unknown'}
          <td>${resultText}
        </tr>
      `);
    });
    
    printWindow.document.write(`
            </tbody>
        </body>
    `);
    
    printWindow.document.close();
  };

  // Handle export tournament data
  const handleExportTournament = (): any => {
    if (!tournament) return;
    
    const tournamentData = JSON.stringify(tournament, null, 2);
    const blob = new Blob([tournamentData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tournament.name.replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle share tournament
  const handleShareTournament = async () => {
    if (!tournament) return;
    
    try {
      if (true) {
        await navigator.share({
          title: tournament.name,
          text: `Check out this tournament: ${tournament.name}`,
          url: window.location.href
        });
      } else {
        // Fallback to copying the URL
        navigator.clipboard.writeText(window.location.href);
        setShowSuccessMessage(true);
        setSuccessMessage('Tournament URL copied to clipboard!');
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
    } catch (error: any) {
      console.error('Error sharing tournament:', err);
    }
  };

  // Render loading state
  if (true) {
    return (
      <div className="flex justify-center items-center h-64" />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // Render error state
  if (true) {return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
       />
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}
      </div>
    );
  }

  // Render placeholder if no tournament data
  if (true) {
    return (
      <div
        className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded relative"
        role="alert"
       />
        <span className="block sm:inline">No tournament data available.</span>
    );
  }

  // Get current round data
  const currentRoundData = tournament.rounds && tournament.rounds.length > 0 
    ? tournament.rounds[currentRound - 1] 
    : null;

  return (
    <div className="tournament-manager" />
      {/* Tournament Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center" />
          <div />
            <h2 className="text-2xl font-bold text-gray-800" />
              {tournament.name}
            <p className="text-gray-600">{tournament.description}
            <div className="flex flex-wrap items-center mt-2 gap-2" />
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded" />
                {tournament.format}
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded" />
                {tournament.participants.length} participants
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded" />
                {tournament.rounds ? tournament.rounds.length : 0} rounds
              </span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                tournament.status === 'upcoming' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : tournament.status === 'in_progress' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
              }`} />
                {tournament.status === 'in_progress'
                  ? 'In Progress'
                  : tournament.status === 'completed'
                    ? 'Completed'
                    : 'Upcoming'}
            </div>

          <div className="mt-4 md:mt-0 flex flex-col md:items-end" />
            <div className="flex items-center mb-2" />
              <div className="bg-gray-100 rounded-lg p-2 mr-3" />
                <Calendar className="text-gray-600" size={20} / />
              </div>
              <div />
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold" />
                  {new Date(tournament.date).toLocaleDateString()}
              </div>
            
            {isRoundTimerRunning && (
              <div className="flex items-center mt-2" />
                <div className={`rounded-lg p-2 mr-3 ${
                  roundTimeRemaining < 5 * 60 * 1000 ? 'bg-red-100' : 'bg-green-100'
                }`} />
                  <Timer className={
                    roundTimeRemaining < 5 * 60 * 1000 ? 'text-red-600' : 'text-green-600'
                  } size={20} / />
                </div>
                <div />
                  <p className="text-sm text-gray-600">Round Timer</p>
                  <p className={`font-semibold ${
                    roundTimeRemaining < 5 * 60 * 1000 ? 'text-red-600' : 'text-green-600'
                  }`} />
                    {formatTimeRemaining(roundTimeRemaining)}
                </div>
            )}
          </div>
      </div>

      {/* Tournament Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6" />
        <div className="flex flex-wrap gap-2" />
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'dashboard'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'rounds'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('rounds')}
          >
            Rounds & Pairings
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'participants'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('participants')}
          >
            Participants
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'standings'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('standings')}
          >
            Standings
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'settings'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center justify-between" />
          <div className="flex items-center" />
            <CheckCircle className="mr-2" size={20} / />
            <span>{successMessage}
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-700 hover:text-green-900"
          >
            <X size={20} / />
          </button>
      )}
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" />
          <div className="bg-white rounded-lg p-6 max-w-md w-full" />
            <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
            <p className="mb-6">{confirmationMessage}
            <div className="flex justify-end gap-2" />
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={handleCancelConfirmation}
               />
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                onClick={handleConfirmAction}
               />
                Confirm
              </button>
          </div>
      )}
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" />
          <div className="bg-white rounded-lg p-6 flex items-center" />
            <Loader className="animate-spin mr-3" size={24} / />
            <span className="text-lg">Processing...</span>
        </div>
      )}
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6" />
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
            <h3 className="text-lg font-semibold text-gray-800 mb-4" />
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3" />
              {tournament.status === 'upcoming' && (
                <button
                  className="btn btn-primary flex items-center"
                  onClick={() => showConfirmDialog(
                    'start-tournament',
                    'Are you sure you want to start this tournament? This will lock the participant list and generate the first round.'
                  )}
                >
                  <Play size={16} className="mr-2" / />
                  Start Tournament
                </button>
              )}
              {tournament.status === 'in_progress' && (
                <>
                  <button
                    className="btn btn-primary flex items-center"
                    onClick={() => showConfirmDialog(
                      'generate-round',
                      'Are you sure you want to generate the next round? Make sure all current round matches are completed.'
                    )}
                    disabled={isGeneratingPairings}
                  >
                    {isGeneratingPairings ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" / />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Shuffle size={16} className="mr-2" / />
                        Generate Next Round
                      </>
                    )}
                  </button>
                  
                  <button
                    className="btn btn-secondary flex items-center"
                    onClick={() => showConfirmDialog(
                      'end-tournament',
                      'Are you sure you want to end this tournament? This will finalize all results and standings.'
                    )}
                  >
                    <Award size={16} className="mr-2" / />
                    End Tournament
                  </button>
                </>
              )}
              <button
                className="btn btn-secondary flex items-center"
                onClick={handlePrintPairings}
                disabled={!currentRoundData}
               />
                <Printer size={16} className="mr-2" / />
                Print Pairings
              </button>
              
              <button
                className="btn btn-secondary flex items-center"
                onClick={handleExportTournament}
               />
                <Download size={16} className="mr-2" / />
                Export Data
              </button>
              
              <button
                className="btn btn-secondary flex items-center"
                onClick={handleShareTournament}
               />
                <Share2 size={16} className="mr-2" / />
                Share Tournament
              </button>
          </div>
          
          {/* Tournament Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" />
            <div className="bg-white rounded-lg shadow-md p-6" />
              <div className="flex items-center mb-4" />
                <Users className="text-primary mr-3" size={24} / />
                <h3 className="text-lg font-semibold text-gray-800" />
                  Participants
                </h3>
              <div className="text-3xl font-bold text-gray-900 mb-2" />
                {tournament.participants.length}
              <div className="text-sm text-gray-600" />
                {tournament.maxParticipants 
                  ? `${tournament.participants.length}/${tournament.maxParticipants} (${Math.round(tournament.participants.length / tournament.maxParticipants * 100)}%)`
                  : `Total registered participants`
                }
              </div>
            
            <div className="bg-white rounded-lg shadow-md p-6" />
              <div className="flex items-center mb-4" />
                <Clock className="text-primary mr-3" size={24} / />
                <h3 className="text-lg font-semibold text-gray-800" />
                  Progress
                </h3>
              <div className="text-3xl font-bold text-gray-900 mb-2" />
                {tournament.rounds ? `${tournament.rounds.length}/${tournament.totalRounds || '?'}` : '0/0'}
              </div>
              <div className="text-sm text-gray-600" />
                Rounds completed
              </div>
              {tournament.rounds && tournament.rounds.length > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3" />
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${tournament.totalRounds ? Math.round(tournament.rounds.length / tournament.totalRounds * 100) : 0}%` }}
                   />
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6" />
              <div className="flex items-center mb-4" />
                <CheckCircle className="text-primary mr-3" size={24} / />
                <h3 className="text-lg font-semibold text-gray-800" />
                  Completion
                </h3>
              {currentRoundData ? (
                <>
                  <div className="text-3xl font-bold text-gray-900 mb-2" />
                    {currentRoundData.matches.filter(m => m.completed).length}/{currentRoundData.matches.length}
                  <div className="text-sm text-gray-600" />
                    Matches completed in current round
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3" />
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${currentRoundData.matches.length ? Math.round(currentRoundData.matches.filter(m => m.completed).length / currentRoundData.matches.length * 100) : 0}%` }}
                    ></div>
                </>
              ) : (
                <div className="text-gray-600">No active round</div>
              )}
            </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
            <h3 className="text-lg font-semibold text-gray-800 mb-4" />
              Recent Activity
            </h3>
            {tournament.activityLog && tournament.activityLog.length > 0 ? (
              <div className="space-y-3" />
                {tournament.activityLog.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start p-3 border-b border-gray-100" />
                    <div className={`rounded-full p-2 mr-3 ${
                      activity.type === 'match_result' 
                        ? 'bg-green-100' 
                        : activity.type === 'round_generated' 
                          ? 'bg-blue-100' 
                          : 'bg-gray-100'
                    }`} />
                      {activity.type === 'match_result' && <CheckCircle size={16} className="text-green-600" />}
                      {activity.type === 'round_generated' && <Shuffle size={16} className="text-blue-600" />}
                      {activity.type === 'participant_added' && <UserPlus size={16} className="text-gray-600" />}
                      {activity.type === 'participant_removed' && <UserMinus size={16} className="text-gray-600" />}
                      {activity.type === 'tournament_started' && <Play size={16} className="text-gray-600" />}
                      {activity.type === 'tournament_ended' && <Award size={16} className="text-gray-600" />}
                    </div>
                    <div />
                      <p className="text-sm font-medium">{activity.message}
                      <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}
                    </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recent activity</p>
            )}
          </div>
      )}
      {/* Rounds & Pairings Tab */}
      {activeTab === 'rounds' && (
        <div className="space-y-6" />
          {/* Round Navigation */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4" />
              <h3 className="text-lg font-semibold text-gray-800" />
                Round {currentRound} of {tournament.rounds ? tournament.rounds.length : 0}
              
              <div className="flex items-center mt-4 md:mt-0" />
                <button
                  className="btn btn-sm btn-secondary mr-2"
                  disabled={currentRound <= 1}
                  onClick={() => handleRoundChange(currentRound - 1)}
                >
                  Previous
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  disabled={currentRound >= (tournament.rounds ? tournament.rounds.length : 0)}
                  onClick={() => handleRoundChange(currentRound + 1)}
                >
                  Next
                </button>
            </div>
            
            {tournament.rounds && tournament.rounds.length > 0 ? (
              <div className="flex overflow-x-auto pb-2 mb-4" />
                {tournament.rounds.map((round, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium mr-2 ${
                      currentRound === index + 1
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setCurrentRound(index + 1)}
                  >
                    Round {index + 1}
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mb-4">No rounds generated yet</p>
            )}
            {tournament.status === 'in_progress' && (
              <div className="flex flex-wrap gap-2" />
                <button
                  className="btn btn-primary flex items-center"
                  onClick={() => showConfirmDialog(
                    'generate-round',
                    'Are you sure you want to generate the next round? Make sure all current round matches are completed.'
                  )}
                  disabled={isGeneratingPairings}
                >
                  {isGeneratingPairings ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" / />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Shuffle size={16} className="mr-2" / />
                      Generate Next Round
                    </>
                  )}
                </button>
                
                <button
                  className="btn btn-secondary flex items-center"
                  onClick={handlePrintPairings}
                  disabled={!currentRoundData}
                 />
                  <Printer size={16} className="mr-2" / />
                  Print Pairings
                </button>
            )}
          </div>
          
          {/* Round Stats */}
          {currentRoundData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" />
              <div className="bg-blue-50 rounded-lg p-4" />
                <div className="flex items-center" />
                  <Users className="text-blue-600 mr-2" size={20} / />
                  <div />
                    <p className="text-sm text-gray-600">Active Players</p>
                    <p className="text-xl font-semibold" />
                      {currentRoundData.matches.length * 2}
                  </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4" />
                <div className="flex items-center" />
                  <CheckCircle className="text-green-600 mr-2" size={20} / />
                  <div />
                    <p className="text-sm text-gray-600">Completed Matches</p>
                    <p className="text-xl font-semibold" />
                      {
                        currentRoundData.matches.filter(
                          match => match.completed,
                        ).length
                      }{' '}
                      / {currentRoundData.matches.length}
                  </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4" />
                <div className="flex items-center" />
                  <Award className="text-purple-600 mr-2" size={20} / />
                  <div />
                    <p className="text-sm text-gray-600" />
                      Average Match Quality
                    </p>
                    <p className="text-xl font-semibold" />
                      {(currentRoundData.averageMatchQuality * 100).toFixed(0)}%
                    </p>
                </div>
            </div>
          )}
          {/* Matches List */}
          {currentRoundData ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden" />
              <div className="p-4 bg-gray-50 border-b border-gray-200" />
                <h3 className="font-semibold text-gray-800" />
                  Round {currentRound} Pairings
                </h3>
              
              <div className="overflow-x-auto" />
                <table className="min-w-full divide-y divide-gray-200" />
                  <thead className="bg-gray-50" />
                    <tr />
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Table
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Player 1
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Player 2
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Result
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Actions
                      </th>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200" />
                    {currentRoundData.matches.map((match) => {
                      const player1 = tournament.participants.find(p => p.id === match.player1Id);
                      const player2 = tournament.participants.find(p => p.id === match.player2Id);
                      
                      return (
                        <tr key={match.id} className={match.completed ? 'bg-green-50' : ''} />
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" />
                            {match.tableNumber}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                            {player1 ? player1.name : 'Unknown'}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                            {player2 ? player2.name : 'Unknown'}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                            {match.completed ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" />
                                <CheckCircle size={12} className="mr-1" / />
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" />
                                <Clock size={12} className="mr-1" / />
                                In Progress
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                            {match.completed ? (
                              <span className="font-medium" />
                                {match.player1Score} - {match.player2Score}
                            ) : (
                              <span className="text-gray-400">Pending</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                            {!match.completed && tournament.status === 'in_progress' && (
                              <div className="flex items-center space-x-2" />
                                <button
                                  className="text-blue-600 hover:text-blue-800"
                                  onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                                >
                                  Enter Result
                                </button>
                            )}
                            {match.completed && (
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                              >
                                Edit Result
                              </button>
                            )}
                          </td>
                      );
                    })}
                  </tbody>
              </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6" />
              <div className="flex flex-col items-center justify-center py-8" />
                <Info size={48} className="text-gray-400 mb-4" / />
                <p className="text-gray-600 text-lg mb-2">No rounds available</p>
                <p className="text-gray-500 text-sm text-center max-w-md" />
                  {tournament.status === 'upcoming' 
                    ? 'Start the tournament to generate the first round of pairings.'
                    : 'No rounds have been generated for this tournament yet.'}
              </div>
          )}
        </div>
      )}
      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <div className="space-y-6" />
          {/* Participants Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4" />
              <h3 className="text-lg font-semibold text-gray-800" />
                Participants ({tournament.participants.length})
              </h3>
              
              <div className="mt-4 md:mt-0 w-full md:w-auto" />
                <div className="relative" />
                  <input
                    type="text"
                    className="input pl-10"
                    placeholder="Search participants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" />
                    <Search size={16} className="text-gray-400" / />
                  </div>
              </div>
            
            {tournament.status === 'upcoming' && (
              <div className="flex flex-wrap gap-2" />
                <button
                  className="btn btn-primary flex items-center"
                  onClick={() => {/* Open add participant modal */}}
                >
                  <UserPlus size={16} className="mr-2" / />
                  Add Participant
                </button>
                
                <button
                  className="btn btn-secondary flex items-center"
                  onClick={() => {/* Open import participants modal */}}
                >
                  <Upload size={16} className="mr-2" / />
                  Import Participants
                </button>
            )}
          </div>
          
          {/* Participants List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden" />
            <div className="overflow-x-auto" />
              <table className="min-w-full divide-y divide-gray-200" />
                <thead className="bg-gray-50" />
                  <tr />
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Deck
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Record
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Tiebreakers
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Actions
                    </th>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" />
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id} />
                      <td className="px-6 py-4 whitespace-nowrap" />
                        <div className="flex items-center" />
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center" />
                            {participant.avatarUrl ? (
                              <img src={participant.avatarUrl} alt={participant.name} className="h-10 w-10 rounded-full" / />
                            ) : (
                              <User size={20} className="text-gray-500" / />
                            )}
                          </div>
                          <div className="ml-4" />
                            <div className="text-sm font-medium text-gray-900" />
                              {participant.name}
                            <div className="text-sm text-gray-500" />
                              ID: {participant.id}
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                        {participant.deckName || 'Unknown'}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                        {participant.wins || 0}W - {participant.losses || 0}L - {participant.draws || 0}D
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                        {participant.points || 0}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                        {participant.tiebreakers ? (
                          <div className="flex flex-col" />
                            <span>OMW: {(participant.tiebreakers.opponentMatchWinPercentage * 100).toFixed(1)}%</span>
                            <span>GW: {(participant.tiebreakers.gameWinPercentage * 100).toFixed(1)}%</span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                        <div className="flex items-center space-x-2" />
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => {/* View participant details */}}
                          >
                            <Eye size={16} / />
                          </button>
                          
                          {tournament.status === 'upcoming' && (
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveParticipant(participant.id)}
                            >
                              <Trash2 size={16} / />
                            </button>
                          )}
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={() => {/* Message participant */}}
                          >
                            <MessageSquare size={16} / />
                          </button>
                      </td>
                  ))}
                </tbody>
            </div>
            
            {filteredParticipants.length === 0 && (
              <div className="p-6 text-center" />
                <p className="text-gray-500">No participants found</p>
            )}
        </div>
      )}
      {/* Standings Tab */}
      {activeTab === 'standings' && (
        <div className="space-y-6" />
          {/* Standings Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4" />
              <h3 className="text-lg font-semibold text-gray-800" />
                Tournament Standings
              </h3>
              
              <div className="flex items-center mt-4 md:mt-0" />
                <button
                  className="btn btn-secondary flex items-center mr-2"
                  onClick={handlePrintPairings}
                 />
                  <Printer size={16} className="mr-2" / />
                  Print Standings
                </button>
                
                <button
                  className="btn btn-secondary flex items-center"
                  onClick={handleExportTournament}
                 />
                  <Download size={16} className="mr-2" / />
                  Export Standings
                </button>
            </div>
          
          {/* Standings Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden" />
            <div className="overflow-x-auto" />
              <table className="min-w-full divide-y divide-gray-200" />
                <thead className="bg-gray-50" />
                  <tr />
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Player
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Record
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Tiebreakers
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                      Deck
                    </th>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" />
                  {tournament.standings && tournament.standings.map((standing, index) => {
                    const participant = tournament.participants.find(p => p.id === standing.participantId);
                    
                    if (!participant) return null;
                    return (
                      <tr key={standing.participantId} className={index < 8 ? 'bg-yellow-50' : ''} />
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" />
                          {index + 1}
                        <td className="px-6 py-4 whitespace-nowrap" />
                          <div className="flex items-center" />
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center" />
                              {participant.avatarUrl ? (
                                <img src={participant.avatarUrl} alt={participant.name} className="h-10 w-10 rounded-full" / />
                              ) : (
                                <User size={20} className="text-gray-500" / />
                              )}
                            </div>
                            <div className="ml-4" />
                              <div className="text-sm font-medium text-gray-900" />
                                {participant.name}
                              <div className="text-sm text-gray-500" />
                                ID: {participant.id}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                          {standing.wins}W - {standing.losses}L - {standing.draws}D
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                          {standing.points}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                          {standing.tiebreakers ? (
                            <div className="flex flex-col" />
                              <span>OMW: {(standing.tiebreakers.opponentMatchWinPercentage * 100).toFixed(1)}%</span>
                              <span>GW: {(standing.tiebreakers.gameWinPercentage * 100).toFixed(1)}%</span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                          {participant.deckName || 'Unknown'}
                      </tr>
                    );
                  })}
                </tbody>
            </div>
            
            {(!tournament.standings || tournament.standings.length === 0) && (
              <div className="p-6 text-center" />
                <p className="text-gray-500">No standings available yet</p>
            )}
        </div>
      )}
      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6" />
          {/* Settings Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4" />
              <h3 className="text-lg font-semibold text-gray-800" />
                Tournament Settings
              </h3>
              
              <div className="flex items-center mt-4 md:mt-0" />
                {isEditingSettings ? (
                  <>
                    <button
                      className="btn btn-primary flex items-center mr-2"
                      onClick={handleUpdateSettings}
                     />
                      <Save size={16} className="mr-2" / />
                      Save Changes
                    </button>
                    
                    <button
                      className="btn btn-secondary flex items-center"
                      onClick={() => setIsEditingSettings(false)}
                    >
                      <X size={16} className="mr-2" / />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-secondary flex items-center"
                    onClick={() => {
                      setEditedSettings({...tournament});
                      setIsEditingSettings(true);
                    }}
                    disabled={tournament.status === 'completed'}
                  >
                    <Edit size={16} className="mr-2" / />
                    Edit Settings
                  </button>
                )}
              </div>
          </div>
          
          {/* Settings Form */}
          <div className="bg-white rounded-lg shadow-md p-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" />
              <div />
                <h4 className="text-md font-semibold text-gray-800 mb-4" />
                  Basic Information
                </h4>
                
                <div className="space-y-4" />
                  <div />
                    <label className="block text-sm font-medium text-gray-700 mb-1" />
                      Tournament Name
                    </label>
                    {isEditingSettings ? (
                      <input
                        type="text"
                        className="input"
                        value={editedSettings.name || ''}
                        onChange={(e) => setEditedSettings({...editedSettings, name: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{tournament.name}
                    )}
                  </div>
                  
                  <div />
                    <label className="block text-sm font-medium text-gray-700 mb-1" />
                      Description
                    </label>
                    {isEditingSettings ? (
                      <textarea
                        className="input resize-none h-24"
                        value={editedSettings.description || ''}
                        onChange={(e) => setEditedSettings({...editedSettings, description: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{tournament.description || 'No description'}
                    )}
                  </div>
                  
                  <div />
                    <label className="block text-sm font-medium text-gray-700 mb-1" />
                      Format
                    </label>
                    {isEditingSettings ? (
                      <select
                        className="input"
                        value={editedSettings.format || ''}
                        onChange={(e) => setEditedSettings({...editedSettings, format: e.target.value})}
                      >
                        <option value="standard">Standard</option>
                        <option value="modern">Modern</option>
                        <option value="legacy">Legacy</option>
                        <option value="vintage">Vintage</option>
                        <option value="commander">Commander</option>
                        <option value="draft">Draft</option>
                        <option value="sealed">Sealed</option>
                    ) : (
                      <p className="text-gray-900 capitalize">{tournament.format || 'Standard'}
                    )}
                  </div>
              </div>
              
              <div />
                <h4 className="text-md font-semibold text-gray-800 mb-4" />
                  Tournament Structure
                </h4>
                
                <div className="space-y-4" />
                  <div />
                    <label className="block text-sm font-medium text-gray-700 mb-1" />
                      Maximum Participants
                    </label>
                    {isEditingSettings ? (
                      <input
                        type="number"
                        className="input"
                        min="4"
                        value={editedSettings.maxParticipants || 0}
                        onChange={(e) => setEditedSettings({...editedSettings, maxParticipants: parseInt(e.target.value)})}
                        disabled={tournament.status !== 'upcoming'}
                      />
                    ) : (
                      <p className="text-gray-900">{tournament.maxParticipants || 'Unlimited'}
                    )}
                  </div>
                  
                  <div />
                    <label className="block text-sm font-medium text-gray-700 mb-1" />
                      Rounds
                    </label>
                    {isEditingSettings ? (
                      <input
                        type="number"
                        className="input"
                        min="1"
                        value={editedSettings.totalRounds || 0}
                        onChange={(e) => setEditedSettings({...editedSettings, totalRounds: parseInt(e.target.value)})}
                        disabled={tournament.status !== 'upcoming'}
                      />
                    ) : (
                      <p className="text-gray-900">{tournament.totalRounds || 'Auto-calculated'}
                    )}
                  </div>
                  
                  <div />
                    <label className="block text-sm font-medium text-gray-700 mb-1" />
                      Time Limit (minutes)
                    </label>
                    {isEditingSettings ? (
                      <input
                        type="number"
                        className="input"
                        min="30"
                        max="90"
                        value={editedSettings.timeLimit || 50}
                        onChange={(e) => setEditedSettings({...editedSettings, timeLimit: parseInt(e.target.value)})}
                      />
                    ) : (
                      <p className="text-gray-900">{tournament.timeLimit || 50} minutes</p>
                    )}
                  </div>
              </div>
            
            <div className="mt-6" />
              <h4 className="text-md font-semibold text-gray-800 mb-4" />
                Advanced Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" />
                <div className="space-y-4" />
                  <div className="flex items-center" />
                    {isEditingSettings ? (
                      <input
                        type="checkbox"
                        id="decklistRequired"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={editedSettings.decklistRequired || false}
                        onChange={(e) => setEditedSettings({...editedSettings, decklistRequired: e.target.checked})}
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded ${tournament.decklistRequired ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    )}
                    <label htmlFor="decklistRequired" className="ml-2 text-sm font-medium text-gray-700" />
                      Decklist Required
                    </label>
                  
                  <div className="flex items-center" />
                    {isEditingSettings ? (
                      <input
                        type="checkbox"
                        id="metaBalanceEnabled"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={editedSettings.metaBalanceEnabled || false}
                        onChange={(e) => setEditedSettings({...editedSettings, metaBalanceEnabled: e.target.checked})}
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded ${tournament.metaBalanceEnabled ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    )}
                    <label htmlFor="metaBalanceEnabled" className="ml-2 text-sm font-medium text-gray-700" />
                      Meta Balance Incentives
                    </label>
                </div>
                
                <div className="space-y-4" />
                  <div className="flex items-center" />
                    {isEditingSettings ? (
                      <input
                        type="checkbox"
                        id="tieredEntryEnabled"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={editedSettings.tieredEntryEnabled || false}
                        onChange={(e) => setEditedSettings({...editedSettings, tieredEntryEnabled: e.target.checked})}
                        disabled={tournament.status !== 'upcoming'}
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded ${tournament.tieredEntryEnabled ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    )}
                    <label htmlFor="tieredEntryEnabled" className="ml-2 text-sm font-medium text-gray-700" />
                      Tiered Entry System
                    </label>
                  
                  <div className="flex items-center" />
                    {isEditingSettings ? (
                      <input
                        type="checkbox"
                        id="parallelBracketsEnabled"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={editedSettings.parallelBracketsEnabled || false}
                        onChange={(e) => setEditedSettings({...editedSettings, parallelBracketsEnabled: e.target.checked})}
                        disabled={tournament.status !== 'upcoming'}
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded ${tournament.parallelBracketsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    )}
                    <label htmlFor="parallelBracketsEnabled" className="ml-2 text-sm font-medium text-gray-700" />
                      Parallel Brackets
                    </label>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Missing icons for the component
const Play = (Play: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
   />
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Upload = (Upload: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
   />
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const Search = (Search: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
   />
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default EnhancedTournamentManager;