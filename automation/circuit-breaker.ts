#!/usr/bin/env node

/**
 * Advanced Circuit Breaker Pattern Implementation
 * Provides fault tolerance and graceful degradation for distributed systems
 */

import { EventEmitter } from 'events';

export interface CircuitBreakerOptions {
  failureThreshold: number;        // Number of failures before opening circuit
  resetTimeout: number;            // Time to wait before attempting to close circuit
  monitorInterval: number;         // Interval for monitoring circuit state
  timeout: number;                 // Timeout for operations
  volumeThreshold: number;         // Minimum number of requests before circuit can open
  errorFilter?: (error: any) => boolean; // Custom error filtering
  fallback?: (...args: any[]) => any;    // Fallback function when circuit is open
}

export interface CircuitBreakerState {
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime: number;
  lastSuccessTime: number;
  totalRequests: number;
  totalFailures: number;
  totalSuccesses: number;
  averageResponseTime: number;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

export interface CircuitBreakerMetrics {
  successRate: number;
  failureRate: number;
  averageResponseTime: number;
  circuitOpenTime: number;
  totalCircuitOpens: number;
  lastCircuitOpen: number;
}

export class CircuitBreaker extends EventEmitter {
  private state: CircuitBreakerState;
  private options: CircuitBreakerOptions;
  private timer: NodeJS.Timeout | null = null;
  private monitorTimer: NodeJS.Timeout | null = null;
  private pendingRequests: Map<string, { resolve: Function; reject: Function; startTime: number }> = new Map();
  private responseTimes: number[] = [];
  private readonly MAX_RESPONSE_TIMES = 100;

  constructor(options: Partial<CircuitBreakerOptions> = {}) {
    super();
    
    this.options = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      monitorInterval: 10000, // 10 seconds
      timeout: 30000, // 30 seconds
      volumeThreshold: 10,
      ...options
    };

    this.state = {
      status: 'CLOSED',
      failureCount: 0,
      lastFailureTime: 0,
      lastSuccessTime: Date.now(),
      totalRequests: 0,
      totalFailures: 0,
      totalSuccesses: 0,
      averageResponseTime: 0,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0
    };

    this.startMonitoring();
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(
    operation: (...args: any[]) => Promise<T>,
    ...args: any[]
  ): Promise<T> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    // Check if circuit is open
    if (this.state.status === 'OPEN') {
      this.emit('circuit-open', { requestId, timestamp: Date.now() });
      
      if (this.options.fallback) {
        try {
          const fallbackResult = await this.options.fallback(...args);
          this.emit('fallback-executed', { requestId, timestamp: Date.now() });
          return fallbackResult;
        } catch (error) {
          this.emit('fallback-failed', { requestId, error, timestamp: Date.now() });
          throw error;
        }
      }
      
      throw new Error('Circuit breaker is OPEN');
    }

    // Check if we should attempt to close the circuit
    if (this.state.status === 'HALF_OPEN') {
      this.emit('half-open-attempt', { requestId, timestamp: Date.now() });
    }

    // Increment request count
    this.state.totalRequests++;

    try {
      // Execute the operation with timeout
      const result = await this.withTimeout(operation(...args), this.options.timeout);
      
      // Record success
      this.recordSuccess(startTime);
      this.emit('success', { requestId, responseTime: Date.now() - startTime, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      // Record failure
      this.recordFailure(error, startTime);
      this.emit('failure', { requestId, error, responseTime: Date.now() - startTime, timestamp: Date.now() });
      
      // Check if we should open the circuit
      this.checkCircuitState();
      
      throw error;
    }
  }

  /**
   * Execute operation with timeout
   */
  private async withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Operation timeout'));
      }, timeout);

      promise
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  /**
   * Record successful operation
   */
  private recordSuccess(startTime: number): void {
    const responseTime = Date.now() - startTime;
    
    this.state.failureCount = 0;
    this.state.lastSuccessTime = Date.now();
    this.state.totalSuccesses++;
    this.state.consecutiveSuccesses++;
    this.state.consecutiveFailures = 0;
    
    // Update response time tracking
    this.updateResponseTime(responseTime);
    
    // If circuit is half-open, close it
    if (this.state.status === 'HALF_OPEN') {
      this.closeCircuit();
    }
  }

  /**
   * Record failed operation
   */
  private recordFailure(error: any, startTime: number): void {
    const responseTime = Date.now() - startTime;
    
    // Check if error should be counted
    if (this.options.errorFilter && !this.options.errorFilter(error)) {
      return;
    }
    
    this.state.failureCount++;
    this.state.lastFailureTime = Date.now();
    this.state.totalFailures++;
    this.state.consecutiveFailures++;
    this.state.consecutiveSuccesses = 0;
    
    // Update response time tracking
    this.updateResponseTime(responseTime);
  }

  /**
   * Update response time tracking
   */
  private updateResponseTime(responseTime: number): void {
    this.responseTimes.push(responseTime);
    
    if (this.responseTimes.length > this.MAX_RESPONSE_TIMES) {
      this.responseTimes.shift();
    }
    
    this.state.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  /**
   * Check if circuit should change state
   */
  private checkCircuitState(): void {
    if (this.state.status === 'CLOSED' && 
        this.state.totalRequests >= this.options.volumeThreshold &&
        this.state.failureCount >= this.options.failureThreshold) {
      this.openCircuit();
    }
  }

  /**
   * Open the circuit
   */
  private openCircuit(): void {
    this.state.status = 'OPEN';
    this.emit('circuit-opened', { 
      failureCount: this.state.failureCount, 
      timestamp: Date.now() 
    });
    
    // Schedule circuit reset
    this.timer = setTimeout(() => {
      this.halfOpenCircuit();
    }, this.options.resetTimeout);
  }

  /**
   * Half-open the circuit
   */
  private halfOpenCircuit(): void {
    this.state.status = 'HALF_OPEN';
    this.emit('circuit-half-opened', { timestamp: Date.now() });
  }

  /**
   * Close the circuit
   */
  private closeCircuit(): void {
    this.state.status = 'CLOSED';
    this.state.failureCount = 0;
    this.emit('circuit-closed', { timestamp: Date.now() });
  }

  /**
   * Start monitoring circuit state
   */
  private startMonitoring(): void {
    this.monitorTimer = setInterval(() => {
      this.emit('metrics', this.getMetrics());
      this.emit('state-change', this.getState());
    }, this.options.monitorInterval);
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitBreakerState {
    return { ...this.state };
  }

  /**
   * Get circuit metrics
   */
  getMetrics(): CircuitBreakerMetrics {
    const successRate = this.state.totalRequests > 0 ? 
      (this.state.totalSuccesses / this.state.totalRequests) * 100 : 0;
    
    const failureRate = this.state.totalRequests > 0 ? 
      (this.state.totalFailures / this.state.totalRequests) * 100 : 0;
    
    const circuitOpenTime = this.state.status === 'OPEN' ? 
      Date.now() - this.state.lastFailureTime : 0;
    
    return {
      successRate,
      failureRate,
      averageResponseTime: this.state.averageResponseTime,
      circuitOpenTime,
      totalCircuitOpens: 0, // Would need to track this
      lastCircuitOpen: this.state.lastFailureTime
    };
  }

  /**
   * Force open circuit (for testing or emergency)
   */
  forceOpen(): void {
    this.openCircuit();
    this.emit('circuit-forced-open', { timestamp: Date.now() });
  }

  /**
   * Force close circuit (for testing or emergency)
   */
  forceClose(): void {
    this.closeCircuit();
    this.emit('circuit-forced-closed', { timestamp: Date.now() });
  }

  /**
   * Reset circuit to initial state
   */
  reset(): void {
    this.state = {
      status: 'CLOSED',
      failureCount: 0,
      lastFailureTime: 0,
      lastSuccessTime: Date.now(),
      totalRequests: 0,
      totalFailures: 0,
      totalSuccesses: 0,
      averageResponseTime: 0,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0
    };
    
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    this.emit('circuit-reset', { timestamp: Date.now() });
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.monitorTimer) {
      clearInterval(this.monitorTimer);
    }
    this.removeAllListeners();
  }
}

/**
 * Circuit Breaker Factory for creating specialized instances
 */
export class CircuitBreakerFactory {
  /**
   * Create a circuit breaker for HTTP requests
   */
  static createHttpBreaker(options: Partial<CircuitBreakerOptions> = {}): CircuitBreaker {
    return new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 30000,
      timeout: 10000,
      volumeThreshold: 10,
      errorFilter: (error) => {
        // Count HTTP 5xx errors and network errors
        return error.code === 'ECONNREFUSED' || 
               error.code === 'ENOTFOUND' ||
               error.code === 'ETIMEDOUT' ||
               (error.response && error.response.status >= 500);
      },
      fallback: () => ({ error: 'Service temporarily unavailable' }),
      ...options
    });
  }

  /**
   * Create a circuit breaker for database operations
   */
  static createDatabaseBreaker(options: Partial<CircuitBreakerOptions> = {}): CircuitBreaker {
    return new CircuitBreaker({
      failureThreshold: 3,
      resetTimeout: 60000,
      timeout: 15000,
      volumeThreshold: 5,
      errorFilter: (error) => {
        // Count database connection and query errors
        return error.code === 'ECONNREFUSED' ||
               error.code === 'ENOTFOUND' ||
               error.code === 'ETIMEDOUT' ||
               error.code === 'ER_ACCESS_DENIED_ERROR' ||
               error.code === 'ER_NO_SUCH_TABLE';
      },
      fallback: () => ({ error: 'Database temporarily unavailable' }),
      ...options
    });
  }

  /**
   * Create a circuit breaker for external API calls
   */
  static createApiBreaker(options: Partial<CircuitBreakerOptions> = {}): CircuitBreaker {
    return new CircuitBreaker({
      failureThreshold: 10,
      resetTimeout: 120000,
      timeout: 20000,
      volumeThreshold: 20,
      errorFilter: (error) => {
        // Count API rate limiting and service errors
        return error.code === 'ECONNREFUSED' ||
               error.code === 'ENOTFOUND' ||
               error.code === 'ETIMEDOUT' ||
               (error.response && error.response.status >= 500) ||
               (error.response && error.response.status === 429);
      },
      fallback: () => ({ error: 'External service temporarily unavailable' }),
      ...options
    });
  }
}

/**
 * Circuit Breaker Manager for coordinating multiple circuit breakers
 */
export class CircuitBreakerManager extends EventEmitter {
  private breakers: Map<string, CircuitBreaker> = new Map();
  private healthCheckTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startHealthChecks();
  }

  /**
   * Register a circuit breaker
   */
  register(name: string, breaker: CircuitBreaker): void {
    this.breakers.set(name, breaker);
    
    breaker.on('circuit-opened', (data) => {
      this.emit('breaker-opened', { name, ...data });
    });
    
    breaker.on('circuit-closed', (data) => {
      this.emit('breaker-closed', { name, ...data });
    });
    
    breaker.on('metrics', (metrics) => {
      this.emit('breaker-metrics', { name, metrics });
    });
  }

  /**
   * Get a circuit breaker by name
   */
  get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  /**
   * Get all circuit breakers
   */
  getAll(): Map<string, CircuitBreaker> {
    return this.breakers;
  }

  /**
   * Get overall system health
   */
  getSystemHealth(): { healthy: boolean; openBreakers: string[]; totalBreakers: number } {
    const openBreakers: string[] = [];
    
    for (const [name, breaker] of this.breakers) {
      if (breaker.getState().status === 'OPEN') {
        openBreakers.push(name);
      }
    }
    
    return {
      healthy: openBreakers.length === 0,
      openBreakers,
      totalBreakers: this.breakers.size
    };
  }

  /**
   * Start health check monitoring
   */
  private startHealthChecks(): void {
    this.healthCheckTimer = setInterval(() => {
      const health = this.getSystemHealth();
      this.emit('health-check', health);
      
      if (!health.healthy) {
        this.emit('system-degraded', health);
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    
    for (const breaker of this.breakers.values()) {
      breaker.destroy();
    }
    
    this.breakers.clear();
    this.removeAllListeners();
  }
}

export default CircuitBreaker;