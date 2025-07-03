/**
 * Generic Cost Selector Component
 * 
 * Allows players to choose how much generic cost to pay when playing an Elemental card.
 * The power of the Elemental equals the generic cost paid.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Circle, Star } from 'lucide-react';

const GenericCostSelector = ({
  card,
  minCost = 0,
  maxCost = 10,
  onCostSelected,
  onCancel,
  isVisible = false
}) => {
  const [selectedCost, setSelectedCost] = useState(card.genericCost || 1);

  const handleCostChange = (delta) => {
    const newCost = Math.max(minCost, Math.min(maxCost, selectedCost + delta));
    setSelectedCost(newCost);
  };

  const handleConfirm = () => {
    onCostSelected(selectedCost);
  };

  const calculatePower = () => {
    return (card.basePower || 0) + selectedCost;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-600 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          Choose Generic Cost
        </h3>
        
        <div className="text-center mb-6">
          <div className="text-lg text-gray-300 mb-2">
            Playing: <span className="text-yellow-400 font-bold">{card.name}</span>
          </div>
          <div className="text-sm text-gray-400">
            Power equals generic cost paid
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => handleCostChange(-1)}
            disabled={selectedCost <= minCost}
            className="p-2 rounded bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-center gap-2 bg-gray-700 rounded px-4 py-2">
            <Circle className="w-5 h-5 text-gray-400" />
            <span className="text-2xl font-bold text-white min-w-[2rem] text-center">
              {selectedCost}
            </span>
          </div>

          <button
            onClick={() => handleCostChange(1)}
            disabled={selectedCost >= maxCost}
            className="p-2 rounded bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-lg">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white">
              Power: <span className="font-bold text-yellow-400">{calculatePower()}</span>
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-0 whitespace-nowrap px-4 rounded bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-0 whitespace-nowrap px-4 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Play Card
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          Minimum: {minCost} • Maximum: {maxCost}
        </div>
      </div>
    </motion.div>
  );
};

export default GenericCostSelector;