/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BaseComponentProps } from '../types';
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
import { useAuth } from '../contexts/AuthContext';
import ModernAuthModal from './ModernAuthModal';
import PWAInstallPrompt from './PWAInstallPrompt';
import MobileLayout from './MobileLayout';
import MobileTouchControls from './MobileTouchControls';

import { analytics } from '../utils/analytics';
import pwaManager from '../utils/pwaUtils';
import '../styles/navigation-fix.css';

interface LayoutProps extends BaseComponentProps {
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '', 
  showNavigation = true 
}) => {
  const location = useLocation();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Mobile and PWA state
  const [isMobile, setIsMobile] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Default to true since we can't access navigator.onLine in SSR
  const [showTouchControls, setShowTouchControls] = useState(false);

  // Detect mobile device and PWA status
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      setIsMobile(mobile);

      // Show touch controls on mobile game pages
      const gamePages = ['/game', '/play', '/tournament'];
      setShowTouchControls(
        mobile && gamePages.some(page => location.pathname.startsWith(page)),
      );
    };

    const checkPWAStatus = () => {
      const installed =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      setIsInstalled(installed);
    };

    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    const handleOfflineStatus = () => setIsOnline(false);

    // Initial checks
    checkMobile();
    checkPWAStatus();
    setIsOnline(navigator.onLine);

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

    pwaManager.notifyOnlineStatus = (online: boolean) => {
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

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

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
  const handleNavClick = (itemName: string, href: string) => {
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

  const isActive = (path: string) => {
    // Exact match for home
    if (path === '/' && location.pathname === '/') return true;
    // Check main path for other items
    if (path !== '/' && location.pathname.startsWith(path.split('?')[0])) return true;
    return false;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      {showNavigation && (
        <header
          className="sticky top-0 z-50"
          style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div className="container max-w-full header-content">
            <div className="navigation-container py-4">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2 lg:gap-3 transition-all duration-200 hover:scale-105 flex-shrink-0"
                onClick={() => analytics.navigationClick('/', location.pathname)}
              >
                <div
                  className="w-8 lg:w-10 h-8 lg:h-10 rounded-xl flex items-center justify-center shadow-lg animate-mystical-glow"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <span
                    style={{ color: 'var(--text-primary)' }}
                    className="font-bold text-lg lg:text-xl"
                  >
                    K
                  </span>
                </div>
                <span
                  className="logo-text font-bold animate-text-reveal"
                  style={{
                    color: 'var(--text-primary)',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  KONIVRER
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="nav-container hidden md:flex items-center flex-shrink-0">
                {/* Home */}
                <Link
                  to="/"
                  className={`nav-item nav-link group relative flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-0 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive('/') ? 'animate-border-glow' : 'hover:scale-105'
                  }`}
                  style={{
                    background: isActive('/')
                      ? 'var(--gradient-primary)'
                      : 'var(--bg-tertiary)',
                    color: isActive('/')
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    border: `1px solid ${isActive('/') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    boxShadow: isActive('/') ? 'var(--shadow-md)' : 'none',
                  }}
                  onClick={() => handleNavClick('Home', '/')}
                >
                  <Home
                    size={16}
                    className={`transition-transform duration-200 group-hover:scale-110 ${isActive('/') ? 'animate-mystical-glow' : ''}`}
                  />
                  <span
                    className={`nav-text ${isActive('/') ? 'font-extrabold' : ''}`}
                    style={
                      isActive('/')
                        ? {
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            color: 'var(--text-primary)',
                          }
                        : {}
                    }
                  >
                    Home
                  </span>
                </Link>

                {/* Rules */}
                <Link
                  to="/rules"
                  className={`nav-item nav-link group relative flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-0 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive('/rules') ? 'animate-border-glow' : 'hover:scale-105'
                  }`}
                  style={{
                    background: isActive('/rules')
                      ? 'var(--gradient-primary)'
                      : 'var(--bg-tertiary)',
                    color: isActive('/rules')
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    border: `1px solid ${isActive('/rules') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    boxShadow: isActive('/rules') ? 'var(--shadow-md)' : 'none',
                  }}
                  onClick={() => handleNavClick('Rules', '/rules')}
                >
                  <BookOpen
                    size={16}
                    className={`transition-transform duration-200 group-hover:scale-110 ${isActive('/rules') ? 'animate-mystical-glow' : ''}`}
                  />
                  <span
                    className={`nav-text ${isActive('/rules') ? 'font-extrabold' : ''}`}
                    style={
                      isActive('/rules')
                        ? {
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            color: 'var(--text-primary)',
                          }
                        : {}
                    }
                  >
                    Rules
                  </span>
                </Link>

                {/* Cards */}
                <Link
                  to="/cards"
                  className={`nav-item nav-link group relative flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-0 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive('/cards') ? 'animate-border-glow' : 'hover:scale-105'
                  }`}
                  style={{
                    background: isActive('/cards')
                      ? 'var(--gradient-primary)'
                      : 'var(--bg-tertiary)',
                    color: isActive('/cards')
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    border: `1px solid ${isActive('/cards') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    boxShadow: isActive('/cards') ? 'var(--shadow-md)' : 'none',
                  }}
                  onClick={() => handleNavClick('Cards', '/cards')}
                >
                  <Database
                    size={16}
                    className={`transition-transform duration-200 group-hover:scale-110 ${isActive('/cards') ? 'animate-mystical-glow' : ''}`}
                  />
                  <span
                    className={`nav-text ${isActive('/cards') ? 'font-extrabold' : ''}`}
                    style={
                      isActive('/cards')
                        ? {
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            color: 'var(--text-primary)',
                          }
                        : {}
                    }
                  >
                    Cards
                  </span>
                </Link>

                {/* Decks */}
                <Link
                  to="/decks"
                  className={`nav-item nav-link group relative flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-0 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive('/decks') ? 'animate-border-glow' : 'hover:scale-105'
                  }`}
                  style={{
                    background: isActive('/decks')
                      ? 'var(--gradient-primary)'
                      : 'var(--bg-tertiary)',
                    color: isActive('/decks')
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    border: `1px solid ${isActive('/decks') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    boxShadow: isActive('/decks') ? 'var(--shadow-md)' : 'none',
                  }}
                  onClick={() => handleNavClick('Decks', '/decks')}
                >
                  <Wrench
                    size={16}
                    className={`transition-transform duration-200 group-hover:scale-110 ${isActive('/decks') ? 'animate-mystical-glow' : ''}`}
                  />
                  <span
                    className={`nav-text ${isActive('/decks') ? 'font-extrabold' : ''}`}
                    style={
                      isActive('/decks')
                        ? {
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            color: 'var(--text-primary)',
                          }
                        : {}
                    }
                  >
                    Decks
                  </span>
                </Link>

                {/* Play Now */}
                <Link
                  to="/game/ai"
                  className={`nav-item nav-link group relative flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-0 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive('/game/ai') ? 'animate-border-glow' : 'hover:scale-105'
                  }`}
                  style={{
                    background: isActive('/game/ai')
                      ? 'var(--gradient-primary)'
                      : 'var(--bg-tertiary)',
                    color: isActive('/game/ai')
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    border: `1px solid ${isActive('/game/ai') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    boxShadow: isActive('/game/ai') ? 'var(--shadow-md)' : 'none',
                  }}
                  onClick={() => handleNavClick('Play Now', '/game/ai')}
                >
                  <Play
                    size={16}
                    className={`transition-transform duration-200 group-hover:scale-110 ${isActive('/game/ai') ? 'animate-mystical-glow' : ''}`}
                  />
                  <span
                    className={`nav-text ${isActive('/game/ai') ? 'font-extrabold' : ''}`}
                    style={
                      isActive('/game/ai')
                        ? {
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            color: 'var(--text-primary)',
                          }
                        : {}
                    }
                  >
                    Play Now
                  </span>
                </Link>

                {/* Online Sim */}
                <Link
                  to="/game/online"
                  className={`nav-item nav-link group relative flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-0 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive('/game/online') ? 'animate-border-glow' : 'hover:scale-105'
                  }`}
                  style={{
                    background: isActive('/game/online')
                      ? 'var(--gradient-primary)'
                      : 'var(--bg-tertiary)',
                    color: isActive('/game/online')
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    border: `1px solid ${isActive('/game/online') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    boxShadow: isActive('/game/online') ? 'var(--shadow-md)' : 'none',
                  }}
                  onClick={() => handleNavClick('Online Sim', '/game/online')}
                >
                  <Gamepad2
                    size={16}
                    className={`transition-transform duration-200 group-hover:scale-110 ${isActive('/game/online') ? 'animate-mystical-glow' : ''}`}
                  />
                  <span
                    className={`nav-text ${isActive('/game/online') ? 'font-extrabold' : ''}`}
                    style={
                      isActive('/game/online')
                        ? {
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            color: 'var(--text-primary)',
                          }
                        : {}
                    }
                  >
                    Online Sim
                  </span>
                </Link>

                {/* Matchmaking */}
                <Link
                  to="/matchmaking"
                  className={`nav-item nav-link group relative flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-0 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive('/matchmaking') ? 'animate-border-glow' : 'hover:scale-105'
                  }`}
                  style={{
                    background: isActive('/matchmaking')
                      ? 'var(--gradient-primary)'
                      : 'var(--bg-tertiary)',
                    color: isActive('/matchmaking')
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    border: `1px solid ${isActive('/matchmaking') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    boxShadow: isActive('/matchmaking') ? 'var(--shadow-md)' : 'none',
                  }}
                  onClick={() => handleNavClick('Matchmaking', '/matchmaking')}
                >
                  <Target
                    size={16}
                    className={`transition-transform duration-200 group-hover:scale-110 ${isActive('/matchmaking') ? 'animate-mystical-glow' : ''}`}
                  />
                  <span
                    className={`nav-text ${isActive('/matchmaking') ? 'font-extrabold' : ''}`}
                    style={
                      isActive('/matchmaking')
                        ? {
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            color: 'var(--text-primary)',
                          }
                        : {}
                    }
                  >
                    Matchmaking
                  </span>
                </Link>

                {/* Judge Center - only for judges */}
                {hasJudgeAccess() && (
                  <Link
                    to="/judge-center"
                    className={`nav-item nav-link group relative flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-0 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive('/judge-center') ? 'animate-border-glow' : 'hover:scale-105'
                    }`}
                    style={{
                      background: isActive('/judge-center')
                        ? 'var(--gradient-primary)'
                        : 'var(--bg-tertiary)',
                      color: isActive('/judge-center')
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      border: `1px solid ${isActive('/judge-center') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                      boxShadow: isActive('/judge-center') ? 'var(--shadow-md)' : 'none',
                    }}
                    onClick={() => handleNavClick('Judge Center', '/judge-center')}
                  >
                    <Shield
                      size={16}
                      className={`transition-transform duration-200 group-hover:scale-110 ${isActive('/judge-center') ? 'animate-mystical-glow' : ''}`}
                    />
                    <span
                      className={`nav-text ${isActive('/judge-center') ? 'font-extrabold' : ''}`}
                      style={
                        isActive('/judge-center')
                          ? {
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              color: 'var(--text-primary)',
                            }
                          : {}
                      }
                    >
                      Judge Center
                    </span>
                  </Link>
                )}
              </nav>

              {/* User Menu */}
              <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-shrink-0">
                {/* User Authentication */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    {/* User Profile Link */}
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-0 rounded-xl transition-all duration-200 whitespace-nowrap"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-primary)',
                      }}
                      title="Go to Profile"
                      onClick={() => handleNavClick('Profile', '/profile')}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: 'var(--gradient-primary)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.displayName}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <span
                            style={{
                              color: 'var(--text-primary)',
                              fontSize: '10px',
                            }}
                          >
                            {user.displayName?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <span className="hidden xl:block">{user.displayName}</span>
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-3 py-0 rounded-xl transition-all duration-200 whitespace-nowrap"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--accent-danger)',
                        border: '1px solid var(--border-danger)',
                      }}
                      title="Logout"
                    >
                      <LogOut size={16} />
                      <span className="hidden xl:block">Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="flex items-center gap-2 px-4 py-0 rounded-xl transition-all duration-200 animate-mystical-glow whitespace-nowrap"
                    style={{
                      background: 'var(--gradient-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--accent-primary)',
                      boxShadow: 'var(--shadow-md)',
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
                  border: '1px solid var(--border-primary)',
                }}
                onClick={handleMobileMenuToggle}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div
              className="md:hidden"
              style={{
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-primary)',
              }}
            >
              <div className="container py-4">
                <div className="ancient-divider mb-4"></div>
                <nav className="flex flex-col gap-2">
                  {/* Home */}
                  <Link
                    to="/"
                    className={`relative flex items-center gap-3 px-3 py-0 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive('/') ? 'animate-border-glow' : ''
                    }`}
                    style={{
                      background: isActive('/')
                        ? 'var(--gradient-primary)'
                        : 'var(--bg-tertiary)',
                      color: isActive('/')
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      border: `1px solid ${isActive('/') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                      boxShadow: isActive('/') ? 'var(--shadow-md)' : 'none',
                    }}
                    onClick={() => {
                      handleNavClick('Home', '/');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Home
                      size={16}
                      className={isActive('/') ? 'animate-mystical-glow' : ''}
                    />
                    <span
                      className={isActive('/') ? 'font-extrabold' : ''}
                      style={
                        isActive('/')
                          ? {
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              color: 'var(--text-primary)',
                            }
                          : {}
                      }
                    >
                      Home
                    </span>
                  </Link>

                  {/* Rules */}
                  <Link
                    to="/rules"
                    className={`relative flex items-center gap-3 px-3 py-0 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive('/rules') ? 'animate-border-glow' : ''
                    }`}
                    style={{
                      background: isActive('/rules')
                        ? 'var(--gradient-primary)'
                        : 'var(--bg-tertiary)',
                      color: isActive('/rules')
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      border: `1px solid ${isActive('/rules') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                      boxShadow: isActive('/rules') ? 'var(--shadow-md)' : 'none',
                    }}
                    onClick={() => {
                      handleNavClick('Rules', '/rules');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <BookOpen
                      size={16}
                      className={isActive('/rules') ? 'animate-mystical-glow' : ''}
                    />
                    <span
                      className={isActive('/rules') ? 'font-extrabold' : ''}
                      style={
                        isActive('/rules')
                          ? {
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              color: 'var(--text-primary)',
                            }
                          : {}
                      }
                    >
                      Rules
                    </span>
                  </Link>

                  {/* Cards */}
                  <Link
                    to="/cards"
                    className={`relative flex items-center gap-3 px-3 py-0 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive('/cards') ? 'animate-border-glow' : ''
                    }`}
                    style={{
                      background: isActive('/cards')
                        ? 'var(--gradient-primary)'
                        : 'var(--bg-tertiary)',
                      color: isActive('/cards')
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      border: `1px solid ${isActive('/cards') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                      boxShadow: isActive('/cards') ? 'var(--shadow-md)' : 'none',
                    }}
                    onClick={() => {
                      handleNavClick('Cards', '/cards');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Database
                      size={16}
                      className={isActive('/cards') ? 'animate-mystical-glow' : ''}
                    />
                    <span
                      className={isActive('/cards') ? 'font-extrabold' : ''}
                      style={
                        isActive('/cards')
                          ? {
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              color: 'var(--text-primary)',
                            }
                          : {}
                      }
                    >
                      Cards
                    </span>
                  </Link>

                  {/* Decks */}
                  <Link
                    to="/decks"
                    className={`relative flex items-center gap-3 px-3 py-0 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive('/decks') ? 'animate-border-glow' : ''
                    }`}
                    style={{
                      background: isActive('/decks')
                        ? 'var(--gradient-primary)'
                        : 'var(--bg-tertiary)',
                      color: isActive('/decks')
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      border: `1px solid ${isActive('/decks') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                      boxShadow: isActive('/decks') ? 'var(--shadow-md)' : 'none',
                    }}
                    onClick={() => {
                      handleNavClick('Decks', '/decks');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Wrench
                      size={16}
                      className={isActive('/decks') ? 'animate-mystical-glow' : ''}
                    />
                    <span
                      className={isActive('/decks') ? 'font-extrabold' : ''}
                      style={
                        isActive('/decks')
                          ? {
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              color: 'var(--text-primary)',
                            }
                          : {}
                      }
                    >
                      Decks
                    </span>
                  </Link>

                  {/* Play Now */}
                  <Link
                    to="/game/ai"
                    className={`relative flex items-center gap-3 px-3 py-0 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive('/game/ai') ? 'animate-border-glow' : ''
                    }`}
                    style={{
                      background: isActive('/game/ai')
                        ? 'var(--gradient-primary)'
                        : 'var(--bg-tertiary)',
                      color: isActive('/game/ai')
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      border: `1px solid ${isActive('/game/ai') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                      boxShadow: isActive('/game/ai') ? 'var(--shadow-md)' : 'none',
                    }}
                    onClick={() => {
                      handleNavClick('Play Now', '/game/ai');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Play
                      size={16}
                      className={isActive('/game/ai') ? 'animate-mystical-glow' : ''}
                    />
                    <span
                      className={isActive('/game/ai') ? 'font-extrabold' : ''}
                      style={
                        isActive('/game/ai')
                          ? {
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              color: 'var(--text-primary)',
                            }
                          : {}
                      }
                    >
                      Play Now
                    </span>
                  </Link>

                  {/* Online Sim */}
                  <Link
                    to="/game/online"
                    className={`relative flex items-center gap-3 px-3 py-0 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive('/game/online') ? 'animate-border-glow' : ''
                    }`}
                    style={{
                      background: isActive('/game/online')
                        ? 'var(--gradient-primary)'
                        : 'var(--bg-tertiary)',
                      color: isActive('/game/online')
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      border: `1px solid ${isActive('/game/online') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                      boxShadow: isActive('/game/online') ? 'var(--shadow-md)' : 'none',
                    }}
                    onClick={() => {
                      handleNavClick('Online Sim', '/game/online');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Gamepad2
                      size={16}
                      className={isActive('/game/online') ? 'animate-mystical-glow' : ''}
                    />
                    <span
                      className={isActive('/game/online') ? 'font-extrabold' : ''}
                      style={
                        isActive('/game/online')
                          ? {
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              color: 'var(--text-primary)',
                            }
                          : {}
                      }
                    >
                      Online Sim
                    </span>
                  </Link>

                  {/* Matchmaking */}
                  <Link
                    to="/matchmaking"
                    className={`relative flex items-center gap-3 px-3 py-0 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive('/matchmaking') ? 'animate-border-glow' : ''
                    }`}
                    style={{
                      background: isActive('/matchmaking')
                        ? 'var(--gradient-primary)'
                        : 'var(--bg-tertiary)',
                      color: isActive('/matchmaking')
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      border: `1px solid ${isActive('/matchmaking') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                      boxShadow: isActive('/matchmaking') ? 'var(--shadow-md)' : 'none',
                    }}
                    onClick={() => {
                      handleNavClick('Matchmaking', '/matchmaking');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Target
                      size={16}
                      className={isActive('/matchmaking') ? 'animate-mystical-glow' : ''}
                    />
                    <span
                      className={isActive('/matchmaking') ? 'font-extrabold' : ''}
                      style={
                        isActive('/matchmaking')
                          ? {
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              color: 'var(--text-primary)',
                            }
                          : {}
                      }
                    >
                      Matchmaking
                    </span>
                  </Link>

                  {/* Judge Center - only for judges */}
                  {hasJudgeAccess() && (
                    <Link
                      to="/judge-center"
                      className={`relative flex items-center gap-3 px-3 py-0 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive('/judge-center') ? 'animate-border-glow' : ''
                      }`}
                      style={{
                        background: isActive('/judge-center')
                          ? 'var(--gradient-primary)'
                          : 'var(--bg-tertiary)',
                        color: isActive('/judge-center')
                          ? 'var(--text-primary)'
                          : 'var(--text-secondary)',
                        border: `1px solid ${isActive('/judge-center') ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                        boxShadow: isActive('/judge-center') ? 'var(--shadow-md)' : 'none',
                      }}
                      onClick={() => {
                        handleNavClick('Judge Center', '/judge-center');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Shield
                        size={16}
                        className={isActive('/judge-center') ? 'animate-mystical-glow' : ''}
                      />
                      <span
                        className={isActive('/judge-center') ? 'font-extrabold' : ''}
                        style={
                          isActive('/judge-center')
                            ? {
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                color: 'var(--text-primary)',
                              }
                            : {}
                        }
                      >
                        Judge Center
                      </span>
                    </Link>
                  )}
                </nav>

                {/* Mobile User Menu */}
                <div
                  className="mt-6 pt-4"
                  style={{ borderTop: '1px solid var(--border-primary)' }}
                >
                  <div className="ancient-divider mb-4"></div>
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div
                        className="flex items-center justify-between px-3 py-0 whitespace-nowrap rounded-xl"
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-primary)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center animate-mystical-glow"
                            style={{
                              background: 'var(--gradient-primary)',
                              boxShadow: 'var(--shadow-md)',
                            }}
                          >
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.displayName}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <span
                                style={{
                                  color: 'var(--text-primary)',
                                  fontSize: '14px',
                                }}
                              >
                                {user.displayName?.charAt(0) || 'U'}
                              </span>
                            )}
                          </div>
                          <div>
                            <p
                              className="font-medium text-sm"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {user.displayName}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-0 whitespace-nowrap text-sm rounded-xl transition-all duration-200"
                        style={{
                          background: 'var(--bg-tertiary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-primary)',
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
                        className="flex items-center gap-3 px-3 py-0 whitespace-nowrap text-sm rounded-xl transition-all duration-200 w-full text-left"
                        style={{
                          background: 'var(--bg-tertiary)',
                          color: 'var(--accent-danger)',
                          border: '1px solid var(--border-danger)',
                        }}
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-0 whitespace-nowrap rounded-xl transition-all duration-200 w-full animate-mystical-glow"
                      style={{
                        background: 'var(--gradient-primary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--accent-primary)',
                        boxShadow: 'var(--shadow-md)',
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
      )}
      
      {/* Main Content */}
      <main
        className="flex-1 content-area"
        style={{
          background: 'var(--bg-primary)',
          minHeight: 'calc(100vh - 64px - 80px)', // Subtract header and footer heights
        }}
      >
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-primary)',
          marginTop: 'auto',
        }}
      >
        <div className="container py-6">
          <div className="ancient-divider mb-4"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="text-sm"
                style={{ color: 'var(--text-tertiary)' }}
              >
                © 2024 KONIVRER Ancient Archives. Built with{' '}
                <span className="animate-mystical-glow">✧</span> for the
                community.
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
      {/* ModernAuthModal - Temporarily disabled for debugging */}
      {/* 
      <ModernAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      */}

      {/* PWA Install Prompt - Temporarily disabled for debugging */}
      {/* {!isInstalled && <PWAInstallPrompt />} */}

      {/* Mobile Touch Controls - Temporarily disabled for debugging */}
      {/* 
      {showTouchControls && (
        <MobileTouchControls
          onCardAction={(action: string) => {
            console.log('Card action:', action);
            // Handle card actions for mobile gameplay
          }}
          onZoom={(factor: number) => {
            console.log('Zoom:', factor);
            // Handle zoom for mobile
          }}
          onRotate={(angle: number) => {
            console.log('Rotate:', angle);
            // Handle rotation for mobile
          }}
          onPan={(deltaX: number, deltaY: number) => {
            console.log('Pan:', deltaX, deltaY);
            // Handle panning for mobile
          }}
          gameState={{}}
          isPlayerTurn={true}
        />
      )}
      */}
    </div>
  );
};

// If mobile, wrap with MobileLayout
const LayoutWrapper: React.FC<LayoutProps> = ({ children, ...props }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
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
        <Layout {...props}>{children}</Layout>
      </MobileLayout>
    );
  }

  return <Layout {...props}>{children}</Layout>;
};

export { Layout, LayoutWrapper };
export default LayoutWrapper;