import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installMethod, setInstallMethod] = useState('');

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Don't show prompt immediately, wait for user interaction
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
          setShowInstallPrompt(true);
        }
      }, 5000); // Show after 5 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Detect installation method
    const detectInstallMethod = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('android')) {
        setInstallMethod('android');
      } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        setInstallMethod('ios');
      } else {
        setInstallMethod('desktop');
      }
    };

    checkInstalled();
    detectInstallMethod();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show manual installation instructions
      setShowInstallPrompt(true);
      return;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  const getInstallInstructions = () => {
    switch (installMethod) {
      case 'ios':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">To install KONIVRER on iOS:</p>
            <ol className="text-sm space-y-2 list-decimal list-inside text-gray-700">
              <li>Tap the Share button in Safari</li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>
          </div>
        );
      case 'android':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">To install KONIVRER on Android:</p>
            <ol className="text-sm space-y-2 list-decimal list-inside text-gray-700">
              <li>Tap the menu (⋮) in your browser</li>
              <li>Select "Add to Home screen" or "Install app"</li>
              <li>Tap "Add" or "Install" to confirm</li>
            </ol>
          </div>
        );
      default:
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">To install KONIVRER on desktop:</p>
            <ol className="text-sm space-y-2 list-decimal list-inside text-gray-700">
              <li>Look for the install icon in your browser's address bar</li>
              <li>Click it and select "Install"</li>
              <li>Or use Ctrl+Shift+A (Chrome) to access app installation</li>
            </ol>
          </div>
        );
    }
  };

  const getFeatures = () => [
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: 'Mobile Optimized',
      description: 'Perfect touch controls and responsive design'
    },
    {
      icon: <WifiOff className="w-5 h-5" />,
      title: 'Offline Play',
      description: 'Play against AI even without internet'
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: 'Fast Loading',
      description: 'Instant startup and smooth performance'
    },
    {
      icon: <Monitor className="w-5 h-5" />,
      title: 'Native Feel',
      description: 'App-like experience on any device'
    }
  ];

  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Download className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-green-800">App Installed!</p>
            <p className="text-sm text-green-600">KONIVRER is ready to use</p>
          </div>
        </div>
      </div>
    );
  }

  if (!showInstallPrompt) {
    return (
      <button
        onClick={() => setShowInstallPrompt(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        title="Install KONIVRER App"
      >
        <Download className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Install KONIVRER</h2>
              <p className="text-gray-600">Get the full app experience</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {getFeatures().map((feature, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="font-medium text-sm text-gray-900">{feature.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Online/Offline Status */}
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            isOnline ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
          }`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isOnline ? 'Online - Full features available' : 'Offline mode ready'}
            </span>
          </div>

          {/* Installation Instructions */}
          {!deferredPrompt && getInstallInstructions()}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          {deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Install Now
            </button>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Follow the instructions above to install
              </p>
              <button
                onClick={handleDismiss}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Got it, thanks!
              </button>
            </div>
          )}
          
          <button
            onClick={handleDismiss}
            className="w-full text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;