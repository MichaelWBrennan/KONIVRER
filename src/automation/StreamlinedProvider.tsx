/**
 * Streamlined Autonomous System Provider - Optimized React integration
 * Minimal overhead, maximum functionality
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getStreamlinedSystem, StreamlinedConfig, ConsolidatedMetrics } from './StreamlinedAutonomousSystem';

interface StreamlinedContextType {
  system: ReturnType<typeof getStreamlinedSystem>;
  metrics: ConsolidatedMetrics;
  isHealthy: boolean;
  updateConfig: (config: Partial<StreamlinedConfig>) => void;
  forceCheck: () => void;
}

const StreamlinedContext = createContext<StreamlinedContextType | null>(null);

interface StreamlinedProviderProps {
  children: React.ReactNode;
  config?: Partial<StreamlinedConfig>;
}

export const StreamlinedAutonomousProvider: React.FC<StreamlinedProviderProps> = ({ 
  children, 
  config = {} 
}) => {
  const system = useMemo(() => getStreamlinedSystem(), []);
  const [metrics, setMetrics] = useState<ConsolidatedMetrics>(system.getMetrics());
  const [isHealthy, setIsHealthy] = useState(true);

  // Optimized event handlers with debouncing
  const handleMetricsUpdate = useCallback((newMetrics: ConsolidatedMetrics) => {
    setMetrics(newMetrics);
    setIsHealthy(system.isHealthy());
  }, [system]);

  const handleSystemCheck = useCallback(() => {
    setMetrics(system.getMetrics());
    setIsHealthy(system.isHealthy());
  }, [system]);

  // Initialize system and event listeners
  useEffect(() => {
    // Apply initial config
    if (Object.keys(config).length > 0) {
      system.updateConfig(config);
    }

    // Set up event listeners with throttling
    let metricsTimeout: number;
    const throttledMetricsUpdate = (newMetrics: ConsolidatedMetrics) => {
      clearTimeout(metricsTimeout);
      metricsTimeout = window.setTimeout(() => handleMetricsUpdate(newMetrics), 100);
    };

    let checkTimeout: number;
    const throttledSystemCheck = () => {
      clearTimeout(checkTimeout);
      checkTimeout = window.setTimeout(handleSystemCheck, 50);
    };

    system.on('metrics-updated', throttledMetricsUpdate);
    system.on('system-check-complete', throttledSystemCheck);

    // Cleanup
    return () => {
      clearTimeout(metricsTimeout);
      clearTimeout(checkTimeout);
      system.off('metrics-updated', throttledMetricsUpdate);
      system.off('system-check-complete', throttledSystemCheck);
    };
  }, [system, config, handleMetricsUpdate, handleSystemCheck]);

  // Optimized config update
  const updateConfig = useCallback((newConfig: Partial<StreamlinedConfig>) => {
    system.updateConfig(newConfig);
  }, [system]);

  // Force system check
  const forceCheck = useCallback(() => {
    setMetrics(system.getMetrics());
    setIsHealthy(system.isHealthy());
  }, [system]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    system,
    metrics,
    isHealthy,
    updateConfig,
    forceCheck
  }), [system, metrics, isHealthy, updateConfig, forceCheck]);

  return (
    <StreamlinedContext.Provider value={contextValue}>
      {children}
    </StreamlinedContext.Provider>
  );
};

// Optimized hook with error boundary
export const useStreamlinedAutonomous = (): StreamlinedContextType => {
  const context = useContext(StreamlinedContext);
  
  if (!context) {
    // Fallback system if context is not available
    const fallbackSystem = getStreamlinedSystem();
    return {
      system: fallbackSystem,
      metrics: fallbackSystem.getMetrics(),
      isHealthy: fallbackSystem.isHealthy(),
      updateConfig: (config) => fallbackSystem.updateConfig(config),
      forceCheck: () => {}
    };
  }
  
  return context;
};

// Lightweight hooks for specific features
export const useSecurityMetrics = () => {
  const { metrics } = useStreamlinedAutonomous();
  return useMemo(() => ({
    threatsDetected: metrics.threatsDetected,
    threatsBlocked: metrics.threatsBlocked,
    vulnerabilitiesPatched: metrics.vulnerabilitiesPatched,
    securityScore: metrics.threatsBlocked / Math.max(metrics.threatsDetected, 1) * 100
  }), [metrics]);
};

export const useHealingMetrics = () => {
  const { metrics } = useStreamlinedAutonomous();
  return useMemo(() => ({
    issuesDetected: metrics.issuesDetected,
    issuesResolved: metrics.issuesResolved,
    healingSuccessRate: metrics.healingSuccessRate,
    isHealthy: metrics.healingSuccessRate > 80
  }), [metrics]);
};

export const usePerformanceMetrics = () => {
  const { metrics } = useStreamlinedAutonomous();
  return useMemo(() => ({
    memoryUsage: metrics.memoryUsage,
    cpuUsage: metrics.cpuUsage,
    uptime: metrics.uptime,
    performanceScore: Math.max(0, 100 - (metrics.memoryUsage / 10) - (metrics.cpuUsage / 10))
  }), [metrics]);
};

export const useEvolutionMetrics = () => {
  const { metrics } = useStreamlinedAutonomous();
  return useMemo(() => ({
    codeImprovements: metrics.codeImprovements,
    performanceGains: metrics.performanceGains,
    evolutionRate: metrics.codeImprovements / Math.max(metrics.uptime / 3600000, 1) // per hour
  }), [metrics]);
};

export const useTrendMetrics = () => {
  const { metrics } = useStreamlinedAutonomous();
  return useMemo(() => ({
    trendsAnalyzed: metrics.trendsAnalyzed,
    adaptationsApplied: metrics.adaptationsApplied,
    adaptationRate: metrics.adaptationsApplied / Math.max(metrics.trendsAnalyzed, 1) * 100
  }), [metrics]);
};

export const useDependencyMetrics = () => {
  const { metrics } = useStreamlinedAutonomous();
  return useMemo(() => ({
    dependenciesUpdated: metrics.dependenciesUpdated,
    conflictsResolved: metrics.conflictsResolved,
    updateSuccessRate: metrics.dependenciesUpdated / Math.max(metrics.dependenciesUpdated + metrics.conflictsResolved, 1) * 100
  }), [metrics]);
};

// Performance monitoring hook
export const useSystemHealth = () => {
  const { isHealthy, metrics } = useStreamlinedAutonomous();
  
  return useMemo(() => {
    const healthScore = Math.min(100, Math.max(0, 
      100 - 
      (metrics.memoryUsage > 80 ? 20 : 0) -
      (metrics.cpuUsage > 50 ? 15 : 0) -
      (metrics.healingSuccessRate < 80 ? 25 : 0)
    ));
    
    return {
      isHealthy,
      healthScore,
      status: healthScore > 80 ? 'excellent' : 
              healthScore > 60 ? 'good' : 
              healthScore > 40 ? 'fair' : 'poor',
      recommendations: [
        ...(metrics.memoryUsage > 80 ? ['Reduce memory usage'] : []),
        ...(metrics.cpuUsage > 50 ? ['Optimize performance'] : []),
        ...(metrics.healingSuccessRate < 80 ? ['Check healing system'] : [])
      ]
    };
  }, [isHealthy, metrics]);
};

// Emergency controls hook
export const useEmergencyControls = () => {
  const { system, updateConfig } = useStreamlinedAutonomous();
  
  const enableEmergencyMode = useCallback(() => {
    updateConfig({
      checkInterval: 30000, // Reduce frequency
      maxMemoryUsage: 50,   // Lower memory limit
      batchSize: 5,         // Smaller batches
      useWebWorkers: false, // Disable workers
      lazyLoading: true     // Enable lazy loading
    });
  }, [updateConfig]);
  
  const enablePerformanceMode = useCallback(() => {
    updateConfig({
      checkInterval: 10000, // Increase frequency
      maxMemoryUsage: 150,  // Higher memory limit
      batchSize: 20,        // Larger batches
      useWebWorkers: true,  // Enable workers
      lazyLoading: false    // Disable lazy loading
    });
  }, [updateConfig]);
  
  const enableSilentMode = useCallback(() => {
    updateConfig({
      silentMode: true,
      checkInterval: 60000, // Very low frequency
      batchSize: 3          // Very small batches
    });
  }, [updateConfig]);
  
  return {
    enableEmergencyMode,
    enablePerformanceMode,
    enableSilentMode
  };
};

export default StreamlinedAutonomousProvider;