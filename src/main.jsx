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

// Service worker and cache management
const manageServiceWorkersAndCache = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.update();
      }
    } catch (error) {
      console.log('⚠️ Service worker update error:', error);
    }
  }
  
  // Clear old caches if needed
  if ('caches' in window && import.meta.env.PROD) {
    try {
      const cacheNames = await caches.keys();
      const oldCacheNames = cacheNames.filter(name => 
        name.startsWith('konivrer-') && !name.includes(import.meta.env.VITE_APP_VERSION || 'latest')
      );
      
      for (const cacheName of oldCacheNames) {
        await caches.delete(cacheName);
      }
    } catch (error) {
      console.log('⚠️ Cache management error:', error);
    }
  }
};

// Device and performance optimizations
const optimizeForDevice = () => {
  // Check if we're on a mobile device
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Add device type to document for CSS targeting
  document.documentElement.classList.add(isMobile ? 'mobile-device' : 'desktop-device');
  
  // Simple device capability detection
  const deviceCapabilities = {
    memory: navigator.deviceMemory || 4,
    cores: navigator.hardwareConcurrency || 4,
    touchScreen: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    screenSize: window.innerWidth < 768 ? 'small' : window.innerWidth < 1024 ? 'medium' : 'large'
  };
  
  // Set performance mode based on device capabilities
  let performanceMode = 'high';
  
  if (isMobile) {
    // Mobile optimizations
    if (deviceCapabilities.memory <= 2 || deviceCapabilities.cores <= 2) {
      performanceMode = 'low';
      document.documentElement.classList.add('reduce-animations', 'reduce-effects');
    } else if (deviceCapabilities.memory <= 4 || deviceCapabilities.cores <= 4) {
      performanceMode = 'medium';
      document.documentElement.classList.add('reduce-animations');
    }
    
    // Add touch-specific event listeners with passive flag for better scrolling
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
    
    // Add screen size class
    document.documentElement.classList.add(
      deviceCapabilities.screenSize === 'small' ? 'mobile-small' : 'mobile-large'
    );
  } else {
    // Desktop optimizations
    if (deviceCapabilities.memory <= 4 || deviceCapabilities.cores <= 2) {
      performanceMode = 'medium';
    }
    
    // Add screen size class
    document.documentElement.classList.add(
      deviceCapabilities.screenSize === 'large' ? 'desktop-large' : 'desktop-small'
    );
  }
  
  // Store performance mode and add class
  window.KONIVRER_PERFORMANCE_MODE = performanceMode;
  document.documentElement.classList.add(`performance-${performanceMode}`);
};

// Execute device optimizations
optimizeForDevice();

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
  manageServiceWorkersAndCache();

  // Repeat loading element removal after delays as fallback
  setTimeout(removeAllLoadingElements, 500);
} catch (error) {
  console.warn('Cleanup operations failed:', error);
}
