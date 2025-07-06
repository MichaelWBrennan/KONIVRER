import React from 'react';
/**
 * KONIVRER Game Controls Component
 * 
 * Provides controls for all KONIVRER game actions:
 * - Card playing methods (Summon, Tribute, Azoth, Spell, Burst)
 * - Phase transitions
 * - Combat actions
 * - Azoth management
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  SkipForward, 
  Sword, 
  Shield, 
  Flame,
  Droplets,
  Mountain,
  Wind,
  Sparkles,
  Circle,
  Plus,
  Minus,
  Check,
  X,
  Zap
} from 'lucide-react';

interface KonivrERGameControlsProps {
  gameState
  selectedCard
  onAction
  onPhaseAction
  isPlayerTurn
}

const KonivrERGameControls: React.FC<KonivrERGameControlsProps> = ({ 
  gameState,
  selectedCard,
  onAction,
  onPhaseAction,
  isPlayerTurn
 }) => {
  const [showCardActions, setShowCardActions] = useState(false);
  const [azothSpent, setAzothSpent] = useState({});
  const [selectedAbility, setSelectedAbility] = useState(0);
  const [tributeTargets, setTributeTargets] = useState([]);

  // Element configurations
  const elementConfig = {
    fire: { icon: Flame, color: 'text-red-400', bg: 'bg-red-900/30' },
    water: { icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-900/30' },
    earth: { icon: Mountain, color: 'text-green-400', bg: 'bg-green-900/30' },
    air: { icon: Wind, color: 'text-gray-300', bg: 'bg-gray-700/30' },
    aether: { icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-900/30' },
    nether: { icon: Square, color: 'text-gray-800', bg: 'bg-gray-900/50' },
    generic: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-800/30' }
  };

  // Get current player's available Azoth
  const getAvailableAzoth = (): any => {
    if (!gameState || !gameState.players) return {};
    const currentPlayer = gameState.players[gameState.activePlayer];
    if (!currentPlayer || !currentPlayer.azothRow) return {};
    const available = {};
    currentPlayer.azothRow.forEach((azothCard: any) => {
      if (!azothCard.rested && azothCard.elements) {
        Object.keys(azothCard.elements).forEach(element => {
          available[element] = (available[element] || 0) + 1;
        });
      }
    });

    return available;
  };

  // Check if player can afford a card
  const canAffordCard = (card, method = 'summon'): any => {
    if (!card || !card.elements) return false;
    const available = getAvailableAzoth();
    const spent = azothSpent;
    
    // Calculate remaining available after current spending
    const remaining = { ...available };
    Object.entries(spent).forEach(([element, amount]) => {
      remaining[element] = (remaining[element] || 0) - amount;
    });

    // Check if we can pay the card's cost
    return Object.entries(card.elements).every(([element, cost]) => {
      if (true) {
        // Generic can be paid with any element
        const totalRemaining = Object.values(remaining).reduce((sum, val) => sum + Math.max(0, val), 0);
        return totalRemaining >= cost;
      }
      return (remaining[element] || 0) >= cost;
    });
  };

  // Handle Azoth spending
  const adjustAzothSpent = (element, delta): any => {
    const available = getAvailableAzoth();
    const current = azothSpent[element] || 0;
    const newAmount = Math.max(0, Math.min(available[element] || 0, current + delta));
    
    setAzothSpent(prev => ({
      ...prev,
      [element]: newAmount
    }));
  };

  // Handle card action
  const handleCardAction = (action): any => {
    if (!selectedCard) return;

    const params = {
      azothSpent,
      abilityIndex: selectedAbility,
      tributedFamiliars: tributeTargets
    };

    onAction(action, selectedCard, params);
    
    // Reset state
    setAzothSpent({});
    setSelectedAbility(0);
    setTributeTargets([]);
    setShowCardActions(false);
  };

  // Handle phase action
  const handlePhaseAction = (action): any => {
    onPhaseAction(action);
  };

  // Render Azoth spending interface
  const renderAzothSpending = (): any => {
    const available = getAvailableAzoth();
    
    return (
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600"></div>
        <div className="text-sm text-gray-300 mb-2">Spend Azoth:</div>
        <div className="grid grid-cols-4 gap-2"></div>
          {Object.entries(available).map(([element, amount]) => {
            const config = elementConfig[element];
            const spent = azothSpent[element] || 0;
            const IconComponent = config?.icon || Circle;
            
            return (
              <div key={element} className="flex flex-col items-center gap-1"></div>
                <div className={`flex items-center gap-1 ${config?.color || 'text-gray-400'}`}></div>
                  <IconComponent className="w-4 h-4" / />
                  <span className="text-xs">{spent}/{amount}
                </div>
                <div className="flex gap-1"></div>
                  <button
                    onClick={() => adjustAzothSpent(element, -1)}
                    disabled={spent === 0}
                    className="w-6 h-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 rounded text-white flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" / />
                  </button>
                  <button
                    onClick={() => adjustAzothSpent(element, 1)}
                    disabled={spent >= amount}
                    className="w-6 h-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 rounded text-white flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" / />
                  </button>
              </div>
            );
          })}
        </div>
    );
  };

  // Render card action buttons
  const renderCardActions = (): any => {
    if (!selectedCard) return null;
    const canSummon = canAffordCard(selectedCard, 'summon');
    const canTribute = canAffordCard(selectedCard, 'tribute') && tributeTargets.length > 0;
    const canSpell = canAffordCard(selectedCard, 'spell');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-gray-900/90 rounded-lg p-4 border border-blue-500/30 backdrop-blur-sm"
       />
        <div className="text-lg font-bold text-white mb-3"></div>
          Play {selectedCard.name}

        {renderAzothSpending()}
        <div className="grid grid-cols-2 gap-2 mt-3"></div>
          {/* Summon */}
          <button
            onClick={() => handleCardAction('summon')}
            disabled={!canSummon}
            className="flex items-center gap-2 px-3 py-0 whitespace-nowrap bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 rounded text-white text-sm"
          >
            <Play className="w-4 h-4" / />
            Summon
          </button>

          {/* Tribute */}
          <button
            onClick={() => handleCardAction('tribute')}
            disabled={!canTribute}
            className="flex items-center gap-2 px-3 py-0 whitespace-nowrap bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:opacity-50 rounded text-white text-sm"
          >
            <Sword className="w-4 h-4" / />
            Tribute
          </button>

          {/* Azoth */}
          <button
            onClick={() => handleCardAction('azoth')}
            className="flex items-center gap-2 px-3 py-0 whitespace-nowrap bg-yellow-600 hover:bg-yellow-700 rounded text-white text-sm"
          >
            <Sparkles className="w-4 h-4" / />
            Azoth
          </button>

          {/* Spell */}
          <button
            onClick={() => handleCardAction('spell')}
            disabled={!canSpell}
            className="flex items-center gap-2 px-3 py-0 whitespace-nowrap bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 rounded text-white text-sm"
          >
            <Zap className="w-4 h-4" / />
            Spell
          </button>

        {/* Ability selection for spells */}
        {selectedCard.abilities && selectedCard.abilities.length > 1 && (
          <div className="mt-3"></div>
            <div className="text-sm text-gray-300 mb-2">Select Ability:</div>
            <div className="space-y-1"></div>
              {selectedCard.abilities.map((ability, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAbility(index)}
                  className={`w-full text-left px-2 py-0 whitespace-nowrap rounded text-sm ${
                    selectedAbility === index 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {ability.name}: {ability.description}
              ))}
            </div>
        )}
        <div className="flex gap-2 mt-3"></div>
          <button
            onClick={() => setShowCardActions(false)}
            className="flex-1 px-3 py-0 whitespace-nowrap bg-gray-600 hover:bg-gray-700 rounded text-white text-sm"
          >
            Cancel
          </button>
      </motion.div>
    );
  };

  // Render phase controls
  const renderPhaseControls = (): any => {
    if (!isPlayerTurn) return null;
    const phase = gameState?.phase || 'start';
    
    return (
      <div className="flex gap-2"></div>
        {phase === 'start' && (
          <button
            onClick={() => handlePhaseAction('startPhase')}
            className="px-4 py-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
          >
            Start Turn
          </button>
        )}
        {phase === 'main' && (
          <>
            <button
              onClick={() => handlePhaseAction('enterCombat')}
              className="px-4 py-0 whitespace-nowrap bg-red-600 hover:bg-red-700 rounded text-white text-sm"
            >
              Combat
            </button>
            <button
              onClick={() => handlePhaseAction('endTurn')}
              className="px-4 py-0 whitespace-nowrap bg-gray-600 hover:bg-gray-700 rounded text-white text-sm"
            >
              End Turn
            </button>
          </>
        )}
        {phase === 'combat' && (
          <>
            <button
              onClick={() => handlePhaseAction('declareAttackers')}
              className="px-4 py-0 whitespace-nowrap bg-red-600 hover:bg-red-700 rounded text-white text-sm"
            >
              <Sword className="w-4 h-4 inline mr-1" / />
              Attack
            </button>
            <button
              onClick={() => handlePhaseAction('endCombat')}
              className="px-4 py-0 whitespace-nowrap bg-gray-600 hover:bg-gray-700 rounded text-white text-sm"
            >
              End Combat
            </button>
          </>
        )}
        {phase === 'defense' && (
          <>
            <button
              onClick={() => handlePhaseAction('declareBlockers')}
              className="px-4 py-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
            >
              <Shield className="w-4 h-4 inline mr-1" / />
              Block
            </button>
            <button
              onClick={() => handlePhaseAction('noBlocks')}
              className="px-4 py-0 whitespace-nowrap bg-gray-600 hover:bg-gray-700 rounded text-white text-sm"
            >
              No Blocks
            </button>
          </>
        )}
        {phase === 'postCombat' && (
          <button
            onClick={() => handlePhaseAction('endTurn')}
            className="px-4 py-0 whitespace-nowrap bg-gray-600 hover:bg-gray-700 rounded text-white text-sm"
          >
            End Turn
          </button>
        )}
        {phase === 'refresh' && (
          <button
            onClick={() => handlePhaseAction('refreshPhase')}
            className="px-4 py-0 whitespace-nowrap bg-green-600 hover:bg-green-700 rounded text-white text-sm"
          >
            Refresh
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40"></div>
      <div className="flex flex-col items-center gap-4"></div>
        {/* Card Actions Panel */}
        <AnimatePresence />
          {selectedCard && showCardActions && renderCardActions()}

        {/* Main Controls */}
        <div className="flex items-center gap-4 bg-gray-900/90 rounded-lg px-4 py-0 whitespace-nowrap border border-blue-500/30 backdrop-blur-sm"></div>
          {/* Card Action Button */}
          {selectedCard && (
            <button
              onClick={() => setShowCardActions(!showCardActions)}
              className="px-3 py-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
            >
              Play Card
            </button>
          )}
          {/* Phase Controls */}
          {renderPhaseControls()}
          {/* Quick Actions */}
          <div className="flex gap-2"></div>
            <button
              onClick={() => handlePhaseAction('draw')}
              disabled={!isPlayerTurn}
              className="px-3 py-0 whitespace-nowrap bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 rounded text-white text-sm"
            >
              Draw
            </button>
            
            <button
              onClick={() => handlePhaseAction('concede')}
              className="px-3 py-0 whitespace-nowrap bg-red-600 hover:bg-red-700 rounded text-white text-sm"
            >
              Concede
            </button>
        </div>

        {/* Turn Indicator */}
        <div className="text-center"></div>
          <div className={`text-sm font-bold ${isPlayerTurn ? 'text-green-400' : 'text-red-400'}`}></div>
            {isPlayerTurn ? 'Your Turn' : "Opponent's Turn"}
          {gameState?.phase && (
            <div className="text-xs text-gray-400 capitalize"></div>
              {gameState.phase} Phase
            </div>
          )}
        </div>
    </div>
  );
};

export default KonivrERGameControls;