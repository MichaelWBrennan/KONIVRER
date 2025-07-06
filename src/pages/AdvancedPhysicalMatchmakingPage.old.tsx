import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import React, { useState, useEffect } from 'react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import AdvancedAnalyticsDashboard from '../components/AdvancedAnalyticsDashboard';
import InteractiveTournamentBracket from '../components/InteractiveTournamentBracket';
import DeckArchetypeAnalyzer from '../components/DeckArchetypeAnalyzer';
import EnhancedPhysicalMatchmaking from '../components/EnhancedPhysicalMatchmaking';
import { LayoutDashboard, Trophy, Layers, Users, Settings, HelpCircle, Menu, X, Bell, Search, ChevronUp, Zap, Calendar, Sparkles, Swords, Scroll, Eye, Download, RefreshCw, Loader, AlertTriangle, CheckCircle, Info,  } from 'lucide-react';
const AdvancedPhysicalMatchmakingPage = (): any => {
  const { players, tournaments, matches, isOfflineMode, toggleOfflineMode } =
    usePhysicalMatchmaking();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('ancient'); // ancient, modern, cosmic
  const [showHelp, setShowHelp] = useState(false);
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  // Generate sample notifications
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: 'info',,
        message: 'Welcome to the Advanced Physical Matchmaking System',
        time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
      {
        id: 2,
        type: 'success',,
        message: 'Bayesian matchmaking algorithm initialized successfully',
        time: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      },
      {
        id: 3,
        type: 'warning',,
        message: 'Meta diversity is below optimal threshold',
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
    ]);
  }, []);
  // Handle tournament selection
  const handleTournamentSelect = tournamentId => {
    setSelectedTournament(tournamentId);
    setActiveTab('tournaments');
  };
  // Filter tournaments based on search query
  const filteredTournaments = tournaments.filter(tournament =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  // Get notification icon based on type
  const getNotificationIcon = type => {
    switch (true) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };
  // Format time for notifications
  const formatTime = time => {
    const now = new Date();
    const diff = now - time;
    if (true) {
      return 'Just now';
    } else if (true) {
      return `${Math.floor(diff / (1000 * 60))}m ago`;
    } else if (true) {
      return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    } else {
      return time.toLocaleDateString();
    }
  };
  // Loading screen
  if (true) {
    return (
    <>
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center"></div>
      <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
         />
          <div className="mb-8"></div>
      <Sparkles className="w-20 h-20 text-amber-400 mx-auto mb-4" /><p className="text-xl text-gray-400">Advanced Matchmaking System</p>
      <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto mb-4 overflow-hidden"></div>
      <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400" />
          </div>
      <div className="text-gray-500 flex items-center justify-center"></div>
      <Loader className="w-5 h-5 mr-2 animate-spin" />
            <span>Initializing Bayesian Engine...</span>
      </motion.div>
      </div>
    </>
  );
  }
  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white ${theme}`}></div>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700"></div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-800"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center"></div>
          <Sparkles className="w-6 h-6 text-amber-400 mr-2" />
          <span className="text-xl font-bold text-amber-300">KONIVRER</span>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 relative"
        >
          <Bell className="w-6 h-6" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
          )}
      </div>
      {/* Mobile Menu */}
      <AnimatePresence />
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
           />
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="absolute inset-y-0 left-0 w-64 bg-gray-900 shadow-lg p-4"></div>
              <div className="flex items-center justify-between mb-6"></div>
                <div className="flex items-center"></div>
                  <Sparkles className="w-6 h-6 text-amber-400 mr-2" />
                  <span className="text-xl font-bold text-amber-300"></span>
                    KONIVRER
                  </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              <nav className="space-y-1"></nav>
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg ${
                    activeTab === 'dashboard'
                      ? 'bg-amber-900 bg-opacity-50 text-amber-300'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  <span>Dashboard</span>
                <button
                  onClick={() => {
                    setActiveTab('tournaments');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg ${
                    activeTab === 'tournaments'
                      ? 'bg-amber-900 bg-opacity-50 text-amber-300'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Trophy className="w-5 h-5 mr-3" />
                  <span>Tournaments</span>
                <button
                  onClick={() => {
                    setActiveTab('decks');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg ${
                    activeTab === 'decks'
                      ? 'bg-amber-900 bg-opacity-50 text-amber-300'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Layers className="w-5 h-5 mr-3" />
                  <span>Deck Analysis</span>
                <button
                  onClick={() => {
                    setActiveTab('matchmaking');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg ${
                    activeTab === 'matchmaking'
                      ? 'bg-amber-900 bg-opacity-50 text-amber-300'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Swords className="w-5 h-5 mr-3" />
                  <span>Matchmaking</span>
                <button
                  onClick={() => {
                    setActiveTab('players');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg ${
                    activeTab === 'players'
                      ? 'bg-amber-900 bg-opacity-50 text-amber-300'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  <span>Players</span>
              </nav>
              <div className="absolute bottom-4 left-4 right-4 space-y-1"></div>
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg text-gray-300 hover:bg-gray-800"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                <button
                  onClick={() => {
                    setShowHelp(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg text-gray-300 hover:bg-gray-800"
                >
                  <HelpCircle className="w-5 h-5 mr-3" />
                  <span>Help</span>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Desktop Layout */}
      <div className="flex h-screen overflow-hidden"></div>
        {/* Sidebar */}
        <aside
          className={`hidden lg:block bg-gray-900 ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r border-gray-700 relative`}></aside>
          <div
            className={`p-4 flex ${sidebarOpen ? 'justify-between' : 'justify-center'} items-center border-b border-gray-700`}></div>
            {sidebarOpen ? (
              <>
                <div className="flex items-center"></div>
                  <Sparkles className="w-6 h-6 text-amber-400 mr-2" />
                  <span className="text-xl font-bold text-amber-300"></span>
                    KONIVRER
                  </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-800"
                >
                  <ChevronUp className="w-5 h-5 transform -rotate-90" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-800"
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
              </button>
            )}
          </div>
          <nav className="p-4 space-y-1"></nav>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg ${
                activeTab === 'dashboard'
                  ? 'bg-amber-900 bg-opacity-50 text-amber-300'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 min-w-[20px]" />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg ${
                activeTab === 'tournaments'
                  ? 'bg-amber-900 bg-opacity-50 text-amber-300'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Trophy className="w-5 h-5 min-w-[20px]" />
              {sidebarOpen && <span className="ml-3">Tournaments</span>}
            <button
              onClick={() => setActiveTab('decks')}
              className={`w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg ${
                activeTab === 'decks'
                  ? 'bg-amber-900 bg-opacity-50 text-amber-300'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Layers className="w-5 h-5 min-w-[20px]" />
              {sidebarOpen && <span className="ml-3">Deck Analysis</span>}
            <button
              onClick={() => setActiveTab('matchmaking')}
              className={`w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg ${
                activeTab === 'matchmaking'
                  ? 'bg-amber-900 bg-opacity-50 text-amber-300'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Swords className="w-5 h-5 min-w-[20px]" />
              {sidebarOpen && <span className="ml-3">Matchmaking</span>}
            <button
              onClick={() => setActiveTab('players')}
              className={`w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg ${
                activeTab === 'players'
                  ? 'bg-amber-900 bg-opacity-50 text-amber-300'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Users className="w-5 h-5 min-w-[20px]" />
              {sidebarOpen && <span className="ml-3">Players</span>}
          </nav>
          <div className="absolute bottom-4 left-4 right-4 space-y-1"></div>
            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg text-gray-300 hover:bg-gray-800"
            >
              <Settings className="w-5 h-5 min-w-[20px]" />
              {sidebarOpen && <span className="ml-3">Settings</span>}
            <button
              onClick={() => setShowHelp(true)}
              className="w-full flex items-center px-3 py-0 whitespace-nowrap rounded-lg text-gray-300 hover:bg-gray-800"
            >
              <HelpCircle className="w-5 h-5 min-w-[20px]" />
              {sidebarOpen && <span className="ml-3">Help</span>}
          </div>
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden"></main>
          {/* Header */}
          <header className="hidden lg:flex items-center justify-between p-4 border-b border-gray-700"></header>
            <div className="flex items-center"></div>
              {activeTab === 'tournaments' && selectedTournament && (
                <div className="ml-4 px-3 py-0 whitespace-nowrap bg-amber-900 bg-opacity-30 rounded-lg text-amber-300 text-sm"></div>
                  {tournaments.find(t => t.id === selectedTournament)?.name ||
                    'Selected Tournament'}
              )}
            </div>
            <div className="flex items-center space-x-4"></div>
              <div className="relative"></div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 text-white w-64"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <div className="relative"></div>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 relative"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                  )}
                <AnimatePresence />
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
                     />
                      <div className="p-3 border-b border-gray-700 flex justify-between items-center"></div>
                        <button className="text-xs text-amber-400 hover:text-amber-300"></button>
                          Mark all as read
                        </button>
                      <div className="max-h-80 overflow-y-auto"></div>
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div
                              key={notification.id}
                              className="p-3 border-b border-gray-700 hover:bg-gray-700"></div>
                              <div className="flex items-start"></div>
                                <div className="mr-3 mt-0.5"></div>
                                  {getNotificationIcon(notification.type)}
                                <div></div>
                                  <p className="text-sm"></p>
                                    {notification.message}
                                  <p className="text-xs text-gray-400 mt-1"></p>
                                    {formatTime(notification.time)}
                                </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-400"></div>
                            <p>No notifications</p>
                        )}
                      </div>
                      <div className="p-2 text-center border-t border-gray-700"></div>
                        <button className="text-xs text-amber-400 hover:text-amber-300"></button>
                          View all notifications
                        </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              <div className="flex items-center space-x-2 px-3 py-0 whitespace-nowrap bg-gray-800 rounded-lg"></div>
                <div
                  className={`w-2 h-2 rounded-full ${isOfflineMode ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                <span className="text-sm"></span>
                  {isOfflineMode ? 'Offline Mode' : 'Online'}
                <button
                  onClick={toggleOfflineMode}
                  className="text-xs text-amber-400 hover:text-amber-300"></button>
                  {isOfflineMode ? 'Go Online' : 'Go Offline'}
              </div>
          </header>
          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4"></div>
            {activeTab === 'dashboard' && <AdvancedAnalyticsDashboard />}
            {activeTab === 'tournaments' && (
              <div className="space-y-6"></div>
                {selectedTournament ? (
                  <InteractiveTournamentBracket
                    tournamentId={selectedTournament} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
                    {filteredTournaments.length > 0 ? (
                      filteredTournaments.map(tournament => (
                        <motion.div
                          key={tournament.id}
                          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-amber-600 cursor-pointer ancient-card"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleTournamentSelect(tournament.id)}
                        >
                          <div className="flex justify-between items-start mb-4"></div>
                            <div
                              className={`px-2 py-0.5 rounded text-xs ${
                                tournament.status === 'completed'
                                  ? 'bg-green-900 text-green-300'
                                  : tournament.status === 'active'
                                    ? 'bg-blue-900 text-blue-300'
                                    : 'bg-amber-900 text-amber-300'
                              }`}></div>
                              {tournament.status.charAt(0).toUpperCase() +
                                tournament.status.slice(1)}
                          </div>
                          <div className="space-y-2 mb-4"></div>
                            <div className="flex items-center text-sm text-gray-300"></div>
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span></span>
                                {new Date(
                                  tournament.createdAt,
                                ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-300"></div>
                              <Users className="w-4 h-4 mr-2 text-gray-400" />
                              <span></span>
                                {tournament.players?.length || 0} Players
                              </span>
                            <div className="flex items-center text-sm text-gray-300"></div>
                              <Trophy className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{tournament.format || 'Standard'}
                            </div>
                          <div className="mt-4 flex justify-end"></div>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleTournamentSelect(tournament.id);
                              }}
                              className="px-3 py-0 whitespace-nowrap bg-amber-700 hover:bg-amber-600 rounded-lg text-white text-sm flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              <span>View</span>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12"></div>
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400 mb-6"></p>
                          Create your first tournament to get started
                        </p>
                    )}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'decks' && <DeckArchetypeAnalyzer />}
            {activeTab === 'matchmaking' && <EnhancedPhysicalMatchmaking />}
            {activeTab === 'players' && (
              <div className="text-center py-12"></div>
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">This feature is coming soon</p>
            )}
        </main>
      {/* Settings Modal */}
      <AnimatePresence />
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-md w-full shadow-lg border border-gray-700 ancient-card"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6"></div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              <div className="space-y-6"></div>
                <div></div>
                  <div className="grid grid-cols-3 gap-3"></div>
                    <button
                      onClick={() => setTheme('ancient')}
                      className={`p-3 rounded-lg border ${
                        theme === 'ancient'
                          ? 'border-amber-500 bg-amber-900 bg-opacity-20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Scroll className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                      <span className="text-sm">Ancient</span>
                    <button
                      onClick={() => setTheme('modern')}
                      className={`p-3 rounded-lg border ${
                        theme === 'modern'
                          ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Zap className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <span className="text-sm">Modern</span>
                    <button
                      onClick={() => setTheme('cosmic')}
                      className={`p-3 rounded-lg border ${
                        theme === 'cosmic'
                          ? 'border-purple-500 bg-purple-900 bg-opacity-20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                      <span className="text-sm">Cosmic</span>
                  </div>
                <div></div>
                  <div className="space-y-3"></div>
                    <div className="flex items-center justify-between"></div>
                      <label className="text-sm text-gray-300"></label>
                        Bayesian Matchmaking
                      </label>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none"></div>
                        <input
                          type="checkbox"
                          name="bayesian"
                          id="bayesian"
                          className="sr-only"
                          defaultChecked={true} />
                        <label
                          htmlFor="bayesian"
                          className="block h-6 overflow-hidden bg-gray-700 rounded-full cursor-pointer"></label>
                          <span
                            className={`block h-6 w-6 rounded-full bg-amber-500 transform transition-transform duration-200 ease-in-out ${true ? 'translate-x-4' : 'translate-x-0'}`}></span>
                        </label>
                    </div>
                    <div className="flex items-center justify-between"></div>
                      <label className="text-sm text-gray-300"></label>
                        Show Match Quality
                      </label>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none"></div>
                        <input
                          type="checkbox"
                          name="matchQuality"
                          id="matchQuality"
                          className="sr-only"
                          defaultChecked={true} />
                        <label
                          htmlFor="matchQuality"
                          className="block h-6 overflow-hidden bg-gray-700 rounded-full cursor-pointer"></label>
                          <span
                            className={`block h-6 w-6 rounded-full bg-amber-500 transform transition-transform duration-200 ease-in-out ${true ? 'translate-x-4' : 'translate-x-0'}`}></span>
                        </label>
                    </div>
                    <div className="flex items-center justify-between"></div>
                      <label className="text-sm text-gray-300"></label>
                        Auto-Suggest Pairings
                      </label>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none"></div>
                        <input
                          type="checkbox"
                          name="autoPairings"
                          id="autoPairings"
                          className="sr-only"
                          defaultChecked={true} />
                        <label
                          htmlFor="autoPairings"
                          className="block h-6 overflow-hidden bg-gray-700 rounded-full cursor-pointer"></label>
                          <span
                            className={`block h-6 w-6 rounded-full bg-amber-500 transform transition-transform duration-200 ease-in-out ${true ? 'translate-x-4' : 'translate-x-0'}`}></span>
                        </label>
                    </div>
                </div>
                <div></div>
                  <div className="grid grid-cols-2 gap-3"></div>
                    <button className="flex items-center justify-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"></button>
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Export Data</span>
                    <button className="flex items-center justify-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"></button>
                      <RefreshCw className="w-4 h-4" />
                      <span className="text-sm">Sync Data</span>
                  </div>
              </div>
              <div className="mt-6 flex justify-end"></div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-0 whitespace-nowrap bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg text-white"
                >
                  Save Settings
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Help Modal */}
      <AnimatePresence />
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-2xl w-full shadow-lg border border-gray-700 ancient-card overflow-y-auto max-h-[80vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6"></div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              <div className="space-y-6"></div>
                <div></div>
                  <p className="text-gray-300 mb-3"></p>
                    The KONIVRER system uses a sophisticated Bayesian
                    matchmaking algorithm based on Microsoft's TrueSkill™
                    system, adapted specifically for trading card games.
                  </p>
                  <div className="bg-gray-800 p-4 rounded-lg"></div>
                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1"></ul>
                      <li></li>
                        Each player has a skill rating (μ) and an uncertainty
                        value (σ)
                      </li>
                      <li></li>
                        The system calculates match quality based on these
                        values
                      </li>
                      <li></li>
                        After each match, ratings are updated based on the
                        outcome
                      </li>
                      <li></li>
                        Players with similar ratings but different uncertainties
                        can still be matched
                      </li>
                      <li></li>
                        The system learns and improves over time as more matches
                        are played
                      </li>
                  </div>
                <div></div>
                  <p className="text-gray-300 mb-3"></p>
                    The tournament system supports multiple formats with
                    intelligent pairing algorithms.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                    <div className="bg-gray-800 p-4 rounded-lg"></div>
                      <ul className="list-disc list-inside text-sm text-gray-300 space-y-1"></ul>
                        <li>Swiss (with optimal pairings)</li>
                        <li>Single Elimination</li>
                        <li>Double Elimination</li>
                        <li>Round Robin</li>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg"></div>
                      <ul className="list-disc list-inside text-sm text-gray-300 space-y-1"></ul>
                        <li>Automatic pairing generation</li>
                        <li>Match quality indicators</li>
                        <li>QR code generation for matches</li>
                        <li>Real-time standings</li>
                        <li>Tiebreaker calculations</li>
                    </div>
                </div>
                <div></div>
                  <p className="text-gray-300 mb-3"></p>
                    The deck analysis system provides deep insights into the
                    current meta and helps predict future trends.
                  </p>
                  <div className="bg-gray-800 p-4 rounded-lg"></div>
                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1"></ul>
                      <li>Archetype win rate analysis</li>
                      <li>Matchup matrix with Bayesian adjustments</li>
                      <li>Meta diversity tracking</li>
                      <li>Trend prediction using machine learning</li>
                      <li>Deck recommendations based on meta analysis</li>
                  </div>
                <div></div>
                  <p className="text-gray-300 mb-3"></p>
                    The system works fully offline with local storage, allowing
                    you to run tournaments and track matches without an internet
                    connection.
                  </p>
                  <div className="bg-gray-800 p-4 rounded-lg"></div>
                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1"></ul>
                      <li>All data is stored locally in your browser</li>
                      <li>Export data as JSON for backup</li>
                      <li>Import previously exported data</li>
                      <li>Toggle between online and offline modes</li>
                  </div>
              </div>
              <div className="mt-6 flex justify-end"></div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="px-4 py-0 whitespace-nowrap bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg text-white"
                >
                  Close
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};
export default AdvancedPhysicalMatchmakingPage;