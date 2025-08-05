/**
 * Advanced Monitoring and Observability System
 * Industry-leading application monitoring with distributed tracing
 */

export interface LogLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
  TRACE: 4;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: keyof LogLevel;
  message: string;
  metadata?: Record<string, any>;
  traceId?: string;
  spanId?: string;
  userId?: string;
  sessionId?: string;
  component?: string;
  stack?: string;
}

export interface MetricEntry {
  name: string;
  value: number;
  type: 'counter' | 'gauge' | 'histogram' | 'timer';
  tags: Record<string, string>;
  timestamp: number;
  unit?: string;
}

export interface TraceSpan {
  id: string;
  traceId: string;
  parentId?: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, any>;
  logs: Array<{ timestamp: number; message: string; level: string }>;
  status: 'ok' | 'error' | 'timeout';
  error?: Error;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  duration: number;
  message?: string;
  metadata?: Record<string, any>;
}

export interface MonitoringConfig {
  enabled: boolean;
  logLevel: keyof LogLevel;
  batchSize: number;
  flushInterval: number;
  enableTracing: boolean;
  enableMetrics: boolean;
  enableHealthChecks: boolean;
  endpoint?: string;
  retentionDays: number;
  samplingRate: number;
}

export class AdvancedMonitoringSystem {
  private config: MonitoringConfig;
  private logs: LogEntry[] = [];
  private metrics: MetricEntry[] = [];
  private traces: Map<string, TraceSpan[]> = new Map();
  private healthChecks: Map<string, HealthCheck> = new Map();
  private activeSpans: Map<string, TraceSpan> = new Map();
  private flushTimer?: number;
  private readonly LOG_LEVELS: LogLevel = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3, TRACE: 4 };

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = {
      enabled: true,
      logLevel: 'INFO',
      batchSize: 50,
      flushInterval: 10000,
      enableTracing: true,
      enableMetrics: true,
      enableHealthChecks: true,
      retentionDays: 7,
      samplingRate: 1.0,
      ...config,
    };

    this.initialize();
  }

  private initialize(): void {
    if (!this.config.enabled) return;

    this.setupGlobalErrorHandlers();
    this.setupPerformanceObserver();
    this.startFlushTimer();
    this.startHealthChecks();

    console.log('📊 Advanced Monitoring System initialized');
    this.info('monitoring_system_initialized', { config: this.config });
  }

  // Logging Methods
  public error(message: string, metadata?: Record<string, any>, error?: Error): void {
    this.log('ERROR', message, metadata, error);
  }

  public warn(message: string, metadata?: Record<string, any>): void {
    this.log('WARN', message, metadata);
  }

  public info(message: string, metadata?: Record<string, any>): void {
    this.log('INFO', message, metadata);
  }

  public debug(message: string, metadata?: Record<string, any>): void {
    this.log('DEBUG', message, metadata);
  }

  public trace(message: string, metadata?: Record<string, any>): void {
    this.log('TRACE', message, metadata);
  }

  // Metrics Methods
  public incrementCounter(name: string, value = 1, tags: Record<string, string> = {}): void {
    if (!this.config.enableMetrics) return;

    this.recordMetric({
      name,
      value,
      type: 'counter',
      tags,
      timestamp: Date.now(),
    });
  }

  public setGauge(name: string, value: number, tags: Record<string, string> = {}): void {
    if (!this.config.enableMetrics) return;

    this.recordMetric({
      name,
      value,
      type: 'gauge',
      tags,
      timestamp: Date.now(),
    });
  }

  public recordHistogram(name: string, value: number, tags: Record<string, string> = {}): void {
    if (!this.config.enableMetrics) return;

    this.recordMetric({
      name,
      value,
      type: 'histogram',
      tags,
      timestamp: Date.now(),
    });
  }

  public startTimer(name: string, tags: Record<string, string> = {}): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name,
        value: duration,
        type: 'timer',
        tags,
        timestamp: Date.now(),
        unit: 'ms',
      });
    };
  }

  // Tracing Methods
  public startSpan(operation: string, tags: Record<string, any> = {}): string {
    if (!this.config.enableTracing || Math.random() > this.config.samplingRate) {
      return '';
    }

    const span: TraceSpan = {
      id: crypto.randomUUID(),
      traceId: this.getCurrentTraceId() || crypto.randomUUID(),
      operation,
      startTime: performance.now(),
      tags: { ...tags },
      logs: [],
      status: 'ok',
    };

    this.activeSpans.set(span.id, span);
    this.debug('span_started', { spanId: span.id, operation });

    return span.id;
  }

  public finishSpan(spanId: string, tags: Record<string, any> = {}): void {
    const span = this.activeSpans.get(spanId);
    if (!span) return;

    span.endTime = performance.now();
    span.duration = span.endTime - span.startTime;
    span.tags = { ...span.tags, ...tags };

    // Add to trace
    if (!this.traces.has(span.traceId)) {
      this.traces.set(span.traceId, []);
    }
    this.traces.get(span.traceId)!.push(span);

    this.activeSpans.delete(spanId);
    this.debug('span_finished', { 
      spanId: span.id, 
      operation: span.operation, 
      duration: span.duration 
    });
  }

  public addSpanLog(spanId: string, message: string, level = 'INFO'): void {
    const span = this.activeSpans.get(spanId);
    if (!span) return;

    span.logs.push({
      timestamp: performance.now(),
      message,
      level,
    });
  }

  public setSpanError(spanId: string, error: Error): void {
    const span = this.activeSpans.get(spanId);
    if (!span) return;

    span.status = 'error';
    span.error = error;
    span.tags.error = true;
    span.tags.errorMessage = error.message;

    this.addSpanLog(spanId, `Error: ${error.message}`, 'ERROR');
  }

  public withSpan<T>(operation: string, fn: (spanId: string) => T, tags: Record<string, any> = {}): T {
    const spanId = this.startSpan(operation, tags);
    
    try {
      const result = fn(spanId);
      
      if (result instanceof Promise) {
        return result
          .then(res => {
            this.finishSpan(spanId, { success: true });
            return res;
          })
          .catch(err => {
            this.setSpanError(spanId, err);
            this.finishSpan(spanId, { success: false });
            throw err;
          }) as T;
      } else {
        this.finishSpan(spanId, { success: true });
        return result;
      }
    } catch (error) {
      this.setSpanError(spanId, error as Error);
      this.finishSpan(spanId, { success: false });
      throw error;
    }
  }

  // Health Check Methods
  public registerHealthCheck(name: string, checkFn: () => Promise<boolean>, interval = 30000): void {
    if (!this.config.enableHealthChecks) return;

    const check = async () => {
      const startTime = performance.now();
      
      try {
        const isHealthy = await checkFn();
        const duration = performance.now() - startTime;
        
        this.healthChecks.set(name, {
          name,
          status: isHealthy ? 'healthy' : 'unhealthy',
          lastCheck: Date.now(),
          duration,
          message: isHealthy ? 'OK' : 'Check failed',
        });

        this.setGauge(`health_check.${name}`, isHealthy ? 1 : 0, { check: name });
      } catch (error) {
        const duration = performance.now() - startTime;
        
        this.healthChecks.set(name, {
          name,
          status: 'unhealthy',
          lastCheck: Date.now(),
          duration,
          message: error instanceof Error ? error.message : 'Unknown error',
          metadata: { error: error instanceof Error ? error.stack : String(error) },
        });

        this.setGauge(`health_check.${name}`, 0, { check: name });
        this.error('health_check_failed', { check: name }, error as Error);
      }
    };

    // Run initial check
    check();

    // Schedule periodic checks
    setInterval(check, interval);
    
    this.info('health_check_registered', { name, interval });
  }

  public getHealthStatus(): Record<string, HealthCheck> {
    const status: Record<string, HealthCheck> = {};
    
    for (const [name, check] of this.healthChecks) {
      status[name] = { ...check };
    }

    return status;
  }

  public isHealthy(): boolean {
    for (const check of this.healthChecks.values()) {
      if (check.status === 'unhealthy') {
        return false;
      }
    }
    return true;
  }

  // Query and Export Methods
  public queryLogs(filters: {
    level?: keyof LogLevel;
    component?: string;
    timeRange?: { start: number; end: number };
    userId?: string;
    limit?: number;
  } = {}): LogEntry[] {
    let filtered = [...this.logs];

    if (filters.level) {
      const minLevel = this.LOG_LEVELS[filters.level];
      filtered = filtered.filter(log => this.LOG_LEVELS[log.level] <= minLevel);
    }

    if (filters.component) {
      filtered = filtered.filter(log => log.component === filters.component);
    }

    if (filters.timeRange) {
      filtered = filtered.filter(log => 
        log.timestamp >= filters.timeRange!.start && 
        log.timestamp <= filters.timeRange!.end
      );
    }

    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }

    if (filters.limit) {
      filtered = filtered.slice(-filters.limit);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  public queryMetrics(filters: {
    name?: string;
    type?: MetricEntry['type'];
    timeRange?: { start: number; end: number };
    tags?: Record<string, string>;
  } = {}): MetricEntry[] {
    let filtered = [...this.metrics];

    if (filters.name) {
      filtered = filtered.filter(metric => metric.name.includes(filters.name!));
    }

    if (filters.type) {
      filtered = filtered.filter(metric => metric.type === filters.type);
    }

    if (filters.timeRange) {
      filtered = filtered.filter(metric => 
        metric.timestamp >= filters.timeRange!.start && 
        metric.timestamp <= filters.timeRange!.end
      );
    }

    if (filters.tags) {
      filtered = filtered.filter(metric => {
        return Object.entries(filters.tags!).every(([key, value]) => 
          metric.tags[key] === value
        );
      });
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  public getTrace(traceId: string): TraceSpan[] {
    return this.traces.get(traceId) || [];
  }

  public exportData(): string {
    const data = {
      logs: this.logs,
      metrics: this.metrics,
      traces: Object.fromEntries(this.traces),
      healthChecks: Object.fromEntries(this.healthChecks),
      config: this.config,
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  public clearData(): void {
    this.logs = [];
    this.metrics = [];
    this.traces.clear();
    this.info('monitoring_data_cleared');
  }

  // Alerting Methods
  public createAlert(name: string, condition: () => boolean, action: () => void, interval = 60000): void {
    const checkAlert = () => {
      if (condition()) {
        this.warn('alert_triggered', { alert: name });
        action();
      }
    };

    setInterval(checkAlert, interval);
    this.info('alert_created', { name, interval });
  }

  // Private Methods
  private log(level: keyof LogLevel, message: string, metadata?: Record<string, any>, error?: Error): void {
    if (this.LOG_LEVELS[level] > this.LOG_LEVELS[this.config.logLevel]) {
      return;
    }

    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      level,
      message,
      metadata,
      traceId: this.getCurrentTraceId(),
      spanId: this.getCurrentSpanId(),
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      component: metadata?.component,
      stack: error?.stack,
    };

    this.logs.push(entry);

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console[level.toLowerCase() as keyof Console](message, metadata);
    }

    // Auto-flush on errors
    if (level === 'ERROR') {
      this.flush();
    }
  }

  private recordMetric(metric: MetricEntry): void {
    this.metrics.push(metric);
  }

  private setupGlobalErrorHandlers(): void {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.error('uncaught_error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        component: 'global',
      }, event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('unhandled_promise_rejection', {
        reason: event.reason,
        component: 'global',
      }, new Error(event.reason));
    });
  }

  private setupPerformanceObserver(): void {
    if (!window.PerformanceObserver || !this.config.enableMetrics) return;

    // Monitor navigation timing
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;
          
          this.recordHistogram('page.load_time', nav.loadEventEnd - nav.navigationStart);
          this.recordHistogram('page.dom_content_loaded', nav.domContentLoadedEventEnd - nav.navigationStart);
          this.recordHistogram('page.first_byte', nav.responseStart - nav.requestStart);
        }
      }
    });
    navObserver.observe({ entryTypes: ['navigation'] });

    // Monitor resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        this.recordHistogram('resource.load_time', resource.responseEnd - resource.startTime, {
          type: this.getResourceType(resource.name),
        });
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
  }

  private getResourceType(url: string): string {
    if (url.match(/\.(js|mjs)$/)) return 'script';
    if (url.match(/\.(css)$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    return 'other';
  }

  private startFlushTimer(): void {
    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private async flush(): Promise<void> {
    if (this.logs.length === 0 && this.metrics.length === 0) return;

    const data = {
      logs: this.logs.splice(0, this.config.batchSize),
      metrics: this.metrics.splice(0, this.config.batchSize),
      timestamp: Date.now(),
    };

    try {
      if (this.config.endpoint) {
        await this.sendToEndpoint(data);
      } else {
        this.saveToLocalStorage(data);
      }
    } catch (error) {
      console.error('Failed to flush monitoring data:', error);
      // Re-add data to queues for retry
      this.logs.unshift(...data.logs);
      this.metrics.unshift(...data.metrics);
    }
  }

  private async sendToEndpoint(data: any): Promise<void> {
    if (!this.config.endpoint) return;

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Monitoring endpoint error: ${response.statusText}`);
    }
  }

  private saveToLocalStorage(data: any): void {
    try {
      const key = `konivrer_monitoring_${Date.now()}`;
      localStorage.setItem(key, JSON.stringify(data));
      
      // Clean up old entries
      this.cleanupLocalStorage();
    } catch (error) {
      console.warn('Failed to save monitoring data to localStorage:', error);
    }
  }

  private cleanupLocalStorage(): void {
    const cutoff = Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('konivrer_monitoring_')) {
        const timestamp = parseInt(key.split('_')[2]);
        if (timestamp < cutoff) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  private startHealthChecks(): void {
    if (!this.config.enableHealthChecks) return;

    // Register basic health checks
    this.registerHealthCheck('memory', async () => {
      const memory = (performance as any).memory;
      if (memory) {
        const usedPercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        return usedPercent < 0.9; // Alert if > 90% memory usage
      }
      return true;
    });

    this.registerHealthCheck('localStorage', async () => {
      try {
        const testKey = 'health_check_test';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
      } catch {
        return false;
      }
    });

    this.registerHealthCheck('network', async () => {
      return navigator.onLine;
    });
  }

  private getCurrentTraceId(): string | undefined {
    // In a real implementation, this would get the current trace context
    return Array.from(this.activeSpans.values())[0]?.traceId;
  }

  private getCurrentSpanId(): string | undefined {
    return Array.from(this.activeSpans.keys())[0];
  }

  private getCurrentUserId(): string | undefined {
    // In a real implementation, this would get from auth context
    return undefined;
  }

  private getCurrentSessionId(): string | undefined {
    // In a real implementation, this would get from session context
    return undefined;
  }
}

// Global instance
export const monitoring = new AdvancedMonitoringSystem();