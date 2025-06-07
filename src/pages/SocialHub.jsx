import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  UserPlus, 
  UserMinus,
  Search,
  Filter,
  Bell,
  BellOff,
  Star,
  Trophy,
  Gamepad2,
  Calendar,
  MapPin,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Video,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  MoreHorizontal,
  Send,
  Smile,
  Image,
  Paperclip,
  Gift,
  Zap,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Flag,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Copy,
  Download,
  Upload,
  Edit,
  Trash2,
  Pin,
  Archive,
  Mute,
  Block,
  Report,
  Crown,
  Shield,
  Award,
  Target,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { WebSocketManager, announceToScreenReader, getDeviceInfo } from '../utils/modernFeatures';

const SocialHub = () => {
  const { user, wsManager } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', images: [], visibility: 'public' });
  const [voiceCall, setVoiceCall] = useState(null);
  const [videoCall, setVideoCall] = useState(null);
  const [streamingUsers, setStreamingUsers] = useState([]);
  
  // Real-time features
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [userPresence, setUserPresence] = useState(new Map());
  const [liveActivities, setLiveActivities] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  
  // Advanced features
  const [communityEvents, setCommunityEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [leaderboards, setLeaderboards] = useState([]);
  const [mentorshipProgram, setMentorshipProgram] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  const chatRef = useRef(null);
  const messageInputRef = useRef(null);
  const videoRef = useRef(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    initializeSocialData();
    setupWebSocketListeners();
    
    return () => {
      if (wsManager) {
        wsManager.send('leave_social_hub', { userId: user?.id });
      }
    };
  }, []);

  const initializeSocialData = async () => {
    // Mock data initialization
    const mockFriends = [
      {
        id: 1,
        username: 'ElementalMage',
        displayName: 'Sarah Wilson',
        avatar: '/api/placeholder/40/40',
        status: 'online',
        activity: 'Playing Ranked',
        lastSeen: new Date().toISOString(),
        mutualFriends: 12,
        isStreaming: true,
        streamTitle: 'Climbing to Legend Rank!'
      },
      {
        id: 2,
        username: 'StormCaller',
        displayName: 'Mike Chen',
        avatar: '/api/placeholder/40/40',
        status: 'away',
        activity: 'In Tournament',
        lastSeen: new Date(Date.now() - 300000).toISOString(),
        mutualFriends: 8,
        isStreaming: false
      },
      {
        id: 3,
        username: 'FireStorm99',
        displayName: 'Alex Rodriguez',
        avatar: '/api/placeholder/40/40',
        status: 'offline',
        activity: 'Last seen 2 hours ago',
        lastSeen: new Date(Date.now() - 7200000).toISOString(),
        mutualFriends: 15,
        isStreaming: false
      }
    ];

    const mockPosts = [
      {
        id: 1,
        author: {
          id: 1,
          username: 'ElementalMage',
          displayName: 'Sarah Wilson',
          avatar: '/api/placeholder/40/40',
          verified: true
        },
        content: 'Just hit Legend rank with my new Elemental Storm deck! The meta is really shifting towards more aggressive strategies. What do you all think?',
        images: ['/api/placeholder/400/300'],
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 47,
        comments: 12,
        shares: 8,
        isLiked: false,
        isBookmarked: true,
        visibility: 'public',
        tags: ['#Legend', '#ElementalStorm', '#Meta'],
        location: 'Los Angeles, CA'
      },
      {
        id: 2,
        author: {
          id: 2,
          username: 'StormCaller',
          displayName: 'Mike Chen',
          avatar: '/api/placeholder/40/40',
          verified: false
        },
        content: 'Streaming some tournament prep! Come watch and learn some advanced strategies. Link in bio!',
        images: [],
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        likes: 23,
        comments: 5,
        shares: 3,
        isLiked: true,
        isBookmarked: false,
        visibility: 'public',
        tags: ['#Stream', '#Tournament', '#Strategy'],
        streamUrl: 'https://stream.konivrer.com/stormcaller'
      }
    ];

    const mockCommunities = [
      {
        id: 1,
        name: 'KONIVRER Competitive',
        description: 'Discuss competitive strategies and meta analysis',
        memberCount: 15420,
        isJoined: true,
        avatar: '/api/placeholder/60/60',
        category: 'Competitive',
        isVerified: true,
        moderators: ['ProPlayer123', 'MetaAnalyst'],
        rules: ['Be respectful', 'No spam', 'Stay on topic'],
        recentActivity: 'Very Active'
      },
      {
        id: 2,
        name: 'Deck Builders United',
        description: 'Share and discuss deck builds',
        memberCount: 8750,
        isJoined: true,
        avatar: '/api/placeholder/60/60',
        category: 'Deck Building',
        isVerified: false,
        moderators: ['DeckMaster', 'BuilderPro'],
        rules: ['Share constructive feedback', 'Include deck lists', 'No netdecking shame'],
        recentActivity: 'Active'
      },
      {
        id: 3,
        name: 'New Player Help',
        description: 'Helping newcomers learn the game',
        memberCount: 12300,
        isJoined: false,
        avatar: '/api/placeholder/60/60',
        category: 'Beginner',
        isVerified: true,
        moderators: ['HelpfulVet', 'TeacherMage'],
        rules: ['Be patient and helpful', 'No question is too basic', 'Encourage learning'],
        recentActivity: 'Very Active'
      }
    ];

    const mockNotifications = [
      {
        id: 1,
        type: 'friend_request',
        from: { username: 'NewPlayer123', avatar: '/api/placeholder/32/32' },
        message: 'sent you a friend request',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isRead: false,
        action: 'friend_request'
      },
      {
        id: 2,
        type: 'like',
        from: { username: 'ElementalMage', avatar: '/api/placeholder/32/32' },
        message: 'liked your post about deck building',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        action: 'view_post'
      },
      {
        id: 3,
        type: 'tournament',
        from: { username: 'KONIVRER Official', avatar: '/api/placeholder/32/32' },
        message: 'Tournament registration opens in 1 hour',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        isRead: true,
        action: 'view_tournament'
      }
    ];

    setFriends(mockFriends);
    setPosts(mockPosts);
    setCommunities(mockCommunities);
    setNotifications(mockNotifications);
    setOnlineUsers(mockFriends.filter(f => f.status === 'online'));
    setStreamingUsers(mockFriends.filter(f => f.isStreaming));

    // Set trending topics
    setTrendingTopics([
      { tag: '#ElementalStorm', posts: 234, growth: '+15%' },
      { tag: '#WorldChampionship', posts: 567, growth: '+45%' },
      { tag: '#NewMeta', posts: 189, growth: '+8%' },
      { tag: '#DeckTech', posts: 123, growth: '+22%' }
    ]);

    // Set live activities
    setLiveActivities([
      { type: 'tournament', title: 'Weekly Championship', participants: 128, status: 'live' },
      { type: 'stream', title: 'Pro Player Coaching', viewers: 1250, status: 'live' },
      { type: 'event', title: 'Community Deck Review', participants: 45, status: 'starting_soon' }
    ]);
  };

  const setupWebSocketListeners = () => {
    if (!wsManager) return;

    // Join social hub
    wsManager.send('join_social_hub', { userId: user?.id });

    // Listen for real-time updates
    wsManager.on('user_online', (userData) => {
      setOnlineUsers(prev => [...prev.filter(u => u.id !== userData.id), userData]);
      setUserPresence(prev => new Map(prev.set(userData.id, 'online')));
      announceToScreenReader(`${userData.displayName} came online`);
    });

    wsManager.on('user_offline', (userData) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== userData.id));
      setUserPresence(prev => new Map(prev.set(userData.id, 'offline')));
    });

    wsManager.on('new_message', (message) => {
      if (activeChat && message.chatId === activeChat.id) {
        setChatMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      announceToScreenReader(`New message from ${message.author.displayName}`);
    });

    wsManager.on('user_typing', (data) => {
      if (data.chatId === activeChat?.id) {
        setTypingUsers(prev => new Set(prev.add(data.userId)));
        setTimeout(() => {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
        }, 3000);
      }
    });

    wsManager.on('new_post', (post) => {
      setPosts(prev => [post, ...prev]);
      announceToScreenReader(`New post from ${post.author.displayName}`);
    });

    wsManager.on('post_liked', (data) => {
      setPosts(prev => prev.map(post => 
        post.id === data.postId 
          ? { ...post, likes: post.likes + (data.liked ? 1 : -1), isLiked: data.liked }
          : post
      ));
    });

    wsManager.on('friend_request', (request) => {
      setFriendRequests(prev => [...prev, request]);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'friend_request',
        from: request.from,
        message: 'sent you a friend request',
        timestamp: new Date().toISOString(),
        isRead: false,
        action: 'friend_request'
      }, ...prev]);
      announceToScreenReader(`Friend request from ${request.from.displayName}`);
    });

    wsManager.on('voice_call_incoming', (callData) => {
      setVoiceCall({ ...callData, status: 'incoming' });
      announceToScreenReader(`Incoming voice call from ${callData.from.displayName}`);
    });

    wsManager.on('video_call_incoming', (callData) => {
      setVideoCall({ ...callData, status: 'incoming' });
      announceToScreenReader(`Incoming video call from ${callData.from.displayName}`);
    });
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const sendMessage = (content, type = 'text') => {
    if (!activeChat || !content.trim()) return;

    const message = {
      id: Date.now(),
      chatId: activeChat.id,
      author: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar
      },
      content: content.trim(),
      type,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setChatMessages(prev => [...prev, message]);
    
    if (wsManager) {
      wsManager.send('send_message', message);
    }

    if (messageInputRef.current) {
      messageInputRef.current.value = '';
    }
  };

  const createPost = async () => {
    if (!newPost.content.trim()) return;

    const post = {
      id: Date.now(),
      author: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        verified: user.verified || false
      },
      content: newPost.content,
      images: newPost.images,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      visibility: newPost.visibility,
      tags: extractTags(newPost.content)
    };

    setPosts(prev => [post, ...prev]);
    
    if (wsManager) {
      wsManager.send('create_post', post);
    }

    setNewPost({ content: '', images: [], visibility: 'public' });
    setIsCreatingPost(false);
    announceToScreenReader('Post created successfully');
  };

  const extractTags = (content) => {
    const tagRegex = /#\w+/g;
    return content.match(tagRegex) || [];
  };

  const likePost = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        const newLikes = post.likes + (newIsLiked ? 1 : -1);
        
        if (wsManager) {
          wsManager.send('like_post', { postId, liked: newIsLiked });
        }
        
        return { ...post, isLiked: newIsLiked, likes: newLikes };
      }
      return post;
    }));
  };

  const sendFriendRequest = (userId) => {
    if (wsManager) {
      wsManager.send('send_friend_request', { 
        to: userId,
        from: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar
        }
      });
    }
    announceToScreenReader('Friend request sent');
  };

  const acceptFriendRequest = (requestId) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    // Add to friends list logic here
    announceToScreenReader('Friend request accepted');
  };

  const startVoiceCall = (friendId) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend && wsManager) {
      wsManager.send('start_voice_call', { to: friendId });
      setVoiceCall({
        id: Date.now(),
        with: friend,
        status: 'calling',
        startTime: new Date().toISOString()
      });
    }
  };

  const startVideoCall = (friendId) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend && wsManager) {
      wsManager.send('start_video_call', { to: friendId });
      setVideoCall({
        id: Date.now(),
        with: friend,
        status: 'calling',
        startTime: new Date().toISOString()
      });
    }
  };

  const endCall = () => {
    if (voiceCall && wsManager) {
      wsManager.send('end_call', { callId: voiceCall.id });
    }
    if (videoCall && wsManager) {
      wsManager.send('end_call', { callId: videoCall.id });
    }
    setVoiceCall(null);
    setVideoCall(null);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Social Hub</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell size={20} className="text-muted hover:text-primary cursor-pointer" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {notifications.filter(n => !n.isRead).length}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor('online')}`} />
                <span className="text-sm text-muted">{onlineUsers.length} online</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-6 mt-4">
            {[
              { id: 'feed', label: 'Feed', icon: Activity },
              { id: 'friends', label: 'Friends', icon: Users },
              { id: 'communities', label: 'Communities', icon: Globe },
              { id: 'messages', label: 'Messages', icon: MessageCircle },
              { id: 'live', label: 'Live', icon: Video }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-accent-primary text-white' 
                    : 'text-muted hover:text-primary hover:bg-tertiary'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {/* Create Post */}
                <div className="card">
                  <div className="p-4">
                    {!isCreatingPost ? (
                      <button
                        onClick={() => setIsCreatingPost(true)}
                        className="w-full text-left p-3 bg-tertiary rounded-lg text-muted hover:bg-opacity-80 transition-colors"
                      >
                        What's on your mind, {user?.displayName}?
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <textarea
                          value={newPost.content}
                          onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Share your thoughts..."
                          className="w-full p-3 bg-tertiary rounded-lg resize-none"
                          rows={4}
                          autoFocus
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <button className="btn btn-sm btn-secondary">
                              <Image size={14} />
                              Photo
                            </button>
                            <button className="btn btn-sm btn-secondary">
                              <Video size={14} />
                              Video
                            </button>
                            <select
                              value={newPost.visibility}
                              onChange={(e) => setNewPost(prev => ({ ...prev, visibility: e.target.value }))}
                              className="input text-sm"
                            >
                              <option value="public">Public</option>
                              <option value="friends">Friends Only</option>
                              <option value="private">Private</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsCreatingPost(false)}
                              className="btn btn-sm btn-secondary"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={createPost}
                              disabled={!newPost.content.trim()}
                              className="btn btn-sm btn-primary"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Posts Feed */}
                {posts.map(post => (
                  <div key={post.id} className="card">
                    <div className="p-4">
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.displayName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{post.author.displayName}</span>
                              {post.author.verified && (
                                <CheckCircle size={14} className="text-blue-400" />
                              )}
                            </div>
                            <div className="text-sm text-muted">
                              @{post.author.username} • {formatTimestamp(post.timestamp)}
                              {post.location && (
                                <>
                                  <span className="mx-1">•</span>
                                  <MapPin size={12} className="inline" />
                                  <span className="ml-1">{post.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button className="text-muted hover:text-primary">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-3">
                        <p className="whitespace-pre-wrap">{post.content}</p>
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map(tag => (
                              <span key={tag} className="text-accent-primary text-sm hover:underline cursor-pointer">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Images */}
                      {post.images.length > 0 && (
                        <div className="mb-3">
                          <div className="grid grid-cols-2 gap-2">
                            {post.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt="Post image"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-color">
                        <div className="flex gap-6">
                          <button
                            onClick={() => likePost(post.id)}
                            className={`flex items-center gap-2 text-sm transition-colors ${
                              post.isLiked ? 'text-red-400' : 'text-muted hover:text-red-400'
                            }`}
                          >
                            <Heart size={16} className={post.isLiked ? 'fill-current' : ''} />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-2 text-sm text-muted hover:text-primary">
                            <MessageCircle size={16} />
                            {post.comments}
                          </button>
                          <button className="flex items-center gap-2 text-sm text-muted hover:text-primary">
                            <Share2 size={16} />
                            {post.shares}
                          </button>
                        </div>
                        <button
                          className={`text-muted hover:text-yellow-400 ${
                            post.isBookmarked ? 'text-yellow-400' : ''
                          }`}
                        >
                          <Bookmark size={16} className={post.isBookmarked ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="space-y-6">
                {/* Friend Requests */}
                {friendRequests.length > 0 && (
                  <div className="card">
                    <div className="p-4 border-b border-color">
                      <h3 className="font-semibold">Friend Requests ({friendRequests.length})</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {friendRequests.map(request => (
                        <div key={request.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={request.from.avatar}
                              alt={request.from.displayName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="font-medium">{request.from.displayName}</div>
                              <div className="text-sm text-muted">@{request.from.username}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptFriendRequest(request.id)}
                              className="btn btn-sm btn-primary"
                            >
                              Accept
                            </button>
                            <button className="btn btn-sm btn-secondary">
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Friends List */}
                <div className="card">
                  <div className="p-4 border-b border-color">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Friends ({friends.length})</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                        <input
                          type="text"
                          placeholder="Search friends..."
                          className="input pl-10 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {friends
                        .filter(friend => 
                          friend.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          friend.username.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(friend => (
                          <div key={friend.id} className="flex items-center justify-between p-3 bg-tertiary rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={friend.avatar}
                                  alt={friend.displayName}
                                  className="w-12 h-12 rounded-full"
                                />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(friend.status)}`} />
                                {friend.isStreaming && (
                                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <Video size={8} className="text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{friend.displayName}</div>
                                <div className="text-sm text-muted">@{friend.username}</div>
                                <div className="text-xs text-muted">{friend.activity}</div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => startVoiceCall(friend.id)}
                                className="btn btn-sm btn-secondary"
                                title="Voice call"
                              >
                                <Phone size={12} />
                              </button>
                              <button
                                onClick={() => startVideoCall(friend.id)}
                                className="btn btn-sm btn-secondary"
                                title="Video call"
                              >
                                <Video size={12} />
                              </button>
                              <button
                                onClick={() => setActiveChat(friend)}
                                className="btn btn-sm btn-primary"
                                title="Message"
                              >
                                <MessageCircle size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'communities' && (
              <div className="space-y-6">
                {/* Community Discovery */}
                <div className="card">
                  <div className="p-4 border-b border-color">
                    <h3 className="font-semibold">Discover Communities</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {communities.map(community => (
                        <div key={community.id} className="border border-color rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src={community.avatar}
                              alt={community.name}
                              className="w-12 h-12 rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{community.name}</h4>
                                {community.isVerified && (
                                  <CheckCircle size={14} className="text-blue-400" />
                                )}
                              </div>
                              <p className="text-sm text-muted mb-1">{community.description}</p>
                              <div className="text-xs text-muted">
                                {community.memberCount.toLocaleString()} members • {community.recentActivity}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs bg-tertiary px-2 py-1 rounded">
                              {community.category}
                            </span>
                            <button
                              className={`btn btn-sm ${
                                community.isJoined ? 'btn-secondary' : 'btn-primary'
                              }`}
                            >
                              {community.isJoined ? 'Joined' : 'Join'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'live' && (
              <div className="space-y-6">
                {/* Live Streams */}
                <div className="card">
                  <div className="p-4 border-b border-color">
                    <h3 className="font-semibold">Live Streams</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {streamingUsers.map(streamer => (
                        <div key={streamer.id} className="relative bg-black rounded-lg overflow-hidden">
                          <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <Play size={48} className="text-white opacity-80" />
                          </div>
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                            🔴 LIVE
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <img
                                src={streamer.avatar}
                                alt={streamer.displayName}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-white font-medium">{streamer.displayName}</span>
                            </div>
                            <div className="text-white text-sm">{streamer.streamTitle}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Activities */}
                <div className="card">
                  <div className="p-4 border-b border-color">
                    <h3 className="font-semibold">Live Activities</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {liveActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-tertiary rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            activity.status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
                          }`} />
                          <div>
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-muted">
                              {activity.type === 'tournament' && `${activity.participants} participants`}
                              {activity.type === 'stream' && `${activity.viewers} viewers`}
                              {activity.type === 'event' && `${activity.participants} participants`}
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-sm btn-primary">
                          {activity.status === 'live' ? 'Join' : 'Notify Me'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Friends */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold">Online Now ({onlineUsers.length})</h3>
              </div>
              <div className="p-4 space-y-2">
                {onlineUsers.slice(0, 8).map(friend => (
                  <div key={friend.id} className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-card ${getStatusColor(friend.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{friend.displayName}</div>
                      <div className="text-xs text-muted truncate">{friend.activity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold">Trending</h3>
              </div>
              <div className="p-4 space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-accent-primary">{topic.tag}</div>
                      <div className="text-sm text-muted">{topic.posts} posts</div>
                    </div>
                    <div className="text-sm text-green-400">{topic.growth}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="p-4 border-b border-color">
                <h3 className="font-semibold">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2">
                <button className="btn btn-secondary w-full justify-start">
                  <Users size={16} />
                  Find Friends
                </button>
                <button className="btn btn-secondary w-full justify-start">
                  <Globe size={16} />
                  Create Community
                </button>
                <button className="btn btn-secondary w-full justify-start">
                  <Calendar size={16} />
                  Host Event
                </button>
                <button className="btn btn-secondary w-full justify-start">
                  <Video size={16} />
                  Start Stream
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {activeChat && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-card border border-color rounded-lg shadow-lg flex flex-col">
          {/* Chat Header */}
          <div className="p-3 border-b border-color flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={activeChat.avatar}
                alt={activeChat.displayName}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium text-sm">{activeChat.displayName}</div>
                <div className="text-xs text-muted">{activeChat.status}</div>
              </div>
            </div>
            <button
              onClick={() => setActiveChat(null)}
              className="text-muted hover:text-primary"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={chatRef} className="flex-1 p-3 overflow-y-auto space-y-2">
            {chatMessages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.author.id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-2 rounded-lg text-sm ${
                    message.author.id === user.id
                      ? 'bg-accent-primary text-white'
                      : 'bg-tertiary'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {typingUsers.size > 0 && (
              <div className="text-xs text-muted italic">
                {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-color">
            <div className="flex gap-2">
              <input
                ref={messageInputRef}
                type="text"
                placeholder="Type a message..."
                className="input flex-1 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(e.target.value);
                  }
                }}
                onChange={(e) => {
                  if (wsManager) {
                    wsManager.send('user_typing', { 
                      chatId: activeChat.id,
                      userId: user.id 
                    });
                  }
                }}
              />
              <button
                onClick={() => {
                  if (messageInputRef.current) {
                    sendMessage(messageInputRef.current.value);
                  }
                }}
                className="btn btn-sm btn-primary"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Call Modal */}
      {voiceCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-color rounded-lg p-6 text-center">
            <img
              src={voiceCall.with.avatar}
              alt={voiceCall.with.displayName}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{voiceCall.with.displayName}</h3>
            <p className="text-muted mb-6">
              {voiceCall.status === 'calling' ? 'Calling...' : 
               voiceCall.status === 'incoming' ? 'Incoming call' : 'Connected'}
            </p>
            <div className="flex gap-4 justify-center">
              {voiceCall.status === 'incoming' && (
                <button className="btn btn-green">
                  <Phone size={16} />
                  Accept
                </button>
              )}
              <button
                onClick={endCall}
                className="btn btn-red"
              >
                <PhoneOff size={16} />
                {voiceCall.status === 'incoming' ? 'Decline' : 'End Call'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {videoCall && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="w-full h-full relative">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
            />
            <video
              ref={localVideoRef}
              className="absolute bottom-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white"
              autoPlay
              muted
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <button className="btn btn-red rounded-full w-12 h-12">
                <PhoneOff size={20} />
              </button>
              <button className="btn btn-secondary rounded-full w-12 h-12">
                <MicOff size={20} />
              </button>
              <button className="btn btn-secondary rounded-full w-12 h-12">
                <VideoOff size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialHub;