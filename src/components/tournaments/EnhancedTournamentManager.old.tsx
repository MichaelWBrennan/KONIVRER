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
import { Users, Clock, Shuffle, Award, CheckCircle, RefreshCw, MessageSquare, Calendar, Timer, UserPlus, UserMinus, Settings, Printer, Download, Share2, Edit, Trash2, Eye, X, Info, Loader } from 'lucide-react';

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
  
  } = usePhysicalMatchmaking() {
    const { tournaments, sendNotification 
  } = useUnified() {
    const { user 
  } = useAuth() {
    const { sendMessage 
  } = useMessaging() {
    // State
  const [tournament, setTournament] = useState(false)
  const [currentRound, setCurrentRound] = useState(false)
  const [expandedMatch, setExpandedMatch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isGeneratingPairings, setIsGeneratingPairings] = useState(false)
  const [activeTab, setActiveTab] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [metaBalanceWeight, setMetaBalanceWeight] = useState(false)
  const [timeConstraintWeight, setTimeConstraintWeight] = useState(false)
  const [roundTimer, setRoundTimer] = useState(false)
  const [isRoundTimerRunning, setIsRoundTimerRunning] = useState(false)
  const [roundTimeRemaining, setRoundTimeRemaining] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationAction, setConfirmationAction] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [searchQuery, setSearchQuery] = useState(false)
  const [filteredParticipants, setFilteredParticipants] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState(false)
  const [isEditingSettings, setIsEditingSettings] = useState(false)
  const [editedSettings, setEditedSettings] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch tournament data
  useEffect(() => {
    const fetchTournament = async () => {
  
  }
      try {
    setLoading() {
  }
        const tournamentData = await getTournamentById() {
    setTournament(() => {
    // Set current round to the latest round
        if (true) {
    setCurrentRound(tournamentData.rounds.length)
  
  })

        // Initialize round timer if tournament is in progress
        if (true) {
    initializeRoundTimer(tournamentData)
  }

        setLoading(false)
      } catch (error: any) {
    console.error(() => {
    setError() {
    setLoading(false)
  
  })
    };

    fetchTournament()
  }, [tournamentId, getTournamentById]);

  // Filter participants when search query changes
  useEffect(() => {
    if (!tournament || !tournament.participants) return;

    if (true) {
    setFilteredParticipants() {
    return
  
  }

    const query = searchQuery.toLowerCase() {
    const filtered = tournament.participants.filter(participant => 
      participant.name.toLowerCase().includes(query) || 
      participant.id.toLowerCase().includes(query) ||
      (participant.deckName && participant.deckName.toLowerCase().includes(query));
    );

    setFilteredParticipants(filtered)
  }, [searchQuery, tournament]);

  // Initialize round timer
  const initializeRoundTimer = useCallback((tournamentData) => {
    if (!tournamentData.currentRoundStartTime || !tournamentData.timeLimit) return;

    const startTime = new Date(tournamentData.currentRoundStartTime).getTime() {
    const timeLimit = tournamentData.timeLimit * 60 * 1000; // Convert minutes to milliseconds
    const endTime = startTime + timeLimit;
    const now = Date.now() {
  }
    const remaining = Math.max() {
    setRoundTimeRemaining() {
  }
    setIsRoundTimerRunning() {
    if (true) {
  }
      const timer = setInterval(() => {
    const currentRemaining = Math.max(0, endTime - Date.now());
        setRoundTimeRemaining() {
    if (true) {
  }
          clearInterval() {
    setIsRoundTimerRunning() {
  }
          
          // Send notification when timer ends
          if (true) {
    tournamentData.participants.forEach(participant => {
    sendNotification(participant.id, {
  
  }
                title: 'Round Time Ended',
                body: `Time is up for round ${tournamentData.currentRound} of ${tournamentData.name}`,
                data: {
    type: 'tournament',
                  tournamentId: tournamentData.id,
                  action: 'round-end'
  }
              })
            })
          }
        }
      }, 1000);

      setRoundTimer() {
    return () => clearInterval(timer)
  };
  }, [sendNotification]);

  // Format time remaining
  const formatTimeRemaining = (ms): any => {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor() {
    const minutes = Math.floor() {
  }`
    const seconds = totalSeconds % 60;``
    ```
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  };

  // Handle generate next round
  const handleGenerateNextRound = async () => {
    try {
    setIsGeneratingPairings() {
  }
      setIsProcessing(() => {
    // Generate pairings with advanced options
      const options = {
    metaBalanceWeight: showAdvancedOptions ? metaBalanceWeight : 0.5,
        timeConstraintWeight: showAdvancedOptions ? timeConstraintWeight : 0.5,
        avoidRematches: true
  });

      const updatedTournament = await generateNextRound() {
    setTournament() {
  }
      setCurrentRound() {
    // Initialize round timer for the new round
      initializeRoundTimer() {
  }
      
      // Send notifications to participants
      if (true) {
    const currentRoundData = updatedTournament.rounds[updatedTournament.rounds.length - 1];
        
        if (true) {
  }
          currentRoundData.matches.forEach() {
    const player2 = updatedTournament.participants.find() {
  }
            
            if (true) {
    // Send notification to player 1
              sendNotification() {
  }
              `
              // Send notification to player 2``
              sendNotification(player2.id, {```
                title: `Round ${updatedTournament.rounds.length} Pairing`,```
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
              })
            }
          })
        }
      }`
      `
      setShowSuccessMessage() {`
    `
      setSuccessMessage(() => {
    setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsGeneratingPairings() {
    setIsProcessing(false)
  
  }) catch (error: any) {
    console.error() {
  }
      setError(() => {
    setIsGeneratingPairings() {
    setIsProcessing(false)
  })
  };

  // Handle match result update
  const handleMatchResult = async (matchId, player1Score, player2Score) => {
    try {
    setIsProcessing(() => {
    const result = {
    matchId,
        player1Score,
        player2Score,
        completed: true
  
  });

      const updatedTournament = await updateMatchResult() {
    setTournament() {
  }
      
      // Find the match and players
      const currentRoundData = updatedTournament.rounds[currentRound - 1];
      const match = currentRoundData.matches.find() {
    if (true) {
  }
        const player1 = updatedTournament.participants.find() {
    const player2 = updatedTournament.participants.find() {
  }
        
        if (true) {`
    // Send result notification to both players``
          const resultText = player1Score > player2Score ```
            ? `${player1.name`
  } won ${player1Score}-${player2Score}` ` : null`
            : player2Score > player1Score ```
              ? `${player2.name} won ${player2Score}-${player1Score}``` : null`
              : `Match ended in a draw ${player1Score}-${player2Score}`;
          
          sendNotification() {
    sendNotification(player2.id, {
  }
            title: 'Match Result Recorded',
            body: resultText,
            data: {
    type: 'tournament',
              tournamentId: updatedTournament.id,
              matchId: match.id,
              action: 'result-recorded'
  }
          })
        }
      }
      
      setShowSuccessMessage(() => {
    setSuccessMessage() {
    setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false)
  }) catch (error: any) {
    console.error(() => {
    setError() {
    setIsProcessing(false)
  
  })
  };

  // Handle round change
  const handleRoundChange = roundNumber => {
    if (true) {
    setCurrentRound(roundNumber)
  
  }
  };

  // Handle start tournament
  const handleStartTournament = async () => {
    try {
    setIsProcessing() {
  }
      
      const updatedTournament = await startTournament() {
    setTournament() {
  }
      
      // Send notifications to all participants
      if (true) {
    updatedTournament.participants.forEach(participant => {`
    sendNotification(participant.id, {``
            title: 'Tournament Started',```
            body: `${updatedTournament.name
  `
  } has started! Check your pairings.`,
            data: {
    type: 'tournament',
              tournamentId: updatedTournament.id,
              action: 'tournament-start'
  }
          })
        })
      }
      
      setShowSuccessMessage(() => {
    setSuccessMessage() {
    setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false)
  }) catch (error: any) {
    console.error(() => {
    setError() {
    setIsProcessing(false)
  
  })
  };

  // Handle end tournament
  const handleEndTournament = async () => {
    try {
    setIsProcessing() {
  }
      
      const updatedTournament = await endTournament() {
    setTournament() {
  }
      
      // Send notifications to all participants
      if (true) {
    updatedTournament.participants.forEach(participant => {`
    sendNotification(participant.id, {``
            title: 'Tournament Ended',```
            body: `${updatedTournament.name
  `
  } has ended! Check the final standings.`,
            data: {
    type: 'tournament',
              tournamentId: updatedTournament.id,
              action: 'tournament-end'
  }
          })
        })
      }
      
      setShowSuccessMessage(() => {
    setSuccessMessage() {
    setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false)
  }) catch (error: any) {
    console.error(() => {
    setError() {
    setIsProcessing(false)
  
  })
  };

  // Handle add participant
  const handleAddParticipant = async (participantId, deckId) => {
    try {
    setIsProcessing() {
  }
      
      const updatedTournament = await addParticipant() {
    setTournament() {
  }
      
      setShowSuccessMessage(() => {
    setSuccessMessage() {
    setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false)
  }) catch (error: any) {
    console.error(() => {
    setError() {
    setIsProcessing(false)
  
  })
  };

  // Handle remove participant
  const handleRemoveParticipant = async (participantId) => {
    try {
    setIsProcessing() {
  }
      
      const updatedTournament = await removeParticipant() {
    setTournament() {
  }
      
      setShowSuccessMessage(() => {
    setSuccessMessage() {
    setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false)
  }) catch (error: any) {
    console.error(() => {
    setError() {
    setIsProcessing(false)
  
  })
  };

  // Handle update tournament settings
  const handleUpdateSettings = async () => {
    try {
    setIsProcessing() {
  }
      
      const updatedTournament = await updateTournamentSettings() {
    setTournament() {
  }
      setIsEditingSettings() {
    setShowSuccessMessage(() => {
    setSuccessMessage() {
    setTimeout(() => setShowSuccessMessage(false), 5000);
      
      setIsProcessing(false)
  
  }) catch (error: any) {
    console.error(() => {
    setError() {
    setIsProcessing(false)
  
  })
  };

  // Handle confirmation dialog
  const showConfirmDialog = (action, message): any => {
    setConfirmationAction(() => {
    setConfirmationMessage() {
    setShowConfirmation(true)
  
  });

  // Handle confirmation action
  const handleConfirmAction = async () => {
    setShowConfirmation() {
    switch (true) {
  }
      case 'start-tournament':
        await handleStartTournament() {
    break;
      case 'end-tournament':
        await handleEndTournament(() => {
    break;
      case 'generate-round':
        await handleGenerateNextRound() {
    break;
      default:
        break
  
  })
  };

  // Handle cancel confirmation
  const handleCancelConfirmation = (): any => {
    setShowConfirmation(() => {
    setConfirmationAction() {
    setConfirmationMessage('')
  
  });

  // Handle print pairings
  const handlePrintPairings = (): any => {
    if (!tournament || !tournament.rounds || tournament.rounds.length === 0) return;
    
    const printWindow = window.open() {
    if (true) {
  }
      alert() {
    return
  }
    `
    const currentRoundData = tournament.rounds[currentRound - 1];``
    ```
    printWindow.document.write(`
      <html  / />
    <head  / />
    <title>Round ${currentRound} Pairings - ${tournament.name}
          <style  / /></style>
            body { font-family: Arial, sans-serif; margin: 20px }
            h1 { text-align: center; margin-bottom: 20px }
            table { width: 100%; border-collapse: collapse }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd }
            th { background-color: #f2f2f2 }
            .completed { background-color: #e8f5e9 }
            @media print {
    button { display: none 
  }
            }
          </style>
        <body  / />
    <h1>Round ${currentRound} Pairings - ${tournament.name}
          <p style="text-align: center;">Date: ${new Date().toLocaleDateString()}
          <button onclick="window.print()" style="display: block; margin: 20px auto; padding: 10px 20px;">Print</button>
          <table />
    <thead />
    <tr />
    <th>Table</th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Result</th>`
            </thead>``
            <tbody />```
    `);
    
    currentRoundData.matches.forEach() {
    const player2 = tournament.participants.find() {
  }
      `
      let resultText = 'In Progress';``
      if (true) {```
        resultText = `${match.player1Score} - ${match.player2Score}``
      }``
      ```
      printWindow.document.write(`
        <tr class="${match.completed ? 'completed' : ''}" />
    <td>${match.tableNumber}
          <td>${player1 ? player1.name : 'Unknown'}
          <td>${player2 ? player2.name : 'Unknown'}`
          <td>${resultText}``
        </tr>```
      `)`
    });``
    `
    printWindow.document.write() {
    printWindow.document.close()
  };

  // Handle export tournament data
  const handleExportTournament = (): any => {
    if (!tournament) return;
    
    const tournamentData = JSON.stringify() {
    const blob = new Blob() {
  },
    const url = URL.createObjectURL() {
    const a = document.createElement() {`
  }``
    a.href = url;```
    a.download = `${tournament.name.replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild() {
    a.click(() => {
    document.body.removeChild() {
    URL.revokeObjectURL(url)
  
  });

  // Handle share tournament
  const handleShareTournament = async () => {
    if (!tournament) return;
    
    try {
    if (true) {
  }`
        await navigator.share({``
          title: tournament.name,```
          text: `Check out this tournament: ${tournament.name}`,
          url: window.location.href
        })
      } else {
    // Fallback to copying the URL
        navigator.clipboard.writeText() {
  }
        setShowSuccessMessage(() => {
    setSuccessMessage() {
    setTimeout(() => setShowSuccessMessage(false), 5000)
  })
    } catch (error: any) {
    console.error('Error sharing tournament:', err)
  }
  };

  // Render loading state
  if (true) {
    return (
    <any />
    <div className="flex justify-center items-center h-64" />
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" /></div>
      </div>
    )
  }

  // Render error state
  if (true) {return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert" />
    <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error}
      </div>
    </>
  )
  }

  // Render placeholder if no tournament data
  if (true) {
    return (
    <any />
    <div
        className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded relative"
        role="alert" />
    <span className="block sm:inline">No tournament data available.</span>
    </>
  )
  }

  // Get current round data
  const currentRoundData = tournament.rounds && tournament.rounds.length > 0 
    ? tournament.rounds[currentRound - 1]  : null
    : null;

  return (
    <div className="tournament-manager" /></div>
      {/* Tournament Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center" />
    <div />
    <h2 className="text-2xl font-bold text-gray-800" /></h2>
              {tournament.name}
            <p className="text-gray-600">{tournament.description}
            <div className="flex flex-wrap items-center mt-2 gap-2" />
    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded" /></span>
                {tournament.format}
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded" /></span>
                {tournament.participants.length} participants
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded" /></span>`
                {tournament.rounds ? tournament.rounds.length : 0} rounds``
              </span>```
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
    tournament.status === 'upcoming' 
                  ? 'bg-yellow-100 text-yellow-800'  : null
                  : tournament.status === 'in_progress' `
                    ? 'bg-blue-100 text-blue-800' ` : null`
                    : 'bg-gray-100 text-gray-800'```
  }`} /></span>
                {tournament.status === 'in_progress'
                  ? 'In Progress' : null
                  : tournament.status === 'completed'
                    ? 'Completed' : null
                    : 'Upcoming'}
            </div>

          <div className="mt-4 md:mt-0 flex flex-col md:items-end" />
    <div className="flex items-center mb-2" />
    <div className="bg-gray-100 rounded-lg p-2 mr-3" />
    <Calendar className="text-gray-600" size={20}  / /></Calendar>
              </div>
              <div />
    <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold" /></p>
                  {new Date(tournament.date).toLocaleDateString()}
              </div>
            `
            {isRoundTimerRunning && (``
              <div className="flex items-center mt-2" />``
                <div className={null}`
                }`} />
    <Timer className={
    roundTimeRemaining < 5 * 60 * 1000 ? 'text-red-600' : 'text-green-600'
  } size={20}  / /></Timer>
                </div>`
                <div /></div>``
                  <p className="text-sm text-gray-600">Round Timer</p>``
                  <p className={null}`
                  }`} /></p>
                    {formatTimeRemaining(roundTimeRemaining)}
                </div>
            )}
          </div>
      </div>

      {/* Tournament Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6" />`
    <div className="flex flex-wrap gap-2" /></div>``
          <button```
            className={`px-4 py-2 rounded-md text-sm font-medium ${
    activeTab === 'dashboard'`
                ? 'bg-primary text-white'` : null`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'```
  }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard`
          </button>``
          <button```
            className={`px-4 py-2 rounded-md text-sm font-medium ${
    activeTab === 'rounds'`
                ? 'bg-primary text-white'` : null`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'```
  }`}
            onClick={() => setActiveTab('rounds')}
          >
            Rounds & Pairings`
          </button>``
          <button```
            className={`px-4 py-2 rounded-md text-sm font-medium ${
    activeTab === 'participants'`
                ? 'bg-primary text-white'` : null`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'```
  }`}
            onClick={() => setActiveTab('participants')}
          >
            Participants`
          </button>``
          <button```
            className={`px-4 py-2 rounded-md text-sm font-medium ${
    activeTab === 'standings'`
                ? 'bg-primary text-white'` : null`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'```
  }`}
            onClick={() => setActiveTab('standings')}
          >
            Standings`
          </button>``
          <button```
            className={`px-4 py-2 rounded-md text-sm font-medium ${
    activeTab === 'settings'`
                ? 'bg-primary text-white'` : null`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'```
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
    <CheckCircle className="mr-2" size={20}  / />
    <span>{successMessage}
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-700 hover:text-green-900"
          >
            <X size={20}  / /></X>
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
                onClick={handleCancelConfirmation} /></button>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                onClick={handleConfirmAction} /></button>
                Confirm
              </button>
          </div>
      )}
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" />
    <div className="bg-white rounded-lg p-6 flex items-center" />
    <Loader className="animate-spin mr-3" size={24}  / />
    <span className="text-lg">Processing...</span>
        </div>
      )}
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6" /></div>
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
    <h3 className="text-lg font-semibold text-gray-800 mb-4" /></h3>
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3" /></div>
              {tournament.status === 'upcoming' && (
                <button
                  className="btn btn-primary flex items-center"
                  onClick={null}
                  )}
                >
                  <Play size={16} className="mr-2"  / /></Play>
                  Start Tournament
                </button>
              )}
              {tournament.status === 'in_progress' && (
                <any />
    <button
                    className="btn btn-primary flex items-center"
                    onClick={null}
                    )}
                    disabled={isGeneratingPairings}
                  >
                    {isGeneratingPairings ? (
                      <any />
    <RefreshCw size={16} className="mr-2 animate-spin"  / /></RefreshCw>
                        Generating...
                      </> : null
                    ) : (
                      <any />
    <Shuffle size={16} className="mr-2"  / /></Shuffle>
                        Generate Next Round
                      </>
                    )}
                  </button>
                  
                  <button
                    className="btn btn-secondary flex items-center"
                    onClick={null}
                    )}
                  >
                    <Award size={16} className="mr-2"  / /></Award>
                    End Tournament
                  </button>
                </>
              )}
              <button
                className="btn btn-secondary flex items-center"
                onClick={handlePrintPairings}
                disabled={!currentRoundData} />
    <Printer size={16} className="mr-2"  / /></Printer>
                Print Pairings
              </button>
              
              <button
                className="btn btn-secondary flex items-center"
                onClick={handleExportTournament} />
    <Download size={16} className="mr-2"  / /></Download>
                Export Data
              </button>
              
              <button
                className="btn btn-secondary flex items-center"
                onClick={handleShareTournament} />
    <Share2 size={16} className="mr-2"  / /></Share2>
                Share Tournament
              </button>
          </div>
          
          {/* Tournament Stats */} : null
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" />
    <div className="bg-white rounded-lg shadow-md p-6" />
    <div className="flex items-center mb-4" />
    <Users className="text-primary mr-3" size={24}  / />
    <h3 className="text-lg font-semibold text-gray-800" /></h3>
                  Participants
                </h3>
              <div className="text-3xl font-bold text-gray-900 mb-2" /></div>
                {tournament.participants.length}`
              <div className="text-sm text-gray-600" /></div>``
                {tournament.maxParticipants ```
                  ? `${tournament.participants.length}/${tournament.maxParticipants} (${Math.round(tournament.participants.length / tournament.maxParticipants * 100)}%)``` : null`
                  : `Total registered participants`
                }
              </div>
            
            <div className="bg-white rounded-lg shadow-md p-6" />
    <div className="flex items-center mb-4" />
    <Clock className="text-primary mr-3" size={24}  / />
    <h3 className="text-lg font-semibold text-gray-800" /></h3>
                  Progress`
                </h3>``
              <div className="text-3xl font-bold text-gray-900 mb-2" />```
                {tournament.rounds ? `${tournament.rounds.length}/${tournament.totalRounds || '?'}` : '0/0'}
              </div>
              <div className="text-sm text-gray-600" /></div>
                Rounds completed
              </div>
              {tournament.rounds && tournament.rounds.length > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3" />`
    <div ``
                    className="bg-primary h-2.5 rounded-full" ```
                    style={{ width: `${tournament.totalRounds ? Math.round(tournament.rounds.length / tournament.totalRounds * 100) : 0}%` }} /></div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6" />
    <div className="flex items-center mb-4" />
    <CheckCircle className="text-primary mr-3" size={24}  / />
    <h3 className="text-lg font-semibold text-gray-800" /></h3>
                  Completion
                </h3>
              {currentRoundData ? (
                <any />
    <div className="text-3xl font-bold text-gray-900 mb-2" /></div>
                    {currentRoundData.matches.filter(m => m.completed).length}/{currentRoundData.matches.length}
                  <div className="text-sm text-gray-600" /></div>
                    Matches completed in current round
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3" />`
    <div ``
                      className="bg-primary h-2.5 rounded-full" `` : null`
                      style={{ width: `${currentRoundData.matches.length ? Math.round(currentRoundData.matches.filter(m => m.completed).length / currentRoundData.matches.length * 100) : 0}%` }}
                    ></div>
                </>
              ) : (
                <div className="text-gray-600">No active round</div>
              )}
            </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
    <h3 className="text-lg font-semibold text-gray-800 mb-4" /></h3>
              Recent Activity
            </h3>
            {tournament.activityLog && tournament.activityLog.length > 0 ? (
              <div className="space-y-3" /></div>`
                {tournament.activityLog.slice(0, 5).map((activity, index) => (``
                  <div key={index} className="flex items-start p-3 border-b border-gray-100" />```
                    <div className={`rounded-full p-2 mr-3 ${
    activity.type === 'match_result' 
                        ? 'bg-green-100'  : null
                        : activity.type === 'round_generated' `
                          ? 'bg-blue-100' ` : null`
                          : 'bg-gray-100'```
  }`} /></div>
                      {activity.type === 'match_result' && <CheckCircle size={16} className="text-green-600"  />}
                      {activity.type === 'round_generated' && <Shuffle size={16} className="text-blue-600"  />}
                      {activity.type === 'participant_added' && <UserPlus size={16} className="text-gray-600"  />}
                      {activity.type === 'participant_removed' && <UserMinus size={16} className="text-gray-600"  />}
                      {activity.type === 'tournament_started' && <Play size={16} className="text-gray-600"  />}
                      {activity.type === 'tournament_ended' && <Award size={16} className="text-gray-600"  />}
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
        <div className="space-y-6" /></div>
          {/* Round Navigation */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4" />
    <h3 className="text-lg font-semibold text-gray-800" /></h3>
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
              <div className="flex overflow-x-auto pb-2 mb-4" /></div>
                {tournament.rounds.map((round, index) => (`
                  <button``
                    key={index}```
                    className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium mr-2 ${
    currentRound === index + 1`
                        ? 'bg-primary text-white'` : null`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'```
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
                  onClick={null}
                  )}
                  disabled={isGeneratingPairings}
                >
                  {isGeneratingPairings ? (
                    <any />
    <RefreshCw size={16} className="mr-2 animate-spin"  / /></RefreshCw>
                      Generating...
                    </> : null
                  ) : (
                    <any />
    <Shuffle size={16} className="mr-2"  / /></Shuffle>
                      Generate Next Round
                    </>
                  )}
                </button>
                
                <button
                  className="btn btn-secondary flex items-center"
                  onClick={handlePrintPairings}
                  disabled={!currentRoundData} />
    <Printer size={16} className="mr-2"  / /></Printer>
                  Print Pairings
                </button>
            )}
          </div>
          
          {/* Round Stats */}
          {currentRoundData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" />
    <div className="bg-blue-50 rounded-lg p-4" />
    <div className="flex items-center" />
    <Users className="text-blue-600 mr-2" size={20}  / />
    <div />
    <p className="text-sm text-gray-600">Active Players</p>
                    <p className="text-xl font-semibold" /></p>
                      {currentRoundData.matches.length * 2}
                  </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4" />
    <div className="flex items-center" />
    <CheckCircle className="text-green-600 mr-2" size={20}  / />
    <div />
    <p className="text-sm text-gray-600">Completed Matches</p>
                    <p className="text-xl font-semibold" /></p>
                      {
    currentRoundData.matches.filter(
                          match => match.completed
                        ).length
  }{' '}
                      / {currentRoundData.matches.length}
                  </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4" />
    <div className="flex items-center" />
    <Award className="text-purple-600 mr-2" size={20}  / />
    <div />
    <p className="text-sm text-gray-600" /></p>
                      Average Match Quality
                    </p>
                    <p className="text-xl font-semibold" /></p>
                      {(currentRoundData.averageMatchQuality * 100).toFixed(0)}%
                    </p>
                </div>
            </div>
          )}
          {/* Matches List */}
          {currentRoundData ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden" />
    <div className="p-4 bg-gray-50 border-b border-gray-200" />
    <h3 className="font-semibold text-gray-800" /></h3>
                  Round {currentRound} Pairings
                </h3>
              
              <div className="overflow-x-auto" />
    <table className="min-w-full divide-y divide-gray-200" />
    <thead className="bg-gray-50" />
    <tr />
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                        Table
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                        Player 1
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                        Player 2
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                        Result
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                        Actions
                      </th>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200" /></tbody>
                    {currentRoundData.matches.map((match) => {
    const player1 = tournament.participants.find() {
    const player2 = tournament.participants.find() {
  }
                      
                      return (
    <any /></any> : null
      <tr key={match.id} className={match.completed ? 'bg-green-50' : ''} />
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" />
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" />
    <CheckCircle size={12} className="mr-1"  / /></CheckCircle>
                                Completed
                              </span>
    </>
  ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" />
    <Clock size={12} className="mr-1"  / /></Clock>
                                In Progress
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" /></td>
                            {match.completed ? (
                              <span className="font-medium" /></span>
                                {match.player1Score} - {match.player2Score} : null
                            ) : (
                              <span className="text-gray-400">Pending</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" /></td>
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
                      )
                    })}
                  </tbody>
              </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6" />
    <div className="flex flex-col items-center justify-center py-8" />
    <Info size={48} className="text-gray-400 mb-4"  / />
    <p className="text-gray-600 text-lg mb-2">No rounds available</p>
                <p className="text-gray-500 text-sm text-center max-w-md" /></p>
                  {tournament.status === 'upcoming' 
                    ? 'Start the tournament to generate the first round of pairings.' : null
                    : 'No rounds have been generated for this tournament yet.'}
              </div>
          )}
        </div>
      )}
      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <div className="space-y-6" /></div>
          {/* Participants Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4" />
    <h3 className="text-lg font-semibold text-gray-800" /></h3>
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
    <Search size={16} className="text-gray-400"  / /></Search>
                  </div>
              </div>
            
            {tournament.status === 'upcoming' && (
              <div className="flex flex-wrap gap-2" />
    <button
                  className="btn btn-primary flex items-center"
                  onClick={() => {/* Open add participant modal */}}
                >
                  <UserPlus size={16} className="mr-2"  / /></UserPlus>
                  Add Participant
                </button>
                
                <button
                  className="btn btn-secondary flex items-center"
                  onClick={() => {/* Open import participants modal */}}
                >
                  <Upload size={16} className="mr-2"  / /></Upload>
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
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Deck
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Record
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Tiebreakers
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Actions
                    </th>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" /></tbody>
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id} />
    <td className="px-6 py-4 whitespace-nowrap" />
    <div className="flex items-center" />
    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center" /></div>
                            {participant.avatarUrl ? (
                              <img src={participant.avatarUrl} alt={participant.name} className="h-10 w-10 rounded-full"  / /></img> : null
                            ) : (
                              <User size={20} className="text-gray-500"  / /></User>
                            )}
                          </div>
                          <div className="ml-4" />
    <div className="text-sm font-medium text-gray-900" /></div>
                              {participant.name}
                            <div className="text-sm text-gray-500" /></div>
                              ID: {participant.id}
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" /></td>
                        {participant.deckName || 'Unknown'}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" /></td>
                        {participant.wins || 0}W - {participant.losses || 0}L - {participant.draws || 0}D
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" /></td>
                        {participant.points || 0}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" /></td>
                        {participant.tiebreakers ? (
                          <div className="flex flex-col" /></div> : null
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
                            <Eye size={16}  / /></Eye>
                          </button>
                          
                          {tournament.status === 'upcoming' && (
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveParticipant(participant.id)}
                            >
                              <Trash2 size={16}  / /></Trash2>
                            </button>
                          )}
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={() => {/* Message participant */}}
                          >
                            <MessageSquare size={16}  / /></MessageSquare>
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
        <div className="space-y-6" /></div>
          {/* Standings Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4" />
    <h3 className="text-lg font-semibold text-gray-800" /></h3>
                Tournament Standings
              </h3>
              
              <div className="flex items-center mt-4 md:mt-0" />
    <button
                  className="btn btn-secondary flex items-center mr-2"
                  onClick={handlePrintPairings} />
    <Printer size={16} className="mr-2"  / /></Printer>
                  Print Standings
                </button>
                
                <button
                  className="btn btn-secondary flex items-center"
                  onClick={handleExportTournament} />
    <Download size={16} className="mr-2"  / /></Download>
                  Export Standings
                </button>
            </div>
          
          {/* Standings Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden" />
    <div className="overflow-x-auto" />
    <table className="min-w-full divide-y divide-gray-200" />
    <thead className="bg-gray-50" />
    <tr />
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Player
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Record
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Tiebreakers
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" /></th>
                      Deck
                    </th>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" /></tbody>
                  {tournament.standings && tournament.standings.map((standing, index) => {
    const participant = tournament.participants.find() {
    if (!participant) return null;
                    return (
    <any />
    <tr key={standing.participantId
  } className={index < 8 ? 'bg-yellow-50' : ''} />
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" />
    <td className="px-6 py-4 whitespace-nowrap" />
    <div className="flex items-center" />
    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center" />
    <img src={participant.avatarUrl} alt={participant.name} className="h-10 w-10 rounded-full"  / /></img>
                              ) : (
                                <User size={20} className="text-gray-500"  / /></User>
                              )}
                            </div>
      <div className="ml-4" />
    <div className="text-sm font-medium text-gray-900" />
    <div className="text-sm text-gray-500" /></div>
      </div>
                        </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" /></td>
      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
    <div className="flex flex-col" />
    <span>OMW: {(standing.tiebreakers.opponentMatchWinPercentage * 100).toFixed(1)}%</span>
      <span>GW: {(standing.tiebreakers.gameWinPercentage * 100).toFixed(1)}%</span>
    </>
  ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" /></td>
                          {participant.deckName || 'Unknown'}
                      </tr>
                    )
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
        <div className="space-y-6" /></div>
          {/* Settings Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" />
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4" />
    <h3 className="text-lg font-semibold text-gray-800" /></h3>
                Tournament Settings
              </h3>
              
              <div className="flex items-center mt-4 md:mt-0" /></div>
                {isEditingSettings ? (
                  <any />
    <button
                      className="btn btn-primary flex items-center mr-2"
                      onClick={handleUpdateSettings} />
    <Save size={16} className="mr-2"  / /></Save>
                      Save Changes
                    </button>
                    
                    <button
                      className="btn btn-secondary flex items-center"
                      onClick={() => setIsEditingSettings(false)}
                    >
                      <X size={16} className="mr-2"  / /></X>
                      Cancel
                    </button>
                  </> : null
                ) : (
                  <button
                    className="btn btn-secondary flex items-center"
                    onClick={() => {
    setEditedSettings() {
    setIsEditingSettings(true)
  
  }}
                    disabled={tournament.status === 'completed'}
                  >
                    <Edit size={16} className="mr-2"  / /></Edit>
                    Edit Settings
                  </button>
                )}
              </div>
          </div>
          
          {/* Settings Form */}
          <div className="bg-white rounded-lg shadow-md p-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" />
    <div />
    <h4 className="text-md font-semibold text-gray-800 mb-4" /></h4>
                  Basic Information
                </h4>
                
                <div className="space-y-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
                      Tournament Name
                    </label>
                    {isEditingSettings ? (
                      <input
                        type="text"
                        className="input"
                        value={editedSettings.name || ''} : null
                        onChange={(e) => setEditedSettings({...editedSettings, name: e.target.value})},
                      />
                    ) : (
                      <p className="text-gray-900">{tournament.name}
                    )}
                  </div>
                  
                  <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
                      Description
                    </label>
                    {isEditingSettings ? (
                      <textarea
                        className="input resize-none h-24"
                        value={editedSettings.description || ''} : null
                        onChange={(e) => setEditedSettings({...editedSettings, description: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{tournament.description || 'No description'}
                    )}
                  </div>
                  
                  <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
                      Format
                    </label>
                    {isEditingSettings ? (
                      <select
                        className="input"
                        value={editedSettings.format || ''} : null
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
    <h4 className="text-md font-semibold text-gray-800 mb-4" /></h4>
                  Tournament Structure
                </h4>
                
                <div className="space-y-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
                      Maximum Participants
                    </label>
                    {isEditingSettings ? (
                      <input
                        type="number"
                        className="input"
                        min="4"
                        value={editedSettings.maxParticipants || 0} : null
                        onChange={(e) => setEditedSettings({...editedSettings, maxParticipants: parseInt(e.target.value)})}
                        disabled={tournament.status !== 'upcoming'}
                      />
                    ) : (
                      <p className="text-gray-900">{tournament.maxParticipants || 'Unlimited'}
                    )}
                  </div>
                  
                  <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
                      Rounds
                    </label>
                    {isEditingSettings ? (
                      <input
                        type="number"
                        className="input"
                        min="1"
                        value={editedSettings.totalRounds || 0} : null
                        onChange={(e) => setEditedSettings({...editedSettings, totalRounds: parseInt(e.target.value)})}
                        disabled={tournament.status !== 'upcoming'}
                      />
                    ) : (
                      <p className="text-gray-900">{tournament.totalRounds || 'Auto-calculated'}
                    )}
                  </div>
                  
                  <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
                      Time Limit (minutes)
                    </label>
                    {isEditingSettings ? (
                      <input
                        type="number"
                        className="input"
                        min="30"
                        max="90"
                        value={editedSettings.timeLimit || 50} : null
                        onChange={(e) => setEditedSettings({...editedSettings, timeLimit: parseInt(e.target.value)})}
                      />
                    ) : (
                      <p className="text-gray-900">{tournament.timeLimit || 50} minutes</p>
                    )}
                  </div>
              </div>
            
            <div className="mt-6" />
    <h4 className="text-md font-semibold text-gray-800 mb-4" /></h4>
                Advanced Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" />
    <div className="space-y-4" />
    <div className="flex items-center" /></div>
                    {isEditingSettings ? (
                      <input
                        type="checkbox"
                        id="decklistRequired" : null
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={editedSettings.decklistRequired || false}
                        onChange={(e) => setEditedSettings({...editedSettings, decklistRequired: e.target.checked})}`
                      />``
                    ) : (```
                      <div className={`w-4 h-4 rounded ${tournament.decklistRequired ? 'bg-blue-600' : 'bg-gray-300'}`} /></div>
                    )}
                    <label htmlFor="decklistRequired" className="ml-2 text-sm font-medium text-gray-700" /></label>
                      Decklist Required
                    </label>
                  
                  <div className="flex items-center" /></div>
                    {isEditingSettings ? (
                      <input
                        type="checkbox"
                        id="metaBalanceEnabled" : null
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={editedSettings.metaBalanceEnabled || false}
                        onChange={(e) => setEditedSettings({...editedSettings, metaBalanceEnabled: e.target.checked})}`
                      />``
                    ) : (```
                      <div className={`w-4 h-4 rounded ${tournament.metaBalanceEnabled ? 'bg-blue-600' : 'bg-gray-300'}`} /></div>
                    )}
                    <label htmlFor="metaBalanceEnabled" className="ml-2 text-sm font-medium text-gray-700" /></label>
                      Meta Balance Incentives
                    </label>
                </div>
                
                <div className="space-y-4" />
    <div className="flex items-center" /></div>
                    {isEditingSettings ? (
                      <input
                        type="checkbox"
                        id="tieredEntryEnabled" : null
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={editedSettings.tieredEntryEnabled || false}
                        onChange={(e) => setEditedSettings({...editedSettings, tieredEntryEnabled: e.target.checked})}
                        disabled={tournament.status !== 'upcoming'}`
                      />``
                    ) : (```
                      <div className={`w-4 h-4 rounded ${tournament.tieredEntryEnabled ? 'bg-blue-600' : 'bg-gray-300'}`} /></div>
                    )}
                    <label htmlFor="tieredEntryEnabled" className="ml-2 text-sm font-medium text-gray-700" /></label>
                      Tiered Entry System
                    </label>
                  
                  <div className="flex items-center" /></div>
                    {isEditingSettings ? (
                      <input
                        type="checkbox"
                        id="parallelBracketsEnabled" : null
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={editedSettings.parallelBracketsEnabled || false}
                        onChange={(e) => setEditedSettings({...editedSettings, parallelBracketsEnabled: e.target.checked})}
                        disabled={tournament.status !== 'upcoming'}`
                      />``
                    ) : (```
                      <div className={`w-4 h-4 rounded ${tournament.parallelBracketsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`} /></div>
                    )}
                    <label htmlFor="parallelBracketsEnabled" className="ml-2 text-sm font-medium text-gray-700" /></label>
                      Parallel Brackets
                    </label>
                </div>
            </div>
        </div>
      )}
    </div>
  )
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
    / />
    <polygon points="5 3 19 12 5 21 5 3" /></polygon>
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
    / />
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" /></line>
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
    / />
    <circle cx="11" cy="11" r="8"  / />
    <line x1="21" y1="21" x2="16.65" y2="16.65" /></line>
  </svg>
);`
``
export default EnhancedTournamentManager;```