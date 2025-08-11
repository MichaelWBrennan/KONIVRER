import React, { useState, useEffect } from 'react';
import { detectDevice } from '../utils/deviceDetection';
import { LoginModal } from './LoginModal';
import { useAuth } from '../hooks/useAuth';
import { 
  AccessibilityIcon, 
  SearchIcon, 
  ProfileIcon, 
  MenuIcon
} from './EsotericIcons';
import './BubbleMenu.css';

interface BubbleMenuProps {
  currentPage: string;
  onPageChange: (page: 'home' | 'simulator' | 'cards' | 'decks' | 'deckbuilder' | 'analytics' | 'events' | 'my-decks' | 'rules' | 'judge') => void;
  onSearch?: (query: string) => void;
}

export const BubbleMenu: React.FC<BubbleMenuProps> = ({ 
  currentPage, 
  onPageChange, 
  onSearch 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState('medium');
  const [contrastMode, setContrastMode] = useState('normal');
  const device = detectDevice();
  const { 
    isAuthenticated, 
    user, 
    canAccessJudgePortal, 
    logout, 
    isJudge,
    getJudgeLevel 
  } = useAuth();

  // Load accessibility preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedContrast = localStorage.getItem('contrastMode') || 'normal';
    
    // Clean up old dyslexicFont setting since it's no longer needed
    localStorage.removeItem('dyslexicFont');
    
    setFontSize(savedFontSize);
    setContrastMode(savedContrast);
    
    // Apply settings to document
    document.documentElement.setAttribute('data-font-size', savedFontSize);
    document.documentElement.setAttribute('data-contrast', savedContrast);
    // OpenDyslexic font is now always applied via CSS
  }, []);

  const handleAccessibilityChange = (setting: string, value: string | boolean) => {
    switch (setting) {
      case 'fontSize':
        setFontSize(value as string);
        localStorage.setItem('fontSize', value as string);
        document.documentElement.setAttribute('data-font-size', value as string);
        break;
      case 'contrast':
        setContrastMode(value as string);
        localStorage.setItem('contrastMode', value as string);
        document.documentElement.setAttribute('data-contrast', value as string);
        break;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const getSearchPlaceholder = () => {
    switch (currentPage) {
      case 'cards':
        return 'Search cards...';
      case 'decks':
        return 'Search decks...';
      case 'my-decks':
        return 'Search my decks...';
      case 'tournaments':
        return 'Search tournaments...';
      case 'companion':
        return 'Search events...';
      default:
        return 'Search...';
    }
  };

  const menuItems = [
    // Only show Home when not on home page
    ...(currentPage !== 'home' ? [{ id: 'home' as const, label: 'Home' }] : []),
    { id: 'cards' as const, label: 'Card Search' },
    { id: 'decks' as const, label: 'Deck Search' },
    // Only show My Decks when logged in
    ...(isAuthenticated ? [{ id: 'my-decks' as const, label: 'My Decks' }] : []),
    { id: 'simulator' as const, label: 'Simulator' },
    { id: 'rules' as const, label: 'Rules' },
    // Only show Judge Portal to authenticated judges and admins
    ...(canAccessJudgePortal() ? [{ id: 'judge' as const, label: 'Judge Portal' }] : []),
    { id: 'events' as const, label: 'Events' }
    // Combined tournaments and companion functionality into unified Events
  ];

  return (
    <div className={`bubble-menu ${device.isMobile ? 'mobile' : 'desktop'}`}>
      {/* Accessibility Settings Bubble */}
      <div key="accessibility-bubble" className="bubble-container accessibility-bubble">
        <button
          className="bubble-btn accessibility-btn"
          onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
          aria-label="Accessibility Settings"
          aria-expanded={isAccessibilityOpen}
        >
          <AccessibilityIcon size={20} />
        </button>
        
        {isAccessibilityOpen && (
          <div className="bubble-panel accessibility-panel">
            <button
              className="panel-close-btn"
              onClick={() => setIsAccessibilityOpen(false)}
              aria-label="Close accessibility settings"
            >
              ✕
            </button>
            <h3>Accessibility Settings</h3>
            
            <div className="setting-group">
              <label htmlFor="font-size">Font Size:</label>
              <select
                id="font-size"
                value={fontSize}
                onChange={(e) => handleAccessibilityChange('fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label htmlFor="contrast">Contrast:</label>
              <select
                id="contrast"
                value={contrastMode}
                onChange={(e) => handleAccessibilityChange('contrast', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="high">High Contrast</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Search Bubble */}
      <div key="search-bubble" className="bubble-container search-bubble">
        <button
          className="bubble-btn search-btn"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          aria-label="Search"
          aria-expanded={isSearchOpen}
        >
          <SearchIcon size={20} />
        </button>
        
        {isSearchOpen && (
          <div className="bubble-panel search-panel">
            <button
              className="panel-close-btn"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              ✕
            </button>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              <button type="submit" className="search-submit-btn">Search</button>
            </form>
          </div>
        )}
      </div>

      {/* Login/Profile Bubble */}
      <div key="login-bubble" className="bubble-container login-bubble">
        <button
          className="bubble-btn login-btn"
          onClick={() => setIsLoginOpen(!isLoginOpen)}
          aria-label="User Profile"
          aria-expanded={isLoginOpen}
        >
          <ProfileIcon size={20} />
        </button>
        
        {isLoginOpen && (
          <div className="bubble-panel login-panel">
            <button
              className="panel-close-btn"
              onClick={() => setIsLoginOpen(false)}
              aria-label="Close login panel"
            >
              ✕
            </button>
            <div className="user-profile">
              <div className="user-avatar-large">
                <ProfileIcon size={32} />
              </div>
              {isAuthenticated ? (
                <>
                  <h3>{user?.displayName || user?.username || 'User'}</h3>
                  <p>
                    {isJudge() ? `Judge Level ${getJudgeLevel()}` : 'Player'} • 
                    Level {user?.eloRating ? Math.floor(user.eloRating / 100) : 1}
                  </p>
                  <p style={{ fontSize: '0.8em', color: '#666' }}>
                    {user?.rankTier || 'Bronze'} Tier
                  </p>
                  <div className="user-actions">
                    <button 
                      className="btn btn-small btn-secondary"
                      onClick={async () => {
                        await logout();
                        setIsLoginOpen(false);
                      }}
                    >
                      Logout
                    </button>
                    <button className="btn btn-small btn-secondary">Settings</button>
                  </div>
                </>
              ) : (
                <>
                  <h3>Not Logged In</h3>
                  <p>Sign in to access all features</p>
                  <div className="user-actions">
                    <button 
                      className="btn btn-small"
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsLoginOpen(false);
                      }}
                    >
                      Login
                    </button>
                    <button className="btn btn-small btn-secondary">Settings</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Burger Menu Bubble */}
      <div key="menu-bubble" className="bubble-container menu-bubble">
        <button
          className="bubble-btn menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Main Menu"
          aria-expanded={isMenuOpen}
        >
          <MenuIcon size={20} />
        </button>
        
        {isMenuOpen && (
          <div className="bubble-panel menu-panel">
            <button
              className="panel-close-btn"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            <nav className="menu-nav">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="menu-label">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};