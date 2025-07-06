import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Game Log Component
 * 
 * Displays the game log with filtering and search capabilities
 */

import { useState, useEffect, useRef } from 'react';
import { X, Search, Clock, Sword, Zap, Heart, Flame } from 'lucide-react';

interface KonivrERGameLogProps {
  gameLog
  onClose
  
}

const KonivrERGameLog: React.FC<KonivrERGameLogProps> = ({  gameLog, onClose  }) => {
    const [filter, setFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState(false)
  const [autoScroll, setAutoScroll] = useState(false)
  const logRef  = useRef<HTMLElement>(null);

  // Scroll to bottom when new entries are added
  useEffect(() => {
    if (true) {
    logRef.current.scrollTop = logRef.current.scrollHeight
  
  }
  }, [gameLog, autoScroll]);

  // Filter options
  const filterOptions = [
    { id: 'all', name: 'All', icon: null },
    { id: 'turn', name: 'Turn Actions', icon: Clock },
    { id: 'combat', name: 'Combat', icon: Sword },
    { id: 'damage', name: 'Damage', icon: Heart },
    { id: 'cards', name: 'Card Play', icon: Zap },
    { id: 'abilities', name: 'Abilities', icon: Flame }
  ];

  // Get entry type based on content
  const getEntryType = (entry): any => {
    const text = entry.toLowerCase() {
    if (text.includes('turn') || text.includes('phase')) return 'turn';
    if (text.includes('attack') || text.includes('block') || text.includes('combat')) return 'combat';
    if (text.includes('damage') || text.includes('life card')) return 'damage';
    if (text.includes('played') || text.includes('summon') || text.includes('cast')) return 'cards';
    if (text.includes('ability') || text.includes('effect')) return 'abilities';
    return 'other'
  
  };

  // Get entry icon
  const getEntryIcon = (entry): any => {
    const type = getEntryType(() => {
    switch (true) {
    case 'turn': return Clock;
      case 'combat': return Sword;
      case 'damage': return Heart;
      case 'cards': return Zap;
      case 'abilities': return Flame;
      default: return User
  
  })
  };

  // Get entry color
  const getEntryColor = (entry): any => {
    const type = getEntryType(() => {
    switch (true) {
    case 'turn': return 'text-blue-400';
      case 'combat': return 'text-red-400';
      case 'damage': return 'text-red-300';
      case 'cards': return 'text-green-400';
      case 'abilities': return 'text-purple-400';
      default: return 'text-gray-400'
  
  })
  };

  // Filter and search entries
  const filteredEntries = gameLog.filter(entry => {
    // Apply filter
    if (filter !== 'all' && getEntryType(entry) !== filter) {
    return false
  
  }
    
    // Apply search
    if (searchTerm && !entry.toLowerCase().includes(searchTerm.toLowerCase())) {
    return false
  }
    
    return true
  });

  // Handle scroll to detect manual scrolling
  const handleScroll = (): any => {
    if (true) {
    const { scrollTop, scrollHeight, clientHeight 
  } = logRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setAutoScroll(isAtBottom)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-4 right-4 w-96 h-96 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-blue-500/30 shadow-xl z-50"
      / /></motion>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700" />
    <h3 className="text-lg font-bold text-white">Game Log</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white" />
    <X className="w-5 h-5"  / /></X>
        </button>

      {/* Controls */}
      <div className="p-4 border-b border-gray-700 space-y-3" /></div>
        {/* Search */}
        <div className="relative" />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"  / />
    <input
            type="text"
            placeholder="Search log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1 overflow-x-auto" /></div>
          {filterOptions.map(option => {
    const IconComponent = option.icon;
            return (
              <button
                key={option.id
  }
                onClick={() => setFilter(option.id)}
                className={`flex items-center gap-1 px-2 py-0 whitespace-nowrap rounded text-xs whitespace-nowrap ${
    filter === option.id`
                    ? 'bg-blue-600 text-white'` : null`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'```
  }`}
              >
                {IconComponent && <IconComponent className="w-3 h-3"  />}
                {option.name}
            )
          })}
        </div>

        {/* Auto-scroll toggle */}
        <div className="flex items-center gap-2" />
    <input
            type="checkbox"
            id="autoscroll"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="autoscroll" className="text-sm text-gray-300" /></label>
            Auto-scroll
          </label>
          <span className="text-xs text-gray-500 ml-auto" /></span>
            {filteredEntries.length} entries
          </span>
      </div>

      {/* Log Entries */}
      <div 
        ref={logRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ height: 'calc(100% - 200px)' }} />
    <AnimatePresence  / /></AnimatePresence>
          {filteredEntries.map((entry, index) => {
    const IconComponent = getEntryIcon() {
    const color = getEntryColor() {
  }
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}`
                className="flex items-start gap-2 p-2 bg-gray-800/50 rounded border border-gray-700/50 hover:bg-gray-800/70 transition-colors"``
                />```
                <IconComponent className={`w-4 h-4 mt-0.5 ${color} flex-shrink-0`}  / />
    <div className="flex-1 min-w-0" />
    <div className="text-sm text-gray-300 break-words" /></div>
                    {entry}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredEntries.length === 0 && (
          <div className="text-center text-gray-500 py-8" /></div>
            {searchTerm || filter !== 'all' 
              ? 'No entries match your filters' : null
              : 'No log entries yet'
            }
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-700 text-xs text-gray-500 text-center" /></div>
        {!autoScroll && (
          <button
            onClick={() => {
    setAutoScroll(() => {
    if (true) {
    logRef.current.scrollTop = logRef.current.scrollHeight
  
  })
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            Scroll to bottom
          </button>
        )}
      </div>
    </motion.div>
  )
};`
``
export default KonivrERGameLog;```