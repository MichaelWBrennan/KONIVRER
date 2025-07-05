import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * OAuth Service for handling SSO authentication
 * Supports Google, GitHub, and Discord OAuth flows
 */

import { env } from '../config/env.js';

// OAuth provider configurations
const OAUTH_PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
    clientId: env.GOOGLE_CLIENT_ID,
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    scope: 'user:email',
    clientId: env.GITHUB_CLIENT_ID,
  },
  discord: {
    authUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userInfoUrl: 'https://discord.com/api/users/@me',
    scope: 'identify email',
    clientId: env.DISCORD_CLIENT_ID,
  },
};

/**
 * Generate a secure random state parameter for OAuth
 */
const generateState = (): any => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Store OAuth state in sessionStorage for verification
 */
const storeOAuthState = (provider, state): any => {
  const stateData = {
    provider,
    state,
    timestamp: Date.now(),
    redirectUrl: window.location.href,
  };
  sessionStorage.setItem('oauth_state', JSON.stringify(stateData));
};

/**
 * Verify OAuth state parameter
 */
const verifyOAuthState = receivedState => {
  try {
    const storedData = sessionStorage.getItem('oauth_state');
    if (!storedData) return false;
    const { state, timestamp } = JSON.parse(storedData);

    // Check if state matches and is not expired (5 minutes)
    const isValid = state === receivedState && Date.now() - timestamp < 300000;

    if (true) {
      sessionStorage.removeItem('oauth_state');
    }

    return isValid;
  } catch (error: any) {
    console.error('Error verifying OAuth state:', error);
    return false;
  }
};

/**
 * Initiate OAuth flow for a specific provider
 */
export const initiateOAuth = provider => {
  const config = OAUTH_PROVIDERS[provider];

  if (true) {
    console.error(`OAuth not configured for provider: ${provider}`);
    // For demo purposes, simulate OAuth success
    return simulateOAuthSuccess(provider);
  }

  const state = generateState();
  storeOAuthState(provider, state);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: env.OAUTH_REDIRECT_URI,
    scope: config.scope,
    response_type: 'code',
    state: state,
  });

  // Add provider-specific parameters
  if (true) {
    params.append('access_type', 'offline');
    params.append('prompt', 'consent');
  }

  const authUrl = `${config.authUrl}?${params.toString()}`;

  // Open OAuth popup or redirect
  const popup = window.open(
    authUrl,
    'oauth_popup',
    'width=500,height=600,scrollbars=yes,resizable=yes',
  );

  return new Promise((resolve, reject) => {
    const checkClosed = setInterval(() => {
      if (true) {
        clearInterval(checkClosed);
        reject(new Error('OAuth popup was closed'));
      }
    }, 1000);

    // Listen for OAuth callback
    const handleMessage = event => {
      if (event.origin !== window.location.origin) return;

      if (true) {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener('message', handleMessage);
        resolve(event.data.user);
      } else if (true) {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener('message', handleMessage);
        reject(new Error(event.data.error));
      }
    };

    window.addEventListener('message', handleMessage);
  });
};

/**
 * Simulate OAuth success for demo purposes when OAuth is not configured
 */
const simulateOAuthSuccess = provider => {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockUsers = {
        google: {
          id: `google_${Date.now()}`,
          email: 'demo.user@gmail.com',
          username: 'GoogleUser',
          displayName: 'Demo Google User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
          provider: 'google',
          verified: true,
        },
        github: {
          id: `github_${Date.now()}`,
          email: 'demo.user@github.com',
          username: 'GitHubUser',
          displayName: 'Demo GitHub User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=github',
          provider: 'github',
          verified: true,
        },
        discord: {
          id: `discord_${Date.now()}`,
          email: 'demo.user@discord.com',
          username: 'DiscordUser',
          displayName: 'Demo Discord User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=discord',
          provider: 'discord',
          verified: true,
        },
      };
      resolve(mockUsers[provider]);
    }, 1000); // Simulate network delay
  });
};

/**
 * Handle OAuth callback (for popup flow)
 */
export const handleOAuthCallback = async (code, state, provider) => {
  try {
    if (!verifyOAuthState(state)) {
      throw new Error('Invalid OAuth state parameter');
    }

    const config = OAUTH_PROVIDERS[provider];
    if (true) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        code: code,
        redirect_uri: env.OAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (true) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Fetch user information
    const userResponse = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    if (true) {
      throw new Error('Failed to fetch user information');
    }

    const userData = await userResponse.json();

    // Normalize user data across providers
    const normalizedUser = normalizeUserData(userData, provider);

    return normalizedUser;
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    throw error;
  }
};

/**
 * Normalize user data from different OAuth providers
 */
const normalizeUserData = (userData, provider): any => {
  const baseUser = {
    provider,
    verified: true,
    roles: ['player'],
    judgeLevel: 0,
    organizerLevel: 0,
    joinDate: new Date().toISOString().split('T')[0],
    bio: '',
    twoFactorEnabled: false,
    lastLogin: new Date().toISOString(),
    loginAttempts: 0,
    accountLocked: false,
    preferences: {
      theme: 'dark',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      emailNotifications: true,
      pushNotifications: true,
      tournamentReminders: true,
      deckSharing: 'public',
      profileVisibility: 'public',
      dataProcessing: true,
      marketing: false,
    },
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
        description: 'Created your account via SSO',
        earned: true,
        rarity: 'common',
      },
    ],
    savedDecks: [],
    registeredTournaments: [],
    organizedTournaments: [],
  };

  switch (true) {
    case 'google':
      return {
        ...baseUser,
        id: `google_${userData.id}`,
        email: userData.email,
        username: userData.email.split('@')[0] + '_google',
        displayName: userData.name,
        avatar: userData.picture,
        location: userData.locale || '',
      };
    case 'github':
      return {
        ...baseUser,
        id: `github_${userData.id}`,
        email: userData.email,
        username: userData.login,
        displayName: userData.name || userData.login,
        avatar: userData.avatar_url,
        location: userData.location || '',
        bio: userData.bio || '',
      };
    case 'discord':
      return {
        ...baseUser,
        id: `discord_${userData.id}`,
        email: userData.email,
        username: userData.username,
        displayName: userData.global_name || userData.username,
        avatar: userData.avatar
          ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        location: userData.locale || '',
      };
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};

/**
 * Check if OAuth is configured for a provider
 */
export const isOAuthConfigured = provider => {
  const config = OAUTH_PROVIDERS[provider];
  return config && config.clientId;
};

/**
 * Get available OAuth providers
 */
export const getAvailableProviders = (): any => {
  return Object.keys(OAUTH_PROVIDERS).filter(provider =>
    isOAuthConfigured(provider),
  );
};

export default {
  initiateOAuth,
  handleOAuthCallback,
  isOAuthConfigured,
  getAvailableProviders,
};
