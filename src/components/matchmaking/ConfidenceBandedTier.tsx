/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, AlertCircle, Zap, CheckCircle } from 'lucide-react';

/**
 * Confidence-Banded Tier Component
 * Displays a player's tier and confidence band with visual indicators
 */
interface ConfidenceBandedTierProps {
  tier
  confidenceBand
  lp = 0;
  showProgress = true;
  size = 'md';
  showDetails = true;
  animate = true;
}

const ConfidenceBandedTier: React.FC<ConfidenceBandedTierProps> = ({ 
  tier,
  confidenceBand,
  lp = 0,
  showProgress = true,
  size = 'md',
  showDetails = true,
  animate = true,
 }) => {
  // Get tier information
  const getTierInfo = tierKey => {
    const tiers = {
      bronze: {
        name: 'Bronze',
        color: '#CD7F32',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
      },
      silver: {
        name: 'Silver',
        color: '#C0C0C0',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
      },
      gold: {
        name: 'Gold',
        color: '#FFD700',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      },
      platinum: {
        name: 'Platinum',
        color: '#E5E4E2',
        bgColor: 'bg-cyan-50',
        textColor: 'text-cyan-800',
      },
      diamond: {
        name: 'Diamond',
        color: '#B9F2FF',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
      },
      master: {
        name: 'Master',
        color: '#FF6B6B',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
      },
      grandmaster: {
        name: 'Grandmaster',
        color: '#4ECDC4',
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-800',
      },
      mythic: {
        name: 'Mythic',
        color: '#9B59B6',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
      },
    };

    return tiers[tierKey] || tiers.bronze;
  };

  // Get confidence band information
  const getBandInfo = bandKey => {
    const bands = {
      uncertain: {
        name: 'Uncertain',
        icon: <AlertCircle className="w-4 h-4" />,
        color: 'text-gray-500',
        description: 'Your rating is still being determined',
      },
      developing: {
        name: 'Developing',
        icon: <Zap className="w-4 h-4" />,
        color: 'text-blue-500',
        description: 'Your rating is becoming more accurate',
      },
      established: {
        name: 'Established',
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-green-500',
        description: 'Your rating is well-established',
      },
      proven: {
        name: 'Proven',
        icon: <Star className="w-4 h-4" />,
        color: 'text-yellow-500',
        description: 'Your rating is highly accurate',
      },
    };

    return bands[bandKey] || bands.uncertain;
  };

  const tierInfo = getTierInfo(tier);
  const bandInfo = getBandInfo(confidenceBand);

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'text-xs',
      shield: 'w-8 h-8',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'text-sm',
      shield: 'w-12 h-12',
      icon: 'w-4 h-4',
    },
    lg: {
      container: 'text-base',
      shield: 'w-16 h-16',
      icon: 'w-5 h-5',
    },
  };

  const classes = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`confidence-banded-tier ${classes.container}`}></div>
      <div className="flex items-center"></div>
        {/* Tier Shield */}
        <div className="relative mr-3"></div>
          <div
            className={`${classes.shield} ${tierInfo.bgColor} rounded-full flex items-center justify-center`}
            style={{
              boxShadow: `0 0 0 2px ${tierInfo.color}`,
              background: `linear-gradient(135deg, ${tierInfo.color}20, ${tierInfo.color}60)`,
            }}
          ></div>
            <Shield className={`${tierInfo.textColor} ${classes.shield}`} /></Shield>
            {/* Confidence Band Indicator */}
            <div
              className={`absolute bottom-0 right-0 rounded-full p-0.5 bg-white ${bandInfo.color}`}
            ></div>
              {bandInfo.icon}
            </div>
          </div>
        </div>

        {/* Tier Information */}
        <div></div>
          <div className="flex items-center"></div>
            <span className="font-bold" style={{ color: tierInfo.color }}></span>
              {tierInfo.name}
            </span>
            {showDetails && (
              <span className={`ml-1.5 ${bandInfo.color}`}></span>
                {bandInfo.name}
              </span>
            )}
          </div>

          {showDetails && (
            <div className="text-xs text-gray-600">{bandInfo.description}</div>
          )}
          {/* LP Progress */}
          {showProgress && (
            <div className="mt-1 w-full max-w-[150px]"></div>
              <div className="flex justify-between text-xs text-gray-500 mb-0.5"></div>
                <span>LP: {lp}</span>
                <span>100</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden"></div>
                {animate ? (
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: tierInfo.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${lp}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  ></motion.div>
                ) : (
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: tierInfo.color,
                      width: `${lp}%`,
                    }}
                  ></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfidenceBandedTier;