import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user data - in real app, this would come from your backend
  const mockUsers = {
    'user1@example.com': {
      id: 1,
      email: 'user1@example.com',
      username: 'DragonMaster2024',
      displayName: 'Alex Chen',
      avatar: '/api/placeholder/64/64',
      roles: ['player', 'judge'],
      judgeLevel: 2,
      organizerLevel: 1,
      joinDate: '2023-01-15',
      location: 'Los Angeles, CA',
      bio: 'Competitive KONIVRER player and Level 2 Judge. Love elemental synergies!',
      stats: {
        tournamentsPlayed: 47,
        tournamentsWon: 8,
        decksCreated: 23,
        judgeEvents: 15,
        organizedEvents: 3,
      },
      achievements: [
        { id: 1, name: 'First Victory', description: 'Win your first tournament', earned: true },
        { id: 2, name: 'Deck Master', description: 'Create 20 decks', earned: true },
        { id: 3, name: 'Judge Apprentice', description: 'Become a Level 1 Judge', earned: true },
        { id: 4, name: 'Tournament Organizer', description: 'Organize your first tournament', earned: true },
      ],
      preferences: {
        emailNotifications: true,
        tournamentReminders: true,
        deckSharing: 'public',
        profileVisibility: 'public',
      },
      savedDecks: [1, 2, 3], // Deck IDs
      registeredTournaments: [1, 2], // Tournament IDs
      organizedTournaments: [3], // Tournament IDs
    },
    'judge@example.com': {
      id: 2,
      email: 'judge@example.com',
      username: 'JudgeSarah',
      displayName: 'Sarah Chen',
      avatar: '/api/placeholder/64/64',
      roles: ['player', 'judge', 'organizer'],
      judgeLevel: 3,
      organizerLevel: 3,
      joinDate: '2022-06-10',
      location: 'New York, NY',
      bio: 'Head Judge and Tournament Organizer. Passionate about fair play and community building.',
      stats: {
        tournamentsPlayed: 89,
        tournamentsWon: 15,
        decksCreated: 45,
        judgeEvents: 67,
        organizedEvents: 23,
      },
      achievements: [
        { id: 1, name: 'First Victory', description: 'Win your first tournament', earned: true },
        { id: 2, name: 'Deck Master', description: 'Create 20 decks', earned: true },
        { id: 3, name: 'Judge Apprentice', description: 'Become a Level 1 Judge', earned: true },
        { id: 4, name: 'Tournament Organizer', description: 'Organize your first tournament', earned: true },
        { id: 5, name: 'Head Judge', description: 'Become a Level 3 Judge', earned: true },
        { id: 6, name: 'Community Leader', description: 'Organize 20 tournaments', earned: true },
      ],
      preferences: {
        emailNotifications: true,
        tournamentReminders: true,
        deckSharing: 'public',
        profileVisibility: 'public',
      },
      savedDecks: [1, 2, 3, 4, 5],
      registeredTournaments: [1],
      organizedTournaments: [1, 2, 3],
    },
  };

  useEffect(() => {
    // Simulate loading user from localStorage/session
    const savedUser = localStorage.getItem('konivrer_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in real app, this would call your authentication API
    const userData = mockUsers[email];
    if (userData && password === 'password') {
      setUser(userData);
      localStorage.setItem('konivrer_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (userData) => {
    // Mock registration - in real app, this would call your registration API
    const newUser = {
      id: Date.now(),
      email: userData.email,
      username: userData.username,
      displayName: userData.displayName,
      avatar: '/api/placeholder/64/64',
      roles: ['player'],
      judgeLevel: 0,
      organizerLevel: 0,
      joinDate: new Date().toISOString().split('T')[0],
      location: userData.location || '',
      bio: '',
      stats: {
        tournamentsPlayed: 0,
        tournamentsWon: 0,
        decksCreated: 0,
        judgeEvents: 0,
        organizedEvents: 0,
      },
      achievements: [],
      preferences: {
        emailNotifications: true,
        tournamentReminders: true,
        deckSharing: 'public',
        profileVisibility: 'public',
      },
      savedDecks: [],
      registeredTournaments: [],
      organizedTournaments: [],
    };

    setUser(newUser);
    localStorage.setItem('konivrer_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('konivrer_user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const applyForJudge = (level) => {
    const updatedUser = {
      ...user,
      roles: user.roles.includes('judge') ? user.roles : [...user.roles, 'judge'],
      judgeLevel: Math.max(user.judgeLevel, level),
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const applyForOrganizer = (level) => {
    const updatedUser = {
      ...user,
      roles: user.roles.includes('organizer') ? user.roles : [...user.roles, 'organizer'],
      organizerLevel: Math.max(user.organizerLevel, level),
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const registerForTournament = (tournamentId) => {
    const updatedUser = {
      ...user,
      registeredTournaments: [...user.registeredTournaments, tournamentId],
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const unregisterFromTournament = (tournamentId) => {
    const updatedUser = {
      ...user,
      registeredTournaments: user.registeredTournaments.filter(id => id !== tournamentId),
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const saveDeck = (deckId) => {
    const updatedUser = {
      ...user,
      savedDecks: [...user.savedDecks, deckId],
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const unsaveDeck = (deckId) => {
    const updatedUser = {
      ...user,
      savedDecks: user.savedDecks.filter(id => id !== deckId),
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    applyForJudge,
    applyForOrganizer,
    registerForTournament,
    unregisterFromTournament,
    saveDeck,
    unsaveDeck,
    isAuthenticated: !!user,
    hasRole: (role) => user?.roles?.includes(role) || false,
    isJudge: () => user?.roles?.includes('judge') || false,
    isOrganizer: () => user?.roles?.includes('organizer') || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};