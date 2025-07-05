/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Tournaments API
 * Handles tournament management and notifications
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize router
const router = express.Router();

// Path to tournaments file
const tournamentsPath = path.join(__dirname, '../data/tournaments.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize tournaments file if it doesn't exist
if (!fs.existsSync(tournamentsPath)) {
  // Create some mock tournaments
  const mockTournaments = [
    {
      id: 'tournament1',
      name: 'Weekly KONIVRER Challenge',
      format: 'Regulation',
      status: 'active',
      startDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      endDate: null,
      organizer: 'user1',
      players: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
      rounds: [
        {
          roundNumber: 1,
          status: 'completed',
          matches: [
            {
              id: 'match1',
              player1: 'user1',
              player2: 'user2',
              winner: 'user1',
              table: 1,
              result: '1-0',
              completed: true
            },
            {
              id: 'match2',
              player1: 'user3',
              player2: 'user4',
              winner: 'user3',
              table: 2,
              result: '1-0',
              completed: true
            },
            {
              id: 'match3',
              player1: 'user5',
              player2: 'user6',
              winner: 'user5',
              table: 3,
              result: '1-0',
              completed: true
            },
            {
              id: 'match4',
              player1: 'user7',
              player2: 'user8',
              winner: 'user8',
              table: 4,
              result: '0-1',
              completed: true
            }
          ]
        },
        {
          roundNumber: 2,
          status: 'active',
          matches: [
            {
              id: 'match5',
              player1: 'user1',
              player2: 'user3',
              winner: null,
              table: 1,
              result: null,
              completed: false,
              startTime: new Date().toISOString(),
              timeRemaining: 3600 // 60 minutes in seconds
            },
            {
              id: 'match6',
              player1: 'user5',
              player2: 'user8',
              winner: null,
              table: 2,
              result: null,
              completed: false,
              startTime: new Date().toISOString(),
              timeRemaining: 3600 // 60 minutes in seconds
            }
          ]
        }
      ],
      standings: [
        { playerId: 'user1', wins: 1, losses: 0, draws: 0, points: 3 },
        { playerId: 'user3', wins: 1, losses: 0, draws: 0, points: 3 },
        { playerId: 'user5', wins: 1, losses: 0, draws: 0, points: 3 },
        { playerId: 'user8', wins: 1, losses: 0, draws: 0, points: 3 },
        { playerId: 'user2', wins: 0, losses: 1, draws: 0, points: 0 },
        { playerId: 'user4', wins: 0, losses: 1, draws: 0, points: 0 },
        { playerId: 'user6', wins: 0, losses: 1, draws: 0, points: 0 },
        { playerId: 'user7', wins: 0, losses: 1, draws: 0, points: 0 }
      ]
    },
    {
      id: 'tournament2',
      name: 'KONIVRER Championship Series',
      format: 'Regulation',
      status: 'scheduled',
      startDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
      endDate: null,
      organizer: 'user1',
      players: ['user1', 'user2', 'user3', 'user4'],
      rounds: [],
      standings: []
    }
  ];
  
  fs.writeFileSync(tournamentsPath, JSON.stringify(mockTournaments, null, 2));
}

// Helper function to read tournaments
const getTournaments = () => {
  try {
    const data = fs.readFileSync(tournamentsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tournaments:', error);
    return [];
  }
};

// Helper function to write tournaments
const saveTournaments = (tournaments) => {
  try {
    fs.writeFileSync(tournamentsPath, JSON.stringify(tournaments, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving tournaments:', error);
    return false;
  }
};

// Helper function to get user data
const getUsers = () => {
  try {
    const usersPath = path.join(__dirname, '../data/users.json');
    if (!fs.existsSync(usersPath)) {
      return [];
    }
    const data = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Helper function to get username by ID
const getUsernameById = (userId) => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  return user ? user.username : userId;
};

// Helper function to send push notification
const sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL || 'https://work-2-aclyxlewothbuqdq.prod-runtime.all-hands.dev'}/api/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title,
        body,
        icon: '/icons/pwa-192x192.png',
        data: {
          ...data,
          type: 'tournament'
        }
      }),
    });
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

// Get all tournaments
router.get('/', (req, res) => {
  try {
    const tournaments = getTournaments();
    
    res.status(200).json({ 
      success: true, 
      tournaments 
    });
  } catch (error) {
    console.error('Error getting tournaments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get tournaments' 
    });
  }
});

// Get tournament by ID
router.get('/:tournamentId', (req, res) => {
  const { tournamentId } = req.params;
  
  try {
    const tournaments = getTournaments();
    
    // Find tournament
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tournament not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      tournament 
    });
  } catch (error) {
    console.error('Error getting tournament:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get tournament' 
    });
  }
});

// Create a new tournament
router.post('/', (req, res) => {
  const { name, format, startDate, organizer, players } = req.body;
  
  if (!name || !format || !organizer) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields' 
    });
  }
  
  try {
    const tournaments = getTournaments();
    
    // Create new tournament
    const newTournament = {
      id: uuidv4(),
      name,
      format: format || 'Regulation',
      status: 'scheduled',
      startDate: startDate || new Date().toISOString(),
      endDate: null,
      organizer,
      players: players || [],
      rounds: [],
      standings: []
    };
    
    // Add tournament to list
    tournaments.push(newTournament);
    
    // Save tournaments
    saveTournaments(tournaments);
    
    res.status(201).json({ 
      success: true, 
      message: 'Tournament created successfully',
      tournamentId: newTournament.id
    });
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create tournament' 
    });
  }
});

// Start a tournament
router.post('/:tournamentId/start', (req, res) => {
  const { tournamentId } = req.params;
  
  try {
    const tournaments = getTournaments();
    
    // Find tournament
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tournament not found' 
      });
    }
    
    // Update tournament status
    tournaments[tournamentIndex].status = 'active';
    tournaments[tournamentIndex].startDate = new Date().toISOString();
    
    // Save tournaments
    saveTournaments(tournaments);
    
    res.status(200).json({ 
      success: true, 
      message: 'Tournament started successfully' 
    });
  } catch (error) {
    console.error('Error starting tournament:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to start tournament' 
    });
  }
});

// Start a new round
router.post('/:tournamentId/rounds', (req, res) => {
  const { tournamentId } = req.params;
  const { matches } = req.body;
  
  if (!matches || !Array.isArray(matches)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing or invalid matches' 
    });
  }
  
  try {
    const tournaments = getTournaments();
    
    // Find tournament
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tournament not found' 
      });
    }
    
    const tournament = tournaments[tournamentIndex];
    
    // Check if tournament is active
    if (tournament.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Tournament is not active' 
      });
    }
    
    // Check if there's an active round
    const activeRound = tournament.rounds.find(r => r.status === 'active');
    if (activeRound) {
      return res.status(400).json({ 
        success: false, 
        message: 'There is already an active round' 
      });
    }
    
    // Create new round
    const roundNumber = tournament.rounds.length + 1;
    const newRound = {
      roundNumber,
      status: 'active',
      matches: matches.map((match, index) => ({
        id: uuidv4(),
        player1: match.player1,
        player2: match.player2,
        winner: null,
        table: index + 1,
        result: null,
        completed: false,
        startTime: new Date().toISOString(),
        timeRemaining: 3600 // 60 minutes in seconds
      }))
    };
    
    // Add round to tournament
    tournaments[tournamentIndex].rounds.push(newRound);
    
    // Save tournaments
    saveTournaments(tournaments);
    
    // Send push notifications to all players in the round
    const notificationPromises = [];
    
    for (const match of newRound.matches) {
      // Get player usernames
      const player1Username = getUsernameById(match.player1);
      const player2Username = getUsernameById(match.player2);
      
      // Send notification to player 1
      notificationPromises.push(
        sendPushNotification(
          match.player1,
          `Round ${roundNumber} Started`,
          `Your match against ${player2Username} is at Table ${match.table}`,
          {
            tournamentId,
            matchId: match.id,
            roundNumber,
            table: match.table,
            opponent: match.player2,
            opponentName: player2Username
          }
        )
      );
      
      // Send notification to player 2
      notificationPromises.push(
        sendPushNotification(
          match.player2,
          `Round ${roundNumber} Started`,
          `Your match against ${player1Username} is at Table ${match.table}`,
          {
            tournamentId,
            matchId: match.id,
            roundNumber,
            table: match.table,
            opponent: match.player1,
            opponentName: player1Username
          }
        )
      );
    }
    
    // Wait for all notifications to be sent
    Promise.all(notificationPromises)
      .then(results => {
        console.log(`Sent ${results.filter(r => r).length} round start notifications`);
      })
      .catch(error => {
        console.error('Error sending round start notifications:', error);
      });
    
    res.status(201).json({ 
      success: true, 
      message: 'Round started successfully',
      roundNumber
    });
  } catch (error) {
    console.error('Error starting round:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to start round' 
    });
  }
});

// Submit match result
router.post('/:tournamentId/matches/:matchId/result', (req, res) => {
  const { tournamentId, matchId } = req.params;
  const { winner, result } = req.body;
  
  if (!winner || !result) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing winner or result' 
    });
  }
  
  try {
    const tournaments = getTournaments();
    
    // Find tournament
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tournament not found' 
      });
    }
    
    const tournament = tournaments[tournamentIndex];
    
    // Find active round
    const activeRoundIndex = tournament.rounds.findIndex(r => r.status === 'active');
    
    if (activeRoundIndex === -1) {
      return res.status(400).json({ 
        success: false, 
        message: 'No active round found' 
      });
    }
    
    // Find match
    const matchIndex = tournament.rounds[activeRoundIndex].matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Match not found' 
      });
    }
    
    const match = tournament.rounds[activeRoundIndex].matches[matchIndex];
    
    // Update match result
    tournament.rounds[activeRoundIndex].matches[matchIndex].winner = winner;
    tournament.rounds[activeRoundIndex].matches[matchIndex].result = result;
    tournament.rounds[activeRoundIndex].matches[matchIndex].completed = true;
    
    // Update standings
    const player1 = match.player1;
    const player2 = match.player2;
    
    // Find or create player standings
    let player1Standing = tournament.standings.find(s => s.playerId === player1);
    let player2Standing = tournament.standings.find(s => s.playerId === player2);
    
    if (!player1Standing) {
      player1Standing = { playerId: player1, wins: 0, losses: 0, draws: 0, points: 0 };
      tournament.standings.push(player1Standing);
    }
    
    if (!player2Standing) {
      player2Standing = { playerId: player2, wins: 0, losses: 0, draws: 0, points: 0 };
      tournament.standings.push(player2Standing);
    }
    
    // Update standings based on result
    if (result === '1-0') {
      player1Standing.wins++;
      player1Standing.points += 3;
      player2Standing.losses++;
    } else if (result === '0-1') {
      player2Standing.wins++;
      player2Standing.points += 3;
      player1Standing.losses++;
    } else if (result === '0-0') {
      player1Standing.draws++;
      player1Standing.points += 1;
      player2Standing.draws++;
      player2Standing.points += 1;
    }
    
    // Check if all matches in the round are completed
    const allMatchesCompleted = tournament.rounds[activeRoundIndex].matches.every(m => m.completed);
    
    if (allMatchesCompleted) {
      // Mark round as completed
      tournament.rounds[activeRoundIndex].status = 'completed';
    }
    
    // Save tournaments
    saveTournaments(tournaments);
    
    // Send push notifications to both players
    const player1Username = getUsernameById(player1);
    const player2Username = getUsernameById(player2);
    
    // Send notification to player 1
    sendPushNotification(
      player1,
      'Match Result Submitted',
      `Your match against ${player2Username} has been recorded as ${result}`,
      {
        tournamentId,
        matchId,
        roundNumber: tournament.rounds[activeRoundIndex].roundNumber,
        result,
        opponent: player2,
        opponentName: player2Username
      }
    ).catch(error => {
      console.error('Error sending result notification to player 1:', error);
    });
    
    // Send notification to player 2
    sendPushNotification(
      player2,
      'Match Result Submitted',
      `Your match against ${player1Username} has been recorded as ${result}`,
      {
        tournamentId,
        matchId,
        roundNumber: tournament.rounds[activeRoundIndex].roundNumber,
        result,
        opponent: player1,
        opponentName: player1Username
      }
    ).catch(error => {
      console.error('Error sending result notification to player 2:', error);
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Match result submitted successfully',
      roundCompleted: allMatchesCompleted
    });
  } catch (error) {
    console.error('Error submitting match result:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit match result' 
    });
  }
});

// Trigger overtime for a match
router.post('/:tournamentId/matches/:matchId/overtime', (req, res) => {
  const { tournamentId, matchId } = req.params;
  const { additionalTime } = req.body;
  
  // Default to 5 minutes of overtime if not specified
  const overtimeSeconds = additionalTime || 300;
  
  try {
    const tournaments = getTournaments();
    
    // Find tournament
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tournament not found' 
      });
    }
    
    const tournament = tournaments[tournamentIndex];
    
    // Find active round
    const activeRoundIndex = tournament.rounds.findIndex(r => r.status === 'active');
    
    if (activeRoundIndex === -1) {
      return res.status(400).json({ 
        success: false, 
        message: 'No active round found' 
      });
    }
    
    // Find match
    const matchIndex = tournament.rounds[activeRoundIndex].matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Match not found' 
      });
    }
    
    const match = tournament.rounds[activeRoundIndex].matches[matchIndex];
    
    // Add overtime to match
    tournament.rounds[activeRoundIndex].matches[matchIndex].timeRemaining += overtimeSeconds;
    tournament.rounds[activeRoundIndex].matches[matchIndex].overtime = true;
    
    // Save tournaments
    saveTournaments(tournaments);
    
    // Send push notifications to both players
    const player1 = match.player1;
    const player2 = match.player2;
    const player1Username = getUsernameById(player1);
    const player2Username = getUsernameById(player2);
    
    // Send notification to player 1
    sendPushNotification(
      player1,
      'Overtime Triggered',
      `Your match against ${player2Username} has been extended by ${Math.floor(overtimeSeconds / 60)} minutes`,
      {
        tournamentId,
        matchId,
        roundNumber: tournament.rounds[activeRoundIndex].roundNumber,
        overtimeMinutes: Math.floor(overtimeSeconds / 60),
        opponent: player2,
        opponentName: player2Username
      }
    ).catch(error => {
      console.error('Error sending overtime notification to player 1:', error);
    });
    
    // Send notification to player 2
    sendPushNotification(
      player2,
      'Overtime Triggered',
      `Your match against ${player1Username} has been extended by ${Math.floor(overtimeSeconds / 60)} minutes`,
      {
        tournamentId,
        matchId,
        roundNumber: tournament.rounds[activeRoundIndex].roundNumber,
        overtimeMinutes: Math.floor(overtimeSeconds / 60),
        opponent: player1,
        opponentName: player1Username
      }
    ).catch(error => {
      console.error('Error sending overtime notification to player 2:', error);
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Overtime triggered successfully',
      newTimeRemaining: tournament.rounds[activeRoundIndex].matches[matchIndex].timeRemaining
    });
  } catch (error) {
    console.error('Error triggering overtime:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to trigger overtime' 
    });
  }
});

// End a tournament
router.post('/:tournamentId/end', (req, res) => {
  const { tournamentId } = req.params;
  
  try {
    const tournaments = getTournaments();
    
    // Find tournament
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tournament not found' 
      });
    }
    
    // Update tournament status
    tournaments[tournamentIndex].status = 'completed';
    tournaments[tournamentIndex].endDate = new Date().toISOString();
    
    // Save tournaments
    saveTournaments(tournaments);
    
    res.status(200).json({ 
      success: true, 
      message: 'Tournament ended successfully' 
    });
  } catch (error) {
    console.error('Error ending tournament:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to end tournament' 
    });
  }
});

export default router;