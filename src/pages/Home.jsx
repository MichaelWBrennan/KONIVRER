import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AncientHero from '../components/AncientHero';
import {
  Search,
  Filter,
  Calendar,
  Star,
  Eye,
  Download,
  ExternalLink,
  Clock,
  Tag,
  User,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Hash,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Upload,
  Settings,
  X,
  MapPin,
  Phone,
  Trophy,
  TrendingUp,
  BookOpen,
  Gamepad2,
  Zap,
} from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(
    searchParams.get('filter') || 'all',
  ); // 'all', 'blog', 'community', 'lore', 'products', 'meta', 'guides'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [sortBy, setSortBy] = useState('recent');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState('');

  // Data states
  const [socialPosts, setSocialPosts] = useState([]);
  const [stores, setStores] = useState([]);
  const [hallOfFame, setHallOfFame] = useState([]);
  const [loreContent, setLoreContent] = useState([]);
  const [products, setProducts] = useState([]);
  const [metaAnalysis, setMetaAnalysis] = useState([]);
  const [guides, setGuides] = useState([]);
  const [unifiedStats, setUnifiedStats] = useState({});
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
      category: 'blog',
      type: 'Set Release',
      image: '/api/placeholder/400/250',
      featured: true,
      views: 15420,
      likes: 890,
    },
    {
      id: 2,
      title: 'Tournament Meta Analysis: June 2024',
      excerpt:
        'A deep dive into the current competitive landscape. Which archetypes are dominating and what strategies are emerging in the tournament scene.',
      author: 'Pro Player Council',
      date: '2024-06-12',
      readTime: '8 min read',
      category: 'blog',
      type: 'Strategy',
      image: '/api/placeholder/400/250',
      views: 12340,
      likes: 654,
    },
    {
      id: 3,
      title: 'Community Spotlight: Deck Builder Showcase',
      excerpt:
        "Featuring innovative deck builds from our community. See how creative players are pushing the boundaries of what's possible.",
      author: 'Community Team',
      date: '2024-06-10',
      readTime: '6 min read',
      category: 'blog',
      type: 'Community',
      image: '/api/placeholder/400/250',
      views: 9870,
      likes: 432,
    },
    {
      id: 4,
      title: 'Rules Update: Clarifications and Changes',
      excerpt:
        'Important updates to game rules and interactions. Stay informed about the latest official rulings and clarifications.',
      author: 'Rules Committee',
      date: '2024-06-08',
      readTime: '4 min read',
      category: 'blog',
      type: 'Rules',
      image: '/api/placeholder/400/250',
      views: 7650,
      likes: 321,
    },
  ];

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    // Update filter from URL params
    const filterParam = searchParams.get('filter');
    if (filterParam && filterParam !== activeFilter) {
      setActiveFilter(filterParam);
    }
  }, [searchParams]);

  const handleFilterChange = filter => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ filter });
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSocialPosts(),
        loadStores(),
        loadHallOfFame(),
        loadLoreContent(),
        loadProducts(),
        loadMetaAnalysis(),
        loadGuides(),
        loadUnifiedStats(),
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
        category: 'community',
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
        category: 'community',
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
        category: 'community',
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

  const loadLoreContent = async () => {
    // Mock lore content
    const mockLore = [
      {
        id: 1,
        title: 'The Great Convergence',
        type: 'story',
        category: 'lore',
        author: 'KONIVRER Lore Team',
        publishDate: '2024-06-15',
        readTime: '8 min read',
        excerpt:
          'The ancient powers stir as the elemental planes begin to merge. Heroes from across the realm must unite to prevent catastrophe.',
        content: 'Full story content here...',
        image: '/api/placeholder/400/250',
        tags: ['epic', 'convergence', 'elements'],
        views: 12450,
        likes: 890,
        featured: true,
      },
      {
        id: 2,
        title: 'Chronicles of the Flame Keepers',
        type: 'lore',
        category: 'lore',
        author: 'Elena Vasquez',
        publishDate: '2024-06-10',
        readTime: '12 min read',
        excerpt:
          'Deep within the volcanic peaks, the Flame Keepers guard ancient secrets that could reshape the world.',
        content: 'Full lore content here...',
        image: '/api/placeholder/400/250',
        tags: ['flame', 'keepers', 'secrets'],
        views: 8920,
        likes: 654,
        featured: false,
      },
      {
        id: 3,
        title: 'The Elemental Codex',
        type: 'reference',
        category: 'lore',
        author: 'Marcus Thompson',
        publishDate: '2024-06-05',
        readTime: '15 min read',
        excerpt:
          'A comprehensive guide to the elemental forces that shape the KONIVRER universe.',
        content: 'Full reference content here...',
        image: '/api/placeholder/400/250',
        tags: ['elements', 'codex', 'reference'],
        views: 15670,
        likes: 1230,
        featured: true,
      },
    ];
    setLoreContent(mockLore);
  };

  const loadProducts = async () => {
    // Mock product data
    const mockProducts = [
      {
        id: 1,
        name: 'Elemental Convergence',
        title: 'Elemental Convergence',
        type: 'expansion',
        category: 'products',
        releaseDate: '2024-07-01',
        publishDate: '2024-07-01',
        status: 'upcoming',
        price: '$4.99',
        excerpt:
          'The most ambitious expansion yet, featuring revolutionary Convergence mechanics and 156 new cards.',
        image: '/api/placeholder/300/400',
        cardCount: 156,
        mechanics: ['Convergence', 'Elemental Mastery', 'Fusion'],
        preorderAvailable: true,
        spoilersCount: 45,
        hypeLevel: 95,
        views: 25670,
        likes: 1890,
      },
      {
        id: 2,
        name: 'Core Set 2024',
        title: 'Core Set 2024',
        type: 'core',
        category: 'products',
        releaseDate: '2024-01-15',
        publishDate: '2024-01-15',
        status: 'available',
        price: '$3.99',
        excerpt:
          'The foundation of KONIVRER gameplay with 200 essential cards for new and veteran players.',
        image: '/api/placeholder/300/400',
        cardCount: 200,
        mechanics: ['Basic Combat', 'Resource Management', 'Deck Building'],
        preorderAvailable: false,
        spoilersCount: 200,
        hypeLevel: 78,
        views: 18920,
        likes: 1456,
      },
      {
        id: 3,
        name: 'Legends of the Past',
        title: 'Legends of the Past',
        type: 'premium',
        category: 'products',
        releaseDate: '2024-03-20',
        publishDate: '2024-03-20',
        status: 'available',
        price: '$9.99',
        excerpt:
          'Premium collection featuring legendary cards with alternate art and foil treatments.',
        image: '/api/placeholder/300/400',
        cardCount: 75,
        mechanics: ['Legendary', 'Alternate Art', 'Foil Treatment'],
        preorderAvailable: false,
        spoilersCount: 75,
        hypeLevel: 88,
        views: 12340,
        likes: 987,
      },
    ];
    setProducts(mockProducts);
  };

  const loadMetaAnalysis = async () => {
    // Mock meta analysis data
    const mockMeta = [
      {
        id: 1,
        title: 'Weekly Meta Report #24',
        type: 'meta-report',
        category: 'meta',
        author: 'Pro Analytics Team',
        publishDate: '2024-06-18',
        readTime: '10 min read',
        period: 'Week of June 10-16, 2024',
        excerpt:
          'Aggro Red continues to dominate the meta while Control Blue sees a resurgence in tournament play.',
        topDecks: [
          { name: 'Aggro Red', percentage: 28.5, change: '+2.1%' },
          { name: 'Control Blue', percentage: 22.3, change: '+4.2%' },
          { name: 'Midrange Green', percentage: 18.7, change: '-1.5%' },
          { name: 'Combo Artifacts', percentage: 15.2, change: '-0.8%' },
          { name: 'Other', percentage: 15.3, change: '-3.9%' },
        ],
        keyInsights: [
          "Control Blue's rise due to new sideboard tech",
          'Aggro Red adapting to counter meta shifts',
          'Midrange strategies struggling against faster decks',
        ],
        tournamentData: {
          totalMatches: 15420,
          totalPlayers: 3240,
          averageGameLength: '12.5 minutes',
        },
        featured: true,
        views: 18920,
        likes: 1456,
        image: '/api/placeholder/400/250',
      },
      {
        id: 2,
        title: 'Archetype Deep Dive: Control Blue',
        type: 'analysis',
        category: 'meta',
        author: 'Sarah Johnson',
        publishDate: '2024-06-15',
        readTime: '15 min read',
        excerpt:
          'An in-depth look at the resurgent Control Blue archetype and its impact on the current meta.',
        winRates: {
          overall: 58.2,
          vsAggro: 45.3,
          vsControl: 62.1,
          vsMidrange: 71.4,
          vsCombo: 52.8,
        },
        popularCards: [
          { name: 'Counterspell', inclusion: 95.2 },
          { name: 'Card Draw Engine', inclusion: 88.7 },
          { name: 'Board Wipe', inclusion: 82.3 },
        ],
        featured: false,
        views: 12340,
        likes: 987,
        image: '/api/placeholder/400/250',
      },
    ];
    setMetaAnalysis(mockMeta);
  };

  const loadGuides = async () => {
    // Mock guide data
    const mockGuides = [
      {
        id: 1,
        title: "Beginner's Guide to KONIVRER",
        type: 'guide',
        category: 'guides',
        author: 'Community Team',
        publishDate: '2024-06-01',
        difficulty: 'Beginner',
        readTime: '20 min read',
        excerpt:
          'Everything you need to know to start your KONIVRER journey, from basic rules to your first deck.',
        sections: [
          'Game Basics',
          'Card Types',
          'Building Your First Deck',
          'Basic Strategies',
          'Common Mistakes',
        ],
        image: '/api/placeholder/400/250',
        views: 25670,
        likes: 1890,
        bookmarks: 456,
        featured: true,
      },
      {
        id: 2,
        title: 'Advanced Deck Building Strategies',
        type: 'guide',
        category: 'guides',
        author: 'Alex Chen',
        publishDate: '2024-05-28',
        difficulty: 'Advanced',
        readTime: '35 min read',
        excerpt:
          'Master the art of deck construction with advanced techniques used by professional players.',
        sections: [
          'Mana Curve Optimization',
          'Synergy Identification',
          'Sideboard Construction',
          'Meta Adaptation',
          'Testing Methodology',
        ],
        image: '/api/placeholder/400/250',
        views: 18920,
        likes: 1456,
        bookmarks: 789,
        featured: false,
      },
      {
        id: 3,
        title: 'Tournament Preparation Checklist',
        type: 'guide',
        category: 'guides',
        author: 'Mike Rodriguez',
        publishDate: '2024-05-25',
        difficulty: 'Intermediate',
        readTime: '15 min read',
        excerpt:
          'Prepare for competitive play with this comprehensive tournament preparation guide.',
        sections: [
          'Deck Selection',
          'Practice Routine',
          'Mental Preparation',
          'Tournament Day Tips',
          'Post-Tournament Analysis',
        ],
        image: '/api/placeholder/400/250',
        views: 12340,
        likes: 987,
        bookmarks: 234,
        featured: false,
      },
    ];
    setGuides(mockGuides);
  };

  const loadUnifiedStats = async () => {
    // Mock unified stats combining community and resources
    const mockStats = {
      // Community stats
      totalMembers: 45230,
      activeToday: 3420,
      postsToday: 156,
      eventsThisWeek: 23,
      storesNearby: 2,

      // Resource stats
      totalArticles: 156,
      totalViews: 245670,
      totalLikes: 18920,
      totalBookmarks: 4560,
      weeklyViews: 12450,

      // Combined stats
      totalContent: 312, // articles + posts
      engagementRate: 78.5,

      topContributors: [
        { name: 'Alex Chen', posts: 45, likes: 1230 },
        { name: 'Sarah Johnson', posts: 38, likes: 980 },
        { name: 'Mike Rodriguez', posts: 52, likes: 1450 },
      ],
      popularTags: [
        { name: 'beginner', count: 45 },
        { name: 'meta', count: 38 },
        { name: 'strategy', count: 32 },
        { name: 'lore', count: 28 },
        { name: 'deck-building', count: 25 },
      ],
    };
    setUnifiedStats(mockStats);
  };

  const getAllContent = () => {
    const allContent = [
      ...blogPosts,
      ...socialPosts,
      ...loreContent,
      ...products,
      ...metaAnalysis,
      ...guides,
    ];

    return allContent.filter(item => {
      const matchesSearch =
        (item.title || item.name || item.content || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.excerpt || item.description || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.author || item.user?.name || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeFilter === 'all' || item.category === activeFilter;

      return matchesSearch && matchesCategory;
    });
  };

  const sortedContent = getAllContent().sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return (
          new Date(b.publishDate || b.releaseDate || b.timestamp || b.date) -
          new Date(a.publishDate || a.releaseDate || a.timestamp || a.date)
        );
      case 'popular':
        return (
          (b.views || b.likes || b.hypeLevel || 0) -
          (a.views || a.likes || a.hypeLevel || 0)
        );
      case 'likes':
        return (b.likes || 0) - (a.likes || 0);
      case 'title':
        return (a.title || a.name || a.content || '').localeCompare(
          b.title || b.name || b.content || '',
        );
      default:
        return 0;
    }
  });

  const handleLike = (postId, category) => {
    if (category === 'community') {
      setSocialPosts(
        socialPosts.map(post =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post,
        ),
      );
    }
    // Add similar logic for other categories if needed
  };

  const handleShare = (postId, category) => {
    if (category === 'community') {
      setSocialPosts(
        socialPosts.map(post =>
          post.id === postId ? { ...post, shares: post.shares + 1 } : post,
        ),
      );
    }
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
      lore: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      products: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      meta: 'bg-red-500/20 text-red-300 border-red-500/30',
      guides: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    return (
      colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    );
  };

  const getStatusColor = status => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-600';
      case 'available':
        return 'bg-green-600';
      case 'discontinued':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-600';
      case 'Intermediate':
        return 'bg-yellow-600';
      case 'Advanced':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

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
    <div className="min-h-screen">
      
      {/* Ancient Hero Section */}
      <AncientHero />

      {/* Search and Filters */}
      <section className="py-8 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts, news, lore, guides, or community content..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange('all')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    All Content
                  </button>
                  <button
                    onClick={() => handleFilterChange('blog')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeFilter === 'blog'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <BookOpen className="inline w-4 h-4 mr-1" />
                    News & Articles
                  </button>
                  <button
                    onClick={() => handleFilterChange('community')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeFilter === 'community'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <MessageCircle className="inline w-4 h-4 mr-1" />
                    Community Posts
                  </button>
                  <button
                    onClick={() => handleFilterChange('lore')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeFilter === 'lore'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Zap className="inline w-4 h-4 mr-1" />
                    Lore & Stories
                  </button>
                  <button
                    onClick={() => handleFilterChange('products')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeFilter === 'products'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Gamepad2 className="inline w-4 h-4 mr-1" />
                    Products
                  </button>
                  <button
                    onClick={() => handleFilterChange('meta')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeFilter === 'meta'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    Meta Analysis
                  </button>
                  <button
                    onClick={() => handleFilterChange('guides')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeFilter === 'guides'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Star className="inline w-4 h-4 mr-1" />
                    Guides
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">
                    {sortedContent.length} total items
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid' ? 'bg-blue-600' : 'bg-gray-700'
                      }`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list' ? 'bg-blue-600' : 'bg-gray-700'
                      }`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="likes">Most Liked</option>
                    <option value="title">Alphabetical</option>
                  </select>
                  {isAuthenticated && (
                    <button
                      onClick={() => setShowNewPostModal(true)}
                      className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors text-sm flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Create</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content Feed */}
            <div className="xl:col-span-3">
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'space-y-4'
                }
              >
                {sortedContent.map((item, index) => (
                  <motion.div
                    key={`${item.category}-${item.id}`}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Content rendering based on category */}
                    {item.category === 'community' ? (
                      // Social Post
                      <div className="p-6">
                        <div className="flex items-start space-x-3 mb-4">
                          <img
                            src={item.user.avatar}
                            alt={item.user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">
                                {item.user.name}
                              </h3>
                              {item.user.verified && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                              <span className="text-sm text-blue-400">
                                {item.user.rank}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">
                              {item.timestamp}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">{item.content}</p>
                        {item.images && (
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {item.images.map((image, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt=""
                                className="rounded-lg w-full h-32 object-cover"
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleLike(item.id, 'community')}
                              className="flex items-center space-x-1 hover:text-red-400"
                            >
                              <Heart size={16} />
                              <span>{item.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-blue-400">
                              <MessageCircle size={16} />
                              <span>{item.comments}</span>
                            </button>
                            <button
                              onClick={() => handleShare(item.id, 'community')}
                              className="flex items-center space-x-1 hover:text-green-400"
                            >
                              <Share2 size={16} />
                              <span>{item.shares}</span>
                            </button>
                          </div>
                          {item.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin size={14} />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : item.category === 'products' ? (
                      // Product Card
                      <div>
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                          />
                          <div
                            className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}
                          >
                            {item.status}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold">{item.name}</h3>
                            <span className="text-lg font-bold text-green-400">
                              {item.price}
                            </span>
                          </div>
                          <p className="text-gray-400 mb-4">{item.excerpt}</p>
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                            <span>{item.cardCount} cards</span>
                            <span>Release: {formatDate(item.releaseDate)}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.mechanics.map((mechanic, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs"
                              >
                                {mechanic}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Eye size={14} />
                                <span>{item.views?.toLocaleString()}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Heart size={14} />
                                <span>{item.likes}</span>
                              </span>
                            </div>
                            {item.preorderAvailable && (
                              <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm transition-colors">
                                Pre-order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : item.category === 'guides' ? (
                      // Guide Card
                      <div>
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          <div
                            className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(item.difficulty)}`}
                          >
                            {item.difficulty}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 mb-4">{item.excerpt}</p>
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                            <span>By {item.author}</span>
                            <span>{item.readTime}</span>
                          </div>
                          {item.sections && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-400 mb-2">
                                Sections:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {item.sections
                                  .slice(0, 3)
                                  .map((section, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                                    >
                                      {section}
                                    </span>
                                  ))}
                                {item.sections.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                                    +{item.sections.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Eye size={14} />
                                <span>{item.views?.toLocaleString()}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Heart size={14} />
                                <span>{item.likes}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Bookmark size={14} />
                                <span>{item.bookmarks}</span>
                              </span>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm transition-colors">
                              Read Guide
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Default Card (blog, lore, meta)
                      <div>
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          {item.featured && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-600 rounded text-xs font-semibold">
                              Featured
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`px-2 py-1 rounded text-xs border ${getCategoryColor(item.type || item.category)}`}
                            >
                              {item.type || item.category}
                            </span>
                            <span className="text-sm text-gray-400">
                              {formatDate(item.publishDate || item.date)}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 mb-4">{item.excerpt}</p>
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                            <span>By {item.author}</span>
                            <span>{item.readTime}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Eye size={14} />
                                <span>{item.views?.toLocaleString()}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Heart size={14} />
                                <span>{item.likes}</span>
                              </span>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm transition-colors">
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {sortedContent.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">
                    No content found matching your search.
                  </p>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Popular Tags */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {unifiedStats.popularTags?.map((tag, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors"
                    >
                      #{tag.name} ({tag.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  {unifiedStats.topContributors?.map((contributor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{contributor.name}</p>
                        <p className="text-sm text-gray-400">
                          {contributor.posts} posts
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-blue-400">
                          {contributor.likes} likes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hall of Fame */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Trophy className="mr-2" size={20} />
                  Hall of Fame
                </h3>
                <div className="space-y-4">
                  {hallOfFame.slice(0, 2).map((player, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-gray-400">{player.title}</p>
                        <p className="text-xs text-blue-400">
                          {player.winRate}% win rate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/hall-of-fame"
                  className="block mt-4 text-center text-blue-400 hover:text-blue-300 text-sm"
                >
                  View All Champions
                </Link>
              </div>

              {/* Local Stores */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="mr-2" size={20} />
                  Local Stores
                </h3>
                <div className="space-y-4">
                  {stores.slice(0, 2).map((store, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-700 pb-4 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{store.name}</h4>
                        <div className="flex items-center text-yellow-400">
                          <Star size={14} className="mr-1" />
                          <span className="text-sm">{store.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {store.address}
                      </p>
                      <p className="text-xs text-blue-400">
                        {store.distance} miles away
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/stores"
                  className="block mt-4 text-center text-blue-400 hover:text-blue-300 text-sm"
                >
                  Find More Stores
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
