import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ModernAuthModal from './ModernAuthModal';
import PWAInstallPrompt from './PWAInstallPrompt';
import { analytics } from '../utils/analytics';
import pwaManager from '../utils/pwaUtils';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

const MobileFirstLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
    { name: 'Play', path: '/game/online' },
    { name: 'Match', path: '/matchmaking' }
  ];

  // Get page title based on current path
  const getPageTitle = () => {
    if (location.pathname === '/') return 'KONIVRER';
    
    const currentRoute = navigationItems.find(item => 
      location.pathname === item.path || 
      (item.path !== '/' && location.pathname.startsWith(item.path))
    );
    
    if (!currentRoute) return 'KONIVRER';
    
    // Return esoteric names for pages
    switch (currentRoute.name) {
      case 'Home': return 'The Sanctum';
      case 'Cards': return 'Ancient Tomes';
      case 'Decks': return 'Mystical Grimoires';
      case 'Play': return 'Arcane Summoning';
      case 'Match': return 'Ritual Circle';
      default: return currentRoute.name;
    }
  };

  // Check if a navigation item is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
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
            Commune
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
          <Link
            key={item.name}
            to={item.path}
            className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => analytics.navigationClick(item.path, location.pathname)}
          >
            <div className="mobile-nav-item-text">
              {item.name === 'Home' && 'Sanctum'}
              {item.name === 'Cards' && 'Tomes'}
              {item.name === 'Decks' && 'Grimoires'}
              {item.name === 'Play' && 'Summon'}
              {item.name === 'Match' && 'Ritual'}
            </div>
          </Link>
        ))}
      </nav>

      {/* Auth Modal */}
      <ModernAuthModal
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