import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './App.css';
import './styles/modern-design.css';
import './styles/components.css';
import './styles/utilities.css';
import './styles/mobile-optimizations.css';
import { initializeAnalytics, analyticsConfig } from './config/analytics.js';
import { initializeSecurity } from './config/security.js';

// Performance monitoring (only in development)
if (import.meta.env.DEV) {
  import('./utils/performance');
}

// Speed optimizations (production only)
if (import.meta.env.PROD) {
  import('./utils/speedOptimizations');
}

// Optimized service worker registration
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // Use requestIdleCallback for better performance
  const registerSW = () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(registration => {
        // Update on reload
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      })
      .catch(() => {
        // Silently fail in production
      });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(registerSW);
  } else {
    setTimeout(registerSW, 1000);
  }
}

// Optimized root creation with error handling
const container = document.getElementById('root');
const root = createRoot(container);

// Fallback component for critical errors
const FallbackApp = () => (
  <div
    style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}
  >
    <div
      style={{
        maxWidth: '400px',
        textAlign: 'center',
        backgroundColor: '#1f2937',
        padding: '40px',
        borderRadius: '8px',
      }}
    >
      <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>
        KONIVRER Deck Database
      </h1>
      <p style={{ marginBottom: '20px', opacity: 0.8 }}>
        The application is starting up. If this message persists, please refresh
        the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="btn btn-primary"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

try {
  root.render(
    <StrictMode>
      <App />
      {analyticsConfig.vercel.enabled && (
        <>
          <Analytics />
          <SpeedInsights
            sampleRate={analyticsConfig.vercel.speedInsights.sampleRate}
          />
        </>
      )}
    </StrictMode>,
  );
} catch (error) {
  console.error('Critical error during app initialization:', error);
  root.render(<FallbackApp />);
}

// Initialize security and analytics after render with error handling
try {
  initializeSecurity();
} catch (error) {
  console.warn('Security initialization failed:', error);
}

try {
  initializeAnalytics();
} catch (error) {
  console.warn('Analytics initialization failed:', error);
}

// CRITICAL: Comprehensive loading spinner removal
const removeAllLoadingElements = () => {
  // Remove by class names
  const loadingSelectors = [
    '.loading',
    '.loading-container',
    '.loading-spinner',
    '[class*="loading"]',
    '[class*="spinner"]',
    '[data-loading]',
    '#loading',
    '#spinner',
  ];

  loadingSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.style.display = 'none';
      element.remove();
    });
  });

  // Remove any elements with loading text
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    if (
      element.textContent &&
      element.textContent.includes('Loading KONIVRER')
    ) {
      element.style.display = 'none';
      element.remove();
    }
  });

  console.log('🗑️ Comprehensive loading element removal completed');
};

// CRITICAL: Unregister all service workers
const unregisterServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('🗑️ Unregistered service worker:', registration.scope);
      }
    } catch (error) {
      console.log('⚠️ Service worker unregistration error:', error);
    }
  }
};

// CRITICAL: Clear all caches
const clearAllCaches = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('🗑️ Deleted cache:', cacheName);
      }
    } catch (error) {
      console.log('⚠️ Cache clearing error:', error);
    }
  }
};

// Enhanced mobile device optimizations for MTG Arena-like experience
const optimizeForMobile = () => {
  // Check if we're on a mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
    
  // Add device type to document for CSS targeting
  document.documentElement.classList.add(isMobile ? 'mobile-device' : 'desktop-device');
  
  // Detect device capabilities
  const deviceCapabilities = {
    memory: navigator.deviceMemory || 4, // Default to 4GB if not available
    cores: navigator.hardwareConcurrency || 4, // Default to 4 cores if not available
    connection: navigator.connection ? navigator.connection.effectiveType : '4g', // Default to 4g if not available
    touchScreen: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    screenSize: window.innerWidth < 768 ? 'small' : window.innerWidth < 1024 ? 'medium' : 'large',
    highEndGPU: false // Will be determined below
  };
  
  // Try to detect GPU capabilities
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        // Check for high-end GPU indicators
        deviceCapabilities.highEndGPU = /(nvidia|amd|radeon|geforce|intel iris)/i.test(renderer);
      }
    }
  } catch (e) {
    console.log('GPU detection failed:', e);
  }
  
  // Set performance mode based on device capabilities
  let performanceMode = 'high'; // Default to high
  
  if (isMobile) {
    // Mobile device optimizations
    if (deviceCapabilities.memory <= 2 || deviceCapabilities.cores <= 2 || deviceCapabilities.connection === '2g') {
      performanceMode = 'low';
      document.documentElement.classList.add('reduce-animations', 'reduce-effects');
      console.log('🔧 Low-end device detected: Applied performance optimizations');
    } else if (deviceCapabilities.memory <= 4 || deviceCapabilities.cores <= 4 || deviceCapabilities.connection === '3g') {
      performanceMode = 'medium';
      document.documentElement.classList.add('reduce-animations');
      console.log('🔧 Mid-range device detected: Reduced animations');
    }
    
    // Add touch-specific event listeners with passive flag for better scrolling
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
    
    // Add specific classes for different screen sizes
    if (deviceCapabilities.screenSize === 'small') {
      document.documentElement.classList.add('mobile-small');
    } else {
      document.documentElement.classList.add('mobile-large');
    }
    
    console.log('🔧 Applied MTG Arena-like mobile optimizations');
  } else {
    // Desktop optimizations
    if (!deviceCapabilities.highEndGPU || deviceCapabilities.memory <= 4 || deviceCapabilities.cores <= 2) {
      performanceMode = 'medium';
      console.log('🔧 Lower-end desktop detected: Applied medium performance mode');
    }
    
    // Add desktop-specific classes
    if (deviceCapabilities.screenSize === 'large') {
      document.documentElement.classList.add('desktop-large');
    } else {
      document.documentElement.classList.add('desktop-small');
    }
  }
  
  // Store performance mode in a global variable for the game engine
  window.KONIVRER_PERFORMANCE_MODE = performanceMode;
  
  // Add performance mode class to document
  document.documentElement.classList.add(`performance-${performanceMode}`);
  
  console.log(`🎮 MTG Arena-like experience initialized in ${performanceMode} performance mode`);
};

// Execute mobile optimizations
optimizeForMobile();

// Global error handlers
window.addEventListener('error', event => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent the default browser behavior
});

// Execute all cleanup operations with error handling
try {
  removeAllLoadingElements();
  unregisterServiceWorkers();
  clearAllCaches();

  // Repeat cleanup after delays as fallback
  setTimeout(removeAllLoadingElements, 100);
  setTimeout(removeAllLoadingElements, 500);
  setTimeout(removeAllLoadingElements, 1000);
} catch (error) {
  console.warn('Cleanup operations failed:', error);
}
