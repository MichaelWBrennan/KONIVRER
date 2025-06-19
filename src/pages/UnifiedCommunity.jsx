import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UnifiedCommunity = () => {
  const { user, isAuthenticated } = useAuth();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'following', 'local'

  // Data states
  const [posts, setPosts] = useState([]);
  const [stores, setStores] = useState([]);
  const [hallOfFame, setHallOfFame] = useState([]);
  const [communityStats, setCommunityStats] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllCommunityData();
    getUserLocation();
  }, []);

  const loadAllCommunityData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSocialPosts(),
        loadStores(),
        loadHallOfFame(),
        loadCommunityStats(),
      ]);
    } catch (error) {
      console.error('Failed to load community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSocialPosts = async () => {
    // Mock social posts data
    const mockPosts = [
      {
        id: 1,
        user: {
          name: 'Alex Chen',
          avatar: '/api/placeholder/40/40',
          verified: true,
          rank: 'Champion',
        },
        content:
          "Just won my first tournament with this amazing Aggro Red deck! The meta is shifting and I think this archetype is really undervalued right now. Here's my decklist for anyone interested.",
        timestamp: '2 hours ago',
        likes: 45,
        comments: 12,
        shares: 8,
        images: ['/api/placeholder/400/300'],
        tags: ['#tournament', '#aggro', '#meta'],
        location: 'Los Angeles, CA',
        type: 'achievement',
      },
      {
        id: 2,
        user: {
          name: 'Sarah Johnson',
          avatar: '/api/placeholder/40/40',
          verified: false,
          rank: 'Expert',
        },
        content:
          'Looking for players in the NYC area for weekly draft nights! We meet every Thursday at 7 PM at the Manhattan Gaming Center. All skill levels welcome!',
        timestamp: '4 hours ago',
        likes: 23,
        comments: 18,
        shares: 15,
        tags: ['#draft', '#nyc', '#weekly'],
        location: 'New York, NY',
        type: 'event',
      },
      {
        id: 3,
        user: {
          name: 'Mike Rodriguez',
          avatar: '/api/placeholder/40/40',
          verified: true,
          rank: 'Master',
        },
        content:
          "New card spoilers are looking incredible! The design team really outdid themselves with this set. Can't wait to start brewing with these new mechanics.",
        timestamp: '6 hours ago',
        likes: 67,
        comments: 34,
        shares: 22,
        images: ['/api/placeholder/300/420', '/api/placeholder/300/420'],
        tags: ['#spoilers', '#newset', '#brewing'],
        type: 'discussion',
      },
    ];
    setPosts(mockPosts);
  };

  const loadStores = async () => {
    // Mock store data
    const mockStores = [
      {
        id: 1,
        name: "Dragon's Den Gaming",
        address: '123 Main St, Los Angeles, CA 90210',
        phone: '(555) 123-4567',
        website: 'https://dragonsden.com',
        rating: 4.8,
        reviews: 156,
        distance: 2.3,
        events: [
          { name: 'Friday Night Magic', day: 'Friday', time: '7:00 PM' },
          { name: 'Saturday Draft', day: 'Saturday', time: '2:00 PM' },
          { name: 'Sunday Casual', day: 'Sunday', time: '1:00 PM' },
        ],
        amenities: ['WiFi', 'Snacks', 'Parking', 'AC'],
        image: '/api/placeholder/300/200',
        verified: true,
      },
      {
        id: 2,
        name: 'The Game Haven',
        address: '456 Oak Ave, Los Angeles, CA 90211',
        phone: '(555) 987-6543',
        website: 'https://gamehaven.com',
        rating: 4.6,
        reviews: 89,
        distance: 4.7,
        events: [
          { name: 'Wednesday Warriors', day: 'Wednesday', time: '6:30 PM' },
          { name: 'Weekend Tournament', day: 'Saturday', time: '10:00 AM' },
        ],
        amenities: ['WiFi', 'Food', 'Parking'],
        image: '/api/placeholder/300/200',
        verified: true,
      },
    ];
    setStores(mockStores);
  };

  const loadHallOfFame = async () => {
    // Mock Hall of Fame data
    const mockHallOfFame = [
      {
        id: 1,
        name: 'Elena Vasquez',
        title: 'World Champion 2023',
        achievements: [
          'World Championship Winner',
          '3x Regional Champion',
          'Hall of Fame Inductee',
        ],
        winRate: 78.5,
        totalTournaments: 156,
        favoriteArchetype: 'Control',
        quote: 'Patience and precision win games.',
        image: '/api/placeholder/100/100',
        inducted: '2023',
        country: 'Spain',
      },
      {
        id: 2,
        name: 'David Kim',
        title: 'Pro Tour Legend',
        achievements: [
          '5x Pro Tour Top 8',
          'Player of the Year 2022',
          'Innovation Award Winner',
        ],
        winRate: 82.1,
        totalTournaments: 203,
        favoriteArchetype: 'Combo',
        quote: 'Every game is a puzzle waiting to be solved.',
        image: '/api/placeholder/100/100',
        inducted: '2022',
        country: 'South Korea',
      },
      {
        id: 3,
        name: 'Marcus Thompson',
        title: 'Community Champion',
        achievements: [
          'Community Leader Award',
          'Tournament Organizer of the Year',
          '10+ Years of Service',
        ],
        winRate: 65.3,
        totalTournaments: 89,
        favoriteArchetype: 'Midrange',
        quote: 'Building community is the greatest victory.',
        image: '/api/placeholder/100/100',
        inducted: '2021',
        country: 'United States',
      },
    ];
    setHallOfFame(mockHallOfFame);
  };

  const loadCommunityStats = async () => {
    // Mock community stats
    const mockStats = {
      totalMembers: 45230,
      activeToday: 3420,
      postsToday: 156,
      eventsThisWeek: 23,
      storesNearby: stores.length,
      topContributors: [
        { name: 'Alex Chen', posts: 45, likes: 1230 },
        { name: 'Sarah Johnson', posts: 38, likes: 980 },
        { name: 'Mike Rodriguez', posts: 52, likes: 1450 },
      ],
    };
    setCommunityStats(mockStats);
  };

  const getUserLocation = async () => {
    // Mock user location
    setUserLocation({
      lat: 34.0522,
      lng: -118.2437,
      city: 'Los Angeles',
      state: 'CA',
    });
  };

  const handleLike = postId => {
    setPosts(
      posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const handleShare = postId => {
    setPosts(
      posts.map(post =>
        post.id === postId ? { ...post, shares: post.shares + 1 } : post,
      ),
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'local' && post.location) ||
      (activeFilter === 'following' && isAuthenticated);

    return matchesSearch && matchesFilter;
  });

  const getPostTypeIcon = type => {
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p>Loading community data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Unified Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Community Hub</h1>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowNewPostModal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
              >
                <span>New Post</span>
              </button>
            )}
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {communityStats.totalMembers?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {communityStats.activeToday?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {communityStats.postsToday}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {communityStats.eventsThisWeek}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stores.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search posts, players, or locations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  All Posts
                </button>
                <button
                  onClick={() => setActiveFilter('following')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeFilter === 'following'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Following
                </button>
                <button
                  onClick={() => setActiveFilter('local')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeFilter === 'local'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Local
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="text-sm text-gray-400">
                {filteredPosts.length} posts • {stores.length} stores nearby
              </div>
              <div className="text-sm text-gray-400">
                {communityStats.activeToday} active members today
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Social Feed */}
          <div className="xl:col-span-2 space-y-6">
            {/* Social Posts */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div key={post.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">{post.user.name}</span>

                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-400">
                          {post.user.rank}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-400">
                          {post.timestamp}
                        </span>
                        {getPostTypeIcon(post.type)}
                      </div>
                      {post.location && (
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          {post.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-100 mb-3">{post.content}</p>

                    {post.images && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {post.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        ))}
                      </div>
                    )}

                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-blue-400 text-sm hover:text-blue-300 cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
                        <span>{post.comments}</span>
                      </button>
                      <button
                        onClick={() => handleShare(post.id)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
                      >
                        <span>{post.shares}</span>
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-gray-300"></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Store Locator & Hall of Fame */}
          <div className="space-y-6">
            {/* Store Locator */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                Nearby Stores
              </h2>
              <div className="space-y-4">
                {stores.map(store => (
                  <div key={store.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center">
                          {store.name}
                        </h3>
                        <div className="text-sm text-gray-400 mt-1">
                          <div className="flex items-center mb-1">
                            {store.address}
                          </div>
                          <div className="flex items-center">
                            {store.distance} miles away
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-400">
                          <span className="text-sm">{store.rating}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {store.reviews} reviews
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">
                        Upcoming Events
                      </h4>
                      <div className="space-y-1">
                        {store.events.slice(0, 2).map((event, index) => (
                          <div key={index} className="text-xs text-gray-400">
                            {event.name} - {event.day} {event.time}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {store.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-600 px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-1">
                        <a
                          href={`tel:${store.phone}`}
                          className="p-1 bg-green-600 hover:bg-green-500 rounded transition-colors"
                        ></a>
                        <a
                          href={store.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                        ></a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/store-locator"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View All Stores →
                </Link>
              </div>
            </div>

            {/* Hall of Fame */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                Hall of Fame
              </h2>
              <div className="space-y-4">
                {hallOfFame.map(player => (
                  <div key={player.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{player.name}</h3>
                        <p className="text-sm text-yellow-400">
                          {player.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          Inducted {player.inducted} • {player.country}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Win Rate:</span>
                          <span className="ml-1 text-green-400">
                            {player.winRate}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Tournaments:</span>
                          <span className="ml-1">
                            {player.totalTournaments}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">
                        Achievements
                      </h4>
                      <div className="space-y-1">
                        {player.achievements
                          .slice(0, 2)
                          .map((achievement, index) => (
                            <div
                              key={index}
                              className="text-xs text-gray-400 flex items-center"
                            >
                              {achievement}
                            </div>
                          ))}
                      </div>
                    </div>

                    <blockquote className="text-sm italic text-gray-300 border-l-2 border-blue-500 pl-3">
                      "{player.quote}"
                    </blockquote>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/hall-of-fame"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View Full Hall of Fame →
                </Link>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                Top Contributors
              </h2>
              <div className="space-y-3">
                {communityStats.topContributors?.map((contributor, index) => (
                  <div
                    key={contributor.name}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{contributor.name}</div>
                      <div className="text-xs text-gray-400">
                        {contributor.posts} posts • {contributor.likes} likes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* New Post Modal */}
        {showNewPostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create New Post</h3>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                ></button>
              </div>
              <textarea
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"></button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"></button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"></button>
                </div>
                <button
                  onClick={() => {
                    // Handle post creation
                    setShowNewPostModal(false);
                    setNewPost('');
                  }}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition-colors"
                >
                  <span>Post</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedCommunity;
