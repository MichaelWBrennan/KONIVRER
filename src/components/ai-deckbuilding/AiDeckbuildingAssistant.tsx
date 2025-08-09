import React, { useState, useEffect } from 'react';
import { Card, Deck, User } from '../../types';

interface DeckSuggestion {
  cardId: string;
  cardName: string;
  synergy: number;
  confidenceScore: number;
  reasoning: string;
}

interface MetaAnalysis {
  format: string;
  dominantArchetypes: string[];
  emergingCards: Card[];
  skillBasedRecommendations: DeckSuggestion[];
  personalizedMeta: {
    playerSkillTier: string;
    recommendedArchetypes: string[];
    improvementSuggestions: string[];
  };
}

interface AiDeckbuildingAssistantProps {
  user: User;
  format: string;
  currentDeck?: Deck;
  onDeckOptimized?: (optimizedDeck: any) => void;
}

const AiDeckbuildingAssistant: React.FC<AiDeckbuildingAssistantProps> = ({
  user,
  format,
  currentDeck,
  onDeckOptimized,
}) => {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'meta' | 'optimize'>('suggestions');
  const [suggestions, setSuggestions] = useState<DeckSuggestion[]>([]);
  const [metaAnalysis, setMetaAnalysis] = useState<MetaAnalysis | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [playstyle, setPlaystyle] = useState<'aggressive' | 'midrange' | 'control' | 'combo'>('midrange');

  useEffect(() => {
    if (activeTab === 'suggestions') {
      loadSuggestions();
    } else if (activeTab === 'meta') {
      loadMetaAnalysis();
    }
  }, [activeTab, format, playstyle]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-deckbuilding/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ format, playstyle }),
      });
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetaAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ai-deckbuilding/meta-analysis/${format}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setMetaAnalysis(data);
    } catch (error) {
      console.error('Failed to load meta analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizeDeck = async () => {
    if (!currentDeck) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai-deckbuilding/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          format,
          currentDeckList: currentDeck.cards.map(c => c.id),
          playstyle,
        }),
      });
      const data = await response.json();
      setOptimizationResult(data);
      onDeckOptimized?.(data);
    } catch (error) {
      console.error('Failed to optimize deck:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-deckbuilding-assistant">
      <div className="assistant-header">
        <h2>🤖 AI Deckbuilding Assistant</h2>
        <div className="format-selector">
          <span>Format: <strong>{format}</strong></span>
        </div>
      </div>

      <div className="playstyle-selector">
        <label>Preferred Playstyle:</label>
        <div className="playstyle-buttons">
          {(['aggressive', 'midrange', 'control', 'combo'] as const).map(style => (
            <button
              key={style}
              className={`playstyle-btn ${playstyle === style ? 'active' : ''}`}
              onClick={() => setPlaystyle(style)}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="assistant-tabs">
        <button
          className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          💡 Smart Suggestions
        </button>
        <button
          className={`tab-btn ${activeTab === 'meta' ? 'active' : ''}`}
          onClick={() => setActiveTab('meta')}
        >
          📊 Meta Analysis
        </button>
        {currentDeck && (
          <button
            className={`tab-btn ${activeTab === 'optimize' ? 'active' : ''}`}
            onClick={() => setActiveTab('optimize')}
          >
            🔧 Deck Optimizer
          </button>
        )}
      </div>

      <div className="assistant-content">
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>AI analyzing data...</p>
          </div>
        )}

        {activeTab === 'suggestions' && !loading && (
          <div className="suggestions-panel">
            <h3>Personalized Card Suggestions</h3>
            {suggestions.length > 0 ? (
              <div className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-card">
                    <div className="suggestion-header">
                      <h4>{suggestion.cardName}</h4>
                      <div className="suggestion-metrics">
                        <span className="synergy-score">
                          Synergy: {Math.round(suggestion.synergy * 100)}%
                        </span>
                        <span className="confidence-score">
                          Confidence: {Math.round(suggestion.confidenceScore * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="suggestion-reasoning">{suggestion.reasoning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Loading personalized suggestions...</p>
            )}
          </div>
        )}

        {activeTab === 'meta' && metaAnalysis && !loading && (
          <div className="meta-panel">
            <h3>Meta Analysis for {format}</h3>
            
            <div className="skill-tier-info">
              <h4>Your Skill Tier: <span className="tier-badge">{metaAnalysis.personalizedMeta.playerSkillTier}</span></h4>
            </div>

            <div className="meta-section">
              <h4>🏆 Dominant Archetypes</h4>
              <div className="archetype-list">
                {metaAnalysis.dominantArchetypes.map(archetype => (
                  <span key={archetype} className="archetype-tag dominant">{archetype}</span>
                ))}
              </div>
            </div>

            <div className="meta-section">
              <h4>📈 Recommended for Your Skill Level</h4>
              <div className="archetype-list">
                {metaAnalysis.personalizedMeta.recommendedArchetypes.map(archetype => (
                  <span key={archetype} className="archetype-tag recommended">{archetype}</span>
                ))}
              </div>
            </div>

            <div className="meta-section">
              <h4>🚀 Emerging Cards</h4>
              <div className="emerging-cards">
                {metaAnalysis.emergingCards.slice(0, 5).map(card => (
                  <div key={card.id} className="emerging-card">
                    <span className="card-name">{card.name}</span>
                    <span className="emergence-indicator">📈</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="meta-section">
              <h4>💡 Improvement Suggestions</h4>
              <ul className="improvement-list">
                {metaAnalysis.personalizedMeta.improvementSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'optimize' && currentDeck && (
          <div className="optimize-panel">
            <h3>Deck Optimization</h3>
            <div className="current-deck-info">
              <h4>Current Deck: {currentDeck.name}</h4>
              <p>Cards: {currentDeck.cards?.length || 0}</p>
            </div>
            
            <button
              className="optimize-btn"
              onClick={optimizeDeck}
              disabled={loading}
            >
              {loading ? 'Optimizing...' : '🔧 Optimize Deck'}
            </button>

            {optimizationResult && (
              <div className="optimization-results">
                <h4>Optimization Results</h4>
                <div className="improvement-score">
                  Expected Win Rate Improvement: 
                  <span className="improvement-value">
                    +{optimizationResult.expectedWinRateImprovement.toFixed(1)}%
                  </span>
                </div>
                
                <div className="changes-section">
                  <h5>Suggested Changes:</h5>
                  {optimizationResult.changes.added.length > 0 && (
                    <div className="added-cards">
                      <h6>Add:</h6>
                      {optimizationResult.changes.added.map((card, index) => (
                        <div key={index} className="change-card add">
                          + {card.cardName}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {optimizationResult.changes.removed.length > 0 && (
                    <div className="removed-cards">
                      <h6>Remove:</h6>
                      {optimizationResult.changes.removed.map((cardName, index) => (
                        <div key={index} className="change-card remove">
                          - {cardName}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="reasoning">
                    <h6>Reasoning:</h6>
                    <p>{optimizationResult.changes.reasoning}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .ai-deckbuilding-assistant {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .assistant-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .assistant-header h2 {
          margin: 0;
          font-size: 24px;
          background: linear-gradient(135deg, #00d4ff, #5b73ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .format-selector {
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
        }

        .playstyle-selector {
          margin-bottom: 20px;
        }

        .playstyle-selector label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #b0b0b0;
        }

        .playstyle-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .playstyle-btn {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .playstyle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .playstyle-btn.active {
          background: linear-gradient(135deg, #00d4ff, #5b73ff);
          border-color: #00d4ff;
        }

        .assistant-tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab-btn {
          padding: 12px 20px;
          background: none;
          border: none;
          color: #b0b0b0;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          color: white;
        }

        .tab-btn.active {
          color: #00d4ff;
          border-bottom-color: #00d4ff;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 212, 255, 0.3);
          border-top: 4px solid #00d4ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .suggestions-list {
          display: grid;
          gap: 16px;
        }

        .suggestion-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .suggestion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .suggestion-header h4 {
          margin: 0;
          color: #00d4ff;
        }

        .suggestion-metrics {
          display: flex;
          gap: 12px;
          font-size: 12px;
        }

        .synergy-score, .confidence-score {
          background: rgba(0, 212, 255, 0.2);
          padding: 4px 8px;
          border-radius: 12px;
          color: #00d4ff;
        }

        .suggestion-reasoning {
          margin: 0;
          color: #e0e0e0;
          font-size: 14px;
          line-height: 1.5;
        }

        .skill-tier-info {
          margin-bottom: 24px;
          text-align: center;
        }

        .tier-badge {
          background: linear-gradient(135deg, #00d4ff, #5b73ff);
          padding: 6px 12px;
          border-radius: 16px;
          font-weight: bold;
          text-transform: capitalize;
        }

        .meta-section {
          margin-bottom: 24px;
        }

        .meta-section h4 {
          margin-bottom: 12px;
          color: #00d4ff;
        }

        .archetype-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .archetype-tag {
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
        }

        .archetype-tag.dominant {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        }

        .archetype-tag.recommended {
          background: linear-gradient(135deg, #00d4ff, #5b73ff);
        }

        .emerging-cards {
          display: grid;
          gap: 8px;
        }

        .emerging-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .improvement-list {
          color: #e0e0e0;
          line-height: 1.6;
        }

        .optimize-btn {
          background: linear-gradient(135deg, #00d4ff, #5b73ff);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          margin-bottom: 20px;
          transition: transform 0.2s ease;
        }

        .optimize-btn:hover {
          transform: translateY(-2px);
        }

        .optimize-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .improvement-score {
          text-align: center;
          font-size: 18px;
          margin-bottom: 20px;
        }

        .improvement-value {
          color: #4ecdc4;
          font-weight: bold;
          font-size: 24px;
        }

        .changes-section h5, .changes-section h6 {
          color: #00d4ff;
          margin-bottom: 8px;
        }

        .change-card {
          padding: 6px 12px;
          margin-bottom: 4px;
          border-radius: 6px;
          font-family: monospace;
        }

        .change-card.add {
          background: rgba(76, 175, 80, 0.2);
          color: #81c784;
        }

        .change-card.remove {
          background: rgba(244, 67, 54, 0.2);
          color: #ef5350;
        }

        .reasoning {
          margin-top: 16px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .reasoning p {
          margin: 0;
          color: #e0e0e0;
          line-height: 1.5;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .ai-deckbuilding-assistant {
            padding: 16px;
          }

          .assistant-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .assistant-tabs {
            flex-direction: column;
            gap: 8px;
          }

          .tab-btn {
            padding: 8px 12px;
            text-align: left;
            border-bottom: none;
            border-left: 2px solid transparent;
          }

          .tab-btn.active {
            border-left-color: #00d4ff;
            border-bottom-color: transparent;
          }

          .suggestion-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .suggestion-metrics {
            flex-wrap: wrap;
          }

          .playstyle-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AiDeckbuildingAssistant;