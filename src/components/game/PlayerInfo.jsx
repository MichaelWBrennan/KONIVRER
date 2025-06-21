import { motion } from 'framer-motion';
import { User, Heart, Zap } from 'lucide-react';

/**
 * Displays player information including avatar, name, and resources
 */
const PlayerInfo = ({ player, gameState, isOpponent }) => {
  if (!gameState) return null;

  const { lifeCards, azoth } = gameState;
  const playerName = player?.name || (isOpponent ? 'Opponent' : 'You');
  const avatarUrl = player?.avatarUrl;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-black/50 backdrop-blur-sm rounded-lg p-2 flex items-center space-x-3"
    >
      {/* Player Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={playerName}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-gray-400" />
        )}
      </div>

      {/* Player Info */}
      <div>
        <div className="text-white font-medium text-sm">{playerName}</div>

        {/* Resources */}
        <div className="flex items-center space-x-2 mt-1">
          {/* Life */}
          <div className="flex items-center space-x-1 bg-red-900/50 rounded-full px-2 py-0.5">
            <Heart className="w-3 h-3 text-red-400" />
            <span className="text-white text-xs">{lifeCards.length}</span>
          </div>

          {/* Azoth */}
          <div className="flex items-center space-x-1 bg-yellow-900/50 rounded-full px-2 py-0.5">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-white text-xs">{azoth}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerInfo;
