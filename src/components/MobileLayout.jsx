import React, { useState, useEffect } from 'react';
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
  Signal
} from 'lucide-react';

const MobileLayout = ({ children, currentPage = 'home' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [orientation, setOrientation] = useState('portrait');
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    // Network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    // Battery API
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        } catch (error) {
          console.log('Battery API not available');
        }
      }
    };

    // Orientation handling
    const handleOrientationChange = () => {
      const orientation = screen.orientation?.type || 
        (window.innerHeight > window.innerWidth ? 'portrait-primary' : 'landscape-primary');
      setOrientation(orientation.includes('portrait') ? 'portrait' : 'landscape');
    };

    // Safe area insets for notched devices
    const updateSafeAreaInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setSafeAreaInsets({
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--sal') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--sar') || '0')
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
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, path: '/' },
    { id: 'cards', label: 'Cards', icon: <Database className="w-5 h-5" />, path: '/cards' },
    { id: 'tournaments', label: 'Tournaments', icon: <Trophy className="w-5 h-5" />, path: '/tournaments' },
    { id: 'social', label: 'Social', icon: <Users className="w-5 h-5" />, path: '/social' },
    { id: 'analytics', label: 'Stats', icon: <BarChart3 className="w-5 h-5" />, path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' }
  ];

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    // Use your router navigation here
    window.location.href = path;
  };

  const getStatusBarHeight = () => {
    return safeAreaInsets.top || 24; // Default status bar height
  };

  const getBottomSafeArea = () => {
    return safeAreaInsets.bottom || 0;
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${orientation === 'landscape' ? 'landscape' : 'portrait'}`}>
      {/* Status Bar */}
      <div 
        className="bg-gray-900 text-white text-xs flex justify-between items-center px-4 relative z-50"
        style={{ 
          height: `${getStatusBarHeight()}px`,
          paddingLeft: `${safeAreaInsets.left + 16}px`,
          paddingRight: `${safeAreaInsets.right + 16}px`
        }}
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium">KONIVRER</span>
          {!isOnline && (
            <div className="flex items-center space-x-1 text-orange-400">
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3 text-orange-400" />
          )}
          <Signal className="w-3 h-3" />
          {batteryLevel !== null && (
            <div className="flex items-center space-x-1">
              <Battery className="w-3 h-3" />
              <span>{batteryLevel}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <header 
        className="bg-white shadow-sm border-b border-gray-200 relative z-40"
        style={{ 
          paddingLeft: `${safeAreaInsets.left}px`,
          paddingRight: `${safeAreaInsets.right}px`
        }}
      >
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <h1 className="text-lg font-bold text-gray-900">
            {navigationItems.find(item => item.id === currentPage)?.label || 'KONIVRER'}
          </h1>
          
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-40 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ 
        paddingTop: `${getStatusBarHeight()}px`,
        paddingLeft: `${safeAreaInsets.left}px`
      }}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">KONIVRER</h2>
              <p className="text-sm text-gray-600">Trading Card Game</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Connection Status */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Offline Mode</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isOnline ? 'All features available' : 'Limited functionality'}
            </p>
          </div>
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
          paddingBottom: `${getBottomSafeArea()}px`
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation (Portrait only) */}
      {orientation === 'portrait' && (
        <nav 
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30"
          style={{ 
            paddingBottom: `${getBottomSafeArea()}px`,
            paddingLeft: `${safeAreaInsets.left}px`,
            paddingRight: `${safeAreaInsets.right}px`
          }}
        >
          <div className="flex justify-around py-2">
            {navigationItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Landscape-specific adjustments */}
      <style jsx>{`
        .landscape {
          --content-padding: 1rem;
        }
        
        .portrait {
          --content-padding: 1rem;
          padding-bottom: 80px; /* Space for bottom nav */
        }
        
        .landscape-content {
          padding: var(--content-padding);
          height: calc(100vh - ${getStatusBarHeight()}px - 64px); /* Status bar + header */
          overflow-y: auto;
        }
        
        .portrait-content {
          padding: var(--content-padding);
          min-height: calc(100vh - ${getStatusBarHeight()}px - 64px - 80px); /* Status bar + header + bottom nav */
        }

        /* Safe area CSS variables */
        :root {
          --sat: env(safe-area-inset-top);
          --sab: env(safe-area-inset-bottom);
          --sal: env(safe-area-inset-left);
          --sar: env(safe-area-inset-right);
        }
      `}</style>
    </div>
  );
};

export default MobileLayout;