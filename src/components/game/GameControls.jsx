import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  SkipForward, 
  Sword, 
  Shield, 
  Zap, 
  Hand, 
  Flag, 
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

/**
 * Game controls component that provides action buttons based on game state
 */
const GameControls = ({
  gameState,
  selectedCard,
  targetMode,
  targets,
  onAction,
  isSpectator = false
}) => {
  const [expanded, setExpanded] = useState(true);
  
  // If in spectator mode, show minimal controls
  if (isSpectator) {
    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg p-2 z-10">
        <div className="text-white text-sm">Spectator Mode</div>
      </div>
    );
  }
  
  // If target mode is active, don't show regular controls
  if (targetMode) {
    return null;
  }
  
  // Determine available actions based on game state and selected card
  const canPlayCard = selectedCard && gameState.phase === 'main' && gameState.activePlayer === 0;
  const canAttack = selectedCard && gameState.phase === 'combat' && gameState.activePlayer === 0;
  const canBlock = selectedCard && gameState.phase === 'combat' && gameState.activePlayer === 1;
  const canActivateAbility = selectedCard && selectedCard.abilities && selectedCard.abilities.length > 0;
  const canNextPhase = gameState.activePlayer === 0;
  const canPassPriority = true;
  
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: expanded ? 0 : 60 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-t-lg p-2 z-10"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black/70 backdrop-blur-sm rounded-t-lg p-1"
      >
        {expanded ? (
          <ChevronDown className="w-5 h-5 text-white" />
        ) : (
          <ChevronUp className="w-5 h-5 text-white" />
        )}
      </button>
      
      <div className="flex items-center space-x-2">
        {/* Play Card */}
        <button
          onClick={() => canPlayCard && onAction('playCard')}
          disabled={!canPlayCard}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
            canPlayCard ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 opacity-50 cursor-not-allowed'
          }`}
        >
          <Play className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Play</span>
        </button>
        
        {/* Attack */}
        <button
          onClick={() => canAttack && onAction('attack')}
          disabled={!canAttack}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
            canAttack ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 opacity-50 cursor-not-allowed'
          }`}
        >
          <Sword className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Attack</span>
        </button>
        
        {/* Block */}
        <button
          onClick={() => canBlock && onAction('block')}
          disabled={!canBlock}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
            canBlock ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 opacity-50 cursor-not-allowed'
          }`}
        >
          <Shield className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Block</span>
        </button>
        
        {/* Activate Ability */}
        <button
          onClick={() => canActivateAbility && onAction('activateAbility', { abilityIndex: 0 })}
          disabled={!canActivateAbility}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
            canActivateAbility ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 opacity-50 cursor-not-allowed'
          }`}
        >
          <Zap className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Ability</span>
        </button>
        
        {/* Next Phase */}
        <button
          onClick={() => canNextPhase && onAction('nextPhase')}
          disabled={!canNextPhase}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
            canNextPhase ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 opacity-50 cursor-not-allowed'
          }`}
        >
          <SkipForward className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Next Phase</span>
        </button>
        
        {/* Pass Priority */}
        <button
          onClick={() => canPassPriority && onAction('passPriority')}
          disabled={!canPassPriority}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
            canPassPriority ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-700 opacity-50 cursor-not-allowed'
          }`}
        >
          <Hand className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Pass</span>
        </button>
        
        {/* Concede */}
        <button
          onClick={() => onAction('concede')}
          className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-red-800 hover:bg-red-900"
        >
          <Flag className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Concede</span>
        </button>
      </div>
    </motion.div>
  );
};

export default GameControls;