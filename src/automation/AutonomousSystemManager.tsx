/**
 * Autonomous System Manager - Central integration point for all automation
 * Provides React integration and management for the autonomous orchestrator
 */

import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import AutonomousOrchestrator, { AutonomousConfig, SystemHealth, ThreatLevel } from '../../automation/autonomous-orchestrator';
import { useCodeEvolution } from './CodeEvolutionEngine';
import { useSelfHealing } from './SelfHealingCore';
import { useDependencyOrchestrator } from './DependencyOrchestrator';

interface AutonomousSystemState {
  isActive: boolean;
  systemHealth: SystemHealth;
  threatLevel: ThreatLevel;
  lastUpdate: Date;
  autonomousMode: boolean;
}

interface AutonomousSystemContextType {
  orchestrator: AutonomousOrchestrator | null;
  state: AutonomousSystemState;
  startAutonomousMode: () => Promise<void>;
  stopAutonomousMode: () => Promise<void>;
  updateConfig: (config: Partial<AutonomousConfig>) => Promise<void>;
  getSystemStatus: () => Promise<any>;
}

const AutonomousSystemContext = createContext<AutonomousSystemContextType | null>(null);

export const useAutonomousSystem = () => {
  const context = useContext(AutonomousSystemContext);
  if (!context) {
    throw new Error('useAutonomousSystem must be used within an AutonomousSystemProvider');
  }
  return context;
};

interface AutonomousSystemProviderProps {
  children: React.ReactNode;
  config?: Partial<AutonomousConfig>;
  autoStart?: boolean;
}

export const AutonomousSystemProvider: React.FC<AutonomousSystemProviderProps> = ({
  children,
  config = {},
  autoStart = true
}) => {
  const [orchestrator] = useState(() => new AutonomousOrchestrator({
    silentMode: true,
    autoUpdate: true,
    securityLevel: 'maximum',
    evolutionRate: 'moderate',
    industryTracking: true,
    selfGovernance: true,
    ...config
  }));

  const [state, setState] = useState<AutonomousSystemState>({
    isActive: false,
    systemHealth: {
      security: 100,
      performance: 100,
      stability: 100,
      compliance: 100,
      trends: 100,
      overall: 100
    },
    threatLevel: {
      level: 'minimal',
      confidence: 0.95,
      sources: [],
      mitigations: []
    },
    lastUpdate: new Date(),
    autonomousMode: false
  });

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        // Set up event listeners
        orchestrator.on('orchestrator-started', () => {
          setState(prev => ({ ...prev, isActive: true, autonomousMode: true }));
        });

        orchestrator.on('orchestrator-stopped', () => {
          setState(prev => ({ ...prev, isActive: false, autonomousMode: false }));
        });

        orchestrator.on('log', (logData) => {
          if (!config.silentMode) {
            console.log(`[Autonomous System] ${logData.message}`);
          }
        });

        // Start periodic status updates
        const statusInterval = setInterval(async () => {
          try {
            const systemHealth = orchestrator.getSystemHealth();
            const threatLevel = orchestrator.getThreatLevel();
            
            setState(prev => ({
              ...prev,
              systemHealth,
              threatLevel,
              lastUpdate: new Date()
            }));
          } catch (error) {
            console.error('Error updating system status:', error);
          }
        }, 10000); // Every 10 seconds

        // Auto-start if enabled
        if (autoStart) {
          await orchestrator.start();
        }

        return () => {
          clearInterval(statusInterval);
          orchestrator.removeAllListeners();
        };
      } catch (error) {
        console.error('Error initializing autonomous system:', error);
      }
    };

    initializeSystem();
  }, [orchestrator, autoStart, config.silentMode]);

  const startAutonomousMode = useCallback(async () => {
    try {
      await orchestrator.start();
    } catch (error) {
      console.error('Error starting autonomous mode:', error);
    }
  }, [orchestrator]);

  const stopAutonomousMode = useCallback(async () => {
    try {
      await orchestrator.stop();
    } catch (error) {
      console.error('Error stopping autonomous mode:', error);
    }
  }, [orchestrator]);

  const updateConfig = useCallback(async (newConfig: Partial<AutonomousConfig>) => {
    try {
      await orchestrator.updateConfig(newConfig);
    } catch (error) {
      console.error('Error updating config:', error);
    }
  }, [orchestrator]);

  const getSystemStatus = useCallback(async () => {
    try {
      return await orchestrator.getSystemStatus();
    } catch (error) {
      console.error('Error getting system status:', error);
      return null;
    }
  }, [orchestrator]);

  const contextValue: AutonomousSystemContextType = {
    orchestrator,
    state,
    startAutonomousMode,
    stopAutonomousMode,
    updateConfig,
    getSystemStatus
  };

  return (
    <AutonomousSystemContext.Provider value={contextValue}>
      {children}
    </AutonomousSystemContext.Provider>
  );
};

interface AutonomousSystemDashboardProps {
  className?: string;
  showDetails?: boolean;
}

export const AutonomousSystemDashboard: React.FC<AutonomousSystemDashboardProps> = ({
  className = '',
  showDetails = false
}) => {
  const { state, startAutonomousMode, stopAutonomousMode } = useAutonomousSystem();
  const codeEvolution = useCodeEvolution();
  const selfHealing = useSelfHealing();
  const dependencyOrchestrator = useDependencyOrchestrator();

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'minimal': return 'text-green-500';
      case 'low': return 'text-blue-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`autonomous-system-dashboard ${className}`}>
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            🤖 Autonomous System
            <span className={`ml-3 px-2 py-1 rounded text-sm ${
              state.isActive ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {state.isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </h2>
          
          <div className="flex space-x-2">
            {!state.isActive ? (
              <button
                onClick={startAutonomousMode}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
              >
                Start Autonomous Mode
              </button>
            ) : (
              <button
                onClick={stopAutonomousMode}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
              >
                Stop Autonomous Mode
              </button>
            )}
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-400">Security</div>
            <div className={`text-xl font-bold ${getHealthColor(state.systemHealth.security)}`}>
              {state.systemHealth.security.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-400">Performance</div>
            <div className={`text-xl font-bold ${getHealthColor(state.systemHealth.performance)}`}>
              {state.systemHealth.performance.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-400">Stability</div>
            <div className={`text-xl font-bold ${getHealthColor(state.systemHealth.stability)}`}>
              {state.systemHealth.stability.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-400">Compliance</div>
            <div className={`text-xl font-bold ${getHealthColor(state.systemHealth.compliance)}`}>
              {state.systemHealth.compliance.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-400">Trends</div>
            <div className={`text-xl font-bold ${getHealthColor(state.systemHealth.trends)}`}>
              {state.systemHealth.trends.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm text-gray-400">Overall</div>
            <div className={`text-xl font-bold ${getHealthColor(state.systemHealth.overall)}`}>
              {state.systemHealth.overall.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Threat Level */}
        <div className="bg-gray-800 p-4 rounded mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Threat Level</div>
              <div className={`text-xl font-bold ${getThreatLevelColor(state.threatLevel.level)}`}>
                {state.threatLevel.level.toUpperCase()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Confidence</div>
              <div className="text-xl font-bold">
                {(state.threatLevel.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Subsystem Status */}
        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Code Evolution */}
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                🧬 Code Evolution
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  codeEvolution.isActive ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {codeEvolution.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Applied Improvements:</span>
                  <span>{codeEvolution.metrics.appliedImprovements}</span>
                </div>
                <div className="flex justify-between">
                  <span>Code Quality:</span>
                  <span className={getHealthColor(codeEvolution.metrics.codeQualityScore)}>
                    {codeEvolution.metrics.codeQualityScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Self Healing */}
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                🩹 Self Healing
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  selfHealing.isActive ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {selfHealing.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Healed Issues:</span>
                  <span>{selfHealing.metrics.healedIssues}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className={getHealthColor(selfHealing.metrics.healingSuccessRate)}>
                    {selfHealing.metrics.healingSuccessRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Dependency Management */}
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                📦 Dependencies
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  dependencyOrchestrator.isActive ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {dependencyOrchestrator.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Vulnerabilities:</span>
                  <span className={dependencyOrchestrator.metrics.criticalVulnerabilities > 0 ? 'text-red-500' : 'text-green-500'}>
                    {dependencyOrchestrator.metrics.criticalVulnerabilities}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Outdated:</span>
                  <span>{dependencyOrchestrator.metrics.outdatedDependencies}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last Update */}
        <div className="text-sm text-gray-400 text-center">
          Last updated: {state.lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

interface AutonomousSystemIndicatorProps {
  className?: string;
  compact?: boolean;
}

export const AutonomousSystemIndicator: React.FC<AutonomousSystemIndicatorProps> = ({
  className = '',
  compact = true
}) => {
  const { state } = useAutonomousSystem();

  if (compact) {
    return (
      <div className={`autonomous-indicator ${className}`}>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
          state.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-900 text-gray-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            state.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
          }`} />
          <span>Autonomous {state.isActive ? 'Active' : 'Inactive'}</span>
          {state.isActive && (
            <span className="text-xs">
              {state.systemHealth.overall.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`autonomous-indicator-detailed ${className}`}>
      <AutonomousSystemDashboard showDetails={false} />
    </div>
  );
};

// Hook for autonomous system integration in existing components
export const useAutonomousIntegration = () => {
  const autonomousSystem = useAutonomousSystem();
  const [integrationStatus, setIntegrationStatus] = useState({
    connected: false,
    lastSync: new Date(),
    errors: [] as string[]
  });

  useEffect(() => {
    if (autonomousSystem.orchestrator) {
      setIntegrationStatus(prev => ({ ...prev, connected: true }));
      
      // Set up integration event listeners
      const handleSystemEvent = (event: any) => {
        setIntegrationStatus(prev => ({ ...prev, lastSync: new Date() }));
      };

      autonomousSystem.orchestrator.on('log', handleSystemEvent);
      
      return () => {
        autonomousSystem.orchestrator?.off('log', handleSystemEvent);
      };
    }
  }, [autonomousSystem.orchestrator]);

  const reportIssue = useCallback(async (issue: any) => {
    try {
      // Report issue to autonomous system for handling
      if (autonomousSystem.orchestrator) {
        // The orchestrator will handle the issue through its engines
        console.log('Reported issue to autonomous system:', issue);
      }
    } catch (error) {
      setIntegrationStatus(prev => ({
        ...prev,
        errors: [...prev.errors, `Failed to report issue: ${error.message}`]
      }));
    }
  }, [autonomousSystem.orchestrator]);

  const requestOptimization = useCallback(async (target: string) => {
    try {
      // Request optimization from autonomous system
      if (autonomousSystem.orchestrator) {
        console.log('Requested optimization for:', target);
      }
    } catch (error) {
      setIntegrationStatus(prev => ({
        ...prev,
        errors: [...prev.errors, `Failed to request optimization: ${error.message}`]
      }));
    }
  }, [autonomousSystem.orchestrator]);

  return {
    ...autonomousSystem,
    integrationStatus,
    reportIssue,
    requestOptimization
  };
};

export default AutonomousSystemManager;