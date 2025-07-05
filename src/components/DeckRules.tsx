import React from 'react';
import { getDeckCompletionStatus } from '../utils/deckValidator';
import '../styles/deckRules.css';

interface DeckRulesProps {
  deck = [];
}

const DeckRules: React.FC<DeckRulesProps> = ({  deck = []  }) => {
  const completionStatus = getDeckCompletionStatus(deck);
  
  return (
    <div className="deck-rules-container" />
      <h3 className="deck-rules-title">Deck Construction Rules</h3>
      
      <div className="deck-rules-list" />
        <div className="deck-rule" />
          <div className="rule-description" />
            <span className="rule-icon">⚑</span>
            <span className="rule-text">1 Flag card (doesn't count toward deck total)</span>
          <div className="rule-status" />
            <div className="progress-bar" />
              <div 
                className="progress-fill" 
                style={{ width: `${completionStatus.flagCompletion}%` }}
               />
            </div>
            <span className="progress-text" />
              {completionStatus.counts.flag}/1
            </span>
        </div>
        
        <div className="deck-rule" />
          <div className="rule-description" />
            <span className="rule-icon">📚</span>
            <span className="rule-text">40 cards total</span>
          <div className="rule-status" />
            <div className="progress-bar" />
              <div 
                className="progress-fill" 
                style={{ width: `${completionStatus.totalCompletion}%` }}
               />
            </div>
            <span className="progress-text" />
              {completionStatus.counts.total}/40
            </span>
        </div>
        
        <div className="deck-rule" />
          <div className="rule-description" />
            <span className="rule-icon">🜠</span>
            <span className="rule-text">25 Common cards</span>
          <div className="rule-status" />
            <div className="progress-bar" />
              <div 
                className="progress-fill" 
                style={{ width: `${completionStatus.commonCompletion}%` }}
               />
            </div>
            <span className="progress-text" />
              {completionStatus.counts.common}/25
            </span>
        </div>
        
        <div className="deck-rule" />
          <div className="rule-description" />
            <span className="rule-icon">☽</span>
            <span className="rule-text">13 Uncommon cards</span>
          <div className="rule-status" />
            <div className="progress-bar" />
              <div 
                className="progress-fill" 
                style={{ width: `${completionStatus.uncommonCompletion}%` }}
               />
            </div>
            <span className="progress-text" />
              {completionStatus.counts.uncommon}/13
            </span>
        </div>
        
        <div className="deck-rule" />
          <div className="rule-description" />
            <span className="rule-icon">☉</span>
            <span className="rule-text">2 Rare cards</span>
          <div className="rule-status" />
            <div className="progress-bar" />
              <div 
                className="progress-fill" 
                style={{ width: `${completionStatus.rareCompletion}%` }}
               />
            </div>
            <span className="progress-text" />
              {completionStatus.counts.rare}/2
            </span>
        </div>
        
        <div className="deck-rule" />
          <div className="rule-description" />
            <span className="rule-icon">⚠</span>
            <span className="rule-text">1 copy per card maximum</span>
          <div className="rule-status" />
            <span className="rule-check">✓</span>
        </div>
      
      <div className="deck-completion" />
        <h4>Deck Completion</h4>
        <div className="completion-bar" />
          <div 
            className="completion-fill" 
            style={{ width: `${completionStatus.totalCompletion}%` }}
           />
        </div>
        <div className="completion-text" />
          {completionStatus.totalCompletion}% Complete
        </div>
      
      {completionStatus.totalCompletion < 100 && (
        <div className="deck-remaining" />
          <h4>Cards Needed</h4>
          <ul className="remaining-list" />
            {completionStatus.remaining.flag > 0 && (
              <li>Flag: {completionStatus.remaining.flag}
            )}
            {completionStatus.remaining.common > 0 && (
              <li>Common: {completionStatus.remaining.common}
            )}
            {completionStatus.remaining.uncommon > 0 && (
              <li>Uncommon: {completionStatus.remaining.uncommon}
            )}
            {completionStatus.remaining.rare > 0 && (
              <li>Rare: {completionStatus.remaining.rare}
            )}
          </ul>
      )}
    </div>
  );
};

export default DeckRules;