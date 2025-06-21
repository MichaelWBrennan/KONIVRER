/**
 * Mobile Optimization System for KONIVRER
 * Handles touch controls, responsive design, offline capabilities, and performance optimization
 */
export class MobileOptimization {
  constructor(options = {}) {
    this.options = {
      enableTouchGestures: true,
      enableHapticFeedback: true,
      enableOfflineMode: true,
      adaptiveQuality: true,
      lowBandwidthMode: false,
      ...options
    };

    // Device detection
    this.device = {
      isMobile: this.detectMobile(),
      isTablet: this.detectTablet(),
      hasTouch: 'ontouchstart' in window,
      orientation: this.getOrientation(),
      pixelRatio: window.devicePixelRatio || 1,
      screenSize: this.getScreenSize()
    };

    // Touch gesture system
    this.gestures = {
      active: new Map(),
      recognizers: new Map(),
      history: []
    };

    // Performance monitoring
    this.performance = {
      frameRate: 60,
      memoryUsage: 0,
      networkSpeed: 'fast',
      batteryLevel: 1.0
    };

    // Offline capabilities
    this.offline = {
      isOnline: navigator.onLine,
      cache: new Map(),
      syncQueue: [],
      lastSync: null
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTouchGestures();
    this.setupResponsiveLayout();
    this.setupOfflineCapabilities();
    this.setupPerformanceMonitoring();
    this.setupHapticFeedback();
  }

  setupEventListeners() {
    // Orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });

    // Network status
    window.addEventListener('online', () => {
      this.offline.isOnline = true;
      this.handleNetworkChange(true);
    });

    window.addEventListener('offline', () => {
      this.offline.isOnline = false;
      this.handleNetworkChange(false);
    });

    // Visibility change (for performance optimization)
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Memory warnings (if supported)
    if ('memory' in performance) {
      this.monitorMemoryUsage();
    }
  }

  setupTouchGestures() {
    if (!this.options.enableTouchGestures || !this.device.hasTouch) return;

    // Register gesture recognizers
    this.registerGestureRecognizer('tap', this.createTapRecognizer());
    this.registerGestureRecognizer('doubleTap', this.createDoubleTapRecognizer());
    this.registerGestureRecognizer('longPress', this.createLongPressRecognizer());
    this.registerGestureRecognizer('swipe', this.createSwipeRecognizer());
    this.registerGestureRecognizer('pinch', this.createPinchRecognizer());
    this.registerGestureRecognizer('rotate', this.createRotateRecognizer());
    this.registerGestureRecognizer('drag', this.createDragRecognizer());

    // Add touch event listeners
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    document.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false });
  }

  registerGestureRecognizer(name, recognizer) {
    this.gestures.recognizers.set(name, recognizer);
  }

  createTapRecognizer() {
    return {
      name: 'tap',
      maxDuration: 300,
      maxDistance: 10,
      recognize: (gesture) => {
        return gesture.duration < this.maxDuration && 
               gesture.distance < this.maxDistance &&
               gesture.touches.length === 1;
      },
      handler: (gesture, element) => {
        this.triggerHapticFeedback('light');
        this.dispatchCustomEvent(element, 'cardTap', {
          position: gesture.center,
          target: element
        });
      }
    };
  }

  createDoubleTapRecognizer() {
    let lastTap = null;
    
    return {
      name: 'doubleTap',
      maxInterval: 300,
      recognize: (gesture) => {
        if (gesture.type !== 'tap') return false;
        
        const now = Date.now();
        if (lastTap && (now - lastTap.timestamp) < this.maxInterval) {
          lastTap = null;
          return true;
        }
        
        lastTap = { timestamp: now, position: gesture.center };
        return false;
      },
      handler: (gesture, element) => {
        this.triggerHapticFeedback('medium');
        this.dispatchCustomEvent(element, 'cardDoubleTap', {
          position: gesture.center,
          target: element
        });
      }
    };
  }

  createLongPressRecognizer() {
    return {
      name: 'longPress',
      duration: 500,
      maxDistance: 10,
      recognize: (gesture) => {
        return gesture.duration >= this.duration && 
               gesture.distance < this.maxDistance &&
               gesture.touches.length === 1;
      },
      handler: (gesture, element) => {
        this.triggerHapticFeedback('heavy');
        this.dispatchCustomEvent(element, 'cardLongPress', {
          position: gesture.center,
          target: element
        });
      }
    };
  }

  createSwipeRecognizer() {
    return {
      name: 'swipe',
      minDistance: 50,
      maxDuration: 500,
      recognize: (gesture) => {
        return gesture.distance >= this.minDistance && 
               gesture.duration < this.maxDuration &&
               gesture.touches.length === 1;
      },
      handler: (gesture, element) => {
        const direction = this.getSwipeDirection(gesture.start, gesture.end);
        this.triggerHapticFeedback('light');
        
        this.dispatchCustomEvent(element, 'cardSwipe', {
          direction,
          distance: gesture.distance,
          velocity: gesture.velocity,
          target: element
        });
      }
    };
  }

  createPinchRecognizer() {
    return {
      name: 'pinch',
      minScale: 0.1,
      recognize: (gesture) => {
        return gesture.touches.length === 2 && gesture.scale !== undefined;
      },
      handler: (gesture, element) => {
        this.dispatchCustomEvent(element, 'cardPinch', {
          scale: gesture.scale,
          center: gesture.center,
          target: element
        });
      }
    };
  }

  createRotateRecognizer() {
    return {
      name: 'rotate',
      minRotation: 5, // degrees
      recognize: (gesture) => {
        return gesture.touches.length === 2 && 
               Math.abs(gesture.rotation) >= this.minRotation;
      },
      handler: (gesture, element) => {
        this.dispatchCustomEvent(element, 'cardRotate', {
          rotation: gesture.rotation,
          center: gesture.center,
          target: element
        });
      }
    };
  }

  createDragRecognizer() {
    return {
      name: 'drag',
      minDistance: 5,
      recognize: (gesture) => {
        return gesture.distance >= this.minDistance && gesture.touches.length === 1;
      },
      handler: (gesture, element) => {
        this.dispatchCustomEvent(element, 'cardDrag', {
          delta: gesture.delta,
          position: gesture.current,
          target: element
        });
      }
    };
  }

  handleTouchStart(event) {
    const touches = Array.from(event.touches);
    const timestamp = Date.now();

    touches.forEach(touch => {
      const gesture = {
        id: touch.identifier,
        start: { x: touch.clientX, y: touch.clientY },
        current: { x: touch.clientX, y: touch.clientY },
        startTime: timestamp,
        element: document.elementFromPoint(touch.clientX, touch.clientY)
      };

      this.gestures.active.set(touch.identifier, gesture);
    });

    // Prevent default for card elements to enable custom gestures
    if (this.isCardElement(event.target)) {
      event.preventDefault();
    }
  }

  handleTouchMove(event) {
    const touches = Array.from(event.touches);
    const timestamp = Date.now();

    touches.forEach(touch => {
      const gesture = this.gestures.active.get(touch.identifier);
      if (!gesture) return;

      gesture.current = { x: touch.clientX, y: touch.clientY };
      gesture.delta = {
        x: gesture.current.x - gesture.start.x,
        y: gesture.current.y - gesture.start.y
      };
      gesture.distance = Math.sqrt(
        gesture.delta.x * gesture.delta.x + gesture.delta.y * gesture.delta.y
      );
      gesture.duration = timestamp - gesture.startTime;

      // Calculate velocity
      if (gesture.lastUpdate) {
        const timeDelta = timestamp - gesture.lastUpdate.time;
        const distanceDelta = Math.sqrt(
          Math.pow(gesture.current.x - gesture.lastUpdate.x, 2) +
          Math.pow(gesture.current.y - gesture.lastUpdate.y, 2)
        );
        gesture.velocity = distanceDelta / timeDelta;
      }

      gesture.lastUpdate = {
        x: gesture.current.x,
        y: gesture.current.y,
        time: timestamp
      };

      // Check for multi-touch gestures
      if (touches.length === 2) {
        this.updateMultiTouchGesture(touches);
      }

      // Recognize ongoing gestures
      this.recognizeGesture(gesture);
    });

    if (this.isCardElement(event.target)) {
      event.preventDefault();
    }
  }

  handleTouchEnd(event) {
    const changedTouches = Array.from(event.changedTouches);
    const timestamp = Date.now();

    changedTouches.forEach(touch => {
      const gesture = this.gestures.active.get(touch.identifier);
      if (!gesture) return;

      gesture.end = { x: touch.clientX, y: touch.clientY };
      gesture.endTime = timestamp;
      gesture.duration = gesture.endTime - gesture.startTime;

      // Final gesture recognition
      this.recognizeGesture(gesture, true);

      // Move to history and clean up
      this.gestures.history.push(gesture);
      this.gestures.active.delete(touch.identifier);

      // Keep history limited
      if (this.gestures.history.length > 10) {
        this.gestures.history.shift();
      }
    });
  }

  handleTouchCancel(event) {
    const changedTouches = Array.from(event.changedTouches);
    
    changedTouches.forEach(touch => {
      this.gestures.active.delete(touch.identifier);
    });
  }

  updateMultiTouchGesture(touches) {
    if (touches.length !== 2) return;

    const touch1 = touches[0];
    const touch2 = touches[1];
    
    const gesture1 = this.gestures.active.get(touch1.identifier);
    const gesture2 = this.gestures.active.get(touch2.identifier);
    
    if (!gesture1 || !gesture2) return;

    // Calculate pinch/zoom
    const currentDistance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );

    if (!gesture1.initialDistance) {
      gesture1.initialDistance = currentDistance;
      gesture2.initialDistance = currentDistance;
    }

    const scale = currentDistance / gesture1.initialDistance;
    gesture1.scale = scale;
    gesture2.scale = scale;

    // Calculate rotation
    const currentAngle = Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    );

    if (!gesture1.initialAngle) {
      gesture1.initialAngle = currentAngle;
      gesture2.initialAngle = currentAngle;
    }

    const rotation = (currentAngle - gesture1.initialAngle) * (180 / Math.PI);
    gesture1.rotation = rotation;
    gesture2.rotation = rotation;

    // Calculate center point
    const center = {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
    gesture1.center = center;
    gesture2.center = center;
  }

  recognizeGesture(gesture, isFinal = false) {
    this.gestures.recognizers.forEach((recognizer, name) => {
      if (recognizer.recognize(gesture)) {
        recognizer.handler(gesture, gesture.element);
      }
    });
  }

  setupResponsiveLayout() {
    // Create responsive breakpoints
    this.breakpoints = {
      mobile: 480,
      tablet: 768,
      desktop: 1024,
      large: 1440
    };

    // Setup CSS custom properties for dynamic sizing
    this.updateCSSVariables();

    // Listen for resize events
    window.addEventListener('resize', this.debounce(() => {
      this.updateCSSVariables();
      this.handleLayoutChange();
    }, 250));
  }

  updateCSSVariables() {
    const root = document.documentElement;
    const { innerWidth, innerHeight } = window;
    
    // Update viewport dimensions
    root.style.setProperty('--viewport-width', `${innerWidth}px`);
    root.style.setProperty('--viewport-height', `${innerHeight}px`);
    
    // Update safe area insets for notched devices
    if (CSS.supports('padding: env(safe-area-inset-top)')) {
      root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
      root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
      root.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
      root.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
    }

    // Calculate optimal card sizes
    const cardWidth = this.calculateOptimalCardSize(innerWidth, innerHeight);
    root.style.setProperty('--card-width', `${cardWidth}px`);
    root.style.setProperty('--card-height', `${cardWidth * 1.4}px`);

    // Update touch target sizes
    const minTouchSize = Math.max(44, innerWidth * 0.08); // Minimum 44px or 8% of screen width
    root.style.setProperty('--min-touch-size', `${minTouchSize}px`);
  }

  calculateOptimalCardSize(width, height) {
    const orientation = width > height ? 'landscape' : 'portrait';
    
    if (orientation === 'landscape') {
      // In landscape, cards should be smaller to fit more on screen
      return Math.min(width * 0.12, 120);
    } else {
      // In portrait, cards can be larger
      return Math.min(width * 0.18, 150);
    }
  }

  setupOfflineCapabilities() {
    if (!this.options.enableOfflineMode) return;

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
          this.serviceWorker = registration;
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Setup offline data caching
    this.setupOfflineCache();
    
    // Setup background sync
    this.setupBackgroundSync();
  }

  setupOfflineCache() {
    // Cache essential game data
    const essentialData = [
      'cards',
      'rules',
      'decks',
      'user_preferences'
    ];

    essentialData.forEach(dataType => {
      this.cacheData(dataType);
    });
  }

  async cacheData(dataType) {
    try {
      const data = await this.fetchData(dataType);
      this.offline.cache.set(dataType, {
        data,
        timestamp: Date.now(),
        version: this.getDataVersion(dataType)
      });
      
      // Store in IndexedDB for persistence
      await this.storeInIndexedDB(dataType, data);
    } catch (error) {
      console.warn(`Failed to cache ${dataType}:`, error);
    }
  }

  setupPerformanceMonitoring() {
    // Monitor frame rate
    this.monitorFrameRate();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor network speed
    this.monitorNetworkSpeed();
    
    // Monitor battery level
    this.monitorBatteryLevel();
  }

  monitorFrameRate() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measureFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        this.performance.frameRate = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Adjust quality based on frame rate
        this.adjustQualityBasedOnPerformance();
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.performance.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        // Trigger garbage collection hints if memory usage is high
        if (this.performance.memoryUsage > 0.8) {
          this.optimizeMemoryUsage();
        }
      }, 5000);
    }
  }

  monitorNetworkSpeed() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      const updateNetworkInfo = () => {
        this.performance.networkSpeed = this.categorizeNetworkSpeed(connection.effectiveType);
        this.adjustForNetworkSpeed();
      };
      
      connection.addEventListener('change', updateNetworkInfo);
      updateNetworkInfo();
    }
  }

  monitorBatteryLevel() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        const updateBatteryInfo = () => {
          this.performance.batteryLevel = battery.level;
          this.adjustForBatteryLevel();
        };
        
        battery.addEventListener('levelchange', updateBatteryInfo);
        updateBatteryInfo();
      });
    }
  }

  adjustQualityBasedOnPerformance() {
    if (!this.options.adaptiveQuality) return;
    
    const { frameRate, memoryUsage, batteryLevel } = this.performance;
    
    let qualityLevel = 'high';
    
    if (frameRate < 30 || memoryUsage > 0.8 || batteryLevel < 0.2) {
      qualityLevel = 'low';
    } else if (frameRate < 45 || memoryUsage > 0.6 || batteryLevel < 0.4) {
      qualityLevel = 'medium';
    }
    
    this.setQualityLevel(qualityLevel);
  }

  setQualityLevel(level) {
    const root = document.documentElement;
    
    switch (level) {
      case 'low':
        root.style.setProperty('--animation-duration', '0.1s');
        root.style.setProperty('--particle-count', '50');
        root.style.setProperty('--shadow-quality', 'none');
        root.style.setProperty('--texture-quality', '0.5');
        break;
      case 'medium':
        root.style.setProperty('--animation-duration', '0.2s');
        root.style.setProperty('--particle-count', '200');
        root.style.setProperty('--shadow-quality', 'low');
        root.style.setProperty('--texture-quality', '0.75');
        break;
      case 'high':
        root.style.setProperty('--animation-duration', '0.3s');
        root.style.setProperty('--particle-count', '500');
        root.style.setProperty('--shadow-quality', 'high');
        root.style.setProperty('--texture-quality', '1.0');
        break;
    }
    
    // Notify other systems of quality change
    this.dispatchCustomEvent(document, 'qualityLevelChanged', { level });
  }

  setupHapticFeedback() {
    if (!this.options.enableHapticFeedback) return;
    
    // Check for haptic feedback support
    this.hapticSupport = {
      vibrate: 'vibrate' in navigator,
      gamepad: 'getGamepads' in navigator
    };
  }

  triggerHapticFeedback(intensity = 'light') {
    if (!this.hapticSupport.vibrate) return;
    
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50],
      success: [10, 50, 10],
      error: [100, 50, 100]
    };
    
    const pattern = patterns[intensity] || patterns.light;
    navigator.vibrate(pattern);
  }

  // Utility methods
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  detectTablet() {
    return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  }

  getOrientation() {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }

  getScreenSize() {
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight
    };
  }

  getSwipeDirection(start, end) {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  isCardElement(element) {
    return element && (
      element.classList.contains('game-card') ||
      element.closest('.game-card') ||
      element.classList.contains('card-zone') ||
      element.closest('.card-zone')
    );
  }

  dispatchCustomEvent(element, eventName, detail) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Event handlers
  handleOrientationChange() {
    this.device.orientation = this.getOrientation();
    this.updateCSSVariables();
    this.dispatchCustomEvent(document, 'orientationChanged', {
      orientation: this.device.orientation
    });
  }

  handleNetworkChange(isOnline) {
    if (isOnline) {
      this.syncOfflineData();
    } else {
      this.enableOfflineMode();
    }
    
    this.dispatchCustomEvent(document, 'networkChanged', { isOnline });
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.pauseNonEssentialOperations();
    } else {
      this.resumeOperations();
    }
  }

  handleLayoutChange() {
    this.dispatchCustomEvent(document, 'layoutChanged', {
      screenSize: this.getScreenSize(),
      orientation: this.device.orientation
    });
  }

  // Performance optimization methods
  optimizeMemoryUsage() {
    // Clear unused caches
    this.clearUnusedCaches();
    
    // Reduce texture quality temporarily
    this.setQualityLevel('low');
    
    // Suggest garbage collection
    if (window.gc) {
      window.gc();
    }
  }

  pauseNonEssentialOperations() {
    // Pause animations
    document.body.classList.add('paused');
    
    // Reduce update frequency
    this.dispatchCustomEvent(document, 'pauseOperations');
  }

  resumeOperations() {
    // Resume animations
    document.body.classList.remove('paused');
    
    // Restore update frequency
    this.dispatchCustomEvent(document, 'resumeOperations');
  }

  // Public API
  getDeviceInfo() {
    return { ...this.device };
  }

  getPerformanceInfo() {
    return { ...this.performance };
  }

  isOfflineMode() {
    return !this.offline.isOnline;
  }

  enableLowBandwidthMode() {
    this.options.lowBandwidthMode = true;
    this.setQualityLevel('low');
    this.dispatchCustomEvent(document, 'lowBandwidthModeEnabled');
  }

  disableLowBandwidthMode() {
    this.options.lowBandwidthMode = false;
    this.adjustQualityBasedOnPerformance();
    this.dispatchCustomEvent(document, 'lowBandwidthModeDisabled');
  }
}

export default MobileOptimization;