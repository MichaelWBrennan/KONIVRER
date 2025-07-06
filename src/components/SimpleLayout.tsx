import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, Home, Database, Trophy, Play, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ModernAuthModal from './ModernAuthModal';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

/**
 * SimpleLayout component with a bottom menu bar that includes the login button
 */
const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={16} />,
      path: '/',
    },
    {
      id: 'cards',
      label: 'Cards',
      icon: <Database size={16} />,
      path: '/cards',
    },
    {
      id: 'decks',
      label: 'Decks',
      icon: <BookOpen size={16} />,
      path: '/decks',
    },
    {
      id: 'tournaments',
      label: 'Tourna.',
      icon: <Trophy size={16} />,
      path: '/tournaments',
    },
    {
      id: 'play',
      label: 'Play',
      icon: <Play size={16} />,
      path: '/play',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000000' }}>
      {/* Main Content */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <footer 
        className="fixed bottom-0 left-0 right-0 z-40 py-2" 
        style={{ 
          background: 'var(--bg-secondary, #000000)', 
          borderTop: '1px solid var(--border-primary, #333)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="container mx-auto">
          <nav className="flex justify-around items-center">
            {navigationItems.map(item => (
              <Link 
                key={item.id}
                to={item.path} 
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive(item.path) ? 'text-white' : 'text-gray-400'
                }`}
                style={{
                  background: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex flex-col items-center p-2 rounded-lg transition-colors text-gray-400"
              >
                <LogOut size={16} />
                <span className="text-xs mt-1">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex flex-col items-center p-2 rounded-lg transition-colors text-gray-400"
              >
                <LogIn size={16} />
                <span className="text-xs mt-1">Login</span>
              </button>
            )}
          </nav>
        </div>
      </footer>

      {/* Auth Modal */}
      <ModernAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default SimpleLayout;