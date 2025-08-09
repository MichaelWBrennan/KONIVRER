import React, { useState, useEffect } from 'react';
import { detectDevice } from '../utils/deviceDetection';
import { LoginModal } from './LoginModal';
import './BubbleMenu.css';

interface BubbleMenuProps {
  currentPage: string;
  onPageChange: (page: 'home' | 'simulator' | 'cards' | 'decks' | 'deckbuilder' | 'tournaments' | 'social' | 'analytics' | 'events') => void;
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
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const device = detectDevice();

  // Load accessibility preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedContrast = localStorage.getItem('contrastMode') || 'normal';
    const savedDyslexicFont = localStorage.getItem('dyslexicFont') === 'true';
    
    setFontSize(savedFontSize);
    setContrastMode(savedContrast);
    setIsDyslexicFont(savedDyslexicFont);
    
    // Apply settings to document
    document.documentElement.setAttribute('data-font-size', savedFontSize);
    document.documentElement.setAttribute('data-contrast', savedContrast);
    document.documentElement.setAttribute('data-dyslexic-font', savedDyslexicFont.toString());
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
      case 'dyslexicFont':
        setIsDyslexicFont(value as boolean);
        localStorage.setItem('dyslexicFont', (value as boolean).toString());
        document.documentElement.setAttribute('data-dyslexic-font', (value as boolean).toString());
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
      case 'tournaments':
        return 'Search tournaments...';
      case 'social':
        return 'Search posts...';
      default:
        return 'Search...';
    }
  };

  const menuItems = [
    { id: 'home' as const, label: 'Home', icon: '🏠' },
    { id: 'cards' as const, label: 'Cards', icon: '🃏' },
    { id: 'decks' as const, label: 'Decks', icon: '📚' },
    { id: 'simulator' as const, label: 'Simulator', icon: '🎮' },
    { id: 'deckbuilder' as const, label: 'Rules', icon: '📜' },
    { id: 'tournaments' as const, label: 'Tournaments', icon: '🏆' },
    { id: 'social' as const, label: 'Social', icon: '👥' },
    { id: 'analytics' as const, label: 'Analytics', icon: '📊' }
  ];

  return (
    <div className={`bubble-menu ${device.isMobile ? 'mobile' : 'desktop'}`}>
      {/* Accessibility Settings Bubble */}
      <div className="bubble-container accessibility-bubble">
        <button
          className="bubble-btn accessibility-btn"
          onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
          aria-label="Accessibility Settings"
          aria-expanded={isAccessibilityOpen}
        >
          ♿
        </button>
        
        {isAccessibilityOpen && (
          <div className="bubble-panel accessibility-panel">
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
            
            <div className="setting-group">
              <label htmlFor="dyslexic-font">
                <input
                  type="checkbox"
                  id="dyslexic-font"
                  checked={isDyslexicFont}
                  onChange={(e) => handleAccessibilityChange('dyslexicFont', e.target.checked)}
                />
                OpenDyslexic Font
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Search Bubble */}
      <div className="bubble-container search-bubble">
        <button
          className="bubble-btn search-btn"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          aria-label="Search"
          aria-expanded={isSearchOpen}
        >
          🔍
        </button>
        
        {isSearchOpen && (
          <div className="bubble-panel search-panel">
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
      <div className="bubble-container login-bubble">
        <button
          className="bubble-btn login-btn"
          onClick={() => setIsLoginOpen(!isLoginOpen)}
          aria-label="User Profile"
          aria-expanded={isLoginOpen}
        >
          👤
        </button>
        
        {isLoginOpen && (
          <div className="bubble-panel login-panel">
            <div className="user-profile">
              <div className="user-avatar-large">👤</div>
              <h3>Player</h3>
              <p>Level 42</p>
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
            </div>
          </div>
        )}
      </div>

      {/* Burger Menu Bubble */}
      <div className="bubble-container menu-bubble">
        <button
          className="bubble-btn menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Main Menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        {isMenuOpen && (
          <div className="bubble-panel menu-panel">
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
                  <span className="menu-icon">{item.icon}</span>
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