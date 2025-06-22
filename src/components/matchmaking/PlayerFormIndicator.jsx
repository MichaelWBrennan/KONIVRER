import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Snowflake, 
  ArrowRight, 
  HelpCircle,
  BarChart
} from 'lucide-react';

/**
 * Player Form Indicator Component
 * Displays a visual representation of a player's current form and momentum
 */
const PlayerFormIndicator = ({ 
  trend = 'neutral',
  momentum = 0,
  recentForm = 0,
  streakFactor = 0,
  showDetails = false,
  size = 'md'
}) => {
  // Get icon based on trend
  const getIcon = () => {
    switch (trend) {
      case 'strong_upward':
        return <Flame className="text-red-500" />;
      case 'upward':
        return <TrendingUp className="text-green-500" />;
      case 'strong_downward':
        return <Snowflake className="text-blue-500" />;
      case 'downward':
        return <TrendingDown className="text-orange-500" />;
      case 'neutral':
        return <ArrowRight className="text-gray-500" />;
      default:
        return <HelpCircle className="text-gray-400" />;
    }
  };
  
  // Get description based on trend
  const getDescription = () => {
    switch (trend) {
      case 'strong_upward':
        return 'On fire! Performing exceptionally well';
      case 'upward':
        return 'Improving performance';
      case 'strong_downward':
        return 'In a slump';
      case 'downward':
        return 'Performance declining';
      case 'neutral':
        return 'Stable performance';
      default:
        return 'Not enough data';
    }
  };
  
  // Get color based on trend
  const getColor = () => {
    switch (trend) {
      case 'strong_upward':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'upward':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'strong_downward':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'downward':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: {
      container: 'text-xs px-1.5 py-0.5',
      icon: 'w-3 h-3',
      chart: 'w-16 h-6'
    },
    md: {
      container: 'text-sm px-2 py-1',
      icon: 'w-4 h-4',
      chart: 'w-24 h-8'
    },
    lg: {
      container: 'text-base px-3 py-1.5',
      icon: 'w-5 h-5',
      chart: 'w-32 h-10'
    }
  };
  
  const classes = sizeClasses[size] || sizeClasses.md;
  
  // Format momentum value for display
  const formatMomentum = (value) => {
    if (value > 0) return `+${(value * 100).toFixed(0)}%`;
    if (value < 0) return `${(value * 100).toFixed(0)}%`;
    return '0%';
  };
  
  return (
    <div className="player-form-indicator">
      <div className={`inline-flex items-center rounded-full border ${getColor()} ${classes.container}`}>
        <span className={`mr-1 ${classes.icon}`}>{getIcon()}</span>
        <span className="font-medium">{getDescription()}</span>
      </div>
      
      {showDetails && (
        <motion.div 
          className="mt-2 bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Momentum</span>
            <span className={`text-sm font-medium ${momentum > 0 ? 'text-green-600' : momentum < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {formatMomentum(momentum)}
            </span>
          </div>
          
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 bottom-0 left-1/2 ${momentum > 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ 
                width: `${Math.abs(momentum) * 100}%`, 
                transform: momentum > 0 ? 'translateX(0)' : 'translateX(-100%)' 
              }}
            ></div>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="text-xs">
              <div className="text-gray-500">Recent Form</div>
              <div className="font-medium">
                {recentForm > 0.3 ? 'Strong' : recentForm > 0 ? 'Positive' : 
                 recentForm < -0.3 ? 'Poor' : recentForm < 0 ? 'Negative' : 'Neutral'}
              </div>
            </div>
            <div className="text-xs">
              <div className="text-gray-500">Streak</div>
              <div className="font-medium">
                {streakFactor > 0.7 ? 'Exceptional' : streakFactor > 0.4 ? 'Notable' : 
                 streakFactor > 0.2 ? 'Modest' : 'None'}
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Performance Trend</span>
              <BarChart className="w-3 h-3" />
            </div>
            <div className={`${classes.chart} bg-gray-100 rounded-md overflow-hidden relative`}>
              {/* Simple performance visualization */}
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path
                    d={`M0,20 
                       Q25,${20 - momentum * 10} 50,${20 - momentum * 20} 
                       T100,${20 - momentum * 30}`}
                    fill="none"
                    stroke={momentum > 0 ? "#10B981" : momentum < 0 ? "#EF4444" : "#9CA3AF"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PlayerFormIndicator;