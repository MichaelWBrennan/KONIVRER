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
import * as bm from './bubbleMenu.css.ts';

interface BubbleMenuProps {
  currentPage: string;
  onPageChange: (page: 'home' | 'simulator' | 'cards' | 'decks' | 'deckbuilder' | 'analytics' | 'events' | 'my-decks' | 'rules' | 'judge') => void;
  onSearch?: (query: string) => void;
}

export const BubbleMenu: React.FC<BubbleMenuProps> : any : any = ({ 
  currentPage, 
  onPageChange, 
  onSearch 
}) => {
  const [isMenuOpen, setIsMenuOpen]  : any : any = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen]  : any : any = useState(false);
  const [isSearchOpen, setIsSearchOpen]  : any : any = useState(false);
  const [isLoginOpen, setIsLoginOpen]  : any : any = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen]  : any : any = useState(false);
  const [searchQuery, setSearchQuery]  : any : any = useState('');
  const [fontSize, setFontSize]  : any : any = useState('medium');
  const [contrastMode, setContrastMode]  : any : any = useState('normal');
  const device  : any : any = detectDevice();
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
    const savedFontSize  : any : any = localStorage.getItem('fontSize') || 'medium';
    const savedContrast  : any : any = localStorage.getItem('contrastMode') || 'normal';
    
    // Clean up old dyslexicFont setting since it's no longer needed
    localStorage.removeItem('dyslexicFont');
    
    setFontSize(savedFontSize);
    setContrastMode(savedContrast);
    
    // Apply settings to document
    document.documentElement.setAttribute('data-font-size', savedFontSize);
    document.documentElement.setAttribute('data-contrast', savedContrast);
    // OpenDyslexic font is now always applied via CSS
  }, []);

  const handleAccessibilityChange  : any : any = (setting: string, value: string | boolean) => {
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

  const handleSearch  : any : any = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const getSearchPlaceholder  : any : any = () => {
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

  // Helper function to close all panels except the specified one
  const closeOtherPanels  : any : any = (keepOpen: string) => {
    if (keepOpen !== 'accessibility') setIsAccessibilityOpen(false);
    if (keepOpen !== 'search') setIsSearchOpen(false);
    if (keepOpen !== 'login') setIsLoginOpen(false);
    if (keepOpen !== 'menu') setIsMenuOpen(false);
  };

  const menuItems  : any : any = [
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
    <div className={`${bm.root} ${device.isMobile ? bm.mobile : bm.desktop}`}>
      {/* Accessibility Settings Bubble */}
      <div key="accessibility-bubble" className={`accessibility-bubble`}>
        <button
          className={`${bm.bubbleBtn} ${bm.accessibilityBtn}`}
          onClick={() => {
            closeOtherPanels('accessibility');
            setIsAccessibilityOpen(!isAccessibilityOpen);
          }}
          aria-label="Accessibility Settings"
          aria-expanded={isAccessibilityOpen}
        >
          <AccessibilityIcon size={20} />
        </button>
        
        {isAccessibilityOpen && (
          <div className={`${bm.panel} accessibility-panel`}>
            <button
              className={bm.panelCloseBtn}
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
      <div key="search-bubble" className={`search-bubble`}>
        <button
          className={`${bm.bubbleBtn} ${bm.searchBtn}`}
          onClick={() => {
            closeOtherPanels('search');
            setIsSearchOpen(!isSearchOpen);
          }}
          aria-label="Search"
          aria-expanded={isSearchOpen}
        >
          <SearchIcon size={20} />
        </button>
        
        {isSearchOpen && (
          <div className={`${bm.panel} search-panel`}>
            <button
              className={bm.panelCloseBtn}
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
      <div key="login-bubble" className={`login-bubble`}>
        <button
          className={`${bm.bubbleBtn} ${bm.loginBtn}`}
          onClick={() => {
            closeOtherPanels('login');
            setIsLoginOpen(!isLoginOpen);
          }}
          aria-label="User Profile"
          aria-expanded={isLoginOpen}
        >
          <ProfileIcon size={20} />
        </button>
        
        {isLoginOpen && (
          <div className={`${bm.panel} login-panel`}>
            <button
              className={bm.panelCloseBtn}
              onClick={() => setIsLoginOpen(false)}
              aria-label="Close login panel"
            >
              ✕
            </button>
            <div className={bm.userProfile}>
              <div className={bm.userAvatarLarge}>
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
                  <div className={bm.userActions}>
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
                  <div className={bm.userActions}>
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
      <div key="menu-bubble" className={`menu-bubble`}>
        <button
          className={`${bm.bubbleBtn} ${bm.menuBtn}`}
          onClick={() => {
            closeOtherPanels('menu');
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Main Menu"
          aria-expanded={isMenuOpen}
        >
          <MenuIcon size={20} />
        </button>
        
        {isMenuOpen && (
          <div className={`${bm.panel} menu-panel`}>
            <button
              className={bm.panelCloseBtn}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            <nav className={bm.menuNav}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`${bm.menuItem} ${currentPage === item.id ? bm.menuItemActive : ''}`}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                >
                  <span className={bm.menuLabel}>{item.label}</span>
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