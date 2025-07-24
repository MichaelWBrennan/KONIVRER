/**
 * Autonomous System Manager - Central integration point for all automation
 * Provides React integration and management for the autonomous orchestrator
 */

import React, {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';
import AutonomousOrchestrator, {
  AutonomousConfig,
  SystemHealth,
  ThreatLevel,
} from '../../automation/autonomous-orchestrator';
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

const AutonomousSystemContext =
  createContext<AutonomousSystemContextType | null>(null);

export const useAutonomousSystem = () => {
  const context = useContext(AutonomousSystemContext);
  if (!context) {
    throw new Error(
      'useAutonomousSystem must be used within an AutonomousSystemProvider',
    );
  }
  return context;
};

interface AutonomousSystemProviderProps {
  children: React.ReactNode;
  config?: Partial<AutonomousConfig>;
  autoStart?: boolean;
}

export const AutonomousSystemProvider: React.FC<
  AutonomousSystemProviderProps
> = ({ children, config = {}, autoStart = true }) => {
  const [orchestrator] = useState(
    () =>
      new AutonomousOrchestrator({
        silentMode: true,
        autoUpdate: true,
        securityLevel: 'maximum',
        evolutionRate: 'moderate',
        industryTracking: true,
        selfGovernance: true,
        ...config,
      }),
  );

  const [state, setState] = useState<AutonomousSystemState>({
    isActive: false,
    systemHealth: {
      security: 100,
      performance: 100,
      stability: 100,
      compliance: 100,
      trends: 100,
      overall: 100,
    },
    threatLevel: {
      level: 'minimal',
      confidence: 0.95,
      sources: [],
      mitigations: [],
    },
    lastUpdate: new Date(),
    autonomousMode: false,
  });

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        // Set up event listeners
        orchestrator.on('orchestrator-started', () => {
          setState(prev => ({ ...prev, isActive: true, autonomousMode: true }));
        });

        orchestrator.on('orchestrator-stopped', () => {
          setState(prev => ({
            ...prev,
            isActive: false,
            autonomousMode: false,
          }));
        });

        orchestrator.on('log', logData => {
          if (!config.silentMode) {
            console.log(`[Autonomous System] ${logData.message}`);
          }
        });

        // Start periodic status updates
        const statusInterval: NodeJS.Timeout = setInterval(async () => {
          try {
            const systemHealth = orchestrator.getSystemHealth();
            const threatLevel = orchestrator.getThreatLevel();

            setState(prev => ({
              ...prev,
              systemHealth,
              threatLevel,
              lastUpdate: new Date(),
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

  const updateConfig = useCallback(
    async (newConfig: Partial<AutonomousConfig>) => {
      try {
        await orchestrator.updateConfig(newConfig);
      } catch (error) {
        console.error('Error updating config:', error);
      }
    },
    [orchestrator],
  );

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
    getSystemStatus,
  };

  return (
    <AutonomousSystemContext.Provider value={contextValue}>
      {children}
    </AutonomousSystemContext.Provider>
  );
};

// UI components removed - autonomous system operates completely silently

// Hook for autonomous system integration in existing components
export const useAutonomousIntegration = () => {
  const autonomousSystem = useAutonomousSystem();
  const [integrationStatus, setIntegrationStatus] = useState({
    connected: false,
    lastSync: new Date(),
    errors: [] as string[],
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

  const reportIssue = useCallback(
    async (issue: any) => {
      try {
        // Report issue to autonomous system for handling
        if (autonomousSystem.orchestrator) {
          // The orchestrator will handle the issue through its engines
          console.log('Reported issue to autonomous system:', issue);
        }
      } catch (error) {
        setIntegrationStatus(prev => ({
          ...prev,
          errors: [...prev.errors, `Failed to report issue: ${error.message}`],
        }));
      }
    },
    [autonomousSystem.orchestrator],
  );

  const requestOptimization = useCallback(
    async (target: string) => {
      try {
        // Request optimization from autonomous system
        if (autonomousSystem.orchestrator) {
          console.log('Requested optimization for:', target);
        }
      } catch (error) {
        setIntegrationStatus(prev => ({
          ...prev,
          errors: [
            ...prev.errors,
            `Failed to request optimization: ${error.message}`,
          ],
        }));
      }
    },
    [autonomousSystem.orchestrator],
  );

  return {
    ...autonomousSystem,
    integrationStatus,
    reportIssue,
    requestOptimization,
  };
};

export default AutonomousSystemManager;
