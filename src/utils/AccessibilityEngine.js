/**
 * Accessibility Engine for KONIVRER
 * Provides comprehensive accessibility features including screen reader support,
 * color blind accessibility, motor impairment support, and customizable UI
 */
export class AccessibilityEngine {
  constructor(options = {}) {
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
      verbosity: 'normal' // minimal, normal, verbose
    };

    // Color blind support
    this.colorBlind = {
      type: 'none', // none, protanopia, deuteranopia, tritanopia, achromatopsia
      filters: new Map(),
      customColors: new Map()
    };

    // Motor impairment support
    this.motor = {
      dwellTime: 1000,
      clickAssistance: false,
      stickyKeys: false,
      slowKeys: false,
      bounceKeys: false,
      mouseKeys: false
    };

    // Cognitive support
    this.cognitive = {
      reducedMotion: false,
      simplifiedUI: false,
      focusIndicators: true,
      timeoutExtensions: true,
      readingAssistance: false
    };

    // Keyboard navigation
    this.keyboard = {
      enabled: true,
      focusOrder: [],
      shortcuts: new Map(),
      currentFocus: -1,
      trapFocus: false
    };

    // UI customization
    this.ui = {
      fontSize: 1.0,
      contrast: 1.0,
      spacing: 1.0,
      buttonSize: 1.0,
      animationSpeed: 1.0
    };

    // Voice commands (if supported)
    this.voice = {
      enabled: false,
      recognition: null,
      commands: new Map(),
      listening: false
    };

    this.init();
  }

  async init() {
    try {
      this.detectAccessibilityNeeds();
      this.setupScreenReader();
      this.setupColorBlindSupport();
      this.setupMotorSupport();
      this.setupKeyboardNavigation();
      this.setupVoiceCommands();
      this.loadUserPreferences();
      this.applyAccessibilitySettings();
      
      console.log('Accessibility Engine initialized');
    } catch (error) {
      console.error('Failed to initialize Accessibility Engine:', error);
    }
  }

  detectAccessibilityNeeds() {
    // Detect if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.cognitive.reducedMotion = true;
    }

    // Detect if user prefers high contrast
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.ui.contrast = 1.5;
    }

    // Detect if user has forced colors enabled
    if (window.matchMedia('(forced-colors: active)').matches) {
      this.colorBlind.type = 'forced-colors';
    }

    // Check for screen reader
    this.screenReader.enabled = this.detectScreenReader();
  }

  detectScreenReader() {
    // Check for common screen readers
    const userAgent = navigator.userAgent.toLowerCase();
    const screenReaders = ['nvda', 'jaws', 'voiceover', 'talkback', 'orca'];
    
    return screenReaders.some(sr => userAgent.includes(sr)) ||
           // Check for accessibility APIs
           'speechSynthesis' in window ||
           navigator.userAgent.includes('Accessibility');
  }

  /**
   * Screen Reader Support
   */
  setupScreenReader() {
    if (!this.options.enableScreenReader) return;

    // Create live regions for announcements
    this.createLiveRegions();
    
    // Setup focus management
    this.setupFocusManagement();
    
    // Setup ARIA labels and descriptions
    this.setupARIASupport();
    
    // Setup speech synthesis
    if ('speechSynthesis' in window) {
      this.setupSpeechSynthesis();
    }
  }

  createLiveRegions() {
    // Create polite live region for non-urgent announcements
    const politeRegion = document.createElement('div');
    politeRegion.id = 'accessibility-live-polite';
    politeRegion.setAttribute('aria-live', 'polite');
    politeRegion.setAttribute('aria-atomic', 'true');
    politeRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(politeRegion);

    // Create assertive live region for urgent announcements
    const assertiveRegion = document.createElement('div');
    assertiveRegion.id = 'accessibility-live-assertive';
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-atomic', 'true');
    assertiveRegion.style.cssText = politeRegion.style.cssText;
    document.body.appendChild(assertiveRegion);
  }

  announce(message, priority = 'polite') {
    const regionId = `accessibility-live-${priority}`;
    const region = document.getElementById(regionId);
    
    if (region) {
      // Clear and set new message
      region.textContent = '';
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }

    // Also use speech synthesis if available
    if (this.screenReader.enabled && 'speechSynthesis' in window) {
      this.speak(message);
    }

    // Log announcement
    this.screenReader.announcements.push({
      message,
      priority,
      timestamp: Date.now()
    });
  }

  speak(text, options = {}) {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.screenReader.readingSpeed;
    utterance.volume = options.volume || 1.0;
    utterance.pitch = options.pitch || 1.0;

    // Apply verbosity settings
    const processedText = this.processTextForVerbosity(text);
    utterance.text = processedText;

    speechSynthesis.speak(utterance);
  }

  processTextForVerbosity(text) {
    switch (this.screenReader.verbosity) {
      case 'minimal':
        // Remove extra punctuation and abbreviations
        return text.replace(/[.,;:!?]/g, ' ').replace(/\s+/g, ' ').trim();
      case 'verbose':
        // Add extra context
        return this.addVerboseContext(text);
      default:
        return text;
    }
  }

  addVerboseContext(text) {
    // Add context for common game terms
    const gameTerms = {
      'HP': 'Health Points',
      'MP': 'Mana Points',
      'ATK': 'Attack',
      'DEF': 'Defense'
    };

    let processedText = text;
    Object.entries(gameTerms).forEach(([abbrev, full]) => {
      const regex = new RegExp(`\\b${abbrev}\\b`, 'gi');
      processedText = processedText.replace(regex, full);
    });

    return processedText;
  }

  setupFocusManagement() {
    // Track focus changes
    document.addEventListener('focusin', (event) => {
      this.screenReader.focusedElement = event.target;
      this.announceFocusChange(event.target);
    });

    // Handle focus trapping for modals
    document.addEventListener('keydown', (event) => {
      if (this.keyboard.trapFocus && event.key === 'Tab') {
        this.handleFocusTrap(event);
      }
    });
  }

  announceFocusChange(element) {
    if (!this.screenReader.enabled) return;

    let announcement = '';
    
    // Get element description
    const label = this.getElementLabel(element);
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    const state = this.getElementState(element);

    announcement = `${label}, ${role}${state ? ', ' + state : ''}`;

    // Add position information for lists and grids
    const position = this.getElementPosition(element);
    if (position) {
      announcement += `, ${position}`;
    }

    this.announce(announcement, 'polite');
  }

  getElementLabel(element) {
    return element.getAttribute('aria-label') ||
           element.getAttribute('aria-labelledby') &&
           document.getElementById(element.getAttribute('aria-labelledby'))?.textContent ||
           element.textContent ||
           element.getAttribute('alt') ||
           element.getAttribute('title') ||
           'Unlabeled element';
  }

  getElementState(element) {
    const states = [];
    
    if (element.hasAttribute('aria-expanded')) {
      states.push(element.getAttribute('aria-expanded') === 'true' ? 'expanded' : 'collapsed');
    }
    
    if (element.hasAttribute('aria-checked')) {
      const checked = element.getAttribute('aria-checked');
      states.push(checked === 'true' ? 'checked' : checked === 'false' ? 'unchecked' : 'mixed');
    }
    
    if (element.hasAttribute('aria-selected')) {
      states.push(element.getAttribute('aria-selected') === 'true' ? 'selected' : 'not selected');
    }
    
    if (element.disabled) {
      states.push('disabled');
    }

    return states.join(', ');
  }

  /**
   * Color Blind Support
   */
  setupColorBlindSupport() {
    if (!this.options.enableColorBlindSupport) return;

    this.createColorBlindFilters();
    this.setupColorBlindCSS();
  }

  createColorBlindFilters() {
    // Create SVG filters for different types of color blindness
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = 'position: absolute; width: 0; height: 0;';
    
    // Protanopia filter (red-blind)
    const protanopiaFilter = this.createColorBlindFilter('protanopia', [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758]
    ]);
    
    // Deuteranopia filter (green-blind)
    const deuteranopiaFilter = this.createColorBlindFilter('deuteranopia', [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7]
    ]);
    
    // Tritanopia filter (blue-blind)
    const tritanopiaFilter = this.createColorBlindFilter('tritanopia', [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525]
    ]);

    svg.appendChild(protanopiaFilter);
    svg.appendChild(deuteranopiaFilter);
    svg.appendChild(tritanopiaFilter);
    
    document.body.appendChild(svg);
  }

  createColorBlindFilter(type, matrix) {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.id = `colorblind-${type}`;
    
    const colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    colorMatrix.setAttribute('type', 'matrix');
    colorMatrix.setAttribute('values', matrix.flat().join(' '));
    
    filter.appendChild(colorMatrix);
    return filter;
  }

  setColorBlindType(type) {
    this.colorBlind.type = type;
    this.applyColorBlindFilter();
  }

  applyColorBlindFilter() {
    const root = document.documentElement;
    
    if (this.colorBlind.type === 'none') {
      root.style.filter = '';
    } else {
      root.style.filter = `url(#colorblind-${this.colorBlind.type})`;
    }

    // Also apply custom color schemes
    this.applyColorBlindColorScheme();
  }

  applyColorBlindColorScheme() {
    const root = document.documentElement;
    
    switch (this.colorBlind.type) {
      case 'protanopia':
      case 'deuteranopia':
        // Use blue/yellow color scheme
        root.style.setProperty('--primary-color', '#0066cc');
        root.style.setProperty('--secondary-color', '#ffcc00');
        root.style.setProperty('--success-color', '#0099ff');
        root.style.setProperty('--warning-color', '#ff9900');
        root.style.setProperty('--error-color', '#ff6600');
        break;
      case 'tritanopia':
        // Use red/green color scheme
        root.style.setProperty('--primary-color', '#cc0000');
        root.style.setProperty('--secondary-color', '#00cc00');
        root.style.setProperty('--success-color', '#009900');
        root.style.setProperty('--warning-color', '#ff6600');
        root.style.setProperty('--error-color', '#cc0000');
        break;
      case 'achromatopsia':
        // Use high contrast grayscale
        root.style.setProperty('--primary-color', '#000000');
        root.style.setProperty('--secondary-color', '#ffffff');
        root.style.setProperty('--success-color', '#666666');
        root.style.setProperty('--warning-color', '#999999');
        root.style.setProperty('--error-color', '#333333');
        break;
    }
  }

  /**
   * Motor Impairment Support
   */
  setupMotorSupport() {
    if (!this.options.enableMotorSupport) return;

    this.setupClickAssistance();
    this.setupDwellClicking();
    this.setupStickyKeys();
  }

  setupClickAssistance() {
    // Enlarge click targets
    const style = document.createElement('style');
    style.textContent = `
      .accessibility-large-targets button,
      .accessibility-large-targets .clickable {
        min-width: 44px;
        min-height: 44px;
        padding: 8px;
      }
    `;
    document.head.appendChild(style);
  }

  setupDwellClicking() {
    let dwellTimer = null;
    let dwellTarget = null;

    document.addEventListener('mouseover', (event) => {
      if (!this.motor.clickAssistance) return;

      const target = event.target.closest('button, [role="button"], .clickable');
      if (!target) return;

      dwellTarget = target;
      target.classList.add('accessibility-dwell-hover');

      dwellTimer = setTimeout(() => {
        if (dwellTarget === target) {
          target.click();
          target.classList.remove('accessibility-dwell-hover');
        }
      }, this.motor.dwellTime);
    });

    document.addEventListener('mouseout', (event) => {
      if (dwellTimer) {
        clearTimeout(dwellTimer);
        dwellTimer = null;
      }
      if (dwellTarget) {
        dwellTarget.classList.remove('accessibility-dwell-hover');
        dwellTarget = null;
      }
    });
  }

  setupStickyKeys() {
    const stickyKeys = new Set();
    
    document.addEventListener('keydown', (event) => {
      if (!this.motor.stickyKeys) return;

      const modifierKeys = ['Control', 'Alt', 'Shift', 'Meta'];
      
      if (modifierKeys.includes(event.key)) {
        if (stickyKeys.has(event.key)) {
          stickyKeys.delete(event.key);
        } else {
          stickyKeys.add(event.key);
        }
        event.preventDefault();
      } else if (stickyKeys.size > 0) {
        // Apply sticky modifiers
        const modifiedEvent = new KeyboardEvent('keydown', {
          key: event.key,
          code: event.code,
          ctrlKey: stickyKeys.has('Control'),
          altKey: stickyKeys.has('Alt'),
          shiftKey: stickyKeys.has('Shift'),
          metaKey: stickyKeys.has('Meta')
        });
        
        // Clear sticky keys after use
        stickyKeys.clear();
        
        // Dispatch the modified event
        event.target.dispatchEvent(modifiedEvent);
        event.preventDefault();
      }
    });
  }

  /**
   * Keyboard Navigation
   */
  setupKeyboardNavigation() {
    if (!this.options.enableKeyboardNavigation) return;

    this.buildFocusOrder();
    this.setupKeyboardShortcuts();
    this.setupFocusIndicators();
  }

  buildFocusOrder() {
    // Build logical focus order for the application
    const focusableElements = document.querySelectorAll(`
      button:not([disabled]),
      [href],
      input:not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      [tabindex]:not([tabindex="-1"]):not([disabled]),
      [role="button"]:not([disabled]),
      [role="link"]:not([disabled])
    `);

    this.keyboard.focusOrder = Array.from(focusableElements);
  }

  setupKeyboardShortcuts() {
    // Game-specific shortcuts
    this.keyboard.shortcuts.set('Space', () => this.handleSpaceKey());
    this.keyboard.shortcuts.set('Enter', () => this.handleEnterKey());
    this.keyboard.shortcuts.set('Escape', () => this.handleEscapeKey());
    this.keyboard.shortcuts.set('ArrowUp', () => this.handleArrowKey('up'));
    this.keyboard.shortcuts.set('ArrowDown', () => this.handleArrowKey('down'));
    this.keyboard.shortcuts.set('ArrowLeft', () => this.handleArrowKey('left'));
    this.keyboard.shortcuts.set('ArrowRight', () => this.handleArrowKey('right'));

    // Application shortcuts
    this.keyboard.shortcuts.set('Alt+1', () => this.focusMainContent());
    this.keyboard.shortcuts.set('Alt+2', () => this.focusNavigation());
    this.keyboard.shortcuts.set('Alt+3', () => this.focusGameArea());

    document.addEventListener('keydown', (event) => {
      const shortcut = this.getShortcutKey(event);
      const handler = this.keyboard.shortcuts.get(shortcut);
      
      if (handler) {
        event.preventDefault();
        handler();
      }
    });
  }

  getShortcutKey(event) {
    const modifiers = [];
    if (event.ctrlKey) modifiers.push('Ctrl');
    if (event.altKey) modifiers.push('Alt');
    if (event.shiftKey) modifiers.push('Shift');
    if (event.metaKey) modifiers.push('Meta');
    
    return [...modifiers, event.key].join('+');
  }

  setupFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      .accessibility-focus-visible {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 1px #ffffff !important;
      }
      
      .accessibility-high-contrast .accessibility-focus-visible {
        outline: 3px solid #ffff00 !important;
        background-color: #000000 !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);

    // Apply focus indicators
    document.addEventListener('focusin', (event) => {
      if (this.cognitive.focusIndicators) {
        event.target.classList.add('accessibility-focus-visible');
      }
    });

    document.addEventListener('focusout', (event) => {
      event.target.classList.remove('accessibility-focus-visible');
    });
  }

  /**
   * Voice Commands
   */
  setupVoiceCommands() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.voice.recognition = new SpeechRecognition();
    
    this.voice.recognition.continuous = true;
    this.voice.recognition.interimResults = false;
    this.voice.recognition.lang = 'en-US';

    // Setup voice commands
    this.voice.commands.set('play card', () => this.handleVoicePlayCard());
    this.voice.commands.set('attack', () => this.handleVoiceAttack());
    this.voice.commands.set('end turn', () => this.handleVoiceEndTurn());
    this.voice.commands.set('help', () => this.handleVoiceHelp());

    this.voice.recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      this.processVoiceCommand(command);
    };

    this.voice.recognition.onerror = (event) => {
      console.warn('Voice recognition error:', event.error);
    };
  }

  processVoiceCommand(command) {
    // Find matching command
    for (const [pattern, handler] of this.voice.commands) {
      if (command.includes(pattern)) {
        handler();
        this.announce(`Executed command: ${pattern}`);
        return;
      }
    }

    this.announce(`Command not recognized: ${command}`);
  }

  startVoiceRecognition() {
    if (this.voice.recognition && !this.voice.listening) {
      this.voice.recognition.start();
      this.voice.listening = true;
      this.announce('Voice recognition started');
    }
  }

  stopVoiceRecognition() {
    if (this.voice.recognition && this.voice.listening) {
      this.voice.recognition.stop();
      this.voice.listening = false;
      this.announce('Voice recognition stopped');
    }
  }

  /**
   * UI Customization
   */
  setFontSize(scale) {
    this.ui.fontSize = scale;
    document.documentElement.style.setProperty('--accessibility-font-scale', scale);
  }

  setContrast(level) {
    this.ui.contrast = level;
    document.documentElement.style.setProperty('--accessibility-contrast', level);
  }

  setSpacing(scale) {
    this.ui.spacing = scale;
    document.documentElement.style.setProperty('--accessibility-spacing-scale', scale);
  }

  setButtonSize(scale) {
    this.ui.buttonSize = scale;
    document.documentElement.style.setProperty('--accessibility-button-scale', scale);
  }

  setAnimationSpeed(speed) {
    this.ui.animationSpeed = speed;
    document.documentElement.style.setProperty('--accessibility-animation-speed', speed);
  }

  enableReducedMotion(enabled) {
    this.cognitive.reducedMotion = enabled;
    document.documentElement.classList.toggle('accessibility-reduced-motion', enabled);
  }

  enableSimplifiedUI(enabled) {
    this.cognitive.simplifiedUI = enabled;
    document.documentElement.classList.toggle('accessibility-simplified-ui', enabled);
  }

  /**
   * Settings Management
   */
  loadUserPreferences() {
    const saved = localStorage.getItem('konivrer_accessibility_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        Object.assign(this.screenReader, settings.screenReader || {});
        Object.assign(this.colorBlind, settings.colorBlind || {});
        Object.assign(this.motor, settings.motor || {});
        Object.assign(this.cognitive, settings.cognitive || {});
        Object.assign(this.keyboard, settings.keyboard || {});
        Object.assign(this.ui, settings.ui || {});
      } catch (error) {
        console.warn('Failed to load accessibility settings:', error);
      }
    }
  }

  saveUserPreferences() {
    const settings = {
      screenReader: this.screenReader,
      colorBlind: this.colorBlind,
      motor: this.motor,
      cognitive: this.cognitive,
      keyboard: this.keyboard,
      ui: this.ui
    };
    
    localStorage.setItem('konivrer_accessibility_settings', JSON.stringify(settings));
  }

  applyAccessibilitySettings() {
    // Apply all current settings
    this.applyColorBlindFilter();
    this.setFontSize(this.ui.fontSize);
    this.setContrast(this.ui.contrast);
    this.setSpacing(this.ui.spacing);
    this.setButtonSize(this.ui.buttonSize);
    this.setAnimationSpeed(this.ui.animationSpeed);
    this.enableReducedMotion(this.cognitive.reducedMotion);
    this.enableSimplifiedUI(this.cognitive.simplifiedUI);

    // Apply motor assistance
    document.documentElement.classList.toggle('accessibility-large-targets', this.motor.clickAssistance);
    
    // Apply cognitive assistance
    document.documentElement.classList.toggle('accessibility-focus-indicators', this.cognitive.focusIndicators);
  }

  /**
   * Public API
   */
  getAccessibilityReport() {
    return {
      screenReaderEnabled: this.screenReader.enabled,
      colorBlindType: this.colorBlind.type,
      motorAssistanceEnabled: this.motor.clickAssistance,
      keyboardNavigationEnabled: this.keyboard.enabled,
      voiceCommandsEnabled: this.voice.enabled,
      reducedMotionEnabled: this.cognitive.reducedMotion,
      settings: {
        fontSize: this.ui.fontSize,
        contrast: this.ui.contrast,
        spacing: this.ui.spacing,
        buttonSize: this.ui.buttonSize
      }
    };
  }

  resetToDefaults() {
    // Reset all settings to defaults
    this.screenReader.verbosity = 'normal';
    this.colorBlind.type = 'none';
    this.motor.clickAssistance = false;
    this.cognitive.reducedMotion = false;
    this.cognitive.simplifiedUI = false;
    this.ui.fontSize = 1.0;
    this.ui.contrast = 1.0;
    this.ui.spacing = 1.0;
    this.ui.buttonSize = 1.0;
    this.ui.animationSpeed = 1.0;

    this.applyAccessibilitySettings();
    this.saveUserPreferences();
  }

  // Event handlers for voice commands
  handleVoicePlayCard() {
    this.dispatchEvent('voiceCommand', { command: 'playCard' });
  }

  handleVoiceAttack() {
    this.dispatchEvent('voiceCommand', { command: 'attack' });
  }

  handleVoiceEndTurn() {
    this.dispatchEvent('voiceCommand', { command: 'endTurn' });
  }

  handleVoiceHelp() {
    this.announce('Available voice commands: play card, attack, end turn, help');
  }

  // Keyboard navigation handlers
  handleSpaceKey() {
    const focused = document.activeElement;
    if (focused && (focused.tagName === 'BUTTON' || focused.getAttribute('role') === 'button')) {
      focused.click();
    }
  }

  handleEnterKey() {
    this.handleSpaceKey();
  }

  handleEscapeKey() {
    // Close modals or cancel actions
    this.dispatchEvent('accessibilityEscape');
  }

  handleArrowKey(direction) {
    this.dispatchEvent('accessibilityArrow', { direction });
  }

  focusMainContent() {
    const main = document.querySelector('main, [role="main"], #main-content');
    if (main) {
      main.focus();
      this.announce('Focused main content');
    }
  }

  focusNavigation() {
    const nav = document.querySelector('nav, [role="navigation"]');
    if (nav) {
      nav.focus();
      this.announce('Focused navigation');
    }
  }

  focusGameArea() {
    const gameArea = document.querySelector('.game-board, #game-area, [role="application"]');
    if (gameArea) {
      gameArea.focus();
      this.announce('Focused game area');
    }
  }

  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(`accessibility:${eventName}`, {
      detail,
      bubbles: true
    });
    document.dispatchEvent(event);
  }
}

export default AccessibilityEngine;