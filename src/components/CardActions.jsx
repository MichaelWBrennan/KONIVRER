import React, { useState } from 'react';
import { ELEMENTS } from '../engine/elementalSystem';
import { useGame } from '../contexts/GameContext';
import '../styles/cardActions.css';

const CardActions = ({ card, onAction, onClose }) => {
  const { gameState } = useGame();
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [tributeCards, setTributeCards] = useState([]);
  const [selectedAbility, setSelectedAbility] = useState(0);
  
  // Determine available actions based on card type and game phase
  const availableActions = [
    { id: 'summon', label: 'Summon', available: card.type === 'Familiar' && ['MAIN', 'POST_COMBAT_MAIN'].includes(gameState.phase) },
    { id: 'tribute', label: 'Tribute', available: card.type === 'Familiar' && ['MAIN', 'POST_COMBAT_MAIN'].includes(gameState.phase) },
    { id: 'azoth', label: 'Play as Azoth', available: ['MAIN', 'POST_COMBAT_MAIN'].includes(gameState.phase) },
    { id: 'spell', label: 'Cast as Spell', available: card.type === 'Spell' && ['MAIN', 'POST_COMBAT_MAIN'].includes(gameState.phase) },
    { id: 'burst', label: 'Play as Burst', available: card.type === 'Spell' && card.burstable === true },
  ];
  
  const handleActionSelect = (actionId) => {
    setSelectedAction(actionId);
    
    // Reset other selections
    setSelectedElement(null);
    setTributeCards([]);
    setSelectedAbility(0);
  };
  
  const handleElementSelect = (element) => {
    setSelectedElement(element);
  };
  
  const handleAbilitySelect = (index) => {
    setSelectedAbility(index);
  };
  
  const handleConfirm = () => {
    // Prepare parameters based on action type
    const params = {};
    
    if (selectedAction === 'azoth' && selectedElement) {
      params.elementType = selectedElement;
    }
    
    if (selectedAction === 'tribute' && tributeCards.length > 0) {
      params.tributeCardIds = tributeCards;
    }
    
    if (selectedAction === 'spell' && card.abilities && card.abilities.length > 0) {
      params.abilityIndex = selectedAbility;
      // In a real implementation, we would calculate azothSpent here
      params.azothSpent = 0;
    }
    
    // Call the onAction callback with the action type, card, and parameters
    onAction(selectedAction, card, params);
  };
  
  return (
    <div className="card-actions-modal">
      <div className="card-actions-content">
        <h3>Play {card.name}</h3>
        
        {!selectedAction ? (
          <div className="action-selection">
            <h4>Select Action:</h4>
            <div className="action-buttons">
              {availableActions.map(action => (
                action.available && (
                  <button 
                    key={action.id}
                    className="action-button"
                    onClick={() => handleActionSelect(action.id)}
                  >
                    {action.label}
                  </button>
                )
              ))}
            </div>
          </div>
        ) : selectedAction === 'azoth' && !selectedElement ? (
          <div className="element-selection">
            <h4>Select Element Type:</h4>
            <div className="element-buttons">
              {Object.values(ELEMENTS).map(element => (
                <button 
                  key={element}
                  className={`element-button ${element}`}
                  onClick={() => handleElementSelect(element)}
                >
                  {element}
                </button>
              ))}
            </div>
          </div>
        ) : selectedAction === 'spell' && card.abilities && card.abilities.length > 1 ? (
          <div className="ability-selection">
            <h4>Select Ability:</h4>
            <div className="ability-options">
              {card.abilities.map((ability, index) => (
                <div 
                  key={index}
                  className={`ability-option ${selectedAbility === index ? 'selected' : ''}`}
                  onClick={() => handleAbilitySelect(index)}
                >
                  {ability.effect}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="confirmation">
            <h4>Confirm Action:</h4>
            <p>
              {selectedAction === 'summon' && `Summon ${card.name} as a Familiar`}
              {selectedAction === 'tribute' && `Play ${card.name} with Tribute`}
              {selectedAction === 'azoth' && `Place ${card.name} as ${selectedElement} Azoth`}
              {selectedAction === 'spell' && `Cast ${card.name} as a Spell`}
              {selectedAction === 'burst' && `Play ${card.name} as a Burst`}
            </p>
            <button className="confirm-button" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        )}
        
        <button className="close-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CardActions;