/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Users API
 * Handles user data and preferences
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize router
const router = express.Router();

// Path to users file
const usersPath = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(usersPath)) {
  // Create some mock users
  const mockUsers = [
    {
      id: 'user1',
      username: 'Player1',
      displayName: 'Player One',
      email: 'player1@example.com',
      avatarUrl: null,
      joinDate: '2023-01-01T00:00:00.000Z',
      preferences: {
        theme: 'auto',
        notificationsEnabled: true,
        soundEnabled: true,
        musicEnabled: true
      },
      stats: {
        rating: 1750,
        rank: 'Gold',
        wins: 42,
        losses: 28,
        draws: 5,
        winRate: 0.6,
        tournamentWins: 3,
        tournamentTop8s: 7
      }
    },
    {
      id: 'user2',
      username: 'Player2',
      displayName: 'Player Two',
      email: 'player2@example.com',
      avatarUrl: null,
      joinDate: '2023-02-15T00:00:00.000Z',
      preferences: {
        theme: 'dark',
        notificationsEnabled: true,
        soundEnabled: false,
        musicEnabled: true
      },
      stats: {
        rating: 1820,
        rank: 'Platinum',
        wins: 56,
        losses: 32,
        draws: 8,
        winRate: 0.64,
        tournamentWins: 5,
        tournamentTop8s: 12
      }
    },
    {
      id: 'user3',
      username: 'Player3',
      displayName: 'Player Three',
      email: 'player3@example.com',
      avatarUrl: null,
      joinDate: '2023-03-20T00:00:00.000Z',
      preferences: {
        theme: 'light',
        notificationsEnabled: false,
        soundEnabled: true,
        musicEnabled: false
      },
      stats: {
        rating: 1650,
        rank: 'Silver',
        wins: 35,
        losses: 30,
        draws: 5,
        winRate: 0.54,
        tournamentWins: 1,
        tournamentTop8s: 4
      }
    }
  ];
  
  fs.writeFileSync(usersPath, JSON.stringify(mockUsers, null, 2));
}

// Helper function to read users
const getUsers = () => {
  try {
    const data = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Helper function to write users
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

// Get all users (admin only)
router.get('/', (req, res) => {
  // In a real app, you would check if the user is an admin
  try {
    const users = getUsers();
    
    // Remove sensitive data
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      joinDate: user.joinDate,
      stats: user.stats
    }));
    
    res.status(200).json({ 
      success: true, 
      users: sanitizedUsers 
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get users' 
    });
  }
});

// Get user by ID
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  
  try {
    const users = getUsers();
    
    // Find user
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Remove sensitive data
    const sanitizedUser = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      joinDate: user.joinDate,
      stats: user.stats
    };
    
    res.status(200).json({ 
      success: true, 
      user: sanitizedUser 
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user' 
    });
  }
});

// Update user preferences
router.put('/:userId/preferences', (req, res) => {
  const { userId } = req.params;
  const { preferences } = req.body;
  
  if (!preferences) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing preferences' 
    });
  }
  
  try {
    const users = getUsers();
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Update preferences
    users[userIndex].preferences = {
      ...users[userIndex].preferences,
      ...preferences
    };
    
    // Save users
    saveUsers(users);
    
    res.status(200).json({ 
      success: true, 
      message: 'Preferences updated successfully',
      preferences: users[userIndex].preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update preferences' 
    });
  }
});

// Search users
router.get('/search', (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing search query' 
    });
  }
  
  try {
    const users = getUsers();
    
    // Search users
    const results = users.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase())
    );
    
    // Remove sensitive data
    const sanitizedResults = results.map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      stats: {
        rating: user.stats.rating,
        rank: user.stats.rank
      }
    }));
    
    res.status(200).json({ 
      success: true, 
      results: sanitizedResults 
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to search users' 
    });
  }
});

// Get user profile with additional data
router.get('/:userId/profile', (req, res) => {
  const { userId } = req.params;
  
  try {
    const users = getUsers();
    
    // Find user
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get mock data for favorite decks
    const favoriteDecks = [
      { id: 'deck1', name: 'Aggro Fire', winRate: 0.65 },
      { id: 'deck2', name: 'Control Water', winRate: 0.58 }
    ];
    
    // Get mock data for recent matches
    const recentMatches = [
      { id: 'match1', opponent: 'Player2', result: 'win', date: '2023-05-01T00:00:00.000Z' },
      { id: 'match2', opponent: 'Player3', result: 'loss', date: '2023-04-28T00:00:00.000Z' }
    ];
    
    // Get mock data for recent tournaments
    const recentTournaments = [
      { id: 'tournament1', name: 'Weekly Challenge', placement: 3, date: '2023-04-15T00:00:00.000Z' },
      { id: 'tournament2', name: 'Monthly Championship', placement: 5, date: '2023-03-20T00:00:00.000Z' }
    ];
    
    // Create profile object
    const profile = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      joinDate: user.joinDate,
      stats: {
        ...user.stats,
        favoriteDecks
      },
      recentMatches,
      recentTournaments
    };
    
    res.status(200).json({ 
      success: true, 
      profile 
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user profile' 
    });
  }
});

export default router;