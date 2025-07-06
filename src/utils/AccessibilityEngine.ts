/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Accessibility Engine for KONIVRER
 * Provides comprehensive accessibility features including screen reader support,
 * color blind accessibility, motor impairment support, and customizable UI
 */

// Types for accessibility engine
export type ColorBlindType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type VerbosityLevel = 'minimal' | 'normal' | 'verbose';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large';
export type ContrastLevel = 'normal' | 'high' | 'very-high';
export type AnimationSpeed = 'off' | 'slow' | 'normal' | 'fast';
export type FocusIndicatorStyle = 'outline' | 'highlight' | 'both';

export interface AccessibilityOptions {
  enableScreenReader?: boolean;
  enableColorBlindSupport?: boolean;
  enableMotorSupport?: boolean;
  enableCognitiveSupport?: boolean;
  enableKeyboardNavigation?: boolean;
  [key: string]: any;
}

export interface ScreenReaderOptions {
  enabled: boolean;
  readingSpeed: number;
  verbosity: VerbosityLevel;
  announcePageChanges: boolean;
  announceNotifications: boolean;
  announceTurnChanges: boolean;
  announceCardDetails: boolean;
  [key: string]: any;
}

export interface ColorBlindOptions {
  type: ColorBlindType;
  customColors: Map<string, string>;
  highContrast: boolean;
  contrastLevel: ContrastLevel;
  [key: string]: any;
}

export interface MotorOptions {
  dwellTime: number;
  clickAssistance: boolean;
  stickyKeys: boolean;
  keyRepeatDelay: number;
  dragThreshold: number;
  touchTargetSize: 'small' | 'medium' | 'large';
  [key: string]: any;
}

export interface CognitiveOptions {
  simplifiedUI: boolean;
  reducedMotion: boolean;
  extendedTimers: boolean;
  gameHints: boolean;
  tutorialMode: boolean;
  reminderText: boolean;
  [key: string]: any;
}

export interface VisualOptions {
  fontSize: FontSize;
  fontFamily: string;
  lineSpacing: number;
  animationSpeed: AnimationSpeed;
  focusIndicator: FocusIndicatorStyle;
  iconSize: 'small' | 'medium' | 'large';
  [key: string]: any;
}

export interface Announcement {
  text: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: number;
  category: string;
  [key: string]: any;
}

export interface FocusableElement {
  id: string;
  type: string;
  description: string;
  ariaLabel?: string;
  [key: string]: any;
}

export class AccessibilityEngine {
  private options: AccessibilityOptions;
  private screenReader: {
    enabled: boolean;
    announcements: Announcement[];
    focusedElement: FocusableElement | null;
    readingSpeed: number;
    verbosity: VerbosityLevel;
    [key: string]: any;
  };
  private colorBlind: {
    type: ColorBlindType;
    filters: Map<ColorBlindType, string>;
    customColors: Map<string, string>;
    [key: string]: any;
  };
  private motor: {
    dwellTime: number;
    clickAssistance: boolean;
    stickyKeys: boolean;
    keyRepeatDelay: number;
    dragThreshold: number;
    [key: string]: any;
  };
  private cognitive: {
    simplifiedUI: boolean;
    reducedMotion: boolean;
    extendedTimers: boolean;
    gameHints: boolean;
    [key: string]: any;
  };
  private visual: {
    fontSize: FontSize;
    fontFamily: string;
    lineSpacing: number;
    animationSpeed: AnimationSpeed;
    [key: string]: any;
  };
  private eventListeners: Map<string, Function[]>;
  private keyboardShortcuts: Map<string, Function>;
  private focusableElements: FocusableElement[];
  private currentFocusIndex: number;
  private initialized: boolean;

  constructor(options: AccessibilityOptions = {}) {
    this.options = {
      enableScreenReader: true,
      enableColorBlindSupport: true,
      enableMotorSupport: true,
      enableCognitiveSupport: true,
      enableKeyboardNavigation: true,
      ...options
    };

    // Screen reader support
    this.screenReader = {
      enabled: false,
      announcements: [],
      focusedElement: null,
      readingSpeed: 1.0,
      verbosity: 'normal', // minimal, normal, verbose
    };

    // Color blind support
    this.colorBlind = {
      type: 'none', // none, protanopia, deuteranopia, tritanopia, achromatopsia
      filters: new Map<ColorBlindType, string>(),
      customColors: new Map<string, string>()
    };

    // Motor impairment support
    this.motor = {
      dwellTime: 1000,
      clickAssistance: false,
      stickyKeys: false,
      keyRepeatDelay: 500,
      dragThreshold: 10
    };

    // Cognitive support
    this.cognitive = {
      simplifiedUI: false,
      reducedMotion: false,
      extendedTimers: false,
      gameHints: false
    };

    // Visual settings
    this.visual = {
      fontSize: 'medium',
      fontFamily: 'Arial, sans-serif',
      lineSpacing: 1.5,
      animationSpeed: 'normal'
    };

    // Event listeners
    this.eventListeners = new Map<string, Function[]>();
    
    // Keyboard shortcuts
    this.keyboardShortcuts = new Map<string, Function>();
    
    // Focusable elements for keyboard navigation
    this.focusableElements = [];
    this.currentFocusIndex = -1;
    
    // Initialization state
    this.initialized = false;
    
    // Initialize color blind filters
    this._initializeColorBlindFilters();
  }

  /**
   * Initialize the accessibility engine
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }
    
    // Set up event listeners
    this._setupEventListeners();
    
    // Set up keyboard shortcuts
    this._setupKeyboardShortcuts();
    
    // Apply initial settings
    this._applySettings();
    
    this.initialized = true;
    
    // Announce initialization
    if (this.screenReader.enabled) {
      this.announce('Accessibility features initialized', 'system', 'medium');
    }
  }

  /**
   * Initialize color blind filters
   */
  private _initializeColorBlindFilters(): void {
    // SVG filters for color blindness simulation
    this.colorBlind.filters.set('protanopia', 
      'filter: url(#protanopia-filter);'
    );
    this.colorBlind.filters.set('deuteranopia', 
      'filter: url(#deuteranopia-filter);'
    );
    this.colorBlind.filters.set('tritanopia', 
      'filter: url(#tritanopia-filter);'
    );
    this.colorBlind.filters.set('achromatopsia', 
      'filter: grayscale(100%);'
    );
    
    // Add SVG filters to document if they don't exist
    this._addColorBlindFiltersToDOM();
  }

  /**
   * Add color blind filters to DOM
   */
  private _addColorBlindFiltersToDOM(): void {
    // Check if filters already exist
    if (document.getElementById('accessibility-filters')) {
      return;
    }
    
    // Create SVG element with filters
    const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElem.setAttribute('id', 'accessibility-filters');
    svgElem.setAttribute('style', 'position: absolute; height: 0; width: 0;');
    
    // Add protanopia filter
    const protanopiaFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    protanopiaFilter.setAttribute('id', 'protanopia-filter');
    protanopiaFilter.innerHTML = `
      <feColorMatrix type="matrix" values="
        0.567, 0.433, 0,     0, 0
        0.558, 0.442, 0,     0, 0
        0,     0.242, 0.758, 0, 0
        0,     0,     0,     1, 0
      "/>
    `;
    svgElem.appendChild(protanopiaFilter);
    
    // Add deuteranopia filter
    const deuteranopiaFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    deuteranopiaFilter.setAttribute('id', 'deuteranopia-filter');
    deuteranopiaFilter.innerHTML = `
      <feColorMatrix type="matrix" values="
        0.625, 0.375, 0,   0, 0
        0.7,   0.3,   0,   0, 0
        0,     0.3,   0.7, 0, 0
        0,     0,     0,   1, 0
      "/>
    `;
    svgElem.appendChild(deuteranopiaFilter);
    
    // Add tritanopia filter
    const tritanopiaFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    tritanopiaFilter.setAttribute('id', 'tritanopia-filter');
    tritanopiaFilter.innerHTML = `
      <feColorMatrix type="matrix" values="
        0.95, 0.05,  0,     0, 0
        0,    0.433, 0.567, 0, 0
        0,    0.475, 0.525, 0, 0
        0,    0,     0,     1, 0
      "/>
    `;
    svgElem.appendChild(tritanopiaFilter);
    
    // Add to document
    document.body.appendChild(svgElem);
  }

  /**
   * Set up event listeners
   */
  private _setupEventListeners(): void {
    // Listen for focus changes
    document.addEventListener('focusin', this._handleFocusChange.bind(this));
    
    // Listen for keyboard events
    document.addEventListener('keydown', this._handleKeyDown.bind(this));
    
    // Listen for mouse events if click assistance is enabled
    if (this.motor.clickAssistance) {
      document.addEventListener('mousemove', this._handleMouseMove.bind(this));
    }
  }

  /**
   * Set up keyboard shortcuts
   */
  private _setupKeyboardShortcuts(): void {
    // Toggle screen reader
    this.keyboardShortcuts.set('Alt+S', () => {
      this.toggleScreenReader();
    });
    
    // Toggle high contrast
    this.keyboardShortcuts.set('Alt+C', () => {
      this.toggleHighContrast();
    });
    
    // Toggle simplified UI
    this.keyboardShortcuts.set('Alt+U', () => {
      this.toggleSimplifiedUI();
    });
    
    // Increase font size
    this.keyboardShortcuts.set('Alt+Plus', () => {
      this.increaseFontSize();
    });
    
    // Decrease font size
    this.keyboardShortcuts.set('Alt+Minus', () => {
      this.decreaseFontSize();
    });
  }

  /**
   * Apply accessibility settings
   */
  private _applySettings(): void {
    // Apply color blind filter if enabled
    if (this.options.enableColorBlindSupport && this.colorBlind.type !== 'none') {
      this._applyColorBlindFilter();
    }
    
    // Apply font size
    this._applyFontSize();
    
    // Apply reduced motion if enabled
    if (this.cognitive.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }
    
    // Apply high contrast if enabled
    if (this.colorBlind.highContrast) {
      document.body.classList.add('high-contrast');
    }
    
    // Apply simplified UI if enabled
    if (this.cognitive.simplifiedUI) {
      document.body.classList.add('simplified-ui');
    }
  }

  /**
   * Apply color blind filter
   */
  private _applyColorBlindFilter(): void {
    const filter = this.colorBlind.filters.get(this.colorBlind.type);
    if (filter) {
      document.body.setAttribute('style', filter);
    }
  }

  /**
   * Apply font size
   */
  private _applyFontSize(): void {
    let sizeValue: string;
    
    switch (this.visual.fontSize) {
      case 'small':
        sizeValue = '0.9rem';
        break;
      case 'medium':
        sizeValue = '1rem';
        break;
      case 'large':
        sizeValue = '1.2rem';
        break;
      case 'x-large':
        sizeValue = '1.5rem';
        break;
      default:
        sizeValue = '1rem';
    }
    
    document.documentElement.style.setProperty('--base-font-size', sizeValue);
  }

  /**
   * Handle focus change
   */
  private _handleFocusChange(event: FocusEvent): void {
    if (!event.target || !(event.target instanceof HTMLElement)) {
      return;
    }
    
    const element = event.target;
    
    // Update focused element
    this.screenReader.focusedElement = {
      id: element.id || 'unknown',
      type: element.tagName.toLowerCase(),
      description: element.getAttribute('aria-label') || element.textContent || 'Unknown element'
    };
    
    // Announce focused element if screen reader is enabled
    if (this.screenReader.enabled) {
      this.announce(this.screenReader.focusedElement.description, 'focus', 'low');
    }
  }

  /**
   * Handle key down
   */
  private _handleKeyDown(event: KeyboardEvent): void {
    // Check for keyboard shortcuts
    const key = this._getKeyCombo(event);
    
    if (this.keyboardShortcuts.has(key)) {
      event.preventDefault();
      const handler = this.keyboardShortcuts.get(key);
      if (handler) {
        handler();
      }
      return;
    }
    
    // Handle keyboard navigation
    if (this.options.enableKeyboardNavigation) {
      this._handleKeyboardNavigation(event);
    }
  }

  /**
   * Get key combination string
   */
  private _getKeyCombo(event: KeyboardEvent): string {
    const modifiers = [];
    
    if (event.altKey) modifiers.push('Alt');
    if (event.ctrlKey) modifiers.push('Ctrl');
    if (event.shiftKey) modifiers.push('Shift');
    if (event.metaKey) modifiers.push('Meta');
    
    const key = event.key === ' ' ? 'Space' : event.key;
    
    return [...modifiers, key].join('+');
  }

  /**
   * Handle keyboard navigation
   */
  private _handleKeyboardNavigation(event: KeyboardEvent): void {
    // Tab key is handled by the browser
    if (event.key === 'Tab') {
      return;
    }
    
    // Arrow keys for navigation
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      this._focusNextElement();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      this._focusPreviousElement();
    } else if (event.key === 'Enter' || event.key === ' ') {
      // Activate focused element
      if (this.screenReader.focusedElement && document.activeElement instanceof HTMLElement) {
        event.preventDefault();
        document.activeElement.click();
      }
    }
  }

  /**
   * Focus next element
   */
  private _focusNextElement(): void {
    if (this.focusableElements.length === 0) {
      this._updateFocusableElements();
    }
    
    if (this.focusableElements.length === 0) {
      return;
    }
    
    this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableElements.length;
    this._focusElementAtIndex(this.currentFocusIndex);
  }

  /**
   * Focus previous element
   */
  private _focusPreviousElement(): void {
    if (this.focusableElements.length === 0) {
      this._updateFocusableElements();
    }
    
    if (this.focusableElements.length === 0) {
      return;
    }
    
    this.currentFocusIndex = (this.currentFocusIndex - 1 + this.focusableElements.length) % this.focusableElements.length;
    this._focusElementAtIndex(this.currentFocusIndex);
  }

  /**
   * Focus element at index
   */
  private _focusElementAtIndex(index: number): void {
    if (index < 0 || index >= this.focusableElements.length) {
      return;
    }
    
    const element = document.getElementById(this.focusableElements[index].id);
    if (element) {
      element.focus();
    }
  }

  /**
   * Update focusable elements
   */
  private _updateFocusableElements(): void {
    const selector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const elements = document.querySelectorAll<HTMLElement>(selector);
    
    this.focusableElements = Array.from(elements)
      .filter(el => {
        // Filter out hidden elements
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map(el => ({
        id: el.id || `auto-id-${Math.random().toString(36).substr(2, 9)}`,
        type: el.tagName.toLowerCase(),
        description: el.getAttribute('aria-label') || el.textContent || 'Unknown element'
      }));
    
    // Ensure all elements have IDs
    this.focusableElements.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el?.id) {
        el?.setAttribute('id', item.id);
      }
    });
  }

  /**
   * Handle mouse move (for click assistance)
   */
  private _handleMouseMove(event: MouseEvent): void {
    // Implementation for dwell clicking would go here
    // This would track mouse position and trigger clicks after dwellTime
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.push(callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      return;
    }
    
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      this.eventListeners.set(
        event,
        listeners.filter(cb => cb !== callback)
      );
    }
  }

  /**
   * Emit event
   */
  private _emit(event: string, data: any): void {
    if (!this.eventListeners.has(event)) {
      return;
    }
    
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error);
        }
      });
    }
  }

  /**
   * Announce message via screen reader
   */
  announce(message: string, category: string = 'general', priority: 'low' | 'medium' | 'high' = 'medium'): void {
    // Add to announcements queue
    const announcement: Announcement = {
      text: message,
      priority,
      timestamp: Date.now(),
      category
    };
    
    this.screenReader.announcements.push(announcement);
    
    // Emit event
    this._emit('announcement', announcement);
    
    // Process announcements
    this._processAnnouncements();
  }

  /**
   * Process screen reader announcements
   */
  private _processAnnouncements(): void {
    if (!this.screenReader.enabled || this.screenReader.announcements.length === 0) {
      return;
    }
    
    // Sort by priority
    this.screenReader.announcements.sort((a, b) => {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      return priorityValues[b.priority] - priorityValues[a.priority];
    });
    
    // Get next announcement
    const announcement = this.screenReader.announcements.shift();
    if (!announcement) {
      return;
    }
    
    // Create or update aria-live region
    let liveRegion = document.getElementById('accessibility-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'accessibility-live-region';
      liveRegion.setAttribute('aria-live', 'assertive');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      liveRegion.style.clip = 'rect(0, 0, 0, 0)';
      document.body.appendChild(liveRegion);
    }
    
    // Set the announcement text
    liveRegion.textContent = announcement.text;
    
    // Emit event
    this._emit('announced', announcement);
  }

  /**
   * Toggle screen reader
   */
  toggleScreenReader(): void {
    this.screenReader.enabled = !this.screenReader.enabled;
    
    // Announce state change
    if (this.screenReader.enabled) {
      this.announce('Screen reader enabled', 'system', 'high');
    }
    
    // Emit event
    this._emit('screenReaderToggled', { enabled: this.screenReader.enabled });
  }

  /**
   * Toggle high contrast
   */
  toggleHighContrast(): void {
    this.colorBlind.highContrast = !this.colorBlind.highContrast;
    
    if (this.colorBlind.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Announce state change
    if (this.screenReader.enabled) {
      this.announce(
        this.colorBlind.highContrast ? 'High contrast enabled' : 'High contrast disabled',
        'system',
        'medium'
      );
    }
    
    // Emit event
    this._emit('highContrastToggled', { enabled: this.colorBlind.highContrast });
  }

  /**
   * Toggle simplified UI
   */
  toggleSimplifiedUI(): void {
    this.cognitive.simplifiedUI = !this.cognitive.simplifiedUI;
    
    if (this.cognitive.simplifiedUI) {
      document.body.classList.add('simplified-ui');
    } else {
      document.body.classList.remove('simplified-ui');
    }
    
    // Announce state change
    if (this.screenReader.enabled) {
      this.announce(
        this.cognitive.simplifiedUI ? 'Simplified interface enabled' : 'Simplified interface disabled',
        'system',
        'medium'
      );
    }
    
    // Emit event
    this._emit('simplifiedUIToggled', { enabled: this.cognitive.simplifiedUI });
  }

  /**
   * Increase font size
   */
  increaseFontSize(): void {
    const sizes: FontSize[] = ['small', 'medium', 'large', 'x-large'];
    const currentIndex = sizes.indexOf(this.visual.fontSize);
    
    if (currentIndex < sizes.length - 1) {
      this.visual.fontSize = sizes[currentIndex + 1];
      this._applyFontSize();
      
      // Announce state change
      if (this.screenReader.enabled) {
        this.announce(`Font size increased to ${this.visual.fontSize}`, 'system', 'medium');
      }
      
      // Emit event
      this._emit('fontSizeChanged', { fontSize: this.visual.fontSize });
    }
  }

  /**
   * Decrease font size
   */
  decreaseFontSize(): void {
    const sizes: FontSize[] = ['small', 'medium', 'large', 'x-large'];
    const currentIndex = sizes.indexOf(this.visual.fontSize);
    
    if (currentIndex > 0) {
      this.visual.fontSize = sizes[currentIndex - 1];
      this._applyFontSize();
      
      // Announce state change
      if (this.screenReader.enabled) {
        this.announce(`Font size decreased to ${this.visual.fontSize}`, 'system', 'medium');
      }
      
      // Emit event
      this._emit('fontSizeChanged', { fontSize: this.visual.fontSize });
    }
  }

  /**
   * Set color blind mode
   */
  setColorBlindMode(type: ColorBlindType): void {
    // Remove previous filter
    document.body.removeAttribute('style');
    
    this.colorBlind.type = type;
    
    if (type !== 'none') {
      this._applyColorBlindFilter();
    }
    
    // Announce state change
    if (this.screenReader.enabled) {
      this.announce(`Color blind mode set to ${type}`, 'system', 'medium');
    }
    
    // Emit event
    this._emit('colorBlindModeChanged', { type });
  }

  /**
   * Set screen reader options
   */
  setScreenReaderOptions(options: Partial<ScreenReaderOptions>): void {
    this.screenReader = {
      ...this.screenReader,
      ...options
    };
    
    // Announce state change
    if (this.screenReader.enabled) {
      this.announce('Screen reader settings updated', 'system', 'medium');
    }
    
    // Emit event
    this._emit('screenReaderOptionsChanged', this.screenReader);
  }

  /**
   * Set motor options
   */
  setMotorOptions(options: Partial<MotorOptions>): void {
    this.motor = {
      ...this.motor,
      ...options
    };
    
    // Update click assistance if needed
    if (options.clickAssistance !== undefined) {
      if (options.clickAssistance) {
        document.addEventListener('mousemove', this._handleMouseMove.bind(this));
      } else {
        document.removeEventListener('mousemove', this._handleMouseMove.bind(this));
      }
    }
    
    // Announce state change
    if (this.screenReader.enabled) {
      this.announce('Motor assistance settings updated', 'system', 'medium');
    }
    
    // Emit event
    this._emit('motorOptionsChanged', this.motor);
  }

  /**
   * Set cognitive options
   */
  setCognitiveOptions(options: Partial<CognitiveOptions>): void {
    this.cognitive = {
      ...this.cognitive,
      ...options
    };
    
    // Apply reduced motion if changed
    if (options.reducedMotion !== undefined) {
      if (options.reducedMotion) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    }
    
    // Apply simplified UI if changed
    if (options.simplifiedUI !== undefined) {
      if (options.simplifiedUI) {
        document.body.classList.add('simplified-ui');
      } else {
        document.body.classList.remove('simplified-ui');
      }
    }
    
    // Announce state change
    if (this.screenReader.enabled) {
      this.announce('Cognitive assistance settings updated', 'system', 'medium');
    }
    
    // Emit event
    this._emit('cognitiveOptionsChanged', this.cognitive);
  }

  /**
   * Set visual options
   */
  setVisualOptions(options: Partial<VisualOptions>): void {
    this.visual = {
      ...this.visual,
      ...options
    };
    
    // Apply font size if changed
    if (options.fontSize !== undefined) {
      this._applyFontSize();
    }
    
    // Apply font family if changed
    if (options.fontFamily !== undefined) {
      document.documentElement.style.setProperty('--base-font-family', options.fontFamily);
    }
    
    // Apply line spacing if changed
    if (options.lineSpacing !== undefined) {
      document.documentElement.style.setProperty('--base-line-height', options.lineSpacing.toString());
    }
    
    // Announce state change
    if (this.screenReader.enabled) {
      this.announce('Visual settings updated', 'system', 'medium');
    }
    
    // Emit event
    this._emit('visualOptionsChanged', this.visual);
  }

  /**
   * Get current settings
   */
  getSettings(): {
    screenReader: typeof this.screenReader;
    colorBlind: typeof this.colorBlind;
    motor: typeof this.motor;
    cognitive: typeof this.cognitive;
    visual: typeof this.visual;
  } {
    return {
      screenReader: { ...this.screenReader },
      colorBlind: { ...this.colorBlind },
      motor: { ...this.motor },
      cognitive: { ...this.cognitive },
      visual: { ...this.visual }
    };
  }

  /**
   * Reset all settings to defaults
   */
  resetSettings(): void {
    // Reset screen reader
    this.screenReader = {
      enabled: false,
      announcements: [],
      focusedElement: null,
      readingSpeed: 1.0,
      verbosity: 'normal'
    };
    
    // Reset color blind
    this.colorBlind = {
      type: 'none',
      filters: this.colorBlind.filters, // Keep filters
      customColors: new Map<string, string>()
    };
    
    // Reset motor
    this.motor = {
      dwellTime: 1000,
      clickAssistance: false,
      stickyKeys: false,
      keyRepeatDelay: 500,
      dragThreshold: 10
    };
    
    // Reset cognitive
    this.cognitive = {
      simplifiedUI: false,
      reducedMotion: false,
      extendedTimers: false,
      gameHints: false
    };
    
    // Reset visual
    this.visual = {
      fontSize: 'medium',
      fontFamily: 'Arial, sans-serif',
      lineSpacing: 1.5,
      animationSpeed: 'normal'
    };
    
    // Remove classes
    document.body.classList.remove('high-contrast', 'simplified-ui', 'reduced-motion');
    
    // Remove styles
    document.body.removeAttribute('style');
    document.documentElement.style.removeProperty('--base-font-size');
    document.documentElement.style.removeProperty('--base-font-family');
    document.documentElement.style.removeProperty('--base-line-height');
    
    // Announce reset
    if (this.screenReader.enabled) {
      this.announce('All accessibility settings reset to defaults', 'system', 'high');
    }
    
    // Emit event
    this._emit('settingsReset', {});
  }

  /**
   * Describe element for screen reader
   */
  describeElement(element: HTMLElement, description: string): void {
    // Set aria-label
    element.setAttribute('aria-label', description);
    
    // If element is currently focused, announce the description
    if (document.activeElement === element && this.screenReader.enabled) {
      this.announce(description, 'focus', 'low');
    }
  }

  /**
   * Make element accessible
   */
  makeAccessible(element: HTMLElement, options: {
    label?: string;
    description?: string;
    role?: string;
    tabIndex?: number;
    keyboardShortcut?: string;
  } = {}): void {
    // Set aria attributes
    if (options.label) {
      element.setAttribute('aria-label', options.label);
    }
    
    if (options.description) {
      element.setAttribute('aria-description', options.description);
    }
    
    if (options.role) {
      element.setAttribute('role', options.role);
    }
    
    if (options.tabIndex !== undefined) {
      element.setAttribute('tabindex', options.tabIndex.toString());
    }
    
    // Add keyboard shortcut if provided
    if (options.keyboardShortcut) {
      element.setAttribute('aria-keyshortcuts', options.keyboardShortcut);
      
      // Add to keyboard shortcuts map
      this.keyboardShortcuts.set(options.keyboardShortcut, () => {
        element.click();
      });
    }
  }
}

// Create singleton instance
const accessibilityEngine = new AccessibilityEngine();

export default accessibilityEngine;