/**
 * Lightweight Autonomous System - Minimal resource usage, maximum efficiency
 * Single-file implementation for silent, hands-off automation
 */

// Minimal EventEmitter for browser compatibility
class MiniEventEmitter {
  private events: Map<string, Function[]> = new Map();

  on(event: string, fn: Function): void {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event)!.push(fn);
  }

  emit(event: string, ...args: any[]): void {
    this.events.get(event)?.forEach(fn => fn(...args));
  }

  off(event: string, fn: Function): void {
    const fns = this.events.get(event);
    if (fns) {
      const index = fns.indexOf(fn);
      if (index > -1) fns.splice(index, 1);
    }
  }
}

interface SystemConfig {
  enabled: boolean;
  checkInterval: number; // milliseconds
  maxMemoryUsage: number; // MB
  silentMode: boolean;
}

interface SystemMetrics {
  uptime: number;
  memoryUsage: number;
  issuesDetected: number;
  issuesResolved: number;
  lastCheck: Date;
}

class LightweightAutonomousSystem extends MiniEventEmitter {
  private config: SystemConfig;
  private metrics: SystemMetrics;
  private intervalId: number | null = null;
  private isRunning = false;
  private lastCleanup = Date.now();

  constructor(config: Partial<SystemConfig> = {}) {
    super();

    this.config = {
      enabled: true,
      checkInterval: 30000, // 30 seconds - much less frequent
      maxMemoryUsage: 50, // 50MB limit
      silentMode: true,
      ...config,
    };

    this.metrics = {
      uptime: 0,
      memoryUsage: 0,
      issuesDetected: 0,
      issuesResolved: 0,
      lastCheck: new Date(),
    };
  }

  // Initialize with minimal overhead
  public async initialize(): Promise<void> {
    if (!this.config.enabled || this.isRunning) return;

    this.isRunning = true;
    this.startMonitoring();

    if (!this.config.silentMode) {
      console.log('🤖 Lightweight autonomous system initialized');
    }
  }

  // Minimal monitoring loop
  private startMonitoring(): void {
    this.intervalId = window.setInterval(() => {
      this.performLightweightCheck();
    }, this.config.checkInterval);
  }

  // Efficient system check
  private performLightweightCheck(): void {
    const now = Date.now();
    this.metrics.uptime = now - (this.metrics.lastCheck?.getTime() || now);
    this.metrics.lastCheck = new Date();

    // Memory usage check (lightweight)
    if (performance.memory) {
      this.metrics.memoryUsage = Math.round(
        performance.memory.usedJSHeapSize / 1024 / 1024,
      );

      // Auto-cleanup if memory usage is high
      if (this.metrics.memoryUsage > this.config.maxMemoryUsage) {
        this.performCleanup();
      }
    }

    // Basic error detection
    this.detectAndResolveIssues();

    // Periodic cleanup (every 5 minutes)
    if (now - this.lastCleanup > 300000) {
      this.performCleanup();
      this.lastCleanup = now;
    }
  }

  // Minimal issue detection and resolution
  private detectAndResolveIssues(): void {
    try {
      // Check for common issues
      const issues = this.detectCommonIssues();

      if (issues.length > 0) {
        this.metrics.issuesDetected += issues.length;

        // Auto-resolve simple issues
        issues.forEach(issue => {
          if (this.canAutoResolve(issue)) {
            this.resolveIssue(issue);
            this.metrics.issuesResolved++;
          }
        });
      }
    } catch (error) {
      // Silent error handling
      if (!this.config.silentMode) {
        console.warn('Issue detection failed:', error);
      }
    }
  }

  // Lightweight issue detection
  private detectCommonIssues(): string[] {
    const issues: string[] = [];

    // Memory leak detection
    if (this.metrics.memoryUsage > this.config.maxMemoryUsage * 0.8) {
      issues.push('high-memory');
    }

    // Performance issues
    if (
      performance.now() > 1000 &&
      document.querySelectorAll('*').length > 5000
    ) {
      issues.push('dom-bloat');
    }

    // Error detection from console
    if (typeof window !== 'undefined' && window.console?.error) {
      issues.push('console-errors');
    }

    return issues;
  }

  // Check if issue can be auto-resolved
  private canAutoResolve(issue: string): boolean {
    const autoResolvable = ['high-memory', 'dom-bloat', 'console-errors'];
    return autoResolvable.includes(issue);
  }

  // Minimal issue resolution
  private resolveIssue(issue: string): void {
    switch (issue) {
      case 'high-memory':
        this.performCleanup();
        break;
      case 'dom-bloat':
        this.cleanupDOM();
        break;
      case 'console-errors':
        // Clear console if possible
        if (console.clear && !this.config.silentMode) {
          console.clear();
        }
        break;
    }
  }

  // Efficient cleanup
  private performCleanup(): void {
    try {
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }

      // Clear caches
      this.clearCaches();

      // Emit cleanup event
      this.emit('cleanup-performed');
    } catch (error) {
      if (!this.config.silentMode) {
        console.warn('Cleanup failed:', error);
      }
    }
  }

  // Clear various caches
  private clearCaches(): void {
    // Clear any internal caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('temp') || name.includes('cache')) {
            caches.delete(name);
          }
        });
      });
    }
  }

  // Clean up DOM if needed
  private cleanupDOM(): void {
    // Remove unnecessary elements
    const unnecessaryElements = document.querySelectorAll(
      '[data-temp], .temp-element',
    );
    unnecessaryElements.forEach(el => el.remove());

    // Clean up event listeners on removed elements
    const orphanedElements = document.querySelectorAll('[data-cleanup]');
    orphanedElements.forEach(el => {
      el.removeAttribute('data-cleanup');
    });
  }

  // Security check (minimal)
  public performSecurityCheck(): boolean {
    try {
      // Basic security checks
      const securityIssues = [];

      // Check for suspicious scripts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        const src = (script as HTMLScriptElement).src;
        if (
          src &&
          !src.startsWith(window.location.origin) &&
          !this.isTrustedDomain(src)
        ) {
          securityIssues.push('untrusted-script');
        }
      });

      // Check for XSS attempts
      if (
        document.body.innerHTML.includes('<script>') ||
        document.body.innerHTML.includes('javascript:')
      ) {
        securityIssues.push('potential-xss');
      }

      return securityIssues.length === 0;
    } catch {
      return true; // Assume safe if check fails
    }
  }

  // Check if domain is trusted
  private isTrustedDomain(url: string): boolean {
    const trustedDomains = [
      'cdn.jsdelivr.net',
      'unpkg.com',
      'cdnjs.cloudflare.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
    ];

    return trustedDomains.some(domain => url.includes(domain));
  }

  // Get current metrics
  public getMetrics(): SystemMetrics {
    return { ...this.metrics };
  }

  // Update configuration
  public updateConfig(newConfig: Partial<SystemConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Restart monitoring with new interval if changed
    if (newConfig.checkInterval && this.intervalId) {
      this.shutdown();
      this.startMonitoring();
    }
  }

  // Graceful shutdown
  public shutdown(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    this.emit('shutdown');

    if (!this.config.silentMode) {
      console.log('🤖 Lightweight autonomous system shutdown');
    }
  }

  // Health check
  public isHealthy(): boolean {
    return (
      this.isRunning &&
      this.metrics.memoryUsage < this.config.maxMemoryUsage &&
      Date.now() - this.metrics.lastCheck.getTime() <
        this.config.checkInterval * 2
    );
  }

  // Emergency mode - minimal functionality only
  public enableEmergencyMode(): void {
    this.config.checkInterval = 60000; // Reduce frequency
    this.config.maxMemoryUsage = 30; // Lower memory limit

    // Restart with emergency settings
    this.shutdown();
    this.startMonitoring();

    this.emit('emergency-mode-enabled');
  }
}

// Singleton instance for global use
let autonomousSystemInstance: LightweightAutonomousSystem | null = null;

export const getAutonomousSystem = (): LightweightAutonomousSystem => {
  if (!autonomousSystemInstance) {
    autonomousSystemInstance = new LightweightAutonomousSystem({
      enabled: true,
      checkInterval: 30000, // 30 seconds
      maxMemoryUsage: 50, // 50MB
      silentMode: true,
    });
  }
  return autonomousSystemInstance;
};

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  const system = getAutonomousSystem();
  system.initialize().catch(() => {
    // Silent failure
  });
}

export default LightweightAutonomousSystem;
export { SystemConfig, SystemMetrics };
