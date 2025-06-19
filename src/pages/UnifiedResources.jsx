import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
} from 'lucide-react';

const UnifiedResources = () => {
  const { user, isAuthenticated } = useAuth();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'lore', 'products', 'meta', 'guides'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [sortBy, setSortBy] = useState('recent');

  // Data states
  const [loreContent, setLoreContent] = useState([]);
  const [products, setProducts] = useState([]);
  const [metaAnalysis, setMetaAnalysis] = useState([]);
  const [guides, setGuides] = useState([]);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [resourceStats, setResourceStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllResourceData();
  }, []);

  const loadAllResourceData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadLoreContent(),
        loadProducts(),
        loadMetaAnalysis(),
        loadGuides(),
        loadFeaturedContent(),
        loadResourceStats(),
      ]);
    } catch (error) {
      console.error('Failed to load resource data:', error);
    } finally {
      setLoading(false);
    }
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
        type: 'expansion',
        category: 'products',
        releaseDate: '2024-07-01',
        status: 'upcoming',
        price: '$4.99',

        image: '/api/placeholder/300/400',
        cardCount: 156,
        mechanics: ['Convergence', 'Elemental Mastery', 'Fusion'],
        preorderAvailable: true,
        spoilersCount: 45,
        hypeLevel: 95,
      },
      {
        id: 2,
        name: 'Core Set 2024',
        type: 'core',
        category: 'products',
        releaseDate: '2024-01-15',
        status: 'available',
        price: '$3.99',

        image: '/api/placeholder/300/400',
        cardCount: 200,
        mechanics: ['Basic Combat', 'Resource Management', 'Deck Building'],
        preorderAvailable: false,
        spoilersCount: 200,
        hypeLevel: 78,
      },
      {
        id: 3,
        name: 'Legends of the Past',
        type: 'premium',
        category: 'products',
        releaseDate: '2024-03-20',
        status: 'available',
        price: '$9.99',

        image: '/api/placeholder/300/400',
        cardCount: 75,
        mechanics: ['Legendary', 'Alternate Art', 'Foil Treatment'],
        preorderAvailable: false,
        spoilersCount: 75,
        hypeLevel: 88,
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
      },
      {
        id: 2,
        title: 'Archetype Deep Dive: Control Blue',
        type: 'analysis',
        category: 'meta',
        author: 'Sarah Johnson',
        publishDate: '2024-06-15',
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

  const loadFeaturedContent = async () => {
    // Combine featured content from all categories
    const allContent = [
      ...loreContent,
      ...products,
      ...metaAnalysis,
      ...guides,
    ];
    const featured = allContent.filter(item => item.featured);
    setFeaturedContent(featured);
  };

  const loadResourceStats = async () => {
    // Mock resource stats
    const mockStats = {
      totalArticles: 156,
      totalViews: 245670,
      totalLikes: 18920,
      totalBookmarks: 4560,
      weeklyViews: 12450,
      popularTags: [
        { name: 'beginner', count: 45 },
        { name: 'meta', count: 38 },
        { name: 'strategy', count: 32 },
        { name: 'lore', count: 28 },
        { name: 'deck-building', count: 25 },
      ],
      topAuthors: [
        { name: 'Community Team', articles: 23, views: 89450 },
        { name: 'Alex Chen', articles: 18, views: 67890 },
        { name: 'Sarah Johnson', articles: 15, views: 54320 },
      ],
    };
    setResourceStats(mockStats);
  };

  const getAllContent = () => {
    const allContent = [
      ...loreContent,
      ...products,
      ...metaAnalysis,
      ...guides,
    ];
    return allContent.filter(item => {
      const matchesSearch =
        (item.title || item.name || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const sortedContent = getAllContent().sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return (
          new Date(b.publishDate || b.releaseDate) -
          new Date(a.publishDate || a.releaseDate)
        );
      case 'popular':
        return (b.views || b.hypeLevel || 0) - (a.views || a.hypeLevel || 0);
      case 'likes':
        return (b.likes || 0) - (a.likes || 0);
      case 'title':
        return (a.title || a.name).localeCompare(b.title || b.name);
      default:
        return 0;
    }
  });

  const getCategoryIcon = category => {
    return null;
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
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p>Loading resources...</p>
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
              <h1 className="text-4xl font-bold mb-2">Knowledge Center</h1>
              <p className="text-gray-400">
                Game lore, product information, meta analysis, and strategy
                guides
              </p>
            </div>
            {isAuthenticated && (
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors">
                  <Plus size={16} />
                  <span>Contribute</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                  <Bookmark size={16} />
                  <span>My Bookmarks</span>
                </button>
              </div>
            )}
          </div>

          {/* Resource Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Articles</p>
                  <p className="text-2xl font-bold">
                    {resourceStats.totalArticles}
                  </p>
                </div>
                <FileText className="text-blue-400" size={24} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold">
                    {resourceStats.totalViews?.toLocaleString()}
                  </p>
                </div>
                <Eye className="text-green-400" size={24} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Weekly Views</p>
                  <p className="text-2xl font-bold">
                    {resourceStats.weeklyViews?.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="text-purple-400" size={24} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Likes</p>
                  <p className="text-2xl font-bold">
                    {resourceStats.totalLikes?.toLocaleString()}
                  </p>
                </div>
                <Heart className="text-red-400" size={24} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Bookmarks</p>
                  <p className="text-2xl font-bold">
                    {resourceStats.totalBookmarks?.toLocaleString()}
                  </p>
                </div>
                <Bookmark className="text-yellow-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search articles, guides, products, and lore..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  All Content
                </button>
                <button
                  onClick={() => setActiveCategory('lore')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === 'lore'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Lore & Stories
                </button>
                <button
                  onClick={() => setActiveCategory('products')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === 'products'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveCategory('meta')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === 'meta'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Meta Analysis
                </button>
                <button
                  onClick={() => setActiveCategory('guides')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === 'guides'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Guides
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">View Mode</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
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
              <div className="text-sm text-gray-400">
                {sortedContent.length} items found
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Content Display */}
          <div className="xl:col-span-3">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedContent.map(item => (
                  <div
                    key={`${item.category}-${item.id}`}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(item.category)}
                          <span className="text-xs text-gray-400 uppercase">
                            {item.type}
                          </span>
                        </div>
                        {item.featured && (
                          <Star className="text-yellow-400" size={16} />
                        )}
                      </div>

                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {item.title || item.name}
                      </h3>

                      {/* Category-specific content */}
                      {item.category === 'products' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}
                            >
                              {item.status}
                            </span>
                            <span className="font-bold text-green-400">
                              {item.price}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {item.cardCount} cards • Release: {item.releaseDate}
                          </div>
                        </div>
                      )}

                      {item.category === 'guides' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs ${getDifficultyColor(item.difficulty)}`}
                            >
                              {item.difficulty}
                            </span>
                            <span className="text-gray-400">
                              {item.readTime}
                            </span>
                          </div>
                        </div>
                      )}

                      {item.category === 'lore' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              By {item.author}
                            </span>
                            <span className="text-gray-400">
                              {item.readTime}
                            </span>
                          </div>
                        </div>
                      )}

                      {item.category === 'meta' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              By {item.author}
                            </span>
                            <span className="text-gray-400">
                              {item.period || item.publishDate}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-3">
                          {item.views && (
                            <span className="flex items-center">
                              <Eye size={12} className="mr-1" />
                              {item.views.toLocaleString()}
                            </span>
                          )}
                          {item.likes && (
                            <span className="flex items-center">
                              <Heart size={12} className="mr-1" />
                              {item.likes}
                            </span>
                          )}
                          {item.hypeLevel && (
                            <span className="flex items-center">
                              <TrendingUp size={12} className="mr-1" />
                              {item.hypeLevel}%
                            </span>
                          )}
                        </div>
                        <button className="text-blue-400 hover:text-blue-300">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedContent.map(item => (
                  <div
                    key={`${item.category}-${item.id}`}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title || item.name}
                          className="w-24 h-16 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(item.category)}
                            <span className="text-xs text-gray-400 uppercase">
                              {item.type}
                            </span>
                            {item.featured && (
                              <Star className="text-yellow-400" size={14} />
                            )}
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-400">
                            {item.views && (
                              <span className="flex items-center">
                                <Eye size={12} className="mr-1" />
                                {item.views.toLocaleString()}
                              </span>
                            )}
                            {item.likes && (
                              <span className="flex items-center">
                                <Heart size={12} className="mr-1" />
                                {item.likes}
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="font-semibold mb-1">
                          {item.title || item.name}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            {item.author && <span>By {item.author}</span>}
                            {item.publishDate && (
                              <span>• {item.publishDate}</span>
                            )}
                            {item.readTime && <span>• {item.readTime}</span>}
                            {item.difficulty && (
                              <span
                                className={`px-2 py-1 rounded ${getDifficultyColor(item.difficulty)}`}
                              >
                                {item.difficulty}
                              </span>
                            )}
                          </div>
                          <button className="text-blue-400 hover:text-blue-300">
                            Read More →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Content */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Star className="mr-2" size={20} />
                Featured
              </h2>
              <div className="space-y-4">
                {featuredContent.slice(0, 3).map(item => (
                  <div
                    key={`featured-${item.category}-${item.id}`}
                    className="border-b border-gray-700 pb-3 last:border-b-0"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {getCategoryIcon(item.category)}
                      <span className="text-xs text-gray-400 uppercase">
                        {item.type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                      {item.title || item.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Hash className="mr-2" size={20} />
                Popular Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {resourceStats.popularTags?.map(tag => (
                  <button
                    key={tag.name}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    #{tag.name} ({tag.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Top Authors */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Users className="mr-2" size={20} />
                Top Authors
              </h2>
              <div className="space-y-3">
                {resourceStats.topAuthors?.map((author, index) => (
                  <div
                    key={author.name}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{author.name}</div>
                      <div className="text-xs text-gray-400">
                        {author.articles} articles •{' '}
                        {author.views.toLocaleString()} views
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedResources;
