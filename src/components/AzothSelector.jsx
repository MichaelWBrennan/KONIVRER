import React, { useState } from 'react';
import { ELEMENT_SYMBOLS } from '../engine/elementalSystem';
import '../styles/azothSelector.css';

const AzothSelector = ({ availableAzoth, requiredElements, onConfirm, onCancel }) => {
  // Initialize selected Azoth with empty values
  const initialSelected = Object.keys(availableAzoth).reduce((acc, element) => {
    acc[element] = 0;
    return acc;
  }, {});
  
  const [selectedAzoth, setSelectedAzoth] = useState(initialSelected);
  
  // Calculate total selected and remaining Azoth
  const totalSelected = Object.values(selectedAzoth).reduce((sum, count) => sum + count, 0);
  const remainingAzoth = Object.keys(availableAzoth).reduce((acc, element) => {
    acc[element] = availableAzoth[element] - (selectedAzoth[element] || 0);
    return acc;
  }, {});
  
  // Check if requirements are met
  const requirementsMet = Object.keys(requiredElements).every(element => 
    (selectedAzoth[element] || 0) >= requiredElements[element]
  );
  
  const handleIncrease = (element) => {
    if (remainingAzoth[element] > 0) {
      setSelectedAzoth({
        ...selectedAzoth,
        [element]: (selectedAzoth[element] || 0) + 1
      });
    }
  };
  
  const handleDecrease = (element) => {
    if (selectedAzoth[element] > 0) {
      setSelectedAzoth({
        ...selectedAzoth,
        [element]: selectedAzoth[element] - 1
      });
    }
  };
  
  const handleConfirm = () => {
    onConfirm(selectedAzoth);
  };
  
  return (
    <div className="azoth-selector-overlay">
      <div className="azoth-selector-container">
        <h3>Select Azoth to Spend</h3>
        
        <div className="azoth-requirements">
          <h4>Required Elements:</h4>
          <div className="element-requirements">
            {Object.entries(requiredElements).map(([element, count]) => (
              count > 0 && (
                <div key={element} className={`element-requirement ${element}`}>
                  {ELEMENT_SYMBOLS[element]} {count}
                </div>
              )
            ))}
          </div>
        </div>
        
        <div className="azoth-selection">
          <h4>Available Azoth:</h4>
          <div className="element-selectors">
            {Object.entries(availableAzoth).map(([element, count]) => (
              <div key={element} className="element-selector">
                <div className={`element-label ${element}`}>
                  {ELEMENT_SYMBOLS[element]} {element}
                </div>
                <div className="element-controls">
                  <button 
                    className="element-decrease" 
                    onClick={() => handleDecrease(element)}
                    disabled={selectedAzoth[element] <= 0}
                  >
                    -
                  </button>
                  <div className="element-count">
                    {selectedAzoth[element] || 0}/{count}
                  </div>
                  <button 
                    className="element-increase" 
                    onClick={() => handleIncrease(element)}
                    disabled={remainingAzoth[element] <= 0}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="azoth-summary">
          <div className="total-selected">
            Total Selected: {totalSelected}
          </div>
        </div>
        
        <div className="azoth-actions">
          <button 
            className="confirm-button" 
            onClick={handleConfirm}
            disabled={!requirementsMet}
          >
            Confirm
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AzothSelector;