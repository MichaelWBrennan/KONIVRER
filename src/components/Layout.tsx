import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BaseComponentProps } from '../types';

interface LayoutProps extends BaseComponentProps {
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '', 
  showNavigation = true 
}) => {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    setShowAuthModal(true);
    // In a real implementation, this would open the ModernAuthModal component
    alert('Login functionality is not fully implemented yet.');
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
                >
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
                >
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
                >
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
                >
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
                >
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
                >
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
                >
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
              </nav>

              {/* User Menu */}
              <div className="flex items-center gap-2 xl:gap-4 flex-shrink-0">
                {/* Login Button */}
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
                  <span>Login</span>
                </button>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export { Layout };
export default Layout;