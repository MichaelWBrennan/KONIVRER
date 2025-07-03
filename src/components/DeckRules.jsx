import React from 'react';
import { getDeckCompletionStatus } from '../utils/deckValidator';
import '../styles/deckRules.css';

const DeckRules = ({ deck = [] }) => {
  const completionStatus = getDeckCompletionStatus(deck);
  
  return (
    <div className="deck-rules-container">
      <h3 className="deck-rules-title">Deck Construction Rules</h3>
      
      <div className="deck-rules-list">
        <div className="deck-rule">
          <div className="rule-description">
            <span className="rule-icon">⚑</span>
            <span className="rule-text">1 Flag card (doesn't count toward deck total)</span>
          </div>
          <div className="rule-status">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionStatus.flagCompletion}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {completionStatus.counts.flag}/1
            </span>
          </div>
        </div>
        
        <div className="deck-rule">
          <div className="rule-description">
            <span className="rule-icon">📚</span>
            <span className="rule-text">40 cards total</span>
          </div>
          <div className="rule-status">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionStatus.totalCompletion}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {completionStatus.counts.total}/40
            </span>
          </div>
        </div>
        
        <div className="deck-rule">
          <div className="rule-description">
            <span className="rule-icon">🜠</span>
            <span className="rule-text">25 Common cards</span>
          </div>
          <div className="rule-status">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionStatus.commonCompletion}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {completionStatus.counts.common}/25
            </span>
          </div>
        </div>
        
        <div className="deck-rule">
          <div className="rule-description">
            <span className="rule-icon">☽</span>
            <span className="rule-text">13 Uncommon cards</span>
          </div>
          <div className="rule-status">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionStatus.uncommonCompletion}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {completionStatus.counts.uncommon}/13
            </span>
          </div>
        </div>
        
        <div className="deck-rule">
          <div className="rule-description">
            <span className="rule-icon">☉</span>
            <span className="rule-text">2 Rare cards</span>
          </div>
          <div className="rule-status">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionStatus.rareCompletion}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {completionStatus.counts.rare}/2
            </span>
          </div>
        </div>
        
        <div className="deck-rule">
          <div className="rule-description">
            <span className="rule-icon">⚠</span>
            <span className="rule-text">1 copy per card maximum</span>
          </div>
          <div className="rule-status">
            <span className="rule-check">✓</span>
          </div>
        </div>
      </div>
      
      <div className="deck-completion">
        <h4>Deck Completion</h4>
        <div className="completion-bar">
          <div 
            className="completion-fill" 
            style={{ width: `${completionStatus.totalCompletion}%` }}
          ></div>
        </div>
        <div className="completion-text">
          {completionStatus.totalCompletion}% Complete
        </div>
      </div>
      
      {completionStatus.totalCompletion < 100 && (
        <div className="deck-remaining">
          <h4>Cards Needed</h4>
          <ul className="remaining-list">
            {completionStatus.remaining.flag > 0 && (
              <li>Flag: {completionStatus.remaining.flag}</li>
            )}
            {completionStatus.remaining.common > 0 && (
              <li>Common: {completionStatus.remaining.common}</li>
            )}
            {completionStatus.remaining.uncommon > 0 && (
              <li>Uncommon: {completionStatus.remaining.uncommon}</li>
            )}
            {completionStatus.remaining.rare > 0 && (
              <li>Rare: {completionStatus.remaining.rare}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DeckRules;