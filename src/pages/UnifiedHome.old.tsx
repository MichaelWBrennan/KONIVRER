import React from 'react';
/**
 * KONIVRER Unified Home Page
 * 
 * A unified home page component that combines functionality from:
 * - Home
 * - Home_backup
 * - Home_simple
 * - MobileHome
 * - MobileHomePage
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Users,
  Package,
  Settings,
  Award,
  Zap,
  Shield,
  Sword,
  Gift,
  Star,
  Calendar,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Clock,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  Info,
  Search,
  Filter,
  Grid,
  List,
  Heart,
  MessageSquare,
  Eye,
  Calendar as CalendarIcon,
  Tag,
  ExternalLink,
  Home,
  Layers,
  Book,
  HelpCircle,
  BarChart2,
  Smartphone
} from 'lucide-react';

// Import hooks
import { useMediaQuery } from '../hooks/useMediaQuery';
import UnifiedLayout from '../components/UnifiedLayout';

interface UnifiedHomeProps {
  variant?: 'standard' | 'simple' | 'mobile' | 'golden';
}

const UnifiedHome: React.FC<UnifiedHomeProps> = ({ variant = 'standard' }) => {
  // Detect if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const actualVariant = variant === 'standard' && isMobile ? 'mobile' : variant;
  
  // Common state
  const [showMenu, setShowMenu] = useState(false);
  const [dailyRewardsClaimed, setDailyRewardsClaimed] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  
  // Navigation
  const navigate = useNavigate();
  
  // Mock game data
  const playerLevel = 42;
  const playerName = "KonivrerMaster";
  const playerGold = 12500;
  const playerGems = 3200;
  const playerWildcards = {
    common: 24,
    uncommon: 18,
    rare: 12,
    mythic: 6
  };
  
  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'New Set Release: Elemental Convergence',
      excerpt: 'Discover the powerful new mechanics and cards in our latest expansion. Elemental Convergence brings fresh strategies and exciting gameplay to KONIVRER.',
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
      comments: 156
    },
    {
      id: 2,
      title: 'Tournament Meta Analysis: June 2024',
      excerpt: 'A deep dive into the current competitive landscape. Which archetypes are dominating and what strategies are emerging in the tournament scene.',
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
      comments: 89
    },
    {
      id: 3,
      title: 'Community Spotlight: Deck Builder Showcase',
      excerpt: "Featuring innovative deck builds from our community. See how creative players are pushing the boundaries of what's possible.",
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
      comments: 67
    }
  ];
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'releases', name: 'Releases' },
    { id: 'strategy', name: 'Strategy' },
    { id: 'community', name: 'Community' },
    { id: 'rules', name: 'Rules' },
    { id: 'guides', name: 'Guides' },
    { id: 'lore', name: 'Lore' }
  ];
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Filter and sort posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
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
  
  // Mock featured events
  const featuredEvents = [
    {
      id: 1,
      name: "Elemental Convergence Draft",
      type: "Limited",
      format: "Draft",
      entryFee: { gold: 5000, gems: 750 },
      rewards: "Up to 6 packs + gems",
      endDate: "2 days",
      image: "/api/placeholder/300/150"
    },
    {
      id: 2,
      name: "Regulation Standard",
      type: "Constructed",
      format: "Standard",
      entryFee: { gold: 500, gems: 100 },
      rewards: "Daily rewards",
      endDate: "Season end",
      image: "/api/placeholder/300/150"
    },
    {
      id: 3,
      name: "Weekend Challenge",
      type: "Constructed",
      format: "Special",
      entryFee: { gold: 2000, gems: 400 },
      rewards: "Exclusive card styles",
      endDate: "1 day",
      image: "/api/placeholder/300/150"
    }
  ];
  
  // Mock daily quests
  const dailyQuests = [
    {
      id: 1,
      description: "Win 3 games with a Fire deck",
      progress: 2,
      total: 3,
      reward: { gold: 500 }
    },
    {
      id: 2,
      description: "Play 20 Water cards",
      progress: 12,
      total: 20,
      reward: { gold: 750 }
    }
  ];
  
  const handleClaimDailyRewards = () => {
    setDailyRewardsClaimed(true);
  };
  
  // Render mobile version
  const renderMobileHome = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* Mobile Header */}
        <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 py-3 px-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              KONIVRER
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="relative p-2 rounded-full hover:bg-gray-700">
                <Bell size={18} />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              <button 
                className="p-2 rounded-full hover:bg-gray-700"
                onClick={() => setShowMenu(!showMenu)}
              >
                {showMenu ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </header>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute right-0 top-0 h-full w-3/4 bg-gray-800 p-4"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                      <User size={16} />
                    </div>
                    <div>
                      <div>{playerName}</div>
                      <div className="text-xs text-gray-400">Lvl {playerLevel}</div>
                    </div>
                  </div>
                  <button 
                    className="p-2 rounded-full hover:bg-gray-700"
                    onClick={() => setShowMenu(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="flex justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-yellow-500 mr-2"></div>
                    <span>{playerGold.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-purple-500 mr-2"></div>
                    <span>{playerGems.toLocaleString()}</span>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <Link to="/play" className="flex items-center space-x-3 p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
                    <Play size={18} />
                    <span>Play</span>
                  </Link>
                  
                  <Link to="/cards" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <Package size={18} />
                    <span>Cards</span>
                  </Link>
                  
                  <Link to="/decks" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <Layers size={18} />
                    <span>Decks</span>
                  </Link>
                  
                  <Link to="/events" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <Calendar size={18} />
                    <span>Events</span>
                  </Link>
                  
                  <Link to="/profile" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  
                  <Link to="/rules" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <Book size={18} />
                    <span>Rules</span>
                  </Link>
                  
                  <Link to="/store" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <DollarSign size={18} />
                    <span>Store</span>
                  </Link>
                  
                  <div className="h-px bg-gray-700 my-2"></div>
                  
                  <Link to="/settings" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  
                  <Link to="/help" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <HelpCircle size={18} />
                    <span>Help</span>
                  </Link>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <div className="p-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              className="bg-blue-600 hover:bg-blue-500 rounded-xl p-4 flex flex-col items-center justify-center transition-colors"
              onClick={() => navigate('/play')}
            >
              <Play size={24} className="mb-2" />
              <span className="font-medium">Play</span>
            </button>
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-xl p-4 flex flex-col items-center justify-center transition-colors"
              onClick={() => navigate('/decks')}
            >
              <Layers size={24} className="mb-2" />
              <span>Decks</span>
            </button>
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-xl p-4 flex flex-col items-center justify-center transition-colors"
              onClick={() => navigate('/cards')}
            >
              <Package size={24} className="mb-2" />
              <span>Cards</span>
            </button>
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-xl p-4 flex flex-col items-center justify-center transition-colors"
              onClick={() => navigate('/events')}
            >
              <Calendar size={24} className="mb-2" />
              <span>Events</span>
            </button>
          </div>
          
          {/* Daily Quests */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Daily Quests</h2>
            <div className="space-y-3">
              {dailyQuests.map(quest => (
                <div key={quest.id} className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm">{quest.description}</p>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 mr-1"></div>
                      <span className="text-sm">{quest.reward.gold}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(quest.progress / quest.total) * 100}%` }}></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {quest.progress}/{quest.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Featured Events */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Featured Events</h2>
              <Link to="/events" className="text-sm text-blue-400 flex items-center">
                <span>View All</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-3">
              {featuredEvents.slice(0, 2).map(event => (
                <div key={event.id} className="bg-gray-800/70 backdrop-blur-sm rounded-lg overflow-hidden">
                  <div className="h-24 bg-gray-700 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-medium">{event.name}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">{event.type} - {event.format}</div>
                      <div className="text-xs text-gray-400">Ends in {event.endDate}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-1"></div>
                        <span className="text-sm">{event.entryFee.gold}</span>
                      </div>
                      <div className="text-xs">{event.rewards}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Latest News */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Latest News</h2>
              <Link to="/news" className="text-sm text-blue-400 flex items-center">
                <span>View All</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {sortedPosts.slice(0, 3).map(post => (
                <div key={post.id} className="bg-gray-800/70 backdrop-blur-sm rounded-lg overflow-hidden">
                  <div className="h-32 bg-gray-700 relative">
                    <div className="absolute top-2 left-2 bg-blue-600 text-xs px-2 py-1 rounded-full">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-2">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div>{post.author.name}</div>
                      <div>{formatDate(post.date)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render simple version
  const renderSimpleHome = () => {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Simple Header */}
        <header className="bg-gray-800 py-4 px-6 border-b border-gray-700">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold">KONIVRER</div>
            
            <div className="flex items-center space-x-4">
              <Link to="/cards" className="hover:text-blue-400">Cards</Link>
              <Link to="/decks" className="hover:text-blue-400">Decks</Link>
              <Link to="/rules" className="hover:text-blue-400">Rules</Link>
              <Link to="/login" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">Login</Link>
            </div>
          </div>
        </header>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to KONIVRER</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              The ultimate deck building and card database for the KONIVRER trading card game.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/play" className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium text-lg transition-colors">
                Play Now
              </Link>
              <Link to="/cards" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium text-lg transition-colors">
                Browse Cards
              </Link>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-16 bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-700 p-6 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Package size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Card Database</h3>
                <p className="text-gray-300">
                  Browse and search through all KONIVRER cards with advanced filtering options.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Deck Builder</h3>
                <p className="text-gray-300">
                  Create, save, and share your deck builds with the community.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Play size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Play Online</h3>
                <p className="text-gray-300">
                  Test your decks against other players or AI opponents.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Latest News Section */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Latest News</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sortedPosts.slice(0, 3).map(post => (
                <div key={post.id} className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="h-48 bg-gray-700"></div>
                  <div className="p-6">
                    <div className="text-sm text-blue-400 mb-2">{post.category.toUpperCase()}</div>
                    <h3 className="text-xl font-medium mb-2">{post.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div>{post.author.name}</div>
                      <div>{formatDate(post.date)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700 py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-6 md:mb-0">
                <div className="text-2xl font-bold mb-2">KONIVRER</div>
                <p className="text-gray-400 max-w-md">
                  The ultimate deck building and card database for the KONIVRER trading card game.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-medium mb-4">Resources</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link to="/cards" className="hover:text-white">Cards</Link></li>
                    <li><Link to="/decks" className="hover:text-white">Decks</Link></li>
                    <li><Link to="/rules" className="hover:text-white">Rules</Link></li>
                    <li><Link to="/guides" className="hover:text-white">Guides</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-4">Community</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">Forums</a></li>
                    <li><a href="#" className="hover:text-white">Discord</a></li>
                    <li><a href="#" className="hover:text-white">Twitter</a></li>
                    <li><a href="#" className="hover:text-white">YouTube</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-4">Legal</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
                    <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                    <li><Link to="/cookies" className="hover:text-white">Cookies</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 KONIVRER Deck Database. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };
  
  // Render standard version
  const renderStandardHome = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* Top Navigation Bar */}
        <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 py-2 px-4">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="mr-4 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                KONIVRER
              </div>
            </div>
            
            {/* Player Info */}
            <div className="flex items-center space-x-6">
              {/* Currency */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-yellow-500 mr-2"></div>
                  <span>{playerGold.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-purple-500 mr-2"></div>
                  <span>{playerGems.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Wildcards */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-gray-400 mr-1"></div>
                  <span className="text-sm">{playerWildcards.common}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-400 mr-1"></div>
                  <span className="text-sm">{playerWildcards.uncommon}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 mr-1"></div>
                  <span className="text-sm">{playerWildcards.rare}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-400 mr-1"></div>
                  <span className="text-sm">{playerWildcards.mythic}</span>
                </div>
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-700">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              {/* Profile */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                  <User size={16} />
                </div>
                <span className="hidden md:inline">{playerName}</span>
                <span className="ml-2 text-xs text-gray-400">Lvl {playerLevel}</span>
              </div>
              
              {/* Menu Button */}
              <button 
                className="p-2 rounded-full hover:bg-gray-700"
                onClick={() => setShowMenu(!showMenu)}
              >
                {showMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
          {/* Left Navigation */}
          <div className="w-full md:w-64 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 h-fit">
            <nav className="space-y-2">
              <Link to="/play" className="flex items-center space-x-3 p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
                <Play size={20} />
                <span className="font-medium">Play</span>
              </Link>
              
              <div className="h-px bg-gray-700 my-3"></div>
              
              <Link to="/cards" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                <Package size={20} />
                <span>Cards</span>
              </Link>
              
              <Link to="/decks" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                <Shield size={20} />
                <span>Decks</span>
              </Link>
              
              <Link to="/events" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                <Calendar size={20} />
                <span>Events</span>
              </Link>
              
              <Link to="/store" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                <DollarSign size={20} />
                <span>Store</span>
              </Link>
              
              <Link to="/profile" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                <User size={20} />
                <span>Profile</span>
              </Link>
              
              <div className="h-px bg-gray-700 my-3"></div>
              
              <Link to="/settings" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                <Settings size={20} />
                <span>Settings</span>
              </Link>
            </nav>
            
            {/* Daily Quests */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Daily Quests</h3>
              <div className="space-y-3">
                {dailyQuests.map(quest => (
                  <div key={quest.id} className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm">{quest.description}</p>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-1"></div>
                        <span className="text-sm">{quest.reward.gold}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(quest.progress / quest.total) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {quest.progress}/{quest.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Blog Search and Filters */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Showing {filteredPosts.length} of {blogPosts.length} posts
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="likes">Most Liked</option>
                    <option value="comments">Most Discussed</option>
                  </select>
                  
                  <div className="flex items-center bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Blog Posts */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
              {sortedPosts.map(post => (
                <div
                  key={post.id}
                  className={`bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-750 transition-all group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div 
                    className={`bg-gray-700 ${
                      viewMode === 'list' ? 'w-1/3 min-h-full' : 'h-48'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">Image Placeholder</span>
                    </div>
                  </div>
                  
                  <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                    <div className="flex items-center text-xs text-gray-400 mb-2">
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full mr-2">
                        {post.category}
                      </span>
                      <span>{post.type}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-600 mr-2"></div>
                        <div>
                          <div className="text-sm">{post.author.name}</div>
                          <div className="text-xs text-gray-400">{post.author.role}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <div className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart size={14} className="mr-1" />
                          <span>{post.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare size={14} className="mr-1" />
                          <span>{post.comments.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render golden home with UnifiedLayout
  const renderGoldenHome = () => {
    return (
      <UnifiedLayout variant="golden" currentPage="home">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Welcome to KONIVRER
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The ultimate deck building and strategy card game experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/play"
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105"
              >
                Start Playing
              </Link>
              <Link
                to="/cards"
                className="px-8 py-3 border-2 border-yellow-500 text-yellow-500 font-semibold rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300"
              >
                Browse Cards
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-yellow-500 mb-2">{playerGold.toLocaleString()}</div>
              <div className="text-gray-400">Gold</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-blue-500 mb-2">{playerGems.toLocaleString()}</div>
              <div className="text-gray-400">Gems</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-green-500 mb-2">{playerLevel}</div>
              <div className="text-gray-400">Level</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-purple-500 mb-2">{playerWins}</div>
              <div className="text-gray-400">Wins</div>
            </div>
          </div>

          {/* Daily Quests */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">Daily Quests</h2>
            <div className="space-y-4">
              {dailyQuests.map((quest, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                      <Award className="text-black" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold">{quest.title}</div>
                      <div className="text-sm text-gray-400">{quest.progress}/{quest.target}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-yellow-500 font-bold mr-4">{quest.reward}</div>
                    <div className="w-24 bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-yellow-500">Recent Matches</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span>Victory vs. Player123</span>
                  <span className="text-green-500 font-semibold">+25 XP</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span>Defeat vs. ProGamer</span>
                  <span className="text-red-500 font-semibold">+5 XP</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span>Victory vs. CardMaster</span>
                  <span className="text-green-500 font-semibold">+30 XP</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-yellow-500">Latest News</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-700 rounded">
                  <div className="font-semibold mb-1">New Set Release</div>
                  <div className="text-sm text-gray-400">Elemental Convergence now available!</div>
                </div>
                <div className="p-3 bg-gray-700 rounded">
                  <div className="font-semibold mb-1">Tournament Update</div>
                  <div className="text-sm text-gray-400">Weekly tournament starts tomorrow</div>
                </div>
                <div className="p-3 bg-gray-700 rounded">
                  <div className="font-semibold mb-1">Balance Changes</div>
                  <div className="text-sm text-gray-400">Several cards have been updated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UnifiedLayout>
    );
  };

  // Render the appropriate variant
  switch (actualVariant) {
    case 'mobile':
      return renderMobileHome();
    case 'simple':
      return renderSimpleHome();
    case 'golden':
      return renderGoldenHome();
    default:
      return renderStandardHome();
  }
};

export default UnifiedHome;