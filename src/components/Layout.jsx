import {
  Home,
  Database,
  BookOpen,
  User,
  Users,
  Search,
  Menu,
  X,
  Trophy,
  Shield,
  LogIn,
  LogOut,
  Settings,
  Layers,
  Sparkles,
  Palette,
  Play,
  Bot,
  ChevronDown,
  MapPin,
  Crown,
  Package,
  Scale,
  Award,
  FileText,
  Globe,
  BarChart3,
  DollarSign,
  TrendingUp,
  Target,
  Calculator,
  Eye,
  Zap,
  Link as LinkIcon,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ModernAuthModal from './ModernAuthModal';

import { analytics } from '../utils/analytics';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Helper functions for role-based access
  const hasJudgeAccess = () => {
    return (
      isAuthenticated && user?.roles?.includes('judge') && user?.judgeLevel >= 1
    );
  };

  const hasOrganizerAccess = () => {
    return (
      isAuthenticated &&
      user?.roles?.includes('organizer') &&
      user?.organizerLevel >= 1
    );
  };

  const isOnHomePage = () => {
    return location.pathname === '/';
  };

  // Simplified flat navigation structure
  const getNavigation = () => {
    const baseNavigation = [];

    // Home - only show when not on home page
    if (!isOnHomePage()) {
      baseNavigation.push({ name: 'Home', href: '/', icon: Home });
    }

    // Game Hub - unified cards, decks, and market system
    baseNavigation.push({
      name: 'Game Hub',
      href: '/hub',
      icon: Database,
    });

    // Tournaments - competitive play with live brackets, results, and replays
    baseNavigation.push({
      name: 'Tournaments',
      href: '/tournaments',
      icon: Trophy,
    });

    // Tools - utilities like commanders, collection, battle pass, card maker
    baseNavigation.push({
      name: 'Tools',
      href: '/tools',
      icon: Settings,
    });

    // Community - social features and interaction
    baseNavigation.push({
      name: 'Community',
      href: '/social',
      icon: Users,
    });

    // Resources - game knowledge, lore, and guides
    baseNavigation.push({
      name: 'Resources',
      href: '/lore',
      icon: BookOpen,
    });

    // Judge Center - only for judges
    if (hasJudgeAccess()) {
      baseNavigation.push({
        name: 'Judge Center',
        href: '/judge-center',
        icon: Shield,
      });
    }

    return baseNavigation;
  };

  const navigation = getNavigation();

  // Track page views when location changes
  useEffect(() => {
    const pageName =
      location.pathname === '/' ? 'home' : location.pathname.slice(1);
    analytics.pageView(pageName, {
      path: location.pathname,
      search: location.search,
    });
  }, [location]);

  // Handle navigation clicks
  const handleNavClick = (itemName, href) => {
    analytics.navigationClick(href, location.pathname);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Handle search
  const handleSearch = e => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      analytics.cardSearch(searchTerm.trim());
      // Navigate to unified hub with search
      window.location.href = `/hub?section=explore&tab=cards&search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    analytics.buttonClick('mobile_menu', newState ? 'open' : 'close');
  };

  const isActive = item => {
    const path = item.href;

    // Exact match for home
    if (path === '/' && location.pathname === '/') return true;

    // For grouped navigation items, check if current path matches the group's functionality
    if (
      item.name === 'Game Hub' &&
      (location.pathname.startsWith('/hub') ||
        location.pathname.startsWith('/game-hub') ||
        location.pathname.startsWith('/cards') ||
        location.pathname.startsWith('/card-database') ||
        location.pathname.startsWith('/decklists') ||
        location.pathname.startsWith('/deckbuilder') ||
        location.pathname.startsWith('/deck-discovery') ||
        location.pathname.startsWith('/market') ||
        location.pathname.startsWith('/prices') ||
        location.pathname.startsWith('/metagame') ||
        location.pathname.startsWith('/budget') ||
        location.pathname.startsWith('/pricing') ||
        location.pathname.startsWith('/spoilers') ||
        location.pathname.startsWith('/synergy') ||
        location.pathname.startsWith('/collection') ||
        location.pathname.startsWith('/portfolio'))
    )
      return true;
    if (
      item.name === 'Tournaments' &&
      (location.pathname.startsWith('/tournaments') ||
        location.pathname.startsWith('/events') ||
        location.pathname.startsWith('/leaderboards') ||
        location.pathname.startsWith('/analytics'))
    )
      return true;
    if (
      item.name === 'Community' &&
      (location.pathname.startsWith('/social') ||
        location.pathname.startsWith('/hall-of-fame') ||
        location.pathname.startsWith('/store-locator'))
    )
      return true;
    if (
      item.name === 'Resources' &&
      (location.pathname.startsWith('/lore') ||
        location.pathname.startsWith('/products') ||
        location.pathname.startsWith('/meta-analysis'))
    )
      return true;

    // Check main path for other items
    if (path !== '/' && location.pathname.startsWith(path.split('?')[0]))
      return true;

    return false;
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-secondary border-b border-color sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 transition-all duration-200 hover:scale-105"
              onClick={() => analytics.navigationClick('/', location.pathname)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-bold text-primary bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                KONIVRER
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map(item => {
                const Icon = item.icon;
                const isItemActive = isActive(item);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isItemActive
                        ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/25'
                        : 'text-secondary hover:text-primary hover:bg-tertiary hover:shadow-md hover:scale-105'
                    }`}
                    onClick={() => handleNavClick(item.name, item.href)}
                  >
                    <Icon
                      size={16}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Search Bar & User Menu */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search cards..."
                  className="input pl-10 w-64 bg-tertiary border-secondary focus:border-accent-primary focus:shadow-lg focus:shadow-accent-primary/25 transition-all duration-200"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>

              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 btn btn-ghost"
                  >
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-6 h-6 rounded-full bg-tertiary"
                    />
                    <span className="hidden xl:block">{user.displayName}</span>
                    <ChevronDown size={14} />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-color rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-color">
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-sm text-secondary">
                          @{user.username}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <Link
                          to="/hub?section=manage&tab=mydecks"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <BookOpen size={16} />
                          My Decks
                        </Link>
                        <Link
                          to="/battle-pass"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Sparkles size={16} />
                          Battle Pass
                        </Link>
                        <Link
                          to="/card-maker"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Palette size={16} />
                          Card Maker
                        </Link>
                        <Link
                          to="/replays"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Play size={16} />
                          Replays
                        </Link>
                        {hasJudgeAccess() && (
                          <Link
                            to="/judge-center"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Shield size={16} />
                            Judge Center
                          </Link>
                        )}
                        {hasOrganizerAccess() && (
                          <Link
                            to="/tournament-manager"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Trophy size={16} />
                            Tournament Manager
                          </Link>
                        )}
                        <Link
                          to="/profile?tab=settings"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Settings size={16} />
                          Settings
                        </Link>
                        <hr className="my-2 border-color" />
                        <button
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover w-full text-left text-red-400"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn btn-primary"
                >
                  <LogIn size={16} />
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden btn btn-ghost"
              onClick={handleMobileMenuToggle}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-secondary border-t border-color">
            <div className="container py-4">
              <nav className="flex flex-col gap-1">
                {navigation.map(item => {
                  const Icon = item.icon;
                  const isItemActive = isActive(item);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isItemActive
                          ? 'bg-accent-primary text-white'
                          : 'text-secondary hover:text-primary hover:bg-tertiary'
                      }`}
                      onClick={() => {
                        handleNavClick(item.name, item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Icon size={16} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Search */}
              <div className="mt-4 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search cards..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>

              {/* Mobile User Menu */}
              <div className="mt-4 pt-4 border-t border-color">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full bg-tertiary"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-secondary">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-tertiary rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/decklists?view=mydecks"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-tertiary rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen size={16} />
                      My Decks
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-tertiary rounded-md w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn btn-primary w-full"
                  >
                    <LogIn size={16} />
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-color mt-auto">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">
                © 2024 KONIVRER Deck Database. Built with ❤️ for the community.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/about"
                className="text-sm text-secondary hover:text-primary"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm text-secondary hover:text-primary"
              >
                Contact
              </Link>
              <Link
                to="/how-to-play"
                className="text-sm text-secondary hover:text-primary"
              >
                How to Play
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <ModernAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </div>
  );
};

export { Layout };
export default Layout;
