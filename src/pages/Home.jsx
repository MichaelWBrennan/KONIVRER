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
} from 'lucide-react';

const Home = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [dailyRewardsClaimed, setDailyRewardsClaimed] = useState(false);
  const [notifications, setNotifications] = useState(3);
  
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
                      style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                    ></div>
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
          {/* Daily Rewards Banner */}
          {!dailyRewardsClaimed && (
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-medium mb-1">Daily Rewards Available!</h3>
                  <p className="text-gray-300 text-sm">Claim your daily rewards and get bonus gold.</p>
                </div>
                <button 
                  onClick={handleClaimDailyRewards}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium rounded-lg transition-colors"
                >
                  Claim
                </button>
              </div>
            </div>
          )}
          
          {/* Featured Events */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Featured Events</h2>
              <Link to="/events" className="text-blue-400 hover:text-blue-300 flex items-center">
                <span className="text-sm">View All</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredEvents.map(event => (
                <div key={event.id} className="bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-750 transition-all group">
                  <div className="h-32 bg-gradient-to-r from-blue-900 to-purple-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{event.name}</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-gray-800/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                      {event.format}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-gray-800/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center">
                      <Clock size={12} className="mr-1" />
                      <span>Ends in {event.endDate}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-400">{event.type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                          <span className="text-xs">{event.entryFee.gold}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                          <span className="text-xs">{event.entryFee.gems}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-300 mb-3">
                      <Award size={14} className="mr-1" />
                      <span>{event.rewards}</span>
                    </div>
                    
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-sm font-medium">
                      Join Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Play Options */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Quick Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-xl p-6 hover:from-green-800 hover:to-blue-800 transition-all cursor-pointer">
                <div className="flex items-center mb-3">
                  <Sword size={24} className="mr-3" />
                  <h3 className="text-xl font-medium">Regulation Standard</h3>
                </div>
                <p className="text-gray-300 mb-4">Play with your constructed decks in the standard format.</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-sm font-medium">
                  Play Now
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-purple-900 to-red-900 rounded-xl p-6 hover:from-purple-800 hover:to-red-800 transition-all cursor-pointer">
                <div className="flex items-center mb-3">
                  <Zap size={24} className="mr-3" />
                  <h3 className="text-xl font-medium">Quick Draft</h3>
                </div>
                <p className="text-gray-300 mb-4">Draft against AI opponents and play against real players.</p>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-sm font-medium">
                  Start Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Menu Overlay */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Game Menu</h2>
                <button 
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-gray-700 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                <Link to="/play" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                  <Play size={20} />
                  <span>Play</span>
                </Link>
                
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
                
                <button className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors w-full text-left">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;