/**
 * KONIVRER Phase Indicator Component
 * 
 * Shows the current game phase with visual indicators:
 * - Start Phase
 * - Main Phase  
 * - Combat Phase
 * - Post-Combat Main Phase
 * - Refresh Phase
 */

import { motion } from 'framer-motion';
import { 
  Play, 
  Sword, 
  Shield, 
  RotateCcw, 
  Clock,
  Circle
} from 'lucide-react';

const KonivrERPhaseIndicator = ({ currentPhase, isPlayerTurn }) => {
  const phases = [
    { 
      id: 'start', 
      name: 'Start', 
      icon: Play, 
      color: 'text-green-400',
      bg: 'bg-green-900/30',
      description: 'Draw cards and generate Azoth'
    },
    { 
      id: 'main', 
      name: 'Main', 
      icon: Circle, 
      color: 'text-blue-400',
      bg: 'bg-blue-900/30',
      description: 'Play cards and activate abilities'
    },
    { 
      id: 'combat', 
      name: 'Combat', 
      icon: Sword, 
      color: 'text-red-400',
      bg: 'bg-red-900/30',
      description: 'Declare attackers and blockers'
    },
    { 
      id: 'postCombat', 
      name: 'Post-Combat', 
      icon: Shield, 
      color: 'text-purple-400',
      bg: 'bg-purple-900/30',
      description: 'Play additional cards after combat'
    },
    { 
      id: 'refresh', 
      name: 'Refresh', 
      icon: RotateCcw, 
      color: 'text-yellow-400',
      bg: 'bg-yellow-900/30',
      description: 'Refresh Azoth and end turn'
    }
  ];

  const currentPhaseIndex = phases.findIndex(phase => phase.id === currentPhase);
  const currentPhaseData = phases[currentPhaseIndex] || phases[0];

  return (
    <div className="flex items-center gap-4">
      {/* Phase Timeline */}
      <div className="flex items-center gap-2">
        {phases.map((phase, index) => {
          const IconComponent = phase.icon;
          const isActive = phase.id === currentPhase;
          const isPast = index < currentPhaseIndex;
          const isFuture = index > currentPhaseIndex;
          
          return (
            <div key={phase.id} className="flex items-center">
              {/* Phase Circle */}
              <motion.div
                className={`
                  relative w-8 h-8 rounded-full border-2 flex items-center justify-center
                  ${isActive 
                    ? `${phase.bg} border-white shadow-lg` 
                    : isPast 
                      ? 'bg-gray-700 border-gray-500' 
                      : 'bg-gray-800 border-gray-600'
                  }
                `}
                animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <IconComponent 
                  className={`w-4 h-4 ${
                    isActive 
                      ? phase.color 
                      : isPast 
                        ? 'text-gray-400' 
                        : 'text-gray-600'
                  }`} 
                />
                
                {/* Active Phase Glow */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 rounded-full ${phase.bg} opacity-50`}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              
              {/* Connection Line */}
              {index < phases.length - 1 && (
                <div 
                  className={`w-6 h-0.5 mx-1 ${
                    isPast ? 'bg-gray-500' : 'bg-gray-700'
                  }`} 
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Phase Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${currentPhaseData.color}`}>
            {currentPhaseData.name} Phase
          </span>
          {!isPlayerTurn && (
            <span className="text-xs text-gray-400">(Opponent)</span>
          )}
        </div>
        <div className="text-xs text-gray-400">
          {currentPhaseData.description}
        </div>
      </div>

      {/* Turn Timer (if applicable) */}
      <div className="flex items-center gap-1 text-gray-400">
        <Clock className="w-4 h-4" />
        <span className="text-sm">∞</span>
      </div>
    </div>
  );
};

export default KonivrERPhaseIndicator;