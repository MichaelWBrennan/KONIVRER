/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBattlePass } from '../../contexts/BattlePassContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Star, 
  Crown, 
  Gift, 
  Lock, 
  Unlock, 
  Trophy, 
  Zap, 
  Calendar,
  Clock,
  Sparkles,
  Award,
  Target,
  CheckCircle,
  Circle,
  ArrowRight,
  Gem,
  Coins
} from 'lucide-react';

// Battle Pass Dashboard - Industry Standard Implementation
const BattlePassDashboard = () => {
  const battlePass = useBattlePass();
  const { user } = useAuth();
  const [selectedReward, setSelectedReward] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [claimingReward, setClaimingReward] = useState(null);

  // Auto-claim available rewards
  useEffect(() => {
    const availableRewards = battlePass.getAvailableRewards();
    if (availableRewards.length > 0) {
      // Show notification for available rewards
      console.log(`${availableRewards.length} rewards available to claim!`);
    }
  }, [battlePass.playerProgress.level]);

  const handleClaimReward = async (level, track) => {
    setClaimingReward(`${level}-${track}`);
    
    const success = battlePass.claimReward(level, track);
    
    if (success) {
      // Add visual feedback
      setTimeout(() => {
        setClaimingReward(null);
      }, 1000);
    }
  };

  const handlePurchasePremium = () => {
    battlePass.purchasePremium();
    setShowPurchaseModal(false);
  };

  const handlePurchasePremiumPlus = () => {
    battlePass.purchasePremiumPlus();
    setShowPurchaseModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {battlePass.currentSeason.name}
              </h1>
              <p className="text-gray-300">
                Season {battlePass.currentSeason.id} • {battlePass.getDaysRemaining()} days remaining
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {battlePass.playerProgress.level}
                </div>
                <div className="text-sm text-gray-300">Level</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {battlePass.playerProgress.experience}
                </div>
                <div className="text-sm text-gray-300">XP</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Level {battlePass.playerProgress.level}</span>
              <span>Level {battlePass.playerProgress.level + 1}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${battlePass.getProgressPercentage()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="text-center text-sm text-gray-300 mt-2">
              {battlePass.playerProgress.experienceToNext - battlePass.playerProgress.experience} XP to next level
            </div>
          </div>
        </div>

        {/* Pass Type Selector */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Pass */}
            <div className={`p-4 rounded-lg border-2 ${
              battlePass.playerProgress.passType === 'free' 
                ? 'border-blue-500 bg-blue-500/20' 
                : 'border-gray-600 bg-gray-800/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Free Pass</h3>
                <Circle className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Basic rewards and progression
              </p>
              <div className="text-2xl font-bold text-white">FREE</div>
            </div>

            {/* Premium Pass - Now Free */}
            <div className="p-4 rounded-lg border-2 border-yellow-500 bg-yellow-500/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Premium Pass</h3>
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Enhanced rewards + exclusive content
              </p>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-yellow-400">
                  FREE
                </div>
                <div className="text-sm text-green-400">Included</div>
              </div>
            </div>

            {/* Premium Plus Pass - Now Free */}
            <div className="p-4 rounded-lg border-2 border-purple-500 bg-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Premium+</h3>
                <Crown className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Ultimate rewards + instant unlocks
              </p>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-purple-400">
                  FREE
                </div>
                <div className="text-sm text-green-400">Included</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Track */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Rewards Track</h2>
          
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4" style={{ minWidth: '1200px' }}>
              {Array.from({ length: Math.min(20, battlePass.currentSeason.maxLevel) }, (_, i) => {
                const level = i + 1;
                const isUnlocked = level <= battlePass.playerProgress.level;
                const freeReward = battlePass.rewards.free[level - 1];
                const premiumReward = battlePass.rewards.premium[level - 1];
                const isFreeClaimed = battlePass.playerProgress.claimedRewards.includes(level);
                const isPremiumClaimed = battlePass.playerProgress.premiumClaimed.includes(level);

                return (
                  <div key={level} className="flex flex-col items-center space-y-2">
                    {/* Level Number */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isUnlocked ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-400'
                    }`}>
                      {level}
                    </div>

                    {/* Premium Reward */}
                    {premiumReward && (
                      <RewardCard
                        reward={premiumReward}
                        level={level}
                        track="premium"
                        isUnlocked={isUnlocked}
                        isClaimed={isPremiumClaimed}
                        canClaim={isUnlocked && !isPremiumClaimed && battlePass.playerProgress.passType !== 'free'}
                        onClaim={() => handleClaimReward(level, 'premium')}
                        isClaimingReward={claimingReward === `${level}-premium`}
                      />
                    )}

                    {/* Free Reward */}
                    {freeReward && (
                      <RewardCard
                        reward={freeReward}
                        level={level}
                        track="free"
                        isUnlocked={isUnlocked}
                        isClaimed={isFreeClaimed}
                        canClaim={isUnlocked && !isFreeClaimed}
                        onClaim={() => handleClaimReward(level, 'free')}
                        isClaimingReward={claimingReward === `${level}-free`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quests Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Quests */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Daily Quests
            </h3>
            <div className="space-y-3">
              {battlePass.quests.daily.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </div>

          {/* Weekly Quests */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Weekly Quests
            </h3>
            <div className="space-y-3">
              {battlePass.quests.weekly.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && (
          <PurchaseModal
            onClose={() => setShowPurchaseModal(false)}
            onPurchasePremium={handlePurchasePremium}
            onPurchasePremiumPlus={handlePurchasePremiumPlus}
            currentSeason={battlePass.currentSeason}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Reward Card Component
const RewardCard = ({ 
  reward, 
  level, 
  track, 
  isUnlocked, 
  isClaimed, 
  canClaim, 
  onClaim, 
  isClaimingReward 
}) => {
  const getRewardIcon = () => {
    switch (reward.type) {
      case 'wildcards':
        return <Star className="w-4 h-4" />;
      case 'currency':
        return reward.currency === 'gems' ? <Gem className="w-4 h-4" /> : <Coins className="w-4 h-4" />;
      case 'cosmetics':
        return <Sparkles className="w-4 h-4" />;
      case 'animations':
        return <Zap className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  const getRewardColor = () => {
    if (track === 'premium') return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-purple-500';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        relative w-16 h-20 rounded-lg border-2 cursor-pointer transition-all
        ${isUnlocked ? 'border-gray-400' : 'border-gray-600'}
        ${isClaimed ? 'bg-green-500/20 border-green-500' : `bg-gradient-to-br ${getRewardColor()}`}
        ${!isUnlocked ? 'opacity-50' : ''}
      `}
      onClick={canClaim ? onClaim : undefined}
    >
      <div className="p-2 text-white text-center">
        <div className="flex justify-center mb-1">
          {getRewardIcon()}
        </div>
        <div className="text-xs font-medium">
          {reward.amount || 1}
        </div>
      </div>

      {/* Lock/Unlock Indicator */}
      <div className="absolute top-1 right-1">
        {!isUnlocked && <Lock className="w-3 h-3 text-gray-400" />}
        {isClaimed && <CheckCircle className="w-3 h-3 text-green-400" />}
        {canClaim && <Gift className="w-3 h-3 text-yellow-400 animate-pulse" />}
      </div>

      {/* Claiming Animation */}
      <AnimatePresence>
        {isClaimingReward && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 bg-yellow-500/50 rounded-lg flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Quest Card Component
const QuestCard = ({ quest }) => {
  const progressPercentage = (quest.progress / quest.target) * 100;

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white font-medium">{quest.name}</h4>
        <div className="flex items-center text-yellow-400">
          <Star className="w-4 h-4 mr-1" />
          <span className="text-sm">{quest.experience} XP</span>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>{quest.progress} / {quest.target}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {quest.completed && (
        <div className="flex items-center text-green-400 text-sm">
          <CheckCircle className="w-4 h-4 mr-1" />
          Completed!
        </div>
      )}
    </div>
  );
};

// Purchase Modal Component
const PurchaseModal = ({ 
  onClose, 
  onPurchasePremium, 
  onPurchasePremiumPlus, 
  currentSeason 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
      >
        <h3 className="text-2xl font-bold text-white mb-4">Premium Features</h3>
        
        <div className="space-y-4">
          {/* Premium Option - Now Free */}
          <div className="border border-yellow-500 rounded-lg p-4 bg-yellow-500/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-yellow-400">Premium Pass</h4>
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <ul className="text-gray-300 text-sm space-y-1 mb-4">
              <li>• Unlock all premium rewards</li>
              <li>• Exclusive cosmetics</li>
              <li>• 2x XP boost</li>
              <li>• Priority matchmaking</li>
            </ul>
            <div className="w-full bg-green-500 text-white py-2 rounded-lg font-medium text-center">
              FREE FOR EVERYONE
            </div>
          </div>

          {/* Premium Plus Option - Now Free */}
          <div className="border border-purple-500 rounded-lg p-4 bg-purple-500/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-purple-400">Premium+ Pass</h4>
              <Crown className="w-5 h-5 text-purple-400" />
            </div>
            <ul className="text-gray-300 text-sm space-y-1 mb-4">
              <li>• Everything in Premium</li>
              <li>• Instant level 25 unlock</li>
              <li>• Exclusive legendary rewards</li>
              <li>• VIP support</li>
            </ul>
            <div className="w-full bg-green-500 text-white py-2 rounded-lg font-medium text-center">
              FREE FOR EVERYONE
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};

export default BattlePassDashboard;