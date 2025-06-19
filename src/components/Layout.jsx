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
  TrendingUp,
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedMobileSection, setExpandedMobileSection] = useState(null);

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

  // Simplified navigation with grouped sections
  const getNavigation = () => {
    const baseNavigation = [];

    // Home - only show when not on home page
    if (!isOnHomePage()) {
      baseNavigation.push({ name: 'Home', href: '/', icon: Home });
    }

    // Cards - unified card database and search
    baseNavigation.push({
      name: 'Cards',
      href: '/cards',
      icon: Database,
      subItems: [
        { name: 'Browse Cards', href: '/cards', icon: Database },
        { name: 'Advanced Search', href: '/cards?advanced=true', icon: Search },
      ]
    });

    // Decks - unified deck management (only for authenticated users)
    if (isAuthenticated) {
      baseNavigation.push({
        name: 'Decks',
        href: '/decklists',
        icon: Layers,
        subItems: [
          { name: 'My Decks', href: '/decklists?view=mydecks', icon: BookOpen },
          { name: 'Deck Builder', href: '/deckbuilder', icon: PlusCircle },
          { name: 'Deck Discovery', href: '/deck-discovery', icon: Star },
          { name: 'Official Decklists', href: '/official-decklists', icon: FileText },
        ]
      });
    } else {
      // Public deck browsing for non-authenticated users
      baseNavigation.push({
        name: 'Decks',
        href: '/deck-discovery',
        icon: Layers,
        subItems: [
          { name: 'Browse Decks', href: '/deck-discovery', icon: Star },
          { name: 'Official Decklists', href: '/official-decklists', icon: FileText },
        ]
      });
    }

    // Tournaments & Events - unified competitive section
    baseNavigation.push({
      name: 'Compete',
      href: '/tournaments',
      icon: Trophy,
      subItems: [
        { name: 'Tournaments', href: '/tournaments', icon: Trophy },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Leaderboards', href: '/leaderboards', icon: Crown },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      ]
    });

    // Community & Social
    baseNavigation.push({
      name: 'Community',
      href: '/social',
      icon: Users,
      subItems: [
        { name: 'Social Hub', href: '/social', icon: Users },
        { name: 'Hall of Fame', href: '/hall-of-fame', icon: Award },
        { name: 'Store Locator', href: '/store-locator', icon: MapPin },
      ]
    });

    // Game Resources
    baseNavigation.push({
      name: 'Resources',
      href: '/lore',
      icon: BookOpen,
      subItems: [
        { name: 'Lore Center', href: '/lore', icon: BookOpen },
        { name: 'Product Releases', href: '/products', icon: Package },
        { name: 'Meta Analysis', href: '/meta-analysis', icon: TrendingUp },
      ]
    });

    // Administrative tools - only for judges/organizers
    if (hasJudgeAccess() || hasOrganizerAccess()) {
      const adminSubItems = [];
      
      if (hasJudgeAccess()) {
        adminSubItems.push({ name: 'Judge Center', href: '/judge-center', icon: Shield });
      }
      
      if (hasOrganizerAccess()) {
        adminSubItems.push({ name: 'Tournament Manager', href: '/tournament-manager', icon: Settings });
      }
      
      if (user?.roles?.includes('admin')) {
        adminSubItems.push({ name: 'Admin Panel', href: '/admin', icon: Settings });
      }

      if (adminSubItems.length > 0) {
        baseNavigation.push({
          name: 'Admin',
          href: adminSubItems[0].href,
          icon: Shield,
          subItems: adminSubItems
        });
      }
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

  const isActive = (item) => {
    const path = item.href;
    
    // Exact match for home
    if (path === '/' && location.pathname === '/') return true;
    
    // Check if current path matches any subItem
    if (item.subItems) {
      return item.subItems.some(subItem => {
        if (subItem.href === '/' && location.pathname === '/') return true;
        if (subItem.href !== '/' && location.pathname.startsWith(subItem.href.split('?')[0])) return true;
        return false;
      });
    }
    
    // Check main path
    if (path !== '/' && location.pathname.startsWith(path.split('?')[0])) return true;
    
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
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isItemActive = isActive(item);
                
                if (hasSubItems) {
                  return (
                    <div key={item.name} className="relative">
                      <button
                        className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isItemActive
                            ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/25'
                            : 'text-secondary hover:text-primary hover:bg-tertiary hover:shadow-md hover:scale-105'
                        }`}
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <Icon
                          size={16}
                          className="transition-transform duration-200 group-hover:scale-110"
                        />
                        {item.name}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === item.name && (
                        <div
                          className="absolute top-full left-0 mt-2 w-56 bg-card border border-color rounded-lg shadow-lg z-50"
                          onMouseEnter={() => setActiveDropdown(item.name)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <div className="py-2">
                            {item.subItems.map(subItem => {
                              const SubIcon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-hover transition-colors"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    handleNavClick(subItem.name, subItem.href);
                                  }}
                                >
                                  <SubIcon size={16} className="text-muted" />
                                  {subItem.name}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else {
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
                }
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
              <nav className="flex flex-col gap-1">
                {navigation.map(item => {
                  const Icon = item.icon;
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isItemActive = isActive(item);
                  const isExpanded = expandedMobileSection === item.name;
                  
                  return (
                    <div key={item.name}>
                      {hasSubItems ? (
                        <>
                          <button
                            className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              isItemActive
                                ? 'bg-accent-primary text-white'
                                : 'text-secondary hover:text-primary hover:bg-tertiary'
                            }`}
                            onClick={() => {
                              setExpandedMobileSection(isExpanded ? null : item.name);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={16} />
                              {item.name}
                            </div>
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          
                          {isExpanded && (
                            <div className="ml-6 mt-1 space-y-1">
                              {item.subItems.map(subItem => {
                                const SubIcon = subItem.icon;
                                return (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.href}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-secondary hover:text-primary hover:bg-tertiary transition-colors"
                                    onClick={() => {
                                      handleNavClick(subItem.name, subItem.href);
                                      setIsMobileMenuOpen(false);
                                      setExpandedMobileSection(null);
                                    }}
                                  >
                                    <SubIcon size={14} />
                                    {subItem.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
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
                      )}
                    </div>
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
