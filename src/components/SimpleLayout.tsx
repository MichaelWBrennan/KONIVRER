import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ModernAuthModal from './ModernAuthModal';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

/**
 * SimpleLayout component with a top header showing only the logo
 * and a bottom navigation bar that includes the login button
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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000000' }}>
      {/* Top Header with Logo Only */}
      <header className="sticky top-0 z-50 p-4" style={{ background: '#000000' }}>
        <div className="container mx-auto flex justify-center items-center">
          <Link to="/" className="text-4xl font-bold text-white">KONIVRER</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation Bar with Login Button */}
      <footer className="sticky bottom-0 z-40 py-3" style={{ background: '#000000', borderTop: '1px solid #333' }}>
        <div className="container mx-auto">
          <nav className="flex justify-around items-center">
            <Link 
              to="/cards" 
              className={`text-center px-2 py-1 ${isActive('/cards') ? 'text-white font-bold' : 'text-gray-400'}`}
            >
              Cards
            </Link>
            <Link 
              to="/decks" 
              className={`text-center px-2 py-1 ${isActive('/decks') ? 'text-white font-bold' : 'text-gray-400'}`}
            >
              Decks
            </Link>
            <Link 
              to="/tournaments" 
              className={`text-center px-2 py-1 ${isActive('/tournaments') ? 'text-white font-bold' : 'text-gray-400'}`}
            >
              Tourna.
            </Link>
            <Link 
              to="/play" 
              className={`text-center px-2 py-1 ${isActive('/play') ? 'text-white font-bold' : 'text-gray-400'}`}
            >
              Play
            </Link>
            <Link 
              to="/rules" 
              className={`text-center px-2 py-1 ${isActive('/rules') ? 'text-white font-bold' : 'text-gray-400'}`}
            >
              Rules
            </Link>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className={`text-center px-2 py-1 text-gray-400`}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className={`text-center px-2 py-1 text-gray-400`}
              >
                Login
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