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
      case 'Strategy':
        return 'bg-green-600';
      case 'Community':
        return 'bg-purple-600';
      case 'Rules':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Latest News Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Featured Image */}
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(post.type)}`}
                    >
                      {post.type}
                    </div>
                    {post.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-white">
                        Featured
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <User size={14} />
                          <span>{post.author}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{post.readTime}</span>
                        </span>
                      </div>
                      <span>{formatDate(post.date)}</span>
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
                      </div>
                      <Link
                        to={`/news/${post.id}`}
                        className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        <span>Read More</span>
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;