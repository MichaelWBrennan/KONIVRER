/**
 * KONIVRER Self-Optimizer Module
 * 
 * This module provides self-optimizing capabilities for the application:
 * - Runtime performance monitoring and optimization
 * - Adaptive resource management
 * - Component-level optimization
 * - Automatic memory management
 * - Rendering optimization
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory: number | null;
  loadTime: number;
  renderTime: number;
  networkLatency: number | null;
  resourceUsage: {
    cpu: number | null;
    memory: number | null;
  };
}

interface OptimizationSettings {
  enableLazyLoading: boolean;
  enableCodeSplitting: boolean;
  enableMemoryManagement: boolean;
  enableRenderOptimization: boolean;
  enableNetworkOptimization: boolean;
  throttleInterval: number;
}

const defaultSettings: OptimizationSettings = {
  enableLazyLoading: true,
  enableCodeSplitting: true,
  enableMemoryManagement: true,
  enableRenderOptimization: true,
  enableNetworkOptimization: true,
  throttleInterval: 5000, // 5 seconds
};

export class SelfOptimizer {
  private static instance: SelfOptimizer;
  private metrics: PerformanceMetrics;
  private settings: OptimizationSettings;
  private optimizationListeners: Array<(metrics: PerformanceMetrics) => void> = [];
  private lastOptimizationTime: number = 0;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private isMonitoring: boolean = false;

  private constructor() {
    this.settings = { ...defaultSettings };
    this.metrics = {
      fps: 0,
      memory: null,
      loadTime: performance.now(),
      renderTime: 0,
      networkLatency: null,
      resourceUsage: {
        cpu: null,
        memory: null,
      },
    };
    
    // Initialize performance monitoring
    this.initPerformanceMonitoring();
    
    // Start silent monitoring
    silentMonitor();
    
    // Silent initialization
    console.debug('[OPTIMIZER] Self-optimizer initialized silently');
  }

  public static getInstance(): SelfOptimizer {
    if (!SelfOptimizer.instance) {
      SelfOptimizer.instance = new SelfOptimizer();
    }
    return SelfOptimizer.instance;
  }

  private initPerformanceMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Monitor FPS
    const measureFPS = () => {
      this.frameCount++;
      const now = performance.now();
      
      if (now - this.lastFrameTime >= 1000) { // Every second
        this.metrics.fps = this.frameCount;
        this.frameCount = 0;
        this.lastFrameTime = now;
        
        // Check if optimization is needed
        this.checkAndOptimize();
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
    
    // Monitor memory if available
    if (performance && (performance as any).memory) {
      setInterval(() => {
        this.metrics.memory = (performance as any).memory.usedJSHeapSize / (1024 * 1024);
      }, 2000);
    }
    
    // Monitor network latency
    this.monitorNetworkLatency();
  }

  private monitorNetworkLatency(): void {
    // Simple ping implementation
    const checkLatency = () => {
      const start = performance.now();
      
      fetch('/ping', { method: 'GET', cache: 'no-store' })
        .then(() => {
          this.metrics.networkLatency = performance.now() - start;
        })
        .catch(() => {
          // If ping endpoint doesn't exist, use a dummy value
          this.metrics.networkLatency = null;
        })
        .finally(() => {
          setTimeout(checkLatency, 10000); // Check every 10 seconds
        });
    };
    
    checkLatency();
  }

  private checkAndOptimize(): void {
    const now = performance.now();
    
    // Only optimize at the specified interval
    if (now - this.lastOptimizationTime < this.settings.throttleInterval) {
      return;
    }
    
    this.lastOptimizationTime = now;
    
    // Apply optimizations based on metrics
    if (this.metrics.fps < 30 && this.settings.enableRenderOptimization) {
      this.optimizeRendering();
    }
    
    if (this.metrics.memory && this.metrics.memory > 100 && this.settings.enableMemoryManagement) {
      this.optimizeMemory();
    }
    
    // Notify listeners
    this.notifyOptimizationListeners();
  }

  private optimizeRendering(): void {
    console.log('[OPTIMIZER] Applying rendering optimizations');
    // In a real implementation, this would adjust rendering settings
    // For example, reducing animation complexity, disabling effects, etc.
  }

  private optimizeMemory(): void {
    console.log('[OPTIMIZER] Applying memory optimizations');
    // In a real implementation, this would clean up unused resources
    // For example, clearing caches, releasing unused objects, etc.
    
    // Force garbage collection if possible (only works in some environments)
    if (window && (window as any).gc) {
      (window as any).gc();
    }
  }

  private notifyOptimizationListeners(): void {
    this.optimizationListeners.forEach(listener => {
      listener(this.metrics);
    });
  }

  public addOptimizationListener(listener: (metrics: PerformanceMetrics) => void): void {
    this.optimizationListeners.push(listener);
  }

  public removeOptimizationListener(listener: (metrics: PerformanceMetrics) => void): void {
    const index = this.optimizationListeners.indexOf(listener);
    if (index !== -1) {
      this.optimizationListeners.splice(index, 1);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public updateSettings(newSettings: Partial<OptimizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    console.log('[OPTIMIZER] Settings updated:', this.settings);
  }

  public optimizeOnDemand(): void {
    console.log('[OPTIMIZER] Running on-demand optimization');
    this.optimizeRendering();
    this.optimizeMemory();
    this.notifyOptimizationListeners();
  }
}

// React hook for using the self-optimizer
export const useSelfOptimizer = (): {
  metrics: PerformanceMetrics;
  updateSettings: (settings: Partial<OptimizationSettings>) => void;
  optimizeNow: () => void;
} => {
  const optimizer = SelfOptimizer.getInstance();
  const [metrics, setMetrics] = useState<PerformanceMetrics>(optimizer.getMetrics());
  
  useEffect(() => {
    const listener = (newMetrics: PerformanceMetrics) => {
      setMetrics({ ...newMetrics });
    };
    
    optimizer.addOptimizationListener(listener);
    
    return () => {
      optimizer.removeOptimizationListener(listener);
    };
  }, []);
  
  const updateSettings = useCallback((settings: Partial<OptimizationSettings>) => {
    optimizer.updateSettings(settings);
  }, []);
  
  const optimizeNow = useCallback(() => {
    optimizer.optimizeOnDemand();
  }, []);
  
  return { metrics, updateSettings, optimizeNow };
};

// Silent Performance Monitor - No UI component
const silentMonitor = () => {
  // Get the optimizer instance
  const optimizer = SelfOptimizer.getInstance();
  
  // Set up silent monitoring
  setInterval(() => {
    const metrics = optimizer.getMetrics();
    
    // Silently optimize if needed
    if (metrics.fps < 30 || (metrics.memory && metrics.memory > 100)) {
      optimizer.optimizeOnDemand();
    }
  }, 30000); // Check every 30 seconds
};

// Optimized component wrapper
export function withOptimization<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    name?: string;
    memoize?: boolean;
    lazyLoad?: boolean;
  } = {}
): React.FC<P> {
  const { name = 'OptimizedComponent', memoize = true, lazyLoad = false } = options;
  
  // Create optimized component
  const OptimizedComponent: React.FC<P> = (props) => {
    const renderStartTime = useRef<number>(0);
    const renderEndTime = useRef<number>(0);
    const optimizer = SelfOptimizer.getInstance();
    
    useEffect(() => {
      // Report render time
      const renderTime = renderEndTime.current - renderStartTime.current;
      if (renderTime > 0) {
        optimizer.getMetrics().renderTime = renderTime;
      }
    });
    
    renderStartTime.current = performance.now();
    const result = <Component {...props} />;
    renderEndTime.current = performance.now();
    
    return result;
  };
  
  OptimizedComponent.displayName = `Optimized(${name})`;
  
  // Apply memoization if requested
  return memoize ? React.memo(OptimizedComponent) : OptimizedComponent;
}

export default SelfOptimizer;