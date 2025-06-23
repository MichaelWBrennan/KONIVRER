import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MobileAuthModal from './MobileAuthModal';
import PWAInstallPrompt from './PWAInstallPrompt';
import { analytics } from '../utils/analytics';
import pwaManager from '../utils/pwaUtils';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

const MobileFirstLayout = ({ children }) => {
  const location = useLocation();
  const auth = useAuth();
  const { user, logout, isAuthenticated, loading } = auth;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Update the setShowAuthModal function in the auth object
  useEffect(() => {
    if (auth) {
      auth.setShowAuthModal = setShowAuthModal;
    }
  }, [auth]);

  // Detect PWA status
  useEffect(() => {
    const checkPWAStatus = () => {
      const installed = window.matchMedia('(display-mode: standalone)').matches || 
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

    pwaManager.notifyOnlineStatus = (online) => {
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
    { name: 'Play', path: '/game/online', altPaths: ['/matchmaking'] }, // Combined Play and Match
    { name: 'Rules', path: '/rules' }
  ];

  // Get page title based on current path
  const getPageTitle = () => {
    if (location.pathname === '/') return 'KONIVRER';
    
    const currentRoute = navigationItems.find(item => 
      location.pathname === item.path || 
      (item.path !== '/' && location.pathname.startsWith(item.path)) ||
      (item.altPaths && item.altPaths.some(altPath => location.pathname.startsWith(altPath)))
    );
    
    // Special case for matchmaking
    if (location.pathname.startsWith('/matchmaking')) {
      return 'Play';
    }
    
    return currentRoute ? currentRoute.name : 'KONIVRER';
  };

  // Check if a navigation item is active
  const isActive = (path, altPaths = []) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    // Check alternative paths
    if (altPaths && altPaths.length > 0) {
      return altPaths.some(altPath => location.pathname.startsWith(altPath));
    }
    return false;
  };

  return (
    <div className="mobile-app">
      {/* Mobile Header */}
      <header className="mobile-header esoteric-bg-dark">
        <div className="mobile-header-title esoteric-text-accent">{getPageTitle()}</div>
        
        {/* User Profile / Login Button */}
        {isAuthenticated ? (
          <button 
            onClick={() => window.location.href = '/profile'}
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
      </header>

      {/* Main Content */}
      <main className="mobile-content">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="mobile-nav esoteric-bg-dark">
        {navigationItems.map((item) => (
          // Only show Home when not on the home page
          (item.name !== 'Home' || location.pathname !== '/') && (
            <Link
              key={item.name}
              to={item.path}
              className={`mobile-nav-item ${isActive(item.path, item.altPaths) ? 'active' : ''}`}
              onClick={() => analytics.navigationClick(item.path, location.pathname)}
            >
              <div className="mobile-nav-item-text">
                {item.name}
              </div>
            </Link>
          )
        ))}
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
        <div className="offline-indicator esoteric-glow-pulse">
          ⚠ The mystical connection has been severed ⚠
        </div>
      )}
    </div>
  );
};

export default MobileFirstLayout;