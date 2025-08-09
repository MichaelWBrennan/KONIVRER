/**
 * KONIVRER A/B Testing Service for Mobile UX Optimization
 * Enables data-driven optimization of mobile user experience
 */

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABVariant[];
  trafficAllocation: number; // Percentage of users to include
  targeting: ABTargeting;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
  metrics: ABMetric[];
}

export interface ABVariant {
  id: string;
  name: string;
  weight: number; // Percentage of test traffic
  changes: UIChange[];
}

export interface UIChange {
  type: 'css' | 'component' | 'layout' | 'copy';
  selector?: string;
  component?: string;
  property: string;
  value: any;
}

export interface ABTargeting {
  deviceType?: ('mobile' | 'tablet' | 'desktop')[];
  viewportRange?: { min: number; max: number };
  userAgent?: string[];
  location?: string[];
  newUsers?: boolean;
}

export interface ABMetric {
  name: string;
  type: 'conversion' | 'engagement' | 'performance';
  selector?: string;
  event?: string;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  metrics: { [metricName: string]: number };
  timestamp: Date;
}

class ABTestingService {
  private activeTests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, { testId: string; variantId: string }> = new Map();
  private results: ABTestResult[] = [];
  private userId: string;

  constructor() {
    this.userId = this.getUserId();
    this.loadActiveTests();
    this.setupEventListeners();
  }

  private getUserId(): string {
    let userId = localStorage.getItem('konivrer-user-id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('konivrer-user-id', userId);
    }
    return userId;
  }

  private loadActiveTests(): void {
    // In production, this would load from your backend
    // For demo purposes, we'll define some mobile-focused tests
    this.initializeMobileTests();
  }

  private initializeMobileTests(): void {
    // Test 1: Touch target size optimization
    const touchTargetTest: ABTest = {
      id: 'touch-targets-v1',
      name: 'Touch Target Size Optimization',
      description: 'Test different touch target sizes for better mobile usability',
      variants: [
        {
          id: 'control',
          name: 'Control (44px)',
          weight: 50,
          changes: [
            { type: 'css', selector: '.btn-touch', property: 'minHeight', value: '44px' }
          ]
        },
        {
          id: 'larger-targets',
          name: 'Larger Targets (48px)',
          weight: 50,
          changes: [
            { type: 'css', selector: '.btn-touch', property: 'minHeight', value: '48px' },
            { type: 'css', selector: '.btn-touch', property: 'padding', value: '12px 16px' }
          ]
        }
      ],
      trafficAllocation: 50,
      targeting: { deviceType: ['mobile'] },
      status: 'running',
      startDate: new Date(),
      metrics: [
        { name: 'touch_accuracy', type: 'engagement', event: 'touchstart' },
        { name: 'interaction_success', type: 'conversion', event: 'click' }
      ]
    };

    // Test 2: Navigation layout optimization  
    const navigationTest: ABTest = {
      id: 'nav-layout-v1',
      name: 'Mobile Navigation Layout',
      description: 'Test bottom vs side navigation for mobile users',
      variants: [
        {
          id: 'bottom-nav',
          name: 'Bottom Navigation (Control)',
          weight: 60,
          changes: [
            { type: 'css', selector: '.bubble-menu', property: 'bottom', value: '0' },
            { type: 'css', selector: '.bubble-menu', property: 'flexDirection', value: 'row' }
          ]
        },
        {
          id: 'side-nav',
          name: 'Side Navigation',
          weight: 40,
          changes: [
            { type: 'css', selector: '.bubble-menu', property: 'right', value: '0' },
            { type: 'css', selector: '.bubble-menu', property: 'flexDirection', value: 'column' },
            { type: 'css', selector: '.bubble-menu', property: 'top', value: '50%' },
            { type: 'css', selector: '.bubble-menu', property: 'transform', value: 'translateY(-50%)' }
          ]
        }
      ],
      trafficAllocation: 30,
      targeting: { 
        deviceType: ['mobile'],
        viewportRange: { min: 320, max: 767 }
      },
      status: 'running',
      startDate: new Date(),
      metrics: [
        { name: 'navigation_usage', type: 'engagement', selector: '.bubble-menu button' },
        { name: 'task_completion', type: 'conversion', event: 'page_navigation' }
      ]
    };

    // Test 3: Typography scaling
    const typographyTest: ABTest = {
      id: 'typography-v1',
      name: 'Mobile Typography Scaling',
      description: 'Test different font sizes for mobile readability',
      variants: [
        {
          id: 'standard',
          name: 'Standard (16px base)',
          weight: 50,
          changes: [
            { type: 'css', selector: 'body', property: 'fontSize', value: '16px' }
          ]
        },
        {
          id: 'larger',
          name: 'Larger (18px base)',
          weight: 50,
          changes: [
            { type: 'css', selector: 'body', property: 'fontSize', value: '18px' },
            { type: 'css', selector: 'h1', property: 'fontSize', value: '2.5rem' },
            { type: 'css', selector: 'h2', property: 'fontSize', value: '2rem' }
          ]
        }
      ],
      trafficAllocation: 25,
      targeting: { deviceType: ['mobile'] },
      status: 'running',
      startDate: new Date(),
      metrics: [
        { name: 'reading_time', type: 'engagement', event: 'scroll' },
        { name: 'bounce_rate', type: 'engagement', event: 'page_exit' }
      ]
    };

    this.activeTests.set(touchTargetTest.id, touchTargetTest);
    this.activeTests.set(navigationTest.id, navigationTest);
    this.activeTests.set(typographyTest.id, typographyTest);
  }

  private setupEventListeners(): void {
    // Track conversion events
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('touchstart', this.handleTouch.bind(this));
    
    // Track engagement events
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('beforeunload', this.handlePageExit.bind(this));
  }

  public async assignUserToTests(): Promise<void> {
    for (const test of this.activeTests.values()) {
      if (this.shouldIncludeUser(test)) {
        const variant = this.selectVariant(test);
        this.userAssignments.set(test.id, { testId: test.id, variantId: variant.id });
        await this.applyVariant(test, variant);
      }
    }
  }

  private shouldIncludeUser(test: ABTest): boolean {
    // Check if user is already assigned to this test
    if (this.userAssignments.has(test.id)) return true;

    // Check traffic allocation
    if (Math.random() * 100 > test.trafficAllocation) return false;

    // Check targeting criteria
    const targeting = test.targeting;
    
    // Device type targeting
    if (targeting.deviceType) {
      const deviceType = this.detectDeviceType();
      if (!targeting.deviceType.includes(deviceType)) return false;
    }

    // Viewport targeting
    if (targeting.viewportRange) {
      const width = window.innerWidth;
      if (width < targeting.viewportRange.min || width > targeting.viewportRange.max) {
        return false;
      }
    }

    // User agent targeting
    if (targeting.userAgent) {
      const userAgent = navigator.userAgent.toLowerCase();
      if (!targeting.userAgent.some(ua => userAgent.includes(ua.toLowerCase()))) {
        return false;
      }
    }

    // New user targeting
    if (targeting.newUsers !== undefined) {
      const isNewUser = !localStorage.getItem('konivrer-returning-user');
      if (targeting.newUsers !== isNewUser) return false;
    }

    return true;
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private selectVariant(test: ABTest): ABVariant {
    const rand = Math.random() * 100;
    let cumWeight = 0;
    
    for (const variant of test.variants) {
      cumWeight += variant.weight;
      if (rand <= cumWeight) return variant;
    }
    
    return test.variants[0]; // Fallback to first variant
  }

  private async applyVariant(test: ABTest, variant: ABVariant): Promise<void> {
    for (const change of variant.changes) {
      await this.applyUIChange(change);
    }

    // Track assignment
    console.log(`A/B Test: User assigned to ${test.name} - ${variant.name}`);
  }

  private async applyUIChange(change: UIChange): Promise<void> {
    switch (change.type) {
      case 'css':
        if (change.selector) {
          const elements = document.querySelectorAll(change.selector);
          elements.forEach(el => {
            (el as HTMLElement).style.setProperty(
              this.camelToKebab(change.property), 
              change.value
            );
          });
        }
        break;
      
      case 'component':
        // Would integrate with React/Vue component system
        console.log(`Component change: ${change.component} - ${change.property}: ${change.value}`);
        break;
        
      case 'layout':
        // Layout-specific changes
        if (change.selector) {
          const elements = document.querySelectorAll(change.selector);
          elements.forEach(el => {
            el.setAttribute(`data-layout-${change.property}`, change.value);
          });
        }
        break;
        
      case 'copy':
        // Text content changes
        if (change.selector) {
          const elements = document.querySelectorAll(change.selector);
          elements.forEach(el => {
            el.textContent = change.value;
          });
        }
        break;
    }
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private handleClick(event: MouseEvent): void {
    this.trackMetric('interaction_success', event.target as Element);
    this.trackMetric('navigation_usage', event.target as Element);
  }

  private handleTouch(event: TouchEvent): void {
    const target = event.target as Element;
    const rect = target.getBoundingClientRect();
    const touch = event.touches[0];
    
    // Calculate touch accuracy
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt(
      Math.pow(touch.clientX - centerX, 2) + Math.pow(touch.clientY - centerY, 2)
    );
    const accuracy = Math.max(0, 1 - distance / (Math.max(rect.width, rect.height) / 2));
    
    this.trackMetric('touch_accuracy', target, accuracy);
  }

  private handleScroll(): void {
    this.trackMetric('reading_time', document.body, 1);
  }

  private handlePageExit(): void {
    this.trackMetric('bounce_rate', document.body, 1);
    this.sendResults();
  }

  private trackMetric(metricName: string, _element: Element, value: number = 1): void {
    for (const assignment of this.userAssignments.values()) {
      const test = this.activeTests.get(assignment.testId);
      if (test && test.metrics.some(m => m.name === metricName)) {
        const result: ABTestResult = {
          testId: assignment.testId,
          variantId: assignment.variantId,
          userId: this.userId,
          metrics: { [metricName]: value },
          timestamp: new Date()
        };
        
        this.results.push(result);
      }
    }
  }

  public async sendResults(): Promise<void> {
    if (this.results.length === 0) return;

    try {
      // In production, send to your analytics backend
      console.log('A/B Test Results:', this.results);
      
      // Store locally for debugging
      const existingResults = JSON.parse(localStorage.getItem('ab-test-results') || '[]');
      existingResults.push(...this.results);
      localStorage.setItem('ab-test-results', JSON.stringify(existingResults.slice(-100)));
      
      // Clear sent results
      this.results = [];
    } catch (error) {
      console.error('Failed to send A/B test results:', error);
    }
  }

  public getActiveTests(): ABTest[] {
    return Array.from(this.activeTests.values()).filter(test => test.status === 'running');
  }

  public getUserAssignments(): { testId: string; variantId: string }[] {
    return Array.from(this.userAssignments.values());
  }

  public getTestResults(testId: string): ABTestResult[] {
    return this.results.filter(result => result.testId === testId);
  }
}

// Singleton instance
export const abTestingService = new ABTestingService();

// Initialize A/B tests when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    abTestingService.assignUserToTests();
  });
} else {
  abTestingService.assignUserToTests();
}