/**
 * KONIVRER Unified Layout Component
 * 
 * A modern, properly typed layout component that provides consistent
 * navigation and structure across the application.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

import React, { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Database,
  Layers,
  Trophy,
  Play,
  LogIn,
  User,
  Menu,
  X,
} from 'lucide-react';

// Types
interface UnifiedLayoutProps {
  children: ReactNode;
  variant?: 'standard' | 'simple' | 'mobile' | 'golden';
  currentPage?: string;
  className?: string;
  showFooter?: boolean;
}

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// Navigation items
const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'cards', label: 'Cards', path: '/cards', icon: Database },
  { id: 'decks', label: 'Decks', path: '/decks', icon: Layers },
  { id: 'tournaments', label: 'Tournaments', path: '/tournaments', icon: Trophy },
  { id: 'play', label: 'Play', path: '/play', icon: Play },
];

/**
 * Golden Menu Bar Component
 */
const GoldenMenuBar: React.FC<{
  onLoginClick: () => void;
  className?: string;
}> = ({ onLoginClick, className = '' }) => {
  const location = useLocation();

  const isActiveRoute = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className={`bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b-2 border-yellow-600 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
        borderBottom: '2px solid #d4af37',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-yellow-500">
              KONIVRER
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActiveRoute(item.path);
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-yellow-600 text-black'
                        : 'text-yellow-400 hover:bg-yellow-600 hover:text-black'
                    }`}
                  >
                    <IconComponent size={18} className="mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <button
              onClick={onLoginClick}
              className="flex items-center px-4 py-2 border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-black transition-all duration-200"
            >
              <LogIn size={18} className="mr-2" />
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-yellow-400 hover:text-yellow-300">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

/**
 * Standard Menu Bar Component
 */
const StandardMenuBar: React.FC<{
  onLoginClick: () => void;
  className?: string;
}> = ({ onLoginClick, className = '' }) => {
  const location = useLocation();

  const isActiveRoute = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`bg-gray-800 border-b border-gray-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-400">
              KONIVRER
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActiveRoute(item.path);
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    <IconComponent size={18} className="mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <button
              onClick={onLoginClick}
              className="flex items-center px-4 py-2 border border-blue-500 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
              <LogIn size={18} className="mr-2" />
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-400 hover:text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

/**
 * Main Unified Layout Component
 */
export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  variant = 'standard',
  currentPage = 'home',
  className = '',
  showFooter = true,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLoginClick = (): void => {
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = (): void => {
    setShowAuthModal(false);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-900 text-white ${className}`}>
      {/* Navigation */}
      {variant === 'golden' ? (
        <GoldenMenuBar onLoginClick={handleLoginClick} />
      ) : (
        <StandardMenuBar onLoginClick={handleLoginClick} />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-gray-800 border-t border-gray-700 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-400">
              <p>&copy; 2024 KONIVRER Deck Database. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Login</h2>
              <button
                onClick={handleCloseAuthModal}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-300 mb-4">Authentication coming soon...</p>
              <button
                onClick={handleCloseAuthModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedLayout;