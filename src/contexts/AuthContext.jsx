import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { z } from 'zod';
import { initiateOAuth } from '../services/oauthService.js';

// Validation schemas using Zod for type safety
const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string().min(3).max(20),
  displayName: z.string().min(1).max(50),
  avatar: z.string().url().optional(),
  roles: z.array(z.enum(['player', 'judge', 'organizer', 'admin'])),
  judgeLevel: z.number().min(0).max(5),
  organizerLevel: z.number().min(0).max(5),
  joinDate: z.string(),
  location: z.string().optional(),
  bio: z.string().max(500).optional(),
  verified: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  lastLogin: z.string().optional(),
  loginAttempts: z.number().default(0),
  accountLocked: z.boolean().default(false),
  preferences: z.object({
    theme: z.enum(['dark', 'light', 'auto']).default('dark'),
    language: z.string().default('en'),
    timezone: z.string().default('UTC'),
    emailNotifications: z.boolean().default(true),
    pushNotifications: z.boolean().default(true),
    tournamentReminders: z.boolean().default(true),
    deckSharing: z.enum(['public', 'friends', 'private']).default('public'),
    profileVisibility: z
      .enum(['public', 'friends', 'private'])
      .default('public'),
    dataProcessing: z.boolean().default(false),
    marketing: z.boolean().default(false),
  }),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const RegisterSchema = z
  .object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number, and special character',
      ),
    confirmPassword: z.string(),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ),
    displayName: z.string().min(1, 'Display name is required').max(50),
    location: z.string().optional(),
    agreeToTerms: z
      .boolean()
      .refine(val => val === true, 'You must agree to the terms'),
    agreeToPrivacy: z
      .boolean()
      .refine(val => val === true, 'You must agree to the privacy policy'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Security utilities
const hashPassword = async password => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'konivrer_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const generateSessionToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const isTokenExpired = timestamp => {
  const now = Date.now();
  const tokenAge = now - timestamp;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  return tokenAge > maxAge;
};

// Rate limiting for login attempts
const rateLimiter = {
  attempts: new Map(),
  isBlocked: email => {
    const attempts = rateLimiter.attempts.get(email) || {
      count: 0,
      lastAttempt: 0,
    };
    const now = Date.now();
    const timeDiff = now - attempts.lastAttempt;

    if (timeDiff > 15 * 60 * 1000) {
      // Reset after 15 minutes
      rateLimiter.attempts.delete(email);
      return false;
    }

    return attempts.count >= 5; // Block after 5 attempts
  },
  recordAttempt: (email, success) => {
    const attempts = rateLimiter.attempts.get(email) || {
      count: 0,
      lastAttempt: 0,
    };

    if (success) {
      rateLimiter.attempts.delete(email);
    } else {
      attempts.count += 1;
      attempts.lastAttempt = Date.now();
      rateLimiter.attempts.set(email, attempts);
    }
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState(null);

  // Enhanced mock user data with security features
  const mockUsers = {
    'user1@example.com': {
      id: 1,
      email: 'user1@example.com',
      username: 'DragonMaster2024',
      displayName: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      roles: ['player', 'judge'],
      judgeLevel: 2,
      organizerLevel: 1,
      joinDate: '2023-01-15',
      location: 'Los Angeles, CA',
      bio: 'Competitive KONIVRER player and Level 2 Judge. Love elemental synergies!',
      verified: true,
      twoFactorEnabled: false,
      lastLogin: new Date().toISOString(),
      loginAttempts: 0,
      accountLocked: false,
      stats: {
        tournamentsPlayed: 47,
        tournamentsWon: 8,
        decksCreated: 23,
        judgeEvents: 15,
        organizedEvents: 3,
      },
      achievements: [
        {
          id: 1,
          name: 'First Victory',
          description: 'Win your first tournament',
          earned: true,
          rarity: 'common',
        },
        {
          id: 2,
          name: 'Deck Master',
          description: 'Create 20 decks',
          earned: true,
          rarity: 'rare',
        },
        {
          id: 3,
          name: 'Judge Apprentice',
          description: 'Become a Level 1 Judge',
          earned: true,
          rarity: 'epic',
        },
        {
          id: 4,
          name: 'Tournament Organizer',
          description: 'Organize your first tournament',
          earned: true,
          rarity: 'epic',
        },
      ],
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'America/Los_Angeles',
        emailNotifications: true,
        pushNotifications: true,
        tournamentReminders: true,
        deckSharing: 'public',
        profileVisibility: 'public',
        dataProcessing: true,
        marketing: false,
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
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      roles: ['player', 'judge', 'organizer', 'admin'],
      judgeLevel: 5,
      organizerLevel: 5,
      joinDate: '2022-06-10',
      location: 'New York, NY',
      bio: 'Head Judge and Tournament Organizer. Passionate about fair play and community building.',
      verified: true,
      twoFactorEnabled: true,
      lastLogin: new Date().toISOString(),
      loginAttempts: 0,
      accountLocked: false,
      stats: {
        tournamentsPlayed: 89,
        tournamentsWon: 15,
        decksCreated: 45,
        judgeEvents: 67,
        organizedEvents: 23,
      },
      achievements: [
        {
          id: 1,
          name: 'First Victory',
          description: 'Win your first tournament',
          earned: true,
          rarity: 'common',
        },
        {
          id: 2,
          name: 'Deck Master',
          description: 'Create 20 decks',
          earned: true,
          rarity: 'rare',
        },
        {
          id: 3,
          name: 'Judge Apprentice',
          description: 'Become a Level 1 Judge',
          earned: true,
          rarity: 'epic',
        },
        {
          id: 4,
          name: 'Tournament Organizer',
          description: 'Organize your first tournament',
          earned: true,
          rarity: 'epic',
        },
        {
          id: 5,
          name: 'Head Judge',
          description: 'Become a Level 5 Judge',
          earned: true,
          rarity: 'legendary',
        },
        {
          id: 6,
          name: 'Community Leader',
          description: 'Organize 20 tournaments',
          earned: true,
          rarity: 'legendary',
        },
        {
          id: 7,
          name: 'Platform Admin',
          description: 'Administrative privileges',
          earned: true,
          rarity: 'mythic',
        },
      ],
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'America/New_York',
        emailNotifications: true,
        pushNotifications: true,
        tournamentReminders: true,
        deckSharing: 'public',
        profileVisibility: 'public',
        dataProcessing: true,
        marketing: true,
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
    try {
      // Validate input
      const validation = LoginSchema.safeParse({ email, password });
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors[0].message,
          field: validation.error.errors[0].path[0],
        };
      }

      // Check rate limiting
      if (rateLimiter.isBlocked(email)) {
        return {
          success: false,
          error: 'Too many login attempts. Please try again in 15 minutes.',
        };
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const userData = mockUsers[email];
      const hashedPassword = await hashPassword(password);

      // Check if user exists and account is not locked
      if (!userData) {
        rateLimiter.recordAttempt(email, false);
        return { success: false, error: 'Invalid email or password' };
      }

      if (userData.accountLocked) {
        return {
          success: false,
          error: 'Account is locked. Please contact support.',
        };
      }

      // For demo purposes, accept 'password' or 'Password123!'
      const isValidPassword =
        password === 'password' || password === 'Password123!';

      if (isValidPassword) {
        // Generate session token
        const token = generateSessionToken();
        const sessionData = {
          token,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          ipAddress: '127.0.0.1', // Mock IP
        };

        // Update user's last login
        const updatedUser = {
          ...userData,
          lastLogin: new Date().toISOString(),
          loginAttempts: 0,
        };

        setUser(updatedUser);
        setSessionToken(token);

        // Store encrypted session data
        localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
        localStorage.setItem('konivrer_session', JSON.stringify(sessionData));

        rateLimiter.recordAttempt(email, true);

        // Log security event
        console.log(
          `[SECURITY] Successful login for ${email} at ${new Date().toISOString()}`,
        );

        return { success: true, user: updatedUser };
      } else {
        rateLimiter.recordAttempt(email, false);
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('[SECURITY] Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async userData => {
    try {
      // Validate input with Zod schema
      const validation = RegisterSchema.safeParse(userData);
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors[0].message,
          field: validation.error.errors[0].path[0],
        };
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if email already exists
      if (mockUsers[userData.email]) {
        return { success: false, error: 'Email already registered' };
      }

      // Check if username is taken (simulate database check)
      const existingUsernames = Object.values(mockUsers).map(u =>
        u.username.toLowerCase(),
      );
      if (existingUsernames.includes(userData.username.toLowerCase())) {
        return { success: false, error: 'Username already taken' };
      }

      // Generate secure user data
      const hashedPassword = await hashPassword(userData.password);
      const userId = Date.now();
      const avatarSeed = userData.username.toLowerCase();

      const newUser = {
        id: userId,
        email: userData.email,
        username: userData.username,
        displayName: userData.displayName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
        roles: ['player'],
        judgeLevel: 0,
        organizerLevel: 0,
        joinDate: new Date().toISOString().split('T')[0],
        location: userData.location || '',
        bio: '',
        verified: false,
        twoFactorEnabled: false,
        lastLogin: new Date().toISOString(),
        loginAttempts: 0,
        accountLocked: false,
        stats: {
          tournamentsPlayed: 0,
          tournamentsWon: 0,
          decksCreated: 0,
          judgeEvents: 0,
          organizedEvents: 0,
        },
        achievements: [
          {
            id: 1,
            name: 'Welcome to KONIVRER',
            description: 'Created your account',
            earned: true,
            rarity: 'common',
          },
        ],
        preferences: {
          theme: 'dark',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          emailNotifications: true,
          pushNotifications: true,
          tournamentReminders: true,
          deckSharing: 'public',
          profileVisibility: 'public',
          dataProcessing: userData.agreeToTerms,
          marketing: false,
        },
        savedDecks: [],
        registeredTournaments: [],
        organizedTournaments: [],
      };

      // Generate session token
      const token = generateSessionToken();
      const sessionData = {
        token,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        ipAddress: '127.0.0.1',
      };

      setUser(newUser);
      setSessionToken(token);

      localStorage.setItem('konivrer_user', JSON.stringify(newUser));
      localStorage.setItem('konivrer_session', JSON.stringify(sessionData));

      // Log security event
      console.log(
        `[SECURITY] New user registered: ${userData.email} at ${new Date().toISOString()}`,
      );

      return { success: true, user: newUser };
    } catch (error) {
      console.error('[SECURITY] Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  };

  const logout = useCallback(() => {
    // Log security event
    if (user) {
      console.log(
        `[SECURITY] User logout: ${user.email} at ${new Date().toISOString()}`,
      );
    }

    setUser(null);
    setSessionToken(null);
    localStorage.removeItem('konivrer_user');
    localStorage.removeItem('konivrer_session');

    // Clear any cached data
    sessionStorage.clear();
  }, [user]);

  // Session validation
  const validateSession = useCallback(() => {
    const sessionData = localStorage.getItem('konivrer_session');
    if (!sessionData || !sessionToken) return false;

    try {
      const session = JSON.parse(sessionData);
      return (
        !isTokenExpired(session.timestamp) && session.token === sessionToken
      );
    } catch {
      return false;
    }
  }, [sessionToken]);

  // Auto-logout on session expiry
  useEffect(() => {
    if (user && !validateSession()) {
      console.log('[SECURITY] Session expired, logging out');
      logout();
    }
  }, [user, validateSession, logout]);

  const updateProfile = updates => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const applyForJudge = level => {
    const updatedUser = {
      ...user,
      roles: user.roles.includes('judge')
        ? user.roles
        : [...user.roles, 'judge'],
      judgeLevel: Math.max(user.judgeLevel, level),
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const applyForOrganizer = level => {
    const updatedUser = {
      ...user,
      roles: user.roles.includes('organizer')
        ? user.roles
        : [...user.roles, 'organizer'],
      organizerLevel: Math.max(user.organizerLevel, level),
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const registerForTournament = tournamentId => {
    const updatedUser = {
      ...user,
      registeredTournaments: [...user.registeredTournaments, tournamentId],
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const unregisterFromTournament = tournamentId => {
    const updatedUser = {
      ...user,
      registeredTournaments: user.registeredTournaments.filter(
        id => id !== tournamentId,
      ),
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const saveDeck = deckId => {
    const updatedUser = {
      ...user,
      savedDecks: [...user.savedDecks, deckId],
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  const unsaveDeck = deckId => {
    const updatedUser = {
      ...user,
      savedDecks: user.savedDecks.filter(id => id !== deckId),
    };
    setUser(updatedUser);
    localStorage.setItem('konivrer_user', JSON.stringify(updatedUser));
  };

  // SSO Login method
  const loginWithSSO = async provider => {
    try {
      console.log(`[SSO] Initiating ${provider} OAuth flow`);

      const ssoUser = await initiateOAuth(provider);

      if (ssoUser) {
        // Generate session token
        const token = generateSessionToken();
        const sessionData = {
          token,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          ipAddress: '127.0.0.1',
          provider: provider,
        };

        // Create full user object with SSO data
        const fullUser = {
          ...ssoUser,
          lastLogin: new Date().toISOString(),
          loginAttempts: 0,
          accountLocked: false,
        };

        setUser(fullUser);
        setSessionToken(token);

        // Store user and session data
        localStorage.setItem('konivrer_user', JSON.stringify(fullUser));
        localStorage.setItem('konivrer_session', JSON.stringify(sessionData));

        // Log security event
        console.log(
          `[SECURITY] SSO login successful for ${fullUser.email} via ${provider} at ${new Date().toISOString()}`,
        );

        return { success: true, user: fullUser };
      } else {
        return { success: false, error: 'SSO authentication failed' };
      }
    } catch (error) {
      console.error(`[SSO] ${provider} login error:`, error);
      return {
        success: false,
        error:
          error.message ||
          `${provider} authentication failed. Please try again.`,
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithSSO,
    updateProfile,
    applyForJudge,
    applyForOrganizer,
    registerForTournament,
    unregisterFromTournament,
    saveDeck,
    unsaveDeck,
    isAuthenticated: !!user,
    hasRole: role => user?.roles?.includes(role) || false,
    isJudge: () => user?.roles?.includes('judge') || false,
    isOrganizer: () => user?.roles?.includes('organizer') || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
