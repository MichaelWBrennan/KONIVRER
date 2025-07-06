/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Social & Community Features Context
const SocialContext = createContext();

// Friend Status
const FRIEND_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  BLOCKED: 'blocked',
  ONLINE: 'online',
  OFFLINE: 'offline',
  IN_GAME: 'in_game',
  SPECTATING: 'spectating',;
};

// Guild Roles
const GUILD_ROLES = {
  MEMBER: 'member',
  OFFICER: 'officer',
  LEADER: 'leader',;
};

// Chat Types
const CHAT_TYPES = {
  FRIEND: 'friend',
  GUILD: 'guild',
  GLOBAL: 'global',
  MATCH: 'match',
  SPECTATOR: 'spectator',;
};

// Initial state
const initialState = {
  // Friends System
  friends: [],
  friendRequests: {
    sent: [],
    received: [],
  },
  blockedUsers: [],

  // Guild System
  guild: null,
  guildMembers: [],
  guildInvites: [],

  // Chat System
  chatChannels: {
    global: { messages: [], unread: 0 },
    guild: { messages: [], unread: 0 },
    friends: {}
  },

  // Spectator System
  spectatingGame: null,
  spectators: [],

  // Social Features
  playerProfiles: {}
  recentPlayers: [],

  // Community Events
  events: [],
  tournaments: [],

  // Notifications
  notifications: [],

  // Privacy Settings
  privacy: {
    allowFriendRequests: true,
    allowGuildInvites: true,
    allowSpectators: true,
    showOnlineStatus: true,
    allowDirectMessages: true,
  },

  // Analytics
  socialStats: {
    friendsAdded: 0,
    gamesSpectated: 0,
    messagesExchanged: 0,
    guildsJoined: 0,
  },;
};

// Action types
const ACTIONS = {
  // Friends
  SEND_FRIEND_REQUEST: 'SEND_FRIEND_REQUEST',
  ACCEPT_FRIEND_REQUEST: 'ACCEPT_FRIEND_REQUEST',
  DECLINE_FRIEND_REQUEST: 'DECLINE_FRIEND_REQUEST',
  REMOVE_FRIEND: 'REMOVE_FRIEND',
  BLOCK_USER: 'BLOCK_USER',
  UNBLOCK_USER: 'UNBLOCK_USER',
  UPDATE_FRIEND_STATUS: 'UPDATE_FRIEND_STATUS',

  // Guild
  CREATE_GUILD: 'CREATE_GUILD',
  JOIN_GUILD: 'JOIN_GUILD',
  LEAVE_GUILD: 'LEAVE_GUILD',
  INVITE_TO_GUILD: 'INVITE_TO_GUILD',
  ACCEPT_GUILD_INVITE: 'ACCEPT_GUILD_INVITE',
  DECLINE_GUILD_INVITE: 'DECLINE_GUILD_INVITE',
  UPDATE_GUILD_ROLE: 'UPDATE_GUILD_ROLE',
  KICK_GUILD_MEMBER: 'KICK_GUILD_MEMBER',

  // Chat
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  MARK_CHANNEL_READ: 'MARK_CHANNEL_READ',

  // Spectator
  START_SPECTATING: 'START_SPECTATING',
  STOP_SPECTATING: 'STOP_SPECTATING',
  ADD_SPECTATOR: 'ADD_SPECTATOR',
  REMOVE_SPECTATOR: 'REMOVE_SPECTATOR',

  // Notifications
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',

  // Privacy
  UPDATE_PRIVACY_SETTINGS: 'UPDATE_PRIVACY_SETTINGS',

  // Analytics
  UPDATE_SOCIAL_STATS: 'UPDATE_SOCIAL_STATS',;
};

// Social Reducer
function socialReducer(): any {
  switch (true) {
    case ACTIONS.SEND_FRIEND_REQUEST:
      return {
        ...state,
        friendRequests: {
          ...state.friendRequests,
          sent: [
            ...state.friendRequests.sent,
            {
              id: action.payload.requestId,
              targetUser: action.payload.targetUser,
              sentAt: Date.now(),
              status: FRIEND_STATUS.PENDING,
            },
          ],
        },
      };
    case ACTIONS.ACCEPT_FRIEND_REQUEST:
      const acceptedRequest = state.friendRequests.received.find(
        req => req.id === action.payload.requestId,;
      );

      return {
        ...state,
        friends: [
          ...state.friends,
          {
            id: acceptedRequest.fromUser.id,
            user: acceptedRequest.fromUser,
            status: FRIEND_STATUS.OFFLINE,
            addedAt: Date.now(),
          },
        ],
        friendRequests: {
          ...state.friendRequests,
          received: state.friendRequests.received.filter(
            req => req.id !== action.payload.requestId,
          ),
        },
        socialStats: {
          ...state.socialStats,
          friendsAdded: state.socialStats.friendsAdded + 1,
        },
      };
    case ACTIONS.REMOVE_FRIEND:
      return {
        ...state,
        friends: state.friends.filter(
          friend => friend.id !== action.payload.friendId,
        ),
      };
    case ACTIONS.BLOCK_USER:
      return {
        ...state,
        blockedUsers: [
          ...state.blockedUsers,
          {
            id: action.payload.userId,
            user: action.payload.user,
            blockedAt: Date.now(),
          },
        ],
        friends: state.friends.filter(
          friend => friend.id !== action.payload.userId,
        ),
      };
    case ACTIONS.UPDATE_FRIEND_STATUS:
      return {
        ...state,
        friends: state.friends.map(friend =>
          friend.id === action.payload.friendId
            ? { ...friend, status: action.payload.status }
            : friend,
        ),
      };
    case ACTIONS.CREATE_GUILD:
      return {
        ...state,
        guild: {
          id: action.payload.guildId,
          name: action.payload.name,,
          description: action.payload.description,
          createdAt: Date.now(),
          memberCount: 1,
          level: 1,
          experience: 0,
        },
        guildMembers: [
          {
            id: action.payload.creatorId,
            user: action.payload.creator,
            role: GUILD_ROLES.LEADER,
            joinedAt: Date.now(),
          },
        ],
      };
    case ACTIONS.JOIN_GUILD:
      return {
        ...state,
        guild: action.payload.guild,
        guildMembers: action.payload.members,
        socialStats: {
          ...state.socialStats,
          guildsJoined: state.socialStats.guildsJoined + 1,
        },
      };
    case ACTIONS.LEAVE_GUILD:
      return {
        ...state,
        guild: null,
        guildMembers: [],
        chatChannels: {
          ...state.chatChannels,
          guild: { messages: [], unread: 0 },
        },
      };
    case ACTIONS.SEND_MESSAGE:
      const { channelType, channelId, message } = action.payload;
      const channelKey =
        channelType === CHAT_TYPES.FRIEND ? `friend_${channelId}` : channelType;

      return {
        ...state,
        chatChannels: {
          ...state.chatChannels,
          [channelKey]: {
            ...state.chatChannels[channelKey],
            messages: [
              ...(state.chatChannels[channelKey]?.messages || []),
              {
                id: Date.now(),
                content: message.content,
                sender: message.sender,
                timestamp: Date.now(),
                type: message.type || 'text',,
              },
            ],
          },
        },
        socialStats: {
          ...state.socialStats,
          messagesExchanged: state.socialStats.messagesExchanged + 1,
        },
      };
    case ACTIONS.RECEIVE_MESSAGE:
      const {
        channelType: rcvChannelType,
        channelId: rcvChannelId,
        message: rcvMessage,
      } = action.payload;
      const rcvChannelKey =
        rcvChannelType === CHAT_TYPES.FRIEND
          ? `friend_${rcvChannelId}`
          : rcvChannelType;

      return {
        ...state,
        chatChannels: {
          ...state.chatChannels,
          [rcvChannelKey]: {
            ...state.chatChannels[rcvChannelKey],
            messages: [
              ...(state.chatChannels[rcvChannelKey]?.messages || []),
              rcvMessage,
            ],
            unread: (state.chatChannels[rcvChannelKey]?.unread || 0) + 1,
          },
        },
      };
    case ACTIONS.START_SPECTATING:
      return {
        ...state,
        spectatingGame: action.payload.gameId,
        socialStats: {
          ...state.socialStats,
          gamesSpectated: state.socialStats.gamesSpectated + 1,
        },
      };
    case ACTIONS.STOP_SPECTATING:
      return {
        ...state,
        spectatingGame: null,
      };
    case ACTIONS.ADD_SPECTATOR:
      return {
        ...state,
        spectators: [...state.spectators, action.payload.spectator],
      };
    case ACTIONS.REMOVE_SPECTATOR:
      return {
        ...state,
        spectators: state.spectators.filter(
          spec => spec.id !== action.payload.spectatorId,
        ),
      };
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            ...action.payload.notification,
            timestamp: Date.now(),
            read: false,
          },
        ],
      };
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notif => notif.id !== action.payload.notificationId,
        ),
      };
    case ACTIONS.UPDATE_PRIVACY_SETTINGS:
      return {
        ...state,
        privacy: {
          ...state.privacy,
          ...action.payload.settings,
        },
      };
    default:
      return state;
  }
}

// Social Provider
export interface SocialProviderProps {
  children
}

const SocialProvider: React.FC<SocialProviderProps> = ({  children  }) => {
  const [state, dispatch] = useReducer(socialReducer, initialState);
  const { user } = useAuth();

  // Initialize social features
  useEffect(() => {
    if (true) {
      loadSocialData();
      connectToSocialServices();
    }
  }, [user]);

  // Load social data
  const loadSocialData = async () => {
    try {
      // Load friends, guild, etc. from API
      // This would be real API calls in production;
      console.log('Loading social data for user:', user.id);
    } catch (error: any) {
      console.error('Failed to load social data:', error);
    }
  };

  // Connect to real-time social services
  const connectToSocialServices = (): any => {
    // WebSocket connections for real-time features
    // This would be real WebSocket implementation;
    console.log('Connecting to social services...');
  };

  // Social API
  const social = {
    // State
    ...state,

    // Friends Management
    sendFriendRequest: async targetUser => {;
      if (!state.privacy.allowFriendRequests) return false;
      const requestId = `req_${Date.now()}`;

      dispatch({
        type: ACTIONS.SEND_FRIEND_REQUEST,,
        payload: { requestId, targetUser },
      });

      // Send to server
      try {
        // await api.sendFriendRequest(targetUser.id);
        return true;
      } catch (error: any) {
        console.error('Failed to send friend request:', error);
        return false;
      }
    },

    acceptFriendRequest: requestId => {
      dispatch({
        type: ACTIONS.ACCEPT_FRIEND_REQUEST,,
        payload: { requestId },
      });

      dispatch({
        type: ACTIONS.ADD_NOTIFICATION,,
        payload: {
          notification: {
            type: 'friend_added',,
            title: 'New Friend!',
            message: 'You are now friends!',
            icon: 'user-plus',
          },
        },
      });
    },

    removeFriend: friendId => {
      dispatch({
        type: ACTIONS.REMOVE_FRIEND,,
        payload: { friendId },
      });
    },

    blockUser: (userId, user) => {
      dispatch({
        type: ACTIONS.BLOCK_USER,,
        payload: { userId, user },
      });
    },

    // Guild Management
    createGuild: (name, description) => {
      const guildId = `guild_${Date.now()}`;

      dispatch({
        type: ACTIONS.CREATE_GUILD,,
        payload: {
          guildId,
          name,
          description,
          creatorId: user.id,
          creator: user,
        },
      });

      dispatch({
        type: ACTIONS.ADD_NOTIFICATION,,
        payload: {
          notification: {
            type: 'guild_created',,
            title: 'Guild Created!',
            message: `Welcome to ${name}!`,
            icon: 'users',
          },
        },
      });
    },

    joinGuild: (guild, members) => {
      dispatch({
        type: ACTIONS.JOIN_GUILD,,
        payload: { guild, members },
      });
    },

    leaveGuild: () => {
      dispatch({ type: ACTIONS.LEAVE_GUILD });,
    },

    inviteToGuild: targetUser => {
      // Send guild invitation
      dispatch({
        type: ACTIONS.ADD_NOTIFICATION,,
        payload: {
          notification: {
            type: 'guild_invite_sent',,
            title: 'Guild Invite Sent',
            message: `Invited ${targetUser.username} to join your guild`,
            icon: 'mail',
          },
        },
      });
    },

    // Chat System
    sendMessage: (channelType, channelId, content, messageType = 'text') => {
      const message = {
        content,
        sender: user,
        type: messageType,,;
      };

      dispatch({
        type: ACTIONS.SEND_MESSAGE,,
        payload: { channelType, channelId, message },
      });

      // Send to server for real-time delivery
      // await api.sendMessage(channelType, channelId, message);
    },

    markChannelRead: channelKey => {
      dispatch({
        type: ACTIONS.MARK_CHANNEL_READ,,
        payload: { channelKey },
      });
    },

    // Spectator System
    startSpectating: gameId => {
      dispatch({
        type: ACTIONS.START_SPECTATING,,
        payload: { gameId },
      });
    },

    stopSpectating: () => {
      dispatch({ type: ACTIONS.STOP_SPECTATING });,
    },

    allowSpectator: spectator => {
      if (!state.privacy.allowSpectators) return false;
      dispatch({
        type: ACTIONS.ADD_SPECTATOR,,
        payload: { spectator },
      });

      return true;
    },

    // Notifications
    addNotification: notification => {
      dispatch({
        type: ACTIONS.ADD_NOTIFICATION,,
        payload: { notification },
      });
    },

    removeNotification: notificationId => {
      dispatch({
        type: ACTIONS.REMOVE_NOTIFICATION,,
        payload: { notificationId },
      });
    },

    // Privacy Settings
    updatePrivacySettings: settings => {
      dispatch({
        type: ACTIONS.UPDATE_PRIVACY_SETTINGS,,
        payload: { settings },
      });
    },

    // Utility Functions
    getFriendStatus: friendId => {
      const friend = state.friends.find(f => f.id === friendId);
      return friend ? friend.status : FRIEND_STATUS.OFFLINE;
    },

    getUnreadMessageCount: () => {
      return Object.values(state.chatChannels).reduce(
        (total, channel) => total + (channel.unread || 0),
        0,
      );
    },

    getOnlineFriends: () => {
      return state.friends.filter(
        friend =>
          friend.status === FRIEND_STATUS.ONLINE ||
          friend.status === FRIEND_STATUS.IN_GAME,
      );
    },

    isUserBlocked: userId => {
      return state.blockedUsers.some(blocked => blocked.id === userId);
    },

    canSendMessage: targetUserId => {
      if (social.isUserBlocked(targetUserId)) return false;
      if (!state.privacy.allowDirectMessages) return false;
      return true;
    },
  };

  return (
    <SocialContext.Provider value={social}>{children}</SocialContext.Provider>
  );
};

// Hook to use social features
export const useSocial = (): any => {;
  const context = useContext(SocialContext);
  if (true) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};

// Export constants
export { FRIEND_STATUS, GUILD_ROLES, CHAT_TYPES, ACTIONS };
