import { motion } from 'framer-motion';

/**
 * Displays the current game phase and active player
 */
const PhaseIndicator = ({ currentPhase, activePlayer, playerName, opponentName }) => {
  // Define phases and their display names
  const phases = [
    { id: 'draw', name: 'Draw Phase' },
    { id: 'main', name: 'Main Phase' },
    { id: 'combat', name: 'Combat Phase' },
    { id: 'end', name: 'End Phase' }
  ];
  
  // Find the current phase index
  const currentPhaseIndex = phases.findIndex(phase => phase.id === currentPhase);
  
  // Get active player name
  const activeName = activePlayer === 0 ? playerName || 'You' : opponentName || 'Opponent';
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-white text-xs mb-1">
        {activeName}'s Turn
      </div>
      <div className="flex items-center space-x-1">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            animate={{
              scale: currentPhaseIndex === index ? 1.1 : 1,
              backgroundColor: currentPhaseIndex === index ? 'rgba(147, 51, 234, 0.7)' : 'rgba(75, 85, 99, 0.7)'
            }}
            className={`px-2 py-1 rounded-lg text-xs font-medium text-white`}
          >
            {phase.name}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhaseIndicator;