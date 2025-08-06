import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Friend System Types
export interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'playing' | 'away';
  level: number;
  winRate: number;
  lastSeen: Date;
  isOnline: boolean;
  currentGame?: {
    opponent: string;
    gameMode: string;
    startTime: Date;
  };
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    favoriteCard: string;
  };
}

export interface FriendRequest {
  id: string;
  fromUser: {
    id: string;
    username: string;
    avatar: string;
    level: number;
  };
  message: string;
  sentAt: Date;
}

export interface GameInvite {
  id: string;
  fromFriend: Friend;
  gameMode: 'casual' | 'ranked' | 'tournament';
  message: string;
  sentAt: Date;
  expiresAt: Date;
}

// Mock data for demonstration
const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    username: 'MysticMage92',
    avatar: '🧙‍♂️',
    status: 'online',
    level: 15,
    winRate: 0.73,
    lastSeen: new Date(),
    isOnline: true,
    stats: {
      gamesPlayed: 247,
      gamesWon: 180,
      currentStreak: 7,
      favoriteCard: 'Angel',
    },
  },
  {
    id: '2',
    username: 'DragonSlayer',
    avatar: '⚔️',
    status: 'playing',
    level: 22,
    winRate: 0.68,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    isOnline: true,
    currentGame: {
      opponent: 'ElementalMaster',
      gameMode: 'Ranked',
      startTime: new Date(Date.now() - 15 * 60 * 1000),
    },
    stats: {
      gamesPlayed: 412,
      gamesWon: 280,
      currentStreak: 3,
      favoriteCard: 'Brightlava',
    },
  },
  {
    id: '3',
    username: 'ElementalWise',
    avatar: '🌟',
    status: 'offline',
    level: 18,
    winRate: 0.71,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isOnline: false,
    stats: {
      gamesPlayed: 156,
      gamesWon: 111,
      currentStreak: 0,
      favoriteCard: 'Aurora',
    },
  },
  {
    id: '4',
    username: 'CardMaster',
    avatar: '🎴',
    status: 'away',
    level: 12,
    winRate: 0.65,
    lastSeen: new Date(Date.now() - 45 * 60 * 1000),
    isOnline: true,
    stats: {
      gamesPlayed: 89,
      gamesWon: 58,
      currentStreak: 2,
      favoriteCard: 'Rainbow',
    },
  },
];

const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: '1',
    fromUser: {
      id: '5',
      username: 'NewPlayer123',
      avatar: '🎮',
      level: 3,
    },
    message: 'Hey! Loved our match, want to be friends?',
    sentAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: '2',
    fromUser: {
      id: '6',
      username: 'ProGamer',
      avatar: '👑',
      level: 25,
    },
    message: 'Good game! Let\'s play again sometime.',
    sentAt: new Date(Date.now() - 30 * 60 * 1000),
  },
];

const MOCK_GAME_INVITES: GameInvite[] = [
  {
    id: '1',
    fromFriend: MOCK_FRIENDS[0],
    gameMode: 'casual',
    message: 'Want to test my new deck?',
    sentAt: new Date(Date.now() - 5 * 60 * 1000),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  },
];

// Friends System Manager
export class FriendsManager {
  private friends: Map<string, Friend> = new Map();
  private friendRequests: FriendRequest[] = [];
  private gameInvites: GameInvite[] = [];
  private listeners: ((event: string, data: any) => void)[] = [];

  constructor() {
    // Initialize with mock data
    MOCK_FRIENDS.forEach(friend => this.friends.set(friend.id, friend));
    this.friendRequests = [...MOCK_FRIEND_REQUESTS];
    this.gameInvites = [...MOCK_GAME_INVITES];
    
    // Simulate real-time updates
    this.startRealTimeUpdates();
  }

  // Get all friends
  getFriends(): Friend[] {
    return Array.from(this.friends.values());
  }

  // Get online friends
  getOnlineFriends(): Friend[] {
    return this.getFriends().filter(friend => friend.isOnline);
  }

  // Get friend requests
  getFriendRequests(): FriendRequest[] {
    return this.friendRequests;
  }

  // Get game invites
  getGameInvites(): GameInvite[] {
    return this.gameInvites.filter(invite => invite.expiresAt > new Date());
  }

  // Send friend request
  sendFriendRequest(username: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Friend request sent to ${username}: ${message}`);
        this.notifyListeners('friend_request_sent', { username, message });
        resolve(true);
      }, 500);
    });
  }

  // Accept friend request
  acceptFriendRequest(requestId: string): void {
    const request = this.friendRequests.find(r => r.id === requestId);
    if (request) {
      // Add as friend
      const newFriend: Friend = {
        id: request.fromUser.id,
        username: request.fromUser.username,
        avatar: request.fromUser.avatar,
        status: 'online',
        level: request.fromUser.level,
        winRate: 0.5, // Default for new friends
        lastSeen: new Date(),
        isOnline: true,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          favoriteCard: 'Unknown',
        },
      };

      this.friends.set(newFriend.id, newFriend);
      this.friendRequests = this.friendRequests.filter(r => r.id !== requestId);
      
      this.notifyListeners('friend_added', newFriend);
      console.log(`Friend request accepted: ${request.fromUser.username}`);
    }
  }

  // Decline friend request
  declineFriendRequest(requestId: string): void {
    const request = this.friendRequests.find(r => r.id === requestId);
    if (request) {
      this.friendRequests = this.friendRequests.filter(r => r.id !== requestId);
      this.notifyListeners('friend_request_declined', request);
      console.log(`Friend request declined: ${request.fromUser.username}`);
    }
  }

  // Remove friend
  removeFriend(friendId: string): void {
    const friend = this.friends.get(friendId);
    if (friend) {
      this.friends.delete(friendId);
      this.notifyListeners('friend_removed', friend);
      console.log(`Friend removed: ${friend.username}`);
    }
  }

  // Send game invite
  sendGameInvite(friendId: string, gameMode: GameInvite['gameMode'], message: string): void {
    const friend = this.friends.get(friendId);
    if (friend && friend.isOnline && friend.status !== 'playing') {
      const invite: GameInvite = {
        id: Date.now().toString(),
        fromFriend: friend,
        gameMode,
        message,
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      };

      console.log(`Game invite sent to ${friend.username}`);
      this.notifyListeners('game_invite_sent', invite);
    }
  }

  // Accept game invite
  acceptGameInvite(inviteId: string): void {
    const invite = this.gameInvites.find(i => i.id === inviteId);
    if (invite) {
      this.gameInvites = this.gameInvites.filter(i => i.id !== inviteId);
      this.notifyListeners('game_invite_accepted', invite);
      console.log(`Game invite accepted from ${invite.fromFriend.username}`);
    }
  }

  // Decline game invite
  declineGameInvite(inviteId: string): void {
    const invite = this.gameInvites.find(i => i.id === inviteId);
    if (invite) {
      this.gameInvites = this.gameInvites.filter(i => i.id !== inviteId);
      this.notifyListeners('game_invite_declined', invite);
      console.log(`Game invite declined from ${invite.fromFriend.username}`);
    }
  }

  // Start a chat with friend
  startChat(friendId: string): void {
    const friend = this.friends.get(friendId);
    if (friend) {
      this.notifyListeners('chat_started', friend);
      console.log(`Chat started with ${friend.username}`);
    }
  }

  // View friend profile
  viewProfile(friendId: string): Friend | null {
    return this.friends.get(friendId) || null;
  }

  // Search friends
  searchFriends(query: string): Friend[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getFriends().filter(friend => 
      friend.username.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Add event listener
  addEventListener(listener: (event: string, data: any) => void): void {
    this.listeners.push(listener);
  }

  // Remove event listener
  removeEventListener(listener: (event: string, data: any) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notify listeners
  private notifyListeners(event: string, data: any): void {
    this.listeners.forEach(listener => listener(event, data));
  }

  // Simulate real-time friend status updates
  private startRealTimeUpdates(): void {
    setInterval(() => {
      this.friends.forEach(friend => {
        // Randomly update friend status
        if (Math.random() < 0.1) { // 10% chance each update
          const statuses: Friend['status'][] = ['online', 'away', 'playing'];
          if (friend.isOnline) {
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            if (friend.status !== newStatus) {
              friend.status = newStatus;
              friend.lastSeen = new Date();
              this.notifyListeners('friend_status_changed', friend);
            }
          }
        }
      });
    }, 30000); // Update every 30 seconds
  }
}

// Global friends manager instance
export const friendsManager = new FriendsManager();

// Friends Panel Component
interface FriendsPanelProps {
  onClose?: () => void;
}

export const FriendsPanel: React.FC<FriendsPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'invites'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [gameInvites, setGameInvites] = useState<GameInvite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [newFriendMessage, setNewFriendMessage] = useState('');

  // Update data when component mounts
  useEffect(() => {
    const updateData = () => {
      setFriends(friendsManager.getFriends());
      setFriendRequests(friendsManager.getFriendRequests());
      setGameInvites(friendsManager.getGameInvites());
    };

    updateData();

    const listener = (event: string, data: any) => {
      updateData();
    };

    friendsManager.addEventListener(listener);
    return () => friendsManager.removeEventListener(listener);
  }, []);

  // Filter friends based on search
  const filteredFriends = searchQuery 
    ? friendsManager.searchFriends(searchQuery)
    : friends;

  const getStatusColor = (status: Friend['status']): string => {
    switch (status) {
      case 'online': return '#40c057';
      case 'playing': return '#fd7e14';
      case 'away': return '#ffd93d';
      case 'offline': return '#868e96';
      default: return '#868e96';
    }
  };

  const getStatusText = (friend: Friend): string => {
    if (!friend.isOnline) return 'Offline';
    
    switch (friend.status) {
      case 'online': return 'Online';
      case 'playing': 
        return friend.currentGame 
          ? `Playing vs ${friend.currentGame.opponent}`
          : 'In Game';
      case 'away': return 'Away';
      default: return 'Unknown';
    }
  };

  const formatLastSeen = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleSendFriendRequest = async () => {
    if (newFriendUsername.trim()) {
      await friendsManager.sendFriendRequest(newFriendUsername, newFriendMessage);
      setNewFriendUsername('');
      setNewFriendMessage('');
      setShowAddFriend(false);
    }
  };

  return (
    <div className="friends-panel-overlay">
      <style>{`
        .friends-panel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .friends-panel-modal {
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
          border-radius: 12px;
          padding: 30px;
          max-width: 800px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          color: white;
          position: relative;
          border: 2px solid rgba(139, 69, 19, 0.5);
        }

        .friends-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .friends-panel-title {
          font-size: 24px;
          font-weight: bold;
          color: #ffd700;
        }

        .close-button {
          background: rgba(220, 53, 69, 0.3);
          border: 1px solid rgba(220, 53, 69, 0.5);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }

        .close-button:hover {
          background: rgba(220, 53, 69, 0.5);
        }

        .friends-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(139, 69, 19, 0.3);
        }

        .friends-tab {
          background: transparent;
          border: none;
          color: #ccc;
          padding: 12px 20px;
          border-radius: 6px 6px 0 0;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
          position: relative;
        }

        .friends-tab.active {
          background: rgba(139, 69, 19, 0.3);
          color: #ffd700;
          border-bottom: 2px solid #ffd700;
        }

        .friends-tab:hover {
          background: rgba(139, 69, 19, 0.2);
        }

        .tab-badge {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #ff6b6b;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 10px;
          min-width: 16px;
          text-align: center;
        }

        .friends-controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          align-items: center;
        }

        .search-input {
          flex: 1;
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
        }

        .add-friend-btn {
          background: rgba(40, 167, 69, 0.3);
          border: 1px solid rgba(40, 167, 69, 0.5);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .add-friend-btn:hover {
          background: rgba(40, 167, 69, 0.5);
        }

        .friends-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .friend-item {
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          border-radius: 8px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.2s ease;
        }

        .friend-item:hover {
          background: rgba(139, 69, 19, 0.3);
        }

        .friend-avatar {
          font-size: 32px;
          position: relative;
        }

        .status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #1a1a2e;
        }

        .friend-info {
          flex: 1;
        }

        .friend-name {
          font-size: 16px;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 4px;
        }

        .friend-status {
          font-size: 12px;
          color: #ccc;
          margin-bottom: 4px;
        }

        .friend-stats {
          font-size: 11px;
          color: #888;
        }

        .friend-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: rgba(139, 69, 19, 0.3);
          border: 1px solid rgba(139, 69, 19, 0.5);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .action-btn:hover {
          background: rgba(139, 69, 19, 0.5);
        }

        .action-btn.invite {
          background: rgba(0, 123, 255, 0.3);
          border-color: rgba(0, 123, 255, 0.5);
        }

        .action-btn.invite:hover {
          background: rgba(0, 123, 255, 0.5);
        }

        .action-btn.remove {
          background: rgba(220, 53, 69, 0.3);
          border-color: rgba(220, 53, 69, 0.5);
        }

        .action-btn.remove:hover {
          background: rgba(220, 53, 69, 0.5);
        }

        .request-item {
          background: rgba(0, 123, 255, 0.1);
          border: 1px solid rgba(0, 123, 255, 0.3);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
        }

        .request-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .request-message {
          color: #ccc;
          font-size: 14px;
          margin-bottom: 10px;
          font-style: italic;
        }

        .request-actions {
          display: flex;
          gap: 8px;
        }

        .accept-btn {
          background: rgba(40, 167, 69, 0.3);
          border: 1px solid rgba(40, 167, 69, 0.5);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .accept-btn:hover {
          background: rgba(40, 167, 69, 0.5);
        }

        .decline-btn {
          background: rgba(220, 53, 69, 0.3);
          border: 1px solid rgba(220, 53, 69, 0.5);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .decline-btn:hover {
          background: rgba(220, 53, 69, 0.5);
        }

        .invite-item {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
        }

        .add-friend-form {
          background: rgba(139, 69, 19, 0.2);
          border: 1px solid rgba(139, 69, 19, 0.5);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-label {
          display: block;
          margin-bottom: 5px;
          color: #ccc;
          font-size: 14px;
        }

        .form-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(139, 69, 19, 0.5);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-textarea {
          resize: vertical;
          min-height: 60px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
        }

        .submit-btn {
          background: rgba(40, 167, 69, 0.3);
          border: 1px solid rgba(40, 167, 69, 0.5);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .submit-btn:hover {
          background: rgba(40, 167, 69, 0.5);
        }

        .cancel-btn {
          background: rgba(108, 117, 125, 0.3);
          border: 1px solid rgba(108, 117, 125, 0.5);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .cancel-btn:hover {
          background: rgba(108, 117, 125, 0.5);
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #888;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 10px;
          display: block;
        }
      `}</style>

      <motion.div
        className="friends-panel-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="friends-panel-header">
          <h2 className="friends-panel-title">👥 Friends</h2>
          {onClose && (
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div className="friends-tabs">
          <button
            className={`friends-tab ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends ({friends.length})
          </button>
          <button
            className={`friends-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests
            {friendRequests.length > 0 && (
              <span className="tab-badge">{friendRequests.length}</span>
            )}
          </button>
          <button
            className={`friends-tab ${activeTab === 'invites' ? 'active' : ''}`}
            onClick={() => setActiveTab('invites')}
          >
            Game Invites
            {gameInvites.length > 0 && (
              <span className="tab-badge">{gameInvites.length}</span>
            )}
          </button>
        </div>

        {activeTab === 'friends' && (
          <div>
            <div className="friends-controls">
              <input
                type="text"
                className="search-input"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="add-friend-btn"
                onClick={() => setShowAddFriend(!showAddFriend)}
              >
                + Add Friend
              </button>
            </div>

            {showAddFriend && (
              <motion.div
                className="add-friend-form"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter username..."
                    value={newFriendUsername}
                    onChange={(e) => setNewFriendUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message (optional)</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Add a personal message..."
                    value={newFriendMessage}
                    onChange={(e) => setNewFriendMessage(e.target.value)}
                  />
                </div>
                <div className="form-actions">
                  <button className="submit-btn" onClick={handleSendFriendRequest}>
                    Send Request
                  </button>
                  <button className="cancel-btn" onClick={() => setShowAddFriend(false)}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            <div className="friends-list">
              {filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                  <motion.div
                    key={friend.id}
                    className="friend-item"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <div className="friend-avatar">
                      {friend.avatar}
                      <div 
                        className="status-indicator"
                        style={{ backgroundColor: getStatusColor(friend.status) }}
                      />
                    </div>
                    <div className="friend-info">
                      <div className="friend-name">{friend.username}</div>
                      <div className="friend-status">{getStatusText(friend)}</div>
                      <div className="friend-stats">
                        Level {friend.level} • {(friend.winRate * 100).toFixed(0)}% WR • 
                        {friend.isOnline ? ' Online' : ` Last seen ${formatLastSeen(friend.lastSeen)}`}
                      </div>
                    </div>
                    <div className="friend-actions">
                      <button
                        className="action-btn"
                        onClick={() => friendsManager.startChat(friend.id)}
                      >
                        💬 Chat
                      </button>
                      {friend.isOnline && friend.status !== 'playing' && (
                        <button
                          className="action-btn invite"
                          onClick={() => friendsManager.sendGameInvite(friend.id, 'casual', 'Want to play?')}
                        >
                          ⚔️ Invite
                        </button>
                      )}
                      <button
                        className="action-btn remove"
                        onClick={() => friendsManager.removeFriend(friend.id)}
                      >
                        ❌ Remove
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">😔</span>
                  <div>No friends found</div>
                  <div style={{ fontSize: '12px', marginTop: '5px' }}>
                    {searchQuery ? 'Try a different search term' : 'Add some friends to get started!'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            {friendRequests.length > 0 ? (
              friendRequests.map(request => (
                <motion.div
                  key={request.id}
                  className="request-item"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="request-header">
                    <span style={{ fontSize: '24px' }}>{request.fromUser.avatar}</span>
                    <div>
                      <div className="friend-name">{request.fromUser.username}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        Level {request.fromUser.level} • {formatLastSeen(request.sentAt)}
                      </div>
                    </div>
                  </div>
                  {request.message && (
                    <div className="request-message">"{request.message}"</div>
                  )}
                  <div className="request-actions">
                    <button
                      className="accept-btn"
                      onClick={() => friendsManager.acceptFriendRequest(request.id)}
                    >
                      ✅ Accept
                    </button>
                    <button
                      className="decline-btn"
                      onClick={() => friendsManager.declineFriendRequest(request.id)}
                    >
                      ❌ Decline
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <div>No friend requests</div>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                  When someone sends you a friend request, it will appear here
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'invites' && (
          <div>
            {gameInvites.length > 0 ? (
              gameInvites.map(invite => (
                <motion.div
                  key={invite.id}
                  className="invite-item"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="request-header">
                    <span style={{ fontSize: '24px' }}>{invite.fromFriend.avatar}</span>
                    <div>
                      <div className="friend-name">{invite.fromFriend.username}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {invite.gameMode.charAt(0).toUpperCase() + invite.gameMode.slice(1)} Game • {formatLastSeen(invite.sentAt)}
                      </div>
                    </div>
                  </div>
                  {invite.message && (
                    <div className="request-message">"{invite.message}"</div>
                  )}
                  <div className="request-actions">
                    <button
                      className="accept-btn"
                      onClick={() => friendsManager.acceptGameInvite(invite.id)}
                    >
                      ⚔️ Accept
                    </button>
                    <button
                      className="decline-btn"
                      onClick={() => friendsManager.declineGameInvite(invite.id)}
                    >
                      ❌ Decline
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🎮</span>
                <div>No game invites</div>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                  When friends invite you to games, they will appear here
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FriendsPanel;