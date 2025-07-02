/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ 
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 transition-all duration-200 hover:scale-105"
              onClick={() => analytics.navigationClick('/', location.pathname)}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg animate-mystical-glow" 
                style={{ background: 'var(--gradient-primary)' }}>
                <span style={{ color: 'var(--text-primary)' }} className="font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-bold animate-text-reveal" style={{ 
                color: 'var(--text-primary)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
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
                      isItemActive ? 'animate-border-glow' : 'hover:scale-105'
                    }`}
                    style={{
                      background: isItemActive ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                      color: isItemActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      border: `1px solid ${isItemActive ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                      boxShadow: isItemActive ? 'var(--shadow-md)' : 'none'
                    }}
                    onClick={() => handleNavClick(item.name, item.href)}
                  >
                    <Icon
                      size={16}
                      className={`transition-transform duration-200 group-hover:scale-110 ${isItemActive ? 'animate-mystical-glow' : ''}`}
                    />
                    <span className={isItemActive ? 'font-extrabold' : ''} 
                      style={isItemActive ? {
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)', 
                        color: 'var(--text-primary)'
                      } : {}}>
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
                    className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-primary)'
                    }}
                    title="Go to Profile"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        background: 'var(--gradient-primary)',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <span style={{ color: 'var(--text-primary)', fontSize: '10px' }}>
                          {user.displayName?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <span className="hidden xl:block">{user.displayName}</span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--accent-danger)',
                      border: '1px solid var(--border-danger)'
                    }}
                    title="Logout"
                  >
                    <LogOut size={16} />
                    <span className="hidden xl:block">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 animate-mystical-glow"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--accent-primary)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg transition-all duration-200"
              style={{ 
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)'
              }}
              onClick={handleMobileMenuToggle}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden" style={{ 
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-primary)'
          }}>
            <div className="container py-4">
              <div className="ancient-divider mb-4"></div>
              <nav className="flex flex-col gap-2">
                {navigation.map(item => {
                  const Icon = item.icon;
                  const isItemActive = isActive(item);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isItemActive ? 'animate-border-glow' : ''
                      }`}
                      style={{
                        background: isItemActive ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                        color: isItemActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        border: `1px solid ${isItemActive ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                        boxShadow: isItemActive ? 'var(--shadow-md)' : 'none'
                      }}
                      onClick={() => {
                        handleNavClick(item.name, item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Icon size={16} className={isItemActive ? 'animate-mystical-glow' : ''} />
                      <span className={isItemActive ? 'font-extrabold' : ''} 
                        style={isItemActive ? {
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)', 
                          color: 'var(--text-primary)'
                        } : {}}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile User Menu */}
              <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
                <div className="ancient-divider mb-4"></div>
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-3 py-3 rounded-xl"
                      style={{ 
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-primary)'
                      }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center animate-mystical-glow"
                          style={{ 
                            background: 'var(--gradient-primary)',
                            boxShadow: 'var(--shadow-md)'
                          }}>
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.displayName}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                              {user.displayName?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            {user.displayName}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all duration-200"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-primary)'
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all duration-200 w-full text-left"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--accent-danger)',
                        border: '1px solid var(--border-danger)'
                      }}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 w-full animate-mystical-glow"
                    style={{
                      background: 'var(--gradient-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--accent-primary)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    <LogIn size={18} />
                    <span className="font-bold">Login to Ancient Archives</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>



      {/* Main Content */}
      <main className="flex-1 content-area" style={{ 
        background: 'var(--bg-primary)',
        minHeight: 'calc(100vh - 64px - 80px)' // Subtract header and footer heights
      }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ 
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-primary)',
        marginTop: 'auto'
      }}>
        <div className="container py-6">
          <div className="ancient-divider mb-4"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                © 2024 KONIVRER Ancient Archives. Built with <span className="animate-mystical-glow">✧</span> for the community.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/about"
                className="text-sm transition-all duration-200 hover:scale-105"
                style={{ color: 'var(--text-secondary)' }}
              >
                About the Archives
              </Link>
              <Link
                to="/contact"
                className="text-sm transition-all duration-200 hover:scale-105"
                style={{ color: 'var(--text-secondary)' }}
              >
                Contact the Archivists
              </Link>
              <Link
                to="/how-to-play"
                className="text-sm transition-all duration-200 hover:scale-105"
                style={{ color: 'var(--text-secondary)' }}
              >
                Ancient Teachings
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