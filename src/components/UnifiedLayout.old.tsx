/**
 * KONIVRER Unified Layout Component
 * 
 * A unified layout component that combines functionality from:
 * - Layout
 * - MobileLayout
 * - SimpleMobileLayout
 * - MobileFirstLayout
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BaseComponentProps } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useUnified } from '../contexts/UnifiedContext';
import { useMessaging } from '../contexts/MessagingContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import UnifiedAuthModal from './UnifiedAuthModal';
// import GoldenMenuBar from './GoldenMenuBar';

import PWAInstallPrompt from './PWAInstallPrompt';
import NotificationCenter from './notifications/NotificationCenter';
import UnifiedMessaging from './unified/UnifiedMessaging';
import UnifiedSearch from './unified/UnifiedSearch';
import { analytics } from '../utils/analytics';
import pwaManager from '../utils/pwaUtils';

// Import styles
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

// Import icons
import { Home, Database, BookOpen, User, Users, Menu, X, Trophy, LogIn, LogOut, Settings, Layers, Play, BarChart3, Wifi, WifiOff, Battery, Signal, Bell, Search } from 'lucide-react';

// Unified interface for all layout variants
interface UnifiedLayoutProps {
  children?: React.ReactNode;
  currentPage?: string;
  variant?: 'standard' | 'mobile' | 'simple' | 'mobile-first' | 'golden';
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showNavigation?: boolean;
  className?: string
  
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
    children,
  currentPage = 'home',
  variant = 'standard',
  showSidebar = true,
  showHeader = true,
  showFooter = true,
  showNavigation = true,
  className = ''
  }) => {
    // Detect if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const actualVariant = variant === 'standard' && isMobile ? 'mobile' : variant;
  
  // Common hooks
  const location = useLocation() {
    const navigate = useNavigate() {
  }
  const auth = useAuth() {
    const { user, logout, isAuthenticated, loading 
  } = auth;
  
  // Common state
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [orientation, setOrientation] = useState(false)
  const [safeAreaInsets, setSafeAreaInsets] = useState(false)
  
  // Update the setShowAuthModal function in the auth object
  useEffect(() => {
    if (auth && typeof auth.setShowAuthModal === 'function') {
    auth.setShowAuthModal = setShowAuthModal
  
  }
  }, [auth]);
  
  // Detect PWA status
  useEffect(() => {
    const checkPWAStatus = () => {
    const installed =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsInstalled(installed)
  
  };
    
    checkPWAStatus() {
    window.addEventListener(() => {
    return () => {
    window.removeEventListener('appinstalled', checkPWAStatus)
  
  })
  }, [
    );
  
  // Network status
  useEffect(() => {
    const handleOnline = () => setIsOnline() {
    const handleOffline = () => setIsOnline() {
  }
    
    window.addEventListener() {
    window.addEventListener() {
  }
    
    return () => {
    window.removeEventListener() {
    window.removeEventListener('offline', handleOffline)
  
  }
  }, [
  ]);
  
  // Battery status
  useEffect(() => {
    const getBatteryInfo = async () => {
    try {
  }
        if ('getBattery' in navigator) {
    const battery = await (navigator as any).getBattery() {
  }
          setBatteryLevel(() => {
    battery.addEventListener('levelchange', () => {
    setBatteryLevel(battery.level * 100)
  }))
        }
      } catch (error) {
    console.error('Battery API not supported', error)
  }
    };
    
    getBatteryInfo()
  }, [
    );
  
  // Orientation
  useEffect(() => {
    const handleOrientationChange = () => {
    setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      )
  
  };
    
    handleOrientationChange() {
    window.addEventListener(() => {
    return () => {
    window.removeEventListener('resize', handleOrientationChange)
  
  })
  }, [
  ]);
  
  // Safe area insets for notched devices
  useEffect(() => {
    const updateSafeAreaInsets = () => {
    const style = window.getComputedStyle() {
  }
      const top = parseInt(style.getPropertyValue('--sat') || '0', 10);
      const bottom = parseInt(style.getPropertyValue('--sab') || '0', 10);
      const left = parseInt(style.getPropertyValue('--sal') || '0', 10);
      const right = parseInt(style.getPropertyValue('--sar') || '0', 10);
      
      setSafeAreaInsets({ top, bottom, left, right })
    };
    
    updateSafeAreaInsets() {
    window.addEventListener(() => {
    return () => {
    window.removeEventListener('resize', updateSafeAreaInsets)
  
  })
  }, [
    );
  
  // Analytics
  useEffect(() => {
    analytics.trackPageView(location.pathname)
  }, [location
  ]);
  
  // Navigation items
  const navigationItems = [
    {
    id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5"  />,
      path: '/'
  },
    {
    id: 'cards',
      label: 'Cards',
      icon: <Database className="w-5 h-5"  />,
      path: '/cards'
  },
    {
    id: 'decks',
      label: 'Decks',
      icon: <Layers className="w-5 h-5"  />,
      path: '/decks'
  },
    {
    id: 'tournaments',
      label: 'Tournaments',
      icon: <Trophy className="w-5 h-5"  />,
      path: '/tournaments'
  },
    {
    id: 'play',
      label: 'Play',
      icon: <Play className="w-5 h-5"  />,
      path: '/play'
  },
    {
    id: 'social',
      label: 'Social',
      icon: <Users className="w-5 h-5"  />,
      path: '/social'
  },
    {
    id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5"  />,
      path: '/analytics'
  },
    {
    id: 'rules',
      label: 'Rules',
      icon: <BookOpen className="w-5 h-5"  />,
      path: '/rules'
  },
    {
    id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5"  />,
      path: '/profile'
  },
    {
    id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5"  />,
      path: '/settings'
  }
  ];
  
  // Handle login/logout
  const handleAuthAction = () => {
    if (isAuthenticated) {
    logout()
  
  } else {
    setShowAuthModal(true)
  }
  };
  
  // Render simple mobile layout
  const renderSimpleMobileLayout = () => {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white" /></div>
        {/* Content */
  }
        <main className="flex-1" /></main>
          {children}
        </main>
        
        {/* Bottom Navigation */}
        {showNavigation && (
          <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-2 py-1" />
    <div className="flex justify-around" /></div>
              {navigationItems.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  className={`flex flex-col items-center p-2 ${
    currentPage === item.id`
                      ? 'text-blue-400'` : null`
                      : 'text-gray-400 hover:text-white'```
  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    )
  };
  
  // Render mobile layout
  const renderMobileLayout = () => {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white" /></div>
        {/* Header */
  }
        {showHeader && (
          <header className="bg-gray-800 border-b border-gray-700 p-4" />
    <div className="flex justify-between items-center" />
    <div className="text-xl font-bold">KONIVRER</div>
              
              <div className="flex items-center space-x-3" /></div>
                {/* Status indicators */}
                <div className="flex items-center space-x-2 text-xs text-gray-400" /></div>
                  {isOnline ? (
                    <Wifi size={14} className="text-green-400"  / /></Wifi> : null
                  ) : (
                    <WifiOff size={14} className="text-red-400"  / /></WifiOff>
                  )}
                  
                  {batteryLevel !== null && (
                    <div className="flex items-center" />
    <Battery size={14}  / />
    <span>{Math.round(batteryLevel)}%</span>
                    </div>
                  )}
                  
                  <Signal size={14}  / /></Signal>
                </div>
                
                {/* Menu button */}
                <button
                  className="p-2 rounded-full hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={20}  /> : <Menu size={20}  />}
                </button>
              </div>
            </div>
          </header>
        )}
        
        {/* Slide-out menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" />
    <div className="absolute right-0 top-0 h-full w-3/4 bg-gray-800 p-4 overflow-y-auto" />
    <div className="flex justify-between items-center mb-6" />
    <div className="text-xl font-bold">Menu</div>
                <button
                  className="p-2 rounded-full hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X size={20}  / /></X>
                </button>
              </div>
              
              <nav className="space-y-1" /></nav>
                {navigationItems.map((item) => (`
                  <button``
                    key={item.id}```
                    className={`flex items-center w-full p-3 rounded-lg ${
    currentPage === item.id`
                        ? 'bg-blue-600 text-white'` : null`
                        : 'text-gray-300 hover:bg-gray-700'```
  }`}
                    onClick={() => {
    navigate() {
    setIsMenuOpen(false)
  
  }}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </button>
                ))}
                
                <div className="h-px bg-gray-700 my-3" />
    <button
                  className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-700"
                  onClick={handleAuthAction}
                 /></button>
                  {isAuthenticated ? (
                    <any />
    <LogOut size={20}  / />
    <span className="ml-3">Logout</span>
                    </> : null
                  ) : (
                    <any />
    <LogIn size={20}  / />
    <span className="ml-3">Login</span>
                    </>
                  )}
                </button>
              </nav>
            </div>
          </div>
        )}
        
        {/* Content */}
        <main className="flex-1 p-4 pb-16" /></main>
          {children}
        </main>
        
        {/* Bottom Navigation */}
        {showNavigation && (
          <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-2 py-1" />
    <div className="flex justify-around" /></div>
              {navigationItems.slice(0, 5).map((item) => (`
                <button``
                  key={item.id}```
                  className={`flex flex-col items-center p-2 ${
    currentPage === item.id`
                      ? 'text-blue-400'` : null`
                      : 'text-gray-400 hover:text-white'```
  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
        
        {/* Auth Modal */}
        {showAuthModal && (
          <UnifiedAuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    )
  };
  
  // Render mobile-first layout
  const renderMobileFirstLayout = () => {
    return (
      <div className="mobile-first-layout" /></div>
        {/* Header */
  }
        {showHeader && (
          <header className="app-header" />
    <div className="header-content" />
    <div className="logo">KONIVRER</div>
              
              <div className="header-actions" />
    <button className="icon-button" onClick={() => navigate('/search')}>
                  <Search size={20}  / /></Search>
                </button>
                
                <button className="icon-button" onClick={() => navigate('/notifications')}>
                  <Bell size={20}  / /></Bell>
                </button>
                
                <button
                  className="icon-button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={20}  /> : <Menu size={20}  />}
                </button>
              </div>
            </div>
          </header>
        )}
        
        {/* Slide-out menu */}
        {isMenuOpen && (
          <div className="menu-overlay" />
    <div className="menu-panel" />
    <div className="menu-header" />
    <div className="user-info" /></div>
                  {isAuthenticated ? (
                    <any />
    <div className="avatar" />
    <User size={24}  / /></User>
                      </div>
                      <div className="user-details" />
    <div className="username">{user?.displayName || 'User'}</div>
                        <div className="user-level">Level 42</div>
                      </div>
                    </> : null
                  ) : (
                    <button className="login-button" onClick={() => setShowAuthModal(true)}>
                      <LogIn size={20}  / />
    <span>Login</span>
                    </button>
                  )}
                </div>
                
                <button
                  className="close-button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X size={20}  / /></X>
                </button>
              </div>
              
              <nav className="menu-navigation" /></nav>
                {navigationItems.map((item) => (`
                  <button``
                    key={item.id}```
                    className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
                    onClick={() => {
    navigate() {
    setIsMenuOpen(false)
  
  }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
                
                <div className="menu-divider" /></div>
                {isAuthenticated && (
                  <button
                    className="menu-item"
                    onClick={() => {
    logout() {
    setIsMenuOpen(false)
  
  }}
                  >
                    <LogOut size={20}  / />
    <span>Logout</span>
                  </button>
                )}
              </nav>
              
              <div className="menu-footer" />
    <div className="app-version">Version 1.0.0</div>
                <div className="app-copyright">© 2024 KONIVRER</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Content */}
        <main className="app-content" /></main>
          {children}
        </main>
        
        {/* Bottom Navigation */}
        {showNavigation && (
          <nav className="bottom-navigation" /></nav>
            {navigationItems.slice(0, 5).map((item) => (`
              <button``
                key={item.id}```
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        )}
        
        {/* Auth Modal */}
        {showAuthModal && (
          <UnifiedAuthModal onClose={() => setShowAuthModal(false)} />
        )}
        
        {/* PWA Install Prompt */}
        {!isInstalled && <PWAInstallPrompt  />}
        
        {/* Notification Center */}
        <NotificationCenter  / /></NotificationCenter>
        {/* Unified Messaging */}
        <UnifiedMessaging  / /></UnifiedMessaging>
      </div>
    )
  };
  
  // Render standard layout`
  const renderStandardLayout = () => {``
    return (```
      <div className={`flex min-h-screen bg-gray-900 text-white ${className}`} /></div>
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:block" />
    <div className="p-4" />
    <div className="text-2xl font-bold mb-6">KONIVRER</div>
              
              <nav className="space-y-1" /></nav>
                {navigationItems.map((item) => (
                  <Link`
                    key={item.id}``
                    to={item.path}```
                    className={`flex items-center px-4 py-3 rounded-lg ${
    location.pathname === item.path`
                        ? 'bg-blue-600 text-white'` : null`
                        : 'text-gray-300 hover:bg-gray-700'```
  }`}
                   /></Link>
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
                
                <div className="h-px bg-gray-700 my-3" />
    <button
                  className="flex items-center w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700"
                  onClick={handleAuthAction}
                 /></button>
                  {isAuthenticated ? (
                    <any />
    <LogOut size={20}  / />
    <span className="ml-3">Logout</span>
                    </> : null
                  ) : (
                    <any />
    <LogIn size={20}  / />
    <span className="ml-3">Login</span>
                    </>
                  )}
                </button>
              </nav>
            </div>
          </aside>
        )}
        
        <div className="flex-1 flex flex-col" /></div>
          {/* Header */}
          {showHeader && (
            <header className="bg-gray-800 border-b border-gray-700 p-4" />
    <div className="flex justify-between items-center" />
    <div className="flex items-center" />
    <button
                    className="p-2 rounded-full hover:bg-gray-700 md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <Menu size={20}  / /></Menu>
                  </button>
                  <div className="text-xl font-bold ml-2 md:hidden">KONIVRER</div>
                </div>
                
                <div className="flex items-center space-x-4" />
    <button className="p-2 rounded-full hover:bg-gray-700" />
    <Search size={20}  / /></Search>
                  </button>
                  
                  <button className="p-2 rounded-full hover:bg-gray-700" />
    <Bell size={20}  / /></Bell>
                  </button>
                  
                  {isAuthenticated ? (
                    <div className="flex items-center" />
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center" />
    <User size={16}  / /></User>
                      </div> : null
                      <span className="ml-2 hidden md:inline">{user? .displayName || 'User'}</span>
                    </div> : null
                  ) : (
                    <button
                      className="flex items-center px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
                      onClick={() => setShowAuthModal(true)}
                    >
                      <LogIn size={16}  / />
    <span className="ml-2">Login</span>
                    </button>
                  )}
                </div>
              </div>
            </header>
          )}
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" />
    <div className="absolute left-0 top-0 h-full w-3/4 bg-gray-800 p-4 overflow-y-auto" />
    <div className="flex justify-between items-center mb-6" />
    <div className="text-xl font-bold">Menu</div>
                  <button
                    className="p-2 rounded-full hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X size={20}  / /></X>
                  </button>
                </div>
                
                <nav className="space-y-1" /></nav>
                  {navigationItems.map((item) => (
                    <Link`
                      key={item.id}``
                      to={item.path}```
                      className={`flex items-center px-4 py-3 rounded-lg ${
    location.pathname === item.path`
                          ? 'bg-blue-600 text-white'` : null`
                          : 'text-gray-300 hover:bg-gray-700'```
  }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  ))}
                  
                  <div className="h-px bg-gray-700 my-3" />
    <button
                    className="flex items-center w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700"
                    onClick={() => {
    handleAuthAction() {
    setIsMenuOpen(false)
  
  }}
                  >
                    {isAuthenticated ? (
                      <any />
    <LogOut size={20}  / />
    <span className="ml-3">Logout</span>
                      </> : null
                    ) : (
                      <any />
    <LogIn size={20}  / />
    <span className="ml-3">Login</span>
                      </>
                    )}
                  </button>
                </nav>
              </div>
            </div>
          )}
          
          {/* Content */}
          <main className="flex-1 p-4" /></main>
            {children || <Outlet  />}
          </main>
          
          {/* Footer */}
          {showFooter && (
            <footer className="bg-gray-800 border-t border-gray-700 p-4 text-center text-gray-400 text-sm" />
    <div className="container mx-auto" />
    <p>&copy; 2024 KONIVRER Deck Database. All rights reserved.</p>
              </div>
            </footer>
          )}
        </div>
        
        {/* Auth Modal */}
        {showAuthModal && (
          <UnifiedAuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    );
  };

  // Render golden menu layout`
  const renderGoldenLayout = () => {``
    return (```
      <div className={`flex flex-col min-h-screen bg-gray-900 text-white ${className}`} /></div>
        {/* Temporary Simple Golden Menu Bar */}
        <nav style={{
    background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
          borderBottom: '2px solid #3a3a3a',
          padding: '1rem 2rem'
  }} />
    <div style={{
    display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto'
  }} />
    <div style={{ display: 'flex', gap: '2rem' }} />
    <Link to="/" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }} /></Link>
                Home
              </Link>
              <Link to="/cards" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }} /></Link>
                Cards
              </Link>
              <Link to="/decks" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }} /></Link>
                Decks
              </Link>
              <Link to="/tournaments" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }} /></Link>
                Tournaments
              </Link>
              <Link to="/play" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }} /></Link>
                Play
              </Link>
            </div>
            <button 
              onClick={() => setShowAuthModal(true)}
              style={{
    color: '#d4af37', 
                background: 'rgba(212, 175, 55, 0.1)', 
                border: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
  }}
            >
              Login
            </button>
          </div>
        </nav>
        
        {/* Content */}
        <main className="flex-1" /></main>
          {children || <Outlet  />}
        </main>
        
        {/* Footer */}
        {showFooter && (
          <footer className="bg-gray-800 border-t border-gray-700 p-4 text-center text-gray-400 text-sm" />
    <div className="container mx-auto" />
    <p>&copy; 2024 KONIVRER Deck Database. All rights reserved.</p>
            </div>
          </footer>
        )}
        
        {/* Auth Modal */}
        {showAuthModal && (
          <UnifiedAuthModal onClose={() => setShowAuthModal(false)} />
        )}
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt  / /></PWAInstallPrompt>
        {/* Notification Center */}
        <NotificationCenter  / /></NotificationCenter>
        {/* Unified Messaging */}
        <UnifiedMessaging  / /></UnifiedMessaging>
      </div>
    )
  };
  
  // Render the appropriate variant
  switch (actualVariant) {
    case 'simple':
      return renderSimpleMobileLayout() {
  }
    case 'mobile':
      return renderMobileLayout() {
    case 'mobile-first':
      return renderMobileFirstLayout(() => {
    case 'golden':
      return renderGoldenLayout() {
    default:
      return renderStandardLayout()
  
  })
};`
``
export default UnifiedLayout;```