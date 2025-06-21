import { motion } from 'framer-motion';
import { Sunrise, Sun, Swords, Moon, ArrowRight } from 'lucide-react';

/**
 * Displays the current game phase and active player
 * Enhanced to be more like MTG Arena
 */
const PhaseIndicator = ({
  currentPhase,
  activePlayer,
  playerName,
  opponentName,
}) => {
  // Define phases and their display names and icons
  const phases = [
    {
      id: 'untap',
      name: 'Untap',
      icon: Sunrise,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'upkeep',
      name: 'Upkeep',
      icon: Sun,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 'draw',
      name: 'Draw',
      icon: ArrowRight,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'main',
      name: 'Main',
      icon: Sun,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'combat',
      name: 'Combat',
      icon: Swords,
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'end',
      name: 'End',
      icon: Moon,
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  // Find the current phase index
  const currentPhaseIndex = phases.findIndex(
    phase => phase.id === currentPhase,
  );

  // Get active player name
  const activeName =
    activePlayer === 0 ? playerName || 'You' : opponentName || 'Opponent';

  // Get turn number (simulated)
  const turnNumber = Math.floor(Math.random() * 10) + 1; // This would normally come from game state

  return (
    <div className="flex flex-col items-center">
      <div className="text-white text-xs mb-1 font-medium flex items-center">
        <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs px-2 py-0.5 rounded-full mr-2">
          Turn {turnNumber}
        </span>
        <span className="text-white">{activeName}'s Turn</span>
      </div>

      {/* MTG Arena style phase indicator */}
      <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-full p-1 shadow-lg">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const isActive = currentPhaseIndex === index;
          const isPast = index < currentPhaseIndex;
          const isFuture = index > currentPhaseIndex;

          return (
            <motion.div
              key={phase.id}
              animate={{
                scale: isActive ? 1.1 : 1,
                opacity: isActive ? 1 : isPast ? 0.7 : 0.4,
              }}
              className={`relative mx-0.5 ${isActive ? 'z-10' : 'z-0'}`}
            >
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isActive
                    ? `bg-gradient-to-br ${phase.color} shadow-lg`
                    : isPast
                      ? 'bg-gray-600'
                      : 'bg-gray-800'
                }`}
                animate={{
                  boxShadow: isActive
                    ? '0 0 8px rgba(255,255,255,0.5)'
                    : 'none',
                }}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-300'}`}
                />
              </motion.div>

              {/* Phase name tooltip on hover */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                  {phase.name}
                </div>
              </div>

              {/* Active phase indicator */}
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseIndicator;
