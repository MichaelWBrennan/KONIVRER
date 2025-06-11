import {
  Home,
  Database,
  PlusCircle,
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
  ChevronDown,
  Star,
  Calendar,
  Gamepad2,
  Layers,
  MapPin,
  Crown,
  Package,
  Scale,
  Award,
  FileText,
  Globe,
  BarChart3,
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

  // Debug logging
  console.log('Layout - isAuthenticated:', isAuthenticated);
  console.log('Layout - loading:', loading);
  console.log('Layout - user:', user);

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

  // Dynamic navigation based on authentication and roles
  const getNavigation = () => {
    const baseNavigation = [];

    // Home - only show when not on home page
    if (!isOnHomePage()) {
      baseNavigation.push({ name: 'Home', href: '/', icon: Home });
    }

    // Cards & Database - always available
    baseNavigation.push({
      name: 'Cards & Database',
      href: '/cards',
      icon: Database,
    });

    // Deck Building - only for authenticated users
    if (isAuthenticated) {
      baseNavigation.push({
        name: 'Deck Building',
        href: '/decklists',
        icon: Layers,
      });
    }

    // Tournaments - public view for all, but organizer tools require authentication
    baseNavigation.push({
      name: 'Tournaments',
      href: '/tournaments',
      icon: Trophy,
    });

    // Community - always available
    baseNavigation.push({ name: 'Community', href: '/social', icon: Users });

    // Judge Center - only for certified judges
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
      // Navigate to cards page with search
      window.location.href = `/cards?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    analytics.buttonClick('mobile_menu', newState ? 'open' : 'close');
  };

  const isActive = path => {
    if (path === '/' && location.pathname === '/') return true;
    if (
      path === '/tournaments' &&
      (location.pathname.startsWith('/tournaments') ||
        location.pathname.startsWith('/events'))
    )
      return true;
    if (
      path !== '/' &&
      path !== '/tournaments' &&
      location.pathname.startsWith(path)
    )
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
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
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
                          to="/decklists?view=mydecks"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <BookOpen size={16} />
                          My Decks
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
              <nav className="flex flex-col gap-2">
                {navigation.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
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
