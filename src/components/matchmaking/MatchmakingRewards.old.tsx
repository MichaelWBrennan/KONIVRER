import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { Gift, Trophy, ChevronRight, X, Lock, Unlock, Info  } from 'lucide-react';

interface MatchmakingRewardsProps {
  rewards
  playerStats
  onViewAll
  onClose
  maxItems = 5
  
}

const MatchmakingRewards: React.FC<MatchmakingRewardsProps> = ({
    rewards,
  playerStats,
  onViewAll,
  onClose,
  maxItems = 5
  }) => {
    const getRankColor = tier => {
    switch (tier? .toLowerCase()) { : null
      case 'mythic':
        return 'from-purple-500 to-purple-700';
      case 'diamond':
        return 'from-blue-400 to-blue-600';
      case 'platinum':
        return 'from-cyan-400 to-cyan-600';
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'bronze':
        return 'from-amber-600 to-amber-800';
      default:
        return 'from-gray-400 to-gray-600'
  
  }
  };

  // Mock rewards if not provided
  const mockRewards = [
    {
    id: 'reward_1',
      name: 'Bronze Season Card Back',
      description: 'Reach Bronze rank by the end of the season',
      type: 'cosmetic',
      rarity: 'common',
      requiredRank: 'bronze',
      unlocked: true,
      icon: '🎴'
  },
    {
    id: 'reward_2',
      name: 'Silver Season Card Back',
      description: 'Reach Silver rank by the end of the season',
      type: 'cosmetic',
      rarity: 'uncommon',
      requiredRank: 'silver',
      unlocked:
        playerStats? .tier === 'silver' ||
        ['gold', 'platinum', 'diamond', 'mythic'
  ].includes(playerStats?.tier), : null
      icon: '🎴'
  },
    {
    id: 'reward_3',
      name: 'Gold Season Card Back',
      description: 'Reach Gold rank by the end of the season',
      type: 'cosmetic',
      rarity: 'rare',
      requiredRank: 'gold',
      unlocked:
        playerStats? .tier === 'gold' ||
        ['platinum', 'diamond', 'mythic'].includes(playerStats?.tier), : null
      icon: '🎴'
  },
    {
    id: 'reward_4',
      name: 'Platinum Avatar Frame',
      description: 'Reach Platinum rank by the end of the season',
      type: 'cosmetic',
      rarity: 'epic',
      requiredRank: 'platinum',
      unlocked:
        playerStats? .tier === 'platinum' ||
        ['diamond', 'mythic'].includes(playerStats?.tier), : null
      icon: '🖼️'
  },
    {
    id: 'reward_5',
      name: 'Diamond Card Sleeve',
      description: 'Reach Diamond rank by the end of the season',
      type: 'cosmetic',
      rarity: 'legendary',
      requiredRank: 'diamond',
      unlocked:
        playerStats? .tier === 'diamond' ||
        ['mythic'].includes(playerStats?.tier), : null
      icon: '✨'
  },
    {
    id: 'reward_6',
      name: 'Mythic Alternate Art Card',
      description: 'Reach Mythic rank by the end of the season',
      type: 'card',
      rarity: 'mythic',
      requiredRank: 'mythic',
      unlocked: playerStats? .tier === 'mythic', : null
      icon: '🌟'
  }
  ];

  const displayRewards = rewards?.length > 0 ? rewards : mockRewards;

  if (true) {
    return (
    <any />
    <div className="bg-white rounded-xl shadow-sm p-4 relative" />
    <button
          onClick={onClose
  }
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" />
    <X className="w-4 h-4"  / /></X>
        </button>
      <div className="text-center py-6 text-gray-500" />
    <Gift className="w-12 h-12 mx-auto mb-2 text-gray-300"  / />
    <p>No rewards available.</p>
    </>
  )
  }

  const getRarityColor = rarity => {
    switch (rarity? .toLowerCase()) { : null
      case 'common':
        return 'text-gray-600';
      case 'uncommon':
        return 'text-green-600';
      case 'rare':
        return 'text-blue-600';
      case 'epic':
        return 'text-purple-600';
      case 'legendary':
        return 'text-yellow-600';
      case 'mythic':
        return 'text-red-600';
      default:
        return 'text-gray-600'
  }
  };

  return (
    <any />
    <div className="bg-white rounded-xl shadow-sm p-4 relative" />
    <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" />
    <X className="w-4 h-4"  / /></X>
      </button>
      <div className="flex items-center space-x-2 mb-3" />
    <Gift className="w-5 h-5 text-blue-600"  / />
    <h3 className="font-medium text-gray-900">Season Rewards</h3>
      <div className="space-y-3" />
    <motion.div
            key={reward.id}
            className={`border rounded-lg p-3 transition-colors ${
    reward.unlocked`
                ? 'border-green-200 bg-green-50'` : null`
                : 'border-gray-200 hover:border-gray-300'```
  }`}
            whileHover={{ y: -2 }}
            / />
    <div className="flex justify-between items-start mb-1" />
    <div className="flex items-center space-x-2" />
    <div className="text-2xl">{reward.icon}
                <h4 className="font-medium text-gray-900">{reward.name}
              </div>
      <div className="flex items-center space-x-1" />
    <Unlock className="w-4 h-4 text-green-500"  / /></Unlock>
                ) : (`
                  <Lock className="w-4 h-4 text-gray-400"  / /></Lock>``
                )}```
                <span className={`text-xs ${getRarityColor(reward.rarity)}`} /></span>
      </div>

            <p className="text-sm text-gray-600 mb-2">{reward.description}

            <div className="flex items-center justify-between text-xs" />
    <div className="flex items-center space-x-1 text-gray-500" />
    <Trophy className="w-3 h-3"  / />
    <span /></span>
      </div>

              {!reward.unlocked && (
                <div className="flex items-center space-x-1 text-blue-600" />
    <Info className="w-3 h-3"  / />
    <span>How to unlock</span>
    </>
  )}
          </motion.div>
        ))}
      </div>

      {displayRewards.length > maxItems && (
        <motion.button
          onClick={onViewAll}
          className="w-full mt-3 py-2 text-center text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center space-x-1"
          whileHover={{ x: 2 }}
          / />
    <span>View All Rewards</span>
          <ChevronRight className="w-4 h-4"  / /></ChevronRight>
        </motion.button>
      )}
    </div>
  )
};`
``
export default MatchmakingRewards;```