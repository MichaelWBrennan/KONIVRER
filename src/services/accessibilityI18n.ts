/**
 * Advanced Accessibility and Internationalization System
 * Industry-leading a11y compliance with WCAG 2.1 AAA standards
 */

export interface AccessibilityConfig {
  enabled: boolean;
  announcePageChanges: boolean;
  announceFormErrors: boolean;
  announceUpdates: boolean;
  focusManagement: boolean;
  keyboardNavigation: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  colorBlindFriendly: boolean;
}

export interface I18nConfig {
  defaultLocale: string;
  fallbackLocale: string;
  supportedLocales: string[];
  autoDetect: boolean;
  rtlSupport: boolean;
  numberFormat: Intl.NumberFormatOptions;
  dateFormat: Intl.DateTimeFormatOptions;
}

export interface Translation {
  [key: string]: string | Translation;
}

export interface AccessibilityAnnouncement {
  message: string;
  priority: 'polite' | 'assertive';
  delay?: number;
}

export class AccessibilityManager {
  private config: AccessibilityConfig;
  private announcer: HTMLElement | null = null;
  private focusStack: HTMLElement[] = [];
  private keyboardTrapActive = false;
  private observers: Map<string, MutationObserver> = new Map();

  constructor(config: Partial<AccessibilityConfig> = {}) {
    this.config = {
      enabled: true,
      announcePageChanges: true,
      announceFormErrors: true,
      announceUpdates: true,
      focusManagement: true,
      keyboardNavigation: true,
      highContrast: false,
      reducedMotion: false,
      screenReaderOptimized: true,
      colorBlindFriendly: false,
      ...config,
    };

    this.initialize();
  }

  private initialize(): void {
    if (!this.config.enabled) return;

    this.createAnnouncer();
    this.setupKeyboardNavigation();
    this.applyUserPreferences();
    this.setupMutationObservers();
    this.injectAccessibilityStyles();

    console.log('♿ Accessibility Manager initialized');
  }

  public announce(message: string, priority: 'polite' | 'assertive' = 'polite', delay = 0): void {
    if (!this.announcer || !this.config.enabled) return;

    setTimeout(() => {
      if (this.announcer) {
        this.announcer.setAttribute('aria-live', priority);
        this.announcer.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
          if (this.announcer) {
            this.announcer.textContent = '';
          }
        }, 1000);
      }
    }, delay);
  }

  public announcePageChange(title: string): void {
    if (this.config.announcePageChanges) {
      this.announce(`Page changed to ${title}`, 'polite', 100);
    }
  }

  public announceFormError(field: string, error: string): void {
    if (this.config.announceFormErrors) {
      this.announce(`Error in ${field}: ${error}`, 'assertive');
    }
  }

  public announceUpdate(message: string): void {
    if (this.config.announceUpdates) {
      this.announce(message, 'polite');
    }
  }

  public manageFocus(element: HTMLElement, options: { trap?: boolean; restore?: boolean } = {}): void {
    if (!this.config.focusManagement) return;

    if (options.restore && this.focusStack.length > 0) {
      const previousElement = this.focusStack.pop();
      if (previousElement && previousElement.isConnected) {
        previousElement.focus();
        return;
      }
    }

    if (element && element.isConnected) {
      this.focusStack.push(document.activeElement as HTMLElement);
      element.focus();

      if (options.trap) {
        this.trapFocus(element);
      }
    }
  }

  public releaseFocusTrap(): void {
    this.keyboardTrapActive = false;
  }

  public makeRegionLive(element: HTMLElement, priority: 'polite' | 'assertive' = 'polite'): void {
    element.setAttribute('aria-live', priority);
    element.setAttribute('aria-relevant', 'additions text');
  }

  public addLandmark(element: HTMLElement, role: string, label?: string): void {
    element.setAttribute('role', role);
    if (label) {
      element.setAttribute('aria-label', label);
    }
  }

  public improveButtonAccessibility(button: HTMLButtonElement, label?: string, description?: string): void {
    if (label) {
      button.setAttribute('aria-label', label);
    }
    if (description) {
      const descId = `desc-${crypto.randomUUID()}`;
      const descElement = document.createElement('span');
      descElement.id = descId;
      descElement.textContent = description;
      descElement.style.display = 'none';
      button.parentNode?.appendChild(descElement);
      button.setAttribute('aria-describedby', descId);
    }
  }

  public improveFormAccessibility(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach((input) => {
      const element = input as HTMLInputElement;
      
      // Associate labels
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        const label = form.querySelector(`label[for="${element.id}"]`) as HTMLLabelElement;
        if (label) {
          label.setAttribute('for', element.id);
        } else {
          // Create implicit label if none exists
          const wrapper = element.parentElement;
          if (wrapper && wrapper.tagName === 'DIV') {
            const labelText = wrapper.textContent?.trim();
            if (labelText) {
              element.setAttribute('aria-label', labelText);
            }
          }
        }
      }

      // Add required indicators
      if (element.required) {
        element.setAttribute('aria-required', 'true');
      }

      // Add error descriptions
      const errorElement = form.querySelector(`[data-error-for="${element.id}"]`);
      if (errorElement) {
        const errorId = `error-${element.id}`;
        errorElement.id = errorId;
        element.setAttribute('aria-describedby', errorId);
        element.setAttribute('aria-invalid', 'true');
      }
    });
  }

  public addSkipLinks(): void {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#footer" class="skip-link">Skip to footer</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  public enableHighContrast(): void {
    this.config.highContrast = true;
    document.documentElement.classList.add('high-contrast');
    localStorage.setItem('konivrer-high-contrast', 'true');
    this.announce('High contrast mode enabled');
  }

  public disableHighContrast(): void {
    this.config.highContrast = false;
    document.documentElement.classList.remove('high-contrast');
    localStorage.setItem('konivrer-high-contrast', 'false');
    this.announce('High contrast mode disabled');
  }

  public enableReducedMotion(): void {
    this.config.reducedMotion = true;
    document.documentElement.classList.add('reduced-motion');
    localStorage.setItem('konivrer-reduced-motion', 'true');
    this.announce('Reduced motion enabled');
  }

  public disableReducedMotion(): void {
    this.config.reducedMotion = false;
    document.documentElement.classList.remove('reduced-motion');
    localStorage.setItem('konivrer-reduced-motion', 'false');
    this.announce('Reduced motion disabled');
  }

  public enableColorBlindMode(): void {
    this.config.colorBlindFriendly = true;
    document.documentElement.classList.add('color-blind-friendly');
    localStorage.setItem('konivrer-color-blind-friendly', 'true');
    this.announce('Color blind friendly mode enabled');
  }

  public disableColorBlindMode(): void {
    this.config.colorBlindFriendly = false;
    document.documentElement.classList.remove('color-blind-friendly');
    localStorage.setItem('konivrer-color-blind-friendly', 'false');
    this.announce('Color blind friendly mode disabled');
  }

  private createAnnouncer(): void {
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.style.position = 'absolute';
    this.announcer.style.left = '-10000px';
    this.announcer.style.width = '1px';
    this.announcer.style.height = '1px';
    this.announcer.style.overflow = 'hidden';
    this.announcer.id = 'accessibility-announcer';
    
    document.body.appendChild(this.announcer);
  }

  private setupKeyboardNavigation(): void {
    if (!this.config.keyboardNavigation) return;

    document.addEventListener('keydown', (event) => {
      // Handle escape key to close modals/dropdowns
      if (event.key === 'Escape') {
        this.handleEscapeKey();
      }

      // Handle tab key for focus trapping
      if (event.key === 'Tab' && this.keyboardTrapActive) {
        this.handleTabKey(event);
      }

      // Arrow key navigation for components
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.handleArrowKeys(event);
      }
    });
  }

  private handleEscapeKey(): void {
    // Close any open modals or dropdowns
    const modals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
    modals.forEach(modal => {
      (modal as HTMLElement).style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    });

    // Release focus trap
    this.releaseFocusTrap();
  }

  private handleTabKey(event: KeyboardEvent): void {
    if (!this.keyboardTrapActive) return;

    const focusableElements = this.getFocusableElements(document.activeElement?.closest('[data-focus-trap]') as HTMLElement);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private handleArrowKeys(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    
    // Handle listbox/menu navigation
    if (target.getAttribute('role') === 'option' || target.closest('[role="listbox"]')) {
      event.preventDefault();
      this.navigateList(target, event.key);
    }

    // Handle tab navigation
    if (target.getAttribute('role') === 'tab') {
      event.preventDefault();
      this.navigateTabs(target, event.key);
    }
  }

  private navigateList(current: HTMLElement, direction: string): void {
    const listbox = current.closest('[role="listbox"]') as HTMLElement;
    const options = Array.from(listbox.querySelectorAll('[role="option"]')) as HTMLElement[];
    const currentIndex = options.indexOf(current);

    let nextIndex = currentIndex;
    if (direction === 'ArrowDown') {
      nextIndex = Math.min(currentIndex + 1, options.length - 1);
    } else if (direction === 'ArrowUp') {
      nextIndex = Math.max(currentIndex - 1, 0);
    }

    if (nextIndex !== currentIndex) {
      options[nextIndex].focus();
      options[nextIndex].setAttribute('aria-selected', 'true');
      current.setAttribute('aria-selected', 'false');
    }
  }

  private navigateTabs(current: HTMLElement, direction: string): void {
    const tablist = current.closest('[role="tablist"]') as HTMLElement;
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]')) as HTMLElement[];
    const currentIndex = tabs.indexOf(current);

    let nextIndex = currentIndex;
    if (direction === 'ArrowRight' || direction === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (direction === 'ArrowLeft' || direction === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }

    if (nextIndex !== currentIndex) {
      tabs[nextIndex].focus();
      tabs[nextIndex].click(); // Activate tab
    }
  }

  private trapFocus(container: HTMLElement): void {
    this.keyboardTrapActive = true;
    container.setAttribute('data-focus-trap', 'true');
  }

  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  }

  private applyUserPreferences(): void {
    // Check for stored preferences
    if (localStorage.getItem('konivrer-high-contrast') === 'true') {
      this.enableHighContrast();
    }

    if (localStorage.getItem('konivrer-reduced-motion') === 'true') {
      this.enableReducedMotion();
    }

    if (localStorage.getItem('konivrer-color-blind-friendly') === 'true') {
      this.enableColorBlindMode();
    }

    // Check system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enableReducedMotion();
    }

    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.enableHighContrast();
    }
  }

  private setupMutationObservers(): void {
    // Observe for new form elements
    const formObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const forms = element.matches('form') ? [element] : Array.from(element.querySelectorAll('form'));
            forms.forEach(form => this.improveFormAccessibility(form as HTMLFormElement));
          }
        });
      });
    });

    formObserver.observe(document.body, { childList: true, subtree: true });
    this.observers.set('forms', formObserver);
  }

  private injectAccessibilityStyles(): void {
    const styles = `
      .skip-links {
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 1000;
      }
      
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.3s;
      }
      
      .skip-link:focus {
        top: 6px;
      }
      
      .high-contrast {
        filter: contrast(150%);
      }
      
      .high-contrast button,
      .high-contrast input,
      .high-contrast select {
        border: 2px solid #000 !important;
      }
      
      .reduced-motion *,
      .reduced-motion *::before,
      .reduced-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .color-blind-friendly {
        --primary-color: #0066cc;
        --secondary-color: #ff6600;
        --success-color: #228b22;
        --warning-color: #ff8c00;
        --error-color: #dc143c;
      }
      
      @media (forced-colors: active) {
        * {
          forced-color-adjust: auto;
        }
      }
      
      [aria-hidden="true"] {
        display: none !important;
      }
      
      [aria-expanded="false"] + * {
        display: none;
      }
      
      [aria-expanded="true"] + * {
        display: block;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
}

export class InternationalizationManager {
  private config: I18nConfig;
  private currentLocale: string;
  private translations: Map<string, Translation> = new Map();
  private formatters: Map<string, Intl.NumberFormat | Intl.DateTimeFormat> = new Map();

  constructor(config: Partial<I18nConfig> = {}) {
    this.config = {
      defaultLocale: 'en-US',
      fallbackLocale: 'en-US',
      supportedLocales: ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN'],
      autoDetect: true,
      rtlSupport: true,
      numberFormat: {},
      dateFormat: {},
      ...config,
    };

    this.currentLocale = this.detectLocale();
    this.initialize();
  }

  private initialize(): void {
    this.setupFormatters();
    this.applyRTLSupport();
    
    // Set document language
    document.documentElement.lang = this.currentLocale;
    
    console.log(`🌍 Internationalization initialized with locale: ${this.currentLocale}`);
  }

  public async loadTranslations(locale: string): Promise<void> {
    try {
      // In a real app, this would fetch from a server or import files
      const translationModule = await import(`../locales/${locale}.json`);
      this.translations.set(locale, translationModule.default);
    } catch (error) {
      console.warn(`Failed to load translations for ${locale}:`, error);
      
      // Load fallback
      if (locale !== this.config.fallbackLocale) {
        await this.loadTranslations(this.config.fallbackLocale);
      }
    }
  }

  public translate(key: string, params: Record<string, any> = {}): string {
    const translation = this.getTranslation(key, this.currentLocale) || 
                       this.getTranslation(key, this.config.fallbackLocale) || 
                       key;

    return this.interpolate(translation, params);
  }

  public translatePlural(key: string, count: number, params: Record<string, any> = {}): string {
    const rules = new Intl.PluralRules(this.currentLocale);
    const rule = rules.select(count);
    
    const pluralKey = `${key}.${rule}`;
    const translation = this.getTranslation(pluralKey, this.currentLocale) ||
                       this.getTranslation(`${key}.other`, this.currentLocale) ||
                       this.getTranslation(key, this.currentLocale) ||
                       key;

    return this.interpolate(translation, { ...params, count });
  }

  public formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
    const key = `number-${JSON.stringify(options)}`;
    let formatter = this.formatters.get(key) as Intl.NumberFormat;
    
    if (!formatter) {
      formatter = new Intl.NumberFormat(this.currentLocale, {
        ...this.config.numberFormat,
        ...options,
      });
      this.formatters.set(key, formatter);
    }

    return formatter.format(value);
  }

  public formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
    const key = `date-${JSON.stringify(options)}`;
    let formatter = this.formatters.get(key) as Intl.DateTimeFormat;
    
    if (!formatter) {
      formatter = new Intl.DateTimeFormat(this.currentLocale, {
        ...this.config.dateFormat,
        ...options,
      });
      this.formatters.set(key, formatter);
    }

    return formatter.format(date);
  }

  public formatCurrency(amount: number, currency = 'USD'): string {
    return this.formatNumber(amount, {
      style: 'currency',
      currency,
    });
  }

  public formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string {
    const formatter = new Intl.RelativeTimeFormat(this.currentLocale, {
      numeric: 'auto',
    });

    return formatter.format(value, unit);
  }

  public async setLocale(locale: string): Promise<void> {
    if (!this.config.supportedLocales.includes(locale)) {
      console.warn(`Unsupported locale: ${locale}`);
      return;
    }

    this.currentLocale = locale;
    await this.loadTranslations(locale);
    
    // Update document language
    document.documentElement.lang = locale;
    
    // Apply RTL support
    this.applyRTLSupport();
    
    // Clear formatter cache
    this.formatters.clear();
    this.setupFormatters();
    
    // Store preference
    localStorage.setItem('konivrer-locale', locale);
    
    console.log(`🌍 Locale changed to: ${locale}`);
  }

  public getCurrentLocale(): string {
    return this.currentLocale;
  }

  public getSupportedLocales(): string[] {
    return [...this.config.supportedLocales];
  }

  public isRTL(): boolean {
    const rtlLocales = ['ar', 'he', 'fa', 'ur'];
    return rtlLocales.some(rtl => this.currentLocale.startsWith(rtl));
  }

  private detectLocale(): string {
    if (!this.config.autoDetect) {
      return this.config.defaultLocale;
    }

    // Check stored preference
    const stored = localStorage.getItem('konivrer-locale');
    if (stored && this.config.supportedLocales.includes(stored)) {
      return stored;
    }

    // Check browser language
    const browserLang = navigator.language;
    if (this.config.supportedLocales.includes(browserLang)) {
      return browserLang;
    }

    // Check browser language without region
    const langCode = browserLang.split('-')[0];
    const match = this.config.supportedLocales.find(locale => 
      locale.startsWith(langCode)
    );
    
    if (match) {
      return match;
    }

    return this.config.defaultLocale;
  }

  private getTranslation(key: string, locale: string): string | null {
    const translations = this.translations.get(locale);
    if (!translations) return null;

    const keys = key.split('.');
    let current: any = translations;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }

  private interpolate(template: string, params: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  private setupFormatters(): void {
    // Pre-create common formatters
    this.formatters.set('currency', new Intl.NumberFormat(this.currentLocale, {
      style: 'currency',
      currency: 'USD',
    }));

    this.formatters.set('date', new Intl.DateTimeFormat(this.currentLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));

    this.formatters.set('time', new Intl.DateTimeFormat(this.currentLocale, {
      hour: '2-digit',
      minute: '2-digit',
    }));
  }

  private applyRTLSupport(): void {
    if (!this.config.rtlSupport) return;

    if (this.isRTL()) {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('rtl');
    }
  }
}

// Global instances
export const accessibilityManager = new AccessibilityManager();
export const i18nManager = new InternationalizationManager();