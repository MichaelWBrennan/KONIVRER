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
} from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({  children, currentPage = 'home'  }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [orientation, setOrientation] = useState('portrait');
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
    {
      id: 'analytics',
      label: 'Stats',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/analytics',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings',
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
      {/* Status Bar */}
      <div
        className="bg-tertiary text-primary text-xs flex justify-between items-center px-4 relative z-50"
        style={{
          height: `${getStatusBarHeight()}px`,
          paddingLeft: `${safeAreaInsets.left + 16}px`,
          paddingRight: `${safeAreaInsets.right + 16}px`,
          background: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          borderBottom: '1px solid var(--border-primary)',
        }}
       />
        <div className="flex items-center space-x-2" />
          <span className="font-medium">KONIVRER</span>
          {!isOnline && (
            <div
              className="flex items-center space-x-1"
              style={{ color: 'var(--accent-warning)' }}
             />
              <WifiOff className="w-3 h-3" / />
              <span>Offline</span>
          )}
        </div>

        <div className="flex items-center space-x-2" />
          {isOnline ? (
            <Wifi
              className="w-3 h-3"
              style={{ color: 'var(--accent-success)' }}
            / />
          ) : (
            <WifiOff
              className="w-3 h-3"
              style={{ color: 'var(--accent-warning)' }}
            / />
          )}
          <Signal
            className="w-3 h-3"
            style={{ color: 'var(--accent-primary)' }}
          / />
          {batteryLevel !== null && (
            <div className="flex items-center space-x-1" />
              <Battery
                className="w-3 h-3"
                style={{ color: 'var(--accent-info)' }}
              / />
              <span>{batteryLevel}%</span>
          )}
        </div>

      {/* Header */}
      <header
        className="relative z-40"
        style={{
          paddingLeft: `${safeAreaInsets.left}px`,
          paddingRight: `${safeAreaInsets.right}px`,
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-md)',
        }}
       />
        <div className="flex items-center justify-between p-4" />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: 'var(--text-primary)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" / />
            ) : (
              <Menu className="w-6 h-6" / />
            )}

          <h1
            className="text-lg font-bold"
            style={{ color: 'var(--text-primary)' }}
           />
            {navigationItems.find(item => item.id === currentPage)?.label ||
              'KONIVRER'}

          <div
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: 'var(--shadow-md)',
            }}
           />
            <span
              style={{ color: 'var(--text-primary)' }}
              className="font-bold text-sm"
             />
              K
            </span>
        </div>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{ background: 'var(--bg-overlay)' }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 transform transition-transform duration-300 z-40 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          paddingTop: `${getStatusBarHeight()}px`,
          paddingLeft: `${safeAreaInsets.left}px`,
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-xl)',
          borderRight: '1px solid var(--border-primary)',
        }}
       />
        <div className="p-6" />
          <div className="flex items-center space-x-3 mb-8" />
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mystical-glow"
              style={{
                background: 'var(--gradient-primary)',
                boxShadow: 'var(--shadow-md)',
              }}
             />
              <span
                style={{ color: 'var(--text-primary)' }}
                className="font-bold text-lg"
               />
                K
              </span>
            <div />
              <h2
                className="font-bold"
                style={{ color: 'var(--text-primary)' }}
               />
                KONIVRER
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }} />
                Ancient Archives
              </p>
          </div>

          <nav className="space-y-2" />
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors`}
                style={{
                  color:
                    currentPage === item.id
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                  background:
                    currentPage === item.id
                      ? 'var(--gradient-primary)'
                      : 'var(--bg-tertiary)',
                  border: `1px solid ${currentPage === item.id ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                  boxShadow:
                    currentPage === item.id ? 'var(--shadow-md)' : 'none',
                }}
              >
                {item.icon}
                <span className="font-medium">{item.label}
              </button>
            ))}
          </nav>

          {/* Connection Status */}
          <div
            className="mt-8 p-4 rounded-lg"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
            }}
           />
            <div className="flex items-center space-x-2" />
              {isOnline ? (
                <>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--accent-success)' }}
                   />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                   />
                    Online
                  </span>
                </>
              ) : (
                <>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--accent-warning)' }}
                   />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                   />
                    Offline Mode
                  </span>
                </>
              )}
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--text-tertiary)' }}
             />
              {isOnline ? 'All features available' : 'Limited functionality'}
          </div>
      </div>

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
       />
        {children}

      {/* Bottom Navigation (Portrait only) */}
      {orientation === 'portrait' && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-30 mobile-nav"
          style={{
            paddingBottom: `${getBottomSafeArea()}px`,
            paddingLeft: `${safeAreaInsets.left}px`,
            paddingRight: `${safeAreaInsets.right}px`,
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-primary)',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
          }}
         />
          <div className="flex justify-around py-2" />
            {navigationItems.slice(0, 5).map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className="flex flex-col items-center p-2 rounded-lg transition-colors mobile-nav-item"
                style={{
                  background:
                    currentPage === item.id
                      ? 'var(--gradient-primary)'
                      : 'transparent',
                  color:
                    currentPage === item.id
                      ? 'var(--text-primary)'
                      : 'var(--text-tertiary)',
                  border:
                    currentPage === item.id
                      ? '1px solid var(--accent-primary)'
                      : 'none',
                  boxShadow:
                    currentPage === item.id ? 'var(--shadow-md)' : 'none',
                  textShadow:
                    currentPage === item.id
                      ? '0 1px 2px rgba(0, 0, 0, 0.5)'
                      : 'none',
                }}
              >
                {item.icon}
                <span className="text-xs mt-1 font-medium">{item.label}
              </button>
            ))}
          </div>
      )}
      {/* Landscape-specific adjustments */}
      <style jsx>{`
        .landscape {
          --content-padding: 1rem;
          background: var(--bg-primary);
        }

        .portrait {
          --content-padding: 1rem;
          padding-bottom: 80px; /* Space for bottom nav */
          background: var(--bg-primary);
        }

        .landscape-content {
          padding: var(--content-padding);
          height: calc(
            100vh - ${getStatusBarHeight()}px - 64px
          ); /* Status bar + header */
          overflow-y: auto;
          background: var(--bg-primary);
        }

        .portrait-content {
          padding: var(--content-padding);
          min-height: calc(
            100vh - ${getStatusBarHeight()}px - 64px - 80px
          ); /* Status bar + header + bottom nav */
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
  );
};

export default MobileLayout;