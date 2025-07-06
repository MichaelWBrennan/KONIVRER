/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Enums for social features
enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked',
  ONLINE = 'online',
  OFFLINE = 'offline',
  IN_GAME = 'in_game',
  SPECTATING = 'spectating'
}

enum GuildRole {
  MEMBER = 'member',
  OFFICER = 'officer',
  LEADER = 'leader'
}

enum ChatType {
  FRIEND = 'friend',
  GUILD = 'guild',
  GLOBAL = 'global',
  MATCH = 'match',
  SPECTATOR = 'spectator'
}

// Interfaces for social data types
interface Friend {
  id: string;
  username: string;
  avatar?: string;
  status: FriendStatus;
  lastSeen?: Date;
  currentGame?: {
    id: string;
    mode: string;
    startTime: Date;
  };
  favorite: boolean;
  notes?: string;
}

interface FriendRequest {
  id: string;
  username: string;
  avatar?: string;
  timestamp: Date;
  message?: string;
}

interface Guild {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  memberCount: number;
  role: GuildRole;
  joined: Date;
  level: number;
  experience: number;
  achievements: GuildAchievement[];
  events: GuildEvent[];
  announcements: GuildAnnouncement[];
}

interface GuildMember {
  id: string;
  username: string;
  avatar?: string;
  role: GuildRole;
  joined: Date;
  lastActive: Date;
  contributionPoints: number;
  status: FriendStatus;
}

interface GuildAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  total?: number;
}

interface GuildEvent {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: string;
  participants: string[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

interface GuildAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  pinned: boolean;
}

interface ChatMessage {
  id: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  type: ChatType;
  channelId: string;
  attachments?: {
    type: 'image' | 'video' | 'link' | 'deck' | 'card';
    url: string;
    preview?: string;
    metadata?: Record<string, any>;
  }[];
  reactions?: Record<string, string[]>;
  edited?: boolean;
  deleted?: boolean;
  replyTo?: string;
}

interface ChatChannel {
  id: string;
  name: string;
  type: ChatType;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  muted: boolean;
  pinned: boolean;
}

interface Tournament {
  id: string;
  name: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  status: 'upcoming' | 'active' | 'completed';
  participants: number;
  maxParticipants?: number;
  format: string;
  prizes?: string[];
  registered: boolean;
}

interface SocialNotification {
  id: string;
  type: 'friend_request' | 'guild_invite' | 'tournament' | 'achievement' | 'message' | 'system';
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  sender?: {
    id: string;
    username: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

interface SocialAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt?: Date;
  progress?: number;
  total?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface SocialProfile {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  status: FriendStatus;
  level: number;
  experience: number;
  joinDate: Date;
  achievements: SocialAchievement[];
  statistics: {
    wins: number;
    losses: number;
    draws: number;
    tournamentWins: number;
    favoriteDecks: Array<{
      id: string;
      name: string;
      wins: number;
      losses: number;
    }>;
    favoriteCards: Array<{
      id: string;
      name: string;
      usageCount: number;
    }>;
    [key: string]: any;
  };
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
  }>;
  guild?: {
    id: string;
    name: string;
    role: GuildRole;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    onlineStatus: boolean;
    gameHistory: boolean;
    statistics: boolean;
    achievements: boolean;
  };
}

// State interface
interface SocialState {
  friends: Friend[];
  friendRequests: {
    sent: FriendRequest[];
    received: FriendRequest[];
  };
  blockedUsers: Array<{
    id: string;
    username: string;
    blockedAt: Date;
  }>;
  guilds: Guild[];
  currentGuild?: Guild;
  guildMembers: Record<string, GuildMember[]>;
  guildInvites: Array<{
    id: string;
    guildId: string;
    guildName: string;
    invitedBy: string;
    timestamp: Date;
    message?: string;
  }>;
  chats: {
    channels: ChatChannel[];
    messages: Record<string, ChatMessage[]>;
    activeChannel?: string;
  };
  tournaments: Tournament[];
  notifications: SocialNotification[];
  profiles: Record<string, SocialProfile>;
  userProfile?: SocialProfile;
  achievements: SocialAchievement[];
  loading: boolean;
  error?: string;
}

// Action types
type SocialAction =
  | { type: 'SET_FRIENDS'; payload: Friend[] }
  | { type: 'ADD_FRIEND'; payload: Friend }
  | { type: 'UPDATE_FRIEND'; payload: { id: string; updates: Partial<Friend> } }
  | { type: 'REMOVE_FRIEND'; payload: string }
  | { type: 'SET_FRIEND_REQUESTS'; payload: { sent: FriendRequest[]; received: FriendRequest[] } }
  | { type: 'ADD_FRIEND_REQUEST'; payload: { type: 'sent' | 'received'; request: FriendRequest } }
  | { type: 'REMOVE_FRIEND_REQUEST'; payload: { type: 'sent' | 'received'; id: string } }
  | { type: 'SET_BLOCKED_USERS'; payload: Array<{ id: string; username: string; blockedAt: Date }> }
  | { type: 'BLOCK_USER'; payload: { id: string; username: string } }
  | { type: 'UNBLOCK_USER'; payload: string }
  | { type: 'SET_GUILDS'; payload: Guild[] }
  | { type: 'SET_CURRENT_GUILD'; payload: Guild | undefined }
  | { type: 'UPDATE_GUILD'; payload: { id: string; updates: Partial<Guild> } }
  | { type: 'SET_GUILD_MEMBERS'; payload: { guildId: string; members: GuildMember[] } }
  | { type: 'SET_GUILD_INVITES'; payload: Array<{ id: string; guildId: string; guildName: string; invitedBy: string; timestamp: Date; message?: string }> }
  | { type: 'ADD_GUILD_INVITE'; payload: { id: string; guildId: string; guildName: string; invitedBy: string; timestamp: Date; message?: string } }
  | { type: 'REMOVE_GUILD_INVITE'; payload: string }
  | { type: 'SET_CHAT_CHANNELS'; payload: ChatChannel[] }
  | { type: 'ADD_CHAT_CHANNEL'; payload: ChatChannel }
  | { type: 'UPDATE_CHAT_CHANNEL'; payload: { id: string; updates: Partial<ChatChannel> } }
  | { type: 'REMOVE_CHAT_CHANNEL'; payload: string }
  | { type: 'SET_CHAT_MESSAGES'; payload: { channelId: string; messages: ChatMessage[] } }
  | { type: 'ADD_CHAT_MESSAGE'; payload: { channelId: string; message: ChatMessage } }
  | { type: 'UPDATE_CHAT_MESSAGE'; payload: { channelId: string; messageId: string; updates: Partial<ChatMessage> } }
  | { type: 'SET_ACTIVE_CHANNEL'; payload: string | undefined }
  | { type: 'SET_TOURNAMENTS'; payload: Tournament[] }
  | { type: 'UPDATE_TOURNAMENT'; payload: { id: string; updates: Partial<Tournament> } }
  | { type: 'SET_NOTIFICATIONS'; payload: SocialNotification[] }
  | { type: 'ADD_NOTIFICATION'; payload: SocialNotification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_PROFILE'; payload: { userId: string; profile: SocialProfile } }
  | { type: 'SET_USER_PROFILE'; payload: SocialProfile }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<SocialProfile> }
  | { type: 'SET_ACHIEVEMENTS'; payload: SocialAchievement[] }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: { id: string; unlockedAt: Date } }
  | { type: 'UPDATE_ACHIEVEMENT_PROGRESS'; payload: { id: string; progress: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined };

// Initial state
const initialState: SocialState = {
  // Friends System
  friends: [],
  friendRequests: {
    sent: [],
    received: []
  },
  blockedUsers: [],
  
  // Guild System
  guilds: [],
  currentGuild: undefined,
  guildMembers: {},
  guildInvites: [],
  
  // Chat System
  chats: {
    channels: [],
    messages: {},
    activeChannel: undefined
  },
  
  // Tournament System
  tournaments: [],
  
  // Notification System
  notifications: [],
  
  // Profile System
  profiles: {},
  userProfile: undefined,
  
  // Achievement System
  achievements: [],
  
  // UI State
  loading: false,
  error: undefined
};

// Reducer function
const socialReducer = (state: SocialState, action: SocialAction): SocialState => {
  switch (action.type) {
    case 'SET_FRIENDS':
      return {
        ...state,
        friends: action.payload
      };
      
    case 'ADD_FRIEND':
      return {
        ...state,
        friends: [...state.friends, action.payload]
      };
      
    case 'UPDATE_FRIEND':
      return {
        ...state,
        friends: state.friends.map(friend => 
          friend.id === action.payload.id 
            ? { ...friend, ...action.payload.updates } 
            : friend
        )
      };
      
    case 'REMOVE_FRIEND':
      return {
        ...state,
        friends: state.friends.filter(friend => friend.id !== action.payload)
      };
      
    case 'SET_FRIEND_REQUESTS':
      return {
        ...state,
        friendRequests: action.payload
      };
      
    case 'ADD_FRIEND_REQUEST':
      return {
        ...state,
        friendRequests: {
          ...state.friendRequests,
          [action.payload.type]: [
            ...state.friendRequests[action.payload.type],
            action.payload.request
          ]
        }
      };
      
    case 'REMOVE_FRIEND_REQUEST':
      return {
        ...state,
        friendRequests: {
          ...state.friendRequests,
          [action.payload.type]: state.friendRequests[action.payload.type]
            .filter(request => request.id !== action.payload.id)
        }
      };
      
    case 'SET_BLOCKED_USERS':
      return {
        ...state,
        blockedUsers: action.payload
      };
      
    case 'BLOCK_USER':
      return {
        ...state,
        blockedUsers: [
          ...state.blockedUsers,
          {
            id: action.payload.id,
            username: action.payload.username,
            blockedAt: new Date()
          }
        ]
      };
      
    case 'UNBLOCK_USER':
      return {
        ...state,
        blockedUsers: state.blockedUsers.filter(user => user.id !== action.payload)
      };
      
    case 'SET_GUILDS':
      return {
        ...state,
        guilds: action.payload
      };
      
    case 'SET_CURRENT_GUILD':
      return {
        ...state,
        currentGuild: action.payload
      };
      
    case 'UPDATE_GUILD':
      return {
        ...state,
        guilds: state.guilds.map(guild => 
          guild.id === action.payload.id 
            ? { ...guild, ...action.payload.updates } 
            : guild
        ),
        currentGuild: state.currentGuild?.id === action.payload.id
          ? { ...state.currentGuild, ...action.payload.updates }
          : state.currentGuild
      };
      
    case 'SET_GUILD_MEMBERS':
      return {
        ...state,
        guildMembers: {
          ...state.guildMembers,
          [action.payload.guildId]: action.payload.members
        }
      };
      
    case 'SET_GUILD_INVITES':
      return {
        ...state,
        guildInvites: action.payload
      };
      
    case 'ADD_GUILD_INVITE':
      return {
        ...state,
        guildInvites: [...state.guildInvites, action.payload]
      };
      
    case 'REMOVE_GUILD_INVITE':
      return {
        ...state,
        guildInvites: state.guildInvites.filter(invite => invite.id !== action.payload)
      };
      
    case 'SET_CHAT_CHANNELS':
      return {
        ...state,
        chats: {
          ...state.chats,
          channels: action.payload
        }
      };
      
    case 'ADD_CHAT_CHANNEL':
      return {
        ...state,
        chats: {
          ...state.chats,
          channels: [...state.chats.channels, action.payload]
        }
      };
      
    case 'UPDATE_CHAT_CHANNEL':
      return {
        ...state,
        chats: {
          ...state.chats,
          channels: state.chats.channels.map(channel => 
            channel.id === action.payload.id 
              ? { ...channel, ...action.payload.updates } 
              : channel
          )
        }
      };
      
    case 'REMOVE_CHAT_CHANNEL':
      return {
        ...state,
        chats: {
          ...state.chats,
          channels: state.chats.channels.filter(channel => channel.id !== action.payload),
          messages: Object.fromEntries(
            Object.entries(state.chats.messages).filter(([key]) => key !== action.payload)
          ),
          activeChannel: state.chats.activeChannel === action.payload 
            ? undefined 
            : state.chats.activeChannel
        }
      };
      
    case 'SET_CHAT_MESSAGES':
      return {
        ...state,
        chats: {
          ...state.chats,
          messages: {
            ...state.chats.messages,
            [action.payload.channelId]: action.payload.messages
          }
        }
      };
      
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chats: {
          ...state.chats,
          messages: {
            ...state.chats.messages,
            [action.payload.channelId]: [
              ...(state.chats.messages[action.payload.channelId] || []),
              action.payload.message
            ]
          },
          channels: state.chats.channels.map(channel => 
            channel.id === action.payload.channelId
              ? { 
                  ...channel, 
                  lastMessage: action.payload.message,
                  unreadCount: channel.id === state.chats.activeChannel 
                    ? 0 
                    : channel.unreadCount + 1
                }
              : channel
          )
        }
      };
      
    case 'UPDATE_CHAT_MESSAGE':
      return {
        ...state,
        chats: {
          ...state.chats,
          messages: {
            ...state.chats.messages,
            [action.payload.channelId]: (state.chats.messages[action.payload.channelId] || [])
              .map(message => 
                message.id === action.payload.messageId
                  ? { ...message, ...action.payload.updates }
                  : message
              )
          }
        }
      };
      
    case 'SET_ACTIVE_CHANNEL':
      return {
        ...state,
        chats: {
          ...state.chats,
          activeChannel: action.payload,
          channels: state.chats.channels.map(channel => 
            channel.id === action.payload
              ? { ...channel, unreadCount: 0 }
              : channel
          )
        }
      };
      
    case 'SET_TOURNAMENTS':
      return {
        ...state,
        tournaments: action.payload
      };
      
    case 'UPDATE_TOURNAMENT':
      return {
        ...state,
        tournaments: state.tournaments.map(tournament => 
          tournament.id === action.payload.id 
            ? { ...tournament, ...action.payload.updates } 
            : tournament
        )
      };
      
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload
      };
      
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
      
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => 
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
      
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };
      
    case 'SET_PROFILE':
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [action.payload.userId]: action.payload.profile
        }
      };
      
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: action.payload
      };
      
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: state.userProfile 
          ? { ...state.userProfile, ...action.payload }
          : undefined
      };
      
    case 'SET_ACHIEVEMENTS':
      return {
        ...state,
        achievements: action.payload
      };
      
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement => 
          achievement.id === action.payload.id
            ? { ...achievement, unlockedAt: action.payload.unlockedAt }
            : achievement
        )
      };
      
    case 'UPDATE_ACHIEVEMENT_PROGRESS':
      return {
        ...state,
        achievements: state.achievements.map(achievement => 
          achievement.id === action.payload.id
            ? { ...achievement, progress: action.payload.progress }
            : achievement
        )
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
      
    default:
      return state;
  }
};

// Context interface
interface SocialContextType {
  state: SocialState;
  sendFriendRequest: (userId: string, message?: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  blockUser: (userId: string, username: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  updateFriendStatus: (friendId: string, status: FriendStatus) => Promise<void>;
  joinGuild: (guildId: string) => Promise<void>;
  leaveGuild: (guildId: string) => Promise<void>;
  createGuild: (name: string, description?: string) => Promise<string>;
  sendGuildInvite: (guildId: string, userId: string, message?: string) => Promise<void>;
  acceptGuildInvite: (inviteId: string) => Promise<void>;
  declineGuildInvite: (inviteId: string) => Promise<void>;
  updateGuildMemberRole: (guildId: string, memberId: string, role: GuildRole) => Promise<void>;
  createChatChannel: (name: string, type: ChatType, participants: string[]) => Promise<string>;
  sendChatMessage: (channelId: string, content: string, attachments?: any[], replyTo?: string) => Promise<void>;
  editChatMessage: (channelId: string, messageId: string, content: string) => Promise<void>;
  deleteChatMessage: (channelId: string, messageId: string) => Promise<void>;
  setActiveChannel: (channelId: string | undefined) => void;
  registerForTournament: (tournamentId: string) => Promise<void>;
  withdrawFromTournament: (tournamentId: string) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  getUserProfile: (userId: string) => Promise<SocialProfile>;
  updateUserProfile: (updates: Partial<SocialProfile>) => Promise<void>;
  refreshSocialData: () => Promise<void>;
}

// Create context with default values
const SocialContext = createContext<SocialContextType>({
  state: initialState,
  sendFriendRequest: async () => {},
  acceptFriendRequest: async () => {},
  declineFriendRequest: async () => {},
  removeFriend: async () => {},
  blockUser: async () => {},
  unblockUser: async () => {},
  updateFriendStatus: async () => {},
  joinGuild: async () => {},
  leaveGuild: async () => {},
  createGuild: async () => '',
  sendGuildInvite: async () => {},
  acceptGuildInvite: async () => {},
  declineGuildInvite: async () => {},
  updateGuildMemberRole: async () => {},
  createChatChannel: async () => '',
  sendChatMessage: async () => {},
  editChatMessage: async () => {},
  deleteChatMessage: async () => {},
  setActiveChannel: () => {},
  registerForTournament: async () => {},
  withdrawFromTournament: async () => {},
  markNotificationRead: async () => {},
  clearNotifications: async () => {},
  getUserProfile: async () => ({} as SocialProfile),
  updateUserProfile: async () => {},
  refreshSocialData: async () => {}
});

// Provider props interface
interface SocialProviderProps {
  children: ReactNode;
}

// Provider component
export const SocialProvider: React.FC<SocialProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(socialReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  
  // Load initial data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshSocialData();
    }
  }, [isAuthenticated, user]);
  
  // Refresh all social data
  const refreshSocialData = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Fetch friends
      const friendsResponse = await fetch('/api/social/friends');
      if (friendsResponse.ok) {
        const friendsData = await friendsResponse.json();
        dispatch({ type: 'SET_FRIENDS', payload: friendsData });
      }
      
      // Fetch friend requests
      const requestsResponse = await fetch('/api/social/friend-requests');
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        dispatch({ type: 'SET_FRIEND_REQUESTS', payload: requestsData });
      }
      
      // Fetch blocked users
      const blockedResponse = await fetch('/api/social/blocked');
      if (blockedResponse.ok) {
        const blockedData = await blockedResponse.json();
        dispatch({ type: 'SET_BLOCKED_USERS', payload: blockedData });
      }
      
      // Fetch guilds
      const guildsResponse = await fetch('/api/social/guilds');
      if (guildsResponse.ok) {
        const guildsData = await guildsResponse.json();
        dispatch({ type: 'SET_GUILDS', payload: guildsData });
        
        // Set current guild if user is in one
        if (guildsData.length > 0) {
          dispatch({ type: 'SET_CURRENT_GUILD', payload: guildsData[0] });
          
          // Fetch guild members for current guild
          await fetchGuildMembers(guildsData[0].id);
        }
      }
      
      // Fetch guild invites
      const invitesResponse = await fetch('/api/social/guild-invites');
      if (invitesResponse.ok) {
        const invitesData = await invitesResponse.json();
        dispatch({ type: 'SET_GUILD_INVITES', payload: invitesData });
      }
      
      // Fetch chat channels
      const channelsResponse = await fetch('/api/social/chat/channels');
      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json();
        dispatch({ type: 'SET_CHAT_CHANNELS', payload: channelsData });
      }
      
      // Fetch tournaments
      const tournamentsResponse = await fetch('/api/social/tournaments');
      if (tournamentsResponse.ok) {
        const tournamentsData = await tournamentsResponse.json();
        dispatch({ type: 'SET_TOURNAMENTS', payload: tournamentsData });
      }
      
      // Fetch notifications
      const notificationsResponse = await fetch('/api/social/notifications');
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notificationsData });
      }
      
      // Fetch user profile
      const profileResponse = await fetch('/api/social/profile');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        dispatch({ type: 'SET_USER_PROFILE', payload: profileData });
      }
      
      // Fetch achievements
      const achievementsResponse = await fetch('/api/social/achievements');
      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievementsData });
      }
      
      dispatch({ type: 'SET_ERROR', payload: undefined });
    } catch (error) {
      console.error('Error refreshing social data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load social data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Fetch guild members
  const fetchGuildMembers = async (guildId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/social/guilds/${guildId}/members`);
      if (response.ok) {
        const membersData = await response.json();
        dispatch({ 
          type: 'SET_GUILD_MEMBERS', 
          payload: { guildId, members: membersData } 
        });
      }
    } catch (error) {
      console.error(`Error fetching guild members for ${guildId}:`, error);
    }
  };
  
  // Send friend request
  const sendFriendRequest = async (userId: string, message?: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/social/friend-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, message })
      });
      
      if (response.ok) {
        const requestData = await response.json();
        dispatch({ 
          type: 'ADD_FRIEND_REQUEST', 
          payload: { type: 'sent', request: requestData } 
        });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send friend request' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Accept friend request
  const acceptFriendRequest = async (requestId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/friend-requests/${requestId}/accept`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const friendData = await response.json();
        
        // Find the request to get the user info
        const request = state.friendRequests.received.find(req => req.id === requestId);
        
        if (request) {
          // Add as friend
          dispatch({ type: 'ADD_FRIEND', payload: friendData });
          
          // Remove from requests
          dispatch({ 
            type: 'REMOVE_FRIEND_REQUEST', 
            payload: { type: 'received', id: requestId } 
          });
        }
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to accept friend request' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Decline friend request
  const declineFriendRequest = async (requestId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/friend-requests/${requestId}/decline`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Remove from requests
        dispatch({ 
          type: 'REMOVE_FRIEND_REQUEST', 
          payload: { type: 'received', id: requestId } 
        });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error declining friend request:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to decline friend request' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Remove friend
  const removeFriend = async (friendId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/friends/${friendId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        dispatch({ type: 'REMOVE_FRIEND', payload: friendId });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove friend' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Block user
  const blockUser = async (userId: string, username: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/social/blocked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        // Add to blocked users
        dispatch({ type: 'BLOCK_USER', payload: { id: userId, username } });
        
        // Remove from friends if they were a friend
        const isFriend = state.friends.some(friend => friend.id === userId);
        if (isFriend) {
          dispatch({ type: 'REMOVE_FRIEND', payload: userId });
        }
        
        // Remove any pending friend requests
        const sentRequest = state.friendRequests.sent.find(req => req.id === userId);
        if (sentRequest) {
          dispatch({ 
            type: 'REMOVE_FRIEND_REQUEST', 
            payload: { type: 'sent', id: userId } 
          });
        }
        
        const receivedRequest = state.friendRequests.received.find(req => req.id === userId);
        if (receivedRequest) {
          dispatch({ 
            type: 'REMOVE_FRIEND_REQUEST', 
            payload: { type: 'received', id: userId } 
          });
        }
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to block user' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Unblock user
  const unblockUser = async (userId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/blocked/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        dispatch({ type: 'UNBLOCK_USER', payload: userId });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to unblock user' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Update friend status
  const updateFriendStatus = async (friendId: string, status: FriendStatus): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/friends/${friendId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        dispatch({ 
          type: 'UPDATE_FRIEND', 
          payload: { id: friendId, updates: { status } } 
        });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error updating friend status:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update friend status' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Join guild
  const joinGuild = async (guildId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/guilds/${guildId}/join`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const guildData = await response.json();
        
        // Add to guilds
        dispatch({ type: 'SET_GUILDS', payload: [...state.guilds, guildData] });
        
        // Set as current guild
        dispatch({ type: 'SET_CURRENT_GUILD', payload: guildData });
        
        // Fetch guild members
        await fetchGuildMembers(guildId);
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error joining guild:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to join guild' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Leave guild
  const leaveGuild = async (guildId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/guilds/${guildId}/leave`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Remove from guilds
        const updatedGuilds = state.guilds.filter(guild => guild.id !== guildId);
        dispatch({ type: 'SET_GUILDS', payload: updatedGuilds });
        
        // Update current guild if needed
        if (state.currentGuild?.id === guildId) {
          dispatch({ 
            type: 'SET_CURRENT_GUILD', 
            payload: updatedGuilds.length > 0 ? updatedGuilds[0] : undefined 
          });
        }
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error leaving guild:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to leave guild' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Create guild
  const createGuild = async (name: string, description?: string): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/social/guilds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      });
      
      if (response.ok) {
        const guildData = await response.json();
        
        // Add to guilds
        dispatch({ type: 'SET_GUILDS', payload: [...state.guilds, guildData] });
        
        // Set as current guild
        dispatch({ type: 'SET_CURRENT_GUILD', payload: guildData });
        
        return guildData.id;
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return '';
      }
    } catch (error) {
      console.error('Error creating guild:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create guild' });
      return '';
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Send guild invite
  const sendGuildInvite = async (guildId: string, userId: string, message?: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/guilds/${guildId}/invites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, message })
      });
      
      if (!response.ok) {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error sending guild invite:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send guild invite' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Accept guild invite
  const acceptGuildInvite = async (inviteId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/guild-invites/${inviteId}/accept`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const guildData = await response.json();
        
        // Add to guilds
        dispatch({ type: 'SET_GUILDS', payload: [...state.guilds, guildData] });
        
        // Set as current guild if no current guild
        if (!state.currentGuild) {
          dispatch({ type: 'SET_CURRENT_GUILD', payload: guildData });
        }
        
        // Remove invite
        dispatch({ type: 'REMOVE_GUILD_INVITE', payload: inviteId });
        
        // Fetch guild members
        await fetchGuildMembers(guildData.id);
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error accepting guild invite:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to accept guild invite' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Decline guild invite
  const declineGuildInvite = async (inviteId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/guild-invites/${inviteId}/decline`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Remove invite
        dispatch({ type: 'REMOVE_GUILD_INVITE', payload: inviteId });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error declining guild invite:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to decline guild invite' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Update guild member role
  const updateGuildMemberRole = async (guildId: string, memberId: string, role: GuildRole): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/guilds/${guildId}/members/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });
      
      if (response.ok) {
        // Update guild members
        const members = state.guildMembers[guildId] || [];
        const updatedMembers = members.map(member => 
          member.id === memberId ? { ...member, role } : member
        );
        
        dispatch({ 
          type: 'SET_GUILD_MEMBERS', 
          payload: { guildId, members: updatedMembers } 
        });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error updating guild member role:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update guild member role' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Create chat channel
  const createChatChannel = async (name: string, type: ChatType, participants: string[]): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/social/chat/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, type, participants })
      });
      
      if (response.ok) {
        const channelData = await response.json();
        
        // Add to channels
        dispatch({ type: 'ADD_CHAT_CHANNEL', payload: channelData });
        
        // Set as active channel
        dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: channelData.id });
        
        return channelData.id;
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return '';
      }
    } catch (error) {
      console.error('Error creating chat channel:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create chat channel' });
      return '';
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Send chat message
  const sendChatMessage = async (channelId: string, content: string, attachments?: any[], replyTo?: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/chat/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, attachments, replyTo })
      });
      
      if (response.ok) {
        const messageData = await response.json();
        
        // Add to messages
        dispatch({ 
          type: 'ADD_CHAT_MESSAGE', 
          payload: { channelId, message: messageData } 
        });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send chat message' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Edit chat message
  const editChatMessage = async (channelId: string, messageId: string, content: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/chat/channels/${channelId}/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        // Update message
        dispatch({ 
          type: 'UPDATE_CHAT_MESSAGE', 
          payload: { 
            channelId, 
            messageId, 
            updates: { content, edited: true } 
          } 
        });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error editing chat message:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to edit chat message' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Delete chat message
  const deleteChatMessage = async (channelId: string, messageId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/chat/channels/${channelId}/messages/${messageId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Mark message as deleted
        dispatch({ 
          type: 'UPDATE_CHAT_MESSAGE', 
          payload: { 
            channelId, 
            messageId, 
            updates: { deleted: true, content: 'This message has been deleted' } 
          } 
        });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error deleting chat message:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete chat message' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Set active channel
  const setActiveChannel = (channelId: string | undefined): void => {
    dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: channelId });
  };
  
  // Register for tournament
  const registerForTournament = async (tournamentId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/tournaments/${tournamentId}/register`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Update tournament
        dispatch({ 
          type: 'UPDATE_TOURNAMENT', 
          payload: { 
            id: tournamentId, 
            updates: { registered: true } 
          } 
        });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error registering for tournament:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to register for tournament' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Withdraw from tournament
  const withdrawFromTournament = async (tournamentId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/tournaments/${tournamentId}/withdraw`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Update tournament
        dispatch({ 
          type: 'UPDATE_TOURNAMENT', 
          payload: { 
            id: tournamentId, 
            updates: { registered: false } 
          } 
        });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error withdrawing from tournament:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to withdraw from tournament' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Mark notification as read
  const markNotificationRead = async (notificationId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/social/notifications/${notificationId}/read`, {
        method: 'POST'
      });
      
      if (response.ok) {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark notification as read' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Clear all notifications
  const clearNotifications = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/social/notifications/clear', {
        method: 'POST'
      });
      
      if (response.ok) {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear notifications' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Get user profile
  const getUserProfile = async (userId: string): Promise<SocialProfile> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Check if profile is already in cache
      if (state.profiles[userId]) {
        return state.profiles[userId];
      }
      
      const response = await fetch(`/api/social/profiles/${userId}`);
      
      if (response.ok) {
        const profileData = await response.json();
        
        // Cache profile
        dispatch({ 
          type: 'SET_PROFILE', 
          payload: { userId, profile: profileData } 
        });
        
        return profileData;
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user profile' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Update user profile
  const updateUserProfile = async (updates: Partial<SocialProfile>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/social/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        dispatch({ type: 'UPDATE_USER_PROFILE', payload: updates });
        
        // Update in profiles cache if exists
        if (user?.uid && state.profiles[user.uid]) {
          dispatch({ 
            type: 'SET_PROFILE', 
            payload: { 
              userId: user.uid, 
              profile: { ...state.profiles[user.uid], ...updates } 
            } 
          });
        }
      } else {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update user profile' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Context value
  const contextValue: SocialContextType = {
    state,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    blockUser,
    unblockUser,
    updateFriendStatus,
    joinGuild,
    leaveGuild,
    createGuild,
    sendGuildInvite,
    acceptGuildInvite,
    declineGuildInvite,
    updateGuildMemberRole,
    createChatChannel,
    sendChatMessage,
    editChatMessage,
    deleteChatMessage,
    setActiveChannel,
    registerForTournament,
    withdrawFromTournament,
    markNotificationRead,
    clearNotifications,
    getUserProfile,
    updateUserProfile,
    refreshSocialData
  };
  
  return (
    <SocialContext.Provider value={contextValue}>
      {children}
    </SocialContext.Provider>
  );
};

// Custom hook for using the social context
export const useSocial = (): SocialContextType => {
  const context = useContext(SocialContext);
  
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  
  return context;
};

export default SocialContext;