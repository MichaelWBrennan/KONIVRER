import {
  Home,
  Database,
  BookOpen,
  User,
  Users,
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
  Gamepad2,
  Wrench,
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

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCardExplorerDropdown, setShowCardExplorerDropdown] = useState(false);
  const [showDeckWorkshopDropdown, setShowDeckWorkshopDropdown] = useState(false);

  const [showAnalyticsDropdown, setShowAnalyticsDropdown] = useState(false);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);

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

  // Navigation structure with dropdowns
  const getNavigation = () => {
    const baseNavigation = [];

    // Home - only show when not on home page
    if (!isOnHomePage()) {
      baseNavigation.push({ name: 'Home', href: '/', icon: Home });
    }

    // Rules - game rules and reference
    baseNavigation.push({
      name: 'Rules',
      href: '/rules',
      icon: BookOpen,
    });

    // Card Explorer dropdown
    baseNavigation.push({
      name: 'Card Explorer',
      icon: Database,
      dropdown: true,
      items: [
        { name: 'Card Database', href: '/cards' },
        { name: 'Advanced Search', href: '/cards/search' },
        { name: 'Card Sets', href: '/cards/sets' },
        { name: 'Spoilers', href: '/spoilers' },
      ]
    });

    // Deck Workshop dropdown
    baseNavigation.push({
      name: 'Deck Workshop',
      icon: Wrench,
      dropdown: true,
      items: [
        { name: 'Deck Builder', href: '/decks/builder' },
        { name: 'Deck Stats', href: '/decks/stats' },
      ]
    });

    // Use Simulator - direct link
    baseNavigation.push({
      name: 'use simulator',
      href: '/simulator',
      icon: Gamepad2,
    });

    // Account sections are now integrated into the user account system
    // No separate dropdown needed in main navigation

    // Analytics Hub dropdown
    baseNavigation.push({
      name: 'Analytics Hub',
      icon: BarChart3,
      dropdown: true,
      items: [
        { name: 'Meta Analysis', href: '/analytics/meta' },
        { name: 'Market Data', href: '/analytics/market' },
        { name: 'Price Trends', href: '/prices' },
        { name: 'Tournament Stats', href: '/analytics/tournaments' },
      ]
    });

    // Community & Tools dropdown
    baseNavigation.push({
      name: 'Community & Tools',
      icon: Users,
      dropdown: true,
      items: [
        { name: 'AI Assistant', href: '/ai-assistant' },
        { name: 'Community', href: '/community' },
        { name: 'Tools', href: '/tools' },
      ]
    });

    // Tournaments - competitive play with live brackets, results, and replays
    baseNavigation.push({
      name: 'Tournaments',
      href: '/tournaments',
      icon: Trophy,
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

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    analytics.buttonClick('mobile_menu', newState ? 'open' : 'close');
  };

  const isActive = item => {
    // For dropdown items, check if any of their sub-items match
    if (item.dropdown && item.items) {
      return item.items.some(subItem => 
        location.pathname.startsWith(subItem.href.split('?')[0])
      );
    }

    // For regular items with href
    if (item.href) {
      const path = item.href;
      
      // Exact match for home
      if (path === '/' && location.pathname === '/') return true;
      
      // Check main path for other items
      if (path !== '/' && location.pathname.startsWith(path.split('?')[0]))
        return true;
    }

    return false;
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const path = location.pathname;

    // Home page
    if (path === '/') return 'Home';

    // Find matching navigation item
    const activeNavItem = navigation.find(item => isActive(item));
    if (activeNavItem) return activeNavItem.name;

    // Fallback to path-based titles
    if (path.startsWith('/simulator')) return 'use simulator';
    if (path.startsWith('/cards')) return 'Card Explorer';
    if (path.startsWith('/decks') || path.startsWith('/collection')) return 'Deck Workshop';
    if (path.startsWith('/analytics') || path.startsWith('/prices')) return 'Analytics Hub';
    if (path.startsWith('/battle-pass') || path.startsWith('/ai-assistant') || path.startsWith('/community') || path.startsWith('/tools')) return 'Community & Tools';
    if (path.startsWith('/tournaments')) return 'Tournaments';
    if (path.startsWith('/judge-center')) return 'Judge Center';
    // Profile pages are now handled through user account system
    if (path.startsWith('/settings')) return 'Settings';

    // Default fallback
    return 'KONIVRER';
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

                // Handle dropdown items
                if (item.dropdown) {
                  return (
                    <div key={item.name} className="relative">
                      <button
                        className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isItemActive
                            ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/25'
                            : 'text-secondary hover:text-primary hover:bg-tertiary hover:shadow-md hover:scale-105'
                        }`}
                        onMouseEnter={() => {
                          if (item.name === 'Card Explorer') setShowCardExplorerDropdown(true);
                          if (item.name === 'Deck Workshop') setShowDeckWorkshopDropdown(true);
                          if (item.name === 'Analytics Hub') setShowAnalyticsDropdown(true);
                          if (item.name === 'Community & Tools') setShowCommunityDropdown(true);
                        }}
                        onMouseLeave={() => {
                          setTimeout(() => {
                            if (item.name === 'Card Explorer') setShowCardExplorerDropdown(false);
                            if (item.name === 'Deck Workshop') setShowDeckWorkshopDropdown(false);
                            if (item.name === 'Analytics Hub') setShowAnalyticsDropdown(false);
                            if (item.name === 'Community & Tools') setShowCommunityDropdown(false);
                          }, 150);
                        }}
                      >
                        <Icon
                          size={16}
                          className="transition-transform duration-200 group-hover:scale-110"
                        />
                        {item.name}
                        <ChevronDown size={12} />
                      </button>

                      {/* Dropdown Menu */}
                      {((item.name === 'Card Explorer' && showCardExplorerDropdown) ||
                        (item.name === 'Deck Workshop' && showDeckWorkshopDropdown) ||
                        (item.name === 'Analytics Hub' && showAnalyticsDropdown) ||
                        (item.name === 'Community & Tools' && showCommunityDropdown)) && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-48 bg-card border border-color rounded-lg shadow-lg z-50"
                          onMouseEnter={() => {
                            if (item.name === 'Card Explorer') setShowCardExplorerDropdown(true);
                            if (item.name === 'Deck Workshop') setShowDeckWorkshopDropdown(true);
                            if (item.name === 'Analytics Hub') setShowAnalyticsDropdown(true);
                            if (item.name === 'Community & Tools') setShowCommunityDropdown(true);
                          }}
                          onMouseLeave={() => {
                            if (item.name === 'Card Explorer') setShowCardExplorerDropdown(false);
                            if (item.name === 'Deck Workshop') setShowDeckWorkshopDropdown(false);
                            if (item.name === 'Analytics Hub') setShowAnalyticsDropdown(false);
                            if (item.name === 'Community & Tools') setShowCommunityDropdown(false);
                          }}
                        >
                          <div className="py-2">
                            {item.items.map(subItem => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-hover transition-colors"
                                onClick={() => {
                                  handleNavClick(subItem.name, subItem.href);
                                  setShowCardExplorerDropdown(false);
                                  setShowDeckWorkshopDropdown(false);
                                  setShowAnalyticsDropdown(false);
                                  setShowCommunityDropdown(false);
                                }}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Handle regular items
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

            {/* User Menu */}
            <div className="hidden lg:flex items-center gap-4">
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
                        {/* Profile & Account Management */}
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        <Link
                          to="/profile?tab=settings"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Settings size={16} />
                          Account Settings
                        </Link>
                        <Link
                          to="/profile?tab=security"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Shield size={16} />
                          Security
                        </Link>
                        <Link
                          to="/profile?tab=billing"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <DollarSign size={16} />
                          Billing
                        </Link>
                        <Link
                          to="/profile?tab=privacy"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Globe size={16} />
                          Privacy
                        </Link>
                        
                        <hr className="my-2 border-color" />
                        
                        {/* Personal Content */}
                        <Link
                          to="/decks"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <BookOpen size={16} />
                          My Decks
                        </Link>
                        <Link
                          to="/collection"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Package size={16} />
                          Collection
                        </Link>
                        <Link
                          to="/battle-pass"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Sparkles size={16} />
                          Battle Pass
                        </Link>
                        
                        <hr className="my-2 border-color" />
                        
                        {/* Tools & Features */}
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
                        
                        {/* Role-based Access */}
                        {hasJudgeAccess() && (
                          <Link
                            to="/judge-center"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Scale size={16} />
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

                  // Handle dropdown items in mobile
                  if (item.dropdown) {
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                          isItemActive
                            ? 'bg-accent-primary text-white'
                            : 'text-secondary'
                        }`}>
                          <Icon size={16} />
                          {item.name}
                        </div>
                        <div className="ml-6 space-y-1">
                          {item.items.map(subItem => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className="block px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-tertiary rounded-md transition-colors"
                              onClick={() => {
                                handleNavClick(subItem.name, subItem.href);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // Handle regular items
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

      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 py-6">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {getCurrentPageTitle()}
          </h1>
        </div>
      </div>

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
