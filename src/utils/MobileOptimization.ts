/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Mobile Optimization System for KONIVRER
 * Handles touch controls, responsive design, offline capabilities, and performance optimization
 */

// Device types
export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet'
}

// Screen orientation
export enum ScreenOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape'
}

// Network speed
export enum NetworkSpeed {
  SLOW = 'slow',
  MEDIUM = 'medium',
  FAST = 'fast'
}

// Gesture types
export enum GestureType {
  TAP = 'tap',
  DOUBLE_TAP = 'double_tap',
  LONG_PRESS = 'long_press',
  SWIPE = 'swipe',
  PINCH = 'pinch',
  ROTATE = 'rotate',
  PAN = 'pan'
}

// Swipe directions
export enum SwipeDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}

// Haptic feedback types
export enum HapticFeedbackType {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

// Quality levels
export enum QualityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ULTRA = 'ultra'
}

// Mobile optimization options
export interface MobileOptimizationOptions {
  enableTouchGestures?: boolean;
  enableHapticFeedback?: boolean;
  enableOfflineMode?: boolean;
  adaptiveQuality?: boolean;
  lowBandwidthMode?: boolean;
  preferredQuality?: QualityLevel;
  enablePushNotifications?: boolean;
  enableScreenWakeLock?: boolean;
  enableFullscreen?: boolean;
  enablePictureInPicture?: boolean;
  enableBatteryOptimization?: boolean;
  enableDataSaving?: boolean;
  customGestures?: Record<string, GestureConfig>;
}

// Device information
export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  hasTouch: boolean;
  orientation: ScreenOrientation;
  pixelRatio: number;
  screenSize: {
    width: number;
    height: number;
  };
  browserInfo: {
    name: string;
    version: string;
    isChrome: boolean;
    isSafari: boolean;
    isFirefox: boolean;
    isEdge: boolean;
  };
  osInfo: {
    name: string;
    version: string;
    isIOS: boolean;
    isAndroid: boolean;
    isWindows: boolean;
    isMacOS: boolean;
  };
}

// Gesture configuration
export interface GestureConfig {
  element: string | HTMLElement;
  type: GestureType;
  handler: (event: GestureEvent) => void;
  options?: {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    passive?: boolean;
    once?: boolean;
  };
}

// Gesture event
export interface GestureEvent {
  type: GestureType;
  target: HTMLElement;
  originalEvent: TouchEvent | MouseEvent;
  position: {
    x: number;
    y: number;
    startX: number;
    startY: number;
    deltaX: number;
    deltaY: number;
  };
  direction?: SwipeDirection;
  velocity?: number;
  scale?: number;
  rotation?: number;
  duration?: number;
  timestamp: number;
}

// Gesture history entry
export interface GestureHistoryEntry {
  type: GestureType;
  timestamp: number;
  position: {
    x: number;
    y: number;
  };
  target: string;
  duration?: number;
}

// Performance metrics
export interface PerformanceMetrics {
  frameRate: number;
  memoryUsage: number;
  networkSpeed: NetworkSpeed;
  batteryLevel: number;
  batteryCharging?: boolean;
  latency: number;
  loadTime: number;
  renderTime: number;
  resourceUsage: {
    cpu: number;
    gpu: number;
    memory: number;
  };
}

// Quality settings
export interface QualitySettings {
  level: QualityLevel;
  textureQuality: number;
  effectsQuality: number;
  animationQuality: number;
  shadowQuality: number;
  antialiasing: boolean;
  renderScale: number;
}

// Offline data
export interface OfflineData {
  lastSyncTime: Date;
  cachedResources: string[];
  pendingUploads: any[];
  pendingDownloads: any[];
  storageUsage: number;
  maxStorageSize: number;
}

export class MobileOptimization {
  private options: Required<MobileOptimizationOptions>;
  private device: DeviceInfo;
  private gestures: {
    active: Map<string, GestureEvent>;
    recognizers: Map<string, GestureConfig>;
    history: GestureHistoryEntry[];
  };
  private performance: PerformanceMetrics;
  private quality: QualitySettings;
  private offline: OfflineData;
  private eventListeners: Map<string, EventListener>;
  private resizeObserver: ResizeObserver | null;
  private wakeLock: any | null;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null;

  constructor(options: MobileOptimizationOptions = {}) {
    // Default options
    this.options = {
      enableTouchGestures: true,
      enableHapticFeedback: true,
      enableOfflineMode: true,
      adaptiveQuality: true,
      lowBandwidthMode: false,
      preferredQuality: QualityLevel.HIGH,
      enablePushNotifications: false,
      enableScreenWakeLock: false,
      enableFullscreen: false,
      enablePictureInPicture: false,
      enableBatteryOptimization: true,
      enableDataSaving: false,
      customGestures: {},
      ...options
    };

    // Device detection
    this.device = {
      type: this.detectDeviceType(),
      isMobile: this.detectMobile(),
      isTablet: this.detectTablet(),
      hasTouch: 'ontouchstart' in window,
      orientation: this.getOrientation(),
      pixelRatio: window.devicePixelRatio || 1,
      screenSize: this.getScreenSize(),
      browserInfo: this.detectBrowser(),
      osInfo: this.detectOS()
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
      networkSpeed: NetworkSpeed.FAST,
      batteryLevel: 1.0,
      batteryCharging: true,
      latency: 0,
      loadTime: 0,
      renderTime: 0,
      resourceUsage: {
        cpu: 0,
        gpu: 0,
        memory: 0
      }
    };

    // Quality settings
    this.quality = {
      level: this.options.preferredQuality,
      textureQuality: 1.0,
      effectsQuality: 1.0,
      animationQuality: 1.0,
      shadowQuality: 1.0,
      antialiasing: true,
      renderScale: 1.0
    };

    // Offline capabilities
    this.offline = {
      lastSyncTime: new Date(),
      cachedResources: [],
      pendingUploads: [],
      pendingDownloads: [],
      storageUsage: 0,
      maxStorageSize: 50 * 1024 * 1024 // 50MB default
    };

    // Event listeners
    this.eventListeners = new Map();
    this.resizeObserver = null;
    this.wakeLock = null;
    this.serviceWorkerRegistration = null;

    // Initialize
    this.initialize();
  }

  /**
   * Initialize the mobile optimization system
   */
  private initialize(): void {
    // Set up event listeners
    this.setupEventListeners();

    // Initialize gesture system if enabled
    if (this.options.enableTouchGestures) {
      this.initializeGestureSystem();
    }

    // Initialize offline mode if enabled
    if (this.options.enableOfflineMode) {
      this.initializeOfflineMode();
    }

    // Initialize performance monitoring
    this.initializePerformanceMonitoring();

    // Set initial quality based on device
    this.setQualityBasedOnDevice();

    // Initialize battery optimization if enabled
    if (this.options.enableBatteryOptimization) {
      this.initializeBatteryMonitoring();
    }

    // Initialize push notifications if enabled
    if (this.options.enablePushNotifications) {
      this.initializePushNotifications();
    }

    // Initialize screen wake lock if enabled
    if (this.options.enableScreenWakeLock) {
      this.initializeWakeLock();
    }

    // Register custom gestures
    if (this.options.customGestures) {
      Object.entries(this.options.customGestures).forEach(([name, config]) => {
        this.registerGesture(name, config);
      });
    }

    // Log initialization
    console.log('Mobile Optimization initialized', {
      device: this.device,
      options: this.options
    });
  }

  /**
   * Set up event listeners for device changes
   */
  private setupEventListeners(): void {
    // Orientation change
    const orientationChangeHandler = this.handleOrientationChange.bind(this);
    window.addEventListener('orientationchange', orientationChangeHandler);
    this.eventListeners.set('orientationchange', orientationChangeHandler);

    // Resize
    const resizeHandler = this.handleResize.bind(this);
    window.addEventListener('resize', resizeHandler);
    this.eventListeners.set('resize', resizeHandler);

    // Visibility change
    const visibilityChangeHandler = this.handleVisibilityChange.bind(this);
    document.addEventListener('visibilitychange', visibilityChangeHandler);
    this.eventListeners.set('visibilitychange', visibilityChangeHandler);

    // Online/offline
    const onlineHandler = this.handleOnline.bind(this);
    window.addEventListener('online', onlineHandler);
    this.eventListeners.set('online', onlineHandler);

    const offlineHandler = this.handleOffline.bind(this);
    window.addEventListener('offline', offlineHandler);
    this.eventListeners.set('offline', offlineHandler);

    // Set up ResizeObserver for more accurate size changes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target === document.documentElement) {
            this.handleResize();
            break;
          }
        }
      });
      this.resizeObserver.observe(document.documentElement);
    }
  }

  /**
   * Initialize the gesture recognition system
   */
  private initializeGestureSystem(): void {
    if (!this.device.hasTouch) return;

    // Touch start handler
    const touchStartHandler = this.handleTouchStart.bind(this);
    document.addEventListener('touchstart', touchStartHandler, { passive: false });
    this.eventListeners.set('touchstart', touchStartHandler);

    // Touch move handler
    const touchMoveHandler = this.handleTouchMove.bind(this);
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    this.eventListeners.set('touchmove', touchMoveHandler);

    // Touch end handler
    const touchEndHandler = this.handleTouchEnd.bind(this);
    document.addEventListener('touchend', touchEndHandler);
    this.eventListeners.set('touchend', touchEndHandler);

    // Touch cancel handler
    const touchCancelHandler = this.handleTouchCancel.bind(this);
    document.addEventListener('touchcancel', touchCancelHandler);
    this.eventListeners.set('touchcancel', touchCancelHandler);

    // Register default gestures
    this.registerDefaultGestures();
  }

  /**
   * Register default gesture recognizers
   */
  private registerDefaultGestures(): void {
    // Tap gesture
    this.gestures.recognizers.set('tap', {
      element: document.body,
      type: GestureType.TAP,
      handler: (event) => {
        // Default tap behavior
        console.log('Tap detected', event);
      },
      options: {
        preventDefault: false,
        stopPropagation: false,
        passive: true
      }
    });

    // Swipe gesture
    this.gestures.recognizers.set('swipe', {
      element: document.body,
      type: GestureType.SWIPE,
      handler: (event) => {
        // Default swipe behavior
        console.log('Swipe detected', event);
      },
      options: {
        preventDefault: true,
        stopPropagation: false,
        passive: false
      }
    });

    // Pinch gesture
    this.gestures.recognizers.set('pinch', {
      element: document.body,
      type: GestureType.PINCH,
      handler: (event) => {
        // Default pinch behavior
        console.log('Pinch detected', event);
      },
      options: {
        preventDefault: true,
        stopPropagation: false,
        passive: false
      }
    });
  }

  /**
   * Initialize offline mode capabilities
   */
  private initializeOfflineMode(): void {
    // Register service worker if supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          this.serviceWorkerRegistration = registration;
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Initialize IndexedDB for offline storage
    this.initializeOfflineStorage();

    // Sync data when coming online
    window.addEventListener('online', () => {
      this.syncOfflineData();
    });
  }

  /**
   * Initialize offline storage using IndexedDB
   */
  private initializeOfflineStorage(): void {
    // Implementation would depend on specific IndexedDB structure
    console.log('Initializing offline storage');
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    // Monitor frame rate
    let lastTime = performance.now();
    let frames = 0;

    const measureFrameRate = () => {
      frames++;
      const now = performance.now();
      const elapsed = now - lastTime;

      if (elapsed >= 1000) {
        this.performance.frameRate = Math.round((frames * 1000) / elapsed);
        frames = 0;
        lastTime = now;

        // Adjust quality if adaptive quality is enabled
        if (this.options.adaptiveQuality) {
          this.adjustQualityBasedOnPerformance();
        }
      }

      requestAnimationFrame(measureFrameRate);
    };

    requestAnimationFrame(measureFrameRate);

    // Monitor network speed periodically
    this.measureNetworkSpeed();
    setInterval(() => {
      this.measureNetworkSpeed();
    }, 60000); // Check every minute
  }

  /**
   * Initialize battery monitoring
   */
  private initializeBatteryMonitoring(): void {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        // Update initial battery status
        this.updateBatteryStatus(battery);

        // Listen for battery changes
        battery.addEventListener('levelchange', () => {
          this.updateBatteryStatus(battery);
        });

        battery.addEventListener('chargingchange', () => {
          this.updateBatteryStatus(battery);
        });
      });
    }
  }

  /**
   * Update battery status and adjust settings if needed
   */
  private updateBatteryStatus(battery: any): void {
    this.performance.batteryLevel = battery.level;
    this.performance.batteryCharging = battery.charging;

    // Adjust quality based on battery level if not charging
    if (!battery.charging && this.options.enableBatteryOptimization) {
      if (battery.level < 0.15) {
        // Critical battery level
        this.setQualityLevel(QualityLevel.LOW);
      } else if (battery.level < 0.3) {
        // Low battery level
        this.setQualityLevel(QualityLevel.MEDIUM);
      }
    }
  }

  /**
   * Initialize push notifications
   */
  private initializePushNotifications(): void {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        this.setupPushSubscription();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.setupPushSubscription();
          }
        });
      }
    }
  }

  /**
   * Set up push notification subscription
   */
  private setupPushSubscription(): void {
    if (!this.serviceWorkerRegistration) return;

    this.serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(
        // Public VAPID key would go here
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
      )
    })
      .then(subscription => {
        // Send subscription to server
        console.log('Push notification subscription:', subscription);
      })
      .catch(error => {
        console.error('Failed to subscribe to push notifications:', error);
      });
  }

  /**
   * Initialize screen wake lock
   */
  private initializeWakeLock(): void {
    if ('wakeLock' in navigator) {
      this.requestWakeLock();

      // Re-request wake lock when document becomes visible
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.requestWakeLock();
        }
      });
    }
  }

  /**
   * Request screen wake lock
   */
  private async requestWakeLock(): Promise<void> {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        console.log('Wake lock acquired');

        this.wakeLock.addEventListener('release', () => {
          console.log('Wake lock released');
          this.wakeLock = null;
        });
      } catch (error) {
        console.error('Failed to acquire wake lock:', error);
      }
    }
  }

  /**
   * Handle touch start event
   */
  private handleTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    const timestamp = Date.now();

    // Create initial gesture event
    const gestureEvent: GestureEvent = {
      type: GestureType.TAP, // Initial type, may change based on movement
      target: event.target as HTMLElement,
      originalEvent: event,
      position: {
        x: touch.clientX,
        y: touch.clientY,
        startX: touch.clientX,
        startY: touch.clientY,
        deltaX: 0,
        deltaY: 0
      },
      timestamp
    };

    // Store active touch
    const touchId = `touch_${touch.identifier}`;
    this.gestures.active.set(touchId, gestureEvent);

    // Check for gesture recognizers that match this element
    this.gestures.recognizers.forEach((recognizer, name) => {
      if (typeof recognizer.element === 'string') {
        const elements = document.querySelectorAll(recognizer.element);
        let matched = false;

        for (let i = 0; i < elements.length; i++) {
          if (elements[i].contains(event.target as Node)) {
            matched = true;
            break;
          }
        }

        if (!matched) return;
      } else if (recognizer.element instanceof HTMLElement) {
        if (!recognizer.element.contains(event.target as Node)) {
          return;
        }
      }

      // Handle options
      if (recognizer.options?.preventDefault) {
        event.preventDefault();
      }

      if (recognizer.options?.stopPropagation) {
        event.stopPropagation();
      }
    });
  }

  /**
   * Handle touch move event
   */
  private handleTouchMove(event: TouchEvent): void {
    // Update active gestures
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const touchId = `touch_${touch.identifier}`;
      const gestureEvent = this.gestures.active.get(touchId);

      if (gestureEvent) {
        // Update position
        gestureEvent.position.x = touch.clientX;
        gestureEvent.position.y = touch.clientY;
        gestureEvent.position.deltaX = touch.clientX - gestureEvent.position.startX;
        gestureEvent.position.deltaY = touch.clientY - gestureEvent.position.startY;

        // Determine gesture type based on movement
        const distance = Math.sqrt(
          Math.pow(gestureEvent.position.deltaX, 2) +
          Math.pow(gestureEvent.position.deltaY, 2)
        );

        if (distance > 10) {
          // Changed from tap to swipe or pan
          if (gestureEvent.type === GestureType.TAP) {
            gestureEvent.type = GestureType.SWIPE;

            // Determine direction
            const angle = Math.atan2(
              gestureEvent.position.deltaY,
              gestureEvent.position.deltaX
            ) * 180 / Math.PI;

            if (angle > -45 && angle <= 45) {
              gestureEvent.direction = SwipeDirection.RIGHT;
            } else if (angle > 45 && angle <= 135) {
              gestureEvent.direction = SwipeDirection.DOWN;
            } else if (angle > 135 || angle <= -135) {
              gestureEvent.direction = SwipeDirection.LEFT;
            } else {
              gestureEvent.direction = SwipeDirection.UP;
            }
          }
        }

        // Handle multi-touch gestures
        if (event.touches.length >= 2) {
          // Pinch gesture
          const touch1 = event.touches[0];
          const touch2 = event.touches[1];

          // Calculate distance between touches
          const currentDistance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
          );

          if (!gestureEvent.scale) {
            gestureEvent.scale = 1.0;
            (gestureEvent as any).initialDistance = currentDistance;
          } else {
            gestureEvent.scale = currentDistance / (gestureEvent as any).initialDistance;
          }

          gestureEvent.type = GestureType.PINCH;
        }

        // Update active gesture
        this.gestures.active.set(touchId, gestureEvent);

        // Find matching recognizers
        this.gestures.recognizers.forEach((recognizer, name) => {
          if (recognizer.type === gestureEvent.type) {
            // Handle options
            if (recognizer.options?.preventDefault) {
              event.preventDefault();
            }

            if (recognizer.options?.stopPropagation) {
              event.stopPropagation();
            }
          }
        });
      }
    }
  }

  /**
   * Handle touch end event
   */
  private handleTouchEnd(event: TouchEvent): void {
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const touchId = `touch_${touch.identifier}`;
      const gestureEvent = this.gestures.active.get(touchId);

      if (gestureEvent) {
        // Calculate duration
        gestureEvent.duration = Date.now() - gestureEvent.timestamp;

        // Determine final gesture type
        if (gestureEvent.type === GestureType.TAP) {
          if (gestureEvent.duration > 500) {
            gestureEvent.type = GestureType.LONG_PRESS;
          }
        }

        // Find matching recognizers and trigger handlers
        this.gestures.recognizers.forEach((recognizer, name) => {
          if (recognizer.type === gestureEvent.type) {
            // Call handler
            recognizer.handler(gestureEvent);

            // Handle haptic feedback if enabled
            if (this.options.enableHapticFeedback) {
              this.triggerHapticFeedback(HapticFeedbackType.LIGHT);
            }

            // Remove if once option is set
            if (recognizer.options?.once) {
              this.gestures.recognizers.delete(name);
            }
          }
        });

        // Add to history
        this.gestures.history.push({
          type: gestureEvent.type,
          timestamp: gestureEvent.timestamp,
          position: {
            x: gestureEvent.position.x,
            y: gestureEvent.position.y
          },
          target: gestureEvent.target.tagName,
          duration: gestureEvent.duration
        });

        // Limit history size
        if (this.gestures.history.length > 50) {
          this.gestures.history.shift();
        }

        // Remove from active gestures
        this.gestures.active.delete(touchId);
      }
    }
  }

  /**
   * Handle touch cancel event
   */
  private handleTouchCancel(event: TouchEvent): void {
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const touchId = `touch_${touch.identifier}`;
      this.gestures.active.delete(touchId);
    }
  }

  /**
   * Handle orientation change event
   */
  private handleOrientationChange(): void {
    this.device.orientation = this.getOrientation();
    this.device.screenSize = this.getScreenSize();

    // Dispatch custom event
    const event = new CustomEvent('konivrer:orientationchange', {
      detail: {
        orientation: this.device.orientation,
        screenSize: this.device.screenSize
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Handle resize event
   */
  private handleResize(): void {
    this.device.screenSize = this.getScreenSize();
    this.device.orientation = this.getOrientation();

    // Dispatch custom event
    const event = new CustomEvent('konivrer:resize', {
      detail: {
        screenSize: this.device.screenSize,
        orientation: this.device.orientation
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Handle visibility change event
   */
  private handleVisibilityChange(): void {
    const isVisible = document.visibilityState === 'visible';

    // Dispatch custom event
    const event = new CustomEvent('konivrer:visibilitychange', {
      detail: {
        isVisible
      }
    });
    document.dispatchEvent(event);

    // Adjust quality when returning to visible
    if (isVisible && this.options.adaptiveQuality) {
      this.adjustQualityBasedOnPerformance();
    }
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    // Sync offline data
    if (this.options.enableOfflineMode) {
      this.syncOfflineData();
    }

    // Dispatch custom event
    const event = new CustomEvent('konivrer:online');
    document.dispatchEvent(event);
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    // Enable offline mode
    if (this.options.enableOfflineMode) {
      this.enableOfflineMode();
    }

    // Dispatch custom event
    const event = new CustomEvent('konivrer:offline');
    document.dispatchEvent(event);
  }

  /**
   * Register a gesture recognizer
   */
  registerGesture(name: string, config: GestureConfig): void {
    this.gestures.recognizers.set(name, config);
  }

  /**
   * Unregister a gesture recognizer
   */
  unregisterGesture(name: string): void {
    this.gestures.recognizers.delete(name);
  }

  /**
   * Trigger haptic feedback
   */
  triggerHapticFeedback(type: HapticFeedbackType): void {
    if (!this.options.enableHapticFeedback) return;

    if ('vibrate' in navigator) {
      switch (type) {
        case HapticFeedbackType.LIGHT:
          navigator.vibrate(10);
          break;
        case HapticFeedbackType.MEDIUM:
          navigator.vibrate(20);
          break;
        case HapticFeedbackType.HEAVY:
          navigator.vibrate(30);
          break;
        case HapticFeedbackType.SUCCESS:
          navigator.vibrate([10, 30, 10]);
          break;
        case HapticFeedbackType.WARNING:
          navigator.vibrate([30, 50, 30]);
          break;
        case HapticFeedbackType.ERROR:
          navigator.vibrate([50, 100, 50]);
          break;
      }
    }
  }

  /**
   * Sync offline data with server
   */
  private syncOfflineData(): void {
    if (!navigator.onLine) return;

    console.log('Syncing offline data');
    // Implementation would depend on specific offline data structure
    this.offline.lastSyncTime = new Date();
  }

  /**
   * Enable offline mode
   */
  private enableOfflineMode(): void {
    console.log('Enabling offline mode');
    // Implementation would depend on specific offline requirements
  }

  /**
   * Measure network speed
   */
  private async measureNetworkSpeed(): Promise<void> {
    if (!navigator.onLine) {
      this.performance.networkSpeed = NetworkSpeed.SLOW;
      return;
    }

    try {
      const startTime = performance.now();
      const response = await fetch('/api/ping', { method: 'GET', cache: 'no-cache' });
      const endTime = performance.now();

      this.performance.latency = endTime - startTime;

      // Determine network speed based on latency
      if (this.performance.latency < 100) {
        this.performance.networkSpeed = NetworkSpeed.FAST;
      } else if (this.performance.latency < 300) {
        this.performance.networkSpeed = NetworkSpeed.MEDIUM;
      } else {
        this.performance.networkSpeed = NetworkSpeed.SLOW;
      }

      // Adjust quality based on network speed if low bandwidth mode is enabled
      if (this.options.lowBandwidthMode) {
        this.adjustQualityBasedOnNetwork();
      }
    } catch (error) {
      console.error('Failed to measure network speed:', error);
      this.performance.networkSpeed = NetworkSpeed.SLOW;
    }
  }

  /**
   * Set quality level based on device capabilities
   */
  private setQualityBasedOnDevice(): void {
    if (!this.options.adaptiveQuality) return;

    // Determine quality based on device type and pixel ratio
    if (this.device.isMobile) {
      if (this.device.pixelRatio >= 3) {
        this.setQualityLevel(QualityLevel.MEDIUM);
      } else {
        this.setQualityLevel(QualityLevel.LOW);
      }
    } else if (this.device.isTablet) {
      if (this.device.pixelRatio >= 2) {
        this.setQualityLevel(QualityLevel.HIGH);
      } else {
        this.setQualityLevel(QualityLevel.MEDIUM);
      }
    } else {
      // Desktop
      if (this.device.pixelRatio >= 2) {
        this.setQualityLevel(QualityLevel.ULTRA);
      } else {
        this.setQualityLevel(QualityLevel.HIGH);
      }
    }
  }

  /**
   * Adjust quality based on performance metrics
   */
  private adjustQualityBasedOnPerformance(): void {
    if (!this.options.adaptiveQuality) return;

    // Adjust quality based on frame rate
    if (this.performance.frameRate < 30) {
      // Poor performance, lower quality
      this.decreaseQuality();
    } else if (this.performance.frameRate > 55 && this.quality.level !== QualityLevel.ULTRA) {
      // Good performance, can increase quality
      this.increaseQuality();
    }
  }

  /**
   * Adjust quality based on network speed
   */
  private adjustQualityBasedOnNetwork(): void {
    if (!this.options.lowBandwidthMode) return;

    switch (this.performance.networkSpeed) {
      case NetworkSpeed.SLOW:
        this.setQualityLevel(QualityLevel.LOW);
        break;
      case NetworkSpeed.MEDIUM:
        this.setQualityLevel(QualityLevel.MEDIUM);
        break;
      case NetworkSpeed.FAST:
        // Keep current quality or use preferred
        break;
    }
  }

  /**
   * Set quality level
   */
  setQualityLevel(level: QualityLevel): void {
    if (this.quality.level === level) return;

    this.quality.level = level;

    // Adjust specific quality settings based on level
    switch (level) {
      case QualityLevel.LOW:
        this.quality.textureQuality = 0.5;
        this.quality.effectsQuality = 0.3;
        this.quality.animationQuality = 0.5;
        this.quality.shadowQuality = 0.0;
        this.quality.antialiasing = false;
        this.quality.renderScale = 0.75;
        break;
      case QualityLevel.MEDIUM:
        this.quality.textureQuality = 0.75;
        this.quality.effectsQuality = 0.6;
        this.quality.animationQuality = 0.75;
        this.quality.shadowQuality = 0.5;
        this.quality.antialiasing = false;
        this.quality.renderScale = 1.0;
        break;
      case QualityLevel.HIGH:
        this.quality.textureQuality = 1.0;
        this.quality.effectsQuality = 0.8;
        this.quality.animationQuality = 1.0;
        this.quality.shadowQuality = 0.75;
        this.quality.antialiasing = true;
        this.quality.renderScale = 1.0;
        break;
      case QualityLevel.ULTRA:
        this.quality.textureQuality = 1.0;
        this.quality.effectsQuality = 1.0;
        this.quality.animationQuality = 1.0;
        this.quality.shadowQuality = 1.0;
        this.quality.antialiasing = true;
        this.quality.renderScale = 1.5;
        break;
    }

    // Dispatch quality change event
    const event = new CustomEvent('konivrer:qualitychange', {
      detail: {
        level: this.quality.level,
        settings: this.quality
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Increase quality level
   */
  private increaseQuality(): void {
    switch (this.quality.level) {
      case QualityLevel.LOW:
        this.setQualityLevel(QualityLevel.MEDIUM);
        break;
      case QualityLevel.MEDIUM:
        this.setQualityLevel(QualityLevel.HIGH);
        break;
      case QualityLevel.HIGH:
        this.setQualityLevel(QualityLevel.ULTRA);
        break;
      // ULTRA is already the highest
    }
  }

  /**
   * Decrease quality level
   */
  private decreaseQuality(): void {
    switch (this.quality.level) {
      case QualityLevel.ULTRA:
        this.setQualityLevel(QualityLevel.HIGH);
        break;
      case QualityLevel.HIGH:
        this.setQualityLevel(QualityLevel.MEDIUM);
        break;
      case QualityLevel.MEDIUM:
        this.setQualityLevel(QualityLevel.LOW);
        break;
      // LOW is already the lowest
    }
  }

  /**
   * Get current screen orientation
   */
  private getOrientation(): ScreenOrientation {
    if (window.innerHeight > window.innerWidth) {
      return ScreenOrientation.PORTRAIT;
    } else {
      return ScreenOrientation.LANDSCAPE;
    }
  }

  /**
   * Get current screen size
   */
  private getScreenSize(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  /**
   * Detect if device is mobile
   */
  private detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Detect if device is tablet
   */
  private detectTablet(): boolean {
    return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  }

  /**
   * Detect device type
   */
  private detectDeviceType(): DeviceType {
    if (this.detectTablet()) {
      return DeviceType.TABLET;
    } else if (this.detectMobile()) {
      return DeviceType.MOBILE;
    } else {
      return DeviceType.DESKTOP;
    }
  }

  /**
   * Detect browser information
   */
  private detectBrowser(): DeviceInfo['browserInfo'] {
    const ua = navigator.userAgent;
    let browserName = 'unknown';
    let browserVersion = 'unknown';
    let isChrome = false;
    let isSafari = false;
    let isFirefox = false;
    let isEdge = false;

    // Chrome
    if (ua.indexOf('Chrome') !== -1) {
      isChrome = true;
      browserName = 'Chrome';
      const match = ua.match(/Chrome\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
    }

    // Edge
    if (ua.indexOf('Edg') !== -1) {
      isEdge = true;
      isChrome = false;
      browserName = 'Edge';
      const match = ua.match(/Edg\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
    }

    // Firefox
    if (ua.indexOf('Firefox') !== -1) {
      isFirefox = true;
      browserName = 'Firefox';
      const match = ua.match(/Firefox\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
    }

    // Safari
    if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
      isSafari = true;
      browserName = 'Safari';
      const match = ua.match(/Version\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
    }

    return {
      name: browserName,
      version: browserVersion,
      isChrome,
      isSafari,
      isFirefox,
      isEdge
    };
  }

  /**
   * Detect operating system information
   */
  private detectOS(): DeviceInfo['osInfo'] {
    const ua = navigator.userAgent;
    let osName = 'unknown';
    let osVersion = 'unknown';
    let isIOS = false;
    let isAndroid = false;
    let isWindows = false;
    let isMacOS = false;

    // iOS
    if (/iPhone|iPad|iPod/.test(ua)) {
      isIOS = true;
      osName = 'iOS';
      const match = ua.match(/OS (\d+_\d+)/);
      if (match) osVersion = match[1].replace('_', '.');
    }

    // Android
    if (/Android/.test(ua)) {
      isAndroid = true;
      osName = 'Android';
      const match = ua.match(/Android (\d+\.\d+)/);
      if (match) osVersion = match[1];
    }

    // Windows
    if (/Windows/.test(ua)) {
      isWindows = true;
      osName = 'Windows';
      if (/Windows NT 10.0/.test(ua)) osVersion = '10';
      else if (/Windows NT 6.3/.test(ua)) osVersion = '8.1';
      else if (/Windows NT 6.2/.test(ua)) osVersion = '8';
      else if (/Windows NT 6.1/.test(ua)) osVersion = '7';
    }

    // macOS
    if (/Mac OS X/.test(ua)) {
      isMacOS = true;
      osName = 'macOS';
      const match = ua.match(/Mac OS X (\d+[._]\d+)/);
      if (match) osVersion = match[1].replace('_', '.');
    }

    return {
      name: osName,
      version: osVersion,
      isIOS,
      isAndroid,
      isWindows,
      isMacOS
    };
  }

  /**
   * Convert base64 to Uint8Array for push notifications
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Get device information
   */
  getDeviceInfo(): DeviceInfo {
    return { ...this.device };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performance };
  }

  /**
   * Get quality settings
   */
  getQualitySettings(): QualitySettings {
    return { ...this.quality };
  }

  /**
   * Get offline data
   */
  getOfflineData(): OfflineData {
    return { ...this.offline };
  }

  /**
   * Get gesture history
   */
  getGestureHistory(): GestureHistoryEntry[] {
    return [...this.gestures.history];
  }

  /**
   * Enable fullscreen mode
   */
  enableFullscreen(element: HTMLElement = document.documentElement): Promise<void> {
    if (!this.options.enableFullscreen) return Promise.reject('Fullscreen not enabled in options');

    if (element.requestFullscreen) {
      return element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      return (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      return (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      return (element as any).msRequestFullscreen();
    }

    return Promise.reject('Fullscreen API not supported');
  }

  /**
   * Exit fullscreen mode
   */
  exitFullscreen(): Promise<void> {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      return (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      return (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      return (document as any).msExitFullscreen();
    }

    return Promise.reject('Fullscreen API not supported');
  }

  /**
   * Enable picture-in-picture mode
   */
  enablePictureInPicture(video: HTMLVideoElement): Promise<void> {
    if (!this.options.enablePictureInPicture) {
      return Promise.reject('Picture-in-picture not enabled in options');
    }

    if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
      return video.requestPictureInPicture();
    }

    return Promise.reject('Picture-in-picture not supported');
  }

  /**
   * Exit picture-in-picture mode
   */
  exitPictureInPicture(): Promise<void> {
    if (document.pictureInPictureElement) {
      return document.exitPictureInPicture();
    }

    return Promise.reject('Not in picture-in-picture mode');
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    // Remove event listeners
    this.eventListeners.forEach((listener, event) => {
      if (event.startsWith('touch')) {
        document.removeEventListener(event, listener);
      } else {
        window.removeEventListener(event, listener);
      }
    });

    // Disconnect resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // Release wake lock
    if (this.wakeLock) {
      this.wakeLock.release();
      this.wakeLock = null;
    }

    console.log('Mobile optimization cleaned up');
  }
}

// Create singleton instance
const mobileOptimization = new MobileOptimization();

export default mobileOptimization;