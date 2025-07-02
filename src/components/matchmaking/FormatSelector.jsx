/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Swords, Crown, Target } from 'lucide-react';

const FormatSelector = ({ 
  selectedFormat, 
  onChange,
  showDescriptions = true
}) => {
  const formats = [
    { 
      id: 'standard', 
      name: 'Standard', 
      description: 'Current rotation cards only', 
      icon: <Shield className="w-4 h-4" />,
      color: 'from-blue-500 to-blue-700'
    },
    { 
      id: 'extended', 
      name: 'Extended', 
      description: 'Last 2 years of cards', 
      icon: <Swords className="w-4 h-4" />,
      color: 'from-green-500 to-green-700'
    },
    { 
      id: 'legacy', 
      name: 'Legacy', 
      description: 'All cards allowed', 
      icon: <Crown className="w-4 h-4" />,
      color: 'from-purple-500 to-purple-700'
    },
    { 
      id: 'draft', 
      name: 'Draft', 
      description: 'Pick cards during match', 
      icon: <Target className="w-4 h-4" />,
      color: 'from-amber-500 to-amber-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {formats.map((format) => (
        <motion.button
          key={format.id}
          onClick={() => onChange(format.id)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedFormat === format.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${format.color} flex items-center justify-center text-white`}>
              {format.icon}
            </div>
            <span className="font-medium text-gray-900">{format.name}</span>
          </div>
          {showDescriptions && (
            <p className="text-sm text-gray-600 text-left">{format.description}</p>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default FormatSelector;