import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, UserPlus, Clock, X, UserMinus, UserCheck, Gamepad, Search } from 'lucide-react';

const FriendsList = ({ 
  friends, 
  onViewAll, 
  onMessage, 
  onInvite, 
  onRemove,
  maxItems = 5, 
  showViewAll = true,
  showSearch = true,
  showActions = true
}) => {
  const formatTimeAgo = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHour > 0) return `${diffHour}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  if (!friends || friends.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No friends yet.</p>
        <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
          Find Friends
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {showSearch && (
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search friends..."
          />
        </div>
      )}
      
      {friends.slice(0, maxItems).map(friend => (
        <motion.div 
          key={friend.id} 
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
          whileHover={{ x: 2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-medium text-gray-700">
                {friend.name[0]}
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(friend.status)} rounded-full border-2 border-white`}></div>
            </div>
            <div>
              <div className="font-medium text-gray-900">{friend.name}</div>
              <div className="text-xs text-gray-500 flex items-center space-x-1">
                {friend.status === 'online' && friend.activity ? (
                  <>
                    <Gamepad className="w-3 h-3" />
                    <span>{friend.activity}</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    <span>Last seen {formatTimeAgo(friend.lastSeen)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="flex space-x-2">
              <motion.button 
                onClick={() => onMessage && onMessage(friend)}
                className="text-blue-600 hover:text-blue-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle className="w-4 h-4" />
              </motion.button>
              {friend.status === 'online' ? (
                <motion.button 
                  onClick={() => onInvite && onInvite(friend)}
                  className="text-green-600 hover:text-green-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <UserPlus className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button 
                  onClick={() => onRemove && onRemove(friend)}
                  className="text-red-600 hover:text-red-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <UserMinus className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      ))}
      
      {showViewAll && friends.length > maxItems && (
        <motion.button
          onClick={onViewAll}
          className="w-full py-2 text-center text-blue-600 hover:text-blue-700 font-medium text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
        >
          View All Friends
        </motion.button>
      )}
    </div>
  );
};

export default FriendsList;