/**
 * KONIVRER Mobile UX Telemetry Service
 * Collects real-user mobile UX metrics for autonomous optimization
 */

export interface MobileUXMetrics {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  viewportWidth: number;
  viewportHeight: number;
  touchTargetInteractions: TouchTargetInteraction[];
  performanceMetrics: PerformanceMetrics;
  accessibilityEvents: AccessibilityEvent[];
  userFlow: UserFlowEvent[];
}

export interface TouchTargetInteraction {
  elementId: string;
  targetSize: { width: number; height: number };
  touchAccuracy: number;
  responseTime: number;
  timestamp: number;
}

export interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  interactionToNextPaint: number;
}

export interface AccessibilityEvent {
  type: 'focus' | 'keyboard-navigation' | 'screen-reader' | 'high-contrast';
  element: string;
  timestamp: number;
}

export interface UserFlowEvent {
  action: string;
  screen: string;
  duration: number;
  successful: boolean;
  timestamp: number;
}

class TelemetryService {
  private metrics: MobileUXMetrics;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = this.checkUserConsent();
    this.metrics = this.initializeMetrics();
    
    if (this.isEnabled) {
      this.setupEventListeners();
      this.setupPerformanceObservers();
    }
  }

  private checkUserConsent(): boolean {
    // Check for user consent (GDPR compliance)
    return localStorage.getItem('telemetry-consent') === 'true';
  }

  private initializeMetrics(): MobileUXMetrics {
    return {
      deviceType: this.detectDeviceType(),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      touchTargetInteractions: [],
      performanceMetrics: {
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
        interactionToNextPaint: 0,
      },
      accessibilityEvents: [],
      userFlow: [],
    };
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width  : any : any = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private setupEventListeners(): void {
    // Touch target interaction tracking
    document.addEventListener('touchstart', this.handleTouchStart.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
    
    // Accessibility event tracking
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Viewport changes
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private setupPerformanceObservers(): void {
    // Core Web Vitals observation
    if ('PerformanceObserver' in window) {
      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fidEntry: any : any : any = entry; // Type assertion for FID entry
          this.metrics.performanceMetrics.firstInputDelay = fidEntry.processingStart - fidEntry.startTime;
        }
      }).observe({ type: 'first-input', buffered: true });

      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries  : any : any = entryList.getEntries();
        const lastEntry  : any : any = entries[entries.length - 1];
        this.metrics.performanceMetrics.largestContentfulPaint = lastEntry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // Cumulative Layout Shift
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            this.metrics.performanceMetrics.cumulativeLayoutShift += (entry as any).value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    }

    // First Contentful Paint from Navigation API
    if ('navigation' in performance) {
      const paint  : any : any = performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint');
      if (paint) {
        this.metrics.performanceMetrics.firstContentfulPaint = paint.startTime;
      }
    }
  }

  private handleTouchStart(event: TouchEvent): void {
    const target  : any : any = event.target as Element;
    if (!target) return;

    const rect  : any : any = target.getBoundingClientRect();
    const interaction: TouchTargetInteraction  : any : any = {
      elementId: target.id || target.className || target.tagName,
      targetSize: { width: rect.width, height: rect.height },
      touchAccuracy: this.calculateTouchAccuracy(event, rect),
      responseTime: 0, // Will be updated on response
      timestamp: Date.now(),
    };

    this.metrics.touchTargetInteractions.push(interaction);

    // Track response time
    const startTime  : any : any = performance.now();
    requestAnimationFrame(() => {
      interaction.responseTime = performance.now() - startTime;
    });
  }

  private calculateTouchAccuracy(event: TouchEvent, rect: DOMRect): number {
    const touch  : any : any = event.touches[0];
    const centerX  : any : any = rect.left + rect.width / 2;
    const centerY  : any : any = rect.top + rect.height / 2;
    const distance  : any : any = Math.sqrt(
      Math.pow(touch.clientX - centerX, 2) + Math.pow(touch.clientY - centerY, 2)
    );
    return Math.max(0, 1 - distance / (Math.max(rect.width, rect.height) / 2));
  }

  private handleClick(event: MouseEvent): void {
    // Track non-touch interactions for desktop/tablet users
    if (this.metrics.deviceType !== 'mobile') {
      const target  : any : any = event.target as Element;
      if (!target) return;

      this.trackUserFlow({
        action: 'click',
        screen: window.location.pathname,
        duration: 0,
        successful: true,
        timestamp: Date.now(),
      });
    }
  }

  private handleFocusIn(event: FocusEvent): void {
    const target  : any : any = event.target as Element;
    this.metrics.accessibilityEvents.push({
      type: 'focus',
      element: target.id || target.className || target.tagName,
      timestamp: Date.now(),
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.metrics.accessibilityEvents.push({
        type: 'keyboard-navigation',
        element: document.activeElement?.tagName || 'unknown',
        timestamp: Date.now(),
      });
    }
  }

  private handleResize(): void {
    this.metrics.viewportWidth = window.innerWidth;
    this.metrics.viewportHeight = window.innerHeight;
    this.metrics.deviceType = this.detectDeviceType();
  }

  public trackUserFlow(event: UserFlowEvent): void {
    if (!this.isEnabled) return;
    this.metrics.userFlow.push(event);
  }

  public trackAccessibilityUsage(type: AccessibilityEvent['type']): void {
    if (!this.isEnabled) return;
    this.metrics.accessibilityEvents.push({
      type,
      element: document.activeElement?.tagName || 'unknown',
      timestamp: Date.now(),
    });
  }

  public async sendMetrics(): Promise<void> {
    if (!this.isEnabled || this.metrics.touchTargetInteractions.length === 0) return;

    try {
      // In a real implementation, this would send to your analytics endpoint
      console.log('Mobile UX Metrics:', this.metrics);
      
      // For now, store in localStorage for debugging
      const existingMetrics  : any : any = JSON.parse(localStorage.getItem('mobile-ux-metrics') || '[]');
      existingMetrics.push({
        timestamp: Date.now(),
        ...this.metrics,
      });
      localStorage.setItem('mobile-ux-metrics', JSON.stringify(existingMetrics.slice(-10))); // Keep last 10 sessions

      // Reset metrics for next collection
      this.metrics.touchTargetInteractions = [];
      this.metrics.accessibilityEvents = [];
      this.metrics.userFlow = [];
    } catch (error) {
      console.error('Failed to send mobile UX metrics:', error);
    }
  }

  public getMetricsSummary(): {
    averageResponseTime: number;
    touchAccuracyScore: number;
    accessibilityUsage: number;
    performanceScore: number;
  } {
    const interactions  : any : any = this.metrics.touchTargetInteractions;
    const avgResponseTime  : any : any = interactions.length > 0 
      ? interactions.reduce((sum, i) => sum + i.responseTime, 0) / interactions.length
      : 0;

    const avgAccuracy  : any : any = interactions.length > 0
      ? interactions.reduce((sum, i) => sum + i.touchAccuracy, 0) / interactions.length
      : 0;

    const accessibilityScore  : any : any = this.metrics.accessibilityEvents.length > 0 ? 1 : 0;

    // Basic performance scoring (simplified)
    const perf  : any : any = this.metrics.performanceMetrics;
    const performanceScore  : any : any = Math.max(0, Math.min(100, 
      100 - (perf.largestContentfulPaint / 25) - (perf.firstInputDelay / 10) - (perf.cumulativeLayoutShift * 1000)
    ));

    return {
      averageResponseTime: avgResponseTime,
      touchAccuracyScore: avgAccuracy,
      accessibilityUsage: accessibilityScore,
      performanceScore,
    };
  }
}

// Singleton instance
export const telemetryService  : any : any = new TelemetryService();

// Auto-send metrics on page unload
window.addEventListener('beforeunload', () => {
  telemetryService.sendMetrics();
});

// Send metrics every 30 seconds for longer sessions
setInterval(() => {
  telemetryService.sendMetrics();
}, 30000);