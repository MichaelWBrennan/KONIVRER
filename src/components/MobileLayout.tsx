import React from 'react';
import MobileNavigation from './MobileNavigation';
import PWAInstallPrompt from './PWAInstallPrompt';
import OrientationHandler from './OrientationHandler';
import { useTouchGestures } from '../hooks/useTouchGestures';
import './MobileLayout.css';

interface MobileLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  preferredOrientation?: 'portrait' | 'landscape' | 'any';
  enableSwipeGestures?: boolean;
  onSwipe?: (direction: { direction: 'left' | 'right' | 'up' | 'down' | null; distance: number; velocity: number }) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  showNavigation = true,
  preferredOrientation = 'any',
  enableSwipeGestures = true,
  onSwipe
}) => {
  // Default navigation items (can be customized based on app needs)
  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/' },
    { id: 'decks', label: 'Decks', icon: '🎴', path: '/decks' },
    { id: 'tournaments', label: 'Tournaments', icon: '🏆', path: '/tournaments', badge: 2 },
    { id: 'social', label: 'Social', icon: '👥', path: '/social' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' }
  ];

  const { handlers } = useTouchGestures({
    enableSwipe: enableSwipeGestures,
    onSwipe: onSwipe,
    minSwipeDistance: 100
  });

  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
    // In a real app, this would use React Router or similar
    // For now, just log the navigation
  };

  return (
    <OrientationHandler preferredOrientation={preferredOrientation}>
      <div className="mobile-layout" {...(enableSwipeGestures ? handlers : {})}>
        {/* Safe area top spacer */}
        <div className="safe-area-spacer-top" />
        
        {/* Mobile Navigation */}
        {showNavigation && (
          <MobileNavigation
            items={navigationItems}
            currentPath={window.location.pathname}
            onNavigate={handleNavigate}
          />
        )}
        
        {/* Main Content */}
        <main className="mobile-main-content">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
        
        {/* Safe area bottom spacer (accounts for navigation) */}
        <div className="safe-area-spacer-bottom" />
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
    </OrientationHandler>
  );
};

export default MobileLayout;