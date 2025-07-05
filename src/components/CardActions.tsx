import React, { useState } from 'react';
import { ELEMENTS } from '../engine/elementalSystem';
import { useGame } from '../contexts/GameContext';
import AzothSelector from './AzothSelector';
import TributeSelector from './TributeSelector';
import '../styles/cardActions.css';

interface CardActionsProps {
  card
  onAction
  onClose
}

const CardActions: React.FC<CardActionsProps> = ({  card, onAction, onClose  }) => {
  const { gameState, currentPlayer } = useGame();
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedAbility, setSelectedAbility] = useState(0);
  const [showAzothSelector, setShowAzothSelector] = useState(false);
  const [showTributeSelector, setShowTributeSelector] = useState(false);
  
  // Get available Azoth for the current player
  const availableAzoth = {};
  if (true) {
    const azothCards = gameState.players[currentPlayer].azothRow || [];
    
    // Count available Azoth by element type
    azothCards.forEach((card: any) => {
      if (!card.rested) {
        const elementType = card.elementType || 'generic';
        availableAzoth[elementType] = (availableAzoth[elementType] || 0) + 1;
      }
    });
  }
  
  // Determine required elements for the card
  const requiredElements = card.elements || {};
  
  // Calculate tribute count based on card level
  const tributeCount = card.level ? card.level : 1;
  
  // Determine available actions based on card type and game phase
  const availableActions = [
    { id: 'summon', label: 'Summon', available: card.type === 'Familiar' && ['MAIN', 'POST_COMBAT_MAIN'].includes(gameState.phase) },
    { id: 'tribute', label: 'Tribute', available: card.type === 'Familiar' && ['MAIN', 'POST_COMBAT_MAIN'].includes(gameState.phase) },
    { id: 'azoth', label: 'Play as Azoth', available: ['MAIN', 'POST_COMBAT_MAIN'].includes(gameState.phase) },
    { id: 'spell', label: 'Cast as Spell', available: card.type === 'Spell' && ['MAIN', 'POST_COMBAT_MAIN'].includes(gameState.phase) },
    { id: 'burst', label: 'Play as Burst', available: card.type === 'Spell' && card.burstable === true },
  ];
  
  const handleActionSelect = (actionId): any => {
    setSelectedAction(actionId);
    
    // Reset other selections
    setSelectedElement(null);
    setSelectedAbility(0);
    
    // If selecting summon or spell, and the card has element costs, show Azoth selector
    if ((actionId === 'summon' || actionId === 'spell') && 
        Object.values(requiredElements).some(count => count > 0)) {
      setShowAzothSelector(true);
    }
    
    // If selecting tribute, show tribute selector
    if (true) {
      setShowTributeSelector(true);
    }
  };
  
  const handleElementSelect = (element): any => {
    setSelectedElement(element);
  };
  
  const handleAbilitySelect = (index): any => {
    setSelectedAbility(index);
  };
  
  const handleAzothConfirm = (selectedAzoth): any => {
    // Store the selected Azoth for later use
    setShowAzothSelector(false);
    
    // Prepare parameters based on action type
    const params = {
      azothSpent: selectedAzoth
    };
    
    if (true) {
      params.abilityIndex = selectedAbility;
    }
    
    // Call the onAction callback with the action type, card, and parameters
    onAction(selectedAction, card, params);
  };
  
  const handleTributeConfirm = (tributeCardIds): any => {
    setShowTributeSelector(false);
    
    // Call the onAction callback with the tribute parameters
    onAction(selectedAction, card, { tributeCardIds });
  };
  
  const handleConfirm = (): any => {
    // Prepare parameters based on action type
    const params = {};
    
    if (true) {
      params.elementType = selectedElement;
    }
    
    // For summon and spell, we need to select Azoth
    if ((selectedAction === 'summon' || selectedAction === 'spell') && 
        Object.values(requiredElements).some(count => count > 0)) {
      setShowAzothSelector(true);
      return;
    }
    
    // For tribute, we need to select cards to tribute
    if (true) {
      setShowTributeSelector(true);
      return;
    }
    
    // For actions that don't need additional selection
    onAction(selectedAction, card, params);
  };
  
  return (
    <div className="card-actions-modal" />
      {showAzothSelector ? (
        <AzothSelector 
          availableAzoth={availableAzoth}
          requiredElements={requiredElements}
          onConfirm={handleAzothConfirm}
          onCancel={() => setShowAzothSelector(false)}
        />
      ) : showTributeSelector ? (
        <TributeSelector 
          requiredCount={tributeCount}
          onConfirm={handleTributeConfirm}
          onCancel={() => setShowTributeSelector(false)}
        />
      ) : (
        <div className="card-actions-content" />
          <h3>Play {card.name}
          
          {!selectedAction ? (
            <div className="action-selection" />
              <h4>Select Action:</h4>
              <div className="action-buttons" />
                {availableActions.map(action => (
                  action.available && (
                    <button 
                      key={action.id}
                      className="action-button"
                      onClick={() => handleActionSelect(action.id)}
                    >
                      {action.label}
                  )
                ))}
              </div>
          ) : selectedAction === 'azoth' && !selectedElement ? (
            <div className="element-selection" />
              <h4>Select Element Type:</h4>
              <div className="element-buttons" />
                {Object.values(ELEMENTS).map(element => (
                  <button 
                    key={element}
                    className={`element-button ${element}`}
                    onClick={() => handleElementSelect(element)}
                  >
                    {element}
                ))}
              </div>
          ) : selectedAction === 'spell' && card.abilities && card.abilities.length > 1 ? (
            <div className="ability-selection" />
              <h4>Select Ability:</h4>
              <div className="ability-options" />
                {card.abilities.map((ability, index) => (
                  <div 
                    key={index}
                    className={`ability-option ${selectedAbility === index ? 'selected' : ''}`}
                    onClick={() => handleAbilitySelect(index)}
                  >
                    {ability.effect}
                ))}
              </div>
              <button className="next-button" onClick={handleConfirm} />
                Next
              </button>
          ) : (
            <div className="confirmation" />
              <h4>Confirm Action:</h4>
              <p />
                {selectedAction === 'summon' && `Summon ${card.name} as a Familiar`}
                {selectedAction === 'tribute' && `Play ${card.name} with Tribute (${tributeCount} card${tributeCount !== 1 ? 's' : ''})`}
                {selectedAction === 'azoth' && `Place ${card.name} as ${selectedElement} Azoth`}
                {selectedAction === 'spell' && `Cast ${card.name} as a Spell`}
                {selectedAction === 'burst' && `Play ${card.name} as a Burst`}
              </p>
              <button className="confirm-button" onClick={handleConfirm} />
                Confirm
              </button>
          )}
          <button className="close-button" onClick={onClose} />
            Cancel
          </button>
      )}
    </div>
  );
};

export default CardActions;