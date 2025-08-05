/**
 * Advanced Analytics and Telemetry System
 * Industry-leading privacy-first analytics with real-time insights
 */

export interface AnalyticsEvent {
  id: string;
  name: string;
  category: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: number;
  userAgent: string;
  viewport: { width: number; height: number };
  page: string;
  referrer: string;
}

export interface UserBehavior {
  clicks: number;
  scrollDepth: number;
  timeOnPage: number;
  interactions: string[];
  errors: string[];
  performance: {
    loadTime: number;
    renderTime: number;
    interactionTime: number;
  };
}

export interface PerformanceMetrics {
  navigationTiming: PerformanceNavigationTiming;
  resourceTiming: PerformanceResourceTiming[];
  vitals: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
  };
  customMetrics: Map<string, number>;
}

export interface AnalyticsConfig {
  enabled: boolean;
  endpoint?: string;
  batchSize: number;
  flushInterval: number;
  trackUserBehavior: boolean;
  trackPerformance: boolean;
  trackErrors: boolean;
  respectDNT: boolean; // Do Not Track
  anonymizeIPs: boolean;
  consentRequired: boolean;
}

export class AdvancedAnalyticsEngine {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private userBehavior: UserBehavior;
  private performanceMetrics: PerformanceMetrics;
  private flushTimer?: number;
  private observers: Map<string, PerformanceObserver> = new Map();
  private isInitialized = false;
  private consentGiven = false;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enabled: true,
      batchSize: 10,
      flushInterval: 5000,
      trackUserBehavior: true,
      trackPerformance: true,
      trackErrors: true,
      respectDNT: true,
      anonymizeIPs: true,
      consentRequired: true,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.userBehavior = this.initializeUserBehavior();
    this.performanceMetrics = this.initializePerformanceMetrics();

    // Check Do Not Track preference
    if (this.config.respectDNT && this.isDNTEnabled()) {
      this.config.enabled = false;
      console.log('📊 Analytics disabled due to Do Not Track preference');
      return;
    }

    this.initialize();
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized || !this.config.enabled) {
      return;
    }

    // Wait for consent if required
    if (this.config.consentRequired) {
      await this.waitForConsent();
    }

    this.setupEventListeners();
    this.setupPerformanceObservers();
    this.startFlushTimer();
    this.isInitialized = true;

    console.log('📊 Advanced Analytics Engine initialized');
    this.track('analytics_initialized', { sessionId: this.sessionId });
  }

  public giveConsent(): void {
    this.consentGiven = true;
    if (!this.isInitialized) {
      this.initialize();
    }
  }

  public revokeConsent(): void {
    this.consentGiven = false;
    this.config.enabled = false;
    this.clearData();
    console.log('📊 Analytics consent revoked - data cleared');
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public track(eventName: string, properties: Record<string, any> = {}): void {
    if (!this.config.enabled || !this.consentGiven) {
      return;
    }

    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      name: eventName,
      category: properties.category || 'general',
      properties: this.sanitizeProperties(properties),
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      userAgent: this.getAnonymizedUserAgent(),
      viewport: this.getViewport(),
      page: this.getCurrentPage(),
      referrer: this.getAnonymizedReferrer(),
    };

    this.eventQueue.push(event);

    // Auto-flush if queue is full
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }

    console.debug('📊 Event tracked:', eventName, properties);
  }

  public trackPageView(page?: string): void {
    this.track('page_view', {
      page: page || this.getCurrentPage(),
      title: document.title,
      category: 'navigation',
    });
  }

  public trackUserAction(action: string, target: string, value?: any): void {
    this.track('user_action', {
      action,
      target,
      value,
      category: 'interaction',
    });

    // Update user behavior
    if (action === 'click') {
      this.userBehavior.clicks++;
    }
    this.userBehavior.interactions.push(action);
  }

  public trackError(error: Error, context?: Record<string, any>): void {
    if (!this.config.trackErrors) {
      return;
    }

    const errorInfo = {
      message: error.message,
      stack: this.sanitizeStack(error.stack),
      name: error.name,
      context: context || {},
      category: 'error',
    };

    this.track('error', errorInfo);
    this.userBehavior.errors.push(error.message);
  }

  public trackPerformanceMetric(name: string, value: number, unit = 'ms'): void {
    if (!this.config.trackPerformance) {
      return;
    }

    this.performanceMetrics.customMetrics.set(name, value);
    
    this.track('performance_metric', {
      metric: name,
      value,
      unit,
      category: 'performance',
    });
  }

  public trackConversion(event: string, value?: number, currency = 'USD'): void {
    this.track('conversion', {
      event,
      value,
      currency,
      category: 'conversion',
    });
  }

  public createFunnel(name: string): AnalyticsFunnel {
    return new AnalyticsFunnel(name, this);
  }

  public async flush(): Promise<void> {
    if (this.eventQueue.length === 0 || !this.config.enabled) {
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      if (this.config.endpoint) {
        await this.sendToEndpoint(events);
      } else {
        // Fallback to localStorage for offline analysis
        this.saveToLocalStorage(events);
      }

      console.debug(`📊 Flushed ${events.length} analytics events`);
    } catch (error) {
      console.error('❌ Failed to flush analytics events:', error);
      // Re-queue events for retry
      this.eventQueue.unshift(...events);
    }
  }

  public getMetrics(): {
    userBehavior: UserBehavior;
    performance: PerformanceMetrics;
    session: { id: string; duration: number };
  } {
    return {
      userBehavior: { ...this.userBehavior },
      performance: { ...this.performanceMetrics },
      session: {
        id: this.sessionId,
        duration: Date.now() - parseInt(this.sessionId.split('-')[1]),
      },
    };
  }

  public exportData(): string {
    const data = {
      events: this.getStoredEvents(),
      metrics: this.getMetrics(),
      config: this.config,
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  public clearData(): void {
    this.eventQueue = [];
    localStorage.removeItem('konivrer_analytics_events');
    localStorage.removeItem('konivrer_analytics_user_behavior');
    console.log('📊 Analytics data cleared');
  }

  private setupEventListeners(): void {
    // Track page navigation
    window.addEventListener('popstate', () => {
      this.trackPageView();
    });

    // Track clicks
    if (this.config.trackUserBehavior) {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        this.trackUserAction('click', this.getElementSelector(target));
      });

      // Track scroll depth
      let maxScrollDepth = 0;
      window.addEventListener('scroll', () => {
        const scrollDepth = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
          this.userBehavior.scrollDepth = maxScrollDepth;
        }
      });

      // Track time on page
      const startTime = Date.now();
      window.addEventListener('beforeunload', () => {
        this.userBehavior.timeOnPage = Date.now() - startTime;
        this.track('session_end', {
          duration: this.userBehavior.timeOnPage,
          behavior: this.userBehavior,
          category: 'session',
        });
      });
    }

    // Track errors
    if (this.config.trackErrors) {
      window.addEventListener('error', (event) => {
        this.trackError(event.error || new Error(event.message), {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.trackError(new Error(event.reason), {
          type: 'unhandled_promise_rejection',
        });
      });
    }
  }

  private setupPerformanceObservers(): void {
    if (!this.config.trackPerformance || !window.PerformanceObserver) {
      return;
    }

    // Observe navigation timing
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          this.performanceMetrics.navigationTiming = entry as PerformanceNavigationTiming;
          this.trackWebVitals();
        }
      }
    });
    navObserver.observe({ entryTypes: ['navigation'] });
    this.observers.set('navigation', navObserver);

    // Observe resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      this.performanceMetrics.resourceTiming.push(...entries);
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.set('resource', resourceObserver);

    // Observe Core Web Vitals
    this.observeWebVitals();
  }

  private observeWebVitals(): void {
    // FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.performanceMetrics.vitals.fcp = entry.startTime;
          this.trackPerformanceMetric('FCP', entry.startTime);
        }
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    this.observers.set('fcp', fcpObserver);

    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.performanceMetrics.vitals.lcp = lastEntry.startTime;
      this.trackPerformanceMetric('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('lcp', lcpObserver);

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime;
        this.performanceMetrics.vitals.fid = fid;
        this.trackPerformanceMetric('FID', fid);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.set('fid', fidObserver);

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.performanceMetrics.vitals.cls = clsValue;
      this.trackPerformanceMetric('CLS', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('cls', clsObserver);
  }

  private trackWebVitals(): void {
    const nav = this.performanceMetrics.navigationTiming;
    if (!nav) return;

    this.performanceMetrics.vitals.ttfb = nav.responseStart - nav.requestStart;
    this.trackPerformanceMetric('TTFB', this.performanceMetrics.vitals.ttfb);
  }

  private async sendToEndpoint(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.endpoint) return;

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events,
        sessionId: this.sessionId,
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Analytics endpoint error: ${response.statusText}`);
    }
  }

  private saveToLocalStorage(events: AnalyticsEvent[]): void {
    try {
      const existing = this.getStoredEvents();
      const combined = [...existing, ...events];
      
      // Keep only last 1000 events to prevent storage bloat
      const limited = combined.slice(-1000);
      
      localStorage.setItem('konivrer_analytics_events', JSON.stringify(limited));
    } catch (error) {
      console.warn('Failed to save analytics to localStorage:', error);
    }
  }

  private getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('konivrer_analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${crypto.randomUUID()}`;
  }

  private initializeUserBehavior(): UserBehavior {
    return {
      clicks: 0,
      scrollDepth: 0,
      timeOnPage: 0,
      interactions: [],
      errors: [],
      performance: {
        loadTime: 0,
        renderTime: 0,
        interactionTime: 0,
      },
    };
  }

  private initializePerformanceMetrics(): PerformanceMetrics {
    return {
      navigationTiming: {} as PerformanceNavigationTiming,
      resourceTiming: [],
      vitals: {
        fcp: 0,
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0,
      },
      customMetrics: new Map(),
    };
  }

  private isDNTEnabled(): boolean {
    return navigator.doNotTrack === '1' || (window as any).doNotTrack === '1';
  }

  private async waitForConsent(): Promise<void> {
    return new Promise((resolve) => {
      if (this.consentGiven) {
        resolve();
        return;
      }

      const checkConsent = () => {
        if (this.consentGiven) {
          resolve();
        } else {
          setTimeout(checkConsent, 100);
        }
      };

      checkConsent();
    });
  }

  private sanitizeProperties(properties: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(properties)) {
      // Remove potentially sensitive data
      if (this.isSensitiveKey(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'email', 'phone'];
    return sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive));
  }

  private sanitizeString(str: string): string {
    // Remove email patterns
    return str.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  }

  private sanitizeStack(stack?: string): string {
    if (!stack) return '';
    
    // Remove file paths that might contain sensitive info
    return stack.replace(/\/[^\s]+/g, '[PATH]');
  }

  private getAnonymizedUserAgent(): string {
    const ua = navigator.userAgent;
    // Keep browser/version but remove detailed system info
    const match = ua.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/);
    return match ? match[0] : 'Unknown';
  }

  private getViewport(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  private getCurrentPage(): string {
    return window.location.pathname;
  }

  private getAnonymizedReferrer(): string {
    const referrer = document.referrer;
    if (!referrer) return '';
    
    try {
      const url = new URL(referrer);
      return url.hostname; // Only keep domain
    } catch {
      return '';
    }
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }
}

export class AnalyticsFunnel {
  private steps: string[] = [];
  private currentStep = 0;

  constructor(
    private name: string,
    private analytics: AdvancedAnalyticsEngine
  ) {}

  public addStep(stepName: string): void {
    this.steps.push(stepName);
  }

  public nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.analytics.track('funnel_step', {
        funnel: this.name,
        step: this.steps[this.currentStep],
        stepIndex: this.currentStep,
        category: 'funnel',
      });
    }
  }

  public complete(): void {
    this.analytics.track('funnel_complete', {
      funnel: this.name,
      totalSteps: this.steps.length,
      category: 'funnel',
    });
  }

  public abandon(): void {
    this.analytics.track('funnel_abandon', {
      funnel: this.name,
      lastStep: this.steps[this.currentStep],
      stepsCompleted: this.currentStep + 1,
      totalSteps: this.steps.length,
      category: 'funnel',
    });
  }
}

// Global instance
export const analytics = new AdvancedAnalyticsEngine();