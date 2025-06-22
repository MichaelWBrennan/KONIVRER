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
  MapPin,
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
import PWAInstallPrompt from './PWAInstallPrompt';
import MobileLayout from './MobileLayout';
import MobileTouchControls from './MobileTouchControls';

import { analytics } from '../utils/analytics';
import pwaManager from '../utils/pwaUtils';
import '../styles/mobile.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Mobile and PWA state
  const [isMobile, setIsMobile] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showTouchControls, setShowTouchControls] = useState(false);

  // Detect mobile device and PWA status
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      
      // Show touch controls on mobile game pages
      const gamePages = ['/game', '/play', '/tournament'];
      setShowTouchControls(mobile && gamePages.some(page => location.pathname.startsWith(page)));
    };

    const checkPWAStatus = () => {
      const installed = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true;
      setIsInstalled(installed);
    };

    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    const handleOfflineStatus = () => setIsOnline(false);

    // Initial checks
    checkMobile();
    checkPWAStatus();

    // Event listeners
    window.addEventListener('resize', checkMobile);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    // PWA manager event overrides
    pwaManager.notifyInstallAvailable = () => {
      console.log('PWA install available');
    };

    pwaManager.notifyAppInstalled = () => {
      setIsInstalled(true);
    };

    pwaManager.notifyOnlineStatus = (online) => {
      setIsOnline(online);
    };

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, [location.pathname]);

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

  // Navigation structure - flattened without dropdowns
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

    // Card Explorer - unified card functionality
    baseNavigation.push({
      name: 'Cards',
      href: '/cards',
      icon: Database,
    });

    // Deck Workshop - unified deck functionality
    baseNavigation.push({
      name: 'Decks',
      href: '/decks',
      icon: Wrench,
    });

    // Online Sim - direct link
    baseNavigation.push({
      name: 'Online Sim',
      href: '/game/online',
      icon: Gamepad2,
    });

    // Matchmaking - online and physical matchmaking system
    baseNavigation.push({
      name: 'Matchmaking',
      href: '/matchmaking',
      icon: Target,
    });
    


    // Analytics Hub removed - stats moved to respective pages

    // Tournaments removed - now integrated as a tab in the Matchmaking page

    // Judge Center - only for judges (keep as separate navigation item)
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
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isItemActive
                        ? 'bg-gradient-to-r from-accent-primary to-accent-secondary shadow-lg shadow-accent-primary/25'
                        : 'text-secondary hover:text-primary hover:bg-tertiary hover:shadow-md hover:scale-105'
                    }`}
                    onClick={() => handleNavClick(item.name, item.href)}
                  >
                    <Icon
                      size={16}
                      className={`transition-transform duration-200 group-hover:scale-110 ${isItemActive ? 'relative z-10' : ''}`}
                    />
                    <span className={isItemActive ? 'relative z-10 font-extrabold text-white' : ''} style={isItemActive ? {textShadow: '0 0 3px rgba(0,0,0,0.8)'} : {}}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="hidden lg:flex items-center gap-4">
              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {/* User Profile Link */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 btn btn-ghost"
                    title="Go to Profile"
                  >
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-6 h-6 rounded-full bg-tertiary"
                    />
                    <span className="hidden xl:block">{user.displayName}</span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    className="btn btn-ghost text-red-400 hover:text-red-300"
                    title="Logout"
                  >
                    <LogOut size={16} />
                    <span className="hidden xl:block">Logout</span>
                  </button>
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
                      className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isItemActive
                          ? 'bg-accent-primary'
                          : 'text-secondary hover:text-primary hover:bg-tertiary'
                      }`}
                      onClick={() => {
                        handleNavClick(item.name, item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Icon size={16} className={isItemActive ? 'relative z-10' : ''} />
                      <span className={isItemActive ? 'relative z-10 font-extrabold text-white' : ''} style={isItemActive ? {textShadow: '0 0 3px rgba(0,0,0,0.8)'} : {}}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile User Menu */}
              <div className="mt-4 pt-4 border-t border-color">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-3">
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
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-tertiary rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
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

      {/* PWA Install Prompt */}
      {!isInstalled && <PWAInstallPrompt />}

      {/* Mobile Touch Controls */}
      {showTouchControls && (
        <MobileTouchControls
          onCardAction={(action) => {
            console.log('Card action:', action);
            // Handle card actions for mobile gameplay
          }}
          onZoom={(factor) => {
            console.log('Zoom:', factor);
            // Handle zoom for mobile
          }}
          onRotate={(angle) => {
            console.log('Rotate:', angle);
            // Handle rotation for mobile
          }}
          onPan={(deltaX, deltaY) => {
            console.log('Pan:', deltaX, deltaY);
            // Handle panning for mobile
          }}
          gameState={{}}
          isPlayerTurn={true}
        />
      )}
    </div>
  );
};

// If mobile, wrap with MobileLayout
const LayoutWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/cards')) return 'cards';
    if (path.startsWith('/tournament')) return 'tournaments';
    if (path.startsWith('/social')) return 'social';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };

  if (isMobile) {
    return (
      <MobileLayout currentPage={getCurrentPage()}>
        <Layout>{children}</Layout>
      </MobileLayout>
    );
  }

  return <Layout>{children}</Layout>;
};

export { Layout, LayoutWrapper };
export default LayoutWrapper;
