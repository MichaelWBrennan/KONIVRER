import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'blog', 'community'
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState('');

  // Data states
  const [socialPosts, setSocialPosts] = useState([]);
  const [stores, setStores] = useState([]);
  const [hallOfFame, setHallOfFame] = useState([]);
  const [communityStats, setCommunityStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'New Set Release: Elemental Convergence',
      excerpt:
        'Discover the powerful new mechanics and cards in our latest expansion. Elemental Convergence brings fresh strategies and exciting gameplay to KONIVRER.',
      author: 'Design Team',
      date: '2024-06-15',
      readTime: '5 min read',
      category: 'Set Release',
      image: '/api/placeholder/400/250',
      featured: true,
    },
    {
      id: 2,
      title: 'Tournament Meta Analysis: June 2024',
      excerpt:
        'A deep dive into the current competitive landscape. Which archetypes are dominating and what strategies are emerging in the tournament scene.',
      author: 'Pro Player Council',
      date: '2024-06-12',
      readTime: '8 min read',
      category: 'Strategy',
      image: '/api/placeholder/400/250',
    },
    {
      id: 3,
      title: 'Community Spotlight: Deck Builder Showcase',
      excerpt:
        "Featuring innovative deck builds from our community. See how creative players are pushing the boundaries of what's possible.",
      author: 'Community Team',
      date: '2024-06-10',
      readTime: '6 min read',
      category: 'Community',
      image: '/api/placeholder/400/250',
    },
    {
      id: 4,
      title: 'Rules Update: Clarifications and Changes',
      excerpt:
        'Important updates to game rules and interactions. Stay informed about the latest official rulings and clarifications.',
      author: 'Rules Committee',
      date: '2024-06-08',
      readTime: '4 min read',
      category: 'Rules',
      image: '/api/placeholder/400/250',
    },
    {
      id: 5,
      title: 'Behind the Scenes: Art and Lore Development',
      excerpt:
        'Get an exclusive look at how we create the stunning artwork and rich lore that brings KONIVRER to life.',
      author: 'Creative Team',
      date: '2024-06-05',
      readTime: '7 min read',
      category: 'Development',
      image: '/api/placeholder/400/250',
    },
    {
      id: 6,
      title: 'Player Interview: World Champion Insights',
      excerpt:
        'An in-depth conversation with our reigning world champion about strategy, preparation, and the future of competitive play.',
      author: 'Editorial Team',
      date: '2024-06-03',
      readTime: '10 min read',
      category: 'Interview',
      image: '/api/placeholder/400/250',
    },
  ];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSocialPosts(),
        loadStores(),
        loadHallOfFame(),
        loadCommunityStats(),
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
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
    setSocialPosts(mockPosts);
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
      storesNearby: 2,
      topContributors: [
        { name: 'Alex Chen', posts: 45, likes: 1230 },
        { name: 'Sarah Johnson', posts: 38, likes: 980 },
        { name: 'Mike Rodriguez', posts: 52, likes: 1450 },
      ],
    };
    setCommunityStats(mockStats);
  };

  const handleLike = postId => {
    setSocialPosts(
      socialPosts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const handleShare = postId => {
    setSocialPosts(
      socialPosts.map(post =>
        post.id === postId ? { ...post, shares: post.shares + 1 } : post,
      ),
    );
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = category => {
    const colors = {
      'Set Release': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      Strategy: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      Community: 'bg-green-500/20 text-green-300 border-green-500/30',
      Rules: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      Development: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      Interview: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    };
    return (
      colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    );
  };

  // Filtering logic
  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || activeFilter === 'blog';
    
    return matchesSearch && matchesFilter;
  });

  const filteredSocialPosts = socialPosts.filter(post => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === 'all' || activeFilter === 'community';

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading KONIVRER Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">


      {/* Search and Filters */}
      <section className="py-8 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search posts, news, or community content..."
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
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    All Content
                  </button>
                  <button
                    onClick={() => setActiveFilter('blog')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeFilter === 'blog'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    News & Articles
                  </button>
                  <button
                    onClick={() => setActiveFilter('community')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeFilter === 'community'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Community Posts
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="text-sm text-gray-400 mb-2">
                  {filteredBlogPosts.length + filteredSocialPosts.length} total posts
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowNewPostModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Create Post
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Main Content Feed */}
            <div className="xl:col-span-2 space-y-6">
          {/* Featured Post */}
          {blogPosts
            .filter(post => post.featured)
            .map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-16"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 lg:h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                          FEATURED
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}
                        >
                          {post.category}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold mb-4 text-white hover:text-blue-400 transition-colors cursor-pointer">
                        {post.title}
                      </h2>
                      <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">
                              {post.author}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {formatDate(post.date)}
                            </p>
                          </div>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}

          {/* Regular Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts
              .filter(post => !post.featured)
              .map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}
                        >
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-400 text-sm">
                          {post.readTime}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400 text-sm">
                          {formatDate(post.date)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <span className="text-gray-400 text-sm">
                            {post.author}
                          </span>
                        </div>
                        <span className="text-blue-400 group-hover:text-blue-300 text-sm font-medium transition-colors">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
          </div>

          {/* Load More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:transform hover:scale-105">
              Load More Posts
            </button>
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Community
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                Hub
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Connect with players, find local stores, and celebrate our champions
            </p>
          </motion.div>



          {/* Main Community Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Recent Community Posts */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
                  <Link
                    to="/social"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View All →
                  </Link>
                </div>
                
                <div className="space-y-6">
                  {socialPosts.slice(0, 3).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-3 mb-4">
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-white">{post.user.name}</span>
                            {post.user.verified && (
                              <span className="text-blue-400 text-xs">✓</span>
                            )}
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-400">{post.user.rank}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-400">{post.timestamp}</span>
                          </div>
                          {post.location && (
                            <div className="text-sm text-gray-400 mb-2">📍 {post.location}</div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{post.content}</p>

                      {post.images && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {post.images.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image}
                              alt={`Post image ${imgIndex + 1}`}
                              className="rounded-lg w-full h-32 object-cover"
                            />
                          ))}
                        </div>
                      )}

                      {post.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-blue-400 text-sm hover:text-blue-300 cursor-pointer"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center space-x-6 pt-3 border-t border-gray-700">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <span>❤️</span>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
                          <span>💬</span>
                          <span>{post.comments}</span>
                        </button>
                        <button
                          onClick={() => handleShare(post.id)}
                          className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
                        >
                          <span>🔄</span>
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Store Locator & Hall of Fame */}
            <div className="space-y-8">
              {/* Nearby Stores */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Nearby Stores</h3>
                  <Link
                    to="/store-locator"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View All →
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {stores.slice(0, 2).map((store, index) => (
                    <motion.div
                      key={store.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white flex items-center">
                            {store.name}
                            {store.verified && (
                              <span className="text-green-400 text-xs ml-1">✓</span>
                            )}
                          </h4>
                          <div className="text-sm text-gray-400 mt-1">
                            <div className="mb-1">📍 {store.address}</div>
                            <div>📏 {store.distance} miles away</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-yellow-400">
                            <span>⭐</span>
                            <span className="text-sm ml-1">{store.rating}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {store.reviews} reviews
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-300 mb-1">
                          Upcoming Events
                        </h5>
                        <div className="space-y-1">
                          {store.events.slice(0, 2).map((event, eventIndex) => (
                            <div key={eventIndex} className="text-xs text-gray-400">
                              🎮 {event.name} - {event.day} {event.time}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          {store.amenities?.slice(0, 3).map((amenity, amenityIndex) => (
                            <span
                              key={amenityIndex}
                              className="text-xs bg-gray-600 px-2 py-1 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-green-400 hover:text-green-300 text-sm">
                            📞
                          </button>
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            🌐
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Hall of Fame */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Hall of Fame</h3>
                  <Link
                    to="/hall-of-fame"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View All →
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {hallOfFame.slice(0, 2).map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors"
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-12 h-12 rounded-full border-2 border-yellow-400"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{player.name}</h4>
                          <p className="text-sm text-yellow-400">{player.title}</p>
                          <p className="text-xs text-gray-400">
                            🏆 Inducted {player.inducted} • 🌍 {player.country}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-gray-400">Win Rate:</span>
                          <span className="ml-1 text-green-400 font-semibold">
                            {player.winRate}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Tournaments:</span>
                          <span className="ml-1 text-white font-semibold">
                            {player.totalTournaments}
                          </span>
                        </div>
                      </div>

                      {player.quote && (
                        <blockquote className="text-sm italic text-gray-300 border-l-2 border-yellow-400 pl-3">
                          "{player.quote}"
                        </blockquote>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Top Contributors */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <h3 className="text-xl font-bold text-white mb-6">Top Contributors</h3>
                <div className="space-y-3">
                  {communityStats.topContributors?.map((contributor, index) => (
                    <motion.div
                      key={contributor.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{contributor.name}</div>
                        <div className="text-xs text-gray-400">
                          📝 {contributor.posts} posts • ❤️ {contributor.likes} likes
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mt-12"
          >
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">Join Our Community</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Connect with thousands of KONIVRER players worldwide. Share strategies, find local events, and become part of our growing community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/social"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:transform hover:scale-105"
                >
                  Join Community
                </Link>
                <Link
                  to="/tournaments"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:transform hover:scale-105"
                >
                  Find Events
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { Home };
export default Home;
