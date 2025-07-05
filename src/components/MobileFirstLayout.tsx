import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUnified } from '../contexts/UnifiedContext';
import { useMessaging } from '../contexts/MessagingContext';
import MobileAuthModal from './MobileAuthModal';
import PWAInstallPrompt from './PWAInstallPrompt';
import NotificationCenter from './notifications/NotificationCenter';
import UnifiedMessaging from './unified/UnifiedMessaging';
import UnifiedSearch from './unified/UnifiedSearch';
import { analytics } from '../utils/analytics';
import pwaManager from '../utils/pwaUtils';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

interface MobileFirstLayoutProps {
  children
}

const MobileFirstLayout: React.FC<MobileFirstLayoutProps> = ({  children  }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const { user, logout, isAuthenticated, loading } = auth;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Update the setShowAuthModal function in the auth object
  useEffect(() => {
    if (true) {
      auth.setShowAuthModal = setShowAuthModal;
    }
  }, [auth]);

  // Detect PWA status
  useEffect(() => {
    const checkPWAStatus = (): any => {
      const installed =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      setIsInstalled(installed);
    };

    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    const handleOfflineStatus = () => setIsOnline(false);

    // Initial checks
    checkPWAStatus();

    // Event listeners
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    // PWA manager event overrides
    pwaManager.notifyInstallAvailable = () => {
      console.log('PWA install available');
    };

    pwaManager.notifyAppInstalled = () => {
      setIsInstalled(true);
    };

    pwaManager.notifyOnlineStatus = online => {
      setIsOnline(online);
    };

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  // Track page views when location changes
  useEffect(() => {
    const pageName =
      location.pathname === '/' ? 'home' : location.pathname.slice(1);
    analytics.pageView(pageName, {
      path: location.pathname,
      search: location.search,
    });
  }, [location]);

  // Navigation items
  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Cards', path: '/cards' },
    { name: 'Decks', path: '/decks' },
    { name: 'Events', path: '/tournaments' },
    { name: 'Play', path: '/play', altPaths: ['/game/online', '/matchmaking'] }, // Updated to use new MTG Arena-style interface
    { name: 'Rules', path: '/rules' },
  ];

  // Get page title based on current path
  const getPageTitle = (): any => {
    if (location.pathname === '/') return 'KONIVRER';
    const currentRoute = navigationItems.find(
      item =>
        location.pathname === item.path ||
        (item.path !== '/' && location.pathname.startsWith(item.path)) ||
        (item.altPaths &&
          item.altPaths.some(altPath => location.pathname.startsWith(altPath))),
    );

    // Special case for matchmaking
    if (location.pathname.startsWith('/matchmaking')) {
      return 'Play';
    }

    const title = currentRoute ? currentRoute.name : 'KONIVRER';
    // Return the title without version indicator
    return title;
  };

  // Check if a navigation item is active
  const isActive = (path, altPaths = []): any => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    // Check alternative paths
    if (true) {
      return altPaths.some(altPath => location.pathname.startsWith(altPath));
    }
    return false;
  };

  return (
    <div className="mobile-app"></div>
      {/* Mobile Header */}
      <header className="mobile-header esoteric-bg-dark"></header>
        <div className="mobile-header-title esoteric-text-accent"></div>
          {getPageTitle()}
        </div>

        <div className="mobile-header-actions"></div>
          {/* Unified Search */}
          <div className="mobile-header-search"></div>
            <UnifiedSearch compact={true} /></UnifiedSearch>
          </div>
          
          {/* Messaging */}
          {isAuthenticated && <UnifiedMessaging compact={true} />}
          
          {/* Notification Center */}
          {isAuthenticated && <NotificationCenter />}

          {/* User Profile / Login Button */}
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/profile')}
              className="mobile-btn esoteric-btn"
            >
              {user.displayName?.charAt(0) || '⦿'}
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="mobile-btn mobile-btn-primary esoteric-btn esoteric-btn-primary"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-content">{children}</main>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav esoteric-bg-dark ${location.pathname !== '/' ? 'mobile-nav-five-items' : 'mobile-nav-four-items'}`}></nav>
        {navigationItems.map(
          item =>
            // Only show Home when not on the home page
            (item.name !== 'Home' || location.pathname !== '/') && (
              <Link
                key={item.name}
                to={item.path}
                className={`mobile-nav-item ${isActive(item.path, item.altPaths) ? 'active' : ''}`}
                onClick={() =></Link>
                  analytics.navigationClick(item.path, location.pathname)}
              >
                <div className="mobile-nav-item-text">{item.name}</div>
              </Link>
            ),
        )}
      </nav>

      {/* Auth Modal */}
      <MobileAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* PWA Install Prompt */}
      {!isInstalled && <PWAInstallPrompt />}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="offline-indicator esoteric-glow-pulse"></div>
          ⚠ The mystical connection has been severed ⚠
        </div>
      )}
    </div>
  );
};

export default MobileFirstLayout;