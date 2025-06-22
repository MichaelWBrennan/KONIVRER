import React, { useState, useCallback, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Machine Learning Deck Analysis component
 * This component uses simulated ML algorithms to analyze deck compositions,
 * predict win rates, and suggest optimizations based on meta analysis.
 */
const MLDeckAnalysis = () => {
  const [deckList, setDeckList] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('archetype');
  const { isAncientTheme } = useTheme();

  // Simulated card database
  const cardDatabase = useMemo(() => ({
    'Ancient Guardian': { type: 'Creature', cost: 5, power: 4, toughness: 6, tags: ['Defender', 'Control'] },
    'Mystic Oracle': { type: 'Creature', cost: 3, power: 2, toughness: 3, tags: ['Spellcaster', 'Control'] },
    'Shadow Assassin': { type: 'Creature', cost: 2, power: 3, toughness: 1, tags: ['Rogue', 'Aggro'] },
    'Ethereal Dragon': { type: 'Creature', cost: 7, power: 6, toughness: 6, tags: ['Dragon', 'Midrange'] },
    'Temporal Mage': { type: 'Creature', cost: 4, power: 3, toughness: 3, tags: ['Spellcaster', 'Control'] },
    'Lightning Bolt': { type: 'Spell', cost: 1, tags: ['Damage', 'Aggro'] },
    'Counterspell': { type: 'Spell', cost: 2, tags: ['Counter', 'Control'] },
    'Healing Rain': { type: 'Spell', cost: 3, tags: ['Healing', 'Control'] },
    'Dark Ritual': { type: 'Spell', cost: 1, tags: ['Ramp', 'Combo'] },
    'Nature\'s Embrace': { type: 'Spell', cost: 2, tags: ['Ramp', 'Midrange'] },
    'Ancestral Knowledge': { type: 'Spell', cost: 3, tags: ['Draw', 'Control'] },
    'Volcanic Eruption': { type: 'Spell', cost: 6, tags: ['Board Clear', 'Control'] },
    'Elven Sanctuary': { type: 'Land', tags: ['Mana', 'Utility'] },
    'Mystic Forge': { type: 'Artifact', cost: 4, tags: ['Utility', 'Combo'] },
    'Ancient Tome': { type: 'Artifact', cost: 2, tags: ['Draw', 'Control'] },
  }), []);

  // Simulated meta archetypes
  const metaArchetypes = useMemo(() => ({
    'Aggro': {
      description: 'Fast-paced deck focused on dealing damage quickly',
      winRate: 0.52,
      favorableMatchups: ['Control', 'Combo'],
      unfavorableMatchups: ['Midrange'],
      keyCards: ['Shadow Assassin', 'Lightning Bolt']
    },
    'Control': {
      description: 'Defensive deck focused on countering threats and winning late game',
      winRate: 0.48,
      favorableMatchups: ['Midrange'],
      unfavorableMatchups: ['Aggro', 'Combo'],
      keyCards: ['Ancient Guardian', 'Counterspell', 'Volcanic Eruption']
    },
    'Midrange': {
      description: 'Balanced deck that can play aggressively or defensively',
      winRate: 0.51,
      favorableMatchups: ['Aggro'],
      unfavorableMatchups: ['Control'],
      keyCards: ['Ethereal Dragon', 'Nature\'s Embrace']
    },
    'Combo': {
      description: 'Deck focused on assembling specific card combinations for powerful effects',
      winRate: 0.49,
      favorableMatchups: ['Control'],
      unfavorableMatchups: ['Aggro'],
      keyCards: ['Dark Ritual', 'Mystic Forge']
    }
  }), []);

  /**
   * Parse a deck list string into a structured format
   * @param {string} deckListStr - The deck list string to parse
   * @returns {Array} Parsed deck list
   */
  const parseDeckList = useCallback((deckListStr) => {
    if (!deckListStr) return [];
    
    const lines = deckListStr.split('\n').filter(line => line.trim());
    const parsedDeck = [];
    
    for (const line of lines) {
      const match = line.match(/^(\d+)x?\s+(.+)$/);
      if (match) {
        const [, countStr, cardName] = match;
        const count = parseInt(countStr, 10);
        
        if (cardDatabase[cardName]) {
          parsedDeck.push({
            name: cardName,
            count,
            ...cardDatabase[cardName]
          });
        } else {
          parsedDeck.push({
            name: cardName,
            count,
            type: 'Unknown',
            tags: []
          });
        }
      }
    }
    
    return parsedDeck;
  }, [cardDatabase]);

  /**
   * Analyze the deck list based on the selected analysis type
   */
  const analyzeDeck = useCallback(() => {
    if (!deckList.trim()) return;
    
    setIsAnalyzing(true);
    
    // Parse the deck list
    const parsedDeck = parseDeckList(deckList);
    
    // Simulate ML analysis with a delay
    setTimeout(() => {
      let analysisResult = {};
      
      // Calculate basic deck statistics
      const totalCards = parsedDeck.reduce((sum, card) => sum + card.count, 0);
      const typeDistribution = {};
      const costDistribution = {};
      const tagCounts = {};
      
      parsedDeck.forEach(card => {
        // Count card types
        typeDistribution[card.type] = (typeDistribution[card.type] || 0) + card.count;
        
        // Count mana costs
        if (card.cost !== undefined) {
          costDistribution[card.cost] = (costDistribution[card.cost] || 0) + card.count;
        }
        
        // Count tags
        if (card.tags) {
          card.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + card.count;
          });
        }
      });
      
      // Basic deck statistics for all analysis types
      analysisResult.basicStats = {
        totalCards,
        typeDistribution,
        costDistribution,
        averageCost: parsedDeck.reduce((sum, card) => sum + (card.cost || 0) * card.count, 0) / 
                    parsedDeck.reduce((sum, card) => sum + (card.cost !== undefined ? card.count : 0), 0)
      };
      
      // Perform specific analysis based on selected type
      if (selectedAnalysisType === 'archetype') {
        // Determine deck archetype based on tag distribution
        const archetypeScores = {
          'Aggro': 0,
          'Control': 0,
          'Midrange': 0,
          'Combo': 0
        };
        
        // Calculate archetype scores based on card tags
        Object.entries(tagCounts).forEach(([tag, count]) => {
          if (['Aggro', 'Damage'].includes(tag)) archetypeScores['Aggro'] += count;
          if (['Control', 'Counter', 'Board Clear'].includes(tag)) archetypeScores['Control'] += count;
          if (['Midrange', 'Ramp'].includes(tag)) archetypeScores['Midrange'] += count;
          if (['Combo', 'Draw'].includes(tag)) archetypeScores['Combo'] += count;
        });
        
        // Determine primary and secondary archetypes
        const sortedArchetypes = Object.entries(archetypeScores)
          .sort((a, b) => b[1] - a[1]);
        
        const primaryArchetype = sortedArchetypes[0][0];
        const secondaryArchetype = sortedArchetypes[1][0];
        
        analysisResult.archetypeAnalysis = {
          primaryArchetype,
          secondaryArchetype,
          archetypeScores,
          archetypeDescription: metaArchetypes[primaryArchetype].description,
          estimatedWinRate: metaArchetypes[primaryArchetype].winRate,
          favorableMatchups: metaArchetypes[primaryArchetype].favorableMatchups,
          unfavorableMatchups: metaArchetypes[primaryArchetype].unfavorableMatchups
        };
      } 
      else if (selectedAnalysisType === 'optimization') {
        // Analyze deck for optimization opportunities
        const suggestions = [];
        const parsedCardNames = parsedDeck.map(card => card.name);
        
        // Check mana curve
        const lowCostCount = Object.entries(costDistribution)
          .filter(([cost]) => parseInt(cost) <= 3)
          .reduce((sum, [, count]) => sum + count, 0);
        
        const highCostCount = Object.entries(costDistribution)
          .filter(([cost]) => parseInt(cost) >= 5)
          .reduce((sum, [, count]) => sum + count, 0);
        
        if (lowCostCount < totalCards * 0.4) {
          suggestions.push({
            type: 'Mana Curve',
            issue: 'Not enough low-cost cards',
            suggestion: 'Add more cards with cost 1-3 to improve early game presence'
          });
        }
        
        if (highCostCount > totalCards * 0.3) {
          suggestions.push({
            type: 'Mana Curve',
            issue: 'Too many high-cost cards',
            suggestion: 'Reduce the number of cards with cost 5+ to avoid dead draws'
          });
        }
        
        // Check for key archetype cards
        const primaryArchetype = Object.entries(tagCounts)
          .filter(([tag]) => ['Aggro', 'Control', 'Midrange', 'Combo'].includes(tag))
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
        
        if (primaryArchetype !== 'Unknown' && metaArchetypes[primaryArchetype]) {
          const missingKeyCards = metaArchetypes[primaryArchetype].keyCards
            .filter(card => !parsedCardNames.includes(card));
          
          if (missingKeyCards.length > 0) {
            suggestions.push({
              type: 'Key Cards',
              issue: `Missing key cards for ${primaryArchetype} archetype`,
              suggestion: `Consider adding: ${missingKeyCards.join(', ')}`
            });
          }
        }
        
        // Check card type distribution
        const creatureCount = typeDistribution['Creature'] || 0;
        const spellCount = typeDistribution['Spell'] || 0;
        
        if (creatureCount < totalCards * 0.3) {
          suggestions.push({
            type: 'Card Types',
            issue: 'Low creature count',
            suggestion: 'Add more creatures to maintain board presence'
          });
        }
        
        if (spellCount < totalCards * 0.2) {
          suggestions.push({
            type: 'Card Types',
            issue: 'Low spell count',
            suggestion: 'Add more spells for interaction and flexibility'
          });
        }
        
        analysisResult.optimizationAnalysis = {
          suggestions,
          recommendedChanges: suggestions.length > 0
        };
      }
      else if (selectedAnalysisType === 'prediction') {
        // Predict win rates against common archetypes
        const deckTags = Object.keys(tagCounts);
        
        // Determine deck's primary archetype
        let primaryArchetype = 'Unknown';
        let maxScore = 0;
        
        for (const [archetype, data] of Object.entries(metaArchetypes)) {
          const score = deckTags.reduce((sum, tag) => {
            if (data.keyCards.some(card => {
              const cardData = cardDatabase[card];
              return cardData && cardData.tags && cardData.tags.includes(tag);
            })) {
              return sum + tagCounts[tag];
            }
            return sum;
          }, 0);
          
          if (score > maxScore) {
            maxScore = score;
            primaryArchetype = archetype;
          }
        }
        
        // Calculate predicted win rates
        const predictedMatchups = {};
        
        for (const [archetype, data] of Object.entries(metaArchetypes)) {
          let baseWinRate = 0.5; // Default to 50%
          
          if (data.favorableMatchups.includes(primaryArchetype)) {
            baseWinRate -= 0.1; // Unfavorable for our deck
          }
          
          if (data.unfavorableMatchups.includes(primaryArchetype)) {
            baseWinRate += 0.1; // Favorable for our deck
          }
          
          // Adjust based on deck composition
          const archetypeTags = data.keyCards.flatMap(card => 
            cardDatabase[card]?.tags || []
          );
          
          const counterTags = deckTags.filter(tag => {
            // Tags that counter the archetype
            if (archetype === 'Aggro' && ['Board Clear', 'Healing'].includes(tag)) return true;
            if (archetype === 'Control' && ['Aggro', 'Combo'].includes(tag)) return true;
            if (archetype === 'Midrange' && ['Control'].includes(tag)) return true;
            if (archetype === 'Combo' && ['Counter', 'Aggro'].includes(tag)) return true;
            return false;
          });
          
          const counterScore = counterTags.reduce((sum, tag) => sum + (tagCounts[tag] || 0), 0) / totalCards;
          baseWinRate += counterScore * 0.2; // Adjust win rate based on counter cards
          
          predictedMatchups[archetype] = Math.min(Math.max(baseWinRate, 0.3), 0.7); // Clamp between 30% and 70%
        }
        
        analysisResult.predictionAnalysis = {
          deckArchetype: primaryArchetype,
          predictedMatchups,
          overallWinRate: Object.values(predictedMatchups).reduce((sum, rate) => sum + rate, 0) / 
                          Object.values(predictedMatchups).length,
          confidence: 0.75 // Simulated confidence level
        };
      }
      
      setAnalysisResults(analysisResult);
      setIsAnalyzing(false);
    }, 2000); // Simulate processing time
  }, [deckList, selectedAnalysisType, parseDeckList, cardDatabase, metaArchetypes]);

  /**
   * Load a sample deck for demonstration
   */
  const loadSampleDeck = useCallback(() => {
    const sampleDecks = {
      'aggro': `4x Shadow Assassin
3x Lightning Bolt
4x Goblin Raider
3x Lava Spike
2x Volcanic Hammer
4x Raging Goblin
4x Shock
3x Fiery Temper
2x Volcanic Eruption
4x Mountain
4x Elven Sanctuary`,
      'control': `3x Ancient Guardian
4x Counterspell
2x Volcanic Eruption
3x Mystic Oracle
2x Temporal Mage
4x Healing Rain
3x Ancestral Knowledge
2x Ancient Tome
3x Elven Sanctuary
4x Island
2x Plains`,
      'midrange': `3x Ethereal Dragon
4x Nature's Embrace
3x Temporal Mage
2x Lightning Bolt
2x Healing Rain
3x Shadow Assassin
2x Ancient Guardian
3x Elven Sanctuary
4x Forest
2x Mountain
2x Plains`
    };
    
    // Select a sample deck based on the analysis type
    let deckType = 'control';
    if (selectedAnalysisType === 'archetype') deckType = 'midrange';
    if (selectedAnalysisType === 'optimization') deckType = 'aggro';
    
    setDeckList(sampleDecks[deckType]);
  }, [selectedAnalysisType]);

  return (
    <div className={`ml-deck-analysis ${isAncientTheme ? 'ancient-theme' : ''}`}>
      <h2>ML Deck Analysis</h2>
      
      <div className="analysis-type-selector">
        <label>
          <input
            type="radio"
            value="archetype"
            checked={selectedAnalysisType === 'archetype'}
            onChange={() => setSelectedAnalysisType('archetype')}
          />
          Archetype Identification
        </label>
        
        <label>
          <input
            type="radio"
            value="optimization"
            checked={selectedAnalysisType === 'optimization'}
            onChange={() => setSelectedAnalysisType('optimization')}
          />
          Deck Optimization
        </label>
        
        <label>
          <input
            type="radio"
            value="prediction"
            checked={selectedAnalysisType === 'prediction'}
            onChange={() => setSelectedAnalysisType('prediction')}
          />
          Win Rate Prediction
        </label>
      </div>
      
      <div className="deck-input-section">
        <div className="textarea-container">
          <label htmlFor="deckList">Enter Deck List (Format: "2x Card Name")</label>
          <textarea
            id="deckList"
            value={deckList}
            onChange={(e) => setDeckList(e.target.value)}
            placeholder="Enter your deck list here..."
            rows={10}
          />
        </div>
        
        <div className="button-group">
          <button onClick={analyzeDeck} disabled={isAnalyzing || !deckList.trim()}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Deck'}
          </button>
          <button onClick={loadSampleDeck} className="sample-button">
            Load Sample Deck
          </button>
        </div>
      </div>
      
      {analysisResults && (
        <div className="analysis-results">
          <h3>Analysis Results</h3>
          
          <div className="basic-stats">
            <h4>Deck Statistics</h4>
            <p><strong>Total Cards:</strong> {analysisResults.basicStats.totalCards}</p>
            <p><strong>Average Cost:</strong> {analysisResults.basicStats.averageCost.toFixed(2)}</p>
            
            <div className="distribution-section">
              <div className="distribution">
                <h5>Card Types</h5>
                <ul>
                  {Object.entries(analysisResults.basicStats.typeDistribution).map(([type, count]) => (
                    <li key={type}>
                      <span>{type}:</span> {count} ({((count / analysisResults.basicStats.totalCards) * 100).toFixed(1)}%)
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="distribution">
                <h5>Mana Curve</h5>
                <div className="mana-curve">
                  {Object.entries(analysisResults.basicStats.costDistribution)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([cost, count]) => (
                      <div key={cost} className="mana-bar">
                        <div 
                          className="mana-bar-fill" 
                          style={{ 
                            height: `${Math.min((count / analysisResults.basicStats.totalCards) * 300, 100)}%` 
                          }}
                        ></div>
                        <div className="mana-cost">{cost}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
          
          {analysisResults.archetypeAnalysis && (
            <div className="archetype-analysis">
              <h4>Archetype Analysis</h4>
              <p><strong>Primary Archetype:</strong> {analysisResults.archetypeAnalysis.primaryArchetype}</p>
              <p><strong>Secondary Archetype:</strong> {analysisResults.archetypeAnalysis.secondaryArchetype}</p>
              <p><strong>Description:</strong> {analysisResults.archetypeAnalysis.archetypeDescription}</p>
              <p><strong>Estimated Win Rate:</strong> {(analysisResults.archetypeAnalysis.estimatedWinRate * 100).toFixed(1)}%</p>
              
              <div className="matchups">
                <div className="favorable">
                  <h5>Favorable Matchups</h5>
                  <ul>
                    {analysisResults.archetypeAnalysis.favorableMatchups.map(matchup => (
                      <li key={matchup}>{matchup}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="unfavorable">
                  <h5>Unfavorable Matchups</h5>
                  <ul>
                    {analysisResults.archetypeAnalysis.unfavorableMatchups.map(matchup => (
                      <li key={matchup}>{matchup}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="archetype-scores">
                <h5>Archetype Scores</h5>
                <div className="score-bars">
                  {Object.entries(analysisResults.archetypeAnalysis.archetypeScores).map(([archetype, score]) => (
                    <div key={archetype} className="score-bar-container">
                      <div className="score-label">{archetype}</div>
                      <div className="score-bar">
                        <div 
                          className="score-bar-fill" 
                          style={{ 
                            width: `${Math.min((score / Object.values(analysisResults.archetypeAnalysis.archetypeScores).reduce((a, b) => Math.max(a, b), 0)) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="score-value">{score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {analysisResults.optimizationAnalysis && (
            <div className="optimization-analysis">
              <h4>Optimization Analysis</h4>
              
              {analysisResults.optimizationAnalysis.suggestions.length > 0 ? (
                <>
                  <p>We've identified {analysisResults.optimizationAnalysis.suggestions.length} potential improvements for your deck:</p>
                  
                  <div className="suggestions">
                    {analysisResults.optimizationAnalysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="suggestion">
                        <div className="suggestion-header">
                          <span className="suggestion-type">{suggestion.type}</span>
                          <span className="suggestion-issue">{suggestion.issue}</span>
                        </div>
                        <div className="suggestion-body">
                          {suggestion.suggestion}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="no-suggestions">Your deck appears to be well-optimized! No significant issues were found.</p>
              )}
            </div>
          )}
          
          {analysisResults.predictionAnalysis && (
            <div className="prediction-analysis">
              <h4>Win Rate Prediction</h4>
              <p><strong>Deck Archetype:</strong> {analysisResults.predictionAnalysis.deckArchetype}</p>
              <p><strong>Overall Predicted Win Rate:</strong> {(analysisResults.predictionAnalysis.overallWinRate * 100).toFixed(1)}%</p>
              <p><strong>Prediction Confidence:</strong> {(analysisResults.predictionAnalysis.confidence * 100).toFixed(0)}%</p>
              
              <div className="matchup-predictions">
                <h5>Matchup Predictions</h5>
                
                {Object.entries(analysisResults.predictionAnalysis.predictedMatchups).map(([archetype, winRate]) => (
                  <div key={archetype} className="matchup-prediction">
                    <div className="matchup-name">{archetype}</div>
                    <div className="matchup-bar">
                      <div 
                        className={`matchup-bar-fill ${winRate > 0.5 ? 'favorable' : winRate < 0.5 ? 'unfavorable' : 'neutral'}`}
                        style={{ width: `${winRate * 100}%` }}
                      ></div>
                    </div>
                    <div className="matchup-rate">{(winRate * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        .ml-deck-analysis {
          padding: 20px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
        }
        
        .analysis-type-selector {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .analysis-type-selector label {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }
        
        .deck-input-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .textarea-container {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .textarea-container label {
          font-weight: bold;
        }
        
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#1a1914' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          font-family: monospace;
          resize: vertical;
        }
        
        .button-group {
          display: flex;
          gap: 10px;
        }
        
        button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        
        button:hover:not(:disabled) {
          background-color: ${isAncientTheme ? '#a89a6a' : '#535bf2'};
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .sample-button {
          background-color: ${isAncientTheme ? '#5d5d7a' : '#8a89cc'};
        }
        
        .sample-button:hover {
          background-color: ${isAncientTheme ? '#6e6e8c' : '#7676b3'};
        }
        
        .analysis-results {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
        }
        
        .distribution-section {
          display: flex;
          gap: 20px;
          margin-top: 15px;
          flex-wrap: wrap;
        }
        
        .distribution {
          flex: 1;
          min-width: 200px;
        }
        
        .mana-curve {
          display: flex;
          align-items: flex-end;
          height: 150px;
          gap: 5px;
          margin-top: 10px;
        }
        
        .mana-bar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }
        
        .mana-bar-fill {
          width: 80%;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          border-radius: 4px 4px 0 0;
        }
        
        .mana-cost {
          margin-top: 5px;
          font-weight: bold;
        }
        
        .matchups {
          display: flex;
          gap: 20px;
          margin-top: 15px;
          flex-wrap: wrap;
        }
        
        .favorable, .unfavorable {
          flex: 1;
          min-width: 200px;
        }
        
        .score-bars {
          margin-top: 10px;
        }
        
        .score-bar-container {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .score-label {
          width: 80px;
          font-weight: bold;
        }
        
        .score-bar {
          flex: 1;
          height: 20px;
          background-color: ${isAncientTheme ? '#3a3828' : '#e0e0e0'};
          border-radius: 4px;
          overflow: hidden;
        }
        
        .score-bar-fill {
          height: 100%;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
        }
        
        .score-value {
          width: 30px;
          text-align: right;
          margin-left: 10px;
        }
        
        .suggestions {
          margin-top: 15px;
        }
        
        .suggestion {
          margin-bottom: 15px;
          padding: 10px;
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          border-left: 4px solid ${isAncientTheme ? '#8a7e55' : '#646cff'};
        }
        
        .suggestion-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        
        .suggestion-type {
          font-weight: bold;
          color: ${isAncientTheme ? '#d4b86a' : '#646cff'};
        }
        
        .suggestion-issue {
          font-style: italic;
        }
        
        .no-suggestions {
          color: ${isAncientTheme ? '#8a7e55' : '#4caf50'};
          font-weight: bold;
        }
        
        .matchup-predictions {
          margin-top: 15px;
        }
        
        .matchup-prediction {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .matchup-name {
          width: 80px;
          font-weight: bold;
        }
        
        .matchup-bar {
          flex: 1;
          height: 20px;
          background-color: ${isAncientTheme ? '#3a3828' : '#e0e0e0'};
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        
        .matchup-bar:after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          background-color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          opacity: 0.5;
        }
        
        .matchup-bar-fill {
          height: 100%;
        }
        
        .matchup-bar-fill.favorable {
          background-color: ${isAncientTheme ? '#5d7a4e' : '#4caf50'};
        }
        
        .matchup-bar-fill.unfavorable {
          background-color: ${isAncientTheme ? '#7a4e4e' : '#f44336'};
        }
        
        .matchup-bar-fill.neutral {
          background-color: ${isAncientTheme ? '#7a7a4e' : '#ff9800'};
        }
        
        .matchup-rate {
          width: 50px;
          text-align: right;
          margin-left: 10px;
        }
        
        .ancient-theme h2, .ancient-theme h3, .ancient-theme h4, .ancient-theme h5 {
          font-family: 'Cinzel', serif;
          color: #d4b86a;
        }
      `}</style>
    </div>
  );
};

export default React.memo(MLDeckAnalysis);