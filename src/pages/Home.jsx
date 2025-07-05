/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock,
  User,
  Eye,
  Heart,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  Star,
  MessageCircle,
  Share2,
  Bookmark,
  Hash,
  TrendingUp,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit3,
  Tag,
  ArrowUp,
  Coffee,
  Zap,
  Fire,
  Award,
} from 'lucide-react';

const Home = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

  // Mock blog posts data with hashtags
  const blogPosts = [
    {
      id: 1,
      title: 'New Set Release: Elemental Convergence',
      excerpt: 'Discover the powerful new mechanics and cards in our latest expansion. Elemental Convergence brings fresh strategies and exciting gameplay to KONIVRER.',
      content: 'Full article content would go here...',
      author: {
        name: 'Design Team',
        avatar: '/api/placeholder/40/40',
        role: 'Official'
      },
      date: '2024-06-15',
      readTime: '5 min read',
      category: 'releases',
      type: 'Set Release',
      image: '/api/placeholder/600/300',
      featured: true,
      views: 15420,
      likes: 890,
      comments: 156,
      shares: 89,
      hashtags: ['#newset', '#elemental', '#convergence', '#mechanics', '#strategy'],
      status: 'published'
    },
    {
      id: 2,
      title: 'Tournament Meta Analysis: June 2024',
      excerpt: 'A deep dive into the current competitive landscape. Which archetypes are dominating and what strategies are emerging in the tournament scene.',
      content: 'Full article content would go here...',
      author: {
        name: 'Pro Player Council',
        avatar: '/api/placeholder/40/40',
        role: 'Expert'
      },
      date: '2024-06-12',
      readTime: '8 min read',
      category: 'strategy',
      type: 'Analysis',
      image: '/api/placeholder/600/300',
      featured: false,
      views: 12340,
      likes: 654,
      comments: 89,
      shares: 45,
      hashtags: ['#meta', '#tournament', '#analysis', '#competitive', '#archetypes'],
      status: 'published'
    },
    {
      id: 3,
      title: 'Community Spotlight: Deck Builder Showcase',
      excerpt: "Featuring innovative deck builds from our community. See how creative players are pushing the boundaries of what's possible.",
      content: 'Full article content would go here...',
      author: {
        name: 'Community Team',
        avatar: '/api/placeholder/40/40',
        role: 'Moderator'
      },
      date: '2024-06-10',
      readTime: '6 min read',
      category: 'community',
      type: 'Spotlight',
      image: '/api/placeholder/600/300',
      featured: true,
      views: 9870,
      likes: 432,
      comments: 67,
      shares: 23,
      hashtags: ['#community', '#deckbuilding', '#showcase', '#creative', '#innovation'],
      status: 'published'
    },
    {
      id: 4,
      title: 'Rules Update: Clarifications and Changes',
      excerpt: 'Important updates to game rules and interactions. Stay informed about the latest official rulings and clarifications.',
      content: 'Full article content would go here...',
      author: {
        name: 'Rules Committee',
        avatar: '/api/placeholder/40/40',
        role: 'Official'
      },
      date: '2024-06-08',
      readTime: '4 min read',
      category: 'rules',
      type: 'Update',
      image: '/api/placeholder/600/300',
      featured: false,
      views: 7650,
      likes: 321,
      comments: 45,
      shares: 12,
      hashtags: ['#rules', '#update', '#clarification', '#official', '#gameplay'],
      status: 'published'
    },
    {
      id: 5,
      title: 'Beginner Guide: Getting Started with KONIVRER',
      excerpt: 'Everything new players need to know to start their KONIVRER journey. From basic mechanics to building your first deck.',
      content: 'Full article content would go here...',
      author: {
        name: 'Tutorial Team',
        avatar: '/api/placeholder/40/40',
        role: 'Educator'
      },
      date: '2024-06-05',
      readTime: '12 min read',
      category: 'guides',
      type: 'Tutorial',
      image: '/api/placeholder/600/300',
      featured: false,
      views: 18920,
      likes: 1245,
      comments: 234,
      shares: 156,
      hashtags: ['#beginner', '#tutorial', '#guide', '#basics', '#newplayer'],
      status: 'published'
    },
    {
      id: 6,
      title: 'Lore Deep Dive: The Ancient Convergence Wars',
      excerpt: 'Explore the rich history behind the Elemental Convergence set. Discover the epic battles that shaped the KONIVRER universe.',
      content: 'Full article content would go here...',
      author: {
        name: 'Lore Master',
        avatar: '/api/placeholder/40/40',
        role: 'Writer'
      },
      date: '2024-06-03',
      readTime: '10 min read',
      category: 'lore',
      type: 'Story',
      image: '/api/placeholder/600/300',
      featured: true,
      views: 11230,
      likes: 789,
      comments: 123,
      shares: 67,
      hashtags: ['#lore', '#story', '#convergence', '#history', '#worldbuilding'],
      status: 'published'
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Posts', icon: Grid },
    { id: 'releases', name: 'Releases', icon: Zap },
    { id: 'strategy', name: 'Strategy', icon: TrendingUp },
    { id: 'community', name: 'Community', icon: MessageCircle },
    { id: 'rules', name: 'Rules', icon: Award },
    { id: 'guides', name: 'Guides', icon: Coffee },
    { id: 'lore', name: 'Lore', icon: Fire }
  ];

  // Get all unique hashtags from posts
  const allHashtags = [...new Set(blogPosts.flatMap(post => post.hashtags))];
  const trendingHashtags = allHashtags.slice(0, 10); // Top 10 trending

  // Utility functions
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTypeColor = type => {
    switch (type) {
      case 'Set Release':
        return 'bg-blue-600';
      case 'Analysis':
        return 'bg-green-600';
      case 'Spotlight':
        return 'bg-purple-600';
      case 'Update':
        return 'bg-red-600';
      case 'Tutorial':
        return 'bg-yellow-600';
      case 'Story':
        return 'bg-indigo-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getCategoryColor = category => {
    switch (category) {
      case 'releases':
        return 'text-blue-400 bg-blue-400/10';
      case 'strategy':
        return 'text-green-400 bg-green-400/10';
      case 'community':
        return 'text-purple-400 bg-purple-400/10';
      case 'rules':
        return 'text-red-400 bg-red-400/10';
      case 'guides':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'lore':
        return 'text-indigo-400 bg-indigo-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Filter and sort posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    const matchesHashtag = !selectedHashtag || post.hashtags.includes(selectedHashtag);
    
    return matchesSearch && matchesCategory && matchesHashtag;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date) - new Date(a.date);
      case 'popular':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'comments':
        return b.comments - a.comments;
      default:
        return 0;
    }
  });

  // Event handlers
  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleBookmark = (postId) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleHashtagClick = (hashtag) => {
    setSelectedHashtag(selectedHashtag === hashtag ? '' : hashtag);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Blog Header */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-6">
                <Hash className="mr-3 text-blue-400" size={32} />
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  KONIVRER Blog
                </span>
              </div>
              <p className="text-xl text-gray-300 mb-8">
                Stay updated with the latest news, strategies, and community highlights from the KONIVRER universe
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts, authors, or hashtags..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="likes">Most Liked</option>
                <option value="comments">Most Discussed</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                <Filter size={16} />
                <span>Filters</span>
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {sortedPosts.length} of {blogPosts.length} posts
            {selectedHashtag && (
              <span className="ml-2">
                filtered by <span className="text-blue-400">{selectedHashtag}</span>
                <button
                  onClick={() => setSelectedHashtag('')}
                  className="ml-2 text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Hashtag Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 border-b border-gray-700"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-300 mb-3 block">Trending Hashtags</span>
                <div className="flex flex-wrap gap-2">
                  {trendingHashtags.map(hashtag => (
                    <button
                      key={hashtag}
                      onClick={() => handleHashtagClick(hashtag)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all ${
                        selectedHashtag === hashtag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Hash size={12} />
                      <span>{hashtag.replace('#', '')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Blog Posts */}
            <div className="xl:col-span-3">
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                  : 'space-y-6'
              }>
                <AnimatePresence>
                  {sortedPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 group ${
                        post.featured ? 'ring-2 ring-blue-500/30' : ''
                      } ${viewMode === 'list' ? 'flex' : ''}`}
                    >
                      {/* Featured Image */}
                      <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                            viewMode === 'list' ? 'h-full' : 'h-48'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Type Badge */}
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(post.type)}`}>
                          {post.type}
                        </div>
                        
                        {/* Featured Badge */}
                        {post.featured && (
                          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-white flex items-center space-x-1">
                            <Star size={12} />
                            <span>Featured</span>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                              likedPosts.has(post.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-black/30 text-white hover:bg-red-500'
                            }`}
                          >
                            <Heart size={16} />
                          </button>
                          <button
                            onClick={() => handleBookmark(post.id)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                              bookmarkedPosts.has(post.id)
                                ? 'bg-blue-500 text-white'
                                : 'bg-black/30 text-white hover:bg-blue-500'
                            }`}
                          >
                            <Bookmark size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1">
                        {/* Category */}
                        <div className="mb-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </span>
                        </div>

                        {/* Title */}
                        <Link to={`/blog/${post.id}`}>
                          <h2 className={`font-bold mb-3 line-clamp-2 hover:text-blue-400 transition-colors ${
                            viewMode === 'list' ? 'text-lg' : 'text-xl'
                          }`}>
                            {post.title}
                          </h2>
                        </Link>
                        
                        {/* Excerpt */}
                        <p className="text-gray-400 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Hashtags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.hashtags.slice(0, 3).map(hashtag => (
                            <button
                              key={hashtag}
                              onClick={() => handleHashtagClick(hashtag)}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {hashtag}
                            </button>
                          ))}
                          {post.hashtags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{post.hashtags.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Author and Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <span className="text-white font-medium">{post.author.name}</span>
                              <span className="text-gray-400 ml-2">•</span>
                              <span className="ml-2">{post.author.role}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <Clock size={12} />
                              <span>{post.readTime}</span>
                            </span>
                            <span>{formatDate(post.date)}</span>
                          </div>
                        </div>

                        {/* Stats and Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Eye size={14} />
                              <span>{post.views.toLocaleString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Heart size={14} />
                              <span>{post.likes}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MessageCircle size={14} />
                              <span>{post.comments}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Share2 size={14} />
                              <span>{post.shares}</span>
                            </span>
                          </div>
                          
                          <Link
                            to={`/blog/${post.id}`}
                            className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            <span>Read More</span>
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More Button */}
              {sortedPosts.length > 0 && (
                <div className="text-center mt-12">
                  <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium transition-colors">
                    Load More Posts
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Popular Hashtags */}
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="mr-2 text-green-400" size={20} />
                  <span className="font-semibold">Trending Hashtags</span>
                </div>
                <div className="space-y-2">
                  {trendingHashtags.slice(0, 8).map((hashtag, index) => (
                    <button
                      key={hashtag}
                      onClick={() => handleHashtagClick(hashtag)}
                      className={`flex items-center justify-between w-full p-2 rounded-lg text-sm transition-colors ${
                        selectedHashtag === hashtag
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <Hash size={14} />
                        <span>{hashtag.replace('#', '')}</span>
                      </span>
                      <span className="text-xs text-gray-400">
                        {Math.floor(Math.random() * 50) + 10}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Clock className="mr-2 text-blue-400" size={20} />
                  <span className="font-semibold">Recent Activity</span>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-400">Latest post:</span>
                    <span className="text-white ml-1">2 hours ago</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Total posts:</span>
                    <span className="text-white ml-1">{blogPosts.length}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Active hashtags:</span>
                    <span className="text-white ml-1">{allHashtags.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Plus className="mr-2 text-purple-400" size={20} />
                  <span className="font-semibold">Quick Actions</span>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Write New Post
                  </button>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Manage Drafts
                  </button>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-500 p-3 rounded-full shadow-lg transition-colors z-50"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default Home;