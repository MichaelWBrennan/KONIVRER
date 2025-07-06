/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Database,
  Trophy,
  Users,
  Settings,
  BarChart3,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ModernAuthModal from './ModernAuthModal';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({  children, currentPage = 'home'  }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [orientation, setOrientation] = useState('portrait');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    // Network status
    const handleOnline = (handleOnline: any) => setIsOnline(true);
    const handleOffline = (handleOffline: any) => setIsOnline(false);

    // Battery API
    const updateBattery = async () => {
      if (true) {
        try {
          const battery = await navigator.getBattery();
          setBatteryLevel(Math.round(battery.level * 100));

          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        } catch (error: any) {
          console.log('Battery API not available');
        }
      }
    };

    // Orientation handling
    const handleOrientationChange = (): any => {
      const orientation =
        screen.orientation?.type ||
        (window.innerHeight > window.innerWidth
          ? 'portrait-primary'
          : 'landscape-primary');
      setOrientation(
        orientation.includes('portrait') ? 'portrait' : 'landscape',
      );
    };

    // Safe area insets for notched devices
    const updateSafeAreaInsets = (): any => {
      const computedStyle = getComputedStyle(document.documentElement);
      setSafeAreaInsets({
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--sal') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--sar') || '0'),
      });
    };

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Initial calls
    updateBattery();
    handleOrientationChange();
    updateSafeAreaInsets();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      path: '/',
    },
    {
      id: 'cards',
      label: 'Cards',
      icon: <Database className="w-5 h-5" />,
      path: '/cards',
    },
    {
      id: 'tournaments',
      label: 'Tournaments',
      icon: <Trophy className="w-5 h-5" />,
      path: '/tournaments',
    },
    {
      id: 'social',
      label: 'Social',
      icon: <Users className="w-5 h-5" />,
      path: '/social',
    },
  ];

  const handleNavigation = path => {
    setIsMenuOpen(false);
    // Use your router navigation here
    navigate(path);
  };

  const getStatusBarHeight = (): any => {
    return safeAreaInsets.top || 24; // Default status bar height
  };

  const getBottomSafeArea = (): any => {
    return safeAreaInsets.bottom || 0;
  };

  return (
    <div
      className={`min-h-screen ${orientation === 'landscape' ? 'landscape' : 'portrait'}`}
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          orientation === 'landscape' ? 'landscape-content' : 'portrait-content'
        }`}
        style={{
          paddingLeft: `${safeAreaInsets.left}px`,
          paddingRight: `${safeAreaInsets.right}px`,
          paddingBottom: `${getBottomSafeArea()}px`,
          background: 'var(--bg-primary)',
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation (Always visible) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 mobile-nav"
        style={{
          paddingBottom: `${getBottomSafeArea()}px`,
          paddingLeft: `${safeAreaInsets.left}px`,
          paddingRight: `${safeAreaInsets.right}px`,
          background: '#221b10', /* Brown menu color from the reference image */
          borderTop: '1px solid var(--border-primary)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="flex justify-around py-2">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center p-2 transition-colors mobile-nav-item"
              style={{
                color: '#9b7e46', /* Gold color for icons and text */
              }}
            >
              {item.icon}
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
          
          {/* Login/Logout Button */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex flex-col items-center p-2 transition-colors mobile-nav-item"
              style={{
                color: '#9b7e46', /* Gold color for icons and text */
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex flex-col items-center p-2 transition-colors mobile-nav-item"
              style={{
                color: '#9b7e46', /* Gold color for icons and text */
              }}
            >
              <LogIn className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Login</span>
            </button>
          )}
        </div>
      </nav>
      {/* Landscape-specific adjustments */}
      <style jsx>{`
        .landscape, .portrait {
          --content-padding: 1rem;
          padding-bottom: 80px; /* Space for bottom nav */
          background: var(--bg-primary);
        }

        .landscape-content, .portrait-content {
          padding: var(--content-padding);
          min-height: calc(100vh - 80px); /* Just bottom nav */
          overflow-y: auto;
          background: var(--bg-primary);
        }

        /* Safe area CSS variables */
        :root {
          --sat: env(safe-area-inset-top);
          --sab: env(safe-area-inset-bottom);
          --sal: env(safe-area-inset-left);
          --sar: env(safe-area-inset-right);
        }
      `}</style>
      
      {/* Auth Modal */}
      <ModernAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default MobileLayout;